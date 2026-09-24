# Wonderloom — your independent copy

A playground for beautiful mathematical ideas, owned and directed by Eyal Weiss.

## Start here: no installation, no AI, no account

Extract this ZIP, then double-click **index.html**. It contains the complete app: HTML, styles, explanations, and JavaScript. The five experiments run in a modern browser without a server, GPT credits, an API key, or an internet connection.

Use a text editor to edit index.html, save, then refresh the browser. Keep a backup before editing. You can give this folder to any coding assistant, including a local model, or work on it by hand. Read AGENTS.md for the project brief.

Sound starts only after a click. Spoken narration depends on your browser and its installed voices; some voices may need the internet. External reading links need the internet. Clipboard permissions vary, so a manual-copy dialog is available. Opening a local file shares settings rather than a public link.

## Optional local web server

If Python 3 is installed, open a terminal in this folder and run:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

On Windows, you may need `py -m http.server 4173 --bind 127.0.0.1` instead.
Open http://localhost:4173 in your browser. Stop the server with Ctrl+C.
A localhost link only works on your own computer.

## Optional development tools

Node.js 22.12 or later in the Node 22 line supports the included Vite setup. With Node/npm installed:

```sh
npm ci
npm run dev
```

The initial dependency install requires internet access. The browser app itself has no runtime package dependencies. To create a static build:

```sh
npm run build
```

The output goes to dist/. Node and Vite are optional for this version: serving index.html directly works too.

## Publish under an account you control

This is a static website. Upload **index.html** to the web root of a static hosting service in your own account, or deploy the contents of dist/ after building. No backend, environment variables, database, or OpenAI credentials are required. Use the host's public HTTPS URL for links you share. The optional external source links in the app are optional reading, not application dependencies.

The existing chatgpt.site address belongs to the current ChatGPT-hosted deployment. This export does not transfer that address or change its access settings. A separately hosted copy gets a separate address; a domain you control can be connected through your chosen host.

## Keep one canonical repository

The owner has created a private GitHub repository called `eyal-weiss/wonderloom`. This repository is the source of truth. This folder and the earlier ZIP are snapshots; neither updates the repository automatically.

Each agent should clone or check out its own working copy, start a uniquely named branch from the latest `main`, and open a pull request. Do not have two agents edit the same shared checkout or push to the same branch. Review and merge one pull request at a time; update the next branch against current `main` when changes overlap. See docs/COLLABORATING.md and AGENTS.md. You do not need ChatGPT to access, edit, or deploy your repository once the repository contains the source.

## Files

- index.html: complete, editable app; also the offline version.
- experiments/traffic.js: Braess traffic model and canvas rendering; loaded alongside index.html.
- tests/traffic.test.js: equilibrium checks using Node’s built-in test runner.
- package.json / package-lock.json / vite.config.js: optional development/build setup.
- AGENTS.md: instructions for any coding assistant.
- docs/TRANSLATING.md: language and Hebrew layout guidance.
- docs/STATUS.md: implemented features, unfinished work, and next steps.
- docs/PROVENANCE.md: source snapshot and verification details.
- LICENSE: MIT license.

## Current scope

Five rooms: drawing with motion, waves and sound, flocking, a 3D Möbius ribbon, and a traffic shortcut paradox. There is no GPT integration, live AI tutor, analytics backend, account system, or remotely stored user data in this snapshot. Optional guarded browser-agent hooks are inert in browsers that do not provide them.

English is the current language. A complete modular source refactor, in-app remix interface, social demo video, public GitHub repository, and public release are unfinished; see docs/STATUS.md.
