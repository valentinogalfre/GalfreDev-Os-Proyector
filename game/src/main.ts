import * as THREE from 'three';
import './style.css';
import { buildComposer } from './render/fx';
import { mountHud } from './hud';
import { Race, TUNING, type RaceEvent } from './sim/race';
import { animate, buildCar, loadCarKit } from './world/car';
import { mirror } from './world/mirror';
import { Puffs } from './world/spray';
import { buildTrack, curvature, place } from './world/track';
import { cinta } from './themes/cinta';
import { neon } from './themes/neon';
import { puna } from './themes/puna';
import type { Theme } from './themes/theme';

const THEMES: Record<string, Theme> = { puna, neon, cinta };
const NAMES = ['Vale', 'Tino', 'Maxi', 'Sofi', 'Nacho', 'Lu'];
const LAPS = 3;

const query = new URLSearchParams(location.search);
const key = query.get('t') ?? 'puna';
const theme = THEMES[key] ?? puna;
// Con [time] la carrera se adelanta sola hasta ese segundo y se dibuja un cuadro: sirve para capturas.
const frozen = query.has('time') ? Number(query.get('time')) : null;
const view = query.get('cam') ?? 'chase';
// Calidad alta: sombras, reflejos, resplandor y barniz en la pintura. La baja es la que apunta al proyector.
const fine = query.get('q') !== 'bajo';
// En la maqueta el primer auto se maneja con el teclado; con [demo] corren todos solos.
const demo = query.has('demo') || frozen !== null;

document.querySelectorAll<HTMLAnchorElement>('#pick a').forEach((link) => {
  if (link.id === 'cam') link.href = `?t=${key}&cam=${view === 'tv' ? 'chase' : 'tv'}`;
  else if (link.getAttribute('href') === `?t=${key}`) link.classList.add('on');
});
if (frozen !== null) document.getElementById('pick')!.style.display = 'none';

const keys = new Set<string>();
addEventListener('keydown', (e) => keys.add(e.code));
addEventListener('keyup', (e) => keys.delete(e.code));

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
  const world = theme.build({ scene, track, anisotropy: Math.min(fine ? 8 : 2, renderer.capabilities.getMaxAnisotropy()), fine });

  // Los reflejos de la pintura salen del mundo de verdad, fotografiado una vez desde la pista.
  const probe = new THREE.Object3D(), ahead = new THREE.Object3D();
  place(track, theme.start, 0, probe);
  probe.position.y += 1.6;
  scene.traverse((o) => { if (o.name === 'sky') o.position.copy(probe.position); });
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(scene, 0, 0.3, 5000, { position: probe.position }).texture;
  pmrem.dispose();

  const race = new Race({ length: track.length, half: track.half, wall: theme.wall, curvature: (s) => curvature(track, s) }, LAPS, theme.cars.map((_, i) => demo || i > 0));
  const cars = theme.cars.map((style) => buildCar(kit, style, fine, theme.night ?? false));
  cars.forEach((car) => scene.add(car));
  const dust = theme.spray ? new Puffs({ ...theme.spray, life: 0.9, rise: 1.2 }, 480) : null;
  const sparks = new Puffs({ color: 0xffb060, opacity: 1, size: 0.5, additive: true, life: 0.45, rise: -14 }, 240);
  (sparks.points.material as THREE.ShaderMaterial).uniforms.color.value.multiplyScalar(6);
  scene.add(sparks.points);
  if (dust) scene.add(dust.points);

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

  const hud = query.get('hud') === '0' ? null : mountHud({
    track: theme.name, laps: LAPS, cinta: theme.trail === undefined,
    players: theme.cars.map((style, i) => ({ name: NAMES[i], paint: style.paint })),
  });

  let shake = 0, eye = 0, eyeLane = 0, fov = 60, clock = 0;
  const at = new THREE.Vector3();

  function react(events: RaceEvent[], focus: number): void {
    for (const event of events) {
      if (event.type !== 'wall' && event.type !== 'hit') continue;
      const car = race.cars[event.car];
      // Las chispas saltan del lado del golpe, hacia atrás y hacia arriba.
      const side = event.type === 'wall' ? Math.sign(car.d) : Math.sign(race.cars[event.other].d - car.d) || 1;
      place(track, car.s, car.d + side * 1.05, probe);
      for (let k = 0; k < 6 + event.force * 22; k++) sparks.emit(at.copy(probe.position).setY(probe.position.y + 0.35), 0, 3 + event.force * 4, 0, 7 + event.force * 8);
      if (event.car === focus || (event.type === 'hit' && event.other === focus)) shake = Math.max(shake, 0.25 + event.force * 0.6);
    }
  }

  function frame(dt: number, draw = true): void {
    if (!demo) {
      const input = race.inputs[0];
      input.steer = (keys.has('ArrowLeft') ? 1 : 0) - (keys.has('ArrowRight') ? 1 : 0);
      input.brake = keys.has('ArrowDown') || keys.has('Space');
      input.nitro = keys.has('ArrowUp') || keys.has('ShiftLeft');
    }
    const order = race.order();
    const focus = demo ? order[Math.min(1, order.length - 1)] : 0;
    react(race.advance(dt), focus);
    clock += dt;

    cars.forEach((mesh, i) => {
      const car = race.cars[i];
      place(track, car.s, car.d, mesh);
      mesh.rotateY(car.yaw);
      animate(mesh, { metres: car.s, steer: car.steer, speed: car.v, boosting: car.boosting, braking: car.braking, time: clock });
      // Las ruedas traseras levantan polvo o agua: más cuanto más rápido, y mucho más fuera del asfalto.
      if (dust && car.v > 12 && Math.random() < (car.offTrack ? 1 : car.v / 140)) {
        place(track, car.s - 1.9, car.d + (Math.random() < 0.5 ? -0.85 : 0.85), probe);
        dust.emit(at.copy(probe.position).setY(probe.position.y + 0.15), 0, 0.6, 0, car.offTrack ? 3 : 1.4);
      }
    });
    dust?.update(dt);
    sparks.update(dt);

    const lead = race.cars[order[0]], me = race.cars[focus];
    if (trail) {
      const p = trail.geometry.attributes.position as THREE.BufferAttribute;
      for (let k = 0; k <= TRAIL; k++) {
        for (const side of [0, 1]) {
          place(track, lead.s - 2.2 - k * 2, lead.d + (side ? -1.1 : 1.1), probe);
          p.setXYZ(k * 2 + side, probe.position.x, probe.position.y + 0.035, probe.position.z);
        }
      }
      p.needsUpdate = true;
    }

    // La cámara sigue al auto con un poco de retraso, se abre con la velocidad y tiembla con los golpes.
    const ease = Math.min(1, dt * 6);
    eye += (me.s - eye) * (frozen !== null ? 1 : Math.min(1, dt * 10));
    eyeLane += (me.d - eyeLane) * (frozen !== null ? 1 : ease);
    fov += ((view === 'tv' ? 30 : view === 'foto' ? 38 : 58 + (me.v / TUNING.topSpeed) * 8 + (me.boosting ? 7 : 0)) - fov) * (frozen !== null ? 1 : ease);
    shake = Math.max(0, shake - dt * 1.8);
    if (view === 'tv') {
      // Una grúa sobre el borde de la pista: nada del costado se le cruza por delante.
      place(track, eye + 44, -track.half + 0.6, probe);
      camera.position.copy(probe.position).add(new THREE.Vector3(0, 6.2, 0));
      camera.lookAt(cars[focus].position);
    } else if (view === 'foto') {
      // De cerca y a la altura del auto, para juzgar el modelo y la pintura.
      place(track, eye - 5.2, eyeLane - 4.4, probe);
      camera.position.copy(probe.position).add(new THREE.Vector3(0, 1.25, 0));
      camera.lookAt(cars[focus].position.x, cars[focus].position.y + 0.6, cars[focus].position.z);
    } else {
      place(track, eye - 7.4, eyeLane * 0.85, probe);
      place(track, eye + 18, eyeLane * 0.35, ahead);
      camera.position.copy(probe.position).add(new THREE.Vector3((Math.random() - 0.5) * shake * 0.5, 2.25 + (Math.random() - 0.5) * shake * 0.5, 0));
      camera.lookAt(ahead.position.x, ahead.position.y + 0.8, ahead.position.z);
    }
    camera.fov = fov;
    camera.updateProjectionMatrix();
    if (sun && sunDir) {
      // Las sombras acompañan al pelotón: la luz se para siempre a la misma distancia de él.
      place(track, eye + 14, 0, probe);
      sun.target.position.copy(probe.position);
      sun.position.copy(probe.position).addScaledVector(sunDir, 300);
    }
    scene.traverse((o) => { if (o.name === 'sky') o.position.copy(camera.position); });
    hud?.update({
      order, lap: me.lap, clock: race.clock, done: race.phase === 'done',
      gap: race.cars.map((car) => (lead.s - car.s) / Math.max(20, car.v)), nitro: race.cars.map((car) => car.nitro),
    });
    if (!draw) return;
    if (composer) composer.render(); else renderer.render(scene, camera);
  }

  function resize(): void {
    renderer.setSize(innerWidth, innerHeight, false);
    composer?.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
  }
  addEventListener('resize', resize);
  resize();

  race.start();
  if (frozen !== null) {
    // Se corre sin dibujar hasta el segundo pedido, y los últimos cuadros con efectos para que haya polvo y chispas.
    race.advance(0);
    for (let t = -TUNING.countdown; t < frozen - 1; t += 1 / 60) race.advance(1 / 60);
    renderer.info.autoReset = false;
    for (let k = 0; k < 60; k++) frame(1 / 60, k === 59);
    document.title = `listo ${renderer.info.render.calls} ${renderer.info.render.triangles}`;
  } else {
    let last = performance.now();
    renderer.setAnimationLoop(() => {
      const now = performance.now();
      frame(Math.min(0.1, (now - last) / 1000));
      last = now;
    });
  }
}

void start();
