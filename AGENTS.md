# Wonderloom: brief for the next collaborator

Read README.md and docs/STATUS.md first. This independent folder is the working project. Do not assume access to ChatGPT history or the original hosting service.

## Purpose and taste

A noncommercial mathematical playground for Eyal Weiss. Fun, beauty, curiosity, and surprising experiences come first. Optional explanations offer insight. It should not resemble a lesson, homework, or a scored exercise. Welcome people without a strong mathematical background. Preserve both solo exploration and easy sharing.

## Architecture today

index.html contains everything, including inline CSS and two script closures. The first closure implements motion drawing; the second implements shared room navigation, waves/audio, flocking, the projected ribbon, and traffic UI. The traffic mathematics and rendering live in experiments/traffic.js, loaded as a regular script for offline use. Search for roomInfo, insights, controls, choose, stepFlock, wavePoint, surface, drawRibbon, and ranges. Navigation and agent tool enums currently assume exactly five rooms: update all of them when adding a room.

Math models, rendering, and UI are currently mixed. A readable per-experiment module refactor is desired but has NOT happened. If refactoring, keep a generated standalone offline HTML export and document how to rebuild it.

## Constraints

- No AI API or proprietary hosting dependency is necessary to run the app. Preserve that independence.
- Keep sound and narration opt-in. Stop audio when switching rooms and respect reduced-motion settings.
- Keep keyboard/touch interaction, responsive layout, visible focus, and optional explanations.
- Explain model limitations honestly and cite mathematical sources. Do not imply a classic result is newly invented.
- Keep source and license downloadable when implementing in-app remixing. Avoid secrets or hosting credentials in exports.
- Keep English as the initial default. Make future localization easy; see docs/TRANSLATING.md.
- Do not add accounts, tracking, payments, external AI services, or paid dependencies without the owner's request.

## Verify changes

Use a real browser for interaction/visual changes. Check all five rooms, a narrow mobile viewport, keyboard navigation, audio start/stop, reduced motion, sharing, and PNG export. A successful build alone does not verify these behaviors. Check mathematical invariants when changing the models. Report what was tested and what remains unverified.

## Working with other agents

Use the owner's private GitHub repository as the canonical source. Create a new branch from current `main` for each task, such as `agent/braess-traffic` or `agent/hebrew-copy`. Keep your own checkout or worktree; never share a mutable working directory with another agent. Open a pull request and report the branch and any pending conflicts. Do not force-push `main`, merge over another agent's changes, or publish the private repository without the owner's approval. See docs/COLLABORATING.md.

## Handoff after each session

Update docs/STATUS.md, commit the work on the task branch, open a pull request for review, and provide run/deploy commands. Keep unfinished work explicit so progress does not depend on a chat's memory or token budget. Ask for approval before posting to the owner's social accounts or incurring costs.
