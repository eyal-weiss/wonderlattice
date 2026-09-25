/* Room · A mind of many: a flock that emerges from local rules. */
(() => {
  'use strict';

  const W = Wonderloom;
  const { $, TAU, clamp } = W;
  const model = W.models.flock;
  const t = W.text('flock');

  let birds = [],
    point = null, // the visitor's attractor/repeller, in unit coordinates
    order = 0;

  function seedFlock(s, stage) {
    birds = model.seed(s.count);
    stage.clear();
  }

  function draw(ctx, s, stage) {
    const { width: cw, height: ch, clock } = stage;
    ctx.fillStyle = s.trails && stage.playing ? 'rgba(10,14,21,0.20)' : '#0a0e15';
    ctx.fillRect(0, 0, cw, ch);
    if (point) {
      ctx.strokeStyle = s.attract ? '#ddf6a37a' : '#ffae9d8a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(point.x * cw, point.y * ch, 18 + Math.sin(clock * 3) * 3, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(point.x * cw - 6, point.y * ch);
      ctx.lineTo(point.x * cw + 6, point.y * ch);
      if (s.attract) {
        ctx.moveTo(point.x * cw, point.y * ch - 6);
        ctx.lineTo(point.x * cw, point.y * ch + 6);
      }
      ctx.stroke();
    }
    if (s.neighbors && birds[0]) {
      const b = birds[0];
      ctx.strokeStyle = '#accba259';
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.arc(b.x * cw, b.y * ch, model.SIGHT * ch, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);
      for (const o of birds.slice(1)) {
        const dx = (model.delta(o.x - b.x) * cw) / ch,
          dy = model.delta(o.y - b.y);
        // Neighbours across a wrapped edge count, but a line across the canvas would mislead.
        if (Math.hypot(dx, dy) < model.SIGHT && Math.abs(o.x - b.x) < 0.5 && Math.abs(o.y - b.y) < 0.5) {
          ctx.beginPath();
          ctx.moveTo(b.x * cw, b.y * ch);
          ctx.lineTo(o.x * cw, o.y * ch);
          ctx.stroke();
        }
      }
    }
    for (let i = 0; i < birds.length; i++) {
      const b = birds[i],
        x = b.x * cw,
        y = b.y * ch,
        a = Math.atan2(b.vy, b.vx);
      ctx.fillStyle =
        i === 0 && s.neighbors ? '#fff4b8' : `hsl(${155 + b.vx * 27},${55 + 15 * b.vy}%,${64 + 10 * b.vy}%)`;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * 5.5, y + Math.sin(a) * 5.5);
      ctx.lineTo(x + Math.cos(a + 2.45) * 3.7, y + Math.sin(a + 2.45) * 3.7);
      ctx.lineTo(x + Math.cos(a - 2.45) * 3.7, y + Math.sin(a - 2.45) * 3.7);
      ctx.closePath();
      ctx.fill();
    }
    $('scene-status').textContent = t.status(birds.length);
    if ($('flock-order')) {
      $('flock-order').textContent = Math.round(order * 100) + '%';
      $('flock-meter').style.width = Math.round(order * 100) + '%';
    }
  }

  W.defineRoom({
    id: 'flock',
    symbol: '⋰',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'life',
    tagline: t.tagline,
    accent: { background: '#20302a', border: '#85c6a2', color: '#b5f4cd' },

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
    connection: { ...t.connection, go: 'waves' },

    defaults: { align: 1.2, cohesion: 0.6, separate: 1.5, count: 130, attract: true, trails: true, neighbors: false },
    ranges: { align: [0, 2], cohesion: [0, 2], separate: [0, 2] },
    defaultPreset: 0,
    presets: [
      { badge: '↗', settings: { align: 1.2, cohesion: 0.6, separate: 1.5 } },
      { badge: '⋰', settings: { align: 0, cohesion: 0, separate: 0.4 } },
      { badge: '◌', settings: { align: 0.15, cohesion: 1.8, separate: 1.2 } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Conway',
        image: 'conway.jpg',
        source: 'John_H_Conway_2005_(cropped).jpg',
        color: '#a6d4b3',
        frame: [100, -23, -12],
        // The credit, "Thane Plambeck (cropped)", is in text.en.js: CC BY 2.0 asks that an adaptation say so.
        license: { name: 'CC BY 2.0', url: 'https://creativecommons.org/licenses/by/2.0/' },
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
      stage.slider('align', t.align, 0, 2, 0.05, s.align, '') +
      stage.slider('cohesion', t.cohesion, 0, 2, 0.05, s.cohesion, '') +
      stage.slider('separate', t.separate, 0, 2, 0.05, s.separate, '') +
      `<div class="control"><label for="flock-influence">${t.influence}</label><select id="flock-influence"><option value="attract" ${s.attract ? 'selected' : ''}>${t.attract}</option><option value="repel" ${!s.attract ? 'selected' : ''}>${t.repel}</option></select></div>` +
      stage.check('trails', t.trails, s.trails) +
      stage.check('neighbors', t.neighbors, s.neighbors) +
      `<div class="wide readout">${t.agreement} <span id="flock-order"></span><div class="meter"><span id="flock-meter"></span></div></div>`,

    bindControls(panel, s) {
      $('flock-influence').addEventListener('change', (e) => (s.attract = e.target.value === 'attract'));
    },

    /** A still flock for the home map, from a fixed seed so it looks the same every visit. */
    preview(ctx, width, height) {
      let seed = 11;
      const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
      let still = model.seed(90, random);
      const s = { align: 1.6, cohesion: 0.8, separate: 1.5, attract: true };
      for (let i = 0; i < 240; i++) still = model.step(still, s, 1 / 30, width / height, null).birds;
      for (const b of still) {
        const x = b.x * width,
          y = b.y * height,
          a = Math.atan2(b.vy, b.vx);
        ctx.fillStyle = `hsl(${155 + b.vx * 27},${55 + 15 * b.vy}%,${64 + 10 * b.vy}%)`;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * 5.5, y + Math.sin(a) * 5.5);
        ctx.lineTo(x + Math.cos(a + 2.45) * 3.7, y + Math.sin(a + 2.45) * 3.7);
        ctx.lineTo(x + Math.cos(a - 2.45) * 3.7, y + Math.sin(a - 2.45) * 3.7);
        ctx.closePath();
        ctx.fill();
      }
    },

    enter(s, stage) {
      point = null;
      if (!birds.length) seedFlock(s, stage);
    },
    step(dt, s, stage) {
      ({ birds, order } = model.step(birds, s, dt, stage.width / stage.height, point));
    },
    draw,
    action(s, stage) {
      seedFlock(s, stage);
      stage.draw();
    },
    reset: seedFlock,
    onPreset: seedFlock,

    pointer: {
      down(p) {
        point = p;
      },
      move(p, { dragging, mouse }) {
        if (dragging || mouse) point = p;
      },
      up: () => (point = null),
      leave: () => (point = null),
      escape: () => (point = null),
      arrow(dx, dy) {
        point ??= { x: 0.5, y: 0.5 };
        point = { x: clamp(point.x + dx * 0.05, 0, 1), y: clamp(point.y + dy * 0.05, 0, 1) };
      },
    },

    /** A saved moment may carry a flock size; reseed only when it differs. */
    restore(saved, s, stage) {
      if (Number.isInteger(saved.count) && saved.count >= 30 && saved.count <= 250 && saved.count !== s.count) {
        s.count = saved.count;
        seedFlock(s, stage);
      }
    },
  });
})();
