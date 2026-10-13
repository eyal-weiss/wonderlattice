/* Room · Circles all the way down: the Apollonian gasket, where every circle's bend is a whole number. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, clamp, TAU } = W;
  const M = W.models.gasket;
  const t = W.text('gasket');
  const reduced = W.prefersReducedMotion();

  const SMALLEST = 0.5; // pixels: smaller circles aren't drawn, though the real gasket goes on for ever
  const MOST_ZOOM = 1e6;
  const WHOLE = 1.02; // up to this magnification the whole gasket shows, and a drag resizes a starting circle
  const STEP_ZOOM = 1.6; // + and − magnify or shrink by this much
  const WAVE = (generation) => 0.9 * generation ** 0.75; // seconds until a generation of circles appears
  const FADE = 0.45; // seconds each generation takes to fade in
  const FIRST_DIVE = 8.5; // seconds after a first visit opens, once the gasket has grown, it dives in by itself
  const DIVE = { in: 10, hold: 2.5, out: 3, depth: 2500 }; // seconds for each part, and how much it magnifies
  // Where the dives from the whole picture head for, in turn (the big circle's radius is 1).
  const AIMS = [
    { x: 0.42, y: 0.4 },
    { x: -0.3, y: -0.78 },
    { x: -0.62, y: 0.55 },
    { x: 0.7, y: -0.45 },
  ];

  const COLORS = {
    background: '#0a0e15',
    disc: '#0e1420',
    rim: '#e7c46a',
    ink: '#eef2f8',
    label: '#a7b4c6',
    chosen: '#f2c14e',
    chosenInk: '#1b1406',
    touches: '#7fe0ff',
    touchesFill: '#1d4a5e',
    other: '#ff8f7a',
    backing: 'rgba(10, 14, 21, 0.84)',
  };
  // Circles are tinted by the size of their bend, round a wheel of quiet colours that turns once each time the bend
  // grows sixteenfold, so a dive keeps changing colour.
  const FILLS = ['#14304a', '#1e2552', '#2c1f4c', '#132f3a'];
  const RIMS = ['#4f8cb0', '#6f73c0', '#9068b0', '#4f9a9a'];
  const TONES = Array.from({ length: 48 }, (_, i) => {
    const u = (i / 48) * FILLS.length,
      k = Math.floor(u),
      f = u - k;
    const mix = (list) => {
      const [p, q] = [list[k], list[(k + 1) % list.length]].map((hex) =>
        [1, 3, 5].map((j) => parseInt(hex.slice(j, j + 2), 16)),
      );
      return `rgb(${p.map((c, j) => Math.round(c + (q[j] - c) * f)).join(', ')})`;
    };
    return { fill: mix(FILLS), rim: mix(RIMS) };
  });
  const toneOf = (bend, k) => {
    const turn = Math.log2(Math.max(1, Math.abs(bend) / k)) / 4;
    return TONES[Math.floor((turn - Math.floor(turn)) * TONES.length) % TONES.length];
  };

  let room = null,
    layout = null, // the geometry of the last frame, for the pointer
    cache = { key: '', circles: [], last: 0 }, // the circles drawn, and the highest generation among them
    chosen = null, // the tapped circle, the three it touches and the one across: copies, so they outlive redrawing
    keyIndex = -1, // Enter steps through the circles on show, biggest first
    growth = Infinity, // seconds since the gasket began to grow, or Infinity once it has
    opened = 0, // seconds since the room opened, while playing
    firstVisit = true,
    autoDive = false, // the first visit dives in by itself once the gasket has grown
    dive = null, // { phase: 'in' | 'hold' | 'out', time, target, from, to, deep }
    dives = 0,
    press = null, // a pointer pressed on the picture, until it lifts
    pinch = null, // two fingers on the picture
    bound = false,
    told = 0, // when the panel's summary was last written
    catchUp = 0; // a timer to write it once more, after the last change

  // ---------- where things are ----------

  /** The big circle fills the shorter side of the canvas; `unit` is its radius in pixels before any zoom. */
  function measure(w, h) {
    const pad = clamp(Math.min(w, h) * 0.03, 6, 16);
    return {
      w,
      h,
      pad,
      cx: w / 2,
      cy: h / 2,
      unit: (Math.min(w, h) - 2 * pad) / 2,
      small: Math.round(clamp(Math.min(w, h) / 34, 10, 13)),
    };
  }
  const scaleOf = (L, s) => L.unit * s.zoom;
  const toScreen = (L, s, x, y) => [L.cx + (x - s.vx) * scaleOf(L, s), L.cy - (y - s.vy) * scaleOf(L, s)];
  const toWorld = (L, s, X, Y) => [s.vx + (X - L.cx) / scaleOf(L, s), s.vy - (Y - L.cy) / scaleOf(L, s)];

  /** The circles to draw for these settings and this canvas, grown again only when something changed. */
  function circlesFor(L, s) {
    const key = [s.k, s.a, s.b, s.vx, s.vy, s.zoom, L.w, L.h].join();
    if (cache.key === key) return cache.circles;
    const [x0, y1] = toWorld(L, s, -2, -2),
      [x1, y0] = toWorld(L, s, L.w + 2, L.h + 2);
    const circles = M.grow(s.k, s.a, s.b, { view: { x0, y0, x1, y1 }, smallest: SMALLEST / scaleOf(L, s) });
    cache = { key, circles, last: circles.reduce((g, c) => Math.max(g, c.generation), 0) };
    return circles;
  }

  /** Whether a circle shows on the canvas, and isn't too small to see. */
  function onScreen(L, s, c) {
    const r = c.r * scaleOf(L, s);
    if (r < SMALLEST) return false;
    const [x, y] = toScreen(L, s, c.x, c.y);
    return x + r > 0 && x - r < L.w && y + r > 0 && y - r < L.h;
  }

  /** Keep the view on the gasket: the whole of it at magnification 1, and its centre inside the big circle. */
  function keepInView(s) {
    s.zoom = clamp(s.zoom, 1, MOST_ZOOM);
    const most = Math.max(0, 1 - 1 / s.zoom),
      d = Math.hypot(s.vx, s.vy);
    if (d > most) {
      s.vx = d ? (s.vx * most) / d : 0;
      s.vy = d ? (s.vy * most) / d : 0;
    }
  }

  // ---------- numbers ----------

  let formats = null;
  /** A bend as the page's language writes numbers: whole, or with two decimals; minus signs as − (not -). */
  function bendText(bend) {
    if (formats?.locale !== W.numberLocale)
      formats = {
        locale: W.numberLocale,
        whole: new Intl.NumberFormat(W.numberLocale),
        part: new Intl.NumberFormat(W.numberLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      };
    return (Number.isInteger(bend) ? formats.whole : formats.part).format(bend).replace('-', '−');
  }
  const bracketed = (bend) => (bend < 0 ? `(${bendText(bend)})` : bendText(bend));

  /** The rule behind a tapped circle, in pieces with their colours: 6 = 2 × (−1 + 2 + 3) − 2. */
  function rulePieces(pick) {
    const [p, q, r] = pick.touches.map((c) => bendText(c.bend));
    return [
      [bendText(pick.circle.bend), COLORS.chosen],
      [' = 2 × (', COLORS.ink],
      [p, COLORS.touches],
      [' + ', COLORS.ink],
      [q, COLORS.touches],
      [' + ', COLORS.ink],
      [r, COLORS.touches],
      [') − ', COLORS.ink],
      [bracketed(pick.other.bend), COLORS.other],
    ];
  }
  const ruleText = (pick) =>
    rulePieces(pick)
      .map(([text]) => text)
      .join('');

  // How wide each number is at a font size of one pixel, measured once.
  const widths = new Map();
  function widthOf(ctx, text) {
    let w = widths.get(text);
    if (w === undefined) {
      if (widths.size > 4000) widths.clear();
      ctx.font = '600 100px system-ui';
      w = ctx.measureText(text).width / 100;
      widths.set(text, w);
    }
    return w;
  }

  // ---------- drawing ----------

  /**
   * A circle's outline, ready to fill or stroke. Circles hundreds of times bigger than the canvas are traced as the
   * short piece of them near it, since drawing a whole arc that size loses its accuracy.
   */
  function trace(ctx, L, x, y, r) {
    ctx.beginPath();
    const diagonal = Math.hypot(L.w, L.h);
    if (r < 20 * diagonal) return void ctx.arc(x, y, r, 0, TAU);
    // Holding the whole canvas, it is the whole canvas (and its outline lies beyond the edges).
    const corners = [
      [0, 0],
      [L.w, 0],
      [0, L.h],
      [L.w, L.h],
    ];
    if (corners.every(([u, v]) => Math.hypot(u - x, v - y) < r)) return void ctx.rect(-4, -4, L.w + 8, L.h + 8);
    const towards = Math.atan2(L.cy - y, L.cx - x),
      span = Math.min(Math.PI, (2 * diagonal) / r);
    for (let i = 0; i <= 32; i++) {
      const a = towards - span + (i / 16) * span;
      ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
    }
    // Close the piece well inside the circle, beyond the far side of the canvas.
    for (const a of [towards + span, towards - span])
      ctx.lineTo(x + (r - 2 * diagonal) * Math.cos(a), y + (r - 2 * diagonal) * Math.sin(a));
    ctx.closePath();
  }

  /** Every circle, its tint and its number. `alphaOf(generation)` fades generations in while the gasket grows. */
  function paint(ctx, L, s, circles, alphaOf) {
    const scale = scaleOf(L, s);
    const [ox, oy] = toScreen(L, s, 0, 0);
    ctx.globalAlpha = alphaOf(0);
    ctx.fillStyle = COLORS.disc;
    trace(ctx, L, ox, oy, scale);
    ctx.fill();
    for (let i = 1; i < circles.length; i++) {
      const c = circles[i];
      if (!onScreen(L, s, c)) continue;
      const alpha = alphaOf(c.generation);
      if (!alpha) continue;
      const r = c.r * scale;
      const [x, y] = toScreen(L, s, c.x, c.y);
      const tone = toneOf(c.bend, s.k);
      ctx.globalAlpha = alpha;
      trace(ctx, L, x, y, r);
      ctx.fillStyle = tone.fill;
      ctx.fill();
      if (r > 1.5) {
        ctx.lineWidth = r > 40 ? 1.5 : 1;
        ctx.strokeStyle = tone.rim;
        ctx.stroke();
      }
    }
    ctx.globalAlpha = alphaOf(0);
    ctx.lineWidth = 2;
    ctx.strokeStyle = COLORS.rim;
    trace(ctx, L, ox, oy, scale);
    ctx.stroke();
    for (let i = 1; i < circles.length; i++) number(ctx, L, s, circles[i], alphaOf(circles[i].generation));
    ctx.globalAlpha = 1;
  }

  /**
   * A circle's bend, inside it, as large as fits. A circle whose centre is off the canvas carries its number near
   * its edge facing the middle of the canvas, where it can be seen.
   */
  function number(ctx, L, s, c, alpha, ink = COLORS.ink) {
    const r = c.r * scaleOf(L, s);
    if (r < 7 || !alpha || !onScreen(L, s, c)) return;
    const text = bendText(c.bend);
    const size = Math.min(44, r * 0.72, (1.55 * r) / widthOf(ctx, text));
    if (size < 7) return;
    const [cx, cy] = toScreen(L, s, c.x, c.y);
    let [x, y] = [cx, cy];
    if (x < 0 || x > L.w || y < 0 || y > L.h) {
      const d = Math.hypot(L.cx - x, L.cy - y),
        go = Math.min(d, r - size * 1.6);
      x += ((L.cx - x) / d) * go;
      y += ((L.cy - y) / d) * go;
    }
    // The whole number stays on the canvas, and inside its circle; where it can't, it isn't written.
    const half = (widthOf(ctx, text) * size) / 2;
    x = clamp(x, half + 3, L.w - half - 3);
    y = clamp(y, size * 0.6 + 3, L.h - size * 0.6 - 3);
    if (Math.hypot(x - cx, y - cy) > r - Math.max(half, size * 0.6)) return;
    ctx.globalAlpha = alpha;
    ctx.direction = 'ltr';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `600 ${size.toFixed(1)}px system-ui`;
    ctx.fillStyle = ink;
    ctx.fillText(text, x, y);
    ctx.direction = 'inherit';
  }

  /** The tapped circle in gold, the three it touches in blue, and the one across from it dashed. */
  function highlight(ctx, L, s) {
    if (!chosen) return;
    const scale = scaleOf(L, s);
    const ring = (c, color, width, dash) => {
      const [x, y] = toScreen(L, s, c.x, c.y);
      trace(ctx, L, x, y, c.r * scale);
      ctx.setLineDash(dash);
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.setLineDash([]);
    };
    for (const c of chosen.touches) {
      if (c.bend > 0) {
        const [x, y] = toScreen(L, s, c.x, c.y);
        trace(ctx, L, x, y, c.r * scale);
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = COLORS.touchesFill;
        ctx.fill();
        ctx.globalAlpha = 1;
        number(ctx, L, s, c, 1);
      }
      ring(c, COLORS.touches, 3, []);
    }
    if (chosen.other) ring(chosen.other, COLORS.other, 2.5, [7, 5]);
    const c = chosen.circle;
    if (c.bend > 0) {
      const [x, y] = toScreen(L, s, c.x, c.y);
      trace(ctx, L, x, y, Math.max(c.r * scale, 3));
      ctx.fillStyle = COLORS.chosen;
      ctx.fill();
      number(ctx, L, s, c, 1, COLORS.chosenInk);
    } else ring(c, COLORS.chosen, 4, []);
  }

  /** Words and numbers over the picture: the rule for the tapped circle, the magnification, the big circle's bend. */
  function captions(ctx, L, s) {
    ctx.textBaseline = 'alphabetic';
    // The magnification, top left, once zoomed in.
    if (s.zoom > WHOLE) {
      // One decimal below ten, so the way back out doesn't read ×1 before it gets there.
      const digits = s.zoom < 10 ? 1 : 0;
      const text = t.zoom(new Intl.NumberFormat(W.numberLocale, { maximumFractionDigits: digits }).format(s.zoom));
      ctx.font = `600 ${L.small + 1}px system-ui`;
      ctx.direction = 'ltr';
      const w = ctx.measureText(text).width;
      ctx.fillStyle = COLORS.backing;
      ctx.fillRect(L.pad - 6, L.pad - 4, w + 12, L.small + 10);
      ctx.fillStyle = COLORS.rim;
      ctx.textAlign = 'left';
      ctx.fillText(text, L.pad, L.pad + L.small + 1);
    } else {
      // The big circle's bend, just outside it at the top right, where the corner has room.
      const R = L.unit + 6;
      const x = L.cx + R * Math.SQRT1_2,
        y = L.cy - R * Math.SQRT1_2;
      ctx.textAlign = 'left';
      ctx.direction = 'inherit';
      ctx.font = `${L.small}px system-ui`;
      const word = ctx.measureText(t.bigCircle).width;
      if (x + word < L.w - 2 && y - 2 * L.small - 6 > 0) {
        ctx.fillStyle = COLORS.label;
        ctx.fillText(t.bigCircle, x, y - L.small - 6);
        ctx.font = `600 ${L.small + 4}px system-ui`;
        ctx.direction = 'ltr';
        ctx.fillStyle = COLORS.rim;
        ctx.fillText(bendText(-s.k), x, y);
      }
    }
    // The rule for the tapped circle, bottom left, each number in the colour of its circle.
    if (chosen?.other) {
      const pieces = rulePieces(chosen);
      ctx.direction = 'ltr';
      ctx.textAlign = 'left';
      let size = L.small + 4,
        total;
      do {
        ctx.font = `600 ${size}px system-ui`;
        total = pieces.reduce((w, [text]) => w + ctx.measureText(text).width, 0);
      } while (total > L.w - 2 * L.pad - 16 && --size > 9);
      const y = L.h - L.pad - 8;
      ctx.fillStyle = COLORS.backing;
      ctx.beginPath();
      ctx.roundRect(L.pad - 2, y - size - 8, total + 20, size + 18, 8);
      ctx.fill();
      let x = L.pad + 8;
      for (const [text, color] of pieces) {
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        x += ctx.measureText(text).width;
      }
    }
    ctx.direction = 'inherit';
  }

  const appear = (generation) => (growth === Infinity ? 1 : clamp((growth - WAVE(generation)) / FADE, 0, 1));

  function draw(ctx, s, stage) {
    const L = (layout = measure(stage.width, stage.height));
    const circles = circlesFor(L, s);
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, L.w, L.h);
    paint(ctx, L, s, circles, appear);
    if (growth === Infinity) highlight(ctx, L, s);
    captions(ctx, L, s);
    // The panel's summary follows the view, a few times a second at most, and catches up once it stops.
    const wait = told + 300 - performance.now();
    if (wait <= 0) summary(s);
    else if (!catchUp) catchUp = setTimeout(() => summary(W.stage.settingsFor('gasket')), wait);
  }

  // ---------- words in the panel ----------

  function summary(s) {
    clearTimeout(catchUp);
    catchUp = 0;
    const box = $('gasket-readout');
    const L = layout;
    if (!box || !L || !W.stage.isShowing(room)) return;
    told = performance.now();
    // The settings may have changed since the last frame (a preset, a slider): count the circles they make.
    const circles = circlesFor(L, s);
    // The big circle counts while its edge shows.
    const shown = circles.filter((c, i) => (i === 0 ? s.zoom <= WHOLE : onScreen(L, s, c)));
    const bends = shown.map((c) => c.bend);
    if (!bends.length) return;
    const whole = bends.every(Number.isInteger);
    const n = new Intl.NumberFormat(W.numberLocale).format(shown.length);
    const rows = [
      [
        t.readout.tapped,
        chosen
          ? chosen.circle.bend < 0
            ? t.outer(bendText(chosen.circle.bend))
            : t.bend(bendText(chosen.circle.bend))
          : t.tapHint,
      ],
    ];
    if (chosen?.other)
      rows.push([t.readout.rule, `<span dir="ltr">${ruleText(chosen)}</span><small>${t.ruleWords}</small>`]);
    rows.push([
      t.readout.all,
      whole ? t.whole(n, bendText(Math.min(...bends)), bendText(Math.max(...bends))) : t.notWhole(n),
    ]);
    const html = rows.map(([k, v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join('');
    if (box.innerHTML !== html) box.innerHTML = html;
    $('scene-status').textContent = t.status(whole);
  }

  function readouts(s) {
    // The starting circles also change by dragging them: keep the two sliders on them.
    for (const key of ['a', 'b']) {
      const input = $('c-' + key);
      if (input && Number(input.value) !== s[key]) input.value = s[key];
    }
    const preset = presets.findIndex((p) => ['k', 'a', 'b'].every((k) => p.settings[k] === s[k]));
    $('scene-name').textContent = preset >= 0 ? presets[preset].name : t.yourOwn;
    summary(s);
  }

  function controls(s, stage) {
    return (
      '<div class="wide readout gasket-readout" id="gasket-readout"></div>' +
      stage.slider('a', t.left, M.LEAST * s.k, M.MOST * s.k, 0.01, s.a, '', t.bendHint) +
      stage.slider('b', t.right, M.LEAST * s.k, M.MOST * s.k, 0.01, s.b)
    );
  }

  // ---------- choosing a circle ----------

  const copy = (c) => ({ bend: c.bend, x: c.x, y: c.y, r: c.r });

  /** The circle under a point of the canvas: the one it is in, else the nearest edge close by, else the big circle. */
  function circleAt(L, s, X, Y) {
    const circles = cache.circles,
      scale = scaleOf(L, s);
    const [x, y] = toWorld(L, s, X, Y);
    let best = -1,
      gap = Infinity;
    for (let i = 1; i < circles.length; i++) {
      const c = circles[i];
      if (c.r * scale < 2) continue;
      const d = (Math.hypot(x - c.x, y - c.y) - c.r) * scale;
      if (d <= 0) return i;
      if (d < gap) [best, gap] = [i, d];
    }
    const rim = Math.abs(1 - Math.hypot(x, y)) * scale;
    return best >= 0 && gap <= Math.min(12, rim) ? best : 0;
  }

  /** The starting circle (1 to 3) under a point, or −1. */
  function startingAt(L, s, X, Y) {
    const [x, y] = toWorld(L, s, X, Y);
    const root = cache.circles;
    for (let i = 1; i < 4 && i < root.length; i++) if (Math.hypot(x - root[i].x, y - root[i].y) < root[i].r) return i;
    return -1;
  }

  function choose(i) {
    const circles = cache.circles,
      c = circles[i];
    if (!c) return;
    chosen = {
      circle: copy(c),
      touches: c.touches.map((j) => copy(circles[j])).sort((p, q) => p.bend - q.bend),
      other: c.other >= 0 ? copy(circles[c.other]) : null,
    };
    summary(W.stage.settingsFor('gasket'));
    if (chosen.other) W.announce(t.told(bendText(c.bend), ruleText(chosen)));
  }

  /** Enter: the next circle on show, biggest first. */
  function nextCircle(s) {
    const L = layout;
    if (!L) return;
    const shown = cache.circles
      .map((c, i) => ({ c, i }))
      .filter(({ c, i }) => i > 0 && onScreen(L, s, c) && c.r * scaleOf(L, s) >= 4)
      .sort((p, q) => q.c.r - p.c.r);
    if (!shown.length) return;
    keyIndex = (keyIndex + 1) % shown.length;
    choose(shown[keyIndex].i);
  }

  // ---------- zooming, moving and resizing ----------

  /** Magnify to `zoom`, keeping the point of the canvas at (X, Y) where it is. */
  function zoomAt(s, X, Y, zoom) {
    const L = layout;
    if (!L) return;
    const [x, y] = toWorld(L, s, X, Y);
    s.zoom = clamp(zoom, 1, MOST_ZOOM);
    s.vx = x - (X - L.cx) / scaleOf(L, s);
    s.vy = y + (Y - L.cy) / scaleOf(L, s);
    keepInView(s);
  }

  /** The visitor takes over: no dive, no growing, nothing automatic. */
  function takeOver() {
    autoDive = false;
    dive = null;
    growth = Infinity;
  }

  /** Drag a starting circle: its far edge follows the pointer, so its radius changes by half the distance moved. */
  function resizeBy(s, X, Y) {
    const L = layout,
      scale = scaleOf(L, s);
    const c = press.circle;
    const d = Math.hypot(c.x, c.y) || 1;
    const along = (-(X - press.X) * c.x + (Y - press.Y) * c.y) / (d * scale);
    const { a, b } = M.resize(s.k, press.a, press.b, press.start - 1, c.r + along / 2);
    if (a === s.a && b === s.b) return;
    Object.assign(s, { a, b });
    chosen = null;
    W.stage.setChosen(-1);
    W.stage.sync();
  }

  // ---------- the dive ----------

  /**
   * A sequence of gaps to enter, different for each dive. Each smaller gap leaves out the oldest of its three circles
   * (choice 0), or now and then the middle one (1), never the newest: keeping two old circles for long would slide
   * towards the point where they touch, a view taken over by two big curves. This way circles of every size crowd
   * round the target.
   */
  function choicesFor(n) {
    let seed = (n + 1) * 2654435761;
    return Array.from({ length: 48 }, () => {
      seed = (Math.imul(seed ^ (seed >>> 15), 2246822519) + 0x9e3779b9) >>> 0;
      return seed % 3 === 2 ? 1 : 0;
    });
  }

  function startDive(s, stage) {
    const L = layout ?? measure(stage.width, stage.height);
    if (s.zoom > MOST_ZOOM / 2) return; // as deep as the picture goes
    // From the whole picture, head for one of a few chosen places; once zoomed, for somewhere near the middle.
    const near = s.zoom <= WHOLE ? AIMS[dives % AIMS.length] : { x: s.vx, y: s.vy };
    const size = s.zoom <= WHOLE ? 0.04 : 0.2 / s.zoom;
    const target = M.deepPoint(s.k, s.a, s.b, near, size, choicesFor(dives));
    dives++;
    autoDive = false;
    growth = Infinity;
    const to = Math.min(MOST_ZOOM, s.zoom * DIVE.depth);
    dive = { phase: 'in', time: 0, target, from: { vx: s.vx, vy: s.vy, zoom: s.zoom }, to };
    if (reduced) {
      // No movement: go straight to the end of the dive, and stay there.
      Object.assign(s, { zoom: to, vx: target.x, vy: target.y });
      keepInView(s);
      dive = null;
      tellDive(s, L);
    } else if (!stage.playing) {
      stage.setPlaying(true);
      stage.sync();
    }
    stage.draw();
  }

  const ease = (f) => f * f * (3 - 2 * f);

  /**
   * Zoom in exponentially, so the picture seems to fall at a steady speed, while the view moves on to the target
   * (it reaches it exactly at the deepest point); then hold, and fly back out to the whole picture.
   */
  function advanceDive(dt, s, stage) {
    dive.time += dt;
    const { target, from } = dive;
    if (dive.phase === 'in') {
      const f = ease(Math.min(1, dive.time / DIVE.in));
      const zoom = from.zoom * (dive.to / from.zoom) ** f;
      const toward = (1 / zoom - 1 / dive.to) / (1 / from.zoom - 1 / dive.to);
      Object.assign(s, {
        zoom,
        vx: target.x + (from.vx - target.x) * toward,
        vy: target.y + (from.vy - target.y) * toward,
      });
      if (dive.time >= DIVE.in) {
        dive = { ...dive, phase: 'hold', time: 0 };
        tellDive(s, layout);
      }
    } else if (dive.phase === 'hold') {
      if (dive.time >= DIVE.hold) dive = { ...dive, phase: 'out', time: 0, deep: { zoom: s.zoom, vx: s.vx, vy: s.vy } };
    } else {
      const { deep } = dive;
      const f = ease(Math.min(1, dive.time / DIVE.out));
      const zoom = deep.zoom ** (1 - f);
      const back = (1 - 1 / zoom) / (1 - 1 / deep.zoom);
      Object.assign(s, { zoom, vx: deep.vx * back, vy: deep.vy * back });
      if (dive.time >= DIVE.out) {
        Object.assign(s, { zoom: 1, vx: 0, vy: 0 });
        dive = null;
      }
    }
    keepInView(s);
  }

  /** Say how deep the dive went, and the biggest bend drawn there. */
  function tellDive(s, L) {
    if (!L) return;
    circlesFor(L, s);
    const shown = cache.circles.filter((c, i) => i > 0 && onScreen(L, s, c));
    if (!shown.length) return;
    const n = new Intl.NumberFormat(W.numberLocale, { maximumFractionDigits: 0 });
    W.announce(t.dived(n.format(s.zoom), bendText(Math.max(...shown.map((c) => c.bend)))));
  }

  // ---------- fingers and the scroll wheel ----------

  /** Pinch and scroll to zoom. The stage passes single pointers to the room; these need the canvas itself. */
  function bind(canvas) {
    if (bound) return;
    bound = true;
    const here = () => room && W.stage.isShowing(room);
    const at = (touch) => {
      const r = canvas.getBoundingClientRect();
      return [
        ((touch.clientX - r.left) / r.width) * W.stage.width,
        ((touch.clientY - r.top) / r.height) * W.stage.height,
      ];
    };
    canvas.addEventListener(
      'wheel',
      (e) => {
        // A plain scroll zooms only once the picture has been tapped or focused, so it doesn't catch a visitor
        // scrolling the page; a pinch on a touchpad (a scroll with Ctrl) always zooms.
        if (!here() || !layout || (!e.ctrlKey && document.activeElement !== canvas)) return;
        const s = W.stage.settingsFor('gasket');
        const pixels = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1);
        const factor = Math.exp(-pixels * (e.ctrlKey ? 0.01 : 0.002));
        if (factor < 1 && s.zoom <= 1) return; // the whole picture already shows: let the page scroll
        e.preventDefault();
        takeOver();
        const r = canvas.getBoundingClientRect();
        zoomAt(
          s,
          ((e.clientX - r.left) / r.width) * W.stage.width,
          ((e.clientY - r.top) / r.height) * W.stage.height,
          s.zoom * factor,
        );
        W.stage.draw();
      },
      { passive: false },
    );
    canvas.addEventListener(
      'touchstart',
      (e) => {
        if (!here() || e.touches.length !== 2 || !layout) return;
        e.preventDefault();
        const s = W.stage.settingsFor('gasket');
        const [p, q] = [...e.touches].map(at);
        const middle = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
        press = null;
        takeOver();
        pinch = {
          apart: Math.hypot(p[0] - q[0], p[1] - q[1]) || 1,
          zoom: s.zoom,
          world: toWorld(layout, s, ...middle),
        };
      },
      { passive: false },
    );
    canvas.addEventListener(
      'touchmove',
      (e) => {
        if (!pinch || e.touches.length !== 2) return;
        e.preventDefault();
        const s = W.stage.settingsFor('gasket'),
          L = layout;
        const [p, q] = [...e.touches].map(at);
        s.zoom = clamp((pinch.zoom * Math.hypot(p[0] - q[0], p[1] - q[1])) / pinch.apart, 1, MOST_ZOOM);
        // The point between the fingers stays between them.
        s.vx = pinch.world[0] - ((p[0] + q[0]) / 2 - L.cx) / scaleOf(L, s);
        s.vy = pinch.world[1] + ((p[1] + q[1]) / 2 - L.cy) / scaleOf(L, s);
        keepInView(s);
        W.stage.draw();
      },
      { passive: false },
    );
    const lift = (e) => {
      if (pinch && e.touches.length < 2) {
        pinch = null;
        press = null;
      }
    };
    canvas.addEventListener('touchend', lift);
    canvas.addEventListener('touchcancel', lift);
  }

  // ---------- the room ----------

  /** The map's picture: the whole gasket of Halves, with its numbers. */
  function preview(ctx, width, height) {
    const L = measure(width, height);
    const s = { ...defaults };
    paint(ctx, L, s, M.grow(s.k, s.a, s.b, { smallest: 0.6 / L.unit }), () => 1);
  }

  const defaults = { k: 1, a: 2, b: 2, vx: 0, vy: 0, zoom: 1 };
  const whole = { vx: 0, vy: 0, zoom: 1 };
  const presetSettings = [
    { k: 1, a: 2, b: 2, ...whole }, // −1, 2, 2, 3
    { k: 2, a: 3, b: 6, ...whole }, // −2, 3, 6, 7
    { k: 3, a: 4, b: 12, ...whole }, // −3, 4, 12, 13
    { k: 1, a: 2.2, b: 2.1, ...whole }, // a little off: decimals everywhere
  ];
  const badges = ['½', '⅓', '¼', '≈'];
  const presets = t.presets.map((p, i) => ({ ...p, badge: badges[i], settings: presetSettings[i] }));
  const isDefault = (s) => Object.keys(defaults).every((k) => s[k] === defaults[k]);
  let fitted = { a: defaults.a, b: defaults.b }; // the starting circles' bends the sliders last agreed on

  /** Start growing from the four starting circles (at once when paused or with reduced motion). */
  function regrow(s, stage) {
    chosen = null;
    keyIndex = -1;
    dive = null;
    growth = stage.playing && !reduced && s.zoom <= WHOLE ? 0 : Infinity;
  }

  room = W.defineRoom({
    id: 'gasket',
    symbol: '⊚',
    theme: 'shape',
    added: '2026-10-13',
    eyebrow: t.eyebrow,
    name: t.name,
    tagline: t.tagline,
    accent: { background: '#1d1a2a', border: '#e7c46a', color: '#f6ead0' },

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
    connection: { ...t.connection, go: 'julia' },

    defaults,
    ranges: {
      k: [1, 6, 'integer'],
      a: [M.LEAST, M.MOST * 6],
      b: [M.LEAST, M.MOST * 6],
      vx: [-1, 1],
      vy: [-1, 1],
      zoom: [1, MOST_ZOOM],
    },
    defaultPreset: 0,
    presets,

    guests: [
      {
        ...t.guests[0],
        bio: 'Descartes',
        color: '#e7c46a',
        sketch: {
          hairStyle: 'long',
          hair: '#2b211b',
          moustache: true,
          beard: 'goatee',
          skin: '#ecc9a8',
          backdrop: '#e6dfd0',
        },
      },
      {
        ...t.guests[1],
        color: '#7fe0ff',
        sketch: { hairStyle: 'long', hair: '#4a2e20', skin: '#f3d6bd', brows: 'soft', backdrop: '#dfe4ea' },
      },
      {
        ...t.guests[2],
        color: '#ff8f7a',
        sketch: { hairStyle: 'receding', hair: '#8c8378', moustache: true, skin: '#efcfb2', backdrop: '#e9e3d8' },
      },
    ],

    insight: t.insight,

    controls,
    readouts,
    draw,
    preview,

    enter(s, stage) {
      bind($('scene-canvas'));
      press = null;
      pinch = null;
      dive = null;
      keyIndex = -1;
      chosen = null;
      $('scene-canvas').style.cursor = '';
      // A shared link may carry starting circles that don't fit: make them fit.
      Object.assign(s, M.settle(s.k, s.a, s.b));
      keepInView(s);
      fitted = { a: s.a, b: s.b };
      const fresh = firstVisit && isDefault(s);
      firstVisit = false;
      opened = 0;
      autoDive = fresh && stage.playing && !reduced;
      regrow(s, stage);
    },

    step(dt, s, stage) {
      opened += dt;
      if (growth !== Infinity) {
        growth += dt;
        if (growth > WAVE(cache.last) + FADE) growth = Infinity;
      }
      if (autoDive && opened > FIRST_DIVE) startDive(s, stage);
      if (dive) advanceDive(dt, s, stage);
    },

    onInput(s, stage) {
      // A slider moved one starting circle; if the two no longer fit side by side, the other gives way.
      const moved = s.a !== fitted.a ? 'a' : 'b';
      Object.assign(s, M.settle(s.k, s.a, s.b, moved));
      fitted = { a: s.a, b: s.b };
      takeOver();
      chosen = null;
      stage.draw();
    },

    onPreset(s, stage) {
      fitted = { a: s.a, b: s.b };
      autoDive = false;
      regrow(s, stage);
    },

    /** "Dive in": fall into the gasket, towards a point where circles of every size crowd together. */
    action(s, stage) {
      startDive(s, stage);
    },

    /** "Start again": the whole picture, grown again from its four starting circles. */
    reset(s, stage) {
      Object.assign(s, whole);
      autoDive = false;
      regrow(s, stage);
    },

    pointer: {
      // A finger on the gasket taps, resizes or moves it; around it, the page scrolls.
      drag: (p, s, stage) => {
        const L = layout ?? measure(stage.width, stage.height);
        if (s.zoom > WHOLE) return true;
        const [x, y] = toWorld(L, s, p.x * stage.width, p.y * stage.height);
        return Math.hypot(x, y) < 1;
      },
      down(p, s, stage, e) {
        if ((e && e.button > 0) || pinch || !layout) return;
        const X = p.x * stage.width,
          Y = p.y * stage.height;
        const start = s.zoom <= WHOLE ? startingAt(layout, s, X, Y) : -1;
        autoDive = false;
        dive = null;
        press = {
          X,
          Y,
          vx: s.vx,
          vy: s.vy,
          a: s.a,
          b: s.b,
          start,
          circle: start > 0 ? copy(cache.circles[start]) : null,
          moved: false,
        };
      },
      move(p, { dragging }, s, stage) {
        const X = p.x * stage.width,
          Y = p.y * stage.height;
        if (!press || !dragging || pinch) {
          if (!dragging && layout)
            $('scene-canvas').style.cursor = s.zoom > WHOLE || startingAt(layout, s, X, Y) > 0 ? 'grab' : 'pointer';
          return;
        }
        if (!press.moved && Math.hypot(X - press.X, Y - press.Y) < 5) return;
        press.moved = true;
        growth = Infinity;
        if (press.start > 0) resizeBy(s, X, Y);
        else if (s.zoom > WHOLE) {
          const scale = scaleOf(layout, s);
          s.vx = press.vx - (X - press.X) / scale;
          s.vy = press.vy + (Y - press.Y) / scale;
          keepInView(s);
        }
        stage.draw();
      },
      up(e) {
        const s = W.stage.settingsFor('gasket');
        if (press && !press.moved && !pinch && e?.type !== 'pointercancel' && layout) {
          growth = Infinity;
          keyIndex = -1;
          choose(circleAt(layout, s, press.X, press.Y));
        }
        if (press?.moved && press.start > 0) fitted = { a: s.a, b: s.b };
        press = null;
        W.stage.draw();
      },
      leave() {
        $('scene-canvas').style.cursor = '';
      },
      /** Arrow keys move around once zoomed in. */
      arrow(dx, dy, s, stage) {
        if (s.zoom <= WHOLE || !layout) return;
        takeOver();
        const step = (0.15 * Math.min(layout.w, layout.h)) / scaleOf(layout, s);
        s.vx += dx * step;
        s.vy -= dy * step;
        keepInView(s);
      },
      /** + and − zoom (towards the tapped circle, if it shows); Enter picks the next circle. */
      key(e, s, stage) {
        const L = layout;
        if (!L) return false;
        if (e.key === 'Enter') {
          growth = Infinity;
          nextCircle(s);
          return true;
        }
        const zoom = ['+', '='].includes(e.key) ? STEP_ZOOM : ['-', '_', '−'].includes(e.key) ? 1 / STEP_ZOOM : 0;
        if (!zoom) return false;
        takeOver();
        const [X, Y] = chosen && zoom > 1 ? toScreen(L, s, chosen.circle.x, chosen.circle.y) : [L.cx, L.cy];
        const inside = X >= 0 && X <= L.w && Y >= 0 && Y <= L.h;
        zoomAt(s, inside ? X : L.cx, inside ? Y : L.cy, s.zoom * zoom);
        return true;
      },
      escape() {
        chosen = null;
        summary(W.stage.settingsFor('gasket'));
        W.stage.draw();
      },
    },
  });
})();
