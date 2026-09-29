/*
 * Loads the visitor's language, and only that one. Rooms read their words as they start, so the
 * language's files are written into the page while it is still being read: they run right after
 * this script and before the rooms, whether the page comes from the web or from disk. English
 * needs no files. src/lang/languages.js (generated) lists the languages and their files.
 * On the published site, a room that loads on demand brings its words with it.
 */
(() => {
  const W = Wonderlattice;
  let asked = null;
  try {
    asked =
      new URLSearchParams(location.search).get('lang') ||
      localStorage.getItem('wonderlattice.lang') ||
      localStorage.getItem('wonderloom.lang'); // the site's earlier name
  } catch {
    /* no address or storage */
  }
  const files = asked && Object.hasOwn(W.languageFiles ?? {}, asked) ? W.languageFiles[asked] : null;
  if (!files) return;
  // On the published site the build adds a fingerprint per file, so a browser never mixes old and new words.
  const versions = W.languageVersions?.[asked] ?? {};
  for (const scope of files) {
    // A room the published site loads on demand brings its words when it comes (Wonderlattice.loadRoom).
    if (W.loadsLater(scope)) continue;
    const version = versions[scope] ? `?v=${versions[scope]}` : '';
    document.write(`<script src="./src/lang/${asked}/${scope}.js${version}"></script>`);
  }
})();
