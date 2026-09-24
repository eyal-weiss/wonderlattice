# Wonderloom

A playground for beautiful mathematical ideas, owned and directed by Eyal Weiss.

Thirteen small rooms, each built around one surprise, grouped on a home map by theme:

- **Shape & space:** drawing with two turning arms, a one-sided ribbon in 3D, and bending the plane with complex
  functions (a circle becomes a wing).
- **Chance & evidence:** dice that beat each other in a circle, and a toy city where a huge biased poll is confidently
  wrong.
- **Games & puzzles:** Sudoku seen as colouring a network, and the Rubik's Cube's moves (R U needs 105 repeats to come
  home).
- **Making:** a loom that weaves cloth, twill, and houndstooth from a grid of choices.
- **Living patterns:** a flock with no leader, and fingerprints grown by reaction–diffusion.
- **Signals & networks:** waves and sound, a picture sent through a storm of flipped bits, and a road that slows every
  driver.

Each room has an optional explanation, with sources, and a visiting mathematician. You can save moments to a private
"My trail". There are no accounts, tracking, AI services, or runtime dependencies. Every word can be translated: see
docs/TRANSLATING.md.

## Open it

Double-click **index.html**. It works offline, in any modern browser, with no installation.

To send someone a single file, run `npm run build` and share `dist/wonderloom-standalone.html`. It holds the whole
app, portraits included.

Sound starts only after a click. Narration uses the browser's voices, and some voices need the internet. External
reading links need the internet. A copy opened from disk shares settings as text rather than links.

**My trail** keeps up to 24 saved moments (a small image, the room settings, an optional note) in this browser's local
storage. Export it as JSON to back it up or move it to another browser; importing replaces the current trail.
Clearing site data removes it.

## Change it

Edit a file, save, and refresh the browser. There's no build step during development.

- `src/rooms/<room>/room.js`: a room's words, controls, drawing, and visitors
- `src/rooms/<room>/model.js`: its mathematics
- `styles/`: the look
- `index.html`: page structure and dialogs

**docs/ARCHITECTURE.md** explains how the pieces fit and has a checklist for adding a room. **AGENTS.md** is the
brief for any coding assistant.

## Optional tools

With Node.js 20 or later:

```sh
npm ci                  # once, installs the test and formatting tools
npm start               # serve at http://localhost:4173
npm test                # model tests
npm run test:browser    # behaviour tests in a real browser
npm run build           # dist/ plus dist/wonderloom-standalone.html
npm run i18n:check      # check translation files
npm run check           # everything CI runs
```

The first time you run the browser tests, install their browser with `npx playwright install chromium`. On Linux
systems Playwright doesn't support, use your own Chrome: `PW_CHANNEL=chrome npm run test:browser`.

Without Node, `python3 -m http.server 4173 --bind 127.0.0.1` also serves the folder.

## Publish it

It's a static site. Upload the contents of `dist/` (after `npm run build`) to any static host in your own account,
for example Cloudflare Pages, Netlify, or GitHub Pages (Pages on a private repository needs a paid GitHub plan). No
backend, environment variables, or credentials are needed. The old ChatGPT-hosted address is separate and was not
transferred.

## Working on it

This private repository, `eyal-weiss/wonderloom`, is the source of truth. Work happens on a branch per task with a
pull request into `main`; CI runs lint, formatting, model tests, a build, and browser tests on every pull request. See
docs/COLLABORATING.md.

## Documents

- docs/ARCHITECTURE.md: structure, the room contract, adding a room, checks
- docs/STATUS.md: what exists, what's unfinished, what's next
- docs/PORTRAITS.md: portrait sources and rights
- docs/TRANSLATING.md: localization and Hebrew layout guidance
- docs/COLLABORATING.md: branches, pull requests, prompts for other assistants
- docs/PROVENANCE.md: where the code came from
- LICENSE: MIT (code and text; portraits carry their own terms)
