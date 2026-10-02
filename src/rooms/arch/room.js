/* Room · Hang it, flip it, build it: a hanging chain turned over into an arch that stands, beside one that falls. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, TAU, clamp } = W;
  const M = W.models.arch;
  const t = W.text('arch');
  const reduced = W.prefersReducedMotion();

  const STONE = [201, 176, 138],
    EDGE = '#5b4a36',
    CHAIN = '#9aa6b4',
    BEAD = '#d8dee6',
    PEG = '#d6a65a',
    GOLD = '#ffd166',
    RED = '#ff5d6c',
    GREEN = '#8fe3a8',
    INK = '#f5f1e6',
    MUTED = '#a9b8c9',
    EARTH = '#1a2130',
    EARTH_LINE = '#3b4759',
    TIMBER = '#9a7448',
    TOWER = '#9fb4d8',
    TOWER_EDGE = '#55647d',
    ROAD = '#8a94a3';
  const SHAPES = ['semicircle', 'pointed', 'flat', 'own'];
  // The drawn arch's dots in settings and links: da, db, … di (the trail takes names of letters only).
  const DOTS = Array.from({ length: M.DOTS }, (_, k) => 'd' + 'abcdefghi'[k]);
  const TURN = 1.1, // seconds to turn the chain over
    STRIKE = 0.6, // seconds for the wooden frame to drop
    CRACK = 0.7, // seconds the hinges show before a fall
    PULL = 0.7, // how fast a fall speeds up, in radians per second squared: slow motion
    STOREY = 0.045, // a tower storey's height, in metres
    DECK = 0.07; // how far the road hangs below the chain's lowest point
  const STOREYS = 3; // at most, on any stone

  // ---------- settings ----------

  const towersOf = (s) => {
    const out = [];
    let n = Math.max(0, Math.round(s.towers));
    for (let j = 0; j < M.STONES; j++) {
      out.push(n % (STOREYS + 1));
      n = Math.floor(n / (STOREYS + 1));
    }
    return out;
  };
  const towersCode = (list) => list.reduceRight((n, k) => n * (STOREYS + 1) + k, 0);
  const pegs = (s) => [
    [s.ax / 100, s.ay / 100],
    [s.bx / 100, s.by / 100],
  ];
  const lengthOf = (s) => s.chain / 100;
  const thick = (s) => s.thick / 100;
  const shapeFn = (s) => (s.shape === 3 ? M.drawnShape(DOTS.map((k) => s[k] / 100)) : M.shapes[SHAPES[s.shape]]);
  const shapeKey = (s) => (s.shape === 3 ? 'own' + DOTS.map((k) => s[k]).join(',') : SHAPES[s.shape]);

  /** The chain must be longer than the gap between its pegs. */
  function normalise(s) {
    s.shape = clamp(Math.round(s.shape), 0, 3);
    const [a, b] = pegs(s);
    const gap = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (s.chain / 100 < gap * 1.04) s.chain = Math.min(250, Math.ceil(gap * 104));
  }

  // ---------- the chain ----------

  const hung = { key: '', rest: null, bare: null };
  /** The chain at rest for the settings, and (for the road's comparison) the same chain without its road. */
  function restOf(s) {
    const key = [s.ax, s.ay, s.bx, s.by, s.chain, s.towers, s.road].join();
    if (key !== hung.key) {
      const [a, b] = pegs(s);
      hung.rest = M.hang(a, b, lengthOf(s), towersOf(s), s.road) ?? hung.rest;
      hung.bare = s.road ? M.hang(a, b, lengthOf(s), [], false) : null;
      hung.key = key;
    }
    return hung.rest;
  }

  let moving = null; // the chain as it swings (Verlet), or null before it is hung

  /** Let go of the chain from a little to one side, so it swings to rest. */
  function release(s) {
    const rest = restOf(s);
    const [a, b] = pegs(s);
    const swing = reduced ? 0 : 0.22 * (b[0] - a[0]);
    moving = M.chain(
      rest.points.map(([x, y], i) => {
        const f = i / M.LINKS,
          line = a[1] + f * (b[1] - a[1]);
        return reduced ? [x, y] : [x + swing * Math.sin(Math.PI * f), line + (y - line) * 0.62];
      }),
    );
  }

  function swing(s, dt) {
    if (!moving) release(s);
    const [a, b] = pegs(s);
    const towers = towersOf(s);
    const steps = 4;
    for (let k = 0; k < steps; k++)
      M.relax(moving, a, b, lengthOf(s), M.beadWeights(towers, moving.points, s.road), dt / steps);
  }

  // ---------- the two arches ----------

  /**
   * An arch on one side: its stones and loads, its line of force, and, if it can't stand, the hinges and the fall.
   * The chain's arch keeps the shape it was turned over in (`from`), whatever loads are added after.
   */
  const left = { from: null, arch: null, line: null, mech: null, fall: null, key: '', turned: 0 };
  const right = { arch: null, line: null, mech: null, fall: null, key: '' };

  function judge(side, ground) {
    side.line = M.thrust(side.arch);
    side.mech = side.line.fits ? null : M.mechanism(side.arch);
    side.fall = side.mech ? M.fall(side.arch, side.mech, ground) : null;
  }
  const footLevel = (arch) =>
    Math.min(...[arch.joints[0], arch.joints[arch.joints.length - 1]].flatMap((j) => [j.inner[1], j.outer[1]]));

  function buildLeft(s, keepShape = false) {
    if (!keepShape || !left.from) {
      left.from = restOf(s).points.map((p) => p.slice());
      left.turned++; // a new shape, for the chart's record of how thin its stones may be
    }
    left.arch = M.chainArch(left.from, thick(s), towersOf(s), s.road);
    judge(left, footLevel(left.arch));
    left.key = [s.thick, s.towers, s.road].join();
  }

  function buildRight(s) {
    const key = shapeKey(s) + '|' + s.thick;
    if (key === right.key) return false;
    right.arch = M.shapeArch(shapeFn(s), thick(s));
    judge(right, footLevel(right.arch));
    right.key = key;
    return true;
  }

  // How thin an arch's stones can be: found by halving, a few lines of force at a time, between frames.
  const thinnest = {}; // key → { lo, hi, steps, build }, in metres; `build` makes the arch for a thickness
  const THIN = { lo: 0.004, hi: 0.2, steps: 13 };
  let pumping = false;
  function thinFor(key, build) {
    if (!thinnest[key]) {
      const keys = Object.keys(thinnest);
      if (keys.length > 40) delete thinnest[keys.find((k) => thinDone(thinnest[k])) ?? keys[0]];
      thinnest[key] = { lo: THIN.lo, hi: THIN.hi, steps: 0, build };
      pump();
    }
    return thinnest[key];
  }
  const fits = (job, d) => M.thrust(job.build(d), true).fits;
  function thinStep(budget) {
    const start = performance.now();
    for (const job of Object.values(thinnest)) {
      while (job.steps < THIN.steps) {
        if (performance.now() - start > budget) return;
        if (job.steps === 0) {
          job.never = !fits(job, THIN.hi);
          job.any = !job.never && fits(job, THIN.lo);
          if (job.never || job.any) {
            job.steps = THIN.steps;
            break;
          }
        }
        const mid = Math.sqrt(job.lo * job.hi);
        if (fits(job, mid)) job.hi = mid;
        else job.lo = mid;
        job.steps++;
      }
    }
  }
  /** Work on the jobs between frames (also while paused), then show the answers. */
  function pump() {
    if (pumping) return;
    pumping = true;
    const run = () => {
      thinStep(8);
      const showing = W.stage.current?.id === 'arch';
      if (showing) {
        W.stage.sync();
        W.stage.draw();
      }
      if (Object.values(thinnest).some((job) => !thinDone(job))) setTimeout(run, showing ? 30 : 300);
      else pumping = false;
    };
    setTimeout(run, 0);
  }
  const thinDone = (job) => job && job.steps >= THIN.steps;

  // ---------- the story: hang, turn over, strike the frame, stand or fall ----------

  const story = {
    turn: 0, // 0: hanging, 1: turned over
    turning: null, // { from, to, start }
    turnAt: null, // when to turn over next, by the clock
    leftFallAt: null, // when the chain's arch starts to fall
    strikeAt: null, // when the frame under the other arch drops
    struckAt: null,
    rightFallAt: null,
    from: null, // the chain's beads when it started turning, so the turn starts where the chain was
    said: { left: '', right: '' },
  };
  let clock = 0;
  const instant = (stage) => reduced || !stage.playing;

  /** Start the room's story again: the chain swings, turns over if asked, and the frame drops. */
  function begin(s, stage) {
    clock = 0;
    story.turning = null;
    story.turn = 0;
    story.leftFallAt = null;
    left.from = null;
    left.arch = null;
    release(s);
    buildRight(s);
    story.struckAt = null;
    story.rightFallAt = null;
    story.said = { left: '', right: '' };
    if (instant(stage)) {
      moving = M.chain(restOf(s).points);
      if (s.flip) turned(s, stage, true);
      strike(stage, true);
      return;
    }
    story.turnAt = s.flip ? 2 : null;
    story.strikeAt = s.flip ? 2 + TURN + 0.8 : 1.6;
  }

  function startTurn(s, stage, to) {
    story.turnAt = null;
    if (to === 1) buildLeft(s);
    story.leftFallAt = null;
    story.from = moving ? moving.points.map((p) => p.slice()) : null;
    if (instant(stage)) {
      story.turning = null;
      story.turn = to;
      if (to === 1) turned(s, stage, true);
      else hungAgain(s);
      return;
    }
    story.turning = { from: story.turn, to, start: clock };
  }

  function turned(s, stage, now) {
    story.turn = 1;
    story.turning = null;
    if (!left.arch) buildLeft(s);
    story.leftFallAt = left.fall ? clock + (now ? 0 : CRACK) : null;
    say(stage);
  }

  function hungAgain(s) {
    story.turn = 0;
    story.turning = null;
    story.leftFallAt = null;
    left.from = null;
    left.arch = null;
    if (!moving) release(s);
  }

  /** The chain's arch has new loads or stones: it keeps its shape, and stands or falls with them. */
  function reload(s, stage) {
    if (!left.from) return;
    const before = !!left.fall;
    buildLeft(s, true);
    if (left.fall) story.leftFallAt = before ? story.leftFallAt : clock + (instant(stage) ? 0 : CRACK * 0.6);
    else story.leftFallAt = null;
    say(stage);
  }

  /** The other arch is new: build it on its frame, and drop the frame a moment later. */
  function rebuild(s, stage, delay = 0.7) {
    buildRight(s);
    story.struckAt = null;
    story.rightFallAt = null;
    story.said.right = '';
    if (instant(stage)) strike(stage, true);
    else story.strikeAt = clock + delay;
  }

  function strike(stage, now = false) {
    story.strikeAt = null;
    story.struckAt = now ? -STRIKE : clock;
    story.rightFallAt = right.fall ? (now ? -1 : clock + STRIKE + CRACK) : null;
    say(stage);
  }

  /** Say each new result once. */
  function say() {
    const s = W.stage.settingsFor('arch');
    if (!s) return;
    if (story.turn === 1 && left.line) {
      const text = left.line.fits ? t.announce.stands : t.announce.falls;
      if (text !== story.said.left) W.announce(text);
      story.said.left = text;
    }
    if (story.struckAt !== null && right.line) {
      const text = t.announce.beside(t.labels[SHAPES[s.shape]], right.line.fits);
      if (text !== story.said.right) W.announce(text);
      story.said.right = text;
    }
  }

  function step(dt, s, stage) {
    clock += dt;
    if (story.turn < 1 || story.turning) swing(s, dt);
    if (story.turnAt !== null && clock >= story.turnAt) startTurn(s, stage, 1);
    if (story.turning) {
      const { from, to, start } = story.turning;
      const f = Math.min(1, (clock - start) / TURN);
      story.turn = from + (to - from) * ease(f);
      if (f >= 1) {
        if (to === 1) turned(s, stage, false);
        else hungAgain(s);
        stage.sync();
      }
    }
    if (story.strikeAt !== null && clock >= story.strikeAt) {
      strike(stage);
      stage.sync();
    }
  }
  const ease = (f) => (f < 0.5 ? 4 * f * f * f : 1 - Math.pow(-2 * f + 2, 3) / 2);
  const smooth = (a, b, x) => {
    const f = clamp((x - a) / (b - a), 0, 1);
    return f * f * (3 - 2 * f);
  };

  // ---------- layout ----------

  /**
   * Two pictures side by side, on one scale, in the part of the canvas likely to be on screen. A metre-wide arch
   * fits each picture with room for a tall one above and a hanging road below; on a tall canvas, a row of other
   * arch shapes follows underneath.
   */
  function layout(width, height) {
    const narrow = width < 560;
    const seen = Math.min(height, Math.max(0.6 * width, 300));
    const pad = narrow ? 8 : 14,
      gap = narrow ? 8 : 18,
      head = narrow ? 36 : 48;
    const w = (width - 2 * pad - gap) / 2;
    const scale = Math.max(40, Math.min(w / 1.28, (seen - head - pad) / (0.98 + 0.2)));
    // With a row of shapes below, the pictures sit at the top; without, their ground is near the bottom.
    const ground = narrow ? Math.max(head + 0.98 * scale, seen - pad - 0.2 * scale) : head + 0.98 * scale;
    const panels = [
      { x: pad, w, cx: pad + w / 2 },
      { x: pad + w + gap, w, cx: pad + w + gap + w / 2 },
    ];
    const below = height - (ground + 0.2 * scale);
    let gallery = null;
    if (below >= 170 && !narrow) {
      const top = ground + 0.2 * scale + 24;
      const cellW = (width - 2 * pad) / SHAPES.length,
        cellH = Math.min(170, height - top - 30 - pad);
      if (cellH >= 110) {
        gallery = {
          top,
          cells: SHAPES.map((_, i) => ({ x: pad + i * cellW, y: top + 26, w: cellW, h: cellH })),
        };
        // And below that, when there is room, how thin each arch's stones may be.
        const bottom = top + 26 + cellH;
        if (height - bottom - pad >= 36 + 5 * 26 + 30)
          gallery.chart = { top: bottom + 36, x: pad + 4, w: width - 2 * pad - 8 };
      }
    }
    return { narrow, pad, head, scale, ground, panels, gallery, width, height };
  }

  let lay = null;
  let view = null; // the left picture's view: it eases to a new size when the chain changes

  /** Where the chain's world goes in the left picture: the arch's lower foot on the ground line. */
  function leftView(s, l) {
    const rest = restOf(s);
    const xs = rest.points.map((p) => p[0]),
      ys = rest.points.map((p) => p[1]);
    const low = Math.min(...ys),
      high = Math.max(rest.points[0][1], rest.points[M.LINKS][1]);
    const towerTop = Math.max(...towersOf(s)) * STOREY;
    const above = Math.max(towerTop, s.road ? DECK + 0.03 : 0) + thick(s);
    const spanW = Math.max(...xs) - Math.min(...xs) + 2 * thick(s);
    const sc = Math.min(l.scale, (l.panels[0].w - 8) / spanW, (l.ground - l.head) / (high - low + above || 1));
    return { s: sc, xm: (Math.max(...xs) + Math.min(...xs)) / 2, low, level: (low + high) / 2 };
  }

  let dragging = null; // { kind: 'peg' | 'dot' | 'draw', index, points? }
  let tap = null; // a tap waiting for its release: { kind: 'stone', index, x, y }

  function viewFor(s, l) {
    const target = leftView(s, l);
    if (!view || dragging?.kind === 'peg') view = view && dragging?.kind === 'peg' ? view : target;
    else for (const k of ['s', 'xm', 'low']) view[k] += (target[k] - view[k]) * 0.18;
    view.level = target.level;
    return view;
  }

  // ---------- drawing ----------

  function background(ctx, width, height) {
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, '#121a26');
    sky.addColorStop(1, '#0a0e15');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
  }

  function label(ctx, text, x, y, colour, font) {
    ctx.font = font;
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = 'rgba(10, 14, 21, 0.85)';
    ctx.strokeText(text, x, y);
    ctx.fillStyle = colour;
    ctx.fillText(text, x, y);
  }

  const shade = (j, light = 0) => {
    const k = ((j * 37) % 7) / 7 - 0.5;
    return `rgb(${STONE.map((c) => Math.round(clamp(c * (1 + 0.1 * k) + light, 0, 255))).join(',')})`;
  };

  /** A stone, its corners already on the canvas. */
  function drawStone(ctx, corners, j, alpha = 1) {
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    corners.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.fillStyle = shade(j);
    ctx.fill();
    ctx.strokeStyle = EDGE;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  /** A tower of `k` storeys standing on a point (or, upside down, hanging from it), `up` being which way is up. */
  function drawTower(ctx, x, y, k, px, up) {
    const w = 0.032 * px,
      h = k * STOREY * px;
    const top = y - up * h;
    ctx.beginPath();
    ctx.rect(x - w / 2, Math.min(y, top), w, Math.abs(h));
    ctx.fillStyle = TOWER;
    ctx.fill();
    ctx.strokeStyle = TOWER_EDGE;
    ctx.lineWidth = 1;
    ctx.stroke();
    // Storeys, and a pointed roof at the far end.
    ctx.beginPath();
    for (let i = 1; i < k; i++) {
      ctx.moveTo(x - w / 2, y - up * i * STOREY * px);
      ctx.lineTo(x + w / 2, y - up * i * STOREY * px);
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - w / 2 - 1, top);
    ctx.lineTo(x, top - up * 0.6 * w);
    ctx.lineTo(x + w / 2 + 1, top);
    ctx.closePath();
    ctx.fillStyle = '#c6d3ea';
    ctx.fill();
  }

  function drawGround(ctx, x0, x1, y, depth, alpha = 1) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = EARTH;
    ctx.fillRect(x0, y, x1 - x0, depth);
    ctx.strokeStyle = EARTH_LINE;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  /** The line of force: gold where it runs inside the stones, red where it leaves them. */
  function drawLine(ctx, path, map, alpha, stone = 12) {
    if (alpha <= 0) return;
    const width = clamp(0.2 * stone, 1.2, 2.4);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    const pts = path.points.map((p) => map(p.point));
    const out = path.points.map((p) => p.joint >= 0 && (p.share < -1e-6 || p.share > 1 + 1e-6));
    ctx.strokeStyle = 'rgba(10, 14, 21, 0.55)';
    ctx.lineWidth = width + clamp(0.16 * stone, 1, 2.4);
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.fillStyle = RED;
    pts.forEach(([x, y], i) => {
      if (!out[i]) return;
      ctx.beginPath();
      ctx.arc(x, y, clamp(0.3 * stone, 2.4, 3.6), 0, TAU);
      ctx.fill();
    });
    ctx.restore();
  }

  /** How far a fall has gone: speeding up like a real fall, but slowly, so it can be watched. */
  function fallPose(fall, since) {
    if (since === null || since < 0 || !fall) return null;
    const angle = 0.5 * PULL * since * since;
    const poses = fall.poses;
    let i = 0;
    while (i < poses.length - 1 && poses[i + 1].angle <= angle) i++;
    return poses[i];
  }

  /** The stones of an arch, standing or falling, with their towers; and the hinges once they open. */
  function drawStones(ctx, side, map, pose, cracks, flipT = 1, towers = null, px = 1) {
    const { arch } = side;
    const moved = (j, p) => {
      if (!pose) return p;
      const piece = M.pieceOf(side.fall, j);
      return piece >= 0 ? M.move(pose.moves[piece], p) : p;
    };
    arch.blocks.forEach((b, j) => {
      drawStone(
        ctx,
        b.corners.map((c) => map(moved(j, c))),
        j,
        flipT,
      );
    });
    if (towers)
      towers.forEach((k, j) => {
        if (!k) return;
        const b = arch.blocks[j];
        const top = moved(j, [b.middle[0], b.middle[1] + arch.thickness / 2]);
        const [x, y] = map(top);
        drawTower(ctx, x, y, k, px, 1);
      });
    if (cracks > 0 && side.mech) {
      ctx.save();
      ctx.globalAlpha = cracks;
      const [i, j, k, l] = side.mech.joints;
      [i, j, k, l].forEach((q, h) => {
        const corner = side.mech.sides[h] ? arch.joints[q].outer : arch.joints[q].inner;
        // A hinge moves with the stone before it; the first one stays with the ground.
        const [x, y] = map(h === 0 ? corner : moved(q - 1, corner));
        ctx.beginPath();
        ctx.arc(x, y, 4.2, 0, TAU);
        ctx.fillStyle = RED;
        ctx.fill();
        ctx.strokeStyle = 'rgba(10, 14, 21, 0.8)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });
      ctx.restore();
    }
  }

  function drawLeft(ctx, s, l) {
    const panel = l.panels[0];
    const v = viewFor(s, l);
    const turn = story.turn;
    const flipY = (y) => v.level + (y - v.level) * Math.cos(Math.PI * turn);
    const toCanvas = ([x, y]) => [panel.cx + (x - v.xm) * v.s, l.ground - (y - v.low) * v.s];
    // Points of the turned-over arch are first turned back to where the turn has reached.
    const fromArch = ([x, y]) => toCanvas([x, flipY(2 * v.level - y)]);
    const [a, b] = pegs(s);
    const towers = towersOf(s);
    const arching = turn > 0.5;

    // The ground under the arch, and a pier under a foot that stands higher.
    const groundAlpha = smooth(0.45, 0.95, turn);
    if (groundAlpha > 0) {
      drawGround(ctx, panel.x, panel.x + panel.w, l.ground, 0.2 * l.scale, groundAlpha);
      for (const p of [a, b]) {
        const foot = 2 * v.level - p[1];
        if (foot - v.low > 0.004) {
          const [x, y] = toCanvas([p[0], foot]);
          ctx.globalAlpha = groundAlpha;
          ctx.fillStyle = '#2a3343';
          ctx.fillRect(x - 0.06 * v.s, y + 2, 0.12 * v.s, l.ground - y - 2);
          ctx.strokeStyle = EARTH_LINE;
          ctx.strokeRect(x - 0.06 * v.s, y + 2, 0.12 * v.s, l.ground - y - 2);
          ctx.globalAlpha = 1;
        }
      }
    }

    // The chain, while it hangs and in the first part of the turn.
    const beadAlpha = 1 - smooth(0.25, 0.62, turn);
    const rest = restOf(s);
    let beads = moving ? moving.points : rest.points;
    if (story.turning || turn > 0) {
      // Settle onto the resting shape as the turn begins, so the arch is the chain's shape at rest.
      const from = story.from ?? beads;
      const k = smooth(0, 0.35, turn);
      const target = left.from ?? rest.points;
      beads = target.map((p, i) => [from[i][0] + (p[0] - from[i][0]) * k, from[i][1] + (p[1] - from[i][1]) * k]);
    }
    const chainPts = beads.map(([x, y]) => toCanvas([x, flipY(y)]));

    // Overlays for the road: the parabola it makes, and the bare chain's catenary.
    if (s.road && hung.bare && Math.abs(a[1] - b[1]) < 0.005 && !story.turning)
      drawOverlays(ctx, s, v, toCanvas, flipY, l);

    // The road and its hangers (posts, once turned over).
    if (s.road) {
      const deckY = flipY(v.low - DECK);
      const fallen = arching && story.leftFallAt !== null && clock > story.leftFallAt;
      const drop = fallen ? 0.5 * 9.8 * (clock - story.leftFallAt) ** 2 * 0.15 : 0;
      ctx.save();
      ctx.globalAlpha = fallen ? Math.max(0, 1 - (clock - story.leftFallAt) / 1.4) : 1;
      ctx.strokeStyle = 'rgba(160, 172, 188, 0.75)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      const deck = toCanvas([0, deckY]);
      chainPts.forEach(([x, y], i) => {
        if (i === 0 || i === chainPts.length - 1) return;
        ctx.moveTo(x, y);
        ctx.lineTo(x, deck[1] + drop * v.s * (arching ? 1 : 0));
      });
      ctx.stroke();
      const x0 = chainPts[0][0],
        x1 = chainPts[chainPts.length - 1][0];
      ctx.fillStyle = ROAD;
      const h = 0.022 * v.s;
      ctx.fillRect(x0 - 6, deck[1] + drop * v.s - (turn > 0.5 ? h : 0), x1 - x0 + 12, h);
      ctx.restore();
    }

    if (beadAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = beadAlpha;
      ctx.strokeStyle = CHAIN;
      ctx.lineWidth = Math.max(1.5, 0.008 * v.s);
      ctx.beginPath();
      chainPts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.stroke();
      const r = Math.max(2, 0.009 * v.s);
      chainPts.forEach(([x, y], i) => {
        if (i === 0 || i === chainPts.length - 1) return;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, TAU);
        ctx.fillStyle = BEAD;
        ctx.fill();
      });
      // Weights hanging from the middle bead of a stone's two links: towers, once turned over.
      towers.forEach((k, j) => {
        if (!k) return;
        const [x, y] = chainPts[2 * j + 1];
        drawTower(ctx, x, y + r, k, v.s, -Math.sign(Math.cos(Math.PI * turn)) || -1);
      });
      ctx.restore();
    }

    // The pegs, until the turn makes them feet.
    const pegAlpha = 1 - smooth(0.1, 0.45, turn);
    if (pegAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = pegAlpha;
      [a, b].forEach((p, i) => {
        const [x, y] = toCanvas([p[0], flipY(p[1])]);
        ctx.strokeStyle = '#6b5a3d';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, Math.max(l.head - 6, y - 0.12 * v.s));
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, Math.max(4.5, 0.016 * v.s), 0, TAU);
        ctx.fillStyle = PEG;
        ctx.fill();
        ctx.strokeStyle = '#3a2a14';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        if (cursor.on && cursor.handle === (i === 0 ? 'pegA' : 'pegB')) ring(ctx, x, y, 11);
      });
      ctx.restore();
    }

    // The stones, appearing as the chain turns over.
    const stoneAlpha = smooth(0.3, 0.75, turn);
    if (stoneAlpha > 0 && (left.arch || story.turning)) {
      if (!left.arch) buildLeft(s);
      const falling = story.turn === 1 && story.leftFallAt !== null;
      const since = falling ? clock - story.leftFallAt : null;
      const pose = falling ? fallPose(left.fall, instantFall(since)) : null;
      const cracks = falling ? smooth(-CRACK, -CRACK * 0.3, since) : 0;
      drawStones(ctx, left, fromArch, pose, cracks, stoneAlpha, turn > 0.62 ? towers : null, v.s);
      // The line of force, once it has turned over and while it stands.
      if (story.turn === 1 && left.line) {
        const shown = left.fall ? 1 - smooth(-0.1, 0.25, since ?? -1) : 1;
        drawLine(ctx, left.line.path, fromArch, shown * smooth(0.9, 1, turn), left.arch.thickness * v.s);
      }
      if (cursor.on && cursor.handle === 'stone' && story.turn === 1 && !falling) {
        const bl = left.arch.blocks[cursor.index];
        const [x, y] = fromArch(bl.middle);
        ring(ctx, x, y, Math.max(10, 0.03 * v.s));
      }
    }
    if (cursor.on && cursor.handle === 'stone' && story.turn === 0) {
      const [x, y] = chainPts[2 * cursor.index + 1];
      ring(ctx, x, y, 9);
    }

    // Words: what it is, and whether it stands.
    const x = panel.x + 4,
      big = l.narrow ? '700 13px system-ui, sans-serif' : '700 16px system-ui, sans-serif',
      small = l.narrow ? '600 11.5px system-ui, sans-serif' : '600 13px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    label(ctx, arching ? t.labels.arch : t.labels.chain, x, l.narrow ? 14 : 18, MUTED, small);
    if (story.turn === 1 && left.line) {
      const fell = !!left.fall;
      label(ctx, fell ? t.labels.falls : t.labels.stands, x, l.narrow ? 30 : 38, fell ? RED : GREEN, big);
    }
  }

  /** Falls already over (a reduced-motion visit, or a paused one) show their last pose. */
  const instantFall = (since) => (since === null ? null : reduced ? 1e3 : since);

  function drawOverlays(ctx, s, v, toCanvas, flipY, l) {
    const bare = hung.bare.points,
      rest = restOf(s).points;
    const low = Math.min(...rest.map((p) => p[1])),
      top = rest[0][1],
      x0 = rest[0][0],
      x1 = rest[M.LINKS][0],
      xm = (x0 + x1) / 2,
      half = (x1 - x0) / 2;
    const par = [];
    for (let k = 0; k <= 60; k++) {
      const x = x0 + (k / 60) * (x1 - x0);
      par.push([x, low + (top - low) * ((x - xm) / half) ** 2]);
    }
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1.4;
    for (const [pts, colour] of [
      [bare, 'rgba(255, 209, 102, 0.75)'],
      [par, 'rgba(143, 227, 168, 0.85)'],
    ]) {
      ctx.strokeStyle = colour;
      ctx.beginPath();
      pts.forEach(([x, y], i) => {
        const [cx, cy] = toCanvas([x, flipY(y)]);
        if (i) ctx.lineTo(cx, cy);
        else ctx.moveTo(cx, cy);
      });
      ctx.stroke();
    }
    ctx.setLineDash([]);
    const font = l.narrow ? '600 11px system-ui, sans-serif' : '600 12px system-ui, sans-serif';
    const up = story.turn > 0.5;
    const [px, py] = toCanvas([x1, flipY(low + (top - low) * 0.18)]);
    ctx.textAlign = 'right';
    label(ctx, t.labels.parabola, px - 8, py + (up ? -16 : 16), GREEN, font);
    const lowBare = Math.min(...bare.map((p) => p[1]));
    const [, cy] = toCanvas([xm, flipY(lowBare)]);
    ctx.textAlign = 'center';
    label(ctx, t.labels.catenary, toCanvas([xm, 0])[0], cy + (up ? -8 : 16), GOLD, font);
    ctx.restore();
  }

  function ring(ctx, x, y, r) {
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }

  /** The other arch: on its frame, then struck, then standing or falling. */
  function drawRight(ctx, s, l) {
    const panel = l.panels[1];
    const map = ([x, y]) => [panel.cx + x * l.scale, l.ground - y * l.scale];
    drawGround(ctx, panel.x, panel.x + panel.w, l.ground, 0.2 * l.scale);
    if (!right.arch) buildRight(s);
    const struck = story.struckAt !== null;
    const since = struck ? clock - story.struckAt : -1;
    const frameDrop = struck ? smooth(0, STRIKE, since) : 0;
    // The wooden frame (centring) the stones are laid on: ribs under the stones, and props down to the ground.
    if (frameDrop < 1) drawFrame(ctx, right.arch, map, frameDrop, l.scale);
    const falling = struck && story.rightFallAt !== null;
    const fallSince = falling ? (story.rightFallAt < 0 ? 1e3 : clock - story.rightFallAt) : null;
    const pose = falling ? fallPose(right.fall, instantFall(fallSince)) : null;
    const cracks = falling ? smooth(-CRACK, -CRACK * 0.3, fallSince) : 0;
    drawStones(ctx, right, map, pose, cracks);
    if (struck && right.line) {
      const shown = right.fall ? 1 - smooth(-0.1, 0.25, fallSince ?? -1) : 1;
      drawLine(ctx, right.line.path, map, shown * smooth(STRIKE * 0.5, STRIKE, since), right.arch.thickness * l.scale);
    }
    // Your own arch: its dots, and the stroke being drawn.
    if (s.shape === 3) {
      const shape = shapeFn(s);
      DOTS.forEach((_, k) => {
        const phi = M.dotAngle(k),
          r = shape(phi);
        const [x, y] = map([r * Math.cos(phi), r * Math.sin(phi)]);
        ctx.beginPath();
        ctx.arc(x, y, dragging?.kind === 'dot' && dragging.index === k ? 7 : 5.5, 0, TAU);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#1b2533';
        ctx.lineWidth = 2;
        ctx.stroke();
        if (cursor.on && cursor.handle === 'dot' && cursor.index === k) ring(ctx, x, y, 11);
      });
    }
    if (dragging?.kind === 'draw' && dragging.points.length > 1) {
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      dragging.points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.stroke();
      ctx.restore();
    }
    const x = panel.x + 4,
      big = l.narrow ? '700 13px system-ui, sans-serif' : '700 16px system-ui, sans-serif',
      small = l.narrow ? '600 11.5px system-ui, sans-serif' : '600 13px system-ui, sans-serif';
    ctx.textAlign = 'left';
    label(ctx, t.labels[SHAPES[s.shape]], x, l.narrow ? 14 : 18, MUTED, small);
    const word =
      dragging?.kind === 'draw'
        ? t.labels.drawing
        : !struck
          ? t.labels.building
          : right.fall
            ? t.labels.falls
            : t.labels.stands;
    const colour = !struck || dragging?.kind === 'draw' ? MUTED : right.fall ? RED : GREEN;
    label(ctx, word, x, l.narrow ? 30 : 38, colour, struck ? big : small);
  }

  function drawFrame(ctx, arch, map, drop, scale) {
    const down = drop * 0.06;
    ctx.save();
    ctx.globalAlpha = 1 - drop;
    ctx.strokeStyle = TIMBER;
    ctx.fillStyle = 'rgba(154, 116, 72, 0.25)';
    ctx.lineWidth = Math.max(1.5, 0.012 * scale);
    const inner = arch.joints.map((j) => [j.inner[0], j.inner[1] - down]);
    ctx.beginPath();
    inner.forEach((p, i) => {
      const [x, y] = map(p);
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    inner.forEach((p, i) => {
      if (i % 2 || i === 0 || i === inner.length - 1) return;
      const [x, y] = map(p);
      ctx.moveTo(x, y);
      ctx.lineTo(x, map([0, 0])[1]);
    });
    ctx.stroke();
    ctx.restore();
  }

  /** On a tall canvas: the same stones in each shape, standing or falling, and how thin their stones may be. */
  function drawGallery(ctx, s, l) {
    const g = l.gallery;
    if (!g) return;
    ctx.textAlign = 'left';
    label(ctx, t.labels.gallery, l.pad + 4, g.top + 4, MUTED, '600 13px system-ui, sans-serif');
    g.cells.forEach((cell, i) => {
      const key = i === 3 ? 'own' + DOTS.map((k) => s[k]).join(',') : SHAPES[i];
      const shape = i === 3 ? M.drawnShape(DOTS.map((k) => s[k] / 100)) : M.shapes[SHAPES[i]];
      const entry = galleryArch(key, shape, s.thick);
      const sc = Math.min((cell.w - 20) / 1.25, (cell.h - 56) / 0.95);
      const ground = cell.y + 18 + 0.95 * sc;
      const cx = cell.x + cell.w / 2;
      const map = ([x, y]) => [cx + x * sc, ground - y * sc];
      const chosen = s.shape === i;
      ctx.save();
      ctx.fillStyle = chosen ? 'rgba(255, 209, 102, 0.08)' : 'rgba(255, 255, 255, 0.03)';
      ctx.strokeStyle = chosen ? 'rgba(255, 209, 102, 0.55)' : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(cell.x + 4, cell.y - 4, cell.w - 8, cell.h, 8);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = EARTH_LINE;
      ctx.fillRect(cell.x + 12, ground, cell.w - 24, 1.5);
      entry.arch.blocks.forEach((b, j) => drawStone(ctx, b.corners.map(map), j));
      drawLine(ctx, entry.line.path, map, 1, entry.arch.thickness * sc);
      ctx.textAlign = 'center';
      label(ctx, t.labels[SHAPES[i]], cx, cell.y + 12, INK, '600 13px system-ui, sans-serif');
      const job = thinFor(key, (d) => M.shapeArch(shape, d));
      const verdict = entry.line.fits ? t.labels.stands : t.labels.falls;
      label(ctx, verdict, cx, ground + 20, entry.line.fits ? GREEN : RED, '700 13px system-ui, sans-serif');
      const thin = !thinDone(job)
        ? '…'
        : job.never
          ? t.labels.never(cm(THIN.hi))
          : job.any
            ? t.labels.any
            : t.labels.thinnest(cm(job.hi));
      label(ctx, thin, cx, ground + 37, MUTED, '12px system-ui, sans-serif');
    });
    if (g.chart) drawChart(ctx, s, g.chart);
  }

  /** A bar for each arch: the thinnest stones it stands with, against the stones chosen now. */
  function drawChart(ctx, s, c) {
    const from = left.from ?? restOf(s).points;
    const towers = towersOf(s);
    const chainKey = ['chain', left.from ? left.turned : hung.key, s.towers, s.road].join('|');
    const own = M.drawnShape(DOTS.map((k) => s[k] / 100));
    const rows = [
      { name: t.labels.chainShape, key: chainKey, build: (d) => M.chainArch(from, d, towers, s.road) },
      ...[2, 1, 0].map((i) => ({
        name: t.labels[SHAPES[i]],
        key: SHAPES[i],
        build: (d) => M.shapeArch(M.shapes[SHAPES[i]], d),
      })),
      { name: t.labels.own, key: shapeKey({ ...s, shape: 3 }), build: (d) => M.shapeArch(own, d) },
    ];
    const font = '600 13px system-ui, sans-serif',
      small = '12px system-ui, sans-serif';
    ctx.font = font;
    const nameW = Math.max(...rows.map((r) => ctx.measureText(r.name).width)) + 16;
    const x0 = c.x + nameW,
      x1 = c.x + c.w - 96,
      top = c.top + 30,
      most = 12; // centimetres along the axis
    const at = (cmValue) => x0 + (Math.min(cmValue, most) / most) * (x1 - x0);
    ctx.textAlign = 'left';
    label(ctx, t.labels.chartTitle, c.x, c.top, MUTED, font);
    rows.forEach((row, r) => {
      const y = top + r * 26;
      const job = thinFor(row.key, row.build);
      ctx.textAlign = 'right';
      label(ctx, row.name, x0 - 10, y + 5, INK, font);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(x0, y - 7, x1 - x0, 14);
      if (!thinDone(job)) return;
      const need = job.never ? Infinity : job.any ? 0 : job.hi * 100;
      ctx.fillStyle = need <= s.thick ? GREEN : RED;
      ctx.globalAlpha = 0.85;
      ctx.fillRect(x0, y - 7, Math.max(2, at(need) - x0), 14);
      ctx.globalAlpha = 1;
      ctx.textAlign = 'left';
      const text = job.never ? t.labels.never(cm(THIN.hi)) : job.any ? t.labels.any : cm(job.hi);
      label(ctx, text, Math.min(at(need), x1) + 8, y + 5, MUTED, small);
    });
    // The stones chosen now, as a line across the bars, and the axis in centimetres.
    const bottom = top + (rows.length - 1) * 26 + 10;
    const mark = at(s.thick);
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(mark, top - 16);
    ctx.lineTo(mark, bottom);
    ctx.stroke();
    ctx.restore();
    ctx.textAlign = 'center';
    label(ctx, t.labels.yours(cm(s.thick / 100)), mark, top - 18, INK, small);
    ctx.fillStyle = MUTED;
    ctx.font = small;
    for (let v = 0; v <= most; v += 2) {
      ctx.fillRect(at(v), bottom + 2, 1, 4);
      ctx.fillText(number(v, 0), at(v), bottom + 18);
    }
    ctx.textAlign = 'left';
    ctx.fillText(t.cm.trim(), x1 + 8, bottom + 18);
  }

  const galleryCache = {};
  function galleryArch(key, shape, thickCm) {
    const k = key + '|' + thickCm;
    if (!galleryCache[k]) {
      const arch = M.shapeArch(shape, thickCm / 100);
      galleryCache[k] = { arch, line: M.thrust(arch, true) };
      const keys = Object.keys(galleryCache);
      if (keys.length > 24) delete galleryCache[keys[0]];
    }
    return galleryCache[k];
  }

  const number = (x, digits, least = digits) =>
    x.toLocaleString(W.numberLocale, { minimumFractionDigits: least, maximumFractionDigits: digits });
  // Centimetres to a tenth below 10 cm (5.3 cm, but 4 cm), whole ones above.
  const cm = (metres) => t.length_cm(number(metres * 100, metres < 0.1 ? 1 : 0, 0));
  const percent = (share) => t.percent(number(Math.round(share * 100), 0));

  function draw(ctx, s, stage) {
    const { width, height } = stage;
    lay = layout(width, height);
    background(ctx, width, height);
    drawLeft(ctx, s, lay);
    drawRight(ctx, s, lay);
    drawGallery(ctx, s, lay);
  }

  /** The home card: a chain hanging above its own shape turned over, which stands, beside a semicircle falling. */
  function preview(ctx, width, height) {
    background(ctx, width, height);
    const rest = M.hang([-0.5, 0], [0.5, 0], 1.5, []);
    const low = Math.min(...rest.points.map((p) => p[1]));
    const sc = Math.min(width / 2.35, (height - 14) / (2 * -low + 0.12));
    // The chain and the arch, one above the other, in the middle of the picture.
    const need = (2 * -low + 0.1) * sc;
    const top = Math.max(7, (height - need) / 2);
    const ground = top + need;
    const cx = width * 0.28;
    drawGround(ctx, 0, width, ground, height - ground);
    // The chain, from two pegs at the top, just above the arch it turns into.
    const chainMap = ([x, y]) => [cx + x * sc, top - y * sc];
    ctx.strokeStyle = CHAIN;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    rest.points.forEach((p, i) => {
      const [x, y] = chainMap(p);
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    });
    ctx.stroke();
    ctx.fillStyle = BEAD;
    rest.points.forEach((p, i) => {
      if (i % 2 || i === 0 || i === M.LINKS) return;
      const [x, y] = chainMap(p);
      ctx.fillRect(x - 1, y - 1, 2, 2);
    });
    ctx.fillStyle = PEG;
    for (const p of [rest.points[0], rest.points[M.LINKS]]) {
      const [x, y] = chainMap(p);
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, TAU);
      ctx.fill();
    }
    const arch = M.chainArch(rest.points, 0.045);
    const archMap = ([x, y]) => [cx + x * sc, ground - (y - low) * sc];
    arch.blocks.forEach((b, j) => drawStone(ctx, b.corners.map(archMap), j));
    drawLine(ctx, M.thrust(arch, true).path, archMap, 1, 0.045 * sc);
    const other = { arch: M.shapeArch(M.shapes.semicircle, 0.04) };
    judge(other, 0);
    const semiMap = ([x, y]) => [width * 0.73 + x * sc, ground - y * sc];
    drawStones(ctx, other, semiMap, other.fall.poses[Math.floor(other.fall.poses.length * 0.6)], 1);
  }

  // ---------- panel ----------

  const presetSettings = [
    { towers: 0, road: false, flip: true, chain: 150, shape: 0 },
    {
      towers: towersCode(Array.from({ length: M.STONES }, (_, j) => (j === 5 ? 3 : 0))),
      road: false,
      flip: true,
      chain: 150,
      shape: 0,
    },
    { towers: 0, road: true, flip: true, chain: 130, shape: 0 },
  ].map((p) => ({ ax: -50, ay: 0, bx: 50, by: 0, thick: 4, ...p }));

  function presetIndex(s) {
    return presetSettings.findIndex((p) => Object.keys(p).every((k) => p[k] === s[k]));
  }

  function controls(s, stage) {
    const kinds =
      `<div class="control wide"><span class="arch-label" id="arch-beside">${t.beside}</span>` +
      `<div class="arch-shapes" role="group" aria-labelledby="arch-beside">` +
      SHAPES.map(
        (k, i) =>
          `<button type="button" class="button" data-shape="${i}" aria-pressed="${s.shape === i}">${t.shapes[k]}</button>`,
      ).join('') +
      `</div>${s.shape === 3 ? `<p>${t.ownHint}</p>` : ''}</div>`;
    return (
      stage.slider('chain', t.length, 105, 250, 5, s.chain, t.cm, t.lengthHint) +
      stage.slider('thick', t.thick, 1, 10, 0.5, s.thick, t.cm, t.thickHint) +
      `<div class="control wide">${stage.check('road', t.road, s.road)}</div>` +
      kinds +
      // Not a live region: it is rebuilt on every change. Each result is announced once.
      '<div class="wide readout arch-readout" id="arch-readout"></div>'
    );
  }

  let last = null; // the settings at the last change, to tell what a change was

  function changed(s, stage) {
    normalise(s);
    const before = last ?? s;
    last = { ...s };
    const chainMoved = ['ax', 'ay', 'bx', 'by', 'chain'].some((k) => before[k] !== s[k]);
    if (chainMoved) {
      // A new chain hangs again, and turns over again once it has settled.
      if (story.turn > 0 || story.turning) {
        startTurn(s, stage, 0);
        if (s.flip) story.turnAt = clock + (instant(stage) ? 0 : 1.8);
      } else if (s.flip && story.turnAt !== null) story.turnAt = Math.max(story.turnAt, clock + 1.2);
      if (instant(stage)) {
        moving = M.chain(restOf(s).points);
        if (s.flip) startTurn(s, stage, 1);
      }
    } else if (before.thick !== s.thick || before.road !== s.road || before.towers !== s.towers) {
      if (before.road !== s.road && story.turn === 0) restOf(s);
      reload(s, stage);
    }
    if (shapeKey(before) !== shapeKey(s) || before.thick !== s.thick)
      rebuild(s, stage, before.thick !== s.thick ? 0.5 : 0.7);
    stage.setChosen(presetIndex(s));
    stage.sync();
    stage.draw();
  }

  function bindControls(panel, s, stage) {
    panel.querySelectorAll('[data-shape]').forEach((button) =>
      button.addEventListener('click', () => {
        const shape = Number(button.dataset.shape);
        if (shape === s.shape) return;
        s.shape = shape;
        changed(s, stage);
        stage.refresh();
        panel.querySelector(`[data-shape="${shape}"]`)?.focus();
      }),
    );
    // The stage stores the tick; the room then hangs the road and judges the arch again.
    panel.querySelector('[data-check="road"]')?.addEventListener('change', () => changed(s, stage));
  }

  function readouts(s) {
    const i = presetIndex(s);
    $('scene-name').textContent = i >= 0 ? t.presets[i].name : t.sceneName;
    for (const [key, id] of [
      ['chain', 'c-chain'],
      ['thick', 'c-thick'],
    ]) {
      const input = $(id);
      if (input && Number(input.value) !== s[key]) input.value = s[key];
    }
    document
      .querySelectorAll('#scene-controls [data-shape]')
      .forEach((b) => b.setAttribute('aria-pressed', Number(b.dataset.shape) === s.shape));
    const road = document.querySelector('#scene-controls [data-check="road"]');
    if (road) road.checked = !!s.road;
    const name = t.labels[SHAPES[s.shape]];
    const struck = story.struckAt !== null;
    $('scene-status').textContent = [
      story.turn === 1 && left.line ? (left.fall ? t.status.falls : t.status.stands) : t.status.hanging,
      struck && right.line ? t.status.beside(name, right.line.fits) : '',
    ]
      .filter(Boolean)
      .join(' · ');
    const box = $('arch-readout');
    if (!box) return;
    let html = '';
    if (story.turn === 1 && left.line) {
      html += `<p class="arch-big${left.fall ? ' arch-warn' : ''}">${left.fall ? t.readout.falls : t.readout.stands}</p>`;
      html += `<p>${left.line.fits ? t.readout.inside(percent(left.line.inside)) : t.readout.outside(percent(-left.line.inside))}</p>`;
    } else html += `<p class="arch-big">${t.readout.hanging}</p>`;
    if (right.line) {
      html += `<p class="arch-big${struck && right.fall ? ' arch-warn' : ''}">${t.readout.beside(name, right.line.fits)}</p>`;
      const shape = shapeFn(s);
      const job = thinFor(shapeKey(s), (d) => M.shapeArch(shape, d));
      html += `<p>${
        !thinDone(job)
          ? t.readout.working
          : job.never
            ? t.readout.never(cm(THIN.hi))
            : job.any
              ? t.readout.any
              : right.line.fits
                ? t.readout.thinnest(cm(job.hi))
                : t.readout.thickest(cm(job.hi))
      }</p>`;
    }
    if (box.innerHTML !== html) box.innerHTML = html;
  }

  // ---------- pointer and keys ----------

  const cursor = { on: false, handle: 'stone', index: 10 }; // the keyboard's choice: a peg, a stone or a dot

  const panelAt = (x) => (lay && x >= lay.panels[1].x - 4 ? 1 : 0);
  /** The shape in the row below that a point is on, or −1. */
  const cellAt = (x, y) =>
    lay?.gallery
      ? lay.gallery.cells.findIndex((c) => x >= c.x + 4 && x <= c.x + c.w - 4 && y >= c.y - 4 && y <= c.y + c.h - 4)
      : -1;

  function pegNear(x, y, s) {
    if (!lay || story.turn > 0 || story.turning) return -1;
    const v = view ?? leftView(s, lay);
    const panel = lay.panels[0];
    let best = -1,
      bestD = 22;
    pegs(s).forEach((p, i) => {
      const d = Math.hypot(panel.cx + (p[0] - v.xm) * v.s - x, lay.ground - (p[1] - v.low) * v.s - y);
      if (d < bestD) {
        best = i;
        bestD = d;
      }
    });
    return best;
  }

  /** The stone (or, hanging, the pair of links) nearest a point in the left picture, or −1. */
  function stoneNear(x, y, s) {
    if (!lay || story.turning) return -1;
    const v = view ?? leftView(s, lay);
    const panel = lay.panels[0];
    const toCanvas = ([px, py]) => [panel.cx + (px - v.xm) * v.s, lay.ground - (py - v.low) * v.s];
    let best = -1,
      bestD = Math.max(18, 0.06 * v.s);
    if (story.turn === 1 && left.arch) {
      left.arch.blocks.forEach((b, j) => {
        const [cx, cy] = toCanvas(b.middle);
        const d = Math.hypot(cx - x, cy - y);
        if (d < bestD) {
          best = j;
          bestD = d;
        }
      });
    } else if (story.turn === 0 && moving) {
      for (let j = 0; j < M.STONES; j++) {
        const [cx, cy] = toCanvas(moving.points[2 * j + 1]);
        const d = Math.hypot(cx - x, cy - y);
        if (d < bestD) {
          best = j;
          bestD = d;
        }
      }
    }
    return best;
  }

  function dotNear(x, y, s) {
    if (!lay || s.shape !== 3) return -1;
    const panel = lay.panels[1],
      shape = shapeFn(s);
    let best = -1,
      bestD = 22;
    DOTS.forEach((_, k) => {
      const phi = M.dotAngle(k),
        r = shape(phi);
      const d = Math.hypot(
        panel.cx + r * Math.cos(phi) * lay.scale - x,
        lay.ground - r * Math.sin(phi) * lay.scale - y,
      );
      if (d < bestD) {
        best = k;
        bestD = d;
      }
    });
    return best;
  }

  /** Add a storey to a stone's tower (three at most, then none again). */
  function addStorey(j, s, stage, by = 1) {
    const list = towersOf(s);
    list[j] = (list[j] + by + STOREYS + 1) % (STOREYS + 1);
    s.towers = towersCode(list);
    changed(s, stage);
    W.announce(t.announce.towers(j + 1, list[j]));
  }

  /** Turn a drawn stroke into the nine dots: its distance from the middle of the ground in each dot's direction. */
  function strokeToDots(points, s) {
    const panel = lay.panels[1];
    const polar = points
      .map(([x, y]) => {
        const wx = (x - panel.cx) / lay.scale,
          wy = (lay.ground - y) / lay.scale;
        return { phi: Math.atan2(Math.max(wy, 0), wx), r: Math.hypot(wx, Math.max(wy, 0)) };
      })
      .filter((p) => p.r > 0.08);
    if (polar.length < 4) return false;
    const spread = Math.max(...polar.map((p) => p.phi)) - Math.min(...polar.map((p) => p.phi));
    if (spread < Math.PI / 3) return false;
    polar.sort((p, q) => p.phi - q.phi);
    DOTS.forEach((key, k) => {
      const phi = M.dotAngle(k);
      let r;
      if (phi <= polar[0].phi) r = polar[0].r;
      else if (phi >= polar[polar.length - 1].phi) r = polar[polar.length - 1].r;
      else {
        const i = polar.findIndex((p) => p.phi >= phi);
        const p = polar[i - 1],
          q = polar[i];
        r = p.r + ((phi - p.phi) / (q.phi - p.phi || 1)) * (q.r - p.r);
      }
      s[key] = Math.round(clamp(r, 0.15, 0.9) * 100);
    });
    return true;
  }

  function setDot(k, r, s, stage) {
    const value = Math.round(clamp(r, 0.15, 0.9) * 100);
    if (value === s[DOTS[k]]) return;
    s[DOTS[k]] = value;
    // While a dot moves, the arch stays on its frame; it is tested when the dot is let go.
    right.arch = M.shapeArch(shapeFn(s), thick(s));
    right.key = '';
    story.struckAt = null;
    story.strikeAt = null;
    story.rightFallAt = null;
    stage.setChosen(presetIndex(s));
  }

  const handles = (s) => [
    { handle: 'pegA', index: 0 },
    ...Array.from({ length: M.STONES }, (_, j) => ({ handle: 'stone', index: j })),
    { handle: 'pegB', index: 1 },
    ...(s.shape === 3 ? DOTS.map((_, k) => ({ handle: 'dot', index: k })) : []),
  ];

  // ---------- the room ----------

  W.defineRoom({
    id: 'arch',
    symbol: '⌒',
    theme: 'engineering',
    added: '2026-10-02',
    eyebrow: t.eyebrow,
    name: t.name,
    tagline: t.tagline,
    accent: { background: '#2a2419', border: '#d6a65a', color: '#f1dcb4' },

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
    connection: { ...t.connection, go: 'blocks' },

    // Pegs in centimetres (the pegs start 1 m apart), the chain's length and the stones' thickness in centimetres,
    // the towers stone by stone (base 4: 0 to 3 storeys each), and the drawn arch's dots in % of the span.
    defaults: { ...presetSettings[0], road: false, ...Object.fromEntries(DOTS.map((k) => [k, 50])) },
    ranges: {
      ax: [-90, -5, 'integer'],
      bx: [5, 90, 'integer'],
      ay: [-60, 60, 'integer'],
      by: [-60, 60, 'integer'],
      chain: [105, 250],
      thick: [1, 10],
      towers: [0, (STOREYS + 1) ** M.STONES - 1, 'integer'],
      shape: [0, 3, 'integer'],
      ...Object.fromEntries(DOTS.map((k) => [k, [15, 90, 'integer']])),
    },
    defaultPreset: 0,
    presets: t.presets.map((p, i) => ({ ...p, badge: ['⌒', '♜', '═'][i], settings: presetSettings[i] })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Hooke',
        color: '#d6a65a',
        // No portrait of Hooke is known: a drawn sketch, long dark hair.
        sketch: { hairStyle: 'long', hair: '#4a3626', skin: '#ecc9a6', brows: 'bold', backdrop: '#2a2419' },
      },
      {
        ...t.guests[1],
        bio: 'Galileo',
        color: '#9fb4d8',
        sketch: { hairStyle: 'receding', hair: '#8a6a4a', skin: '#e9c4a0', beard: 'full', backdrop: '#1b2233' },
      },
      {
        ...t.guests[2],
        color: '#8fe3a8',
        sketch: { hairStyle: 'receding', hair: '#d9d4c8', skin: '#efcfae', beard: 'full', backdrop: '#1d2a20' },
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
      normalise(s);
      last = { ...s };
      view = null;
      cursor.on = false;
      begin(s, stage);
      stage.sync();
    },
    onPreset(s, stage) {
      normalise(s);
      last = { ...s };
      right.key = '';
      begin(s, stage);
    },
    onInput(s, stage) {
      changed(s, stage);
    },
    reset(s, stage) {
      begin(s, stage);
      stage.sync();
    },
    /** Flip: turn the chain over into an arch, or hang it again. */
    action(s, stage) {
      s.flip = !(story.turning ? story.turning.to === 1 : story.turn === 1);
      story.turnAt = null;
      startTurn(s, stage, s.flip ? 1 : 0);
      stage.setChosen(presetIndex(s));
      if (!s.flip) W.announce(t.announce.hanging);
      stage.sync();
      stage.draw();
    },

    pointer: {
      // Touches drag on a peg or a dot, and draw in the right picture when drawing your own; elsewhere they scroll.
      drag(p, s, stage) {
        const x = p.x * stage.width,
          y = p.y * stage.height;
        return (
          pegNear(x, y, s) >= 0 ||
          dotNear(x, y, s) >= 0 ||
          (s.shape === 3 && panelAt(x) === 1 && y < (lay?.ground ?? 0) + 10)
        );
      },
      down(p, s, stage, e) {
        if (e && e.button > 0) return;
        cursor.on = false;
        const x = p.x * stage.width,
          y = p.y * stage.height;
        tap = null;
        const cell = cellAt(x, y);
        if (cell >= 0) {
          if (cell !== s.shape) {
            s.shape = cell;
            changed(s, stage);
            stage.refresh();
          }
          return;
        }
        const peg = pegNear(x, y, s);
        if (peg >= 0) {
          dragging = { kind: 'peg', index: peg };
          return;
        }
        if (panelAt(x) === 0) {
          const j = stoneNear(x, y, s);
          if (j >= 0) tap = { index: j, x, y };
          return;
        }
        const k = dotNear(x, y, s);
        if (k >= 0) {
          dragging = { kind: 'dot', index: k };
          return;
        }
        if (s.shape === 3 && y < lay.ground + 10) dragging = { kind: 'draw', points: [[x, y]] };
      },
      move(p, { dragging: held, mouse }, s, stage) {
        const x = p.x * stage.width,
          y = p.y * stage.height;
        const canvas = $('scene-canvas');
        if (mouse && !held) {
          const over = pegNear(x, y, s) >= 0 || dotNear(x, y, s) >= 0;
          canvas.classList.toggle('arch-grab', over);
          canvas.classList.toggle(
            'arch-pick',
            !over && (cellAt(x, y) >= 0 || (panelAt(x) === 0 && stoneNear(x, y, s) >= 0)),
          );
          canvas.classList.toggle('arch-draw', !over && s.shape === 3 && panelAt(x) === 1);
        }
        if (tap && Math.hypot(x - tap.x, y - tap.y) > 8) tap = null;
        if (!held || !dragging) return;
        if (dragging.kind === 'peg') {
          const v = view ?? leftView(s, lay);
          const panel = lay.panels[0];
          const wx = clamp(v.xm + (x - panel.cx) / v.s, -0.9, 0.9),
            wy = clamp(v.low + (lay.ground - y) / v.s, -0.6, 0.6);
          const other = pegs(s)[1 - dragging.index];
          const keys = dragging.index === 0 ? ['ax', 'ay'] : ['bx', 'by'];
          let px = dragging.index === 0 ? Math.min(wx, other[0] - 0.1) : Math.max(wx, other[0] + 0.1);
          // Keep the chain slack: the pegs can't be further apart than the chain is long.
          const L = lengthOf(s) / 1.04;
          let dx = px - other[0],
            dy = wy - other[1];
          const d = Math.hypot(dx, dy);
          if (d > L) {
            dx *= L / d;
            dy *= L / d;
          }
          s[keys[0]] = clamp(Math.round((other[0] + dx) * 100), ...(dragging.index === 0 ? [-90, -5] : [5, 90]));
          s[keys[1]] = clamp(Math.round((other[1] + dy) * 100), -60, 60);
          changed(s, stage);
        } else if (dragging.kind === 'dot') {
          const panel = lay.panels[1];
          const phi = M.dotAngle(dragging.index);
          const along = ((x - panel.cx) * Math.cos(phi) + (lay.ground - y) * Math.sin(phi)) / lay.scale;
          setDot(dragging.index, along, s, stage);
          stage.sync();
        } else if (dragging.kind === 'draw') {
          const lastPoint = dragging.points[dragging.points.length - 1];
          if (Math.hypot(x - lastPoint[0], y - lastPoint[1]) > 3) dragging.points.push([x, y]);
        }
        stage.draw();
      },
      up(e) {
        const s = W.stage.settingsFor('arch');
        const stage = W.stage;
        if (!s) return;
        const cancelled = e?.type === 'pointercancel';
        if (tap && !cancelled) addStorey(tap.index, s, stage);
        tap = null;
        const was = dragging;
        dragging = null;
        if (!was || cancelled) return;
        if (was.kind === 'dot') changed(s, stage);
        if (was.kind === 'draw') {
          if (strokeToDots(was.points, s)) changed(s, stage);
        }
        stage.draw();
      },
      leave() {
        $('scene-canvas').classList.remove('arch-grab', 'arch-pick', 'arch-draw');
      },
      escape() {
        cursor.on = false;
        W.stage.draw();
      },
      /** ← → choose a peg, a stone or a dot; ↑ ↓ change it. */
      arrow(dx, dy, s, stage) {
        const list = handles(s);
        let at = list.findIndex((h) => h.handle === cursor.handle && h.index === cursor.index);
        if (at < 0) at = 1 + Math.floor(M.STONES / 2);
        if (!cursor.on) {
          cursor.on = true;
          if (!dx && !dy) return;
        }
        if (dx) {
          at = (at + dx + list.length) % list.length;
          Object.assign(cursor, list[at]);
          const h = list[at];
          W.announce(
            h.handle === 'stone'
              ? t.announce.towers(h.index + 1, towersOf(s)[h.index])
              : h.handle === 'dot'
                ? t.announce.dot(h.index + 1)
                : t.announce.peg(h.index),
          );
          return;
        }
        const h = list[at];
        if (h.handle === 'stone') {
          if (story.turning) return;
          addStorey(h.index, s, stage, -dy);
        } else if (h.handle === 'dot') {
          setDot(h.index, s[DOTS[h.index]] / 100 - dy * 0.03, s, stage);
          changed(s, stage);
        } else {
          if (story.turn > 0) return;
          const key = h.index === 0 ? 'ay' : 'by';
          s[key] = clamp(s[key] - dy * 4, -60, 60);
          changed(s, stage);
        }
      },
      /** F or Enter flips; with a peg chosen, A and D move it sideways. */
      key(e, s, stage) {
        if (e.key === 'Enter' || W.isLetter(e, 'f')) {
          W.room('arch').action(s, stage);
          return true;
        }
        if (cursor.on && (cursor.handle === 'pegA' || cursor.handle === 'pegB') && story.turn === 0) {
          const dir = W.isLetter(e, 'a') ? -1 : W.isLetter(e, 'd') ? 1 : 0;
          if (!dir) return false;
          const key = cursor.handle === 'pegA' ? 'ax' : 'bx';
          const other = cursor.handle === 'pegA' ? s.bx : s.ax;
          s[key] =
            cursor.handle === 'pegA'
              ? clamp(s[key] + dir * 4, -90, Math.min(-5, other - 10))
              : clamp(s[key] + dir * 4, Math.max(5, other + 10), 90);
          changed(s, stage);
          return true;
        }
        return false;
      },
    },
  });
})();
