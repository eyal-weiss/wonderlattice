/*
 * A pseudo-language for tests: every English string, wrapped in ⟦…⟧, in a
 * right-to-left layout. Any visible text left unwrapped is a string that
 * hasn't been moved into a dictionary. Injected by tests/browser/i18n.spec.js.
 */
(() => {
  const W = globalThis.Wonderlattice;
  const wrap = (s) =>
    typeof s !== 'string'
      ? s
      : s.includes('<')
        ? s.replace(/(^|>)([^<]+)(?=<|$)/g, (m, a, text) => a + (text.trim() ? `⟦${text}⟧` : text))
        : `⟦${s}⟧`;
  const pseudo = (v) =>
    typeof v === 'function'
      ? (...args) => wrap(v(...args))
      : Array.isArray(v)
        ? v.map(pseudo)
        : v && typeof v === 'object'
          ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, pseudo(x)]))
          : wrap(v);
  W.defineLanguage('xx', { name: '⟦Pseudo⟧', dir: 'rtl', speech: 'en-US' });
  for (const [scope, langs] of Object.entries(W.dictionaries()))
    if (langs.en) W.defineText(scope, 'xx', pseudo(langs.en));
  const define = W.defineText.bind(W);
  W.defineText = (scope, lang, strings) => {
    define(scope, lang, strings);
    if (lang === 'en') define(scope, 'xx', pseudo(strings));
  };
  // The fixed page text, read from the document parsed so far (the scripts sit at the end of the body).
  const page = {};
  const put = (key, value) => {
    const parts = key.split('.');
    let o = page;
    for (const p of parts.slice(0, -1)) o = o[p] ??= {};
    o[parts.at(-1)] = value;
  };
  document
    .querySelectorAll('[data-t]')
    .forEach((el) =>
      put(
        el.dataset.t,
        el.dataset.t.endsWith('Html') ? wrap(el.innerHTML) : wrap(el.textContent.replace(/\s+/g, ' ').trim()),
      ),
    );
  document.querySelectorAll('[data-t-attr]').forEach((el) => {
    for (const pair of el.dataset.tAttr.split(';')) {
      const [attribute, key] = pair.split(':').map((x) => x.trim());
      put(key, wrap(el.getAttribute(attribute)));
    }
  });
  define('page', 'xx', page);
})();
