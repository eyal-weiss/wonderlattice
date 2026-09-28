import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.weather;

test('weather: the Runge–Kutta steps are accurate, and fourth order', () => {
  const coarse = M.run(M.START, 1, 0.01),
    fine = M.run(M.START, 1, 0.005),
    finest = M.run(M.START, 1, 0.0025);
  const e1 = M.distance(coarse, finest),
    e2 = M.distance(fine, finest);
  assert.ok(e2 < 1e-4, `step 0.005 is accurate to ${e2}`);
  // Halving the step cuts the error about sixteen-fold for a fourth-order method (a little over, measured here).
  assert.ok(e1 / e2 > 10 && e1 / e2 < 25, `error ratio ${e1 / e2}`);
});

test('weather: the rules are exact, so the same start always gives the same weather', () => {
  assert.deepEqual(M.run(M.START, 5), M.run(M.START, 5));
  assert.deepEqual(M.twins(M.START, 6, 3, 42), M.twins(M.START, 6, 3, 42));
});

test('weather: twins start exactly 10^−digits from the truth', () => {
  const [truth, ...rest] = M.twins(M.START, 6, 5, 7);
  assert.deepEqual(truth, [...M.START]);
  for (const p of rest) assert.ok(Math.abs(M.distance(p, truth) - 1e-6) < 1e-12);
});

test('weather: a tiny gap grows roughly exponentially, at about the Lyapunov rate', () => {
  // Average the growth rate over several twins: log of the gap from day 2 to day 14, per day.
  const rates = [1, 2, 3, 4, 5, 6].map((seed) => {
    const [a0, b0] = M.twins(M.START, 10, 1, seed);
    const a2 = M.run(a0, 2),
      b2 = M.run(b0, 2);
    const a14 = M.run(a2, 12),
      b14 = M.run(b2, 12);
    return Math.log(M.distance(a14, b14) / M.distance(a2, b2)) / 12;
  });
  const mean = rates.reduce((x, y) => x + y) / rates.length;
  assert.ok(mean > 0.6 && mean < 1.3, `mean growth rate ${mean} per day (Lyapunov exponent ≈ 0.906)`);
});

test('weather: each extra decimal place buys about the same small extra time', () => {
  const mean = (digits) => [1, 2, 3, 4, 5].reduce((sum, seed) => sum + M.horizon(M.START, digits, 1, seed), 0) / 5;
  const h3 = mean(3),
    h6 = mean(6),
    h9 = mean(9),
    h12 = mean(12);
  // A roughly straight line in the number of digits: logarithmic in the precision, never a leap.
  const perDigit = (h12 - h3) / 9;
  assert.ok(perDigit > 1.5 && perDigit < 3.5, `about ${perDigit} days per digit (ln 10 / λ ≈ 2.5)`);
  assert.ok(h6 > h3 && h9 > h6 && h12 > h9);
  assert.ok(h12 < 3 * h3 + 15, 'a billion times more precision buys weeks, not forever');
  assert.ok(Math.abs(M.predictedHorizon(12) - M.predictedHorizon(3) - 9 * (Math.LN10 / M.LAMBDA)) < 1e-9);
});

test('weather: the butterfly stays on its wings', () => {
  const points = M.butterfly(3000);
  for (const [x, y, z] of points) {
    assert.ok(Math.abs(x) < 25 && Math.abs(y) < 32 && z > 0 && z < 55);
  }
});
