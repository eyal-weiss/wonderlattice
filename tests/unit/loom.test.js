import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const L = globalThis.Wonderloom.models.loom;
const STRAIGHT = 0,
  POINT = 1,
  SOLID = 0,
  FOUR_FOUR = 1,
  ALTERNATE = 2;
const base = { tieup: L.tieups.twill, threading: STRAIGHT, treadling: STRAIGHT, warpColours: SOLID, weftColours: 4 };

test('tie-up bits round-trip', () => {
  const bits = L.tieupFrom([[0, 2], [], [3], [0, 1, 2, 3]]);
  const back = [0, 1, 2, 3].map((t) => [0, 1, 2, 3].filter((s) => L.lifts(bits, t, s)));
  assert.deepEqual(back, [[0, 2], [], [3], [0, 1, 2, 3]]);
});

test('the drawdown is the Boolean product treadling × tie-up × threadingᵀ', () => {
  const threading = L.orders[2],
    treadling = L.orders[1],
    tieup = 0b1010_0110_1100_0011;
  const onehot = (order, n, len) =>
    Array.from({ length: n }, (_, i) => Array.from({ length: len }, (_, k) => order[i % order.length] === k));
  const T = onehot(treadling, 12, 4),
    H = onehot(threading, 10, 4);
  const U = [0, 1, 2, 3].map((t) => [0, 1, 2, 3].map((s) => L.lifts(tieup, t, s)));
  const product = T.map((row) => H.map((col) => row.some((r, t) => r && U[t].some((u, s) => u && col[s]))));
  assert.deepEqual(L.drawdown(threading, tieup, treadling, 12, 10), product);
});

test('plain weave is a checkerboard and twill is a diagonal', () => {
  const plain = L.drawdown(L.orders[STRAIGHT], L.tieups.plain, L.orders[STRAIGHT], 6, 6);
  plain.forEach((row, i) => row.forEach((up, j) => assert.equal(up, (i + j) % 2 === 0)));
  const twill = L.drawdown(L.orders[STRAIGHT], L.tieups.twill, L.orders[STRAIGHT], 8, 8);
  twill.forEach((row, i) => row.forEach((up, j) => assert.equal(up, twill[(i + 1) % 8][(j + 1) % 8])));
});

test('houndstooth: 2/2 twill with four dark, four light both ways repeats every 8 × 8', () => {
  const s = { ...base, warpColours: FOUR_FOUR, weftColours: FOUR_FOUR };
  assert.deepEqual(L.repeat(s), { across: 8, down: 8 });
  const tile = L.cloth(s, 8, 8);
  const dark = tile.flat().filter(Boolean).length;
  assert.equal(dark, 32, 'half the crossings are dark');
});

test('repeat sizes follow the orders and colours', () => {
  assert.deepEqual(L.repeat({ ...base, warpColours: SOLID, weftColours: 4 }), { across: 4, down: 4 });
  assert.deepEqual(L.repeat({ ...base, threading: POINT, treadling: POINT }), { across: 6, down: 6 });
  // Plain weave with alternating dark and light threads both ways gives solid stripes, not a check.
  const pinstripe = { ...base, tieup: L.tieups.plain, warpColours: ALTERNATE, weftColours: ALTERNATE };
  assert.deepEqual(L.repeat(pinstripe), { across: 1, down: 2 });
  assert.deepEqual(L.cloth(pinstripe, 2, 4), [
    [1, 1, 1, 1],
    [0, 0, 0, 0],
  ]);
  // One colour everywhere: the pattern disappears, whatever the weave.
  assert.deepEqual(L.repeat({ ...base, warpColours: SOLID, weftColours: SOLID }), { across: 1, down: 1 });
});

test('floats: twill floats over 2, thin twill over 3, and an empty treadle never interlaces', () => {
  assert.equal(L.longestFloat({ ...base, tieup: L.tieups.plain }), 1);
  assert.equal(L.longestFloat(base), 2);
  assert.equal(L.longestFloat({ ...base, tieup: L.tieups.thin }), 3);
  assert.equal(L.longestFloat({ ...base, tieup: L.tieupFrom([[0, 1], [], [2, 3], [3, 0]]) }), Infinity);
  assert.equal(L.longestFloat({ ...base, tieup: 0xffff }), Infinity);
});

test('period finds the smallest cyclic repeat', () => {
  assert.equal(L.period([1, 0, 1, 0]), 2);
  assert.equal(L.period([1, 1, 0, 1, 1, 0]), 3);
  assert.equal(L.period([1, 2, 3]), 3);
  assert.equal(L.period([7]), 1);
});
