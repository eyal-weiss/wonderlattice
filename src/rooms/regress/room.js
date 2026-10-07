/* Room · The punishment illusion: a coach's words seem to work, and are wired to nothing (regression to the mean). */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $ } = W;
  const M = W.models.regress;
  const t = W.text('regress');
  const reduced = W.prefersReducedMotion();

  const MAX = 120; // throws in a session
  const FLY = 0.22; // seconds a dart takes to land
  const COLOURS = {
    praise: '#fde047',
    scold: '#f87171',
    nothing: '#8a97a8',
    better: '#7dd3fc',
    worse: '#fb923c',
    ink: '#e8edf2',
    soft: '#aab6c3',
    faint: '#5d6b7c',
  };

  // The session being shown. Throws are made one at a time from the seed, so a link or a moment in the trail
  // replays the same thrower; the coach's words are kept with each throw.
  const state = {
    key: '',
    rand: null,
    throws: [], // { z, word, angle }
    wait: 0, // seconds until the next throw
    pending: false, // a throw waits for the visitor's word
    fly: 1, // how far the latest dart has flown, 0 to 1
    quick: false, // a restart after a change skips the slow first throws
    targets: [], // where the coach's faces are, for taps: { x, y, r, word }
    announced: false,
  };

  const keyOf = (s) => `${s.seed}|${s.share}|${s.helps ? 1 : 0}`;
  const share = (s) => s.share / 100;

  /** A dart's angle on the board: repeatable for throw i, scattered round the board. */
  function angleOf(i) {
    const x = Math.sin((i + 1) * 12.9898 + 78.233) * 43758.5453;
    return (x - Math.floor(x)) * Math.PI * 2;
  }

  /** Seconds between throws: slow at first, so each one can be followed, then brisk. */
  const interval = (i, quick) => (quick ? 0.16 : i < 4 ? 0.9 : Math.max(0.16, 0.9 * 0.82 ** (i - 3)));

  function restart(s, stage, quick = false) {
    state.key = keyOf(s);
    state.rand = M.random(s.seed);
    state.throws = [];
    state.pending = false;
    state.fly = 1;
    state.quick = quick;
    state.wait = quick ? 0.1 : 0.5;
    state.announced = false;
    if (reduced || !stage.playing) {
      // Nothing moves: the session lands at once (with the automatic coach), or the first throw waits for a word.
      if (s.auto) {
        while (state.throws.length < MAX) throwOne(s);
        finish();
      } else throwOne(s);
    }
  }

  /** The next throw lands; the automatic coach answers it at once, or it waits for the visitor's word. */
  function throwOne(s) {
    const last = state.throws[state.throws.length - 1];
    const z = M.nextThrow(state.rand, last ? last.word : null, s.helps);
    const word = s.auto ? M.autoWord(z, share(s)) : null;
    state.throws.push({ z, word, angle: angleOf(state.throws.length) });
    state.pending = !s.auto;
    state.fly = reduced ? 1 : 0;
  }

  /** The visitor's word for the latest throw. With the automatic coach on, a word takes over the coaching. */
  function coach(word, s, stage) {
    // Ignore a word while the next throw is on its way, and after the session is over.
    if (!state.throws.length || (!s.auto && !state.pending) || (s.auto && state.throws.length >= MAX)) return;
    if (s.auto) {
      s.auto = false;
      const box = document.querySelector('[data-check="auto"]');
      if (box) box.checked = false;
    }
    const last = state.throws[state.throws.length - 1];
    last.word = word;
    state.pending = false;
    if (state.throws.length >= MAX) return finish();
    if (reduced || !stage.playing) throwOne(s);
    else state.wait = 0.35;
    stage.sync();
    stage.draw();
  }

  function finish() {
    if (state.announced) return;
    state.announced = true;
    const k = M.tally(state.throws);
    W.announce(
      t.announce(k.praise.worse, k.praise.worse + k.praise.better, k.scold.better, k.scold.better + k.scold.worse),
    );
  }

  function step(dt, s, stage) {
    if (state.key !== keyOf(s)) restart(s, stage, true);
    if (state.fly < 1) state.fly = Math.min(1, state.fly + dt / FLY);
    if (state.pending) return;
    if (state.throws.length >= MAX) return finish();
    state.wait -= dt;
    if (state.wait > 0) return;
    // The automatic coach may have been switched off while a throw was in the air: it waits for a word now.
    throwOne(s);
    state.wait = interval(state.throws.length, state.quick);
    stage.sync();
  }

  // ——— Drawing ———

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2));
  }

  /** A coach's face: a smile for praise, a frown for scolding, a straight mouth for silence. */
  function face(ctx, x, y, r, word, lit = true) {
    const colour = word === 'praise' ? COLOURS.praise : word === 'scold' ? COLOURS.scold : COLOURS.nothing;
    ctx.globalAlpha = lit ? 1 : 0.45;
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1b1f27';
    ctx.strokeStyle = '#1b1f27';
    ctx.lineWidth = Math.max(1.5, r * 0.12);
    ctx.lineCap = 'round';
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(x + side * r * 0.36, y - r * 0.22, r * 0.11, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    if (word === 'praise') ctx.arc(x, y + r * 0.02, r * 0.48, Math.PI * 0.18, Math.PI * 0.82);
    else if (word === 'scold') ctx.arc(x, y + r * 0.72, r * 0.42, Math.PI * 1.22, Math.PI * 1.78);
    else {
      ctx.moveTo(x - r * 0.36, y + r * 0.38);
      ctx.lineTo(x + r * 0.36, y + r * 0.38);
    }
    ctx.stroke();
    if (word === 'scold') {
      // Cross brows.
      ctx.beginPath();
      ctx.moveTo(x - r * 0.55, y - r * 0.5);
      ctx.lineTo(x - r * 0.18, y - r * 0.38);
      ctx.moveTo(x + r * 0.55, y - r * 0.5);
      ctx.lineTo(x + r * 0.18, y - r * 0.38);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.lineCap = 'butt';
  }

  function drawBoard(ctx, cx, cy, R, small, labels = true) {
    const rings = ['#1c2532', '#243042', '#1c2532', '#243042', '#1c2532', '#2b3a4f'];
    rings.forEach((colour, i) => {
      ctx.fillStyle = colour;
      ctx.beginPath();
      ctx.arc(cx, cy, R * (1 - i / rings.length), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.strokeStyle = '#3a4a60';
    ctx.lineWidth = 1;
    for (let k = 0; k < 20; k++) {
      const a = (k / 20) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * R * 0.12, cy + Math.sin(a) * R * 0.12);
      ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      ctx.stroke();
    }
    ctx.fillStyle = '#c0504d';
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.06, 0, Math.PI * 2);
    ctx.fill();

    const n = state.throws.length;
    const shown = Math.max(0, n - 24);
    for (let i = shown; i < n; i++) {
      const d = state.throws[i];
      const latest = i === n - 1;
      const age = n - 1 - i;
      const r = M.radius(d.z) * R;
      const x = cx + Math.cos(d.angle) * r;
      let y = cy + Math.sin(d.angle) * r;
      if (latest && state.fly < 1) {
        // The dart flies in from below the board.
        const f = 1 - (1 - state.fly) ** 2;
        y = y + (cy + R * 1.6 - y) * (1 - f);
      }
      const colour = d.word ? COLOURS[d.word] : COLOURS.ink;
      ctx.globalAlpha = latest ? 1 : Math.max(0.15, 0.75 - age * 0.03);
      ctx.fillStyle = colour;
      ctx.beginPath();
      ctx.arc(x, y, latest ? Math.max(4, R * 0.045) : Math.max(2, R * 0.022), 0, Math.PI * 2);
      ctx.fill();
      if (latest) {
        ctx.strokeStyle = '#0a0e15';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    // The latest throw's number and points, and whether it beat the one before.
    if (n && labels) {
      const d = state.throws[n - 1];
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.font = `600 ${small}px system-ui`;
      ctx.fillStyle = COLOURS.soft;
      const label = `${t.labels.board(n)} · ${t.labels.points(M.points(d.z))}`;
      ctx.fillText(label, cx - R, cy - R - small * 0.6, R * 2);
      if (n > 1 && state.fly >= 1) {
        const better = d.z > state.throws[n - 2].z;
        ctx.textAlign = 'right';
        ctx.fillStyle = better ? COLOURS.better : COLOURS.worse;
        ctx.fillText(
          `${better ? '▲' : '▼'} ${better ? t.labels.better : t.labels.worse}`,
          cx + R,
          cy + R + small * 1.3,
        );
      }
    }
  }

  /** Under the board: the coach's face and word, or, when the visitor coaches, the faces to tap. */
  function drawCoach(ctx, box, small, s) {
    state.targets = [];
    const n = state.throws.length;
    const r = Math.min(box.h * 0.36, box.w * 0.12);
    ctx.textBaseline = 'middle';
    if (state.pending) {
      // Three faces to tap: praise, scold, say nothing.
      ctx.font = `600 ${small}px system-ui`;
      ctx.fillStyle = COLOURS.ink;
      ctx.textAlign = 'center';
      ctx.fillText(t.labels.yourWord, box.x + box.w / 2, box.y + small * 0.6);
      const words = ['praise', 'scold', 'nothing'];
      const fr = Math.min(r, (box.h - small * 1.6) * 0.42);
      words.forEach((word, i) => {
        const x = box.x + (box.w * (i + 0.5)) / 3,
          y = box.y + small * 1.4 + (box.h - small * 1.4) / 2;
        face(ctx, x, y, fr, word);
        state.targets.push({ x, y, r: fr * 1.25, word });
      });
      return;
    }
    const last = n ? state.throws[n - 1] : null;
    const word = last && state.fly >= 1 ? last.word || 'nothing' : 'nothing';
    const x = box.x + r + 4,
      y = box.y + box.h / 2;
    face(ctx, x, y, r, word, !!last && state.fly >= 1);
    if (!last || state.fly < 1) return;
    // A speech bubble with the word.
    const text = t.labels[word];
    ctx.font = `700 ${Math.round(small * 1.25)}px system-ui`;
    const tw = Math.min(ctx.measureText(text).width, box.w - 2 * r - 30);
    const bx = x + r + 14,
      bh = small * 2.2;
    ctx.fillStyle = '#e8edf2';
    roundRect(ctx, bx, y - bh / 2, tw + small * 1.4, bh, bh / 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(bx + 2, y - 5);
    ctx.lineTo(bx - 8, y);
    ctx.lineTo(bx + 2, y + 5);
    ctx.fill();
    ctx.fillStyle = '#111722';
    ctx.textAlign = 'left';
    ctx.fillText(text, bx + small * 0.7, y + 1, tw);
  }

  /** The tally: what happened to the next throw after each word. */
  function drawTally(ctx, box, small) {
    const k = M.tally(state.throws);
    const rows = [
      ['praise', t.labels.afterPraise, k.praise, 'worse'],
      ['scold', t.labels.afterScold, k.scold, 'better'],
    ];
    const gap = Math.max(6, box.h * 0.05);
    const rh = (box.h - gap) / 2;
    const compact = rh < small * 6.2;
    rows.forEach(([word, heading, c, key], i) => {
      const y0 = box.y + i * (rh + gap);
      const total = c.better + c.worse;
      ctx.fillStyle = '#111823';
      roundRect(ctx, box.x, y0, box.w, rh, 10);
      ctx.fill();
      ctx.strokeStyle = COLOURS[word];
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.globalAlpha = 1;
      const pad = compact ? 6 : Math.max(8, small * 0.8);
      const fr = compact ? small * 0.65 : Math.min(small * 1.1, rh * 0.18);
      const barH = compact ? 6 : Math.max(8, rh * 0.12),
        barY = y0 + rh - pad - barH,
        barW = box.w - pad * 2;
      face(ctx, box.x + pad + fr, y0 + pad + fr, fr, word);
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.font = `700 ${small + (compact ? 0 : 2)}px system-ui`;
      ctx.fillStyle = COLOURS[word];
      ctx.fillText(heading, box.x + pad * 1.6 + fr * 2, y0 + pad + fr, box.w - pad * 3 - fr * 2);
      // The headline number, between the heading and the bar: worse after praise, better after scolding.
      const top = y0 + pad + fr * 2 + (compact ? 2 : 4),
        bottom = barY - (compact ? 3 : 6);
      const big = Math.round(Math.max(small, Math.min((bottom - top) * 0.85, box.w / 9, 40)));
      const lineY = (top + bottom) / 2;
      ctx.font = `800 ${big}px system-ui`;
      ctx.fillStyle = total ? COLOURS[key] : COLOURS.faint;
      const headline = total ? t.labels.times(c[key], total) : t.labels.none;
      ctx.fillText(headline, box.x + pad, lineY, box.w * 0.6);
      const hw = Math.min(ctx.measureText(headline).width, box.w * 0.6);
      ctx.font = `600 ${small}px system-ui`;
      if (total) ctx.fillText(t.labels[key], box.x + pad + hw + small * 0.6, lineY, box.w - hw - pad * 2 - small * 0.6);
      // A bar: better and worse, side by side.
      ctx.fillStyle = '#1f2a38';
      roundRect(ctx, box.x + pad, barY, barW, barH, barH / 2);
      ctx.fill();
      if (total) {
        const split = (barW * c.better) / total;
        ctx.save();
        roundRect(ctx, box.x + pad, barY, barW, barH, barH / 2);
        ctx.clip();
        ctx.fillStyle = COLOURS.better;
        ctx.fillRect(box.x + pad, barY, split, barH);
        ctx.fillStyle = COLOURS.worse;
        ctx.fillRect(box.x + pad + split, barY, barW - split, barH);
        ctx.restore();
      }
    });
  }

  /** The hidden wiring: a closed box until revealed, then the scatter of "this throw, next throw". */
  function drawWiring(ctx, box, small, s) {
    ctx.strokeStyle = '#2c3a4d';
    ctx.lineWidth = 1.5;
    if (!s.reveal) {
      ctx.setLineDash([6, 5]);
      roundRect(ctx, box.x, box.y, box.w, box.h, 12);
      ctx.stroke();
      ctx.setLineDash([]);
      const cx = box.x + box.w / 2,
        cy = box.y + box.h / 2;
      const r = Math.min(box.w, box.h) * 0.16;
      ctx.fillStyle = '#1a2330';
      roundRect(ctx, cx - r, cy - r * 1.1, r * 2, r * 1.6, 8);
      ctx.fill();
      ctx.fillStyle = COLOURS.soft;
      ctx.font = `800 ${Math.round(r * 0.9)}px system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', cx, cy - r * 0.3);
      ctx.font = `600 ${small}px system-ui`;
      ctx.fillStyle = COLOURS.ink;
      ctx.fillText(t.labels.hidden, cx, cy + r * 0.9, box.w - 20);
      ctx.fillStyle = COLOURS.soft;
      ctx.fillText(t.labels.hiddenHint, cx, cy + r * 0.9 + small * 1.5, box.w - 20);
      return;
    }
    ctx.fillStyle = '#0f151e';
    roundRect(ctx, box.x, box.y, box.w, box.h, 12);
    ctx.fill();
    ctx.stroke();
    // The wiring: words → next throw, connected to nothing (or, if praise helps, a thin wire for praise).
    const pad = Math.max(8, small * 0.8);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = `600 ${small}px system-ui`;
    ctx.fillStyle = COLOURS.soft;
    const wired = t.labels.wired;
    ctx.fillText(wired, box.x + pad, box.y + pad + small * 0.5, box.w - pad * 2);
    const ww = Math.min(ctx.measureText(wired).width, box.w - pad * 2);
    ctx.font = `800 ${small + 1}px system-ui`;
    ctx.fillStyle = s.helps ? COLOURS.praise : COLOURS.ink;
    const answer = s.helps ? t.labels.lift : t.labels.nothing2;
    const oneLine = ww + ctx.measureText(answer).width + small < box.w - pad * 2;
    if (oneLine) ctx.fillText(answer, box.x + pad + ww + small * 0.5, box.y + pad + small * 0.5);
    else ctx.fillText(answer, box.x + pad, box.y + pad + small * 1.8, box.w - pad * 2);
    const top = box.y + pad + small * (oneLine ? 1.6 : 2.9);

    // The scatter.
    const plot = { x: box.x + pad + small * 0.4, y: top + small * 0.4, w: box.w - pad * 2 - small * 0.4, h: 0 };
    plot.h = box.y + box.h - pad - small * 1.2 - plot.y;
    const span = 3;
    const px = (z) => plot.x + ((Math.max(-span, Math.min(span, z)) + span) / (2 * span)) * plot.w;
    const py = (z) => plot.y + plot.h - ((Math.max(-span, Math.min(span, z)) + span) / (2 * span)) * plot.h;
    ctx.strokeStyle = '#243042';
    ctx.lineWidth = 1;
    ctx.strokeRect(plot.x, plot.y, plot.w, plot.h);
    ctx.beginPath();
    ctx.moveTo(px(0), plot.y);
    ctx.lineTo(px(0), plot.y + plot.h);
    ctx.moveTo(plot.x, py(0));
    ctx.lineTo(plot.x + plot.w, py(0));
    ctx.stroke();
    // "Same again": the rising diagonal.
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = COLOURS.faint;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px(-span), py(-span));
    ctx.lineTo(px(span), py(span));
    ctx.stroke();
    ctx.setLineDash([]);
    const dot = Math.max(2, Math.min(4, plot.w / 110));
    const th = state.throws;
    for (let i = 0; i + 1 < th.length; i++) {
      const word = th[i].word;
      ctx.fillStyle = word ? COLOURS[word] : COLOURS.nothing;
      ctx.globalAlpha = word ? 0.95 : 0.5;
      ctx.beginPath();
      ctx.arc(px(th[i].z), py(th[i + 1].z), word ? dot * 1.25 : dot, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    const f = M.fit(th);
    ctx.font = `600 ${small - 1}px system-ui`;
    if (f) {
      ctx.strokeStyle = COLOURS.ink;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px(-span), py(f.intercept - span * f.slope));
      ctx.lineTo(px(span), py(f.intercept + span * f.slope));
      ctx.stroke();
      ctx.fillStyle = COLOURS.ink;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(t.labels.fitted, plot.x + plot.w - 4, py(f.intercept + span * f.slope) - 4);
    }
    ctx.fillStyle = COLOURS.soft;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    if (plot.w > 200) ctx.fillText(t.labels.same, plot.x + plot.w - 4, plot.y + 4);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(t.labels.thisThrow, plot.x + plot.w, plot.y + plot.h + 3);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(t.labels.nextThrow, plot.x + 4, plot.y + 4);
  }

  function scene(ctx, width, height, s) {
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    const small = Math.round(Math.min(13, Math.max(10, Math.min(width, height) / 32)));
    const pad = Math.max(8, Math.min(18, Math.min(width, height) * 0.03));
    const leftW = width * 0.46;
    // The coach's face and word at the top, then the board, so both are in view as the room opens.
    const coachH = Math.max(52, Math.min(110, height * 0.17));
    drawCoach(ctx, { x: pad, y: pad, w: leftW - 2 * pad, h: coachH }, small, s);
    const R = Math.max(30, Math.min((leftW - 2 * pad) / 2, (height - 2 * pad - coachH - small * 3.6) / 2));
    drawBoard(ctx, pad + (leftW - 2 * pad) / 2, pad + coachH + small * 1.8 + R, R, small);
    const rx = leftW + pad * 0.5,
      rw = width - rx - pad;
    const tallyH = (height - 3 * pad) * (height < 400 ? 0.5 : 0.42);
    drawTally(ctx, { x: rx, y: pad, w: rw, h: tallyH }, small);
    drawWiring(ctx, { x: rx, y: pad * 2 + tallyH, w: rw, h: height - tallyH - 3 * pad }, small, s);
  }

  function draw(ctx, s, stage) {
    if (state.key !== keyOf(s)) restart(s, stage, state.throws.length > 0);
    scene(ctx, stage.width, stage.height, s);
  }

  /** The map's picture: the board with its darts between the two faces. */
  function preview(ctx, width, height) {
    const saved = { ...state, throws: state.throws };
    const s = { seed: 128, share: 20, helps: false, auto: true, reveal: false };
    state.rand = M.random(s.seed);
    state.throws = [];
    state.fly = 1;
    state.pending = false;
    while (state.throws.length < 24) throwOne(s);
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    // The board in the middle, praise and scolding in two corners, so any crop of the picture keeps all three.
    const m = Math.min(width, height);
    const R = m * 0.38,
      fr = m * 0.12;
    drawBoard(ctx, width / 2, height / 2, R, 10, false);
    face(ctx, width / 2 - (m / 2 - fr * 1.2), fr * 1.25, fr, 'praise');
    face(ctx, width / 2 + (m / 2 - fr * 1.2), height - fr * 1.25, fr, 'scold');
    Object.assign(state, saved);
  }

  function readouts(s) {
    const n = state.throws.length;
    $('scene-status').textContent = state.pending
      ? t.status.waiting(n)
      : n >= MAX
        ? t.status.done(n)
        : t.status.count(n);
    $('scene-action').textContent = s.reveal ? t.hideLabel : t.actionLabel;
  }

  W.defineRoom({
    id: 'regress',
    symbol: '↘',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'chance',
    added: '2026-10-07',
    tagline: t.tagline,
    accent: { background: '#2a2620', border: '#fde047', color: '#fef08a' },

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
    connection: { ...t.connection, go: 'treasure' },

    defaults: { seed: 128, share: 20, auto: true, helps: false, reveal: false },
    ranges: { seed: [1, 999999, 'integer'], share: [10, 50, 'integer'] },
    defaultPreset: 0,
    presets: [
      { settings: { share: 20, auto: true, helps: false, reveal: false } },
      { settings: { share: 20, auto: false, helps: false, reveal: false } },
      { settings: { share: 20, auto: true, helps: true, reveal: false } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Galton',
        color: '#fde047',
        sketch: {
          hairStyle: 'receding',
          hair: '#d8d4cc',
          skin: '#efcfb1',
          moustache: true,
          brows: 'bold',
          backdrop: '#2a2620',
        },
      },
      {
        ...t.guests[1],
        color: '#7dd3fc',
        sketch: { hairStyle: 'receding', hair: '#cfcac2', skin: '#e9c3a0', glasses: 'round', backdrop: '#1f2a36' },
      },
    ],

    insight: t.insight,

    controls: (s, stage) =>
      `<div class="wide regress-words" role="group" aria-label="${t.panelEyebrow}">` +
      ['praise', 'scold', 'nothing']
        .map(
          (word) => `<button class="button regress-word" type="button" data-word="${word}">${t.words[word]}</button>`,
        )
        .join('') +
      '</div>' +
      stage.check('auto', t.auto, s.auto) +
      stage.slider('share', t.share, 10, 50, 5, s.share, '%', t.shareHint) +
      stage.check('helps', t.helps, s.helps),

    bindControls(panel, s, stage) {
      panel
        .querySelectorAll('[data-word]')
        .forEach((button) => button.addEventListener('click', () => coach(button.dataset.word, s, stage)));
      // Switching the automatic coach on answers a waiting throw at once; switching it off waits for the next one.
      panel.querySelector('[data-check="auto"]').addEventListener('change', () => {
        const last = state.throws[state.throws.length - 1];
        if (s.auto && state.pending && last) {
          last.word = M.autoWord(last.z, share(s));
          state.pending = false;
          if (reduced || !stage.playing) {
            while (state.throws.length < MAX) throwOne(s);
            finish();
          } else state.wait = 0.2;
        }
        stage.sync();
        stage.draw();
      });
    },

    onPreset(s, stage) {
      restart(s, stage, true);
    },
    onInput(s, stage) {
      restart(s, stage, true);
    },
    enter(s, stage) {
      if (state.key !== keyOf(s) || !state.throws.length) restart(s, stage);
      stage.sync();
    },
    readouts,
    draw,
    step,
    preview,

    action(s, stage) {
      s.reveal = !s.reveal;
      if (s.reveal) {
        const f = M.fit(state.throws);
        if (f) W.announce(`${t.labels.wired} ${s.helps ? t.labels.lift : t.labels.nothing2}`);
      }
      stage.sync();
      stage.draw();
    },
    reset(s, stage) {
      s.seed = 1 + Math.floor(Math.random() * 999999);
      restart(s, stage);
      stage.sync();
    },

    pointer: {
      down(p, s, stage) {
        const x = p.x * stage.width,
          y = p.y * stage.height;
        const hit = state.targets.find((target) => Math.hypot(x - target.x, y - target.y) <= target.r);
        if (hit) coach(hit.word, s, stage);
      },
      arrow(dx, dy, s, stage) {
        if (!state.pending) return;
        coach(dy < 0 ? 'praise' : dy > 0 ? 'scold' : 'nothing', s, stage);
      },
    },
  });
})();
