// Builds dist/ with no dependencies:
//   dist/                             the site, ready for any static host
//   dist/wonderlattice-standalone.html   one self-contained file (styles, scripts, fonts, portraits and the map's
//                                        pictures inlined)
// Usage: node scripts/build.mjs
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { readCards } from './room-cards.mjs';

// fileURLToPath, not URL.pathname: pathname gives "/C:/…" on Windows and keeps spaces as "%20".
const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const read = (path) => readFileSync(join(root, path), 'utf8');

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist);
for (const item of ['index.html', '_headers', 'styles', 'src', 'portraits', 'assets', 'fonts', 'LICENSE']) {
  cpSync(join(root, item), join(dist, item), { recursive: true });
}
// The image credits travel with the site, next to the licence that excludes them.
cpSync(join(root, 'docs/PORTRAITS.md'), join(dist, 'CREDITS.md'));

const html = read('index.html');
// The languages and their files, straight from the generated list (the standalone file inlines them all).
await import(pathToFileURL(join(root, 'src/core/wonderlattice.js')).href);
await import(pathToFileURL(join(root, 'src/lang/languages.js')).href);
const languageFiles = Object.entries(globalThis.Wonderlattice.languageFiles ?? {}).flatMap(([code, scopes]) =>
  scopes.map((scope) => ({ code, scope, path: `src/lang/${code}/${scope}.js` })),
);
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

// The map's pictures (assets/rooms/thumbs/<id>.webp), so the standalone file's map shows them too.
const thumbs = Object.fromEntries(
  readdirSync(join(root, 'assets/rooms/thumbs'))
    .filter((file) => file.endsWith('.webp') && !file.endsWith('-wide.webp'))
    .map((file) => [
      file.replace('.webp', ''),
      `data:image/webp;base64,${readFileSync(join(root, 'assets/rooms/thumbs', file)).toString('base64')}`,
    ]),
);
// The typefaces travel inside the file's stylesheet (a page opened from disk can't load font files).
const withFontsInside = (css) =>
  css.replace(
    /url\('\.\.\/fonts\/([^']+\.woff2)'\)/g,
    (_, file) => `url('data:font/woff2;base64,${readFileSync(join(root, 'fonts', file)).toString('base64')}')`,
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
  const css = path === 'styles/fonts.css' ? withFontsInside(read(path)) : read(path);
  standalone = standalone.replace(`<link rel="stylesheet" href="./${path}" />`, () => `<style>\n${css}</style>`);
}
// Every language's words, for the standalone file (it can't load files, and offers the language menu offline).
const allLanguages = () => languageFiles.map(({ path }) => inlineScript(read(path), path)).join('\n');
for (const path of scripts) {
  let block = path === 'src/lang/load.js' ? allLanguages() : inlineScript(read(path), path);
  // Portrait images and the map's pictures travel inside the file, right after the core namespace exists.
  if (path === 'src/core/wonderlattice.js') {
    block += '\n' + inlineScript(`Wonderlattice.portraitSources = ${JSON.stringify(portraits)};\n`, 'portraits');
    block += '\n' + inlineScript(`Wonderlattice.thumbSources = ${JSON.stringify(thumbs)};\n`, 'thumbs');
  }
  // The display settings learn that this file carries its fonts (so it uses them even from disk).
  if (path === 'src/core/display.js')
    block = inlineScript('window.wonderlatticeFontsInside = true;\n', 'fonts') + '\n' + block;
  standalone = standalone.replace(`<script src="./${path}"></script>`, () => block);
}
if (/(?:src|href)="\.\//.test(standalone)) throw new Error('Standalone file still references local files');
const notice =
  '<!--\n  Wonderlattice: code and text under the MIT licence (see LICENSE in the source).\n' +
  "  Portrait images are third-party works: public domain, except John Conway's photo by Thane Plambeck,\n" +
  '  CC BY 2.0 (cropped). Credits: CREDITS.md / docs/PORTRAITS.md.\n' +
  '  Typefaces: Rubik, IM Fell English, Frank Ruhl Libre and Amiri, under the SIL Open Font License (fonts/ in the\n' +
  '  source, with each licence).\n-->\n';
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
    .update(readFileSync(join(dist, path)))
    .digest('hex')
    .slice(0, 10);

// The published site loads each room only when it's needed: when it's opened, or when its card comes into view on
// the home map. The page itself carries just the cards (src/rooms/cards.js, read from the rooms by
// scripts/room-cards.mjs), so it stays small however many rooms there are. A room with its own layout stays in the
// page, since its panel and tools are there from the start. Opened from disk, and in the standalone file, every
// room still loads with the page.
const { cards, words } = readCards(root, html, globalThis.Wonderlattice.languageFiles ?? {});
const lazy = cards.filter((card) => card.layout !== 'custom');
const ONDEMAND = ['src/vendor/qrcodegen.js']; // loaded by the page itself when first needed
const lazyIds = new Set(lazy.map((card) => card.id));
const roomScripts = (id) => scripts.filter((path) => path.startsWith(`src/rooms/${id}/`));
const roomStyles = (id) => styles.filter((path) => path.startsWith(`src/rooms/${id}/`));
for (const { id } of lazy)
  if (!roomScripts(id).at(-1)?.endsWith('/room.js')) throw new Error(`index.html: ${id}'s room.js must come last`);
const only = (all) => Object.fromEntries(Object.entries(all).filter(([id]) => lazyIds.has(id)));
const cardLanguages = Object.keys(words).filter((code) => code !== 'en' && Object.keys(only(words[code])).length);
for (const code of cardLanguages)
  writeFileSync(
    join(dist, `src/lang/${code}/cards.js`),
    `/* Written by scripts/build.mjs: the room cards' words (${code}), from the rooms' own files. */\n` +
      `Wonderlattice.defineText('cards', '${code}', ${JSON.stringify(only(words[code]), null, 2)});\n`,
  );
const fingerprinted = (path) => `./${path}?v=${version(path)}`;
writeFileSync(
  join(dist, 'src/rooms/cards.js'),
  `/* Written by scripts/build.mjs: the published site's rooms, each loaded when it's needed. */\n` +
    `Wonderlattice.defineCards(${JSON.stringify(
      // Every room, in order; one that stays in the page needs only a placeholder here, to keep its place.
      cards.map((card) =>
        lazyIds.has(card.id)
          ? {
              ...card,
              scripts: roomScripts(card.id).map(fingerprinted),
              styles: roomStyles(card.id).map(fingerprinted),
            }
          : { id: card.id },
      ),
      null,
      2,
    )});\n` +
    `Wonderlattice.defineText('cards', 'en', ${JSON.stringify(only(words.en), null, 2)});\n` +
    // Scripts loaded only when first needed (Wonderlattice.loadScript), with their fingerprints.
    `Wonderlattice.fileVersions = ${JSON.stringify(Object.fromEntries(ONDEMAND.map((path) => [path, version(path)])))};\n`,
);

// load.js writes the language files' addresses itself, so their fingerprints go into the published languages.js.
{
  const versions = {};
  for (const { code, scope, path } of languageFiles) (versions[code] ??= {})[scope] = version(path);
  for (const code of cardLanguages) versions[code].cards = version(`src/lang/${code}/cards.js`);
  writeFileSync(
    join(dist, 'src/lang/languages.js'),
    `${read('src/lang/languages.js')}Wonderlattice.languageVersions = ${JSON.stringify(versions)};\n` +
      `// The room cards' words come with the language; each room's own words come with the room.\n` +
      `for (const code of ${JSON.stringify(cardLanguages)}) Wonderlattice.languageFiles[code].push('cards');\n`,
  );
}
let published = html.replace(
  '<meta name="twitter:card"',
  // Tells the page that /room/<id>/ share pages exist here, so "Copy this exploration" can use them.
  '<meta name="wonderlattice-room-pages" content="1" />\n    <meta name="twitter:card"',
);
for (const { id } of lazy) {
  for (const path of roomScripts(id)) published = published.replace(`    <script src="./${path}"></script>\n`, '');
  for (const path of roomStyles(id))
    published = published.replace(`    <link rel="stylesheet" href="./${path}" />\n`, '');
}
const coreText = '<script src="./src/core/text.en.js"></script>';
published = published.replace(coreText, `${coreText}\n    <script src="./src/rooms/cards.js"></script>`);
for (const path of styles) published = published.replace(`href="./${path}"`, `href="./${path}?v=${version(path)}"`);
for (const path of [...scripts, 'src/rooms/cards.js'])
  published = published.replace(`src="./${path}"`, `src="./${path}?v=${version(path)}"`);
if (lazy.some(({ id }) => published.includes(`/src/rooms/${id}/`)))
  throw new Error('The published page still loads a room that should load on demand');
writeFileSync(join(dist, 'index.html'), published);

// A share page per room (/room/<id>/): link previews read no further than the address before "#", so a
// link to #room=dice looks like any other link to the site. These pages carry the room's own title,
// tagline and picture (assets/rooms/<id>.jpg, from `npm run previews`), then forward to the room,
// keeping any shared settings and the language.
const SITE = 'https://wonderlattice.com';
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
  `Built dist/ (${scripts.length} scripts, ${styles.length} stylesheets, ${roomIds.length} room share pages; ` +
    `${lazy.length} rooms load on demand)`,
);
console.log(`Built dist/wonderlattice-standalone.html (${kb(standalone)})`);
