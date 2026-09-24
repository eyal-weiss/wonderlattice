import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const P = globalThis.Wonderloom.models.plane;
const { FUNCTIONS, add, sub, abs } = P;
const near = (a, b, tol, message) => assert.ok(abs(sub(a, b)) < tol, `${message}: ${a} vs ${b}`);

// A spread of test points, kept away from each map's poles.
const POINTS = [
  [0.7, 0.4],
  [-1.1, 0.25],
  [0.3, -1.3],
  [-0.6, -0.8],
  [1.4, 1.1],
  [0.05, 0.9],
];

test('every derivative matches numeric differentiation', () => {
  for (const fn of FUNCTIONS)
    for (const z of POINTS) {
      const exact = fn.df(z),
        numeric = P.numericDerivative(fn.f, z);
      near(exact, numeric, 1e-6 * Math.max(1, abs(exact)), `${fn.id} at ${z}`);
    }
});

test('the blends are analytic too: their derivatives match numeric differentiation', () => {
  for (let i = 0; i < FUNCTIONS.length; i++)
    for (const t of [0, 0.3, 0.75, 1]) {
      const { f, df } = P.blend(i, t);
      for (const z of POINTS) near(df(z), P.numericDerivative(f, z), 1e-6 * Math.max(1, abs(df(z))), `${i} t=${t}`);
    }
  // At t = 0 the blend is the identity.
  const { f } = P.blend(0, 0);
  near(f([0.4, -0.2]), [0.4, -0.2], 1e-12, 'identity');
});

test('conformal: two short perpendicular arrows stay perpendicular wherever f′ ≠ 0', () => {
  for (const fn of FUNCTIONS)
    for (const z of POINTS) {
      assert.ok(abs(fn.df(z)) > 0.05, `${fn.id} is not critical at ${z}`);
      const angle = P.imageAngle(fn.f, z, [1, 0], [0, 1], 1e-5);
      assert.ok(Math.abs(angle - Math.PI / 2) < 1e-3, `${fn.id} at ${z}: ${angle}`);
      // Any other angle is kept too, not only right angles.
      const other = P.imageAngle(fn.f, z, [1, 0], P.polar(1, 0.6), 1e-5);
      assert.ok(Math.abs(other - 0.6) < 1e-3, `${fn.id} keeps 0.6 rad at ${z}: ${other}`);
    }
});

test('where f′ = 0 angles are not kept: z² doubles them at 0', () => {
  const square = FUNCTIONS[0];
  assert.equal(abs(square.df([0, 0])), 0);
  // The right angle between 1 and i becomes a straight angle.
  assert.ok(Math.abs(P.imageAngle(square.f, [0, 0], [1, 0], [0, 1], 0.1) - Math.PI) < 1e-9);
  // 30° becomes 60°.
  assert.ok(Math.abs(P.imageAngle(square.f, [0, 0], [1, 0], P.polar(1, Math.PI / 6), 0.1) - Math.PI / 3) < 1e-9);
  // Every map's listed critical points really have f′ = 0.
  for (const fn of FUNCTIONS) for (const c of fn.critical) assert.ok(abs(fn.df(c)) < 1e-12, `${fn.id} at ${c}`);
});

test('1/z sends circles through 0 to straight lines, and the line x = 1 to a circle', () => {
  const invert = FUNCTIONS[1];
  // The circle |z − 1/2| = 1/2 passes through 0; its image is the line Re w = 1.
  for (let k = 0; k < 40; k++) {
    const z = P.circle([0.5, 0], 0.5)((k + 0.5) / 40); // (t = 1/2 is the point 0 itself)
    assert.ok(Math.abs(invert.f(z)[0] - 1) < 1e-9, `on the line Re w = 1: ${invert.f(z)}`);
  }
  // Any circle through 0, centre c, goes to the straight line Re(c·w) = 1/2.
  const c = [0.3, 0.7];
  for (let k = 1; k < 40; k++) {
    const angle = Math.atan2(c[1], c[0]) + Math.PI + (2 * Math.PI * k) / 40;
    const w = invert.f(add(c, P.polar(abs(c), angle)));
    assert.ok(Math.abs(P.mul(c, w)[0] - 0.5) < 1e-9, `on the line: ${w}`);
  }
  // And the line x = 1 goes to the circle |w − 1/2| = 1/2.
  for (const y of [-5, -1, 0, 0.3, 2, 30]) assert.ok(Math.abs(abs(sub(invert.f([1, y]), [0.5, 0])) - 0.5) < 1e-9);
});

test('Joukowski sends the unit circle to the segment [−2, 2], and the wing circle to a closed wing', () => {
  const jk = FUNCTIONS[P.JOUKOWSKI];
  for (let k = 0; k <= 64; k++) {
    const w = jk.f(P.polar(1, (2 * Math.PI * k) / 64));
    assert.ok(Math.abs(w[1]) < 1e-12 && w[0] >= -2 - 1e-12 && w[0] <= 2 + 1e-12, `${w}`);
  }
  // The circle through z = 1 has a sharp trailing edge at w = 2, and is otherwise inside −2.5 < Re w < 2.
  const { c, r } = P.wingCircle(0.12, 0.1);
  near(jk.f(P.circle(c, r)(0.0 - Math.atan2(0.1, 1.12) / (2 * Math.PI) + 1)), [2, 0], 1e-9, 'trailing edge');
  let top = -Infinity;
  for (let k = 0; k < 360; k++) {
    const w = jk.f(P.circle(c, r)(k / 360));
    assert.ok(w[0] < 2 + 1e-9 && w[0] > -2.5);
    top = Math.max(top, w[1]);
  }
  assert.ok(top > 0.3, `a cambered wing arches upwards: ${top}`);
});

test('the wing flow meets the Kutta condition: it comes to rest at the trailing edge', () => {
  for (const [thick, camber] of [
    [0.12, 0.1],
    [0.05, 0.2],
    [0.2, -0.1],
  ]) {
    const v = P.wingVelocity(thick, camber);
    assert.ok(abs(v([1, 0])) < 1e-12, 'no flow at z = 1');
    // Far away the flow is uniform, left to right.
    near(v([60, 45]), [1, 0], 0.02, 'uniform far away');
    // And the circle is a streamline: the velocity there is tangent to it.
    const { c, r } = P.wingCircle(thick, camber);
    for (let k = 0; k < 12; k++) {
      const z = P.circle(c, r)(k / 12),
        u = P.conj(v(z)),
        radial = sub(z, c);
      assert.ok(Math.abs(u[0] * radial[0] + u[1] * radial[1]) < 1e-9, 'tangent to the circle');
    }
  }
  const lines = P.wingStreamlines(0.12, 0.1);
  assert.equal(lines.length, 13);
  for (const line of lines) {
    assert.ok(line.points.length > 20);
    const { c, r } = P.wingCircle(0.12, 0.1);
    for (const z of line.points) assert.ok(abs(sub(z, c)) >= r, 'streamlines stay outside the circle');
  }
});

test('sampling breaks lines at poles and keeps images smooth', () => {
  const invert = FUNCTIONS[1];
  // The real axis through the pole at 0 maps to two pieces running off to infinity.
  const pieces = P.sampleCurve(invert.f, P.segment([-2, 0], [2, 0]), { n: 100, maxStep: 0.02, limit: 40 });
  assert.equal(pieces.length, 2);
  for (const piece of pieces)
    for (let i = 1; i < piece.length; i++) assert.ok(abs(sub(piece[i], piece[i - 1])) <= 0.5 + 1e-9);
  // Without a pole the image comes back in one piece, with every step short.
  const [one, ...rest] = P.sampleCurve(FUNCTIONS[0].f, P.segment([-1.5, 0.5], [1.5, 0.5]), { maxStep: 0.02 });
  assert.equal(rest.length, 0);
  for (let i = 1; i < one.length; i++) assert.ok(abs(sub(one[i], one[i - 1])) <= 0.02 + 1e-9);
  // Joukowski on a grid line through 0 splits there too.
  assert.equal(P.sampleCurve(FUNCTIONS[P.JOUKOWSKI].f, P.segment([0, -2], [0, 2]), {}).length, 2);
});

test('every picture draws for every map, and grids fill the frame', () => {
  for (let i = 0; i < FUNCTIONS.length; i++)
    for (const name of P.PICTURES) {
      const strokes = P.picture(name, i);
      assert.ok(strokes.length > 0, `${name} for ${FUNCTIONS[i].id}`);
      for (const s of strokes) assert.ok(P.finite(s.at(0)) && P.finite(s.at(1)));
    }
  const grid = P.picture('grid', 0);
  assert.equal(grid.filter((s) => s.family === 'x').length, 13);
  assert.equal(grid.filter((s) => s.family === 'y').length, 13);
  // A closed polyline returns to its start.
  const square = P.polyline(
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ],
    true,
  );
  near(square(0), square(1), 1e-12, 'closed');
  near(square(0.5), [1, 1], 1e-12, 'halfway round');
  near(add(square(0.125), [0, 0]), [0.5, 0], 1e-12, 'an eighth of the way');
});
