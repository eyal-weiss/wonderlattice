// Builds dist/ with no dependencies:
//   dist/                             the site, ready for any static host
//   dist/wonderlattice-standalone.html   one self-contained file (styles, scripts, portraits inlined)
// Usage: node scripts/build.mjs
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const dist = join(root, 'dist');
const read = (path) => readFileSync(join(root, path), 'utf8');

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist);
for (const item of ['index.html', 'styles', 'src', 'portraits', 'assets', 'LICENSE']) {
  cpSync(join(root, item), join(dist, item), { recursive: true });
}
// The image credits travel with the site, next to the licence that excludes them.
cpSync(join(root, 'docs/PORTRAITS.md'), join(dist, 'CREDITS.md'));

const html = read('index.html');
const styles = [...html.matchAll(/<link rel="stylesheet" href="\.\/([^"]+)" \/>/g)].map((m) => m[1]);
const scripts = [...html.matchAll(/<script src="\.\/([^"]+)"><\/script>/g)].map((m) => m[1]);
if (!styles.length || !scripts.length) throw new Error('Could not find stylesheets or scripts in index.html');

const mime = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png' };
const portraits = Object.fromEntries(
  readdirSync(join(root, 'portraits')).map((file) => [
    file,
    `data:${mime[extname(file)]};base64,${readFileSync(join(root, 'portraits', file)).toString('base64')}`,
  ]),
);

const inlineScript = (code, name) => {
  if (/<\/script/i.test(code)) throw new Error(`${name} contains "</script" and cannot be inlined`);
  return `<script>\n${code}</script>`;
};

// The touch icon travels inside the file; link previews need a web address, so the file has none.
let standalone = html
  .replace(
    './assets/apple-touch-icon.png',
    `data:image/png;base64,${readFileSync(join(root, 'assets/apple-touch-icon.png')).toString('base64')}`,
  )
  .replace(/ *<!-- Link previews[^]*?<meta name="twitter:card"[^>]*>\n/, '');
for (const path of styles) {
  standalone = standalone.replace(`<link rel="stylesheet" href="./${path}" />`, () => `<style>\n${read(path)}</style>`);
}
for (const path of scripts) {
  let block = inlineScript(read(path), path);
  // Portrait images travel inside the file, right after the core namespace exists.
  if (path === 'src/core/wonderlattice.js') {
    block += '\n' + inlineScript(`Wonderlattice.portraitSources = ${JSON.stringify(portraits)};\n`, 'portraits');
  }
  standalone = standalone.replace(`<script src="./${path}"></script>`, () => block);
}
if (/(?:src|href)="\.\//.test(standalone)) throw new Error('Standalone file still references local files');
const notice =
  '<!--\n  Wonderlattice: code and text under the MIT licence (see LICENSE in the source).\n' +
  "  Portrait images are third-party works: public domain, except John Conway's photo by Thane Plambeck,\n" +
  '  CC BY 2.0 (cropped). Credits: CREDITS.md / docs/PORTRAITS.md.\n-->\n';
writeFileSync(
  join(dist, 'wonderlattice-standalone.html'),
  standalone.replace('<!doctype html>\n', (d) => d + notice),
);

const kb = (text) => (Buffer.byteLength(text) / 1024).toFixed(0) + ' KB';
console.log(`Built dist/ (${scripts.length} scripts, ${styles.length} stylesheets)`);
console.log(`Built dist/wonderlattice-standalone.html (${kb(standalone)})`);
