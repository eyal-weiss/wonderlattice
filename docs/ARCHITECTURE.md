# How Wonderlattice is built

Wonderlattice is a static site with no runtime dependencies. You can open `index.html` from disk, or serve the folder
from any static host. There is no bundler: the browser loads the files in `src/` directly.

## The one rule that shapes everything

Every file in `src/` is a **classic script**, not an ES module. Browsers block module imports on pages opened from
`file://`, and double-clicking `index.html` must keep working. So:

- scripts load in the order of the `<script>` tags at the bottom of `index.html`;
- files share one global namespace, `Wonderlattice` (plus `WonderlatticeGuests` and `WonderlatticeTrail`);
- each file wraps itself in `(() => { 'use strict'; … })()` and exports by attaching to that namespace.

## Map

```
index.html                 page structure only: header, home map, room bar, the two room layouts, dialogs, script tags
styles/
  fonts.css                the typefaces (files in fonts/, each with its licence)
  base.css                 colours (day and night), header, workspace, controls, buttons, dialogs, drawing-room layout
  rooms.css                the shared stage, presets, readouts, traffic result
  home.css                 the home map (the route through every room, its key and list) and the room bar
  guests.css               mathematician puppets
  trail.css                My trail
src/
  core/display.js          display settings (larger text, high contrast); runs in the page's head, before drawing
  core/wonderlattice.js       namespace, helpers (toast, copy, download, narration), room registry, themes, text
  core/stage.js            the shared stage used by canvas rooms (#new-room)
  core/app.js              home map, room switching, history and shared links, dialogs, trail and agent wiring; runs last
  features/guests.js       renders a room's mathematician visitors
  features/trail.js        My trail (localStorage, export/import)
  features/feedback.js     the feedback box: a message to the maker, at the end of each explanation and in About
  rooms/<id>/model.js      the room's mathematics: pure functions, no DOM, unit-tested in Node
  rooms/<id>/room.js       the room itself: words, settings, controls, drawing, visitors, explanation
  rooms/<id>/room.css      optional styles for that room only (class names prefixed with the room id)
functions/api/feedback.js  the feedback box's inbox: a Cloudflare Pages Function at /api/feedback (the only server code)
portraits/                 bundled portrait images (rights in docs/PORTRAITS.md)
fonts/                     Rubik (day), IM Fell English, Frank Ruhl Libre and Amiri (night): SIL Open Font License
assets/                    link previews (social.jpg; rooms/<id>.jpg), the map's pictures (rooms/thumbs/), the icon
scripts/serve.mjs          zero-dependency local server  (npm start)
scripts/build.mjs          builds dist/ and dist/wonderlattice-standalone.html  (npm run build)
scripts/room-cards.mjs     reads every room's card for the built site, which loads rooms on demand (see Growing)
scripts/budget.mjs         what the built site downloads, against a budget  (npm run budget)
scripts/previews.mjs       draws the map's pictures and the link previews from the rooms' previews  (npm run previews)
scripts/i18n.mjs           translation tools  (npm run i18n:check, npm run i18n:new)
scripts/lang-guard.mjs     the allowlist a language file must pass before it runs
tests/unit/                model tests (node --test)
tests/browser/             behaviour tests in a real browser (Playwright)
```

## Rooms

A room is one call to `Wonderlattice.defineRoom({...})` in `src/rooms/<id>/room.js`. The registry is the single list of
rooms. The home map, the room bar's previous/next, shared links, trail validation, and agent tools all read from it.

### The route

The rooms' order in the registry, which is the order of their `<script>` tags in `index.html`, is the **route**: the
numbers on the home map (1, 2, 3…) and the room bar's ‹ ›. Many visitors simply follow the numbers, so the order is
designed as a tour in which each room is unlike the one before, and a visit of five minutes or an hour brings
several different kinds of experience and idea:

- neighbouring rooms never share a theme, or a kind of experience (making something beautiful, intuition fooled,
  something alive, a physical surprise, a trick with information, space that bends, a puzzle, chaos, sound);
- the first rooms pay off within a minute and need no reading; every theme appears within the first nine;
- rooms with a similar idea sit at least four apart; rooms that need more reading, or suit older visitors, come late.

The home map draws the route: each room sits next to the one before it on a triangular lattice, and one line joins
them in order (`placeMap` in `src/core/app.js`). On wide screens the line winds down one column and up the next, four
rooms to a column (more when the pictures would get small); on phones it zigzags down the page, three and two to a
row; right-to-left pages mirror it. Each room's cell takes its theme's colour, and a key names the themes. Under the
map, a list names every room by theme. A new room joins the route where it adds the most variety: move its tags.
`tests/unit/route.test.mjs` checks that neighbours never share a theme, that every theme appears among the first ten
rooms, and that every room has its pictures (each at most 20 KB); `tests/browser/rooms.spec.js` checks that each
room sits next to the one before it at four screen widths.

**Rooms wait for their translations.** A new room arrives in English and its translations follow, so until every
language has its words (a file in `src/lang/<code>/`, listed in `src/lang/languages.js` by `npm run i18n:sync`), the
room is not _published_ (`Wonderlattice.published(id)`): it isn't on the map, the route, the room bar's ‹ ›, the
"New" line or Surprise, and no room's "Visit…" button leads to it. A direct link (`#room=<id>`) still opens it, for
review and for translators. The translation that completes it puts it on the map, where its place on the route is
already set; the published route must also keep neighbours from different themes (`tests/unit/route.test.mjs`), and
`tests/browser/translations-first.spec.js` checks the rest.

The address always says where you are: `#room=<id>` in a room and no hash on the map, so Back and Forward work and
any room can be linked. A room's `init()` runs the first time it is opened, not at page load.

There are two kinds of room:

- **Stage rooms** (waves, flock, ribbon, traffic) use the shared stage in `#new-room`: title, canvas, transport
  buttons, a control panel, three presets, and a connection to another room. The room supplies content and drawing
  code; `src/core/stage.js` does the rest.
- **Custom rooms** (`layout: 'custom'`, currently only motion) bring their own markup (`#motion-room`) and logic. The app
  just shows their `panel` and calls their hooks.

### The picture's frame

On wide screens (two columns, from 961 px) a room's picture sits beside its panel. Its frame is as tall as the panel
but never taller than the window, and it stays in view (sticky) while a longer panel scrolls past, so a control or a
readout far down the panel still shows its effect (`styles/base.css`, next to the phones' rule). On phones the picture
is pinned above the controls, which scroll under it. Either way a room draws for the canvas it is given, which at
common sizes is about 834 × 678 (1280×900), 1074 × 858 (1920×1080), 662 × 546 (1024×768) and 344 × 287 (a phone):

```
 opened                          scrolled down the panel
 ┌──────────────┬───────┐       ┌──────────────┬───────┐
 │   picture    │ panel │       │   picture    │ lower │
 │   buttons    │  …    │       │   buttons    │ panel │
 └──────────────┤       │       └──────────────┤       │
```

The picture fills it: `tests/browser/picture-fills.spec.js` checks every room at five sizes for an empty strip taller
than a sixth of the picture. (Before, the frame stretched to the panel's length, up to 1,150 px, and a room that drew
a fixed-shape picture left an empty band under it.)

### Stage room fields

| Field                                                             | Purpose                                                                                                       |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `id`                                                              | Lowercase letters; used in URLs (`#room=id`), trail entries, tab ids. Never rename a published id.            |
| `symbol`, `eyebrow`, `name`                                       | The room bar (symbol) and the map (name; `name` also labels trail entries). `eyebrow` is a short topic label. |
| `theme`, `tagline`                                                | Its theme (the colour of its cell on the map, and its group in the list), and its one-line description.       |
| `accent`                                                          | Optional `{ background, border, color }`, the room's own colours.                                             |
| `title`, `subtitle`, `field`, `sceneLabel`, `sceneName`, `tip`    | Visitor-facing words on the stage.                                                                            |
| `actionLabel`, `canvasLabel`, `panelEyebrow`, `whyLabel`, `nudge` | Button label, canvas accessibility label, panel words.                                                        |
| `connection`                                                      | `{ html, go, label }`: the "follow a thread" link to another room id.                                         |
| `defaults`                                                        | Initial settings. Numbers and booleans only. Every boolean is shareable automatically.                        |
| `ranges`                                                          | `{ key: [min, max] }` or `[min, max, 'integer']`: numeric settings accepted from links and the trail.         |
| `presets`, `defaultPreset`                                        | Three `{ name, note, badge, settings }`, and the one highlighted at first.                                    |
| `guests`                                                          | Mathematician visitors (see below).                                                                           |
| `insight`                                                         | `{ title, html, onOpen?(settings) }`: the "Why does this happen?" dialog.                                     |
| `controls(s, stage)`                                              | Returns the room's control markup. Use `stage.slider(...)` and `stage.check(...)`; they bind automatically.   |
| `draw(ctx, s, stage)`                                             | Draw one frame. `stage.width`, `stage.height`, `stage.clock` (seconds), `stage.playing`.                      |

Optional hooks, all given `(settings, stage)` unless noted: `bindControls(panel, s, stage)` for custom controls,
`readouts(s)` to update status text, `step(dt, s, stage)` per animation frame, `action` for the third transport
button, `reset` for "Start again", `onPreset`, `onInput`, `enter` when the room opens, `pointer: { down, move, up, leave, escape, arrow, key }` (`key(event, s, stage)` receives
other keys pressed on the canvas and returns true when it handled one; `down` also receives the pointer event, and
`up(event)` the pointerup or pointercancel event, so a room can ignore other buttons and cancelled gestures), `extraSettings()` / `restore(saved, s, stage)` for trail state that isn't in `settings`, and
`silence()` / `soundOn()` for rooms that make sound, and `preview(ctx, width, height)` to draw the room's picture for
the map and link previews, made by `npm run previews` (by default the picture shows `draw()` with `defaults` plus optional `previewSettings`, at clock 0; a room whose `draw`
touches the page or needs set-up must supply `preview`).

Stage extras:

- `still: true` hides Pause, for turn-based rooms with no continuous animation.
- `trailCanvas(s, stage)` returns a canvas to save as the trail picture, e.g. a finished drawing rather than a
  mid-animation frame.
- `pointer.drag` says where a finger drags instead of scrolling the page. Leave it out for rooms that only take taps
  (the canvas then scrolls like the rest of the page); `true` for rooms that drag anywhere on the canvas; or a function
  `(p, s, stage) => boolean` for rooms that drag only in places, such as the plane's left picture.
- A room with any `pointer` hook gets an interactive canvas (`role="application"`, described by the visible tip), so
  keep the tip's keyboard hints accurate.
- Call `Wonderlattice.announce(text)` when a result settles, so screen readers hear it once. Don't put `role="status"` on
  panels that are rebuilt often.

### Custom room hooks

`layout: 'custom'`, `panel` (element id), `init()`, `enter()`, `preview(ctx, width, height)`,
`applyParams(URLSearchParams)` for shared links, `capture()` / `restore(settings, title)` for the trail, and
`agentTools(app)`.

## Words and languages

Every visitor-facing word lives in a dictionary, so the site can be translated without touching code:

- A room's words are in `src/rooms/<id>/text.en.js`
  (`Wonderlattice.defineText('dice', 'en', { title: '…', rolls: (n) => \`${n} rolls\` })`), read once in `room.js`with`const t = Wonderlattice.text('dice')`. Strings can be functions when they need numbers.
- Shared words are in `src/core/text.en.js` (the `app` scope). Fixed page text stays in `index.html`, marked with
  `data-t` / `data-t-attr`.
- A language is a folder, `src/lang/<code>/`, created with `npm run i18n:new`: `language.js`
  (`Wonderlattice.defineLanguage(code, { name, dir, speech })`), `app.js`, `page.js`, and one file per room. Any key
  it leaves out falls back to English. `src/lang/languages.js`, generated by `npm run i18n:sync`, declares every
  language (for the menu) and lists its files; `src/lang/load.js` then writes only the visitor's language files into
  the page as it loads, so they run before the rooms read their words. The build inlines every language into the
  standalone file and fingerprints the language files for the published site.
- The page language is fixed for a visit: `?lang=he`, else a saved choice, else English (`Wonderlattice.lang`).
  `document.documentElement` gets its `lang` and `dir`, and a footer menu appears once two languages exist.

`npm run i18n:check` validates language files (first against the allowlist in `scripts/lang-guard.mjs`, since they are
scripts), and translated markup is cleaned at runtime by `Wonderlattice.safeMarkup`. A pseudo-language browser test fails if any visible text bypasses the
dictionaries. The step-by-step guide for translators is docs/TRANSLATING.md.

## Day and night

The site has two looks, which share every layout: **day** (the default, for every visitor), a science-museum floor
map in ink on light paper with a yellow accent and Rubik; and **night**, a star atlas in ivory and gold on deep blue,
with engraved-style headings (IM Fell English, with Frank Ruhl Libre for text and Hebrew, Amiri for Arabic). The sun
and moon button in the header switches them; the choice stays in this browser (`wonderlattice.theme`), and
`src/core/display.js` marks the page `<html data-theme="night">` before anything is drawn.

- **Colours are tokens** (base.css): `--bg`, `--panel`, `--panel-2`, `--ink`, `--soft`, `--muted`, `--line`,
  `--line-strong`, `--edge`, `--em` (emphasised words and numbers), `--accent` and `--accent-ink`, `--focus`, and a
  colour per theme, `--t-<theme>`. Night and high contrast redefine them. A room's stylesheet uses the tokens, never
  colours made for one look; words in a figure's own colour go through `.ink-tint` (with `--c` set to the colour).
- **The pictures are dark in both looks.** The room's picture and its frame (`.drawing`), and the visitor card, are
  dark windows with their own tokens, so a canvas drawn for a dark ground looks the same by day and at night.
- **Typefaces** are served with the site (`fonts/`, declared in styles/fonts.css): a page downloads only the scripts it
  uses, and the day typeface is preloaded. Once the page has loaded, the night typefaces are fetched quietly, so the
  first switch is instant. Browsers won't load font files into a page opened from disk, so there the page uses the
  device's fonts (`data-fonts="device"`); the standalone file carries its fonts inside it.
- **Checked on every page:** all words reach 4.5:1 by day and at night, and 7:1 in high contrast (by day on a
  phone, at night on a desktop): `tests/browser/display.spec.js`.

## Display settings

The Display button in the header opens a dialog with a text size (normal, large, larger) and high contrast. The
choices stay in this browser (`wonderlattice.textSize`, `wonderlattice.contrast`); high contrast also comes on by
itself when the device asks for more contrast (`prefers-contrast: more`), until the visitor chooses. `src/core/display.js`
runs in the page's head, so a returning visitor never sees the page jump, and marks the page:
`<html data-text-size="large" data-contrast="more">`. The stylesheets do the rest:

- **Text sizes are in rem** (1rem = 16px at the normal size: 0.875rem = 14px, 0.8125rem = 13px, 0.75rem = 12px), and
  base.css sets the root to 125% or 150%. A size that must not grow, such as the wordmark or a glyph that is part of a
  drawing, is in px with the words "keeps its size" on its line; `tests/unit/styles.test.mjs` checks this. Layouts
  adapt with `:root[data-text-size]` rules: a wider panel beside the picture, one column of controls and cards on a
  phone, and words that break rather than stick out.
- **High contrast** raises `--ink`, `--muted`, `--line` and `--focus-width` in base.css, and each stylesheet ends with
  `:root[data-contrast='more']` rules for its own secondary text and borders. Page text reaches at least 7:1. The rooms'
  own colours keep their meaning (a coloured figure is lightened, never replaced).
- **The pictures are unchanged**: text drawn on a canvas keeps its size and colours. The dialog says so, and suggests
  the browser's zoom to enlarge everything.

A room's own stylesheet sizes text in rem, uses `var(--muted)` for secondary text, and adds a high-contrast rule for
any other grey it picks. `tests/browser/display.spec.js` opens every room at the largest size and in high contrast on
a phone: nothing may stick out, every control must be reachable, and all page text must reach 7:1.

## The feedback box

Each room's explanation ends with a closed line, "Send a message to the maker", and About has one too
(`src/features/feedback.js`). Nothing is sent until the visitor presses Send. Then the words, the page they came from
(`place`: an explanation or About, and the room) and the page language go, as JSON, to `/api/feedback` on the site's
own address, so the Content-Security-Policy (`connect-src 'self'`) needs no change.

- **The inbox** is `functions/api/feedback.js`, a Cloudflare Pages Function: Pages deploys everything in `functions/`
  alongside the built site. It files each message as an issue in the private repository
  `eyal-weiss/wonderlattice-feedback`. The visitor's words go in a code block, so they can't mention anyone, link or
  format anything, and the title holds no visitor text. Nothing else is filed: no name, no address.
- **The token** is a fine-grained GitHub token limited to that repository, with Issues: read and write only, stored as
  the secret `FEEDBACK_GITHUB_TOKEN` in the Pages project (Settings → Variables and Secrets, for Production and
  Preview). Only the owner can see or change it. To replace it, make a new token, paste it over the secret and
  redeploy; the function logs "GitHub answered 401" when the old one no longer works.
- **Spam:** a hidden field only robots fill in (they're told all went well, and nothing is filed), a 2,000-character
  limit, JSON only, the site's own origin only, and at most five messages per address in ten minutes. That count uses
  Cloudflare's cache, per data centre, with the address hashed, and lets a message through if the count fails. If
  spam gets past this, Cloudflare Turnstile is the next step, though it loads a script from Cloudflare.
- **Where there's no inbox:** opened from a file (and in the standalone copy) the box links to this repository's
  issues instead. `npm start` has no inbox either, so sending there says it couldn't be sent.
- **Reading them:** new messages are read there, and each is closed once handled.

Tests: `tests/unit/feedback.test.mjs` runs the function against a stand-in GitHub, and
`tests/browser/feedback.spec.js` the box against a stand-in inbox.

## Add a room: checklist

1. Copy `src/rooms/traffic/` to `src/rooms/<id>/` and rename. Put the mathematics in `model.js` and attach it to
   `Wonderlattice.models.<id>`, and every visitor-facing word (including canvas labels and aria-labels) in `text.en.js`.
   Pick a `theme`, write a `tagline`, and set `added` to the day it goes live (`'2026-10-02'`): the home map names it
   on its "New" line for 30 days. Its panel's colours come from the tokens (see Day and night). The published site loads each room on its own (see Growing), so the top of
   `room.js` uses only the core, the stage and the room's own model and words; page work goes in its functions.
2. Run `npm run rooms`: it adds the room's `<script>` tags (and `room.css`, if any) to `index.html`, before
   `src/core/app.js`, which makes it the last stop on the route. Move its tags to where it adds the most variety
   (see The route). CI checks every room folder is linked.
3. Add unit tests for the model in `tests/unit/`. The unit tests and the browser tests find every room by themselves.
4. Optionally add a visitor: a drawn `sketch` (below) needs no image rights. A photograph goes in `portraits/`, with
   its source and rights in `docs/PORTRAITS.md`.
5. Add a browser test for its surprise. Mention it in the page `description` and the README if it deserves it.
6. Optional: add trail `bridges` in `src/features/trail.js`, and room-specific CSS in `src/rooms/<id>/room.css`
   (`npm run rooms` links it; the build inlines it). Size its text in rem and give it high-contrast rules (see
   Display settings).
7. Run `npm run previews -- <id>` and commit what it makes: the room's picture on the home map
   (`assets/rooms/thumbs/<id>.webp`, and `<id>-wide.webp` for its card when someone points at it) and its share page's
   link preview (`assets/rooms/<id>.jpg`). Without them the map shows a plain dark disc, and the share page falls
   back to the site's picture. Look at the room by day and at night.
8. Run `npm run check`. When several checkouts run browser tests at once, give each its own port:
   `PW_PORT=4711 PW_CHANNEL=chrome npm run check`.

## Growing

Opened from disk, and in the standalone file, every room loads with the page. The published site loads each room only
when it's needed, so the page stays small however many rooms there are:

- The build writes `dist/src/rooms/cards.js`: every room in order, with its card for the home map (theme, symbol,
  colour, and its eyebrow, name and tagline; each language's words go in `dist/src/lang/<code>/cards.js`) and its
  files. `scripts/room-cards.mjs` reads the cards from the rooms themselves, by running the page's scripts in Node
  against a browser that does nothing, so there's nothing extra to keep up to date. The published `index.html` loads
  the cards in place of the rooms' `<script>` and `<link>` tags.
- `Wonderlattice.loadRoom(id)` brings a room's files once, in order: its model, its words (English, then the page
  language), then its code, and its stylesheet. The app calls it when a room is opened (from the map, the room bar, a
  shared link or the trail) and waits for it; a room that finishes loading after the visitor has moved on stays shut,
  and one that can't load says so. The home map needs no room's code: its pictures are small ready-made images
  (`assets/rooms/thumbs/`), loaded as they come into view. A room with its own layout (the drawing room) stays in the
  page.
- If the build can't read a room's card, it stops and names the room. The browser tests run on the built site in CI;
  to run them there yourself: `npm run build`, then `SERVE_DIR=dist npm run test:browser`.

`npm run budget` (part of `npm run check`) measures what the published site downloads, in compressed kilobytes: the
page on a first visit (the core, the cards and the day typeface: at most 150 KB), each room when it loads (40 KB), and
each language's words (50 KB on a first visit, and 10 KB for each room). It also reports the map's pictures, which
load as they come into view.

## Shared links and saved moments are public contracts

Link previews (Facebook, WhatsApp, X) read no further than the address before `#`, so the build also makes a share page
per room, `dist/room/<id>/index.html`, with the room's own title, tagline and picture (`assets/rooms/<id>.jpg`, made by
`npm run previews`). It forwards to `/#room=<id>…`, keeping the settings after `#` and `?lang=`. On the built site
"Copy this exploration" links to the share page (`/room/<id>/#room=<id>&…`); opened from disk it links to the page
itself. Both kinds of link keep working.

Links like `#room=motion&k=-5&r=42&p=0&ink=0` and trail exports (`wonderlattice-trail`, version 1) live outside the app.
Keep existing parameter names (for example `ink`, not `palette`, in drawing links) and accept old values. If a
format must change, bump the trail `version` and keep reading version 1.

## Mathematicians

Visitors are optional; a room may have none, one, or several (↻ appears only with two or more). Each is
`{ name, note, color }` plus a face, and optionally `bio` (the MacTutor biography slug) for a "Story" link.

- **A drawn sketch** (preferred for new rooms): `sketch: { hairStyle, hair, skin, beard, moustache, glasses, brows,
backdrop }`. It's a playful caricature of a few recognisable features, not a likeness, so it needs no image rights.
  The options are listed in `src/features/guests.js`.
- **A historical portrait**: `image` (a file in `portraits/`), `source` (the Wikimedia Commons file name), and `frame`
  (`[portrait width, x offset, y offset]` inside the 56 px head). Credit-required images add `credit` and
  `license: { name, url }`.

Captions are original writing, never quotations.

## Builds

`npm run build` copies the site to `dist/` and writes `dist/wonderlattice-standalone.html`, a single file with every
stylesheet, script, typeface, portrait and map picture inlined. The build reads the `<link>` and `<script>` tags from `index.html`, so
there's no separate list to keep up to date. In `dist/`, rooms load on demand (see Growing), and every file's address
carries a fingerprint of its contents.

## Checks

- `npm test` runs the model tests (no browser, instant).
- `npm run test:browser` runs behaviour tests in Chromium: every room, keyboard navigation, sound on/off, shared links,
  PNG export, the trail, reduced motion, phone widths, `file://`, and the standalone file. Locally you can use your
  installed Chrome: `PW_CHANNEL=chrome npm run test:browser`.
- `npm run lint`, `npm run format:check` (`npm run format` fixes formatting).
- `npm run check` runs all of the above. CI (`.github/workflows/ci.yml`) runs it on every pull request, in three jobs
  side by side: the quick checks and the build, the browser tests on the source, and the browser tests on the built
  site (without the sweeps over every room's styles and words, which are the same there). The job named `check`
  passes when all three do; it's the one the main branch requires.
- On CI a failed browser test runs once more; one that passes then is reported as flaky (in the run's summary and
  annotations) instead of failing the build. Locally every failure counts. A test that walks through every room calls
  `test.slow()`, since it grows with each new room.

Automated tests don't hear audio or judge beauty. For visual or audio changes, also look and listen in a real browser.
