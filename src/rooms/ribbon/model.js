/*
 * Where is the other side? · a ribbon with n half-twists. Pure functions, no DOM.
 *   x = (R + v cos(nu/2)) cos(u),  y = (R + v cos(nu/2)) sin(u),  z = v sin(nu/2)
 * Odd n gives a one-sided Möbius band; even n a two-sided band.
 */
(() => {
  'use strict';

  const RADIUS = 1.4;

  function surface(u, v, n) {
    return {
      x: (RADIUS + v * Math.cos((n * u) / 2)) * Math.cos(u),
      y: (RADIUS + v * Math.cos((n * u) / 2)) * Math.sin(u),
      z: v * Math.sin((n * u) / 2),
    };
  }

  /**
   * Rotate by (rx, ry) and project with mild perspective onto a canvas centred
   * at (cx, cy). Returns screen x, y and depth z (larger z is farther away).
   */
  function project(p, { rx, ry, cx, cy, scale }) {
    const c = Math.cos(ry),
      s = Math.sin(ry),
      x = p.x * c + p.z * s,
      z = -p.x * s + p.z * c,
      yy = p.y * Math.cos(rx) - z * Math.sin(rx),
      zz = p.y * Math.sin(rx) + z * Math.cos(rx),
      perspective = 5 / (5 + zz);
    return { x: cx + x * scale * perspective, y: cy + yy * scale * perspective, z: zz };
  }

  Wonderloom.models.ribbon = Object.freeze({ surface, project });
})();
