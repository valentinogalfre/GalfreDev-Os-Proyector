import * as THREE from 'three';
import { mountMap } from '../map';
import { blend, type CarFrame, type Frame } from '../net/frame';
import type { Shared } from '../net/protocol';
import { TUNING } from '../sim/race';
import { THEMES, liveriesOf } from '../themes';
import { bakeLight } from '../world/bake';
import { animate, bakeMatcap, buildCar, Fleet, loadCarKits, nameTag } from '../world/car';
import { Puffs } from '../world/spray';
import { buildTrack, place, type Track } from '../world/track';

/** La carrera vista desde atrás del auto propio. La calcula la pared; acá solo se dibuja lo que ella manda. */
export interface View {
  readonly track: Track;
  /** Quién va en cada auto y cómo se ve; [me] es el jugador de este celular. */
  seat(cars: Shared['cars'], me: number): void;
  push(frame: Frame): void;
  /** En la sala y en la llegada no se corre: la cámara da vueltas alrededor del auto propio. */
  show(on: boolean): void;
  /** Dónde está cada auto ahora, ya suavizado, o null si todavía no llegó ningún cuadro. */
  now(): CarFrame[] | null;
  /** El auto de este celular ahora, y el reloj de la carrera que se está dibujando (negativo en la cuenta regresiva). */
  self(): CarFrame | null;
  clock(): number;
  stop(): void;
}

/** Cuántos cuadros se guardan para suavizar: a treinta por segundo, un segundo. */
const KEPT = 30;
/** Hasta cuánto se sigue de largo cuando no llega el cuadro siguiente, en segundos. Pasado eso el auto espera. */
const COAST = 0.25;

export async function mountView(canvas: HTMLCanvasElement, mapCanvas: HTMLCanvasElement, trackName: string): Promise<View> {
  const theme = Object.values(THEMES).find((t) => t.name === trackName) ?? THEMES.puna;
  const night = theme.night ?? false;
  const [kits] = await Promise.all([loadCarKits(false), document.fonts.load('800 64px Archivo')]);

  // El mismo dibujo liviano del proyector: sin sombras ni reflejos por punto, con la luz y el brillo calculados una vez.
  THREE.ShaderChunk.colorspace_pars_fragment = THREE.ShaderChunk.colorspace_pars_fragment.replace(
    /vec4 sRGBTransferOETF[^}]*\}/, 'vec4 sRGBTransferOETF( in vec4 value ) { return vec4( sqrt( value.rgb * 1.12 ), value.a ); }');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  let scale = Math.min(devicePixelRatio, 2);
  renderer.setPixelRatio(scale);
  renderer.toneMappingExposure = theme.exposure;
  renderer.toneMapping = THREE.LinearToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(62, 1, 0.3, 6000);
  const track = buildTrack(theme.layout, theme.half);
  theme.build({ scene, track, anisotropy: Math.min(2, renderer.capabilities.getMaxAnisotropy()), fine: false });
  const probe = new THREE.Object3D(), ahead = new THREE.Object3D(), at = new THREE.Vector3();
  place(track, theme.start, 0, probe);
  probe.position.y += 1.6;
  const skies: THREE.Object3D[] = [];
  scene.traverse((o) => { if (o.name === 'sky') skies.push(o); });
  for (const sky of skies) sky.position.copy(probe.position);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const surroundings = pmrem.fromScene(scene, 0, 0.3, 5000, { position: probe.position });
  pmrem.dispose();
  const matcap = bakeMatcap(renderer, surroundings.texture, night);
  surroundings.dispose();
  bakeLight(scene);

  const liveries = liveriesOf(theme);
  const fleet = new Fleet(kits, matcap, night, liveries.some((look) => look.underglow !== undefined), 8);
  scene.add(fleet.group);
  const smoke = new Puffs({ color: night ? 0x9aa6c4 : 0xe6e0d6, opacity: night ? 0.13 : 0.15, size: 2.6, additive: false, life: 0.7, rise: 1.6 }, 240);
  scene.add(smoke.points);
  const dust = theme.spray ? new Puffs({ ...theme.spray, life: 0.9, rise: 1.2 }, 240) : null;
  if (dust) scene.add(dust.points);

  const cars: THREE.Group[] = [];
  const map = mountMap(mapCanvas, track);
  const hex = (color: number) => `#${color.toString(16).padStart(6, '0')}`;
  let colors: string[] = [];
  let seated = '', mine = -1, drawing = 0;
  /** Los últimos cuadros, del más viejo al más nuevo. */
  const frames: Frame[] = [];
  /** Cuánto hay que sumarle al reloj de este celular para tener el de la carrera, y cada cuánto llegan los cuadros. */
  let offset = NaN, every = 0.033, lastArrival = 0;
  let pose: CarFrame[] | null = null;

  function seat(list: Shared['cars'], me: number): void {
    mine = list.findIndex((car) => car.id === me);
    const key = JSON.stringify(list) + mine;
    if (key === seated) return;
    seated = key;
    for (const car of cars.splice(0)) scene.remove(car);
    colors = list.map((entry) => hex(liveries[entry.look % liveries.length].paint));
    list.forEach((entry, i) => {
      const style = liveries[entry.look % liveries.length], model = entry.model % kits.length;
      const car = buildCar(kits[model][0], style, false, night, true, model);
      // Los rivales llevan su nombre encima; el propio no, que ya se sabe cuál es y taparía la pista.
      if (entry.id !== null && i !== mine) car.add(nameTag(entry.name, style.paint));
      cars.push(car);
      scene.add(car);
    });
  }

  function push(frame: Frame): void {
    const arrived = performance.now() / 1000;
    const newest = frames[frames.length - 1];
    // Una carrera nueva arranca con el reloj atrás: lo de la anterior no sirve.
    if (newest && frame.clock < newest.clock - 0.5) frames.length = 0;
    // Con la carrera terminada el reloj se queda quieto: alcanza con el último.
    if (newest && frame.clock <= newest.clock) frames.pop();
    frames.push(frame);
    if (frames.length > KEPT) frames.shift();
    if (lastArrival) every += (Math.min(0.5, arrived - lastArrival) - every) * 0.1;
    lastArrival = arrived;
    // El reloj de la carrera se sigue de a poco: un cuadro que llega tarde no lo hace saltar.
    const seen = frame.clock - arrived;
    offset = Number.isNaN(offset) || Math.abs(seen - offset) > 0.5 ? seen : offset + (seen - offset) * 0.08;
  }

  /** Los autos en el instante que se dibuja: un poco atrás del último cuadro, para tener siempre entre cuáles suavizar. */
  function sample(): CarFrame[] | null {
    if (!frames.length) return null;
    const when = (drawing = performance.now() / 1000 + offset - Math.min(0.3, Math.max(0.045, every * 1.3)));
    let k = frames.length - 1;
    while (k > 0 && frames[k - 1].clock > when) k--;
    const b = frames[k], a = frames[k - 1];
    if (when >= b.clock || !a || a.cars.length !== b.cars.length) {
      // No llegó el cuadro que sigue: el auto sigue de largo un momento a la velocidad que traía.
      const coast = Math.max(0, Math.min(COAST, when - b.clock));
      return b.cars.map((car) => ({ ...car, s: car.s + car.v * Math.cos(car.heading) * coast }));
    }
    const t = (when - a.clock) / (b.clock - a.clock);
    return b.cars.map((car, i) => blend(a.cars[i], car, Math.max(0, t)));
  }

  let last = performance.now(), clock = 0, eye = 0, eyeLane = 0, fov = 62, snap = true, running = true;
  let counted = 0, since = last, showing = false, skip = false;

  function draw(): void {
    if (!running) return;
    requestAnimationFrame(draw);
    const stamp = performance.now(), dt = Math.min(0.1, (stamp - last) / 1000);
    last = stamp;
    clock += dt;
    if (canvas.width !== Math.round(canvas.clientWidth * scale) || canvas.height !== Math.round(canvas.clientHeight * scale)) {
      renderer.setPixelRatio(scale);
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      camera.aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
    }
    if (!canvas.clientWidth) return;
    // El auto quieto en la sala no pide sesenta cuadros: con la mitad alcanza y el celular no calienta.
    if (showing && (skip = !skip)) return;
    pose = sample();
    if (!pose || pose.length !== cars.length) return;
    pose.forEach((car, i) => {
      const mesh = cars[i];
      place(track, car.s, car.d, mesh);
      mesh.rotateY(car.heading);
      animate(mesh, { metres: car.s, steer: car.steer, speed: car.v, boosting: car.boosting, braking: car.braking, time: clock, rough: car.offTrack });
      if (car.drifting) for (const side of [-0.85, 0.85]) {
        if (Math.random() > dt * 26) continue;
        place(track, car.s - 1.7, car.d + side, probe);
        smoke.emit(at.copy(probe.position).setY(probe.position.y + 0.2), 0, 0.8, 0, 1.2);
      }
      if (dust && car.v > 12 && Math.random() < (car.offTrack ? 1 : car.v / 140)) {
        place(track, car.s - 1.9, car.d + (Math.random() < 0.5 ? -0.85 : 0.85), probe);
        dust.emit(at.copy(probe.position).setY(probe.position.y + 0.15), 0, 0.6, 0, car.offTrack ? 3 : 1.4);
      }
    });
    smoke.update(dt);
    dust?.update(dt);

    // La cámara va atrás del auto propio; quien no corre esta carrera mira al que va primero.
    const me = pose[mine] ?? pose.reduce((first, car) => (car.s > first.s ? car : first), pose[0]);
    if (showing) {
      const car = cars[mine] ?? cars[0], turn = clock * 0.35;
      camera.position.set(car.position.x + Math.cos(turn) * 6.2, car.position.y + 1.7, car.position.z + Math.sin(turn) * 6.2);
      camera.lookAt(car.position.x, car.position.y + 0.55, car.position.z);
      camera.fov = fov = 38;
      snap = true;
    } else {
    const ease = snap ? 1 : Math.min(1, dt * 7);
    snap = false;
    eye += (me.s - eye) * (Math.abs(me.s - eye) > 40 ? 1 : Math.min(1, dt * 14));
    eyeLane += (me.d - eyeLane) * ease;
    fov += (62 + (me.v / TUNING.topSpeed) * 9 + (me.boosting ? 8 : 0) - fov) * ease;
    place(track, eye - 6.6, eyeLane * 0.9, probe);
    place(track, eye + 16, eyeLane * 0.45, ahead);
    camera.position.copy(probe.position).setY(probe.position.y + 2.05);
    camera.lookAt(ahead.position.x, ahead.position.y + 0.7, ahead.position.z);
    camera.fov = fov;
    }
    camera.updateProjectionMatrix();
    for (const sky of skies) sky.position.copy(camera.position);
    camera.updateMatrixWorld();
    fleet.sync(cars, camera);
    renderer.render(scene, camera);
    if (!showing) map(pose.map((car, i) => ({ s: car.s, d: car.d, color: colors[i], me: i === mine })));

    // Si este celular no llega a los cuadros, se dibuja con menos puntos antes que a los saltos.
    if (++counted >= 90) {
      const fps = (counted * 1000) / (stamp - since);
      counted = 0;
      since = stamp;
      if (!showing && fps < 45 && scale > 0.75) scale = Math.max(0.75, scale * 0.8);
    }
  }
  requestAnimationFrame(draw);

  return {
    track, seat, push,
    now: () => pose,
    show(on) { showing = on; },
    self: () => pose?.[mine] ?? null,
    clock: () => drawing,
    stop() {
      running = false;
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
