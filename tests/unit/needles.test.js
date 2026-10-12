import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.needles;
const near = (a, b, eps) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b} (±${eps})`);

// The numbers below were checked by a separate program (Python, its own random numbers and its own crossing test):
// P(cross) = 2/π = 0.63662 for a needle one plank long and 5/(3π) = 0.53052 for Lazzarini's; a typical miss after
// 3,408 throws of 0.0407 (l = 1) and 0.0506 (l = 5/6); and, for Lazzarini's needle and count, an exact 1,808
// crossings with chance 1.37%, a miss of less than 0.01 with chance 15%, and a median miss of 0.034.

test('a path’s crossings: count every line it passes, both ways', () => {
  assert.equal(
    M.crossings([
      [0, 0.2],
      [1, 0.8],
    ]),
    0,
  );
  assert.equal(
    M.crossings([
      [0, 0.2],
      [1, 1.3],
    ]),
    1,
  );
  assert.equal(
    M.crossings([
      [0, 0.5],
      [0, 2.5],
    ]),
    2,
  );
  // Over a line and back again: two crossings.
  assert.equal(
    M.crossings([
      [0, 0.9],
      [1, 1.1],
      [2, 0.9],
    ]),
    2,
  );
  assert.equal(
    M.crossings([
      [0, -0.4],
      [1, 0.4],
    ]),
    1,
  );
});

test('directions are chosen without π, and evenly', () => {
  const source = M.direction.toString();
  assert.doesNotMatch(source, /PI|cos|sin|atan|tan/);
  const rand = M.random(11);
  let cx = 0,
    cy = 0,
    c2 = 0,
    quarter = 0;
  const n = 200000;
  for (let i = 0; i < n; i++) {
    const [c, s] = M.direction(rand);
    near(c * c + s * s, 1, 1e-9);
    cx += c;
    cy += s;
    c2 += c * c;
    if (c > 0 && s > 0) quarter++;
  }
  near(cx / n, 0, 0.01);
  near(cy / n, 0, 0.01);
  near(c2 / n, 0.5, 0.005);
  near(quarter / n, 0.25, 0.005);
});

test('a needle one plank long crosses a line 2/π of the time, about 63.7%', () => {
  near(M.expected(1), 0.63662, 1e-5);
  near(M.expected(5 / 6), 0.53052, 1e-5);
  const n = 400000;
  const crossed = M.run(M.kit(M.NEEDLE, 1), n, M.random(3));
  near(crossed / n, 2 / Math.PI, 0.004);
  near(M.estimate(1, n, crossed), Math.PI, 0.02);
  // A shorter needle crosses less often, in proportion to its length.
  near(M.run(M.kit(M.NEEDLE, 0.5), n, M.random(4)) / n, 1 / Math.PI, 0.004);
  // A needle never crosses more than one line when it is no longer than a plank is wide.
  const rand = M.random(5),
    needle = M.kit(M.NEEDLE, 1);
  for (let i = 0; i < 20000; i++) assert.ok(M.throwOnce(needle, rand).n <= 1);
});

test('bent the same length, a needle crosses just as often on average (Barbier)', () => {
  const n = 300000;
  for (const [kind, length, seed] of [
    [M.ZIGZAG, 1, 6],
    [M.NOODLE, 1, 7],
    [M.ZIGZAG, 0.6, 8],
    [M.NOODLE, 0.4, 9],
  ]) {
    const per = M.run(M.kit(kind, length, M.random(seed + 100)), n, M.random(seed)) / n;
    near(per, M.expected(length), 0.006);
  }
  // A zigzag or a noodle can cross more than one line, or one line more than once.
  const rand = M.random(10),
    noodles = M.kit(M.NOODLE, 1, rand);
  let most = 0;
  for (let i = 0; i < 20000; i++) most = Math.max(most, M.throwOnce(noodles, rand).n);
  assert.ok(most >= 2);
});

test('bent shapes keep their length', () => {
  const rand = M.random(12);
  const length = (pts) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
  for (const kind of [M.NEEDLE, M.ZIGZAG, M.NOODLE])
    for (const l of [0.2, 0.75, 1]) near(length(M.outline(kind, l, rand)), l, 1e-9);
});

test('a ring one plank wide crosses exactly two lines, every time', () => {
  const rand = M.random(13),
    rings = M.kit(M.RING, 1);
  for (let i = 0; i < 50000; i++) assert.equal(M.throwOnce(rings, rand).n, 2);
  // It is π planks round: two crossings for π planks of length, which fixes 2L/π for every shape.
  near(M.lengthOf(M.RING, 1), Math.PI, 1e-12);
  near(M.expected(M.lengthOf(M.RING, 1)), 2, 1e-12);
});

test('Lazzarini’s 3,408 throws and 1,808 crossings give 355/113, wrong in the seventh decimal', () => {
  const { length, throws, crossings } = M.LAZZARINI;
  near(M.estimate(length, throws, crossings), 355 / 113, 1e-12);
  near(Math.abs(355 / 113 - Math.PI), 2.6676e-7, 1e-10);
  // The miss that is typical for an experiment of that size: a few hundredths.
  near(M.spread(1, 3408), 0.0407, 0.0001);
  near(M.spread(length, 3408), 0.0506, 0.0001);
  // Each extra digit costs a hundred times more throws.
  near(M.spread(1, 340800) * 10, M.spread(1, 3408), 1e-12);
});

test('rerun as Lazzarini said: misses of a few hundredths, and 355/113 about one run in 70', () => {
  const { length, throws, crossings } = M.LAZZARINI;
  const rand = M.random(14),
    needle = M.kit(M.NEEDLE, length);
  const misses = [];
  let exact = 0,
    close = 0;
  const runs = 3000;
  for (let i = 0; i < runs; i++) {
    const crossed = M.run(needle, throws, rand);
    if (crossed === crossings) exact++;
    const miss = Math.abs(M.estimate(length, throws, crossed) - Math.PI);
    if (miss < 0.01) close++;
    misses.push(miss);
  }
  near(M.median(misses), 0.034, 0.004);
  near(exact / runs, 0.0137, 0.0065);
  near(close / runs, 0.15, 0.02);
});

test('the same seed gives the same throws, and quick throws count as single ones do', () => {
  const noodles = M.kit(M.NOODLE, 1, M.random(41));
  assert.deepEqual(M.throwOnce(noodles, M.random(42)), M.throwOnce(noodles, M.random(42)));
  for (const kind of [M.NEEDLE, M.ZIGZAG, M.NOODLE, M.RING]) {
    const k = M.kit(kind, 0.8, M.random(43));
    const one = M.random(44);
    let crossed = 0;
    for (let i = 0; i < 5000; i++) crossed += M.throwOnce(k, one).n;
    assert.equal(M.run(k, 5000, M.random(44)), crossed);
  }
  assert.equal(M.median([3, 1, 2]), 2);
  assert.equal(M.median([4, 1, 2, 3]), 2.5);
  assert.equal(M.estimate(1, 10, 0), Infinity);
});
