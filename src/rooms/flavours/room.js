/* Room · The machine that found flavours: a table of likes full of blanks becomes a map of flavours (matrix factorisation). */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $ } = W;
  const M = W.models.flavours;
  const t = W.text('flavours');
  const reduced = W.prefersReducedMotion();

  // The foods' pictures, in the model's order: the visitor's own device draws them.
  const ICONS = ['🍫', '🍦', '🍩', '🥞', '🍓', '🍉', '🥭', '🍿', '🍕', '🍔', '🍟', '🧀', '🥗', '🥒', '🍣', '🥦'];
  const EMOJI = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
  const FLIGHT = 0.9; // seconds the foods take to fly from the table onto the map
  const SLOW = 120; // the first rounds go slowly, so the sorting can be followed
  const COLOURS = {
    like: '#fbbf24',
    not: '#60a5fa',
    ink: '#e8edf2',
    soft: '#aab6c3',
    faint: '#5d6b7c',
    star: '#fde047',
    planted: '#f472b6',
    panel: '#0f151e',
    line: '#243042',
  };

  // The run being shown. It is made from the seed and the share of blanks alone, so a link replays the same map.
  const state = {
    key: '',
    data: null,
    fit: null,
    time: 0, // seconds since the run began
    quick: false, // a rerun after a change: no flight, and faster
    budget: 0, // the rounds the run may have reached by now
    shown: -1, // the round the panel last showed
    announced: false,
    view: null, // the part of the map in view, in the method's units: { x0, x1, y0, y1 }
    cursor: -1, // the food chosen with the keyboard or a tap
    hover: -1, // the food under the mouse
    spots: [], // where each food is drawn on the map: { x, y, r }
    rows: [], // each food's row in the table: { x, y, w, h, ix, iy } (ix, iy: its picture)
    emoji: null, // whether this device draws the foods' pictures
  };

  const keyOf = (s) => `${s.seed}|${s.blanks}`;
  const speed = (round, quick) => (quick ? 3 : 1) * (round < SLOW ? 40 : 220); // rounds per second
  const percent = () => Math.round(100 * M.blanksRight(state.data, state.fit));
  const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - (1 - x) ** 3);

  function restart(s, stage, quick = false) {
    state.key = keyOf(s);
    state.data = M.table(s.seed, s.blanks);
    state.fit = M.start(state.data);
    state.time = 0;
    state.budget = 0;
    state.quick = quick;
    state.shown = -1;
    state.announced = false;
    state.view = null;
    if (reduced || !stage.playing) settle();
  }

  /** Run the method to the end at once (nothing moves, or the room is paused). */
  function settle() {
    while (!state.fit.settled) M.step(state.data, state.fit);
    state.time = FLIGHT;
    state.view = null;
    announceFound();
  }

  function announceFound() {
    if (state.announced || !state.fit.settled) return;
    state.announced = true;
    W.announce(state.data.hidden ? t.announce.found(state.fit.round, percent()) : t.announce.full(state.fit.round));
  }

  /** The visitor's point and suggestions, from their ratings and the map as it stands. */
  function yours(s) {
    const ratings = M.decode(s.likes);
    const you = state.fit ? M.place(state.fit.foods, ratings) : null;
    return { ratings, you, picks: you ? M.suggest(you, state.fit.foods, ratings) : [] };
  }

  const pickList = (picks) => picks.map((j) => `${ICONS[j]} ${t.foods[j]}`).join(' · ');

  /** Rate food j: `next` turns its rating (0 none, 1 like, −1 not) into the new one. */
  function rate(j, next, s, stage) {
    const ratings = M.decode(s.likes);
    ratings[j] = next(ratings[j]);
    s.likes = M.encode(ratings);
    state.cursor = j;
    stage.setChosen(-1);
    stage.sync();
    stage.draw();
    const { picks, you } = yours(s);
    const word = ratings[j] > 0 ? t.announce.like : ratings[j] < 0 ? t.announce.not : t.announce.unrated;
    W.announce(
      `${t.announce.rate(t.foods[j], word)} ${you ? (picks.length ? t.announce.suggest(pickList(picks)) : t.announce.nothing) : ''}`.trim(),
    );
  }

  function step(dt, s, stage) {
    if (state.key !== keyOf(s)) restart(s, stage, true);
    state.time += dt;
    const fit = state.fit;
    if (!fit.settled && (state.quick || state.time > FLIGHT)) {
      state.budget += dt * speed(fit.round, state.quick);
      while (!fit.settled && fit.round < state.budget) M.step(state.data, fit);
      if (fit.settled) announceFound();
      // The panel follows every few rounds (its suggestions move with the map), and once more at the end.
      if (fit.settled || fit.round - state.shown >= 6) stage.sync();
    }
    const target = targetView(s);
    if (!state.view) state.view = target;
    else {
      const k = 1 - Math.exp(-dt * 5);
      for (const key of ['x0', 'x1', 'y0', 'y1']) state.view[key] += (target[key] - state.view[key]) * k;
    }
  }

  // ——— Drawing ———

  /** Whether this device draws the foods' pictures in colour; if not, the foods are drawn as lettered discs. */
  function canDrawFood() {
    if (state.emoji !== null) return state.emoji;
    state.emoji = false;
    try {
      const c = document.createElement('canvas');
      c.width = c.height = 24;
      const x = c.getContext('2d', { willReadFrequently: true });
      x.font = `20px ${EMOJI}`;
      x.textAlign = 'center';
      x.textBaseline = 'middle';
      x.fillText('🍓', 12, 12);
      const d = x.getImageData(0, 0, 24, 24).data;
      for (let k = 0; k < d.length; k += 4)
        if (d[k + 3] > 100 && Math.abs(d[k] - d[k + 1]) > 40) {
          state.emoji = true;
          break;
        }
    } catch {
      state.emoji = false;
    }
    return state.emoji;
  }

  function food(ctx, j, x, y, size) {
    if (canDrawFood()) {
      ctx.font = `${Math.round(size)}px ${EMOJI}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = COLOURS.ink;
      ctx.fillText(ICONS[j], x, y + size * 0.05);
      return;
    }
    ctx.fillStyle = `hsl(${(j * 360) / M.FOODS}, 55%, 55%)`;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0a0e15';
    ctx.font = `700 ${Math.round(size * 0.5)}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(t.foods[j].slice(0, 1), x, y + 1);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, Math.max(0, Math.min(r, w / 2, h / 2)));
  }

  function star(ctx, x, y, r) {
    ctx.beginPath();
    for (let k = 0; k < 10; k++) {
      const a = -Math.PI / 2 + (k * Math.PI) / 5,
        rr = k % 2 ? r * 0.45 : r;
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath();
  }

  /** The table: a row per food, a column per invented person, and the visitor's own column (`words`: its heading). */
  function drawGrid(ctx, box, small, s, mine, words = true) {
    const { data, fit } = state;
    const head = words ? small * 1.8 : 0,
      foot = words && box.h > 260 ? small * 2 : 0;
    const rh = (box.h - head - foot) / M.FOODS;
    const icon = Math.max(9, Math.min(22, rh * 0.72));
    ctx.font = `600 ${small}px system-ui`;
    const names = box.w >= 250 && rh >= 15;
    const nameW = names ? Math.min(box.w * 0.3, Math.max(...t.foods.map((n) => ctx.measureText(n).width))) : 0;
    const lw = icon + 6 + (names ? nameW + 6 : 0);
    const yw = Math.max(12, Math.min(30, rh * 0.95));
    const x0 = box.x + lw + yw + 6;
    const pitch = (box.x + box.w - x0) / M.PEOPLE;
    const top = box.y + head;
    state.rows = [];

    // Heading: the visitor's column, then the people's.
    ctx.textBaseline = 'middle';
    if (words) {
      ctx.fillStyle = COLOURS.star;
      ctx.textAlign = 'center';
      ctx.font = `700 ${small}px system-ui`;
      ctx.fillText(t.labels.you, box.x + lw + yw / 2, box.y + head * 0.45);
      ctx.fillStyle = COLOURS.soft;
      ctx.textAlign = 'left';
      ctx.font = `600 ${small}px system-ui`;
      ctx.fillText(t.labels.people, x0, box.y + head * 0.45, box.x + box.w - x0);
    }

    const dot = Math.min(pitch * 0.4, rh * 0.32);
    for (let j = 0; j < M.FOODS; j++) {
      const y = top + j * rh,
        cy = y + rh / 2;
      // A faint band on every other row, and a brighter one on the chosen food.
      if (j === state.cursor || j === state.hover) {
        ctx.fillStyle = 'rgba(253, 224, 71, 0.12)';
        roundRect(ctx, box.x, y, box.w, rh, 4);
        ctx.fill();
      } else if (j % 2) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.fillRect(box.x, y, box.w, rh);
      }
      food(ctx, j, box.x + icon / 2 + 2, cy, icon);
      if (names) {
        ctx.font = `600 ${small}px system-ui`;
        ctx.fillStyle = COLOURS.ink;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(t.foods[j], box.x + icon + 8, cy, nameW);
      }
      state.rows.push({ x: box.x, y, w: lw + yw, h: rh, ix: box.x + icon / 2 + 2, iy: cy, size: icon });

      // The visitor's cell: a heart, a cross, or an empty box (with a faint guess once there is a star).
      const r = mine.ratings[j];
      const cx = box.x + lw + yw / 2,
        cw = yw - 4,
        ch = Math.min(rh - 3, yw);
      roundRect(ctx, cx - cw / 2, cy - ch / 2, cw, ch, 4);
      if (r) {
        ctx.fillStyle = r > 0 ? COLOURS.like : COLOURS.not;
        ctx.fill();
        ctx.fillStyle = '#111722';
        ctx.font = `800 ${Math.round(ch * 0.62)}px system-ui`;
        ctx.textAlign = 'center';
        ctx.fillText(r > 0 ? '♥' : '✕', cx, cy + 1);
      } else {
        ctx.strokeStyle = COLOURS.faint;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
        if (mine.you) {
          const g = mine.you[0] * fit.foods[2 * j] + mine.you[1] * fit.foods[2 * j + 1];
          ctx.globalAlpha = Math.min(1, Math.abs(g));
          ctx.strokeStyle = g >= 0 ? COLOURS.like : COLOURS.not;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, cy, Math.min(cw, ch) * 0.28, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      // The people's cells: filled where they said, a ring where the method guesses.
      for (let i = 0; i < M.PEOPLE; i++) {
        const px = x0 + (i + 0.5) * pitch;
        const k = i * M.FOODS + j;
        if (data.known[k]) {
          ctx.fillStyle = data.truth[k] > 0 ? COLOURS.like : COLOURS.not;
          if (dot >= 2) {
            ctx.beginPath();
            ctx.arc(px, cy, dot, 0, Math.PI * 2);
            ctx.fill();
          } else ctx.fillRect(px - pitch * 0.4, cy - rh * 0.3, pitch * 0.8, rh * 0.6);
          continue;
        }
        const g = M.guess(fit.people, fit.foods, i, j);
        const sure = Math.min(1, Math.abs(g));
        ctx.globalAlpha = 0.25 + 0.75 * sure;
        if (dot >= 2) {
          ctx.strokeStyle = sure < 0.08 ? COLOURS.faint : g >= 0 ? COLOURS.like : COLOURS.not;
          ctx.lineWidth = Math.max(1, dot * 0.4);
          ctx.beginPath();
          ctx.arc(px, cy, dot * 0.8, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.globalAlpha *= 0.45;
          ctx.fillStyle = sure < 0.08 ? COLOURS.faint : g >= 0 ? COLOURS.like : COLOURS.not;
          ctx.fillRect(px - pitch * 0.4, cy - rh * 0.3, pitch * 0.8, rh * 0.6);
        }
        ctx.globalAlpha = 1;
      }
    }

    // The key, under the table where there is room.
    if (foot) {
      const y = box.y + box.h - foot / 2;
      let x = box.x + 2;
      ctx.font = `600 ${small - 1}px system-ui`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const r = Math.max(3, small * 0.32);
      for (const [label, colour, ring] of [
        [t.labels.liked, COLOURS.like, false],
        [t.labels.disliked, COLOURS.not, false],
        [t.labels.guessed, COLOURS.soft, true],
      ]) {
        const w = ctx.measureText(label).width;
        if (x + r * 2 + 6 + w > box.x + box.w) break;
        ctx.beginPath();
        ctx.arc(x + r, y, r, 0, Math.PI * 2);
        if (ring) {
          ctx.strokeStyle = colour;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          ctx.fillStyle = colour;
          ctx.fill();
        }
        ctx.fillStyle = COLOURS.soft;
        ctx.fillText(label, x + r * 2 + 5, y);
        x += r * 2 + 5 + w + small * 1.1;
      }
    }
  }

  /** The part of the map to show: every food, the middle, and the visitor's star (and the planted traits). */
  function targetView(s) {
    const { fit } = state;
    let x0 = 0,
      x1 = 0,
      y0 = 0,
      y1 = 0;
    const take = (x, y) => {
      x0 = Math.min(x0, x);
      x1 = Math.max(x1, x);
      y0 = Math.min(y0, y);
      y1 = Math.max(y1, y);
    };
    for (let j = 0; j < M.FOODS; j++) take(fit.foods[2 * j], fit.foods[2 * j + 1]);
    const { you } = yours(s);
    if (you) take(you[0], you[1]);
    if (s.reveal && fit.settled) {
      const a = M.align(fit.foods);
      for (const p of [
        [1.1, 0],
        [-1.1, 0],
        [0, 1.1],
        [0, -1.1],
      ])
        take(...a.at(p));
    }
    const span = Math.max(x1 - x0, y1 - y0, 1e-3) * 0.08;
    return { x0: x0 - span, x1: x1 + span, y0: y0 - span, y1: y1 + span };
  }

  /** Where the map puts a point of the method's: y grows upwards, as in mathematics. */
  function projector(view, plot) {
    const scale = Math.min(plot.w / (view.x1 - view.x0), plot.h / (view.y1 - view.y0));
    const cx = (view.x0 + view.x1) / 2,
      cy = (view.y0 + view.y1) / 2;
    return (x, y) => [plot.x + plot.w / 2 + (x - cx) * scale, plot.y + plot.h / 2 - (y - cy) * scale];
  }

  /**
   * Foods drawn on top of each other are eased apart a little, so each picture shows: at most half a picture's
   * width from where the method put it.
   */
  function spread(spots, size) {
    const home = spots.map((p) => [p.x, p.y]);
    const gap = size * 0.9,
      most = size * 0.5;
    for (let round = 0; round < 12; round++)
      for (let a = 0; a < spots.length; a++)
        for (let b = a + 1; b < spots.length; b++) {
          const p = spots[a],
            q = spots[b];
          let dx = q.x - p.x,
            dy = q.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d >= gap) continue;
          if (d < 1e-6) [dx, dy] = [Math.cos(a + b), Math.sin(a + b)];
          const push = ((gap - Math.max(d, 1e-6)) / 2) * 0.5,
            len = Math.hypot(dx, dy);
          p.x -= (dx / len) * push;
          p.y -= (dy / len) * push;
          q.x += (dx / len) * push;
          q.y += (dy / len) * push;
        }
    spots.forEach((p, j) => {
      const dx = p.x - home[j][0],
        dy = p.y - home[j][1],
        d = Math.hypot(dx, dy);
      if (d > most) {
        p.x = home[j][0] + (dx / d) * most;
        p.y = home[j][1] + (dy / d) * most;
      }
    });
  }

  /**
   * Labels beside their foods, each where it covers the fewest others (below, above, right or left) and stays inside
   * `frame`, the map's box: a longer name, in some languages, would otherwise run off the edge.
   */
  function placeLabels(ctx, spots, size, frame) {
    const boxes = spots.map((p) => ({ x: p.x - p.r, y: p.y - p.r, w: 2 * p.r, h: 2 * p.r }));
    const overlap = (a, b) =>
      Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) *
      Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
    const placed = [];
    spots.forEach((p, j) => {
      const w = ctx.measureText(t.foods[j]).width,
        h = size * 1.2;
      const options = [
        { x: p.x - w / 2, y: p.y + p.r, w, h },
        { x: p.x - w / 2, y: p.y - p.r - h, w, h },
        { x: p.x + p.r + 2, y: p.y - h / 2, w, h },
        { x: p.x - p.r - 2 - w, y: p.y - h / 2, w, h },
      ];
      let best = options[0],
        least = Infinity;
      for (const o of options) {
        let cost = 0;
        for (const b of [...placed, ...boxes.filter((_, k) => k !== j)]) cost += overlap(o, b);
        cost += 4 * (o.w * o.h - overlap(o, frame));
        if (cost < least - 1) {
          least = cost;
          best = o;
        }
      }
      best.x = Math.max(frame.x, Math.min(best.x, frame.x + frame.w - w));
      best.y = Math.max(frame.y, Math.min(best.y, frame.y + frame.h - h));
      placed.push(best);
    });
    return placed;
  }

  /** The map: the foods where the method has put them, the visitor's star, and on request the planted traits. */
  function drawMap(ctx, box, small, s, mine, decorate = true) {
    const { fit } = state;
    ctx.fillStyle = COLOURS.panel;
    roundRect(ctx, box.x, box.y, box.w, box.h, 12);
    ctx.fill();
    const pad = Math.max(8, small * 0.9);
    const titleH = decorate ? small * 2 : 0,
      footH = decorate ? small * (box.w < 380 ? 3.4 : 2.2) : 0;
    const icon = Math.max(14, Math.min(34, Math.min(box.w, box.h) / 16));
    const plot = {
      x: box.x + pad + icon * 0.6,
      y: box.y + titleH + pad * 0.5 + icon * 0.6,
      w: box.w - 2 * pad - icon * 1.2,
      h: box.h - titleH - footH - pad - icon * 1.2,
    };
    const at = projector(state.view || targetView(s), plot);

    if (decorate) {
      ctx.font = `600 ${small}px system-ui`;
      ctx.fillStyle = COLOURS.soft;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const planted = s.reveal && fit.settled;
      const a = planted ? M.align(fit.foods) : null;
      if (planted) ctx.fillStyle = COLOURS.planted;
      const title = planted ? t.labels.planted(Math.abs(Math.round(a.angle)), a.flipped) : t.labels.map;
      ctx.fillText(title, box.x + pad, box.y + titleH / 2 + 2, box.w - 2 * pad);
    }

    // The middle of the map: a guess there is zero, neither like nor not.
    const [ox, oy] = at(0, 0);
    ctx.strokeStyle = COLOURS.line;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ox - 7, oy);
    ctx.lineTo(ox + 7, oy);
    ctx.moveTo(ox, oy - 7);
    ctx.lineTo(ox, oy + 7);
    ctx.stroke();

    // The visitor's direction: a dashed line from the middle through the star, and a faint tint on the side of
    // the map whose foods the method guesses they like.
    if (mine.you && decorate) {
      const [sx, sy] = at(mine.you[0], mine.you[1]);
      const dx = sx - ox,
        dy = sy - oy,
        len = Math.hypot(dx, dy) || 1;
      const ux = dx / len,
        uy = dy / len,
        far = box.w + box.h;
      ctx.save();
      roundRect(ctx, box.x, box.y, box.w, box.h, 12);
      ctx.clip();
      ctx.fillStyle = 'rgba(253, 224, 71, 0.05)';
      ctx.beginPath();
      ctx.moveTo(ox - uy * far, oy + ux * far);
      ctx.lineTo(ox - uy * far + ux * far, oy + ux * far + uy * far);
      ctx.lineTo(ox + uy * far + ux * far, oy - ux * far + uy * far);
      ctx.lineTo(ox + uy * far, oy - ux * far);
      ctx.fill();
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox + ux * far, oy + uy * far);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // The planted traits, laid over the map: two axes, and each food's planted place joined to where it was found.
    if (s.reveal && fit.settled && decorate) {
      const a = M.align(fit.foods);
      ctx.strokeStyle = COLOURS.planted;
      ctx.fillStyle = COLOURS.planted;
      ctx.lineWidth = 1.5;
      ctx.font = `700 ${small}px system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const [end, label] of [
        [[1, 0], t.labels.sweet],
        [[-1, 0], t.labels.savoury],
        [[0, 1], t.labels.rich],
        [[0, -1], t.labels.light],
      ]) {
        const [ex, ey] = at(...a.at(end.map((v) => v * 1.1)));
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        ctx.globalAlpha = 1;
        const ang = Math.atan2(ey - oy, ex - ox);
        const lx = ex + Math.cos(ang) * small * 0.9,
          ly = ey + Math.sin(ang) * small * 0.9;
        ctx.lineWidth = 3;
        ctx.strokeStyle = COLOURS.panel;
        ctx.strokeText(label, lx, ly);
        ctx.fillText(label, lx, ly);
        ctx.strokeStyle = COLOURS.planted;
        ctx.lineWidth = 1.5;
      }
      ctx.lineWidth = 1;
      for (let j = 0; j < M.FOODS; j++) {
        const [gx, gy] = at(...a.at(M.TRAITS[j]));
        const [fx, fy] = at(fit.foods[2 * j], fit.foods[2 * j + 1]);
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(gx, gy);
        ctx.lineTo(fx, fy);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(gx, gy, Math.max(3, icon * 0.14), 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // The foods. At first they fly in from the table, one after another.
    const flying = !state.quick && state.time < FLIGHT && state.rows.length === M.FOODS;
    state.spots = [];
    for (let j = 0; j < M.FOODS; j++) {
      let [x, y] = at(fit.foods[2 * j], fit.foods[2 * j + 1]);
      let size = icon;
      if (flying) {
        const f = ease((state.time - j * 0.025) / (FLIGHT - 0.4));
        const row = state.rows[j];
        x = row.ix + (x - row.ix) * f;
        y = row.iy + (y - row.iy) * f;
        size = row.size + (icon - row.size) * f;
      }
      state.spots.push({ x, y, r: size * 0.6 });
    }
    if (!flying) spread(state.spots, icon);
    const pulse = reduced ? 0 : Math.sin(performance.now() / 300) * 0.08;
    mine.picks.forEach((j, rank) => {
      const p = state.spots[j];
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 1.9);
      glow.addColorStop(0, 'rgba(253, 224, 71, 0.45)');
      glow.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 1.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = COLOURS.star;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (1.25 + pulse), 0, Math.PI * 2);
      ctx.stroke();
      if (decorate) {
        const bx = p.x - p.r * 1.05,
          by = p.y - p.r * 1.05,
          br = Math.max(6, small * 0.6);
        ctx.fillStyle = COLOURS.star;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#111722';
        ctx.font = `800 ${Math.round(br * 1.3)}px system-ui`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(rank + 1), bx, by + 1);
      }
    });
    state.spots.forEach((p, j) => {
      if (j === state.cursor || j === state.hover) {
        ctx.strokeStyle = COLOURS.ink;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 1.1, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      food(ctx, j, p.x, p.y, p.r / 0.6);
      const r = mine.ratings[j];
      if (r && decorate) {
        const bx = p.x + p.r * 0.95,
          by = p.y - p.r * 0.85,
          br = Math.max(6, small * 0.6);
        ctx.fillStyle = r > 0 ? COLOURS.like : COLOURS.not;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#111722';
        ctx.font = `800 ${Math.round(br * 1.25)}px system-ui`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(r > 0 ? '♥' : '✕', bx, by + 1);
      }
    });

    // Names, where the map is big enough for them.
    if (decorate && !flying && Math.min(box.w, box.h) >= 360) {
      const size = small - 1;
      ctx.font = `600 ${size}px system-ui`;
      const labels = placeLabels(ctx, state.spots, size, {
        x: box.x + 4,
        y: box.y + titleH,
        w: box.w - 8,
        h: box.h - titleH - footH,
      });
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      labels.forEach((l, j) => {
        ctx.lineWidth = 3;
        ctx.strokeStyle = COLOURS.panel;
        ctx.strokeText(t.foods[j], l.x, l.y + 1);
        ctx.fillStyle = j === state.cursor || j === state.hover ? COLOURS.ink : COLOURS.soft;
        ctx.fillText(t.foods[j], l.x, l.y + 1);
      });
    } else if (decorate && !flying && state.hover >= 0) {
      // On a small map, only the food under the pointer is named.
      const p = state.spots[state.hover];
      ctx.font = `600 ${small}px system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.lineWidth = 3;
      ctx.strokeStyle = COLOURS.panel;
      ctx.strokeText(t.foods[state.hover], p.x, p.y + p.r);
      ctx.fillStyle = COLOURS.ink;
      ctx.fillText(t.foods[state.hover], p.x, p.y + p.r);
    }

    // The visitor's star.
    if (mine.you && decorate) {
      const [sx, sy] = at(mine.you[0], mine.you[1]);
      const r = Math.max(8, icon * 0.42);
      star(ctx, sx, sy, r);
      ctx.fillStyle = COLOURS.star;
      ctx.fill();
      ctx.strokeStyle = '#111722';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.font = `700 ${small}px system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.lineWidth = 3;
      ctx.strokeStyle = COLOURS.panel;
      ctx.strokeText(t.labels.you2, sx, sy + r + 2);
      ctx.fillStyle = COLOURS.star;
      ctx.fillText(t.labels.you2, sx, sy + r + 2);
    }

    // Under the map: how many blanks it guessed right, and an invitation to rate.
    if (decorate && fit.settled) {
      const y = box.y + box.h - footH / 2;
      const result = state.data.hidden ? t.labels.right(percent()) : t.labels.noBlanks;
      ctx.font = `700 ${small + 1}px system-ui`;
      ctx.textBaseline = 'middle';
      const two = box.w < 380;
      ctx.textAlign = 'left';
      ctx.fillStyle = COLOURS.ink;
      ctx.fillText(result, box.x + pad, two ? y - small * 0.8 : y, box.w - 2 * pad);
      if (!mine.you) {
        ctx.font = `600 ${small}px system-ui`;
        ctx.fillStyle = COLOURS.star;
        ctx.textAlign = two ? 'left' : 'right';
        ctx.fillText(
          t.labels.tapHint,
          two ? box.x + pad : box.x + box.w - pad,
          two ? y + small * 0.8 : y,
          two ? box.w - 2 * pad : box.w * 0.45,
        );
      }
    }
  }

  function layout(width, height) {
    const small = Math.round(Math.min(13, Math.max(9, Math.min(width, height) / 30)));
    const pad = Math.max(6, Math.min(16, Math.min(width, height) * 0.025));
    if (width < height * 0.95) {
      // Tall: the table above the map.
      const gh = Math.max(150, height * 0.4);
      return {
        small,
        grid: { x: pad, y: pad, w: width - 2 * pad, h: gh - pad },
        map: { x: pad, y: gh + pad * 0.5, w: width - 2 * pad, h: height - gh - pad * 1.5 },
      };
    }
    const gw = Math.max(130, Math.min(440, width * 0.4));
    return {
      small,
      grid: { x: pad, y: pad, w: gw, h: height - 2 * pad },
      map: { x: pad * 2 + gw, y: pad, w: width - gw - pad * 3, h: height - 2 * pad },
    };
  }

  function draw(ctx, s, stage) {
    if (state.key !== keyOf(s) || !state.fit) restart(s, stage, !!state.fit);
    if (!state.view || reduced || !stage.playing) state.view = targetView(s);
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, stage.width, stage.height);
    const L = layout(stage.width, stage.height);
    const mine = yours(s);
    drawGrid(ctx, L.grid, L.small, s, mine);
    drawMap(ctx, L.map, L.small, s, mine);
  }

  /** The map's picture: the found map with its foods, and the table either side where the picture is wide. */
  function preview(ctx, width, height) {
    const saved = { ...state };
    const s = { seed: DEFAULTS.seed, blanks: DEFAULTS.blanks, likes: 0, reveal: false };
    state.data = M.table(s.seed, s.blanks);
    state.fit = M.solve(state.data);
    state.time = FLIGHT;
    state.quick = true;
    state.cursor = state.hover = -1;
    state.view = targetView(s);
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    const side = Math.min(width, height);
    const mine = { ratings: M.decode(0), you: null, picks: [] };
    if (width > height * 1.3) {
      // The table, dimmed, behind the map.
      drawGrid(ctx, { x: 4, y: 4, w: width - 8, h: height - 8 }, 9, s, mine, false);
      ctx.fillStyle = 'rgba(10, 14, 21, 0.55)';
      ctx.fillRect(0, 0, width, height);
    }
    state.rows = [];
    drawMap(ctx, { x: (width - side) / 2, y: 0, w: side, h: side }, 10, s, mine, false);
    Object.assign(state, saved);
  }

  function readouts(s) {
    const { fit } = state;
    if (!fit) return;
    state.shown = fit.round;
    $('scene-status').textContent = !fit.settled
      ? t.status.running(fit.round)
      : state.data.hidden
        ? t.status.right(percent())
        : t.status.full;
    $('scene-action').textContent = s.reveal ? t.hideLabel : t.actionLabel;
    const box = $('flavours-readout');
    if (!box) return;
    const { ratings, you, picks } = yours(s);
    const body = !you
      ? `<p>${t.readout.empty}</p>`
      : picks.length
        ? `<p class="flavours-picks">${picks.map((j, k) => `<span>${k + 1}. ${ICONS[j]} ${t.foods[j]}</span>`).join('')}</p>`
        : `<p>${t.readout.none}</p>`;
    box.innerHTML = `<strong>${t.readout.title}</strong>${body}<p class="flavours-note">${t.readout.stays}</p>`;
    $('flavours-clear').hidden = !ratings.some(Boolean);
  }

  const DEFAULTS = { seed: 1, blanks: 60, likes: 0, reveal: false };
  // The presets' ratings: like chocolate and strawberries, not chips or broccoli; or only two puddings.
  const SWEET = M.encode([1, 0, 0, 0, 1, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1]);
  const PUDDINGS = M.encode([1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  /** The food at a point of the canvas: on the map, or a row's picture, name or the visitor's cell in the table. */
  function hit(x, y) {
    let best = -1,
      near = Infinity;
    state.spots.forEach((p, j) => {
      const d = Math.hypot(x - p.x, y - p.y);
      if (d <= Math.max(p.r * 1.15, 14) && d < near) {
        near = d;
        best = j;
      }
    });
    if (best >= 0) return best;
    return state.rows.findIndex((r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h);
  }

  W.defineRoom({
    id: 'flavours',
    symbol: '✦',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'signals',
    added: '2026-10-17',
    tagline: t.tagline,
    accent: { background: '#2a2618', border: '#fbbf24', color: '#fde68a' },

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
    connection: { ...t.connection, go: 'compress' },

    defaults: { ...DEFAULTS },
    ranges: { seed: [1, 999999, 'integer'], blanks: [0, 90, 'integer'], likes: [0, 3 ** M.FOODS - 1, 'integer'] },
    defaultPreset: 0,
    presets: [
      { settings: { blanks: 60, likes: 0, reveal: false } },
      { settings: { blanks: 60, likes: SWEET, reveal: false } },
      { settings: { blanks: 60, likes: PUDDINGS, reveal: false } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Beltrami',
        color: '#fbbf24',
        sketch: {
          hairStyle: 'swept',
          hair: '#3b2f2a',
          skin: '#e9c4a2',
          beard: 'full',
          brows: 'bold',
          backdrop: '#2a2618',
        },
      },
      {
        ...t.guests[1],
        bio: 'Jordan',
        color: '#60a5fa',
        sketch: {
          hairStyle: 'receding',
          hair: '#5a4a3f',
          skin: '#efcfb1',
          beard: 'full',
          brows: 'soft',
          backdrop: '#1f2a36',
        },
      },
    ],

    insight: t.insight,

    controls: (s, stage) =>
      '<div class="wide readout flavours-readout" id="flavours-readout"></div>' +
      `<button class="button flavours-clear" id="flavours-clear" type="button">${t.clear}</button>` +
      stage.slider('blanks', t.blanks, 0, 90, 10, s.blanks, '%', t.blanksHint),

    bindControls(panel, s, stage) {
      panel.querySelector('#flavours-clear').addEventListener('click', () => {
        s.likes = 0;
        stage.setChosen(-1);
        stage.sync();
        stage.draw();
      });
    },

    onPreset(s, stage) {
      if (state.key !== keyOf(s)) restart(s, stage, true);
      const { you, picks } = yours(s);
      if (you && state.fit.settled) W.announce(picks.length ? t.announce.suggest(pickList(picks)) : t.announce.nothing);
    },
    onInput(s, stage) {
      restart(s, stage, true);
    },
    enter(s, stage) {
      if (state.key !== keyOf(s) || !state.fit) restart(s, stage);
      stage.sync();
    },
    readouts,
    draw,
    step,
    preview,

    action(s, stage) {
      s.reveal = !s.reveal;
      if (s.reveal && !state.fit.settled) settle();
      if (s.reveal) {
        const a = M.align(state.fit.foods);
        W.announce(t.announce.planted(Math.abs(Math.round(a.angle)), a.flipped));
      }
      stage.sync();
      stage.draw();
    },
    reset(s, stage) {
      s.seed = 1 + Math.floor(Math.random() * 999999);
      restart(s, stage);
      stage.sync();
    },

    pointer: {
      down(p, s, stage, e) {
        if (e && e.button > 0) return;
        const j = hit(p.x * stage.width, p.y * stage.height);
        if (j >= 0) rate(j, (r) => (r === 0 ? 1 : r > 0 ? -1 : 0), s, stage);
      },
      move(p, info, s, stage) {
        const j = info.mouse ? hit(p.x * stage.width, p.y * stage.height) : -1;
        if (j !== state.hover) {
          state.hover = j;
          stage.draw();
        }
      },
      leave() {
        state.hover = -1;
      },
      arrow(dx, dy, s, stage) {
        if (dy) {
          state.cursor = state.cursor < 0 ? (dy > 0 ? 0 : M.FOODS - 1) : (state.cursor + dy + M.FOODS) % M.FOODS;
          stage.draw();
          W.announce(t.foods[state.cursor]);
          return;
        }
        if (state.cursor < 0) state.cursor = 0;
        const want = dx > 0 ? 1 : -1;
        rate(state.cursor, (r) => (r === want ? 0 : want), s, stage);
      },
    },
  });
})();
