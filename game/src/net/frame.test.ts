import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { blend, decodeFrame, encodeFrame, type CarFrame } from './frame.ts';

const car = (s: number, extra: Partial<CarFrame> = {}): CarFrame => ({ s, d: -2.25, heading: 0.125, steer: -0.5, v: 61.4, boosting: false, braking: false, drifting: false, offTrack: false, air: 0, surge: false, ...extra });

describe('el cuadro de la carrera', () => {
  it('va y vuelve igual, y ocho autos entran holgados en lo que la sala deja pasar', () => {
    const frame = { clock: 83.27, cars: Array.from({ length: 8 }, (_, i) => car(12345.67 + i, { boosting: i % 2 === 0, drifting: i === 3, offTrack: i === 7, braking: i === 1, surge: i === 2, air: i === 5 ? 2.35 : 0 })) };
    const text = encodeFrame(frame);
    assert.deepEqual(decodeFrame(text), frame);
    assert.ok(text.length < 512, `${text.length} caracteres`);
  });

  it('lo que no es un cuadro se descarta entero', () => {
    for (const bad of ['', ' ', 'x', '1|2,3', '1|1,2,3,4,5,6,nada', '1|1,2,3,4,5,6,', '1|1,2,3,4,5,6', '1|1,2,3,4,5,6,7,8', '1e3']) assert.equal(decodeFrame(bad), null, bad);
    assert.deepEqual(decodeFrame('4.5'), { clock: 4.5, cars: [] });
  });

  it('entre dos cuadros el auto va por el medio, con las marcas del más nuevo', () => {
    const mid = blend(car(100), car(110, { d: 1.75, boosting: true }), 0.5);
    assert.deepEqual([mid.s, mid.d, mid.boosting], [105, -0.25, true]);
  });
});
