/* Room · How much picture can you throw away? The 8×8 cosine transform behind JPEG, and which numbers matter. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, clamp } = W;
  const M = W.models.compress;
  const { SIZE, B, PICTURES, PICTURE_ORDER } = M;
  const t = W.text('compress');

  const COLORS = {
    background: '#0a0e15',
    frame: '#2c3847',
    label: '#a7b4c6',
    cursor: '#ddf6a3',
    positive: [247, 223, 179], // a building block's bright parts
    negative: [37, 48, 64], // and its dark parts
  };
  const VERDICT_LIMITS = [0.03, 0.07, 0.15]; // difference (share of full brightness) for each verdict step

  let room = null,
    edited = null, // the visitor's own picture, once they draw (not in shared links: it would be 4,096 numbers)
    cursor = null, // keyboard cursor on the picture, { x, y }, or null
    brush = null, // the brightness a drag paints (0 or 255), or null
    version = 0, // bumped on every stroke, so the cache knows the picture changed
    announceTimer = 0,
    cached = { key: '' };

  const baseImage = (s) => PICTURES[PICTURE_ORDER[s.picture]]();

  /** The picture, its numbers, what survives, and the measures, recomputed only when something changed. */
  function result(s) {
    const key = [s.picture, s.mode, s.keep, edited ? version : 'base'].join();
    if (cached.key === key) return cached;
    const picKey = [s.picture, edited ? version : 'base'].join();
    if (cached.picKey !== picKey) {
      const image = edited ?? baseImage(s);
      const coeffs = M.transform(image);
      Object.assign(cached, { picKey, image, coeffs, order: M.strength(coeffs), original: canvasOf(image) });
    }
    const { kept, mask, count } = M.keep(cached.coeffs, cached.order, s.keep / 100, s.mode);
    const rebuilt = M.inverse(kept);
    const difference = M.difference(cached.image, rebuilt);
    Object.assign(cached, {
      key,
      count,
      difference,
      energy: M.energyKept(cached.coeffs, mask),
      use: M.patternUse(mask),
      survivor: canvasOf(rebuilt),
      verdict: VERDICT_LIMITS.findIndex((limit) => difference < limit),
    });
    if (cached.verdict < 0) cached.verdict = VERDICT_LIMITS.length;
    return cached;
  }

  /** A 64×64 grey picture as a small canvas, drawn later at any size (drawImage honours the stage's scaling). */
  function canvasOf(image) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = SIZE;
    const c = canvas.getContext('2d');
    const data = c.createImageData(SIZE, SIZE);
    for (let i = 0; i < SIZE * SIZE; i++) {
      const v = clamp(Math.round(image[i]), 0, 255);
      data.data.set([v, v, v, 255], i * 4);
    }
    c.putImageData(data, 0, 0);
    return canvas;
  }

  // The 64 building blocks, drawn once.
  let patterns = null;
  function patternsCanvas() {
    if (patterns) return patterns;
    patterns = document.createElement('canvas');
    patterns.width = patterns.height = B * B + (B - 1); // 8 patterns of 8 pixels, a 1-pixel gap between them
    const c = patterns.getContext('2d');
    const data = c.createImageData(patterns.width, patterns.height);
    for (let u = 0; u < B; u++)
      for (let v = 0; v < B; v++) {
        const p = M.pattern(u, v);
        for (let y = 0; y < B; y++)
          for (let x = 0; x < B; x++) {
            const f = (p[y * B + x] + 1) / 2;
            const px = v * (B + 1) + x,
              py = u * (B + 1) + y;
            const rgb = COLORS.negative.map((n, i) => Math.round(n + (COLORS.positive[i] - n) * f));
            data.data.set([...rgb, 255], (py * patterns.width + px) * 4);
          }
      }
    c.putImageData(data, 0, 0);
    return patterns;
  }

  /** Three squares in a row: your picture, what survives, the building blocks. */
  function layout(width, height, labels) {
    const pad = Math.max(8, Math.min(width, height) * 0.035);
    const gap = Math.max(8, width * 0.025);
    const small = Math.round(clamp(width / 60, 10, 13));
    const top = labels ? small + 8 : 0;
    const bottom = labels ? small + 6 : 0;
    const side = Math.max(20, Math.min((width - 2 * pad - 2 * gap) / 3, height - 2 * pad - top - bottom));
    const x0 = (width - (3 * side + 2 * gap)) / 2;
    const y0 = pad + top + Math.max(0, (height - 2 * pad - top - bottom - side) / 2);
    const square = (i) => ({ x: x0 + i * (side + gap), y: y0, s: side });
    return { small, picture: square(0), survivor: square(1), blocks: square(2) };
  }

  function render(ctx, s, stage, { labels = true } = {}) {
    const { width, height } = stage;
    const L = layout(width, height, labels);
    const r = result(s);
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = false; // show the pixels and the 8×8 blocks honestly
    const frame = ({ x, y, s: side }) => {
      ctx.strokeStyle = COLORS.frame;
      ctx.lineWidth = 1;
      ctx.strokeRect(x - 0.5, y - 0.5, side + 1, side + 1);
    };
    ctx.drawImage(r.original, L.picture.x, L.picture.y, L.picture.s, L.picture.s);
    ctx.drawImage(r.survivor, L.survivor.x, L.survivor.y, L.survivor.s, L.survivor.s);
    frame(L.picture);
    frame(L.survivor);

    // The building blocks, each as bright as the share of blocks that kept it.
    const cell = L.blocks.s / (B + (B - 1) / B);
    const source = patternsCanvas();
    for (let u = 0; u < B; u++)
      for (let v = 0; v < B; v++) {
        ctx.globalAlpha = 0.12 + 0.88 * Math.sqrt(r.use[u * B + v]);
        ctx.drawImage(
          source,
          v * (B + 1),
          u * (B + 1),
          B,
          B,
          L.blocks.x + v * cell * (1 + 1 / B),
          L.blocks.y + u * cell * (1 + 1 / B),
          cell,
          cell,
        );
      }
    ctx.globalAlpha = 1;
    ctx.imageSmoothingEnabled = true;

    if (cursor) {
      const px = L.picture.s / SIZE;
      ctx.strokeStyle = COLORS.cursor;
      ctx.lineWidth = 2;
      ctx.strokeRect(L.picture.x + (cursor.x - 2) * px, L.picture.y + (cursor.y - 2) * px, 5 * px, 5 * px);
    }
    if (!labels) return;
    ctx.fillStyle = COLORS.label;
    ctx.font = `600 ${L.small}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    const label = (sq, text) => ctx.fillText(text, sq.x + sq.s / 2, sq.y - 7, sq.s + 8);
    label(L.picture, edited ? t.yourPicture : t.yours);
    label(L.survivor, t.survives);
    label(L.blocks, t.blocks);
    // Under the building blocks: broad washes at the top left, fine ripples at the bottom right.
    ctx.font = `${L.small - 1}px system-ui`;
    const below = L.blocks.y + L.blocks.s + L.small + 3;
    const fits = ctx.measureText(t.broad).width + ctx.measureText(t.fine).width + 10 <= L.blocks.s;
    ctx.textAlign = 'left';
    ctx.fillText(t.broad, L.blocks.x, below, L.blocks.s);
    ctx.textAlign = 'right';
    ctx.fillText(t.fine, L.blocks.x + L.blocks.s, fits ? below : below + L.small + 2, L.blocks.s);
  }

  function draw(ctx, s, stage) {
    render(ctx, s, stage);
  }

  /** The pixel under a pointer on your picture, or null. */
  function pixelAt(p, stage) {
    const L = layout(stage.width, stage.height, true).picture;
    const x = ((p.x * stage.width - L.x) / L.s) * SIZE,
      y = ((p.y * stage.height - L.y) / L.s) * SIZE;
    return x >= 0 && x < SIZE && y >= 0 && y < SIZE ? { x, y } : null;
  }

  /** Paint on the visitor's own copy of the picture. */
  function paint(s, at, value) {
    edited ??= Float64Array.from(baseImage(s));
    M.paint(edited, at.x, at.y, value);
    version++;
  }

  function announceSoon(s) {
    clearTimeout(announceTimer);
    announceTimer = setTimeout(() => {
      const r = result(s);
      W.announce(t.announce(t.verdicts[r.verdict], s.keep, Math.round(r.difference * 1000) / 10));
    }, 400);
  }

  function readouts(s) {
    const r = result(s);
    $('scene-status').textContent = t.status(t.verdicts[r.verdict], s.keep);
    $('scene-name').textContent = edited ? t.yourPicture : t.pictures[PICTURE_ORDER[s.picture]];
    const box = $('compress-readout');
    if (box)
      box.innerHTML = [
        [t.kept, t.keptValue(r.count, s.keep)],
        [t.energy, t.energyValue(Math.round(r.energy * 1000) / 10)],
        [t.difference, t.differenceValue(Math.round(r.difference * 1000) / 10)],
      ]
        .map(([k, v]) => `<div><span>${k}</span><strong>${v}</strong></div>`)
        .join('');
    const hint = $('compress-mode-hint');
    if (hint) hint.textContent = t.modeHints[s.mode];
    const select = $('compress-mode');
    if (select && Number(select.value) !== s.mode) select.value = String(s.mode);
    document
      .querySelectorAll('#compress-pictures button')
      .forEach((b) => b.setAttribute('aria-pressed', String(!edited && Number(b.dataset.picture) === s.picture)));
  }

  const defaults = { picture: 0, mode: 0, keep: 10 };

  room = W.defineRoom({
    id: 'compress',
    symbol: '▦',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'signals',
    added: '2026-09-28',
    tagline: t.tagline,
    accent: { background: '#23282f', border: '#c9d6df', color: '#eef2f5' },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.sceneLabel,
    sceneName: t.pictures.sunset,
    tip: t.tip,
    actionLabel: t.actionLabel,
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { html: t.connection.html, go: 'storm', label: t.connection.label },

    // picture: which built-in picture; mode: 0 keep the strongest, 1 the weakest; keep: percent of the numbers.
    defaults,
    ranges: {
      picture: [0, PICTURE_ORDER.length - 1, 'integer'],
      mode: [0, 1, 'integer'],
      keep: [1, 100, 'integer'],
    },
    defaultPreset: 0,
    presets: [
      { settings: { mode: 0, keep: 10 } },
      { settings: { mode: 1, keep: 90 } },
      { settings: { mode: 0, keep: 2 } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Fourier',
        color: '#c9a86b',
        sketch: { hairStyle: 'curly', hair: '#4a3a2c', skin: '#efcaa6', backdrop: '#e3dccd' },
      },
      {
        ...t.guests[1],
        color: '#7fb3d5',
        sketch: {
          hairStyle: 'receding',
          hair: '#d8d4cc',
          skin: '#c99a73',
          moustache: true,
          glasses: 'square',
          backdrop: '#dbe6ee',
        },
      },
    ],

    insight: { title: t.insight.title, html: t.insight.html },

    still: true,

    controls: (s, stage) =>
      `<div class="control wide"><label id="compress-pictures-label">${t.pictureLabel}</label>` +
      `<div class="segment" id="compress-pictures" role="group" aria-labelledby="compress-pictures-label">` +
      PICTURE_ORDER.map(
        (name, i) =>
          `<button type="button" data-picture="${i}" aria-pressed="${!edited && i === s.picture}">${t.pictures[name]}</button>`,
      ).join('') +
      '</div></div>' +
      `<div class="control"><label for="compress-mode">${t.modeLabel}</label><select id="compress-mode">` +
      t.modes.map((name, i) => `<option value="${i}" ${s.mode === i ? 'selected' : ''}>${name}</option>`).join('') +
      `</select><p id="compress-mode-hint">${t.modeHints[s.mode]}</p></div>` +
      stage.slider('keep', t.keepLabel, 1, 100, 1, s.keep, '%', t.keepHint) +
      '<div class="wide readout compress-readout" id="compress-readout"></div>',

    bindControls(panel, s, stage) {
      panel.querySelector('[data-key="keep"]')?.addEventListener('change', () => announceSoon(s));
      $('compress-mode').addEventListener('change', (e) => {
        s.mode = Number(e.target.value);
        stage.setChosen(-1);
        stage.sync();
        stage.draw();
        announceSoon(s);
      });
      panel.querySelectorAll('#compress-pictures button').forEach((b) =>
        b.addEventListener('click', () => {
          s.picture = Number(b.dataset.picture);
          edited = null;
          stage.sync();
          stage.draw();
          announceSoon(s);
        }),
      );
    },

    /** The home card: a sunset, and what survives of it from 5% of its numbers. */
    preview(ctx, width, height) {
      render(ctx, { picture: 0, mode: 0, keep: 5 }, { width, height }, { labels: false });
    },

    init() {
      // Enter paints at the keyboard cursor (Space stays play and pause, as in every stage room).
      $('scene-canvas').addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' || !W.stage.isShowing(room)) return;
        e.preventDefault();
        const s = W.stage.settingsFor('compress');
        if (!cursor) cursor = { x: 32, y: 32 };
        else {
          const i = cursor.y * SIZE + cursor.x;
          const here = (edited ?? result(s).image)[i];
          paint(s, { x: cursor.x + 0.5, y: cursor.y + 0.5 }, here > 128 ? 0 : 255);
          W.stage.sync();
          announceSoon(s);
        }
        W.stage.draw();
      });
    },
    enter() {
      cursor = null;
      brush = null;
    },
    readouts,
    draw,
    action(s, stage) {
      s.mode = 1 - s.mode;
      stage.setChosen(-1);
      stage.sync();
      stage.draw();
      announceSoon(s);
    },
    reset(s, stage) {
      Object.assign(s, defaults);
      edited = null;
      stage.refresh();
      stage.draw();
      announceSoon(s);
    },
    onPreset: (s) => announceSoon(s),

    pointer: {
      drag: (p, s, stage) => pixelAt(p, stage) !== null, // drawing; elsewhere a finger scrolls the page
      down(p, s, stage) {
        const at = pixelAt(p, stage);
        if (!at) return;
        cursor = null;
        const here = (edited ?? result(s).image)[Math.floor(at.y) * SIZE + Math.floor(at.x)];
        brush = here > 128 ? 0 : 255;
        paint(s, at, brush);
        stage.sync();
        stage.draw();
      },
      move(p, { dragging }, s, stage) {
        if (!dragging || brush === null) return;
        const at = pixelAt(p, stage);
        if (!at) return;
        paint(s, at, brush);
        stage.sync();
        stage.draw();
      },
      up() {
        if (brush !== null) announceSoon(W.stage.settingsFor('compress'));
        brush = null;
      },
      escape() {
        cursor = null;
        W.stage.draw();
      },
      arrow(dx, dy) {
        cursor = cursor
          ? { x: clamp(cursor.x + dx * 2, 0, SIZE - 1), y: clamp(cursor.y + dy * 2, 0, SIZE - 1) }
          : { x: 32, y: 32 };
      },
    },
  });
})();
