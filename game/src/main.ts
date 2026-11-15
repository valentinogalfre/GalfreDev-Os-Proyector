import * as THREE from 'three';
import './style.css';
import { buildCar } from './world/car';
import { buildTrack, place } from './world/track';
import { cinta } from './themes/cinta';
import { neon } from './themes/neon';
import { puna } from './themes/puna';
import type { Theme } from './themes/theme';

const THEMES: Record<string, Theme> = { puna, neon, cinta };
const LAYOUT: [number, number, number][] = [
  [0, 0, 0], [120, 0, -10], [220, 4, 40], [250, 10, 140], [180, 14, 220], [60, 12, 200],
  [-20, 8, 260], [-140, 6, 240], [-200, 2, 140], [-150, 0, 40], [-90, 0, -20],
];
// Un pelotón de muestra: cada auto con su lugar en la fila, su carril y cuánto se mueve de lado.
const PACK = [[0, -1.6, 0], [9, 2.4, 0.5], [17, -3.6, -0.4], [27, 0.6, 0], [-9, 3.2, -0.6], [-19, -2.2, 0.3]];
const LEADER = 3;

const query = new URLSearchParams(location.search);
const theme = THEMES[query.get('t') ?? 'puna'] ?? puna;
const frozen = query.has('time') ? Number(query.get('time')) : null;
const from = Number(query.get('s') ?? 300);
const view = query.get('cam') ?? 'chase';

// El selector de la maqueta: marca la dirección activa y alterna la cámara sin perder el tema.
document.querySelectorAll<HTMLAnchorElement>('#pick a').forEach((link) => {
  if (link.id === 'cam') link.href = `?t=${query.get('t') ?? 'puna'}&cam=${view === 'tv' ? 'chase' : 'tv'}`;
  else if (link.getAttribute('href') === `?t=${query.get('t') ?? 'puna'}`) link.classList.add('on');
});
if (frozen !== null) document.getElementById('pick')!.style.display = 'none';

async function start(): Promise<void> {
// Los rótulos se pintan en texturas: la tipografía tiene que estar cargada antes.
await document.fonts.load('800 64px Archivo');

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('view') as HTMLCanvasElement, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = theme.exposure;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(58, 16 / 9, 0.3, 4000);
const track = buildTrack(LAYOUT, 7);
const envScene = theme.build({ scene, track, anisotropy: Math.min(8, renderer.capabilities.getMaxAnisotropy()) });
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(envScene, 0.02).texture;
pmrem.dispose();

const cars = theme.cars.map((style) => buildCar(style));
cars.forEach((car) => scene.add(car));
theme.leader?.(cars[LEADER]);

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
    car.children.forEach((part) => { if (part.name === 'wheel') part.rotation.x = (s / 0.35) % (Math.PI * 2); });
  });
  if (trail) {
    const p = trail.geometry.attributes.position as THREE.BufferAttribute;
    const head = s + PACK[LEADER][0] + Math.sin(time * 0.5 + LEADER) * 2 + 2.6;
    for (let k = 0; k <= TRAIL; k++) {
      for (const side of [0, 1]) {
        place(track, head - k * 2, PACK[LEADER][1] + (side ? -1.25 : 1.25), probe);
        p.setXYZ(k * 2 + side, probe.position.x, probe.position.y + 0.035, probe.position.z);
      }
    }
    p.needsUpdate = true;
  }
  if (view === 'tv') {
    place(track, s + 46, -track.half - 7, probe);
    camera.position.copy(probe.position).add(new THREE.Vector3(0, 2.6, 0));
    camera.lookAt(cars[1].position);
    camera.fov = 26;
  } else {
    place(track, s - 9.5, -1.2, probe);
    place(track, s + 16, 0, ahead);
    camera.position.copy(probe.position).add(new THREE.Vector3(0, 2.9, 0));
    camera.lookAt(ahead.position.x, ahead.position.y + 0.9, ahead.position.z);
  }
  camera.updateProjectionMatrix();
  scene.traverse((o) => { if (o.name === 'sky') o.position.copy(camera.position); });
  renderer.render(scene, camera);
}

function resize(): void {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
}
addEventListener('resize', resize);
resize();

if (frozen !== null) {
  frame(frozen);
  document.title = `listo ${renderer.info.render.calls} ${renderer.info.render.triangles}`;
} else {
  const began = performance.now();
  renderer.setAnimationLoop(() => frame((performance.now() - began) / 1000));
}
}

void start();
