/*
 * The mathematical loom · a four-shaft weaving draft. Pure functions, no DOM.
 *
 * A draft has three parts:
 *   threading  which shaft each warp (lengthwise) thread passes through
 *   tie-up     which shafts each treadle lifts
 *   treadling  which treadle is pressed for each weft (crosswise) pick
 * Warp shows on top where the pick's treadle lifts that thread's shaft, so the
 * cloth is a Boolean matrix product: treadling × tie-up × threadingᵀ.
 */
(() => {
  'use strict';

  const SHAFTS = 4;

  /** Repeating orders for threading and treadling (shaft or treadle numbers, 0-based). */
  const orders = [
    [0, 1, 2, 3], // straight: 1 2 3 4
    [0, 1, 2, 3, 2, 1], // point: 1 2 3 4 3 2
    [0, 1, 3, 2], // broken: 1 2 4 3
    [0, 0, 1, 1, 2, 2, 3, 3], // doubled: 1 1 2 2 3 3 4 4
  ];

  /** Colour orders along the warp or weft: 1 = dark thread, 0 = light thread. */
  const colourOrders = [
    [1], // solid dark
    [1, 1, 1, 1, 0, 0, 0, 0], // four dark, four light
    [1, 0], // alternating
    [1, 1, 0, 0], // two and two
    [0], // solid light
  ];

  /** Tie-ups are stored as a 16-bit number: bit (4·treadle + shaft) means "this treadle lifts this shaft". */
  const lifts = (tieup, treadle, shaft) => ((tieup >> (treadle * SHAFTS + shaft)) & 1) === 1;

  function tieupFrom(rows) {
    let bits = 0;
    rows.forEach((shafts, treadle) => shafts.forEach((shaft) => (bits |= 1 << (treadle * SHAFTS + shaft))));
    return bits;
  }

  const tieups = {
    plain: tieupFrom([
      [0, 2],
      [1, 3],
      [0, 2],
      [1, 3],
    ]),
    twill: tieupFrom([
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
    ]),
    thin: tieupFrom([[0], [1], [2], [3]]),
  };

  const at = (list, i) => list[((i % list.length) + list.length) % list.length];

  /**
   * The cloth as rows (picks) of booleans: true where the warp thread is on top.
   * `threading` and `treadling` are orders that repeat across the cloth.
   */
  function drawdown(threading, tieup, treadling, rows, columns) {
    return Array.from({ length: rows }, (_, i) =>
      Array.from({ length: columns }, (_, j) => lifts(tieup, at(treadling, i), at(threading, j))),
    );
  }

  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const lcm = (a, b) => (a / gcd(a, b)) * b;

  /** The smallest period p of a cyclic sequence (p divides its length). */
  function period(sequence, same = (a, b) => a === b) {
    const n = sequence.length;
    for (let p = 1; p <= n; p++) {
      if (n % p) continue;
      if (sequence.every((x, i) => same(x, sequence[(i + p) % n]))) return p;
    }
    return n;
  }

  /**
   * How often the coloured cloth repeats, across and down. Considers weave and
   * colour together over one full cycle of every order involved.
   */
  function repeat(s) {
    const thread = orders[s.threading],
      tread = orders[s.treadling],
      warp = colourOrders[s.warpColours],
      weft = colourOrders[s.weftColours];
    const columns = lcm(thread.length, warp.length),
      rows = lcm(tread.length, weft.length);
    const colours = cloth(s, rows, columns);
    const rowKey = (row) => row.join('');
    const across = lcmAll(colours.map((row) => period(row)));
    const down = period(colours.map(rowKey));
    return { across, down };
  }

  const lcmAll = (values) => values.reduce(lcm, 1);

  /** Visible colour of each crossing (1 dark, 0 light): the warp's where warp is up, else the weft's. */
  function cloth(s, rows, columns) {
    const up = drawdown(orders[s.threading], s.tieup, orders[s.treadling], rows, columns);
    return up.map((row, i) =>
      row.map((warpUp, j) => (warpUp ? at(colourOrders[s.warpColours], j) : at(colourOrders[s.weftColours], i))),
    );
  }

  /**
   * The longest float: how many crossings a single thread passes over without
   * interlacing. Returns Infinity when some thread never interlaces at all, so
   * the cloth would fall apart.
   */
  function longestFloat(s) {
    const thread = orders[s.threading],
      tread = orders[s.treadling];
    const rows = tread.length,
      columns = thread.length;
    const up = drawdown(thread, s.tieup, tread, rows, columns);
    const run = (cycle) => {
      if (cycle.every((x) => x === cycle[0])) return Infinity;
      let best = 0;
      for (let start = 0; start < cycle.length; start++) {
        let length = 1;
        while (length < cycle.length && cycle[(start + length) % cycle.length] === cycle[start]) length++;
        best = Math.max(best, length);
      }
      return best;
    };
    const weft = Math.max(...up.map(run)); // along a pick
    const warp = Math.max(...Array.from({ length: columns }, (_, j) => run(up.map((row) => row[j]))));
    return Math.max(weft, warp);
  }

  Wonderlattice.models.loom = Object.freeze({
    SHAFTS,
    orders,
    colourOrders,
    tieups,
    lifts,
    tieupFrom,
    drawdown,
    cloth,
    repeat,
    longestFloat,
    period,
  });
})();
