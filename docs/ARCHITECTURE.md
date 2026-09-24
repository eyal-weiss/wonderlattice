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
index.html                 page structure only: header, the two room layouts, dialogs, script tags
styles/
  base.css                 colours, header, workspace, controls, buttons, dialogs, drawing-room layout
  rooms.css                room tabs, the shared stage, presets, readouts, traffic result
  guests.css               mathematician puppets
  trail.css                My trail
src/
  core/wonderloom.js       namespace, helpers (toast, copy, download, narration), room registry
  core/stage.js            the shared stage used by canvas rooms (#new-room)
  core/app.js              navigation, room switching, shared links, dialogs, trail and agent wiring; runs last
  features/guests.js       renders a room's mathematician visitors
  features/trail.js        My trail (localStorage, export/import)
  rooms/<id>/model.js      the room's mathematics: pure functions, no DOM, unit-tested in Node
  rooms/<id>/room.js       the room itself: words, settings, controls, drawing, visitors, explanation
portraits/                 bundled portrait images (rights in docs/PORTRAITS.md)
scripts/serve.mjs          zero-dependency local server  (npm start)
scripts/build.mjs          builds dist/ and dist/wonderloom-standalone.html  (npm run build)
tests/unit/                model tests (node --test)
tests/browser/             behaviour tests in a real browser (Playwright)
```

## Rooms

A room is one call to `Wonderloom.defineRoom({...})` in `src/rooms/<id>/room.js`. The registry is the single list of
rooms. The navigation tabs, keyboard navigation, shared links, trail validation, and agent tools all read from it, and
the order of the script tags sets the tab order.

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
| `symbol`, `eyebrow`, `name`                                       | The navigation tab. `name` also labels trail entries.                                                       |
| `accent`                                                          | Optional `{ background, border, color }` for the selected tab.                                              |
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
button, `reset` for "Start again", `onPreset`, `onInput`, `enter` when the room opens, `pointer: { down, move, up,
leave, escape, arrow }`, `extraSettings()` / `restore(saved, s, stage)` for trail state that isn't in `settings`, and
`silence()` / `soundOn()` for rooms that make sound.

### Custom room hooks

`layout: 'custom'`, `panel` (element id), `init()`, `enter()`, `applyParams(URLSearchParams)` for shared links,
`capture()` / `restore(settings, title)` for the trail, and `agentTools(app)`.

## Add a room: checklist

1. Copy `src/rooms/traffic/` to `src/rooms/<id>/` and rename. Put the mathematics in `model.js` and attach it to
   `Wonderloom.models.<id>`.
2. Add the two `<script>` tags to `index.html`, before `src/core/app.js`. Their position sets the tab position.
3. Add unit tests for the model in `tests/unit/`, and import the model in `tests/unit/load.js`.
4. Add portraits to `portraits/` and document their source and rights in `docs/PORTRAITS.md`.
5. Update the words that count the rooms: the About dialog in `index.html`, the page `description`, and the README.
   Tests that expect five tabs (`tests/browser/`) will tell you where.
6. Optional: add trail `bridges` in `src/features/trail.js` and room-specific CSS in `styles/rooms.css`.
7. Run `npm run check`.

## Shared links and saved moments are public contracts

Links like `#room=motion&k=-5&r=42&p=0&ink=0` and trail exports (`wonderloom-trail`, version 1) live outside the app.
Keep existing parameter names (for example `ink`, not `palette`, in drawing links) and accept old values. If a
format must change, bump the trail `version` and keep reading version 1.

## Mathematicians

Each guest is `{ name, note, bio, image, source, color, frame }`. `bio` is the MacTutor biography slug, `source` the
Wikimedia Commons file name, and `frame` is `[portrait width, x offset, y offset]` inside the 56 px head. Credit-required
images add `credit` and `license: { name, url }`. Captions are original writing, never quotations.

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
