import { cinta } from './cinta';
import { neon } from './neon';
import { puna } from './puna';
import type { Theme } from './theme';

export const THEMES: Record<string, Theme> = { puna, neon, cinta };
/** Dos pinturas más que las seis de cada pista, para que con ocho autos no se repita ninguna. */
export const EXTRA_PAINT = [0x7a3fd0, 0x3fb8d0];
/** Los autos para elegir en una pista: los seis de la pista y dos más con otra pintura. */
export const liveriesOf = (theme: Theme) => [...theme.cars, ...EXTRA_PAINT.map((paint, k) => ({ ...theme.cars[k], paint }))];
