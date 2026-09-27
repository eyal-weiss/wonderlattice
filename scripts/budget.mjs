// How much a first visit downloads, checked against a budget (run after the build; CI runs it).
// When a limit is crossed, that's the sign to load rooms on demand (docs/ARCHITECTURE.md, "Growing").
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';

// Compressed kilobytes, as the site is served. English is the page with every room; a language adds its words.
const BUDGET = { englishKB: 400, languageKB: 100 }; // about 30 rooms

const dist = join(fileURLToPath(new URL('..', import.meta.url)), 'dist');
const size = (path) => {
  const bytes = readFileSync(join(dist, path.split('?')[0]));
  return { raw: bytes.length, gz: gzipSync(bytes).length };
};
const add = (a, b) => ({ raw: a.raw + b.raw, gz: a.gz + b.gz });
const kb = (n) => Math.round(n / 1024);

const html = readFileSync(join(dist, 'index.html'), 'utf8');
const assets = [...html.matchAll(/(?:src|href)="\.\/((?:src|styles)\/[^"]+\.(?:js|css)[^"]*)"/g)].map((m) => m[1]);
const english = assets.reduce((total, path) => add(total, size(path)), size('index.html'));

await import(pathToFileURL(join(dist, 'src/core/wonderlattice.js')).href);
await import(pathToFileURL(join(dist, 'src/lang/languages.js')).href);
const languages = Object.entries(globalThis.Wonderlattice.languageFiles ?? {}).map(([code, scopes]) => ({
  code,
  ...scopes.reduce((total, scope) => add(total, size(`src/lang/${code}/${scope}.js`)), { raw: 0, gz: 0 }),
}));

console.log(`First visit, English: ${kb(english.gz)} KB compressed (${kb(english.raw)} KB), ${assets.length} files`);
for (const l of languages) console.log(`  + ${l.code}: ${kb(l.gz)} KB compressed (${kb(l.raw)} KB)`);
const over = [
  ...(kb(english.gz) > BUDGET.englishKB ? [`English first visit ${kb(english.gz)} KB > ${BUDGET.englishKB} KB`] : []),
  ...languages
    .filter((l) => kb(l.gz) > BUDGET.languageKB)
    .map((l) => `${l.code} ${kb(l.gz)} KB > ${BUDGET.languageKB} KB`),
];
if (over.length) {
  console.error(`Over budget: ${over.join('; ')}.\nTime to load rooms on demand (docs/ARCHITECTURE.md, "Growing").`);
  process.exit(1);
}
console.log(`Within budget (English ${BUDGET.englishKB} KB, each language ${BUDGET.languageKB} KB, compressed).`);
