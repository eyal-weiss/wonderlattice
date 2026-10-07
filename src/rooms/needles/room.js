/* Room · Needles that know π: Buffon's needle, Barbier's noodle, and a famous result that was too lucky. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, clamp } = W;
  const M = W.models.needles;
  const t = W.text('needles');
  const reduced = W.prefersReducedMotion();

  const MAX = 1000000, // needles in a run: about three correct digits
    SLOW = 3, // seconds of one needle at a time, before the rain speeds up
    RERUNS = 400, // reruns of Lazzarini's experiment
    LAZ = M.LAZZARINI,
    LUCKY = 4; // the scene name for Lazzarini's reruns, after the four shapes
  // How many needles stay on a large floor (about 800 × 360 pixels): fewer of the larger shapes, and fewer on a
  // smaller floor, so each needle can still be seen.
  const SHOW = [280, 240, 170, 60];
  const COLOURS = {
    ground: '#0a0e15',
    planks: ['#2b1f16', '#33251a', '#2e2218'],
    grain: 'rgba(255, 228, 190, 0.05)',
    seam: '#d9b77e',
    steel: '#b8c8d6',
    glow: '#ffd166',
    ink: '#f4f5e9',
    muted: '#98aab7',
    grid: '#232c38',
    band: 'rgba(255, 209, 102, 0.14)',
    line: '#f4f5e9',
  };

  // The run being shown: rebuilt when the shape, the length or the seed changes. Needles live here, not in the
  // settings, like the treasure room's island.
  let run = null,
    lay = null, // the last frame's layout
    told = ''; // the last result announced, so each is said once

  const kindOf = (s) => (s.lucky ? M.NEEDLE : s.shape);
  const lengthOf = (s) => (s.lucky ? LAZ.length : s.shape === M.RING ? M.lengthOf(M.RING) : s.length / 100);
  const keyOf = (s) => `${s.lucky ? 'lucky' : `${s.shape}|${s.length}`}|${s.seed}`;

  const number = (n) => new Intl.NumberFormat(W.numberLocale).format(n);
  const decimals = (x, d) =>
    new Intl.NumberFormat(W.numberLocale, { minimumFractionDigits: d, maximumFractionDigits: d }).format(x);
  /** π as the needles guess it, to four decimals, or an ellipsis before the first crossing. */
  const guessOf = (thrown, crossed, length) => (crossed ? decimals(M.estimate(length, thrown, crossed), 4) : '…');

  /** A fresh run for these settings. */
  function fresh(s) {
    const seed = s.seed * 7919 + (s.lucky ? 17 : s.shape * 131 + s.length);
    run = {
      key: keyOf(s),
      kind: kindOf(s),
      length: lengthOf(s),
      lucky: s.lucky,
      rand: M.random(seed),
      pick: M.random(seed + 1), // where on the floor a needle is drawn: only the picture uses it
      kit: M.kit(kindOf(s), lengthOf(s), M.random(seed + 2)),
      show: SHOW[kindOf(s)],
      time: 0,
      owed: 1, // the first needle falls at once
      thrown: 0,
      crossed: 0,
      needles: [],
      history: [], // [needles, crossings] at steps that look even on the chart's log scale
      mark: 1,
      results: [], // Lazzarini's reruns: each one's estimate, and whether it was exactly 355/113
      exact: 0,
      done: false,
    };
    return run;
  }

  function current(s) {
    if (!run || run.key !== keyOf(s)) fresh(s);
    return run;
  }

  /** Note the running totals on the chart's history, about 70 times per tenfold. */
  function mark(r) {
    if (r.thrown < r.mark) return;
    r.history.push([r.thrown, r.crossed]);
    while (r.mark <= r.thrown) r.mark = Math.max(r.mark * 1.035, r.mark + 1);
  }

  /** Throw `count` needles: all are counted, only the last few are kept to be drawn. */
  function throwMany(r, count) {
    const visible = Math.min(count, r.show);
    let bulk = count - visible;
    while (bulk > 0) {
      const chunk = r.lucky ? bulk : Math.min(bulk, Math.max(1, Math.ceil(r.mark) - r.thrown));
      r.crossed += M.run(r.kit, chunk, r.rand);
      r.thrown += chunk;
      bulk -= chunk;
      if (!r.lucky) mark(r);
    }
    for (let i = 0; i < visible; i++) {
      const needle = M.throwOnce(r.kit, r.rand);
      needle.plank = Math.floor(r.pick() * 64);
      needle.born = r.time;
      r.needles.push(needle);
      r.crossed += needle.n;
      r.thrown++;
      if (!r.lucky) mark(r);
    }
    if (r.needles.length > r.show) r.needles.splice(0, r.needles.length - r.show);
  }

  /** Needles per second in a run: one at a time at first, then faster and faster, up to 40,000 a second. */
  const rate = (time) => (time < SLOW ? 3 : Math.min(40000, 3 * Math.exp(0.9 * (time - SLOW))));
  /** How long rerun k of Lazzarini's experiment takes: the first slowly enough to watch, then quicker. */
  const rerunSeconds = (k) => Math.max(0.05, 2.4 * 0.78 ** k);

  /** Throw needles into the run as time passes (or all at once under reduced motion). */
  function advance(r, dt) {
    if (r.done) return;
    r.time += dt;
    if (r.lucky) return advanceReruns(r, dt);
    r.owed += rate(r.time) * dt;
    const count = Math.min(Math.floor(r.owed), MAX - r.thrown);
    r.owed -= count;
    throwMany(r, count);
    if (r.thrown >= MAX) finishRun(r);
  }

  function advanceReruns(r, dt) {
    let left = dt;
    while (left > 0 && !r.done) {
      const perSecond = LAZ.throws / rerunSeconds(r.results.length);
      r.owed += perSecond * left;
      left = 0;
      const count = Math.min(Math.floor(r.owed), LAZ.throws - r.thrown);
      r.owed -= count;
      throwMany(r, count);
      if (r.thrown >= LAZ.throws) {
        // The time this rerun didn't use goes to the next one.
        left = r.owed / perSecond;
        r.owed = 0;
        endRerun(r);
      }
    }
  }

  function endRerun(r) {
    const exact = r.crossed === LAZ.crossings;
    r.results.push({ guess: M.estimate(LAZ.length, LAZ.throws, r.crossed), exact });
    if (exact) r.exact++;
    r.thrown = 0;
    r.crossed = 0;
    if (r.results.length >= RERUNS) {
      r.done = true;
      settle(r);
    }
  }

  function finishRun(r) {
    r.done = true;
    r.history.push([r.thrown, r.crossed]);
    settle(r);
  }

  /** The whole run at once: for reduced motion, and for the picture on the map. */
  function finish(r) {
    if (r.lucky) {
      while (!r.done) {
        throwMany(r, LAZ.throws - r.thrown);
        endRerun(r);
      }
      return;
    }
    throwMany(r, MAX - r.thrown);
    finishRun(r);
  }

  const typicalMiss = (r) => M.median(r.results.map((x) => Math.abs(x.guess - Math.PI)));

  /** Say a finished result once. */
  function settle(r) {
    const words = r.lucky
      ? t.announce.lucky(decimals(typicalMiss(r), 3))
      : r.kind === M.RING
        ? t.announce.ring
        : t.announce.done(guessOf(r.thrown, r.crossed, r.length));
    if (words !== told) W.announce(words);
    told = words;
  }

  // ------------------------------------------------------------ layout

  /**
   * The floor above the chart (beside it on a very wide picture), with planks about 75 pixels wide (at least three
   * of them), so a needle one plank long is easy to see on a phone too.
   */
  function layout(width, height) {
    const pad = Math.round(clamp(Math.min(width, height) * 0.025, 8, 16));
    const small = Math.round(clamp(Math.min(width, height) / 32, 10, 13));
    let floor, chart;
    if (width / height >= 1.6) {
      const split = Math.round(width * 0.6);
      floor = { x: pad, y: pad, w: split - pad * 1.5, h: height - 2 * pad };
      chart = { x: split + pad * 0.5, y: pad, w: width - split - pad * 1.5, h: height - 2 * pad };
    } else {
      // On a tall picture the chart gets nearly half, so π's line is in view from the start.
      const h = Math.round((height - 3 * pad) * (height > 500 ? 0.47 : 0.54));
      floor = { x: pad, y: pad, w: width - 2 * pad, h };
      chart = { x: pad, y: 2 * pad + h, w: width - 2 * pad, h: height - 3 * pad - h };
    }
    const planks = clamp(Math.round(floor.h / 75), 3, 8);
    return { pad, small, floor, chart, planks, plank: floor.h / planks };
  }

  // ------------------------------------------------------------ drawing

  /** The floor: planks of slightly different browns, with the lines between them in pale wood. */
  function drawFloor(ctx, L) {
    const { floor: F, planks, plank } = L;
    for (let i = 0; i < planks; i++) {
      ctx.fillStyle = COLOURS.planks[i % COLOURS.planks.length];
      ctx.fillRect(F.x, F.y + i * plank, F.w, plank);
      // A little grain along each plank.
      ctx.strokeStyle = COLOURS.grain;
      ctx.lineWidth = 1;
      for (let g = 1; g < 4; g++) {
        const y = F.y + i * plank + (plank * g) / 4 + Math.sin(i * 3 + g) * plank * 0.06;
        ctx.beginPath();
        ctx.moveTo(F.x, y);
        ctx.bezierCurveTo(F.x + F.w * 0.3, y + 2, F.x + F.w * 0.6, y - 2, F.x + F.w, y + 1);
        ctx.stroke();
      }
    }
    ctx.strokeStyle = COLOURS.seam;
    ctx.globalAlpha = 0.75;
    ctx.lineWidth = 2;
    for (let i = 0; i <= planks; i++) {
      const y = Math.round(F.y + i * plank) + 0.5;
      ctx.beginPath();
      ctx.moveTo(F.x, y);
      ctx.lineTo(F.x + F.w, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  /**
   * The needles kept on the floor: older ones fade, the newest drop into place, and those across a line glow. Drawn
   * in a few batches by brightness, so thousands of segments stay quick.
   */
  function drawNeedles(ctx, L, r) {
    const { floor: F, planks, plank } = L;
    const across = F.w / plank + 1; // the floor's length in planks, plus a little either side
    const room = clamp((F.w * F.h) / (800 * 360), 0.15, 1);
    const list = r.needles.slice(-Math.max(12, Math.round(r.show * room))),
      count = list.length;
    if (!count) return;
    ctx.save();
    ctx.beginPath();
    ctx.rect(F.x, F.y, F.w, F.h);
    ctx.clip();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const BANDS = 5;
    for (const glowing of [false, true])
      for (let band = 0; band < BANDS; band++) {
        ctx.beginPath();
        let any = false;
        for (let i = 0; i < count; i++) {
          const needle = list[i];
          if (needle.n > 0 !== glowing) continue;
          const age = (count - 1 - i) / count; // 0 for the newest
          if (Math.min(BANDS - 1, Math.floor((1 - age) * BANDS)) !== band) continue;
          // The newest needles of a slow rain drop in from a little above.
          const falling = reduced ? 0 : clamp(1 - (r.time - needle.born) / 0.3, 0, 1);
          const cx = F.x + (needle.u * across - 0.5) * plank,
            cy = F.y + ((needle.plank % planks) + needle.y - falling * 0.25) * plank;
          if (needle.pts) {
            needle.pts.forEach(([x, y], k) => {
              const px = cx + x * plank,
                py = cy + y * plank;
              if (k) ctx.lineTo(px, py);
              else ctx.moveTo(px, py);
            });
          } else {
            ctx.moveTo(cx + M.RING_RADIUS * plank, cy);
            ctx.arc(cx, cy, M.RING_RADIUS * plank, 0, Math.PI * 2);
          }
          any = true;
        }
        if (!any) continue;
        const alpha = 0.25 + (0.75 * (band + 1)) / BANDS;
        if (glowing) {
          // A soft halo, then the bright needle.
          ctx.strokeStyle = COLOURS.glow;
          ctx.globalAlpha = alpha * 0.22;
          ctx.lineWidth = Math.max(5, plank * 0.09);
          ctx.stroke();
          ctx.globalAlpha = alpha;
          ctx.lineWidth = Math.max(2, plank * 0.035);
          ctx.stroke();
        } else {
          ctx.strokeStyle = COLOURS.steel;
          ctx.globalAlpha = alpha * 0.85;
          ctx.lineWidth = Math.max(1.6, plank * 0.028);
          ctx.stroke();
        }
      }
    ctx.restore();
  }

  /** A dark tag with words on it: a large first line and a smaller second one. */
  function tag(ctx, x, y, big, line, L, align = 'left', size = null) {
    const bigSize = size ?? Math.round(clamp(L.floor.h * 0.12, 15, 38));
    ctx.font = `600 ${bigSize}px system-ui`;
    const w1 = ctx.measureText(big).width;
    ctx.font = `${L.small}px system-ui`;
    const w2 = line ? ctx.measureText(line).width : 0;
    const pad = Math.round(bigSize * 0.4);
    const w = Math.min(Math.max(w1, w2) + pad * 2, L.floor.w - 8),
      h = bigSize * 1.15 + (line ? L.small * 1.6 : 0) + pad * 1.2;
    const left = align === 'center' ? x - w / 2 : x;
    ctx.fillStyle = 'rgba(10, 14, 21, 0.82)';
    ctx.beginPath();
    ctx.roundRect(left, y, w, h, Math.round(bigSize * 0.3));
    ctx.fill();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = COLOURS.ink;
    ctx.font = `600 ${bigSize}px system-ui`;
    ctx.fillText(big, left + pad, y + pad * 0.6 + bigSize * 0.92, w - pad * 2);
    if (line) {
      ctx.fillStyle = COLOURS.muted;
      ctx.font = `${L.small}px system-ui`;
      ctx.fillText(line, left + pad, y + pad * 0.6 + bigSize * 1.15 + L.small * 1.2, w - pad * 2);
    }
  }

  /** The running guess on the floor. */
  function drawTag(ctx, L, r) {
    const x = L.floor.x + L.pad,
      y = L.floor.y + L.pad;
    if (r.lucky) {
      if (r.done)
        return tag(
          ctx,
          x,
          y,
          t.readout.typical(decimals(typicalMiss(r), 3)),
          t.labels.hits(number(r.results.length), number(r.exact)),
          L,
        );
      const k = Math.min(r.results.length + 1, RERUNS);
      return tag(ctx, x, y, t.labels.run(number(k)), t.labels.guess(guessOf(r.thrown, r.crossed, r.length)), L);
    }
    if (r.kind === M.RING) return tag(ctx, x, y, t.labels.ring, t.labels.rings(number(r.thrown)), L);
    tag(
      ctx,
      x,
      y,
      t.labels.guess(guessOf(r.thrown, r.crossed, r.length)),
      t.labels.tally(number(r.thrown), number(r.crossed)),
      L,
    );
  }

  /** Small labels in the chart. */
  function label(ctx, words, x, y, L, { align = 'left', colour = COLOURS.muted, bold = false, max } = {}) {
    ctx.font = `${bold ? '600 ' : ''}${L.small}px system-ui`;
    ctx.fillStyle = colour;
    ctx.textAlign = align;
    ctx.fillText(words, x, y, max);
  }

  /**
   * The guess against the number of needles, on a log scale from 1 to a million: it wobbles, then settles towards
   * π. For straight needles a shaded funnel shows the typical miss, narrowing tenfold for every hundred times more.
   */
  function drawGuessChart(ctx, L, r) {
    const C = L.chart,
      s = L.small;
    const left = C.x + s * 2.6,
      right = C.x + C.w - s * 0.6,
      top = C.y + s * 1.9,
      bottom = C.y + C.h - s * 1.7;
    const LO = Math.PI - 0.5,
      HI = Math.PI + 0.5;
    const xAt = (n) => left + (Math.log10(Math.max(1, n)) / 6) * (right - left);
    const yAt = (v) => bottom - ((clamp(v, LO, HI) - LO) / (HI - LO)) * (bottom - top);
    label(ctx, t.labels.chart, C.x, C.y + s, L, { bold: true, colour: COLOURS.ink, max: C.w });
    // Axes: guesses of 3, 3.5 and so on, and needles by powers of ten.
    ctx.lineWidth = 1;
    ctx.strokeStyle = COLOURS.grid;
    for (const v of [2.75, 3, 3.25, 3.5]) {
      ctx.beginPath();
      ctx.moveTo(left, Math.round(yAt(v)) + 0.5);
      ctx.lineTo(right, Math.round(yAt(v)) + 0.5);
      ctx.stroke();
      if (bottom - top > s * 5 || v === 3 || v === 3.5)
        label(ctx, decimals(v, 2), left - 4, yAt(v) + s * 0.35, L, { align: 'right' });
    }
    ctx.font = `${s}px system-ui`;
    let lastRight = -Infinity;
    for (let p = 1; p <= 6; p++) {
      const x = xAt(10 ** p),
        words = number(10 ** p),
        w = ctx.measureText(words).width;
      ctx.strokeStyle = COLOURS.grid;
      ctx.beginPath();
      ctx.moveTo(Math.round(x) + 0.5, top);
      ctx.lineTo(Math.round(x) + 0.5, bottom);
      ctx.stroke();
      // Each label centred under its line, unless it would run into the last one or off the picture.
      const lx = Math.min(x, C.x + C.w - w / 2);
      if (lx - w / 2 > lastRight + 6) {
        label(ctx, words, lx, bottom + s * 1.35, L, { align: 'center' });
        lastRight = lx + w / 2;
      }
    }
    // The funnel of typical misses, for straight needles.
    if (r.kind === M.NEEDLE) {
      ctx.fillStyle = COLOURS.band;
      ctx.beginPath();
      const steps = 60;
      for (let i = 0; i <= steps; i++) {
        const n = 10 ** (1 + (5 * i) / steps);
        const x = xAt(n),
          y = yAt(Math.PI + M.spread(r.length, n));
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
      for (let i = steps; i >= 0; i--) {
        const n = 10 ** (1 + (5 * i) / steps);
        ctx.lineTo(xAt(n), yAt(Math.PI - M.spread(r.length, n)));
      }
      ctx.closePath();
      ctx.fill();
      const n = 300;
      label(ctx, t.labels.typical, xAt(n) + 4, yAt(Math.PI + M.spread(r.length, n)) - 4, L, { colour: COLOURS.glow });
    }
    // π itself.
    ctx.strokeStyle = COLOURS.glow;
    ctx.setLineDash([5, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(left, yAt(Math.PI));
    ctx.lineTo(right, yAt(Math.PI));
    ctx.stroke();
    ctx.setLineDash([]);
    label(ctx, t.labels.pi, right, yAt(Math.PI) - 5, L, { align: 'right', colour: COLOURS.glow, bold: true });
    // The guess so far, from the tenth needle: before that it leaps about too much to follow.
    const points = r.history.filter(([n, c]) => c > 0 && n >= 10);
    if (r.crossed > 0 && r.thrown >= 10 && !r.done) points.push([r.thrown, r.crossed]);
    if (points.length) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(left, top - 2, right - left, bottom - top + 4);
      ctx.clip();
      ctx.strokeStyle = COLOURS.line;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      points.forEach(([n, c], i) => {
        const x = xAt(n),
          y = yAt(M.estimate(r.length, n, c));
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      });
      ctx.stroke();
      const [n, c] = points[points.length - 1];
      ctx.fillStyle = COLOURS.line;
      ctx.beginPath();
      ctx.arc(xAt(n), yAt(M.estimate(r.length, n, c)), 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /** For rings: how many lines each one crosses. Every ring, two: one bar, and nothing else. */
  function drawRingChart(ctx, L, r) {
    const C = L.chart,
      s = L.small;
    label(ctx, t.labels.count, C.x, C.y + s, L, { bold: true, colour: COLOURS.ink, max: C.w });
    const top = C.y + s * 2.4,
      bottom = C.y + C.h - s * 1.7;
    const slot = Math.min(C.w / 4, s * 9),
      x0 = C.x + (C.w - slot * 4) / 2;
    ctx.strokeStyle = COLOURS.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x0, Math.round(bottom) + 0.5);
    ctx.lineTo(x0 + slot * 4, Math.round(bottom) + 0.5);
    ctx.stroke();
    for (let k = 0; k < 4; k++) {
      const x = x0 + slot * k + slot / 2;
      label(ctx, number(k), x, bottom + s * 1.35, L, { align: 'center' });
      if (k !== 2 || !r.thrown) continue;
      ctx.fillStyle = COLOURS.glow;
      ctx.fillRect(x - slot * 0.3, top + s * 1.2, slot * 0.6, bottom - top - s * 1.2);
      label(ctx, `${t.labels.every} · ${number(r.thrown)}`, x, top + s * 0.6, L, {
        align: 'center',
        colour: COLOURS.glow,
        bold: true,
        max: C.w,
      });
    }
  }

  /**
   * Lazzarini's reruns: each one's guess as a dot, stacked over a line from π − 0.2 to π + 0.2, with his own result
   * marked. It sits on π itself, where very few reruns land.
   */
  function drawRerunChart(ctx, L, r) {
    const C = L.chart,
      s = L.small;
    label(ctx, t.labels.reruns, C.x, C.y + s, L, { bold: true, colour: COLOURS.ink, max: C.w });
    const left = C.x + s,
      right = C.x + C.w - s,
      top = C.y + s * 2.2,
      bottom = C.y + C.h - s * 1.7;
    const LO = Math.PI - 0.2,
      HI = Math.PI + 0.2,
      BINS = 80;
    const xAt = (v) => left + ((v - LO) / (HI - LO)) * (right - left);
    ctx.strokeStyle = COLOURS.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(left, Math.round(bottom) + 0.5);
    ctx.lineTo(right, Math.round(bottom) + 0.5);
    ctx.stroke();
    for (const v of [3, 3.1, 3.2, 3.3]) {
      const x = xAt(v);
      ctx.beginPath();
      ctx.moveTo(Math.round(x) + 0.5, bottom);
      ctx.lineTo(Math.round(x) + 0.5, bottom + 4);
      ctx.stroke();
      label(ctx, decimals(v, 1), x, bottom + s * 1.35, L, { align: 'center' });
    }
    // Dots, stacked in their bins; squeezed closer once a stack would reach the top.
    const counts = new Array(BINS).fill(0);
    const binOf = (v) => clamp(Math.floor(((v - LO) / (HI - LO)) * BINS), 0, BINS - 1);
    for (const x of r.results) counts[binOf(x.guess)]++;
    const most = Math.max(1, ...counts);
    const binW = (right - left) / BINS;
    const radius = Math.max(1.2, Math.min(binW * 0.42, 4));
    const step = Math.min(radius * 2 + 1, (bottom - top - radius) / most);
    const stacked = new Array(BINS).fill(0);
    for (const exactOnes of [false, true]) {
      ctx.fillStyle = exactOnes ? COLOURS.glow : COLOURS.steel;
      ctx.beginPath();
      // Exact hits go on top of their stack, so they show.
      for (const x of r.results) {
        if (x.exact !== exactOnes) continue;
        const b = binOf(x.guess),
          k = stacked[b]++;
        const cx = left + (b + 0.5) * binW,
          cy = bottom - radius - 1 - k * step;
        ctx.moveTo(cx + radius, cy);
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      }
      ctx.fill();
    }
    // Lazzarini's 355/113 (and π, a third of a millionth away).
    const x = xAt(355 / 113);
    ctx.strokeStyle = COLOURS.glow;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(x, top + s * 0.4);
    ctx.lineTo(x, bottom);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = `600 ${s}px system-ui`;
    const words = t.labels.his,
      w = ctx.measureText(words).width;
    label(ctx, words, clamp(x + 6, C.x, C.x + C.w - w), top + s * 0.2, L, { colour: COLOURS.glow, bold: true });
  }

  function paint(ctx, width, height, r) {
    ctx.fillStyle = COLOURS.ground;
    ctx.fillRect(0, 0, width, height);
    ctx.direction = 'ltr'; // the picture's labels keep their places on right-to-left pages too
    ctx.textBaseline = 'alphabetic';
    lay = layout(width, height);
    drawFloor(ctx, lay);
    drawNeedles(ctx, lay, r);
    drawTag(ctx, lay, r);
    if (r.lucky) drawRerunChart(ctx, lay, r);
    else if (r.kind === M.RING) drawRingChart(ctx, lay, r);
    else drawGuessChart(ctx, lay, r);
  }

  function draw(ctx, s, stage) {
    paint(ctx, stage.width, stage.height, current(s));
  }

  /** The map's picture and the link preview: a floor after a few thousand needles, with the guess in the middle. */
  function preview(ctx, width, height) {
    const r = fresh({ shape: M.NEEDLE, length: 100, lucky: false, seed: 4 });
    r.time = 10;
    throwMany(r, 4000);
    ctx.fillStyle = COLOURS.ground;
    ctx.fillRect(0, 0, width, height);
    ctx.direction = 'ltr';
    const planks = 4,
      plank = height / planks;
    const L = {
      pad: 8,
      small: 11,
      floor: { x: 0, y: 0, w: width, h: height },
      chart: null,
      planks,
      plank,
    };
    r.needles = r.needles.slice(-260);
    drawFloor(ctx, L);
    drawNeedles(ctx, L, r);
    const size = Math.round(height * 0.17);
    const words = t.labels.guess(decimals(M.estimate(1, r.thrown, r.crossed), 2));
    tag(ctx, width / 2, height / 2 - size * 0.85, words, '', L, 'center', size);
    run = null; // the room itself starts its own run
  }

  // ------------------------------------------------------------ panel

  const presetIndex = (s) =>
    s.lucky ? 2 : s.length !== 100 ? -1 : s.shape === M.NEEDLE ? 0 : s.shape === M.NOODLE ? 1 : -1;

  /** A row of buttons choosing the shape. */
  const choices = (s) =>
    `<div class="control wide"><span class="needles-label" id="needles-shape">${t.shape}</span>` +
    '<div class="needles-choices" role="group" aria-labelledby="needles-shape">' +
    t.shapes
      .map(
        (name, i) =>
          `<button type="button" class="button" data-shape="${i}" aria-pressed="${i === s.shape}">${name}</button>`,
      )
      .join('') +
    '</div></div>';

  function controls(s, stage) {
    return (
      (s.lucky ? '' : choices(s)) +
      (s.lucky || s.shape === M.RING ? '' : stage.slider('length', t.length, 20, 100, 5, s.length, '%')) +
      stage.check('lucky', t.lucky, s.lucky) +
      // Not a live region: it changes many times a second. Each finished result is announced once instead.
      '<div class="wide readout needles-readout" id="needles-readout"></div>'
    );
  }

  /** After a new shape, a new length or the lucky reruns: a fresh run, and the panel shows the right controls. */
  function changed(s, stage, focus) {
    fresh(s);
    if (reduced) finish(run);
    stage.setChosen(presetIndex(s));
    stage.refresh();
    stage.draw();
    if (focus) $('scene-controls').querySelector(focus)?.focus();
  }

  function bindControls(panel, s, stage) {
    panel.querySelectorAll('[data-shape]').forEach((button) =>
      button.addEventListener('click', () => {
        const value = Number(button.dataset.shape);
        if (value === s.shape) return;
        s.shape = value;
        changed(s, stage, `[data-shape="${value}"]`);
      }),
    );
    panel
      .querySelector('[data-check="lucky"]')
      ?.addEventListener('change', () => changed(s, stage, '[data-check="lucky"]'));
  }

  function readouts(s) {
    const r = current(s);
    $('scene-name').textContent = t.sceneNames[s.lucky ? LUCKY : s.shape];
    $('scene-status').textContent = r.lucky
      ? t.status.reruns(r.results.length)
      : r.kind === M.RING
        ? t.status.rings(number(r.thrown))
        : r.done
          ? t.status.done(number(r.thrown), guessOf(r.thrown, r.crossed, r.length))
          : t.status.raining(number(r.thrown));
    const box = $('needles-readout');
    if (!box) return;
    const row = (name, value) => `<span>${name}</span><strong>${value}</strong>`;
    let big, rows, rule;
    if (r.lucky) {
      const miss = r.results.length ? decimals(typicalMiss(r), 3) : '…';
      big = t.readout.typical(miss);
      rows =
        row(t.readout.reruns, number(r.results.length)) +
        row(t.readout.exact, number(r.exact)) +
        row(t.readout.his, decimals(Math.abs(355 / 113 - Math.PI), 7));
      rule = t.readout.luckyRule;
    } else if (r.kind === M.RING) {
      big = t.readout.ring;
      rows = row(t.readout.rings, number(r.thrown)) + row(t.readout.across, number(r.crossed));
      rule = t.readout.ringRule;
    } else {
      big = t.readout.guess(guessOf(r.thrown, r.crossed, r.length));
      const off = r.crossed ? decimals(Math.abs(M.estimate(r.length, r.thrown, r.crossed) - Math.PI), 4) : '…';
      rows =
        row(t.readout.thrown, number(r.thrown)) + row(t.readout.across, number(r.crossed)) + row(t.readout.off, off);
      rule = r.kind === M.NEEDLE ? t.readout.rule : t.readout.sameRule;
    }
    box.innerHTML = `<p class="needles-big">${big}</p><div class="needles-rows">${rows}</div><p class="needles-rule">${rule}</p>`;
  }

  W.defineRoom({
    id: 'needles',
    symbol: 'π',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'chance',
    added: '2026-10-07',
    tagline: t.tagline,
    accent: { background: '#2a2416', border: '#ffd166', color: '#ffe7a8' },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.sceneLabel,
    sceneName: t.sceneNames[0],
    tip: t.tip,
    actionLabel: t.actionLabel,
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { ...t.connection, go: 'rollers' },

    defaults: { shape: 0, length: 100, lucky: false, seed: 1 },
    ranges: { shape: [0, 3, 'integer'], length: [20, 100, 'integer'], seed: [1, 9999, 'integer'] },
    defaultPreset: 0,
    presets: [
      { settings: { shape: 0, length: 100, lucky: false } },
      { settings: { shape: 2, length: 100, lucky: false } },
      { settings: { lucky: true } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Buffon',
        color: '#ffd166',
        // A naturalist of the 1700s: a powdered wig.
        sketch: { hairStyle: 'wig', hair: '#e9e4d8', skin: '#efc9a4', brows: 'bold', backdrop: '#2a2416' },
      },
      {
        ...t.guests[1],
        bio: 'Barbier',
        color: '#8fb8f0',
        sketch: { hairStyle: 'short', hair: '#3a2e26', skin: '#ecc9a8', beard: 'short', backdrop: '#1d2633' },
      },
    ],

    insight: t.insight,

    controls,
    bindControls,
    readouts,
    draw,
    preview,

    enter(s, stage) {
      const r = current(s);
      if (reduced && !r.done) finish(r);
      stage.sync();
      stage.draw();
    },
    step(dt, s, stage) {
      const r = current(s),
        before = r.done;
      advance(r, dt);
      // The panel's numbers follow the rain, a few times a second, and once more at the end.
      r.since = (r.since ?? 0) + dt;
      if (r.since > 0.25 || r.done !== before) {
        r.since = 0;
        stage.sync();
      }
    },
    action(s, stage) {
      // Throw again: a new run with new needles.
      s.seed = (s.seed % 9999) + 1;
      fresh(s);
      if (reduced) finish(run);
      stage.sync();
      stage.draw();
    },
    reset(s, stage) {
      fresh(s);
      if (reduced) finish(run);
      stage.sync();
      stage.draw();
    },
    onPreset(s) {
      fresh(s);
      if (reduced) finish(run);
    },
    onInput(s, stage) {
      // A new length: the run starts again.
      fresh(s);
      if (reduced) finish(run);
      stage.setChosen(presetIndex(s));
      stage.draw();
    },
  });
})();
