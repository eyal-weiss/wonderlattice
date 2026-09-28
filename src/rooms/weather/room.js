/* Room · Weather twins: nearly identical starts in Lorenz's butterfly fly together, then part. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, TAU, clamp } = W;
  const M = W.models.weather;
  const t = W.text('weather');
  const reduced = W.prefersReducedMotion();

  const RATE = 1.2; // model time ("days") per second at speed 1
  const DAYS = 36; // the chart's width; the run starts over after this
  const TRAIL = 150; // points kept behind each twin (every other step): about one and a half days
  const TRUTH = '#fff1c4';
  const twinColour = (i) => `hsl(${(196 + 137 * i) % 360}, 85%, 68%)`;

  // View rotation, and the running forecast.
  let rx = -0.2,
    ry = 0.1;
  let points = [],
    trails = [],
    history = [],
    time = 0,
    lostAt = null,
    loops = 0,
    stepCount = 0,
    key = '';
  let butterflyCache = null;
  const butterfly = () => (butterflyCache ??= M.butterfly(4500, 0.01)); // 45 days of smooth outline, drawn only when the view turns

  const TURN_STEP = 0.26;
  const TURNS = [
    ['left', '↺', 'turnLeft', -1, 0],
    ['right', '↻', 'turnRight', 1, 0],
    ['up', '↑', 'tiltUp', 0, -1],
    ['down', '↓', 'tiltDown', 0, 1],
  ];

  const keyOf = (s) => `${s.digits}|${s.twins}|${s.seed}|${loops}`;
  const spread = () => Math.max(0, ...points.slice(1).map((p) => M.distance(p, points[0])));

  /** Release the twins again: the start, measured to s.digits places. */
  function restart(s) {
    key = keyOf(s);
    points = M.twins(M.START, s.digits, s.twins, s.seed + loops * 7919);
    trails = points.map((p) => [p]);
    history = [{ time: 0, d: spread() || 10 ** -s.digits }];
    time = 0;
    lostAt = null;
    stepCount = 0;
  }

  /** Run the forecast on by `span` days (in the model's own small steps). */
  function advance(s, span) {
    if (keyOf(s) !== key) restart(s);
    const end = time + span;
    while (time < end - 1e-9) {
      points = points.map((p) => M.step(p));
      time += M.STEP;
      if (++stepCount % 2 === 0)
        points.forEach((p, i) => {
          trails[i].push(p);
          if (trails[i].length > TRAIL) trails[i].shift();
        });
      if (stepCount % 10 === 0) {
        const d = spread();
        history.push({ time, d });
        if (lostAt === null && d > M.TOLERANCE) {
          lostAt = time;
          W.announce(t.announceLost(Math.round(lostAt)));
        }
      }
    }
  }

  function status() {
    const status = $('scene-status');
    if (status)
      status.textContent = lostAt === null ? t.statusTogether(Math.floor(time)) : t.statusParted(Math.round(lostAt));
    const held = $('weather-held');
    if (held) held.textContent = lostAt === null ? t.readout.notYet : t.days(Math.round(lostAt));
  }

  // The butterfly's faint outline is the costliest thing to draw, and it only changes when the view turns, so it
  // is drawn onto its own canvas and reused until the view has turned about half a degree.
  let outline = null;
  function drawOutline(ctx, view) {
    const scale = ctx.getTransform().a || 1;
    const { width, height } = ctx.canvas;
    const key = [
      Math.round(view.rx * 100),
      Math.round(view.ry * 100),
      view.cx,
      view.cy,
      view.scale,
      width,
      height,
    ].join();
    if (outline?.key !== key) {
      const canvas = outline?.canvas ?? document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const c = canvas.getContext('2d');
      c.setTransform(scale, 0, 0, scale, 0, 0);
      c.strokeStyle = 'rgba(150, 172, 214, 0.13)';
      c.lineWidth = 1;
      c.beginPath();
      butterfly().forEach((p, i) => {
        const q = M.project(p, view);
        i ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y);
      });
      c.stroke();
      outline = { key, canvas };
    }
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(outline.canvas, 0, 0);
    ctx.restore();
  }

  /** The 3D picture: the butterfly's outline, then each twin's recent path and where it is now. */
  function drawFlight(ctx, s, box) {
    const view = { rx, ry, cx: box.x + box.w / 2, cy: box.y + box.h / 2, scale: Math.min(box.w, box.h) * 0.36 };
    if (s.ghost) drawOutline(ctx, view);
    // Twins first, the truth on top. Each trail fades from its tail to its head in a few bands.
    const order = [...trails.keys()].slice(1).concat(0);
    for (const i of order) {
      const trail = trails[i];
      if (!trail?.length) continue;
      const colour = i === 0 ? TRUTH : twinColour(i);
      const projected = trail.map((p) => M.project(p, view));
      const bands = 3;
      ctx.strokeStyle = colour;
      ctx.lineWidth = i === 0 ? 2 : 1.4;
      for (let b = 0; b < bands; b++) {
        const from = Math.floor((projected.length * b) / bands),
          to = Math.min(projected.length - 1, Math.floor((projected.length * (b + 1)) / bands) + 1);
        if (to <= from) continue;
        ctx.globalAlpha = 0.15 + (0.85 * (b + 1)) / bands;
        ctx.beginPath();
        for (let k = from; k <= to; k++)
          (k === from ? ctx.moveTo : ctx.lineTo).call(ctx, projected[k].x, projected[k].y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      // A soft halo, then the head: cheaper than a canvas shadow, which slows phones.
      const head = projected.at(-1);
      ctx.fillStyle = colour;
      ctx.globalAlpha = 0.25;
      ctx.beginPath();
      ctx.arc(head.x, head.y, i === 0 ? 9 : 7, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(head.x, head.y, i === 0 ? 4 : 3, 0, TAU);
      ctx.fill();
    }
  }

  /** The distance between the twins, on a log scale: a straight climb means exponential growth. */
  function drawChart(ctx, s, box, small) {
    const lo = -12,
      hi = 2;
    const x = (time) => box.x + (clamp(time, 0, DAYS) / DAYS) * box.w;
    const y = (d) => box.y + box.h - ((clamp(Math.log10(Math.max(d, 1e-14)), lo, hi) - lo) / (hi - lo)) * box.h;
    ctx.fillStyle = 'rgba(20, 27, 36, 0.85)';
    ctx.fillRect(box.x, box.y, box.w, box.h);
    ctx.strokeStyle = 'rgba(120, 138, 160, 0.18)';
    ctx.lineWidth = 1;
    for (let e = lo + 2; e < hi; e += 2) {
      ctx.beginPath();
      ctx.moveTo(box.x, y(10 ** e));
      ctx.lineTo(box.x + box.w, y(10 ** e));
      ctx.stroke();
    }
    // The line where the forecast counts as lost.
    ctx.strokeStyle = '#f0a27a';
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(box.x, y(M.TOLERANCE));
    ctx.lineTo(box.x + box.w, y(M.TOLERANCE));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = TRUTH;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    history.forEach((h, i) => (i ? ctx.lineTo(x(h.time), y(h.d)) : ctx.moveTo(x(h.time), y(h.d))));
    ctx.stroke();
    if (lostAt !== null) {
      ctx.strokeStyle = 'rgba(240, 162, 122, 0.7)';
      ctx.beginPath();
      ctx.moveTo(x(lostAt), box.y);
      ctx.lineTo(x(lostAt), box.y + box.h);
      ctx.stroke();
    }
    if (box.h < 34) return;
    // Labels sit below the dashed line, clear of the climbing curve's usual path.
    ctx.font = `${small}px system-ui`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#f0a27a';
    ctx.fillText(t.lostLine, box.x + box.w - 6, y(M.TOLERANCE) + 3);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#98aab7';
    ctx.fillText(t.chartLabel, box.x + 6, box.y + box.h - 3);
    ctx.textBaseline = 'alphabetic';
  }

  function draw(ctx, s, stage) {
    const { width: cw, height: ch } = stage;
    if (keyOf(s) !== key) restart(s);
    // With reduced motion the flight doesn't move, so show one that has already parted.
    if (!stage.playing && time === 0) advance(s, 24);
    ctx.clearRect(0, 0, cw, ch);
    const small = Math.round(clamp(Math.min(cw, ch) / 30, 10, 13));
    const chartH = Math.max(46, Math.round(ch * 0.24));
    const pad = Math.max(8, Math.round(Math.min(cw, ch) * 0.03));
    drawFlight(ctx, s, { x: 0, y: small * 2, w: cw, h: ch - chartH - pad - small * 2 });
    drawChart(ctx, s, { x: pad, y: ch - chartH - pad, w: cw - 2 * pad, h: chartH }, small);
    // The day, large, in the corner.
    ctx.fillStyle = lostAt === null ? '#f4f5e9' : '#f0a27a';
    ctx.font = `600 ${small + 5}px system-ui`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(t.day(Math.floor(time)), pad, pad);
    ctx.textBaseline = 'alphabetic';
    status();
  }

  /** The home card: two twins that started together, already far apart. */
  function preview(ctx, width, height) {
    const view = { rx: -0.2, ry: 0.1, cx: width / 2, cy: height / 2, scale: Math.min(width, height) * 0.4 };
    ctx.strokeStyle = 'rgba(150, 172, 214, 0.14)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    butterfly().forEach((p, i) => {
      const q = M.project(p, view);
      i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y);
    });
    ctx.stroke();
    let pair = M.twins(M.START, 4, 1, 3);
    const paths = [[], []];
    for (let n = 0; n < 3400; n++) {
      pair = pair.map((p) => M.step(p));
      if (n > 2400 && n % 2 === 0) pair.forEach((p, i) => paths[i].push(M.project(p, view)));
    }
    paths.forEach((path, i) => {
      ctx.strokeStyle = i === 0 ? TRUTH : twinColour(1);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      path.forEach((q, k) => (k ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)));
      ctx.stroke();
    });
  }

  W.defineRoom({
    id: 'weather',
    symbol: '∞',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'signals',
    tagline: t.tagline,
    accent: { background: '#1b2130', border: '#9fb6e8', color: '#d6e2ff' },

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
    connection: { ...t.connection, go: 'fireflies' },

    defaults: { digits: 6, twins: 1, speed: 1, seed: 1, ghost: true, spin: true },
    ranges: { digits: [1, 12, 'integer'], twins: [1, 20, 'integer'], speed: [0.25, 2], seed: [1, 9999, 'integer'] },
    defaultPreset: 1,
    presets: [
      { badge: '3', settings: { digits: 3, twins: 1 } },
      { badge: '6', settings: { digits: 6, twins: 1 } },
      { badge: '20', settings: { digits: 6, twins: 20 } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Lorenz_Edward',
        color: '#9fb6e8',
        sketch: { hairStyle: 'receding', hair: '#8a8174', skin: '#edc9a8', glasses: 'square', backdrop: '#1f2636' },
      },
      {
        ...t.guests[1],
        bio: 'Poincare',
        color: '#f0c69f',
        sketch: {
          hairStyle: 'short',
          hair: '#3a2f28',
          skin: '#efcfb1',
          beard: 'full',
          glasses: 'round',
          backdrop: '#2b2520',
        },
      },
    ],

    insight: t.insight,

    controls: (s, stage) =>
      stage.slider('digits', t.digits, 1, 12, 1, s.digits, '', t.digitsHint) +
      stage.slider('twins', t.twins, 1, 20, 1, s.twins, '', t.twinsHint) +
      stage.slider('speed', t.speed, 0.25, 2, 0.05, s.speed, '×') +
      stage.check('ghost', t.ghost, s.ghost) +
      stage.check('spin', t.spin, s.spin) +
      `<div class="control wide"><span id="weather-turn-label" style="font-size:14px">${t.turn}</span>` +
      '<div class="segment" role="group" aria-labelledby="weather-turn-label">' +
      TURNS.map(
        ([id, symbol, label]) =>
          `<button type="button" id="weather-${id}" aria-label="${t[label]}" title="${t[label]}" style="font-size:17px;min-width:42px">${symbol}</button>`,
      ).join('') +
      '</div></div>' +
      '<div class="wide readout" id="weather-readout">' +
      `<div>${t.readout.held} <strong id="weather-held"></strong></div>` +
      `<div>${t.readout.rule} <strong>${t.days(Math.round((Math.LN10 / M.LAMBDA) * 10) / 10)}</strong></div></div>`,

    bindControls(panel, s, stage) {
      for (const [id, , , dx, dy] of TURNS)
        $('weather-' + id).addEventListener('click', () => {
          ry += dx * TURN_STEP;
          rx += dy * TURN_STEP;
          stage.draw();
        });
    },

    readouts: () => status(),

    step(dt, s, stage) {
      if (s.spin && !stage.dragging) ry += dt * 0.12;
      if (time >= DAYS) loops++;
      advance(s, Math.min(dt, 0.1) * RATE * s.speed);
    },
    draw,
    preview,
    action(s, stage) {
      loops++;
      restart(s);
      if (!stage.playing) advance(s, 24);
      stage.draw();
    },
    reset(s, stage) {
      loops = 0;
      rx = -0.2;
      ry = 0.1;
      restart(s);
      if (reduced || !stage.playing) advance(s, 24);
    },
    onPreset(s) {
      loops = 0;
      restart(s);
    },

    pointer: {
      drag: true, // drags anywhere on the canvas, so touches there don't scroll the page
      move(p, { dragging, dx, dy }, s, stage) {
        if (!dragging) return;
        ry += dx * 0.009;
        rx = clamp(rx + dy * 0.009, -1.5, 1.5);
        stage.draw();
      },
      arrow(dx, dy) {
        ry += dx * 0.13;
        rx = clamp(rx + dy * 0.13, -1.5, 1.5);
      },
      key(e, s, stage) {
        if (e.key !== 'Enter') return false;
        loops++;
        restart(s);
        stage.draw();
        return true;
      },
    },

    /** Saved moments also keep the viewing angle. */
    extraSettings: () => ({ rx, ry }),
    restore(saved) {
      rx = Number.isFinite(saved.rx) && Math.abs(saved.rx) < 2 ? saved.rx : -0.2;
      ry = Number.isFinite(saved.ry) && Math.abs(saved.ry) < 1000 ? saved.ry : 0.1;
    },
  });
})();
