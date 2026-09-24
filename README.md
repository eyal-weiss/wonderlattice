# Wonderloom

A playground for beautiful mathematical ideas, owned and directed by Eyal Weiss.

Small rooms, each built around one surprise: drawing with two turning arms, waves and sound, a flock, a one-sided
ribbon in 3D, a traffic shortcut that slows everyone down, a loom that weaves cloth from a grid of choices, and more on
the way (docs/ROADMAP.md). Each room has an optional explanation and a visiting mathematician, and you can save
moments to a private "My trail". There are no accounts, tracking, AI services, or runtime dependencies.

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
