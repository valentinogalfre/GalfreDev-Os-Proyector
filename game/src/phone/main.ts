import './style.css';
import logoUrl from '../../../app/src/main/assets/remote/logo.svg';
import { connect, type Link } from '../net/link';
import type { Command, FromRoom, Mine, Shared, Wish } from '../net/protocol';
import { Tilt } from './tilt';

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
const held = { left: false, right: false, brake: false, nitro: false, drift: false };

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
    if (was !== shared.phase && (shared.phase === 'countdown' || shared.phase === 'lobby')) mine = null;
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
    else problem = isSecureContext ? 'Este celular no informa la inclinación. Quedan los botones.' : '';
  } else {
    tilt.stop();
    useTilt = false;
  }
  render();
}

function render(): void {
  const racing = me && shared && (shared.phase === 'countdown' || shared.phase === 'race');
  document.body.classList.toggle('driving', !!racing);
  if (racing) return buildDrive();
  if (!room) app.innerHTML = `${head()}<div class="fill stack" style="justify-content:center"><span class="tag">Carrera</span><h1>Escaneá el código de la pared</h1><p>Esta página se abre desde el código que muestra el proyector.</p></div>`;
  else if (!me) {
    app.innerHTML = `${head()}<div class="fill stack" style="justify-content:center">
      <div><span class="tag">Carrera</span><h1>Tu celular es el volante</h1><p>${problem ? esc(problem) : 'Poné tu nombre y entrá a la sala.'}</p></div>
      <input id="name" maxlength="16" autocomplete="off" autocapitalize="words" placeholder="Tu nombre" value="${esc(store('name'))}">
      <button class="go cinta" id="enter">Entrar</button></div>`;
    const input = app.querySelector<HTMLInputElement>('#name')!;
    app.querySelector('#enter')!.addEventListener('click', () => input.value.trim() && join(input.value.trim()));
  } else if (!shared) {
    app.innerHTML = `${head()}<div class="fill stack" style="justify-content:center"><span class="tag">Carrera</span><h1>Esperando a la pared</h1><p>Abrí Carrera en el proyector.</p></div>`;
  } else lobby(shared);
}

function lobby(state: Shared): void {
  const self = state.players.find((p) => p.id === me!.id);
  const lead = state.lead === me!.id;
  const done = state.phase === 'results';
  const place = done ? state.results.findIndex((r) => r.id === me!.id) + 1 : 0;
  const rows = done
    ? state.results.map((r, i) => `<li><span class="tag">${i + 1}</span>${esc(r.name)}<span class="tag">${r.time === null ? '—' : `${r.time.toFixed(2)} s`}</span></li>`)
    : state.players.map((p) => `<li class="${p.on ? '' : 'off'}"><i style="background:${hex(p.paint)}"></i>${esc(p.name)}${p.id === state.lead ? '<span class="tag">Elige pista</span>' : ''}</li>`);
  const secure = !isSecureContext && state.secure ? `https://${location.hostname}:${state.secure}${location.pathname}${location.hash}` : '';
  app.innerHTML = `${head()}
    <div class="me"><div class="chip" style="background:${hex(self?.paint ?? 0xf1ede6)}"></div><div class="fill"><span class="tag">${done ? (place ? `Llegaste ${place}.º` : 'Final') : 'Tu auto'}</span><b>${esc(me!.name)}</b></div>${done ? '' : '<button class="quiet" id="car-prev" aria-label="Auto anterior">‹</button><button class="quiet" id="car-next" aria-label="Auto siguiente">›</button>'}</div>
    <div class="fill scroll"><ol>${rows.join('')}</ol></div>
    <div class="stack" style="padding-top:14px">
      ${problem ? `<p>${esc(problem)}</p>` : ''}
      <div class="row"><button class="quiet ${useTilt ? '' : 'on'}" id="touch">Botones</button><button class="quiet ${useTilt ? 'on' : ''}" id="tilt">Inclinación</button>${useTilt ? `<button class="quiet ${tilt.invert ? 'on' : ''}" id="invert">Invertir</button>` : ''}</div>
      ${secure ? `<p>La inclinación solo anda en la página segura. <a href="${secure}" style="color:inherit">Abrirla</a>: el navegador va a avisar que el certificado es del proyector.</p>` : ''}
      ${lead ? `${done ? '' : `<div class="pick"><button class="quiet" id="prev">‹</button><div><span class="tag">Pista · ${state.laps} vueltas</span><b>${esc(state.track)}</b></div><button class="quiet" id="next">›</button></div>`}
        <button class="go cinta" id="start">${done ? 'Otra carrera' : 'Largar'}</button>` : `<p>${done ? 'Esperando otra carrera.' : `Pista: ${esc(state.track)}. Larga quien entró primero.`}</p>`}
    </div>`;
  const on = (id: string, act: () => void) => app.querySelector(`#${id}`)?.addEventListener('click', act);
  on('touch', () => void setTilt(false));
  on('tilt', () => void setTilt(true));
  on('invert', () => {
    tilt.invert = !tilt.invert;
    store('invert', tilt.invert ? '1' : '0');
    render();
  });
  on('car-prev', () => command({ a: 'car', d: -1 }));
  on('car-next', () => command({ a: 'car', d: 1 }));
  on('prev', () => command({ a: 'track', d: -1 }));
  on('next', () => command({ a: 'track', d: 1 }));
  on('start', () => {
    // Pantalla completa y acostada, donde el navegador lo permita: tiene que salir de un toque.
    void document.documentElement.requestFullscreen?.().then(() => (screen.orientation as unknown as { lock?: (o: string) => Promise<void> }).lock?.('landscape')).catch(() => undefined);
    command(done ? { a: 'lobby' } : { a: 'start' });
  });
}

function buildDrive(): void {
  if (drive.dataset.tilt === String(useTilt)) return paintDrive();
  drive.dataset.tilt = String(useTilt);
  const pad = (id: string, label: string, hint: string) => `<div class="pad" data-pad="${id}"><small class="tag">${hint}</small>${label}<u></u></div>`;
  drive.innerHTML = `
    ${useTilt ? `<div class="pads">${pad('drift', 'Derrape', 'En la curva')}${pad('brake', 'Freno', 'Mantené')}</div>` : `<div class="steer">${pad('left', '‹', 'Izquierda')}${pad('right', '›', 'Derecha')}</div>`}
    <div class="dash"><img src="${logoUrl}" alt="galfredev"><div><div class="place"></div><span class="tag lap"></span></div><b class="note">Fuera de pista</b><div class="wheel"><i></i></div><span class="tag">${useTilt ? 'Tocá acá para centrar' : 'Volante'}</span></div>
    ${useTilt ? pad('nitro', 'Nitro', 'Mantené') : `<div class="pads three">${pad('nitro', 'Nitro', 'Mantené')}${pad('drift', 'Derrape', 'En la curva')}${pad('brake', 'Freno', 'Mantené')}</div>`}`;
  drive.querySelector('.dash')!.addEventListener('pointerdown', () => tilt.center());
  drive.querySelectorAll<HTMLElement>('.pad').forEach((el) => {
    const set = (down: boolean) => (event: Event) => {
      event.preventDefault();
      held[el.dataset.pad as keyof typeof held] = down;
      el.classList.toggle('held', down);
    };
    el.addEventListener('pointerdown', set(true));
    for (const type of ['pointerup', 'pointercancel', 'pointerleave']) el.addEventListener(type, set(false));
  });
  paintDrive();
}

function paintDrive(): void {
  const place = drive.querySelector('.place')!, lap = drive.querySelector('.lap')!, note = drive.querySelector('.note')!;
  place.innerHTML = mine ? `${mine.place}<sup>/${mine.of}</sup>` : '';
  lap.textContent = mine && shared ? `Vuelta ${Math.min(shared.laps, mine.lap + 1)}/${shared.laps}` : 'Preparados';
  note.classList.toggle('on', mine?.off === true);
  const tank = drive.querySelector<HTMLElement>('[data-pad="nitro"] u');
  if (tank) tank.style.height = `${Math.round((mine?.nitro ?? 0) * 100)}%`;
}

// El volante se manda treinta veces por segundo mientras se corre, y un aviso de vida el resto del tiempo.
// El aviso va por reloj y no por cuenta de vueltas: con la pestaña atrás el navegador frena los temporizadores.
let beat = 0;
let lastBeat = 0;
setInterval(() => {
  const racing = shared && me && (shared.phase === 'countdown' || shared.phase === 'race');
  if (racing) {
    const steer = useTilt ? tilt.steer : (held.left ? 1 : 0) - (held.right ? 1 : 0);
    link?.send({ t: 'in', s: Math.round(steer * 100) / 100, b: held.brake ? 1 : 0, n: held.nitro ? 1 : 0, k: held.drift ? 1 : 0 });
    const needle = drive.querySelector<HTMLElement>('.wheel i');
    if (needle) needle.style.left = `${50 - steer * 46}%`;
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
