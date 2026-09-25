/* Room · Grow a fingerprint: ridges that spread as waves from a few starting sites. */
(() => {
  'use strict';

  const W = Wonderloom;
  const { $, TAU, clamp } = W;
  const F = W.models.fingerprint;
  const t = W.text('fingerprint');
  const reduced = W.prefersReducedMotion();

  const RATES = [40, 80, 150, 300, 700]; // simulation steps per second, per growth speed
  const BUDGET = 7; // ms of simulation a frame may always use
  const SHARE = 0.45; // on a slow device, up to this share of the time between frames goes to growing
  const HEAD_START = 240; // steps grown in the background on a fresh start (about three ridges), so it never opens bare
  const SLOW_RENDER = 9; // ms: drawing the ridges slower than this draws them coarser until growth ends
  const QUIET_SETTLE = 500; // with reduced motion, smooth this long after covering, then show
  const SEEDS = ['a', 'b', 'c', 'd']; // up to four points of your own: ax, ay, at (start step), …
  const ACROSS = F.WIDTH * 0.9; // the fingertip's width in cells, for "about n ridges across"
  const ROLE_COLORS = { pad: '#f2a07b', tip: '#8fc7f2', crease: '#b7e29a', yours: '#e3a6e6' };
  // Each kind of starting site has its own shape, outlined dark inside a light halo, so it reads without
  // colour and against every skin, ridge, and paper tone.
  const ROLE_SHAPES = { pad: 'circle', tip: 'triangle', crease: 'square', yours: 'diamond' };
  const MARK_DARK = '#10151d',
    MARK_LIGHT = '#fbf7ee';
  const GLOW_STEPS = 260; // new ridges glow warmly for this many steps

  // Colours for each look, as [r, g, b]: background of the fingertip, ridge, new-ridge glow.
  const LOOKS = [
    { base: [238, 192, 164], ridge: [138, 76, 62], glow: [255, 214, 150], mark: '#1d4f78' },
    { base: [244, 239, 229], ridge: [28, 32, 46], glow: [28, 32, 46], mark: '#b3372b' },
    { base: [18, 27, 38], ridge: [128, 222, 196], glow: [255, 228, 160], mark: '#ffd27a' },
  ];

  let grid = null,
    sim = null,
    plan = '', // the settings the current simulation was grown from
    found = null, // { type, cores, deltas } once growth has finished
    owed = 0, // fractional steps owed to the clock
    lastStep = 0, // performance.now() at the last growth step, so growth follows real time, not the frame rate
    quiet = 0, // token of the reduced-motion computation in progress, 0 when none
    head = 0, // token of the head-start computation in progress, 0 when none
    layout = null,
    aim = null, // keyboard aiming point, in fingertip units
    hover = null, // mouse position over the fingertip, in fingertip units
    image = null, // the rendered field and what it shows
    shadow = null; // the cached shadow behind the fingertip
  // Measured timings, for tuning. `renderAvg` decides whether to draw the ridges coarser while they grow.
  const perf = { msPerStep: 0.5, stepsPerFrame: 0, simMs: 0, renderMs: 0, renderAvg: 0, drawMs: 0 };

  /** Is slot k one of your points on the fingertip? A link may carry points off it, which are ignored. */
  const onTip = (s, k) =>
    s[k + 'x'] >= 0 && s[k + 'y'] >= 0 && F.inside((grid ??= F.createGrid()), s[k + 'x'], s[k + 'y']);
  const seedsOf = (s) =>
    SEEDS.filter((k) => onTip(s, k)).map((k) => ({ x: s[k + 'x'], y: s[k + 'y'], start: s[k + 't'] }));
  const planOf = (s) =>
    [s.pattern, s.lead, s.spacing, s.twin, ...seedsOf(s).flatMap((p) => [p.x, p.y, p.start])].join(',');
  const clearSeeds = (s) => SEEDS.forEach((k) => Object.assign(s, { [k + 'x']: -1, [k + 'y']: -1, [k + 't']: 0 }));
  const percent = () => Math.min(100, Math.round((F.coverage(sim) / 0.97) * 100));

  /** Start growing from scratch with the current settings. */
  function regrow(s, stage) {
    grid ??= F.createGrid();
    s.pattern = clamp(Math.round(s.pattern), 0, 3);
    sim = F.createSim(grid, F.sitesFor(grid, s.pattern, s.lead, seedsOf(s), s.twin), s.spacing);
    plan = planOf(s);
    found = null;
    owed = 0;
    lastStep = 0;
    if (image) image.steps = -1;
    if (reduced) growQuietly(stage);
    else growHeadStart(stage);
  }

  /** Once growth has finished, name the pattern and find its triradii (once), and say so. */
  function settle(s) {
    if (found || !sim.grown) return;
    found = F.classify(sim);
    if (room && W.stage.isShowing(room) && s) W.announce(t.status(t.types[found.type], found.deltas.length));
  }

  /**
   * A fresh fingertip grows its first ridges in the background, in small
   * chunks so the page stays responsive, and shows them as they come: there
   * is something to see at once, even on a slow device, and even when paused.
   */
  function growHeadStart(stage) {
    const token = ++head;
    const work = () => {
      if (token !== head || !sim || quiet) return;
      if (!stage.isShowing(room)) return void (head = 0);
      const end = performance.now() + 10;
      while (performance.now() < end && sim.sites.length && sim.steps < HEAD_START && !F.finished(sim))
        F.advance(sim, 1);
      if (!sim.sites.length || sim.steps >= HEAD_START || F.finished(sim)) head = 0;
      else setTimeout(work, 0);
      if (!stage.playing) stage.draw();
    };
    setTimeout(work, 0);
  }

  /**
   * With reduced motion, grow to near completion out of sight, in small
   * chunks so the page stays responsive, and only then show the result.
   */
  function growQuietly(stage) {
    const token = ++quiet;
    const work = () => {
      if (token !== quiet || !sim) return;
      if (!stage.isShowing(room)) return void (quiet = 0); // resumes when the room opens again
      const end = performance.now() + 12;
      while (performance.now() < end && sim.sites.length && !F.finished(sim, QUIET_SETTLE)) F.advance(sim, 1);
      if (!sim.sites.length || F.finished(sim, QUIET_SETTLE)) {
        quiet = 0;
        if (sim.sites.length) settle(W.stage.settingsFor('fingerprint'));
      } else setTimeout(work, 0);
      stage.draw();
    };
    setTimeout(work, 0);
  }

  // ---------------------------------------------------------------- layout

  /** Where the fingertip and the legend go. Keeps clear of the stage heading on phones. */
  function measure(width, height) {
    // Below 520px the stage heading sits over the canvas; below 340px the scene name may take two lines.
    const top = width < 340 ? 84 : width < 520 ? 38 : 10,
      bottom = 10,
      aspect = F.WIDTH / F.HEIGHT;
    const legend = width >= 600 ? Math.min(250, width * 0.3) : 0;
    const below = 0.06; // skin below the crease, as a fraction of the fingertip's height
    let fh = (height - top - bottom) / (1 + below);
    let fw = fh * aspect;
    const gap = legend ? 44 : 0;
    const room = width - legend - gap - 24;
    if (fw > room) {
      fw = room;
      fh = fw / aspect;
    }
    const x = (width - fw - gap - legend) / 2;
    const y = top + (height - top - bottom - fh * (1 + below)) / 2;
    return { x, y, w: fw, h: fh, below: fh * below, legend: legend ? { x: x + fw + gap, y, w: legend } : null };
  }

  /** Canvas point (unit coordinates of the canvas) → fingertip unit coordinates. */
  function toFinger(p, stage) {
    if (!layout) return null;
    return { x: (p.x * stage.width - layout.x) / layout.w, y: (p.y * stage.height - layout.y) / layout.h };
  }

  function tracePath(ctx, x, y, w, h) {
    ctx.beginPath();
    F.outline(48).forEach((p, i) => (i ? ctx.lineTo : ctx.moveTo).call(ctx, x + p.x * w, y + p.y * h));
    ctx.closePath();
  }

  // ------------------------------------------------------------- rendering

  /**
   * Draw the activator field into an off-screen image, `scale` pixels per
   * cell, with bilinear interpolation so ridges come out smooth. Ridges are
   * where the activator is high; a small emboss lights their upper side, and
   * newly formed ridges glow for a moment.
   */
  function render(look, scale) {
    const { W: gw, H: gh } = grid;
    const w = gw * scale,
      h = gh * scale;
    if (!image || image.scale !== scale) image = prepareImage(scale, w, h);
    const { pix, ix, fx, iy, fy, tone, grain, edge } = image;
    const a = sim.a,
      born = sim.born,
      now = sim.steps;
    const colors = LOOKS[look],
      [br, bg, bb] = colors.base,
      [rr, rg, rb] = colors.ridge,
      [gr, gg, gb] = colors.glow;
    const ink = look === 1;
    let o = 0;
    for (let py = 0; py < h; py++) {
      const j = iy[py],
        wy = fy[py],
        row = j * gw;
      for (let px = 0; px < w; px++, o++) {
        const c = row + ix[px],
          wx = fx[px];
        const a00 = a[c],
          a10 = a[c + 1],
          a01 = a[c + gw],
          a11 = a[c + gw + 1];
        const up = a00 + (a10 - a00) * wx,
          down = a01 + (a11 - a01) * wx;
        const v = (up + (down - up) * wy) * 2.2; // about ±1 on a grown ridge
        let r = (v - 0.08) / 0.62;
        r = r <= 0 ? 0 : r >= 1 ? 1 : r * r * (3 - 2 * r);
        if (ink) {
          // Ink: transparent paper, ink that fades towards the rim, with a little grain.
          const e = edge[c] + (edge[c + 1] - edge[c]) * wx;
          const fade = clamp((e - 1.2) / 5, 0, 1);
          const alpha = r * fade * (0.72 + 0.28 * (grain[o] / 255));
          pix[o] = ((alpha * 235) << 24) | (rb << 16) | (rg << 8) | rr;
          continue;
        }
        const shade = tone[c];
        // Towards the rim the pad curves away, so its ridges soften (this also hides the grid's ragged edge).
        const e = edge[c] + (edge[c + 1] - edge[c]) * wx;
        const rim = e >= 5 ? 1 : e <= 0.8 ? 0.3 : 0.3 + (0.7 * (e - 0.8)) / 4.2;
        const light = (up - down) * 5.5 * rim; // slope along y: the upper flank of a ridge catches the light
        const age = born[c] < 0 ? GLOW_STEPS : now - born[c];
        const glow = age < GLOW_STEPS ? (1 - age / GLOW_STEPS) * 0.6 * r : 0;
        const k = r * 0.9 * rim;
        let cr = (br + (rr - br) * k) * shade,
          cg = (bg + (rg - bg) * k) * shade,
          cb = (bb + (rb - bb) * k) * shade;
        const lift = clamp(light, -1, 1) * 22 * (look === 2 ? 0.5 : 1);
        cr += lift + (gr - cr) * glow;
        cg += lift + (gg - cg) * glow;
        cb += lift + (gb - cb) * glow;
        pix[o] = (255 << 24) | (clamp(cb, 0, 255) << 16) | (clamp(cg, 0, 255) << 8) | clamp(cr, 0, 255);
      }
    }
    image.ctx.putImageData(image.data, 0, 0);
    if (!ink) {
      // Trim to the fingertip with an antialiased edge.
      image.ctx.globalCompositeOperation = 'destination-in';
      tracePath(image.ctx, 0, 0, w, h);
      image.ctx.fill();
      image.ctx.globalCompositeOperation = 'source-over';
    }
    image.steps = sim.steps;
    image.look = look;
  }

  /** Lookup tables for one render scale: which cells each pixel samples, pad shading, and ink grain. */
  function prepareImage(scale, w, h) {
    const { W: gw, H: gh, edge: cellEdge } = grid;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    const data = ctx.createImageData(w, h);
    const table = (n, cells) => {
      const index = new Int32Array(n),
        frac = new Float32Array(n);
      for (let p = 0; p < n; p++) {
        const X = (p + 0.5) / scale - 0.5,
          i = clamp(Math.floor(X), 0, cells - 2);
        index[p] = i;
        frac[p] = clamp(X - i, 0, 1);
      }
      return [index, frac];
    };
    const [ix, fx] = table(w, gw),
      [iy, fy] = table(h, gh);
    // Soft shading of the pad: lighter in the middle, a little darker towards the rim.
    const tone = new Float32Array(gw * gh);
    for (let j = 0; j < gh; j++)
      for (let i = 0; i < gw; i++) {
        const nx = (i - gw / 2) / (gw * 0.45),
          ny = (j - gh * 0.42) / (gh * 0.6),
          rim = Math.min(cellEdge[j * gw + i], 12) / 12;
        tone[j * gw + i] = 1.05 - 0.1 * (nx * nx + ny * ny) - 0.1 * (1 - rim) * (1 - rim);
      }
    const random = F.rng(7);
    const grain = new Uint8Array(w * h);
    for (let p = 0; p < grain.length; p++) grain[p] = random() * 255;
    return {
      scale,
      canvas,
      ctx,
      data,
      pix: new Uint32Array(data.data.buffer),
      ix,
      fx,
      iy,
      fy,
      tone,
      grain,
      edge: Float32Array.from(cellEdge),
      steps: -1,
    };
  }

  function draw(ctx, s, stage) {
    const start = performance.now();
    const { width, height } = stage;
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    if (!sim) return;
    layout = measure(width, height);
    const { x, y, w, h } = layout;
    // Two pixels per cell is plenty: the browser's smoothing does the rest, and the render stays cheap.
    // While growing on a slow device, one pixel per cell: a quarter of the work. Once grown, full detail.
    const coarse = !found && perf.renderAvg > SLOW_RENDER;
    const scale = !coarse && h * Math.min(devicePixelRatio || 1, 2) > F.HEIGHT * 1.4 ? 2 : 1;
    const hidden = quiet !== 0; // reduced motion: growing out of sight
    if (!hidden && (!image || image.scale !== scale || image.steps !== sim.steps || image.look !== s.look)) {
      const t0 = performance.now();
      render(s.look, scale);
      perf.renderMs = performance.now() - t0;
      // Judge the device by the full-detail render; a coarse one is four times cheaper.
      const full = perf.renderMs * (scale === 1 && coarse ? 4 : 1);
      perf.renderAvg = perf.renderAvg ? perf.renderAvg * 0.8 + full * 0.2 : full;
    }
    backdrop(ctx, s.look, layout);
    if (hidden) {
      ctx.fillStyle = rgb(LOOKS[s.look].base, s.look === 1 ? 0.25 : 1);
      tracePath(ctx, x, y, w, h);
      ctx.fill();
    } else ctx.drawImage(image.canvas, x, y, w, h);
    if (s.look === 0) crease(ctx, layout);
    if (s.marks) marks(ctx, s, layout);
    pointerMarks(ctx, s, layout);
    if (layout.legend) legend(ctx, s, layout.legend);
    // Without room for the legend on the canvas (phones), a small one shows in the panel.
    const key = $('fingerprint-key');
    if (key && key.hidden !== !!layout.legend) key.hidden = !!layout.legend;
    status(s);
    perf.drawMs = performance.now() - start;
  }

  const rgb = ([r, g, b], alpha = 1) => `rgba(${r},${g},${b},${alpha})`;

  /** What sits behind the fingertip: a soft shadow and the skin below the crease, or a paper card. */
  function backdrop(ctx, look, { x, y, w, h, below }) {
    if (look === 1) {
      const pad = w * 0.12;
      ctx.fillStyle = '#f4efe5';
      ctx.beginPath();
      ctx.roundRect(x - pad, y - pad * 0.6, w + pad * 2, h + below + pad * 1.2, 10);
      ctx.fill();
      return;
    }
    // A blurred shadow is costly to draw every frame, so it is drawn once per size and look, then reused.
    const dpr = ctx.getTransform().a,
      pad = 40,
      key = [look, Math.round(w), Math.round(h), dpr].join();
    if (shadow?.key !== key) {
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil((w + 2 * pad) * dpr);
      canvas.height = Math.ceil((h + below + 2 * pad) * dpr);
      const c = canvas.getContext('2d');
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      const base = LOOKS[look].base;
      // The next bone's skin, fading away below the crease.
      const fade = c.createLinearGradient(0, pad + h - 4, 0, pad + h + below);
      fade.addColorStop(0, rgb(base, look === 2 ? 0.7 : 0.9));
      fade.addColorStop(1, rgb(base, 0));
      c.fillStyle = fade;
      c.fillRect(pad + w * 0.035, pad + h - 4, w * 0.93, below + 4);
      c.shadowColor = look === 2 ? 'rgba(120, 220, 200, 0.18)' : 'rgba(0, 0, 0, 0.55)';
      c.shadowBlur = 24;
      c.fillStyle = rgb(base);
      tracePath(c, pad, pad, w, h);
      c.fill();
      shadow = { key, canvas };
    }
    ctx.drawImage(shadow.canvas, x - pad, y - pad, w + 2 * pad, h + below + 2 * pad);
  }

  /** The crease at the base of the fingertip. */
  function crease(ctx, { x, y, w, h }) {
    ctx.strokeStyle = 'rgba(96, 44, 34, 0.55)';
    ctx.lineWidth = Math.max(2, h * 0.008);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x + w * 0.06, y + h - 1);
    ctx.quadraticCurveTo(x + w / 2, y + h + h * 0.012, x + w * 0.94, y + h - 1);
    ctx.stroke();
  }

  /** Where a site sits on the canvas: tip and crease sites sit on the edge. */
  function sitePoint(site, { x, y, w, h }) {
    if (site.role === 'tip') return { x: x + w / 2, y: y + h * 0.018 };
    if (site.role === 'crease') return { x: x + w / 2, y: y + h * 0.985 };
    return { x: x + site.x * w, y: y + site.y * h };
  }

  /** The path of a starting site's shape, about 2r across, centred on (x, y). */
  function siteShape(ctx, shape, x, y, r) {
    ctx.beginPath();
    if (shape === 'circle') ctx.arc(x, y, r, 0, TAU);
    else if (shape === 'square') ctx.rect(x - r * 0.85, y - r * 0.85, r * 1.7, r * 1.7);
    else if (shape === 'triangle') {
      // Pointing down, into the fingertip from its tip.
      ctx.moveTo(x, y + r * 1.1);
      ctx.lineTo(x - r * 1.15, y - r * 0.85);
      ctx.lineTo(x + r * 1.15, y - r * 0.85);
      ctx.closePath();
    } else {
      ctx.moveTo(x, y - r * 1.25);
      ctx.lineTo(x + r * 1.25, y);
      ctx.lineTo(x, y + r * 1.25);
      ctx.lineTo(x - r * 1.25, y);
      ctx.closePath();
    }
  }

  /** Stroke the current path twice, light then dark, so it reads on skin, ridges, paper, and night alike. */
  function haloStroke(ctx, width) {
    ctx.lineJoin = 'round';
    ctx.strokeStyle = MARK_LIGHT;
    ctx.lineWidth = width + 3;
    ctx.stroke();
    ctx.strokeStyle = MARK_DARK;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  /** A starting site's marker: its shape in its colour, outlined dark inside a light halo. */
  function siteMarker(ctx, role, x, y, r) {
    siteShape(ctx, ROLE_SHAPES[role], x, y, r);
    ctx.lineJoin = 'round';
    ctx.strokeStyle = MARK_LIGHT;
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fillStyle = ROLE_COLORS[role];
    ctx.fill();
    ctx.strokeStyle = MARK_DARK;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  /** Rings at the starting sites (dashed while they wait), then the cores and triradii once grown. */
  function marks(ctx, s, box) {
    const unit = box.h / 100;
    for (const site of sim.sites) {
      const p = sitePoint(site, box),
        wait = site.start - sim.steps,
        ring = Math.max(11, unit * 3.2);
      if (wait > 0) {
        // A dashed ring that fills in as the site's moment approaches.
        const total = Math.max(1, site.start);
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(p.x, p.y, ring, 0, TAU);
        haloStroke(ctx, 1.4);
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(p.x, p.y, ring, -Math.PI / 2, -Math.PI / 2 + TAU * (1 - wait / total));
        haloStroke(ctx, 1.8);
      } else {
        const since = -wait,
          pulse = since < 240 && !reduced ? since / 240 : 1;
        if (pulse < 1) {
          ctx.globalAlpha = 1 - pulse;
          ctx.beginPath();
          ctx.arc(p.x, p.y, ring * (0.8 + pulse), 0, TAU);
          haloStroke(ctx, 1.6);
          ctx.globalAlpha = 1;
        }
      }
      siteMarker(ctx, site.role, p.x, p.y, Math.max(4.5, unit * 1.3));
    }
    if (!found) return;
    const color = LOOKS[s.look].mark;
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(2, unit * 0.55);
    for (const d of found.deltas) {
      // A little Y where three ridge directions meet.
      const px = box.x + d.x * box.w,
        py = box.y + d.y * box.h,
        r = unit * 2.4;
      ctx.beginPath();
      for (const angle of [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6]) {
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(angle) * r, py + Math.sin(angle) * r);
      }
      ctx.stroke();
    }
    for (const c of found.cores) {
      ctx.beginPath();
      ctx.arc(box.x + c.x * box.w, box.y + c.y * box.h, unit * (c.index >= 1 ? 2.6 : 1.8), 0, TAU);
      ctx.stroke();
    }
  }

  /** The keyboard aim and the mouse hover, showing where a new start would go. */
  function pointerMarks(ctx, s, box) {
    const unit = box.h / 100;
    for (const p of [aim, hover]) {
      if (!p || !F.inside(grid, p.x, p.y)) continue;
      const px = box.x + p.x * box.w,
        py = box.y + p.y * box.h;
      ctx.strokeStyle = s.look === 2 ? 'rgba(255,255,255,0.8)' : 'rgba(20,24,34,0.75)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(px, py, unit * 3, 0, TAU);
      if (p === aim) {
        ctx.moveTo(px - unit * 5, py);
        ctx.lineTo(px - unit * 1.5, py);
        ctx.moveTo(px + unit * 1.5, py);
        ctx.lineTo(px + unit * 5, py);
        ctx.moveTo(px, py - unit * 5);
        ctx.lineTo(px, py - unit * 1.5);
        ctx.moveTo(px, py + unit * 1.5);
        ctx.lineTo(px, py + unit * 5);
      }
      ctx.stroke();
    }
  }

  /** On wide screens: which sites start when, how far the ridges have spread, and the result. */
  function legend(ctx, s, { x, y, w }) {
    let line = y + 12;
    const text = (words, size, color, weight = 400) => {
      ctx.font = `${weight} ${size}px system-ui, sans-serif`;
      ctx.fillStyle = color;
      ctx.fillText(words, x, line, w);
    };
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    text(t.legendTitle, 11, '#98aab7', 600);
    line += 26;
    const roles = [];
    for (const site of [...sim.sites].sort((a, b) => a.start - b.start))
      if (!roles.some((r) => r.role === site.role)) roles.push(site);
    if (!roles.length) {
      text(t.noSites, 14, '#dfe7ef');
      line += 26;
    }
    for (const site of roles) {
      siteMarker(ctx, site.role, x + 5, line - 5, 5);
      ctx.font = '500 14px system-ui, sans-serif';
      ctx.fillStyle = '#e8eef5';
      ctx.fillText(t.roles[site.role], x + 18, line, w - 18);
      const wait = site.start - sim.steps;
      ctx.font = '400 12px system-ui, sans-serif';
      ctx.fillStyle = '#98aab7';
      const state = wait > 0 ? t.soon(Math.ceil(wait / F.STEPS_PER_RIDGE)) : found ? t.done : t.started;
      ctx.fillText(state, x + 18, line + 17, w - 18);
      line += 42;
    }
    line += 8;
    if (roles.length) {
      if (found) {
        text(t.result(t.types[found.type]), 14, '#f3dca6', 500);
        line += 20;
        text(t.triradii(found.deltas.length), 13, '#c6d2dc');
      } else {
        // The words "Growing · n%" are in the status line above; here, just the bar.
        const p = percent();
        ctx.fillStyle = '#243140';
        ctx.fillRect(x, line, w * 0.8, 4);
        ctx.fillStyle = '#b7e29a';
        ctx.fillRect(x, line, w * 0.8 * (p / 100), 4);
      }
      line += 30;
      text(t.twin(s.twin), 12, '#8494a3');
    }
  }

  /** The status line above the canvas and the scene name. */
  function status(s) {
    const words = !sim.sites.length
      ? t.waiting
      : found
        ? t.status(t.types[found.type], found.deltas.length)
        : quiet
          ? t.quietly(percent())
          : t.growing(percent());
    if ($('scene-status').textContent !== words) $('scene-status').textContent = words;
    const mixed = s.pattern !== 3 && seedsOf(s).length > 0;
    const name = mixed ? t.mixed : t.sceneNames[s.pattern];
    if ($('scene-name').textContent !== name) $('scene-name').textContent = name;
  }

  // ------------------------------------------------------------------ input

  /** Start ridges at (x, y) in fingertip units. */
  function plant(s, stage, x, y) {
    if (!grid || !F.inside(grid, x, y)) return W.toast(t.outside);
    const slot = SEEDS.find((k) => !onTip(s, k));
    if (!slot) return W.toast(t.full);
    const first = s.pattern === 3 && !seedsOf(s).length;
    s[slot + 'x'] = Math.round(x * 10000) / 10000;
    s[slot + 'y'] = Math.round(y * 10000) / 10000;
    s[slot + 't'] = first ? 0 : sim.steps;
    if (first) regrow(s, stage);
    else {
      // Rebuild the site list from the settings, so replaying this plan grows exactly the same fingertip.
      const sites = F.sitesFor(grid, s.pattern, s.lead, seedsOf(s), s.twin);
      sim.sites = sites;
      plan = planOf(s);
      found = null;
      if (reduced && !quiet) growQuietly(stage);
    }
    if (s.pattern !== 3) stage.setChosen(-1);
    // A pause stays a pause: the new ridges wait for Play.
    stage.sync();
    stage.draw();
  }

  // --------------------------------------------------------------- preview

  /**
   * The home card: three small fingertips (whorl, loop, arch) drawn from a
   * formula, not a simulation, so the map stays quick. Each is cos(2π φ),
   * where φ blends distances to the core, the crease, and the rim: ridges
   * follow each, and the seams between them look like triradii.
   */
  function preview(ctx, width, height) {
    const aspect = F.WIDTH / F.HEIGHT,
      h = height * 0.88,
      w = h * aspect,
      gap = (width - 3 * w) / 4;
    // Units: the fingertip is 2 wide (u from −1 to 1) and `tall` high (y from the tip down to the crease).
    const tall = 2 / aspect,
      neck = 1.1, // where the dome meets the sides
      half = (y) =>
        y < neck
          ? 0.92 * Math.sqrt(Math.max(0, 1 - ((neck - y) / neck) ** 2))
          : 0.92 * (1 - 0.09 * ((y - neck) / (tall - neck)) ** 2);
    // A smooth minimum, so ridges from two sources bend into each other instead of meeting in a crease.
    const smin = (a, b, k = 0.08) => {
      const e = Math.max(k - Math.abs(a - b), 0) / k;
      return Math.min(a, b) - e * e * k * 0.25;
    };
    const fields = {
      whorl: (u, y, tip, crease) => smin(smin(Math.hypot(u, y - 1.3), crease + 0.3), tip),
      loop: (u, y, tip, crease) => {
        // Distance to a short tilted stroke running in from the left side: its rings are hairpins.
        const s = clamp((u + 1) / 0.78, 0, 1),
          d = Math.hypot(u - (-1 + 0.78 * s), y - (1.5 - 0.22 * s));
        return smin(smin(d, crease + 0.26), tip);
      },
      arch: (u, y, tip, crease) =>
        crease + 0.5 * Math.exp(-2.4 * u * u) * clamp((tall - y) / (tall - 0.5), 0, 1) ** 1.6,
    };
    Object.entries(fields).forEach(([, phiOf], k) => {
      const off = document.createElement('canvas');
      off.width = Math.round(w * 2);
      off.height = Math.round(h * 2);
      const c = off.getContext('2d');
      const img = c.createImageData(off.width, off.height);
      for (let j = 0; j < off.height; j++)
        for (let i = 0; i < off.width; i++) {
          const u = ((i + 0.5) / off.width) * 2 - 1,
            y = ((j + 0.5) / off.height) * tall,
            side = half(y);
          if (Math.abs(u) > side || y > tall - 0.04) continue;
          const rim = y < neck ? 0.92 - Math.hypot(u, ((neck - y) * 0.92) / neck) : side - Math.abs(u),
            crease = tall - y;
          // The tip's wave hugs the rim, arriving later further down the sides.
          const tip = rim + 0.1 + 0.7 * Math.max(0, y - neck);
          const ridge = 0.5 + 0.5 * Math.cos(phiOf(u, y, tip, crease) * TAU * 10);
          const r = clamp((ridge - 0.42) / 0.26, 0, 1) * clamp(rim / 0.12, 0.3, 1);
          const shade = 1.05 - 0.1 * (u * u + ((y - 1.2) / tall) ** 2);
          const o = (j * off.width + i) * 4;
          img.data[o] = (238 - 100 * r * 0.9) * shade;
          img.data[o + 1] = (192 - 116 * r * 0.9) * shade;
          img.data[o + 2] = (164 - 102 * r * 0.9) * shade;
          img.data[o + 3] = 255;
        }
      c.putImageData(img, 0, 0);
      ctx.drawImage(off, Math.round(gap + k * (w + gap)), Math.round((height - h) / 2), w, h);
    });
  }

  // ------------------------------------------------------------------ room

  const defaults = { pattern: 0, lead: 3, spacing: 0.55, speed: 3, look: 0, twin: 0, marks: true };
  clearSeeds(defaults);
  const presetSettings = [
    { pattern: 0, lead: 3 },
    { pattern: 1, lead: 3 },
    { pattern: 2, lead: 13 },
    { pattern: 3, lead: 3 },
  ];
  const badges = ['◎', '∩', '⌒', '+'];
  const presets = t.presets.map((p, i) => ({ ...p, badge: badges[i], settings: presetSettings[i] }));

  const seedRanges = Object.fromEntries(
    SEEDS.flatMap((k) => [
      [k + 'x', [-1, 1]],
      [k + 'y', [-1, 1]],
      [k + 't', [0, F.MAX_STEPS, 'integer']],
    ]),
  );

  /** The legend in the panel: each starting site's shape and name, and the little Y of a triradius. */
  function panelKey() {
    const shape = {
      circle: '<circle cx="9" cy="9" r="5"/>',
      triangle: '<path d="M9 15 3 5h12Z"/>',
      square: '<rect x="4.5" y="4.5" width="9" height="9"/>',
      diamond: '<path d="M9 2.5 15.5 9 9 15.5 2.5 9Z"/>',
    };
    const icon = (role) =>
      `<svg viewBox="0 0 18 18" aria-hidden="true"><g fill="none" stroke="${MARK_LIGHT}" stroke-width="4" stroke-linejoin="round">${shape[ROLE_SHAPES[role]]}</g>` +
      `<g fill="${ROLE_COLORS[role]}" stroke="${MARK_DARK}" stroke-width="1.6" stroke-linejoin="round">${shape[ROLE_SHAPES[role]]}</g></svg>`;
    const items = Object.keys(ROLE_SHAPES)
      .map((role) => `<li>${icon(role)}${t.roles[role]}</li>`)
      .join('');
    const y =
      '<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M9 9V2.5M9 9l5.6 3.3M9 9l-5.6 3.3" fill="none" ' +
      `stroke="${LOOKS[2].mark}" stroke-width="2" stroke-linecap="round"/></svg>`;
    return (
      `<div class="fingerprint-key wide" id="fingerprint-key"><span class="fingerprint-key-title">${t.legendTitle}</span>` +
      `<ul>${items}<li>${y}${t.triradiusKey}</li></ul></div>`
    );
  }

  const select = (key, label, options, value) =>
    `<div class="control"><label for="fingerprint-${key}">${label}</label><select id="fingerprint-${key}" data-select="${key}">` +
    options.map((o, i) => `<option value="${i}"${i === value ? ' selected' : ''}>${o}</option>`).join('') +
    '</select></div>';

  const room = W.defineRoom({
    id: 'fingerprint',
    symbol: '◎',
    theme: 'life',
    eyebrow: t.eyebrow,
    name: t.name,
    tagline: t.tagline,
    accent: { background: '#2e2420', border: '#e0a47f', color: '#f6d2b8' },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.sceneLabel,
    sceneName: t.sceneNames[0],
    tip: t.tip,
    actionLabel: t.actionLabel,
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { ...t.connection, go: 'flock' },

    defaults,
    ranges: {
      pattern: [0, 3, 'integer'],
      lead: [0, 16, 'integer'],
      spacing: [0.4, 1],
      speed: [1, RATES.length, 'integer'],
      look: [0, LOOKS.length - 1, 'integer'],
      twin: [0, 999, 'integer'],
      ...seedRanges,
    },
    defaultPreset: 0,
    presets,

    guests: [
      {
        ...t.guests[0],
        bio: 'Turing',
        image: 'turing.jpg',
        source: 'Alan_Turing_(1951).jpg',
        color: '#b6c8eb',
        frame: [115, -28, -21],
      },
    ],

    insight: t.insight,

    controls: (s, stage) =>
      stage.slider('lead', t.lead, 0, 16, 1, s.lead) +
      stage.slider('spacing', t.spacing, 0.4, 1, 0.05, s.spacing) +
      stage.slider('speed', t.speed, 1, RATES.length, 1, s.speed) +
      `<div class="fingerprint-row wide">${select('look', t.look, t.looks, s.look)}${stage.check('marks', t.marks, s.marks)}</div>` +
      panelKey(),

    bindControls(panel, s, stage) {
      panel.querySelector('[data-select="look"]').addEventListener('change', (e) => {
        s.look = Number(e.target.value);
        stage.draw();
      });
    },

    readouts(s) {
      const across = Math.round(ACROSS / F.wavelength(s.spacing));
      if ($('v-spacing')) $('v-spacing').textContent = t.across(across);
      if ($('v-speed')) $('v-speed').textContent = t.speeds[s.speed - 1];
      if ($('v-lead')) $('v-lead').textContent = t.ridges(s.lead);
    },

    enter(s, stage) {
      aim = null;
      hover = null;
      if (!sim || plan !== planOf(s)) regrow(s, stage);
      else if (reduced && !F.finished(sim, QUIET_SETTLE) && sim.sites.length) growQuietly(stage);
    },

    step(dt, s, stage) {
      if (!sim || quiet) return;
      if (plan !== planOf(s)) regrow(s, stage);
      if (!sim.sites.length) return;
      // With reduced motion the quiet computation stopped earlier; Play then shouldn't grow on under its result.
      const settleFor = reduced ? QUIET_SETTLE : undefined;
      if (F.finished(sim, settleFor)) return settle(s);
      // Growth follows the real time since the last step, not the stage's dt, which is capped per frame:
      // at 15 frames a second the ridges should still spread at the chosen speed if the device can manage it.
      const now = performance.now(),
        real = lastStep && now - lastStep < 250 ? (now - lastStep) / 1000 : dt;
      lastStep = now;
      owed += real * RATES[s.speed - 1];
      let n = Math.floor(owed);
      owed -= n;
      // The budget: a few ms a frame always, and on slow devices (long frames) a share of the frame's time.
      const budget = Math.max(BUDGET, real * 1000 * SHARE);
      const cap = Math.max(1, Math.floor(budget / perf.msPerStep));
      if (n > cap) {
        n = cap;
        owed = 0;
      }
      if (!n) return;
      const t0 = performance.now();
      // One step at a time, so growth stops on exactly the step a replay of the same settings would.
      for (let k = 0; k < n && !F.finished(sim, settleFor); k++) F.advance(sim, 1);
      perf.simMs = performance.now() - t0;
      perf.msPerStep = perf.msPerStep * 0.9 + (perf.simMs / n) * 0.1;
      perf.stepsPerFrame = n;
    },

    draw,
    preview,
    perf,

    /** "Grow again": the same plan, with new tiny differences, like an identical twin. */
    action(s, stage) {
      s.twin = (s.twin + 1) % 1000;
      regrow(s, stage); // while paused, only the head start grows, and the rest waits for Play
      stage.sync();
      stage.draw();
    },
    reset: regrow,
    onPreset(s, stage) {
      clearSeeds(s);
      regrow(s, stage);
    },
    onInput(s, stage) {
      if (plan !== planOf(s)) regrow(s, stage);
    },

    pointer: {
      down(p, s, stage) {
        const f = toFinger(p, stage);
        if (f) plant(s, stage, f.x, f.y);
      },
      move(p, { mouse, dragging }, s, stage) {
        hover = mouse && !dragging ? toFinger(p, stage) : null;
        if (!stage.playing) stage.draw();
      },
      leave() {
        hover = null;
      },
      escape: () => (aim = null),
      arrow(dx, dy) {
        aim ??= { x: 0.5, y: 0.45 };
        aim = { x: clamp(aim.x + dx * 0.03, 0.05, 0.95), y: clamp(aim.y + dy * 0.022, 0.03, 0.97) };
      },
      key(e, s, stage) {
        if (e.key !== 'Enter') return false;
        aim ??= { x: 0.5, y: 0.45 };
        plant(s, stage, aim.x, aim.y);
        return true;
      },
    },
  });
})();
