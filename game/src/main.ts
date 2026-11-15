import * as THREE from 'three';
import './style.css';
import { buildComposer } from './render/fx';
import { mountHud } from './hud';
import { mountLobby } from './host/lobby';
import { Session } from './host/session';
import type { Command, Shared } from './net/protocol';
import { Race, TUNING, type RaceEvent } from './sim/race';
import { animate, buildCar, repaint, loadCarKit } from './world/car';
import { mirror } from './world/mirror';
import { Puffs } from './world/spray';
import { buildTrack, curvature, place } from './world/track';
import { cinta } from './themes/cinta';
import { neon } from './themes/neon';
import { puna } from './themes/puna';
import type { Theme } from './themes/theme';

const THEMES: Record<string, Theme> = { puna, neon, cinta };
const NAMES = ['Vale', 'Tino', 'Maxi', 'Sofi', 'Nacho', 'Lu'];
/** Los autos que nadie maneja. */
const BOTS = ['Rayo', 'Tuerca', 'Nafta', 'Pistón', 'Bujía', 'Llanta'];
/** Pinturas para el séptimo y el octavo: cada pista trae seis. */
const EXTRA_PAINT = [0x7a3fd0, 0x3fb8d0];
const LAPS = 3;
/** La grilla se completa con bots hasta acá, y no pasa de lo que entra en la sala. */
const MIN_CARS = 6, MAX_CARS = 8;
/** Cuánto se espera a los que faltan desde que llega el primero. */
const GRACE = 30;
/** Hasta dónde se abre la cámara para que entren todos: más atrás que eso, sigue a los de adelante. */
const MAX_SPAN = 70;
const GRID_S = -14;

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
// Dentro del launcher la dirección trae el secreto de la sala: la pared pasa a ser el anfitrión.
const hash = new URLSearchParams(location.hash.slice(1));
const secret = hash.get('s');
const hosting = secret !== null;

document.querySelectorAll<HTMLAnchorElement>('#pick a').forEach((link) => {
  if (link.id === 'cam') link.href = `?t=${key}&cam=${view === 'tv' ? 'chase' : 'tv'}`;
  else if (link.getAttribute('href') === `?t=${key}`) link.classList.add('on');
});
if (frozen !== null || hosting) document.getElementById('pick')!.style.display = 'none';

const keys = new Set<string>();
addEventListener('keydown', (e) => keys.add(e.code));
addEventListener('keyup', (e) => keys.delete(e.code));

async function start(): Promise<void> {
  // Los rótulos se pintan en texturas: la tipografía tiene que estar cargada antes.
  const [kit] = await Promise.all([loadCarKit(fine), document.fonts.load('800 64px Archivo'), document.fonts.load('500 16px "Geist Mono"')]);

  const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('view') as HTMLCanvasElement, antialias: query.has('aa') ? query.get('aa') !== '0' : !fine, powerPreference: 'high-performance' });
  renderer.setPixelRatio(query.has('px') ? Number(query.get('px')) : fine ? Math.min(devicePixelRatio, 1.5) : 1);
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.toneMappingExposure = theme.exposure;
  {
    // En el proyector no hay consola a mano: esta línea queda en el registro del equipo y dice con qué se está dibujando.
    const gl = renderer.getContext();
    const gpu = gl.getExtension('WEBGL_debug_renderer_info');
    console.info(`carrera: ${gl.getParameter(gl.VERSION)} · ${gpu ? gl.getParameter(gpu.UNMASKED_RENDERER_WEBGL) : 'gpu sin nombre'} · ${innerWidth}x${innerHeight} · calidad ${fine ? 'alta' : 'baja'}`);
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.3, 6000);
  const track = buildTrack(theme.layout, theme.half);
  const world = theme.build({ scene, track, anisotropy: Math.min(fine ? 8 : 2, renderer.capabilities.getMaxAnisotropy()), fine });

  // Los reflejos de la pintura salen del mundo de verdad, fotografiado una vez desde la pista.
  const probe = new THREE.Object3D(), ahead = new THREE.Object3D();
  place(track, theme.start, 0, probe);
  probe.position.y += 1.6;
  scene.traverse((o) => { if (o.name === 'sky') o.position.copy(probe.position); });
  if (query.get('env') !== '0') {
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(scene, 0, 0.3, 5000, { position: probe.position }).texture;
    pmrem.dispose();
  }
  // Diagnóstico: cambia los materiales con brillo y reflejo por otros más baratos de dibujar.
  const cheap = new Map<THREE.Material, THREE.Material>();
  const cheapen = (root: THREE.Object3D): void => {
    const kind = query.get('mat');
    if (!kind) return;
    const swap = (m: THREE.Material): THREE.Material => {
      const s = m as THREE.MeshStandardMaterial;
      if (!s.isMeshStandardMaterial) return m;
      let to = cheap.get(m);
      if (!to) {
        const p = { color: s.color, map: s.map, transparent: s.transparent, opacity: s.opacity, side: s.side, vertexColors: s.vertexColors, fog: s.fog, alphaTest: s.alphaTest, depthWrite: s.depthWrite };
        to = kind === 'basic' ? new THREE.MeshBasicMaterial(p) : new THREE.MeshLambertMaterial({ ...p, emissive: s.emissive, emissiveMap: s.emissiveMap, emissiveIntensity: s.emissiveIntensity });
        cheap.set(m, to);
      }
      return to;
    };
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) mesh.material = Array.isArray(mesh.material) ? mesh.material.map(swap) : swap(mesh.material);
    });
  };
  cheapen(scene);

  const course = { length: track.length, half: track.half, wall: theme.wall, curvature: (s: number) => curvature(track, s) };
  /** Los autos para elegir: los seis de la pista y dos más con otra pintura. */
  const liveries = [...theme.cars, ...EXTRA_PAINT.map((paint, k) => ({ ...theme.cars[k], paint }))];
  /** Qué auto lleva cada lugar de la grilla. */
  let livery: number[] = [];
  const styleOf = (i: number) => liveries[livery[i] ?? i % liveries.length];
  const showHud = query.get('hud') !== '0';
  const cars: THREE.Group[] = [];
  /** Quién maneja cada auto de la grilla: el número de jugador en la sala, o null si es un bot. */
  let grid: (number | null)[] = [];
  let names: string[] = [];
  let race!: Race;
  let hud: ReturnType<typeof mountHud> | null = null;

  /** Arma la grilla: una carrera nueva con un auto por cada uno, parados detrás de la línea. */
  function line(drivers: (number | null)[], labels: string[], looks: number[] = drivers.map((_, i) => i % liveries.length)): void {
    grid = drivers;
    names = labels;
    livery = looks;
    race = new Race(course, LAPS, grid.map((id) => id === null));
    while (cars.length > grid.length) scene.remove(cars.pop()!);
    while (cars.length < grid.length) {
      const car = buildCar(kit, styleOf(cars.length), fine, theme.night ?? false);
      cheapen(car);
      cars.push(car);
      scene.add(car);
    }
    cars.forEach((car, i) => repaint(car, styleOf(i)));
    hud = showHud ? mountHud({ track: theme.name, laps: LAPS, cinta: theme.trail === undefined, players: grid.map((_, i) => ({ name: names[i], paint: styleOf(i).paint })) }) : null;
  }
  // En la maqueta el primer auto es del teclado (jugador 0) y el resto corre solo.
  line(theme.cars.map((_, i) => (demo || hosting || i > 0 ? null : 0)), hosting ? BOTS : NAMES);
  const dust = theme.spray ? new Puffs({ ...theme.spray, life: 0.9, rise: 1.2 }, 480) : null;
  const sparks = new Puffs({ color: 0xffb060, opacity: 1, size: 0.5, additive: true, life: 0.45, rise: -14 }, 240);
  (sparks.points.material as THREE.ShaderMaterial).uniforms.color.value.multiplyScalar(6);
  scene.add(sparks.points);
  if (dust) scene.add(dust.points);
  // El humo de las gomas al derrapar: claro de día, azulado bajo las luces de la noche.
  const smoke = new Puffs({ color: theme.night ? 0x9aa6c4 : 0xe6e0d6, opacity: theme.night ? 0.13 : 0.15, size: 2.6, additive: false, life: 0.7, rise: 1.6 }, 320);
  scene.add(smoke.points);

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
  if (!composer && query.get('tone') !== '0') renderer.toneMapping = THREE.ACESFilmicToneMapping;

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

  let shake = 0, eye = GRID_S, eyeLane = 0, span = 0, fov = 60, clock = 0, snap = true;
  const at = new THREE.Vector3();

  // --- La sala: solo cuando la pared corre dentro del launcher ---
  let stage: Shared['phase'] = hosting ? 'lobby' : 'countdown';
  let results: Shared['results'] = [];
  let resultPaint: number[] = [];
  let firstFinish = 0, sinceTold = 0;
  const buzz: number[] = [];
  const lobby = hosting ? mountLobby(hash.get('qr') ?? '') : null;
  /** El auto que eligió cada uno. Sobrevive al cambio de pista, que recarga la página. */
  const picks = new Map<number, number>((query.get('autos') ?? '').split('-').filter(Boolean).map((pair) => pair.split('.').map(Number) as [number, number]));
  const paintOf = (id: number) => liveries[picks.get(id) ?? -1]?.paint ?? 0x6b6862;

  function share(): void {
    if (!session) return;
    const leadName = session.seats.find((seat) => seat.id === session!.lead)?.name ?? null;
    session.share({
      phase: stage, track: theme.name, laps: LAPS, lead: session.lead, results, secure: Number(hash.get('tls')) || 0,
      players: session.seats.map((seat) => ({ id: seat.id, name: seat.name, paint: paintOf(seat.id), on: seat.on })),
      racing: stage === 'lobby' ? [] : grid.filter((id): id is number => id !== null),
    });
    const waiting = stage === 'lobby' || stage === 'results';
    hud?.show(!waiting);
    if (!waiting) return lobby?.hide();
    lobby?.show({
      track: theme.name, laps: LAPS, lead: leadName,
      players: session.seats.map((seat) => ({ name: seat.name, paint: paintOf(seat.id), on: seat.on })),
      results: stage === 'results' ? results.map((r, i) => ({ name: r.name, time: r.time, paint: resultPaint[i] })) : null,
    });
  }

  /** Sienta en la grilla a los que están conectados y completa con bots. */
  function seat(): void {
    const seats = session!.seats.filter((s) => s.on).slice(0, MAX_CARS);
    const fill = Math.max(0, MIN_CARS - seats.length);
    // Cada uno con el auto que eligió si sigue libre, o el primero que quede; los bots, con lo que sobra.
    const free = liveries.map((_, k) => k);
    const take = (wanted?: number) => free.splice(Math.max(0, free.indexOf(wanted ?? -1)), 1)[0];
    for (const s of seats) picks.set(s.id, take(picks.get(s.id)));
    line([...seats.map((s) => s.id), ...Array<null>(fill).fill(null)], [...seats.map((s) => s.name), ...BOTS.slice(0, fill)], [...seats.map((s) => picks.get(s.id)!), ...Array.from({ length: fill }, () => take())]);
    snap = true;
  }

  function launch(): void {
    if (stage !== 'lobby') return;
    stage = 'countdown';
    results = [];
    firstFinish = 0;
    snap = true;
    race.start();
    share();
  }

  function toLobby(): void {
    stage = 'lobby';
    results = [];
    seat();
    share();
  }

  /** El auto de al lado, salteando los que ya tienen dueño. */
  function otherCar(id: number, step: number): void {
    const seats = session!.seats.filter((s) => s.on).slice(0, MAX_CARS);
    if (stage !== 'lobby' || !seats.some((s) => s.id === id)) return;
    const taken = new Set(seats.filter((s) => s.id !== id).map((s) => picks.get(s.id)));
    let next = picks.get(id) ?? 0;
    do next = (next + step + liveries.length) % liveries.length; while (taken.has(next));
    picks.set(id, next);
    seat();
    share();
  }

  /** Otra pista es otra página: el mundo anterior se suelta entero, que en un equipo con poca memoria importa. */
  function otherTrack(step: number): void {
    if (stage !== 'lobby' && stage !== 'results') return;
    const all = Object.keys(THEMES);
    query.set('autos', [...picks].map(([id, look]) => `${id}.${look}`).join('-'));
    query.set('t', all[(all.indexOf(THEMES[key] ? key : 'puna') + step + all.length) % all.length]);
    location.replace(`?${query.toString()}${location.hash}`);
  }

  function obey(command: Command): void {
    if (command.a === 'track') otherTrack(command.d);
    else if (command.a === 'start') launch();
    else if (stage === 'results') toLobby();
  }

  const session = hosting ? new Session(secret, {
    roster() {
      if (stage === 'lobby') seat();
      // En plena carrera, el auto del que se cayó lo lleva un bot hasta que vuelva.
      else grid.forEach((id, i) => { race.cars[i].bot = id === null || !session!.seats.some((s) => s.id === id && s.on); });
      share();
    },
    command(from, command) {
      if (command.a === 'car') otherCar(from, command.d === -1 ? -1 : 1);
      else if (from === session!.lead) obey(command);
    },
  }) : null;
  if (hosting) {
    // El control remoto del proyector también maneja la sala.
    const remote = (key: string) => {
      if (key === 'left' || key === 'right') otherTrack(key === 'left' ? -1 : 1);
      else if (key === 'ok') obey(stage === 'lobby' ? { a: 'start' } : { a: 'lobby' });
    };
    // En el proyector las teclas las manda el launcher; en una notebook, el teclado.
    (window as unknown as { carreraKey: typeof remote }).carreraKey = remote;
    addEventListener('keydown', (e) => remote(e.code === 'ArrowLeft' ? 'left' : e.code === 'ArrowRight' ? 'right' : e.code === 'Enter' || e.code === 'NumpadEnter' ? 'ok' : ''));
    share();
  }

  /** Lo de la sala que pasa cuadro a cuadro: volantes que entran, la carrera que termina, y el aviso a cada celular. */
  function host(events: RaceEvent[], order: number[], dt: number): void {
    for (const event of events) {
      if (event.type === 'finish' && firstFinish === 0) firstFinish = race.clock;
      if (event.type === 'wall' || event.type === 'hit') buzz[event.car] = Math.max(buzz[event.car] ?? 0, Math.min(1, event.force));
    }
    if (stage === 'countdown' && race.phase !== 'countdown') stage = 'race';
    if (stage === 'race') {
      const humansIn = grid.every((id, i) => id === null || race.cars[i].bot || race.cars[i].finished !== null);
      if (race.phase === 'done' || (firstFinish > 0 && race.clock - firstFinish > (humansIn ? 3 : GRACE))) {
        stage = 'results';
        results = order.map((i) => ({ id: grid[i], name: names[i], time: race.cars[i].finished }));
        resultPaint = order.map((i) => styleOf(i).paint);
      }
    }
    share();
    sinceTold += dt;
    if (sinceTold < 0.1 || stage === 'lobby') return;
    sinceTold = 0;
    grid.forEach((id, i) => {
      if (id === null || race.cars[i].bot) return;
      const car = race.cars[i];
      session!.tell(id, { place: order.indexOf(i) + 1, of: grid.length, lap: car.lap, nitro: Math.round(car.nitro * 100) / 100, speed: Math.round(car.v * 3.6), off: car.offTrack, buzz: buzz[i] ?? 0 });
      buzz[i] = 0;
    });
  }

  function react(events: RaceEvent[], focus: number): void {
    for (const event of events) {
      if (event.type !== 'wall' && event.type !== 'hit') continue;
      const car = race.cars[event.car];
      // Las chispas saltan del lado del golpe, hacia atrás y hacia arriba.
      const side = event.type === 'wall' ? Math.sign(car.d) : Math.sign(race.cars[event.other].d - car.d) || 1;
      place(track, car.s, car.d + side * 1.05, probe);
      for (let k = 0; k < 6 + event.force * 22; k++) sparks.emit(at.copy(probe.position).setY(probe.position.y + 0.35), 0, 3 + event.force * 4, 0, 7 + event.force * 8);
      if (event.type === 'hit' && event.other === focus) shake = Math.max(shake, 0.25 + event.force * 0.6);
    }
  }

  function frame(dt: number, draw = true): void {
    if (session) grid.forEach((id, i) => { if (id !== null && !race.cars[i].bot) Object.assign(race.inputs[i], session.input(id)); });
    else if (!demo) {
      const input = race.inputs[0];
      input.steer = (keys.has('ArrowLeft') ? 1 : 0) - (keys.has('ArrowRight') ? 1 : 0);
      input.brake = keys.has('ArrowDown') || keys.has('Space');
      input.nitro = keys.has('ArrowUp') || keys.has('ShiftLeft');
      input.drift = keys.has('KeyX') || keys.has('ControlLeft');
    }
    // A quiénes sigue la cámara: a los que manejan. Si no maneja nadie, al segundo, que siempre tiene a quién pasar.
    let watched = grid.map((id, i) => (id !== null && !race.cars[i].bot ? i : -1)).filter((i) => i >= 0);
    if (!watched.length) watched = [race.order()[Math.min(1, grid.length - 1)]];
    const events = race.advance(dt);
    const order = race.order();
    const front = Math.max(...watched.map((i) => race.cars[i].s));
    // Los que quedaron demasiado atrás salen de cuadro: la cámara se queda con el grupo de adelante.
    const inShot = watched.filter((i) => race.cars[i].s >= front - MAX_SPAN);
    const back = Math.min(...inShot.map((i) => race.cars[i].s));
    const focus = inShot.reduce((a, b) => (race.cars[b].s > race.cars[a].s ? b : a));
    for (const event of events) if ((event.type === 'wall' || event.type === 'hit') && inShot.includes(event.car)) shake = Math.max(shake, 0.25 + event.force * 0.6);
    react(events, focus);
    if (session) host(events, order, dt);
    clock += dt;

    cars.forEach((mesh, i) => {
      const car = race.cars[i];
      place(track, car.s, car.d, mesh);
      // Derrapando, la cola se cruza y las ruedas de adelante apuntan para el otro lado.
      mesh.rotateY(car.yaw + car.slip);
      animate(mesh, { metres: car.s, steer: car.steer - car.slip * 1.5, speed: car.v, boosting: car.boosting, braking: car.braking, time: clock });
      // Las ruedas traseras levantan polvo o agua: más cuanto más rápido, y mucho más fuera del asfalto.
      if (dust && car.v > 12 && Math.random() < (car.offTrack ? 1 : car.v / 140)) {
        place(track, car.s - 1.9, car.d + (Math.random() < 0.5 ? -0.85 : 0.85), probe);
        dust.emit(at.copy(probe.position).setY(probe.position.y + 0.15), 0, 0.6, 0, car.offTrack ? 3 : 1.4);
      }
      // El humo sale de las dos ruedas de atrás, por tiempo y no por cuadro: a 30 cuadros no es la mitad de humo.
      if (car.drifting) for (const side of [-0.85, 0.85]) {
        if (Math.random() > dt * 26 * Math.min(1, Math.abs(car.slip) * 4)) continue;
        place(track, car.s - 1.7, car.d + side - Math.sin(car.slip) * 1.7, probe);
        smoke.emit(at.copy(probe.position).setY(probe.position.y + 0.2), 0, 0.8, 0, 1.2);
      }
    });
    smoke.update(dt);
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
    const cut = frozen !== null || snap;
    snap = false;
    const ease = Math.min(1, dt * 6);
    const lane = inShot.reduce((sum, i) => sum + race.cars[i].d, 0) / inShot.length;
    eye += ((stage === 'lobby' ? GRID_S : back) - eye) * (cut ? 1 : Math.min(1, dt * 10));
    eyeLane += (lane - eyeLane) * (cut ? 1 : ease);
    span += (front - back - span) * (cut ? 1 : Math.min(1, dt * 2.5));
    fov += ((stage === 'lobby' ? 44 : view === 'tv' ? 30 : view === 'foto' ? 38 : 58 + (me.v / TUNING.topSpeed) * 8 + (me.boosting ? 7 : 0)) - fov) * (cut ? 1 : ease);
    shake = Math.max(0, shake - dt * 1.8);
    if (stage === 'lobby') {
      // En la sala la cámara da vueltas despacio alrededor de la grilla: cada uno ve aparecer su auto.
      const turn = clock * 0.11;
      place(track, GRID_S + Math.cos(turn) * 17, Math.sin(turn) * (track.half - 1.6), probe);
      place(track, GRID_S, 0, ahead);
      camera.position.copy(probe.position).add(new THREE.Vector3(0, 2 + Math.sin(turn * 0.7) * 0.5, 0));
      camera.lookAt(ahead.position.x, ahead.position.y + 0.6, ahead.position.z);
    } else if (view === 'tv') {
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
      // Con varios manejando, la cámara retrocede y sube lo que haga falta para que entren todos.
      place(track, eye - 7.4 - span * 0.3, eyeLane * 0.85, probe);
      place(track, eye + span * 0.6 + 18, eyeLane * 0.35, ahead);
      camera.position.copy(probe.position).add(new THREE.Vector3((Math.random() - 0.5) * shake * 0.5, 2.25 + span * 0.2 + (Math.random() - 0.5) * shake * 0.5, 0));
      camera.lookAt(ahead.position.x, ahead.position.y + 0.8, ahead.position.z);
    }
    camera.fov = fov;
    // En la sala el código ocupa la izquierda: la imagen se corre para que la grilla quede en lo que se ve.
    const waiting = hosting && (stage === 'lobby' || stage === 'results');
    if (waiting) camera.setViewOffset(innerWidth, innerHeight, -innerHeight * 0.23, 0, innerWidth, innerHeight);
    else if (camera.view) camera.clearViewOffset();
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

  // Si el equipo pierde el contexto gráfico, se empieza de nuevo: la sala sigue en el launcher.
  renderer.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault(); setTimeout(() => location.reload(), 500); });

  if (!hosting) race.start();
  if (frozen !== null) {
    // Se corre sin dibujar hasta el segundo pedido, y los últimos cuadros con efectos para que haya polvo y chispas.
    race.advance(0);
    for (let t = -TUNING.countdown; t < frozen - 1; t += 1 / 60) race.advance(1 / 60);
    renderer.info.autoReset = false;
    for (let k = 0; k < 60; k++) frame(1 / 60, k === 59);
    document.title = `listo ${renderer.info.render.calls} ${renderer.info.render.triangles}`;
  } else {
    // En calidad baja, si no alcanza, se dibuja con menos puntos antes que con menos cuadros.
    const meter = query.has('fps') ? document.body.appendChild(Object.assign(document.createElement('div'), { id: 'fps' })) : null;
    let last = performance.now(), frames = 0, since = last, scale = query.has('px') ? Number(query.get('px')) : 1;
    renderer.setAnimationLoop(() => {
      const now = performance.now();
      frame(Math.min(0.1, (now - last) / 1000));
      last = now;
      if (++frames < 90) return;
      const fps = (frames * 1000) / (now - since);
      frames = 0;
      since = now;
      if (!fine && !query.has('px') && fps < 26 && scale > 0.5) {
        scale = Math.max(0.5, scale - 0.125);
        renderer.setPixelRatio(scale);
        resize();
      }
      if (meter) meter.textContent = `${fps.toFixed(0)} FPS · ${Math.round(scale * 100)}% · ${renderer.info.render.triangles} TRI · ${renderer.info.render.calls} DIB`;
    });
  }
}

void start();
