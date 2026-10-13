import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.gasket;
const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);
// Every circle with bend up to `most`: the radius of a circle of bend b is k / b.
const upTo = (k, a, b, most) => M.grow(k, a, b, { smallest: k / (most + 0.5), most: 1e6 });
const sorted = (circles) => circles.map((c) => c.bend).sort((p, q) => p - q);

test('the four starting circles touch in pairs, and their bends obey Descartes’s theorem', () => {
  for (const [k, a, b, c] of [
    [1, 2, 2, 3],
    [2, 3, 6, 7],
    [3, 4, 12, 13],
    [6, 10, 15, 19],
    [4, 8, 9, 9],
  ]) {
    const four = M.start(k, a, b);
    assert.deepEqual(
      four.map((circle) => circle.bend),
      [-k, a, b, c],
    );
    const { left, right } = M.descartes([-k, a, b, c]);
    assert.equal(left, right);
    for (let i = 0; i < 4; i++)
      for (let j = i + 1; j < 4; j++) {
        const [p, q] = [four[i], four[j]];
        const apart = Math.hypot(p.x - q.x, p.y - q.y);
        near(apart, p.bend < 0 ? p.r - q.r : p.r + q.r, 1e-12);
      }
  }
  // Two circles too wide to sit side by side in the big one make no gasket.
  assert.equal(M.start(1, 1.5, 2.5), null);
});

test('the −1, 2, 2, 3 gasket: its first bends, and how many circles have bends up to 200', () => {
  // Counted independently with exact integers (a Python script applying b′ = 2(b₁ + b₂ + b₃) − b₄ to the starting
  // four): 413 circles with bend at most 200, and these first bends, one per circle.
  const circles = upTo(1, 2, 2, 200);
  assert.equal(circles.length, 413);
  assert.deepEqual(
    sorted(circles).slice(0, 30),
    [-1, 2, 2, 3, 3, 6, 6, 6, 6, 11, 11, 11, 11, 14, 14, 14, 14, 15, 15, 18, 18, 18, 18, 23, 23, 23, 23, 26, 26, 26],
  );
  assert.deepEqual([...new Set(sorted(circles))].slice(0, 12), [-1, 2, 3, 6, 11, 14, 15, 18, 23, 26, 27, 30]);
  // Every bend leaves one of eight remainders when divided by 24.
  assert.deepEqual(
    [...new Set(circles.filter((c) => c.bend > 0).map((c) => c.bend % 24))].sort((p, q) => p - q),
    [2, 3, 6, 11, 14, 15, 18, 23],
  );
});

test('the other presets give whole numbers too, counted the same way', () => {
  for (const [k, a, b, count, first] of [
    [2, 3, 6, 159, [-2, 3, 6, 7, 7, 10, 10, 15, 15, 19, 19, 22]],
    [3, 4, 12, 93, [-3, 4, 12, 13, 13, 16, 16, 21, 21, 28, 28, 37]],
    [6, 10, 15, 41, [-6, 10, 15, 19, 19, 31, 31, 46, 46, 51, 51, 78]],
  ]) {
    const circles = upTo(k, a, b, 200);
    assert.equal(circles.length, count, `${-k}, ${a}, ${b}`);
    assert.deepEqual(sorted(circles).slice(0, 12), first);
    assert.ok(circles.every((c) => Number.isInteger(c.bend)));
  }
});

test('every circle touches the three it was born between, and with them obeys Descartes’s theorem', () => {
  for (const [k, a, b] of [
    [1, 2, 2],
    [2, 3, 6],
    [1, 2.2, 2.1],
    [1, 1.69, 3],
  ]) {
    const circles = M.grow(k, a, b, { smallest: 0.004 });
    assert.ok(circles.length > 200);
    for (const c of circles) {
      const bends = [c.bend, ...c.touches.map((i) => circles[i].bend)];
      const { left, right } = M.descartes(bends);
      near(left, right, 1e-9 * right);
      for (const i of c.touches) {
        const p = circles[i];
        assert.ok(i < circles.indexOf(c) || c.generation === 0, 'born after the circles it touches');
        near(Math.hypot(p.x - c.x, p.y - c.y), p.bend < 0 || c.bend < 0 ? Math.abs(p.r - c.r) : p.r + c.r, 1e-9);
      }
      // The rule a tap shows: twice the three it touches, minus the circle across from them.
      const across = circles[c.other];
      near(c.bend, 2 * c.touches.reduce((t, i) => t + circles[i].bend, 0) - across.bend, 1e-9 * Math.abs(c.bend));
    }
  }
});

test('a nudged start gives decimals, and only the big circle keeps a whole bend', () => {
  const circles = M.grow(1, 2.2, 2.1, { smallest: 0.01 });
  const whole = circles.filter((c) => Number.isInteger(c.bend)).map((c) => c.bend);
  assert.deepEqual(whole, [-1]);
  near(circles[3].bend, -1 + 2.2 + 2.1 - 2 * Math.sqrt(2.2 * 2.1 - 4.3), 1e-12); // 2.1686…
});

test('the gap circle holds every circle born in that gap', () => {
  const circles = M.grow(1, 2, 2, { smallest: 0.01 });
  for (const c of circles.slice(4)) {
    const g = M.gapCircle(...c.touches.map((i) => circles[i]));
    assert.ok(Math.hypot(c.x - g.x, c.y - g.y) + c.r <= g.r + 1e-12);
  }
});

test('a view leaves out what it can’t see, and keeps everything it can', () => {
  const view = { x0: 0.3, y0: 0.3, x1: 0.5, y1: 0.5 };
  const all = M.grow(1, 2, 2, { smallest: 0.002 });
  const some = M.grow(1, 2, 2, { view, smallest: 0.002 });
  assert.ok(some.length < all.length / 3);
  const touches = (c) => c.x + c.r > view.x0 && c.x - c.r < view.x1 && c.y + c.r > view.y0 && c.y - c.r < view.y1;
  const key = (c) => `${c.bend}:${c.x.toFixed(9)}:${c.y.toFixed(9)}`;
  const kept = new Set(some.map(key));
  for (const c of all.filter(touches)) assert.ok(kept.has(key(c)), `kept ${c.bend}`);
});

test('a deep point lies on no circle, so circles of every size crowd round it', () => {
  const p = M.deepPoint(
    1,
    2,
    2,
    { x: 0.42, y: 0.4 },
    0.04,
    [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  );
  const circles = M.grow(1, 2, 2, {
    view: { x0: p.x - 1e-3, y0: p.y - 1e-3, x1: p.x + 1e-3, y1: p.y + 1e-3 },
    smallest: 1e-6,
  });
  const inside = circles.filter((c) => Math.hypot(c.x - p.x, c.y - p.y) < c.r - 1e-7);
  assert.equal(inside.filter((c) => c.bend > 0).length, 0);
  const nearby = circles.filter((c) => c.bend > 0 && Math.hypot(c.x - p.x, c.y - p.y) - c.r < 1e-3);
  assert.ok(nearby.some((c) => c.r < 1e-4) && nearby.some((c) => c.r > 1e-4));
});

test('starting circles that fit: each between 1.2k and 8k, and side by side no wider than the big one', () => {
  assert.deepEqual(M.settle(1, 2, 2), { a: 2, b: 2 });
  assert.deepEqual(M.settle(3, 4, 12), { a: 4, b: 12 });
  // A left circle grown to bend 1.3 pushes the right one down to bend 1 + 1/0.3 = 4.333…, rounded up.
  assert.deepEqual(M.settle(1, 1.3, 2, 'a'), { a: 1.3, b: 4.34 });
  // When the right one moved, the left gives way instead.
  assert.deepEqual(M.settle(1, 2, 1.3, 'b'), { a: 4.34, b: 1.3 });
  assert.deepEqual(M.settle(1, 0.5, 100), { a: 1.2, b: 8 });
  for (const [a, b] of [
    [1.21, 3],
    [2.01, 1.5],
    [1.77, 2.31],
  ]) {
    const fit = M.settle(1, a, b);
    assert.ok(M.start(1, fit.a, fit.b), `${a}, ${b}`);
  }
  near(M.fewest(2, 3), 6);
});

test('resizing a starting circle keeps all four touching', () => {
  const left = M.resize(1, 2, 2, 0, 0.6);
  assert.deepEqual(left, { a: 1.67, b: 2.5 });
  const right = M.resize(1, 2, 2, 1, 0.3);
  assert.equal(right.b, 3.33);
  // The last circle grows to radius 0.4 as the other two shrink together.
  const last = M.resize(1, 2, 2, 2, 0.4);
  near(M.start(1, last.a, last.b)[3].r, 0.4, 0.01);
  assert.ok(last.a > 2 && last.b > 2);
});
