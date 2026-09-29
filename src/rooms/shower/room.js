/* Room · The shower that never settles: a tap, a long pipe, and a bather who reacts to water that left a moment ago. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, clamp } = W;
  const M = W.models.shower;
  const t = W.text('shower');
  const reduced = W.prefersReducedMotion();

  // Modes: the eager and the patient bather side by side (the opening view), one bather, the visitor's own hand.
  const RACE = 0,
    ONE = 1,
    HANDS = 2;
  const EAGER = 0.9, // impatience of the two bathers in the race, per second
    PATIENT = 0.3;
  const WINDOW = 30; // seconds of history on the chart
  const EVERY = 2; // steps between points on the chart
  const MAX_K = 1.5; // the top of the impatience slider and of the map
  const ANNOUNCE_AT = 15; // seconds, when a screen reader hears how the run is going
  const COLOURS = {
    eager: '#f7c948',
    patient: '#c792ff',
    one: '#7ee0a1',
    ink: '#f4f5e9',
    muted: '#98aab7',
    grid: '#1c2733',
    wall: '#111a24',
    tile: '#182431',
    tray: '#0c131b',
    pipe: '#2b3743',
    metal: '#8c9aa8',
    skin: [236, 196, 160],
  };
  // Water from cold to hot: blue, pale at just right, red. Each stop is [°C, r, g, b].
  const HEAT = [
    [10, 47, 111, 224],
    [22, 98, 182, 255],
    [32, 185, 227, 245],
    [38, 255, 236, 186],
    [44, 255, 171, 94],
    [55, 255, 61, 46],
  ];

  const number = (x, digits = 1) =>
    x.toLocaleString(W.lang, { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const plain = (x, digits = 2) => x.toLocaleString(W.lang, { maximumFractionDigits: digits });
  const degrees = (x) => t.degrees(number(x, 0));
  const percent = (x) => `${(x * 100).toLocaleString(W.lang, { maximumFractionDigits: x < 0.1 ? 1 : 0 })}%`;

  /** The colour of water at this temperature, as [r, g, b]. */
  function heatRGB(temp) {
    const c = clamp(temp, HEAT[0][0], HEAT[HEAT.length - 1][0]);
    let i = 1;
    while (i < HEAT.length - 1 && HEAT[i][0] < c) i++;
    const [t0, ...a] = HEAT[i - 1],
      [t1, ...b] = HEAT[i];
    const f = (c - t0) / (t1 - t0);
    return a.map((v, j) => Math.round(v + (b[j] - v) * f));
  }
  const heat = (temp, alpha = 1) => `rgba(${heatRGB(temp).join(', ')}, ${alpha})`;

  // ── The run: one shower per bather ─────────────────────────────────────────

  let run = null;

  function bather(k, colour, name) {
    return { k, colour, name, s: M.shower(), times: [], water: [], taps: [], hot: false, cold: false };
  }

  function makeRun(s) {
    const bathers =
      s.mode === RACE
        ? [bather(EAGER, COLOURS.eager, t.bathers[0]), bather(PATIENT, COLOURS.patient, t.bathers[1])]
        : [bather(null, COLOURS.one, t.bathers[s.mode === ONE ? 2 : 3])];
    const r = { mode: s.mode, bathers, due: 0, announced: false };
    record(r, s);
    return r;
  }

  function start(s) {
    run = makeRun(s);
    // With reduced motion the picture stays still, so show the first half-minute at once.
    if (reduced) advance(run, s, WINDOW * M.RATE);
  }

  const current = (s) => {
    if (!run || run.mode !== s.mode) start(s);
    return run;
  };

  const handTemp = (s) => M.COLD + ((M.HOT - M.COLD) * s.hand) / 100;
  const impatienceOf = (b, s) => b.k ?? s.impatience;
  const now = (r) => r.bathers[0].s.t;

  /** Keep a point for the chart: the water each bather feels, and their tap. */
  function record(r, s) {
    for (const b of r.bathers) {
      b.times.push(b.s.t);
      b.water.push(M.felt(b.s, s.pipe));
      b.taps.push(b.s.tap);
      while (b.times[0] < b.s.t - WINDOW - 1) {
        b.times.shift();
        b.water.shift();
        b.taps.shift();
      }
    }
  }

  function advance(r, s, steps) {
    for (let i = 0; i < steps; i++) {
      for (const b of r.bathers) M.step(b.s, impatienceOf(b, s), s.pipe, r.mode === HANDS ? handTemp(s) : undefined);
      if (r.bathers[0].s.n % EVERY === 0) record(r, s);
    }
  }

  // ── Sound: a hiss while the water runs, and a yelp at either extreme ──────

  let audio = null,
    sounding = false,
    hiss = null,
    room = null;

  function stopSound() {
    sounding = false;
    if (hiss) {
      try {
        hiss.gain.gain.setTargetAtTime(0, audio.currentTime, 0.03);
        hiss.source.stop(audio.currentTime + 0.2);
      } catch {
        /* already stopped */
      }
      hiss = null;
    }
    if (W.stage.isShowing(room)) $('scene-action').textContent = t.soundOff;
  }

  function startHiss() {
    const noise = audio.createBuffer(1, audio.sampleRate * 2, audio.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const source = audio.createBufferSource(),
      filter = audio.createBiquadFilter(),
      gain = audio.createGain();
    source.buffer = noise;
    source.loop = true;
    filter.type = 'bandpass';
    filter.frequency.value = 3000;
    filter.Q.value = 0.7;
    gain.gain.setValueAtTime(0, audio.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, audio.currentTime + 0.4);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(audio.destination);
    source.start();
    hiss = { source, filter, gain };
  }

  /** A comic yelp: a quick rising "ow!" when the water scalds, a chattering "brrr" when it freezes. */
  function yelp(hot, pitch) {
    if (!sounding || !audio) return;
    const at = audio.currentTime,
      osc = audio.createOscillator(),
      gain = audio.createGain();
    gain.gain.setValueAtTime(0, at);
    if (hot) {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600 * pitch, at);
      osc.frequency.exponentialRampToValueAtTime(1300 * pitch, at + 0.12);
      osc.frequency.exponentialRampToValueAtTime(800 * pitch, at + 0.26);
      gain.gain.linearRampToValueAtTime(0.12, at + 0.02);
      gain.gain.linearRampToValueAtTime(0, at + 0.28);
      osc.connect(gain);
    } else {
      // A low buzz whose loudness shakes 28 times a second.
      const lfo = audio.createOscillator(),
        depth = audio.createGain(),
        shake = audio.createGain(),
        soft = audio.createBiquadFilter();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150 * pitch, at);
      lfo.frequency.setValueAtTime(28, at);
      depth.gain.setValueAtTime(0.5, at);
      shake.gain.setValueAtTime(0.5, at);
      soft.type = 'lowpass';
      soft.frequency.setValueAtTime(900, at);
      lfo.connect(depth);
      depth.connect(shake.gain);
      osc.connect(soft);
      soft.connect(shake);
      shake.connect(gain);
      gain.gain.linearRampToValueAtTime(0.07, at + 0.03);
      gain.gain.linearRampToValueAtTime(0, at + 0.45);
      lfo.start(at);
      lfo.stop(at + 0.5);
    }
    gain.connect(audio.destination);
    osc.onended = () => gain.disconnect();
    osc.start(at);
    osc.stop(at + 0.5);
  }

  /** Yelps as a bather's water crosses into scalding or freezing, and the hiss brightening as the water warms. */
  function sounds(r, s) {
    r.bathers.forEach((b, i) => {
      const w = M.felt(b.s, s.pipe);
      if (!b.hot && w > 47) {
        b.hot = true;
        yelp(true, i ? 0.8 : 1);
      } else if (b.hot && w < 44) b.hot = false;
      if (!b.cold && w < 20) {
        b.cold = true;
        yelp(false, i ? 0.8 : 1);
      } else if (b.cold && w > 24) b.cold = false;
    });
    if (hiss)
      hiss.filter.frequency.setTargetAtTime(1800 + 60 * (M.felt(r.bathers[0].s, s.pipe) - 10), audio.currentTime, 0.1);
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
      sounding = true;
      // Sound plays at once, but with reduced motion the picture stays still until Play.
      if (!reduced) W.stage.setPlaying(true);
      startHiss();
      $('scene-action').textContent = t.soundOn;
      W.stage.sync();
    } catch {
      stopSound();
      W.toast(t.noSound);
    }
  }

  // ── Layout ─────────────────────────────────────────────────────────────────

  /**
   * Showers in a row at the top, with the map (or, with the visitor's hand, a big tap) beside them, and the chart
   * underneath. Beside a long panel the canvas can be taller than the screen, so everything keeps a landscape
   * shape at the top rather than stretching below the fold.
   */
  function place(width, height, mode, fill = false) {
    const narrow = width < 560;
    const H = fill ? height : Math.min(height, width * (narrow ? 0.84 : 0.6));
    const pad = Math.max(8, Math.min(width, H) * 0.03);
    const small = Math.round(clamp(Math.min(width, H) / 30, 10, 13));
    const inner = width - pad * 2;
    const sceneH = (H - pad * 3) * (narrow ? 0.56 : 0.6);
    const count = mode === RACE ? 2 : 1;
    const side = mode !== RACE || !narrow;
    let cubW = sceneH * (side ? 0.9 : 1.05);
    if (mode === RACE) cubW = Math.min(cubW, (inner - pad - (side ? Math.max(170, inner * 0.28) + pad : 0)) / 2);
    else cubW = Math.min(cubW, inner * 0.46);
    const row = count * cubW + (count - 1) * pad;
    const sideW = side ? inner - row - pad : 0;
    const left = pad + (side ? 0 : (inner - row) / 2);
    const showers = [];
    for (let i = 0; i < count; i++) showers.push({ x: left + i * (cubW + pad), y: pad, w: cubW, h: sceneH });
    const chartY = pad * 2 + sceneH;
    return {
      small,
      showers,
      side: side ? { x: width - pad - sideW, y: pad, w: sideW, h: sceneH } : null,
      chart: { x: pad, y: chartY, w: inner, h: H - chartY - pad },
    };
  }

  // ── The shower: tiles, a tap, a long pipe, the shower head and the bather ──

  /** The pipe from the tap up to the shower head: a riser, then a coil with more turns the longer the pipe. */
  function pipePath(box, dial, head, pipe) {
    const { x, y, w, h } = box;
    const rows = Math.max(1, Math.round(pipe / 0.625));
    const gap = Math.min(h * 0.045, (dial.y - dial.r - y - h * 0.14) / rows);
    const left = dial.x,
      right = x + w * 0.46,
      top = y + h * 0.1;
    const bottom = top + (rows - 1) * gap;
    const points = [
      [left, dial.y - dial.r],
      [left, bottom],
    ];
    for (let i = 0; i < rows; i++) {
      const rowY = bottom - i * gap,
        end = i % 2 ? left : right;
      points.push([end, rowY]);
      if (i < rows - 1) points.push([end, rowY - gap]);
    }
    const last = points[points.length - 1];
    points.push([last[0], y + h * 0.05], [head.x, y + h * 0.05], [head.x, head.y]);
    return points;
  }

  /** The water in the pipe, coloured by temperature: the newest at the tap, the oldest arriving at the head. */
  function drawPipe(ctx, points, b, pipe, clock, width) {
    const lengths = [0];
    for (let i = 1; i < points.length; i++)
      lengths.push(lengths[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
    const total = lengths[lengths.length - 1];
    const trace = () => {
      ctx.beginPath();
      points.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
      ctx.stroke();
    };
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = COLOURS.pipe;
    ctx.lineWidth = width + 3;
    trace();
    // Short pieces, each the colour of the water that left the tap that long ago.
    const piece = 3;
    let seg = 1;
    ctx.lineCap = 'butt';
    ctx.lineWidth = width;
    for (let along = 0; along < total; along += piece) {
      while (seg < points.length - 1 && lengths[seg] < along) seg++;
      const a = points[seg - 1],
        z = points[seg];
      const span = lengths[seg] - lengths[seg - 1] || 1;
      const f0 = (along - lengths[seg - 1]) / span,
        f1 = Math.min(1, (along + piece - lengths[seg - 1]) / span);
      ctx.strokeStyle = heat(M.tapAgo(b.s, (pipe * (along + piece / 2)) / total));
      ctx.beginPath();
      ctx.moveTo(a[0] + (z[0] - a[0]) * f0, a[1] + (z[1] - a[1]) * f0);
      ctx.lineTo(a[0] + (z[0] - a[0]) * f1, a[1] + (z[1] - a[1]) * f1);
      ctx.stroke();
    }
    // Specks drifting with the flow, a pipe's length every `pipe` seconds.
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = Math.max(1, width * 0.45);
    ctx.lineCap = 'round';
    ctx.setLineDash([0.5, 10]);
    ctx.lineDashOffset = -((clock * total) / pipe);
    trace();
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;
  }

  /** The tap on the wall: a ring from cold (left) to hot (right), and a pointer. Returns the pointer's tip. */
  function drawDial(ctx, cx, cy, r, tap) {
    const ring = Math.max(2, r * 0.28);
    ctx.lineWidth = ring;
    ctx.lineCap = 'butt';
    const parts = 12;
    for (let i = 0; i < parts; i++) {
      ctx.strokeStyle = heat(M.COLD + ((M.HOT - M.COLD) * (i + 0.5)) / parts, 0.85);
      ctx.beginPath();
      ctx.arc(cx, cy, r, Math.PI + (Math.PI * i) / parts, Math.PI + (Math.PI * (i + 1)) / parts);
      ctx.stroke();
    }
    ctx.fillStyle = '#1c2733';
    ctx.strokeStyle = COLOURS.metal;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.72, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    const angle = Math.PI + (Math.PI * (tap - M.COLD)) / (M.HOT - M.COLD);
    const tip = [cx + Math.cos(angle) * r * 0.95, cy + Math.sin(angle) * r * 0.95];
    ctx.strokeStyle = COLOURS.ink;
    ctx.lineWidth = Math.max(2, r * 0.18);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(...tip);
    ctx.stroke();
    ctx.fillStyle = heat(tap);
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.22, 0, Math.PI * 2);
    ctx.fill();
    return tip;
  }

  /** Skin, a little blue when cold and pink when hot. */
  function skin(water) {
    const [r, g, b] = COLOURS.skin;
    if (water < 30) {
      const f = clamp((30 - water) / 18, 0, 0.45);
      return `rgb(${Math.round(r + (150 - r) * f)}, ${Math.round(g + (200 - g) * f)}, ${Math.round(b + (255 - b) * f)})`;
    }
    const f = clamp((water - 41) / 14, 0, 0.5);
    return `rgb(${Math.round(r + (255 - r) * f)}, ${Math.round(g + (120 - g) * f)}, ${Math.round(b + (110 - b) * f)})`;
  }

  function drawBather(ctx, box, head, hand, water, colour, clock) {
    const { h } = box;
    const r = h * 0.07;
    const scalding = water > 46,
      freezing = water < 22;
    // Hopping when it scalds, shivering when it freezes.
    const hop = scalding ? -Math.abs(Math.sin(clock * 9)) * h * 0.035 : 0;
    const shiver = freezing ? Math.sin(clock * 70) * Math.max(1, r * 0.08) : 0;
    const cx = head.x + shiver,
      cy = box.y + h * 0.42 + hop;
    const floor = box.y + h * 0.9;
    const tone = skin(water);
    ctx.lineCap = 'round';
    // Legs, then the body, then the arm reaching for the tap.
    ctx.strokeStyle = tone;
    ctx.lineWidth = r * 0.5;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(cx + side * r * 0.4, cy + r * 3.1);
      ctx.lineTo(cx + side * r * 0.5, Math.min(floor - 2, cy + r * 3.1 + h * 0.2));
      ctx.stroke();
    }
    ctx.fillStyle = tone;
    ctx.beginPath();
    ctx.roundRect(cx - r * 0.9, cy + r * 1.1, r * 1.8, r * 2.3, r * 0.6);
    ctx.fill();
    ctx.fillStyle = '#2b3a4a';
    ctx.beginPath();
    ctx.roundRect(cx - r * 0.92, cy + r * 2.7, r * 1.84, r * 0.8, [0, 0, r * 0.4, r * 0.4]);
    ctx.fill();
    ctx.strokeStyle = tone;
    ctx.lineWidth = r * 0.42;
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.75, cy + r * 1.5);
    ctx.lineTo(cx + r * 1.2, cy + r * 2.9);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.75, cy + r * 1.5);
    ctx.quadraticCurveTo(cx - r * 1.6, cy + r * 2.6, hand[0], hand[1]);
    ctx.stroke();
    // The head, and a shower cap in the bather's colour.
    ctx.fillStyle = tone;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.15, r * 1.05, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(cx - r * 1.12, cy - r * 0.2, r * 2.24, r * 0.22);
    // The face.
    const ink = '#1d2530';
    ctx.fillStyle = ink;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(cx + side * r * 0.36, cy + r * 0.22, Math.max(1, r * 0.11), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = ink;
    ctx.lineWidth = Math.max(1, r * 0.1);
    ctx.beginPath();
    const my = cy + r * 0.6;
    if (scalding) {
      ctx.ellipse(cx, my, r * 0.2, r * 0.26, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#5a1c1c';
      ctx.fill();
    } else if (freezing) {
      for (let i = 0; i <= 6; i++) ctx.lineTo(cx - r * 0.35 + (r * 0.7 * i) / 6, my + (i % 2 ? -1 : 1) * r * 0.08);
    } else if (Math.abs(water - M.TARGET) <= 2) {
      ctx.arc(cx, my - r * 0.2, r * 0.32, Math.PI * 0.2, Math.PI * 0.8);
    } else {
      ctx.moveTo(cx - r * 0.25, my);
      ctx.lineTo(cx + r * 0.25, my);
    }
    ctx.stroke();
    // Steam rising when hot; icicles and frost when cold.
    if (water > 43) {
      const strength = clamp((water - 43) / 10, 0.2, 1);
      for (let i = 0; i < 4; i++) {
        const rise = (clock * 0.6 + i / 4) % 1;
        ctx.fillStyle = `rgba(235, 240, 245, ${0.35 * strength * (1 - rise)})`;
        ctx.beginPath();
        ctx.arc(
          cx + Math.sin(i * 2.1 + clock * 2) * r * 0.9,
          cy - r * 1.3 - rise * h * 0.16,
          r * (0.35 + rise * 0.5),
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    }
    if (freezing) {
      ctx.fillStyle = 'rgba(200, 235, 255, 0.9)';
      for (const [dx, len] of [
        [-0.5, 0.5],
        [0, 0.7],
        [0.45, 0.45],
      ]) {
        ctx.beginPath();
        ctx.moveTo(head.x + dx * r * 2 - r * 0.14, head.y + 3);
        ctx.lineTo(head.x + dx * r * 2 + r * 0.14, head.y + 3);
        ctx.lineTo(head.x + dx * r * 2, head.y + 3 + len * r);
        ctx.fill();
      }
    }
  }

  function drawShower(ctx, box, b, s, clock, small) {
    const { x, y, w, h } = box;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 8);
    ctx.clip();
    ctx.fillStyle = COLOURS.wall;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = COLOURS.tile;
    ctx.lineWidth = 1;
    const tile = Math.max(12, w / 7);
    ctx.beginPath();
    for (let tx = x + tile; tx < x + w; tx += tile) {
      ctx.moveTo(tx, y);
      ctx.lineTo(tx, y + h * 0.9);
    }
    for (let ty = y + tile; ty < y + h * 0.9; ty += tile) {
      ctx.moveTo(x, ty);
      ctx.lineTo(x + w, ty);
    }
    ctx.stroke();
    ctx.fillStyle = COLOURS.tray;
    ctx.fillRect(x, y + h * 0.9, w, h * 0.1);

    const water = M.felt(b.s, s.pipe);
    const dial = { x: x + w * 0.16, y: y + h * 0.6, r: Math.max(7, Math.min(w, h) * 0.075) };
    const head = { x: x + w * 0.64, y: y + h * 0.17 };
    drawPipe(ctx, pipePath(box, dial, head, s.pipe), b, s.pipe, clock, Math.max(3, h * 0.022));

    // The shower head, and water falling from it.
    const rose = w * 0.1;
    ctx.fillStyle = COLOURS.metal;
    ctx.beginPath();
    ctx.moveTo(head.x - rose * 0.3, head.y - 3);
    ctx.lineTo(head.x + rose * 0.3, head.y - 3);
    ctx.lineTo(head.x + rose, head.y + 3);
    ctx.lineTo(head.x - rose, head.y + 3);
    ctx.fill();
    ctx.strokeStyle = heat(water, 0.75);
    ctx.lineWidth = Math.max(1.2, h * 0.008);
    ctx.setLineDash([h * 0.025, h * 0.04]);
    ctx.lineDashOffset = -clock * h * 0.6;
    for (let i = 0; i < 7; i++) {
      const dx = (i / 6 - 0.5) * rose * 1.8;
      ctx.beginPath();
      ctx.moveTo(head.x + dx * 0.5, head.y + 5);
      ctx.lineTo(head.x + dx * 1.6, y + h * 0.89);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;

    const tip = drawDial(ctx, dial.x, dial.y, dial.r, b.s.tap);
    drawBather(ctx, box, head, tip, water, b.colour, clock);

    // The bather's name and the water they feel, on the tray.
    ctx.font = `600 ${small}px system-ui`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillStyle = b.colour;
    const label = y + h * 0.95;
    ctx.fillText(b.name, x + 8, label, w * 0.55);
    ctx.textAlign = 'right';
    ctx.fillStyle = heat(water);
    ctx.fillText(degrees(water), x + w - 8, label);
    ctx.restore();
    ctx.strokeStyle = '#26323f';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x + 0.5, y + 0.5, w - 1, h - 1, 8);
    ctx.stroke();
  }

  // ── The chart: the water each bather feels over the last half-minute ──────

  /** A label beside the end of a line: to its right while there is room, otherwise to its left. */
  function tag(ctx, text, x, y, colour, box, used, small) {
    const width = ctx.measureText(text).width;
    const right = x + 6 + width + 3 <= box.x + box.w;
    // The nearest free place above or below the line's end, inside the plot.
    const place = (ty) => clamp(ty, box.y + small, box.y + box.h - 3);
    const free = (ty) => !used.some((u) => Math.abs(u - ty) < small + 2);
    let ty = place(y - 6);
    for (let i = 1; i < 12 && !free(ty); i++) ty = place(y - 6 + (i % 2 ? 1 : -1) * Math.ceil(i / 2) * (small + 3));
    used.push(ty);
    const left = right ? x + 3 : x - width - 9;
    ctx.fillStyle = 'rgba(10, 14, 21, 0.75)';
    ctx.fillRect(left, ty - small + 1, width + 6, small + 3);
    ctx.fillStyle = colour;
    ctx.textAlign = 'left';
    ctx.fillText(text, left + 3, ty);
  }

  function drawChart(ctx, box, r, small) {
    const plot = { x: box.x + small * 2.8, y: box.y + small * 0.4, w: 0, h: 0 };
    plot.w = box.x + box.w - plot.x;
    plot.h = box.y + box.h - small * 1.6 - plot.y;
    if (plot.h < 20) return;
    const end = Math.max(WINDOW, now(r)),
      begin = end - WINDOW;
    const lowT = M.COLD - 2,
      highT = M.HOT + 2;
    const xOf = (time) => plot.x + ((time - begin) / WINDOW) * plot.w;
    const yOf = (temp) => plot.y + ((highT - temp) / (highT - lowT)) * plot.h;
    ctx.font = `${small - 1}px system-ui`;
    ctx.textBaseline = 'alphabetic';
    // Just right: a band from 36 to 40 °C.
    ctx.fillStyle = 'rgba(126, 224, 161, 0.1)';
    ctx.fillRect(plot.x, yOf(M.TARGET + 2), plot.w, yOf(M.TARGET - 2) - yOf(M.TARGET + 2));
    ctx.lineWidth = 1;
    ctx.textAlign = 'right';
    for (let temp = 10; temp <= 50; temp += 10) {
      ctx.strokeStyle = COLOURS.grid;
      ctx.beginPath();
      ctx.moveTo(plot.x, yOf(temp));
      ctx.lineTo(plot.x + plot.w, yOf(temp));
      ctx.stroke();
      ctx.fillStyle = heat(temp, 0.8);
      ctx.fillText(degrees(temp), plot.x - 5, yOf(temp) + small * 0.35);
    }
    ctx.strokeStyle = 'rgba(126, 224, 161, 0.55)';
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(plot.x, yOf(M.TARGET));
    ctx.lineTo(plot.x + plot.w, yOf(M.TARGET));
    ctx.stroke();
    ctx.setLineDash([]);
    // Seconds along the bottom.
    ctx.fillStyle = COLOURS.muted;
    ctx.textAlign = 'center';
    const every = plot.w < 380 ? 10 : 5;
    for (let s = Math.ceil(begin / every) * every; s <= end + 1e-9; s += every)
      ctx.fillText(number(s, 0), xOf(s), plot.y + plot.h + small * 1.3);
    ctx.textAlign = 'right';
    ctx.fillText(t.labels.seconds, plot.x + plot.w, plot.y + plot.h - 4);

    ctx.save();
    ctx.beginPath();
    ctx.rect(plot.x, plot.y - 2, plot.w, plot.h + 4);
    ctx.clip();
    const line = (b, series, width, dash) => {
      ctx.setLineDash(dash);
      ctx.lineWidth = width;
      ctx.beginPath();
      b.times.forEach((time, i) => {
        const px = xOf(time),
          py = yOf(series[i]);
        if (i) ctx.lineTo(px, py);
        else ctx.moveTo(px, py);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    };
    ctx.lineJoin = 'round';
    for (const b of r.bathers) {
      // Alone, a bather's tap too, dashed: the same curve, a pipe-length earlier.
      if (r.mode !== RACE) {
        ctx.strokeStyle = b.colour;
        ctx.globalAlpha = 0.6;
        line(b, b.taps, 1.5, [5, 4]);
        ctx.globalAlpha = 1;
      }
      ctx.strokeStyle = 'rgba(10, 14, 21, 0.8)';
      line(b, b.water, 6, []);
      ctx.strokeStyle = b.colour;
      line(b, b.water, 3, []);
    }
    ctx.restore();
    // Just right's name goes over the lines, on a dark backing, since the water crosses it.
    const justRight = t.labels.justRight,
      jy = yOf(M.TARGET + 2) - 3;
    const jw = ctx.measureText(justRight).width;
    ctx.fillStyle = 'rgba(10, 14, 21, 0.75)';
    ctx.fillRect(plot.x + 1, jy - small + 2, jw + 6, small + 1);
    ctx.fillStyle = 'rgba(126, 224, 161, 0.8)';
    ctx.textAlign = 'left';
    ctx.fillText(justRight, plot.x + 4, jy);
    ctx.font = `600 ${small - 1}px system-ui`;
    const used = [];
    const x = xOf(now(r));
    for (const b of r.bathers) {
      const water = b.water[b.water.length - 1];
      tag(ctx, t.labels.tag(b.name, degrees(water)), x, yOf(water), b.colour, plot, used, small - 1);
      if (r.mode !== RACE) {
        ctx.font = `${small - 1}px system-ui`;
        tag(ctx, t.labels.tap, x, yOf(b.s.tap), b.colour, plot, used, small - 1);
      }
    }
  }

  // ── The map: which impatience settles, for each pipe ──────────────────────

  function drawMap(ctx, box, s, r, small) {
    ctx.save();
    ctx.font = `600 ${small}px system-ui`;
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.fillStyle = COLOURS.muted;
    ctx.fillText(t.labels.mapTitle, box.x + 4, box.y + small, box.w - 8);
    const plot = { x: box.x + small * 3, y: box.y + small * 1.8, w: 0, h: 0 };
    plot.w = box.x + box.w - plot.x - 4;
    plot.h = box.y + box.h - small * 2.6 - plot.y;
    const xOf = (d) => plot.x + (d / M.MAX_DELAY) * plot.w;
    const yOf = (k) => plot.y + plot.h - (Math.min(k, MAX_K) / MAX_K) * plot.h;
    const bottom = plot.y + plot.h;
    // Never settles everywhere; then wobbles below π/2 ÷ d; then no wobble below 1/e ÷ d.
    // Three regions, each between two curves: never settles above π/2 ÷ d, no wobble below 1/e ÷ d.
    const top = () => plot.y,
      none = () => bottom;
    const regions = [
      ['rgba(255, 110, 90, 0.3)', top, (d) => yOf(M.safeLimit(d))],
      ['rgba(126, 224, 161, 0.22)', (d) => yOf(M.safeLimit(d)), (d) => yOf(M.smoothLimit(d))],
      ['rgba(108, 195, 255, 0.26)', (d) => yOf(M.smoothLimit(d)), none],
    ];
    const samples = Array.from({ length: 81 }, (_, i) => Math.max(0.01, (M.MAX_DELAY * i) / 80));
    for (const [colour, upper, lower] of regions) {
      ctx.fillStyle = colour;
      ctx.beginPath();
      samples.forEach((d) => ctx.lineTo(xOf(d), upper(d)));
      [...samples].reverse().forEach((d) => ctx.lineTo(xOf(d), lower(d)));
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(255, 150, 130, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const d = Math.max(0.01, (M.MAX_DELAY * i) / 80);
      if (i) ctx.lineTo(xOf(d), yOf(M.safeLimit(d)));
      else ctx.moveTo(xOf(d), yOf(M.safeLimit(d)));
    }
    ctx.stroke();
    // The regions' names, where each has room.
    ctx.font = `${small - 1}px system-ui`;
    ctx.fillStyle = 'rgba(160, 215, 255, 0.95)';
    ctx.textAlign = 'left';
    // The lowest region's name keeps clear of this pipe's dashed line: before it if it fits, otherwise after it.
    const lowName = t.labels.regions[0];
    const lowWidth = Math.min(ctx.measureText(lowName).width, plot.w * 0.4);
    const before = xOf(s.pipe) - 6 - (plot.x + 4);
    if (before >= lowWidth * 0.8) ctx.fillText(lowName, plot.x + 4, bottom - 4, Math.min(lowWidth, before));
    else ctx.fillText(lowName, xOf(s.pipe) + 6, bottom - 4, Math.min(lowWidth, plot.x + plot.w - xOf(s.pipe) - 10));
    ctx.fillStyle = 'rgba(160, 235, 185, 0.95)';
    ctx.textAlign = 'right';
    // Low in its region, unless a bather's dot sits there: then just below the dot.
    const label = t.labels.regions[1];
    const span = Math.min(ctx.measureText(label).width, plot.w - 8);
    let ly = yOf(M.safeLimit(4.2) * 0.6);
    const dx = xOf(s.pipe);
    for (const b of r.bathers) {
      const dy = yOf(impatienceOf(b, s));
      if (dx > plot.x + plot.w - 8 - span && Math.abs(dy - (ly - small / 2)) < small)
        ly = Math.min(bottom - 3, dy + small * 1.4);
    }
    ctx.fillText(label, plot.x + plot.w - 4, ly, plot.w - 8);
    ctx.fillStyle = 'rgba(255, 170, 150, 0.95)';
    ctx.fillText(t.labels.regions[2], plot.x + plot.w - 4, plot.y + small, plot.w * 0.6);
    // Axes.
    ctx.fillStyle = COLOURS.muted;
    ctx.textAlign = 'right';
    for (const k of [0, 0.5, 1, 1.5]) ctx.fillText(plain(k, 1), plot.x - 4, yOf(k) + small * 0.35);
    ctx.textAlign = 'center';
    for (let d = 0; d <= M.MAX_DELAY; d++) ctx.fillText(number(d, 0), xOf(d), bottom + small * 1.2);
    ctx.textAlign = 'right';
    ctx.fillText(t.labels.mapX, plot.x + plot.w, bottom + small * 2.3);
    ctx.save();
    ctx.translate(box.x + small * 0.7, plot.y + plot.h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(t.labels.mapY, 0, 0);
    ctx.restore();
    // This pipe: a line up to the most impatience that still settles, and a dot for each bather.
    const px = xOf(s.pipe),
      limit = M.safeLimit(s.pipe);
    ctx.strokeStyle = 'rgba(244, 245, 233, 0.5)';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px, bottom);
    ctx.lineTo(px, yOf(limit));
    ctx.stroke();
    ctx.setLineDash([]);
    if (limit < MAX_K) {
      const text = t.labels.safe(plain(limit));
      // Beside the line's top, on whichever side has room; on neither, the line alone says it.
      const width = ctx.measureText(text).width;
      const right = px + 5 + width <= plot.x + plot.w;
      ctx.fillStyle = COLOURS.ink;
      ctx.textAlign = right ? 'left' : 'right';
      if (right || px - 5 - width >= plot.x) ctx.fillText(text, px + (right ? 5 : -5), yOf(limit) - 4);
    }
    for (const b of r.bathers) {
      const k = impatienceOf(b, s);
      ctx.fillStyle = b.colour;
      ctx.strokeStyle = '#0a0e15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, yOf(k), Math.max(4, small * 0.42), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  /** With the visitor's hand: a big tap to drag, and the water on its way. */
  function drawHand(ctx, box, b, s, small) {
    const r = Math.min(box.w * 0.3, box.h * 0.32);
    const cx = box.x + box.w / 2,
      cy = box.y + box.h * 0.58;
    drawDial(ctx, cx, cy, r, b.s.tap);
    ctx.font = `${small}px system-ui`;
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'center';
    ctx.fillStyle = heat(M.COLD);
    ctx.fillText(t.cold, cx - r, cy + small * 1.6);
    ctx.fillStyle = heat(M.HOT);
    ctx.fillText(t.hot, cx + r, cy + small * 1.6);
    ctx.fillStyle = COLOURS.muted;
    ctx.textAlign = 'center';
    ctx.fillText(t.labels.drag, cx, box.y + box.h - 4, box.w - 8);
    // Two numbers: the water on you now, and the water on its way (what the tap sends).
    const water = M.felt(b.s, s.pipe);
    ctx.font = `600 ${small}px system-ui`;
    ctx.fillStyle = COLOURS.muted;
    ctx.fillText(t.labels.onYou, cx, box.y + small * 1.2);
    ctx.font = `600 ${Math.round(small * 2)}px Georgia, serif`;
    ctx.fillStyle = heat(water);
    ctx.fillText(degrees(water), cx, box.y + small * 3.2);
  }

  function scene(ctx, s, width, height, r, fill) {
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    ctx.direction = 'ltr'; // the picture keeps its direction on right-to-left pages too
    const L = place(width, height, r.mode, fill);
    const clock = now(r);
    r.bathers.forEach((b, i) => drawShower(ctx, L.showers[i], b, s, clock, L.small));
    if (L.side && r.mode === HANDS) drawHand(ctx, L.side, r.bathers[0], s, L.small);
    else if (L.side) drawMap(ctx, L.side, s, r, L.small);
    drawChart(ctx, L.chart, r, L.small);
  }

  function draw(ctx, s, stage) {
    scene(ctx, s, stage.width, stage.height, current(s));
  }

  /** The home card and link preview: the race twenty seconds in, the eager bather scalded, the patient one fine. */
  function preview(ctx, width, height) {
    const s = { mode: RACE, pipe: 2, impatience: EAGER, hand: 0 };
    const r = makeRun(s);
    advance(r, s, 20 * M.RATE);
    scene(ctx, s, width, height, r, true);
  }

  // ── Words beside the picture ───────────────────────────────────────────────

  function live() {
    if (!run) return;
    const seconds = Math.floor(now(run));
    $('scene-status').textContent = t.status(number(seconds, 0), seconds);
    // The water each bather feels right now: plain text, set every frame, and not a live region.
    const felt = $('shower-now');
    if (!felt) return;
    const water = run.bathers.map((b) => degrees(M.felt(b.s, W.stage.settingsFor('shower').pipe)));
    felt.textContent = t.now[run.mode](...water);
  }

  function verdictOf(k, d) {
    const kd = k * d,
      regime = M.regime(kd);
    const w = M.wobble(k, d);
    let detail = t.readout.smooth;
    if (w && Math.abs(kd - M.EDGE) < 0.005) detail = t.readout.edge(plain(w.period, 1));
    else if (w && w.ratio < 1) detail = t.readout.fades(percent(w.ratio), plain(w.period, 1));
    else if (w) detail = t.readout.grows(plain(w.ratio, 2), plain(w.period, 1));
    return { regime, verdict: t.readout.verdicts[regime], detail };
  }

  function readouts(s) {
    const r = current(s);
    $('scene-name').textContent = t.sceneNames[s.mode];
    $('scene-action').textContent = sounding ? t.soundOn : t.soundOff;
    const d = plain(s.pipe, 2);
    const limit = t.readout.limit(d, plain(M.safeLimit(s.pipe)));
    const box = $('shower-readout');
    if (box) {
      if (s.mode === RACE)
        box.innerHTML =
          r.bathers
            .map((b) => {
              const v = verdictOf(b.k, s.pipe);
              return `<div class="shower-row"><span style="color:${b.colour}">${b.name}</span><strong>${t.readout.sum(plain(b.k), d, plain(b.k * s.pipe))}</strong></div><p class="shower-verdict is-${v.regime}">${v.verdict}</p>`;
            })
            .join('') + `<p>${limit}</p><p id="shower-now"></p>`;
      else if (s.mode === ONE) {
        const v = verdictOf(s.impatience, s.pipe);
        box.innerHTML =
          `<div class="shower-big"><span>${t.readout.product}</span><strong>${plain(s.impatience * s.pipe)}</strong></div>` +
          `<p class="shower-verdict is-${v.regime}">${v.verdict}</p><p>${v.detail}</p><p>${limit}</p><p id="shower-now"></p>`;
      } else box.innerHTML = `<p>${t.readout.hands(d)}</p><p id="shower-now"></p>`;
    }
    $('c-impatience')
      ?.closest('.control')
      ?.toggleAttribute('hidden', s.mode !== ONE);
    $('shower-hand-control')?.toggleAttribute('hidden', s.mode !== HANDS);
    document
      .querySelectorAll('#scene-controls [data-mode]')
      .forEach((b) => b.setAttribute('aria-pressed', Number(b.dataset.mode) === s.mode));
    live();
  }

  function controls(s, stage) {
    return (
      `<div class="control wide"><label id="shower-mode-label">${t.modeLabel}</label>` +
      `<div class="segment" role="group" aria-labelledby="shower-mode-label">` +
      t.modes
        .map((name, i) => `<button type="button" data-mode="${i}" aria-pressed="${s.mode === i}">${name}</button>`)
        .join('') +
      '</div></div>' +
      stage.slider('pipe', t.pipe, 0.5, M.MAX_DELAY, 0.1, s.pipe, t.seconds, t.pipeHint) +
      stage.slider('impatience', t.impatience, 0.05, MAX_K, 0.05, s.impatience, '', t.impatienceHint) +
      `<div class="control shower-hand" id="shower-hand-control"><label for="shower-hand">${t.hand}</label>` +
      `<input id="shower-hand" type="range" min="0" max="100" step="1" value="${s.hand}" aria-valuetext="${t.handValue(Math.round(s.hand))}">` +
      `<div class="shower-scale" aria-hidden="true"><span>${t.cold}</span><span>${t.hot}</span></div>` +
      `<p>${t.handHint}</p></div>` +
      '<div class="wide readout shower-readout" id="shower-readout"></div>'
    );
  }

  function setHand(s, value) {
    s.hand = clamp(value, 0, 100);
    const input = $('shower-hand');
    if (input) {
      input.value = s.hand;
      input.setAttribute('aria-valuetext', t.handValue(Math.round(s.hand)));
    }
  }

  function bindControls(panel, s, st) {
    panel.querySelectorAll('[data-mode]').forEach((button) =>
      button.addEventListener('click', () => {
        s.mode = Number(button.dataset.mode);
        st.setChosen(-1);
        start(s);
        st.sync();
        st.draw();
        W.announce(t.sceneNames[s.mode]);
      }),
    );
    $('shower-hand').addEventListener('input', (e) => {
      setHand(s, Number(e.target.value));
      st.setChosen(-1);
      st.sync();
    });
  }

  room = W.defineRoom({
    id: 'shower',
    symbol: '≋',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'engineering',
    added: '2026-09-29',
    tagline: t.tagline,
    accent: { background: '#1e1a12', border: '#f7c948', color: '#fbe3a1' },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.sceneLabel,
    sceneName: t.sceneNames[RACE],
    tip: t.tip,
    actionLabel: t.soundOff,
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { ...t.connection, go: 'fireflies' },

    defaults: { mode: RACE, pipe: 2, impatience: EAGER, hand: 0 },
    ranges: {
      mode: [0, HANDS, 'integer'],
      pipe: [0.5, M.MAX_DELAY],
      impatience: [0.05, MAX_K],
      hand: [0, 100],
    },
    defaultPreset: -1,
    presets: [
      { settings: { mode: ONE, pipe: 2, impatience: 0.17 } },
      { settings: { mode: ONE, pipe: 2, impatience: Math.PI / 4 } },
      { settings: { mode: RACE, pipe: 0.5 } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Maxwell',
        color: '#f7c948',
        sketch: { hairStyle: 'swept', hair: '#3a2c22', skin: '#efcfb0', beard: 'full', backdrop: '#2b2616' },
      },
      {
        ...t.guests[1],
        color: '#c792ff',
        sketch: { hairStyle: 'receding', hair: '#77716b', skin: '#e9c6a5', moustache: true, backdrop: '#231a33' },
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
      r.due += dt * M.RATE;
      const steps = Math.floor(r.due);
      r.due -= steps;
      if (!steps) return;
      advance(r, s, steps);
      sounds(r, s);
      live();
      if (!r.announced && now(r) >= ANNOUNCE_AT && r.mode !== HANDS) {
        r.announced = true;
        const water = r.bathers.map((b) => degrees(M.felt(b.s, s.pipe)));
        W.announce(
          r.mode === RACE
            ? t.announce.race(...water)
            : t.announce.one(water[0], verdictOf(s.impatience, s.pipe).verdict),
        );
      }
    },
    action: toggleSound,
    reset(s, st) {
      start(s);
      st.sync();
      st.draw();
    },
    silence: stopSound,
    soundOn: () => sounding,

    pointer: {
      // With the visitor's hand on the tap, a drag across the picture turns it; otherwise a finger scrolls.
      drag: (p, s) => s.mode === HANDS,
      move(p, { dx, dragging }, s, st) {
        if (!dragging || s.mode !== HANDS) return;
        setHand(s, s.hand + (dx / Math.max(200, st.width * 0.6)) * 100);
        st.setChosen(-1);
        st.draw();
      },
      /** ← → turn the visitor's tap, or otherwise lengthen and shorten the pipe. */
      arrow(dx, dy, s, st) {
        const by = dx || -dy;
        if (s.mode === HANDS) setHand(s, s.hand + by * 4);
        else {
          s.pipe = clamp(Math.round((s.pipe + by * 0.1) * 10) / 10, 0.5, M.MAX_DELAY);
          $('c-pipe').value = s.pipe;
        }
        st.setChosen(-1);
        st.sync();
      },
    },
  });
})();
