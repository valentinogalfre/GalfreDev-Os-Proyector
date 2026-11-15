import * as THREE from 'three';
import { place, STEP, type Track } from './track';

const dummy = new THREE.Object3D();

/** Repite una pieza cada [every] metros desde [phase], corrida [off] metros a la izquierda del eje. */
export function along(track: Track, geometry: THREE.BufferGeometry, material: THREE.Material, every: number, off: number, keep: (s: number) => boolean = () => true, phase = 0): THREE.InstancedMesh {
  const total = Math.floor(track.length / every);
  const mesh = new THREE.InstancedMesh(geometry, material, total);
  let count = 0;
  for (let k = 0; k < total; k++) {
    if (!keep(k * every + phase)) continue;
    place(track, k * every + phase, off, dummy);
    dummy.updateMatrix();
    mesh.setMatrixAt(count++, dummy.matrix);
  }
  mesh.count = count;
  return mesh;
}

/** Cuánto dobla la pista en [s]: positivo hacia la izquierda, en radianes cada 30 metros. */
export function bend(track: Track, s: number): number {
  const i = ((Math.round(s / STEP) % track.n) + track.n) % track.n, j = (i + Math.round(30 / STEP)) % track.n;
  const a = track.tan[i], b = track.tan[j];
  return Math.atan2(a.z * b.x - a.x * b.z, a.x * b.x + a.z * b.z);
}

/** Un cable tendido entre puntas de poste, con su panza. */
export function wires(track: Track, every: number, off: number, height: number, sag: number, color: number): THREE.LineSegments {
  const p: number[] = [];
  const a = new THREE.Object3D(), b = new THREE.Object3D();
  const total = Math.floor(track.length / every), parts = 6;
  for (let k = 0; k < total; k++) {
    place(track, k * every, off, a);
    place(track, (k + 1) * every, off, b);
    for (let q = 0; q < parts; q++) {
      for (const t of [q / parts, (q + 1) / parts]) {
        p.push(a.position.x + (b.position.x - a.position.x) * t, a.position.y + (b.position.y - a.position.y) * t + height - sag * 4 * t * (1 - t), a.position.z + (b.position.z - a.position.z) * t);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  return new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color }));
}
