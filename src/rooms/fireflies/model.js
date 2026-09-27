/*
 * A body full of clocks · coupled oscillators (the Kuramoto model), with an optional day–night drive.
 * Pure functions, no DOM.
 *
 * Each clock i has a phase θᵢ (radians) and a natural frequency ωᵢ (cycles per second). It moves on at its own
 * pace and is pulled towards the group's average rhythm (the mean field R·e^{iψ}) with strength K:
 *
 *     dθᵢ/dt = 2π·ωᵢ + K·R·sin(ψ − θᵢ) + F·sin(φ − θᵢ)
 *
 * where the last term is an outside rhythm (a day–night cycle with phase φ) of strength F, when it is on.
 * For natural frequencies spread like a bell curve with standard deviation σ (in radians per second), a shared
 * rhythm starts to grow past K = 2 / (π·g(0)) = σ·√(8/π) in the limit of many clocks (Kuramoto, 1975).
 */
(() => {
  'use strict';

  const TAU = Math.PI * 2;
  const MEAN = 0.55; // natural frequency, cycles per second: a flash every 1.8 s
  const SPREAD = 0.09; // standard deviation of the natural frequencies, cycles per second
  const LOW = 0.35,
    HIGH = 0.78; // every frequency stays in here, so no clock ever flashes quickly
  const CRITICAL = TAU * SPREAD * Math.sqrt(8 / Math.PI); // the coupling where a shared rhythm starts to grow
  const FLIGHT = TAU / 3; // eight time zones: a third of a day
  const DRIVE = 0.3; // how strongly the day–night cycle pulls, radians per second: weak, so catching up takes days

  /** A reproducible random source (Park–Miller), so the same seed gives the same meadow. */
  function random(seed) {
    let s = seed % 2147483647 || 1;
    return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  }

  /** Normally distributed numbers (Box–Muller) from a uniform source. */
  function gauss(rand) {
    const u = Math.max(rand(), 1e-12),
      v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
  }

  /** `count` clocks: random phases, bell-shaped natural frequencies (kept between LOW and HIGH), places to sit. */
  function seed(count, seedValue = 7) {
    const rand = random(seedValue);
    return Array.from({ length: count }, () => {
      let w;
      do w = MEAN + SPREAD * gauss(rand);
      while (w < LOW || w > HIGH);
      return { phase: rand() * TAU, freq: w, x: rand(), y: rand(), drift: rand() * TAU };
    });
  }

  /** How together the clocks are: R in [0, 1] (1 = all in step) and the average phase ψ. */
  function order(clocks, offset = 0) {
    let c = 0,
      s = 0;
    for (const k of clocks) {
      c += Math.cos(k.phase - offset);
      s += Math.sin(k.phase - offset);
    }
    const n = Math.max(clocks.length, 1);
    return { r: Math.hypot(c, s) / n, psi: Math.atan2(s, c) };
  }

  /**
   * Advance by dt seconds. `coupling` is in units of the critical coupling (1 = the threshold); `sun` is the
   * day–night phase φ, or null when there is no day–night cycle. Returns new clocks (phases in [0, 2π)).
   */
  function step(clocks, dt, coupling, sun = null) {
    const K = coupling * CRITICAL;
    const substeps = Math.max(1, Math.ceil(dt / 0.02));
    const h = dt / substeps;
    // One copy for the caller (the input is never changed); the substeps then update that copy.
    const next = clocks.map((k) => ({ ...k }));
    for (let n = 0; n < substeps; n++) {
      const { r, psi } = order(next);
      const phi = sun === null ? null : sun + TAU * MEAN * h * n; // the sun moves on during the substeps
      for (const k of next) {
        let v = TAU * k.freq + K * r * Math.sin(psi - k.phase);
        if (phi !== null) v += DRIVE * Math.sin(phi - k.phase);
        k.phase = (((k.phase + v * h) % TAU) + TAU) % TAU;
      }
    }
    return next;
  }

  /** The day–night phase after `t` seconds, shifted by `shift` radians (a flight moves it). */
  function sunPhase(t, shift = 0) {
    return (((TAU * MEAN * t + shift) % TAU) + TAU) % TAU;
  }

  /**
   * How far the clocks' shared rhythm is from the day–night cycle, in radians (−π, π]: 0 means they flash
   * at the start of each "night". Uses the average of e^{i(θ − φ)}.
   */
  function lag(clocks, sun) {
    return order(clocks, sun).psi;
  }

  /** A clock's glow, 0–1: a soft pulse around phase 0, smooth on both sides (never a hard switch). */
  function glow(phase) {
    const c = Math.cos(phase);
    return c > 0 ? c ** 6 : 0;
  }

  Wonderlattice.models.fireflies = Object.freeze({
    MEAN,
    SPREAD,
    LOW,
    HIGH,
    CRITICAL,
    FLIGHT,
    seed,
    order,
    step,
    sunPhase,
    lag,
    glow,
  });
})();
