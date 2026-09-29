import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.pools;
const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);

test('a thousand tubes need ten tests, sixty-three need six: the bits in n, counting "none"', () => {
  assert.equal(M.testsFor(1000), 10);
  assert.equal(M.testsFor(1023), 10);
  assert.equal(M.testsFor(1024), 11);
  assert.equal(M.testsFor(63), 6);
  assert.equal(M.testsFor(64), 7);
});

test('test 1 takes every other tube, test 2 takes pairs, and so on', () => {
  assert.deepEqual(M.members(0, 8), [1, 3, 5, 7]);
  assert.deepEqual(M.members(1, 8), [2, 3, 6, 7]);
  assert.deepEqual(M.members(2, 8), [4, 5, 6, 7]);
  // Checked independently: the sizes of the ten pools for 1,000 tubes.
  assert.deepEqual(
    Array.from({ length: 10 }, (_, k) => M.members(k, 1000).length),
    [500, 500, 500, 497, 496, 489, 489, 489, 489, 489],
  );
});

test('with one hot tube, the ten results spell its number, for every tube', () => {
  for (const [n, tests] of [
    [1000, 10],
    [63, 6],
  ]) {
    for (let tube = 1; tube <= n; tube++) assert.equal(M.decode(M.results([tube], tests)), tube);
    assert.equal(M.decode(M.results([], tests)), 0); // no hot tube: every light stays off
  }
});

test('with two hot tubes, the lights show the OR of their numbers, and point at a third tube', () => {
  assert.equal(M.decode(M.results([673, 290], 10)), 931);
  for (const seed of [1, 2, 3, 50, 9999]) {
    for (const a of [1, 2, 500, 673]) {
      const b = M.partner(a, 1000, seed);
      const pointed = M.decode(M.results([a, b], 10));
      assert.equal(pointed, a | b);
      assert.ok(pointed !== a && pointed !== b && pointed <= 1000, `${a}, ${b} → ${pointed}`);
    }
    // OR never makes a number smaller, so a partner for tube 1,000 points at 1,000 itself or past the rack.
    const b = M.partner(1000, 1000, seed);
    assert.ok(b && (1000 | b) > 1000);
    const c = M.partner(21, 63, seed);
    assert.ok(c >= 1 && c <= 63 && (21 | c) <= 63 && (21 | c) !== 21 && (21 | c) !== c);
  }
});

test('Dorfman: the best pool is 11 at 1% (0.196 a person), 5 at 5%, 4 at 10%', () => {
  assert.deepEqual(M.bestPool(0.01).k, 11);
  near(M.bestPool(0.01).perPerson, 0.1956, 1e-4);
  near(M.perPerson(0.01, 11), 1 / 11 + 1 - 0.99 ** 11, 1e-15);
  assert.equal(M.bestPool(0.05).k, 5);
  near(M.bestPool(0.05).perPerson, 0.4262, 1e-4);
  assert.equal(M.bestPool(0.1).k, 4);
  near(M.bestPool(0.1).perPerson, 0.5939, 1e-4);
  assert.equal(M.bestPool(0.02).k, 8);
  assert.equal(M.perPerson(0.3, 1), 1);
});

test('in a crowd of exactly 100, pools of 10 are best at 1% (19.56 tests), and the leftover pool counts', () => {
  near(M.expectedTests(100, 0.01, 10), 19.562, 1e-3);
  near(M.expectedTests(100, 0.01, 11), 20.362, 1e-3); // nine pools of 11 and one person tested alone
  assert.deepEqual(M.poolSizes(100, 11), [11, 11, 11, 11, 11, 11, 11, 11, 11, 1]);
  assert.equal(M.expectedTests(100, 0.2, 1), 100);
  assert.deepEqual(M.bestPoolFor(100, 0.01), { k: 10, tests: M.expectedTests(100, 0.01, 10) });
  assert.equal(M.bestPoolFor(100, 0.05).k, 5);
  near(M.bestPoolFor(100, 0.05).tests, 42.622, 1e-3);
  assert.equal(M.bestPoolFor(100, 0.1).k, 4);
  near(M.bestPoolFor(100, 0.1).tests, 59.39, 1e-3);
});

test('the cliff: pooling helps only below 1 − 3^(−1/3) ≈ 30.7%; Ungar’s cutoff is (3 − √5)/2', () => {
  near(M.CLIFF, 0.3066387, 1e-6);
  near(M.UNGAR, 0.381966, 1e-6);
  const best = (p) => Math.min(...Array.from({ length: 60 }, (_, i) => M.perPerson(p, i + 2)));
  assert.ok(best(M.CLIFF - 1e-6) < 1);
  assert.ok(best(M.CLIFF + 1e-6) > 1);
  assert.equal(M.bestPool(M.CLIFF - 1e-4).k, 3); // the last pool size to help is 3
  assert.equal(M.bestPool(0.35).k, 1);
  assert.equal(M.bestPoolFor(100, 0.35).k, 1);
});

test('the information floor at 1% is about 8 tests per 100 people', () => {
  near(100 * M.entropy(0.01), 8.079, 1e-3);
  assert.equal(M.entropy(0), 0);
  near(M.entropy(0.5), 1);
});

test('a seeded crowd repeats, and raising the prevalence only adds infected people', () => {
  assert.deepEqual(M.crowd(7, 100, 0.05), M.crowd(7, 100, 0.05));
  const low = M.crowd(7, 100, 0.02),
    high = M.crowd(7, 100, 0.1);
  low.forEach((sick, i) => assert.ok(!sick || high[i]));
  assert.ok(M.crowd(7, 100, 0).every((x) => !x));
  assert.ok(M.crowd(7, 100, 1).every(Boolean));
});

test('running the pools counts one test a pool, plus a retest for everyone in a positive pool', () => {
  const infected = Array(100).fill(false);
  infected[3] = infected[57] = true;
  const r = M.runPools(infected, 10);
  assert.equal(r.pools.length, 10);
  assert.equal(r.tests, 10 + 10 + 10);
  assert.deepEqual(
    r.pools.filter((p) => p.positive).map((p) => p.start),
    [0, 50],
  );
  assert.equal(M.runPools(infected, 1).tests, 100); // one by one
  // Average over many crowds lands on the exact expectation.
  let sum = 0;
  const runs = 4000;
  for (let seed = 1; seed <= runs; seed++) sum += M.runPools(M.crowd(seed, 100, 0.05), 5).tests;
  near(sum / runs, M.expectedTests(100, 0.05, 5), 0.6);
});
