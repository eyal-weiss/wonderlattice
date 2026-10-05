import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.voltage;
const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) <= eps * Math.max(1, Math.abs(b)), `${a} ≈ ${b}`);

// The numbers below were recomputed independently, in Python, from P = 10 MW, R = 5 Ω, a 100 km line, and
// aluminium's resistivity (2.82 × 10⁻⁸ Ω·m) and density (2,700 kg/m³).

test('the loss is P²R/V², the worked numbers from the issue', () => {
  near(M.loss(10e3), 5e6); // half of the 10 MW sent
  near(M.loss(100e3), 5e4); // 0.5%
  near(M.loss(400e3), 3125); // about 3 kW
  near(M.loss(1e6), 500);
  near(M.share(10e3), 0.5);
  near(M.share(100e3), 0.005);
  near(M.share(400e3), 0.0003125);
  // P²R/V² for other powers and wires, straight from the formula.
  for (const [volts, metal, power] of [
    [33e3, 1, 10e6],
    [7e3, 4, 2e6],
    [250e3, 0.5, 1e8],
  ])
    near(M.loss(volts, metal, power), (power * power * (M.OHMS / metal)) / (volts * volts));
});

test('ten times the voltage gives a hundredth of the loss, anywhere on the dial', () => {
  for (const volts of [1e3, 2.7e3, 7e3, 13e3, 50e3, 100e3])
    for (const metal of [1, 3, 100]) near(M.loss(volts, metal) / M.loss(10 * volts, metal), 100);
  // The current falls ten times, which is why: I = P/V, and the heat goes with I².
  near(M.current(10e3), 1000);
  near(M.current(100e3), 100);
});

test('what reaches the town never goes negative: below √(PR) the town simply stays dark', () => {
  near(M.darkBelow(), 7071.067811865475);
  near(M.delivered(10e3), 5e6);
  near(M.delivered(100e3), 9.95e6);
  for (const volts of [1e3, 3e3, 7e3, M.darkBelow()]) assert.equal(M.delivered(volts), 0);
  assert.ok(M.delivered(7.1e3) > 0);
  assert.ok(M.share(3e3) > 5); // the sums ask for 55.6 MW of heat, more than the 10 MW sent
  // Along the line the power falls evenly, and stops at zero where the sums break down.
  near(M.flowAt(0, 10e3), 10e6);
  near(M.flowAt(0.5, 10e3), 7.5e6);
  near(M.flowAt(1, 10e3), 5e6);
  assert.equal(M.flowAt(0.5, 3e3), 0);
  near(M.flowAt(0.1, 3e3), 10e6 - 5.555555555555556e6);
});

test('more metal is the other way: a hundred times the metal for the same saving as ten times the voltage', () => {
  near(M.metalToMatch(10e3, 100e3), 100);
  near(M.loss(10e3, 100), M.loss(100e3, 1));
  near(M.loss(10e3, 2), 2.5e6); // doubling the metal halves the loss
  near(M.resistance(10), 0.5);
  const thin = M.wire(1),
    thick = M.wire(100);
  near(thin.area, 5.64e-4);
  near(thin.diameter, 0.026797520467958073);
  near(thin.tonnes, 152.28);
  near(thick.diameter, 0.26797520467958075);
  near(thick.tonnes, 15228);
  near(M.heatPerMetre(10e3), 50);
  near(M.heatPerMetre(100e3), 0.5);
});

test('the dial reads to two significant figures', () => {
  assert.deepEqual([398.1, 3.162, 10, 1000, 1.047, 99.6, 0.0123].map(M.nice), [400, 3.2, 10, 1000, 1, 100, 0.012]);
  assert.equal(M.nice(0), 0);
});
