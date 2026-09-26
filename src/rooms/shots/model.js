/*
 * Shot mix · Simpson's paradox on a basketball court
 * A player can outshoot another in every category, yet lose overall,
 * when the mix of easy vs. hard shots differs between them.
 * https://en.wikipedia.org/wiki/Simpson%27s_paradox
 * E. H. Simpson, "The interpretation of interaction in contingency tables", JRSS B 13 (1951).
 * Pure functions, no DOM.
 */
(() => {
  'use strict';

  /**
   * A player's fixed skill: the fraction of close-range and far-range
   * shots they make, regardless of how many of each they take.
   */
  function makesFor(attempts, rate) {
    return Math.round(attempts * rate);
  }

  /**
   * Given a player's skill (closeRate, farRate) and how many shots of
   * each type they take (closeAttempts, farAttempts), compute their
   * close, far, and overall (combined) shooting percentage.
   */
  function playerStats(closeRate, farRate, closeAttempts, farAttempts) {
    const closeMakes = makesFor(closeAttempts, closeRate);
    const farMakes = makesFor(farAttempts, farRate);
    const totalAttempts = closeAttempts + farAttempts;
    const totalMakes = closeMakes + farMakes;
    return {
      closeAttempts,
      farAttempts,
      closeMakes,
      farMakes,
      closePct: closeAttempts > 0 ? closeMakes / closeAttempts : 0,
      farPct: farAttempts > 0 ? farMakes / farAttempts : 0,
      overallPct: totalAttempts > 0 ? totalMakes / totalAttempts : 0,
    };
  }

  /**
   * Both players' stats side by side, given fixed skill rates and the
   * visitor-controlled shot counts for each player.
   */
  function compare(settings) {
    const a = playerStats(settings.aCloseRate, settings.aFarRate, settings.aCloseAttempts, settings.aFarAttempts);
    const b = playerStats(settings.bCloseRate, settings.bFarRate, settings.bCloseAttempts, settings.bFarAttempts);
    return { a, b };
  }

  Wonderlattice.models.shotMix = Object.freeze({ playerStats, compare });
})();
