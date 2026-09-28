/*
 * Weather twins · Lorenz's three equations, and why a forecast has a horizon. Pure functions, no DOM.
 *   dx/dt = σ(y − x),  dy/dt = x(ρ − z) − y,  dz/dt = xy − βz,  with σ = 10, ρ = 28, β = 8/3 (Lorenz, 1963).
 * Nearby starts separate roughly like e^(λt), with λ ≈ 0.9 per unit of time, so each extra decimal place of
 * precision buys about ln(10)/λ ≈ 2.5 more units of good forecast: a little more time, never a lot.
 */
(() => {
  'use strict';

  const SIGMA = 10,
    RHO = 28,
    BETA = 8 / 3;
  /** The largest Lyapunov exponent of the classic Lorenz system, per unit of time (about 0.906). */
  const LAMBDA = 0.906;
  /** A forecast counts as lost once the twins are this far apart (about a tenth of the butterfly's size). */
  const TOLERANCE = 5;
  const STEP = 0.005;

  function derivative([x, y, z]) {
    return [SIGMA * (y - x), x * (RHO - z) - y, x * y - BETA * z];
  }

  /** One classical Runge–Kutta step of length dt. */
  function step(p, dt = STEP) {
    const add = (a, b, k) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
    const k1 = derivative(p),
      k2 = derivative(add(p, k1, dt / 2)),
      k3 = derivative(add(p, k2, dt / 2)),
      k4 = derivative(add(p, k3, dt));
    return [0, 1, 2].map((i) => p[i] + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
  }

  /** Where a point is after `time` units (exact steps of dt, and a last shorter one). */
  function run(p, time, dt = STEP) {
    let q = p,
      left = time;
    while (left > 1e-12) {
      const h = Math.min(dt, left);
      q = step(q, h);
      left -= h;
    }
    return q;
  }

  const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

  /** A start already on the butterfly: (1, 1, 1) after its first 30 units, when the wandering-in is over. */
  const START = Object.freeze(run([1, 1, 1], 30, 0.01));

  /** A small repeatable random-number generator (mulberry32), so a shared link replays the same twins. */
  function random(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /**
   * `count` twins of `start`, each moved by 10^−digits in a random direction: the start measured to `digits`
   * decimal places. Twin 0 is the start itself (the "truth").
   */
  function twins(start, digits, count, seed = 1) {
    const rand = random(seed);
    const size = 10 ** -digits;
    const out = [start.slice()];
    for (let i = 1; i < count + 1; i++) {
      const z = 2 * rand() - 1,
        angle = 2 * Math.PI * rand(),
        r = Math.sqrt(1 - z * z);
      out.push([start[0] + size * r * Math.cos(angle), start[1] + size * r * Math.sin(angle), start[2] + size * z]);
    }
    return out;
  }

  /** How long the twins stay within TOLERANCE of the truth: the forecast horizon, found by running them. */
  function horizon(start, digits, count = 1, seed = 1, limit = 60) {
    let points = twins(start, digits, count, seed);
    for (let time = 0; time < limit; time += STEP) {
      points = points.map((p) => step(p));
      if (points.slice(1).some((p) => distance(p, points[0]) > TOLERANCE)) return time + STEP;
    }
    return limit;
  }

  /** The horizon the exponential rule predicts for a start measured to `digits` places. */
  const predictedHorizon = (digits) => Math.log(TOLERANCE / 10 ** -digits) / LAMBDA;

  /** Points along the butterfly itself, for drawing its faint outline. */
  function butterfly(count = 6000, dt = 0.01) {
    const out = [];
    let p = START;
    for (let i = 0; i < count; i++) {
      p = step(p, dt);
      out.push(p);
    }
    return out;
  }

  /**
   * Rotate by (rx, ry) about the butterfly's centre and project with mild perspective onto a canvas centred at
   * (cx, cy). Returns screen x, y and depth z (larger z is farther away).
   */
  function project([x0, y0, z0], { rx, ry, cx, cy, scale }) {
    const x = x0 / 20,
      y = (z0 - 25) / 20,
      z1 = y0 / 20;
    const c = Math.cos(ry),
      s = Math.sin(ry),
      xx = x * c + z1 * s,
      zz = -x * s + z1 * c,
      yy = -y * Math.cos(rx) - zz * Math.sin(rx),
      depth = -y * Math.sin(rx) + zz * Math.cos(rx),
      perspective = 5 / (5 + depth);
    return { x: cx + xx * scale * perspective, y: cy + yy * scale * perspective, z: depth };
  }

  Wonderlattice.models.weather = Object.freeze({
    SIGMA,
    RHO,
    BETA,
    LAMBDA,
    TOLERANCE,
    STEP,
    START,
    derivative,
    step,
    run,
    distance,
    twins,
    horizon,
    predictedHorizon,
    butterfly,
    project,
  });
})();
