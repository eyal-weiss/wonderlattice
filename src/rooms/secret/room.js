/* Room · A secret shouted across the room: sharing a key in public, with paint and then with clock arithmetic. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $ } = W;
  const S = W.models.secret;
  const t = W.text('secret');

  // Clocks to choose from (primes), the shared colour, and the six secret paints.
  const CLOCKS = [11, 23, 47, 101, 1019, 9973];
  const SHARED = [0.95, 0.82, 0.29];
  const PAINTS = [
    [0.78, 0.2, 0.29],
    [0.18, 0.37, 0.82],
    [0.12, 0.6, 0.52],
    [0.9, 0.47, 0.17],
    [0.48, 0.29, 0.77],
    [0.9, 0.44, 0.65],
  ];
  const INK = {
    alice: '#f7c998',
    bob: '#b4eed3',
    key: '#ddf6a3',
    eve: '#e89ab0',
    text: '#dfe6ee',
    muted: '#8795a8',
    line: '#3a4756',
  };
  const STEP_SECONDS = 0.9; // how long a step takes to play out
  const EVE_RATE = 12; // Eve's tries per second: slow enough to watch her count
  const TRAIL = 24; // on a big clock, only the latest hops of a path are drawn

  let stepStart = 0, // stage clock when the current step began
    eveStart = 0, // stage clock when Eve starts trying
    eveAnnounced = false;

  const roots = new Map();
  const rootOf = (p) => (roots.has(p) ? roots.get(p) : roots.set(p, S.primitiveRoot(p)).get(p));
  function clockOf(s) {
    const p = CLOCKS[s.clock] ?? CLOCKS[1];
    return { p, g: rootOf(p), a: S.fitSecret(s.a, p), b: S.fitSecret(s.b, p) };
  }
  const fmt = (n) => n.toLocaleString(W.lang);
  const rgb = (c) => `rgb(${c.map((v) => Math.round(v * 255)).join(',')})`;
  const ease = (x) => 1 - (1 - x) ** 3;

  /** How far the current step has played out (1 when still, in previews, and with reduced motion). */
  const progressOf = (stage) => (stage.playing === false ? 1 : Math.min(1, (stage.clock - stepStart) / STEP_SECONDS));

  /** Eve's tries so far, in the last clock step. */
  function eveTries(s, stage) {
    const { p, g, a } = clockOf(s);
    const needed = S.discreteLog(g, S.modPow(g, a, p), p).k;
    const tries = stage.playing === false ? needed : Math.floor(Math.max(0, stage.clock - eveStart) * EVE_RATE);
    return { tries: Math.min(tries, needed), needed, total: p - 2 };
  }

  // ---------- drawing ----------

  function layout(width, height) {
    const pad = Math.max(10, Math.min(width, height) * 0.04);
    const small = Math.round(Math.min(14, Math.max(10, Math.min(width, height) / 24)));
    const colW = width * 0.27;
    const top = pad + small * 1.8;
    const bottom = height - pad;
    const H = bottom - top;
    return {
      pad,
      small,
      colW,
      top,
      H,
      lx: pad + colW / 2,
      rx: width - pad - colW / 2,
      mx: width / 2,
      midW: width - 2 * (pad + colW) - pad,
      rows: [top + H * 0.14, top + H * 0.48, top + H * 0.82],
    };
  }

  function label(ctx, text, x, y, { size, colour = INK.text, weight = 500, align = 'center', max } = {}) {
    ctx.font = `${weight} ${size}px system-ui`;
    ctx.fillStyle = colour;
    ctx.textAlign = align;
    ctx.fillText(text, x, y, max);
  }

  function pot(ctx, x, y, r, colour, { dashed = false, ring = null, alpha = 1 } = {}) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = rgb(colour);
    ctx.fill();
    ctx.lineWidth = ring ? 3 : 1.5;
    ctx.strokeStyle = ring ?? '#0a0e15';
    if (dashed) ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.restore();
  }

  /** The two friends' names, and the public middle where Eve listens. */
  function heads(ctx, L) {
    const y = L.pad + L.small;
    label(ctx, t.people.alice, L.lx, y, { size: L.small + 2, weight: 700, colour: INK.alice });
    label(ctx, t.people.bob, L.rx, y, { size: L.small + 2, weight: 700, colour: INK.bob });
    label(ctx, `${t.labels.public} · ${t.people.eve}`, L.mx, y, { size: L.small, weight: 600, colour: INK.eve });
    ctx.strokeStyle = INK.line;
    ctx.setLineDash([3, 5]);
    for (const x of [L.pad + L.colW + L.pad / 2, L.rx - L.colW / 2 - L.pad / 2]) {
      ctx.beginPath();
      ctx.moveTo(x, L.top - L.small * 0.4);
      ctx.lineTo(x, L.top + L.H);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }

  function drawPaint(ctx, s, L, progress) {
    const x = S.paintExchange(SHARED, PAINTS[s.pa] ?? PAINTS[0], PAINTS[s.pb] ?? PAINTS[1]);
    const r = Math.max(9, Math.min(L.colW * 0.24, L.H * 0.12, L.midW * 0.16));
    const under = (y) => y + r + L.small * 1.15;
    const [r1, r2, r3] = L.rows;
    const fresh = (step) => (s.step === step ? ease(progress) : 1);
    const small = { size: L.small, colour: INK.muted };

    pot(ctx, L.mx, r1, r, SHARED);
    label(ctx, t.labels.shared, L.mx, under(r1), { ...small, max: L.midW });
    pot(ctx, L.lx, r1, r * 0.75, PAINTS[s.pa] ?? PAINTS[0], { dashed: true, ring: INK.alice });
    label(ctx, t.labels.secret, L.lx, under(r1) - r * 0.25, { ...small, max: L.colW });
    pot(ctx, L.rx, r1, r * 0.75, PAINTS[s.pb] ?? PAINTS[1], { dashed: true, ring: INK.bob });
    label(ctx, t.labels.secret, L.rx, under(r1) - r * 0.25, { ...small, max: L.colW });

    if (s.step >= 1) {
      const a = fresh(1);
      pot(ctx, L.lx, r2, r, x.colours.aliceSends, { alpha: a });
      pot(ctx, L.rx, r2, r, x.colours.bobSends, { alpha: a });
      label(ctx, t.labels.sends, L.lx, under(r2), { ...small, max: L.colW });
      label(ctx, t.labels.sends, L.rx, under(r2), { ...small, max: L.colW });
    }
    if (s.step >= 2) {
      // The mixtures travel into the open, where everyone (and Eve) can see them.
      const m = fresh(2);
      const ax = L.lx + (L.mx - L.midW * 0.26 - L.lx) * m,
        bx = L.rx + (L.mx + L.midW * 0.26 - L.rx) * m;
      pot(ctx, ax, r2, r * 0.85, x.colours.aliceSends);
      pot(ctx, bx, r2, r * 0.85, x.colours.bobSends);
      if (m === 1) {
        label(ctx, t.labels.heard(t.people.alice), ax, under(r2), { ...small, max: L.midW / 2 });
        label(ctx, t.labels.heard(t.people.bob), bx, under(r2) + (L.midW < 190 ? L.small * 1.1 : 0), {
          ...small,
          max: L.midW / 2,
        });
      }
    }
    if (s.step >= 3) {
      const a = fresh(3);
      pot(ctx, L.lx, r3, r, x.colours.aliceEnds, { ring: INK.key, alpha: a });
      pot(ctx, L.rx, r3, r, x.colours.bobEnds, { ring: INK.key, alpha: a });
      pot(ctx, L.mx, r3, r * 0.85, x.colours.eveTries, { ring: INK.eve, alpha: a });
      if (a === 1) {
        label(ctx, t.labels.same, L.lx, under(r3), { size: L.small, weight: 700, colour: INK.key, max: L.colW });
        label(ctx, t.labels.same, L.rx, under(r3), { size: L.small, weight: 700, colour: INK.key, max: L.colW });
        label(ctx, t.labels.eve, L.mx, under(r3), { size: L.small, colour: INK.eve, max: L.midW });
      }
    }
  }

  /** Where hour n sits on the dial. */
  const onDial = (n, p, cx, cy, radius) => {
    const angle = (2 * Math.PI * n) / p - Math.PI / 2;
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
  };

  /**
   * A hop path as chords across the dial, up to `shown` hops. On a big clock the full path would fill the dial, so
   * only the latest hops are drawn, fading behind the newest one, like a trail.
   */
  function path(ctx, hours, shown, p, cx, cy, radius, colour, dashed = false) {
    const last = Math.min(shown, hours.length - 1);
    if (last < 1) return;
    const tail = p > 101 ? TRAIL : last;
    const first = Math.max(0, last - tail);
    ctx.save();
    ctx.strokeStyle = colour;
    ctx.lineWidth = 1.6;
    if (dashed) ctx.setLineDash([5, 4]);
    for (let i = first + 1; i <= last; i++) {
      ctx.globalAlpha = 0.85 * (p > 101 ? (i - first) / tail : 1);
      ctx.beginPath();
      ctx.moveTo(...onDial(hours[i - 1], p, cx, cy, radius));
      ctx.lineTo(...onDial(hours[i], p, cx, cy, radius));
      ctx.stroke();
    }
    ctx.restore();
  }

  function marker(ctx, n, p, cx, cy, radius, colour, size) {
    const [x, y] = onDial(n, p, cx, cy, radius);
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = colour;
    ctx.fill();
  }

  /** A side note in a friend's column: a caption and a number, framed (dashed when it's secret). */
  function box(ctx, L, x, y, caption, value, colour, { dashed = false, big = false, alpha = 1 } = {}) {
    ctx.save();
    ctx.globalAlpha = alpha;
    const w = Math.min(L.colW * 0.92, L.small * 7.5),
      h = L.small * (big ? 3.4 : 3);
    ctx.strokeStyle = colour;
    ctx.lineWidth = big ? 2.5 : 1.3;
    if (dashed) ctx.setLineDash([4, 4]);
    ctx.strokeRect(x - w / 2, y - h / 2, w, h);
    ctx.setLineDash([]);
    label(ctx, caption, x, y - h / 2 + L.small * 1.15, { size: L.small - 1, colour: INK.muted, max: w - 6 });
    label(ctx, value, x, y + h / 2 - L.small * (big ? 0.7 : 0.55), {
      size: L.small + (big ? 5 : 3),
      weight: 700,
      colour,
      max: w - 6,
    });
    ctx.restore();
  }

  function drawClock(ctx, s, L, progress, eve) {
    const { p, g, a, b } = clockOf(s);
    const ex = S.exchange({ p, g, a, b });
    const [r1, r2, r3] = L.rows;
    const fresh = (step) => (s.step === step ? ease(progress) : 1);

    // The dial: every hour, labelled while there's room.
    const radius = Math.max(20, Math.min(L.midW * 0.44, L.H * 0.36));
    const cx = L.mx,
      cy = L.top + L.H * 0.42;
    ctx.strokeStyle = INK.line;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    if (p <= 101)
      for (let n = 0; n < p; n++) {
        const [x0, y0] = onDial(n, p, cx, cy, radius - 3),
          [x1, y1] = onDial(n, p, cx, cy, radius + 3);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }
    const numberSize = Math.max(8, Math.min(L.small - 1, (radius * 2.4) / p));
    if (p <= 23 && numberSize >= 8)
      for (let n = 0; n < p; n++) {
        const [x, y] = onDial(n, p, cx, cy, radius + numberSize * 1.1);
        label(ctx, String(n), x, y + numberSize * 0.35, { size: numberSize, colour: INK.muted });
      }
    marker(ctx, g, p, cx, cy, radius, INK.text, 3.5);
    label(ctx, `${t.labels.clock(p)} · ${t.labels.start(g)}`, cx, L.top + L.H - L.small * 0.2, {
      size: L.small - 1,
      colour: INK.muted,
      max: L.midW + L.pad,
    });

    box(ctx, L, L.lx, r1, t.labels.secret, fmt(a), INK.alice, { dashed: true });
    box(ctx, L, L.rx, r1, t.labels.secret, fmt(b), INK.bob, { dashed: true });

    if (p > 101 && (s.step === 1 || s.step === 3)) {
      label(ctx, t.labels.hops(Math.max(a, b)), cx, cy + L.small * 0.35, { size: L.small - 1, colour: INK.muted });
    }
    if (s.step === 1) {
      // Each hops around the clock from 1, multiplying by the start, as many times as their secret.
      const k = ease(progress);
      path(ctx, S.hops(g, a, p), Math.ceil(k * a), p, cx, cy, radius, INK.alice);
      path(ctx, S.hops(g, b, p), Math.ceil(k * b), p, cx, cy, radius, INK.bob, true);
    }
    if (s.step >= 1) {
      const alpha = fresh(1);
      box(ctx, L, L.lx, r2, t.labels.shouts, fmt(ex.A), INK.alice, { alpha });
      box(ctx, L, L.rx, r2, t.labels.shouts, fmt(ex.B), INK.bob, { alpha });
      if (alpha === 1) {
        marker(ctx, ex.A, p, cx, cy, radius, INK.alice, 5);
        marker(ctx, ex.B, p, cx, cy, radius, INK.bob, 5);
      }
    }
    if (s.step >= 3) {
      // Each hops again, from what they heard: Alice by B, a times; Bob by A, b times. Both land on the key.
      const k = ease(progress);
      path(ctx, S.hops(ex.B, a, p), Math.ceil(k * a), p, cx, cy, radius, INK.alice);
      path(ctx, S.hops(ex.A, b, p), Math.ceil(k * b), p, cx, cy, radius, INK.bob, true);
      const alpha = fresh(3);
      box(ctx, L, L.lx, r3, t.labels.key, fmt(ex.keyAlice), INK.key, { big: true, alpha });
      box(ctx, L, L.rx, r3, t.labels.key, fmt(ex.keyBob), INK.key, { big: true, alpha });
      if (alpha === 1) marker(ctx, ex.keyAlice, p, cx, cy, radius, INK.key, 6);
      if (eve && alpha === 1) {
        // Eve's guess hops around the dial, one try at a time, until it lands on Alice's shout.
        const guess = S.modPow(g, Math.max(1, eve.tries), p);
        marker(ctx, guess, p, cx, cy, radius * 0.86, INK.eve, 4);
        const text = eve.tries >= eve.needed ? t.labels.eveFound(eve.needed) : t.labels.eveTrying(eve.tries, eve.total);
        label(ctx, text, cx, L.top + L.H - L.small * 1.5, {
          size: L.small - 1,
          weight: 600,
          colour: INK.eve,
          max: L.midW + L.pad,
        });
      }
    }
  }

  function scene(ctx, s, width, height, progress, eve) {
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    ctx.textBaseline = 'alphabetic';
    const L = layout(width, height);
    heads(ctx, L);
    if (s.mode === 1) drawClock(ctx, s, L, progress, eve);
    else drawPaint(ctx, s, L, progress);
  }

  function draw(ctx, s, stage) {
    scene(
      ctx,
      s,
      stage.width,
      stage.height,
      progressOf(stage),
      s.mode === 1 && s.step >= 3 ? eveTries(s, stage) : null,
    );
  }

  // ---------- words ----------

  function status(s) {
    if (s.mode === 1) {
      const { p, g } = clockOf(s);
      return s.step === 0 ? t.steps.clock[0](fmt(p), g) : t.steps.clock[s.step];
    }
    return t.steps.paint[s.step];
  }

  function readouts(s) {
    $('scene-status').textContent = status(s);
    const box = $('secret-readout');
    if (!box) return;
    const rows = [];
    if (s.mode === 1) {
      const { p, g, a, b } = clockOf(s);
      const ex = S.exchange({ p, g, a, b });
      rows.push([
        t.readout.hears,
        s.step >= 2 ? t.readout.clockHeard(fmt(p), g, fmt(ex.A), fmt(ex.B)) : t.readout.nothingYet,
      ]);
      rows.push([t.readout.keeps(t.people.alice), fmt(a)], [t.readout.keeps(t.people.bob), fmt(b)]);
      rows.push([t.readout.result, s.step >= 3 ? t.readout.clockResult(fmt(ex.keyAlice)) : t.readout.notYet]);
    } else {
      rows.push([t.readout.hears, s.step >= 2 ? t.readout.paintHeard : t.readout.nothingYet]);
      rows.push([t.readout.keeps(t.people.alice), t.colours[s.pa]], [t.readout.keeps(t.people.bob), t.colours[s.pb]]);
      rows.push([t.readout.result, s.step >= 3 ? t.readout.paintResult : t.readout.notYet]);
    }
    box.replaceChildren(
      ...rows.map(([k, v]) => {
        const row = document.createElement('div');
        const key = document.createElement('span');
        const value = document.createElement('strong');
        row.style.marginTop = '8px';
        key.style.display = 'block';
        key.textContent = k;
        value.textContent = v;
        row.append(key, value);
        return row;
      }),
    );
  }

  function controls(s, stage) {
    const pressed = (on) => `aria-pressed="${on}"`;
    let h =
      `<div class="control wide"><label id="secret-mode-label">${t.modeLabel}</label>` +
      `<div class="segment" role="group" aria-labelledby="secret-mode-label">` +
      t.modes.map((m, i) => `<button type="button" data-mode="${i}" ${pressed(s.mode === i)}>${m}</button>`).join('') +
      '</div></div>';
    if (s.mode === 1) {
      const { p, a, b } = clockOf(s);
      h +=
        `<div class="control wide"><label for="secret-clock">${t.clockLabel}</label><select id="secret-clock">` +
        CLOCKS.map((c, i) => `<option value="${i}" ${c === p ? 'selected' : ''}>${t.clockOption(c)}</option>`).join(
          '',
        ) +
        '</select></div>' +
        stage.slider('a', t.secretLabel(t.people.alice), 1, p - 2, 1, a, '', t.secretHint) +
        stage.slider('b', t.secretLabel(t.people.bob), 1, p - 2, 1, b, '', t.secretHint);
    } else {
      for (const [key, who] of [
        ['pa', t.people.alice],
        ['pb', t.people.bob],
      ]) {
        h +=
          `<div class="control wide"><label id="secret-${key}-label">${t.paintLabel(who)}</label>` +
          `<div class="segment" role="group" aria-labelledby="secret-${key}-label">` +
          PAINTS.map(
            (c, i) =>
              `<button type="button" data-${key}="${i}" ${pressed(s[key] === i)} aria-label="${t.pickColour(who, t.colours[i])}">` +
              `<span aria-hidden="true" style="display:inline-block;width:12px;height:12px;border-radius:50%;margin-inline-end:6px;vertical-align:-1px;background:${rgb(c)}"></span>${t.colours[i]}</button>`,
          ).join('') +
          '</div></div>';
      }
    }
    return h + '<div class="wide readout" id="secret-readout"></div>';
  }

  function bindControls(panel, s, stage) {
    const restart = () => {
      stepStart = stage.clock;
      eveStart = stage.clock + STEP_SECONDS;
      eveAnnounced = false;
    };
    panel.querySelectorAll('[data-mode]').forEach((button) =>
      button.addEventListener('click', () => {
        s.mode = Number(button.dataset.mode);
        s.step = 0;
        restart();
        stage.setChosen(-1);
        stage.refresh();
        stage.draw();
        panel.querySelector(`[data-mode="${s.mode}"]`)?.focus();
      }),
    );
    for (const key of ['pa', 'pb'])
      panel.querySelectorAll(`[data-${key}]`).forEach((button) =>
        button.addEventListener('click', () => {
          s[key] = Number(button.dataset[key]);
          stage.setChosen(-1);
          panel
            .querySelectorAll(`[data-${key}]`)
            .forEach((b) => b.setAttribute('aria-pressed', Number(b.dataset[key]) === s[key]));
          stage.sync();
          stage.draw();
        }),
      );
    $('secret-clock')?.addEventListener('change', (e) => {
      s.clock = Number(e.target.value);
      const { p } = clockOf(s);
      s.a = S.fitSecret(s.a, p);
      s.b = S.fitSecret(s.b, p);
      restart();
      stage.setChosen(-1);
      stage.refresh();
      stage.draw();
      $('secret-clock')?.focus();
    });
  }

  W.defineRoom({
    id: 'secret',
    symbol: '≡',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'signals',
    added: '2026-09-28',
    tagline: t.tagline,
    accent: { background: '#2a2130', border: '#e89ab0', color: '#f4c7d4' },

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
    connection: { ...t.connection, go: 'storm' },

    // mode: 0 paint, 1 clock arithmetic; step: 0 … 3; clock: which clock size; a, b: secret numbers; pa, pb: secret paints.
    defaults: { mode: 0, step: 0, clock: 1, a: 4, b: 3, pa: 0, pb: 1 },
    ranges: {
      mode: [0, 1, 'integer'],
      step: [0, 3, 'integer'],
      clock: [0, CLOCKS.length - 1, 'integer'],
      a: [1, CLOCKS.at(-1) - 2, 'integer'],
      b: [1, CLOCKS.at(-1) - 2, 'integer'],
      pa: [0, PAINTS.length - 1, 'integer'],
      pb: [0, PAINTS.length - 1, 'integer'],
    },
    defaultPreset: 0,
    presets: [
      { settings: { mode: 0, step: 0, pa: 0, pb: 1 } },
      { settings: { mode: 1, step: 0, clock: 1, a: 4, b: 3 } }, // the classic example: 23 hours, start 5
      { settings: { mode: 1, step: 0, clock: 5, a: 2718, b: 1414 } },
    ].map((p, i) => ({ ...t.presets[i], ...p })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Fermat',
        color: '#e8c38f',
        sketch: { hairStyle: 'long', hair: '#3a2b22', skin: '#ecc7a2', moustache: true, backdrop: '#2a2130' },
      },
      {
        ...t.guests[1],
        bio: 'Euler',
        color: '#b9d0f0',
        sketch: { hairStyle: 'wig', hair: '#d9d3c7', skin: '#f0c8a4', brows: 'soft', backdrop: '#1f2a3a' },
      },
    ],

    insight: t.insight,
    still: true,

    controls,
    bindControls,
    readouts,
    draw,
    preview(ctx, width, height) {
      scene(ctx, { mode: 0, step: 3, clock: 1, a: 4, b: 3, pa: 0, pb: 1 }, width, height, 1, null);
    },

    step(dt, s, stage) {
      // Say once when Eve finds the secret, as her search ends.
      if (s.mode !== 1 || s.step < 3 || eveAnnounced) return;
      const eve = eveTries(s, stage);
      if (eve.tries >= eve.needed) {
        eveAnnounced = true;
        W.announce(t.announce.found(fmt(eve.needed)));
      }
    },

    action(s, stage) {
      s.step = (s.step + 1) % 4;
      stepStart = stage.clock;
      eveStart = stage.clock + STEP_SECONDS * 1.5;
      eveAnnounced = false;
      stage.setChosen(-1);
      stage.sync();
      stage.draw();
      W.announce(s.step === 3 ? `${status(s)} ${t.announce.same}` : status(s));
    },

    onPreset(s, stage) {
      stepStart = stage.clock;
      eveAnnounced = false;
    },
    onInput(s, stage) {
      eveStart = stage.clock;
      eveAnnounced = false;
    },
    reset(s, stage) {
      s.step = 0;
      stepStart = stage.clock;
      eveAnnounced = false;
      stage.sync();
      W.announce(status(s));
    },
  });
})();
