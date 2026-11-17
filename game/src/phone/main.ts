import './style.css';
import logoUrl from '../../../app/src/main/assets/remote/logo.svg';
import { decodeFrame } from '../net/frame';
import { connect, type Link } from '../net/link';
import { MODELS, type Command, type FromRoom, type Mine, type Shared, type Wish } from '../net/protocol';
import { Tilt } from './tilt';
import type { View } from './view';

const params = new URLSearchParams(location.hash.slice(1));
const room = params.get('r') ?? '';
/** El pase de mando: lo trae solo quien entra desde el control del proyector siendo su dueño. */
const ticket = params.get('l') ?? '';
/**
 * Quien entra desde el control del proyector puede volver a él. En la dirección segura sin advertencias esa
 * página no existe (ahí solo se atiende la carrera): se vuelve a la dirección de siempre.
 */
const control = !params.has('c') ? '' : /\.local-ip\.sh$/.test(location.hostname)
  ? `http://${location.hostname.replace('.local-ip.sh', '').replace(/-/g, '.')}:${params.get('h') || '8686'}/`
  : '/';
const store = (key: string, value?: string): string => {
  try {
    if (value !== undefined) localStorage.setItem(`carrera.${key}`, value);
    return localStorage.getItem(`carrera.${key}`) ?? '';
  } catch {
    return '';
  }
};

const app = document.getElementById('app')!;
const drive = document.createElement('section');
drive.id = 'drive';
document.body.appendChild(drive);

const tilt = new Tilt();
tilt.invert = store('invert') === '1';
let link: Link | null = null;
let online = false;
let me: { id: number; name: string } | null = null;
let shared: Shared | null = null;
let mine: Mine | null = null;
let problem = '';
let useTilt = false;
/** El menú de la carrera abierto, y el nombre en edición en la sala. */
let menu = false;
let renaming = false;

/**
 * El sensor de inclinación solo se entrega a páginas seguras. Si el proyector tiene la dirección segura que los
 * celulares aceptan sin avisos, el volante se muda a ella antes de entrar a la sala; si no responde, se queda acá.
 */
function upgrade(): void {
  const port = params.get('p');
  if (isSecureContext || !port || !/^\d+\.\d+\.\d+\.\d+$/.test(location.hostname)) return;
  const secure = `https://${location.hostname.replace(/\./g, '-')}.local-ip.sh:${port}`;
  const late = new Promise<never>((_, fail) => setTimeout(fail, 3000));
  Promise.race([fetch(`${secure}/carrera/volante.html`, { mode: 'no-cors', cache: 'no-store' }), late])
    .then(() => { if (!me) location.replace(`${secure}${location.pathname}${location.hash}&h=${location.port || '80'}`); })
    .catch(() => undefined);
}
upgrade();
/** Cuánto hay que mover la mano para doblar a fondo: grados de inclinación, y recorrido de la palanca. */
const FEEL = [{ name: 'Suave', lock: 40, reach: 1.25 }, { name: 'Normal', lock: 30, reach: 1 }, { name: 'Rápido', lock: 21, reach: 0.72 }];
let feel = 1;
function setFeel(index: number): void {
  feel = FEEL[index] ? index : 1;
  tilt.lock = FEEL[feel].lock;
  store('giro', String(feel));
}
setFeel(store('giro') === '' ? 1 : Number(store('giro')));
const held = { brake: false, nitro: false, drift: false };
/** La palanca: de -1 a 1, positivo a la izquierda como en la carrera. */
let stick = 0;

/**
 * La carrera en 3D se arma apenas se sabe la pista, con la sala todavía en pantalla: al largar ya está lista.
 * Es lo pesado de la página (el mundo y los autos), por eso se baja aparte y no demora la entrada a la sala.
 */
let view: View | null = null;
let viewOf = '';
function stage(state: Shared): void {
  if (viewOf !== state.track) {
    viewOf = state.track;
    view?.stop();
    view = null;
    document.querySelector('#view')?.remove();
    drive.innerHTML = '';
    delete drive.dataset.tilt;
    buildDrive();
    const canvas = drive.querySelector<HTMLCanvasElement>('#view')!, map = drive.querySelector<HTMLCanvasElement>('.map')!;
    // Si un pedido se cae (el proyector atiende pocas conexiones por celular), se prueba de nuevo: sin la vista no hay carrera.
    const build = (tries: number): Promise<View> => import('./view').then(({ mountView }) => mountView(canvas, map, state.track))
      .catch((error) => (tries > 0 ? new Promise<View>((done) => setTimeout(() => done(build(tries - 1)), 900)) : Promise.reject(error)));
    void build(4).then((made) => {
      // Mientras cargaba pudo cambiar la pista: lo armado para la anterior se tira.
      if (viewOf !== state.track || !canvas.isConnected) return made.stop();
      view = made;
      view.show(!document.body.classList.contains('driving'));
      if (shared && me) view.seat(shared.cars, me.id);
    }).catch((error) => console.error('carrera: no se pudo armar la vista', error));
  }
  if (me) view?.seat(state.cars, me.id);
}

const hex = (color: number) => `#${color.toString(16).padStart(6, '0')}`;
const esc = (text: string) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const head = () => `<header><img src="${logoUrl}" alt="galfredev"><span class="tag ${online ? 'up' : ''}"><i></i>${online ? 'Conectado' : 'Sin conexión'}</span></header>`;
const command = (c: Command | Wish) => link?.send({ t: 'cmd', d: c });

function join(name: string): void {
  store('name', name);
  problem = '';
  link?.close();
  // La clave vale para esta sala: con otra sala se entra de cero.
  const key = () => (store('room') === room ? store('key') : '');
  link = connect(() => ({ t: 'join', room, name, key: key(), lead: ticket }), onMessage, (up) => {
    online = up;
    render();
  });
}

/** Deja la sala: el lugar queda libre y, si estaba corriendo, su auto sigue solo. */
function leave(): void {
  link?.send({ t: 'leave' });
  link?.close();
  link = null;
  me = null;
  shared = null;
  mine = null;
  menu = renaming = false;
  store('key', '');
  problem = '';
  render();
}

function onMessage(message: FromRoom): void {
  if (message.t === 'joined') {
    me = { id: message.id, name: message.name };
    store('room', room);
    store('key', message.key);
  } else if (message.t === 'error') {
    problem = { room: 'Esta sala ya cerró. Escaneá de nuevo el código de la pared.', name: 'Ese nombre no sirve. Probá con otro.', full: 'La sala está llena.', moved: 'Este volante se abrió en otra pestaña. Entrá de nuevo para manejar desde acá.', out: 'Te sacaron de la sala. Podés volver a entrar.' }[message.code];
    if (message.code === 'out') store('key', '');
    menu = renaming = false;
    link?.close();
    link = null;
    me = null;
  } else if (message.t === 'all') {
    const was = shared?.phase;
    shared = message.d;
    if (me) stage(shared);
    if (was !== shared.phase && (shared.phase === 'countdown' || shared.phase === 'lobby')) mine = null;
    // Al largar, como se esté sosteniendo el celular pasa a ser «derecho»: nadie arranca doblando.
    if (was !== shared.phase && (shared.phase === 'countdown' || shared.phase === 'race')) tilt.center();
    if (shared.phase !== 'countdown' && shared.phase !== 'race') menu = false;
  } else if (message.t === 'st') {
    const frame = decodeFrame(message.d);
    if (frame) view?.push(frame);
    return;
  } else if (message.t === 'you') {
    mine = message.d;
    if (mine.buzz > 0) navigator.vibrate?.(Math.round(40 + mine.buzz * 140));
    if (document.body.classList.contains('driving')) return paintDrive();
  } else if (message.t === 'host' && !message.on) {
    shared = null;
  } else return;
  render();
}

async function setTilt(on: boolean): Promise<void> {
  if (on) {
    useTilt = await tilt.start();
    if (useTilt) tilt.center();
    else problem = isSecureContext ? 'Este celular no informa la inclinación. Queda la palanca.' : 'La inclinación necesita la página segura. Queda la palanca.';
  } else {
    tilt.stop();
    useTilt = false;
  }
  render();
}

function render(): void {
  const racing = me && shared && (shared.phase === 'countdown' || shared.phase === 'race');
  document.body.classList.toggle('driving', !!racing);
  // La imagen de la carrera es un solo lienzo: en la sala muestra el auto propio y al largar ocupa la pantalla.
  // Antes de rehacer la sala vuelve a su lugar, que si no se va con lo que se borra.
  dock(drive);
  view?.show(!racing);
  turn(!!racing);
  if (racing) return buildDrive();
  if (!room) app.innerHTML = `${head()}<div class="fill stack" style="justify-content:center"><span class="tag">Carrera</span><h1>Escaneá el código de la pared</h1><p>Esta página se abre desde el código que muestra el proyector.</p></div>`;
  else if (!me) {
    app.innerHTML = `${head()}<div class="fill stack" style="justify-content:center">
      <div><span class="tag">Carrera</span><h1>Tu celular es el volante</h1><p>${problem ? esc(problem) : 'Poné tu nombre y entrá a la sala.'}</p></div>
      <input id="name" maxlength="16" autocomplete="off" autocapitalize="words" placeholder="Tu nombre" enterkeyhint="go" value="${esc(store('name') || params.get('n') || '')}">
      <button class="go cinta" id="enter">Entrar</button>
      ${control ? `<a class="quiet link" href="${control}">Volver al control del proyector</a>` : ''}</div>`;
    const input = app.querySelector<HTMLInputElement>('#name')!;
    input.addEventListener('keydown', (event) => { if (event.key === 'Enter') app.querySelector<HTMLElement>('#enter')!.click(); });
    app.querySelector('#enter')!.addEventListener('click', () => {
      if (!input.value.trim()) return;
      void document.documentElement.requestFullscreen?.().catch(() => undefined);
      // En la página segura el volante es el celular mismo, salvo que alguien ya haya elegido los botones.
      if (isSecureContext && store('control') !== 'stick' && store('control') !== 'botones') void setTilt(true);
      join(input.value.trim());
    });
  } else if (!shared) {
    app.innerHTML = `${head()}<div class="fill stack" style="justify-content:center"><span class="tag">Carrera</span><h1>Esperando a la pared</h1><p>Abrí Carrera en el proyector.</p></div>`;
  } else lobby(shared);
}

/**
 * Corriendo, la pantalla va acostada; en la sala, como la tenga cada uno. Solo se puede con la pantalla completa
 * (que se pide al entrar): donde el navegador no deja, la carrera se dibuja girada y es lo mismo.
 */
let turned = false;
function turn(flat: boolean): void {
  if (flat === turned) return;
  turned = flat;
  const orientation = screen.orientation as unknown as { lock?: (o: string) => Promise<void>; unlock?: () => void } | undefined;
  try {
    if (flat) void orientation?.lock?.('landscape').catch(() => undefined); else orientation?.unlock?.();
  } catch { /* sin permiso para girar: queda la pantalla girada por estilo */ }
}

function dock(into: Element | null): void {
  const canvas = document.querySelector<HTMLCanvasElement>('#view');
  if (canvas && into && canvas.parentElement !== into) into.insertBefore(canvas, into.firstChild);
}

function lobby(state: Shared): void {
  const self = state.players.find((p) => p.id === me!.id);
  // Maneja la sala quien tiene el mando, y siempre el celular del dueño del proyector.
  const lead = state.lead === me!.id || self?.boss === true;
  const done = state.phase === 'results';
  const place = done ? state.results.findIndex((r) => r.id === me!.id) + 1 : 0;
  const cup = state.cup.rounds > 1 ? state.cup : null;
  const points = (id: number | null) => cup?.table.find((row) => row.id === id);
  const rows = done
    ? state.results.map((r, i) => `<li><span class="tag">${i + 1}</span>${esc(r.name)}<span class="tag">${r.best === null ? '' : `${r.id !== null && r.id === state.record.byLap ? 'récord' : 'vuelta'} ${r.best.toFixed(2)} · `}${r.time === null ? '—' : `${r.time.toFixed(2)} s`}${points(r.id) ? ` · +${points(r.id)!.last}` : ''}</span></li>`)
    : state.players.map((p) => `<li class="${p.on ? '' : 'off'}"><i style="background:${hex(p.paint)}"></i><span class="name">${esc(p.name)}${p.id === me!.id ? ' <small class="tag">vos</small>' : ''}</span><span class="tag">${p.id === state.lead ? 'Mando' : ''}${cup && cup.done > 0 ? `${p.id === state.lead ? ' · ' : ''}${points(p.id)?.points ?? 0} pts` : ''}</span>${lead && p.id !== me!.id ? `${p.on && p.id !== state.lead ? `<button class="mini" data-lead="${p.id}">Dar mando</button>` : ''}<button class="mini" data-kick="${p.id}">Sacar</button>` : ''}</li>`);
  // La tabla del campeonato va debajo de la llegada; después de la última carrera, arriba y con el campeón.
  const ended = cup !== null && cup.done >= cup.rounds;
  const table = done && cup
    ? `<p class="tag title">${ended ? `Campeón: ${esc(cup.table[0]?.name ?? '')}` : `Campeonato · carrera ${cup.done} de ${cup.rounds}`}</p><ol>${cup.table.map((row, i) => `<li><span class="tag">${i + 1}</span>${esc(row.name)}<span class="tag">${row.points} pts</span></li>`).join('')}</ol>`
    : '';
  const mark = state.record.lap ? `Récord de vuelta ${state.record.lap.time.toFixed(2)} · ${esc(state.record.lap.name)}` : '';
  const mine = done && (state.record.byLap === me!.id || state.record.byRace === me!.id) ? ' · récord de pista' : '';
  const secure = !isSecureContext && state.secure ? `https://${location.hostname}:${state.secure}${location.pathname}${location.hash}` : '';
  const pick = (prev: string, next: string, tag: string, value: string, signs = '‹›') => `<div class="pick"><button class="quiet" id="${prev}" aria-label="${tag}: anterior">${signs[0]}</button><div><span class="tag">${tag}</span><b>${value}</b></div><button class="quiet" id="${next}" aria-label="${tag}: siguiente">${signs[1]}</button></div>`;
  app.innerHTML = `${head()}
    <div class="hall">
      <div class="hero">
        <span class="tag wait">Cargando la pista</span>
        <div class="who"><span class="tag">${done ? (place ? `Llegaste ${place}.º${mine}` : 'Final') : `${esc(state.track)} · ${state.laps === 1 ? '1 vuelta' : `${state.laps} vueltas`}`}</span><b>${esc(me!.name)}</b></div>
        ${done ? '' : `<div class="garage">${pick('car-prev', 'car-next', 'Pintura', `<i style="background:${hex(self?.paint ?? 0xf1ede6)}"></i>`)}${pick('model-prev', 'model-next', 'Modelo', esc(MODELS[self?.model ?? 0] ?? MODELS[0]))}</div>`}
      </div>
      <div class="side scroll">
        ${ended ? table : ''}${done && cup ? `<p class="tag title">Llegada</p>` : cup ? `<p class="tag title">Campeonato · carrera ${cup.done + 1} de ${cup.rounds}</p>` : '<p class="tag title">En la sala</p>'}<ol>${rows.join('')}</ol>${ended ? '' : table}${mark ? `<p class="tag title">${mark}</p>` : ''}
        ${problem ? `<p>${esc(problem)}</p>` : ''}
        <p class="tag title">Cómo manejás</p>
        <div class="row"><button class="quiet ${useTilt ? '' : 'on'}" id="touch">Palanca</button><button class="quiet ${useTilt ? 'on' : ''}" id="tilt">Inclinación</button></div>
        <div class="row"><button class="quiet" id="feel">Giro: ${FEEL[feel].name}</button>${useTilt ? `<button class="quiet ${tilt.invert ? 'on' : ''}" id="invert">Invertir</button>` : ''}</div>
        ${secure ? `<p>La inclinación solo anda en la página segura. <a href="${secure}" style="color:inherit">Abrirla</a>: el navegador va a avisar que el certificado es del proyector.</p>` : ''}
        ${lead && !done ? `<p class="tag title">La carrera</p><div class="stack">
          ${pick('prev', 'next', 'Pista', esc(state.track))}
          ${pick('shorter', 'further', 'Vueltas', String(state.laps), '−+')}
          ${pick('less', 'more', 'Rivales automáticos', String(Math.min(state.bots, state.room)), '−+')}
          ${state.cup.done === 0 ? pick('fewer', 'longer', 'Campeonato', state.cup.rounds > 1 ? `${state.cup.rounds} carreras` : 'Carrera suelta', '−+') : '<button class="quiet" id="again">Empezar el campeonato de cero</button>'}</div>` : ''}
        <p class="tag title">Tu lugar</p>
        ${renaming
          ? `<div class="row"><input id="rename" maxlength="16" autocomplete="off" autocapitalize="words" enterkeyhint="done" value="${esc(me!.name)}"><button class="quiet on" id="rename-ok">Guardar</button></div>`
          : `<div class="row"><button class="quiet" id="rename-go">Cambiar nombre</button><button class="quiet" id="leave">Salir de la sala</button></div>`}
        ${control ? `<a class="quiet link" href="${control}">Volver al control del proyector</a>` : ''}
        ${lead ? '<button class="quiet" id="close">Cerrar la carrera en el proyector</button>' : ''}
      </div>
    </div>
    <div class="foot">${lead ? `<button class="go cinta" id="start">${!done ? 'Largar' : ended ? 'Campeonato nuevo' : cup ? 'Siguiente carrera' : 'Otra carrera'}</button>` : `<p>${done ? 'Esperando otra carrera.' : 'Larga quien entró primero.'}</p>`}</div>`;
  dock(app.querySelector('.hero'));
  const on = (id: string, act: () => void) => app.querySelector(`#${id}`)?.addEventListener('click', act);
  app.querySelectorAll<HTMLElement>('[data-kick]').forEach((el) => el.addEventListener('click', () => command({ a: 'kick', id: Number(el.dataset.kick) })));
  app.querySelectorAll<HTMLElement>('[data-lead]').forEach((el) => el.addEventListener('click', () => command({ a: 'lead', id: Number(el.dataset.lead) })));
  on('rename-go', () => { renaming = true; render(); app.querySelector<HTMLInputElement>('#rename')?.focus(); });
  on('rename-ok', () => {
    const name = app.querySelector<HTMLInputElement>('#rename')!.value.trim();
    renaming = false;
    // Con su clave, la sala lo reconoce y solo le cambia el nombre.
    if (name && name !== me!.name) join(name); else render();
  });
  on('leave', leave);
  on('close', () => command({ a: 'close' }));
  on('feel', () => { setFeel((feel + 1) % FEEL.length); render(); });
  on('shorter', () => command({ a: 'laps', d: -1 }));
  on('further', () => command({ a: 'laps', d: 1 }));
  on('touch', () => { store('control', 'stick'); void setTilt(false); });
  on('tilt', () => { store('control', 'inclinacion'); void setTilt(true); });
  on('invert', () => {
    tilt.invert = !tilt.invert;
    store('invert', tilt.invert ? '1' : '0');
    render();
  });
  on('car-prev', () => command({ a: 'car', d: -1 }));
  on('car-next', () => command({ a: 'car', d: 1 }));
  on('model-prev', () => command({ a: 'model', d: -1 }));
  on('model-next', () => command({ a: 'model', d: 1 }));
  on('prev', () => command({ a: 'track', d: -1 }));
  on('next', () => command({ a: 'track', d: 1 }));
  on('less', () => command({ a: 'bots', d: -1 }));
  on('more', () => command({ a: 'bots', d: 1 }));
  on('fewer', () => command({ a: 'rounds', d: -1 }));
  on('longer', () => command({ a: 'rounds', d: 1 }));
  on('again', () => command({ a: 'cup' }));
  on('start', () => {
    // Pantalla completa y acostada, donde el navegador lo permita: tiene que salir de un toque.
    if (!document.fullscreenElement) void document.documentElement.requestFullscreen?.().catch(() => undefined);
    command(done ? { a: 'lobby' } : { a: 'start' });
  });
}

/** Si este celular corre la carrera que está en pista. Quien entró tarde la mira hasta la siguiente. */
const driving = () => !!(me && shared && shared.racing.includes(me.id));

function buildDrive(): void {
  if (drive.dataset.tilt === undefined) {
    const pad = (id: string, label: string) => `<div class="pad ${id}" data-pad="${id}"><b>${label}</b></div>`;
    drive.innerHTML = `<canvas id="view"></canvas>
      <div class="hud">
        <div class="pos"><div class="place"></div><span class="tag lap"></span></div>
        <div class="top"><b class="note"></b></div>
        <canvas class="map"></canvas>
        <div class="count"></div>
        <div class="speed"><b></b><span class="tag">km/h</span><div class="tank"><u></u></div></div>
        <div class="lean"><i></i></div>
      </div>
      <div class="zone"><div class="stick"><i></i></div><span class="tag hint"></span></div>
      <div class="keys">${pad('nitro', 'Nitro')}${pad('drift', 'Derrape')}${pad('brake', 'Freno')}</div>
      <button class="menu-btn" aria-label="Menú">Menú</button>
      <div class="menu"></div>`;
    drive.querySelectorAll<HTMLElement>('.pad').forEach((el) => {
      const set = (down: boolean) => (event: Event) => {
        event.preventDefault();
        // El botón sigue apretado aunque el pulgar se corra un poco: se suelta recién al levantar el dedo.
        if (down) el.setPointerCapture?.((event as PointerEvent).pointerId);
        held[el.dataset.pad as keyof typeof held] = down;
        el.classList.toggle('held', down);
      };
      el.addEventListener('pointerdown', set(true));
      for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) el.addEventListener(type, set(false));
    });
    // La palanca nace donde apoya el pulgar. Se lee solo para los costados: cuanto más lejos, más dobla.
    const zone = drive.querySelector<HTMLElement>('.zone')!, base = zone.querySelector<HTMLElement>('.stick')!, knob = base.querySelector<HTMLElement>('i')!;
    let finger = -1, ox = 0, oy = 0, box = zone.getBoundingClientRect(), tall = false;
    // Con el celular parado la pantalla entera está girada: lo ancho de la zona corre por lo alto de la pantalla.
    const at = (event: PointerEvent): [number, number] => (tall ? [event.clientY - box.top, box.right - event.clientX] : [event.clientX - box.left, event.clientY - box.top]);
    const settle = () => { base.style.left = `${ox}px`; base.style.top = `${oy}px`; };
    const move = (event: PointerEvent) => {
      const [x, y] = at(event), reach = (base.offsetWidth / 2) * FEEL[feel].reach;
      let dx = x - ox;
      // Si el pulgar se pasa del borde, la base lo acompaña: para volver no hay que desandar lo que se fue de largo.
      if (Math.abs(dx) > reach) {
        ox += dx - Math.sign(dx) * reach;
        dx = Math.sign(dx) * reach;
        settle();
      }
      const pull = dx / reach, amount = Math.max(0, Math.abs(pull) - 0.1) / 0.9;
      // Fina cerca del centro y a fondo en el borde: las correcciones chicas no zigzaguean.
      stick = -Math.sign(pull) * Math.pow(amount, 1.3);
      const room = Math.sqrt(Math.max(0, reach * reach - dx * dx));
      knob.style.transform = `translate(${dx}px, ${Math.max(-room, Math.min(room, y - oy))}px)`;
    };
    zone.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      if (drive.dataset.tilt === 'true') return tilt.center();
      if (finger !== -1) return;
      finger = event.pointerId;
      zone.setPointerCapture?.(finger);
      box = zone.getBoundingClientRect();
      tall = innerHeight > innerWidth;
      [ox, oy] = at(event);
      settle();
      base.classList.add('held');
    });
    zone.addEventListener('pointermove', (event) => { if (event.pointerId === finger) move(event); });
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) zone.addEventListener(type, (event) => {
      if ((event as PointerEvent).pointerId !== finger) return;
      finger = -1;
      stick = 0;
      knob.style.transform = '';
      base.style.left = base.style.top = '';
      base.classList.remove('held');
    });
    drive.querySelector('.menu-btn')!.addEventListener('click', () => { menu = !menu; buildDrive(); });
  }
  drive.dataset.tilt = String(useTilt);
  drive.classList.toggle('tilt', useTilt);
  drive.classList.toggle('watching', !driving());
  drive.querySelector('.hint')!.textContent = !driving() ? 'Mirando · entrás en la próxima carrera' : useTilt ? 'Tocá acá para centrar' : 'Arrastrá para doblar';
  const lead = !!(shared && me && (shared.lead === me.id || shared.players.find((p) => p.id === me!.id)?.boss));
  const panel = drive.querySelector<HTMLElement>('.menu')!;
  panel.classList.toggle('on', menu);
  panel.innerHTML = !menu ? '' : `<div class="stack">
      <span class="tag">${lead ? 'Manejás la sala' : 'Carrera'}</span>
      <button class="go" data-do="resume">Seguir</button>
      ${lead ? '<button class="quiet" data-do="restart">Reiniciar la carrera</button><button class="quiet" data-do="lobby">Volver a la sala</button>' : ''}
      ${driving() ? `<button class="quiet" data-do="mode">${useTilt ? 'Manejar con la palanca' : 'Manejar inclinando'}</button>` : ''}
      <button class="quiet" data-do="leave">Salir de la sala</button>
    </div>`;
  panel.querySelectorAll<HTMLElement>('[data-do]').forEach((el) => el.addEventListener('click', () => {
    const what = el.dataset.do;
    menu = false;
    if (what === 'restart') command({ a: 'restart' });
    else if (what === 'lobby') command({ a: 'lobby' });
    else if (what === 'leave') return leave();
    else if (what === 'mode') { store('control', useTilt ? 'stick' : 'inclinacion'); return void setTilt(!useTilt); }
    buildDrive();
  }));
  paintDrive();
}

function paintDrive(): void {
  const place = drive.querySelector('.place'), lap = drive.querySelector('.lap'), note = drive.querySelector('.note');
  if (!place || !lap || !note) return;
  const mineNow = driving() ? mine : null;
  place.innerHTML = mineNow ? `${mineNow.place}<sup>/${mineNow.of}</sup>` : '';
  lap.textContent = mineNow && shared ? `Vuelta ${Math.min(shared.laps, mineNow.lap + 1)}/${shared.laps}` : driving() ? 'Preparados' : '';
  // Un solo cartel: lo malo tapa a lo bueno.
  const word = mineNow?.off ? 'Fuera de pista' : mineNow?.plus === 'rebufo' ? 'Rebufo' : mineNow?.plus === 'ritmo' ? 'Ritmo' : '';
  if (word) note.textContent = word;
  note.classList.toggle('on', word !== '');
  note.classList.toggle('good', word !== '' && !mineNow?.off);
  const tank = drive.querySelector<HTMLElement>('.tank u'), level = Math.round((mineNow?.nitro ?? 0) * 100);
  if (tank) tank.style.width = `${level}%`;
  drive.querySelector('.pad.nitro')?.classList.toggle('ready', level >= 15);
}

// El volante se manda treinta veces por segundo mientras se corre, y un aviso de vida el resto del tiempo.
// El aviso va por reloj y no por cuenta de vueltas: con la pestaña atrás el navegador frena los temporizadores.
let beat = 0;
let lastBeat = 0;
let shown = '';
setInterval(() => {
  const racing = shared && me && (shared.phase === 'countdown' || shared.phase === 'race');
  if (racing) {
    const steer = useTilt ? tilt.steer : stick;
    if (driving()) link?.send({ t: 'in', s: Math.round(steer * 100) / 100, b: held.brake ? 1 : 0, n: held.nitro ? 1 : 0, k: held.drift ? 1 : 0 });
    // La velocidad y la cuenta salen de lo que se está dibujando: van parejas con la imagen.
    const car = view?.self(), clock = view?.clock() ?? 0;
    const speed = String(Math.round((car?.v ?? (mine?.speed ?? 0) / 3.6) * 3.6));
    const count = !view?.now() ? 'Cargando' : clock < 0 ? String(Math.ceil(-clock)) : clock < 0.9 ? 'Ya' : '';
    const text = `${speed}|${count}|${Math.round(steer * 50)}`;
    if (text !== shown) {
      shown = text;
      const dial = drive.querySelector('.speed b'), big = drive.querySelector<HTMLElement>('.count'), lean = drive.querySelector<HTMLElement>('.lean i');
      if (dial) dial.textContent = speed;
      if (big) { big.textContent = count; big.classList.toggle('go', count === 'Ya'); big.classList.toggle('small', count === 'Cargando'); }
      // Inclinando no hay palanca que mirar: una aguja muestra cuánto está doblando.
      if (lean) lean.style.left = `${50 - steer * 46}%`;
    }
  }
  // Sin correr no hay volante que mandar, pero la sala corta al que calla: el que mira también avisa que sigue.
  if ((!racing || !driving()) && performance.now() - lastBeat > 3000) {
    lastBeat = performance.now();
    link?.send({ t: 'ping', n: ++beat });
  }
}, 33);

/**
 * Safari no hace caso al pedido de no agrandar la página: el doble toque y el pellizco se frenan a mano.
 * Corriendo, ningún toque hace nada más que lo que hace el juego. En la sala el segundo toque rápido sigue
 * valiendo como toque (para pasar pinturas de a varias), pero no agranda.
 */
let lastTap = 0;
document.addEventListener('touchstart', (event) => {
  const target = event.target as Element | null;
  if (document.body.classList.contains('driving') && !target?.closest?.('.menu, .menu-btn')) event.preventDefault();
  else if (event.touches.length > 1) event.preventDefault();
}, { passive: false });
document.addEventListener('touchend', (event) => {
  const target = event.target as HTMLElement | null, now = performance.now(), quick = now - lastTap < 400;
  lastTap = now;
  if (!quick || !target || target.closest('input, a')) return;
  event.preventDefault();
  if (!document.body.classList.contains('driving') || target.closest('.menu, .menu-btn')) target.click();
}, { passive: false });
for (const type of ['gesturestart', 'gesturechange', 'dblclick']) document.addEventListener(type, (event) => event.preventDefault(), { passive: false });
document.addEventListener('contextmenu', (event) => event.preventDefault());

// Recargada la página, el iPhone pide de nuevo permiso para el sensor, y solo lo da desde un toque: se pide en el primero.
if (isSecureContext && store('control') === 'inclinacion') {
  const again = () => {
    removeEventListener('touchend', again, true);
    removeEventListener('click', again, true);
    if (!useTilt && me) void setTilt(true);
  };
  addEventListener('touchend', again, true);
  addEventListener('click', again, true);
}

// La pantalla no se apaga en plena carrera, donde el navegador lo permita.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') void (navigator as unknown as { wakeLock?: { request(type: string): Promise<unknown> } }).wakeLock?.request('screen').catch(() => undefined);
});
void (navigator as unknown as { wakeLock?: { request(type: string): Promise<unknown> } }).wakeLock?.request('screen').catch(() => undefined);

render();
if (room && store('room') === room && store('key') && store('name')) join(store('name'));
