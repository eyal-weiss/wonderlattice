import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const J = globalThis.Wonderlattice.models.julia;

test('the Mandelbrot set holds the seeds whose journey from 0 stays trapped', () => {
  for (const [cx, cy] of [
    [0, 0], // z stays 0
    [-1, 0], // 0 → −1 → 0 → …
    [-2, 0], // 0 → −2 → 2 → 2 → …, on the edge but trapped
    [0.25, 0], // the cusp of the cardioid
    [0, 1], // i: 0 → i → −1 + i → −i → −1 + i → …
    [-0.123, 0.745], // the rabbit
  ])
    assert.equal(J.inMandelbrot(cx, cy, 500), true, `${cx} + ${cy}i`);
  for (const [cx, cy] of [
    [0.26, 0], // just past the cusp: escapes, slowly
    [1, 0],
    [0.4, 0.3], // the dust preset
    [-2.1, 0],
  ])
    assert.equal(J.inMandelbrot(cx, cy, 500), false, `${cx} + ${cy}i`);
});

test('journeys: a two-step cycle stays, a point outside the unit circle leaves', () => {
  const cycle = J.orbit(0, 0, -1, 0, 10);
  assert.equal(cycle.escaped, false);
  assert.deepEqual(cycle.points.slice(0, 4), [
    [0, 0],
    [-1, 0],
    [0, 0],
    [-1, 0],
  ]);
  const away = J.orbit(1.5, 0, 0, 0, 50);
  assert.equal(away.escaped, true);
  const [x, y] = away.points.at(-1);
  assert.ok(Math.hypot(x, y) > J.ESCAPE);
  assert.equal(away.steps, away.points.length - 1);
});

test('the smooth escape count: -1 when trapped, and larger the longer a point hesitates', () => {
  assert.equal(J.escape(0.5, 0, 0, 0, 100), -1); // |z| < 1 shrinks to 0 when c = 0
  const far = J.escape(3, 0, 0, 0, 100);
  const near = J.escape(1.05, 0, 0, 0, 100);
  assert.ok(far >= 0 && near > far, `${near} > ${far}`);
  // A point that escapes only after the limit is reported as trapped: the pictures are approximations.
  assert.equal(J.escape(1.0001, 0, 0, 0, 5), -1);
});

test('every Julia set is symmetric: z and −z share a fate', () => {
  for (const [zx, zy] of [
    [0.3, 0.7],
    [-1.1, 0.2],
    [0.05, -0.9],
  ])
    assert.equal(J.escape(zx, zy, -0.123, 0.745, 200), J.escape(-zx, -zy, -0.123, 0.745, 200));
});

test('the cardioid path runs along the main body of the Mandelbrot set', () => {
  assert.deepEqual(J.cardioid(0), [0.25, 0]);
  const [x, y] = J.cardioid(Math.PI);
  assert.ok(Math.abs(x + 0.75) < 1e-12 && Math.abs(y) < 1e-12);
  // Just inside the edge, every seed belongs to the set.
  for (let k = 1; k < 12; k++) {
    const [cx, cy] = J.cardioid((k / 12) * 2 * Math.PI);
    assert.equal(J.inMandelbrot(cx * 0.98, cy * 0.98, 200), true, `k = ${k}`);
  }
});

test('cycle detection only shortcuts points that are really trapped', () => {
  // Inside the rabbit, points fall into its three-cycle; far points still escape with the same count.
  for (const [zx, zy] of [
    [0, 0],
    [0.1, 0.1],
    [-0.2, 0.3],
  ])
    assert.equal(J.escape(zx, zy, -0.123, 0.745, 5000), -1);
  for (const [zx, zy] of [
    [1.2, 0.9],
    [-1.5, -0.2],
  ])
    assert.ok(J.escape(zx, zy, -0.123, 0.745, 5000) >= 0);
  // With c = 0 every point with |z| < 1 is trapped, and the check finds that fast.
  assert.equal(J.escape(0.9, 0, 0, 0, 1e6), -1);
});
