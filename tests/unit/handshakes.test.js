import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.handshakes;
const near = (a, b, tolerance, message) => assert.ok(Math.abs(a - b) <= tolerance, `${message}: ${a} vs ${b}`);
const world = (count, seed) => M.friends(M.shortcuts(count, seed));

test('handshakes: the plain ring has its exact average distance (5050/199 ≈ 25.4) and clustering (½)', () => {
  const ring = M.friends();
  assert.equal(ring.length, 200);
  assert.ok(
    ring.every((mine) => mine.length === 4),
    'four friends each',
  );
  near(M.averageDistance(ring), 5050 / 199, 1e-12, 'average distance');
  near(M.ringDistance(), 5050 / 199, 1e-12, 'the formula');
  near(M.clustering(ring), 0.5, 1e-12, 'clustering');
  assert.equal(M.ringClustering(), 0.5);
  assert.equal(Math.max(...M.distances(ring, 0)), 50, 'the far side is 50 handshakes away');
  // The same formulas for six friends each: 3(k − 2) / (4(k − 1)) = 0.6.
  const wider = M.friends([], 60, 3);
  near(M.clustering(wider), 0.6, 1e-12, 'clustering with six friends');
  near(M.averageDistance(wider), M.ringDistance(60, 3), 1e-12, 'distance with six friends');
});

test('handshakes: shortcuts are new friendships, the same for a seed, and arrive in a fixed order', () => {
  const long = M.shortcuts(60, 7);
  assert.equal(long.length, 60);
  assert.deepEqual(M.shortcuts(12, 7), long.slice(0, 12), 'the first twelve of sixty are the twelve');
  assert.deepEqual(M.shortcuts(60, 7), long, 'the same seed, the same shortcuts');
  assert.notDeepEqual(M.shortcuts(60, 8), long, 'another seed, other strangers');
  const keys = new Set(long.map(([a, b]) => `${a}-${b}`));
  assert.equal(keys.size, 60, 'never the same friendship twice');
  for (const [a, b] of long) {
    assert.ok(a < b && a >= 0 && b < 200);
    assert.ok(M.around(a, b, 200) > 2, 'never between people who are already friends on the ring');
  }
});

test('handshakes: adding a shortcut never lengthens the average distance', () => {
  for (const seed of [1, 24, 99]) {
    const { distance } = M.curve(seed, 30);
    for (let c = 1; c <= 30; c++) assert.ok(distance[c] <= distance[c - 1] + 1e-12, `seed ${seed}, shortcut ${c}`);
  }
});

test('handshakes: a few shortcuts nearly halve the distance while the clustering barely moves', () => {
  // Checked independently (a separate script, 40 random draws each): about 13.9, 10.2 and 7.5 handshakes with 5, 10
  // and 20 shortcuts, and clustering 0.490, 0.481 and 0.463.
  const mean = (count, of) => {
    let sum = 0;
    for (let seed = 1; seed <= 40; seed++) sum += of(world(count, seed));
    return sum / 40;
  };
  near(mean(5, M.averageDistance), 13.9, 0.8, 'five shortcuts');
  near(mean(10, M.averageDistance), 10.2, 0.6, 'ten');
  near(mean(20, M.averageDistance), 7.5, 0.4, 'twenty');
  near(mean(5, M.clustering), 0.49, 0.005, 'clustering with five');
  near(mean(20, M.clustering), 0.463, 0.008, 'clustering with twenty');
});

test('handshakes: the opening world (seed 24) goes from 25.4 to 13.7 with five shortcuts', () => {
  const { distance, knit } = M.curve(24, 5);
  assert.equal(distance[0].toFixed(1), '25.4');
  assert.equal(distance[5].toFixed(1), '13.7');
  assert.ok(knit[5] > 0.48, `still close-knit: ${knit[5]}`);
  const five = world(5, 24);
  assert.equal(M.path(five, 0, 100).length - 1, 16, 'you and the person opposite: 50 handshakes, then 16');
});

test('handshakes: a chain is a real chain of friends, and as short as the search says', () => {
  const f = world(8, 3);
  for (const to of [1, 37, 100, 163]) {
    const chain = M.path(f, 0, to);
    assert.equal(chain[0], 0);
    assert.equal(chain.at(-1), to);
    assert.equal(chain.length - 1, M.distances(f, 0)[to]);
    for (let i = 1; i < chain.length; i++) assert.ok(f[chain[i - 1]].includes(chain[i]), 'each step is a friendship');
  }
  assert.deepEqual(M.path(f, 0, 100), M.path(f, 0, 100), 'the same chain every time');
});
