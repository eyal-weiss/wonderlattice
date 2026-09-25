/* Room · A spoonful of a city: random samples, biased samples, and why asking more doesn't cure bias. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, TAU, clamp } = W;
  const model = W.models.sample;
  const t = W.text('sample');
  const reduced = W.prefersReducedMotion();

  const BATCH = 50; // surveys per press of the action button
  const RATE = 16; // surveys a second while a batch is animating
  const MAX_SURVEYS = 250; // the dot plot keeps the latest surveys
  const STEPS = 50; // the dot plot's columns are 2 points apart, centred on 0%, 2%, … 100%
  // Dots remember when they arrived on a clock that never resets, so re-entering the room
  // (which restarts the stage clock) doesn't make old dots fall again.
  const wall = () => performance.now() / 1000;
  const SIZES = [10, 15, 20, 30, 40, 50, 75, 100, 150, 200, 300, 400, 500, 750, 1000];
  // The default city: a close race that blue narrowly wins, with one neighbourhood (Lantern Hill) far more orange.
  const DEFAULT_SEED = 44;
  const DEFAULT_HOOD = 10;

  const INK = '#eef0e6';
  const MUTED = '#8f9cad';
  const BG = '#0a0e15';
  const BLOCK = '#141c27';
  const ORANGE = '#f4a259';
  const BLUE = '#6cb6e8';
  const EVEN = '#c8d0da';
  // Residents, [blue, orange]. Every state is at least 3:1 against the block, blue is always darker than
  // orange, and each state has its own size or shape as well as colour: a small grey dot until asked, a
  // middling square once asked, a full square when the whole city is revealed, a larger glowing square in
  // the latest survey, and a hollow square for those who never reply.
  const UNKNOWN = '#6b7788';
  const SEEN = ['#3a7ab4', '#c28a50'];
  const SHOWN = ['#4a8fd0', '#f2b26f'];
  const LIT = ['#9ad4ff', '#ffe3b5'];
  // Canvas words stay this far below the top edge, clear of the stage heading just above the canvas.
  const CLEAR = 18;

  // Surveys are drawn from a seedable generator; each visit starts from a fresh seed.
  const random = model.rng(Math.floor(Math.random() * 2 ** 32));
  const live = {
    town: null, // the current city
    frames: Object.create(null), // method (and neighbourhood) → the residents it can reach
    series: fresh(''), // surveys with the current settings
    ghost: null, // the previous settings' surveys, drawn hollow for comparison
    lit: null, // 1 for residents asked in the latest survey
    seen: null, // 1 for residents asked at least once in this city
    geometry: null, // where the map was last drawn, for taps
  };
  let queue = 0, // surveys still to show in the current batch
    due = 0, // fractional surveys owed to the animation clock
    u = 1; // drawing scale for the current canvas

  function fresh(key, s) {
    return { key, name: s ? sceneName(s) : '', size: s?.size, estimates: [], born: [] };
  }

  const methodName = (s) => model.METHODS[s.method];
  const hoodName = (k) => t.hoods[k];
  const sceneName = (s) => (s.method === 1 ? t.sceneNames[1](hoodName(s.hood)) : t.sceneNames[s.method]);
  const nearestStep = (n) =>
    SIZES.reduce((best, size, i) => (Math.abs(size - n) < Math.abs(SIZES[best] - n) ? i : best), 0);

  /** Put odd values (say, from an old link) right, and build the city when its seed changes. */
  function cityFor(s) {
    s.size = SIZES[nearestStep(s.size)]; // links may carry any size; keep the slider's steps
    s.method = clamp(Math.round(s.method) || 0, 0, 2);
    s.size = clamp(Math.round(s.size) || 50, 10, 1000);
    s.hood = clamp(Math.round(s.hood) || 0, 0, model.HOODS - 1);
    s.seed = clamp(Math.round(s.seed) || DEFAULT_SEED, 1, 99999);
    if (live.town?.seed !== s.seed) {
      live.town = model.city(s.seed);
      live.frames = Object.create(null);
      live.seen = new Uint8Array(live.town.size);
      live.lit = null;
      live.ghost = null;
      live.series = fresh('');
    }
    return live.town;
  }

  function frameFor(s) {
    const key = s.method === 1 ? `hood${s.hood}` : methodName(s);
    return (live.frames[key] ??= model.frame(live.town, methodName(s), s.hood));
  }

  /** New settings start a new series; the old one stays behind as a ghost to compare with. */
  function ensure(s) {
    cityFor(s);
    const key = `${s.method}|${s.size}|${s.method === 1 ? s.hood : ''}`;
    if (live.series.key === key) return;
    if (live.series.estimates.length)
      live.ghost = { name: live.series.name, size: live.series.size, estimates: live.series.estimates.slice() };
    live.series = fresh(key, s);
    live.lit = null;
    queue = 0;
    due = 0;
  }

  /** One survey with the current settings: light up who was asked and add a dot. */
  function askOnce(s, now) {
    const { asked, estimate } = model.survey(live.town, frameFor(s), s.size, random);
    live.lit = new Uint8Array(live.town.size);
    for (const i of asked) {
      live.lit[i] = 1;
      live.seen[i] = 1;
    }
    live.series.estimates.push(estimate);
    live.series.born.push(now);
    if (live.series.estimates.length > MAX_SURVEYS) {
      live.series.estimates.shift();
      live.series.born.shift();
    }
  }

  // ─── Drawing ────────────────────────────────────────────────────────────

  const font = (ctx, px, weight = 400, family = 'system-ui') => (ctx.font = `${weight} ${px}px ${family}`);

  /** A small uppercase heading. Returns false, drawing nothing, when it can't fit. */
  function eyebrow(ctx, text, x, y, maxWidth, color = MUTED) {
    const words = text.toUpperCase();
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.letterSpacing = '1.2px';
    font(ctx, Math.max(10, 11 * u), 600);
    const fits = ctx.measureText(words).width <= maxWidth;
    if (fits) ctx.fillText(words, x, y);
    ctx.letterSpacing = '0px';
    return fits;
  }

  /** A small dark pill behind a label so it reads over the map. */
  function tag(ctx, text, x, y, color, px) {
    font(ctx, px, 600);
    const w = ctx.measureText(text).width + px * 1.1,
      h = px * 1.7;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2);
    ctx.fillStyle = 'rgba(10, 14, 21, 0.88)';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y + 0.5);
    ctx.textBaseline = 'alphabetic';
  }

  /**
   * The city: blocks separated by streets where neighbourhoods meet, and one
   * small square window per resident, coloured by what we know about them.
   */
  function drawMap(ctx, box, s, view) {
    const town = view.town,
      { cols, rows } = town;
    const { x0, y0, cell, mw, mh } = mapGeometry(box);
    if (box.titled) eyebrow(ctx, t.cityTitle(town.size), x0, y0 - 8 * u - 6, mw);

    ctx.beginPath();
    ctx.roundRect(x0 - 3, y0 - 3, mw + 6, mh + 6, 6);
    ctx.fillStyle = BLOCK;
    ctx.fill();
    const chosen = s.method === 1 ? s.hood : -1;
    const at = (c, r) => r * cols + c;
    if (chosen >= 0) {
      ctx.fillStyle = '#1e2a38';
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          if (town.hood[at(c, r)] === chosen) ctx.fillRect(x0 + c * cell, y0 + r * cell, cell, cell);
    }

    // Streets run along the edges where two neighbourhoods meet.
    ctx.beginPath();
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const k = town.hood[at(c, r)];
        if (c + 1 < cols && town.hood[at(c + 1, r)] !== k) {
          ctx.moveTo(x0 + (c + 1) * cell, y0 + r * cell);
          ctx.lineTo(x0 + (c + 1) * cell, y0 + (r + 1) * cell);
        }
        if (r + 1 < rows && town.hood[at(c, r + 1)] !== k) {
          ctx.moveTo(x0 + c * cell, y0 + (r + 1) * cell);
          ctx.lineTo(x0 + (c + 1) * cell, y0 + (r + 1) * cell);
        }
      }
    ctx.strokeStyle = BG;
    ctx.lineWidth = Math.max(1.4, cell * 0.42);
    ctx.lineCap = 'square';
    ctx.stroke();
    ctx.lineCap = 'butt';

    // Residents, grouped by how they are drawn, so each group is a single fill or stroke.
    const kind = (i) => {
      const like = town.likes[i];
      if (view.lit?.[i]) return `lit${like}`;
      if (view.bare) return `full${like}`;
      if (s.reveal) return s.method === 2 && !town.answers[i] ? `ring${like}` : `full${like}`;
      return view.seen?.[i] ? `seen${like}` : 'unknown';
    };
    const groups = new Map();
    for (let i = 0; i < town.size; i++) {
      const k = kind(i);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(i);
    }
    const full = Math.max(1.4, cell * (view.bare ? 0.62 : 0.56));
    /** Add a square of side `size`, centred in each listed resident's cell, to the current path. */
    const squares = (list, size) => {
      const inset = (cell - size) / 2;
      for (const i of list) {
        const c = i % cols,
          r = (i - c) / cols;
        ctx.rect(x0 + c * cell + inset, y0 + r * cell + inset, size, size);
      }
    };
    ctx.beginPath();
    squares(groups.get('unknown') ?? [], Math.max(1, cell * 0.3));
    ctx.fillStyle = UNKNOWN;
    ctx.fill();
    for (const like of [0, 1]) {
      const rings = groups.get(`ring${like}`) ?? [];
      if (rings.length) {
        const width = Math.max(0.8, cell * 0.13);
        ctx.beginPath();
        squares(rings, full - width);
        ctx.strokeStyle = SHOWN[like];
        ctx.lineWidth = width;
        ctx.stroke();
      }
      ctx.beginPath();
      squares(groups.get(`seen${like}`) ?? [], Math.max(1.2, cell * 0.42));
      ctx.fillStyle = SEEN[like];
      ctx.fill();
      ctx.beginPath();
      squares(groups.get(`full${like}`) ?? [], full);
      ctx.fillStyle = SHOWN[like];
      ctx.fill();
    }
    // The latest survey: larger, lighter, with a soft glow.
    for (const like of [0, 1]) {
      const list = groups.get(`lit${like}`) ?? [];
      if (!list.length) continue;
      ctx.fillStyle = LIT[like];
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      squares(list, full * 1.9);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.beginPath();
      squares(list, Math.min(cell, full * 1.15));
      ctx.fill();
    }

    // The chosen neighbourhood: outlined down the middle of its streets, and named.
    if (chosen >= 0) {
      ctx.beginPath();
      const outside = (c, r) => c < 0 || r < 0 || c >= cols || r >= rows || town.hood[at(c, r)] !== chosen;
      const edge = (ax, ay, bx, by) => {
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
      };
      let top = rows,
        sum = 0,
        count = 0;
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          if (town.hood[at(c, r)] !== chosen) continue;
          const x = x0 + c * cell,
            y = y0 + r * cell;
          if (outside(c - 1, r)) edge(x, y, x, y + cell);
          if (outside(c + 1, r)) edge(x + cell, y, x + cell, y + cell);
          if (outside(c, r - 1)) edge(x, y, x + cell, y);
          if (outside(c, r + 1)) edge(x, y + cell, x + cell, y + cell);
          // The label sits on the neighbourhood's top row.
          if (r < top) {
            top = r;
            sum = 0;
            count = 0;
          }
          if (r === top) {
            sum += c;
            count++;
          }
        }
      ctx.strokeStyle = '#e8eddf';
      ctx.lineWidth = 1.3;
      ctx.stroke();
      if (!view.bare) {
        const px = Math.max(10, 12 * u);
        const x = clamp(x0 + (sum / count + 0.5) * cell, x0 + 50, x0 + mw - 50);
        const y = Math.max(y0 + px, y0 + top * cell);
        tag(ctx, hoodName(chosen), x, y, '#f4f5e9', px);
      }
    }
    return { x0, y0, cell };
  }

  const dotColour = (e) => (e > 0.5 + 1e-9 ? ORANGE : e < 0.5 - 1e-9 ? BLUE : EVEN);

  /** Space above the map: its heading, and a margin below the stage heading. */
  const headOf = (titled) => (titled ? 20 * u + 8 + CLEAR : CLEAR / 2);

  /**
   * Where the map sits in its box: the largest cell size that fits, with room
   * for a heading when `box.titled`, centred across (and down, when `box.middle`).
   */
  function mapGeometry(box) {
    const head = headOf(box.titled);
    const cell = Math.min(box.w / model.COLS, (box.h - head) / model.ROWS);
    const mw = cell * model.COLS,
      mh = cell * model.ROWS;
    return {
      x0: box.x + (box.w - mw) / 2,
      y0: box.y + head + (box.middle ? (box.h - head - mh) / 2 : 0),
      cell,
      mw,
      mh,
    };
  }

  /**
   * The dot plot: one dot per survey, at the share of orange fans it found,
   * stacked in columns 2 points apart. The previous settings' dots are hollow
   * rings; the truth, once revealed, is a line.
   */
  function drawPlot(ctx, box, s, view, { now = 0, animate = false } = {}) {
    const bare = !!view.bare;
    const steps = bare ? 20 : STEPS; // coarser columns on the small home card
    const labelPx = Math.max(10, 11 * u),
      px = Math.max(10, 12 * u);
    const inset = bare ? 9 : Math.max(8, 10 * u);
    const left = box.x + inset,
      right = box.x + box.w - inset;
    const series = view.series,
      ghost = view.ghost;
    // A heading, and a note about the hollow dots, when there is room for them.
    let y = box.y;
    if (box.titled) {
      const n = Math.min(s.size, frameFor(s).length);
      y += 12 * u + 2;
      if (!eyebrow(ctx, t.plotTitle(n), box.x, y, box.w)) eyebrow(ctx, t.plotTitleShort, box.x, y, box.w);
      if (ghost) {
        y += labelPx + 7;
        font(ctx, labelPx);
        ctx.fillStyle = MUTED;
        ctx.textAlign = 'left';
        ctx.fillText(t.before(ghost.name, ghost.size), box.x, y);
      }
      y += 4;
    }
    const top = y + (bare ? 12 : px * 1.7 + 8),
      bottom = box.y + box.h - (bare ? 4 : labelPx + 12);
    const X = (f) => left + f * (right - left);

    // Faint halves: left of the middle blue wins, right of it orange wins.
    ctx.fillStyle = 'rgba(108, 182, 232, 0.06)';
    ctx.fillRect(left, top, X(0.5) - left, bottom - top);
    ctx.fillStyle = 'rgba(244, 162, 89, 0.06)';
    ctx.fillRect(X(0.5), top, right - X(0.5), bottom - top);
    ctx.strokeStyle = '#3a4656';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(X(0.5), top);
    ctx.lineTo(X(0.5), bottom);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#4a5566';
    ctx.fillRect(left, bottom, right - left, 1);
    if (!bare) {
      // One row under the axis: 0%, who wins on each side, 50%, and 100%.
      const row = bottom + labelPx + 7;
      ctx.fillStyle = MUTED;
      font(ctx, labelPx);
      for (const [f, align] of [
        [0, 'left'],
        [0.5, 'center'],
        [1, 'right'],
      ]) {
        ctx.textAlign = align;
        ctx.fillText(`${f * 100}%`, X(f) + (f === 0 ? -inset * 0.5 : f === 1 ? inset * 0.5 : 0), row);
      }
      for (const f of [0, 0.25, 0.5, 0.75, 1]) ctx.fillRect(X(f) - 0.5, bottom, 1, 4);
      font(ctx, labelPx, 600);
      ctx.textAlign = 'center';
      ctx.fillStyle = BLUE;
      ctx.fillText(t.blueWins, X(0.25), row);
      ctx.fillStyle = ORANGE;
      ctx.fillText(t.orangeWins, X(0.75), row);
    }

    // Stack the dots. Every column fits its tallest stack.
    const column = (e) => Math.round(e * steps);
    const tally = (list) => {
      const counts = new Array(steps + 1).fill(0);
      for (const e of list) counts[column(e)]++;
      return Math.max(0, ...counts);
    };
    const tallest = Math.max(8, tally(series.estimates), ghost ? tally(ghost.estimates) : 0);
    const step = (right - left) / steps;
    const d = Math.min(step * 0.9, (bottom - top - 3) / tallest);
    const place = (list, draw) => {
      const heights = new Array(steps + 1).fill(0);
      list.forEach((e, i) => {
        const k = column(e);
        draw(X(k / steps), bottom - 2 - (heights[k] + 0.5) * d, e, i);
        heights[k]++;
      });
    };
    if (ghost) {
      ctx.strokeStyle = '#7d8a9c';
      ctx.lineWidth = Math.max(0.8, d * 0.14);
      place(ghost.estimates, (x, y) => {
        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.8, d * 0.38), 0, TAU);
        ctx.stroke();
      });
    }
    place(series.estimates, (x, y, e, i) => {
      // A new dot drops into place.
      const age = animate ? now - series.born[i] : 1;
      const fall = age >= 0 && age < 0.35 ? (1 - age / 0.35) ** 2 : 0;
      ctx.beginPath();
      ctx.arc(x, y - fall * (y - top), Math.max(1, d * 0.45), 0, TAU);
      ctx.fillStyle = dotColour(e);
      ctx.fill();
    });

    // The average of the current dots, as a caret under the axis.
    if (series.estimates.length && !bare) {
      const mean = series.estimates.reduce((a, b) => a + b, 0) / series.estimates.length;
      const x = X(mean);
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.moveTo(x, bottom + 1);
      ctx.lineTo(x - 4.5, bottom + 8);
      ctx.lineTo(x + 4.5, bottom + 8);
      ctx.closePath();
      ctx.fill();
    }

    // The whole city's answer: a question until it is revealed.
    const tagY = top - px * 0.85 - 4;
    if (s.reveal) {
      const x = X(view.town.share);
      ctx.strokeStyle = '#f4f5e9';
      ctx.lineWidth = 1.6;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(x, bare ? top - 8 : tagY);
      ctx.lineTo(x, bottom);
      ctx.stroke();
      ctx.setLineDash([]);
      if (!bare) {
        font(ctx, px, 600);
        const label = t.wholeCity(Math.round(view.town.share * 100));
        const w = ctx.measureText(label).width + px * 1.1;
        tag(ctx, label, clamp(x, box.x + w / 2, box.x + box.w - w / 2), tagY, '#f4f5e9', px);
      }
    } else if (!bare) {
      tag(ctx, t.wholeCity(null), X(0.5), tagY, MUTED, px);
    }

    if (!series.estimates.length && !ghost && !bare) {
      ctx.fillStyle = '#c8d0da';
      ctx.textAlign = 'center';
      font(ctx, Math.max(12, 15 * u), 'italic 400', 'Georgia, serif');
      ctx.fillText(t.startHint, (left + right) / 2, (top + bottom) / 2 + 5);
    }
  }

  /**
   * The map beside the dot plot on a wide, short canvas; otherwise the map on
   * top with the plot under it, the same width. Headings only where they fit.
   */
  function layout(width, height) {
    const gap = clamp(width * 0.035, 12, 30);
    if (width >= 600 && width > height * 1.35) {
      const mapWidth = Math.round((width - gap) * 0.56);
      const map = { x: 0, y: 0, w: mapWidth, h: height, titled: true, middle: true };
      const plot = { x: mapWidth + gap, y: CLEAR, w: width - mapWidth - gap, h: height - CLEAR, titled: true };
      return { map, plot };
    }
    const titled = height >= 400;
    const head = headOf(titled);
    const mapHeight = Math.round(Math.min(height * 0.58, (width / model.COLS) * model.ROWS + head));
    const map = { x: 0, y: 0, w: width, h: mapHeight, titled };
    const g = mapGeometry(map);
    const plotTop = g.y0 + g.mh + gap * 0.7;
    // Line the plot up with the map, but never narrower than 300px when the canvas allows.
    const plotWidth = Math.min(width, Math.max(g.mw + 6, 300));
    return { map, plot: { x: (width - plotWidth) / 2, y: plotTop, w: plotWidth, h: height - plotTop, titled } };
  }

  function draw(ctx, s, stage) {
    const { width, height } = stage;
    ensure(s);
    u = clamp(Math.min(width / 820, height / 560), 0.6, 1.15);
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, width, height);
    const L = layout(width, height);
    live.geometry = drawMap(ctx, L.map, s, live);
    drawPlot(ctx, L.plot, s, live, { now: wall(), animate: !reduced && stage.playing });
  }

  /** The home-card picture: the city revealed, one neighbourhood's survey lit, and two clouds of estimates. */
  function preview(ctx, width, height) {
    const s = { ...defaults, method: 1, reveal: true };
    const town = model.city(DEFAULT_SEED),
      r = model.rng(7);
    const hood = model.frame(town, 'hood', DEFAULT_HOOD),
      all = model.frame(town, 'random');
    const lit = new Uint8Array(town.size);
    for (const i of model.survey(town, hood, 40, r).asked) lit[i] = 1;
    const cloud = (list) => Array.from({ length: 36 }, () => model.survey(town, list, 50, r).estimate);
    const view = {
      bare: true,
      town,
      lit,
      seen: null,
      series: { estimates: cloud(hood), born: [] },
      ghost: { estimates: cloud(all) },
    };
    u = 0.6;
    const split = Math.round(width * 0.6);
    drawMap(ctx, { x: 8, y: 8, w: split - 12, h: height - 16, middle: true }, s, view);
    drawPlot(ctx, { x: split, y: 8, w: width - split - 4, h: height - 16 }, s, view);
  }

  // ─── Readouts and controls ─────────────────────────────────────────────

  const points = (x) => (x * 100).toFixed(1);

  /**
   * Update the words beside the canvas. `settled` is false while a batch is still landing; `speak`
   * announces the estimate once a batch has landed (the line itself isn't a live region: it changes too often).
   */
  function showTally(s, settled, speak = false) {
    const town = live.town,
      series = live.series,
      count = series.estimates.length;
    $('scene-status').textContent = count ? t.surveys(count) : t.ready;
    if (!$('sample-readout')) return;
    const list = frameFor(s),
      n = Math.min(s.size, list.length);
    const sum = model.summary(series.estimates, town.share);
    $('sample-count').innerHTML = count ? t.surveyLine(count, n) : t.noSurveys;
    $('sample-theory').textContent = t.theoryLine(s.size, points(model.standardError(town.share, s.size, town.size)));
    $('sample-truth').textContent = s.reveal
      ? t.truthLine(Math.round(town.share * 100), count ? points(sum.error) : null)
      : t.truthHidden;
    const note =
      s.method === 1
        ? (s.size >= list.length ? t.hoodAll : t.hoodNote)(list.length, hoodName(s.hood))
        : s.method === 2
          ? s.size >= list.length
            ? t.volunteerAll(list.length)
            : t.volunteerNote(list.length, town.size)
          : t.randomNote;
    $('sample-note').textContent = note;
    // Numbers for tests and the curious: the average estimate and the truth, in percent.
    $('sample-readout').dataset.mean = count ? (sum.mean * 100).toFixed(2) : '';
    $('sample-readout').dataset.truth = (town.share * 100).toFixed(2);
    const estimate = count
      ? t.estimateLine(Math.round(sum.mean * 100), count > 1 ? points(sum.spread) : null)
      : t.noEstimate;
    $('sample-estimate').textContent = estimate;
    if (speak && settled && count) W.announce(`${t.surveys(count)}. ${estimate}`);
  }

  /** Keep the panel in step with settings changed elsewhere (the map, the keyboard, a link). */
  function showSettings(s) {
    if (!$('sample-method')) return;
    $('sample-method').value = String(s.method);
    $('sample-hood').value = String(s.hood);
    const step = nearestStep(s.size);
    $('sample-size').value = String(step);
    $('sample-size').setAttribute('aria-valuetext', String(s.size));
    $('sample-size-value').textContent = s.size.toLocaleString(W.lang);
    const reveal = document.querySelector('#scene-controls [data-check="reveal"]');
    if (reveal) reveal.checked = s.reveal;
  }

  function readouts(s) {
    ensure(s);
    $('scene-name').textContent = sceneName(s);
    showSettings(s);
    showTally(s, queue === 0 || !W.stage.playing);
  }

  /** Any change of how to ask: the preset no longer matches, and the words follow. */
  function changed(s, stage) {
    stage.setChosen(-1);
    stage.sync();
    stage.draw();
  }

  /** Ask `count` times: animated while playing, all at once when paused or when motion is reduced. */
  function ask(s, stage, count) {
    ensure(s);
    if (reduced || !stage.playing || count === 1) {
      for (let i = 0; i < count; i++) askOnce(s, wall());
      showTally(s, queue === 0 || !W.stage.playing, true);
      stage.draw();
      return;
    }
    queue += count;
    due = Math.max(due, 1); // the first survey lands straight away
  }

  function newCity(s) {
    let seed;
    do seed = 1 + Math.floor(Math.random() * 99999);
    while (seed === s.seed);
    s.seed = seed;
    s.hood = model.oddestHood(cityFor(s));
  }

  const select = (key, label, options, value) =>
    `<div class="control"><label for="sample-${key}">${label}</label><select id="sample-${key}">` +
    options.map((o, i) => `<option value="${i}"${i === value ? ' selected' : ''}>${o}</option>`).join('') +
    '</select></div>';

  function controls(s, stage) {
    return (
      '<div class="sample-pair wide">' +
      select('method', t.methodLabel, t.methods, s.method) +
      select('hood', t.hoodLabel, t.hoods, s.hood) +
      '</div>' +
      `<div class="control wide"><label for="sample-size">${t.sizeLabel}<output id="sample-size-value">${s.size}</output></label>` +
      `<input id="sample-size" type="range" min="0" max="${SIZES.length - 1}" step="1" value="${nearestStep(s.size)}" aria-valuetext="${s.size}"></div>` +
      `<div class="wide">${stage.check('reveal', t.reveal, s.reveal)}</div>` +
      '<div class="sample-buttons wide">' +
      `<button type="button" class="button" id="sample-once">${t.askOnce}</button>` +
      `<button type="button" class="button" id="sample-city">${t.newCity}</button></div>` +
      '<div class="wide readout sample-readout" id="sample-readout">' +
      '<div id="sample-count"></div><div id="sample-estimate"></div>' +
      '<div id="sample-theory"></div><div id="sample-truth"></div><div id="sample-note" class="sample-note"></div></div>'
    );
  }

  function bindControls(panel, s, stage) {
    $('sample-method').addEventListener('change', (e) => {
      s.method = Number(e.target.value);
      changed(s, stage);
    });
    // Choosing a neighbourhood means asking there.
    $('sample-hood').addEventListener('change', (e) => {
      s.hood = Number(e.target.value);
      s.method = 1;
      changed(s, stage);
    });
    $('sample-size').addEventListener('input', (e) => {
      s.size = SIZES[Number(e.target.value)];
      changed(s, stage);
    });
    // The stage stores the checkbox; refresh the words too.
    panel.querySelector('[data-check="reveal"]').addEventListener('change', () => stage.sync());
    $('sample-once').addEventListener('click', () => ask(s, stage, 1));
    $('sample-city').addEventListener('click', () => {
      newCity(s);
      stage.sync();
      stage.draw();
    });
  }

  /** The explanation's live paragraph: the numbers for the visitor's own city. */
  function explain(s) {
    const town = cityFor(s),
      target = $('sample-live');
    if (!target) return;
    const off = (method) => points(Math.abs(model.frameShare(town, model.frame(town, method, s.hood)) - town.share));
    target.textContent = t.live(
      s.size,
      points(model.standardError(town.share, s.size, town.size)),
      hoodName(s.hood),
      off('hood'),
      off('volunteer'),
    );
  }

  const defaults = { method: 0, size: 50, hood: DEFAULT_HOOD, seed: DEFAULT_SEED, reveal: false };

  W.defineRoom({
    id: 'sample',
    symbol: '◍',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'chance',
    tagline: t.tagline,
    accent: { background: '#2a2320', border: '#f4a259', color: '#fbd9b6' },

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
    connection: { ...t.connection, go: 'dice' },

    // method: 0 at random, 1 one neighbourhood, 2 whoever answers; size: people per survey;
    // hood: the neighbourhood asked; seed: which city; reveal: show the whole city's answer.
    defaults,
    ranges: {
      method: [0, 2, 'integer'],
      size: [10, 1000, 'integer'],
      hood: [0, model.HOODS - 1, 'integer'],
      seed: [1, 99999, 'integer'],
    },
    defaultPreset: 0,
    presets: [
      { method: 0, size: 50 },
      { method: 1, size: 50 },
      { method: 2, size: 1000 },
    ].map((settings, i) => ({
      ...t.presets[i],
      badge: ['50', '⌂', '1000'][i],
      settings,
    })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Neyman',
        color: '#9fc7e6',
        sketch: {
          hairStyle: 'receding', // a high forehead, hair thinning in later years
          hair: '#d9d4cc',
          skin: '#eecdb0',
          moustache: true,
          glasses: 'round',
          backdrop: '#dde5ea',
        },
      },
    ],

    insight: { ...t.insight, onOpen: explain },

    controls,
    bindControls,
    readouts,
    draw,
    preview,

    /** "Ask the neighbours" goes to whichever neighbourhood differs most from this city. */
    onPreset(s) {
      if (s.method === 1) s.hood = model.oddestHood(cityFor(s));
    },

    step(dt, s, stage) {
      if (!queue) return;
      ensure(s);
      due += dt * RATE;
      const n = Math.min(queue, Math.floor(due));
      if (!n) return;
      due -= n;
      queue -= n;
      for (let i = 0; i < n; i++) askOnce(s, wall());
      showTally(s, queue === 0 || !W.stage.playing, queue === 0);
    },

    action(s, stage) {
      ask(s, stage, BATCH);
    },

    reset(s, stage) {
      ensure(s);
      live.series = fresh(live.series.key, s);
      live.ghost = null;
      live.lit = null;
      live.seen.fill(0);
      queue = 0;
      due = 0;
      stage.sync();
    },

    pointer: {
      /** Tapping a neighbourhood asks only there. */
      down(p, s, stage) {
        const g = live.geometry;
        if (!g) return;
        const c = Math.floor((p.x * stage.width - g.x0) / g.cell),
          r = Math.floor((p.y * stage.height - g.y0) / g.cell);
        if (c < 0 || r < 0 || c >= model.COLS || r >= model.ROWS) return;
        s.hood = live.town.hood[r * model.COLS + c];
        s.method = 1;
        changed(s, stage);
      },
      /** Left and right step through the neighbourhoods; up and down change the survey size. */
      arrow(dx, dy, s, stage) {
        if (dx) {
          s.hood = (s.hood + dx + model.HOODS) % model.HOODS;
          s.method = 1;
        }
        if (dy) s.size = SIZES[clamp(nearestStep(s.size) - dy, 0, SIZES.length - 1)];
        changed(s, stage);
      },
    },
  });
})();
