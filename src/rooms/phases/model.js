/*
 * Three wires, no way back · three-phase power.
 * Three alternating currents a third of a cycle (120°) apart, each the shadow of an arrow (a phasor) turning round a
 * circle. With equal loads the three arrows add up to nothing, so at every instant the currents cancel and a shared
 * return wire would carry none. Each phase's power pulses as sin², yet the three add up to a constant. Fed into three
 * coils round a circle, the currents make a magnetic field of constant strength that turns once per cycle.
 * Loads are resistive (each current in step with its voltage), the voltages are ideal sines and stay balanced, and
 * nothing is lost. Pure functions, no DOM.
 */
(() => {
  'use strict';

  const TAU = 2 * Math.PI;
  const STEP = TAU / 3; // 120°, the gap between the phases
  const FULL = 100; // A, each wire's current at full load (as an ammeter shows it, the rms value)

  /** Phase k's angle behind the first (0, 120°, 240°). */
  const lag = (k) => k * STEP;

  /** The current in wire k at the turning angle θ, with its load as a multiple of full load (peak 1 at full load). */
  const current = (load, k, theta) => load * Math.sin(theta - lag(k));

  /** All three currents at θ. */
  const currents = (loads, theta) => loads.map((load, k) => current(load, k, theta));

  /** What the return wire carries at θ: everything the three wires send out, coming back. */
  const returning = (loads, theta) => currents(loads, theta).reduce((a, b) => a + b, 0);

  /**
   * The three arrows added head to tail, as { x, y }: each arrow has its load's length and points at −120°·k. The
   * return wire's current is this sum's shadow, so its length is the return current as a multiple of one full wire.
   */
  function sum(loads) {
    let x = 0,
      y = 0;
    loads.forEach((load, k) => {
      x += load * Math.cos(-lag(k));
      y += load * Math.sin(-lag(k));
    });
    return { x, y };
  }

  /** The return wire's current in amps, as an ammeter shows it: 0 when the loads are equal. */
  const returnAmps = (loads) => FULL * Math.hypot(sum(loads).x, sum(loads).y);

  /** A wire's current in amps at its load. */
  const amps = (load) => FULL * load;

  /** The power drawn by phase k at θ (resistive load, peak voltage 1): load × sin²(θ − 120°·k). */
  const power = (load, k, theta) => load * Math.sin(theta - lag(k)) ** 2;

  /** The total power at θ. With equal loads it is always 3/2 of one phase's peak: it never flickers. */
  const totalPower = (loads, theta) => loads.reduce((all, load, k) => all + power(load, k, theta), 0);

  /** The average total power: half of each load's peak. */
  const meanPower = (loads) => loads.reduce((a, b) => a + b, 0) / 2;

  /**
   * How far the total power swings above and below its average, as a share of the average (0 when balanced). The
   * total is Σ load·(1 − cos 2(θ − φ))/2, whose swing is half the length of the loads' arrows doubled in angle; at
   * 240° and 480° (= 120°) those are the same three directions, so it equals the return current's share.
   */
  function ripple(loads) {
    const mean = meanPower(loads);
    if (mean <= 0) return 0;
    let x = 0,
      y = 0;
    loads.forEach((load, k) => {
      x += load * Math.cos(2 * lag(k));
      y += load * Math.sin(2 * lag(k));
    });
    return Math.hypot(x, y) / 2 / mean;
  }

  /**
   * The magnetic field at the centre of three coils placed a third of a turn apart round a circle, coil k at the
   * angle 120°·k (pointing inwards along its axis), each carrying its wire's current, as { x, y }. With `swap`,
   * wires 2 and 3 change coils. With equal loads its strength is 3/2 of one coil's peak and its direction turns once
   * per cycle: forwards normally, backwards with two wires swapped.
   */
  function field(loads, theta, swap = false) {
    const order = swap ? [0, 2, 1] : [0, 1, 2];
    let x = 0,
      y = 0;
    loads.forEach((load, k) => {
      const i = current(load, k, theta),
        at = lag(order[k]);
      x += i * Math.cos(at);
      y += i * Math.sin(at);
    });
    return { x, y };
  }

  /** The field's strongest and weakest over a cycle: equal when balanced (a circle), apart when not (an ellipse). */
  function fieldRange(loads, swap = false, samples = 360) {
    let most = 0,
      least = Infinity;
    for (let j = 0; j < samples; j++) {
      const f = field(loads, (j / samples) * TAU, swap),
        r = Math.hypot(f.x, f.y);
      most = Math.max(most, r);
      least = Math.min(least, r);
    }
    return { most, least };
  }

  Wonderlattice.models.phases = Object.freeze({
    STEP,
    FULL,
    lag,
    current,
    currents,
    returning,
    sum,
    returnAmps,
    amps,
    power,
    totalPower,
    meanPower,
    ripple,
    field,
    fieldRange,
  });
})();
