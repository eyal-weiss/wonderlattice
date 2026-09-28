import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const { posterior, perThousand, island } = globalThis.Wonderlattice.models.treasure;
const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);

test('a beep means treasure only 28% of the time when treasure is rare (2%) and the detector 95% right', () => {
  near(posterior(0.02, 0.95), 0.019 / (0.019 + 0.049));
  assert.ok(posterior(0.02, 0.95) < 0.3);
  // A second, independent detector: 0.02·0.95² / (0.02·0.95² + 0.98·0.05²) ≈ 88%.
  near(posterior(0.02, 0.95, 2), (0.02 * 0.9025) / (0.02 * 0.9025 + 0.98 * 0.0025));
});

test('Bayes’ rule agrees with counting squares', () => {
  for (const [r, a, d] of [
    [0.02, 0.95, 1],
    [0.3, 0.9, 1],
    [0.01, 0.99, 2],
    [0.5, 0.7, 1],
  ]) {
    const n = perThousand(r, a, d, 1e7);
    near(n.found / (n.found + n.falseAlarms), posterior(r, a, d), 1e-4);
    assert.equal(n.treasure, n.found + n.missed);
    assert.equal(n.total, n.treasure + n.falseAlarms + n.quiet);
  }
});

test('edge cases: no treasure, all treasure, and a coin-flip detector', () => {
  assert.equal(posterior(0, 0.95), 0);
  assert.equal(posterior(1, 0.95), 1);
  near(posterior(0.2, 0.5), 0.2); // a detector that guesses tells you nothing: the beep leaves the odds as they were
  assert.equal(posterior(0, 1), 0); // no treasure and no false alarms: nothing to divide
});

test('an island holds the expected counts, the same for the same seed', () => {
  const settings = { cols: 20, rows: 13, r: 0.05, a: 0.9, seed: 4 };
  const one = island(settings),
    two = island(settings);
  assert.deepEqual([...one.beeps], [...two.beeps]);
  const n = one.counts;
  assert.equal(one.treasure.size, n.treasure);
  assert.equal(one.beeps.size, n.found + n.falseAlarms);
  for (const i of [...one.treasure, ...one.beeps]) assert.ok(one.land.has(i));
  const beepsOverTreasure = [...one.beeps].filter((i) => one.treasure.has(i)).length;
  assert.equal(beepsOverTreasure, n.found);
  assert.ok(one.land.size > 90 && one.land.size < 20 * 13);
  assert.notDeepEqual([...island({ ...settings, seed: 5 }).beeps], [...one.beeps]);
});
