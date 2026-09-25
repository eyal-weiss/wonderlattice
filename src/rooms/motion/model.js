/*
 * Paint with motion · the geometry of two turning arms. Pure functions, no DOM.
 * The pen is the sum of two circular motions:
 *   x = a cos(t) + b cos(kt + φ),  y = a sin(t) + b sin(kt + φ)
 */
(() => {
  'use strict';

  const TAU = Math.PI * 2;

  const palettes = [
    ['#93e5ca', '#8eb0ff', '#d49af1', '#93e5ca'],
    ['#ffe5a5', '#ff997c', '#e16fbd', '#ffe5a5'],
    ['#99ecff', '#798eff', '#d5ecff', '#99ecff'],
    ['#eee8d7', '#eee8d7', '#eee8d7', '#eee8d7'],
  ];
  const rgbPalettes = palettes.map((colors) =>
    colors.map((c) => [1, 3, 5].map((j) => parseInt(c.slice(j, j + 2), 16))),
  );

  function gcd(a, b) {
    while (b) {
      const c = a % b;
      a = b;
      b = c;
    }
    return a || 1;
  }

  /**
   * Outer-arm angle after which the pen is back where it started. Speeds are
   * hundredths, so k = n/100 closes after 100/gcd(n, 100) outer turns.
   */
  function period(s) {
    return (TAU * 100) / gcd(Math.abs(Math.round(s.k * 100)), 100);
  }

  /** Pen position at outer angle v, plus the elbow (ax, ay). Reach r is a percentage. */
  function position(v, s) {
    const b = s.r / 100,
      a = 1 - b,
      ph = (s.p * Math.PI) / 180;
    return {
      x: a * Math.cos(v) + b * Math.cos(s.k * v + ph),
      y: a * Math.sin(v) + b * Math.sin(s.k * v + ph),
      ax: a * Math.cos(v),
      ay: a * Math.sin(v),
    };
  }

  /** Ink colour along the path: a slow loop through the palette's gradient. */
  function color(v, palette) {
    const colors = rgbPalettes[palette];
    const z = (((((v / TAU) * 0.77) % 1) + 1) % 1) * 3;
    const i = Math.floor(z),
      f = z - i;
    const a = colors[i],
      b = colors[i + 1];
    return 'rgb(' + a.map((x, j) => Math.round(x + (b[j] - x) * f)).join(',') + ')';
  }

  Wonderlattice.models.motion = Object.freeze({ palettes, gcd, period, position, color });
})();
