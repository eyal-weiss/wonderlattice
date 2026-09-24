# Project state — 2026-09-24

## Three more rooms — 2026-09-24

Each was built by a sub-agent in its own worktree from a written brief, then reviewed and integrated one pull request
at a time. Independent reviews (Codex/GPT, and a Claude reviewer when Codex hit its usage limit) caught real issues
before merging.

- **The dice that beat each other** (Chance & evidence). Nontransitive dice: whichever die you pick, the room picks one
  that usually beats it. Includes Efron's four dice and Grime's dice, whose circle reverses when you roll two of each,
  with exact odds shown on a circle of victories. Pascal visits as a sketch.
- **Send a picture through a storm** (Signals & networks). A drawn picture is sent through random bit flips with no
  protection, three copies, a parity bit, or Hamming(7,4), with exact expected-damage curves. Hamming visits as a
  sketch.
- **Sudoku, made transparent** (Games & puzzles). A 4×4 board of colours, shapes or digits; candidates fade as you
  place, a network view shows Sudoku as graph colouring, and logical steps explain themselves. Euler visits.

## The mathematical loom — 2026-09-24

A new "Making" room. A four-shaft weaving draft (threading, tie-up, treadling) sits beside the cloth it weaves. The
cloth grows one pass at a time, a shuttle carries each new pass across, and colour orders turn twill into houndstooth.
Visitors toggle the 16 tie-up squares or pick a preset: plain weave, twill, houndstooth, "stripes, not checks", bird's
eye, or chevron. The room reports how often the cloth repeats and how long its floats are, including a warning when a
thread never interlaces. The drawdown is the Boolean product treadling × tie-up × threadingᵀ, unit-tested against an
independent product. The visitor is a drawn sketch of Ada Lovelace.

## Home map — 2026-09-24 (branch `agent/home-map`)

The row of room tabs is replaced by a home map, so Wonderloom can grow past a handful of rooms. It shows rooms as
cards with a still picture, grouped by theme (Shape & space, Chance & evidence, Games & puzzles, Making, Living
patterns, Signals & networks). Empty themes are hidden. Inside a room, a slim bar offers "All experiments" and
previous/next. The address follows the visitor (`#room=<id>`, no hash on the map), so Back and Forward work. Rooms
set themselves up only when first opened. Mathematician visitors are now optional, with no ↻ for a single visitor.
New rooms can use drawn sketch faces instead of photographs. A small translation mechanism
(`Wonderloom.defineText` / `text`) is ready for the new rooms; converting the existing rooms' words is the next step.

## Maintainability refactor — 2026-09-24 (branch `agent/maintainability`)

The single 92 KB `index.html`, written as minified one-line code, is now readable files: `styles/` (4 stylesheets),
`src/core/` (namespace, shared stage, app shell), `src/features/` (visitors, trail), and `src/rooms/<id>/` (a pure
`model.js` and a `room.js` per room). Rooms register themselves in one registry. Navigation, keyboard order, shared
links, trail validation, and agent tools all derive from it, replacing about eight hand-maintained room lists. The page
still opens from disk with no build.

Visitor behaviour is unchanged. 17 browser tests were written against the original code first and pass unchanged on
the new code. Deterministic screenshots of 27 states (every room, dialogs, trail, reduced motion, 320–1280 px) match
the original pixel for pixel, apart from sub-frame animation timing noise. Deliberate small changes:

- "Trace it all" strokes neighbouring same-colour segments together: 1.3–1.7× faster (about 670 → 380 ms on a 4×
  throttled phone CPU), visually identical.
- The "My trail" header icon is ✧ instead of ↗ (it opened a dialog, not a link, and duplicated the traffic icon).
- The page description mentions the traffic room.
- A shared drawing link without `room=` now also switches to the drawing room when it arrives by hash change.

Tooling: Vite is replaced by zero-dependency `scripts/serve.mjs` and `scripts/build.mjs`. The build writes `dist/` and
`dist/wonderloom-standalone.html` (one ~480 KB file with portraits inlined). Added 12 model unit tests, 18 Playwright
browser tests, ESLint, Prettier, and GitHub Actions CI that runs everything on each pull request.

## Working and included

- Geometry: drawing with combined rotations, presets, parameter controls, PNG export.
- Waves: summed signals, audible tones, phase cancellation, beats, Lissajous portraits.
- Emergence: adjustable flocking model, pointer interaction, neighbor view.
- Topology: interactive projected ribbon, half-twists, highlighted edges, traveler.
- Networks: Braess traffic paradox with adjustable demand, visible route markers, and a before/after travel-time
  comparison (65 → 80 minutes at 4,000 drivers).
- Mathematician visitors: two per room, historical portraits in paper-puppet bodies, original captions, biography and
  portrait-source links. Figures without a trustworthy likeness were left out (Hypatia, Sophie Germain, Dietrich Braess).
- My trail: saved stills, settings and notes, later reflections, links between related rooms, JSON export/import,
  browser-local only, 24 moments.
- Optional explanations, browser narration, link/settings sharing, responsive layout, reduced motion.
- Offline use, a single-file export, MIT license, AI handoff, architecture, and translation guides.

## Not yet done

- An in-app "Make your own version" flow: source download and an AI prompt containing the current settings.
- Hebrew (or other) translation. Visitor-facing words now live in room definitions, which makes this easier, but
  there's no language dictionary or selector yet.
- Publishing for public visitors under an owner-controlled account. The last ChatGPT-hosted site was owner-only.
  GitHub Pages on this private repository needs a paid plan; Cloudflare Pages or Netlify work on free plans.
- Manual release checks that automation can't do: listening to audio and narration, real phones, screen readers.
- A short demo video and social launch material. Nothing has been posted.
- A permanent link from the personal website, once feedback warrants it.

## Next priorities

Following docs/ROADMAP.md (review section):

1. Next rooms: bend the plane, a spoonful of a city, grow a fingerprint; later a scoped Rubik's cube.
2. With the Hebrew translation: move the five original rooms' words into `text.en.js` files.
3. Move the storm, dice, and Sudoku rooms' inline styles into `styles/rooms.css`.
4. Decide on hosting and publish `dist/`.
