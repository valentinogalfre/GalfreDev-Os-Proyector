import * as THREE from 'three';

/** La pista muestreada cada [STEP] metros: centro, tangente y lado izquierdo de cada punto. */
export interface Track {
  n: number;
  length: number;
  half: number;
  pos: THREE.Vector3[];
  tan: THREE.Vector3[];
  left: THREE.Vector3[];
}

export const STEP = 2;

export function buildTrack(points: [number, number, number][], half: number): Track {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)), true, 'centripetal');
  const length = curve.getLength();
  const n = Math.round(length / STEP);
  const pos = curve.getSpacedPoints(n).slice(0, n);
  const up = new THREE.Vector3(0, 1, 0);
  const tan: THREE.Vector3[] = [], left: THREE.Vector3[] = [];
  for (let i = 0; i < n; i++) {
    const t = pos[(i + 1) % n].clone().sub(pos[(i + n - 1) % n]).normalize();
    tan.push(t);
    left.push(new THREE.Vector3().crossVectors(up, t).normalize());
  }
  return { n, length, half, pos, tan, left };
}

/** Una cinta a lo largo de la pista entre dos desplazamientos laterales. La v del UV va en metros. */
export function ribbon(track: Track, offA: number, yA: number, offB: number, yB: number): THREE.BufferGeometry {
  const { n, pos, left } = track;
  const p = new Float32Array((n + 1) * 6), uv = new Float32Array((n + 1) * 4);
  const index: number[] = [];
  for (let k = 0; k <= n; k++) {
    const i = k % n;
    const c = pos[i], l = left[i];
    p.set([c.x + l.x * offA, c.y + yA, c.z + l.z * offA, c.x + l.x * offB, c.y + yB, c.z + l.z * offB], k * 6);
    uv.set([0, k * STEP, 1, k * STEP], k * 4);
    if (k < n) index.push(k * 2, k * 2 + 1, k * 2 + 2, k * 2 + 1, k * 2 + 3, k * 2 + 2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setIndex(index);
  g.computeVertexNormals();
  return g;
}

/** Banquina y talud a los dos lados, hasta tocar el suelo. */
export function embankment(track: Track, shoulder: THREE.Material, slope: THREE.Material, berm: number, reach: number, drop: number): THREE.Group {
  const h = track.half, group = new THREE.Group();
  group.add(
    new THREE.Mesh(ribbon(track, h + berm, -0.03, h, -0.01), shoulder),
    new THREE.Mesh(ribbon(track, -h, -0.01, -h - berm, -0.03), shoulder),
    new THREE.Mesh(ribbon(track, h + reach, -drop, h + berm, -0.03), slope),
    new THREE.Mesh(ribbon(track, -h - berm, -0.03, -h - reach, -drop), slope),
  );
  return group;
}

const basis = new THREE.Matrix4(), up = new THREE.Vector3();

/** Lleva [out] al punto que está a [s] metros de la largada, corrido [off] metros a la izquierda. */
export function place(t: Track, s: number, off: number, out: THREE.Object3D): void {
  const f = (((s / STEP) % t.n) + t.n) % t.n;
  const i = Math.floor(f), j = (i + 1) % t.n, k = f - i;
  const tan = t.tan[i].clone().lerp(t.tan[j], k).normalize();
  const left = t.left[i].clone().lerp(t.left[j], k).normalize();
  out.position.copy(t.pos[i]).lerp(t.pos[j], k).addScaledVector(left, off);
  out.quaternion.setFromRotationMatrix(basis.makeBasis(left, up.crossVectors(tan, left), tan));
}
