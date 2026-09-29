import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.shower;
const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);
const FREE = [-Infinity, Infinity]; // no stops on the tap: the linear equation itself

// The numbers below were recomputed independently, in Python: the roots with mpmath's Lambert W, the linear
// solutions with the exact method-of-steps series for a constant history, and the tap with its stops by a
// simulation twenty times finer than the room's.

test('three regimes, split at kd = 1/e and kd = π/2', () => {
  assert.deepEqual([0.1, 0.3, 1 / Math.E].map(M.regime), [0, 0, 0]);
  assert.deepEqual([0.37, 0.6, 1.5, 1.5707].map(M.regime), [1, 1, 1, 1]);
  assert.deepEqual([Math.PI / 2, 1.8, 4].map(M.regime), [2, 2, 2]);
  // The longer the pipe, the gentler the bather must be.
  near(M.safeLimit(2), Math.PI / 4);
  near(M.safeLimit(4), Math.PI / 8);
  near(M.smoothLimit(2), 1 / (2 * Math.E));
});

test('the dominant root is W₀(−kd), as mpmath computes it, and solves λ = −k·e^{−λd}', () => {
  const cases = [
    [0.2, -0.259171, 0],
    [1 / Math.E, -1, 0],
    [0.5, -0.794024, 0.770112],
    [0.7, -0.564874, 1.094261],
    [1, -0.318132, 1.337236],
    [Math.PI / 2, 0, Math.PI / 2],
    [1.8, 0.097215, 1.630354],
    [2.5, 0.334081, 1.758536],
  ];
  for (const [kd, re, im] of cases) {
    const mu = M.root(kd);
    near(mu.re, re, 1e-6);
    near(mu.im, im, 1e-6);
    // μ + kd·e^{−μ} = 0, in complex numbers.
    const scale = kd * Math.exp(-mu.re);
    near(mu.re + scale * Math.cos(mu.im), 0, 1e-9);
    near(mu.im - scale * Math.sin(mu.im), 0, 1e-9);
  }
});

test('on the line kd = π/2 the swing neither grows nor fades, and takes exactly 4 pipe-delays', () => {
  for (const d of [0.5, 2, 5]) {
    const w = M.wobble(Math.PI / (2 * d), d);
    near(w.period, 4 * d, 1e-9);
    near(w.ratio, 1, 1e-9);
  }
  assert.equal(M.wobble(0.3, 1), null); // kd = 0.3 < 1/e: no swing at all
  const fades = M.wobble(0.5, 2); // kd = 1
  near(fades.period / 2, 4.698637, 1e-5);
  near(fades.ratio, 0.224297, 1e-5);
  const grows = M.wobble(0.9, 2); // kd = 1.8, the eager bather
  near(grows.period, 2 * 3.853878, 1e-5);
  near(grows.ratio, 1.454489, 1e-5);
});

test('without stops, the simulation follows the exact solution of e′(t) = −k·e(t − d)', () => {
  // The tap starts 1 °C below just right, so e/e₀ is the exact solution for a history of 1.
  const ratio = (k, d, t) => {
    const { tap } = M.run(k, d, t, M.TARGET - 1, FREE);
    return (tap[tap.length - 1] - M.TARGET) / -1;
  };
  near(ratio(0.35, 2, 5), -0.2058958333, 1e-4);
  near(ratio(0.35, 2, 10), 0.0351660833, 1e-4);
  near(ratio(0.15, 2, 10), 0.10387975, 1e-4);
  near(ratio(0.9, 2, 3), -1.295, 1e-9); // before t = 2d the solution is a quadratic, which the trapezoid rule gets exactly
  near(ratio(0.9, 2, 10), -1.483064, 2e-4);
  near(ratio(Math.PI / 4, 2, 16), 0.9060366505, 1e-4);
});

test('overshoot begins just past kd = 1/e', () => {
  // The lowest the tap error goes, as a share of where it started (negative: it went past just right).
  const lowest = (kd) => {
    const { tap } = M.run(kd / 2, 2, 60, M.TARGET - 1, FREE);
    return Math.min(...tap.map((u) => (u - M.TARGET) / -1));
  };
  assert.ok(lowest(0.3) > -1e-6);
  assert.ok(lowest(0.36) > -1e-6);
  near(lowest(0.4), -0.000707, 2e-4);
  near(lowest(0.5), -0.04052, 5e-4);
  near(lowest(0.6), -0.116481, 5e-4);
  near(lowest(0.7), -0.20599, 5e-4);
});

test('the scheme keeps the sharp line: just inside π/2 the swing fades, just outside it grows', () => {
  const late = (kd) => {
    const { tap } = M.run(kd / 2, 2, 300, M.TARGET - 1, FREE);
    return Math.max(...tap.slice(-600).map((u) => Math.abs(u - M.TARGET)));
  };
  assert.ok(late(1.52) < 0.5);
  assert.ok(late(1.62) > 2);
});

test('the eager bather swings between the stops for ever; the patient one settles', () => {
  const eager = M.run(0.9, 2, 90).water;
  near(eager[3 * 60], 35.2, 0.02);
  near(eager[5 * 60], 55, 1e-9); // the tap hit its hot stop
  near(eager[8 * 60], 18.317, 0.02);
  const tail = eager.slice(-20 * 60);
  near(Math.max(...tail), 55, 1e-9);
  near(Math.min(...tail), 16.38, 0.02);
  // A steady swing: the water passes just right, rising, every 7.42 s.
  const ups = [];
  for (let i = 1; i < eager.length; i++)
    if (eager[i - 1] < M.TARGET && eager[i] >= M.TARGET && i * M.DT > 30) ups.push(i * M.DT);
  for (let i = 1; i < ups.length; i++) near(ups[i] - ups[i - 1], 7.424, 0.03);

  const patient = M.run(0.3, 2, 60).water;
  near(Math.max(...patient), 41.26, 0.02);
  near(patient[5 * 60], 33.94, 0.02);
  near(patient[8 * 60], 41.248, 0.02);
  near(patient[10 * 60], 39.753, 0.02);
  const outside = patient.findLastIndex((w) => Math.abs(w - M.TARGET) > 2);
  near(outside * M.DT, 9.75, 0.05);
});

test('with a short pipe the eager bather settles first', () => {
  const settled = (k, d) => M.run(k, d, 30).water.findLastIndex((w) => Math.abs(w - M.TARGET) > 2) * M.DT;
  near(settled(0.9, 0.5), 1.85, 0.05);
  near(settled(0.3, 0.5), 7.9, 0.05);
  // On the line itself the stops keep the swing the same size, between 21 and 55 °C.
  const edge = M.run(Math.PI / 4, 2, 90).water.slice(-30 * 60);
  near(Math.min(...edge), 21, 0.05);
  near(Math.max(...edge), 55, 1e-9);
});

test('the pipe delays the tap by exactly its length, even when the visitor turns the tap', () => {
  const s = M.shower();
  for (let i = 0; i < 60; i++) M.step(s, 0, 1.5, 50); // a second at 50 °C
  near(M.felt(s, 1.5), M.COLD); // the hot water is still in the pipe
  near(M.felt(s, 0.5), 50); // with a short pipe it would already be here
  near(M.tapAgo(s, 1 - M.DT / 2), (50 + M.COLD) / 2); // between the last cold step and the first hot one
  for (let i = 0; i < 30; i++) M.step(s, 0, 1.5, 50);
  near(M.felt(s, 1.5), M.COLD); // 1.5 s on, the last cold water arrives
  M.step(s, 0, 1.5, 50);
  near(M.felt(s, 1.5), 50); // and then the first hot
  M.step(s, 0, 1.5, 99); // the tap stops at its stops
  near(s.tap, M.HOT);
});
