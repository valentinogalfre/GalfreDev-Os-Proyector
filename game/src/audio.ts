import { TUNING } from './sim/race';
import { CLIPS } from './assets/sonido';
import clipsUrl from './assets/sonido.wav?url';

/** Lo que hace falta saber de un auto para hacerlo sonar. */
export interface Heard { v: number; d: number; slip: number; boosting: boolean; braking: boolean; drifting: boolean; offTrack: boolean }

/** Cuántos motores suenan a la vez. Más que esto ya no se distinguen: es un zumbido. */
const VOICES = 3;
/** Cada cuánto se le pasan los valores nuevos a la placa de sonido, en segundos. */
const EVERY = 0.03;

interface Loop { source: AudioBufferSourceNode; level: GainNode }
interface Voice { engine: Loop; tone: BiquadFilterNode; rev: number; loud: number; open: number; boosting: boolean }

/** Vueltas del motor de 0 a 1 y pico: cinco marchas hasta la máxima, y el nitro estira la quinta. */
function revs(v: number): number {
  const x = (Math.max(0, v) / TUNING.topSpeed) * 5, gear = Math.min(4, Math.floor(x)), t = x - gear;
  return gear === 0 ? 0.25 + 0.75 * t : 0.5 + 0.5 * Math.min(1.3, t);
}

/**
 * El sonido de la carrera. Motor, gomas, banquina, golpes y nitro son grabaciones de autos de verdad, todas en un
 * solo archivo que se baja y se descomprime una vez. El motor es un bucle largo de un auto a medias vueltas, que
 * se acelera o se frena para seguir las vueltas de cada auto: un bucle corto se repite igual y suena a sintetizador.
 * Los avisos (cuenta regresiva, vuelta, llegada) son tonos, como los de un semáforo de largada.
 */
export class Sound {
  private readonly ctx: AudioContext;
  private readonly master: GainNode;
  private clips: AudioBuffer | null = null;
  private readonly voices: Voice[] = [];
  private skid: Loop | null = null;
  private rumble: Loop | null = null;
  private level = { skid: 0, rumble: 0 };
  private since = 0;
  private lastCrash = 0;
  private lastBoost = 0;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    // Todo pasa por un compresor: seis choques juntos no saturan el parlante del proyector.
    const squash = ctx.createDynamicsCompressor();
    squash.connect(ctx.destination);
    this.master = ctx.createGain();
    this.master.gain.value = 0.8;
    this.master.connect(squash);
    void this.load();
  }

  /** Baja las grabaciones y deja los motores andando en silencio. Si falla, quedan solo los avisos. */
  private async load(): Promise<void> {
    try {
      const bytes = await (await fetch(clipsUrl)).arrayBuffer();
      // Con las dos funciones y no con la promesa: es la forma que entienden todos los navegadores.
      this.clips = await new Promise<AudioBuffer>((done, fail) => this.ctx.decodeAudioData(bytes, done, fail));
    } catch {
      return;
    }
    for (let k = 0; k < VOICES; k++) {
      const tone = this.ctx.createBiquadFilter();
      tone.type = 'lowpass';
      tone.Q.value = 0.7;
      tone.connect(this.master);
      this.voices.push({ engine: this.loop(CLIPS.motor, tone), tone, rev: 0.25, loud: 0, open: 1, boosting: false });
    }
    this.skid = this.loop(CLIPS.gomas, this.master);
    this.rumble = this.loop(CLIPS.ripio, this.master);
  }

  /** Una grabación dando vueltas sin parar, callada hasta que le suban el nivel. */
  private loop(clip: { from: number; to: number }, into: AudioNode): Loop {
    const source = this.ctx.createBufferSource(), level = this.ctx.createGain();
    source.buffer = this.clips;
    source.loop = true;
    source.loopStart = clip.from;
    source.loopEnd = clip.to;
    level.gain.value = 0;
    source.connect(level);
    level.connect(into);
    // Cada una arranca en un punto distinto: dos motores iguales no suenan en fase.
    source.start(0, clip.from + Math.random() * (clip.to - clip.from));
    return { source, level };
  }

  /** Los navegadores de escritorio no dejan sonar nada hasta el primer toque; el proyector sí. */
  wake(): void {
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  /** Cuadro a cuadro: los autos que se oyen y si hay carrera. Fuera de la carrera los motores se callan. */
  update(cars: Heard[], dt: number, racing: boolean): void {
    const n = Math.min(VOICES, cars.length), ease = Math.min(1, dt * 8);
    let skid = 0, rumble = 0;
    this.voices.forEach((voice, k) => {
      const car = racing && k < n ? cars[k] : null;
      if (car) {
        voice.rev += (revs(car.v) - voice.rev) * ease;
        skid = Math.max(skid, car.drifting ? Math.min(1, Math.abs(car.slip) * 3) : car.braking && car.v > 15 ? 0.35 : 0);
        rumble = Math.max(rumble, car.offTrack ? Math.min(1, car.v / 25) : 0);
        if (car.boosting && !voice.boosting) this.boost();
      }
      voice.boosting = car?.boosting === true;
      // Sin acelerar el motor se apaga y se ensordece; con nitro, lo contrario.
      const open = car ? (car.braking ? 0.3 : 1) : 0.3;
      voice.open += (open - voice.open) * Math.min(1, dt * 7);
      const loud = car ? ((0.5 + 0.5 * voice.rev) * (0.55 + 0.45 * voice.open) * (car.boosting ? 1.2 : 1)) / Math.sqrt(n) : 0;
      voice.loud += (loud - voice.loud) * Math.min(1, dt * 6);
    });
    this.level.skid += (skid - this.level.skid) * Math.min(1, dt * 12);
    this.level.rumble += (rumble - this.level.rumble) * ease;
    // La placa de sonido corre aparte: alcanza con avisarle unas treinta veces por segundo.
    if ((this.since += dt) < EVERY) return;
    this.since = 0;
    this.voices.forEach((voice, k) => {
      // De 0,64 a 1,2 veces la grabación: más lejos que eso deja de sonar a ese motor. Cada auto va un poco
      // desafinado respecto del de al lado, para que se distingan.
      this.glide(voice.engine.source.playbackRate, (0.45 + voice.rev * 0.75) * (1 + (k - 1) * 0.04));
      this.glide(voice.engine.level.gain, voice.loud * 0.85);
      this.glide(voice.tone.frequency, 700 + voice.open * (2600 + voice.rev * 6000));
    });
    if (this.skid) this.glide(this.skid.level.gain, this.level.skid * 0.4);
    if (this.rumble) this.glide(this.rumble.level.gain, this.level.rumble * 0.9);
  }

  /**
   * Lleva un valor de la placa de sonido a [value] deslizándolo. Puesto de golpe treinta veces por segundo, el tono
   * del motor sube en escalones y se oye como un zumbido eléctrico.
   */
  private glide(param: AudioParam, value: number): void {
    param.setTargetAtTime(value, this.ctx.currentTime, 0.04);
  }

  /** La cuenta regresiva: tres tonos iguales y uno más agudo y largo para largar. */
  count(go: boolean): void {
    if (go) this.note(880, 0, 0.55, 0.3);
    else this.note(440, 0, 0.18, 0.28);
  }

  /** Un golpe contra el muro o contra otro auto, de 0 a 1: un roce, un golpe o un choque con vidrios. */
  crash(force: number): void {
    const now = this.ctx.currentTime;
    if (now - this.lastCrash < 0.09) return;
    this.lastCrash = now;
    this.shot(force < 0.35 ? CLIPS.golpe0 : force < 0.75 ? CLIPS.golpe1 : CLIPS.golpe2, 0.3 + force * 0.6, 0.9 + Math.random() * 0.2);
  }

  lap(): void {
    this.note(660, 0, 0.14, 0.2);
    this.note(990, 0.1, 0.26, 0.2);
  }

  finish(): void {
    [523, 659, 784, 1047].forEach((pitch, k) => this.note(pitch, k * 0.11, k === 3 ? 0.6 : 0.2, 0.22));
  }

  /** Alguien abrió el nitro. Si lo abren varios a la vez, suena una sola vez. */
  private boost(): void {
    const now = this.ctx.currentTime;
    if (now - this.lastBoost < 0.5) return;
    this.lastBoost = now;
    this.shot(CLIPS.nitro, 0.5, 1);
  }

  /** Una grabación de una sola vez. */
  private shot(clip: { from: number; to: number }, level: number, rate: number): void {
    if (!this.clips) return;
    const source = this.ctx.createBufferSource(), env = this.ctx.createGain();
    source.buffer = this.clips;
    source.playbackRate.value = rate;
    env.gain.value = level;
    source.connect(env);
    env.connect(this.master);
    source.start(0, clip.from, clip.to - clip.from);
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
