import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.truss;
const close = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≠ ${b}`);

/** The bars ([a, b] joint pairs) of an n-panel frame, and the places they sit in. */
function frame(n, mask) {
  const list = M.places(n);
  const at = M.barsOf(n, mask);
  return { at, bars: at.map((i) => [list[i].a, list[i].b]), points: M.joints(n) };
}

/** A bar's force by kind and panel, e.g. force(n, mask, tension, 'top', 1). */
function force({ at }, tension, n, kind, panel) {
  const list = M.places(n);
  const k = at.findIndex((i) => list[i].kind === kind && list[i].panel === panel);
  assert.ok(k >= 0, `no ${kind} bar in panel ${panel}`);
  return tension[k];
}

test('a triangle is rigid and a square is not; one diagonal fixes the square, a second is spare', () => {
  const triangle = [
    [0, 0],
    [1, 0],
    [0.5, 0.9],
  ];
  assert.ok(
    M.rigid(triangle, [
      [0, 1],
      [1, 2],
      [2, 0],
    ]),
  );
  const square = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  const sides = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
  ];
  assert.equal(M.rank(square, sides), 4);
  assert.ok(!M.rigid(square, sides));
  assert.ok(M.rigid(square, [...sides, [0, 2]]));
  const both = M.span(M.rows(square, [...sides, [0, 2], [1, 3]]));
  assert.equal(both.rank, 5);
  assert.deepEqual(both.dependent, [5]);
});

test('Maxwell’s count: j joints need 2j − 3 bars, and the bridge of squares is short by one per panel', () => {
  for (let n = M.MIN_PANELS; n <= M.MAX_PANELS; n++) {
    const squares = M.analyse(n, M.pattern(n, 'squares'));
    assert.equal(squares.joints, 2 * (n + 1));
    assert.equal(squares.needed, 4 * n + 1);
    assert.equal(squares.bars, 3 * n + 1);
    assert.equal(squares.verdict, 'short');
    assert.equal(squares.rank, 3 * n + 1); // every bar counts; there just aren't enough
    for (const name of ['pratt', 'howe']) {
      const braced = M.analyse(n, M.pattern(n, name));
      assert.equal(braced.bars, braced.needed, name);
      assert.equal(braced.verdict, 'rigid', name);
      assert.deepEqual(braced.spare, [], name);
    }
  }
});

test('2j − 3 bars badly spread are still floppy: two diagonals in one panel, none in the next', () => {
  for (let n = M.MIN_PANELS; n <= M.MAX_PANELS; n++) {
    const counted = M.analyse(n, M.pattern(n, 'counted'));
    assert.equal(counted.bars, counted.needed);
    assert.equal(counted.verdict, 'spread');
    assert.equal(counted.rank, counted.needed - 1);
    assert.equal(counted.generic, counted.needed - 1); // not a special position: no placement of the joints helps
    // The first panel's diagonals, in their own order: the one falling to the right adds nothing to the other.
    assert.deepEqual(counted.spare, [M.fall(n, 0)]);
  }
});

test('a joint in a straight line between two bars is floppy, though the same bars are rigid in general position', () => {
  // A triangle, and a fourth joint held by two bars. Off the line it is rigid; on the line it can wobble.
  const bars = [
    [0, 1],
    [1, 2],
    [2, 0],
    [0, 3],
    [1, 3],
  ];
  const off = [
    [0, 0],
    [2, 0],
    [1, 1.5],
    [1, -0.4],
  ];
  const on = [
    [0, 0],
    [2, 0],
    [1, 1.5],
    [1, 0],
  ];
  assert.ok(M.rigid(off, bars));
  assert.ok(!M.rigid(on, bars));
  assert.equal(M.genericRank(on, bars), 5);
});

/** Laman's condition by brute force: some 2j − 3 of the bars, with every k joints joined by at most 2k − 3. */
function laman(j, edges) {
  const need = 2 * j - 3;
  const sparse = (chosen) => {
    for (let set = 1; set < 2 ** j; set++) {
      const k = [...Array(j).keys()].filter((v) => set & (1 << v)).length;
      if (k < 2) continue;
      const inside = chosen.filter(([a, b]) => set & (1 << a) && set & (1 << b)).length;
      if (inside > 2 * k - 3) return false;
    }
    return true;
  };
  const pick = (start, chosen) => {
    if (chosen.length === need) return sparse(chosen);
    for (let i = start; i <= edges.length - (need - chosen.length); i++)
      if (pick(i + 1, [...chosen, edges[i]])) return true;
    return false;
  };
  return edges.length >= need && pick(0, []);
}

test('the rank in general position agrees with Laman’s condition on 150 random small frames', () => {
  let seed = 63;
  const random = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  for (let trial = 0; trial < 150; trial++) {
    const j = 3 + Math.floor(random() * 4);
    const all = [];
    for (let a = 0; a < j; a++) for (let b = a + 1; b < j; b++) all.push([a, b]);
    const count = Math.min(all.length, 2 * j - 4 + Math.floor(random() * 4));
    const edges = [];
    while (edges.length < count) {
      const e = all[Math.floor(random() * all.length)];
      if (!edges.includes(e)) edges.push(e);
    }
    const points = Array.from({ length: j }, (_, i) => [Math.cos(i), Math.sin(2 * i)]);
    assert.equal(M.genericRank(points, edges) === 2 * j - 3, laman(j, edges), JSON.stringify(edges));
  }
});

// Forces checked against an independent program (sympy, the method of joints with the supports' reactions as
// unknowns, exact fractions), for Pratt and Howe frames of 2 to 6 panels with the truck at three places.
test('a Pratt truss with the truck in the middle: stretched diagonals, squeezed top, two bars carry nothing', () => {
  const n = 4,
    mask = M.pattern(n, 'pratt');
  const f = frame(n, mask);
  const { tension, reactions } = M.forces(f.points, f.bars, M.held(n), M.truckLoads(n, 2));
  const h = Math.SQRT1_2;
  const expected = {
    bottom: [0, 0.5, 0.5, 0],
    top: [-0.5, -1, -1, -0.5],
    post: [-0.5, -0.5, -1, -0.5, -0.5],
    fall: [h, h, null, null],
    rise: [null, null, h, h],
  };
  for (const [kind, values] of Object.entries(expected))
    values.forEach((v, panel) => v !== null && close(force(f, tension, n, kind, panel), v));
  close(reactions[0], 0);
  close(reactions[1], 0.5);
  close(reactions[2], 0.5);
});

test('flip the diagonals (a Howe truss) and stretched turns to squeezed', () => {
  const n = 4;
  const f = frame(n, M.pattern(n, 'howe'));
  const { tension } = M.forces(f.points, f.bars, M.held(n), M.truckLoads(n, 2));
  const h = Math.SQRT1_2;
  [0.5, 1, 1, 0.5].forEach((v, k) => close(force(f, tension, n, 'bottom', k), v));
  [0, -0.5, -0.5, 0].forEach((v, k) => close(force(f, tension, n, 'top', k), v));
  [0, 0.5, 0, 0.5, 0].forEach((v, k) => close(force(f, tension, n, 'post', k), v));
  close(force(f, tension, n, 'rise', 0), -h);
  close(force(f, tension, n, 'rise', 1), -h);
  close(force(f, tension, n, 'fall', 2), -h);
  close(force(f, tension, n, 'fall', 3), -h);
});

test('a long, shallow truss: the middle of the top chord carries one and a half times the truck', () => {
  const n = 6;
  const f = frame(n, M.pattern(n, 'pratt'));
  const { tension } = M.forces(f.points, f.bars, M.held(n), M.truckLoads(n, 3));
  [-0.5, -1, -1.5, -1.5, -1, -0.5].forEach((v, k) => close(force(f, tension, n, 'top', k), v));
  [0, 0.5, 1, 1, 0.5, 0].forEach((v, k) => close(force(f, tension, n, 'bottom', k), v));
  // Between joints, the road hands the truck to the joints either side: 5/8 and 3/8 at 1.5 panels of 4.
  const g = frame(4, M.pattern(4, 'pratt'));
  const off = M.forces(g.points, g.bars, M.held(4), M.truckLoads(4, 1.5));
  close(off.reactions[1], 5 / 8);
  close(off.reactions[2], 3 / 8);
  close(force(g, off.tension, 4, 'fall', 0), (5 * Math.SQRT2) / 8);
  close(force(g, off.tension, 4, 'fall', 1), Math.SQRT2 / 8);
  close(force(g, off.tension, 4, 'rise', 2), (3 * Math.SQRT2) / 8);
});

test('every joint balances: bars, load and supports add up to nothing, with or without spare bars', () => {
  for (let n = M.MIN_PANELS; n <= M.MAX_PANELS; n++)
    for (const mask of [
      M.pattern(n, 'pratt'),
      M.pattern(n, 'howe'),
      M.toggle(M.pattern(n, 'pratt'), M.rise(n, 0)),
      M.places(n).reduce((m, _, i) => M.toggle(m, i), 0), // every bar
    ])
      for (const x of [0, 0.37, n / 2, n - 0.8, n]) {
        const f = frame(n, mask);
        const loads = M.truckLoads(n, x);
        const { tension, reactions } = M.forces(f.points, f.bars, M.held(n), loads);
        const sum = Float64Array.from(loads);
        f.bars.forEach(([a, b], k) => {
          const dx = f.points[b][0] - f.points[a][0],
            dy = f.points[b][1] - f.points[a][1];
          const L = Math.hypot(dx, dy);
          sum[2 * a] += (tension[k] * dx) / L;
          sum[2 * a + 1] += (tension[k] * dy) / L;
          sum[2 * b] -= (tension[k] * dx) / L;
          sum[2 * b + 1] -= (tension[k] * dy) / L;
        });
        M.held(n).forEach((d, k) => (sum[d] += reactions[k]));
        for (const v of sum) close(v, 0);
        // The supports hold up exactly the truck, when it's on the bridge.
        close(reactions[1] + reactions[2], x >= 0 && x <= n ? 1 : 0);
      }
});

test('a symmetric load on a symmetric truss gives symmetric forces', () => {
  // With an even number of panels, so the diagonals are mirror images too.
  for (let n = M.MIN_PANELS; n <= M.MAX_PANELS; n += 2)
    for (const name of ['pratt', 'howe']) {
      const f = frame(n, M.pattern(n, name));
      const { tension } = M.forces(f.points, f.bars, M.held(n), M.truckLoads(n, n / 2));
      const list = M.places(n);
      const mirror = { bottom: 'bottom', top: 'top', post: 'post', rise: 'fall', fall: 'rise' };
      f.at.forEach((i, k) => {
        const { kind, panel } = list[i];
        const other = kind === 'post' ? n - panel : n - 1 - panel;
        close(force(f, tension, n, mirror[kind], other), tension[k]);
      });
    }
});

test('a floppy frame has no forces, only a way to give; following it keeps every bar its length', () => {
  const n = 4;
  const f = frame(n, M.pattern(n, 'squares'));
  assert.equal(M.forces(f.points, f.bars, M.held(n), M.truckLoads(n, 2)), null);
  // A push to the right finds the sway: the whole top chord moves sideways, the pinned joint stays.
  const push = new Float64Array(4 * (n + 1)).map((_, d) => (d % 2 ? 0 : 1));
  const way = M.mechanism(f.points, f.bars, M.held(n), push);
  for (let i = 0; i <= n; i++) {
    close(way[2 * M.top(n, i)], 1);
    close(way[2 * M.bottom(n, i)], 0);
  }
  // No bar changes length to first order.
  for (const row of M.rows(f.points, f.bars))
    close(
      row.reduce((s, x, d) => s + x * way[d], 0),
      0,
    );
  // Following it 40 small steps leans the squares into rhombi with every bar its own length.
  const points = f.points.map((p) => [...p]);
  const lengths = M.lengths(points, f.bars);
  for (let step = 0; step < 40; step++) {
    const v = M.mechanism(points, f.bars, M.held(n), push);
    points.forEach((p, j) => ((p[0] += 0.01 * v[2 * j]), (p[1] += 0.01 * v[2 * j + 1])));
    M.settle(points, f.bars, lengths, M.held(n), 30);
  }
  M.lengths(points, f.bars).forEach((L, k) => close(L, lengths[k], 1e-6));
  assert.ok(points[M.top(n, 0)][0] > 0.3, 'the top has swayed');
  assert.ok(points[M.top(n, 0)][1] < 1 - 0.03, 'and dropped');
  close(points[0][0], 0);
  close(points[0][1], 0);
  close(points[n][1], 0);
  // A rigid frame has no way to give.
  const g = frame(n, M.pattern(n, 'pratt'));
  assert.equal(M.mechanism(g.points, g.bars, M.held(n), push), null);
});

test('frames as whole numbers: switching, named frames, other lengths, and the largest fits below 2³¹', () => {
  const n = 4;
  const pratt = M.pattern(n, 'pratt');
  assert.equal(M.nameOf(n, pratt), 'pratt');
  assert.equal(M.nameOf(n, M.toggle(pratt, 0)), '');
  assert.equal(M.toggle(M.toggle(pratt, 7), 7), pratt);
  assert.ok(M.has(pratt, M.fall(n, 0)) && !M.has(pratt, M.rise(n, 0)));
  for (let m = M.MIN_PANELS; m <= M.MAX_PANELS; m++) {
    assert.equal(M.resize(n, pratt, m), M.pattern(m, 'pratt'));
    assert.equal(M.resize(n, M.pattern(n, 'counted'), m), M.pattern(m, 'counted'));
  }
  // An unnamed frame keeps each panel's diagonals; new panels start as squares.
  const own = M.toggle(M.pattern(n, 'squares'), M.rise(n, 1));
  const longer = M.resize(n, own, 6);
  assert.deepEqual(
    M.barsOf(6, longer).filter((i) => i > 3 * 6),
    [M.rise(6, 1)],
  );
  const every = M.places(M.MAX_PANELS).reduce((m, _, i) => M.toggle(m, i), 0);
  assert.equal(every, 2 ** 31 - 1);
  assert.equal(M.barsOf(M.MAX_PANELS, every).length, 31);
});

test('the road hands the truck to the joints either side of it, and nothing when it is off the bridge', () => {
  const n = 4;
  const at = (x) => [...M.truckLoads(n, x)];
  for (const x of [0, 0.25, 1, 2.6, 4]) close(-at(x).reduce((s, v) => s + v, 0), 1);
  for (const x of [-0.5, 4.2])
    close(
      at(x).reduce((s, v) => s + Math.abs(v), 0),
      0,
    );
  close(at(2.75)[2 * M.top(n, 2) + 1], -0.25);
  close(at(2.75)[2 * M.top(n, 3) + 1], -0.75);
});

test('a falling frame keeps going the way it started, every bar its own length, until it has folded', () => {
  for (const [name, x] of [
    ['squares', 0.3],
    ['counted', 1.5],
  ]) {
    const n = 4;
    const f = frame(n, M.pattern(n, name));
    const points = f.points.map((p) => [...p]);
    const lengths = M.lengths(points, f.bars);
    const push = M.truckLoads(n, x).map((v, d) => v + (d % 2 ? -0.15 : 0.1));
    let going = null,
      moved = 0;
    for (let step = 0; step < 200 && moved < 0.9; step++) {
      going = M.follow(points, f.bars, lengths, M.held(n), push, 0.02, 1, going);
      assert.ok(going, name);
      moved = Math.max(...points.map((p, j) => Math.hypot(p[0] - f.points[j][0], p[1] - f.points[j][1])));
    }
    assert.ok(moved >= 0.9, `${name} folds`);
    M.lengths(points, f.bars).forEach((L, k) => close(L, lengths[k], 1e-3));
    close(points[0][0], 0);
    close(points[0][1], 0);
    close(points[n][1], 0);
  }
  // A rigid frame can't be made to give at all.
  const g = frame(4, M.pattern(4, 'pratt'));
  assert.equal(M.follow(g.points, g.bars, M.lengths(g.points, g.bars), M.held(4), M.truckLoads(4, 2), 0.1), null);
});
