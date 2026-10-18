import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.maps;
const C = M.CITIES;
const near = (a, b, eps) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);

// Reference numbers from an independent recomputation (Python: the haversine formula, the rhumb-line formula with
// Δψ = ln tan(45° + φ/2), and the great circle sampled at 200,001 points by spherical interpolation; not this code),
// on a ball of radius 6,371 km:
//   New York → Tokyo:      great circle 10,849.954 km, rhumb line 12,788.097 km, farthest north 69.8400°N at 145.595°W
//   Madrid → Beijing:      great circle  9,221.931 km, rhumb line 10,206.216 km, farthest north 59.3921°N at 56.046°E
//   London → Los Angeles:  great circle  8,755.308 km, rhumb line  9,732.817 km, farthest north 62.3691°N at 48.957°W
// Greenland's ring, by l'Huilier's formula for each triangle fanned from its middle: 2,182,731.7 km² (the true figure
// is 2,166,086 km²); drawn on Mercator's map (shoelace area of ln tan(45° + φ/2) against longitude) 16.52985 times its
// area on the ball, and on the Gall–Peters map 1.00100 times.

test('the two routes match the independent recomputation', () => {
  for (const [a, b, arc, rhumb, lat, lon] of [
    [C.newYork, C.tokyo, 10849.954, 12788.097, 69.84, -145.595],
    [C.madrid, C.beijing, 9221.931, 10206.216, 59.3921, 56.046],
    [C.london, C.losAngeles, 8755.308, 9732.817, 62.3691, -48.957],
  ]) {
    near(M.greatCircle(a, b) * M.RADIUS, arc, 0.001);
    near(M.rhumb(a, b).length * M.RADIUS, rhumb, 0.001);
    const top = M.farthest(a, b);
    near(top[0], lat, 1e-3);
    near(top[1], lon, 1e-3);
    // Both ways round give the same lengths.
    near(M.greatCircle(b, a), M.greatCircle(a, b), 1e-12);
    near(M.rhumb(b, a).length, M.rhumb(a, b).length, 1e-12);
  }
});

test('the great circle is never longer than the rhumb line, and equal along the equator and a meridian', () => {
  for (let i = 0; i < 300; i++) {
    const a = [-80 + ((i * 37) % 160), -180 + ((i * 101) % 360)],
      b = [-80 + ((i * 53 + 17) % 160), -180 + ((i * 211 + 40) % 360)];
    if (!M.usable(a, b)) continue;
    assert.ok(M.greatCircle(a, b) <= M.rhumb(a, b).length + 1e-12, `${a} → ${b}`);
  }
  near(M.greatCircle([0, 10], [0, 70]), M.rhumb([0, 10], [0, 70]).length, 1e-12);
  near(M.greatCircle([-20, 30], [50, 30]), M.rhumb([-20, 30], [50, 30]).length, 1e-12);
  // Neither has a farthest point beyond its ends: along a meridian, the ends are farthest; along the equator, nowhere.
  assert.equal(M.farthest([-20, 30], [50, 30]), null);
  assert.equal(M.farthest([0, 10], [0, 70]), null);
});

test('the rhumb line keeps one heading: straight on Mercator, and as long as its own small steps', () => {
  const [a, b] = [C.newYork, C.tokyo];
  const r = M.rhumb(a, b);
  const P = (p) => [p[1] * M.DEG, M.mercatorY(p[0])];
  const A = P(a),
    B = P(M.rhumbAt(a, b, 1));
  let walked = 0,
    before = M.rhumbAt(a, b, 0);
  for (let i = 1; i <= 2000; i++) {
    const p = M.rhumbAt(a, b, i / 2000);
    const q = P(p);
    // On Mercator's map every point lies on the straight line from one end to the other.
    const offLine = (B[0] - A[0]) * (q[1] - A[1]) - (B[1] - A[1]) * (q[0] - A[0]);
    assert.ok(Math.abs(offLine) < 1e-9, `step ${i}`);
    walked += M.distance(M.vec(...before), M.vec(...p));
    before = p;
  }
  near(walked / r.length, 1, 1e-6);
  // It ends at Tokyo, having gone west the shorter way round (146° of longitude, not 214°).
  const end = M.rhumbAt(a, b, 1);
  near(end[0], b[0], 1e-12);
  near(M.wrap(end[1]), b[1], 1e-9);
  near(r.dLon, -146.3, 1e-9);
});

test('the gnomonic map draws every great circle straight', () => {
  for (const [a, b] of [
    [C.newYork, C.tokyo],
    [C.madrid, C.beijing],
    [
      [-33.9, 18.4],
      [-37.8, 145],
    ],
  ]) {
    const [lat, lon] = M.greatCircleAt(a, b, 0.5);
    // Seen from the route's middle, from a third of the way along, and from somewhere off the route.
    for (const centre of [[lat, lon], M.greatCircleAt(a, b, 0.3), [lat - Math.sign(lat) * 15, lon + 10]]) {
      const f = M.frame(...centre);
      const g = (p) => M.gnomonic(M.local(M.vec(...p), f));
      const pts = [];
      for (let i = 0; i <= 50; i++) {
        const l = M.local(M.vec(...M.greatCircleAt(a, b, i / 50)), f);
        if (l[2] > 0.2) pts.push(g(M.greatCircleAt(a, b, i / 50)));
      }
      assert.ok(pts.length > 30);
      const [P, Q] = [pts[0], pts[pts.length - 1]];
      const size = Math.hypot(Q[0] - P[0], Q[1] - P[1]);
      for (const p of pts) {
        const off = ((Q[0] - P[0]) * (p[1] - P[1]) - (Q[1] - P[1]) * (p[0] - P[0])) / size;
        assert.ok(Math.abs(off) < 1e-9 * Math.max(1, size), `${a} → ${b} from ${centre}`);
      }
    }
  }
});

test('Mercator draws small stickers 1/cos²(latitude) times too big; Gall–Peters keeps their area', () => {
  const merc = (p) => [p[1] * M.DEG, M.mercatorY(p[0])];
  const gall = (p) => [p[1] * M.DEG * M.FLAT.equalArea.xScale, M.FLAT.equalArea.y(p[0])];
  for (const [lat, expected] of [
    [0, 1],
    [30, 1.3333],
    [60, 4],
    [73, 11.6985],
  ]) {
    const ring = M.circle([lat, 20], 0.2 * M.DEG, 72);
    const onBall = M.area(ring);
    near(M.flatArea(ring.map(merc)) / onBall / expected, 1, 1e-3);
    near(M.mercatorArea(lat) / expected, 1, 1e-4);
    near(M.flatArea(ring.map(gall)) / onBall, 1, 1e-3);
    // The y of each map turns back into the latitude.
    near(M.mercatorLat(M.mercatorY(lat)), lat, 1e-9);
    near(M.FLAT.equalArea.lat(M.FLAT.equalArea.y(lat)), lat, 1e-9);
  }
});

test('the gnomonic map draws small stickers 1/cos³(distance) times too big', () => {
  const f = M.frame(40, -30);
  for (const d of [0, 20, 45, 70]) {
    const centre = M.latLon(M.global([Math.sin(d * M.DEG), 0, Math.cos(d * M.DEG)], f));
    const ring = M.circle(centre, 0.2 * M.DEG, 72);
    const drawn = M.flatArea(ring.map((p) => M.gnomonic(M.local(M.vec(...p), f))));
    near(drawn / M.area(ring) / M.gnomonicArea(d * M.DEG), 1, 2e-3);
  }
});

test('stickers are round on the ball, and moving a shape keeps its size and keeps north up', () => {
  const ring = M.circle([50, 10], 6 * M.DEG, 36);
  for (const p of ring) near(M.distance(M.vec(...p), M.vec(50, 10)), 6 * M.DEG, 1e-12);
  // A cap of radius r covers 2π(1 − cos r).
  near(M.area(M.circle([50, 10], 6 * M.DEG, 720)), 2 * Math.PI * (1 - Math.cos(6 * M.DEG)), 1e-6);
  const greenland = M.land[M.GREENLAND].points;
  const home = [74, -40];
  for (const to of [
    [0, 30],
    [-40, 120],
    [74, -40],
  ]) {
    const moved = M.move(greenland, home, to);
    near(M.area(moved), M.area(greenland), 1e-12);
    // The point that was at home is now at `to`, and the point just north of home is still due north of it.
    const [p, q] = M.move([home, [home[0] + 1, home[1]]], home, to);
    near(p[0], to[0], 1e-9);
    near(M.wrap(p[1] - to[1]), 0, 1e-9);
    near(M.wrap(q[1] - p[1]), 0, 1e-9);
    assert.ok(q[0] > p[0]);
  }
});

test('the land: Natural Earth’s rings, with Greenland and the Caspian Sea where they belong', () => {
  assert.equal(M.land.length, 109);
  assert.deepEqual(
    M.land.flatMap((r, i) => (r.lake ? [i] : [])),
    [108],
  );
  const greenland = M.land[M.GREENLAND].points;
  near(M.area(greenland) * M.RADIUS ** 2, 2182731.7, 1);
  const sum = greenland.reduce((s, p) => [s[0] + p[0], s[1] + p[1]], [0, 0]);
  near(sum[0] / greenland.length, 74.2, 0.2);
  near(sum[1] / greenland.length, -40.1, 0.2);
  // Drawn on each flat map, by its own coordinates.
  const flat = M.flatRing(greenland);
  const merc = flat.map(([lat, lon]) => [lon * M.DEG, M.mercatorY(lat)]);
  const gall = flat.map(([lat, lon]) => [lon * M.DEG * M.FLAT.equalArea.xScale, M.FLAT.equalArea.y(lat)]);
  near(M.flatArea(merc) / M.area(greenland), 16.52985, 1e-4);
  near(M.flatArea(gall) / M.area(greenland), 1.001, 1e-4);
  // Every shore turns the right way: land on its left, so every ring but the lake has a positive area.
  for (const r of M.land) assert.equal(M.area(r.points) > 0, !r.lake);
  // All the land the map keeps: about 147 million km² (the Earth has about 149 million; small islands are left out).
  const total = M.land.reduce((s, r) => s + M.area(r.points), 0) * M.RADIUS ** 2;
  assert.ok(total > 145e6 && total < 149e6, `${total}`);
});

test('a ring round a pole is closed along it on a flat map', () => {
  const antarctica = M.land.findIndex((r) => r.points.every((p) => p[0] < -60));
  const flat = M.flatRing(M.land[antarctica].points);
  const n = M.land[antarctica].points.length;
  assert.equal(flat.length, n + 3);
  // Back to its first point a whole turn round (going west, with the land on its left), then along the South Pole.
  near(flat[n][1] - flat[0][1], -360, 1e-9);
  near(flat[n][0], flat[0][0], 1e-12);
  assert.deepEqual([flat[n + 1][0], flat[n + 2][0]], [-90, -90]);
  // A ring that doesn't go round a pole is left as it is.
  assert.equal(M.flatRing(M.land[M.GREENLAND].points).length, M.land[M.GREENLAND].points.length);
});

test('cutting land to what is in view', () => {
  const toLocal = (points, f) => points.map((p) => M.local(M.vec(...p), f));
  const back = (loop, f) => loop.map((l) => M.latLon(M.global(l, f)));
  const fromNorth = M.frame(90, 0),
    fromSouth = M.frame(-90, 0);
  // A ring in view comes back as it was.
  const small = toLocal(M.circle([70, 0], 5 * M.DEG, 20), fromNorth);
  assert.deepEqual(M.clip(small, 0), [small]);
  // A ring out of view: all the view, when the land holds it (going east at 10°S, land to the north), else nothing.
  const east = [],
    west = [];
  for (let lon = 0; lon < 360; lon += 5) {
    east.push([-10, lon]);
    west.unshift([-10, lon]);
  }
  const all = M.clip(toLocal(east, fromNorth), 0);
  assert.equal(all.length, 1);
  near(M.flatArea(all[0]), Math.PI, 0.01);
  assert.deepEqual(M.clip(toLocal(west, fromNorth), 0), []);
  // A shore at 10°N that dips to 10°S between 10°E and 30°E, going east (land to the north). From the north, the
  // land in view stops at the equator across the dip; from the south, only the dip's land is in view. Areas from an
  // independent calculation (l'Huilier's formula): 5.2572455 and 0.0621431.
  const shore = [];
  for (let lon = 0; lon < 360; lon++) shore.push([lon >= 10 && lon <= 30 ? -10 : 10, lon]);
  const north = M.clip(toLocal(shore, fromNorth), 0);
  assert.equal(north.length, 1);
  near(M.area(back(north[0], fromNorth)), 5.257245547, 1e-6);
  const south = M.clip(toLocal(shore, fromSouth), 0);
  assert.equal(south.length, 1);
  near(M.area(back(south[0], fromSouth)), 0.062143116, 1e-6);
  for (const l of [...north[0], ...south[0]]) assert.ok(l[2] >= -1e-12);
  // A box across the edge of the view keeps the half in view: 0.3581707 of 0.7163414.
  const box = [];
  for (let lon = -30; lon <= 30; lon++) box.push([-20, lon]);
  for (let lat = -19; lat < 20; lat++) box.push([lat, 30]);
  for (let lon = 30; lon >= -30; lon--) box.push([20, lon]);
  for (let lat = 19; lat > -20; lat--) box.push([lat, -30]);
  near(M.area(box), 0.71634137, 1e-6);
  const half = M.clip(toLocal(box, M.frame(0, 90)), 0);
  assert.equal(half.length, 1);
  near(M.area(back(half[0], M.frame(0, 90))), 0.358170685, 1e-6);
  // On the gnomonic map's smaller view (80° round its middle), a shore beyond the edge is cut along that edge.
  const k = Math.cos(80 * M.DEG);
  const cut = M.clip(toLocal(shore, fromNorth), k);
  for (const l of cut[0]) assert.ok(l[2] >= k - 1e-12);
});

test('places a route can join', () => {
  assert.ok(M.usable(C.newYork, C.tokyo));
  assert.ok(!M.usable([10, 20], [10, 20]));
  assert.ok(!M.usable([10, 20], [-10, -160])); // opposite ends of the Earth
  assert.ok(M.usable([10, 20], [-8, -161]));
});
