/*
 * The sunflower's secret angle · Vogel's model of a flower head. Pure functions, no DOM.
 *
 * Seed n (n = 1, 2, 3, …) sits at angle n·θ and at distance √n from the centre, so every seed takes the same area
 * and each one is turned by θ from the one before (H. Vogel, 1979). If θ is a fraction p/q of a full turn, seeds n
 * and n + q lie on one line from the centre: q straight spokes. Close to p/q, those lines bend into q curved arms.
 * The golden angle, 360°/φ² ≈ 137.508°, keeps away from every simple fraction, so the seeds pack with no gaps, and
 * the arms you can count are pairs of neighbouring Fibonacci numbers, larger further out.
 *
 * Directions follow mathematics: angles grow anticlockwise. An arm "turns anticlockwise" when, followed outwards,
 * it winds anticlockwise.
 */
(() => {
  'use strict';

  const TAU = Math.PI * 2;
  const GOLDEN = 180 * (3 - Math.sqrt(5)); // 360°/φ² = 137.50776…°
  const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];
  const REACH = 260; // the furthest seed (in the order they grow) checked as a neighbour
  const LOOSE = 1.6; // a family of arms is "seen" when its links are at most this much longer than the shortest

  /** Seed n's place, for a turn of `angle` degrees between seeds: [x, y], y upwards. */
  function seed(n, angle) {
    const a = ((n * angle) % 360) * (TAU / 360),
      r = Math.sqrt(n);
    return [r * Math.cos(a), r * Math.sin(a)];
  }

  /** An angle in degrees brought into (−180°, 180°]. */
  function wrap(degrees) {
    const d = ((degrees % 360) + 360) % 360;
    return d > 180 ? d - 360 : d;
  }

  /** How far `m` seeds on turn the line from the centre, in degrees: n·θ and (n + m)·θ, compared. */
  const drift = (m, angle) => wrap(m * angle);

  /**
   * The nearest seeds further out than seed n, in three families: arms that turn anticlockwise going outwards,
   * arms that turn clockwise, and seeds straight out along the same spoke. Each is { offset, distance } (the
   * neighbour is seed n + offset), or null. `last` is the number of seeds grown so far.
   */
  function neighbours(n, angle, last = Infinity, reach = REACH) {
    const [x, y] = seed(n, angle);
    const best = { anticlockwise: null, clockwise: null, spoke: null };
    for (let m = 1; m <= reach && n + m <= last; m++) {
      const [u, v] = seed(n + m, angle);
      const distance = Math.hypot(u - x, v - y);
      const d = drift(m, angle);
      const family = Math.abs(d) < 1e-9 ? 'spoke' : d > 0 ? 'anticlockwise' : 'clockwise';
      if (!best[family] || distance < best[family].distance) best[family] = { offset: m, distance };
    }
    return best;
  }

  /**
   * What the eye sees around seed n: 'spokes' (q seeds on each line from the centre), 'gaps' (one family of curved
   * arms with empty space between them) or 'packed' (two families crossing, no gaps). `arms` lists the families
   * that are seen, nearest first, each { family, offset, distance }. The number of arms in a family is its offset:
   * every q-th seed lies on the same arm, so there are q of them.
   */
  function pattern(n, angle, last = Infinity) {
    const found = neighbours(n, angle, last);
    const all = Object.entries(found)
      .filter(([, f]) => f)
      .map(([family, f]) => ({ family, ...f }))
      .sort((a, b) => a.distance - b.distance);
    if (!all.length) return { kind: 'packed', arms: [] };
    const shortest = all[0].distance;
    const arms = all.filter((f) => f.distance <= shortest * LOOSE);
    if (all[0].family === 'spoke') return { kind: 'spokes', arms: [all[0]], count: all[0].offset };
    const turning = arms.filter((f) => f.family !== 'spoke');
    if (turning.length < 2) return { kind: 'gaps', arms: [all[0]], count: all[0].offset };
    return { kind: 'packed', arms: turning, count: turning[0].offset };
  }

  /** The continued fraction of x (0 ≤ x < 1), up to `terms` terms: x = 1/(a₁ + 1/(a₂ + …)). */
  function continuedFraction(x, terms = 12) {
    const out = [];
    let rest = x;
    for (let i = 0; i < terms && rest > 1e-12; i++) {
      const inverse = 1 / rest;
      const a = Math.floor(inverse + 1e-9);
      out.push(a);
      rest = inverse - a;
    }
    return out;
  }

  /**
   * A simple fraction p/q of a full turn within `tolerance` degrees of `angle`, with the smallest q up to `most`,
   * or null. 135° gives { p: 3, q: 8 }.
   */
  function fraction(angle, most = 12, tolerance = 0.0005) {
    for (let q = 1; q <= most; q++) {
      const p = Math.round((angle * q) / 360);
      if (Math.abs(angle - (360 * p) / q) <= tolerance) return { p, q };
    }
    return null;
  }

  /** True when n is a Fibonacci number (1, 2, 3, 5, 8, 13, …). */
  const isFibonacci = (n) => FIBONACCI.includes(n);

  Wonderlattice.models.sunflower = Object.freeze({
    GOLDEN,
    FIBONACCI,
    REACH,
    LOOSE,
    seed,
    wrap,
    drift,
    neighbours,
    pattern,
    continuedFraction,
    fraction,
    isFibonacci,
  });
})();
