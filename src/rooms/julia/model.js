/*
 * A seed for an infinite landscape · Julia sets and the Mandelbrot set.
 * Repeat z → z² + c. Points that stay near the centre make the filled Julia set of c; its edge is the
 * Julia set. The Mandelbrot set is the map of seeds c whose journey from 0 stays trapped, which is exactly
 * when the Julia set is one connected piece (Julia and Fatou, 1918–1919).
 * https://en.wikipedia.org/wiki/Julia_set · https://en.wikipedia.org/wiki/Mandelbrot_set
 * H.-O. Peitgen and P. H. Richter, The Beauty of Fractals (Springer, 1986).
 * Pure functions, no DOM.
 */
(() => {
  'use strict';

  const ESCAPE = 2; // once |z| > max(2, |c|), the journey is certain to run off to infinity
  const radius = (cx, cy) => Math.max(ESCAPE, Math.hypot(cx, cy));
  const BAILOUT = 256; // a larger radius for colouring, so the smooth count has no bands

  /**
   * How many steps z → z² + c takes to leave a large disc, as a smooth (fractional) count for colouring,
   * or -1 if the point is still trapped after `max` steps. `max` limits the work: points that would
   * escape later are reported as trapped, which is why the pictures are approximations. A point whose
   * journey falls into a repeating cycle is known to be trapped at once (Brent's check), which saves most
   * of the work inside the dark regions.
   */
  function escape(zx, zy, cx, cy, max) {
    let x = zx,
      y = zy,
      x2 = x * x,
      y2 = y * y,
      ox = x,
      oy = y,
      span = 8;
    for (let n = 0; n < max; n++) {
      if (x2 + y2 > BAILOUT * BAILOUT) return n + 1 - Math.log2(Math.log(Math.sqrt(x2 + y2)));
      y = 2 * x * y + cy;
      x = x2 - y2 + cx;
      x2 = x * x;
      y2 = y * y;
      if (Math.abs(x - ox) < 1e-12 && Math.abs(y - oy) < 1e-12) return -1; // back where it was: a cycle
      if (n === span) {
        ox = x;
        oy = y;
        span *= 2;
      }
    }
    return -1;
  }

  /** Whether the journey from z stays within the escape radius for `max` steps (the membership used for verdicts). */
  function trapped(zx, zy, cx, cy, max) {
    const r2 = radius(cx, cy) ** 2;
    let x = zx,
      y = zy;
    for (let n = 0; n < max; n++) {
      if (x * x + y * y > r2) return false;
      const nx = x * x - y * y + cx;
      y = 2 * x * y + cy;
      x = nx;
    }
    return true;
  }

  /**
   * Whether the seed c lies in the Mandelbrot set, as far as `max` steps can tell. Seeds in the main
   * cardioid and the big disc to its left are recognised at once, since their journeys never escape.
   */
  function inMandelbrot(cx, cy, max) {
    return inBody(cx, cy) || trapped(0, 0, cx, cy, max);
  }

  /** Whether c is in the main cardioid or the big disc to its left, where every journey from 0 is trapped. */
  function inBody(cx, cy) {
    const q = (cx - 0.25) ** 2 + cy * cy;
    return q * (q + (cx - 0.25)) <= cy * cy * 0.25 || (cx + 1) ** 2 + cy * cy <= 1 / 16;
  }

  /**
   * One point's journey: the points z₀, z₁, … up to `max` steps, stopping at the first point beyond the
   * escape radius max(2, |c|). `escaped` says whether it left, and `steps` how many steps that took.
   */
  function orbit(zx, zy, cx, cy, max) {
    const r2 = radius(cx, cy) ** 2;
    const points = [[zx, zy]];
    let x = zx,
      y = zy;
    for (let n = 0; n < max; n++) {
      if (x * x + y * y > r2) return { points, escaped: true, steps: n };
      const nx = x * x - y * y + cx;
      y = 2 * x * y + cy;
      x = nx;
      points.push([x, y]);
    }
    return { points, escaped: x * x + y * y > r2, steps: max };
  }

  /** A point on the edge of the main cardioid of the Mandelbrot set, at angle θ: c = e^{iθ}/2 − e^{2iθ}/4. */
  function cardioid(theta) {
    return [Math.cos(theta) / 2 - Math.cos(2 * theta) / 4, Math.sin(theta) / 2 - Math.sin(2 * theta) / 4];
  }

  Wonderlattice.models.julia = Object.freeze({
    ESCAPE,
    radius,
    escape,
    trapped,
    inMandelbrot,
    inBody,
    orbit,
    cardioid,
  });
})();
