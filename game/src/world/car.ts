import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import fineUrl from '../assets/car.glb?url';
import liteUrl from '../assets/car-lite.glb?url';

export interface CarStyle { paint: number; accent: number; underglow?: number }

interface Part { geometry: THREE.BufferGeometry; matrix: THREE.Matrix4; role: string; ao: THREE.Texture | null }

/** Las piezas del modelo, cargadas una vez y compartidas por todos los autos. */
export interface CarKit { body: Part[]; wheel: Part[]; hub: THREE.Vector3 }

/** Cuánto más atrás va el eje trasero respecto del delantero. */
const WHEELBASE = 2.8;

/** Carga el modelo completo o, con [fine] en falso, el liviano que apunta al proyector. */
export async function loadCarKit(fine: boolean): Promise<CarKit> {
  const gltf = await new GLTFLoader().loadAsync(fine ? fineUrl : liteUrl);
  gltf.scene.updateMatrixWorld(true);
  const body: Part[] = [], wheel: Part[] = [];
  const tyre = new THREE.Box3();
  gltf.scene.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (!mesh.isMesh) return;
    const source = mesh.material as THREE.MeshStandardMaterial;
    const part: Part = { geometry: mesh.geometry, matrix: mesh.matrixWorld.clone(), role: source.name, ao: source.aoMap };
    if (part.role === 'rim' || part.role === 'tyre') wheel.push(part); else body.push(part);
    if (part.role === 'tyre') tyre.setFromObject(mesh);
  });
  const hub = tyre.getCenter(new THREE.Vector3());
  // La rueda queda centrada en su eje para poder girarla y repetirla en las cuatro esquinas.
  const recenter = new THREE.Matrix4().makeTranslation(-hub.x, -hub.y, -hub.z);
  wheel.forEach((part) => part.matrix.premultiply(recenter));
  return { body, wheel, hub };
}

let glowTexture: THREE.Texture | null = null;

export function glow(): THREE.Texture {
  if (glowTexture) return glowTexture;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(255,255,255,.45)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  glowTexture = new THREE.CanvasTexture(c);
  return glowTexture;
}

export function halo(color: number, size: number, opacity = 1): THREE.Sprite {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow(), color, blending: THREE.AdditiveBlending, depthWrite: false, opacity, fog: false }));
  s.scale.setScalar(size);
  return s;
}

/**
 * El brillo de los autos en el proyector: una esfera pulida fotografiada una vez con el entorno real de la pista.
 * Cada auto lee de esa foto según hacia dónde mira su chapa, en lugar de calcular el reflejo en cada píxel.
 */
export function bakeMatcap(renderer: THREE.WebGLRenderer, surroundings: THREE.Texture, night: boolean): THREE.Texture {
  const size = 256;
  const target = new THREE.WebGLRenderTarget(size, size, { type: THREE.HalfFloatType, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
  const stage = new THREE.Scene();
  stage.environment = surroundings;
  const ball = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 24), new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.45, roughness: 0.34, clearcoat: 1, clearcoatRoughness: 0.06 }));
  stage.add(ball);
  // Además del entorno, una luz de estudio: sin ella, de noche la pintura queda negra y no se sabe de quién es cada auto.
  stage.add(new THREE.HemisphereLight(0xffffff, 0x50505c, night ? 2.4 : 0.9));
  const key = new THREE.DirectionalLight(0xffffff, night ? 2.6 : 1.4);
  key.position.set(0.4, 1, -0.5);
  stage.add(key);
  const lens = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  // La foto se toma como mira la cámara de carrera: desde atrás y un poco de arriba.
  lens.position.set(0, 1.2, -3).normalize().multiplyScalar(3);
  lens.lookAt(0, 0, 0);
  const before = renderer.getRenderTarget();
  renderer.setRenderTarget(target);
  renderer.render(stage, lens);
  renderer.setRenderTarget(before);
  ball.geometry.dispose();
  (ball.material as THREE.Material).dispose();
  return target.texture;
}

const shared = new Map<string, THREE.Material>();

/** Los materiales que no cambian de un auto a otro se crean una sola vez. */
function common(role: string, ao: THREE.Texture | null): THREE.Material {
  let material = shared.get(role);
  if (material) return material;
  const lit = (color: number, metalness: number, roughness: number, envMapIntensity = 1) =>
    new THREE.MeshStandardMaterial({ color, metalness, roughness, envMapIntensity, aoMap: ao });
  // Las luces pasan de 1 a propósito: es lo que hace que el resplandor las encuentre.
  const lamp = (color: number, gain: number) => new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(gain), fog: false });
  switch (role) {
    case 'trim': material = lit(0x0d0d0e, 0.7, 0.32, 1.2); break;
    case 'glass': material = lit(0x040506, 1, 0.06, 1.5); break;
    case 'rim': material = lit(0x8f9399, 1, 0.28, 1.3); break;
    case 'tyre': material = lit(0x0b0b0b, 0, 0.85); break;
    case 'tail': material = lamp(0xff1a0a, 8); break;
    case 'head': material = lamp(0xfff0d8, 4); break;
    case 'signal': material = lit(0x3a1400, 0, 0.3); break;
    default: material = lit(0x161616, 0.3, 0.6);
  }
  shared.set(role, material);
  return material;
}

/** Un auto listo para la pista: mira hacia +Z y apoya las ruedas en y = 0. */
export function buildCar(kit: CarKit, style: CarStyle, fine: boolean, night: boolean, fleet = false): THREE.Group {
  const car = new THREE.Group();
  const ao = kit.body.find((part) => part.role === 'paint')?.ao ?? null;
  const paint = fine
    ? new THREE.MeshPhysicalMaterial({ color: style.paint, metalness: 0.4, roughness: 0.5, clearcoat: 1, clearcoatRoughness: 0.05, aoMap: ao, envMapIntensity: 1.0 })
    : new THREE.MeshStandardMaterial({ color: style.paint, metalness: 0.5, roughness: 0.3, aoMap: ao, envMapIntensity: 1.0 });
  const caliper = new THREE.MeshStandardMaterial({ color: style.accent, metalness: 0.3, roughness: 0.5 });
  const pick = (part: Part) => (part.role === 'paint' ? paint : part.role === 'caliper' ? caliper : common(part.role, part.ao));
  const mesh = (part: Part) => {
    const m = new THREE.Mesh(part.geometry, pick(part));
    part.matrix.decompose(m.position, m.quaternion, m.scale);
    m.castShadow = part.role !== 'glass';
    return m;
  };
  // La carrocería va en su propio grupo: se inclina en las curvas sin arrastrar la sombra del piso.
  const body = new THREE.Group();
  car.add(body);
  // Las luces de freno son de cada auto: se encienden más cuando ese auto frena.
  const tail = (common('tail', null) as THREE.MeshBasicMaterial).clone();
  // Con flota, el auto es solo su esqueleto: lo que se mueve. La chapa la dibuja la flota, todos los autos juntos.
  if (!fleet) kit.body.forEach((part) => {
    const m = mesh(part);
    if (part.role === 'tail') m.material = tail;
    body.add(m);
  });

  const wheels: THREE.Object3D[] = [];
  for (const side of [1, -1]) for (const z of [kit.hub.z, kit.hub.z - WHEELBASE]) {
    const mount = new THREE.Group(), spin = new THREE.Group();
    mount.position.set(kit.hub.x * side, kit.hub.y, z);
    mount.rotation.y = side > 0 ? 0 : Math.PI;
    spin.userData.dir = side;
    if (!fleet) kit.wheel.forEach((part) => spin.add(mesh(part)));
    mount.add(spin);
    mount.userData.rest = mount.rotation.y;
    body.add(mount);
    wheels.push(spin);
  }
  // La llama del nitro: dos conos que solo se ven mientras empuja.
  const flame = new THREE.Group();
  const fire = new THREE.MeshBasicMaterial({ color: new THREE.Color(style.underglow ?? 0x6ad0ff).multiplyScalar(4), transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
  for (const x of [-0.42, 0.42]) flame.add(new THREE.Mesh(new THREE.ConeGeometry(0.17, 2.4, 8, 1, true).rotateX(-Math.PI / 2).translate(x, 0.42, kit.hub.z - WHEELBASE - 1.75), fire));
  flame.visible = false;
  body.add(flame);
  car.userData = { wheels, body, flame, tail, paint, caliper, fire, style, braking: false, front: wheels.slice(0, 1).concat(wheels.slice(2, 3)).map((w) => w.parent!) };
  if (fleet) return car;

  const flat = (w: number, l: number, color: number, opacity: number, additive: boolean) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, l), new THREE.MeshBasicMaterial({
      map: glow(), color, transparent: true, opacity, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    }));
    m.rotation.x = -Math.PI / 2;
    return m;
  };
  // Sombra de contacto: una mancha bajo el auto que no depende del mapa de sombras.
  const shadow = flat(3.3, 6.2, 0x000000, 0.8, false);
  shadow.position.set(0, 0.02, -0.1);
  car.add(shadow);
  // De noche, el charco de luz de los faros sobre el asfalto.
  if (night) {
    const beam = flat(4.6, 11, 0xffe2b0, 0.28, true);
    beam.position.set(0, 0.05, 7.2);
    car.add(beam);
  }
  if (style.underglow !== undefined) {
    const under = flat(5.8, 9, style.underglow, 0.9, true);
    under.position.y = 0.045;
    car.add(under);
    car.userData.under = under.material;
  }
  return car;
}

/** Cambia la pintura de un auto ya armado: elegir otro no rehace el modelo. */
export function repaint(car: THREE.Group, style: CarStyle): void {
  const { paint, caliper, fire, under } = car.userData as { paint: THREE.MeshStandardMaterial; caliper: THREE.MeshStandardMaterial; fire: THREE.MeshBasicMaterial; under?: THREE.MeshBasicMaterial };
  car.userData.style = style;
  paint.color.set(style.paint);
  caliper.color.set(style.accent);
  fire.color.set(style.underglow ?? 0x6ad0ff).multiplyScalar(4);
  if (style.underglow !== undefined) under?.color.set(style.underglow);
}

export interface Pose { metres: number; steer: number; speed: number; boosting: boolean; braking: boolean; time: number }

/** Lleva al modelo lo que hace el auto: ruedas, volante, inclinación, luces de freno y llama. */
export function animate(car: THREE.Group, pose: Pose): void {
  const { wheels, body, flame, tail, front } = car.userData as { wheels: THREE.Object3D[]; body: THREE.Group; flame: THREE.Group; tail: THREE.MeshBasicMaterial; front: THREE.Object3D[] };
  for (const wheel of wheels) wheel.rotation.x = (pose.metres / 0.38) * wheel.userData.dir;
  for (const mount of front) mount.rotation.y = mount.userData.rest + pose.steer * 0.32;
  // El auto se acuesta hacia afuera en la curva, levanta la trompa con el nitro y la clava al frenar.
  body.rotation.z = -pose.steer * Math.min(1, pose.speed / 50) * 0.055;
  body.rotation.x += ((pose.braking ? 0.022 : pose.boosting ? -0.02 : 0) - body.rotation.x) * 0.15;
  tail.color.setRGB(1, 0.1, 0.04).multiplyScalar(pose.braking ? 14 : 5);
  car.userData.braking = pose.braking;
  flame.visible = pose.boosting;
  if (pose.boosting) flame.scale.set(1, 1, 0.8 + 0.35 * Math.sin(pose.time * 61) + 0.2 * Math.sin(pose.time * 37));
}

/** Lee la oclusión de una textura en un punto, para dejarla escrita en los vértices. */
function occlusion(texture: THREE.Texture): (u: number, v: number) => number {
  const size = 256, canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(texture.image as CanvasImageSource, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;
  const wrap = (t: number) => Math.min(size - 1, Math.floor((t - Math.floor(t)) * size));
  return (u, v) => data[(wrap(texture.flipY ? 1 - v : v) * size + wrap(u)) * 4] / 255;
}

/** El color de cada pieza cuando todas comparten material: va escrito en los vértices. */
const TINT: Record<string, THREE.Color> = {
  paint: new THREE.Color(0xffffff), trim: new THREE.Color(0x2c2c2f), glass: new THREE.Color(0x2b3037), rim: new THREE.Color(0xb0b3b8), tyre: new THREE.Color(0x121212),
  signal: new THREE.Color(0x5a2000), caliper: new THREE.Color(0x4a4c50), head: new THREE.Color(0xfff0d8).multiplyScalar(3), tail: new THREE.Color(0xffffff), dark: new THREE.Color(0x191919),
};

/** Suelda varias piezas en una sola malla, ya ubicadas, con el color y la oclusión en los vértices. */
function weld(parts: Part[]): THREE.BufferGeometry {
  let total = 0, corners = 0;
  for (const part of parts) {
    total += part.geometry.attributes.position.count;
    corners += part.geometry.index ? part.geometry.index.count : part.geometry.attributes.position.count;
  }
  const position = new Float32Array(total * 3), normal = new Float32Array(total * 3), color = new Float32Array(total * 3);
  const index = total > 65535 ? new Uint32Array(corners) : new Uint16Array(corners);
  const v = new THREE.Vector3(), turn = new THREE.Matrix3(), readers = new Map<THREE.Texture, (u: number, v: number) => number>();
  let base = 0, corner = 0;
  for (const part of parts) {
    const { position: from, normal: facing } = part.geometry.attributes;
    const uv = part.ao ? part.geometry.attributes[part.ao.channel ? `uv${part.ao.channel}` : 'uv'] : undefined;
    let read: ((u: number, v: number) => number) | undefined;
    if (part.ao && uv) {
      read = readers.get(part.ao);
      if (!read) readers.set(part.ao, (read = occlusion(part.ao)));
    }
    const tint = TINT[part.role] ?? TINT.dark;
    turn.getNormalMatrix(part.matrix);
    for (let i = 0; i < from.count; i++) {
      const o = (base + i) * 3;
      v.fromBufferAttribute(from, i).applyMatrix4(part.matrix).toArray(position, o);
      v.fromBufferAttribute(facing, i).applyMatrix3(turn).normalize().toArray(normal, o);
      // La oclusión se suaviza: escrita entera en pocos vértices, mancha.
      const k = read ? 0.35 + 0.65 * read(uv!.getX(i), uv!.getY(i)) : 1;
      color[o] = tint.r * k;
      color[o + 1] = tint.g * k;
      color[o + 2] = tint.b * k;
    }
    const source = part.geometry.index;
    const count = source ? source.count : from.count;
    for (let j = 0; j < count; j++) index[corner++] = base + (source ? source.getX(j) : j);
    base += from.count;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(normal, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(color, 3));
  geometry.setIndex(new THREE.BufferAttribute(index, 1));
  return geometry;
}

const IDLE = new THREE.Color(0.5, 0.02, 0.012), BRAKING = new THREE.Color(1, 0.2, 0.08), OFF = new THREE.Color(0, 0, 0);

/**
 * Todos los autos del proyector, dibujados juntos. Cada auto separado son unas veinte órdenes de dibujo, y con seis
 * autos eso es lo que frena al equipo; acá la chapa de todos sale en una orden, las ruedas de todos en otra, y así.
 */
export class Fleet {
  readonly group = new THREE.Group();
  private readonly paint: THREE.InstancedMesh;
  private readonly rest: THREE.InstancedMesh;
  private readonly tail: THREE.InstancedMesh;
  private readonly wheels: THREE.InstancedMesh;
  private readonly flats: THREE.InstancedMesh[] = [];
  private readonly under: THREE.InstancedMesh | null = null;
  private readonly tint = new THREE.Color();

  private readonly capacity: number;

  constructor(kit: CarKit, matcap: THREE.Texture, night: boolean, underglow: boolean, capacity: number) {
    this.capacity = capacity;
    const shiny = () => new THREE.MeshMatcapMaterial({ matcap, vertexColors: true });
    const of = (role: (r: string) => boolean) => weld(kit.body.filter((part) => role(part.role)));
    this.paint = new THREE.InstancedMesh(of((r) => r === 'paint'), shiny(), capacity);
    this.rest = new THREE.InstancedMesh(of((r) => r !== 'paint' && r !== 'tail'), shiny(), capacity);
    this.tail = new THREE.InstancedMesh(of((r) => r === 'tail'), new THREE.MeshBasicMaterial({ fog: false }), capacity);
    this.wheels = new THREE.InstancedMesh(weld(kit.wheel), shiny(), capacity * 4);
    // Las piezas de un mismo auto se mueven igual: comparten la tabla de posiciones.
    this.rest.instanceMatrix = this.tail.instanceMatrix = this.paint.instanceMatrix;

    const flat = (w: number, l: number, y: number, z: number, opacity: number, additive: boolean, color = 0xffffff) => {
      const mesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(w, l).rotateX(-Math.PI / 2).translate(0, y, z), new THREE.MeshBasicMaterial({
        map: glow(), color, transparent: true, opacity, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      }), capacity);
      if (this.flats.length) mesh.instanceMatrix = this.flats[0].instanceMatrix;
      // Van pegadas al piso: se dibujan antes que el humo y las chispas.
      mesh.renderOrder = -1;
      this.flats.push(mesh);
      return mesh;
    };
    flat(3.3, 6.2, 0.02, -0.1, 0.8, false, 0x000000);
    if (night) flat(4.6, 11, 0.05, 7.2, 0.28, true, 0xffe2b0);
    if (underglow) this.under = flat(5.8, 9, 0.045, 0, 0.9, true);

    for (const mesh of [this.paint, this.rest, this.tail, this.wheels, ...this.flats]) {
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      // Los autos están repartidos por toda la pista: no hay una caja que sirva para descartarlos juntos.
      mesh.frustumCulled = false;
      mesh.count = 0;
      this.group.add(mesh);
    }
  }

  /** Copia a la flota dónde quedó cada auto este cuadro, con su pintura y sus luces. */
  sync(cars: THREE.Group[]): void {
    const n = Math.min(cars.length, this.capacity);
    for (let i = 0; i < n; i++) {
      const car = cars[i];
      const { body, wheels, style, braking } = car.userData as { body: THREE.Group; wheels: THREE.Object3D[]; style: CarStyle; braking: boolean };
      car.updateMatrixWorld(true);
      this.paint.setMatrixAt(i, body.matrixWorld);
      this.flats[0].setMatrixAt(i, car.matrixWorld);
      for (let w = 0; w < 4; w++) this.wheels.setMatrixAt(i * 4 + w, wheels[w].matrixWorld);
      this.paint.setColorAt(i, this.tint.set(style.paint));
      this.tail.setColorAt(i, braking ? BRAKING : IDLE);
      this.under?.setColorAt(i, style.underglow === undefined ? OFF : this.tint.set(style.underglow));
    }
    for (const mesh of [this.paint, this.rest, this.tail, ...this.flats]) mesh.count = n;
    this.wheels.count = n * 4;
    this.paint.instanceMatrix.needsUpdate = this.wheels.instanceMatrix.needsUpdate = this.flats[0].instanceMatrix.needsUpdate = true;
    for (const mesh of [this.paint, this.tail, this.under]) if (mesh?.instanceColor) mesh.instanceColor.needsUpdate = true;
  }
}
