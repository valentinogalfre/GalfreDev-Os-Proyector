/**
 * La carrera, sin nada de dibujo: corre igual en la pared, en un test o en un servidor.
 * Los autos viven en coordenadas de pista: metros recorridos (s) y metros a la izquierda del eje (d).
 */

/** Lo que la simulación necesita saber de la pista. */
export interface Course {
  length: number;
  /** Medio ancho del asfalto. */
  half: number;
  /** A cuántos metros del eje está el muro. */
  wall: number;
  /** Curvatura en [s], en 1/metros: positiva si dobla a la izquierda. */
  curvature(s: number): number;
}

/** Lo que manda cada celular. */
export interface Input {
  /** -1 es todo a la derecha, 1 todo a la izquierda. */
  steer: number;
  brake: boolean;
  nitro: boolean;
  drift: boolean;
}

export interface Car {
  s: number;
  d: number;
  /** Velocidad a lo largo del auto, en m/s. */
  v: number;
  /** Rumbo respecto de la pista, en radianes: positivo apunta a la izquierda. */
  yaw: number;
  /** Cuánto dobla ahora, de -1 a 1, ya suavizado: sirve para girar ruedas e inclinar el auto. */
  steer: number;
  /** Tanque de nitro, de 0 a 1. */
  nitro: number;
  boosting: boolean;
  braking: boolean;
  /** Va derrapando: dobla más de lo que da el agarre, a cambio de velocidad. */
  drifting: boolean;
  /** Cuánto cruzó la cola respecto de por dónde va, en radianes: es lo que se ve, no cambia el rumbo. */
  slip: number;
  offTrack: boolean;
  /** Segundos que le quedan de trompo tras un golpe fuerte. */
  spin: number;
  lap: number;
  /** Tiempo de llegada, o null si sigue corriendo. */
  finished: number | null;
  bot: boolean;
}

export type RaceEvent =
  | { type: 'wall'; car: number; force: number }
  | { type: 'hit'; car: number; other: number; force: number }
  | { type: 'lap'; car: number; lap: number }
  /** Quedó demasiado atrás y el elástico lo trajo a la cola del grupo. */
  | { type: 'tow'; car: number }
  | { type: 'finish'; car: number; place: number };

export type Phase = 'grid' | 'countdown' | 'race' | 'done';

export const TUNING = {
  topSpeed: 62,
  accel: 15,
  brake: 34,
  /** Aceleración lateral que aguanta el auto antes de irse de trompa. */
  grip: 24,
  turnRate: 1.5,
  /** Cuánto de la curva toma el auto solo. Con 1 no haría falta doblar. */
  assist: 0.38,
  nitroGain: 1.3,
  nitroBurn: 0.34,
  nitroFill: 0.07,
  /** Derrapando el auto dobla esto de más, corre esto de menos y carga el nitro así de rápido. */
  driftGrip: 1.9,
  driftSpeed: 0.88,
  driftFill: 0.2,
  driftFrom: 20,
  driftSlip: 0.5,
  offTrackSpeed: 0.45,
  offTrackGrip: 0.55,
  /** Cuánta velocidad de más recibe el que quedó lejos del primero: todos comparten una sola pantalla. */
  catchUp: 0.1,
  catchUpFrom: 30,
  catchUpFull: 200,
  /**
   * El elástico. Todos miran la misma pantalla: el jugador que queda a más de [towSpan] metros del jugador que va
   * primero durante [towGrace] segundos reaparece a [towBack] metros de él, con el tanque de nitro vacío.
   */
  towSpan: 60,
  towGrace: 1.2,
  towBack: 45,
  carLength: 4.5,
  carWidth: 2.1,
  countdown: 3,
};

const STEP = 1 / 60;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export class Race {
  readonly cars: Car[] = [];
  readonly inputs: Input[] = [];
  phase: Phase = 'grid';
  /** Segundos desde la largada; negativo durante la cuenta regresiva. */
  clock = -TUNING.countdown;
  readonly course: Course;
  readonly laps: number;
  private carry = 0;
  private placed = 0;
  /** Por dónde va el primero, en metros. */
  private front = 0;
  /** Cuánto lleva cada auto fuera del alcance del elástico, en segundos. */
  private readonly lost: number[] = [];

  constructor(course: Course, laps: number, bots: boolean[]) {
    this.course = course;
    this.laps = laps;
    // Grilla de a dos, escalonada, detrás de la línea.
    bots.forEach((bot, i) => {
      this.cars.push({
        s: -6 - Math.floor(i / 2) * 9 - (i % 2) * 3, d: (i % 2 ? -1 : 1) * course.half * 0.42,
        v: 0, yaw: 0, steer: 0, nitro: 0.35, boosting: false, braking: false, drifting: false, slip: 0, offTrack: false, spin: 0, lap: 0, finished: null, bot,
      });
      this.inputs.push({ steer: 0, brake: false, nitro: false, drift: false });
    });
  }

  start(): void {
    if (this.phase === 'grid') this.phase = 'countdown';
  }

  /** Posiciones: índices de auto, del primero al último. */
  order(): number[] {
    const key = (c: Car) => (c.finished !== null ? 1e9 - c.finished : c.s);
    return this.cars.map((_, i) => i).sort((a, b) => key(this.cars[b]) - key(this.cars[a]));
  }

  /** Avanza [dt] segundos de reloj en pasos fijos. Devuelve lo que pasó, para efectos y vibración. */
  advance(dt: number): RaceEvent[] {
    const events: RaceEvent[] = [];
    this.carry = Math.min(this.carry + dt, 0.25);
    while (this.carry >= STEP) {
      this.carry -= STEP;
      this.tick(events);
    }
    return events;
  }

  private tick(events: RaceEvent[]): void {
    if (this.phase === 'grid' || this.phase === 'done') return;
    this.clock += STEP;
    if (this.phase === 'countdown') {
      if (this.clock < 0) return;
      this.phase = 'race';
    }
    this.front = Math.max(...this.cars.map((car) => car.s));
    this.cars.forEach((car, i) => {
      if (car.bot) this.drive(car, this.inputs[i], i);
      this.move(car, this.inputs[i], i, events);
    });
    this.collide(events);
    this.tow(events);
    this.cars.forEach((car, i) => {
      const lap = Math.floor(car.s / this.course.length);
      if (lap > car.lap && car.finished === null) {
        car.lap = lap;
        if (lap >= this.laps) {
          car.finished = this.clock;
          events.push({ type: 'finish', car: i, place: ++this.placed });
        } else events.push({ type: 'lap', car: i, lap });
      }
    });
    if (this.placed === this.cars.length) this.phase = 'done';
  }

  private move(car: Car, input: Input, index: number, events: RaceEvent[]): void {
    const { course } = this, T = TUNING;
    const done = car.finished !== null;
    const steerIn = done ? clamp(-car.d * 0.1 - car.yaw * 2, -1, 1) : clamp(input.steer, -1, 1);
    car.steer += (steerIn - car.steer) * Math.min(1, STEP * 9);
    car.offTrack = Math.abs(car.d) > course.half + 0.3;
    car.braking = !done && input.brake;
    car.boosting = !done && input.nitro && car.nitro > 0 && car.spin <= 0 && !car.offTrack;
    // El derrape arranca doblando y se sostiene mientras se mantenga el botón y quede velocidad.
    car.drifting = !done && input.drift && car.spin <= 0 && !car.offTrack && car.v > T.driftFrom && (car.drifting || Math.abs(car.steer) > 0.3);
    car.slip += ((car.drifting ? clamp(car.steer * 2, -1, 1) * T.driftSlip : 0) - car.slip) * Math.min(1, STEP * 5);
    car.nitro = clamp(car.nitro + (car.boosting ? -T.nitroBurn : car.drifting ? T.driftFill : T.nitroFill) * STEP, 0, 1);

    let top = T.topSpeed * (car.boosting ? T.nitroGain : 1) * (car.drifting ? T.driftSpeed : 1) * (car.offTrack ? T.offTrackSpeed : 1);
    top *= 1 + T.catchUp * clamp((this.front - car.s - T.catchUpFrom) / (T.catchUpFull - T.catchUpFrom), 0, 1);
    if (done) top *= 0.4;
    if (car.spin > 0) {
      // En trompo no hay control: el auto gira sobre sí mismo y pierde velocidad.
      car.spin -= STEP;
      car.yaw += STEP * 9 * Math.sign(car.yaw || 1);
      car.v *= 1 - STEP * 1.6;
      if (car.spin <= 0) car.yaw = 0;
    } else if (car.braking) {
      car.v = Math.max(0, car.v - T.brake * STEP);
    } else if (car.v < top) {
      car.v += T.accel * (car.boosting ? 1.7 : 1) * (1 - car.v / top) * STEP + 0.6 * STEP;
    } else {
      car.v -= (car.v - top) * (car.offTrack ? 2.2 : 0.8) * STEP;
    }

    const k = course.curvature(car.s);
    if (car.spin <= 0) {
      // Lo que el auto puede doblar baja con la velocidad: pasado el agarre, se va de trompa.
      const grip = T.grip * (car.offTrack ? T.offTrackGrip : 1) * (car.drifting ? T.driftGrip : 1);
      const limit = grip / Math.max(car.v, 9);
      const turn = clamp(car.steer * T.turnRate, -limit, limit) + k * car.v * T.assist;
      car.yaw += (turn - k * car.v) * STEP;
      car.yaw = clamp(car.yaw, -1.1, 1.1);
      // Sin volante el auto se endereza solo, despacio.
      car.yaw -= car.yaw * Math.min(1, STEP * 0.9) * (1 - Math.abs(car.steer));
    }
    const along = car.spin > 0 ? car.v : car.v * Math.cos(car.yaw);
    car.s += (along / Math.max(0.4, 1 - car.d * k)) * STEP;
    if (car.spin <= 0) car.d += car.v * Math.sin(car.yaw) * STEP;

    if (Math.abs(car.d) > course.wall) {
      const side = Math.sign(car.d);
      const into = Math.max(0, Math.sin(car.yaw) * side) * car.v;
      car.d = side * course.wall;
      car.yaw = -car.yaw * 0.35 - side * 0.04;
      car.v *= 1 - Math.min(0.5, 0.1 + into * 0.035);
      if (into > 1.5) events.push({ type: 'wall', car: index, force: Math.min(1, into / 14) });
      if (into > 13) car.spin = 0.9;
    }
  }

  private tow(events: RaceEvent[]): void {
    const T = TUNING, room = this.course.half - 1.5;
    // Solo cuenta la gente: un auto automático puede quedar donde sea, nadie lo está buscando en la pantalla.
    let lead: Car | null = null;
    for (const car of this.cars) if (!car.bot && car.finished === null && (lead === null || car.s > lead.s)) lead = car;
    this.cars.forEach((car, i) => {
      if (lead === null || car.bot || car.finished !== null || car.s >= lead.s - T.towSpan) {
        this.lost[i] = 0;
        return;
      }
      this.lost[i] = (this.lost[i] ?? 0) + STEP;
      if (this.lost[i] < T.towGrace) return;
      this.lost[i] = 0;
      car.s = lead.s - T.towBack;
      car.d = clamp(car.d, -room, room);
      car.v = Math.max(car.v, lead.v * 0.9);
      car.yaw = car.slip = car.spin = car.steer = car.nitro = 0;
      car.drifting = car.offTrack = false;
      events.push({ type: 'tow', car: i });
    });
  }

  private collide(events: RaceEvent[]): void {
    const { carLength, carWidth } = TUNING, L = this.course.length;
    for (let a = 0; a < this.cars.length; a++) for (let b = a + 1; b < this.cars.length; b++) {
      const A = this.cars[a], B = this.cars[b];
      // La diferencia de avance se mide dentro de la vuelta: un rezagado también se choca.
      let ds = (B.s - A.s) % L;
      if (ds > L / 2) ds -= L; else if (ds < -L / 2) ds += L;
      const dd = B.d - A.d;
      const overS = carLength - Math.abs(ds), overD = carWidth - Math.abs(dd);
      if (overS <= 0 || overD <= 0) continue;
      const closing = Math.abs(A.v - B.v);
      if (overD < overS) {
        // De costado: se separan y cada uno sale empujado hacia su lado.
        const push = (overD / 2) * Math.sign(dd || 1);
        A.d -= push;
        B.d += push;
        A.yaw -= 0.05 * Math.sign(dd || 1);
        B.yaw += 0.05 * Math.sign(dd || 1);
        A.v *= 0.985;
        B.v *= 0.985;
        events.push({ type: 'hit', car: a, other: b, force: Math.min(1, 0.2 + overD) });
      } else {
        // De atrás: el de adelante recibe el envión y el de atrás lo paga.
        const [front, back] = ds > 0 ? [B, A] : [A, B];
        front.s += overS / 2;
        back.s -= overS / 2;
        const shared = (front.v + back.v) / 2;
        front.v = shared + closing * 0.35;
        back.v = shared - closing * 0.35;
        if (closing > 1) events.push({ type: 'hit', car: a, other: b, force: Math.min(1, closing / 18) });
        if (closing > 20) back.spin = 0.8;
      }
    }
  }

  /** Un piloto automático: busca la cuerda, esquiva al de adelante y frena si la curva no da. */
  private drive(car: Car, input: Input, index: number): void {
    const { course } = this, T = TUNING;
    const look = 12 + car.v * 0.9;
    const kNow = course.curvature(car.s), kAhead = course.curvature(car.s + look), kFar = course.curvature(car.s + look * 2.2);
    // La cuerda: por adentro de la curva que viene, cada bot con su manía de carril.
    const habit = (((index * 37) % 11) / 10 - 0.5) * course.half * 0.9;
    let target = clamp(Math.sign(kAhead) * Math.min(1, Math.abs(kAhead) * 60) * course.half * 0.6 + habit * (1 - Math.min(1, Math.abs(kAhead) * 60)), -course.half + 1.4, course.half - 1.4);
    for (let o = 0; o < this.cars.length; o++) {
      if (o === index) continue;
      const other = this.cars[o];
      const gap = other.s - car.s;
      if (gap > 0 && gap < 6 + car.v * 0.5 && Math.abs(other.d - car.d) < 2.6 && other.v < car.v + 2) {
        target = clamp(other.d + (other.d > car.d ? -3 : 3), -course.half + 1.2, course.half - 1.2);
      }
    }
    const aim = Math.atan2(target - car.d, look);
    input.steer = clamp((aim - car.yaw) * 2.6 + (kAhead - kNow) * 9, -1, 1);
    // Velocidad que aguanta la curva más cerrada de las que vienen.
    const tight = Math.max(Math.abs(kAhead), Math.abs(kFar));
    const safe = tight > 1e-4 ? Math.sqrt((T.grip * 0.93) / (tight * (1 - T.assist * 0.3))) : Infinity;
    input.brake = car.v > safe * 1.06;
    // En la curva cerrada el bot cruza el auto en vez de pasarla derecho.
    input.drift = Math.abs(kNow) > 0.011 && car.v > T.driftFrom + 4;
    input.nitro = !input.brake && tight < 0.004 && Math.abs(car.yaw) < 0.08 && car.nitro > (car.boosting ? 0.02 : 0.6);
  }
}
