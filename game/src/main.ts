import * as THREE from 'three';
import './style.css';
import { buildComposer } from './render/fx';
import { mountHud } from './hud';
import { buildCar, loadCarKit, roll } from './world/car';
import { mirror } from './world/mirror';
import { buildSpray } from './world/spray';
import { buildTrack, place } from './world/track';
import { cinta } from './themes/cinta';
import { neon } from './themes/neon';
import { puna } from './themes/puna';
import type { Theme } from './themes/theme';

const THEMES: Record<string, Theme> = { puna, neon, cinta };
// Un pelotón de muestra: cada auto con su lugar en la fila, su carril y cuánto se mueve de lado.
const PACK = [[0, -1.8, 0], [10, 2.6, 0.5], [19, -3.4, -0.4], [30, 0.8, 0], [-10, 3.2, -0.6], [-21, -2.4, 0.3]];
const NAMES = ['Tino', 'Maxi', 'Sofi', 'Vale', 'Nacho', 'Lu'];
const LEADER = 3;
const SPEED = 52;

const query = new URLSearchParams(location.search);
const key = query.get('t') ?? 'puna';
const theme = THEMES[key] ?? puna;
const frozen = query.has('time') ? Number(query.get('time')) : null;
const from = Number(query.get('s') ?? theme.start);
const view = query.get('cam') ?? 'chase';
// Calidad alta: sombras, reflejos, resplandor y barniz en la pintura. La baja es la que apunta al proyector.
const fine = query.get('q') !== 'bajo';

// El selector de la maqueta: marca la dirección activa y alterna la cámara sin perder el tema.
document.querySelectorAll<HTMLAnchorElement>('#pick a').forEach((link) => {
  if (link.id === 'cam') link.href = `?t=${key}&cam=${view === 'tv' ? 'chase' : 'tv'}`;
  else if (link.getAttribute('href') === `?t=${key}`) link.classList.add('on');
});
if (frozen !== null) document.getElementById('pick')!.style.display = 'none';

/** Dónde está cada auto en un instante: metros recorridos y carril. */
function at(car: number, time: number): [number, number] {
  const [gap, lane, sway] = PACK[car];
  return [from + time * SPEED + gap + Math.sin(time * 0.5 + car) * 2, lane + Math.sin(time * 0.7 + car * 2) * sway];
}

async function start(): Promise<void> {
  // Los rótulos se pintan en texturas: la tipografía tiene que estar cargada antes.
  const [kit] = await Promise.all([loadCarKit(fine), document.fonts.load('800 64px Archivo'), document.fonts.load('500 16px "Geist Mono"')]);

  const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('view') as HTMLCanvasElement, antialias: !fine, powerPreference: 'high-performance' });
  renderer.setPixelRatio(fine ? Math.min(devicePixelRatio, 1.5) : 1);
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.toneMappingExposure = theme.exposure;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.3, 6000);
  const track = buildTrack(theme.layout, theme.half);
  const world = theme.build({ scene, track, anisotropy: Math.min(8, renderer.capabilities.getMaxAnisotropy()) });

  // Los reflejos de la pintura salen del mundo de verdad, fotografiado una vez desde la pista.
  const probe = new THREE.Object3D(), ahead = new THREE.Object3D();
  place(track, from + 20, 0, probe);
  probe.position.y += 1.6;
  scene.traverse((o) => { if (o.name === 'sky') o.position.copy(probe.position); });
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(scene, 0, 0.3, 5000, { position: probe.position }).texture;
  pmrem.dispose();

  const cars = theme.cars.map((style) => buildCar(kit, style, fine, theme.night ?? false));
  cars.forEach((car) => scene.add(car));
  const spray = theme.spray ? buildSpray(theme.spray, cars.length) : null;
  if (spray) scene.add(spray.points);

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

  if (fine) {
    const pixels = renderer.getDrawingBufferSize(new THREE.Vector2()).multiplyScalar(0.5).floor();
    for (const { flat, y, look } of world.mirrors ?? []) scene.add(mirror(flat, y, pixels, { ...look, fog: scene.fog as THREE.FogExp2 }));
  }
  const composer = fine ? buildComposer(renderer, scene, camera, theme.grade, world.rays) : null;
  if (!composer) renderer.toneMapping = THREE.ACESFilmicToneMapping;

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

  const order = PACK.map((_, i) => i).sort((a, b) => PACK[b][0] - PACK[a][0]);
  const hud = query.get('hud') === '0' ? null : mountHud({
    track: theme.name,
    cinta: theme.trail === undefined,
    rows: order.map((i) => ({ name: NAMES[i], paint: theme.cars[i].paint, gap: (PACK[order[0]][0] - PACK[i][0]) / SPEED })),
  });

  function frame(time: number): void {
    const s = from + time * SPEED;
    cars.forEach((car, i) => {
      const [metres, lane] = at(i, time);
      place(track, metres, lane, car);
      roll(car, metres);
    });
    spray?.update(track, at, time);
    if (trail) {
      const p = trail.geometry.attributes.position as THREE.BufferAttribute;
      const [head, lane] = at(LEADER, time);
      for (let k = 0; k <= TRAIL; k++) {
        for (const side of [0, 1]) {
          place(track, head - 2.2 - k * 2, lane + (side ? -1.1 : 1.1), probe);
          p.setXYZ(k * 2 + side, probe.position.x, probe.position.y + 0.035, probe.position.z);
        }
      }
      p.needsUpdate = true;
    }
    if (view === 'tv') {
      // Una grúa sobre el borde de la pista: nada del costado se le cruza por delante.
      place(track, s + 48, -track.half + 0.6, probe);
      camera.position.copy(probe.position).add(new THREE.Vector3(0, 6.2, 0));
      camera.lookAt(cars[1].position);
      camera.fov = 30;
    } else if (view === 'foto') {
      // De cerca y a la altura del auto, para juzgar el modelo y la pintura.
      place(track, s - 5.2, -4.4, probe);
      camera.position.copy(probe.position).add(new THREE.Vector3(0, 1.25, 0));
      camera.lookAt(cars[0].position.x, cars[0].position.y + 0.6, cars[0].position.z);
      camera.fov = 38;
    } else {
      place(track, s - 7.6, -1.5, probe);
      place(track, s + 18, 0, ahead);
      camera.position.copy(probe.position).add(new THREE.Vector3(0, 2.25, 0));
      camera.lookAt(ahead.position.x, ahead.position.y + 0.8, ahead.position.z);
    }
    camera.updateProjectionMatrix();
    if (sun && sunDir) {
      // Las sombras acompañan al pelotón: la luz se para siempre a la misma distancia de él.
      place(track, s + 14, 0, probe);
      sun.target.position.copy(probe.position);
      sun.position.copy(probe.position).addScaledVector(sunDir, 300);
    }
    scene.traverse((o) => { if (o.name === 'sky') o.position.copy(camera.position); });
    hud?.update(time);
    if (composer) composer.render(); else renderer.render(scene, camera);
  }

  function resize(): void {
    renderer.setSize(innerWidth, innerHeight, false);
    composer?.setSize(innerWidth, innerHeight);
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
