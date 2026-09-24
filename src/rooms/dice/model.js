/*
 * The dice that beat each other · nontransitive dice. Exact win chances come
 * from counting every pair of faces; rolls come from a small seedable
 * generator so tests can replay them. Sets from NRICH ("Non-Transitive Dice"),
 * Bradley Efron via Martin Gardner (Scientific American, December 1970), and
 * James Grime (singingbanana.com/dice). Pure functions, no DOM.
 */
(() => {
  'use strict';

  /**
   * Each set lists its dice in cycle order: every die usually beats the next,
   * and the last usually beats the first. `twoDice` marks the set whose cycle
   * reverses when each player rolls two of their die and adds them.
   */
  const SETS = Object.freeze([
    Object.freeze({
      id: 'three',
      dice: [
        [2, 2, 4, 4, 9, 9],
        [1, 1, 6, 6, 8, 8],
        [3, 3, 5, 5, 7, 7],
      ],
    }),
    Object.freeze({
      id: 'efron',
      dice: [
        [4, 4, 4, 4, 0, 0],
        [3, 3, 3, 3, 3, 3],
        [6, 6, 2, 2, 2, 2],
        [5, 5, 5, 1, 1, 1],
      ],
    }),
    Object.freeze({
      id: 'grime', // James Grime's red, blue and olive dice
      twoDice: true,
      dice: [
        [4, 4, 4, 4, 4, 9],
        [2, 2, 2, 7, 7, 7],
        [0, 5, 5, 5, 5, 5],
      ],
    }),
  ]);

  const gcd = (a, b) => (b ? gcd(b, a % b) : a);

  /** A fraction in lowest terms, as [numerator, denominator]. */
  function reduce(n, d) {
    const g = gcd(n, d) || 1;
    return [n / g, d / g];
  }

  /** Every total you can get by rolling `copies` of a die, one entry per equally likely outcome. */
  function outcomes(faces, copies = 1) {
    let totals = [0];
    for (let c = 0; c < copies; c++) totals = totals.flatMap((t) => faces.map((f) => t + f));
    return totals;
  }

  /**
   * Exact contest between two dice by counting every equally likely pair of
   * outcomes: 36 for one die each, 1296 for two each. Returns whole counts.
   */
  function exact(a, b, copies = 1) {
    const x = outcomes(a, copies),
      y = outcomes(b, copies);
    let win = 0,
      lose = 0;
    for (const p of x)
      for (const q of y) {
        if (p > q) win++;
        else if (p < q) lose++;
      }
    const total = x.length * y.length;
    return { win, lose, tie: total - win - lose, total };
  }

  /** The die in `set` with the best chance of beating die `i` (wins minus losses), and its exact odds. */
  function bestReply(set, i, copies = 1) {
    let best = -1,
      bestEdge = -Infinity,
      odds = null;
    set.dice.forEach((faces, j) => {
      if (j === i) return;
      const e = exact(faces, set.dice[i], copies);
      if (e.win - e.lose > bestEdge) {
        best = j;
        bestEdge = e.win - e.lose;
        odds = e;
      }
    });
    return { index: best, ...odds };
  }

  /**
   * Every pair of dice in a set, as an arrow from the usual winner to the
   * loser with its exact chance. Evenly matched pairs have `even: true`.
   */
  function victories(set, copies = 1) {
    const list = [];
    for (let i = 0; i < set.dice.length; i++)
      for (let j = i + 1; j < set.dice.length; j++) {
        const e = exact(set.dice[i], set.dice[j], copies);
        const forward = e.win >= e.lose;
        list.push({
          winner: forward ? i : j,
          loser: forward ? j : i,
          win: forward ? e.win : e.lose,
          lose: forward ? e.lose : e.win,
          tie: e.tie,
          total: e.total,
          even: e.win === e.lose,
        });
      }
    return list;
  }

  const mean = (faces) => faces.reduce((a, b) => a + b, 0) / faces.length;

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

  /**
   * One round: each side rolls `copies` of their die. Returns the face indices
   * rolled, the totals, and the result from side a's view (1 win, -1 loss, 0 tie).
   */
  function play(a, b, copies, random) {
    const pick = (faces) => Array.from({ length: copies }, () => Math.floor(random() * faces.length));
    const ra = pick(a),
      rb = pick(b);
    const sa = ra.reduce((t, k) => t + a[k], 0),
      sb = rb.reduce((t, k) => t + b[k], 0);
    return { a: ra, b: rb, totalA: sa, totalB: sb, result: Math.sign(sa - sb) };
  }

  Wonderloom.models.dice = Object.freeze({ SETS, reduce, outcomes, exact, bestReply, victories, mean, rng, play });
})();
