import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.stopping;
const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);

// The numbers below were worked out separately, with exact fractions in Python (not this code):
// n = 10: cutoff 3, P = 0.3987; n = 100: cutoff 37, P = 0.3710; top 10 of 100: cutoff 14, P = 0.8168, P(37) = 0.6629.

test('the exact chance of the very best: P(r) = (r/n) Σ 1/(i − 1), largest at 3 of 10 and 37 of 100', () => {
  near(M.chanceBest(10, 3), 0.398690476190476, 1e-12); // 3/10 · (1/3 + 1/4 + … + 1/9)
  near(M.chanceBest(100, 37), 0.371042778712643, 1e-12);
  near(M.chanceBest(10, 0), 0.1);
  near(M.chanceBest(10, 1), 0.1 * M.harmonic(9));
  assert.deepEqual(M.bestCutoff(10).cutoff, 3);
  assert.deepEqual(M.bestCutoff(100).cutoff, 37);
  near(M.bestCutoff(100).chance, 0.371, 1e-4);
  // A direct sum, without the harmonic numbers.
  for (const [n, r] of [
    [100, 37],
    [100, 1],
    [100, 99],
    [10, 5],
  ]) {
    let sum = 0;
    for (let i = r + 1; i <= n; i++) sum += 1 / (i - 1);
    near(M.chanceBest(n, r), (r / n) * sum, 1e-12);
  }
});

test('the harmonic numbers agree across the switch from summing to the asymptotic series', () => {
  let h = 0;
  for (let i = 1; i <= 5000; i++) h += 1 / i;
  near(M.harmonic(5000), h, 1e-12);
  near(M.harmonic(999) + 1 / 1000, M.harmonic(1000), 1e-13);
});

test('with more cards the best cutoff tends to n/e and the chance to 1/e, barely changing after 100', () => {
  const thousand = M.bestCutoff(1000),
    million = M.bestCutoff(1e6);
  assert.equal(thousand.cutoff, 368);
  near(thousand.chance, 0.3682, 1e-4);
  assert.equal(million.cutoff, 367879);
  near(million.chance, 1 / Math.E, 1e-5);
  // The near-n/e search for big n agrees with trying every cutoff.
  let best = 0;
  for (let r = 1; r < 3000; r++) if (M.chanceBest(3000, r) > M.chanceBest(3000, best)) best = r;
  assert.equal(M.bestCutoff(3000).cutoff, best);
});

test('the limit −x ln x peaks at x = 1/e, at height 1/e, and P(r) approaches it', () => {
  near(M.limit(1 / Math.E), 1 / Math.E, 1e-15);
  for (const x of [0.2, 0.3, 0.36, 0.38, 0.45, 0.6]) assert.ok(M.limit(x) < M.limit(1 / Math.E));
  near(M.limit(1), 0);
  assert.equal(M.limit(0), 0);
  for (const x of [0.1, 0.37, 0.8]) near(M.chanceBest(1e6, Math.round(x * 1e6)), M.limit(x), 1e-5);
});

test('happy with the top 10 of 100: the best cutoff slides left to 14, at about 82%; 37 gives about 66%', () => {
  near(M.chanceTop(100, 37, 1), M.chanceBest(100, 37), 1e-12); // k = 1 is the classic problem
  const top = M.bestCutoff(100, 10);
  assert.equal(top.cutoff, 14);
  near(top.chance, 0.8168, 1e-4);
  near(M.chanceTop(100, 37, 10), 0.6629, 1e-4);
  near(M.chanceTop(100, 13, 10), 0.8153, 1e-4);
  near(M.chanceTop(100, 15, 10), 0.8166, 1e-4);
  near(M.chanceTop(100, 0, 10), 0.1);
  near(M.chanceTop(10, 9, 10), 1, 1e-12); // every card is in the top 10 of 10
});

test('the best possible rule: the cutoff rule for the very best; several thresholds, 98.1%, for the top 10', () => {
  const one = M.bestPossible(100, 1);
  near(one.chance, M.bestCutoff(100).chance, 1e-9);
  assert.deepEqual(one.from, [38]); // look at 37, take a new best from card 38 on
  near(M.bestPossible(10, 1).chance, M.bestCutoff(10).chance, 1e-12);
  const ten = M.bestPossible(100, 10);
  near(ten.chance, 0.9814, 1e-4); // a separate Python version, and a simulation of its thresholds, agree
  assert.ok(ten.chance > M.bestCutoff(100, 10).chance);
  // It takes a new best from card 32, a second best so far from card 44, a third from 53, … a tenth from 94.
  assert.deepEqual(ten.from, [32, 44, 53, 61, 68, 74, 79, 84, 89, 94]);
});

test('seeded simulations of every cutoff at once match the exact curves', () => {
  const n = 100,
    k = 10;
  const tally = M.simulate(n, k, 20000, M.random(7), M.tallies(n));
  assert.equal(tally.deals, 20000);
  for (const r of [0, 1, 5, 14, 37, 60, 99]) {
    // Four standard errors of 20,000 deals is at most 1.5 percentage points.
    near(tally.best[r] / tally.deals, M.chanceBest(n, r), 0.015);
    near(tally.top[r] / tally.deals, M.chanceTop(n, r, k), 0.015);
  }
  // The simulated peaks land near the exact ones.
  const peak = (series) => series.indexOf(Math.max(...series));
  assert.ok(Math.abs(peak([...tally.best]) - 37) <= 8);
  assert.ok(Math.abs(peak([...tally.top]) - 14) <= 6);
  // The same seed plays the same deals.
  const again = M.simulate(n, k, 200, M.random(3), M.tallies(n));
  assert.deepEqual([...again.best], [...M.simulate(n, k, 200, M.random(3), M.tallies(n)).best]);
});

test('the simulation’s shortcut takes the same card as playing the rule card by card', () => {
  for (let seed = 1; seed <= 300; seed++) {
    const values = M.deal(30, seed);
    const taken = M.picks(M.ranks(values));
    for (let r = 0; r < 30; r++) assert.equal(taken[r], M.ruleChoice(values, r), `deal ${seed}, cutoff ${r}`);
  }
});

test('a deal: different whole numbers, the same for the same seed, and the rule never goes back', () => {
  const a = M.deal(100, 42),
    b = M.deal(100, 42);
  assert.deepEqual(a, b);
  assert.notDeepEqual(a, M.deal(100, 43));
  assert.equal(new Set(a).size, 100);
  assert.ok(a.every((v) => Number.isInteger(v) && v >= 1));
  const rank = M.ranks(a);
  assert.deepEqual(
    [...rank].sort((x, y) => x - y),
    Array.from({ length: 100 }, (_, i) => i + 1),
  );
  assert.equal(a[rank.indexOf(1)], Math.max(...a));
  // The rule takes the first card after the cutoff that beats every card before it, or the last card.
  for (const r of [1, 10, 37, 99]) {
    const i = M.ruleChoice(a, r);
    assert.ok(i >= r);
    const bar = Math.max(...a.slice(0, r));
    if (i < 99 || a[i] > bar) {
      assert.ok(a[i] > bar);
      assert.ok(a.slice(r, i).every((v) => v < bar));
    }
  }
  assert.equal(M.ruleChoice(a, 0), 0);
  assert.equal(M.ruleChoice([5, 4, 3, 2], 1), 3); // nothing beats the first card: the last is yours
});

test('a deal of 100 puts its biggest and smallest cards anywhere, evenly', () => {
  // Without the shuffle, redrawing repeated numbers left the small ones early: the smallest card averaged 40.8.
  let biggest = 0,
    smallest = 0,
    early = 0;
  const deals = 4000;
  for (let seed = 1; seed <= deals; seed++) {
    const rank = M.ranks(M.deal(100, seed));
    biggest += rank.indexOf(1);
    smallest += rank.indexOf(100);
    if (rank.indexOf(1) < 37) early++;
  }
  // Positions 0–99 average 49.5, with a standard error of about 0.46 over 4,000 deals.
  near(biggest / deals, 49.5, 2);
  near(smallest / deals, 49.5, 2);
  near(early / deals, 0.37, 0.03);
});

test('ranks: every order of 3 cards is about equally likely across seeded deals', () => {
  const counts = new Map();
  for (let seed = 1; seed <= 6000; seed++) {
    const key = M.ranks(M.deal(3, seed)).join('');
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  assert.equal(counts.size, 6);
  for (const c of counts.values()) assert.ok(Math.abs(c - 1000) < 120, `${c}`);
});
