import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.phases;
const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) <= eps * Math.max(1, Math.abs(b)), `${a} ≈ ${b}`);
const angles = Array.from({ length: 97 }, (_, j) => (j / 97) * 2 * Math.PI - 1);

// The numbers below were recomputed independently, in Python, by sampling the currents over a cycle: the return
// current's rms value, the total power's swing, and the field's strength and direction.

test('with equal loads, the three currents add up to zero at every instant', () => {
  for (const theta of angles) {
    near(M.returning([1, 1, 1], theta), 0);
    near(M.returning([0.4, 0.4, 0.4], theta), 0);
    // sin θ + sin(θ − 120°) + sin(θ + 120°) = 0: the third phase is 240° behind, which is 120° ahead.
    near(Math.sin(theta) + Math.sin(theta - (2 * Math.PI) / 3) + Math.sin(theta + (2 * Math.PI) / 3), 0);
  }
  near(M.returnAmps([1, 1, 1]), 0);
  near(M.sum([1, 1, 1]).x, 0);
  near(M.sum([1, 1, 1]).y, 0);
});

test('the return current is the three arrows added head to tail', () => {
  near(M.returnAmps([2, 1, 1]), 100); // kettles on one phase: the extra 100 A comes back
  near(M.returnAmps([1, 1, 0]), 100); // one phase switched off
  near(M.returnAmps([0, 0, 1]), 100); // a single phase: it all comes back
  near(M.returnAmps([2, 2, 0]), 200);
  near(M.returnAmps([1, 0.5, 0]), 86.60254037844386);
  near(M.returnAmps([1.5, 1, 0.5]), 86.60254037844386);
  // The arrows' sum is the return current at every instant: its shadow, as the currents are their arrows' shadows.
  for (const loads of [
    [2, 1, 1],
    [1, 0.5, 0],
    [0.3, 1.7, 1.1],
  ]) {
    const { x, y } = M.sum(loads);
    for (const theta of angles) near(M.returning(loads, theta), Math.hypot(x, y) * Math.sin(theta + Math.atan2(y, x)));
  }
});

test('each phase flickers, but with equal loads the total power never does', () => {
  for (const theta of angles) {
    near(M.totalPower([1, 1, 1], theta), 1.5);
    near(M.totalPower([0.5, 0.5, 0.5], theta), 0.75);
  }
  // One phase alone swings from nothing to its peak, twice a cycle.
  near(M.power(1, 0, 0), 0);
  near(M.power(1, 0, Math.PI / 2), 1);
  near(M.power(1, 0, Math.PI), 0);
  near(M.ripple([1, 1, 1]), 0);
  near(M.ripple([2, 1, 1]), 0.25);
  near(M.ripple([1, 1, 0]), 0.5);
  near(M.ripple([1.5, 1, 0.5]), 0.28867513459481287);
  near(M.meanPower([2, 1, 1]), 2);
  near(M.ripple([0, 0, 0]), 0);
});

test('three coils make a field of constant strength that turns once per cycle, backwards with two wires swapped', () => {
  for (const theta of angles) {
    const f = M.field([1, 1, 1], theta);
    near(Math.hypot(f.x, f.y), 1.5);
    // It points at θ − 90°: it turns with the currents.
    near(Math.cos(Math.atan2(f.y, f.x) - (theta - Math.PI / 2)), 1);
    const back = M.field([1, 1, 1], theta, true);
    near(Math.hypot(back.x, back.y), 1.5);
    near(Math.cos(Math.atan2(back.y, back.x) + (theta - Math.PI / 2)), 1);
  }
  const balanced = M.fieldRange([1, 1, 1]);
  near(balanced.most, 1.5, 1e-6);
  near(balanced.least, 1.5, 1e-6);
  // Unequal currents: it still turns, but its strength wobbles between two values.
  const kettles = M.fieldRange([2, 1, 1]);
  near(kettles.most, 2.5, 1e-4);
  near(kettles.least, 1.5, 1e-4);
  const off = M.fieldRange([1, 1, 0]);
  near(off.most, 1.5, 1e-4);
  near(off.least, 0.5, 1e-4);
});

test('a wire’s current in amps', () => {
  near(M.amps(1), 100);
  near(M.amps(2), 200);
  near(M.FULL, 100);
});
