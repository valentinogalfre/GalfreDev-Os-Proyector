import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { beat, newCup, over, scoreRace, FASTEST_LAP, POINTS, type Finish } from './cup.ts';

const car = (id: number | null, name: string, time: number | null, best: number | null): Finish => ({ id, name, time, best });

describe('el campeonato', () => {
  it('reparte los puntos por puesto, y los automáticos ocupan su lugar sin entrar en la tabla', () => {
    const cup = scoreRace(newCup(3), [car(null, 'Rayo', 80, 26), car(1, 'Vale', 81, 27), car(2, 'Tino', 83, 28)]);
    assert.equal(cup.done, 1);
    assert.deepEqual(cup.table.map((r) => [r.name, r.points, r.wins]), [['Vale', POINTS[1], 0], ['Tino', POINTS[2], 0]]);
  });

  it('la vuelta más rápida da un punto extra, y solo si la dio un jugador', () => {
    const mine = scoreRace(newCup(3), [car(1, 'Vale', 81, 27), car(2, 'Tino', 83, 25)]);
    assert.equal(mine.table.find((r) => r.id === 2)!.points, POINTS[1] + FASTEST_LAP);
    const robot = scoreRace(newCup(3), [car(1, 'Vale', 81, 27), car(null, 'Rayo', 83, 25)]);
    assert.equal(robot.table[0].points, POINTS[0]);
  });

  it('acumula de una carrera a la otra, ordena por puntos y desempata por victorias', () => {
    let cup = scoreRace(newCup(3), [car(1, 'Vale', 80, 30), car(null, 'Rayo', 81, 20), car(null, 'Tuerca', 82, 21), car(2, 'Tino', 83, 31)]);
    cup = scoreRace(cup, [car(null, 'Rayo', 80, 20), car(null, 'Tuerca', 81, 21), car(2, 'Tino', 82, 31), car(1, 'Vale', null, 30)]);
    assert.deepEqual(cup.table.map((r) => [r.name, r.points, r.last]), [['Vale', 15, 5], ['Tino', 11, 6]]);
    assert.equal(over(cup), false);
    cup = scoreRace(cup, [car(2, 'Tino', 80, 31), car(null, 'Rayo', 81, 20), car(null, 'Tuerca', 82, 21), car(null, 'Nafta', 83, 22), car(null, 'Chispa', 84, 23), car(1, 'Vale', 85, 30)]);
    assert.deepEqual(cup.table.map((r) => [r.name, r.points, r.wins]), [['Tino', 21, 1], ['Vale', 18, 1]]);
    assert.equal(over(cup), true);
  });

  it('con los mismos puntos y las mismas victorias, va adelante el que mejor llegó en la última', () => {
    let cup = scoreRace(newCup(3), [car(1, 'Vale', 80, 30), car(2, 'Tino', 81, 31), car(null, 'Rayo', 82, 20)]);
    cup = scoreRace(cup, [car(2, 'Tino', 80, 31), car(1, 'Vale', 81, 30), car(null, 'Rayo', 82, 20)]);
    assert.deepEqual(cup.table.map((r) => [r.name, r.points, r.wins]), [['Tino', 18, 1], ['Vale', 18, 1]]);
  });

  it('una carrera suelta nunca cierra un campeonato, y el que entra tarde arranca de cero', () => {
    assert.equal(over(scoreRace(newCup(1), [car(1, 'Vale', 80, 30)])), false);
    let cup = scoreRace(newCup(5), [car(1, 'Vale', 80, 30)]);
    cup = scoreRace(cup, [car(3, 'Lu', 79, 29), car(1, 'Vale', 80, 30)]);
    assert.deepEqual(cup.table.map((r) => [r.name, r.points]), [['Vale', POINTS[0] + FASTEST_LAP + POINTS[1]], ['Lu', POINTS[0] + FASTEST_LAP]]);
  });
});

describe('los récords', () => {
  it('los bate solo un jugador, y dice quién', () => {
    const first = beat({ lap: null, race: null }, [car(null, 'Rayo', 70, 20), car(1, 'Vale', 81, 27), car(2, 'Tino', 83, 26)]);
    assert.deepEqual(first.records, { lap: { time: 26, name: 'Tino' }, race: { time: 81, name: 'Vale' } });
    assert.deepEqual([first.lap, first.race], [2, 1]);
    const worse = beat(first.records, [car(1, 'Vale', 82, 26.5), car(2, 'Tino', null, 27)]);
    assert.deepEqual(worse.records, first.records);
    assert.deepEqual([worse.lap, worse.race], [null, null]);
  });
});
