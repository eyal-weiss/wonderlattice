/*
 * Everyone gets the biggest slice · fair cake-cutting.
 * A long cake, from 0 to 1, has three flavour zones: chocolate, strawberry and vanilla. Three people value it by
 * their own taste: each has a density, constant within a zone, and the whole cake is worth 1 to each of them. A
 * piece's worth to a person is the integral of their density over it. A division is proportional when everyone gets
 * at least 1/n by their own measure, and envy-free when nobody prefers someone else's share. Here: a fair cut into
 * three connected pieces, cut-and-choose for two, the naive cut-and-choose for three (which leaves someone envious),
 * and the Selfridge–Conway procedure, which is envy-free for three with at most five cuts.
 * Pure functions, no DOM.
 */
(() => {
  'use strict';

  /** Where the flavours change: chocolate on [0, 0.35), strawberry on [0.35, 0.65), vanilla on [0.65, 1]. */
  const ZONES = [0, 0.35, 0.65, 1];
  /**
   * Each person's own taste for each flavour (chocolate, strawberry, vanilla), before it is scaled so the whole cake
   * is worth 1: Ada loves chocolate and likes vanilla, Ben likes strawberry and vanilla, Cleo likes only strawberry.
   */
  const OWN = [
    [1, 0.1, 0.7],
    [0.35, 1, 1],
    [0.1, 1, 0.1],
  ];
  const PEOPLE = OWN.length;
  /** Who gets the left, middle and right piece, for each of the six ways to hand out three pieces. */
  const PERMS = [
    [0, 1, 2],
    [0, 2, 1],
    [1, 0, 2],
    [1, 2, 0],
    [2, 0, 1],
    [2, 1, 0],
  ];
  /** Someone envies another only if that share is worth more to them by more than a crumb: half a percent. */
  const CRUMB = 0.005;

  /**
   * The three densities for a mix from 0 (everyone likes every bit of cake the same) to 1 (each their own taste):
   * density = (1 − mix) + mix × own taste, scaled so the whole cake is worth 1.
   */
  function tastes(mix) {
    return OWN.map((w) => {
      let total = 0;
      for (let z = 0; z < 3; z++) total += w[z] * (ZONES[z + 1] - ZONES[z]);
      return w.map((v) => 1 - mix + (mix * v) / total);
    });
  }

  /** What [0, x] is worth to someone with density d. */
  function upTo(d, x) {
    let sum = 0;
    for (let z = 0; z < d.length; z++) {
      const a = ZONES[z],
        b = ZONES[z + 1];
      if (x <= a) break;
      sum += d[z] * (Math.min(x, b) - a);
    }
    return sum;
  }

  /** What [a, b] is worth to someone with density d. */
  const value = (d, a, b) => (b > a ? upTo(d, b) - upTo(d, a) : 0);

  /** The point x ≥ from where [from, x] is worth `worth` to density d (1 if the rest of the cake is worth less). */
  function point(d, from, worth) {
    const target = upTo(d, from) + worth;
    let sum = 0;
    for (let z = 0; z < d.length; z++) {
      const a = ZONES[z],
        b = ZONES[z + 1],
        piece = d[z] * (b - a);
      if (sum + piece >= target - 1e-15) return Math.max(from, Math.min(b, a + (target - sum) / d[z]));
      sum += piece;
    }
    return 1;
  }

  /** What a share (a list of [a, b] intervals) is worth to density d. */
  const worth = (d, share) => share.reduce((sum, [a, b]) => sum + value(d, a, b), 0);

  /**
   * Who envies whom. `shares[p]` is person p's list of intervals (empty for someone with nothing yet); only people in
   * `who` count. For each person: the one whose share they would most like instead, or −1.
   */
  function envy(D, shares, who = [0, 1, 2]) {
    return D.map((d, p) => {
      if (!who.includes(p) || !shares[p].length) return -1;
      const own = worth(d, shares[p]);
      let most = -1,
        by = CRUMB;
      for (const q of who)
        if (q !== p && shares[q].length && worth(d, shares[q]) - own > by) {
          by = worth(d, shares[q]) - own;
          most = q;
        }
      return most;
    });
  }

  /** The three people's shares for knives at `left` ≤ `right` and the pieces handed out by PERMS[perm]. */
  function shares(left, right, perm) {
    const cuts = [0, left, right, 1];
    const out = [[], [], []];
    PERMS[perm].forEach((p, k) => out[p].push([cuts[k], cuts[k + 1]]));
    return out;
  }

  /**
   * A fair cut into three connected pieces: for each way to hand them out, the cut that gives all three the same
   * share by their own taste, as large as it can be (found by bisection); then, of those where nobody envies anybody,
   * the one with the largest share. If none is envy-free, the one with the least envy.
   */
  function fairCut(D) {
    let best = null;
    PERMS.forEach(([a, b, c], perm) => {
      let lo = 0,
        hi = 1;
      for (let k = 0; k < 60; k++) {
        const t = (lo + hi) / 2;
        const x1 = point(D[a], 0, t),
          x2 = point(D[c], 0, 1 - t);
        if (x2 >= x1 && value(D[b], x1, x2) >= t) lo = t;
        else hi = t;
      }
      const left = point(D[a], 0, lo),
        right = Math.max(left, point(D[c], 0, 1 - lo));
      const s = shares(left, right, perm);
      let most = 0;
      for (let p = 0; p < PEOPLE; p++)
        for (let q = 0; q < PEOPLE; q++) most = Math.max(most, worth(D[p], s[q]) - worth(D[p], s[p]));
      const fair = most < 1e-9;
      const better =
        !best || (fair && !best.fair) || (fair === best.fair && (fair ? lo > best.share + 1e-12 : most < best.most));
      if (better) best = { left, right, perm, share: lo, fair, most };
    });
    return best;
  }

  /** Cut-and-choose for Ada and Ben: Ada cuts into two pieces equal for her, Ben takes the one he likes more. */
  function cutAndChoose(D) {
    const cut = point(D[0], 0, 0.5);
    const ben = value(D[1], cut, 1) > value(D[1], 0, cut) ? 1 : 0;
    return { cut, ben, ada: 1 - ben };
  }

  /** The naive extension to three: Ada cuts three pieces equal for her, Ben chooses, then Cleo, and Ada gets the last. */
  function naive(D) {
    const x1 = point(D[0], 0, 1 / 3),
      x2 = point(D[0], x1, 1 / 3);
    const pieces = [
      [0, x1],
      [x1, x2],
      [x2, 1],
    ];
    const favourite = (d, from) => from.reduce((k, j) => (value(d, ...pieces[j]) > value(d, ...pieces[k]) ? j : k));
    const ben = favourite(D[1], [0, 1, 2]);
    const cleo = favourite(
      D[2],
      [0, 1, 2].filter((k) => k !== ben),
    );
    const ada = [0, 1, 2].find((k) => k !== ben && k !== cleo);
    return { x1, x2, pieces, ben, cleo, ada };
  }

  /**
   * The Selfridge–Conway procedure, with Ada (0) cutting, Ben (1) trimming and Cleo (2) choosing first:
   * 1. Ada cuts three pieces equal for her.
   * 2. Ben trims his favourite until it ties with his second favourite (here, from its right-hand end), unless they
   *    already tie. The trimming waits.
   * 3. Cleo chooses, then Ben (who must take the trimmed piece if Cleo didn't), then Ada.
   * 4. Whichever of Ben and Cleo didn't take the trimmed piece cuts the trimming into three pieces equal for them;
   *    the one who took it chooses first, then Ada, then the one who cut.
   * Returns every step's numbers and each person's final share (a list of intervals).
   */
  function selfridgeConway(D) {
    const x1 = point(D[0], 0, 1 / 3),
      x2 = point(D[0], x1, 1 / 3);
    const thirds = [
      [0, x1],
      [x1, x2],
      [x2, 1],
    ];
    const v = thirds.map((piece) => value(D[1], ...piece));
    const order = [0, 1, 2].sort((i, j) => v[j] - v[i] || i - j);
    const [big, second] = order;
    const main = thirds.map((piece) => [...piece]);
    let trim = null;
    if (v[big] - v[second] > 1e-12) {
      const at = point(D[1], thirds[big][0], v[second]);
      trim = [at, thirds[big][1]];
      main[big] = [thirds[big][0], at];
    }
    const best = (d, from) => from.reduce((k, j) => (value(d, ...main[j]) > value(d, ...main[k]) + 1e-12 ? j : k));
    const cleo = best(D[2], [0, 1, 2]);
    const ben =
      trim && cleo !== big
        ? big
        : best(
            D[1],
            [0, 1, 2].filter((k) => k !== cleo),
          );
    const ada = [0, 1, 2].find((k) => k !== ben && k !== cleo);
    const picks = [ada, ben, cleo]; // the main piece each person takes
    const result = { x1, x2, thirds, big, second, trim, main, picks, shares: picks.map((k) => [main[k]]) };
    if (!trim) return result;

    // The trimming: the one who didn't take the trimmed piece (the cutter) cuts it into three equal for them.
    const taker = picks[1] === big ? 1 : 2,
      cutter = 3 - taker;
    const total = value(D[cutter], ...trim);
    const y1 = point(D[cutter], trim[0], total / 3),
      y2 = point(D[cutter], y1, total / 3);
    const bits = [
      [trim[0], y1],
      [y1, y2],
      [y2, trim[1]],
    ];
    const left = [0, 1, 2],
      bitOf = [-1, -1, -1];
    for (const p of [taker, 0, cutter]) {
      const k = left.reduce((k, j) => (value(D[p], ...bits[j]) > value(D[p], ...bits[k]) + 1e-12 ? j : k));
      bitOf[p] = k;
      left.splice(left.indexOf(k), 1);
    }
    bitOf.forEach((k, p) => result.shares[p].push(bits[k]));
    return Object.assign(result, { taker, cutter, bits, bitOf, y1, y2 });
  }

  Wonderlattice.models.cake = {
    ZONES,
    OWN,
    PEOPLE,
    PERMS,
    CRUMB,
    tastes,
    upTo,
    value,
    point,
    worth,
    envy,
    shares,
    fairCut,
    cutAndChoose,
    naive,
    selfridgeConway,
  };
})();
