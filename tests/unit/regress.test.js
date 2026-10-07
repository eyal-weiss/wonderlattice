import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.regress;
const near = (a, b, eps) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);
const share = (c, key) => c[key] / (c.better + c.worse);

// Reference numbers from an independent simulation (Python, 4 million standard normal pairs per row; not this code):
// share p | worse after the best p | better after the worst p | mean change after the best p
// 0.1 | 0.9494 | 0.9498 | −1.7554;  0.2 | 0.9006 | 0.8996 | −1.4023;  0.3 | 0.8502 | 0.8502 | −1.1592;
// 0.5 | 0.7497 | 0.7499 | −0.7971.  With praise lifting the next throw by 0.3: worse after praise 0.8418, change −1.1021.

test('the cutoff for the best fifth of throws is 0.8416 standard deviations', () => {
  near(M.cutoff(0.2), 0.8416, 1e-4);
  near(M.cutoff(0.1), 1.2816, 1e-4);
  near(M.cutoff(0.5), 0, 1e-6);
  near(M.cdf(1.96), 0.975, 1e-4);
});

test('in theory, after the best share p the next throw is worse with chance 1 − p/2 (nine in ten for a fifth)', () => {
  for (const [p, worse, change] of [
    [0.1, 0.95, -1.755],
    [0.2, 0.9, -1.3998],
    [0.3, 0.85, -1.159],
    [0.5, 0.75, -0.7979],
  ]) {
    const th = M.theory(p);
    near(th.worse, 1 - p / 2, 1e-4);
    near(th.worse, worse, 1e-4);
    near(th.change, change, 1e-3);
  }
});

test('when praise really lifts the next throw by 0.3, the tally still says it backfires, about 84 times in 100', () => {
  const th = M.theory(0.2, M.BOOST);
  assert.equal(M.BOOST, 0.3);
  near(th.worse, 0.8418, 3e-3);
  near(th.change, -1.1021, 3e-3);
});

test('a long seeded session with the automatic coach matches the simulation', () => {
  const throws = M.session(42, 200000, 0.2);
  const k = M.tally(throws);
  near(share(k.praise, 'worse'), 0.9, 0.005);
  near(share(k.scold, 'better'), 0.9, 0.005);
  // About a fifth of throws praised and a fifth scolded.
  near((k.praise.better + k.praise.worse) / throws.length, 0.2, 0.005);
  near((k.scold.better + k.scold.worse) / throws.length, 0.2, 0.005);
});

test('the coach’s words change nothing: the next throw doesn’t depend on them', () => {
  // The same seed with the words reversed (or none at all) gives exactly the same throws.
  const rand1 = M.random(9),
    rand2 = M.random(9),
    rand3 = M.random(9);
  for (let i = 0; i < 1000; i++) {
    const a = M.nextThrow(rand1, 'praise'),
      b = M.nextThrow(rand2, 'scold'),
      c = M.nextThrow(rand3, null);
    assert.equal(a, b);
    assert.equal(a, c);
  }
  // Only the "praise really helps" setting lifts the throw after praise, by exactly BOOST.
  const r1 = M.random(5),
    r2 = M.random(5);
  near(M.nextThrow(r1, 'praise', true) - M.nextThrow(r2, 'praise', false), 0.3, 1e-12);
});

test('the best-fit line through (this throw, next throw) is flat: one thrower’s throws are uncorrelated', () => {
  const f = M.fit(M.session(7, 100000, 0.2));
  near(f.slope, 0, 0.01);
  near(f.r, 0, 0.01);
  near(f.intercept, 0, 0.01);
  // And a line fits exactly through points that lie on one.
  const line = [0, 1, 2, 3, 4].map((z) => ({ z }));
  assert.equal(M.fit(line).slope, 1);
  assert.equal(M.fit([{ z: 1 }, { z: 2 }]), null);
});

test('the opening session (seed 128, 120 throws) shows the illusion without being picked to exaggerate it', () => {
  const throws = M.session(128, 120, 0.2);
  const k = M.tally(throws);
  assert.deepEqual(k, { praise: { better: 3, worse: 20 }, scold: { better: 26, worse: 3 } });
  const first40 = M.tally(throws.slice(0, 40));
  assert.deepEqual(first40, { praise: { better: 1, worse: 10 }, scold: { better: 9, worse: 1 } });
  near(M.fit(throws).slope, -0.034, 0.001);
});

test('the automatic coach praises the best throws and scolds the worst', () => {
  assert.equal(M.autoWord(1, 0.2), 'praise');
  assert.equal(M.autoWord(-1, 0.2), 'scold');
  assert.equal(M.autoWord(0.5, 0.2), null);
  assert.equal(M.autoWord(0.5, 0.5), 'praise');
});

test('better throws land nearer the bull and score more points', () => {
  assert.ok(M.radius(2) < M.radius(0) && M.radius(0) < M.radius(-2));
  assert.ok(M.radius(9) > 0 && M.radius(-9) < 1);
  assert.equal(M.points(0), 50);
  assert.ok(M.points(1) > M.points(0));
});
