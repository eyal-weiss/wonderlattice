// The route (docs/ARCHITECTURE.md, "The route"): the rooms' order in index.html is the numbering on the home map, and
// every room needs its pictures there. These checks catch a room placed or prepared carelessly.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { URL } from 'node:url';

const root = new URL('../../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const route = [...read('index.html').matchAll(/src="\.\/src\/rooms\/([a-z]+)\/room\.js"/g)].map((m) => m[1]);
const themeOf = (id) => read(`src/rooms/${id}/room.js`).match(/\btheme: '([a-z]+)'/)[1];

test('the route has every room once', () => {
  assert.ok(route.length > 10);
  assert.equal(new Set(route).size, route.length);
});

// The route visitors see leaves out rooms still waiting for their translations (Wonderlattice.published): every
// language must have a file for a room (src/lang/languages.js).
const languageFiles = {};
new Function('Wonderlattice', read('src/lang/languages.js'))({
  defineLanguage: () => {},
  set languageFiles(files) {
    Object.assign(languageFiles, files);
  },
});
const published = route.filter((id) => Object.values(languageFiles).every((files) => files.includes(id)));
const sameThemeNeighbours = (list) =>
  list.slice(1).flatMap((id, i) => (themeOf(id) === themeOf(list[i]) ? [`${list[i]}, ${id}`] : []));

test('neighbouring rooms on the route never share a theme, with or without the rooms awaiting translation', () => {
  assert.deepEqual(sameThemeNeighbours(route), [], 'move a room so its neighbours are from other themes');
  assert.ok(published.length > 10);
  assert.deepEqual(
    sameThemeNeighbours(published),
    [],
    'a room awaiting translation sits between two rooms of one theme: move it, or one of them',
  );
});

test('every theme appears among the first ten rooms', () => {
  const all = new Set(route.map(themeOf));
  const early = new Set(route.slice(0, 10).map(themeOf));
  assert.deepEqual(
    [...all].filter((t) => !early.has(t)),
    [],
  );
});

test('every room has its pictures for the map and its link preview (npm run previews)', () => {
  const missing = route.flatMap((id) =>
    [`assets/rooms/thumbs/${id}.webp`, `assets/rooms/thumbs/${id}-wide.webp`, `assets/rooms/${id}.jpg`].filter(
      (path) => !existsSync(new URL(path, root)),
    ),
  );
  assert.deepEqual(missing, [], 'run: npm run previews -- <id>');
});

test('each picture on the map stays small (they all load with the home page)', () => {
  const heavy = route
    .map((id) => [id, statSync(new URL(`assets/rooms/thumbs/${id}.webp`, root)).size])
    .filter(([, bytes]) => bytes > 20 * 1024)
    .map(([id, bytes]) => `${id}: ${Math.round(bytes / 1024)} KB`);
  assert.deepEqual(heavy, [], 'at most 20 KB each');
});
