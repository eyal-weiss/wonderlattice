# Project state

Wonderlattice has 39 rooms in seven themes, in six languages (English, Hebrew, Spanish, Brazilian Portuguese, French
and Arabic). Visitors can keep moments in My trail, share any
room with its settings, show a room on a big screen or send it to phones with a QR code, make the text larger or raise
the contrast, and send a message from the end of any explanation. It runs in the browser with no accounts or
tracking, even offline, and as a single file.

This file is a changelog of the site, newest first. How the code fits together is in docs/ARCHITECTURE.md.

## Open, and help welcome

- **Native speakers' reads** of the five translations, and listening to narration in each language.
- **Real devices:** phones, tablets and screen readers. The tests cover emulated phones only; a report that picking
  dice didn't work on iPhone Safari could not be reproduced in emulation.
- **Room ideas:** issues labelled `room idea`, indexed in #19; the ones labelled `ready to build` are approved.
- Text drawn inside the pictures doesn't grow with the Display setting; the browser's zoom enlarges everything.

## 2026-10-07

- **Three rooms, in every language.** _The hotel that is always full_ (`hotel`, Hilbert's hotel and Cantor's
  diagonal), _Rhythms from Euclid_ (`rhythm`, evenly spread beats that turn into rhythms from around the world, with
  sound when the visitor turns it on) and _Six handshakes_ (`handshakes`, a ring of friends that a few random
  friendships shrink to a small world), each in English, Hebrew, Spanish, French, Brazilian Portuguese and Arabic,
  so they join the map together.

## 2026-10-05

- **Small phones in every language.** On a 320 px screen in Spanish, French and Portuguese, the longer "← All
  experiments" pushed the room bar's next arrow past the edge, so every room's page scrolled sideways. The link
  now takes two lines there, and with the largest text the arrows take a second line. In the rollers and voltage
  rooms, three labels drawn in the picture were squeezed to half or two thirds of their width on small phones, even
  in English; they now wrap or use the room they have. The phone-width test walks every room in every language.
- **Three new rooms, in every language, now on the map.** Rollers that aren’t round, The stubborn triangle and Light
  a town 100 km away are translated into Hebrew, Spanish, Brazilian Portuguese, French and Arabic: the page, the words
  drawn in the pictures, the visitors and the explanations. With that they join the map, the route and Surprise, and
  the map's "New" line names them from today.
- **New rooms wait for their translations.** A room now joins the map, the route, the "New" line and Surprise only
  once every language has its words, so visitors reading Hebrew, Arabic, Spanish, French or Portuguese no longer meet
  a new room in English. Until then a direct link opens it. The rollers and the stubborn triangle wait for theirs.
- **Pictures that fit the screen.** On a laptop or desktop, a room's picture is now never taller than the window, and
  it stays in view while you scroll down a long panel, so a slider at the bottom still shows its effect. Before, the
  picture's frame grew as long as the panel (up to 1,150 px) and several rooms left an empty black band under their
  picture. Every room now fills its frame, and a test checks all of them at five sizes.

## 2026-10-04

- **Kaleidoscope of cheaters in every language.** The room (No. 22 on the route) had shipped in English only, so it
  showed in English in Hebrew, Spanish, French, Brazilian Portuguese and Arabic. All of its words are now translated:
  the page, the colour key, chart and inspector drawn in the picture, the visitors and the explanation.
- **Faster checks on pull requests.** CI runs its static checks, the browser tests on the source and the browser
  tests on the built site as three jobs at once, and a job named `check` reports all three. A browser test that fails
  once on CI runs again, and one that then passes is reported as flaky instead of blocking the pull request.

## 2026-10-03

- **A new look, and a route through the rooms.** The home page is now a map: every room sits on one numbered route,
  next to the room before it, with one line joining them, so visitors who simply follow the numbers get a varied
  tour (each room unlike the one before, the quickest and most wordless ones first). The room bar's ‹ › follow the
  same route. Each room's cell takes its theme's colour; a key and a list by theme are under the map. The map's
  pictures are small ready-made images (`npm run previews`), so the home page loads no room's code.
- **Day and night colours.** Day, the default, is a science-museum map: paper, ink, a yellow accent. Night is a star
  atlas in ivory and gold. The sun and moon button in the header switches them, and the choice is remembered. Every
  room's page follows, while the pictures stay dark in both. High contrast works in both.
- **The site's own typefaces,** served with it under the SIL Open Font License: Rubik by day, IM Fell English and
  Frank Ruhl Libre (and Amiri for Arabic) at night. The night ones are fetched quietly after the page loads.
- New header and mark (seven lattice points, one per theme), no ✧ sparkles or spaced capitals, and new link previews
  and home-screen icon. The words new to the map are in all six languages.
- **First visits keep their questions open** in four rooms. The treasure detector hides its answer (what a beep
  means, and the chart of 1,000 squares) until the visitor digs, digs every beep or changes the odds. The cube says
  how many repeats a sequence needs only once the visitor has seen it come home, and its preset card no longer shows 105. The leaning tower opens with four blocks stacked straight at the edge, so "can 4 blocks clear it?" is still a
  question; its tip now describes what really works (tapping empty space adds a block). In the fireflies room,
  "Fly eight time zones" switches the day–night cycle on instead of sitting greyed out. The basketball room's
  highlighted preset matches the mix it opens with. Words in all six languages.

## 2026-09-30

- **A feedback box** (#122): every explanation, and About, ends with "Send a message to the maker". Nothing is sent
  until the visitor presses Send; the message goes with the page and language only. Its inbox is the site's one piece
  of server code, a Cloudflare Pages Function (`functions/api/feedback.js`). Opened from a file, the box links to
  GitHub issues instead. About's privacy text, SECURITY.md and `_headers` describe it.
- **Display settings** (#121): a Display button in the header sets the text size (normal, large, larger) and high
  contrast, which also follows the device's own setting. Every text size is now relative (rem), so a browser's larger
  default text size is honoured too. In high contrast all page text reaches at least 7:1.

## 2026-09-29

- **Arabic**, the sixth language (#120): every room, menu and the About page, right to left. Right-to-left pages
  (Hebrew too) got fixes on the way: sources, move names, scales and signed numbers read in the right order, and
  keyboard shortcuts work on Hebrew and Arabic layouts.
- **A classroom kit** (#119): a big-screen mode in every room, and a QR code that sends the room, with its settings,
  to phones.
- **Visited marks and "Surprise me"** (#118): a small dot on the cards of rooms already opened (kept in the browser,
  and forgettable from About), and a button that opens a room you haven't seen yet.
- **A "New" line** on the home map names the newest rooms (#112).
- **Rooms load when they're needed** on the published site (#111): an English first visit fell from 370 KB to 59 KB.
- **Two rooms** in Engineering: _A thousand samples, ten tests_ (`pools`, #107) and _The shower that never settles_
  (`shower`, #108), then translated (#109), with fixes for number formats and chart labels in other languages (#110).

## 2026-09-28

- **The leaning tower of blocks** (`blocks`, #101, by ThatKJ), the first room in the new Engineering section (#102),
  and in every language (#105).
- **Clearer phones** (#103): the picture and the room's own controls come first. Every room's subtitle is now one
  plain line saying what you see and what to try (#104).
- **Two losing games that win** (`parrondo`, #96): Parrondo's paradox as a race between three crowds.
- **Forty room ideas** filed as issues (#56–#95), grouped by direction in #19.
- **Five rooms:** the imperfect treasure detector (`treasure`, #53), the impossible floor (`floor`, #51), weather twins
  (`weather`, #54), how much picture you can throw away (`compress`, #50), a secret shouted across the room (`secret`,
  #52).
- **Ready to grow** (#46, #47): one folder per language, rooms found automatically, a download budget, and home cards
  that draw only when in view.
- **Four rooms:** a seed for an infinite landscape (`julia`, #41), fireflies that fall into step (`fireflies`, #39), a
  heartbeat travels (`heart`, #40), a tile that fills the world (`tiles`, #42). Share pages give every room its own
  link preview (#38).

## 2026-09-27

- **Two players, three leaderboards** (`shots`, #25, by maham146): Simpson's paradox on a basketball court, then
  translated (#35).
- Every script and stylesheet address now carries a fingerprint, so a returning browser never mixes old and new files
  (#34).

## 2026-09-26

- **Four languages:** Hebrew (right to left), Spanish, Brazilian Portuguese and French (#20–#23). Right-to-left layout
  by yonatangross (#24).
- **Phones:** a finger on a picture scrolls the page unless the room drags there, and the picture stays pinned while
  the controls scroll (#30, #31). The language menu moved to the header (#28); narration explains how to add a voice
  when none speaks the page's language (#27).
- **Room ideas as issues** (#5–#18), indexed in #19.

## 2026-09-25

- **Live** at https://wonderlattice.com, on Cloudflare Pages, with a preview for every pull request. Strict security
  headers (`_headers`); a README, CONTRIBUTING.md and SECURITY.md for newcomers. The repository is public, and `main`
  takes changes only by pull request with passing checks.

## 2026-09-24

- **Renamed to Wonderlattice** (from Wonderloom). Trails saved under the old name still open.
- **Pre-release reviews** for privacy, security, accessibility and layout; About covers privacy, credits and
  disclaimers.
- **Thirteen rooms**, every word in a dictionary so the site can be translated, a home map grouped by theme, and a
  readable codebase in place of one minified page, with unit tests, browser tests, linting, formatting and CI.
