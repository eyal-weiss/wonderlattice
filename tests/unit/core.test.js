import assert from 'node:assert/strict';
import test from 'node:test';
import './load.js';

const W = globalThis.Wonderloom;

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
