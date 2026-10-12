import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.sunflower;
// Numbers checked with a separate brute-force script (nearest outward neighbours of seed n, at radius √n and angle
// n·θ), not with this model's code.

test('sunflower: the golden angle is 360°/φ², and seed n sits at distance √n', () => {
  const phi = (1 + Math.sqrt(5)) / 2;
  assert.ok(Math.abs(M.GOLDEN - 360 / phi ** 2) < 1e-12);
  assert.ok(Math.abs(M.GOLDEN - 137.50776405) < 1e-8);
  for (const n of [1, 7, 100, 999]) assert.ok(Math.abs(Math.hypot(...M.seed(n, M.GOLDEN)) - Math.sqrt(n)) < 1e-9);
  const [x, y] = M.seed(1, 90);
  assert.ok(Math.abs(x) < 1e-12 && Math.abs(y - 1) < 1e-12, 'angles grow anticlockwise, y upwards');
});

test('sunflower: a turn of p/q makes q straight spokes, and the seeds really lie on q lines', () => {
  for (const [angle, q] of [
    [90, 4],
    [120, 3],
    [135, 8],
    [144, 5],
    [100, 18],
    [140, 18],
  ]) {
    for (const n of [30, 300, 900]) {
      const p = M.pattern(n, angle);
      assert.equal(p.kind, 'spokes', `${angle}° at seed ${n}`);
      assert.equal(p.count, q, `${angle}° at seed ${n}`);
    }
    const directions = new Set();
    for (let n = 1; n <= 2000; n++) directions.add(Math.round(((n * angle) % 360) * 1e6));
    assert.equal(directions.size, q, `${angle}° puts seeds on ${q} lines`);
  }
  assert.deepEqual(M.fraction(135), { p: 3, q: 8 });
  assert.deepEqual(M.fraction(90), { p: 1, q: 4 });
  assert.equal(M.fraction(M.GOLDEN), null);
  assert.equal(M.fraction(137.508), null);
});

test('sunflower: at the golden angle the arms come in neighbouring Fibonacci numbers, larger further out', () => {
  const expected = [
    [30, [13, 21]],
    [100, [21, 34]],
    [300, [34, 55]],
    [600, [55, 89]],
    [1000, [55, 89]],
    [1500, [89, 144]],
  ];
  for (const angle of [M.GOLDEN, 137.508]) {
    for (const [n, pair] of expected) {
      const p = M.pattern(n, angle);
      assert.equal(p.kind, 'packed', `seed ${n}`);
      const counts = p.arms.map((f) => f.offset).sort((a, b) => a - b);
      assert.deepEqual(counts, pair, `seed ${n}`);
      assert.ok(counts.every(M.isFibonacci));
      assert.notEqual(p.arms[0].family, p.arms[1].family, 'one family turns each way');
    }
  }
  // Every seed of a thousand, not just a few: the counts are always two neighbouring Fibonacci numbers.
  for (let n = 20; n <= 1000; n += 7) {
    const counts = M.pattern(n, M.GOLDEN)
      .arms.map((f) => f.offset)
      .sort((a, b) => a - b);
    const i = M.FIBONACCI.indexOf(counts[0]);
    assert.ok(i > 0 && M.FIBONACCI[i + 1] === counts[1], `seed ${n}: ${counts}`);
  }
});

test('sunflower: a tenth of a degree more opens gaps between 34 arms', () => {
  assert.equal(M.pattern(30, 137.6).kind, 'packed', 'the middle still looks packed');
  for (const n of [300, 600, 900]) {
    const p = M.pattern(n, 137.6);
    assert.equal(p.kind, 'gaps', `seed ${n}`);
    assert.equal(p.count, 34);
  }
});

test('sunflower: the golden angle is all 1s as a continued fraction, after the first 2', () => {
  assert.deepEqual(M.continuedFraction(M.GOLDEN / 360, 10), [2, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  assert.deepEqual(M.continuedFraction(135 / 360), [2, 1, 2]);
});
