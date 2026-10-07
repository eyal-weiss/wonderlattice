import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const C = globalThis.Wonderlattice.models.chaos;

/** Play a game for `n` jumps after leaving out the first `skip`, and collect the dots with the corner each used. */
function play(options, n, skip = 30) {
  const g = C.game(options);
  const dots = [];
  for (let i = 0; i < n + skip; i++) {
    const k = C.jump(g);
    if (i >= skip) dots.push([g.x, g.y, k]);
  }
  return dots;
}

// The triangle (0, 0), (1, 0), (0, 1) is the Sierpiński triangle's shape squashed flat, and in it the triangle has a
// tidy description: a point is on it when the binary digits of x and y are never both 1 in the same place. Halfway
// jumps write one more pair of digits at the front each time (00, 10 or 01 for the three corners), so after k jumps
// the first k pairs are right, whatever the start. Checked independently (a separate script, 200,000 dots).
const TRIANGLE = [
  [0, 0],
  [1, 0],
  [0, 1],
];
const SQUARE = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
];

test('three corners, halfway: after the first jumps, no dot ever lands in a hole of the Sierpiński triangle', () => {
  const dots = play({ corners: TRIANGLE, start: [0.123, 0.456], seed: 7 }, 100000, 12);
  for (const [x, y] of dots) assert.equal(Math.floor(x * 4096) & Math.floor(y * 4096), 0, `${x}, ${y}`);
  assert.equal(dots.filter(([x, y]) => C.inMiddle([x, y], TRIANGLE)).length, 0);
  // Each dot sits in the half-size copy at the corner it last jumped towards: that's why the colours show copies.
  const copy = [([x, y]) => x + y <= 0.5, ([x]) => x >= 0.5, ([, y]) => y >= 0.5];
  for (const dot of dots) assert.ok(copy[dot[2]](dot), String(dot));
});

test('the middle hole is the triangle joining the midpoints, whatever the triangle’s shape', () => {
  const tri = [
    [-0.8, -0.6],
    [0.9, -0.2],
    [-0.1, 0.85],
  ];
  const centre = [(tri[0][0] + tri[1][0] + tri[2][0]) / 3, (tri[0][1] + tri[1][1] + tri[2][1]) / 3];
  assert.equal(C.inMiddle(centre, tri), true);
  assert.equal(C.inMiddle(tri[0], tri), false);
  const mid = [(tri[0][0] + tri[1][0]) / 2, (tri[0][1] + tri[1][1]) / 2];
  assert.equal(C.inMiddle(mid, tri), false); // on the hole's edge, which belongs to the triangle
  const dots = play({ corners: tri, start: centre, seed: 3 }, 50000);
  assert.equal(dots.filter(([x, y]) => C.inMiddle([x, y], tri)).length, 0);
});

test('four corners, halfway: fog, every part of the square as likely as any other', () => {
  const dots = play({ corners: SQUARE, start: [0.3, 0.7], seed: 11 }, 400000);
  const cells = new Array(256).fill(0);
  for (const [x, y] of dots) cells[Math.min(15, Math.floor(x * 16)) * 16 + Math.min(15, Math.floor(y * 16))]++;
  const mean = dots.length / 256;
  assert.ok(Math.min(...cells) > 0.85 * mean && Math.max(...cells) < 1.15 * mean, `${Math.min(...cells)} … ${mean}`);
});

test('four corners with “never the same corner twice”: holes at every size, a fractal', () => {
  const dots = play({ corners: SQUARE, start: [0.3, 0.7], rule: true, seed: 5 }, 200000);
  // The last two jumps went to different corners, so the quarter-size square at each corner stays empty.
  const inCorner = ([x, y]) => (x < 0.25 || x > 0.75) && (y < 0.25 || y > 0.75);
  assert.equal(dots.filter(inCorner).length, 0);
  // And no two neighbouring digit pairs are equal anywhere in the first ten.
  for (const [x, y] of dots) {
    const X = Math.floor(x * 1024),
      Y = Math.floor(y * 1024);
    assert.equal(((X ^ (X >> 1)) | (Y ^ (Y >> 1))) & 0x1ff, 0x1ff, `${x}, ${y}`);
  }
  // On a 16 × 16 grid it reaches 4 · 3 · 3 · 3 = 108 cells of 256: the count triples, not quadruples, as cells halve.
  const reached = new Set(dots.map(([x, y]) => `${Math.floor(x * 16)},${Math.floor(y * 16)}`));
  assert.equal(reached.size, 108);
  // The rule is kept.
  const g = C.game({ corners: SQUARE, rule: true, seed: 9 });
  let last = C.jump(g);
  for (let i = 0; i < 1000; i++) {
    const k = C.jump(g);
    assert.notEqual(k, last);
    last = k;
  }
});

test('the jump at which the copies just touch: ½, ½, 0.618 (the dot keeps (3 − √5)/2), ⅔', () => {
  assert.ok(Math.abs(C.touching(3) - 0.5) < 1e-12);
  assert.ok(Math.abs(C.touching(4) - 0.5) < 1e-12);
  assert.ok(Math.abs(1 - C.touching(5) - (3 - Math.sqrt(5)) / 2) < 1e-12);
  assert.ok(Math.abs(C.touching(6) - 2 / 3) < 1e-12);
  // The same as the kissing ratios on Wikipedia's Chaos game page (Abdulaziz and Said), for many corners.
  const kissing = (n) =>
    n % 4 === 0
      ? 1 / (1 + Math.tan(Math.PI / n))
      : n % 4 === 2
        ? 1 / (1 + Math.sin(Math.PI / n))
        : 1 / (1 + 2 * Math.sin(Math.PI / (2 * n)));
  for (let n = 3; n <= 12; n++) assert.ok(Math.abs(C.touching(n) - kissing(n)) < 1e-12, `n = ${n}`);
});

test('regular shapes are centred, fill the square and keep their corners in it', () => {
  for (let n = 3; n <= C.CORNERS; n++) {
    const p = C.regular(n);
    const xs = p.map((q) => q[0]),
      ys = p.map((q) => q[1]);
    assert.ok(Math.abs(Math.max(...xs) + Math.min(...xs)) < 1e-12);
    assert.ok(Math.abs(Math.max(...ys) + Math.min(...ys)) < 1e-12);
    assert.ok(
      Math.abs(Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) - 2 * C.EDGE) < 1e-12,
    );
    const low = Math.min(...ys);
    assert.equal(ys.filter((y) => Math.abs(y - low) < 1e-12).length, 2, 'standing on a flat side');
  }
  const moved = C.corners(3, [[5, -5]]);
  assert.deepEqual(moved[0], [1, -1]);
});

test('Barnsley’s fern: the chances add up to one, and the fern stays in its box', () => {
  assert.ok(Math.abs(C.FERN.reduce((sum, m) => sum + m.p, 0) - 1) < 1e-12);
  const dots = play({ fern: true, seed: 2 }, 200000, 60);
  const B = C.FERN_BOX;
  for (const [x, y] of dots) assert.ok(x >= B.x0 - 1e-6 && x <= B.x1 + 1e-6 && y >= B.y0 && y <= B.y1 + 1e-6);
  // Each map is used about as often as its chance.
  const used = [0, 0, 0, 0];
  for (const [, , k] of dots) used[k]++;
  C.FERN.forEach((m, k) => assert.ok(Math.abs(used[k] / dots.length - m.p) < 0.005, `map ${k}`));
});

test('a game with the same seed plays the same jumps; the left-out start covers slow jumps too', () => {
  const a = play({ corners: TRIANGLE, seed: 42 }, 100, 0);
  const b = play({ corners: TRIANGLE, seed: 42 }, 100, 0);
  assert.deepEqual(a, b);
  assert.equal(C.burnIn(0.5), 20);
  assert.ok(C.burnIn(0.8) >= 38 && 0.8 ** C.burnIn(0.8) * 4 < 1 / 2000);
  const r = C.random(1);
  for (let i = 0; i < 1000; i++) {
    const v = r();
    assert.ok(v >= 0 && v < 1);
  }
});
