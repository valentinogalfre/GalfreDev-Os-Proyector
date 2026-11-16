import './style.css';
import logoUrl from '../../../app/src/main/assets/remote/logo.svg';
import { connect, type Link } from '../net/link';
import { MODELS, type Command, type FromRoom, type Mine, type Shared, type Wish } from '../net/protocol';
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
    app.querySelector('#enter')!.addEventListener('click', () => {
      if (!input.value.trim()) return;
      // En la página segura el volante es el celular mismo, salvo que alguien ya haya elegido los botones.
      if (isSecureContext && store('control') !== 'botones') void setTilt(true);
      join(input.value.trim());
    });
  } else if (!shared) {
    app.innerHTML = `${head()}<div class="fill stack" style="justify-content:center"><span class="tag">Carrera</span><h1>Esperando a la pared</h1><p>Abrí Carrera en el proyector.</p></div>`;
  } else lobby(shared);
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
  app.innerHTML = `${head()}
    <div class="me"><div class="chip" style="background:${hex(self?.paint ?? 0xf1ede6)}"></div><div class="fill"><span class="tag">${done ? (place ? `Llegaste ${place}.º${mine}` : 'Final') : 'Tu pintura'}</span><b>${esc(me!.name)}</b></div>${done ? '' : '<button class="quiet" id="car-prev" aria-label="Pintura anterior">‹</button><button class="quiet" id="car-next" aria-label="Pintura siguiente">›</button>'}</div>
    <div class="fill scroll">${ended ? table : ''}${done && cup ? `<p class="tag title">Llegada</p>` : cup ? `<p class="tag title">Campeonato · carrera ${cup.done + 1} de ${cup.rounds}</p>` : ''}<ol>${rows.join('')}</ol>${ended ? '' : table}${mark ? `<p class="tag title">${mark}</p>` : ''}</div>
    <div class="stack" style="padding-top:14px">
      ${problem ? `<p>${esc(problem)}</p>` : ''}
      ${done ? '' : `<div class="pick"><button class="quiet" id="model-prev" aria-label="Modelo anterior">‹</button><div><span class="tag">Modelo</span><b>${esc(MODELS[self?.model ?? 0] ?? MODELS[0])}</b></div><button class="quiet" id="model-next" aria-label="Modelo siguiente">›</button></div>`}
      <div class="row"><button class="quiet ${useTilt ? '' : 'on'}" id="touch">Botones</button><button class="quiet ${useTilt ? 'on' : ''}" id="tilt">Inclinación</button>${useTilt ? `<button class="quiet ${tilt.invert ? 'on' : ''}" id="invert">Invertir</button>` : ''}</div>
      ${secure ? `<p>La inclinación solo anda en la página segura. <a href="${secure}" style="color:inherit">Abrirla</a>: el navegador va a avisar que el certificado es del proyector.</p>` : ''}
      ${lead ? `${done ? '' : `<div class="pick"><button class="quiet" id="prev">‹</button><div><span class="tag">Pista · ${state.laps === 1 ? '1 vuelta' : `${state.laps} vueltas`}</span><b>${esc(state.track)}</b></div><button class="quiet" id="next">›</button></div>
        <div class="pick"><button class="quiet" id="less" aria-label="Menos rivales">−</button><div><span class="tag">Rivales automáticos</span><b>${Math.min(state.bots, state.room)}</b></div><button class="quiet" id="more" aria-label="Más rivales">+</button></div>
        ${state.cup.done === 0
          ? `<div class="pick"><button class="quiet" id="fewer" aria-label="Menos carreras">−</button><div><span class="tag">Campeonato</span><b>${state.cup.rounds > 1 ? `${state.cup.rounds} carreras` : 'Carrera suelta'}</b></div><button class="quiet" id="longer" aria-label="Más carreras">+</button></div>`
          : '<button class="quiet" id="again">Empezar el campeonato de cero</button>'}`}
        <button class="go cinta" id="start">${!done ? 'Largar' : ended ? 'Campeonato nuevo' : cup ? 'Siguiente carrera' : 'Otra carrera'}</button>` : `<p>${done ? 'Esperando otra carrera.' : `Pista: ${esc(state.track)}. Larga quien entró primero.`}</p>`}
    </div>`;
  const on = (id: string, act: () => void) => app.querySelector(`#${id}`)?.addEventListener('click', act);
  on('touch', () => { store('control', 'botones'); void setTilt(false); });
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
  // Un solo cartel: lo malo tapa a lo bueno.
  const word = mine?.off ? 'Fuera de pista' : mine?.plus === 'rebufo' ? 'Rebufo' : mine?.plus === 'ritmo' ? 'Ritmo' : '';
  if (word) note.textContent = word;
  note.classList.toggle('on', word !== '');
  note.classList.toggle('good', word !== '' && !mine?.off);
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
