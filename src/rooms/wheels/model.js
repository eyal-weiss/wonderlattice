/*
 * Square wheels, smooth ride · roads and wheels (L. Hall and S. Wagon, "Roads and Wheels", Mathematics Magazine 65
 * (1992) 283–301). A wheel is given by its radius in every direction from the axle, r(φ). It rolls without
 * slipping, with the axle kept at height 0 and the point of contact straight below it. Then the road under the
 * wheel's point at angle θ is at height y = −r(θ), and since the lengths rolled along the wheel and the road must
 * match, dx = r dθ. For the flat side of a regular polygon this gives an upside-down catenary, y = −a cosh(x / a),
 * where a is the distance from the axle to the middle of a side.
 * https://mathworld.wolfram.com/Roulette.html · https://en.wikipedia.org/wiki/Square_wheel
 *
 * Pure functions, no DOM. Lengths are in units of the wheel's largest radius (a regular polygon's centre-to-corner
 * distance is 1); y points up. Angles are in radians and anticlockwise. A wheel turned by α shows its point at angle
 * φ in the direction φ + α. Rolling to the right, the point of contact θ (in the wheel's own angles) points straight
 * down, so α = −π/2 − θ.
 */
(() => {
  'use strict';

  const TAU = 2 * Math.PI;
  const DOWN = -Math.PI / 2;
  const mod = (x, m) => ((x % m) + m) % m;

  /**
   * A regular wheel with n sides, its corners 1 from the axle, standing on the middle of a side when it isn't
   * turned (α = 0).
   */
  function polygon(n) {
    const sector = TAU / n,
      apothem = Math.cos(Math.PI / n);
    return {
      kind: 'polygon',
      n,
      apothem,
      symmetry: n,
      // From the axle to the rim at angle φ: a side at distance a, seen at an angle u from its middle, is a / cos u.
      radius: (phi) => apothem / Math.cos(mod(phi - DOWN + Math.PI / n, sector) - Math.PI / n),
      // The rim as points round the wheel: for a polygon its corners are enough.
      outline: () => Array.from({ length: n }, (_, k) => DOWN + Math.PI / n + k * sector).map((phi) => [phi, 1]),
    };
  }

  // A drawn wheel has a dot on each of these spokes; its rim runs smoothly from dot to dot.
  const SPOKES = 12;
  const SMALLEST = 0.3; // no dot closer to the axle than this, so the rim never reaches it

  /**
   * A drawn wheel from its dots' distances from the axle (each 0.3 to 1), on 12 evenly spaced spokes, the first
   * pointing right. Between the dots the radius follows a closed Catmull–Rom curve, so the rim is smooth. Every
   * spoke meets the rim exactly once, which is what a road needs: a rim that folded back, seen from the axle, would
   * need a road that goes vertical.
   */
  function drawn(radii) {
    const p = radii.map((r) => Math.min(1, Math.max(SMALLEST, r)));
    const m = p.length,
      step = TAU / m;
    function radius(phi) {
      const u = mod(phi, TAU) / step,
        k = Math.floor(u) % m,
        t = u - Math.floor(u);
      const p0 = p[(k + m - 1) % m],
        p1 = p[k],
        p2 = p[(k + 1) % m],
        p3 = p[(k + 2) % m];
      return (
        0.5 *
        (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (3 * p1 - p0 - 3 * p2 + p3) * t * t * t)
      );
    }
    return {
      kind: 'drawn',
      radii: p,
      symmetry: 1,
      radius,
      outline: (count = 720) =>
        Array.from({ length: count }, (_, k) => (k * TAU) / count).map((phi) => [phi, radius(phi)]),
    };
  }

  /** The longest radius of a wheel, from a fine look round it. */
  function longest(wheel) {
    let most = 0;
    for (let k = 0; k < 1440; k++) most = Math.max(most, wheel.radius((k * TAU) / 1440));
    return wheel.kind === 'polygon' ? 1 : most;
  }

  /**
   * The wheel's own road, over one repeat: the contact point θ runs from straight down (θ0 = −π/2, the wheel not
   * turned) round to θ0 + 2π / symmetry, and x = ∫ r dθ (Simpson's rule), y = −r(θ). The road then repeats, every
   * `period` along. For a polygon, x = 0 is the top of a bump and the corner sits in the dip halfway.
   */
  function road(wheel, steps = wheel.kind === 'polygon' ? 1024 : 2400) {
    const turn = TAU / wheel.symmetry;
    const n = steps % 2 ? steps + 1 : steps,
      h = turn / n;
    const theta = new Float64Array(n + 1),
      x = new Float64Array(n + 1),
      y = new Float64Array(n + 1);
    for (let i = 0; i <= n; i++) {
      theta[i] = DOWN + i * h;
      y[i] = -wheel.radius(theta[i]);
    }
    // Simpson over each pair of steps, with the middle point found by a half-step Simpson for odd indices.
    for (let i = 1; i <= n; i++) {
      const a = theta[i - 1],
        b = theta[i],
        mid = wheel.radius((a + b) / 2);
      x[i] = x[i - 1] + ((b - a) / 6) * (-y[i - 1] + 4 * mid - y[i]);
    }
    // reach: how far from the axle the road can touch the wheel at all.
    return { wheel, theta, x, y, turn, period: x[n], start: DOWN, reach: longest(wheel) + 0.01 };
  }

  /** Index of the last table entry at or below value (the table rises). */
  function below(table, value) {
    let lo = 0,
      hi = table.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (table[mid] <= value) lo = mid;
      else hi = mid;
    }
    return lo;
  }

  /**
   * Where the wheel is when its axle is X along its road (X = 0: the start of the road's first repeat): the point
   * of contact θ, the wheel's turn α (negative: rolling right turns it clockwise), and the road's height there.
   */
  function at(r, X) {
    const repeats = Math.floor(X / r.period),
      local = X - repeats * r.period;
    const i = Math.min(below(r.x, local), r.x.length - 2);
    const f = (local - r.x[i]) / (r.x[i + 1] - r.x[i] || 1);
    const theta = r.theta[i] + f * (r.theta[i + 1] - r.theta[i]) + repeats * r.turn;
    return { theta, alpha: DOWN - theta, y: -r.wheel.radius(theta) };
  }

  /** How far along its road the axle is when the point of contact is θ: the reverse of at(). */
  function along(r, theta) {
    const u = (theta - r.start) / r.turn,
      repeats = Math.floor(u),
      f = (u - repeats) * (r.x.length - 1);
    const i = Math.min(Math.floor(f), r.x.length - 2);
    return repeats * r.period + r.x[i] + (f - i) * (r.x[i + 1] - r.x[i]);
  }

  /** The road's height X along it (it repeats). */
  function height(r, X) {
    const local = mod(X, r.period);
    const i = Math.min(below(r.x, local), r.x.length - 2);
    const f = (local - r.x[i]) / (r.x[i + 1] - r.x[i] || 1);
    return r.y[i] + f * (r.y[i + 1] - r.y[i]);
  }

  /**
   * The same wheel on a flat road. Turned by α, it rests on its lowest point, so the axle is at the height
   * h(α) = max over the rim of −(r(φ) sin(φ + α)), and rolling on a line moves the axle along by h for each bit of
   * turn: dX = h dψ, where ψ = −α is how far it has turned clockwise. Over one repeat (ψ from 0 to 2π / symmetry).
   */
  function flat(wheel, steps = 720) {
    // The rim as points; −r sin(φ + α) = −(y cos α + x sin α), so each turn costs a multiply-add per point.
    const rim = wheel.outline(360).map(([phi, r]) => [r * Math.cos(phi), r * Math.sin(phi)]);
    const turn = TAU / wheel.symmetry,
      dpsi = turn / steps;
    const lift = (alpha) => {
      const c = Math.cos(alpha),
        s = Math.sin(alpha);
      let most = -Infinity;
      for (const [x, y] of rim) most = Math.max(most, -(y * c + x * s));
      return most;
    };
    const psi = new Float64Array(steps + 1),
      X = new Float64Array(steps + 1),
      h = new Float64Array(steps + 1);
    for (let i = 0; i <= steps; i++) {
      psi[i] = i * dpsi;
      h[i] = lift(-psi[i]);
      if (i) X[i] = X[i - 1] + ((h[i - 1] + h[i]) / 2) * dpsi;
    }
    let low = Infinity,
      high = -Infinity;
    for (const v of h) {
      low = Math.min(low, v);
      high = Math.max(high, v);
    }
    return { wheel, psi, X, h, turn, period: X[steps], low, high, bob: high - low };
  }

  /** On a flat road, how far along the axle is when the wheel has turned by α: the reverse of flatAt(). */
  function flatAlong(f, alpha) {
    const u = -alpha / f.turn,
      repeats = Math.floor(u),
      k = (u - repeats) * (f.X.length - 1);
    const i = Math.min(Math.floor(k), f.X.length - 2);
    return repeats * f.period + f.X[i] + (k - i) * (f.X[i + 1] - f.X[i]);
  }

  /** On a flat road, X along: the wheel's turn α and the axle's height. */
  function flatAt(f, X) {
    const repeats = Math.floor(X / f.period),
      local = X - repeats * f.period;
    const i = Math.min(below(f.X, local), f.X.length - 2);
    const k = (local - f.X[i]) / (f.X[i + 1] - f.X[i] || 1);
    return {
      alpha: -(f.psi[i] + k * (f.psi[i + 1] - f.psi[i]) + repeats * f.turn),
      height: f.h[i] + k * (f.h[i + 1] - f.h[i]),
    };
  }

  // A road point closer to the axle than the rim, by more than this, is inside the wheel: the wheel would crash.
  const TOLERANCE = 1e-3;

  /**
   * How deep the road reaches into the wheel with its axle X along: the deepest road point inside the rim, and
   * where it is (relative to the axle), or depth 0. Since every spoke meets the rim once, a point is inside exactly
   * when it is closer to the axle than the rim in its direction.
   */
  function overlap(r, X, place = at(r, X)) {
    const reach = r.reach,
      far = reach * reach;
    let depth = 0,
      x = 0,
      y = 0;
    const first = Math.floor((X - reach) / r.period),
      last = Math.floor((X + reach) / r.period);
    for (let rep = first; rep <= last; rep++)
      for (let i = 0; i < r.x.length; i++) {
        const px = r.x[i] + rep * r.period - X,
          py = r.y[i];
        if (Math.abs(px) > reach || px * px + py * py > far) continue; // beyond the rim's reach
        const rho = Math.hypot(px, py),
          d = r.wheel.radius(Math.atan2(py, px) - place.alpha) - rho;
        if (d > depth) {
          depth = d;
          x = px;
          y = py;
        }
      }
    return depth > TOLERANCE ? { depth, x, y } : { depth: 0, x: 0, y: 0 };
  }

  /**
   * Where the wheel crashes into its own road over one repeat, from `samples` positions of the axle: the depth at
   * each position, the deepest of all, and the share of the way it spends crashing.
   */
  function crashes(r, samples = 360) {
    const depth = new Float64Array(samples);
    let deepest = 0,
      crashing = 0;
    for (let j = 0; j < samples; j++) {
      depth[j] = overlap(r, (j / samples) * r.period).depth;
      if (depth[j] > 0) crashing++;
      deepest = Math.max(deepest, depth[j]);
    }
    return { depth, deepest, share: crashing / samples };
  }

  /** A regular wheel's bumps: how tall, and how far apart (corners 1 from the axle). */
  function bumps(n) {
    const a = Math.cos(Math.PI / n);
    return { height: 1 - a, period: 2 * a * Math.asinh(Math.tan(Math.PI / n)), apothem: a };
  }

  /** The upside-down catenary of a side at distance a from the axle, centred on the top of its bump. */
  const catenary = (a, x) => -a * Math.cosh(x / a);

  /** Shapes to start drawing from: the dots' distances on the 12 spokes, the first pointing right, anticlockwise. */
  const shapes = {
    // A heart (16 sin³t, 13 cos t − 5 cos 2t − 2 cos 3t − cos 4t) seen from its middle, its dent a little shallower:
    // at 0.3, as deep as the curve's, it would crash.
    heart: [0.88, 0.99, 0.81, 0.35, 0.81, 0.99, 0.88, 0.68, 0.66, 1, 0.66, 0.68],
    flower: [1, 0.55, 1, 0.55, 1, 0.55, 1, 0.55, 1, 0.55, 1, 0.55],
    star: [0.3, 0.3, 0.3, 1, 0.3, 0.3, 0.3, 1, 0.3, 0.3, 0.3, 1],
    egg: [0.43, 0.45, 0.5, 0.6, 0.75, 0.92, 1, 0.92, 0.75, 0.6, 0.5, 0.45], // an ellipse turning about a focus
    circle: Array(SPOKES).fill(0.8),
  };

  Wonderlattice.models = Wonderlattice.models || {};
  Wonderlattice.models.wheels = {
    TAU,
    SPOKES,
    SMALLEST,
    TOLERANCE,
    polygon,
    drawn,
    longest,
    road,
    at,
    along,
    height,
    flat,
    flatAt,
    flatAlong,
    overlap,
    crashes,
    bumps,
    catenary,
    shapes,
  };
})();
