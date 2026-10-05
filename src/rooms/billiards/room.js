/* Room · The table that forgets: the same shot on an ellipse and on a stadium. Only one keeps its twins together. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, TAU, clamp } = W;
  const M = W.models.billiards;
  const t = W.text('billiards');

  const SPEED = 4; // table units (half the table's height) per second, at speed 1
  const AHEAD = 300; // paused, or with reduced motion, a new shot is shown this far along
  const TAIL = 3; // the glowing tail behind each ball, in table units
  const WAIT = 1.2; // seconds between a pocketed shot and the next
  const SINK = 0.3; // seconds a pocketed ball takes to drop
  const GOLDEN = 137.508; // degrees between successive shots from the focus, so they never repeat
  const PATH_LIMIT = 40000; // bounce points kept for redrawing the long exposure
  const METRES = 0.5; // one table unit, if the tables were 2 metres long
  const SAMPLE = 0.2; // seconds between points on the chart
  const HISTORY_LIMIT = 20000;
  const SPOT = Math.sqrt(3) / 2; // the foci, in the table's own proportions (±√3 of the ellipse's 2)
  const BALL = '#fff3d6',
    TWIN = '#6fd6ff',
    PARTED = '#f0a27a',
    LINES = { ellipse: '#a8e6c1', stadium: '#ffb38a' },
    FELT = '#0f3328',
    RAIL = '#6b4a2e';

  // Each table's state: its shape, its balls and their recent corners, the long exposure, and what happened.
  const tables = { ellipse: null, stadium: null };
  const both = () => [tables.ellipse, tables.stadium];
  let generation = 0, // bumped to start the same shot again
    aim = null, // a shot being aimed: { u, v, angle, moved, s }
    quiet = false, // true while running ahead, so nothing is announced
    shown = {}; // text last written to each readout, so the page is only touched when it changes

  const keyOf = (kind, s) => [s.sx, s.sy, s.aim, s.pocket, kind === 'stadium' ? s.flat : '', generation].join('|');
  const shapeOf = (kind, s) => (kind === 'ellipse' ? M.ellipse() : M.stadium(s.flat / 100));
  /** Where shots start on a table, and its pocket: the foci, in the table's proportions. */
  const pocketOf = (T) => ({ x: SPOT * T.shape.halfWidth, y: 0, r: M.POCKET });

  function restart(kind, s, stage) {
    const T = {
      kind,
      key: keyOf(kind, s),
      shape: shapeOf(kind, s),
      balls: [],
      corners: [],
      path: [],
      capped: false,
      pen: null,
      shots: 0,
      sunk: [], // bounces each pocketed shot took, most recent last
      wait: 0,
      partedAt: null,
      time: 0, // seconds since the shot
      history: [{ time: 0, gap: 0 }], // the twins' gap, sampled for the chart
      exposure: tables[kind]?.exposure ?? null,
      view: tables[kind]?.view ?? null,
    };
    if (T.exposure) T.exposure.key = ''; // repainted when next drawn
    tables[kind] = T;
    shoot(T, s);
    if (!stage.playing) runAhead(T, s, AHEAD);
  }

  /** Every table whose shot or shape has changed starts again. */
  function ensure(s, stage) {
    for (const kind of ['ellipse', 'stadium']) if (tables[kind]?.key !== keyOf(kind, s)) restart(kind, s, stage);
  }

  /** Launch the table's next shot: a ball and its twin, or, with the pocket, one ball in a fresh direction. */
  function shoot(T, s) {
    const p = M.place(T.shape, s.sx, s.sy);
    const angle = ((s.aim + (s.pocket ? T.shots * GOLDEN : 0)) * Math.PI) / 180;
    T.balls = s.pocket ? [M.launch(T.shape, p.x, p.y, angle)] : M.twins(T.shape, p.x, p.y, angle);
    T.corners = T.balls.map(() => [{ x: p.x, y: p.y }]);
    if (!T.capped) T.path.push(null, { x: p.x, y: p.y });
    T.pen = { x: p.x, y: p.y };
    T.shots++;
    T.wait = 0;
  }

  /** Add a point to the shot's path, and paint the stretch that leads to it onto the long exposure. */
  function record(T, x, y) {
    if (!T.capped) {
      T.path.push({ x, y });
      T.capped = T.path.length >= PATH_LIMIT;
    }
    paint(T, x, y);
  }

  function paint(T, x, y) {
    const e = T.exposure;
    if (e?.key && T.pen) line(e.ctx, T.pen, { x, y });
    T.pen = { x, y };
  }

  function line(c, p, q) {
    c.beginPath();
    c.moveTo(p.x, p.y);
    c.lineTo(q.x, q.y);
    c.stroke();
  }

  /** Roll a table on by `seconds`. */
  function advance(T, s, seconds) {
    const pocket = s.pocket ? pocketOf(T) : null;
    const lead = T.balls[0];
    if (pocket && lead.sunk) {
      T.wait += seconds;
      if (T.wait >= WAIT) shoot(T, s);
      return;
    }
    const distance = seconds * SPEED * s.speed;
    T.time += seconds;
    T.balls.forEach((ball, i) => {
      const corners = T.corners[i];
      M.advance(T.shape, ball, distance, {
        pocket,
        visit(x, y) {
          corners.push({ x, y });
          if (corners.length > 24) corners.shift();
          if (i === 0) record(T, x, y);
        },
      });
    });
    if (lead.sunk) {
      record(T, lead.x, lead.y);
      T.sunk.push(lead.bounces);
    } else paint(T, lead.x, lead.y);
    if (pocket) return;
    const gap = M.distance(lead, T.balls[1]);
    if (T.time - T.history.at(-1).time >= SAMPLE && T.history.length < HISTORY_LIMIT)
      T.history.push({ time: T.time, gap });
    if (T.partedAt === null && gap > M.PARTED) {
      T.partedAt = lead.bounces;
      if (T.kind === 'stadium' && !quiet && tables.ellipse?.partedAt === null) W.announce(t.announceParted(T.partedAt));
    }
  }

  /** Run a table on quickly, so a paused picture already shows what happens. */
  function runAhead(T, s, units) {
    quiet = true;
    const seconds = units / (SPEED * s.speed);
    for (let done = 0; done < seconds; done += 0.05) advance(T, s, 0.05);
    quiet = false;
  }

  /**
   * Layout: on a wide picture the tables sit side by side at the top, where they are seen first, with the chart
   * below; on a narrow one they are stacked, with shorter labels, and the chart only if there's room. The chart
   * grows a little on a tall picture; any height still left over is shared evenly above the tables, between them and
   * the chart, and below it, so the picture fills its frame without stretching anything.
   */
  function layout(cw, ch, small) {
    const pad = Math.max(8, Math.round(Math.min(cw, ch) * 0.03));
    const halfW = Math.max(2, tables.stadium.shape.halfWidth);
    const side = cw >= 520;
    const labelH = Math.round(small * (side ? 3 : 1.6)),
      legendH = small + (side ? 14 : 8),
      rail = 14; // room for the rail round each table
    const fit = (w, h) => Math.max(1, Math.min((w - rail) / (2 * halfW), (h - rail) / 2));
    let scale, boxes;
    if (side) {
      const w = (cw - 3 * pad) / 2;
      scale = fit(w, ch - labelH - legendH - 2 * pad);
      boxes = [0, 1].map((i) => ({ x: pad + i * (w + pad), y: pad + labelH, w, h: 2 * scale + rail }));
    } else {
      const w = cw - 2 * pad;
      scale = fit(w, (ch - 2 * labelH - legendH - 3 * pad) / 2);
      const h = 2 * scale + rail;
      boxes = [0, 1].map((i) => ({ x: pad, y: pad + labelH + i * (h + labelH + pad), w, h }));
    }
    let bottom = boxes[1].y + boxes[1].h;
    const room = ch - bottom - legendH - 2 * pad;
    const chartH = room >= 110 ? Math.min(room, Math.max(300, ch * 0.4)) : 0;
    const gap = Math.max(0, (room - chartH) / (chartH ? 3 : 2));
    for (const box of boxes) box.y += gap;
    bottom += gap;
    both().forEach((T, i) => {
      const box = boxes[i],
        cx = box.x + box.w / 2;
      T.view = { cx, cy: box.y + box.h / 2, scale, labelX: side ? cx - T.shape.halfWidth * scale : pad, side };
    });
    const legendY = bottom + legendH / 2,
      chartY = bottom + legendH + pad + gap;
    const chart = chartH ? { x: pad, y: chartY, w: cw - 2 * pad, h: chartH } : null;
    return { legendY, chart };
  }

  const screen = (T, p) => ({ x: T.view.cx + p.x * T.view.scale, y: T.view.cy - p.y * T.view.scale });

  function outline(ctx, T, grow = 0) {
    const { cx, cy, scale } = T.view,
      sh = T.shape;
    ctx.beginPath();
    if (sh.kind === 'ellipse') ctx.ellipse(cx, cy, sh.a * scale + grow, sh.b * scale + grow, 0, 0, TAU);
    else {
      const h = sh.half * scale,
        r = sh.radius * scale + grow;
      ctx.moveTo(cx - h, cy - r);
      ctx.lineTo(cx + h, cy - r);
      ctx.arc(cx + h, cy, r, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(cx - h, cy + r);
      ctx.arc(cx - h, cy, r, Math.PI / 2, (3 * Math.PI) / 2);
      ctx.closePath();
    }
  }

  /**
   * The long exposure: the shot's whole path, painted faintly onto its own canvas so that where it passes often
   * glows. Repainted from the stored path when the table's size changes.
   */
  function exposureFor(ctx, T) {
    const density = ctx.getTransform().a || 1;
    const { scale } = T.view,
      sh = T.shape,
      margin = 4;
    const w = Math.ceil((2 * sh.halfWidth * scale + 2 * margin) * density),
      h = Math.ceil((2 * sh.halfHeight * scale + 2 * margin) * density);
    const key = [w, h, scale, density].join();
    T.exposure ??= { canvas: document.createElement('canvas'), key: '' };
    const e = T.exposure;
    if (e.key !== key) {
      e.canvas.width = w;
      e.canvas.height = h;
      e.ctx = e.canvas.getContext('2d');
      const k = density * scale;
      e.ctx.setTransform(
        k,
        0,
        0,
        -k,
        density * (sh.halfWidth * scale + margin),
        density * (sh.halfHeight * scale + margin),
      );
      e.ctx.globalCompositeOperation = 'lighter';
      e.ctx.strokeStyle = 'rgba(255, 222, 160, 0.11)';
      e.ctx.lineWidth = 1.4 / scale;
      e.key = key;
      let prev = null;
      for (const p of T.path) {
        if (p && prev) line(e.ctx, prev, p);
        prev = p;
      }
      const lead = T.balls[0];
      if (prev && !T.capped && !lead.sunk) line(e.ctx, prev, lead);
      T.pen = { x: lead.x, y: lead.y };
      e.margin = margin;
    }
    return e;
  }

  /** The last TAIL units of a ball's path, from its head backwards. */
  function tail(ball, corners) {
    const points = [{ x: ball.x, y: ball.y }];
    let length = 0;
    for (let i = corners.length - 1; i >= 0 && length < TAIL; i--) {
      const p = points.at(-1),
        q = corners[i],
        d = Math.hypot(q.x - p.x, q.y - p.y);
      if (length + d > TAIL) {
        const f = (TAIL - length) / d;
        points.push({ x: p.x + (q.x - p.x) * f, y: p.y + (q.y - p.y) * f });
        break;
      }
      length += d;
      points.push(q);
    }
    return points;
  }

  /** A tail that fades from the head: drawn in bands, each fainter than the last. */
  function drawTail(ctx, T, points, colour, width) {
    const at = [0];
    for (let i = 1; i < points.length; i++)
      at.push(at[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
    const total = at.at(-1);
    if (!total) return;
    /** The point `d` along the tail from its head. */
    const along = (d) => {
      let i = 1;
      while (i < points.length - 1 && at[i] < d) i++;
      const p = points[i - 1],
        q = points[i],
        f = at[i] > at[i - 1] ? (d - at[i - 1]) / (at[i] - at[i - 1]) : 0;
      return { x: p.x + (q.x - p.x) * f, y: p.y + (q.y - p.y) * f };
    };
    const bands = 6;
    ctx.strokeStyle = colour;
    ctx.lineWidth = width;
    for (let b = 0; b < bands; b++) {
      const from = (total * b) / bands,
        to = (total * (b + 1)) / bands;
      const band = [along(from), ...points.filter((p, i) => at[i] > from && at[i] < to), along(to)].map((p) =>
        screen(T, p),
      );
      ctx.globalAlpha = 0.85 * (1 - b / bands);
      ctx.beginPath();
      band.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  /** The hidden curve the ellipse's shot never crosses, dashed. */
  function drawCaustic(ctx, T) {
    const lead = T.balls[0];
    const c = M.caustic(T.shape, M.momenta(T.shape, lead));
    const { cx, cy, scale } = T.view;
    ctx.save();
    ctx.strokeStyle = 'rgba(160, 225, 255, 0.8)';
    ctx.lineWidth = 1.4;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    if (c.kind === 'ellipse') ctx.ellipse(cx, cy, c.a * scale, c.b * scale, 0, 0, TAU);
    else if (c.kind === 'hyperbola') {
      // Both branches, as far as the rail: x = ±a cosh u, y = b sinh u.
      const sh = T.shape,
        end = (u) => (c.a * Math.cosh(u)) ** 2 / sh.a ** 2 + (c.b * Math.sinh(u)) ** 2 / sh.b ** 2 - 1;
      let lo = 0,
        hi = 8;
      for (let k = 0; k < 50; k++) end((lo + hi) / 2) < 0 ? (lo = (lo + hi) / 2) : (hi = (lo + hi) / 2);
      for (const side of [1, -1])
        for (let k = 0; k <= 40; k++) {
          const u = -lo + (2 * lo * k) / 40;
          const x = cx + side * c.a * Math.cosh(u) * scale,
            y = cy - c.b * Math.sinh(u) * scale;
          k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
    } else {
      const f = T.shape.focus * scale;
      ctx.moveTo(cx - f, cy);
      ctx.lineTo(cx + f, cy);
    }
    ctx.stroke();
    ctx.restore();
  }

  function dot(ctx, x, y, r, colour) {
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }

  function drawTable(ctx, T, s, small) {
    const { scale } = T.view,
      sh = T.shape;
    const rail = clamp(scale * 0.09, 4, 12);
    // The rail, then the felt over its inner half, then the exposure on the felt.
    outline(ctx, T, rail / 2);
    ctx.fillStyle = RAIL;
    ctx.fill();
    outline(ctx, T);
    ctx.fillStyle = FELT;
    ctx.fill();
    const e = exposureFor(ctx, T);
    if (s.exposure) {
      const x = T.view.cx - sh.halfWidth * scale - e.margin,
        y = T.view.cy - sh.halfHeight * scale - e.margin;
      ctx.drawImage(
        e.canvas,
        x,
        y,
        e.canvas.width / (ctx.getTransform().a || 1),
        e.canvas.height / (ctx.getTransform().a || 1),
      );
    }
    if (T.kind === 'ellipse' && s.caustic) drawCaustic(ctx, T);
    const ballR = clamp(scale * 0.05, 3, 6);
    // The foci, the pocket, and the spot shots start from.
    if (s.pocket) {
      const pocket = screen(T, pocketOf(T));
      dot(ctx, pocket.x, pocket.y, Math.max(5, M.POCKET * scale), '#030605');
      ctx.strokeStyle = 'rgba(210, 190, 150, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
      const from = screen(T, M.place(T.shape, s.sx, s.sy));
      dot(ctx, from.x, from.y, 2.5, '#f4f5e9');
    }
    // The foci, where nothing else marks them already.
    if (T.kind === 'ellipse' && (s.caustic || s.pocket))
      for (const f of M.foci(sh).filter(
        (f) => !s.pocket || (f.x < 0 && M.distance(f, M.place(sh, s.sx, s.sy)) > 0.05),
      )) {
        const p = screen(T, f);
        dot(ctx, p.x, p.y, 2.5, 'rgba(160, 225, 255, 0.9)');
      }
    // Where this shot began: a faint ring.
    const from = screen(T, M.place(T.shape, s.sx, s.sy));
    ctx.strokeStyle = 'rgba(244, 245, 233, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(from.x, from.y, ballR + 5, 0, TAU);
    ctx.stroke();
    // The balls: twin first, as a ring around where it is; the shot on top, as a dot.
    for (let i = T.balls.length - 1; i >= 0; i--) {
      const ball = T.balls[i];
      const colour = i === 0 ? BALL : TWIN;
      let head = screen(T, ball),
        r = ballR;
      if (ball.sunk) {
        const f = clamp(T.wait / SINK, 0, 1),
          into = screen(T, pocketOf(T));
        head = { x: head.x + (into.x - head.x) * f, y: head.y + (into.y - head.y) * f };
        r *= 1 - f;
      } else drawTail(ctx, T, tail(ball, T.corners[i]), colour, i === 0 ? 2.2 : 1.6);
      if (r <= 0.2) continue;
      if (i === 0) {
        ctx.globalAlpha = 0.25;
        dot(ctx, head.x, head.y, r * 2.2, colour);
        ctx.globalAlpha = 1;
        dot(ctx, head.x, head.y, r, colour);
      } else {
        ctx.strokeStyle = colour;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(head.x, head.y, r + 3, 0, TAU);
        ctx.stroke();
      }
    }
    // A shot being aimed: a dashed arrow from its start.
    if (aim) {
      const p = M.place(T.shape, aim.u, aim.v),
        a = (aim.angle * Math.PI) / 180,
        start = screen(T, p),
        length = Math.min(1.4, 0.9 * sh.halfWidth) * scale;
      const end = { x: start.x + Math.cos(a) * length, y: start.y - Math.sin(a) * length };
      ctx.strokeStyle = BALL;
      ctx.lineWidth = 1.6;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      for (const turn of [0.45, -0.45]) {
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(end.x - Math.cos(a + turn) * 10, end.y + Math.sin(a + turn) * 10);
      }
      ctx.stroke();
      dot(ctx, start.x, start.y, ballR, BALL);
    }
    // The table's name and what its twins are doing, just above it: on two lines, or on one when stacked.
    const top = T.view.cy - sh.halfHeight * scale - rail / 2 - 5,
      left = T.view.labelX;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = `600 ${small + (T.view.side ? 2 : 1)}px system-ui`;
    ctx.fillStyle = '#e8efe6';
    ctx.fillText(t[T.kind], left, T.view.side ? top - small - 3 : top);
    const after = T.view.side ? 0 : ctx.measureText(t[T.kind]).width + 8;
    ctx.font = `${small}px system-ui`;
    ctx.fillStyle = T.partedAt !== null ? PARTED : '#a9c4b6';
    ctx.fillText(tableStatus(T, s), left + after, top);
  }

  function tableStatus(T, s) {
    const lead = T.balls[0];
    if (s.pocket) return lead.sunk ? t.pocketIn(lead.bounces) : t.pocketRolling(lead.bounces);
    return T.partedAt === null ? t.together(T.balls[0].bounces) : t.parted(T.partedAt);
  }

  function drawLegend(ctx, s, cw, y, small) {
    ctx.font = `${small}px system-ui`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    const items = s.pocket
      ? [
          [BALL, t.legendBall],
          [null, t.legendPocket],
        ]
      : [
          [BALL, t.legendBall],
          [TWIN, t.legendTwin],
        ];
    const widths = items.map(([, label]) => ctx.measureText(label).width + 26);
    let x = Math.max(8, (cw - widths.reduce((a, b) => a + b, 0)) / 2);
    items.forEach(([colour, label], i) => {
      if (colour === BALL) dot(ctx, x + 6, y, 4, BALL);
      else if (colour === TWIN) {
        ctx.strokeStyle = TWIN;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x + 6, y, 6, 0, TAU);
        ctx.stroke();
      } else dot(ctx, x + 6, y, 2.5, '#f4f5e9');
      ctx.fillStyle = '#a9b8c6';
      ctx.fillText(label, x + 16, y);
      x += widths[i];
    });
    ctx.textBaseline = 'alphabetic';
  }

  /** How far apart each pair of twins is, on a log scale: a straight climb means exponential growth. */
  function drawChart(ctx, box, small) {
    const lo = -5,
      hi = 1; // powers of ten, in metres on 2-metre tables
    const span = Math.max(30, tables.ellipse.time, tables.stadium.time);
    const x = (time) => box.x + (time / span) * box.w;
    const y = (gap) =>
      box.y + box.h - ((clamp(Math.log10(Math.max(gap * METRES, 1e-9)), lo, hi) - lo) / (hi - lo)) * box.h;
    ctx.fillStyle = 'rgba(20, 27, 36, 0.85)';
    ctx.fillRect(box.x, box.y, box.w, box.h);
    ctx.font = `${small}px system-ui`;
    ctx.lineWidth = 1;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    const fmt = (n) => n.toLocaleString(W.numberLocale);
    const marks = {
      '-5': t.length.mm(fmt(0.01)),
      '-3': t.length.mm(fmt(1)),
      '-1': t.length.cm(fmt(10)),
      0: t.length.m(fmt(1)),
    };
    for (let e = lo; e <= 0; e++) {
      ctx.strokeStyle = 'rgba(120, 138, 160, 0.18)';
      ctx.beginPath();
      ctx.moveTo(box.x, y(10 ** e / METRES));
      ctx.lineTo(box.x + box.w, y(10 ** e / METRES));
      ctx.stroke();
      if (marks[e] && box.h > 90) {
        ctx.fillStyle = '#7f8c99';
        ctx.fillText(marks[e], box.x + 6, y(10 ** e / METRES) - 2);
      }
    }
    // Where twins count as parted.
    ctx.strokeStyle = '#8d9aa8';
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(box.x, y(M.PARTED));
    ctx.lineTo(box.x + box.w, y(M.PARTED));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#a9b8c6';
    ctx.fillText(t.partedLine, box.x + box.w - 6, y(M.PARTED) - 2);
    for (const T of both()) {
      ctx.strokeStyle = LINES[T.kind];
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      T.history.forEach((h, i) => (i ? ctx.lineTo(x(h.time), y(h.gap)) : ctx.moveTo(x(h.time), y(h.gap))));
      ctx.stroke();
    }
    // Which line is which, in the top corner.
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    let right = box.x + box.w - 8;
    for (const T of [tables.stadium, tables.ellipse]) {
      ctx.fillStyle = LINES[T.kind];
      ctx.fillText(t[T.kind], right, box.y + 6);
      right -= ctx.measureText(t[T.kind]).width + 6;
      ctx.fillRect(right - 16, box.y + 6 + small / 2, 16, 2);
      right -= 30;
    }
    // What the chart shows, top left, if it fits beside the key; the time it covers, bottom right.
    ctx.textAlign = 'left';
    ctx.fillStyle = '#98aab7';
    if (ctx.measureText(t.chartLabel).width + 20 < right - box.x) ctx.fillText(t.chartLabel, box.x + 6, box.y + 6);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(t.seconds(Math.round(span)), box.x + box.w - 6, box.y + box.h - 4);
    ctx.textBaseline = 'alphabetic';
  }

  /** With the pocket: how many bounces each shot took to go in, the latest on the right. */
  function drawPockets(ctx, box, small) {
    ctx.fillStyle = 'rgba(20, 27, 36, 0.85)';
    ctx.fillRect(box.x, box.y, box.w, box.h);
    const most = Math.max(5, ...both().flatMap((T) => T.sunk.slice(-30)));
    const row = (box.h - small * 2 - 12) / 2;
    ctx.font = `${small}px system-ui`;
    both().forEach((T, r) => {
      const base = box.y + small + 8 + (r + 1) * row;
      const shots = T.sunk.slice(-30),
        bar = (box.w - 24) / 30;
      ctx.fillStyle = LINES[T.kind];
      shots.forEach((n, i) => {
        const h = Math.max(2, ((row - small - 6) * n) / most);
        ctx.fillRect(box.x + 12 + (30 - shots.length + i) * bar + 1, base - h, Math.max(1, bar - 2), h);
      });
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(t[T.kind], box.x + 8, base - row + 4);
    });
    ctx.fillStyle = '#98aab7';
    ctx.textBaseline = 'bottom';
    ctx.fillText(t.pocketChart, box.x + 6, box.y + box.h - 4);
    ctx.textBaseline = 'alphabetic';
  }

  /** A length in table units, as it would be on tables 2 metres long. */
  function length(units) {
    const m = units * METRES;
    const fmt = (x, digits) => x.toLocaleString(W.numberLocale, { maximumFractionDigits: digits });
    if (m < 1e-5) return t.length.tiny;
    if (m < 0.01) return t.length.mm(fmt(m * 1000, m < 0.001 ? 2 : 1));
    if (m < 1) return t.length.cm(fmt(m * 100, m < 0.1 ? 1 : 0));
    return t.length.m(fmt(m, 2));
  }

  function write(id, text) {
    if (shown[id] === text) return;
    const el = $(id);
    if (el) el.textContent = text;
    shown[id] = el ? text : undefined;
  }

  function readouts(s) {
    const E = tables.ellipse,
      S = tables.stadium;
    // Tables from before a change of settings (a preset, say) wait to start again; draw() says the new readouts.
    if (!E || !S || E.key !== keyOf('ellipse', s) || S.key !== keyOf('stadium', s)) return;
    write(
      'scene-status',
      s.pocket
        ? t.statusPocket(E.sunk.length, S.sunk.length)
        : S.partedAt === null
          ? t.statusTogether(S.balls[0].bounces)
          : E.partedAt === null
            ? t.statusParted(S.partedAt)
            : t.statusBoth,
    );
    const apart = $('billiards-apart'),
      pockets = $('billiards-pockets');
    if (apart) apart.hidden = s.pocket;
    if (pockets) pockets.hidden = !s.pocket;
    if (s.pocket) {
      const list = (T) =>
        T.sunk.length ? t.list(T.sunk.slice(-8).map((n) => n.toLocaleString(W.numberLocale))) : t.readout.none;
      write('billiards-in-ellipse', list(E));
      write('billiards-in-stadium', list(S));
    } else {
      write('billiards-gap-ellipse', length(M.distance(E.balls[0], E.balls[1])));
      write('billiards-gap-stadium', length(M.distance(S.balls[0], S.balls[1])));
    }
    write('billiards-curve', t.readout.curves[M.caustic(E.shape, M.momenta(E.shape, E.balls[0])).kind]);
  }

  function draw(ctx, s, stage) {
    ensure(s, stage);
    const { width: cw, height: ch } = stage;
    ctx.clearRect(0, 0, cw, ch);
    const small = Math.round(clamp(Math.min(cw, ch) / 30, 10, 13));
    const { legendY, chart } = layout(cw, ch, small);
    for (const T of both()) drawTable(ctx, T, s, small);
    drawLegend(ctx, s, cw, legendY, small);
    if (chart) (s.pocket ? drawPockets : drawChart)(ctx, chart, small);
    readouts(s);
  }

  /** The home card: the ellipse's ring and the stadium's scribble, each from the same shot. */
  function preview(ctx, width, height) {
    const shapes = [M.ellipse(), M.stadium(1)];
    const scale = Math.min((width - 24) / 2 / 4.3, (height - 16) / 2.3);
    shapes.forEach((sh, i) => {
      const cx = width / 4 + (i * width) / 2,
        cy = height / 2;
      const T = { shape: sh, view: { cx, cy, scale } };
      outline(ctx, T, 3);
      ctx.fillStyle = RAIL;
      ctx.fill();
      outline(ctx, T);
      ctx.fillStyle = FELT;
      ctx.fill();
      const [a, b] = M.twins(sh, -1, -0.75, (9 * Math.PI) / 180);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = 'rgba(255, 222, 160, 0.16)';
      ctx.lineWidth = 1;
      let p = screen(T, a);
      M.advance(sh, a, 220, {
        visit(x, y) {
          const q = screen(T, { x, y });
          line(ctx, p, q);
          p = q;
        },
      });
      ctx.restore();
      M.advance(sh, b, 220);
      const pa = screen(T, a),
        pb = screen(T, b);
      ctx.strokeStyle = TWIN;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(pb.x, pb.y, 5, 0, TAU);
      ctx.stroke();
      dot(ctx, pa.x, pa.y, 3, BALL);
    });
  }

  /** A new shot: somewhere new, in a new direction (with the pocket, from the same spot). */
  function newShot(s, stage) {
    if (!s.pocket) {
      const r = 0.8 * Math.sqrt(Math.random()),
        a = TAU * Math.random();
      s.sx = Math.round(r * Math.cos(a) * 1000) / 1000;
      s.sy = Math.round(r * Math.sin(a) * 1000) / 1000;
    }
    s.aim = Math.round(Math.random() * 3600) / 10;
    generation++;
    stage.setChosen(-1);
    stage.sync();
    stage.draw();
  }

  /** The table under a point on the canvas, and the point in that table's own proportions (−1 to 1). */
  function locate(p, stage) {
    const X = p.x * stage.width,
      Y = p.y * stage.height;
    const near = both()
      .map((T) => {
        const x = (X - T.view.cx) / T.view.scale,
          y = (T.view.cy - Y) / T.view.scale;
        return { T, x, y, u: x / T.shape.halfWidth, v: y / T.shape.halfHeight };
      })
      .sort((a, b) => Math.hypot(a.u, a.v) - Math.hypot(b.u, b.v))[0];
    return { ...near, X, Y };
  }

  /** Is a point on the canvas on (or just around) one of the tables? Only there does a press aim a shot. */
  const onTable = (p, stage) => {
    const at = locate(p, stage);
    return Math.abs(at.u) <= 1.08 && Math.abs(at.v) <= 1.15;
  };

  const normalise = (degrees) => Math.round((((degrees % 360) + 360) % 360) * 10) / 10;

  W.defineRoom({
    id: 'billiards',
    symbol: '◯',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'shape',
    added: '2026-09-30',
    tagline: t.tagline,
    accent: { background: '#12281f', border: '#5ec28f', color: '#c6f0d6' },

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
    connection: { ...t.connection, go: 'weather' },

    defaults: { sx: -0.5, sy: -0.75, aim: 9, flat: 100, speed: 1, pocket: false, exposure: true, caustic: false },
    ranges: { sx: [-1, 1], sy: [-1, 1], aim: [-360, 360], flat: [0, 200, 'integer'], speed: [0.25, 4] },
    defaultPreset: 0,
    presets: [
      { badge: '2', settings: { sx: -0.5, sy: -0.75, aim: 9, flat: 100, pocket: false } },
      { badge: '◎', settings: { sx: -SPOT, sy: 0, aim: 50, flat: 100, pocket: true } },
      { badge: '5', settings: { sx: -0.5, sy: -0.75, aim: 9, flat: 5, pocket: false } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Birkhoff',
        color: '#5ec28f',
        sketch: { hairStyle: 'receding', hair: '#4a3b30', skin: '#ecc9a7', brows: 'bold', backdrop: '#17291f' },
      },
      {
        ...t.guests[1],
        bio: 'Poncelet',
        color: '#e8c07a',
        sketch: { hairStyle: 'curly', hair: '#2f2621', skin: '#efcfb1', backdrop: '#2a2419' },
      },
    ],

    insight: t.insight,

    controls: (s, stage) =>
      stage.slider('flat', t.flat, 0, 200, 1, s.flat, '%', t.flatHint) +
      stage.slider('speed', t.speed, 0.25, 4, 0.25, s.speed, '×') +
      stage.check('pocket', t.pocket, s.pocket) +
      stage.check('exposure', t.exposure, s.exposure) +
      stage.check('caustic', t.caustic, s.caustic) +
      '<div class="wide readout" id="billiards-readout">' +
      `<div id="billiards-apart"><div>${t.readout.apart}</div>` +
      `<div>${t.readout.ellipse}: <strong id="billiards-gap-ellipse"></strong></div>` +
      `<div>${t.readout.stadium}: <strong id="billiards-gap-stadium"></strong></div></div>` +
      `<div id="billiards-pockets" hidden><div>${t.readout.pocket}</div>` +
      `<div>${t.readout.ellipse}: <strong id="billiards-in-ellipse"></strong></div>` +
      `<div>${t.readout.stadium}: <strong id="billiards-in-stadium"></strong></div></div>` +
      `<div>${t.readout.curve}: <strong id="billiards-curve"></strong></div></div>`,

    bindControls(panel, s, stage) {
      shown = {}; // the panel was rebuilt, so every readout needs writing again
      // Turning the pocket on starts the shots at the other focus, as on Loop.
      panel.querySelector('[data-check="pocket"]').addEventListener('change', (e) => {
        if (!e.target.checked) return;
        s.sx = -SPOT;
        s.sy = 0;
        stage.draw();
      });
    },
    readouts,

    step(dt, s, stage) {
      ensure(s, stage);
      for (const T of both()) advance(T, s, dt);
    },
    draw,
    preview,
    action: newShot,
    reset(s, stage) {
      generation++;
      ensure(s, stage);
    },
    onPreset() {
      generation++;
    },

    pointer: {
      // Aiming drags on the tables, so touches there don't scroll the page; elsewhere a finger scrolls as usual.
      drag: (p, s, stage) => onTable(p, stage),
      down(p, s, stage) {
        if (!onTable(p, stage)) return;
        const at = locate(p, stage);
        let { u, v } = at;
        // With the pocket, a press near the white spot starts exactly at the focus.
        if (s.pocket && Math.hypot(at.x + SPOT * at.T.shape.halfWidth, at.y) < 0.35) {
          u = -SPOT;
          v = 0;
        } else {
          u = Math.round(clamp(u, -1, 1) * 1000) / 1000;
          v = Math.round(clamp(v, -1, 1) * 1000) / 1000;
        }
        aim = { u, v, angle: s.aim, moved: false, s, T: at.T };
        stage.draw();
      },
      move(p, { dragging }, s, stage) {
        if (!aim || !dragging) return;
        const at = locate(p, stage);
        const start = screen(aim.T, M.place(aim.T.shape, aim.u, aim.v));
        const dx = at.X - start.x,
          dy = start.y - at.Y;
        if (Math.hypot(dx, dy) > 10) {
          aim.moved = true;
          aim.angle = normalise((Math.atan2(dy, dx) * 180) / Math.PI);
        }
        stage.draw();
      },
      up() {
        if (!aim) return;
        const { s } = aim;
        s.sx = aim.u;
        s.sy = aim.v;
        s.aim = aim.angle;
        aim = null;
        generation++;
        W.stage.setChosen(-1);
        W.stage.sync();
        W.stage.draw();
      },
      escape() {
        aim = null;
        W.stage.draw();
      },
      arrow(dx, dy, s, stage) {
        s.aim = normalise(s.aim - dx * 5);
        s.sy = Math.round(clamp(s.sy - dy * 0.1, -1, 1) * 1000) / 1000;
        stage.setChosen(-1);
        stage.sync();
      },
      key(e, s, stage) {
        if (e.key !== 'Enter') return false;
        newShot(s, stage);
        return true;
      },
    },
  });
})();
