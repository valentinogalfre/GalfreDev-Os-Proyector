import * as THREE from 'three';
import { fbm } from './noise';
import type { Track } from './track';

export interface SkyLook {
  top: number;
  horizon: number;
  ground: number;
  sun?: THREE.Vector3;
  sunColor?: number;
  /** Cuánto se abre el resplandor del horizonte hacia arriba: más chico, más alto. */
  curve?: number;
  /** Nubes: color a la sombra, color encendido y cuánto cielo cubren (0 a 1). */
  clouds?: { dark: number; lit: number; cover: number };
}

/**
 * El cielo se pinta una sola vez en una textura al cargar. Dibujarlo después es leer esa
 * textura, que es lo más barato que hay para algo que ocupa media pantalla.
 */
export function skyDome(look: SkyLook): THREE.Mesh {
  const W = 1024, H = 512;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const g = canvas.getContext('2d')!;
  const img = g.createImageData(W, H);
  const top = new THREE.Color(look.top), horizon = new THREE.Color(look.horizon), low = new THREE.Color(look.ground);
  const sunColor = new THREE.Color(look.sunColor ?? 0x000000);
  const sun = (look.sun ?? new THREE.Vector3(0, -1, 0)).clone().normalize();
  const dark = new THREE.Color(look.clouds?.dark ?? 0), lit = new THREE.Color(look.clouds?.lit ?? 0);
  const curve = look.curve ?? 0.45;
  const c = new THREE.Color(), cloud = new THREE.Color();
  for (let py = 0; py < H; py++) {
    const theta = (py / (H - 1)) * Math.PI;
    const y = Math.cos(theta), r = Math.sin(theta);
    for (let px = 0; px < W; px++) {
      const a = (px / W) * Math.PI * 2;
      const x = -r * Math.cos(a), z = r * Math.sin(a);
      if (y > 0) c.copy(horizon).lerp(top, Math.pow(y, curve)); else c.copy(horizon).lerp(low, Math.min(1, -y * 6));
      const s = Math.max(0, x * sun.x + y * sun.y + z * sun.z);
      if (look.clouds && y > 0) {
        // Una capa plana de nubes vista en perspectiva: se estira sola hacia el horizonte.
        const k = 1 / (y + 0.09);
        const n = fbm(x * k * 0.55 + 3, z * k * 1.5 + 7, 5, 17);
        const cover = smooth(1 - look.clouds.cover, 1.2 - look.clouds.cover, n * 1.35) * smooth(0.015, 0.1, y) * (1 - smooth(0.3, 0.75, y));
        const glow = Math.min(1, Math.pow(s, 3) * 1.25 + Math.pow(1 - y, 5) * 0.4);
        cloud.copy(dark).lerp(lit, glow * (0.55 + 0.45 * smooth(0.45, 0.8, n)));
        c.lerp(cloud, cover * 0.92);
      }
      const flare = smooth(0.99925, 0.9996, s) * 2 + Math.pow(s, 300) * 0.8 + Math.pow(s, 28) * 0.38 + Math.pow(s, 5) * 0.16;
      const dither = (Math.random() - 0.5) / 128;
      const i = (py * W + px) * 4;
      img.data[i] = (c.r + sunColor.r * flare + dither) * 255;
      img.data[i + 1] = (c.g + sunColor.g * flare + dither) * 255;
      img.data[i + 2] = (c.b + sunColor.b * flare + dither) * 255;
      img.data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(1500, 48, 24),
    new THREE.MeshBasicMaterial({ map, side: THREE.BackSide, depthWrite: false, fog: false, toneMapped: false }),
  );
  mesh.name = 'sky';
  mesh.frustumCulled = false;
  if (look.sun) mesh.userData.sun = { dir: sun, color: sunColor };
  return mesh;
}

/** La escena de la que salen los reflejos: el mismo cielo, con el sol encendido de verdad. */
export function envFrom(sky: THREE.Mesh, lamps: [number, number, number, number, number][] = []): THREE.Scene {
  const env = new THREE.Scene();
  env.add(new THREE.Mesh(sky.geometry, sky.material));
  const sun = sky.userData.sun as { dir: THREE.Vector3; color: THREE.Color } | undefined;
  if (sun) {
    const ball = new THREE.Mesh(new THREE.SphereGeometry(70, 12, 8), new THREE.MeshBasicMaterial({ color: sun.color.clone().multiplyScalar(40) }));
    ball.position.copy(sun.dir).multiplyScalar(1200);
    env.add(ball);
  }
  for (const [color, x, y, z, size] of lamps) {
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(Math.abs(x) > Math.abs(z) ? 6 : size, 8, Math.abs(x) > Math.abs(z) ? size : 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(5) }));
    lamp.position.set(x, y, z);
    env.add(lamp);
  }
  return env;
}

function smooth(a: number, b: number, v: number): number {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/** La pista corre sobre un terraplén: el suelo queda esto por debajo y nunca la atraviesa. */
export const DROP = 3.4;

export interface Ground { mesh: THREE.Mesh; heightAt(x: number, z: number): number; distanceAt(x: number, z: number): number }

export interface GroundLook {
  center: [number, number];
  size: number;
  segments: number;
  /** Altura máxima del relieve y a qué distancia de la pista empieza. */
  relief: number;
  flat: number;
  scale: number;
  seed: number;
  material: THREE.Material;
  color?: (height: number, x: number, z: number) => THREE.Color;
}

/** El suelo acompaña la altura de la pista y se levanta al alejarse de ella. */
export function ground(track: Track, look: GroundLook): Ground {
  const sample = (x: number, z: number): [number, number] => {
    let sum = 0, weight = 0, best = Infinity;
    for (let i = 0; i < track.n; i += 2) {
      const p = track.pos[i];
      const d2 = (p.x - x) * (p.x - x) + (p.z - z) * (p.z - z);
      const w = 1 / ((d2 + 4) * (d2 + 4));
      sum += w * p.y;
      weight += w;
      if (d2 < best) best = d2;
    }
    return [sum / weight, Math.sqrt(best)];
  };
  const heightAt = (x: number, z: number): number => {
    const [y, dist] = sample(x, z);
    const rise = smooth(look.flat, look.flat + 140, dist);
    const hills = fbm(x * look.scale, z * look.scale, 5, look.seed);
    return y - DROP + look.relief * rise * Math.pow(hills, 1.6) * 2.2;
  };
  const g = new THREE.PlaneGeometry(look.size, look.size, look.segments, look.segments).rotateX(-Math.PI / 2);
  g.translate(look.center[0], 0, look.center[1]);
  const p = g.attributes.position as THREE.BufferAttribute;
  const colors = look.color ? new Float32Array(p.count * 3) : null;
  const uv = g.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i);
    const y = heightAt(x, z);
    p.setY(i, y);
    uv.setXY(i, x / 50, z / 50);
    if (colors && look.color) look.color(y, x, z).toArray(colors, i * 3);
  }
  if (colors) g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return { mesh: new THREE.Mesh(g, look.material), heightAt, distanceAt: (x, z) => sample(x, z)[1] };
}

export interface RidgeLook {
  center: [number, number];
  radius: number;
  height: number;
  base: number;
  seed: number;
  /** La ladera pintada; se repite [repeat] veces alrededor. */
  map: THREE.Texture;
  repeat: number;
  jagged: number;
  shade: number;
}

/** Un cordón de cerros alrededor del mundo. Los estratos van en la textura y las quebradas en el relieve. */
export function ridge(look: RidgeLook): THREE.Mesh {
  const around = 720, rows = 10;
  const p: number[] = [], c: number[] = [], uv: number[] = [], index: number[] = [];
  const j = look.jagged;
  for (let i = 0; i <= around; i++) {
    const a = (i / around) * Math.PI * 2;
    const cx = Math.cos(a), cz = Math.sin(a);
    const mass = Math.pow(fbm(cx * j + 9, cz * j + 9, 4, look.seed), 1.25) * 1.7;
    const crest = look.height * (0.3 + 0.62 * mass + 0.16 * fbm(cx * j * 9, cz * j * 9, 3, look.seed + 5));
    // Las quebradas: surcos que bajan por la ladera, hundidos y a la sombra.
    const gully = smooth(0.25, 0.75, fbm(cx * j * 11, cz * j * 11, 3, look.seed + 80));
    for (let r = 0; r <= rows; r++) {
      const t = r / rows;
      const radius = look.radius * (1 + 0.3 * (1 - t) + 0.07 * (gully - 0.5) * (1 - t * 0.6));
      p.push(look.center[0] + cx * radius, look.base + crest * t, look.center[1] + cz * radius);
      uv.push((i / around) * look.repeat, (crest * t) / look.height);
      const light = look.shade * (0.5 + 0.7 * gully) * (0.82 + 0.18 * t);
      c.push(light, light, light);
    }
  }
  for (let i = 0; i < around; i++) for (let r = 0; r < rows; r++) {
    const a = i * (rows + 1) + r, b = a + rows + 1;
    index.push(a, a + 1, b, a + 1, b + 1, b);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(c, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(index);
  return new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: look.map, vertexColors: true, side: THREE.DoubleSide }));
}

/** Estrellas en un solo dibujo. */
export function stars(count: number, seed: number): THREE.Points {
  const p = new Float32Array(count * 3);
  let s = seed;
  const rand = () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2, y = 0.08 + rand() * 0.92, r = Math.sqrt(1 - y * y);
    p.set([Math.cos(a) * r * 1400, y * 1400, Math.sin(a) * r * 1400], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const points = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 2.2, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.8, depthWrite: false }));
  points.name = 'sky';
  points.frustumCulled = false;
  return points;
}
