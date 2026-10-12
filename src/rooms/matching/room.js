/* Room · Who asks wins: stable matching, where the side that asks gets its best stable partners. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, TAU, clamp } = W;
  const M = W.models.matching;
  const t = W.text('matching');
  const reduced = W.prefersReducedMotion();
  const N = M.N;

  const RATES = [0.45, 0.7, 1, 1.5, 2.3]; // how fast a round goes, per speed
  const FLY = 0.85; // seconds for applications to cross
  const DECIDE = 0.6; // seconds for the answers (a kept offer, a red line sent back)
  const HOLD = 3.4; // seconds the result stays before the other side asks, with "Keep swapping who asks"
  const MAX_SEED = 9999; // shuffled wishes are numbered from 3 (0 to 2 are the presets) to this
  // Students are colours (with their numbers); clubs are shapes. Each wish list is a row of the other side's marks.
  const COLOURS = ['#e8695a', '#f0a640', '#e3cf4a', '#5cbf7a', '#55a5e8', '#b58ce8'];
  const SHAPES = ['triangle', 'square', 'diamond', 'star', 'plus', 'ring'];
  const IVORY = '#efe6cf',
    PLATE = '#1e2636',
    RED = '#ff5d55',
    MUTED = '#98aab7',
    INK = '#e8eef5';

  let w = null, // everyone's wishes
    wid = -1, // the number they came from
    all = null, // every stable pairing (student → club), worked out when first needed
    marks = null, // each person's stable partners
    results = null, // { false: students asking, true: clubs asking }: M.defer, turned round to student → club
    shown = { false: false, true: false }, // which results the scoreboard shows yet
    run = null, // { clubs, round, phase: 'fly' | 'decide' | 'done', t }
    partner = null, // the pairing on show once a run is done or the visitor pairs by hand (student → club)
    edited = false, // paired by hand since the last run?
    picked = -1, // a person tapped first (0–5 students, 6–11 clubs), waiting for a partner
    aim = null, // keyboard aim, a person
    hover = -1,
    pending = -1, // the person a press started on
    lastPoint = null,
    told = '',
    layout = null;

  // ----------------------------------------------------------------- state

  /** New wishes: work out both results now (they're instant); stable pairings wait until they're needed. */
  function load(id) {
    wid = id;
    w = M.wishes(id);
    all = null;
    marks = null;
    const students = M.defer(w.students, w.clubs),
      clubs = M.defer(w.clubs, w.students);
    results = {
      false: { ...students, pairs: students.partner },
      true: { ...clubs, pairs: M.invert(clubs.partner) },
    };
    shown = { false: false, true: false };
  }

  const stablePairings = () => (all ??= M.allStable(w));
  const stableMarks = () => (marks ??= M.stablePartners(w, stablePairings()));

  /** Start the asking from round 1, or jump to its end when nothing moves by itself. */
  function begin(s, stage) {
    if (wid !== s.wishes) load(s.wishes);
    edited = false;
    picked = -1;
    run = { clubs: s.clubs, round: 0, phase: 'fly', t: 0 };
    partner = null;
    told = '';
    if (reduced || !stage.playing) finish();
    if (reduced) shown = { false: true, true: true }; // a still picture shows both results at once
  }

  function finish() {
    run.phase = 'done';
    run.round = results[run.clubs].rounds.length - 1;
    run.t = 0;
    partner = [...results[run.clubs].pairs];
    shown[run.clubs] = true;
  }

  /** Move the asking on by dt seconds of its own time. */
  function advance(dt, s) {
    if (!run || edited) return;
    run.t += dt;
    const rounds = results[run.clubs].rounds;
    if (run.phase === 'fly' && run.t >= FLY) {
      run.phase = 'decide';
      run.t -= FLY;
    }
    if (run.phase === 'decide' && run.t >= DECIDE) {
      run.t -= DECIDE;
      if (run.round + 1 < rounds.length) {
        run.round++;
        run.phase = 'fly';
      } else finish();
    }
    if (run.phase === 'done' && s.swap && run.t >= HOLD) {
      s.clubs = !s.clubs;
      begin(s, W.stage);
    }
  }

  /** Who is holding whom right now: taker → asker, for the round on show (−1 for nobody). */
  function holding() {
    const rounds = results[run.clubs].rounds;
    if (run.phase === 'done') return rounds[rounds.length - 1].held;
    if (run.phase === 'decide') return rounds[run.round].held;
    return run.round ? rounds[run.round - 1].held : new Array(N).fill(-1);
  }

  /** The pairs on show as student → club (−1 where a student has nobody yet), and whether they are settled. */
  function pairsNow() {
    if (edited || run.phase === 'done') return { pairs: partner, settled: true };
    const held = holding(),
      pairs = new Array(N).fill(-1);
    held.forEach((a, b) => {
      if (a < 0) return;
      if (run.clubs) pairs[b] = a;
      else pairs[a] = b;
    });
    return { pairs, settled: false };
  }

  /** The applications turned down so far, for each asker: a set of takers. */
  function refused() {
    const rounds = results[run.clubs].rounds;
    const last = run.phase === 'fly' ? run.round - 1 : run.round;
    const out = Array.from({ length: N }, () => new Set());
    for (let r = 0; r <= last; r++) for (const [a, b] of rounds[r].dropped) out[a].add(b);
    return out;
  }

  /** Pair student s with club c by hand; their old partners pair up with each other. */
  function pairByHand(s, c, settings, stage) {
    if (run.phase !== 'done' && !edited) finish();
    if (partner[s] === c) return;
    partner = M.pair(partner, s, c);
    edited = true;
    if (settings.swap) {
      // The visitor is in charge now: stop the automatic swapping, which would undo their pairing.
      settings.swap = false;
      const box = document.querySelector('#scene-controls [data-check="swap"]');
      if (box) box.checked = false;
    }
    stage.setChosen(-1);
    stage.sync();
  }

  // ---------------------------------------------------------------- words

  const number = (v) => new Intl.NumberFormat(W.numberLocale, { maximumFractionDigits: 1 }).format(v);

  function statusText() {
    if (edited) {
      const k = M.blocking(w, partner).length;
      if (k) return t.status.unstable(k);
      const extreme = M.same(partner, results.false.pairs) || M.same(partner, results.true.pairs);
      return extreme ? t.status.stable : t.status.stableNew;
    }
    if (run.phase !== 'done')
      return t.status.round(run.clubs, run.round + 1, results[run.clubs].rounds[run.round].asks.length);
    const askers = run.clubs ? w.clubs : w.students,
      mine = run.clubs ? M.invert(partner) : partner;
    return t.status.done(run.clubs, M.choices(askers, mine).filter((k) => k === 1).length);
  }

  function report(s) {
    const words = statusText();
    if ($('scene-status').textContent !== words) $('scene-status').textContent = words;
    const name = wid < M.PROFILES ? t.sceneNames[wid] : t.shuffledName;
    if ($('scene-name').textContent !== name) $('scene-name').textContent = name;
    const final = edited || run.phase === 'done';
    if (final && words !== told && W.stage.isShowing(room)) {
      told = words;
      W.announce(words);
    } else if (!final) told = '';
  }

  // --------------------------------------------------------------- layout

  /**
   * Six rows: a student (circle) and their wish list on the left, a club (shape) and its wish list on the right, and
   * lines for the pairs between them. Both lists read best first, left to right. Above the lists, the scoreboard
   * lines up with them: how far down their lists each side got, on average, for each way of asking (it sits at the
   * top so that a laptop shows it without scrolling).
   */
  function measure(width, height) {
    const phone = width < 600;
    const pad = phone ? 6 : 14;
    const band = phone ? 14 : 34;
    const slotH = phone ? clamp(height * 0.048, 11, 15) : clamp(height * 0.045, 22, 34);
    const scoreY = pad + band;
    const top = scoreY + 3 * slotH + (phone ? 2 : 6);
    const rowH = (height - top - pad) / N;
    let R = clamp(rowH * 0.3, 8, 24),
      b = clamp(rowH * 0.3, 8, 22);
    // Leave the lines at least a quarter of the width.
    while (b > 8 && 2 * (pad + 2 * R + R * 0.5 + 4 + 6 * b * 1.28 + 6) > width * 0.75) {
      b -= 0.5;
      R = Math.max(8, R - 0.4);
    }
    const g = b * 0.28,
      list = 6 * b + 5 * g,
      gap = R * 0.5 + 4;
    const sx = pad + R,
      sl = sx + R + gap,
      cl = width - pad - list,
      cx = cl - gap - R;
    // The first and last people sit close to the edges of the rows' space, the rest evenly between.
    const edge = R + 4,
      step = (height - top - pad - 2 * edge) / (N - 1);
    return {
      phone,
      pad,
      top,
      band,
      rowH,
      R,
      b,
      g,
      list,
      sx,
      sl,
      sa: sl + list + 6, // where a student's lines start
      cx,
      cl,
      ca: cx - R - 6, // where a club's lines end
      y: (i) => top + edge + step * i,
      step,
      score: { y: scoreY, slotH },
      width,
      height,
    };
  }

  /** The x of place k (0 for the favourite) on a list starting at x0. */
  const slot = (L, x0, k) => x0 + k * (L.b + L.g) + L.b / 2;

  /** Canvas point (unit coordinates) → the person under it: 0–5 a student, 6–11 a club, −1 nobody. */
  function personAt(p, stage) {
    if (!layout) return -1;
    const L = layout;
    const x = p.x * stage.width,
      y = p.y * stage.height;
    const row = Math.round((y - L.y(0)) / L.step);
    if (row < 0 || row >= N || Math.abs(y - L.y(row)) > L.step / 2 + 2) return -1;
    if (x <= L.sa) return row;
    if (x >= L.ca) return N + row;
    return -1;
  }

  // -------------------------------------------------------------- drawing

  /** A club's shape, centred at (x, y) and r across, in the current fill. */
  function shape(ctx, kind, x, y, r) {
    ctx.beginPath();
    if (kind === 'triangle') {
      ctx.moveTo(x, y - r);
      ctx.lineTo(x + r * 0.95, y + r * 0.75);
      ctx.lineTo(x - r * 0.95, y + r * 0.75);
    } else if (kind === 'square') ctx.rect(x - r * 0.78, y - r * 0.78, r * 1.56, r * 1.56);
    else if (kind === 'diamond') {
      ctx.moveTo(x, y - r);
      ctx.lineTo(x + r * 0.8, y);
      ctx.lineTo(x, y + r);
      ctx.lineTo(x - r * 0.8, y);
    } else if (kind === 'star')
      for (let k = 0; k < 10; k++) {
        const a = -Math.PI / 2 + (k * Math.PI) / 5,
          rr = k % 2 ? r * 0.45 : r;
        ctx[k ? 'lineTo' : 'moveTo'](x + rr * Math.cos(a), y + rr * Math.sin(a) + r * 0.08);
      }
    else if (kind === 'plus') {
      const a = r * 0.34;
      ctx.moveTo(x - a, y - r);
      for (const [dx, dy] of [
        [a, -r],
        [a, -a],
        [r, -a],
        [r, a],
        [a, a],
        [a, r],
        [-a, r],
        [-a, a],
        [-r, a],
        [-r, -a],
        [-a, -a],
      ])
        ctx.lineTo(x + dx, y + dy);
    } else {
      // A ring: drawn as a thick circle outline.
      ctx.arc(x, y, r * 0.86, 0, TAU);
      ctx.arc(x, y, r * 0.42, 0, TAU, true);
    }
    ctx.closePath();
    ctx.fill('evenodd');
  }

  /** A student: a coloured disc with their number. */
  function student(ctx, s, x, y, r, alpha = 1) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = COLOURS[s];
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
    if (r >= 6.5) {
      ctx.fillStyle = '#0a0e15';
      ctx.font = `700 ${Math.round(r * 1.05)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(s + 1), x, y + r * 0.06);
    }
    ctx.globalAlpha = 1;
  }

  /** A club: its shape on a dark plate. */
  function club(ctx, c, x, y, r, alpha = 1) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = PLATE;
    roundRect(ctx, x - r, y - r, 2 * r, 2 * r, r * 0.3);
    ctx.fill();
    ctx.fillStyle = IVORY;
    shape(ctx, SHAPES[c], x, y, r * 0.66);
    ctx.globalAlpha = 1;
  }

  function roundRect(ctx, x, y, w2, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w2, y, x + w2, y + h, r);
    ctx.arcTo(x + w2, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w2, y, r);
    ctx.closePath();
  }

  /**
   * One person's wish list, best first: the other side's marks, with their partner ringed (dashed while it is only
   * held), the ones that turned them down struck out, and dots under their stable partners.
   */
  function wishList(ctx, L, list, x0, y, isStudent, mate, settled, struck, dots) {
    const b = L.b;
    list.forEach((other, k) => {
      const x = slot(L, x0, k);
      const alpha = struck?.has(other) ? 0.3 : 1;
      if (isStudent) club(ctx, other, x, y, b / 2, alpha);
      else student(ctx, other, x, y, b / 2, alpha);
      if (struck?.has(other)) {
        ctx.strokeStyle = RED;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(x - b * 0.45, y + b * 0.45);
        ctx.lineTo(x + b * 0.45, y - b * 0.45);
        ctx.stroke();
      }
      if (other === mate) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.8;
        ctx.setLineDash(settled ? [] : [3, 2]);
        roundRect(ctx, x - b / 2 - 3, y - b / 2 - 3, b + 6, b + 6, 4);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      if (dots?.has(other)) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y + b / 2 + 5.5, Math.max(1.6, b * 0.1), 0, TAU);
        ctx.fill();
      }
    });
  }

  /** A line from student s's row to club c's row. */
  function link(ctx, L, s, c, colour, width, dash = []) {
    ctx.strokeStyle = colour;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(L.sa, L.y(s));
    ctx.lineTo(L.ca, L.y(c));
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function draw(ctx, s, stage) {
    const { width, height } = stage;
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    if (!run) return;
    ctx.direction = 'ltr';
    const L = (layout = measure(width, height));
    header(ctx, L);
    const { pairs, settled } = pairsNow();
    const back = new Array(N).fill(-1);
    pairs.forEach((c, st) => c >= 0 && (back[c] = st));

    // Lines: the pairs, then blocking pairs (by hand), or the applications and answers of this round.
    pairs.forEach((c, st) => c >= 0 && link(ctx, L, st, c, COLOURS[st], settled ? 3 : 2, settled ? [] : [6, 4]));
    if (edited) for (const [st, c] of M.blocking(w, partner)) link(ctx, L, st, c, RED, 2, [5, 4]);
    else if (run.phase !== 'done') flight(ctx, L);

    // People and their lists.
    const struck = edited || run.phase === 'done' ? null : refused();
    const dots = s.marks ? stableMarks() : null;
    const studentsStruck = run.clubs ? null : struck,
      clubsStruck = run.clubs ? struck : null;
    for (let i = 0; i < N; i++) {
      const y = L.y(i);
      student(ctx, i, L.sx, y, L.R);
      wishList(ctx, L, w.students[i], L.sl, y, true, pairs[i], settled, studentsStruck?.[i], dots?.students[i]);
      club(ctx, i, L.cx, y, L.R);
      wishList(ctx, L, w.clubs[i], L.cl, y, false, back[i], settled, clubsStruck?.[i], dots?.clubs[i]);
    }
    rings(ctx, L);
    scoreboard(ctx, L);
    report(s);
  }

  /** The top band: STUDENTS, the scoreboard's title, CLUBS, and (on wide pictures) 1st and 6th over the lists. */
  function header(ctx, L) {
    const y = L.pad + (L.phone ? 6 : 8);
    ctx.textBaseline = 'middle';
    ctx.font = `600 ${L.phone ? 9 : 12}px system-ui, sans-serif`;
    ctx.fillStyle = MUTED;
    ctx.textAlign = 'left';
    ctx.fillText(t.labels.students, L.sx - L.R, y, L.sa - L.sx);
    ctx.textAlign = 'right';
    ctx.fillText(t.labels.clubs, L.width - L.pad, y, L.width - L.ca);
    ctx.textAlign = 'center';
    ctx.fillText(t.score.title, (L.sa + L.ca) / 2, y, L.ca - L.sa - 8);
    if (L.phone) return;
    ctx.font = '400 11px system-ui, sans-serif';
    for (const x0 of [L.sl, L.cl]) {
      ctx.textAlign = 'left';
      ctx.fillText(t.score.first, x0, y + 17, L.list / 2);
      ctx.textAlign = 'right';
      ctx.fillText(t.score.last, x0 + L.list, y + 17, L.list / 2);
    }
  }

  /** An arrow at (x, y) pointing right (dir 1) or left (dir −1), the way the applications go. */
  function arrow(ctx, x, y, dir, len) {
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - (dir * len) / 2, y);
    ctx.lineTo(x + (dir * len) / 2, y);
    ctx.moveTo(x + (dir * len) / 2 - dir * 5, y - 4);
    ctx.lineTo(x + (dir * len) / 2, y);
    ctx.lineTo(x + (dir * len) / 2 - dir * 5, y + 4);
    ctx.stroke();
  }

  /** This round's applications in flight, or the ones sent back, fading in red. */
  function flight(ctx, L) {
    const round = results[run.clubs].rounds[run.round];
    if (run.phase === 'fly') {
      const u = clamp(run.t / FLY, 0, 1),
        e = u * u * (3 - 2 * u);
      for (const [a, b] of round.asks) {
        const [st, c] = run.clubs ? [b, a] : [a, b];
        link(ctx, L, st, c, 'rgba(232, 238, 245, 0.18)', 1);
        const from = run.clubs ? [L.ca, L.y(c)] : [L.sa, L.y(st)],
          to = run.clubs ? [L.sa, L.y(st)] : [L.ca, L.y(c)];
        const x = from[0] + (to[0] - from[0]) * e,
          y = from[1] + (to[1] - from[1]) * e;
        const r = Math.max(6, L.R * 0.42);
        if (run.clubs) club(ctx, c, x, y, r);
        else student(ctx, st, x, y, r);
      }
    } else {
      const fade = 1 - clamp(run.t / DECIDE, 0, 1);
      ctx.globalAlpha = fade;
      for (const [a, b] of round.dropped) {
        const [st, c] = run.clubs ? [b, a] : [a, b];
        link(ctx, L, st, c, RED, 2.5);
        // A cross where the answer came from.
        const [x, y] = run.clubs ? [L.sa + 10, L.y(st)] : [L.ca - 10, L.y(c)];
        ctx.strokeStyle = RED;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x - 5, y - 5);
        ctx.lineTo(x + 5, y + 5);
        ctx.moveTo(x + 5, y - 5);
        ctx.lineTo(x - 5, y + 5);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  }

  /** The person picked first, the one under the mouse, and the keyboard's aim. */
  function rings(ctx, L) {
    const at = (p) => [p < N ? L.sx : L.cx, L.y(p % N)];
    const ring = (p, colour, width, dash) => {
      const [x, y] = at(p);
      ctx.strokeStyle = colour;
      ctx.lineWidth = width;
      ctx.setLineDash(dash);
      ctx.beginPath();
      ctx.arc(x, y, L.R + 5, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);
    };
    if (hover >= 0 && hover !== picked) ring(hover, 'rgba(255, 255, 255, 0.5)', 1.5, []);
    if (picked >= 0) ring(picked, '#f3dca6', 3, []);
    if (aim !== null) ring(aim, '#ffffff', 2, [4, 3]);
  }

  /**
   * Over the lists: for each way of asking, how far down their lists each side got on average, as a marker over six
   * cells that line up with the six places on the lists below (1st choice on the left). The way of asking on show is
   * bright, with an arrow the way the applications go; a pairing made by hand gets a third row.
   */
  function scoreboard(ctx, L) {
    const rows = [
      [t.labels.studentsAsk, shown.false ? results.false.pairs : null, !edited && !run.clubs, 1],
      [t.labels.clubsAsk, shown.true ? results.true.pairs : null, !edited && run.clubs, -1],
    ];
    if (edited) rows.push([t.labels.yours, partner, true, 0]);
    const { y: y0, slotH } = L.score;
    const cellH = L.phone ? Math.min(8, slotH * 0.62) : Math.min(14, slotH * 0.45);
    const mid = (L.sa + L.ca) / 2,
      room = L.ca - L.sa - 8;
    ctx.textBaseline = 'middle';
    rows.forEach(([label, pairs, current, dir], k) => {
      const y = y0 + slotH * (k + 0.5);
      ctx.font = `${current ? 700 : 500} ${L.phone ? 10 : current ? 16 : 13}px system-ui, sans-serif`;
      ctx.fillStyle = current ? (dir ? INK : '#f3dca6') : MUTED;
      ctx.strokeStyle = ctx.fillStyle;
      ctx.textAlign = 'center';
      const len = L.phone ? 9 : 14,
        shift = current && dir ? -dir * (len / 2 + 4) : 0,
        fit = room - (current && dir ? len + 8 : 0);
      ctx.fillText(label, mid + shift, y, fit);
      if (current && dir) {
        const half = Math.min(ctx.measureText(label).width, fit) / 2;
        arrow(ctx, mid + shift + dir * (half + 6 + len / 2), y, dir, len);
      }
      meter(ctx, L, L.sl, y, cellH, pairs && M.average(w.students, pairs), L.sx, current);
      meter(ctx, L, L.cl, y, cellH, pairs && M.average(w.clubs, M.invert(pairs)), L.cx, current);
    });
  }

  /** Six cells over a list, a marker at the average place, and the number beside it (over the people). */
  function meter(ctx, L, x0, y, h, average, numberX, current) {
    ctx.strokeStyle = current ? 'rgba(232, 238, 245, 0.45)' : 'rgba(152, 170, 183, 0.3)';
    ctx.lineWidth = 1;
    for (let k = 0; k < 6; k++) {
      const x = slot(L, x0, k);
      ctx.strokeRect(x - L.b / 2 + 0.5, y - h / 2 + 0.5, L.b - 1, h - 1);
    }
    if (average == null) return;
    const x = slot(L, x0, 0) + ((average - 1) / 5) * (slot(L, x0, 5) - slot(L, x0, 0));
    ctx.fillStyle = current ? '#f3dca6' : '#b9c4cf';
    ctx.beginPath();
    ctx.arc(x, y, Math.max(3, h * 0.55), 0, TAU);
    ctx.fill();
    ctx.font = `${current ? 700 : 500} ${L.phone ? 9 : 13}px system-ui, sans-serif`;
    ctx.fillStyle = current ? INK : MUTED;
    ctx.textAlign = 'center';
    ctx.fillText(number(average), numberX, y, 2 * L.R + 8);
  }

  /** The home card: the tangled wishes after the students have asked, the people and lines in the middle square. */
  function preview(ctx, width, height) {
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    const wishes = M.wishes(0);
    const pairs = M.defer(wishes.students, wishes.clubs).partner;
    const side = Math.min(width, height),
      x0 = (width - side) / 2;
    const rowH = side / N,
      R = rowH * 0.32,
      b = rowH * 0.3,
      g = b * 0.28;
    const L = { b, g, y: (i) => (height - side) / 2 + rowH * (i + 0.5) };
    const sx = x0 + R + 6,
      cx = x0 + side - R - 6;
    pairs.forEach((c, s) => {
      ctx.strokeStyle = COLOURS[s];
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(sx + R + 2, L.y(s));
      ctx.lineTo(cx - R - 2, L.y(c));
      ctx.stroke();
    });
    const back = M.invert(pairs);
    for (let i = 0; i < N; i++) {
      student(ctx, i, sx, L.y(i), R);
      club(ctx, i, cx, L.y(i), R);
      const list = 6 * b + 5 * g;
      if (x0 - list - 8 >= 0) {
        wishList(ctx, L, wishes.students[i], x0 - list - 6, L.y(i), true, pairs[i], true);
        wishList(ctx, L, wishes.clubs[i], x0 + side + 6, L.y(i), false, back[i], true);
      }
    }
  }

  // ---------------------------------------------------------------- input

  /** A tap on a person: pick them, or pair them with the person picked on the other side. */
  function tap(p, s, stage) {
    if (p < 0) picked = -1;
    else if (picked < 0 || picked < N === p < N) picked = p === picked ? -1 : p;
    else {
      const [st, c] = p < N ? [p, picked - N] : [picked, p - N];
      picked = -1;
      pairByHand(st, c, s, stage);
    }
    stage.draw();
  }

  // ----------------------------------------------------------------- room

  const defaults = { wishes: 0, clubs: false, swap: true, marks: false, speed: 3 };
  const presetSettings = [
    { wishes: 0, clubs: false },
    { wishes: 1, clubs: false },
    { wishes: 2, clubs: false },
  ];
  const badges = ['⇄', '≡', '⇆'];

  const room = W.defineRoom({
    id: 'matching',
    symbol: '⚭',
    theme: 'games',
    added: '2026-10-07',
    eyebrow: t.eyebrow,
    name: t.name,
    tagline: t.tagline,
    accent: { background: '#1c2030', border: '#f0a640', color: '#f7d6a0' },

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
    connection: { ...t.connection, go: 'stopping' },

    defaults,
    ranges: { wishes: [0, MAX_SEED, 'integer'], speed: [1, RATES.length, 'integer'] },
    defaultPreset: 0,
    presets: t.presets.map((p, i) => ({ ...p, badge: badges[i], settings: presetSettings[i] })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Gale',
        color: '#f0a640',
        sketch: {
          hairStyle: 'receding',
          hair: '#d8d2c6',
          skin: '#efcdb0',
          glasses: 'square',
          brows: 'bold',
          backdrop: '#1c2030',
        },
      },
      {
        ...t.guests[1],
        color: '#55a5e8',
        sketch: { hairStyle: 'swept', hair: '#e4e0d8', skin: '#f0d0b4', glasses: 'round', backdrop: '#1b2433' },
      },
      {
        ...t.guests[2],
        color: '#5cbf7a',
        sketch: { hairStyle: 'bald', hair: '#9a9288', skin: '#ecc9a8', beard: 'short', backdrop: '#1d2a24' },
      },
    ],

    insight: t.insight,

    controls: (s, stage) =>
      stage.slider('speed', t.speed, 1, RATES.length, 1, s.speed) +
      stage.check('swap', t.swap, s.swap) +
      stage.check('marks', t.marks, s.marks) +
      `<button class="button wide matching-shuffle" id="matching-shuffle" type="button">${t.shuffle}</button>` +
      `<p class="matching-count" id="matching-count"></p>`,

    bindControls(panel, s, stage) {
      $('matching-shuffle').addEventListener('click', () => {
        let id;
        do id = M.PROFILES + Math.floor(Math.random() * (MAX_SEED - M.PROFILES + 1));
        while (id === wid);
        s.wishes = id;
        load(id);
        begin(s, stage);
        stage.setChosen(-1);
        stage.sync();
        stage.draw();
      });
      panel.querySelector('[data-check="swap"]').addEventListener('change', (e) => {
        if (!run) return;
        // Swapping again takes over from a pairing made by hand; otherwise a full pause comes before the other side asks.
        if (e.target.checked && edited) begin(s, stage);
        else if (run.phase === 'done') run.t = 0;
        stage.draw();
      });
    },

    readouts(s) {
      if (wid !== s.wishes || !w) return;
      $('matching-count').textContent = t.count(stablePairings().length);
    },

    enter(s, stage) {
      aim = null;
      hover = -1;
      pending = -1;
      begin(s, stage);
      stage.sync();
      stage.draw();
    },

    step(dt, s) {
      advance(dt * RATES[s.speed - 1], s);
    },

    draw,
    preview,

    action(s, stage) {
      s.clubs = !s.clubs;
      begin(s, stage);
      stage.setChosen(-1);
      stage.sync();
      stage.draw();
    },
    reset(s, stage) {
      begin(s, stage);
      stage.draw();
    },
    onPreset(s, stage) {
      begin(s, stage);
      stage.sync();
      stage.draw();
    },

    pointer: {
      down(p, s, stage, e) {
        pending = e && e.button > 0 ? -1 : personAt(p, stage);
        lastPoint = p;
      },
      move(p, { mouse, dragging }, s, stage) {
        lastPoint = p;
        const before = hover;
        hover = mouse ? personAt(p, stage) : -1;
        if (hover !== before && !stage.playing) stage.draw();
      },
      up(e) {
        // A press that ends where it began is a tap; a mouse drag from one side to the other pairs the two. A scroll
        // or a cancelled gesture does nothing.
        const from = pending,
          stage = W.stage,
          s = stage.settingsFor('matching');
        pending = -1;
        if (e?.type !== 'pointerup' || from < 0 || !lastPoint) return;
        const to = personAt(lastPoint, stage);
        if (to === from || to < 0) tap(to === from ? from : -1, s, stage);
        else if (from < N !== to < N) {
          picked = from;
          tap(to, s, stage);
        }
      },
      leave() {
        hover = -1;
      },
      escape: () => {
        aim = null;
        picked = -1;
      },
      arrow(dx, dy) {
        if (aim === null) aim = 0;
        else if (dx) aim = (aim % N) + (dx > 0 ? N : 0);
        else aim = (aim < N ? 0 : N) + clamp((aim % N) + dy, 0, N - 1);
      },
      key(e, s, stage) {
        if (e.key !== 'Enter' || !run) return false;
        aim ??= 0;
        tap(aim, s, stage);
        return true;
      },
    },
  });
})();
