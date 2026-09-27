import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const T = globalThis.Wonderlattice.models.tiles;

/** Settings with every control point pushed somewhere different, but within the limits. */
function bent(seed = 1) {
  const noise = (i) => {
    const x = Math.sin((i + 1) * 12.9898 * seed) * 43758.5453;
    return x - Math.floor(x) - 0.5;
  };
  return Object.fromEntries(
    T.EDGE_KEYS.map((key, f) => [
      key,
      T.encodeEdge([0, 1, 2].map((j) => [noise(f * 6 + j * 2) * 0.3, noise(f * 6 + j * 2 + 1) * 0.7])),
    ]),
  );
}

test('an edge’s three control points pack into one whole number and back', () => {
  const points = [
    [0.12, -0.33],
    [-0.2, 0.45],
    [0, 0],
  ];
  const code = T.encodeEdge(points);
  assert.ok(Number.isSafeInteger(code) && code >= 0 && code <= T.EDGE_MAX);
  assert.deepEqual(T.decodeEdge(code), points);
  assert.deepEqual(T.decodeEdge(T.FLAT), [
    [0, 0],
    [0, 0],
    [0, 0],
  ]);
  // Out-of-range offsets are clamped to the limits.
  assert.deepEqual(
    T.decodeEdge(
      T.encodeEdge([
        [9, -9],
        [0, 0],
        [0, 0],
      ]),
    )[0],
    [0.2, -0.45],
  );
});

const close = (p, q, eps = 1e-6) => Math.abs(p[0] - q[0]) < eps && Math.abs(p[1] - q[1]) < eps;
const sameMap = (m, n) => m.every((v, i) => Math.abs(v - n[i]) < 1e-12);

test('every copied edge runs exactly between its two corners', () => {
  for (const rule of T.RULES) {
    const n = rule.corners.length;
    T.edgeCurves(rule, bent(), 8).forEach((pts, i) => {
      assert.ok(close(pts[0], rule.corners[i]), `${rule.id}: edge ${i} starts at corner ${i}`);
      assert.ok(close(pts.at(-1), rule.corners[(i + 1) % n]), `${rule.id}: edge ${i} ends at corner ${i + 1}`);
    });
  }
});

test('bending the edges never changes the tile’s area', () => {
  for (const rule of T.RULES) {
    const plain = Math.abs(T.area(rule.corners));
    for (const seed of [1, 2, 3]) {
      const a = Math.abs(T.area(T.outline(rule, bent(seed), 40)));
      assert.ok(Math.abs(a - plain) < 1e-3, `${rule.id}: area ${a} vs ${plain}`);
    }
  }
});

test('copies of a bent tile meet edge to edge: every inner edge is shared by exactly two tiles', () => {
  for (const rule of T.RULES) {
    const curves = T.edgeCurves(rule, bent(7), 6);
    const tiles = T.tiling(rule, 3.2);
    assert.ok(tiles.length > 12, `${rule.id}: a patch of tiles (${tiles.length})`);
    // Each placed edge is keyed by its points, in whichever direction sorts first; a partner has the same points.
    // Rounded on a grid shifted by an odd phase, so points on round numbers never sit on a rounding boundary.
    const grid = (v) => Math.round(v * 1e5 + 0.37);
    const key = (pts) => pts.map(([x, y]) => `${grid(x)},${grid(y)}`).join(' ');
    const placedKey = (map, pts) => {
      const placed = pts.map((p) => T.apply(map, p));
      const k = key(placed),
        back = key([...placed].reverse());
      return k < back ? k : back;
    };
    const count = new Map();
    for (const { map } of tiles)
      for (const pts of curves) {
        const k = placedKey(map, pts);
        count.set(k, (count.get(k) ?? 0) + 1);
      }
    // Tiles near the middle of the patch have all their neighbours, so each of their edges is shared exactly twice.
    const centre = T.centroid(rule.corners);
    let checked = 0;
    for (const { map } of tiles) {
      const [x, y] = T.apply(map, centre);
      if (Math.hypot(x - centre[0], y - centre[1]) > 1.2) continue;
      for (const pts of curves)
        assert.equal(count.get(placedKey(map, pts)), 2, `${rule.id}: an edge shared by two tiles`);
      checked++;
    }
    assert.ok(checked >= 3, `${rule.id}: checked ${checked} inner tiles`);
  }
});

test('neighbouring tiles never share a colour', () => {
  for (const rule of T.RULES) {
    const tiles = T.tiling(rule, 3);
    for (const tile of tiles)
      for (const move of rule.generators.flatMap((g) => [g, T.invert(g)]))
        assert.notEqual(T.colourOf(rule, T.compose(tile.map, move)), tile.colour, `${rule.id}: neighbours differ`);
    assert.ok(tiles.every((t) => t.colour >= 0 && t.colour < rule.colours));
  }
});

test('dragging a handle, on its own edge or on the copy, moves that dot there and no other', () => {
  for (const rule of T.RULES) {
    const s = bent(3);
    for (const h of T.handles(rule, s)) {
      const target = [h.point[0] + 0.03, h.point[1] - 0.05];
      const next = { ...s, ...T.moveHandle(rule, s, h, target) };
      const moved = T.handles(rule, next).find(
        (g) => g.free === h.free && g.spot === h.spot && g.copy === h.copy && (!h.copy || sameMap(g.map, h.map)),
      );
      // Dots move in steps of 0.01 edge lengths, so they land within a step of the target.
      assert.ok(close(moved.point, target, 0.012), `${rule.id}: handle lands where it was dragged`);
      T.offsets(next, h.free).forEach((o, j) => {
        if (j !== h.spot) assert.deepEqual(o, T.offsets(s, h.free)[j], `${rule.id}: the other dots stay put`);
      });
    }
  }
});

test('control points stay within their limits however far they are dragged', () => {
  const rule = T.RULES[0];
  const h = T.handles(rule, {})[0];
  const next = T.moveHandle(rule, {}, h, [5, -5]);
  for (const [along, across] of T.offsets(next, h.free)) {
    assert.ok(Math.abs(along) <= T.LIMITS.along + 1e-9);
    assert.ok(Math.abs(across) <= T.LIMITS.across + 1e-9);
  }
});
