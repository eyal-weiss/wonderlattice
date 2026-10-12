/* Room · Random jumps, perfect triangle: the chaos game, where a dot jumping to random corners draws a fractal. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, clamp, TAU } = W;
  const M = W.models.chaos;
  const t = W.text('chaos');

  const COLORS = {
    background: '#0a0e15',
    frame: '#1c2533',
    label: '#a7b4c6',
    ink: '#f4f5e9',
    dot: '#ffffff',
    rim: 'rgba(5, 7, 11, 0.85)',
  };
  // One colour per corner, and one per rule of the fern (stem, the rest of the fern, left and right leaflets).
  const CORNER_COLORS = ['#ffd166', '#f2728f', '#3dd6a3', '#5cc8f0', '#c79bff', '#f8a04a'];
  const FERN_COLORS = ['#c9a66b', '#7bd389', '#c4ec8c', '#3fb68b'];

  // The opening: a few slow jumps, so each one can be seen, then faster and faster.
  const FIRST_PAUSE = 0.7; // seconds before the first jump, to see where the dot starts
  const SLOW_JUMPS = 6; // jumps shown one at a time
  const SLOW_TIME = 0.6; // seconds per slow jump
  const SLIDE = 0.36; // of which the dot slides for this long
  const START_RATE = 4; // jumps per second once the slow jumps are over…
  const DOUBLING = 0.42; // …doubling this often (seconds)…
  const TOP_RATE = 60000; // …up to about a thousand jumps per frame
  const QUICK_RATE = 3000; // a new game after a change starts here
  const QUICK_DOUBLING = 0.25;
  const FRAME_MOST = 2200; // at most this many jumps in one frame, so a slow frame doesn't stall
  const DRAG_JUMPS = 30000; // while a corner is dragged, each move redraws the shape with this many jumps
  const TRAIL = 3; // seconds a landing ring stays visible
  const LEVELS = 16; // brightness steps: a pixel hit more often glows brighter

  let layout = null,
    play = null, // the game being drawn
    buffer = null, // the dots, as pixels
    grabbing = -1, // the corner being dragged
    pending = null, // where a tap started, to start the dot there when it ends
    firstVisit = true,
    lastStatus = 0;

  const number = (n) => n.toLocaleString(W.numberLocale);
  const density = () => Math.min(devicePixelRatio || 1, 1.5); // sharp enough, and light enough to redraw every frame

  /** Packed RGBA pixels (little-endian: 0xAABBGGRR) for each colour at each brightness. */
  function palette(colors) {
    const table = new Uint32Array(colors.length * LEVELS);
    colors.forEach((hex, k) => {
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
      for (let l = 0; l < LEVELS; l++) {
        const f = 0.36 + (0.64 * l) / (LEVELS - 1);
        table[k * LEVELS + l] = (255 << 24) | (Math.round(b * f) << 16) | (Math.round(g * f) << 8) | Math.round(r * f);
      }
    });
    return table;
  }
  const CORNER_PALETTE = palette(CORNER_COLORS);
  const FERN_PALETTE = palette(FERN_COLORS);
  // How bright a pixel hit h times is: one step per doubling and a bit.
  const LEVEL = Uint8Array.from({ length: 256 }, (_, h) =>
    h ? Math.min(LEVELS - 1, Math.round(Math.log2(h) * 3.75)) : 0,
  );

  // ---------- the game ----------

  const offsetKeys = ['a', 'b', 'c', 'd', 'e', 'f'];
  const offsetsOf = (s) => offsetKeys.map((k) => [s[k + 'x'], s[k + 'y']]);
  const cornersOf = (s) => M.corners(s.corners, offsetsOf(s));
  const keepOf = (s) => 1 - s.jump / 100;
  const keyOf = (s) => JSON.stringify([s.corners, s.jump, s.rule, s.fern, offsetsOf(s).slice(0, s.corners)]);
  /** Whether the room counts the dots in the triangle's middle hole: three corners, halfway, no rule. */
  const counting = (s) => !s.fern && s.corners === 3 && s.jump === 50 && !s.rule;

  // The fern, scaled into the same square as the corners.
  const B = M.FERN_BOX;
  const FERN_SCALE = (2 * M.EDGE) / (B.y1 - B.y0);
  const fernToWorld = (x, y) => [(x - (B.x0 + B.x1) / 2) * FERN_SCALE, (y - (B.y0 + B.y1) / 2) * FERN_SCALE];
  const worldToFern = ([x, y]) => [x / FERN_SCALE + (B.x0 + B.x1) / 2, y / FERN_SCALE + (B.y0 + B.y1) / 2];

  /** Where the dot is, in the picture's square [−1, 1]². */
  const dotOf = (g) => (g.fern ? fernToWorld(g.x, g.y) : [g.x, g.y]);

  /** A fresh game for the settings. `mode`: 'slow' opens with slow jumps, 'quick' starts fast. */
  function newGame(s, mode, start) {
    const points = cornersOf(s);
    const centre = [
      points.reduce((a, p) => a + p[0], 0) / points.length,
      points.reduce((a, p) => a + p[1], 0) / points.length,
    ];
    const from = start ?? (s.fern ? [0, 0] : centre);
    const seed = (Math.random() * 2 ** 32) >>> 0;
    play = {
      key: keyOf(s),
      seed,
      start: from,
      g: M.game({
        corners: points,
        keep: keepOf(s),
        rule: s.rule,
        fern: s.fern,
        start: s.fern ? worldToFern(from) : from,
        seed,
      }),
      points,
      count: counting(s),
      burn: s.fern ? M.burnIn(0.86) : M.burnIn(keepOf(s)),
      jumps: 0,
      hole: 0,
      phase: mode === 'slow' ? 'slow' : 'run',
      rate: mode === 'slow' ? START_RATE : QUICK_RATE,
      doubling: mode === 'slow' ? DOUBLING : QUICK_DOUBLING,
      acc: 0,
      slowTime: 0,
      move: null, // the jump being shown: { from, to, corner }
      trail: [], // recent landings, while they're slow enough to see
      announced: false,
    };
    clearBuffer();
  }

  /** The most jumps a game makes: enough to light the picture well, never so many that it runs for ever. */
  const capOf = () => (buffer ? clamp(Math.round(buffer.area * 1.6), 200000, 2500000) : 200000);

  /** One jump of the game, kept in the picture once the dot has had time to reach the shape. */
  function jumpOnce() {
    const g = play.g;
    const k = M.jump(g);
    play.jumps++;
    if (play.jumps > play.burn) plot(dotOf(g), k);
    return k;
  }

  function plot([x, y], k) {
    if (play.count && M.inMiddle([x, y], play.points)) play.hole++;
    if (!buffer) return;
    const { w, h, d, view } = buffer;
    const bx = Math.floor((view.ox + x * view.scale) * d),
      by = Math.floor((view.oy - y * view.scale) * d);
    if (bx < 0 || by < 0 || bx >= w || by >= h) return;
    const i = by * w + bx;
    const hits = buffer.hits[i] < 255 ? ++buffer.hits[i] : 255;
    buffer.pixels[i] = (play.g.fern ? FERN_PALETTE : CORNER_PALETTE)[k * LEVELS + LEVEL[hits]];
    buffer.dirty = true;
  }

  /** Play the rest of the game at once (when nothing moves: paused, or reduced motion). */
  function finish(upTo = capOf()) {
    while (play.jumps < upTo) jumpOnce();
    play.phase = play.jumps >= capOf() ? 'done' : 'run';
    play.move = null;
    play.trail = [];
  }

  /** Start again with the settings as they are now: playing, or (when nothing moves) finished at the next frame. */
  function restart(s, stage, mode = 'quick', start) {
    newGame(s, mode, start);
    play.instant = !stage.playing;
    stage.draw();
  }

  /** The dots so far, played again into a buffer of a new size. */
  function replay() {
    const { seed, start, jumps, phase } = play;
    const g = play.g;
    play.g = M.game({
      corners: g.points,
      keep: g.keep,
      rule: g.rule,
      fern: g.fern,
      start: g.fern ? worldToFern(start) : start,
      seed,
    });
    play.jumps = 0;
    play.hole = 0;
    while (play.jumps < jumps) jumpOnce();
    play.phase = phase;
  }

  // ---------- the picture ----------

  function clearBuffer() {
    if (!buffer) return;
    buffer.hits.fill(0);
    buffer.pixels.fill(0);
    buffer.dirty = true;
  }

  /** The pixels of the dots, as large as the canvas. A new size or view plays the dots so far again. */
  function ensureBuffer(L) {
    const d = density();
    const w = Math.max(16, Math.round(L.w * d)),
      h = Math.max(16, Math.round(L.h * d));
    const key = `${w}x${h}:${L.view.key}`;
    if (buffer && buffer.key === key) return;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    const image = ctx.createImageData(w, h);
    buffer = {
      key,
      w,
      h,
      d,
      view: L.view,
      area: L.view.area * d * d,
      canvas,
      ctx,
      image,
      pixels: new Uint32Array(image.data.buffer),
      hits: new Uint8Array(w * h),
      dirty: true,
    };
    if (play) replay();
  }

  /** What the picture shows, in its own coordinates: the regular shape (or the fern), however its corners move. */
  function extent(s) {
    if (s.fern) {
      const [x0, y0] = fernToWorld(B.x0, B.y0),
        [x1, y1] = fernToWorld(B.x1, B.y1);
      return { key: 'fern', x0, x1, y0, y1 };
    }
    const p = M.regular(s.corners);
    const xs = p.map((q) => q[0]),
      ys = p.map((q) => q[1]);
    return {
      key: String(s.corners),
      x0: Math.min(...xs),
      x1: Math.max(...xs),
      y0: Math.min(...ys),
      y1: Math.max(...ys),
    };
  }

  /**
   * Where things go: the shape as large as the canvas allows, centred, with two lines of words under it (how many
   * jumps, and what a jump is). The view is fixed by the regular shape, so it holds still while a corner is dragged.
   */
  function measure(w, h, s) {
    const pad = clamp(Math.min(w, h) * 0.03, 6, 16);
    const small = Math.round(clamp(Math.min(w, h) / 34, 10, 13));
    const words = 2 * small + 14;
    const margin = 12; // room for the corners' handles
    const e = extent(s);
    const room = { x: pad + margin, y: pad + margin, w: w - 2 * (pad + margin), h: h - 2 * (pad + margin) - words };
    const scale = Math.max(10, Math.min(room.w / (e.x1 - e.x0), room.h / (e.y1 - e.y0)));
    const cw = (e.x1 - e.x0) * scale,
      ch = (e.y1 - e.y0) * scale;
    const left = room.x + (room.w - cw) / 2,
      top = room.y + Math.max(0, (room.h - ch) / 2);
    const view = {
      key: `${e.key}:${scale.toFixed(3)}`,
      scale,
      ox: left - e.x0 * scale,
      oy: top + e.y1 * scale,
      area: cw * ch,
    };
    return { w, h, pad, small, room, view };
  }
  const toPx = (L, [x, y]) => [L.view.ox + x * L.view.scale, L.view.oy - y * L.view.scale];
  /** A point of the canvas in the game's coordinates, kept inside the picture and the square [−1, 1]². */
  const toWorld = (L, [px, py]) => {
    const { room, view } = L;
    const x = (clamp(px, room.x, room.x + room.w) - view.ox) / view.scale,
      y = (view.oy - clamp(py, room.y, room.y + room.h)) / view.scale;
    return [clamp(x, -1, 1), clamp(y, -1, 1)];
  };

  /** Words on the picture, with a dark rim so they read over the dots. */
  function label(ctx, text, x, y, width, size, color, weight = 600) {
    let px = size;
    do ctx.font = `${weight} ${px}px system-ui`;
    while (ctx.measureText(text).width > width && --px > 9);
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4;
    ctx.strokeStyle = COLORS.rim;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }

  function draw(ctx, s, stage) {
    const L = (layout = measure(stage.width, stage.height, s));
    ensureBuffer(L);
    if (!play || play.key !== keyOf(s)) {
      newGame(s, 'quick');
      play.instant = !stage.playing;
    }
    // Nothing moves (paused, or reduced motion): a new game is played to the end at once.
    if (play.instant) {
      play.instant = false;
      finish();
    }
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, L.w, L.h);

    if (buffer.dirty) {
      buffer.ctx.putImageData(buffer.image, 0, 0);
      buffer.dirty = false;
    }
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(buffer.canvas, 0, 0, L.w, L.h);

    const corner = (k) => toPx(L, play.points[k]);
    // The jump being shown: a dashed line to the chosen corner, and the dot sliding along it.
    const move = play.move;
    if (move && !s.fern) {
      const [cx, cy] = corner(move.corner);
      const f = play.phase === 'slow' ? Math.min(1, play.slowTime / SLIDE) : 1;
      const e = f * f * (3 - 2 * f);
      const [ax, ay] = toPx(L, move.from),
        [bx, by] = toPx(L, move.to);
      ctx.setLineDash([4, 5]);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(244, 245, 233, 0.6)';
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(cx, cy);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = CORNER_COLORS[move.corner];
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 15, 0, TAU);
      ctx.stroke();
      move.at = [ax + (bx - ax) * e, ay + (by - ay) * e];
    }

    // Recent landings, fading.
    for (const r of play.trail) {
      const [x, y] = toPx(L, r.at);
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, 0.85 * (1 - r.age / TRAIL))})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, TAU);
      ctx.stroke();
    }

    // The corners, which can be dragged.
    if (!s.fern)
      play.points.forEach((p, k) => {
        const [x, y] = toPx(L, p);
        ctx.fillStyle = COLORS.rim;
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, TAU);
        ctx.fill();
        ctx.fillStyle = CORNER_COLORS[k];
        ctx.beginPath();
        ctx.arc(x, y, grabbing === k ? 8 : 6.5, 0, TAU);
        ctx.fill();
      });

    // The dot itself, while it's slow enough to follow.
    if (play.phase === 'slow' || play.rate < 400 || !stage.playing) {
      const at = move?.at ?? toPx(L, dotOf(play.g));
      ctx.fillStyle = COLORS.rim;
      ctx.beginPath();
      ctx.arc(at[0], at[1], 6, 0, TAU);
      ctx.fill();
      ctx.fillStyle = COLORS.dot;
      ctx.beginPath();
      ctx.arc(at[0], at[1], 4, 0, TAU);
      ctx.fill();
    }

    // Words: how many jumps, and what each one does, from the side the page's language starts on.
    const rtl = document.documentElement.dir === 'rtl';
    const x = rtl ? L.w - L.pad : L.pad;
    ctx.textAlign = rtl ? 'right' : 'left';
    ctx.direction = rtl ? 'rtl' : 'ltr';
    ctx.textBaseline = 'alphabetic';
    const caption = s.fern ? t.fernCaption : t.caption(number(s.jump), s.rule);
    label(
      ctx,
      t.jumps(number(play.jumps), play.jumps),
      x,
      L.h - L.pad - L.small - 7,
      L.w - 2 * L.pad,
      L.small + 1,
      COLORS.ink,
    );
    label(ctx, caption, x, L.h - L.pad, L.w - 2 * L.pad, L.small, COLORS.label, 500);
    ctx.direction = 'ltr';

    status(s);
  }

  /** The line over the picture: the dots in the middle hole (for the triangle), or the jumps so far. */
  function status(s, now = false) {
    if (!play || (!now && performance.now() - lastStatus < 250)) return;
    lastStatus = performance.now();
    const kept = Math.max(0, play.jumps - play.burn);
    const words =
      play.count && kept ? t.holeStatus(number(play.hole), play.hole === 0) : t.jumpStatus(number(play.jumps));
    const el = $('scene-status');
    if (el.textContent !== words) el.textContent = words;
    if (play.phase === 'done' && !play.announced) {
      play.announced = true;
      W.announce(t.settled(number(play.jumps)));
    }
  }

  // ---------- moving ----------

  function step(dt, s, stage) {
    if (!play) return;
    for (const r of play.trail) r.age += dt;
    play.trail = play.trail.filter((r) => r.age < TRAIL);
    if (grabbing >= 0 || play.phase === 'done') return;
    if (play.phase === 'slow') {
      play.slowTime += dt;
      if (!play.move && play.slowTime < FIRST_PAUSE) return;
      if (!play.move || play.slowTime >= SLOW_TIME) {
        if (play.move) play.trail.push({ at: play.move.to, age: 0 });
        if (play.jumps >= SLOW_JUMPS) {
          play.phase = 'run';
          play.move = null;
          return;
        }
        play.slowTime = 0;
        const from = dotOf(play.g);
        const k = jumpOnce();
        play.move = { from, to: dotOf(play.g), corner: k };
      }
      return;
    }
    play.rate = Math.min(TOP_RATE, play.rate * 2 ** (dt / play.doubling));
    play.acc += play.rate * dt;
    const n = Math.min(FRAME_MOST, Math.floor(play.acc), capOf() - play.jumps);
    play.acc -= Math.floor(play.acc);
    const visible = play.rate < 40;
    for (let i = 0; i < n; i++) {
      jumpOnce();
      if (visible) play.trail.push({ at: dotOf(play.g), age: 0 });
    }
    play.move = null;
    if (play.jumps >= capOf()) {
      play.phase = 'done';
      status(s, true);
    }
  }

  /** "One jump": stop, and make a single jump, with its line to the corner. */
  function oneJump(s, stage) {
    if (!play) return;
    if (stage.playing) {
      stage.setPlaying(false);
      W.silence();
      stage.sync();
    }
    if (play.phase === 'slow') play.phase = 'run';
    const from = dotOf(play.g);
    const k = jumpOnce();
    play.move = s.fern ? null : { from, to: dotOf(play.g), corner: k };
    play.trail.push({ at: dotOf(play.g), age: 0 });
    if (play.trail.length > 30) play.trail.shift();
    status(s, true);
    stage.draw();
  }

  function nearCorner(p, s, stage) {
    if (s.fern || !play) return -1;
    const L = layout ?? measure(stage.width, stage.height, s);
    const x = p.x * stage.width,
      y = p.y * stage.height;
    let best = -1,
      bestD = 24 ** 2;
    play.points.forEach((q, k) => {
      const [qx, qy] = toPx(L, q);
      const d = (qx - x) ** 2 + (qy - y) ** 2;
      if (d < bestD) [best, bestD] = [k, d];
    });
    return best;
  }

  // ---------- the panel ----------

  function controls(s, stage) {
    return (
      stage.slider('corners', t.corners, 3, M.CORNERS, 1, s.corners) +
      stage.slider('jump', t.jump, 20, 80, 1, s.jump, '%', t.jumpHint) +
      stage.check('rule', t.rule, s.rule) +
      stage.check('fern', t.fern, s.fern)
    );
  }

  function bindControls(panel, s, stage) {
    // The stage records a ticked box; the game then starts again with it.
    panel.querySelectorAll('[data-check]').forEach((box) =>
      box.addEventListener('change', () => {
        if (box.dataset.check === 'rule' && s.fern) {
          s.fern = false;
          panel.querySelector('[data-check="fern"]').checked = false;
        }
        stage.setChosen(-1);
        restart(s, stage);
        stage.sync();
      }),
    );
  }

  function readouts(s) {
    const preset = presets.findIndex((p) => Object.keys(p.settings).every((k) => p.settings[k] === s[k]));
    $('scene-name').textContent = preset >= 0 ? presets[preset].name : t.yourOwn;
  }

  /** The map's picture: the triangle in three colours, drawn once. */
  function preview(ctx, width, height) {
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, width, height);
    const scale = ctx.getTransform?.().a || 1;
    const side = Math.round(Math.min(width, height) * 0.94 * scale);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = side;
    const off = canvas.getContext('2d');
    const image = off.createImageData(side, side);
    const pixels = new Uint32Array(image.data.buffer);
    const hits = new Uint8Array(side * side);
    const g = M.game({ corners: M.regular(3), seed: 3 });
    for (let i = 0; i < side * side * 2; i++) {
      const k = M.jump(g);
      if (i < 20) continue;
      const bx = Math.floor(((g.x + 1) / 2) * side),
        by = Math.floor(((1 - g.y) / 2) * side);
      const j = by * side + bx;
      if (hits[j] < 255) hits[j]++;
      pixels[j] = CORNER_PALETTE[k * LEVELS + LEVEL[hits[j]]];
    }
    off.putImageData(image, 0, 0);
    const s = side / scale;
    ctx.drawImage(canvas, (width - s) / 2, (height - s) / 2, s, s);
  }

  const zero = { ax: 0, ay: 0, bx: 0, by: 0, cx: 0, cy: 0, dx: 0, dy: 0, ex: 0, ey: 0, fx: 0, fy: 0 };
  const defaults = { corners: 3, jump: 50, rule: false, fern: false, ...zero };
  const presetSettings = [
    { corners: 3, jump: 50, rule: false, fern: false },
    { corners: 4, jump: 50, rule: false, fern: false },
    { corners: 4, jump: 50, rule: true, fern: false },
    { corners: 5, jump: Math.round(M.touching(5) * 1000) / 10, rule: false, fern: false }, // 61.8: the copies touch
    { corners: 3, jump: 50, rule: false, fern: true },
  ].map((p) => ({ ...p, ...zero }));
  const badges = ['3', '4', '≠', '5', '❦'];
  const presets = t.presets.map((p, i) => ({ ...p, badge: badges[i], settings: presetSettings[i] }));
  const isDefault = (s) => Object.keys(defaults).every((k) => s[k] === defaults[k]);

  W.defineRoom({
    id: 'chaos',
    symbol: '⁂',
    theme: 'chance',
    added: '2026-10-07',
    eyebrow: t.eyebrow,
    name: t.name,
    tagline: t.tagline,
    accent: { background: '#16222a', border: '#5cc8f0', color: '#cdeefa' },

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
    connection: { ...t.connection, go: 'weather' },

    defaults,
    ranges: {
      corners: [3, M.CORNERS, 'integer'],
      jump: [20, 80],
      ...Object.fromEntries(Object.keys(zero).map((k) => [k, [-2, 2]])),
    },
    defaultPreset: 0,
    presets,

    guests: [
      {
        ...t.guests[0],
        bio: 'Sierpinski',
        color: '#ffd166',
        sketch: {
          hairStyle: 'receding',
          hair: '#3a332c',
          moustache: true,
          glasses: 'round',
          skin: '#efd2b8',
          backdrop: '#e8e1d2',
        },
      },
      {
        ...t.guests[1],
        color: '#3dd6a3',
        sketch: { hairStyle: 'short', hair: '#cfc8bd', glasses: 'square', skin: '#f0cfb2', backdrop: '#dfe8ea' },
      },
    ],

    insight: t.insight,

    controls,
    bindControls,
    readouts,
    draw,
    preview,
    step,

    enter(s, stage) {
      grabbing = -1;
      pending = null;
      $('scene-canvas').style.cursor = '';
      // The first visit, with nothing shared, opens with the slow jumps; otherwise a game for the settings.
      const fresh = firstVisit && isDefault(s);
      firstVisit = false;
      if (!play || play.key !== keyOf(s) || fresh) {
        newGame(s, fresh && stage.playing ? 'slow' : 'quick');
        play.instant = !stage.playing;
      }
      lastStatus = 0;
    },

    onInput(s, stage) {
      // A new number of corners starts from the regular shape; any slider leaves the fern.
      if (play && s.corners !== play.points.length) Object.assign(s, zero);
      if (s.fern) {
        s.fern = false;
        const box = document.querySelector('#scene-controls [data-check="fern"]');
        if (box) box.checked = false;
      }
      restart(s, stage);
    },

    onPreset(s, stage) {
      restart(s, stage);
    },

    action: oneJump,

    /** "Start again": the same game from the start, with its slow jumps. */
    reset(s, stage) {
      restart(s, stage, stage.playing ? 'slow' : 'quick');
    },

    pointer: {
      // A finger drags a corner; anywhere else it scrolls the page, and a tap starts the dot there.
      drag: (p, s, stage) => nearCorner(p, s, stage) >= 0,
      down(p, s, stage, e) {
        if (e && e.button > 0) return;
        grabbing = nearCorner(p, s, stage);
        pending = grabbing < 0 ? p : null;
        if (grabbing >= 0) stage.draw();
      },
      move(p, { dragging }, s, stage) {
        if (grabbing < 0) {
          if (!dragging) $('scene-canvas').style.cursor = nearCorner(p, s, stage) >= 0 ? 'grab' : '';
          return;
        }
        if (!dragging || !layout) return;
        const regular = M.regular(s.corners)[grabbing];
        const [x, y] = toWorld(layout, [p.x * stage.width, p.y * stage.height]);
        const key = offsetKeys[grabbing];
        s[key + 'x'] = Math.round((x - regular[0]) * 1000) / 1000;
        s[key + 'y'] = Math.round((y - regular[1]) * 1000) / 1000;
        stage.setChosen(-1);
        newGame(s, 'quick');
        finish(DRAG_JUMPS);
        play.rate = TOP_RATE;
        stage.sync();
        stage.draw();
      },
      up(e) {
        const s = W.stage.settingsFor('chaos');
        if (grabbing >= 0) {
          grabbing = -1;
          if (!W.stage.playing) finish();
        } else if (pending && e?.type !== 'pointercancel' && layout) {
          const at = toWorld(layout, [pending.x * W.stage.width, pending.y * W.stage.height]);
          restart(s, W.stage, W.stage.playing ? 'slow' : 'quick', at);
        }
        pending = null;
        W.stage.draw();
      },
      leave() {
        $('scene-canvas').style.cursor = '';
      },
      /** Enter makes one jump. */
      key(e, s, stage) {
        if (e.key !== 'Enter') return false;
        oneJump(s, stage);
        return true;
      },
    },
  });
})();
