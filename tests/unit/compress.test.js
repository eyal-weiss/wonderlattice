import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const M = globalThis.Wonderlattice.models.compress;

test('keeping every number rebuilds the picture exactly', () => {
  for (const name of M.PICTURE_ORDER) {
    const image = M.PICTURES[name]();
    const coeffs = M.transform(image);
    const back = M.inverse(coeffs);
    for (let i = 0; i < M.COUNT; i++) assert.ok(Math.abs(back[i] - image[i]) < 1e-9, `${name} pixel ${i}`);
    const { kept, count } = M.keep(coeffs, M.strength(coeffs), 1);
    assert.equal(count, M.COUNT);
    assert.ok(M.difference(image, M.inverse(kept)) < 1e-12);
  }
});

test('the transform keeps energy: the sum of squares is the same in pixels and in numbers', () => {
  const image = M.PICTURES.face();
  const coeffs = M.transform(image);
  const energy = (a) => a.reduce((s, x) => s + x * x, 0);
  assert.ok(Math.abs(energy(image) - energy(coeffs)) / energy(image) < 1e-12);
});

test('a flat block needs only one number: its average', () => {
  const image = new Float64Array(M.COUNT).fill(100);
  const coeffs = M.transform(image);
  for (let b = 0; b < M.BLOCKS; b++) {
    assert.ok(Math.abs(coeffs[b * 64] - 800) < 1e-9); // 8 × the average
    for (let k = 1; k < 64; k++) assert.ok(Math.abs(coeffs[b * 64 + k]) < 1e-9);
  }
});

test('the surprise: the strongest 10% look close, the weakest 90% look ruined', () => {
  for (const name of ['sunset', 'face']) {
    const image = M.PICTURES[name]();
    const coeffs = M.transform(image);
    const order = M.strength(coeffs);
    const strong = M.keep(coeffs, order, 0.1, 0);
    const weak = M.keep(coeffs, order, 0.9, 1);
    assert.ok(M.energyKept(coeffs, strong.mask) > 0.98, `${name}: the strongest 10% hold over 98% of the energy`);
    assert.ok(M.difference(image, M.inverse(strong.kept)) < 0.06, `${name}: strongest 10% within 6%`);
    assert.ok(M.difference(image, M.inverse(weak.kept)) > 0.3, `${name}: weakest 90% off by over 30%`);
  }
});

test('pattern use counts how many blocks kept each building block', () => {
  const mask = new Uint8Array(M.COUNT);
  for (let b = 0; b < M.BLOCKS; b++) mask[b * 64] = 1; // every block keeps its average
  const use = M.patternUse(mask);
  assert.ok(Math.abs(use[0] - 1) < 1e-12);
  assert.equal(use[63], 0);
});

test('painting changes only pixels near the brush', () => {
  const image = new Float64Array(M.COUNT).fill(0);
  M.paint(image, 10, 10, 255);
  assert.ok(image[10 * 64 + 10] > 200);
  assert.equal(image[30 * 64 + 30], 0);
});
