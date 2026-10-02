import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.wheels;
const near = (actual, expected, tolerance, message) =>
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${message}: ${actual} is not within ${tolerance} of ${expected}`,
  );
const DEG = Math.PI / 180;

// Reference numbers from an independent Python script (not this model): roads integrated with the trapezium rule on
// a fine grid, and crashes found by checking every road point near the wheel at 720 to 2,400 positions of the axle.
// Regular wheels have their corners 1 from the axle.
const regular = {
  3: { period: 1.316958, bump: 0.5 },
  4: { period: 1.24645, bump: 0.292893 },
  5: { period: 1.091001, bump: 0.190983 },
  6: { period: 0.951426, bump: 0.133975 },
  7: { period: 0.837309, bump: 0.099031 },
  8: { period: 0.745016, bump: 0.07612 },
  12: { period: 0.511636, bump: 0.034074 },
};

test('wheels: a regular wheel’s bumps are as far apart and as tall as the independent check says', () => {
  for (const [n, ref] of Object.entries(regular)) {
    const road = M.road(M.polygon(Number(n)));
    near(road.period, ref.period, 1e-6, `${n} sides: road period`);
    near(M.bumps(Number(n)).period, ref.period, 1e-6, `${n} sides: closed form`);
    near(M.bumps(Number(n)).height, ref.bump, 1e-6, `${n} sides: bump height`);
    // The road's top is the middle of a side (a from the axle), its dips a corner (1 from the axle).
    near(Math.max(...road.y) - Math.min(...road.y), ref.bump, 1e-6, `${n} sides: the road's own bumps`);
  }
  assert.ok(M.bumps(6).height < M.bumps(4).height, 'hexagon bumps are shallower than square ones');
});

test('wheels: the square’s road is an upside-down catenary, y = −a cosh(x / a)', () => {
  const road = M.road(M.polygon(4));
  const a = Math.SQRT1_2,
    half = a * Math.asinh(1);
  let worst = 0;
  for (let i = 0; i < road.x.length; i++) {
    // Measured from the top of the nearest bump.
    const x = road.x[i] > half ? road.x[i] - road.period : road.x[i];
    worst = Math.max(worst, Math.abs(road.y[i] - M.catenary(a, x)));
  }
  assert.ok(worst < 1e-7, `largest gap from the catenary: ${worst}`);
  near(half, 0.623225, 1e-6, 'each side rolls over a bump this far either side of its top (MathWorld: sinh⁻¹ 1 × a)');
});

test('wheels: the axle stays level, with the point of contact straight below it on the road', () => {
  for (const wheel of [M.polygon(4), M.polygon(7), M.drawn(M.shapes.heart), M.drawn(M.shapes.egg)]) {
    const road = M.road(wheel);
    for (let k = 0; k < 97; k++) {
      const X = (k / 37) * road.period - 0.3 * road.period;
      const place = M.at(road, X);
      // The rim point θ, with the wheel turned by α, is straight below the axle (at x = X, y = 0) …
      const r = wheel.radius(place.theta);
      near(r * Math.cos(place.theta + place.alpha), 0, 1e-9, `${wheel.kind} at ${X}: contact below the axle`);
      near(r * Math.sin(place.theta + place.alpha), -r, 1e-9, `${wheel.kind} at ${X}: contact straight down`);
      // … and it is on the road.
      near(M.height(road, X), -r, 2e-4, `${wheel.kind} at ${X}: contact on the road`);
      // Going back from the contact point finds the same place along the road.
      near(M.along(road, place.theta), X, 1e-6, `${wheel.kind} at ${X}: along() undoes at()`);
    }
  }
});

test('wheels: the road is exactly as long as the rim that rolls onto it (no slipping)', () => {
  for (const wheel of [M.polygon(4), M.polygon(5), M.drawn(M.shapes.heart), M.drawn(M.shapes.flower)]) {
    const road = M.road(wheel);
    let roadLength = 0;
    for (let i = 1; i < road.x.length; i++)
      roadLength += Math.hypot(road.x[i] - road.x[i - 1], road.y[i] - road.y[i - 1]);
    // The rim from the same start, measured separately with many short straight pieces.
    let rim = 0;
    const pieces = 200000;
    for (let k = 1; k <= pieces; k++) {
      const a = road.start + ((k - 1) / pieces) * road.turn,
        b = road.start + (k / pieces) * road.turn;
      const ra = wheel.radius(a),
        rb = wheel.radius(b);
      rim += Math.hypot(rb * Math.cos(b) - ra * Math.cos(a), rb * Math.sin(b) - ra * Math.sin(a));
    }
    near(roadLength, rim, 2e-4 * rim, `${wheel.kind}: road and rim lengths`);
  }
  // A square's side is √2 long, and so is each bump.
  const square = M.road(M.polygon(4));
  let bump = 0;
  for (let i = 1; i < square.x.length; i++)
    bump += Math.hypot(square.x[i] - square.x[i - 1], square.y[i] - square.y[i - 1]);
  near(bump, Math.SQRT2, 1e-5, 'one bump of the square’s road');
});

test('wheels: the triangle’s corner cuts into the next bump; wheels with 4 to 12 sides clear their roads', () => {
  const triangle = M.road(M.polygon(3));
  const crash = M.crashes(triangle);
  // Independent check: at most 0.03174 of the radius deep, for 67% of the way along the road.
  near(crash.deepest, 0.03174, 0.0003, 'deepest cut');
  near(crash.share, 0.673, 0.012, 'share of the way crashing');
  // From the middle of a side (contact at θ = −90°), the corner ahead starts cutting in 20.2° later.
  const along = (degrees) => M.along(triangle, triangle.start + degrees * DEG);
  assert.equal(M.overlap(triangle, along(15)).depth, 0, 'no crash yet with the contact 15° along the side');
  const cut = M.overlap(triangle, along(30));
  assert.ok(cut.depth > 0.01, 'crashing with the contact 30° along');
  // The place it cuts is past the dip (half a bump along), and low: the corner, digging into the next bump.
  assert.ok(along(30) + cut.x > triangle.period / 2 && cut.y < -0.8, `cut at ${cut.x}, ${cut.y}`);
  for (let n = 4; n <= 12; n++) assert.equal(M.crashes(M.road(M.polygon(n))).deepest, 0, `${n} sides`);
});

test('wheels: on a flat road the axle bobs by exactly the height of the bumps it would need', () => {
  for (const [n, ref] of Object.entries(regular)) {
    const flat = M.flat(M.polygon(Number(n)));
    near(flat.bob, ref.bump, 1e-6, `${n} sides: bob`);
    near(flat.period, 2 * Math.sin(Math.PI / Number(n)), 1e-5, `${n} sides: one side rolled per corner`);
    near(flat.high, 1, 1e-9, `${n} sides: highest on a corner`);
  }
  const square = M.flat(M.polygon(4));
  for (const X of [0.1, 0.5, 1.3, 2.9]) {
    const place = M.flatAt(square, X);
    near(M.flatAlong(square, place.alpha), X, 1e-6, `flatAlong() undoes flatAt() at ${X}`);
  }
  // A round wheel needs a flat road, and on one its axle doesn't bob at all.
  const circle = M.drawn(M.shapes.circle);
  const road = M.road(circle);
  assert.ok(
    road.y.every((y) => Math.abs(y + 0.8) < 1e-12),
    'the circle’s road is flat',
  );
  near(road.period, 2 * Math.PI * 0.8, 1e-9, 'one turn lays down the circumference');
  near(M.flat(circle).bob, 0, 1e-4, 'no bob (the rim is measured at 360 points)');
});

test('wheels: drawn wheels pass through their dots, stay away from the axle, and crash as the check found', () => {
  const heart = M.drawn(M.shapes.heart);
  M.shapes.heart.forEach((r, k) => near(heart.radius((k * 2 * Math.PI) / M.SPOKES), r, 1e-12, `dot ${k}`));
  // Even with dots alternating between nearest and farthest, the rim keeps clear of the axle.
  const spiky = M.drawn([1, 0.3, 0.3, 1, 0.3, 0.3, 1, 0.3, 0.3, 1, 0.3, 0.3]);
  let closest = Infinity;
  for (let k = 0; k < 3600; k++) closest = Math.min(closest, spiky.radius((k * 2 * Math.PI) / 3600));
  assert.ok(closest > 0.2, `closest ${closest}`);
  // Dots outside the range are brought into it.
  assert.deepEqual(M.drawn([0, 2, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]).radii.slice(0, 2), [0.3, 1]);

  const checked = [
    { name: 'heart', radii: M.shapes.heart, period: 4.916593, deepest: 0, share: 0 },
    {
      name: 'heart with its dent at 0.3',
      radii: [0.88, 0.99, 0.81, 0.3, 0.81, 0.99, 0.88, 0.68, 0.66, 1, 0.66, 0.68],
      period: 4.890413,
      deepest: 0.05544,
      share: 0.131,
    },
    { name: 'flower', radii: M.shapes.flower, period: 4.869469, deepest: 0, share: 0 },
    { name: 'egg', radii: M.shapes.egg, period: 4.120722, deepest: 0, share: 0 },
    { name: 'star', radii: M.shapes.star, period: 2.984513, deepest: 0.07826, share: 0.294 },
    { name: 'flower with deep dents', radii: Array(6).fill([1, 0.3]).flat(), period: 4.08407, deepest: 0.32345 },
    { name: 'one deep dent', radii: [0.9, 0.9, 0.9, 0.3, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9], deepest: 0.14564 },
  ];
  for (const c of checked) {
    const road = M.road(M.drawn(c.radii));
    if (c.period) near(road.period, c.period, 2e-5, `${c.name}: road period`);
    const crash = M.crashes(road);
    near(crash.deepest, c.deepest, 0.0015, `${c.name}: deepest cut`);
    if (c.share !== undefined) near(crash.share, c.share, 0.012, `${c.name}: share of the way crashing`);
  }
});
