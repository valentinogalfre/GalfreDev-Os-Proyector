/** El campeonato y los récords: quién suma qué al terminar cada carrera. No sabe nada de pantallas ni de celulares. */

/** Puntos por puesto de llegada, del primero al octavo. */
export const POINTS = [10, 8, 6, 5, 4, 3, 2, 1];
/** El punto extra para el jugador que dio la vuelta más rápida de la carrera. */
export const FASTEST_LAP = 1;
/** De cuántas carreras puede ser un campeonato. Una sola es una carrera suelta: no hay tabla. */
export const ROUNDS = [1, 3, 5, 8];

/** Cómo llegó cada auto, del primero al último. Los automáticos van con id nulo. */
export interface Finish { id: number | null; name: string; time: number | null; best: number | null }

export interface Standing { id: number; name: string; points: number; wins: number; /** Lo que sumó en la última carrera. */ last: number }

export interface Cup { rounds: number; done: number; table: Standing[] }

export function newCup(rounds: number): Cup {
  return { rounds, done: 0, table: [] };
}

/** Terminó la última carrera del campeonato: lo que se ve es la tabla final. */
export function over(cup: Cup): boolean {
  return cup.rounds > 1 && cup.done >= cup.rounds;
}

/**
 * El campeonato después de una carrera. Los automáticos ocupan su puesto en la llegada, así que ganarles vale, pero
 * no entran en la tabla. La vuelta más rápida cuenta contra todos: si la dio un automático, el punto no es de nadie.
 */
export function scoreRace(cup: Cup, finish: Finish[]): Cup {
  let fastest: Finish | null = null;
  for (const car of finish) if (car.best !== null && (fastest === null || car.best < fastest.best!)) fastest = car;
  const table = cup.table.map((row) => ({ ...row, last: 0 }));
  finish.forEach((car, place) => {
    if (car.id === null) return;
    let row = table.find((r) => r.id === car.id);
    if (!row) table.push((row = { id: car.id, name: car.name, points: 0, wins: 0, last: 0 }));
    row.name = car.name;
    row.last = (POINTS[place] ?? 0) + (car === fastest ? FASTEST_LAP : 0);
    row.points += row.last;
    if (place === 0) row.wins++;
  });
  // A igualdad de puntos va adelante el que ganó más carreras, y si no, el que mejor llegó en esta.
  table.sort((a, b) => b.points - a.points || b.wins - a.wins || b.last - a.last);
  return { rounds: cup.rounds, done: cup.done + 1, table };
}

export interface Mark { time: number; name: string }

/** Los récords de una pista: la mejor vuelta y la mejor carrera completa que dio un jugador. */
export interface Records { lap: Mark | null; race: Mark | null }

/** Los récords después de una carrera, y el jugador que batió cada uno, si alguien lo hizo. Los automáticos no cuentan. */
export function beat(records: Records, finish: Finish[]): { records: Records; lap: number | null; race: number | null } {
  let { lap, race } = records, byLap: number | null = null, byRace: number | null = null;
  for (const car of finish) {
    if (car.id === null) continue;
    if (car.best !== null && (lap === null || car.best < lap.time)) {
      lap = { time: car.best, name: car.name };
      byLap = car.id;
    }
    if (car.time !== null && (race === null || car.time < race.time)) {
      race = { time: car.time, name: car.name };
      byRace = car.id;
    }
  }
  return { records: { lap, race }, lap: byLap, race: byRace };
}
