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

test('neighbouring rooms on the route never share a theme', () => {
  const same = route.slice(1).flatMap((id, i) => (themeOf(id) === themeOf(route[i]) ? [`${route[i]}, ${id}`] : []));
  assert.deepEqual(same, [], 'move a room so its neighbours are from other themes');
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
