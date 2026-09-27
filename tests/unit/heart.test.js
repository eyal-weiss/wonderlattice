import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.heart;
const K = 1.4; // the room's default recovery rate
const at = (field, fx, fy) => field.u[Math.round(fy * (field.ny - 1)) * field.nx + Math.round(fx * (field.nx - 1))];

/** The mean distance of firing cells from (cx, cy), in cells. */
function ringRadius(field, cx, cy) {
  let sum = 0,
    n = 0;
  for (let y = 0; y < field.ny; y++)
    for (let x = 0; x < field.nx; x++)
      if (field.u[y * field.nx + x] > M.FIRING) {
        sum += Math.hypot(x - cx, y - cy);
        n++;
      }
  return n ? sum / n : 0;
}

test('one stimulus makes a ring that grows outwards, leaving recovering cells inside', () => {
  const field = M.create(81, 81);
  M.stimulate(field, 0.5, 0.5, 3);
  M.step(field, K, 80);
  const r1 = ringRadius(field, 40, 40);
  M.step(field, K, 80);
  const r2 = ringRadius(field, 40, 40);
  assert.ok(r1 > 4, `the wave left the stimulus (radius ${r1.toFixed(1)})`);
  assert.ok(r2 > r1 + 3, `the ring grew (${r1.toFixed(1)} → ${r2.toFixed(1)})`);
  assert.ok(at(field, 0.5, 0.5) < M.FIRING, 'the centre is no longer firing');
  assert.equal(M.tips(field), 0, 'a closed ring has no spiral tips');
});

test('two waves that meet cancel instead of passing through each other', () => {
  const field = M.create(100, 40);
  M.stimulate(field, 0.2, 0.5, 3);
  M.stimulate(field, 0.8, 0.5, 3);
  // A cell between the middle and the right source: the right wave reaches it first; if the left wave passed
  // through the collision, the cell would fire again.
  let fired = 0,
    before = false;
  for (let i = 0; i < 2400; i++) {
    M.step(field, K);
    const now = at(field, 0.62, 0.5) > M.FIRING;
    if (now && !before) fired++;
    before = now;
  }
  assert.equal(fired, 1);
  assert.equal(M.firing(field), 0, 'afterwards the whole sheet is at rest');
});

test('a broken wave curls into spirals that keep turning; an unbroken one dies out', () => {
  const broken = M.create(80, 60);
  const whole = M.create(80, 60);
  for (const f of [broken, whole]) {
    M.stimulate(f, 0.5, 0.5, 3);
    M.step(f, K, 160);
  }
  M.cutTop(broken);
  M.step(broken, K, 4000); // 100 time units: far longer than a wave takes to cross the sheet
  M.step(whole, K, 4000);
  assert.ok(M.firing(broken) > 0, 'the spirals are still turning');
  assert.equal(M.tips(broken), 2, 'a pair of spirals, one tip each');
  assert.equal(M.firing(whole), 0, 'the unbroken ring left the sheet and everything rests');
});

test('wiping resets cells to rest, and resizing keeps the pattern', () => {
  const field = M.create(60, 40);
  M.stimulate(field, 0.5, 0.5, 6);
  assert.ok(at(field, 0.5, 0.5) === 1);
  M.wipe(field, 0.3, 0.5, 0.7, 0.5, 2);
  assert.equal(at(field, 0.5, 0.5), 0);
  M.stimulate(field, 0.25, 0.25, 4);
  const bigger = M.resize(field, 120, 80);
  assert.equal(bigger.nx, 120);
  assert.equal(at(bigger, 0.25, 0.25), 1);
  assert.equal(at(bigger, 0.75, 0.75), 0);
});
