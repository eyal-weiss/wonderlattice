/* Room · The other side: a ribbon in 3D, with zero, one, or two half-twists. */
(() => {
  'use strict';

  const W = Wonderloom;
  const { $, TAU, clamp } = W;
  const { surface, project } = W.models.ribbon;

  // View rotation and the traveler's progress (radians around the ring).
  let rx = -0.5,
    ry = 0.25,
    walk = 0;

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
      curve(s.width, TAU * (oneSided ? 2 : 1), '#ffe4a3', 2);
      if (!oneSided) curve(-s.width, TAU, '#f4a6d2', 2);
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
    eyebrow: 'TOPOLOGY · 3D',
    name: 'The other side',
    accent: { background: '#1c2a32', border: '#88c2d5', color: '#b9f0ff' },

    title: 'Where is the other side?',
    subtitle: 'Turn a ribbon in space. Follow its edge. Let one twist surprise you.',
    field: 'Topology · Surfaces · 3D',
    sceneLabel: 'An ordinary strip, a strange journey',
    sceneName: 'The Möbius ribbon',
    tip: 'Drag to rotate · Arrow keys also turn the view',
    actionLabel: 'Follow the edge',
    canvasLabel: 'A three-dimensional ribbon. Drag or use arrow keys to rotate.',
    panelEyebrow: 'Turn & follow',
    whyLabel: 'Where did the other side go?',
    nudge:
      'Watch the golden traveler. With one half-twist, it takes two circuits around the hole to get back to its starting point.',
    connection: {
      html: '<strong>Make it real.</strong> Take a strip of paper, give one end a half-twist, and tape the ends together. Trace a line down its middle without lifting your pen.',
      go: 'motion',
      label: 'Follow another kind of loop',
    },

    defaults: { twists: 1, width: 0.46, spin: true, edges: false, walk: true, zoom: 1 },
    ranges: { twists: [0, 2, 'integer'], width: [0.2, 0.65], zoom: [0.75, 1.3] },
    defaultPreset: 1,
    presets: [
      { name: 'No twist', note: 'A familiar band with two edges.', badge: '0', settings: { twists: 0 } },
      { name: 'One half-twist', note: 'One continuous side. One edge.', badge: '½', settings: { twists: 1 } },
      { name: 'A full twist', note: 'Two edges return.', badge: '1', settings: { twists: 2 } },
    ],

    guests: [
      {
        name: 'August Möbius',
        note: 'One half twist makes “the other side” a trick question.',
        bio: 'Mobius',
        image: 'mobius.png',
        source: 'August_Ferdinand_Möbius.png',
        color: '#95d5e1',
        frame: [142, -43, -31],
      },
      {
        name: 'Johann Listing',
        note: 'He explored one-sided surfaces, too. History has more than one name.',
        bio: 'Listing',
        image: 'listing.jpg',
        source: 'J-B-Listing.jpg',
        color: '#f0c69f',
        frame: [145, -46, -37],
      },
    ],

    insight: {
      title: 'One twist changes the journey.',
      html: `<p>Join a strip of paper into a ring and you get two sides and two separate edges. Give one end a half-twist before joining it, and something changes: you can reach what looked like the other side without crossing an edge.</p>
<div class="insight-visual">The Möbius strip has one continuous side and one boundary loop.</div>
<h3>Follow the golden traveler</h3>
<p>The traveler starts away from the centerline. On a Möbius ribbon, one circuit around the hole brings it to the opposite width position. A second circuit returns it to the start. It never jumps across the ribbon.</p>
<h3>Count the edges</h3>
<p>“Follow the edge” highlights the boundary. With a half-twist, both apparent edges belong to one continuous loop. With no twist or a full twist, they are two separate loops, shown in different colors.</p>
<h3>A different way of seeing shape</h3>
<p>Topology studies properties that survive continuous bending and stretching. Turning this object on screen changes your viewpoint, while its one-sidedness stays the same.</p>
<details><summary>How is the surface drawn?</summary><p>For angle u and width coordinate v:<br>x = (R + v cos(nu/2)) cos(u)<br>y = (R + v cos(nu/2)) sin(u)<br>z = v sin(nu/2)</p><p>n counts half-twists. Odd n gives a Möbius band; even n gives a two-sided band. This is a parametric surface projected into the canvas, with depth-sorted faces. Translucent shading lets you see the traveler through the surface.</p></details>
<div class="sources"><a class="source-link" href="https://mathworld.wolfram.com/MoebiusStrip.html" target="_blank" rel="noopener">Explore the Möbius strip</a></div>`,
    },

    controls: (s, stage) =>
      '<div class="control wide"><label for="twists">Give the ribbon a twist</label><select id="twists">' +
      `<option value="0" ${s.twists === 0 ? 'selected' : ''}>No twist · a band</option>` +
      `<option value="1" ${s.twists === 1 ? 'selected' : ''}>Half a twist · Möbius</option>` +
      `<option value="2" ${s.twists === 2 ? 'selected' : ''}>A full twist · a band</option></select></div>` +
      stage.slider('width', 'Ribbon width', 0.2, 0.65, 0.01, s.width, '') +
      stage.slider('zoom', 'Look closer', 0.75, 1.3, 0.01, s.zoom, '×') +
      stage.check('spin', 'Let it turn', s.spin) +
      stage.check('walk', 'Show the traveler', s.walk) +
      stage.check('edges', 'Highlight the edges', s.edges),

    bindControls(panel, s, stage) {
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
      $('scene-name').textContent = oneSided ? 'The Möbius ribbon' : 'The twisted band';
      $('scene-status').textContent = oneSided ? 'One side · one edge' : 'Two sides · two edges';
      $('scene-action').textContent = s.edges ? 'Hide the edges' : 'Follow the edge';
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
