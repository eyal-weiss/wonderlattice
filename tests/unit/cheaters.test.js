import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.cheaters;
const N = M.SIZE * M.SIZE;
const middle = (M.SIZE >> 1) * M.SIZE + (M.SIZE >> 1);
const cheaters = (grid) => N - M.cooperators(grid);

/** Run a grid forward, with everyone switching at once. */
function run(grid, b, generations) {
  for (let g = 0; g < generations; g++) M.step(grid, b);
  return grid;
}

test('payoffs: a lone cheater scores 8b, its neighbours 8, cooperators beyond them 9, a corner 4', () => {
  const grid = M.startOne(M.create());
  const b = 1.85;
  assert.equal(M.scoreOf(grid, b, middle), 8 * b);
  assert.equal(M.scoreOf(grid, b, middle + 1), 8);
  assert.equal(M.scoreOf(grid, b, middle - M.SIZE - 1), 8);
  assert.equal(M.scoreOf(grid, b, middle + 2), 9);
  // Edges are fixed: a corner cooperator meets three neighbours and itself.
  assert.equal(M.scoreOf(grid, b, 0), 4);
  assert.equal(M.scoreOf(grid, b, N - 1), 4);
  // Two cheaters side by side: each earns b from its seven cooperating neighbours, nothing from the other.
  M.toggle(grid, middle + 1);
  assert.equal(M.scoreOf(grid, b, middle), 7 * b);
  assert.equal(M.scoreOf(grid, b, middle + 1), 7 * b);
});

// Cheaters after generations 1, 2, 3, 10, 30, 100 and 217 from one cheater, at a temptation between 1.8 and 2.
// The same numbers came from an independent program (numpy, written separately), which also matched every cell of
// the first 300 generations, from this start and from a crowd, at temptations 1.3, 1.6, 1.85, 2.1 and 2.3.
const KALEIDOSCOPE = { 1: 9, 2: 25, 3: 41, 10: 253, 30: 2437, 100: 7181, 217: 5881 };

test('one cheater blooms into a kaleidoscope with the square’s full symmetry at every step', () => {
  const grid = M.startOne(M.create());
  for (let g = 1; g <= 300; g++) {
    M.step(grid, 1.85);
    assert.ok(M.symmetric(grid), `symmetric at generation ${g}`);
    if (KALEIDOSCOPE[g] !== undefined) assert.equal(cheaters(grid), KALEIDOSCOPE[g], `cheaters at generation ${g}`);
  }
  // It keeps changing: still not settled after 300 generations.
  assert.equal(M.settled(grid, 1.85), false);
});

test('every temptation between 1.8 and 2 gives exactly the same pictures', () => {
  const reference = run(M.startOne(M.create()), 1.85, 217);
  for (const b of [1.81, 1.9, 1.99]) {
    const grid = run(M.startOne(M.create()), b, 217);
    assert.deepEqual(grid.c, reference.c, `temptation ${b}`);
  }
});

test('with little temptation the lone cheater stays small; with more, its blob freezes; with much more, it takes most', () => {
  // Below 9/8 it can't even convert its neighbours.
  const alone = run(M.startOne(M.create()), 1.1, 50);
  assert.equal(cheaters(alone), 1);
  assert.ok(M.settled(alone, 1.1));
  // Just above 9/8, a 3 × 3 block that blinks: 9 cheaters, then 1, then 9 …
  const blink = run(M.startOne(M.create()), 1.3, 50);
  assert.equal(cheaters(blink), 1);
  M.step(blink, 1.3);
  assert.equal(cheaters(blink), 9);
  assert.equal(M.settled(blink, 1.3), false);
  // Between about 1.6 and 1.8, the block freezes.
  const block = run(M.startOne(M.create()), 1.7, 50);
  assert.equal(cheaters(block), 9);
  assert.ok(M.settled(block, 1.7));
  // Just above 2, a symmetric blob of 905 cheaters that stops growing; above 9/4, one of 7,829.
  const blob = run(M.startOne(M.create()), 2.1, 200);
  assert.equal(cheaters(blob), 905);
  assert.ok(M.settled(blob, 2.1));
  assert.ok(M.symmetric(blob));
  const most = run(M.startOne(M.create()), 2.3, 200);
  assert.equal(cheaters(most), 7829);
  assert.ok(M.settled(most, 2.3));
});

test('from random crowds in the chaotic window, about a third keep cooperating', () => {
  assert.ok(Math.abs(M.ESTIMATE - 0.318) < 0.001, 'Nowak and May’s 12 ln 2 − 8');
  for (const seed of [1, 2, 3]) {
    const grid = M.startCrowd(M.create(), 0.1, seed);
    run(grid, 1.85, 300);
    let sum = 0;
    for (let g = 0; g < 300; g++) {
      M.step(grid, 1.85);
      sum += M.cooperators(grid) / N;
    }
    const mean = sum / 300;
    // The independent program gave 0.324 to 0.328 over generations 300 to 600, for four random crowds.
    assert.ok(mean > 0.29 && mean < 0.36, `seed ${seed}: mean share ${mean.toFixed(3)}`);
  }
});

test('outside the window, crowds go one way or the other', () => {
  const low = run(M.startCrowd(M.create(), 0.1, 5), 1.3, 300);
  assert.ok(M.cooperators(low) / N > 0.8, 'at 1.3 cooperators hold most of the grid');
  const high = run(M.startCrowd(M.create(), 0.1, 5), 2.3, 300);
  assert.ok(M.cooperators(high) / N < 0.01, 'at 2.3 cheaters take nearly everything');
});

test('switching one at a time: at 1.85 the cheaters take over; at 1.6 cooperators survive', () => {
  const one = M.startOne(M.create());
  const random = M.rng(7);
  let g = 0;
  while (M.cooperators(one) > 0 && g < 400) {
    M.stepOneByOne(one, 1.85, random);
    g++;
  }
  assert.equal(M.cooperators(one), 0, 'every player cheats');
  assert.ok(g < 300, `all cheaters by generation ${g}`);
  assert.ok(M.settled(one, 1.85));

  const crowd = M.startCrowd(M.create(), 0.1, 3);
  const random2 = M.rng(9);
  for (let k = 0; k < 200; k++) M.stepOneByOne(crowd, 1.6, random2);
  const share = M.cooperators(crowd) / N;
  assert.ok(share > 0.5 && share < 0.75, `share cooperating ${share.toFixed(3)}`);
});

test('one at a time keeps the scores up to date as players switch', () => {
  const grid = M.startCrowd(M.create(), 0.3, 11);
  M.stepOneByOne(grid, 1.85, M.rng(1));
  for (let i = 0; i < N; i++) assert.equal(grid.score[i], M.scoreOf(grid, 1.85, i), `score of cell ${i}`);
});

test('players who just switched are remembered; a cell switched by hand is not', () => {
  const grid = M.startOne(M.create());
  M.step(grid, 1.85);
  // The eight neighbours of the middle have just become cheaters; the middle was one already.
  assert.equal(grid.was[middle], 0);
  assert.equal(grid.c[middle + 1], 0);
  assert.equal(grid.was[middle + 1], 1);
  M.toggle(grid, 0);
  assert.equal(grid.c[0], 0);
  assert.equal(grid.was[0], 0);
  assert.equal(grid.gen, 1);
});

test('ties keep a player’s own strategy; otherwise the best scorer nearby wins', () => {
  // At b = 1.5, a cheater with two cooperating neighbours scores 3, like a cooperator in a block of three.
  // Small random grids give many such ties; each choice is checked against the neighbourhood worked out here.
  const b = 1.5;
  let ties = 0,
    switches = 0;
  for (let seed = 1; seed <= 200; seed++) {
    const grid = M.startCrowd(M.create(6), 0.5, seed);
    M.scoreAll(grid, b);
    for (let i = 0; i < 36; i++) {
      const x = i % 6,
        y = Math.floor(i / 6);
      let bestC = -1,
        bestD = -1;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          if (x + dx < 0 || x + dx > 5 || y + dy < 0 || y + dy > 5) continue;
          const j = (y + dy) * 6 + x + dx;
          if (grid.c[j]) bestC = Math.max(bestC, grid.score[j]);
          else bestD = Math.max(bestD, grid.score[j]);
        }
      const expected = bestC === bestD ? grid.c[i] : bestC > bestD ? 1 : 0;
      assert.equal(M.choose(grid, i), expected, `seed ${seed}, cell ${i}`);
      if (bestC === bestD) ties++;
      if (expected !== grid.c[i]) switches++;
    }
  }
  assert.ok(ties > 20, `${ties} ties checked`);
  assert.ok(switches > 100, `${switches} switches checked`);
});

test('a grid that no rule would change has settled', () => {
  assert.equal(M.settled(M.startOne(M.create()), 1.1), true);
  assert.equal(M.settled(M.startOne(M.create()), 1.85), false);
});

test('the same seed draws the same crowd', () => {
  const a = M.startCrowd(M.create(), 0.1, 42),
    b = M.startCrowd(M.create(), 0.1, 42),
    c = M.startCrowd(M.create(), 0.1, 43);
  assert.deepEqual(a.c, b.c);
  assert.notDeepEqual(a.c, c.c);
  const share = 1 - M.cooperators(a) / N;
  assert.ok(share > 0.08 && share < 0.12);
});
