/* Room · Where is the other side? a ribbon in 3D, with zero, one, or two half-twists. */
(() => {
  'use strict';

  const W = Wonderloom;
  const { $, TAU, clamp } = W;
  const { surface, project } = W.models.ribbon;
  const t = W.text('ribbon');

  // View rotation and the traveller's progress (radians around the ring).
  let rx = -0.5,
    ry = 0.25,
    walk = 0;

  // The turn buttons: [id, symbol, label key, horizontal turn, vertical tilt]. They match the arrow keys.
  const TURN_STEP = 0.26;
  const TURNS = [
    ['left', '↺', 'turnLeft', -1, 0],
    ['right', '↻', 'turnRight', 1, 0],
    ['up', '↑', 'tiltUp', 0, -1],
    ['down', '↓', 'tiltDown', 0, 1],
  ];

  function draw(ctx, s, stage) {
    const { width: cw, height: ch } = stage;
    const view = { rx, ry, cx: cw / 2, cy: ch / 2, scale: Math.min(cw, ch) * 0.245 * s.zoom };
    const at = (u, v) => project(surface(u, v, s.twists), view);
    ctx.clearRect(0, 0, cw, ch);

    // Painter's algorithm: draw faces far to near.
    const faces = [],
      N = 100,
      M = 7;
    for (let i = 0; i < N; i++)
      for (let j = 0; j < M; j++) {
        const u = (i / N) * TAU,
          v = -s.width + (2 * s.width * j) / M;
        const pts = [
          at(u, v),
          at(u + TAU / N, v),
          at(u + TAU / N, v + (2 * s.width) / M),
          at(u, v + (2 * s.width) / M),
        ];
        faces.push({ p: pts, z: pts.reduce((z, p) => z + p.z, 0) / 4, i, j });
      }
    faces.sort((a, b) => b.z - a.z);
    for (const f of faces) {
      const light = clamp(48 - f.z * 13, 30, 77);
      ctx.fillStyle = `hsla(${185 + f.j * 7},55%,${light}%,.78)`;
      ctx.strokeStyle = 'rgba(175,235,245,.20)';
      ctx.lineWidth = 0.45;
      ctx.beginPath();
      f.p.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    const curve = (v, end, color, lineWidth, from = 0) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      for (let j = 0; j <= 450; j++) {
        const p = at(from + ((end - from) * j) / 450, v);
        j ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y);
      }
      ctx.stroke();
    };
    const oneSided = s.twists % 2 === 1;
    if (s.edges) {
      // A Möbius band's boundary is one loop that goes around twice.
      // The second edge is dashed, so the two loops differ by more than colour.
      curve(s.width, TAU * (oneSided ? 2 : 1), '#ffe4a3', 2);
      if (!oneSided) {
        ctx.setLineDash([7, 5]);
        curve(-s.width, TAU, '#f4a6d2', 2);
        ctx.setLineDash([]);
      }
    }
    if (s.walk) {
      const period = TAU * (oneSided ? 2 : 1),
        u = walk % period;
      curve(s.width * 0.6, u, '#ffe5a8', 2);
      const p = at(u, s.width * 0.6),
        start = at(0, s.width * 0.6);
      ctx.strokeStyle = '#fff6d5';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(start.x, start.y, 5, 0, TAU);
      ctx.stroke();
      ctx.fillStyle = '#fff1bd';
      ctx.shadowColor = '#ffe09e';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, TAU);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  W.defineRoom({
    id: 'ribbon',
    symbol: '∞',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'shape',
    tagline: t.tagline,
    accent: { background: '#1c2a32', border: '#88c2d5', color: '#b9f0ff' },

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
    connection: { ...t.connection, go: 'motion' },

    defaults: { twists: 1, width: 0.46, spin: true, edges: false, walk: true, zoom: 1 },
    ranges: { twists: [0, 2, 'integer'], width: [0.2, 0.65], zoom: [0.75, 1.3] },
    defaultPreset: 1,
    presets: [
      { badge: '0', settings: { twists: 0 } },
      { badge: '½', settings: { twists: 1 } },
      { badge: '1', settings: { twists: 2 } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Mobius',
        image: 'mobius.png',
        source: 'August_Ferdinand_Möbius.png',
        color: '#95d5e1',
        frame: [142, -43, -31],
      },
      {
        ...t.guests[1],
        bio: 'Listing',
        image: 'listing.jpg',
        source: 'J-B-Listing.jpg',
        color: '#f0c69f',
        frame: [145, -46, -37],
      },
    ],

    insight: t.insight,

    controls: (s, stage) =>
      `<div class="control wide"><label for="twists">${t.twists}</label><select id="twists">` +
      t.twistOptions.map((o, i) => `<option value="${i}" ${s.twists === i ? 'selected' : ''}>${o}</option>`).join('') +
      '</select></div>' +
      stage.slider('width', t.width, 0.2, 0.65, 0.01, s.width, '') +
      stage.slider('zoom', t.zoom, 0.75, 1.3, 0.01, s.zoom, '×') +
      stage.check('spin', t.spin, s.spin) +
      stage.check('walk', t.walk, s.walk) +
      stage.check('edges', t.edges, s.edges) +
      // Buttons that turn the view, for anyone who can't drag (WCAG 2.5.7).
      `<div class="control wide"><span id="ribbon-turn-label" style="font-size:14px">${t.turn}</span>` +
      '<div class="segment ribbon-turn" role="group" aria-labelledby="ribbon-turn-label">' +
      TURNS.map(
        ([id, symbol, label]) =>
          `<button type="button" id="ribbon-${id}" aria-label="${t[label]}" title="${t[label]}" style="font-size:17px;min-width:42px">${symbol}</button>`,
      ).join('') +
      '</div></div>',

    bindControls(panel, s, stage) {
      for (const [id, , , dx, dy] of TURNS)
        $('ribbon-' + id).addEventListener('click', () => {
          ry += dx * TURN_STEP;
          rx += dy * TURN_STEP;
          stage.draw();
        });
      $('twists').addEventListener('change', (e) => {
        s.twists = Number(e.target.value);
        walk = 0;
        stage.setChosen(s.twists); // presets are ordered by twist count
        stage.sync();
        stage.draw();
      });
    },

    readouts(s) {
      const oneSided = s.twists % 2 === 1;
      $('scene-name').textContent = oneSided ? t.nameOneSided : t.nameTwoSided;
      $('scene-status').textContent = oneSided ? t.statusOneSided : t.statusTwoSided;
      $('scene-action').textContent = s.edges ? t.hideEdges : t.showEdges;
    },

    step(dt, s, stage) {
      walk += dt * 0.7;
      if (s.spin && !stage.dragging) ry += dt * 0.13;
    },
    draw,
    action(s, stage) {
      s.edges = !s.edges;
      stage.refresh();
      stage.draw();
    },
    reset() {
      walk = 0;
      rx = -0.5;
      ry = 0.25;
    },
    onPreset() {
      walk = 0;
    },

    pointer: {
      move(p, { dragging, dx, dy }, s, stage) {
        if (!dragging) return;
        ry += dx * 0.009;
        rx += dy * 0.009;
        stage.draw();
      },
      arrow(dx, dy) {
        ry += dx * 0.13;
        rx += dy * 0.13;
      },
    },

    /** Saved moments also keep the viewing angle. */
    extraSettings: () => ({ rx, ry }),
    restore(saved) {
      rx = Number.isFinite(saved.rx) && Math.abs(saved.rx) < 100 ? saved.rx : -0.5;
      ry = Number.isFinite(saved.ry) && Math.abs(saved.ry) < 100 ? saved.ry : 0.25;
    },
  });
})();
