/*
 * The shape hiding inside randomness · a Galton board, averages of a lopsided die, and a spinner whose averages
 * never settle. A ball that bounces right with chance p at each of n rows lands in bin k with the binomial chance
 * C(n, k)·pᵏ·(1 − p)ⁿ⁻ᵏ; averages of independent throws with a finite spread crowd into a bell that narrows like
 * 1/√n (the central limit theorem); averages of a Cauchy spinner are as wild as one spin.
 * Pure functions, no DOM.
 */
(() => {
  'use strict';

  /** A small repeatable random generator (mulberry32), so a pour is the same for the same seed. */
  function random(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** C(n, k) as a float; exact for the board's sizes. */
  function choose(n, k) {
    if (k < 0 || k > n) return 0;
    let c = 1;
    for (let i = 1; i <= Math.min(k, n - k); i++) c = (c * (n - i + 1)) / i;
    return c;
  }

  /** The chance a ball lands in each bin 0…rows, bouncing right with chance p at every peg. */
  function binomial(rows, p) {
    return Array.from({ length: rows + 1 }, (_, k) => choose(rows, k) * p ** k * (1 - p) ** (rows - k));
  }

  /** The bell: the normal density with this mean and spread (standard deviation). */
  function normal(x, mean, sd) {
    return Math.exp(-0.5 * ((x - mean) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI));
  }

  /** One ball's path through `rows` rows of pegs: 1 for a bounce right, 0 for left. Its bin is the number of 1s. */
  function path(rows, p, rand) {
    return Array.from({ length: rows }, () => (rand() < p ? 1 : 0));
  }

  /** A die's six chances from six weights (all zero counts as a fair die), with its mean and spread. */
  function die(weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    const chances = weights.map((w) => (total > 0 ? w / total : 1 / 6));
    const mean = chances.reduce((m, q, i) => m + (i + 1) * q, 0);
    const variance = chances.reduce((v, q, i) => v + (i + 1 - mean) ** 2 * q, 0);
    return { chances, mean, sd: Math.sqrt(variance) };
  }

  /** One throw of a die with these chances: a face 1–6. */
  function throwDie(chances, rand) {
    let u = rand();
    for (let i = 0; i < 5; i++) {
      if (u < chances[i]) return i + 1;
      u -= chances[i];
    }
    return 6;
  }

  /** The chance of each total of n throws, n…6n (index 0 is the total n), by adding one throw at a time. */
  function totals(chances, n) {
    let dist = [1];
    for (let throwNumber = 0; throwNumber < n; throwNumber++) {
      const next = new Array(dist.length + 5).fill(0);
      dist.forEach((q, s) => chances.forEach((c, face) => (next[s + face] += q * c)));
      dist = next;
    }
    return dist;
  }

  /**
   * How a heap of averages of n throws is binned: totals n…6n, `group` neighbouring totals to a bin, so that every
   * heap has at most about three dozen bars. Bin b holds the totals n + b·group … n + (b + 1)·group − 1.
   */
  function bins(n) {
    const values = 5 * n + 1;
    const group = Math.max(1, Math.ceil(values / 36));
    return { group, count: Math.ceil(values / group) };
  }

  /** The chance of each bin of averages of n throws (see bins). */
  function averageChances(chances, n) {
    const dist = totals(chances, n),
      { group, count } = bins(n);
    return Array.from({ length: count }, (_, b) => dist.slice(b * group, (b + 1) * group).reduce((a, q) => a + q, 0));
  }

  /** The bin of an average of n throws, from their total. */
  const binOfTotal = (total, n) => Math.floor((total - n) / bins(n).group);

  /** The middle of bin b of averages of n throws, as an average (1–6). */
  function binMiddle(b, n) {
    const { group } = bins(n);
    const first = n + b * group,
      last = Math.min(6 * n, first + group - 1);
    return (first + last) / 2 / n;
  }

  /** One spin of the stubborn spinner: a lamp one step from a wall shines at a random angle; where the light lands. */
  const spin = (rand) => Math.tan(Math.PI * (rand() - 0.5));

  /** The spinner's chance of landing between a and b (the Cauchy distribution). */
  const spinnerChance = (a, b) => (Math.atan(b) - Math.atan(a)) / Math.PI;

  /** The spinner's density at x. */
  const spinnerDensity = (x) => 1 / (Math.PI * (1 + x * x));

  Wonderlattice.models.galton = Object.freeze({
    random,
    choose,
    binomial,
    normal,
    path,
    die,
    throwDie,
    totals,
    bins,
    averageChances,
    binOfTotal,
    binMiddle,
    spin,
    spinnerChance,
    spinnerDensity,
  });
})();
