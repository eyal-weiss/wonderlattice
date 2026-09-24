import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const { equilibrium } = globalThis.Wonderloom.models.traffic;

test('adding a road makes the familiar 4000-driver journey slower', () => {
  const before = equilibrium(4000, false);
  const after = equilibrium(4000, true);
  assert.deepEqual([before.upper, before.lower, before.middle, before.time], [2000, 2000, 0, 65]);
  assert.deepEqual([after.upper, after.lower, after.middle, after.time], [0, 0, 4000, 80]);
});

test('equilibrium conserves traffic and leaves no faster unused route', () => {
  for (let demand = 1000; demand <= 10000; demand += 100) {
    for (const shortcut of [false, true]) {
      const f = equilibrium(demand, shortcut);
      assert.equal(f.upper + f.lower + f.middle, demand);
      assert.equal(f.baseline, 45 + demand / 200);
      const north = (f.upper + f.middle) / 100;
      const south = (f.lower + f.middle) / 100;
      const costs = [north + 45, 45 + south, north + south];
      const flows = [f.upper, f.lower, shortcut ? f.middle : 0];
      for (let i = 0; i < 3; i++) {
        if (i === 2 && !shortcut) continue;
        assert.ok(costs[i] >= f.time - 1e-8, `unused route ${i} faster at ${demand}`);
        if (flows[i] > 0) assert.ok(Math.abs(costs[i] - f.time) < 1e-8, `used route ${i} slower at ${demand}`);
      }
    }
  }
  assert.ok(equilibrium(1000, true).time < equilibrium(1000, false).time);
  assert.equal(equilibrium(10000, true).time, equilibrium(10000, false).time);
});
