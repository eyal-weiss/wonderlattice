/* Room · Bend the plane: complex functions as maps, a compass that shows conformality, and a circle that becomes a wing. */
(() => {
  'use strict';

  const W = Wonderloom;
  const { $, clamp, TAU } = W;
  const M = W.models.plane;
  const { FUNCTIONS, PICTURES, JOUKOWSKI } = M;
  const t = W.text('plane');
  const reduced = W.prefersReducedMotion();

  const BEND_TIME = 2.4; // seconds for "Bend it" to go from 0 to 1
  const GLIDE_TIME = 1.2; // seconds for the compass to walk back onto its path
  const STROLL_TIME = 18; // seconds for the compass to walk once round its path
  // The length of the compass's arrows on the left, in pixels: a little shorter on small screens.
  const arrowFor = (P) => clamp(Math.min(P.w, P.h) * 0.09, 24, 36);
  const WING = PICTURES.indexOf('wing');
  const GRID = PICTURES.indexOf('grid');
  const SMALL = 760; // a stage narrower than this (a phone) draws at a lower resolution
  const CARD_VIEW = { cx: -0.05, cy: 0.2, rx: 2.35, ry: 1.2 }; // the home card, close in on the wing

  const COLORS = {
    background: '#0a0e15',
    panel: '#0e1520',
    border: '#223044',
    axis: '#2c3b4f',
    faint: '#243244',
    label: '#a7b4c6',
    tick: '#8595aa', // the "1" and "i" beside the axes: at least 4.5:1 on the panel
    ink: '#f4e3b5',
    wing: 'rgba(244, 227, 181, 0.12)',
    flow: 'rgba(120, 170, 215, 0.34)',
    drop: '#cfe6ff',
    across: '#6fe0d0', // the compass arrow along 1, and horizontal lines
    up: '#ffb36b', // the compass arrow along i, and vertical lines
    halo: 'rgba(221, 246, 163, 0.16)',
    mark: '#ddf6a3',
  };
  // Colours along each family of lines, so every line can be followed across the map.
  const familyColor = (family, u) => {
    if (family === 'x') return `hsl(${198 - 40 * u}, 70%, ${58 + 8 * u}%)`;
    if (family === 'y') return `hsl(${14 + 34 * u}, 88%, ${62 + 4 * u}%)`;
    if (family === 'ring') return `hsl(${44 - 26 * u}, 88%, ${68 - 6 * u}%)`;
    if (family === 'ray') return `hsl(${170 + 60 * u}, 60%, 62%)`;
    return COLORS.ink;
  };

  /**
   * Where the compass walks while the stage plays, one path per map, as a
   * function of an angle. Each passes somewhere interesting: through the
   * critical points of z², sin z, and z + 1/z, and around the pole of 1/z.
   */
  const STROLLS = [
    (a) => [0.95 * Math.sin(a), 0.55 * Math.sin(2 * a)],
    (a) => [1.05 * Math.cos(a), 0.75 * Math.sin(a)],
    (a) => [-0.3 + 0.9 * Math.cos(a), 2.1 * Math.sin(a)],
    (a) => [(Math.PI / 2) * Math.sin(a), 0.6 * Math.sin(2 * a)],
    (a) => [Math.cos(a), Math.sin(a)],
  ];

  let room = null, // this room, once registered
    layout = null, // the geometry of the last frame, for the pointer
    morph = null, // { elapsed } while "Bend it" plays, else null
    strolling = !reduced, // the compass walks while the stage plays, until the visitor takes it
    glide = null, // { elapsed, from } while the compass walks back onto its path, else null
    stroll = 0, // the angle along the walk
    grabbed = null, // offset from the pointer to the compass while dragging
    firstVisit = true,
    spoken = null, // the special point last announced to screen readers ('critical' or 'pole'), or null
    heard = null, // the special point the compass is on now, waiting to be announced
    speakTimer = 0,
    layer = { key: '', canvas: null }, // everything that doesn't move, drawn once and reused every frame
    cache = { key: '', value: null },
    flows = { key: '', value: null },
    streamlines = { key: '', value: null }; // traced in z; they don't change as the plane bends

  const fnOf = (s) => FUNCTIONS[s.fn];
  /** How far bent the picture is now, from 0 to 1: the animation if it is playing, otherwise the slider. */
  const bentBy = (s) => (morph ? ease(Math.min(1, morph.elapsed / BEND_TIME)) : s.bend / 100);
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
  const round = (x, digits) => Number(x.toFixed(digits));

  // ---- Layout -------------------------------------------------------------------

  /**
   * Two panels, the plane and its image: side by side on a wide canvas, one
   * above the other on a tall one, whichever makes them bigger. Each panel
   * keeps x and y at the same scale, since squashing would bend the angles we
   * want to show.
   */
  function measure(width, height, s, bend, labels = true, zoom = null) {
    // The home card shows only the image, filling the card.
    if (!labels) {
      const full = panel(0, 0, width, height, zoom ?? M.imageView(s.fn, bend), false);
      return { wide: true, gap: 0, panels: [full, full], z: full, w: full };
    }
    const pad = 4,
      gap = 30;
    const side = { w: (width - gap - 2 * pad) / 2, h: height - 2 * pad },
      stack = { w: width - 2 * pad, h: (height - gap - 2 * pad) / 2 };
    const wide = Math.min(side.w, side.h) >= Math.min(stack.w, stack.h);
    const size = wide ? side : stack;
    const boxes = wide
      ? [
          { x: pad, y: pad },
          { x: pad + size.w + gap, y: pad },
        ]
      : [
          { x: pad, y: pad },
          { x: pad, y: pad + size.h + gap },
        ];
    const views = [fnOf(s).frame, M.imageView(s.fn, bend)];
    const panels = boxes.map((b, i) => panel(b.x, b.y, size.w, size.h, views[i], labels));
    return { wide, gap, panels, z: panels[0], w: panels[1] };
  }

  function panel(x, y, w, h, view, labels) {
    const scale = Math.min(w / (2 * view.rx), h / (2 * view.ry)) / (labels ? 1.08 : 1);
    const ox = x + w / 2,
      oy = y + h / 2;
    return {
      x,
      y,
      w,
      h,
      view,
      scale,
      /** From a complex number to canvas pixels (y points down on the canvas). */
      px: (z) => [ox + (z[0] - view.cx) * scale, oy - (z[1] - view.cy) * scale],
      /** From canvas pixels back to a complex number. */
      at: (p) => [view.cx + (p[0] - ox) / scale, view.cy - (p[1] - oy) / scale],
      // The half-widths actually visible, in the plane's units.
      rx: w / 2 / scale,
      ry: h / 2 / scale,
    };
  }

  // ---- Sampling the picture, cached -------------------------------------------------

  /** The picture's strokes in both panels, in pixels. Recomputed only when something that shapes them changes. */
  function strokes(s, L, bend) {
    const key = [s.fn, s.picture, round(bend, 4), s.thick, s.camber, s.grid, L.w.x, L.w.y, L.w.w, L.w.h].join();
    if (cache.key === key) return cache.value;
    const map = M.blend(s.fn, bend);
    const options = (P) => ({
      maxStep: 1.5 / P.scale,
      maxJump: 0.25 * Math.min(P.rx, P.ry),
      limit: 14 * Math.max(P.rx, P.ry),
      centre: [P.view.cx, P.view.cy],
    });
    const trace = (list) =>
      list.map((stroke) => ({
        stroke,
        z: M.sampleCurve((z) => z, stroke.at, { n: stroke.n, ...options(L.z) }).map((p) => p.map(L.z.px)),
        w: M.sampleCurve(map.f, stroke.at, { n: stroke.n, ...options(L.w) }).map((p) => p.map(L.w.px)),
      }));
    const shapes = { thick: s.thick, camber: s.camber };
    const value = {
      picture: trace(M.picture(PICTURES[s.picture], s.fn, shapes)),
      grid: s.grid && s.picture !== GRID ? trace(M.picture('grid', s.fn, { frame: backdrop(s, L) })) : [],
    };
    cache = { key, value };
    return value;
  }

  /** The faint grid fills the visible left panel, up to half as big again as the map's frame. */
  function backdrop(s, L) {
    const { cx, cy, rx, ry } = fnOf(s).frame;
    return { cx, cy, rx: Math.min(L.z.rx, rx * 1.5), ry: Math.min(L.z.ry, ry * 1.5) };
  }

  /**
   * The wing's streamlines in both panels, with the time a drop of air takes
   * to reach each point, so the drops can travel at the flow's true speed.
   * In the image plane the speed is |F′| / |w′|.
   */
  function flowLines(s, L, bend) {
    const key = [s.fn, round(bend, 4), s.thick, s.camber, L.w.x, L.w.y, L.w.w, L.w.h].join();
    if (flows.key === key) return flows.value;
    const map = M.blend(s.fn, bend),
      speed = M.wingVelocity(s.thick, s.camber);
    // Seeds far enough upstream, and lines long enough, to cross both panels whatever their shape.
    const reach = Math.max(L.z.rx, L.w.rx) + 0.6,
      height = Math.max(L.z.ry, L.w.ry) * 1.05;
    const traced = [s.thick, s.camber, round(reach, 2), round(height, 2)].join();
    if (streamlines.key !== traced) {
      const value = M.wingStreamlines(s.thick, s.camber, {
        count: Math.round(height * 5.4),
        height,
        x0: -reach,
        x1: reach,
      });
      streamlines = { key: traced, value };
    }
    const lines = streamlines.value;
    const value = lines.map(({ points }) => {
      const both = [points, points.map(map.f)].map((plane, i) => {
        const P = i ? L.w : L.z,
          px = plane.map(P.px),
          time = [0];
        for (let k = 1; k < plane.length; k++) {
          const mid = M.scale(M.add(points[k], points[k - 1]), 0.5),
            stretch = i ? M.abs(map.df(mid)) : 1;
          time.push(time[k - 1] + (M.abs(M.sub(plane[k], plane[k - 1])) * stretch) / Math.max(0.05, M.abs(speed(mid))));
        }
        return { px, time };
      });
      return { z: both[0], w: both[1] };
    });
    flows = { key, value };
    return value;
  }

  // ---- Drawing -----------------------------------------------------------------------

  function strokePieces(ctx, pieces) {
    ctx.beginPath();
    for (const piece of pieces) {
      ctx.moveTo(piece[0][0], piece[0][1]);
      for (let i = 1; i < piece.length; i++) ctx.lineTo(piece[i][0], piece[i][1]);
    }
    ctx.stroke();
  }

  function drawAxes(ctx, P) {
    const [x0, y0] = P.px([0, 0]);
    ctx.strokeStyle = COLORS.axis;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(P.x, Math.round(y0) + 0.5);
    ctx.lineTo(P.x + P.w, Math.round(y0) + 0.5);
    ctx.moveTo(Math.round(x0) + 0.5, P.y);
    ctx.lineTo(Math.round(x0) + 0.5, P.y + P.h);
    ctx.stroke();
    // Little ticks at 1 and i, so the plane has a sense of size.
    const [x1] = P.px([1, 0]),
      [, yi] = P.px([0, 1]);
    ctx.beginPath();
    ctx.moveTo(x1, y0 - 4);
    ctx.lineTo(x1, y0 + 4);
    ctx.moveTo(x0 - 4, yi);
    ctx.lineTo(x0 + 4, yi);
    ctx.stroke();
    ctx.fillStyle = COLORS.tick;
    ctx.font = '11px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText('1', x1 + 3, y0 + 13);
    ctx.fillText('i', x0 + 6, yi + 4);
  }

  function drawPicture(ctx, traced, side, faint, fill) {
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    for (const { stroke, [side]: pieces } of traced) {
      if (!pieces.length) continue;
      if (faint) {
        ctx.strokeStyle = COLORS.faint;
        ctx.lineWidth = 1;
        strokePieces(ctx, pieces);
        continue;
      }
      const u = stroke.count > 1 ? stroke.index / (stroke.count - 1) : 0.5;
      if (stroke.family === 'eye') {
        ctx.fillStyle = COLORS.ink;
        ctx.beginPath();
        for (const piece of pieces) {
          ctx.moveTo(piece[0][0], piece[0][1]);
          for (const p of piece) ctx.lineTo(p[0], p[1]);
        }
        ctx.fill();
        continue;
      }
      if (fill && pieces.length === 1) {
        ctx.fillStyle = COLORS.wing;
        ctx.beginPath();
        pieces[0].forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
        ctx.fill();
      }
      ctx.strokeStyle = familyColor(stroke.family, u);
      ctx.lineWidth = stroke.family === 'ink' ? 2.2 : 1.4;
      strokePieces(ctx, pieces);
    }
  }

  /** The streamlines of the air around the wing. */
  function drawFlow(ctx, lines, side) {
    ctx.strokeStyle = COLORS.flow;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const line of lines) {
      const { px } = line[side];
      px.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    }
    ctx.stroke();
  }

  /** Drops of air carried along the streamlines (moving only while the stage plays). */
  function drawDrops(ctx, lines, side, clock) {
    ctx.fillStyle = COLORS.drop;
    const spacing = 0.45;
    for (const line of lines) {
      const { px, time } = line[side],
        total = time[time.length - 1];
      if (total <= 0) continue;
      const phase = (clock * 0.55) % spacing;
      let k = 1;
      for (let tau = phase; tau < total; tau += spacing) {
        while (k < time.length - 1 && time[k] < tau) k++;
        const a = px[k - 1],
          b = px[k],
          f = clamp((tau - time[k - 1]) / (time[k] - time[k - 1] || 1), 0, 1);
        ctx.beginPath();
        ctx.arc(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, 1.6, 0, TAU);
        ctx.fill();
      }
    }
  }

  /** Small markers where f′ = 0 and at poles, on the left, so there's something to find. */
  function drawSpecial(ctx, s, P) {
    const fn = fnOf(s);
    ctx.font = '11px system-ui';
    ctx.textAlign = 'left';
    for (const [list, label] of [
      [fn.critical, t.criticalMark],
      [fn.poles, t.poleMark],
    ])
      for (const c of list) {
        const [x, y] = P.px(c);
        if (x < P.x || x > P.x + P.w || y < P.y || y > P.y + P.h) continue;
        ctx.strokeStyle = COLORS.mark;
        ctx.globalAlpha = 0.75;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        if (list === fn.poles) {
          ctx.moveTo(x - 4, y - 4);
          ctx.lineTo(x + 4, y + 4);
          ctx.moveTo(x + 4, y - 4);
          ctx.lineTo(x - 4, y + 4);
        } else ctx.arc(x, y, 4, 0, TAU);
        ctx.stroke();
        ctx.fillStyle = COLORS.mark;
        ctx.fillText(label, x + 7, y - 7);
        ctx.globalAlpha = 1;
      }
  }

  function arrow(ctx, from, dx, dy, color) {
    const length = Math.hypot(dx, dy);
    if (length < 0.5) return;
    const ux = dx / length,
      uy = dy / length,
      head = Math.min(8, length * 0.45);
    const tip = [from[0] + dx, from[1] + dy];
    ctx.strokeStyle = '#0b1017';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(from[0], from[1]);
    ctx.lineTo(tip[0] - ux * head * 0.6, tip[1] - uy * head * 0.6);
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.6;
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(tip[0], tip[1]);
    ctx.lineTo(tip[0] - ux * head - uy * head * 0.55, tip[1] - uy * head + ux * head * 0.55);
    ctx.lineTo(tip[0] - ux * head + uy * head * 0.55, tip[1] - uy * head - ux * head * 0.55);
    ctx.closePath();
    ctx.fill();
  }

  /** The compass: two arrows from `base`, given as screen vectors, with a right-angle mark when they are long enough. */
  function drawCompass(ctx, base, a, b, square) {
    const la = Math.hypot(a[0], a[1]),
      lb = Math.hypot(b[0], b[1]);
    if (square && la > 12 && lb > 12) {
      const k = 7;
      const ua = [(a[0] / la) * k, (a[1] / la) * k],
        ub = [(b[0] / lb) * k, (b[1] / lb) * k];
      ctx.strokeStyle = 'rgba(232, 237, 243, 0.8)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(base[0] + ua[0], base[1] + ua[1]);
      ctx.lineTo(base[0] + ua[0] + ub[0], base[1] + ua[1] + ub[1]);
      ctx.lineTo(base[0] + ub[0], base[1] + ub[1]);
      ctx.stroke();
    }
    arrow(ctx, base, a[0], a[1], COLORS.across);
    arrow(ctx, base, b[0], b[1], COLORS.up);
    ctx.fillStyle = '#e8edf3';
    ctx.beginPath();
    ctx.arc(base[0], base[1], 3.2, 0, TAU);
    ctx.fill();
  }

  /** The compass on the left, and its twin, the compass multiplied by w′(z), on the right. */
  function drawProbes(ctx, s, L, bend, clock) {
    const z = [s.probeX, s.probeY],
      map = M.blend(s.fn, bend);
    const base = L.z.px(z),
      length = arrowFor(L.z);
    ctx.save();
    ctx.beginPath();
    ctx.rect(L.z.x, L.z.y, L.z.w, L.z.h);
    ctx.clip();
    ctx.fillStyle = COLORS.halo;
    ctx.beginPath();
    ctx.arc(base[0], base[1], length + 8, 0, TAU);
    ctx.fill();
    drawCompass(ctx, base, [length, 0], [0, -length], true);
    ctx.restore();

    const w = map.f(z),
      d = map.df(z);
    if (!M.finite(w) || !M.finite(d)) return;
    const there = L.w.px(w);
    ctx.save();
    ctx.beginPath();
    ctx.rect(L.w.x, L.w.y, L.w.w, L.w.h);
    ctx.clip();
    // The same tiny compass, carried over: scaled by |w′| and by the ratio of the two panels' zoom.
    const k = Math.min(3.2, (M.abs(d) * L.w.scale) / L.z.scale),
      angle = M.arg(d),
      a = [length * k * Math.cos(angle), -length * k * Math.sin(angle)],
      b = [length * k * Math.cos(angle + Math.PI / 2), -length * k * Math.sin(angle + Math.PI / 2)];
    if (M.isCritical(s.fn, bend, z)) {
      // At a critical point the arrows vanish: a gentle pulse marks where they went.
      const pulse = reduced ? 0.5 : (clock * 0.9) % 1;
      ctx.strokeStyle = `rgba(221, 246, 163, ${0.9 * (1 - pulse)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(there[0], there[1], 6 + 24 * pulse, 0, TAU);
      ctx.stroke();
    }
    drawCompass(ctx, there, a, b, true);
    ctx.restore();
  }

  function drawPanel(ctx, P) {
    ctx.fillStyle = COLORS.panel;
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(P.x, P.y, P.w, P.h, 10);
    ctx.fill();
    ctx.stroke();
  }

  /**
   * Draw a frame. The panels, grid, picture, and streamlines only change when the
   * settings or the size do, so on the stage they are drawn once into `layer`
   * and copied each frame; only the drops of air and the compass are redrawn.
   */
  function render(ctx, s, view, { labels = true, clock = 0, zoom = null } = {}) {
    const { width, height } = view;
    const bend = bentBy(s);
    const L = measure(width, height, s, bend, labels, zoom);
    if (labels) layout = L;
    const traced = strokes(s, L, bend),
      wing = s.picture === WING,
      lines = wing && s.flow && s.fn === JOUKOWSKI ? flowLines(s, L, bend) : null;
    const sides = labels
      ? [
          ['z', L.z],
          ['w', L.w],
        ]
      : [['w', L.w]];
    const still = () => drawStill(ctx, view, s, L, bend, sides, traced, lines, labels);
    // While the plane bends, every frame is new, so there's nothing to reuse.
    if (!labels || morph) still();
    else {
      const dpr = ctx.getTransform().a;
      const key = [cache.key, lines ? flows.key : '', bend === 1, width, height, dpr].join('|');
      if (layer.key !== key) {
        const canvas = layer.canvas ?? document.createElement('canvas');
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        const c = canvas.getContext('2d');
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawStill(c, view, s, L, bend, sides, traced, lines, labels);
        layer = { key, canvas };
      }
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(layer.canvas, 0, 0);
      ctx.restore();
    }
    if (lines)
      for (const [side, P] of sides) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(P.x, P.y, P.w, P.h, 10);
        ctx.clip();
        drawDrops(ctx, lines, side, clock);
        ctx.restore();
      }
    if (labels) drawProbes(ctx, s, L, bend, clock);
  }

  /** Everything that doesn't move from frame to frame: panels, axes, grid, streamlines, picture, and labels. */
  function drawStill(ctx, { width, height }, s, L, bend, sides, traced, lines, labels) {
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, width, height);
    for (const [side, P] of sides) {
      if (labels) drawPanel(ctx, P);
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(P.x, P.y, P.w, P.h, 10);
      ctx.clip();
      if (labels) drawAxes(ctx, P);
      drawPicture(ctx, traced.grid, side, true, false);
      if (lines) drawFlow(ctx, lines, side);
      drawPicture(ctx, traced.picture, side, false, s.picture === WING);
      if (side === 'z' && bend === 1) drawSpecial(ctx, s, P);
      ctx.restore();
    }
    if (labels) drawLabels(ctx, s, L, bend);
  }

  function drawLabels(ctx, s, L, bend) {
    ctx.fillStyle = COLORS.label;
    ctx.font = 'italic 15px Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText(t.zLabel, L.z.x + 12, L.z.y + 21);
    ctx.fillText(t.wLabel, L.w.x + 12, L.w.y + 21);
    // An arrow from the plane to its image, in the gap between the panels.
    ctx.strokeStyle = '#6f8199';
    ctx.fillStyle = '#6f8199';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.save();
    if (L.wide) ctx.translate(L.z.x + L.z.w + L.gap / 2, L.z.y + L.z.h / 2);
    else {
      ctx.translate(L.z.x + L.z.w / 2, L.z.y + L.z.h + L.gap / 2);
      ctx.rotate(Math.PI / 2);
    }
    ctx.beginPath();
    ctx.moveTo(-6, 0);
    ctx.lineTo(6, 0);
    ctx.moveTo(1, -5);
    ctx.lineTo(6, 0);
    ctx.lineTo(1, 5);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Phones have many pixels and little power: on a small stage, draw at most
   * 1.5 canvas pixels per screen pixel (the stage allows 2). The stage sizes the
   * canvas again whenever it resizes, and the next frame trims it back.
   */
  function fitResolution(ctx, stage) {
    const most = Math.min(devicePixelRatio || 1, stage.width < SMALL ? 1.5 : 2);
    if (ctx.getTransform().a <= most + 0.01) return;
    ctx.canvas.width = Math.round(stage.width * most);
    ctx.canvas.height = Math.round(stage.height * most);
    ctx.setTransform(most, 0, 0, most, 0, 0);
  }

  function draw(ctx, s, stage) {
    fitResolution(ctx, stage);
    // A shared link, saved moment, or resize can leave the compass outside the panel: bring it back.
    if (keepInside(s, stage.width, stage.height)) readouts(s);
    render(ctx, s, stage, { clock: stage.clock });
    // The tip names where the pictures are: side by side, or one above the other.
    const tip = layout.wide ? t.tip : t.tipStacked;
    if ($('scene-tip').textContent !== tip) $('scene-tip').textContent = tip;
  }

  /** The home card: a circle bent into a wing, with air flowing past. */
  function preview(ctx, width, height) {
    render(
      ctx,
      { ...defaults, ...presetSettings[4] },
      { width, height },
      { labels: false, clock: 0.3, zoom: CARD_VIEW },
    );
  }

  // ---- Moving the compass --------------------------------------------------------------

  /**
   * Put the compass at z, kept inside the left panel P with room for its
   * arrows and halo. Without a panel, the map's frame is the bound.
   */
  function place(s, z, P = layout?.z) {
    const { cx, cy, rx: frameX, ry: frameY } = fnOf(s).frame;
    const margin = P ? (arrowFor(P) + 10) / P.scale : 0,
      rx = P ? Math.max(0, P.rx - margin) : frameX,
      ry = P ? Math.max(0, P.ry - margin) : frameY;
    s.probeX = round(clamp(z[0], cx - rx, cx + rx), 3);
    s.probeY = round(clamp(z[1], cy - ry, cy + ry), 3);
  }

  /** Keep the compass inside the left panel as laid out for the current settings (after links, moments, presets). */
  function keepInside(s, width, height) {
    const x = s.probeX,
      y = s.probeY;
    place(s, [x, y], measure(width, height, s, bentBy(s)).z);
    return s.probeX !== x || s.probeY !== y;
  }

  /** The visitor takes the compass: it stops walking until Play or "Start again". */
  function take() {
    strolling = false;
    glide = null;
  }

  /** Walk back onto the path from wherever the compass is now. */
  const startGlide = () => (glide = { elapsed: 0, from: null });

  /**
   * One step of the walk. While gliding, the compass blends from where it was
   * onto the moving path over GLIDE_TIME, then simply follows the path.
   */
  function walk(dt, s) {
    stroll = (stroll + (dt * TAU) / STROLL_TIME) % TAU;
    const target = STROLLS[s.fn](stroll);
    if (glide) {
      glide.from ??= [s.probeX, s.probeY];
      glide.elapsed += dt;
      const u = Math.min(1, glide.elapsed / GLIDE_TIME);
      place(s, M.add(glide.from, M.scale(M.sub(target, glide.from), ease(u))));
      if (u >= 1) glide = null;
    } else place(s, target);
  }

  /** Start walking again from wherever the compass is: first glide back to the path. */
  function resumeStroll() {
    strolling = !reduced;
    startGlide();
  }

  /** "Bend it". With reduced motion, or while the visitor has paused, the plane is simply shown bent. */
  function startBend(s, stage) {
    if (reduced || !stage.playing) {
      morph = null;
      s.bend = 100;
    } else {
      morph = { elapsed: 0 };
      s.bend = 0;
    }
    showBend(s);
    stage.sync();
    stage.draw();
  }

  /** Move the slider along with the animation. */
  function showBend(s) {
    const input = $('c-bend');
    if (input) input.value = s.bend;
  }

  // ---- Readouts -------------------------------------------------------------------------

  function readouts(s) {
    const bend = bentBy(s),
      map = M.blend(s.fn, bend),
      z = [s.probeX, s.probeY],
      w = map.f(z),
      d = map.df(z);
    const pole = !M.finite(w) || !M.finite(d),
      stretch = pole ? Infinity : M.abs(d),
      critical = !pole && M.isCritical(s.fn, bend, z);
    const turn = pole || critical ? null : Math.round((M.arg(d) * 180) / Math.PI);
    setText($('scene-name'), bend === 1 ? t.formulas[s.fn] : t.bent(t.formulas[s.fn], Math.round(bend * 100)));
    setText(
      $('scene-status'),
      pole ? t.statusPole : critical ? t.statusCritical : t.status(round(stretch, 2), t.degrees(turn)),
    );
    listen(pole ? 'pole' : critical && bend === 1 ? 'critical' : null);
    const box = $('plane-readout');
    if (!box) return;
    const P = layout?.w,
      there = P && !pole ? P.px(w) : null,
      away = there && (there[0] < P.x || there[0] > P.x + P.w || there[1] < P.y || there[1] > P.y + P.h);
    const note = pole ? t.pole : critical ? t.critical : away ? t.away : bend < 1 ? t.blending : t.keeps;
    const read = (key) => box.querySelector(`[data-read="${key}"]`);
    setText(read('at'), t.point(round(z[0], 2), round(z[1], 2)));
    setText(read('stretch'), pole ? '∞' : t.times(round(stretch, 2)));
    setText(read('turn'), turn === null ? t.none : t.degrees(turn));
    setText(read('note'), note);
  }

  /** Readouts change every frame while the compass walks: touch the page only when the words change. */
  function setText(element, text) {
    if (element.textContent !== text) element.textContent = text;
  }

  /**
   * Tell screen-reader users when the compass comes to rest on a special
   * point (f′ = 0, or a pole), once, not on every frame. While it walks by
   * itself it only passes through, so nothing is said.
   */
  function listen(special) {
    if (special === heard) return;
    heard = special;
    clearTimeout(speakTimer);
    if (!special) return void (spoken = null);
    if (special === spoken) return;
    speakTimer = setTimeout(() => {
      if (heard !== special || strolling || !W.stage.isShowing(room)) return;
      spoken = special;
      W.announce(special === 'pole' ? t.announcePole : t.announceCritical);
    }, 450);
  }

  // ---- Controls ---------------------------------------------------------------------------

  const select = (key, label, options, value) =>
    `<div class="control"><label for="plane-${key}">${label}</label><select id="plane-${key}" data-select="${key}">` +
    options.map((o, i) => `<option value="${i}"${i === value ? ' selected' : ''}>${o}</option>`).join('') +
    '</select></div>';

  function controls(s, stage) {
    const wing = s.picture === WING;
    const row = (key, label, math = '') =>
      `<span>${label}${math ? ` <span class="plane-math">${math}</span>` : ''}</span><strong data-read="${key}"></strong>`;
    return (
      '<div class="plane-pair wide">' +
      select('fn', t.functionLabel, t.functions, s.fn) +
      select('picture', t.pictureLabel, t.pictures, s.picture) +
      '</div>' +
      `<div class="wide">${stage.slider('bend', t.bendLabel, 0, 100, 1, s.bend, '%')}</div>` +
      (wing
        ? '<div class="plane-pair wide">' +
          stage.slider('thick', t.thickLabel, 0, 0.3, 0.01, s.thick) +
          stage.slider('camber', t.camberLabel, -0.3, 0.3, 0.01, s.camber) +
          '</div>'
        : '') +
      // The checks share one block of the panel, so it stays short.
      '<div class="wide plane-checks">' +
      (wing && s.fn === JOUKOWSKI ? stage.check('flow', t.flowLabel, s.flow) : '') +
      (s.picture === GRID ? '' : stage.check('grid', t.gridLabel, s.grid)) +
      '</div>' +
      '<div class="wide readout plane-readout" id="plane-readout">' +
      `<div class="plane-rows">${row('at', t.at)}${row('stretch', t.stretch, t.stretchMath)}${row('turn', t.turn, t.turnMath)}</div>` +
      '<p data-read="note"></p></div>'
    );
  }

  function bindControls(panel, s, stage) {
    panel.querySelectorAll('[data-select]').forEach((input) =>
      input.addEventListener('change', () => {
        const key = input.dataset.select;
        s[key] = Number(input.value);
        stage.setChosen(-1);
        // The panel changes with the picture (the wing has its own sliders), so rebuild it, keeping focus.
        stage.refresh();
        $(`plane-${key}`).focus();
        stage.draw();
        if (key === 'fn') {
          // A new map has a new frame: keep the compass inside it (the frame is laid out by the draw above).
          place(s, [s.probeX, s.probeY]);
          if (strolling) startGlide();
          stage.sync();
          stage.draw();
        }
      }),
    );
  }

  // ---- Settings and presets -------------------------------------------------------------------

  const defaults = {
    fn: 0,
    picture: GRID,
    bend: 100,
    grid: true,
    flow: true,
    thick: 0.12,
    camber: 0.1,
    probeX: 0.7,
    probeY: 0.45,
  };
  const presetSettings = [
    { fn: 0, picture: GRID, bend: 100 },
    { fn: 1, picture: GRID, bend: 100 },
    { fn: 2, picture: GRID, bend: 100 },
    { fn: 0, picture: PICTURES.indexOf('fish'), bend: 100, grid: true },
    { fn: JOUKOWSKI, picture: WING, bend: 100, flow: true, thick: 0.12, camber: 0.1, grid: false },
  ];
  const badges = ['z²', '1/z', 'eᶻ', '&gt;&lt;&gt;', 'z+1/z'];
  const presets = t.presets.map((p, i) => ({ ...p, badge: badges[i], settings: presetSettings[i] }));
  const isDefault = (s) => Object.keys(defaults).every((k) => s[k] === defaults[k]);

  room = W.defineRoom({
    id: 'plane',
    symbol: 'ℂ',
    theme: 'shape',
    eyebrow: t.eyebrow,
    name: t.name,
    tagline: t.tagline,
    accent: { background: '#1d2433', border: '#8fb8ff', color: '#cfe0ff' },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.sceneLabel,
    sceneName: t.formulas[0],
    tip: t.tip,
    actionLabel: t.actionLabel,
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { ...t.connection, go: 'ribbon' },

    defaults,
    ranges: {
      fn: [0, FUNCTIONS.length - 1, 'integer'],
      picture: [0, PICTURES.length - 1, 'integer'],
      bend: [0, 100],
      thick: [0, 0.3],
      camber: [-0.3, 0.3],
      probeX: [-5, 5],
      probeY: [-5, 5],
    },
    defaultPreset: 0,
    presets,

    guests: [
      {
        ...t.guests[0],
        bio: 'Riemann',
        color: '#8fb8ff',
        sketch: {
          hairStyle: 'receding',
          hair: '#2f241c',
          beard: 'full',
          skin: '#f0cfb2',
          brows: 'bold',
          backdrop: '#dfe4ec',
        },
      },
    ],

    insight: t.insight,

    controls,
    bindControls,
    readouts,
    draw,
    preview,

    init() {
      // Play sends the compass walking again, even after the visitor has moved it.
      $('scene-play').addEventListener('click', () => {
        if (!W.stage.isShowing(room)) return;
        if (W.stage.playing) resumeStroll();
        else strolling = false;
      });
    },

    enter(s, stage) {
      morph = null;
      grabbed = null;
      // The very first visit, with nothing shared, opens with the plane bending and the compass
      // walking. Shared links, saved moments, and later visits keep the compass where it was put.
      const fresh = firstVisit && !reduced && isDefault(s);
      firstVisit = false;
      strolling = fresh && stage.playing;
      startGlide();
      // The compass is kept inside its panel by draw(), which the stage calls right after this with
      // the canvas measured (here the stage may still hold another size, so clamping now could move it wrongly).
      if (fresh) startBend(s, stage);
    },

    step(dt, s, stage) {
      if (morph) {
        morph.elapsed += dt;
        s.bend = Math.round(bentBy(s) * 100);
        if (morph.elapsed >= BEND_TIME) {
          morph = null;
          s.bend = 100;
        }
        showBend(s);
        stage.sync();
      }
      if (strolling && !grabbed) walk(dt, s);
      readouts(s);
    },

    onInput(s) {
      morph = null;
    },

    onPreset(s, stage) {
      // The preset may change the map: keep the compass inside the new map's panel, not the old one's.
      keepInside(s, stage.width, stage.height);
      if (strolling) startGlide();
      startBend(s, stage);
    },

    /** "Bend it": watch the plane bend from the identity to f. */
    action: startBend,

    /** "Start again": bend again from the start, and send the compass walking. */
    reset(s, stage) {
      startBend(s, stage); // while paused, this shows the bent plane at once and stays paused
      resumeStroll();
    },

    pointer: {
      down(p, s, stage) {
        if (!layout) return;
        const q = [p.x * stage.width, p.y * stage.height],
          P = layout.z;
        if (q[0] < P.x || q[0] > P.x + P.w || q[1] < P.y || q[1] > P.y + P.h) return;
        const base = P.px([s.probeX, s.probeY]);
        // Grab the compass where it is, or, with a tap elsewhere on the left, bring it there.
        grabbed =
          Math.hypot(q[0] - base[0], q[1] - base[1]) < arrowFor(P) + 10 ? [base[0] - q[0], base[1] - q[1]] : [0, 0];
        take();
        place(s, P.at([q[0] + grabbed[0], q[1] + grabbed[1]]));
        stage.sync();
        stage.draw();
      },
      move(p, { dragging, mouse }, s, stage) {
        const canvas = $('scene-canvas');
        if (!layout) return;
        const q = [p.x * stage.width, p.y * stage.height];
        if (grabbed && dragging) {
          place(s, layout.z.at([q[0] + grabbed[0], q[1] + grabbed[1]]));
          stage.sync();
          stage.draw();
        }
        if (mouse) {
          const base = layout.z.px([s.probeX, s.probeY]);
          canvas.classList.toggle('plane-grab', Math.hypot(q[0] - base[0], q[1] - base[1]) < arrowFor(layout.z) + 10);
        }
      },
      up() {
        grabbed = null;
      },
      leave() {
        $('scene-canvas').classList.remove('plane-grab');
      },
      /** Arrow keys walk the compass in small steps. */
      arrow(dx, dy, s, stage) {
        const P = layout?.z,
          step = P ? 12 / P.scale : 0.08;
        take();
        place(s, [s.probeX + dx * step, s.probeY - dy * step]);
        stage.sync();
      },
    },
  });
})();
