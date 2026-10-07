import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.beam;
const close = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≠ ${b}`);
/** A solid rectangle of squares, h tall and w wide, with its top-left square at (top, left). */
const rect = (top, left, h, w) => {
  const list = [];
  for (let r = top; r < top + h; r++) for (let c = left; c < left + w; c++) list.push([r, c]);
  return M.rowsOf(list);
};

// The numbers below were checked with an independent program (a separate script summing 1/12 + d² over the squares of
// each piece, and an exact search over every way to stack 24 joined squares in 12 rows).

test('a rectangle b wide and h tall has I = b·h³/12, whatever its position', () => {
  for (const [h, w] of [
    [1, 1],
    [2, 12],
    [12, 2],
    [3, 8],
    [5, 7],
  ])
    for (const [top, left] of [
      [0, 0],
      [12 - h, 12 - w],
    ]) {
      const m = M.moments(M.cells(rect(top, left, h, w)));
      close(m.ixx, (w * h ** 3) / 12);
      close(m.iyy, (h * w ** 3) / 12);
    }
});

test('the plank on its edge is (width / thickness)² times stiffer: 36 for 12 cm by 2 cm', () => {
  const flat = M.analyse(M.SHAPES.plank),
    edge = M.analyse(M.SHAPES.edge);
  close(flat.ixx, 8);
  close(edge.ixx, 288);
  close(edge.ixx / flat.ixx, (12 / 2) ** 2);
  close(edge.times, 36);
  assert.equal(flat.count, 24);
  assert.equal(edge.count, 24);
  // A quarter turn stands the plank on its edge.
  assert.deepEqual(M.rotate(M.SHAPES.plank), M.SHAPES.edge);
});

test('the sag is F·L³/(48·E·I): 100 kg in the middle of 3 m of steel', () => {
  // 981 N × 27 m³ / (48 × 200 GPa × 8 × 10⁻⁸ m⁴) = 34.49 mm.
  close(M.sag(8), 34.48828125, 1e-6);
  close(M.sag(288), 0.9580078125, 1e-9);
  close(M.sag(508), 0.5431225394, 1e-9); // 275.90625 / 508
  close(M.sag(16) * 2, M.sag(8), 1e-12); // twice as stiff, half the sag
  assert.equal(M.sag(0), Infinity);
  // The bent shape: 0 at the supports, 1 in the middle, symmetric, 3ξ − 4ξ³ on the way.
  close(M.curve(0), 0);
  close(M.curve(1), 0);
  close(M.curve(0.5), 1);
  close(M.curve(0.25), 0.6875);
  close(M.curve(0.1), M.curve(0.9));
});

test('the I-beam, with its steel at the top and the bottom, beats the plank on its edge, and is the best of 24', () => {
  const beam = M.analyse(M.SHAPES.ibeam);
  assert.equal(beam.count, 24);
  assert.equal(beam.pieces.length, 1);
  close(beam.ixx, 508);
  close(beam.iyy, 58);
  close(beam.times, 63.5);
  assert.ok(beam.best);
  assert.equal(beam.name, 'ibeam');
  // Same steel as a solid square block (4 × 6 here, the nearest to square): far less stiff.
  const lump = M.analyse(rect(3, 3, 6, 4));
  close(lump.ixx, (4 * 6 ** 3) / 12);
  assert.ok(beam.ixx > lump.ixx * 7);
  // A box (hollow tube) of 24 squares is good, but not as good: its sides sit near the middle.
  const box = [];
  for (let r = 0; r < 10; r++)
    for (let c = 0; c < 4; c++) if (r === 0 || r === 9 || c === 0 || c === 3) box.push([r, c]);
  const tube = M.analyse(M.rowsOf(box));
  assert.equal(tube.count, 24);
  close(tube.ixx, 248);
  assert.ok(!tube.best);
});

test('moving a square further from the middle never lowers I', () => {
  // Take each square of several shapes and move it one row away from its piece's middle, when that keeps it joined.
  for (const shape of [M.SHAPES.plank, M.SHAPES.edge, M.SHAPES.ibeam, rect(2, 2, 4, 6)]) {
    const before = M.analyse(shape);
    for (const [r, c] of M.cells(shape)) {
      const piece = before.pieces.find((p) => p.cells.some(([pr, pc]) => pr === r && pc === c));
      const away = r + 0.5 < piece.cy ? r - 1 : r + 1;
      if (away < 0 || away >= M.SIZE || M.has(shape, away, c)) continue;
      const after = M.analyse(M.set(M.set(shape, r, c, false), away, c, true));
      if (after.pieces.length !== before.pieces.length) continue;
      assert.ok(after.ixx >= before.ixx - 1e-9, `moving (${r}, ${c}) to row ${away} lowered I`);
    }
  }
});

test('loose pieces bend on their own: two flanges with no web are barely stiffer than one', () => {
  const flanges = M.rowsOf(
    [...Array(12).keys()].flatMap((c) => [
      [0, c],
      [11, c],
    ]),
  );
  const loose = M.analyse(flanges);
  assert.equal(loose.pieces.length, 2);
  close(loose.ixx, 2); // 12 × 1³ / 12, twice
  assert.ok(loose.beyond); // 138 mm: past what the simple theory is trusted for
  close(loose.sag, 137.953125, 1e-6);
  // Squares that touch only at a corner are not joined.
  const corner = M.analyse(
    M.rowsOf([
      [0, 0],
      [1, 1],
    ]),
  );
  assert.equal(corner.pieces.length, 2);
  close(corner.ixx, 2 / 12);
});

test('the wobble warning is a rule of thumb: more than 20 times stiffer up and down than sideways', () => {
  assert.ok(M.analyse(M.SHAPES.edge).wobbly); // 36 times
  assert.ok(!M.analyse(M.SHAPES.ibeam).wobbly); // 8.8 times
  assert.ok(!M.analyse(M.SHAPES.plank).wobbly);
  assert.ok(!M.analyse(M.empty()).wobbly);
});

test('rows, settings and shapes survive the round trip; links are clamped to the grid', () => {
  const s = M.toSettings(M.SHAPES.ibeam);
  assert.deepEqual(Object.keys(s), M.KEYS);
  assert.ok(M.KEYS.every((k) => /^[a-zA-Z]{1,30}$/.test(k)));
  assert.deepEqual(M.fromSettings(s), M.SHAPES.ibeam);
  assert.deepEqual(M.fromSettings({ ra: 99999, rb: -3, rc: 2.6 }).slice(0, 3), [4095, 0, 3]);
  assert.equal(M.nameOf(M.SHAPES.plank), 'plank');
  assert.equal(M.nameOf(rect(0, 0, 2, 12)), 'plank'); // the same plank, higher up
  assert.equal(M.nameOf(rect(0, 0, 3, 8)), null);
  // Four quarter turns come back home; one turns the plank onto its edge.
  let r = M.SHAPES.ibeam;
  for (let k = 0; k < 4; k++) r = M.rotate(r);
  assert.deepEqual(r, M.SHAPES.ibeam);
  assert.equal(M.nameOf(M.rotate(M.SHAPES.plank)), 'edge');
  assert.equal(M.count(M.rotate(M.SHAPES.ibeam)), 24);
});

test('a glide moves every square once, keeping those already in place', () => {
  const moves = M.glide(M.SHAPES.edge, M.SHAPES.ibeam);
  assert.equal(moves.length, 24);
  assert.equal(moves.filter((m) => m.from && m.to && m.from[0] === m.to[0] && m.from[1] === m.to[1]).length, 14);
  assert.deepEqual(M.rowsOf(moves.map((m) => m.to)), M.SHAPES.ibeam);
  assert.deepEqual(M.rowsOf(moves.map((m) => m.from)), M.SHAPES.edge);
  // Fewer squares: some go.
  const fewer = M.glide(M.SHAPES.plank, rect(0, 0, 1, 3));
  assert.equal(fewer.filter((m) => !m.to).length, 21);
  assert.equal(fewer.filter((m) => !m.from).length, 0);
});
