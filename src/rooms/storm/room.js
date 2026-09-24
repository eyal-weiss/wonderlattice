/* Room · Send a picture through a storm: repetition, parity, and Hamming codes on a noisy channel. */
(() => {
  'use strict';

  const W = Wonderloom;
  const { $, clamp } = W;
  const model = W.models.storm;
  const { SIZE, CODES, PICTURES } = model;
  const t = W.text('storm');

  const SEND_TIME = 1.7; // seconds for one message to cross the storm
  const PRESET_CODES = [0, 1, 3]; // the code each preset uses, in preset order
  const COLORS = {
    background: '#0a0e15',
    ink: '#f3e6c4', // a pixel with ink, and a data bit 1
    paper: '#1d2837', // a pixel without ink
    dataOff: '#394b61', // a data bit 0 on the wire
    checkOn: '#b9a6f4', // extra check bits, so the overhead is visible
    checkOff: '#4d4378',
    flip: '#ff8a3d', // a bit the storm flipped
    wrong: '#ff5d73', // a pixel that arrived wrong
    fixed: '#6fe3b4', // a pixel the code repaired
    bad: '#ffc857', // a block the receiver knows is damaged
    halo: '#0b1017',
    label: '#a7b4c6',
  };
  const CURVE_COLORS = ['#9aa6b8', '#8ec5ff', '#ffc857', '#6fe3b4'];

  let room = null, // this room, once registered
    sentAt = 0, // stage clock when the current message was sent
    cursor = null, // keyboard cursor on your picture, { x, y }, or null
    brush = null, // the value a drag paints (0 or 1), or null
    curves = null, // expected wrong pixels per code, cached on first use
    cached = { key: '', value: null };

  const pictureOf = (s) => model.unpack(s.top, s.bottom);

  /** The whole journey for the current settings, recomputed only when they change. */
  function journey(s) {
    const key = [s.top, s.bottom, s.code, s.storm, s.seed].join();
    if (cached.key !== key) cached = { key, value: model.transmit(pictureOf(s), s.code, s.storm / 100, s.seed) };
    return cached.value;
  }

  /** Where each bit sits along one channel row of `blocks` blocks, in bit-widths. Three copies are grouped. */
  function slots(code, blocks = 2) {
    const xs = [];
    let x = 0;
    for (let block = 0; block < blocks; block++) {
      if (block) x += 1.6;
      for (let i = 0; i < code.n; i++) {
        if (i && code.id === 'repeat' && i % 3 === 0) x += 0.45;
        xs.push(x);
        x += 1;
      }
    }
    return { xs, total: x };
  }
  const WIDEST = slots(CODES[1]).total;

  /**
   * Arrange the two pictures and the storm between them. Wide canvases read
   * left to right; narrow ones put both pictures on top and the storm
   * underneath, so the bits stay wide enough to see. With `curve`, room is kept
   * at the bottom for the damage curve. The home card (no labels) always reads
   * left to right.
   */
  function layout(width, height, labels, curve = false) {
    const top = labels ? 26 : 8,
      bottom = labels ? 6 : 8,
      margin = labels ? 8 : 10,
      avail = height - top - bottom,
      reserve = curve ? clamp(avail * 0.36, 120, 220) + 34 : 0;
    const curveBox = (y) => (curve ? { x: margin, y, w: width - 2 * margin, h: reserve - 34 } : null);
    let cell = Math.floor(Math.min((avail - reserve) / SIZE, (width * (labels ? 0.31 : 0.35)) / SIZE));
    let gap = labels ? Math.max(16, cell * 0.8) : 12;
    const across = width - 2 * (margin + cell * SIZE + gap);
    if (!labels || (across - 16) / WIDEST >= 6.5) {
      const pic = cell * SIZE,
        y = top + (avail - pic - reserve) / 2;
      return {
        wide: true,
        cell,
        top,
        sender: { x: margin, y },
        receiver: { x: width - margin - pic, y },
        channel: { x: margin + pic + gap, y: y - 6, w: across, h: pic + 12, rows: y, rowH: cell },
        curve: curveBox(y + pic + 34),
        blocks: labels ? 2 : 1, // the home card shows one block per row, so its bits stay visible
      };
    }
    cell = Math.floor(Math.min((width * 0.36) / SIZE, ((avail - reserve) * 0.47) / SIZE));
    gap = 14;
    const pic = cell * SIZE,
      y = top,
      below = y + pic + gap;
    const h = height - bottom - reserve - below;
    return {
      wide: false,
      cell,
      top,
      sender: { x: margin, y },
      receiver: { x: width - margin - pic, y },
      channel: { x: margin, y: below, w: width - 2 * margin, h, rows: below + 6, rowH: (h - 12) / SIZE },
      curve: curveBox(below + h + 30),
    };
  }

  /** Beside the panel (wider screens) the canvas is tall, so the damage curve lives on it; on phones, in the panel. */
  const besidePanel = () => matchMedia('(min-width: 761px)').matches;

  function drawPicture(ctx, pixels, at, cell, alpha = 1) {
    const pic = cell * SIZE,
      inset = cell > 9 ? 1 : 0.5;
    ctx.fillStyle = '#131b26';
    ctx.beginPath();
    ctx.roundRect(at.x - 3, at.y - 3, pic + 6, pic + 6, 5);
    ctx.fill();
    ctx.globalAlpha = alpha;
    pixels.forEach((bit, i) => {
      ctx.fillStyle = bit ? COLORS.ink : COLORS.paper;
      ctx.fillRect(
        at.x + (i % SIZE) * cell + inset,
        at.y + Math.floor(i / SIZE) * cell + inset,
        cell - 2 * inset,
        cell - 2 * inset,
      );
    });
    ctx.globalAlpha = 1;
  }

  /** Stroke a path twice, dark then bright, so a mark reads on both ink and paper. */
  function haloStroke(ctx, color, width) {
    ctx.strokeStyle = COLORS.halo;
    ctx.lineWidth = width + 2.2;
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  function drawMarks(ctx, j, at, cell) {
    const line = Math.max(1.6, cell * 0.12);
    ctx.lineCap = 'round';
    j.bad.forEach((bad, b) => {
      if (!bad) return;
      const x = at.x + (b % 2) * 4 * cell,
        y = at.y + Math.floor(b / 2) * cell;
      ctx.setLineDash([Math.max(3, cell * 0.28), Math.max(2, cell * 0.18)]);
      ctx.beginPath();
      ctx.rect(x + 1, y + 1, 4 * cell - 2, cell - 2);
      haloStroke(ctx, COLORS.bad, Math.max(1.5, cell * 0.08));
      ctx.setLineDash([]);
    });
    for (let i = 0; i < j.pixels.length; i++) {
      const x = at.x + (i % SIZE) * cell,
        y = at.y + Math.floor(i / SIZE) * cell;
      ctx.beginPath();
      if (j.wrong[i]) {
        const a = cell * 0.27,
          b = cell * 0.73;
        ctx.moveTo(x + a, y + a);
        ctx.lineTo(x + b, y + b);
        ctx.moveTo(x + b, y + a);
        ctx.lineTo(x + a, y + b);
        haloStroke(ctx, COLORS.wrong, line);
      } else if (j.repaired[i]) {
        ctx.arc(x + cell / 2, y + cell / 2, cell * 0.26, 0, W.TAU);
        haloStroke(ctx, COLORS.fixed, line * 0.85);
      }
    }
  }

  /** Rain in the storm, heavier as the storm grows. It falls only while the stage plays. */
  function drawRain(ctx, box, strength, clock) {
    const drops = Math.round(strength * 7);
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(box.x, box.y, box.w, box.h, 10);
    ctx.clip();
    ctx.strokeStyle = 'rgba(160, 190, 230, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < drops; i++) {
      const across = (i * 0.618034) % 1,
        phase = (i * 0.414214) % 1,
        fall = (phase + clock * (0.55 + across * 0.3)) % 1;
      const x = box.x + across * (box.w + 20) - 10,
        y = box.y - 14 + fall * (box.h + 28);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 4, y + 11);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawChannel(ctx, j, s, L, progress, clock) {
    const code = CODES[s.code],
      box = L.channel,
      { xs, total } = slots(code, L.blocks ?? 2);
    // A brief flash of lightning as a stormy message sets off.
    const flash = j.flips && progress > 0 && progress < 0.12 ? 0.5 * (1 - progress / 0.12) : 0;
    ctx.fillStyle = '#0f1724';
    ctx.strokeStyle = '#26354a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(box.x, box.y, box.w, box.h, 10);
    ctx.fill();
    ctx.stroke();
    if (flash) {
      ctx.fillStyle = `rgba(214, 226, 255, ${flash * 0.35})`;
      ctx.fill();
    }
    drawRain(ctx, box, s.storm, clock);

    const inner = box.w - 16,
      pitch = inner / total,
      offset = box.x + 8 + (inner - pitch * total) / 2,
      front = progress / 0.75; // the fraction of the channel the message has crossed
    for (let row = 0; row < SIZE; row++) {
      const y = box.rows + row * box.rowH,
        h = Math.max(3, box.rowH * 0.58);
      for (let k = 0; k < xs.length; k++) {
        const x = offset + xs[k] * pitch;
        if ((x - box.x) / box.w > front) break;
        const i = (2 * row + Math.floor(k / code.n)) * code.n + (k % code.n),
          check = code.roles[k % code.n] < 0,
          bit = j.received[i];
        const flipped = j.flipped[i],
          tall = flipped ? h * 1.3 : h;
        ctx.fillStyle = flipped
          ? COLORS.flip
          : check
            ? bit
              ? COLORS.checkOn
              : COLORS.checkOff
            : bit
              ? COLORS.ink
              : COLORS.dataOff;
        ctx.beginPath();
        ctx.roundRect(
          x + pitch * 0.13,
          y + (box.rowH - tall) / 2,
          Math.max(1.5, pitch * 0.74),
          tall,
          Math.min(2, pitch * 0.2),
        );
        ctx.fill();
      }
    }
  }

  /** A small arrow showing which way the message travels. */
  function arrow(ctx, x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = '#6f8199';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(-3, -5);
    ctx.lineTo(3, 0);
    ctx.lineTo(-3, 5);
    ctx.stroke();
    ctx.restore();
  }

  function render(ctx, s, view, { labels = true, progress = 1 } = {}) {
    const { width, height, clock } = view;
    const L = layout(width, height, labels, labels && besidePanel()),
      j = journey(s),
      pic = L.cell * SIZE;
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, width, height);

    drawChannel(ctx, j, s, L, progress, clock);
    drawPicture(ctx, pictureOf(s), L.sender, L.cell);
    const arrived = clamp((progress - 0.75) / 0.25, 0, 1);
    drawPicture(ctx, arrived ? j.pixels : new Array(SIZE * SIZE).fill(0), L.receiver, L.cell, 0.25 + 0.75 * arrived);
    if (progress >= 1) drawMarks(ctx, j, L.receiver, L.cell);

    if (cursor && labels) {
      ctx.strokeStyle = '#ddf6a3';
      ctx.lineWidth = 2;
      ctx.strokeRect(L.sender.x + cursor.x * L.cell + 1, L.sender.y + cursor.y * L.cell + 1, L.cell - 2, L.cell - 2);
    }

    if (L.wide) {
      const mid = L.sender.y + pic / 2,
        gap = L.channel.x - (L.sender.x + pic);
      arrow(ctx, L.sender.x + pic + gap / 2, mid, 0);
      arrow(ctx, L.receiver.x - gap / 2, mid, 0);
    } else {
      arrow(ctx, L.sender.x + pic / 2, L.channel.y - 7, Math.PI / 2);
      arrow(ctx, L.receiver.x + pic / 2, L.channel.y - 7, -Math.PI / 2);
    }
    if (!labels) return;
    ctx.fillStyle = COLORS.label;
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';
    const above = L.top - 10;
    ctx.fillText(t.yours, L.sender.x + pic / 2, L.wide ? L.sender.y - 12 : above);
    ctx.fillText(t.arrived, L.receiver.x + pic / 2, L.wide ? L.receiver.y - 12 : above);
    // On narrow canvases the storm's name sits between the pictures, when it fits.
    const between = L.receiver.x - (L.sender.x + pic);
    if (L.wide || between > ctx.measureText(t.storm).width + 14)
      ctx.fillText(t.storm, L.channel.x + L.channel.w / 2, L.wide ? L.channel.y - 6 : L.sender.y + pic / 2 + 4);
    if (L.curve) drawCurve(ctx, L.curve, s, true);
  }

  function draw(ctx, s, stage) {
    const progress = stage.playing ? clamp((stage.clock - sentAt) / SEND_TIME, 0, 1) : 1;
    render(ctx, s, stage, { progress });
  }

  /** Which pixel of your picture is under a pointer (coordinates from 0 to 1), or -1. */
  function pixelAt(p, stage) {
    const L = layout(stage.width, stage.height, true, besidePanel());
    const x = Math.floor((p.x * stage.width - L.sender.x) / L.cell),
      y = Math.floor((p.y * stage.height - L.sender.y) / L.cell);
    return x >= 0 && x < SIZE && y >= 0 && y < SIZE ? y * SIZE + x : -1;
  }

  /** Paint one pixel. Drawing shows its result at once, without replaying the journey. */
  function paint(i, value, s, stage) {
    const pixels = pictureOf(s);
    if (pixels[i] === value) return;
    pixels[i] = value;
    Object.assign(s, model.pack(pixels));
    sentAt = -Infinity;
    stage.sync();
    stage.draw();
  }

  /** Send the current picture again, from the start of its journey. */
  function send(stage) {
    sentAt = stage.clock;
    stage.sync();
    stage.draw();
  }

  /** Expected wrong pixels for every code, every half percent of storm. */
  function curveData() {
    curves ??= CODES.map((code, index) => Array.from({ length: 41 }, (_, k) => model.expectedWrong(index, k / 200)));
    return curves;
  }

  /**
   * The damage curve: expected wrong pixels against storm strength for every
   * code, the one in use drawn boldly, with a dot at the current storm. On the
   * canvas it carries a title and a key; in the panel the title is HTML.
   */
  function drawCurve(ctx, box, s, full) {
    const data = curveData(),
      most = 14,
      left = box.x + (full ? 30 : 4),
      right = box.x + box.w - 6;
    let top = box.y + 6;
    ctx.textBaseline = 'alphabetic';
    if (full) {
      ctx.fillStyle = COLORS.label;
      ctx.font = '12px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText(t.curveTitle, box.x, box.y + 10);
      // The key, wrapping onto a second line when it must.
      ctx.font = '11px system-ui';
      let x = box.x,
        y = box.y + 30;
      for (const c of [0, 1, 2, 3]) {
        const w = 22 + ctx.measureText(t.codes[c]).width;
        if (x > box.x && x + w > right) {
          x = box.x;
          y += 16;
        }
        ctx.globalAlpha = c === s.code ? 1 : 0.6;
        ctx.strokeStyle = CURVE_COLORS[c];
        ctx.lineWidth = 2;
        ctx.setLineDash(c === 2 ? [3, 3] : []);
        ctx.beginPath();
        ctx.moveTo(x, y - 4);
        ctx.lineTo(x + 14, y - 4);
        ctx.stroke();
        ctx.fillStyle = c === s.code ? '#e8edf3' : COLORS.label;
        ctx.fillText(t.codes[c], x + 19, y);
        x += w + 12;
      }
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      top = y + 14;
    }
    const base = box.y + box.h - 16;
    const px = (k) => left + (k / 40) * (right - left),
      py = (v) => base - (v / most) * (base - top);
    ctx.strokeStyle = '#303b46';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(left, base + 0.5);
    ctx.lineTo(right, base + 0.5);
    ctx.stroke();
    if (full) {
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(left, Math.round(py(10)) + 0.5);
      ctx.lineTo(right, Math.round(py(10)) + 0.5);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#8e9aab';
      ctx.font = '11px system-ui';
      ctx.textAlign = 'right';
      ctx.fillText('10', left - 6, py(10) + 4);
      ctx.fillText('0', left - 6, base + 4);
    }
    // The other codes stay faint behind the one in use.
    const order = [0, 1, 2, 3].filter((c) => c !== s.code).concat(s.code);
    for (const c of order) {
      const current = c === s.code;
      ctx.globalAlpha = current ? 1 : 0.4;
      ctx.strokeStyle = CURVE_COLORS[c];
      ctx.lineWidth = current ? 2.4 : 1.3;
      ctx.setLineDash(c === 2 ? [4, 4] : []);
      ctx.beginPath();
      data[c].forEach((v, k) => (k ? ctx.lineTo(px(k), py(v)) : ctx.moveTo(px(k), py(v))));
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
    const k = s.storm * 2,
      here = model.expectedWrong(s.code, s.storm / 100);
    ctx.strokeStyle = 'rgba(221, 246, 163, 0.35)';
    ctx.beginPath();
    ctx.moveTo(px(k), top);
    ctx.lineTo(px(k), base);
    ctx.stroke();
    ctx.fillStyle = CURVE_COLORS[s.code];
    ctx.beginPath();
    ctx.arc(px(k), py(here), 4, 0, W.TAU);
    ctx.fill();
    if (full) {
      ctx.font = '600 12px system-ui';
      ctx.textAlign = k > 30 ? 'right' : 'left';
      ctx.fillText(t.about(Number(here.toFixed(1))), px(k) + (k > 30 ? -9 : 9), py(here) - 8);
    }
    ctx.fillStyle = '#8e9aab';
    ctx.font = '11px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(t.calm, left, box.y + box.h - 3);
    ctx.textAlign = 'right';
    ctx.fillText(t.wild, right, box.y + box.h - 3);
    return here;
  }

  /** The panel copy of the curve, shown only when the canvas has no room for it. */
  function drawPanelCurve(s) {
    const holder = $('storm-curve-box'),
      canvas = $('storm-curve');
    if (!holder) return;
    holder.hidden = besidePanel();
    if (holder.hidden || !canvas.clientWidth) return;
    const width = canvas.clientWidth,
      height = canvas.clientHeight,
      dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const here = drawCurve(ctx, { x: 0, y: 0, w: width, h: height }, s, false);
    canvas.setAttribute('aria-label', t.curveLabel(t.codes[s.code], Number(here.toFixed(1))));
  }

  function readouts(s) {
    const j = journey(s),
      code = s.code,
      row = (label, value, color) =>
        `<span>${label}</span><strong class="storm-value" style="color:${color ?? 'var(--ink)'}">${value}</strong>`;
    $('scene-name').textContent = t.codes[code];
    $('scene-status').textContent = t.status(j.wrongCount, j.flips);
    $('scene-tip').textContent = code === 2 ? t.tipParity : t.tip;
    $('storm-code-hint').textContent = t.codeHints[code];
    let rows =
      row(t.sent, t.sentValue(model.bitsSent(code), Math.round(model.overhead(code) * 100))) +
      row(t.flipped, j.flips, j.flips ? COLORS.flip : undefined);
    if (code === 1 || code === 3) rows += row(t.repaired, j.repairedCount, j.repairedCount ? COLORS.fixed : undefined);
    if (code === 2) rows += row(t.knownBad, j.badCount, j.badCount ? COLORS.bad : undefined);
    rows += row(t.wrong, j.wrongCount, j.wrongCount ? COLORS.wrong : COLORS.fixed);
    $('storm-result').innerHTML = `<div class="storm-figures">${rows}</div>`;
    const pixels = pictureOf(s).join('');
    document.querySelectorAll('#storm-pictures button').forEach((b) => {
      b.setAttribute('aria-pressed', PICTURES[b.dataset.picture].join('') === pixels);
    });
    drawPanelCurve(s);
  }

  const pictureButtons = () =>
    Object.keys(PICTURES)
      .map((id) => `<button type="button" data-picture="${id}" aria-pressed="false">${t.pictures[id]}</button>`)
      .join('');

  room = W.defineRoom({
    id: 'storm',
    symbol: '⚡',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'signals',
    tagline: t.tagline,
    accent: { background: '#2a2733', border: '#ffb27a', color: '#ffd9b8' },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.sceneLabel,
    sceneName: t.codes[0],
    tip: t.tip,
    actionLabel: t.actionLabel,
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { html: t.connection.html, go: 'waves', label: t.connection.label },

    // storm is a percentage; top and bottom hold the picture (see model.pack); seed picks the storm.
    defaults: { storm: 4, code: 0, seed: 8, ...model.pack(PICTURES.heart) },
    ranges: {
      storm: [0, 20],
      code: [0, CODES.length - 1, 'integer'],
      seed: [0, 999999, 'integer'],
      top: [0, 2 ** 32 - 1, 'integer'],
      bottom: [0, 2 ** 32 - 1, 'integer'],
    },
    defaultPreset: 0,
    presets: t.presets.map((p, i) => ({
      ...p,
      badge: `+${Math.round(model.overhead(PRESET_CODES[i]) * 100)}%`,
      settings: { code: PRESET_CODES[i], storm: 4 },
    })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Hamming',
        color: '#d9745f', // a nod to his famous red plaid sports coat
        sketch: { hairStyle: 'swept', hair: '#cfcac2', skin: '#efc6a2', brows: 'bold', backdrop: '#dde5ee' },
      },
    ],

    insight: { title: t.insight.title, html: t.insight.html },

    controls: (s, stage) =>
      `<div class="control"><label for="storm-code">${t.codeLabel}</label><select id="storm-code">` +
      t.codes.map((name, i) => `<option value="${i}" ${s.code === i ? 'selected' : ''}>${name}</option>`).join('') +
      `</select><p id="storm-code-hint">${t.codeHints[s.code]}</p></div>` +
      stage.slider('storm', t.stormLabel, 0, 20, 0.5, s.storm, '%', t.stormHint) +
      `<div class="control wide"><label id="storm-pictures-label">${t.pictureLabel}</label>` +
      `<div class="segment" id="storm-pictures" role="group" aria-labelledby="storm-pictures-label">${pictureButtons()}</div>` +
      '</div>' +
      '<div class="wide readout storm-readout">' +
      '<div id="storm-result" role="status"></div>' +
      '<div id="storm-curve-box" class="storm-curve-box">' +
      `<span id="storm-curve-label">${t.curveTitle}</span><canvas id="storm-curve" role="img" ` +
      'class="storm-curve"></canvas></div></div>',

    bindControls(panel, s, stage) {
      $('storm-code').addEventListener('change', (e) => {
        s.code = Number(e.target.value);
        stage.setChosen(PRESET_CODES.indexOf(s.code));
        send(stage);
      });
      panel.querySelectorAll('#storm-pictures button').forEach((b) =>
        b.addEventListener('click', () => {
          Object.assign(s, model.pack(PICTURES[b.dataset.picture]));
          send(stage);
        }),
      );
    },

    /** The home card: a heart that survived the storm with Hamming's help. */
    preview(ctx, width, height) {
      render(
        ctx,
        { storm: 4, code: 3, seed: 8, ...model.pack(PICTURES.heart) },
        { width, height, clock: 0 },
        { labels: false },
      );
    },

    init() {
      // Moving between phone and wide layouts moves the damage curve between panel and canvas.
      matchMedia('(min-width: 761px)').addEventListener('change', () => {
        if (W.stage.isShowing(room)) W.stage.sync();
      });
      // Enter paints at the keyboard cursor (Space stays play and pause, as in every stage room).
      $('scene-canvas').addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' || !W.stage.isShowing(room)) return;
        e.preventDefault();
        const s = W.stage.settingsFor('storm');
        if (!cursor) cursor = { x: 3, y: 3 };
        else {
          const i = cursor.y * SIZE + cursor.x;
          paint(i, 1 - pictureOf(s)[i], s, W.stage);
        }
        W.stage.draw();
      });
    },
    enter(s, stage) {
      cursor = null;
      brush = null;
      sentAt = stage.clock;
    },
    readouts,
    draw,
    action(s, stage) {
      s.seed = 1 + Math.floor(Math.random() * 999999);
      send(stage);
    },
    reset: (s, stage) => send(stage),
    onPreset: (s, stage) => (sentAt = stage.clock),

    pointer: {
      down(p, s, stage) {
        const i = pixelAt(p, stage);
        if (i < 0) return;
        cursor = null;
        brush = 1 - pictureOf(s)[i];
        paint(i, brush, s, stage);
      },
      move(p, { dragging }, s, stage) {
        if (!dragging || brush === null) return;
        const i = pixelAt(p, stage);
        if (i >= 0) paint(i, brush, s, stage);
      },
      up: () => (brush = null),
      escape() {
        cursor = null;
        W.stage.draw();
      },
      arrow(dx, dy) {
        cursor = cursor
          ? { x: clamp(cursor.x + dx, 0, SIZE - 1), y: clamp(cursor.y + dy, 0, SIZE - 1) }
          : { x: 3, y: 3 };
      },
    },
  });
})();
