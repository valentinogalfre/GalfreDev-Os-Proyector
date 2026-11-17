import * as THREE from 'three';

/**
 * Las huellas de goma que quedan en el asfalto al derrapar o frenar fuerte. Son tiras de cuadrados en una sola malla
 * de tamaño fijo: cuando se llena, la huella nueva pisa a la más vieja, y al proyector le cuesta una orden de dibujo.
 */
export class Marks {
  readonly mesh: THREE.Mesh;
  private readonly position: THREE.BufferAttribute;
  private readonly open = new Map<number, { left: THREE.Vector3; right: THREE.Vector3; at: THREE.Vector3 }>();
  private readonly count: number;
  private next = 0;

  constructor(count = 420) {
    this.count = count;
    const geometry = new THREE.BufferGeometry(), index = new Uint16Array(count * 6);
    this.position = new THREE.BufferAttribute(new Float32Array(count * 12), 3);
    this.position.setUsage(THREE.DynamicDrawUsage);
    for (let k = 0; k < count; k++) index.set([k * 4, k * 4 + 1, k * 4 + 2, k * 4 + 2, k * 4 + 1, k * 4 + 3], k * 6);
    geometry.setAttribute('position', this.position);
    geometry.setIndex(new THREE.BufferAttribute(index, 1));
    this.mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
      color: 0x050505, transparent: true, opacity: 0.5, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
    }));
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = -2;
  }

  /** La rueda [wheel] apoya ahora en [at], con [across] apuntando a su costado. Con [at] nulo, dejó de marcar. */
  lay(wheel: number, at: THREE.Vector3 | null, across?: THREE.Vector3): void {
    const before = this.open.get(wheel);
    if (!at || !across) {
      if (before) this.open.delete(wheel);
      return;
    }
    if (before && before.at.distanceToSquared(at) < 0.5) return;
    const left = at.clone().addScaledVector(across, 0.14), right = at.clone().addScaledVector(across, -0.14);
    if (before) {
      const o = this.next * 4;
      this.position.setXYZ(o, before.left.x, before.left.y, before.left.z);
      this.position.setXYZ(o + 1, before.right.x, before.right.y, before.right.z);
      this.position.setXYZ(o + 2, left.x, left.y, left.z);
      this.position.setXYZ(o + 3, right.x, right.y, right.z);
      this.position.needsUpdate = true;
      this.next = (this.next + 1) % this.count;
    }
    this.open.set(wheel, { left, right, at: at.clone() });
  }
}
