/* Room · Square wheels, smooth ride: a cart with square wheels on its own road, beside the same cart on a flat road. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, TAU, clamp } = W;
  const M = W.models.wheels;
  const t = W.text('wheels');
  const reduced = W.prefersReducedMotion();

  const WHEEL = '#f2a65a',
    RIM = '#ffd9a8',
    HUB = '#3a2616',
    SKY = '#7fb7d9',
    GROUND = '#1b2c3e',
    DEEP = '#111c28',
    WATER = '#5fb3ff',
    GLASS = '#d9ecf7',
    TRACE = '#ffe08a',
    RED = '#ff5d6c',
    INK = '#f5f1e6',
    MUTED = '#a9b8c9',
    WOOD = '#c99a6b';
  // The rim and its road in matching pieces: each side of the wheel lands on the bump of its own colour.
  const TONES = [SKY, '#f7c98b'];
  const SPEED = 1.1, // how fast the cart goes, in wheel radii per second
    START = 0.3, // the wheels start 30% of the way from the top of one bump to the next (the triangle is then crashing)
    GAP = 2.2, // the cart's axles are at least this far apart (in radii), and a whole number of bumps
    PLANK = 1.2, // the cart's plank, or the single wheel's tray, this high above the axle
    CUP = 0.6, // the cup's height
    ABOVE = PLANK + 0.08 + CUP + 0.12, // what a lane holds above the axle, and below it
    BELOW = 1.3;
  // The drawn wheel's dots in settings and links: ra, rb, … rl (the trail takes names of letters only).
  const KEYS = Array.from({ length: M.SPOKES }, (_, k) => 'r' + 'abcdefghijkl'[k]);
  const SHAPES = ['heart', 'flower', 'egg', 'star', 'circle'];
  const GALLERY = [3, 4, 5, 6, 7, 8];
  const percentSettings = (radii) => Object.fromEntries(KEYS.map((k, i) => [k, Math.round(radii[i] * 100)]));
  const HEART = percentSettings(M.shapes.heart);

  // ---------- the wheels and their roads ----------

  const regular = {}; // sides → the wheel, its road, the flat ride and the crashes
  const drawnCache = {}; // radii → the same, for drawn wheels (the shapes to start from, and the visitor's)
  let current = null; // the visitor's drawn wheel, possibly still being dragged

  function regularSet(n) {
    if (!regular[n]) {
      const wheel = M.polygon(n),
        road = M.road(wheel);
      const spacing = Math.ceil(GAP / road.period) * road.period;
      regular[n] = { wheel, road, flat: M.flat(wheel), crash: M.crashes(road), spacing, longest: 1 };
    }
    return regular[n];
  }

  /** A drawn wheel's set. While a dot is being dragged, the crashes are looked for more coarsely, to keep up. */
  function drawnSet(radii, rough = false) {
    const key = radii.join(',');
    let set = drawnCache[key];
    if (!set) {
      const wheel = M.drawn(radii),
        road = M.road(wheel);
      set = { wheel, road, flat: M.flat(wheel), crash: null, spacing: 0, longest: M.longest(wheel), key };
      drawnCache[key] = set;
      // Dragging makes a new wheel at every step: forget the oldest, but keep the shapes to start from.
      const kept = new Set(SHAPES.map((k) => M.shapes[k].join(',')));
      const old = Object.keys(drawnCache).filter((k) => !kept.has(k));
      if (old.length > 40) delete drawnCache[old[0]];
    }
    if (!set.crash || (!rough && set.crash.rough)) {
      set.crash = M.crashes(set.road, rough ? 72 : 360);
      set.crash.rough = rough;
    }
    return set;
  }

  const radiiOf = (s) => KEYS.map((k) => s[k] / 100);
  const setFor = (s, rough) => (s.own ? drawnSet(radiiOf(s), rough) : regularSet(s.sides));
  const shapeNamed = (s) => SHAPES.find((k) => M.shapes[k].every((r, i) => Math.round(r * 100) === s[KEYS[i]]));
  const nameOf = (s) => (s.own ? (shapeNamed(s) ? t.shapes[shapeNamed(s)] : t.yourOwn) : t.sidesName(s.sides));
  const crashes = (set) => set.crash.deepest > 0;

  // ---------- the ride ----------

  let X = 0, // how far the cart has come, in radii
    anchor = 0, // a drawn wheel that changes shape keeps its place: its road and flat ride shift by these
    flatAnchor = 0,
    grab = -1, // the dot being dragged, or −1
    picked = -1, // the dot the arrow keys move, or −1
    hover = null,
    lens = 0, // how much the close-up shows (it fades in and out)
    keyboard = false;
  const splash = { amp: 0, phase: 0, vy: null, drops: [], seed: 7 };
  const last = { hit: null }; // where the close-up looked last, so it can fade out there
  let announced = ''; // the last result announced, so each is said once

  /** Where the cart starts: a regular wheel 30% of the way along a bump, a drawn one upright. */
  const startOf = (set) =>
    set.wheel.kind === 'polygon' ? M.along(set.road, set.road.start + START * set.road.turn) : 0;

  function restart(s) {
    X = startOf(setFor(s));
    anchor = flatAnchor = 0;
    splash.amp = 0;
    splash.vy = null;
    splash.drops.length = 0;
  }

  /** A drawn wheel changed shape: keep it where it was on both roads, so it doesn't jump. */
  function reshape(before, after) {
    if (!before || !after || before === after || before.wheel.kind !== 'drawn' || after.wheel.kind !== 'drawn') return;
    const theta = M.at(before.road, X - anchor).theta;
    anchor = X - M.along(after.road, theta);
    const alpha = M.flatAt(before.flat, X - flatAnchor).alpha;
    flatAnchor = X - M.flatAlong(after.flat, alpha);
  }

  /** A new wheel: paused, start it where it shows best; rolling, keep going. */
  function changed(s, stage, before) {
    const set = setFor(s, grab >= 0);
    if (!stage.playing && grab < 0 && picked < 0) restart(s);
    else if (before?.wheel.kind === 'drawn' && set.wheel.kind === 'drawn') reshape(before, set);
    else anchor = flatAnchor = 0;
    stage.setChosen(presetIndex(s));
    current = set;
  }

  const random = () => {
    splash.seed = (splash.seed * 16807) % 2147483647;
    return splash.seed / 2147483647;
  };

  // ---------- layout ----------

  /**
   * Where things go. A tall picture may show only its top at first, so both lanes fit in the part likely on screen,
   * and the row of wheels goes below them when there is room. On a phone, a drawn wheel gets the top lane to itself,
   * big enough to drag its dots.
   */
  function layout(width, height, s) {
    const narrow = width < 560;
    const seen = Math.min(height, Math.max(0.58 * width, 300));
    const pad = narrow ? 8 : 12,
      label = narrow ? 18 : 22,
      gap = narrow ? 8 : 14;
    const units = ABOVE + BELOW;
    const single = s.own && narrow;
    const room = seen - 2 * pad - (single ? label : 2 * label + gap);
    const share = single ? 1 : s.own ? 0.58 : 0.5;
    const cap = s.own ? (narrow ? 84 : 96) : 64;
    const span = s.own ? 2.4 : regularSet(s.sides).spacing + 2.3; // how wide the cart is, in radii
    const wide = s.own ? (narrow ? 0.5 : 0.4) : 0.58; // how much of the width the cart may take
    const R1 = Math.max(16, Math.min((room * share) / units, cap, (width * wide) / span));
    const lane = (top, R, kind) => ({ kind, top, label: top + 13, axle: top + label + ABOVE * R, R, cx: width * 0.42 });
    const own = lane(pad, R1, 'own');
    own.bottom = own.axle + BELOW * R1;
    let R2 = single ? R1 * 0.62 : Math.max(16, Math.min((room * (1 - share)) / units, cap, (width * 0.58) / span));
    if (!s.own) R2 = R1; // the same cart, at the same size
    const flat = lane(own.bottom + gap, R2, 'flat');
    flat.bottom = flat.axle + BELOW * R2;
    const lanes = [own];
    if (!single || height - flat.bottom >= 0) lanes.push(flat);
    // The close-up, at the top right of the first lane.
    const lensR = Math.max(28, Math.min(R1 * 1.05, 74, width * 0.13));
    const close = { x: width - lensR - pad - 2, y: own.top + label + lensR, r: lensR };
    // Below, when there is room: the row of wheels, then (for regular wheels) the hanging chain.
    const last = lanes[lanes.length - 1].bottom;
    const below = height - last;
    const items = s.own ? SHAPES.length : GALLERY.length;
    let gallery = null,
      chain = null;
    if (below >= 150) {
      const head = (narrow ? 26 : 40) + 22;
      const chainH = !s.own && below >= head + 150 + 30 + 200 ? Math.min(260, below - head - 150 - 30 - pad) : 0;
      const avail = below - head - (chainH ? chainH + 30 : 0) - pad;
      let cols = width / items >= 116 ? items : Math.ceil(items / 2);
      if (cols === items && avail >= 2 * 170) cols = Math.ceil(items / 2); // two rows of bigger wheels
      const rows = Math.ceil(items / cols),
        cellW = (width - 2 * pad) / cols,
        cellH = Math.min(rows > 1 && cols < items ? 190 : 150, avail / rows);
      const top = last + head - 22;
      if (cellH >= 96) {
        gallery = {
          top,
          cells: Array.from({ length: items }, (_, i) => ({
            x: pad + (i % cols) * cellW,
            y: top + 22 + Math.floor(i / cols) * cellH,
            w: cellW,
            h: cellH,
          })),
        };
        if (chainH) chain = { x: pad, y: top + 22 + rows * cellH + 30, w: width - 2 * pad, h: chainH };
      }
    }
    return { narrow, lanes, close, gallery, chain, width, height };
  }

  // ---------- drawing ----------

  function label(ctx, text, x, y, colour) {
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = 'rgba(10, 14, 21, 0.85)';
    ctx.strokeText(text, x, y);
    ctx.fillStyle = colour;
    ctx.fillText(text, x, y);
  }

  /** A view of the world: x along the road and y up, in radii, onto the canvas. */
  const view = (ox, oy, R) => ({ R, x: (wx) => ox + wx * R, y: (wy) => oy - wy * R });

  /** The wheel's rim, turned by alpha, as a path. */
  function rimPath(ctx, wheel, v, wx, wy, alpha) {
    ctx.beginPath();
    if (wheel.kind === 'polygon')
      wheel.outline().forEach(([phi, r], i) => {
        const x = v.x(wx + r * Math.cos(phi + alpha)),
          y = v.y(wy + r * Math.sin(phi + alpha));
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      });
    else
      for (let k = 0; k < 240; k++) {
        const phi = (k * TAU) / 240,
          r = wheel.radius(phi);
        const x = v.x(wx + r * Math.cos(phi + alpha)),
          y = v.y(wy + r * Math.sin(phi + alpha));
        if (k) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
    ctx.closePath();
  }

  /** The rim in pieces of alternating colour, matching its road. */
  function strokeRim(ctx, set, v, wx, wy, alpha) {
    const { wheel } = set;
    const at = (phi, r = wheel.radius(phi)) => [
      v.x(wx + r * Math.cos(phi + alpha)),
      v.y(wy + r * Math.sin(phi + alpha)),
    ];
    ctx.lineWidth = Math.max(2, v.R * 0.06);
    ctx.lineJoin = 'round';
    if (wheel.kind === 'polygon') {
      const corners = wheel.outline();
      corners.forEach(([phi], k) => {
        const from = at(corners[(k + wheel.n - 1) % wheel.n][0], 1),
          to = at(phi, 1);
        ctx.strokeStyle = TONES[toneAt(set, phi - Math.PI / wheel.n)];
        ctx.beginPath();
        ctx.moveTo(...from);
        ctx.lineTo(...to);
        ctx.stroke();
      });
      return;
    }
    const pieces = KEYS.length,
      steps = 20;
    for (let k = 0; k < pieces; k++) {
      ctx.strokeStyle = TONES[k % 2];
      ctx.beginPath();
      for (let j = 0; j <= steps; j++) {
        const [x, y] = at(((k + j / steps) * TAU) / pieces);
        if (j) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
  }

  function drawWheel(ctx, set, v, wx, wy, alpha, toned = false) {
    const { wheel } = set;
    rimPath(ctx, wheel, v, wx, wy, alpha);
    ctx.fillStyle = WHEEL;
    ctx.fill();
    ctx.lineWidth = Math.max(1.2, v.R * 0.045);
    ctx.strokeStyle = RIM;
    if (toned) strokeRim(ctx, set, v, wx, wy, alpha);
    else ctx.stroke();
    // Spokes to the corners, or to the dots, so the turning shows.
    const ends =
      wheel.kind === 'polygon'
        ? wheel.outline()
        : KEYS.map((_, k) => [(k * TAU) / KEYS.length, wheel.radius((k * TAU) / KEYS.length)]);
    ctx.strokeStyle = 'rgba(58, 38, 22, 0.55)';
    ctx.lineWidth = Math.max(1, v.R * 0.035);
    ctx.beginPath();
    for (const [phi, r] of ends) {
      ctx.moveTo(v.x(wx), v.y(wy));
      ctx.lineTo(v.x(wx + 0.92 * r * Math.cos(phi + alpha)), v.y(wy + 0.92 * r * Math.sin(phi + alpha)));
    }
    ctx.stroke();
    ctx.fillStyle = HUB;
    ctx.beginPath();
    ctx.arc(v.x(wx), v.y(wy), Math.max(2.5, v.R * 0.11), 0, TAU);
    ctx.fill();
  }

  /** Which colour a piece of rim (at the wheel's own angle φ) has: and so the piece of road it lands on. */
  function toneAt(set, phi) {
    const { wheel } = set;
    if (wheel.kind === 'polygon') {
      const side = Math.round((phi - set.road.start) / set.road.turn);
      return (((side % wheel.n) + wheel.n) % wheel.n) % 2;
    }
    return Math.floor((((phi % TAU) + TAU) % TAU) / (TAU / KEYS.length)) % 2;
  }

  /** The road from world x a to b, as points [x, y, θ]: θ is the rim point that lands there. */
  function roadPoints(set, a, b, shift, step) {
    const { road } = set;
    const pts = [];
    const n = road.x.length - 1;
    // Every road point, or every few when they would crowd closer than about a pixel and a half; the dips stay.
    let every = 1;
    while (every * 2 <= n / 2 && (road.period / n) * every * 2 * step < 1.5 && (n / 2) % (every * 2) === 0) every *= 2;
    const first = Math.floor((a - shift) / road.period),
      last = Math.floor((b - shift) / road.period);
    for (let rep = first; rep <= last; rep++)
      for (let i = rep === first ? 0 : every; i <= n; i += every) {
        const x = road.x[i] + rep * road.period + shift;
        if (x < a - road.period / n || x > b + road.period / n) continue;
        pts.push([x, road.y[i], road.theta[i] + rep * road.turn]);
      }
    return pts;
  }

  function fillGround(ctx, v, pts, floor, colour) {
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(v.x(x), v.y(y)) : ctx.moveTo(v.x(x), v.y(y))));
    ctx.lineTo(v.x(pts[pts.length - 1][0]), v.y(floor));
    ctx.lineTo(v.x(pts[0][0]), v.y(floor));
    ctx.closePath();
    ctx.fillStyle = colour;
    ctx.fill();
  }

  /** The road in the rim's colours, piece by piece. */
  function strokeToned(ctx, set, v, pts, width) {
    ctx.lineWidth = width;
    ctx.lineJoin = 'round';
    let tone = -1;
    for (let i = 1; i < pts.length; i++) {
      const next = toneAt(set, (pts[i - 1][2] + pts[i][2]) / 2);
      if (next !== tone) {
        if (tone >= 0) ctx.stroke();
        tone = next;
        ctx.strokeStyle = TONES[tone];
        ctx.beginPath();
        ctx.moveTo(v.x(pts[i - 1][0]), v.y(pts[i - 1][1]));
      }
      ctx.lineTo(v.x(pts[i][0]), v.y(pts[i][1]));
    }
    if (tone >= 0) ctx.stroke();
  }

  function strokeRoad(ctx, v, pts, colour, width) {
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(v.x(x), v.y(y)) : ctx.moveTo(v.x(x), v.y(y))));
    ctx.strokeStyle = colour;
    ctx.lineWidth = width;
    ctx.lineJoin = 'round';
    ctx.stroke();
  }

  /** Where the wheel and the ground overlap, in red: the wheel's rim as a clip, and the ground filled inside it. */
  function drawCrash(ctx, set, v, wx, alpha, shift) {
    ctx.save();
    rimPath(ctx, set.wheel, v, wx, 0, alpha);
    ctx.clip();
    const pts = roadPoints(set, wx - set.longest - 0.05, wx + set.longest + 0.05, shift, Infinity);
    fillGround(ctx, v, pts, -set.longest - 0.2, RED);
    ctx.restore();
  }

  /** A cup of water: its bottom at (x, y) on the canvas, upright or tilted, its surface sloshing by `slosh`. */
  function drawCup(ctx, x, y, R, slosh = 0) {
    const h = CUP * R,
      bottom = 0.19 * R,
      top = 0.25 * R;
    const cup = new Path2D();
    cup.moveTo(x - top, y - h);
    cup.lineTo(x - bottom, y);
    cup.lineTo(x + bottom, y);
    cup.lineTo(x + top, y - h);
    ctx.save();
    ctx.clip(cup);
    const level = y - 0.66 * h,
      tilt = slosh * 0.3 * h;
    ctx.beginPath();
    ctx.moveTo(x - top - 2, level + tilt);
    ctx.quadraticCurveTo(x, level - tilt * 0.2, x + top + 2, level - tilt);
    ctx.lineTo(x + top + 2, y + 2);
    ctx.lineTo(x - top - 2, y + 2);
    ctx.closePath();
    ctx.fillStyle = WATER;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = GLASS;
    ctx.lineWidth = Math.max(1.2, R * 0.04);
    ctx.stroke(cup);
  }

  /** The cart: posts from the axles up to a plank, with a cup in the middle. A single wheel has a fork and a tray. */
  function drawCart(ctx, v, wheels, axleY, slosh) {
    const R = v.R,
      cart = wheels.length > 1,
      plank = v.y(axleY + PLANK);
    const left = v.x(wheels[0]) - (cart ? 0.25 : 0.45) * R,
      right = v.x(wheels[wheels.length - 1]) + (cart ? 0.25 : 0.45) * R;
    ctx.strokeStyle = '#e8d3b8';
    ctx.lineWidth = Math.max(1.5, R * 0.06);
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (const wx of wheels)
      for (const side of cart ? [0] : [-1, 1]) {
        ctx.moveTo(v.x(wx) + side * 0.12 * R, v.y(axleY));
        ctx.lineTo(v.x(wx) + side * 0.3 * R, plank);
      }
    ctx.stroke();
    ctx.lineCap = 'butt';
    ctx.fillStyle = WOOD;
    ctx.fillRect(left, plank - 0.08 * R, right - left, 0.1 * R);
    drawCup(ctx, (left + right) / 2, plank - 0.08 * R, R, slosh);
  }

  /** The first lane: the wheels on their own road, the cup's path behind them, and any crash. */
  function drawOwnLane(ctx, lane, set, s, width, place, shift) {
    const { R, cx, axle } = lane;
    const d = set.spacing;
    const centre = place + d / 2;
    const v = view(cx - centre * R, axle, R);
    const a = centre - cx / R - 0.1,
      b = centre + (width - cx) / R + 0.1;
    const pts = roadPoints(set, a, b, shift, R);
    fillGround(ctx, v, pts, -BELOW - 0.05, GROUND);
    strokeToned(ctx, set, v, pts, Math.max(2, R * 0.06));
    // The cup's path: a level line.
    const cupY = v.y(PLANK + 0.08 + CUP * 0.4);
    ctx.save();
    ctx.strokeStyle = TRACE;
    ctx.globalAlpha = 0.85;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, cupY);
    ctx.lineTo(cx - 0.32 * R, cupY);
    ctx.stroke();
    ctx.restore();
    const pose = M.at(set.road, place - shift);
    const wheels = d ? [place, place + d] : [place];
    for (const wx of wheels) {
      drawWheel(ctx, set, v, wx, 0, pose.alpha, true);
      if (crashes(set)) drawCrash(ctx, set, v, wx, pose.alpha, shift);
    }
    drawCart(ctx, v, wheels, 0, 0);
    // A drawn wheel's dots go on top of its fork, to be dragged.
    if (s.own) drawWheelDots(ctx, set, v, place, pose.alpha);
  }

  function drawWheelDots(ctx, set, v, wx, alpha) {
    const { wheel } = set;
    KEYS.forEach((_, k) => {
      const phi = (k * TAU) / KEYS.length,
        r = wheel.radius(phi);
      const x = v.x(wx + r * Math.cos(phi + alpha)),
        y = v.y(r * Math.sin(phi + alpha));
      const on = k === grab || k === hover || (k === picked && keyboard);
      ctx.beginPath();
      ctx.arc(x, y, on ? 8 : 6, 0, TAU);
      ctx.fillStyle = on ? INK : '#fff4e2';
      ctx.fill();
      ctx.lineWidth = on ? 3 : 2;
      ctx.strokeStyle = on ? '#e0702a' : HUB;
      ctx.stroke();
      if (k === picked && keyboard) {
        ctx.beginPath();
        ctx.arc(x, y, 13, 0, TAU);
        ctx.strokeStyle = INK;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  }

  /** The second lane: the same wheels on a flat road, bobbing, and the cup's path behind them. */
  function drawFlatLane(ctx, lane, set, s, width) {
    const { R, cx } = lane;
    const ground = lane.axle + R; // the flat road, where the first lane's dips are
    const d = set.spacing;
    const centre = X + d / 2;
    const v = view(cx - centre * R, ground, R);
    ctx.fillStyle = GROUND;
    ctx.fillRect(0, ground, width, lane.bottom - ground);
    ctx.strokeStyle = SKY;
    ctx.lineWidth = Math.max(1.5, R * 0.05);
    ctx.beginPath();
    ctx.moveTo(0, ground);
    ctx.lineTo(width, ground);
    ctx.stroke();
    // The cup's path, from where the cart has been.
    const lift = PLANK + 0.08 + CUP * 0.4;
    ctx.save();
    ctx.strokeStyle = TRACE;
    ctx.globalAlpha = 0.85;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let sx = 0; sx <= cx - 0.32 * R; sx += 2) {
      const wx = centre + (sx - cx) / R;
      const h = M.flatAt(set.flat, wx - d / 2 - flatAnchor).height;
      if (sx) ctx.lineTo(sx, v.y(h + lift));
      else ctx.moveTo(sx, v.y(h + lift));
    }
    ctx.stroke();
    ctx.restore();
    const pose = M.flatAt(set.flat, X - flatAnchor);
    const wheels = d ? [X, X + d] : [X];
    for (const wx of wheels) drawWheel(ctx, set, v, wx, pose.height, pose.alpha);
    drawCart(ctx, v, wheels, pose.height, reduced ? 0 : splash.amp * Math.sin(splash.phase));
    // Splashed drops.
    ctx.fillStyle = WATER;
    for (const drop of splash.drops) {
      ctx.globalAlpha = Math.min(1, drop.life * 3);
      ctx.beginPath();
      ctx.arc(v.x(drop.x), v.y(drop.y), Math.max(1.5, R * 0.045), 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /** The close-up: the crash, seen a few times closer, in a circle at the top right. */
  function drawLens(ctx, lay, set, ownLane) {
    if (lens < 0.02 || !crashes(set)) return;
    const pose = M.at(set.road, X - anchor);
    const hit = M.overlap(set.road, X - anchor, pose);
    if (!hit.depth && !last.hit) return;
    const spot = hit.depth ? hit : last.hit;
    last.hit = spot;
    const { R, cx, axle } = ownLane;
    const d = set.spacing;
    const front = d ? X + d : X;
    // The front wheel's crash is the one ahead; the rear wheel's is the same, a whole number of bumps behind.
    const sx = cx + (front - (X + d / 2) + spot.x) * R,
      sy = axle - spot.y * R;
    const { x, y, r } = lay.close;
    const zoom = clamp(Math.round(r / (Math.max(0.16, 2.6 * set.crash.deepest) * R)), 2, 9);
    ctx.save();
    ctx.globalAlpha = lens;
    // A thin line from the lens to the place.
    ctx.strokeStyle = 'rgba(255, 93, 108, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    const dx = x - sx,
      dy = y - sy,
      len = Math.hypot(dx, dy) || 1;
    ctx.lineTo(x - (dx / len) * r, y - (dy / len) * r);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(sx, sy, 7, 0, TAU);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fillStyle = '#0d1520';
    ctx.fill();
    ctx.save();
    ctx.clip();
    const Z = R * zoom;
    const v = view(x - (front + spot.x) * Z, y + spot.y * Z, Z);
    const half = r / Z + 0.02;
    const pts = roadPoints(set, front + spot.x - half, front + spot.x + half, anchor, Infinity);
    fillGround(ctx, v, pts, spot.y - half - 0.05, GROUND);
    rimPath(ctx, set.wheel, v, front, 0, pose.alpha);
    ctx.fillStyle = WHEEL;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = RIM;
    ctx.stroke();
    if (hit.depth) drawCrash(ctx, set, v, front, pose.alpha, anchor);
    strokeToned(ctx, set, v, pts, 2.5);
    ctx.restore();
    ctx.lineWidth = 2;
    ctx.strokeStyle = RED;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.stroke();
    ctx.font = '600 12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    label(ctx, t.labels.closer(zoom.toLocaleString(W.numberLocale)), x, y + r - 20, INK);
    ctx.restore();
  }

  /** The row of wheels below: each on its own road, rolling, the chosen one framed. Tap one to ride it. */
  function drawGallery(ctx, lay, s) {
    const g = lay.gallery;
    if (!g) return;
    ctx.font = '600 14px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    label(ctx, s.own ? t.labels.galleryDrawn : t.labels.gallery, g.cells[0].x + 4, g.top + 4, INK);
    const items = s.own ? SHAPES : GALLERY;
    const chosen = s.own ? shapeNamed(s) : s.sides;
    items.forEach((item, i) => {
      const cell = g.cells[i];
      const set = s.own ? drawnSet(M.shapes[item]) : regularSet(item);
      const Rm = Math.max(10, Math.min(cell.w * 0.24, (cell.h - 40) / 2.45, cell.h > 160 ? 48 : 36));
      const ax = cell.x + cell.w / 2,
        ay = cell.y + 8 + 1.05 * Rm * set.longest;
      const v = view(ax - X * Rm, ay, Rm);
      ctx.save();
      ctx.beginPath();
      ctx.rect(cell.x + 3, cell.y, cell.w - 6, cell.h - 22);
      ctx.clip();
      const a = X - (cell.w / 2 + 4) / Rm,
        b = X + (cell.w / 2 + 4) / Rm;
      const pts = roadPoints(set, a, b, 0, Rm);
      fillGround(ctx, v, pts, -2.2, DEEP);
      strokeRoad(ctx, v, pts, SKY, 1.5);
      const pose = M.at(set.road, X);
      drawWheel(ctx, set, v, X, 0, pose.alpha);
      if (crashes(set)) drawCrash(ctx, set, v, X, pose.alpha, 0);
      ctx.restore();
      const on = item === chosen;
      if (on || hover === 'cell' + i) {
        ctx.strokeStyle = on ? TRACE : 'rgba(255, 224, 138, 0.45)';
        ctx.lineWidth = on ? 2 : 1.5;
        ctx.beginPath();
        ctx.roundRect(cell.x + 2, cell.y - 4, cell.w - 4, cell.h, 8);
        ctx.stroke();
      }
      ctx.textAlign = 'center';
      ctx.font = '600 12px system-ui, sans-serif';
      const name = s.own ? t.shapes[item] : t.labels.sides(item.toLocaleString(W.numberLocale));
      label(
        ctx,
        crashes(set) ? `${name} · ${t.labels.crashes}` : name,
        ax,
        cell.y + cell.h - 9,
        crashes(set) ? RED : MUTED,
      );
    });
  }

  /**
   * The hanging chain: a chain between two nails hangs in a catenary, y = a cosh(x / a). Turned over, the same curve
   * is one bump of the square's road, exactly as long as the square's side, which rolls over it. The two sit either
   * side of one line, mirror images.
   */
  function drawChain(ctx, box) {
    const a = Math.SQRT1_2,
      half = a * Math.asinh(1), // half the bump's width
      lift = a * Math.cosh(half / a), // the curve's height at the nails (1, a corner's distance)
      sag = lift - a; // how far the chain hangs: the bump's height, 1 − a
    const R = Math.min((box.h - 40) / (2 * a + sag + 0.16), box.w / 6, 96);
    const centres = [box.x + box.w * 0.3, box.x + box.w * 0.7];
    const line = box.y + 6 + (2 * a + sag) * R; // the nails, and the bump's feet
    ctx.font = '600 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    const under = line + 0.16 * R + 24; // the words go under the pictures
    label(ctx, t.labels.chain, centres[0], under, MUTED);
    label(ctx, t.labels.turned, centres[1], under, MUTED);
    ctx.save();
    ctx.setLineDash([3, 5]);
    ctx.strokeStyle = 'rgba(169, 184, 201, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centres[0] - (half + 0.5) * R, line);
    ctx.lineTo(centres[1] + (half + 0.5) * R, line);
    ctx.stroke();
    ctx.restore();
    ctx.font = '600 22px system-ui, sans-serif';
    label(ctx, '→', box.x + box.w / 2, line - 8, MUTED);
    // The bump, with the ground under it, and the square resting on its top.
    const v = view(centres[1], line - lift * R, R);
    const pts = [];
    for (let k = 0; k <= 48; k++) {
      const x = -half + (2 * half * k) / 48;
      pts.push([x, -a * Math.cosh(x / a)]);
    }
    fillGround(ctx, v, pts, -lift - 0.16, GROUND);
    drawWheel(ctx, regularSet(4), v, 0, 0, 0);
    // The chain twice, in links evenly spaced along it: it is as long as the square's side, 2a.
    const links = 16,
      size = (a / links) * R;
    for (const [cx, flip] of [
      [centres[0], 1],
      [centres[1], -1],
    ])
      for (let k = 0; k <= links; k++) {
        const x = a * Math.asinh((-a + (2 * a * k) / links) / a),
          depth = lift - a * Math.cosh(x / a); // 0 at the ends, sag in the middle
        ctx.save();
        ctx.translate(cx + x * R, line + flip * depth * R);
        ctx.rotate(flip * Math.atan(Math.sinh(x / a)));
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 1.05, k % 2 ? size * 0.5 : 1.4, 0, 0, TAU);
        ctx.strokeStyle = '#dfe6ee';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(centres[0] + side * half * R, line, 4.5, 0, TAU);
      ctx.fillStyle = '#8c97a6';
      ctx.fill();
    }
  }

  function background(ctx, width, height) {
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, '#101a28');
    sky.addColorStop(1, '#0a0e15');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
  }

  let lay = null;

  function draw(ctx, s, stage) {
    const { width, height } = stage;
    const set = current ?? setFor(s);
    lay = layout(width, height, s);
    if (!stage.playing) lens = crashes(set) && M.overlap(set.road, X - anchor).depth > 0 ? 1 : 0;
    background(ctx, width, height);
    const [own, flat] = lay.lanes;
    drawOwnLane(ctx, own, set, s, width, X, anchor);
    if (flat) drawFlatLane(ctx, flat, set, s, width);
    // Lane names, and the crash, in words: beside the first lane's name, or in its place when both don't fit.
    ctx.font = `600 ${lay.narrow ? 12 : 13}px system-ui, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    const crash = s.own ? t.labels.crashDrawn : t.labels.crash;
    const showing = crashes(set) && lens > 0.02;
    const side = ctx.measureText(t.labels.own).width + ctx.measureText(crash).width + 40 < width;
    ctx.save();
    if (showing && !side) ctx.globalAlpha = 1 - lens;
    label(ctx, t.labels.own, 10, own.label, MUTED);
    ctx.restore();
    if (flat) label(ctx, s.own ? t.labels.flatOne : t.labels.flat, 10, flat.label, MUTED);
    drawLens(ctx, lay, set, own);
    if (showing) {
      ctx.save();
      ctx.globalAlpha = lens;
      ctx.font = `600 ${lay.narrow ? 12 : 13}px system-ui, sans-serif`;
      ctx.textAlign = side ? 'right' : 'left';
      label(ctx, crash, side ? width - 10 : 10, own.label, RED);
      ctx.restore();
    }
    drawGallery(ctx, lay, s);
    if (lay.chain) drawChain(ctx, lay.chain);
  }

  /** The home card: the square wheels on their road. */
  function preview(ctx, width, height) {
    const set = regularSet(4);
    background(ctx, width, height);
    const R = Math.min((height - 16) / (ABOVE + BELOW), (width * 0.8) / (set.spacing + 2.3));
    // In the middle, with the ground running on to the bottom edge.
    const lane = { R, cx: width / 2, axle: (height - (ABOVE + BELOW) * R) / 2 + ABOVE * R };
    ctx.fillStyle = GROUND;
    ctx.fillRect(0, lane.axle + 0.9 * R, width, height);
    drawOwnLane(ctx, lane, set, { own: false }, width, startOf(set), 0);
  }

  // ---------- motion ----------

  function step(dt, s) {
    const set = current ?? setFor(s);
    if (grab < 0) X += SPEED * dt;
    // The close-up fades in while the wheel cuts into its road.
    const crashing = crashes(set) && M.overlap(set.road, X - anchor).depth > 0;
    lens += ((crashing ? 1 : 0) - lens) * (1 - Math.exp(-dt * (crashing ? 10 : 3)));
    if (!crashing && lens < 0.02) last.hit = null;
    // On the flat road, each thump splashes the water: a cartoon, not a computed slosh.
    const f = set.flat,
      e = 0.002;
    const vy = (SPEED * (M.flatAt(f, X + e - flatAnchor).height - M.flatAt(f, X - e - flatAnchor).height)) / (2 * e);
    if (splash.vy !== null && grab < 0) {
      const jolt = Math.abs(vy - splash.vy);
      if (jolt > 0.45) {
        splash.amp = Math.min(1, splash.amp + jolt * 0.35);
        const cupTop = M.flatAt(f, X - flatAnchor).height + PLANK + 0.08 + CUP;
        const middle = X + set.spacing / 2;
        for (let k = 0; k < Math.round(jolt * 2.2) && splash.drops.length < 40; k++) {
          const side = random() < 0.5 ? -1 : 1;
          splash.drops.push({
            x: middle + side * 0.24,
            y: cupTop,
            vx: SPEED + side * (0.3 + random() * 0.7),
            vy: 1.2 + jolt * (0.5 + random() * 0.5),
            life: 1,
          });
        }
      }
    }
    splash.vy = vy;
    splash.amp *= Math.exp(-dt * 1.6);
    splash.phase += dt * TAU * 1.8;
    for (const drop of splash.drops) {
      drop.vy -= 9 * dt;
      drop.x += drop.vx * dt;
      drop.y += drop.vy * dt;
      if (drop.y < 0) drop.life -= dt * 4;
    }
    splash.drops = splash.drops.filter((drop) => drop.life > 0 && drop.y > -0.3);
  }

  // ---------- panel ----------

  const presetSettings = [
    { own: false, sides: 4 },
    { own: false, sides: 3 },
    { own: true, ...HEART },
  ];
  function presetIndex(s) {
    if (!s.own) return s.sides === 4 ? 0 : s.sides === 3 ? 1 : -1;
    return KEYS.every((k) => s[k] === HEART[k]) ? 2 : -1;
  }
  const number = (x, digits = 0) =>
    x.toLocaleString(W.numberLocale, { minimumFractionDigits: digits, maximumFractionDigits: digits });
  // One decimal below 10% (3.2% deep), none above, and none for what is really nothing (a circle's bob).
  const percent = (share) => t.percent(number(share * 100, share >= 0.0005 && share < 0.095 ? 1 : 0));

  function controls(s, stage) {
    const kind =
      `<div class="control wide wheels-kind" role="group" aria-label="${t.kind}">` +
      `<button type="button" class="button" data-own="0" aria-pressed="${!s.own}">${t.regular}</button>` +
      `<button type="button" class="button" data-own="1" aria-pressed="${s.own}">${t.drawn}</button></div>`;
    const body = s.own
      ? `<div class="control wide"><span class="wheels-label" id="wheels-start">${t.startFrom}</span>` +
        `<div class="wheels-shapes" role="group" aria-labelledby="wheels-start">` +
        SHAPES.map(
          (k) => `<button type="button" class="button" data-shape="${k}" aria-pressed="false">${t.shapes[k]}</button>`,
        ).join('') +
        `</div><p>${t.drawHint}</p></div>`
      : stage.slider('sides', t.sides, 3, 12, 1, s.sides, '', t.sidesHint);
    // Not a live region: it is rebuilt on every change. Each new wheel's result is announced once.
    return kind + body + '<div class="wide readout wheels-readout" id="wheels-readout"></div>';
  }

  function settle(s) {
    const set = setFor(s);
    current = set;
    const name = nameOf(s);
    const text = crashes(set)
      ? t.announce.crash(name)
      : s.own
        ? t.announce.levelDrawn(name)
        : t.announce.level(name, percent(M.bumps(s.sides).height));
    if (text !== announced) W.announce(text);
    announced = text;
  }

  function bindControls(panel, s, stage) {
    panel.querySelectorAll('[data-own]').forEach((button) =>
      button.addEventListener('click', () => {
        const own = button.dataset.own === '1';
        if (own === s.own) return;
        const before = current;
        s.own = own;
        grab = picked = -1;
        changed(s, stage, before);
        settle(s);
        stage.refresh();
        stage.draw();
        panel.querySelector(`[data-own="${own ? 1 : 0}"]`)?.focus();
      }),
    );
    panel.querySelectorAll('[data-shape]').forEach((button) =>
      button.addEventListener('click', () => {
        const before = current;
        Object.assign(s, percentSettings(M.shapes[button.dataset.shape]));
        changed(s, stage, before);
        settle(s);
        stage.sync();
        stage.draw();
      }),
    );
  }

  function readouts(s) {
    const set = current ?? setFor(s);
    const crash = crashes(set);
    $('scene-status').textContent = crash ? t.status.crash : t.status.level;
    const i = presetIndex(s);
    $('scene-name').textContent = i >= 0 ? t.presets[i].name : nameOf(s);
    const slider = $('c-sides');
    if (slider && Number(slider.value) !== s.sides) slider.value = s.sides;
    const named = shapeNamed(s);
    document
      .querySelectorAll('#scene-controls [data-shape]')
      .forEach((b) => b.setAttribute('aria-pressed', b.dataset.shape === named));
    const box = $('wheels-readout');
    if (!box) return;
    const row = (name, value, warn) =>
      `<span>${name}</span><strong${warn ? ' class="wheels-warn"' : ''}>${value}</strong>`;
    const depth = percent(set.crash.deepest / set.longest);
    const cut = crash
      ? row(t.readout.cuts, s.own ? t.readout.cutsDrawn(depth) : t.readout.cutsValue(depth), true) +
        row(t.readout.during, t.readout.duringValue(percent(set.crash.share)), true)
      : row(t.readout.clear, t.readout.clearValue);
    const rows = s.own
      ? row(t.readout.bob, t.readout.bobDrawn(percent(set.flat.bob / set.longest))) + cut
      : row(t.readout.bumps, t.readout.bumpsValue(percent(M.bumps(s.sides).height))) +
        row(t.readout.bob, t.readout.bobValue(percent(set.flat.bob))) +
        cut;
    box.innerHTML =
      `<p class="wheels-big${crash ? ' wheels-warn' : ''}">${crash ? t.readout.crash : t.readout.level}</p>` +
      `<div class="wheels-rows">${rows}</div>` +
      `<p class="wheels-rule">${s.own ? t.readout.drawnRule : `${t.readout.rule} ${t.readout.radius}`}</p>`;
  }

  // ---------- pointer and keys ----------

  /** The dot near a canvas position, or −1 (only for a drawn wheel, in the first lane). */
  function dotNear(x, y, s, stage) {
    if (!s.own) return -1;
    const l = lay ?? layout(stage.width, stage.height, s);
    const lane = l.lanes[0],
      set = current ?? setFor(s);
    const alpha = M.at(set.road, X - anchor).alpha;
    let best = -1,
      bestD = 22;
    KEYS.forEach((_, k) => {
      const phi = (k * TAU) / KEYS.length,
        r = set.wheel.radius(phi);
      const d = Math.hypot(
        lane.cx + r * Math.cos(phi + alpha) * lane.R - x,
        lane.axle - r * Math.sin(phi + alpha) * lane.R - y,
      );
      if (d < bestD) {
        best = k;
        bestD = d;
      }
    });
    return best;
  }

  function cellAt(x, y, s, stage) {
    const g = (lay ?? layout(stage.width, stage.height, s)).gallery;
    if (!g) return -1;
    return g.cells.findIndex((c) => x >= c.x && x <= c.x + c.w && y >= c.y - 4 && y <= c.y + c.h - 4);
  }

  function choose(i, s, stage) {
    const before = current;
    if (s.own) Object.assign(s, percentSettings(M.shapes[SHAPES[i]]));
    else s.sides = GALLERY[i];
    changed(s, stage, before);
    settle(s);
    stage.sync();
  }

  /** Move a dot to a distance from the axle (as a share of 1), keeping the wheel where it is. */
  function setDot(k, r, s, stage, rough) {
    const value = Math.round(clamp(r, M.SMALLEST, 1) * 100);
    if (value === s[KEYS[k]]) return;
    const before = current ?? setFor(s);
    s[KEYS[k]] = value;
    const after = drawnSet(radiiOf(s), rough);
    reshape(before, after);
    current = after;
    stage.setChosen(presetIndex(s));
    stage.sync();
  }

  W.defineRoom({
    id: 'wheels',
    symbol: '◼',
    theme: 'shape',
    added: '2026-10-01',
    eyebrow: t.eyebrow,
    name: t.name,
    tagline: t.tagline,
    accent: { background: '#2a2219', border: WHEEL, color: RIM },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.sceneLabel,
    sceneName: t.presets[0].name,
    tip: t.tip,
    actionLabel: t.actionLabel,
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { ...t.connection, go: 'motion' },

    // The number of sides, or a drawn wheel: its dots' distances from the axle, in % of the longest possible.
    defaults: { sides: 4, own: false, ...HEART },
    ranges: { sides: [3, 12, 'integer'], ...Object.fromEntries(KEYS.map((k) => [k, [30, 100, 'integer']])) },
    defaultPreset: 0,
    presets: t.presets.map((p, i) => ({ ...p, badge: ['4', '3', '♥'][i], settings: presetSettings[i] })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Bernoulli_Johann',
        color: WHEEL,
        sketch: { hairStyle: 'wig', hair: '#e6dccb', skin: '#efcfae', brows: 'bold', backdrop: '#2a2219' },
      },
      {
        ...t.guests[1],
        bio: 'Huygens',
        color: '#d4ec8a',
        sketch: { hairStyle: 'wig', hair: '#3a2a1c', skin: '#efcfae', moustache: true, backdrop: '#232a17' },
      },
      {
        ...t.guests[2],
        bio: 'Leibniz',
        color: SKY,
        sketch: { hairStyle: 'wig', hair: '#2b211b', skin: '#f0d0b0', backdrop: '#1b2c3e' },
      },
    ],
    insight: t.insight,

    controls,
    bindControls,
    readouts,
    draw,
    step,
    preview,

    enter(s, stage) {
      for (const k of KEYS) s[k] = clamp(Math.round(s[k]), 30, 100);
      s.sides = clamp(Math.round(s.sides), 3, 12);
      grab = picked = -1;
      current = null;
      restart(s);
      current = setFor(s);
      announced = '';
      lens = 0;
      stage.sync();
    },
    onPreset(s, stage) {
      grab = picked = -1;
      changed(s, stage, current);
      settle(s);
    },
    onInput(s, stage) {
      changed(s, stage, current);
      settle(s);
    },
    action(s, stage) {
      const before = current;
      if (s.own) {
        // A random wheel: a few gentle waves round a circle.
        const waves = [1, 2, 3, 4].map((k) => ({ k, size: 0.22 * random() ** 1.5, turn: TAU * random() }));
        Object.assign(
          s,
          percentSettings(
            KEYS.map((_, i) => {
              const phi = (i * TAU) / KEYS.length;
              return clamp(0.72 + waves.reduce((sum, w) => sum + w.size * Math.cos(w.k * phi + w.turn), 0), 0.3, 1);
            }),
          ),
        );
      } else s.sides = s.sides >= 12 ? 3 : s.sides + 1;
      changed(s, stage, before);
      settle(s);
      stage.sync();
      stage.draw();
    },
    reset(s, stage) {
      restart(s);
      stage.sync();
    },

    pointer: {
      // Touches on a dot of a drawn wheel drag it; elsewhere they scroll the page.
      drag(p, s, stage) {
        return dotNear(p.x * stage.width, p.y * stage.height, s, stage) >= 0;
      },
      down(p, s, stage, e) {
        if (e && e.button > 0) return;
        keyboard = false;
        const x = p.x * stage.width,
          y = p.y * stage.height;
        const cell = cellAt(x, y, s, stage);
        if (cell >= 0) {
          choose(cell, s, stage);
          stage.draw();
          return;
        }
        const k = dotNear(x, y, s, stage);
        if (k >= 0) {
          grab = k;
          picked = k;
        }
        stage.draw();
      },
      move(p, { dragging, mouse }, s, stage) {
        const x = p.x * stage.width,
          y = p.y * stage.height;
        const canvas = $('scene-canvas');
        if (mouse && !dragging) {
          const was = hover;
          const k = dotNear(x, y, s, stage),
            cell = cellAt(x, y, s, stage);
          hover = k >= 0 ? k : cell >= 0 ? 'cell' + cell : null;
          canvas.classList.toggle('wheels-dot', k >= 0);
          canvas.classList.toggle('wheels-pick', k < 0 && cell >= 0);
          if (was !== hover) stage.draw();
        }
        if (!dragging || grab < 0) return;
        const lane = lay.lanes[0],
          set = current ?? setFor(s);
        const alpha = M.at(set.road, X - anchor).alpha,
          phi = (grab * TAU) / KEYS.length;
        // How far out along its spoke the pointer is.
        const along = ((x - lane.cx) * Math.cos(phi + alpha) - (y - lane.axle) * Math.sin(phi + alpha)) / lane.R;
        setDot(grab, along, s, stage, true);
        stage.draw();
      },
      up() {
        if (grab < 0) return;
        grab = -1;
        const s = W.stage.settingsFor('wheels');
        if (s) {
          current = drawnSet(radiiOf(s));
          settle(s);
          W.stage.sync();
        }
        W.stage.draw();
      },
      leave() {
        hover = null;
        $('scene-canvas').classList.remove('wheels-dot', 'wheels-pick');
      },
      escape() {
        if (picked < 0) return;
        picked = -1;
        W.stage.draw();
      },
      /** The arrow keys change the sides of a regular wheel, or pick a drawn wheel's dot and move it. */
      arrow(dx, dy, s, stage) {
        keyboard = true;
        if (!s.own) {
          const sides = clamp(s.sides + (dx || -dy), 3, 12);
          if (sides === s.sides) return;
          const before = current;
          s.sides = sides;
          changed(s, stage, before);
          settle(s);
          stage.sync();
          return;
        }
        if (dx || picked < 0) {
          picked = picked < 0 ? 0 : (picked + dx + KEYS.length) % KEYS.length;
          W.announce(t.announce.picked(picked + 1));
          return;
        }
        setDot(picked, s[KEYS[picked]] / 100 - dy * 0.05, s, stage, false);
        settle(s);
      },
      key(e, s, stage) {
        if (e.key !== 'Enter') return false;
        W.room('wheels').action(s, stage);
        return true;
      },
    },
  });
})();
