/* Room · Kaleidoscope of cheaters: the prisoner's dilemma on a grid, where everyone copies the best neighbour. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, TAU, clamp } = W;
  const M = W.models.cheaters;
  const t = W.text('cheaters');
  const reduced = W.prefersReducedMotion();

  const RATES = [1, 2, 5, 8, 12]; // generations a second, per speed
  const HISTORY = 200; // generations shown on the chart
  const CROWD = 0.1; // share of cheaters in "A mixed crowd"
  const CROWD_SEED = 1992; // the same crowd every time, so a shared link shows the same start
  const STILL_AT = 60; // with reduced motion, a fresh start opens on this generation rather than a lone dot
  const MAX_PERIOD = 4; // repeating patterns up to this period are named in the status line
  const SPARK_MS = 1600; // how long a stray cheater's ring shows
  // Nowak and May's colours: blue cooperates, red cheats, yellow has just started cooperating, green cheating.
  const COLOURS = {
    cooperator: [61, 116, 201],
    cheater: [209, 69, 59],
    newCooperator: [240, 196, 60],
    newCheater: [79, 179, 106],
  };
  const KINDS = ['cooperator', 'cheater', 'newCooperator', 'newCheater'];
  const css = ([r, g, b]) => `rgb(${r},${g},${b})`;

  let grid = null,
    start = -1, // the start the grid was made from
    edited = false, // has the visitor switched cells by hand since the start?
    owed = 0, // fractional generations owed to the clock
    history = [], // share cooperating, one entry per generation, newest last
    recent = [], // the last few grids, to spot a pattern that repeats
    period = 0, // 1 when settled for good, 2 to MAX_PERIOD when repeating, 0 otherwise
    told = '', // the last status read out to screen readers
    random = M.rng(1),
    layout = null,
    aim = null, // keyboard aim, as a cell index
    hover = -1, // the cell under the mouse
    pending = -1, // the cell a press started on, switched when the press ends as a tap
    spark = null, // { i, at }: a stray cheater's ring
    buffer = null,
    image = null;

  // ------------------------------------------------------------ simulation

  /** Back to generation 0 of the chosen start. */
  function fresh(s) {
    grid ??= M.create();
    start = s.start;
    if (start === 1) M.startCrowd(grid, CROWD, CROWD_SEED);
    else M.startOne(grid);
    edited = false;
    owed = 0;
    history = [M.cooperators(grid) / grid.c.length];
    unsettle();
    spark = null;
    random = M.rng(7 + start);
    // With reduced motion nothing moves by itself, so open on a pattern worth seeing.
    if (reduced) for (let g = 0; g < STILL_AT && !period; g++) generation(s);
  }

  /** One generation, everyone at once or one at a time, then note what the grid is doing. */
  function generation(s) {
    if (period === 1) return;
    const changed = s.together ? M.step(grid, s.b) : M.stepOneByOne(grid, s.b, random);
    history.push(M.cooperators(grid) / grid.c.length);
    if (history.length > HISTORY) history.shift();
    spark = null;
    period = 0;
    if (!changed && M.settled(grid, s.b)) period = 1;
    else if (s.together)
      // The rule is fixed, so a pattern seen p generations ago comes back every p generations from now on.
      for (let p = 2; p <= recent.length && !period; p++) if (same(recent[recent.length - p])) period = p;
    remember();
  }

  const same = (cells) => cells.every((v, i) => v === grid.c[i]);

  /** Keep the last few grids, to spot a pattern that repeats. */
  function remember() {
    recent.push(Uint8Array.from(grid.c));
    if (recent.length > MAX_PERIOD) recent.shift();
  }

  /** Something changed by hand or by a setting: forget what the grid was doing. */
  function unsettle() {
    period = 0;
    recent = [];
    if (grid) remember();
  }

  // ---------------------------------------------------------------- words

  const share = () => M.cooperators(grid) / grid.c.length;

  /** The share cooperating as a percentage, never rounded to 0 or 100 while both kinds remain. */
  function percent(value) {
    let p = value * 100;
    if (value > 0 && value < 1)
      p = p > 99.5 ? Math.floor(p * 10) / 10 : p < 0.5 ? Math.ceil(p * 10) / 10 : Math.round(p);
    return new Intl.NumberFormat(W.numberLocale, { maximumFractionDigits: 1, useGrouping: false }).format(p);
  }

  function statusText() {
    const value = share(),
      p = percent(value);
    if (value === 0) return t.allCheat(grid.gen);
    if (value === 1) return t.allCooperate(grid.gen);
    if (period === 1) return t.settled(grid.gen, p);
    if (period > 1) return t.repeating(period, p);
    return t.status(grid.gen, p);
  }

  function sceneName(s) {
    if (edited) return t.mixed;
    if (!s.together) return t.sceneNames[2];
    return t.sceneNames[start === 1 ? 1 : 0];
  }

  /** The status line and scene name; a settled or repeating grid is read out once. */
  function report(s) {
    const words = statusText();
    if ($('scene-status').textContent !== words) $('scene-status').textContent = words;
    const name = sceneName(s);
    if ($('scene-name').textContent !== name) $('scene-name').textContent = name;
    const final = period > 0 || share() === 0 || share() === 1;
    if (final && words !== told && W.stage.isShowing(room)) {
      told = words;
      W.announce(words);
    } else if (!final) told = '';
  }

  // --------------------------------------------------------------- layout

  /**
   * Where the grid and the chart go. On wide screens the grid sits top left with the chart and the colour key beside
   * it, and the inspector below it: the grid gives up a little of its size so the three share the picture's height
   * (it is never taller than the window). Only when that would shrink the grid too much does the inspector stay away.
   * On phones the picture is short (it stays pinned while the controls scroll), so the grid fills its height, a slim
   * meter stands beside it, and the key is in the panel.
   */
  function measure(width, height) {
    const pad = 12,
      gap = 28;
    if (width >= 600) {
      const alone = Math.max(160, Math.min(height - 2 * pad, width * 0.57, 600));
      const inspectorHeight = clamp(Math.round(height * 0.26), 160, 190);
      const shared = Math.min(alone, height - 2 * pad - gap - inspectorHeight);
      const inspect = shared >= Math.max(240, alone * 0.7);
      const size = inspect ? shared : alone;
      const x = pad + size + gap,
        below = pad + size + gap;
      return {
        wide: true,
        inspect,
        x: pad,
        y: pad,
        size,
        side: { x, y: pad, w: width - x - pad, h: size },
        below: { x: pad, y: below, w: width - 2 * pad, h: height - below - pad },
      };
    }
    const size = Math.max(100, Math.min(height - 2 * pad, width - 2 * pad - 50));
    const room = width - size - 3 * pad;
    if (room < 34) return { wide: false, x: (width - size) / 2, y: pad, size, side: null };
    return { wide: false, x: pad, y: pad, size, side: { x: 2 * pad + size, y: pad, w: room, h: size } };
  }

  /** Canvas point (unit coordinates) → the cell under it, or −1 off the grid. */
  function cellAt(p, stage) {
    if (!layout || !grid) return -1;
    const n = grid.n;
    const gx = Math.floor(((p.x * stage.width - layout.x) / layout.size) * n),
      gy = Math.floor(((p.y * stage.height - layout.y) / layout.size) * n);
    return gx < 0 || gy < 0 || gx >= n || gy >= n ? -1 : gy * n + gx;
  }

  // -------------------------------------------------------------- drawing

  /** Paint the grid into a small image, one pixel per cell, in Nowak and May's four colours (or two). */
  function paint(g, showNew) {
    if (!buffer || buffer.width !== g.n) {
      buffer = document.createElement('canvas');
      buffer.width = buffer.height = g.n;
      image = buffer.getContext('2d').createImageData(g.n, g.n);
    }
    const px = image.data;
    for (let i = 0; i < g.c.length; i++) {
      const now = g.c[i],
        switched = showNew && now !== g.was[i];
      const [r, gg, b] = now
        ? switched
          ? COLOURS.newCooperator
          : COLOURS.cooperator
        : switched
          ? COLOURS.newCheater
          : COLOURS.cheater;
      px[i * 4] = r;
      px[i * 4 + 1] = gg;
      px[i * 4 + 2] = b;
      px[i * 4 + 3] = 255;
    }
    buffer.getContext('2d').putImageData(image, 0, 0);
    return buffer;
  }

  function draw(ctx, s, stage) {
    const { width, height } = stage;
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    if (!grid) return;
    layout = measure(width, height);
    const { x, y, size } = layout;
    ctx.imageSmoothingEnabled = false; // crisp cells
    ctx.drawImage(paint(grid, s.fresh), x, y, size, size);
    ctx.imageSmoothingEnabled = true;
    ctx.strokeStyle = '#3a4656';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 0.5, y - 0.5, size + 1, size + 1);
    marks(ctx);
    const { side } = layout;
    if (layout.wide) {
      const chartH = Math.min(230, side.h * 0.5);
      chart(ctx, side.x, side.y, side.w, chartH);
      key(ctx, s, side.x, side.y + chartH + 36, side.w);
      if (layout.inspect) inspector(ctx, s, layout.below);
    } else if (side) meter(ctx, side);
    // Without room for the key on the canvas (phones), the one in the panel shows.
    const panelKey = $('cheaters-key');
    if (panelKey && panelKey.hidden !== layout.wide) panelKey.hidden = layout.wide;
    report(s);
  }

  /** The cell under the mouse, the keyboard's aim, and a ring round a stray cheater. */
  function marks(ctx) {
    const { x, y, size } = layout;
    const n = grid.n,
      cell = size / n;
    const box = (i) => [x + (i % n) * cell, y + Math.floor(i / n) * cell];
    if (layout.inspect) {
      // The neighbourhood the inspector below magnifies.
      const [bx, by] = box(inspected());
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx - cell - 0.5, by - cell - 0.5, 3 * cell + 1, 3 * cell + 1);
    }
    ctx.lineWidth = 1.5;
    for (const i of [hover, aim ?? -1]) {
      if (i < 0) continue;
      const [cx, cy] = box(i);
      ctx.strokeStyle = '#ffffff';
      ctx.strokeRect(cx - 1, cy - 1, cell + 2, cell + 2);
      if (i === aim) {
        ctx.beginPath();
        ctx.moveTo(cx + cell / 2, cy - 12);
        ctx.lineTo(cx + cell / 2, cy - 3);
        ctx.moveTo(cx + cell / 2, cy + cell + 3);
        ctx.lineTo(cx + cell / 2, cy + cell + 12);
        ctx.moveTo(cx - 12, cy + cell / 2);
        ctx.lineTo(cx - 3, cy + cell / 2);
        ctx.moveTo(cx + cell + 3, cy + cell / 2);
        ctx.lineTo(cx + cell + 12, cy + cell / 2);
        ctx.stroke();
      }
    }
    if (spark) {
      const age = reduced ? 0 : (performance.now() - spark.at) / SPARK_MS;
      if (age >= 1) spark = null;
      else {
        const [cx, cy] = box(spark.i);
        ctx.globalAlpha = 1 - age;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx + cell / 2, cy + cell / 2, cell * 2 + 8 + age * 14, 0, TAU);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }

  /** The share cooperating over the last generations, with Nowak and May's estimate as a dashed line. */
  function chart(ctx, x, y, w, h) {
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '600 11px system-ui, sans-serif';
    ctx.fillStyle = '#98aab7';
    ctx.fillText(t.chart.title, x, y + 11, w);
    ctx.font = '500 30px system-ui, sans-serif';
    ctx.fillStyle = '#e8eef5';
    ctx.fillText(`${percent(share())}%`, x, y + 50, w);
    const plot = { x: x + 34, y: y + 64, w: w - 34, h: Math.max(30, h - 82) };
    const yOf = (v) => plot.y + plot.h * (1 - v);
    ctx.fillStyle = '#121a26';
    ctx.fillRect(plot.x, plot.y, plot.w, plot.h);
    ctx.font = '400 11px system-ui, sans-serif';
    ctx.fillStyle = '#8494a3';
    ctx.textAlign = 'right';
    for (const v of [0, 0.5, 1]) ctx.fillText(`${percent(v)}%`, plot.x - 5, yOf(v) + 4);
    ctx.textAlign = 'left';
    estimateLine(ctx, plot.x, plot.x + plot.w, yOf(M.ESTIMATE));
    ctx.fillStyle = '#e3c76f';
    ctx.fillText(t.chart.estimate, plot.x + 4, yOf(M.ESTIMATE) - 5, plot.w - 8);
    // The share, newest at the right edge.
    ctx.strokeStyle = '#8fb8f0';
    ctx.fillStyle = '#8fb8f0';
    ctx.lineWidth = 2;
    if (history.length > 1) {
      const step = plot.w / (HISTORY - 1),
        left = plot.x + plot.w - (history.length - 1) * step;
      ctx.beginPath();
      history.forEach((v, k) => (k ? ctx.lineTo : ctx.moveTo).call(ctx, left + k * step, yOf(v)));
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(plot.x + plot.w, yOf(history[history.length - 1] ?? 1), 3, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#8494a3';
    ctx.fillText(t.chart.span(HISTORY), plot.x, plot.y + plot.h + 14, plot.w);
  }

  /** Nowak and May's estimate, a dashed line from x0 to x1. */
  function estimateLine(ctx, x0, x1, y) {
    ctx.strokeStyle = '#f0c43c';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  /** On phones: the share cooperating as a slim upright meter, with the estimate marked. */
  function meter(ctx, { x, y, w, h }) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '600 12px system-ui, sans-serif';
    ctx.fillStyle = '#e8eef5';
    ctx.fillText(`${percent(share())}%`, x + w / 2, y + 12, w);
    const bar = { x: x + w / 2 - 7, y: y + 22, w: 14, h: h - 22 };
    ctx.fillStyle = '#121a26';
    ctx.fillRect(bar.x, bar.y, bar.w, bar.h);
    ctx.fillStyle = css(COLOURS.cooperator);
    const filled = bar.h * share();
    ctx.fillRect(bar.x, bar.y + bar.h - filled, bar.w, filled);
    estimateLine(ctx, bar.x - 6, bar.x + bar.w + 6, bar.y + bar.h * (1 - M.ESTIMATE));
  }

  /** What each colour means: four entries, or two when the newly switched aren't coloured. */
  function key(ctx, s, x, y, w) {
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '600 11px system-ui, sans-serif';
    ctx.fillStyle = '#98aab7';
    ctx.fillText(t.key.title, x, y + 11, w);
    KINDS.filter((name, k) => s.fresh || k < 2).forEach((name, k) => {
      const top = y + 30 + k * 26;
      ctx.fillStyle = css(COLOURS[name]);
      ctx.fillRect(x, top, 13, 13);
      ctx.font = '400 14px system-ui, sans-serif';
      ctx.fillStyle = '#dfe7ef';
      ctx.fillText(t.key[name], x + 20, top + 11, w - 24);
    });
  }

  /** The key in the panel, for screens where the canvas has no room for it. */
  function panelKey(s) {
    const items = KINDS.map(
      (name, k) =>
        `<li${k > 1 ? ' class="cheaters-new"' : ''}${k > 1 && !s.fresh ? ' hidden' : ''}>` +
        `<svg viewBox="0 0 14 14" aria-hidden="true"><rect width="14" height="14" rx="2" fill="${css(COLOURS[name])}"/></svg>` +
        `${t.key[name]}</li>`,
    ).join('');
    return (
      `<div class="cheaters-key wide" id="cheaters-key"><span class="cheaters-key-title">${t.key.title}</span>` +
      `<ul>${items}</ul></div>`
    );
  }

  /** The player the inspector shows: under the mouse, else the keyboard's aim, else the one in the middle. */
  const inspected = () => (hover >= 0 ? hover : (aim ?? (grid.n >> 1) * grid.n + (grid.n >> 1)));

  /**
   * Below the grid on wide screens: one player's neighbourhood, magnified, with every score, and the strategy it
   * takes next, so the rule can be seen at work.
   */
  function inspector(ctx, s, box) {
    const n = grid.n,
      i = inspected(),
      x0 = i % n,
      y0 = Math.floor(i / n);
    const block = [];
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const x = x0 + dx,
          y = y0 + dy;
        block.push(x < 0 || y < 0 || x >= n || y >= n ? -1 : y * n + x);
      }
    // The scores as they stand now (the grid's own may be a generation old).
    let bestC = -1,
      bestD = -1;
    for (const j of block) {
      if (j < 0) continue;
      grid.score[j] = M.scoreOf(grid, s.b, j);
      if (grid.c[j]) bestC = Math.max(bestC, grid.score[j]);
      else bestD = Math.max(bestD, grid.score[j]);
    }
    const best = Math.max(bestC, bestD),
      next = M.choose(grid, i);
    const number = (v) => new Intl.NumberFormat(W.numberLocale, { maximumFractionDigits: 2 }).format(v);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '600 11px system-ui, sans-serif';
    ctx.fillStyle = '#98aab7';
    ctx.fillText(t.inspect.title, box.x, box.y + 11, box.w);
    ctx.font = '400 12px system-ui, sans-serif';
    ctx.fillStyle = '#8494a3';
    const top = wrap(ctx, t.inspect.hint, box.x, box.y + 30, box.w, 16) + 6;
    const cell = Math.max(24, Math.min(46, (box.y + box.h - top) / 3, box.w * 0.22));
    block.forEach((j, k) => {
      const cx = box.x + (k % 3) * cell,
        cy = top + Math.floor(k / 3) * cell;
      ctx.fillStyle = j < 0 ? '#121a26' : css(grid.c[j] ? COLOURS.cooperator : COLOURS.cheater);
      ctx.fillRect(cx + 1, cy + 1, cell - 2, cell - 2);
      if (j < 0) return;
      ctx.font = '600 13px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(number(grid.score[j]), cx + cell / 2, cy + cell / 2 + 5, cell - 4);
      ctx.textAlign = 'left';
      if (Math.abs(grid.score[j] - best) < 1e-9 || k === 4) {
        ctx.strokeStyle = k === 4 ? '#ffffff' : '#f0c43c';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx + 2, cy + 2, cell - 4, cell - 4);
      }
    });
    // In words: what it is, the best score around it, and what it takes next.
    const tx = box.x + 3 * cell + 20,
      tw = box.w - 3 * cell - 20;
    ctx.font = '400 14px system-ui, sans-serif';
    ctx.fillStyle = '#dfe7ef';
    let line = wrap(ctx, t.inspect.player(!grid.c[i], number(grid.score[i])), tx, top + 14, tw, 20) + 4;
    const tie = bestC >= 0 && bestD >= 0 && Math.abs(bestC - bestD) < 1e-9;
    line =
      wrap(ctx, tie ? t.inspect.tie(number(best)) : t.inspect.best(bestD > bestC, number(best)), tx, line, tw, 20) + 4;
    ctx.fillStyle = '#f3dca6';
    wrap(ctx, t.inspect.next(!next), tx, line, tw, 20);
  }

  /** Write words across lines no wider than w, from (x, y); returns the baseline after the last line. */
  function wrap(ctx, words, x, y, w, height) {
    let line = '';
    for (const word of words.split(' ')) {
      const longer = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(longer).width > w) {
        ctx.fillText(line, x, y);
        y += height;
        line = word;
      } else line = longer;
    }
    if (line) ctx.fillText(line, x, y);
    return y + height;
  }

  /** The home card: the kaleidoscope a few dozen generations after one cheater, filling the card. */
  function preview(ctx, width, height) {
    const g = M.startOne(M.create());
    for (let k = 0; k < 60; k++) M.step(g, 1.85);
    const side = Math.max(width, height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(paint(g, true), (width - side) / 2, (height - side) / 2, side, side);
    ctx.imageSmoothingEnabled = true;
  }

  // ---------------------------------------------------------------- input

  /** Switch one cell by hand: a cooperator starts cheating, a cheater cooperates again. */
  function flip(i, stage) {
    if (i < 0 || !grid) return;
    M.toggle(grid, i);
    edited = true;
    unsettle();
    stage.setChosen(-1);
    stage.sync();
    stage.draw();
  }

  // ----------------------------------------------------------------- room

  const defaults = { b: 1.85, start: 0, together: true, fresh: true, speed: 3 };
  const presetSettings = [
    { start: 0, b: 1.85, together: true },
    { start: 1, b: 1.85, together: true },
    { start: 0, b: 1.85, together: false },
  ];
  const badges = ['✦', '⁘', '↯'];

  const room = W.defineRoom({
    id: 'cheaters',
    symbol: '❖',
    theme: 'life',
    added: '2026-10-03',
    eyebrow: t.eyebrow,
    name: t.name,
    tagline: t.tagline,
    accent: { background: '#1d2230', border: '#e0b44c', color: '#f6dc9a' },

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
    ranges: { b: [1, 2.5], start: [0, 1, 'integer'], speed: [1, RATES.length, 'integer'] },
    defaultPreset: 0,
    presets: t.presets.map((p, i) => ({ ...p, badge: badges[i], settings: presetSettings[i] })),

    guests: [
      {
        ...t.guests[0],
        bio: 'May_Robert',
        color: '#f0c43c',
        sketch: { hairStyle: 'swept', hair: '#e8e2d6', skin: '#efcdb0', brows: 'bold', backdrop: '#1d2230' },
      },
      {
        ...t.guests[1],
        color: '#8fb8f0',
        sketch: { hairStyle: 'short', hair: '#4a3a2e', skin: '#f0d0b4', backdrop: '#1d2633' },
      },
      {
        ...t.guests[2],
        bio: 'Tucker_Albert',
        color: '#e07a6e',
        sketch: { hairStyle: 'receding', hair: '#8c847a', skin: '#ecc9a8', glasses: 'round', backdrop: '#2a1f22' },
      },
    ],

    insight: t.insight,

    controls: (s, stage) =>
      stage.slider('b', t.temptation, 1, 2.5, 0.05, s.b, '', `${t.temptationHint} ${t.window}`) +
      stage.slider('speed', t.speed, 1, RATES.length, 1, s.speed) +
      stage.check('together', t.together, s.together) +
      stage.check('fresh', t.fresh, s.fresh) +
      `<button class="button wide cheaters-next" id="cheaters-next" type="button">${t.next}</button>` +
      panelKey(s),

    bindControls(panel, s, stage) {
      // The stage stores the tick; switching how players update changes what the grid is doing, and the scene.
      panel.querySelector('[data-check="together"]').addEventListener('change', () => {
        unsettle();
        stage.setChosen(-1);
        stage.sync();
        stage.draw();
      });
      panel.querySelector('[data-check="fresh"]').addEventListener('change', (e) => {
        panel.querySelectorAll('.cheaters-new').forEach((li) => (li.hidden = !e.target.checked));
      });
      $('cheaters-next').addEventListener('click', () => {
        if (!grid) return;
        generation(s);
        stage.draw();
      });
    },

    readouts(s) {
      if ($('v-speed')) $('v-speed').textContent = t.perSecond(RATES[s.speed - 1]);
    },

    enter(s, stage) {
      aim = null;
      hover = -1;
      pending = -1;
      if (!grid || start !== s.start) fresh(s);
      stage.draw();
    },

    step(dt, s) {
      if (!grid || period === 1) return;
      owed += dt * RATES[s.speed - 1];
      // At most two generations a frame, so a slow frame doesn't make the pattern jump.
      for (let k = 0; k < 2 && owed >= 1; k++) {
        owed -= 1;
        generation(s);
      }
      owed = Math.min(owed, 1);
    },

    draw,
    preview,

    /** A cheater appears at a random cooperator's place, breaking any symmetry. */
    action(s, stage) {
      if (!grid) return;
      const cooperators = M.cooperators(grid);
      if (!cooperators) return;
      let i;
      do i = Math.floor(Math.random() * grid.c.length);
      while (!grid.c[i]);
      M.toggle(grid, i);
      edited = true;
      unsettle();
      spark = { i, at: performance.now() };
      stage.setChosen(-1);
      stage.sync();
      stage.draw();
      W.announce(t.stray);
    },
    reset(s, stage) {
      fresh(s);
      stage.draw();
    },
    onPreset(s, stage) {
      fresh(s);
      stage.draw();
    },
    onInput(s, stage) {
      // A new temptation acts on the grid as it is; nothing starts again.
      unsettle();
      stage.draw();
    },

    pointer: {
      down(p, s, stage, e) {
        pending = e && e.button > 0 ? -1 : cellAt(p, stage);
      },
      move(p, { mouse, dragging }, s, stage) {
        if (dragging && pending >= 0 && cellAt(p, stage) !== pending) pending = -1; // a drag, not a tap
        const before = hover;
        hover = mouse && !dragging ? cellAt(p, stage) : -1;
        if (hover !== before && !stage.playing) stage.draw();
      },
      up(e) {
        // A press that ends where it began switches its cell; a scroll or cancelled gesture doesn't.
        const i = pending;
        pending = -1;
        if (e?.type === 'pointerup' && i >= 0) flip(i, W.stage);
      },
      leave() {
        hover = -1;
      },
      escape: () => (aim = null),
      arrow(dx, dy) {
        if (!grid) return;
        const n = grid.n;
        aim ??= (n >> 1) * n + (n >> 1) - dx - dy * n; // the first press shows the aim in the middle
        const x = clamp((aim % n) + dx, 0, n - 1),
          y = clamp(Math.floor(aim / n) + dy, 0, n - 1);
        aim = y * n + x;
      },
      key(e, s, stage) {
        if (e.key !== 'Enter' || !grid) return false;
        aim ??= (grid.n >> 1) * grid.n + (grid.n >> 1);
        flip(aim, stage);
        return true;
      },
    },
  });
})();
