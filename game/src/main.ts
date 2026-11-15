import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import './style.css';
import { buildCar, loadCarKit, roll } from './world/car';
import { buildTrack, place } from './world/track';
import { cinta } from './themes/cinta';
import { neon } from './themes/neon';
import { puna } from './themes/puna';
import type { Theme } from './themes/theme';

const THEMES: Record<string, Theme> = { puna, neon, cinta };
// Un pelotón de muestra: cada auto con su lugar en la fila, su carril y cuánto se mueve de lado.
const PACK = [[0, -1.8, 0], [10, 2.6, 0.5], [19, -3.4, -0.4], [30, 0.8, 0], [-10, 3.2, -0.6], [-21, -2.4, 0.3]];
const LEADER = 3;

const query = new URLSearchParams(location.search);
const key = query.get('t') ?? 'puna';
const theme = THEMES[key] ?? puna;
const frozen = query.has('time') ? Number(query.get('time')) : null;
const from = Number(query.get('s') ?? theme.start);
const view = query.get('cam') ?? 'chase';
// Calidad alta: sombras, resplandor y barniz en la pintura. La baja es la que apunta al proyector.
const fine = query.get('q') !== 'bajo';

// El selector de la maqueta: marca la dirección activa y alterna la cámara sin perder el tema.
document.querySelectorAll<HTMLAnchorElement>('#pick a').forEach((link) => {
  if (link.id === 'cam') link.href = `?t=${key}&cam=${view === 'tv' ? 'chase' : 'tv'}`;
  else if (link.getAttribute('href') === `?t=${key}`) link.classList.add('on');
});
if (frozen !== null) document.getElementById('pick')!.style.display = 'none';

async function start(): Promise<void> {
  // Los rótulos se pintan en texturas: la tipografía tiene que estar cargada antes.
  const [kit] = await Promise.all([loadCarKit(fine), document.fonts.load('800 64px Archivo')]);

  const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('view') as HTMLCanvasElement, antialias: !fine, powerPreference: 'high-performance' });
  renderer.setPixelRatio(fine ? Math.min(devicePixelRatio, 1.5) : 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = theme.exposure;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, 16 / 9, 0.3, 6000);
  const track = buildTrack(theme.layout, theme.half);
  const world = theme.build({ scene, track, anisotropy: Math.min(8, renderer.capabilities.getMaxAnisotropy()) });
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(world.env, 0.02).texture;
  pmrem.dispose();

  const cars = theme.cars.map((style) => buildCar(kit, style, fine, theme.night ?? false));
  cars.forEach((car) => scene.add(car));
  theme.leader?.(cars[LEADER]);

  const sun = fine ? world.sun : undefined;
  const range = world.shadowRange ?? 45;
  if (sun) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = sun.shadow.camera.bottom = -range;
    sun.shadow.camera.right = sun.shadow.camera.top = range;
    sun.shadow.camera.near = 10;
    sun.shadow.camera.far = 700;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.04;
    scene.add(sun.target);
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh && !(mesh.material as THREE.Material).transparent && o.name !== 'sky') mesh.receiveShadow = true;
    });
  }
  const sunDir = sun ? sun.position.clone().normalize() : null;

  let composer: EffectComposer | null = null;
  if (fine) {
    const size = renderer.getDrawingBufferSize(new THREE.Vector2());
    composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: 4 }));
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(size.x / 2, size.y / 2), ...theme.bloom));
    composer.addPass(new OutputPass());
  }

  // La estela del que va primero: una cinta apoyada en el asfalto, que se rehace cada cuadro.
  const TRAIL = 40;
  const trail = theme.trail === undefined ? null : new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ color: theme.trail, fog: false, side: THREE.DoubleSide }));
  if (trail) {
    trail.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array((TRAIL + 1) * 6), 3));
    const index: number[] = [];
    for (let k = 0; k < TRAIL; k++) index.push(k * 2, k * 2 + 1, k * 2 + 2, k * 2 + 1, k * 2 + 3, k * 2 + 2);
    trail.geometry.setIndex(index);
    trail.frustumCulled = false;
    scene.add(trail);
  }

  const probe = new THREE.Object3D(), ahead = new THREE.Object3D();
  function frame(time: number): void {
    const s = from + time * 52;
    cars.forEach((car, i) => {
      const [gap, lane, sway] = PACK[i];
      place(track, s + gap + Math.sin(time * 0.5 + i) * 2, lane + Math.sin(time * 0.7 + i * 2) * sway, car);
      roll(car, s);
    });
    if (trail) {
      const p = trail.geometry.attributes.position as THREE.BufferAttribute;
      const head = s + PACK[LEADER][0] + Math.sin(time * 0.5 + LEADER) * 2 - 2.2;
      for (let k = 0; k <= TRAIL; k++) {
        for (const side of [0, 1]) {
          place(track, head - k * 2, PACK[LEADER][1] + (side ? -1.1 : 1.1), probe);
          p.setXYZ(k * 2 + side, probe.position.x, probe.position.y + 0.035, probe.position.z);
        }
      }
      p.needsUpdate = true;
    }
    if (view === 'tv') {
      place(track, s + 46, -track.half - 9, probe);
      camera.position.copy(probe.position).add(new THREE.Vector3(0, 4.6, 0));
      camera.lookAt(cars[1].position);
      camera.fov = 26;
    } else {
      place(track, s - 8.2, -1.4, probe);
      place(track, s + 16, 0, ahead);
      camera.position.copy(probe.position).add(new THREE.Vector3(0, 2.5, 0));
      camera.lookAt(ahead.position.x, ahead.position.y + 0.9, ahead.position.z);
    }
    camera.updateProjectionMatrix();
    if (sun && sunDir) {
      // Las sombras acompañan al pelotón: la luz se para siempre a la misma distancia de él.
      place(track, s + 14, 0, probe);
      sun.target.position.copy(probe.position);
      sun.position.copy(probe.position).addScaledVector(sunDir, 300);
    }
    scene.traverse((o) => { if (o.name === 'sky') o.position.copy(camera.position); });
    if (composer) composer.render(); else renderer.render(scene, camera);
  }

  function resize(): void {
    renderer.setSize(innerWidth, innerHeight, false);
    const size = renderer.getDrawingBufferSize(new THREE.Vector2());
    composer?.setSize(size.x / renderer.getPixelRatio(), size.y / renderer.getPixelRatio());
    camera.aspect = innerWidth / innerHeight;
  }
  addEventListener('resize', resize);
  resize();

  if (frozen !== null) {
    renderer.info.autoReset = false;
    frame(frozen);
    document.title = `listo ${renderer.info.render.calls} ${renderer.info.render.triangles}`;
  } else {
    const began = performance.now();
    renderer.setAnimationLoop(() => frame((performance.now() - began) / 1000));
  }
}

void start();
