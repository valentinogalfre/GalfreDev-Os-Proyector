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
    default: material = lit(0x080808, 0.1, 0.8);
  }
  shared.set(role, material);
  return material;
}

/** Un auto listo para la pista: mira hacia +Z y apoya las ruedas en y = 0. */
export function buildCar(kit: CarKit, style: CarStyle, fine: boolean, night: boolean): THREE.Group {
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
  kit.body.forEach((part) => car.add(mesh(part)));

  const wheels: THREE.Object3D[] = [];
  for (const side of [1, -1]) for (const z of [kit.hub.z, kit.hub.z - WHEELBASE]) {
    const mount = new THREE.Group(), spin = new THREE.Group();
    mount.position.set(kit.hub.x * side, kit.hub.y, z);
    mount.rotation.y = side > 0 ? 0 : Math.PI;
    spin.userData.dir = side;
    kit.wheel.forEach((part) => spin.add(mesh(part)));
    mount.add(spin);
    car.add(mount);
    wheels.push(spin);
  }
  car.userData.wheels = wheels;

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
  }
  return car;
}

/** Hace girar las ruedas según lo recorrido. */
export function roll(car: THREE.Group, metres: number): void {
  for (const wheel of car.userData.wheels as THREE.Object3D[]) wheel.rotation.x = (metres / 0.38) * wheel.userData.dir;
}
