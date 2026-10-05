/*
 * Rollers that aren't round · curves of constant width. A convex shape is described by its support function h(θ):
 * how far from its centre the tangent line with outward normal θ lies. Its width in direction θ is h(θ) + h(θ + π),
 * so it has constant width w exactly when that sum is w for every θ.
 *
 * Every shape here is made of circular arcs by the crossed-lines method (M. Gardner; see
 * https://en.wikipedia.org/wiki/Curve_of_constant_width): lines, no two parallel, sorted by direction; each pair of
 * neighbours is joined by an arc centred where they cross, and going round twice, the two arcs about each crossing
 * have radii that add up to the width. A regular Reuleaux polygon comes from the lines of a star polygon, with the
 * smallest radius 0 (its corners).
 *
 * Pure functions, no DOM. Lengths are in units of the width (every shape has width 1); y points up; angles are in
 * radians, anticlockwise. Each shape's centre (the origin) is the centre of its smallest enclosing circle, which for
 * a shape of constant width is also the centre of the largest circle inside it.
 */
(() => {
  'use strict';

  const TAU = 2 * Math.PI;
  const mod = (x, m) => ((x % m) + m) % m;

  /** Where two lines cross; a line is { angle, x, y }: its direction and a point on it. */
  function cross(a, b) {
    const ax = Math.cos(a.angle),
      ay = Math.sin(a.angle),
      bx = Math.cos(b.angle),
      by = Math.sin(b.angle);
    const det = ax * by - ay * bx;
    const t = ((b.x - a.x) * by - (b.y - a.y) * bx) / det;
    return [a.x + t * ax, a.y + t * ay];
  }

  /**
   * The crossed-lines construction. `corner` is the smallest radius of any arc, as a share of the width: 0 gives
   * sharp corners (radius 0), and larger values round them off. Returns a shape of width 1, centred.
   */
  function fromLines(lines, corner = 0) {
    const L = [...lines].map((l) => ({ ...l, angle: mod(l.angle, Math.PI) })).sort((a, b) => a.angle - b.angle);
    const n = L.length;
    const P = L.map((line, k) => cross(line, L[(k + 1) % n]));
    const along = (k, d) => d[0] * Math.cos(L[k].angle) + d[1] * Math.sin(L[k].angle);
    // Arc k is centred at P[k] and turns from line k to line k + 1. Where they meet on line k + 1, the radius changes
    // by the distance between the two centres along that line: r[k + 1] = r[k] − c, so r[k] = r[0] − shift[k].
    const shift = [0];
    for (let k = 1; k < n; k++) shift.push(shift[k - 1] + along(k, [P[k][0] - P[k - 1][0], P[k][1] - P[k - 1][1]]));
    // After half a turn the curve is back on line 0, on the other side of its crossings; the arcs from there on are
    // centred at the same points, and the width is r[0] plus the radius it arrives with.
    const back = along(0, [P[0][0] - P[n - 1][0], P[0][1] - P[n - 1][1]]) - shift[n - 1];
    const least = Math.max(Math.max(...shift), -back - Math.min(...shift));
    const width = (2 * least + back) / (1 - 2 * corner);
    const r0 = corner * width + least;
    const arcs = [];
    for (const half of [0, 1])
      for (let k = 0; k < n; k++) {
        const r = r0 - shift[k];
        arcs.push({
          from: L[k].angle + half * Math.PI,
          to: (k + 1 < n ? L[k + 1].angle : L[0].angle + Math.PI) + half * Math.PI,
          cx: P[k][0] / width,
          cy: P[k][1] / width,
          r: (half ? width - r : r) / width,
        });
      }
    return make(
      arcs,
      L.map((l) => ({ angle: l.angle, x: l.x / width, y: l.y / width })),
    );
  }

  /** A circle of width 1. */
  const circle = () => make([{ from: 0, to: TAU, cx: 0, cy: 0, r: 0.5 }], []);

  /** The lines of a regular star polygon with n points (n odd): each joins a corner to the two farthest from it. */
  function starLines(n) {
    const corner = (i) => {
      const a = Math.PI / 2 + (TAU * i) / n;
      return [Math.cos(a), Math.sin(a)];
    };
    return Array.from({ length: n }, (_, i) => {
      const [x, y] = corner(i),
        [x2, y2] = corner(i + (n - 1) / 2);
      return { angle: Math.atan2(y2 - y, x2 - x), x, y };
    });
  }

  /** A Reuleaux polygon with n sides (n odd), a corner at the top, its corners rounded by `corner`. */
  const reuleaux = (n, corner = 0) => fromLines(starLines(n), corner);

  /**
   * A lopsided shape from `count` lines drawn at random (the same seed gives the same lines). The lines are spread
   * over every direction, each nudged a little, and pass at random distances from the middle; a draw too close to
   * round is replaced by the next one.
   */
  function lopsidedLines(seed, count) {
    const random = rng(seed);
    for (;;) {
      const lines = Array.from({ length: count }, (_, k) => {
        const angle = ((k + 0.5 + (random() - 0.5) * 0.7) * Math.PI) / count;
        const d = (random() - 0.5) * 0.7;
        return { angle, x: -d * Math.sin(angle), y: d * Math.cos(angle) };
      });
      if (bob(fromLines(lines)) > 0.06) return lines;
    }
  }

  const lopsided = (seed, count, corner = 0) => fromLines(lopsidedLines(seed, count), corner);

  /** Shapes by kind: 0 a circle, 1 a Reuleaux triangle, 2 a Reuleaux pentagon, 3 a lopsided shape. */
  function shape(kind, { seed = 1, lines = 4, corner = 0 } = {}) {
    if (kind === 0) return circle();
    if (kind === 1) return reuleaux(3, corner);
    if (kind === 2) return reuleaux(5, corner);
    return lopsided(seed, lines, corner);
  }

  // ------------------------------------------------------------ the shape

  /** Finish a shape: move its centre to the middle of its smallest enclosing circle, and add up its arcs. */
  function make(arcs, lines) {
    const [x, y] = arcs.length > 1 ? centreOf(arcs) : [0, 0];
    arcs = arcs.map((a) => ({ ...a, cx: a.cx - x, cy: a.cy - y }));
    lines = lines.map((l) => ({ ...l, x: l.x - x, y: l.y - y }));
    // The running integral of h, from the start of each arc, for rolling.
    const before = [0];
    for (const a of arcs) before.push(before[before.length - 1] + integralOver(a, a.from, a.to));
    const s = { arcs, lines, start: arcs[0].from, before };
    s.turn = before[arcs.length]; // ∫h over a whole turn
    s.radius = farthest(arcs, 0, 0); // of the smallest enclosing circle
    return s;
  }

  const integralOver = (a, t0, t1) =>
    a.cx * (Math.sin(t1) - Math.sin(t0)) - a.cy * (Math.cos(t1) - Math.cos(t0)) + a.r * (t1 - t0);

  /** The farthest any point of the arcs is from (x, y). */
  function farthest(arcs, x, y) {
    let most = 0;
    for (const a of arcs) {
      const dx = a.cx - x,
        dy = a.cy - y;
      // On one circle, the farthest point lies straight on from the centre, if the arc reaches that direction.
      const toward = Math.atan2(dy, dx);
      if (a.r > 0 && mod(toward - a.from, TAU) <= a.to - a.from) most = Math.max(most, Math.hypot(dx, dy) + a.r);
      for (const t of [a.from, a.to])
        most = Math.max(most, Math.hypot(a.cx + a.r * Math.cos(t) - x, a.cy + a.r * Math.sin(t) - y));
    }
    return most;
  }

  /** The centre of the smallest circle round the arcs (the farthest distance is convex, so search each axis). */
  function centreOf(arcs) {
    const golden = (f, lo, hi) => {
      const g = (Math.sqrt(5) - 1) / 2;
      let a = hi - g * (hi - lo),
        b = lo + g * (hi - lo),
        fa = f(a),
        fb = f(b);
      for (let i = 0; i < 50; i++) {
        if (fa < fb) {
          hi = b;
          b = a;
          fb = fa;
          a = hi - g * (hi - lo);
          fa = f(a);
        } else {
          lo = a;
          a = b;
          fa = fb;
          b = lo + g * (hi - lo);
          fb = f(b);
        }
      }
      return (lo + hi) / 2;
    };
    const bestY = (x) => golden((y) => farthest(arcs, x, y), -2, 2);
    const x = golden((x) => farthest(arcs, x, bestY(x)), -2, 2);
    return [x, bestY(x)];
  }

  /** The arc whose normals include θ, and θ moved into the shape's first turn. */
  function arcAt(s, theta) {
    const t = s.start + mod(theta - s.start, TAU);
    let k = s.arcs.length - 1;
    while (k > 0 && s.arcs[k].from > t) k--;
    return [k, t];
  }

  /** The support function: how far the tangent line with outward normal θ is from the centre. */
  function h(s, theta) {
    const a = s.arcs[arcAt(s, theta)[0]];
    return a.cx * Math.cos(theta) + a.cy * Math.sin(theta) + a.r;
  }

  /** Its rate of change with θ: how far along the tangent line the point of contact is from the centre's foot. */
  function slope(s, theta) {
    const a = s.arcs[arcAt(s, theta)[0]];
    return -a.cx * Math.sin(theta) + a.cy * Math.cos(theta);
  }

  /** The point of the curve whose outward normal is θ. */
  function point(s, theta) {
    const a = s.arcs[arcAt(s, theta)[0]];
    return [a.cx + a.r * Math.cos(theta), a.cy + a.r * Math.sin(theta)];
  }

  /** ∫h from the shape's start to θ (any θ: whole turns add s.turn each). */
  function integral(s, theta) {
    const turns = Math.floor((theta - s.start) / TAU);
    const [k, t] = arcAt(s, theta);
    return turns * s.turn + s.before[k] + integralOver(s.arcs[k], s.arcs[k].from, t);
  }

  /** The curve as points, anticlockwise, for drawing: corners once, each arc in short steps. */
  function outline(s, step = 0.05) {
    const points = [];
    for (const a of s.arcs) {
      const pieces = a.r > 0 ? Math.max(1, Math.ceil((a.to - a.from) / step)) : 0;
      for (let i = 0; i <= pieces; i++) {
        const t = a.from + ((a.to - a.from) * i) / Math.max(1, pieces);
        points.push([a.cx + a.r * Math.cos(t), a.cy + a.r * Math.sin(t)]);
      }
    }
    return points;
  }

  // ------------------------------------------------------------ measures

  const width = (s, theta) => h(s, theta) + h(s, theta + Math.PI);
  const perimeter = (s) => s.arcs.reduce((sum, a) => sum + a.r * (a.to - a.from), 0);

  /** The area inside, from ½∮(x dy − y dx) along each arc. */
  const area = (s) =>
    s.arcs.reduce(
      (sum, a) =>
        sum +
        0.5 *
          (a.r * (a.cx * (Math.sin(a.to) - Math.sin(a.from)) - a.cy * (Math.cos(a.to) - Math.cos(a.from))) +
            a.r * a.r * (a.to - a.from)),
      0,
    );

  /** How far a wheel on an axle at the centre bobs: from its farthest point to its nearest, 2R − 1. */
  function bob(s) {
    return 2 * s.radius - 1;
  }

  // ------------------------------------------------------------ rolling

  /**
   * The shape rolling to the right without slipping on the ground (y = 0), after turning clockwise by ψ from its own
   * orientation. Returns its centre (x, y), how far it has turned (`turn`, anticlockwise, so −ψ), and where it
   * touches the ground (`contact`). A plank resting on top stays at height 1 and moves ψ to the right.
   */
  function roll(s, psi) {
    const down = -Math.PI / 2 + psi; // the shape's own normal that points straight down
    const x = integral(s, down) - integral(s, -Math.PI / 2);
    return { x, y: h(s, down), turn: -psi, contact: x + slope(s, down) };
  }

  /**
   * Under a plank, a roller moves on average half as fast as the plank, ψ/2: it rolls one rim's length, π, per turn,
   * and the plank twice that. `drift` is how far ahead of that steady pace it is, which swings back and forth.
   */
  const drift = (s, psi) => roll(s, psi).x - psi / 2;

  /**
   * How far apart rollers must stand, at their steady pace, so they never touch: each fits in a circle of the
   * shape's radius, and two rollers turned differently drift apart or together by at most the drift's swing.
   */
  function spacing(s) {
    let lo = Infinity,
      hi = -Infinity;
    for (let i = 0; i < 720; i++) {
      const v = drift(s, (i / 720) * TAU);
      lo = Math.min(lo, v);
      hi = Math.max(hi, v);
    }
    return 2 * s.radius + (hi - lo) + 0.06;
  }

  // ------------------------------------------------------------ drilling

  /**
   * The shape turned anticlockwise by φ inside the square from −½ to ½, touching its right and top sides (and so, by
   * constant width, its left and bottom sides too). Returns its centre.
   */
  function inSquare(s, phi) {
    return [0.5 - h(s, -phi), 0.5 - h(s, Math.PI / 2 - phi)];
  }

  /** The shape's outline turned by φ and placed in the square. */
  function placed(s, phi, points = outline(s, 0.02)) {
    const [x, y] = inSquare(s, phi),
      c = Math.cos(phi),
      sn = Math.sin(phi);
    return points.map(([px, py]) => [x + c * px - sn * py, y + sn * px + c * py]);
  }

  /**
   * Where the drill has been, row by row: for each of n rows across the square (row 0 at the top), the leftmost and
   * rightmost points it has reached. The turning shape always touches the top and the bottom of the square, so it
   * crosses every row at every moment, along a stretch that moves smoothly; what it sweeps in a row is therefore one
   * stretch, from the leftmost point reached to the rightmost.
   */
  const sweepFor = (n) => ({
    n,
    left: new Float64Array(n).fill(Infinity),
    right: new Float64Array(n).fill(-Infinity),
  });

  /** The height of row j's middle. */
  const rowY = (n, j) => 0.5 - (j + 0.5) / n;

  /** Widen each row's stretch to take in a convex polygon, edge by edge. */
  function sweep(grid, polygon) {
    const { n, left, right } = grid;
    const reach = (j, x) => {
      if (x < left[j]) left[j] = x;
      if (x > right[j]) right[j] = x;
    };
    for (let k = 0; k < polygon.length; k++) {
      const [ax, ay] = polygon[k],
        [bx, by] = polygon[(k + 1) % polygon.length];
      const j0 = Math.max(0, Math.ceil((0.5 - Math.max(ay, by)) * n - 0.5)),
        j1 = Math.min(n - 1, Math.floor((0.5 - Math.min(ay, by)) * n - 0.5));
      for (let j = j0; j <= j1; j++) {
        if (ay === by) {
          reach(j, ax);
          reach(j, bx);
        } else reach(j, ax + ((rowY(n, j) - ay) / (by - ay)) * (bx - ax));
      }
    }
  }

  /** The share of the square swept so far. */
  function swept(grid) {
    let sum = 0;
    for (let j = 0; j < grid.n; j++) sum += Math.max(0, Math.min(grid.right[j], 0.5) - Math.max(grid.left[j], -0.5));
    return sum / grid.n;
  }

  /** The turn after which a shape looks the same again: a third of a turn for the triangle, a fifth for the pentagon. */
  const period = (kind) => (kind === 1 ? TAU / 3 : kind === 2 ? TAU / 5 : TAU);

  /** Sweep the drill's path as it turns from φ0 to φ1, in small steps; returns the share swept so far. */
  function drill(grid, s, phi0, phi1, points = outline(s, 0.01)) {
    const steps = Math.max(1, Math.ceil(Math.abs(phi1 - phi0) / 0.004));
    for (let k = 1; k <= steps; k++) sweep(grid, placed(s, phi0 + ((phi1 - phi0) * k) / steps, points));
    return swept(grid);
  }

  /** The share of the square a full turn of the drill sweeps, measured on n rows. */
  function coverage(s, kind, n = 400) {
    const grid = sweepFor(n),
      points = outline(s, 0.01);
    sweep(grid, placed(s, 0, points));
    return drill(grid, s, 0, period(kind), points);
  }

  /** The exact share for the Reuleaux triangle: 2√3 + π/6 − 3. */
  const TRIANGLE_DRILL = 2 * Math.sqrt(3) + Math.PI / 6 - 3;

  /** A small seedable generator (mulberry32), so a lopsided shape can be drawn again exactly. */
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  Wonderlattice.models.rollers = {
    TRIANGLE_DRILL,
    fromLines,
    circle,
    reuleaux,
    starLines,
    lopsided,
    lopsidedLines,
    shape,
    h,
    slope,
    point,
    integral,
    outline,
    width,
    perimeter,
    area,
    bob,
    roll,
    drift,
    spacing,
    inSquare,
    placed,
    sweepFor,
    rowY,
    sweep,
    swept,
    drill,
    period,
    coverage,
    rng,
  };
})();
