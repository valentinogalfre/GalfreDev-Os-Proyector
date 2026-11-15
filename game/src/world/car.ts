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
export function bakeMatcap(renderer: THREE.WebGLRenderer, surroundings: THREE.Texture): THREE.Texture {
  const size = 256;
  const target = new THREE.WebGLRenderTarget(size, size, { type: THREE.HalfFloatType, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
  const stage = new THREE.Scene();
  stage.environment = surroundings;
  const ball = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 24), new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.45, roughness: 0.34, clearcoat: 1, clearcoatRoughness: 0.06 }));
  stage.add(ball);
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
function common(role: string, ao: THREE.Texture | null, matcap: THREE.Texture | null): THREE.Material {
  let material = shared.get(role);
  if (material) return material;
  // Con la foto del entorno, lo pulido la usa y lo opaco queda difuso; ninguno calcula reflejos.
  const lit = (color: number, metalness: number, roughness: number, envMapIntensity = 1): THREE.Material =>
    !matcap ? new THREE.MeshStandardMaterial({ color, metalness, roughness, envMapIntensity, aoMap: ao })
      : roughness < 0.4 ? new THREE.MeshMatcapMaterial({ color: role === 'glass' ? 0x2b3037 : new THREE.Color(color).lerp(new THREE.Color(0xffffff), metalness * 0.35), matcap })
        : new THREE.MeshLambertMaterial({ color, aoMap: ao });
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
export function buildCar(kit: CarKit, style: CarStyle, fine: boolean, night: boolean, matcap: THREE.Texture | null = null): THREE.Group {
  const car = new THREE.Group();
  const ao = kit.body.find((part) => part.role === 'paint')?.ao ?? null;
  const paint = fine
    ? new THREE.MeshPhysicalMaterial({ color: style.paint, metalness: 0.4, roughness: 0.5, clearcoat: 1, clearcoatRoughness: 0.05, aoMap: ao, envMapIntensity: 1.0 })
    : matcap ? new THREE.MeshMatcapMaterial({ color: style.paint, matcap })
      : new THREE.MeshStandardMaterial({ color: style.paint, metalness: 0.5, roughness: 0.3, aoMap: ao, envMapIntensity: 1.0 });
  const caliper = matcap ? new THREE.MeshLambertMaterial({ color: style.accent }) : new THREE.MeshStandardMaterial({ color: style.accent, metalness: 0.3, roughness: 0.5 });
  const pick = (part: Part) => (part.role === 'paint' ? paint : part.role === 'caliper' ? caliper : common(part.role, part.ao, matcap));
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
  const tail = (common('tail', null, matcap) as THREE.MeshBasicMaterial).clone();
  kit.body.forEach((part) => {
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
    kit.wheel.forEach((part) => spin.add(mesh(part)));
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
  car.userData = { wheels, body, flame, tail, paint, caliper, fire, front: wheels.slice(0, 1).concat(wheels.slice(2, 3)).map((w) => w.parent!) };

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
  const { paint, caliper, fire, under } = car.userData as { paint: THREE.MeshMatcapMaterial; caliper: THREE.MeshLambertMaterial; fire: THREE.MeshBasicMaterial; under?: THREE.MeshBasicMaterial };
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
  flame.visible = pose.boosting;
  if (pose.boosting) flame.scale.set(1, 1, 0.8 + 0.35 * Math.sin(pose.time * 61) + 0.2 * Math.sin(pose.time * 37));
}
