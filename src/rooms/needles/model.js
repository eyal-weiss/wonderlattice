/*
 * Needles that know π · Buffon's needle and Barbier's noodle.
 * Lines run across the floor one plank width apart (the unit of length here). A needle of length l ≤ 1, dropped at
 * random, lands across a line with chance 2l/π; any curve of length L crosses 2L/π lines on average, whatever its
 * shape; a ring one plank wide crosses exactly 2, every time.
 * Pure functions, no DOM.
 */
(() => {
  'use strict';

  /** A small repeatable random generator (mulberry32), so a run is the same for the same seed. */
  function random(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /**
   * A direction chosen evenly from all directions, without using π: a random point in the square from −1 to 1, kept
   * only if it lies inside the circle, then stretched to length 1. Returns [cos, sin] of the needle's turn.
   */
  function direction(rand) {
    for (;;) {
      const x = 2 * rand() - 1,
        y = 2 * rand() - 1,
        r2 = x * x + y * y;
      if (r2 > 1e-12 && r2 <= 1) {
        const r = Math.sqrt(r2);
        return [x / r, y / r];
      }
    }
  }

  const NEEDLE = 0,
    ZIGZAG = 1,
    NOODLE = 2,
    RING = 3;
  // The zigzag's pieces lean this far either side of its line (about 50°), and the noodle bends by up to this much
  // between its pieces (about 20°). Fixed numbers, not fractions of π.
  const LEAN = [Math.cos(0.87), Math.sin(0.87)],
    BEND = 0.34,
    NOODLE_PIECES = 12;

  /**
   * A shape of total length `length` (in plank widths) as points round its middle, before it is turned: a straight
   * needle, a zigzag of four equal pieces, or a noodle of twelve equal pieces bending at random. (A ring is drawn and
   * counted on its own: see kit.)
   */
  function outline(kind, length, rand) {
    if (kind === ZIGZAG) {
      const piece = length / 4,
        [c, s] = LEAN;
      const pts = [0, 1, 2, 3, 4].map((i) => [i * piece * c, i % 2 ? piece * s : 0]);
      return centred(pts);
    }
    if (kind === NOODLE) {
      const piece = length / NOODLE_PIECES;
      let x = 0,
        y = 0,
        heading = 0,
        turn = (rand() - 0.5) * BEND;
      const pts = [[0, 0]];
      for (let i = 0; i < NOODLE_PIECES; i++) {
        // The bend drifts, so a noodle curls one way, then perhaps the other.
        turn = Math.max(-BEND, Math.min(BEND, turn + (rand() - 0.5) * BEND));
        heading += turn;
        x += piece * Math.cos(heading);
        y += piece * Math.sin(heading);
        pts.push([x, y]);
      }
      return centred(pts);
    }
    return [
      [-length / 2, 0],
      [length / 2, 0],
    ];
  }

  /** The same points, moved so their middle (halfway across their extent) is at the origin. */
  function centred(pts) {
    let x0 = Infinity,
      x1 = -Infinity,
      y0 = Infinity,
      y1 = -Infinity;
    for (const [x, y] of pts) {
      x0 = Math.min(x0, x);
      x1 = Math.max(x1, x);
      y0 = Math.min(y0, y);
      y1 = Math.max(y1, y);
    }
    return pts.map(([x, y]) => [x - (x0 + x1) / 2, y - (y0 + y1) / 2]);
  }

  /** How many times a path of points crosses the lines y = …, −1, 0, 1, 2, … */
  function crossings(pts) {
    let n = 0;
    for (let i = 1; i < pts.length; i++) n += Math.abs(Math.floor(pts[i][1]) - Math.floor(pts[i - 1][1]));
    return n;
  }

  /** The ring's radius: half a plank, so it is exactly as wide as a plank. */
  const RING_RADIUS = 0.5;
  const ringCrossings = (y) => 2 * (Math.floor(y + RING_RADIUS) - Math.floor(y - RING_RADIUS));
  /** How many different noodles a run throws, each as likely as the others. */
  const NOODLES = 48;

  /**
   * The shapes a run throws: one needle or zigzag, or a bag of different noodles, all of the same length (a ring
   * needs none). Made once per run, so throwing is quick.
   */
  function kit(kind, length, rand) {
    const outlines =
      kind === RING ? [] : Array.from({ length: kind === NOODLE ? NOODLES : 1 }, () => outline(kind, length, rand));
    return { kind, outlines };
  }

  /** How many lines an outline crosses with its middle at height y, turned to the direction (c, s). */
  function crossingsTurned(o, y, c, s) {
    let prev = Math.floor(y + o[0][0] * s + o[0][1] * c),
      n = 0;
    for (let i = 1; i < o.length; i++) {
      const next = Math.floor(y + o[i][0] * s + o[i][1] * c);
      n += Math.abs(next - prev);
      prev = next;
    }
    return n;
  }

  const pickOutline = (k, rand) =>
    k.outlines.length > 1 ? k.outlines[Math.floor(rand() * k.outlines.length)] : k.outlines[0];

  /**
   * One throw of a shape from the kit. The middle lands at a random height `y` across a plank (0 to 1: the lines are
   * at whole numbers, so only this matters) and a random place `u` (0 to 1) along the floor, for drawing; the shape
   * turns to a random direction. Returns the turned points round the middle (`pts`, none for a ring), and how many
   * lines it crosses.
   */
  function throwOnce(k, rand) {
    const u = rand(),
      y = rand();
    if (k.kind === RING) return { u, y, pts: null, n: ringCrossings(y) };
    const [c, s] = direction(rand);
    const o = pickOutline(k, rand);
    const pts = o.map(([x, py]) => [x * c - py * s, x * s + py * c]);
    return { u, y, pts, n: crossingsTurned(o, y, c, s) };
  }

  /** `count` throws at once, without keeping them: how many lines they crossed in all (the same as throwOnce's). */
  function run(k, count, rand) {
    let crossed = 0;
    for (let i = 0; i < count; i++) {
      rand(); // the place along the floor, unused here, so the throws match throwOnce's
      const y = rand();
      if (k.kind === RING) {
        crossed += ringCrossings(y);
        continue;
      }
      // direction(), written out here to save making an array per throw.
      let x, z, r2;
      do {
        x = 2 * rand() - 1;
        z = 2 * rand() - 1;
        r2 = x * x + z * z;
      } while (!(r2 > 1e-12 && r2 <= 1));
      const r = Math.sqrt(r2);
      crossed += crossingsTurned(pickOutline(k, rand), y, x / r, z / r);
    }
    return crossed;
  }

  /** A shape's length in plank widths: a ring one plank wide is π planks round. */
  const lengthOf = (kind, length) => (kind === RING ? Math.PI * 2 * RING_RADIUS : length);

  /** The average number of lines a shape of this length crosses: 2L/π (Barbier). */
  const expected = (length) => (2 * length) / Math.PI;

  /** π, as the throws estimate it: crossings ≈ throws × 2L/π, so π ≈ 2L × throws ÷ crossings. */
  const estimate = (length, throws, crossed) => (crossed > 0 ? (2 * length * throws) / crossed : Infinity);

  /**
   * How far the estimate typically strays from π after `throws` straight needles of length `length` ≤ 1 (one
   * standard deviation, for many throws): π·√((1 − p) / (p·n)), with p = 2l/π the chance of a crossing.
   */
  function spread(length, throws) {
    const p = expected(length);
    return Math.PI * Math.sqrt((1 - p) / (p * throws));
  }

  /** The middle value of a list of numbers. */
  function median(values) {
    if (!values.length) return NaN;
    const v = values.slice().sort((a, b) => a - b),
      h = Math.floor(v.length / 2);
    return v.length % 2 ? v[h] : (v[h - 1] + v[h]) / 2;
  }

  /**
   * Lazzarini's report (1901): needles 5/6 of a plank long, 3,408 throws, and so 1,808 crossings, which gives
   * (5/3) × 3,408 ÷ 1,808 = 355/113 = 3.1415929…, wrong only in the seventh decimal.
   */
  const LAZZARINI = Object.freeze({ length: 5 / 6, throws: 3408, crossings: 1808 });

  Wonderlattice.models.needles = Object.freeze({
    NEEDLE,
    ZIGZAG,
    NOODLE,
    RING,
    RING_RADIUS,
    LAZZARINI,
    random,
    direction,
    outline,
    kit,
    crossings,
    throwOnce,
    run,
    lengthOf,
    expected,
    estimate,
    spread,
    median,
  });
})();
