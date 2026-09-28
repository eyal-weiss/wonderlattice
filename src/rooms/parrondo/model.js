/*
 * Two losing games that win · Parrondo's paradox, in Harmer and Abbott's version (Nature, 1999).
 * Game A wins one coin with chance 1/2 − ε. Game B looks at your capital: on a multiple of 3 it uses a bad coin
 * (1/10 − ε), otherwise a good one (3/4 − ε). Each loses on its own; mixed, they win. Everything that matters
 * depends only on capital mod 3, so each game is a 3-state Markov chain and its long-run gain per round comes
 * from the chain's stationary distribution.
 * Pure functions, no DOM.
 */
(() => {
  'use strict';

  const EPSILON = 0.005;

  /** Capital mod 3, always 0, 1 or 2 (capital can go negative). */
  const mod3 = (capital) => ((capital % 3) + 3) % 3;

  /**
   * A game as its chance of winning in each of the three states (capital mod 3). 'R' is the random mix: each
   * round, A or B with equal chance, so its chances are the average of the two.
   */
  function coins(game, eps = EPSILON) {
    const a = [0.5 - eps, 0.5 - eps, 0.5 - eps],
      b = [0.1 - eps, 0.75 - eps, 0.75 - eps];
    if (game === 'A') return a;
    if (game === 'B') return b;
    if (game === 'R') return a.map((p, i) => (p + b[i]) / 2);
    throw new Error(`Unknown game: ${game}`);
  }

  /** The chance of winning the next round of a game with this capital: B's bad coin exactly on multiples of 3. */
  const winChance = (game, capital, eps = EPSILON) => coins(game, eps)[mod3(capital)];

  /** One round of a game moves a distribution over the three states: a win steps up one, a loss down one. */
  function advance(dist, win) {
    const next = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      next[(i + 1) % 3] += dist[i] * win[i];
      next[(i + 2) % 3] += dist[i] * (1 - win[i]);
    }
    return next;
  }

  /** The expected gain of one round from a distribution over the states: each state wins +1 or loses −1. */
  const drift = (dist, win) => dist.reduce((sum, d, i) => sum + d * (2 * win[i] - 1), 0);

  /** The 3 × 3 matrix of a sequence of rounds: row i is where state i ends up. */
  function cycleMatrix(games, eps = EPSILON) {
    return [0, 1, 2].map((i) => {
      let dist = [0, 0, 0];
      dist[i] = 1;
      for (const g of games) dist = advance(dist, coins(g, eps));
      return dist;
    });
  }

  /**
   * The stationary distribution of a 3-state chain with matrix m (rows sum to 1): the π with π·m = π and
   * π0 + π1 + π2 = 1, solved exactly by elimination (two balance equations and the sum).
   */
  function stationary(m) {
    // Unknowns π0, π1, π2. Rows: (m − I)ᵀ for states 0 and 1, then the sum.
    const rows = [
      [m[0][0] - 1, m[1][0], m[2][0], 0],
      [m[0][1], m[1][1] - 1, m[2][1], 0],
      [1, 1, 1, 1],
    ];
    for (let c = 0; c < 3; c++) {
      let pivot = c;
      for (let r = c + 1; r < 3; r++) if (Math.abs(rows[r][c]) > Math.abs(rows[pivot][c])) pivot = r;
      [rows[c], rows[pivot]] = [rows[pivot], rows[c]];
      for (let r = 0; r < 3; r++) {
        if (r === c) continue;
        const f = rows[r][c] / rows[c][c];
        for (let k = c; k < 4; k++) rows[r][k] -= f * rows[c][k];
      }
    }
    return rows.map((row, i) => row[3] / row[i]);
  }

  /**
   * The long-run gain per round of a repeating pattern of games, such as 'B', 'AABB' or 'R' (the random mix):
   * where the chain settles at the start of each repeat, and the average gain over one repeat from there.
   * Also returns `shares`, the long-run share of rounds spent in each state, and `badShare`, the share of B's
   * rounds that are played on a multiple of 3, with the bad coin (null when B is never played).
   */
  function longRun(pattern, eps = EPSILON) {
    const games = [...pattern];
    let dist = stationary(cycleMatrix(games, eps));
    let gain = 0,
      bad = 0,
      bRounds = 0;
    const shares = [0, 0, 0];
    for (const g of games) {
      const win = coins(g, eps);
      gain += drift(dist, win);
      dist.forEach((d, i) => (shares[i] += d / games.length));
      // In the random mix, half the rounds are B's, whatever the capital.
      const b = g === 'B' ? 1 : g === 'R' ? 0.5 : 0;
      bad += b * dist[0];
      bRounds += b;
      dist = advance(dist, win);
    }
    return { gain: gain / games.length, shares, badShare: bRounds ? bad / bRounds : null };
  }

  /**
   * The exact expected capital after each round, for players who all start with capital `start` and play
   * `pattern` over and over. `mean[t]` is the expectation after t rounds; `shares[t]` is the chance of being in
   * each state (capital mod 3) then. Exact at every round, not just in the long run.
   */
  function expected(pattern, rounds, start = 0, eps = EPSILON) {
    const games = [...pattern];
    const mean = new Float64Array(rounds + 1);
    const shares = [];
    let dist = [0, 0, 0];
    dist[mod3(start)] = 1;
    mean[0] = start;
    shares.push(dist);
    for (let t = 0; t < rounds; t++) {
      const win = coins(games[t % games.length], eps);
      mean[t + 1] = mean[t] + drift(dist, win);
      dist = advance(dist, win);
      shares.push(dist);
    }
    return { mean, shares };
  }

  /**
   * The share of B's rounds that may land on a multiple of 3 before B stops paying: below it, B wins on average.
   * (It is 5/13 when ε = 0.)
   */
  function breakEven(eps = EPSILON) {
    const [bad, good] = coins('B', eps);
    return (2 * good - 1) / (2 * good - 1 - (2 * bad - 1));
  }

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
   * One round for a whole crowd, in place. Every player plays `game` ('A' or 'B'), or with 'R' each player picks
   * A or B for themselves with a fair coin. Returns the crowd's total capital, how many played B, and how many
   * of those used B's bad coin.
   */
  function playRound(capital, game, rand, eps = EPSILON) {
    let total = 0,
      b = 0,
      bad = 0;
    for (let i = 0; i < capital.length; i++) {
      const g = game === 'R' ? (rand() < 0.5 ? 'A' : 'B') : game;
      if (g === 'B') {
        b++;
        if (mod3(capital[i]) === 0) bad++;
      }
      capital[i] += rand() < winChance(g, capital[i], eps) ? 1 : -1;
      total += capital[i];
    }
    return { total, b, bad };
  }

  /**
   * Simulate `players` players for `rounds` rounds of a pattern, all from capital 0. Returns the average capital
   * after each round (index 0 is the start), everyone's final capital, and the share of B's plays that used the
   * bad coin.
   */
  function simulate(pattern, rounds, players, seed = 1, eps = EPSILON) {
    const rand = random(seed);
    const capital = new Int32Array(players);
    const average = new Float64Array(rounds + 1);
    let b = 0,
      bad = 0;
    for (let t = 0; t < rounds; t++) {
      const round = playRound(capital, pattern[t % pattern.length], rand, eps);
      average[t + 1] = round.total / players;
      b += round.b;
      bad += round.bad;
    }
    return { average, capital, badShare: b ? bad / b : null };
  }

  /**
   * A pattern of A and B as one whole number, so it fits in a shared link: a leading 1, then a bit per round
   * (A = 0, B = 1). 'AABB' is 0b10011 = 19.
   */
  const encodePattern = (pattern) => [...pattern].reduce((n, g) => n * 2 + (g === 'B' ? 1 : 0), 1);

  /** The pattern a number stands for (the inverse of encodePattern); '' for numbers below 2. */
  function decodePattern(n) {
    let out = '';
    for (let k = Math.floor(n); k > 1; k = Math.floor(k / 2)) out = (k % 2 ? 'B' : 'A') + out;
    return out;
  }

  Wonderlattice.models.parrondo = Object.freeze({
    EPSILON,
    mod3,
    coins,
    winChance,
    advance,
    drift,
    cycleMatrix,
    stationary,
    longRun,
    expected,
    breakEven,
    random,
    playRound,
    simulate,
    encodePattern,
    decodePattern,
  });
})();
