/* Room · Two losing games that win: Parrondo's paradox, with a crowd of players and the exact expectation. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $ } = W;
  const M = W.models.parrondo;
  const t = W.text('parrondo');
  const reduced = W.prefersReducedMotion();

  const PLAYERS = 1000,
    ROUNDS = 1000,
    ROUNDS_PER_SECOND = 100,
    MAX_PATTERN = 12,
    DEFAULT_PATTERN = M.encodePattern('AABB');
  // One colour per game: A, B, the random mix, and the visitor's own pattern.
  const GAME_COLOURS = ['#6cc3ff', '#c792ff', '#f7c948', '#7ee0a1'];
  const COLOURS = {
    ink: '#f4f5e9',
    muted: '#98aab7',
    grid: '#1c2733',
    zero: '#4a5866',
    bad: '#ff8a65',
    good: '#7ee0a1',
  };

  const fmt = (x, digits = 1) =>
    `${x > 0 ? '+' : x < 0 ? '−' : ''}${Math.abs(x).toLocaleString(W.lang, { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
  const percent = (x) => `${(x * 100).toLocaleString(W.lang, { maximumFractionDigits: 1 })}%`;
  const count = (n) => n.toLocaleString(W.lang);

  /** The games played, as the model spells them: 'A', 'B', 'R' (A or B at random) or the visitor's pattern. */
  const patternOf = (s) => ['A', 'B', 'R'][s.mode] ?? (M.decodePattern(s.pattern) || 'AABB');
  /** A pattern as the visitor reads it, letter by letter. */
  const spell = (pattern, gap = ' ') => [...pattern].map((g) => t.letters[g === 'B' ? 1 : 0]).join(gap);
  const nameOf = (s) => (s.mode < 3 ? t.sceneNames[s.mode] : t.patternName(spell(patternOf(s))));
  const shortOf = (s) => (s.mode < 3 ? t.labels.short[s.mode] : spell(patternOf(s), ''));

  // The run being played. Every player's capital after every round is kept, so the cloud of players can be
  // redrawn at a new size. `memory` keeps the average line of the last run of each game, drawn faintly.
  let run = null,
    runs = 0, // counts runs, so each has its own id for the offscreen cloud
    due = 0, // rounds owed to the animation, fractional
    announced = false;
  const memory = new Map(); // game key → { label, colour, average, t }
  const plume = { canvas: null, key: '', drawn: 0 }; // the cloud of players, drawn offscreen round by round

  function start(s) {
    remember();
    const pattern = patternOf(s);
    const exact = M.expected(pattern, ROUNDS);
    run = {
      key: `${s.mode}|${pattern}`,
      settings: `${s.mode}|${pattern}|${s.seed}`,
      id: ++runs,
      mode: s.mode,
      pattern,
      label: shortOf(s),
      colour: GAME_COLOURS[s.mode],
      rand: M.random(s.seed * 7919 + s.mode * 31 + s.pattern),
      capital: new Int32Array(PLAYERS),
      history: new Int16Array(PLAYERS * (ROUNDS + 1)),
      average: new Float64Array(ROUNDS + 1),
      t: 0,
      b: 0,
      bad: 0,
      exact,
      long: M.longRun(pattern),
    };
    // The vertical scale is fixed for a run, so the cloud can be drawn a round at a time. It fits the expected
    // lines (this game's and the remembered ones) and most of the crowd, about 1.4 times a lone player's typical
    // spread after the last round; the few who wander further simply leave the picture.
    let peak = 0;
    for (const v of exact.mean) peak = Math.max(peak, Math.abs(v));
    for (const m of memory.values()) for (let k = 0; k <= m.t; k++) peak = Math.max(peak, Math.abs(m.average[k]));
    run.span = Math.max(Math.ceil(1.4 * Math.sqrt(ROUNDS)), Math.ceil(peak * 1.35 + 3));
    plume.key = '';
    due = 0;
    announced = false;
    if (reduced) {
      play(ROUNDS);
      announced = true;
    }
  }

  /** Keep the finished (or half-finished) run's average line, faintly, for comparison with the next game. */
  function remember() {
    if (!run || run.t < 20) return;
    memory.delete(run.key); // re-inserted last, so it is drawn on top
    memory.set(run.key, { label: run.label, colour: run.colour, average: run.average, t: run.t });
  }

  function play(rounds) {
    for (let k = 0; k < rounds && run.t < ROUNDS; k++) {
      const round = M.playRound(run.capital, run.pattern[run.t % run.pattern.length], run.rand);
      run.t++;
      run.average[run.t] = round.total / PLAYERS;
      run.b += round.b;
      run.bad += round.bad;
      run.history.set(run.capital, run.t * PLAYERS);
    }
  }

  /** The run for these settings, starting a new one when the game or the seed has changed. */
  const current = (s) => {
    if (!run || run.settings !== `${s.mode}|${patternOf(s)}|${s.seed}`) start(s);
    return run;
  };

  /** Where the chart and the buckets go: buckets to the right on wide pictures, underneath on tall ones. */
  function place(width, height, buckets) {
    const small = Math.round(Math.min(13, Math.max(10, Math.min(width, height) / 32)));
    const pad = Math.max(10, Math.min(width, height) * 0.035);
    const wide = width > height * 1.2;
    const chart = { x: pad, y: pad, w: width - pad * 2, h: height - pad * 2 };
    let tubs = null;
    if (buckets && wide) {
      chart.w = width * 0.7 - pad * 1.5;
      tubs = { x: width * 0.7 + pad * 0.5, y: pad, w: width * 0.3 - pad * 1.5, h: height - pad * 2 };
    } else if (buckets) {
      chart.h = height * 0.64 - pad * 1.5;
      tubs = { x: pad, y: height * 0.64 + pad * 0.5, w: width - pad * 2, h: height * 0.36 - pad * 1.5 };
    }
    // Room for the axis numbers on the left and the round numbers below.
    const plot = { x: chart.x + small * 2.6, y: chart.y + small * 0.6, w: 0, h: 0 };
    plot.w = chart.x + chart.w - plot.x;
    plot.h = chart.y + chart.h - small * 1.8 - plot.y;
    return { plot, tubs, small };
  }

  const xOf = (L, round) => L.plot.x + (round / ROUNDS) * L.plot.w;
  const yOf = (L, span, value) => L.plot.y + L.plot.h / 2 - (value / span) * (L.plot.h / 2);

  /** Draw rounds [from, to] of the cloud of players onto the offscreen canvas, a column per round. */
  function drawPlume(c, L, r, from, to) {
    const { plot } = L;
    const unit = plot.h / 2 / r.span;
    // After each round every player's capital has the same parity as the round, so players sit on every other
    // whole number: each band is two coins tall, so the bands meet and the crowd reads as a soft glow.
    const dotW = Math.max(1, plot.w / ROUNDS),
      dotH = Math.max(1, unit * 2);
    const counts = new Uint16Array(2 * ROUNDS + 1);
    // On narrow pictures several rounds share a pixel column: each gives less light, so phones don't saturate.
    // The cloud stays well below full brightness, so the average line stands out against it.
    const light = 0.5 * Math.min(1, plot.w / ROUNDS);
    c.fillStyle = r.colour;
    for (let round = from; round <= to; round++) {
      // Count players at each capital, remembering the lowest and highest so only those places are visited.
      const row = round * PLAYERS;
      let lo = 2 * ROUNDS,
        hi = 0;
      for (let i = 0; i < PLAYERS; i++) {
        const k = r.history[row + i] + ROUNDS;
        counts[k]++;
        if (k < lo) lo = k;
        if (k > hi) hi = k;
      }
      const x = xOf(L, round) - plot.x - dotW / 2;
      for (let k = lo; k <= hi; k++) {
        const n = counts[k];
        if (!n) continue;
        counts[k] = 0; // ready for the next round
        const y = yOf(L, r.span, k - ROUNDS) - plot.y;
        if (y < -dotH || y > plot.h + dotH) continue;
        // Each player adds a little light, so crowded places glow and lone wanderers stay faint.
        c.globalAlpha = light * (1 - 0.97 ** n);
        c.fillRect(x, y - dotH / 2, dotW, dotH);
      }
    }
    c.globalAlpha = 1;
  }

  /** The cloud, kept offscreen and extended as rounds are played; rebuilt when the size or the run changes. */
  function plumeImage(L, r, dpr) {
    const { plot } = L;
    const key = `${r.id}|${Math.round(plot.w)}|${Math.round(plot.h)}|${dpr}`;
    if (!plume.canvas) plume.canvas = document.createElement('canvas');
    const c = plume.canvas.getContext('2d');
    if (key !== plume.key) {
      plume.key = key;
      plume.canvas.width = Math.max(1, Math.round(plot.w * dpr));
      plume.canvas.height = Math.max(1, Math.round(plot.h * dpr));
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      plume.drawn = -1;
    }
    if (plume.drawn < r.t) {
      drawPlume(c, L, r, plume.drawn + 1, r.t);
      plume.drawn = r.t;
    }
    return plume.canvas;
  }

  /** A line through the first `upTo` + 1 values of a series. */
  function trace(ctx, L, span, series, upTo) {
    ctx.beginPath();
    for (let k = 0; k <= upTo; k++) {
      const x = xOf(L, k),
        y = yOf(L, span, series[k]);
      if (k === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  /**
   * A label beside a point, kept inside the plot and clear of the labels already placed (`used` holds their
   * baselines), so lines that end close together keep readable names.
   */
  function tag(ctx, L, text, x, y, colour, above, used) {
    const w = ctx.measureText(text).width;
    const right = x + 6 + w > L.plot.x + L.plot.w;
    ctx.textAlign = right ? 'right' : 'left';
    const clampY = (v) => Math.min(L.plot.y + L.plot.h - 3, Math.max(L.plot.y + L.small, v));
    let ty = clampY(y + (above ? -7 : L.small + 3));
    for (let tries = 0; tries < 6 && used.some((u) => Math.abs(u - ty) < L.small + 3); tries++)
      ty = clampY(ty + (above ? -1 : 1) * (L.small + 4));
    used.push(ty);
    ctx.fillStyle = 'rgba(10, 14, 21, 0.75)';
    ctx.fillRect(right ? x - 6 - w - 3 : x + 3, ty - L.small + 1, w + 6, L.small + 3);
    ctx.fillStyle = colour;
    ctx.fillText(text, right ? x - 6 : x + 6, ty);
  }

  function drawAxes(ctx, L, span) {
    const { plot, small } = L;
    ctx.font = `${small - 1}px system-ui`;
    ctx.fillStyle = COLOURS.muted;
    ctx.textAlign = 'right';
    const step = span > 60 ? 20 : span > 30 ? 10 : 5;
    for (let v = -Math.floor(span / step) * step; v <= span; v += step) {
      const y = yOf(L, span, v);
      ctx.strokeStyle = v === 0 ? COLOURS.zero : COLOURS.grid;
      ctx.lineWidth = 1;
      ctx.setLineDash(v === 0 ? [5, 4] : []);
      ctx.beginPath();
      ctx.moveTo(plot.x, y);
      ctx.lineTo(plot.x + plot.w, y);
      ctx.stroke();
      ctx.fillText(v === 0 ? '0' : fmt(v, 0), plot.x - 5, y + small * 0.35);
    }
    ctx.setLineDash([]);
    ctx.textAlign = 'center';
    // Fewer round numbers on narrow pictures; the last one ends at the edge rather than past it.
    const every = plot.w < 420 ? 250 : 100;
    for (let k = 0; k <= ROUNDS; k += every) {
      ctx.textAlign = k === ROUNDS ? 'right' : 'center';
      ctx.fillText(count(k), xOf(L, k) + (k === ROUNDS ? 2 : 0), plot.y + plot.h + small * 1.3);
    }
    ctx.textAlign = 'right';
    ctx.fillText(t.labels.rounds, plot.x + plot.w, plot.y + plot.h - 4);
  }

  /** Three buckets: players sorted by their coins modulo 3, with B's bad coin in the first. */
  function drawBuckets(ctx, L, r) {
    const box = L.tubs,
      small = L.small;
    ctx.font = `600 ${small}px system-ui`;
    ctx.fillStyle = COLOURS.muted;
    ctx.textAlign = 'left';
    ctx.fillText(t.labels.buckets, box.x, box.y + small, box.w);
    const shares = [0, 0, 0];
    for (let i = 0; i < PLAYERS; i++) shares[M.mod3(r.capital[i])] += 1 / PLAYERS;
    const top = box.y + small * 2.2,
      bottom = box.y + box.h - small * 2.8;
    const gap = box.w * 0.08,
      bw = (box.w - gap * 2) / 3,
      bh = Math.max(10, bottom - top);
    const level = (share) => bottom - share * bh;
    const line = M.breakEven();
    for (let i = 0; i < 3; i++) {
      const x = box.x + i * (bw + gap);
      const colour = i === 0 ? COLOURS.bad : COLOURS.good;
      // The live share of players, filling the bucket.
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = colour;
      ctx.fillRect(x, level(shares[i]), bw, bottom - level(shares[i]));
      ctx.globalAlpha = 1;
      ctx.strokeStyle = colour;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
      ctx.lineTo(x + bw, bottom);
      ctx.lineTo(x + bw, top);
      ctx.stroke();
      ctx.fillStyle = COLOURS.ink;
      ctx.font = `600 ${small}px system-ui`;
      ctx.textAlign = 'center';
      ctx.fillText(percent(shares[i]), x + bw / 2, top + small + 2);
      ctx.font = `${small - 1}px system-ui`;
      ctx.fillStyle = COLOURS.muted;
      ctx.fillText(t.labels.bucket[i], x + bw / 2, bottom + small + 2, bw + gap);
      ctx.fillStyle = colour;
      ctx.fillText(t.labels.coin[i], x + bw / 2, bottom + small * 2 + 4, bw + gap);
    }
    // B's break-even line in the first bucket: fewer players there than this, and B pays.
    const y = level(line);
    ctx.strokeStyle = COLOURS.bad;
    ctx.setLineDash([4, 3]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(box.x - 3, y);
    ctx.lineTo(box.x + bw + 3, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = `${small - 1}px system-ui`;
    ctx.textAlign = 'left';
    ctx.fillStyle = COLOURS.bad;
    ctx.fillText(t.labels.breakEven, box.x + 4, y - 4, bw - 8);
  }

  function scene(ctx, s, width, height, r, dpr, remembered) {
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    ctx.textBaseline = 'alphabetic';
    ctx.direction = 'ltr'; // the chart keeps its direction on right-to-left pages too
    const L = place(width, height, s.buckets);
    const { plot, small } = L;
    drawAxes(ctx, L, r.span);
    ctx.drawImage(plumeImage(L, r, dpr), plot.x, plot.y, plot.w, plot.h);
    ctx.save();
    ctx.beginPath();
    ctx.rect(plot.x - 2, plot.y - 2, plot.w + 4, plot.h + 4);
    ctx.clip();
    ctx.lineJoin = 'round';
    ctx.font = `600 ${small - 1}px system-ui`;
    // Earlier games, faintly, each labelled where its line ends.
    const used = [];
    for (const [key, m] of remembered) {
      if (key === r.key) continue;
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = m.colour;
      ctx.lineWidth = 2;
      trace(ctx, L, r.span, m.average, m.t);
      ctx.globalAlpha = 1;
      tag(ctx, L, m.label, xOf(L, m.t), yOf(L, r.span, m.average[m.t]), m.colour, m.average[m.t] >= 0, used);
    }
    // The exact expectation, dashed, and the crowd's average, thick.
    ctx.strokeStyle = COLOURS.ink;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    trace(ctx, L, r.span, r.exact.mean, r.t);
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(10, 14, 21, 0.8)';
    ctx.lineWidth = 7;
    trace(ctx, L, r.span, r.average, r.t);
    ctx.strokeStyle = r.colour;
    ctx.lineWidth = 4;
    trace(ctx, L, r.span, r.average, r.t);
    if (r.t > 0) {
      const x = xOf(L, r.t),
        avg = r.average[r.t],
        exp = r.exact.mean[r.t];
      ctx.font = `600 ${small}px system-ui`;
      tag(ctx, L, t.labels.average(fmt(avg)), x, yOf(L, r.span, avg), r.colour, avg >= exp, used);
      ctx.font = `${small - 1}px system-ui`;
      tag(ctx, L, t.labels.expected(fmt(exp)), x, yOf(L, r.span, exp), COLOURS.ink, avg < exp, used);
    }
    ctx.restore();
    ctx.font = `${small - 1}px system-ui`;
    ctx.fillStyle = COLOURS.muted;
    ctx.textAlign = 'left';
    ctx.fillText(t.labels.start, plot.x + 4, yOf(L, r.span, 0) - 4);
    if (s.buckets) drawBuckets(ctx, L, r);
  }

  function draw(ctx, s, stage) {
    const r = current(s);
    const dpr = stage.width ? ctx.canvas.width / stage.width : 1;
    scene(ctx, s, stage.width, stage.height, r, dpr, memory);
  }

  /** The home card and link preview: A and B sinking faintly, the mix climbing, all already played. */
  function preview(ctx, width, height) {
    const saved = run;
    const remembered = new Map();
    for (const [mode, seed] of [
      [0, 2],
      [1, 3],
    ]) {
      const sim = M.simulate(['A', 'B'][mode], ROUNDS, PLAYERS, seed);
      remembered.set(String(mode), {
        label: t.labels.short[mode],
        colour: GAME_COLOURS[mode],
        average: sim.average,
        t: ROUNDS,
      });
    }
    const s = { mode: 2, pattern: DEFAULT_PATTERN, buckets: false, seed: 4 };
    const r = {
      key: 'preview',
      id: `preview-${width}x${height}`,
      pattern: 'R',
      label: t.labels.short[2],
      colour: GAME_COLOURS[2],
      rand: M.random(11),
      capital: new Int32Array(PLAYERS),
      history: new Int16Array(PLAYERS * (ROUNDS + 1)),
      average: new Float64Array(ROUNDS + 1),
      t: 0,
      b: 0,
      bad: 0,
      exact: M.expected('R', ROUNDS),
      long: M.longRun('R'),
      span: 44,
    };
    run = r;
    play(ROUNDS);
    run = saved;
    const keep = { ...plume };
    plume.canvas = null;
    plume.key = '';
    scene(ctx, s, width, height, r, 1, remembered);
    Object.assign(plume, keep);
  }

  function status() {
    return run.t < ROUNDS ? t.status.round(count(run.t), count(ROUNDS)) : t.status.done(count(ROUNDS));
  }

  /** The numbers that change every round: set as plain text, not rebuilt, and not a live region. */
  function live(s) {
    if (!run) return;
    $('scene-status').textContent = status();
    const avg = $('parrondo-average');
    if (avg) avg.textContent = t.readout.average(count(PLAYERS), fmt(run.average[run.t]));
    const bad = $('parrondo-bad');
    if (bad) {
      bad.hidden = !s.buckets;
      bad.textContent =
        run.long.badShare === null
          ? t.readout.noB
          : t.readout.badShare(
              run.b ? percent(run.bad / run.b) : '–',
              percent(run.long.badShare),
              percent(M.breakEven()),
            );
    }
  }

  function readouts(s) {
    const r = current(s);
    $('scene-name').textContent = nameOf(s);
    $('scene-action').textContent = t.actionLabel;
    const box = $('parrondo-readout');
    if (box)
      box.innerHTML =
        `<div class="parrondo-big"><span>${t.readout.expected(count(ROUNDS))}</span><strong style="color:${r.colour}">${fmt(r.exact.mean[ROUNDS])}</strong></div>` +
        `<p>${t.readout.perRound(fmt(r.long.gain, 4))}</p>` +
        '<p id="parrondo-average"></p><p id="parrondo-bad"></p>';
    const letters = $('parrondo-letters');
    if (letters)
      letters.innerHTML = [...M.decodePattern(s.pattern)]
        .map((g) => `<span class="parrondo-letter ${g === 'B' ? 'is-b' : ''}">${t.letters[g === 'B' ? 1 : 0]}</span>`)
        .join('');
    $('parrondo-undo')?.toggleAttribute('disabled', M.decodePattern(s.pattern).length <= 1);
    for (const g of ['A', 'B'])
      $(`parrondo-add-${g}`)?.toggleAttribute('disabled', M.decodePattern(s.pattern).length >= MAX_PATTERN);
    document
      .querySelectorAll('#scene-controls [data-mode]')
      .forEach((b) => b.setAttribute('aria-pressed', Number(b.dataset.mode) === s.mode));
    live(s);
  }

  function controls(s, stage) {
    const pressed = (on) => `aria-pressed="${on}"`;
    return (
      `<div class="wide readout parrondo-rules"><strong>${t.rules.title}</strong><p>${t.rules.aHtml}</p><p>${t.rules.bHtml}</p><p>${t.rules.stakes}</p></div>` +
      `<div class="control wide"><label id="parrondo-mode-label">${t.modeLabel}</label>` +
      `<div class="segment" role="group" aria-labelledby="parrondo-mode-label">` +
      t.modes.map((m, i) => `<button type="button" data-mode="${i}" ${pressed(s.mode === i)}>${m}</button>`).join('') +
      '</div></div>' +
      `<div class="control wide"><label id="parrondo-pattern-label">${t.patternLabel}</label>` +
      `<div class="parrondo-letters" id="parrondo-letters" aria-labelledby="parrondo-pattern-label"></div>` +
      '<div class="segment">' +
      ['A', 'B']
        .map(
          (g, i) =>
            `<button type="button" id="parrondo-add-${g}" data-add="${g}" aria-label="${t.add(t.letters[i])}">+ ${t.letters[i]}</button>`,
        )
        .join('') +
      `<button type="button" id="parrondo-undo" aria-label="${t.undoLabel}">${t.undo}</button></div>` +
      `<p>${t.patternHint}</p></div>` +
      '<div class="wide readout parrondo-readout" id="parrondo-readout"></div>' +
      stage.check('buckets', t.buckets, s.buckets)
    );
  }

  function bindControls(panel, s, st) {
    const restart = () => {
      st.setChosen(-1);
      start(s);
      st.sync();
      st.draw();
    };
    panel.querySelectorAll('[data-mode]').forEach((button) =>
      button.addEventListener('click', () => {
        s.mode = Number(button.dataset.mode);
        restart();
      }),
    );
    panel.querySelectorAll('[data-add]').forEach((button) =>
      button.addEventListener('click', () => {
        const pattern = M.decodePattern(s.pattern);
        if (pattern.length >= MAX_PATTERN) return;
        // The first tap starts a fresh pattern, rather than adding to the one left from before.
        const next = s.mode === 3 ? pattern + button.dataset.add : button.dataset.add;
        s.pattern = M.encodePattern(next);
        s.mode = 3;
        restart();
        W.announce(t.patternName(spell(next)));
      }),
    );
    $('parrondo-undo').addEventListener('click', () => {
      const pattern = M.decodePattern(s.pattern);
      if (pattern.length <= 1) return;
      s.pattern = M.encodePattern(pattern.slice(0, -1));
      s.mode = 3;
      restart();
      W.announce(t.patternName(spell(M.decodePattern(s.pattern))));
    });
    panel.querySelector('[data-check="buckets"]')?.addEventListener('change', () => live(s));
  }

  W.defineRoom({
    id: 'parrondo',
    symbol: '⇅',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'chance',
    tagline: t.tagline,
    accent: { background: '#221a2e', border: '#c792ff', color: '#e2cbff' },

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
    connection: { ...t.connection, go: 'dice' },

    defaults: { mode: 0, pattern: DEFAULT_PATTERN, buckets: false, seed: 1 },
    ranges: {
      mode: [0, 3, 'integer'],
      pattern: [2, 2 ** (MAX_PATTERN + 1) - 1, 'integer'],
      seed: [1, 9999, 'integer'],
    },
    defaultPreset: -1,
    presets: [
      { settings: { mode: 1, buckets: true } },
      { settings: { mode: 2, buckets: true } },
      { settings: { mode: 3, pattern: DEFAULT_PATTERN } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        color: '#f7c948',
        // A living physicist, so a drawn sketch only: short dark hair and a beard.
        sketch: { hairStyle: 'short', hair: '#3b3330', skin: '#e8bf9a', beard: 'short', backdrop: '#2b2616' },
      },
      {
        ...t.guests[1],
        bio: 'Feynman',
        color: '#6cc3ff',
        sketch: { hairStyle: 'swept', hair: '#5a5550', skin: '#eec6a2', brows: 'bold', backdrop: '#16283a' },
      },
    ],

    insight: t.insight,

    controls,
    bindControls,
    readouts,
    draw,
    preview,
    enter(s) {
      start(s);
    },
    onPreset(s) {
      start(s);
    },
    step(dt, s, st) {
      const r = current(s);
      if (r.t >= ROUNDS) return;
      due += dt * ROUNDS_PER_SECOND;
      const n = Math.floor(due);
      due -= n;
      if (!n) return;
      play(n);
      live(s);
      if (r.t >= ROUNDS && !announced) {
        announced = true;
        st.sync();
        W.announce(t.announce.done(nameOf(s), fmt(r.average[ROUNDS]), fmt(r.exact.mean[ROUNDS])));
      }
    },
    action(s, st) {
      s.seed = (s.seed % 9999) + 1;
      start(s);
      st.sync();
      st.draw();
    },
    reset(s, st) {
      start(s);
      st.sync();
      st.draw();
    },
  });
})();
