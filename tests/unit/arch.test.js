import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.arch;
const near = (actual, expected, tolerance, message) =>
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${message}: ${actual} is not within ${tolerance} of ${expected}`,
  );
const A = [-0.5, 0],
  B = [0.5, 0];
const towersAt = (stone, storeys) => Array.from({ length: M.STONES }, (_, j) => (j === stone ? storeys : 0));
/** The thinnest stones (in metres) with which an arch made by `build` stands, by halving. */
function thinnest(build, lo = 0.004, hi = 0.2) {
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (M.thrust(build(mid)).fits) hi = mid;
    else lo = mid;
  }
  return hi;
}

// Reference numbers from an independent script (not this model): the chain solved by MINPACK shooting, and whether
// a line of thrust fits by linear programming (scipy's HiGHS) over the same stones.

test('arch: the resting chain is the discrete catenary, within 0.02% of the span of the smooth one', () => {
  const rest = M.hang(A, B, 1.5, []);
  near(rest.H, 8.6297, 1e-4, 'horizontal pull, in beads');
  near(Math.min(...rest.points.map((p) => p[1])), -0.50282, 1e-5, 'lowest point');
  const cat = M.catenary(1, 1.5);
  near(cat.sag, 0.50263, 1e-5, 'smooth catenary sag');
  const worst = Math.max(...rest.points.map(([x, y]) => Math.abs(y + cat.sag - cat.y(x))));
  assert.ok(worst < 2e-4, `the chain is ${worst} from the catenary`);
  // Every link keeps its length, and the chain ends on its pegs.
  for (let i = 0; i < M.LINKS; i++) {
    const [p, q] = [rest.points[i], rest.points[i + 1]];
    near(Math.hypot(q[0] - p[0], q[1] - p[1]), 1.5 / M.LINKS, 1e-12, `link ${i}`);
  }
  near(rest.points[M.LINKS][0], 0.5, 1e-9, 'right peg x');
});

test('arch: the swinging chain settles onto the resting one', () => {
  const rest = M.hang(A, B, 1.5, []);
  const start = rest.points.map(([x, y], i) => [x + 0.22 * Math.sin((Math.PI * i) / M.LINKS), y * 0.62]);
  const c = M.chain(start);
  const weights = M.beadWeights([]);
  const gap = () => Math.max(...c.points.map((p, i) => Math.hypot(p[0] - rest.points[i][0], p[1] - rest.points[i][1])));
  for (let f = 0; f < 60; f++) for (let k = 0; k < 4; k++) M.relax(c, A, B, 1.5, weights, 1 / 240);
  const afterOne = gap();
  for (let f = 0; f < 180; f++) for (let k = 0; k < 4; k++) M.relax(c, A, B, 1.5, weights, 1 / 240);
  assert.ok(gap() < 0.005, `after 4 s the chain is ${gap()} from rest`);
  assert.ok(gap() < afterOne / 4, 'it keeps settling');
});

test('arch: the chain turned over stands, its line of force down the middle, however thin its stones', () => {
  const rest = M.hang(A, B, 1.5, []);
  for (const d of [0.01, 0.04, 0.08]) {
    const arch = M.chainArch(rest.points, d);
    assert.equal(arch.blocks.length, M.STONES);
    const line = M.thrust(arch);
    assert.ok(line.fits, `stones ${d} m thick`);
    assert.ok(line.inside > 0.45, `the line keeps ${line.inside} of the thickness inside`);
    assert.equal(M.mechanism(arch), null, 'no hinges can fall');
  }
});

test('arch: a semicircle of 21 stones needs them 5.335 cm thick (t/R = 0.1067; Milankovitch, smooth: 0.1075)', () => {
  const semi = (d) => M.shapeArch(M.shapes.semicircle, d);
  assert.equal(semi(0.04).blocks.length, 21);
  const t = thinnest(semi);
  near(t, 0.05335, 2e-5, 'thinnest stones');
  near(t / 0.5, 0.1067, 1e-4, 'thickness over radius');
  assert.ok(!M.thrust(semi(0.04)).fits, 'falls at 4 cm');
  assert.ok(M.thrust(semi(0.06)).fits, 'stands at 6 cm');
});

test('arch: a pointed arch needs 3.55 cm, a flat one under 1 cm', () => {
  near(
    thinnest((d) => M.shapeArch(M.shapes.pointed, d)),
    0.03547,
    2e-5,
    'pointed',
  );
  const flat = thinnest((d) => M.shapeArch(M.shapes.flat, d));
  assert.ok(flat > 0.008 && flat < 0.01, `flat: ${flat}`);
});

test('arch: a tower three storeys tall brings down an arch made without it, not one made with it', () => {
  const plain = M.hang(A, B, 1.5, []);
  assert.ok(M.thrust(M.chainArch(plain.points, 0.04, towersAt(5, 2))).fits, 'two storeys: stands');
  const loaded = M.chainArch(plain.points, 0.04, towersAt(5, 3));
  assert.ok(!M.thrust(loaded).fits, 'three storeys: falls');
  assert.ok(M.mechanism(loaded), 'and some hinges fall');
  const bent = M.hang(A, B, 1.5, towersAt(5, 3));
  assert.ok(M.thrust(M.chainArch(bent.points, 0.04, towersAt(5, 3))).fits, 'the chain that carried it stands');
  // The tower hangs from the middle bead of its stone's two links, and weighs four beads a storey.
  const w = M.beadWeights(towersAt(5, 3));
  assert.equal(w[10], 1 + 3 * M.TOWER);
  assert.equal(
    w.reduce((s, x) => s + x, 0),
    M.LINKS - 1 + 3 * M.TOWER,
  );
});

test('arch: a line of force fits exactly when no four hinges can fall', () => {
  const rest = M.hang(A, B, 1.5, []);
  const dots = (f) => Array.from({ length: M.DOTS }, (_, k) => f(M.dotAngle(k)));
  const cases = [
    ...[0.03, 0.045, 0.05, 0.056, 0.07].map((d) => M.shapeArch(M.shapes.semicircle, d)),
    ...[0.03, 0.04].map((d) => M.shapeArch(M.shapes.pointed, d)),
    M.shapeArch(M.drawnShape(dots((p) => 0.5 + 0.3 * Math.sin(p) ** 2)), 0.04),
    M.shapeArch(M.drawnShape(dots((p) => 0.5 - 0.2 * Math.sin(p) ** 2)), 0.04),
    ...[1, 2, 3].map((k) => M.chainArch(rest.points, 0.04, towersAt(5, k))),
    M.chainArch(rest.points, 0.04, [], true), // the bare chain's arch, given a road
  ];
  for (const arch of cases) {
    const fits = M.thrust(arch).fits,
      mech = M.mechanism(arch);
    assert.equal(fits, mech === null, 'the two ways of asking agree');
    if (!mech) continue;
    // Each hinge opens: at an outer corner turning anticlockwise, at an inner one clockwise.
    mech.turns.forEach((turn, h) => assert.equal(Math.sign(turn), mech.sides[h] ? 1 : -1));
    assert.ok(mech.rate < 0, 'the weights go down');
  }
});

test('arch: a fall is a linkage: its pieces stay joined at their hinges, and it ends on the ground', () => {
  const arch = M.shapeArch(M.shapes.semicircle, 0.04);
  const mech = M.mechanism(arch);
  const fall = M.fall(arch, mech, 0);
  assert.ok(fall.poses.length > 20, 'it moves a good way');
  const [, j, k] = mech.joints;
  const corner = (q, h) => (mech.sides[h] ? arch.joints[q].outer : arch.joints[q].inner);
  for (const pose of fall.poses) {
    const b1 = M.move(pose.moves[0], corner(j, 1)),
      b2 = M.move(pose.moves[1], corner(j, 1));
    const c2 = M.move(pose.moves[1], corner(k, 2)),
      c3 = M.move(pose.moves[2], corner(k, 2));
    near(Math.hypot(b1[0] - b2[0], b1[1] - b2[1]), 0, 1e-9, 'second hinge');
    near(Math.hypot(c2[0] - c3[0], c2[1] - c3[1]), 0, 1e-6, 'third hinge');
  }
  const last = fall.poses.at(-1);
  const lowest = Math.min(
    ...fall.pieces.flatMap((piece, p) =>
      arch.blocks.slice(piece.from, piece.to).flatMap((b) => b.corners.map((c) => M.move(last.moves[p], c)[1])),
    ),
  );
  assert.ok(lowest < 0.01, `a stone comes down to ${lowest}`);
});

test('arch: under a heavy road the chain is close to a parabola, and its own arch carries the road', () => {
  const bare = M.hang(A, B, 1.3, []),
    road = M.hang(A, B, 1.3, [], true);
  const fromParabola = (pts) => {
    const low = Math.min(...pts.map((p) => p[1]));
    return Math.max(...pts.map(([x, y]) => Math.abs(y - low * (1 - (x / 0.5) ** 2))));
  };
  assert.ok(fromParabola(road.points) < fromParabola(bare.points) / 4, 'the road straightens it into a parabola');
  assert.ok(M.thrust(M.chainArch(road.points, 0.04, [], true)).fits, 'turned over, it carries the road');
  // The road's weight is shared out by how much of it each bead holds up.
  const extra = road.weights.reduce((s, w) => s + w, 0) - (M.LINKS - 1);
  near(extra, M.ROAD * (1 - 1.3 / M.LINKS), 2, 'the road between the outer beads');
});

test('arch: a drawn arch with every dot at half the span is the semicircle', () => {
  const dots = Array.from({ length: M.DOTS }, () => 0.5);
  for (let k = 0; k <= 20; k++) near(M.drawnShape(dots)((k * Math.PI) / 20), 0.5, 1e-12, `at ${k}`);
  const a = M.thrust(M.shapeArch(M.drawnShape(dots), 0.04)),
    b = M.thrust(M.shapeArch(M.shapes.semicircle, 0.04));
  near(a.margin, b.margin, 1e-9, 'the same line of force');
  // The two pointed arcs meet at the crown, √3/2 of the span high.
  near(M.shapes.pointed(Math.PI / 2), Math.sqrt(3) / 2, 1e-12, 'pointed crown');
  near(M.shapes.flat(Math.PI / 2), 0.25, 1e-12, 'flat crown');
  near(M.shapes.flat(0), 0.5, 1e-12, 'flat foot');
});

test('arch: stones weigh by their area, two beads for a stone two links long', () => {
  const rest = M.hang(A, B, 1.5, []);
  const arch = M.chainArch(rest.points, 0.04);
  const total = arch.loads.reduce((s, l) => s + l.w, 0);
  // Within 0.5%: a stone's straight sides are a little shorter than the curve of its two links.
  near(total, 2 * M.STONES, 0.2, 'the arch weighs what the chain did');
  const { area, centroid } = M.polygon([
    [0, 0],
    [2, 0],
    [2, 1],
    [0, 1],
  ]);
  assert.equal(area, 2);
  assert.deepEqual(centroid, [1, 0.5]);
});
