/* Room · Inside the puzzle cube: moves as things you combine, undo, and repeat. */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, TAU, clamp } = W;
  const C = W.models.cube;
  const t = W.text('cube');
  const reduced = W.prefersReducedMotion();

  // Standard colours: white top, green front, red right; opposite faces yellow, blue, orange.
  const COLOURS = ['#f3f1e8', '#d8433b', '#3aa45a', '#f2cc3a', '#f18a2c', '#3566c8'];
  const PLASTIC = '#10141b';
  const TURN = 0.26; // seconds per quarter turn, for a single move
  // While a sequence repeats, the cube never spins through turns quickly: each repeat (or, for a long run,
  // several) lands as one gentle crossfade, and visible changes come less than twice a second, so nothing flashes.
  const HOLD = 0.6, // seconds between visible changes while repeating
    FADE = 0.4, // seconds of each crossfade
    STEPS = 16; // "Repeat until home" lands in at most this many visible changes

  // View rotation, shared by both cubes, and what each cube is doing.
  let rx = 0.5,
    ry = -0.62;
  const cubes = [makeCube(), makeCube()];
  let note = ''; // a one-line message under the cube
  let compared = false; // in compare mode: have both cubes made their moves yet?

  function makeCube() {
    // queue: single turns ({ move, speed }) and repeats that land at once ({ moves, times, repeats });
    // inFlight: repeats queued but not yet shown, so the counter can tick live; from: the state fading out.
    return { state: C.solved(), queue: [], anim: null, inFlight: 0, from: null };
  }

  const sequenceOf = (s) => C.decode(s.seq) ?? [];

  // ---------- drawing ----------

  function rotate(v, axis, angle) {
    const c = Math.cos(angle),
      s = Math.sin(angle),
      [i, j] = [
        [1, 2],
        [2, 0],
        [0, 1],
      ][axis],
      out = v.slice();
    out[i] = v[i] * c - v[j] * s;
    out[j] = v[i] * s + v[j] * c;
    return out;
  }

  /**
   * View rotation (ry about the vertical, then rx tilting the top towards us),
   * then mild perspective for a camera in front, on the +z side. Returns screen
   * x, y and a depth where larger means farther away.
   */
  function project([x, y, z], view) {
    const c = Math.cos(ry),
      s = Math.sin(ry);
    const x1 = x * c + z * s,
      z1 = -x * s + z * c;
    const y2 = y * Math.cos(rx) - z1 * Math.sin(rx),
      z2 = y * Math.sin(rx) + z1 * Math.cos(rx);
    const k = 9 / (9 - z2);
    return { x: view.cx + x1 * view.scale * k, y: view.cy - y2 * view.scale * k, z: -z2 };
  }
  /** How much a direction points towards the camera (positive: facing us). */
  const viewNormal = ([x, y, z]) => {
    const c = Math.cos(ry),
      s = Math.sin(ry);
    const z1 = -x * s + z * c;
    return y * Math.sin(rx) + z1 * Math.cos(rx);
  };

  /** Quads (four corners, a fill, depth) for one cube, mid-turn if a layer is turning. */
  function quads(cube, highlight, state = cube.state, stickersOnly = false) {
    const out = [];
    const anim = cube.anim;
    const move = anim && !anim.moves ? C.MOVES[anim.move] : null;
    const angle = move ? move.sign * (TAU / 4) * ease(anim.t) : 0;
    const turning = (p) => move && p[move.axis] === move.side;
    const place = (v, p) => (turning(p) ? rotate(v, move.axis, angle) : v);
    const face = (centre, normal, size, fill, p) => {
      const axis = normal.findIndex((c) => c !== 0);
      const [a, b] = [0, 1, 2].filter((i) => i !== axis);
      const corner = (da, db) => {
        const v = centre.slice();
        v[a] += da * size;
        v[b] += db * size;
        return place(v, p);
      };
      const n = place(normal, p),
        c = place(centre, p);
      // Facing the camera (which sits at distance 9 in front): (camera − point) · normal > 0.
      if (9 * viewNormal(n) - (n[0] * c[0] + n[1] * c[1] + n[2] * c[2]) <= 0) return;
      out.push({ corners: [corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, 1)], fill });
    };
    const moved = highlight ? C.movedPieces(state) : null;
    C.stickers.forEach((s, i) => {
      const centre = s.p.map((c, k) => c + s.n[k] * 0.5);
      const colour = state[i];
      if (!stickersOnly) face(centre, s.n, 0.5, PLASTIC, s.p);
      const dim = highlight && !moved.has(s.p.join(','));
      face(
        centre.map((c, k) => c + s.n[k] * 0.002),
        s.n,
        0.42,
        dim ? shade(COLOURS[colour]) : COLOURS[colour],
        s.p,
      );
    });
    if (move) {
      // The inside faces exposed while a layer turns, so the gap looks solid.
      const n = [0, 0, 0];
      n[move.axis] = -move.side;
      const inner = [0, 0, 0];
      inner[move.axis] = move.side * 0.5;
      face(inner, n, 1.5, PLASTIC, [...[0, 0, 0].map((_, k) => (k === move.axis ? move.side : 0))]);
      const opposite = n.map((c) => -c);
      face(inner, opposite, 1.5, PLASTIC, [0, 0, 0]);
    }
    return out;
  }

  const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);
  const shade = (hex) => {
    const v = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    const grey = (v[0] + v[1] + v[2]) / 3;
    return `rgb(${v.map((c) => Math.round(c * 0.22 + grey * 0.1 + 20)).join(',')})`;
  };

  function drawCube(ctx, cube, view, highlight) {
    drawState(ctx, cube, view, highlight, cube.state);
    // While repeating, the state before this step fades out over the new one (the shapes are the same).
    if (cube.from && cube.anim?.moves) {
      ctx.globalAlpha = 1 - ease(clamp((cube.anim.t * HOLD) / FADE, 0, 1));
      drawState(ctx, cube, view, highlight, cube.from, true); // stickers only, so the plastic never shows through
      ctx.globalAlpha = 1;
    }
  }

  function drawState(ctx, cube, view, highlight, state, stickersOnly) {
    const list = quads(cube, highlight, state, stickersOnly).map((q) => {
      const pts = q.corners.map((c) => project(c, view));
      return { pts, fill: q.fill, z: pts.reduce((a, p) => a + p.z, 0) / 4 };
    });
    list.sort((a, b) => b.z - a.z);
    for (const q of list) {
      ctx.fillStyle = q.fill;
      ctx.beginPath();
      q.pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.closePath();
      ctx.fill();
      if (q.fill === PLASTIC) {
        ctx.strokeStyle = PLASTIC;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  function draw(ctx, s, stage) {
    const { width, height } = stage;
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    const compare = s.mode === 1;
    const top = width < 520 ? 44 : 24;
    const footer = 44;
    const usable = height - top - footer;
    const count = compare ? 2 : 1;
    const side = compare && width < height * 1.05; // stack the two cubes on narrow screens
    const cellW = side ? width : width / count,
      cellH = side ? usable / count : usable;
    const scale = Math.min(cellW, cellH) * (compare ? 0.17 : 0.2);
    ctx.textAlign = 'center';
    for (let k = 0; k < count; k++) {
      const cx = side ? width / 2 : cellW * (k + 0.5),
        cy = top + (side ? cellH * (k + 0.5) : cellH / 2);
      drawCube(ctx, cubes[k], { cx, cy, scale }, s.highlight && !compare);
      if (compare) {
        const [left, right] = t.compareLabels(C.MOVES[s.a].name, C.MOVES[s.b].name);
        ctx.fillStyle = '#c9d3dd';
        ctx.font = '600 14px system-ui';
        ctx.fillText(k ? right : left, cx, cy + scale * 3.25);
      }
    }
    // The sequence in cube notation, under the picture.
    ctx.fillStyle = '#e8eee2';
    ctx.font = '600 15px ui-monospace, monospace';
    const done = s.repeats - Math.round(cubes[0].inFlight);
    const seq = sequenceOf(s);
    const line = compare ? '' : t.sequence(C.notation(seq)) + (seq.length && done > 1 ? `   × ${done}` : '');
    ctx.fillText(line, width / 2, height - 26);
    ctx.fillStyle = '#a9b6c3';
    ctx.font = '13px system-ui';
    ctx.fillText(note, width / 2, height - 8);
  }

  function preview(ctx, width, height) {
    const cube = makeCube();
    cube.state = C.run(C.solved(), [1, 0], 4);
    drawCube(ctx, cube, { cx: width / 2, cy: height / 2, scale: height * 0.17 }, false);
  }

  // ---------- behaviour ----------

  /** Show the cube for the current settings at once, with nothing moving. */
  function settle(s) {
    compared = false;
    for (const cube of cubes) {
      cube.queue = [];
      cube.anim = null;
      cube.inFlight = 0;
      cube.from = null;
    }
    if (s.mode === 1) {
      cubes[0].state = C.solved();
      cubes[1].state = C.solved();
    } else cubes[0].state = C.run(C.solved(), sequenceOf(s), s.repeats);
  }

  /** Queue single turns on a cube, each shown turning; with reduced motion they happen at once. */
  function perform(cube, moves) {
    if (reduced) {
      cube.state = C.run(cube.state, moves);
      return;
    }
    moves.forEach((move) => cube.queue.push({ move, speed: TURN }));
  }

  /**
   * Queue `times` repeats of `moves` that land together as one crossfade; the counter gains `repeats`
   * when they show. With reduced motion they happen at once.
   */
  function jump(cube, moves, times, repeats) {
    if (reduced) {
      cube.state = C.run(cube.state, moves, times);
      return;
    }
    cube.queue.push({ moves, times, repeats, speed: HOLD });
    cube.inFlight += repeats;
  }

  /** Say how a run of repeats ended, once it has visibly finished. */
  function landed(s) {
    const seq = sequenceOf(s);
    if (s.mode !== 0 || !seq.length) return;
    W.announce(t.landed(C.movedPieces(cubes[0].state).size, s.repeats, C.order(seq)));
  }

  function step(dt, s) {
    for (const cube of cubes) {
      let left = dt;
      while (left > 0) {
        if (!cube.anim) {
          if (!cube.queue.length) break;
          const next = cube.queue.shift();
          cube.anim = { ...next, t: 0 };
          if (next.moves) {
            // Repeats land at once and fade in; the counter ticks as they show.
            cube.from = cube.state;
            cube.state = C.run(cube.state, next.moves, next.times);
            cube.inFlight -= next.repeats;
            W.stage.sync();
            if (!cube.queue.length && cube === cubes[0]) landed(s);
          }
        }
        const need = (1 - cube.anim.t) * cube.anim.speed;
        if (left < need) {
          cube.anim.t += left / cube.anim.speed;
          left = 0;
        } else {
          left -= need;
          if (!cube.anim.moves) cube.state = C.apply(cube.state, cube.anim.move);
          cube.anim = null;
          cube.from = null;
          if (!cube.queue.length) W.stage.sync();
        }
      }
    }
  }

  function press(s, stage, move) {
    const seq = sequenceOf(s);
    if (seq.length >= C.MAX_LENGTH) return;
    if (s.repeats !== 1) {
      // A sequence is a recipe; start the new one from a solved cube.
      s.seq = C.encode([...seq, move]);
      s.repeats = 1;
      settle(s);
      note = t.restarted;
    } else {
      s.seq = C.encode([...seq, move]);
      perform(cubes[0], [move]);
      note = '';
    }
    if (seq.length + 1 >= C.MAX_LENGTH) note = t.full;
    stage.setChosen(-1);
    stage.refresh();
    stage.draw();
  }

  function undo(s, stage) {
    // Undo acts on what the settings say; let anything still playing land first.
    if (cubes[0].queue.length || cubes[0].anim) settle(s);
    const seq = sequenceOf(s);
    if (s.repeats > 1) {
      s.repeats -= 1;
      jump(cubes[0], C.inverse(seq), 1, 0);
    } else if (seq.length) {
      s.seq = C.encode(seq.slice(0, -1));
      if (s.repeats === 0)
        settle(s); // nothing was done yet: just shorten the recipe
      else perform(cubes[0], [C.inverseOf(seq[seq.length - 1])]);
    }
    note = '';
    stage.setChosen(-1);
    stage.refresh();
    stage.draw();
  }

  /** Repeat the sequence `times` more times, in at most STEPS visible changes. */
  function repeat(s, times = 1) {
    const seq = sequenceOf(s);
    if (!seq.length) return false;
    s.repeats += times;
    const chunk = Math.ceil(times / STEPS);
    for (let done = 0; done < times; done += chunk) {
      const n = Math.min(chunk, times - done);
      jump(cubes[0], seq, n, n);
    }
    note = '';
    return true;
  }

  function repeatUntilHome(s, stage) {
    const seq = sequenceOf(s);
    if (!seq.length) return;
    const order = C.order(seq);
    const left = order - (s.repeats % order);
    repeat(s, left === 0 ? order : left);
    s.repeats %= order; // back home: count afresh
    s.repeats ||= order;
    stage.sync();
    stage.draw();
    if (reduced) landed(s);
  }

  function compare(s, stage) {
    settle(s);
    perform(cubes[0], [s.a, s.b]);
    perform(cubes[1], [s.b, s.a]);
    compared = true;
    stage.sync();
    stage.draw();
  }

  // ---------- controls ----------

  const segment = (key, options, value) =>
    `<div class="segment cube-segment" role="group" aria-label="${t.mode}">` +
    options
      .map((o, i) => `<button type="button" data-${key}="${i}" aria-pressed="${i === value}">${o}</button>`)
      .join('') +
    '</div>';

  const moveName = (m) => {
    const move = C.MOVES[m];
    return t.turn(t.faces[move.name[0]], m >= 6);
  };
  // The accessible name starts with the button's visible text: "R′: turn the right face anticlockwise".
  const moveLabel = (m) => t.moveLabel(C.MOVES[m].name, moveName(m));

  const select = (key, label, value) =>
    `<div class="control"><label for="cube-${key}">${label}</label><select id="cube-${key}" data-pick="${key}">` +
    C.MOVES.map(
      (m, i) => `<option value="${i}"${i === value ? ' selected' : ''}>${m.name} · ${moveName(i)}</option>`,
    ).join('') +
    '</select></div>';

  function controls(s, stage) {
    let h = `<div class="control wide"><span class="cube-heading">${t.mode}</span>${segment('mode', t.modes, s.mode)}</div>`;
    if (s.mode === 0) {
      const full = sequenceOf(s).length >= C.MAX_LENGTH;
      h +=
        `<div class="control wide"><span class="cube-heading">${t.movePad}</span>` +
        `<p class="cube-key">${t.notation}</p><div class="cube-pad">` +
        C.MOVES.map(
          (m, i) =>
            `<button type="button" class="cube-move" data-move="${i}" aria-label="${moveLabel(i)}"${full ? ' disabled' : ''}>${m.name}</button>`,
        ).join('') +
        '</div><div class="cube-actions">' +
        `<button type="button" class="button" id="cube-undo">${t.undo}</button>` +
        `<button type="button" class="button" id="cube-clear">${t.clear}</button>` +
        `<button type="button" class="button" id="cube-home">${t.home}</button></div></div>` +
        stage.check('highlight', t.highlight, s.highlight);
    } else h += `<div class="cube-pair wide">${select('a', t.first, s.a)}${select('b', t.second, s.b)}</div>`;
    // Not a live region: it is rebuilt on every change. A finished run of repeats is announced instead.
    return h + '<div class="wide readout cube-readout" id="cube-readout"></div>';
  }

  function bindControls(panel, s, stage) {
    panel.querySelectorAll('[data-mode]').forEach((b) =>
      b.addEventListener('click', () => {
        s.mode = Number(b.dataset.mode);
        settle(s);
        note = '';
        stage.setChosen(-1);
        stage.refresh();
        $('scene-action').textContent = s.mode === 1 ? t.actionCompare : t.actionLabel;
        stage.draw();
        $('scene-controls').querySelector(`[data-mode="${s.mode}"]`)?.focus();
      }),
    );
    panel.querySelectorAll('[data-move]').forEach((b) =>
      b.addEventListener('click', () => {
        press(s, stage, Number(b.dataset.move));
        const again = $('scene-controls').querySelector(`[data-move="${b.dataset.move}"]`);
        // A full sequence disables the pad; keep focus somewhere useful.
        (again && !again.disabled ? again : $('cube-undo'))?.focus();
      }),
    );
    panel.querySelectorAll('[data-pick]').forEach((input) =>
      input.addEventListener('change', () => {
        s[input.dataset.pick] = Number(input.value);
        settle(s);
        stage.setChosen(-1);
        stage.sync();
        stage.draw();
      }),
    );
    $('cube-undo')?.addEventListener('click', () => {
      undo(s, stage);
      $('cube-undo')?.focus();
    });
    $('cube-clear')?.addEventListener('click', () => {
      s.seq = 0;
      s.repeats = 1;
      settle(s);
      note = '';
      stage.setChosen(-1);
      stage.refresh();
      stage.draw();
      $('cube-clear')?.focus();
    });
    $('cube-home')?.addEventListener('click', () => repeatUntilHome(s, stage));
  }

  function readouts(s) {
    $('scene-name').textContent = s.mode === 1 ? t.sceneName.compare : t.sceneName.one;
    $('scene-action').textContent = s.mode === 1 ? t.actionCompare : t.actionLabel;
    const box = $('cube-readout');
    if (s.mode === 1) {
      const a = C.run(C.solved(), [s.a, s.b]),
        b = C.run(C.solved(), [s.b, s.a]);
      const differ = a.filter((c, i) => c !== b[i]).length;
      $('scene-status').textContent = differ ? t.compareDiffer(differ).split(':')[0] : t.compareSame.split(':')[0];
      if (box) box.textContent = !compared ? t.compareReady : differ ? t.compareDiffer(differ) : t.compareSame;
      return;
    }
    const seq = sequenceOf(s);
    // Count what has visibly happened so far, so a long repeat doesn't give away its ending.
    const done = s.repeats - Math.round(cubes[0].inFlight);
    const moved = C.movedPieces(
      cubes[0].queue.length || cubes[0].anim ? cubes[0].state : C.run(C.solved(), seq, s.repeats),
    ).size;
    $('scene-status').textContent = t.status(moved);
    if (box)
      box.innerHTML =
        `<strong class="cube-notation">${t.sequence(C.notation(seq))}</strong>` +
        `<span>${seq.length ? t.times(done) + ' · ' + t.order(C.order(seq)) : ''}</span>` +
        `<span>${t.moved(moved)}</span>` +
        (seq.length >= C.MAX_LENGTH ? `<span>${t.full}</span>` : note ? `<span>${note}</span>` : '');
  }

  // ---------- the room ----------

  const R = 1,
    U = 0,
    F = 2;
  const presetSettings = [
    { mode: 1, a: R, b: U },
    { mode: 0, seq: C.encode([R, U]), repeats: 1, highlight: false },
    { mode: 0, seq: C.encode([R, U, R + 6, U + 6]), repeats: 1, highlight: true },
    { mode: 0, seq: C.encode([R, U, F, F + 6, U + 6, R + 6]), repeats: 1, highlight: false },
  ];
  const badges = ['≠', '105', '7', '↺'];

  W.defineRoom({
    id: 'cube',
    symbol: '▣',
    still: true, // turns happen when asked: nothing runs on its own to pause
    theme: 'games',
    eyebrow: t.eyebrow,
    name: t.name,
    tagline: t.tagline,
    accent: { background: '#2b2530', border: '#d87a5a', color: '#f6c6b2' },

    title: t.title,
    subtitle: t.subtitle,
    field: t.field,
    sceneLabel: t.sceneLabel,
    sceneName: t.sceneName.one,
    tip: t.tip,
    actionLabel: t.actionLabel,
    canvasLabel: t.canvasLabel,
    panelEyebrow: t.panelEyebrow,
    whyLabel: t.whyLabel,
    nudge: t.nudge,
    connection: { ...t.connection, go: 'sudoku' },

    defaults: { mode: 0, seq: C.encode([R, U]), repeats: 1, a: R, b: U, highlight: false },
    ranges: {
      mode: [0, 1, 'integer'],
      seq: [0, C.MAX_CODE, 'integer'],
      repeats: [0, 1260, 'integer'],
      a: [0, 11, 'integer'],
      b: [0, 11, 'integer'],
    },
    defaultPreset: 1,
    presets: t.presets.map((p, i) => ({ ...p, badge: badges[i], settings: presetSettings[i] })),

    guests: [
      {
        ...t.guests[0],
        bio: 'Galois',
        color: '#9fb6e8',
        sketch: { hairStyle: 'curly', hair: '#2d211b', skin: '#f1cfb0', backdrop: '#dfe4ec' },
      },
    ],
    insight: t.insight,

    controls,
    bindControls,
    readouts,
    draw,
    step,
    preview,

    enter(s, stage) {
      // A shared link may carry a sequence code that doesn't decode; fall back to none.
      if (C.decode(s.seq) === null) s.seq = 0;
      if (s.seq === 0) s.repeats = 1;
      settle(s);
      note = '';
      stage.sync(); // the panel was built before settle() cleared any old animation
    },
    onPreset(s, stage) {
      settle(s);
      note = '';
      if (s.mode === 1) compare(s, stage);
    },
    action(s, stage) {
      if (s.mode === 1) return compare(s, stage);
      if (!repeat(s)) return;
      stage.sync();
      stage.draw();
      if (reduced) landed(s);
    },
    reset(s, stage) {
      if (s.mode === 1) return settle(s);
      s.repeats = 0;
      settle(s);
      note = '';
      stage.sync();
    },

    pointer: {
      drag: true, // drags anywhere on the canvas, so touches there don't scroll the page
      move(p, { dragging, dx, dy }, s, stage) {
        if (!dragging) return;
        ry = (ry + dx * 0.009) % TAU;
        rx = clamp(rx + dy * 0.009, -1.4, 1.4);
        stage.draw();
      },
      arrow(dx, dy) {
        ry = (ry + dx * 0.15) % TAU;
        rx = clamp(rx + dy * 0.15, -1.4, 1.4);
      },
    },

    extraSettings: () => ({ rx, ry }),
    restore(saved) {
      rx = Number.isFinite(saved.rx) ? clamp(saved.rx, -1.4, 1.4) : 0.5;
      ry = Number.isFinite(saved.ry) ? saved.ry % TAU : -0.62;
    },
  });
})();
