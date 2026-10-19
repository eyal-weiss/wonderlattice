import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.cake;
const near = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);

// Reference numbers from an independent recomputation in Python (its own integration, bisection, a brute-force search
// over every cut on a 1/600 grid, and its own Selfridge–Conway; not this code). Densities per zone at mix 1:
// Ada 1.6, 0.16, 1.12; Ben 0.453074, 1.294498, 1.294498; Cleo 0.27027, 2.702703, 0.27027.
//   Fair cut, mix 1: 0.358624 and 0.566334, Ada left, Cleo middle, Ben right, everyone 0.561380 (grid: 0.561067).
//   Fair cut, mix 0.5: 0.354196 and 0.601278, same order, everyone 0.457434 (grid: 0.456933).
//   Fair cut, mix 0: thirds, 1/3 each.
//   Cut-and-choose: Ada cuts at 0.3125; Ben values the pieces 0.141586 and 0.858414.
//   Naive three: Ada's thirds end at 0.208333 and 0.702381; Ben takes the middle, Cleo the right (0.080438 to her),
//   though Ben's is worth 0.863256 to her.
//   Selfridge–Conway: Ben trims the middle piece to [0.208333, 0.598036]; the trimming [0.598036, 0.702381] is cut by
//   Ben at 0.632817 and 0.667599. Final shares: Ada 0.372289, Ben 0.430292, Cleo 0.802660, nobody envious.

/** A small seeded random generator, so the random tests repeat. */
function random(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Three random tastes: a density per zone, each person's whole cake worth 1. */
function randomTastes(next) {
  return [0, 1, 2].map(() => {
    const w = [0, 1, 2].map(() => next() ** 2 + 0.001);
    const total = w.reduce((sum, v, z) => sum + v * (M.ZONES[z + 1] - M.ZONES[z]), 0);
    return w.map((v) => v / total);
  });
}

const allEnvy = (D, shares) => {
  let most = 0;
  for (let p = 0; p < 3; p++)
    for (let q = 0; q < 3; q++) most = Math.max(most, M.worth(D[p], shares[q]) - M.worth(D[p], shares[p]));
  return most;
};

test('every taste values the whole cake at 1, and a piece is the integral of its density', () => {
  for (const mix of [0, 0.3, 1]) for (const d of M.tastes(mix)) near(M.value(d, 0, 1), 1, 1e-12);
  const [ada, ben, cleo] = M.tastes(1);
  for (const [d, want] of [
    [ada, [1.6, 0.16, 1.12]],
    [ben, [0.453074, 1.294498, 1.294498]],
    [cleo, [0.27027, 2.702703, 0.27027]],
  ])
    want.forEach((v, z) => near(d[z], v));
  // Chocolate [0, 0.35] at 1.6, then strawberry at 0.16: [0.2, 0.5] is worth 0.15 × 1.6 + 0.15 × 0.16.
  near(M.value(ada, 0.2, 0.5), 0.15 * 1.6 + 0.15 * 0.16, 1e-12);
  // point() undoes value(), across zones.
  for (const d of M.tastes(0.7))
    for (const [from, w] of [
      [0, 0.25],
      [0.1, 0.5],
      [0.6, 0.2],
    ])
      near(M.value(d, from, M.point(d, from, w)), w, 1e-12);
  assert.equal(M.point(ada, 0.9, 0.5), 1); // asks for more than is left
});

test('the fair cut: equal shares, as large as they get, and nobody envies anybody', () => {
  for (const [mix, left, right, perm, share] of [
    [1, 0.358624, 0.566334, 1, 0.56138],
    [0.5, 0.354196, 0.601278, 1, 0.457434],
    [0, 1 / 3, 2 / 3, 0, 1 / 3],
  ]) {
    const D = M.tastes(mix);
    const f = M.fairCut(D);
    near(f.left, left);
    near(f.right, right);
    assert.equal(f.perm, perm);
    near(f.share, share);
    assert.ok(f.fair);
    const s = M.shares(f.left, f.right, f.perm);
    for (let p = 0; p < 3; p++) near(M.worth(D[p], s[p]), f.share, 1e-9);
    assert.deepEqual(M.envy(D, s), [-1, -1, -1]);
  }
  // At every step of the room's slider, the cut is envy-free; once tastes differ at all, everyone gets more than 1/3.
  for (let k = 0; k <= 100; k += 5) {
    const f = M.fairCut(M.tastes(k / 100));
    assert.ok(f.fair, `mix ${k}%`);
    if (k > 0) assert.ok(f.share > 1 / 3 + 1e-6, `mix ${k}%: ${f.share}`);
  }
  // The independent brute-force search found nothing envy-free that beats the fair cut's share.
  assert.ok(M.fairCut(M.tastes(1)).share >= 0.561067);
});

test('equal pieces handed out in a row: Ben and Cleo envy each other', () => {
  const D = M.tastes(1);
  const s = M.shares(1 / 3, 2 / 3, 0);
  assert.deepEqual(M.envy(D, s), [-1, 2, 1]);
  // Someone gets less than a third by their own taste.
  assert.ok(M.worth(D[2], s[2]) < 1 / 3);
  // With the same tastes there is no envy, and a third each.
  const same = M.tastes(0);
  assert.deepEqual(M.envy(same, s), [-1, -1, -1]);
});

test('cut-and-choose for two: Ada gets exactly half, Ben at least half', () => {
  const D = M.tastes(1);
  const c = M.cutAndChoose(D);
  near(c.cut, 0.3125);
  assert.equal(c.ben, 1);
  near(M.value(D[1], 0, c.cut), 0.141586);
  near(M.value(D[1], c.cut, 1), 0.858414);
  near(M.value(D[0], 0, c.cut), 0.5, 1e-12);
  // For any tastes: the cutter gets half, the chooser at least half, so neither envies the other.
  const next = random(7);
  for (let k = 0; k < 500; k++) {
    const R = randomTastes(next);
    const r = M.cutAndChoose(R);
    const pieces = [[[0, r.cut]], [[r.cut, 1]]];
    near(M.worth(R[0], pieces[r.ada]), 0.5, 1e-9);
    assert.ok(M.worth(R[1], pieces[r.ben]) >= 0.5 - 1e-12);
  }
});

test('naive cut-and-choose for three leaves Cleo envious', () => {
  const D = M.tastes(1);
  const n = M.naive(D);
  near(n.x1, 0.208333);
  near(n.x2, 0.702381);
  assert.deepEqual([n.ada, n.ben, n.cleo], [0, 1, 2]);
  near(M.value(D[2], ...n.pieces[n.cleo]), 0.080438);
  near(M.value(D[2], ...n.pieces[n.ben]), 0.863256);
  const s = [[n.pieces[n.ada]], [n.pieces[n.ben]], [n.pieces[n.cleo]]];
  assert.deepEqual(M.envy(D, s), [-1, -1, 1]);
});

test('Selfridge–Conway: the steps, and five cuts that leave nobody envious', () => {
  const D = M.tastes(1);
  const r = M.selfridgeConway(D);
  near(r.x1, 0.208333);
  near(r.x2, 0.702381);
  assert.equal(r.big, 1);
  assert.equal(r.second, 2);
  near(r.trim[0], 0.598036);
  near(r.trim[1], 0.702381);
  // Cleo takes the trimmed piece, Ben the right one, Ada the left one.
  assert.deepEqual(r.picks, [0, 2, 1]);
  assert.equal(r.taker, 2);
  assert.equal(r.cutter, 1);
  near(r.y1, 0.632817);
  near(r.y2, 0.667599);
  // The trimming: Cleo chooses first, then Ada, then Ben.
  assert.deepEqual(r.bitOf, [2, 1, 0]);
  [0.372289, 0.430292, 0.80266].forEach((v, p) => near(M.worth(D[p], r.shares[p]), v));
  assert.ok(allEnvy(D, r.shares) < 1e-12);
  // Before the trimming is shared out, nobody envies anybody's main piece either.
  assert.ok(
    allEnvy(
      D,
      r.picks.map((k) => [r.main[k]]),
    ) < 1e-12,
  );
  // Five cuts: two by Ada, one trim, two in the trimming.
  const cuts = new Set([r.x1, r.x2, r.trim[0], r.y1, r.y2]);
  assert.equal(cuts.size, 5);

  // For random tastes too: envy-free, and the whole cake is shared out.
  const next = random(11);
  for (let k = 0; k < 2000; k++) {
    const R = randomTastes(next);
    const out = M.selfridgeConway(R);
    assert.ok(allEnvy(R, out.shares) < 1e-9, `random tastes ${k}`);
    const length = out.shares.flat().reduce((sum, [a, b]) => sum + (b - a), 0);
    near(length, 1, 1e-12);
  }
  // With the same tastes, Ben's two favourites already tie: no trim, a third each.
  const same = M.selfridgeConway(M.tastes(0));
  assert.equal(same.trim, null);
  for (let p = 0; p < 3; p++) near(M.worth(M.tastes(0)[p], same.shares[p]), 1 / 3, 1e-12);
});

test('envy counts only more than a crumb', () => {
  const D = M.tastes(0);
  // Pieces of 0.334, 0.333 and 0.333: the first is worth a thousandth more to everyone, which isn't envy.
  assert.deepEqual(M.envy(D, M.shares(0.334, 0.667, 0)), [-1, -1, -1]);
  assert.deepEqual(M.envy(D, M.shares(0.34, 0.67, 0)), [-1, 0, 0]);
});
