/* Room · The mathematical loom: a weaving draft and the cloth it makes. */
(() => {
  'use strict';

  const W = Wonderloom;
  const { $ } = W;
  const L = W.models.loom;
  const t = W.text('loom');

  // Dark and light yarn for each palette.
  const PALETTES = [
    ['#2b4a8c', '#efe6cf'],
    ['#983232', '#ebc566'],
    ['#2f624a', '#e8e1cf'],
    ['#232a3a', '#c9d3e0'],
  ];
  const DRAFT_THREADS = 12; // warp threads shown in the draft, and the fewest picks
  const PICKS_PER_SECOND = 6;
  const HEAD_START = 0.6; // the share of the cloth already woven when weaving starts, so it never opens bare
  const reduced = W.prefersReducedMotion();
  let layout = null; // the last drawn geometry, for clicks on the tie-up

  const yarn = (s, dark) => PALETTES[s.palette][dark ? 0 : 1];
  const shade = (hex, f) =>
    '#' +
    [1, 3, 5]
      .map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * f))
      .map((v) => Math.min(255, v).toString(16).padStart(2, '0'))
      .join('');

  /**
   * Where the draft and the cloth go. Side by side on a wide canvas, both from
   * the top, with the draft showing as many picks as fit its height; the draft
   * above the cloth on a tall one. Keeps clear of the stage heading on phones.
   */
  function measure(width, height) {
    const span = DRAFT_THREADS + 5,
      label = 16,
      top = (width < 520 ? 34 : 8) + label,
      usable = height - top - 4;
    let draft, cloth;
    if (usable > width * 1.05) {
      const unit = Math.min((width - 8) / span, (usable * 0.42) / span);
      draft = { x: (width - span * unit) / 2, y: top, unit, rows: DRAFT_THREADS };
      const clothTop = top + span * unit + 14 + label;
      cloth = { x: 4, y: clothTop, width: width - 8, height: height - clothTop - 4 };
    } else {
      const unit = Math.min((width * 0.44) / span, usable / span);
      // As many picks as the height allows, so the draft runs down beside the cloth.
      const rows = Math.max(DRAFT_THREADS, Math.floor(usable / unit) - 5);
      draft = { x: 4, y: top, unit, rows };
      const clothX = draft.x + span * unit + 22;
      cloth = { x: clothX, y: top, width: width - clothX - 4, height: usable };
    }
    const tieup = { x: draft.x + draft.unit * (DRAFT_THREADS + 1), y: draft.y, size: draft.unit * 4 };
    return { draft, cloth, tieup, label, stacked: usable > width * 1.05 };
  }

  function drawDraft(ctx, s, box, current) {
    const { x, y, unit: u, rows } = box;
    const threading = L.orders[s.threading],
      treadling = L.orders[s.treadling];
    // While weaving, the draft pages along with the cloth: its rows are passes
    // offset…offset + rows − 1, so the highlighted row is always the pass on the loom.
    const offset = current === null ? 0 : current - (current % rows);
    const colours = L.cloth(s, offset + rows, DRAFT_THREADS).slice(offset);
    const cell = (cx, cy, fill) => {
      ctx.fillStyle = fill;
      ctx.fillRect(cx + 0.5, cy + 0.5, u - 1, u - 1);
    };
    const empty = '#18212b',
      mark = '#dfe9d2';
    // Threading: shaft 1 is the row nearest the cloth.
    for (let j = 0; j < DRAFT_THREADS; j++)
      for (let shaft = 0; shaft < 4; shaft++)
        cell(x + j * u, y + (3 - shaft) * u, threading[j % threading.length] === shaft ? mark : empty);
    // Tie-up: shafts down the side, treadles across.
    for (let treadle = 0; treadle < 4; treadle++)
      for (let shaft = 0; shaft < 4; shaft++)
        cell(
          x + (DRAFT_THREADS + 1 + treadle) * u,
          y + (3 - shaft) * u,
          L.lifts(s.tieup, treadle, shaft) ? '#f3d28c' : empty,
        );
    // Treadling and drawdown.
    for (let i = 0; i < rows; i++) {
      const rowY = y + (5 + i) * u;
      for (let treadle = 0; treadle < 4; treadle++)
        cell(
          x + (DRAFT_THREADS + 1 + treadle) * u,
          rowY,
          treadling[(offset + i) % treadling.length] === treadle ? mark : empty,
        );
      for (let j = 0; j < DRAFT_THREADS; j++) cell(x + j * u, rowY, yarn(s, colours[i][j]));
    }
    // The pass being woven now, and the treadle it uses.
    if (current !== null) {
      const i = current - offset,
        treadle = treadling[current % treadling.length];
      ctx.strokeStyle = '#f7f3e3';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x - 1, y + (5 + i) * u - 1, (DRAFT_THREADS + 5) * u + 2, u + 2);
      ctx.strokeRect(x + (DRAFT_THREADS + 1 + treadle) * u - 1, y - 1, u + 2, 4 * u + 2);
    }
  }

  /** The cloth, with `picks` passes woven since weaving started on top of the head start. */
  function drawCloth(ctx, s, box, picks) {
    const k = Math.max(7, Math.min(14, box.width / 26));
    const columns = Math.floor(box.width / k),
      rows = Math.floor(box.height / k),
      woven = Math.floor(rows * HEAD_START) + picks;
    const x0 = box.x + (box.width - columns * k) / 2,
      bottom = box.y + (box.height + rows * k) / 2;
    const up = L.drawdown(L.orders[s.threading], s.tieup, L.orders[s.treadling], rows, columns);
    const warpDark = (j) => L.colourOrders[s.warpColours][j % L.colourOrders[s.warpColours].length] === 1;
    const weftDark = (i) => L.colourOrders[s.weftColours][i % L.colourOrders[s.weftColours].length] === 1;
    ctx.fillStyle = '#0c1118';
    ctx.fillRect(x0 - 3, bottom - rows * k - 3, columns * k + 6, rows * k + 6);
    const full = Math.min(rows, Math.floor(woven));
    const warpThread = (x, y, h, colour) => {
      ctx.fillStyle = colour;
      ctx.beginPath();
      ctx.roundRect(x + k * 0.17, y + 0.4, k * 0.66, h - 0.8, k * 0.3);
      ctx.fill();
    };
    const weftThread = (x, y, w, colour) => {
      ctx.fillStyle = colour;
      ctx.beginPath();
      ctx.roundRect(x + 0.4, y + k * 0.17, w - 0.8, k * 0.66, k * 0.3);
      ctx.fill();
    };
    // Unwoven warp above the cloth: the threads waiting on the loom.
    for (let j = 0; j < columns; j++)
      warpThread(x0 + j * k, bottom - rows * k, (rows - full) * k, shade(yarn(s, warpDark(j)), 0.55));
    // The cloth grows upwards from the front of the loom, one pass at a time.
    for (let i = 0; i < full; i++) {
      const y = bottom - (i + 1) * k;
      for (let j = 0; j < columns; j++) {
        const x = x0 + j * k,
          warp = yarn(s, warpDark(j)),
          weft = yarn(s, weftDark(i));
        if (up[i][j]) {
          weftThread(x, y, k, shade(weft, 0.6));
          warpThread(x, y, k, warp);
        } else {
          warpThread(x, y, k, shade(warp, 0.6));
          weftThread(x, y, k, weft);
        }
      }
    }
    // The shuttle carrying the next pass across.
    if (full < rows && !reduced) {
      const along = woven - full,
        y = bottom - (full + 1) * k,
        reach = along * columns * k;
      weftThread(x0, y, reach, yarn(s, weftDark(full)));
      ctx.fillStyle = '#c99a5b';
      ctx.beginPath();
      ctx.ellipse(x0 + reach, y + k / 2, k * 1.4, k * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    return full < rows ? full : null;
  }

  function draw(ctx, s, stage) {
    const { width, height, clock } = stage;
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    layout = measure(width, height);
    const picks = reduced ? Infinity : clock * PICKS_PER_SECOND;
    const weaving = drawCloth(ctx, s, layout.cloth, picks);
    drawDraft(ctx, s, layout.draft, weaving);
    ctx.fillStyle = '#98aab7';
    ctx.font = '600 11px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(t.labels.draft, layout.draft.x, layout.draft.y - 7);
    ctx.fillText(t.labels.cloth, layout.cloth.x, layout.cloth.y - 7);
    // The tip says where the draft and the cloth are: side by side, or one above the other.
    const tip = layout.stacked ? t.tipStacked : t.tip;
    if ($('scene-tip').textContent !== tip) $('scene-tip').textContent = tip;
  }

  function preview(ctx, width, height) {
    const s = presets[2].settings;
    drawCloth(ctx, { ...defaults, ...s }, { x: 0, y: 0, width, height }, Infinity);
  }

  /** For the trail: the whole cloth, finished, rather than a frame with bare warp still waiting. */
  function trailCanvas(s, stage) {
    const box = measure(stage.width, stage.height).cloth,
      scale = 2,
      canvas = document.createElement('canvas');
    canvas.width = Math.round(box.width * scale);
    canvas.height = Math.round(box.height * scale);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, box.width, box.height);
    drawCloth(ctx, s, { x: 0, y: 0, width: box.width, height: box.height }, Infinity);
    return canvas;
  }

  /** Tell screen readers what the cloth has become, once a change settles. */
  function announce(s) {
    const { across, down } = L.repeat(s);
    W.announce(`${t.repeat(across, down)}. ${t.float(L.longestFloat(s))}`);
  }

  const select = (key, label, options, value) =>
    `<div class="control"><label for="loom-${key}">${label}</label><select id="loom-${key}" data-select="${key}">` +
    options.map((o, i) => `<option value="${i}"${i === value ? ' selected' : ''}>${o}</option>`).join('') +
    '</select></div>';

  function tieupControl(s) {
    let cells = '<span></span>' + [1, 2, 3, 4].map((n) => `<span>${t.treadleLabel(n)}</span>`).join('');
    for (let shaft = 3; shaft >= 0; shaft--) {
      cells += `<span>${t.shaftLabel(shaft + 1)}</span>`;
      for (let treadle = 0; treadle < 4; treadle++)
        cells +=
          `<button class="loom-cell" data-treadle="${treadle}" data-shaft="${shaft}" ` +
          `aria-pressed="${L.lifts(s.tieup, treadle, shaft)}" aria-label="${t.tieupCell(treadle + 1, shaft + 1)}" ` +
          'aria-describedby="loom-tieup-hint"></button>';
    }
    return (
      `<div class="control wide"><span class="loom-heading" id="loom-tieup-heading">${t.tieup}</span>` +
      `<div class="loom-tieup" role="group" aria-labelledby="loom-tieup-heading">${cells}</div>` +
      `<p class="loom-hint" id="loom-tieup-hint">${t.tieupHint}</p></div>`
    );
  }

  function toggle(s, stage, treadle, shaft) {
    s.tieup ^= 1 << (treadle * L.SHAFTS + shaft);
    stage.setChosen(-1);
    stage.refresh();
    stage.draw();
    announce(s);
  }

  const defaults = { tieup: L.tieups.twill, threading: 0, treadling: 0, warpColours: 0, weftColours: 4, palette: 0 };
  const presetSettings = [
    { tieup: L.tieups.plain, threading: 0, treadling: 0, warpColours: 0, weftColours: 4 },
    { tieup: L.tieups.twill, threading: 0, treadling: 0, warpColours: 0, weftColours: 4 },
    { tieup: L.tieups.twill, threading: 0, treadling: 0, warpColours: 1, weftColours: 1 },
    { tieup: L.tieups.plain, threading: 0, treadling: 0, warpColours: 2, weftColours: 2 },
    { tieup: L.tieups.twill, threading: 1, treadling: 1, warpColours: 0, weftColours: 4 },
    { tieup: L.tieups.twill, threading: 1, treadling: 0, warpColours: 0, weftColours: 4 },
  ];
  const badges = ['1:1', '2/2', '▚', '≡', '◇', '⋀'];
  const presets = t.presets.map((p, i) => ({ ...p, badge: badges[i], settings: presetSettings[i] }));

  W.defineRoom({
    id: 'loom',
    symbol: '▦',
    theme: 'making',
    eyebrow: t.eyebrow,
    name: t.name,
    tagline: t.tagline,
    accent: { background: '#2e2a22', border: '#d8b877', color: '#f3dca6' },

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
    connection: { ...t.connection, go: 'flock' },

    defaults,
    ranges: {
      tieup: [0, 65535, 'integer'],
      threading: [0, L.orders.length - 1, 'integer'],
      treadling: [0, L.orders.length - 1, 'integer'],
      warpColours: [0, L.colourOrders.length - 1, 'integer'],
      weftColours: [0, L.colourOrders.length - 1, 'integer'],
      palette: [0, PALETTES.length - 1, 'integer'],
    },
    defaultPreset: 1,
    presets,

    guests: [
      {
        ...t.guests[0],
        bio: 'Lovelace',
        color: '#d9b0cf',
        sketch: { hairStyle: 'bun', hair: '#3b2a22', skin: '#f3d6bd', backdrop: '#e8dccb' },
      },
    ],

    insight: t.insight,

    controls: (s) =>
      tieupControl(s) +
      '<div class="loom-options wide">' +
      select('threading', t.threading, t.orders, s.threading) +
      select('treadling', t.treadling, t.orders, s.treadling) +
      select('warpColours', t.warpColours, t.colourOrders, s.warpColours) +
      select('weftColours', t.weftColours, t.colourOrders, s.weftColours) +
      '</div>' +
      select('palette', t.palette, t.palettes, s.palette) +
      '<div class="wide readout loom-float" id="loom-float"></div>',

    bindControls(panel, s, stage) {
      panel.querySelectorAll('.loom-cell').forEach((b) =>
        b.addEventListener('click', () => {
          toggle(s, stage, Number(b.dataset.treadle), Number(b.dataset.shaft));
          $(`scene-controls`)
            .querySelector(`[data-treadle="${b.dataset.treadle}"][data-shaft="${b.dataset.shaft}"]`)
            .focus();
        }),
      );
      panel.querySelectorAll('[data-select]').forEach((input) =>
        input.addEventListener('change', () => {
          s[input.dataset.select] = Number(input.value);
          stage.setChosen(-1);
          stage.sync();
          stage.draw();
          announce(s);
        }),
      );
    },

    readouts(s) {
      const { across, down } = L.repeat(s);
      $('scene-status').textContent = t.repeat(across, down);
      $('loom-float').textContent = t.float(L.longestFloat(s));
    },

    draw,
    preview,
    trailCanvas,
    onPreset: announce,

    /** "Surprise me": a random tie-up whose threads all interlace, with floats of at most three. */
    action(s, stage) {
      let next;
      do next = Math.floor(Math.random() * 65536);
      while (next === s.tieup || L.longestFloat({ ...s, tieup: next }) > 3);
      s.tieup = next;
      stage.setChosen(-1);
      stage.refresh();
      stage.draw();
      announce(s);
    },

    pointer: {
      /** Clicking a tie-up square on the picture toggles it too. */
      down(p, s, stage) {
        if (!layout) return;
        const x = p.x * stage.width - layout.tieup.x,
          y = p.y * stage.height - layout.tieup.y,
          u = layout.draft.unit;
        if (x < 0 || y < 0 || x >= layout.tieup.size || y >= layout.tieup.size) return;
        toggle(s, stage, Math.floor(x / u), 3 - Math.floor(y / u));
      },
    },
  });
})();
