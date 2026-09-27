/* Room · A heartbeat travels: waves in an excitable medium, and the spirals a broken wave makes. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, TAU, clamp } = W;
  const M = W.models.heart;
  const t = W.text('heart');
  const reduced = W.prefersReducedMotion();

  const SPEED = 4; // model time units per second of real time: a wave crosses a phone screen in about 2 s
  const PERIOD = 4; // the pacemaker fires every 4 time units: once a second, 60 times a minute
  const WINDOW = 24; // beats at the far corner are counted over the last 24 time units (6 s)
  const CUT_AFTER = 4; // "Break a wave" cuts its ring this long after starting it
  const PACE = { x: 0.1, y: 0.85 }; // where the pacemaker sits
  const PROBE = { x: 0.9, y: 0.15 }; // where beats are counted, in the far corner
  const ACROSS = 100; // cells across the sheet, on every screen, so it looks and moves the same everywhere
  const COLOURS = { rest: [10, 14, 21], firing: [255, 190, 132], recovering: [52, 112, 142] };

  let field = null,
    time = 0,
    nextBeat = 0,
    beatShown = -1, // when the pacemaker last fired, for its little pulse
    cutAt = null,
    carry = 0, // fractional steps left over between frames
    arrivals = [],
    probeWas = false,
    spirals = 0,
    checkedAt = -1,
    status = '',
    announced = '',
    statusSince = 0,
    aim = null,
    stroke = null; // the finger's current press: { start, last, wiped }

  const recoveryRate = (s) => 1.4 / s.recovery;

  /** The sheet's size in cells: always the same width, and as tall as the canvas's shape asks. */
  function cellsFor(stage) {
    return [ACROSS, clamp(Math.round((ACROSS * stage.height) / Math.max(1, stage.width)), 30, 150)];
  }

  function ensure(s, stage) {
    const [nx, ny] = cellsFor(stage);
    if (!field) seed(s, stage);
    else if (field.nx !== nx || field.ny !== ny) field = M.resize(field, nx, ny);
  }

  /** A fresh sheet for a start: 0 a steady heartbeat, 1 a wave about to break, 2 the same as 0 (slow recovery). */
  function seed(s, stage) {
    const [nx, ny] = cellsFor(stage);
    field = M.create(nx, ny);
    time = 0;
    nextBeat = 0.4;
    beatShown = -1;
    cutAt = null;
    carry = 0;
    arrivals = [];
    probeWas = false;
    spirals = 0;
    checkedAt = -1;
    if (s.start === 1) breakWave();
    // With reduced motion the sheet doesn't move, so open on a picture worth seeing: spirals already turning.
    if (reduced) {
      if (s.start !== 1) breakWave();
      advance(s, 40 / M.DT);
    }
  }

  /** Start a ring in the middle; cut it in half a moment later, so its ends curl into spirals. */
  function breakWave() {
    M.stimulate(field, 0.5, 0.5, 3);
    cutAt = time + CUT_AFTER;
  }

  /** Run the sheet forward by `steps` time steps, firing the pacemaker and counting beats at the far corner. */
  function advance(s, steps) {
    const k = recoveryRate(s);
    for (let i = 0; i < steps; i++) {
      if (time >= nextBeat) {
        if (s.pacemaker) {
          M.stimulate(field, PACE.x, PACE.y, 4);
          beatShown = time;
        }
        nextBeat += PERIOD;
      }
      if (cutAt !== null && time >= cutAt) {
        M.cutTop(field);
        cutAt = null;
      }
      M.step(field, k);
      time += M.DT;
      const probe = field.u[Math.round(PROBE.y * (field.ny - 1)) * field.nx + Math.round(PROBE.x * (field.nx - 1))];
      const firing = probe > M.FIRING;
      if (firing && !probeWas) arrivals.push(time);
      probeWas = firing;
    }
    while (arrivals.length && arrivals[0] < time - WINDOW) arrivals.shift();
  }

  /** Beats a minute at the far corner, from the gaps between recent arrivals; null until two have arrived. */
  function rate() {
    if (arrivals.length >= 2) {
      const gap = (arrivals[arrivals.length - 1] - arrivals[0]) / (arrivals.length - 1);
      return Math.round((60 * SPEED) / gap);
    }
    return time > WINDOW ? 0 : null;
  }

  /** What the sheet is doing, in words; spirals are counted every half time unit (it's the costly part). */
  function describe(s) {
    if (time - checkedAt > 0.5 || checkedAt < 0) {
      spirals = M.tips(field);
      checkedAt = time;
    }
    if (spirals) return t.status.spirals(spirals);
    if (s.pacemaker) {
      const r = rate();
      return r !== null && r < 50 ? t.status.blocked : t.status.steady;
    }
    return M.firing(field) ? t.status.waves : t.status.quiet;
  }

  /** Say a settled status once (after a second without change), so screen readers aren't flooded. */
  function report(s) {
    const now = describe(s);
    if (now !== status) {
      status = now;
      statusSince = time;
    } else if (status !== announced && time - statusSince > SPEED) {
      announced = status;
      W.announce(status);
    }
    $('scene-status').textContent = status;
    const r = rate();
    if ($('heart-rate')) {
      $('heart-rate').textContent = r === null ? '…' : t.rate(r);
      $('heart-meter').style.width = `${clamp(((r ?? 0) / 120) * 100, 0, 100)}%`;
    }
  }

  let buffer = null,
    image = null;

  /** Paint the sheet: resting cells dark, firing cells warm, recovering cells a fading blue. */
  function paint(ctx, f, width, height) {
    if (!buffer || buffer.width !== f.nx || buffer.height !== f.ny) {
      buffer = document.createElement('canvas');
      buffer.width = f.nx;
      buffer.height = f.ny;
      image = buffer.getContext('2d').createImageData(f.nx, f.ny);
    }
    const px = image.data,
      [r0, g0, b0] = COLOURS.rest,
      [r1, g1, b1] = COLOURS.firing,
      [r2, g2, b2] = COLOURS.recovering;
    for (let i = 0; i < f.u.length; i++) {
      const u = f.u[i],
        v = Math.min(1, f.v[i] * 1.25) * 0.85;
      const r = r0 + (r2 - r0) * v,
        g = g0 + (g2 - g0) * v,
        b = b0 + (b2 - b0) * v;
      const j = i * 4;
      px[j] = r + (r1 - r) * u;
      px[j + 1] = g + (g1 - g) * u;
      px[j + 2] = b + (b1 - b) * u;
      px[j + 3] = 255;
    }
    buffer.getContext('2d').putImageData(image, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(buffer, 0, 0, width, height);
  }

  function draw(ctx, s, stage) {
    ensure(s, stage);
    const { width, height } = stage;
    paint(ctx, field, width, height);
    // The pacemaker: a small ring that pulses as it fires.
    const pulse = s.pacemaker && beatShown >= 0 ? clamp(1 - (time - beatShown) / 1.2, 0, 1) : 0;
    ctx.lineWidth = 2;
    ctx.strokeStyle = s.pacemaker ? '#ffc9a3' : '#5d6878';
    ctx.beginPath();
    ctx.arc(PACE.x * width, PACE.y * height, 7 + pulse * 3, 0, TAU);
    ctx.stroke();
    // The far corner, where beats are counted: a small square.
    ctx.strokeStyle = '#a9d7f2';
    ctx.strokeRect(PROBE.x * width - 5, PROBE.y * height - 5, 10, 10);
    if (aim) {
      const x = aim.x * width,
        y = aim.y * height;
      ctx.strokeStyle = '#ddf6a3';
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, TAU);
      ctx.moveTo(x - 15, y);
      ctx.lineTo(x + 15, y);
      ctx.moveTo(x, y - 15);
      ctx.lineTo(x, y + 15);
      ctx.stroke();
    }
    report(s);
  }

  /** A still for the home card: a broken wave turned into two spirals, from a fixed start. */
  function preview(ctx, width, height) {
    const f = M.create(64, Math.max(24, Math.round((64 * height) / width)));
    M.stimulate(f, 0.5, 0.5, 3);
    M.step(f, 1.4, Math.round(CUT_AFTER / M.DT));
    M.cutTop(f);
    M.step(f, 1.4, Math.round(30 / M.DT));
    paint(ctx, f, width, height);
  }

  const redrawIfStill = (stage) => !stage.playing && stage.draw();

  W.defineRoom({
    id: 'heart',
    symbol: '↻',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'life',
    tagline: t.tagline,
    accent: { background: '#2c2126', border: '#f0a98a', color: '#ffd2b8' },

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
    connection: { ...t.connection, go: 'fingerprint' },

    defaults: { start: 0, recovery: 1, pacemaker: true },
    ranges: { start: [0, 2, 'integer'], recovery: [0.6, 1.6] },
    defaultPreset: 0,
    presets: [
      { settings: { start: 0, recovery: 1, pacemaker: true } },
      { settings: { start: 1, recovery: 1, pacemaker: true } },
      { settings: { start: 2, recovery: 1.6, pacemaker: true } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Wiener_Norbert',
        color: '#f0b89a',
        sketch: {
          hairStyle: 'receding',
          hair: '#6b5a4c',
          skin: '#eac3a0',
          glasses: 'round',
          beard: 'goatee',
          backdrop: '#2c2126',
        },
      },
      {
        ...t.guests[1],
        color: '#a9d7f2',
        sketch: { hairStyle: 'short', hair: '#8a6a4a', skin: '#f0cba9', beard: 'full', backdrop: '#1f2c36' },
      },
    ],

    insight: t.insight,

    controls: (s, stage) =>
      stage.slider('recovery', t.recovery, 0.6, 1.6, 0.1, s.recovery, '×', t.recoveryHint) +
      stage.check('pacemaker', t.pacemaker, s.pacemaker) +
      `<div class="wide readout">${t.rateLabel} <strong id="heart-rate">…</strong>` +
      `<div class="meter"><span id="heart-meter"></span></div><p>${t.pacemakerRate}</p></div>`,

    enter(s, stage) {
      aim = null;
      stroke = null;
      ensure(s, stage);
    },
    step(dt, s, stage) {
      ensure(s, stage);
      carry += (dt * SPEED) / M.DT;
      const steps = Math.floor(carry);
      carry -= steps;
      advance(s, Math.min(steps, 12));
    },
    draw,
    preview,
    action(s, stage) {
      ensure(s, stage);
      breakWave();
      redrawIfStill(stage);
    },
    reset(s, stage) {
      seed(s, stage);
      stage.draw();
    },
    onPreset(s, stage) {
      seed(s, stage);
      stage.draw();
    },

    pointer: {
      drag: true, // wiping works anywhere on the sheet, so touches there don't scroll the page
      down(p) {
        stroke = { start: p, last: p, wiped: false };
      },
      move(p, { dragging }, s, stage) {
        if (!stroke || !dragging) return;
        if (!stroke.wiped && Math.hypot(p.x - stroke.start.x, p.y - stroke.start.y) < 0.025) return;
        stroke.wiped = true;
        M.wipe(field, stroke.last.x, stroke.last.y, p.x, p.y, 3);
        stroke.last = p;
        redrawIfStill(stage);
      },
      up() {
        // A press that didn't wipe was a tap: start a wave there.
        if (stroke && !stroke.wiped && field) {
          M.stimulate(field, stroke.start.x, stroke.start.y, 4);
          redrawIfStill(W.stage);
        }
        stroke = null;
      },
      escape: () => (aim = null),
      arrow(dx, dy) {
        aim ??= { x: 0.5, y: 0.5 };
        aim = { x: clamp(aim.x + dx * 0.04, 0.02, 0.98), y: clamp(aim.y + dy * 0.05, 0.02, 0.98) };
      },
      key(e) {
        if (!field) return false;
        aim ??= { x: 0.5, y: 0.5 };
        if (e.key === 'Enter') {
          M.stimulate(field, aim.x, aim.y, 4);
          return true;
        }
        if (e.key === 'Delete' || e.key === 'Backspace') {
          M.wipe(field, aim.x, aim.y - 0.15, aim.x, aim.y + 0.15, 3);
          return true;
        }
        return false;
      },
    },
  });
})();
