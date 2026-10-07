/* Room · The sunflower's secret angle: Vogel's flower head, the golden angle, and arms in Fibonacci numbers. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, TAU, clamp } = W;
  const M = W.models.sunflower;
  const t = W.text('sunflower');
  const reduced = W.prefersReducedMotion();

  const SEEDS = 1000;
  const GROW = 3.2; // seconds for a head to grow
  const START = 137.508; // the golden angle, to the slider's three decimals
  const RING = 0.92; // where the arms are counted until the visitor taps: near the rim
  const GLIDE = 1.4; // seconds to turn the dial from one stop of the opening to the next
  // The opening, played once: the golden angle, a tenth of a degree more, three eighths of a turn, and back.
  const TOUR = [
    { angle: START, hold: 1.6 },
    { angle: 137.6, hold: 2.6 },
    { angle: 135, hold: 2.6 },
    { angle: START, hold: 0.8 },
  ];
  const COLOURS = { anticlockwise: '#ff8fb3', clockwise: '#7fd3ff', spoke: '#fff0b0' };
  const ARROW = { anticlockwise: '↺', clockwise: '↻', spoke: '' };
  // Seed colours from the middle of the head to its rim.
  const SHADES = ['#d8d77a', '#e2bd52', '#dc9a38', '#c97a2b', '#ad6125'];

  let grown = SEEDS, // seeds shown so far
    growing = false,
    growClock = 0,
    tour = null, // { leg, gliding, time } while the opening plays
    opened = false;

  const number = (value, digits = 3) =>
    new Intl.NumberFormat(W.numberLocale, { maximumFractionDigits: digits, useGrouping: false }).format(value);
  const degrees = (value) => t.labels.degrees(number(value));

  /** Where things go on a canvas of this size: a column for the words on wide canvases, the flower beside it. */
  function layout(width, height, words = true) {
    const wide = words && width > height * 1.1;
    const pad = Math.max(8, Math.min(width, height) * 0.025);
    const column = wide ? Math.min(width * 0.3, Math.max(72, width - height * 1.02)) : 0;
    const outer = Math.max(20, Math.min(height * 0.47 - pad / 2, (width - column) / 2 - pad)); // the petals' tips
    return {
      wide,
      pad,
      column,
      outer,
      disc: outer / 1.17, // the seeds' rim
      cx: column + (width - column) / 2,
      cy: height * 0.485, // a little above the middle: the bottom of a laptop's picture is below the fold
    };
  }

  let spanCache = null;
  /**
   * The families of arms counted at the ring, each with the seeds from which to which it is still seen
   * ({ family, offset, from, to }), worked out once for each angle and ring.
   */
  function spans(angle, ring) {
    if (spanCache && spanCache.angle === angle && spanCache.ring === ring) return spanCache.list;
    const start = Math.max(12, Math.round(ring * ring * SEEDS));
    const step = Math.max(4, Math.round(start * 0.03));
    const has = (n, f) => M.pattern(n, angle).arms.some((g) => g.family === f.family && g.offset === f.offset);
    const list = M.pattern(start, angle).arms.map((f) => {
      let from = start,
        to = start;
      while (from - step >= 1 && has(from - step, f)) from -= step;
      while (to < SEEDS && has(Math.min(SEEDS, to + step), f)) to = Math.min(SEEDS, to + step);
      return { family: f.family, offset: f.offset, from, to: Math.min(SEEDS, to + f.offset) };
    });
    spanCache = { angle, ring, list };
    return list;
  }

  /** What the eye sees where the arms are counted: the pattern there, as the model names it. */
  function seen(s) {
    const n = Math.max(12, Math.round((s.arms ? s.ring : RING) ** 2 * SEEDS));
    const p = M.pattern(n, s.angle);
    return { ...p, arms: [...p.arms].sort((a, b) => a.offset - b.offset) };
  }

  function statusText(s) {
    if (growing) return t.status.growing(grown);
    const p = seen(s);
    if (p.kind === 'spokes') return t.status.spokes(p.count);
    if (p.kind === 'gaps') return t.status.gaps(p.count);
    const [a, b] = p.arms;
    return b ? t.status.packed(a.offset, b.offset) : t.status.gaps(a.offset);
  }

  /** Draw `text` no wider than `maxWidth`, shrinking the font down to 9 px; skip it if it still doesn't fit. */
  function fitText(ctx, text, x, y, maxWidth, size, weight = 600) {
    for (let px = size; px >= 9; px--) {
      ctx.font = `${weight} ${px}px system-ui`;
      if (ctx.measureText(text).width <= maxWidth) {
        ctx.fillText(text, x, y);
        return px;
      }
    }
    return 0;
  }

  /** Draw `text` in lines no wider than `maxWidth`, breaking between words; returns the last line's baseline. */
  function wrapText(ctx, text, x, y, maxWidth, size) {
    ctx.font = `500 ${size}px system-ui`;
    let line = '';
    for (const word of text.split(' ')) {
      const next = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(next).width > maxWidth) {
        fitText(ctx, line, x, y, maxWidth, size, 500);
        y += size * 1.25;
        line = word;
      } else line = next;
    }
    fitText(ctx, line, x, y, maxWidth, size, 500);
    return y;
  }

  function petals(ctx, cx, cy, rim, length) {
    for (const [count, turn, colour] of [
      [21, 0, '#c99a24'],
      [34, 0.5, '#f4c53f'],
    ]) {
      ctx.fillStyle = colour;
      const half = (TAU / count) * 0.42;
      for (let i = 0; i < count; i++) {
        const a = ((i + turn) / count) * TAU;
        const tip = rim + length * (count === 21 ? 0.86 : 1);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a - half) * rim * 0.96, cy - Math.sin(a - half) * rim * 0.96);
        ctx.quadraticCurveTo(
          cx + Math.cos(a - half * 0.9) * (rim + length * 0.7),
          cy - Math.sin(a - half * 0.9) * (rim + length * 0.7),
          cx + Math.cos(a) * tip,
          cy - Math.sin(a) * tip,
        );
        ctx.quadraticCurveTo(
          cx + Math.cos(a + half * 0.9) * (rim + length * 0.7),
          cy - Math.sin(a + half * 0.9) * (rim + length * 0.7),
          cx + Math.cos(a + half) * rim * 0.96,
          cy - Math.sin(a + half) * rim * 0.96,
        );
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  /** A small dial: the turn from one seed to the next, as a wedge of a full circle. */
  function dial(ctx, x, y, r, angle) {
    ctx.strokeStyle = '#3c4656';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.stroke();
    ctx.fillStyle = 'rgba(244,197,63,0.28)';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, r, 0, -(angle / 360) * TAU, true);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#f4c53f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x + Math.cos((angle / 360) * TAU) * r, y - Math.sin((angle / 360) * TAU) * r);
    ctx.stroke();
    for (const [a, fill] of [
      [0, '#ad6125'],
      [angle, '#fff0b0'],
    ]) {
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(x + Math.cos((a / 360) * TAU) * r, y - Math.sin((a / 360) * TAU) * r, 3.5, 0, TAU);
      ctx.fill();
    }
  }

  /**
   * The whole picture: the flower head (petals, seeds, and the arms when they're shown) and, on wide canvases, a
   * column with the turn, its name, a dial and the Fibonacci numbers. Shared by the live room and the map's picture.
   */
  function scene(ctx, width, height, view) {
    const { angle, count, showArms, ring, words } = view;
    const L = layout(width, height, !!words);
    ctx.direction = 'ltr'; // numbers and degrees read left to right, on right-to-left pages too
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    const glow = ctx.createRadialGradient(L.cx, L.cy, 0, L.cx, L.cy, L.outer * 1.25);
    glow.addColorStop(0, 'rgba(70,52,16,0.55)');
    glow.addColorStop(1, 'rgba(10,14,21,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    // The head grows outwards with its seeds, so its rim is where the newest seed is.
    const c = L.disc / Math.sqrt(SEEDS); // the distance of seed n is c·√n
    const rim = c * Math.sqrt(Math.max(count, 1));
    if (count > 0) petals(ctx, L.cx, L.cy, rim, (L.outer - L.disc) * (rim / L.disc));
    ctx.fillStyle = 'rgba(32,22,10,0.92)';
    ctx.beginPath();
    ctx.arc(L.cx, L.cy, rim * 1.01 + c * 0.4, 0, TAU);
    ctx.fill();

    const at = (n) => {
      const [x, y] = M.seed(n, angle);
      return [L.cx + x * c, L.cy - y * c];
    };
    const dot = Math.max(1, c * 0.54);
    for (let shade = 0; shade < SHADES.length; shade++) {
      ctx.fillStyle = SHADES[shade];
      ctx.globalAlpha = showArms ? 0.55 : 1;
      ctx.beginPath();
      const from = Math.floor(((shade / SHADES.length) ** 2 * SEEDS) | 0) + 1,
        to = Math.min(count, Math.floor(((shade + 1) / SHADES.length) ** 2 * SEEDS));
      for (let n = from; n <= to; n++) {
        const [x, y] = at(n);
        ctx.moveTo(x + dot, y);
        ctx.arc(x, y, dot, 0, TAU);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // While it grows: the newest seed, and the line from the centre that it was turned along.
    if (view.growing && count > 1) {
      const [x, y] = at(count);
      ctx.strokeStyle = 'rgba(255,240,176,0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(L.cx, L.cy);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.fillStyle = '#fff6d0';
      ctx.beginPath();
      ctx.arc(x, y, dot * 1.6, 0, TAU);
      ctx.fill();
    }

    let counted = null;
    if (showArms && count > 20) {
      counted = view.pattern;
      // Each family counted at the ring, drawn as far in and out as the eye still sees it: long arms that cross.
      ctx.lineWidth = Math.max(1.2, c * 0.3);
      ctx.lineCap = 'round';
      for (const f of spans(angle, ring)) {
        ctx.strokeStyle = COLOURS[f.family];
        ctx.beginPath();
        for (let n = f.from; n + f.offset <= Math.min(count, f.to); n++) {
          const [x1, y1] = at(n),
            [x2, y2] = at(n + f.offset);
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
        ctx.stroke();
      }
      // The ring where the arms are counted, and the counts on it.
      const r = ring * L.disc;
      ctx.setLineDash([4, 5]);
      ctx.strokeStyle = 'rgba(255,255,255,0.75)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(L.cx, L.cy, r, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);
      const size = Math.round(clamp(L.outer * 0.075, 12, 22));
      ctx.font = `700 ${size}px system-ui`;
      const tags = counted.arms.map((f) => ({ text: `${f.offset}${ARROW[f.family] ? ' ' + ARROW[f.family] : ''}`, f }));
      const widths = tags.map((g) => ctx.measureText(g.text).width + size * 0.9);
      const total = widths.reduce((a, b) => a + b, 0) + (tags.length - 1) * 6;
      let x = L.cx - total / 2;
      const y = clamp(L.cy - r, size, height - size);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      tags.forEach((g, i) => {
        ctx.fillStyle = 'rgba(10,14,21,0.86)';
        ctx.beginPath();
        ctx.roundRect(x, y - size * 0.8, widths[i], size * 1.6, size * 0.8);
        ctx.fill();
        ctx.fillStyle = COLOURS[g.f.family];
        ctx.fillText(g.text, x + widths[i] / 2, y + 1);
        x += widths[i] + 6;
      });
      ctx.textBaseline = 'alphabetic';
    }

    if (!words || !L.wide) return;
    // The column: the turn, its name when it has one, a dial, and the Fibonacci numbers while arms are counted.
    const x = L.pad * 1.4,
      w = L.column - L.pad * 2;
    ctx.textAlign = 'left';
    let y = L.pad + Math.max(20, Math.min(40, w * 0.24));
    ctx.fillStyle = '#fbe9b0';
    fitText(ctx, degrees(angle), x, y, w, Math.round(clamp(w * 0.24, 14, 38)), 700);
    const name = Math.abs(angle - M.GOLDEN) < 0.001 ? t.labels.golden : null;
    const part = M.fraction(angle);
    const caption = name || (part ? t.labels.ofTurn(part.p, part.q) : '');
    const small = Math.round(clamp(w * 0.085, 10, 15));
    if (caption) {
      ctx.fillStyle = '#c9b98a';
      y = wrapText(ctx, caption, x, y + small + 8, w, Math.max(11, small));
    }
    y += small * 0.8;
    const r = Math.min(w * 0.32, 46, height * 0.09);
    if (r >= 14 && height > 240) {
      dial(ctx, x + r + 2, y + r + 8, r, angle);
      y += r * 2 + 16;
    }
    if (!counted || height < 260) return;
    const fibs = M.FIBONACCI.slice(1, 12); // 1, 2, 3, 5 … 144
    const line = Math.min(small * 1.5, (height - y - L.pad * 2) / (fibs.length + 1.5));
    if (line < 10) return;
    y += line;
    ctx.fillStyle = '#93a0b4';
    fitText(ctx, words.fibonacci, x, y, w, Math.round(Math.min(small, line * 0.8)), 500);
    const shown = new Map(counted.arms.map((f) => [f.offset, f.family]));
    ctx.font = `600 ${Math.round(Math.min(small, line * 0.8))}px system-ui`;
    for (const f of fibs) {
      y += line;
      const family = shown.get(f);
      ctx.fillStyle = family ? COLOURS[family] : '#56627a';
      ctx.fillText(family ? `${f} ${ARROW[family]}`.trim() : String(f), x + 6, y);
    }
  }

  /** Write text only when it changed. */
  function put(id, text) {
    const el = $(id);
    if (el && el.textContent !== text) el.textContent = text;
  }

  function readouts(s) {
    put('scene-status', statusText(s));
  }

  /** Turn the dial: the setting, its slider and the preset highlight. */
  function setAngle(s, stage, value, chosen = -1) {
    s.angle = Math.round(clamp(value, 0, 180) * 1000) / 1000;
    const input = $('c-angle');
    if (input) input.value = s.angle;
    stage.setChosen(chosen);
    stage.sync();
  }

  function showArms(s, value) {
    s.arms = value;
    const box = document.querySelector('#scene-controls [data-check="arms"]');
    if (box) box.checked = value;
  }

  /** Grow the head seed by seed, or all at once when nothing moves. */
  function grow(stage) {
    if (reduced || !stage.playing) {
      grown = SEEDS;
      growing = false;
    } else {
      grown = 0;
      growClock = 0;
      growing = true;
    }
  }

  const stopTour = () => (tour = null);

  function startTour(s, stage) {
    grow(stage);
    tour = growing ? { leg: 0, gliding: false, time: 0 } : null;
  }

  function advanceTour(dt, s, stage) {
    tour.time += dt;
    const here = TOUR[tour.leg];
    if (!tour.gliding) {
      if (tour.time < here.hold) return;
      if (tour.leg === TOUR.length - 1) {
        tour = null;
        showArms(s, true);
        s.ring = RING;
        W.announce(statusText(s));
        return;
      }
      tour.gliding = true;
      tour.time = 0;
    }
    const next = TOUR[tour.leg + 1];
    const u = Math.min(1, tour.time / GLIDE);
    const eased = u * u * (3 - 2 * u);
    const preset = u === 1 ? [START, 137.6, 135].indexOf(next.angle) : -1;
    setAngle(s, stage, here.angle + (next.angle - here.angle) * eased, preset);
    if (u === 1) tour = { leg: tour.leg + 1, gliding: false, time: 0 };
  }

  W.defineRoom({
    id: 'sunflower',
    symbol: '✿',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'life',
    added: '2026-10-07',
    tagline: t.tagline,
    accent: { background: '#2a2310', border: '#f4c53f', color: '#fbe9b0' },

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

    defaults: { angle: START, arms: false, ring: RING },
    ranges: { angle: [0, 180], ring: [0.15, 1] },
    defaultPreset: 0,
    presets: [{ settings: { angle: START } }, { settings: { angle: 137.6 } }, { settings: { angle: 135 } }].map(
      (p, i) => ({ ...t.presets[i], ...p }),
    ),

    guests: [
      {
        ...t.guests[0],
        bio: 'Fibonacci',
        color: '#f4c53f',
        sketch: { hairStyle: 'long', hair: '#3b2a1e', skin: '#e9c39d', backdrop: '#2a2310' },
      },
      {
        ...t.guests[1],
        bio: 'Turing',
        image: 'turing.jpg',
        source: 'Alan_Turing_(1951).jpg',
        color: '#b6c8eb',
        frame: [115, -28, -21],
      },
    ],

    insight: t.insight,

    controls: (s, stage) =>
      stage.slider('angle', t.angle, 0, 180, 0.001, s.angle, '°') +
      `<div class="control wide sunflower-nudge" role="group" aria-label="${t.nudgeGroup}" dir="ltr">` +
      [-0.1, -0.01, 0.01, 0.1]
        .map((step) => {
          const size = degrees(Math.abs(step));
          const label = step < 0 ? t.less(size) : t.more(size);
          return `<button type="button" class="button" data-nudge="${step}" aria-label="${label}">${step < 0 ? '−' : '+'}${size}</button>`;
        })
        .join('') +
      `</div>` +
      stage.check('arms', t.arms, s.arms),

    bindControls(panel, s, stage) {
      panel.querySelectorAll('[data-nudge]').forEach((button) =>
        button.addEventListener('click', () => {
          stopTour();
          setAngle(s, stage, s.angle + Number(button.dataset.nudge));
          stage.draw();
          W.announce(statusText(s));
        }),
      );
      panel.querySelector('[data-check="arms"]').addEventListener('change', () => {
        stopTour();
        readouts(s);
        stage.draw();
      });
    },
    readouts,

    preview(ctx, width, height) {
      scene(ctx, width, height, { angle: M.GOLDEN, count: SEEDS, showArms: false, ring: RING, words: null });
    },

    enter(s, stage) {
      if (!opened) {
        opened = true;
        // The opening plays only for a first visit with the room's own settings, not for a shared link.
        if (s.angle === START && !s.arms) startTour(s, stage);
      }
      readouts(s);
      stage.draw();
    },
    step(dt, s, stage) {
      if (growing) {
        growClock += dt;
        const u = Math.min(1, growClock / GROW);
        grown = Math.max(1, Math.round(SEEDS * u * u));
        if (u === 1) growing = false;
      } else if (tour) advanceTour(dt, s, stage);
      readouts(s);
    },
    draw(ctx, s, stage) {
      scene(ctx, stage.width, stage.height, {
        angle: s.angle,
        count: grown,
        growing,
        showArms: s.arms && !growing,
        ring: s.ring,
        pattern: seen(s),
        words: t.labels,
      });
    },
    action(s, stage) {
      stopTour();
      grow(stage);
      readouts(s);
      stage.draw();
    },
    reset(s, stage) {
      Object.assign(s, { angle: START, arms: false, ring: RING });
      stage.setChosen(0);
      stage.refresh();
      startTour(s, stage);
      readouts(s);
      stage.draw();
    },
    onPreset() {
      stopTour();
    },
    onInput(s) {
      stopTour();
      readouts(s);
    },
    pointer: {
      down(p, s, stage) {
        const L = layout(stage.width, stage.height);
        const distance = Math.hypot(p.x * stage.width - L.cx, p.y * stage.height - L.cy);
        if (distance > L.outer) return;
        stopTour();
        s.ring = Math.round(clamp(distance / L.disc, 0.15, 1) * 100) / 100;
        showArms(s, true);
        readouts(s);
        stage.draw();
        W.announce(statusText(s));
      },
      arrow(dx, dy, s, stage) {
        stopTour();
        setAngle(s, stage, s.angle + dx * 0.01 - dy * 0.1);
      },
    },
  });
})();
