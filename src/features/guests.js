/*
 * Mathematician visitors in playful paper puppets. A visitor's face is either
 * a documented historical portrait (`image`) or a drawn sketch (`sketch`).
 * Each room lists its own visitors in `guests`; captions are original writing.
 * Portrait sources and rights are documented in docs/PORTRAITS.md.
 */
(() => {
  'use strict';

  const W = Wonderlattice;
  const biography = (page) => `https://mathshistory.st-andrews.ac.uk/Biographies/${page}/`;
  const commons = (file) => `https://commons.wikimedia.org/wiki/File:${file}`;
  // The single-file export (npm run build) embeds portraits as data URLs here.
  const portrait = (file) => W.portraitSources?.[file] ?? `./portraits/${file}`;
  const selected = Object.create(null);
  const words = () => W.text('app').guests;

  /** Choose a visitor for a room, never repeating the current one. */
  function pick(room) {
    const pool = W.room(room)?.guests;
    if (!pool?.length) return;
    const previous = selected[room] ?? -1;
    selected[room] = (previous + 1 + Math.floor(Math.random() * (pool.length - 1))) % pool.length;
  }

  const HAIR_BACK = {
    long: (c) => `<path d="M12 26c0-12 7-19 16-19s16 7 16 19v22H12z" fill="${c}"/>`,
    bun: (c) => `<circle cx="28" cy="8" r="6" fill="${c}"/>`,
    wig: (c) => `<path d="M9 30c-2-13 6-23 19-23s21 10 19 23c3 3 3 9-1 12H10c-4-3-4-9-1-12z" fill="${c}"/>`,
  };
  const HAIR_FRONT = {
    short: (c) => `<path d="M14 25c0-9 6-15 14-15s14 6 14 15c-3-5-8-7-14-7s-11 2-14 7z" fill="${c}"/>`,
    swept: (c) => `<path d="M13 26c-1-10 6-17 16-17 8 0 14 5 14 13-6-6-15-6-22 0-3 1-6 2-8 4z" fill="${c}"/>`,
    curly: (c) =>
      [14, 19, 25, 31, 37, 42]
        .map((x, i) => `<circle cx="${x}" cy="${i % 2 ? 12 : 15}" r="5.5" fill="${c}"/>`)
        .join(''),
    long: (c) => `<path d="M14 25c0-9 6-15 14-15s14 6 14 15c-4-4-9-6-14-6s-10 2-14 6z" fill="${c}"/>`,
    bun: (c) => `<path d="M14 25c0-9 6-14 14-14s14 5 14 14c-3-4-8-6-14-6s-11 2-14 6z" fill="${c}"/>`,
    wig: (c) => `<path d="M14 24c0-8 6-13 14-13s14 5 14 13c-4-3-9-4-14-4s-10 1-14 4z" fill="${c}"/>`,
    receding: (c) =>
      `<path d="M13 28c0-4 1-7 3-9 1 3 2 4 4 5-1-4 0-7 2-9M43 28c0-4-1-7-3-9-1 3-2 4-4 5 1-4 0-7-2-9" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  };
  const BEARD = {
    full: (c) => `<path d="M15 33c1 11 6 17 13 17s12-6 13-17c-3 4-7 5-13 5s-10-1-13-5z" fill="${c}"/>`,
    short: (c) => `<path d="M17 37c2 7 6 10 11 10s9-3 11-10c-3 2-7 3-11 3s-8-1-11-3z" fill="${c}" opacity=".85"/>`,
    goatee: (c) => `<path d="M24 42c1 4 2 6 4 6s3-2 4-6c-2 1-6 1-8 0z" fill="${c}"/>`,
  };
  const GLASSES = {
    round: '<circle cx="22.5" cy="29" r="4"/><circle cx="33.5" cy="29" r="4"/>',
    square:
      '<rect x="17.5" y="25.5" width="9" height="7" rx="1.5"/><rect x="29.5" y="25.5" width="9" height="7" rx="1.5"/>',
  };

  /**
   * A drawn face for visitors without a photograph: a playful sketch from a few
   * recognisable features, not a likeness. Every field is optional:
   *   skin, hair, backdrop   colours
   *   hairStyle              short | swept | curly | long | bun | wig | receding | bald
   *   beard                  full | short | goatee (default none)
   *   moustache              true | false
   *   glasses                round | square (default none)
   *   brows                  soft | bold
   */
  function sketch(f = {}) {
    const skin = f.skin ?? '#f0c8a4',
      hair = f.hair ?? '#4a3528',
      ink = '#2b2320',
      style = f.hairStyle ?? 'short';
    const part = (table, key) => table[key]?.(hair) ?? '';
    const glasses = GLASSES[f.glasses]
      ? `<g fill="none" stroke="${ink}" stroke-width="1.2">${GLASSES[f.glasses]}<path d="M26.5 29h3"/></g>`
      : '';
    const moustache = f.moustache
      ? `<path d="M22 38.5c2-2 4-2 6-.5 2-1.5 4-1.5 6 .5-2 .5-4 .5-6-.5-2 1-4 1-6 .5z" fill="${hair}"/>`
      : '';
    return (
      '<svg class="math-guest-sketch" viewBox="0 0 56 56" aria-hidden="true">' +
      `<rect width="56" height="56" fill="${f.backdrop ?? '#e4e4d9'}"/>${part(HAIR_BACK, style)}` +
      `<ellipse cx="28" cy="31" rx="13" ry="16" fill="${skin}"/>` +
      `<ellipse cx="15.5" cy="31" rx="2" ry="3" fill="${skin}"/><ellipse cx="40.5" cy="31" rx="2" ry="3" fill="${skin}"/>` +
      part(HAIR_FRONT, style) +
      part(BEARD, f.beard) +
      `<g stroke="${ink}" stroke-linecap="round" fill="none">` +
      `<path d="M20 24.5q2.5-1.5 5 0M31 24.5q2.5-1.5 5 0" stroke-width="${f.brows === 'bold' ? 2.2 : 1.3}"/>` +
      '<path d="M28 30v5l-1.5 1" stroke-width="1"/><path d="M24.5 40.5q3.5 2 7 0" stroke-width="1.1"/></g>' +
      `<circle cx="22.5" cy="29" r="1.4" fill="${ink}"/><circle cx="33.5" cy="29" r="1.4" fill="${ink}"/>` +
      `${moustache}${glasses}</svg>`
    );
  }

  // frame: [portrait width, x offset, y offset] inside the 56px circular head.
  function puppet(guest) {
    const [size, x, y] = guest.frame ?? [56, 0, 0];
    const face = guest.image
      ? `<img src="${portrait(guest.image)}" alt="" width="${size}" loading="lazy">`
      : sketch(guest.sketch);
    return (
      `<div class="math-guest-puppet" style="--guest-accent:${guest.color};--portrait-size:${size}px;--portrait-x:${x}px;--portrait-y:${y}px" aria-hidden="true">` +
      '<span class="math-guest-spark">✦</span><span class="math-guest-figure">' +
      '<span class="math-guest-leg math-guest-leg-left"></span><span class="math-guest-leg math-guest-leg-right"></span>' +
      '<span class="math-guest-arm math-guest-arm-left"></span><span class="math-guest-arm math-guest-arm-right"></span>' +
      '<span class="math-guest-outfit"><span class="math-guest-bow">◆</span></span>' +
      `<span class="math-guest-head">${face}</span>` +
      '</span></div>'
    );
  }

  function render(room, target) {
    if (!target) return;
    const pool = W.room(room)?.guests;
    target.hidden = !pool?.length;
    if (!pool?.length) return;
    if (selected[room] === undefined) pick(room);
    const guest = pool[selected[room]];
    const link = 'target="_blank" rel="noopener noreferrer"',
      t = words();
    const story = guest.bio
      ? `<a href="${biography(guest.bio)}" ${link} aria-label="${t.storyLabel(guest.name)}">${t.story}</a>`
      : '';
    const source = guest.source
      ? `<a class="math-guest-source" href="${commons(guest.source)}" ${link} aria-label="${t.portraitLabel(guest.name)}">${t.portrait}</a>`
      : '';
    const credit = guest.credit
      ? `<span class="math-guest-credit">${t.photo(guest.credit)} · <a href="${guest.license.url}" ${link}>${guest.license.name}</a></span>`
      : '';
    const another =
      pool.length > 1
        ? `<button type="button" class="math-guest-next" aria-label="${t.another}" title="${t.another}">↻</button>`
        : '';
    target.innerHTML =
      puppet(guest) +
      `<div class="math-guest-copy"><span class="math-guest-eyebrow">${guest.image ? t.eyebrowPortrait : t.eyebrowSketch}</span>` +
      `<strong>${guest.name}</strong><p>${guest.note}</p>${story}${source}${credit}</div>${another}`;
    target.querySelector('.math-guest-next')?.addEventListener('click', () => {
      pick(room);
      render(room, target);
    });
  }

  globalThis.WonderlatticeGuests = Object.freeze({ pick, render, sketch });
})();
