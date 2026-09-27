/*
 * A heartbeat travels · waves in an excitable medium (Barkley's model).
 * Each cell has an activation u in [0, 1] and a recovery v:
 *   ∂u/∂t = ∇²u + u(1 − u)(u − (v + b)/a)/ε      ∂v/∂t = k(u − v)
 * A resting cell fires when its neighbours do; a firing cell then needs time to recover (v falls back) before
 * it can fire again. Waves spread, meet and cancel; a wave with a free end curls into a spiral.
 * D. Barkley, "A model for fast computer simulation of waves in excitable media", Physica D 49 (1991).
 * Pure functions on plain objects, no DOM.
 */
(() => {
  'use strict';

  const A = 0.75,
    B = 0.02,
    EPS = 0.02;
  const H = 0.45; // cell size, in the model's length units: a 100-cell sheet is about four spiral arms wide
  const DT = 0.025; // time step, in the model's time units (explicit Euler is stable below H²/4 ≈ 0.05)
  const FIRING = 0.5; // a cell counts as firing above this activation

  /** An empty sheet of nx × ny resting cells. */
  function create(nx, ny) {
    const n = nx * ny;
    return { nx, ny, u: new Float32Array(n), v: new Float32Array(n), next: new Float32Array(n) };
  }

  /** Advance the sheet by `steps` time steps with recovery rate k, in place. Edges reflect (no flow out). */
  function step(field, k, steps = 1) {
    const { nx, ny } = field;
    const h2 = 1 / (H * H);
    for (let s = 0; s < steps; s++) {
      const { u, v, next } = field;
      for (let y = 0; y < ny; y++) {
        const up = (y ? y - 1 : 1) * nx,
          down = (y < ny - 1 ? y + 1 : ny - 2) * nx,
          row = y * nx;
        for (let x = 0; x < nx; x++) {
          const i = row + x,
            ui = u[i];
          const left = x ? x - 1 : 1,
            right = x < nx - 1 ? x + 1 : nx - 2;
          const lap = (u[row + left] + u[row + right] + u[up + x] + u[down + x] - 4 * ui) * h2;
          const threshold = (v[i] + B) / A;
          const un = ui + DT * (lap + (ui * (1 - ui) * (ui - threshold)) / EPS);
          next[i] = un < 0 ? 0 : un > 1 ? 1 : un;
          v[i] += DT * k * (ui - v[i]);
        }
      }
      field.next = field.u;
      field.u = next;
    }
    return field;
  }

  /** Fire a disc of cells centred at (fx, fy), given as fractions of the sheet, radius in cells. */
  function stimulate(field, fx, fy, radius = 4) {
    const { nx, ny, u } = field;
    const cx = fx * (nx - 1),
      cy = fy * (ny - 1);
    const r = Math.ceil(radius);
    for (let y = Math.max(0, Math.floor(cy - r)); y <= Math.min(ny - 1, Math.ceil(cy + r)); y++)
      for (let x = Math.max(0, Math.floor(cx - r)); x <= Math.min(nx - 1, Math.ceil(cx + r)); x++)
        if ((x - cx) ** 2 + (y - cy) ** 2 <= radius * radius) u[y * nx + x] = 1;
    return field;
  }

  /** Reset cells to rest along the segment (fx0, fy0)–(fx1, fy1): a finger wiping the sheet. */
  function wipe(field, fx0, fy0, fx1, fy1, radius = 3) {
    const { nx, ny, u, v } = field;
    const x0 = fx0 * (nx - 1),
      y0 = fy0 * (ny - 1),
      x1 = fx1 * (nx - 1),
      y1 = fy1 * (ny - 1);
    const len = Math.hypot(x1 - x0, y1 - y0);
    const r = Math.ceil(radius);
    for (
      let y = Math.max(0, Math.floor(Math.min(y0, y1) - r));
      y <= Math.min(ny - 1, Math.ceil(Math.max(y0, y1) + r));
      y++
    )
      for (
        let x = Math.max(0, Math.floor(Math.min(x0, x1) - r));
        x <= Math.min(nx - 1, Math.ceil(Math.max(x0, x1) + r));
        x++
      ) {
        // Distance from the cell to the segment.
        const t = len ? Math.max(0, Math.min(1, ((x - x0) * (x1 - x0) + (y - y0) * (y1 - y0)) / (len * len))) : 0;
        if ((x - x0 - t * (x1 - x0)) ** 2 + (y - y0 - t * (y1 - y0)) ** 2 <= radius * radius) {
          u[y * nx + x] = 0;
          v[y * nx + x] = 0;
        }
      }
    return field;
  }

  /** Reset every cell above the sheet's middle line to rest: the cut that turns a ring into two spirals. */
  function cutTop(field) {
    const { nx, ny, u, v } = field;
    const end = Math.floor(ny / 2) * nx;
    u.fill(0, 0, end);
    v.fill(0, 0, end);
    return field;
  }

  /** How many cells are firing. */
  function firing(field) {
    let n = 0;
    for (const x of field.u) if (x > FIRING) n++;
    return n;
  }

  /**
   * How many spiral tips the sheet has. A tip is where a wave's front (activation rising) meets its back (activation
   * falling) on the edge of the firing zone, u = ½; a closed ring has its front and back apart, so it has none.
   * The change since the previous step is read from `next`, which holds the previous activation after a step.
   * Separate clusters of such cells are counted.
   */
  function tips(field) {
    const { nx, ny, u, next: previous } = field;
    const marked = new Uint8Array(nx * ny);
    for (let y = 0; y < ny - 1; y++)
      for (let x = 0; x < nx - 1; x++) {
        const i = y * nx + x;
        let above = 0,
          rising = 0,
          falling = 0;
        for (const j of [i, i + 1, i + nx, i + nx + 1]) {
          if (u[j] > FIRING) above++;
          const change = u[j] - previous[j];
          if (change > 1e-4) rising++;
          else if (change < -1e-4) falling++;
        }
        if (above > 0 && above < 4 && rising > 0 && falling > 0) marked[i] = 1;
      }
    // Count clusters of marked cells (neighbours within two cells belong together).
    let clusters = 0;
    const stack = [];
    for (let i = 0; i < marked.length; i++) {
      if (marked[i] !== 1) continue;
      clusters++;
      marked[i] = 2;
      stack.push(i);
      while (stack.length) {
        const j = stack.pop(),
          jx = j % nx,
          jy = (j - jx) / nx;
        for (let dy = -2; dy <= 2; dy++)
          for (let dx = -2; dx <= 2; dx++) {
            const x = jx + dx,
              y = jy + dy;
            if (x < 0 || y < 0 || x >= nx || y >= ny) continue;
            const m = y * nx + x;
            if (marked[m] === 1) {
              marked[m] = 2;
              stack.push(m);
            }
          }
      }
    }
    return clusters;
  }

  /** The same pattern on a sheet of a different size (nearest cell), so resizing the window keeps the waves. */
  function resize(field, nx, ny) {
    const out = create(nx, ny);
    for (let y = 0; y < ny; y++)
      for (let x = 0; x < nx; x++) {
        const src =
          Math.min(field.ny - 1, Math.round((y * (field.ny - 1)) / Math.max(1, ny - 1))) * field.nx +
          Math.min(field.nx - 1, Math.round((x * (field.nx - 1)) / Math.max(1, nx - 1)));
        out.u[y * nx + x] = field.u[src];
        out.v[y * nx + x] = field.v[src];
        out.next[y * nx + x] = field.next[src]; // the previous step too, so spiral tips can still be found
      }
    return out;
  }

  Wonderlattice.models.heart = Object.freeze({
    A,
    B,
    EPS,
    H,
    DT,
    FIRING,
    create,
    step,
    stimulate,
    wipe,
    cutTop,
    firing,
    tips,
    resize,
  });
})();
