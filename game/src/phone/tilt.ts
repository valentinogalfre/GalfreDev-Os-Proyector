/**
 * El celular como volante. Se mide para dónde apunta la gravedad dentro del plano de la pantalla y
 * cuánto se apartó de donde estaba al centrar: así da igual si se lo sostiene parado o recostado,
 * y da igual el signo con que cada sistema informa la gravedad.
 */
export class Tilt {
  /** De -1 a 1: positivo es a la izquierda, como en la carrera. */
  steer = 0;
  /** Si llegó alguna medición: en una página sin HTTPS no llega ninguna. */
  alive = false;
  invert = false;
  private neutral: [number, number] | null = null;
  private last: [number, number] = [0, 0];
  private readonly listener = (event: DeviceMotionEvent) => this.read(event);

  /** Pide permiso si hace falta (iPhone) y empieza a medir. Tiene que llamarse desde un toque. */
  async start(): Promise<boolean> {
    const ask = (DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission;
    if (ask) {
      try {
        if ((await ask()) !== 'granted') return false;
      } catch {
        return false;
      }
    }
    addEventListener('devicemotion', this.listener);
    await new Promise((done) => setTimeout(done, 700));
    if (!this.alive) this.stop();
    return this.alive;
  }

  stop(): void {
    removeEventListener('devicemotion', this.listener);
    this.alive = false;
    this.steer = 0;
  }

  /** Lo que se sostiene ahora pasa a ser «derecho». */
  center(): void {
    this.neutral = [...this.last];
  }

  private read(event: DeviceMotionEvent): void {
    const g = event.accelerationIncludingGravity;
    if (!g || g.x === null || g.y === null) return;
    // Apoyado sobre la mesa la gravedad casi no cae en el plano de la pantalla: no hay giro que leer.
    if (Math.hypot(g.x, g.y) < 2.5) return;
    this.alive = true;
    this.last = [g.x, g.y];
    if (!this.neutral) this.neutral = [g.x, g.y];
    const [nx, ny] = this.neutral;
    const angle = Math.atan2(nx * g.y - ny * g.x, nx * g.x + ny * g.y);
    const steer = Math.max(-1, Math.min(1, -angle / FULL_LOCK));
    // Una zona muerta chica en el centro: el pulso de la mano no hace zigzaguear el auto.
    const shaped = Math.abs(steer) < 0.06 ? 0 : (steer - Math.sign(steer) * 0.06) / 0.94;
    this.steer = this.invert ? -shaped : shaped;
  }
}

/** Con 32 grados de giro del celular, el volante está a fondo. */
const FULL_LOCK = (32 * Math.PI) / 180;
