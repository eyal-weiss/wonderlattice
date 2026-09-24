/*
 * Room · Paint with motion: two turning arms and a pen.
 * Unlike the canvas rooms, it has its own layout (#motion-room in index.html),
 * its own canvas, and its own animation loop.
 */
(() => {
  'use strict';

  const W = Wonderloom;
  const { $, TAU } = W;
  const M = W.models.motion;

  const words = W.text('motion');
  // Starting patterns: the numbers here, the words in text.en.js.
  const presets = [
    { k: -5, r: 42, p: 0, palette: 0 },
    { k: 2.5, r: 36, p: 0, palette: 1 },
    { k: -3, r: 25, p: 45, palette: 2 },
    { k: -3.8, r: 48, p: 0, palette: 0 },
    { k: 1.03, r: 50, p: 0, palette: 1 },
    { k: -2.25, r: 65, p: 90, palette: 2 },
  ].map((p, i) => ({ ...words.presets[i], ...p }));
  const reduced = W.prefersReducedMotion();

  const state = { k: -5, r: 42, p: 0, palette: 0, speed: 1, arms: false, name: words.presets[0].name };
  let running = !reduced,
    t = 1.55, // outer-arm angle traced so far
    oldTime = 0,
    selected = 0, // highlighted preset, or -1
    scheduled = false;
  let canvas, ctx, ink, ic;
  let w = 1,
    h = 1,
    scale = 1;

  const period = (s = state) => M.period(s);
  const position = (v, s = state) => M.position(v, s);
  const complete = () => t >= period() - 0.0001;
  const format = (v) => String(Number(v.toFixed(2))).replace('-', '−');

  const valid = (k, r, p, palette) =>
    [k, r, p, palette].every(Number.isFinite) &&
    k >= -10 &&
    k <= 10 &&
    r >= 10 &&
    r <= 85 &&
    p >= 0 &&
    p <= 360 &&
    Number.isInteger(palette) &&
    palette >= 0 &&
    palette <= 3;

  /**
   * Draw the path from angle `from` to `to` as short coloured segments.
   * Neighbouring segments that share a colour are stroked together, which
   * keeps "Trace it all" quick on slower phones.
   */
  function path(target, from, to, s, radius, cx, cy, width = 1.1) {
    if (to <= from) return;
    const count = Math.min(70000, Math.max(1, Math.ceil((to - from) * (Math.abs(s.k) + 1) * 65)));
    let prev = position(from, s),
      style = '';
    target.lineWidth = width;
    target.lineCap = 'round';
    target.lineJoin = 'round';
    for (let i = 1; i <= count; i++) {
      const v = from + ((to - from) * i) / count,
        p = position(v, s),
        next = M.color(v, s.palette);
      if (next !== style) {
        if (style) target.stroke();
        target.strokeStyle = style = next;
        target.beginPath();
        target.moveTo(cx + prev.x * radius, cy + prev.y * radius);
      }
      target.lineTo(cx + p.x * radius, cy + p.y * radius);
      prev = p;
    }
    target.stroke();
  }

  function redraw() {
    ic.clearRect(0, 0, w, h);
    path(ic, 0, t, state, scale, w / 2, h / 2);
    render();
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = ink.width = Math.round(w * dpr);
    canvas.height = ink.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ic.setTransform(dpr, 0, 0, dpr, 0, 0);
    scale = Math.min(w, h) * 0.435;
    redraw();
  }

  /** Compose the frame: guide circle, glowing ink layer, optional arms, and the pen. */
  function render() {
    const cx = w / 2,
      cy = h / 2;
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.strokeStyle = '#1e2835';
    ctx.lineWidth = 0.6;
    ctx.setLineDash([2, 6]);
    ctx.beginPath();
    ctx.arc(cx, cy, scale, 0, TAU);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = '#25303d';
    ctx.beginPath();
    ctx.moveTo(cx - 5, cy);
    ctx.lineTo(cx + 5, cy);
    ctx.moveTo(cx, cy - 5);
    ctx.lineTo(cx, cy + 5);
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = 0.19;
    ctx.filter = 'blur(4px)';
    ctx.drawImage(ink, 0, 0, w, h);
    ctx.restore();
    ctx.drawImage(ink, 0, 0, w, h);
    const p = position(t);
    if (state.arms) {
      ctx.save();
      ctx.strokeStyle = '#8a97aa';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      ctx.arc(cx, cy, scale * (1 - state.r / 100), 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = '#e1e6efa6';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + p.ax * scale, cy + p.ay * scale);
      ctx.lineTo(cx + p.x * scale, cy + p.y * scale);
      ctx.stroke();
      for (const point of [
        [cx, cy],
        [cx + p.ax * scale, cy + p.ay * scale],
      ]) {
        ctx.fillStyle = '#0a0e15';
        ctx.beginPath();
        ctx.arc(...point, 4, 0, TAU);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }
    if (!complete()) {
      ctx.fillStyle = '#fff8e5';
      ctx.shadowColor = M.color(t, state.palette);
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(cx + p.x * scale, cy + p.y * scale, 2.8, 0, TAU);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  /** Copy state into the controls and readouts. */
  function sync() {
    for (const [id, value] of [
      ['ratio', state.k],
      ['reach', state.r],
      ['phase', state.p],
    ])
      $(id).value = value;
    $('rotation-number').value = state.k;
    $('reach-value').textContent = state.r + '%';
    $('phase-value').textContent = state.p + '°';
    $('pattern-name').textContent = state.name;
    $('mechanism').checked = state.arms;
    document
      .querySelectorAll('[data-palette]')
      .forEach((b) => b.setAttribute('aria-pressed', Number(b.dataset.palette) === state.palette));
    document
      .querySelectorAll('[data-speed]')
      .forEach((b) => b.setAttribute('aria-pressed', Number(b.dataset.speed) === state.speed));
    document.querySelectorAll('.preset').forEach((b, i) => b.setAttribute('aria-pressed', i === selected));
    updateStatus();
    updatePlay();
  }

  function updateStatus() {
    const rounds = Math.round(period() / TAU);
    $('cycle-status').textContent = complete()
      ? words.status.complete
      : rounds === 1
        ? words.status.oneTurn
        : words.status.turns(rounds);
    $('finish').disabled = complete();
    const n = Math.round(Math.abs(state.k) * 100),
      g = M.gcd(n, 100),
      outer = 100 / g,
      inner = n / g;
    $('ratio-explanation').textContent =
      state.k === 0 ? words.explainStill : words.explain(format(state.k), outer, inner, state.k < 0);
  }

  function updatePlay() {
    const icon = running ? '<path d="M7 5v10M13 5v10"/>' : '<path d="m7 4 9 6-9 6Z"/>';
    $('play').innerHTML =
      `<svg viewBox="0 0 20 20" aria-hidden="true">${icon}</svg><span>` +
      (running ? words.play.pause : complete() ? words.play.replay : words.play.play) +
      '</span>';
  }

  function reset(initial = 0.8) {
    t = reduced ? period() : Math.min(initial, period());
    running = !reduced;
    oldTime = 0;
    redraw();
    sync();
  }

  function change() {
    state.k = Number($('ratio').value);
    state.r = Number($('reach').value);
    state.p = Number($('phase').value);
    state.name = words.names.own;
    selected = -1;
    $('nudge').textContent = Number.isInteger(state.k) ? words.nudges.whole : words.nudges.traceAll;
    reset();
  }

  function scheduleChange() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      change();
    });
  }

  function applyPreset(i) {
    selected = i;
    Object.assign(state, presets[i]);
    $('nudge').textContent = presets[i].nudge;
    reset(1.55);
  }

  function saveImage() {
    const out = document.createElement('canvas');
    out.width = out.height = 1800;
    const c = out.getContext('2d');
    c.fillStyle = '#0a0e15';
    c.fillRect(0, 0, 1800, 1800);
    path(c, 0, t, state, 730, 900, 850, 1.7);
    c.fillStyle = '#a6abb5';
    c.font = '22px sans-serif';
    c.fillText('wonderloom', 72, 1728);
    c.textAlign = 'right';
    c.font = '18px sans-serif';
    c.fillText(format(state.k) + '×  ·  ' + state.r + '%  ·  ' + state.p + '°', 1728, 1728);
    W.savePNG(out, 'wonderloom-' + state.k + '-' + state.r + '.png', {
      saved: words.saved,
      failed: words.saveFailed,
    });
  }

  function share() {
    const params = new URLSearchParams({ room: 'motion', k: state.k, r: state.r, p: state.p, ink: state.palette });
    const web = W.isWeb();
    const text = web
      ? W.shareLink(params)
      : words.shareText(state.k, state.r, state.p, words.paletteNames[state.palette]);
    W.copyText(text, {
      copied: web ? words.linkCopied : words.settingsCopied,
      description: web ? words.linkDescription : words.settingsDescription,
    });
  }

  function bindControls() {
    $('rotation-number').addEventListener('change', (e) => {
      const value = e.target.valueAsNumber;
      if (!Number.isFinite(value) || value < -10 || value > 10) {
        e.target.value = state.k;
        W.toast(words.rotationRange);
        return;
      }
      $('ratio').value = Math.round(value * 100) / 100;
      change();
    });
    for (const id of ['ratio', 'reach', 'phase']) $(id).addEventListener('input', scheduleChange);
    presets.forEach((p, i) => {
      const b = document.createElement('button');
      b.className = 'preset';
      b.setAttribute('aria-pressed', i === 0);
      b.innerHTML = `<canvas width="280" height="160" aria-hidden="true"></canvas><span class="preset-name">${p.name}</span><span class="preset-note">${p.note}</span>`;
      b.addEventListener('click', () => applyPreset(i));
      $('presets').appendChild(b);
      path(b.querySelector('canvas').getContext('2d'), 0, period(p), p, 69, 140, 80, 0.8);
    });
    document.querySelectorAll('[data-palette]').forEach((b) =>
      b.addEventListener('click', () => {
        state.palette = Number(b.dataset.palette);
        redraw();
        sync();
      }),
    );
    document.querySelectorAll('[data-speed]').forEach((b) =>
      b.addEventListener('click', () => {
        state.speed = Number(b.dataset.speed);
        sync();
      }),
    );
    $('mechanism').addEventListener('change', (e) => {
      state.arms = e.target.checked;
      render();
    });
    $('play').addEventListener('click', () => {
      if (complete()) {
        t = 0;
        ic.clearRect(0, 0, w, h);
        running = true;
      } else running = !running;
      oldTime = 0;
      updatePlay();
      updateStatus();
      render();
    });
    $('restart').addEventListener('click', () => reset(0));
    $('finish').addEventListener('click', () => {
      t = period();
      running = false;
      redraw();
      updatePlay();
      updateStatus();
    });
    $('focus').addEventListener('click', () => {
      const focused = document.body.classList.toggle('focus-mode');
      $('focus').setAttribute('aria-label', focused ? words.focus.leave : words.focus.enter);
      $('focus').title = focused ? words.focus.leave : words.focus.title;
      resize();
    });
    $('surprise').addEventListener('click', () => {
      const ks = [-7, -5.2, -4.5, -3.25, -2.4, -1.2, 1.05, 1.5, 2.2, 3.5, 4.2, 6.5];
      Object.assign(state, {
        k: ks[Math.floor(Math.random() * ks.length)],
        r: 20 + Math.floor(Math.random() * 51),
        p: Math.floor(Math.random() * 360),
        palette: Math.floor(Math.random() * 3),
        name: words.names.surprise,
      });
      selected = -1;
      $('nudge').textContent = words.nudges.surprise;
      reset(1.55);
    });
    $('why-button').addEventListener('click', () => {
      updateStatus();
      $('why-dialog').showModal();
    });
    $('reveal-arms').addEventListener('click', () => {
      state.arms = true;
      $('why-dialog').close();
      if (complete()) reset(0);
      else {
        running = true;
        oldTime = 0;
        sync();
      }
      render();
      $('mechanism').focus();
    });
    $('save').addEventListener('click', saveImage);
    $('share').addEventListener('click', share);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('focus-mode')) $('focus').click();
      if (
        document.body.dataset.room === 'motion' &&
        e.code === 'Space' &&
        e.target === document.body &&
        !document.querySelector('dialog[open]')
      ) {
        e.preventDefault();
        $('play').click();
      }
    });
    document.addEventListener('visibilitychange', () => (oldTime = 0));
  }

  function animate(timestamp) {
    const dt = oldTime ? Math.min((timestamp - oldTime) / 1000, 0.05) : 0;
    oldTime = timestamp;
    if (
      running &&
      document.body.dataset.room === 'motion' &&
      !document.hidden &&
      !document.querySelector('dialog[open]')
    ) {
      const next = Math.min(period(), t + dt * 0.7 * state.speed);
      path(ic, t, next, state, scale, w / 2, h / 2);
      t = next;
      render();
      if (complete()) {
        running = false;
        updatePlay();
        updateStatus();
      }
    }
    requestAnimationFrame(animate);
  }

  W.defineRoom({
    id: 'motion',
    symbol: '◌',
    eyebrow: words.eyebrow,
    name: words.name,
    theme: 'shape',
    tagline: words.tagline,
    layout: 'custom',
    panel: 'motion-room',

    guests: [
      {
        ...words.guests[0],
        bio: 'Noether',
        image: 'noether.jpg',
        source: 'Noether.jpg',
        color: '#bc9de5',
        frame: [185, -65, -22],
      },
      {
        ...words.guests[1],
        bio: 'Euler',
        image: 'euler.jpg',
        source: 'Leonhard_Euler_-_Jakob_Emanuel_Handmann_(Kunstmuseum_Basel).jpg',
        color: '#acd5a5',
        frame: [125, -36, -21],
      },
    ],

    init() {
      canvas = $('art');
      ctx = canvas.getContext('2d');
      ink = document.createElement('canvas');
      ic = ink.getContext('2d');
      bindControls();
      // Words that the page starts with in English, set here so translations reach them too.
      $('focus').setAttribute('aria-label', words.focus.enter);
      $('focus').title = words.focus.title;
      $('nudge').textContent = presets[0].nudge;
      if (reduced) t = period();
      sync();
      resize();
      new ResizeObserver(resize).observe(canvas.parentElement);
      requestAnimationFrame(animate);
    },

    enter() {
      WonderloomGuests.render('motion', $('math-guest-motion'));
    },

    preview(ctx, width, height) {
      const p = presets[0];
      path(ctx, 0, period(p), p, height * 0.42, width / 2, height / 2, 1.1);
    },

    /** Shared links: #room=motion&k=…&r=…&p=…&ink=… */
    applyParams(q) {
      if (!q.has('k')) return false;
      const k = Number(q.get('k')),
        r = Number(q.get('r')),
        p = Number(q.get('p')),
        palette = Number(q.get('ink'));
      if (!valid(k, r, p, palette)) return false;
      Object.assign(state, {
        k: Math.round(k * 100) / 100,
        r: Math.round(r),
        p: Math.round(p),
        palette,
        name: words.names.shared,
      });
      selected = -1;
      $('nudge').textContent = words.nudges.shared;
      reset(1.55);
      return true;
    },

    capture: () => ({
      room: 'motion',
      title: $('pattern-name').textContent,
      canvas: $('art'),
      settings: {
        k: state.k,
        r: state.r,
        p: state.p,
        palette: state.palette,
        speed: state.speed,
        arms: state.arms,
        t: Math.round(t * 100) / 100,
      },
    }),

    restore(saved, title) {
      const k = Number(saved.k),
        r = Number(saved.r),
        p = Number(saved.p),
        palette = Number(saved.palette);
      if (!valid(k, r, p, palette)) return;
      Object.assign(state, {
        k,
        r,
        p,
        palette,
        speed: [0.5, 1, 3].includes(saved.speed) ? saved.speed : 1,
        arms: saved.arms === true,
        name: title.slice(0, 90),
      });
      selected = -1;
      $('nudge').textContent = words.nudges.revisit;
      reset(Number.isFinite(saved.t) && saved.t >= 0 ? Math.min(saved.t, period()) : 1.55);
    },

    /** Optional browser-agent tools (inert unless the browser provides document.modelContext). */
    agentTools: (app) => [
      {
        name: 'get_drawing_settings',
        description: 'Read the current visible pattern settings and drawing state.',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true },
        execute: () => ({ ...state, playing: running, complete: complete() }),
      },
      {
        name: 'configure_drawing',
        description: 'Change the visible drawing settings and restart its trace.',
        inputSchema: {
          type: 'object',
          properties: {
            rotation: { type: 'number', minimum: -10, maximum: 10 },
            reach: { type: 'integer', minimum: 10, maximum: 85 },
            angle: { type: 'integer', minimum: 0, maximum: 360 },
            palette: { type: 'integer', minimum: 0, maximum: 3 },
          },
          required: ['rotation', 'reach', 'angle', 'palette'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false },
        execute(input) {
          const keys = ['rotation', 'reach', 'angle', 'palette'];
          if (
            !input ||
            typeof input !== 'object' ||
            Object.keys(input).some((key) => !keys.includes(key)) ||
            typeof input.rotation !== 'number' ||
            !Number.isInteger(input.reach) ||
            !Number.isInteger(input.angle) ||
            !valid(input.rotation, input.reach, input.angle, input.palette)
          )
            throw new Error('Invalid drawing settings');
          Object.assign(state, {
            k: Math.round(input.rotation * 100) / 100,
            r: input.reach,
            p: input.angle,
            palette: input.palette,
            name: words.names.own,
          });
          selected = -1;
          app.choose('motion');
          reset();
          return { rotation: state.k, reach: state.r, angle: state.p, palette: state.palette };
        },
      },
    ],
  });
})();
