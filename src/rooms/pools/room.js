/* Room · A thousand samples, ten tests: binary pooling finds one glowing tube, and Dorfman pools test a crowd. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $ } = W;
  const M = W.models.pools;
  const t = W.text('pools');
  const reduced = W.prefersReducedMotion();

  const CROWD = 100,
    MAX_POOL = 20;
  const COLOURS = {
    bg: '#0a0e15',
    ink: '#e8f1f5',
    muted: '#8fa3b1',
    faint: '#3a4a58',
    slot: '#141d27',
    tube: '#3f7fa8',
    tubeTop: '#7fc4e8',
    member: '#9fe6f2',
    glow: '#ffd166',
    well: '#1a2a38',
    liquid: '#4f9cc6',
    yes: '#ffd166',
    no: '#2c3b49',
    wrong: '#ff8a65',
    person: '#6f8394',
    clear: '#7ee0a1',
    sick: '#ff9e5e',
    positive: '#f7c948',
    pool: ['#152230', '#1b2b3a'],
    chart: '#9fe6f2',
  };

  const count = (n) => n.toLocaleString(W.numberLocale);
  const percent = (x) => `${x.toLocaleString(W.numberLocale, { maximumFractionDigits: 1 })}%`;
  const decimal = (x) => x.toLocaleString(W.numberLocale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  /** A small repeatable number in [0, 1) for each tube and test, so droplets set off at scattered times. */
  const scatter = (a, b) => {
    const x = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

  // ---------- the run being shown ----------

  // `elapsed` is the room's own clock for the current run, so pausing and reduced motion work: with reduced
  // motion a run starts at its end.
  let elapsed = 0,
    announced = false,
    phase = '',
    picked = -1; // the well whose tubes are highlighted, by its place from the left, or -1
  const tried = new Set(); // pool sizes tried on the second floor, drawn brightly on the chart

  function start(s) {
    elapsed = reduced ? 1e6 : 0;
    announced = false;
    phase = '';
    if (s.floor === 1) tried.add(s.pool);
  }

  // ---------- floor 1: the rack and the wells ----------

  /** The rack for a canvas: 1,000 tubes and 10 tests, or 63 and 6 where the canvas is narrow. */
  function rack(width, height) {
    const small = width < 560;
    const n = small ? 63 : 1000,
      tests = M.testsFor(n),
      cols = small ? 16 : 64,
      rows = small ? 4 : 16;
    const margin = small ? 16 : 24;
    const cell = Math.min((width - 2 * margin) / cols, (height * (small ? 0.3 : 0.4)) / rows);
    const x = (width - cols * cell) / 2,
      y = small ? 12 : 18;
    const bottom = y + rows * cell;
    const span = (width - 2 * margin) / tests;
    const wellW = Math.min(58, span * 0.66),
      wellH = Math.min(70, height * 0.15),
      wellY = bottom + (small ? 30 : 46);
    return { small, n, tests, cols, rows, cell, x, y, bottom, margin, span, wellW, wellH, wellY };
  }
  /** Tube `tube` sits in slot `tube` of the grid, so the binary digits line up in stripes and bands. */
  const tubeCentre = (R, tube) => ({
    x: R.x + ((tube % R.cols) + 0.5) * R.cell,
    y: R.y + (Math.floor(tube / R.cols) + 0.5) * R.cell,
  });
  /** The well at place j from the left tests binary digit k = tests − 1 − j, worth 2^k. */
  const bitOf = (R, j) => R.tests - 1 - j;
  const wellX = (R, j) => R.margin + (j + 0.5) * R.span;

  /**
   * The glowing tubes on this rack: the chosen one, and for the twist a partner from the seed. The partner is
   * redrawn (deterministically) until the two glowing tubes and the one the lights point to sit apart on the rack,
   * so their labels don't collide.
   */
  function hotTubes(s, n) {
    const a = ((s.tube - 1) % n) + 1;
    if (s.hot !== 2) return [a];
    const cols = n > 63 ? 64 : 16;
    const apart = (x, y) =>
      Math.abs((x % cols) - (y % cols)) > 2 || Math.abs(Math.floor(x / cols) - Math.floor(y / cols)) > 1;
    let b = 0;
    for (let k = 0; k < 20; k++) {
      b = M.partner(a, n, s.seed + k * 7919);
      if (b && apart(a, b) && apart(a, a | b) && apart(b, a | b)) break;
    }
    return b ? [a, b] : [a];
  }

  /** The first floor's timeline, in seconds: a pause, the wells filling one by one, the tests, the reading. */
  function timeline(R) {
    const lead = 0.5,
      mix = R.small ? 0.55 : 0.42;
    const tested = lead + R.tests * mix;
    return { lead, mix, tested, read: tested + 0.9, end: tested + 0.9 + 1.6 };
  }

  function rackPhase(R, e) {
    const T = timeline(R);
    if (e < T.tested)
      return { name: 'mixing', well: Math.max(0, Math.min(R.tests - 1, Math.floor((e - T.lead) / T.mix))) };
    if (e < T.read) return { name: 'testing' };
    return { name: 'read' };
  }

  function drawTube(ctx, R, tube, fill, alpha = 1) {
    const c = tubeCentre(R, tube);
    const w = R.cell * 0.56,
      h = R.cell * 0.84;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.roundRect(c.x - w / 2, c.y - h / 2, w, h, [w * 0.2, w * 0.2, w / 2, w / 2]);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function ring(ctx, x, y, r, colour, width = 2) {
    ctx.strokeStyle = colour;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  /** A label with a dark backing, kept inside the canvas. */
  function tag(ctx, text, x, y, colour, size, width) {
    ctx.font = `600 ${size}px system-ui, sans-serif`;
    const w = ctx.measureText(text).width + 10;
    const left = Math.max(4, Math.min(width - w - 4, x - w / 2));
    ctx.fillStyle = 'rgba(10, 14, 21, 0.86)';
    ctx.beginPath();
    ctx.roundRect(left, y - size - 3, w, size + 8, 5);
    ctx.fill();
    ctx.fillStyle = colour;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(text, left + 5, y);
  }

  function drawRack(ctx, s, width, height, e) {
    const R = rack(width, height);
    const T = timeline(R);
    const P = rackPhase(R, e);
    const hot = hotTubes(s, R.n);
    const lights = M.results(hot, R.tests);
    const pointed = M.decode(lights);
    const mixingBit = P.name === 'mixing' && e >= T.lead ? bitOf(R, P.well) : -1;
    const shownBit = mixingBit >= 0 ? mixingBit : P.name === 'read' && picked >= 0 ? bitOf(R, picked) : -1;
    const reveal = ease((e - T.read) / 0.6);

    // The rack: empty holders first (slot 0 and the slots past the last tube), then the tubes.
    ctx.fillStyle = COLOURS.slot;
    ctx.beginPath();
    ctx.roundRect(R.x - 6, R.y - 6, R.cols * R.cell + 12, R.rows * R.cell + 12, 8);
    ctx.fill();
    for (let tube = 1; tube <= R.n; tube++) {
      const member = shownBit >= 0 && M.inTest(tube, shownBit);
      const fill = member ? COLOURS.member : COLOURS.tube;
      drawTube(ctx, R, tube, fill, shownBit >= 0 && !member ? 0.35 : 1);
    }

    // The wells, and the droplets travelling into the one being filled.
    for (let j = 0; j < R.tests; j++) {
      const k = bitOf(R, j);
      const x = wellX(R, j);
      const filled = ease((e - (T.lead + j * T.mix)) / T.mix);
      const lit = P.name === 'read' && lights[k];
      const testing = P.name === 'testing';
      ctx.fillStyle = COLOURS.well;
      ctx.strokeStyle = j === picked ? COLOURS.member : COLOURS.faint;
      ctx.lineWidth = j === picked ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.roundRect(x - R.wellW / 2, R.wellY, R.wellW, R.wellH, [4, 4, R.wellW / 3, R.wellW / 3]);
      ctx.fill();
      ctx.stroke();
      if (filled > 0) {
        const level = R.wellH * 0.7 * filled;
        let colour = COLOURS.liquid;
        if (testing) colour = `hsl(200, 50%, ${40 + 18 * Math.sin((e - T.tested) * 14 + j)}%)`;
        if (P.name === 'read') colour = lights[k] ? COLOURS.yes : COLOURS.no;
        ctx.save();
        if (lit) {
          ctx.shadowColor = COLOURS.yes;
          ctx.shadowBlur = 18;
        }
        ctx.fillStyle = colour;
        ctx.beginPath();
        ctx.roundRect(x - R.wellW / 2 + 3, R.wellY + R.wellH - level - 3, R.wellW - 6, level, [
          2,
          2,
          R.wellW / 3 - 2,
          R.wellW / 3 - 2,
        ]);
        ctx.fill();
        ctx.restore();
      }
      // The well's value, and once read, its answer as a binary digit.
      const size = R.small ? 10 : 12;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.font = `${size}px system-ui, sans-serif`;
      ctx.fillStyle = COLOURS.muted;
      ctx.fillText(count(2 ** k), x, R.wellY + R.wellH + size + 6);
      if (P.name === 'read') {
        const show = ease((e - T.read - j * 0.07) / 0.25);
        ctx.globalAlpha = show;
        ctx.font = `600 ${size + 6}px Georgia, serif`;
        ctx.fillStyle = lights[k] ? COLOURS.yes : COLOURS.muted;
        ctx.fillText(lights[k] ? '1' : '0', x, R.wellY + R.wellH + 2 * size + 16);
        ctx.globalAlpha = 1;
      }
    }
    if (mixingBit >= 0) {
      const j = P.well;
      const t0 = T.lead + j * T.mix;
      const target = { x: wellX(R, j), y: R.wellY + 4 };
      ctx.fillStyle = COLOURS.member;
      for (let tube = 1; tube <= R.n; tube++) {
        if (!M.inTest(tube, mixingBit)) continue;
        const q = (e - t0 - scatter(tube, mixingBit) * T.mix * 0.45) / (T.mix * 0.55);
        if (q <= 0 || q >= 1) continue;
        const from = tubeCentre(R, tube);
        const f = ease(q);
        const x = from.x + (target.x - from.x) * f;
        const y = from.y + (target.y - from.y) * f * f;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(x, y, R.small ? 1.8 : 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // The reading: the glowing tubes appear, and the lights' number is ringed.
    if (P.name === 'read') {
      for (const tube of hot) {
        const c = tubeCentre(R, tube);
        const halo = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, R.cell * 3);
        halo.addColorStop(0, 'rgba(255, 209, 102, 0.55)');
        halo.addColorStop(1, 'rgba(255, 209, 102, 0)');
        ctx.globalAlpha = reveal;
        ctx.fillStyle = halo;
        ctx.fillRect(c.x - R.cell * 3, c.y - R.cell * 3, R.cell * 6, R.cell * 6);
        ctx.globalAlpha = 1;
        ctx.save();
        ctx.shadowColor = COLOURS.glow;
        ctx.shadowBlur = 16 * reveal;
        drawTube(ctx, R, tube, COLOURS.glow, reveal);
        ctx.restore();
      }
      const size = R.small ? 10 : 12;
      const gapY = R.bottom + size + 12; // the gap between the rack and the wells
      const sumY = Math.min(height - 10, R.wellY + R.wellH + 3 * size + 40);
      if (hot.length > 1)
        for (const tube of hot) {
          const c = tubeCentre(R, tube);
          const above = c.y - R.y > R.cell * 1.5;
          tag(
            ctx,
            count(tube),
            c.x,
            above ? c.y - R.cell * 0.9 : c.y + R.cell * 0.9 + size + 2,
            COLOURS.glow,
            size,
            width,
          );
        }
      const answer = ease((e - T.read - R.tests * 0.07 - 0.2) / 0.5);
      if (answer > 0) {
        ctx.globalAlpha = answer;
        const parts = lights
          .map((on, k) => (on ? 2 ** k : 0))
          .filter(Boolean)
          .reverse()
          .map(count);
        const text = pointed ? t.labels.sum(parts.join(' + '), count(pointed)) : t.labels.none;
        ctx.font = `600 ${R.small ? 12 : 15}px Georgia, serif`;
        ctx.fillStyle = COLOURS.ink;
        ctx.textAlign = 'center';
        ctx.fillText(text, width / 2, sumY);
        if (pointed >= 1 && pointed <= R.n) {
          const c = tubeCentre(R, pointed);
          const right = hot.includes(pointed);
          const pulse = 1 + 0.25 * Math.sin(e * 5);
          ring(
            ctx,
            c.x,
            c.y,
            R.cell * (0.9 + 0.8 * (1 - answer)) * (reduced ? 1 : pulse),
            right ? COLOURS.glow : COLOURS.wrong,
            2.5,
          );
          const above = c.y - R.y > R.cell * 1.5;
          // The found tube is labelled beside it; a wrong one in the gap below the rack, clear of the glowing tubes.
          if (right)
            tag(
              ctx,
              t.labels.here(count(pointed)),
              c.x,
              above ? c.y - R.cell * 1.2 : c.y + R.cell * 1.2 + size + 2,
              COLOURS.glow,
              size,
              width,
            );
          else {
            ctx.strokeStyle = COLOURS.wrong;
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 3]);
            ctx.beginPath();
            ctx.moveTo(c.x, c.y + R.cell);
            ctx.lineTo(c.x, gapY - size - 3);
            ctx.stroke();
            ctx.setLineDash([]);
            tag(ctx, t.labels.wrong(count(pointed)), c.x, gapY, COLOURS.wrong, size, width);
          }
        } else if (pointed > R.n) {
          tag(ctx, t.labels.missing(count(pointed), count(R.n)), width / 2, gapY, COLOURS.wrong, size, width);
        }
        ctx.globalAlpha = 1;
      }
    }
    if (shownBit >= 0 && P.name === 'read') {
      const size = R.small ? 10 : 12;
      const sumY = Math.min(height - 10, R.wellY + R.wellH + 3 * size + 40);
      tag(ctx, t.labels.well(count(2 ** shownBit)), width / 2, sumY + size + 16, COLOURS.member, size, width);
    }
  }

  // ---------- floor 2: the crowd and its pools ----------

  function crowdLayout(width, height) {
    const small = width < 560;
    const side = small ? Math.min(height - 24, width * 0.5) : Math.min(height - 48, width * 0.46);
    const cell = side / 10;
    const x = small ? 10 : 28,
      // Anchored near the top on a wide screen: the panel beside it can make the canvas tall.
      y = small ? (height - side) / 2 : Math.min((height - side) / 2, 24);
    const chart = {
      x: x + side + (small ? 34 : 70),
      y: y + (small ? 26 : 34),
      right: width - (small ? 10 : 30),
      bottom: y + side - (small ? 22 : 30),
    };
    return { small, side, cell, x, y, chart };
  }

  /** The second floor's timeline: pools form, each pool is tested in turn, then the retests. */
  function poolTimeline(result) {
    const lead = 0.4;
    const step = Math.min(0.28, 2.6 / result.pools.length);
    const retests = result.pools.reduce((sum, p) => sum + p.retests, 0);
    const retestAt = lead + result.pools.length * step + (retests ? 0.4 : 0);
    const retestStep = retests ? Math.min(0.16, 2.2 / retests) : 0;
    return { lead, step, retests, retestAt, retestStep, end: retestAt + retests * retestStep + 0.2 };
  }

  /** Everything about the crowd's run at time e: who is known clear or sick, and the tests used so far. */
  function crowdState(s, e) {
    const infected = M.crowd(s.seed, CROWD, s.prev / 100);
    const result = M.runPools(infected, s.pool);
    const T = poolTimeline(result);
    const known = new Array(CROWD).fill(0); // 0 unknown, 1 clear, 2 found infected
    const poolState = []; // 0 waiting, 1 negative, 2 positive
    let used = 0,
      retestIndex = 0,
      poolsDone = 0;
    result.pools.forEach((p, j) => {
      const at = T.lead + j * T.step;
      const done = e >= at;
      poolState.push(done ? (p.positive ? 2 : 1) : 0);
      if (done) {
        used++;
        poolsDone++;
      }
      for (let i = 0; i < p.size; i++) {
        const who = p.start + i;
        if (!p.positive) {
          if (e >= at + i * 0.03) known[who] = 1;
        } else if (p.size === 1) {
          if (done) known[who] = 2;
        } else {
          if (e >= T.retestAt + retestIndex * T.retestStep) {
            known[who] = infected[who] ? 2 : 1;
            used++;
          }
          retestIndex++;
        }
      }
    });
    const retestsDone = used - poolsDone;
    return { infected, result, T, known, poolState, used, poolsDone, retestsDone, finished: e >= T.end };
  }

  function drawPerson(ctx, x, y, cell, colour, glow) {
    ctx.save();
    if (glow) {
      ctx.shadowColor = colour;
      ctx.shadowBlur = cell * 0.5;
    }
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(x, y - cell * 0.13, cell * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x, y + cell * 0.22, cell * 0.24, cell * 0.2, 0, Math.PI, 0);
    ctx.fill();
    ctx.restore();
  }

  function drawCrowd(ctx, s, width, height, e) {
    const L = crowdLayout(width, height);
    const C = crowdState(s, e);
    const at = (i) => ({ x: L.x + ((i % 10) + 0.5) * L.cell, y: L.y + (Math.floor(i / 10) + 0.5) * L.cell });
    const formed = ease(e / C.T.lead);

    // Each pool is a band behind its people, one segment per row it touches.
    C.result.pools.forEach((p, j) => {
      const state = C.poolState[j];
      for (let i = p.start; i < p.start + p.size;) {
        const row = Math.floor(i / 10);
        const end = Math.min(p.start + p.size, (row + 1) * 10);
        const a = at(i),
          b = at(end - 1);
        const pad = L.cell * 0.46;
        ctx.globalAlpha = formed;
        ctx.fillStyle = state === 1 ? 'rgba(126, 224, 161, 0.14)' : COLOURS.pool[j % 2];
        ctx.beginPath();
        ctx.roundRect(a.x - pad, a.y - pad, b.x - a.x + 2 * pad, 2 * pad, pad * 0.5);
        ctx.fill();
        if (state === 2) {
          ctx.strokeStyle = COLOURS.positive;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        i = end;
      }
    });
    for (let i = 0; i < CROWD; i++) {
      const c = at(i);
      const k = C.known[i];
      drawPerson(ctx, c.x, c.y, L.cell, k === 2 ? COLOURS.sick : k === 1 ? COLOURS.clear : COLOURS.person, k === 2);
    }
    drawChart(ctx, s, L, C, width);
  }

  function drawChart(ctx, s, L, C, width) {
    const G = L.chart;
    const p = s.prev / 100;
    const size = L.small ? 9 : 12;
    const expected = Array.from({ length: MAX_POOL }, (_, i) => M.expectedTests(CROWD, p, i + 1));
    const top = Math.max(110, Math.max(...expected) * 1.05);
    const X = (k) => G.x + ((k - 1) / (MAX_POOL - 1)) * (G.right - G.x);
    const Y = (v) => G.bottom - (v / top) * (G.bottom - G.y);
    const best = M.bestPoolFor(CROWD, p, MAX_POOL);

    // The title starts at the chart's left edge (or its axis labels) and shrinks, if it must, to fit the space.
    const titleX = G.x - (L.small ? 24 : 4);
    let titleSize = size + 1;
    ctx.font = `600 ${titleSize}px system-ui, sans-serif`;
    while (titleSize > 7 && ctx.measureText(t.labels.chartTitle).width > width - titleX - 4)
      ctx.font = `600 ${--titleSize}px system-ui, sans-serif`;
    ctx.fillStyle = COLOURS.ink;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(t.labels.chartTitle, titleX, G.y - size - 4);
    // Axes, and the line for testing everyone one by one.
    ctx.strokeStyle = COLOURS.faint;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(G.x, G.y);
    ctx.lineTo(G.x, G.bottom);
    ctx.lineTo(G.right, G.bottom);
    ctx.stroke();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = COLOURS.muted;
    ctx.beginPath();
    ctx.moveTo(G.x, Y(100));
    ctx.lineTo(G.right, Y(100));
    ctx.stroke();
    ctx.setLineDash([]);
    // Its label sits above the line, or below it where the curve runs through the label's place.
    ctx.font = `${size}px system-ui, sans-serif`;
    ctx.fillStyle = COLOURS.muted;
    ctx.textAlign = 'right';
    const labelLeft = Math.max(G.x, G.right - ctx.measureText(t.labels.oneByOne).width);
    const curveY = (x) => {
      const k = 1 + ((x - G.x) / (G.right - G.x)) * (MAX_POOL - 1);
      const i = Math.min(MAX_POOL - 2, Math.floor(k - 1));
      return Y(expected[i] + (expected[i + 1] - expected[i]) * (k - 1 - i));
    };
    const crosses = (y0, y1) => {
      for (let x = labelLeft; x <= G.right; x += 2) if (curveY(x) > y0 - 2 && curveY(x) < y1 + 2) return true;
      return false;
    };
    const above = !crosses(Y(100) - 5 - size, Y(100) - 3) || crosses(Y(100) + 3, Y(100) + 5 + size);
    ctx.textBaseline = above ? 'alphabetic' : 'top';
    ctx.fillText(t.labels.oneByOne, G.right, above ? Y(100) - 5 : Y(100) + 5);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (const k of [1, 5, 10, 15, 20]) ctx.fillText(count(k), X(k), G.bottom + 4);
    ctx.fillText(t.labels.axis, (G.x + G.right) / 2, G.bottom + size + 7);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (const v of [0, 50, 100]) ctx.fillText(count(v), G.x - 5, Y(v));

    // The whole curve, faintly; the pool sizes tried, brightly.
    ctx.strokeStyle = COLOURS.chart;
    ctx.globalAlpha = 0.18;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    expected.forEach((v, i) => (i ? ctx.lineTo(X(i + 1), Y(v)) : ctx.moveTo(X(1), Y(v))));
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 2;
    for (let k = 1; k < MAX_POOL; k++) {
      if (!tried.has(k) || !tried.has(k + 1)) continue;
      ctx.beginPath();
      ctx.moveTo(X(k), Y(expected[k - 1]));
      ctx.lineTo(X(k + 1), Y(expected[k]));
      ctx.stroke();
    }
    ctx.fillStyle = COLOURS.chart;
    for (const k of tried) {
      ctx.beginPath();
      ctx.arc(X(k), Y(expected[k - 1]), L.small ? 2.2 : 3, 0, Math.PI * 2);
      ctx.fill();
    }
    // This pool size: its expectation, and once finished, what this crowd actually used.
    const k = s.pool;
    ctx.fillStyle = COLOURS.glow;
    ctx.beginPath();
    ctx.arc(X(k), Y(expected[k - 1]), L.small ? 4 : 5.5, 0, Math.PI * 2);
    ctx.fill();
    if (C.finished) {
      const x = X(k),
        y = Y(C.used),
        r = L.small ? 4 : 5;
      ctx.strokeStyle = COLOURS.sick;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, y - r);
      ctx.lineTo(x + r, y);
      ctx.lineTo(x, y + r);
      ctx.lineTo(x - r, y);
      ctx.closePath();
      ctx.stroke();
    }
    // The best pool size, or the news that there isn't one.
    ctx.textBaseline = 'alphabetic';
    if (best.k > 1) {
      tag(
        ctx,
        t.labels.best(count(best.k)),
        X(best.k),
        Math.min(G.bottom - 6, Y(best.tests) + size + 16),
        COLOURS.chart,
        size,
        width,
      );
    } else {
      // Lower still when the one-by-one label sits under its line.
      tag(
        ctx,
        t.labels.never,
        (G.x + G.right) / 2,
        Y(100) + size + 18 + (above ? 0 : size),
        COLOURS.wrong,
        size,
        width,
      );
    }
  }

  // ---------- the picture ----------

  function scene(ctx, s, width, height, e) {
    ctx.fillStyle = COLOURS.bg;
    ctx.fillRect(0, 0, width, height);
    if (s.floor === 1) drawCrowd(ctx, s, width, height, e);
    else drawRack(ctx, s, width, height, e);
  }

  let shownRack = 0; // the number of tubes the words beside the picture describe
  function draw(ctx, s, stage) {
    scene(ctx, s, stage.width, stage.height, elapsed);
    // A resize can swap the phone rack for the wide one (63 tubes for 1,000) while paused, so the words follow.
    const n = rack(stage.width, stage.height).n;
    if (s.floor === 0 && n !== shownRack) {
      shownRack = n;
      readouts(s, stage);
    }
  }

  /** The home card and link preview: the rack, already read, with the glowing tube found. */
  function preview(ctx, width, height) {
    scene(ctx, { floor: 0, hot: 1, tube: 673, seed: 1, prev: 1, pool: 10 }, width, height, 1e6);
  }

  // ---------- words beside the picture ----------

  const binary = (n, digits) => n.toString(2).padStart(digits, '0');

  /**
   * The status line and the scene's name: plain text, updated as the run moves on. Returns true when the run
   * has reached a new phase, so the panel's readout should be rebuilt.
   */
  function live(s, stage) {
    if (s.floor === 1) {
      const C = crowdState(s, elapsed);
      $('scene-name').textContent = t.sceneNames.crowd(percent(s.prev));
      $('scene-status').textContent = C.finished
        ? t.status.used(count(C.used))
        : C.poolsDone < C.result.pools.length || !C.T.retests
          ? t.status.pooling(count(C.poolsDone), count(C.result.pools.length))
          : t.status.retesting(count(C.retestsDone), count(C.T.retests));
      const next = C.finished ? 'done' : 'running';
      if (next === phase) return false;
      phase = next;
      if (C.finished && !announced) {
        announced = true;
        W.announce(t.announce.crowd(count(C.used), decimal(M.expectedTests(CROWD, s.prev / 100, s.pool))));
      }
      return true;
    }
    const R = rack(stage.width, stage.height);
    const P = rackPhase(R, elapsed);
    const hot = hotTubes(s, R.n);
    const pointed = M.decode(M.results(hot, R.tests));
    $('scene-status').textContent =
      P.name === 'mixing'
        ? t.status.mixing(count(P.well + 1), count(R.tests))
        : P.name === 'testing'
          ? t.status.testing(count(R.tests))
          : t.status.read(count(R.tests));
    $('scene-name').textContent =
      P.name !== 'read'
        ? hot.length > 1
          ? t.sceneNames.hiddenTwo
          : t.sceneNames.hidden
        : t.sceneNames.found(count(pointed));
    const next = `${P.name}|${R.n}`;
    if (next === phase) return false;
    phase = next;
    if (P.name === 'read' && !announced) {
      announced = true;
      W.announce(
        hot.length > 1
          ? t.announce.wrong(count(hot[0]), count(hot[1]), count(pointed))
          : t.announce.found(count(pointed), count(R.tests)),
      );
    }
    return true;
  }

  function readouts(s, stage) {
    live(s, stage);
    $('scene-label').textContent = s.floor === 1 ? t.sceneLabels[1] : '';
    $('scene-tip').textContent = t.tips[s.floor];
    $('scene-action').textContent = t.actionLabels[s.floor];
    document
      .querySelectorAll('#scene-controls [data-floor]')
      .forEach((b) => b.setAttribute('aria-pressed', Number(b.dataset.floor) === s.floor));
    document
      .querySelectorAll('#scene-controls [data-hot]')
      .forEach((b) => b.setAttribute('aria-pressed', Number(b.dataset.hot) === s.hot));
    const box = $('pools-readout');
    if (!box) return;
    if (s.floor === 1) {
      const p = s.prev / 100;
      const C = crowdState(s, elapsed);
      const best = M.bestPoolFor(CROWD, p, MAX_POOL);
      box.innerHTML =
        `<p>${t.readout.used(C.finished ? count(C.used) : '…')}</p>` +
        `<p>${t.readout.expected(decimal(M.expectedTests(CROWD, p, s.pool)))}</p>` +
        `<p>${best.k > 1 ? t.readout.best(count(best.k), decimal(best.tests)) : t.readout.never}</p>`;
      return;
    }
    const R = rack(stage.width, stage.height);
    $('scene-label').textContent = t.sceneLabels[0](count(R.n), count(R.tests));
    const hot = hotTubes(s, R.n);
    const lights = M.results(hot, R.tests);
    let h = `<p>${t.readout.tests(count(R.tests), count(R.n))}</p>`;
    if (rackPhase(R, elapsed).name === 'read') {
      for (const tube of hot) h += `<p>${t.readout.code(count(tube), binary(tube, R.tests))}</p>`;
      const pointed = M.decode(lights);
      h += `<p>${t.readout.lights(binary(pointed, R.tests), count(pointed))}</p>`;
      if (hot.length > 1) h += `<p>${t.readout.two}</p>`;
    }
    if (picked >= 0) {
      const k = bitOf(R, picked);
      h += `<p>${t.readout.well(count(2 ** k), count(M.members(k, R.n).length))}</p>`;
    }
    box.innerHTML = h;
  }

  // ---------- controls ----------

  function controls(s, stage) {
    const segment = (id, label, key, values, names, current) =>
      `<div class="control wide"><label id="pools-${id}-label">${label}</label>` +
      `<div class="segment" role="group" aria-labelledby="pools-${id}-label">` +
      values
        .map((v, i) => `<button type="button" data-${key}="${v}" aria-pressed="${current === v}">${names[i]}</button>`)
        .join('') +
      '</div></div>';
    let h = segment('floor', t.floorLabel, 'floor', [0, 1], t.floors, s.floor);
    if (s.floor === 1)
      h +=
        stage.slider('prev', t.prevalence, 0.5, 40, 0.5, s.prev, '%', t.prevalenceHint) +
        stage.slider('pool', t.pool, 1, MAX_POOL, 1, s.pool, '', t.poolHint);
    else h += segment('hot', t.hotLabel, 'hot', [1, 2], t.hot, s.hot);
    return h + '<div class="wide readout pools-readout" id="pools-readout"></div>';
  }

  function restart(s, st) {
    start(s);
    st.sync();
    st.draw();
  }

  function bindControls(panel, s, st) {
    panel.querySelectorAll('[data-floor]').forEach((button) =>
      button.addEventListener('click', () => {
        const floor = Number(button.dataset.floor);
        if (floor === s.floor) return;
        s.floor = floor;
        picked = -1;
        st.setChosen(-1);
        start(s);
        st.refresh();
        st.draw();
        panel.querySelector(`[data-floor="${floor}"]`)?.focus();
      }),
    );
    panel.querySelectorAll('[data-hot]').forEach((button) =>
      button.addEventListener('click', () => {
        s.hot = Number(button.dataset.hot);
        st.setChosen(s.hot - 1);
        restart(s, st);
      }),
    );
  }

  /** Which tube or well a tap lands on, on the first floor. */
  function hit(p, s, stage) {
    const R = rack(stage.width, stage.height);
    const x = p.x * stage.width,
      y = p.y * stage.height;
    const col = Math.floor((x - R.x) / R.cell),
      row = Math.floor((y - R.y) / R.cell);
    if (col >= 0 && col < R.cols && row >= 0 && row < R.rows) {
      const tube = row * R.cols + col;
      if (tube >= 1 && tube <= R.n) return { tube };
    }
    if (y >= R.wellY - 12 && y <= R.wellY + R.wellH + 40) {
      const j = Math.floor((x - R.margin) / R.span);
      if (j >= 0 && j < R.tests) return { well: j };
    }
    return null;
  }

  W.defineRoom({
    id: 'pools',
    symbol: '⚗',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'engineering',
    added: '2026-09-29',
    tagline: t.tagline,
    accent: { background: '#10222a', border: '#5fd4e0', color: '#bdf1f5' },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.sceneLabels[0](count(1000), count(10)),
    sceneName: t.sceneNames.hidden,
    tip: t.tips[0],
    actionLabel: t.actionLabels[0],
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { ...t.connection, go: 'storm' },

    defaults: { floor: 0, hot: 1, tube: 673, prev: 1, pool: 10, seed: 1 },
    ranges: {
      floor: [0, 1, 'integer'],
      hot: [1, 2, 'integer'],
      tube: [1, 1000, 'integer'],
      prev: [0.5, 40],
      pool: [1, MAX_POOL, 'integer'],
      seed: [1, 9999, 'integer'],
    },
    defaultPreset: 0,
    presets: [
      { settings: { floor: 0, hot: 1 } },
      { settings: { floor: 0, hot: 2 } },
      { settings: { floor: 1, prev: 1, pool: 10 } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        color: '#7ee0a1',
        sketch: { hairStyle: 'receding', hair: '#4a3f36', skin: '#e9c4a0', glasses: 'round', backdrop: '#16281f' },
      },
      {
        ...t.guests[1],
        bio: 'Shannon',
        color: '#9fe6f2',
        sketch: { hairStyle: 'swept', hair: '#6b5a4a', skin: '#efcaa6', brows: 'soft', backdrop: '#132833' },
      },
    ],

    insight: t.insight,

    controls,
    bindControls,
    readouts,
    draw,
    preview,
    enter(s, st) {
      picked = -1;
      start(s);
      st.sync();
    },
    onPreset(s) {
      picked = -1;
      start(s);
    },
    onInput(s) {
      start(s);
    },
    step(dt, s, st) {
      elapsed += dt;
      if (live(s, st)) readouts(s, st);
    },
    action(s, st) {
      s.seed = (s.seed % 9999) + 1;
      if (s.floor === 0) s.tube = 1 + Math.floor(M.random(s.seed * 104729)() * 1000);
      st.setChosen(-1);
      restart(s, st);
    },
    reset(s, st) {
      restart(s, st);
    },

    pointer: {
      down(p, s, st) {
        if (s.floor !== 0) return;
        const h = hit(p, s, st);
        if (!h) return;
        if (h.tube) {
          s.tube = h.tube;
          picked = -1;
          st.setChosen(-1);
          restart(s, st);
          return;
        }
        picked = picked === h.well ? -1 : h.well;
        readouts(s, st);
        st.draw();
      },
      /** Left and right: pick a well on the first floor, change the pool size on the second. */
      arrow(dx, dy, s, st) {
        if (!dx) return;
        if (s.floor === 1) {
          const next = Math.max(1, Math.min(MAX_POOL, s.pool + dx));
          if (next === s.pool) return;
          s.pool = next;
          st.setChosen(-1);
          restart(s, st);
          return;
        }
        const tests = rack(st.width, st.height).tests;
        picked = picked < 0 ? (dx > 0 ? 0 : tests - 1) : Math.max(0, Math.min(tests - 1, picked + dx));
        readouts(s, st);
      },
      escape() {
        // The stage passes nothing to escape, so find the room's settings through it.
        const st = W.stage;
        picked = -1;
        readouts(st.settingsFor('pools'), st);
        st.draw();
      },
    },
  });
})();
