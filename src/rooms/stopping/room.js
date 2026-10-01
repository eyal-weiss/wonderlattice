/* Room · Stop at 37%: turn 100 cards one at a time and stop at the biggest, above a curve of every "look, then leap" rule. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $ } = W;
  const M = W.models.stopping;
  const t = W.text('stopping');
  const reduced = W.prefersReducedMotion();

  const N = 100, // cards in a deal
    TOP = 10, // "happy with any of the top 10"
    DEALS = 10000, // simulated deals behind the curve
    DEALS_PER_SECOND = 2500, // so the curve fills in about four seconds
    SIM_SEED = 2026,
    FLIP_SECONDS = 0.22,
    MAX_SEED = 9999;
  const COLOURS = {
    stage: '#0a0e15',
    ink: '#f4f5e9',
    muted: '#98aab7',
    grid: '#1c2733',
    face: '#f4efe1',
    faceInk: '#1d2430',
    faceMuted: '#6b7480',
    faceLine: '#c9c2b0',
    back: '#24476b',
    backLine: '#5b8fbf',
    gold: '#f7c948',
    goldInk: '#8a5f00',
    you: '#6cc3ff',
    youInk: '#1f5f8f',
    rule: '#c792ff',
    zone: 'rgba(199, 146, 255, 0.16)',
    bar: '#3d6f96',
    seen: '#5d7690',
    curve: '#7ee0a1',
  };

  const num = (x, digits = 0) =>
    x.toLocaleString(W.numberLocale, { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const pct = (x, digits = 1) => W.text('app').stage.percent(num(x * 100, digits));
  const goal = (s) => (s.top ? 'top' : 'best');

  // The exact chance of every cutoff, for both goals, and the best cutoff of each.
  const exact = {
    best: Array.from({ length: N }, (_, r) => M.chanceBest(N, r)),
    top: Array.from({ length: N }, (_, r) => M.chanceTop(N, r, TOP)),
  };
  const peaks = { best: M.bestCutoff(N), top: M.bestCutoff(N, TOP) };

  /** Bigger and smaller decks, for the very best: each one's peak, and its curve against the share looked at. */
  let decks = null;
  function moreDecks() {
    decks ??= [10, 100, 1000, 1e6].map((n) => {
      const points = [];
      if (n <= 100) for (let r = 0; r < n; r++) points.push([r / n, M.chanceBest(n, r)]);
      else
        for (let j = 0; j <= 100; j++)
          points.push([j / 100, M.chanceBest(n, Math.min(n - 1, Math.round((j / 100) * n)))]);
      return { n, peak: M.bestCutoff(n), points };
    });
    return decks;
  }

  // ---- The visitor's game ----

  // The deal being played: its numbers and their places (1 = biggest), which cards beat all before them, how many
  // are turned up, and the one taken (null while playing).
  let game = null,
    finishedAt = 0; // when the last game ended, so a double press doesn't deal again at once

  function dealGame(seed) {
    const values = M.deal(N, seed);
    let high = -Infinity;
    const record = values.map((v) => {
      const beats = v > high;
      high = Math.max(high, v);
      return beats;
    });
    game = { seed, values, rank: M.ranks(values), record, shown: 1, taken: null, last: false, flip: reduced ? 1 : 0 };
    return game;
  }
  const current = (s) => (game && game.seed === s.seed ? game : dealGame(s.seed));
  const over = (g) => g.taken !== null;

  /** The position of the biggest card before the one that is up, or −1 when it is the first. */
  function bestBefore(g) {
    let best = -1;
    for (let i = 0; i < g.shown - 1; i++) if (best < 0 || g.values[i] > g.values[best]) best = i;
    return best;
  }

  /** Did the rule end on the last card only because nothing beat the cards it looked at? */
  const ruleWaited = (g, look) => look > 0 && g.rank.indexOf(1) < look;

  function next(s, st) {
    const g = current(s);
    if (over(g)) {
      if (performance.now() - finishedAt > 800) again(s, st);
      return;
    }
    if (g.shown >= N) return;
    g.shown++;
    g.flip = reduced ? 1 : 0;
    const i = g.shown - 1;
    if (g.shown === N) return finish(g, i, true, s, st); // the last card is yours
    W.announce((g.record[i] ? t.announce.newBest : t.announce.card)(num(g.shown), num(g.values[i])));
    st.sync();
    st.draw();
  }

  function take(s, st) {
    const g = current(s);
    if (!over(g)) finish(g, g.shown - 1, false, s, st);
  }

  function finish(g, i, last, s, st) {
    g.taken = i;
    g.last = last;
    finishedAt = performance.now();
    st.sync();
    st.draw();
    W.announce(result(s));
  }

  function again(s, st) {
    s.seed = (s.seed % MAX_SEED) + 1;
    dealGame(s.seed);
    W.announce(t.announce.deal(num(game.values[0])));
    st.sync();
    st.draw();
  }

  /** The game in words: the card that is up, or how the game ended, and what the rule would have done. */
  function result(s) {
    const g = current(s);
    if (!over(g))
      return g.shown === 1 ? t.game.first(num(N)) : t.game.playing(num(g.shown), num(N), num(g.values[bestBefore(g)]));
    const mine = g.rank[g.taken];
    const words = [g.last ? t.game.last(t.place(mine)) : t.game.took(num(g.taken + 1), t.place(mine))];
    if (s.top) words.push(mine <= TOP ? t.game.topWin : t.game.topLose);
    words.push(mine === 1 ? t.game.found : t.game.biggest(num(g.rank.indexOf(1) + 1)));
    const rule = M.ruleChoice(g.values, s.look);
    words.push(
      s.look === 0
        ? t.game.ruleNone(t.place(g.rank[rule]))
        : ruleWaited(g, s.look)
          ? t.game.ruleLast(num(s.look), t.place(g.rank[rule]))
          : t.game.rule(num(s.look), num(rule + 1), t.place(g.rank[rule])),
    );
    return words.join(' ');
  }

  const status = (g) => (over(g) ? t.status.done(t.place(g.rank[g.taken])) : t.status.card(num(g.shown), num(N)));

  // ---- The simulated deals behind the curve ----

  let tally = null,
    simRand = null,
    due = 0;

  function restartSim() {
    tally = M.tallies(N);
    simRand = M.random(SIM_SEED);
    due = 0;
    if (reduced) M.simulate(N, TOP, DEALS, simRand, tally);
  }

  // ---- Layout and drawing ----

  let layout = null; // the last layout drawn, for finding what a tap is on
  let pressed = null, // what a press started on ('take' or 'next'), acted on when it lifts without moving far
    travel = 0;

  /**
   * Where everything goes. The cards and the curve share a landscape box at the top, so on a canvas taller than the
   * window both stay in view; on a tall canvas the curves for bigger decks fill the space underneath.
   */
  function place(width, height) {
    const small = Math.round(Math.min(13, Math.max(10, Math.min(width, height) / 32)));
    const pad = Math.max(10, Math.min(22, Math.min(width, height) * 0.03));
    const narrow = width < 560;
    const box = Math.min(height, Math.max(width * 0.6, 280));
    const gameH = box * (narrow ? 0.52 : 0.5);
    const pill = Math.round(small * 2);
    const stripH = Math.max(14, Math.min(30, gameH * 0.12));
    const names = small * 2.6; // two lines of names under the strip
    const cardH = Math.max(40, gameH - pad - 5 - pill - 8 - stripH - names);
    const strip = { x: pad, y: pad + cardH + 5 + pill + 8, w: width - pad * 2, h: stripH };
    // Three columns: the best card so far (the past), the card that is up (now), the deck (what's to come).
    const col = strip.w / 3;
    const card = (column, scale) => {
      const h = cardH * scale,
        w = Math.min(col - small, h * (narrow ? 1.2 : 0.74));
      return { x: pad + col * column + (col - w) / 2, y: pad + cardH - h, w, h };
    };
    const L = { small, pad, box, pill, strip, before: card(0, 0.84), mine: card(1, 1), deck: card(2, 0.84) };
    L.namesY = strip.y + stripH;
    const top = L.namesY + names + pad * 0.3;
    L.plot = { x: pad + small * 2.8, y: top + small * 1.5 };
    L.plot.w = width - pad - L.plot.x;
    L.plot.h = Math.max(40, box - pad * 0.6 - small * 2.6 - L.plot.y);
    const spare = height - box;
    L.more =
      spare > 190 ? { x: pad, y: box + pad, w: width - pad * 2, h: Math.min(spare - pad * 2, width * 0.36) } : null;
    return L;
  }

  function rounded(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  }

  /** Text shrunk until it fits a width, from a largest size down to a smallest. */
  function fit(ctx, text, width, largest, smallest, weight = '600', family = 'Georgia, serif') {
    let size = largest;
    ctx.font = `${weight} ${size}px ${family}`;
    while (size > smallest && ctx.measureText(text).width > width) {
      size -= 1;
      ctx.font = `${weight} ${size}px ${family}`;
    }
    return size;
  }

  /** A face-up card: a small label at the top, its number in the middle, an optional note at the bottom. */
  function faceUp(ctx, box, L, { label, value, note, border, line = 1.5, noteColour = COLOURS.faceMuted }) {
    const r = Math.min(10, box.w * 0.08);
    rounded(ctx, box.x, box.y, box.w, box.h, r);
    ctx.fillStyle = COLOURS.face;
    ctx.fill();
    ctx.strokeStyle = border;
    ctx.lineWidth = line;
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.fillStyle = COLOURS.faceMuted;
    ctx.font = `${L.small - 1}px system-ui`;
    ctx.fillText(label, box.x + box.w / 2, box.y + L.small + 3, box.w - 8);
    ctx.fillStyle = COLOURS.faceInk;
    fit(ctx, value, box.w - 12, Math.min(box.h * 0.26, box.w * 0.3, 34), 9);
    ctx.fillText(value, box.x + box.w / 2, box.y + box.h / 2 + box.h * 0.08);
    if (note) {
      ctx.fillStyle = noteColour;
      ctx.font = `600 ${L.small - 1}px system-ui`;
      ctx.fillText(note, box.x + box.w / 2, box.y + box.h - 7, box.w - 8);
    }
  }

  /** A face-down card, with a quiet lattice on its back. */
  function faceDown(ctx, box) {
    const r = Math.min(10, box.w * 0.08);
    rounded(ctx, box.x, box.y, box.w, box.h, r);
    ctx.fillStyle = COLOURS.back;
    ctx.fill();
    ctx.strokeStyle = COLOURS.backLine;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.save();
    rounded(ctx, box.x + 5, box.y + 5, box.w - 10, box.h - 10, r * 0.6);
    ctx.clip();
    ctx.strokeStyle = 'rgba(155, 196, 235, 0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let d = -box.h; d < box.w; d += 9) {
      ctx.moveTo(box.x + d, box.y);
      ctx.lineTo(box.x + d + box.h, box.y + box.h);
      ctx.moveTo(box.x + d + box.h, box.y);
      ctx.lineTo(box.x + d, box.y + box.h);
    }
    ctx.stroke();
    ctx.restore();
  }

  /** A button-like label under a card; returns its box, for taps. */
  function pill(ctx, L, under, text, colour, filled) {
    ctx.font = `600 ${L.small}px system-ui`;
    const w = Math.min(Math.max(under.w, ctx.measureText(text).width + 22), L.strip.w / 3 - 4);
    const box = { x: under.x + under.w / 2 - w / 2, y: under.y + under.h + 5, w, h: L.pill };
    rounded(ctx, box.x, box.y, box.w, box.h, box.h / 2);
    ctx.fillStyle = filled ? colour : 'rgba(10, 14, 21, 0.6)';
    ctx.fill();
    ctx.strokeStyle = colour;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = filled ? COLOURS.stage : colour;
    ctx.textAlign = 'center';
    ctx.fillText(text, box.x + box.w / 2, box.y + box.h / 2 + L.small * 0.36, box.w - 10);
    return box;
  }

  function drawCards(ctx, s, L, g) {
    const done = over(g);
    // The past: the best card before the one that is up; once the game ends, the biggest of all.
    const before = done ? g.rank.indexOf(1) : bestBefore(g);
    if (before < 0) {
      rounded(ctx, L.before.x, L.before.y, L.before.w, L.before.h, Math.min(10, L.before.w * 0.08));
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = COLOURS.grid;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = COLOURS.muted;
      ctx.textAlign = 'center';
      ctx.font = `${L.small - 1}px system-ui`;
      ctx.fillText(t.labels.bestBefore, L.before.x + L.before.w / 2, L.before.y + L.before.h / 2 - 2, L.before.w - 8);
      ctx.fillText(t.labels.noneYet, L.before.x + L.before.w / 2, L.before.y + L.before.h / 2 + L.small + 2);
    } else
      faceUp(ctx, L.before, L, {
        label: done ? t.labels.biggest : t.labels.bestBefore,
        value: num(g.values[before]),
        note: t.labels.card(num(before + 1)),
        border: COLOURS.gold,
        line: done ? 3 : 2,
      });

    // Now: the card that is up, turning over when it arrives.
    const i = g.shown - 1;
    const turn = reduced ? 1 : g.flip;
    // The card narrows to its edge showing its back, then widens showing its face.
    ctx.save();
    ctx.translate(L.mine.x + L.mine.w / 2, 0);
    ctx.scale(Math.max(0.02, Math.abs(1 - 2 * turn)), 1);
    ctx.translate(-(L.mine.x + L.mine.w / 2), 0);
    if (turn < 0.5) faceDown(ctx, L.mine);
    else {
      const mine = g.rank[i];
      faceUp(ctx, L.mine, L, {
        label: t.labels.card(num(i + 1)),
        value: num(g.values[i]),
        note: done ? t.place(mine) : g.record[i] && i > 0 ? t.labels.newBest : '',
        border: done ? COLOURS.you : g.record[i] && i > 0 ? COLOURS.gold : COLOURS.faceLine,
        line: done || (g.record[i] && i > 0) ? 3 : 1.5,
        noteColour: done ? COLOURS.youInk : COLOURS.goldInk,
      });
    }
    ctx.restore();
    L.takePill = done ? null : pill(ctx, L, L.mine, t.take, COLOURS.gold, true);
    if (done) {
      ctx.fillStyle = COLOURS.you;
      ctx.font = `600 ${L.small}px system-ui`;
      ctx.textAlign = 'center';
      ctx.fillText(t.labels.yours, L.mine.x + L.mine.w / 2, L.mine.y + L.mine.h + 5 + L.pill * 0.66);
    }

    // What's to come: the deck, thinner as it goes.
    const left = N - g.shown;
    if (left > 0) {
      const layers = Math.min(3, left);
      for (let k = layers - 1; k >= 0; k--)
        faceDown(ctx, { x: L.deck.x + k * 3, y: L.deck.y - k * 3, w: L.deck.w, h: L.deck.h });
      const label = t.labels.left(num(left));
      ctx.font = `600 ${L.small}px system-ui`;
      const w = ctx.measureText(label).width + 12;
      ctx.fillStyle = 'rgba(10, 14, 21, 0.75)';
      ctx.fillRect(L.deck.x + L.deck.w / 2 - w / 2, L.deck.y + L.deck.h / 2 - L.small, w, L.small * 1.7);
      ctx.fillStyle = COLOURS.ink;
      ctx.textAlign = 'center';
      ctx.fillText(label, L.deck.x + L.deck.w / 2, L.deck.y + L.deck.h / 2 + L.small * 0.35, L.deck.w - 4);
    } else {
      rounded(ctx, L.deck.x, L.deck.y, L.deck.w, L.deck.h, Math.min(10, L.deck.w * 0.08));
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = COLOURS.grid;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);
    }
    L.nextPill = pill(ctx, L, L.deck, done ? t.again : t.next, COLOURS.you, false);
  }

  /**
   * Names under the strip (yours, the biggest, the rule), each on the first of two lines where it fits without
   * touching another. `used` holds the boxes already placed.
   */
  function name(ctx, L, text, x, colour, used) {
    ctx.font = `600 ${L.small - 1}px system-ui`;
    const w = ctx.measureText(text).width + 6;
    const left = Math.min(Math.max(L.strip.x, x - w / 2), L.strip.x + L.strip.w - w);
    let line = 0;
    while (line < 1 && used.some((u) => u.line === line && left < u.x + u.w && u.x < left + w)) line++;
    used.push({ x: left, w, line });
    const y = L.namesY + L.small * (1.35 + line * 1.2);
    ctx.fillStyle = colour;
    ctx.textAlign = 'left';
    ctx.fillText(text, left + 3, y);
  }

  /** One mark per card: gold where a card beat every card before it. When the game ends, every card's size. */
  function drawStrip(ctx, s, L, g) {
    const { strip } = L;
    const slot = strip.w / N,
      gap = slot > 5 ? 1.5 : slot > 3 ? 1 : 0.5;
    const done = over(g);
    const xOf = (i) => strip.x + i * slot;
    if (done && s.look > 0) {
      ctx.fillStyle = COLOURS.zone;
      ctx.fillRect(strip.x, strip.y - 3, slot * s.look, strip.h + 3);
    }
    for (let i = 0; i < N; i++) {
      let h, colour;
      if (done) {
        h = Math.max(0.08, (N - g.rank[i] + 1) / N);
        colour = g.rank[i] === 1 ? COLOURS.gold : COLOURS.seen;
      } else if (i < g.shown) {
        h = g.record[i] ? 1 : 0.42;
        colour = g.record[i] ? COLOURS.gold : COLOURS.seen;
      } else {
        h = 0.16;
        colour = COLOURS.grid;
      }
      ctx.fillStyle = colour;
      ctx.fillRect(xOf(i) + gap / 2, strip.y + strip.h * (1 - h), slot - gap, strip.h * h);
    }
    // A caret under a card.
    const caret = (i, colour) => {
      const x = xOf(i) + slot / 2;
      ctx.fillStyle = colour;
      ctx.beginPath();
      ctx.moveTo(x, strip.y + strip.h + 1);
      ctx.lineTo(x - 4, strip.y + strip.h + 6);
      ctx.lineTo(x + 4, strip.y + strip.h + 6);
      ctx.closePath();
      ctx.fill();
    };
    const used = [];
    if (!done) {
      caret(g.shown - 1, COLOURS.ink);
      return;
    }
    const rule = M.ruleChoice(g.values, s.look),
      biggest = g.rank.indexOf(1);
    // The rule's look, named inside its shaded stretch when it fits there, otherwise just after it.
    if (s.look > 0) {
      const text = t.labels.looks(num(s.look));
      ctx.font = `${L.small - 1}px system-ui`;
      const w = ctx.measureText(text).width + 6;
      const x = Math.min(w < xOf(s.look) - strip.x ? strip.x : xOf(s.look) + 2, strip.x + strip.w - w);
      ctx.fillStyle = 'rgba(10, 14, 21, 0.8)';
      ctx.fillRect(x, strip.y - 3, w, L.small + 2);
      ctx.fillStyle = COLOURS.rule;
      ctx.textAlign = 'left';
      ctx.fillText(text, x + 3, strip.y + L.small - 3);
    }
    caret(biggest, COLOURS.gold);
    caret(rule, COLOURS.rule);
    caret(g.taken, COLOURS.you);
    // A card with two or three names gets them together: "yours · the biggest".
    const byCard = new Map();
    for (const [i, text, colour] of [
      [g.taken, t.labels.yours, COLOURS.you],
      [biggest, t.labels.biggest, COLOURS.gold],
      [rule, t.labels.rule, COLOURS.rule],
    ]) {
      if (byCard.has(i)) byCard.get(i).names.push(text);
      else byCard.set(i, { names: [text], colour });
    }
    for (const [i, n] of byCard) name(ctx, L, t.labels.together(n.names), xOf(i) + slot / 2, n.colour, used);
  }

  /** The chart: for every number of cards just looked at, the chance the rule wins, simulated and exact. */
  function drawCurve(ctx, s, L, sims) {
    const { plot, small } = L;
    const key = goal(s);
    const top = s.top ? 1 : 0.5;
    const xOf = (r) => plot.x + ((r + 0.5) / N) * plot.w;
    const yOf = (p) => plot.y + plot.h * (1 - p / top);
    // Grid and axes.
    ctx.font = `${small - 1}px system-ui`;
    ctx.lineWidth = 1;
    const step = s.top ? 0.2 : 0.1;
    for (let v = 0; v <= top + 1e-9; v += step) {
      ctx.strokeStyle = COLOURS.grid;
      ctx.beginPath();
      ctx.moveTo(plot.x, yOf(v));
      ctx.lineTo(plot.x + plot.w, yOf(v));
      ctx.stroke();
      ctx.fillStyle = COLOURS.muted;
      ctx.textAlign = 'right';
      ctx.fillText(pct(v, 0), plot.x - 5, yOf(v) + small * 0.35);
    }
    for (let k = 0; k <= N; k += 20) {
      ctx.textAlign = k === 0 ? 'left' : k === N ? 'right' : 'center';
      ctx.fillText(num(k), plot.x + (k / N) * plot.w, plot.y + plot.h + small * 1.2);
    }
    ctx.textAlign = 'right';
    ctx.fillText(t.labels.xAxis, plot.x + plot.w, plot.y + plot.h + small * 2.4);
    ctx.textAlign = 'left';
    ctx.font = `600 ${small - 1}px system-ui`;
    ctx.fillStyle = COLOURS.curve;
    ctx.fillText(s.top ? t.labels.yTop : t.labels.yBest, plot.x, plot.y - small * 0.6);
    if (sims.deals) {
      ctx.textAlign = 'right';
      ctx.fillStyle = COLOURS.muted;
      ctx.font = `${small - 1}px system-ui`;
      ctx.fillText(t.labels.deals(num(sims.deals)), plot.x + plot.w, plot.y - small * 0.6);
    }
    // A card at random, for comparison.
    const random = (s.top ? TOP : 1) / N;
    ctx.setLineDash([2, 4]);
    ctx.strokeStyle = COLOURS.muted;
    ctx.beginPath();
    ctx.moveTo(plot.x, yOf(random));
    ctx.lineTo(plot.x + plot.w, yOf(random));
    ctx.stroke();
    ctx.setLineDash([]);
    // The simulated deals, as bars.
    const tallied = sims[key],
      bw = Math.max(1, plot.w / N - (plot.w > 400 ? 1.5 : 0.6));
    if (sims.deals) {
      ctx.fillStyle = COLOURS.bar;
      for (let r = 0; r < N; r++) {
        const y = yOf(tallied[r] / sims.deals);
        ctx.fillRect(xOf(r) - bw / 2, y, bw, plot.y + plot.h - y);
      }
    }
    // The exact chance, as a line over them.
    ctx.strokeStyle = 'rgba(10, 14, 21, 0.8)';
    ctx.lineWidth = 5;
    const line = () => {
      ctx.beginPath();
      exact[key].forEach((p, r) => (r ? ctx.lineTo(xOf(r), yOf(p)) : ctx.moveTo(xOf(r), yOf(p))));
      ctx.stroke();
    };
    line();
    ctx.strokeStyle = COLOURS.curve;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    line();
    // The line for a card at random is named on a dark box, over the bars.
    ctx.font = `${small - 1}px system-ui`;
    const label = t.labels.random(pct(random, 0)),
      lw = ctx.measureText(label).width;
    ctx.fillStyle = 'rgba(10, 14, 21, 0.8)';
    ctx.fillRect(plot.x + plot.w - lw - 8, yOf(random) - small - 4, lw + 8, small + 3);
    ctx.fillStyle = COLOURS.muted;
    ctx.textAlign = 'right';
    ctx.fillText(label, plot.x + plot.w - 4, yOf(random) - 5);
    // The peak, and the cutoff chosen with the slider.
    const tag = (r, colour, above) => {
      const x = xOf(r),
        y = yOf(exact[key][r]);
      ctx.fillStyle = colour;
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      const text = t.labels.peak(num(r), pct(exact[key][r]));
      ctx.font = `600 ${small}px system-ui`;
      const w = ctx.measureText(text).width;
      const tx = Math.min(Math.max(plot.x + 2, x - w / 2), plot.x + plot.w - w - 2);
      const ty = above ? Math.max(plot.y + small, y - 10) : Math.min(plot.y + plot.h - 4, y + small + 10);
      ctx.fillStyle = 'rgba(10, 14, 21, 0.78)';
      ctx.fillRect(tx - 4, ty - small, w + 8, small + 5);
      ctx.fillStyle = colour;
      ctx.textAlign = 'left';
      ctx.fillText(text, tx, ty);
    };
    const peak = peaks[key].cutoff;
    if (s.look !== peak) {
      const x = xOf(s.look);
      ctx.strokeStyle = COLOURS.rule;
      ctx.setLineDash([4, 3]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, plot.y + plot.h);
      ctx.lineTo(x, yOf(exact[key][s.look]));
      ctx.stroke();
      ctx.setLineDash([]);
    }
    tag(peak, COLOURS.curve, true);
    if (s.look !== peak) tag(s.look, COLOURS.rule, false);
  }

  /** Bigger decks, for the very best, worked out: the peak stays near a share of 37%, at a height near 37%. */
  function drawMore(ctx, L) {
    const box = L.more,
      small = L.small;
    ctx.font = `600 ${small}px system-ui`;
    ctx.fillStyle = COLOURS.muted;
    ctx.textAlign = 'left';
    ctx.fillText(t.labels.moreTitle, box.x, box.y + small, box.w);
    const shown = moreDecks().filter((d) => d.n !== N);
    const gap = small * 2,
      w = (box.w - gap * (shown.length - 1)) / shown.length;
    shown.forEach((d, k) => {
      const plot = { x: box.x + k * (w + gap) + small * 2.6, y: box.y + small * 3.4, w: 0, h: 0 };
      plot.w = box.x + k * (w + gap) + w - plot.x;
      plot.h = box.y + box.h - small * 2.6 - plot.y;
      const xOf = (x) => plot.x + x * plot.w,
        yOf = (p) => plot.y + plot.h * (1 - p / 0.5);
      ctx.font = `600 ${small - 1}px system-ui`;
      ctx.fillStyle = COLOURS.ink;
      ctx.textAlign = 'left';
      ctx.fillText(t.labels.more(num(d.n)), plot.x, plot.y - small * 0.9);
      ctx.font = `${small - 1}px system-ui`;
      ctx.lineWidth = 1;
      for (const v of [0, 0.25, 0.5]) {
        ctx.strokeStyle = COLOURS.grid;
        ctx.beginPath();
        ctx.moveTo(plot.x, yOf(v));
        ctx.lineTo(plot.x + plot.w, yOf(v));
        ctx.stroke();
        ctx.fillStyle = COLOURS.muted;
        ctx.textAlign = 'right';
        ctx.fillText(pct(v, 0), plot.x - 4, yOf(v) + small * 0.35);
      }
      ctx.textAlign = 'left';
      ctx.fillText(pct(0, 0), plot.x, plot.y + plot.h + small * 1.2);
      ctx.textAlign = 'right';
      ctx.fillText(t.labels.share(pct(1, 0)), plot.x + plot.w, plot.y + plot.h + small * 1.2);
      ctx.strokeStyle = COLOURS.curve;
      ctx.lineWidth = 2;
      ctx.beginPath();
      d.points.forEach(([x, p], i) => (i ? ctx.lineTo(xOf(x), yOf(p)) : ctx.moveTo(xOf(x), yOf(p))));
      ctx.stroke();
      const px = xOf(d.peak.cutoff / d.n),
        py = yOf(d.peak.chance);
      ctx.fillStyle = COLOURS.curve;
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = `600 ${small - 1}px system-ui`;
      const text = t.labels.peak(num(d.peak.cutoff), pct(d.peak.chance));
      const tw = ctx.measureText(text).width;
      ctx.textAlign = 'left';
      ctx.fillText(text, Math.min(Math.max(plot.x, px - tw / 2), plot.x + plot.w - tw), py - 8, plot.w);
    });
  }

  function scene(ctx, s, width, height, g, sims) {
    ctx.fillStyle = COLOURS.stage;
    ctx.fillRect(0, 0, width, height);
    ctx.textBaseline = 'alphabetic';
    ctx.direction = 'ltr'; // the cards and the chart keep their direction on right-to-left pages too
    const L = place(width, height);
    drawCards(ctx, s, L, g);
    drawStrip(ctx, s, L, g);
    drawCurve(ctx, s, L, sims);
    if (L.more) drawMore(ctx, L);
    return L;
  }

  function draw(ctx, s, stage) {
    if (!tally) restartSim();
    layout = scene(ctx, s, stage.width, stage.height, current(s), tally);
  }

  /**
   * The home card and link preview: the finished curve with its peak, and in the corner it leaves free, a card
   * that has just beaten all before it, beside the deck.
   */
  let previewTally = null;
  function preview(ctx, width, height) {
    previewTally ??= M.simulate(N, TOP, 4000, M.random(SIM_SEED), M.tallies(N));
    ctx.fillStyle = COLOURS.stage;
    ctx.fillRect(0, 0, width, height);
    ctx.direction = 'ltr';
    const small = Math.max(10, Math.round(Math.min(width, height) / 16));
    const plot = { x: width * 0.04, y: height * 0.12, w: width * 0.92, h: height * 0.82 };
    const xOf = (r) => plot.x + ((r + 0.5) / N) * plot.w,
      yOf = (p) => plot.y + plot.h * (1 - p / 0.5);
    const bw = Math.max(1, plot.w / N - 0.6);
    ctx.fillStyle = COLOURS.bar;
    for (let r = 0; r < N; r++) {
      const y = yOf(previewTally.best[r] / previewTally.deals);
      ctx.fillRect(xOf(r) - bw / 2, y, bw, plot.y + plot.h - y);
    }
    ctx.strokeStyle = COLOURS.curve;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    exact.best.forEach((p, r) => (r ? ctx.lineTo(xOf(r), yOf(p)) : ctx.moveTo(xOf(r), yOf(p))));
    ctx.stroke();
    const peak = peaks.best;
    const px = xOf(peak.cutoff),
      py = yOf(peak.chance);
    ctx.fillStyle = COLOURS.curve;
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = `600 ${small}px system-ui`;
    ctx.textAlign = 'center';
    ctx.fillText(pct(peak.chance, 0), px, py - 8);
    // The deck and a new best, top right, above the falling end of the curve and clear of its peak.
    const h = Math.min(height * 0.28, width * 0.25),
      w = h * 0.74;
    const deck = { x: width - w - width * 0.05, y: height * 0.08, w, h };
    for (let k = 2; k >= 0; k--) faceDown(ctx, { ...deck, x: deck.x + k * 2, y: deck.y - k * 2 });
    const saved = game; // the visitor's game, if there is one, stays as it was
    const g = dealGame(7);
    game = saved;
    const later = g.record.findIndex((beats, k) => beats && k >= 37);
    const i = later >= 0 ? later : g.rank.indexOf(1);
    faceUp(
      ctx,
      { ...deck, x: deck.x - w - width * 0.03 },
      { small: Math.max(8, Math.round(h * 0.11)) },
      {
        label: t.labels.card(num(i + 1)),
        value: num(g.values[i]),
        note: t.labels.newBest,
        border: COLOURS.gold,
        line: 2.5,
        noteColour: COLOURS.goldInk,
      },
    );
  }

  /** What a tap at p is on: the card that is up ('take') or the deck ('next'). */
  function hit(p, st) {
    if (!layout || !game) return null;
    const x = p.x * st.width,
      y = p.y * st.height;
    const inside = (r) => r && x >= r.x - 4 && x <= r.x + r.w + 4 && y >= r.y - 4 && y <= r.y + r.h + 4;
    if (!over(game) && (inside(layout.mine) || inside(layout.takePill))) return 'take';
    if (inside(layout.deck) || inside(layout.nextPill)) return 'next';
    return null;
  }

  // ---- The panel ----

  /** The numbers that change as deals are simulated and cards are turned: plain text, not a live region. */
  function live(s) {
    const g = current(s);
    $('scene-status').textContent = status(g);
    const sim = $('stopping-sim');
    if (sim)
      sim.textContent = tally?.deals
        ? t.readout.simulated(num(tally.deals), pct(tally[goal(s)][s.look] / tally.deals))
        : '';
    const words = $('stopping-result');
    if (words) words.textContent = result(s);
    // aria-disabled rather than disabled, so a keyboard keeps its place on the button once the game ends.
    $('stopping-take')?.setAttribute('aria-disabled', over(g));
    const button = $('stopping-next');
    if (button) button.textContent = over(g) ? t.again : t.next;
  }

  function readouts(s) {
    current(s);
    $('scene-name').textContent = t.sceneName;
    const key = goal(s);
    const box = $('stopping-readout');
    if (box)
      box.innerHTML =
        `<div class="stopping-big"><span>${t.readout[key](num(s.look))}</span><strong>${pct(exact[key][s.look])}</strong></div>` +
        '<p id="stopping-sim"></p>' +
        `<p>${t.readout.peak(num(peaks[key].cutoff), pct(peaks[key].chance))} ${t.readout.random(pct((s.top ? TOP : 1) / N, 0))}</p>` +
        (s.top
          ? ''
          : `<p class="stopping-more"><strong>${t.readout.moreTitle}</strong>` +
            moreDecks()
              .map((d) => `<span>${t.readout.more(num(d.n), num(d.peak.cutoff), pct(d.peak.chance))}</span>`)
              .join('') +
            '</p>');
    live(s);
  }

  function controls(s, stage) {
    return (
      `<div class="wide readout stopping-rules"><strong>${t.rules.title}</strong><p>${t.rules.text}</p>` +
      `<div class="segment stopping-buttons"><button type="button" id="stopping-next">${t.next}</button>` +
      `<button type="button" id="stopping-take">${t.take}</button></div>` +
      '<p class="stopping-result" id="stopping-result"></p></div>' +
      stage.slider('look', t.look, 0, N - 1, 1, s.look, '', t.lookHint) +
      stage.check('top', t.top, s.top) +
      // Rebuilt on every change, so not a live region; changes are announced instead.
      '<div class="wide readout stopping-readout" id="stopping-readout"></div>'
    );
  }

  function bindControls(panel, s, st) {
    $('stopping-next').addEventListener('click', () => next(s, st));
    $('stopping-take').addEventListener('click', () => take(s, st));
    const say = () => W.announce(`${t.readout[goal(s)](num(s.look))} ${pct(exact[goal(s)][s.look])}`);
    panel.querySelector('[data-check="top"]')?.addEventListener('change', () => {
      st.setChosen(-1);
      st.sync();
      say();
    });
    $('c-look')?.addEventListener('change', say);
  }

  W.defineRoom({
    id: 'stopping',
    symbol: 'ℯ',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'games',
    added: '2026-10-01',
    tagline: t.tagline,
    accent: { background: '#16283a', border: '#6cc3ff', color: '#bfe6ff' },

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
    connection: { ...t.connection, go: 'treasure' },

    still: true, // cards turn when asked; the curve fills in by itself, with nothing to pause
    defaults: { look: 37, top: false, seed: 1 },
    ranges: { look: [0, N - 1, 'integer'], seed: [1, MAX_SEED, 'integer'] },
    defaultPreset: 1,
    presets: [
      { settings: { look: 10, top: false } },
      { settings: { look: 37, top: false } },
      { settings: { look: 14, top: true } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Gardner',
        color: '#6cc3ff',
        sketch: { hairStyle: 'receding', hair: '#e6e2da', skin: '#efc9a8', brows: 'soft', backdrop: '#16283a' },
      },
      {
        ...t.guests[1],
        bio: 'Kepler',
        color: '#f7c948',
        // As in his portraits: dark hair, a moustache and a small pointed beard.
        sketch: {
          hairStyle: 'short',
          hair: '#3a2c22',
          skin: '#eac3a0',
          beard: 'goatee',
          moustache: true,
          backdrop: '#2b2616',
        },
      },
    ],

    insight: t.insight,

    controls,
    bindControls,
    readouts,
    draw,
    preview,
    enter(s) {
      dealGame(s.seed);
      restartSim();
      live(s); // with reduced motion, every deal is already played
    },
    step(dt, s) {
      const g = current(s);
      if (g.flip < 1) g.flip = Math.min(1, g.flip + dt / FLIP_SECONDS);
      if (tally && tally.deals < DEALS) {
        due += dt * DEALS_PER_SECOND;
        const deals = Math.min(DEALS - tally.deals, Math.floor(due));
        if (deals > 0) {
          due -= deals;
          M.simulate(N, TOP, deals, simRand, tally);
          live(s);
        }
      }
    },
    action: again,
    reset(s, st) {
      dealGame(s.seed);
      restartSim();
      st.sync();
      st.draw();
    },

    pointer: {
      // Touches on the card that is up and on the deck are taps, not scrolls; anywhere else the page scrolls.
      drag: (p, s, st) => !!hit(p, st),
      down(p, s, st, e) {
        pressed = e && e.button !== 0 ? null : hit(p, st); // a right-click or a pen's side button isn't a tap
        travel = 0;
      },
      move(p, m) {
        if (m.dragging) travel += Math.abs(m.dx) + Math.abs(m.dy);
      },
      // A press counts when it lifts without wandering off, so a swipe that starts on a card never takes it.
      up(e) {
        const target = pressed;
        pressed = null;
        if (!target || travel > 12 || e?.type === 'pointercancel') return;
        const st = W.stage;
        (target === 'take' ? take : next)(st.settingsFor('stopping'), st);
      },
      // → turns cards only while a game is on, so holding it down never runs on into a new deal.
      arrow(dx, dy, s, st) {
        if (dx <= 0 && dy <= 0) W.announce(t.announce.noGoingBack);
        else if (over(current(s))) W.announce(t.announce.over);
        else next(s, st);
      },
      key(e, s, st) {
        if (e.key !== 'Enter') return false;
        take(s, st);
        return true;
      },
    },
  });
})();
