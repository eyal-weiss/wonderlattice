/* Room · Fold a dragon: fold a strip of paper in half again and again, then open every crease to a right angle. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $ } = W;
  const M = W.models.dragon;
  const t = W.text('dragon');
  const reduced = W.prefersReducedMotion();
  const PI = Math.PI,
    TAU = 2 * Math.PI;

  const BG = '#0a0e15';
  const BANDS = 96; // colour steps along a strip
  // Colours from one end of the strip to the other; with four dragons, one pair each.
  const ONE = ['#ffd27a', '#ff9a5c', '#ef5d8c', '#a970ea', '#58b8ee'];
  const FOUR = [
    ['#ffe08a', '#ff7f45'],
    ['#a4ecff', '#3f78e6'],
    ['#d2f7a0', '#2fa866'],
    ['#f8bcff', '#a64fd8'],
  ];

  /** `n` colours evenly along a list of stops. */
  function ramp(stops, n) {
    const rgb = stops.map((c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)));
    return Array.from({ length: n }, (_, i) => {
      const f = (i / Math.max(1, n - 1)) * (rgb.length - 1),
        a = Math.min(rgb.length - 2, Math.floor(f)),
        u = f - a;
      const [r, g, b] = rgb[a].map((v, k) => Math.round(v + (rgb[a + 1][k] - v) * u));
      return `rgb(${r}, ${g}, ${b})`;
    });
  }
  const RAMPS = [ramp(ONE, BANDS), ...FOUR.map((stops) => ramp(stops, BANDS))];

  const bendOf = (angle) => PI - (angle * PI) / 180; // a crease angle in degrees (180 = flat) → how far it turns
  const headingFor = (folds) => -M.chord(folds); // so the opened dragon's start and end lie level
  const ease = (p) => (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2);
  /** From angle a towards b, the short way round. */
  const turnTowards = (a, b, p) => a + (((((b - a) % TAU) + TAU + PI) % TAU) - PI) * p;
  const num = (n) => n.toLocaleString(W.numberLocale);

  /**
   * What the picture shows: the strip (folded `folds` times), how far each fold's creases bend, the first piece's
   * heading, how far the three extra dragons have opened (0–1), and, while it folds, how long a strip the view keeps
   * room for (`span`, in pieces) and how thick the paper looks (`paper`, in layers drawn as width).
   */
  function settled(s) {
    return {
      folds: s.folds,
      angle: s.angle,
      bend: M.evenly(s.folds, bendOf(s.angle)),
      start: headingFor(s.folds),
      copies: 1,
      span: 0,
      paper: 0,
    };
  }
  let show = settled({ folds: 10, angle: 90 });
  let phases = []; // the animation still to come
  let elapsed = 0; // seconds into phases[0]
  let still = null; // the finished picture, drawn once
  let said = ''; // the words above the picture, to change them only when they change
  const buffers = [0, 1, 2, 3].map(() => new Float64Array(0));

  /** Set the picture for a moment `p` (0–1) of a phase. */
  function apply(phase, p, s) {
    const e = ease(Math.min(1, Math.max(0, p))),
      N = show.folds,
      target = bendOf(s.angle);
    if (phase.kind === 'fold') {
      // The creases made by this fold go from flat to folded; the earlier ones are folded, the later ones not yet made.
      for (let k = 1; k <= N; k++) show.bend[k] = k < phase.k ? PI : k === phase.k ? e * PI : 0;
      show.start = 0;
      show.span = 0.7 * 2 ** (N - (phase.k - 1 + e) / 2); // the stack shrinks on screen, but by less than it really does
      show.paper = 2 ** ((phase.k - 1 + e) / 4);
    } else if (phase.kind === 'hold') {
      show.bend.fill(PI);
      show.span = 0.7 * 2 ** (N / 2);
      show.paper = 2 ** (N / 4);
    } else if (phase.kind === 'open') {
      show.bend.fill(PI + (target - PI) * e);
      show.start = turnTowards(0, headingFor(N), e);
      show.span = 0.7 * 2 ** (N / 2);
      show.paper = 2 ** (N / 4) * (1 - e) ** 2;
    } else if (phase.kind === 'more') {
      // A new crease in the middle of every piece bends from flat to the crease angle; the others stay as they are.
      for (let k = 1; k <= N; k++) show.bend[k] = k < N ? target : target * e;
      show.start = turnTowards(headingFor(N - 1), headingFor(N), e);
    } else if (phase.kind === 'bloom') show.copies = e;
  }

  /** Run a list of phases, or (with reduced motion, or paused) go straight to how they end. */
  function run(s, stage, list) {
    still = null;
    if (reduced || !stage.playing) return finish(s);
    phases = list;
    elapsed = 0;
    apply(phases[0], 0, s);
    status(s);
  }

  function finish(s) {
    const was = phases.length > 0;
    phases = [];
    elapsed = 0;
    show = settled(s);
    status(s);
    if (was) W.announce($('scene-status').textContent);
  }

  /** From a flat strip: fold it `s.folds` times, then open it. */
  function foldAndOpen(s, stage, slow = false) {
    show = { ...settled(s), bend: M.evenly(s.folds, 0), start: 0 };
    const list = [];
    for (let k = 1; k <= s.folds; k++)
      list.push({ kind: 'fold', k, duration: slow ? 1.4 : Math.max(0.3, 1.05 * 0.76 ** (k - 1)) });
    list.push({ kind: 'hold', k: s.folds, duration: 0.45 }, { kind: 'open', duration: 2.4 });
    run(s, stage, list);
  }

  /** From the folded stack: open it (all four dragons together, with four on). */
  function openFromStack(s, stage) {
    show = { ...settled(s), bend: M.evenly(s.folds, PI), start: 0 };
    run(s, stage, [{ kind: 'open', duration: 2.2 }]);
  }

  function step(dt, s) {
    if (!phases.length) return;
    elapsed += dt;
    while (phases.length && elapsed >= phases[0].duration) {
      apply(phases[0], 1, s);
      elapsed -= phases[0].duration;
      phases.shift();
      if (!phases.length) return finish(s);
    }
    apply(phases[0], elapsed / phases[0].duration, s);
    status(s);
  }

  // ---------- drawing ----------

  /** The corners of dragon q (0 for the first; 1–3 for the copies turned about its start). */
  function cornersOf(state, q) {
    const bend =
      q === 0 || state.copies >= 1 ? state.bend : state.bend.map((b) => PI + (b - PI) * Math.max(0, state.copies));
    buffers[q] = M.corners(state.folds, bend, state.start + (q * PI) / 2, buffers[q]);
    return buffers[q];
  }

  /** Draw a state, fitted into the box (x, y, w, h); the background covers the whole canvas. */
  function paint(ctx, width, height, s, state, box = { x: 0, y: 0, w: width, h: height }) {
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, width, height);
    const dragons = s.four && state.copies > 0 ? [1, 2, 3, 0] : [0];
    const lists = dragons.map((q) => cornersOf(state, q));
    const b = M.bounds(...lists.map((l) => l.subarray(0, 2 * (2 ** state.folds + 1))));
    const margin = Math.max(14, Math.min(box.w, box.h) * 0.05);
    const room = [box.w - 2 * margin, box.h - 2 * margin];
    const scale = Math.min(
      room[0] / Math.max(1e-6, b.maxX - b.minX),
      room[1] / Math.max(1e-6, b.maxY - b.minY),
      state.span > 0 ? room[0] / state.span : Infinity,
    );
    const cx = box.x + box.w / 2 - ((b.minX + b.maxX) / 2) * scale,
      cy = box.y + box.h / 2 - ((b.minY + b.maxY) / 2) * scale;
    const base = Math.max(3, Math.min(8, height * 0.012));
    // About a fifth of a piece, so the paths that meet at a corner stay apart; at least a little more than a pixel, so
    // the colours show when the pieces get tiny; and thick while it's a folded stack of paper.
    const line = Math.min(Math.max(0.22 * scale, Math.min(0.5 * scale, 1.5)), 12);
    ctx.lineWidth = Math.min(Math.max(line, state.paper > 0 ? base * state.paper : 0), Math.min(box.w, box.h) * 0.12);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    dragons.forEach((q, i) => strokeStrip(ctx, lists[i], state.folds, RAMPS[s.four ? q + 1 : 0], scale, cx, cy));
  }

  /**
   * One strip with rounded corners: from the middle of each piece to the middle of the next, curving through the
   * crease, so where the dragon touches itself at a corner the two paths are seen to pass each other.
   */
  function strokeStrip(ctx, points, folds, colours, scale, cx, cy) {
    const pieces = 2 ** folds,
      bands = Math.min(BANDS, pieces);
    const X = (j) => cx + points[2 * j] * scale,
      Y = (j) => cy + points[2 * j + 1] * scale;
    const midX = (j) => (X(j) + X(j + 1)) / 2,
      midY = (j) => (Y(j) + Y(j + 1)) / 2;
    for (let band = 0; band < bands; band++) {
      const from = Math.floor((band * pieces) / bands),
        to = Math.floor(((band + 1) * pieces) / bands);
      ctx.beginPath();
      let j = from;
      if (from === 0) {
        ctx.moveTo(X(0), Y(0));
        ctx.lineTo(midX(0), midY(0));
        j = 1;
      } else ctx.moveTo(midX(from - 1), midY(from - 1));
      for (; j < to; j++) ctx.quadraticCurveTo(X(j), Y(j), midX(j), midY(j));
      if (to === pieces) ctx.lineTo(X(pieces), Y(pieces));
      ctx.strokeStyle = colours[Math.round((band / Math.max(1, bands - 1)) * (colours.length - 1))];
      ctx.stroke();
    }
  }

  function draw(ctx, s, stage) {
    const { width, height } = stage;
    // Settings changed from outside (a moment brought back from the trail, say): show them as they are.
    if (!phases.length && (show.folds !== s.folds || show.angle !== s.angle)) show = settled(s);
    if (phases.length || show.copies < 1) return paint(ctx, width, height, s, show);
    // The finished picture is drawn once and then copied, frame after frame.
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const key = `${s.folds}|${s.angle}|${s.four}|${width}|${height}|${dpr}`;
    if (!still || still.key !== key) {
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const c = canvas.getContext('2d');
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint(c, width, height, s, show);
      still = { key, canvas };
    }
    ctx.drawImage(still.canvas, 0, 0, width, height);
  }

  /** For the map and the link preview: the ten-fold dragon in the middle square, which the map's picture shows. */
  function preview(ctx, width, height) {
    const side = Math.min(width, height);
    paint(ctx, width, height, defaults, settled(defaults), {
      x: (width - side) / 2,
      y: (height - side) / 2,
      w: side,
      h: side,
    });
  }

  /** For the trail and saving: the finished dragon, not a moment of the folding. */
  function trailCanvas(s, stage) {
    const scale = 2,
      canvas = document.createElement('canvas');
    canvas.width = Math.round(stage.width * scale);
    canvas.height = Math.round(stage.height * scale);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    paint(ctx, stage.width, stage.height, s, settled(s));
    return canvas;
  }

  // ---------- words ----------

  function words(s) {
    const phase = phases[0];
    if (phase && (phase.kind === 'fold' || phase.kind === 'hold')) {
      const layers = num(2 ** phase.k);
      return [t.folding, phase.k >= 8 ? t.paperLimit(phase.k, layers) : t.foldStatus(phase.k, layers)];
    }
    if (phase?.kind === 'open') return [t.opening, t.openStatus];
    if (phase?.kind === 'more') return [t.oneMore, t.moreStatus];
    const name = s.four ? t.fourDragons : t.dragon;
    if (s.angle !== 90) return [name, t.angleStatus(num(s.angle))];
    return [name, s.four ? t.fourStatus(s.folds) : t.rightStatus(s.folds, num(2 ** s.folds))];
  }

  function status(s) {
    const [name, line] = words(s);
    if (name + line === said) return;
    said = name + line;
    $('scene-name').textContent = name;
    $('scene-status').textContent = line;
  }

  // ---------- settings ----------

  const presetSettings = [
    { folds: 10, angle: 90, four: false },
    { folds: 9, angle: 90, four: true },
    { folds: 4, angle: 90, four: false },
  ];
  const defaults = { ...presetSettings[0] };

  W.defineRoom({
    id: 'dragon',
    symbol: '⌐',
    theme: 'making',
    added: '2026-10-07',
    eyebrow: t.eyebrow,
    name: t.name,
    tagline: t.tagline,
    accent: { background: '#2b1f24', border: '#f2a36b', color: '#ffe0c7' },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.sceneLabel,
    sceneName: t.sceneName,
    tip: t.tip,
    actionLabel: t.actionLabel,
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { ...t.connection, go: 'tiles' },

    defaults,
    ranges: { folds: [1, M.MAX_FOLDS, 'integer'], angle: [0, 180, 'integer'] },
    defaultPreset: 0,
    presets: t.presets.map((p, i) => ({ ...p, badge: ['10', '4×', '4'][i], settings: presetSettings[i] })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Gardner',
        color: '#f2a36b',
        sketch: { hairStyle: 'receding', hair: '#dcd6ca', skin: '#f0d2b4', brows: 'soft', backdrop: '#2b1f24' },
      },
      {
        ...t.guests[1],
        color: '#9fb8ff',
        sketch: { hairStyle: 'bald', hair: '#cfc8bb', skin: '#f1d3b8', glasses: 'square', backdrop: '#1d2436' },
      },
      {
        ...t.guests[2],
        color: '#c8f59a',
        sketch: { hairStyle: 'long', hair: '#7a5232', skin: '#f3d6bf', backdrop: '#1f2b1d' },
      },
    ],

    insight: t.insight,

    controls: (s, stage) =>
      stage.slider('folds', t.folds, 1, M.MAX_FOLDS, 1, s.folds) +
      stage.slider('angle', t.angle, 0, 180, 1, s.angle, '°') +
      stage.check('four', t.four, s.four),

    bindControls(panel, s, stage) {
      // The stage has already set s.four when this runs; with four on, the three new dragons open from their stacks.
      panel.querySelector('[data-check="four"]').addEventListener('change', () => {
        stage.setChosen(-1);
        finish(s);
        if (s.four) {
          show.copies = 0;
          run(s, stage, [{ kind: 'bloom', duration: 2 }]);
        }
        stage.sync();
        stage.draw();
      });
    },

    readouts: status,
    draw,
    step,
    preview,
    trailCanvas,

    enter(s, stage) {
      s.folds = Math.round(Math.min(M.MAX_FOLDS, Math.max(1, s.folds)));
      s.angle = Math.round(Math.min(180, Math.max(0, s.angle)));
      said = '';
      foldAndOpen(s, stage);
    },
    onPreset(s, stage) {
      said = '';
      if (s.folds <= 4) foldAndOpen(s, stage, true);
      else openFromStack(s, stage);
    },
    onInput(s) {
      finish(s);
    },
    reset(s, stage) {
      foldAndOpen(s, stage);
      stage.sync();
    },
    /** Fold once more: a new crease in the middle of every piece. After the last, back to one fold. */
    action(s, stage) {
      stage.setChosen(-1);
      if (s.folds >= M.MAX_FOLDS) {
        s.folds = 1;
        foldAndOpen(s, stage);
        W.announce(t.restarted);
      } else {
        finish(s);
        s.folds += 1;
        show = { ...settled(s), start: headingFor(s.folds - 1) };
        show.bend[s.folds] = 0;
        run(s, stage, [{ kind: 'more', duration: 1.3 }]);
      }
      stage.refresh();
      stage.draw();
    },
  });
})();
