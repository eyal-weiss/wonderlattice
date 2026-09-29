// Reads each room's card, the part of a room the home map shows before the room itself loads: its theme,
// symbol, colour, and its eyebrow, name and tagline in every language. The build uses the cards so the published
// site can load each room only when it's needed. It runs the page's own scripts, in Node, against a browser that
// does nothing, so the cards always match the rooms.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

/** Whatever a room touches while it loads: every property is another such object, and every call returns one. */
const nothing = new Proxy(function () {}, {
  get: (_, key) => (key === Symbol.toPrimitive ? () => 0 : key === 'then' ? undefined : nothing),
  apply: () => nothing,
  construct: () => nothing,
});

// No `document`: then, as in the Node tests, translated markup isn't parsed (the page cleans it again anyway).
const BROWSER = [
  'window',
  'navigator',
  'performance',
  'devicePixelRatio',
  'Path2D',
  'Image',
  'ImageData',
  'AudioContext',
  'OffscreenCanvas',
  'IntersectionObserver',
  'ResizeObserver',
  'NodeFilter',
  'speechSynthesis',
  'SpeechSynthesisUtterance',
  'getComputedStyle',
  'addEventListener',
  'removeEventListener',
];

/** Runs the page's scripts in the order index.html lists them, as a visitor reading `lang` would. */
function runPage(root, html, lang, languageFiles) {
  const sandbox = { console, URLSearchParams, setTimeout: () => 0, clearTimeout() {}, requestAnimationFrame: () => 0 };
  for (const name of BROWSER) sandbox[name] = nothing;
  sandbox.matchMedia = () => ({ matches: false, addEventListener() {} });
  sandbox.location = { search: lang === 'en' ? '' : `?lang=${lang}`, hash: '', protocol: 'https:' };
  sandbox.localStorage = { getItem: () => null, setItem() {} };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  const run = (path) =>
    vm.runInContext(readFileSync(join(root, path), 'utf8'), sandbox, { filename: path, timeout: 5000 });
  for (const path of [...html.matchAll(/<script src="\.\/([^"]+)"><\/script>/g)].map((m) => m[1])) {
    if (path === 'src/core/app.js') continue; // the app starts the page; the cards need only the rooms
    // Instead of writing its tags into the page, the language's files run here, in the same place.
    if (path === 'src/lang/load.js')
      (languageFiles[lang] ?? []).forEach((scope) => run(`src/lang/${lang}/${scope}.js`));
    else run(path);
  }
  return sandbox.Wonderlattice;
}

/**
 * Every room's card: { cards: [{ id, theme, symbol, accent, layout, panel }], words: { lang: { id: { eyebrow, name,
 * tagline } } } }. A language lists only the words it changes; the rest fall back to English, as on the page.
 */
export function readCards(root, html, languageFiles) {
  const read = (lang) => {
    try {
      return runPage(root, html, lang, languageFiles).rooms;
    } catch (error) {
      throw new Error(`Couldn't read the rooms' cards (${lang}): ${error.message}`, { cause: error });
    }
  };
  const english = read('en');
  const words = (rooms) =>
    Object.fromEntries(rooms.map((r) => [r.id, { eyebrow: r.eyebrow, name: r.name, tagline: r.tagline }]));
  const out = { cards: [], words: { en: words(english) } };
  for (const room of english) {
    for (const field of ['name', 'eyebrow', 'tagline', 'symbol'])
      if (typeof room[field] !== 'string') throw new Error(`The ${room.id} room's card needs a ${field}`);
    out.cards.push({
      id: room.id,
      theme: room.theme,
      symbol: room.symbol,
      ...(room.accent?.border ? { accent: { border: room.accent.border } } : {}),
      ...(room.layout ? { layout: room.layout } : {}),
      ...(room.panel ? { panel: room.panel } : {}),
    });
  }
  for (const lang of Object.keys(languageFiles)) {
    const changed = {};
    for (const [id, card] of Object.entries(words(read(lang)))) {
      const own = Object.fromEntries(Object.entries(card).filter(([key, value]) => value !== out.words.en[id][key]));
      if (Object.keys(own).length) changed[id] = own;
    }
    out.words[lang] = changed;
  }
  return out;
}
