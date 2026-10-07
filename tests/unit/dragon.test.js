import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.dragon;

/** Fold a strip once more, the way paper does: the turns so far, a new crease, then the far half coming back. */
function foldedByHand(folds) {
  let turns = [];
  for (let k = 0; k < folds; k++) turns = [...turns, 1, ...[...turns].reverse().map((t) => -t)];
  return turns;
}

test('the turn rule (n = 2^a · m, then m mod 4) gives the creases of a strip folded by hand, up to 14 folds', () => {
  for (let folds = 1; folds <= M.MAX_FOLDS; folds++) {
    const { turns, pieces } = M.strip(folds);
    assert.equal(pieces, 2 ** folds);
    assert.deepEqual([...turns.slice(1)], foldedByHand(folds), `${folds} folds`);
  }
  // The start of the sequence, as it's usually written (1 = right): 1 1 0 1 1 0 0 1 1 1 0 0 1 0 0.
  assert.deepEqual(
    foldedByHand(4).map((t) => (t > 0 ? 1 : 0)),
    [1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0],
  );
});

test('folding once more puts a new crease between every two, alternating right and left', () => {
  for (let folds = 1; folds < M.MAX_FOLDS; folds++) {
    const before = M.strip(folds).turns,
      after = M.strip(folds + 1).turns;
    for (let n = 1; n < before.length; n++) assert.equal(after[2 * n], before[n]);
    for (let n = 1; n < after.length; n += 2) assert.equal(after[n], n % 4 === 1 ? 1 : -1);
  }
});

test('the first fold makes the middle crease, and fold k makes 2^(k−1) creases', () => {
  const folds = 10;
  assert.equal(M.foldOf(2 ** (folds - 1), folds), 1);
  const made = [...M.strip(folds).made.slice(1)];
  for (let k = 1; k <= folds; k++) assert.equal(made.filter((f) => f === k).length, 2 ** (k - 1), `fold ${k}`);
});

test('opened to right angles, the strip never uses the same edge of the grid twice, up to 14 folds', () => {
  for (let folds = 1; folds <= M.MAX_FOLDS; folds++) {
    const keys = M.edgeKeys(M.lattice(folds));
    assert.equal(new Set(keys).size, keys.length, `${folds} folds`);
  }
});

// Reference numbers from an independent Python script (not this model): the turn rule checked against recursive
// folding, then the grid path walked with whole numbers.
test('it touches itself only at corners: no corner is visited more than twice', () => {
  for (const [folds, twice] of [
    [10, 335],
    [14, 6727],
  ]) {
    const visits = new Map();
    for (const [x, y] of M.lattice(folds)) visits.set(`${x},${y}`, (visits.get(`${x},${y}`) ?? 0) + 1);
    assert.equal(Math.max(...visits.values()), 2);
    assert.equal([...visits.values()].filter((v) => v === 2).length, twice, `${folds} folds`);
  }
  const ten = M.lattice(10);
  assert.deepEqual(ten.at(-1), [0, -32]); // 32 = √(2^10): each fold makes the dragon √2 times longer
  const xs = ten.map((p) => p[0]),
    ys = ten.map((p) => p[1]);
  assert.deepEqual([Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)], [-10, 21, -37, 10]);
  assert.ok(Math.abs(M.chord(10) - -Math.PI / 2) < 1e-12);
});

test('four dragons turned about their start share no edge, and leave no gap near the middle', () => {
  for (const [folds, radius] of [
    [6, 3],
    [8, 5],
    [10, 11],
    [12, 21],
  ]) {
    const all = [0, 1, 2, 3].flatMap((q) => M.edgeKeys(M.lattice(folds, q)));
    const used = new Set(all);
    assert.equal(used.size, all.length, `${folds} folds: no edge twice`);
    // Every edge of the grid whose middle lies within `radius` of the start (in the largest coordinate) is used…
    const missing = (r) => {
      const gaps = [];
      for (let x = -r - 1; x <= r; x++)
        for (let y = -r - 1; y <= r; y++)
          for (const [dx, dy] of [
            [1, 0],
            [0, 1],
          ])
            if (Math.max(Math.abs(x + dx / 2), Math.abs(y + dy / 2)) <= r && !used.has(`${x},${y} ${x + dx},${y + dy}`))
              gaps.push([x, y, dx, dy]);
      return gaps;
    };
    assert.deepEqual(missing(radius), [], `${folds} folds: every edge within ${radius}`);
    // …and one more step out, one isn't: the gaps begin there.
    assert.ok(missing(radius + 1).length > 0);
  }
});

test('the corners at right angles land on the grid path', () => {
  for (const folds of [1, 2, 5, 10, 14]) {
    const points = M.corners(folds, M.evenly(folds, Math.PI / 2));
    const grid = M.lattice(folds);
    grid.forEach(([x, y], i) => {
      assert.ok(Math.abs(points[2 * i] - x) < 1e-6 && Math.abs(points[2 * i + 1] - y) < 1e-6, `${folds}: corner ${i}`);
    });
  }
});

test('folded flat, the strip is a stack one piece long with both ends together; half folded, it is longer', () => {
  for (const folds of [1, 3, 10]) {
    const points = M.corners(folds, M.evenly(folds, Math.PI));
    const box = M.bounds(points);
    assert.ok(Math.abs(box.minX) < 1e-9 && Math.abs(box.maxX - 1) < 1e-9, `${folds}: one piece long`);
    assert.ok(Math.abs(box.minY) < 1e-9 && Math.abs(box.maxY) < 1e-9);
    assert.ok(Math.abs(points.at(-2)) < 1e-9 && Math.abs(points.at(-1)) < 1e-9, `${folds}: the ends meet`);
  }
  // After the first three of ten folds (the rest still flat), the stack is 2^7 pieces long.
  const bend = M.evenly(10, 0).map((_, k) => (k <= 3 ? Math.PI : 0));
  const box = M.bounds(M.corners(10, bend));
  assert.ok(Math.abs(box.maxX - box.minX - 128) < 1e-9);
  // And straight, it is the whole strip.
  assert.ok(Math.abs(M.bounds(M.corners(10, M.evenly(10, 0))).maxX - 1024) < 1e-9);
});

test('the dragon is two half-size dragons: its second half is the first, turned a right angle about the middle', () => {
  const folds = 10,
    points = M.lattice(folds),
    middle = points[2 ** (folds - 1)];
  for (let i = 0; i <= 2 ** (folds - 1); i++) {
    const [x, y] = points[i],
      [mx, my] = middle;
    // A quarter turn about the middle crease.
    const turned = [mx - (y - my), my + (x - mx)];
    assert.deepEqual(points[2 ** folds - i], turned, `corner ${i}`);
  }
});
