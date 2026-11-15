import { describe, expect, it } from 'vitest';
import { Race, TUNING, type Course } from './race';

/** Un óvalo: dos rectas de 300 m unidas por dos curvas de radio 60 m. */
function oval(): Course {
  const straight = 300, radius = 60, arc = Math.PI * radius;
  const length = 2 * (straight + arc);
  return {
    length, half: 7, wall: 8.6,
    curvature(s) {
      const at = ((s % length) + length) % length;
      return at < straight || (at >= straight + arc && at < 2 * straight + arc) ? 0 : 1 / radius;
    },
  };
}

function run(race: Race, seconds: number) {
  const events = [];
  for (let t = 0; t < seconds * 60; t++) events.push(...race.advance(1 / 60));
  return events;
}

describe('la carrera', () => {
  it('no se mueve hasta que termina la cuenta regresiva', () => {
    const race = new Race(oval(), 3, [true, true]);
    race.start();
    run(race, TUNING.countdown - 0.5);
    expect(race.phase).toBe('countdown');
    expect(race.cars.every((car) => car.v === 0)).toBe(true);
  });

  it('una grilla de bots termina la carrera sin quedarse en el muro', () => {
    const race = new Race(oval(), 3, [true, true, true, true, true, true]);
    race.start();
    const events = run(race, 240);
    expect(race.phase).toBe('done');
    expect(events.filter((e) => e.type === 'finish')).toHaveLength(6);
    expect(new Set(race.order()).size).toBe(6);
    // Ir contra el muro es la excepción, no la manera de doblar.
    expect(events.filter((e) => e.type === 'wall').length).toBeLessThan(40);
  });

  it('sin doblar, el auto se va afuera en la curva y el muro lo frena', () => {
    const race = new Race(oval(), 3, [false]);
    race.start();
    const events = run(race, 20);
    expect(events.some((e) => e.type === 'wall')).toBe(true);
    expect(Math.abs(race.cars[0].d)).toBeLessThanOrEqual(8.6 + 1e-6);
  });

  it('el nitro gasta el tanque y pasa la velocidad máxima', () => {
    const race = new Race(oval(), 3, [false]);
    race.start();
    race.cars[0].nitro = 1;
    race.inputs[0].nitro = true;
    run(race, TUNING.countdown + 5.5);
    expect(race.cars[0].v).toBeGreaterThan(TUNING.topSpeed);
    expect(race.cars[0].nitro).toBeLessThan(0.5);
  });

  it('fuera del asfalto el auto pierde velocidad', () => {
    const race = new Race(oval(), 3, [false]);
    race.start();
    run(race, TUNING.countdown + 6);
    const before = race.cars[0].v;
    race.cars[0].d = 8;
    run(race, 2);
    expect(race.cars[0].offTrack).toBe(true);
    expect(race.cars[0].v).toBeLessThan(before * 0.8);
  });

  it('dos autos encimados se separan', () => {
    const race = new Race(oval(), 3, [false, false]);
    race.start();
    race.cars[0].d = 0;
    race.cars[1].d = 0.6;
    race.cars[1].s = race.cars[0].s;
    const events = run(race, TUNING.countdown + 0.5);
    expect(events.some((e) => e.type === 'hit')).toBe(true);
    expect(Math.abs(race.cars[0].d - race.cars[1].d)).toBeGreaterThanOrEqual(TUNING.carWidth - 1e-6);
  });
});
