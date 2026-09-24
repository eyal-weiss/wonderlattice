/*
 * Mathematician visitors: historical portraits in playful paper puppets.
 * Each room lists its own visitors in `guests`; captions are original writing.
 * Portrait sources and rights are documented in docs/PORTRAITS.md.
 */
(() => {
  'use strict';

  const W = Wonderloom;
  const biography = (page) => `https://mathshistory.st-andrews.ac.uk/Biographies/${page}/`;
  const commons = (file) => `https://commons.wikimedia.org/wiki/File:${file}`;
  // The single-file export (npm run build) embeds portraits as data URLs here.
  const portrait = (file) => W.portraitSources?.[file] ?? `./portraits/${file}`;
  const selected = Object.create(null);

  /** Choose a visitor for a room, never repeating the current one. */
  function pick(room) {
    const pool = W.room(room)?.guests;
    if (!pool?.length) return;
    const previous = selected[room] ?? -1;
    selected[room] = (previous + 1 + Math.floor(Math.random() * (pool.length - 1))) % pool.length;
  }

  // frame: [portrait width, x offset, y offset] inside the 56px circular head.
  function puppet(guest) {
    const [size, x, y] = guest.frame;
    return (
      `<div class="math-guest-puppet" style="--guest-accent:${guest.color};--portrait-size:${size}px;--portrait-x:${x}px;--portrait-y:${y}px" aria-hidden="true">` +
      '<span class="math-guest-spark">✦</span><span class="math-guest-figure">' +
      '<span class="math-guest-leg math-guest-leg-left"></span><span class="math-guest-leg math-guest-leg-right"></span>' +
      '<span class="math-guest-arm math-guest-arm-left"></span><span class="math-guest-arm math-guest-arm-right"></span>' +
      '<span class="math-guest-outfit"><span class="math-guest-bow">◆</span></span>' +
      `<span class="math-guest-head"><img src="${portrait(guest.image)}" alt="" width="${size}" loading="lazy"></span>` +
      '</span></div>'
    );
  }

  function render(room, target) {
    const pool = W.room(room)?.guests;
    if (!target || !pool?.length) return;
    if (selected[room] === undefined) pick(room);
    const guest = pool[selected[room]];
    const link = 'target="_blank" rel="noopener noreferrer"';
    const credit = guest.credit
      ? `<span class="math-guest-credit">Photo: ${guest.credit} · <a href="${guest.license.url}" ${link}>${guest.license.name}</a></span>`
      : '';
    target.innerHTML =
      puppet(guest) +
      '<div class="math-guest-copy"><span class="math-guest-eyebrow">Math history · historical portrait</span>' +
      `<strong>${guest.name}</strong><p>${guest.note}</p>` +
      `<a href="${biography(guest.bio)}" ${link} aria-label="Read about ${guest.name}">Story ↗</a>` +
      `<a class="math-guest-source" href="${commons(guest.source)}" ${link} aria-label="Portrait source for ${guest.name}">Portrait ↗</a>` +
      `${credit}</div>` +
      '<button type="button" class="math-guest-next" aria-label="Meet another mathematician" title="Meet another mathematician">↻</button>';
    target.querySelector('button').addEventListener('click', () => {
      pick(room);
      render(room, target);
    });
  }

  globalThis.WonderloomGuests = Object.freeze({ pick, render });
})();
