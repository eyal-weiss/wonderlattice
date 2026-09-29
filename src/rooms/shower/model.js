/*
 * The shower that never settles · the shower equation, e′(t) = −k·e(t − d) (C. Budd, Plus Magazine).
 * A bather turns the tap at a rate proportional to how far the water they feel is from just right, but the water
 * takes d seconds to come up the pipe, so what they feel is the tap as it was d seconds ago. Trying e = e^{λt} gives
 * λ = −k·e^{−λd}, and everything depends on the product kd: up to 1/e the temperature settles without overshooting,
 * up to π/2 it settles after wobbles that die away, and beyond π/2 the wobbles grow. The tap has two stops, which
 * turn that growth into a steady swing between them.
 * Pure functions, no DOM.
 */
(() => {
  'use strict';

  const COLD = 10, // °C, the tap turned fully cold
    HOT = 55, // °C, fully hot
    TARGET = 38; // °C, just right
  const RATE = 60, // steps a second
    DT = 1 / RATE;
  const MAX_DELAY = 5; // seconds of travel in the longest pipe
  const SMOOTH = 1 / Math.E, // kd up to here: no overshoot
    EDGE = Math.PI / 2; // kd from here on: never settles

  /** 0: settles without overshooting (kd ≤ 1/e) · 1: settles after wobbles that die away · 2: never settles. */
  const regime = (kd) => (kd <= SMOOTH ? 0 : kd < EDGE ? 1 : 2);

  /** The largest impatience k that still settles with a pipe of d seconds, and the largest that never overshoots. */
  const safeLimit = (d) => EDGE / d;
  const smoothLimit = (d) => SMOOTH / d;

  /** Bisection for an increasing function f: the x in [lo, hi] where f(x) = value. */
  function solve(f, value, lo, hi) {
    for (let i = 0; i < 200; i++) {
      const mid = (lo + hi) / 2;
      if (f(mid) < value) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  }

  /**
   * The slowest-fading (or fastest-growing) solution e^{λt} of λ = −k·e^{−λd}, as μ = λd, which is W₀(−kd), the
   * principal branch of the Lambert W function. Up to kd = 1/e it is real, in [−1, 0), where μ·e^μ = −kd. Beyond,
   * μ = a + ib with 0 < b < π: then a = −b·cot b and kd = (b / sin b)·e^a, which grows steadily with b.
   */
  function root(kd) {
    if (kd <= SMOOTH) return { re: solve((m) => m * Math.exp(m), -kd, -1, 0), im: 0 };
    const size = (b) => (b / Math.sin(b)) * Math.exp(-b / Math.tan(b));
    const b = solve(size, kd, 1e-9, Math.PI - 1e-9);
    return { re: -b / Math.tan(b), im: b };
  }

  /**
   * The swing of the linear equation, if it has one: its period in seconds, and how many times bigger each swing is
   * than the one before (below 1 it fades, above 1 it grows until the tap reaches a stop). Null when kd ≤ 1/e.
   */
  function wobble(k, d) {
    const { re, im } = root(k * d);
    if (!im) return null;
    return { period: (2 * Math.PI * d) / im, ratio: Math.exp((2 * Math.PI * re) / im) };
  }

  /**
   * A shower whose tap, and the whole pipe, start at one temperature: cold, unless told otherwise. `past` remembers
   * the tap at every step for the longest pipe, so the pipe can be changed while the water runs. `stops` are the
   * coldest and hottest the tap goes; tests pass [−∞, ∞] to follow the linear equation itself.
   */
  function shower(start = COLD, stops = [COLD, HOT]) {
    const size = MAX_DELAY * RATE + 3;
    return { n: 0, t: 0, tap: start, stops, size, past: new Float64Array(size).fill(start) };
  }

  /** The tap as it was `ago` seconds ago, read between steps in a straight line. Before the start: where it began. */
  function tapAgo(s, ago) {
    const steps = Math.max(0, Math.min(ago, MAX_DELAY)) * RATE;
    const whole = Math.floor(steps),
      part = steps - whole;
    const at = (m) => s.past[(((s.n - m) % s.size) + s.size) % s.size];
    return part ? at(whole) * (1 - part) + at(whole + 1) * part : at(whole);
  }

  /** The water on the bather now, with a pipe of d seconds: what left the tap d seconds ago. */
  const felt = (s, d) => tapAgo(s, d);

  /**
   * One step of DT seconds. The bather turns the tap at k degrees a second for each degree the water they feel is
   * off, using the water felt at the start and at the end of the step (the trapezoid rule), and the tap stops at
   * its stops. Given `hand`, a temperature, the visitor has set the tap there instead.
   */
  function step(s, k, d, hand) {
    const next = hand === undefined ? s.tap - (k * DT * (tapAgo(s, d) + tapAgo(s, d - DT) - 2 * TARGET)) / 2 : hand;
    s.tap = Math.min(s.stops[1], Math.max(s.stops[0], next));
    s.n++;
    s.t = s.n * DT;
    s.past[s.n % s.size] = s.tap;
  }

  /** Run a bather for a number of seconds from a cold start: the water felt and the tap, at every step. */
  function run(k, d, seconds, start = COLD, stops = [COLD, HOT]) {
    const s = shower(start, stops),
      steps = Math.round(seconds * RATE);
    const water = new Float64Array(steps + 1),
      tap = new Float64Array(steps + 1);
    water[0] = felt(s, d);
    tap[0] = s.tap;
    for (let i = 1; i <= steps; i++) {
      step(s, k, d);
      water[i] = felt(s, d);
      tap[i] = s.tap;
    }
    return { water, tap };
  }

  Wonderlattice.models.shower = Object.freeze({
    COLD,
    HOT,
    TARGET,
    RATE,
    DT,
    MAX_DELAY,
    SMOOTH,
    EDGE,
    regime,
    safeLimit,
    smoothLimit,
    root,
    wobble,
    shower,
    tapAgo,
    felt,
    step,
    run,
  });
})();
