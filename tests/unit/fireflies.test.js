import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.fireflies;

/** Average togetherness over the last `keep` seconds of `seconds` simulated at 30 steps a second. */
function settle(coupling, seconds = 60, keep = 20, sunShift = null) {
  let clocks = M.seed(120, 7);
  const rs = [];
  for (let i = 0, n = seconds * 30; i < n; i++) {
    const t = i / 30;
    clocks = M.step(clocks, 1 / 30, coupling, sunShift === null ? null : M.sunPhase(t, sunShift));
    if (t > seconds - keep) rs.push(M.order(clocks).r);
  }
  return rs.reduce((a, b) => a + b) / rs.length;
}

test('fireflies: clocks keep their own time, and every rhythm stays slow', () => {
  const clocks = M.seed(500, 3);
  assert.equal(clocks.length, 500);
  for (const k of clocks) {
    assert.ok(k.freq >= M.LOW && k.freq <= M.HIGH, 'no clock flashes faster than HIGH');
    assert.ok(k.phase >= 0 && k.phase < 2 * Math.PI);
  }
  assert.ok(M.HIGH < 1, 'under one flash a second, far from the 3-a-second flashing limit');
  assert.deepEqual(M.seed(10, 5), M.seed(10, 5), 'the same seed gives the same meadow');
});

test('fireflies: togetherness is about 1/√N by chance with no coupling, and near 1 when strongly coupled', () => {
  const apart = settle(0);
  assert.ok(apart < 0.2, `uncoupled: ${apart}`);
  const strong = settle(3);
  assert.ok(strong > 0.95, `strongly coupled: ${strong}`);
});

test('fireflies: past the critical coupling togetherness rises steeply, but not all at once', () => {
  const below = settle(0.8),
    just = settle(1.15),
    past = settle(1.6);
  assert.ok(below < 0.35, `below threshold: ${below}`);
  assert.ok(just > below + 0.1, `just past: ${just}`);
  assert.ok(past > just, 'more coupling, more together');
  assert.ok(just < 0.8, 'just past the edge it is not yet fully in step: a steep rise, not a switch');
});

test('fireflies: a day–night cycle entrains them, and after a flight they catch up over days, not instantly', () => {
  let clocks = M.seed(120, 7),
    t = 0,
    shift = 0;
  for (; t < 30; t += 1 / 30) clocks = M.step(clocks, 1 / 30, 1.5, M.sunPhase(t, shift));
  assert.ok(Math.abs(M.lag(clocks, M.sunPhase(t, shift))) < 0.3, 'locked to the day before the flight');
  shift += M.FLIGHT;
  const start = t;
  assert.ok(Math.abs(M.lag(clocks, M.sunPhase(t, shift))) > 1.5, 'right after the flight, a third of a day out');
  let caught = null;
  for (; t < start + 30; t += 1 / 30) {
    clocks = M.step(clocks, 1 / 30, 1.5, M.sunPhase(t, shift));
    if (Math.abs(M.lag(clocks, M.sunPhase(t, shift))) < 0.3) {
      caught = (t - start) * M.MEAN; // in days
      break;
    }
  }
  assert.ok(caught !== null, 'they catch up');
  assert.ok(caught > 1.5 && caught < 8, `caught up after ${caught} days`);
});

test('fireflies: the glow rises and fades smoothly around the flash, and is dark for most of the cycle', () => {
  assert.equal(M.glow(0), 1);
  assert.equal(M.glow(Math.PI), 0);
  assert.ok(M.glow(0.3) > 0.5 && M.glow(0.3) < 1, 'no hard switch');
  const lit = Array.from({ length: 360 }, (_, i) => M.glow((i / 360) * 2 * Math.PI)).filter((g) => g > 0.1).length;
  assert.ok(lit < 120, 'lit for well under half of each cycle');
});
