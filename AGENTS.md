# Wonderlattice: brief for the next collaborator

Read README.md, docs/ARCHITECTURE.md, and docs/STATUS.md first. Don't assume access to earlier chat history or the
original hosting service.

## Purpose and taste

A noncommercial mathematical playground for Eyal Weiss. Fun, beauty, curiosity, and surprising experiences come
first. Optional explanations offer insight. It shouldn't feel like a lesson, homework, or a scored exercise. Welcome
people without a strong mathematical background. Preserve both solo exploration and easy sharing.

## Architecture in one paragraph

`index.html` holds page structure only. Each room is one `Wonderlattice.defineRoom({...})` in `src/rooms/<id>/room.js`,
with its mathematics in `src/rooms/<id>/model.js` (pure, Node-tested). Canvas rooms share the stage in
`src/core/stage.js`; the drawing room has its own layout. `src/core/app.js` builds navigation, links, trail, and agent
hooks from the room registry, so there's one list of rooms. All scripts are classic scripts (not ES modules) so the
page works from `file://`. Details and the add-a-room checklist are in docs/ARCHITECTURE.md.

## Constraints

- No AI API, bundler, or proprietary hosting is needed to run the app. Keep it that way; keep `index.html` working
  when double-clicked, and keep `npm run build` producing the single-file export.
- Keep sound and narration opt-in. Stop audio when switching rooms and respect reduced-motion settings.
- Keep keyboard/touch interaction, responsive layout, visible focus, and optional explanations.
- Explain model limitations honestly and cite mathematical sources. Don't imply a classic result is newly invented.
- Shared-link parameters and the trail export format are public contracts; don't break old links or exports.
- Keep English as the default and visitor-facing words in room definitions, not scattered through logic
  (docs/TRANSLATING.md).
- Don't add accounts, tracking, payments, external AI services, or paid dependencies without the owner's request.
- Keep code readable: no minified one-line code. `npm run format` applies the house style.

## Verify changes

Run `npm run check`. It covers lint, formatting, model tests, the build, and browser tests: every room, keyboard
navigation, sound on/off, shared links, PNG export, the trail, reduced motion, phone widths, `file://`, and the
standalone file. Add tests for new behaviour. Automated checks can't hear audio or judge visuals, so for those also
look and listen in a real browser. Report what you tested and what remains unverified.

## Working with other agents

The owner's GitHub repository, `eyal-weiss/wonderlattice`, is the source of truth. Create a new branch from current `main` for each task
(for example `agent/hebrew-copy`), keep your own checkout or worktree, open a pull request, and report the branch and
any conflicts. Don't push to `main`, merge your own pull request, force-push, or publish without the owner's
approval. See docs/COLLABORATING.md.

## Handoff after each session

Update docs/STATUS.md, commit on the task branch, open a pull request, and say how to run it. Keep unfinished work
explicit so progress doesn't depend on a chat's memory. Ask before posting to the owner's accounts or incurring costs.
