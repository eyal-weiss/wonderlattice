# Contributing to Wonderlattice

Thank you for wanting to help. Wonderlattice is a small, noncommercial project run by one person,
[Eyal Weiss](https://github.com/eyal-weiss), in spare time, so replies may take a few days.

## What it's for

Wonderlattice should feel like play, not homework. Fun, beauty and surprise come first; the explanations are optional.
It should welcome people with no strong mathematical background. Changes that add scores, right answers, accounts,
ads, tracking or outside services won't be accepted.

## Ways to help

- **Report a bug:** [open an issue](https://github.com/eyal-weiss/wonderlattice/issues) with the room, what you did,
  what you expected, and your browser and device. A screenshot helps.
- **Suggest an idea:** open an issue first, before writing code, especially for a new room. Say what the surprise is:
  the one moment a visitor should remember.
- **Translate:** a language is a single file, and you don't need to program. See
  [docs/TRANSLATING.md](docs/TRANSLATING.md).
- **Fix something:** small fixes (wording, accessibility, a bug with a clear cause) are welcome as a pull request
  straight away.

## Making a change

1. Fork the repository and create a branch from `main`.
2. Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). The site has no build step: edit a file and refresh the browser.
3. Keep to the house rules:
   - classic scripts and plain CSS, no frameworks or runtime dependencies, so `index.html` keeps working when opened
     from disk;
   - every visitor-facing word in a room's `text.en.js` (or `src/core/text.en.js`), never in the logic;
   - keyboard and touch both work, focus stays visible, and reduced-motion settings are respected;
   - sound and narration start only when the visitor asks;
   - explanations are honest about what a model leaves out, and cite their sources;
   - shared links and trail exports from older versions keep working;
   - British spelling.
4. Run `npm ci` once, then `npm run check`, and add tests for new behaviour. `npm run format` applies the code style.
   Automated tests can't hear sound or judge looks, so also try your change in a browser, including at phone width.
5. Open a pull request that says what changed, how you tested it, and anything left unfinished.

## Pictures and other people's work

Only add images you have the right to share, and record their source and licence in
[docs/PORTRAITS.md](docs/PORTRAITS.md). Public-domain or openly licensed images are fine; images found on the web
usually aren't. A drawn sketch, as several rooms use, needs no rights at all.

## AI-assisted contributions

Using an AI coding assistant is fine: most of this project was written that way. Point it at [AGENTS.md](AGENTS.md)
first. You are responsible for what you submit: read it, run the checks, and make sure it does what you say.

## Licence

By contributing, you agree that your contribution is released under the project's [MIT licence](LICENSE), and that
you have the right to release it.

## Conduct

Be kind and assume good intent. Wonderlattice is for curious people of all backgrounds, and so is working on it.
Harassment or disrespect isn't welcome, and the maintainer may remove comments or block accounts to keep things
friendly.
