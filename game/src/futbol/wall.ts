import './wall.css';
import logoUrl from '../../../app/src/main/assets/remote/logo.svg';
import { connect } from '../net/link';
import { BALL, FIELDS, Match, PLAYER, TICK, type Disc, type Field } from './sim';
import { GOALS, KITS, MINUTES, cleanAvatar, type Command, type FromRoom, type Phase, type Seat, type Shared, type Team, type Wish } from './protocol';
import { Whistle } from './sound';

const hash = new URLSearchParams(location.hash.slice(1));
const secret = hash.get('s') ?? '';
const hex = (color: number) => `#${color.toString(16).padStart(6, '0')}`;
const esc = (text: string) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** El QR llega ya calculado por el launcher: lado, guion y los módulos en hexadecimal, fila por fila. */
function qrSvg(code: string): string {
  const [side, bits] = code.split('-'), n = Number(side);
  if (!n || !bits) return '';
  let path = '';
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const i = y * n + x;
      if ((parseInt(bits[i >> 2], 16) >> (3 - (i & 3))) & 1) path += `M${x + 4} ${y + 4}h1v1h-1z`;
    }
  }
  return `<svg viewBox="0 0 ${n + 8} ${n + 8}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#f1ede6"/><path d="${path}" fill="#111111"/></svg>`;
}

// ---- La sala ----

interface Person extends Seat { joined: number; gone: number }
const people = new Map<number, Person>();
const inputs = new Map<number, { x: number; y: number; k: boolean }>();
const room = { field: 1, minutes: 0, goals: 0, kits: [0, 1] as [number, number] };
let phase: Phase = 'lobby';
let paused = false;
let match: Match | null = null;
let last: Shared['last'] = null;
let scorers: { team: 0 | 1; name: string; own: boolean }[] = [];
let order = 0;

const seated = () => Array.from(people.values()).sort((a, b) => a.joined - b.joined);
const lead = () => seated().find((p) => p.on) ?? null;
const field = (): Field => FIELDS[room.field];

/** El que entra va al equipo con menos gente; si están parejos, a la izquierda. */
function emptier(): 0 | 1 {
  let left = 0, right = 0;
  for (const p of people.values()) if (p.on) p.team === 0 ? left++ : p.team === 1 ? right++ : 0;
  return right < left ? 1 : 0;
}

function place(p: Person): void {
  if (!match) return;
  if (p.on && p.team !== 2) {
    if (match.players.get(p.id)?.team !== p.team) match.add(p.id, p.team);
  } else match.remove(p.id);
}

function onRoster(list: { id: number; name: string; on: boolean }[]): void {
  const here = new Set(list.map((p) => p.id));
  for (const id of Array.from(people.keys())) {
    if (!here.has(id)) {
      people.delete(id);
      inputs.delete(id);
      match?.remove(id);
    }
  }
  for (const seat of list) {
    let p = people.get(seat.id);
    if (!p) {
      p = { id: seat.id, name: seat.name, team: emptier(), avatar: cleanAvatar(seat.name) || '?', on: seat.on, joined: order++, gone: seat.on ? 0 : Date.now() };
      p.avatar = cleanAvatar(Array.from(seat.name)[0] ?? '?');
      people.set(seat.id, p);
    }
    if (p.on && !seat.on) p.gone = Date.now();
    p.on = seat.on;
    p.name = seat.name;
    place(p);
  }
  changed();
}

function start(): void {
  match = new Match(field(), MINUTES[room.minutes] * 60 * 60, GOALS[room.goals]);
  for (const p of people.values()) place(p);
  match.reset();
  phase = 'play';
  paused = false;
  last = null;
  scorers = [];
  drawField();
  sound.whistle();
  changed();
}

function stop(): void {
  phase = 'lobby';
  paused = false;
  match = null;
  changed();
}

function exit(): void {
  const bridge = (window as unknown as { CarreraHost?: { exit?: () => void } }).CarreraHost;
  if (bridge && bridge.exit) bridge.exit();
  else history.back();
}

const turn = (i: number, d: number, n: number) => (i + d + n) % n;

function onCommand(id: number, d: Command | Wish): void {
  const p = people.get(id);
  if (!p || !d || typeof d !== 'object') return;
  if (d.a === 'team') {
    if (d.team === 0 || d.team === 1 || d.team === 2) p.team = d.team;
    place(p);
    return changed();
  }
  if (d.a === 'avatar') {
    p.avatar = cleanAvatar(String(d.v)) || p.avatar;
    return changed();
  }
  if (lead()?.id !== id) return;
  const step = (d as { d?: number }).d === -1 ? -1 : 1;
  switch (d.a) {
    case 'field': if (phase !== 'play') room.field = turn(room.field, step, FIELDS.length); drawField(); break;
    case 'time': if (phase !== 'play') room.minutes = turn(room.minutes, step, MINUTES.length); break;
    case 'goals': if (phase !== 'play') room.goals = turn(room.goals, step, GOALS.length); break;
    case 'kit': {
      const team = d.team === 1 ? 1 : 0, other = room.kits[1 - team];
      let next = turn(room.kits[team], step, KITS.length);
      if (next === other) next = turn(next, step, KITS.length);
      room.kits[team] = next;
      drawField();
      break;
    }
    case 'shuffle': {
      const playing = seated().filter((q) => q.on && q.team !== 2);
      for (let i = playing.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)), t = playing[i];
        playing[i] = playing[j];
        playing[j] = t;
      }
      playing.forEach((q, i) => { q.team = (i % 2) as Team; place(q); });
      break;
    }
    case 'start': start(); return;
    case 'stop': stop(); return;
    case 'pause': if (phase === 'play') paused = !paused; break;
    case 'exit': exit(); return;
  }
  changed();
}

function receive(message: FromRoom): void {
  if (message.t === 'roster') onRoster(message.players);
  else if (message.t === 'in') {
    const input = { x: +message.x || 0, y: +message.y || 0, k: !!message.k };
    inputs.set(message.id, input);
  } else if (message.t === 'cmd') onCommand(message.id, message.d);
}

let sentText = '';
let dirty = true;
function changed(): void {
  dirty = true;
}

function shared(): Shared {
  return {
    phase, paused,
    field: field().name,
    minutes: MINUTES[room.minutes],
    goals: GOALS[room.goals],
    kits: [room.kits[0], room.kits[1]],
    players: seated().map(({ id, name, team, avatar, on }) => ({ id, name, team, avatar, on })),
    score: match ? [match.score[0], match.score[1]] : [0, 0],
    clock: match ? match.clock : MINUTES[room.minutes] * 60,
    overtime: !!match && match.overtime,
    lead: lead()?.id ?? null,
    last,
    winner: phase === 'over' && match ? match.winner : null,
  };
}

function share(force = false): void {
  const d = shared(), text = JSON.stringify(d);
  if (!force && text === sentText) return;
  sentText = text;
  link.send({ t: 'all', d });
  paintBoard(d);
}

/** Fuera del partido, el que se fue hace rato deja su lugar: la lista muestra a los que están. */
const GONE_MS = 45000;
setInterval(() => {
  if (phase === 'play') return;
  const now = Date.now();
  for (const p of people.values()) if (!p.on && p.gone && now - p.gone > GONE_MS) link.send({ t: 'drop', id: p.id });
}, 5000);

const link = connect<FromRoom>(() => ({ t: 'host', secret }), receive, (up) => {
  document.body.classList.toggle('offline', !up);
  if (up) share(true);
});

// ---- La pared ----

const sound = new Whistle();
const canvas = document.getElementById('cancha') as HTMLCanvasElement;
const ctx = canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
const back = document.createElement('canvas');
const logo = new Image();
logo.onload = () => drawField();
logo.src = logoUrl;

document.body.insertAdjacentHTML('beforeend', `
  <header id="marcador"></header>
  <section id="sala" class="lamina"></section>
  <div id="gol"><b>¡GOL!</b><span></span></div>
  <div id="pausa" class="lamina chica"><b>PAUSA</b><span>El que lidera la sala la saca desde el celular</span></div>
  <div id="fuera">Se cortó la sala. Volviendo a conectar…</div>`);
const board = document.getElementById('marcador') as HTMLElement;
const lobby = document.getElementById('sala') as HTMLElement;
const goalBanner = document.getElementById('gol') as HTMLElement;
const pauseBanner = document.getElementById('pausa') as HTMLElement;
const qrCode = qrSvg(hash.get('qr') ?? '');

let view = { scale: 1, cx: 0, cy: 0, dpr: 1, w: 0, h: 0 };

function layout(): void {
  const w = window.innerWidth, h = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2, 1920 / Math.max(1, w));
  canvas.width = back.width = Math.round(w * dpr);
  canvas.height = back.height = Math.round(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  view = { scale: 1, cx: w / 2, cy: h * 0.54, dpr, w, h };
  drawField();
}

function fit(f: Field): void {
  const top = view.h * 0.12, room = view.h - top - view.h * 0.03;
  view.scale = Math.min((view.w * 0.96) / (2 * (f.w + f.depth + f.margin * 0.4)), room / (2 * (f.h + f.margin * 0.6)));
  view.cy = top + room / 2;
}

function world(c: CanvasRenderingContext2D, shake = { x: 0, y: 0 }): void {
  const k = view.scale * view.dpr;
  c.setTransform(k, 0, 0, k, (view.cx + shake.x) * view.dpr, (view.cy + shake.y) * view.dpr);
}

/** Lo que no se mueve, dibujado una vez: el pasto, las líneas, los arcos con los colores de cada equipo. */
function drawField(): void {
  const f = field(), c = back.getContext('2d') as CanvasRenderingContext2D;
  if (!back.width) return;
  fit(f);
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = '#111111';
  c.fillRect(0, 0, back.width, back.height);
  world(c);
  const ow = f.w + f.margin, oh = f.h + f.margin;
  c.fillStyle = '#1f5e3a';
  roundRect(c, -ow, -oh, ow * 2, oh * 2, 18);
  c.fill();
  const stripes = 10, sw = (f.w * 2) / stripes;
  for (let i = 0; i < stripes; i++) {
    c.fillStyle = i % 2 ? '#2a7149' : '#276b45';
    c.fillRect(-f.w + i * sw, -f.h, sw + 0.5, f.h * 2);
  }
  c.strokeStyle = 'rgba(241,237,230,0.85)';
  c.lineWidth = 3;
  c.strokeRect(-f.w, -f.h, f.w * 2, f.h * 2);
  c.beginPath();
  c.moveTo(0, -f.h);
  c.lineTo(0, f.h);
  c.stroke();
  c.beginPath();
  c.arc(0, 0, f.circle, 0, Math.PI * 2);
  c.stroke();
  c.fillStyle = 'rgba(241,237,230,0.85)';
  c.beginPath();
  c.arc(0, 0, 4, 0, Math.PI * 2);
  c.fill();
  const box = f.goal + f.h * 0.3, deep = f.w * 0.22;
  for (const side of [-1, 1]) {
    c.strokeRect(side < 0 ? -f.w : f.w - deep, -box, deep, box * 2);
    c.beginPath();
    c.arc(side * (f.w - deep * 0.72), 0, 3, 0, Math.PI * 2);
    c.fill();
  }
  for (const team of [0, 1] as const) {
    const side = team === 0 ? -1 : 1, kit = KITS[room.kits[team]], x = side * f.w;
    c.fillStyle = 'rgba(17,17,17,0.45)';
    c.fillRect(side < 0 ? x - f.depth : x, -f.goal, f.depth, f.goal * 2);
    c.strokeStyle = 'rgba(241,237,230,0.22)';
    c.lineWidth = 1;
    for (let y = -f.goal + 8; y < f.goal; y += 8) {
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x + side * f.depth, y);
      c.stroke();
    }
    c.strokeStyle = hex(kit.color);
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(x, -f.goal);
    c.lineTo(x + side * f.depth, -f.goal);
    c.lineTo(x + side * f.depth, f.goal);
    c.lineTo(x, f.goal);
    c.stroke();
    for (const y of [-f.goal, f.goal]) {
      c.fillStyle = hex(kit.color);
      c.beginPath();
      c.arc(x, y, 8, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = '#111111';
      c.lineWidth = 2;
      c.stroke();
    }
  }
  if (logo.complete && logo.naturalWidth) {
    const lw = 90, lh = (lw * logo.naturalHeight) / logo.naturalWidth;
    c.globalAlpha = 0.13;
    c.drawImage(logo, -lw / 2, f.h * 0.42 - lh / 2, lw, lh);
    c.globalAlpha = 1;
  }
}

function roundRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

// Efectos: aros de patada, papelitos del gol, la estela de la pelota y el temblor.
interface Ring { x: number; y: number; t: number; color: string }
interface Bit { x: number; y: number; vx: number; vy: number; t: number; color: string; spin: number }
const rings: Ring[] = [];
const bits: Bit[] = [];
const trail: { x: number; y: number }[] = [];
let quake = 0;
let goalTimer = 0;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function celebrate(team: 0 | 1, by: number | null, own: boolean): void {
  const f = field(), x = team === 0 ? f.w : -f.w, kit = KITS[room.kits[team]];
  const who = by === null ? '' : people.get(by)?.name ?? '';
  last = { team, name: who, own };
  if (who) scorers.push({ team, name: who, own });
  for (let i = 0; i < 70; i++) {
    const a = Math.random() * Math.PI * 2, v = 2 + Math.random() * 5;
    bits.push({ x, y: (Math.random() - 0.5) * f.goal, vx: Math.cos(a) * v - (team === 0 ? 2 : -2), vy: Math.sin(a) * v, t: 1, color: Math.random() < 0.7 ? hex(kit.color) : '#f1ede6', spin: Math.random() * 6 });
  }
  quake = 1;
  goalTimer = 2.2;
  (goalBanner.querySelector('span') as HTMLElement).textContent = who ? (own ? `En contra de ${who}` : who) : KITS[room.kits[team]].name;
  goalBanner.style.color = hex(kit.color);
  goalBanner.classList.remove('on');
  void goalBanner.offsetWidth;
  goalBanner.classList.add('on');
  sound.goal();
  changed();
}

function tick(): void {
  if (!match || phase !== 'play' || paused) return;
  for (const [id, p] of match.players) {
    const input = inputs.get(id);
    p.input.x = input ? input.x : 0;
    p.input.y = input ? input.y : 0;
    p.input.kick = !!input && input.k;
  }
  match.step();
  for (const e of match.drain()) {
    if (e.type === 'kick') {
      const d = match.players.get(e.id)?.disc;
      if (d) rings.push({ x: d.x, y: d.y, t: 1, color: '#f1ede6' });
      sound.kick(e.power);
    } else if (e.type === 'goal') celebrate(e.team, e.by, e.own);
    else if (e.type === 'kickoff') changed();
    else if (e.type === 'end') {
      phase = 'over';
      sound.whistle(3);
      changed();
    }
  }
}

function disc(d: Disc, a: number): { x: number; y: number } {
  return { x: lerp(d.px, d.x, a), y: lerp(d.py, d.y, a) };
}

function render(a: number, dt: number): void {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  quake = Math.max(0, quake - dt * 2);
  const shake = { x: (Math.random() - 0.5) * quake * 12, y: (Math.random() - 0.5) * quake * 12 };
  ctx.drawImage(back, shake.x * view.dpr, shake.y * view.dpr);
  world(ctx, shake);
  const ball = match ? disc(match.ball, a) : { x: 0, y: 0 };
  // La estela de la pelota cuando va rápido.
  trail.push(ball);
  if (trail.length > 9) trail.shift();
  if (match && Math.hypot(match.ball.vx, match.ball.vy) > 4) {
    for (let i = 1; i < trail.length; i++) {
      ctx.strokeStyle = `rgba(241,237,230,${(i / trail.length) * 0.35})`;
      ctx.lineWidth = BALL.r * 2 * (i / trail.length);
      ctx.beginPath();
      ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
      ctx.lineTo(trail[i].x, trail[i].y);
      ctx.stroke();
    }
  }
  for (let i = rings.length - 1; i >= 0; i--) {
    const r = rings[i];
    r.t -= dt * 3;
    if (r.t <= 0) { rings.splice(i, 1); continue; }
    ctx.strokeStyle = `rgba(241,237,230,${r.t * 0.8})`;
    ctx.lineWidth = 3 * r.t;
    ctx.beginPath();
    ctx.arc(r.x, r.y, PLAYER.r + PLAYER.reach + (1 - r.t) * 22, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (match) {
    const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 160);
    for (const [id, p] of match.players) {
      const person = people.get(id), kit = KITS[room.kits[p.team]], at = disc(p.disc, a);
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.beginPath();
      ctx.arc(at.x + 3, at.y + 4, PLAYER.r, 0, Math.PI * 2);
      ctx.fill();
      // El que saca titila mientras espera.
      if (match.state === 'kickoff' && match.kickoff === p.team) {
        ctx.strokeStyle = `rgba(228,163,43,${0.3 + pulse * 0.5})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(at.x, at.y, PLAYER.r + 6, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = hex(kit.color);
      ctx.beginPath();
      ctx.arc(at.x, at.y, PLAYER.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = p.input.kick ? 4 : 2.5;
      ctx.strokeStyle = p.input.kick ? '#f1ede6' : '#111111';
      ctx.stroke();
      ctx.fillStyle = hex(kit.ink);
      ctx.font = `800 ${PLAYER.r}px Archivo, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(person?.avatar ?? '', at.x, at.y + 1);
      if (person) {
        ctx.font = '700 11px Archivo, sans-serif';
        const label = person.name.length > 12 ? `${person.name.slice(0, 11)}…` : person.name;
        ctx.fillStyle = 'rgba(17,17,17,0.55)';
        const tw = ctx.measureText(label).width + 8;
        ctx.fillRect(at.x - tw / 2, at.y + PLAYER.r + 4, tw, 14);
        ctx.fillStyle = person.on ? '#f1ede6' : '#a19c92';
        ctx.fillText(label, at.x, at.y + PLAYER.r + 11.5);
      }
    }
  }
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.arc(ball.x + 2, ball.y + 3, BALL.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 2;
  ctx.stroke();
  const roll = match ? (match.ball.x + match.ball.y) / BALL.r : 0;
  ctx.fillStyle = '#111111';
  ctx.beginPath();
  ctx.arc(ball.x + Math.cos(roll) * 3.5, ball.y + Math.sin(roll) * 3.5, 3, 0, Math.PI * 2);
  ctx.fill();
  for (let i = bits.length - 1; i >= 0; i--) {
    const b = bits[i];
    b.t -= dt * 0.55;
    if (b.t <= 0) { bits.splice(i, 1); continue; }
    b.x += b.vx;
    b.y += b.vy;
    b.vx *= 0.96;
    b.vy *= 0.96;
    b.spin += 0.2;
    ctx.globalAlpha = Math.min(1, b.t * 1.5);
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x - 3, b.y - 1.5 * Math.abs(Math.cos(b.spin)) - 0.5, 6, 3 * Math.abs(Math.cos(b.spin)) + 1);
    ctx.globalAlpha = 1;
  }
  if (goalTimer > 0) {
    goalTimer -= dt;
    if (goalTimer <= 0) goalBanner.classList.remove('on');
  }
}

// ---- Láminas: marcador y sala ----

let boardText = '';
function paintBoard(d: Shared): void {
  const k0 = KITS[d.kits[0]], k1 = KITS[d.kits[1]];
  const time = d.phase === 'lobby' ? 'SALA' : d.overtime ? 'GOL DE ORO' : d.minutes === 0 ? clock(d.clock) : clock(d.clock);
  const html = `
    <img class="logo" src="${logoUrl}" alt="">
    <div class="equipo"><i style="background:${hex(k0.color)}"></i>${esc(k0.name)}</div>
    <div class="goles">${d.score[0]}<span>–</span>${d.score[1]}</div>
    <div class="equipo der">${esc(k1.name)}<i style="background:${hex(k1.color)}"></i></div>
    <div class="reloj${d.overtime ? ' oro' : ''}">${time}</div>`;
  if (html !== boardText) {
    boardText = html;
    board.innerHTML = html;
  }
  pauseBanner.classList.toggle('on', d.paused);
  lobby.classList.toggle('on', d.phase !== 'play');
  lobby.innerHTML = d.phase === 'over' ? overHtml(d) : lobbyHtml(d);
}

function column(d: Shared, team: Team): string {
  const list = d.players.filter((p) => p.team === team);
  const here = list.filter((p) => p.on).length;
  const kit = team === 2 ? null : KITS[d.kits[team]];
  const head = kit ? `<i style="background:${hex(kit.color)}"></i>${esc(kit.name)}` : 'Afuera';
  const rows = list.map((p) => `<li class="${p.on ? '' : 'off'}"><b style="${kit ? `background:${hex(kit.color)};color:${hex(kit.ink)}` : ''}">${esc(p.avatar)}</b>${esc(p.name)}${p.id === d.lead ? '<em>LIDERA</em>' : ''}</li>`).join('');
  return `<div class="columna"><h3>${head}<span>${here}</span></h3><ul>${rows || '<li class="vacio">—</li>'}</ul></div>`;
}

function rules(d: Shared): string {
  return `CANCHA ${d.field.toUpperCase()} · ${d.minutes ? `${d.minutes} MIN` : 'SIN RELOJ'} · ${d.goals ? `A ${d.goals} GOLES` : 'SIN LÍMITE DE GOLES'}`;
}

function lobbyHtml(d: Shared): string {
  const leader = d.players.find((p) => p.id === d.lead);
  const cue = leader ? `${esc(leader.name)} arranca el partido desde su celular` : 'Escaneá el código para entrar a la cancha';
  return `
    <div class="entrar">
      <span class="tag">PICADITO · ESTILO HAXBALL</span>
      <h1>Fútbol</h1>
      <p>Escaneá, elegí equipo y jugá con el trackpad y el botón de patear.</p>
      ${qrCode ? `<div class="qr">${qrCode}</div><span class="tag">MISMA RED WI-FI QUE EL PROYECTOR</span>` : ''}
    </div>
    <div class="equipos">
      <span class="tag">${rules(d)}</span>
      <div class="columnas">${column(d, 0)}${column(d, 1)}${column(d, 2)}</div>
      <div class="cinta">${cue}</div>
      <span class="tag gris">CONTROL · ◀ ▶ CANCHA · OK JUGAR · ATRÁS SALIR</span>
    </div>`;
}

function overHtml(d: Shared): string {
  const title = d.winner === 0 || d.winner === 1 ? `Ganó ${esc(KITS[d.kits[d.winner]].name)}` : 'Empate';
  const color = d.winner === 0 || d.winner === 1 ? hex(KITS[d.kits[d.winner]].color) : '#f1ede6';
  const count = new Map<string, number>();
  for (const s of scorers) if (!s.own) count.set(s.name, (count.get(s.name) ?? 0) + 1);
  const list = Array.from(count.entries()).sort((a, b) => b[1] - a[1]).map(([n, g]) => `<li><b>${g}</b>${esc(n)}</li>`).join('');
  const leader = d.players.find((p) => p.id === d.lead);
  return `
    <div class="final">
      <span class="tag">FINAL · ${rules(d)}</span>
      <h1 style="color:${color}">${title}</h1>
      <div class="resultado">${d.score[0]} – ${d.score[1]}</div>
      ${list ? `<span class="tag">GOLEADORES</span><ul class="goleadores">${list}</ul>` : ''}
      <div class="cinta">${leader ? `${esc(leader.name)} elige la revancha o volver a la sala` : 'OK para la revancha'}</div>
    </div>`;
}

// ---- El control remoto del proyector ----

(window as unknown as { carreraKey?: (key: string) => boolean }).carreraKey = (key: string) => {
  if (key === 'left' || key === 'right') {
    if (phase === 'play') return false;
    room.field = turn(room.field, key === 'left' ? -1 : 1, FIELDS.length);
    drawField();
    changed();
    return true;
  }
  if (key === 'ok') {
    if (phase === 'play') paused = !paused;
    else start();
    changed();
    return true;
  }
  if (key === 'back' && phase !== 'lobby') {
    stop();
    return true;
  }
  return false;
};
document.addEventListener('keydown', (e) => {
  const key = e.key === 'ArrowLeft' ? 'left' : e.key === 'ArrowRight' ? 'right' : e.key === 'Enter' ? 'ok' : e.key === 'Escape' ? 'back' : '';
  const handled = key && (window as unknown as { carreraKey: (k: string) => boolean }).carreraKey(key);
  if (handled) e.preventDefault();
});

// ---- El reloj ----

window.addEventListener('resize', layout);
layout();
if ((document as unknown as { fonts?: { ready: Promise<unknown> } }).fonts) {
  void (document as unknown as { fonts: { ready: Promise<unknown> } }).fonts.ready.then(() => { drawField(); dirty = true; });
}

let then = performance.now(), acc = 0, shareAcc = 0;
function frame(now: number): void {
  const dt = Math.min(0.25, (now - then) / 1000);
  then = now;
  acc += dt;
  while (acc >= TICK) {
    tick();
    acc -= TICK;
  }
  shareAcc += dt;
  // El reloj del marcador cambia una vez por segundo; los demás cambios salen al momento.
  if (dirty || shareAcc > 0.25) {
    dirty = false;
    shareAcc = 0;
    share();
  }
  render(acc / TICK, dt);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
