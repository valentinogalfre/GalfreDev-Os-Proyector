import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { FIELDS, Match, TICK } from './sim.ts';
import { cleanAvatar } from './protocol.ts';

const field = FIELDS[1];
const run = (match: Match, ticks: number) => { for (let i = 0; i < ticks; i++) match.step(); };
/** Pone la pelota andando hacia un arco, como si alguien la hubiera pateado. */
const shoot = (match: Match, toRight: boolean, by: number | null = null) => {
  match.state = 'play';
  match.lastTouch = by;
  Object.assign(match.ball, { x: toRight ? field.w - 60 : -field.w + 60, y: 0, vx: toRight ? 8 : -8, vy: 0 });
};

describe('el partido', () => {
  it('patear empuja la pelota lejos y vale una sola vez por apretada', () => {
    const match = new Match(field);
    const p = match.add(1, 0);
    Object.assign(p.disc, { x: -27, y: 0 });
    p.input.kick = true;
    match.step();
    assert.ok(match.ball.vx > 3, `la pelota salió a ${match.ball.vx}`);
    assert.equal(match.state, 'play');
    assert.deepEqual(match.drain().map((e) => e.type), ['kick']);
    run(match, 5);
    assert.equal(match.drain().filter((e) => e.type === 'kick').length, 0);
  });

  it('la pelota que entra al arco de la derecha es gol del de la izquierda, y vuelve al medio', () => {
    const match = new Match(field);
    match.add(1, 0);
    match.add(2, 1);
    shoot(match, true, 1);
    run(match, 30);
    assert.deepEqual(match.score, [1, 0]);
    const goal = match.drain().find((e) => e.type === 'goal');
    assert.deepEqual(goal, { type: 'goal', team: 0, by: 1, own: false });
    assert.equal(match.state, 'goal');
    // La red la frena: no se va de la cancha.
    assert.ok(match.ball.x <= field.w + field.depth);
    run(match, 200);
    assert.equal(match.state, 'kickoff');
    assert.equal(match.kickoff, 1);
    assert.equal(match.ball.x, 0);
  });

  it('el gol en contra se cuenta para el rival y se avisa', () => {
    const match = new Match(field);
    match.add(1, 0);
    shoot(match, false, 1);
    run(match, 30);
    assert.deepEqual(match.score, [0, 1]);
    assert.equal((match.drain().find((e) => e.type === 'goal') as { own: boolean }).own, true);
  });

  it('afuera del arco la pelota rebota contra el fondo y el costado', () => {
    const match = new Match(field);
    match.state = 'play';
    Object.assign(match.ball, { x: field.w - 20, y: field.goal + 60, vx: 9, vy: 0 });
    run(match, 10);
    assert.ok(match.ball.vx < 0 && match.ball.x < field.w);
    Object.assign(match.ball, { x: 0, y: field.h - 20, vx: 0, vy: 9 });
    run(match, 10);
    assert.ok(match.ball.vy < 0 && match.ball.y < field.h);
    assert.deepEqual(match.score, [0, 0]);
  });

  it('en el saque el que no saca no entra al círculo ni a la otra mitad', () => {
    const match = new Match(field);
    const rival = match.add(2, 1);
    rival.input.x = -1;
    run(match, 240);
    assert.equal(match.state, 'kickoff');
    assert.ok(Math.hypot(rival.disc.x, rival.disc.y) >= field.circle + rival.disc.r - 1e-6);
    assert.ok(rival.disc.x > 0);
  });

  it('con el reloj cumplido y empate hay gol de oro; el primer gol termina el partido', () => {
    const match = new Match(field, 60);
    match.add(1, 0);
    match.state = 'play';
    run(match, 61);
    assert.equal(match.overtime, true);
    assert.equal(match.clock, 0);
    shoot(match, true, 1);
    run(match, 200);
    assert.equal(match.state, 'over');
    assert.equal(match.winner, 0);
  });

  it('el que llega a los goles pedidos gana; con reloj y ventaja, gana al terminar el tiempo', () => {
    const byGoals = new Match(field, 0, 1);
    shoot(byGoals, false);
    run(byGoals, 200);
    assert.equal(byGoals.winner, 1);
    const byClock = new Match(field, 120);
    byClock.score = [2, 1];
    byClock.state = 'play';
    run(byClock, 121);
    assert.equal(byClock.state, 'over');
    assert.equal(byClock.winner, 0);
    assert.equal(Math.round(120 * TICK), 2);
  });

  it('el que cambia de equipo pasa a su mitad', () => {
    const match = new Match(field);
    const p = match.add(1, 0);
    assert.ok(p.disc.x < 0);
    match.add(1, 1);
    assert.ok(p.disc.x > 0);
    assert.equal(match.players.size, 1);
  });

  it('lo escrito sobre el jugador son dos caracteres en mayúscula', () => {
    assert.equal(cleanAvatar(' v a l e '), 'VA');
    assert.equal(cleanAvatar('10'), '10');
    assert.equal(cleanAvatar('⚽x'), '⚽X');
  });
});
