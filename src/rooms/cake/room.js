/* Room · Everyone gets the biggest slice: three people share one cake by their own tastes (fair cake-cutting). */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $ } = W;
  const M = W.models.cake;
  const t = W.text('cake');
  const reduced = W.prefersReducedMotion();

  const SCALE = 1000; // the knives are kept in thousandths of the cake
  const HOLD = 1.6; // seconds the opening shows equal pieces before the knives move to a fair cut
  const CHANGE = 0.8; // seconds a step of the method takes to appear
  const NUDGE = 5; // thousandths an arrow key moves a knife
  const COLOURS = {
    people: ['#38bdf8', '#a3e635', '#c084fc'],
    body: ['#6f4128', '#e27d96', '#efdca2'], // chocolate, strawberry, vanilla
    top: ['#93593a', '#f4a9bb', '#fbf0cb'],
    label: ['#f3e2d4', '#4a1020', '#5a4520'],
    ink: '#e8edf2',
    soft: '#aab6c3',
    faint: '#5d6b7c',
    envy: '#f87171',
    happy: '#fde047',
    cloud: '#172130',
    grey: '#3b4757',
    knife: '#d6dde6',
    handle: '#8e9bad',
    bg: '#0a0e15',
    tag: '#111722',
  };

  /** The fair cut for a taste setting, in the room's settings: knives in thousandths, and who gets which piece. */
  function fairSettings(taste) {
    const f = M.fairCut(M.tastes(taste / 100));
    return { left: Math.round(f.left * SCALE), right: Math.round(f.right * SCALE), who: f.perm };
  }
  const DEFAULTS = { taste: 100, ...fairSettings(100) };
  const EQUAL = { left: 333, right: 667, who: 0 }; // three equal lengths, handed out left to right

  const state = {
    mix: -1, // the taste setting the densities below are for
    D: null,
    shown: null, // the knives as drawn, from 0 to 1: they glide to the settings
    hold: 0, // seconds of the opening still to show equal pieces
    knife: 0, // the knife the arrow keys move
    keys: false, // whether the keyboard is in use (the chosen knife is marked)
    drag: -1, // the knife being dragged
    tap: null, // where a press began, in canvas pixels
    hover: -1, // the knife (0, 1) or piece (2, 3, 4) under the mouse
    tour: null, // the method being shown: { step, time, since, prev }
    scenes: null,
    L: null, // the last layout, for pointing
    moving: false, // whether the knives are still gliding
    told: false, // whether the shares have been announced since the room opened
  };

  const pct = (v) => Math.round(100 * v);
  const num = (v) => new Intl.NumberFormat(W.numberLocale).format(v);
  const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - (1 - x) ** 3);
  const target = (s) => ({ left: Math.min(s.left, s.right) / SCALE, right: Math.max(s.left, s.right) / SCALE });

  function tastesOf(taste) {
    if (state.mix !== taste) {
      state.mix = taste;
      state.D = M.tastes(taste / 100);
    }
    return state.D;
  }

  // ——— Scenes: what is on the plate ———
  // A scene lists the pieces (an interval of the cake, its owner or −1, and its row: 0 the cake, 1 the trimming's
  // plate), the knives to draw, who takes part, whose move it is, and the tastes.

  /**
   * The visitor's own cake: two knives, three pieces, handed out by the settings (or equal pieces, at the opening).
   * `at`: knives to use instead of those on screen.
   */
  function freeScene(s, at = null) {
    const opening = !at && state.hold > 0;
    const k = at || (opening ? { left: 1 / 3, right: 2 / 3 } : state.shown || target(s));
    const cuts = [0, k.left, k.right, 1];
    return {
      D: tastesOf(s.taste),
      active: [true, true, true],
      focus: -1,
      caption: null,
      pieces: M.PERMS[opening ? 0 : s.who].map((owner, j) => ({
        id: `p${j}`,
        a: cuts[j],
        b: cuts[j + 1],
        owner,
        row: 0,
        from: 0,
      })),
      knives: [k.left, k.right],
      knifeRow: 0,
      trim: null,
    };
  }

  /** The method, step by step, on the room's own tastes: cut-and-choose, why it fails for three, Selfridge–Conway. */
  function tourScenes() {
    const D = M.tastes(1);
    const c = M.cutAndChoose(D),
      n = M.naive(D),
      r = M.selfridgeConway(D);
    const two = [true, true, false],
      all = [true, true, true];
    const piece = (id, [a, b], owner = -1, row = 0, from = row) => ({ id, a, b, owner, row, from });
    const halves = [
      [0, c.cut],
      [c.cut, 1],
    ];
    const thirds = (owners) => n.pieces.map((p, k) => piece(`k${k}`, p, owners[k]));
    const main = (owners) => r.main.map((p, k) => piece(`k${k}`, p, owners[k]));
    const chosen = [0, 1, 2].map((k) => r.picks.indexOf(k));
    const steps = [
      { active: two, focus: 0, pieces: halves.map((p, k) => piece(`h${k}`, p)), knives: [c.cut] },
      { active: two, focus: 1, pieces: halves.map((p, k) => piece(`h${k}`, p, k === c.ben ? 1 : 0)) },
      { active: all, focus: 1, pieces: thirds([0, 1, 2].map((k) => (k === n.ben ? 1 : -1))), knives: [n.x1, n.x2] },
      { active: all, focus: 2, pieces: thirds([0, 1, 2].map((k) => (k === n.ben ? 1 : k === n.cleo ? 2 : 0))) },
      { active: all, focus: 0, pieces: thirds([-1, -1, -1]), knives: [r.x1, r.x2] },
      {
        active: all,
        focus: 1,
        pieces: [...main([-1, -1, -1]), piece('trim', r.trim, -1, 1, 0)],
        knives: [r.trim[0]],
      },
      { active: all, focus: 2, pieces: [...main(chosen), piece('trim', r.trim, -1, 1)] },
      {
        active: all,
        focus: r.cutter,
        pieces: [...main(chosen), ...r.bits.map((p, k) => piece(`t${k}`, p, -1, 1))],
        knives: [r.y1, r.y2],
        knifeRow: 1,
      },
      {
        active: all,
        focus: r.taker,
        pieces: [...main(chosen), ...r.bits.map((p, k) => piece(`t${k}`, p, r.bitOf.indexOf(k), 1))],
      },
    ];
    return steps.map((step, k) => ({ D, caption: t.tour[k], knives: [], knifeRow: 0, trim: r.trim, ...step }));
  }

  const scenes = () => state.scenes || (state.scenes = tourScenes());
  const scene = (s) => (state.tour ? scenes()[state.tour.step] : freeScene(s));

  /** Each person's share (intervals), what it's worth to them, and whom each envies (−1: nobody). */
  function judge(sc) {
    const shares = [[], [], []];
    for (const p of sc.pieces) if (p.owner >= 0) shares[p.owner].push([p.a, p.b]);
    const who = [0, 1, 2].filter((p) => sc.active[p]);
    return {
      shares,
      who,
      own: shares.map((share, p) => M.worth(sc.D[p], share)),
      envy: M.envy(sc.D, shares, who),
    };
  }

  /** The line over the cake: who envies whom, or how well everyone did. */
  function headline(j) {
    const envious = j.who.filter((p) => j.envy[p] >= 0);
    if (envious.length)
      return {
        text: envious.map((p) => t.headline.envies(t.people[p], t.people[j.envy[p]])).join(' · '),
        colour: COLOURS.envy,
      };
    if (j.who.some((p) => !j.shares[p].length)) return null;
    const least = Math.min(...j.who.map((p) => j.own[p]));
    if (least > 0.5 + M.CRUMB) return { text: t.headline.half, colour: COLOURS.happy };
    if (least > 1 / 3 + M.CRUMB) return { text: t.headline.third, colour: COLOURS.happy };
    return { text: t.headline.fair, colour: COLOURS.ink };
  }

  /** How the visitor's cake is shared once the knives arrive where the settings put them. */
  const settled = (s) => judge(freeScene(s, target(s)));

  /** The shares and any envy, in words, for the panel and for screen readers. */
  function sentence(j) {
    const shares = j.who
      .filter((p) => j.shares[p].length)
      .map((p) => t.readout.share(t.people[p], num(pct(j.own[p]))))
      .join(', ');
    const envy = envyWords(j),
      h = headline(j);
    return `${shares}. ${envy || (h ? h.text : '')}`.trim();
  }

  /** Who envies whom, as sentences (empty when nobody does). */
  const envyWords = (j) =>
    j.who
      .filter((p) => j.envy[p] >= 0)
      .map((p) => t.readout.envies(t.people[p], t.people[j.envy[p]]))
      .join(' ');

  // ——— The method, step by step ———

  const dwell = (sc) => 2.5 + sc.caption.length * 0.05; // seconds to read a step, when it plays by itself

  function startTour(stage) {
    state.tour = { step: 0, time: 0, since: 0, prev: null };
    state.hold = 0;
    W.announce(scenes()[0].caption);
    stage.sync();
    stage.draw();
  }

  function advance(by) {
    const tour = state.tour;
    const k = Math.max(0, Math.min(scenes().length - 1, tour.step + by));
    if (k === tour.step) return;
    tour.prev = scenes()[tour.step];
    tour.step = k;
    tour.time = tour.since = 0;
    W.announce(scenes()[k].caption);
    W.stage.sync();
    W.stage.draw();
  }

  function endTour(stage) {
    state.tour = null;
    stage.sync();
    stage.draw();
  }

  // ——— Drawing ———

  function layout(ctx, w, h) {
    const small = Math.round(Math.min(13, Math.max(9, Math.min(w, h) / 30)));
    const pad = Math.max(6, Math.min(16, Math.min(w, h) * 0.025));
    ctx.font = `600 ${small}px system-ui`;
    const words = [...t.people, t.labels.length, t.labels.trimming, t.labels.tastes];
    const label = Math.min(w * 0.2, Math.max(...words.map((x) => ctx.measureText(x).width)) + small * 0.9);
    const inner = h - 2 * pad;
    let y = pad;
    const band = (height) => {
      const b = { y, h: height };
      y += height;
      return b;
    };
    const people = band(inner * 0.36),
      head = band(Math.max(small * (w < 500 ? 3.8 : 3), inner * 0.08)), // a step of the method may take three lines
      cake = band(inner * 0.2),
      tray = band(inner * 0.13);
    const strips = band(inner + pad - y);
    return { small, pad, w, h, x0: pad + label, x1: w - pad, people, head, cake, tray, strips };
  }

  const X = (L, x) => L.x0 + x * (L.x1 - L.x0);
  const handleOf = (L) => Math.max(10, L.small * 1.3);

  /** Where row 0 (the cake) and row 1 (the trimming's plate) are drawn. */
  function rowBox(L, row) {
    if (row === 0) {
      const top = L.cake.y + handleOf(L) + 2;
      return { y: top, h: L.cake.y + L.cake.h - top - L.small * 0.3 };
    }
    const h = Math.min(L.tray.h * 0.6, rowBox(L, 0).h * 0.7);
    return { y: L.tray.y + (L.tray.h - h) / 2, h };
  }

  /** From the cake to the canvas, for a row: the trimming's plate shows it enlarged, so its bits can be seen. */
  function rowMap(L, sc, row) {
    if (row === 0 || !sc.trim) return (x) => X(L, x);
    const [a, b] = sc.trim,
      c = (a + b) / 2,
      half = Math.max((b - a) / 2, 0.15);
    const mid = Math.min(1 - half, Math.max(half, c));
    const k = half / Math.max((b - a) / 2, 1e-9);
    return (x) => X(L, mid + (x - c) * k);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, Math.max(0, Math.min(r, w / 2, h / 2)));
  }

  /** A piece of cake from a to b: its flavours, icing on top and a layer of cream. */
  function drawPiece(ctx, map, box, a, b) {
    const g = 1.5;
    let xa = map(a) + g,
      xb = map(b) - g;
    if (xb - xa < 1) {
      const m = (xa + xb) / 2;
      xa = m - 0.5;
      xb = m + 0.5;
    }
    ctx.save();
    roundRect(ctx, xa, box.y, xb - xa, box.h, Math.min(5, box.h * 0.12));
    ctx.clip();
    for (let z = 0; z < 3; z++) {
      const lo = Math.max(a, M.ZONES[z]),
        hi = Math.min(b, M.ZONES[z + 1]);
      if (hi <= lo) continue;
      const u = Math.max(xa, map(lo)),
        v = Math.min(xb, map(hi));
      ctx.fillStyle = COLOURS.body[z];
      ctx.fillRect(u, box.y, v - u, box.h);
      ctx.fillStyle = COLOURS.top[z];
      ctx.fillRect(u, box.y, v - u, box.h * 0.2);
    }
    ctx.fillStyle = 'rgba(255, 246, 228, 0.55)';
    ctx.fillRect(xa, box.y + box.h * 0.58, xb - xa, Math.max(1.5, box.h * 0.06));
    ctx.restore();
    return { xa, xb };
  }

  /** A small disc in the owner's colour with their initial, on their piece. */
  function tag(ctx, x, y, r, p, scale = 1) {
    if (scale <= 0) return;
    const rr = r * scale;
    ctx.beginPath();
    ctx.arc(x, y, rr, 0, Math.PI * 2);
    ctx.fillStyle = COLOURS.people[p];
    ctx.fill();
    ctx.strokeStyle = COLOURS.tag;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = COLOURS.tag;
    ctx.font = `800 ${Math.round(rr * 1.15)}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(Array.from(t.people[p])[0], x, y + rr * 0.06);
  }

  /** A person's face: a smile, a frown, or a straight mouth (`mood` 1, −1, 0). */
  function face(ctx, x, y, r, p, mood, focus) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = COLOURS.people[p];
    ctx.fill();
    if (focus) {
      ctx.strokeStyle = COLOURS.ink;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(x, y, r + 3.5, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = COLOURS.tag;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(x + side * r * 0.36, y - r * 0.2, Math.max(1.4, r * 0.11), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = COLOURS.tag;
    ctx.lineWidth = Math.max(1.5, r * 0.12);
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (mood > 0) ctx.arc(x, y + r * 0.08, r * 0.42, Math.PI * 0.18, Math.PI * 0.82);
    else if (mood < 0) ctx.arc(x, y + r * 0.66, r * 0.4, Math.PI * 1.2, Math.PI * 1.8);
    else {
      ctx.moveTo(x - r * 0.3, y + r * 0.38);
      ctx.lineTo(x + r * 0.3, y + r * 0.38);
    }
    ctx.stroke();
    ctx.lineCap = 'butt';
  }

  /** A thought bubble: a ring with what every share is worth to person p, their own share in the middle. */
  function bubble(ctx, cx, cy, r, p, sc, j) {
    ctx.fillStyle = COLOURS.cloud;
    for (let k = 0; k < 10; k++) {
      const a = (k * Math.PI) / 5;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * r * 1.02, cy + Math.sin(a) * r * 1.02, r * 0.28, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.12, 0, Math.PI * 2);
    ctx.fill();

    const d = sc.D[p];
    const parts = [];
    if (j.shares[p].length) parts.push({ v: j.own[p], colour: COLOURS.people[p], alpha: 1 });
    for (const q of [0, 1, 2])
      if (q !== p && j.shares[q].length)
        parts.push({ v: M.worth(d, j.shares[q]), colour: COLOURS.people[q], alpha: 0.4, envied: j.envy[p] === q });
    for (const piece of sc.pieces)
      if (piece.owner < 0) parts.push({ v: M.value(d, piece.a, piece.b), colour: COLOURS.grey, alpha: 1 });
    const inner = r * 0.58;
    let a = -Math.PI / 2;
    for (const part of parts) {
      const da = part.v * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, a, a + da);
      ctx.arc(cx, cy, inner, a + da, a, true);
      ctx.closePath();
      ctx.globalAlpha = part.alpha;
      ctx.fillStyle = part.colour;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = COLOURS.cloud;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      if (part.envied) {
        ctx.strokeStyle = COLOURS.envy;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
      a += da;
    }

    // A mark at the fair share: a third of the way round (a half, for two people).
    const n = j.who.length,
      m = -Math.PI / 2 + (2 * Math.PI) / n;
    ctx.strokeStyle = COLOURS.ink;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(m) * inner * 0.9, cy + Math.sin(m) * inner * 0.9);
    ctx.lineTo(cx + Math.cos(m) * r * 1.08, cy + Math.sin(m) * r * 1.08);
    ctx.stroke();
    if (r >= 38) {
      ctx.fillStyle = COLOURS.soft;
      ctx.font = `600 ${Math.round(r * 0.17)}px system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n === 2 ? '½' : '⅓', cx + Math.cos(m) * r * 1.22, cy + Math.sin(m) * r * 1.22);
    }

    if (j.shares[p].length) {
      ctx.direction = 'ltr';
      ctx.fillStyle = COLOURS.people[p];
      ctx.font = `800 ${Math.round(Math.max(10, r * 0.36))}px system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(t.labels.percent(num(pct(j.own[p]))), cx, cy + 1, inner * 1.8);
      ctx.direction = 'inherit';
    }
  }

  /** The three people across the top: a thought bubble each, then a face and a name. */
  function drawPeople(ctx, L, sc, j) {
    const band = L.people;
    const cw = (L.w - 2 * L.pad) / 3;
    const fr = Math.max(8, Math.min(18, band.h * 0.085));
    const rowH = fr * 2 + 4;
    const r = Math.max(10, Math.min(cw / 2 / 1.34, (band.h - rowH - 4) / 2 / 1.32));
    const cy = band.y + r * 1.32;
    for (let p = 0; p < 3; p++) {
      const cx = L.pad + cw * (p + 0.5);
      ctx.globalAlpha = sc.active[p] ? 1 : 0.3;
      bubble(ctx, cx, cy, r, p, sc, j);
      ctx.globalAlpha = sc.active[p] ? 1 : 0.3;
      // The bubble's tail, down towards the face.
      const fy = band.y + band.h - fr - 2;
      ctx.fillStyle = COLOURS.cloud;
      for (const [k, size] of [
        [0.4, 0.1],
        [0.7, 0.07],
      ]) {
        ctx.beginPath();
        ctx.arc(cx - fr * 1.6 * k, cy + r * 1.3 + (fy - fr - cy - r * 1.3) * k, Math.max(2, r * size), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.font = `700 ${L.small + 1}px system-ui`;
      const name = t.people[p];
      const nw = Math.min(cw - fr * 3, ctx.measureText(name).width);
      const fx = cx - (nw + fr * 2 + 6) / 2 + fr;
      const mood = !j.shares[p].length || !sc.active[p] ? 0 : j.envy[p] >= 0 ? -1 : 1;
      face(ctx, fx, fy, fr, p, mood, sc.focus === p);
      ctx.fillStyle = COLOURS.people[p];
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(name, fx + fr + 6, fy, nw);
      ctx.globalAlpha = 1;
    }
  }

  /** Wraps words into lines no wider than `width`. */
  function wrap(ctx, text, width) {
    const lines = [];
    let line = '';
    for (const word of text.split(' ')) {
      const next = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(next).width > width) {
        lines.push(line);
        line = word;
      } else line = next;
    }
    if (line) lines.push(line);
    return lines;
  }

  /** The line between the people and the cake: a step of the method, or who envies whom. */
  function drawHead(ctx, L, sc, j, alpha) {
    const said = sc.caption ? { text: sc.caption, colour: COLOURS.ink } : headline(j);
    if (!said) return;
    const width = L.w - 2 * L.pad;
    let size = L.small + 2,
      lines;
    for (;;) {
      ctx.font = `${sc.caption ? 600 : 700} ${size}px system-ui`;
      lines = wrap(ctx, said.text, width);
      if (lines.length * size * 1.25 <= L.head.h || size <= 9) break;
      size -= 1;
    }
    ctx.globalAlpha = alpha;
    ctx.fillStyle = said.colour;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const mid = L.head.y + L.head.h / 2;
    lines.forEach((line, k) => ctx.fillText(line, L.w / 2, mid + (k - (lines.length - 1) / 2) * size * 1.25, width));
    ctx.globalAlpha = 1;
  }

  /** A knife: a blade through the row and a handle above it to drag. */
  function knife(ctx, L, x, box, alpha, lit) {
    const hh = handleOf(L);
    const top = box.y - hh - 2;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = COLOURS.knife;
    ctx.fillRect(x - 1.25, box.y - 2, 2.5, box.h + 6);
    const hw = Math.max(8, hh * 0.7);
    roundRect(ctx, x - hw / 2, top, hw, hh, 3);
    ctx.fillStyle = lit ? COLOURS.ink : COLOURS.handle;
    ctx.fill();
    ctx.strokeStyle = COLOURS.tag;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(17, 23, 34, 0.55)';
    for (const k of [0.35, 0.65]) {
      ctx.beginPath();
      ctx.moveTo(x - hw * 0.25, top + hh * k);
      ctx.lineTo(x + hw * 0.25, top + hh * k);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  /** The cake (row 0), the trimming's plate (row 1), the knives, and the owners' tags. */
  function drawCake(ctx, L, sc, progress) {
    const prev = state.tour ? state.tour.prev : null;
    const was = new Map((prev ? prev.pieces : []).map((p) => [p.id, p]));
    const boxes = [rowBox(L, 0), rowBox(L, 1)];
    const maps = [rowMap(L, sc, 0), rowMap(L, sc, 1)];
    const fresh = (p) => state.tour && !was.has(p.id);
    const f = ease(progress);
    const tr = Math.max(6, Math.min(boxes[0].h * 0.2, L.small * 1.05));

    // The trimming's plate, joined to where the trimming came from.
    const plate = sc.pieces.filter((p) => p.row === 1);
    if (plate.length && sc.trim) {
      const a = sc.trim[0],
        b = sc.trim[1];
      const moving = plate.some((p) => p.from === 0);
      ctx.globalAlpha = moving ? f : 1;
      ctx.strokeStyle = COLOURS.faint;
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(maps[0](a), boxes[0].y + boxes[0].h + 2);
      ctx.lineTo(maps[1](a), boxes[1].y - 2);
      ctx.moveTo(maps[0](b), boxes[0].y + boxes[0].h + 2);
      ctx.lineTo(maps[1](b), boxes[1].y - 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = COLOURS.soft;
      ctx.font = `600 ${L.small}px system-ui`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(t.labels.trimming, L.pad, boxes[1].y + boxes[1].h / 2, L.x0 - L.pad - 4);
      ctx.globalAlpha = 1;
    }

    for (const p of sc.pieces) {
      const k = p.from !== p.row && state.tour ? f : 1;
      const map = k >= 1 ? maps[p.row] : (x) => maps[p.from](x) + (maps[p.row](x) - maps[p.from](x)) * k;
      const box = {
        y: boxes[p.from].y + (boxes[p.row].y - boxes[p.from].y) * k,
        h: boxes[p.from].h + (boxes[p.row].h - boxes[p.from].h) * k,
      };
      ctx.globalAlpha = fresh(p) && p.from === p.row ? f : 1;
      const { xa, xb } = drawPiece(ctx, map, box, p.a, p.b);
      if (!state.tour && state.hover === 2 + Number(p.id.slice(1))) {
        ctx.strokeStyle = COLOURS.ink;
        ctx.setLineDash([4, 3]);
        ctx.lineWidth = 1.5;
        roundRect(ctx, xa - 1, box.y - 1, xb - xa + 2, box.h + 2, 5);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.globalAlpha = 1;
      if (p.owner >= 0) {
        const before = was.get(p.id);
        const grow = state.tour && !(before && before.owner === p.owner) ? f : 1;
        tag(ctx, (xa + xb) / 2, box.y + box.h * 0.36, Math.min(tr, box.h * 0.3), p.owner, grow);
      }
    }

    // The flavours' names, along the bottom of the cake where they fit.
    const body = boxes[0];
    ctx.font = `600 ${Math.max(8, L.small - 2)}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let z = 0; z < 3; z++) {
      const u = maps[0](M.ZONES[z]),
        v = maps[0](M.ZONES[z + 1]);
      if (ctx.measureText(t.flavours[z]).width > v - u - 10 || body.h < 34) continue;
      ctx.fillStyle = COLOURS.label[z];
      ctx.fillText(t.flavours[z], (u + v) / 2, body.y + body.h * 0.8);
    }

    // The knives: the visitor's two, or those cutting in this step of the method.
    const row = sc.knifeRow;
    sc.knives.forEach((x, k) => {
      const box = boxes[row];
      if (state.tour) {
        const drop = (1 - f) * (box.h + handleOf(L)) * 0.8;
        knife(ctx, L, maps[row](x), { y: box.y - drop, h: box.h }, Math.min(1, progress * 2), false);
      } else {
        const lit = state.drag === k || state.hover === k || (state.keys && state.knife === k);
        knife(ctx, L, maps[0](x), box, 1, lit);
      }
    });
  }

  /** Under the cake: how long each piece is, as a share of the whole cake. */
  function drawRuler(ctx, L, sc) {
    const y = L.tray.y + L.tray.h * 0.32;
    ctx.fillStyle = COLOURS.soft;
    ctx.font = `600 ${L.small}px system-ui`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(t.labels.length, L.pad, y, L.x0 - L.pad - 4);
    for (const p of sc.pieces) {
      const xa = X(L, p.a) + 3,
        xb = X(L, p.b) - 3;
      if (xb - xa < 6) continue;
      ctx.strokeStyle = COLOURS.faint;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(xa, y - 4);
      ctx.lineTo(xa, y);
      ctx.lineTo(xb, y);
      ctx.lineTo(xb, y - 4);
      ctx.stroke();
      const share = pct(p.b - p.a);
      ctx.direction = 'ltr';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = COLOURS.soft;
      const long = t.labels.ofCake(num(share)),
        short = t.labels.percent(num(share));
      const words = ctx.measureText(long).width < xb - xa ? long : ctx.measureText(short).width < xb - xa ? short : '';
      ctx.fillText(words, (xa + xb) / 2, y + 4);
      ctx.direction = 'inherit';
    }
  }

  /** At the bottom: each person's taste, glowing where they like the cake most, with their own share outlined. */
  function drawStrips(ctx, L, sc, j) {
    const band = L.strips;
    const head = L.small * 1.5;
    const rowH = (band.h - head) / 3;
    const sh = Math.max(6, Math.min(rowH * 0.6, L.small * 2.2));
    const most = Math.max(...sc.D.flat());
    ctx.fillStyle = COLOURS.soft;
    ctx.font = `600 ${L.small}px system-ui`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(t.labels.tastes, L.pad, band.y + head / 2, L.x0 - L.pad - 4);
    for (let p = 0; p < 3; p++) {
      const y = band.y + head + rowH * p + (rowH - sh) / 2;
      ctx.globalAlpha = sc.active[p] ? 1 : 0.3;
      ctx.fillStyle = COLOURS.people[p];
      ctx.font = `700 ${L.small}px system-ui`;
      ctx.fillText(t.people[p], L.pad, y + sh / 2, L.x0 - L.pad - 4);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fillRect(L.x0, y, L.x1 - L.x0, sh);
      for (let z = 0; z < 3; z++) {
        const u = Math.round(X(L, M.ZONES[z])),
          v = Math.round(X(L, M.ZONES[z + 1]));
        ctx.globalAlpha = (sc.active[p] ? 1 : 0.3) * (0.1 + 0.9 * (sc.D[p][z] / most));
        ctx.fillStyle = COLOURS.people[p];
        ctx.fillRect(u, y, v - u, sh);
      }
      ctx.globalAlpha = sc.active[p] ? 1 : 0.3;
      ctx.strokeStyle = COLOURS.ink;
      ctx.lineWidth = 1.5;
      for (const [a, b] of j.shares[p]) {
        roundRect(ctx, X(L, a) + 1, y - 2, Math.max(2, X(L, b) - X(L, a) - 2), sh + 4, 3);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  }

  function draw(ctx, s, stage) {
    if (!stage.playing || reduced) {
      state.shown = target(s);
      state.hold = 0;
    }
    ctx.fillStyle = COLOURS.bg;
    ctx.fillRect(0, 0, stage.width, stage.height);
    const L = layout(ctx, stage.width, stage.height);
    state.L = L;
    const sc = scene(s);
    const j = judge(sc);
    const progress = state.tour && !reduced && stage.playing ? Math.min(1, state.tour.since / CHANGE) : 1;
    drawPeople(ctx, L, sc, j);
    drawHead(ctx, L, sc, j, state.tour ? Math.min(1, progress * 1.5) : 1);
    drawCake(ctx, L, sc, progress);
    if (!state.tour) drawRuler(ctx, L, sc);
    drawStrips(ctx, L, sc, j);
  }

  /** The map's picture: the three bubbles over the fair cut, without words. */
  function preview(ctx, width, height) {
    const s = { ...DEFAULTS };
    const saved = { tour: state.tour, hold: state.hold, shown: state.shown, hover: state.hover, keys: state.keys };
    Object.assign(state, { tour: null, hold: 0, shown: target(s), hover: -1, keys: false });
    ctx.fillStyle = COLOURS.bg;
    ctx.fillRect(0, 0, width, height);
    const small = Math.round(Math.max(9, Math.min(13, height / 24)));
    const pad = Math.max(4, height * 0.03);
    const L = {
      small,
      pad,
      w: width,
      h: height,
      x0: pad,
      x1: width - pad,
      people: { y: pad, h: height * 0.56 },
      cake: { y: pad + height * 0.56, h: height * 0.26 },
      tray: { y: height - pad, h: 0 },
    };
    const sc = freeScene(s);
    const j = judge(sc);
    drawPeople(ctx, L, sc, j);
    drawCake(ctx, L, sc, 1);
    const sh = Math.max(3, height * 0.03);
    for (let p = 0; p < 3; p++)
      for (let z = 0; z < 3; z++) {
        ctx.globalAlpha = 0.1 + 0.9 * (sc.D[p][z] / Math.max(...sc.D.flat()));
        ctx.fillStyle = COLOURS.people[p];
        const u = X(L, M.ZONES[z]),
          v = X(L, M.ZONES[z + 1]);
        ctx.fillRect(u, height * 0.86 + p * (sh + 2), v - u, sh);
      }
    ctx.globalAlpha = 1;
    Object.assign(state, saved);
  }

  // ——— The panel ———

  function readouts(s) {
    // The panel says where the knives are going, not where they are on their way.
    const sc = state.tour ? scenes()[state.tour.step] : freeScene(s, state.hold > 0 ? null : target(s));
    const j = judge(sc);
    if (state.tour) $('scene-status').textContent = t.status.step(num(state.tour.step + 1), num(scenes().length));
    else $('scene-status').textContent = t.status.smallest(num(pct(Math.min(...j.own))));
    $('scene-action').textContent = !state.tour
      ? t.actionLabel
      : state.tour.step === scenes().length - 1
        ? t.doneLabel
        : t.nextLabel;
    const box = $('cake-readout');
    if (!box) return;
    const line = j.who
      .filter((p) => j.shares[p].length)
      .map(
        (p) =>
          `<span class="ink-tint" style="--c:${COLOURS.people[p]}">${t.readout.share(t.people[p], num(pct(j.own[p])))}</span>`,
      )
      .join('');
    const envy = envyWords(j);
    box.innerHTML =
      `<strong>${t.readout.title}</strong><p class="cake-shares">${line || '—'}</p>` +
      `<p class="${envy ? 'cake-envy' : 'cake-calm'}">${envy || t.readout.none}</p>`;
  }

  // ——— Pointing and keys ———

  function knifeAt(x, y) {
    const L = state.L;
    if (!L || state.tour) return -1;
    const box = rowBox(L, 0);
    if (y < L.cake.y - 4 || y > box.y + box.h + 8) return -1;
    const s = W.stage.settingsFor('cake');
    const k = state.shown || target(s);
    const reach = Math.max(12, L.small * 1.2);
    const d = [Math.abs(x - X(L, k.left)), Math.abs(x - X(L, k.right))];
    if (Math.min(...d) > reach) return -1;
    if (Math.abs(d[0] - d[1]) < 0.5) return k.left < 0.5 ? 1 : 0; // on top of each other: the one with room to move
    return d[0] < d[1] ? 0 : 1;
  }

  function pieceAt(x, y) {
    const L = state.L;
    if (!L || state.tour) return -1;
    const box = rowBox(L, 0);
    if (y < box.y || y > box.y + box.h) return -1;
    const k = state.shown || target(W.stage.settingsFor('cake'));
    const cuts = [0, k.left, k.right, 1];
    for (let j = 0; j < 3; j++) if (x >= X(L, cuts[j]) && x <= X(L, cuts[j + 1])) return j;
    return -1;
  }

  function changed(s, stage) {
    stage.setChosen(-1);
    stage.sync();
    stage.draw();
  }

  function moveKnife(k, x, s, stage) {
    const v = Math.round(Math.min(1, Math.max(0, x)) * SCALE);
    if (s.left > s.right) [s.left, s.right] = [s.right, s.left];
    if (k === 0) s.left = Math.min(v, s.right);
    else s.right = Math.max(v, s.left);
    state.shown = target(s);
    changed(s, stage);
  }

  /** Piece k goes to the next person, who gives theirs to its old owner. */
  function handOn(k, s, stage) {
    const perm = [...M.PERMS[s.who]];
    const next = (perm[k] + 1) % 3,
      j = perm.indexOf(next);
    [perm[k], perm[j]] = [next, perm[k]];
    s.who = M.PERMS.findIndex((q) => q.every((v, i) => v === perm[i]));
    changed(s, stage);
    W.announce(sentence(settled(s)));
  }

  /** The two pieces beside knife k change hands. */
  function swapAt(k, s, stage) {
    const perm = [...M.PERMS[s.who]];
    [perm[k], perm[k + 1]] = [perm[k + 1], perm[k]];
    s.who = M.PERMS.findIndex((q) => q.every((v, i) => v === perm[i]));
    changed(s, stage);
    W.announce(sentence(settled(s)));
  }

  /** Where a pointer event is, in the canvas's own pixels. */
  function canvasPoint(e) {
    const r = $('scene-canvas').getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * W.stage.width,
      y: ((e.clientY - r.top) / r.height) * W.stage.height,
    };
  }

  const cursor = (value) => ($('scene-canvas').style.cursor = value);

  function glide(dt, s, stage) {
    const goal = target(s);
    if (!state.shown) state.shown = goal;
    if (state.drag >= 0) return;
    const k = 1 - Math.exp(-dt * 4.5);
    let moving = false;
    for (const key of ['left', 'right']) {
      const gap = goal[key] - state.shown[key];
      if (Math.abs(gap) < 0.0005) state.shown[key] = goal[key];
      else {
        state.shown[key] += gap * k;
        moving = true;
      }
    }
    if (state.moving && !moving) stage.sync();
    state.moving = moving;
  }

  W.defineRoom({
    id: 'cake',
    symbol: '◔',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'games',
    added: '2026-10-19',
    tagline: t.tagline,
    accent: { background: '#2a1d24', border: '#e27d96', color: '#fbcfe8' },

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
    connection: { ...t.connection, go: 'matching' },

    defaults: { ...DEFAULTS },
    ranges: {
      taste: [0, 100, 'integer'],
      left: [0, SCALE, 'integer'],
      right: [0, SCALE, 'integer'],
      who: [0, M.PERMS.length - 1, 'integer'],
    },
    defaultPreset: 0,
    presets: [
      { settings: { ...DEFAULTS } },
      { settings: { taste: 100, ...EQUAL } },
      { settings: { taste: 0, ...EQUAL } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Steinhaus',
        color: '#e27d96',
        sketch: {
          hairStyle: 'receding',
          hair: '#d9d2c7',
          skin: '#ecc7a5',
          moustache: true,
          brows: 'bold',
          backdrop: '#2a1d24',
        },
      },
      {
        ...t.guests[1],
        bio: 'Conway',
        color: '#a3e635',
        sketch: {
          hairStyle: 'long',
          hair: '#a39a90',
          skin: '#efcfb1',
          beard: 'full',
          brows: 'soft',
          backdrop: '#1f2a1c',
        },
      },
    ],

    insight: t.insight,

    controls: (s, stage) =>
      '<div class="wide readout cake-readout" id="cake-readout"></div>' +
      `<button class="button cake-fair" id="cake-fair" type="button">${t.fair}</button>` +
      stage.slider('taste', t.taste, 0, 100, 5, s.taste, '%', t.tasteHint),

    bindControls(panel, s, stage) {
      panel.querySelector('#cake-fair').addEventListener('click', () => {
        state.tour = null;
        state.hold = 0;
        Object.assign(s, fairSettings(s.taste));
        changed(s, stage);
        W.announce(sentence(settled(s)));
      });
    },

    enter(s, stage) {
      if (s.left > s.right) [s.left, s.right] = [s.right, s.left];
      state.tour = null;
      state.drag = -1;
      const opening = !reduced && Object.keys(DEFAULTS).every((k) => s[k] === DEFAULTS[k]);
      state.hold = opening ? HOLD : 0;
      state.shown = target(s);
      state.told = false;
      stage.sync();
    },
    onPreset(s, stage) {
      state.tour = null;
      state.hold = 0;
      stage.sync();
      W.announce(sentence(settled(s)));
    },
    onInput(s) {
      // A new taste: the knives move to a fair cut for it.
      state.tour = null;
      state.hold = 0;
      Object.assign(s, fairSettings(s.taste));
    },
    readouts,
    draw,
    preview,

    step(dt, s, stage) {
      const tour = state.tour;
      if (tour) {
        tour.since += dt;
        tour.time += dt;
        if (tour.time > CHANGE + dwell(scenes()[tour.step]) && tour.step < scenes().length - 1) advance(1);
        return;
      }
      if (state.hold > 0) {
        state.hold -= dt;
        if (state.hold <= 0) {
          state.hold = 0;
          state.shown = { left: 1 / 3, right: 2 / 3 };
          state.moving = true;
        }
        return;
      }
      glide(dt, s, stage);
      if (!state.moving && !state.told) {
        state.told = true;
        W.announce(sentence(settled(s)));
      }
    },

    action(s, stage) {
      if (!state.tour) startTour(stage);
      else if (state.tour.step === scenes().length - 1) endTour(stage);
      else advance(1);
    },
    reset(s, stage) {
      if (state.tour) {
        state.tour = { step: 0, time: 0, since: 0, prev: null };
        W.announce(scenes()[0].caption);
        stage.sync();
        return;
      }
      state.hold = reduced ? 0 : HOLD;
      state.shown = target(s);
      state.told = false;
      stage.sync();
    },

    pointer: {
      drag: (p, s, stage) => knifeAt(p.x * stage.width, p.y * stage.height) >= 0,
      down(p, s, stage, e) {
        if (e && e.button > 0) return;
        const x = p.x * stage.width,
          y = p.y * stage.height;
        state.tap = { x, y };
        state.keys = false;
        const k = knifeAt(x, y);
        if (k < 0) return;
        state.drag = state.knife = k;
        state.hold = 0;
        state.shown = target(s);
      },
      move(p, info, s, stage) {
        const x = p.x * stage.width,
          y = p.y * stage.height;
        if (state.drag >= 0 && info.dragging) {
          moveKnife(state.drag, (x - state.L.x0) / (state.L.x1 - state.L.x0), s, stage);
          return;
        }
        if (!info.mouse) return;
        if (state.tour) return void cursor('pointer');
        const k = knifeAt(x, y);
        const hover = k >= 0 ? k : pieceAt(x, y) >= 0 ? 2 + pieceAt(x, y) : -1;
        cursor(k >= 0 ? 'ew-resize' : hover >= 0 ? 'pointer' : '');
        if (hover !== state.hover) {
          state.hover = hover;
          stage.draw();
        }
      },
      up(e) {
        const dragged = state.drag;
        state.drag = -1;
        const tap = state.tap;
        state.tap = null;
        if (!e || e.type !== 'pointerup' || !tap) return;
        const stage = W.stage,
          s = stage.settingsFor('cake');
        const at = canvasPoint(e);
        const still = Math.hypot(at.x - tap.x, at.y - tap.y) < 8;
        if (dragged >= 0) {
          if (!still) W.announce(sentence(settled(s)));
          return;
        }
        if (!still) return;
        if (state.tour) return void advance(1);
        const k = pieceAt(at.x, at.y);
        if (k >= 0) handOn(k, s, stage);
      },
      leave() {
        state.hover = -1;
        cursor('');
      },
      arrow(dx, dy, s, stage) {
        if (state.tour) {
          if (dx) advance(dx);
          return;
        }
        state.keys = true;
        state.hold = 0;
        if (dy) {
          state.knife = 1 - state.knife;
          return;
        }
        const k = target(s);
        moveKnife(state.knife, (state.knife ? k.right : k.left) + (dx * NUDGE) / SCALE, s, stage);
        W.announce(sentence(settled(s)));
      },
      key(e, s, stage) {
        if (e.key !== 'Enter' || state.tour) return false;
        state.keys = true;
        state.hold = 0;
        swapAt(state.knife, s, stage);
        return true;
      },
    },
  });
})();
