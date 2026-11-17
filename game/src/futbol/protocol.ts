/** Lo que se dicen la pared del fútbol y los jugadores. La sala del launcher solo lo lleva de un lado a otro. */

/** 0 juega a la izquierda, 1 a la derecha, 2 mira desde afuera. */
export type Team = 0 | 1 | 2;

export type Phase = 'lobby' | 'play' | 'over';

/** Las camisetas entre las que se elige. Cada equipo lleva una distinta. */
export const KITS: { name: string; color: number; ink: number }[] = [
  { name: 'Rojo', color: 0xe5484d, ink: 0xffffff },
  { name: 'Azul', color: 0x3e7bfa, ink: 0xffffff },
  { name: 'Cinta', color: 0xe4a32b, ink: 0x111111 },
  { name: 'Hueso', color: 0xf1ede6, ink: 0x111111 },
  { name: 'Verde', color: 0x2fb86b, ink: 0x111111 },
  { name: 'Violeta', color: 0x8e5cf0, ink: 0xffffff },
  { name: 'Carbón', color: 0x2a2a2a, ink: 0xf1ede6 },
  { name: 'Celeste', color: 0x6cc4f0, ink: 0x111111 },
];

/** Minutos de cada partido; 0 es sin reloj. */
export const MINUTES = [3, 5, 7, 10, 0];
/** Goles para ganar; 0 es sin límite. */
export const GOALS = [3, 5, 7, 10, 0];

export interface Seat {
  id: number;
  name: string;
  team: Team;
  /** Hasta dos letras o números sobre el jugador. */
  avatar: string;
  on: boolean;
}

/** Lo que la pared le cuenta a todos los celulares cada vez que cambia. */
export interface Shared {
  phase: Phase;
  paused: boolean;
  field: string;
  minutes: number;
  goals: number;
  /** Qué camiseta de KITS lleva cada equipo. */
  kits: [number, number];
  players: Seat[];
  score: [number, number];
  /** Segundos que faltan, o los jugados si el partido es sin reloj. */
  clock: number;
  overtime: boolean;
  lead: number | null;
  /** El último gol: de qué equipo, quién lo hizo y si fue en contra. */
  last: { team: 0 | 1; name: string; own: boolean } | null;
  /** Al terminar: el equipo que ganó, o -1 si empataron. */
  winner: number | null;
}

/** Lo que pide el que lidera la sala. */
export type Command =
  | { a: 'field'; d: 1 | -1 } | { a: 'time'; d: 1 | -1 } | { a: 'goals'; d: 1 | -1 }
  | { a: 'kit'; team: 0 | 1; d: 1 | -1 } | { a: 'shuffle' } | { a: 'start' } | { a: 'stop' } | { a: 'pause' } | { a: 'exit' };

/** Lo que pide cualquiera en la sala: su equipo y lo que lleva escrito. */
export type Wish = { a: 'team'; team: Team } | { a: 'avatar'; v: string };

export type FromRoom =
  | { t: 'joined'; id: number; key: string; name: string }
  | { t: 'error'; code: 'room' | 'name' | 'full' | 'moved' }
  | { t: 'all'; d: Shared }
  | { t: 'host'; on: boolean }
  | { t: 'pong'; n: number }
  | { t: 'roster'; players: { id: number; name: string; on: boolean }[] }
  | { t: 'in'; id: number; x: number; y: number; k: boolean }
  | { t: 'cmd'; id: number; d: Command | Wish };

/** Lo que se puede escribir sobre un jugador: dos caracteres visibles, sin espacios de más. */
export function cleanAvatar(text: string): string {
  return Array.from(text.replace(/\s+/g, '')).slice(0, 2).join('').toUpperCase();
}
