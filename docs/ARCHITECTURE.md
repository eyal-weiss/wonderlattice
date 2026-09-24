# How Wonderloom is built

Wonderloom is a static site with no runtime dependencies. You can open `index.html` from disk, or serve the folder
from any static host. There is no bundler: the browser loads the files in `src/` directly.

## The one rule that shapes everything

Every file in `src/` is a **classic script**, not an ES module. Browsers block module imports on pages opened from
`file://`, and double-clicking `index.html` must keep working. So:

- scripts load in the order of the `<script>` tags at the bottom of `index.html`;
- files share one global namespace, `Wonderloom` (plus `WonderloomGuests` and `WonderloomTrail`);
- each file wraps itself in `(() => { 'use strict'; … })()` and exports by attaching to that namespace.

## Map

```
index.html                 page structure only: header, home map, room bar, the two room layouts, dialogs, script tags
styles/
  base.css                 colours, header, workspace, controls, buttons, dialogs, drawing-room layout
  rooms.css                the shared stage, presets, readouts, traffic result
  home.css                 the home map (themed room cards) and the room bar
  guests.css               mathematician puppets
  trail.css                My trail
src/
  core/wonderloom.js       namespace, helpers (toast, copy, download, narration), room registry, themes, text
  core/stage.js            the shared stage used by canvas rooms (#new-room)
  core/app.js              home map, room switching, history and shared links, dialogs, trail and agent wiring; runs last
  features/guests.js       renders a room's mathematician visitors
  features/trail.js        My trail (localStorage, export/import)
  rooms/<id>/model.js      the room's mathematics: pure functions, no DOM, unit-tested in Node
  rooms/<id>/room.js       the room itself: words, settings, controls, drawing, visitors, explanation
  rooms/<id>/room.css      optional styles for that room only (class names prefixed with the room id)
portraits/                 bundled portrait images (rights in docs/PORTRAITS.md)
scripts/serve.mjs          zero-dependency local server  (npm start)
scripts/build.mjs          builds dist/ and dist/wonderloom-standalone.html  (npm run build)
tests/unit/                model tests (node --test)
tests/browser/             behaviour tests in a real browser (Playwright)
```

## Rooms

A room is one call to `Wonderloom.defineRoom({...})` in `src/rooms/<id>/room.js`. The registry is the single list of
rooms. The home map, the room bar's previous/next, shared links, trail validation, and agent tools all read from it.
On the map, rooms are grouped by `theme` (the list is `Wonderloom.themes`); within a theme they follow script order.
A theme with no rooms is not shown.

The address always says where you are: `#room=<id>` in a room and no hash on the map, so Back and Forward work and
any room can be linked. A room's `init()` runs the first time it is opened, not at page load.

There are two kinds of room:

- **Stage rooms** (waves, flock, ribbon, traffic) use the shared stage in `#new-room`: title, canvas, transport
  buttons, a control panel, three presets, and a connection to another room. The room supplies content and drawing
  code; `src/core/stage.js` does the rest.
- **Custom rooms** (`layout: 'custom'`, currently only motion) bring their own markup (`#motion-room`) and logic. The app
  just shows their `panel` and calls their hooks.

### Stage room fields

| Field                                                             | Purpose                                                                                                     |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `id`                                                              | Lowercase letters; used in URLs (`#room=id`), trail entries, tab ids. Never rename a published id.          |
| `symbol`, `eyebrow`, `name`                                       | The room bar and home card. `name` also labels trail entries.                                               |
| `theme`, `tagline`                                                | Which home-map group the card sits in, and its one-line description.                                        |
| `accent`                                                          | Optional `{ background, border, color }`; `border` tints the home card on hover.                            |
| `title`, `subtitle`, `field`, `sceneLabel`, `sceneName`, `tip`    | Visitor-facing words on the stage.                                                                          |
| `actionLabel`, `canvasLabel`, `panelEyebrow`, `whyLabel`, `nudge` | Button label, canvas accessibility label, panel words.                                                      |
| `connection`                                                      | `{ html, go, label }`: the "follow a thread" link to another room id.                                       |
| `defaults`                                                        | Initial settings. Numbers and booleans only. Every boolean is shareable automatically.                      |
| `ranges`                                                          | `{ key: [min, max] }` or `[min, max, 'integer']`: numeric settings accepted from links and the trail.       |
| `presets`, `defaultPreset`                                        | Three `{ name, note, badge, settings }`, and the one highlighted at first.                                  |
| `guests`                                                          | Mathematician visitors (see below).                                                                         |
| `insight`                                                         | `{ title, html, onOpen?(settings) }`: the "Why does this happen?" dialog.                                   |
| `controls(s, stage)`                                              | Returns the room's control markup. Use `stage.slider(...)` and `stage.check(...)`; they bind automatically. |
| `draw(ctx, s, stage)`                                             | Draw one frame. `stage.width`, `stage.height`, `stage.clock` (seconds), `stage.playing`.                    |

Optional hooks, all given `(settings, stage)` unless noted: `bindControls(panel, s, stage)` for custom controls,
`readouts(s)` to update status text, `step(dt, s, stage)` per animation frame, `action` for the third transport
button, `reset` for "Start again", `onPreset`, `onInput`, `enter` when the room opens, `pointer: { down, move, up, leave, escape, arrow, key }` (`key(event, s, stage)` receives
other keys pressed on the canvas and returns true when it handled one), `extraSettings()` / `restore(saved, s, stage)` for trail state that isn't in `settings`, and
`silence()` / `soundOn()` for rooms that make sound, and `preview(ctx, width, height)` to draw the home-card picture
(by default the card shows `draw()` with `defaults` plus optional `previewSettings`, at clock 0; a room whose `draw`
touches the page or needs set-up must supply `preview`).

### Custom room hooks

`layout: 'custom'`, `panel` (element id), `init()`, `enter()`, `preview(ctx, width, height)`,
`applyParams(URLSearchParams)` for shared links, `capture()` / `restore(settings, title)` for the trail, and
`agentTools(app)`.

## Words and languages

The page language is fixed for a visit: `?lang=he`, else a saved choice, else English (`Wonderloom.lang`). A room keeps
its visitor-facing words in `src/rooms/<id>/text.en.js`:

```js
Wonderloom.defineText('dice', 'en', { title: 'The dice that beat each other.', rolls: (n) => `${n} rolls` });
```

and reads them once with `const t = Wonderloom.text('dice')`. A translation is another file, such as `text.he.js`,
loaded after the English one; any key it leaves out falls back to English. Strings can be functions when they need
numbers. The mathematics in `model.js` never contains visitor-facing words.

## Add a room: checklist

1. Copy `src/rooms/traffic/` to `src/rooms/<id>/` and rename. Put the mathematics in `model.js` and attach it to
   `Wonderloom.models.<id>`, and the words in `text.en.js`. Pick a `theme` and write a `tagline`.
2. Add the `<script>` tags (`model.js`, `text.en.js`, `room.js`) to `index.html`, before `src/core/app.js`.
3. Add unit tests for the model in `tests/unit/`, and import the model in `tests/unit/load.js`.
4. Optionally add a visitor: a drawn `sketch` (below) needs no image rights. A photograph goes in `portraits/`, with
   its source and rights in `docs/PORTRAITS.md`.
5. Add the room to `ROOMS` in `tests/browser/helpers.js`, and a browser test for its surprise. Mention it in the page
   `description` and the README if it deserves it.
6. Optional: add trail `bridges` in `src/features/trail.js`, and room-specific CSS in `src/rooms/<id>/room.css`, linked
   in the head of `index.html` after `styles/trail.css` (the build inlines it).
7. Run `npm run check`. When several checkouts run browser tests at once, give each its own port:
   `PW_PORT=4711 PW_CHANNEL=chrome npm run check`.

## Shared links and saved moments are public contracts

Links like `#room=motion&k=-5&r=42&p=0&ink=0` and trail exports (`wonderloom-trail`, version 1) live outside the app.
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

`npm run build` copies the site to `dist/` and writes `dist/wonderloom-standalone.html`, a single file with every
stylesheet, script, and portrait inlined. The build reads the `<link>` and `<script>` tags from `index.html`, so
there's no separate list to keep up to date.

## Checks

- `npm test` runs the model tests (no browser, instant).
- `npm run test:browser` runs behaviour tests in Chromium: every room, keyboard navigation, sound on/off, shared links,
  PNG export, the trail, reduced motion, phone widths, `file://`, and the standalone file. Locally you can use your
  installed Chrome: `PW_CHANNEL=chrome npm run test:browser`.
- `npm run lint`, `npm run format:check` (`npm run format` fixes formatting).
- `npm run check` runs all of the above. CI (`.github/workflows/ci.yml`) runs it on every pull request.

Automated tests don't hear audio or judge beauty. For visual or audio changes, also look and listen in a real browser.
