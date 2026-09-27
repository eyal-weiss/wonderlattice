// Builds dist/ with no dependencies:
//   dist/                             the site, ready for any static host
//   dist/wonderlattice-standalone.html   one self-contained file (styles, scripts, portraits inlined)
// Usage: node scripts/build.mjs
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// fileURLToPath, not URL.pathname: pathname gives "/C:/…" on Windows and keeps spaces as "%20".
const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const read = (path) => readFileSync(join(root, path), 'utf8');

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist);
for (const item of ['index.html', '_headers', 'styles', 'src', 'portraits', 'assets', 'LICENSE']) {
  cpSync(join(root, item), join(dist, item), { recursive: true });
}
// The image credits travel with the site, next to the licence that excludes them.
cpSync(join(root, 'docs/PORTRAITS.md'), join(dist, 'CREDITS.md'));

const html = read('index.html');
const styles = [...html.matchAll(/<link rel="stylesheet" href="\.\/([^"]+)" \/>/g)].map((m) => m[1]);
const scripts = [...html.matchAll(/<script src="\.\/([^"]+)"><\/script>/g)].map((m) => m[1]);
if (!styles.length || !scripts.length) throw new Error('Could not find stylesheets or scripts in index.html');
// A local script written without "./" would be skipped here and left out of the standalone file.
const unprefixed = [...html.matchAll(/<script src="(?!\.\/)([^"]+)"/g)].map((m) => m[1]);
if (unprefixed.length) throw new Error(`index.html: write local scripts as "./path": ${unprefixed.join(', ')}`);

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

// The published page names each script and stylesheet with a fingerprint of its contents
// (app.js?v=3f9c…), so a browser fetches a file again exactly when a deploy changed it,
// instead of mixing a new page with scripts it cached hours ago. The source index.html stays
// clean, so the page still opens from disk.
const version = (path) =>
  createHash('sha256')
    .update(readFileSync(join(root, path)))
    .digest('hex')
    .slice(0, 10);
let published = html.replace(
  '<meta name="twitter:card"',
  // Tells the page that /room/<id>/ share pages exist here, so "Copy this exploration" can use them.
  '<meta name="wonderlattice-room-pages" content="1" />\n    <meta name="twitter:card"',
);
for (const path of styles) published = published.replace(`href="./${path}"`, `href="./${path}?v=${version(path)}"`);
for (const path of scripts) published = published.replace(`src="./${path}"`, `src="./${path}?v=${version(path)}"`);
writeFileSync(join(dist, 'index.html'), published);

// A share page per room (/room/<id>/): link previews read no further than the address before "#", so a
// link to #room=dice looks like any other link to the site. These pages carry the room's own title,
// tagline and picture (assets/rooms/<id>.jpg, from `npm run previews`), then forward to the room,
// keeping any shared settings and the language.
const SITE = 'https://wonderlattice.com';
await import(pathToFileURL(join(root, 'src/core/wonderlattice.js')).href);
const roomIds = [...html.matchAll(/src="\.\/src\/rooms\/([a-z]+)\/room\.js"/g)].map((m) => m[1]);
for (const id of roomIds) await import(pathToFileURL(join(root, `src/rooms/${id}/text.en.js`)).href);
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
mkdirSync(join(dist, 'room'), { recursive: true });
writeFileSync(
  join(dist, 'room/go.js'),
  `// Forwards a room's share page to the room, keeping shared settings (after #) and the language (?lang=).
(() => {
  const id = document.documentElement.dataset.room;
  location.replace('/' + location.search + (location.hash.length > 1 ? location.hash : '#room=' + id));
})();
`,
);
for (const id of roomIds) {
  const t = globalThis.Wonderlattice.text(id);
  const name = t.name ?? t.title;
  const image = existsSync(join(root, `assets/rooms/${id}.jpg`)) ? `assets/rooms/${id}.jpg` : 'assets/social.jpg';
  mkdirSync(join(dist, 'room', id), { recursive: true });
  writeFileSync(
    join(dist, 'room', id, 'index.html'),
    `<!doctype html>
<html lang="en" data-room="${id}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${attr(name)} · Wonderlattice</title>
    <meta name="description" content="${attr(t.tagline)}" />
    <link rel="canonical" href="${SITE}/room/${id}/" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Wonderlattice" />
    <meta property="og:title" content="${attr(name)}" />
    <meta property="og:description" content="${attr(t.tagline)}" />
    <meta property="og:url" content="${SITE}/room/${id}/" />
    <meta property="og:image" content="${SITE}/${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta http-equiv="refresh" content="3; url=/#room=${id}" />
    <script src="/room/go.js"></script>
  </head>
  <body style="background: #101217; color: #f1f2ed; font: 18px system-ui, sans-serif; padding: 40px">
    <a href="/#room=${id}" style="color: #ddf6a3">${attr(name)} · Wonderlattice</a>
  </body>
</html>
`,
  );
}

const kb = (text) => (Buffer.byteLength(text) / 1024).toFixed(0) + ' KB';
console.log(
  `Built dist/ (${scripts.length} scripts, ${styles.length} stylesheets, ${roomIds.length} room share pages)`,
);
console.log(`Built dist/wonderlattice-standalone.html (${kb(standalone)})`);
