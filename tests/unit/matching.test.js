import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.matching;
const N = M.N;
const isPermutation = (list) => [...list].sort((a, b) => a - b).every((x, i) => x === i);

/** Students ask (partner: student → club) and clubs ask (turned round to student → club). */
function both(w) {
  const students = M.defer(w.students, w.clubs);
  const clubs = M.defer(w.clubs, w.students);
  return { students, clubs, clubsAsk: M.invert(clubs.partner) };
}

// The numbers for the three hand-picked sets of wishes came from an independent program (Python, written separately
// from the room), which also tried all 720 pairings for each.
test('tangled wishes: asking first decides almost everything', () => {
  const w = M.wishes(0);
  const { students, clubs, clubsAsk } = both(w);
  assert.deepEqual(students.partner, [5, 4, 1, 3, 2, 0]);
  assert.equal(students.rounds.length, 3);
  assert.equal(students.applications, 8);
  assert.deepEqual(M.choices(w.students, students.partner), [1, 1, 1, 3, 1, 1]);
  assert.deepEqual(M.choices(w.clubs, students.held), [4, 2, 4, 5, 5, 6]);
  assert.deepEqual(clubsAsk, [0, 2, 4, 5, 1, 3]);
  assert.equal(clubs.rounds.length, 3);
  assert.equal(clubs.applications, 8);
  assert.deepEqual(M.choices(w.students, clubsAsk), [5, 2, 5, 5, 5, 5]);
  assert.deepEqual(M.choices(w.clubs, clubs.partner), [1, 1, 1, 1, 1, 3]);
  assert.equal(M.allStable(w).length, 5);
  // Every pair changes when the clubs ask instead.
  assert.ok(students.partner.every((c, s) => c !== clubsAsk[s]));
});

test('tangled wishes, round by round: two students are turned away before everyone settles', () => {
  const { rounds } = M.defer(M.wishes(0).students, M.wishes(0).clubs);
  assert.deepEqual(rounds[0].asks, [
    [0, 5],
    [1, 4],
    [2, 1],
    [3, 1],
    [4, 2],
    [5, 0],
  ]);
  assert.deepEqual(rounds[0].dropped, [[3, 1]]); // club 1 keeps student 2
  assert.deepEqual(rounds[1].asks, [[3, 2]]);
  assert.deepEqual(rounds[1].dropped, [[3, 2]]); // club 2 keeps student 4
  assert.deepEqual(rounds[2].asks, [[3, 3]]);
  assert.deepEqual(rounds[2].dropped, []);
  assert.deepEqual(rounds[2].held, [5, 2, 4, 3, 1, 0]);
});

test('one shared ranking: only one stable pairing, so it makes no difference who asks', () => {
  const w = M.wishes(1);
  const { students, clubs, clubsAsk } = both(w);
  assert.equal(M.allStable(w).length, 1);
  assert.deepEqual(students.partner, [5, 4, 1, 2, 3, 0]);
  assert.deepEqual(clubsAsk, students.partner);
  assert.equal(students.rounds.length, 3);
  assert.equal(clubs.rounds.length, 6);
  assert.equal(clubs.applications, 21);
});

test('opposite wishes: one side gets every first choice and the other every last, then they swap', () => {
  const w = M.wishes(2);
  const { students, clubs, clubsAsk } = both(w);
  assert.equal(M.allStable(w).length, 6);
  assert.deepEqual(students.partner, [0, 1, 2, 3, 4, 5]);
  assert.deepEqual(M.choices(w.students, students.partner), [1, 1, 1, 1, 1, 1]);
  assert.deepEqual(M.choices(w.clubs, students.held), [6, 6, 6, 6, 6, 6]);
  assert.deepEqual(M.choices(w.students, clubsAsk), [6, 6, 6, 6, 6, 6]);
  assert.deepEqual(M.choices(w.clubs, clubs.partner), [1, 1, 1, 1, 1, 1]);
  assert.equal(students.rounds.length, 1);
  assert.equal(clubs.rounds.length, 1);
});

test('shuffled wishes come back the same from the same number, and are proper rankings', () => {
  assert.deepEqual(M.wishes(1234), M.wishes(1234));
  assert.notDeepEqual(M.wishes(1234), M.wishes(1235));
  for (const id of [3, 99, 9999]) {
    const w = M.wishes(id);
    assert.equal(w.students.length, N);
    assert.ok([...w.students, ...w.clubs].every(isPermutation));
  }
});

test('for any wishes, the askers get their best stable partner and everyone asked their worst', () => {
  for (let id = 3; id < 400; id++) {
    const w = M.wishes(id);
    const all = M.allStable(w);
    assert.ok(all.length >= 1, `wishes ${id} have a stable pairing`);
    const { students, clubs, clubsAsk } = both(w);
    assert.ok(M.stable(w, students.partner) && M.stable(w, clubsAsk), `wishes ${id}: both results are stable`);
    for (let s = 0; s < N; s++) {
      const places = all.map((p) => w.students[s].indexOf(p[s]));
      assert.equal(w.students[s].indexOf(students.partner[s]), Math.min(...places), `wishes ${id}, student ${s}`);
      assert.equal(w.students[s].indexOf(clubsAsk[s]), Math.max(...places), `wishes ${id}, student ${s}`);
    }
    for (let c = 0; c < N; c++) {
      const places = all.map((p) => w.clubs[c].indexOf(p.indexOf(c)));
      assert.equal(w.clubs[c].indexOf(clubs.partner[c]), Math.min(...places), `wishes ${id}, club ${c}`);
      assert.equal(w.clubs[c].indexOf(students.held[c]), Math.max(...places), `wishes ${id}, club ${c}`);
    }
    // Gale and Shapley's bound on rounds, and the bound on applications (n² − n + 1).
    assert.ok(students.rounds.length <= N * N - 2 * N + 2 && clubs.rounds.length <= N * N - 2 * N + 2);
    assert.ok(students.applications <= N * N - N + 1 && clubs.applications <= N * N - N + 1);
  }
});

test('with three of each, every possible set of wishes: at most 5 rounds and 7 applications, both reached', () => {
  const perms = [
    [0, 1, 2],
    [0, 2, 1],
    [1, 0, 2],
    [1, 2, 0],
    [2, 0, 1],
    [2, 1, 0],
  ];
  const sides = [];
  for (const a of perms) for (const b of perms) for (const c of perms) sides.push([a, b, c]);
  let rounds = 0,
    applications = 0;
  for (const askers of sides)
    for (const takers of sides) {
      const run = M.defer(askers, takers);
      rounds = Math.max(rounds, run.rounds.length);
      applications = Math.max(applications, run.applications);
    }
  // n² − 2n + 2 = 5 and n² − n + 1 = 7 for n = 3, the same as the independent program found.
  assert.equal(rounds, 5);
  assert.equal(applications, 7);
});

test('pairing two people by hand: their old partners pair up, and blocking pairs are found', () => {
  const w = M.wishes(0);
  const best = M.defer(w.students, w.clubs).partner; // [5, 4, 1, 3, 2, 0]
  const mine = M.pair(best, 0, 4); // student 0 takes club 4; student 1, who had it, takes club 5
  assert.deepEqual(mine, [4, 5, 1, 3, 2, 0]);
  assert.ok(isPermutation(mine));
  // Three pairs would both rather swap (the independent program found the same): student 0 with club 2, and
  // student 1, now at its last choice, with clubs 2 and 3.
  assert.deepEqual(M.blocking(w, mine), [
    [0, 2],
    [1, 2],
    [1, 3],
  ]);
  assert.ok(!M.stable(w, mine));
  assert.ok(M.same(M.pair(mine, 0, 5), best));
  assert.deepEqual(M.blocking(w, best), []);
});

test('stable partners: everyone’s partner in every stable pairing, and the extremes are the two asking results', () => {
  const w = M.wishes(0);
  const marks = M.stablePartners(w);
  // From the independent program: student 0 can have clubs 5, 2, 4 or 0; student 1 clubs 4 or 2.
  assert.deepEqual([...marks.students[0]].sort(), [0, 2, 4, 5]);
  assert.deepEqual([...marks.students[1]].sort(), [2, 4]);
  assert.equal(
    marks.students.reduce((sum, set) => sum + set.size, 0),
    marks.clubs.reduce((sum, set) => sum + set.size, 0),
  );
  assert.equal(M.average(w.students, [5, 4, 1, 3, 2, 0]), 8 / 6);
});
