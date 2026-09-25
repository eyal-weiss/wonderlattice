/*
 * Hear the shape · two sine waves and their sum. Pure functions, no DOM.
 * A(t) = sin(2πft), B(t) = sin(2πfrt + φ). The picture runs in slow motion:
 * it keeps the frequency ratio r and the phase φ, not the audible pitch.
 */
(() => {
  'use strict';

  const TAU = Math.PI * 2;

  /**
   * Height of wave `which` (0 = A, 1 = B, 2 = A + B) at horizontal position
   * x ∈ [0, 1], drifting with `clock` seconds.
   */
  function wavePoint(x, which, s, clock) {
    const t = x * 3 - clock * 0.4;
    const a = Math.sin(TAU * t),
      b = Math.sin(TAU * t * s.ratio + (s.phase * Math.PI) / 180);
    return which === 0 ? a : which === 1 ? b : a + b;
  }

  /** Beat rate in Hz: the difference between the two frequencies. */
  const beat = (s) => Math.abs(s.f - s.f * s.ratio);

  Wonderlattice.models.waves = Object.freeze({ wavePoint, beat });
})();
