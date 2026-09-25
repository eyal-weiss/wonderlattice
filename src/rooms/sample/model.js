/*
 * A spoonful of a city · sampling, random error, and bias. A seeded toy city
 * of residents on a grid, grouped into neighbourhoods whose favourite-colour
 * shares are drawn around a city-wide mean, so preferences cluster in space.
 *
 * Every way of asking here is a simple random sample (without replacement)
 * from a "frame": the residents that method can reach. Asking at random uses
 * the whole city; asking one neighbourhood uses its residents; "whoever
 * answers" uses the residents willing to reply. A random sample estimates its
 * frame's share without bias, so a method's bias is the frame's share minus the
 * city's share, and more asking can't change it. The spread follows the
 * standard error of a simple random sample, with the finite-population
 * correction because nobody is asked twice (Penn State STAT 506, Lesson 2.2:
 * https://online.stat.psu.edu/stat506/Lesson02). Pure functions, no DOM.
 */
(() => {
  'use strict';

  const COLS = 60,
    ROWS = 40,
    HOODS_ACROSS = 4,
    HOODS_DOWN = 3;
  const HOODS = HOODS_ACROSS * HOODS_DOWN;
  const METHODS = Object.freeze(['random', 'hood', 'volunteer']);
  // "Whoever answers": the chance that a resident replies, by favourite colour [blue, orange].
  const REPLY = Object.freeze([0.35, 0.75]);

  /** Mulberry32: a tiny seedable generator giving numbers in [0, 1). */
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** A standard normal draw (Box–Muller). */
  function normal(random) {
    const u = 1 - random(),
      v = random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  const logit = (p) => Math.log(p / (1 - p));
  const logistic = (x) => 1 / (1 + Math.exp(-x));

  /**
   * Build a city from a seed. Neighbourhood centres sit on a jittered 4 × 3
   * grid and every resident belongs to the nearest one, which gives blocky,
   * uneven neighbourhoods. Each neighbourhood's share of orange fans is drawn
   * on the logit scale around the city mean (`mean`, with spread `spread`);
   * each resident then likes orange with their neighbourhood's chance, and
   * replies to surveys with a chance that depends on their colour (REPLY).
   * `likes[i]` is 1 for orange and 0 for blue. The true share is counted
   * exactly from every resident, never estimated.
   */
  function city(seed, { mean = 0.46, spread = 1.7 } = {}) {
    const random = rng(seed);
    const n = COLS * ROWS;
    const centres = [];
    for (let j = 0; j < HOODS_DOWN; j++)
      for (let i = 0; i < HOODS_ACROSS; i++)
        centres.push({
          x: ((i + 0.5 + (random() - 0.5) * 0.6) * COLS) / HOODS_ACROSS,
          y: ((j + 0.5 + (random() - 0.5) * 0.6) * ROWS) / HOODS_DOWN,
        });
    const shares = centres.map(() => logistic(logit(mean) + spread * normal(random)));
    const hood = new Uint8Array(n),
      likes = new Uint8Array(n),
      answers = new Uint8Array(n);
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c;
        let best = 0,
          bestDistance = Infinity;
        centres.forEach((p, k) => {
          const d = (c + 0.5 - p.x) ** 2 + (r + 0.5 - p.y) ** 2;
          if (d < bestDistance) {
            bestDistance = d;
            best = k;
          }
        });
        hood[i] = best;
        likes[i] = random() < shares[best] ? 1 : 0;
        answers[i] = random() < REPLY[likes[i]] ? 1 : 0;
      }
    let orange = 0;
    for (let i = 0; i < n; i++) orange += likes[i];
    return Object.freeze({
      seed,
      cols: COLS,
      rows: ROWS,
      size: n,
      hoods: HOODS,
      centres,
      hood,
      likes,
      answers,
      orange,
      share: orange / n, // the true city-wide share of orange fans
    });
  }

  /** The residents a method can reach, as a list of resident indices. */
  function frame(town, method, hoodIndex = 0) {
    const list = [];
    for (let i = 0; i < town.size; i++) {
      if (method === 'hood' && town.hood[i] !== hoodIndex) continue;
      if (method === 'volunteer' && !town.answers[i]) continue;
      list.push(i);
    }
    return Int32Array.from(list);
  }

  /** The exact share of orange fans within a frame: what its random samples average to. */
  function frameShare(town, list) {
    let orange = 0;
    for (const i of list) orange += town.likes[i];
    return list.length ? orange / list.length : 0;
  }

  /** Every neighbourhood's size and exact share of orange fans. */
  function neighbourhoods(town) {
    const sizes = new Array(town.hoods).fill(0),
      orange = new Array(town.hoods).fill(0);
    for (let i = 0; i < town.size; i++) {
      sizes[town.hood[i]]++;
      orange[town.hood[i]] += town.likes[i];
    }
    return sizes.map((size, k) => ({ size, share: size ? orange[k] / size : 0 }));
  }

  /** The neighbourhood whose share is furthest from the whole city's. */
  function oddestHood(town) {
    let best = 0,
      gap = -1;
    neighbourhoods(town).forEach((h, k) => {
      if (Math.abs(h.share - town.share) > gap) {
        gap = Math.abs(h.share - town.share);
        best = k;
      }
    });
    return best;
  }

  /**
   * One survey: a simple random sample of `n` distinct residents from the
   * frame (all of it when the frame is smaller), by a partial Fisher–Yates
   * shuffle. Returns who was asked and the share of them who like orange.
   */
  function survey(town, list, n, random) {
    const pool = Int32Array.from(list),
      m = Math.min(n, pool.length);
    let orange = 0;
    for (let k = 0; k < m; k++) {
      const j = k + Math.floor(random() * (pool.length - k));
      const pick = pool[j];
      pool[j] = pool[k];
      pool[k] = pick;
      orange += town.likes[pick];
    }
    return { asked: pool.slice(0, m), estimate: m ? orange / m : 0 };
  }

  /**
   * The standard error of the sample share for a simple random sample of n
   * from N people of whom a share p like orange, drawn without replacement:
   * √(p(1 − p)/n) × √((N − n)/(N − 1)). The second factor is the finite-
   * population correction; it reaches 0 when everyone is asked. Pass
   * N = Infinity for the familiar √(p(1 − p)/n).
   */
  function standardError(p, n, N = Infinity) {
    if (n <= 0) return NaN;
    if (n >= N) return 0;
    const correction = Number.isFinite(N) ? (N - n) / (N - 1) : 1;
    return Math.sqrt(((p * (1 - p)) / n) * correction);
  }

  /**
   * A summary of repeated estimates: their mean, their spread (standard
   * deviation around their own mean), and, given the truth, their typical
   * error (root-mean-square distance from the truth). Typical error² =
   * spread² + (mean − truth)²: random wobble plus bias.
   */
  function summary(estimates, truth = NaN) {
    const count = estimates.length;
    if (!count) return { count, mean: NaN, spread: NaN, error: NaN, bias: NaN };
    const mean = estimates.reduce((a, b) => a + b, 0) / count;
    const spread = Math.sqrt(estimates.reduce((a, e) => a + (e - mean) ** 2, 0) / count);
    const error = Math.sqrt(estimates.reduce((a, e) => a + (e - truth) ** 2, 0) / count);
    return { count, mean, spread, error, bias: mean - truth };
  }

  Wonderlattice.models.sample = Object.freeze({
    COLS,
    ROWS,
    HOODS,
    METHODS,
    REPLY,
    rng,
    normal,
    city,
    frame,
    frameShare,
    neighbourhoods,
    oddestHood,
    survey,
    standardError,
    summary,
  });
})();
