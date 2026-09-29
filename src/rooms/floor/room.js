/* Room · The impossible floor: dominoes on a board with squares removed, and the colouring that settles it. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, clamp } = W;
  const F = W.models.floor;
  const t = W.text('floor');
  const reduced = W.prefersReducedMotion();
  const SIDE = F.SIDE;

  // The presets' removed squares. Squares are numbered row by row from the top-left corner (a light square).
  const PRESET_HOLES = [
    [0, 63], // two opposite corners: both light
    [0, 42], // one light, one dark
    [1, 8, 63, 54], // the top-left corner cut off, yet 30 light and 30 dark
    [],
  ];
  const presetSettings = PRESET_HOLES.map((holes) => {
    const [holesA, holesB] = F.toMasks(new Set(holes));
    return { holesA, holesB, colours: false };
  });

  // Colours: a plain tiled floor, the chessboard it hides, dominoes, and marks.
  const C = {
    floor: '#d8c8a8',
    grout: '#a8977a',
    light: '#f3ead7',
    dark: '#6b5842',
    hole: '#0a0e15',
    holeEdge: '#2a3342',
    domino: '#27465c',
    dominoEdge: '#8fd0e6',
    pip: '#e8f4f8',
    mark: '#ddf6a3',
    stuck: '#ff8a80',
    text: '#e7ebdf',
    muted: '#9aa6b5',
  };

  // The room's own state: the removed squares (from the settings), the dominoes laid, and what's happening.
  let loaded = '', // the settings the removed squares were read from
    holes = new Set(),
    dominoes = [], // { a, b, age }
    pending = -1, // the first square of a domino being laid by taps
    dragFrom = -1,
    cursor = 27, // keyboard position
    keyboard = false,
    stuck = null, // squares to point at when a floor can't be tiled
    queue = [], // dominoes "Show a tiling" is still laying down
    wait = 0,
    verdict = t.verdict.start,
    solving = null; // what to say when the queue empties

  const coveredBy = (i) => dominoes.find((d) => d.a === i || d.b === i);
  const isFree = (i) => i >= 0 && !holes.has(i) && !coveredBy(i);
  const freeCount = () => SIDE * SIDE - holes.size - 2 * dominoes.length;

  /** Read the removed squares from the settings when they change (a preset, a shared link, a saved moment). */
  function ensure(s) {
    const key = `${s.holesA}:${s.holesB}`;
    if (key === loaded) return;
    loaded = key;
    holes = F.fromMasks(s.holesA, s.holesB);
    dominoes = [];
    queue = [];
    pending = -1;
    stuck = null;
    solving = null;
    verdict = t.verdict.start;
  }

  function saveHoles(s) {
    [s.holesA, s.holesB] = F.toMasks(holes);
    loaded = `${s.holesA}:${s.holesB}`;
  }

  // ---------- geometry ----------

  function geometry(width, height, colours) {
    const pad = Math.max(8, Math.min(width, height) * 0.04);
    const chip = colours ? Math.max(18, Math.min(28, height * 0.08)) : 0;
    // Never bigger than a comfortable board, so the buttons below stay in view on tall screens.
    const side = Math.max(40, Math.min(width - 2 * pad, height - 2 * pad - chip, 520));
    const cell = side / SIDE;
    return { cell, side, x: (width - side) / 2, y: pad + chip + (height - 2 * pad - chip - side) / 2, chip, pad };
  }

  function squareAt(p, stage, s) {
    const g = geometry(stage.width, stage.height, s.colours);
    const col = Math.floor((p.x * stage.width - g.x) / g.cell),
      row = Math.floor((p.y * stage.height - g.y) / g.cell);
    return col >= 0 && col < SIDE && row >= 0 && row < SIDE ? row * SIDE + col : -1;
  }

  // ---------- drawing ----------

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /** Draw a floor: used by the room and, with a made-up state, by the home card. */
  function render(ctx, width, height, st) {
    ctx.fillStyle = C.hole;
    ctx.fillRect(0, 0, width, height);
    const g = geometry(width, height, st.colours);
    const at = (i) => [g.x + (i % SIDE) * g.cell, g.y + Math.floor(i / SIDE) * g.cell];

    for (let i = 0; i < SIDE * SIDE; i++) {
      const [x, y] = at(i);
      if (st.holes.has(i)) {
        ctx.strokeStyle = C.holeEdge;
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 3, y + 3, g.cell - 6, g.cell - 6);
        ctx.setLineDash([]);
        continue;
      }
      ctx.fillStyle = st.colours ? (F.colour(i) ? C.dark : C.light) : C.floor;
      ctx.fillRect(x, y, g.cell, g.cell);
      if (!st.colours) {
        ctx.strokeStyle = C.grout;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, g.cell - 1, g.cell - 1);
      }
    }

    // Dominoes: a rounded tile over two squares, with a line across the middle and a pip on each half.
    const inset = Math.max(2, g.cell * 0.09);
    for (const d of st.dominoes) {
      const [xa, ya] = at(Math.min(d.a, d.b));
      const across = Math.abs(d.a - d.b) === 1;
      const w = across ? 2 * g.cell : g.cell,
        h = across ? g.cell : 2 * g.cell;
      ctx.globalAlpha = Math.min(1, d.age ?? 1);
      roundRect(ctx, xa + inset, ya + inset, w - 2 * inset, h - 2 * inset, g.cell * 0.18);
      ctx.fillStyle = C.domino;
      ctx.fill();
      ctx.strokeStyle = C.dominoEdge;
      ctx.lineWidth = Math.max(1, g.cell * 0.05);
      ctx.stroke();
      ctx.beginPath();
      if (across) {
        ctx.moveTo(xa + g.cell, ya + inset * 2);
        ctx.lineTo(xa + g.cell, ya + g.cell - inset * 2);
      } else {
        ctx.moveTo(xa + inset * 2, ya + g.cell);
        ctx.lineTo(xa + g.cell - inset * 2, ya + g.cell);
      }
      ctx.stroke();
      ctx.fillStyle = C.pip;
      for (const k of [0, 1]) {
        const cx = xa + g.cell / 2 + (across ? k * g.cell : 0),
          cy = ya + g.cell / 2 + (across ? 0 : k * g.cell);
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(1.5, g.cell * 0.08), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // A cut-off patch, when "Show a tiling" finds the floor impossible.
    if (st.stuck) {
      ctx.strokeStyle = C.stuck;
      ctx.lineWidth = Math.max(2, g.cell * 0.08);
      for (const i of st.stuck) {
        const [x, y] = at(i);
        ctx.strokeRect(x + 2, y + 2, g.cell - 4, g.cell - 4);
      }
    }
    // The first square of a domino being laid, and the keyboard's position.
    ctx.strokeStyle = C.mark;
    if (st.pending >= 0) {
      const [x, y] = at(st.pending);
      ctx.lineWidth = Math.max(2, g.cell * 0.1);
      ctx.strokeRect(x + 2, y + 2, g.cell - 4, g.cell - 4);
    }
    if (st.cursor >= 0) {
      const [x, y] = at(st.cursor);
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.strokeRect(x + 1, y + 1, g.cell - 2, g.cell - 2);
      ctx.setLineDash([]);
    }

    // With the colours shown: how many light and dark squares are left, above the board.
    if (st.colours) {
      const n = F.counts(st.holes);
      const size = Math.round(Math.max(11, Math.min(16, g.chip * 0.62)));
      ctx.font = `600 ${size}px system-ui, sans-serif`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      const lightText = `${n.light} ${t.light}`,
        darkText = `${n.dark} ${t.dark}`;
      const box = size * 0.9,
        gap = size * 0.5;
      const total = 2 * (box + gap) + ctx.measureText(lightText).width + ctx.measureText(darkText).width + size * 1.5;
      let x = width / 2 - total / 2;
      const y = g.y - g.chip / 2 - 2;
      for (const [text, fill] of [
        [lightText, C.light],
        [darkText, C.dark],
      ]) {
        ctx.fillStyle = fill;
        ctx.fillRect(x, y - box / 2, box, box);
        ctx.strokeStyle = C.muted;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y - box / 2 + 0.5, box - 1, box - 1);
        x += box + gap;
        ctx.fillStyle = n.light === n.dark ? C.text : C.mark;
        ctx.fillText(text, x, y);
        x += ctx.measureText(text).width + size * 1.5;
      }
    }
  }

  function draw(ctx, s, stage) {
    ensure(s);
    render(ctx, stage.width, stage.height, {
      holes,
      dominoes,
      colours: s.colours,
      stuck,
      pending,
      cursor: keyboard ? cursor : -1,
    });
  }

  /** The home card: the two missing corners, the colours showing, and a floor half laid. */
  function preview(ctx, width, height) {
    const laid = [];
    for (let a = 1; a < 7; a += 2) laid.push({ a, b: a + 1 });
    for (let row = 1; row < 5; row++) for (let c = 0; c < 8; c += 2) laid.push({ a: row * 8 + c, b: row * 8 + c + 1 });
    render(ctx, width, height, {
      holes: new Set([0, 63]),
      dominoes: laid,
      colours: true,
      stuck: null,
      pending: -1,
      cursor: -1,
    });
  }

  // ---------- acting ----------

  /** After any change: the verdict, and a spoken line when the floor is finished. */
  function settle(stage, announce = true) {
    if (!queue.length && holes.size < SIDE * SIDE && freeCount() === 0) {
      verdict = t.verdict.covered(dominoes.length);
      if (announce) W.announce(verdict);
    }
    stage.sync();
    stage.draw();
  }

  function lay(a, b) {
    if (!isFree(a) || !isFree(b) || !F.neighbours(a).includes(b)) return false;
    dominoes.push({ a, b, age: reduced ? 1 : 0 });
    pending = -1;
    stuck = null;
    return true;
  }

  /** A tap (or Enter) on square i, in the current mode. */
  function tap(i, s, stage) {
    if (i < 0) {
      pending = -1;
      return stage.draw();
    }
    stuck = null;
    solving = null;
    queue = [];
    if (s.mode === 1) {
      // Remove or restore the square, lifting any domino on it.
      const d = coveredBy(i);
      if (d) dominoes = dominoes.filter((x) => x !== d);
      if (holes.has(i)) holes.delete(i);
      else holes.add(i);
      pending = -1;
      saveHoles(s);
      stage.setChosen(-1);
      verdict = t.verdict.start;
      return settle(stage);
    }
    const d = coveredBy(i);
    if (d) {
      dominoes = dominoes.filter((x) => x !== d);
      verdict = t.verdict.start;
    } else if (holes.has(i)) pending = -1;
    else if (pending >= 0 && pending !== i && lay(pending, i)) verdict = t.verdict.start;
    else pending = pending === i ? -1 : i;
    settle(stage);
  }

  /** "Show a tiling": finish the floor around your dominoes, or from the start, or explain why it can't be done. */
  function solve(s, stage) {
    ensure(s);
    pending = -1;
    stuck = null;
    queue = [];
    const taken = new Set(dominoes.flatMap((d) => [d.a, d.b]));
    let rest = F.tiling(holes, SIDE, SIDE, taken);
    let say = t.verdict.tiled;
    if (!rest) {
      const whole = F.tiling(holes);
      if (whole) {
        dominoes = [];
        rest = whole;
        say = () => t.verdict.fresh;
      }
    }
    if (!rest) {
      const n = F.counts(holes);
      if ((n.light + n.dark) % 2) verdict = t.verdict.oddSquares;
      else if (n.light !== n.dark) verdict = t.verdict.colours(n.light, n.dark);
      else {
        stuck = F.stuckPatch(holes);
        verdict = t.verdict.stuck(stuck ? stuck.length : 0);
      }
      W.announce(verdict);
      stage.sync();
      return stage.draw();
    }
    solving = say;
    if (reduced) {
      rest.forEach(([a, b]) => dominoes.push({ a, b, age: 1 }));
      finishSolving();
    } else queue = rest.map(([a, b]) => ({ a, b }));
    stage.sync();
    stage.draw();
  }

  function finishSolving() {
    verdict = solving ? solving(dominoes.length) : t.verdict.covered(dominoes.length);
    solving = null;
    W.announce(verdict);
  }

  function step(dt, s, stage) {
    for (const d of dominoes) if ((d.age ?? 1) < 1) d.age = Math.min(1, (d.age ?? 0) + dt / 0.18);
    if (!queue.length) return;
    wait += dt;
    while (queue.length && wait >= 1 / 28) {
      wait -= 1 / 28;
      const { a, b } = queue.shift();
      dominoes.push({ a, b, age: 0 });
    }
    if (!queue.length) {
      finishSolving();
      stage.sync();
    }
  }

  // ---------- the panel ----------

  function controls(s, stage) {
    const modes = t.modes
      .map((m, i) => `<button type="button" data-mode="${i}" aria-pressed="${s.mode === i}">${m}</button>`)
      .join('');
    return (
      `<div class="control wide"><span class="floor-label" id="floor-mode-label">${t.modeLabel}</span>` +
      `<div class="segment" role="group" aria-labelledby="floor-mode-label">${modes}</div></div>` +
      stage.check('colours', t.colours, s.colours) +
      `<div class="control wide floor-buttons"><button type="button" class="button" id="floor-solve">${t.solve}</button>` +
      `<button type="button" class="button" id="floor-clear">${t.clearDominoes}</button></div>` +
      '<div class="wide floor-readout" id="floor-readout"></div>'
    );
  }

  function bindControls(panel, s, stage) {
    panel.querySelectorAll('[data-mode]').forEach((b) =>
      b.addEventListener('click', () => {
        s.mode = Number(b.dataset.mode);
        pending = -1;
        panel.querySelectorAll('[data-mode]').forEach((x) => x.setAttribute('aria-pressed', x === b));
        stage.draw();
      }),
    );
    panel.querySelector('[data-check="colours"]').addEventListener('change', () => stage.sync());
    $('floor-solve').addEventListener('click', () => solve(s, stage));
    $('floor-clear').addEventListener('click', () => {
      dominoes = [];
      queue = [];
      pending = -1;
      stuck = null;
      verdict = t.verdict.start;
      settle(stage, false);
    });
  }

  function readouts(s) {
    ensure(s);
    const left = freeCount();
    $('scene-status').textContent = t.status(dominoes.length, left);
    const preset = presetSettings.findIndex((p) => p.holesA === s.holesA && p.holesB === s.holesB);
    $('scene-name').textContent = preset >= 0 ? t.presets[preset].name : t.yourFloor;
    const box = $('floor-readout');
    if (!box) return;
    const n = F.counts(holes);
    const colours = s.colours
      ? `<div><span>${t.byColour}</span><strong>${t.countLine(n.light, n.dark)}</strong></div>`
      : '';
    box.innerHTML =
      `<div class="floor-stats"><div><span>${t.squaresLeft}</span><strong>${left}</strong></div>` +
      `<div><span>${t.dominoes}</span><strong>${dominoes.length}</strong></div>${colours}</div>` +
      `<p class="floor-verdict">${verdict}</p>`;
    const check = document.querySelector('#scene-controls [data-check="colours"]');
    if (check) check.checked = s.colours;
  }

  W.defineRoom({
    id: 'floor',
    symbol: '▭',
    still: true,
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'games',
    added: '2026-09-28',
    tagline: t.tagline,
    accent: { background: '#2a2620', border: '#d8c8a8', color: '#f3ead7' },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.sceneLabel,
    sceneName: t.presets[0].name,
    tip: t.tip,
    actionLabel: t.actionLabel,
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { html: t.connection.html, go: 'sudoku', label: t.connection.label },

    // holesA, holesB: the removed squares as two whole numbers (squares 0–31, 32–63). mode: 0 lay, 1 remove.
    defaults: { ...presetSettings[0], mode: 0 },
    ranges: { holesA: [0, 4294967295, 'integer'], holesB: [0, 4294967295, 'integer'], mode: [0, 1, 'integer'] },
    defaultPreset: 0,
    presets: t.presets.map((p, i) => ({
      name: p.name,
      note: p.note,
      badge: String(SIDE * SIDE - PRESET_HOLES[i].length),
      settings: presetSettings[i],
    })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Gardner',
        color: '#d8c8a8',
        sketch: {
          hairStyle: 'receding',
          hair: '#d9d4c7',
          skin: '#eac3a0',
          beard: 'short',
          glasses: 'square',
          backdrop: '#2a2620',
        },
      },
      {
        ...t.guests[1],
        color: '#8fd0e6',
        sketch: { hairStyle: 'swept', hair: '#8c8a86', skin: '#e8bf9c', glasses: 'round', backdrop: '#1d2b35' },
      },
    ],

    insight: { title: t.insight.title, html: t.insight.html },

    controls,
    bindControls,
    readouts,
    draw,
    step,
    preview,

    enter(s, stage) {
      ensure(s);
      stage.sync();
    },
    onPreset(s, stage) {
      loaded = '';
      ensure(s);
      stage.sync();
    },
    reset(s, stage) {
      loaded = '';
      ensure(s);
      stage.sync();
      stage.draw();
    },
    action(s, stage) {
      s.colours = !s.colours;
      stage.sync();
      stage.draw();
      const n = F.counts(holes);
      if (s.colours) W.announce(t.countLine(n.light, n.dark));
    },

    pointer: {
      // A finger on the board lays dominoes; elsewhere it scrolls the page.
      drag: (p, s, stage) => squareAt(p, stage, s) >= 0,
      down(p, s, stage) {
        keyboard = false;
        const i = squareAt(p, stage, s);
        dragFrom = s.mode === 0 && isFree(i) ? i : -1;
        tap(i, s, stage);
      },
      move(p, { dragging }, s, stage) {
        if (!dragging || dragFrom < 0 || s.mode !== 0) return;
        const i = squareAt(p, stage, s);
        if (i >= 0 && i !== dragFrom && lay(dragFrom, i)) {
          dragFrom = -1;
          verdict = t.verdict.start;
          settle(stage);
        }
      },
      up: () => (dragFrom = -1),
      escape: () => (pending = -1),
      arrow(dx, dy) {
        keyboard = true;
        const row = clamp(Math.floor(cursor / SIDE) + dy, 0, SIDE - 1),
          col = clamp((cursor % SIDE) + dx, 0, SIDE - 1);
        cursor = row * SIDE + col;
        const what = holes.has(cursor) ? t.what.hole : coveredBy(cursor) ? t.what.domino : t.what.free;
        W.announce(t.squareLabel(row + 1, col + 1, what));
      },
      key(e, s, stage) {
        if (e.key !== 'Enter') return false;
        keyboard = true;
        tap(cursor, s, stage);
        return true;
      },
    },
  });
})();
