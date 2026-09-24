/* Room · A mind of many: a flock that emerges from local rules. */
(() => {
  'use strict';

  const W = Wonderloom;
  const { $, TAU, clamp } = W;
  const model = W.models.flock;

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
    $('scene-status').textContent = birds.length + ' individual decisions';
    if ($('flock-order')) {
      $('flock-order').textContent = Math.round(order * 100) + '%';
      $('flock-meter').style.width = Math.round(order * 100) + '%';
    }
  }

  W.defineRoom({
    id: 'flock',
    symbol: '⋰',
    eyebrow: 'EMERGENCE',
    name: 'A mind of many',
    theme: 'life',
    tagline: 'No leader, just neighbours: guide a flock into motion.',
    accent: { background: '#20302a', border: '#85c6a2', color: '#b5f4cd' },

    title: 'A mind of many.',
    subtitle: 'No leader. Just neighbors. Guide a little world into motion.',
    field: 'Dynamical systems · Emergence',
    sceneLabel: 'A world of local decisions',
    sceneName: 'The moving collective',
    tip: 'Touch or drag to guide the flock · Edges wrap around',
    actionLabel: 'Scatter the flock',
    canvasLabel: 'A flock of moving marks. Touch, drag, or use arrow keys to guide. Press Escape to release.',
    panelEyebrow: 'Local rules',
    whyLabel: 'Who is in charge?',
    nudge: 'Turn “Match direction” down to zero. Can a crowd stay together without agreeing where to go?',
    connection: {
      html: '<strong>A pattern without a planner.</strong> Here, a whole flock emerges from little interactions. In the sound room, a new waveform emerges from adding two simpler ones.',
      go: 'waves',
      label: 'See waves combine',
    },

    defaults: { align: 1.2, cohesion: 0.6, separate: 1.5, count: 130, attract: true, trails: true, neighbors: false },
    ranges: { align: [0, 2], cohesion: [0, 2], separate: [0, 2] },
    defaultPreset: 0,
    presets: [
      {
        name: 'In company',
        note: 'Find a shared direction.',
        badge: '↗',
        settings: { align: 1.2, cohesion: 0.6, separate: 1.5 },
      },
      {
        name: 'Everyone for themselves',
        note: 'Let individual paths take over.',
        badge: '⋰',
        settings: { align: 0, cohesion: 0, separate: 0.4 },
      },
      {
        name: 'Stay close',
        note: 'Togetherness without much agreement.',
        badge: '◌',
        settings: { align: 0.15, cohesion: 1.8, separate: 1.2 },
      },
    ],

    guests: [
      {
        name: 'John Conway',
        note: 'His Game of Life also makes surprises from tiny local rules.',
        bio: 'Conway',
        image: 'conway.jpg',
        source: 'John_H_Conway_2005_(cropped).jpg',
        color: '#a6d4b3',
        frame: [100, -23, -12],
        credit: 'Thane Plambeck',
        license: { name: 'CC BY 2.0', url: 'https://creativecommons.org/licenses/by/2.0/' },
      },
      {
        name: 'Alan Turing',
        note: 'His pattern model showed how local changes can make spots and stripes.',
        bio: 'Turing',
        image: 'turing.jpg',
        source: 'Alan_Turing_(1951).jpg',
        color: '#b6c8eb',
        frame: [115, -28, -21],
      },
    ],

    insight: {
      title: 'Who is in charge?',
      html: `<p>Nobody. Each moving mark looks only at nearby neighbors and follows three tendencies: avoid crowding, match their direction, and stay close.</p>
<div class="insight-visual">Individual interactions → collective motion</div>
<h3>The pattern lives between the individuals</h3>
<p>No mark knows the whole shape of the flock. Coherent movement can emerge because each one responds to a small part of the group. Your cursor adds an outside attraction or repulsion.</p>
<h3>A model, not a whole animal</h3>
<p>This is a simplified version of Craig Reynolds’s Boids model. It captures some visual qualities of flocks and schools, but it does not explain every decision made by real birds or fish.</p>
<h3>Look through one pair of eyes</h3>
<p>Turn on “Show one neighborhood.” The circle marks one individual’s sensing distance; lines point to the neighbors influencing it. Opposite edges connect, so a neighbor can be close across an edge.</p>
<details><summary>What does “agreement” measure?</summary><p>We average all the unit direction vectors and take the length of the result. Close to 100% means everyone points roughly the same way. Close to zero means directions mostly cancel. It is a description of the current flock, not a score.</p><p>Each step combines separation, alignment, and cohesion steering, then limits speed. All individuals update from the same previous state.</p></details>
<div class="sources"><a class="source-link" href="https://www.red3d.com/cwr/boids/index.html" target="_blank" rel="noopener">Craig Reynolds on Boids</a></div>`,
    },

    controls: (s, stage) =>
      stage.slider('align', 'Match direction', 0, 2, 0.05, s.align, '') +
      stage.slider('cohesion', 'Stay together', 0, 2, 0.05, s.cohesion, '') +
      stage.slider('separate', 'Keep some space', 0, 2, 0.05, s.separate, '') +
      `<div class="control"><label for="flock-influence">Your touch</label><select id="flock-influence"><option value="attract" ${s.attract ? 'selected' : ''}>Attract</option><option value="repel" ${!s.attract ? 'selected' : ''}>Repel</option></select></div>` +
      stage.check('trails', 'Leave light trails', s.trails) +
      stage.check('neighbors', 'Show one neighborhood', s.neighbors) +
      '<div class="wide readout">Direction agreement <span id="flock-order"></span><div class="meter"><span id="flock-meter"></span></div></div>',

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
