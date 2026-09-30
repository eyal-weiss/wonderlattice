/*
 * App shell: builds the home map from the room registry, switches between the
 * map and rooms, keeps the address in step (#room=…, so Back works and links
 * can be shared), and wires dialogs, narration, the trail, and the optional
 * browser-agent tools. Loaded last, after every room has registered.
 */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, rooms, stage } = W;

  let current = null; // the room being shown, or null on the home map
  let expectedHash = null; // a hash we set ourselves, so its hashchange is not routed again
  const ready = new Set(); // rooms whose init() has run
  let navigation = 0; // counts navigations, so a room that finishes loading after the visitor moved on stays shut

  const VISITED = 'wonderlattice.visited.v1'; // the rooms this visitor has opened, in this browser only
  const NEW_DAYS = 30, // how long a room stays on the home map's "New" line
    NEW_MOST = 3; // and how many it names at once
  const panelOf = (room) => room.panel ?? 'new-room';
  /** Rooms in map order: by theme, then in registration order. */
  const ordered = () => W.themes.flatMap((theme) => rooms.filter((r) => r.theme === theme.id));

  /** Rooms set themselves up the first time they are opened. */
  function prepare(room) {
    if (ready.has(room.id)) return;
    ready.add(room.id);
    stage.adopt(room);
    room.init?.();
  }

  /**
   * Do something with a room once its code is here: at once when it is (always, opened from disk), otherwise
   * after the published site has loaded it, unless the visitor has gone somewhere else in the meantime.
   */
  function withRoom(id, then) {
    const run = ++navigation;
    document.body.classList.toggle('loading-room', !W.isLoaded(id)); // a busy pointer until it's here
    if (W.isLoaded(id)) return Promise.resolve(then(W.room(id)));
    const done = () => run === navigation && document.body.classList.remove('loading-room');
    return W.loadRoom(id).then(
      (room) => {
        done();
        if (run === navigation) then(room);
      },
      () => {
        done();
        if (run !== navigation) return;
        W.toast(W.text('app').stage.loadFailed);
        if (!current) showHome();
      },
    );
  }

  /** The rooms this visitor has opened. A browser that blocks storage remembers none (and marks none). */
  function visitedRooms() {
    try {
      const list = JSON.parse(localStorage.getItem(VISITED) || '[]');
      return new Set(Array.isArray(list) ? list.filter((id) => typeof id === 'string') : []);
    } catch {
      return new Set();
    }
  }

  function rememberVisit(id) {
    const seen = visitedRooms();
    if (seen.has(id)) return;
    seen.add(id);
    try {
      localStorage.setItem(VISITED, JSON.stringify([...seen]));
    } catch {
      /* storage is blocked: no marks */
    }
  }

  /** A small mark on the cards of rooms already opened: never a count, just a quiet sign of where you've been. */
  function markVisited() {
    const seen = visitedRooms();
    for (const card of document.querySelectorAll('.room-card'))
      card.classList.toggle('visited', seen.has(card.dataset.room));
  }

  /** A room at random: one this visitor hasn't opened yet while there are any, and never the room they're in. */
  function surprise() {
    const seen = visitedRooms();
    const others = ordered().filter((room) => room.id !== current?.id);
    const fresh = others.filter((room) => !seen.has(room.id));
    const pool = fresh.length ? fresh : others;
    if (pool.length) open(pool[Math.floor(Math.random() * pool.length)].id);
  }

  /** One line under the map's title naming the newest rooms (a room's `added` date); with none, no line. */
  function buildWhatsNew() {
    const since = Date.now() - NEW_DAYS * 24 * 60 * 60 * 1000;
    const fresh = rooms
      .map((room, order) => ({ room, order }))
      .filter(({ room }) => room.added && Date.parse(room.added) >= since)
      .sort((a, b) => b.room.added.localeCompare(a.room.added) || b.order - a.order) // same day: the later one first
      .slice(0, NEW_MOST)
      .map(({ room }) => room);
    const line = $('whats-new');
    line.hidden = !fresh.length;
    line.innerHTML =
      `<span class="eyebrow">${W.text('app').whatsNew}</span> ` +
      fresh.map((r) => `<button class="whats-new-room" data-go="${r.id}">${r.name}</button>`).join(' · ');
  }

  function buildHome() {
    const card = (room) =>
      `<button class="room-card" id="card-${room.id}" data-room="${room.id}" style="--card-accent:${room.accent?.border ?? '#849c66'}">` +
      '<canvas width="320" height="180" aria-hidden="true"></canvas>' +
      `<span class="eyebrow">${room.eyebrow}</span><strong>${room.name}</strong>` +
      `<span class="room-card-tagline">${room.tagline}</span>` +
      `<span class="visually-hidden room-card-visited">${W.text('app').visited}</span></button>`;
    $('home-themes').innerHTML = W.themes
      .map((theme) => {
        const list = rooms.filter((r) => r.theme === theme.id);
        if (!list.length) return '';
        return (
          `<section class="theme" aria-labelledby="theme-${theme.id}"><div class="theme-head">` +
          `<h2 id="theme-${theme.id}">${theme.name}</h2><p>${theme.blurb}</p></div>` +
          `<div class="room-cards">${list.map(card).join('')}</div></section>`
        );
      })
      .join('');
    const cards = [...$('home-themes').querySelectorAll('.room-card')];
    for (const button of cards) button.addEventListener('click', () => open(button.dataset.room));
    markVisited();
    // Each card's picture is drawn when it first comes near the screen, so a long map starts quickly
    // (on the published site, that's also when the room's code loads).
    const draw = (button) =>
      W.loadRoom(button.dataset.room).then(
        (room) => drawPreview(room, button.querySelector('canvas')),
        () => {}, // the card keeps a plain background; opening the room tries again
      );
    if (!('IntersectionObserver' in window)) return cards.forEach(draw);
    const watcher = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          watcher.unobserve(entry.target);
          draw(entry.target);
        }
      },
      { rootMargin: '300px 0px' },
    );
    cards.forEach((button) => watcher.observe(button));
  }

  /** A still picture of a room for its card: its own preview, or a frame of its default settings. */
  function drawPreview(room, canvas) {
    const width = 320,
      height = 180,
      dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#0a0e15';
    ctx.fillRect(0, 0, width, height);
    try {
      if (room.preview) room.preview(ctx, width, height);
      else room.draw(ctx, { ...room.defaults, ...room.previewSettings }, { width, height, clock: 0, playing: false });
    } catch (error) {
      console.warn(`No preview for ${room.id}:`, error);
    }
  }

  function leaveRoom() {
    // A dialog from the last room shouldn't cover the next one (e.g. after Back or a shared link).
    document.querySelectorAll('dialog[open]').forEach((d) => d.close());
    $('trail-return').hidden = true;
    W.silence();
    W.narration.stop();
    W.bigScreen.set(false);
  }

  const homeTitle = document.title;

  function showHome() {
    navigation++; // a room still loading won't open over the map
    document.body.classList.remove('loading-room');
    leaveRoom();
    current = null;
    document.title = homeTitle;
    stage.leave();
    document.body.dataset.room = 'home';
    markVisited();
    for (const panel of new Set(rooms.map(panelOf))) $(panel).hidden = true;
    $('room-bar').hidden = true;
    $('home').hidden = false;
  }

  /** Show a room by id (unknown ids are ignored). Navigation history is the caller's job. */
  function choose(id) {
    const next = W.room(id);
    if (!next) return;
    prepare(next);
    WonderlatticeGuests.pick(id);
    leaveRoom();
    rememberVisit(id);
    current = next;
    document.body.dataset.room = id;
    document.title = W.text('app').pageTitle(next.name);
    $('home').hidden = true;
    for (const panel of new Set(rooms.map(panelOf))) $(panel).hidden = panel !== panelOf(next);
    updateRoomBar();
    if (next.layout === 'custom') {
      stage.leave();
      next.enter?.();
    } else stage.enter(next);
  }

  function updateRoomBar() {
    const list = ordered(),
      i = list.indexOf(current);
    const prev = list[(i + list.length - 1) % list.length],
      next = list[(i + 1) % list.length];
    $('room-bar').hidden = false;
    $('room-theme').textContent = `${current.symbol}  ${W.themes.find((t) => t.id === current.theme).name}`;
    for (const [id, room, label] of [
      ['room-prev', prev, W.text('app').roomBar.previous],
      ['room-next', next, W.text('app').roomBar.next],
    ]) {
      $(id).dataset.room = room.id;
      $(id).setAttribute('aria-label', label(room.name));
      $(id).title = room.name;
    }
  }

  /** Record a navigation in the browser history without routing it a second time. */
  function setHash(hash) {
    if (location.hash.slice(1) === hash) return;
    expectedHash = hash;
    location.hash = hash;
  }

  /** Visitor navigation: open a room, remember it in history, and start at its top. */
  function open(id) {
    if (!W.room(id)) return Promise.resolve();
    return withRoom(id, () => {
      choose(id);
      setHash('room=' + id);
      window.scrollTo(0, 0);
      document.querySelector(`#${panelOf(current)} h1`)?.focus({ preventScroll: true });
    });
  }

  function goHome() {
    const left = current;
    showHome();
    setHash('');
    if (left) $('card-' + left.id)?.focus();
  }

  /** Follow the address: the home map, or a room with optional shared settings. */
  let routed = false;
  function route() {
    // Focus moves only on Back and Forward, never when the page first opens.
    const navigating = routed;
    routed = true;
    const hash = location.hash.slice(1);
    if (expectedHash !== null && hash === expectedHash) {
      expectedHash = null;
      return;
    }
    expectedHash = null;
    const q = new URLSearchParams(hash);
    const id = q.get('room') || (q.has('k') ? 'motion' : null);
    const left = current;
    if (!W.room(id)) {
      showHome();
      // After Back to the map, land on the card of the room just left (or the map's heading).
      if (navigating) (left ? $('card-' + left.id) : $('home-title'))?.focus({ preventScroll: true });
      return;
    }
    if (current?.id === id && [...q.keys()].every((k) => k === 'room')) return;
    // A shared link to a room that isn't loaded yet: keep the map (and its cards' rooms) out of the way meanwhile.
    if (!current && !W.isLoaded(id)) $('home').hidden = true;
    withRoom(id, () => {
      applyParams(q);
      if (navigating) document.querySelector(`#${panelOf(current)} h1`)?.focus({ preventScroll: true });
    });
  }

  /**
   * Open the room named in a shared link such as #room=traffic&demand=1000,
   * accepting only in-range values. Older drawing links may omit the room.
   */
  function applyParams(q) {
    const id = q.get('room') || (q.has('k') ? 'motion' : null);
    const room = W.room(id);
    if (!room) return false;
    prepare(room);
    if (room.applyParams) room.applyParams(q);
    else {
      const s = stage.settingsFor(id);
      for (const [key, [min, max, kind]] of Object.entries(room.ranges ?? {})) {
        if (!q.has(key)) continue;
        const n = Number(q.get(key));
        if (Number.isFinite(n) && n >= min && n <= max && (kind !== 'integer' || Number.isInteger(n))) s[key] = n;
      }
      for (const key of booleanKeys(room)) if (q.has(key)) s[key] = q.get(key) === 'true';
      stage.setChosenFor(id, -1);
    }
    choose(id);
    return true;
  }

  const booleanKeys = (room) => Object.keys(room.defaults ?? {}).filter((k) => typeof room.defaults[k] === 'boolean');

  /** What the trail saves for the current room. */
  function capture() {
    if (current.layout === 'custom') return current.capture();
    return {
      room: current.id,
      title: $('scene-name').textContent,
      settings: { ...stage.settingsFor(current.id), ...current.extraSettings?.() },
      // A room can offer a finished picture for the trail (e.g. the whole cloth), not a mid-animation frame.
      canvas: current.trailCanvas?.(stage.settingsFor(current.id), stage) ?? $('scene-canvas'),
    };
  }

  /** Reopen a saved moment, accepting only in-range values. */
  function restore(item) {
    if (W.room(item.room)) return withRoom(item.room, (room) => restoreLoaded(item, room));
  }

  function restoreLoaded(item, room) {
    if (room.layout === 'custom') {
      open(room.id);
      room.restore(item.settings, item.title);
      return;
    }
    stage.adopt(room); // its settings, if this is the first time the room is here
    const s = stage.settingsFor(room.id),
      saved = item.settings;
    for (const [key, [min, max, kind]] of Object.entries(room.ranges ?? {})) {
      const n = saved[key];
      if (
        typeof n === 'number' &&
        Number.isFinite(n) &&
        n >= min &&
        n <= max &&
        (kind !== 'integer' || Number.isInteger(n))
      )
        s[key] = n;
    }
    for (const key of booleanKeys(room)) if (typeof saved[key] === 'boolean') s[key] = saved[key];
    room.restore?.(saved, s, stage);
    stage.setChosenFor(room.id, -1);
    open(room.id);
  }

  function bindDialogs() {
    document.querySelectorAll('.close').forEach((b) => b.addEventListener('click', () => b.closest('dialog').close()));
    // A click on the backdrop (outside the dialog box) closes it.
    document.querySelectorAll('dialog').forEach((d) =>
      d.addEventListener('click', (e) => {
        if (e.target !== d) return;
        const r = d.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
      }),
    );
    for (const id of ['about-button', 'footer-about'])
      $(id).addEventListener('click', () => $('about-dialog').showModal());
    $('select-copy').addEventListener('click', () => {
      $('copy-text').focus();
      $('copy-text').select();
    });
    $('insight-close').addEventListener('click', () => $('insight-dialog').close());
    $('insight-dialog').addEventListener('close', W.narration.stop);
    $('why-dialog').addEventListener('close', W.narration.stop);
    $('narrate').addEventListener('click', () => W.narration.speak($('insight-body'), $('narrate')));
    $('narrate-why').addEventListener('click', () => W.narration.speak($('why-dialog'), $('narrate-why')));
    // "Go to another room" buttons anywhere on the page.
    document.addEventListener('click', (e) => {
      const go = e.target.closest('[data-go]');
      if (go) open(go.dataset.go);
    });
    $('room-home').addEventListener('click', goHome);
    // Skip past the header to the main content: the first card on the map, or the room's title.
    $('skip-link').addEventListener('click', (e) => {
      e.preventDefault();
      (current ? document.querySelector(`#${panelOf(current)} h1`) : document.querySelector('.room-card'))?.focus();
    });
    document.querySelector('.brand').addEventListener('click', (e) => {
      e.preventDefault();
      goHome();
    });
    for (const id of ['room-prev', 'room-next']) $(id).addEventListener('click', () => open($(id).dataset.room));
    for (const id of ['home-surprise', 'room-surprise']) $(id).addEventListener('click', surprise);
    $('forget-visited').addEventListener('click', () => {
      try {
        localStorage.removeItem(VISITED);
      } catch {
        /* nothing was kept */
      }
      markVisited();
      W.toast(W.text('app').visitedForgotten);
    });
  }

  function registerAgentTools() {
    if (!document.modelContext?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool) => {
      try {
        Promise.resolve(document.modelContext.registerTool(tool, { signal: lifecycle.signal })).catch(() => {});
      } catch {
        /* the browser declined this tool */
      }
    };
    const ids = rooms.map((r) => r.id);
    const app = { choose: open };
    for (const room of rooms) room.agentTools?.(app).forEach(register);
    register({
      name: 'open_exploration',
      description: 'Open one of Wonderlattice’s visible playgrounds. Sound remains off.',
      inputSchema: {
        type: 'object',
        properties: { room: { type: 'string', enum: ids } },
        required: ['room'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false },
      async execute(input) {
        if (!input || !ids.includes(input.room) || Object.keys(input).some((k) => k !== 'room'))
          throw Error('Unknown exploration');
        await open(input.room);
        return { room: current?.id ?? null, soundOn: W.soundOn() };
      },
    });
    register({
      name: 'read_exploration',
      description: 'Read the active exploration, its settings, and whether sound is on.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true },
      execute: () => ({
        room: current?.id ?? null,
        settings: (current && stage.settingsFor(current.id)) ?? null,
        soundOn: W.soundOn(),
        playing: stage.playing,
      }),
    });
    window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
  }

  /** A language menu at the top of the page, after My trail, shown only once a second language exists. */
  function buildLanguagePicker() {
    const all = W.languages();
    const codes = Object.keys(all);
    if (codes.length < 2) return;
    const label = document.createElement('label');
    label.className = 'language-pick';
    label.innerHTML =
      '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" />' +
      '<path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" /></svg>' +
      `<span class="visually-hidden">${W.text('app').language}</span><select id="language">` +
      codes.map((c) => `<option value="${c}"${c === W.lang ? ' selected' : ''}>${all[c].name}</option>`).join('') +
      '</select>';
    $('trail-open').after(label);
    $('language').addEventListener('change', (e) => {
      try {
        localStorage.setItem('wonderlattice.lang', e.target.value);
      } catch {
        /* the address below still carries the choice */
      }
      const url = new URL(location.href);
      url.searchParams.set('lang', e.target.value);
      location.href = url.href;
    });
  }

  /** The Display dialog: text size and high contrast (src/core/display.js keeps and applies them). */
  function bindDisplay() {
    const display = WonderlatticeDisplay;
    const sizes = document.querySelectorAll('input[name="text-size"]');
    const show = () => {
      for (const input of sizes) input.checked = input.value === display.textSize;
      $('high-contrast').checked = display.highContrast;
    };
    for (const input of sizes) input.addEventListener('change', () => display.setTextSize(input.value));
    $('high-contrast').addEventListener('change', (e) => display.setHighContrast(e.target.checked));
    // The device's contrast setting can change while the page is open.
    display.onChange(show);
    show();
    $('display-open').addEventListener('click', () => $('display-dialog').showModal());
  }

  /** Phones pin the picture (see base.css): how far its title scrolls before the picture sticks. */
  function measurePins() {
    for (const drawing of document.querySelectorAll('.workspace > .drawing')) {
      const wrap = drawing.querySelector('.canvas-wrap');
      if (wrap) drawing.style.setProperty('--pin-offset', `${Math.max(0, wrap.offsetTop - 8)}px`);
    }
  }

  function start() {
    W.applyPageText();
    buildLanguagePicker();
    bindDisplay();
    stage.init();
    buildHome();
    buildWhatsNew();
    bindDialogs();
    route();
    window.addEventListener('hashchange', route);
    // The big screen ends with Escape, or when the browser leaves full screen (Escape does that too).
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) W.bigScreen.set(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && W.bigScreen.on && !document.querySelector('dialog[open]')) W.bigScreen.set(false);
    });
    // The title's height changes with the room, the language and the width.
    const pins = new ResizeObserver(measurePins);
    document.querySelectorAll('.workspace > .drawing').forEach((d) => pins.observe(d));
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        W.silence();
        W.narration.stop();
      }
    });
    window.addEventListener('pagehide', () => {
      W.silence();
      W.narration.stop();
    });
    WonderlatticeTrail.init({ capture, restore, open });
    registerAgentTools();
  }

  W.app = { open, goHome };
  start();
})();
