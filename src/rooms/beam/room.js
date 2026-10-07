/* Room · The ruler on its edge: a steel beam whose stiffness comes from the shape of its cross-section. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, clamp } = W;
  const M = W.models.beam;
  const t = W.text('beam');
  const reduced = W.prefersReducedMotion();

  const N = M.SIZE;
  const TURN = 0.45; // seconds a quarter turn takes
  const GLIDE = 0.75; // seconds the squares take to slide into a new shape
  const OPENING = [2.6, 6.2, 7.2]; // the opening: turn the plank onto its edge, slide it into an I, and stop
  const SPRING = { omega: 11, damping: 0.45 }; // how the beam settles when its stiffness changes
  const ROCK = 0.055; // radians a wobbly shape rocks by
  const REFERENCE = {
    plank: M.analyse(M.SHAPES.plank),
    edge: M.analyse(M.SHAPES.edge),
    ibeam: M.analyse(M.SHAPES.ibeam),
  };
  const EDGE = REFERENCE.edge.ixx; // 288 cm⁴, the plank on its edge
  const COLOURS = {
    squeezed: '#4f8fe6',
    stretched: '#e8604f',
    steel: '#a9b5c2',
    ink: '#e8eef5',
    muted: '#98aab7',
    faint: '#5d6b7a',
    box: '#0e141d',
    edge: '#1f2a38',
    ground: '#151c26',
    pier: '#2a3442',
    warn: '#f0a04b',
    good: '#7fd18b',
    meter: '#f2c94c',
  };

  // The shape, as the room shows it.
  let rows = M.empty(),
    info = M.analyse(rows),
    history = [], // shapes to go back to, for Undo
    base = null; // what "Start again" goes back to
  // Motion.
  let sag = 0, // the sag drawn now, in mm (it springs towards the shape's own)
    speed = 0,
    meter = 0, // the stiffness drawn on the meter, in cm⁴ (it slides towards the shape's own)
    anim = null, // a turn or a glide of the squares in progress
    demo = null, // the opening, while it plays
    rock = 0, // the wobble's clock
    flash = null; // a short message over the grid: { text, left } seconds
  // Input and words.
  let layout = null,
    hover = null, // the square under the mouse, as [row, column]
    aim = null, // the keyboard's square
    stroke = null, // a press painting or erasing: { mode, before, touched, changed }
    shown = '';

  // ------------------------------------------------------------ the shape

  const animated = () => !reduced && W.stage.playing;
  /** The sag the beam settles to, in mm: past the theory's limit it is drawn off the scale. */
  const settled = () => (info.count ? Math.min(info.sag, M.LIMIT * 1.15) : M.LIMIT * 1.15);
  const presetIndex = () => ['plank', 'edge', 'ibeam'].indexOf(info.name);

  /** Take the shape from the settings when they change from outside (a link, a preset, a saved moment). */
  function prepare(s) {
    const next = M.fromSettings(s);
    if (M.same(next, rows)) return false;
    rows = next;
    info = M.analyse(rows);
    return true;
  }

  /** Put a new shape in place: turned, slid or at once, and written to the settings so a link keeps it. */
  function change(next, s, stage, how = 'now') {
    if (M.same(next, rows)) return;
    const before = rows,
      old = info;
    rows = next;
    info = M.analyse(rows);
    Object.assign(s, M.toSettings(rows));
    anim = null;
    if (animated() && how === 'turn') anim = { kind: 'turn', from: before, info: old, t: 0 };
    else if (animated() && how === 'glide') anim = { kind: 'glide', moves: M.glide(before, rows), t: 0 };
    if (!animated()) settle();
    stage.setChosen(presetIndex());
    stage.sync();
    stage.draw();
  }

  /** Jump to the end of any motion: used when nothing moves (paused, or reduced motion). */
  function settle() {
    anim = null;
    sag = settled();
    speed = 0;
    meter = info.ixx;
  }

  function remember() {
    history.push(rows);
    if (history.length > 60) history.shift();
  }

  /** The visitor takes over: the opening stops where it is. */
  function takeOver(s) {
    if (anim) {
      anim = null;
      if (!animated()) settle();
    }
    demo = null;
    s.auto = false;
  }

  function undo(s, stage) {
    if (!history.length) return;
    takeOver(s);
    change(history.pop(), s, stage, 'glide');
    say();
  }

  function clear(s, stage) {
    if (!info.count) return;
    takeOver(s);
    remember();
    change(M.empty(), s, stage);
    say();
  }

  function turn(s, stage) {
    if (!info.count) return;
    takeOver(s);
    remember();
    change(M.rotate(rows), s, stage, 'turn');
    say();
  }

  /** Read the result out once it settles, for screen readers. */
  function say() {
    if (W.stage.isShowing(room)) W.announce(said());
  }

  // ------------------------------------------------------------ the words

  const locale = () => W.numberLocale;
  /** A sag in mm: two figures below 1 mm, one decimal below 10, whole millimetres above. */
  function mm(v) {
    const f =
      v < 1
        ? { maximumSignificantDigits: 2 }
        : v < 10
          ? { maximumFractionDigits: 1, minimumFractionDigits: 1 }
          : { maximumFractionDigits: 0 };
    return new Intl.NumberFormat(locale(), { ...f, useGrouping: false }).format(v);
  }
  /** How many times as stiff as the flat plank. */
  function times(x) {
    const f =
      x < 1 ? { maximumSignificantDigits: 2 } : x < 100 ? { maximumFractionDigits: 1 } : { maximumFractionDigits: 0 };
    return new Intl.NumberFormat(locale(), f).format(x);
  }
  const whole = (n) => new Intl.NumberFormat(locale(), { useGrouping: false }).format(n);
  const isPlank = () => Math.abs(info.times - 1) < 0.05;

  function status() {
    if (!info.count) return t.status.none;
    if (info.beyond) return t.status.beyond;
    return t.status.sag(mm(info.sag));
  }
  /** What a screen reader hears once a change settles. */
  function said() {
    if (!info.count || info.beyond) return status();
    return t.status.said(mm(info.sag), times(info.times));
  }

  const sceneName = () => (info.count ? t.sceneNames[info.name || 'own'] : t.sceneNames.none);

  /** The status line, the scene's name, the panel's readout and its buttons, when they change. */
  function report() {
    const line = status();
    if ($('scene-status').textContent !== line) $('scene-status').textContent = line;
    if ($('scene-name').textContent !== sceneName()) $('scene-name').textContent = sceneName();
    if ($('beam-undo')) $('beam-undo').disabled = !history.length;
    if ($('beam-clear')) $('beam-clear').disabled = !info.count;
    const box = $('beam-readout');
    if (!box) return;
    const r = t.readout;
    let html;
    if (!info.count) html = `<p>${r.none}</p>`;
    else {
      const big = info.beyond ? t.status.beyond : r.sag(mm(info.sag));
      const than = isPlank() ? r.plank : r.times(times(info.times));
      html = `<div class="beam-big"><span>${big}</span><strong>${than}</strong></div>`;
      html += `<p>${r.used(info.count, M.BUDGET)}</p>`;
      if (info.beyond) html += `<p>${r.beyond}</p>`;
      if (info.pieces.length > 1) html += `<p class="beam-warn">${r.loose(info.pieces.length)}</p>`;
      if (info.wobbly) html += `<p class="beam-warn">${r.wobbly}</p>`;
      if (info.best) html += `<p class="beam-good">${r.best}</p>`;
    }
    if (html !== shown) {
      shown = html;
      box.innerHTML = html;
    }
  }

  // --------------------------------------------------------------- layout

  /**
   * Where everything goes. On a wide picture the cross-section sits at the top left, with the beam beside it between
   * two piers and the numbers under the beam; a chart below compares the shapes. On a phone the beam takes a strip
   * along the top, and the grid and the numbers share what's left.
   */
  function measure(width, height) {
    const narrow = width < 600;
    const pad = narrow ? 10 : 16;
    let section, right, capY, top, ground, chart, depth, weight;
    if (narrow) {
      const strip = Math.max(90, Math.round(height * 0.4));
      const cs = Math.max(8, Math.floor(Math.min(height - strip - pad, width * 0.55) / N));
      section = { x: pad, y: height - pad - cs * N, cs, size: cs * N };
      right = { x: section.x + section.size + 14, y: section.y };
      capY = pad + 10;
      top = capY + 8;
      ground = section.y - 8;
      depth = 1.5;
      weight = { cable: 6, w: 38, h: 15 };
      chart = null;
    } else {
      const cs = Math.max(12, Math.floor(Math.min(width * 0.42, height * 0.58, N * 36, height - 150) / N));
      section = { x: pad + 4, y: pad + 30, cs, size: cs * N };
      right = { x: section.x + section.size + 32 };
      right.y = section.y + section.size - 122; // the numbers, under the beam
      capY = pad + 14;
      top = capY + 40;
      ground = right.y - 16;
      depth = clamp(((ground - top) * 0.15) / N, 1.6, 4);
      weight = { cable: 12, w: 50, h: 30 };
      chart = { x: pad + 4, y: section.y + section.size + 34 };
      chart.w = width - pad - 4 - chart.x;
      chart.h = height - pad - chart.y;
    }
    right.w = width - pad - right.x;
    const xa = narrow ? pad + 22 : right.x + 26,
      xb = width - pad - (narrow ? 22 : 26);
    const rest = top + N * depth; // where the beam's underside rests on the piers
    const room = Math.max(10, ground - rest - weight.cable - weight.h - (narrow ? 6 : 12));
    // The sag is drawn larger, by a round factor chosen so the flat plank bends well into the gap.
    const perMm = (xb - xa) / (M.SPAN * 1000); // px per mm along the beam
    const factor = Math.max(1, Math.round((room * 0.62) / M.sag(M.PLANK) / perMm));
    return {
      narrow,
      pad,
      width,
      height,
      section,
      right,
      chart,
      capY,
      capX: narrow ? pad + 2 : right.x,
      xa,
      xb,
      rest,
      depth,
      weight,
      ground,
      groundFrom: narrow ? 0 : right.x - 8,
      room,
      factor,
      k: factor * perMm, // px per mm of sag
    };
  }

  /** The square of the grid under a pointer, or null. */
  function cellAt(p, stage) {
    if (!layout) return null;
    const { x, y, cs } = layout.section;
    const c = Math.floor((p.x * stage.width - x) / cs),
      r = Math.floor((p.y * stage.height - y) / cs);
    return r >= 0 && c >= 0 && r < N && c < N ? [r, c] : null;
  }

  // -------------------------------------------------------------- drawing

  function draw(ctx, s, stage) {
    if (prepare(s) && !animated()) settle();
    const { width, height } = stage;
    layout = measure(width, height);
    ctx.clearRect(0, 0, width, height);
    beamView(ctx, layout, stage.clock);
    sectionView(ctx, layout);
    numbers(ctx, layout);
    chart(ctx, layout);
  }

  /** The colour of steel a distance d (cm, + below) from its neutral axis: blue when squeezed, red when stretched. */
  function tint(d, alpha = 1) {
    const k = Math.min(1, Math.abs(d) / 6) ** 0.8;
    const to = d < 0 ? [79, 143, 230] : [232, 96, 79];
    const from = [169, 181, 194];
    const c = from.map((v, i) => Math.round(v + (to[i] - v) * k));
    return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})`;
  }

  /** The beam from the side, bent by the sag drawn now, on its piers, with the weight hanging from its middle. */
  function beamView(ctx, L) {
    const { xa, xb, rest, depth, ground, k } = L;
    ctx.save();
    // The ground and the two piers.
    ctx.fillStyle = COLOURS.ground;
    ctx.fillRect(L.groundFrom, ground, L.width - L.groundFrom, 3);
    const pierW = L.narrow ? 14 : 30;
    for (const x of [xa, xb]) {
      ctx.fillStyle = COLOURS.pier;
      ctx.fillRect(x - pierW / 2 - (x === xa ? pierW / 2 : -pierW / 2) * 0.6, rest + 1, pierW, ground - rest - 1);
    }
    // A supporting edge at each end: a pin on the left, a roller on the right.
    ctx.fillStyle = COLOURS.faint;
    for (const x of [xa, xb]) {
      ctx.beginPath();
      ctx.moveTo(x, rest);
      ctx.lineTo(x - 6, rest + 8);
      ctx.lineTo(x + 6, rest + 8);
      ctx.closePath();
      ctx.fill();
    }
    // The caption.
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = `400 ${L.narrow ? 11 : 13}px system-ui, sans-serif`;
    ctx.fillStyle = COLOURS.muted;
    const room = L.width - L.pad - L.capX;
    if (L.narrow) ctx.fillText(t.picture.drawnShort(whole(L.factor)), L.capX, L.capY, room);
    else {
      ctx.fillText(t.picture.caption, L.capX, L.capY, room);
      ctx.fillText(t.picture.drawn(whole(L.factor)), L.capX, L.capY + 18, room);
    }

    const drawn = clamp(sag * k, -L.room * 0.4, L.room);
    const bendAt = (xi) => drawn * M.curve(xi);
    const span = xb - xa;
    // The flat plank's sag, as a dashed ghost, when the beam is anything else.
    if (info.count && !isPlank()) {
      const plank = Math.min(M.sag(M.PLANK) * k, L.room);
      ctx.strokeStyle = L.quiet ? 'rgba(152, 170, 183, 0.7)' : 'rgba(152, 170, 183, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      for (let i = 0; i <= 48; i++) ctx.lineTo(xa + (span * i) / 48, rest + plank * M.curve(i / 48));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = `400 ${L.narrow ? 10 : 12}px system-ui, sans-serif`;
      ctx.fillStyle = L.quiet ? 'transparent' : 'rgba(152, 170, 183, 0.75)';
      ctx.textAlign = 'center';
      ctx.fillText(t.picture.marks.plank, xa + span * 0.3, rest + plank * M.curve(0.3) + (L.narrow ? 9 : 14));
      ctx.textAlign = 'left';
    }
    if (!info.count) {
      // No steel: the weight lies on the ground.
      weightAt(ctx, L, (xa + xb) / 2, ground - L.weight.h, false);
      ctx.restore();
      return;
    }
    // Each piece of the cross-section, as a band from its top to its bottom, bent along the same curve.
    const bottom = Math.max(...info.pieces.map((p) => p.bottom));
    const S = 96;
    for (const p of info.pieces) {
      const y0 = (p.top - bottom) * depth,
        y1 = (p.bottom - bottom) * depth,
        ya = (p.cy - bottom) * depth;
      for (let i = 0; i < S; i++) {
        const xi0 = i / S,
          xi1 = (i + 1) / S;
        const x0 = xa + span * xi0,
          x1 = xa + span * xi1;
        const v0 = rest + bendAt(xi0),
          v1 = rest + bendAt(xi1);
        // The squeeze and stretch are greatest in the middle of the span, and nothing at the supports.
        const moment = 1 - Math.abs(xi0 + xi1 - 1);
        const g = ctx.createLinearGradient(0, v0 + y0, 0, v0 + y1);
        g.addColorStop(0, tint(-(p.cy - p.top) * moment));
        g.addColorStop(clamp((ya - y0) / Math.max(1e-6, y1 - y0), 0, 1), tint(0));
        g.addColorStop(1, tint((p.bottom - p.cy) * moment));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(x0, v0 + y0);
        ctx.lineTo(x1 + 1, v1 + y0);
        ctx.lineTo(x1 + 1, v1 + y1);
        ctx.lineTo(x0, v0 + y1);
        ctx.closePath();
        ctx.fill();
      }
      // Its neutral axis, which is neither squeezed nor stretched.
      ctx.strokeStyle = 'rgba(232, 238, 245, 0.55)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (let i = 0; i <= S; i++) ctx.lineTo(xa + (span * i) / S, rest + bendAt(i / S) + ya);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    // The weight, hanging from the middle of the underside.
    const under = rest + bendAt(0.5);
    ctx.strokeStyle = COLOURS.faint;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo((xa + xb) / 2, under);
    ctx.lineTo((xa + xb) / 2, under + L.weight.cable);
    ctx.stroke();
    weightAt(ctx, L, (xa + xb) / 2, under + L.weight.cable, true);
    // The sag, beside the weight.
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = `600 ${L.narrow ? 11 : 14}px system-ui, sans-serif`;
    ctx.fillStyle = L.quiet ? 'transparent' : info.beyond ? COLOURS.warn : COLOURS.ink;
    const label = info.beyond ? t.picture.beyond : t.picture.sag(mm(info.sag));
    const lx = (xa + xb) / 2 + L.weight.w / 2 + (L.narrow ? 6 : 10);
    ctx.fillText(label, lx, under + L.weight.cable + L.weight.h / 2, L.width - L.pad - lx);
    ctx.restore();
  }

  function weightAt(ctx, L, x, y, hanging) {
    const { w, h } = L.weight;
    ctx.fillStyle = '#d9dee5';
    roundRect(ctx, x - w / 2, y, w, h, 4);
    ctx.fill();
    ctx.fillStyle = L.quiet ? 'transparent' : '#0a0e15';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `700 ${L.narrow ? 9 : 13}px system-ui, sans-serif`;
    ctx.fillText(t.picture.weight, x, y + h / 2 + 0.5, w - 4);
    if (!hanging) {
      ctx.fillStyle = COLOURS.warn;
      ctx.font = `600 ${L.narrow ? 11 : 14}px system-ui, sans-serif`;
      ctx.fillText(t.picture.none, x, y - (L.narrow ? 10 : 16));
    }
    ctx.textAlign = 'left';
  }

  /** Where a square of the grid is drawn now: in place, or on its way in a turn or a glide. */
  function squares() {
    if (!anim) return M.cells(rows).map(([r, c]) => ({ r, c, alpha: 1, d: depthOf(info, r, c) }));
    const e = ease(anim.t);
    if (anim.kind === 'turn') {
      // The old shape, turning about the grid's centre, a little past a quarter turn and back (a snap).
      const a = (Math.PI / 2) * back(anim.t),
        cos = Math.cos(a),
        sin = Math.sin(a);
      return M.cells(anim.from).map(([r, c]) => {
        const x = c + 0.5 - N / 2,
          y = r + 0.5 - N / 2;
        return {
          r: x * sin + y * cos + N / 2 - 0.5,
          c: x * cos - y * sin + N / 2 - 0.5,
          angle: a,
          alpha: 1,
          d: depthOf(anim.info, r, c),
        };
      });
    }
    return anim.moves.map(({ from, to }) => {
      if (!from) return { r: to[0], c: to[1], alpha: e, d: 0 };
      if (!to) return { r: from[0], c: from[1], alpha: 1 - e, d: 0 };
      return { r: from[0] + (to[0] - from[0]) * e, c: from[1] + (to[1] - from[1]) * e, alpha: 1, d: 0 };
    });
  }
  /** How far a square's centre sits below its piece's neutral axis, in cm. */
  function depthOf(analysis, r, c) {
    const p = analysis.pieces.find((q) => q.cells.some(([a, b]) => a === r && b === c));
    return p ? r + 0.5 - p.cy : 0;
  }
  const ease = (x) => 1 - (1 - Math.min(1, x)) ** 3;
  /** Ease out with a little overshoot. */
  function back(x) {
    const k = 1.9,
      u = Math.min(1, x) - 1;
    return 1 + (k + 1) * u ** 3 + k * u ** 2;
  }

  /** The cross-section: the grid, the steel coloured by how hard it works, each piece's neutral axis. */
  function sectionView(ctx, L) {
    const { x, y, cs, size } = L.section;
    ctx.save();
    if (!L.narrow) {
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.font = '600 13px system-ui, sans-serif';
      ctx.fillStyle = COLOURS.ink;
      ctx.fillText(t.picture.section, x, y - 12);
      ctx.font = '400 12px system-ui, sans-serif';
      ctx.fillStyle = COLOURS.muted;
      ctx.textAlign = 'right';
      ctx.fillText(t.picture.unit, x + size, y - 12, size * 0.5);
    }
    ctx.fillStyle = COLOURS.box;
    roundRect(ctx, x - 3, y - 3, size + 6, size + 6, 6);
    ctx.fill();
    ctx.strokeStyle = COLOURS.edge;
    ctx.lineWidth = 1;
    for (let i = 1; i < N; i++) {
      ctx.beginPath();
      ctx.moveTo(x + i * cs + 0.5, y);
      ctx.lineTo(x + i * cs + 0.5, y + size);
      ctx.moveTo(x, y + i * cs + 0.5);
      ctx.lineTo(x + size, y + i * cs + 0.5);
      ctx.stroke();
    }
    // A wobbly shape rocks on its bottom edge: it could tip over sideways.
    const wobble = info.wobbly && !anim ? (reduced || !W.stage.playing ? ROCK * 0.6 : ROCK * Math.sin(rock * 4.4)) : 0;
    if (wobble) {
      const bottom = Math.max(...info.pieces.map((p) => p.bottom)),
        mid = (Math.min(...info.pieces.map((p) => p.left)) + Math.max(...info.pieces.map((p) => p.right))) / 2;
      ctx.translate(x + mid * cs, y + bottom * cs);
      ctx.rotate(wobble);
      ctx.translate(-(x + mid * cs), -(y + bottom * cs));
    }
    const inset = cs > 14 ? 1.5 : 1;
    for (const q of squares()) {
      ctx.globalAlpha = q.alpha;
      ctx.fillStyle = anim && anim.kind === 'glide' ? COLOURS.steel : tint(q.d);
      if (q.angle) {
        ctx.save();
        ctx.translate(x + (q.c + 0.5) * cs, y + (q.r + 0.5) * cs);
        ctx.rotate(q.angle);
        ctx.fillRect(-cs / 2 + inset, -cs / 2 + inset, cs - 2 * inset, cs - 2 * inset);
        ctx.restore();
      } else ctx.fillRect(x + q.c * cs + inset, y + q.r * cs + inset, cs - 2 * inset, cs - 2 * inset);
    }
    ctx.globalAlpha = 1;
    if (!anim)
      for (const p of info.pieces) {
        ctx.strokeStyle = 'rgba(232, 238, 245, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(x + p.left * cs - 5, y + p.cy * cs);
        ctx.lineTo(x + p.right * cs + 5, y + p.cy * cs);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    ctx.restore();
    // The mouse's square, and the keyboard's.
    for (const [cell, colour, w] of [
      [hover, 'rgba(242, 201, 76, 0.7)', 1.5],
      [aim, '#f2c94c', 2.5],
    ]) {
      if (!cell) continue;
      ctx.strokeStyle = colour;
      ctx.lineWidth = w;
      ctx.strokeRect(x + cell[1] * cs + 1, y + cell[0] * cs + 1, cs - 2, cs - 2);
    }
    if (flash) {
      ctx.globalAlpha = Math.min(1, flash.left / 0.4);
      const lines = wrap(ctx, flash.text, size - 20, `600 ${L.narrow ? 11 : 13}px system-ui, sans-serif`);
      const lh = L.narrow ? 14 : 18;
      const h = lines.length * lh + 14;
      ctx.fillStyle = 'rgba(10, 14, 21, 0.9)';
      roundRect(ctx, x + 6, y + size / 2 - h / 2, size - 12, h, 6);
      ctx.fill();
      ctx.fillStyle = COLOURS.warn;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      lines.forEach((line, i) => ctx.fillText(line, x + size / 2, y + size / 2 - h / 2 + 7 + lh * (i + 0.5)));
      ctx.globalAlpha = 1;
      ctx.textAlign = 'left';
    }
  }

  /** The sag and how stiff the beam is, the squares used, the key and what to notice; on a phone, a meter too. */
  function numbers(ctx, L) {
    const { x, w } = L.right;
    let y = L.right.y;
    const small = L.narrow;
    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    if (small) {
      ctx.font = '600 11px system-ui, sans-serif';
      ctx.fillStyle = COLOURS.ink;
      ctx.fillText(t.picture.section, x, y + 9, w);
      y += 14;
    }
    // The sag, big, and the comparison with the flat plank.
    ctx.font = `700 ${small ? 16 : 26}px system-ui, sans-serif`;
    ctx.fillStyle = info.beyond || !info.count ? COLOURS.warn : COLOURS.ink;
    const big = !info.count ? t.picture.none : info.beyond ? t.picture.beyond : t.picture.sag(mm(info.sag));
    ctx.fillText(big, x, y + (small ? 16 : 24), w);
    y += small ? 32 : 48;
    if (info.count) {
      ctx.font = `500 ${small ? 12 : 16}px system-ui, sans-serif`;
      ctx.fillStyle = COLOURS.ink;
      ctx.fillText(isPlank() ? t.picture.marks.plank : t.picture.times(times(info.times)), x, y, w);
    }
    y += small ? 12 : 26;
    // On a phone, the stiffness meter, from nothing to the best 24 squares can do (on wide pictures, the chart).
    if (small) {
      bar(ctx, x, y, w, 8, meter, info.best && !anim);
      ctx.font = '400 9px system-ui, sans-serif';
      ctx.fillStyle = COLOURS.muted;
      ctx.fillText(t.picture.marks.plank, x, y + 19, w / 2 - 2);
      ctx.textAlign = 'right';
      ctx.fillText(t.picture.marks.best, x + w, y + 19, w / 2 - 2);
      ctx.textAlign = 'left';
      y += 32;
    }
    ctx.font = `400 ${small ? 11 : 13}px system-ui, sans-serif`;
    ctx.fillStyle = info.left ? COLOURS.muted : COLOURS.ink;
    ctx.fillText(t.picture.squares(info.count, M.BUDGET), x, y, w);
    y += small ? 16 : 24;
    if (!small) {
      key(ctx, x, y, w);
      y += 26;
    }
    // What to notice: loose pieces, a wobble, the best there is.
    const notes = [];
    if (info.pieces.length > 1) notes.push([t.picture.loose(info.pieces.length), COLOURS.warn]);
    if (info.wobbly) notes.push([t.picture.wobbly, COLOURS.warn]);
    if (info.best) notes.push([t.picture.best, COLOURS.good]);
    const font = `600 ${small ? 11 : 13}px system-ui, sans-serif`;
    const lh = small ? 14 : 17;
    const last = L.chart ? L.chart.y - 8 : L.height - 4;
    for (const [text, colour] of notes) {
      ctx.fillStyle = colour;
      for (const line of wrap(ctx, text, w, font)) {
        if (y > last) break;
        ctx.fillText(line, x, y);
        y += lh;
      }
      y += small ? 2 : 4;
    }
    ctx.restore();
  }

  /** A stiffness bar, from nothing to the best 24 squares can do, with marks at the plank, its edge and the best. */
  function bar(ctx, x, y, w, h, value, best, bright = true) {
    ctx.fillStyle = COLOURS.box;
    roundRect(ctx, x, y, w, h, h / 2);
    ctx.fill();
    ctx.strokeStyle = COLOURS.edge;
    ctx.lineWidth = 1;
    ctx.stroke();
    const fill = clamp(value / M.BEST, 0, 1) * w;
    if (fill > 0.5) {
      ctx.fillStyle = best ? COLOURS.good : COLOURS.meter;
      ctx.globalAlpha = bright ? 1 : 0.55;
      roundRect(ctx, x, y, Math.max(h, fill), h, h / 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    for (const v of [M.PLANK, EDGE, M.BEST]) {
      ctx.fillStyle = 'rgba(232, 238, 245, 0.7)';
      ctx.fillRect(Math.min(x + w - 1.5, Math.max(x, x + (v / M.BEST) * w - 0.75)), y - 2, 1.5, h + 4);
    }
  }

  /** What the colours mean. */
  function key(ctx, x, y, w) {
    let kx = x;
    ctx.font = '400 12px system-ui, sans-serif';
    for (const [name, colour] of [
      ['squeezed', COLOURS.squeezed],
      ['stretched', COLOURS.stretched],
      ['axis', null],
    ]) {
      if (colour) {
        ctx.fillStyle = colour;
        ctx.fillRect(kx, y - 9, 12, 12);
      } else {
        ctx.strokeStyle = 'rgba(232, 238, 245, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(kx, y - 3);
        ctx.lineTo(kx + 14, y - 3);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.fillStyle = COLOURS.muted;
      ctx.fillText(t.picture.key[name], kx + 18, y + 1, w / 3 - 22);
      kx += Math.min(w / 3, ctx.measureText(t.picture.key[name]).width + 40);
    }
  }

  /**
   * On wide pictures, under everything: the flat plank, the plank on its edge and the I-beam, each with its
   * stiffness and sag, and the visitor's own beam last, so the comparison stays in view whatever is painted.
   */
  function chart(ctx, L) {
    const C = L.chart;
    if (!C || C.h < 90) return;
    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '600 13px system-ui, sans-serif';
    ctx.fillStyle = COLOURS.ink;
    ctx.fillText(t.picture.chart, C.x, C.y, C.w);
    const rowH = Math.min(78, (C.h - 14) / 4);
    const thumb = Math.max(20, Math.floor((rowH - 10) / N) * N);
    const named = C.w * 0.24;
    const bx = C.x + thumb + 16 + named,
      bw = C.w - (bx - C.x) - 64;
    ['plank', 'edge', 'ibeam', 'yours'].forEach((name, i) => {
      const y = C.y + 12 + i * rowH;
      const a = name === 'yours' ? info : REFERENCE[name];
      const mine = name === 'yours';
      if (mine) {
        ctx.fillStyle = 'rgba(242, 201, 76, 0.07)';
        roundRect(ctx, C.x - 6, y - 3, C.w + 12, rowH - 2, 8);
        ctx.fill();
      }
      mini(ctx, a, C.x, y + (rowH - 4 - thumb) / 2, thumb);
      const mid = y + (rowH - 4) / 2;
      ctx.font = `${mine ? 700 : 600} 13px system-ui, sans-serif`;
      ctx.fillStyle = COLOURS.ink;
      ctx.fillText(t.picture.rows[name], C.x + thumb + 14, rowH >= 40 ? mid - 2 : mid + 5, named - 6);
      // The sag under the name, when the rows have room for two lines.
      if (rowH >= 40) {
        ctx.font = '400 12px system-ui, sans-serif';
        ctx.fillStyle = COLOURS.muted;
        const line = !a.count ? t.picture.none : a.beyond ? t.picture.beyond : t.picture.sag(mm(a.sag));
        ctx.fillText(line, C.x + thumb + 14, mid + 14, named - 6);
      }
      bar(ctx, bx, mid - 6, bw, 12, mine ? meter : a.ixx, a.best && !(mine && anim), mine || !rowIsMine(name));
      ctx.font = `${mine ? 700 : 500} 13px system-ui, sans-serif`;
      ctx.fillStyle = COLOURS.ink;
      if (a.count) ctx.fillText(t.picture.timesShort(times(a.times)), bx + bw + 10, mid + 4, 54);
    });
    ctx.restore();
  }
  /** Whether a row of the chart shows the shape the visitor has now (it's then dimmed, as "Yours" repeats it). */
  const rowIsMine = (name) => name === info.name;

  /** A small cross-section, for the chart. */
  function mini(ctx, a, x, y, size) {
    const cs = size / N;
    ctx.fillStyle = COLOURS.box;
    roundRect(ctx, x - 2, y - 2, size + 4, size + 4, 4);
    ctx.fill();
    for (const p of a.pieces)
      for (const [r, c] of p.cells) {
        ctx.fillStyle = tint(r + 0.5 - p.cy);
        ctx.fillRect(x + c * cs, y + r * cs, Math.max(1, cs - 0.6), Math.max(1, cs - 0.6));
      }
  }

  /** Words broken into lines that fit a width. */
  function wrap(ctx, text, width, font) {
    ctx.font = font;
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

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  }

  /** The home map's picture: an I-beam carrying the weight, the flat plank's sag as a ghost, its cross-section. */
  function preview(ctx, width, height) {
    const side = width > height * 1.4 ? height : Math.min(width, height);
    const ox = (width - side) / 2,
      oy = (height - side) / 2;
    const keep = { rows, info, sag, meter, anim };
    rows = M.SHAPES.ibeam;
    info = M.analyse(rows);
    anim = null;
    const cs = Math.floor((side * 0.46) / N);
    const L = {
      narrow: true,
      quiet: true, // no words: the map's picture is too small to read them
      pad: 8,
      width: side,
      height: side,
      capY: -100,
      xa: side * 0.08,
      xb: side * 0.92,
      rest: side * 0.2,
      depth: side * 0.0075,
      weight: { cable: side * 0.04, w: side * 0.16, h: side * 0.09 },
      ground: side * 0.44,
      room: side * 0.2,
      factor: 1,
      k: (side * 0.13) / M.sag(M.PLANK),
      section: { x: (side - cs * N) / 2, y: side - cs * N - side * 0.05, cs, size: cs * N },
    };
    sag = M.sag(M.BEST);
    ctx.save();
    ctx.translate(ox, oy);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, L.capY + 30, side, side);
    ctx.clip();
    beamView(ctx, { ...L, capY: -100 });
    ctx.restore();
    sectionView(ctx, L);
    ctx.restore();
    ({ rows, info, sag, meter, anim } = keep);
  }

  // ---------------------------------------------------------------- input

  /** Paint or erase one square of the stroke in progress. */
  function brush(cell, s, stage) {
    if (!stroke || !cell) return;
    const key = cell[0] * N + cell[1];
    if (stroke.touched.has(key)) return;
    stroke.touched.add(key);
    const on = M.has(rows, cell[0], cell[1]);
    if (stroke.mode === 'paint' && !on) {
      if (info.left <= 0) {
        if (!stroke.full) flash = { text: t.picture.full, left: 2.2 };
        stroke.full = true;
        return;
      }
      change(M.set(rows, cell[0], cell[1], true), s, stage);
      stroke.changed = true;
    } else if (stroke.mode === 'erase' && on) {
      change(M.set(rows, cell[0], cell[1], false), s, stage);
      stroke.changed = true;
    }
  }

  function begin(cell, s, stage) {
    takeOver(s);
    stroke = {
      mode: M.has(rows, cell[0], cell[1]) ? 'erase' : 'paint',
      before: rows,
      touched: new Set(),
      changed: false,
    };
    brush(cell, s, stage);
  }

  function end(keep) {
    if (!stroke) return;
    const done = stroke;
    stroke = null;
    const s = W.stage.settingsFor('beam');
    if (!done.changed) return;
    if (!keep) {
      // A cancelled gesture puts the squares back.
      change(done.before, s, W.stage);
      return;
    }
    history.push(done.before);
    if (history.length > 60) history.shift();
    W.stage.sync();
    say();
  }

  function moveAim(dx, dy) {
    aim = aim ? [clamp(aim[0] + dy, 0, N - 1), clamp(aim[1] + dx, 0, N - 1)] : [5, 5];
  }

  // ----------------------------------------------------------------- room

  const presetShapes = [M.SHAPES.plank, M.SHAPES.edge, M.SHAPES.ibeam];
  const badges = ['▬', '▮', 'I'];

  const room = W.defineRoom({
    id: 'beam',
    symbol: '⌶',
    theme: 'engineering',
    added: '2026-10-07',
    eyebrow: t.eyebrow,
    name: t.name,
    tagline: t.tagline,
    accent: { background: '#1d2430', border: '#f2c94c', color: '#f6e3a8' },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.sceneLabel,
    sceneName: t.sceneNames.plank,
    tip: t.tip,
    actionLabel: t.actionLabel,
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { ...t.connection, go: 'truss' },

    defaults: { ...M.toSettings(M.SHAPES.plank), auto: true },
    ranges: Object.fromEntries(M.KEYS.map((k) => [k, [0, 2 ** N - 1, 'integer']])),
    defaultPreset: 0,
    presets: t.presets.map((p, i) => ({
      ...p,
      badge: badges[i],
      settings: { ...M.toSettings(presetShapes[i]), auto: false },
    })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Galileo',
        color: '#e0b070',
        sketch: { hairStyle: 'receding', hair: '#8a6a4a', skin: '#e8c4a0', beard: 'full', backdrop: '#2a2218' },
      },
      {
        ...t.guests[1],
        bio: 'Euler',
        color: '#8fb8f0',
        sketch: { hairStyle: 'wig', hair: '#e8e2d6', skin: '#efcfb0', backdrop: '#1a2233' },
      },
      {
        ...t.guests[2],
        bio: 'Navier',
        color: '#a8d8a0',
        sketch: { hairStyle: 'swept', hair: '#4a3a2c', skin: '#eccaa8', brows: 'bold', backdrop: '#1a2a20' },
      },
    ],

    insight: t.insight,

    controls: () =>
      '<div class="wide readout beam-readout" id="beam-readout"></div>' +
      `<div class="wide beam-buttons"><button class="button" id="beam-undo" type="button">${t.undo}</button>` +
      `<button class="button" id="beam-clear" type="button">${t.clear}</button></div>`,

    bindControls(panel, s, stage) {
      shown = '';
      panel.querySelector('#beam-undo').addEventListener('click', () => undo(stage.settingsFor('beam'), stage));
      panel.querySelector('#beam-clear').addEventListener('click', () => clear(stage.settingsFor('beam'), stage));
    },

    readouts: report,

    enter(s, stage) {
      hover = null;
      aim = null;
      stroke = null;
      flash = null;
      history = [];
      rows = M.fromSettings(s);
      info = M.analyse(rows);
      // A shape from a shared link or a saved moment stays put; otherwise the opening plays.
      if (s.auto && (reduced || !M.same(rows, M.SHAPES.plank))) s.auto = false;
      base = { ...s };
      start(s);
      stage.setChosen(presetIndex());
      stage.sync();
      stage.draw();
    },

    step(dt, s, stage) {
      if (prepare(s)) settle();
      rock += dt;
      if (flash && (flash.left -= dt) <= 0) flash = null;
      if (anim) {
        anim.t += dt / (anim.kind === 'turn' ? TURN : GLIDE);
        if (anim.t >= 1) anim = null;
      }
      // The opening: the plank sags, stands on its edge, then slides into an I.
      if (demo) {
        demo.clock += dt;
        if (demo.step === 0 && demo.clock >= OPENING[0]) {
          demo.step = 1;
          change(M.rotate(rows), s, stage, 'turn');
          s.auto = true;
        } else if (demo.step === 1 && demo.clock >= OPENING[1]) {
          demo.step = 2;
          change(M.SHAPES.ibeam, s, stage, 'glide');
          s.auto = true;
        } else if (demo.step === 2 && demo.clock >= OPENING[2]) {
          demo = null;
          s.auto = false;
          stage.sync();
        }
      }
      // The beam springs to its new sag once the squares have settled; the meter slides along.
      if (!anim) {
        const goal = settled();
        for (let k = 0; k < 4; k++) {
          const h = dt / 4;
          speed += (-(SPRING.omega ** 2) * (sag - goal) - 2 * SPRING.damping * SPRING.omega * speed) * h;
          sag += speed * h;
        }
        meter += (info.ixx - meter) * Math.min(1, dt * 7);
      }
    },

    draw,
    preview,

    /** Turn the cross-section a quarter turn: the flat plank stands on its edge. */
    action: (s, stage) => turn(s, stage),

    reset(s, stage) {
      Object.assign(s, base);
      history = [];
      rows = M.fromSettings(s);
      info = M.analyse(rows);
      start(s);
      stage.setChosen(presetIndex());
      stage.sync();
      stage.draw();
    },

    onPreset(s, stage) {
      // The preset has written its shape into the settings; slide the squares from the old one into it.
      const next = M.fromSettings(s);
      takeOver(s);
      if (!M.same(next, rows)) remember();
      change(next, s, stage, 'glide');
      say();
    },

    pointer: {
      // A finger on the grid paints; anywhere else it scrolls the page.
      drag: (p, s, stage) => !!cellAt(p, stage),
      down(p, s, stage, e) {
        if (e && e.button > 0) return;
        const cell = cellAt(p, stage);
        if (cell) begin(cell, s, stage);
      },
      move(p, { mouse, dragging }, s, stage) {
        const cell = cellAt(p, stage);
        if (stroke && dragging) brush(cell, s, stage);
        const before = hover;
        hover = mouse && !dragging ? cell : null;
        if (String(hover) !== String(before) && !stage.playing) stage.draw();
      },
      up(e) {
        end(e?.type !== 'pointercancel');
      },
      leave() {
        hover = null;
      },
      escape: () => (aim = null),
      arrow(dx, dy) {
        moveAim(dx, dy);
      },
      key(e, s, stage) {
        if (e.key === 'Enter') {
          if (!aim) moveAim(0, 0);
          begin(aim, s, stage);
          end(true);
          return true;
        }
        if (e.key === 'Backspace' || e.key === 'Delete') {
          undo(s, stage);
          return true;
        }
        return false;
      },
    },
  });

  /** The scene as it opens: the weight just hung on, and the opening ready to play if it's on. */
  function start(s) {
    anim = null;
    flash = null;
    demo = s.auto ? { clock: 0, step: 0 } : null;
    meter = info.ixx;
    if (reduced) settle();
    else {
      sag = 0;
      speed = 0;
    }
  }
})();
