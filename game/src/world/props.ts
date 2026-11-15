import * as THREE from 'three';
import { wordmark } from './brand';
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

/**
 * El pórtico de largada: dos patas y un dintel liso con el wordmark, de frente al que llega.
 * El logo va en [ink] sobre [block], que según el manual son siempre hueso y carbón.
 */
export function gantry(track: Track, s: number, ink: number, block: number): THREE.Group {
  const gate = new THREE.Group();
  const wide = track.half * 2 + 7, tall = 2.6, clear = 7.2;
  const frame = new THREE.MeshStandardMaterial({ color: 0x1b1b1a, roughness: 0.7, metalness: 0.2 });
  for (const x of [-wide / 2 + 0.4, wide / 2 - 0.4]) gate.add(new THREE.Mesh(new THREE.BoxGeometry(0.8, clear + tall + 4, 0.8).translate(x, (clear + tall - 4) / 2, 0), frame));
  gate.add(new THREE.Mesh(new THREE.BoxGeometry(wide, tall, 0.9).translate(0, clear + tall / 2, 0), frame));
  const face = new THREE.MeshBasicMaterial({ map: wordmark(ink, block, 2048, Math.round((2048 * tall) / wide), 0.5) });
  for (const turn of [0, Math.PI]) gate.add(new THREE.Mesh(new THREE.PlaneGeometry(wide, tall).translate(0, clear + tall / 2, 0.47).rotateY(turn), face));
  gate.traverse((o) => { o.castShadow = true; });
  place(track, s, 0, gate);
  return gate;
}

/** Un cartel plano con el wordmark sobre su bloque liso, mirando hacia -Z. */
export function billboard(wide: number, ink: number, block: number): THREE.Mesh {
  const tall = wide / 3.2;
  return new THREE.Mesh(new THREE.PlaneGeometry(wide, tall).rotateY(Math.PI), new THREE.MeshBasicMaterial({ map: wordmark(ink, block, 1024, 320, 0.62) }));
}
