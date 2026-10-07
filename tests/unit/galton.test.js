import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.galton;
const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);
const sum = (list) => list.reduce((a, b) => a + b, 0);

test('the board is Pascal’s triangle: 12 fair rows put 231/1024 of the balls in the middle bin', () => {
  const fair = M.binomial(12, 0.5);
  assert.equal(fair.length, 13);
  near(sum(fair), 1);
  near(fair[6], 231 / 1024);
  near(fair[0], 1 / 4096);
  near(fair[3], fair[9]);
  // Tilted pegs (right 3 times in 4): the bell moves to bin 9 and narrows a little (spread 1.5, not √3).
  const tilted = M.binomial(12, 0.75);
  assert.equal(tilted.indexOf(Math.max(...tilted)), 9);
  near(tilted[9], 0.258103609085083, 1e-12);
  near(sum(tilted.map((q, k) => q * k)), 9);
  // de Moivre’s bell is close to the exact middle bin: 0.2303 against 0.2256.
  near(M.normal(6, 6, Math.sqrt(3)), 0.23032943298089034, 1e-12);
});

test('balls dropped at random fill the bins in the binomial proportions', () => {
  const rand = M.random(7);
  const counts = new Array(11).fill(0);
  const balls = 40000;
  for (let i = 0; i < balls; i++) counts[sum(M.path(10, 0.5, rand))]++;
  M.binomial(10, 0.5).forEach((q, k) => {
    const spread = Math.sqrt(balls * q * (1 - q));
    assert.ok(Math.abs(counts[k] - balls * q) < 4.5 * spread + 1, `bin ${k}: ${counts[k]} vs ${balls * q}`);
  });
  // The same seed pours the same balls.
  assert.deepEqual(M.path(12, 0.5, M.random(3)), M.path(12, 0.5, M.random(3)));
});

test('a die loaded with 1s and 6s: mean 3.5, spread √5.25, and averages of 2 already peak in the middle', () => {
  const d = M.die([8, 1, 1, 1, 1, 8]);
  near(d.chances[0], 0.4);
  near(d.mean, 3.5);
  near(d.sd, Math.sqrt(21 / 4));
  const two = M.totals(d.chances, 2); // totals 2…12
  near(two[0], 4 / 25);
  near(two[5], 33 / 100); // a total of 7: an average of 3.5
  near(two[10], 4 / 25);
  near(sum(two), 1);
  // An all-zero die counts as fair.
  assert.deepEqual(M.die([0, 0, 0, 0, 0, 0]).chances, new Array(6).fill(1 / 6));
  near(M.die([1, 1, 1, 1, 1, 1]).sd, 1.707825127659933, 1e-12);
});

test('averages of 10 throws of that die crowd into a bell √10 times narrower', () => {
  const d = M.die([8, 1, 1, 1, 1, 8]);
  const ten = M.totals(d.chances, 10); // totals 10…60
  assert.equal(ten.length, 51);
  near(sum(ten), 1);
  near(ten[25], 0.0648391016671875, 1e-12); // a total of 35, the most likely
  assert.equal(ten.indexOf(Math.max(...ten)), 25);
  const narrow = d.sd / Math.sqrt(10);
  const inside = sum(ten.filter((q, i) => Math.abs((i + 10) / 10 - 3.5) <= narrow));
  near(inside, 0.6912472873632812, 1e-12); // close to the bell’s 68%
  // Sampled averages match: their mean is 3.5 and their spread about 2.29 / √10 = 0.72.
  const rand = M.random(11);
  const averages = Array.from({ length: 20000 }, () => {
    let total = 0;
    for (let i = 0; i < 10; i++) total += M.throwDie(d.chances, rand);
    return total / 10;
  });
  const mean = sum(averages) / averages.length;
  const sd = Math.sqrt(sum(averages.map((a) => (a - mean) ** 2)) / averages.length);
  near(mean, 3.5, 0.02);
  near(sd, narrow, 0.02);
});

test('the heaps of averages are binned into at most about three dozen bars that cover every total once', () => {
  for (const n of [1, 2, 5, 10, 20, 30]) {
    const { group, count } = M.bins(n);
    assert.ok(count <= 37, `${n}: ${count} bins`);
    assert.equal(M.binOfTotal(n, n), 0);
    assert.equal(M.binOfTotal(6 * n, n), count - 1);
    near(sum(M.averageChances([0.4, 0.05, 0.05, 0.05, 0.05, 0.4], n)), 1);
    assert.ok(group >= 1);
    near(M.binMiddle(0, n), (n + (Math.min(6 * n, n + group - 1) - n) / 2) / n);
  }
  assert.deepEqual(M.bins(1), { group: 1, count: 6 });
  assert.deepEqual(M.bins(2), { group: 1, count: 11 });
  assert.deepEqual(M.bins(10), { group: 2, count: 26 });
});

test('the stubborn spinner: averages of 10 or 100 spins are as spread out as one spin', () => {
  near(1 - 2 * M.spinnerChance(0, 6), 0.10513691342250675, 1e-12); // a tenth of spins land beyond ±6
  near(M.spinnerChance(0, 0.5), 0.14758361765043326, 1e-12);
  near(M.spinnerDensity(0), 1 / Math.PI);
  const rand = M.random(5);
  const quartiles = (n) => {
    const averages = Array.from({ length: 8000 }, () => {
      let total = 0;
      for (let i = 0; i < n; i++) total += M.spin(rand);
      return total / n;
    }).sort((a, b) => a - b);
    return [averages[2000], averages[6000]];
  };
  // One spin, and averages of 10 and of 100 spins, all have their middle half between about −1 and 1.
  for (const n of [1, 10, 100]) {
    const [low, high] = quartiles(n);
    near(low, -1, 0.1);
    near(high, 1, 0.1);
  }
});
