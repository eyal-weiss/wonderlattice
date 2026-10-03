/*
 * Kaleidoscope of cheaters · Nowak and May's spatial prisoner's dilemma.
 * Every cell of a square grid is a cooperator (1) or a cheater (0). Each generation, every cell plays the one-shot
 * game once with each of its eight neighbours and once with itself: two cooperators get 1 each, a cheater facing a
 * cooperator gets b (the temptation), and anything else gets 0. Then every cell takes the strategy of the highest
 * scorer among itself and its neighbours. Edges are fixed: a cell on the edge simply has fewer neighbours.
 * M. A. Nowak and R. M. May, "Evolutionary games and spatial chaos", Nature 359 (1992) 826–829.
 * Pure functions on plain objects, no DOM.
 */
(() => {
  'use strict';

  const SIZE = 99; // Nowak and May's grid: 99 × 99, so one cell sits exactly in the middle
  const CHAOS = [1.8, 2]; // temptations between these give the endless-looking patterns
  const ESTIMATE = 12 * Math.log(2) - 8; // Nowak and May's estimate of the share of cooperators there, about 0.318

  /** A grid of n × n cooperators. `was` holds each cell's strategy before the latest generation. */
  function create(n = SIZE) {
    const cells = n * n;
    return {
      n,
      c: new Uint8Array(cells).fill(1),
      was: new Uint8Array(cells).fill(1),
      score: new Float64Array(cells),
      next: new Uint8Array(cells),
      gen: 0,
    };
  }

  /** Back to generation 0: everyone cooperates, except one cheater in the middle. */
  function startOne(grid) {
    const { n, c } = grid;
    c.fill(1);
    c[(n >> 1) * n + (n >> 1)] = 0;
    grid.was.set(c);
    grid.gen = 0;
    return grid;
  }

  /** Back to generation 0: a crowd where each cell cheats with probability `share`. */
  function startCrowd(grid, share, seed) {
    const random = rng(seed);
    const { c } = grid;
    for (let i = 0; i < c.length; i++) c[i] = random() < share ? 0 : 1;
    grid.was.set(c);
    grid.gen = 0;
    return grid;
  }

  /** Cell i's total from its games with its neighbours and itself, with temptation b. */
  function scoreOf(grid, b, i) {
    const { n, c } = grid;
    const x = i % n,
      y = (i - x) / n;
    let k = 0; // cooperators among the cell and its neighbours
    for (let yy = Math.max(0, y - 1); yy <= Math.min(n - 1, y + 1); yy++)
      for (let xx = Math.max(0, x - 1); xx <= Math.min(n - 1, x + 1); xx++) k += c[yy * n + xx];
    // A cooperator earns 1 from every cooperator it meets, itself included; a cheater earns b from each.
    return c[i] ? k : b * k;
  }

  /** Every cell's score, from the current strategies. */
  function scoreAll(grid, b) {
    for (let i = 0; i < grid.c.length; i++) grid.score[i] = scoreOf(grid, b, i);
    return grid.score;
  }

  /**
   * The strategy cell i takes next, from the scores in `grid.score`: that of the best scorer among itself and its
   * neighbours. When the best cooperator and the best cheater score the same, the cell keeps its own strategy.
   */
  function choose(grid, i) {
    const { n, c, score } = grid;
    const x = i % n,
      y = (i - x) / n;
    let bestC = -1,
      bestD = -1;
    for (let yy = Math.max(0, y - 1); yy <= Math.min(n - 1, y + 1); yy++)
      for (let xx = Math.max(0, x - 1); xx <= Math.min(n - 1, x + 1); xx++) {
        const j = yy * n + xx;
        if (c[j]) bestC = Math.max(bestC, score[j]);
        else bestD = Math.max(bestD, score[j]);
      }
    if (Math.abs(bestC - bestD) < 1e-9) return c[i];
    return bestC > bestD ? 1 : 0;
  }

  /** One generation with everyone switching at once (Nowak and May's rule). Returns how many cells switched. */
  function step(grid, b) {
    scoreAll(grid, b);
    const { c, was, next } = grid;
    let changed = 0;
    for (let i = 0; i < c.length; i++) {
      next[i] = choose(grid, i);
      if (next[i] !== c[i]) changed++;
    }
    was.set(c);
    c.set(next);
    grid.gen++;
    return changed;
  }

  /**
   * One generation of cells switching one at a time, in random order (as Huberman and Glance did): n × n times, a
   * random cell looks at its neighbourhood as it is at that moment and copies its best scorer. Some cells are
   * picked twice and some not at all. Returns how many cells ended the generation with a new strategy.
   */
  function stepOneByOne(grid, b, random) {
    const { n, c, was, score } = grid;
    scoreAll(grid, b);
    was.set(c);
    for (let k = 0; k < c.length; k++) {
      const i = Math.floor(random() * c.length);
      const s = choose(grid, i);
      if (s === c[i]) continue;
      c[i] = s;
      // Only the scores of this cell and its neighbours change.
      const x = i % n,
        y = (i - x) / n;
      for (let yy = Math.max(0, y - 1); yy <= Math.min(n - 1, y + 1); yy++)
        for (let xx = Math.max(0, x - 1); xx <= Math.min(n - 1, x + 1); xx++)
          score[yy * n + xx] = scoreOf(grid, b, yy * n + xx);
    }
    grid.gen++;
    let changed = 0;
    for (let i = 0; i < c.length; i++) if (c[i] !== was[i]) changed++;
    return changed;
  }

  /** Would no cell switch, whichever way they update? Then the grid has settled for good. */
  function settled(grid, b) {
    scoreAll(grid, b);
    for (let i = 0; i < grid.c.length; i++) if (choose(grid, i) !== grid.c[i]) return false;
    return true;
  }

  /** How many cells cooperate. */
  function cooperators(grid) {
    let k = 0;
    for (let i = 0; i < grid.c.length; i++) k += grid.c[i];
    return k;
  }

  /** Switch one cell by hand. It isn't shown as newly switched: the visitor did it, not the game. */
  function toggle(grid, i) {
    grid.c[i] ^= 1;
    grid.was[i] = grid.c[i];
  }

  /** Does the grid look the same after every rotation and reflection of the square? */
  function symmetric(grid) {
    const { n, c } = grid;
    for (let y = 0; y < n; y++)
      for (let x = 0; x < n; x++) {
        const v = c[y * n + x];
        const images = [
          [n - 1 - x, y],
          [x, n - 1 - y],
          [y, x],
          [n - 1 - y, n - 1 - x],
        ];
        for (const [xx, yy] of images) if (c[yy * n + xx] !== v) return false;
      }
    return true;
  }

  /** A small seedable generator (mulberry32), so a crowd can be drawn again exactly. */
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

  Wonderlattice.models.cheaters = {
    SIZE,
    CHAOS,
    ESTIMATE,
    create,
    startOne,
    startCrowd,
    scoreOf,
    scoreAll,
    choose,
    step,
    stepOneByOne,
    settled,
    cooperators,
    toggle,
    symmetric,
    rng,
  };
})();
