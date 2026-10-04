/*
 * The stubborn triangle · rigidity and forces in a flat frame of bars and pins.
 * A frame is a list of joints (points) and bars (pairs of joints). A bar keeps its length, a pin lets bars turn.
 *
 * Rigidity: moving joint a by u_a and joint b by u_b keeps bar ab's length (to first order) when
 * (p_a − p_b)·(u_a − u_b) = 0. One row per bar gives the rigidity matrix, with two columns per joint. A free frame of
 * j joints is rigid when the matrix has rank 2j − 3 (only sliding and turning the whole frame are left), so it needs
 * at least 2j − 3 bars (J. C. Maxwell, 1864). With joints in general position, the rank depends only on which joints
 * the bars join: 2j − 3 bars make a rigid frame exactly when every k of its joints are joined by at most 2k − 3 bars
 * (H. Pollaczek-Geiringer, 1927; G. Laman, 1970). Special positions, such as three joints in a line, can lose rank.
 *
 * Forces: the stiffness method, with every bar the same springy steel (stiffness EA = 1, so a bar of length L acts
 * as a spring of stiffness 1/L). For a frame with exactly the bars it needs, this gives the same forces as balancing
 * every joint by hand (the method of joints), whatever the bars are made of. With spare bars, it gives how bars of
 * equal steel share the load. Loads act only at joints; the bars weigh nothing.
 *
 * The bridge: n square panels, with joints in two rows (bottom i at (i, 0), top i at (i, 1), y up). The road rests on
 * the top joints. A pin holds the bottom-left joint and a roller the bottom-right one (it can slide sideways).
 * Pure functions on plain arrays, no DOM.
 */
(() => {
  'use strict';

  const TOLERANCE = 1e-9; // below this, a row is a combination of the rows before it
  const QUIET = 1e-6; // a bar carrying less than this (in truck weights) carries nothing
  const MIN_PANELS = 2;
  const MAX_PANELS = 6; // 5 × 6 + 1 = 31 bar places, so a frame fits in one whole number below 2³¹

  // ------------------------------------------------------------ the bridge

  /** Joint numbers: the bottom row first, then the top row. */
  const bottom = (n, i) => i;
  const top = (n, i) => n + 1 + i;

  /** The joints of an n-panel bridge, in panel widths, y up. */
  function joints(n) {
    const points = [];
    for (let i = 0; i <= n; i++) points.push([i, 0]);
    for (let i = 0; i <= n; i++) points.push([i, 1]);
    return points;
  }

  /**
   * Every place a bar can go, in a fixed order (its bit in a frame's number): the bottom chord, the top chord, the
   * posts, then the diagonals that rise to the right ("/") and those that fall to the right ("\").
   */
  function places(n) {
    const list = [];
    for (let k = 0; k < n; k++) list.push({ a: bottom(n, k), b: bottom(n, k + 1), kind: 'bottom', panel: k });
    for (let k = 0; k < n; k++) list.push({ a: top(n, k), b: top(n, k + 1), kind: 'top', panel: k });
    for (let k = 0; k <= n; k++) list.push({ a: bottom(n, k), b: top(n, k), kind: 'post', panel: k });
    for (let k = 0; k < n; k++) list.push({ a: bottom(n, k), b: top(n, k + 1), kind: 'rise', panel: k });
    for (let k = 0; k < n; k++) list.push({ a: top(n, k), b: bottom(n, k + 1), kind: 'fall', panel: k });
    return list;
  }

  const rise = (n, k) => 3 * n + 1 + k;
  const fall = (n, k) => 4 * n + 1 + k;
  const bit = (i) => 2 ** i;
  const has = (mask, i) => Math.floor(mask / bit(i)) % 2 === 1;
  const maskOf = (list) => list.reduce((m, i) => m + bit(i), 0);
  /** The places a frame's number switches on, in order. */
  const barsOf = (n, mask) => places(n).flatMap((place, i) => (has(mask, i) ? [i] : []));
  /** The same frame with one place switched. */
  const toggle = (mask, i) => (has(mask, i) ? mask - bit(i) : mask + bit(i));

  /**
   * Named frames. `squares`: chords and posts only. `pratt`: a diagonal in every panel, falling towards the middle
   * (stretched under a load). `howe`: the mirror image (squeezed). `counted`: as many bars as Maxwell's count asks,
   * but two diagonals in the first panel and none in the second.
   */
  function pattern(n, name) {
    const frame = [];
    for (let i = 0; i <= 3 * n; i++) frame.push(i);
    const diagonals = [];
    for (let k = 0; k < n; k++) {
      const left = k < n / 2;
      if (name === 'pratt') diagonals.push(left ? fall(n, k) : rise(n, k));
      if (name === 'howe') diagonals.push(left ? rise(n, k) : fall(n, k));
      if (name === 'counted' && k !== 1) diagonals.push(left ? fall(n, k) : rise(n, k));
    }
    if (name === 'counted') diagonals.push(rise(n, 0));
    return maskOf([...frame, ...diagonals]);
  }

  /** Which named frame this is, or ''. */
  function nameOf(n, mask) {
    for (const name of ['squares', 'pratt', 'howe', 'counted']) if (pattern(n, name) === mask) return name;
    return '';
  }

  /**
   * The same frame on a bridge of another length: chords and posts everywhere, and each panel's diagonals as before
   * (new panels get none). A named frame stays that frame.
   */
  function resize(n, mask, m) {
    const name = nameOf(n, mask);
    if (name) return pattern(m, name);
    const list = [];
    for (let i = 0; i <= 3 * m; i++) list.push(i);
    for (let k = 0; k < Math.min(n, m); k++) {
      if (has(mask, rise(n, k))) list.push(rise(m, k));
      if (has(mask, fall(n, k))) list.push(fall(m, k));
    }
    return maskOf(list);
  }

  /** The pin holds the bottom-left joint both ways; the roller holds the bottom-right one up and down. */
  const held = (n) => [2 * bottom(n, 0), 2 * bottom(n, 0) + 1, 2 * bottom(n, n) + 1];

  /** The truck's weight (1) handed to the two top joints either side of it, by the lever rule; none off the bridge. */
  function truckLoads(n, x) {
    const f = new Float64Array(4 * (n + 1));
    if (!(x >= 0 && x <= n)) return f;
    const k = Math.min(Math.floor(x), n - 1),
      along = x - k;
    f[2 * top(n, k) + 1] -= 1 - along;
    f[2 * top(n, k + 1) + 1] -= along;
    return f;
  }

  // ------------------------------------------------------------- rigidity

  const dot = (u, v) => u.reduce((sum, x, i) => sum + x * v[i], 0);

  /** One row of the rigidity matrix per bar, scaled to length 1. Bars are [a, b] pairs. */
  function rows(points, bars) {
    const width = 2 * points.length;
    return bars.map(([a, b]) => {
      const row = new Float64Array(width);
      const dx = points[a][0] - points[b][0],
        dy = points[a][1] - points[b][1];
      const s = Math.hypot(dx, dy) * Math.SQRT2 || 1;
      row[2 * a] = dx / s;
      row[2 * a + 1] = dy / s;
      row[2 * b] = -dx / s;
      row[2 * b + 1] = -dy / s;
      return row;
    });
  }

  /** A row with a 1 for each held direction (a joint's x or y). */
  function fixed(width, dofs) {
    return dofs.map((d) => {
      const row = new Float64Array(width);
      row[d] = 1;
      return row;
    });
  }

  /**
   * An orthonormal basis of the rows' span, taken in order (Gram–Schmidt, twice for accuracy), and which rows add
   * nothing to the rows before them.
   */
  function span(list) {
    const basis = [],
      dependent = [];
    list.forEach((row, i) => {
      const v = Float64Array.from(row);
      for (let pass = 0; pass < 2; pass++)
        for (const q of basis) {
          const d = dot(q, v);
          for (let k = 0; k < v.length; k++) v[k] -= d * q[k];
        }
      const size = Math.hypot(...v);
      if (size > TOLERANCE * Math.max(1, Math.hypot(...row))) basis.push(v.map((x) => x / size));
      else dependent.push(i);
    });
    return { basis, dependent, rank: basis.length };
  }

  /** The rank of a frame's rigidity matrix. */
  const rank = (points, bars) => span(rows(points, bars)).rank;

  /** Is a free frame rigid (only sliding and turning the whole frame left)? Every joint must be in it. */
  const rigid = (points, bars) => points.length < 2 || rank(points, bars) === 2 * points.length - 3;

  /** A small random number generator, so the "general position" is the same every time. */
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
   * The rank the same bars would have with the joints nudged into general position: the most they can ever give.
   * (Two random nudges; with real random numbers one is enough, the second guards against bad luck.)
   */
  function genericRank(points, bars) {
    let best = 0;
    for (const seed of [17, 1864]) {
      const random = rng(seed);
      const moved = points.map(([x, y]) => [x + (random() - 0.5) * 0.6, y + (random() - 0.5) * 0.6]);
      best = Math.max(best, rank(moved, bars));
    }
    return best;
  }

  /**
   * Everything the room says about an n-panel frame. `order` lists the bars' places in the order they were added
   * (by default, their own order); a bar that adds nothing to those before it is spare.
   *   verdict: 'rigid'; or why it's floppy: 'short' (too few bars), 'spread' (enough bars, but crowded in one part
   *   and too few in another), 'special' (enough, well spread, but the joints sit in a special position).
   */
  function analyse(n, mask, order = barsOf(n, mask)) {
    const points = joints(n),
      list = places(n);
    const present = order.filter((i) => has(mask, i));
    const bars = present.map((i) => [list[i].a, list[i].b]);
    const j = points.length,
      needed = 2 * j - 3;
    const own = span(rows(points, bars));
    const spare = own.dependent.map((k) => present[k]);
    const stands = span([...rows(points, bars), ...fixed(2 * j, held(n))]).rank === 2 * j;
    const generic = genericRank(points, bars);
    const degree = new Array(j).fill(0);
    for (const [a, b] of bars) (degree[a]++, degree[b]++);
    let verdict = 'rigid';
    if (!stands) verdict = bars.length < needed ? 'short' : generic < needed ? 'spread' : 'special';
    return {
      joints: j,
      needed,
      bars: bars.length,
      rank: own.rank,
      generic,
      spare,
      loose: degree.filter((d) => d < 2).length,
      verdict,
      rigid: stands,
    };
  }

  // ---------------------------------------------------------------- forces

  /**
   * Solve A x = b by Gaussian elimination with partial pivoting; null if A is singular (a floppy frame).
   * A is an array of rows and is overwritten.
   */
  function solve(A, b) {
    const n = b.length;
    const scale = Math.max(...A.map((row, i) => Math.abs(row[i])), 1e-300);
    for (let c = 0; c < n; c++) {
      let p = c;
      for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
      if (Math.abs(A[p][c]) < 1e-10 * scale) return null;
      [A[c], A[p]] = [A[p], A[c]];
      [b[c], b[p]] = [b[p], b[c]];
      for (let r = c + 1; r < n; r++) {
        const m = A[r][c] / A[c][c];
        if (!m) continue;
        for (let k = c; k < n; k++) A[r][k] -= m * A[c][k];
        b[r] -= m * b[c];
      }
    }
    const x = new Float64Array(n);
    for (let r = n - 1; r >= 0; r--) {
      let sum = b[r];
      for (let k = r + 1; k < n; k++) sum -= A[r][k] * x[k];
      x[r] = sum / A[r][r];
    }
    return x;
  }

  /**
   * The force in every bar (positive: stretched, negative: squeezed) and the supports' reactions, for loads given
   * as [fx, fy] per joint in one flat array, with the held directions `dofs`. Null for a floppy frame.
   */
  function forces(points, bars, dofs, loads) {
    const size = 2 * points.length;
    const K = Array.from({ length: size }, () => new Float64Array(size));
    const unit = bars.map(([a, b]) => {
      const dx = points[b][0] - points[a][0],
        dy = points[b][1] - points[a][1];
      const L = Math.hypot(dx, dy);
      return [dx / L, dy / L, L];
    });
    bars.forEach(([a, b], i) => {
      const [ex, ey, L] = unit[i];
      const e = [ex, ey];
      for (let r = 0; r < 2; r++)
        for (let c = 0; c < 2; c++) {
          const k = (e[r] * e[c]) / L;
          K[2 * a + r][2 * a + c] += k;
          K[2 * b + r][2 * b + c] += k;
          K[2 * a + r][2 * b + c] -= k;
          K[2 * b + r][2 * a + c] -= k;
        }
    });
    const free = [];
    for (let d = 0; d < size; d++) if (!dofs.includes(d)) free.push(d);
    const u = solve(
      free.map((r) => Float64Array.from(free, (c) => K[r][c])),
      Float64Array.from(free, (d) => loads[d]),
    );
    if (!u) return null;
    const move = new Float64Array(size);
    free.forEach((d, i) => (move[d] = u[i]));
    const tension = bars.map(([a, b], i) => {
      const [ex, ey, L] = unit[i];
      return (ex * (move[2 * b] - move[2 * a]) + ey * (move[2 * b + 1] - move[2 * a + 1])) / L;
    });
    // What the supports push back with: whatever the bars and loads leave unbalanced at the held joints.
    const reactions = dofs.map((d) => -loads[d] - pull(bars, unit, tension, d));
    return { tension, reactions };
  }

  /** The bars' total pull on one direction (x or y) of one joint. */
  function pull(bars, unit, tension, d) {
    const joint = d >> 1,
      axis = d & 1;
    let sum = 0;
    bars.forEach(([a, b], i) => {
      if (a === joint) sum += tension[i] * unit[i][axis];
      if (b === joint) sum -= tension[i] * unit[i][axis];
    });
    return sum;
  }

  // ------------------------------------------------------------ mechanisms

  /**
   * The way a floppy frame gives under a push: the part of the push (one [fx, fy] per joint, flat) that no bar or
   * support resists, scaled so the joint that moves most moves 1. Null for a rigid frame. When the push finds no way
   * to move, any way it can move is taken.
   */
  function mechanism(points, bars, dofs, push) {
    const size = 2 * points.length;
    const { basis } = span([...rows(points, bars), ...fixed(size, dofs)]);
    if (basis.length === size) return null;
    const free = (f) => {
      const v = Float64Array.from(f);
      for (let pass = 0; pass < 2; pass++)
        for (const q of basis) {
          const d = dot(q, v);
          for (let k = 0; k < size; k++) v[k] -= d * q[k];
        }
      return v;
    };
    let v = free(push);
    if (Math.hypot(...v) < 1e-6 * Math.max(1, Math.hypot(...push))) {
      for (let d = 0; d < size; d++) {
        const e = new Float64Array(size);
        e[d] = 1;
        const w = free(e);
        if (Math.hypot(...w) > Math.hypot(...v)) v = w;
      }
    }
    let most = 0;
    for (let j = 0; j < points.length; j++) most = Math.max(most, Math.hypot(v[2 * j], v[2 * j + 1]));
    return most > 1e-9 ? v.map((x) => x / most) : null;
  }

  /**
   * Pull the joints back until every bar has its own length again (position-based: each bar in turn moves its two
   * ends), keeping the held directions still. Changes `points` in place.
   */
  function settle(points, bars, lengths, dofs, rounds = 12) {
    const weight = (j, axis) => (dofs.includes(2 * j + axis) ? 0 : 1);
    for (let round = 0; round < rounds; round++)
      bars.forEach(([a, b], i) => {
        const dx = points[b][0] - points[a][0],
          dy = points[b][1] - points[a][1];
        const L = Math.hypot(dx, dy);
        if (L < 1e-12) return;
        const ex = dx / L,
          ey = dy / L;
        const wax = weight(a, 0),
          way = weight(a, 1),
          wbx = weight(b, 0),
          wby = weight(b, 1);
        const stiffness = ex * ex * (wax + wbx) + ey * ey * (way + wby);
        if (stiffness < 1e-12) return;
        const lambda = (L - lengths[i]) / stiffness;
        points[a][0] += lambda * wax * ex;
        points[a][1] += lambda * way * ey;
        points[b][0] -= lambda * wbx * ex;
        points[b][1] -= lambda * wby * ey;
      });
    return points;
  }

  /** The bars' lengths. */
  const lengths = (points, bars) =>
    bars.map(([a, b]) => Math.hypot(points[b][0] - points[a][0], points[b][1] - points[a][1]));

  /**
   * Let a floppy frame give: move its joints a distance along the way it can move, in small steps, each time
   * keeping on the way it was already going (at first, the way the push sends it), with every bar put right after
   * each step. A frame in motion keeps moving the same way, even where the push alone would stop it. Changes
   * `points` in place and returns the way it went last, to carry on from; null if it can't move at all.
   */
  function follow(points, bars, lengths, dofs, push, distance, steps = 1, going = null) {
    const size = Math.max(1e-12, Math.hypot(...push));
    for (let k = 0; k < steps; k++) {
      const want = going ? going.map((v, d) => v + (0.25 * push[d]) / size) : push;
      const way = mechanism(points, bars, dofs, want);
      if (!way) return null;
      points.forEach((p, j) => {
        p[0] += (distance / steps) * way[2 * j];
        p[1] += (distance / steps) * way[2 * j + 1];
      });
      settle(points, bars, lengths, dofs, 20);
      going = way;
    }
    return going;
  }

  Wonderlattice.models.truss = Object.freeze({
    QUIET,
    MIN_PANELS,
    MAX_PANELS,
    bottom,
    top,
    joints,
    places,
    rise,
    fall,
    has,
    maskOf,
    barsOf,
    toggle,
    pattern,
    nameOf,
    resize,
    held,
    truckLoads,
    rows,
    span,
    rank,
    rigid,
    genericRank,
    analyse,
    forces,
    mechanism,
    settle,
    lengths,
    follow,
  });
})();
