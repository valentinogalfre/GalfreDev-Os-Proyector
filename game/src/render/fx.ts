import * as THREE from 'three';
import {
  BlendFunction, BloomEffect, Effect, EffectAttribute, EffectComposer, EffectPass, GodRaysEffect, NoiseEffect, RenderPass,
  ToneMappingEffect, ToneMappingMode, VignetteEffect,
} from 'postprocessing';

/** El lente: los bordes se estiran hacia el centro, como a velocidad, y el color se abre apenas. */
class LensEffect extends Effect {
  constructor(blur: number, fringe: number) {
    super('LensEffect', /* glsl */`
      uniform float blur;
      uniform float fringe;
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec2 d = uv - 0.5;
        float r2 = dot(d, d);
        float k = blur * smoothstep(0.06, 0.5, r2);
        vec2 split = d * fringe * r2 * 4.0;
        vec3 sum = vec3(0.0);
        for (int i = 0; i < 6; i++) {
          vec2 p = uv - d * k * float(i) / 5.0;
          sum.r += texture2D(inputBuffer, p + split).r;
          sum.g += texture2D(inputBuffer, p).g;
          sum.b += texture2D(inputBuffer, p - split).b;
        }
        outputColor = vec4(sum / 6.0, inputColor.a);
      }`, {
      attributes: EffectAttribute.CONVOLUTION,
      uniforms: new Map([['blur', new THREE.Uniform(blur)], ['fringe', new THREE.Uniform(fringe)]]),
    });
  }
}

export interface Grade {
  /** Resplandor: fuerza, radio y umbral. */
  bloom: [number, number, number];
  /** Cuánto oscurece la viñeta las esquinas. */
  vignette: number;
  /** Cuánto se estiran los bordes hacia el centro. */
  speed: number;
}

/** La cadena de la calidad alta: rayos del sol, resplandor, lente, tono final, viñeta y grano. */
export function buildComposer(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera, grade: Grade, rays?: THREE.Mesh): EffectComposer {
  const composer = new EffectComposer(renderer, { frameBufferType: THREE.HalfFloatType, multisampling: 4 });
  composer.addPass(new RenderPass(scene, camera));
  const [intensity, radius, threshold] = grade.bloom;
  const bloom = new BloomEffect({ mipmapBlur: true, intensity, radius, luminanceThreshold: threshold, luminanceSmoothing: 0.25, levels: 7 });
  const light = rays ? [new GodRaysEffect(camera, rays, { density: 0.96, decay: 0.92, weight: 0.2, exposure: 0.34, samples: 48, clampMax: 1, resolutionScale: 0.5, blur: true })] : [];
  composer.addPass(new EffectPass(camera, ...light, bloom));
  const noise = new NoiseEffect({ blendFunction: BlendFunction.OVERLAY, premultiply: false });
  noise.blendMode.opacity.value = 0.06;
  composer.addPass(new EffectPass(
    camera,
    new LensEffect(grade.speed, 0.0015),
    new ToneMappingEffect({ mode: ToneMappingMode.ACES_FILMIC }),
    new VignetteEffect({ darkness: grade.vignette, offset: 0.28 }),
    noise,
  ));
  return composer;
}
