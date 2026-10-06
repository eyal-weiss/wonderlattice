/* Room · Light a town 100 km away: a power station, a long line and a town, and a dial for the line's voltage. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, clamp } = W;
  const M = W.models.voltage;
  const t = W.text('voltage');
  const reduced = W.prefersReducedMotion();

  // The kind of current: alternating through transformers, direct as in the 1880s, direct through converters today.
  const AC = 0,
    OLD_DC = 1,
    NEW_DC = 2;
  // The opening: the dial turns itself from 3.2 kV, where the town is dark, up to 250 kV and back, once every TURN
  // seconds. With reduced motion the picture stays still at START, where half the power is lost.
  const START = 10; // kV
  const TURN = 24;
  const LOW = Math.log10(3.2),
    HIGH = Math.log10(250);
  const turning = (seconds) => kvOf(LOW + ((HIGH - LOW) * (1 - Math.cos((2 * Math.PI * seconds) / TURN))) / 2);
  const CORONA = 600; // kV, where the air round the wire starts to glow
  const COLOURS = {
    ink: '#f4f5e9',
    muted: '#98aab7',
    grid: '#1c2733',
    sky: ['#060a11', '#101a27'],
    ground: '#0b1118',
    horizon: '#1d2834',
    steel: '#4f5e6e',
    insulator: '#9fb3c8',
    wall: '#1d2733',
    roof: '#2b3948',
    dark: '#151d27',
    window: [255, 211, 107],
    energy: '#ffe9a8',
    curve: '#ff9d4d',
    knob: '#f7c948',
    cool: '#9fe0b5',
    coil: '#7ecbff',
    converter: '#c3a6ff',
    corona: [190, 150, 255],
  };
  // The wire's glow, from cold metal to orange heat. Each stop is [level, r, g, b].
  const GLOW = [
    [0, 107, 119, 133],
    [0.15, 128, 46, 30],
    [0.4, 204, 58, 28],
    [0.65, 255, 108, 28],
    [0.85, 255, 168, 52],
    [1, 255, 214, 112],
  ];

  const kvOf = (log) => clamp(M.nice(10 ** log), M.MIN_KV, M.MAX_KV);
  const volts = (s) => s.kv * 1000;
  const flowing = (s) => s.current !== OLD_DC;

  // ── Numbers in the page's language ──────────────────────────────────────────

  const sig = (x, digits = 2) => x.toLocaleString(W.numberLocale, { maximumSignificantDigits: digits });
  const kvText = (kv) => t.kv(sig(kv));
  const percent = (x) => W.text('app').stage.percent(sig(Math.min(1, x) * 100));
  function watts(x) {
    const unit = clamp(Math.floor(Math.log10(Math.max(x, 1)) / 3), 0, 3);
    return t.watts[unit](sig(x / 1000 ** unit));
  }

  // ── What the picture shows, easing towards the settings ─────────────────────

  /** How hot the wire looks, 0 to 1, from the heat it wastes per metre: cold below 2 W/m, glowing by 300 W/m. */
  const heatLevel = (perMetre) => clamp(Math.log10(perMetre / 2) / Math.log10(150), 0, 1);

  /** The air's glow round the wire near the top of the dial, 0 to 1. */
  const corona = (s) => (flowing(s) ? clamp(Math.log10(s.kv / CORONA) / Math.log10(M.MAX_KV / CORONA), 0, 1) : 0);

  function targets(s) {
    if (!flowing(s)) return { lit: 0, heat: 0, flow: 0 };
    return {
      lit: M.delivered(volts(s), s.metal) / M.SENT,
      heat: heatLevel(M.heatPerMetre(volts(s), s.metal)),
      flow: 1,
    };
  }

  const view = { lit: 0.5, heat: 0.6, flow: 1 };
  let turn = 0, // seconds into the opening turn of the dial
    turned = null; // the voltage the turn last set

  function settle(s) {
    Object.assign(view, targets(s));
  }

  function ease(s, dt) {
    const goal = targets(s),
      k = 1 - Math.exp(-dt * 5);
    for (const key of Object.keys(goal)) view[key] += (goal[key] - view[key]) * k;
  }

  function glowRGB(level) {
    const g = clamp(level, 0, 1);
    let i = 1;
    while (i < GLOW.length - 1 && GLOW[i][0] < g) i++;
    const [g0, ...a] = GLOW[i - 1],
      [g1, ...b] = GLOW[i];
    const f = (g - g0) / (g1 - g0);
    return a.map((v, j) => Math.round(v + (b[j] - v) * f));
  }
  const glow = (level, alpha = 1) => `rgba(${glowRGB(level).join(', ')}, ${alpha})`;

  // ── Sound: the transformers' hum, a sizzle from a hot wire, the crackle of corona ──

  let audio = null,
    sounding = false,
    nodes = null,
    room = null;

  function stopSound() {
    sounding = false;
    if (nodes) {
      const at = audio.currentTime;
      try {
        nodes.master.gain.setTargetAtTime(0, at, 0.04);
        for (const source of nodes.sources) source.stop(at + 0.3);
      } catch {
        /* already stopped */
      }
      nodes = null;
    }
    if (W.stage.isShowing(room)) $('scene-action').textContent = t.soundOff;
  }

  function startSound() {
    const at = audio.currentTime;
    const master = audio.createGain();
    master.gain.setValueAtTime(0, at);
    master.gain.linearRampToValueAtTime(1, at + 0.4);
    master.connect(audio.destination);
    // Transformer hum: twice the 50 Hz mains, with its harmonics.
    const hum = audio.createGain();
    hum.gain.value = 0;
    hum.connect(master);
    const sources = [];
    for (const [frequency, level] of [
      [100, 1],
      [200, 0.55],
      [300, 0.35],
      [400, 0.22],
      [600, 0.1],
    ]) {
      const osc = audio.createOscillator(),
        gain = audio.createGain();
      osc.frequency.value = frequency;
      gain.gain.value = level;
      osc.connect(gain);
      gain.connect(hum);
      osc.start(at);
      sources.push(osc);
    }
    // Noise for the sizzle and the crackle.
    const noise = audio.createBuffer(1, audio.sampleRate * 2, audio.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const filtered = (type, frequency, q) => {
      const source = audio.createBufferSource(),
        filter = audio.createBiquadFilter(),
        gain = audio.createGain();
      source.buffer = noise;
      source.loop = true;
      filter.type = type;
      filter.frequency.value = frequency;
      filter.Q.value = q;
      gain.gain.value = 0;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      source.start(at, Math.random() * 2);
      sources.push(source);
      return gain;
    };
    nodes = { master, hum, sizzle: filtered('bandpass', 2600, 0.8), crackle: filtered('highpass', 3800, 0.7), sources };
  }

  function sounds(s) {
    if (!nodes) return;
    const at = audio.currentTime;
    const humming = s.current === AC ? 0.03 : s.current === NEW_DC ? 0.015 : 0;
    nodes.hum.gain.setTargetAtTime(humming, at, 0.15);
    nodes.sizzle.gain.setTargetAtTime(0.08 * view.heat * view.heat, at, 0.15);
    const c = corona(s);
    nodes.crackle.gain.setTargetAtTime(c && Math.random() < 0.3 ? 0.06 * c * Math.random() : 0, at, 0.008);
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
      startSound();
      sounds(W.stage.settingsFor('voltage'));
      $('scene-action').textContent = t.soundOn;
      W.stage.sync();
    } catch {
      stopSound();
      W.toast(t.noSound);
    }
  }

  // ── Layout ───────────────────────────────────────────────────────────────────

  /**
   * The landscape at the top, and the chart below, whose horizontal axis is the dial. When the canvas is taller than
   * the landscape's own shape needs, the landscape grows first (up to half the width tall: taller pylons, more sky),
   * and the chart takes the rest, so the picture fills its frame and the dial sits just above the buttons.
   */
  function place(width, height, fill = false) {
    const narrow = width < 560;
    const H = fill ? height : Math.min(height, width * (narrow ? 0.82 : 0.58));
    const pad = Math.max(8, Math.min(width, H) * 0.025);
    const small = Math.round(clamp(Math.min(width, H) / 30, 10, 13));
    const natural = Math.round(H * (narrow ? 0.56 : 0.6));
    const sceneH = Math.max(natural, Math.min(natural + height - H, Math.round(width * (narrow ? 0.62 : 0.5))));
    const chart = { x: pad, y: sceneH + pad * 0.5, w: width - pad * 2, h: height - sceneH - pad };
    // The chart's plot, and the dial's track under it.
    const left = small * 3.3;
    const plot = { x: chart.x + left, y: chart.y + small * 1.9, w: chart.w - left - small * 0.6, h: 0 };
    plot.h = chart.y + chart.h - small * 3.1 - plot.y;
    return {
      narrow,
      small,
      pad,
      scene: { x: 0, y: 0, w: width, h: sceneH },
      chart,
      plot,
      track: plot.y + plot.h + small,
    };
  }

  const xOfKv = (plot, kv) => plot.x + (Math.log10(kv) / 3) * plot.w;
  const kvAt = (plot, x) => kvOf(clamp((x - plot.x) / plot.w, 0, 1) * 3);

  /** The landscape's fixed points: the station, the two transformers, the pylons and the town. */
  function landscape(box, kv, narrow) {
    const { x, y, w, h } = box;
    const ground = y + h * 0.8;
    const station = { x: x + w * 0.025, w: w * (narrow ? 0.14 : 0.11) };
    const size = Math.max(11, Math.min(w * 0.03, h * 0.085)); // a transformer's width
    const a = station.x + station.w + size * 1.1;
    const town = { x0: x + w * (narrow ? 0.71 : 0.77), x1: x + w * 0.985 };
    const b = town.x0 - size * 0.9;
    // Higher voltage, taller towers and longer insulators.
    const f = Math.log10(kv) / 3;
    const tall = h * ((narrow ? 0.27 : 0.3) + 0.2 * f);
    const hang = tall * (0.07 + 0.1 * f);
    const count = narrow ? 3 : 4;
    const pylons = Array.from({ length: count }, (_, i) => a + ((b - a) * (i + 1)) / (count + 1));
    return { ground, station, size, a, b, town, tall, hang, pylons };
  }

  /** The wire's path, from the station's transformer over the pylons to the town's, sagging between supports. */
  function wirePath(L) {
    const top = L.ground - L.size * 1.55;
    const supports = [[L.a, top], ...L.pylons.map((px) => [px, L.ground - L.tall + L.hang]), [L.b, top]];
    const points = [];
    for (let i = 1; i < supports.length; i++) {
      const [x0, y0] = supports[i - 1],
        [x1, y1] = supports[i];
      const sag = (x1 - x0) * 0.05;
      for (let k = i === 1 ? 0 : 1; k <= 14; k++) {
        const u = k / 14;
        points.push([x0 + (x1 - x0) * u, y0 + (y1 - y0) * u + 4 * sag * u * (1 - u)]);
      }
    }
    const lengths = [0];
    for (let i = 1; i < points.length; i++)
      lengths.push(lengths[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
    return { points, lengths, supports };
  }

  /** The point a share `u` of the way along the wire, by length. */
  function along(path, u) {
    const { points, lengths } = path;
    const target = u * lengths[lengths.length - 1];
    let i = 1;
    while (i < lengths.length - 1 && lengths[i] < target) i++;
    const f = (target - lengths[i - 1]) / (lengths[i] - lengths[i - 1] || 1);
    return [
      points[i - 1][0] + (points[i][0] - points[i - 1][0]) * f,
      points[i - 1][1] + (points[i][1] - points[i - 1][1]) * f,
    ];
  }

  // A town of little houses in three rows, the back ones smaller. Each window has a rank: the order it lights in.
  let houses = null,
    housesKey = '';

  function townOf(L, h, narrow) {
    const key = [L.town.x0, L.town.x1, L.ground, h, narrow].join();
    if (key === housesKey) return houses;
    const rows = narrow
      ? [
          [4, 0.62, -0.03],
          [4, 0.8, 0.05],
          [3, 1, 0.14],
        ]
      : [
          [5, 0.62, -0.03],
          [5, 0.8, 0.05],
          [4, 1, 0.14],
        ];
    const width = L.town.x1 - L.town.x0;
    const list = [],
      windows = [];
    rows.forEach(([count, scale, drop], row) => {
      const slot = width / count;
      const hw = Math.min(slot * 0.78, h * 0.13) * scale;
      for (let i = 0; i < count; i++) {
        const cx = L.town.x0 + slot * (i + (row % 2 ? 0.35 : 0.6));
        const base = L.ground + h * drop;
        const tall = hw * (0.7 + 0.15 * ((i * 7 + row * 3) % 3));
        const house = { x: cx - hw / 2, base, w: hw, h: tall, windows: [] };
        const ww = hw * 0.22,
          wh = Math.min(tall * 0.32, hw * 0.26);
        for (const wx of row === 0 ? [0.5] : [0.3, 0.7]) {
          const win = { x: house.x + hw * wx - ww / 2, y: base - tall * 0.62, w: ww, h: wh, rank: 0 };
          house.windows.push(win);
          windows.push(win);
        }
        list.push(house);
      }
    });
    // A fixed shuffle, so the windows light all over the town rather than row by row.
    let seed = 11;
    const order = windows.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      seed = (seed * 16807) % 2147483647;
      const j = seed % (i + 1);
      [order[i], order[j]] = [order[j], order[i]];
    }
    order.forEach((index, rank) => (windows[index].rank = rank));
    houses = { list, count: windows.length };
    housesKey = key;
    return houses;
  }

  // ── The landscape ─────────────────────────────────────────────────────────────

  function drawSky(ctx, box, L) {
    const { x, y, w, h } = box;
    const sky = ctx.createLinearGradient(0, y, 0, L.ground);
    sky.addColorStop(0, COLOURS.sky[0]);
    sky.addColorStop(1, COLOURS.sky[1]);
    ctx.fillStyle = sky;
    ctx.fillRect(x, y, w, L.ground - y);
    // A few fixed stars.
    for (let i = 0; i < 46; i++) {
      const sx = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1,
        sy = Math.abs(Math.sin(i * 78.233) * 12543.123) % 1;
      ctx.fillStyle = `rgba(220, 230, 255, ${0.25 + 0.4 * ((i * 37) % 10) * 0.1})`;
      ctx.fillRect(x + sx * w, y + sy * (L.ground - y) * 0.7, 1.2, 1.2);
    }
    // The town's lights glow on the sky.
    if (view.lit > 0.01) {
      const cx = (L.town.x0 + L.town.x1) / 2;
      const halo = ctx.createRadialGradient(cx, L.ground, 0, cx, L.ground, (L.town.x1 - L.town.x0) * 0.9);
      halo.addColorStop(0, `rgba(255, 200, 110, ${0.22 * view.lit})`);
      halo.addColorStop(1, 'rgba(255, 200, 110, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(L.town.x0 - w * 0.1, y, L.town.x1 - L.town.x0 + w * 0.12, L.ground - y);
    }
    ctx.fillStyle = COLOURS.ground;
    ctx.fillRect(x, L.ground, w, y + h - L.ground);
    ctx.strokeStyle = COLOURS.horizon;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, L.ground + 0.5);
    ctx.lineTo(x + w, L.ground + 0.5);
    ctx.stroke();
  }

  function drawStation(ctx, L, h, clock) {
    const { x, w } = L.station;
    const g = L.ground;
    // The chimney, with a blinking light and steam drifting away.
    const cw = w * 0.16,
      cx = x + w * 0.08,
      top = g - h * 0.44;
    for (let i = 0; i < 4; i++) {
      const rise = (clock * 0.12 + i / 4) % 1;
      ctx.fillStyle = `rgba(150, 165, 180, ${0.16 * (1 - rise)})`;
      ctx.beginPath();
      ctx.arc(cx + cw / 2 + rise * w * 0.5, top - rise * h * 0.16, cw * (0.5 + rise * 1.2), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#2a3542';
    ctx.fillRect(cx, top, cw, g - top);
    ctx.fillStyle = Math.floor(clock * 1.2) % 2 ? '#ff5a4a' : '#7a2620';
    ctx.beginPath();
    ctx.arc(cx + cw / 2, top - 2, 2, 0, Math.PI * 2);
    ctx.fill();
    // The turbine hall, lit by its own power.
    const hx = x + w * 0.3,
      hw = w * 0.7,
      hh = h * 0.16;
    ctx.fillStyle = COLOURS.wall;
    ctx.beginPath();
    ctx.moveTo(hx, g);
    ctx.lineTo(hx, g - hh);
    ctx.lineTo(hx + hw * 0.5, g - hh * 1.22);
    ctx.lineTo(hx + hw, g - hh);
    ctx.lineTo(hx + hw, g);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 211, 107, 0.55)';
    const panes = 4;
    for (let i = 0; i < panes; i++)
      ctx.fillRect(hx + hw * (0.12 + (0.78 * i) / panes), g - hh * 0.62, (hw * 0.6) / panes, hh * 0.22);
  }

  function drawPylon(ctx, px, L) {
    const g = L.ground,
      tall = L.tall;
    const base = tall * 0.16,
      waist = tall * 0.05,
      cup = tall * 0.2;
    const wy = g - tall * 0.62,
      ty = g - tall;
    ctx.strokeStyle = COLOURS.steel;
    ctx.lineWidth = 1.3;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (const side of [-1, 1]) {
      ctx.moveTo(px + side * base, g);
      ctx.lineTo(px + side * waist, wy);
      ctx.lineTo(px + side * cup, ty);
    }
    ctx.moveTo(px - cup * 1.1, ty);
    ctx.lineTo(px + cup * 1.1, ty);
    // Cross-bracing: zigzags between the legs.
    const panels = 4;
    for (let i = 0; i < panels; i++) {
      const y0 = g - ((g - wy) * i) / panels,
        y1 = g - ((g - wy) * (i + 1)) / panels;
      const w0 = base + ((waist - base) * i) / panels,
        w1 = base + ((waist - base) * (i + 1)) / panels;
      ctx.moveTo(px - w0, y0);
      ctx.lineTo(px + w1, y1);
      ctx.moveTo(px + w0, y0);
      ctx.lineTo(px - w1, y1);
    }
    ctx.moveTo(px - waist, wy);
    ctx.lineTo(px + cup, ty);
    ctx.moveTo(px + waist, wy);
    ctx.lineTo(px - cup, ty);
    ctx.stroke();
    // The insulator string: a stack of discs, longer for higher voltage.
    ctx.strokeStyle = COLOURS.insulator;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px, ty);
    ctx.lineTo(px, ty + L.hang);
    const discs = Math.max(2, Math.round(L.hang / 4));
    for (let i = 1; i <= discs; i++) {
      const dy = ty + (L.hang * i) / (discs + 1);
      ctx.moveTo(px - 2.5, dy);
      ctx.lineTo(px + 2.5, dy);
    }
    ctx.stroke();
  }

  /** A transformer (or, today, a converter for direct current) on the ground: a box with a bushing on top. */
  function drawBox(ctx, cx, L, s, clock) {
    const size = L.size,
      g = L.ground;
    const working = s.current !== OLD_DC;
    ctx.save();
    ctx.globalAlpha = working ? 1 : 0.55;
    ctx.fillStyle = '#26313d';
    ctx.strokeStyle = '#4a5868';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(cx - size / 2, g - size * 1.05, size, size * 1.05, 2);
    ctx.fill();
    ctx.stroke();
    // The bushing the wire leaves from.
    ctx.strokeStyle = COLOURS.insulator;
    ctx.beginPath();
    ctx.moveTo(cx, g - size * 1.05);
    ctx.lineTo(cx, g - size * 1.55);
    for (let i = 1; i <= 3; i++) {
      const dy = g - size * 1.05 - (size * 0.5 * i) / 4;
      ctx.moveTo(cx - 2.5, dy);
      ctx.lineTo(cx + 2.5, dy);
    }
    ctx.stroke();
    const cy = g - size * 0.52,
      r = size * 0.2;
    ctx.lineWidth = 1.4;
    if (s.current === NEW_DC) {
      // A converter: a square split by a diagonal, a wave on one side and a straight line on the other.
      const q = size * 0.34;
      ctx.strokeStyle = COLOURS.converter;
      ctx.strokeRect(cx - q, cy - q, q * 2, q * 2);
      ctx.beginPath();
      ctx.moveTo(cx - q, cy + q);
      ctx.lineTo(cx + q, cy - q);
      for (let i = 0; i <= 8; i++) {
        const u = i / 8;
        const wx = cx - q * 0.85 + u * q * 0.9,
          wy = cy - q * 0.45 + Math.sin(u * Math.PI * 2) * q * 0.18;
        if (i) ctx.lineTo(wx, wy);
        else ctx.moveTo(wx, wy);
      }
      ctx.moveTo(cx + q * 0.05, cy + q * 0.45);
      ctx.lineTo(cx + q * 0.85, cy + q * 0.45);
      ctx.stroke();
    } else {
      // Two coils, linked through the iron, pulsing while the current alternates.
      const pulse = working ? 0.75 + 0.25 * Math.sin(clock * Math.PI * 2) : 1;
      ctx.strokeStyle = working ? `rgba(126, 203, 255, ${pulse})` : '#6a7684';
      ctx.beginPath();
      ctx.arc(cx - r * 0.6, cy, r, 0, Math.PI * 2);
      ctx.moveTo(cx + r * 1.6, cy);
      ctx.arc(cx + r * 0.6, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawWire(ctx, path, s, L, h, clock) {
    const { points } = path;
    const trace = () => {
      ctx.beginPath();
      points.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
      ctx.stroke();
    };
    const g = view.heat;
    const thick = Math.min(h * 0.05, Math.max(1.4, h * 0.006) * Math.sqrt(s.metal));
    // Heat shimmering above a hot wire.
    if (g > 0.08) {
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = `rgba(255, 190, 120, ${0.24 * g})`;
      const rise = h * 0.11 * g;
      for (let i = 0; i < path.supports.length - 1; i++)
        for (const u of [0.25, 0.5, 0.75]) {
          const [bx, by] = along(path, (i + u) / (path.supports.length - 1));
          ctx.beginPath();
          for (let k = 0; k <= 8; k++) {
            const sx = bx + Math.sin(k * 0.9 - clock * 4 + i * 2 + u * 9) * (2 + 2 * g);
            if (k) ctx.lineTo(sx, by - thick - (rise * k) / 8);
            else ctx.moveTo(sx, by - thick);
          }
          ctx.stroke();
        }
    }
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    if (g > 0.02) {
      ctx.strokeStyle = glow(g, 0.16 * g);
      ctx.lineWidth = thick + 16 * g;
      trace();
      ctx.strokeStyle = glow(g, 0.32 * g);
      ctx.lineWidth = thick + 6 * g;
      trace();
    }
    ctx.strokeStyle = glow(Math.min(1, g * 1.2));
    ctx.lineWidth = thick;
    trace();
    // The energy on its way to the town, fading as the wire turns it into heat.
    if (view.flow > 0.02) {
      const count = Math.round((L.b - L.a) / 22);
      ctx.fillStyle = COLOURS.energy;
      for (let i = 0; i < count; i++) {
        const u = (i / count + clock * 0.07) % 1;
        const [px, py] = along(path, u);
        const share = M.flowAt((px - L.a) / (L.b - L.a), volts(s), s.metal) / M.SENT;
        const alpha = 0.9 * share * view.flow;
        if (alpha < 0.03) continue;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(px, py, clamp(thick * 0.45, 1.6, 2.6), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }

  /** Corona: a violet glow and crackle in the air round the wire, near the top of the dial. */
  function drawCorona(ctx, path, s, L, clock) {
    const c = corona(s);
    if (!c) return;
    const tick = Math.floor(clock * 12);
    const [r, g, b] = COLOURS.corona;
    for (const [i, px] of L.pylons.entries()) {
      const flicker = 0.6 + 0.4 * Math.abs(Math.sin(tick * 1.7 + i * 2.3));
      const py = L.ground - L.tall + L.hang;
      const halo = ctx.createRadialGradient(px, py, 0, px, py, 4 + 8 * c);
      halo.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.7 * c * flicker})`);
      halo.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(px, py, 4 + 8 * c, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.85 * c})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let k = 0; k < 7; k++) {
      const u = Math.abs(Math.sin((tick + k * 13) * 12.9898) * 43758.5453) % 1;
      const [sx, sy] = along(path, 0.05 + u * 0.9);
      for (let j = 0; j < 3; j++) {
        const angle = (j * Math.PI) / 3 + k;
        ctx.moveTo(sx - Math.cos(angle) * 3, sy - Math.sin(angle) * 3);
        ctx.lineTo(sx + Math.cos(angle) * 3, sy + Math.sin(angle) * 3);
      }
    }
    ctx.stroke();
  }

  function drawTown(ctx, L, h, narrow) {
    const town = townOf(L, h, narrow);
    const lit = view.lit * town.count;
    const [wr, wg, wb] = COLOURS.window;
    for (const house of town.list) {
      const { x, base, w, h: tall } = house;
      ctx.fillStyle = COLOURS.wall;
      ctx.fillRect(x, base - tall, w, tall);
      ctx.fillStyle = COLOURS.roof;
      ctx.beginPath();
      ctx.moveTo(x - w * 0.08, base - tall);
      ctx.lineTo(x + w / 2, base - tall - w * 0.42);
      ctx.lineTo(x + w * 1.08, base - tall);
      ctx.fill();
      for (const win of house.windows) {
        const on = clamp(lit - win.rank, 0, 1);
        if (on > 0) {
          ctx.fillStyle = `rgba(${wr}, ${wg}, ${wb}, ${0.22 * on})`;
          ctx.fillRect(win.x - 2, win.y - 2, win.w + 4, win.h + 4);
        }
        ctx.fillStyle = on > 0 ? `rgba(${wr}, ${wg}, ${wb}, ${0.25 + 0.75 * on})` : COLOURS.dark;
        ctx.fillRect(win.x, win.y, win.w, win.h);
      }
    }
  }

  function drawLabels(ctx, L, box, small) {
    const { h } = box;
    ctx.font = `${small - 1}px system-ui`;
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = COLOURS.muted;
    ctx.textAlign = 'left';
    ctx.fillText(t.labels.station, L.station.x, L.ground + small * 1.3, L.a - L.station.x + L.size);
    ctx.textAlign = 'right';
    ctx.fillText(t.labels.town, L.town.x1, L.ground - h * 0.27);
    // What the houses get, under the town's transformer, ending before the first houses.
    ctx.fillText(t.labels.house, L.b + L.size / 2, L.ground + small * 1.3);
    ctx.textAlign = 'center';
    // 100 km, between the two transformers.
    const y = box.y + h - small * 0.7;
    const label = t.labels.distance;
    const half = ctx.measureText(label).width / 2 + 6;
    const mid = (L.a + L.b) / 2;
    ctx.fillText(label, mid, y + small * 0.35);
    ctx.strokeStyle = 'rgba(152, 170, 183, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const [from, to] of [
      [mid - half, L.a],
      [mid + half, L.b],
    ]) {
      const dir = Math.sign(to - from);
      ctx.moveTo(from, y);
      ctx.lineTo(to, y);
      ctx.moveTo(to - dir * 5, y - 3);
      ctx.lineTo(to, y);
      ctx.lineTo(to - dir * 5, y + 3);
    }
    ctx.stroke();
  }

  /** The voltage, and what it costs, in the sky above the line. */
  function drawHeadline(ctx, L, s, small) {
    const cx = (L.a + L.b) / 2,
      width = L.b - L.a;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.font = `600 ${Math.round(small * 2)}px Georgia, serif`;
    ctx.fillStyle = COLOURS.ink;
    ctx.fillText(kvText(s.kv), cx, small * 2.4, width);
    ctx.font = `600 ${small}px system-ui`;
    let words;
    if (!flowing(s)) {
      words = t.labels.stopped;
      ctx.fillStyle = COLOURS.muted;
    } else {
      const share = M.share(volts(s), s.metal);
      words = share >= 1 ? t.labels.nothing : t.labels.lost(percent(share));
      ctx.fillStyle = view.heat > 0.15 ? glow(Math.max(0.5, view.heat)) : COLOURS.cool;
    }
    ctx.fillText(words, cx, small * 3.8, width);
  }

  /** The landscape in `box`; its sky and ground may reach wider, across `sky`. */
  function drawScene(ctx, box, s, clock, narrow, small, sky = box) {
    const L = landscape(box, s.kv, narrow);
    const path = wirePath(L);
    drawSky(ctx, sky, L);
    drawStation(ctx, L, box.h, clock);
    for (const px of L.pylons) drawPylon(ctx, px, L);
    drawWire(ctx, path, s, L, box.h, clock);
    drawCorona(ctx, path, s, L, clock);
    drawBox(ctx, L.a, L, s, clock);
    drawBox(ctx, L.b, L, s, clock);
    drawTown(ctx, L, box.h, narrow);
    drawLabels(ctx, L, box, small);
    drawHeadline(ctx, L, s, small);
  }

  // ── The chart: heat wasted against voltage, both on scales of powers of ten ──

  const TOP = 9, // 1 GW
    BOTTOM = 0; // 1 W

  function drawChart(ctx, P, s) {
    const { plot, small } = P;
    const yOf = (w) => plot.y + ((TOP - Math.log10(w)) / (TOP - BOTTOM)) * plot.h;
    const xOf = (kv) => xOfKv(plot, kv);
    const right = plot.x + plot.w;
    ctx.save();
    ctx.textBaseline = 'alphabetic';
    ctx.font = `600 ${small - 1}px system-ui`;
    ctx.fillStyle = COLOURS.muted;
    ctx.textAlign = 'left';
    ctx.fillText(t.labels.chartTitle, P.chart.x, P.chart.y + small, P.chart.w * 0.6);
    // More heat than the station sends: the town gets nothing.
    const sent = yOf(M.SENT);
    ctx.fillStyle = 'rgba(255, 90, 60, 0.12)';
    ctx.fillRect(plot.x, plot.y, plot.w, sent - plot.y);
    ctx.font = `${small - 1}px system-ui`;
    // Grid lines at 1 W, 1 kW, 1 MW and 1 GW, and the voltage's powers of ten.
    ctx.lineWidth = 1;
    ctx.textAlign = 'right';
    for (let unit = 0; unit <= 3; unit++) {
      const y = yOf(1000 ** unit);
      ctx.strokeStyle = COLOURS.grid;
      ctx.beginPath();
      ctx.moveTo(plot.x, y);
      ctx.lineTo(right, y);
      ctx.stroke();
      ctx.fillStyle = COLOURS.muted;
      ctx.fillText(t.watts[unit](sig(1)), plot.x - 5, y + small * 0.35);
    }
    for (const kv of [10, 100]) {
      ctx.strokeStyle = COLOURS.grid;
      ctx.beginPath();
      ctx.moveTo(xOf(kv), plot.y);
      ctx.lineTo(xOf(kv), plot.y + plot.h);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255, 140, 110, 0.7)';
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(plot.x, sent);
    ctx.lineTo(right, sent);
    ctx.stroke();
    ctx.setLineDash([]);

    // The loss at every voltage: a straight line, falling two powers of ten for each one along.
    ctx.beginPath();
    ctx.rect(plot.x, plot.y - 1, plot.w, plot.h + 2);
    ctx.clip();
    const curve = (metal) => {
      ctx.beginPath();
      for (let i = 0; i <= 30; i++) {
        const kv = 10 ** ((3 * i) / 30);
        const y = yOf(M.loss(kv * 1000, metal));
        if (i) ctx.lineTo(xOf(kv), y);
        else ctx.moveTo(xOf(kv), y);
      }
      ctx.stroke();
    };
    const live = flowing(s);
    ctx.globalAlpha = live ? 1 : 0.3;
    if (s.metal !== 1) {
      ctx.strokeStyle = 'rgba(255, 157, 77, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      curve(1);
      ctx.setLineDash([]);
    }
    ctx.strokeStyle = COLOURS.curve;
    ctx.lineWidth = 2.5;
    curve(s.metal);
    ctx.globalAlpha = 1;
    ctx.restore();

    const x = xOf(s.kv),
      loss = M.loss(volts(s), s.metal),
      y = yOf(loss);
    const busy = []; // the step's labels, as [left, top, right, bottom], which the other labels keep clear of
    if (live) {
      // Ten times the voltage, a hundredth of the heat (or, near the top, a tenth and a hundred times).
      const up = s.kv * 10 <= M.MAX_KV;
      const x2 = xOf(up ? s.kv * 10 : s.kv / 10),
        y2 = yOf(up ? loss / 100 : loss * 100);
      const [across, down] = up ? t.labels.up : t.labels.down;
      ctx.strokeStyle = 'rgba(244, 245, 233, 0.75)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = COLOURS.ink;
      ctx.font = `600 ${small - 1}px system-ui`;
      ctx.textAlign = 'center';
      const ay = up ? y - 5 : y + small + 2;
      const aw = ctx.measureText(across).width;
      ctx.fillText(across, (x + x2) / 2, ay);
      busy.push([(x + x2) / 2 - aw / 2, ay - small, (x + x2) / 2 + aw / 2, ay + 2]);
      const width = ctx.measureText(down).width;
      const side = up ? x2 + 5 + width <= right : x2 - 5 - width < plot.x;
      const dx = x2 + (side ? 5 : -5),
        dy = (y + y2) / 2 + small * 0.35;
      ctx.textAlign = side ? 'left' : 'right';
      ctx.fillText(down, dx, dy);
      busy.push([side ? dx : dx - width, dy - small, side ? dx + width : dx, dy + 2]);
      ctx.fillStyle = COLOURS.energy;
      ctx.strokeStyle = '#0a0e15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, clamp(y, plot.y, plot.y + plot.h), Math.max(4, small * 0.42), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    // The line for everything the station sends, named on the right unless the step's words are there.
    ctx.font = `${small - 1}px system-ui`;
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255, 170, 150, 0.95)';
    for (const [words, base] of [
      [t.labels.over, plot.y + small],
      [t.labels.sent, sent + small * 1.05],
    ]) {
      const width = Math.min(ctx.measureText(words).width, plot.w * 0.5);
      const box = [right - 4 - width, base - small, right - 4, base + 2];
      if (!busy.some((b) => b[0] < box[2] && box[0] < b[2] && b[1] < box[3] && box[1] < b[3]))
        ctx.fillText(words, right - 4, base, plot.w * 0.5);
    }

    // The dial: a track along the bottom, its scale, and a knob to drag.
    const track = P.track;
    ctx.fillStyle = '#1c2733';
    ctx.beginPath();
    ctx.roundRect(plot.x - 3, track - 3, plot.w + 6, 6, 3);
    ctx.fill();
    ctx.fillStyle = '#3b4a5a';
    ctx.beginPath();
    ctx.roundRect(plot.x - 3, track - 3, x - plot.x + 3, 6, 3);
    ctx.fill();
    ctx.strokeStyle = COLOURS.muted;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let decade = 0; decade < 3; decade++)
      for (const m of [2, 5]) {
        const tx = xOf(m * 10 ** decade);
        ctx.moveTo(tx, track - 6);
        ctx.lineTo(tx, track - 3);
      }
    for (let decade = 0; decade <= 3; decade++) {
      ctx.moveTo(xOf(10 ** decade), track - 8);
      ctx.lineTo(xOf(10 ** decade), track - 3);
    }
    ctx.stroke();
    ctx.font = `${small - 1}px system-ui`;
    ctx.fillStyle = COLOURS.muted;
    for (let decade = 0; decade <= 3; decade++) {
      ctx.textAlign = decade === 0 ? 'left' : decade === 3 ? 'right' : 'center';
      ctx.fillText(
        kvText(10 ** decade),
        xOf(10 ** decade) + (decade === 0 ? -3 : decade === 3 ? 3 : 0),
        track + small * 1.6,
      );
    }
    // The axis's name, between 10 kV and 100 kV if it fits there.
    const space = xOf(100) - xOf(10) - (ctx.measureText(kvText(10)).width + ctx.measureText(kvText(100)).width) / 2;
    if (ctx.measureText(t.labels.chartX).width + 24 <= space) {
      ctx.textAlign = 'center';
      ctx.fillText(t.labels.chartX, (xOf(10) + xOf(100)) / 2, track + small * 1.6);
    }
    const r = Math.max(6, small * 0.62);
    ctx.fillStyle = COLOURS.knob;
    ctx.strokeStyle = '#0a0e15';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, track, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (s.auto) {
      ctx.font = `600 ${small - 1}px system-ui`;
      ctx.fillStyle = COLOURS.knob;
      const width = ctx.measureText(t.labels.drag).width;
      const onRight = x + r + 6 + width <= right;
      ctx.textAlign = onRight ? 'left' : 'right';
      ctx.fillText(t.labels.drag, x + (onRight ? r + 6 : -r - 6), track - r - 2);
    }
  }

  function scene(ctx, s, width, height, clock, fill) {
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    ctx.direction = 'ltr'; // the picture keeps its direction on right-to-left pages too
    const P = place(width, height, fill);
    drawScene(ctx, P.scene, s, clock, P.narrow, P.small);
    drawChart(ctx, P, s);
  }

  function draw(ctx, s, stage) {
    if (!stage.playing) settle(s);
    scene(ctx, s, stage.width, stage.height, stage.clock);
  }

  /**
   * The home card and link preview: 9 kV, the wire glowing and most of the town still dark. The home map shows the
   * middle square of a wide preview, so there the landscape alone fills that square, without the chart.
   */
  function preview(ctx, width, height) {
    const s = { kv: 9, current: AC, metal: 1, auto: false };
    settle(s);
    if (height / width >= 0.7) return scene(ctx, s, width, height, 1.3, true);
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    ctx.direction = 'ltr';
    const box = { x: (width - height) / 2, y: 0, w: height, h: height };
    drawScene(ctx, box, s, 1.3, true, 10, { x: 0, y: 0, w: width, h: height });
  }

  // ── The panel ─────────────────────────────────────────────────────────────────

  let typing = false; // the visitor is moving a slider, so it isn't moved back under their hand

  function cmText(metres) {
    return t.cm(sig(metres * 100));
  }

  function readouts(s) {
    $('scene-name').textContent = t.sceneNames[s.current];
    $('scene-action').textContent = sounding ? t.soundOn : t.soundOff;
    const share = M.share(volts(s), s.metal);
    const lost = percent(share);
    $('scene-status').textContent = flowing(s) ? t.status(kvText(s.kv), lost) : t.statusStopped;
    const kv = $('voltage-kv');
    if (kv) {
      if (!typing) kv.value = Math.log10(s.kv);
      kv.setAttribute('aria-valuetext', t.voltageValue(kvText(s.kv), lost));
      $('voltage-kv-out').textContent = kvText(s.kv);
    }
    const metal = $('voltage-metal');
    if (metal) {
      if (!typing) metal.value = Math.log10(s.metal);
      const text = t.times(sig(s.metal));
      metal.setAttribute('aria-valuetext', text);
      $('voltage-metal-out').textContent = text;
    }
    document
      .querySelectorAll('#scene-controls [data-current]')
      .forEach((b) => b.setAttribute('aria-pressed', Number(b.dataset.current) === s.current));
    const box = $('voltage-readout');
    if (!box) return;
    const wire = M.wire(s.metal);
    // The wire's size answers the metal slider, so it shows once the visitor has added metal.
    const wireLine = s.metal === 1 ? '' : `<p>${t.readout.wire(cmText(wire.diameter), t.tonnes(sig(wire.tonnes)))}</p>`;
    if (!flowing(s)) {
      box.innerHTML = `<p class="voltage-stopped">${t.readout.stopped}</p>${wireLine}`;
      return;
    }
    const loss = M.loss(volts(s), s.metal);
    const tone = share >= 1 ? 2 : share > 0.05 ? 1 : 0;
    box.innerHTML =
      `<div class="voltage-big"><span>${t.readout.lost}</span><strong class="is-${tone}">${lost}</strong></div>` +
      `<p>${share >= 1 ? t.readout.tooMuch(watts(loss), watts(M.SENT)) : t.readout.lostOf(watts(loss), watts(M.SENT))}</p>` +
      wireLine +
      (s.current === NEW_DC ? `<p>${t.readout.converters}</p>` : '');
  }

  function controls(s) {
    return (
      `<div class="control wide"><label for="voltage-kv">${t.voltage}<output id="voltage-kv-out" aria-live="off"></output></label>` +
      `<input id="voltage-kv" type="range" min="0" max="3" step="0.01" value="${Math.log10(s.kv)}">` +
      `<p>${t.voltageHint}</p></div>` +
      `<div class="control wide"><label id="voltage-mode-label">${t.modeLabel}</label>` +
      `<div class="segment" role="group" aria-labelledby="voltage-mode-label">` +
      t.modes
        .map(
          (name, i) => `<button type="button" data-current="${i}" aria-pressed="${s.current === i}">${name}</button>`,
        )
        .join('') +
      `</div><p>${t.modeHint}</p></div>` +
      `<div class="control wide"><label for="voltage-metal">${t.metal}<output id="voltage-metal-out" aria-live="off"></output></label>` +
      `<input id="voltage-metal" type="range" min="0" max="2" step="0.01" value="${Math.log10(s.metal)}">` +
      `<p>${t.metalHint}</p></div>` +
      '<div class="wide readout voltage-readout" id="voltage-readout"></div>'
    );
  }

  /** The visitor takes the dial: the opening turn stops. */
  function setKv(s, kv, st) {
    s.kv = clamp(kv, M.MIN_KV, M.MAX_KV);
    s.auto = false;
    st.setChosen(-1);
    st.sync();
    st.draw();
  }

  function bindControls(panel, s, st) {
    const slide = (id, apply) =>
      $(id).addEventListener('input', (e) => {
        typing = true;
        apply(Number(e.target.value));
        typing = false;
      });
    slide('voltage-kv', (v) => setKv(s, kvOf(v), st));
    slide('voltage-metal', (v) => {
      s.metal = clamp(M.nice(10 ** v), 1, M.MAX_METAL);
      st.setChosen(-1);
      st.sync();
      st.draw();
    });
    panel.querySelectorAll('[data-current]').forEach((button) =>
      button.addEventListener('click', () => {
        s.current = Number(button.dataset.current);
        st.setChosen(-1);
        st.sync();
        st.draw();
        W.announce(t.sceneNames[s.current]);
      }),
    );
  }

  /** One step along the dial: a twentieth of a power of ten, or at least one step of its two-figure reading. */
  function nudge(s, by, st) {
    let kv = kvOf(Math.log10(s.kv) + by * 0.05);
    if (kv === s.kv) kv = clamp(s.kv + by * 10 ** (Math.floor(Math.log10(s.kv)) - 1), M.MIN_KV, M.MAX_KV);
    setKv(s, M.nice(kv), st);
  }

  /** Is this point (from 0 to 1 across the canvas) on the chart, where a drag turns the dial? */
  function onDial(p, st) {
    const P = place(st.width, st.height);
    return p.y * st.height >= P.chart.y && p.y * st.height <= P.track + P.small * 2;
  }

  let grabbed = false;

  room = W.defineRoom({
    id: 'voltage',
    symbol: 'Ω',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'engineering',
    added: '2026-10-05',
    tagline: t.tagline,
    accent: { background: '#21170f', border: '#ff9d4d', color: '#ffd9b3' },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.sceneLabel,
    sceneName: t.sceneNames[AC],
    tip: t.tip,
    actionLabel: t.soundOff,
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { ...t.connection, go: 'traffic' },

    defaults: { kv: START, current: AC, metal: 1, auto: true },
    ranges: {
      kv: [M.MIN_KV, M.MAX_KV],
      current: [AC, NEW_DC, 'integer'],
      metal: [1, M.MAX_METAL],
    },
    defaultPreset: -1,
    presets: [
      { settings: { kv: 10, current: AC, metal: 1, auto: false } },
      { settings: { kv: 400, current: AC, metal: 1, auto: false } },
      { settings: { kv: 10, current: AC, metal: 100, auto: false } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        color: '#ff9d4d',
        sketch: { hairStyle: 'swept', hair: '#4a3a2c', skin: '#efcfb0', beard: 'full', backdrop: '#2b2116' },
      },
      {
        ...t.guests[1],
        color: '#f7c948',
        sketch: { hairStyle: 'swept', hair: '#d8d4cc', skin: '#efcfb0', brows: 'bold', backdrop: '#26261a' },
      },
      {
        ...t.guests[2],
        color: '#7ecbff',
        sketch: { hairStyle: 'short', hair: '#1f1a17', skin: '#ecd0b4', moustache: true, backdrop: '#1a2033' },
      },
    ],

    insight: t.insight,

    controls,
    bindControls,
    readouts,
    draw,
    preview,
    enter(s, st) {
      turn = 0;
      // A voltage from a shared link or a saved moment stays put; otherwise the dial starts its turn again.
      if (s.auto && s.kv !== START && s.kv !== turned) s.auto = false;
      if (s.auto) s.kv = turned = reduced ? START : turning(0);
      settle(s);
      st.sync();
    },
    onPreset(s) {
      settle(s);
    },
    step(dt, s, st) {
      if (s.auto) {
        turn += dt;
        const kv = turning(turn);
        if (kv !== s.kv) {
          s.kv = turned = kv;
          st.sync();
        }
      }
      ease(s, dt);
      sounds(s);
    },
    action: toggleSound,
    reset(s, st) {
      turn = 0;
      s.auto = true;
      s.kv = turned = reduced ? START : turning(0);
      st.setChosen(-1);
      settle(s);
      st.sync();
      st.draw();
    },
    silence: stopSound,
    soundOn: () => sounding,

    pointer: {
      // A finger on the chart turns the dial; anywhere else it scrolls the page.
      drag: (p, s, st) => onDial(p, st),
      down(p, s, st) {
        grabbed = onDial(p, st);
        if (grabbed) setKv(s, kvAt(place(st.width, st.height).plot, p.x * st.width), st);
      },
      move(p, { dragging }, s, st) {
        if (dragging && grabbed) setKv(s, kvAt(place(st.width, st.height).plot, p.x * st.width), st);
      },
      up() {
        grabbed = false;
      },
      /** ← → (and ↑ ↓) turn the voltage. */
      arrow(dx, dy, s, st) {
        nudge(s, dx || -dy, st);
      },
    },
  });
})();
