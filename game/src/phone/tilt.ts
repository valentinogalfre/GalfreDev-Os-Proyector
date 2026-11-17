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
  /** Con cuántos grados de giro del celular el volante está a fondo. */
  lock = 30;
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
    // El sensor tiembla con el pulso y con cada toque en la pantalla: se promedia un poco antes de leerlo.
    const [lx, ly] = this.alive ? this.last : [g.x, g.y];
    const x = lx + (g.x - lx) * 0.35, y = ly + (g.y - ly) * 0.35;
    this.alive = true;
    this.last = [x, y];
    if (!this.neutral) this.neutral = [x, y];
    const [nx, ny] = this.neutral;
    const angle = Math.atan2(nx * y - ny * x, nx * x + ny * y);
    const steer = Math.max(-1, Math.min(1, -angle / ((this.lock * Math.PI) / 180)));
    // Una zona muerta chica en el centro: el pulso de la mano no hace zigzaguear el auto.
    const shaped = Math.abs(steer) < 0.06 ? 0 : (steer - Math.sign(steer) * 0.06) / 0.94;
    this.steer = this.invert ? -shaped : shaped;
  }
}
