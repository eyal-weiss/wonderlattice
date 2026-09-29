# Project state — 2026-09-29

## Visited marks and “Surprise me” — 2026-09-29

- **The owner approved five features, and they now come before new rooms** (label `next`): visited marks (#113),
  “Surprise me” (#114), a classroom kit (#115), display settings (#116), and a feedback box (#117, waiting for the
  owner's choice of where messages go).
- **Visited marks (#113):** a room you've opened shows a small dot in its colour on its card, and screen readers hear
  “(opened before)” after its name. The list stays in this browser (`wonderlattice.visited.v1`); About says so and has
  a button to forget it. There are no counts or scores anywhere.
- **“Surprise me” (#114):** a button under the home map's title, and a die in the room bar, open a room at random:
  one you haven't opened while any are left, and never the one you're in.

## A “New” line on the home map — 2026-09-29

- Under the home map's title, one line names the newest rooms: up to three from the last 30 days, newest first, each
  a button into its room (in five languages; on a phone it takes at most two lines). With nothing new it disappears.
  It reads each room's new `added` date, so the loop keeps it current just by building rooms (the rulebook and the
  add-a-room checklist say to set it). The fourteen rooms since launch have their dates from `main`'s history.

## Rooms load when they're needed — 2026-09-29

- **The published site now loads each room only when it's needed:** when it's opened, or when its card comes into
  view on the home map (docs/ARCHITECTURE.md, "Growing"). The build reads every room's card (theme, symbol, colour,
  and its name, eyebrow and tagline in each language) from the rooms themselves, so rooms, translators and
  `npm run rooms` work as before. Opened from disk, and in the standalone file, every room still loads with the page.
- **An English first visit is now 59 KB compressed, down from 370 KB.** Each language adds about 10 KB, and each room
  up to 23 KB when it opens. The budget is now per piece: the page 150 KB, each room 40 KB, each language 50 KB on a
  first visit and 10 KB per room, so it no longer runs out as rooms are added.
- **Measured on a throttled phone-like connection** (1.6 Mbps, 150 ms), gzipped, median of three: the home map's
  first room card appears after 1.1 s instead of 3.8 s (Hebrew: 1.2 s instead of 4.7 s), downloading 129 KB instead
  of 393 KB; a shared link opens its room after 1.1 s instead of 3.8 s, downloading 82 KB. The Hebrew home page looks
  pixel for pixel the same.
- A room that can't load (offline, say) says so and leaves the page usable; one that finishes loading after the
  visitor has moved on doesn't open. New tests cover these on the built site; the background loop's rulebook now runs
  the browser tests there too (`SERVE_DIR=dist npm run test:browser`), as CI does.

## Two rooms from the background loop, in five languages: twenty-seven — 2026-09-29

- **The loop's first two rooms**, built overnight one at a time and merged by the owner, both in Engineering:
  _A thousand samples, ten tests_ (`pools`, #107, closes #56), where ten pooled tests find the one glowing tube in
  1,000 by spelling its number in binary, then Dorfman pools for a crowd of 100; and _The shower that never settles_
  (`shower`, #108, closes #57), where an eager and a patient bather share a two-second pipe (a delay equation with sharp
  lines at 1/e and π/2).
- **Both are in Hebrew, Spanish, Portuguese and French** (#109). A check compared every number in every translated
  string, and every number the translated functions print, with the English: none changed. The Parrondo room's race
  tags are now translated in es/pt/fr too, and on Hebrew pages the shower's tap slider runs cold to hot from left to
  right, like the tap drawn in the picture.
- **The loop is paused** (owner, 2026-09-29) while the owner works on fixes and infrastructure. Resume with
  `wonderlattice-loop resume`.
- **The download budget is nearly used:** an English first visit is 369 KB of 400, and each language's words are
  82–87 KB of 100. One or two more rooms will fail CI until rooms load only when opened (ARCHITECTURE.md, "Growing").
- **Fixed after translating** (#110): sliders write numbers the way the page language does (0,5 in es/pt/fr, and
  1 % with its narrow space in French); the _pools_ chart's "one by one" label moves below its line when the curve runs
  through it; the _shower_ chart's "just right" label sits on a dark backing above the water lines, and the map's lowest
  label keeps clear of the dashed pipe line. On phones, the download button now stays at the end of the first row and a
  long action button starts the second, so the button row is no taller than before but the icon is never left on a
  row by itself (it was in 40 of the 130 room and language pairs at 390 px).
- **Preview links:** Cloudflare comments a PR's preview link only if the PR exists when the deploy finishes, so a PR
  opened seconds after its push (#108) gets none. The link is still under the PR's "Cloudflare Pages" check.

## A second contributor, an Engineering section, clearer phones, and the loop switched on — 2026-09-28 (evening)

- **Twenty-five rooms.** _The leaning tower of blocks_ (`blocks`, #101, closes #79) was built by a new contributor,
  ThatKJ, after two rounds of review. It is the first room in the new **Engineering** section (#102) and is translated
  into all five languages (#105). _Two losing games that win_ was translated too (#98).
- **From visitor feedback** (a phone felt cluttered; a short plain explanation should come first): on phones the
  picture now starts 90–130 px higher and the first control 300–400 px higher, and the room's own controls come
  before the extras (#103). Every room's subtitle is now a plain line saying what you see and what to try, in five
  languages (#104).
- **All ideas reviewed.** The owner approved all forty overnight ideas (#82 was redesigned as a game first) and four
  of the five older ones, now brought up to the new format (#6, #11, #13, #49). #8 was closed as not a good fit.
  Forty-two rooms are labelled `ready to build`; four are marked `next`.
- **The background loop is on** (docs/agents/BUILD_LOOP.md, #100): it builds approved rooms one at a time on the
  owner's machine, with at most three pull requests waiting for review, and never merges. A weekly feedback triage
  starts on Monday; the pinned issue #99 collects feedback from other places.

## Forty new ideas, and the first room from them: twenty-four — 2026-09-28

- **Two losing games that win** (`parrondo`, Chance & evidence, #96, closes #81): Parrondo's paradox in Harmer and
  Abbott's version. The room opens on a race: three crowds of 1,000 players play A, B, and A or B at random, and
  within seconds A and B sink while the mix climbs. Each game can also be played alone, with a band for the middle
  half of its players, or as a pattern the visitor taps out. The exact expectation comes from each game's 3-state
  Markov chain. The review changed the opening view, which had shown a single game in a fog of 1,000 dots. The
  Hebrew, Spanish, Portuguese and French text follows in its own pull request.
- **A pipeline of forty room ideas** (#56–#95): researched overnight in nine directions and filed as detailed issues.
  Ten are in a new direction, engineering (label `theme: engineering`): circuits, power lines, structures, lab
  sampling and feedback control. The pinned index, #19, now groups the ideas by direction and marks five to build
  first. The owner approved those five, and they carry the new label `ready to build` (#56, #57, #73, #81, #88; #81 is
  now built).
- **Protected `main`:** a pull request with a passing `check` is now required of everyone, the owner included.
- **Test cost, measured:** each room adds about 17 seconds of single-core browser testing. The full browser suite
  (152 tests) takes 83 seconds on 6 workers, or 2.7 minutes on 2, and CI runs it on GitHub's machines for every pull
  request.
- **Next (planned, not built yet):** a background build loop on the owner's machine that takes `ready to build`
  issues one at a time, never has more than three pull requests waiting for review, never merges, and catches up
  after the laptop has been closed; a weekly feedback round; an optional in-page feedback box; and a one-line
  "What's new" on the home page.

## Five more rooms: twenty-three — 2026-09-28

Built by five agents in parallel from issues, reviewed by the main session, and reviewed and merged by the owner.

- **The imperfect treasure detector** (`treasure`, Chance & evidence, #53, closes #5): Bayes' rule with 1,000 dots;
  a 95%-accurate detector's beep means treasure only 28% of the time when treasure is rare.
- **The impossible floor** (`floor`, Games & puzzles, #51, closes #10): dominoes, the colour invariant, Gomory's
  theorem and a matching solver that explains why a floor can't be tiled.
- **Weather twins** (`weather`, Signals & networks, #54, closes #16): Lorenz's butterfly; each extra decimal of
  precision buys about 2.5 more days.
- **How much picture can you throw away?** (`compress`, Signals & networks, #50, closes #17): the JPEG cosine
  transform; the strongest 10% of numbers rebuild a picture, the weakest 90% ruin it.
- **A secret shouted across the room** (`secret`, Signals & networks, #52, closes #18): Diffie–Hellman with paint and
  clock arithmetic, the site's first number-theory room.
- An English first visit is now 308 KB compressed (budget 400 KB). #12 was closed; the hat tile is now #49.

## Ready to grow — 2026-09-28

- **Languages** (#47): each language is a folder, `src/lang/<code>/`, with one file per room, so translators and room
  authors don't edit the same file. Visitors download only their own language (`src/lang/load.js`, driven by the
  generated `src/lang/languages.js`): an English first visit fell from about 429 KB to 256 KB compressed.
- **Rooms found automatically** (#47): tests discover the rooms, and `npm run rooms` links a new room into
  `index.html` (CI checks every room folder is linked).
- **Home cards** (#46) draw their pictures only as they come into view.
- **Download budget** (#47): CI fails past 400 KB compressed for English or 100 KB per language, about 30 rooms. That
  is the signal to load rooms on demand (ARCHITECTURE.md, "Growing").
- The fireflies room is now called "Fireflies that fall into step" (#45).

## Four more rooms overnight, per-room link previews — 2026-09-28

Built overnight by four agents in parallel (one room each, in its own branch), reviewed by the main session, and
merged by the owner in the morning. The site now has eighteen rooms.

- **A seed for an infinite landscape** (`julia`, Shape & space, #41, closes #9): drag a seed on the Mandelbrot set and
  its Julia set changes live; tap to follow one point's journey. The review fixed its home card on sharp screens.
- **Fireflies that fall into step** (`fireflies`, first named "A body full of clocks"; Living patterns, #39, closes #15): Kuramoto synchronisation with a
  day–night cycle and jet lag. Soft glows; the worst-case flicker is about 2% of the view.
- **A heartbeat travels** (`heart`, Living patterns, #40, closes #14): waves in an excitable medium (Barkley's model)
  that curl into spirals; explicitly a toy, not a heart simulation.
- **A tile that fills the world** (`tiles`, Making, #42, part of #12): an Escher-style tile editor with four edge
  rules. The "hat" aperiodic tile (part 2 of #12) is not done yet.
- **Share pages** (#38): `/room/<id>/` for every room, with its own title, tagline and picture
  (`assets/rooms/<id>.jpg`, from `npm run previews`), so links shared on Facebook, WhatsApp and X preview the room.
  "Copy this exploration" uses them on the built site; old links still work.
- **Phone fix** (#43): the visitor card no longer paints over the pinned picture.

## The first community room, a promo video, and wider reach — 2026-09-27

- **First room built by a contributor:** "Two players, three leaderboards" (`shots`, Chance & evidence), Simpson's
  paradox on a basketball court, by maham146 (#25, closing room idea #7). Reviewed twice (security and maths were
  fine). The maintainer pushed a polish commit to the contributor's branch: clearer bars, the leader in bold, and a
  compact one-line-per-player layout that fits phones and the pinned picture. It was translated into all four
  languages the same day (#35). Wonderlattice now has fourteen rooms.
- **Fresh files after every deploy:** browsers kept scripts and stylesheets for four hours (Cloudflare's default)
  while the page was always fresh, so returning visitors could get a new page with old scripts. The build now adds a
  content fingerprint to each file's address in `dist/index.html` (`app.js?v=…`); a browser test checks every
  fingerprint on the built site (#34).
- **Hebrew credit** spells the owner's name איל וייס (#33).
- **Promo video:** a 61-second square video of the real site (recorded frame by frame under Playwright's fake
  clock), with captions and original music generated in code. It shows the drawing room, the dice flipping, the new
  room, the ribbon, the plane, the cube coming home after 105 repeats, a fingerprint growing, the traffic paradox and
  the storm. The tools are kept outside the repository.
- **Reach:** almost 1,000 unique visitors from about 50 countries (mostly Israel and the US). The owner submitted to
  Hacker News and posted the video on X, asking people to share it with teenagers and in the Israeli maths teachers'
  Facebook group.
- **Housekeeping:** the old private repository `wonderloom` was deleted after its history and pull requests were
  backed up offline.

## First feedback, first contributors, and phones — 2026-09-26 (later)

- **Phones (from an iPhone tester):** a finger on a room's picture now scrolls the page unless the room drags there
  (#30): rooms declare it with `pointer.drag` (ARCHITECTURE.md). On phones the picture stays pinned at the top while
  the controls scroll under it, so a slider's effect is visible as it moves (#31). Both were tested in Chrome's iPhone
  emulation only; Playwright's WebKit doesn't run on this machine.
- **Still open from the same tester:** "choosing the dice doesn't work" on iPhone Safari. Every way of picking (the
  buttons, the set menu, tapping a die in the circle) works in emulation; the owner is asking which control failed.
- **Narration:** when a device has voices but none for the page language (often Hebrew on Windows and Linux), a message
  says how to add one instead of reading silently or in the wrong voice (#27). Nobody has listened to the four new
  languages yet.
- **Language menu** moved from the footer to the header (#28); "Português (Brasil)" is now "Português" there.
- **First outside contributions:** #24 (yonatangross) mirrors the layout on right-to-left pages with logical CSS
  properties and keeps numbers in order; merged. #25 (maham146) adds a Simpson's paradox room for issue #7; reviewed
  (no security concerns, maths correct) and changes requested: `./` script paths, formatting, a text scope matching
  the room id, and a browser test.
- **Tooling:** the build and translation scripts work on Windows and in folders with spaces (`fileURLToPath`), and
  both stop with a clear message when `index.html` links a local script without `./` (#29).
- **Launch:** the owner submitted to Carnival of Mathematics, emailed IMAGINARY and the Davidson Institute, and asked
  for feedback on X on the room issues and the translations.

## Four languages, room ideas, and the launch — 2026-09-26

- **Launch:** posted on X and LinkedIn; about 600 unique visitors in the first days, mostly from Israel, some from the
  US. No written feedback yet.
- **Translations:** Hebrew (right-to-left), Spanish, Brazilian Portuguese and French, one pull request each (#20–#23).
  Each was drafted by a Claude agent, reviewed by GPT (`gpt-6-astra`, high effort) acting as a native editor and
  mathematician, and the findings judged one by one before merging. They're machine translations with review, not a
  native speaker's read: the owner is asking for corrections from native speakers. Hebrew wraps formulas and signed
  numbers in bidi isolates so they read left to right.
- **Fixes the reviews found:** three explanations were made precise in every language (conformal maps need a complex
  derivative and f′ ≠ 0; Euler's officers need two Latin squares laid over each other; the fingerprint model has no
  quadratic terms). English plurals for "1 minute" and "1 pixel"; Hebrew labels are no longer letter-spaced; cube move
  buttons read U′ in right-to-left pages.
- **Room ideas as issues:** 14 proposed rooms are GitHub issues #5–#18 (labels `room idea`, `effort: …`, `theme: …`),
  indexed in the pinned issue #19. Four are marked `good first issue`.
- **Size:** the standalone file carries every language and is now about 1.3 MB.

## New room: The shot mix — 2026-09-26

A new "Chance & evidence" room, `shots`. Two players take close-range and far-range shots; the visitor drags how
many attempts each player takes of each type and watches three leaderboards (close, far, overall). One player can
lead both individual leaderboards yet trail overall, once the mix of shot types differs enough between them —
Simpson's paradox. The "Split into close and far" action swaps each player's close/far attempt counts so the
reversal can be watched happening live. Presets: an even mix (no reversal), a skewed mix, and an extreme mix
(90%/80% skill, 10 vs. 900 attempts — the clearest flip). Only the Overall bars move as the sliders change; the
Close-range and Far-range bars stay fixed length, since they show each player's unchanging skill rate — this is
intentional, not a bug, but it can look static at first. The explanation cites Simpson's 1951 paper and the 1973
Berkeley admissions case (Bickel, Hammel & O'Connell, _Science_ 1975). Visitors: Edward H. Simpson (drawn sketch,
no MacTutor biography exists so no `bio` link) and George Udny Yule (drawn sketch, `bio: 'Yule'`).

Unit tests cover the model (`tests/unit/shots.test.js`): the paradox itself with the extreme-preset numbers, a
basic sanity check, and the zero-attempts edge case. Not yet added: a browser test in `tests/browser/`. Two
pre-existing, unrelated issues found along the way: `tests/browser/plane.spec.js`'s axis-label test fails on this
machine, and `npm run build` / `npm run i18n:check` crash on Windows from a doubled drive-letter path bug in
`scripts/build.mjs` / `scripts/i18n.mjs`. Neither is caused by this change.

## Live and public — 2026-09-25

- **Hosting:** Cloudflare Pages at https://wonderlattice.com (bought at Cloudflare Registrar), deployed from `main`,
  with a preview for every pull request. Build command `npm run build`, output `dist/`, Node from `.node-version`.
- **Security headers:** `_headers` sets a strict content policy (only the site's own scripts, no framing, no outside
  connections). `scripts/serve.mjs` applies the same file, so the browser tests on `dist/` run under it.
- **For strangers:** a new README, CONTRIBUTING.md and SECURITY.md; canonical and link-preview tags use the real
  address; the privacy note names Cloudflare.
- **Cloudflare settings:** Web Analytics, Email Address Obfuscation and Rocket Loader are off (they would change the
  page or add tracking), and a redirect rule sends `www.wonderlattice.com` to `wonderlattice.com` (301, path and
  query kept).
- **The repository is public.** Private vulnerability reporting, secret scanning with push protection and Dependabot
  alerts are on. `main` is protected: changes arrive by pull request with the `check` job passing; no force-pushes or
  deletion (the owner can bypass in an emergency).

## Renamed to Wonderlattice — 2026-09-24

"Wonderloom" is in use by the WonderLoom® children's craft toy and several shops, so the site is now Wonderlattice
(.com and .org were unregistered when checked). Everything visible, the code namespace (`Wonderlattice`), storage
keys and file names changed. Trails saved or exported under the old name still open (`wonderloom.trail.v1`,
`"format": "wonderloom-trail"`). The project moved to a new repository, `eyal-weiss/wonderlattice`, with the same history. Commits are now authored under the owner's CMU address, and one portrait whose rights were
unclear (Nash, already replaced by a sketch) was removed from every commit. Pull request numbers in older commit
messages refer to the original, private repository.

## Pre-release reviews — 2026-09-24

Two reviews before going public: one for legal, privacy, security and accessibility, one for design and UX. The shared
fixes are in #25; the room fixes landed together, after it.

- **Legal and privacy:** About now covers privacy (no accounts, no tracking, the trail stays in the browser), who made
  it, disclaimers, trademark and image credits. LICENSE excludes the third-party portraits; Lissajous and Nash are now
  drawn sketches. The cube room is "Inside the puzzle cube", with the trademark named once.
- **Accessibility:** page titles, a skip link, focus after Back/Forward, labels that start with their visible text,
  announcements instead of chatty live regions, a keyboard grid for Sudoku, contrast fixes, and no flashing in the
  cube and dice (measured).
- **Layout:** the stage is a flex column, so nothing overlaps at any width; a test checks every room at 320–1024px.
- **Security:** language files must pass an allowlist before they run (`scripts/lang-guard.mjs`), and translated text
  is matched to English's shape and cleaned. Two Codex reviews found gaps; all are closed and tested.
- **Rooms:** plainer words, British spelling, faster plane drawing (60 fps on a slowed phone), fingerprints that grow
  on slow devices.

Left for later: single cube turns still animate (a short motion the visitor asked for), the home map leaves space at
wide widths, og:image needs an absolute address once hosted, and a trademark search for the name Wonderlattice.

## Thirteen rooms, and ready for translation — 2026-09-24

**The roadmap's rooms are all built.** Bend the plane, A spoonful of a city, Grow a fingerprint, and a scoped Inside the
puzzle cube (about moves, not solving) join the earlier nine. Each was built from a written brief (four by sub-agents,
the cube in the main session), then reviewed by an independent agent before merging. Each review found real issues,
all fixed and covered by regression tests. For example:

- a false "f′ = 0" claim in Bend the plane;
- sampling dots replaying their animation;
- fingerprint replays that didn't match live growth;
- the cube not redrawing under reduced motion.

**Every visitor-facing word is now in a dictionary:**

- each room's `text.en.js`;
- the shared `src/core/text.en.js`;
- the fixed page text, marked `data-t` in `index.html`.

Contributors add a language as one file: `npm run i18n:new -- he "עברית" rtl` creates `src/lang/he.js` from English and
links it. `npm run i18n:check`, which also runs in CI, reports coverage and mistakes. Right-to-left layout, the
narration voice and a footer language menu follow the language file. A pseudo-language browser test fails if any
visible text bypasses the dictionaries. English rendering was verified pixel-identical before and after (58 screenshot
pairs). No translation is included yet.

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

The row of room tabs is replaced by a home map, so Wonderlattice can grow past a handful of rooms. It shows rooms as
cards with a still picture, grouped by theme (Shape & space, Chance & evidence, Games & puzzles, Making, Living
patterns, Signals & networks). Empty themes are hidden. Inside a room, a slim bar offers "All experiments" and
previous/next. The address follows the visitor (`#room=<id>`, no hash on the map), so Back and Forward work. Rooms
set themselves up only when first opened. Mathematician visitors are now optional, with no ↻ for a single visitor.
New rooms can use drawn sketch faces instead of photographs. A small translation mechanism
(`Wonderlattice.defineText` / `text`) is ready for the new rooms; converting the existing rooms' words is the next step.

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
`dist/wonderlattice-standalone.html` (one ~480 KB file with portraits inlined). Added 12 model unit tests, 18 Playwright
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

- An in-app "Make your own version" flow: source download and an AI prompt containing the current settings. It fits
  the owner's aim of making maths a hobby with AI help.
- Native-speaker reads of the four translations, and listening to narration in each language.
- Manual checks that automation can't do: real phones and screen readers.
- Wider launch: Mathstodon, Bluesky, r/math's weekly thread, Show HN (hand-written, per HN's rules), Israeli teacher
  groups after Sukkot (from 2026-10-04), and the Haifa elementary-maths teacher centre.
- The dice-picking report from iPhone Safari (above), and checking the phone fixes and the four new rooms on a real
  iPhone.
- Native-speaker reads of the new rooms' translations.
- A permanent link from the personal website, once feedback warrants it.

## Next priorities

1. Gather feedback on the rooms, the translations and the phone fixes.
2. Help contributors build rooms from the remaining ideas (#6, #8, #11, #13) and the hat tile (#49).
3. More languages when native reviewers are available; the country list can guide which.
4. Small decisions left from the overnight rooms: a name that mentions the fireflies, and the empty space around the
   Julia pictures on desktop.
