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

  const panelOf = (room) => room.panel ?? 'new-room';
  /** Rooms in map order: by theme, then in registration order. */
  const ordered = () => W.themes.flatMap((theme) => rooms.filter((r) => r.theme === theme.id));

  /** Rooms set themselves up the first time they are opened. */
  function prepare(room) {
    if (ready.has(room.id)) return;
    ready.add(room.id);
    room.init?.();
  }

  function buildHome() {
    const card = (room) =>
      `<button class="room-card" id="card-${room.id}" data-room="${room.id}" style="--card-accent:${room.accent?.border ?? '#849c66'}">` +
      '<canvas width="320" height="180" aria-hidden="true"></canvas>' +
      `<span class="eyebrow">${room.eyebrow}</span><strong>${room.name}</strong>` +
      `<span class="room-card-tagline">${room.tagline}</span></button>`;
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
    for (const button of $('home-themes').querySelectorAll('.room-card')) {
      button.addEventListener('click', () => open(button.dataset.room));
      drawPreview(W.room(button.dataset.room), button.querySelector('canvas'));
    }
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
    document.body.classList.remove('focus-mode');
  }

  const homeTitle = document.title;

  function showHome() {
    leaveRoom();
    current = null;
    document.title = homeTitle;
    stage.leave();
    document.body.dataset.room = 'home';
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
    if (!W.room(id)) return;
    choose(id);
    setHash('room=' + id);
    window.scrollTo(0, 0);
    document.querySelector(`#${panelOf(current)} h1`)?.focus({ preventScroll: true });
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
    applyParams(q);
    if (navigating) document.querySelector(`#${panelOf(current)} h1`)?.focus({ preventScroll: true });
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
    const room = W.room(item.room);
    if (!room) return;
    if (room.layout === 'custom') {
      open(room.id);
      room.restore(item.settings, item.title);
      return;
    }
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
      execute(input) {
        if (!input || !ids.includes(input.room) || Object.keys(input).some((k) => k !== 'room'))
          throw Error('Unknown exploration');
        open(input.room);
        return { room: current.id, soundOn: W.soundOn() };
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

  /** A language menu in the footer, shown only once a second language exists. */
  function buildLanguagePicker() {
    const all = W.languages();
    const codes = Object.keys(all);
    if (codes.length < 2) return;
    const label = document.createElement('label');
    label.className = 'language-pick';
    label.innerHTML =
      `<span>${W.text('app').language}</span><select id="language">` +
      codes.map((c) => `<option value="${c}"${c === W.lang ? ' selected' : ''}>${all[c].name}</option>`).join('') +
      '</select>';
    document.querySelector('footer').appendChild(label);
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

  function start() {
    W.applyPageText();
    buildLanguagePicker();
    stage.init();
    buildHome();
    bindDialogs();
    route();
    window.addEventListener('hashchange', route);
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
