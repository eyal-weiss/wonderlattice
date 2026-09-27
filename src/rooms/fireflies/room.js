/* Room · A body full of clocks: fireflies that fall into step (coupled oscillators). */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, TAU } = W;
  const M = W.models.fireflies;
  const t = W.text('fireflies');

  const COUNT = 120;
  const HISTORY = 200; // samples of togetherness kept, one every 0.1 s: the last 20 seconds

  let clocks = [],
    seedCount = 7,
    time = 0, // simulated seconds, advanced only while playing
    shift = 0, // how far flights have moved the day–night cycle
    flight = null, // { start, done } since the last flight
    history = [],
    sinceSample = 0,
    together = false, // for announcing changes once
    sprite = null;

  function fresh(seed = 7) {
    seedCount = seed;
    clocks = M.seed(COUNT, seed);
    history = [];
    sinceSample = 0;
    together = false;
  }

  /** A soft round glow, drawn once and reused for every firefly (cheap on phones). */
  function glowSprite(size) {
    if (sprite && sprite.width === size) return sprite;
    sprite = document.createElement('canvas');
    sprite.width = sprite.height = size;
    const g = sprite.getContext('2d');
    const r = size / 2;
    const gradient = g.createRadialGradient(r, r, 0, r, r, r);
    gradient.addColorStop(0, 'rgba(246,255,196,0.95)');
    gradient.addColorStop(0.18, 'rgba(226,250,150,0.55)');
    gradient.addColorStop(0.5, 'rgba(190,235,110,0.14)');
    gradient.addColorStop(1, 'rgba(160,220,90,0)');
    g.fillStyle = gradient;
    g.fillRect(0, 0, size, size);
    return sprite;
  }

  /** Grass along the bottom, the same every frame (a fixed pseudo-random sequence). */
  function grass(ctx, x0, w, bottom, height) {
    let s = 3;
    const rand = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
    ctx.fillStyle = '#0d1a14';
    ctx.beginPath();
    ctx.moveTo(x0, bottom);
    for (let x = x0; x <= x0 + w; x += 5) {
      const h = height * (0.35 + rand() * 0.65);
      ctx.lineTo(x + 2, bottom - h);
      ctx.lineTo(x + 5, bottom);
    }
    ctx.closePath();
    ctx.fill();
  }

  /** Draw `text` no wider than `maxWidth`, shrinking the font down to 9 px; skip it if it still doesn't fit. */
  function fitText(ctx, text, x, y, maxWidth, size, weight = 600) {
    for (let s = size; s >= 9; s--) {
      ctx.font = `${weight} ${s}px system-ui`;
      if (ctx.measureText(text).width <= maxWidth) {
        ctx.fillText(text, x, y);
        return ctx.measureText(text).width;
      }
    }
    return 0;
  }

  /**
   * The whole picture: a meadow of fireflies (left, or all of a narrow canvas), everyone's rhythm on a circle,
   * and togetherness over time. Shared by the live room and the home-card preview.
   */
  function scene(ctx, width, height, view) {
    const { clocks: list, sun, showCircle, clock, samples } = view;
    const wide = width > height * 1.25;
    const sideW = showCircle && wide ? Math.min(width * 0.32, height * 0.72) : 0;
    const fieldW = width - sideW;
    // Sky: a very gentle brightening at "day" when the cycle is on. Low contrast on purpose (no flashing).
    const day = sun === null ? 0 : (1 - Math.cos(sun)) / 2; // 0 at night (phase 0), 1 at midday
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, `rgb(${10 + day * 14},${16 + day * 18},${34 + day * 26})`);
    sky.addColorStop(1, '#0a0e15');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    // Fireflies: a dim body always, and a soft glow that rises and fades with the phase.
    const size = Math.round(Math.max(16, Math.min(56, Math.min(fieldW, height) * 0.11)));
    const glow = glowSprite(size);
    const top = height * 0.06,
      usable = height * 0.8;
    for (const k of list) {
      const x = (0.04 + 0.92 * k.x) * fieldW + Math.sin(clock * 0.3 + k.drift) * 6;
      const y = top + k.y * usable + Math.cos(clock * 0.23 + k.drift * 1.7) * 4;
      const g = M.glow(k.phase);
      ctx.fillStyle = `rgba(150,170,120,${0.35 + 0.4 * g})`;
      ctx.fillRect(x - 1, y - 1, 2, 2);
      if (g > 0.02) {
        ctx.globalAlpha = g;
        ctx.drawImage(glow, x - size / 2, y - size / 2);
        ctx.globalAlpha = 1;
      }
    }
    grass(ctx, 0, fieldW, height, height * 0.1);

    // Togetherness over time, along the bottom of the meadow (or under the circle when there is room).
    const { r, psi } = M.order(list);
    const chart = wide && showCircle ? { x: fieldW + 14, w: sideW - 28 } : { x: 14, w: fieldW - 28 };
    const chartH = Math.max(26, Math.min(56, height * 0.14));
    const chartY = height - chartH - 10;
    const small = Math.round(Math.max(10, Math.min(13, width / 60)));
    if (samples.length > 1 && chart.w > 60) {
      ctx.fillStyle = 'rgba(10,14,21,0.72)';
      ctx.fillRect(chart.x - 6, chartY - small - 8, chart.w + 12, chartH + small + 14);
      ctx.strokeStyle = '#2a3542';
      ctx.lineWidth = 1;
      ctx.strokeRect(chart.x, chartY, chart.w, chartH);
      ctx.strokeStyle = '#e8f7a8';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      samples.forEach((v, i) => {
        const x = chart.x + (chart.w * (i + HISTORY - samples.length)) / (HISTORY - 1);
        const y = chartY + chartH - v * chartH;
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      });
      ctx.stroke();
      // The percentage always shows; the title takes what room is left beside it.
      ctx.font = `600 ${small}px system-ui`;
      ctx.textAlign = 'right';
      ctx.fillStyle = '#e8f7a8';
      const pctW = ctx.measureText(t.percent(r)).width;
      ctx.fillText(t.percent(r), chart.x + chart.w, chartY - 5);
      ctx.textAlign = 'left';
      ctx.fillStyle = '#a7b4c6';
      fitText(ctx, t.labels.history, chart.x, chartY - 5, chart.w - pctW - 8, small);
    }

    // Everyone's rhythm: each firefly is a dot on a circle at its phase; the arrow is the crowd's average.
    if (showCircle) {
      const radius = wide ? Math.min(sideW * 0.36, height * 0.26) : Math.max(22, Math.min(width, height) * 0.13);
      const cx = wide ? fieldW + sideW / 2 : width - radius - 16,
        cy = wide ? height * 0.36 : radius + 22;
      ctx.fillStyle = 'rgba(10,14,21,0.72)';
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 14, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = '#3b4756';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, TAU);
      ctx.stroke();
      const at = (phase, rr) => [cx + Math.sin(phase) * rr, cy - Math.cos(phase) * rr]; // phase 0 at the top
      if (sun !== null) {
        const [mx, my] = at(sun, radius + 7);
        ctx.fillStyle = '#c9d6ff';
        ctx.beginPath();
        ctx.arc(mx, my, 4.5, 0, TAU);
        ctx.fill();
        ctx.fillStyle = 'rgba(10,14,21,1)';
        ctx.beginPath();
        ctx.arc(mx + 2, my - 1.5, 3.6, 0, TAU);
        ctx.fill();
      }
      for (const k of list) {
        const [x, y] = at(k.phase, radius);
        const g = M.glow(k.phase);
        ctx.fillStyle = g > 0.05 ? `rgba(240,255,180,${0.55 + 0.45 * g})` : 'rgba(170,190,140,0.55)';
        ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
      }
      const [ax, ay] = at(psi, radius * r);
      ctx.strokeStyle = '#e8f7a8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ax, ay);
      ctx.stroke();
      if (wide) {
        ctx.fillStyle = '#a7b4c6';
        ctx.textAlign = 'center';
        fitText(ctx, t.labels.rhythm, cx, cy - radius - 20, sideW - 12, small);
      }
    }
  }

  /** Write text only when it changed, so the readouts cost nothing on most frames. */
  function put(id, text) {
    const el = $(id);
    if (el && el.textContent !== text) el.textContent = text;
  }

  function readouts(s, r = M.order(clocks).r) {
    const state = r > 0.8 ? 'together' : r > 0.35 ? 'stirring' : 'apart';
    let status = t.status[state];
    if (s.sun && flight) status = flight.done ? t.caughtUp(flight.done) : t.flying(dayOf());
    put('scene-status', status);
    put('fireflies-together', t.percent(r));
    const meter = $('fireflies-meter'),
      width = Math.round(r * 100) + '%';
    if (meter && meter.style.width !== width) meter.style.width = width;
    const fly = $('fireflies-fly');
    if (fly && fly.disabled === s.sun) fly.disabled = !s.sun;
  }

  /** Whole days since the last flight, counting the day of the flight as day 1. */
  const dayOf = () => (flight ? Math.floor((time - flight.start) * M.MEAN) + 1 : 0);

  W.defineRoom({
    id: 'fireflies',
    symbol: '✺',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'life',
    tagline: t.tagline,
    accent: { background: '#232a17', border: '#d4ec8a', color: '#eef8c8' },

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
    connection: { ...t.connection, go: 'flock' },

    defaults: { coupling: 0, sun: false, circle: true },
    ranges: { coupling: [0, 3] },
    defaultPreset: 0,
    presets: [
      { settings: { coupling: 0, sun: false } },
      { settings: { coupling: 1.2, sun: false } },
      { settings: { coupling: 1.5, sun: true } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Huygens',
        color: '#d4ec8a',
        sketch: { hairStyle: 'wig', hair: '#3a2a1c', skin: '#efcfae', moustache: true, backdrop: '#232a17' },
      },
      {
        ...t.guests[1],
        color: '#a9c6f0',
        sketch: { hairStyle: 'short', hair: '#6b4f36', skin: '#f0cfae', beard: 'short', backdrop: '#1c2635' },
      },
    ],

    insight: t.insight,

    controls: (s, stage) =>
      stage.slider('coupling', t.coupling, 0, 3, 0.05, s.coupling, '', t.couplingHint) +
      stage.check('sun', t.sun, s.sun) +
      stage.check('circle', t.circle, s.circle) +
      `<div class="control wide"><button type="button" class="button" id="fireflies-fly">${t.fly}</button></div>` +
      `<div class="wide readout">${t.together} <span id="fireflies-together"></span><div class="meter"><span id="fireflies-meter"></span></div></div>`,

    bindControls(panel, s) {
      $('fireflies-fly').addEventListener('click', () => {
        if (!s.sun) return;
        shift += M.FLIGHT;
        flight = { start: time, done: 0 };
        readouts(s);
      });
      panel.querySelector('[data-check="sun"]')?.addEventListener('change', () => {
        flight = null;
        readouts(s);
      });
    },
    readouts,

    preview(ctx, width, height) {
      let still = M.seed(90, 3);
      for (let i = 0; i < 300; i++) still = M.step(still, 1 / 30, 1.4);
      // Stop a little before the shared flash, so many fireflies glow at once.
      const { psi } = M.order(still);
      still = still.map((k) => ({ ...k, phase: k.phase - psi - 0.12 }));
      scene(ctx, width, height, { clocks: still, sun: null, showCircle: false, clock: 0, samples: [] });
    },

    enter(s, stage) {
      if (!clocks.length) fresh();
      stage.draw();
    },
    step(dt, s) {
      const h = Math.min(dt, 0.1);
      time += h;
      const sun = s.sun ? M.sunPhase(time, shift) : null;
      clocks = M.step(clocks, h, s.coupling, sun);
      const { r } = M.order(clocks);
      sinceSample += h;
      if (sinceSample >= 0.1) {
        sinceSample = 0;
        history.push(r);
        if (history.length > HISTORY) history.shift();
      }
      // Say it once when the meadow falls into step, and once when it falls apart again.
      if (!together && r > 0.8) {
        together = true;
        W.announce(t.announceTogether);
      } else if (together && r < 0.35) {
        together = false;
        W.announce(t.announceApart);
      }
      if (s.sun && flight && !flight.done && time - flight.start > 0.5) {
        if (Math.abs(M.lag(clocks, sun)) < 0.3) {
          flight.done = dayOf();
          W.announce(t.caughtUp(flight.done));
        }
      }
      readouts(s, r);
    },
    draw(ctx, s, stage) {
      scene(ctx, stage.width, stage.height, {
        clocks,
        sun: s.sun ? M.sunPhase(time, shift) : null,
        showCircle: s.circle,
        clock: time,
        samples: history,
      });
    },
    action(s, stage) {
      fresh(seedCount + 1);
      stage.draw();
    },
    reset(s, stage) {
      fresh();
      time = 0;
      shift = 0;
      flight = null;
      stage.draw();
    },
    onPreset(s, stage) {
      fresh(seedCount + 1);
      flight = null;
      stage.draw();
    },
  });
})();
