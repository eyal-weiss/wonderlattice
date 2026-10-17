import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.flavours;
const near = (a, b, eps) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);

// Reference numbers from an independent recomputation (Python and numpy: the same seeded table, its own gradient
// descent, numpy's SVD and Procrustes; not this code). Seed, 60% blank:
//   1: 192 rounds, loss 107.479842, blanks right 0.825521, planted traits right 0.885417, match 0.926342, turned 99.2530°, mirrored
//   2: 164 rounds, loss 92.076781, blanks right 0.851562, planted traits right 0.932292, match 0.897582, turned −115.6368°, mirrored
//   7: 243 rounds, loss 106.269128, blanks right 0.815104, planted traits right 0.901042, match 0.906691, turned 179.3246°, mirrored
// A newcomer who likes chocolate and strawberries but not chips or broccoli, on seed 1's map: point (−0.139747, 0.797180),
// suggestions mango, ice cream, pancakes. With no blanks and no penalty, the best two-number fit misses by the sum of
// the other squared singular values (Eckart–Young): 183.042186 for seed 1 (singular values 15.583725, 14.632338,
// 5.402642, …), 138.361187 for seed 2.

test('the invented table: forty people, sixteen foods, likes and dislikes, and the blanks asked for', () => {
  const d = M.table(1, 60);
  assert.equal(d.truth.length, 640);
  assert.ok([...d.truth].every((v) => v === 1 || v === -1));
  assert.equal(d.hidden, 384);
  assert.equal([...d.known].filter((k) => !k).length, 384);
  // More blanks hide more of the same cells.
  const more = M.table(1, 80);
  for (let k = 0; k < 640; k++) if (!d.known[k]) assert.equal(more.known[k], 0);
  assert.deepEqual([...more.truth], [...d.truth]);
  assert.equal(M.table(1, 0).hidden, 0);
});

test('the fit gets better every round', () => {
  for (const [seed, blanks] of [
    [1, 60],
    [2, 30],
    [9, 90],
  ]) {
    const d = M.table(seed, blanks);
    const fit = M.start(d);
    let before = fit.loss;
    for (let k = 0; k < 400; k++) {
      M.step(d, fit);
      assert.ok(fit.loss <= before + 1e-12, `round ${fit.round}: ${fit.loss} > ${before}`);
      before = fit.loss;
    }
  }
});

test('a run matches the independent recomputation', () => {
  for (const [seed, rounds, loss, right, planted, match, angle] of [
    [1, 192, 107.479842, 0.825521, 0.885417, 0.926342, 99.253],
    [2, 164, 92.076781, 0.851562, 0.932292, 0.897582, -115.6368],
    [7, 243, 106.269128, 0.815104, 0.901042, 0.906691, 179.3246],
  ]) {
    const d = M.table(seed, 60);
    const fit = M.solve(d);
    assert.equal(fit.round, rounds);
    near(fit.loss, loss, 1e-5);
    near(M.blanksRight(d, fit), right, 1e-6);
    near(M.plantedRight(d), planted, 1e-6);
    const a = M.align(fit.foods);
    near(a.match, match, 1e-6);
    near(a.angle, angle, 1e-3);
    assert.equal(a.flipped, true);
  }
});

test('on planted data, the map it finds is the planted traits, turned and scaled, within a tolerance', () => {
  // Over 100 tables with 60% blank, the turned planted traits explain most of the map's spread.
  let sum = 0;
  for (let seed = 1; seed <= 100; seed++) {
    const a = M.align(M.solve(M.table(seed, 60)).foods);
    assert.ok(a.match > 0.6, `seed ${seed}: ${a.match}`);
    sum += a.match;
  }
  assert.ok(sum / 100 > 0.87);
  // A map that is the traits exactly, turned by 30° and mirrored, is recognised as such.
  const c = Math.cos(Math.PI / 6),
    s = Math.sin(Math.PI / 6);
  const foods = Float64Array.from(M.TRAITS.flatMap(([x, y]) => [2 * (c * x + s * y), 2 * (s * x - c * y)]));
  const a = M.align(foods);
  near(a.match, 1, 1e-12);
  near(a.scale, 2, 1e-12);
  assert.equal(a.flipped, true);
  near(a.at(M.TRAITS[3])[0], foods[6], 1e-12);
});

test('with no blanks and no penalty, the fit reaches the best two-number fit of the SVD (Eckart–Young)', () => {
  for (const [seed, tail] of [
    [1, 183.042186],
    [2, 138.361187],
  ]) {
    const d = M.table(seed, 0);
    const fit = M.start(d, 0);
    for (let k = 0; k < 400; k++) M.step(d, fit, 0);
    near(fit.loss, tail, 1e-5);
  }
});

test('more blanks, worse guesses: about 82% right at 60% blank, little better than a coin at 90%', () => {
  const mean = (blanks) => {
    let sum = 0;
    for (let seed = 1; seed <= 40; seed++) {
      const d = M.table(seed, blanks);
      sum += M.blanksRight(d, M.solve(d));
    }
    return sum / 40;
  };
  const sixty = mean(60),
    ninety = mean(90);
  near(sixty, 0.82, 0.03);
  assert.ok(ninety < 0.62 && ninety > 0.45, `${ninety}`);
  assert.equal(M.blanksRight(M.table(1, 0), M.solve(M.table(1, 0))), null);
});

test('a newcomer is placed from their ratings, and offered the unrated foods with the highest guesses', () => {
  const fit = M.solve(M.table(1, 60));
  const ratings = [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1];
  const you = M.place(fit.foods, ratings);
  near(you[0], -0.139747, 1e-5);
  near(you[1], 0.79718, 1e-5);
  assert.deepEqual(M.suggest(you, fit.foods, ratings), [6, 1, 3]); // mango, ice cream, pancakes
  // Rated foods are never suggested, and nobody without ratings is placed.
  assert.ok(M.suggest(you, fit.foods, ratings).every((j) => ratings[j] === 0));
  assert.equal(M.place(fit.foods, new Array(16).fill(0)), null);
  // Only puddings in, more puddings out: ice cream and pancakes come first.
  const puddings = [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  assert.deepEqual(M.suggest(M.place(fit.foods, puddings), fit.foods, puddings).slice(0, 2).sort(), [1, 3]);
});

test('ratings go into one whole number for links, and back', () => {
  const ratings = [1, -1, 0, 0, 1, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1];
  const code = M.encode(ratings);
  assert.deepEqual(M.decode(code), ratings);
  assert.equal(M.encode(new Array(16).fill(0)), 0);
  assert.equal(M.encode(new Array(16).fill(-1)), 3 ** 16 - 1);
  assert.deepEqual(M.decode(-5), new Array(16).fill(0));
  assert.deepEqual(M.decode(3 ** 16), new Array(16).fill(0));
  assert.deepEqual(M.decode(1.5), new Array(16).fill(0));
});

test('a seeded run is repeatable, so a shared link draws the same map', () => {
  const a = M.solve(M.table(12345, 50)),
    b = M.solve(M.table(12345, 50));
  assert.deepEqual([...a.foods], [...b.foods]);
  assert.equal(a.round, b.round);
});
