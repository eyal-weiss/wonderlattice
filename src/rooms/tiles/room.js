/* Room · A tile that fills the world: bend a tile's edges, and its copies still cover the plane. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $ } = W;
  const M = W.models.tiles;
  const t = W.text('tiles');
  const reduced = W.prefersReducedMotion();

  // Colours for neighbouring tiles; a rule uses the first two, three or four.
  const PALETTES = [
    ['#d6b36f', '#6f9a63', '#bf6a4f', '#e8dcc0'],
    ['#2f7f9c', '#a6d8d8', '#1f4f6e', '#e5f1ec'],
    ['#6a5aa8', '#c2b0ea', '#e6c178', '#34305a'],
    ['#f2a7a7', '#f6d98f', '#9fdac8', '#c3b4f0'],
  ];
  const EYE = 0.075; // eye radius, in tile units
  const REACH = 16; // how near a finger or pointer must be to grab a dot, in CSS pixels
  const RIPPLE = 3.4; // tiles appear outwards from the middle at this many tile widths a second

  let view = null; // { scale, ox, oy } of the last frame, for the pointer
  let grabbed = null; // the handle being dragged
  let chosen = 0; // the dot the arrow keys move, in keyDots()
  let keyboard = false; // whether to show the chosen dot (after the keyboard is used)
  let hover = null;
  let bitmap = null; // the finished pattern, redrawn only when something changes

  const ruleOf = (s) => M.RULES[s.rule] ?? M.RULES[0];
  const centreOf = (rule) => M.centroid(rule.corners);

  /** The tile's outline as a path, in tile units. */
  function outlinePath(rule, s) {
    const pts = M.outline(rule, s, 10);
    const path = new Path2D();
    path.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) path.lineTo(pts[i][0], pts[i][1]);
    path.closePath();
    return path;
  }

  function viewFor(rule, s, width, height) {
    const scale = (Math.min(width, height) / (width < 520 ? 2.5 : 3.1)) * s.size;
    const [cx, cy] = centreOf(rule);
    return { scale, ox: width / 2 - cx * scale, oy: height / 2 - cy * scale };
  }

  /** Every dot that can be dragged: the control points (and their twins on the paired edges), and the eye. */
  function handlesOf(rule, s) {
    const list = M.handles(rule, s);
    if (s.eye) {
      const [cx, cy] = centreOf(rule);
      list.push({ eye: true, point: [cx + s.ex, cy + s.ey] });
    }
    return list;
  }

  /** The dots the keyboard steps through: the ones on free edges, and the eye (their twins follow). */
  const keyDots = (rule, s) => handlesOf(rule, s).filter((h) => !h.copy);

  const toScreen = (v, [x, y]) => [v.ox + x * v.scale, v.oy + y * v.scale];
  const toLocal = (v, [x, y]) => [(x - v.ox) / v.scale, (y - v.oy) / v.scale];

  /** The copies, the colours, and (optionally) the eyes: the whole pattern, drawn with `alpha(tile)` per copy. */
  function paint(ctx, s, width, height, v, alpha = () => 1) {
    const rule = ruleOf(s),
      path = outlinePath(rule, s),
      colours = PALETTES[s.palette] ?? PALETTES[0];
    const [cx, cy] = centreOf(rule);
    const radius = Math.max(width, height) / 2 / v.scale + 1.6;
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    for (const tile of M.tiling(rule, radius, 1200)) {
      const a = alpha(tile);
      if (a <= 0) continue;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.transform(v.scale, 0, 0, v.scale, v.ox, v.oy);
      ctx.transform(...tile.map);
      ctx.fillStyle = colours[tile.colour % colours.length];
      ctx.fill(path);
      ctx.lineWidth = 1.2 / v.scale;
      ctx.strokeStyle = 'rgba(10, 14, 21, 0.6)';
      ctx.lineJoin = 'round';
      ctx.stroke(path);
      if (s.eye) {
        const ex = cx + s.ex,
          ey = cy + s.ey;
        ctx.fillStyle = '#fbfaf3';
        ctx.beginPath();
        ctx.arc(ex, ey, EYE, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#141820';
        ctx.beginPath();
        ctx.arc(ex + EYE * 0.25, ey, EYE * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    return path;
  }

  function draw(ctx, s, stage) {
    const { width, height, clock } = stage;
    const rule = ruleOf(s);
    view = viewFor(rule, s, width, height);
    const [cx, cy] = centreOf(rule);
    const growing = !reduced && clock * RIPPLE < Math.max(width, height) / view.scale;
    let path;
    if (growing) {
      // Tiles appear outwards from the one you shape.
      path = paint(ctx, s, width, height, view, (tile) => {
        const [x, y] = M.apply(tile.map, [cx, cy]);
        return Math.max(0, Math.min(1, (clock * RIPPLE - Math.hypot(x - cx, y - cy)) / 0.8));
      });
      bitmap = null;
    } else {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const key = JSON.stringify(s) + `|${width}|${height}|${dpr}`;
      if (!bitmap || bitmap.key !== key) {
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        const c = canvas.getContext('2d');
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        paint(c, s, width, height, view);
        bitmap = { key, canvas };
      }
      ctx.drawImage(bitmap.canvas, 0, 0, width, height);
      path = outlinePath(rule, s);
    }
    // The tile you shape: outlined, with its dots.
    ctx.save();
    ctx.transform(view.scale, 0, 0, view.scale, view.ox, view.oy);
    ctx.lineWidth = 2.2 / view.scale;
    ctx.strokeStyle = '#f7f4e6';
    ctx.stroke(path);
    ctx.restore();
    const list = handlesOf(rule, s);
    const keyed = keyDots(rule, s);
    chosen = Math.min(chosen, keyed.length - 1);
    list.forEach((h) => {
      const [x, y] = toScreen(view, h.point);
      const active = h === grabbed || (grabbed && same(h, grabbed)) || (hover && same(h, hover));
      const r = (active ? 8 : 6) - (stage.width < 520 ? 1 : 0);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      if (h.copy) {
        // A twin: it moves with the dot on the free edge, and can be dragged too.
        ctx.fillStyle = 'rgba(10, 14, 21, 0.55)';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#f7f4e6';
        ctx.stroke();
      } else {
        ctx.fillStyle = h.eye ? '#ddf6a3' : '#f7f4e6';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#0a0e15';
        ctx.stroke();
      }
      if (keyboard && same(h, keyed[chosen])) {
        ctx.beginPath();
        ctx.arc(x, y, r + 5, 0, Math.PI * 2);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#ddf6a3';
        ctx.stroke();
      }
    });
  }

  /** Whether two handles are the same dot (a fresh list is built each frame). */
  function same(a, b) {
    if (a.eye || b.eye) return !!a.eye && !!b.eye;
    return (
      a.free === b.free &&
      a.spot === b.spot &&
      a.copy === b.copy &&
      (!a.copy || a.map.every((v, i) => Math.abs(v - b.map[i]) < 1e-9))
    );
  }

  function nearest(p, s, stage) {
    if (!view) return null;
    const x = p.x * stage.width,
      y = p.y * stage.height;
    let best = null,
      bestD = REACH;
    for (const h of handlesOf(ruleOf(s), s)) {
      const [hx, hy] = toScreen(view, h.point);
      const d = Math.hypot(hx - x, hy - y);
      if (d < bestD) ((best = h), (bestD = d));
    }
    return best;
  }

  /** Move a dot to a point in tile units, and update the settings. */
  function moveTo(s, h, local) {
    if (h.eye) {
      const [cx, cy] = centreOf(ruleOf(s));
      const clamp = (v) => Math.round(Math.max(-0.55, Math.min(0.55, v)) * 1000) / 1000;
      s.ex = clamp(local[0] - cx);
      s.ey = clamp(local[1] - cy);
    } else Object.assign(s, M.moveHandle(ruleOf(s), s, h, local));
  }

  function preview(ctx, width, height) {
    const s = { ...defaults, ...presets[0].settings };
    paint(ctx, s, width, height, viewFor(ruleOf(s), { ...s, size: 1.35 }, width, height));
  }

  /** For the trail and sharing: the pattern without the dots. */
  function trailCanvas(s, stage) {
    const scale = 2,
      canvas = document.createElement('canvas');
    canvas.width = Math.round(stage.width * scale);
    canvas.height = Math.round(stage.height * scale);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    paint(ctx, s, stage.width, stage.height, viewFor(ruleOf(s), s, stage.width, stage.height));
    return canvas;
  }

  const select = (key, label, options, value) =>
    `<div class="control"><label for="tiles-${key}">${label}</label><select id="tiles-${key}" data-select="${key}">` +
    options.map((o, i) => `<option value="${i}"${i === value ? ' selected' : ''}>${o}</option>`).join('') +
    '</select></div>';

  // The settings for up to three free edges, each given as three [along, across] control-point offsets.
  const bends = (edges) =>
    Object.fromEntries(M.EDGE_KEYS.map((key, f) => [key, edges[f] ? M.encodeEdge(edges[f]) : M.FLAT]));

  // Three creatures, one per kind of edge pairing: [along, across] for each control point of each free edge.
  const presetSettings = [
    // Fish: squares that slide. A round nose on the left leaves the forked tail on the right.
    {
      rule: 0,
      palette: 1,
      eye: true,
      ex: -0.3,
      ey: -0.06,
      ...bends([
        [
          [0, -0.12],
          [0, -0.16],
          [0, -0.1],
        ],
        [
          [0, -0.1],
          [0, -0.36],
          [0, -0.1],
        ],
      ]),
    },
    // Pinwheel: squares that turn, four creatures chasing round each corner.
    {
      rule: 1,
      palette: 0,
      eye: true,
      ex: 0.2,
      ey: -0.22,
      ...bends([
        [
          [0, -0.3],
          [0, 0.1],
          [0, 0.25],
        ],
        [
          [0, -0.1],
          [0, -0.1],
          [0, 0.1],
        ],
      ]),
    },
    // Chicks: hexagons that slide. The head on top leaves a notched tail below.
    {
      rule: 2,
      palette: 3,
      eye: true,
      ex: 0.06,
      ey: -0.5,
      ...bends([
        [
          [0, 0.15],
          [0, 0],
          [0, -0.15],
        ],
        [
          [0, 0.05],
          [0, 0.32],
          [0, 0.05],
        ],
        [
          [0, -0.15],
          [0, 0],
          [0, 0.15],
        ],
      ]),
    },
  ];
  const defaults = { size: 1, ...presetSettings[0] };
  const presets = t.presets.map((p, i) => ({ ...p, badge: ['□ ⇄', '□ ↻', '⬡ ⇄'][i], settings: presetSettings[i] }));

  const ranges = {
    rule: [0, M.RULES.length - 1, 'integer'],
    palette: [0, PALETTES.length - 1, 'integer'],
    size: [0.6, 1.5],
    ex: [-0.55, 0.55],
    ey: [-0.55, 0.55],
  };
  M.EDGE_KEYS.forEach((key) => (ranges[key] = [0, M.EDGE_MAX, 'integer']));

  W.defineRoom({
    id: 'tiles',
    symbol: '⬡',
    theme: 'making',
    eyebrow: t.eyebrow,
    name: t.name,
    tagline: t.tagline,
    accent: { background: '#22303a', border: '#7fb7c9', color: '#cfe8ee' },

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
    connection: { ...t.connection, go: 'loom' },

    defaults,
    ranges,
    defaultPreset: 0,
    presets,
    still: true,

    guests: [
      {
        ...t.guests[0],
        color: '#e6c178',
        sketch: { hairStyle: 'curly', hair: '#8a6a4e', skin: '#f1d2b6', glasses: 'round', backdrop: '#e9e1cf' },
      },
      {
        ...t.guests[1],
        bio: 'Escher',
        color: '#7fb7c9',
        sketch: { hairStyle: 'receding', hair: '#6d5a48', skin: '#efcfb3', beard: 'short', backdrop: '#dfe7ec' },
      },
    ],

    insight: t.insight,

    controls: (s, stage) =>
      select('rule', t.rule, t.rules, s.rule) +
      select('palette', t.palette, t.palettes, s.palette) +
      stage.slider('size', t.size, 0.6, 1.5, 0.05, s.size) +
      stage.check('eye', t.eye, s.eye),

    bindControls(panel, s, stage) {
      panel.querySelectorAll('[data-select]').forEach((input) =>
        input.addEventListener('change', () => {
          s[input.dataset.select] = Number(input.value);
          stage.setChosen(-1);
          stage.sync();
          stage.draw();
          if (input.dataset.select === 'rule') W.announce(t.ruleChanged(t.rules[s.rule]));
        }),
      );
    },

    readouts(s) {
      $('scene-name').textContent = t.rules[s.rule];
      $('scene-status').textContent = t.ruleNotes[s.rule];
    },

    draw,
    preview,
    trailCanvas,
    onPreset(s) {
      grabbed = null;
      chosen = 0;
      W.announce(`${t.rules[s.rule]}. ${t.ruleNotes[s.rule]}`);
    },

    /** "Start again": a plain tile of the same kind, straight edges, ready to bend into something new. */
    reset(s, stage) {
      M.EDGE_KEYS.forEach((key) => (s[key] = M.FLAT));
      grabbed = null;
      chosen = 0;
      stage.setChosen(-1);
      stage.refresh();
      stage.draw();
      W.announce(t.plain);
    },

    /** "Invent a creature": new bends for every free edge, and an eye. */
    action(s, stage) {
      const rule = ruleOf(s);
      const pick = (limit) => (Math.random() * 2 - 1) * limit;
      M.EDGE_KEYS.forEach((key, f) => {
        s[key] =
          f < rule.freeCount
            ? M.encodeEdge([0, 1, 2].map(() => [pick(M.LIMITS.along * 0.5), pick(M.LIMITS.across * 0.75)]))
            : M.FLAT;
      });
      s.eye = true;
      s.ex = Math.round((Math.random() - 0.5) * 0.5 * 1000) / 1000;
      s.ey = Math.round((Math.random() - 0.5) * 0.5 * 1000) / 1000;
      stage.setChosen(-1);
      stage.refresh();
      stage.draw();
      W.announce(t.invented);
    },

    pointer: {
      // Only a finger on a dot drags; anywhere else it scrolls the page.
      drag: (p, s, stage) => !!nearest(p, s, stage),
      down(p, s, stage) {
        grabbed = nearest(p, s, stage);
        if (grabbed) {
          // The keyboard carries on from the dot you grabbed (or, for a twin, the dot it follows).
          const own = grabbed.copy ? { ...grabbed, copy: false } : grabbed;
          chosen = Math.max(
            0,
            keyDots(ruleOf(s), s).findIndex((h) => same(h, own)),
          );
          keyboard = false;
          stage.draw();
        }
      },
      move(p, { dragging, mouse }, s, stage) {
        if (grabbed && dragging) {
          moveTo(s, grabbed, toLocal(view, [p.x * stage.width, p.y * stage.height]));
          stage.setChosen(-1);
          stage.sync();
          stage.draw();
          return;
        }
        if (mouse) {
          const h = nearest(p, s, stage);
          if (!!h !== !!hover || (h && hover && !same(h, hover))) {
            hover = h;
            $('scene-canvas').style.cursor = h ? 'grab' : '';
            stage.draw();
          }
        }
      },
      up() {
        if (!grabbed) return;
        grabbed = null;
        W.announce(t.changed);
      },
      leave() {
        hover = null;
        $('scene-canvas').style.cursor = '';
      },
      escape() {
        grabbed = null;
        keyboard = false;
      },
      /** Arrow keys move the chosen dot a little. */
      arrow(dx, dy, s, stage) {
        const list = keyDots(ruleOf(s), s);
        const h = list[Math.min(chosen, list.length - 1)];
        if (!h) return;
        keyboard = true;
        moveTo(s, h, [h.point[0] + dx * 0.02, h.point[1] + dy * 0.02]);
        stage.setChosen(-1);
        stage.sync();
      },
      /** Enter picks the next dot. */
      key(e, s) {
        if (e.key !== 'Enter') return false;
        const list = keyDots(ruleOf(s), s);
        keyboard = true;
        chosen = (chosen + 1) % list.length;
        W.announce(t.point(chosen + 1, list.length));
        return true;
      },
    },
  });
})();
