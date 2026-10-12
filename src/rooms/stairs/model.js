/*
 * The staircase of sound · Shepard tones. Pure functions, no DOM.
 *
 * A Shepard tone sounds eight sine waves (partials) an octave apart. How loud each one is comes from a fixed bell over
 * the logarithm of frequency: a raised cosine, loudest in the middle and silent at both ends. A pitch position `pos`
 * counts semitone steps; raising it by one multiplies every partial's frequency by 2^(1/12). After twelve steps every
 * frequency has doubled, the set of partials is the one it started with, and so is the sound.
 *
 * Partial j sits at height x = (j + pos/12) mod 8, in octaves above the lowest note. A partial only ever jumps (from
 * the top of the range back to the bottom) where the bell is silent, so the sound never clicks.
 */
(() => {
  'use strict';

  const OCTAVES = 8; // the partials span eight octaves …
  const LOWEST = 32.70319566257483; // … above C1, in hertz (with A above middle C at 440 Hz)
  const CENTRE = OCTAVES / 2; // the bell's peak: C5, about 523 Hz

  const mod = (a, n) => ((a % n) + n) % n;

  /**
   * Loudness, from 0 to 1, of a partial `x` octaves above the lowest note, under a bell `width` octaves wide centred
   * on the range: a raised cosine, 0 at both of its ends and 1 in the middle.
   */
  function loudness(x, width = OCTAVES) {
    const u = (x - CENTRE) / width + 0.5;
    if (u <= 0 || u >= 1) return 0;
    return 0.5 * (1 - Math.cos(2 * Math.PI * u));
  }

  /** The partials at pitch position `pos` (semitone steps; any real number), one per octave, in a fixed order. */
  function partials(pos, width = OCTAVES) {
    return Array.from({ length: OCTAVES }, (_, j) => {
      const x = mod(j + pos / 12, OCTAVES);
      return { x, frequency: LOWEST * 2 ** x, level: loudness(x, width) };
    });
  }

  /** The note of the twelve (0 = C, 1 = C♯ … 11 = B) at a pitch position, as a real number in [0, 12). */
  const chroma = (pos) => mod(pos, 12);

  /**
   * How much to divide the partials' levels by so the whole sound keeps about the same strength at every bell width:
   * under a bell a whole number of octaves wide (two or more), the levels always add up to half that width.
   */
  const strength = (width) => Math.max(1, width / 2);

  /** The partial that sounds loudest at a pitch position (its index), or -1 when all are silent. */
  function loudest(pos, width = OCTAVES) {
    let best = -1,
      level = 0;
    partials(pos, width).forEach((p, j) => {
      if (p.level > level) [best, level] = [j, p.level];
    });
    return best;
  }

  /**
   * The two notes of a pair for the tritone test: a note and the one half an octave (six steps) above it, which on
   * the circle of notes sits exactly opposite, so going up and going down are the same distance.
   */
  const tritone = (from) => [mod(from, 12), mod(from + 6, 12)];

  Wonderlattice.models.stairs = Object.freeze({
    OCTAVES,
    LOWEST,
    CENTRE,
    loudness,
    partials,
    chroma,
    strength,
    loudest,
    tritone,
  });
})();
