/** Lo que se dicen la pared y los volantes. La sala del launcher solo lo lleva de un lado a otro. */

import type { Cup, Finish, Records } from '../sim/cup';

export type Phase = 'lobby' | 'countdown' | 'race' | 'results';

/** Los modelos de auto entre los que elige cada uno, en el orden en que los carga la pared. */
export const MODELS = ['Prototipo', 'Deportivo', 'Coupé'];

/** Lo que la pared le cuenta a todos los celulares cada vez que cambia. */
export interface Shared {
  phase: Phase;
  track: string;
  laps: number;
  /** Cuántos autos automáticos pidió el que lidera, y cuántos entran con los que ya están. */
  bots: number;
  room: number;
  /** Quién elige pista y larga: el primero que entró y sigue conectado. */
  lead: number | null;
  players: { id: number; name: string; paint: number; /** Qué modelo de MODELS maneja. */ model: number; on: boolean; /** Maneja la sala aunque no tenga el mando. */ boss: boolean }[];
  /** Los autos en pista, en el orden en que llegan en cada cuadro: de quién es, cómo se llama y cómo se ve. */
  cars: { id: number | null; name: string; look: number; model: number }[];
  /** Quiénes corren esta carrera. El que entra con la carrera empezada espera a la siguiente. */
  racing: number[];
  /** Del primero al último, cuando terminó la carrera. */
  results: Finish[];
  /** El campeonato: de cuántas carreras es, cuántas van y la tabla. Con una sola carrera no hay tabla. */
  cup: Cup;
  /** Los récords de esta pista, y qué jugador batió cada uno en la carrera que acaba de terminar. */
  record: Records & { byLap: number | null; byRace: number | null };
  /** Puerto de la misma página por HTTPS, o 0: el sensor de inclinación solo anda en una página segura. */
  secure: number;
}

/** Lo que la pared le cuenta a cada celular sobre su auto, varias veces por segundo. */
export interface Mine {
  place: number;
  of: number;
  lap: number;
  nitro: number;
  speed: number;
  off: boolean;
  /** Qué le está dando velocidad de más: el rebufo de otro auto, el ritmo de no cometer errores, o nada. */
  plus: '' | 'rebufo' | 'ritmo';
  /** Fuerza de un golpe recién sufrido, de 0 a 1: el celular vibra. */
  buzz: number;
}

/** Lo que pide el que lidera la sala. */
export type Command =
  | { a: 'track'; d: 1 | -1 } | { a: 'bots'; d: 1 | -1 } | { a: 'start' } | { a: 'lobby' }
  /** De cuántas carreras es el campeonato (solo antes de la primera), y empezarlo de cero. */
  | { a: 'rounds'; d: 1 | -1 } | { a: 'cup' }
  /** Cuántas vueltas tiene cada carrera. */
  | { a: 'laps'; d: 1 | -1 }
  /** Largar de nuevo la carrera que se está corriendo, y cerrar la carrera en el proyector. */
  | { a: 'restart' } | { a: 'close' }
  /** Sacar a alguien de la sala, y pasarle el mando a otro. */
  | { a: 'kick'; id: number } | { a: 'lead'; id: number };

/** Lo que pide cualquiera en la sala: la pintura de al lado, o el modelo de al lado. */
export type Wish = { a: 'car'; d: 1 | -1 } | { a: 'model'; d: 1 | -1 };

export interface RosterEntry { id: number; name: string; on: boolean; /** Es el celular del dueño del proyector: maneja la sala siempre. */ boss?: boolean }

export type FromRoom =
  | { t: 'joined'; id: number; key: string; name: string }
  | { t: 'error'; code: 'room' | 'name' | 'full' | 'moved' | 'out' }
  | { t: 'all'; d: Shared }
  | { t: 'you'; d: Mine }
  /** Un cuadro de la carrera, armado por encodeFrame. */
  | { t: 'st'; d: string }
  | { t: 'host'; on: boolean }
  | { t: 'pong'; n: number }
  | { t: 'roster'; players: RosterEntry[] }
  | { t: 'in'; id: number; s: number; b: boolean; n: boolean; k: boolean }
  | { t: 'cmd'; id: number; d: Command | Wish };
