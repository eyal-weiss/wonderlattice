/*
 * A thousand samples, ten tests · group testing.
 * Binary pooling: number the tubes 1…n in binary, and let test k take a drop from every tube whose k-th bit is 1.
 * With one hot tube, the yes/no results spell its number, so ⌈log₂(n + 1)⌉ tests find it (n tubes, plus "none").
 * With two, the results are the OR of their numbers, and point at the wrong tube.
 * Dorfman pooling (1943): test pools of k people, then retest everyone in a positive pool one by one. With
 * prevalence p the expected number of tests per person is 1/k + 1 − (1 − p)^k.
 * Pure functions, no DOM.
 */
(() => {
  'use strict';

  /** Tests a one-round binary design needs for n tubes: the number of bits in n, since "none" is n + 1st answer. */
  const testsFor = (n) => Math.ceil(Math.log2(n + 1));

  /** Is tube `tube` in test k? Test k pools every tube whose k-th bit (from the right, from 0) is 1. */
  const inTest = (tube, k) => ((tube >>> k) & 1) === 1;

  /** The tubes 1…n that feed a drop into test k. */
  function members(k, n) {
    const out = [];
    for (let tube = 1; tube <= n; tube++) if (inTest(tube, k)) out.push(tube);
    return out;
  }

  /** The results of `tests` pooled tests when the tubes in `hot` are positive: test k is yes if any hot tube is in it. */
  function results(hot, tests) {
    const out = [];
    for (let k = 0; k < tests; k++) out.push(hot.some((tube) => inTest(tube, k)));
    return out;
  }

  /** Read the results as a binary number: test k is worth 2^k. 0 means no tube is hot. */
  const decode = (lights) => lights.reduce((sum, on, k) => sum + (on ? 2 ** k : 0), 0);

  /** A small repeatable random generator (mulberry32), so the same seed gives the same crowd. */
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

  /**
   * A second hot tube for the twist, chosen from `seed`: one whose OR with `a` is a third tube, still on the rack,
   * so the lights point somewhere real and wrong. A few tubes near the top of the rack have no such partner; for
   * them the OR points past the last tube. Returns 0 only when there is no second tube at all.
   */
  function partner(a, n, seed) {
    const third = (b) => b !== a && (a | b) !== a && (a | b) !== b;
    const rand = random(seed * 2654435761 + a);
    for (const ok of [(b) => third(b) && (a | b) <= n, third]) {
      for (let tries = 0; tries < 200; tries++) {
        const b = 1 + Math.floor(rand() * n);
        if (ok(b)) return b;
      }
      for (let b = 1; b <= n; b++) if (ok(b)) return b;
    }
    return 0;
  }

  // ---------- Dorfman pooling ----------

  /** Expected tests per person for pools of size k in a large population, with prevalence p. k = 1 is 1 test each. */
  const perPerson = (p, k) => (k <= 1 ? 1 : 1 / k + 1 - (1 - p) ** k);

  /** Expected tests for one pool of m people: one pooled test, plus m retests if anyone in it is positive. */
  const poolExpected = (p, m) => (m <= 1 ? m : 1 + m * (1 - (1 - p) ** m));

  /** The pool sizes when n people are split, in order, into pools of k: all k, then what's left over. */
  function poolSizes(n, k) {
    const sizes = [];
    for (let start = 0; start < n; start += k) sizes.push(Math.min(k, n - start));
    return sizes;
  }

  /** Exact expected tests for a crowd of n split into pools of k, leftover pool included. */
  const expectedTests = (n, p, k) => poolSizes(n, k).reduce((sum, m) => sum + poolExpected(p, m), 0);

  /** The pool size from 1…kMax with the fewest expected tests per person (large population), and that number. */
  function bestPool(p, kMax = 100) {
    let best = { k: 1, perPerson: 1 };
    for (let k = 2; k <= kMax; k++) if (perPerson(p, k) < best.perPerson) best = { k, perPerson: perPerson(p, k) };
    return best;
  }

  /** The same for a crowd of exactly n people: the pool size with the fewest expected tests, and that number. */
  function bestPoolFor(n, p, kMax = 20) {
    let best = { k: 1, tests: n };
    for (let k = 2; k <= kMax; k++) {
      const e = expectedTests(n, p, k);
      if (e < best.tests - 1e-12) best = { k, tests: e };
    }
    return best;
  }

  /** Two-stage pooling can beat testing everyone only below this prevalence, 1 − 3^(−1/3) ≈ 30.7% (pools of 3). */
  const CLIFF = 1 - 3 ** (-1 / 3);
  /** Ungar (1960): above (3 − √5)/2 ≈ 38.2%, no adaptive scheme beats testing everyone one by one. */
  const UNGAR = (3 - Math.sqrt(5)) / 2;

  /** Binary entropy in bits: the information-theory floor is about n·H(p) tests. */
  const entropy = (p) => (p <= 0 || p >= 1 ? 0 : -p * Math.log2(p) - (1 - p) * Math.log2(1 - p));

  /**
   * Who is infected in a crowd of n, from `seed`, at prevalence p. Each person gets one fixed random number and is
   * infected if it is below p, so raising p only ever adds people: the same crowd, more of it infected.
   */
  function crowd(seed, n, p) {
    const rand = random(seed * 7919 + 17);
    const out = [];
    for (let i = 0; i < n; i++) out.push(rand() < p);
    return out;
  }

  /**
   * Run Dorfman pooling on a crowd (an array of true/false). Returns each pool's start, size and result, and the
   * number of tests used: one per pool, plus one per person in each positive pool (a pool of one is just one test).
   */
  function runPools(infected, k) {
    const pools = [];
    let tests = 0;
    for (let start = 0; start < infected.length; start += k) {
      const size = Math.min(k, infected.length - start);
      const positive = infected.slice(start, start + size).some(Boolean);
      const retests = size > 1 && positive ? size : 0;
      tests += 1 + retests;
      pools.push({ start, size, positive, retests });
    }
    return { pools, tests };
  }

  Wonderlattice.models.pools = Object.freeze({
    testsFor,
    inTest,
    members,
    results,
    decode,
    random,
    partner,
    perPerson,
    poolExpected,
    poolSizes,
    expectedTests,
    bestPool,
    bestPoolFor,
    CLIFF,
    UNGAR,
    entropy,
    crowd,
    runPools,
  });
})();
