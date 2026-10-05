/*
 * Light a town 100 km away · why power lines use high voltage.
 * A power station sends a power P down a line of resistance R at a voltage V, so the current is I = P/V, and the wire
 * turns I²R of it into heat (Joule heating): a loss of P²R/V². Ten times the voltage, a hundredth of the heat. The
 * other way to cut the loss is more metal: R falls in proportion to the wire's cross-section.
 * The model is a single resistive line at constant power: no reactance, skin effect, corona, or three phases.
 * Pure functions, no DOM.
 */
(() => {
  'use strict';

  const SENT = 10e6; // W, what the power station sends
  const LENGTH = 100e3; // m, from the station to the town
  const OHMS = 5; // Ω, the whole line with the thinnest wire
  const MIN_KV = 1,
    MAX_KV = 1000; // the dial
  const MAX_METAL = 100; // the most metal, as a multiple of the thinnest wire
  const HOUSE = 230; // V, what the houses get after the last transformer
  const RESISTIVITY = 2.82e-8; // Ω·m, aluminium at 20 °C
  const DENSITY = 2700; // kg/m³, aluminium

  /** A value rounded to two significant figures, the precision of the dial (398.1 → 400, 3.162 → 3.2). */
  const nice = (x) => (x > 0 ? Number(x.toPrecision(2)) : 0);

  /** The line's resistance with `metal` times the thinnest wire's cross-section. */
  const resistance = (metal = 1) => OHMS / metal;

  /** The current in amps that carries the station's power at this voltage: I = P/V. */
  const current = (volts, power = SENT) => power / volts;

  /** The heat the wire wastes, in watts: I²R = P²R/V². */
  const loss = (volts, metal = 1, power = SENT) => (power * power * resistance(metal)) / (volts * volts);

  /** The loss as a share of what is sent. Above 1 the sums have broken down: the wire would waste more than it gets. */
  const share = (volts, metal = 1, power = SENT) => loss(volts, metal, power) / power;

  /** What reaches the town, in watts. Never negative: when the loss would exceed the supply, the town stays dark. */
  const delivered = (volts, metal = 1, power = SENT) => Math.max(0, power - loss(volts, metal, power));

  /**
   * The power still flowing a fraction `x` of the way along the line. The current is the same all the way, so the
   * wire loses its heat evenly along its length.
   */
  const flowAt = (x, volts, metal = 1, power = SENT) => Math.max(0, power - loss(volts, metal, power) * x);

  /** Heat per metre of wire, in watts. */
  const heatPerMetre = (volts, metal = 1, power = SENT) => loss(volts, metal, power) / LENGTH;

  /** Below this voltage the wire would waste everything sent: V = √(PR). */
  const darkBelow = (metal = 1, power = SENT) => Math.sqrt(power * resistance(metal));

  /** How many times the metal a line at `volts` needs to waste no more than one at `target`: (target/volts)². */
  const metalToMatch = (volts, target) => (target / volts) ** 2;

  /** The wire itself, solid aluminium: cross-section in m², thickness in m, and mass in tonnes. */
  function wire(metal = 1) {
    const area = (RESISTIVITY * LENGTH) / resistance(metal);
    return { area, diameter: 2 * Math.sqrt(area / Math.PI), tonnes: (area * LENGTH * DENSITY) / 1000 };
  }

  Wonderlattice.models.voltage = Object.freeze({
    SENT,
    LENGTH,
    OHMS,
    MIN_KV,
    MAX_KV,
    MAX_METAL,
    HOUSE,
    RESISTIVITY,
    DENSITY,
    nice,
    resistance,
    current,
    loss,
    share,
    delivered,
    flowAt,
    heatPerMetre,
    darkBelow,
    metalToMatch,
    wire,
  });
})();
