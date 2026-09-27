import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const W = globalThis.Wonderlattice;

test('text falls back to English key by key', () => {
  W.defineText('sample', 'en', { hello: 'Hello', bye: 'Goodbye' });
  W.defineText('sample', 'he', { hello: 'שלום' });
  assert.equal(W.lang, 'en');
  assert.deepEqual(W.text('sample'), { hello: 'Hello', bye: 'Goodbye' });
  W.lang = 'he';
  assert.deepEqual(W.text('sample'), { hello: 'שלום', bye: 'Goodbye' });
  W.lang = 'en';
  assert.throws(() => W.text('missing'), /No English text/);
});

test('rooms need a lowercase id, a unique id, and a known theme', () => {
  assert.throws(() => W.defineRoom({ id: 'Bad', theme: 'shape' }), /lowercase/);
  assert.throws(() => W.defineRoom({ id: 'nowhere', theme: 'moon' }), /known theme/);
  W.defineRoom({ id: 'sampleroom', theme: 'chance' });
  assert.throws(() => W.defineRoom({ id: 'sampleroom', theme: 'chance' }), /defined twice/);
  assert.equal(W.room('sampleroom').theme, 'chance');
});

test('English counts say "1 minute" and "1 pixel", not "1 minutes"', async () => {
  await import('../../src/rooms/traffic/text.en.js');
  await import('../../src/rooms/storm/text.en.js');
  const W = globalThis.Wonderlattice;
  W.lang = 'en';
  const traffic = W.text('traffic');
  assert.equal(traffic.verdict.slower(1), '1 minute slower for everyone.');
  assert.equal(traffic.verdict.faster(2.5), '2.5 minutes faster for everyone.');
  const storm = W.text('storm');
  assert.match(storm.curveLabel('Hamming', 1), /about 1 pixel wrong/);
  assert.match(storm.curveLabel('Hamming', 0.8), /about 0.8 pixels wrong/);
});
