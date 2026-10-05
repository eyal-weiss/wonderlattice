import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.rollers;
const near = (actual, expected, tolerance, message) =>
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${message}: ${actual} is not within ${tolerance} of ${expected}`,
  );
const TAU = 2 * Math.PI;

// Reference numbers from an independent Python script (not this model): each Reuleaux polygon built as the
// intersection of discs of radius 1 centred at the corners of a regular polygon, its rim found by bisection along
// 200,000 rays, and the drill's path painted on a 1,200 × 1,200 grid at 2,400 angles.
const reference = {
  3: { area: 0.704771, circumradius: 0.57735, bob: 0.154701, drill: 0.98766 },
  5: { area: 0.758497, circumradius: 0.525731, bob: 0.051462, drill: 0.87931 },
};

/** Every shape the room can show, sharp and rounded. */
const ALL = (() => {
  const all = [['circle', M.circle()]];
  for (const corner of [0, 0.15, 0.4]) {
    all.push([`triangle, corner ${corner}`, M.reuleaux(3, corner)]);
    all.push([`pentagon, corner ${corner}`, M.reuleaux(5, corner)]);
    for (const lines of [3, 4, 5, 7])
      for (const seed of [1, 7, 42, 999])
        all.push([`lopsided ${seed}/${lines}, corner ${corner}`, M.lopsided(seed, lines, corner)]);
  }
  return all;
})();
const shapes = () => ALL;

test('rollers: every shape has the same width in every direction', () => {
  for (const [name, s] of shapes()) {
    const rim = M.outline(s, 0.008);
    let lo = Infinity,
      hi = -Infinity;
    for (let i = 0; i < 240; i++) {
      // Measured from the drawn rim, not from the support function: the spread of its points along each direction.
      const theta = (i / 240) * Math.PI,
        c = Math.cos(theta),
        sn = Math.sin(theta);
      let a = Infinity,
        b = -Infinity;
      for (const [x, y] of rim) {
        a = Math.min(a, x * c + y * sn);
        b = Math.max(b, x * c + y * sn);
      }
      lo = Math.min(lo, b - a);
      hi = Math.max(hi, b - a);
      near(M.width(s, theta), 1, 1e-9, `${name}: support width at ${theta}`);
    }
    near(lo, 1, 2e-5, `${name}: narrowest`);
    near(hi, 1, 2e-5, `${name}: widest`);
  }
});

test('rollers: every rim is π times the width long (Barbier)', () => {
  for (const [name, s] of shapes()) {
    near(M.perimeter(s), Math.PI, 1e-9, `${name}: arcs`);
    // Measured again as many short straight pieces round the drawn rim.
    const points = M.outline(s, 0.001);
    let length = 0;
    for (let i = 0; i < points.length; i++) {
      const [x0, y0] = points[i],
        [x1, y1] = points[(i + 1) % points.length];
      length += Math.hypot(x1 - x0, y1 - y0);
    }
    near(length, Math.PI, 1e-5, `${name}: measured round the rim`);
    // Rolled once round, a shape travels its own rim's length.
    near(M.roll(s, TAU).x, Math.PI, 1e-9, `${name}: one turn`);
  }
});

test('rollers: the triangle has the least area, the circle the most (Blaschke–Lebesgue)', () => {
  near(M.area(M.reuleaux(3)), reference[3].area, 1e-6, 'triangle');
  near(M.area(M.reuleaux(3)), (Math.PI - Math.sqrt(3)) / 2, 1e-9, 'triangle, by formula');
  near(M.area(M.reuleaux(5)), reference[5].area, 1e-6, 'pentagon');
  near(M.area(M.circle()), Math.PI / 4, 1e-12, 'circle');
  for (const [name, s] of shapes()) {
    assert.ok(M.area(s) >= (Math.PI - Math.sqrt(3)) / 2 - 1e-9, `${name}: at least the triangle's area`);
    assert.ok(M.area(s) <= Math.PI / 4 + 1e-9, `${name}: at most the circle's area`);
  }
});

test('rollers: a plank on rollers stays level, while an axle at the centre bobs', () => {
  near(M.bob(M.reuleaux(3)), reference[3].bob, 1e-6, 'triangle bob');
  near(M.bob(M.reuleaux(3)), 2 / Math.sqrt(3) - 1, 1e-9, 'triangle bob, by formula');
  near(M.bob(M.reuleaux(5)), reference[5].bob, 1e-6, 'pentagon bob');
  near(M.reuleaux(3).radius, reference[3].circumradius, 1e-6, 'triangle circumradius');
  near(M.bob(M.circle()), 0, 1e-12, 'a circle doesn’t bob');
  for (const [name, s] of shapes()) {
    let lo = Infinity,
      hi = -Infinity;
    for (let i = 0; i <= 600; i++) {
      const psi = (i / 600) * TAU,
        at = M.roll(s, psi);
      // The shape's own points, turned as it is now: the one touching the ground and the one touching the plank.
      const turned = ([x, y]) => [
        x * Math.cos(at.turn) - y * Math.sin(at.turn),
        x * Math.sin(at.turn) + y * Math.cos(at.turn),
      ];
      const top = turned(M.point(s, Math.PI / 2 + psi)),
        bottom = turned(M.point(s, -Math.PI / 2 + psi));
      // The bottom one is on the ground, and the top one exactly 1 above it: the plank's height never changes.
      near(at.y + bottom[1], 0, 1e-9, `${name}: on the ground at ${psi}`);
      near(top[1] - bottom[1], 1, 1e-9, `${name}: plank height at ${psi}`);
      near(top[0], bottom[0], 1e-9, `${name}: contacts in line at ${psi}`);
      near(at.contact, at.x + bottom[0], 1e-9, `${name}: contact on the ground at ${psi}`);
      lo = Math.min(lo, at.y);
      hi = Math.max(hi, at.y);
    }
    // The centre's height swings between the inner and outer circle: the bob of a wheel on that axle.
    near(hi - lo, M.bob(s), 2e-4, `${name}: the centre bobs`);
    near(lo + hi, 1, 2e-4, `${name}: inner and outer circles share the centre`);
  }
});

test('rollers: the centre moves at the rate of its height, and never backwards', () => {
  for (const [name, s] of shapes().slice(0, 12)) {
    let last = M.roll(s, 0).x;
    for (let i = 1; i <= 2000; i++) {
      const psi = (i / 2000) * 2 * TAU,
        x = M.roll(s, psi).x;
      // Over a small turn dψ, the centre moves forward by its height times dψ (it turns about the point of contact).
      const dpsi = (2 * TAU) / 2000;
      near(x - last, M.roll(s, psi - dpsi / 2).y * dpsi, 1e-5, `${name}: speed at ${psi}`);
      assert.ok(x > last, `${name}: forwards at ${psi}`);
      last = x;
    }
  }
});

test('rollers: rollers spaced by spacing() never touch, however they are turned', () => {
  for (const [name, s] of shapes()) {
    const gap = M.spacing(s);
    // Two neighbours, turned differently, roll together for a whole turn.
    for (const offset of [0.4, 1.3, 2.9, 4.4]) {
      for (let i = 0; i < 240; i++) {
        // At the steady pace the two are `gap` apart; each drifts ahead of it or behind by its own amount.
        const psi = (i / 240) * TAU;
        const apart = gap + M.drift(s, psi + offset) - M.drift(s, psi);
        assert.ok(apart >= 2 * s.radius + 0.05, `${name}: centres ${apart} apart at ${psi}`);
      }
    }
  }
});

test('rollers: the triangle drills 98.8% of a square, the pentagon less, and a circle π/4', () => {
  near(M.TRIANGLE_DRILL, 0.98770039, 1e-8, 'the formula');
  const triangle = M.coverage(M.reuleaux(3), 1, 600);
  near(triangle, M.TRIANGLE_DRILL, 0.0001, 'triangle');
  near(triangle, reference[3].drill, 0.0002, 'triangle, against the Python grid');
  near(M.coverage(M.reuleaux(5), 2, 600), reference[5].drill, 0.0003, 'pentagon');
  near(M.coverage(M.circle(), 0, 600), Math.PI / 4, 0.0001, 'circle');
  // The room's own measure, on fewer rows, reads the same to one decimal place.
  assert.equal((M.coverage(M.reuleaux(3), 1, 240) * 100).toFixed(1), '98.8');
  assert.equal((M.coverage(M.reuleaux(5), 2, 240) * 100).toFixed(1), '87.9');
  assert.equal((M.coverage(M.circle(), 0, 240) * 100).toFixed(1), '78.5');
  // Turning in the square, every shape touches all four sides.
  for (const [name, s] of shapes().slice(0, 20))
    for (let i = 0; i < 45; i++) {
      const phi = (i / 45) * TAU,
        poly = M.placed(s, phi, M.outline(s, 0.004));
      const xs = poly.map((p) => p[0]),
        ys = poly.map((p) => p[1]);
      for (const [edge, value] of [
        ['right', Math.max(...xs)],
        ['left', -Math.min(...xs)],
        ['top', Math.max(...ys)],
        ['bottom', -Math.min(...ys)],
      ])
        near(value, 0.5, 4e-6, `${name}, turned ${phi}: touches the ${edge} side`);
    }
});

test('rollers: a lopsided shape is the same for the same seed, and lopsided enough to see', () => {
  const a = M.lopsided(7, 5),
    b = M.lopsided(7, 5),
    c = M.lopsided(8, 5);
  assert.deepEqual(a.arcs, b.arcs);
  assert.notDeepEqual(a.arcs, c.arcs);
  for (let seed = 1; seed < 60; seed++) assert.ok(M.bob(M.lopsided(seed, 4)) > 0.06, `seed ${seed}`);
  // Built from lines, each arc is centred where two neighbouring lines cross, and the radii of the two arcs about
  // each crossing add up to the width.
  const n = a.arcs.length / 2;
  for (let k = 0; k < n; k++) {
    assert.equal(a.arcs[k].cx, a.arcs[k + n].cx);
    near(a.arcs[k].r + a.arcs[k + n].r, 1, 1e-12, `arc ${k}`);
  }
  // Rounded corners: the smallest radius is the share asked for.
  near(Math.min(...M.lopsided(7, 5, 0.25).arcs.map((x) => x.r)), 0.25, 1e-12, 'rounded');
});
