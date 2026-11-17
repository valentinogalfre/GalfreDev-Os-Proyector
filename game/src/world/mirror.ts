import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';

export interface MirrorLook {
  /** Cuánto del reflejo llega al ojo mirando casi de frente al piso. */
  strength: number;
  /** Cuánto se estira el reflejo hacia la cámara, en fracción de pantalla. */
  blur: number;
  /** Mapa de rugosidad (canal verde): lo liso espeja, lo áspero casi no. */
  mask?: THREE.Texture;
  /** Repeticiones del mapa por metro. */
  maskScale?: number;
  fog: THREE.FogExp2;
}

const SHADER = {
  name: 'MirrorShader',
  uniforms: {
    color: { value: null }, tDiffuse: { value: null }, textureMatrix: { value: null },
    mask: { value: null }, maskScale: { value: 0.06 }, masked: { value: 0 },
    strength: { value: 0.5 }, blur: { value: 0.03 }, fogDensity: { value: 0 },
  },
  vertexShader: /* glsl */`
    uniform mat4 textureMatrix;
    varying vec4 vMirror;
    varying vec3 vWorld;
    void main() {
      vMirror = textureMatrix * vec4(position, 1.0);
      vec4 world = modelMatrix * vec4(position, 1.0);
      vWorld = world.xyz;
      gl_Position = projectionMatrix * viewMatrix * world;
    }`,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform sampler2D mask;
    uniform float maskScale, masked, strength, blur, fogDensity;
    varying vec4 vMirror;
    varying vec3 vWorld;
    void main() {
      vec3 view = cameraPosition - vWorld;
      float dist = length(view);
      float rough = masked > 0.5 ? smoothstep(0.1, 0.3, texture2D(mask, vWorld.xz * maskScale).g) : 0.0;
      // El grano fino del piso corre el reflejo de lado a lado, como en el asfalto mojado.
      vec2 grain = masked > 0.5 ? texture2D(mask, vWorld.xz * maskScale * 9.0).rg - 0.5 : vec2(0.0);
      vec3 sum = vec3(0.0);
      for (int i = 0; i < 6; i++) {
        float t = float(i) / 5.0;
        vec4 at = vMirror;
        at.y += t * t * blur * (0.5 + rough) * at.w;
        at.x += grain.x * 0.012 * (0.3 + t) * at.w;
        sum += texture2DProj(tDiffuse, at).rgb * (1.0 - 0.6 * t);
      }
      // Cuanto más rasante la mirada, más espeja.
      float graze = 1.0 - clamp(view.y / dist, 0.0, 1.0);
      float amount = strength * mix(1.0, 0.22, rough) * (0.12 + 0.88 * pow(graze, 5.0));
      float clear = exp(-fogDensity * fogDensity * dist * dist);
      gl_FragColor = vec4(sum / 4.2 * amount * clear, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
};

/**
 * Una capa que suma sobre el piso lo que el piso refleja. [flat] es geometría plana en y = 0,
 * en coordenadas del mundo; el piso de verdad sigue debajo, con su luz y sus sombras.
 */
export function mirror(flat: THREE.BufferGeometry, y: number, pixels: THREE.Vector2, look: MirrorLook): THREE.Mesh {
  // El espejo de three mira hacia +Z: se acuesta la geometría y se la vuelve a parar con la malla.
  const layer = new Reflector(flat.clone().rotateX(Math.PI / 2), { textureWidth: pixels.x, textureHeight: pixels.y, shader: SHADER, multisample: 0, clipBias: 0.02 });
  layer.rotation.x = -Math.PI / 2;
  layer.position.y = y;
  const material = layer.material as THREE.ShaderMaterial;
  material.side = THREE.DoubleSide;
  material.transparent = true;
  material.blending = THREE.AdditiveBlending;
  material.depthWrite = false;
  material.uniforms.strength.value = look.strength;
  material.uniforms.blur.value = look.blur;
  material.uniforms.fogDensity.value = look.fog.density;
  if (look.mask) {
    material.uniforms.mask.value = look.mask;
    material.uniforms.maskScale.value = look.maskScale ?? 0.06;
    material.uniforms.masked.value = 1;
  }
  layer.name = 'mirror';
  return layer;
}
