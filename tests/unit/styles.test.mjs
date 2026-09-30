// Text sizes are in rem, so the Display setting can scale them all (styles/base.css, src/core/display.js). A size
// that must stay fixed, such as the wordmark or a glyph that is part of a drawing, says "keeps its size" on its line.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { URL } from 'node:url';

const root = new URL('../../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const rooms = readdirSync(new URL('src/rooms/', root), { withFileTypes: true }).filter((d) => d.isDirectory());
const lineOf = (text, index) => text.slice(0, index).split('\n').length;

/** Every font size written in px in `text`, as "file:line", unless its lines say it keeps its size. */
function fixedSizes(file, text, pattern) {
  const found = [];
  for (const m of text.matchAll(pattern)) {
    if (!/\d(\.\d+)?px/.test(m[1])) continue;
    const start = text.lastIndexOf('\n', m.index) + 1;
    const end = text.indexOf('\n', m.index + m[0].length);
    if (!text.slice(start, end).includes('keeps its size')) found.push(`${file}:${lineOf(text, m.index)}`);
  }
  return found;
}

test('stylesheets size text in rem', () => {
  const sheets = [
    ...readdirSync(new URL('styles/', root)).map((f) => `styles/${f}`),
    ...rooms.map((d) => `src/rooms/${d.name}/room.css`).filter((f) => existsSync(new URL(f, root))),
  ];
  const found = sheets.flatMap((file) =>
    // font-size: 14px, and the size in a font shorthand (font: 600 14px/1.4 serif), which may span lines
    fixedSizes(file, read(file), /font-size:([^;]*);|\bfont:\s*((?:\d{3}\s+)?[\d.]+px)/g),
  );
  assert.deepEqual(found, []);
});

test('markup and room code size text in rem', () => {
  const scripts = [
    'index.html',
    ...readdirSync(new URL('src/core/', root)).map((f) => `src/core/${f}`),
    ...readdirSync(new URL('src/features/', root)).map((f) => `src/features/${f}`),
    ...rooms.map((d) => `src/rooms/${d.name}/room.js`),
  ];
  // Inline styles only: canvas fonts (ctx.font = '12px …') are drawn in the pictures, which keep their size.
  const found = scripts.flatMap((file) => fixedSizes(file, read(file), /font-size:\s*([^;"'`]*)/g));
  assert.deepEqual(found, []);
});
