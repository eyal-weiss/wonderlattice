/*
 * The tempting shortcut · Braess's paradox on the classic four-node network
 * from Easley & Kleinberg, chapter 8:
 * https://www.cs.cornell.edu/home/kleinber/networks-book/networks-book-ch08.pdf
 * Pure functions, no DOM.
 */
(() => {
  'use strict';

  /**
   * Wardrop equilibrium for `demand` drivers from S to T. Edges S→A and B→T
   * cost x/100 minutes for x drivers; A→T and S→B cost 45 minutes; the
   * directed A→B shortcut costs zero. Every used route is equally fast and no
   * unused route is faster. Flows may be fractional.
   */
  function equilibrium(demand, shortcut) {
    if (!Number.isFinite(demand) || demand < 0) throw new RangeError('Demand must be nonnegative');
    const baseline = 45 + demand / 200;
    if (!shortcut) {
      return { upper: demand / 2, lower: demand / 2, middle: 0, time: baseline, baseline };
    }
    const outer = Math.max(0, Math.min(demand / 2, demand - 4500));
    const middle = demand - 2 * outer;
    const time = middle > 0 ? (2 * (demand - outer)) / 100 : baseline;
    return { upper: outer, lower: outer, middle, time, baseline };
  }

  Wonderloom.models.traffic = Object.freeze({ equilibrium });
})();
