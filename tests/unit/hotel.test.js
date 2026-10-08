import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.hotel;

test('every moving card is one-to-one and frees the rooms it promises', () => {
  for (const card of Object.keys(M.CARDS)) {
    const rooms = Array.from({ length: 500 }, (_, k) => M.moveTo(card, k + 1));
    assert.equal(new Set(rooms).size, rooms.length, `${card}: two guests would share a room`);
  }
  assert.deepEqual(M.freed('one', 200), [1]);
  assert.deepEqual(M.freed('five', 200), [1, 2, 3, 4, 5]);
  const odd = M.freed('double', 200);
  assert.equal(odd.length, 100);
  assert.ok(odd.every((n) => n % 2 === 1));
  assert.equal(M.freedCount('one'), 1);
  assert.equal(M.freedCount('five'), 5);
  assert.equal(M.freedCount('double'), Infinity);
});

test('one guest fits with any card; an endless coach fits only with ×2', () => {
  for (const card of Object.keys(M.CARDS)) assert.equal(M.newcomerRoom(card, 1), 1);
  // +1 seats the first passenger and +5 the first five; everyone after them still waits.
  assert.equal(M.newcomerRoom('one', 2), 0);
  assert.deepEqual(
    [1, 2, 3, 4, 5, 6].map((j) => M.newcomerRoom('five', j)),
    [1, 2, 3, 4, 5, 0],
  );
  // ×2: passenger j takes odd room 2j − 1, and no room is given twice, to a guest or a passenger.
  const given = new Set();
  for (let j = 1; j <= 300; j++) {
    const room = M.newcomerRoom('double', j);
    assert.equal(room, 2 * j - 1);
    given.add(room);
    given.add(M.moveTo('double', j));
  }
  assert.equal(given.size, 600);
});

// Rooms from a separate program that walked the grid's anti-diagonals back and forth, cell by cell.
test('the zigzag gives every (row, seat) its own room, and every room someone', () => {
  assert.deepEqual(
    [1, 2, 3, 4, 5, 6].map((s) => M.zigzag(0, s)),
    [1, 2, 6, 7, 15, 16],
  );
  assert.deepEqual(
    [1, 2, 3, 4, 5, 6].map((s) => M.zigzag(1, s)),
    [3, 5, 8, 14, 17, 27],
  );
  assert.deepEqual(
    [1, 2, 3, 4].map((s) => M.zigzag(2, s)),
    [4, 9, 13, 18],
  );
  assert.equal(M.zigzag(3, 1), 10);
  const seen = new Set();
  for (let row = 0; row < 60; row++)
    for (let seat = 1; seat + row <= 60; seat++) {
      const n = M.zigzag(row, seat);
      assert.ok(!seen.has(n));
      seen.add(n);
      assert.deepEqual(M.unzig(n), { row, seat });
    }
  // The first 1,830 rooms are exactly the first 60 diagonals: none skipped.
  assert.equal(seen.size, 1830);
  assert.equal(Math.max(...seen), 1830);
  for (let n = 1; n <= 20000; n++) {
    const { row, seat } = M.unzig(n);
    assert.equal(M.zigzag(row, seat), n);
  }
});

test('×2 with coaches waiting fits the hotel and coach 1, and leaves coach 2 outside', () => {
  assert.deepEqual(
    [1, 2, 3].map((s) => M.doubleRoom(0, s)),
    [2, 4, 6],
  );
  assert.deepEqual(
    [1, 2, 3].map((s) => M.doubleRoom(1, s)),
    [1, 3, 5],
  );
  assert.equal(M.doubleRoom(2, 1), 0);
});

test('a list travels in two numbers and comes back the same', () => {
  for (let seed = 1; seed < 200; seed++) {
    const [low, high] = M.randomNumbers(seed);
    const list = M.listFrom(low, high);
    assert.equal(list.length, M.SIZE);
    assert.ok(list.every((row) => row.length === M.SIZE && row.every((bit) => bit === 0 || bit === 1)));
    assert.deepEqual(M.numbersOf(list), [low, high]);
  }
  assert.deepEqual(M.numbersOf(M.listFrom(0, 0)), [0, 0]);
  assert.deepEqual(M.numbersOf(M.listFrom(4294967295, 4294967295)), [4294967295, 4294967295]);
});

test('the diagonal passenger differs from room k’s guest at flip k, whatever the list', () => {
  for (let seed = 1; seed < 2000; seed++) {
    const list = M.listFrom(...M.randomNumbers(seed));
    const passenger = M.diagonal(list);
    list.forEach((row, k) => {
      assert.notEqual(passenger[k], row[k]);
      assert.ok(M.firstDifference(row, passenger) <= k);
    });
    assert.equal(M.listed(list, passenger), false);
  }
  // Every one of the 256 possible first rows: the passenger's first flip is always the other one.
  for (let byte = 0; byte < 256; byte++) assert.notEqual(M.diagonal(M.listFrom(byte, 0))[0], byte & 1);
});

test('“everyone +1” seats the left-out passenger, and the diagonal makes a new one', () => {
  let list = M.listFrom(...M.randomNumbers(7));
  for (let round = 0; round < 20; round++) {
    const passenger = M.diagonal(list);
    list = M.admit(list, passenger);
    assert.deepEqual(list[0], passenger);
    assert.equal(list.length, M.SIZE);
    assert.ok(M.listed(list, passenger));
    const next = M.diagonal(list);
    assert.equal(M.listed(list, next), false);
    assert.notEqual(next[0], passenger[0]);
  }
});

test('toggling a flip makes a new list and leaves the old one alone', () => {
  const list = M.listFrom(0, 0);
  const changed = M.toggle(list, 2, 5);
  assert.equal(list[2][5], 0);
  assert.equal(changed[2][5], 1);
  assert.equal(M.diagonal(changed)[2], 1);
  assert.equal(M.diagonal(M.toggle(list, 2, 2))[2], 0);
});
