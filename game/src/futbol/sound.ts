/** Los sonidos del fútbol, armados al vuelo: patada, silbato, gol y rebote. No hay archivos que bajar. */
export class Whistle {
  private readonly ctx: AudioContext | null;
  private readonly out: GainNode | null;
  private noise: AudioBuffer | null = null;

  constructor() {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    this.ctx = Ctx ? new Ctx() : null;
    this.out = this.ctx ? this.ctx.createGain() : null;
    if (this.ctx && this.out) {
      this.out.gain.value = 0.6;
      this.out.connect(this.ctx.destination);
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate / 4, this.ctx.sampleRate), data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      this.noise = buffer;
    }
  }

  kick(power: number): void {
    if (!this.ctx || !this.out || !this.noise) return;
    void this.ctx.resume?.();
    const t = this.ctx.currentTime, src = this.ctx.createBufferSource(), band = this.ctx.createBiquadFilter(), env = this.ctx.createGain();
    src.buffer = this.noise;
    band.type = 'lowpass';
    band.frequency.value = 500 + power * 900;
    env.gain.setValueAtTime(0.35 + power * 0.5, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    src.connect(band);
    band.connect(env);
    env.connect(this.out);
    src.start(t);
    src.stop(t + 0.14);
    this.tone(90, 0.12, 0.4 * power + 0.2, 'sine', 40);
  }

  /** Corto para sacar del medio, tres para el final. */
  whistle(times = 1): void {
    for (let i = 0; i < times; i++) this.tone(2900, i === times - 1 ? 0.55 : 0.22, 0.16, 'square', 2700, i * 0.32);
  }

  goal(): void {
    [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.5, 0.18, 'triangle', f, i * 0.09));
    this.whistle(1);
  }

  private tone(freq: number, length: number, level: number, type: OscillatorType, to: number, delay = 0): void {
    if (!this.ctx || !this.out) return;
    void this.ctx.resume?.();
    const t = this.ctx.currentTime + delay, osc = this.ctx.createOscillator(), env = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + length);
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(level, t + 0.01);
    env.gain.exponentialRampToValueAtTime(0.0001, t + length);
    osc.connect(env);
    env.connect(this.out);
    osc.start(t);
    osc.stop(t + length + 0.02);
  }
}
