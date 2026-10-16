/*
 * The machine that found flavours · how recommendations work (low-rank matrix factorisation).
 * Forty invented people say whether they like sixteen foods; many cells of the table are blank. We planted the
 * answer: each food has two hidden traits (how sweet, how rich), each person a taste for each, and a person likes a
 * food when their taste times its traits, plus a little whim, comes out positive. The method never sees the traits.
 * It gives every person and every food two numbers (a point on a map), guesses each cell as the dot product of the
 * two points, and nudges the points by gradient descent to match the known cells, with a small penalty on large
 * numbers. Foods liked by the same people end up in the same direction, so the map sorts them by flavour.
 * Pure functions, no DOM.
 */
(() => {
  'use strict';

  /**
   * The sixteen foods and their planted traits: [sweet (+) or savoury (−), rich (+) or light (−)], each from −1
   * to 1. The order is the room's order (its words and pictures follow it).
   */
  const TRAITS = [
    [0.88, 0.74], // chocolate
    [0.93, 0.37], // ice cream
    [0.56, 0.89], // doughnuts
    [0.39, 0.46], // pancakes
    [0.65, -0.55], // strawberries
    [0.49, -0.93], // watermelon
    [0.94, -0.34], // mango
    [-0.06, 0.34], // popcorn
    [-0.64, 0.71], // pizza
    [-0.52, 0.97], // burgers
    [-0.91, 0.42], // chips
    [-0.58, 0.16], // cheese
    [-0.5, -0.81], // salad
    [-0.22, -0.82], // cucumber
    [-0.66, -0.24], // sushi
    [-0.83, -0.65], // broccoli
  ];
  const FOODS = TRAITS.length;
  const PEOPLE = 40;
  const WHIM = 0.3; // the spread of each person's whim about each food
  const PENALTY = 1; // λ, the penalty on large numbers
  const RATE = 0.01; // the gradient-descent step
  const START = 0.05; // the spread of the random starting points
  const ROUNDS = 1500; // the most rounds the method runs
  const SETTLED = 1e-7; // it stops when a round improves the fit by less than this share

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

  /**
   * The invented table for `seed`, with `blanks` percent of its cells hidden: `truth[i·16 + j]` is +1 when person i
   * likes food j and −1 when not, and `known` marks the cells the method may see. The hidden cells are the first ones
   * of a shuffled order, so more blanks hide more of the same cells. `tastes` are the people's planted tastes.
   */
  function table(seed, blanks) {
    const rand = random(seed);
    const tastes = [];
    for (let i = 0; i < PEOPLE; i++) {
      const angle = rand() * 2 * Math.PI,
        strength = 0.7 + 0.6 * rand();
      tastes.push([strength * Math.cos(angle), strength * Math.sin(angle)]);
    }
    const truth = new Int8Array(PEOPLE * FOODS);
    for (let i = 0; i < PEOPLE; i++)
      for (let j = 0; j < FOODS; j++) {
        const score = tastes[i][0] * TRAITS[j][0] + tastes[i][1] * TRAITS[j][1] + WHIM * normal(rand);
        truth[i * FOODS + j] = score >= 0 ? 1 : -1;
      }
    const order = Array.from({ length: PEOPLE * FOODS }, (_, k) => k);
    for (let k = order.length - 1; k > 0; k--) {
      const m = Math.floor(rand() * (k + 1));
      [order[k], order[m]] = [order[m], order[k]];
    }
    const known = new Uint8Array(PEOPLE * FOODS).fill(1);
    const hidden = Math.round((Math.max(0, Math.min(100, blanks)) / 100) * PEOPLE * FOODS);
    for (let k = 0; k < hidden; k++) known[order[k]] = 0;
    // The method's random starting points come from the same seed, so a link replays the same run.
    const begin = Float64Array.from({ length: 2 * (PEOPLE + FOODS) }, () => START * normal(rand));
    return { tastes, truth, known, hidden, begin };
  }

  /**
   * The method's starting point for a table: every person and food a small random point near the middle. People's
   * points are `people[2i], people[2i + 1]`; foods' are `foods[2j], foods[2j + 1]`.
   */
  function start(data, penalty = PENALTY) {
    const people = data.begin.slice(0, 2 * PEOPLE),
      foods = data.begin.slice(2 * PEOPLE);
    return { people, foods, round: 0, loss: loss(data, people, foods, penalty), settled: false };
  }

  /** The guess for person i and food j: the dot product of their points. */
  const guess = (people, foods, i, j) => people[2 * i] * foods[2 * j] + people[2 * i + 1] * foods[2 * j + 1];

  /** What the method minimises: the squared misses on the known cells, plus `penalty` times every number squared. */
  function loss(data, people, foods, penalty = PENALTY) {
    let sum = 0;
    for (let i = 0; i < PEOPLE; i++)
      for (let j = 0; j < FOODS; j++)
        if (data.known[i * FOODS + j]) sum += (data.truth[i * FOODS + j] - guess(people, foods, i, j)) ** 2;
    for (const x of people) sum += penalty * x * x;
    for (const x of foods) sum += penalty * x * x;
    return sum;
  }

  /** One round of gradient descent: every point moves a little downhill at once. Returns the fit, changed. */
  function step(data, fit, penalty = PENALTY, rate = RATE) {
    const { people, foods } = fit;
    const gp = people.map((x) => 2 * penalty * x),
      gf = foods.map((x) => 2 * penalty * x);
    for (let i = 0; i < PEOPLE; i++)
      for (let j = 0; j < FOODS; j++) {
        if (!data.known[i * FOODS + j]) continue;
        const miss = data.truth[i * FOODS + j] - guess(people, foods, i, j);
        gp[2 * i] -= 2 * miss * foods[2 * j];
        gp[2 * i + 1] -= 2 * miss * foods[2 * j + 1];
        gf[2 * j] -= 2 * miss * people[2 * i];
        gf[2 * j + 1] -= 2 * miss * people[2 * i + 1];
      }
    for (let k = 0; k < people.length; k++) people[k] -= rate * gp[k];
    for (let k = 0; k < foods.length; k++) foods[k] -= rate * gf[k];
    const before = fit.loss;
    fit.loss = loss(data, people, foods, penalty);
    fit.round++;
    fit.settled = fit.round >= ROUNDS || before - fit.loss < SETTLED * fit.loss;
    return fit;
  }

  /** The whole run, from the seeded start until it settles. */
  function solve(data, penalty = PENALTY, rate = RATE) {
    const fit = start(data, penalty);
    while (!fit.settled) step(data, fit, penalty, rate);
    return fit;
  }

  /** The share of the hidden cells whose guess has the right sign (liked or not), or null with no blanks. */
  function blanksRight(data, fit) {
    let right = 0,
      count = 0;
    for (let i = 0; i < PEOPLE; i++)
      for (let j = 0; j < FOODS; j++) {
        if (data.known[i * FOODS + j]) continue;
        count++;
        if ((guess(fit.people, fit.foods, i, j) >= 0 ? 1 : -1) === data.truth[i * FOODS + j]) right++;
      }
    return count ? right / count : null;
  }

  /** The share of the hidden cells that the planted traits themselves get right: the best any guesser could hope for. */
  function plantedRight(data) {
    let right = 0,
      count = 0;
    for (let i = 0; i < PEOPLE; i++)
      for (let j = 0; j < FOODS; j++) {
        if (data.known[i * FOODS + j]) continue;
        count++;
        const score = data.tastes[i][0] * TRAITS[j][0] + data.tastes[i][1] * TRAITS[j][1];
        if ((score >= 0 ? 1 : -1) === data.truth[i * FOODS + j]) right++;
      }
    return count ? right / count : null;
  }

  /**
   * A newcomer's point, from their ratings (+1 like, −1 not, 0 unrated) and the foods' points: the point whose
   * guesses best match the ratings, with the same penalty (a 2 × 2 least-squares problem). Null with no ratings.
   */
  function place(foods, ratings, penalty = PENALTY) {
    let a = penalty,
      b = 0,
      d = penalty,
      x = 0,
      y = 0,
      any = false;
    ratings.forEach((r, j) => {
      if (!r) return;
      any = true;
      const fx = foods[2 * j],
        fy = foods[2 * j + 1];
      a += fx * fx;
      b += fx * fy;
      d += fy * fy;
      x += r * fx;
      y += r * fy;
    });
    if (!any) return null;
    const det = a * d - b * b;
    return [(d * x - b * y) / det, (a * y - b * x) / det];
  }

  /** The foods to suggest: the unrated ones with the highest positive guesses for point `you`, best first. */
  function suggest(you, foods, ratings, count = 3) {
    if (!you) return [];
    return ratings
      .map((r, j) => ({ j, score: you[0] * foods[2 * j] + you[1] * foods[2 * j + 1], rated: !!r }))
      .filter((f) => !f.rated && f.score > 0)
      .sort((p, q) => q.score - p.score)
      .slice(0, count)
      .map((f) => f.j);
  }

  /**
   * How the planted traits sit on the discovered map: the turn (degrees, counter-clockwise in the map's own axes),
   * whether they are mirrored, and the scale that best carry the traits onto the foods' points (orthogonal
   * Procrustes), and `match`, the share of the map's spread that this explains (1 is perfect).
   */
  function align(foods) {
    let best = null;
    for (const flip of [1, -1]) {
      let dot = 0,
        cross = 0,
        size = 0;
      for (let j = 0; j < FOODS; j++) {
        const tx = TRAITS[j][0],
          ty = flip * TRAITS[j][1];
        dot += tx * foods[2 * j] + ty * foods[2 * j + 1];
        cross += tx * foods[2 * j + 1] - ty * foods[2 * j];
        size += tx * tx + ty * ty;
      }
      const angle = Math.atan2(cross, dot),
        scale = Math.hypot(dot, cross) / size;
      const at = (t) => {
        const tx = t[0],
          ty = flip * t[1];
        return [
          scale * (Math.cos(angle) * tx - Math.sin(angle) * ty),
          scale * (Math.sin(angle) * tx + Math.cos(angle) * ty),
        ];
      };
      let miss = 0,
        spread = 0;
      for (let j = 0; j < FOODS; j++) {
        const [x, y] = at(TRAITS[j]);
        miss += (x - foods[2 * j]) ** 2 + (y - foods[2 * j + 1]) ** 2;
        spread += foods[2 * j] ** 2 + foods[2 * j + 1] ** 2;
      }
      const match = spread ? 1 - miss / spread : 0;
      if (!best || match > best.match) best = { angle: (angle * 180) / Math.PI, flipped: flip < 0, scale, match, at };
    }
    return best;
  }

  /** The visitor's ratings as one whole number for links: food j's rating is base-3 digit j (0 none, 1 like, 2 not). */
  function encode(ratings) {
    return ratings.reduce((sum, r, j) => sum + (r > 0 ? 1 : r < 0 ? 2 : 0) * 3 ** j, 0);
  }

  /** The ratings from that number (anything outside the range reads as no ratings). */
  function decode(code) {
    let n = Number.isInteger(code) && code >= 0 && code < 3 ** FOODS ? code : 0;
    return Array.from({ length: FOODS }, () => {
      const digit = n % 3;
      n = Math.floor(n / 3);
      return digit === 1 ? 1 : digit === 2 ? -1 : 0;
    });
  }

  Wonderlattice.models.flavours = {
    TRAITS,
    FOODS,
    PEOPLE,
    WHIM,
    PENALTY,
    RATE,
    ROUNDS,
    random,
    table,
    start,
    guess,
    loss,
    step,
    solve,
    blanksRight,
    plantedRight,
    place,
    suggest,
    align,
    encode,
    decode,
  };
})();
