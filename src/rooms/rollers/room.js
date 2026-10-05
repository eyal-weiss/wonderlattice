/* Room · Rollers that aren't round: shapes of constant width as rollers, as wheels, as a drill, and rolled once round. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, TAU, clamp } = W;
  const M = W.models.rollers;
  const t = W.text('rollers');
  const reduced = W.prefersReducedMotion();

  const SPIN = 0.8; // radians a second the rollers turn
  const DRILL_SPIN = 0.55; // radians a second the drill turns
  const RACE_TIME = 7; // seconds for the race's one turn
  const RACE_REST = 2.5; // seconds at the finish before it starts again
  const ROWS = 240; // rows the drill's sweep is measured on
  const PHASES = [0, 0.9, 1.8]; // how far each roller has turned at the start, so they don't move in step
  const LEAST = M.area(M.reuleaux(3)) / (Math.PI / 4); // the Reuleaux triangle's area, as a share of the circle's
  const CORNER_VIEW = 0.15; // the square's corner shown magnified, as a share of its side
  const CIRCLE = 0,
    LOPSIDED = 3;

  const INK = '#dfe7ef',
    MUTED = '#98aab7',
    GROUND = '#7a6a55',
    EARTH = '#161c27',
    TICK = '#3a4656',
    STONE = '#d6b37a',
    RIM = '#f3dcb0',
    GRAIN = '#8a6a44',
    HUB = '#3b2a18',
    PLANK = '#a8763f',
    PLANK_TOP = '#c9945a',
    CRATE = '#4f6d92',
    CRATE_EDGE = '#8fb0d8',
    MAST = '#c9d4e0',
    LEVEL = '#7fe0c0',
    WAVE = '#ff8f7a',
    METAL = '#c9b48a',
    HOLE = '#141b27',
    STEEL = '#a7b6c6',
    PATH = '#f0c43c';
  // The race's four shapes, each in its own colour.
  const RACE_COLOURS = ['#8fb8f0', '#f2a65a', '#c49be8', '#7fe0c0'];

  let shape = null, // the shape being shown, with its outline and measures
    shapeKey = '',
    racers = null, // the race's four shapes
    racersKey = '',
    psi = 0, // how far the rollers have turned
    phi = 0, // how far the drill has turned
    grid = null, // where the drill has been
    share = 0, // the share of the square drilled so far
    race = 0, // seconds into the race
    lay = null,
    held = false, // a drag in progress
    announced = '';

  // ------------------------------------------------------------ shapes

  /** A shape with what the room needs of it: its outline for drawing, how to space it, and its measures. */
  function dressed(kind, s) {
    const raw = M.shape(kind, { seed: s.seed, lines: s.lines, corner: s.round / 100 });
    return {
      kind,
      raw,
      points: M.outline(raw, 0.03),
      fine: M.outline(raw, 0.01),
      spacing: M.spacing(raw),
      bob: M.bob(raw),
      area: M.area(raw) / (Math.PI / 4),
      full: null, // the share a whole turn of the drill sweeps, measured when first needed
      path: null, // the path of its middle in the drill
    };
  }

  /** The shape for the current settings, made again only when they change. */
  function current(s) {
    const key = `${s.shape}/${s.seed}/${s.lines}/${s.round}`;
    if (key !== shapeKey) {
      shapeKey = key;
      shape = dressed(s.shape, s);
      grid = null;
    }
    return shape;
  }

  function raceShapes(s) {
    const key = `${s.seed}/${s.lines}/${s.round}`;
    if (key !== racersKey) {
      racersKey = key;
      racers = [0, 1, 2, 3].map((kind) => dressed(kind, s));
    }
    return racers;
  }

  const rounded = (s) => s.round > 0;
  const nameOf = (s) => (s.view === 2 ? t.names.race : t.names[s.view ? 'drill' : 'rollers'](s.shape, rounded(s)));
  const number = (x, digits = 0) =>
    x.toLocaleString(W.numberLocale, { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const percent = (value, digits = 1) => t.percent(number(value * 100, value === 0 ? 0 : digits));

  // ------------------------------------------------------------ the drill

  /** Start the drill again, at no turn; with reduced motion it shows a whole turn's hole at once. */
  function freshDrill() {
    const sh = shape;
    grid = M.sweepFor(ROWS);
    phi = 0;
    M.sweep(grid, M.placed(sh.raw, 0, sh.fine));
    share = M.swept(grid);
    if (reduced) share = M.drill(grid, sh.raw, 0, M.period(sh.kind), sh.fine);
  }

  function turnDrill(next) {
    if (!grid) freshDrill();
    share = M.drill(grid, shape.raw, phi, next, shape.fine);
    phi = next;
  }

  /** What a whole turn drills, and the path of the drill's middle: measured once per shape. */
  function drillFacts(sh) {
    if (sh.full === null) sh.full = M.coverage(sh.raw, sh.kind, ROWS);
    if (!sh.path) {
      sh.path = [];
      const end = M.period(sh.kind);
      for (let k = 0; k <= 240; k++) sh.path.push(M.inSquare(sh.raw, (k / 240) * end));
    }
    return sh;
  }

  // ------------------------------------------------------------ layout

  /**
   * Where things go. On a laptop only the top of the picture is likely on screen, so the main scene fits in `seen`
   * and anything extra goes below it. On phones the picture is short and wide.
   */
  function layout(width, height) {
    const seen = Math.min(height, Math.max(0.58 * width, 300));
    const laneH = seen / 2;
    const size = Math.max(40, Math.min((laneH - 36) / 1.75, width / 6.8, 130));
    const rowH = seen / 4;
    const raceSize = Math.max(20, Math.min(rowH - 30, (width - 40) / (Math.PI + 1.4), 110));
    const wide = width >= 600;
    const square = wide ? Math.min(seen - 24, width * 0.56, 560) : Math.max(100, Math.min(height - 24, width - 100));
    return {
      width,
      height,
      seen,
      size, // a roller's width in pixels
      centre: Math.round(width * 0.56),
      lanes: [0, 1].map((i) => ({ top: i * laneH, ground: (i + 1) * laneH - 14 })),
      close: height - seen >= 230 ? { top: seen + 10, h: height - seen - 20 } : null,
      rowH,
      raceSize,
      wide,
      square: { x: 12, y: 12, size: square },
    };
  }

  // ------------------------------------------------------------ drawing helpers

  /** A shape's outline as a canvas path: its middle at (x, y), `size` pixels wide, turned anticlockwise by `turn`. */
  function trace(ctx, points, x, y, size, turn) {
    const c = Math.cos(turn),
      sn = Math.sin(turn);
    ctx.beginPath();
    points.forEach(([px, py], i) => {
      const X = x + size * (px * c - py * sn),
        Y = y - size * (px * sn + py * c);
      if (i) ctx.lineTo(X, Y);
      else ctx.moveTo(X, Y);
    });
    ctx.closePath();
  }

  /** A point of the shape (its own coordinates) on the canvas. */
  function at(px, py, x, y, size, turn) {
    const c = Math.cos(turn),
      sn = Math.sin(turn);
    return [x + size * (px * c - py * sn), y - size * (px * sn + py * c)];
  }

  function label(ctx, words, x, y, w, { colour = INK, weight = 600, size = 13, align = 'left' } = {}) {
    ctx.font = `${weight} ${size}px system-ui, sans-serif`;
    ctx.fillStyle = colour;
    ctx.textAlign = align;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(words, x, y, w);
  }

  function ground(ctx, y, width, travel, step) {
    ctx.fillStyle = EARTH;
    ctx.fillRect(0, y, width, 10);
    ctx.strokeStyle = TICK;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const shift = ((travel % step) + step) % step;
    for (let x = -shift; x < width + step; x += step) {
      ctx.moveTo(x, y + 2);
      ctx.lineTo(x - 6, y + 9);
    }
    ctx.stroke();
    ctx.strokeStyle = GROUND;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  /** A roller or wheel: the shape, a line to show it turning, and its middle. */
  function body(ctx, sh, x, y, size, turn, { alpha = 1, fill = STONE, spokes = false } = {}) {
    ctx.globalAlpha = alpha;
    trace(ctx, sh.points, x, y, size, turn);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = RIM;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.strokeStyle = spokes ? HUB : GRAIN;
    ctx.lineWidth = spokes ? 2.5 : 1.5;
    ctx.beginPath();
    for (let k = 0; k < (spokes ? 3 : 1); k++) {
      const [px, py] = M.point(sh.raw, Math.PI / 2 + (k * TAU) / 3);
      const [X, Y] = at(px * 0.86, py * 0.86, x, y, size, turn);
      ctx.moveTo(x, y);
      ctx.lineTo(X, Y);
    }
    ctx.stroke();
    ctx.fillStyle = HUB;
    ctx.beginPath();
    ctx.arc(x, y, spokes ? 4 : 2.5, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  /** A crate with a pen on a mast; returns where the pen's tip is. */
  function crate(ctx, x, bottom, size) {
    const w = 1.1 * size,
      h = 0.38 * size;
    ctx.fillStyle = CRATE;
    ctx.fillRect(x - w / 2, bottom - h, w, h);
    ctx.strokeStyle = CRATE_EDGE;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - w / 2 + 0.75, bottom - h + 0.75, w - 1.5, h - 1.5);
    ctx.beginPath();
    ctx.moveTo(x - w / 2 + 3, bottom - 3);
    ctx.lineTo(x + w / 2 - 3, bottom - h + 3);
    ctx.stroke();
    const tip = bottom - h - 0.2 * size;
    ctx.strokeStyle = MAST;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, bottom - h);
    ctx.lineTo(x, tip);
    ctx.stroke();
    ctx.fillStyle = MAST;
    ctx.beginPath();
    ctx.arc(x, tip, 3.5, 0, TAU);
    ctx.fill();
    return tip;
  }

  function plank(ctx, x0, x1, top, thick) {
    ctx.fillStyle = PLANK;
    ctx.fillRect(x0, top, x1 - x0, thick);
    ctx.fillStyle = PLANK_TOP;
    ctx.fillRect(x0, top, x1 - x0, Math.max(2, thick * 0.25));
  }

  // ------------------------------------------------------------ the rollers and the wheels

  function drawRollers(ctx, s) {
    const sh = current(s),
      { size, centre, lanes, width } = lay;
    const S = sh.spacing,
      span = 3 * S;

    // Above: a plank on three rollers. It moves ψ widths while each roller drifts about its steady pace, ψ/2.
    const top = lanes[0];
    ground(ctx, top.ground, width, psi * size, 0.5 * size);
    const plankTop = top.ground - size - 0.12 * size;
    const pen = plankTop - 0.38 * size - 0.2 * size;
    ctx.strokeStyle = LEVEL;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(8, pen);
    ctx.lineTo(centre, pen);
    ctx.stroke();
    PHASES.forEach((phase, i) => {
      const turned = psi + phase,
        r = M.roll(sh.raw, turned);
      let rel = (i - 0.75) * S + r.x - turned / 2 - psi / 2;
      rel = ((((rel + span / 2) % span) + span) % span) - span / 2;
      // A roller leaving the back of the plank fades away and comes back at the front.
      const alpha = clamp((span / 2 - Math.abs(rel)) / (0.2 * S), 0, 1);
      body(ctx, sh, centre + rel * size, top.ground - r.y * size, size, r.turn, { alpha });
    });
    plank(ctx, centre - (span / 2 + 0.15) * size, centre + (span / 2 + 0.15) * size, plankTop, 0.12 * size);
    crate(ctx, centre, plankTop, size);
    label(ctx, t.labels.rollers, 12, top.top + 18, width - 24);

    // Below: the same shape as wheels fixed to axles through their middles. The cart rides on the axles.
    const low = lanes[1];
    const r = M.roll(sh.raw, psi);
    ground(ctx, low.ground, width, r.x * size, 0.5 * size);
    const axle = (rr) => low.ground - rr.y * size;
    const bed = 0.07 * size;
    const penAt = (rr) => axle(rr) - bed - 0.38 * size - 0.2 * size;
    // The pen's line: where the cart was, back to the left edge.
    ctx.strokeStyle = sh.kind === CIRCLE ? LEVEL : WAVE;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(centre, penAt(r));
    for (let k = 1; k < 400; k++) {
      const back = M.roll(sh.raw, psi - k * 0.025),
        x = centre - (r.x - back.x) * size;
      ctx.lineTo(x, penAt(back));
      if (x < 8) break;
    }
    ctx.stroke();
    const wheelX = 0.95 * S * size;
    plank(ctx, centre - wheelX - 0.6 * size, centre + wheelX + 0.6 * size, axle(r) - bed, 2 * bed);
    crate(ctx, centre, axle(r) - bed, size);
    for (const side of [-1, 1]) body(ctx, sh, centre + side * wheelX, axle(r), size, r.turn, { spokes: true });
    label(
      ctx,
      sh.kind === CIRCLE ? t.labels.axlesRound : t.labels.axles(percent(sh.bob)),
      12,
      low.top + 18,
      width - 24,
    );

    if (lay.close) closeUp(ctx, sh, lay.close);
  }

  /**
   * On a tall picture, below: the shape up close, turning between two parallel lines that always touch it, and the
   * lines it was drawn from, with the arcs' centres where they cross.
   */
  function closeUp(ctx, sh, box) {
    const { width } = lay;
    label(ctx, t.labels.close, 12, box.top + 18, width - 24);
    const size = Math.min(box.h - 70, width * 0.36, 240);
    if (size < 60) return;
    const x = width * 0.3,
      y = box.top + 40 + size * 0.62;
    const turn = -psi * 0.5;
    // The two jaws: tangent lines facing straight up and straight down.
    const up = y - size * M.h(sh.raw, Math.PI / 2 - turn),
      down = y + size * M.h(sh.raw, -Math.PI / 2 - turn);
    if (sh.raw.lines.length) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, size * 0.95, 0, TAU);
      ctx.clip();
      ctx.strokeStyle = 'rgba(152, 170, 183, 0.55)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const line of sh.raw.lines) {
        const [a, b] = [-1.2, 1.2].map((d) =>
          at(line.x + d * Math.cos(line.angle), line.y + d * Math.sin(line.angle), x, y, size, turn),
        );
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
      }
      ctx.stroke();
      ctx.restore();
    }
    trace(ctx, sh.points, x, y, size, turn);
    ctx.fillStyle = 'rgba(214, 179, 122, 0.25)';
    ctx.fill();
    ctx.strokeStyle = RIM;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = PATH;
    for (const arc of sh.raw.arcs) {
      if (!sh.raw.lines.length) break;
      const [X, Y] = at(arc.cx, arc.cy, x, y, size, turn);
      ctx.beginPath();
      ctx.arc(X, Y, 3, 0, TAU);
      ctx.fill();
    }
    ctx.strokeStyle = MAST;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (const yy of [up, down]) {
      ctx.moveTo(x - size * 0.8, yy);
      ctx.lineTo(x + size * 0.8, yy);
    }
    ctx.stroke();
    // The width between the jaws, as an arrow.
    const ax = x + size * 0.72;
    ctx.strokeStyle = LEVEL;
    ctx.fillStyle = LEVEL;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ax, up + 2);
    ctx.lineTo(ax, down - 2);
    ctx.stroke();
    for (const [yy, d] of [
      [up + 2, 1],
      [down - 2, -1],
    ]) {
      ctx.beginPath();
      ctx.moveTo(ax, yy);
      ctx.lineTo(ax - 4, yy + 7 * d);
      ctx.lineTo(ax + 4, yy + 7 * d);
      ctx.fill();
    }
    label(ctx, t.labels.width, ax + 8, (up + down) / 2 + 4, size * 0.5, { colour: LEVEL, weight: 500 });
    if (sh.raw.lines.length)
      label(ctx, t.labels.lines, x + size * 1.05, y + 4, width - x - size * 1.05 - 12, {
        colour: MUTED,
        weight: 500,
        size: 12,
      });
  }

  // ------------------------------------------------------------ the drill

  /** The drilled region: each row's stretch, down the right and back up the left, in square units. */
  function drilledPath(ctx, toX, toY) {
    const { n, left, right } = grid;
    ctx.beginPath();
    ctx.moveTo(toX(right[0]), toY(0.5));
    for (let j = 0; j < n; j++) ctx.lineTo(toX(right[j]), toY(M.rowY(n, j)));
    ctx.lineTo(toX(right[n - 1]), toY(-0.5));
    ctx.lineTo(toX(left[n - 1]), toY(-0.5));
    for (let j = n - 1; j >= 0; j--) ctx.lineTo(toX(left[j]), toY(M.rowY(n, j)));
    ctx.lineTo(toX(left[0]), toY(0.5));
    ctx.closePath();
  }

  /** The square, the hole drilled so far, the path of the drill's middle, and the drill. */
  function squareScene(ctx, sh, toX, toY, scale) {
    ctx.fillStyle = METAL;
    ctx.fillRect(toX(-0.5), toY(0.5), scale, scale);
    drilledPath(ctx, toX, toY);
    ctx.fillStyle = HOLE;
    ctx.fill();
    ctx.strokeStyle = PATH;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    sh.path.forEach(([x, y], i) => (i ? ctx.lineTo : ctx.moveTo).call(ctx, toX(x), toY(y)));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    M.placed(sh.raw, phi, sh.points).forEach(([x, y], i) => (i ? ctx.lineTo : ctx.moveTo).call(ctx, toX(x), toY(y)));
    ctx.closePath();
    ctx.globalAlpha = 0.88;
    ctx.fillStyle = STEEL;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#eef3f8';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    const [cx, cy] = M.inSquare(sh.raw, phi);
    ctx.fillStyle = HUB;
    ctx.beginPath();
    ctx.arc(toX(cx), toY(cy), 3, 0, TAU);
    ctx.fill();
  }

  function drawDrill(ctx, s) {
    const sh = drillFacts(current(s));
    if (!grid) freshDrill();
    const { x, y, size } = lay.square;
    const toX = (u) => x + (u + 0.5) * size,
      toY = (v) => y + (0.5 - v) * size;
    squareScene(ctx, sh, toX, toY, size);
    ctx.strokeStyle = '#eef3f8';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, size, size);

    const sx = x + size + (lay.wide ? 28 : 12),
      sw = lay.width - sx - 12;
    if (sw < 40) return;
    label(ctx, percent(share), sx, y + (lay.wide ? 40 : 26), sw, { size: lay.wide ? 34 : 20, weight: 500 });
    if (sw < 110) return;
    label(ctx, t.readout.drilled, sx, y + (lay.wide ? 62 : 44), sw, { colour: MUTED, weight: 500, size: 12 });
    if (!lay.wide) return;
    // A corner, magnified: the drill never quite reaches it.
    const box = Math.min(sw, size - 110, 260);
    if (box < 90) return;
    const top = y + 100,
      zoom = box / CORNER_VIEW;
    label(ctx, t.labels.corner(Math.round(zoom / size)), sx, top - 10, sw, { colour: MUTED, weight: 500, size: 12 });
    ctx.save();
    ctx.beginPath();
    ctx.rect(sx, top, box, box);
    ctx.clip();
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(sx, top, box, box);
    squareScene(
      ctx,
      sh,
      (u) => sx + (u + 0.5) * zoom,
      (v) => top + (0.5 - v) * zoom,
      zoom,
    );
    ctx.restore();
    ctx.strokeStyle = '#eef3f8';
    ctx.lineWidth = 1;
    ctx.strokeRect(sx + 0.5, top + 0.5, box - 1, box - 1);
    // Where the magnified corner is in the square.
    ctx.strokeStyle = 'rgba(238, 243, 248, 0.6)';
    ctx.strokeRect(x, y, CORNER_VIEW * size, CORNER_VIEW * size);
  }

  // ------------------------------------------------------------ the race

  function drawRace(ctx, s) {
    const shapes = raceShapes(s),
      { rowH, raceSize: size, width } = lay;
    const turned = TAU * clamp(race / RACE_TIME, 0, 1);
    // On a wide picture the race sits in the middle, with room after the finish for the shapes' names.
    const left = lay.wide ? Math.max(14, (width - (Math.PI + 2.6) * size) / 2) : 14;
    const start = left + 0.62 * size,
      finish = start + Math.PI * size,
      names = finish + 0.95 * size + 6;
    shapes.forEach((sh, k) => {
      const floor = (k + 1) * rowH - 10;
      ground(ctx, floor, width, 0, 0.5 * size);
      const first = M.roll(sh.raw, 0),
        r = M.roll(sh.raw, turned);
      // The rim rolled out: the ground it has touched, from the start to where it touches now.
      const ink = start + (r.contact - first.contact) * size;
      ctx.strokeStyle = RACE_COLOURS[k];
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(start, floor - 2);
      ctx.lineTo(ink, floor - 2);
      ctx.stroke();
      body(ctx, sh, start + (r.x - first.contact) * size, floor - r.y * size, size, r.turn, {
        fill: RACE_COLOURS[k],
      });
      const chosen = k === s.shape;
      label(ctx, t.shapes[k], names, floor - 8, width - names - 8, {
        colour: chosen ? INK : MUTED,
        weight: chosen ? 700 : 500,
        size: 12,
      });
    });
    // The start and the finish, one rim's length apart.
    ctx.strokeStyle = MUTED;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(start, 6);
    ctx.lineTo(start, 4 * rowH - 6);
    ctx.stroke();
    ctx.strokeStyle = PATH;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(finish, 20);
    ctx.lineTo(finish, 4 * rowH - 6);
    ctx.stroke();
    ctx.setLineDash([]);
    label(ctx, t.labels.finish, finish, 14, width - finish - 8, {
      colour: PATH,
      weight: 600,
      size: 12,
      align: 'center',
    });
  }

  // ------------------------------------------------------------ the whole picture

  function draw(ctx, s, stage) {
    const { width, height } = stage;
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    lay = layout(width, height);
    if (s.view === 1) drawDrill(ctx, s);
    else if (s.view === 2) drawRace(ctx, s);
    else drawRollers(ctx, s);
    // The drill's share changes as it turns.
    if (s.view === 1) {
      const words = t.status.drill(percent(share));
      if ($('scene-status').textContent !== words) $('scene-status').textContent = words;
    }
  }

  /** The home card: a plank level on Reuleaux triangles, its pen drawing a straight line. */
  function preview(ctx, width, height) {
    const sh = dressed(1, { seed: 1, lines: 4, round: 0 });
    const size = Math.min(height / 2.3, width / 5);
    const floor = height * 0.5 + size * 0.95,
      centre = width / 2;
    ground(ctx, floor, width, 0, 0.5 * size);
    const span = 3 * sh.spacing;
    PHASES.forEach((phase, i) => {
      const r = M.roll(sh.raw, phase);
      body(ctx, sh, centre + ((i - 1) * sh.spacing + r.x - phase / 2) * size, floor - r.y * size, size, r.turn);
    });
    const top = floor - 1.12 * size;
    plank(ctx, centre - (span / 2 + 0.15) * size, centre + (span / 2 + 0.15) * size, top, 0.12 * size);
    const pen = crate(ctx, centre, top, size);
    ctx.strokeStyle = LEVEL;
    ctx.lineWidth = Math.max(2, size * 0.04);
    ctx.beginPath();
    ctx.moveTo(0, pen);
    ctx.lineTo(centre, pen);
    ctx.stroke();
  }

  // ------------------------------------------------------------ panel

  const presetSettings = [
    { view: 0, shape: 1, round: 0 },
    { view: 1, shape: 1, round: 0 },
    { view: 2, shape: 1, round: 0 },
  ];
  const presetIndex = (s) => (s.shape === 1 && s.round === 0 ? s.view : -1);

  /** A row of buttons choosing one value of a setting. */
  const choices = (key, title, names, value) =>
    `<div class="control wide"><span class="rollers-label" id="rollers-${key}">${title}</span>` +
    `<div class="rollers-choices" role="group" aria-labelledby="rollers-${key}">` +
    names
      .map(
        (name, i) =>
          `<button type="button" class="button" data-${key}="${i}" aria-pressed="${i === value}">${name}</button>`,
      )
      .join('') +
    '</div></div>';

  function controls(s, stage) {
    return (
      choices('view', t.view, t.views, s.view) +
      choices('shape', t.shape, t.shapes, s.shape) +
      (s.shape === LOPSIDED ? stage.slider('lines', t.lines, 3, 7, 1, s.lines, '', t.linesHint) : '') +
      (s.shape === CIRCLE ? '' : stage.slider('round', t.corners, 0, 40, 1, s.round, '%', t.cornersHint)) +
      // Not a live region: it is rebuilt on every change. Each new shape's result is announced once.
      '<div class="wide readout rollers-readout" id="rollers-readout"></div>'
    );
  }

  /** Say once what the new shape or view shows. */
  function settle(s) {
    const sh = current(s),
      name = nameOf(s);
    const words =
      s.view === 2
        ? t.announce.race
        : s.view === 1
          ? t.announce.drill(name, percent(drillFacts(sh).full))
          : sh.kind === CIRCLE
            ? t.announce.round(name)
            : t.announce.rollers(name, percent(sh.bob));
    if (words !== announced) W.announce(words);
    announced = words;
  }

  /** After a choice: the shape, the drill and the race start again, and the panel shows the new choices. */
  function changed(s, stage, focus) {
    current(s);
    if (s.view === 1) freshDrill();
    race = reduced ? RACE_TIME : 0;
    stage.setChosen(presetIndex(s));
    settle(s);
    stage.refresh();
    stage.draw();
    if (focus) $('scene-controls').querySelector(focus)?.focus();
  }

  function bindControls(panel, s, stage) {
    for (const key of ['view', 'shape'])
      panel.querySelectorAll(`[data-${key}]`).forEach((button) =>
        button.addEventListener('click', () => {
          const value = Number(button.dataset[key]);
          if (value === s[key]) return;
          s[key] = value;
          changed(s, stage, `[data-${key}="${value}"]`);
        }),
      );
  }

  function readouts(s) {
    const sh = current(s);
    $('scene-name').textContent = nameOf(s);
    $('scene-label').textContent = t.sceneLabels[s.view];
    if (s.view !== 1) $('scene-status').textContent = s.view === 2 ? t.status.race : t.status.rollers;
    const box = $('rollers-readout');
    if (!box) return;
    const row = (name, value) => `<span>${name}</span><strong>${value}</strong>`;
    let big, rows, rule;
    if (s.view === 1) {
      const full = drillFacts(sh).full;
      big =
        sh.kind === CIRCLE
          ? t.readout.drillRound
          : sh.kind === 1 && !rounded(s)
            ? t.readout.drill
            : t.readout.drillOther;
      rows =
        row(t.readout.full, t.readout.fullValue(percent(full))) +
        row(t.readout.area, t.readout.areaValue(percent(sh.area)));
      rule = t.readout.drillRule;
    } else if (s.view === 2) {
      big = t.readout.race;
      rows = row(t.readout.rims, t.readout.rimsValue) + row(t.readout.least, t.readout.leastValue(percent(LEAST)));
      rule = t.readout.raceRule;
    } else {
      big = t.readout.level;
      rows =
        row(t.readout.plank, t.readout.plankValue) +
        row(t.readout.cart, t.readout.cartValue(percent(sh.bob))) +
        row(t.readout.rim, t.readout.rimValue(number(M.perimeter(sh.raw), 2))) +
        row(t.readout.area, t.readout.areaValue(percent(sh.area)));
      rule = t.readout.widthRule;
    }
    box.innerHTML = `<p class="rollers-big">${big}</p><div class="rollers-rows">${rows}</div><p class="rollers-rule">${rule}</p>`;
  }

  // ------------------------------------------------------------ moving by hand

  /** Roll, turn the drill or move the race on by `amount`: radians, or seconds in the race. */
  function move(s, amount, stage) {
    if (s.view === 1) turnDrill(phi + amount);
    else if (s.view === 2) race = clamp(race + amount, 0, RACE_TIME);
    else psi += amount;
    stage.draw();
  }

  /** A new lopsided shape, from new random lines. */
  function lopsided(s, stage) {
    let seed;
    do seed = 1 + Math.floor(Math.random() * 9999);
    while (seed === s.seed);
    s.seed = seed;
    s.shape = LOPSIDED;
    changed(s, stage);
  }

  W.defineRoom({
    id: 'rollers',
    symbol: '◭',
    theme: 'shape',
    added: '2026-10-04',
    eyebrow: t.eyebrow,
    name: t.name,
    tagline: t.tagline,
    accent: { background: '#22201c', border: STONE, color: RIM },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.sceneLabels[0],
    sceneName: t.names.rollers(1, false),
    tip: t.tip,
    actionLabel: t.actionLabel,
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { ...t.connection, go: 'wheels' },

    // view: 0 rollers, 1 the drill, 2 the race; shape: 0 circle, 1 triangle, 2 pentagon, 3 lopsided (from `lines`
    // random lines, drawn from `seed`); round: the corners' radius, in % of the width.
    defaults: { view: 0, shape: 1, seed: 7, lines: 4, round: 0 },
    ranges: {
      view: [0, 2, 'integer'],
      shape: [0, 3, 'integer'],
      seed: [1, 9999, 'integer'],
      lines: [3, 7, 'integer'],
      round: [0, 40, 'integer'],
    },
    defaultPreset: 0,
    presets: t.presets.map((p, i) => ({ ...p, badge: ['◭', '◩', 'π'][i], settings: presetSettings[i] })),

    guests: [
      {
        ...t.guests[0],
        color: '#d6b37a',
        sketch: {
          hairStyle: 'receding',
          hair: '#cfc6b8',
          skin: '#efcfb2',
          beard: 'full',
          moustache: true,
          backdrop: '#2a2219',
        },
      },
      {
        ...t.guests[1],
        bio: 'Euler',
        color: '#f7c998',
        sketch: { hairStyle: 'wig', hair: '#d0c8b8', skin: '#e8c8a4', backdrop: '#2e2415' },
      },
      {
        ...t.guests[2],
        bio: 'Barbier',
        color: '#8fb8f0',
        sketch: { hairStyle: 'short', hair: '#3a2e26', skin: '#ecc9a8', beard: 'short', backdrop: '#1d2633' },
      },
    ],

    insight: t.insight,

    controls,
    bindControls,
    readouts,

    enter(s, stage) {
      held = false;
      current(s);
      if (s.view === 1 && !grid) freshDrill();
      if (reduced && !race) race = RACE_TIME;
      stage.draw();
    },

    step(dt, s) {
      if (held) return;
      if (s.view === 1) turnDrill(phi + dt * DRILL_SPIN);
      else if (s.view === 2) {
        race += dt;
        if (race > RACE_TIME + RACE_REST) race = 0;
      } else psi += dt * SPIN;
    },

    draw,
    preview,

    action: lopsided,
    reset(s, stage) {
      psi = 0;
      race = reduced ? RACE_TIME : 0;
      current(s);
      freshDrill();
      stage.draw();
    },
    onPreset(s, stage) {
      current(s);
      freshDrill();
      race = reduced ? RACE_TIME : 0;
      settle(s);
      stage.draw();
    },
    onInput(s, stage) {
      // A slider reshapes the shape: the drill starts again.
      current(s);
      stage.setChosen(presetIndex(s));
      if (s.view === 1) freshDrill();
      stage.draw();
    },

    pointer: {
      // A finger rolls the plank on its lane, or turns the drill on its square; anywhere else it scrolls the page.
      drag(p, s, stage) {
        if (!lay) return false;
        const x = p.x * stage.width,
          y = p.y * stage.height;
        if (s.view === 0) return y < lay.lanes[0].ground + 10;
        const { x: left, y: top, size } = lay.square;
        return s.view === 1 && x >= left && x <= left + size && y >= top && y <= top + size;
      },
      down(p, s, stage, e) {
        held = !(e && e.button > 0);
      },
      move(p, { dx, dragging }, s, stage) {
        if (!held || !dragging || !lay) return;
        if (s.view === 1) move(s, (2 * dx) / lay.square.size, stage);
        else if (s.view === 2) move(s, (dx / (Math.PI * lay.raceSize)) * RACE_TIME, stage);
        else move(s, dx / lay.size, stage);
      },
      up() {
        held = false;
      },
      arrow(dx, dy, s, stage) {
        if (dy) {
          const next = clamp(s.shape + dy, 0, 3);
          if (next !== s.shape) {
            s.shape = next;
            changed(s, stage);
          }
          return;
        }
        move(s, dx * (s.view === 1 ? 0.05 : s.view === 2 ? 0.25 : 0.15), stage);
      },
      key(e, s, stage) {
        if (e.key !== 'Enter') return false;
        lopsided(s, stage);
        return true;
      },
    },
  });
})();
