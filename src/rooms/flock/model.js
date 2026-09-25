/*
 * A mind of many · a simplified Boids flock (Craig Reynolds). Pure functions, no DOM.
 * Positions live on a unit torus (edges wrap); velocities are unit vectors.
 * Every individual updates from the same previous state.
 */
(() => {
  'use strict';

  const TAU = Math.PI * 2;
  const SIGHT = 0.15; // neighbourhood radius, in canvas heights
  const CROWD = 0.05; // separation radius

  const wrap = (x) => ((x % 1) + 1) % 1;
  /** Shortest signed offset on the torus. */
  const delta = (x) => (x > 0.5 ? x - 1 : x < -0.5 ? x + 1 : x);

  function seed(count, random = Math.random) {
    return Array.from({ length: count }, () => {
      const a = random() * TAU;
      return { x: random(), y: random(), vx: Math.cos(a), vy: Math.sin(a) };
    });
  }

  /**
   * Advance the flock by dt seconds. `aspect` is canvas width / height, and
   * `point` an optional attractor/repeller in unit coordinates.
   * Returns the new birds and their direction agreement (0–1).
   */
  function step(birds, s, dt, aspect, point) {
    const next = [];
    let avx = 0,
      avy = 0;
    for (let i = 0; i < birds.length; i++) {
      const b = birds[i];
      let sx = 0,
        sy = 0,
        ax = 0,
        ay = 0,
        cx = 0,
        cy = 0,
        n = 0;
      for (let j = 0; j < birds.length; j++) {
        if (i === j) continue;
        const o = birds[j],
          dx = delta(o.x - b.x) * aspect,
          dy = delta(o.y - b.y),
          d2 = dx * dx + dy * dy;
        if (d2 < SIGHT * SIGHT) {
          n++;
          ax += o.vx;
          ay += o.vy;
          cx += dx;
          cy += dy;
          if (d2 < CROWD * CROWD && d2 > 1e-8) {
            sx -= dx / (d2 + 0.0003);
            sy -= dy / (d2 + 0.0003);
          }
        }
      }
      let fx = sx * 0.08 * s.separate,
        fy = sy * 0.08 * s.separate;
      if (n) {
        fx += (ax / n - b.vx) * s.align * 2.2 + (cx / n) * s.cohesion * 17;
        fy += (ay / n - b.vy) * s.align * 2.2 + (cy / n) * s.cohesion * 17;
      }
      if (point) {
        const dx = (point.x - b.x) * aspect,
          dy = point.y - b.y,
          d = Math.hypot(dx, dy);
        if (d < 0.65) {
          const sign = s.attract ? 1 : -1;
          fx += ((sign * dx) / (d + 0.07)) * 3.4;
          fy += ((sign * dy) / (d + 0.07)) * 3.4;
        }
      }
      const f = Math.hypot(fx, fy);
      if (f > 5) {
        fx *= 5 / f;
        fy *= 5 / f;
      }
      let vx = b.vx + fx * dt,
        vy = b.vy + fy * dt;
      const speed = Math.hypot(vx, vy) || 1;
      vx /= speed;
      vy /= speed;
      next.push({ x: wrap(b.x + (vx * 0.105 * dt) / aspect), y: wrap(b.y + vy * 0.105 * dt), vx, vy });
      avx += vx;
      avy += vy;
    }
    return { birds: next, order: Math.hypot(avx, avy) / birds.length };
  }

  Wonderlattice.models.flock = Object.freeze({ SIGHT, seed, step, wrap, delta });
})();
