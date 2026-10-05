/* Room · The imperfect treasure detector: Bayes' rule, and why rare treasure makes most beeps false alarms. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, clamp } = W;
  const M = W.models.treasure;
  const t = W.text('treasure');
  const reduced = W.prefersReducedMotion();

  const COLS = 20,
    ROWS = 13,
    SWEEP_SECONDS = 1.6;
  const DOT_COLS = 40,
    DOT_ROWS = 25; // the 1,000 squares, as dots
  const RATIO = 2.8; // an island square is this many dots wide, so the two parts keep their proportions
  // The four kinds of square, in the dots' order, and their counts in model.perThousand().
  const KINDS = ['found', 'missed', 'falseAlarm', 'quiet'];
  const COUNTS = { found: 'found', missed: 'missed', falseAlarm: 'falseAlarms', quiet: 'quiet' };
  const COLOURS = {
    sea: '#0b1d2b',
    wave: '#16354a',
    sand: '#c9b27a',
    sandDark: '#b59d66',
    gold: '#f7c948',
    alarm: '#ff8a65',
    hole: '#3a2d20',
    dim: '#27323e',
    ink: '#f4f5e9',
    muted: '#98aab7',
  };

  // The island being played: rebuilt when the odds or the seed change. Sweeping and digging live here, not in
  // the settings, like the dice room's tally.
  let board = null,
    key = '',
    swept = 0, // 0 not yet, 0–1 while the detector passes, 1 done
    dug = new Set(),
    cursor = null,
    layout = null, // the last frame's geometry, for the pointer
    revealed = false; // the answer shows after the first dig, or once the visitor changes the odds

  const detectors = (s) => (s.second ? 2 : 1);

  function current(s) {
    const k = `${s.treasure}|${s.accuracy}|${s.second}|${s.seed}`;
    if (k !== key) {
      key = k;
      board = M.island({
        cols: COLS,
        rows: ROWS,
        r: s.treasure / 100,
        a: s.accuracy / 100,
        detectors: detectors(s),
        seed: s.seed,
      });
      dug = new Set();
      cursor = null;
    }
    return board;
  }

  /**
   * Where the island and the 1,000 dots go. The picture is never taller than the window, so the two share its
   * height: the island above the dots, with the dots' key beside them (or below them on a narrow picture), or the two
   * side by side on a very wide picture, whichever lets both be largest while filling it. An island square stays
   * RATIO dots wide, so neither part grows at the other's expense. Returns the island's square size and corner
   * (`cell`, `gx`, `gy`), where its title goes, and the dots' layout (see drawDots).
   */
  function place(ctx, width, height) {
    const pad = Math.max(10, Math.min(width, height) * 0.04);
    const small = Math.round(Math.min(13, Math.max(10, Math.min(width, height) / 30)));
    const title = small * 1.6, // a part's title, above it
      line = small + 3, // one line of the key
      gap = small * 1.5; // between the dots and a key beside them
    const innerW = width - 2 * pad,
      innerH = height - 2 * pad;
    ctx.font = `${small - 1}px system-ui`;
    const keyW = Math.max(...KINDS.map((kind) => ctx.measureText(`000 ${t.labels[kind]}`).width)) + 18;
    const keyH = (perLine) => (KINDS.length / perLine) * line + small * 0.6;
    const keyRow = (perLine) => perLine * keyW + (perLine - 1) * 8; // the key's width, two to a line or one
    // The island with its rim of sea, measured in dot spacings.
    const seaW = (COLS + 0.8) * RATIO,
      seaH = (ROWS + 0.8) * RATIO;

    // Stacked, with the key beside the dots, or below them two to a line (one on a very narrow picture).
    const beside = Math.min(
      (innerH - pad - 2 * title) / (seaH + DOT_ROWS),
      innerW / seaW,
      (innerW - gap - keyW) / DOT_COLS,
    );
    const below = innerW >= keyRow(2) ? 2 : 1;
    const under = Math.min(
      (innerH - pad - 2 * title - keyH(below)) / (seaH + DOT_ROWS),
      innerW / seaW,
      innerW / DOT_COLS,
    );
    // Side by side, each part centred in the height: only where both would be larger and fill most of it.
    let side = 0,
      sideLine = 1;
    for (const perLine of [2, 1]) {
      const room = innerW - 2 * pad; // less the space between the parts
      const s = Math.min(
        room / (seaW + DOT_COLS),
        (room - keyRow(perLine)) / seaW,
        (innerH - title) / seaH,
        (innerH - title - keyH(perLine)) / DOT_ROWS,
      );
      if (s > side) [side, sideLine] = [s, perLine];
    }
    const sideFills = Math.max(title + seaH * side, title + DOT_ROWS * side + keyH(sideLine)) >= innerH * 0.75;

    if (sideFills && side > Math.max(beside, under)) {
      const s = side,
        cell = s * RATIO;
      const islandW = seaW * s,
        columnW = Math.max(DOT_COLS * s, keyRow(sideLine));
      const x0 = (width - islandW - 2 * pad - columnW) / 2,
        iy = pad + (innerH - title - seaH * s) / 2,
        dy = pad + (innerH - title - DOT_ROWS * s - keyH(sideLine)) / 2,
        bx = x0 + islandW + 2 * pad;
      const ox = bx + (columnW - DOT_COLS * s) / 2,
        oy = dy + title;
      return {
        cell,
        small,
        gx: x0 + cell * 0.4,
        gy: iy + title + cell * 0.4,
        islandTitle: { x: x0, y: iy + small },
        dots: {
          title: { x: bx, y: dy + small },
          ox,
          oy,
          step: s,
          key: { x: bx, y: oy + DOT_ROWS * s + small * 1.2, perLine: sideLine, colW: columnW / sideLine },
          note: { x: bx + columnW / 2, y: oy + DOT_ROWS * s + small * 1.4, width: columnW, align: 'center' },
        },
      };
    }

    const aside = beside >= under;
    const s = aside ? beside : under,
      cell = s * RATIO;
    const islandW = seaW * s,
      dotsW = DOT_COLS * s;
    // A key beside the dots takes the width the island leaves, so the two rows line up when they can.
    const colW = aside ? clamp(islandW - dotsW - gap, keyW, innerW - dotsW - gap) : 0;
    const blockW = aside ? dotsW + gap + colW : Math.max(dotsW, keyRow(below));
    const total = 2 * title + pad + seaH * s + DOT_ROWS * s + (aside ? 0 : keyH(below));
    const top = pad + (innerH - total) / 2; // centred when the width is what limits the parts
    const sx = (width - islandW) / 2,
      dy = top + title + seaH * s + pad,
      bx = (width - blockW) / 2;
    const ox = aside ? bx : bx + (blockW - dotsW) / 2,
      oy = dy + title;
    return {
      cell,
      small,
      gx: sx + cell * 0.4,
      gy: top + title + cell * 0.4,
      islandTitle: { x: sx, y: top + small },
      dots: {
        title: { x: bx, y: dy + small },
        ox,
        oy,
        step: s,
        key: aside
          ? { x: ox + dotsW + gap, y: oy + (DOT_ROWS * s - (KINDS.length - 1) * line) / 2 + small * 0.35, perLine: 1 }
          : { x: bx, y: oy + DOT_ROWS * s + small * 1.2, perLine: below, colW: blockW / below },
        note: aside
          ? { x: ox + dotsW + gap, y: oy + (DOT_ROWS * s) / 2, width: colW, align: 'left', middle: true }
          : { x: width / 2, y: oy + DOT_ROWS * s + small * 1.4, width: innerW, align: 'center' },
      },
    };
  }

  /**
   * The home card's layout, made once by `npm run previews`: side by side, the island taking `split` of the width
   * and the dots' key below them, sized for the counts `n`. Kept as it was, so the card's picture is unchanged.
   */
  function cardLayout(ctx, width, height, split, n) {
    const pad = Math.max(10, Math.min(width, height) * 0.04);
    const islandBox = { x: pad, y: pad, w: width * split - pad * 1.5, h: height - pad * 2 };
    const box = { x: width * split + pad * 0.5, y: pad, w: width * (1 - split) - pad * 1.5, h: height - pad * 2 };
    const small = Math.round(Math.min(13, Math.max(10, Math.min(width, height) / 30)));
    const cell = Math.min(islandBox.w / COLS, (islandBox.h - small * 1.6) / ROWS);
    ctx.font = `${small - 1}px system-ui`;
    const widest = Math.max(...KINDS.map((kind) => ctx.measureText(`${n[COUNTS[kind]]} ${t.labels[kind]}`).width)) + 18;
    const perLine = box.w >= widest * 2 + 8 ? 2 : 1;
    const legendH = (KINDS.length / perLine) * (small + 3) + small * 0.6;
    const step = Math.min(box.w / DOT_COLS, (box.h - small * 1.6 - legendH) / DOT_ROWS);
    const oy = box.y + small * 1.6;
    return {
      cell,
      small,
      gx: islandBox.x + (islandBox.w - cell * COLS) / 2,
      gy: islandBox.y + small * 1.6 + (islandBox.h - small * 1.6 - cell * ROWS) / 2,
      islandTitle: { x: islandBox.x, y: islandBox.y + small },
      dots: {
        title: { x: box.x, y: box.y + small },
        ox: box.x + (box.w - step * DOT_COLS) / 2,
        oy,
        step,
        key: { x: box.x, y: oy + DOT_ROWS * step + small * 1.2, perLine, colW: box.w / 2 },
        note: { x: box.x + box.w / 2, y: oy + DOT_ROWS * step + small * 1.4, width: box.w, align: 'center' },
      },
    };
  }

  /** Break words into lines no wider than `width`, in the context's current font. */
  function wrap(ctx, words, width) {
    const lines = [];
    let line = '';
    for (const word of words.split(' ')) {
      const longer = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(longer).width > width) {
        lines.push(line);
        line = word;
      } else line = longer;
    }
    return line ? [...lines, line] : lines;
  }

  /** The island, with its sweep and digs: `state` is { swept, dug, cursor } (the live board, or a preview). */
  function drawIsland(ctx, b, L, clock, state) {
    const { swept, dug, cursor } = state;
    const { cell, gx, gy, small } = L;
    ctx.fillStyle = COLOURS.muted;
    ctx.font = `600 ${small}px system-ui`;
    ctx.textAlign = 'left';
    ctx.fillText(t.labels.island, L.islandTitle.x, L.islandTitle.y);
    // The sea, with small wave marks on some of its squares.
    ctx.fillStyle = COLOURS.sea;
    ctx.beginPath();
    ctx.roundRect(gx - cell * 0.4, gy - cell * 0.4, cell * (COLS + 0.8), cell * (ROWS + 0.8), cell * 0.6);
    ctx.fill();
    ctx.strokeStyle = COLOURS.wave;
    ctx.lineWidth = Math.max(1, cell * 0.06);
    for (let i = 0; i < COLS * ROWS; i++) {
      if (b.land.has(i) || (i * 37) % 11 !== 0) continue;
      const drift = reduced ? 0 : Math.sin(clock * 0.8 + i) * cell * 0.08;
      const x = gx + (i % COLS) * cell + cell * 0.2 + drift,
        y = gy + Math.floor(i / COLS) * cell + cell * 0.55;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + cell * 0.15, y - cell * 0.14, x + cell * 0.3, y);
      ctx.quadraticCurveTo(x + cell * 0.45, y + cell * 0.14, x + cell * 0.6, y);
      ctx.stroke();
    }
    // A pale beach round the land, so the coast reads as a shore rather than as blocks.
    ctx.fillStyle = '#e6d7a8';
    for (const i of b.land) {
      const x = gx + (i % COLS) * cell,
        y = gy + Math.floor(i / COLS) * cell;
      ctx.beginPath();
      ctx.roundRect(x - cell * 0.18, y - cell * 0.18, cell * 1.36, cell * 1.36, cell * 0.45);
      ctx.fill();
    }
    const sweepRow = swept * ROWS;
    for (const i of b.land) {
      const x = gx + (i % COLS) * cell,
        y = gy + Math.floor(i / COLS) * cell;
      ctx.fillStyle = (i * 37 + Math.floor(i / COLS) * 11) % 7 === 0 ? COLOURS.sandDark : COLOURS.sand;
      ctx.fillRect(x, y, cell, cell);
      ctx.strokeStyle = 'rgba(90, 70, 40, 0.18)'; // faint lines, so each square is a place to dig
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, cell - 1, cell - 1);
      const passed = Math.floor(i / COLS) < sweepRow;
      if (dug.has(i)) {
        if (b.treasure.has(i)) {
          // A gold coin with a glint.
          ctx.fillStyle = COLOURS.gold;
          ctx.beginPath();
          ctx.arc(x + cell / 2, y + cell / 2, cell * 0.34, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fff4c2';
          ctx.beginPath();
          ctx.arc(x + cell * 0.4, y + cell * 0.4, cell * 0.09, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = COLOURS.hole;
          ctx.beginPath();
          ctx.ellipse(x + cell / 2, y + cell / 2, cell * 0.3, cell * 0.22, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (passed && b.beeps.has(i)) {
        // A beep: a ring that pulses softly (still under reduced motion).
        const pulse = reduced ? 0 : (Math.sin(clock * 3 + i) + 1) * 0.06;
        ctx.strokeStyle = COLOURS.alarm;
        ctx.lineWidth = Math.max(1.5, cell * 0.11);
        ctx.beginPath();
        ctx.arc(x + cell / 2, y + cell / 2, cell * (0.4 + pulse), 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    if (swept > 0 && swept < 1) {
      // The detector passing down the island.
      const y = gy + sweepRow * cell;
      ctx.fillStyle = 'rgba(255, 138, 101, 0.18)';
      ctx.fillRect(gx - cell * 0.4, y - cell * 0.5, cell * (COLS + 0.8), cell);
      ctx.strokeStyle = COLOURS.alarm;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(gx - cell * 0.4, y);
      ctx.lineTo(gx + cell * (COLS + 0.4), y);
      ctx.stroke();
    }
    if (cursor !== null) {
      ctx.strokeStyle = COLOURS.ink;
      ctx.lineWidth = 2;
      ctx.strokeRect(gx + (cursor % COLS) * cell + 1, gy + Math.floor(cursor / COLS) * cell + 1, cell - 2, cell - 2);
    }
  }

  /**
   * 1,000 squares as dots, sorted: treasure the detector finds, treasure it misses, false alarms, quiet sand. `D` is
   * the dots' layout: { title: {x, y}, ox, oy (the grid's corner), step, key: { x, y, perLine, colW }, note }, the
   * note being where the promise goes before the first dig: { x, y, width, align, middle }.
   */
  function drawDots(ctx, n, D, small, hidden = false) {
    const kinds = KINDS.map((kind) => [n[COUNTS[kind]], kind]);
    const { ox, oy, step } = D,
      cols = DOT_COLS;
    const r = Math.max(1, step * 0.36);
    ctx.fillStyle = COLOURS.muted;
    ctx.font = `600 ${small}px system-ui`;
    ctx.textAlign = 'left';
    ctx.fillText(t.labels.thousand, D.title.x, D.title.y);
    if (hidden) {
      // Before the first dig: plain dots and a promise, so the picture doesn't answer the question for you.
      for (let k = 0; k < cols * DOT_ROWS; k++) {
        ctx.beginPath();
        ctx.arc(ox + (k % cols) * step + step / 2, oy + Math.floor(k / cols) * step + step / 2, r, 0, Math.PI * 2);
        ctx.fillStyle = COLOURS.dim;
        ctx.fill();
      }
      ctx.fillStyle = COLOURS.ink;
      ctx.font = `600 ${small}px system-ui`;
      ctx.textAlign = D.note.align;
      const lines = wrap(ctx, t.labels.hidden, D.note.width),
        lead = Math.round(small * 1.35);
      const y = D.note.middle ? D.note.y - ((lines.length - 1) * lead) / 2 + small * 0.35 : D.note.y;
      lines.forEach((words, i) => ctx.fillText(words, D.note.x, y + i * lead));
      ctx.textAlign = 'left';
      return;
    }
    let k = 0;
    for (const [count, kind] of kinds)
      for (let i = 0; i < count; i++, k++) {
        const x = ox + (k % cols) * step + step / 2,
          y = oy + Math.floor(k / cols) * step + step / 2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        if (kind === 'found' || kind === 'quiet') {
          ctx.fillStyle = kind === 'found' ? COLOURS.gold : COLOURS.dim;
          ctx.fill();
        } else {
          ctx.strokeStyle = kind === 'missed' ? COLOURS.gold : COLOURS.alarm;
          ctx.lineWidth = Math.max(1, r * 0.55);
          ctx.stroke();
        }
      }
    const { key } = D;
    ctx.font = `${small - 1}px system-ui`;
    kinds.forEach(([count, kind], i) => {
      const x = key.x + (i % key.perLine) * (key.colW ?? 0),
        y = key.y + Math.floor(i / key.perLine) * (small + 3);
      ctx.beginPath();
      ctx.arc(x + 5, y - small * 0.32, 4, 0, Math.PI * 2);
      if (kind === 'found' || kind === 'quiet') {
        ctx.fillStyle = kind === 'found' ? COLOURS.gold : '#4a5866';
        ctx.fill();
      } else {
        ctx.strokeStyle = kind === 'missed' ? COLOURS.gold : COLOURS.alarm;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.fillStyle = COLOURS.muted;
      ctx.fillText(`${count} ${t.labels[kind]}`, x + 14, y);
    });
  }

  function draw(ctx, s, stage) {
    const { width, height, clock } = stage;
    const b = current(s);
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    ctx.textBaseline = 'alphabetic';
    ctx.direction = 'ltr'; // the picture's labels keep their places on right-to-left pages too
    layout = place(ctx, width, height);
    drawIsland(ctx, b, layout, clock, { swept, dug, cursor });
    drawDots(
      ctx,
      M.perThousand(s.treasure / 100, s.accuracy / 100, detectors(s)),
      layout.dots,
      layout.small,
      !revealed,
    );
  }

  /** The home card and link preview: an island already swept and dug, so the surprise shows at a glance. */
  function preview(ctx, width, height) {
    const s = { treasure: 2, accuracy: 95, second: false, seed: 3 };
    const b = M.island({ cols: COLS, rows: ROWS, r: 0.02, a: 0.95, seed: s.seed });
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    ctx.direction = 'ltr';
    const n = M.perThousand(0.02, 0.95);
    const L = cardLayout(ctx, width, height, 0.64, n);
    drawIsland(ctx, b, L, 0, { swept: 1, dug: new Set(b.beeps), cursor: null });
    drawDots(ctx, n, L.dots, L.small);
  }

  /** The square under a pointer position, if it is land. */
  function squareAt(p, stage) {
    if (!layout || !board) return null;
    const { cell, gx, gy } = layout;
    const x = Math.floor((p.x * stage.width - gx) / cell),
      y = Math.floor((p.y * stage.height - gy) / cell);
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return null;
    const i = y * COLS + x;
    return board.land.has(i) ? i : null;
  }

  function status(s) {
    const b = current(s);
    if (swept < 1) return t.status.ready;
    const beeps = b.beeps.size;
    const dugBeeps = [...dug].filter((i) => b.beeps.has(i));
    const found = dugBeeps.filter((i) => b.treasure.has(i)).length;
    if (dugBeeps.length === 0) return t.status.swept(beeps);
    if (dugBeeps.length < beeps) return t.status.digging(dugBeeps.length, beeps, found);
    return t.status.done(beeps, found);
  }

  function allDug(s) {
    const b = current(s);
    return swept >= 1 && [...b.beeps].every((i) => dug.has(i));
  }

  function readouts(s) {
    current(s);
    $('scene-status').textContent = status(s);
    $('scene-action').textContent = swept < 1 ? t.actions.sweep : allDug(s) ? t.actions.again : t.actions.digAll;
    if ($('v-treasure')) $('v-treasure').textContent = t.share(s.treasure);
    if ($('v-accuracy')) $('v-accuracy').textContent = `${s.accuracy}%`;
    const n = M.perThousand(s.treasure / 100, s.accuracy / 100, detectors(s));
    const box = $('treasure-readout');
    if (box)
      box.innerHTML =
        `<div class="treasure-big"><span>${t.readout.title}</span><strong>${revealed ? t.readout.percent(n.found / Math.max(1, n.found + n.falseAlarms)) : t.readout.unknown}</strong></div>` +
        `<p>${revealed ? t.readout.story(n.total, n.treasure, n.found, n.falseAlarms, s.second) : t.readout.hidden}</p>`;
  }

  /** From now on the answer shows: the visitor has dug, or is changing the odds themselves. */
  function reveal(stage) {
    if (revealed) return;
    revealed = true;
    stage.sync();
    stage.draw();
  }

  function sweep(s, stage) {
    current(s);
    swept = reduced ? 1 : 0.001;
    stage.sync();
    stage.draw();
    if (reduced) W.announce(status(s));
  }

  function dig(i, s, stage) {
    if (swept === 0) return sweep(s, stage); // the first tap sweeps; taps during the sweep wait for it
    if (swept < 1) return;
    if (dug.has(i)) return;
    dug.add(i);
    revealed = true;
    const b = current(s);
    W.announce(allDug(s) ? status(s) : b.treasure.has(i) ? t.dug.treasure : b.beeps.has(i) ? t.dug.nothing : t.quiet);
    stage.sync();
    stage.draw();
  }

  function fresh() {
    swept = 0;
    dug = new Set();
    cursor = null;
  }

  W.defineRoom({
    id: 'treasure',
    symbol: '◎',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'chance',
    added: '2026-09-28',
    tagline: t.tagline,
    accent: { background: '#2b2616', border: '#f7c948', color: '#fbe29a' },

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
    connection: { ...t.connection, go: 'dice' },

    still: true,
    defaults: { treasure: 2, accuracy: 95, second: false, seed: 1 },
    previewSettings: { treasure: 2, accuracy: 95, second: false, seed: 3 },
    ranges: { treasure: [1, 50, 'integer'], accuracy: [50, 99, 'integer'], seed: [1, 9999, 'integer'] },
    defaultPreset: 1,
    presets: [
      { settings: { treasure: 30, accuracy: 90, second: false } },
      { settings: { treasure: 2, accuracy: 95, second: false } },
      { settings: { treasure: 2, accuracy: 95, second: true } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Bayes',
        color: '#f7c948',
        // A Presbyterian minister of the 1700s: a white wig.
        sketch: { hairStyle: 'wig', hair: '#e9e4d8', skin: '#efcaa6', backdrop: '#2b2616' },
      },
      {
        ...t.guests[1],
        bio: 'Laplace',
        color: '#ff8a65',
        sketch: { hairStyle: 'curly', hair: '#8a8580', skin: '#eec6a2', brows: 'bold', backdrop: '#2e2320' },
      },
    ],

    insight: t.insight,

    controls: (s, stage) =>
      stage.slider('treasure', t.treasure, 1, 50, 1, s.treasure, '', t.treasureHint) +
      stage.slider('accuracy', t.accuracy, 50, 99, 1, s.accuracy, '', t.accuracyHint) +
      stage.check('second', t.second, s.second) +
      // Rebuilt on every change, so not a live region; results are announced instead.
      '<div class="wide readout treasure-readout" id="treasure-readout"></div>',

    bindControls(panel, s, stage) {
      // The checkbox changes the odds too: refresh the readout, and say the new chance once.
      panel.querySelector('[data-check="second"]')?.addEventListener('change', () => {
        revealed = true;
        stage.sync();
        const n = M.perThousand(s.treasure / 100, s.accuracy / 100, detectors(s));
        W.announce(`${t.readout.title}: ${t.readout.percent(n.found / Math.max(1, n.found + n.falseAlarms))}`);
      });
      for (const id of ['c-treasure', 'c-accuracy'])
        $(id).addEventListener('change', () => {
          const n = M.perThousand(s.treasure / 100, s.accuracy / 100, detectors(s));
          W.announce(`${t.readout.title}: ${t.readout.percent(n.found / Math.max(1, n.found + n.falseAlarms))}`);
        });
    },
    onInput(s, stage) {
      current(s); // a new island for new odds; if it was swept, its beeps show at once
      reveal(stage);
    },
    onPreset(s, stage) {
      fresh();
      reveal(stage);
    },
    readouts,
    draw,
    preview,
    step(dt, s, stage) {
      if (swept > 0 && swept < 1) {
        swept = Math.min(1, swept + dt / SWEEP_SECONDS);
        if (swept === 1) {
          stage.sync();
          W.announce(status(s));
        }
      }
    },
    action(s, stage) {
      if (swept < 1) return sweep(s, stage);
      const b = current(s);
      if (allDug(s)) {
        s.seed = (s.seed % 9999) + 1;
        fresh();
        current(s);
        stage.sync();
        stage.draw();
        return;
      }
      for (const i of b.beeps) dug.add(i);
      revealed = true;
      W.announce(status(s));
      stage.sync();
      stage.draw();
    },
    reset(s, stage) {
      fresh();
      stage.sync();
      stage.draw();
    },

    pointer: {
      down(p, s, stage) {
        const i = squareAt(p, stage);
        if (i !== null) dig(i, s, stage);
      },
      arrow(dx, dy, s) {
        const b = current(s);
        const land = [...b.land];
        if (cursor === null) {
          cursor = land[Math.floor(land.length / 2)];
          return;
        }
        let x = (cursor % COLS) + dx,
          y = Math.floor(cursor / COLS) + dy;
        // Step over the sea to the next land square in that direction.
        while (x >= 0 && y >= 0 && x < COLS && y < ROWS && !b.land.has(y * COLS + x)) {
          x += dx;
          y += dy;
        }
        if (b.land.has(y * COLS + x)) cursor = y * COLS + x;
      },
      key(e, s, stage) {
        if (e.key !== 'Enter') return false;
        if (cursor === null) cursor = [...current(s).land][0];
        dig(cursor, s, stage);
        return true;
      },
      escape: () => (cursor = null),
    },
  });
})();
