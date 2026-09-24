/*
 * Bend the plane · complex functions as maps of the whole plane. A complex
 * number is a pair [re, im]. Each map comes with its derivative, so the room
 * can show how a tiny compass is turned and stretched (the derivative is the
 * local "amplitwist", in Needham's word, of Visual Complex Analysis, ch. 4).
 * Where f′(z) ≠ 0 an analytic map is conformal: it keeps angles (MIT OCW 18.04,
 * topic 10, theorem 10.4). The Joukowski map z + 1/z and the idealised flow
 * past a circle with circulation follow the classical airfoil construction.
 * Pure functions, no DOM.
 */
(() => {
  'use strict';

  // ---- Complex arithmetic on [re, im] pairs ----------------------------------

  const ZERO = [0, 0],
    ONE = [1, 0],
    I = [0, 1];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  const scale = (a, k) => [a[0] * k, a[1] * k];
  const abs = (a) => Math.hypot(a[0], a[1]);
  const arg = (a) => Math.atan2(a[1], a[0]);
  const conj = (a) => [a[0], -a[1]];
  const polar = (r, angle) => [r * Math.cos(angle), r * Math.sin(angle)];
  /** a / b. Division by zero gives [Infinity, Infinity] or NaN, which the sampler treats as a pole. */
  function div(a, b) {
    const d = b[0] * b[0] + b[1] * b[1];
    return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d];
  }
  const exp = (a) => polar(Math.exp(a[0]), a[1]);
  const sin = (a) => [Math.sin(a[0]) * Math.cosh(a[1]), Math.cos(a[0]) * Math.sinh(a[1])];
  const cos = (a) => [Math.cos(a[0]) * Math.cosh(a[1]), -Math.sin(a[0]) * Math.sinh(a[1])];
  const finite = (a) => Number.isFinite(a[0]) && Number.isFinite(a[1]);
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

  /** The angle between two vectors (complex numbers), from 0 to π. */
  const angleBetween = (a, b) => Math.abs(arg(div(b, a)));

  // ---- The maps ---------------------------------------------------------------

  /**
   * Each map has f and its derivative df, the part of the plane its pictures
   * fill (`frame`: centre and half-widths), the part of the image plane worth
   * showing (`image`), grid spacing, where a drawing sits (`spot`: its
   * centre and size, placed where the map does something to look at), and
   * its special points: `critical`
   * (f′ = 0, where angles are not kept) and `poles` (f = ∞).
   */
  const FUNCTIONS = [
    {
      id: 'square',
      f: (z) => mul(z, z),
      df: (z) => scale(z, 2),
      frame: { cx: 0, cy: 0, rx: 1.5, ry: 1.5 },
      image: { cx: 0, cy: 0, rx: 2.3, ry: 2.3 },
      grid: { dx: 0.25, dy: 0.25 },
      spot: { c: [0.72, 0.62], size: 0.62 },
      critical: [ZERO],
      poles: [],
    },
    {
      id: 'invert',
      f: (z) => div(ONE, z),
      df: (z) => scale(div(ONE, mul(z, z)), -1),
      frame: { cx: 0, cy: 0, rx: 2, ry: 2 },
      image: { cx: 0, cy: 0, rx: 2, ry: 2 },
      grid: { dx: 0.4, dy: 0.4 },
      spot: { c: [0.95, 0.55], size: 0.62 },
      critical: [],
      poles: [ZERO],
    },
    {
      id: 'exp',
      f: exp,
      df: exp,
      frame: { cx: -0.3, cy: 0, rx: 1.5, ry: Math.PI },
      image: { cx: 0, cy: 0, rx: 3.5, ry: 3.5 },
      grid: { dx: 0.3, dy: Math.PI / 8 },
      spot: { c: [-0.2, 0.1], size: 1.7 },
      critical: [],
      poles: [],
    },
    {
      id: 'sin',
      f: sin,
      df: cos,
      frame: { cx: 0, cy: 0, rx: 1.85, ry: 1.2 },
      image: { cx: 0, cy: 0, rx: 1.9, ry: 1.75 },
      grid: { dx: Math.PI / 12, dy: 0.2 },
      spot: { c: [0.35, 0.3], size: 1.15 },
      critical: [
        [-Math.PI / 2, 0],
        [Math.PI / 2, 0],
      ],
      poles: [],
    },
    {
      id: 'joukowski',
      f: (z) => add(z, div(ONE, z)),
      df: (z) => sub(ONE, div(ONE, mul(z, z))),
      frame: { cx: 0, cy: 0, rx: 2.2, ry: 2.2 },
      image: { cx: -0.1, cy: 0.1, rx: 2.55, ry: 1.7 },
      grid: { dx: 0.4, dy: 0.4 },
      spot: { c: [0.85, 0.95], size: 0.75 },
      critical: [
        [-1, 0],
        [1, 0],
      ],
      poles: [ZERO],
    },
  ];
  const JOUKOWSKI = FUNCTIONS.findIndex((fn) => fn.id === 'joukowski');

  /**
   * The straight-line blend from the identity to f: w_t(z) = (1 − t)z + t·f(z).
   * A visual aid for the "Bend it" slider. Each blend is itself analytic, with
   * its own critical points, so it is not a path the plane "really" travels.
   */
  function blend(index, t) {
    const fn = FUNCTIONS[index];
    if (t >= 1) return { f: fn.f, df: fn.df };
    return {
      f: (z) => add(scale(z, 1 - t), scale(fn.f(z), t)),
      df: (z) => add([1 - t, 0], scale(fn.df(z), t)),
    };
  }

  /** The view of the image plane at blend t: from the picture's frame (t = 0) to the map's image (t = 1). */
  function imageView(index, t) {
    const { frame, image } = FUNCTIONS[index];
    const mix = (key) => frame[key] + (image[key] - frame[key]) * t;
    return { cx: mix('cx'), cy: mix('cy'), rx: mix('rx'), ry: mix('ry') };
  }

  /** The derivative estimated by a central difference, for checking df. */
  function numericDerivative(f, z, h = 1e-5) {
    return scale(sub(f(add(z, [h, 0])), f(sub(z, [h, 0]))), 1 / (2 * h));
  }

  /**
   * The angle between the images of two short arrows from z, of length h in
   * directions u and v. For small h this tends to the angle between u and v
   * wherever f′(z) ≠ 0; at a simple critical point it doubles.
   */
  function imageAngle(f, z, u, v, h = 1e-4) {
    const w = f(z);
    return angleBetween(sub(f(add(z, scale(u, h))), w), sub(f(add(z, scale(v, h))), w));
  }

  // ---- Curves and sampling ------------------------------------------------------

  /** A curve through a list of points, as a function of t in [0, 1] (evenly by arc length). */
  function polyline(points, closed = false) {
    const pts = closed ? [...points, points[0]] : points;
    const lengths = [0];
    for (let i = 1; i < pts.length; i++) lengths.push(lengths[i - 1] + abs(sub(pts[i], pts[i - 1])));
    const total = lengths[lengths.length - 1];
    return (t) => {
      const s = t * total;
      let i = 1;
      while (i < pts.length - 1 && lengths[i] < s) i++;
      const span = lengths[i] - lengths[i - 1] || 1;
      return lerp(pts[i - 1], pts[i], (s - lengths[i - 1]) / span);
    };
  }
  const segment = (a, b) => (t) => lerp(a, b, t);
  const circle =
    (c, r, from = 0, to = 2 * Math.PI) =>
    (t) =>
      add(c, polar(r, from + (to - from) * t));

  /**
   * Map a curve at(t), t in [0, 1], through `map` into polylines. Starts from
   * `n` even steps and halves any step whose image is longer than `maxStep`,
   * up to `depth` times, so the image stays smooth where the map stretches.
   * Near a pole the image runs off to infinity: points beyond `limit` of
   * `centre`, or not finite, end the current piece, and so does a step that
   * still jumps more than `maxJump` after all its halving. The result is a
   * list of pieces, each an array of [x, y] image points.
   */
  function sampleCurve(map, at, { n = 120, maxStep = 0.02, maxJump = 0.5, depth = 9, limit = 40, centre = ZERO } = {}) {
    const pieces = [];
    let piece = [];
    const ok = (w) => finite(w) && abs(sub(w, centre)) < limit;
    const finish = () => {
      if (piece.length > 1) pieces.push(piece);
      piece = [];
    };
    const emit = (w) => piece.push(w);
    function step(t0, w0, t1, w1, d) {
      const good0 = ok(w0),
        good1 = ok(w1);
      if (good0 && good1 && abs(sub(w1, w0)) <= maxStep) return emit(w1);
      if (d === 0) {
        if (good0 && good1 && abs(sub(w1, w0)) <= maxJump) return emit(w1);
        finish();
        if (good1) emit(w1);
        return;
      }
      const tm = (t0 + t1) / 2,
        wm = map(at(tm));
      step(t0, w0, tm, wm, d - 1);
      step(tm, wm, t1, w1, d - 1);
    }
    let t0 = 0,
      w0 = map(at(0));
    if (ok(w0)) emit(w0);
    for (let i = 1; i <= n; i++) {
      const t1 = i / n,
        w1 = map(at(t1));
      step(t0, w0, t1, w1, depth);
      t0 = t1;
      w0 = w1;
    }
    finish();
    return pieces;
  }

  // ---- Pictures -------------------------------------------------------------------

  /** The offset circle for the wing: centre (−thick, camber), through z = 1, so it encloses −1. */
  function wingCircle(thick, camber) {
    const c = [-thick, camber];
    return { c, r: abs(sub(ONE, c)) };
  }

  // A fish facing right, in a box about [-1, 1] × [-0.6, 0.6].
  const fishBody = (() => {
    const top = [],
      bottom = [];
    for (let k = 0; k <= 24; k++) {
      const x = 0.78 - (1.36 * k) / 24,
        h = 0.4 * Math.pow(Math.max(0, 1 - ((x - 0.1) / 0.68) ** 2), 0.75);
      top.push([x, h]);
      bottom.unshift([x, -h * 0.92]);
    }
    return [...top, ...bottom.slice(1)];
  })();
  const FISH = [
    { closed: true, points: fishBody },
    {
      points: [
        [-0.56, 0],
        [-0.96, 0.44],
        [-0.84, 0],
        [-0.96, -0.44],
        [-0.56, 0],
      ],
    },
    {
      points: [
        [0.02, 0.37],
        [-0.16, 0.62],
        [-0.3, 0.34],
      ],
    },
    { arc: [[0.08, 0], 0.3, -0.95, 0.95] },
    { arc: [[-0.12, 0], 0.26, -0.9, 0.9] },
    { arc: [[-0.3, 0], 0.2, -0.85, 0.85] },
    { arc: [[0.46, 0.1], 0.065, 0, 2 * Math.PI], eye: true },
    {
      points: [
        [0.78, 0.0],
        [0.68, -0.05],
      ],
    },
  ];
  // A round face: head, eyes, nose, smile, and a curl of hair.
  const FACE = [
    { arc: [[0, 0], 0.82, 0, 2 * Math.PI] },
    { arc: [[-0.3, 0.24], 0.11, 0, 2 * Math.PI], eye: true },
    { arc: [[0.3, 0.24], 0.11, 0, 2 * Math.PI], eye: true },
    {
      points: [
        [0.02, 0.12],
        [-0.07, -0.12],
        [0.05, -0.14],
      ],
    },
    { arc: [[0, 0.02], 0.46, Math.PI * 1.18, Math.PI * 1.82] },
    { arc: [[-0.1, 0.9], 0.2, Math.PI * 1.05, Math.PI * 1.95] },
  ];

  const PICTURES = ['grid', 'fish', 'face', 'polar', 'wing'];

  /**
   * The strokes of a picture for a map's frame, in z. Each stroke is
   * { at, n, family, index, count }: a curve at(t), a base sample count, and a
   * family ('x' for horizontal lines, 'y' for vertical ones, 'ring' and 'ray'
   * for circles and rays, 'ink' for drawings, 'eye' for filled dots) with its
   * position in the family, so the room can colour them. A grid can be
   * given its own `frame`, to fill a bigger view.
   */
  function picture(name, index, { thick = 0.12, camber = 0.1, frame = FUNCTIONS[index].frame } = {}) {
    const { grid, spot } = FUNCTIONS[index];
    const { cx, cy, rx, ry } = frame;
    const strokes = [];
    if (name === 'grid') {
      const along = (c, d, r) => {
        const first = Math.ceil((c - r - 1e-9) / d),
          last = Math.floor((c + r + 1e-9) / d);
        return Array.from({ length: last - first + 1 }, (_, k) => (first + k) * d);
      };
      const xs = along(cx, grid.dx, rx),
        ys = along(cy, grid.dy, ry);
      ys.forEach((y, k) =>
        strokes.push({ at: segment([cx - rx, y], [cx + rx, y]), n: 160, family: 'x', index: k, count: ys.length }),
      );
      xs.forEach((x, k) =>
        strokes.push({ at: segment([x, cy - ry], [x, cy + ry]), n: 160, family: 'y', index: k, count: xs.length }),
      );
      return strokes;
    }
    if (name === 'wing') {
      const { c, r } = wingCircle(thick, camber);
      strokes.push({ at: circle(c, r), n: 360, family: 'ink', index: 0, count: 1 });
      return strokes;
    }
    // Circles and rays sit at the centre of the frame; drawings sit on the map's spot.
    let size = Math.min(rx, ry) * 0.85,
      place = (p) => [cx + p[0] * size, cy + p[1] * size];
    if (name === 'polar') {
      for (let k = 1; k <= 5; k++)
        strokes.push({ at: circle(place(ZERO), (size * k) / 5), n: 240, family: 'ring', index: k - 1, count: 5 });
      for (let k = 0; k < 16; k++) {
        const end = polar(1, (k * Math.PI) / 8);
        strokes.push({ at: segment(place(ZERO), place(end)), n: 80, family: 'ray', index: k, count: 16 });
      }
      return strokes;
    }
    size = spot.size;
    place = (p) => [spot.c[0] + p[0] * size, spot.c[1] + p[1] * size];
    const parts = name === 'fish' ? FISH : FACE;
    parts.forEach((part, k) => {
      const at = part.arc
        ? circle(place(part.arc[0]), part.arc[1] * size, part.arc[2], part.arc[3])
        : polyline(part.points.map(place), part.closed);
      strokes.push({ at, n: part.arc ? 90 : 200, family: part.eye ? 'eye' : 'ink', index: k, count: parts.length });
    });
    return strokes;
  }

  // ---- Idealised flow past the wing ------------------------------------------------

  /**
   * Steady, frictionless flow from the left past the offset circle, with just
   * enough circulation that the rear stagnation point sits at z = 1 (the Kutta
   * condition). The complex potential, with ζ = z − c, is
   *   F = ζ + r²/ζ + i·k·log ζ,   k = −2r·sin β,   where 1 − c = r·e^{iβ}.
   * Returns F′ (the fluid's velocity is its conjugate).
   */
  function wingVelocity(thick, camber) {
    const { c, r } = wingCircle(thick, camber),
      k = -2 * r * Math.sin(arg(sub(ONE, c)));
    return (z) => {
      const zeta = sub(z, c);
      return add(sub(ONE, scale(div(ONE, mul(zeta, zeta)), r * r)), div([0, k], zeta));
    };
  }

  /**
   * Streamlines of that flow in the z-plane, traced with RK4 in steps of
   * `step` along the flow, from `count` seeds on the line x = x0 between
   * −height and height, until x passes x1. Each is { points, speed }: the
   * points, and the flow speed |F′| at each.
   */
  function wingStreamlines(thick, camber, { count = 13, x0 = -4, x1 = 4, height = 2.6, step = 0.025 } = {}) {
    const dF = wingVelocity(thick, camber),
      { c, r } = wingCircle(thick, camber);
    const direction = (z) => {
      const v = conj(dF(z)),
        s = abs(v);
      return s > 1e-6 ? scale(v, 1 / s) : null;
    };
    const lines = [];
    for (let k = 0; k < count; k++) {
      let z = [x0, -height + (2 * height * (k + 0.5)) / count];
      const points = [z],
        speed = [abs(dF(z))];
      for (let n = 0; n < 4000 && z[0] < x1; n++) {
        const k1 = direction(z),
          k2 = k1 && direction(add(z, scale(k1, step / 2))),
          k3 = k2 && direction(add(z, scale(k2, step / 2))),
          k4 = k3 && direction(add(z, scale(k3, step)));
        if (!k4) break;
        const next = add(z, scale(add(add(k1, scale(k2, 2)), add(scale(k3, 2), k4)), step / 6));
        if (abs(sub(next, c)) < r * 1.001) break; // ran into the circle at the front stagnation point
        z = next;
        points.push(z);
        speed.push(abs(dF(z)));
        if (speed[speed.length - 1] < 1e-3) break;
      }
      lines.push({ points, speed });
    }
    return lines;
  }

  Wonderloom.models.plane = Object.freeze({
    ZERO,
    ONE,
    I,
    add,
    sub,
    mul,
    div,
    scale,
    abs,
    arg,
    conj,
    polar,
    exp,
    sin,
    cos,
    finite,
    angleBetween,
    FUNCTIONS,
    JOUKOWSKI,
    PICTURES,
    blend,
    imageView,
    numericDerivative,
    imageAngle,
    polyline,
    segment,
    circle,
    sampleCurve,
    picture,
    wingCircle,
    wingVelocity,
    wingStreamlines,
  });
})();
