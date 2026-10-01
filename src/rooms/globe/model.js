/*
 * The triangle with three right angles · triangles on a ball, and an arrow carried round one.
 * A triangle on a ball has sides that are great-circle arcs, and its angles add up to more than 180°. Girard's
 * theorem: the extra (the angle sum minus π, in radians) equals the area divided by R². An arrow carried round the
 * triangle without turning it (parallel transport: it keeps its angle to each straight side) comes home turned
 * anticlockwise by that same extra. Here the ball has radius 1, so the extra is simply the area.
 * https://mathworld.wolfram.com/GirardsSphericalExcessFormula.html · https://en.wikipedia.org/wiki/Parallel_transport
 * Pure functions, no DOM. Points are unit vectors [x, y, z]: z towards the north pole, x towards latitude 0,
 * longitude 0, y towards longitude 90° east. Angles are in radians, except latitude and longitude, in degrees.
 */
(() => {
  'use strict';

  const DEG = Math.PI / 180;

  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const add = (a, b, k = 1) => [a[0] + k * b[0], a[1] + k * b[1], a[2] + k * b[2]];
  const scale = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const length = (a) => Math.hypot(a[0], a[1], a[2]);
  const unit = (a) => scale(a, 1 / (length(a) || 1));

  /** The point at a latitude and longitude, in degrees. */
  const vec = (lat, lon) => [
    Math.cos(lat * DEG) * Math.cos(lon * DEG),
    Math.cos(lat * DEG) * Math.sin(lon * DEG),
    Math.sin(lat * DEG),
  ];
  /** Latitude and longitude of a point, in degrees (longitude 0 at the poles). */
  function latLon(v) {
    const [x, y, z] = unit(v);
    const lat = Math.atan2(z, Math.hypot(x, y)) / DEG;
    return [lat, Math.abs(lat) > 89.9999 ? 0 : Math.atan2(y, x) / DEG];
  }

  /** The angle between two points seen from the centre: the length of the arc joining them on a ball of radius 1. */
  const distance = (a, b) => Math.atan2(length(cross(a, b)), dot(a, b));

  /** The direction you set off in at a, walking the shorter great-circle arc towards b (a unit vector touching the ball). */
  const heading = (a, b) => unit(add(b, a, -dot(a, b)));

  /** Where you arrive from p, setting off in direction dir (touching the ball at p) and walking an angle a. */
  const travel = (p, dir, a) => add(scale(p, Math.cos(a)), dir, Math.sin(a));

  /** Direction dir, touching the ball at p, turned anticlockwise (seen from outside) by an angle a. */
  const rotate = (p, dir, a) => add(scale(dir, Math.cos(a)), cross(p, dir), Math.sin(a));

  /** The point a fraction f of the way along the shorter arc from a to b. */
  function along(a, b, f) {
    const d = distance(a, b);
    if (d < 1e-12) return a.slice();
    return travel(a, heading(a, b), f * d);
  }

  /** The angle between directions u and v touching the ball at p, anticlockwise seen from outside, in (−π, π]. */
  const turn = (p, u, v) => Math.atan2(dot(cross(u, v), p), dot(u, v));

  /** The triangle's three angles, at a, b and c. */
  function angles([a, b, c]) {
    const at = (p, q, r) => Math.abs(turn(p, heading(p, q), heading(p, r)));
    return [at(a, b, c), at(b, c, a), at(c, a, b)];
  }

  /** The angle sum minus π: how far the triangle is from a flat one's 180°. */
  const excess = (tri) => angles(tri).reduce((sum, x) => sum + x, 0) - Math.PI;

  /**
   * The triangle's area on a ball of radius 1, straight from its corners and never from its angles (Van Oosterom and
   * Strackee): tan(E/2) = |a · (b × c)| / (1 + a·b + b·c + c·a).
   */
  function area([a, b, c]) {
    const top = Math.abs(dot(a, cross(b, c)));
    return 2 * Math.atan2(top, 1 + dot(a, b) + dot(b, c) + dot(c, a));
  }

  /** The share of the whole ball (4π) the triangle covers. */
  const share = (tri) => area(tri) / (4 * Math.PI);

  /** +1 when a → b → c runs anticlockwise seen from outside (the triangle on its left), −1 when clockwise. */
  const orientation = ([a, b, c]) => (dot(a, cross(b, c)) >= 0 ? 1 : -1);

  /** Whether three corners make a triangle this room can draw: no two too close together, or opposite. */
  function usable(tri, least = 0.3 * DEG) {
    for (let i = 0; i < 3; i++) {
      const d = distance(tri[i], tri[(i + 1) % 3]);
      if (!(d > least && d < Math.PI - least)) return false;
    }
    return true;
  }

  /** The circle through the three corners: its centre, and its radius (under 90°, the side the triangle lies in). */
  function circle([a, b, c]) {
    let n = cross(add(b, a, -1), add(c, a, -1));
    if (length(n) < 1e-14) return null;
    n = unit(n);
    if (dot(n, a) < 0) n = scale(n, -1);
    return { centre: n, radius: distance(n, a) };
  }

  /** The same triangle, grown or shrunk: every corner moved along its line from the centre to the given radius. */
  function resize(tri, radius) {
    const c = circle(tri);
    if (!c) return tri.map((p) => p.slice());
    return tri.map((p) => travel(c.centre, heading(c.centre, p), radius));
  }

  /**
   * An arrow carried round the triangle, starting at its first corner and walking with the triangle on its left
   * (a → b → c, or a → c → b). It starts along the middle of the first angle, pointing into the triangle.
   * Along each side it keeps the same angle to the path (phi, anticlockwise from the way it's walking); at each
   * corner the path turns left by the outside angle, and the arrow doesn't turn at all.
   * Returns the corners in walking order, the legs, the whole length, and `turned`: how far the arrow has turned
   * when it's home, anticlockwise, worked out from the corners only (it equals the excess).
   */
  function walk(tri) {
    const order = orientation(tri) > 0 ? [0, 1, 2] : [0, 2, 1];
    const corners = order.map((i) => tri[i]);
    const inside = angles(corners);
    let phi = inside[0] / 2;
    const start = phi;
    const legs = [];
    let at = 0;
    for (let k = 0; k < 3; k++) {
      const from = corners[k],
        to = corners[(k + 1) % 3];
      const size = distance(from, to);
      legs.push({ from, to, start: at, length: size, phi });
      at += size;
      phi -= Math.PI - inside[(k + 1) % 3]; // the path turns left by the outside angle; the arrow keeps still
    }
    // Home again, measured against the first side: the arrow now sits at `phi`, having started at `start`.
    const turned = (((phi - start) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    return { order, corners, legs, perimeter: at, turned };
  }

  /** Where the walker is after walking s along the loop (0 ≤ s ≤ perimeter): position, heading and arrow. */
  function arrowAt(w, s) {
    const leg = w.legs.find((l) => s <= l.start + l.length) ?? w.legs[2];
    const f = leg.length ? Math.min(1, Math.max(0, (s - leg.start) / leg.length)) : 0;
    const position = along(leg.from, leg.to, f);
    // The heading at a point along the arc: the start heading, carried along the great circle.
    const h0 = heading(leg.from, leg.to),
      d = f * leg.length;
    const way = unit(add(scale(h0, Math.cos(d)), leg.from, -Math.sin(d)));
    return { position, way, arrow: rotate(position, way, leg.phi), leg: w.legs.indexOf(leg) };
  }

  /** How far the arrow that comes home has turned from the one that set off, seen at the start: in [0, 2π). */
  function homeTurn(w) {
    const first = arrowAt(w, 0).arrow,
      last = arrowAt(w, w.perimeter).arrow;
    const a = turn(w.corners[0], first, last);
    return a < 0 ? a + 2 * Math.PI : a;
  }

  /**
   * Round values to `digits` decimals so that the rounded values add up to the rounded total (largest remainder),
   * so three angles of 60.04° show as 60.1° + 60.0° + 60.0° = 180.1°, not 60.0° + 60.0° + 60.0° = 180.1°.
   */
  function roundParts(values, digits) {
    const k = 10 ** digits;
    const total = Math.round(values.reduce((sum, x) => sum + x, 0) * k);
    const floors = values.map((x) => Math.floor(x * k));
    let left = total - floors.reduce((sum, x) => sum + x, 0);
    const byRemainder = values.map((x, i) => [x * k - floors[i], i]).sort((p, q) => q[0] - p[0]);
    const parts = floors.slice();
    for (let j = 0; left > 0 && j < parts.length; j++, left--) parts[byRemainder[j][1]] += 1;
    return { parts: parts.map((x) => x / k), total: total / k };
  }

  Wonderlattice.models.globe = Object.freeze({
    DEG,
    dot,
    cross,
    unit,
    vec,
    latLon,
    distance,
    heading,
    travel,
    rotate,
    along,
    turn,
    angles,
    excess,
    area,
    share,
    orientation,
    usable,
    circle,
    resize,
    walk,
    arrowAt,
    homeTurn,
    roundParts,
  });
})();
