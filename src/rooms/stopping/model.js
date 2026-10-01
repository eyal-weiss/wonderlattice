/*
 * Stop at 37% · the secretary problem, which Martin Gardner's readers met as the "Game of Googol" (Scientific
 * American, February 1960). n cards in random order are turned one at a time, with no going back. The rule with
 * cutoff r: look at the first r cards without taking any, then take the first card that beats all of them; if none
 * does, the last card is yours. This file has the rule's exact chances, the best any rule can do, the deals, and a
 * simulation that plays every cutoff on each deal at once.
 * Pure functions, no DOM.
 */
(() => {
  'use strict';

  const EULER = 0.5772156649015329; // the Euler–Mascheroni constant

  /** A small seeded random number generator (mulberry32), so a shared link deals the same cards. */
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

  /** H(m) = 1 + 1/2 + … + 1/m: summed for small m, and from its asymptotic series beyond (good to about 1e-15). */
  function harmonic(m) {
    if (m <= 0) return 0;
    if (m < 1000) {
      let h = 0;
      for (let i = m; i >= 1; i--) h += 1 / i;
      return h;
    }
    const m2 = m * m;
    return Math.log(m) + EULER + 1 / (2 * m) - 1 / (12 * m2) + 1 / (120 * m2 * m2);
  }

  /**
   * The chance that the rule with cutoff r (0 ≤ r < n) takes the very best of n cards:
   * P(r) = (r/n) · Σ_{i=r+1}^{n} 1/(i − 1) = (r/n) · (H(n − 1) − H(r − 1)). With r = 0 it takes the first card: 1/n.
   */
  const chanceBest = (n, r) => (r <= 0 ? 1 / n : (r / n) * (harmonic(n - 1) - harmonic(r - 1)));

  /**
   * The chance that the rule with cutoff r takes one of the k best of n cards. The rule takes card i (r < i ≤ n)
   * when the best of the first i − 1 cards is among the first r and card i beats it: chance r / (i(i − 1)). That
   * card is then the best of i cards in random positions, so it is the j-th best of all n with chance
   * C(n − j, i − 1) / C(n, i). If the very best card is among the first r (chance r/n), nothing beats them and the
   * rule ends on the last card, which is then equally likely to be any of the other n − 1.
   */
  function chanceTop(n, r, k) {
    if (n <= 1) return 1;
    k = Math.min(k, n);
    if (r <= 0) return k / n;
    let total = 0;
    for (let i = r + 1; i <= n; i++) {
      // C(n − j, i − 1) / C(n, i) for j = 1, 2, …, k, each from the one before; it reaches 0 once j > n − i + 1.
      let q = i / n,
        sum = 0;
      for (let j = 1; j <= k && q > 0; j++) {
        sum += q;
        q *= (n - i - j + 1) / (n - j);
      }
      total += (r / (i * (i - 1))) * sum;
    }
    return total + ((r / n) * (k - 1)) / (n - 1);
  }

  /** The rule's chance of a card among the k best: k = 1 is the classic problem. */
  const chance = (n, r, k = 1) => (k === 1 ? chanceBest(n, r) : chanceTop(n, r, k));

  /**
   * The cutoff with the best chance, and that chance. Every cutoff is tried for up to 2,000 cards; beyond that,
   * for the very best, the answer is within a step of n/e, so only cutoffs near it are tried.
   */
  function bestCutoff(n, k = 1) {
    let from = 0,
      to = n - 1;
    if (n > 2000 && k === 1) {
      from = Math.max(1, Math.floor(n / Math.E) - 3);
      to = Math.min(n - 1, Math.floor(n / Math.E) + 3);
    }
    let best = { cutoff: from, chance: -1 };
    for (let r = from; r <= to; r++) {
      const p = chance(n, r, k);
      if (p > best.chance) best = { cutoff: r, chance: p };
    }
    return best;
  }

  /** The rule's chance of the very best when n is huge and the cutoff is a share x of the cards: −x ln x. */
  const limit = (x) => (x > 0 && x <= 1 ? -x * Math.log(x) : 0);

  /**
   * The best any rule at all can do at taking one of the k best of n, when, as here, a rule can use only how each
   * card compares with the ones before it. Worked backwards from the last card, which must be taken: after i cards,
   * take the i-th if its chance of being among the k best is at least the chance of doing as well by going on.
   * Returns that best chance, and `from`: from[j − 1] is the first card (counting from 1) at which the best rule
   * takes a card that is j-th best so far. For k = 1 this is the cutoff rule; for k > 1 the best rule grows less
   * fussy as the cards run out.
   */
  function bestPossible(n, k) {
    k = Math.min(k, n);
    // Pascal's triangle up to n, as floating-point numbers (C(100, 50) is about 1e29, well within range).
    const C = [[1]];
    for (let m = 1; m <= n; m++) {
      C[m] = [1];
      for (let j = 1; j < m; j++) C[m][j] = C[m - 1][j - 1] + C[m - 1][j];
      C[m][m] = 1;
    }
    const binom = (m, j) => (j < 0 || j > m ? 0 : C[m][j]);
    // The chance that a card which is j-th best of the first i is among the k best of all n.
    const good = (i, j) => {
      let sum = 0;
      for (let a = j; a <= k; a++) sum += binom(a - 1, j - 1) * binom(n - a, i - j);
      return sum / binom(n, i);
    };
    const from = new Array(k).fill(n);
    let next = 0; // the chance of success from here on, acting as well as possible
    for (let j = 1; j <= n; j++) next += good(n, j) / n;
    for (let i = n - 1; i >= 1; i--) {
      let value = 0;
      for (let j = 1; j <= i; j++) {
        const take = good(i, j);
        if (take >= next && j <= k) from[j - 1] = i;
        value += Math.max(take, next) / i;
      }
      next = value;
    }
    return { chance: next, from };
  }

  /**
   * A deal of n cards: n different whole numbers in random order. Their sizes follow no fixed range: each deal has
   * its own scale, anywhere from tens to hundreds of millions, so a card's size alone says little about how it
   * ranks. A number drawn twice is drawn again, which leaves small numbers (drawn most often) early in the list, so
   * the cards are shuffled afterwards: every order of their ranks is then equally likely.
   */
  function deal(n, seed) {
    const rand = random(seed * 2654435761 + 12345);
    const low = rand() * 2,
      spread = 2.5 + rand() * 4;
    const seen = new Set(),
      values = [];
    while (values.length < n) {
      const v = Math.max(1, Math.round(10 ** (low + rand() * spread)));
      if (!seen.has(v)) {
        seen.add(v);
        values.push(v);
      }
    }
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }
    return values;
  }

  /** Each card's place among all the cards: 1 for the biggest. */
  function ranks(values) {
    const order = values.map((_, i) => i).sort((a, b) => values[b] - values[a]);
    const rank = new Array(values.length);
    order.forEach((i, place) => (rank[i] = place + 1));
    return rank;
  }

  /** The card (by position, from 0) the rule with cutoff r takes from these values. */
  function ruleChoice(values, r) {
    if (r <= 0) return 0;
    let bar = -Infinity;
    for (let i = 0; i < r && i < values.length; i++) bar = Math.max(bar, values[i]);
    for (let i = r; i < values.length; i++) if (values[i] > bar) return i;
    return values.length - 1;
  }

  /**
   * The position each cutoff takes in one order of ranks (1 for the biggest). A record is a card that beats every
   * card before it. The rule with cutoff r ≥ 1 takes the first record at or after position r (it beats the first r,
   * and nothing between beat them), or the last card if there is none; so one pass back over the records serves
   * every cutoff at once. `out` and `record` are reused between deals.
   */
  function picks(rank, out = new Int32Array(rank.length), record = new Uint8Array(rank.length)) {
    const n = rank.length;
    let lowest = Infinity;
    for (let i = 0; i < n; i++) {
      record[i] = rank[i] < lowest ? 1 : 0;
      if (record[i]) lowest = rank[i];
    }
    let next = -1;
    for (let r = n - 1; r >= 1; r--) {
      if (record[r]) next = r;
      out[r] = next >= 0 ? next : n - 1;
    }
    out[0] = 0;
    return out;
  }

  /** Empty tallies for `simulate`: per cutoff, the deals in which it found the very best, and one of the k best. */
  const tallies = (n) => ({ deals: 0, best: new Float64Array(n), top: new Float64Array(n) });

  /** Play `deals` random deals of n cards, every cutoff on each, adding to the tallies. */
  function simulate(n, k, deals, rand, tally) {
    const rank = new Int32Array(n),
      out = new Int32Array(n),
      record = new Uint8Array(n);
    for (let d = 0; d < deals; d++) {
      for (let i = 0; i < n; i++) rank[i] = i + 1;
      for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        const swap = rank[i];
        rank[i] = rank[j];
        rank[j] = swap;
      }
      picks(rank, out, record);
      for (let r = 0; r < n; r++) {
        const taken = rank[out[r]];
        if (taken === 1) tally.best[r]++;
        if (taken <= k) tally.top[r]++;
      }
      tally.deals++;
    }
    return tally;
  }

  Wonderlattice.models.stopping = Object.freeze({
    random,
    harmonic,
    chanceBest,
    chanceTop,
    chance,
    bestCutoff,
    limit,
    bestPossible,
    deal,
    ranks,
    ruleChoice,
    picks,
    tallies,
    simulate,
  });
})();
