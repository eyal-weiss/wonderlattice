/* Room · Rhythms from Euclid: beats spread as evenly as possible round a circle, and the rhythms they make. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, clamp, TAU } = W;
  const R = W.models.rhythm;
  const t = W.text('rhythm');
  const reduced = W.prefersReducedMotion();

  // The rings, outside in: their colours, their settings (steps, beats, the step they start on), and their sounds.
  const COLOURS = ['#f2c46d', '#6fd6c8', '#f39ac0'];
  const KEYS = [
    ['steps', 'beats', 'start'],
    ['stepsb', 'beatsb', 'startb'],
    ['stepsc', 'beatsc', 'startc'],
  ];
  const MAX_STEPS = 24;
  const SIZES = [1, 0.72, 0.46]; // each ring's radius, as a share of the outer one
  const HOLD = 0.7; // seconds the beats wait, bunched together, before they spread out
  const GLIDE = 3.2; // how quickly a beat glides to its new place (per second)
  const GLOW = 0.16; // seconds a beat keeps glowing after the hand passes it
  // Named rhythms shown under the rows of boxes, where there is room: a tap plays one on the outer ring.
  const GALLERY = ['tresillo', 'cinquillo', 'bossa', 'bell', 'samba', 'aksak', 'ruchenitza', 'cumbia', 'venda'];
  const MUTED = 'rgba(200, 206, 220, 0.75)';

  let phase = 0, // turns of the hand
    editing = 0, // the ring the sliders change
    hold = 0, // seconds left before the opening spread
    shown = [[], [], []], // each ring's beats where they are drawn now, in turns (unwrapped)
    hits = [], // the gallery's rhythms where they were last drawn, for taps
    announced = '';

  const mod = (x, m) => ((x % m) + m) % m;

  /** Ring j's numbers and pattern. */
  function ringOf(s, j) {
    const [nk, kk, rk] = KEYS[j];
    const n = s[nk],
      k = s[kk],
      r = s[rk];
    const p = R.pattern(k, n, r);
    // Where each of E(k, n)'s beats sits once the ring starts on step r, in turns.
    const targets = R.beats(R.euclid(k, n)).map((b) => (b - r) / n);
    return { n, k, r, p, targets, colour: COLOURS[j], named: R.named(k, n) };
  }
  const ringsOf = (s) => Array.from({ length: s.rings }, (_, j) => ringOf(s, j));

  /** Beats never outnumber steps, and a ring starts on one of its own steps (also for a value from a link). */
  function tidy(s) {
    for (const [nk, kk, rk] of KEYS) {
      s[nk] = clamp(Math.round(s[nk]), 2, MAX_STEPS);
      s[kk] = clamp(Math.round(s[kk]), 0, s[nk]);
      s[rk] = clamp(Math.round(s[rk]), 0, s[nk] - 1);
    }
    s.rings = clamp(Math.round(s.rings), 1, 3);
    editing = Math.min(editing, s.rings - 1);
  }

  /** Point every beat at its place: at once, or (gliding) from where it is now. */
  function aim(s, instant) {
    hold = 0;
    shown = KEYS.map((_, j) => {
      const { targets } = ringOf(s, j),
        was = shown[j];
      return targets.map((target, i) => (instant ? target : (was[i] ?? was.at(-1) ?? target)));
    });
  }

  /** The opening: the beats start bunched on the first steps, then spread out. */
  function bunch(s) {
    shown = KEYS.map((_, j) => {
      const { targets, n } = ringOf(s, j);
      return targets.map((_, i) => (targets[0] ?? 0) + i / n);
    });
    hold = HOLD;
  }

  const nameOf = (ring) => (ring.named ? t.rhythms[ring.named.id] : null);

  // ── Sound: a wooden click for the outer ring, a low drum for the middle, a shaker for the inner ──────────────

  const LOOKAHEAD = 0.12; // seconds of beats scheduled ahead, so timing doesn't depend on the page's frames
  let audio = null,
    sounding = false,
    master = null,
    noise = null,
    timer = 0,
    origin = 0, // the audio time at which the hand was at the top, turn 0
    pace = 0, // the seconds per turn the schedule was made with
    next = [null, null, null], // the next step of each ring to schedule, counted from `origin`
    lastAt = [0, 0, 0], // when each ring's last scheduled step falls
    room = null;

  /** Where the hand is, by the audio clock: what the visitor hears now. */
  const heardPhase = () => (audio.currentTime - (audio.outputLatency || 0) - (audio.baseLatency || 0) - origin) / pace;

  function hit(j, at) {
    const gain = audio.createGain();
    gain.connect(master);
    gain.gain.setValueAtTime(0.0001, at);
    let source;
    if (j === 2) {
      // A shaker: a burst of noise, high frequencies only.
      source = audio.createBufferSource();
      source.buffer = noise;
      const filter = audio.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 5500;
      source.connect(filter);
      filter.connect(gain);
      gain.gain.exponentialRampToValueAtTime(0.32, at + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.07);
      source.start(at, Math.random() * 0.5);
      source.stop(at + 0.08);
      source.onended = () => {
        source.disconnect();
        filter.disconnect();
        gain.disconnect();
      };
      return;
    }
    source = audio.createOscillator();
    if (j === 0) {
      // A wooden click: a short, high tone that drops a little.
      source.frequency.setValueAtTime(1650, at);
      source.frequency.exponentialRampToValueAtTime(1350, at + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.5, at + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.07);
    } else {
      // A low drum: a tone that falls quickly in pitch.
      source.frequency.setValueAtTime(150, at);
      source.frequency.exponentialRampToValueAtTime(48, at + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.8, at + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.32);
    }
    source.connect(gain);
    source.start(at);
    source.stop(at + 0.36);
    source.onended = () => {
      source.disconnect();
      gain.disconnect();
    };
  }

  /** Schedule every beat due in the next moment (called every 25 ms while the sound is on). */
  function schedule() {
    if (!sounding) return;
    const s = W.stage.settingsFor('rhythm'),
      now = audio.currentTime;
    if (s.speed !== pace) {
      // A new speed keeps the hand where it is.
      const turns = (now - origin) / pace;
      pace = s.speed;
      origin = now - turns * pace;
      next = [null, null, null];
    }
    for (let j = 0; j < s.rings; j++) {
      const { n, p } = ringOf(s, j),
        step = pace / n;
      next[j] ??= Math.floor((Math.max(now, lastAt[j]) - origin) / step + 1e-6) + 1;
      for (;;) {
        const at = origin + next[j] * step;
        if (at > now + LOOKAHEAD) break;
        // A beat the timer reached a little late still plays, at once; one long past is skipped.
        if (at >= now - 0.03 && p[mod(next[j], n)]) hit(j, Math.max(at, now));
        lastAt[j] = at;
        next[j]++;
      }
    }
  }

  /** After any change, each ring picks up its new pattern from its next step. */
  const replan = () => (next = [null, null, null]);

  function stopSound() {
    sounding = false;
    clearInterval(timer);
    if (master) {
      const out = master;
      out.gain.setTargetAtTime(0, audio.currentTime, 0.02);
      setTimeout(() => out.disconnect(), 400);
      master = null;
    }
    if (W.stage.isShowing(room)) $('scene-action').textContent = t.soundOff;
  }

  async function toggleSound() {
    if (sounding) return stopSound();
    try {
      W.narration.stop();
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) throw Error('No Web Audio');
      audio ??= new AudioContext();
      await audio.resume();
      if (!W.stage.isShowing(room)) return;
      if (!noise) {
        noise = audio.createBuffer(1, audio.sampleRate, audio.sampleRate);
        const data = noise.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      }
      const s = W.stage.settingsFor('rhythm');
      master = audio.createGain();
      master.gain.value = 0.7;
      const limiter = audio.createDynamicsCompressor();
      master.connect(limiter);
      limiter.connect(audio.destination);
      // The sound joins in where the hand is.
      pace = s.speed;
      origin = audio.currentTime + 0.05 - mod(phase, 1) * pace;
      lastAt = [audio.currentTime, audio.currentTime, audio.currentTime];
      replan();
      sounding = true;
      timer = setInterval(schedule, 25);
      schedule();
      // Sound plays at once, but with reduced motion the picture stays still until Play.
      if (!reduced) W.stage.setPlaying(true);
      $('scene-action').textContent = t.soundOn;
      W.stage.sync();
    } catch {
      stopSound();
      W.toast(t.noSound);
    }
  }

  // ── Layout and drawing ───────────────────────────────────────────────────────────────────────────────────────

  /** The circle on the left and the column of boxes on the right; on a tall canvas, the circle above. */
  function measure(width, height) {
    const pad = Math.max(10, Math.round(Math.min(width, height) * 0.03));
    if (width >= height * 1.05) {
      const size = Math.min(height - 2 * pad, width * 0.56);
      const x = pad * 2 + size;
      return {
        // At the top, so the whole circle shows above the fold of a laptop's screen.
        // (A phone's short picture is all in view: there the circle sits in the middle.)
        circle: { x: pad + size / 2, y: width < 520 ? height / 2 : pad + size / 2, size },
        column: { x, y: pad, w: width - x - pad, h: height - 2 * pad },
      };
    }
    const size = Math.min(width - 2 * pad, height * 0.56);
    const y = pad * 2 + size;
    return {
      circle: { x: width / 2, y: pad + size / 2, size },
      column: { x: pad, y, w: width - 2 * pad, h: height - y - pad },
    };
  }

  /** Text that fits: a smaller size first, then squeezed a little at most. */
  function label(ctx, text, x, y, maxWidth, size, weight = 400) {
    let px = size;
    ctx.font = `${weight} ${px}px system-ui, sans-serif`;
    while (px > 9 && ctx.measureText(text).width > maxWidth) {
      px -= 0.5;
      ctx.font = `${weight} ${px}px system-ui, sans-serif`;
    }
    ctx.fillText(text, x, y, maxWidth);
  }

  /** Words that may need two lines or more: smaller first (down to 10 px), then broken at spaces. Returns the last
   *  line's baseline. */
  function wrap(ctx, text, x, y, maxWidth, size, weight = 400) {
    let px = size;
    const setFont = () => (ctx.font = `${weight} ${px}px system-ui, sans-serif`);
    setFont();
    while (px > 10 && ctx.measureText(text).width > maxWidth) {
      px -= 0.5;
      setFont();
    }
    const lines = [];
    let current = '';
    for (const word of text.split(' ')) {
      const longer = current ? `${current} ${word}` : word;
      if (current && ctx.measureText(longer).width > maxWidth) {
        lines.push(current);
        current = word;
      } else current = longer;
    }
    lines.push(current);
    lines.forEach((words, i) => ctx.fillText(words, x, y + i * (px + 3), maxWidth));
    return y + (lines.length - 1) * (px + 3);
  }

  /** How brightly a beat at `turn` glows, just after the hand has passed it. */
  function glow(turn, s, stage) {
    if (!stage.playing && !sounding) return 0;
    const since = mod(phase - turn, 1) * s.speed;
    return since < 1 ? Math.exp(-since / GLOW) : 0;
  }

  function drawCircle(ctx, s, stage, box, rings) {
    const { x: cx, y: cy, size } = box;
    const numbers = size >= 260 ? 15 : 0;
    const outer = size / 2 - numbers - 6;
    const hand = mod(phase, 1);
    const at = (turn, r) => [cx + r * Math.sin(turn * TAU), cy - r * Math.cos(turn * TAU)];
    const dot = Math.max(3.5, Math.min(9, outer * 0.045));

    // The sweep behind the hand, faint.
    for (let i = 0; i < 10; i++) {
      ctx.fillStyle = `rgba(244, 241, 230, ${0.035 * (1 - i / 10)})`;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, outer + 6, (hand - (i + 1) * 0.012) * TAU - TAU / 4, (hand - i * 0.012) * TAU - TAU / 4);
      ctx.closePath();
      ctx.fill();
    }

    rings.forEach((ring, j) => {
      const r = outer * SIZES[j],
        beat = dot * (j ? 0.85 : 1),
        now = Math.floor(hand * ring.n);
      ctx.strokeStyle = 'rgba(200, 206, 220, 0.16)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, TAU);
      ctx.stroke();
      // The steps.
      for (let i = 0; i < ring.n; i++) {
        const [x, y] = at(i / ring.n, r);
        ctx.fillStyle = i === now && stage.playing ? 'rgba(244, 241, 230, 0.85)' : 'rgba(200, 206, 220, 0.42)';
        ctx.beginPath();
        ctx.arc(x, y, beat * 0.36, 0, TAU);
        ctx.fill();
      }
      // The polygon through the beats, brighter as the hand passes one.
      const beats = shown[j];
      if (beats.length > 1) {
        const lit = Math.max(...beats.map((b) => glow(b, s, stage)));
        ctx.beginPath();
        beats.forEach((b, i) => {
          const [x, y] = at(b, r);
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        });
        ctx.closePath();
        ctx.globalAlpha = 0.1 + 0.16 * lit;
        ctx.fillStyle = ring.colour;
        ctx.fill();
        ctx.globalAlpha = 0.75;
        ctx.strokeStyle = ring.colour;
        ctx.lineWidth = j ? 1.6 : 2;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      // The beats themselves, with a halo as the hand passes.
      for (const b of beats) {
        const [x, y] = at(b, r),
          g = glow(b, s, stage);
        if (g > 0.02) {
          ctx.globalAlpha = 0.45 * g;
          ctx.fillStyle = ring.colour;
          ctx.beginPath();
          ctx.arc(x, y, beat * (1.4 + 1.4 * (1 - g)), 0, TAU);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        ctx.fillStyle = ring.colour;
        ctx.beginPath();
        ctx.arc(x, y, beat * (1 + 0.35 * g), 0, TAU);
        ctx.fill();
      }
    });

    // The outer ring's step numbers, 0 at the top, going round clockwise as the hand does.
    if (numbers) {
      const n = rings[0].n;
      ctx.fillStyle = 'rgba(200, 206, 220, 0.6)';
      ctx.font = `${n > 16 ? 10 : 11}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < n; i++) {
        const [x, y] = at(i / n, outer + 6 + numbers / 2 + 2);
        ctx.fillText(String(i), x, y);
      }
      ctx.textBaseline = 'alphabetic';
    }

    // The hand.
    const [hx, hy] = at(hand, outer + 8);
    ctx.strokeStyle = 'rgba(244, 241, 230, 0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(hx, hy);
    ctx.stroke();
    ctx.fillStyle = '#f4f1e6';
    ctx.beginPath();
    ctx.arc(cx, cy, 3.5, 0, TAU);
    ctx.fill();
  }

  /**
   * The column: the outer ring's beats as a row of boxes, under the straight line of the same slope drawn in pixels
   * (it steps up on exactly those boxes), then the other rings' rows. Every row spans one turn of the hand.
   */
  function drawColumn(ctx, s, stage, box, rings) {
    const A = rings[0];
    const cell = box.w / (A.n + 1); // one column more on the left: the end of the bar before
    const x0 = box.x + cell,
      bar = A.n * cell;
    const font = clamp(box.w / 21, 10, 13);
    const strip = clamp(cell, 8, 26);
    const hand = mod(phase, 1);

    // The line, read from the column where the ring starts: column i is a beat where ⌊k(i + s)/n⌋ steps up.
    const from = R.lineStart(A.p);
    const base = Math.floor((A.k * (from - 1)) / A.n);
    const height = (i) => Math.floor((A.k * (i + from)) / A.n) - base; // the pixel's row in column i (−1: the bar before)
    const rows = A.k + 1;
    const pixel = Math.min(cell, (box.h * 0.42) / rows, 40);

    let y = box.y;

    ctx.textAlign = 'left';
    ctx.fillStyle = A.colour;
    const name = nameOf(A);
    y =
      wrap(
        ctx,
        name ? t.labels.ringNamed(A.k, A.n, name.name) : t.labels.ring(A.k, A.n),
        x0,
        y + font,
        bar,
        font + 1,
        600,
      ) + 7;

    // The grid, the pixels and the true line.
    const bottom = y + rows * pixel;
    ctx.strokeStyle = 'rgba(200, 206, 220, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= A.n; i++) {
      ctx.moveTo(x0 + i * cell, y);
      ctx.lineTo(x0 + i * cell, bottom);
    }
    for (let r = 0; r <= rows; r++) {
      ctx.moveTo(x0, bottom - r * pixel);
      ctx.lineTo(x0 + bar, bottom - r * pixel);
    }
    ctx.stroke();
    for (let i = -1; i < A.n; i++) {
      const level = height(i),
        beat = i >= 0 && A.p[i];
      ctx.globalAlpha = i < 0 ? 0.25 : beat ? 0.95 : 0.4;
      ctx.fillStyle = A.colour;
      ctx.fillRect(x0 + i * cell + 1, bottom - (level + 1) * pixel + 1, cell - 2, pixel - 2);
      if (beat) {
        // A dashed drop from the step up to its box below.
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = A.colour;
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.moveTo(x0 + (i + 0.5) * cell, bottom - level * pixel);
        ctx.lineTo(x0 + (i + 0.5) * cell, bottom + 4);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    ctx.globalAlpha = 1;
    // The straight line itself: it passes through each column's pixel at the column's left edge.
    ctx.save();
    ctx.beginPath();
    ctx.rect(x0 - cell, y, bar + cell, rows * pixel);
    ctx.clip();
    ctx.strokeStyle = '#f4f1e6';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const lineAt = (x) => bottom - ((A.k * (x + from)) / A.n - base) * pixel;
    ctx.moveTo(x0 - cell, lineAt(-1));
    ctx.lineTo(x0 + bar, lineAt(A.n));
    ctx.stroke();
    ctx.restore();
    y = bottom + 4;

    // The rows of boxes, one per ring, all as long as one turn.
    const boxes = (ring, top) => {
      const w = bar / ring.n,
        h = strip;
      for (let i = 0; i < ring.n; i++) {
        const x = x0 + i * w;
        if (ring.p[i]) {
          ctx.fillStyle = ring.colour;
          ctx.globalAlpha = 0.9;
          ctx.fillRect(x + 1, top + 1, w - 2, h - 2);
        } else {
          ctx.strokeStyle = 'rgba(200, 206, 220, 0.3)';
          ctx.globalAlpha = 1;
          ctx.strokeRect(x + 1.5, top + 1.5, w - 3, h - 3);
        }
      }
      ctx.globalAlpha = 1;
    };
    const strips = [[A, y]];
    boxes(A, y);
    y += strip + 2;
    ctx.fillStyle = MUTED;
    y = wrap(ctx, t.labels.line(A.k, A.n), x0, y + font, bar, font);
    y = wrap(ctx, t.labels.steps, x0, y + font + 3, bar, font) + 4;
    rings.slice(1).forEach((ring) => {
      y += 10;
      ctx.fillStyle = ring.colour;
      const name = nameOf(ring);
      const words = name ? t.labels.ringNamed(ring.k, ring.n, name.name) : t.labels.ring(ring.k, ring.n);
      y = wrap(ctx, words, x0, y + font, bar, font, 600) + 5;
      boxes(ring, y);
      strips.push([ring, y]);
      y += strip;
    });

    drawGallery(ctx, box, y + 14, A);

    // Where the hand is, across every row: the step it is on, and a line.
    if (stage.playing || sounding) {
      for (const [ring, top] of strips) {
        const w = bar / ring.n,
          i = Math.floor(hand * ring.n);
        ctx.strokeStyle = 'rgba(244, 241, 230, 0.9)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x0 + i * w + 0.5, top + 0.5, w - 1, strip - 1);
      }
      const x = x0 + hand * bar;
      ctx.strokeStyle = 'rgba(244, 241, 230, 0.55)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, strips[0][1] - rows * pixel - 4);
      ctx.lineTo(x, strips.at(-1)[1] + strip);
      ctx.stroke();
    }
  }

  /** Named rhythms, small, under the rows, as many as fit; the one on the outer ring now is lit. */
  function drawGallery(ctx, box, top, A) {
    hits = [];
    const font = clamp(box.w / 24, 9.5, 12);
    const cols = clamp(Math.floor(box.w / 115), 1, 4),
      w = box.w / cols,
      space = box.y + box.h - top - font - 8;
    // As many rows as fit, about 90 px each (64 at the least), sharing out the height left so the picture stays full.
    const rows = Math.min(Math.ceil(GALLERY.length / cols), Math.floor(space / 90) || Math.floor(space / 64));
    if (rows < 1) return;
    ctx.textAlign = 'left';
    ctx.fillStyle = MUTED;
    const y0 = wrap(ctx, t.labels.gallery, box.x, top + font, box.w, font) + 8;
    const h = Math.min((box.y + box.h - y0) / rows, w * 1.25, 200);
    if (h < 56) return;
    // The rhythm on the outer ring now always shows, in the last place if it wouldn't otherwise.
    const ids = GALLERY.slice(0, rows * cols),
      current = A.named?.id;
    if (current && GALLERY.includes(current) && !ids.includes(current)) ids[ids.length - 1] = current;
    ids.forEach((id, i) => {
      const r = R.RHYTHMS.find((x) => x.id === id),
        x = box.x + (i % cols) * w,
        y = y0 + Math.floor(i / cols) * h,
        lit = r.k === A.k && r.n === A.n;
      const d = Math.max(16, Math.min(w * 0.62, h - 2.4 * font - 10)),
        cx = x + w / 2,
        cy = y + 4 + d / 2;
      const at = (turn) => [cx + (d / 2) * Math.sin(turn * TAU), cy - (d / 2) * Math.cos(turn * TAU)];
      if (lit) {
        ctx.fillStyle = 'rgba(242, 196, 109, 0.12)';
        ctx.beginPath();
        ctx.roundRect(x + 3, y, w - 6, h - 6, 8);
        ctx.fill();
      }
      ctx.strokeStyle = 'rgba(200, 206, 220, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, d / 2, 0, TAU);
      ctx.stroke();
      const p = R.pattern(r.k, r.n, r.start),
        beats = R.beats(p);
      const colour = lit ? COLOURS[0] : 'rgba(214, 219, 230, 0.8)';
      ctx.beginPath();
      beats.forEach((b, j) => {
        const [bx, by] = at(b / r.n);
        j ? ctx.lineTo(bx, by) : ctx.moveTo(bx, by);
      });
      ctx.closePath();
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = colour;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = colour;
      ctx.lineWidth = 1.3;
      ctx.stroke();
      ctx.fillStyle = colour;
      for (const b of beats) {
        const [bx, by] = at(b / r.n);
        ctx.beginPath();
        ctx.arc(bx, by, 2.3, 0, TAU);
        ctx.fill();
      }
      ctx.textAlign = 'center';
      ctx.fillStyle = lit ? COLOURS[0] : 'rgba(226, 230, 238, 0.9)';
      label(ctx, t.rhythms[id].name, cx, cy + d / 2 + 4 + font, w - 6, font, lit ? 600 : 500);
      ctx.fillStyle = MUTED;
      label(ctx, t.labels.ring(r.k, r.n), cx, cy + d / 2 + 6 + 2 * font, w - 6, font - 0.5);
      hits.push({ x, y, w, h, id });
    });
    ctx.textAlign = 'left';
  }

  function draw(ctx, s, stage) {
    const { width, height } = stage;
    ctx.clearRect(0, 0, width, height);
    const rings = ringsOf(s);
    const lay = measure(width, height);
    drawCircle(ctx, s, stage, lay.circle, rings);
    drawColumn(ctx, s, stage, lay.column, rings);
  }

  /** The map's picture: three rings at once, as in the bell preset, with the beats in place. */
  function preview(ctx, width, height) {
    const s = { ...room.defaults, ...room.presets[2].settings };
    const before = { phase, shown };
    phase = 0.08;
    aim(s, true);
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    const rings = ringsOf(s);
    const still = { playing: true, width, height };
    const size = Math.min(height, width) * 0.94;
    drawCircle(ctx, s, still, { x: width / 2, y: height / 2, size }, rings);
    ({ phase, shown } = before);
  }

  // ── Panel ────────────────────────────────────────────────────────────────────────────────────────────────────

  const segment = (key, title, names, value) =>
    `<div class="control wide"><span class="rhythm-label" id="rhythm-${key}">${title}</span>` +
    `<div class="segment" role="group" aria-labelledby="rhythm-${key}">` +
    names
      .map(
        (name, i) =>
          `<button type="button" data-${key}="${i}" aria-pressed="${i === value}">` +
          (key === 'edit' ? `<span class="rhythm-swatch rhythm-ring-${i}" aria-hidden="true"></span>` : '') +
          `${name}</button>`,
      )
      .join('') +
    '</div></div>';

  function controls(s, stage) {
    const j = Math.min(editing, s.rings - 1),
      [nk, kk, rk] = KEYS[j];
    return (
      segment('rings', t.rings, t.ringCounts, s.rings - 1) +
      (s.rings > 1 ? segment('edit', t.change, t.ringNames.slice(0, s.rings), j) : '') +
      stage.slider(nk, t.steps, 2, MAX_STEPS, 1, s[nk]) +
      stage.slider(kk, t.beats, 0, s[nk], 1, s[kk]) +
      stage.slider(rk, t.start, 0, s[nk] - 1, 1, s[rk], '', t.startHint) +
      stage.slider('speed', t.speed, 1, 6, 0.1, s.speed, t.seconds)
    );
  }

  function bindControls(panel, s, stage) {
    panel.querySelectorAll('[data-rings]').forEach((button) =>
      button.addEventListener('click', () => {
        const rings = Number(button.dataset.rings) + 1;
        if (rings === s.rings) return;
        s.rings = rings;
        changed(s, stage, `[data-rings="${rings - 1}"]`);
      }),
    );
    panel.querySelectorAll('[data-edit]').forEach((button) =>
      button.addEventListener('click', () => {
        editing = Number(button.dataset.edit);
        stage.refresh();
        $('scene-controls').querySelector(`[data-edit="${editing}"]`)?.focus();
      }),
    );
    // Say what a slider made, once it is let go.
    panel.querySelectorAll('[data-key]').forEach((input) => input.addEventListener('change', () => settle(s)));
  }

  /** After a choice: tidy the numbers, find the preset it matches, redraw the panel. */
  function changed(s, stage, focus) {
    tidy(s);
    aim(s, reduced || !stage.playing);
    replan();
    stage.setChosen(presetIndex(s));
    settle(s);
    stage.refresh();
    stage.draw();
    if (focus) $('scene-controls').querySelector(focus)?.focus();
  }

  /** Play a named rhythm on the outer ring, from the step it is usually played from. */
  function choose(id, s, stage) {
    const r = R.RHYTHMS.find((x) => x.id === id);
    Object.assign(s, { steps: r.n, beats: r.k, start: r.start });
    editing = 0;
    changed(s, stage);
  }

  const hitAt = (p, stage) => {
    const x = p.x * stage.width,
      y = p.y * stage.height;
    return hits.find((h) => x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) ?? null;
  };

  const PRESETS = [
    { rings: 1, steps: 8, beats: 3, start: 0, speed: 2.4 },
    { rings: 2, steps: 16, beats: 5, start: 6, stepsb: 16, beatsb: 4, startb: 0, speed: 2.4 },
    {
      rings: 3,
      steps: 12,
      beats: 7,
      start: 0,
      stepsb: 12,
      beatsb: 4,
      startb: 0,
      stepsc: 12,
      beatsc: 3,
      startc: 0,
      speed: 2.6,
    },
  ];
  /** The preset the settings match (only the rings that show count), or −1. */
  const presetIndex = (s) =>
    PRESETS.findIndex(
      (p) =>
        p.rings === s.rings &&
        p.speed === s.speed &&
        KEYS.slice(0, s.rings)
          .flat()
          .every((key) => p[key] === s[key]),
    );

  function settle(s) {
    const A = ringOf(s, 0),
      name = nameOf(A);
    const words = t.announce(A.k, A.n, name ? t.scene(name.name, name.from) : '');
    if (words !== announced) W.announce(words);
    announced = words;
  }

  function readouts(s) {
    const A = ringOf(s, 0),
      name = nameOf(A);
    $('scene-name').textContent = name ? t.scene(name.name, name.from) : t.unnamed;
    $('scene-status').textContent = t.status(A.k, A.n);
    $('scene-action').textContent = sounding ? t.soundOn : t.soundOff;
  }

  /** The explanation's worked example uses the outer ring's own numbers. */
  function explain(s) {
    const box = $('rhythm-rounds');
    if (!box) return;
    const { k, n } = ringOf(s, 0);
    box.replaceChildren();
    const add = (text, className) => {
      const p = document.createElement('div');
      if (className) p.className = className;
      p.textContent = text;
      box.append(p);
    };
    if (k === 0 || k === n) return add(t.noRounds);
    add(t.roundsIntro(k, n));
    for (const round of R.rounds(k, n))
      add(round.map((group) => '[' + group.map((on) => (on ? 'x' : '·')).join('') + ']').join(' '), 'rhythm-groups');
    add(t.divisionsIntro(n, k));
    for (const [a, q, b, r] of R.divisions(n, k)) add(t.division(a, q, b, r), 'rhythm-groups');
  }

  room = W.defineRoom({
    id: 'rhythm',
    symbol: '◔',
    theme: 'signals',
    added: '2026-10-07',
    eyebrow: t.eyebrow,
    name: t.name,
    tagline: t.tagline,
    accent: { background: '#2a2416', border: '#d9b45f', color: '#f6dc9c' },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.sceneLabel,
    sceneName: t.unnamed,
    tip: t.tip,
    actionLabel: t.actionLabel,
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { ...t.connection, go: 'waves' },

    // Three rings of steps, beats and starting step (the outer ring's keys have no letter); `speed` is the seconds
    // the hand takes to go round once.
    defaults: {
      rings: 1,
      steps: 8,
      beats: 3,
      start: 0,
      stepsb: 8,
      beatsb: 4,
      startb: 0,
      stepsc: 8,
      beatsc: 8,
      startc: 0,
      speed: 2.4,
    },
    ranges: {
      rings: [1, 3, 'integer'],
      steps: [2, MAX_STEPS, 'integer'],
      beats: [0, MAX_STEPS, 'integer'],
      start: [0, MAX_STEPS - 1, 'integer'],
      stepsb: [2, MAX_STEPS, 'integer'],
      beatsb: [0, MAX_STEPS, 'integer'],
      startb: [0, MAX_STEPS - 1, 'integer'],
      stepsc: [2, MAX_STEPS, 'integer'],
      beatsc: [0, MAX_STEPS, 'integer'],
      startc: [0, MAX_STEPS - 1, 'integer'],
      speed: [1, 6],
    },
    defaultPreset: 0,
    presets: t.presets.map((p, i) => ({ ...p, badge: ['3·8', '5·16', '7·12'][i], settings: PRESETS[i] })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Euclid',
        color: '#f2c46d',
        // An ancient Greek geometer: curly hair and a full beard.
        sketch: {
          hairStyle: 'curly',
          hair: '#5a4632',
          skin: '#e3b98f',
          beard: 'full',
          moustache: true,
          brows: 'bold',
          backdrop: '#2a2416',
        },
      },
      {
        ...t.guests[1],
        color: '#6fd6c8',
        sketch: {
          hairStyle: 'receding',
          hair: '#d8d4cc',
          skin: '#efcfb2',
          beard: 'short',
          moustache: true,
          glasses: 'square',
          backdrop: '#17282a',
        },
      },
    ],

    insight: { ...t.insight, onOpen: explain },

    controls,
    bindControls,
    readouts,

    enter(s, stage) {
      const before = JSON.stringify(s);
      tidy(s);
      if (JSON.stringify(s) !== before) stage.refresh();
      editing = 0;
      phase = 0;
      if (reduced || !stage.playing) aim(s, true);
      else bunch(s);
      announced = '';
    },

    step(dt, s) {
      if (sounding) phase = heardPhase();
      else phase += dt / s.speed;
      if (hold > 0) {
        hold -= dt;
        return;
      }
      const ease = 1 - Math.exp(-dt * GLIDE);
      shown = shown.map((beats, j) => {
        const { targets } = ringOf(s, j);
        return beats.map((b, i) => b + (targets[i] - b) * ease);
      });
    },

    draw,
    preview,

    action: toggleSound,
    reset(s, stage) {
      phase = 0;
      if (sounding) {
        origin = audio.currentTime + 0.05;
        lastAt = [audio.currentTime, audio.currentTime, audio.currentTime];
        replan();
      }
      if (reduced || !stage.playing) aim(s, true);
      else bunch(s);
      stage.draw();
    },
    onPreset(s, stage) {
      editing = 0;
      tidy(s);
      aim(s, reduced || !stage.playing);
      replan();
      settle(s);
    },
    onInput(s, stage) {
      // A new number of steps resizes the other two sliders' ranges, in place, so the drag goes on.
      tidy(s);
      const [nk, kk, rk] = KEYS[editing];
      for (const [key, max] of [
        [kk, s[nk]],
        [rk, s[nk] - 1],
      ]) {
        const input = $('c-' + key);
        if (!input) continue;
        input.max = max;
        input.value = s[key];
      }
      aim(s, reduced || !stage.playing);
      replan();
      stage.setChosen(presetIndex(s));
    },
    pointer: {
      // Taps only: a finger anywhere scrolls the page as usual.
      down(p, s, stage, e) {
        if (e && e.button > 0) return;
        const hit = hitAt(p, stage);
        if (hit) choose(hit.id, s, stage);
      },
      move(p, moved, s, stage) {
        $('scene-canvas').classList.toggle('rhythm-hover', !!hitAt(p, stage));
      },
      leave() {
        $('scene-canvas').classList.remove('rhythm-hover');
      },
      // ← → step through the named rhythms.
      arrow(dx, dy, s, stage) {
        if (!dx) return;
        const A = ringOf(s, 0);
        const now = GALLERY.findIndex((id) => {
          const r = R.RHYTHMS.find((x) => x.id === id);
          return r.k === A.k && r.n === A.n;
        });
        choose(GALLERY[now < 0 ? (dx > 0 ? 0 : GALLERY.length - 1) : mod(now + dx, GALLERY.length)], s, stage);
      },
    },

    silence: stopSound,
    soundOn: () => sounding,
  });
})();
