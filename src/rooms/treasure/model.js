/*
 * The imperfect treasure detector · Bayes' rule and the base rate.
 * A detector is right with the same chance over treasure and over sand. When treasure is rare, most
 * beeps are false alarms: P(treasure | beep) = a·r / (a·r + (1 − a)·(1 − r)).
 * Pure functions, no DOM.
 */
(() => {
  'use strict';

  /**
   * The chance a beep means treasure, for a share r of squares holding treasure and a detector that is right
   * with chance a. With a second, independent detector, only squares where both beep count.
   */
  function posterior(r, a, detectors = 1) {
    const hit = r * a ** detectors,
      falseAlarm = (1 - r) * (1 - a) ** detectors;
    return hit + falseAlarm === 0 ? 0 : hit / (hit + falseAlarm);
  }

  /** Natural frequencies: what happens to `total` squares, rounded to whole squares. */
  function perThousand(r, a, detectors = 1, total = 1000) {
    const treasure = Math.round(total * r);
    const found = Math.round(treasure * a ** detectors);
    const falseAlarms = Math.round((total - treasure) * (1 - a) ** detectors);
    return { total, treasure, found, missed: treasure - found, falseAlarms, quiet: total - treasure - falseAlarms };
  }

  /** A small repeatable random generator (mulberry32), so an island is the same for the same seed. */
  function random(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** Shuffles a copy of a list with a seeded generator. */
  function shuffled(list, rand) {
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  /**
   * An island of cols × rows squares: which are land, which hold treasure, and where the detector beeps.
   * The counts are the expected ones, rounded (as in perThousand), placed at random: so every island shows the
   * odds faithfully, while the spots themselves change with the seed.
   */
  function island({ cols, rows, r, a, detectors = 1, seed = 1 }) {
    const rand = random(seed * 7919 + 13);
    // A blob of land: a wobbly ellipse, so the island has a coastline.
    const wobble = Array.from({ length: 6 }, () => [rand() * 0.18, rand() * Math.PI * 2]);
    const land = [];
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++) {
        const dx = (x + 0.5) / cols - 0.5,
          dy = (y + 0.5) / rows - 0.5;
        const angle = Math.atan2(dy, dx);
        const edge = 0.37 + wobble.reduce((s, [amp, phase], k) => s + amp * 0.3 * Math.sin((k + 2) * angle + phase), 0);
        if (Math.hypot(dx, dy * 1.05) < edge) land.push(y * cols + x);
      }
    const counts = perThousand(r, a, detectors, land.length);
    const order = shuffled(land, rand);
    const treasure = new Set(order.slice(0, counts.treasure));
    const empty = order.slice(counts.treasure);
    const found = new Set(shuffled([...treasure], rand).slice(0, counts.found));
    const falseAlarms = new Set(shuffled(empty, rand).slice(0, counts.falseAlarms));
    const beeps = new Set([...found, ...falseAlarms]);
    return { cols, rows, land: new Set(land), treasure, beeps, counts };
  }

  Wonderlattice.models.treasure = Object.freeze({ posterior, perThousand, island, random });
})();
