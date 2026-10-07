/* Room · Six handshakes: a ring of friends, a few random shortcuts, and a world that shrinks. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, TAU, clamp } = W;
  const M = W.models.handshakes;
  const t = W.text('handshakes');

  const N = M.PEOPLE;
  const YOU = 0; // at the top of the ring
  const HOP = 0.13; // seconds the pulse takes per handshake, so a long chain looks long
  const ROUND = 0.18; // seconds per round of the rumour
  const FIRST = 0.95; // seconds between the first few shortcuts arriving
  const LATER = 0.12; // and between the rest

  const BG = '#0a0e15',
    RING = 'rgba(120,140,172,0.55)',
    PERSON = '#c9d4e6',
    SHORT = '#ff9478',
    GOLD = '#ffd36e',
    THEM = '#7fe0ff',
    CLOSE = '#bfe6b0',
    INK = '#fff4ea',
    SOFT = '#b9c3d3';

  let world = null, // { seed, extra, distance: [], knit: [] }, filled in as needed
    shown = 0, // shortcuts drawn so far: it catches up with the setting, one at a time
    born = [], // when each shown shortcut appeared (room time)
    wait = 0, // until the next one arrives
    time = 0, // room time, advanced only while playing
    display = null, // the average distance on show, easing towards the true value
    them = N / 2, // the person the chain runs to, opposite you
    lists = null,
    listsFor = -1,
    chain = null,
    chainFor = '',
    reach = null,
    reachFor = -1,
    since = 0, // when the current pulse or rumour started
    told = -1, // the number of shortcuts last announced
    opening = false, // the first visit's slow show of the first few shortcuts, until the visitor takes over
    entered = false;

  const number = (v) =>
    new Intl.NumberFormat(W.numberLocale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(v);
  const percent = (v) => new Intl.NumberFormat(W.numberLocale, { style: 'percent' }).format(v);

  /** The shortcuts for this seed, and the world's numbers for each count, worked out when first asked for. */
  function ensure(seed) {
    if (world && world.seed === seed) return world;
    world = { seed, extra: M.shortcuts(M.MOST, seed), distance: [], knit: [] };
    listsFor = -1;
    reachFor = -1;
    chainFor = '';
    return world;
  }
  function measure(c) {
    if (world.distance[c] === undefined) {
      const f = M.friends(world.extra.slice(0, c));
      world.distance[c] = M.averageDistance(f);
      world.knit[c] = M.clustering(f);
    }
    return { distance: world.distance[c], knit: world.knit[c] };
  }
  function friendsNow() {
    if (listsFor !== shown) {
      lists = M.friends(world.extra.slice(0, shown));
      listsFor = shown;
    }
    return lists;
  }
  function chainNow() {
    const key = `${shown}:${them}`;
    if (chainFor !== key) {
      chain = M.path(friendsNow(), YOU, them);
      chainFor = key;
    }
    return chain;
  }
  function reachNow() {
    if (reachFor !== shown) {
      reach = M.distances(friendsNow(), YOU);
      reachFor = shown;
    }
    return reach;
  }

  /** Where the ring and the chart go: the chart sits beside the ring on wide pictures, under it on tall ones. */
  function layout(w, h) {
    const m = Math.max(12, Math.min(w, h) * 0.03);
    let D,
      cx,
      cy,
      chart = null;
    if (w - 3 * m - 200 >= 0.7 * (h - 2 * m)) {
      D = Math.min(h - 2 * m, (w - 3 * m) * 0.64);
      cx = m + D / 2;
      cy = h / 2;
      chart = { x: 2 * m + D, y: m, w: w - 3 * m - D, h: h - 2 * m };
    } else if (h - 3 * m - 170 >= 0.7 * (w - 2 * m)) {
      D = Math.min(w - 2 * m, (h - 3 * m) * 0.64);
      cx = w / 2;
      cy = m + D / 2;
      chart = { x: m, y: 2 * m + D, w: w - 2 * m, h: h - 3 * m - D };
    } else {
      D = Math.min(w, h) - 2 * m;
      cx = w / 2;
      cy = h / 2;
    }
    const R = (D / 2) * 0.9;
    return { cx, cy, R, chart, dot: clamp(R * 0.013, 1.4, 3.4) };
  }

  const angle = (i) => -Math.PI / 2 + (TAU * i) / N;
  const at = (L, i, r = L.R) => [L.cx + Math.cos(angle(i)) * r, L.cy + Math.sin(angle(i)) * r];

  /** Draw `text` no wider than `maxWidth`, shrinking the font down to 9 px. */
  function fit(ctx, text, x, y, maxWidth, size, weight = 600) {
    for (let px = size; px >= 9; px--) {
      ctx.font = `${weight} ${px}px system-ui`;
      if (ctx.measureText(text).width <= maxWidth) break;
    }
    ctx.fillText(text, x, y);
  }

  /** Numbers read left to right, also on right-to-left pages. */
  function digits(ctx, text, x, y) {
    const before = ctx.direction;
    ctx.direction = 'ltr';
    ctx.fillText(text, x, y);
    ctx.direction = before;
  }

  /**
   * The whole picture. `view`: { count, grown(i) → 0…1, distance, knit, mode: 'path' | 'rumour' | 'still',
   * chain, pulse (hops travelled, or null), reach, round (or Infinity for the whole spread), curve }.
   */
  function scene(ctx, w, h, view) {
    const L = layout(w, h);
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, w, h);
    const glow = ctx.createRadialGradient(L.cx, L.cy, L.R * 0.2, L.cx, L.cy, L.R * 1.25);
    glow.addColorStop(0, 'rgba(255,148,120,0.07)');
    glow.addColorStop(1, 'rgba(255,148,120,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // The ring's friendships: everyone with the next person (one loop), and with the one after (two loops, through
    // the even and the odd places).
    ctx.strokeStyle = RING;
    ctx.lineWidth = 1;
    for (const [first, skip] of [
      [0, 1],
      [0, 2],
      [1, 2],
    ]) {
      ctx.beginPath();
      for (let i = first; i <= N + first; i += skip) {
        const [x, y] = at(L, i % N);
        if (i > first) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
      ctx.stroke();
    }

    // Shortcuts across the circle; the newest grows from one end and glows for a moment.
    for (let i = 0; i < view.count; i++) {
      const g = view.grown(i);
      const [a, b] = world.extra[i];
      const [ax, ay] = at(L, a),
        [bx, by] = at(L, b);
      const fresh = g < 1 ? 1 : 0;
      ctx.strokeStyle = fresh ? '#ffd2c2' : 'rgba(255,148,120,0.78)';
      ctx.lineWidth = fresh ? 2.6 : 1.5;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax + (bx - ax) * g, ay + (by - ay) * g);
      ctx.stroke();
    }

    // The chain from you to them, or the rumour spreading out from you.
    if (view.mode === 'rumour') {
      const reach = view.reach;
      const f = friendsNow();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255,211,110,0.75)';
      ctx.beginPath();
      for (let v = 0; v < N; v++) {
        if (reach[v] <= 0 || reach[v] > view.round) continue;
        // one friend who told them: the lowest-numbered friend one round nearer
        let from = -1;
        for (const u of f[v]) if (reach[u] === reach[v] - 1 && (from < 0 || u < from)) from = u;
        const [x0, y0] = at(L, from),
          [x1, y1] = at(L, v);
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
      }
      ctx.stroke();
    } else if (view.chain.length > 1) {
      ctx.strokeStyle = GOLD;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      view.chain.forEach((p, k) => {
        const [x, y] = at(L, p);
        if (k) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      });
      ctx.stroke();
    }

    // Everyone: plain dots, lit by the rumour when it's spreading.
    const most = Math.max(1, ...(view.mode === 'rumour' ? view.reach : [1]));
    for (let i = 0; i < N; i++) {
      const [x, y] = at(L, i);
      let fill = PERSON,
        r = L.dot;
      if (view.mode === 'rumour') {
        const d = view.reach[i];
        if (d <= view.round) {
          // warm near you, paler further out; the front is brightest
          const k = d / most;
          fill = d === view.round ? '#fff1c9' : `rgb(255,${Math.round(150 + 80 * k)},${Math.round(90 + 120 * k)})`;
          r = L.dot * (d === view.round ? 1.6 : 1.25);
        } else fill = 'rgba(150,165,190,0.55)';
      }
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
    }

    // The pulse travelling along the chain, counting handshakes as it goes.
    const small = Math.round(clamp(L.R * 0.075, 11, 15));
    if (view.mode !== 'rumour' && view.pulse !== null && view.chain.length > 1) {
      const hops = view.chain.length - 1;
      const k = Math.min(hops, view.pulse);
      const step = Math.min(hops - 1, Math.floor(k));
      const [x0, y0] = at(L, view.chain[step]),
        [x1, y1] = at(L, view.chain[step + 1]);
      const f = k - step;
      const px = x0 + (x1 - x0) * f,
        py = y0 + (y1 - y0) * f;
      ctx.fillStyle = 'rgba(255,240,200,0.25)';
      ctx.beginPath();
      ctx.arc(px, py, L.dot * 5, 0, TAU);
      ctx.fill();
      ctx.fillStyle = '#fff6dc';
      ctx.beginPath();
      ctx.arc(px, py, L.dot * 2.2, 0, TAU);
      ctx.fill();
      if (k < hops) {
        ctx.font = `700 ${small}px system-ui`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const out = Math.hypot(px - L.cx, py - L.cy) || 1;
        const lx = L.cx + ((px - L.cx) / out) * (out - L.dot * 7),
          ly = L.cy + ((py - L.cy) / out) * (out - L.dot * 7);
        ctx.fillStyle = '#fff6dc';
        digits(ctx, String(Math.floor(k) + 1), lx, ly);
      }
    }

    // You (gold, at the top) and them (blue), with the handshakes between you.
    const mark = (i, colour) => {
      const [x, y] = at(L, i);
      ctx.fillStyle = colour;
      ctx.beginPath();
      ctx.arc(x, y, L.dot * 2.4, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = BG;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      return [x, y];
    };
    const [yx, yy] = mark(YOU, GOLD);
    ctx.font = `700 ${small}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = GOLD;
    fit(ctx, t.labels.you, yx, yy - L.dot * 3.2, Math.max(40, L.R * 0.6), small, 700);
    if (view.mode !== 'rumour') {
      const [tx, ty] = mark(them, THEM);
      const hops = view.chain.length - 1;
      const arrived = view.pulse === null || view.pulse >= hops;
      if (arrived && hops > 0) {
        const a = angle(them);
        const lx = tx + Math.cos(a) * L.dot * 5,
          ly = ty + Math.sin(a) * L.dot * 5;
        ctx.textAlign = Math.cos(a) > 0.35 ? 'left' : Math.cos(a) < -0.35 ? 'right' : 'center';
        ctx.textBaseline = Math.sin(a) > 0.35 ? 'top' : Math.sin(a) < -0.35 ? 'bottom' : 'middle';
        ctx.font = `700 ${small + 2}px system-ui`;
        ctx.fillStyle = THEM;
        digits(ctx, String(hops), lx, ly);
      }
    }

    // The middle: the average distance, big, and how close-knit the neighbourhoods still are.
    const hole = ctx.createRadialGradient(L.cx, L.cy, 0, L.cx, L.cy, L.R * 0.62);
    hole.addColorStop(0, 'rgba(10,14,21,0.92)');
    hole.addColorStop(0.75, 'rgba(10,14,21,0.8)');
    hole.addColorStop(1, 'rgba(10,14,21,0)');
    ctx.fillStyle = hole;
    ctx.beginPath();
    ctx.arc(L.cx, L.cy, L.R * 0.62, 0, TAU);
    ctx.fill();
    const big = Math.round(clamp(L.R * 0.36, 26, 110));
    const caption = Math.round(clamp(L.R * 0.085, 11, 19));
    const inner = L.R * 1.05;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = INK;
    ctx.font = `700 ${big}px system-ui`;
    const top = L.cy - L.R * 0.08;
    digits(ctx, number(view.distance), L.cx, top);
    ctx.fillStyle = SOFT;
    fit(ctx, t.labels.apart, L.cx, top + caption * 1.45, inner, caption);
    fit(ctx, t.labels.onAverage, L.cx, top + caption * 2.65, inner, caption, 500);
    ctx.fillStyle = 'rgba(191,230,176,0.85)';
    const knitY = top + caption * 2.65 + L.R * 0.2;
    fit(ctx, t.labels.knit, L.cx, knitY, inner * 0.95, Math.max(10, caption - 2), 500);
    ctx.fillStyle = CLOSE;
    ctx.font = `700 ${Math.round(caption * 1.25)}px system-ui`;
    digits(ctx, percent(view.knit), L.cx, knitY + caption * 1.45);

    if (L.chart && view.curve) chartOf(ctx, L.chart, view);
  }

  /** How far apart and how close-knit, as shortcuts arrive, both compared with the plain ring. */
  function chartOf(ctx, box, view) {
    const { distance, knit } = view.curve;
    const size = Math.round(clamp(box.w / 22, 11, 15));
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.fillStyle = SOFT;
    let y = box.y + size + 4;
    fit(ctx, t.labels.chart, box.x, y, box.w, size + 1, 700);
    const legend = (colour, text) => {
      y += size * 1.6;
      ctx.fillStyle = colour;
      ctx.fillRect(box.x, y - size * 0.55, 14, 3);
      fit(ctx, text, box.x + 20, y, box.w - 20, size, 600);
    };
    legend(SHORT, t.labels.far);
    legend(CLOSE, t.labels.close);
    y += size * 1.5;
    ctx.fillStyle = 'rgba(185,195,211,0.75)';
    fit(ctx, t.labels.scale, box.x, y, box.w, size - 1, 500);

    const left = box.x + size * 2.6,
      right = box.x + box.w - 6,
      top = y + size * 1.4,
      bottom = box.y + box.h - size * 2.2;
    if (bottom - top < 60) return;
    const X = (c) => left + ((right - left) * c) / M.MOST;
    const Y = (v) => bottom - (bottom - top) * v;
    ctx.strokeStyle = 'rgba(120,140,172,0.35)';
    ctx.lineWidth = 1;
    ctx.font = `500 ${size - 1}px system-ui`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (const v of [0, 0.5, 1]) {
      ctx.beginPath();
      ctx.moveTo(left, Y(v));
      ctx.lineTo(right, Y(v));
      ctx.stroke();
      ctx.fillStyle = 'rgba(185,195,211,0.75)';
      digits(ctx, percent(v), left - 6, Y(v));
    }
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    digits(ctx, '0', left, bottom + 6);
    ctx.textAlign = 'right';
    fit(ctx, t.labels.axis(M.MOST), right, bottom + 6, (right - left) * 0.6, size - 1, 500);

    const line = (values, colour, from, to, width) => {
      ctx.strokeStyle = colour;
      ctx.lineWidth = width;
      ctx.beginPath();
      for (let c = from; c <= to; c++) {
        const v = values[c] / values[0];
        if (c > from) ctx.lineTo(X(c), Y(v));
        else ctx.moveTo(X(c), Y(v));
      }
      ctx.stroke();
    };
    // The whole way to 60, faint and dashed; the part reached so far, bright.
    ctx.setLineDash([4, 4]);
    line(distance, 'rgba(255,148,120,0.45)', 0, M.MOST, 1.5);
    line(knit, 'rgba(191,230,176,0.45)', 0, M.MOST, 1.5);
    ctx.setLineDash([]);
    line(distance, SHORT, 0, view.count, 2.6);
    line(knit, CLOSE, 0, view.count, 2.6);
    ctx.strokeStyle = 'rgba(255,244,234,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(X(view.count), top);
    ctx.lineTo(X(view.count), bottom);
    ctx.stroke();
    for (const [values, colour] of [
      [distance, SHORT],
      [knit, CLOSE],
    ]) {
      ctx.fillStyle = colour;
      ctx.beginPath();
      ctx.arc(X(view.count), Y(values[view.count] / values[0]), 4.5, 0, TAU);
      ctx.fill();
    }
    ctx.fillStyle = INK;
    ctx.font = `700 ${size}px system-ui`;
    ctx.textAlign = X(view.count) > right - 20 ? 'right' : X(view.count) < left + 20 ? 'left' : 'center';
    ctx.textBaseline = 'bottom';
    digits(ctx, String(view.count), X(view.count), top - 3);
  }

  /** Everything the picture needs, from the room's state. */
  function viewOf(s, stage, w, h) {
    ensure(s.seed);
    const playing = stage.playing;
    const { distance, knit } = measure(shown);
    const L = layout(w, h);
    let curve = null;
    if (L.chart) {
      for (let c = 0; c <= M.MOST; c++) measure(c);
      curve = world;
    }
    const mode = s.rumour ? 'rumour' : 'path';
    const hops = chainNow().length - 1;
    const elapsed = time - since;
    return {
      count: shown,
      grown: (i) => (playing ? clamp((time - (born[i] ?? -9)) / 0.45, 0, 1) : 1),
      distance: playing && display !== null ? display : distance,
      knit,
      mode,
      chain: chainNow(),
      pulse: playing && mode === 'path' ? Math.min(hops, elapsed / HOP) : null,
      reach: mode === 'rumour' ? reachNow() : null,
      round: mode === 'rumour' && playing ? Math.floor(elapsed / ROUND) : Infinity,
      curve,
    };
  }

  /** Show the setting's number of shortcuts at once (paused, reduced motion, or fewer than before). */
  function catchUp(s) {
    ensure(s.seed);
    if (shown > s.shortcuts) shown = s.shortcuts;
    while (shown < s.shortcuts) born[shown++] = -9;
    display = measure(shown).distance;
    since = time;
  }

  function readouts(s) {
    if (!world) return;
    let text;
    if (s.rumour) {
      const reach = reachNow();
      const last = Math.max(...reach);
      const round = W.stage.playing ? Math.floor((time - since) / ROUND) : Infinity;
      text =
        round >= last ? t.status.everyone(last) : t.status.spreading(reach.filter((d) => d <= round).length, round);
    } else text = t.status.path(chainNow().length - 1);
    const el = $('scene-status');
    if (el && el.textContent !== text) el.textContent = text;
  }

  /** Move the slider to the setting, as when a button changes it. */
  function showSetting(s, stage) {
    const input = $('c-shortcuts');
    if (input) input.value = s.shortcuts;
    stage.setChosen(-1);
    stage.sync();
  }

  function addShortcut(s, stage) {
    opening = false;
    if (s.shortcuts >= M.MOST) return;
    s.shortcuts += 1;
    if (!stage.playing) catchUp(s);
    else if (shown === s.shortcuts - 1) wait = Math.min(wait, 0);
    showSetting(s, stage);
    stage.draw();
  }

  function choose(i, s, stage) {
    const next = ((i % N) + N) % N;
    if (next === YOU) return;
    them = next;
    if (s.rumour) {
      s.rumour = false;
      const box = document.querySelector('#scene-controls [data-check="rumour"]');
      if (box) box.checked = false;
    }
    since = time;
    readouts(s);
    stage.draw();
  }

  W.defineRoom({
    id: 'handshakes',
    symbol: '⋈',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'signals',
    added: '2026-10-07',
    tagline: t.tagline,
    accent: { background: '#2b1d19', border: SHORT, color: '#ffd2c2' },

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
    connection: { ...t.connection, go: 'fireflies' },

    defaults: { shortcuts: 5, seed: 24, rumour: false },
    ranges: { shortcuts: [0, M.MOST, 'integer'], seed: [1, 9999, 'integer'] },
    defaultPreset: 1,
    presets: [
      { settings: { shortcuts: 0, rumour: false } },
      { settings: { shortcuts: 5, rumour: false } },
      { settings: { shortcuts: 20, rumour: true } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        color: '#ffb48a',
        sketch: { hairStyle: 'swept', hair: '#2b2018', skin: '#efcfae', brows: 'bold', backdrop: '#2b1d19' },
      },
      {
        ...t.guests[1],
        color: '#a9c6f0',
        sketch: { hairStyle: 'receding', hair: '#3a2c22', skin: '#f0cfae', beard: 'full', backdrop: '#1c2635' },
      },
    ],

    insight: t.insight,

    controls: (s, stage) =>
      stage.slider('shortcuts', t.shortcuts, 0, M.MOST, 1, s.shortcuts) + stage.check('rumour', t.rumour, s.rumour),

    bindControls(panel, s, stage) {
      panel.querySelector('[data-check="rumour"]')?.addEventListener('change', () => {
        since = time;
        readouts(s);
        stage.draw();
      });
    },
    readouts,

    onInput(s, stage) {
      opening = false;
      if (!stage.playing || s.shortcuts < shown) catchUp(s);
    },
    onPreset(s, stage) {
      opening = false;
      since = time;
      if (!stage.playing || s.shortcuts < shown) catchUp(s);
    },

    preview(ctx, width, height) {
      // The opening world with its five shortcuts, without disturbing a room that's open.
      const kept = { world, shown, listsFor, chainFor, reachFor, lists, chain, reach };
      world = null;
      ensure(24);
      shown = 5;
      if (layout(width, height).chart) for (let c = 0; c <= M.MOST; c++) measure(c);
      scene(ctx, width, height, {
        count: 5,
        grown: () => 1,
        distance: measure(5).distance,
        knit: measure(5).knit,
        mode: 'path',
        chain: chainNow(),
        pulse: null,
        reach: null,
        round: Infinity,
        curve: world,
      });
      ({ world, shown, listsFor, chainFor, reachFor, lists, chain, reach } = kept);
    },

    enter(s, stage) {
      ensure(s.seed);
      if (!entered) {
        // The first visit opens on the plain ring; the shortcuts then arrive one by one.
        entered = true;
        opening = true;
        shown = 0;
        born = [];
        wait = 1.4;
        display = measure(0).distance;
        since = time;
      }
      if (!stage.playing) catchUp(s);
      readouts(s);
      stage.draw();
    },

    step(dt, s) {
      time += dt;
      ensure(s.seed);
      if (shown > s.shortcuts) catchUp(s);
      if (shown < s.shortcuts) {
        wait -= dt;
        if (wait <= 0) {
          born[shown] = time;
          shown += 1;
          wait = opening && shown < 5 ? FIRST : LATER;
          if (!s.rumour) since = time; // the pulse sets off again along the new, shorter chain
        }
      } else {
        wait = Math.max(wait, 0);
        opening = false;
      }
      const target = measure(shown).distance;
      display = display === null ? target : display + (target - display) * Math.min(1, dt * 5);
      // Say it once the shortcuts have caught up with the setting and the number has settled.
      if (shown === s.shortcuts && told !== shown && Math.abs(display - target) < 0.05) {
        told = shown;
        W.announce(t.announce(shown, number(target)));
      }
      // The pulse and the rumour start over once they have arrived, after a pause.
      const elapsed = time - since;
      if (s.rumour) {
        if (elapsed > (Math.max(...reachNow()) + 1) * ROUND + 1.6) since = time;
      } else if (elapsed > (chainNow().length - 1) * HOP + 1.4) since = time;
      readouts(s);
    },

    draw(ctx, s, stage) {
      scene(ctx, stage.width, stage.height, viewOf(s, stage, stage.width, stage.height));
    },

    action(s, stage) {
      addShortcut(s, stage);
    },

    reset(s, stage) {
      // A plain ring again, with new strangers waiting to meet.
      s.shortcuts = 0;
      s.seed = (s.seed % 9999) + 1;
      opening = false;
      ensure(s.seed);
      shown = 0;
      born = [];
      told = -1;
      display = measure(0).distance;
      wait = 0.8;
      since = time;
      showSetting(s, stage);
      stage.draw();
    },

    pointer: {
      down(p, s, stage, e) {
        if (e && e.button > 0) return;
        const L = layout(stage.width, stage.height);
        const x = p.x * stage.width - L.cx,
          y = p.y * stage.height - L.cy;
        if (Math.abs(Math.hypot(x, y) - L.R) > Math.max(22, L.R * 0.16)) return;
        const turn = (Math.atan2(y, x) + Math.PI / 2 + TAU) % TAU;
        choose(Math.round((turn / TAU) * N), s, stage);
      },
      arrow(dx, dy, s, stage) {
        // Left and right walk round the ring; up and down jump ten people.
        let next = them + dx + dy * 10;
        if (((next % N) + N) % N === YOU) next += dx + dy || 1;
        choose(next, s, stage);
      },
      key(e, s, stage) {
        if (e.key !== '+' && e.key !== '=') return false;
        addShortcut(s, stage);
        return true;
      },
    },
  });
})();
