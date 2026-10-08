/*
 * Six handshakes · a small world: a ring of friends, plus a few random shortcuts. Pure functions, no DOM.
 *
 * n people sit in a ring, each friends with the `half` nearest people on either side (2 on each side: 4 friends).
 * A shortcut is one more friendship between two people chosen at random. Adding shortcuts, rather than moving
 * existing links, is the variant of the Watts–Strogatz model studied by Newman and Watts (1999).
 *
 * - Distance between two people: the fewest handshakes (links) on a chain from one to the other, found by a
 *   breadth-first search. The average is over every ordered pair of different people.
 * - Clustering ("do my friends know each other?"): for each person, the share of pairs of their friends who are
 *   friends themselves, averaged over everyone (Watts and Strogatz, 1998).
 *
 * For the ring alone both have exact values: the average distance is Σ⌈d/half⌉ over ring separations d (5050/199 ≈
 * 25.4 for 200 people with 4 friends each), and the clustering is 3(k − 2) / (4(k − 1)) for k = 2·half friends (½).
 */
(() => {
  'use strict';

  const PEOPLE = 200;
  const HALF = 2; // friends on each side
  const MOST = 60; // the most shortcuts the room offers

  /** A reproducible random source (mulberry32), so the same seed gives the same shortcuts. */
  function random(seed) {
    let a = Math.round(seed) >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** How far apart two places on the ring are, going the short way round. */
  const around = (a, b, n) => {
    const d = Math.abs(a - b) % n;
    return Math.min(d, n - d);
  };

  /** The ring's own friendships, as pairs [a, b] with a < b. */
  function ringLinks(n = PEOPLE, half = HALF) {
    const links = [];
    for (let i = 0; i < n; i++)
      for (let d = 1; d <= half; d++) {
        const j = (i + d) % n;
        links.push(i < j ? [i, j] : [j, i]);
      }
    return links;
  }

  /**
   * `count` random shortcuts in the order they arrive: each joins two people who weren't friends yet. The first k of
   * a longer list are the same as a list of k, so adding a shortcut never moves the others.
   */
  function shortcuts(count, seed, n = PEOPLE, half = HALF) {
    const rand = random(seed);
    const taken = new Set();
    const key = (a, b) => (a < b ? a * n + b : b * n + a);
    const list = [];
    while (list.length < count) {
      const a = Math.floor(rand() * n),
        b = Math.floor(rand() * n);
      if (a === b || around(a, b, n) <= half || taken.has(key(a, b))) continue;
      taken.add(key(a, b));
      list.push(a < b ? [a, b] : [b, a]);
    }
    return list;
  }

  /** Everyone's friends, as lists, for the ring plus the given shortcuts. */
  function friends(extra = [], n = PEOPLE, half = HALF) {
    const lists = Array.from({ length: n }, () => []);
    for (const [a, b] of [...ringLinks(n, half), ...extra]) {
      lists[a].push(b);
      lists[b].push(a);
    }
    return lists;
  }

  /** The fewest handshakes from `from` to everyone (−1 for anyone out of reach). */
  function distances(lists, from) {
    const n = lists.length;
    const dist = new Int16Array(n).fill(-1);
    const queue = new Int16Array(n);
    let head = 0,
      tail = 0;
    dist[from] = 0;
    queue[tail++] = from;
    while (head < tail) {
      const u = queue[head++];
      for (const v of lists[u])
        if (dist[v] < 0) {
          dist[v] = dist[u] + 1;
          queue[tail++] = v;
        }
    }
    return dist;
  }

  /** The average number of handshakes between two different people. */
  function averageDistance(lists) {
    const n = lists.length;
    let total = 0;
    for (let s = 0; s < n; s++) {
      const dist = distances(lists, s);
      for (let i = 0; i < n; i++) total += dist[i];
    }
    return total / (n * (n - 1));
  }

  /** The share of pairs of one's friends who are friends too, averaged over everyone. */
  function clustering(lists) {
    let sum = 0;
    for (const mine of lists) {
      const k = mine.length;
      if (k < 2) continue;
      const set = new Set(mine);
      let linked = 0;
      for (let i = 0; i < k; i++) for (const v of lists[mine[i]]) if (set.has(v)) linked++;
      sum += linked / (k * (k - 1)); // each linked pair was counted twice, once from each end
    }
    return sum / lists.length;
  }

  /** The exact values for the ring alone. */
  function ringDistance(n = PEOPLE, half = HALF) {
    let total = 0;
    for (let d = 1; d < n; d++) total += Math.ceil(Math.min(d, n - d) / half);
    return total / (n - 1);
  }
  const ringClustering = (half = HALF) => (3 * (2 * half - 2)) / (4 * (2 * half - 1));

  /** One shortest chain of people from `from` to `to`, both included (the same chain every time). */
  function path(lists, from, to) {
    const dist = distances(lists, to);
    if (dist[from] < 0) return [];
    const chain = [from];
    let at = from;
    while (at !== to) {
      // Step to the friend nearest the target; ties go to the lowest number, so the chain doesn't flicker.
      let next = -1;
      for (const v of lists[at]) if (dist[v] === dist[at] - 1 && (next < 0 || v < next)) next = v;
      chain.push(next);
      at = next;
    }
    return chain;
  }

  /**
   * How the world shrinks as shortcuts arrive: the average distance and the clustering with 0, 1, … `count` of the
   * shortcuts from this seed.
   */
  function curve(seed, count = MOST, n = PEOPLE, half = HALF) {
    const extra = shortcuts(count, seed, n, half);
    const distance = [],
      knit = [];
    for (let c = 0; c <= count; c++) {
      const lists = friends(extra.slice(0, c), n, half);
      distance.push(averageDistance(lists));
      knit.push(clustering(lists));
    }
    return { extra, distance, knit };
  }

  Wonderlattice.models.handshakes = Object.freeze({
    PEOPLE,
    HALF,
    MOST,
    random,
    around,
    ringLinks,
    shortcuts,
    friends,
    distances,
    averageDistance,
    clustering,
    ringDistance,
    ringClustering,
    path,
    curve,
  });
})();
