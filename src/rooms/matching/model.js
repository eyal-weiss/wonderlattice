/*
 * Who asks wins · stable matching of six students with six clubs.
 * Everyone ranks everyone on the other side. A pairing is stable when no student and club would both rather have
 * each other than the partners they've got (such a pair is a "blocking pair"). Deferred acceptance, in rounds: every
 * unpaired asker applies to the best place on their list they haven't tried; each one asked keeps the best offer it
 * has had so far and sends the rest back. It always ends with a stable pairing, after at most n² − 2n + 2 rounds, and
 * that pairing gives every asker the best partner they have in any stable pairing, and everyone asked the worst.
 * D. Gale and L. S. Shapley, "College admissions and the stability of marriage", Amer. Math. Monthly 69 (1962) 9–15.
 * Pure functions on plain arrays, no DOM.
 */
(() => {
  'use strict';

  const N = 6;

  // Hand-picked wishes (students[s] lists clubs best first; clubs[c] lists students best first).
  // 0: tangled wishes with five stable pairings, where asking first decides almost everything.
  // 1: the same students, but every club ranks the students the same way: only one stable pairing.
  // 2: each student's favourite club likes them least: six stable pairings, from one extreme to the other.
  const TANGLED = [
    [5, 2, 1, 4, 0, 3],
    [4, 2, 3, 0, 1, 5],
    [1, 0, 2, 3, 4, 5],
    [1, 2, 3, 0, 5, 4],
    [2, 3, 4, 5, 1, 0],
    [0, 4, 5, 1, 3, 2],
  ];
  const PROFILES = [
    {
      students: TANGLED,
      clubs: [
        [0, 2, 4, 5, 3, 1],
        [4, 2, 1, 0, 5, 3],
        [1, 0, 2, 4, 3, 5],
        [5, 4, 1, 2, 3, 0],
        [2, 0, 3, 5, 1, 4],
        [1, 2, 3, 5, 4, 0],
      ],
    },
    { students: TANGLED, clubs: Array.from({ length: N }, () => [0, 1, 2, 3, 4, 5]) },
    {
      students: Array.from({ length: N }, (_, s) => Array.from({ length: N }, (_, k) => (s + k) % N)),
      clubs: Array.from({ length: N }, (_, c) => Array.from({ length: N }, (_, k) => (c + 1 + k) % N)),
    },
  ];

  /** A small seeded random generator (mulberry32), so shuffled wishes come back the same from a link. */
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

  /** 0, 1, …, n − 1 in a random order. */
  function shuffled(n, random) {
    const list = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  /** Everyone's wishes: a hand-picked set (0, 1, 2), or shuffled ones from any other number. */
  function wishes(id) {
    if (PROFILES[id])
      return { students: PROFILES[id].students.map((l) => [...l]), clubs: PROFILES[id].clubs.map((l) => [...l]) };
    const random = rng(id * 2654435761);
    return {
      students: Array.from({ length: N }, () => shuffled(N, random)),
      clubs: Array.from({ length: N }, () => shuffled(N, random)),
    };
  }

  /** Where each name sits on one list: place[x] = 0 for the favourite. */
  function places(list) {
    const place = new Array(list.length);
    list.forEach((x, i) => (place[x] = i));
    return place;
  }

  /**
   * Deferred acceptance, in rounds. askers[a] and takers[b] are wish lists, best first.
   * Returns partner (asker → taker), held (taker → asker), the number of applications, and every round:
   * { asks: [[a, b]], held: taker → asker after the round (−1 for none), dropped: [[a, b]] } where dropped are the
   * applications sent back that round (a new one turned away, or one held before and now let go).
   */
  function defer(askers, takers) {
    const n = askers.length;
    const rank = takers.map(places);
    const next = new Array(n).fill(0);
    const held = new Array(n).fill(-1);
    const rounds = [];
    let free = Array.from({ length: n }, (_, a) => a),
      applications = 0;
    while (free.length) {
      const asks = free.map((a) => [a, askers[a][next[a]++]]);
      applications += asks.length;
      const dropped = [];
      for (const [a, b] of asks) {
        if (held[b] < 0) held[b] = a;
        else if (rank[b][a] < rank[b][held[b]]) {
          dropped.push([held[b], b]);
          held[b] = a;
        } else dropped.push([a, b]);
      }
      free = dropped.map(([a]) => a).sort((x, y) => x - y);
      rounds.push({ asks, held: [...held], dropped });
    }
    const partner = new Array(n);
    held.forEach((a, b) => (partner[a] = b));
    return { partner, held, rounds, applications };
  }

  /** partner[a] = b → back[b] = a. */
  function invert(partner) {
    const back = new Array(partner.length);
    partner.forEach((b, a) => (back[b] = a));
    return back;
  }

  /** Every student and club who would both rather have each other than their partners: [[student, club]]. */
  function blocking({ students, clubs }, partner) {
    const n = students.length;
    const back = invert(partner);
    const sRank = students.map(places),
      cRank = clubs.map(places);
    const pairs = [];
    for (let s = 0; s < n; s++)
      for (let c = 0; c < n; c++)
        if (c !== partner[s] && sRank[s][c] < sRank[s][partner[s]] && cRank[c][s] < cRank[c][back[c]])
          pairs.push([s, c]);
    return pairs;
  }

  const stable = (w, partner) => blocking(w, partner).length === 0;

  /** Every stable pairing (student → club), by trying all n! pairings: 720 for six of each. */
  function allStable(w) {
    const n = w.students.length;
    const found = [];
    const partner = new Array(n),
      used = new Array(n).fill(false);
    (function place(s) {
      if (s === n) {
        if (stable(w, partner)) found.push([...partner]);
        return;
      }
      for (let c = 0; c < n; c++)
        if (!used[c]) {
          used[c] = true;
          partner[s] = c;
          place(s + 1);
          used[c] = false;
        }
    })(0);
    return found;
  }

  /** Each person's choice number for their partner: 1 for their favourite. */
  const choices = (lists, partner) => lists.map((list, i) => list.indexOf(partner[i]) + 1);

  /** The average choice number over one side. */
  const average = (lists, partner) => choices(lists, partner).reduce((sum, k) => sum + k, 0) / lists.length;

  /** For each student and each club, the partners they have in at least one stable pairing. */
  function stablePartners(w, all = allStable(w)) {
    const n = w.students.length;
    const students = Array.from({ length: n }, () => new Set()),
      clubs = Array.from({ length: n }, () => new Set());
    for (const partner of all)
      partner.forEach((c, s) => {
        students[s].add(c);
        clubs[c].add(s);
      });
    return { students, clubs };
  }

  /** Student s and club c become partners; their old partners pair up with each other. */
  function pair(partner, s, c) {
    const next = [...partner];
    const other = next.indexOf(c);
    next[other] = next[s];
    next[s] = c;
    return next;
  }

  /** Two pairings are the same. */
  const same = (a, b) => a.every((c, s) => c === b[s]);

  Wonderlattice.models.matching = {
    N,
    PROFILES: PROFILES.length,
    rng,
    wishes,
    defer,
    invert,
    blocking,
    stable,
    allStable,
    choices,
    average,
    stablePartners,
    pair,
    same,
  };
})();
