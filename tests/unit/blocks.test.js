import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.blocks;

// ── harmonicNumber ──────────────────────────────────────────────────────────

test('harmonicNumber(0) is 0', () => {
  assert.equal(M.harmonicNumber(0), 0);
});

test('harmonicNumber(1) is 1', () => {
  assert.equal(M.harmonicNumber(1), 1);
});

test('harmonicNumber(4) is 1 + 1/2 + 1/3 + 1/4', () => {
  assert.ok(Math.abs(M.harmonicNumber(4) - (1 + 1 / 2 + 1 / 3 + 1 / 4)) < 1e-12);
});

test('harmonicNumber throws on non-integer input', () => {
  assert.throws(() => M.harmonicNumber(1.5), RangeError);
  assert.throws(() => M.harmonicNumber(-1), RangeError);
});

// ── maxOverhang ─────────────────────────────────────────────────────────────

test('maxOverhang(0) is 0', () => {
  assert.equal(M.maxOverhang(0), 0);
});

test('maxOverhang(1) is 0.5', () => {
  assert.equal(M.maxOverhang(1), 0.5);
});

test('maxOverhang(2) is 0.75', () => {
  assert.ok(Math.abs(M.maxOverhang(2) - 0.75) < 1e-12);
});

// ── blocksForOverhang ────────────────────────────────────────────────────────

test('4 blocks reach at least 1 block-length of overhang', () => {
  assert.equal(M.blocksForOverhang(1), 4);
});

test('31 blocks reach at least 2 block-lengths of overhang', () => {
  assert.equal(M.blocksForOverhang(2), 31);
});

test('227 blocks reach at least 3 block-lengths of overhang', () => {
  assert.equal(M.blocksForOverhang(3), 227);
});

test('blocksForOverhang(0) is 0', () => {
  assert.equal(M.blocksForOverhang(0), 0);
});

// ── optimalStack ─────────────────────────────────────────────────────────────

test('optimalStack(0) returns an empty array', () => {
  assert.deepEqual(M.optimalStack(0), []);
});

test('optimalStack(1) top block right edge is at 0.5', () => {
  const c = M.optimalStack(1);
  assert.equal(c.length, 1);
  assert.ok(Math.abs(c[0] + 0.5 - 0.5) < 1e-12); // right edge = c[0] + 0.5 = 0.5
});

test('optimalStack(4) top-block right edge equals maxOverhang(4)', () => {
  const c = M.optimalStack(4);
  assert.equal(c.length, 4);
  const topRightEdge = c[3] + 0.5;
  assert.ok(Math.abs(topRightEdge - M.maxOverhang(4)) < 1e-9, `expected ${M.maxOverhang(4)}, got ${topRightEdge}`);
});

test('optimalStack(4) is stable', () => {
  assert.ok(M.isStable(M.optimalStack(4)));
});

test('optimalStack(31) is stable and has overhang ≥ 2', () => {
  const c = M.optimalStack(31);
  assert.ok(M.isStable(c));
  assert.ok(M.stackOverhang(c) >= 2 - 1e-9);
});

test('shifting the top block of optimalStack(4) one step further right makes it unstable', () => {
  const c = M.optimalStack(4);
  c[3] += 0.001; // nudge top block rightward
  assert.ok(!M.isStable(c));
});

// ── isStable ──────────────────────────────────────────────────────────────────

test('an empty stack is stable', () => {
  assert.ok(M.isStable([]));
});

test('a single block at centre 0 is stable (CoM at table edge)', () => {
  assert.ok(M.isStable([0])); // centre at 0, CoM at 0 ≤ 0
});

test('a single block with centre > 0 is unstable', () => {
  assert.ok(!M.isStable([0.01])); // CoM at 0.01 > 0 (table support edge)
});

test('the best 4-block stack shifted 0.45 to the right is unstable', () => {
  const c = M.optimalStack(4);
  for (let i = 0; i < c.length; i++) c[i] += 0.45;
  assert.ok(!M.isStable(c));
});

test('a block placed far to the left of the block below is unstable', () => {
  assert.ok(!M.isStable([-0.5, -0.5, -3.5]));
});

test('a block placed far to the left on the table is stable', () => {
  assert.ok(M.isStable([-10])); // table extends infinitely to the left
});

// ── firstUnstableInterface ────────────────────────────────────────────────────

test('firstUnstableInterface returns -1 for a stable stack', () => {
  assert.equal(M.firstUnstableInterface(M.optimalStack(5)), -1);
});

test('firstUnstableInterface returns a non-negative index for an unstable stack', () => {
  const c = M.optimalStack(4);
  c[3] += 0.5; // deliberately topple the top block
  assert.ok(M.firstUnstableInterface(c) >= 0);
});

// ── stackOverhang ─────────────────────────────────────────────────────────────

test('stackOverhang([]) is 0', () => {
  assert.equal(M.stackOverhang([]), 0);
});

test('stackOverhang matches top-block centre + 0.5', () => {
  const c = M.optimalStack(10);
  assert.ok(Math.abs(M.stackOverhang(c) - (c[9] + 0.5)) < 1e-12);
});
