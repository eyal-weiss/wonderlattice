/*
 * App shell: builds the room navigation from the registry, switches rooms,
 * routes shared links (#room=…), wires dialogs, narration, the trail, and the
 * optional browser-agent tools. Loaded last, after every room has registered.
 */
(() => {
  'use strict';

  const W = Wonderloom;
  const { $, rooms, stage } = W;
  let current = null;

  function buildNavigation() {
    const nav = $('room-nav');
    nav.style.setProperty('--room-count', rooms.length);
    nav.innerHTML = rooms
      .map((room, i) => {
        const a = room.accent;
        const accent = a ? ` style="--tab-bg:${a.background};--tab-border:${a.border};--tab-ink:${a.color}"` : '';
        return (
          `<button class="room-tab" id="tab-${room.id}" role="tab" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ''}` +
          ` aria-controls="${panelOf(room)}" data-room="${room.id}"${accent}>` +
          `<span class="room-symbol" aria-hidden="true">${room.symbol}</span><span><small>${room.eyebrow}</small>${room.name}</span></button>`
        );
      })
      .join('\n');
    const tabs = [...nav.querySelectorAll('.room-tab')];
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => choose(tab.dataset.room));
      tab.addEventListener('keydown', (e) => {
        const n = tabs.length;
        const j = { ArrowRight: (i + 1) % n, ArrowLeft: (i + n - 1) % n, Home: 0, End: n - 1 }[e.key];
        if (j === undefined) return;
        e.preventDefault();
        tabs[j].focus();
        choose(tabs[j].dataset.room);
      });
    });
  }

  const panelOf = (room) => room.panel ?? 'new-room';

  /** Show a room by id. Unknown ids are ignored. */
  function choose(id) {
    const next = W.room(id);
    if (!next) return;
    WonderloomGuests.pick(id);
    $('trail-return').hidden = true;
    W.silence();
    W.narration.stop();
    document.body.classList.remove('focus-mode');
    current = next;
    document.body.dataset.room = id;
    document.querySelectorAll('.room-tab').forEach((b) => {
      const selected = b.dataset.room === id;
      b.setAttribute('aria-selected', selected);
      b.tabIndex = selected ? 0 : -1;
    });
    const panels = new Set(rooms.map(panelOf));
    for (const panel of panels) $(panel).hidden = panel !== panelOf(next);
    if (next.layout === 'custom') {
      stage.leave();
      next.enter?.();
    } else stage.enter(next);
  }

  /**
   * Open the room named in a shared link such as #room=traffic&demand=1000,
   * accepting only in-range values. Older drawing links may omit the room.
   */
  function applyParams(q) {
    const id = q.get('room') || (q.has('k') ? 'motion' : null);
    const room = W.room(id);
    if (!room) return false;
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
      canvas: $('scene-canvas'),
    };
  }

  /** Reopen a saved moment, accepting only in-range values. */
  function restore(item) {
    const room = W.room(item.room);
    if (!room) return;
    if (room.layout === 'custom') {
      choose(room.id);
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
    choose(room.id);
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
    $('about-button').addEventListener('click', () => $('about-dialog').showModal());
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
      if (go) choose(go.dataset.go);
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
    const app = { choose };
    for (const room of rooms) room.agentTools?.(app).forEach(register);
    register({
      name: 'open_exploration',
      description: 'Open one of Wonderloom’s visible playgrounds. Sound remains off.',
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
        choose(input.room);
        return { room: current.id, soundOn: W.soundOn() };
      },
    });
    register({
      name: 'read_exploration',
      description: 'Read the active exploration, its settings, and whether sound is on.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true },
      execute: () => ({
        room: current.id,
        settings: stage.settingsFor(current.id) ?? null,
        soundOn: W.soundOn(),
        playing: stage.playing,
      }),
    });
    window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
  }

  function start() {
    buildNavigation();
    for (const room of rooms) room.init?.();
    stage.init();
    bindDialogs();
    // Open the room a shared link names, or else the first room.
    if (!applyParams(new URLSearchParams(location.hash.slice(1)))) choose(rooms[0].id);
    window.addEventListener('hashchange', () => applyParams(new URLSearchParams(location.hash.slice(1))));
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
    WonderloomTrail.init({ capture, restore, open: choose });
    registerAgentTools();
  }

  W.app = { choose, start };
  start();
})();
