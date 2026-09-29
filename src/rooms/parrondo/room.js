/* Room · Two losing games that win: Parrondo's paradox, with crowds of players and the exact expectation. */
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
  // Modes 0–3 play one game: A, B, the random mix, the visitor's pattern. The race plays the first three at once,
  // and is the room's opening view, so the whole paradox shows before any choice is made.
  const RACE = 4,
    RACE_MODES = [0, 1, 2],
    MODE_ORDER = [RACE, 0, 1, 2, 3];
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

  /** The games a mode plays, as the model spells them: 'A', 'B', 'R' (A or B at random) or the visitor's pattern. */
  const gameOf = (mode, s) => ['A', 'B', 'R'][mode] ?? (M.decodePattern(s.pattern) || 'AABB');
  /** The modes a run plays side by side: all three in the race, otherwise just the one. */
  const modesOf = (s) => (s.mode === RACE ? RACE_MODES : [s.mode]);
  /** A pattern as the visitor reads it, letter by letter. */
  const spell = (pattern, gap = ' ') => [...pattern].map((g) => t.letters[g === 'B' ? 1 : 0]).join(gap);
  const nameOf = (s) =>
    s.mode === RACE ? t.raceName : s.mode < 3 ? t.sceneNames[s.mode] : t.patternName(spell(gameOf(3, s)));
  const shortOf = (mode, s) => (mode < 3 ? t.labels.short[mode] : spell(gameOf(3, s), ''));

  // The run being played: one crowd of players per game. `memory` keeps the average line of the last run of each
  // game, drawn faintly when a game is played alone.
  let run = null,
    runs = 0, // counts runs, so each has its own id
    due = 0, // rounds owed to the animation, fractional
    announced = false;
  const memory = new Map(); // game key → { label, colour, average, t }

  /** A crowd of players for one game, all starting at 0 coins. */
  function crowd(mode, s) {
    const pattern = gameOf(mode, s);
    return {
      key: `${mode}|${pattern}`,
      mode,
      pattern,
      label: shortOf(mode, s),
      colour: GAME_COLOURS[mode],
      rand: M.random(s.seed * 7919 + mode * 31 + s.pattern),
      capital: new Int32Array(PLAYERS),
      average: new Float64Array(ROUNDS + 1),
      // The middle half of the crowd after each round: the players a quarter and three quarters of the way up.
      low: new Float64Array(ROUNDS + 1),
      high: new Float64Array(ROUNDS + 1),
      b: 0,
      bad: 0,
      exact: M.expected(pattern, ROUNDS),
      long: M.longRun(pattern),
    };
  }

  function makeRun(s, id) {
    const crowds = modesOf(s).map((mode) => crowd(mode, s));
    const r = {
      settings: `${s.mode}|${gameOf(s.mode, s)}|${s.seed}`,
      id,
      race: s.mode === RACE,
      crowds,
      t: 0,
    };
    // The vertical scale is fixed for a run, and fits every expected line. Played alone, a game also shows the
    // middle half of its crowd, which spreads to about 0.7 × √rounds coins either side of the expectation.
    let peak = 0;
    for (const c of crowds) for (const v of c.exact.mean) peak = Math.max(peak, Math.abs(v));
    let span = Math.max(10, Math.ceil(peak * 1.35 + 3));
    if (!r.race) {
      for (const m of memory.values()) for (let k = 0; k <= m.t; k++) peak = Math.max(peak, Math.abs(m.average[k]));
      const spread = 0.7 * Math.sqrt(ROUNDS);
      span = Math.max(Math.ceil(peak * 1.35 + 3), Math.ceil((Math.abs(crowds[0].exact.mean[ROUNDS]) + spread) * 1.1));
    }
    r.span = span;
    return r;
  }

  function start(s) {
    remember();
    run = makeRun(s, ++runs);
    due = 0;
    announced = false;
    if (reduced) {
      play(ROUNDS);
      announced = true;
    }
  }

  /** Keep the finished (or half-finished) run's average lines, faintly, for comparison with the next game. */
  function remember() {
    if (!run || run.t < 20) return;
    for (const c of run.crowds) {
      memory.delete(c.key); // re-inserted last, so it is drawn on top
      memory.set(c.key, { label: c.label, colour: c.colour, average: c.average, t: run.t });
    }
  }

  // Players per whole number of coins, reused every round to find the middle half of a crowd.
  const tally = new Uint16Array(2 * ROUNDS + 1);

  /**
   * Record the capital a quarter and three quarters of the way up the crowd after this round. After a round every
   * capital has the round's parity, so each whole number stands for the two coins either side of it; the quartile
   * is read off smoothly within that stretch rather than jumping from one whole number to the next.
   */
  function band(c, round) {
    let lo = 2 * ROUNDS,
      hi = 0;
    for (let i = 0; i < PLAYERS; i++) {
      const k = c.capital[i] + ROUNDS;
      tally[k]++;
      if (k < lo) lo = k;
      if (k > hi) hi = k;
    }
    const q1 = PLAYERS / 4,
      q3 = (PLAYERS * 3) / 4;
    let seen = 0;
    for (let k = lo; k <= hi; k++) {
      const n = tally[k];
      if (!n) continue;
      tally[k] = 0; // ready for the next round
      if (seen < q1 && seen + n >= q1) c.low[round] = k - ROUNDS - 1 + (2 * (q1 - seen)) / n;
      if (seen < q3 && seen + n >= q3) c.high[round] = k - ROUNDS - 1 + (2 * (q3 - seen)) / n;
      seen += n;
    }
  }

  function play(rounds) {
    for (let k = 0; k < rounds && run.t < ROUNDS; k++) {
      for (const c of run.crowds) {
        const round = M.playRound(c.capital, c.pattern[run.t % c.pattern.length], c.rand);
        c.average[run.t + 1] = round.total / PLAYERS;
        c.b += round.b;
        c.bad += round.bad;
        band(c, run.t + 1);
      }
      run.t++;
    }
  }

  /** The run for these settings, starting a new one when the game or the seed has changed. */
  const current = (s) => {
    if (!run || run.settings !== `${s.mode}|${gameOf(s.mode, s)}|${s.seed}`) start(s);
    return run;
  };

  /** The crowd the buckets and the "bad coin" readout follow: the mix in the race, otherwise the one game. */
  const followed = (r) => (r.race ? r.crowds[2] : r.crowds[0]);

  /**
   * Where the chart and the buckets go: buckets to the right on wide pictures, underneath on tall ones. Beside a
   * long panel the canvas can be taller than the screen, so the chart keeps a landscape shape at the top rather
   * than stretching until its lower half, where the losing games go, falls below the fold.
   */
  function place(width, height, buckets) {
    const small = Math.round(Math.min(13, Math.max(10, Math.min(width, height) / 32)));
    const pad = Math.max(10, Math.min(width, height) * 0.035);
    const wide = width > height * 1.2;
    const chart = { x: pad, y: pad, w: width - pad * 2, h: Math.min(height - pad * 2, (width - pad * 2) * 0.72) };
    let tubs = null;
    if (buckets && wide) {
      chart.w = width * 0.7 - pad * 1.5;
      tubs = { x: width * 0.7 + pad * 0.5, y: pad, w: width * 0.3 - pad * 1.5, h: height - pad * 2 };
    } else if (buckets) {
      chart.h = Math.min(height * 0.64 - pad * 1.5, chart.h);
      const top = chart.y + chart.h + pad * 0.5;
      tubs = { x: pad, y: top, w: width - pad * 2, h: Math.min(height - pad - top, chart.w * 0.45) };
    }
    // Room for the axis numbers on the left and the round numbers below.
    const plot = { x: chart.x + small * 2.6, y: chart.y + small * 0.6, w: 0, h: 0 };
    plot.w = chart.x + chart.w - plot.x;
    plot.h = chart.y + chart.h - small * 1.8 - plot.y;
    return { plot, tubs, small };
  }

  const xOf = (L, round) => L.plot.x + (round / ROUNDS) * L.plot.w;
  const yOf = (L, span, value) => L.plot.y + L.plot.h / 2 - (value / span) * (L.plot.h / 2);

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
   * The middle half of a crowd as a soft band. Game B keeps players bunched on a few coin values, so its quartiles
   * move in stairs; a running average over nearby rounds turns them into a slope the eye can follow.
   */
  function drawBand(ctx, L, span, c, upTo) {
    if (upTo < 1) return;
    const WINDOW = 12;
    const smooth = (series, k) => {
      let sum = 0,
        n = 0;
      for (let j = Math.max(0, k - WINDOW); j <= Math.min(upTo, k + WINDOW); j++, n++) sum += series[j];
      return sum / n;
    };
    ctx.beginPath();
    for (let k = 0; k <= upTo; k++) ctx.lineTo(xOf(L, k), yOf(L, span, smooth(c.high, k)));
    for (let k = upTo; k >= 0; k--) ctx.lineTo(xOf(L, k), yOf(L, span, smooth(c.low, k)));
    ctx.closePath();
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = c.colour;
    ctx.fill();
    ctx.globalAlpha = 1;
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
  function drawBuckets(ctx, L, c, race) {
    const box = L.tubs,
      small = L.small;
    ctx.font = `600 ${small}px system-ui`;
    ctx.fillStyle = COLOURS.muted;
    ctx.textAlign = 'left';
    ctx.fillText(race ? t.labels.bucketsMix : t.labels.buckets, box.x, box.y + small, box.w);
    const shares = [0, 0, 0];
    for (let i = 0; i < PLAYERS; i++) shares[M.mod3(c.capital[i])] += 1 / PLAYERS;
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
    // In a short bucket (a phone, say) there is no room above the line beside the percentage, so go below it.
    const above = y - small - 4 > top + small + 4;
    ctx.fillText(t.labels.breakEven, box.x + 4, above ? y - 4 : y + small + 2, bw - 8);
  }

  function scene(ctx, s, width, height, r, remembered) {
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    ctx.textBaseline = 'alphabetic';
    ctx.direction = 'ltr'; // the chart keeps its direction on right-to-left pages too
    const L = place(width, height, s.buckets);
    const { plot, small } = L;
    drawAxes(ctx, L, r.span);
    ctx.save();
    ctx.beginPath();
    ctx.rect(plot.x - 2, plot.y - 2, plot.w + 4, plot.h + 4);
    ctx.clip();
    ctx.lineJoin = 'round';
    ctx.font = `600 ${small - 1}px system-ui`;
    const used = [];
    if (!r.race) {
      // A game alone: where the middle half of its players are, then earlier games, faintly, each labelled.
      drawBand(ctx, L, r.span, r.crowds[0], r.t);
      for (const [key, m] of remembered) {
        if (key === r.crowds[0].key) continue;
        ctx.globalAlpha = 0.8;
        ctx.strokeStyle = m.colour;
        ctx.lineWidth = 2;
        trace(ctx, L, r.span, m.average, m.t);
        ctx.globalAlpha = 1;
        tag(ctx, L, m.label, xOf(L, m.t), yOf(L, r.span, m.average[m.t]), m.colour, m.average[m.t] >= 0, used);
      }
    }
    // Each game's exact expectation, dashed, and its crowd's average, thick.
    for (const c of r.crowds) {
      ctx.strokeStyle = r.race ? c.colour : COLOURS.ink;
      ctx.globalAlpha = r.race ? 0.7 : 1;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      trace(ctx, L, r.span, c.exact.mean, r.t);
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }
    for (const c of r.crowds) {
      ctx.strokeStyle = 'rgba(10, 14, 21, 0.8)';
      ctx.lineWidth = 7;
      trace(ctx, L, r.span, c.average, r.t);
      ctx.strokeStyle = c.colour;
      ctx.lineWidth = 4;
      trace(ctx, L, r.span, c.average, r.t);
    }
    if (r.t > 0) {
      const x = xOf(L, r.t);
      ctx.font = `600 ${small}px system-ui`;
      if (r.race) {
        // The winner's label first, above its line; the two losers below theirs.
        for (const c of [...r.crowds].reverse()) {
          const avg = c.average[r.t];
          tag(ctx, L, t.labels.tag(c.label, fmt(avg)), x, yOf(L, r.span, avg), c.colour, avg >= 0, used);
        }
      } else {
        const c = r.crowds[0],
          avg = c.average[r.t],
          exp = c.exact.mean[r.t];
        tag(ctx, L, t.labels.average(fmt(avg)), x, yOf(L, r.span, avg), c.colour, avg >= exp, used);
        ctx.font = `${small - 1}px system-ui`;
        tag(ctx, L, t.labels.expected(fmt(exp)), x, yOf(L, r.span, exp), COLOURS.ink, avg < exp, used);
      }
    }
    ctx.restore();
    ctx.font = `${small - 1}px system-ui`;
    ctx.fillStyle = COLOURS.muted;
    ctx.textAlign = 'left';
    ctx.fillText(t.labels.start, plot.x + 4, yOf(L, r.span, 0) - 4);
    if (s.buckets) drawBuckets(ctx, L, followed(r), r.race);
  }

  function draw(ctx, s, stage) {
    scene(ctx, s, stage.width, stage.height, current(s), memory);
  }

  /** The home card and link preview: the race, already played, with A and B sinking and the mix climbing. */
  function preview(ctx, width, height) {
    const saved = run;
    const s = { mode: RACE, pattern: DEFAULT_PATTERN, buckets: false, seed: 4 };
    run = makeRun(s, `preview-${width}x${height}`);
    play(ROUNDS);
    const r = run;
    run = saved;
    scene(ctx, s, width, height, r, new Map());
  }

  function status() {
    return run.t < ROUNDS ? t.status.round(count(run.t), count(ROUNDS)) : t.status.done(count(ROUNDS));
  }

  /** The numbers that change every round: set as plain text, not rebuilt, and not a live region. */
  function live(s) {
    if (!run) return;
    $('scene-status').textContent = status();
    const avg = $('parrondo-average');
    if (avg)
      avg.textContent = run.race
        ? t.readout.averages(count(PLAYERS), ...run.crowds.map((c) => fmt(c.average[run.t])))
        : t.readout.average(count(PLAYERS), fmt(run.crowds[0].average[run.t]));
    const bad = $('parrondo-bad');
    if (bad) {
      const c = followed(run);
      const so = c.b ? percent(c.bad / c.b) : '–';
      bad.hidden = !s.buckets;
      bad.textContent = run.race
        ? t.readout.badShareRace(
            so,
            percent(run.crowds[1].long.badShare),
            percent(c.long.badShare),
            percent(M.breakEven()),
          )
        : c.long.badShare === null
          ? t.readout.noB
          : t.readout.badShare(so, percent(c.long.badShare), percent(M.breakEven()));
    }
  }

  function readouts(s) {
    const r = current(s);
    $('scene-name').textContent = nameOf(s);
    $('scene-action').textContent = t.actionLabel;
    const box = $('parrondo-readout');
    if (box)
      box.innerHTML = r.race
        ? `<p class="parrondo-race-title">${t.readout.expected(count(ROUNDS))}</p>` +
          r.crowds
            .map(
              (c, i) =>
                `<div class="parrondo-race-row"><span>${t.readout.games[i]}</span><strong style="color:${c.colour}">${fmt(c.exact.mean[ROUNDS])}</strong></div>`,
            )
            .join('') +
          `<p>${t.readout.perRounds(...r.crowds.map((c) => fmt(c.long.gain, 4)))}</p>` +
          '<p id="parrondo-average"></p><p id="parrondo-bad"></p>'
        : `<div class="parrondo-big"><span>${t.readout.expected(count(ROUNDS))}</span><strong style="color:${r.crowds[0].colour}">${fmt(r.crowds[0].exact.mean[ROUNDS])}</strong></div>` +
          `<p>${t.readout.perRound(fmt(r.crowds[0].long.gain, 4))}</p>` +
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
      MODE_ORDER.map(
        (i) => `<button type="button" data-mode="${i}" ${pressed(s.mode === i)}>${t.modes[i]}</button>`,
      ).join('') +
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
    added: '2026-09-28',
    tagline: t.tagline,
    accent: { background: '#221a2e', border: '#c792ff', color: '#e2cbff' },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.sceneLabel,
    sceneName: t.raceName,
    tip: t.tip,
    actionLabel: t.actionLabel,
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { ...t.connection, go: 'dice' },

    defaults: { mode: RACE, pattern: DEFAULT_PATTERN, buckets: false, seed: 1 },
    ranges: {
      mode: [0, RACE, 'integer'],
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
        const end = r.crowds.map((c) => fmt(c.average[ROUNDS]));
        W.announce(
          r.race ? t.announce.race(...end) : t.announce.done(nameOf(s), end[0], fmt(r.crowds[0].exact.mean[ROUNDS])),
        );
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
