/*
 * Circles all the way down · the Apollonian gasket.
 * Four circles that touch each other in pairs obey Descartes's circle theorem: with bends b = ±1/radius (the
 * outer circle's bend negative), (b₁ + b₂ + b₃ + b₄)² = 2(b₁² + b₂² + b₃² + b₄²). The two circles touching three
 * given ones therefore have bends adding up to 2(b₁ + b₂ + b₃), so the other one is 2(b₁ + b₂ + b₃) − b₄: whole
 * numbers in, whole numbers out. The centres obey the same rule when each is written as a complex number and
 * multiplied by its bend (Lagarias, Mallows and Wilks, the complex Descartes theorem).
 * https://en.wikipedia.org/wiki/Descartes%27_theorem · https://en.wikipedia.org/wiki/Apollonian_gasket
 * J. C. Lagarias, C. L. Mallows and A. R. Wilks, Beyond the Descartes circle theorem, Amer. Math. Monthly 109 (2002).
 * R. L. Graham et al., Apollonian circle packings: number theory, J. Number Theory 100 (2003).
 * Pure functions, no DOM.
 */
(() => {
  'use strict';

  // The two starting circles' bends stay between 1.2k (most of the big circle's width) and 8k (an eighth of it).
  const LEAST = 1.2,
    MOST = 8;

  /**
   * The four starting circles. The big circle has bend −k and radius 1, so a circle of bend b has radius k / b.
   * The left one, bend a, touches it on the left; the right one, bend b, touches both, above the middle unless
   * the two fill the width; the last is the larger circle in the gap under them, with bend
   * c = −k + a + b − 2√(ab − ka − kb). Returns null when the two circles don't fit side by side.
   * Each circle: { bend, x, y, r, wx, wy }, where (wx, wy) is its centre times its bend divided by k: the numbers
   * the complex Descartes theorem works with.
   */
  function start(k, a, b) {
    const q = a * b - k * (a + b);
    if (!(k > 0 && a > k && b > k && q >= -1e-9 * k * k)) return null;
    const c = -k + a + b - 2 * Math.sqrt(Math.max(0, q));
    const ra = k / a,
      rb = k / b,
      rc = k / c;
    const outer = { bend: -k, x: 0, y: 0, r: 1 };
    const left = { bend: a, x: -(1 - ra), y: 0, r: ra };
    // Side by side across the width (q = 0), the right circle sits exactly on the axis: a square root of rounding
    // errors would lift it by 10⁻⁸ and spoil the circles that follow.
    const right = { bend: b, r: rb, ...(q <= 1e-9 * k * k ? { x: 1 - rb, y: 0 } : touching(left, 1 - rb, ra + rb, 1)) };
    // The last one sits in the gap under the other two: of the two places touching the big circle and the left
    // one, the one that also touches the right one.
    const below = touching(left, 1 - rc, ra + rc, -1),
      above = touching(left, 1 - rc, ra + rc, 1);
    const miss = (p) => Math.abs(Math.hypot(p.x - right.x, p.y - right.y) - (rb + rc));
    const last = { bend: c, r: rc, ...(miss(below) <= miss(above) ? below : above) };
    return [outer, left, right, last].map((circle) => ({
      ...circle,
      wx: (circle.bend / k) * circle.x,
      wy: (circle.bend / k) * circle.y,
    }));
  }

  /** The point `fromCentre` away from the big circle's centre and `fromLeft` from the left circle's, above or below. */
  function touching(left, fromCentre, fromLeft, side) {
    const d = -left.x; // the left circle's centre is at (−d, 0)
    const x = (fromLeft * fromLeft - fromCentre * fromCentre - d * d) / (2 * d);
    return { x, y: side * Math.sqrt(Math.max(0, fromCentre * fromCentre - x * x)) };
  }

  /**
   * The circle filling the gap between circles p, q and s, on the other side from `other` (the fourth circle that
   * touches all three): bend 2(p + q + s) − other, and the same rule for bend × centre.
   */
  function fill(p, q, s, other, k) {
    const bend = 2 * (p.bend + q.bend + s.bend) - other.bend;
    const wx = 2 * (p.wx + q.wx + s.wx) - other.wx;
    const wy = 2 * (p.wy + q.wy + s.wy) - other.wy;
    const curvature = bend / k;
    return { bend, wx, wy, x: wx / curvature, y: wy / curvature, r: 1 / curvature };
  }

  /** Where two touching circles meet. Bends weigh the centres (the big circle's negative bend works too). */
  const meeting = (p, q) => ({
    x: (p.bend * p.x + q.bend * q.x) / (p.bend + q.bend),
    y: (p.bend * p.y + q.bend * q.y) / (p.bend + q.bend),
  });

  /**
   * The circle through the three points where p, q and s meet. It crosses all three at right angles and holds the
   * gap between them, so a gap whose circle misses the view has nothing in it to draw.
   */
  function gapCircle(p, q, s) {
    const A = meeting(p, q),
      B = meeting(q, s),
      C = meeting(s, p);
    const d = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
    if (!d) return { x: A.x, y: A.y, r: Infinity };
    const a2 = A.x * A.x + A.y * A.y,
      b2 = B.x * B.x + B.y * B.y,
      c2 = C.x * C.x + C.y * C.y;
    const x = (a2 * (B.y - C.y) + b2 * (C.y - A.y) + c2 * (A.y - B.y)) / d;
    const y = (a2 * (C.x - B.x) + b2 * (A.x - C.x) + c2 * (B.x - A.x)) / d;
    return { x, y, r: Math.hypot(A.x - x, A.y - y) };
  }

  /**
   * The gasket's circles with radius at least `smallest`, biggest first, leaving out gaps that lie outside `view`
   * ({ x0, y0, x1, y1 }; null keeps everything), at most `most` of them. Each circle records its `generation`
   * (the four starting circles are 0, the circles filling their four gaps 1, and each new circle one more than the
   * youngest of the three it fills the gap between), those three (`touches`, indices into the list) and the fourth
   * circle touching them, on the other side (`other`). Every circle comes after the circles it was born between.
   */
  function grow(k, a, b, { view = null, smallest = 0.002, most = 8000 } = {}) {
    const root = start(k, a, b);
    if (!root) return [];
    const circles = root.map((c, i) => ({
      ...c,
      generation: 0,
      touches: [0, 1, 2, 3].filter((j) => j !== i),
      other: -1,
    }));
    const outside = (g) =>
      view && (g.x + g.r < view.x0 || g.x - g.r > view.x1 || g.y + g.r < view.y0 || g.y - g.r > view.y1);
    // The gaps waiting to be filled, biggest circle first (a binary heap).
    const heap = [];
    const push = (around, other, generation) => {
      const born = fill(...around.map((i) => circles[i]), circles[other], k);
      if (generation > 1 && !(born.r >= smallest)) return; // all the rest of this gap is smaller still
      heap.push({ around, other, generation, born });
      for (let i = heap.length - 1; i > 0;) {
        const up = (i - 1) >> 1;
        if (heap[up].born.r >= heap[i].born.r) break;
        [heap[up], heap[i]] = [heap[i], heap[up]];
        i = up;
      }
    };
    const pop = () => {
      const top = heap[0],
        end = heap.pop();
      if (heap.length) {
        heap[0] = end;
        for (let i = 0; ;) {
          const l = 2 * i + 1,
            r = l + 1;
          let big = i;
          if (l < heap.length && heap[l].born.r > heap[big].born.r) big = l;
          if (r < heap.length && heap[r].born.r > heap[big].born.r) big = r;
          if (big === i) break;
          [heap[big], heap[i]] = [heap[i], heap[big]];
          i = big;
        }
      }
      return top;
    };
    for (let i = 0; i < 4; i++)
      push(
        [0, 1, 2, 3].filter((j) => j !== i),
        i,
        1,
      );
    while (heap.length && circles.length < most) {
      const { around, other, generation, born } = pop();
      // The circles born in the four first gaps always stay: each starting circle's rule needs the one across from it.
      if (generation > 1 && outside(gapCircle(...around.map((i) => circles[i])))) continue;
      const index = circles.length;
      circles.push({ ...born, generation, touches: around, other });
      if (generation === 1) circles[other].other = index;
      const [i, j, l] = around;
      push([j, l, index], i, generation + 1);
      push([i, l, index], j, generation + 1);
      push([i, j, index], l, generation + 1);
    }
    return circles;
  }

  /** Descartes's circle theorem, checked: (b₁ + b₂ + b₃ + b₄)² against 2(b₁² + b₂² + b₃² + b₄²). */
  function descartes(bends) {
    const sum = bends.reduce((t, b) => t + b, 0);
    return { left: sum * sum, right: 2 * bends.reduce((t, b) => t + b * b, 0) };
  }

  /**
   * A point deep inside the gasket, near `near`: enter the gaps that hold `near` until they are smaller than `size`
   * (a radius), then, for each of `choices`, the smaller gap that leaves out circle choice % 3 of the current three.
   * The point lies on no circle, so zooming towards it finds circles at every size.
   */
  function deepPoint(k, a, b, near, size, choices) {
    const root = start(k, a, b);
    if (!root) return { x: 0, y: 0 };
    const away = (around) => {
      const g = gapCircle(...around);
      return Math.hypot(g.x - near.x, g.y - near.y) - g.r;
    };
    const gaps = root.map((other, i) => ({ around: root.filter((_, j) => j !== i), other }));
    let { around, other } = gaps.reduce((best, g) => (away(g.around) < away(best.around) ? g : best));
    let point = { x: near.x, y: near.y },
      chosen = 0;
    for (let step = 0; step < 400 && chosen < choices.length; step++) {
      const born = fill(...around, other, k);
      point = { x: born.x, y: born.y };
      const inner = [0, 1, 2].map((drop) => ({
        around: [...around.filter((_, i) => i !== drop), born],
        other: around[drop],
      }));
      const next =
        gapCircle(...around).r > size
          ? inner.reduce((best, g) => (away(g.around) < away(best.around) ? g : best))
          : inner[choices[chosen++] % 3];
      ({ around, other } = next);
    }
    return point;
  }

  const round = (bend) => Math.round(bend * 100) / 100;
  const roundUp = (bend) => Math.ceil(bend * 100 - 1e-9) / 100;

  /** The smallest bend one starting circle may have beside the other, of bend `beside`: together they fill the width. */
  const fewest = (k, beside) => k + (k * k) / (beside - k);

  /**
   * Bends for the two starting circles that fit: each between 1.2k and 8k, written to two decimals, and side by side
   * no wider than the big circle. When they're too wide, the circle that wasn't just moved (`moved`, 'a' or 'b')
   * gives way.
   */
  function settle(k, a, b, moved = 'a') {
    const fit = (bend) => round(Math.min(MOST * k, Math.max(LEAST * k, bend)));
    let A = fit(a),
      B = fit(b);
    if (A * B - k * (A + B) < 0) {
      if (moved === 'b') A = roundUp(fewest(k, B));
      else B = roundUp(fewest(k, A));
    }
    return { a: A, b: B };
  }

  /**
   * The bends that keep the starting circles touching when one of them takes radius r (the big circle's radius is
   * 1): the left (0) or right (1) circle changes alone, and the last (2) changes as the other two shrink or grow
   * together.
   */
  function resize(k, a, b, which, r) {
    if (which === 0) return settle(k, k / r, b, 'a');
    if (which === 1) return settle(k, a, k / r, 'b');
    const lastFor = (scale) => start(k, a / scale, b / scale)?.[3].r ?? 0;
    // Growing the pair by `scale` shrinks the last circle: find the scale by halving the interval.
    let lo = 0.05,
      hi = Math.min(Math.min(a, b) / (LEAST * k), 1 / (k / a + k / b));
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      if (lastFor(mid) > r) lo = mid;
      else hi = mid;
    }
    return settle(k, a / lo, b / lo, 'a');
  }

  Wonderlattice.models.gasket = Object.freeze({
    LEAST,
    MOST,
    start,
    fill,
    grow,
    gapCircle,
    descartes,
    deepPoint,
    fewest,
    settle,
    resize,
  });
})();
