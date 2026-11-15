import * as THREE from 'three';

export interface PuffLook { color: number; opacity: number; size: number; additive: boolean; life: number; rise: number }

/**
 * Un montón de motas que nacen, se abren y se apagan: polvo, agua o chispas, según cómo se lo configure.
 * Todas van en un solo dibujo y el montón es fijo: cuando se llena, la mota nueva pisa a la más vieja.
 */
export class Puffs {
  readonly points: THREE.Points;
  private readonly position: THREE.BufferAttribute;
  private readonly age: THREE.BufferAttribute;
  private readonly velocity: Float32Array;
  private readonly material: THREE.ShaderMaterial;
  private next = 0;
  private readonly look: PuffLook;
  private readonly count: number;

  constructor(look: PuffLook, count: number) {
    this.look = look;
    this.count = count;
    const g = new THREE.BufferGeometry();
    this.position = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
    this.age = new THREE.BufferAttribute(new Float32Array(count).fill(1), 1);
    this.velocity = new Float32Array(count * 3);
    g.setAttribute('position', this.position);
    g.setAttribute('age', this.age);
    this.material = new THREE.ShaderMaterial({
      uniforms: { color: { value: new THREE.Color(look.color) }, opacity: { value: look.opacity }, size: { value: look.size }, tall: { value: 720 } },
      vertexShader: /* glsl */`
        attribute float age;
        uniform float size, tall;
        varying float vFade;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = age >= 1.0 ? 0.0 : size * (0.35 + 1.9 * age) * tall / -mv.z;
          vFade = smoothstep(0.0, 0.1, age) * (1.0 - age) * (1.0 - age);
        }`,
      fragmentShader: /* glsl */`
        uniform vec3 color;
        uniform float opacity;
        varying float vFade;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float soft = smoothstep(1.0, 0.1, d);
          gl_FragColor = vec4(color, soft * soft * vFade * opacity);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
      transparent: true, depthWrite: false, blending: look.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this.points = new THREE.Points(g, this.material);
    this.points.frustumCulled = false;
  }

  /** Suelta una mota en [at] con velocidad [vx, vy, vz] más un poco de azar de tamaño [spread]. */
  emit(at: THREE.Vector3, vx: number, vy: number, vz: number, spread: number): void {
    const i = this.next;
    this.next = (this.next + 1) % this.count;
    this.position.setXYZ(i, at.x, at.y, at.z);
    this.velocity.set([vx + (Math.random() - 0.5) * spread, vy + Math.random() * spread * 0.6, vz + (Math.random() - 0.5) * spread], i * 3);
    this.age.setX(i, 0);
  }

  update(dt: number): void {
    this.material.uniforms.tall.value = innerHeight;
    const p = this.position.array as Float32Array, age = this.age.array as Float32Array, v = this.velocity;
    for (let i = 0; i < this.count; i++) {
      if (age[i] >= 1) continue;
      age[i] = Math.min(1, age[i] + dt / this.look.life);
      v[i * 3 + 1] += this.look.rise * dt;
      p[i * 3] += v[i * 3] * dt;
      p[i * 3 + 1] += v[i * 3 + 1] * dt;
      p[i * 3 + 2] += v[i * 3 + 2] * dt;
    }
    this.position.needsUpdate = this.age.needsUpdate = true;
  }
}
