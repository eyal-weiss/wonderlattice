import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const R = globalThis.Wonderlattice.models.rhythm;
const str = (p) => p.map((on) => (on ? 'x' : '.')).join('');
const from = (s) => [...s].map((c) => c === 'x');

// Toussaint (2005), section 4, as printed (E(5,16) has one rest too many there; its interval vector (33334) and
// the 16 steps give the string below). Checked by a separate script, not this code.
const TOUSSAINT = {
  '2,3': 'x.x',
  '2,5': 'x.x..',
  '3,4': 'x.xx',
  '3,5': 'x.x.x',
  '3,7': 'x.x.x..',
  '3,8': 'x..x..x.',
  '4,7': 'x.x.x.x',
  '4,9': 'x.x.x.x..',
  '4,11': 'x..x..x..x.',
  '4,12': 'x..x..x..x..',
  '5,6': 'x.xxxx',
  '5,7': 'x.xx.xx',
  '5,8': 'x.xx.xx.',
  '5,9': 'x.x.x.x.x',
  '5,11': 'x.x.x.x.x..',
  '5,12': 'x..x.x..x.x.',
  '5,13': 'x..x.x..x.x..',
  '5,16': 'x..x..x..x..x...',
  '7,8': 'x.xxxxxx',
  '7,12': 'x.xx.x.xx.x.',
  '7,16': 'x..x.x.x..x.x.x.',
  '9,16': 'x.xx.x.x.xx.x.x.',
  '11,24': 'x..x.x.x.x.x..x.x.x.x.x.',
  '13,24': 'x.xx.x.x.x.x.xx.x.x.x.x.',
};

test('Bjorklund’s algorithm gives Toussaint’s table, starting step and all', () => {
  for (const [kn, expected] of Object.entries(TOUSSAINT)) {
    const [k, n] = kn.split(',').map(Number);
    assert.equal(str(R.euclid(k, n)), expected, `E(${k},${n})`);
  }
});

test('the rounds of Bjorklund’s algorithm, as in Toussaint’s E(5,13) and E(5,8) examples', () => {
  const groups = (k, n) => R.rounds(k, n).map((round) => round.map(str).join(' '));
  assert.deepEqual(groups(5, 13), [
    'x x x x x . . . . . . . .',
    'x. x. x. x. x. . . .',
    'x.. x.. x.. x. x.',
    'x..x. x..x. x..',
  ]);
  assert.deepEqual(groups(5, 8), ['x x x x x . . .', 'x. x. x. x x', 'x.x x.x x.']);
  assert.deepEqual(groups(2, 3), ['x x .', 'x. x']);
  assert.deepEqual(groups(4, 4), ['x x x x']);
  assert.deepEqual(groups(0, 5), ['. . . . .']);
});

test('every E(k, n) has k beats in n steps, and gaps that differ by at most one', () => {
  for (let n = 1; n <= 32; n++)
    for (let k = 0; k <= n; k++) {
      const p = R.euclid(k, n);
      assert.equal(p.length, n);
      assert.equal(R.beats(p).length, k);
      if (k) {
        const g = R.gaps(p);
        assert.equal(
          g.reduce((a, b) => a + b),
          n,
        );
        assert.ok(Math.max(...g) - Math.min(...g) <= 1, `E(${k},${n}) gaps ${g}`);
      }
    }
  assert.deepEqual(R.gaps(R.euclid(3, 8)), [3, 3, 2]);
  assert.deepEqual(R.gaps(R.euclid(5, 16)), [3, 3, 3, 3, 4]);
});

test('the pixelated line of slope k/n is a rotation of E(k, n), for every 0 ≤ k ≤ n ≤ 32', () => {
  for (let n = 1; n <= 32; n++)
    for (let k = 0; k <= n; k++) assert.ok(R.isRotationOf(R.line(k, n), R.euclid(k, n)), `k=${k} n=${n}`);
  // The tresillo is the line itself; the cinquillo is the line read from its third column.
  assert.equal(str(R.line(3, 8)), 'x..x..x.');
  assert.equal(str(R.line(5, 8)), 'x.x.xx.x');
  assert.equal(str(R.line(5, 8, 2)), 'x.xx.xx.');
});

test('every turn of every ring can be read off the line, from some column', () => {
  for (let n = 2; n <= 24; n++)
    for (let k = 0; k <= n; k++)
      for (let r = 0; r < n; r++) {
        const p = R.pattern(k, n, r),
          s = R.lineStart(p);
        assert.ok(s >= 0, `k=${k} n=${n} r=${r}`);
        assert.deepEqual(R.line(k, n, s), p);
      }
  assert.equal(R.lineStart(from('x.xx.xx.')), 2);
  assert.equal(R.lineStart(from('x..x..x...x..x..')), 10);
});

test('E(k, n) spreads its beats furthest apart, and only its rotations do (all patterns, n ≤ 14)', () => {
  for (let n = 2; n <= 14; n++) {
    const best = Array(n + 1).fill(-Infinity),
      winners = Array.from({ length: n + 1 }, () => []);
    for (let mask = 0; mask < 1 << n; mask++) {
      const p = Array.from({ length: n }, (_, i) => !!(mask & (1 << i))),
        k = R.beats(p).length,
        d = R.spread(p);
      if (d > best[k] + 1e-9) {
        best[k] = d;
        winners[k] = [p];
      } else if (Math.abs(d - best[k]) <= 1e-9) winners[k].push(p);
    }
    for (let k = 0; k <= n; k++)
      for (const p of winners[k]) assert.ok(R.isRotationOf(p, R.euclid(k, n)), `k=${k} n=${n}: ${str(p)}`);
  }
});

test('rhythms that start on another beat: bossa nova, samba, and the York-Samai', () => {
  const play = (id) => {
    const r = R.RHYTHMS.find((x) => x.id === id);
    return str(R.pattern(r.k, r.n, r.start));
  };
  assert.equal(play('bossa'), 'x..x..x...x..x..'); // E(5,16) started on its third beat
  assert.equal(play('samba'), 'x.x..x.x.x..x.x.'); // E(7,16) started on its last beat
  assert.equal(play('yorkSamai'), 'xxxxx.'); // E(5,6) started on its second beat
  assert.equal(play('tresillo'), 'x..x..x.');
  assert.equal(play('cinquillo'), 'x.xx.xx.');
  assert.equal(play('bell'), 'x.xx.x.xx.x.');
  // Every listed rhythm's start is one of its beats.
  for (const r of R.RHYTHMS) assert.equal(R.euclid(r.k, r.n)[r.start], true, r.id);
});

test('names: one per (k, n), whatever step the ring starts from', () => {
  assert.equal(R.named(3, 8).id, 'tresillo');
  assert.equal(R.named(7, 12).id, 'bell');
  assert.equal(R.named(5, 13), null);
  const keys = R.RHYTHMS.map((r) => `${r.k},${r.n}`);
  assert.equal(new Set(keys).size, keys.length);
  for (const key of keys) assert.ok(TOUSSAINT[key], key);
});

test('other evenly spread patterns: the white keys of a piano, and a clave that isn’t one', () => {
  // C . D . E F . G . A . B: seven of twelve, the same necklace as the West African bell.
  assert.ok(R.isRotationOf(from('x.x.xx.x.x.x'), R.euclid(7, 12)));
  // The son clave has five beats in sixteen, but gaps 3 3 4 2 4: not the most even.
  assert.equal(R.isRotationOf(from('x..x..x...x.x...'), R.euclid(5, 16)), false);
});

test('Euclid’s divisions for 8 and 3, and the greatest common divisor', () => {
  assert.deepEqual(R.divisions(8, 3), [
    [8, 2, 3, 2],
    [3, 1, 2, 1],
    [2, 2, 1, 0],
  ]);
  assert.equal(R.greatest(12, 4), 4);
  assert.equal(R.greatest(16, 5), 1);
  assert.deepEqual(R.divisions(5, 0), []);
});
