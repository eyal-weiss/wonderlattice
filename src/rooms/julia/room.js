/* Room · A seed for an infinite landscape: a Julia set that changes live as the seed moves on the Mandelbrot map. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, clamp, TAU } = W;
  const M = W.models.julia;
  const t = W.text('julia');
  const reduced = W.prefersReducedMotion();

  // What each picture shows, in complex coordinates.
  const JULIA_VIEW = { cx: 0, cy: 0, half: 1.6 }; // a square
  const MAP_VIEW = { x0: -2.25, x1: 0.75, y0: -1.25, y1: 1.25 }; // 3 wide, 2.5 tall
  const MAP_ASPECT = (MAP_VIEW.x1 - MAP_VIEW.x0) / (MAP_VIEW.y1 - MAP_VIEW.y0);

  // Pictures are drawn in passes, coarse to fine; while the seed moves, only the first, quick pass,
  // sized by a pixel budget so it stays smooth on phones and sharp enough on large screens.
  const MOVING_PIXELS = { phone: 9000, desktop: 40000 };
  const WALK_FPS = 24; // while the seed walks, the landscape is redrawn at most this often
  function passesFor(w, h) {
    const first = Math.min(1, Math.sqrt((smallScreen() ? MOVING_PIXELS.phone : MOVING_PIXELS.desktop) / (w * h)));
    const passes = [{ scale: first, steps: 48 }];
    if (first < 0.5) passes.push({ scale: 0.5, steps: 130 });
    if (first < 1) passes.push({ scale: 1, steps: 200 });
    return passes;
  }
  const SETTLE = 0.18; // seconds of stillness before the finer passes start
  const BUDGET = 7; // milliseconds of drawing per animation frame, so the page stays responsive
  const WALK_TIME = 48; // seconds for the seed to walk once round the edge of the map's main body
  const GLIDE_TIME = 1.2; // seconds to glide from where the seed is onto that walk
  const REVEAL_RATE = 9; // journey steps shown per second while it plays
  const JOURNEY_STEPS = 60;

  const COLORS = {
    background: '#0a0e15',
    frame: '#223044',
    label: '#a7b4c6',
    ink: '#f4f5e9',
    seed: '#ddf6a3',
    inside: '#ddf6a3',
    outside: '#f7b27a',
    journey: '#ffffff',
  };

  /** A colour ramp as a lookup table of packed RGBA pixels (little-endian: 0xAABBGGRR). */
  function ramp(stops) {
    const table = new Uint32Array(1024);
    const rgb = stops.map(([at, hex]) => [at, [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))]);
    for (let i = 0; i < table.length; i++) {
      const u = i / (table.length - 1);
      let k = 0;
      while (k < rgb.length - 2 && u > rgb[k + 1][0]) k++;
      const [a, ca] = rgb[k],
        [b, cb] = rgb[k + 1];
      const f = clamp((u - a) / (b - a), 0, 1);
      const [r, g, bl] = ca.map((c, j) => Math.round(c + (cb[j] - c) * f));
      table[i] = (255 << 24) | (bl << 16) | (g << 8) | r;
    }
    return table;
  }
  const pack = (hex) =>
    ramp([
      [0, hex],
      [1, hex],
    ])[0];
  // The landscape: dark far away, glowing where points hesitate near the coast.
  const JULIA_RAMP = ramp([
    [0, '#070a10'],
    [0.22, '#0f1f37'],
    [0.4, '#1b5474'],
    [0.55, '#2f9b98'],
    [0.68, '#8fdca0'],
    [0.8, '#e2f8b8'],
    [0.9, '#fff9e2'],
    [1, '#ffffff'],
  ]);
  const JULIA_INSIDE = pack('#05070b');
  // The map: the set itself dark, with a quieter glow around it.
  const MAP_RAMP = ramp([
    [0, '#0d131d'],
    [0.45, '#17263a'],
    [0.75, '#2e6b78'],
    [0.92, '#8fd3b4'],
    [1, '#e8f7d8'],
  ]);
  const MAP_INSIDE = pack('#040609');

  /** The colour for a smooth escape count, brighter the longer the point hesitated. */
  const shade = (table, v, steps) =>
    table[Math.min(table.length - 1, Math.floor((Math.log1p(v) / Math.log1p(steps)) * (table.length - 1)))];

  let room = null,
    layout = null, // the geometry of the last frame, for the pointer
    grabbing = null, // 'seed' or 'point' while the pointer drags
    walking = false, // the seed walks along the edge of the map's main body
    walk = { angle: 0, glide: null },
    reveal = Infinity, // journey steps shown so far
    firstVisit = true,
    lastMove = -Infinity, // when the seed last moved (performance.now), for the finer passes
    spokenInside = null,
    settleTimer = 0,
    pumping = false;

  /** One picture, drawn in passes: each pass has its own canvas, and the finest finished one is shown. */
  const picture = (kind) => ({ kind, key: '', done: -1, working: 0, row: 0, passes: [], params: null });
  const pictures = { julia: picture('julia'), map: picture('map') };

  const now = () => performance.now();
  const smallScreen = () => Math.min(window.innerWidth, window.innerHeight) < 700;
  const density = () => Math.min(devicePixelRatio || 1, smallScreen() ? 1.5 : 2);

  /** Where things go: the landscape large on the left, the map of seeds on the right (or below, when tall). */
  function measure(w, h) {
    const small = Math.round(clamp(Math.min(w, h) / 34, 10, 13));
    const pad = clamp(Math.min(w, h) * 0.035, 8, 18);
    const labelH = small + 8;
    let julia, map;
    if (w >= h * 0.8) {
      const size = Math.min(h - 2 * pad - labelH, (w - 3 * pad) * 0.64);
      julia = { x: pad, y: pad + labelH, w: size, h: size };
      let mw = w - size - 3 * pad,
        mh = mw / MAP_ASPECT;
      const space = h - 2 * pad - labelH - (small + 4) * 2.6;
      if (mh > space) [mh, mw] = [space, space * MAP_ASPECT];
      map = { x: julia.x + size + pad, y: pad + labelH, w: mw, h: mh };
    } else {
      const size = Math.min(w - 2 * pad, (h - 3 * pad - 2 * labelH) * 0.62);
      julia = { x: (w - size) / 2, y: pad + labelH, w: size, h: size };
      const mh = Math.min(h - size - 3 * pad - 2 * labelH - (small + 4) * 2, (w - 2 * pad) / MAP_ASPECT);
      map = { x: (w - mh * MAP_ASPECT) / 2, y: julia.y + size + pad + labelH, w: mh * MAP_ASPECT, h: mh };
    }
    // Centre the pictures (and the words under the map) in the height the canvas has.
    const bottom = Math.max(julia.y + julia.h, map.y + map.h + (small + 6) * 2.3);
    const dy = Math.max(0, (h - pad - bottom) / 2);
    julia.y += dy;
    map.y += dy;
    return { w, h, small, pad, julia, map };
  }

  /** Write text no wider than `width`, shrinking the font (down to 9 px) when it would not fit. */
  function fitText(ctx, text, x, y, width, size, weight = 400) {
    let px = size;
    do ctx.font = `${weight} ${px}px system-ui`;
    while (ctx.measureText(text).width > width && --px > 9);
    ctx.fillText(text, x, y);
  }

  const juliaAt = (L, [x, y]) => {
    const s = (2 * JULIA_VIEW.half) / L.julia.w;
    return [
      JULIA_VIEW.cx - JULIA_VIEW.half + (x - L.julia.x) * s,
      JULIA_VIEW.cy + JULIA_VIEW.half - (y - L.julia.y) * s,
    ];
  };
  const juliaPx = (L, [zx, zy]) => {
    const s = L.julia.w / (2 * JULIA_VIEW.half);
    return [
      L.julia.x + (zx - JULIA_VIEW.cx + JULIA_VIEW.half) * s,
      L.julia.y + (JULIA_VIEW.cy + JULIA_VIEW.half - zy) * s,
    ];
  };
  const mapAt = (L, [x, y]) => [
    MAP_VIEW.x0 + ((x - L.map.x) / L.map.w) * (MAP_VIEW.x1 - MAP_VIEW.x0),
    MAP_VIEW.y1 - ((y - L.map.y) / L.map.h) * (MAP_VIEW.y1 - MAP_VIEW.y0),
  ];
  const mapPx = (L, [cx, cy]) => [
    L.map.x + ((cx - MAP_VIEW.x0) / (MAP_VIEW.x1 - MAP_VIEW.x0)) * L.map.w,
    L.map.y + ((MAP_VIEW.y1 - cy) / (MAP_VIEW.y1 - MAP_VIEW.y0)) * L.map.h,
  ];
  const inside = (r, x, y, margin = 0) =>
    x >= r.x - margin && x <= r.x + r.w + margin && y >= r.y - margin && y <= r.y + r.h + margin;

  // ---------- drawing the pictures, pass by pass ----------

  function passCanvas(pic, i, w, h) {
    let p = pic.passes[i];
    if (!p || p.w !== w || p.h !== h) {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      const image = ctx.createImageData(w, h);
      p = pic.passes[i] = { canvas, ctx, image, pixels: new Uint32Array(image.data.buffer), w, h };
    }
    return p;
  }

  /** Point the picture at new settings or a new size; the first pass is drawn at once. */
  function target(pic, key, params) {
    if (pic.key === key) return;
    pic.key = key;
    pic.params = params;
    pic.done = -1;
    pic.working = 0;
    pic.row = 0;
    pic.plan = passesFor(params.w, params.h);
    work(pic, Infinity); // the coarse pass is quick
    schedule();
  }

  /** Draw rows of the pass being worked on until `until` (a performance.now time). Returns true when done. */
  function work(pic, until) {
    const P = pic.params;
    while (pic.working < pic.plan.length) {
      const pass = pic.plan[pic.working];
      const w = Math.max(8, Math.round(P.w * pass.scale)),
        h = Math.max(8, Math.round(P.h * pass.scale));
      const c = passCanvas(pic, pic.working, w, h);
      const { pixels } = c;
      for (; pic.row < h; pic.row++) {
        const y = pic.row;
        for (let x = 0; x < w; x++) {
          const [re, im] = P.at((x + 0.5) / w, (y + 0.5) / h);
          let colour;
          if (pic.kind === 'julia') {
            const v = M.escape(re, im, P.cx, P.cy, pass.steps);
            colour = v < 0 ? JULIA_INSIDE : shade(JULIA_RAMP, v, pass.steps);
          } else {
            const v = M.inBody(re, im) ? -1 : M.escape(0, 0, re, im, pass.steps);
            colour = v < 0 ? MAP_INSIDE : shade(MAP_RAMP, v, pass.steps);
          }
          pixels[y * w + x] = colour;
        }
        if (pic.row % 4 === 3 && now() > until) {
          pic.row++;
          return false;
        }
      }
      c.ctx.putImageData(c.image, 0, 0);
      pic.done = pic.working;
      pic.working++;
      pic.row = 0;
      // Only the first pass is drawn straight away; the rest wait for the frame budget.
      if (until === Infinity) return false;
    }
    return true;
  }

  /** Keep drawing finer passes in small slices, once the seed has been still for a moment. */
  function schedule() {
    if (pumping) return;
    pumping = true;
    requestAnimationFrame(pump);
  }
  function pump() {
    if (!room || !W.stage.isShowing(room)) return void (pumping = false);
    const moving = walking && W.stage.playing;
    let busy = false;
    if (!moving && !grabbing && now() - lastMove > SETTLE * 1000) {
      const until = now() + BUDGET;
      for (const pic of [pictures.map, pictures.julia]) if (pic.params && !work(pic, until)) busy = true;
      if (!W.stage.playing) W.stage.draw();
    } else busy = true;
    if (busy) requestAnimationFrame(pump);
    else pumping = false;
  }

  /** Aim both pictures at the current seed and canvas size. */
  function ensure(s, L) {
    const d = density();
    const jw = Math.max(16, Math.round(L.julia.w * d));
    const half = JULIA_VIEW.half;
    const key = `${s.cx},${s.cy},${jw}`;
    // While the seed walks, keep the last landscape for a few frames rather than redrawing it every frame.
    const pic = pictures.julia;
    if (
      walking &&
      W.stage.playing &&
      pic.passes.length &&
      pic.key.endsWith(`,${jw}`) &&
      now() - pic.at < 1000 / WALK_FPS
    )
      return;
    pic.at = now();
    target(pic, key, {
      w: jw,
      h: jw,
      cx: s.cx,
      cy: s.cy,
      at: (u, v) => [JULIA_VIEW.cx - half + u * 2 * half, JULIA_VIEW.cy + half - v * 2 * half],
    });
    const mw = Math.max(16, Math.round(L.map.w * d)),
      mh = Math.max(16, Math.round(L.map.h * d));
    target(pictures.map, `${mw}x${mh}`, {
      w: mw,
      h: mh,
      at: (u, v) => [MAP_VIEW.x0 + u * (MAP_VIEW.x1 - MAP_VIEW.x0), MAP_VIEW.y1 - v * (MAP_VIEW.y1 - MAP_VIEW.y0)],
    });
  }

  function blit(ctx, pic, r) {
    const pass = pic.passes[pic.done];
    if (!pass) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(pass.canvas, r.x, r.y, r.w, r.h);
  }

  // ---------- the scene ----------

  const fmt = (v, digits) =>
    (Math.abs(v) < 0.5 * 10 ** -digits ? '0' : v.toFixed(digits).replace(/0+$/, '').replace(/\.$/, '')).replace(
      '-',
      '−',
    );
  /** A complex number, written the usual way: −0.123 + 0.745i. */
  function complex(re, im, digits = 3) {
    const a = fmt(re, digits),
      b = fmt(Math.abs(im), digits);
    if (b === '0') return a;
    const imaginary = `${b === '1' ? '' : b}i`;
    if (a === '0') return (im < 0 ? '−' : '') + imaginary;
    return `${a} ${im < 0 ? '−' : '+'} ${imaginary}`;
  }
  const seedInside = (s) => M.inMandelbrot(s.cx, s.cy, 400);
  const journeyOf = (s) => M.orbit(s.zx, s.zy, s.cx, s.cy, JOURNEY_STEPS);

  function draw(ctx, s, stage) {
    const L = (layout = measure(stage.width, stage.height));
    ensure(s, L);
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, L.w, L.h);
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = COLORS.label;
    ctx.textAlign = 'left';
    fitText(ctx, t.labels.julia, L.julia.x, L.julia.y - 7, L.julia.w, L.small, 600);
    fitText(ctx, t.labels.map, L.map.x, L.map.y - 7, L.w - L.map.x - L.pad / 2, L.small, 600);

    // The landscape, then the journey on top of it.
    blit(ctx, pictures.julia, L.julia);
    ctx.save();
    ctx.beginPath();
    ctx.rect(L.julia.x, L.julia.y, L.julia.w, L.julia.h);
    ctx.clip();
    if (s.journey) drawJourney(ctx, s, L);
    ctx.restore();
    ctx.strokeStyle = COLORS.frame;
    ctx.lineWidth = 1;
    ctx.strokeRect(L.julia.x + 0.5, L.julia.y + 0.5, L.julia.w - 1, L.julia.h - 1);

    // The map of seeds, with the walk and the seed.
    blit(ctx, pictures.map, L.map);
    ctx.strokeStyle = COLORS.frame;
    ctx.strokeRect(L.map.x + 0.5, L.map.y + 0.5, L.map.w - 1, L.map.h - 1);
    ctx.save();
    ctx.beginPath();
    ctx.rect(L.map.x, L.map.y, L.map.w, L.map.h);
    ctx.clip();
    if (walking) {
      ctx.setLineDash([2, 4]);
      ctx.strokeStyle = 'rgba(221, 246, 163, 0.35)';
      ctx.beginPath();
      for (let k = 0; k <= 120; k++) {
        const [x, y] = mapPx(L, M.cardioid((k / 120) * TAU));
        k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
    const [sx, sy] = mapPx(L, [s.cx, s.cy]);
    ctx.strokeStyle = 'rgba(221, 246, 163, 0.25)';
    ctx.beginPath();
    ctx.moveTo(L.map.x, sy);
    ctx.lineTo(L.map.x + L.map.w, sy);
    ctx.moveTo(sx, L.map.y);
    ctx.lineTo(sx, L.map.y + L.map.h);
    ctx.stroke();
    const r = clamp(L.map.w * 0.03, 4.5, 8);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(5, 7, 11, 0.9)';
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, TAU);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = COLORS.seed;
    ctx.stroke();
    ctx.fillStyle = COLORS.seed;
    ctx.beginPath();
    ctx.arc(sx, sy, 1.8, 0, TAU);
    ctx.fill();
    ctx.restore();

    // Under the map: the seed, and whether its landscape is one piece or dust.
    const inside = seedInside(s);
    let y = L.map.y + L.map.h + L.small + 8;
    const space = L.w - L.map.x - L.pad / 2;
    ctx.textAlign = 'left';
    ctx.fillStyle = COLORS.ink;
    // On the narrowest screens, two decimals instead of three, so the seed fits beside the landscape.
    ctx.font = `10px system-ui`;
    const wide = ctx.measureText(t.seed(complex(s.cx, s.cy))).width > space;
    fitText(ctx, t.seed(complex(s.cx, s.cy, wide ? 2 : 3)), L.map.x, y, space, L.small);
    y += L.small + 6;
    ctx.fillStyle = inside ? COLORS.inside : COLORS.outside;
    fitText(ctx, inside ? t.onePiece : t.dust, L.map.x, y, space, L.small, 700);
  }

  /** One point's journey over the landscape: each step joined to the next, fading as it goes. */
  function drawJourney(ctx, s, L) {
    const { points, escaped } = journeyOf(s);
    const shown = Math.min(points.length - 1, Math.floor(reveal));
    const px = points.map((p) => juliaPx(L, p));
    ctx.lineWidth = 1.4;
    for (let i = 1; i <= shown; i++) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0.25, 0.9 - i * 0.012)})`;
      ctx.beginPath();
      ctx.moveTo(...px[i - 1]);
      ctx.lineTo(...px[i]);
      ctx.stroke();
    }
    for (let i = 1; i <= shown; i++) {
      ctx.fillStyle = i === shown && escaped && shown === points.length - 1 ? COLORS.outside : COLORS.journey;
      ctx.beginPath();
      ctx.arc(...px[i], i === shown ? 3 : 2, 0, TAU);
      ctx.fill();
    }
    // The starting point: a ring.
    ctx.lineWidth = 2;
    ctx.strokeStyle = COLORS.seed;
    ctx.beginPath();
    ctx.arc(...px[0], 5, 0, TAU);
    ctx.stroke();
  }

  // ---------- words ----------

  function readouts(s) {
    // The seed also moves by dragging, arrow keys, and walking: keep the two sliders on it.
    for (const key of ['cx', 'cy']) {
      const input = $('c-' + key);
      if (input && Number(input.value) !== s[key]) input.value = s[key];
    }
    const inside = seedInside(s);
    $('scene-status').textContent = t.status(inside);
    const preset = presets.findIndex(
      (p) => Math.abs(p.settings.cx - s.cx) < 5e-4 && Math.abs(p.settings.cy - s.cy) < 5e-4,
    );
    $('scene-name').textContent = preset >= 0 ? presets[preset].name : t.yourOwn;
    const box = $('julia-readout');
    if (!box) return;
    const journey = journeyOf(s);
    const rows = [
      [t.readout.seed, t.seed(complex(s.cx, s.cy))],
      [t.readout.landscape, t.landscape(inside)],
      [
        t.readout.journey,
        !s.journey ? t.orbitHint : journey.escaped ? t.escapes(journey.steps) : t.stays(JOURNEY_STEPS),
      ],
    ];
    const html = rows.map(([k, v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join('');
    if (box.innerHTML !== html) box.innerHTML = html; // readouts run every frame while the seed walks
  }

  /** Say whether the landscape is one piece or dust, once the seed has settled. */
  function settle(s) {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      const inside = seedInside(s);
      if (inside !== spokenInside) W.announce(t.landscape(inside));
      spokenInside = inside;
    }, 500);
  }

  function moved() {
    lastMove = now();
    schedule();
  }

  function setSeed(s, [cx, cy]) {
    s.cx = Math.round(clamp(cx, MAP_VIEW.x0, MAP_VIEW.x1) * 10000) / 10000;
    s.cy = Math.round(clamp(cy, MAP_VIEW.y0, MAP_VIEW.y1) * 10000) / 10000;
    W.stage.setChosen(-1);
    moved();
  }

  function setPoint(s, [zx, zy]) {
    s.zx = Math.round(clamp(zx, -2, 2) * 10000) / 10000;
    s.zy = Math.round(clamp(zy, -2, 2) * 10000) / 10000;
    s.journey = true;
    const box = document.querySelector('#scene-controls [data-check="journey"]');
    if (box) box.checked = true;
    reveal = reduced || !W.stage.playing ? Infinity : 0;
  }

  function stopWalking() {
    walking = false;
    walk.glide = null;
  }

  function startWalking(s, stage) {
    // Start the walk at the point of the edge nearest the seed, and glide there.
    let best = 0,
      bestD = Infinity;
    for (let k = 0; k < 360; k++) {
      const a = (k / 360) * TAU;
      const [x, y] = M.cardioid(a);
      const d = (x - s.cx) ** 2 + (y - s.cy) ** 2;
      if (d < bestD) [best, bestD] = [a, d];
    }
    walk = { angle: best, glide: { from: [s.cx, s.cy], elapsed: 0 } };
    walking = true;
    if (!stage.playing) stage.setPlaying(true);
    stage.sync();
  }

  function controls(s, stage) {
    return (
      stage.slider('cx', t.re, MAP_VIEW.x0, MAP_VIEW.x1, 0.001, s.cx, '', t.reHint) +
      stage.slider('cy', t.im, MAP_VIEW.y0, MAP_VIEW.y1, 0.001, s.cy, '', t.imHint) +
      stage.check('journey', t.journey, s.journey) +
      '<div class="wide readout julia-readout" id="julia-readout"></div>'
    );
  }

  /**
   * The home card: the rabbit, drawn once, small. Pixels go to a canvas at the screen's real resolution first,
   * then drawn in: putImageData ignores the card's scaling, so on a sharp screen it filled only a corner.
   */
  function preview(ctx, width, height) {
    const [cx, cy] = [presets[0].settings.cx, presets[0].settings.cy];
    const scale = ctx.getTransform?.().a || 1;
    const w = Math.round(width * scale),
      h = Math.round(height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const off = canvas.getContext('2d');
    const image = off.createImageData(w, h);
    const pixels = new Uint32Array(image.data.buffer);
    const s = (2.5 * JULIA_VIEW.half) / w;
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const v = M.escape((x - w / 2) * s, (h / 2 - y) * s, cx, cy, 120);
        pixels[y * w + x] = v < 0 ? JULIA_INSIDE : shade(JULIA_RAMP, v, 120);
      }
    off.putImageData(image, 0, 0);
    ctx.drawImage(canvas, 0, 0, width, height);
  }

  const defaults = { cx: -0.123, cy: 0.745, zx: 0.32, zy: 0.28, journey: false };
  const presetSettings = [
    { cx: -0.123, cy: 0.745 }, // the Douady rabbit, in the period-3 bulb
    { cx: 0, cy: 1 }, // c = i: a dendrite
    { cx: -0.75, cy: 0 }, // San Marco, where the period-2 disc meets the main body
    { cx: -0.3905, cy: -0.5868 }, // a Siegel disc: rotation by the golden mean
    { cx: -0.8, cy: 0.18 }, // just outside: dust
  ];
  const badges = ['3', 'i', '−¾', 'φ', '∴'];
  const presets = t.presets.map((p, i) => ({ ...p, badge: badges[i], settings: presetSettings[i] }));
  const isDefault = (s) => Object.keys(defaults).every((k) => s[k] === defaults[k]);

  room = W.defineRoom({
    id: 'julia',
    symbol: '𝒥',
    theme: 'shape',
    added: '2026-09-27',
    eyebrow: t.eyebrow,
    name: t.name,
    tagline: t.tagline,
    accent: { background: '#16222c', border: '#8fd3b4', color: '#d8f5e4' },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.sceneLabel,
    sceneName: t.presets[0].name,
    tip: t.tip,
    actionLabel: t.actionLabel,
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { ...t.connection, go: 'plane' },

    defaults,
    ranges: {
      cx: [MAP_VIEW.x0, MAP_VIEW.x1],
      cy: [MAP_VIEW.y0, MAP_VIEW.y1],
      zx: [-2, 2],
      zy: [-2, 2],
    },
    defaultPreset: 0,
    presets,

    guests: [
      {
        ...t.guests[0],
        bio: 'Julia',
        color: '#8fd3b4',
        sketch: {
          hairStyle: 'swept',
          hair: '#2b2521',
          moustache: true,
          skin: '#efcfb4',
          brows: 'bold',
          backdrop: '#dde7e4',
        },
      },
      {
        ...t.guests[1],
        bio: 'Mandelbrot',
        color: '#f7b27a',
        sketch: { hairStyle: 'bald', hair: '#b9b1a7', glasses: 'square', skin: '#eac6a8', backdrop: '#e9e1d6' },
      },
    ],

    insight: t.insight,

    controls,
    readouts,
    draw,
    preview,

    enter(s, stage) {
      grabbing = null;
      spokenInside = null;
      // The first visit, with nothing shared, opens with the seed walking the edge.
      const fresh = firstVisit && !reduced && isDefault(s);
      firstVisit = false;
      walking = false;
      if (fresh && stage.playing) startWalking(s, stage);
      reveal = Infinity;
      schedule();
    },

    step(dt, s, stage) {
      if (walking && !grabbing) {
        walk.angle = (walk.angle + (dt * TAU) / WALK_TIME) % TAU;
        let [cx, cy] = M.cardioid(walk.angle);
        if (walk.glide) {
          walk.glide.elapsed += dt;
          const f = Math.min(1, walk.glide.elapsed / GLIDE_TIME);
          const e = f * f * (3 - 2 * f);
          cx = walk.glide.from[0] + (cx - walk.glide.from[0]) * e;
          cy = walk.glide.from[1] + (cy - walk.glide.from[1]) * e;
          if (f >= 1) walk.glide = null;
        }
        s.cx = Math.round(cx * 10000) / 10000;
        s.cy = Math.round(cy * 10000) / 10000;
        stage.setChosen(-1);
        lastMove = now();
        stage.sync();
      }
      if (s.journey && reveal < JOURNEY_STEPS) reveal += dt * REVEAL_RATE;
    },

    onInput(s) {
      stopWalking();
      moved();
      settle(s);
    },

    onPreset(s) {
      stopWalking();
      moved();
      settle(s);
    },

    /** "Walk the edge": the seed walks round the main body of the map, and the landscape changes as it goes. */
    action(s, stage) {
      startWalking(s, stage);
    },

    reset(s, stage) {
      Object.assign(s, defaults);
      stage.setChosen(0);
      stage.refresh();
      startWalking(s, stage);
    },

    pointer: {
      // Fingers drag the seed on the map and the journey on the landscape; elsewhere they scroll the page.
      drag: (p, s, stage) => {
        const L = layout ?? measure(stage.width, stage.height);
        const x = p.x * stage.width,
          y = p.y * stage.height;
        return inside(L.map, x, y, 10) || inside(L.julia, x, y);
      },
      down(p, s, stage) {
        if (!layout) return;
        const q = [p.x * stage.width, p.y * stage.height];
        if (inside(layout.map, ...q, 10)) {
          grabbing = 'seed';
          stopWalking();
          setSeed(s, mapAt(layout, q));
        } else if (inside(layout.julia, ...q)) {
          grabbing = 'point';
          setPoint(s, juliaAt(layout, q));
        } else return;
        stage.sync();
        stage.draw();
      },
      move(p, { dragging }, s, stage) {
        if (!layout || !grabbing || !dragging) return;
        const q = [p.x * stage.width, p.y * stage.height];
        if (grabbing === 'seed') setSeed(s, mapAt(layout, q));
        else setPoint(s, juliaAt(layout, q));
        stage.sync();
        stage.draw();
      },
      up() {
        const s = W.stage.settingsFor('julia');
        if (grabbing === 'seed') settle(s);
        if (grabbing === 'point') {
          const j = journeyOf(s);
          W.announce(j.escaped ? t.escapes(j.steps) : t.stays(JOURNEY_STEPS));
        }
        grabbing = null;
        moved();
      },
      /** Arrow keys move the seed in small steps across the map. */
      arrow(dx, dy, s, stage) {
        stopWalking();
        setSeed(s, [s.cx + dx * 0.01, s.cy - dy * 0.01]);
        settle(s);
        stage.sync();
      },
      /** Enter shows or hides one point's journey. */
      key(e, s, stage) {
        if (e.key !== 'Enter') return false;
        s.journey = !s.journey;
        if (s.journey) setPoint(s, [s.zx, s.zy]);
        stage.refresh();
        return true;
      },
      escape() {
        const s = W.stage.settingsFor('julia');
        s.journey = false;
        W.stage.refresh();
        W.stage.draw();
      },
    },
  });
})();
