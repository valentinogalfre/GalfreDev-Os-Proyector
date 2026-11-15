/** Lo que se dicen la pared y los volantes. La sala del launcher solo lo lleva de un lado a otro. */

export type Phase = 'lobby' | 'countdown' | 'race' | 'results';

/** Lo que la pared le cuenta a todos los celulares cada vez que cambia. */
export interface Shared {
  phase: Phase;
  track: string;
  laps: number;
  /** Quién elige pista y larga: el primero que entró y sigue conectado. */
  lead: number | null;
  players: { id: number; name: string; paint: number; on: boolean }[];
  /** Quiénes corren esta carrera. El que entra con la carrera empezada espera a la siguiente. */
  racing: number[];
  /** Del primero al último, cuando terminó la carrera. */
  results: { id: number | null; name: string; time: number | null }[];
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
  /** Fuerza de un golpe recién sufrido, de 0 a 1: el celular vibra. */
  buzz: number;
}

/** Lo que pide el que lidera la sala. */
export type Command = { a: 'track'; d: 1 | -1 } | { a: 'start' } | { a: 'lobby' };

/** Lo que pide cualquiera en la sala: el auto de al lado. */
export type Wish = { a: 'car'; d: 1 | -1 };

export interface RosterEntry { id: number; name: string; on: boolean }

export type FromRoom =
  | { t: 'joined'; id: number; key: string; name: string }
  | { t: 'error'; code: 'room' | 'name' | 'full' }
  | { t: 'all'; d: Shared }
  | { t: 'you'; d: Mine }
  | { t: 'host'; on: boolean }
  | { t: 'pong'; n: number }
  | { t: 'roster'; players: RosterEntry[] }
  | { t: 'in'; id: number; s: number; b: boolean; n: boolean; k: boolean }
  | { t: 'cmd'; id: number; d: Command | Wish };
