/*
 * Grow a fingerprint · a Turing activator–inhibitor system on a fingertip. Pure functions, no DOM.
 *
 * Two signals live on a grid of cells shaped like a fingertip. The activator
 * makes more of itself and of the inhibitor; the inhibitor suppresses the
 * activator and spreads about twice as fast. Their kinetics follow the cubic
 * form of the Barrio–Varea–Aragón–Maini (BVAM) model, whose odd symmetry
 * favours stripes over spots:
 *
 *   da/dt = s·D·∇²a + 0.899 a − h − 3.15 a h²
 *   dh/dt = s·∇²h   + 0.899 a − 0.91 h − 3.15 a h²
 *
 * where s scales both diffusion rates (the ridge spacing grows like √s).
 * The uniform state a = h = 0 is Turing-unstable but, left alone, it stays
 * exactly at zero. Ridges therefore appear only where a site pokes it, and
 * spread from there as a wave that lays down ridges parallel to its front,
 * as in Glover et al. (Cell, 2023). Where waves from different sites meet,
 * they leave the Y-shaped triradii that fingerprint examiners count.
 *
 * Cells outside the fingertip copy their nearest inside neighbour before
 * each step, so no signal flows through the edge (a no-flux boundary).
 */
(() => {
  'use strict';

  const WIDTH = 168; // grid cells across
  const HEIGHT = 232; // grid cells from tip to crease
  const DT = 0.3; // time step; stable up to s = 1, the spacing slider's limit (s = 1.2 blows up)
  const SPREAD = 0.45; // activator diffusion relative to the inhibitor's
  const GROW = 0.899, // activator self-activation, and its production of inhibitor
    DECAY = 0.91, // inhibitor removal
    SATURATE = 0.899 * 3.5; // cubic saturation
  const GROWN = 0.05; // |activator| above which a cell counts as patterned
  const AMP = 0.5; // how hard a site pokes the activator
  const PULSE = 60; // steps an edge site keeps poking
  const STEPS_PER_RIDGE = 72; // a wave lays one new ridge about this often (measured; nearly independent of s)
  const FULL = 0.97; // coverage that counts as the whole fingertip
  const SETTLE = 1500; // steps to keep smoothing once the fingertip is covered
  const MAX_STEPS = 9000; // give up on growth that never finishes (e.g. a lone corner seed)

  /** A small seedable generator (mulberry32), so a twin can be regrown exactly. */
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** Ridge period in cells for a diffusion scale s (from linear stability of the kinetics). */
  const wavelength = (s) => 9.51 * Math.sqrt(s);

  /**
   * The fingertip: a rounded dome over a gently narrowing pad, cut off by the
   * crease at the bottom. `halfWidth(y)` is in cells, for rows y.
   */
  const MARGIN = 3,
    TOP = MARGIN,
    BOTTOM = HEIGHT - 1 - MARGIN,
    CENTRE = (WIDTH - 1) / 2,
    HALF = WIDTH * 0.45,
    CAP = HALF * 1.22; // height of the dome

  function halfWidth(y) {
    if (y < TOP || y > BOTTOM) return -1;
    if (y < TOP + CAP) {
      const t = (TOP + CAP - y) / CAP;
      return HALF * Math.sqrt(Math.max(0, 1 - t * t));
    }
    const t = (y - TOP - CAP) / (BOTTOM - TOP - CAP);
    return HALF * (1 - 0.09 * t * t); // curving gently in towards the crease
  }

  /** The outline as points in unit coordinates (0–1 across the grid), clockwise from the crease's left end. */
  function outline(n = 64) {
    const points = [];
    const unit = (x, y) => ({ x: (x + 0.5) / WIDTH, y: (y + 0.5) / HEIGHT });
    const neck = TOP + CAP,
      bottom = BOTTOM + 0.5;
    // Up the left side, over the dome (evenly in angle, so it stays round), and down the right side.
    for (let i = 0; i < n; i++) {
      const y = bottom - ((bottom - neck) * i) / n;
      points.push(unit(CENTRE - halfWidth(Math.min(BOTTOM, y)) - 0.5, y));
    }
    for (let i = 0; i <= n; i++) {
      const angle = Math.PI - (Math.PI * i) / n;
      points.push(unit(CENTRE + (HALF + 0.5) * Math.cos(angle), neck - (CAP + 0.5) * Math.sin(angle)));
    }
    for (let i = n - 1; i >= 0; i--) {
      const y = bottom - ((bottom - neck) * i) / n;
      points.push(unit(CENTRE + halfWidth(Math.min(BOTTOM, y)) + 0.5, y));
    }
    return points;
  }

  /**
   * Build the grid once: the mask, each row's run of inside cells, the ghost
   * cells that mirror the edge, and the edge bands where the tip and crease
   * sites start ridges.
   */
  function createGrid() {
    const W = WIDTH,
      H = HEIGHT,
      mask = new Uint8Array(W * H);
    let count = 0;
    for (let y = 0; y < H; y++) {
      const half = halfWidth(y);
      for (let x = 0; x < W; x++)
        if (half >= 0 && Math.abs(x - CENTRE) <= half) {
          mask[y * W + x] = 1;
          count++;
        }
    }
    const rows = [];
    for (let y = 1; y < H - 1; y++) {
      let first = -1,
        last = -1;
      for (let x = 1; x < W - 1; x++)
        if (mask[y * W + x]) {
          if (first < 0) first = y * W + x;
          last = y * W + x;
        }
      if (first >= 0) rows.push(first, last);
    }
    // Each ghost copies one inside neighbour, preferring edge-sharing ones.
    const ghosts = [];
    const near = [-1, 1, -W, W, -W - 1, -W + 1, W - 1, W + 1];
    for (let c = W; c < W * (H - 1); c++) {
      if (mask[c] || c % W === 0 || c % W === W - 1) continue;
      const from = near.find((d) => mask[c + d]);
      if (from !== undefined) ghosts.push(c, c + from);
    }
    // Distance (in cells, capped) from each inside cell to the outside, for the edge bands and drawing.
    const edge = new Uint8Array(W * H).fill(255);
    const queue = [];
    for (let c = 0; c < W * H; c++)
      if (!mask[c]) {
        edge[c] = 0;
        queue.push(c);
      }
    for (let q = 0; q < queue.length; q++) {
      const c = queue[q],
        d = edge[c] + 1;
      if (d > 12) continue;
      for (const o of [-1, 1, -W, W]) {
        const n = c + o;
        if (n >= 0 && n < W * H && edge[n] > d) {
          edge[n] = d;
          queue.push(n);
        }
      }
    }
    return {
      W,
      H,
      mask,
      count,
      rows: Int32Array.from(rows),
      ghosts: Int32Array.from(ghosts),
      edge,
      top: TOP,
      bottom: BOTTOM,
      cap: CAP,
    };
  }

  /** Inside cells within an ellipse (radii in cells, angle in radians) centred at (x, y) in cells. */
  function ellipse(grid, x, y, rx, ry, angle = 0) {
    const cells = [],
      cos = Math.cos(angle),
      sin = Math.sin(angle),
      reach = Math.ceil(Math.max(rx, ry));
    for (let j = Math.floor(y) - reach; j <= Math.ceil(y) + reach; j++)
      for (let i = Math.floor(x) - reach; i <= Math.ceil(x) + reach; i++) {
        if (i < 0 || j < 0 || i >= grid.W || j >= grid.H || !grid.mask[j * grid.W + i]) continue;
        const dx = i - x,
          dy = j - y,
          px = dx * cos + dy * sin,
          py = -dx * sin + dy * cos;
        if ((px / rx) ** 2 + (py / ry) ** 2 <= 1) cells.push(j * grid.W + i);
      }
    return cells;
  }

  /** Inside cells within `width` cells of the edge whose row passes `keep(y)`. */
  function band(grid, keep, width = 2) {
    const cells = [];
    for (let c = 0; c < grid.W * grid.H; c++)
      if (grid.mask[c] && grid.edge[c] <= width && keep(Math.floor(c / grid.W))) cells.push(c);
    return cells;
  }

  /**
   * A starting site. `role` is pad, tip, crease, or yours; `x`, `y` mark it
   * in unit coordinates; `start` is the step it begins; `pulse` how many steps
   * it keeps poking. Each cell gets a slightly different strength from `random`,
   * which is where one twin differs from another.
   */
  function site(role, cells, x, y, start, pulse, random) {
    const amp = new Float32Array(cells.length);
    for (let i = 0; i < cells.length; i++) amp[i] = AMP * (0.75 + 0.5 * random());
    return { role, cells: Int32Array.from(cells), amp, x, y, start: Math.max(0, Math.round(start)), pulse };
  }

  const PATTERNS = ['whorl', 'loop', 'arch', 'own'];

  /**
   * The starting sites for a pattern: 0 whorl, 1 loop, 2 arch, 3 your own.
   * `headStart` is how many ridges the first wave lays before the others
   * begin. `seeds` are the visitor's own points ({ x, y } in unit coordinates
   * and `start` in steps). `twin` picks the tiny random differences.
   */
  function sitesFor(grid, pattern, headStart, seeds = [], twin = 0) {
    const random = rng(0x9e3779b9 ^ Math.imul(twin + 1, 2654435761));
    const jitter = (size) => (random() - 0.5) * 2 * size;
    const lead = headStart * STEPS_PER_RIDGE * (1 + jitter(0.06));
    const unitX = (x) => (x + 0.5) / grid.W,
      unitY = (y) => (y + 0.5) / grid.H;
    const sites = [];
    const pad = (x, y, rx, ry, angle, start) => {
      x += jitter(1.2);
      y += jitter(1.2);
      sites.push(site('pad', ellipse(grid, x, y, rx, ry, angle + jitter(0.04)), unitX(x), unitY(y), start, 1, random));
    };
    const tip = (reach, start) =>
      sites.push(
        site(
          'tip',
          band(grid, (y) => y < grid.top + grid.cap * reach),
          0.5,
          unitY(grid.top + 1),
          start,
          PULSE,
          random,
        ),
      );
    const crease = (start) =>
      sites.push(
        site(
          'crease',
          band(grid, (y) => y > grid.bottom - 3),
          0.5,
          unitY(grid.bottom),
          start,
          PULSE,
          random,
        ),
      );

    const name = PATTERNS[pattern] ?? 'own';
    if (name === 'whorl') {
      // The pad's centre starts first; its rings become the whorl's core.
      pad(CENTRE, grid.H * 0.45, 3, 3, 0, 0);
      tip(1, lead);
      crease(lead);
    } else if (name === 'loop') {
      // A long, tilted start that runs off one side: the rings around it become hairpins.
      pad(grid.W * 0.14, grid.H * 0.5, grid.W * 0.24, 2.5, -0.38, 0);
      tip(1, lead);
      crease(lead);
    } else if (name === 'arch') {
      // The pad never starts: the crease leads, and a late wave from the very tip meets it.
      crease(0);
      tip(0.25, lead);
    } else if (seeds.length) {
      // Your own: your first point plays the pad, and the tip and crease join after the head start.
      const first = Math.min(...seeds.map((s) => s.start ?? 0));
      tip(1, first + lead);
      crease(first + lead);
    }
    for (const s of seeds) {
      const seed = seedSite(grid, s.x, s.y, s.start ?? 0, random);
      if (seed) sites.push(seed);
    }
    return sites;
  }

  /** A fresh simulation: both signals at zero, waiting for their sites. `scale` is s above. */
  function createSim(grid, sites, scale = 0.55) {
    const n = grid.W * grid.H;
    return {
      grid,
      sites,
      scale,
      a: new Float32Array(n),
      h: new Float32Array(n),
      a2: new Float32Array(n),
      h2: new Float32Array(n),
      born: new Int32Array(n).fill(-1), // the step each cell joined the pattern, or −1
      grown: 0, // cells that have joined the pattern
      fullAt: -1, // the step the pattern first covered the fingertip
      steps: 0,
    };
  }

  /** A visitor's seed at (x, y) in unit coordinates, or null outside the fingertip. */
  function seedSite(grid, x, y, start, random = Math.random) {
    const cells = ellipse(grid, x * grid.W - 0.5, y * grid.H - 0.5, 3, 3);
    return cells.length ? site('yours', cells, x, y, start, 1, random) : null;
  }

  /** True if (x, y) in unit coordinates lies on the fingertip. */
  const inside = (grid, x, y) => {
    const i = Math.floor(x * grid.W),
      j = Math.floor(y * grid.H);
    return i >= 0 && j >= 0 && i < grid.W && j < grid.H && grid.mask[j * grid.W + i] === 1;
  };

  /** Add sites to a running simulation, starting now or later. */
  function addSites(sim, sites) {
    sim.sites.push(...sites);
    sim.fullAt = -1;
  }

  /** Poke the activator at every site that is active on this step. */
  function applySites(sim) {
    const { a, steps } = sim;
    for (const s of sim.sites) {
      if (steps < s.start || steps >= s.start + s.pulse) continue;
      for (let i = 0; i < s.cells.length; i++) a[s.cells[i]] = s.amp[i];
    }
  }

  /** Advance the simulation by `count` steps (explicit Euler, isotropic nine-point Laplacian). */
  function advance(sim, count = 1) {
    const { W, rows, ghosts, count: cells } = sim.grid;
    const born = sim.born;
    const da = sim.scale * SPREAD * DT,
      dh = sim.scale * DT,
      sixth = 1 / 6;
    let grown = sim.grown;
    for (let k = 0; k < count; k++) {
      applySites(sim);
      const a = sim.a,
        h = sim.h,
        an = sim.a2,
        hn = sim.h2;
      for (let g = 0; g < ghosts.length; g += 2) {
        a[ghosts[g]] = a[ghosts[g + 1]];
        h[ghosts[g]] = h[ghosts[g + 1]];
      }
      const step = sim.steps;
      for (let r = 0; r < rows.length; r += 2) {
        for (let c = rows[r], end = rows[r + 1]; c <= end; c++) {
          const ac = a[c],
            hc = h[c];
          const la =
            (4 * (a[c - 1] + a[c + 1] + a[c - W] + a[c + W]) +
              a[c - W - 1] +
              a[c - W + 1] +
              a[c + W - 1] +
              a[c + W + 1] -
              20 * ac) *
            sixth;
          const lh =
            (4 * (h[c - 1] + h[c + 1] + h[c - W] + h[c + W]) +
              h[c - W - 1] +
              h[c - W + 1] +
              h[c + W - 1] +
              h[c + W + 1] -
              20 * hc) *
            sixth;
          const react = GROW * ac - SATURATE * ac * hc * hc;
          const next = ac + da * la + DT * (react - hc);
          an[c] = next;
          hn[c] = hc + dh * lh + DT * (react - DECAY * hc);
          if (born[c] < 0 && (next > GROWN || next < -GROWN)) {
            born[c] = step;
            grown++;
          }
        }
      }
      sim.a = an;
      sim.a2 = a;
      sim.h = hn;
      sim.h2 = h;
      sim.steps++;
      // Cells right on the line between a ridge and a valley may never pass GROWN, so "full" allows a few.
      if (sim.fullAt < 0 && grown > FULL * cells) sim.fullAt = sim.steps;
    }
    sim.grown = grown;
    return sim;
  }

  /** The fraction of the fingertip where ridges have formed (0–1). */
  const coverage = (sim) => sim.grown / sim.grid.count;

  /** True once growth has covered the fingertip and had `settle` steps to smooth, or can go no further. */
  function finished(sim, settle = SETTLE) {
    if (!sim.sites.length) return false;
    if (sim.sites.some((s) => sim.steps < s.start + s.pulse)) return false;
    if (sim.steps >= MAX_STEPS) return true;
    if (sim.grown === 0) return sim.steps > Math.max(...sim.sites.map((s) => s.start)) + 600;
    return sim.fullAt >= 0 && sim.steps - sim.fullAt >= settle;
  }

  /**
   * Find the singular points of the ridge flow, as fingerprint examiners do.
   * Walking once around a core, the ridge direction turns by +½ turn (+1
   * around a whorl's centre); around a triradius (delta) it turns by −½. The
   * direction comes from the activator's gradient, averaged over blocks about
   * one ridge wide; the turning is summed around rings of blocks (the Poincaré
   * index). Blocks near the edge are skipped, so points right at the edge are
   * missed. Returns { cores, deltas }, lists of { x, y, index } with x, y in
   * unit coordinates.
   */
  function singularities(sim) {
    const { W, H, mask, edge } = sim.grid;
    const a = sim.a;
    const block = Math.max(5, Math.round(wavelength(sim.scale)));
    const bw = Math.floor(W / block),
      bh = Math.floor(H / block);
    // Doubled-angle orientation vectors, so opposite gradients agree.
    const vx = new Float64Array(bw * bh),
      vy = new Float64Array(bw * bh),
      ok = new Uint8Array(bw * bh);
    for (let by = 0; by < bh; by++)
      for (let bx = 0; bx < bw; bx++) {
        let sx = 0,
          sy = 0,
          inside = 0;
        for (let j = by * block; j < (by + 1) * block; j++)
          for (let i = bx * block; i < (bx + 1) * block; i++) {
            const c = j * W + i;
            if (!mask[c] || edge[c] < 3) continue;
            inside++;
            const gx = a[c + 1] - a[c - 1],
              gy = a[c + W] - a[c - W];
            sx += gx * gx - gy * gy;
            sy += 2 * gx * gy;
          }
        const b = by * bw + bx;
        vx[b] = sx;
        vy[b] = sy;
        ok[b] = inside === block * block && Math.hypot(sx, sy) > 1e-9 ? 1 : 0;
      }
    // Smooth the orientation a little (3 × 3 blocks) to steady the count.
    const angle = new Float64Array(bw * bh);
    for (let by = 0; by < bh; by++)
      for (let bx = 0; bx < bw; bx++) {
        let sx = 0,
          sy = 0;
        for (let j = Math.max(0, by - 1); j <= Math.min(bh - 1, by + 1); j++)
          for (let i = Math.max(0, bx - 1); i <= Math.min(bw - 1, bx + 1); i++)
            if (ok[j * bw + i]) {
              sx += vx[j * bw + i];
              sy += vy[j * bw + i];
            }
        angle[by * bw + bx] = Math.atan2(sy, sx) / 2;
      }
    /** The Poincaré index around the square ring of blocks at distance r from (bx, by), or null off the fingertip. */
    function indexAround(bx, by, r) {
      const ring = [];
      for (let i = -r; i < r; i++) ring.push([bx + i, by - r]);
      for (let j = -r; j < r; j++) ring.push([bx + r, by + j]);
      for (let i = r; i > -r; i--) ring.push([bx + i, by + r]);
      for (let j = r; j > -r; j--) ring.push([bx - r, by + j]);
      if (!ring.every(([i, j]) => i >= 0 && j >= 0 && i < bw && j < bh && ok[j * bw + i])) return null;
      let turn = 0;
      for (let k = 0; k < ring.length; k++) {
        const [i0, j0] = ring[k],
          [i1, j1] = ring[(k + 1) % ring.length];
        let d = angle[j1 * bw + i1] - angle[j0 * bw + i0];
        while (d > Math.PI / 2) d -= Math.PI;
        while (d < -Math.PI / 2) d += Math.PI;
        turn += d;
      }
      return Math.round(turn / Math.PI) / 2; // whole turns, to the nearest half
    }
    const found = [];
    for (let by = 1; by < bh - 1; by++)
      for (let bx = 1; bx < bw - 1; bx++) {
        const index = ok[by * bw + bx] ? indexAround(bx, by, 1) : null;
        if (index) found.push({ bx, by, index });
      }
    // Neighbouring blocks often see the same point: gather them, then measure each group on a wider ring,
    // which also joins a whorl's two half-cores into one centre of index +1.
    const groups = [];
    for (const f of found) {
      const near = groups.find(
        (g) => g.index * f.index > 0 && g.members.some((m) => Math.abs(m.bx - f.bx) <= 2 && Math.abs(m.by - f.by) <= 2),
      );
      if (near) near.members.push(f);
      else groups.push({ index: f.index, members: [f] });
    }
    const points = groups.map((g) => {
      const bx = g.members.reduce((s, m) => s + m.bx, 0) / g.members.length,
        by = g.members.reduce((s, m) => s + m.by, 0) / g.members.length;
      const wide = indexAround(Math.round(bx), Math.round(by), 2);
      const index = wide && Math.sign(wide) === Math.sign(g.index) ? wide : g.index;
      return { x: ((bx + 0.5) * block) / W, y: ((by + 0.5) * block) / H, index };
    });
    return { cores: points.filter((p) => p.index > 0), deltas: points.filter((p) => p.index < 0) };
  }

  /**
   * Name the pattern from its core: a centre the ridges circle all the way
   * round (+1) is a whorl, a single hairpin (+½) a loop, and none an arch.
   * Also returns the cores and triradii found; Henry's rule of thumb expects
   * two triradii for a whorl, one for a loop, and none for an arch.
   */
  function classify(sim) {
    const { cores, deltas } = singularities(sim);
    const turn = cores.reduce((s, c) => s + c.index, 0);
    return { type: turn >= 1 ? 'whorl' : turn > 0 ? 'loop' : 'arch', cores, deltas };
  }

  Wonderloom.models.fingerprint = {
    WIDTH,
    HEIGHT,
    DT,
    STEPS_PER_RIDGE,
    MAX_STEPS,
    GROWN,
    PATTERNS,
    rng,
    wavelength,
    outline,
    createGrid,
    sitesFor,
    site,
    ellipse,
    createSim,
    seedSite,
    inside,
    addSites,
    advance,
    coverage,
    finished,
    singularities,
    classify,
  };
})();
