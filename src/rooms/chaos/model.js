/*
 * Random jumps, perfect triangle · the chaos game.
 * A dot jumps part of the way towards a corner picked at random, again and again. Each jump is one of a few
 * contracting maps, and such a set of maps (an iterated function system) has exactly one shape it settles onto, its
 * attractor (Hutchinson 1981); the random order of the jumps visits all of it (Barnsley and Demko 1985). With three
 * corners and halfway jumps that shape is the Sierpiński triangle; with four it is the whole square.
 * https://en.wikipedia.org/wiki/Chaos_game · https://mathworld.wolfram.com/ChaosGame.html
 * M. F. Barnsley, Fractals Everywhere (Academic Press, 1988).
 * Pure functions, no DOM.
 */
(() => {
  'use strict';

  const TAU = Math.PI * 2;
  const EDGE = 0.92; // the regular shapes fill this much of the square [−1, 1]², so the corners can be grabbed
  const CORNERS = 6; // at most this many corners

  /** A small, fast random number generator with a seed (mulberry32), so a game can be played again exactly. */
  function random(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /**
   * The corners of a regular n-sided shape standing on a flat side (so the square is square, not a diamond), centred
   * and scaled so that it spans the square [−EDGE, EDGE]² in its longer direction (y points up).
   */
  function regular(n) {
    const turn = n % 2 ? 0 : Math.PI / n; // odd shapes have a corner at the top; even ones a side
    const raw = Array.from({ length: n }, (_, i) => {
      const a = Math.PI / 2 + turn + (i * TAU) / n;
      return [Math.cos(a), Math.sin(a)];
    });
    const xs = raw.map((p) => p[0]),
      ys = raw.map((p) => p[1]);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const scale = (2 * EDGE) / Math.max(x1 - x0, y1 - y0);
    return raw.map(([x, y]) => [(x - (x0 + x1) / 2) * scale, (y - (y0 + y1) / 2) * scale]);
  }

  /** The corners for `n` and a list of offsets [[dx, dy], …] from the regular places, kept inside [−1, 1]². */
  function corners(n, offsets = []) {
    return regular(n).map(([x, y], i) => {
      const [dx, dy] = offsets[i] || [0, 0];
      return [Math.max(-1, Math.min(1, x + dx)), Math.max(-1, Math.min(1, y + dy))];
    });
  }

  /**
   * The share of the way to jump for the n copies of a regular n-sided shape to just touch, with no gaps and no
   * overlaps between neighbours: 1/2 for the triangle and the square, 0.618… for the pentagon (the dot keeps
   * (3 − √5)/2 of its distance), 2/3 for the hexagon.
   */
  function touching(n) {
    let sum = 1;
    for (let k = 1; k <= Math.floor(n / 4); k++) sum += Math.cos((TAU * k) / n);
    return 1 - 1 / (2 * sum);
  }

  /**
   * How many jumps to leave out at the start: enough for a dot that starts anywhere in the picture to come closer to
   * the shape than a fraction of a pixel. Each jump keeps `keep` of the distance, so the error shrinks by that much.
   */
  function burnIn(keep) {
    return Math.max(20, Math.min(400, Math.ceil(Math.log(1 / 8000) / Math.log(keep))));
  }

  /**
   * Barnsley's fern: four maps x' = a x + b y + e, y' = c x + d y + f, each chosen with its own chance p. The first
   * draws the stem, the second the rest of the fern, one size smaller, and the last two the lowest left and right
   * leaflets (Barnsley, Fractals Everywhere).
   */
  const FERN = Object.freeze([
    { a: 0, b: 0, c: 0, d: 0.16, e: 0, f: 0, p: 0.01 },
    { a: 0.85, b: 0.04, c: -0.04, d: 0.85, e: 0, f: 1.6, p: 0.85 },
    { a: 0.2, b: -0.26, c: 0.23, d: 0.22, e: 0, f: 1.6, p: 0.07 },
    { a: -0.15, b: 0.28, c: 0.26, d: 0.24, e: 0, f: 0.44, p: 0.07 },
  ]);
  /** Where the fern lies, in its own coordinates. */
  const FERN_BOX = Object.freeze({ x0: -2.182, x1: 2.6558, y0: 0, y1: 9.9983 });

  /**
   * A game: the dot's place and the corner it last jumped to. `rule` forbids the same corner twice in a row.
   * `fern` plays Barnsley's four maps instead of the corners (in the fern's own coordinates).
   */
  function game({ corners: points = regular(3), keep = 0.5, rule = false, fern = false, start = [0, 0], seed = 1 }) {
    return { points, keep, rule, fern, x: start[0], y: start[1], last: -1, next: random(seed) };
  }

  /** One jump. Returns the index of the corner (or the fern's map) that was used. */
  function jump(g) {
    if (g.fern) {
      const r = g.next();
      let k = 0,
        sum = FERN[0].p;
      while (r >= sum && k < FERN.length - 1) sum += FERN[++k].p;
      const m = FERN[k];
      const x = m.a * g.x + m.b * g.y + m.e;
      g.y = m.c * g.x + m.d * g.y + m.f;
      g.x = x;
      g.last = k;
      return k;
    }
    const n = g.points.length;
    let k;
    if (g.rule && g.last >= 0) {
      // One of the other corners, each as likely.
      k = Math.floor(g.next() * (n - 1));
      if (k >= g.last) k++;
    } else k = Math.floor(g.next() * n);
    const [cx, cy] = g.points[k];
    g.x = cx + g.keep * (g.x - cx);
    g.y = cy + g.keep * (g.y - cy);
    g.last = k;
    return k;
  }

  /**
   * Whether (x, y) lies in the open middle hole of the triangle a, b, c: the triangle joining the midpoints of its
   * sides. There, every barycentric coordinate is below one half.
   */
  function inMiddle([x, y], [a, b, c]) {
    const det = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1]);
    if (Math.abs(det) < 1e-12) return false; // a flat triangle has no hole
    const u = ((b[1] - c[1]) * (x - c[0]) + (c[0] - b[0]) * (y - c[1])) / det;
    const v = ((c[1] - a[1]) * (x - c[0]) + (a[0] - c[0]) * (y - c[1])) / det;
    const w = 1 - u - v;
    const edge = 0.5 - 1e-9;
    return u < edge && v < edge && w < edge;
  }

  Wonderlattice.models.chaos = Object.freeze({
    EDGE,
    CORNERS,
    FERN,
    FERN_BOX,
    random,
    regular,
    corners,
    touching,
    burnIn,
    game,
    jump,
    inMiddle,
  });
})();
