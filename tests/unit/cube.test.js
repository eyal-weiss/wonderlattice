import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const C = globalThis.Wonderlattice.models.cube;
const [U, R, F, D, L, B] = [0, 1, 2, 3, 4, 5];
const prime = (m) => m + 6;

test('there are 54 stickers, nine per face, and every move is a permutation', () => {
  assert.equal(C.stickers.length, 54);
  for (let f = 0; f < 6; f++) assert.equal(C.stickers.filter((s) => s.face === f).length, 9);
  for (const move of C.MOVES) assert.equal(new Set(move.perm).size, 54, move.name);
});

test('a face turn moves 20 stickers: its own 8 around the centre, and 12 on the sides', () => {
  for (const move of C.MOVES) assert.equal(move.perm.filter((to, from) => to !== from).length, 20, move.name);
});

test('four quarter turns come home, and a move followed by its inverse does nothing', () => {
  for (let m = 0; m < 12; m++) {
    assert.ok(C.isSolved(C.run(C.solved(), [m, m, m, m])), `${C.MOVES[m].name} × 4`);
    assert.ok(C.isSolved(C.run(C.solved(), [m, C.inverseOf(m)])));
  }
});

test('turning U clockwise from above sends the front edge to the left', () => {
  // The front-top edge sticker on F moves to L when U turns clockwise (seen from above).
  const i = C.stickers.findIndex((s) => s.face === F && s.p.join() === '0,1,1');
  const to = C.MOVES[U].perm[i];
  assert.deepEqual(C.stickers[to].n, [-1, 0, 0]);
});

test('order matters: R then U is not U then R', () => {
  const a = C.run(C.solved(), [R, U]),
    b = C.run(C.solved(), [U, R]);
  assert.notDeepEqual(a, b);
  // Opposite faces commute.
  assert.deepEqual(C.run(C.solved(), [R, L]), C.run(C.solved(), [L, R]));
});

test('undoing a sequence reverses it: (R U)⁻¹ = U′ R′', () => {
  assert.deepEqual(C.inverse([R, U]), [prime(U), prime(R)]);
  const scramble = [R, U, F, prime(D), L, B, B, prime(R)];
  assert.ok(C.isSolved(C.run(C.run(C.solved(), scramble), C.inverse(scramble))));
});

test('famous orders: R U comes home after 105 repeats, R U R′ U′ after 6', () => {
  assert.equal(C.order([R, U]), 105);
  assert.equal(C.order([R, U, prime(R), prime(U)]), 6);
  assert.equal(C.order([R]), 4);
  assert.equal(C.order([R, R]), 2);
  assert.equal(C.order([]), 1);
  // And the claim holds when actually repeated.
  assert.ok(C.isSolved(C.run(C.solved(), [R, U], 105)));
  for (const k of [1, 3, 5, 7, 15, 21, 35]) assert.ok(!C.isSolved(C.run(C.solved(), [R, U], k)), `not home at ${k}`);
});

test('a commutator disturbs only a few stickers', () => {
  const sexy = C.run(C.solved(), [R, U, prime(R), prime(U)]);
  assert.ok(C.misplaced(sexy) > 0);
  assert.ok(C.misplaced(sexy) < C.misplaced(C.run(C.solved(), [R, U])));
  // The well-known count: R U R′ U′ disturbs seven pieces, four corners and three edges.
  const moved = [...C.movedPieces(sexy)].map((p) => p.split(',').map(Number));
  assert.equal(moved.length, 7);
  assert.equal(moved.filter((p) => p.every((c) => c !== 0)).length, 4, 'corners');
  assert.equal(moved.filter((p) => p.filter((c) => c === 0).length === 1).length, 3, 'edges');
});

test('sequences round-trip through one number', () => {
  for (const seq of [[], [R], [R, U, prime(R), prime(U)], new Array(12).fill(11), [0, 0, 0]])
    assert.deepEqual(C.decode(C.encode(seq)), seq);
  assert.equal(C.decode(13), null, 'a zero digit is not a sequence');
  assert.ok(C.MAX_CODE < Number.MAX_SAFE_INTEGER);
});

test('R U moves stickers in cycles of 3, 7, and 15 (so 105 = lcm), as the explanation says', () => {
  const perm = C.stickers.map((_, i) => i);
  for (const m of [R, U]) {
    const p = C.MOVES[m].perm;
    for (let i = 0; i < perm.length; i++) perm[i] = p[perm[i]];
  }
  const seen = new Array(54).fill(false),
    lengths = new Set();
  for (let i = 0; i < 54; i++) {
    let length = 0;
    for (let j = i; !seen[j]; j = perm[j]) {
      seen[j] = true;
      length++;
    }
    if (length > 1) lengths.add(length);
  }
  assert.deepEqual(
    [...lengths].sort((a, b) => a - b),
    [3, 7, 15],
  );
});
