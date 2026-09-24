/*
 * Room · Sudoku, made transparent. A 4×4 Sudoku drawn on the stage: each empty
 * square shows its remaining candidates, a placement visibly removes
 * possibilities from its neighbors, and the same puzzle can be redrawn as the
 * graph it really is. The mathematics is in model.js; the words in text.en.js.
 */
(() => {
  'use strict';

  const W = Wonderloom;
  const { $, clamp, TAU } = W;
  const model = W.models.sudoku;
  const t = W.text('sudoku');

  const SIDE = 4;
  const GRAPH = model.graph(SIDE);
  const PUZZLES = model.puzzles.map(model.parse);
  // Colorblind-friendly hues (after Okabe & Ito), lightened for the dark stage.
  const COLORS = ['#62b8ee', '#f2a541', '#e58ec2', '#4fcf9f'];
  const SHAPES = ['circle', 'square', 'triangle', 'diamond'];
  const GIVEN_INK = '#f1f2ed',
    PLACED_INK = '#ddf6a3',
    LIME = '#ddf6a3',
    WARM = '#ffb38a',
    SWAP = '#e2ccff';
  const FADE_TIME = 1.1; // seconds for a ruled-out candidate to fade

  let board = null; // { puzzle, givens, grid, history: [{ cell, from, to }] }
  let info = null; // analysis of board.grid: candidates, clashes, solutions
  let selected = 0; // the chosen square
  let note = null; // { say(s) → the line under the board, mark: what to outline }
  let fades = []; // candidates just ruled out: { cell, value, age }
  let flash = null; // the placement whose neighbors are lighting up: { cell, age }
  let morph = 0; // 0 = the board, 1 = the network
  let finishesOnStage = false; // whether the stage has room to show two finishes itself

  const rowOf = (cell) => model.rowOf(cell, SIDE);
  const colOf = (cell) => model.colOf(cell, SIDE);
  const nameOf = (s, value) => t.symbolNames[s.style][value - 1];

  /** Start a puzzle, optionally from a saved grid that keeps its clues. */
  function load(index, saved) {
    const givens = PUZZLES[index];
    board = { puzzle: index, givens, grid: saved ?? givens.slice(), history: [] };
    selected = Math.max(0, board.grid.indexOf(0));
    note = null;
    fades = [];
    flash = null;
    analyse();
  }

  function analyse() {
    const grid = board.grid;
    info = {
      options: model.candidates(grid),
      clashes: model.conflicts(grid),
      solutions: model.countSolutions(grid, 2),
    };
  }

  /** Change one square, remembering it for Undo and lighting up what it constrains. */
  function set(cell, value) {
    const grid = board.grid;
    const ruledOut = value ? model.eliminatedBy(grid, cell, value) : [];
    board.history.push({ cell, from: grid[cell], to: value });
    grid[cell] = value;
    fades = ruledOut.map((c) => ({ cell: c, value, age: 0 }));
    flash = value ? { cell, age: 0 } : null;
    selected = cell;
    analyse();
    return ruledOut.length;
  }

  const clashesAt = (cell) => info.clashes.filter((pair) => pair.includes(cell));

  function place(value) {
    const cell = selected;
    if (board.givens[cell]) {
      note = { say: () => t.given };
      return;
    }
    if (board.grid[cell] === value) return;
    const count = set(cell, value);
    if (clashesAt(cell).length) note = { say: (s) => t.clashed(nameOf(s, value)) };
    else if (model.isComplete(board.grid)) note = { say: (s) => t.solved(t.symbolWord[s.style]) };
    else note = { say: (s) => t.placed(nameOf(s, value), count) };
  }

  function clearSquare() {
    const cell = selected;
    if (board.givens[cell]) note = { say: () => t.given };
    else if (board.grid[cell]) {
      set(cell, 0);
      note = { say: () => t.cleared };
    }
  }

  function undo() {
    const last = board.history.pop();
    if (!last) return;
    board.grid[last.cell] = last.from;
    selected = last.cell;
    fades = [];
    flash = null;
    analyse();
    note = { say: () => t.undone };
  }

  /** The action button: apply the next single, or say gently why there isn't one. */
  function logicalStep() {
    const grid = board.grid;
    if (info.clashes.length) return void (note = { say: () => t.clashFirst });
    if (model.isComplete(grid)) return void (note = { say: (s) => t.solved(t.symbolWord[s.style]) });
    if (info.solutions.count === 0) return void (note = { say: () => t.stuckNone });
    const step = model.nextStep(grid);
    if (step) {
      set(step.cell, step.value);
      const mark = { focus: step.cell, because: step.because, unit: step.unit?.cells ?? [] };
      if (model.isComplete(board.grid)) {
        note = { say: (s) => t.solved(t.symbolWord[s.style]), mark };
      } else if (step.kind === 'naked') {
        note = { say: (s) => t.naked(nameOf(s, step.value)), mark };
      } else {
        note = { say: (s) => t.hidden(nameOf(s, step.value), t.unitNames[step.unit.kind]), mark };
      }
      return;
    }
    if (info.solutions.count === 2) {
      const swap = model.differences(...info.solutions.solutions);
      note = { say: () => t.stuckTwo, mark: { swap } };
    } else note = { say: () => t.stuckOne };
  }

  // ---------------------------------------------------------------- geometry

  const textRoom = (width) => (width < 480 ? 62 : 52); // space under the board for the explanation

  /**
   * Where the board sits: near the top of the stage, with room below for the
   * explanation. The network view spreads the four boxes apart, so the layout
   * eases between the two.
   */
  function layout(width, height, m) {
    const room = height - textRoom(width) - 10;
    const boardSize = Math.min(width * 0.92, room, 440);
    const netSize = Math.min(width * 0.8, room * 0.84, 400);
    const size = boardSize + (netSize - boardSize) * m;
    const cell = size / SIDE;
    const gap = cell * 0.22 * m;
    return {
      size,
      cell,
      gap,
      x0: (width - size) / 2,
      y0: gap + Math.max(4, Math.min((room - size - 2 * gap) / 2, 16)),
    };
  }

  /** Break a sentence into lines that fit a width. */
  function wrap(ctx, text, width) {
    const lines = [];
    let line = '';
    for (const word of text.split(' ')) {
      const next = line ? line + ' ' + word : word;
      if (line && ctx.measureText(next).width > width) {
        lines.push(line);
        line = word;
      } else line = next;
    }
    return line ? [...lines, line] : lines;
  }

  /** Centre of a square (or node) in a layout. */
  function centre(L, cell) {
    const row = rowOf(cell),
      col = colOf(cell);
    return {
      x: L.x0 + (col + 0.5) * L.cell + (col < SIDE / 2 ? -L.gap : L.gap),
      y: L.y0 + (row + 0.5) * L.cell + (row < SIDE / 2 ? -L.gap : L.gap),
    };
  }

  /** The square or node under a point, or -1. */
  function hit(L, x, y) {
    for (let cell = 0; cell < SIDE * SIDE; cell++) {
      const p = centre(L, cell);
      if (Math.abs(x - p.x) < L.cell / 2 && Math.abs(y - p.y) < L.cell / 2) return cell;
    }
    return -1;
  }

  // ---------------------------------------------------------------- drawing

  function shapePath(ctx, kind, x, y, r) {
    ctx.beginPath();
    if (kind === 'circle') ctx.arc(x, y, r, 0, TAU);
    else if (kind === 'square') ctx.rect(x - r * 0.86, y - r * 0.86, r * 1.72, r * 1.72);
    else if (kind === 'triangle') {
      ctx.moveTo(x, y - r * 1.05);
      ctx.lineTo(x + r * 1.05, y + r * 0.8);
      ctx.lineTo(x - r * 1.05, y + r * 0.8);
      ctx.closePath();
    } else {
      ctx.moveTo(x, y - r * 1.1);
      ctx.lineTo(x + r * 1.1, y);
      ctx.lineTo(x, y + r * 1.1);
      ctx.lineTo(x - r * 1.1, y);
      ctx.closePath();
    }
  }

  /** A shape or digit glyph (the colors style paints whole tiles instead). */
  function glyph(ctx, style, value, x, y, r, ink) {
    if (style === 2) {
      ctx.fillStyle = ink;
      ctx.font = `${Math.round(r * 2)}px Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(value), x, y + r * 0.08);
      return;
    }
    shapePath(ctx, SHAPES[value - 1], x, y, r);
    ctx.fillStyle = ink;
    ctx.fill();
  }

  /** A square that becomes a circle as the board turns into a network. */
  function tilePath(ctx, x, y, half, radius) {
    ctx.beginPath();
    ctx.roundRect(x - half, y - half, half * 2, half * 2, radius);
  }

  /** The curve for one edge: straight within a box, arched along a row or column. */
  function edgePath(ctx, L, a, b) {
    const p = centre(L, a),
      q = centre(L, b);
    const dr = Math.abs(rowOf(a) - rowOf(b)),
      dc = Math.abs(colOf(a) - colOf(b));
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    if ((dr === 0 && dc > 1) || (dc === 0 && dr > 1)) {
      const span = dr + dc,
        first = dr === 0 ? Math.min(colOf(a), colOf(b)) : Math.min(rowOf(a), rowOf(b));
      // Long links bow outward; the two middle-length links bow to opposite sides.
      const bend = (span === 3 ? -0.85 : first === 0 ? -0.5 : 0.5) * L.cell;
      const mx = (p.x + q.x) / 2 + (dr === 0 ? 0 : bend),
        my = (p.y + q.y) / 2 + (dr === 0 ? bend : 0);
      ctx.quadraticCurveTo(mx, my, q.x, q.y);
    } else ctx.lineTo(q.x, q.y);
  }

  /**
   * Draw a board or network. `scene` is { grid, givens, style, m, L, selected,
   * options, clashes, mark, fades, flash, time, still }; the room and the home
   * card preview both use it.
   */
  function drawScene(ctx, scene) {
    const { grid, givens, style, m, L } = scene;
    const clashCells = new Set(scene.clashes.flat());
    const peers = scene.selected >= 0 ? new Set(model.peersOf(scene.selected, SIDE)) : new Set();
    const mark = scene.mark ?? {};
    const unit = new Set(mark.unit ?? []);
    const radius = L.cell * 0.3; // node radius in the network
    const half = L.cell * 0.46 * (1 - m) + radius * m;
    const corner = L.cell * 0.09 * (1 - m) + radius * m;

    // Box outlines fade out as the network appears.
    if (m < 1) {
      ctx.save();
      ctx.globalAlpha = 1 - m;
      ctx.fillStyle = '#10171f';
      ctx.beginPath();
      ctx.roundRect(L.x0 - 6, L.y0 - 6, L.size + 12, L.size + 12, 12);
      ctx.fill();
      ctx.strokeStyle = '#5f7084';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(L.x0 + L.size / 2, L.y0 + 2);
      ctx.lineTo(L.x0 + L.size / 2, L.y0 + L.size - 2);
      ctx.moveTo(L.x0 + 2, L.y0 + L.size / 2);
      ctx.lineTo(L.x0 + L.size - 2, L.y0 + L.size / 2);
      ctx.stroke();
      ctx.restore();
    }

    // Edges of the graph, brighter where they touch the chosen square.
    if (m > 0) {
      ctx.save();
      ctx.globalAlpha = m;
      ctx.lineCap = 'round';
      const lit = [];
      for (const e of GRAPH.edges) {
        const clash = grid[e.a] && grid[e.a] === grid[e.b];
        if (clash || e.a === scene.selected || e.b === scene.selected) {
          lit.push([e, clash]);
          continue;
        }
        edgePath(ctx, L, e.a, e.b);
        ctx.strokeStyle = 'rgba(150, 170, 195, 0.3)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      for (const [e, clash] of lit) {
        edgePath(ctx, L, e.a, e.b);
        ctx.strokeStyle = clash ? WARM : 'rgba(221, 246, 163, 0.85)';
        ctx.lineWidth = clash ? 3 : 1.8;
        ctx.stroke();
      }
      ctx.restore();
    }

    for (let cell = 0; cell < grid.length; cell++) {
      const { x, y } = centre(L, cell);
      const value = grid[cell];
      const given = !!givens[cell];

      // The tile itself: tinted when it shares a row, column, or box with the chosen square.
      tilePath(ctx, x, y, half, corner);
      ctx.fillStyle = unit.has(cell) ? '#1f2c24' : peers.has(cell) ? '#1b2633' : '#151d28';
      ctx.fill();
      if (value && style === 0) {
        const inset = given ? half : half * 0.74;
        tilePath(ctx, x, y, inset, given ? corner : corner * 0.8 + inset * 0.2);
        ctx.fillStyle = COLORS[value - 1];
        ctx.fill();
      } else if (value) {
        glyph(ctx, style, value, x, y, half * 0.42, given ? GIVEN_INK : PLACED_INK);
      }

      // Candidates: one small mark per symbol still possible, always in the same corner.
      if (!value) {
        const options = scene.options[cell];
        for (let v = 1; v <= SIDE; v++) {
          const fade = scene.fades.find((f) => f.cell === cell && f.value === v);
          if (!options.includes(v) && !fade) continue;
          const mx = x + (v % 2 ? -1 : 1) * half * 0.46,
            my = y + (v > 2 ? 1 : -1) * half * 0.46;
          const r = half * 0.16;
          ctx.save();
          if (fade) {
            // A ruled-out mark swells and fades; when motion is paused it stays as a faint ring.
            const p = scene.still ? 0 : clamp(fade.age / FADE_TIME, 0, 1);
            if (scene.still) {
              ctx.globalAlpha = 0.6;
              ctx.strokeStyle = style === 0 ? COLORS[v - 1] : '#8d99a8';
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.arc(mx, my, r * 1.05, 0, TAU);
              ctx.stroke();
              ctx.restore();
              continue;
            }
            ctx.globalAlpha = 1 - p;
            ctx.translate(mx, my);
            ctx.scale(1 + p * 1.2, 1 + p * 1.2);
            ctx.translate(-mx, -my);
          }
          if (style === 0) {
            ctx.fillStyle = COLORS[v - 1];
            ctx.beginPath();
            ctx.arc(mx, my, r, 0, TAU);
            ctx.fill();
          } else glyph(ctx, style, v, mx, my, r * 0.95, '#9eabbb');
          ctx.restore();
        }
      }

      // Outlines: a clash glows warm, squares that can swap are dashed, reasons ring softly.
      if (clashCells.has(cell)) {
        ctx.save();
        ctx.shadowColor = WARM;
        ctx.shadowBlur = 18;
        ctx.strokeStyle = WARM;
        ctx.lineWidth = 3;
        tilePath(ctx, x, y, half + 2, corner + 2);
        ctx.stroke();
        ctx.restore();
      }
      if (mark.swap?.includes(cell)) {
        ctx.save();
        ctx.strokeStyle = SWAP;
        ctx.lineWidth = 2.2;
        ctx.setLineDash([6, 5]);
        tilePath(ctx, x, y, half - 3, Math.max(0, corner - 3));
        ctx.stroke();
        ctx.restore();
      }
      if (mark.because?.includes(cell)) {
        ctx.strokeStyle = LIME;
        ctx.lineWidth = 2.2;
        tilePath(ctx, x, y, half + 1, corner + 1);
        ctx.stroke();
      }
    }

    // Reasons for the last logical step: a line from each deciding square.
    if (mark.because?.length) {
      const f = centre(L, mark.focus);
      ctx.save();
      ctx.strokeStyle = 'rgba(221, 246, 163, 0.8)';
      ctx.fillStyle = LIME;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      for (const c of mark.because) {
        const p = centre(L, c);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(f.x, f.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    }

    // The neighbors of a fresh placement light up for a moment.
    if (scene.flash && !scene.still) {
      const p = clamp(scene.flash.age / 0.9, 0, 1);
      ctx.save();
      ctx.globalAlpha = (1 - p) * 0.45;
      ctx.strokeStyle = LIME;
      ctx.lineWidth = 2;
      for (const c of model.peersOf(scene.flash.cell, SIDE)) {
        const { x, y } = centre(L, c);
        tilePath(ctx, x, y, half * (1 + 0.14 * p), corner);
        ctx.stroke();
      }
      ctx.restore();
    }

    // The chosen square.
    if (scene.selected >= 0) {
      const { x, y } = centre(L, scene.selected);
      const pulse = scene.still ? 0 : Math.sin(scene.time * 3) * 0.8;
      ctx.strokeStyle = LIME;
      ctx.lineWidth = 3 + pulse;
      tilePath(ctx, x, y, half + 3, corner + 3);
      ctx.stroke();
    }
  }

  function draw(ctx, s, stage) {
    const { width, height } = stage;
    if (!board) load(s.puzzle);
    const still = !stage.playing;
    if (still) {
      morph = s.network ? 1 : 0;
      flash = null;
    }
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    const L = layout(width, height, morph);
    drawScene(ctx, {
      grid: board.grid,
      givens: board.givens,
      style: s.style,
      m: morph,
      L,
      selected,
      options: info.options,
      clashes: info.clashes,
      mark: note?.mark,
      fades,
      flash,
      time: stage.clock,
      still,
    });

    // The one short line that says what just happened, right under the board.
    const small = width < 480;
    ctx.font = `${small ? 13 : 15}px system-ui, sans-serif`;
    ctx.fillStyle = '#dfe7d6';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    const lines = wrap(ctx, note ? note.say(s) : t.start(t.symbolWord[s.style]), Math.min(width - 24, 560));
    const top = L.y0 + L.size + L.gap + (small ? 22 : 30);
    const leading = small ? 17 : 20;
    lines.forEach((line, i) => ctx.fillText(line, width / 2, top + i * leading));
    let bottom = top + (lines.length - 1) * leading;
    if (morph > 0.5) {
      ctx.globalAlpha = (morph - 0.5) * 2;
      ctx.fillStyle = '#98aab7';
      ctx.font = `${small ? 11 : 12}px system-ui, sans-serif`;
      bottom += small ? 16 : 22;
      ctx.fillText(t.networkCaption, width / 2, bottom);
      ctx.globalAlpha = 1;
    }

    // On a tall stage the solver's two finishes sit under the board; otherwise they go in the panel.
    const fits = height - bottom > 190 && width > 540;
    if (fits !== finishesOnStage) {
      finishesOnStage = fits;
      stage.sync();
    }
    if (fits && info.solutions.count === 2) drawFinishes(ctx, s, width, bottom + 26);
  }

  /** The two completed grids the solver found, with the squares that differ outlined. */
  function drawFinishes(ctx, s, width, y) {
    const [a, b] = info.solutions.solutions;
    const swap = model.differences(a, b);
    const size = 130,
      gap = 36;
    ctx.fillStyle = '#b7c3cf';
    ctx.font = '13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t.twoFinishes, width / 2, y);
    [a, b].forEach((grid, i) => {
      const x0 = width / 2 + (i ? gap / 2 : -gap / 2 - size);
      drawScene(ctx, {
        grid,
        givens: board.givens,
        style: s.style,
        m: 0,
        L: { size, cell: size / SIDE, gap: 0, x0, y0: y + 20 },
        selected: -1,
        options: grid.map(() => []),
        clashes: [],
        mark: { swap },
        fades: [],
        flash: null,
        time: 0,
        still: true,
      });
      ctx.fillStyle = '#98aab7';
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillText(t.answerLabel(i + 1), x0 + size / 2, y + 20 + size + 24);
    });
  }

  function step(dt, s) {
    for (const f of fades) f.age += dt;
    fades = fades.filter((f) => f.age < FADE_TIME);
    if (flash && (flash.age += dt) > 0.9) flash = null;
    const target = s.network ? 1 : 0;
    morph = target > morph ? Math.min(target, morph + dt * 2.2) : Math.max(target, morph - dt * 2.2);
  }

  /** A still picture for the home map: the board half filled, and the same puzzle as a network. */
  function preview(ctx, width, height) {
    const grid = model.parse('1.3.' + '.42.' + '..1.' + '4...');
    const common = {
      grid,
      givens: grid,
      style: 0,
      selected: -1,
      options: model.candidates(grid),
      clashes: [],
      fades: [],
      flash: null,
      time: 0,
      still: true,
    };
    const size = height * 0.78;
    drawScene(ctx, { ...common, m: 0, L: { size, cell: size / 4, gap: 0, x0: 20, y0: (height - size) / 2 } });
    const net = height * 0.56;
    drawScene(ctx, {
      ...common,
      selected: 6,
      m: 1,
      L: { size: net, cell: net / 4, gap: net * 0.05, x0: width - net - 26, y0: (height - net) / 2 },
    });
  }

  // ---------------------------------------------------------------- panel

  /** An SVG picture of one symbol, for buttons and the two-finish readout. */
  function svgSymbol(style, value, x, y, r, ink = GIVEN_INK) {
    if (style === 0) {
      return `<rect x="${x - r}" y="${y - r}" width="${2 * r}" height="${2 * r}" rx="${r * 0.28}" fill="${COLORS[value - 1]}"/>`;
    }
    if (style === 2) {
      return `<text x="${x}" y="${y + r * 0.62}" font-family="Georgia, serif" font-size="${r * 1.9}" text-anchor="middle" fill="${ink}">${value}</text>`;
    }
    const k = SHAPES[value - 1];
    if (k === 'circle') return `<circle cx="${x}" cy="${y}" r="${r * 0.9}" fill="${ink}"/>`;
    if (k === 'square') {
      return `<rect x="${x - r * 0.78}" y="${y - r * 0.78}" width="${r * 1.56}" height="${r * 1.56}" fill="${ink}"/>`;
    }
    const pts =
      k === 'triangle'
        ? [
            [x, y - r],
            [x + r, y + r * 0.75],
            [x - r, y + r * 0.75],
          ]
        : [
            [x, y - r],
            [x + r, y],
            [x, y + r],
            [x - r, y],
          ];
    return `<polygon points="${pts.map((p) => p.join(',')).join(' ')}" fill="${ink}"/>`;
  }

  /** A small picture of a finished grid, outlining the squares where two finishes differ. */
  function miniGrid(style, grid, differ, label) {
    const cells = grid
      .map((v, i) => {
        const x = colOf(i) * 20 + 10 + (colOf(i) > 1 ? 4 : 0),
          y = rowOf(i) * 20 + 10 + (rowOf(i) > 1 ? 4 : 0);
        const ring = differ.includes(i)
          ? `<rect x="${x - 9.5}" y="${y - 9.5}" width="19" height="19" rx="4" fill="none" stroke="${SWAP}" stroke-width="1.6" stroke-dasharray="3 2"/>`
          : '';
        return `<rect x="${x - 9}" y="${y - 9}" width="18" height="18" rx="3" fill="#151d28"/>${svgSymbol(style, v, x, y, style === 0 ? 6.5 : 6, differ.includes(i) ? PLACED_INK : GIVEN_INK)}${ring}`;
      })
      .join('');
    return `<svg viewBox="0 0 84 84" role="img" aria-label="${label}">${cells}</svg>`;
  }

  function controls(s, stage) {
    const symbols = [1, 2, 3, 4]
      .map(
        (v) =>
          `<button type="button" class="sudoku-symbol" data-symbol="${v}" aria-label="${t.placeButton(nameOf(s, v))}">` +
          `<svg viewBox="0 0 28 28" aria-hidden="true">${svgSymbol(s.style, v, 14, 14, 10)}</svg></button>`,
      )
      .join('');
    const styles = t.styles
      .map((name, i) => `<button type="button" data-style="${i}" aria-pressed="${i === s.style}">${name}</button>`)
      .join('');
    return (
      `<div class="control wide"><span class="sudoku-label" id="sudoku-place-label">${t.placeLabel}</span>` +
      `<div class="sudoku-symbols" role="group" aria-labelledby="sudoku-place-label">${symbols}</div>` +
      `<div class="sudoku-edit"><button type="button" class="button" id="sudoku-undo">↶ ${t.undo}</button>` +
      `<button type="button" class="button" id="sudoku-clear">${t.clear}</button></div></div>` +
      `<div class="control wide"><span class="sudoku-label" id="sudoku-style-label">${t.styleLabel}</span>` +
      `<div class="segment" id="sudoku-style" role="group" aria-labelledby="sudoku-style-label">${styles}</div>` +
      `<p>${t.styleHint}</p></div>` +
      `<div class="wide">${stage.check('network', t.network, s.network)}</div>` +
      '<div class="wide readout sudoku-readout" id="sudoku-readout" role="status"></div>'
    );
  }

  function bindControls(panel, s, stage) {
    const after = () => {
      stage.sync();
      stage.draw();
    };
    panel.querySelectorAll('[data-symbol]').forEach((b) =>
      b.addEventListener('click', () => {
        place(Number(b.dataset.symbol));
        after();
      }),
    );
    $('sudoku-undo').addEventListener('click', () => {
      undo();
      after();
    });
    $('sudoku-clear').addEventListener('click', () => {
      clearSquare();
      after();
    });
    panel.querySelectorAll('[data-style]').forEach((b) =>
      b.addEventListener('click', () => {
        s.style = Number(b.dataset.style);
        stage.refresh();
        stage.draw();
        panel.querySelector(`[data-style="${s.style}"]`)?.focus();
      }),
    );
  }

  function readouts(s) {
    if (!board) load(s.puzzle); // the panel is drawn before enter() on a first visit
    const grid = board.grid;
    const filled = grid.filter(Boolean).length;
    const options = info.options[selected];
    $('scene-name').textContent = t.presets[board.puzzle].name;
    $('scene-status').textContent = t.status(filled);
    const line = note ? note.say(s) : t.start(t.symbolWord[s.style]);
    $('scene-tip').textContent = t.tip;

    // What a screen reader hears when the board has focus.
    const value = grid[selected];
    const content = value
      ? t.holds(nameOf(s, value), !!board.givens[selected])
      : options.length
        ? t.emptyWith(options.map((v) => nameOf(s, v)))
        : t.emptyNone;
    $('scene-canvas').setAttribute(
      'aria-label',
      `${t.canvasLabel} ${t.describe(rowOf(selected) + 1, colOf(selected) + 1, content)}`,
    );

    document.querySelectorAll('.sudoku-symbol').forEach((b) => {
      const v = Number(b.dataset.symbol);
      const fits = !board.givens[selected] && (value === v || model.canPlace(grid, selected, v));
      b.dataset.possible = fits;
      b.setAttribute('aria-label', t.placeButton(nameOf(s, v)) + (fits ? '' : ` (${t.clash})`));
    });
    $('sudoku-undo').disabled = !board.history.length;
    $('sudoku-clear').disabled = !value || !!board.givens[selected];

    const { count, solutions } = info.solutions;
    let h =
      '<div class="sudoku-stats">' +
      `<div><span>${t.filled}</span><strong id="sudoku-filled">${filled}<small>/16</small></strong></div>` +
      `<div><span>${t.candidatesLeft}</span><strong id="sudoku-candidates">${model.candidateCount(grid)}</strong></div>` +
      `<div><span>${t.waysToFinish}</span><strong id="sudoku-solutions">${count || t.none}</strong></div></div>` +
      `<span class="sudoku-hidden">${line}</span>`;
    if (count === 2 && !finishesOnStage) {
      const differ = model.differences(...solutions);
      h +=
        `<div class="sudoku-answers"><p>${t.twoFinishes}</p><div>` +
        solutions.map((g, i) => miniGrid(s.style, g, differ, t.answerLabel(i + 1))).join('') +
        '</div></div>';
    }
    $('sudoku-readout').innerHTML = h;
  }

  // Room-specific styles, scoped to this room. They could move to styles/rooms.css verbatim.
  const CSS = `
body[data-room='sudoku'] .scene-tip { color: #d3dccb; font-size: 13px; }
.sudoku-label { font-size: 14px; display: block; }
.sudoku-symbols { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin-top: 11px; }
.sudoku-symbol { min-height: 48px; border: 1px solid #414b5b; border-radius: 10px; background: #121b26;
  display: flex; align-items: center; justify-content: center; }
.sudoku-symbol:hover { border-color: #8a9aa3; background: #1c2631; }
.sudoku-symbol svg { width: 28px; height: 28px; stroke: none; }
.sudoku-symbol[data-possible='false'] svg { opacity: 0.4; }
.sudoku-edit { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px; }
.sudoku-readout { border: 1px solid #3d4a5c; background: #111923; padding: 14px; border-radius: 9px; }
.sudoku-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.sudoku-stats span { display: block; font-size: 12px; color: #a7b4c6; }
.sudoku-stats strong { display: block; font-size: 26px; font-weight: 600; color: #f0f5ea;
  font-variant-numeric: tabular-nums; line-height: 1.2; }
.sudoku-stats small { font-size: 13px; font-weight: 400; color: #a7b4c6; }
.sudoku-answers p { margin: 12px 0 8px; font-size: 13px; color: #d7dfe8; line-height: 1.45; }
.sudoku-answers div { display: flex; gap: 12px; }
.sudoku-answers svg { width: 88px; height: 88px; }
.sudoku-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (max-width: 760px) { body[data-room='sudoku'] .scene-tip { display: none; } }`;

  W.defineRoom({
    id: 'sudoku',
    symbol: '▦',
    eyebrow: t.eyebrow,
    name: t.name,
    theme: 'games',
    tagline: t.tagline,
    accent: { background: '#262a33', border: '#f2a541', color: '#ffd9a8' },

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
    connection: { html: t.connection.html, go: 'traffic', label: t.connection.label },

    // puzzle: which preset; style: 0 colors, 1 shapes, 2 digits. Both are shared in links.
    defaults: { puzzle: 0, style: 0, network: false },
    ranges: { puzzle: [0, PUZZLES.length - 1, 'integer'], style: [0, 2, 'integer'] },
    defaultPreset: 0,
    presets: t.presets.map((p, i) => ({
      name: p.name,
      note: p.note,
      badge: String(PUZZLES[i].filter(Boolean).length),
      settings: { puzzle: i },
    })),

    guests: [
      {
        name: t.guest.name,
        note: t.guest.note,
        bio: 'Euler',
        image: 'euler.jpg',
        source: 'Leonhard_Euler_-_Jakob_Emanuel_Handmann_(Kunstmuseum_Basel).jpg',
        color: '#acd5a5',
        frame: [125, -36, -21],
      },
    ],

    insight: { title: t.insight.title, html: t.insight.html },

    init() {
      const style = document.createElement('style');
      style.id = 'sudoku-style-sheet';
      style.textContent = CSS;
      document.head.appendChild(style);
    },

    controls,
    bindControls,
    readouts,
    draw,
    step,
    preview,

    enter(s, stage) {
      if (!board || board.puzzle !== s.puzzle) load(s.puzzle);
      stage.setChosen(s.puzzle); // presets are the puzzles, in order
      stage.sync();
    },
    onPreset(s) {
      load(s.puzzle);
    },
    reset(s, stage) {
      load(s.puzzle);
      note = { say: () => t.fresh };
      stage.sync();
    },
    action(s, stage) {
      logicalStep();
      stage.sync();
      stage.draw();
    },

    pointer: {
      down(p, s, stage) {
        const cell = hit(layout(stage.width, stage.height, morph), p.x * stage.width, p.y * stage.height);
        if (cell < 0) return;
        selected = cell;
        stage.sync();
        stage.draw();
      },
      arrow(dx, dy, s, stage) {
        selected = clamp(rowOf(selected) + dy, 0, SIDE - 1) * SIDE + clamp(colOf(selected) + dx, 0, SIDE - 1);
        stage.sync();
      },
      /** Keys 1–4 place a symbol, Backspace or Delete clears, Ctrl/⌘+Z undoes. */
      key(e, s, stage) {
        if (e.altKey) return false;
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') undo();
        else if (e.ctrlKey || e.metaKey) return false;
        else if (/^[1-4]$/.test(e.key)) place(Number(e.key));
        else if (['Backspace', 'Delete', '0'].includes(e.key)) clearSquare();
        else return false;
        stage.sync();
        return true;
      },
    },

    /**
     * Saved moments keep the board as it was. The trail stores only numbers, so
     * the grid travels as one whole number, and is kept only if it fits the clues.
     */
    extraSettings: () => ({ board: model.toNumber(board.grid) }),
    restore(saved, s) {
      const grid = model.fromNumber(saved.board, SIDE);
      if (grid && PUZZLES[s.puzzle].every((v, i) => !v || grid[i] === v)) load(s.puzzle, grid);
    },
  });
})();
