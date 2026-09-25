import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.sudoku;
const { parse, format } = M;

// A well-known 9×9 puzzle and its solution, to check the same code at full size.
const NINE = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';
const NINE_SOLVED = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';

test('geometry: rows, columns, boxes, and seven peers per cell on a 4×4 board', () => {
  const g = M.geometry(4);
  assert.equal(g.box, 2);
  assert.equal(g.cells, 16);
  assert.equal(g.units.length, 12);
  assert.deepEqual(
    g.units.filter((u) => u.kind === 'box').map((u) => u.cells),
    [
      [0, 1, 4, 5],
      [2, 3, 6, 7],
      [8, 9, 12, 13],
      [10, 11, 14, 15],
    ],
  );
  // Cell 5 is row 1, column 1, box 0.
  assert.deepEqual(M.peersOf(5), [0, 1, 4, 6, 7, 9, 13]);
  for (let cell = 0; cell < 16; cell++) {
    assert.equal(M.peersOf(cell).length, 7);
    assert.ok(!M.peersOf(cell).includes(cell));
  }
  assert.equal(M.geometry(9).peers[40].length, 20);
  assert.deepEqual([M.rowOf(14, 4), M.colOf(14, 4), M.boxOf(14, 4)], [3, 2, 3]);
  assert.equal(M.boxOf(80, 9), 8);
  assert.throws(() => M.geometry(5), RangeError);
  assert.throws(() => parse('123'), RangeError);
});

test('parse and format round-trip, and reject unknown symbols', () => {
  const grid = parse('1..4 .4.2 4.2. 2..3');
  assert.deepEqual(grid, [1, 0, 0, 4, 0, 4, 0, 2, 4, 0, 2, 0, 2, 0, 0, 3]);
  assert.equal(format(grid), '1..4.4.24.2.2..3');
  assert.equal(format(parse('0000000000000001')), '...............1');
  assert.throws(() => parse('5...............'), RangeError);
  assert.throws(() => parse('x...............'), RangeError);
});

test('a grid round-trips through one whole number, and bad numbers are refused', () => {
  const grid = parse('1..4' + '.4.2' + '4.2.' + '2..3');
  const n = M.toNumber(grid);
  assert.ok(Number.isSafeInteger(n));
  assert.deepEqual(M.fromNumber(n), grid);
  assert.equal(M.toNumber(Array(16).fill(0)), 0);
  assert.deepEqual(M.fromNumber(5 ** 16 - 1), Array(16).fill(4));
  for (const bad of [-1, 5 ** 16, 1.5, NaN, '12', null, undefined]) assert.equal(M.fromNumber(bad), null);
});

test('candidates are the symbols no peer holds', () => {
  const grid = parse('1...' + '..3.' + '.4..' + '...2');
  const options = M.candidates(grid);
  assert.deepEqual(options[0], []); // filled
  assert.deepEqual(options[1], [2, 3]); // its row and box hold 1, its column holds 4
  assert.deepEqual(options[5], [2]); // box 0 has 1, row 1 has 3, column 1 has 4
  assert.equal(
    M.candidateCount(grid),
    options.reduce((n, l) => n + l.length, 0),
  );
  assert.equal(M.candidateCount(Array(16).fill(0)), 64);
});

test('placement validity and conflicts', () => {
  const grid = parse('1...' + '....' + '....' + '....');
  assert.equal(M.canPlace(grid, 1, 1), false); // same row
  assert.equal(M.canPlace(grid, 4, 1), false); // same column and box
  assert.equal(M.canPlace(grid, 5, 1), false); // same box only
  assert.equal(M.canPlace(grid, 6, 1), true);
  assert.equal(M.canPlace(grid, 15, 1), true);
  assert.deepEqual(M.conflicts(grid), []);
  const clash = parse('1...' + '.1..' + '....' + '...1');
  assert.deepEqual(M.conflicts(clash), [[0, 5]]);
  assert.deepEqual(M.conflicts(parse('11..' + '1...' + '....' + '....')), [
    [0, 1],
    [0, 4],
    [1, 4],
  ]);
});

test('placing a symbol eliminates it from exactly the empty peers that had it', () => {
  const grid = parse('1...' + '....' + '....' + '...2');
  const gone = M.eliminatedBy(grid, 5, 2);
  // Cell 5's peers are 0, 1, 4, 6, 7, 9, 13. Cell 0 is filled, and 7 and 13 already
  // see the 2 in cell 15, so only four cells lose a candidate.
  assert.deepEqual(gone, [1, 4, 6, 9]);
  const before = M.candidates(grid);
  const after = grid.slice();
  after[5] = 2;
  const now = M.candidates(after);
  for (let cell = 0; cell < 16; cell++) {
    if (cell === 5 || grid[cell]) continue;
    const lost = before[cell].filter((v) => !now[cell].includes(v));
    assert.deepEqual(lost, gone.includes(cell) ? [2] : [], `cell ${cell}`);
  }
});

test('a naked single names the peers that rule out every other symbol', () => {
  // Cell 5 sees 1, 2, and 3 in its box (3 is also in its row), so only 4 is left.
  const grid = parse('12..' + '3...' + '....' + '....');
  const step = M.nakedSingle(grid);
  assert.equal(step.kind, 'naked');
  assert.equal(step.cell, 5);
  assert.equal(step.value, 4);
  assert.deepEqual(
    [...step.because].sort((a, b) => a - b),
    [0, 1, 4],
  );
  assert.deepEqual(M.candidates(grid)[5], [4]);
  assert.equal(M.nakedSingle(Array(16).fill(0)), null);
});

test('a hidden single: the only place for a symbol in a unit', () => {
  // Row 0 needs a 1. Columns 1, 2, 3 already hold a 1 further down, so only cell 0 is left.
  const grid = parse('....' + '..1.' + '...1' + '.1..');
  assert.equal(M.nakedSingle(grid), null);
  const step = M.hiddenSingle(grid);
  assert.equal(step.kind, 'hidden');
  assert.equal(step.cell, 0);
  assert.equal(step.value, 1);
  assert.equal(step.unit.kind, 'row');
  assert.deepEqual(step.unit.cells, [0, 1, 2, 3]);
  assert.deepEqual(
    [...step.because].sort((a, b) => a - b),
    [6, 13],
  );
  assert.deepEqual(M.nextStep(grid), step);
});

test('nextStep prefers a naked single and stops on clashes or dead ends', () => {
  const naked = parse('12..' + '3...' + '....' + '....');
  assert.equal(M.nextStep(naked).kind, 'naked');
  assert.equal(M.nextStep(parse('1...' + '.1..' + '....' + '....')), null); // a clash
  // Cell 0 sees 2 and 3 in its row, 4 in its column, and 1 in its box: nothing fits.
  const dead = parse('.23.' + '.1..' + '4...' + '....');
  assert.deepEqual(M.candidates(dead)[0], []);
  assert.equal(M.nextStep(dead), null);
  assert.equal(M.countSolutions(dead).count, 0);
});

test('the solver counts completions and stops at the limit', () => {
  const empty = Array(16).fill(0);
  assert.equal(M.countSolutions(empty, 1000).count, 288); // every 4×4 Sudoku grid
  const two = M.countSolutions(empty);
  assert.equal(two.count, 2);
  assert.equal(two.solutions.length, 2);
  for (const s of two.solutions) assert.ok(M.isComplete(s));
  const full = parse('1234' + '3412' + '2143' + '4321');
  assert.ok(M.isComplete(full));
  assert.deepEqual(M.countSolutions(full), { count: 1, solutions: [full] });
  assert.equal(M.countSolutions(parse('11..' + '....' + '....' + '....')).count, 0);
  const grid = parse('1...' + '....' + '....' + '....');
  M.countSolutions(grid);
  assert.deepEqual(grid, parse('1...' + '....' + '....' + '....'), 'the input is not changed');
});

test('the three room puzzles: gentle, fewest clues, and two answers', () => {
  const [gentle, fewest, twice] = M.puzzles.map(parse);
  for (const p of [gentle, fewest, twice]) assert.deepEqual(M.conflicts(p), []);

  assert.equal(gentle.filter(Boolean).length, 8);
  assert.equal(M.countSolutions(gentle).count, 1);
  const g = M.solveBySingles(gentle);
  assert.ok(g.solved);
  assert.deepEqual(g.grid, M.countSolutions(gentle).solutions[0]);

  assert.equal(fewest.filter(Boolean).length, 4);
  assert.equal(M.countSolutions(fewest).count, 1);
  assert.ok(M.solveBySingles(fewest).solved);

  const both = M.countSolutions(twice);
  assert.equal(both.count, 2);
  assert.equal(M.countSolutions(twice, 10).count, 2, 'exactly two, not more');
  // Singles get part of the way, then stop at four cells that can swap.
  const partial = M.solveBySingles(twice);
  assert.equal(partial.solved, false);
  assert.ok(partial.steps.length > 0);
  const diff = M.differences(...both.solutions);
  assert.deepEqual(diff, [0, 3, 4, 7]);
  assert.deepEqual(
    partial.grid.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0),
    diff,
  );
  for (const s of both.solutions) assert.ok(s.every((v, i) => !twice[i] || v === twice[i]));
});

test('no 4×4 puzzle with only three clues has a unique solution', () => {
  const grids = M.countSolutions(Array(16).fill(0), 1000).solutions;
  for (const solution of grids) {
    for (let a = 0; a < 16; a++)
      for (let b = a + 1; b < 16; b++)
        for (let c = b + 1; c < 16; c++) {
          const p = Array(16).fill(0);
          for (const i of [a, b, c]) p[i] = solution[i];
          assert.notEqual(M.countSolutions(p).count, 1);
        }
  }
});

test('singles always agree with the solver', () => {
  let seed = 3;
  const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const grids = M.countSolutions(Array(16).fill(0), 1000).solutions;
  for (let trial = 0; trial < 400; trial++) {
    const solution = grids[Math.floor(random() * grids.length)];
    const p = solution.map((v) => (random() < 0.4 ? v : 0));
    const { count, solutions } = M.countSolutions(p);
    const { grid, steps } = M.solveBySingles(p);
    if (count === 1) for (const s of steps) assert.equal(s.value, solutions[0][s.cell]);
    assert.ok(M.countSolutions(grid).count === count, 'a deduction never loses or gains a solution');
  }
});

test('the Sudoku graph: 16 nodes and 56 edges, 81 and 810 at full size', () => {
  const { nodes, edges } = M.graph(4);
  assert.equal(nodes.length, 16);
  assert.equal(edges.length, 56);
  assert.deepEqual(nodes[6], { cell: 6, row: 1, col: 2, box: 1 });
  const degree = Array(16).fill(0);
  for (const { a, b } of edges) {
    assert.ok(a < b);
    degree[a]++;
    degree[b]++;
  }
  assert.ok(degree.every((d) => d === 7));
  const kinds = (a, b) => edges.find((e) => e.a === a && e.b === b).kinds;
  assert.deepEqual(kinds(0, 1), ['row', 'box']);
  assert.deepEqual(kinds(0, 2), ['row']);
  assert.deepEqual(kinds(0, 8), ['col']);
  assert.deepEqual(kinds(0, 5), ['box']);
  const nine = M.graph(9);
  assert.equal(nine.nodes.length, 81);
  assert.equal(nine.edges.length, 810);
  // A solved board is a proper coloring of its graph; a clash is not.
  const full = parse('1234' + '3412' + '2143' + '4321');
  assert.ok(M.isProperColoring(full, edges));
  assert.ok(!M.isProperColoring(parse('1...' + '.1..' + '....' + '....'), edges));
});

test('the same code solves a classic 9×9 Sudoku', () => {
  const grid = parse(NINE);
  const { count, solutions } = M.countSolutions(grid);
  assert.equal(count, 1);
  assert.equal(format(solutions[0]), NINE_SOLVED);
  assert.ok(M.isProperColoring(solutions[0], M.graph(9).edges));
  const bySingles = M.solveBySingles(grid);
  assert.ok(bySingles.solved);
  assert.equal(format(bySingles.grid), NINE_SOLVED);
});
