import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Race, TUNING, type Course, type RaceEvent } from './race.ts';

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
  const events: RaceEvent[] = [];
  for (let t = 0; t < seconds * 60; t++) events.push(...race.advance(1 / 60));
  return events;
}

describe('la carrera', () => {
  it('no se mueve hasta que termina la cuenta regresiva', () => {
    const race = new Race(oval(), 3, [true, true]);
    race.start();
    run(race, TUNING.countdown - 0.5);
    assert.equal(race.phase, 'countdown');
    assert.ok(race.cars.every((car) => car.v === 0));
  });

  it('una grilla de bots termina la carrera sin quedarse en el muro', () => {
    const race = new Race(oval(), 3, [true, true, true, true, true, true]);
    race.start();
    const events = run(race, 240);
    assert.equal(race.phase, 'done');
    assert.equal(events.filter((e) => e.type === 'finish').length, 6);
    assert.equal(new Set(race.order()).size, 6);
    // Ir contra el muro es la excepción, no la manera de doblar.
    assert.ok(events.filter((e) => e.type === 'wall').length < 40);
  });

  it('sin doblar, el auto se va afuera en la curva y el muro lo frena', () => {
    const race = new Race(oval(), 3, [false]);
    race.start();
    const events = run(race, 20);
    assert.ok(events.some((e) => e.type === 'wall'));
    assert.ok(Math.abs(race.cars[0].d) <= 8.6 + 1e-6);
  });

  it('el nitro gasta el tanque y pasa la velocidad máxima', () => {
    const race = new Race(oval(), 3, [false]);
    race.start();
    race.cars[0].nitro = 1;
    race.inputs[0].nitro = true;
    run(race, TUNING.countdown + 5.5);
    assert.ok(race.cars[0].v > TUNING.topSpeed);
    assert.ok(race.cars[0].nitro < 0.5);
  });

  it('fuera del asfalto el auto pierde velocidad', () => {
    const race = new Race(oval(), 3, [false]);
    race.start();
    run(race, TUNING.countdown + 6);
    const before = race.cars[0].v;
    race.cars[0].d = 8;
    run(race, 2);
    assert.ok(race.cars[0].offTrack);
    assert.ok(race.cars[0].v < before * 0.8);
  });

  it('dos autos encimados se separan', () => {
    const race = new Race(oval(), 3, [false, false]);
    race.start();
    race.cars[0].d = 0;
    race.cars[1].d = 0.6;
    race.cars[1].s = race.cars[0].s;
    const events = run(race, TUNING.countdown + 0.5);
    assert.ok(events.some((e) => e.type === 'hit'));
    assert.ok(Math.abs(race.cars[0].d - race.cars[1].d) >= TUNING.carWidth - 1e-6);
  });

  it('el que quedó lejos del primero recibe un poco más de velocidad', () => {
    const top = (gap: number) => {
      const race = new Race({ length: 100000, half: 7, wall: 8.6, curvature: () => 0 }, 1, [true, true]);
      race.cars[0].s = gap;
      race.start();
      run(race, TUNING.countdown + 30);
      return race.cars[1].v;
    };
    // Treinta segundos derecho y sin errores: los dos van con el ritmo completo.
    const clean = TUNING.topSpeed * (1 + TUNING.flowGain);
    assert.ok(Math.abs(top(10) - clean) < 0.5);
    assert.ok(top(2000) > clean * (1 + TUNING.catchUp) - 0.5);
  });

  it('el elástico trae a la cola del grupo al jugador que quedó muy atrás, sin nitro; a un automático no', () => {
    const far = (bot: boolean) => {
      const race = new Race({ length: 100000, half: 7, wall: 8.6, curvature: () => 0 }, 1, [false, bot]);
      race.cars[0].s = 400;
      race.cars[1].nitro = 1;
      race.start();
      const events = run(race, TUNING.countdown + TUNING.towGrace + 0.5);
      return { gap: race.cars[0].s - race.cars[1].s, nitro: race.cars[1].nitro, towed: events.filter((e) => e.type === 'tow').length };
    };
    const person = far(false), robot = far(true);
    assert.equal(person.towed, 1);
    assert.ok(person.gap < TUNING.towSpan && person.gap > TUNING.towBack - 10, `quedó a ${person.gap} m`);
    assert.ok(person.nitro < 0.1);
    assert.equal(robot.towed, 0);
    assert.ok(robot.gap > 300);
  });

  it('el elástico deja último al que trae: detrás de los autos que siguen en el grupo', () => {
    const race = new Race({ length: 100000, half: 7, wall: 8.6, curvature: () => 0 }, 1, [false, false, true]);
    race.cars[0].s = 400;
    race.cars[2].s = 350;
    race.start();
    const events = run(race, TUNING.countdown + TUNING.towGrace + 0.2);
    assert.equal(events.filter((e) => e.type === 'tow' && e.car === 1).length, 1);
    assert.ok(race.cars[1].s < race.cars[2].s, 'quedó delante del automático');
    assert.ok(race.cars[0].s - race.cars[1].s < TUNING.towSpan);
  });

  it('pegado detrás de otro auto se va más rápido que solo, y un toque al muro corta el ritmo', () => {
    const top = (lane: number) => {
      const race = new Race({ length: 100000, half: 7, wall: 8.6, curvature: () => 0 }, 1, [false, false]);
      race.start();
      run(race, TUNING.countdown + 25);
      // El de atrás se acomoda a doce metros del otro, en su línea o en la de al lado.
      const [ahead, behind] = race.cars;
      for (let t = 0; t < 600; t++) {
        behind.s = ahead.s - 12;
        behind.d = ahead.d + lane;
        race.advance(1 / 60);
      }
      return behind;
    };
    const tucked = top(0), beside = top(4);
    assert.ok(tucked.draft > 0.9 && beside.draft < 0.1);
    assert.ok(tucked.v > beside.v + TUNING.topSpeed * TUNING.draftGain * 0.5, `${tucked.v} contra ${beside.v}`);
    const race = new Race({ length: 100000, half: 7, wall: 8.6, curvature: () => 0 }, 1, [false]);
    race.start();
    run(race, TUNING.countdown + 12);
    assert.equal(race.cars[0].flow, 1);
    race.inputs[0].steer = 1;
    run(race, 2);
    assert.equal(race.cars[0].flow, 0);
  });

  it('derrapando el auto toma una curva que derecho no entra, y carga nitro', () => {
    // Una curva de 45 m de radio a fondo, con un piloto que busca el medio de la pista.
    const take = (drift: boolean) => {
      const race = new Race({ length: 100000, half: 7, wall: 8.6, curvature: (s) => (s > 400 ? 1 / 45 : 0) }, 1, [false]);
      race.start();
      const car = race.cars[0], input = race.inputs[0];
      while (car.s < 400) race.advance(1 / 60);
      car.nitro = 0;
      input.drift = drift;
      let hitWall = false, slip = 0;
      for (let k = 0; k < 240; k++) {
        input.steer = Math.min(1, Math.max(-1, 1 - car.d * 0.3 - car.yaw * 4));
        if (race.advance(1 / 60).some((e) => e.type === 'wall')) hitWall = true;
        slip = Math.max(slip, car.slip);
      }
      return { hitWall, slip, nitro: car.nitro, speed: car.v };
    };
    const straight = take(false), sideways = take(true);
    assert.ok(straight.hitWall && straight.slip === 0);
    assert.ok(!sideways.hitWall && sideways.slip > 0.2);
    assert.ok(sideways.speed > 45 && sideways.speed < TUNING.topSpeed);
    assert.ok(sideways.nitro > 0.6);
  });
});
