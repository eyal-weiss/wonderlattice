# Adding a language

Wonderloom is written in English, and every visitor-facing word lives in a dictionary, so a translation is a single
file. You don't need to touch any room's code.

## Start a language

With Node.js installed (see the README):

```sh
npm ci                                   # once
npm run i18n:new -- he "עברית" rtl        # code, the language's own name, and rtl for right-to-left
```

This creates `src/lang/he.js`, filled with every English string as a starting point, and links it from `index.html`.
Open `index.html?lang=he` to see it. A language menu appears in the footer once there is more than one language, and
the choice is remembered.

## Translate

Edit `src/lang/<code>.js` in any text editor. It has one block per part of the site: `app` for shared words, one per
room (`loom`, `dice`, …), and `page` for the fixed text of the page.

- **Translate as much or as little as you like.** Anything you delete, or haven't reached yet, shows in English.
- **Strings written as functions**, such as `(n) => \`${n} rolls\``, receive numbers or names. Keep each `${…}`, and
move it wherever your language needs it. You can also add grammar, for example `(n) => (n === 1 ? … : …)`.
- **Keys ending in `Html`** may contain a little markup, such as `<strong>`, `<em>` or `<br />`. Keep the tags balanced.
- **Keep formulas, units and numbers as they are**: x, y, z, cos, Hz, %. Use the local conventions for everything
  around them.
- **Right-to-left languages** get `dir="rtl"`, which mirrors the layout. Canvas pictures stay the same, because the
  mathematics doesn't change direction.
- **Narration** uses the `speech` locale in `defineLanguage` (for example `he-IL`). If the browser has no voice for it,
  the text is still there to read.

## Check

```sh
npm run i18n:check
```

It reports how much of each language is translated and lists what's still in English. It fails on mistakes: an
unknown key (usually a typo or an outdated key), a string where a function is expected (or the reverse), or a language
file that isn't linked from `index.html`. It also warns when a function takes a different number of values, or a
string's `${…}` placeholders differ from English. CI runs it on every pull request.

Then look at the result: open each room with `?lang=<code>`, and try a phone-width window too. Ask a native speaker to
read it for tone and line breaks.

## For developers: keeping the site translatable

- **Room words** go in `src/rooms/<id>/text.en.js` (`Wonderloom.defineText('<id>', 'en', {...})`), and `room.js` reads
  them with `const t = Wonderloom.text('<id>')`. That includes words drawn on a canvas and aria-labels. The mathematics
  in `model.js` never contains visitor-facing words.
- **Shared words** (the stage, navigation, trail, visitors, narration) are in `src/core/text.en.js`, under `app`.
- **Fixed page text** stays in `index.html`, in English, marked with `data-t="key"` (or `data-t="keyHtml"` when it
  contains markup) and `data-t-attr="aria-label:key; title:key"` for attributes. The tools read the English from there.
- **A browser test enforces all this.** `tests/browser/i18n.spec.js` loads a pseudo-language that wraps every string
  in ⟦…⟧ and uses right-to-left layout. It then visits every room, its explanation and the trail, and fails if any
  visible text or label was never wrapped: a word someone forgot to put in a dictionary.
- **Shared-link parameters and room ids** are not translated.
