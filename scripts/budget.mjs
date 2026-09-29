// How much the published site downloads, checked against a budget (run after the build; CI runs it).
// A first visit gets the page: the core and every room's card, plus the visitor's language's shared words. Each
// room's code and words come only when the room is needed (docs/ARCHITECTURE.md, "Growing"), so the limits are for
// the page, for one room, and for one room's words in a language, not for all rooms together.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';

// Compressed kilobytes, as the site is served.
const BUDGET = { pageKB: 150, roomKB: 40, languageKB: 50, roomWordsKB: 10 };

const dist = join(fileURLToPath(new URL('..', import.meta.url)), 'dist');
const size = (path) => {
  const bytes = readFileSync(join(dist, path.replace(/^\.\//, '').split('?')[0]));
  return { raw: bytes.length, gz: gzipSync(bytes).length };
};
const sum = (paths) => {
  const total = { raw: 0, gz: 0 };
  for (const path of paths) {
    const { raw, gz } = size(path);
    total.raw += raw;
    total.gz += gz;
  }
  return total;
};
const kb = (n) => Math.round(n / 1024);

const html = readFileSync(join(dist, 'index.html'), 'utf8');
const assets = [...html.matchAll(/(?:src|href)="\.\/((?:src|styles)\/[^"]+\.(?:js|css)[^"]*)"/g)].map((m) => m[1]);
const page = sum(['index.html', ...assets]);

await import(pathToFileURL(join(dist, 'src/core/wonderlattice.js')).href);
await import(pathToFileURL(join(dist, 'src/rooms/cards.js')).href);
await import(pathToFileURL(join(dist, 'src/lang/languages.js')).href);
const W = globalThis.Wonderlattice;
const later = W.rooms.filter((r) => W.loadsLater(r.id));
const rooms = later.map((r) => ({ id: r.id, ...sum([...r.scripts, ...r.styles]) })).sort((a, b) => b.gz - a.gz);
const languages = Object.entries(W.languageFiles ?? {}).map(([code, scopes]) => {
  const file = (scope) => `src/lang/${code}/${scope}.js`;
  const words = scopes
    .filter((scope) => W.loadsLater(scope))
    .map((id) => ({ id, ...sum([file(id)]) }))
    .sort((a, b) => b.gz - a.gz);
  return { code, shared: sum(scopes.filter((scope) => !W.loadsLater(scope)).map(file)), words };
});

console.log(`First visit, English: ${kb(page.gz)} KB compressed (${kb(page.raw)} KB), ${assets.length} files`);
const all = rooms.reduce((t, r) => t + r.gz, 0);
console.log(
  `Each room, when it's needed: ${later.length} rooms, the largest ${rooms[0]?.id} ${kb(rooms[0]?.gz ?? 0)} KB ` +
    `(all together ${kb(all)} KB)`,
);
for (const l of languages)
  console.log(
    `  + ${l.code}: ${kb(l.shared.gz)} KB compressed on a first visit; each room's words up to ` +
      `${kb(l.words[0]?.gz ?? 0)} KB (${l.words[0]?.id ?? 'none'})`,
  );

const over = [
  ...(kb(page.gz) > BUDGET.pageKB ? [`the page ${kb(page.gz)} KB > ${BUDGET.pageKB} KB`] : []),
  ...rooms.filter((r) => kb(r.gz) > BUDGET.roomKB).map((r) => `the ${r.id} room ${kb(r.gz)} KB > ${BUDGET.roomKB} KB`),
  ...languages
    .filter((l) => kb(l.shared.gz) > BUDGET.languageKB)
    .map((l) => `${l.code} on a first visit ${kb(l.shared.gz)} KB > ${BUDGET.languageKB} KB`),
  ...languages.flatMap((l) =>
    l.words
      .filter((w) => kb(w.gz) > BUDGET.roomWordsKB)
      .map((w) => `${l.code} words for ${w.id} ${kb(w.gz)} KB > ${BUDGET.roomWordsKB} KB`),
  ),
];
if (over.length) {
  console.error(`Over budget: ${over.join('; ')}.`);
  process.exit(1);
}
console.log(
  `Within budget (compressed): the page ${BUDGET.pageKB} KB, each room ${BUDGET.roomKB} KB, each language ` +
    `${BUDGET.languageKB} KB on a first visit and ${BUDGET.roomWordsKB} KB per room.`,
);
