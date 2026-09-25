/* Room · The dice that beat each other: nontransitive dice, and why choosing second wins. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, TAU, clamp } = W;
  const model = W.models.dice;
  const t = W.text('dice');
  const reduced = W.prefersReducedMotion();

  const BATCH = 100; // rolls per press of the action button
  // While a batch runs, the dice show a new roll at most this often (seconds), so nothing flashes;
  // only the tally and the graph keep up with every roll.
  const SHOW_EVERY = 0.34;
  const INK = '#10141c';
  const MUTED = '#8f9cad';
  // Die colours per set, in the model's order. Grime's dice are named for theirs.
  const COLORS = [
    ['#f4b86a', '#86c5f2', '#b7e29a'],
    ['#f4b86a', '#86c5f2', '#b7e29a', '#e3a6e6'],
    ['#f0857a', '#7eaef0', '#c2c170'],
  ];

  // Rolls are drawn from a seedable generator; each visit starts from a fresh seed.
  const random = model.rng(Math.floor(Math.random() * 2 ** 32));
  let tally = fresh(''),
    queue = 0, // rolls still to show in the current batch
    due = 0, // fractional rolls owed to the animation clock
    shown = { last: null, recent: [] }, // the roll the dice show, and the latest-results strip
    sinceShown = 0, // seconds since the dice last showed a new roll
    nodes = [], // circle positions from the last frame, for tapping
    u = 1; // drawing scale for the current canvas

  /** An empty tally for one contest. history[i] is the favourite's win share after (i + 1) × stride rolls. */
  function fresh(key) {
    return { key, rolls: 0, you: 0, me: 0, tie: 0, last: null, recent: [], history: [], stride: 1 };
  }

  /**
   * The contest the settings describe: which set, how many dice each, your die,
   * and mine (the best reply when the room chooses). Out-of-range picks, say
   * from an old link, are put right in place.
   */
  function contest(s) {
    s.set = clamp(Math.round(s.set) || 0, 0, model.SETS.length - 1);
    const set = model.SETS[s.set],
      n = set.dice.length;
    if (!(Number.isInteger(s.you) && s.you >= 0 && s.you < n)) s.you = 0;
    if (!(Number.isInteger(s.rival) && s.rival >= -1 && s.rival < n)) s.rival = -1;
    const copies = set.twoDice && s.pairs ? 2 : 1;
    const auto = s.rival < 0;
    const me = auto ? model.bestReply(set, s.you, copies).index : s.rival;
    const odds = model.exact(set.dice[me], set.dice[s.you], copies); // counted from my side
    const mineFavoured = odds.win >= odds.lose;
    const [num, den] = model.reduce(mineFavoured ? odds.win : odds.lose, odds.total);
    return {
      set,
      index: s.set,
      copies,
      auto,
      you: s.you,
      me,
      odds,
      mineFavoured,
      favourite: mineFavoured ? me : s.you,
      chance: num / den,
      fraction: `${num}/${den}`,
      key: `${s.set}|${s.you}|${me}|${copies}`,
    };
  }

  /** A new contest starts a new tally. */
  function ensure(c) {
    if (tally.key === c.key) return;
    tally = fresh(c.key);
    queue = 0;
    due = 0;
    show();
  }

  /** Let the dice and the strip catch up with the tally. */
  function show() {
    shown = { last: tally.last, recent: tally.recent.slice() };
    sinceShown = 0;
  }

  const nameOf = (c, i) => t.names[c.index][i];
  const colorOf = (c, i) => COLORS[c.index][i];
  const favouriteWins = (c) => (c.mineFavoured ? tally.me : tally.you);

  function rollOnce(c) {
    const round = model.play(c.set.dice[c.you], c.set.dice[c.me], c.copies, random);
    tally.rolls++;
    if (round.result > 0) tally.you++;
    else if (round.result < 0) tally.me++;
    else tally.tie++;
    tally.last = round;
    tally.recent.push(round.result);
    if (tally.recent.length > 80) tally.recent.shift();
    if (tally.rolls % tally.stride === 0) tally.history.push(favouriteWins(c) / tally.rolls);
    // Keep the history short: halve its resolution when it grows long.
    if (tally.history.length > 1200) {
      tally.history = tally.history.filter((_, i) => i % 2 === 1);
      tally.stride *= 2;
    }
  }

  // ─── Drawing ────────────────────────────────────────────────────────────

  const font = (ctx, px, weight = 400, family = 'system-ui') => (ctx.font = `${weight} ${px}px ${family}`);

  /** Shrink a font until the text fits in maxWidth. */
  function fit(ctx, text, maxWidth, px, weight, family) {
    font(ctx, px, weight, family);
    while (px > 9 && ctx.measureText(text).width > maxWidth) font(ctx, (px -= 0.5), weight, family);
  }

  /** A small uppercase heading. Returns false, drawing nothing, when it can't fit. */
  function eyebrow(ctx, text, x, y, maxWidth) {
    const words = text.toUpperCase();
    ctx.fillStyle = MUTED;
    ctx.textAlign = 'left';
    ctx.letterSpacing = '1.4px';
    fit(ctx, words, maxWidth, Math.max(10, 11 * u), 600);
    const fits = ctx.measureText(words).width <= maxWidth;
    if (fits) ctx.fillText(words, x, y);
    ctx.letterSpacing = '0px';
    return fits;
  }

  /** One die face showing a number, optionally tilted. */
  function die(ctx, x, y, size, color, value, { dim = false, ring = false, tilt = 0 } = {}) {
    ctx.save();
    ctx.translate(x + size / 2, y + size / 2);
    ctx.rotate(tilt);
    ctx.globalAlpha = dim ? 0.5 : 1;
    ctx.beginPath();
    ctx.roundRect(-size / 2, -size / 2, size, size, size * 0.2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    if (ring) {
      ctx.beginPath();
      ctx.roundRect(-size / 2 - 5, -size / 2 - 5, size + 10, size + 10, size * 0.26);
      ctx.strokeStyle = '#f4f5e9';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.fillStyle = INK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    font(ctx, Math.round(size * 0.52), 700);
    ctx.fillText(value, 0, size * 0.03);
    ctx.textBaseline = 'alphabetic';
    ctx.restore();
  }

  /** How the six face tiles fit a width: one row of six, or two rows of three. */
  function tileGrid(maxWidth) {
    const perRow = maxWidth / 6 >= 17 ? 6 : 3;
    const size = Math.min(maxWidth / (perRow + (perRow - 1) * 0.25), 30 * u + 6);
    const gap = size * 0.25;
    return { perRow, size, gap, height: (6 / perRow - 1) * (size + gap) + size };
  }

  /** The six faces of a die as small tiles; rolled faces are filled in. */
  function faceTiles(ctx, cx, y, maxWidth, faces, color, rolled) {
    const { perRow, size, gap } = tileGrid(maxWidth);
    const rowWidth = perRow * size + (perRow - 1) * gap;
    faces.forEach((f, i) => {
      const x = cx - rowWidth / 2 + (i % perRow) * (size + gap),
        yy = y + Math.floor(i / perRow) * (size + gap);
      const on = rolled.includes(i);
      ctx.beginPath();
      ctx.roundRect(x, yy, size, size, size * 0.22);
      ctx.fillStyle = on ? color : '#131a24';
      ctx.fill();
      ctx.strokeStyle = on ? color : color + '66';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.fillStyle = on ? INK : color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      font(ctx, Math.max(9, Math.round(size * 0.5)), on ? 700 : 500);
      ctx.fillText(f, x + size / 2, yy + size / 2 + 0.5);
      ctx.textBaseline = 'alphabetic';
    });
  }

  /**
   * The two dice face to face: who picked what, the last roll shown, every face, and the latest results.
   * `busy` while a batch runs: the loser isn't dimmed then, so the dice stay steady.
   */
  function drawDuel(ctx, box, c, last, busy, recent = []) {
    const pad = 6 * u + 4,
      indent = Math.max(3, 12 - 8 * u); // lines the sentence up with the stage heading above
    const line = c.auto ? t.iTake(nameOf(c, c.you), nameOf(c, c.me)) : t.against(nameOf(c, c.you), nameOf(c, c.me));
    ctx.fillStyle = '#eef0e6';
    ctx.textAlign = 'left';
    fit(ctx, line, box.w - indent - pad, Math.max(13, 19 * u), 'italic 400', 'Georgia, serif');
    ctx.fillText(line, box.x + indent, box.y + 22 * u + 6);

    // Size the dice to the space, then centre the whole group vertically.
    const head = 30 * u + 14,
      vsWidth = 34 * u + 8,
      cardWidth = (box.w - vsWidth - pad * 2) / 2,
      two = c.copies === 2;
    const available = box.h - head;
    const tiles = tileGrid(Math.min(cardWidth, 230));
    const labelGap = 12 * u + 14, // label baseline to die top, clear of the winner's ring
      dieGap = 12 * u + 8,
      totalGap = two ? 20 * u + 8 : 0;
    const size = Math.min(
      cardWidth * (two ? 0.44 : 0.62),
      (available - labelGap - dieGap - totalGap - tiles.height) * (two ? 0.8 : 0.9),
      two ? 96 : 140,
    );
    const group = labelGap + size + dieGap + totalGap + tiles.height;
    // A strip of the latest results, when there is room for it.
    const chip = clamp(12 * u + 5, 9, 17),
      chipGap = chip * 0.35,
      perRow = Math.floor((box.w - 2 * pad + chipGap) / (chip + chipGap)),
      strip = 18 * u + 12 + 2 * chip + chipGap;
    const showStrip = available - group > strip + 40 * u + 10;
    const block = group + (showStrip ? strip + 34 * u + 6 : 0);
    const top = box.y + head + Math.max(0, (available - block) / 2) + 12 * u;
    const dy = top + labelGap - 12 * u - 6;
    const sides = [
      { who: t.you, die: c.you, rolled: last?.a ?? [], total: last?.totalA, won: last?.result > 0 },
      { who: t.me, die: c.me, rolled: last?.b ?? [], total: last?.totalB, won: last?.result < 0 },
    ];
    sides.forEach((side, k) => {
      const x = box.x + pad + k * (cardWidth + vsWidth),
        cx = x + cardWidth / 2,
        color = colorOf(c, side.die),
        faces = c.set.dice[side.die],
        label = `${side.who} · ${nameOf(c, side.die)}`.toUpperCase();
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.letterSpacing = '1px';
      fit(ctx, label, cardWidth, Math.max(10, 12 * u), 600);
      ctx.fillText(label, cx, top);
      ctx.letterSpacing = '0px';
      const lost = !busy && last && last.result !== 0 && !side.won;
      if (!two) {
        const value = last ? faces[side.rolled[0]] : '?';
        die(ctx, cx - size / 2, dy, size, color, value, { dim: lost, ring: side.won });
      } else {
        const g = size * 0.18;
        [0, 1].forEach((j) => {
          const value = last ? faces[side.rolled[j]] : '?';
          die(ctx, cx - size - g / 2 + j * (size + g), dy, size, color, value, { dim: lost, ring: side.won });
        });
      }
      let y = dy + size + dieGap;
      if (two) {
        ctx.fillStyle = lost ? MUTED : '#eef0e6';
        ctx.textAlign = 'center';
        font(ctx, Math.max(12, 17 * u), 650);
        ctx.fillText(last ? `= ${side.total}` : '= ?', cx, y + 10 * u);
        y += totalGap;
      }
      faceTiles(ctx, cx, y, Math.min(cardWidth, 230), faces, color, last ? side.rolled : []);
    });
    ctx.fillStyle = MUTED;
    ctx.textAlign = 'center';
    font(ctx, Math.max(12, 16 * u), 'italic 400', 'Georgia, serif');
    ctx.fillText(t.vs, box.x + pad + cardWidth + vsWidth / 2, dy + size / 2 + 5);

    if (!showStrip) return;
    // Latest results, newest first: each square takes the colour of the die that won.
    const sy = dy + size + dieGap + totalGap + tiles.height + 34 * u + 6;
    eyebrow(ctx, t.latestTitle, box.x + pad, sy, box.w - 2 * pad);
    const shown = recent.slice(-perRow * 2).reverse();
    for (let i = 0; i < perRow * 2; i++) {
      const x = box.x + pad + (i % perRow) * (chip + chipGap),
        y = sy + 10 * u + 6 + Math.floor(i / perRow) * (chip + chipGap);
      const result = shown[i];
      ctx.beginPath();
      ctx.roundRect(x, y, chip, chip, chip * 0.28);
      if (result === undefined) {
        ctx.strokeStyle = '#1f2835';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        ctx.fillStyle = result > 0 ? colorOf(c, c.you) : result < 0 ? colorOf(c, c.me) : '#4a5566';
        ctx.fill();
      }
    }
  }

  function arrowHead(ctx, x, y, angle, size) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - size * Math.cos(angle - 0.45), y - size * Math.sin(angle - 0.45));
    ctx.lineTo(x - size * Math.cos(angle + 0.45), y - size * Math.sin(angle + 0.45));
    ctx.closePath();
    ctx.fill();
  }

  /** A small dark pill behind a label so it reads over the lines. */
  function tag(ctx, text, x, y, color, px) {
    font(ctx, px, 600);
    const w = ctx.measureText(text).width + px * 0.9,
      h = px * 1.55;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2);
    ctx.fillStyle = '#0d131c';
    ctx.fill();
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y + 0.5);
    ctx.textBaseline = 'alphabetic';
  }

  /** Dice as points on a circle, with an arrow from each usual winner to its loser, labelled with the exact chance. */
  function drawCircle(ctx, box, c) {
    const pad = 6 * u + 4;
    const titled = eyebrow(ctx, t.circleTitle, box.x + pad, box.y + 16 * u + 4, box.w - pad * 2);
    const head = titled ? 26 * u + 8 : 4;
    const n = c.set.dice.length;
    const labelPx = Math.max(10, Math.round(13 * u)),
      whoPx = Math.max(10, 12 * u);
    // Three dice sit on a triangle with one at the top; four sit on the corners of a square.
    const start = n === 4 ? (-3 * Math.PI) / 4 : -Math.PI / 2;
    const angles = Array.from({ length: n }, (_, i) => start + (i * TAU) / n);
    const cos = angles.map(Math.cos),
      sin = angles.map(Math.sin);
    const span = (list) => Math.max(...list) - Math.min(...list),
      middle = (list) => (Math.max(...list) + Math.min(...list)) / 2;
    // The largest circle that leaves room for the nodes, their labels, and the "You" and "Me" tags.
    const high = box.h - head - 2 * (whoPx + 10),
      wide = box.w - 2 * pad - 2 * labelPx;
    const radius = clamp(Math.min(wide / (span(cos) + 0.5), high / (span(sin) + 0.5)), 20, 170),
      r = clamp(radius * 0.24, 12, 26);
    const cx = box.x + box.w / 2 - radius * middle(cos),
      cy = box.y + head + (box.h - head) / 2 - radius * middle(sin);
    const at = (i) => ({ x: cx + radius * cos[i], y: cy + radius * sin[i], a: angles[i] });
    const current = (e) => (e.winner === c.you && e.loser === c.me) || (e.winner === c.me && e.loser === c.you);
    const edges = model.victories(c.set, c.copies);
    // Draw the current pair last so it sits on top.
    edges.sort((a, b) => current(a) - current(b));
    for (const e of edges) {
      const p = at(e.winner),
        q = at(e.loser);
      const angle = Math.atan2(q.y - p.y, q.x - p.x),
        ux = Math.cos(angle),
        uy = Math.sin(angle);
      const x0 = p.x + ux * (r + 3),
        y0 = p.y + uy * (r + 3),
        x1 = q.x - ux * (r + 5),
        y1 = q.y - uy * (r + 5);
      const on = current(e);
      const color = on ? colorOf(c, e.winner) : '#5b6b80';
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = on ? 3 : 1.6;
      ctx.setLineDash(e.even ? [4, 5] : []);
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      ctx.setLineDash([]);
      if (!e.even) arrowHead(ctx, x1, y1, angle, on ? 11 : 8);
      // Labels on the rim sit just outside it; labels across the middle sit nearer the winner.
      const across = n === 4 && Math.abs(e.winner - e.loser) === 2;
      const s = across ? 0.3 : 0.5;
      const mx = x0 + (x1 - x0) * s,
        my = y0 + (y1 - y0) * s;
      const out = across ? 0 : labelPx * 1.1;
      const ox = mx - cx,
        oy = my - cy,
        len = Math.hypot(ox, oy) || 1;
      const [num, den] = model.reduce(e.win, e.total);
      tag(
        ctx,
        e.even ? t.even : `${num}/${den}`,
        mx + (ox / len) * out,
        my + (oy / len) * out,
        on ? '#f4f5e9' : '#aab6c4',
        labelPx,
      );
    }
    const found = [];
    for (let i = 0; i < n; i++) {
      const p = at(i),
        color = colorOf(c, i),
        chosen = i === c.you || i === c.me;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, TAU);
      ctx.fillStyle = chosen ? color : '#141c26';
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = chosen ? 3 : 2;
      ctx.stroke();
      ctx.fillStyle = chosen ? INK : color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      font(ctx, Math.round(r * 0.95), 700);
      ctx.fillText(t.marks[c.index][i], p.x, p.y + 1);
      ctx.textBaseline = 'alphabetic';
      // Who holds this die, written just outside the circle.
      const who = [i === c.you && t.you, i === c.me && t.me].filter(Boolean).join(' · ');
      if (who) {
        // Above the top die, below the others, so labels never stray into the dice beside the circle.
        const above = Math.sin(p.a) < -0.5;
        font(ctx, whoPx, 600);
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.fillText(who, p.x, above ? p.y - r - 8 : p.y + r + 6 + whoPx);
      }
      found.push({ x: p.x, y: p.y, r });
    }
    return found;
  }

  /** The running tally of wins as two bars. */
  function drawRace(ctx, box, c) {
    const pad = 6 * u + 4;
    eyebrow(ctx, t.winsTitle, box.x + pad, box.y + 12 * u + 4, box.w - pad * 2);
    const rows = [
      [t.you, c.you, tally.you],
      [t.me, c.me, tally.me],
    ];
    const top = box.y + 26 * u + 12,
      rowHeight = Math.min((box.h - (top - box.y) - 16) / 2, 56 * u + 10);
    const barWidth = box.w - pad * 2;
    rows.forEach(([who, i, count], k) => {
      const y = top + k * rowHeight,
        color = colorOf(c, i);
      ctx.textAlign = 'left';
      ctx.fillStyle = color;
      font(ctx, Math.max(11, 13 * u), 600);
      ctx.fillText(`${who} · ${nameOf(c, i)}`, box.x + pad, y + 10 * u + 4);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#eef0e6';
      font(ctx, Math.max(13, 20 * u), 650);
      ctx.fillText(String(count), box.x + pad + barWidth, y + 12 * u + 5);
      const by = y + 20 * u + 10,
        bh = Math.max(6, 10 * u);
      ctx.beginPath();
      ctx.roundRect(box.x + pad, by, barWidth, bh, bh / 2);
      ctx.fillStyle = '#1b2430';
      ctx.fill();
      if (count) {
        ctx.beginPath();
        ctx.roundRect(box.x + pad, by, Math.max(bh, (barWidth * count) / tally.rolls), bh, bh / 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    });
    if (tally.tie) {
      ctx.textAlign = 'left';
      ctx.fillStyle = MUTED;
      font(ctx, Math.max(10, 12 * u));
      ctx.fillText(t.ties(tally.tie), box.x + pad, top + rowHeight * 2 + 4);
    }
  }

  /** The favourite's running share of wins, settling towards the exact chance. */
  function drawShare(ctx, box, c) {
    const pad = 6 * u + 4;
    const color = colorOf(c, c.favourite);
    eyebrow(ctx, t.shareTitle(nameOf(c, c.favourite)), box.x + pad, box.y + 12 * u + 4, box.w - pad * 2);
    const labelPx = Math.max(10, 11 * u);
    font(ctx, labelPx);
    const left = box.x + pad + ctx.measureText('100%').width + 6,
      right = box.x + box.w - pad,
      top = box.y + 26 * u + 14,
      bottom = box.y + box.h - labelPx - 8;
    const Y = (f) => bottom - f * (bottom - top);
    ctx.strokeStyle = '#243040';
    ctx.lineWidth = 1;
    ctx.textAlign = 'right';
    ctx.fillStyle = MUTED;
    for (const f of [0, 0.5, 1]) {
      ctx.beginPath();
      ctx.moveTo(left, Y(f));
      ctx.lineTo(right, Y(f));
      ctx.stroke();
      ctx.fillText(Math.round(f * 100) + '%', left - 6, Y(f) + labelPx * 0.35);
    }
    const same = c.you === c.me; // one die against itself: no exact target to aim at
    // The exact chance, as a dashed target line.
    if (!same) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(left, Y(c.chance));
      ctx.lineTo(right, Y(c.chance));
      ctx.stroke();
      ctx.setLineDash([]);
    }
    const span = Math.max(BATCH, tally.rolls);
    ctx.textAlign = 'right';
    ctx.fillStyle = MUTED;
    font(ctx, labelPx);
    ctx.fillText(t.rolls(span), right, bottom + labelPx + 5);
    ctx.textAlign = 'left';
    ctx.fillText('0', left, bottom + labelPx + 5);
    const h = tally.history;
    if (h.length) {
      ctx.strokeStyle = '#eef0e6';
      ctx.lineWidth = 1.8;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      h.forEach((f, i) => {
        const x = left + (((i + 1) * tally.stride) / span) * (right - left);
        if (i) ctx.lineTo(x, Y(f));
        else ctx.moveTo(x, Y(f));
      });
      ctx.stroke();
      const f = favouriteWins(c) / tally.rolls;
      ctx.beginPath();
      ctx.arc(left + (tally.rolls / span) * (right - left), Y(f), 3.5, 0, TAU);
      ctx.fillStyle = '#f4f5e9';
      ctx.fill();
    } else {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#c8d0da';
      font(ctx, Math.max(11, 14 * u), 'italic 400', 'Georgia, serif');
      ctx.fillText(t.startHint, (left + right) / 2, Y(0.78));
    }
    // A key for the dashed line in the lower right, where the running share rarely goes.
    if (same) return;
    font(ctx, labelPx, 600);
    const key = t.exactLabel(c.fraction),
      keyWidth = ctx.measureText(key).width;
    ctx.fillStyle = color;
    ctx.textAlign = 'right';
    ctx.fillText(key, right - 4, Y(0.12));
    ctx.strokeStyle = color;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(right - keyWidth - 30, Y(0.12) - labelPx * 0.35);
    ctx.lineTo(right - keyWidth - 10, Y(0.12) - labelPx * 0.35);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  /** Four regions: the duel and the circle above, the tally and the running share below. */
  function layout(width, height) {
    const gap = clamp(Math.min(width, height) * 0.035, 6, 20);
    const split = Math.round(height * 0.57),
      left = Math.round(width * 0.58),
      race = Math.round(width * 0.36);
    return {
      duel: { x: 0, y: 0, w: left, h: split },
      circle: { x: left, y: 0, w: width - left, h: split },
      race: { x: 0, y: split + gap, w: race, h: height - split - gap },
      share: { x: race + gap, y: split + gap, w: width - race - gap, h: height - split - gap },
      rule: split + gap / 2,
    };
  }

  function draw(ctx, s, stage) {
    const { width, height } = stage;
    const c = contest(s);
    ensure(c);
    u = clamp(Math.min(width / 820, height / 560), 0.5, 1.15);
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    const L = layout(width, height);
    // A faint rule separates the live tally from the dice.
    ctx.strokeStyle = '#1a2230';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(8, L.rule);
    ctx.lineTo(width - 8, L.rule);
    ctx.stroke();
    drawDuel(ctx, L.duel, c, shown.last, queue > 0, shown.recent);
    nodes = drawCircle(ctx, L.circle, c);
    drawRace(ctx, L.race, c);
    drawShare(ctx, L.share, c);
  }

  // ─── Readouts and controls ─────────────────────────────────────────────

  /** Update the words beside the canvas. `settled` also refreshes the verdict; `speak` announces it. */
  function showTally(c, settled, speak = false) {
    const fav = nameOf(c, c.favourite);
    const seen = tally.rolls ? Math.round((favouriteWins(c) / tally.rolls) * 100) : null;
    $('scene-status').textContent = tally.rolls ? t.rolls(tally.rolls) : t.ready;
    if (!$('dice-rolls')) return;
    $('dice-rolls').textContent = tally.rolls.toLocaleString(W.lang);
    $('dice-wins').textContent = t.winsLine(nameOf(c, c.you), nameOf(c, c.me), tally.you, tally.me);
    $('dice-seen').textContent =
      c.you === c.me ? t.sameDie : t.seenLine(fav, seen, c.fraction, Math.round(c.chance * 100));
    $('dice-meter').style.width = (seen ?? 0) + '%';
    $('dice-meter').style.background = colorOf(c, c.favourite);
    if (!settled) return;
    const even = c.odds.win === c.odds.lose;
    const verdict =
      c.you === c.me
        ? t.sameDie
        : even
          ? t.evenVerdict
          : tally.rolls
            ? t.verdict(tally.rolls, fav, seen, c.fraction)
            : t.verdictStart(fav, c.fraction);
    $('dice-verdict').textContent = verdict;
    if (speak) W.announce(verdict); // once per batch, when it has landed
  }

  /** Mark the chosen dice in the pickers, without rebuilding the panel (so focus stays put). */
  function showPicks(s) {
    const c = contest(s);
    document
      .querySelectorAll('#scene-controls [data-you]')
      .forEach((b) => b.setAttribute('aria-pressed', Number(b.dataset.you) === s.you));
    document
      .querySelectorAll('#scene-controls [data-rival]')
      .forEach((b) => b.setAttribute('aria-pressed', Number(b.dataset.rival) === s.rival));
    $('dice-you-faces').textContent = t.faces(c.set.dice[c.you]);
    $('dice-rival-faces').textContent = t.faces(c.set.dice[c.me]);
  }

  function readouts(s) {
    const c = contest(s);
    ensure(c);
    $('scene-name').textContent = c.copies === 2 ? t.twoEach(t.sceneNames[c.index]) : t.sceneNames[c.index];
    if ($('dice-you-faces')) showPicks(s);
    showTally(c, true);
  }

  /** The visitor picks a die, from the panel, the circle, or the arrow keys. */
  function pick(s, stage, key, value) {
    s[key] = value;
    stage.setChosen(-1);
    showPicks(s);
    stage.sync();
    stage.draw();
  }

  function controls(s, stage) {
    const c = contest(s);
    const buttons = (attr, current) =>
      c.set.dice
        .map(
          (faces, i) =>
            `<button type="button" data-${attr}="${i}" aria-pressed="${i === current}" aria-label="${t.pickDie(nameOf(c, i), faces)}">${nameOf(c, i)}</button>`,
        )
        .join('');
    return (
      `<div class="control wide"><label for="dice-set">${t.setLabel}</label><select id="dice-set">` +
      t.sets.map((name, i) => `<option value="${i}" ${i === c.index ? 'selected' : ''}>${name}</option>`).join('') +
      '</select></div>' +
      `<div class="control wide"><label id="dice-you-label">${t.youLabel}<output id="dice-you-faces"></output></label>` +
      `<div class="segment" role="group" aria-labelledby="dice-you-label">${buttons('you', s.you)}</div></div>` +
      `<div class="control wide"><label id="dice-rival-label">${t.rivalLabel}<output id="dice-rival-faces"></output></label>` +
      `<div class="segment" role="group" aria-labelledby="dice-rival-label">` +
      `<button type="button" data-rival="-1" aria-pressed="${s.rival < 0}">${t.letMe}</button>${buttons('rival', s.rival)}</div></div>` +
      (c.set.twoDice ? stage.check('pairs', t.pairs, s.pairs) : '') +
      stage.slider('speed', t.speed, 2, 100, 1, s.speed, '', t.speedHint) +
      '<div class="wide readout" id="dice-readout">' +
      `<div>${t.rollsSoFar} <strong id="dice-rolls">0</strong></div>` +
      '<div id="dice-wins"></div><div id="dice-seen"></div>' +
      '<div class="meter"><span id="dice-meter"></span></div>' +
      '<div id="dice-verdict" class="dice-verdict"></div></div>'
    );
  }

  function bindControls(panel, s, stage) {
    $('dice-set').addEventListener('change', (e) => {
      s.set = Number(e.target.value);
      stage.setChosen(-1);
      stage.refresh(); // the number of dice may change
      stage.draw();
      $('dice-set').focus();
    });
    panel
      .querySelectorAll('[data-you]')
      .forEach((b) => b.addEventListener('click', () => pick(s, stage, 'you', Number(b.dataset.you))));
    panel
      .querySelectorAll('[data-rival]')
      .forEach((b) => b.addEventListener('click', () => pick(s, stage, 'rival', Number(b.dataset.rival))));
    // The stage stores the checkbox; the contest changes, so refresh the words too.
    panel.querySelector('[data-check="pairs"]')?.addEventListener('change', () => {
      stage.setChosen(-1);
      stage.sync();
    });
  }

  /** The 36 (or 1,296) equally likely pairings for the current dice, coloured by who wins each. */
  function drawGrid(s) {
    const canvas = $('dice-grid');
    if (!canvas) return;
    const c = contest(s);
    const mine = model.outcomes(c.set.dice[c.me], c.copies),
      yours = model.outcomes(c.set.dice[c.you], c.copies);
    const n = mine.length,
      labels = n <= 6 ? 1 : 0; // a header row and column of face values for single dice
    const size = 300,
      dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    const cell = size / (n + labels),
      inset = n <= 6 ? 2 : 0.4;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    font(ctx, 15, 700);
    if (labels) {
      yours.forEach((f, j) => {
        ctx.fillStyle = colorOf(c, c.you);
        ctx.fillText(f, cell * (j + 1.5), cell / 2);
      });
      mine.forEach((f, i) => {
        ctx.fillStyle = colorOf(c, c.me);
        ctx.fillText(f, cell / 2, cell * (i + 1.5));
      });
    }
    mine.forEach((a, i) =>
      yours.forEach((b, j) => {
        ctx.fillStyle = a > b ? colorOf(c, c.me) : a < b ? colorOf(c, c.you) + '55' : '#3a4452';
        ctx.fillRect(cell * (j + labels) + inset, cell * (i + labels) + inset, cell - 2 * inset, cell - 2 * inset);
      }),
    );
    ctx.textBaseline = 'alphabetic';
    const e = c.odds;
    $('dice-grid-note').textContent =
      t.gridAxes(nameOf(c, c.me), nameOf(c, c.you)) +
      ' ' +
      t.gridNote(e.win, e.lose, e.tie, e.total, nameOf(c, c.me), nameOf(c, c.you));
  }

  /** The home-card picture: a finished roll beside the circle of victories. */
  function preview(ctx, width, height) {
    const c = contest({ set: 0, you: 0, rival: -1, pairs: false });
    u = 0.5;
    ctx.fillStyle = '#eef0e6';
    ctx.textAlign = 'left';
    font(ctx, 14, 'italic 400', 'Georgia, serif');
    ctx.fillText(t.iTake(nameOf(c, 0), nameOf(c, 2)), 14, 26);
    const size = Math.min(58, width * 0.18),
      y = height * 0.5 - size * 0.35;
    [
      [0, 4, width * 0.05],
      [2, 7, width * 0.35],
    ].forEach(([i, value, x], k) => {
      ctx.fillStyle = colorOf(c, i);
      ctx.textAlign = 'center';
      ctx.letterSpacing = '1px';
      font(ctx, 10, 600);
      ctx.fillText(`${k ? t.me : t.you} · ${nameOf(c, i)}`.toUpperCase(), x + size / 2, y - 12);
      ctx.letterSpacing = '0px';
      die(ctx, x, y, size, colorOf(c, i), value, { dim: !k, ring: !!k, tilt: k ? -0.1 : 0.14 });
    });
    ctx.fillStyle = MUTED;
    font(ctx, 13, 'italic 400', 'Georgia, serif');
    ctx.fillText(t.vs, (width * 0.4 + size) / 2, y + size / 2 + 4);
    drawCircle(ctx, { x: width * 0.56, y: 10, w: width * 0.44, h: height - 10 }, c);
  }

  W.defineRoom({
    id: 'dice',
    symbol: '⚄',
    still: true, // rolls come in batches when asked: nothing runs on its own to pause
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'chance',
    tagline: t.tagline,
    accent: { background: '#2b2620', border: '#f2c58a', color: '#fbe0b8' },

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
    connection: { ...t.connection, go: 'traffic' },

    // set: which dice; you: your die; rival: my die, or -1 to let the room choose; speed: rolls a second.
    defaults: { set: 0, you: 0, rival: -1, speed: 20, pairs: false },
    ranges: { set: [0, 2, 'integer'], you: [0, 3, 'integer'], rival: [-1, 3, 'integer'], speed: [2, 100, 'integer'] },
    defaultPreset: 0,
    presets: [
      { set: 0, you: 0, rival: -1, pairs: false },
      { set: 1, you: 0, rival: -1, pairs: false },
      { set: 2, you: 0, rival: -1, pairs: true },
    ].map((settings, i) => ({ ...t.presets[i], settings })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Pascal',
        color: '#e9c98f',
        sketch: {
          hairStyle: 'wig', // long, dark, shoulder-length hair
          hair: '#2f231d',
          skin: '#e8c19d',
          moustache: true,
          brows: 'bold',
          backdrop: '#e7dfcf',
        },
      },
    ],

    insight: { ...t.insight, onOpen: drawGrid },

    controls,
    bindControls,
    readouts,
    draw,
    preview,

    step(dt, s) {
      if (!queue) return;
      const c = contest(s);
      ensure(c);
      sinceShown += dt;
      due += dt * s.speed;
      const n = Math.min(queue, Math.floor(due));
      if (!n) return;
      due -= n;
      queue -= n;
      for (let i = 0; i < n; i++) rollOnce(c);
      if (queue === 0 || sinceShown >= SHOW_EVERY) show();
      showTally(c, queue === 0, queue === 0);
    },

    /** Roll a batch: animated while playing, all at once when paused or when motion is reduced. */
    action(s, stage) {
      const c = contest(s);
      ensure(c);
      if (reduced || !stage.playing) {
        for (let i = 0; i < BATCH; i++) rollOnce(c);
        show();
        showTally(c, true, true);
        stage.draw();
        return;
      }
      if (!queue) sinceShown = SHOW_EVERY; // the first roll of a batch shows straight away
      queue += BATCH;
      due = Math.max(due, 1); // the first roll lands straight away
    },

    reset(s, stage) {
      tally = fresh(contest(s).key);
      queue = 0;
      due = 0;
      show();
      showTally(contest(s), true);
      stage.draw();
    },

    pointer: {
      down(p, s, stage) {
        const x = p.x * stage.width,
          y = p.y * stage.height;
        const hit = nodes.findIndex((n) => Math.hypot(n.x - x, n.y - y) <= n.r + 8);
        if (hit >= 0) pick(s, stage, 'you', hit);
      },
      arrow(dx, dy, s, stage) {
        if (!dx) return;
        const n = contest(s).set.dice.length;
        pick(s, stage, 'you', (s.you + dx + n) % n);
      },
    },
  });
})();
