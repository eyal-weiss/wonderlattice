/*
 * Room · The shape hiding inside randomness: a Galton board whose random balls always pile into the same bell, a
 * lopsided die whose averages turn into a bell too, and a spinner whose averages never settle.
 */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, clamp } = W;
  const M = W.models.galton;
  const t = W.text('galton');
  const reduced = W.prefersReducedMotion();

  const BOARD = 0,
    DIE = 1,
    SPINNER = 2;
  const TOTAL_BALLS = 2000,
    ROW_TIME = 0.12, // seconds a ball takes from one row of pegs to the next
    DROP_TIME = 0.4; // and from the last row into its bin
  const HEAP_SIZE = 4000; // throws (or spins) in each heap of the die and the spinner
  const SPIN_RANGE = 6,
    SPIN_BINS = 24; // the spinner's heaps show −6…6 in bins of 0.5; the rest is off the chart
  const FACES = ['one', 'two', 'three', 'four', 'five', 'six'];
  // The die's starting shapes, in the panel's order: mostly 1s and 6s, fair, mostly 6s.
  const SHAPES = [
    [8, 1, 1, 1, 1, 8],
    [5, 5, 5, 5, 5, 5],
    [1, 1, 1, 1, 1, 10],
  ];
  const COLOURS = {
    ground: '#0a0e15',
    peg: '#8f9bb0',
    wall: '#2c3646',
    ball: '#f7b955',
    heap: '#e7a740',
    bell: '#7fd1ff',
    die: '#c792ea',
    lamp: '#ffe08a',
    ink: '#f4f5e9',
    muted: '#98aab7',
    faint: '#3a4556',
  };

  const weightsOf = (s) => FACES.map((face) => s[face]);
  const sum = (list) => list.reduce((a, b) => a + b, 0);
  const label = (ctx, size, weight = '') => (ctx.font = `${weight} ${size}px system-ui`.trim());

  // ── What is falling: the live state of each view, rebuilt when its settings change (like the dice room's tally,
  // it isn't part of the settings). ──
  let pour = null, // the board: balls in flight and the heap
    heaps = null, // the die: single throws and two heaps of averages
    spins = null, // the spinner: single spins and averages of spins
    cursor = null, // the die face the keyboard is changing
    dragging = false,
    layout = null; // the die's rectangle in the last frame, for the pointer

  /** The board's state for these settings: a new pour when they change. */
  function boardFor(s, stage) {
    const key = `${s.rows}|${s.tilt}|${s.seed}`;
    if (!pour || pour.key !== key) {
      pour = {
        key,
        rows: s.rows,
        p: s.tilt / 100,
        rand: M.random(s.seed * 7919 + s.rows * 31 + s.tilt),
        counts: new Array(s.rows + 1).fill(0),
        flying: [],
        spawned: 0,
        landed: 0,
        t: 0,
        carry: 0,
      };
      if (stage && (reduced || !stage.playing)) finishBoard(pour);
    }
    return pour;
  }

  function spawn(P) {
    const steps = M.path(P.rows, P.p, P.rand);
    P.flying.push({ steps, bin: sum(steps), age: 0 });
    P.spawned++;
  }

  const flightTime = (P) => P.rows * ROW_TIME + DROP_TIME;

  /** Advance the pour: balls come slowly at first, so each bounce can be followed, then pour. */
  function stepBoard(P, dt) {
    P.t += dt;
    P.carry += Math.min(150, 4 + 0.8 * P.t * P.t) * dt;
    while (P.carry >= 1 && P.spawned < TOTAL_BALLS) {
      spawn(P);
      P.carry -= 1;
    }
    const time = flightTime(P);
    for (const ball of P.flying) ball.age += dt;
    const still = [];
    for (const ball of P.flying)
      if (ball.age >= time) {
        P.counts[ball.bin]++;
        P.landed++;
      } else still.push(ball);
    P.flying = still;
    return P.landed === TOTAL_BALLS;
  }

  /** Every ball at once (reduced motion, a paused room, or the map's picture). */
  function finishBoard(P) {
    while (P.spawned < TOTAL_BALLS) spawn(P);
    for (const ball of P.flying) P.counts[ball.bin]++;
    P.landed = TOTAL_BALLS;
    P.flying = [];
  }

  /** The die's state: its chances and three heaps (single throws, averages of 2, averages of n). */
  function dieFor(s, stage) {
    const key = `${weightsOf(s)}|${s.n}|${s.seed}`;
    if (!heaps || heaps.key !== key) {
      const d = M.die(weightsOf(s));
      heaps = {
        key,
        n: s.n,
        die: d,
        rand: M.random(s.seed * 104729 + s.n),
        one: new Array(6).fill(0),
        two: new Array(M.bins(2).count).fill(0),
        many: new Array(M.bins(s.n).count).fill(0),
        expected: [d.chances, M.averageChances(d.chances, 2), M.averageChances(d.chances, s.n)],
        samples: 0,
        t: 0,
        carry: 0,
      };
      if (stage && (reduced || !stage.playing)) fill(heaps, throwOnce);
    }
    return heaps;
  }

  function throwOnce(H) {
    const total = (n) => {
      let x = 0;
      for (let i = 0; i < n; i++) x += M.throwDie(H.die.chances, H.rand);
      return x;
    };
    H.one[total(1) - 1]++;
    H.two[M.binOfTotal(total(2), 2)]++;
    H.many[M.binOfTotal(total(H.n), H.n)]++;
    H.samples++;
  }

  /** The spinner's state: where single spins land, and where averages of n spins land. */
  function spinnerFor(s, stage) {
    const key = `${s.n}|${s.seed}`;
    if (!spins || spins.key !== key) {
      spins = {
        key,
        n: s.n,
        rand: M.random(s.seed * 15485863 + s.n),
        one: new Array(SPIN_BINS).fill(0),
        many: new Array(SPIN_BINS).fill(0),
        off: [0, 0], // single spins, averages: how many landed beyond ±6
        recent: [], // the last few single spins, drawn as rays from the lamp
        samples: 0,
        t: 0,
        carry: 0,
      };
      if (stage && (reduced || !stage.playing)) fill(spins, spinOnce);
    }
    return spins;
  }

  const spinBin = (x) => Math.floor(((x + SPIN_RANGE) / (2 * SPIN_RANGE)) * SPIN_BINS);

  function spinOnce(S) {
    const one = M.spin(S.rand);
    let total = one;
    for (let i = 1; i < S.n; i++) total += M.spin(S.rand);
    [one, total / S.n].forEach((x, which) => {
      const bin = spinBin(x);
      if (bin >= 0 && bin < SPIN_BINS) (which ? S.many : S.one)[bin]++;
      else S.off[which]++;
    });
    S.recent.push(one);
    if (S.recent.length > 14) S.recent.shift();
    S.samples++;
  }

  /** Heaps grow slowly at first, then fast, up to HEAP_SIZE. */
  function stepHeap(H, dt, once) {
    H.t += dt;
    H.carry += Math.min(500, 6 + 5 * H.t * H.t) * dt;
    while (H.carry >= 1 && H.samples < HEAP_SIZE) {
      once(H);
      H.carry -= 1;
    }
  }

  function fill(H, once) {
    while (H.samples < HEAP_SIZE) once(H);
  }

  /** Forget every view's state, so it starts again (from the same seed). */
  function restart() {
    pour = heaps = spins = null;
  }

  // ── Drawing ──

  const smallFor = (width, height) => Math.round(clamp(Math.min(width, height) / 30, 10, 13));

  /**
   * The board's geometry: pegs (rows × spacing), bins under them, and the heap's floor at `floorY`. Each bin holds
   * a column `colW` wide, with `perLayer` balls side by side in each layer while they still fit as whole balls.
   */
  function boardLayout(width, floorY, rows, small) {
    const pad = Math.max(10, Math.min(width, floorY) * 0.04);
    const top = pad + small * 1.6; // room for the hopper the balls fall from
    const usable = floorY - top;
    const dy = (usable * 0.5) / rows;
    const dx = Math.min((width - 2 * pad) / (rows + 1), dy * 1.9);
    const bd = clamp(Math.min(dx * 0.3, dy * 0.55), 3, 11); // a ball's diameter
    const colW = dx * 0.8,
      perLayer = Math.max(1, Math.floor(colW / bd));
    const binTop = top + rows * dy + dy * 0.6;
    return { pad, small, dx, dy, bd, colW, perLayer, cx: width / 2, top, binTop, floor: floorY };
  }

  /**
   * Where the board ends and what goes under it. On a tall picture the board takes the top 70% (so its heap is in
   * view when the room opens on a laptop) and four more pours fill a strip below; otherwise the board takes it all.
   */
  function boardSplit(width, height) {
    const pad = Math.max(10, Math.min(width, height) * 0.04);
    if (height < 480) return { floor: height - pad, strip: null };
    const floor = Math.round(height * 0.7);
    return { floor, strip: { x: pad, y: floor + pad * 1.2, w: width - 2 * pad, h: height - pad - floor - pad * 1.2 } };
  }

  const pegX = (L, i, j) => L.cx + (j - i / 2) * L.dx;
  const pegY = (L, i) => L.top + i * L.dy;

  /** Where a ball is `age` seconds after it was dropped. */
  function ballAt(L, ball, heapTop) {
    const { steps } = ball,
      rows = steps.length;
    const time = ball.age / ROW_TIME;
    const i = Math.floor(time);
    if (i >= rows) {
      // Past the last peg: it drops into its bin.
      const x = pegX(L, rows, ball.bin);
      const f = Math.min(1, (ball.age - rows * ROW_TIME) / DROP_TIME);
      const from = pegY(L, rows) - L.bd * 0.5;
      return { x, y: from + (heapTop(ball.bin) - L.bd / 2 - from) * f * f };
    }
    const f = time - i;
    const j = steps.slice(0, i).reduce((a, b) => a + b, 0);
    const x0 = pegX(L, i, j),
      x1 = pegX(L, i + 1, j + steps[i]);
    // From just above peg (i, j) to just above the next one, in a little hop.
    const y0 = pegY(L, i) - L.bd * 0.5,
      y1 = pegY(L, i + 1) - L.bd * 0.5;
    return { x: x0 + (x1 - x0) * f, y: y0 + (y1 - y0) * f * f - Math.sin(Math.PI * f) * L.dy * 0.35 };
  }

  /** The bell for a board: de Moivre's curve with the board's mean and spread, in balls per bin. */
  function bellOf(rows, p) {
    const mean = rows * p,
      sd = Math.sqrt(rows * p * (1 - p));
    return { mean, sd, at: (bin) => M.normal(bin, mean, sd) };
  }

  /** Draw a curve over bins `from`…`to`: `y(bin)` gives its height on the canvas. */
  function curve(ctx, from, to, x, y) {
    ctx.beginPath();
    const steps = 120;
    for (let k = 0; k <= steps; k++) {
      const bin = from + ((to - from) * k) / steps;
      if (k) ctx.lineTo(x(bin), y(bin));
      else ctx.moveTo(x(bin), y(bin));
    }
    ctx.stroke();
  }

  function drawBoard(ctx, width, height, P, others) {
    const small = smallFor(width, height);
    const split = boardSplit(width, height);
    const L = boardLayout(width, split.floor, P.rows, small);
    const { dx, bd, cx, binTop, floor, colW, perLayer } = L;
    const bell = bellOf(P.rows, P.p);
    // One ball's height in the heap: whole balls in layers while they fit, then squeezed so the heap fits.
    const layerH = bd * 0.88,
      whole = layerH / perLayer;
    const tallest = Math.max(1, ...P.counts, P.landed * Math.max(...M.binomial(P.rows, P.p), bell.at(bell.mean)));
    const unit = Math.min(whole, ((floor - binTop) * 0.88) / tallest);
    const columnTop = (bin) => floor - P.counts[bin] * unit;
    const binX = (bin) => cx + (bin - P.rows / 2) * dx;

    // The hopper.
    ctx.strokeStyle = COLOURS.faint;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - dx * 1.4, L.pad);
    ctx.lineTo(cx - bd * 0.8, L.top - L.dy * 0.6);
    ctx.moveTo(cx + dx * 1.4, L.pad);
    ctx.lineTo(cx + bd * 0.8, L.top - L.dy * 0.6);
    ctx.stroke();

    // The bins' walls and floor.
    ctx.strokeStyle = COLOURS.wall;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let j = 0; j <= P.rows + 1; j++) {
      ctx.moveTo(binX(j - 0.5), binTop);
      ctx.lineTo(binX(j - 0.5), floor);
    }
    ctx.moveTo(binX(-0.5), floor);
    ctx.lineTo(binX(P.rows + 0.5), floor);
    ctx.stroke();

    // The pegs.
    ctx.fillStyle = COLOURS.peg;
    const pegR = clamp(Math.min(dx, L.dy) * 0.11, 1.5, 4);
    for (let i = 0; i < P.rows; i++)
      for (let j = 0; j <= i; j++) {
        ctx.beginPath();
        ctx.arc(pegX(L, i, j), pegY(L, i), pegR, 0, Math.PI * 2);
        ctx.fill();
      }

    // The heap: whole balls in layers while they fit, then a column squeezed to fit, the same width.
    ctx.fillStyle = COLOURS.heap;
    for (let j = 0; j <= P.rows; j++) {
      const count = P.counts[j];
      if (!count) continue;
      const left = binX(j) - colW / 2;
      if (unit >= whole * 0.999)
        for (let k = 0; k < count; k++) {
          ctx.beginPath();
          const across = (k % perLayer) + 0.5,
            up = Math.floor(k / perLayer) + 0.5;
          ctx.arc(left + (across * colW) / perLayer, floor - up * layerH, bd / 2 - 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      else {
        const h = count * unit;
        ctx.beginPath();
        ctx.roundRect(left, floor - h, colW, h, [Math.min(bd / 2, h), Math.min(bd / 2, h), 0, 0]);
        ctx.fill();
      }
    }

    // The balls in flight.
    ctx.fillStyle = COLOURS.ball;
    for (const ball of P.flying) {
      const { x, y } = ballAt(L, ball, columnTop);
      ctx.beginPath();
      ctx.arc(x, y, bd / 2 - 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // The bell the heap grows into, scaled to the balls landed so far, and its name beside its shoulder.
    if (P.landed >= 20) {
      ctx.strokeStyle = COLOURS.bell;
      ctx.lineWidth = 2;
      curve(ctx, -0.5, P.rows + 0.5, binX, (bin) => floor - P.landed * bell.at(bin) * unit);
      const side = bell.mean <= P.rows / 2 ? 1 : -1;
      const at = bell.mean + side * 1.5 * bell.sd;
      label(ctx, small, 600);
      ctx.fillStyle = COLOURS.bell;
      ctx.textAlign = side > 0 ? 'left' : 'right';
      ctx.fillText(t.labels.bell, binX(at) + side * 10, floor - P.landed * bell.at(at) * unit - 6);
      ctx.textAlign = 'left';
    }

    if (split.strip && others) drawOthers(ctx, split.strip, P, others, small);
  }

  /** Four more pours with the same pegs, finished, each under its bell: a strip below the board. */
  function drawOthers(ctx, box, P, others, small) {
    label(ctx, small, 600);
    ctx.fillStyle = COLOURS.muted;
    ctx.textAlign = 'left';
    ctx.fillText(t.labels.others(others.length, TOTAL_BALLS), box.x, box.y + small, box.w);
    const gap = Math.max(12, box.w * 0.03);
    const w = (box.w - gap * (others.length - 1)) / others.length,
      top = box.y + small * 1.8,
      h = box.y + box.h - top;
    const bell = bellOf(P.rows, P.p);
    others.forEach((counts, i) => {
      const x0 = box.x + i * (w + gap),
        dx = w / (P.rows + 1);
      const unit = (h * 0.9) / Math.max(...counts, TOTAL_BALLS * bell.at(bell.mean));
      const binX = (bin) => x0 + (bin + 0.5) * dx;
      ctx.fillStyle = COLOURS.heap;
      counts.forEach((count, j) => ctx.fillRect(binX(j) - dx * 0.38, top + h - count * unit, dx * 0.76, count * unit));
      ctx.strokeStyle = COLOURS.wall;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x0, top + h + 0.5);
      ctx.lineTo(x0 + w, top + h + 0.5);
      ctx.stroke();
      ctx.strokeStyle = COLOURS.bell;
      ctx.lineWidth = 1.5;
      curve(ctx, -0.5, P.rows + 0.5, binX, (bin) => top + h - TOTAL_BALLS * bell.at(bin) * unit);
    });
  }

  /** Four more finished pours of the board with these pegs, each from its own random balls. */
  let othersKey = '',
    othersCounts = null;
  function othersFor(P, seed) {
    const key = `${P.rows}|${P.p}|${seed}`;
    if (key !== othersKey) {
      othersKey = key;
      othersCounts = [1, 2, 3, 4].map((k) => {
        const rand = M.random(seed * 7919 + P.rows * 31 + Math.round(P.p * 100) + 1000003 * k);
        const counts = new Array(P.rows + 1).fill(0);
        for (let b = 0; b < TOTAL_BALLS; b++) counts[sum(M.path(P.rows, P.p, rand))]++;
        return counts;
      });
    }
    return othersCounts;
  }

  /**
   * The die's and the spinner's pictures are made of cells (a title, then a plot). Returns the cells' rectangles:
   * four for the die (2 × 2, or a row of four on a very wide picture), three for the spinner (the lamp across the
   * top, two heaps under it, or a row of three).
   */
  function cells(width, height, count) {
    const pad = Math.max(10, Math.min(width, height) * 0.04),
      gap = pad;
    const innerW = width - 2 * pad,
      innerH = height - 2 * pad;
    if (width > height * 2.1) {
      const w = (innerW - (count - 1) * gap) / count;
      return Array.from({ length: count }, (_, i) => ({ x: pad + i * (w + gap), y: pad, w, h: innerH }));
    }
    // The lamp's band is only as tall as the lamp's height above the wall, plus its words (see drawSpinner).
    const h =
        count === 3 ? Math.min((innerH - gap) / 2, innerW / 13 + smallFor(width, height) * 3.4) : (innerH - gap) / 2,
      w = (innerW - gap) / 2,
      below = innerH - h - gap;
    const bottom = [
      { x: pad, y: pad + h + gap, w, h: below },
      { x: pad + w + gap, y: pad + h + gap, w, h: below },
    ];
    if (count === 3) return [{ x: pad, y: pad, w: innerW, h }, ...bottom];
    return [{ x: pad, y: pad, w, h }, { x: pad + w + gap, y: pad, w, h }, ...bottom];
  }

  /** A cell's title, and the plot area under it (leaving a line for the axis's numbers). */
  function plotIn(ctx, cell, title, small, colour = COLOURS.muted) {
    label(ctx, small, 600);
    ctx.fillStyle = colour;
    ctx.textAlign = 'left';
    ctx.fillText(title, cell.x, cell.y + small, cell.w);
    const top = cell.y + small * 1.9;
    return { x: cell.x + 2, y: top, w: cell.w - 4, h: cell.y + cell.h - top - small * 1.5 };
  }

  /** An axis from `from` to `to`, with whole numbers marked: `marks` is a list of [value, text]. */
  function axis(ctx, plot, from, to, marks, small) {
    const base = plot.y + plot.h;
    ctx.strokeStyle = COLOURS.faint;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(plot.x, base + 0.5);
    ctx.lineTo(plot.x + plot.w, base + 0.5);
    ctx.stroke();
    label(ctx, small - 1);
    ctx.fillStyle = COLOURS.muted;
    ctx.textAlign = 'center';
    for (const [value, text] of marks)
      ctx.fillText(text, plot.x + ((value - from) / (to - from)) * plot.w, base + small * 1.2);
    ctx.textAlign = 'left';
  }

  /**
   * A heap of bars over a plot: `counts[b]` at x `middle(b)` with width `wide` (in the axis's units), scaled so
   * the expected heap (`expected` chances × samples) fits, and a curve `curve(x)` (expected count per unit) over it.
   */
  function heap(ctx, plot, { from, to, counts, middle, wide, samples, expected, curve, colour }) {
    const base = plot.y + plot.h;
    const scale = plot.w / (to - from);
    const steps = 160;
    const values = curve ? Array.from({ length: steps + 1 }, (_, k) => from + ((to - from) * k) / steps) : [];
    const heights = values.map((value) => curve(value));
    // Room for the tallest bar and the curve's peak, at the size the heap is heading for.
    const unit =
      (plot.h * 0.9) / Math.max(1, ...counts, samples * Math.max(...expected), samples * Math.max(0, ...heights));
    ctx.fillStyle = colour;
    counts.forEach((count, b) => {
      if (!count) return;
      const x = plot.x + (middle(b) - from) * scale,
        w = Math.max(1, wide * scale * 0.86);
      ctx.fillRect(x - w / 2, base - count * unit, w, count * unit);
    });
    if (curve && samples >= 20) {
      ctx.strokeStyle = COLOURS.bell;
      ctx.lineWidth = 2;
      ctx.beginPath();
      values.forEach((value, k) => {
        const x = plot.x + (value - from) * scale,
          y = base - heights[k] * samples * unit;
        if (k) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      });
      ctx.stroke();
    }
  }

  const faceMarks = [1, 2, 3, 4, 5, 6].map((v) => [v, String(v)]);

  function drawDie(ctx, width, height, s, H) {
    const small = smallFor(width, height);
    const [designer, ...heapCells] = cells(width, height, 4);
    const { mean, sd } = H.die;

    // The die itself: six bars to drag.
    const plot = plotIn(ctx, designer, t.labels.yourDie, small, COLOURS.die);
    layout = { plot, view: DIE };
    axis(ctx, plot, 0.5, 6.5, faceMarks, small);
    const slot = plot.w / 6;
    weightsOf(s).forEach((weight, i) => {
      const h = (weight / 10) * plot.h,
        x = plot.x + i * slot + slot * 0.14;
      ctx.fillStyle = COLOURS.die;
      ctx.fillRect(x, plot.y + plot.h - h, slot * 0.72, h);
      // A handle on each bar, so it looks draggable.
      ctx.fillStyle = COLOURS.ink;
      ctx.fillRect(x + slot * 0.2, plot.y + plot.h - h - 2, slot * 0.32, 3);
      if (cursor === i) {
        ctx.strokeStyle = COLOURS.ink;
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 3, plot.y - 2, slot * 0.72 + 6, plot.h + 4);
      }
    });

    // Three heaps on the same axis, 1 to 6, so the averages' bell can be seen narrowing.
    const [oneCell, twoCell, manyCell] = heapCells;
    const ms = [1, 2, H.n];
    [
      [oneCell, t.labels.oneThrow, H.one],
      [twoCell, t.labels.average(2), H.two],
      [manyCell, t.labels.average(H.n), H.many],
    ].forEach(([cell, title, counts], which) => {
      const m = ms[which],
        { group } = M.bins(m);
      const area = plotIn(ctx, cell, title, small);
      axis(ctx, area, 0.5, 6.5, faceMarks, small);
      heap(ctx, area, {
        from: 0.5,
        to: 6.5,
        counts,
        middle: (b) => M.binMiddle(b, m),
        wide: group / m,
        samples: H.samples,
        expected: H.expected[which],
        // The bell with the die's mean and the averages' spread, sd / √m, per unit of the axis.
        curve: (x) => M.normal(x, mean, sd / Math.sqrt(m)) * (group / m),
        colour: COLOURS.heap,
      });
    });
  }

  function drawSpinner(ctx, width, height, S) {
    const small = smallFor(width, height);
    const [scene, oneCell, manyCell] = cells(width, height, 3);
    layout = null;

    // The lamp, one step above a long wall, and where its last few spins landed.
    const wallY = scene.y + scene.h - small * 1.6,
      lampX = scene.x + scene.w / 2,
      lampY = Math.max(scene.y + small * 0.6, wallY - scene.w / (2 * SPIN_RANGE + 1));
    ctx.save();
    ctx.beginPath();
    ctx.rect(scene.x, scene.y, scene.w, scene.h);
    ctx.clip();
    S.recent.forEach((x, i) => {
      const fade = (i + 1) / S.recent.length;
      const hitX = lampX + x * (wallY - lampY); // a lamp at height h lights the wall h·tan(angle) away
      ctx.strokeStyle = `rgba(255, 224, 138, ${0.12 + 0.55 * fade})`;
      ctx.lineWidth = i === S.recent.length - 1 ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(lampX, lampY);
      ctx.lineTo(hitX, wallY);
      ctx.stroke();
      ctx.fillStyle = COLOURS.lamp;
      ctx.fillRect(hitX - 1.5, wallY - 5, 3, 10);
    });
    ctx.restore();
    ctx.strokeStyle = COLOURS.muted;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(scene.x, wallY);
    ctx.lineTo(scene.x + scene.w, wallY);
    ctx.stroke();
    ctx.fillStyle = COLOURS.lamp;
    ctx.beginPath();
    ctx.arc(lampX, lampY, Math.max(4, small * 0.45), 0, Math.PI * 2);
    ctx.fill();
    label(ctx, small - 1);
    ctx.fillStyle = COLOURS.muted;
    ctx.textAlign = 'left';
    ctx.fillText(t.labels.lamp, lampX + small * 0.9, lampY + small * 0.35);
    ctx.textAlign = 'right';
    ctx.fillText(t.labels.wall, scene.x + scene.w, wallY + small * 1.3);
    ctx.textAlign = 'left';

    // Two heaps of where the light lands: single spins, and averages of n spins. The same curve fits both.
    const marks = [-6, -3, 0, 3, 6].map((v) => [v, v < 0 ? `−${-v}` : String(v)]);
    const width2 = (2 * SPIN_RANGE) / SPIN_BINS;
    [
      [oneCell, t.labels.oneSpin, S.one, S.off[0]],
      [manyCell, t.labels.averageSpins(S.n), S.many, S.off[1]],
    ].forEach(([cell, title, counts, off]) => {
      const area = plotIn(ctx, cell, title, small);
      area.h -= small * 1.3; // a line under the axis for the spins off the chart
      ctx.direction = 'ltr'; // signed numbers read −6 … 6 on right-to-left pages too
      axis(ctx, area, -SPIN_RANGE, SPIN_RANGE, marks, small);
      heap(ctx, area, {
        from: -SPIN_RANGE,
        to: SPIN_RANGE,
        counts,
        middle: (b) => -SPIN_RANGE + (b + 0.5) * width2,
        wide: width2,
        samples: S.samples,
        expected: [M.spinnerChance(0, width2)], // the most likely bin, either side of 0
        curve: (x) => M.spinnerDensity(x) * width2,
        colour: COLOURS.heap,
      });
      ctx.direction = 'inherit';
      label(ctx, small - 1);
      ctx.fillStyle = COLOURS.muted;
      ctx.textAlign = 'center';
      ctx.fillText(t.labels.off(off), area.x + area.w / 2, area.y + area.h + small * 2.5, area.w);
      ctx.textAlign = 'left';
    });
  }

  function draw(ctx, s, stage) {
    const { width, height } = stage;
    ctx.fillStyle = COLOURS.ground;
    ctx.fillRect(0, 0, width, height);
    ctx.textBaseline = 'alphabetic';
    if (s.view === DIE) drawDie(ctx, width, height, s, dieFor(s, stage));
    else if (s.view === SPINNER) drawSpinner(ctx, width, height, spinnerFor(s, stage));
    else {
      layout = null;
      const P = boardFor(s, stage);
      drawBoard(ctx, width, height, P, othersFor(P, s.seed));
    }
  }

  /** The map's picture and link preview: a finished heap under its bell, with a few balls still falling. */
  function preview(ctx, width, height) {
    const P = {
      key: 'preview',
      rows: 12,
      p: 0.5,
      rand: M.random(5),
      counts: new Array(13).fill(0),
      flying: [],
      spawned: 0,
      landed: 0,
      t: 0,
      carry: 0,
    };
    finishBoard(P);
    for (let i = 0; i < 6; i++) {
      spawn(P);
      P.flying[i].age = i * 0.27;
    }
    ctx.fillStyle = COLOURS.ground;
    ctx.fillRect(0, 0, width, height);
    drawBoard(ctx, width, height, P, othersFor(P, 5));
  }

  // ── The panel ──

  const pressed = (on) => `aria-pressed="${on}"`;
  const shapeOf = (s) => SHAPES.findIndex((shape) => shape.every((w, i) => w === s[FACES[i]]));

  function controls(s, stage) {
    let h =
      `<div class="control wide"><label id="galton-view-label">${t.viewLabel}</label>` +
      `<div class="segment" role="group" aria-labelledby="galton-view-label">` +
      t.views
        .map((name, i) => `<button type="button" data-view="${i}" ${pressed(s.view === i)}>${name}</button>`)
        .join('') +
      '</div></div>';
    if (s.view === BOARD)
      h +=
        stage.slider('rows', t.rows, 4, 16, 1, s.rows) +
        stage.slider('tilt', t.tilt, 10, 90, 5, s.tilt, '%', t.tiltHint);
    else if (s.view === DIE)
      h +=
        `<div class="control wide"><label id="galton-shape-label">${t.shapeLabel}</label>` +
        `<div class="segment" role="group" aria-labelledby="galton-shape-label">` +
        t.shapes
          .map((name, i) => `<button type="button" data-shape="${i}" ${pressed(shapeOf(s) === i)}>${name}</button>`)
          .join('') +
        `</div><p>${t.dieHint}</p></div>` +
        stage.slider('n', t.throws, 3, 30, 1, s.n);
    else h += stage.slider('n', t.spins, 3, 30, 1, s.n, '', t.spinHint);
    return h;
  }

  function bindControls(panel, s, stage) {
    panel.querySelectorAll('[data-view]').forEach((button) =>
      button.addEventListener('click', () => {
        s.view = Number(button.dataset.view);
        stage.setChosen(-1);
        cursor = null;
        stage.refresh();
        stage.draw();
      }),
    );
    panel.querySelectorAll('[data-shape]').forEach((button) =>
      button.addEventListener('click', () => {
        SHAPES[Number(button.dataset.shape)].forEach((w, i) => (s[FACES[i]] = w));
        stage.setChosen(-1);
        stage.sync();
        stage.draw();
      }),
    );
  }

  function status(s, stage) {
    if (s.view === DIE) return t.status.throwing(dieFor(s, stage).samples);
    if (s.view === SPINNER) return t.status.spinning(spinnerFor(s, stage).samples);
    const { landed } = boardFor(s, stage);
    return landed === TOTAL_BALLS ? t.status.poured(landed) : t.status.pouring(landed);
  }

  function readouts(s, stage) {
    const view = s.view;
    $('scene-status').textContent = status(s, stage);
    $('scene-action').textContent = t.actions[view];
    $('scene-label').textContent = t.scenes[view].label;
    $('scene-name').textContent = t.scenes[view].name;
    $('scene-tip').textContent = t.tips[view];
    $('scene-canvas').setAttribute('aria-label', t.canvasLabels[view]);
    document
      .querySelectorAll('#scene-controls [data-view]')
      .forEach((b) => b.setAttribute('aria-pressed', Number(b.dataset.view) === view));
    const shape = shapeOf(s);
    document
      .querySelectorAll('#scene-controls [data-shape]')
      .forEach((b) => b.setAttribute('aria-pressed', Number(b.dataset.shape) === shape));
  }

  // ── The die's bars, by pointer and keyboard ──

  const inDie = (p, s, stage) => {
    if (s.view !== DIE || !layout) return false;
    const x = p.x * stage.width,
      y = p.y * stage.height,
      { plot } = layout;
    return x >= plot.x && x <= plot.x + plot.w && y >= plot.y - 12 && y <= plot.y + plot.h + 6;
  };

  /** Set one face's weight (0–10), keeping at least one face above zero. */
  function setWeight(s, stage, face, weight) {
    const next = clamp(Math.round(weight), 0, 10);
    if (next === s[FACES[face]]) return false;
    if (next === 0 && FACES.every((f, i) => i === face || s[f] === 0)) return false;
    s[FACES[face]] = next;
    stage.setChosen(-1);
    stage.sync();
    stage.draw();
    return true;
  }

  function dragTo(p, s, stage) {
    const { plot } = layout;
    const x = p.x * stage.width,
      y = p.y * stage.height;
    const face = clamp(Math.floor(((x - plot.x) / plot.w) * 6), 0, 5);
    setWeight(s, stage, face, ((plot.y + plot.h - y) / plot.h) * 10);
  }

  W.defineRoom({
    id: 'galton',
    symbol: '∩',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'chance',
    added: '2026-10-07',
    tagline: t.tagline,
    accent: { background: '#2b2214', border: '#f7b955', color: '#fcd99a' },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.scenes[0].label,
    sceneName: t.scenes[0].name,
    tip: t.tips[0],
    actionLabel: t.actions[0],
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { ...t.connection, go: 'sample' },

    defaults: { view: 0, rows: 12, tilt: 50, n: 10, one: 8, two: 1, three: 1, four: 1, five: 1, six: 8, seed: 1 },
    ranges: {
      view: [0, 2, 'integer'],
      rows: [4, 16, 'integer'],
      tilt: [10, 90, 'integer'],
      n: [3, 30, 'integer'],
      ...Object.fromEntries(FACES.map((face) => [face, [0, 10, 'integer']])),
      seed: [1, 9999, 'integer'],
    },
    defaultPreset: 0,
    presets: [
      { settings: { view: 0, rows: 12, tilt: 50 } },
      { settings: { view: 0, rows: 12, tilt: 75 } },
      { settings: { view: 1, n: 10, one: 8, two: 1, three: 1, four: 1, five: 1, six: 8 } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        bio: 'De_Moivre',
        color: '#f7b955',
        sketch: { hairStyle: 'wig', hair: '#d8d0c0', skin: '#efcaa6', backdrop: '#2b2214' },
      },
      {
        ...t.guests[1],
        bio: 'Laplace',
        color: '#7fd1ff',
        sketch: { hairStyle: 'curly', hair: '#8a8580', skin: '#eec6a2', brows: 'bold', backdrop: '#16283a' },
      },
    ],

    insight: t.insight,
    controls,
    bindControls,
    readouts,
    draw,
    preview,

    enter(s) {
      if (s.view !== DIE) cursor = null;
      restart(); // every visit starts from an empty board
    },
    onPreset() {
      cursor = null;
      restart();
    },
    step(dt, s, stage) {
      if (s.view === BOARD) {
        const P = boardFor(s, stage);
        if (P.landed < TOTAL_BALLS && stepBoard(P, dt)) {
          stage.sync();
          W.announce(t.announce.poured(TOTAL_BALLS));
        }
      } else if (s.view === DIE) stepHeap(dieFor(s, stage), dt, throwOnce);
      else stepHeap(spinnerFor(s, stage), dt, spinOnce);
      $('scene-status').textContent = status(s, stage);
    },
    action(s, stage) {
      // New balls, throws or spins: a new seed, and everything starts again.
      s.seed = (s.seed % 9999) + 1;
      stage.sync();
      stage.draw();
    },
    reset(s, stage) {
      restart();
      stage.sync();
      stage.draw();
    },

    pointer: {
      drag: inDie,
      down(p, s, stage) {
        if (!inDie(p, s, stage)) return;
        dragging = true;
        dragTo(p, s, stage);
      },
      move(p, info, s, stage) {
        if (dragging && info.dragging && layout) dragTo(p, s, stage);
      },
      up() {
        dragging = false;
      },
      arrow(dx, dy, s, stage) {
        if (s.view === BOARD) {
          // Left and right tilt the pegs; up and down add or take away a row.
          s.tilt = clamp(s.tilt + dx * 5, 10, 90);
          s.rows = clamp(s.rows - dy, 4, 16);
          stage.setChosen(-1);
          stage.refresh();
          return;
        }
        if (s.view !== DIE) return;
        if (cursor === null) cursor = 0;
        else if (dx) cursor = (cursor + dx + 6) % 6;
        if (dy && setWeight(s, stage, cursor, s[FACES[cursor]] - dy))
          W.announce(t.announce.die(cursor + 1, s[FACES[cursor]]));
      },
      escape: () => (cursor = null),
    },
  });
})();
