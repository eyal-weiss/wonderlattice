/* Room · The staircase of sound: Shepard tones, a scale that climbs forever, and two notes that go up or down. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, clamp, TAU } = W;
  const M = W.models.stairs;
  const t = W.text('stairs');
  const reduced = W.prefersReducedMotion();

  const STEPS = 0,
    GLIDE = 1;
  const AMP = 0.28; // the whole sound's loudest, at full volume (50%)
  const SNAP = 0.1; // seconds a step takes to move in the picture
  const PAIR_TONE = 0.55, // seconds each note of a pair sounds …
    PAIR_GAP = 0.12, // … with this silence between them
    PAIR_HOLD = 6, // seconds the pair stays on the picture after an answer, before the scale climbs on …
    PAIR_WAIT = 20; // … or this much longer when nobody answers

  // Where the climb has got to, in semitone steps (a real number: steps are its whole part).
  let pos = 0;
  // The tritone test: the two notes, when they started (performance.now()), and the answer.
  let pair = null,
    nextPair = 0;
  let room = null;

  // ── Sound ────────────────────────────────────────────────────────────────────
  // Eight sine waves an octave apart under one master gain. Sound starts only after a click and stops on leaving.

  let audio = null,
    sounding = false,
    nodes = null,
    lastStep = null,
    pump = 0,
    pairNodes = [];

  const volumeOf = (s) => (AMP * s.volume) / 50;

  function stopSound() {
    sounding = false;
    clearInterval(pump);
    pump = 0;
    if (nodes) {
      const at = audio.currentTime;
      try {
        nodes.master.gain.cancelScheduledValues(at);
        nodes.master.gain.setTargetAtTime(0, at, 0.04);
        for (const { osc } of nodes.voices) osc.stop(at + 0.3);
      } catch {
        /* already stopped */
      }
      nodes = null;
    }
    lastStep = null;
    if (W.stage.isShowing(room)) $('scene-action').textContent = t.soundOff;
  }

  function stopPair() {
    if (!audio) return;
    for (const { osc, gain } of pairNodes) {
      try {
        gain.gain.cancelScheduledValues(audio.currentTime);
        gain.gain.setTargetAtTime(0, audio.currentTime, 0.02);
        osc.stop(audio.currentTime + 0.15);
      } catch {
        /* already stopped */
      }
    }
    pairNodes = [];
  }

  function startSound(s) {
    const at = audio.currentTime;
    const master = audio.createGain();
    // A gentle start: the sound fades in over a second and a half.
    master.gain.setValueAtTime(0, at);
    master.gain.linearRampToValueAtTime(volumeOf(s), at + 1.5);
    master.connect(audio.destination);
    const voices = M.partials(pos, s.bell).map((p) => {
      const osc = audio.createOscillator(),
        gain = audio.createGain();
      osc.frequency.value = p.frequency;
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(master);
      osc.start(at);
      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
      return { osc, gain, x: p.x };
    });
    nodes = { master, voices };
    lastStep = null;
  }

  /** Bring the eight voices to the climb's position: a new note on each step, or a smooth slide. */
  function sounds(s) {
    if (!nodes) return;
    const at = audio.currentTime,
      norm = M.strength(s.bell);
    if (s.mode === GLIDE) {
      M.partials(pos, s.bell).forEach((p, j) => {
        const v = nodes.voices[j];
        // A voice that wraps from the top of the range to the bottom is silent there, so it jumps at once.
        if (p.x < v.x - 1) v.osc.frequency.setValueAtTime(p.frequency, at);
        else v.osc.frequency.setTargetAtTime(p.frequency, at, 0.015);
        v.gain.gain.setTargetAtTime(p.level / norm, at, 0.03);
        v.x = p.x;
      });
      lastStep = null;
      return;
    }
    const n = Math.floor(pos);
    if (n === lastStep) return;
    lastStep = n;
    const length = 1 / s.speed;
    M.partials(n, s.bell).forEach((p, j) => {
      const v = nodes.voices[j];
      v.osc.frequency.setValueAtTime(p.frequency, at);
      v.gain.gain.cancelScheduledValues(at);
      v.gain.gain.setTargetAtTime(p.level / norm, at, 0.012);
      // Each note ends a little before the next, so the steps are heard as steps.
      v.gain.gain.setTargetAtTime(0, at + length * 0.75, 0.02);
      v.x = p.x;
    });
  }

  async function wake() {
    W.narration.stop();
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) throw Error('No Web Audio');
    audio ??= new AudioContext();
    await audio.resume();
  }

  let watching = false;
  /** A hidden page stops drawing, so the climb would hang on one chord: stop the sound instead. */
  function watchVisibility() {
    if (watching) return;
    watching = true;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && sounding) stopSound();
    });
  }

  async function toggleSound() {
    if (sounding) return stopSound();
    try {
      watchVisibility();
      await wake();
      if (!W.stage.isShowing(room)) return;
      stopPair();
      pair = null;
      sounding = true;
      const s = W.stage.settingsFor('stairs');
      startSound(s);
      sounds(s);
      // The picture moves with the sound, except with reduced motion: then it shows each step, without sliding.
      if (!reduced) W.stage.setPlaying(true);
      else pump = setInterval(() => climb(0.05, s, W.stage, true), 50);
      $('scene-action').textContent = t.soundOn;
      W.stage.sync();
      W.stage.draw();
    } catch {
      stopSound();
      W.toast(t.noSound);
    }
  }

  /** Play the two notes of a pair, half an octave apart, each a full Shepard tone. */
  async function playPair(s, st) {
    try {
      await wake();
    } catch {
      return W.toast(t.noSound);
    }
    if (!W.stage.isShowing(room)) return;
    stopSound();
    stopPair();
    const [a, b] = M.tritone(nextPair);
    nextPair = (nextPair + 5) % 12; // the next pair starts elsewhere on the circle
    pair = { a, b, started: performance.now(), answered: null, answeredAt: 0 };
    const at = audio.currentTime + 0.05,
      volume = volumeOf(s),
      norm = M.strength(M.OCTAVES);
    [a, b].forEach((note, i) => {
      const start = at + i * (PAIR_TONE + PAIR_GAP);
      for (const p of M.partials(note)) {
        const osc = audio.createOscillator(),
          gain = audio.createGain();
        osc.frequency.value = p.frequency;
        gain.gain.setValueAtTime(0, at);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime((volume * p.level) / norm, start + 0.03);
        gain.gain.setTargetAtTime(0, start + PAIR_TONE - 0.08, 0.025);
        osc.connect(gain);
        gain.connect(audio.destination);
        osc.onended = () => {
          osc.disconnect();
          gain.disconnect();
        };
        osc.start(start);
        osc.stop(start + PAIR_TONE + 0.15);
        pairNodes.push({ osc, gain });
      }
    });
    // The picture follows the two notes, even when it isn't moving.
    setTimeout(() => W.stage.isShowing(room) && st.draw(), (PAIR_TONE + PAIR_GAP) * 1000 + 60);
    renderPair();
    st.sync();
    st.draw();
  }

  function answer(up, st) {
    if (!pair || pair.answered !== null) return;
    pair.answered = up;
    pair.answeredAt = performance.now();
    const words = t.pair.answer(up, t.notes[pair.a], t.notes[pair.b]);
    $('stairs-answer').textContent = words;
    W.announce(words);
    renderPair();
    st.sync();
    st.draw();
  }

  /** The pair's buttons: Up and Down only once there is a pair to judge. */
  function renderPair() {
    if (!$('stairs-up')) return;
    const open = !!pair && pair.answered === null;
    $('stairs-up').disabled = !open;
    $('stairs-down').disabled = !open;
    $('stairs-up').setAttribute('aria-pressed', pair?.answered === true);
    $('stairs-down').setAttribute('aria-pressed', pair?.answered === false);
    $('stairs-play').textContent = pair ? t.pair.again : t.pair.play;
  }

  // ── The climb ────────────────────────────────────────────────────────────────

  /** Move the climb on by dt seconds (unless a pair is on show), and keep the sound with it. */
  function climb(dt, s, st, redraw) {
    if (pair) {
      const now = performance.now();
      const done = pair.answered !== null ? now - pair.answeredAt : now - pair.started - PAIR_WAIT * 1000;
      if (done < PAIR_HOLD * 1000) return;
      pair = null;
      renderPair();
      st.sync();
    }
    const before = Math.floor(pos);
    pos += dt * s.speed;
    if (sounding) sounds(s);
    if (Math.floor(pos) !== before) {
      st.sync();
      if (redraw) st.draw();
    }
  }

  /** Where the picture shows the climb: steps snap from one note to the next, a glide slides. */
  function shown(s, st) {
    if (pair) {
      const second = performance.now() - pair.started > (PAIR_TONE + PAIR_GAP / 2) * 1000;
      return second ? pair.b : pair.a;
    }
    if (s.mode === GLIDE && st.playing) return pos;
    const n = Math.floor(pos);
    if (!st.playing || n === 0) return n;
    const f = clamp((pos - n) / (SNAP * s.speed), 0, 1);
    return n - 1 + f * f * (3 - 2 * f);
  }

  // ── Drawing ──────────────────────────────────────────────────────────────────

  const GOLD = [255, 209, 102],
    CYAN = [127, 214, 255];
  const rgba = (c, a) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;

  /** The helix on the left (or on top of a tall picture), the circle seen from above, and the tones as bars. */
  function place(w, h) {
    const pad = Math.round(clamp(Math.min(w, h) * 0.04, 8, 22));
    const small = Math.round(clamp(Math.min(w, h) / 30, 10, 13));
    if (h > w * 1.15) {
      const top = Math.round(h * 0.56),
        y = top + pad,
        bh = h - y - pad,
        cw = Math.round((w - pad * 3) * 0.44);
      return {
        pad,
        small,
        helix: { x: pad, y: pad, w: w - pad * 2, h: top - pad },
        circle: { x: pad, y, w: cw, h: bh },
        spectrum: { x: pad * 2 + cw, y, w: w - cw - pad * 3, h: bh },
      };
    }
    const hw = Math.round(w * 0.46),
      x = hw + pad,
      rw = w - x - pad,
      ch = Math.round((h - pad * 3) * 0.5);
    return {
      pad,
      small,
      helix: { x: pad, y: pad, w: hw - pad, h: h - pad * 2 },
      circle: { x, y: pad, w: rw, h: ch },
      spectrum: { x, y: pad * 2 + ch, w: rw, h: h - ch - pad * 3 },
    };
  }

  function label(ctx, text, x, y, size, color, align = 'left', max) {
    ctx.font = `${size}px system-ui, sans-serif`;
    ctx.textAlign = align;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y, max);
  }

  /** A glowing dot: brighter and bigger the louder its tone. */
  function glow(ctx, x, y, level, size, color) {
    if (level < 0.004) {
      ctx.strokeStyle = 'rgba(150, 160, 190, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, size * 0.35, 0, TAU);
      ctx.stroke();
      return;
    }
    const r = size * (0.35 + 0.65 * Math.sqrt(level));
    const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 2.6);
    halo.addColorStop(0, rgba(color, 0.55 * level));
    halo.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, r * 2.6, 0, TAU);
    ctx.fill();
    ctx.fillStyle = rgba(color, 0.35 + 0.65 * level);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }

  /**
   * The spiral of pitch: one turn for each octave, going up for height and round for the note. Each tone sounding is
   * a dot on its own turn, all at the same place round the spiral; the curve beside it shows how loud each height is.
   */
  function drawHelix(ctx, R, at, bell, small, words = true) {
    const ps = M.partials(at, bell);
    const top = R.y + (words ? small * 2.4 : 6),
      bottom = R.y + R.h - (words ? small * 2.2 : 6);
    const bw = Math.min(R.w * 0.2, 70); // the loudness curve's width
    const rx = Math.max(12, Math.min((R.w - bw - small * 3) * 0.42, (bottom - top) * 0.5)),
      ry = rx * 0.3;
    const cx = R.x + small * 1.6 + rx + 4;
    const th = (bottom - top - ry * 2) / M.OCTAVES; // the height of one turn
    // C is at the back, as at the top of the circle seen from above; the notes go round clockwise from above.
    const point = (x) => [cx + rx * Math.sin(TAU * x), bottom - ry - x * th - ry * Math.cos(TAU * x)];
    // The spiral, its far side faint and its near side brighter.
    ctx.lineWidth = 1.4;
    for (let i = 0; i < M.OCTAVES * 48; i++) {
      const a = i / 48,
        b = (i + 1) / 48;
      const near = -Math.cos(TAU * (a + b) * 0.5);
      ctx.strokeStyle = `rgba(150, 140, 230, ${0.16 + 0.3 * (near + 1) * 0.5})`;
      ctx.beginPath();
      ctx.moveTo(...point(a));
      ctx.lineTo(...point(b));
      ctx.stroke();
    }
    // Twelve small marks on every turn: the notes.
    ctx.fillStyle = 'rgba(170, 165, 230, 0.35)';
    for (let i = 0; i <= M.OCTAVES * 12; i++) {
      const [x, y] = point(i / 12);
      ctx.fillRect(x - 1, y - 1, 2, 2);
    }
    // The loudness curve, standing beside the spiral: wide where the tones are loud.
    const lx = R.x + R.w - bw;
    ctx.beginPath();
    ctx.moveTo(lx, bottom - ry);
    for (let i = 0; i <= 96; i++) {
      const x = (i / 96) * M.OCTAVES;
      ctx.lineTo(lx + M.loudness(x, bell) * bw, bottom - ry - x * th);
    }
    ctx.lineTo(lx, bottom - ry - M.OCTAVES * th);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 209, 102, 0.12)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 209, 102, 0.55)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    // The tones: far ones first, so the near ones glow over them.
    const dots = ps.map((p) => ({ p, at: point(p.x), near: -Math.cos(TAU * p.x) })).sort((a, b) => a.near - b.near);
    for (const { p, at: xy } of dots) {
      // A thread from each tone to its height on the curve.
      if (p.level > 0.004) {
        ctx.strokeStyle = rgba(GOLD, 0.15 + 0.35 * p.level);
        ctx.setLineDash([2, 4]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(xy[0], xy[1]);
        ctx.lineTo(lx + M.loudness(p.x, bell) * bw, bottom - ry - p.x * th);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      glow(ctx, xy[0], xy[1], p.level, Math.max(5, Math.min(11, th * 0.36)), pair && at === pair.b ? CYAN : GOLD);
    }
    if (!words) return;
    // Up the side: higher at the top, lower at the bottom.
    const ax = R.x + small * 0.6;
    ctx.strokeStyle = 'rgba(200, 205, 225, 0.5)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(ax, bottom - small);
    ctx.lineTo(ax, top + small * 0.4);
    ctx.moveTo(ax - 4, top + small * 0.4 + 6);
    ctx.lineTo(ax, top + small * 0.4);
    ctx.lineTo(ax + 4, top + small * 0.4 + 6);
    ctx.stroke();
    label(ctx, t.labels.higher, R.x, top - small * 0.8, small, '#c8cde0', 'left', R.w * 0.5);
    label(ctx, t.labels.curve, R.x + R.w, top - small * 0.8, small, 'rgba(255, 209, 102, 0.85)', 'right', R.w * 0.45);
    label(ctx, t.labels.turn, R.x, bottom + small * 1.5, small, '#9aa3bd', 'left', R.w);
  }

  /** Seen from above, the spiral is a circle of twelve notes: the climb goes round and round. */
  function drawCircle(ctx, R, at, small) {
    label(ctx, t.labels.above, R.x, R.y + small, small, '#c8cde0', 'left', R.w);
    const cx = R.x + R.w / 2,
      cy = R.y + small * 1.6 + (R.h - small * 1.6) / 2;
    const r = Math.max(14, Math.min(R.w * 0.5, (R.h - small * 1.6) * 0.5) - small * 1.8);
    const angle = (c) => -Math.PI / 2 + (TAU * c) / 12;
    ctx.strokeStyle = 'rgba(150, 140, 230, 0.45)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.stroke();
    // The way up: round the circle, clockwise.
    if (!pair) {
      ctx.strokeStyle = 'rgba(255, 209, 102, 0.3)';
      ctx.lineWidth = 2;
      const c = angle(M.chroma(at));
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.8, c - 1.1, c - 0.15);
      ctx.stroke();
      const [hx, hy] = [cx + r * 0.8 * Math.cos(c - 0.15), cy + r * 0.8 * Math.sin(c - 0.15)];
      const d = c - 0.15 + Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(hx + 6 * Math.cos(d - 2.5), hy + 6 * Math.sin(d - 2.5));
      ctx.lineTo(hx, hy);
      ctx.lineTo(hx + 6 * Math.cos(d + 2.5) - 0, hy + 6 * Math.sin(d + 2.5));
      ctx.stroke();
    }
    for (let c = 0; c < 12; c++) {
      const a = angle(c);
      ctx.fillStyle = 'rgba(170, 165, 230, 0.6)';
      ctx.beginPath();
      ctx.arc(cx + r * Math.cos(a), cy + r * Math.sin(a), 2.2, 0, TAU);
      ctx.fill();
      const bright = pair ? c === pair.a || c === pair.b : Math.round(M.chroma(at)) % 12 === c;
      // A small circle names every third note, and the lit ones.
      if (r < 40 && c % 3 && !bright) continue;
      label(
        ctx,
        t.notes[c],
        cx + (r + small * 1.1) * Math.cos(a),
        cy + (r + small * 1.1) * Math.sin(a) + small * 0.35,
        small,
        bright ? '#f4f1ff' : '#8e96b0',
        'center',
      );
    }
    if (pair) {
      // The two notes sit opposite each other: up (clockwise) and down are the same length.
      const a = angle(pair.a);
      for (const [dir, words, c] of [
        [1, t.labels.up, GOLD],
        [-1, t.labels.down, CYAN],
      ]) {
        ctx.strokeStyle = rgba(c, 0.6);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.72, a + dir * 0.18, a + dir * (Math.PI - 0.18), dir < 0);
        ctx.stroke();
        const mid = a + (dir * Math.PI) / 2;
        label(
          ctx,
          words,
          cx + r * 0.45 * Math.cos(mid),
          cy + r * 0.45 * Math.sin(mid) + small * 0.35,
          small,
          rgba(c, 0.95),
          'center',
        );
      }
      glow(ctx, cx + r * Math.cos(a), cy + r * Math.sin(a), 1, 8, GOLD);
      const b = angle(pair.b);
      glow(ctx, cx + r * Math.cos(b), cy + r * Math.sin(b), 1, 8, CYAN);
      return;
    }
    const c = angle(M.chroma(at));
    glow(ctx, cx + r * Math.cos(c), cy + r * Math.sin(c), 1, 8, GOLD);
    // In the middle, how many steps up the climb has gone.
    ctx.font = `600 ${Math.round(clamp(r * 0.42, 14, 34))}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f4f1ff';
    ctx.save();
    ctx.direction = 'ltr';
    ctx.fillText(`↑${new Intl.NumberFormat(W.numberLocale).format(Math.floor(pos))}`, cx, cy + r * 0.15);
    ctx.restore();
  }

  /** The same tones as bars, low on the left and high on the right, under the fixed loudness curve. */
  function drawSpectrum(ctx, R, at, bell, small) {
    label(ctx, t.labels.tones, R.x, R.y + small, small, '#c8cde0', 'left', R.w);
    const x0 = R.x + 2,
      x1 = R.x + R.w - 2,
      base = R.y + R.h - small * 1.6,
      ph = base - (R.y + small * 2.4);
    const px = (x) => x0 + ((x1 - x0) * x) / M.OCTAVES;
    ctx.strokeStyle = 'rgba(200, 205, 225, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x0, base + 0.5);
    ctx.lineTo(x1, base + 0.5);
    ctx.stroke();
    // The loudness curve stays put while the tones slide under it.
    ctx.beginPath();
    for (let i = 0; i <= 120; i++) {
      const x = (i / 120) * M.OCTAVES;
      ctx[i ? 'lineTo' : 'moveTo'](px(x), base - M.loudness(x, bell) * ph);
    }
    ctx.strokeStyle = 'rgba(255, 209, 102, 0.55)';
    ctx.lineWidth = 1.4;
    ctx.stroke();
    const bar = clamp((x1 - x0) / 70, 3, 9);
    for (const p of M.partials(at, bell)) {
      const x = px(p.x),
        hgt = Math.max(2, p.level * ph);
      ctx.fillStyle = rgba(pair && at === pair.b ? CYAN : GOLD, 0.25 + 0.75 * p.level);
      ctx.fillRect(x - bar / 2, base - hgt, bar, hgt);
    }
    // Pitch rises to the right, in every language: the arrow is drawn, not written.
    const ay = base + small * 0.95;
    label(ctx, t.labels.pitch, x1 - 18, base + small * 1.3, small, '#9aa3bd', 'right', R.w * 0.6);
    ctx.strokeStyle = '#9aa3bd';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x1 - 14, ay);
    ctx.lineTo(x1, ay);
    ctx.moveTo(x1 - 4, ay - 3.5);
    ctx.lineTo(x1, ay);
    ctx.lineTo(x1 - 4, ay + 3.5);
    ctx.stroke();
    // A narrow curve gives the trick away: each tone that fades out at the top is followed by one an octave down.
    if (bell <= 2.5) {
      const l = px(M.CENTRE - bell / 2),
        r = px(M.CENTRE + bell / 2),
        y = base + small * 0.7;
      ctx.strokeStyle = 'rgba(127, 214, 255, 0.75)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(r, y);
      ctx.lineTo(l, y);
      ctx.moveTo(l + 5, y - 4);
      ctx.lineTo(l, y);
      ctx.lineTo(l + 5, y + 4);
      ctx.stroke();
      label(ctx, t.labels.drop, (l + r) / 2, base - ph - small * 0.1, small, 'rgba(127, 214, 255, 0.9)', 'center', R.w);
    }
  }

  function draw(ctx, s, st) {
    const { width: w, height: h } = st;
    ctx.clearRect(0, 0, w, h);
    const L = place(w, h);
    const at = shown(s, st);
    drawHelix(ctx, L.helix, at, s.bell, L.small);
    drawCircle(ctx, L.circle, at, L.small);
    drawSpectrum(ctx, L.spectrum, at, s.bell, L.small);
  }

  /** The map's picture: the spiral in the middle, its tones glowing, and their bars faint behind. */
  function preview(ctx, width, height) {
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    for (const p of M.partials(3)) {
      ctx.fillStyle = rgba(GOLD, 0.08 + 0.25 * p.level);
      const x = (width * p.x) / M.OCTAVES,
        hgt = p.level * height * 0.7;
      ctx.fillRect(x - 3, height - hgt, 6, hgt);
    }
    const side = Math.min(width, height);
    drawHelix(ctx, { x: width / 2 - side * 0.5, y: 0, w: side, h: height }, 3, M.OCTAVES, 10, false);
  }

  // ── The panel ────────────────────────────────────────────────────────────────

  function controls(s, st) {
    return (
      `<div class="control wide"><span style="font-size:0.875rem">${t.how}</span><div class="segment" role="group" aria-label="${t.how}">` +
      t.modes.map((m, i) => `<button id="stairs-mode-${i}" aria-pressed="${s.mode === i}">${m}</button>`).join('') +
      `</div></div>` +
      st.slider('bell', t.bell, 1, 8, 0.5, s.bell, '', t.bellHint) +
      st.slider('speed', t.speed, 0.5, 4, 0.5, s.speed) +
      st.slider('volume', t.volume, 0, 50, 1, s.volume, '%') +
      `<div class="control wide stairs-pair"><h3>${t.pair.title}</h3><p>${t.pair.text}</p>` +
      `<button class="button" id="stairs-play">${t.pair.play}</button>` +
      `<div class="segment" role="group" aria-label="${t.pair.title}"><button id="stairs-up" disabled aria-pressed="false">${t.pair.up}</button><button id="stairs-down" disabled aria-pressed="false">${t.pair.down}</button></div>` +
      `<p class="stairs-answer" id="stairs-answer"></p></div>`
    );
  }

  function bindControls(panel, s, st) {
    t.modes.forEach((_, i) =>
      $(`stairs-mode-${i}`).addEventListener('click', () => {
        s.mode = i;
        st.setChosen(-1);
        t.modes.forEach((__, j) => $(`stairs-mode-${j}`).setAttribute('aria-pressed', j === i));
        lastStep = null;
        if (sounding) sounds(s);
        st.sync();
        st.draw();
      }),
    );
    $('stairs-play').addEventListener('click', () => playPair(s, st));
    $('stairs-up').addEventListener('click', () => answer(true, st));
    $('stairs-down').addEventListener('click', () => answer(false, st));
    renderPair();
  }

  function readouts(s) {
    $('scene-status').textContent = pair
      ? t.status.pair(t.notes[pair.a], t.notes[pair.b])
      : s.mode === GLIDE
        ? t.status.glide(Math.floor(pos / 12))
        : t.status.steps(Math.floor(pos), Math.floor(pos) % 12);
    $('scene-name').textContent = t.sceneNames[s.bell <= 2.5 ? 2 : s.mode];
    $('scene-action').textContent = sounding ? t.soundOn : t.soundOff;
  }

  /** Back to the bottom step, with no pair on show. */
  function restart(s, st) {
    pos = 0;
    lastStep = null;
    pair = null;
    stopPair();
    if (sounding) sounds(s);
    renderPair();
    st.sync();
    st.draw();
  }

  room = W.defineRoom({
    id: 'stairs',
    symbol: '♫',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'signals',
    added: '2026-10-07',
    tagline: t.tagline,
    accent: { background: '#1d1a33', border: '#a99cf0', color: '#ddd6ff' },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.sceneLabel,
    sceneName: t.sceneNames[0],
    tip: t.tip,
    actionLabel: t.soundOff,
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { ...t.connection, go: 'waves' },

    defaults: { mode: STEPS, bell: 8, speed: 2.5, volume: 20 },
    ranges: { mode: [STEPS, GLIDE, 'integer'], bell: [1, 8], speed: [0.5, 4], volume: [0, 50] },
    defaultPreset: 0,
    presets: [
      { badge: '12', settings: { mode: STEPS, bell: 8, speed: 2.5 } },
      { badge: '∞', settings: { mode: GLIDE, bell: 8, speed: 1.5 } },
      { badge: '1', settings: { mode: STEPS, bell: 1, speed: 2.5 } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        color: '#a99cf0',
        sketch: {
          hairStyle: 'receding',
          hair: '#d9d4cb',
          skin: '#efcfb0',
          beard: 'short',
          glasses: 'square',
          backdrop: '#232040',
        },
      },
      {
        ...t.guests[1],
        color: '#7fd6ff',
        sketch: { hairStyle: 'swept', hair: '#cfcac2', skin: '#eccdb0', brows: 'bold', backdrop: '#17263a' },
      },
      {
        ...t.guests[2],
        color: '#ffd166',
        sketch: { hairStyle: 'long', hair: '#b5823f', skin: '#f1d2b6', backdrop: '#2b2416' },
      },
    ],

    insight: t.insight,

    controls,
    bindControls,
    readouts,
    draw,
    preview,
    enter(s, st) {
      restart(s, st);
    },
    step(dt, s, st) {
      climb(dt, s, st, false);
    },
    action: toggleSound,
    onInput(s) {
      lastStep = null;
      if (nodes) nodes.master.gain.setTargetAtTime(volumeOf(s), audio.currentTime, 0.05);
      if (sounding) sounds(s);
    },
    onPreset(s, st) {
      restart(s, st);
    },
    reset(s, st) {
      restart(s, st);
    },
    silence() {
      stopSound();
      stopPair();
    },
    soundOn: () => sounding,
  });
})();
