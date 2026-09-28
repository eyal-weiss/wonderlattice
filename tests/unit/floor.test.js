import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const F = globalThis.Wonderlattice.models.floor;

/** Whether the free squares can be covered, by trying every way (small boards only). */
function bruteForce(holes, w, h) {
  const covered = new Set(holes);
  const go = () => {
    let first = -1;
    for (let i = 0; i < w * h; i++)
      if (!covered.has(i)) {
        first = i;
        break;
      }
    if (first < 0) return true;
    for (const j of [first + 1, first + w]) {
      const ok = j === first + 1 ? first % w < w - 1 : j < w * h;
      if (!ok || covered.has(j)) continue;
      covered.add(first).add(j);
      if (go()) return true;
      covered.delete(first);
      covered.delete(j);
    }
    return false;
  };
  return go();
}

/** A tiling must use neighbouring pairs, never overlap, and cover exactly the free squares. */
function assertValid(tiles, holes, w, h) {
  const used = new Set();
  for (const [a, b] of tiles) {
    assert.ok(F.neighbours(a, w, h).includes(b), `${a}-${b} are neighbours`);
    for (const x of [a, b]) {
      assert.ok(!holes.has(x) && !used.has(x), `square ${x} free and used once`);
      used.add(x);
    }
  }
  assert.equal(used.size + holes.size, w * h);
}

test('the matching finds a tiling exactly when one exists (checked by brute force on small boards)', () => {
  let seed = 7;
  const rand = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
  for (let trial = 0; trial < 400; trial++) {
    const w = 3 + Math.floor(rand() * 3),
      h = 3 + Math.floor(rand() * 3);
    const holes = new Set();
    for (let i = 0; i < w * h; i++) if (rand() < 0.25) holes.add(i);
    const tiles = F.tiling(holes, w, h);
    assert.equal(tiles !== null, bruteForce(holes, w, h), `${w}×${h} holes ${[...holes]}`);
    if (tiles) assertValid(tiles, holes, w, h);
  }
});

test('two opposite corners gone: the colours no longer balance, so no tiling', () => {
  const holes = new Set([0, 63]);
  assert.equal(F.colour(0), F.colour(63));
  assert.deepEqual(F.counts(holes), { light: 30, dark: 32 });
  assert.equal(F.tiling(holes), null);
});

test('Gomory: removing any light square and any dark square from a full board always leaves a tiling', () => {
  for (let a = 0; a < 64; a++)
    for (let b = 0; b < 64; b++) {
      if (F.colour(a) !== 0 || F.colour(b) !== 1) continue;
      const holes = new Set([a, b]);
      const tiles = F.tiling(holes);
      assert.ok(tiles, `squares ${a} and ${b}`);
      assertValid(tiles, holes, 8, 8);
    }
});

test('balanced but stuck: a cornered square is found as the patch that can’t balance', () => {
  // Remove the two (dark) squares next to the top-left corner, and two light squares elsewhere.
  const holes = new Set([1, 8, 63, 54]);
  assert.deepEqual(F.counts(holes), { light: 30, dark: 30 });
  assert.equal(F.tiling(holes), null);
  assert.deepEqual(F.stuckPatch(holes), [0]);
});

test('a full board and a board with dominoes already placed', () => {
  assertValid(F.tiling(new Set()), new Set(), 8, 8);
  // With squares 0 and 1 taken by a domino, the rest still tiles.
  const rest = F.tiling(new Set(), 8, 8, new Set([0, 1]));
  assert.equal(rest.length, 31);
  // A domino at 1-9 leaves the corner 0 only square 8 as a partner, still fine; blocking 8 too makes it stuck.
  assert.equal(F.tiling(new Set([8]), 8, 8, new Set([1, 9])), null);
});

test('removed squares travel as two whole numbers and come back unchanged', () => {
  const holes = new Set([0, 5, 31, 32, 47, 63]);
  const [a, b] = F.toMasks(holes);
  assert.ok(Number.isInteger(a) && Number.isInteger(b) && a < 2 ** 32 && b < 2 ** 32);
  assert.deepEqual(
    [...F.fromMasks(a, b)].sort((x, y) => x - y),
    [0, 5, 31, 32, 47, 63],
  );
  assert.deepEqual([...F.fromMasks(0, 0)], []);
});
