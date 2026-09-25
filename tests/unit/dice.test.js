import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const { SETS, reduce, outcomes, exact, bestReply, victories, mean, rng, play } = globalThis.Wonderlattice.models.dice;
const set = (id) => SETS.find((s) => s.id === id);

/** Exact chance that die i beats die j, as a reduced fraction [n, d]. */
const beats = (s, i, j, copies = 1) => {
  const e = exact(s.dice[i], s.dice[j], copies);
  return reduce(e.win, e.total);
};

test('exact counting covers every pair of faces', () => {
  const [a, b] = set('three').dice;
  assert.deepEqual(exact(a, b), { win: 20, lose: 16, tie: 0, total: 36 });
  assert.equal(outcomes(a).length, 6);
  assert.equal(outcomes(a, 2).length, 36);
  assert.deepEqual(exact(a, a), { win: 12, lose: 12, tie: 12, total: 36 });
  assert.deepEqual(reduce(20, 36), [5, 9]);
  assert.deepEqual(reduce(0, 36), [0, 1]);
});

test('three dice: each beats the next with probability 5/9, in a circle', () => {
  const s = set('three');
  assert.deepEqual(s.dice, [
    [2, 2, 4, 4, 9, 9],
    [1, 1, 6, 6, 8, 8],
    [3, 3, 5, 5, 7, 7],
  ]);
  assert.deepEqual(beats(s, 0, 1), [5, 9]); // A beats B
  assert.deepEqual(beats(s, 1, 2), [5, 9]); // B beats C
  assert.deepEqual(beats(s, 2, 0), [5, 9]); // C beats A
  assert.deepEqual(beats(s, 1, 0), [4, 9]);
  assert.deepEqual(beats(s, 2, 1), [4, 9]);
  assert.deepEqual(beats(s, 0, 2), [4, 9]);
  // Same average, so "better on average" can't be what decides it.
  assert.deepEqual(s.dice.map(mean), [5, 5, 5]);
});

test("Efron's four dice: each beats the next with probability 2/3, A > B > C > D > A", () => {
  const s = set('efron');
  assert.deepEqual(s.dice, [
    [4, 4, 4, 4, 0, 0],
    [3, 3, 3, 3, 3, 3],
    [6, 6, 2, 2, 2, 2],
    [5, 5, 5, 1, 1, 1],
  ]);
  for (let i = 0; i < 4; i++) assert.deepEqual(beats(s, i, (i + 1) % 4), [2, 3], `die ${i} vs the next`);
  // The two pairs across the circle.
  assert.deepEqual(beats(s, 2, 0), [5, 9]); // C beats A
  assert.deepEqual(beats(s, 1, 3), [1, 2]); // B and D are even
  assert.deepEqual(beats(s, 3, 1), [1, 2]);
  // C has the highest average, yet B, which always shows 3, beats it two times in three.
  assert.ok(mean(s.dice[2]) > mean(s.dice[1]));
  assert.deepEqual(beats(s, 1, 2), [2, 3]);
  // No ties between different dice.
  for (const v of victories(s)) assert.equal(v.tie, 0);
});

test("Grime's dice reverse their circle when you roll two of each", () => {
  const s = set('grime');
  assert.ok(s.twoDice);
  // One die each: red > blue > olive > red.
  assert.deepEqual(beats(s, 0, 1), [7, 12]);
  assert.deepEqual(beats(s, 1, 2), [7, 12]);
  assert.deepEqual(beats(s, 2, 0), [25, 36]);
  // Two dice each, adding the pair: every arrow flips.
  assert.deepEqual(beats(s, 1, 0, 2), [85, 144]);
  assert.deepEqual(beats(s, 2, 1, 2), [85, 144]);
  assert.deepEqual(beats(s, 0, 2, 2), [671, 1296]);
  for (const copies of [1, 2]) for (const v of victories(s, copies)) assert.equal(v.tie, 0);
});

test('the victory list names every pair once, winner first', () => {
  for (const s of SETS) {
    const n = s.dice.length;
    const list = victories(s);
    assert.equal(list.length, (n * (n - 1)) / 2);
    for (const v of list) {
      assert.ok(v.win >= v.lose);
      assert.equal(v.win + v.lose + v.tie, v.total);
      assert.equal(v.even, v.win === v.lose);
    }
    // The cycle arrows follow the listed order: die i beats die i + 1.
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const v = list.find((e) => (e.winner === i && e.loser === j) || (e.winner === j && e.loser === i));
      assert.equal(v.winner, i, `${s.id}: ${i} should beat ${j}`);
    }
  }
});

test("the room's reply always beats the visitor's die", () => {
  for (const s of SETS) {
    for (const copies of s.twoDice ? [1, 2] : [1]) {
      for (let i = 0; i < s.dice.length; i++) {
        const reply = bestReply(s, i, copies);
        assert.notEqual(reply.index, i);
        const e = exact(s.dice[reply.index], s.dice[i], copies);
        assert.deepEqual([reply.win, reply.lose, reply.total], [e.win, e.lose, e.total]);
        assert.ok(e.win > e.lose, `${s.id} ×${copies}: reply to ${i} must win more than it loses`);
        assert.ok(e.win / e.total > 0.5);
      }
    }
  }
  // In the three-dice set the reply is the die before yours in the circle.
  assert.deepEqual(
    [0, 1, 2].map((i) => bestReply(set('three'), i).index),
    [2, 0, 1],
  );
  // With two of Grime's dice the reply goes the other way round.
  assert.deepEqual(
    [0, 1, 2].map((i) => bestReply(set('grime'), i, 2).index),
    [1, 2, 0],
  );
});

test('the random generator is deterministic and uniform enough', () => {
  const a = rng(42),
    b = rng(42),
    c = rng(43);
  const first = Array.from({ length: 5 }, a);
  assert.deepEqual(first, Array.from({ length: 5 }, b));
  assert.notDeepEqual(first, Array.from({ length: 5 }, c));
  const r = rng(7),
    counts = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < 60000; i++) {
    const x = r();
    assert.ok(x >= 0 && x < 1);
    counts[Math.floor(x * 6)]++;
  }
  for (const n of counts) assert.ok(Math.abs(n - 10000) < 400, `face count ${n}`);
});

test('a round reports faces, totals, and the winner', () => {
  const [a, b] = set('three').dice;
  const round = play(a, b, 1, rng(1));
  assert.equal(round.a.length, 1);
  assert.equal(round.totalA, a[round.a[0]]);
  assert.equal(round.totalB, b[round.b[0]]);
  assert.equal(round.result, Math.sign(round.totalA - round.totalB));
  const two = play(a, b, 2, rng(1));
  assert.equal(two.a.length, 2);
  assert.equal(two.totalA, a[two.a[0]] + a[two.a[1]]);
  assert.deepEqual(play(a, b, 1, rng(9)), play(a, b, 1, rng(9)));
});

test('simulated win rates approach the exact values', () => {
  const random = rng(2026);
  for (const s of SETS) {
    for (const copies of s.twoDice ? [1, 2] : [1]) {
      for (const v of victories(s, copies)) {
        let wins = 0;
        const rounds = 20000;
        for (let k = 0; k < rounds; k++) {
          if (play(s.dice[v.winner], s.dice[v.loser], copies, random).result > 0) wins++;
        }
        const gap = Math.abs(wins / rounds - v.win / v.total);
        assert.ok(gap < 0.015, `${s.id} ×${copies}: ${v.winner} vs ${v.loser} off by ${gap}`);
      }
    }
  }
});
