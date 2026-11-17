/**
 * El partido: discos que se empujan en una cancha con dos arcos, como en HaxBall. No dibuja ni
 * sabe de la red; avanza de a un cuadro de 1/60 s, así que da lo mismo en el proyector que en un test.
 */

export interface Field {
  name: string;
  /** Media cancha: del centro a la línea de gol, y del centro a la línea de costado. */
  w: number;
  h: number;
  /** Medio arco y su profundidad. */
  goal: number;
  depth: number;
  /** Lo que los jugadores pueden salirse de la cancha. */
  margin: number;
  /** El círculo central, donde el que no saca no puede entrar. */
  circle: number;
}

export const FIELDS: Field[] = [
  { name: 'Chica', w: 300, h: 140, goal: 58, depth: 28, margin: 40, circle: 60 },
  { name: 'Clásica', w: 370, h: 170, goal: 64, depth: 30, margin: 50, circle: 75 },
  { name: 'Grande', w: 540, h: 240, goal: 80, depth: 32, margin: 60, circle: 90 },
];

export interface Disc {
  x: number; y: number; vx: number; vy: number;
  /** Dónde estaba en el cuadro anterior: la pared dibuja entre los dos. */
  px: number; py: number;
  r: number; inv: number; damp: number; bounce: number;
}

export interface Input { x: number; y: number; kick: boolean }

export interface Player {
  id: number;
  team: 0 | 1;
  disc: Disc;
  input: Input;
  /** Apretar patear sirve para una patada: hay que soltar para la siguiente. */
  armed: boolean;
}

export type Event =
  | { type: 'kick'; id: number; power: number }
  | { type: 'goal'; team: 0 | 1; by: number | null; own: boolean }
  | { type: 'kickoff' }
  | { type: 'end' };

export type State = 'kickoff' | 'play' | 'goal' | 'over';

export const TICK = 1 / 60;
export const PLAYER = { r: 15, inv: 0.5, damp: 0.96, accel: 0.1, kickAccel: 0.07, kickDamp: 0.96, kick: 5, reach: 4, bounce: 0.5 };
export const BALL = { r: 10, inv: 1, damp: 0.99, bounce: 0.5, wall: 1 };
const POST = { r: 8, bounce: 0.5 };
/** Lo que dura el festejo antes de volver al medio. */
const CELEBRATE = 150;

export class Match {
  readonly players = new Map<number, Player>();
  readonly ball: Disc;
  readonly posts: Disc[];
  score: [number, number] = [0, 0];
  state: State = 'kickoff';
  /** El que saca del medio: al principio el de la izquierda, después el que recibió el gol. */
  kickoff: 0 | 1 = 0;
  /** Cuadros jugados con la pelota en juego. */
  ticks = 0;
  overtime = false;
  winner: number | null = null;
  lastTouch: number | null = null;
  events: Event[] = [];
  private wait = 0;
  private ending = false;

  readonly field: Field;
  readonly limitTicks: number;
  readonly goalsToWin: number;

  constructor(field: Field, limitTicks = 0, goalsToWin = 0) {
    this.field = field;
    this.limitTicks = limitTicks;
    this.goalsToWin = goalsToWin;
    this.ball = disc(0, 0, BALL.r, BALL.inv, BALL.damp, BALL.bounce);
    this.posts = [-1, 1].reduce<Disc[]>((all, sx) => all.concat([-1, 1].map((sy) => disc(sx * field.w, sy * field.goal, POST.r, 0, 1, POST.bounce))), []);
  }

  add(id: number, team: 0 | 1): Player {
    const known = this.players.get(id);
    if (known) {
      if (known.team !== team) {
        known.team = team;
        this.place(known, this.count(team) - 1);
      }
      return known;
    }
    const player: Player = { id, team, disc: disc(0, 0, PLAYER.r, PLAYER.inv, PLAYER.damp, PLAYER.bounce), input: { x: 0, y: 0, kick: false }, armed: true };
    this.players.set(id, player);
    this.place(player, this.count(team) - 1);
    return player;
  }

  remove(id: number): void {
    this.players.delete(id);
    if (this.lastTouch === id) this.lastTouch = null;
  }

  /** Segundos que faltan, o los jugados si no hay reloj. */
  get clock(): number {
    const played = Math.floor(this.ticks * TICK);
    return this.limitTicks > 0 ? Math.max(0, Math.ceil((this.limitTicks - this.ticks) * TICK)) : played;
  }

  step(): void {
    if (this.state === 'over') return;
    const all = this.discs();
    for (const d of all) { d.px = d.x; d.py = d.y; }
    for (const player of this.players.values()) this.move(player);
    for (const d of all) {
      d.x += d.vx;
      d.y += d.vy;
    }
    for (const player of this.players.values()) {
      const kicking = player.input.kick;
      player.disc.vx *= kicking ? PLAYER.kickDamp : PLAYER.damp;
      player.disc.vy *= kicking ? PLAYER.kickDamp : PLAYER.damp;
    }
    this.ball.vx *= BALL.damp;
    this.ball.vy *= BALL.damp;
    const list = [...this.players.values()];
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) collide(list[i].disc, list[j].disc);
      if (collide(list[i].disc, this.ball)) this.touch(list[i].id);
      for (const post of this.posts) collide(list[i].disc, post);
      this.keepPlayer(list[i]);
    }
    for (const post of this.posts) collide(this.ball, post);
    this.keepBall();
    this.referee();
  }

  /** Lo que pasó desde la última vez que se preguntó. */
  drain(): Event[] {
    const out = this.events;
    this.events = [];
    return out;
  }

  private move(player: Player): void {
    const d = player.disc, input = player.input;
    let x = input.x, y = input.y;
    const length = Math.hypot(x, y);
    if (length > 1) { x /= length; y /= length; }
    const accel = input.kick ? PLAYER.kickAccel : PLAYER.accel;
    d.vx += x * accel;
    d.vy += y * accel;
    if (!input.kick) {
      player.armed = true;
      return;
    }
    if (!player.armed || this.state === 'goal') return;
    const dx = this.ball.x - d.x, dy = this.ball.y - d.y, gap = Math.hypot(dx, dy);
    if (gap - d.r - this.ball.r > PLAYER.reach || gap === 0) return;
    player.armed = false;
    this.ball.vx += (dx / gap) * PLAYER.kick * this.ball.inv;
    this.ball.vy += (dy / gap) * PLAYER.kick * this.ball.inv;
    this.touch(player.id);
    this.events.push({ type: 'kick', id: player.id, power: Math.min(1, Math.hypot(this.ball.vx, this.ball.vy) / 10) });
  }

  private touch(id: number): void {
    this.lastTouch = id;
    if (this.state === 'kickoff') this.state = 'play';
  }

  private keepPlayer(player: Player): void {
    const d = player.disc, f = this.field;
    clampAxis(d, 'x', f.w + f.margin - d.r, 0);
    clampAxis(d, 'y', f.h + f.margin - d.r, 0);
    if (this.state !== 'kickoff') return;
    // En el saque cada uno se queda en su mitad, y el que no saca, fuera del círculo.
    const side = player.team === 0 ? -1 : 1;
    const taking = player.team === this.kickoff;
    const limit = taking ? 0 : d.r;
    if (side * d.x < limit) {
      d.x = side * limit;
      if (side * d.vx < 0) d.vx = 0;
    }
    if (!taking) {
      const far = this.field.circle + d.r, gap = Math.hypot(d.x, d.y);
      if (gap < far) {
        const nx = gap === 0 ? side : d.x / gap, ny = gap === 0 ? 0 : d.y / gap;
        d.x = nx * far;
        d.y = ny * far;
      }
    }
  }

  private keepBall(): void {
    const b = this.ball, f = this.field;
    if (Math.abs(b.x) <= f.w) {
      clampAxis(b, 'y', f.h - b.r, BALL.wall);
      // Junto a los palos, la pelota que no entra rebota contra la línea de fondo.
      if (Math.abs(b.y) > f.goal && Math.abs(b.x) > f.w - b.r) clampAxis(b, 'x', f.w - b.r, BALL.wall);
    } else if (Math.abs(b.y) < f.goal) {
      // Adentro del arco: la red la frena.
      clampAxis(b, 'y', f.goal - b.r, 0.3);
      clampAxis(b, 'x', f.w + f.depth - b.r, 0.2);
    } else {
      // Afuera del arco y pasada la línea: vuelve a la cancha.
      b.x = Math.sign(b.x) * (f.w - b.r);
      b.vx = -b.vx * BALL.wall;
    }
  }

  private referee(): void {
    if (this.state === 'goal') {
      if (--this.wait > 0) return;
      if (this.ending) {
        this.state = 'over';
        this.winner = this.score[0] === this.score[1] ? -1 : this.score[0] > this.score[1] ? 0 : 1;
        this.events.push({ type: 'end' });
        return;
      }
      this.reset();
      return;
    }
    const b = this.ball, f = this.field;
    if (Math.abs(b.x) > f.w && Math.abs(b.y) < f.goal) {
      const team: 0 | 1 = b.x > 0 ? 0 : 1;
      const by = this.lastTouch;
      const own = by !== null && this.players.get(by)?.team !== team;
      this.score[team]++;
      this.events.push({ type: 'goal', team, by, own });
      this.kickoff = team === 0 ? 1 : 0;
      this.state = 'goal';
      this.wait = CELEBRATE;
      this.ending = this.overtime || (this.goalsToWin > 0 && this.score[team] >= this.goalsToWin);
      return;
    }
    if (this.state !== 'play') return;
    this.ticks++;
    if (this.limitTicks > 0 && this.ticks >= this.limitTicks && !this.overtime) {
      if (this.score[0] !== this.score[1]) {
        this.state = 'over';
        this.winner = this.score[0] > this.score[1] ? 0 : 1;
        this.events.push({ type: 'end' });
      } else this.overtime = true;
    }
  }

  /** Todos a su mitad y la pelota al medio. */
  reset(): void {
    this.state = 'kickoff';
    this.lastTouch = null;
    Object.assign(this.ball, { x: 0, y: 0, vx: 0, vy: 0, px: 0, py: 0 });
    const seen = [0, 0];
    for (const player of this.players.values()) this.place(player, seen[player.team]++);
    this.events.push({ type: 'kickoff' });
  }

  private place(player: Player, index: number): void {
    const f = this.field, side = player.team === 0 ? -1 : 1;
    // Uno atrás de otro en abanico: el primero cerca del medio, los demás repartidos hacia el arco.
    const row = Math.floor(index / 3), slot = index % 3;
    const x = side * Math.min(f.w - 40, f.circle + 40 + row * 90);
    const y = slot === 0 ? 0 : (slot === 1 ? -1 : 1) * Math.min(f.h - 30, 70 + row * 20);
    Object.assign(player.disc, { x, y, px: x, py: y, vx: 0, vy: 0 });
  }

  private count(team: 0 | 1): number {
    let n = 0;
    for (const player of this.players.values()) if (player.team === team) n++;
    return n;
  }

  private discs(): Disc[] {
    const out: Disc[] = [this.ball];
    for (const player of this.players.values()) out.push(player.disc);
    return out;
  }
}

function disc(x: number, y: number, r: number, inv: number, damp: number, bounce: number): Disc {
  return { x, y, px: x, py: y, vx: 0, vy: 0, r, inv, damp, bounce };
}

/** Dos discos que se pisan se separan según su peso y rebotan. Devuelve si se tocaron. */
export function collide(a: Disc, b: Disc): boolean {
  const dx = a.x - b.x, dy = a.y - b.y, gap = Math.hypot(dx, dy), reach = a.r + b.r;
  if (gap >= reach || a.inv + b.inv === 0) return false;
  const nx = gap === 0 ? 1 : dx / gap, ny = gap === 0 ? 0 : dy / gap;
  const share = a.inv / (a.inv + b.inv), overlap = reach - gap;
  a.x += nx * overlap * share;
  a.y += ny * overlap * share;
  b.x -= nx * overlap * (1 - share);
  b.y -= ny * overlap * (1 - share);
  const closing = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
  if (closing < 0) {
    const push = closing * (1 + a.bounce * b.bounce);
    a.vx -= nx * push * share;
    a.vy -= ny * push * share;
    b.vx += nx * push * (1 - share);
    b.vy += ny * push * (1 - share);
  }
  return true;
}

function clampAxis(d: Disc, axis: 'x' | 'y', limit: number, bounce: number): void {
  const v = axis === 'x' ? 'vx' : 'vy';
  if (d[axis] > limit) {
    d[axis] = limit;
    if (d[v] > 0) d[v] = -d[v] * bounce;
  } else if (d[axis] < -limit) {
    d[axis] = -limit;
    if (d[v] < 0) d[v] = -d[v] * bounce;
  }
}
