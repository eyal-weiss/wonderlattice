# The background build loop

A scheduled agent on the owner's machine builds approved rooms one at a time, and once a week gathers visitor
feedback. This file is its rulebook. Each run reads it fresh from `origin/main`, so a change here takes effect once
it's merged. The runner script and its timers live outside the repository on the owner's machine. They only start a
run and check the limits below; every decision about the work is made here.

Nobody answers questions during a run. When something needs the owner, write it in the pull request or the digest
issue, and stop.

## Hard rules

- **Never merge** a pull request, push to `main`, force-push a branch someone else works on, or change repository
  settings. The owner reviews and merges everything.
- **One step per run**, then stop. A step is one of the tasks below, finished to the point of an updated or new
  pull request.
- **Only approved work.** Take only issues labelled `ready to build` (the owner adds it), plus translating rooms
  that have already merged.
- **No more than three pull requests waiting.** The runner checks before starting, and the step checks again before
  it opens a new one: `gh pr list --state open` must list fewer than 3.
- **Don't edit `docs/STATUS.md`** in room pull requests (they would conflict); the weekly triage keeps it current.
- Follow AGENTS.md, CONTRIBUTING.md and the add-a-room checklist in docs/ARCHITECTURE.md like any contributor.

## Claiming work

Work belongs to whoever has labelled the issue `in progress`. The owner's own sessions use the same label, so the
loop never takes an issue that is already claimed. To claim an issue, add `in progress` and comment
"Claimed by the build loop." A claim with no pushed commits for 48 hours may be taken over. Say so in a comment.

Each task gets its own branch, `agent/<issue number>-<short-name>`, in its own worktree under `.claude/worktrees/`,
never in the owner's checkout.

## A build step, in order of priority

Do the first of these that has something to do.

1. **Fix a loop pull request.** If an open pull request from an `agent/` branch has failing CI, or review comments
   from the owner that haven't been answered, address them, push, and reply to each comment.
2. **Resume.** If an issue is `in progress` for the loop and its branch exists without a pull request, continue it.
3. **Translate.** If a merged room is still English-only in some languages (`npm run i18n:check` lists its strings as
   untranslated), open one pull request translating it into every language, following docs/TRANSLATING.md and each
   language's conventions in its `language.js`. Look at the room in each language at phone width, and right to left
   in Hebrew.
4. **Build the next approved issue.** Choose from open `ready to build` issues that aren't `in progress`, in this
   order: anything labelled `feedback` or `bug` first, then anything labelled `next`, then the lowest issue number.

If there is nothing to do, write one line saying so and stop.

## Building a room well

The issue describes the surprise, the visitor's first minute, the mathematics, what to keep honest, build notes and
sources. Build to that. The issue's suggestions (visitors, extra floors) are optional. These lessons come from
reviews:

- **The surprise lands without reading or clicking.** Within about ten seconds of opening, the room already shows
  its surprise. Explore controls come after. (The Parrondo room first opened on one game in a fog of dots, and the
  paradox only appeared after a click.)
- **Look at it.** Take screenshots at 1280×900 and 390×844, during the animation and at its end. On the desktop view,
  the part that matters must be above the fold. Automated tests passed on rooms that looked wrong.
- **Recompute the mathematics independently** (a short script, not the room's own code) and put the checked numbers
  in `model.js` tests.
- **Honesty:** say what the model leaves out; cite sources you have opened; word open or contested results carefully.
  Living people appear only as drawn sketches, and their captions are in the third person.
- **Security:** `innerHTML` only ever receives the site's own text and numbers, never values from a link or the
  visitor. Shared-link values are clamped by `ranges`.
- **Theme:** the room's `theme` follows the issue's theme label (`theme: engineering` → `'engineering'`).
- **Text:** every visitor-facing word goes in `text.en.js`, in British spelling. New rooms ship in English; translation
  is a separate step, after the room merges.

## Testing, gently

The owner uses the machine while the loop runs. The runner sets `PW_WORKERS=2`, so the browser tests use two
workers, plus its own `PW_PORT` and `PW_CHANNEL=chrome`.

- While building, run only what's relevant: the room's unit tests and its own browser spec.
- Before opening or updating a pull request, run the full `npm run check` once, then the browser tests on the built
  site, where rooms load on demand: `SERVE_DIR=dist npm run test:browser` (CI runs both).
- CI runs the whole suite on GitHub for every push and is the final gate. Wait for it (`gh pr checks <n> --watch`)
  and fix failures before stopping.

## The pull request

Title: `Add room: <name> (closes #<n>)`. Describe what the visitor sees in the first minute, the mathematics you
checked and how, what you tested, and what remains unverified: sound, real phones, and taste. List any choices the
owner should make. Comment on the issue with the pull request's link. Keep the issue `in progress` until the pull
request merges or closes.

## The weekly triage (Monday)

1. Gather what arrived since the last digest (the newest issue labelled `digest`):
   - issues and comments by people other than the owner and the loop;
   - comments in the pinned "Feedback inbox" issue, where the owner pastes feedback from social media and email;
   - entries from the site's feedback box, once it exists.
2. Turn each actionable item into an issue labelled `feedback` (and `bug` where it is one), merging duplicates and
   linking the source. Don't label anything `ready to build`; that's the owner's choice.
3. Open "Weekly digest: <date>", labelled `digest` and assigned to the owner. List:
   - the week's feedback and themes, and the issues filed;
   - pull requests waiting for review, with their age;
   - the approved queue and what's in progress;
   - dates in the next two weeks from the owner's promotion calendar, if the runner passes one.

   Then close the previous digest.

4. If the project moved on during the week, update `docs/STATUS.md` in a small pull request (the one place the loop
   edits it). It counts toward the limit of three.
