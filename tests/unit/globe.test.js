import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const G = globalThis.Wonderlattice.models.globe;
const deg = (x) => x / G.DEG;
const near = (actual, expected, tolerance, message) =>
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${message}: ${actual} is not within ${tolerance} of ${expected}`,
  );
const tri = (...corners) => corners.map(([lat, lon]) => G.vec(lat, lon));

// Reference numbers from an independent script (not this model): angles by the spherical law of cosines, area by
// L'Huilier's theorem, and the arrow's turn by integrating parallel transport, dV/ds = −(V · P′) P, with RK4.
const checked = [
  {
    name: 'octant',
    corners: [
      [90, 0],
      [0, 0],
      [0, 90],
    ],
    angles: [90, 90, 90],
    excess: 90,
    share: 0.125,
  },
  {
    name: 'tetrahedron face',
    corners: [
      [35.26438968275466, 45],
      [-35.26438968275466, -45],
      [-35.26438968275466, 135],
    ],
    angles: [120, 120, 120],
    excess: 180,
    share: 0.25,
  },
  {
    name: 'scalene',
    corners: [
      [10, 20],
      [50, -30],
      [-20, -60],
    ],
    angles: [75.730643, 92.798191, 57.678323],
    excess: 46.207157,
    share: 0.064177,
  },
  {
    name: 'thin',
    corners: [
      [0, 0],
      [1, 1],
      [0.5, 3],
    ],
    angles: [35.537559, 120.981468, 23.50279],
    excess: 0.021816,
    share: 0.00003,
  },
  {
    name: 'big',
    corners: [
      [-30, 0],
      [-30, 120],
      [40, 240],
    ],
    angles: [167.936069, 167.936069, 164.107682],
    excess: 319.97982,
    share: 0.444416,
  },
];

test('angles, area and the arrow’s turn match the independent reference numbers', () => {
  for (const c of checked) {
    const t = tri(...c.corners);
    G.angles(t).forEach((a, i) => near(deg(a), c.angles[i], 1e-5, `${c.name} angle ${i}`));
    near(deg(G.excess(t)), c.excess, 1e-5, `${c.name} excess`);
    near(deg(G.area(t)), c.excess, 1e-5, `${c.name} area`);
    near(G.share(t), c.share, 1e-6, `${c.name} share`);
    const w = G.walk(t);
    near(deg(w.turned), c.excess, 1e-5, `${c.name} turn from the corners`);
    near(deg(G.homeTurn(w)), c.excess, 1e-5, `${c.name} turn of the carried arrow`);
  }
});

test('the pole-to-equator triangle has three right angles, covers an eighth of the ball, and turns the arrow 90°', () => {
  const t = tri([90, 0], [0, 0], [0, 90]);
  for (const a of G.angles(t)) near(deg(a), 90, 1e-9, 'right angle');
  near(deg(G.excess(t)), 90, 1e-9, 'excess');
  near(G.share(t), 1 / 8, 1e-12, 'an eighth');
  near(deg(G.homeTurn(G.walk(t))), 90, 1e-9, 'turn');
  // The walk leaves from the pole along the middle of its angle, into the triangle, and comes home at 45° + 90°.
  const w = G.walk(t);
  const first = G.arrowAt(w, 0).arrow;
  near(G.dot(first, G.unit([1, 1, 0])), 1, 1e-9, 'starts between the two sides');
  near(G.dot(G.arrowAt(w, w.perimeter).arrow, G.unit([-1, 1, 0])), 1, 1e-9, 'comes home turned left by 90°');
});

test('Girard: for random triangles the extra always equals the area, and the arrow turns by it', () => {
  let seed = 11;
  const rand = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
  let tried = 0;
  while (tried < 500) {
    const t = [0, 1, 2].map(() => G.vec(deg(Math.asin(2 * rand() - 1)), 360 * rand() - 180));
    if (!G.usable(t, 2 * G.DEG)) continue;
    tried++;
    const e = G.excess(t);
    assert.ok(e > 0 && e < 2 * Math.PI, 'the extra lies between 0 and 360°');
    near(G.area(t), e, 1e-9, 'area = extra');
    const w = G.walk(t);
    near(w.turned, e, 1e-9, 'turn from the corners');
    near(G.homeTurn(w), e, 1e-7, 'turn of the carried arrow');
  }
});

test('walking the corners in either order gives the same triangle, always with it on the left', () => {
  const t = tri([10, 20], [50, -30], [-20, -60]);
  const back = [t[0], t[2], t[1]];
  assert.equal(G.orientation(t), -G.orientation(back));
  near(G.excess(back), G.excess(t), 1e-12, 'same extra');
  assert.deepEqual(G.walk(t).order.slice().sort(), [0, 1, 2]);
  for (const w of [G.walk(t), G.walk(back)]) assert.equal(G.orientation(w.corners), 1);
});

test('along a side the arrow keeps its angle to the path and never leaves the ball', () => {
  const w = G.walk(tri([10, 20], [50, -30], [-20, -60]));
  for (let i = 0; i <= 200; i++) {
    const s = (w.perimeter * i) / 200;
    const { position, way, arrow, leg } = G.arrowAt(w, s);
    near(G.dot(position, position), 1, 1e-12, 'on the ball');
    near(G.dot(arrow, position), 0, 1e-12, 'touching the ball');
    near(G.dot(way, position), 0, 1e-12, 'heading along the ball');
    near(G.turn(position, way, arrow), w.legs[leg].phi, 1e-9, 'same angle to the path');
  }
});

test('shrinking a triangle makes its extra vanish, like the square of its size', () => {
  const t = tri([90, 0], [0, 0], [0, 90]);
  // An equilateral triangle about a centre, from the independent script: circumradius → extra.
  const reference = [
    [1, 0.022675],
    [2, 0.090722],
    [10, 2.287531],
    [30, 22.140405],
    [80, 259.562535],
  ];
  for (const [r, extra] of reference) {
    const small = G.resize(t, r * G.DEG);
    near(deg(G.circle(small).radius), r, 1e-9, 'new size');
    near(deg(G.excess(small)), extra, 1e-5, `extra at radius ${r}°`);
  }
  const c = G.circle(t);
  near(deg(c.radius), 54.7356103172, 1e-8, 'the octant’s corners sit 54.7° from its centre');
  near(G.dot(c.centre, G.unit([1, 1, 1])), 1, 1e-12, 'centre in the middle');
});

test('travelling and turning stay on the ball', () => {
  const north = G.vec(90, 0),
    east = [0, 1, 0];
  const there = G.travel(north, [1, 0, 0], Math.PI / 2);
  near(G.dot(there, G.vec(0, 0)), 1, 1e-12, 'a quarter turn from the pole reaches the equator');
  // Facing along longitude 0 at the pole, a quarter turn anticlockwise (seen from outside) faces longitude 90°.
  near(G.dot(G.rotate(north, [1, 0, 0], Math.PI / 2), east), 1, 1e-12, 'turned left');
});

test('latitude and longitude go there and back', () => {
  for (const [lat, lon] of [
    [0, 0],
    [45, 90],
    [-30, -150],
    [89.5, 179],
  ]) {
    const [la, lo] = G.latLon(G.vec(lat, lon));
    near(la, lat, 1e-9, 'latitude');
    near(lo, lon, 1e-9, 'longitude');
  }
  assert.deepEqual(G.latLon(G.vec(90, 0)), [90, 0]);
});

test('corners too close together, or opposite, are refused', () => {
  assert.equal(G.usable(tri([0, 0], [0, 0.1], [10, 5])), false);
  assert.equal(G.usable(tri([0, 0], [0, 180], [10, 5])), false);
  assert.equal(G.usable(tri([90, 0], [0, 0], [0, 90])), true);
});

test('rounded angles always add up to the rounded sum', () => {
  // Each rounded alone, 60.04° shows as 60.0°, and three of them would seem to make 180.0°, not 180.1°.
  const even = G.roundParts([60.04, 60.04, 60.04], 1);
  assert.equal(even.total, 180.1);
  assert.deepEqual(even.parts.slice().sort(), [60, 60, 60.1]);
  assert.deepEqual(G.roundParts([90, 90, 90], 0), { parts: [90, 90, 90], total: 270 });
  let seed = 3;
  const rand = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
  for (let i = 0; i < 300; i++) {
    const values = [rand() * 170, rand() * 170, rand() * 170];
    for (const digits of [0, 1, 2]) {
      const { parts, total } = G.roundParts(values, digits);
      near(
        parts.reduce((a, b) => a + b, 0),
        total,
        1e-9,
        'parts add up',
      );
      parts.forEach((p, j) => assert.ok(Math.abs(p - values[j]) < 10 ** -digits, 'each part within one step'));
    }
  }
});
