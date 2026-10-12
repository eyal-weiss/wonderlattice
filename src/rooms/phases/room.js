/* Room · Three wires, no way back: three-phase currents cancel, their power is steady, and three coils turn a field. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, TAU, clamp } = W;
  const M = W.models.phases;
  const t = W.text('phases');
  const reduced = W.prefersReducedMotion();

  const KEYS = ['one', 'two', 'three']; // each wire's current in amps, 100 at full load
  // Okabe–Ito orange, sky blue and reddish purple, safe for colour-blind eyes, and told apart by their lines too.
  const COLORS = ['#e69f00', '#56b4e9', '#cc79a7'];
  const DASHES = [[], [9, 5], [2, 4]];
  const WHITE = '#f2f1ea',
    DIM = '#2b3546',
    FAINT = '#1b2330',
    MUTED = '#9aa6b8';
  const PERIOD = 3; // seconds per cycle on the screen: 50 Hz slowed down 150 times
  const START = Math.PI / 3; // the angle at clock 0, where no arrow lies flat
  const CURRENTS = 0,
    POWER = 1,
    FIELD = 2;
  // The opening, in seconds: three circuits on six wires; their return wires slide together; the shared wire carries
  // nothing; then three wires do the work of six.
  const MERGE_FROM = 2.2,
    MERGE_TO = 4.4,
    SETTLED = 6.6;

  let opening = SETTLED, // seconds into the opening, SETTLED once it's over
    grabbed = -1, // the arrow a finger or mouse is pulling
    picked = 0, // the wire the arrow keys change
    keyed = false; // once the keys are used, the picked arrow is ringed

  const loadsOf = (s) => KEYS.map((key) => s[key] / M.FULL);
  const angle = (st) => START + (TAU * st.clock) / PERIOD;
  const number = (x) => new Intl.NumberFormat(W.numberLocale, { maximumFractionDigits: 0 }).format(x);
  const ampsText = (a) => t.labels.amps(number(Math.round(a)));
  const balanced = (s) => KEYS.every((key) => s[key] === s.one);
  const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

  // ── Layout ───────────────────────────────────────────────────────────────────────

  /**
   * Where everything goes on a canvas w × h: the power line in a strip along the top, where the opening plays, and
   * below it the arrows' circle with the chart beside it, which takes the rest of the height. U is the length of a
   * full-load arrow; arrows reach 2U at twice the load.
   */
  function place(w, h) {
    const narrow = w < 560;
    const pad = narrow ? 8 : 16;
    const small = narrow ? 10 : 12;
    const stripTop = pad,
      stripH = clamp(h * 0.36, narrow ? 112 : 150, 250),
      stripBottom = stripTop + stripH;
    const captionY = stripTop + small + 2;
    const wiresTop = captionY + (narrow ? 4 : 8),
      gap = (stripBottom - wiresTop) / 4;
    const s = Math.max(4, Math.min(gap * 0.3, 22)); // half a house's height
    const stationW = narrow ? 30 : Math.min(96, w * 0.1);
    const houseW = Math.max(12, s * 2.2);
    const bandTop = stripBottom + (narrow ? 6 : 14),
      bandBottom = h - pad;
    const U = Math.max(
      14,
      Math.min(((bandBottom - bandTop) / 2 - small - (narrow ? 4 : 8)) / 2, w * (narrow ? 0.12 : 0.105)),
    );
    const cx = pad + 2 * U + (narrow ? 2 : 10),
      cy = (bandTop + bandBottom) / 2 - (narrow ? 4 : 8);
    return {
      narrow,
      pad,
      U,
      cx,
      cy,
      x0: cx + 2 * U + (narrow ? 14 : 30),
      x1: w - pad,
      bandTop,
      bandBottom,
      small,
      captionY,
      gap,
      s,
      // The wires run from the station's right edge to the houses' left edge.
      xs: pad + stationW,
      xh: w - pad - houseW,
      stationW,
      houseW,
      wiresTop,
      y: (k) => wiresTop + (k + 0.5) * gap, // wire k's house sits here; the shared wire back at y(3)
    };
  }

  /** Where wire k's arrow points at the angle θ, as screen coordinates (y grows downwards). */
  function tip(L, load, k, theta) {
    const a = theta - M.lag(k);
    return { x: L.cx + L.U * load * Math.cos(a), y: L.cy - L.U * load * Math.sin(a) };
  }

  // ── Drawing ──────────────────────────────────────────────────────────────────────

  function arrow(ctx, from, to, color, width, head) {
    const dx = to.x - from.x,
      dy = to.y - from.y,
      len = Math.hypot(dx, dy);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    if (len < 2) return;
    const ux = dx / len,
      uy = dy / len,
      size = Math.min(head, len * 0.45);
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(to.x - ux * size - uy * size * 0.55, to.y - uy * size + ux * size * 0.55);
    ctx.lineTo(to.x - ux * size + uy * size * 0.55, to.y - uy * size - ux * size * 0.55);
    ctx.closePath();
    ctx.fill();
  }

  function label(ctx, text, x, y, color, align = 'left', ltr = false) {
    ctx.direction = ltr ? 'ltr' : 'inherit';
    ctx.textAlign = align;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.direction = 'inherit';
  }

  /** The circle: three arrows a third of a turn apart, their copies head to tail, and their sum. */
  function drawPhasors(ctx, L, loads, theta) {
    const c = { x: L.cx, y: L.cy };
    ctx.setLineDash([]);
    ctx.strokeStyle = DIM;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(L.cx, L.cy, L.U, 0, TAU);
    ctx.stroke();
    ctx.strokeStyle = FAINT;
    ctx.beginPath();
    ctx.arc(L.cx, L.cy, 2 * L.U, 0, TAU);
    ctx.stroke();
    // The arrows head to tail: equal arrows close a triangle, back where they started.
    let at = c;
    ctx.globalAlpha = 0.5;
    for (let k = 0; k < 3; k++) {
      const v = tip(L, loads[k], k, theta),
        next = { x: at.x + v.x - L.cx, y: at.y + v.y - L.cy };
      if (k > 0) {
        ctx.setLineDash([4, 4]);
        arrow(ctx, at, next, COLORS[k], 1.2, 6);
      }
      at = next;
    }
    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
    const head = L.narrow ? 7 : 11,
      width = L.narrow ? 2.2 : 3.2;
    for (let k = 0; k < 3; k++) {
      const v = tip(L, loads[k], k, theta);
      arrow(ctx, c, v, COLORS[k], width, head);
      if (keyed && k === picked) {
        ctx.strokeStyle = COLORS[k];
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(v.x, v.y, head + 4, 0, TAU);
        ctx.stroke();
      }
      // The wire's number, just beyond its tip.
      const a = theta - M.lag(k),
        r = L.U * loads[k] + head + 2;
      ctx.font = `600 ${L.small}px system-ui`;
      label(
        ctx,
        String(k + 1),
        L.cx + r * Math.cos(a),
        L.cy - r * Math.sin(a) + L.small * 0.35,
        COLORS[k],
        'center',
        true,
      );
    }
    // Their sum, the current that would come back: nothing, when the loads are equal.
    const sum = M.sum(loads),
      a = Math.atan2(sum.y, sum.x) + theta,
      len = Math.hypot(sum.x, sum.y) * L.U;
    ctx.font = `600 ${L.small}px system-ui`;
    if (len < 1.5) {
      ctx.fillStyle = WHITE;
      ctx.beginPath();
      ctx.arc(L.cx, L.cy, L.narrow ? 3 : 4.5, 0, TAU);
      ctx.fill();
      label(ctx, t.labels.sumZero, L.cx, L.cy + 2 * L.U + L.small + (L.narrow ? 3 : 6), WHITE, 'center');
    } else {
      const end = { x: L.cx + len * Math.cos(a), y: L.cy - len * Math.sin(a) };
      arrow(ctx, c, end, WHITE, width + 0.6, head + 2);
      label(ctx, t.labels.sum, L.cx, L.cy + 2 * L.U + L.small + (L.narrow ? 3 : 6), WHITE, 'center');
    }
  }

  /** The currents over time: each arrow's height, traced to the right; the white sum stays flat when balanced. */
  function drawWaves(ctx, L, loads, theta) {
    const span = L.x1 - L.x0,
      perPixel = (TAU * 1.5) / Math.max(1, span); // a cycle and a half across the chart
    ctx.strokeStyle = DIM;
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(L.x0, L.cy);
    ctx.lineTo(L.x1, L.cy);
    ctx.stroke();
    // Each arrow's tip throws its height across to the start of its wave.
    ctx.setLineDash([2, 3]);
    ctx.globalAlpha = 0.45;
    for (let k = 0; k < 3; k++) {
      const v = tip(L, loads[k], k, theta);
      ctx.strokeStyle = COLORS[k];
      ctx.beginPath();
      ctx.moveTo(v.x, v.y);
      ctx.lineTo(L.x0, v.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    const wave = (value, color, dash, width) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.setLineDash(dash);
      ctx.beginPath();
      for (let x = 0; x <= span; x += 2) {
        const y = L.cy - L.U * value(theta - x * perPixel);
        x === 0 ? ctx.moveTo(L.x0 + x, y) : ctx.lineTo(L.x0 + x, y);
      }
      ctx.stroke();
    };
    for (let k = 0; k < 3; k++) wave((a) => M.current(loads[k], k, a), COLORS[k], DASHES[k], L.narrow ? 1.6 : 2.2);
    wave((a) => M.returning(loads, a), WHITE, [], L.narrow ? 2.2 : 3);
    ctx.setLineDash([]);
    const flat = M.returnAmps(loads) < 0.5;
    ctx.font = `600 ${L.small}px system-ui`;
    const y = flat ? L.cy - 6 : L.cy - L.U * M.returning(loads, theta - span * perPixel) - 6;
    label(ctx, flat ? t.labels.sumZero : t.labels.sum, L.x1, y, WHITE, 'right');
  }

  /** Each street's power pulsing as sin², and their total, steady when the loads are equal. */
  function drawPower(ctx, L, loads, theta) {
    const span = L.x1 - L.x0,
      perPixel = (TAU * 1.5) / Math.max(1, span),
      base = L.cy + 2 * L.U,
      scale = (4 * L.U - L.small * 2) / 3; // a total of 3 (every street at twice its load) reaches the top
    ctx.strokeStyle = DIM;
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(L.x0, base);
    ctx.lineTo(L.x1, base);
    ctx.stroke();
    const curve = (value, color, dash, width) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.setLineDash(dash);
      ctx.beginPath();
      for (let x = 0; x <= span; x += 2) {
        const y = base - scale * value(theta - x * perPixel);
        x === 0 ? ctx.moveTo(L.x0 + x, y) : ctx.lineTo(L.x0 + x, y);
      }
      ctx.stroke();
    };
    for (let k = 0; k < 3; k++) curve((a) => M.power(loads[k], k, a), COLORS[k], DASHES[k], L.narrow ? 1.6 : 2.2);
    curve((a) => M.totalPower(loads, a), WHITE, [], L.narrow ? 2.4 : 3.2);
    ctx.setLineDash([]);
    ctx.font = `600 ${L.small}px system-ui`;
    label(ctx, t.labels.total, L.x1, base - scale * M.totalPower(loads, theta - span * perPixel) - 7, WHITE, 'right');
    label(ctx, t.labels.each, L.x0, base - scale * Math.max(...loads) - 7, MUTED, 'left');
  }

  /** Three coils round a compass: their currents make a field of steady strength that turns once a cycle. */
  function drawField(ctx, L, loads, theta, swap) {
    const fx = (L.x0 + L.x1) / 2,
      fy = L.cy,
      R = Math.max(20, Math.min(2 * L.U, (L.x1 - L.x0) / 2 - L.small * 2)),
      order = swap ? [0, 2, 1] : [0, 1, 2],
      scale = (R * 0.62) / 1.5; // a balanced field reaches 62% of the way to the coils
    ctx.setLineDash([]);
    ctx.strokeStyle = DIM;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(fx, fy, R * 0.82, 0, TAU);
    ctx.stroke();
    // The path of the field's tip over a cycle: a circle when balanced, an ellipse when not.
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = '#5d6b80';
    ctx.beginPath();
    for (let j = 0; j <= 90; j++) {
      const f = M.field(loads, (j / 90) * TAU, swap),
        x = fx + scale * f.x,
        y = fy - scale * f.y;
      j ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    for (let k = 0; k < 3; k++) {
      const a = M.lag(order[k]),
        ux = Math.cos(a),
        uy = -Math.sin(a),
        i = M.current(loads[k], k, theta),
        cxk = fx + R * ux,
        cyk = fy + R * uy,
        long = Math.max(10, R * 0.34),
        thick = Math.max(6, R * 0.13);
      // The coil, glowing with its current, and the little push it gives the field.
      ctx.save();
      ctx.translate(cxk, cyk);
      ctx.rotate(Math.atan2(uy, ux));
      ctx.fillStyle = FAINT;
      ctx.fillRect(-long / 2, -thick / 2, long, thick);
      ctx.globalAlpha = 0.25 + 0.75 * Math.min(1, Math.abs(i) / 1.5);
      ctx.strokeStyle = COLORS[k];
      ctx.lineWidth = L.narrow ? 1.4 : 2;
      // Its windings cross its axis, which points at the compass.
      for (let j = 0; j <= 5; j++) {
        const x = -long / 2 + (j / 5) * long;
        ctx.beginPath();
        ctx.moveTo(x, -thick / 2 - 2);
        ctx.lineTo(x, thick / 2 + 2);
        ctx.stroke();
      }
      ctx.restore();
      ctx.globalAlpha = 0.55;
      arrow(ctx, { x: fx, y: fy }, { x: fx + scale * i * ux, y: fy + scale * i * uy }, COLORS[k], 1.4, 6);
      ctx.globalAlpha = 1;
      ctx.font = `600 ${L.small}px system-ui`;
      label(
        ctx,
        String(k + 1),
        cxk + ux * (long / 2 + L.small),
        cyk + uy * (long / 2 + L.small) + L.small * 0.35,
        COLORS[k],
        'center',
        true,
      );
    }
    // The field, and a compass needle that follows it.
    const f = M.field(loads, theta, swap),
      strength = Math.hypot(f.x, f.y),
      dir = Math.atan2(f.y, f.x),
      nx = Math.cos(dir),
      ny = -Math.sin(dir),
      needle = R * 0.5,
      half = Math.max(3, R * 0.07);
    if (strength > 0.01) {
      ctx.fillStyle = '#e8574a';
      ctx.beginPath();
      ctx.moveTo(fx + nx * needle, fy + ny * needle);
      ctx.lineTo(fx - ny * half, fy + nx * half);
      ctx.lineTo(fx + ny * half, fy - nx * half);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#d9dde3';
      ctx.beginPath();
      ctx.moveTo(fx - nx * needle, fy - ny * needle);
      ctx.lineTo(fx - ny * half, fy + nx * half);
      ctx.lineTo(fx + ny * half, fy - nx * half);
      ctx.closePath();
      ctx.fill();
    }
    arrow(
      ctx,
      { x: fx, y: fy },
      { x: fx + scale * f.x, y: fy - scale * f.y },
      WHITE,
      L.narrow ? 2.2 : 3,
      L.narrow ? 8 : 12,
    );
    ctx.fillStyle = WHITE;
    ctx.beginPath();
    ctx.arc(fx, fy, 3, 0, TAU);
    ctx.fill();
    ctx.font = `600 ${L.small}px system-ui`;
    if (!L.narrow)
      label(
        ctx,
        t.labels.field,
        fx,
        fy + R + L.small * 2.2 > L.bandBottom ? fy - R - L.small : fy + R + L.small * 2.2,
        WHITE,
        'center',
      );
    if (swap) label(ctx, t.labels.swapped, L.x1, L.bandTop + L.small, MUTED, 'right');
  }

  /** A little house whose windows glow with the power it draws. */
  function house(ctx, x, y, w, s, glow, color) {
    ctx.fillStyle = '#141b26';
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.lineTo(x + w / 2, y - s - s * 0.8);
    ctx.lineTo(x + w, y - s);
    ctx.lineTo(x + w, y + s);
    ctx.lineTo(x, y + s);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    const win = Math.max(3, s * 0.55);
    ctx.fillStyle = `rgba(255, 214, 120, ${0.08 + 0.92 * clamp(glow, 0, 1)})`;
    ctx.fillRect(x + w * 0.18, y - win * 0.6, win, win);
    ctx.fillRect(x + w * 0.82 - win, y - win * 0.6, win, win);
  }

  /** Dots along a wire, rocking back and forth with its current (alternating current goes nowhere on average). */
  function dots(ctx, x0, x1, y, shift, color, spacing, radius) {
    ctx.fillStyle = color;
    const span = x1 - x0;
    for (let j = 0; j * spacing < span + spacing; j++) {
      const x = x0 + ((((j * spacing + shift) % span) + span) % span);
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, TAU);
      ctx.fill();
    }
  }

  /** The power line: the station, three wires to three streets, and the wire back, with its meter. */
  function drawLine(ctx, L, loads, theta) {
    const merge = ease((opening - MERGE_FROM) / (MERGE_TO - MERGE_FROM)),
      shared = opening >= MERGE_TO,
      yBack = L.y(3),
      spacing = L.narrow ? 12 : 18,
      rock = spacing * 0.9, // how far a dot rocks at full load
      radius = L.narrow ? 1.6 : 2.2,
      lead = Math.min(28, (L.xh - L.xs) * 0.08); // the slanted ends where the wires back gather
    const back = Math.round(M.returnAmps(loads));
    // The caption above the line tells the opening's story, then what the wire back is doing.
    const story = opening < MERGE_FROM ? 0 : opening < MERGE_TO ? 1 : opening < SETTLED ? 2 : back === 0 ? 3 : -1;
    ctx.font = `600 ${L.small + 1}px system-ui`;
    const tell = story >= 0 ? t.labels.story[story] : t.labels.differ;
    label(ctx, tell, L.xs + (L.narrow ? 6 : 12), L.captionY, story >= 0 ? WHITE : '#ffcf7a');

    // The power station, with a generator coil for each wire.
    const top = L.wiresTop - 2,
      bottom = yBack + L.s;
    ctx.fillStyle = '#121925';
    ctx.strokeStyle = DIM;
    ctx.lineWidth = 1.2;
    ctx.fillRect(L.pad, top, L.stationW, bottom - top);
    ctx.strokeRect(L.pad, top, L.stationW, bottom - top);
    if (!L.narrow) {
      ctx.font = `${L.small - 1}px system-ui`;
      label(ctx, t.labels.station, L.pad + L.stationW / 2, L.captionY, MUTED, 'center');
    }

    for (let k = 0; k < 3; k++) {
      const y = L.y(k),
        // Where the dots have got to: the integral of the current, −load·cos.
        shift = -rock * loads[k] * Math.cos(theta - M.lag(k)),
        out = y - L.s * 0.6,
        ret = y + L.s * 0.6,
        down = ret + (yBack - ret) * merge;
      // The generator coil.
      ctx.strokeStyle = COLORS[k];
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(L.xs - L.stationW * 0.35, y, Math.max(3, L.s * 0.75), 0, TAU);
      ctx.stroke();
      ctx.font = `600 ${L.small - 1}px system-ui`;
      label(ctx, String(k + 1), L.xs - L.stationW * 0.35, y + (L.small - 1) * 0.35, COLORS[k], 'center', true);
      // The wire out, in the wire's colour and line.
      ctx.setLineDash(DASHES[k]);
      ctx.strokeStyle = COLORS[k];
      ctx.lineWidth = L.narrow ? 1.6 : 2.2;
      ctx.beginPath();
      ctx.moveTo(L.xs, out);
      ctx.lineTo(L.xh, out);
      ctx.stroke();
      ctx.setLineDash([]);
      dots(ctx, L.xs + 4, L.xh - 4, out, shift, COLORS[k], spacing, radius);
      // Its own wire back, until the three slide together into one.
      if (!shared) {
        ctx.strokeStyle = '#6b7689';
        ctx.lineWidth = L.narrow ? 1.2 : 1.6;
        ctx.beginPath();
        ctx.moveTo(L.xh, ret);
        ctx.lineTo(L.xh - lead, down);
        ctx.lineTo(L.xs + lead, down);
        ctx.lineTo(L.xs, ret);
        ctx.stroke();
        dots(ctx, L.xs + lead + 2, L.xh - lead - 2, down, -shift, '#8994a7', spacing, radius * 0.85);
      } else {
        // Joined to the shared wire back at both ends.
        ctx.strokeStyle = '#6b7689';
        ctx.lineWidth = L.narrow ? 1.2 : 1.6;
        ctx.beginPath();
        ctx.moveTo(L.xh, ret);
        ctx.lineTo(L.xh - lead, yBack);
        ctx.moveTo(L.xs + lead, yBack);
        ctx.lineTo(L.xs, ret);
        ctx.stroke();
      }
      // The street at the end, its windows glowing with the power it draws.
      house(ctx, L.xh, y, L.houseW, L.s, M.power(loads[k], k, theta) / 2, COLORS[k]);
      if (!L.narrow && L.gap > 44) {
        ctx.font = `${L.small - 1}px system-ui`;
        label(ctx, t.labels.street(k + 1), L.xh - 6, out - 6, MUTED, 'right');
      }
    }

    if (shared) {
      // One wire back for all three: still when the currents cancel, rocking with their difference when not.
      const net = M.sum(loads),
        shift = rock * Math.hypot(net.x, net.y) * Math.cos(theta + Math.atan2(net.y, net.x));
      const fade = clamp((opening - MERGE_TO) / 0.6, 0, 1);
      ctx.globalAlpha = fade;
      ctx.strokeStyle = back === 0 ? '#8994a7' : WHITE;
      ctx.lineWidth = L.narrow ? 1.6 : 2.2;
      ctx.beginPath();
      ctx.moveTo(L.xs + lead, yBack);
      ctx.lineTo(L.xh - lead, yBack);
      ctx.stroke();
      dots(ctx, L.xs + lead + 2, L.xh - lead - 2, yBack, -shift, back === 0 ? '#8994a7' : WHITE, spacing, radius);
      // The meter on the wire back.
      const mx = (L.xs + L.xh) / 2,
        mr = Math.max(7, Math.min(18, L.gap * 0.42));
      ctx.fillStyle = '#0d131c';
      ctx.strokeStyle = back === 0 ? '#8994a7' : '#ffcf7a';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(mx, yBack, mr, 0, TAU);
      ctx.fill();
      ctx.stroke();
      // Its scale, from 0 on the left to 200 A on the right, and the needle.
      const pivot = yBack + mr * 0.45,
        reach = mr * 0.95,
        from = -Math.PI * 0.35,
        swing = from + clamp(back / 200, 0, 1) * Math.PI * 0.7;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(mx, pivot, reach * 0.8, -Math.PI / 2 + from, -Math.PI / 2 - from);
      ctx.stroke();
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(mx, pivot);
      ctx.lineTo(mx + Math.sin(swing) * reach, pivot - Math.cos(swing) * reach);
      ctx.stroke();
      ctx.font = `700 ${L.small + 2}px system-ui`;
      label(
        ctx,
        ampsText(M.returnAmps(loads)),
        mx + mr + 6,
        yBack + (L.small + 2) * 0.35,
        back === 0 ? WHITE : '#ffcf7a',
        'left',
        true,
      );
      ctx.font = `${L.small - 1}px system-ui`;
      label(ctx, t.labels.shared, L.xs + lead + 4, yBack + L.small + 3, MUTED, 'left');
      ctx.globalAlpha = 1;
    } else if (!L.narrow) {
      ctx.font = `${L.small - 1}px system-ui`;
      label(
        ctx,
        t.labels.back,
        L.xs + lead + 4,
        L.y(2) + L.s * 0.6 + (yBack - L.y(2)) * merge + L.small + 3,
        MUTED,
        'left',
      );
    }
  }

  function draw(ctx, s, st) {
    const { width: w, height: h } = st,
      L = place(w, h),
      loads = loadsOf(s),
      theta = angle(st);
    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = 'round';
    drawPhasors(ctx, L, loads, theta);
    if (s.view === POWER) drawPower(ctx, L, loads, theta);
    else if (s.view === FIELD) drawField(ctx, L, loads, theta, s.swap);
    else drawWaves(ctx, L, loads, theta);
    drawLine(ctx, L, loads, theta);
  }

  /**
   * The map's picture and the link preview: the three arrows closing their triangle, and their waves with their flat
   * white sum, beside the circle on a wide picture and under it on a squarer one.
   */
  function preview(ctx, width, height) {
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    ctx.lineCap = 'round';
    const wide = width / height > 1.5,
      U = wide ? height * 0.2 : Math.min(height, width) * 0.15,
      L = { cx: width / 2, cy: wide ? height / 2 : height * 0.33, U },
      theta = START + 0.35,
      // Where the waves go: on both sides of the circle, or in a band underneath it.
      bands = wide
        ? [
            [width / 2 + 2.2 * U, width, height / 2, U],
            [0, width / 2 - 2.2 * U, height / 2, U],
          ]
        : [[width * 0.06, width * 0.94, height * 0.76, height * 0.13]];
    for (const [from, to, axis, amp] of bands) {
      for (let k = 0; k < 3; k++) {
        ctx.strokeStyle = COLORS[k];
        ctx.lineWidth = 2.4;
        ctx.setLineDash(DASHES[k]);
        ctx.beginPath();
        for (let x = from; x <= to; x += 2) {
          const y = axis - amp * M.current(1, k, theta - ((x - from) / (to - from)) * TAU * 1.5);
          x === from ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.strokeStyle = WHITE;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(from, axis);
      ctx.lineTo(to, axis);
      ctx.stroke();
    }
    ctx.strokeStyle = DIM;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(L.cx, L.cy, U, 0, TAU);
    ctx.stroke();
    const c = { x: L.cx, y: L.cy };
    let at = c;
    for (let k = 0; k < 3; k++) {
      const v = tip(L, 1, k, theta),
        next = { x: at.x + v.x - L.cx, y: at.y + v.y - L.cy };
      arrow(ctx, c, v, COLORS[k], 3.5, 12);
      if (k > 0) {
        ctx.globalAlpha = 0.6;
        ctx.setLineDash([4, 4]);
        arrow(ctx, at, next, COLORS[k], 1.6, 7);
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }
      at = next;
    }
    ctx.fillStyle = WHITE;
    ctx.beginPath();
    ctx.arc(L.cx, L.cy, 5, 0, TAU);
    ctx.fill();
  }

  // ── The panel ────────────────────────────────────────────────────────────────────

  function readouts(s) {
    const loads = loadsOf(s),
      back = M.returnAmps(loads);
    $('scene-status').textContent = t.status(ampsText(back));
    $('scene-name').textContent = t.sceneNames[s.view];
    $('scene-action').textContent = s.one >= 150 ? t.kettlesOff : t.kettlesOn;
    document
      .querySelectorAll('#scene-controls [data-view]')
      .forEach((b) => b.setAttribute('aria-pressed', Number(b.dataset.view) === s.view));
    const box = $('phases-readout');
    if (!box) return;
    const none = M.meanPower(loads) === 0;
    let title, big, line, calm;
    if (s.view === POWER) {
      const r = M.ripple(loads);
      calm = r < 0.005;
      title = t.readout.total;
      big = calm ? t.readout.steady : t.readout.swings(W.text('app').stage.percent(number(r * 100)));
      line = none ? t.readout.nothing : calm ? t.readout.totalSteady : t.readout.totalSwings;
    } else if (s.view === FIELD) {
      const { most, least } = M.fieldRange(loads, s.swap, 120);
      calm = most - least < 0.01;
      title = t.readout.fieldTitle;
      big = calm ? t.readout.steady : t.readout.wobbles;
      line = none ? t.readout.nothing : calm ? t.readout.fieldSteady : t.readout.fieldWobbles;
    } else {
      calm = Math.round(back) === 0;
      title = t.readout.back;
      big = ampsText(back);
      line = calm ? t.readout.cancel : t.readout.differ;
    }
    box.innerHTML = `<div class="phases-big"><span>${title}</span><strong class="${calm ? 'is-calm' : 'is-busy'}">${big}</strong></div><p>${line}</p>`;
  }

  function controls(s, st) {
    const swatch = (k) => `<span class="phases-swatch phases-swatch-${k + 1}" aria-hidden="true"></span>`;
    return (
      '<div class="wide readout phases-readout" id="phases-readout"></div>' +
      `<div class="control wide"><label id="phases-view-label">${t.view}</label>` +
      `<div class="segment" role="group" aria-labelledby="phases-view-label">` +
      t.views
        .map((name, i) => `<button type="button" data-view="${i}" aria-pressed="${s.view === i}">${name}</button>`)
        .join('') +
      '</div></div>' +
      KEYS.map((key, k) =>
        st.slider(key, swatch(k) + t.wire(k + 1), 0, 200, 5, s[key], t.amps, k === 2 ? t.wireHint : ''),
      ).join('') +
      (s.view === FIELD ? st.check('swap', t.swap, s.swap) + `<p class="phases-hint">${t.swapHint}</p>` : '')
    );
  }

  function bindControls(panel, s, st) {
    panel.querySelectorAll('[data-view]').forEach((b) =>
      b.addEventListener('click', () => {
        const view = Number(b.dataset.view);
        if (view === s.view) return;
        s.view = view;
        st.setChosen(-1);
        st.refresh();
        st.draw();
        W.announce(t.sceneNames[view]);
        panel.querySelector(`[data-view="${view}"]`)?.focus();
      }),
    );
  }

  /** Set wire k's current (amps, in steps of 5) from a drag, a key or the kettles button. */
  function setCurrent(s, k, value, st) {
    const amps = clamp(Math.round(value / 5) * 5, 0, 200),
      key = KEYS[k];
    if (s[key] === amps) return;
    s[key] = amps;
    opening = SETTLED;
    const input = $(`c-${key}`);
    if (input) input.value = amps;
    st.setChosen(-1);
    st.sync();
    st.draw();
  }

  const announce = (s) => W.announce(t.announce(ampsText(M.returnAmps(loadsOf(s)))));

  /** The arrow whose tip is under the pointer, or −1. */
  function tipAt(p, s, st) {
    const L = place(st.width, st.height),
      loads = loadsOf(s),
      theta = angle(st),
      x = p.x * st.width,
      y = p.y * st.height;
    let best = -1,
      nearest = L.narrow ? 22 : 26;
    for (let k = 0; k < 3; k++) {
      const v = tip(L, loads[k], k, theta),
        d = Math.hypot(v.x - x, v.y - y);
      if (d < nearest) {
        nearest = d;
        best = k;
      }
    }
    return best;
  }

  W.defineRoom({
    id: 'phases',
    symbol: '∴',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'engineering',
    added: '2026-10-07',
    tagline: t.tagline,
    accent: { background: '#132029', border: '#56b4e9', color: '#cdeafc' },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.sceneLabel,
    sceneName: t.sceneNames[CURRENTS],
    tip: t.tip,
    actionLabel: t.kettlesOn,
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { ...t.connection, go: 'waves' },

    defaults: { view: CURRENTS, one: 100, two: 100, three: 100, swap: false },
    ranges: {
      view: [CURRENTS, FIELD, 'integer'],
      one: [0, 200],
      two: [0, 200],
      three: [0, 200],
    },
    defaultPreset: 0,
    presets: [
      { settings: { view: CURRENTS, one: 100, two: 100, three: 100, swap: false } },
      { settings: { view: CURRENTS, one: 200, two: 100, three: 100, swap: false } },
      { settings: { view: FIELD, one: 100, two: 100, three: 100, swap: false } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        color: '#e69f00',
        sketch: {
          hairStyle: 'short',
          hair: '#3a2c22',
          skin: '#efcfb0',
          beard: 'full',
          moustache: true,
          backdrop: '#2a2114',
        },
      },
      {
        ...t.guests[1],
        color: '#56b4e9',
        sketch: { hairStyle: 'short', hair: '#1f1a17', skin: '#ecd0b4', moustache: true, backdrop: '#1a2033' },
      },
      {
        ...t.guests[2],
        color: '#cc79a7',
        sketch: {
          hairStyle: 'receding',
          hair: '#4a3a2e',
          skin: '#efcfb0',
          beard: 'full',
          moustache: true,
          brows: 'bold',
          backdrop: '#2a1b26',
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
      grabbed = -1;
      keyed = false;
      // The opening plays when the room opens as it starts: balanced, on the currents. A link or a saved moment
      // with other settings opens straight onto them.
      opening = !reduced && s.view === CURRENTS && balanced(s) && s.one === 100 ? 0 : SETTLED;
    },
    step(dt) {
      if (opening < SETTLED) opening = Math.min(SETTLED, opening + dt);
    },
    onInput(s) {
      opening = SETTLED;
      announce(s);
    },
    onPreset() {
      opening = SETTLED;
    },
    reset(s, st) {
      for (const key of KEYS) s[key] = 100;
      s.swap = false;
      opening = reduced || s.view !== CURRENTS ? SETTLED : 0;
      st.setChosen(s.view === FIELD ? 2 : s.view === CURRENTS ? 0 : -1);
      st.refresh();
    },
    action(s, st) {
      s.one = s.one >= 150 ? 100 : 200;
      opening = SETTLED;
      st.setChosen(-1);
      st.refresh();
      st.draw();
      announce(s);
    },

    pointer: {
      // A finger on an arrow's tip pulls it; anywhere else it scrolls the page.
      drag: (p, s, st) => tipAt(p, s, st) >= 0,
      down(p, s, st, e) {
        if (e && e.button > 0) return;
        grabbed = tipAt(p, s, st);
        if (grabbed >= 0) picked = grabbed;
      },
      move(p, { dragging }, s, st) {
        if (!dragging || grabbed < 0) return;
        const L = place(st.width, st.height),
          r = Math.hypot(p.x * st.width - L.cx, p.y * st.height - L.cy) / L.U;
        setCurrent(s, grabbed, r * M.FULL, st);
      },
      up() {
        if (grabbed >= 0) announce(W.stage.settingsFor('phases'));
        grabbed = -1;
      },
      /** ← → pick a wire, ↑ ↓ change its current. */
      arrow(dx, dy, s, st) {
        keyed = true;
        if (dx) picked = (picked + dx + 3) % 3;
        if (dy) {
          setCurrent(s, picked, s[KEYS[picked]] - dy * 10, st);
          announce(s);
        }
      },
    },
  });
})();
