import { TUNING } from './sim/race';

/** Lo que hace falta saber de un auto para hacerlo sonar. */
export interface Heard { v: number; d: number; slip: number; boosting: boolean; braking: boolean; drifting: boolean; offTrack: boolean }

/** Cuántos motores suenan a la vez. Más que esto ya no se distinguen: es un zumbido. */
const VOICES = 4;
/** Cada cuánto se le pasan los valores nuevos a la placa de sonido, en segundos. */
const EVERY = 0.03;

interface Voice { saw: OscillatorNode; sub: OscillatorNode; tone: BiquadFilterNode; level: GainNode; rev: number; loud: number }

/** Vueltas del motor de 0 a 1 y pico: cinco marchas hasta la máxima, y el nitro estira la quinta. */
function revs(v: number): number {
  const x = (Math.max(0, v) / TUNING.topSpeed) * 5, gear = Math.min(4, Math.floor(x)), t = x - gear;
  return gear === 0 ? 0.25 + 0.75 * t : 0.5 + 0.5 * Math.min(1.3, t);
}

/**
 * El sonido de la carrera, hecho con osciladores y ruido filtrado. No hay archivos que cargar ni que descomprimir,
 * que en un equipo con poca memoria importa, y el motor puede seguir la velocidad de cada auto sin cortes.
 */
export class Sound {
  private readonly ctx: AudioContext;
  private readonly master: GainNode;
  private readonly noise: AudioBuffer;
  private readonly voices: Voice[] = [];
  private readonly skid: GainNode;
  private readonly rush: GainNode;
  private readonly rumble: GainNode;
  private level = { skid: 0, rush: 0, rumble: 0 };
  private since = 0;
  private lastCrash = 0;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    // Todo pasa por un compresor: seis choques juntos no saturan el parlante del proyector.
    const squash = ctx.createDynamicsCompressor();
    squash.connect(ctx.destination);
    this.master = ctx.createGain();
    this.master.gain.value = 0.7;
    this.master.connect(squash);

    this.noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const samples = this.noise.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
    const hiss = ctx.createBufferSource();
    hiss.buffer = this.noise;
    hiss.loop = true;
    hiss.start();
    // Del mismo ruido salen las gomas que chillan, el soplido del nitro y el traqueteo de la banquina.
    const band = (type: BiquadFilterType, frequency: number, q: number) => {
      const filter = ctx.createBiquadFilter(), level = ctx.createGain();
      filter.type = type;
      filter.frequency.value = frequency;
      filter.Q.value = q;
      level.gain.value = 0;
      hiss.connect(filter);
      filter.connect(level);
      level.connect(this.master);
      return level;
    };
    this.skid = band('bandpass', 1700, 5);
    this.rush = band('bandpass', 900, 0.6);
    this.rumble = band('lowpass', 140, 1);

    for (let k = 0; k < VOICES; k++) {
      const saw = ctx.createOscillator(), sub = ctx.createOscillator(), tone = ctx.createBiquadFilter(), level = ctx.createGain();
      saw.type = 'sawtooth';
      sub.type = 'square';
      tone.type = 'lowpass';
      tone.Q.value = 1.2;
      level.gain.value = 0;
      saw.connect(tone);
      sub.connect(tone);
      tone.connect(level);
      level.connect(this.master);
      saw.start();
      sub.start();
      this.voices.push({ saw, sub, tone, level, rev: 0.25, loud: 0 });
    }
  }

  /** Los navegadores de escritorio no dejan sonar nada hasta el primer toque; el proyector sí. */
  wake(): void {
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  /** Cuadro a cuadro: los autos que se oyen y si hay carrera. Fuera de la carrera los motores se callan. */
  update(cars: Heard[], dt: number, racing: boolean): void {
    const n = Math.min(VOICES, cars.length), ease = Math.min(1, dt * 8);
    let skid = 0, rush = 0, rumble = 0;
    this.voices.forEach((voice, k) => {
      const car = racing && k < n ? cars[k] : null;
      if (car) {
        voice.rev += (revs(car.v) - voice.rev) * ease;
        skid = Math.max(skid, car.drifting ? Math.min(1, Math.abs(car.slip) * 3) : car.braking && car.v > 15 ? 0.35 : 0);
        rush = Math.max(rush, car.boosting ? 1 : 0);
        rumble = Math.max(rumble, car.offTrack ? Math.min(1, car.v / 25) : 0);
      }
      const loud = car ? ((0.45 + 0.55 * voice.rev) * (car.braking ? 0.55 : 1) * (car.boosting ? 1.25 : 1)) / Math.sqrt(n) : 0;
      voice.loud += (loud - voice.loud) * Math.min(1, dt * 6);
    });
    this.level.skid += (skid - this.level.skid) * Math.min(1, dt * 12);
    this.level.rush += (rush - this.level.rush) * Math.min(1, dt * 5);
    this.level.rumble += (rumble - this.level.rumble) * ease;
    // La placa de sonido corre aparte: alcanza con avisarle unas treinta veces por segundo.
    if ((this.since += dt) < EVERY) return;
    this.since = 0;
    this.voices.forEach((voice, k) => {
      // Cada motor un poco desafinado respecto del de al lado, para que se distingan.
      // El rango queda por encima de lo que un parlante chico ya no reproduce.
      const pitch = (70 + voice.rev * 190) * (1 + (k - 1.5) * 0.035);
      voice.saw.frequency.value = pitch;
      voice.sub.frequency.value = pitch / 2;
      voice.tone.frequency.value = 260 + voice.rev * 1500;
      voice.level.gain.value = voice.loud * 0.2;
    });
    this.skid.gain.value = this.level.skid * 0.16;
    this.rush.gain.value = this.level.rush * 0.3;
    this.rumble.gain.value = this.level.rumble * 0.9;
  }

  /** La cuenta regresiva: tres tonos iguales y uno más agudo y largo para largar. */
  count(go: boolean): void {
    if (go) this.note(880, 0, 0.55, 0.3);
    else this.note(440, 0, 0.18, 0.28);
  }

  /** Un golpe contra el muro o contra otro auto, de 0 a 1. */
  crash(force: number): void {
    const now = this.ctx.currentTime;
    if (now - this.lastCrash < 0.09) return;
    this.lastCrash = now;
    this.burst(0.12 + force * 0.25, 0.3 + force * 0.5, 500 + force * 2000);
    this.note(120, 0, 0.2, 0.35 + force * 0.35, 'sine', 42);
  }

  lap(): void {
    this.note(660, 0, 0.14, 0.2);
    this.note(990, 0.1, 0.26, 0.2);
  }

  finish(): void {
    [523, 659, 784, 1047].forEach((pitch, k) => this.note(pitch, k * 0.11, k === 3 ? 0.6 : 0.2, 0.22));
  }

  /** El elástico trayendo a alguien a la cola del grupo. */
  tow(): void {
    this.note(240, 0, 0.32, 0.22, 'triangle', 960);
  }

  private note(pitch: number, delay: number, length: number, level: number, type: OscillatorType = 'triangle', to = pitch): void {
    const osc = this.ctx.createOscillator(), env = this.ctx.createGain(), at = this.ctx.currentTime + delay;
    osc.type = type;
    osc.frequency.setValueAtTime(pitch, at);
    if (to !== pitch) osc.frequency.exponentialRampToValueAtTime(to, at + length);
    env.gain.setValueAtTime(0.0001, at);
    env.gain.linearRampToValueAtTime(level, at + 0.01);
    env.gain.exponentialRampToValueAtTime(0.0001, at + length);
    osc.connect(env);
    env.connect(this.master);
    osc.start(at);
    osc.stop(at + length + 0.03);
  }

  private burst(length: number, level: number, cutoff: number): void {
    const src = this.ctx.createBufferSource(), filter = this.ctx.createBiquadFilter(), env = this.ctx.createGain(), at = this.ctx.currentTime;
    src.buffer = this.noise;
    filter.type = 'lowpass';
    filter.frequency.value = cutoff;
    env.gain.setValueAtTime(level, at);
    env.gain.exponentialRampToValueAtTime(0.0001, at + length);
    src.connect(filter);
    filter.connect(env);
    env.connect(this.master);
    src.start(at, Math.random() * 1.5);
    src.stop(at + length + 0.03);
  }
}

/** El sonido, o null si este navegador no tiene con qué. */
export function mountSound(): Sound | null {
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  try {
    const sound = new Sound(new Ctx());
    for (const gesture of ['keydown', 'pointerdown']) addEventListener(gesture, () => sound.wake());
    return sound;
  } catch {
    return null;
  }
}
