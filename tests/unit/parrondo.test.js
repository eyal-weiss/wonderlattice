import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.parrondo;
const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);

test('game B uses its bad coin exactly when capital is a multiple of 3, negative capital too', () => {
  for (const c of [-9, -6, -3, 0, 3, 6, 99]) near(M.winChance('B', c), 0.1 - 0.005);
  for (const c of [-8, -5, -2, -1, 1, 2, 4, 5, 100]) near(M.winChance('B', c), 0.75 - 0.005);
  for (const c of [-4, 0, 1, 2, 3]) near(M.winChance('A', c), 0.5 - 0.005);
  assert.deepEqual([-4, -3, -2, -1, 0, 1, 2].map(M.mod3), [2, 0, 1, 2, 0, 1, 2]);
});

test('the stationary distribution is a fixed point of the chain, and sums to 1', () => {
  for (const pattern of ['A', 'B', 'R', 'AABB', 'ABB']) {
    const m = M.cycleMatrix([...pattern]);
    const pi = M.stationary(m);
    near(
      pi.reduce((a, b) => a + b),
      1,
    );
    const next = [0, 1, 2].map((j) => pi.reduce((sum, p, i) => sum + p * m[i][j], 0));
    next.forEach((x, j) => near(x, pi[j], 1e-12));
    // Independent check: many rounds from any start settle at the same place.
    let dist = [1, 0, 0];
    for (let k = 0; k < 2000; k++) dist = [0, 1, 2].map((j) => dist.reduce((sum, p, i) => sum + p * m[i][j], 0));
    dist.forEach((x, j) => near(x, pi[j], 1e-9));
  }
});

test('with ε = 0, game B alone is exactly fair, spending 5/13 of its rounds on multiples of 3', () => {
  const b = M.longRun('B', 0);
  near(b.gain, 0, 1e-12);
  [5 / 13, 2 / 13, 6 / 13].forEach((x, i) => near(b.shares[i], x, 1e-12));
  near(M.breakEven(0), 5 / 13, 1e-12);
});

test('each game alone loses per round; the random mix and A A B B win (Harmer and Abbott, ε = 0.005)', () => {
  const a = M.longRun('A'),
    b = M.longRun('B'),
    mix = M.longRun('R'),
    aabb = M.longRun('AABB');
  near(a.gain, -0.01, 1e-12); // a coin that wins 49.5%: −2ε per round
  assert.ok(b.gain < 0);
  near(b.gain, -0.0087, 1e-4);
  near(b.shares[0], 0.3836, 1e-4); // the steady chance of B's bad coin, as in the literature
  assert.ok(b.badShare > M.breakEven()); // B alone lands on the bad coin just too often
  assert.ok(mix.gain > 0);
  near(mix.gain, 0.0157, 1e-4);
  assert.ok(mix.badShare < M.breakEven()); // mixed with A, B's rounds land there less often, and B pays
  assert.ok(aabb.gain > 0);
  assert.equal(a.badShare, null);
});

test('not every mix wins: A B loses, A B B wins', () => {
  assert.ok(M.longRun('AB').gain < 0);
  assert.ok(M.longRun('ABB').gain > 0.05);
  // A pattern and its rotations share the same long-run gain.
  near(M.longRun('ABB').gain, M.longRun('BBA').gain, 1e-12);
  near(M.longRun('ABB').gain, M.longRun('BAB').gain, 1e-12);
});

test('the exact expected capital: A loses exactly a coin per 100 rounds, and each path grows at its long-run rate', () => {
  near(M.expected('A', 100).mean[100], -1, 1e-9);
  // Harmer and Abbott simulated 100 rounds: B about −1.4, the random mix about +1.3, A A B B about +1.4.
  near(M.expected('B', 100).mean[100], -1.39, 0.01);
  near(M.expected('R', 100).mean[100], 1.29, 0.01);
  near(M.expected('AABB', 100).mean[100], 1.39, 0.01);
  for (const pattern of ['B', 'R', 'AABB', 'ABB', 'AB']) {
    // Over a whole number of repeats (2,100 rounds is one for every pattern here), the gain is the long-run rate.
    const { mean, shares } = M.expected(pattern, 4200);
    const slope = (mean[4200] - mean[2100]) / 2100;
    near(slope, M.longRun(pattern).gain, 1e-5);
    near(
      shares[4200].reduce((x, y) => x + y),
      1,
    );
  }
});

test('seeded simulations agree with the exact expectations', () => {
  for (const pattern of ['A', 'B', 'R', 'AABB', 'AB']) {
    const sim = M.simulate(pattern, 100, 20000, 7);
    // After 100 rounds one player's spread is about 10 coins, so 20,000 players' average is good to about 0.07.
    near(sim.average[100], M.expected(pattern, 100).mean[100], 0.3);
    assert.equal(sim.capital.length, 20000);
  }
  const b = M.simulate('B', 2000, 2000, 3);
  near(b.badShare, M.longRun('B').badShare, 0.01);
  // The same seed gives the same crowd.
  assert.deepEqual([...M.simulate('R', 50, 100, 5).capital], [...M.simulate('R', 50, 100, 5).capital]);
});

test('a pattern fits in one whole number for shared links', () => {
  assert.equal(M.encodePattern('AABB'), 19);
  assert.equal(M.decodePattern(19), 'AABB');
  for (const p of ['A', 'B', 'AB', 'ABB', 'BBBBBBBBBBBB', 'AAAAAAAAAAAA', 'ABAABBBAB'])
    assert.equal(M.decodePattern(M.encodePattern(p)), p);
  assert.equal(M.decodePattern(1), '');
  assert.equal(M.encodePattern('BBBBBBBBBBBB'), 8191);
});
