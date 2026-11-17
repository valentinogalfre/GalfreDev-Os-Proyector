/**
 * Un cuadro de la carrera tal como viaja de la pared a los celulares: lo justo para dibujar cada auto en otro
 * equipo. Va como texto corto y no como objeto: son treinta por segundo y la sala del proyector los reparte sin abrirlos.
 */
export interface CarFrame {
  /** Metros recorridos y posición a lo ancho de la pista. */
  s: number; d: number;
  /** Hacia dónde apunta respecto de la pista (rumbo más derrape), en radianes. */
  heading: number;
  /** Cuánto doblan las ruedas, de -1 a 1. */
  steer: number;
  /** Velocidad, en m/s. */
  v: number;
  boosting: boolean; braking: boolean; drifting: boolean; offTrack: boolean;
  /** Altura sobre el asfalto en un salto, en metros, y si lleva el empujón de una plataforma. */
  air: number; surge: boolean;
}

export interface Frame { clock: number; cars: CarFrame[] }

const round = (value: number, digits: number) => String(Math.round(value * 10 ** digits) / 10 ** digits);

export function encodeFrame(frame: Frame): string {
  return [round(frame.clock, 2), ...frame.cars.map((car) => [
    round(car.s, 2), round(car.d, 2), round(car.heading, 3), round(car.steer, 2), round(car.v, 1),
    (car.boosting ? 1 : 0) | (car.braking ? 2 : 0) | (car.drifting ? 4 : 0) | (car.offTrack ? 8 : 0) | (car.surge ? 16 : 0),
    round(car.air, 2),
  ].join(','))].join('|');
}

/** Un número escrito entero: Number('') vale 0, y un campo vacío no es un cero. */
const NUMBER = /^-?\d+(\.\d+)?$/;

/** El cuadro, o null si el texto no es uno: lo que llega de la red no se da por bueno. */
export function decodeFrame(text: string): Frame | null {
  const [clock, ...cars] = text.split('|');
  const frame: Frame = { clock: Number(clock), cars: [] };
  if (!NUMBER.test(clock)) return null;
  for (const car of cars) {
    const fields = car.split(',');
    if (fields.length !== 7 || !fields.every((field) => NUMBER.test(field))) return null;
    const n = fields.map(Number);
    frame.cars.push({ s: n[0], d: n[1], heading: n[2], steer: n[3], v: n[4], boosting: (n[5] & 1) > 0, braking: (n[5] & 2) > 0, drifting: (n[5] & 4) > 0, offTrack: (n[5] & 8) > 0, surge: (n[5] & 16) > 0, air: n[6] });
  }
  return frame;
}

/** El auto entre dos cuadros, [t] de 0 a 1. Las marcas (nitro, freno) son las del cuadro más nuevo. */
export function blend(a: CarFrame, b: CarFrame, t: number): CarFrame {
  const mix = (x: number, y: number) => x + (y - x) * t;
  return { ...b, s: mix(a.s, b.s), d: mix(a.d, b.d), heading: mix(a.heading, b.heading), steer: mix(a.steer, b.steer), v: mix(a.v, b.v), air: mix(a.air, b.air) };
}
