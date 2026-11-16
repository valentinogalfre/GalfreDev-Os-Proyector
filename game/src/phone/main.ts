import './style.css';
import logoUrl from '../../../app/src/main/assets/remote/logo.svg';
import { decodeFrame } from '../net/frame';
import { connect, type Link } from '../net/link';
import { MODELS, type Command, type FromRoom, type Mine, type Shared, type Wish } from '../net/protocol';
import { Tilt } from './tilt';
import type { View } from './view';

const room = new URLSearchParams(location.hash.slice(1)).get('r') ?? '';
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

/**
 * El sensor de inclinación solo se entrega a páginas seguras. Si el proyector tiene la dirección segura que los
 * celulares aceptan sin avisos, el volante se muda a ella antes de entrar a la sala; si no responde, se queda acá.
 */
function upgrade(): void {
  const port = new URLSearchParams(location.hash.slice(1)).get('p');
  if (isSecureContext || !port || !/^\d+\.\d+\.\d+\.\d+$/.test(location.hostname)) return;
  const secure = `https://${location.hostname.replace(/\./g, '-')}.local-ip.sh:${port}`;
  const late = new Promise<never>((_, fail) => setTimeout(fail, 3000));
  Promise.race([fetch(`${secure}/carrera/volante.html`, { mode: 'no-cors', cache: 'no-store' }), late])
    .then(() => { if (!me) location.replace(`${secure}${location.pathname}${location.hash}`); })
    .catch(() => undefined);
}
upgrade();
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
  link = connect(() => ({ t: 'join', room, name, key: key() }), onMessage, (up) => {
    online = up;
    render();
  });
}

function onMessage(message: FromRoom): void {
  if (message.t === 'joined') {
    me = { id: message.id, name: message.name };
    store('room', room);
    store('key', message.key);
  } else if (message.t === 'error') {
    problem = { room: 'Esta sala ya cerró. Escaneá de nuevo el código de la pared.', name: 'Ese nombre no sirve. Probá con otro.', full: 'La sala está llena.', moved: 'Este volante se abrió en otra pestaña. Entrá de nuevo para manejar desde acá.' }[message.code];
    link?.close();
    link = null;
    me = null;
  } else if (message.t === 'all') {
    const was = shared?.phase;
    shared = message.d;
    if (me) stage(shared);
    if (was !== shared.phase && (shared.phase === 'countdown' || shared.phase === 'lobby')) mine = null;
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
    else problem = isSecureContext ? 'Este celular no informa la inclinación. Queda la palanca.' : '';
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
      <input id="name" maxlength="16" autocomplete="off" autocapitalize="words" placeholder="Tu nombre" value="${esc(store('name'))}">
      <button class="go cinta" id="enter">Entrar</button></div>`;
    const input = app.querySelector<HTMLInputElement>('#name')!;
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
  const lead = state.lead === me!.id;
  const done = state.phase === 'results';
  const place = done ? state.results.findIndex((r) => r.id === me!.id) + 1 : 0;
  const cup = state.cup.rounds > 1 ? state.cup : null;
  const points = (id: number | null) => cup?.table.find((row) => row.id === id);
  const rows = done
    ? state.results.map((r, i) => `<li><span class="tag">${i + 1}</span>${esc(r.name)}<span class="tag">${r.best === null ? '' : `${r.id !== null && r.id === state.record.byLap ? 'récord' : 'vuelta'} ${r.best.toFixed(2)} · `}${r.time === null ? '—' : `${r.time.toFixed(2)} s`}${points(r.id) ? ` · +${points(r.id)!.last}` : ''}</span></li>`)
    : state.players.map((p) => `<li class="${p.on ? '' : 'off'}"><i style="background:${hex(p.paint)}"></i>${esc(p.name)}<span class="tag">${p.id === state.lead ? 'Elige pista' : ''}${cup && cup.done > 0 ? `${p.id === state.lead ? ' · ' : ''}${points(p.id)?.points ?? 0} pts` : ''}</span></li>`);
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
        <div class="row"><button class="quiet ${useTilt ? '' : 'on'}" id="touch">Palanca</button><button class="quiet ${useTilt ? 'on' : ''}" id="tilt">Inclinación</button>${useTilt ? `<button class="quiet ${tilt.invert ? 'on' : ''}" id="invert">Invertir</button>` : ''}</div>
        ${secure ? `<p>La inclinación solo anda en la página segura. <a href="${secure}" style="color:inherit">Abrirla</a>: el navegador va a avisar que el certificado es del proyector.</p>` : ''}
        ${lead && !done ? `<p class="tag title">La carrera</p><div class="stack">
          ${pick('prev', 'next', 'Pista', esc(state.track))}
          ${pick('less', 'more', 'Rivales automáticos', String(Math.min(state.bots, state.room)), '−+')}
          ${state.cup.done === 0 ? pick('fewer', 'longer', 'Campeonato', state.cup.rounds > 1 ? `${state.cup.rounds} carreras` : 'Carrera suelta', '−+') : '<button class="quiet" id="again">Empezar el campeonato de cero</button>'}</div>` : ''}
      </div>
    </div>
    <div class="foot">${lead ? `<button class="go cinta" id="start">${!done ? 'Largar' : ended ? 'Campeonato nuevo' : cup ? 'Siguiente carrera' : 'Otra carrera'}</button>` : `<p>${done ? 'Esperando otra carrera.' : 'Larga quien entró primero.'}</p>`}</div>`;
  dock(app.querySelector('.hero'));
  const on = (id: string, act: () => void) => app.querySelector(`#${id}`)?.addEventListener('click', act);
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

function buildDrive(): void {
  if (drive.dataset.tilt === String(useTilt)) return paintDrive();
  const fresh = drive.dataset.tilt === undefined;
  drive.dataset.tilt = String(useTilt);
  if (fresh) {
    const pad = (id: string, label: string) => `<div class="pad ${id}" data-pad="${id}"><b>${label}</b><u></u></div>`;
    drive.innerHTML = `<canvas id="view"></canvas>
      <div class="hud">
        <div class="pos"><div class="place"></div><span class="tag lap"></span></div>
        <div class="top"><img src="${logoUrl}" alt="galfredev"><b class="note"></b></div>
        <canvas class="map"></canvas>
        <div class="count"></div>
        <div class="speed"><b></b><span class="tag">km/h</span><div class="tank"><u></u></div></div>
      </div>
      <div class="zone"><div class="rail"><i></i></div><span class="tag hint"></span></div>
      <div class="keys">${pad('nitro', 'Nitro')}${pad('drift', 'Derrape')}${pad('brake', 'Freno')}</div>`;
    drive.querySelectorAll<HTMLElement>('.pad').forEach((el) => {
      const set = (down: boolean) => (event: Event) => {
        event.preventDefault();
        held[el.dataset.pad as keyof typeof held] = down;
        el.classList.toggle('held', down);
      };
      el.addEventListener('pointerdown', set(true));
      for (const type of ['pointerup', 'pointercancel', 'pointerleave']) el.addEventListener(type, set(false));
    });
    // La palanca nace donde apoya el pulgar y se arrastra a los costados: cuanto más lejos, más dobla.
    const zone = drive.querySelector<HTMLElement>('.zone')!, rail = zone.querySelector<HTMLElement>('.rail')!, knob = rail.querySelector<HTMLElement>('i')!;
    let finger = -1, from = 0;
    // Con el celular parado la pantalla entera está girada: «al costado» es el eje vertical del dedo.
    const along = (event: PointerEvent) => (innerHeight > innerWidth ? event.clientY : event.clientX);
    const reach = () => rail.offsetWidth / 2 - knob.offsetWidth / 2;
    const move = (event: PointerEvent) => {
      const pull = Math.max(-1, Math.min(1, (along(event) - from) / reach()));
      stick = Math.abs(pull) < 0.08 ? 0 : -(pull - Math.sign(pull) * 0.08) / 0.92;
      knob.style.transform = `translateX(${pull * reach()}px)`;
    };
    zone.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      if (drive.dataset.tilt === 'true') return tilt.center();
      if (finger !== -1) return;
      finger = event.pointerId;
      from = along(event);
      zone.setPointerCapture(finger);
      const box = zone.getBoundingClientRect(), tall = innerHeight > innerWidth;
      // Dentro de la zona, en sus propios ejes: girada, lo ancho de la zona corre por lo alto de la pantalla.
      const x = tall ? event.clientY - box.top : event.clientX - box.left, y = tall ? box.right - event.clientX : event.clientY - box.top;
      rail.style.left = `${Math.max(rail.offsetWidth / 2, Math.min(zone.offsetWidth - rail.offsetWidth / 2, x))}px`;
      rail.style.top = `${Math.max(rail.offsetHeight / 2, Math.min(zone.offsetHeight - rail.offsetHeight / 2, y))}px`;
      rail.classList.add('held');
    });
    zone.addEventListener('pointermove', (event) => { if (event.pointerId === finger) move(event); });
    for (const type of ['pointerup', 'pointercancel']) zone.addEventListener(type, (event) => {
      if ((event as PointerEvent).pointerId !== finger) return;
      finger = -1;
      stick = 0;
      knob.style.transform = '';
      rail.style.left = rail.style.top = '';
      rail.classList.remove('held');
    });
  }
  drive.classList.toggle('tilt', useTilt);
  drive.querySelector('.hint')!.textContent = useTilt ? 'Tocá acá para centrar' : 'Arrastrá para doblar';
  paintDrive();
}

function paintDrive(): void {
  const place = drive.querySelector('.place'), lap = drive.querySelector('.lap'), note = drive.querySelector('.note');
  if (!place || !lap || !note) return;
  place.innerHTML = mine ? `${mine.place}<sup>/${mine.of}</sup>` : '';
  lap.textContent = mine && shared ? `Vuelta ${Math.min(shared.laps, mine.lap + 1)}/${shared.laps}` : 'Preparados';
  // Un solo cartel: lo malo tapa a lo bueno.
  const word = mine?.off ? 'Fuera de pista' : mine?.plus === 'rebufo' ? 'Rebufo' : mine?.plus === 'ritmo' ? 'Ritmo' : '';
  if (word) note.textContent = word;
  note.classList.toggle('on', word !== '');
  note.classList.toggle('good', word !== '' && !mine?.off);
  const tank = drive.querySelector<HTMLElement>('.tank u'), level = Math.round((mine?.nitro ?? 0) * 100);
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
    link?.send({ t: 'in', s: Math.round(steer * 100) / 100, b: held.brake ? 1 : 0, n: held.nitro ? 1 : 0, k: held.drift ? 1 : 0 });
    // La velocidad y la cuenta salen de lo que se está dibujando: van parejas con la imagen.
    const car = view?.self(), clock = view?.clock() ?? 0;
    const speed = String(Math.round((car?.v ?? (mine?.speed ?? 0) / 3.6) * 3.6));
    const count = !view?.now() ? 'Cargando' : clock < 0 ? String(Math.ceil(-clock)) : clock < 0.9 ? 'Ya' : '';
    const text = `${speed}|${count}`;
    if (text !== shown) {
      shown = text;
      const dial = drive.querySelector('.speed b'), big = drive.querySelector<HTMLElement>('.count');
      if (dial) dial.textContent = speed;
      if (big) { big.textContent = count; big.classList.toggle('go', count === 'Ya'); big.classList.toggle('small', count === 'Cargando'); }
    }
  } else if (performance.now() - lastBeat > 3000) {
    lastBeat = performance.now();
    link?.send({ t: 'ping', n: ++beat });
  }
}, 33);

// La pantalla no se apaga en plena carrera, donde el navegador lo permita.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') void (navigator as unknown as { wakeLock?: { request(type: string): Promise<unknown> } }).wakeLock?.request('screen').catch(() => undefined);
});
void (navigator as unknown as { wakeLock?: { request(type: string): Promise<unknown> } }).wakeLock?.request('screen').catch(() => undefined);

render();
if (room && store('room') === room && store('key') && store('name')) join(store('name'));
