import * as THREE from 'three';
import type { Spray } from '../themes/theme';
import { place, type Track } from './track';

const PER_WHEEL = 14, LIFE = 0.9;
const probe = new THREE.Object3D();

/**
 * Lo que levantan las ruedas traseras. No guarda estado: cada mota se calcula a partir de dónde
 * estaba el auto hace un rato, así un cuadro congelado sale igual que uno en movimiento.
 */
export function buildSpray(look: Spray, cars: number): { points: THREE.Points; update(track: Track, at: (car: number, time: number) => [number, number], time: number): void } {
  const count = cars * 2 * PER_WHEEL;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  g.setAttribute('age', new THREE.BufferAttribute(new Float32Array(count), 1));
  const material = new THREE.ShaderMaterial({
    uniforms: { color: { value: new THREE.Color(look.color) }, opacity: { value: look.opacity }, size: { value: look.size }, tall: { value: 720 } },
    vertexShader: /* glsl */`
      attribute float age;
      uniform float size, tall;
      varying float vFade;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = size * (0.35 + 1.9 * age) * tall / -mv.z;
        vFade = smoothstep(0.0, 0.12, age) * (1.0 - age) * (1.0 - age);
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
  const points = new THREE.Points(g, material);
  points.frustumCulled = false;
  const p = g.attributes.position as THREE.BufferAttribute, age = g.attributes.age as THREE.BufferAttribute;
  // Un desvío fijo por mota, para que la nube no sea una fila.
  const drift = Array.from({ length: count }, (_, i) => [Math.sin(i * 12.9898) * 0.5, 0.3 + 0.7 * Math.abs(Math.sin(i * 78.233)), Math.sin(i * 37.719) * 0.5]);
  return {
    points,
    update(track, at, time) {
      material.uniforms.tall.value = innerHeight;
      let i = 0;
      for (let car = 0; car < cars; car++) for (const side of [-0.85, 0.85]) for (let k = 0; k < PER_WHEEL; k++, i++) {
        const a = (k + ((time / LIFE) * PER_WHEEL) % 1) / PER_WHEEL;
        const [s, lane] = at(car, time - a * LIFE);
        place(track, s - 1.6, lane + side, probe);
        const [dx, dy, dz] = drift[i];
        p.setXYZ(i, probe.position.x + dx * a * 1.6, probe.position.y + 0.15 + dy * a * 1.5, probe.position.z + dz * a * 1.6);
        age.setX(i, a);
      }
      p.needsUpdate = age.needsUpdate = true;
    },
  };
}
