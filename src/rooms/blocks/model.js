/*
 * The leaning tower of blocks · maximum-overhang block stacking.
 *
 * For a single-file stack of n identical blocks (length 1, uniform mass), the
 * optimal overhang is ½ · H(n) where H(n) = 1 + 1/2 + 1/3 + … + 1/n is the
 * nth partial sum of the harmonic series.  The top block overhangs by ½,
 * the next by ¼, the next by ⅙, and so on.
 *
 * Stability is checked at every supporting interface: the combined centre of
 * mass of all blocks above interface k must lie within the supporting edge
 * (the right edge of block k, at x = right_k).  Equality means teetering on
 * the verge of toppling.
 *
 * The table is treated as an infinitely heavy block whose right edge is at
 * x = 0.  All positions are offsets from that edge; positive values lean out.
 *
 * References:
 *   Block-stacking problem: https://en.wikipedia.org/wiki/Block-stacking_problem
 *   Harmonic series: https://en.wikipedia.org/wiki/Harmonic_series_(mathematics)
 *   M. Paterson and U. Zwick, "Overhang", Amer. Math. Monthly 116 (2009) 19-44
 *     https://arxiv.org/abs/0710.2357
 *   M. Paterson, Y. Peres, M. Thorup, P. Winkler and U. Zwick,
 *     "Maximum overhang": https://arxiv.org/abs/0707.0093
 *
 * Pure functions, no DOM.
 */
(() => {
  'use strict';

  const BLOCK_LENGTH = 1; // normalised to 1

  /**
   * The nth partial harmonic number H(n) = 1 + 1/2 + … + 1/n.
   * H(0) = 0 by convention (no blocks, no overhang).
   */
  function harmonicNumber(n) {
    if (n < 0 || !Number.isInteger(n)) throw new RangeError('n must be a nonneg integer');
    let h = 0;
    for (let k = 1; k <= n; k++) h += 1 / k;
    return h;
  }

  /**
   * The maximum single-file overhang for n blocks: ½ · H(n).
   * With 0 blocks the overhang is 0.
   */
  function maxOverhang(n) {
    return 0.5 * harmonicNumber(n);
  }

  /**
   * The optimal single-file stack as an array of block centres, bottom to top.
   *
   * Working from the top down: the top block can lean 1/2 beyond block 2's right
   * edge; the combined CoM of blocks 1–2 can lean 1/4 beyond block 3's right
   * edge; and so on.  The offset of block k (1 = top) relative to block k+1 is
   * 1/(2k), so the total overhang after n blocks is ½·H(n).
   *
   * We lay this out from bottom to top with the table right edge at x = 0:
   *   - Bottom block (k=n): its CoM must be exactly at the table edge (x = 0) for
   *     maximum lean; its CENTRE = 0, RIGHT EDGE = 0.5 — but all blocks above push
   *     the bottom block RIGHT.  After accounting for all the blocks above, the
   *     bottom block's right edge ends up at x = H(n)/2 - (offset to next) = …
   *
   * Cleanest formulation: define cumulative overhang from the top.
   *   overhang of block k from the top (relative to block below it) = 1/(2k)
   *   total rightward shift of block j from the bottom, relative to table:
   *     right_j = sum_{k=1}^{n-j+1} 1/(2k) but only of the k blocks above interface j.
   *   Actually: right-edge of block j from the bottom = sum_{k=1}^{n-j} 1/(2k)
   *             = H(n-j) / 2.
   *   So: centre_j = H(n-j)/2 - 0.5  for blocks numbered from the bottom (j=1..n).
   *   For the top block (j=n): centre = H(0)/2 - 0.5 = -0.5, right edge = 0.
   *   That would put the top block at x = -0.5 (table edge), with zero overhang.
   *
   * The issue is the table: the table right-edge is the constraint for the BOTTOM
   * block's centre-of-mass (all n blocks combined).  The combined CoM of all n
   * blocks must sit at the table right-edge (x = 0).
   *
   * Standard result (see Wikipedia / Paterson & Zwick):
   *   Right-edge of block j (from BOTTOM) = H(n) / 2 - H(n-j) / 2
   *     = (H(n) - H(n-j)) / 2
   *   Centre of block j from bottom = right_edge - 0.5
   *                                  = (H(n) - H(n-j)) / 2 - 0.5
   *   For j = n (top block): centre = H(n)/2 - 0, right edge = H(n)/2 = maxOverhang.
   *   For j = 1 (bottom):    centre = (H(n) - H(n-1))/2 - 0.5 = 1/(2n) - 0.5.
   *
   * Returns an array of length n with x-coordinates of block centres,
   * index 0 = bottom block, index n-1 = top block.
   * The top block's right edge is at maxOverhang(n).
   */
  function optimalStack(n) {
    if (n <= 0) return [];
    const hn = harmonicNumber(n);
    const centres = [];
    for (let j = 1; j <= n; j++) {
      // j = block number from the bottom (1 = bottom, n = top)
      const rightEdge = (hn - harmonicNumber(n - j)) / 2;
      centres.push(rightEdge - 0.5);
    }
    return centres; // index 0 = bottom, index n−1 = top
  }

  /**
   * Check whether a given stack is stable.
   *
   * @param {number[]} centres  x-coordinates of block centres, index 0 = bottom.
   * @returns {boolean}  true if every interface is stable (no more than teetering).
   */
  function isStable(centres) {
    const n = centres.length;
    if (n === 0) return true;
    // At interface k (between block k and block k+1, 0-indexed from bottom),
    // the right support edge is at: centres[k] + 0.5 (right edge of block k).
    // The combined CoM of blocks k+1 … n-1 must be ≤ that edge.
    let weightedSum = 0;
    for (let i = n - 1; i >= 0; i--) {
      weightedSum += centres[i];
      const aboveCount = n - i;
      const combinedCom = weightedSum / aboveCount;
      const supportRightEdge = i > 0 ? centres[i - 1] + 0.5 : 0; // table edge is 0
      const supportLeftEdge = i > 0 ? centres[i - 1] - 0.5 : -Infinity; // table extends to the left
      if (combinedCom > supportRightEdge + 1e-9 || combinedCom < supportLeftEdge - 1e-9) return false;
    }
    return true;
  }

  /**
   * Given a stack, return the index of the lowest interface that is unstable
   * (combined CoM of blocks above exceeds the support edge), or -1 if stable.
   */
  function firstUnstableInterface(centres) {
    const n = centres.length;
    // sum from top downward
    let weightedSum = 0;
    for (let i = n - 1; i >= 0; i--) {
      weightedSum += centres[i];
      const aboveCount = n - i;
      const combinedCom = weightedSum / aboveCount;
      const supportRightEdge = i > 0 ? centres[i - 1] + 0.5 : 0;
      const supportLeftEdge = i > 0 ? centres[i - 1] - 0.5 : -Infinity;
      if (combinedCom > supportRightEdge + 1e-9 || combinedCom < supportLeftEdge - 1e-9) return i;
    }
    return -1;
  }

  /**
   * How many blocks are needed so that the overhang equals or exceeds `target`
   * (in units of block lengths).  Returns Infinity when target ≤ 0.
   *
   * The harmonic series diverges, so a solution always exists for any finite
   * target — the series just grows very slowly.
   */
  function blocksForOverhang(target) {
    if (target <= 0) return 0;
    let n = 0,
      h = 0;
    while (0.5 * h < target) {
      n++;
      h += 1 / n;
    }
    return n;
  }

  /**
   * The overhang of a stack expressed as the position of the top block's
   * right edge.  Works for any array of centres.
   */
  function stackOverhang(centres) {
    if (centres.length === 0) return 0;
    return centres[centres.length - 1] + 0.5;
  }

  Wonderlattice.models.blocks = Object.freeze({
    BLOCK_LENGTH,
    harmonicNumber,
    maxOverhang,
    optimalStack,
    isStable,
    firstUnstableInterface,
    blocksForOverhang,
    stackOverhang,
  });
})();
