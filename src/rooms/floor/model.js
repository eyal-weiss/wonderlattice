/*
 * The impossible floor · dominoes on a board with squares removed.
 * A domino always covers one light and one dark square, so a board with unequal numbers of light and dark squares
 * can't be covered: the mutilated chessboard. Equal numbers are necessary but not enough; whether a board can be
 * covered is a perfect matching between its light and dark squares, found here by augmenting paths.
 * https://en.wikipedia.org/wiki/Mutilated_chessboard_problem · https://en.wikipedia.org/wiki/Domino_tiling
 * Pure functions, no DOM. Squares are numbered row by row: index = row · width + column.
 */
(() => {
  'use strict';

  const SIDE = 8;

  /** 0 for a light square, 1 for a dark one (the top-left corner is light, as on a chessboard). */
  const colour = (i, width = SIDE) => (Math.floor(i / width) + (i % width)) % 2;

  /** The squares next to i (up, down, left, right), inside a width × height board. */
  function neighbours(i, width = SIDE, height = SIDE) {
    const r = Math.floor(i / width),
      c = i % width;
    const out = [];
    if (r > 0) out.push(i - width);
    if (r < height - 1) out.push(i + width);
    if (c > 0) out.push(i - 1);
    if (c < width - 1) out.push(i + 1);
    return out;
  }

  /** How many light and dark squares are left, given a set of removed squares. */
  function counts(holes, width = SIDE, height = SIDE) {
    const n = { light: 0, dark: 0 };
    for (let i = 0; i < width * height; i++) if (!holes.has(i)) n[colour(i, width) ? 'dark' : 'light']++;
    return n;
  }

  /**
   * A way to cover every square that is not removed (and not in `taken`) with dominoes, or null if there is none.
   * Dominoes are pairs [a, b] of neighbouring squares. Kuhn's augmenting-path matching: fast for boards this size.
   */
  function tiling(holes, width = SIDE, height = SIDE, taken = new Set()) {
    const free = (i) => !holes.has(i) && !taken.has(i);
    const light = [];
    let dark = 0;
    for (let i = 0; i < width * height; i++) {
      if (!free(i)) continue;
      if (colour(i, width)) dark++;
      else light.push(i);
    }
    if (light.length !== dark) return null;
    const partner = new Map(); // dark square → the light square it is paired with
    const augment = (l, seen) => {
      for (const d of neighbours(l, width, height)) {
        if (!free(d) || seen.has(d)) continue;
        seen.add(d);
        if (!partner.has(d) || augment(partner.get(d), seen)) {
          partner.set(d, l);
          return true;
        }
      }
      return false;
    };
    for (const l of light) if (!augment(l, new Set())) return null;
    return [...partner].map(([d, l]) => (l < d ? [l, d] : [d, l])).sort((a, b) => a[0] - b[0]);
  }

  /**
   * Why a board with equal colours still can't be covered: a connected patch of free squares whose light and dark
   * squares don't balance (the smallest such patch), or null if every patch balances.
   */
  function stuckPatch(holes, width = SIDE, height = SIDE) {
    const seen = new Set();
    let best = null;
    for (let start = 0; start < width * height; start++) {
      if (holes.has(start) || seen.has(start)) continue;
      const patch = [];
      const queue = [start];
      seen.add(start);
      while (queue.length) {
        const i = queue.pop();
        patch.push(i);
        for (const j of neighbours(i, width, height))
          if (!holes.has(j) && !seen.has(j)) {
            seen.add(j);
            queue.push(j);
          }
      }
      const dark = patch.filter((i) => colour(i, width)).length;
      if (dark * 2 !== patch.length && (!best || patch.length < best.length)) best = patch.sort((a, b) => a - b);
    }
    return best;
  }

  /** A board of removed squares as two whole numbers (squares 0–31 and 32–63), for shared links and the trail. */
  function toMasks(holes) {
    let a = 0,
      b = 0;
    for (const i of holes) {
      if (i < 32) a += 2 ** i;
      else if (i < 64) b += 2 ** (i - 32);
    }
    return [a, b];
  }

  function fromMasks(a, b) {
    const holes = new Set();
    for (let i = 0; i < 32; i++) {
      if (Math.floor(a / 2 ** i) % 2) holes.add(i);
      if (Math.floor(b / 2 ** i) % 2) holes.add(i + 32);
    }
    return holes;
  }

  Wonderlattice.models.floor = Object.freeze({
    SIDE,
    colour,
    neighbours,
    counts,
    tiling,
    stuckPatch,
    toMasks,
    fromMasks,
  });
})();
