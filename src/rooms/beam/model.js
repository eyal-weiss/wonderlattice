/*
 * The ruler on its edge · how stiff a beam is, from the shape of its cross-section.
 *
 * The cross-section is a 12 × 12 grid of 1 cm squares, each painted with steel or left empty. It is kept as 12 row
 * masks (row 0 at the top; bit c is column c). Squares that share an edge are joined; squares that touch only at a
 * corner, or not at all, are separate pieces.
 *
 * A piece's bending stiffness is E·I, where I = ∫ y² dA is its second moment of area about its own neutral axis: the
 * horizontal line through its centroid, which is neither squeezed nor stretched. For a unit square whose centre is d
 * from that axis, ∫ y² dA = 1/12 + d² (the parallel axis theorem), so I is a sum over the squares, in cm⁴. Separate
 * pieces bend on their own, like a stack of loose planks, so the beam's I is the sum of theirs.
 *
 * The beam: 3 m of steel (E = 200 GPa), resting on a support at each end, with 100 kg hanging from its middle. Its sag
 * there is F·L³/(48·E·I) (Euler–Bernoulli beam theory, for small sags), and its shape is v(x) ∝ 3ξ − 4ξ³ with
 * ξ = x/L, up to the middle. The beam's own weight is left out, and it is assumed to be held from swinging sideways,
 * so only I about the horizontal axis matters. Pure functions on plain arrays, no DOM.
 */
(() => {
  'use strict';

  const SIZE = 12; // squares across and down
  const BUDGET = 24; // squares of steel the visitor has
  const FULL = 2 ** SIZE - 1;
  const KEYS = ['ra', 'rb', 'rc', 'rd', 're', 'rf', 'rg', 'rh', 'ri', 'rj', 'rk', 'rl']; // one setting per row
  const E = 200e9; // steel, in pascals
  const SPAN = 3; // metres between the supports
  const MASS = 100; // kilograms hanging from the middle
  const G = 9.81;
  const LIMIT = 100; // mm: past this sag (a thirtieth of the span) the simple theory is no longer trusted
  const WOBBLE = 20; // a shape this many times stiffer up and down than sideways is marked wobbly (a rule of thumb)
  const EPS = 1e-9;

  // ------------------------------------------------------------- the grid

  const empty = () => Array(SIZE).fill(0);
  const has = (rows, r, c) => ((rows[r] >> c) & 1) === 1;
  function set(rows, r, c, on) {
    const next = rows.slice();
    next[r] = on ? next[r] | (1 << c) : next[r] & ~(1 << c);
    return next;
  }
  const toggle = (rows, r, c) => set(rows, r, c, !has(rows, r, c));

  /** The painted squares, as [row, column] pairs, top to bottom and left to right. */
  function cells(rows) {
    const out = [];
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (has(rows, r, c)) out.push([r, c]);
    return out;
  }
  const count = (rows) => cells(rows).length;

  function rowsOf(list) {
    let rows = empty();
    for (const [r, c] of list) rows = set(rows, r, c, true);
    return rows;
  }

  /** The row masks a room's settings hold, made whole numbers in range. */
  const fromSettings = (s) => KEYS.map((k) => Math.max(0, Math.min(FULL, Math.round(Number(s[k]) || 0))));
  const toSettings = (rows) => Object.fromEntries(KEYS.map((k, r) => [k, rows[r]]));
  const same = (a, b) => a.every((v, r) => v === b[r]);

  /** The shape turned a quarter turn clockwise, about the grid's centre. */
  const rotate = (rows) => rowsOf(cells(rows).map(([r, c]) => [c, SIZE - 1 - r]));

  // --------------------------------------------------------------- shapes

  const block = (top, left, height, width) => {
    const list = [];
    for (let r = top; r < top + height; r++) for (let c = left; c < left + width; c++) list.push([r, c]);
    return rowsOf(list);
  };
  /** Seven squares across the top and the bottom, joined by a web of ten: the stiffest 24 squares can be here. */
  function iBeam() {
    const list = [];
    for (let c = 3; c < 10; c++) list.push([0, c], [SIZE - 1, c]);
    for (let r = 1; r < SIZE - 1; r++) list.push([r, 6]);
    return rowsOf(list);
  }
  const SHAPES = {
    plank: block(5, 0, 2, 12), // 12 cm wide, 2 cm thick, lying flat
    edge: block(0, 5, 12, 2), // the same plank on its edge
    ibeam: iBeam(),
  };

  /** The same squares moved to the top-left corner, to recognise a shape wherever it sits. */
  function normal(rows) {
    const list = cells(rows);
    if (!list.length) return '';
    const top = Math.min(...list.map(([r]) => r)),
      left = Math.min(...list.map(([, c]) => c));
    return list.map(([r, c]) => `${r - top},${c - left}`).join(' ');
  }
  /** 'plank', 'edge' or 'ibeam' when the shape is one of those (anywhere in the grid), otherwise null. */
  function nameOf(rows) {
    const n = normal(rows);
    for (const [name, shape] of Object.entries(SHAPES)) if (normal(shape) === n) return name;
    return null;
  }

  // ------------------------------------------------------------- the beam

  /** The pieces: groups of squares joined edge to edge (four-way), each as a list of [row, column]. */
  function pieces(rows) {
    const seen = new Set(),
      out = [];
    for (const [r0, c0] of cells(rows)) {
      if (seen.has(r0 * SIZE + c0)) continue;
      const piece = [],
        stack = [[r0, c0]];
      seen.add(r0 * SIZE + c0);
      while (stack.length) {
        const [r, c] = stack.pop();
        piece.push([r, c]);
        for (const [dr, dc] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const rr = r + dr,
            cc = c + dc;
          if (rr < 0 || cc < 0 || rr >= SIZE || cc >= SIZE || !has(rows, rr, cc) || seen.has(rr * SIZE + cc)) continue;
          seen.add(rr * SIZE + cc);
          stack.push([rr, cc]);
        }
      }
      piece.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      out.push(piece);
    }
    return out;
  }

  /**
   * A group of unit squares' area (cm²), centroid (x across, y down, in cm from the grid's top-left corner) and second
   * moments of area about its own centroid: ixx about the horizontal axis (bending up and down), iyy about the
   * vertical one (bending sideways), in cm⁴.
   */
  function moments(list) {
    const area = list.length;
    if (!area) return { area: 0, cx: 0, cy: 0, ixx: 0, iyy: 0 };
    const cx = list.reduce((a, [, c]) => a + c + 0.5, 0) / area;
    const cy = list.reduce((a, [r]) => a + r + 0.5, 0) / area;
    let ixx = 0,
      iyy = 0;
    for (const [r, c] of list) {
      ixx += 1 / 12 + (r + 0.5 - cy) ** 2;
      iyy += 1 / 12 + (c + 0.5 - cx) ** 2;
    }
    return { area, cx, cy, ixx, iyy };
  }

  /** The sag in the middle, in mm, of the beam whose cross-section has second moment ixx (cm⁴). */
  const sag = (ixx) => (ixx > 0 ? ((MASS * G * SPAN ** 3) / (48 * E * ixx * 1e-8)) * 1000 : Infinity);
  /** The bent beam's shape: the sag at a fraction xi of the span, as a fraction of the sag in the middle. */
  function curve(xi) {
    const x = xi <= 0.5 ? xi : 1 - xi;
    return x <= 0 ? 0 : 3 * x - 4 * x ** 3;
  }

  const PLANK = moments(cells(SHAPES.plank)).ixx; // 8 cm⁴
  const BEST = moments(cells(SHAPES.ibeam)).ixx; // 508 cm⁴

  /** Everything the room shows about a cross-section. */
  function analyse(rows) {
    const parts = pieces(rows).map((list) => {
      const m = moments(list);
      const rs = list.map(([r]) => r),
        cs = list.map(([, c]) => c);
      return {
        cells: list,
        ...m,
        top: Math.min(...rs),
        bottom: Math.max(...rs) + 1,
        left: Math.min(...cs),
        right: Math.max(...cs) + 1,
      };
    });
    const ixx = parts.reduce((a, p) => a + p.ixx, 0),
      iyy = parts.reduce((a, p) => a + p.iyy, 0);
    const n = parts.reduce((a, p) => a + p.area, 0);
    const mm = sag(ixx);
    return {
      count: n,
      left: BUDGET - n,
      pieces: parts,
      ixx,
      iyy,
      sag: mm,
      beyond: mm > LIMIT,
      times: ixx / PLANK, // how many times as stiff as the flat plank
      wobbly: n > 0 && ixx > WOBBLE * iyy,
      best: n > 0 && ixx >= BEST - EPS,
      name: nameOf(rows),
    };
  }

  /**
   * How to move one shape's squares to another's: squares in both stay; the rest pair up nearest first. Returns moves
   * as { from: [r, c], to: [r, c] }, with from or to null for a square that appears or goes.
   */
  function glide(a, b) {
    const from = cells(a).filter(([r, c]) => !has(b, r, c)),
      to = cells(b).filter(([r, c]) => !has(a, r, c));
    const moves = cells(a)
      .filter(([r, c]) => has(b, r, c))
      .map((p) => ({ from: p, to: p }));
    const pairs = [];
    from.forEach((p, i) => to.forEach((q, j) => pairs.push([Math.hypot(p[0] - q[0], p[1] - q[1]), i, j])));
    pairs.sort((x, y) => x[0] - y[0] || x[1] - y[1] || x[2] - y[2]);
    const usedFrom = new Set(),
      usedTo = new Set();
    for (const [, i, j] of pairs) {
      if (usedFrom.has(i) || usedTo.has(j)) continue;
      usedFrom.add(i);
      usedTo.add(j);
      moves.push({ from: from[i], to: to[j] });
    }
    from.forEach((p, i) => usedFrom.has(i) || moves.push({ from: p, to: null }));
    to.forEach((q, j) => usedTo.has(j) || moves.push({ from: null, to: q }));
    return moves;
  }

  Wonderlattice.models.beam = Object.freeze({
    SIZE,
    BUDGET,
    KEYS,
    E,
    SPAN,
    MASS,
    LIMIT,
    WOBBLE,
    PLANK,
    BEST,
    SHAPES,
    empty,
    has,
    set,
    toggle,
    cells,
    count,
    rowsOf,
    fromSettings,
    toSettings,
    same,
    rotate,
    nameOf,
    pieces,
    moments,
    sag,
    curve,
    analyse,
    glide,
  });
})();
