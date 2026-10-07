/*
 * The punishment illusion · regression to the mean.
 * A thrower's skill never changes; each throw is that skill plus fresh luck. A coach praises the best throws and
 * scolds the worst. An unusually good throw is partly good luck, which doesn't carry over, so the next throw is
 * usually worse, whatever the coach said; after an unusually bad one, the next is usually better. With normal luck
 * and the coach reacting to the best and worst share p of throws, P(next worse | this in the best p) = 1 − p/2.
 * Scores are in standard deviations from the thrower's average. Pure functions, no DOM.
 */
(() => {
  'use strict';

  /** How much a genuinely helpful word lifts the next throw, in standard deviations (the "praise really helps" floor). */
  const BOOST = 0.3;

  /** A repeatable pseudo-random number generator (mulberry32) giving numbers in [0, 1). */
  function random(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** A standard normal number from two uniform ones (Box–Muller). */
  function normal(rand) {
    const u = 1 - rand(),
      v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  /** The standard normal density. */
  const density = (z) => Math.exp((-z * z) / 2) / Math.sqrt(2 * Math.PI);

  /** The standard normal distribution function Φ(z), from erf (Abramowitz and Stegun 7.1.26, error below 1.5e-7). */
  function cdf(z) {
    const x = Math.abs(z) / Math.SQRT2,
      t = 1 / (1 + 0.3275911 * x);
    const erf =
      1 -
      t *
        (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429)))) *
        Math.exp(-x * x);
    return z >= 0 ? (1 + erf) / 2 : (1 - erf) / 2;
  }

  /** The score above which a throw is among the best share `p` of throws: Φ⁻¹(1 − p), by bisection. */
  function cutoff(p) {
    let lo = -8,
      hi = 8;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      if (1 - cdf(mid) > p) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  }

  /** What the automatic coach says about a throw: praise for the best share `p`, scold for the worst, else nothing. */
  function autoWord(z, p) {
    const c = cutoff(p);
    return z >= c ? 'praise' : z <= -c ? 'scold' : null;
  }

  /**
   * The next throw: fresh luck, plus a real lift after praise only when `helps` is on (the coach's words otherwise
   * reach nothing).
   */
  function nextThrow(rand, lastWord, helps = false) {
    return normal(rand) + (helps && lastWord === 'praise' ? BOOST : 0);
  }

  /**
   * A whole session with the automatic coach: `count` throws `{ z, word }` from `seed`, the coach reacting to the
   * best and worst share `p`.
   */
  function session(seed, count, p, helps = false) {
    const rand = random(seed);
    const throws = [];
    for (let i = 0; i < count; i++) {
      const z = nextThrow(rand, throws.length ? throws[throws.length - 1].word : null, helps);
      throws.push({ z, word: autoWord(z, p) });
    }
    return throws;
  }

  /** What happened next after each word: `{ praise: { better, worse }, scold: { better, worse } }`. */
  function tally(throws) {
    const counts = { praise: { better: 0, worse: 0 }, scold: { better: 0, worse: 0 } };
    for (let i = 0; i + 1 < throws.length; i++) {
      const word = throws[i].word;
      if (!counts[word]) continue;
      counts[word][throws[i + 1].z > throws[i].z ? 'better' : 'worse']++;
    }
    return counts;
  }

  /** The best straight line through the pairs (this throw, next throw), and their correlation. */
  function fit(throws) {
    const n = throws.length - 1;
    if (n < 2) return null;
    let sx = 0,
      sy = 0;
    for (let i = 0; i < n; i++) {
      sx += throws[i].z;
      sy += throws[i + 1].z;
    }
    const mx = sx / n,
      my = sy / n;
    let sxx = 0,
      syy = 0,
      sxy = 0;
    for (let i = 0; i < n; i++) {
      const dx = throws[i].z - mx,
        dy = throws[i + 1].z - my;
      sxx += dx * dx;
      syy += dy * dy;
      sxy += dx * dy;
    }
    if (!sxx || !syy) return null;
    const slope = sxy / sxx;
    return { slope, intercept: my - slope * mx, r: sxy / Math.sqrt(sxx * syy), pairs: n };
  }

  /**
   * In theory: the chance that the throw after one in the best share `p` is worse, E[Φ(X − b) | X > c], and the mean
   * change, b − φ(c)/p, where b is the real lift praise gives (0 unless it helps). With b = 0 the chance is 1 − p/2.
   */
  function theory(p, lift = 0) {
    const c = cutoff(p);
    // Simpson's rule on [c, c + 10]; the tail beyond is far below the rounding the room shows.
    const steps = 2000,
      h = 10 / steps;
    let sum = 0;
    for (let i = 0; i <= steps; i++) {
      const x = c + i * h,
        weight = i === 0 || i === steps ? 1 : i % 2 ? 4 : 2;
      sum += weight * density(x) * cdf(x - lift);
    }
    return { cutoff: c, worse: (sum * h) / 3 / p, change: lift - density(c) / p };
  }

  /** A throw's points out of 100 (its percentile among this thrower's throws), as the board shows them. */
  const points = (z) => Math.round(100 * cdf(z));

  /** Where a dart lands, as a share of the board's radius: better throws land nearer the bull. */
  const radius = (z) => 0.04 + 0.9 * (1 - cdf(z));

  Wonderlattice.models.regress = Object.freeze({
    BOOST,
    random,
    normal,
    cdf,
    cutoff,
    autoWord,
    nextThrow,
    session,
    tally,
    fit,
    theory,
    points,
    radius,
  });
})();
