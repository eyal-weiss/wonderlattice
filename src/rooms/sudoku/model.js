/*
 * Sudoku, made transparent · the constraint structure behind Sudoku.
 *
 * A grid is a flat array of side × side cells, read row by row; 0 is empty and
 * 1..side are the symbols. The code works for any square side whose root is a
 * whole number (4×4 with 2×2 boxes in the room, 9×9 with 3×3 boxes in tests).
 * Two cells are "peers" when they share a row, a column, or a box: they may
 * not hold the same symbol. Seen that way, a Sudoku is a graph-coloring
 * problem (Herzberg & Murty, https://people.math.sc.edu/girardi/sudoku/ChromaticPoly.pdf).
 * Pure functions, no DOM, no visitor-facing words.
 */
(() => {
  'use strict';

  const shapes = new Map(); // side → frozen geometry, built once

  /** Rows, columns, boxes, and each cell's peers for a board of this side. */
  function geometry(side) {
    if (shapes.has(side)) return shapes.get(side);
    const box = Math.round(Math.sqrt(side));
    if (!Number.isInteger(side) || side < 1 || box * box !== side) throw new RangeError('Side must be a square number');
    const cells = side * side;
    const cell = (row, col) => row * side + col;
    const range = [...Array(side).keys()];
    const units = [];
    for (const i of range) units.push({ kind: 'row', index: i, cells: range.map((c) => cell(i, c)) });
    for (const i of range) units.push({ kind: 'col', index: i, cells: range.map((r) => cell(r, i)) });
    for (const i of range) {
      const top = Math.floor(i / box) * box,
        left = (i % box) * box;
      units.push({ kind: 'box', index: i, cells: range.map((k) => cell(top + Math.floor(k / box), left + (k % box))) });
    }
    const peers = [];
    for (let c = 0; c < cells; c++) {
      const set = new Set();
      for (const unit of units) if (unit.cells.includes(c)) unit.cells.forEach((p) => p !== c && set.add(p));
      peers.push(Object.freeze([...set].sort((a, b) => a - b)));
    }
    const g = Object.freeze({ side, box, cells, units: Object.freeze(units), peers: Object.freeze(peers) });
    shapes.set(side, g);
    return g;
  }

  /** The geometry for a grid, checking that its length is a valid board. */
  function shapeOf(grid) {
    const side = Math.round(Math.sqrt(grid.length));
    if (side * side !== grid.length) throw new RangeError('A grid must have side × side cells');
    return geometry(side);
  }

  const rowOf = (cell, side) => Math.floor(cell / side);
  const colOf = (cell, side) => cell % side;
  const boxOf = (cell, side) => {
    const box = geometry(side).box;
    return Math.floor(rowOf(cell, side) / box) * box + Math.floor(colOf(cell, side) / box);
  };

  /** Read a grid from text such as '1.3.' (dots or zeros are empty cells). */
  function parse(text) {
    const grid = [...text.replace(/\s/g, '')].map((ch) => (ch === '.' ? 0 : Number(ch)));
    const { side } = shapeOf(grid);
    if (grid.some((v) => !Number.isInteger(v) || v < 0 || v > side)) throw new RangeError('Unknown symbol in grid');
    return grid;
  }

  /** Write a grid as text, with dots for empty cells. */
  const format = (grid) => grid.map((v) => (v ? String(v) : '.')).join('');

  /** A grid as one whole number (base side + 1, first cell lowest), for places that store only numbers. */
  function toNumber(grid) {
    const { side } = shapeOf(grid);
    return grid.reduceRight((n, v) => n * (side + 1) + v, 0);
  }

  /** The grid a whole number stands for, or null if it is not a valid board of this side. */
  function fromNumber(n, side = 4) {
    const cells = side * side,
      base = side + 1;
    if (!Number.isSafeInteger(n) || n < 0 || n >= base ** cells) return null;
    const grid = [];
    for (let i = 0; i < cells; i++) {
      grid.push(n % base);
      n = Math.floor(n / base);
    }
    return grid;
  }

  /** The other cells that may not share a symbol with `cell`. */
  const peersOf = (cell, side = 4) => geometry(side).peers[cell];

  /** True when `value` could go in `cell` without repeating in its row, column, or box. */
  function canPlace(grid, cell, value) {
    return !shapeOf(grid).peers[cell].some((p) => grid[p] === value);
  }

  /**
   * The symbols still possible in each cell: for an empty cell, every symbol no
   * peer already holds; for a filled cell, an empty list.
   */
  function candidates(grid) {
    const { side, peers } = shapeOf(grid);
    return grid.map((v, cell) => {
      if (v) return [];
      const used = new Set(peers[cell].map((p) => grid[p]));
      const out = [];
      for (let s = 1; s <= side; s++) if (!used.has(s)) out.push(s);
      return out;
    });
  }

  /** Total number of candidate marks over all empty cells. */
  const candidateCount = (grid) => candidates(grid).reduce((sum, list) => sum + list.length, 0);

  /** Pairs of peers that hold the same symbol, each as [smaller cell, larger cell]. */
  function conflicts(grid) {
    const { peers } = shapeOf(grid);
    const out = [];
    grid.forEach((v, cell) => {
      if (v) for (const p of peers[cell]) if (p > cell && grid[p] === v) out.push([cell, p]);
    });
    return out;
  }

  /** Empty peers of `cell` for which placing `value` there removes `value` as a candidate. */
  function eliminatedBy(grid, cell, value) {
    const { peers } = shapeOf(grid);
    return peers[cell].filter((p) => grid[p] === 0 && canPlace(grid, p, value));
  }

  /** Every cell filled and no rule broken. */
  const isComplete = (grid) => grid.every((v) => v > 0) && conflicts(grid).length === 0;

  /**
   * A naked single: an empty cell with exactly one candidate left. `because`
   * lists, for each other symbol, one peer already holding it.
   */
  function nakedSingle(grid) {
    const { side, peers } = shapeOf(grid);
    const options = candidates(grid);
    for (let cell = 0; cell < grid.length; cell++) {
      if (grid[cell] || options[cell].length !== 1) continue;
      const value = options[cell][0];
      const because = [];
      for (let s = 1; s <= side; s++) {
        if (s === value) continue;
        const holder = peers[cell].find((p) => grid[p] === s);
        if (holder !== undefined) because.push(holder);
      }
      return { kind: 'naked', cell, value, because };
    }
    return null;
  }

  /**
   * A hidden single: a symbol that has only one possible cell left in some row,
   * column, or box. `because` lists, for each other empty cell of that unit, a
   * peer that already holds the symbol there.
   */
  function hiddenSingle(grid) {
    const { side, units, peers } = shapeOf(grid);
    const options = candidates(grid);
    for (const unit of units) {
      for (let value = 1; value <= side; value++) {
        if (unit.cells.some((c) => grid[c] === value)) continue;
        const spots = unit.cells.filter((c) => options[c].includes(value));
        if (spots.length !== 1) continue;
        const cell = spots[0];
        const because = [];
        for (const other of unit.cells) {
          if (other === cell || grid[other]) continue;
          const holder = peers[other].find((p) => grid[p] === value);
          if (holder !== undefined && !because.includes(holder)) because.push(holder);
        }
        return {
          kind: 'hidden',
          cell,
          value,
          unit: { kind: unit.kind, index: unit.index, cells: unit.cells },
          because,
        };
      }
    }
    return null;
  }

  /** The next deduction by singles (naked first, then hidden), or null when none applies. */
  function nextStep(grid) {
    if (conflicts(grid).length) return null;
    if (candidates(grid).some((list, cell) => !grid[cell] && list.length === 0)) return null;
    return nakedSingle(grid) ?? hiddenSingle(grid);
  }

  /** Apply singles until none is left. Returns the final grid and the steps taken. */
  function solveBySingles(grid) {
    let current = grid.slice();
    const steps = [];
    for (let step = nextStep(current); step; step = nextStep(current)) {
      current = current.slice();
      current[step.cell] = step.value;
      steps.push(step);
    }
    return { grid: current, steps, solved: isComplete(current) };
  }

  /**
   * Count the ways to finish a grid by backtracking, stopping at `limit`.
   * Returns { count, solutions } with up to `limit` completed grids. A grid
   * that already breaks a rule has no solutions.
   */
  function countSolutions(grid, limit = 2) {
    const { side } = shapeOf(grid);
    const solutions = [];
    if (limit < 1 || conflicts(grid).length) return { count: 0, solutions };
    const work = grid.slice();
    const search = () => {
      // Fill the most constrained empty cell first: fewest candidates.
      const options = candidates(work);
      let best = -1;
      for (let cell = 0; cell < work.length; cell++) {
        if (work[cell]) continue;
        if (best < 0 || options[cell].length < options[best].length) best = cell;
        if (options[cell].length === 0) return;
      }
      if (best < 0) {
        solutions.push(work.slice());
        return;
      }
      for (const value of options[best]) {
        work[best] = value;
        search();
        work[best] = 0;
        if (solutions.length >= limit) return;
      }
    };
    if (side > 0) search();
    return { count: solutions.length, solutions };
  }

  /** Cells where two grids differ. */
  const differences = (a, b) => a.map((_, i) => i).filter((i) => a[i] !== b[i]);

  /**
   * The Sudoku graph: one node per cell and one edge between every pair of
   * peers. `kinds` says which rules join the two cells (a pair can share a row
   * and a box at once). A 4×4 board has 16 nodes and 56 edges; 9×9 has 81 and 810.
   */
  function graph(side = 4) {
    const { cells, units, peers } = geometry(side);
    const nodes = [...Array(cells).keys()].map((cell) => ({
      cell,
      row: rowOf(cell, side),
      col: colOf(cell, side),
      box: boxOf(cell, side),
    }));
    const edges = [];
    for (let a = 0; a < cells; a++) {
      for (const b of peers[a]) {
        if (b < a) continue;
        const kinds = units.filter((u) => u.cells.includes(a) && u.cells.includes(b)).map((u) => u.kind);
        edges.push({ a, b, kinds });
      }
    }
    return { nodes, edges };
  }

  /** A proper coloring gives every edge two different colors (empty nodes are ignored). */
  const isProperColoring = (grid, edges) => edges.every(({ a, b }) => !grid[a] || grid[a] !== grid[b]);

  // The room's puzzles, as text. Each is checked in tests/unit/sudoku.test.js.
  const puzzles = Object.freeze([
    '1...' + '432.' + '.412' + '...3', // eight clues, unique; singles finish it
    '1...' + '..3.' + '.4..' + '...2', // only four clues (the fewest possible), still unique
    '.1..' + '.3..' + '3.2.' + '1.4.', // six clues and exactly two completions
  ]);

  Wonderloom.models.sudoku = Object.freeze({
    geometry,
    rowOf,
    colOf,
    boxOf,
    parse,
    format,
    toNumber,
    fromNumber,
    peersOf,
    canPlace,
    candidates,
    candidateCount,
    conflicts,
    eliminatedBy,
    isComplete,
    nakedSingle,
    hiddenSingle,
    nextStep,
    solveBySingles,
    countSolutions,
    differences,
    graph,
    isProperColoring,
    puzzles,
  });
})();
