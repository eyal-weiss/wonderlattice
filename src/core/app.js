/*
 * App shell: builds the home map from the room registry, switches between the
 * map and rooms, keeps the address in step (#room=…, so Back works and links
 * can be shared), and wires dialogs, narration, the trail, the day and night
 * colours, and the optional browser-agent tools. Loaded last, after every room
 * has registered.
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
  /**
   * Rooms in route order: the order of their scripts in index.html. That order is the numbering on the map and the
   * room bar's ‹ ›, a tour designed so each room is unlike the one before (docs/ARCHITECTURE.md, "The route").
   */
  const ordered = () => rooms;

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

  /** A small mark on the map's rooms already opened: never a count, just a quiet sign of where you've been. */
  function markVisited() {
    const seen = visitedRooms();
    for (const card of document.querySelectorAll('.map-room'))
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
  let newest = [];
  function buildWhatsNew() {
    const since = Date.now() - NEW_DAYS * 24 * 60 * 60 * 1000;
    // Newest first; rooms that went live on the same day in a fixed order (by id), since the room list's order is
    // the route, not the order of arrival.
    const fresh = rooms
      .filter((room) => room.added && Date.parse(room.added) >= since)
      .sort((a, b) => b.added.localeCompare(a.added) || b.id.localeCompare(a.id))
      .slice(0, NEW_MOST);
    newest = fresh.map((room) => room.id);
    const line = $('whats-new');
    line.hidden = !fresh.length;
    line.innerHTML =
      `<span class="eyebrow">${W.text('app').whatsNew}</span> ` +
      fresh.map((r) => `<button class="whats-new-room" data-go="${r.id}">${r.name}</button>`).join(' · ');
  }

  // ---------- The home map: every room on one route ----------
  //
  // Room 1, 2, 3… sit next to each other on a triangular lattice and one line joins them, so the numbers are a tour
  // (docs/ARCHITECTURE.md, "The route"). Each room's cell takes its theme's colour. On wide screens the line winds up
  // and down columns like a river; on phones it zigzags down the page. Right-to-left pages mirror it. Each room shows
  // a small ready-made picture (assets/rooms/thumbs/<id>.webp, from `npm run previews`), so the map needs no room's
  // code: the published site loads a room only when it is opened.

  const themeColour = (theme) => `var(--t-${theme})`;
  // The map shows the middle of each room's picture (a small square); its card, the whole picture, fetched only when
  // someone points at the room. The standalone file carries the squares inside it and uses them for both.
  const thumbOf = (id) => W.thumbSources?.[id] ?? `./assets/rooms/thumbs/${id}.webp`;
  const wideThumbOf = (id) => W.thumbSources?.[id] ?? `./assets/rooms/thumbs/${id}-wide.webp`;

  /** Places on the lattice, in lattice units (x in half steps; odd rows sit half a step over), one per room. */
  function routePlaces(count, width) {
    const places = [];
    if (width < 640) {
      // Phones: rows of three and two, zigzagging down the page.
      for (let row = 0; places.length < count; row++) {
        const xs = row % 2 ? [1.5, 0.5] : [0, 1, 2];
        for (const x of xs) if (places.length < count) places.push([x, row]);
      }
      return places;
    }
    // Wider screens: columns of `rows` rooms, the line going down one column and up the next. Four rows while the
    // pictures stay a comfortable size; more rows when there are many rooms or the screen is narrow.
    let rows = 4;
    while (width / (Math.ceil(count / rows) + 0.5) < 118 && rows < 12) rows++;
    for (let col = 0; places.length < count; col++)
      for (let k = 0; k < rows && places.length < count; k++) {
        const row = col % 2 ? rows - 1 - k : k;
        places.push([col + (row % 2) * 0.5, row]);
      }
    return places;
  }

  let mapWidth = 0;
  function buildHome() {
    const t = W.text('app');
    const list = ordered();
    $('map-rooms').innerHTML = list
      .map((room, i) => {
        const tagline = `${room.tagline}`;
        return (
          `<button class="map-room${i === 0 ? ' map-start' : ''}" id="card-${room.id}" data-room="${room.id}" style="--c:${themeColour(room.theme)}">` +
          `<span class="map-disc"><img src="${thumbOf(room.id)}" alt="" width="176" height="176" loading="lazy" decoding="async"></span>` +
          `<span class="map-num" aria-hidden="true">${i + 1}</span>` +
          (newest.includes(room.id) ? `<span class="map-new" aria-hidden="true">${t.map.newBadge}</span>` : '') +
          `<span class="map-name"><span class="visually-hidden">${i + 1}. </span>${room.name}</span>` +
          `<span class="visually-hidden">. ${tagline}</span>` +
          `<span class="visually-hidden room-card-visited">${t.visited}</span></button>`
        );
      })
      .join('');
    // A picture that can't load (an old copy of the site, say) gives way to the room's own drawing, when its code is
    // here, or to a plain dark disc.
    for (const img of $('map-rooms').querySelectorAll('img'))
      img.addEventListener(
        'error',
        () => {
          const room = W.room(img.closest('.map-room').dataset.room);
          if (!W.isLoaded(room.id)) return img.remove();
          const canvas = document.createElement('canvas');
          drawPreview(room, canvas);
          img.replaceWith(canvas);
        },
        { once: true },
      );
    for (const button of $('map-rooms').querySelectorAll('.map-room'))
      button.addEventListener('click', () => open(button.dataset.room));
    buildKey();
    buildRoomList();
    markVisited();
    bindMapTip();
    mapWidth = 0;
    placeMap();
    new ResizeObserver(placeMap).observe($('home-map'));
  }

  /** Where everything goes at the map's current width: the rooms, their cells, and the line. */
  function placeMap() {
    const box = $('home-map');
    const width = box.clientWidth;
    if (!width || Math.abs(width - mapWidth) < 2 || $('home').hidden) return;
    mapWidth = width;
    const list = ordered();
    const phone = width < 640;
    const rtl = document.documentElement.dir === 'rtl';
    const places = routePlaces(list.length, width);
    const maxX = Math.max(...places.map((p) => p[0]));
    const maxY = Math.max(...places.map((p) => p[1]));
    const dx = width / (maxX + 1);
    const dy = dx * (phone ? 1.08 : 1.04);
    const disc = Math.round(dx * (phone ? 0.54 : 0.56));
    const top = dy * 0.7;
    const xy = ([x, y]) => [((rtl ? maxX - x : x) + 0.5) * dx, y * dy + top];
    box.style.setProperty('--cell', `${dx}px`);
    box.style.setProperty('--disc', `${disc}px`);

    // Each room's hexagonal cell (the lattice's Voronoi cell), and the route through their centres.
    const a = (dx * dx) / 8 / dy + dy / 2,
      b = dy / 2 - (dx * dx) / 8 / dy;
    const fixed = (v) => v.toFixed(1);
    const points = places.map(xy);
    let svg = '';
    list.forEach((room, i) => {
      const [cx, cy] = points[i];
      const hex = [
        [cx, cy - a],
        [cx + dx / 2, cy - b],
        [cx + dx / 2, cy + b],
        [cx, cy + a],
        [cx - dx / 2, cy + b],
        [cx - dx / 2, cy - b],
      ];
      svg += `<polygon class="map-cell" style="--c:${themeColour(room.theme)}" points="${hex.map((p) => p.map(fixed).join(',')).join(' ')}"/>`;
    });
    const line = points.map((p) => p.map(fixed).join(',')).join(' ');
    svg += `<polyline class="map-line-casing" points="${line}"/><polyline class="map-line" points="${line}"/>`;
    for (let i = 0; i < points.length - 1; i++) {
      const [x1, y1] = points[i],
        [x2, y2] = points[i + 1];
      const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
      svg += `<path class="map-arrow" d="M-3.5 -4 L1.5 0 L-3.5 4" transform="translate(${fixed((x1 + x2) / 2)} ${fixed((y1 + y2) / 2)}) rotate(${fixed(angle)})"/>`;
    }
    $('map-lines').innerHTML = svg;

    const buttons = $('map-rooms').querySelectorAll('.map-room');
    buttons.forEach((button, i) => {
      button.style.left = `${fixed(points[i][0])}px`;
      button.style.top = `${fixed(points[i][1])}px`;
    });
    // Tall enough for the lowest names, however many lines they take.
    let height = Math.round(maxY * dy + top + dy * 0.85);
    box.style.height = `${height}px`;
    const boxTop = box.getBoundingClientRect().top;
    const lowest = Math.max(...[...buttons].map((n) => n.getBoundingClientRect().bottom - boxTop));
    if (lowest + 16 > height) height = Math.ceil(lowest + 16);
    box.style.height = `${height}px`;
    $('map-lines').setAttribute('viewBox', `0 0 ${width} ${height}`);
  }

  /** The key under the map: how to read the line, and the colour of each theme. */
  function buildKey() {
    const t = W.text('app');
    $('map-key').innerHTML =
      `<p><svg viewBox="0 0 34 16" aria-hidden="true"><line class="map-line" x1="4" y1="8" x2="30" y2="8"/>` +
      `<path class="map-arrow" d="M14.5 4 L19.5 8 L14.5 12"/></svg>${t.map.key(ordered().length)}</p>` +
      `<ul class="map-legend">${W.themes
        .filter((theme) => rooms.some((r) => r.theme === theme.id))
        .map((theme) => `<li style="--c:${themeColour(theme.id)}"><i></i>${theme.name}</li>`)
        .join('')}</ul>`;
  }

  /** Every room in words, by theme: its number on the route, its name and tagline. */
  function buildRoomList() {
    const list = ordered();
    $('room-list').innerHTML = W.themes
      .map((theme) => {
        const mine = list.filter((r) => r.theme === theme.id);
        if (!mine.length) return '';
        return (
          `<section class="room-list-theme" style="--c:${themeColour(theme.id)}" aria-labelledby="theme-${theme.id}">` +
          `<h3 id="theme-${theme.id}"><i aria-hidden="true"></i>${theme.name}</h3><p>${theme.blurb}</p><ul>` +
          mine
            .map(
              (room) =>
                `<li><button class="room-list-room" data-go="${room.id}"><b>${list.indexOf(room) + 1}</b>` +
                `<span>${room.name}</span><small>${room.tagline}</small></button></li>`,
            )
            .join('') +
          '</ul></section>'
        );
      })
      .join('');
  }

  /** Pointing at a room (or reaching it with the keyboard) shows its card: picture, tagline, and the next room. */
  function bindMapTip() {
    const tip = $('map-tip');
    const show = (button) => {
      const list = ordered();
      const room = W.room(button.dataset.room);
      const i = list.indexOf(room);
      const t = W.text('app');
      const next = list[i + 1];
      const arrow = document.documentElement.dir === 'rtl' ? '←' : '→';
      tip.style.setProperty('--c', themeColour(room.theme));
      tip.innerHTML =
        `<img src="${wideThumbOf(room.id)}" alt="" width="400" height="225">` +
        `<span class="map-tip-theme"><i></i>${W.themes.find((th) => th.id === room.theme).name}</span>` +
        `<strong>${room.name}</strong><span class="map-tip-tagline">${room.tagline}</span>` +
        `<span class="map-tip-next">${next ? `${t.map.next} ${arrow} ${i + 2}. ${next.name}` : t.map.last}</span>`;
      tip.hidden = false;
      const map = $('home-map').getBoundingClientRect();
      const disc = button.querySelector('.map-disc').getBoundingClientRect();
      const w = tip.offsetWidth,
        h = tip.offsetHeight;
      const after = disc.right - map.left + 14,
        before = disc.left - map.left - w - 14;
      const rtl = document.documentElement.dir === 'rtl';
      let x = rtl ? (before >= 8 ? before : after) : after + w <= map.width - 8 ? after : before;
      if (x < 8 || x + w > map.width - 8) x = Math.max(8, Math.min(map.width - w - 8, disc.left - map.left));
      const y = Math.max(8, Math.min(map.height - h - 8, disc.top - map.top - 10));
      tip.style.left = `${x}px`;
      tip.style.top = `${y}px`;
    };
    const hide = () => (tip.hidden = true);
    const area = $('map-rooms');
    // Only where there is a pointer that hovers: on a touch screen a tap opens the room straight away.
    area.addEventListener('pointerover', (e) => {
      const button = e.target.closest('.map-room');
      if (button && e.pointerType === 'mouse') show(button);
    });
    area.addEventListener('pointerleave', hide);
    area.addEventListener('focusin', (e) => {
      const button = e.target.closest('.map-room');
      if (button && button.matches(':focus-visible')) show(button);
    });
    area.addEventListener('focusout', hide);
    area.addEventListener('click', hide);
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
    placeMap();
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
    $('room-theme').style.setProperty('--c', themeColour(current.theme));
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
      (current ? document.querySelector(`#${panelOf(current)} h1`) : document.querySelector('.map-room'))?.focus();
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

  /**
   * Day and night: the button in the header shows a moon by day and a sun at night, and is "pressed" at night. Once
   * the page has loaded, the night typefaces are fetched quietly so the first switch is instant (styles/fonts.css).
   */
  function bindTheme() {
    const display = WonderlatticeDisplay;
    const button = $('theme-toggle');
    const moon =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" /></svg>';
    const sun =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5" />' +
      '<path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" /></svg>';
    const show = () => {
      const night = display.theme === 'night';
      button.innerHTML = night ? sun : moon;
      button.setAttribute('aria-pressed', String(night));
    };
    button.setAttribute('aria-label', W.text('app').nightColours);
    button.title = W.text('app').nightColours;
    button.addEventListener('click', () => {
      display.setTheme(display.theme === 'night' ? 'day' : 'night');
      // The map's lines and pictures don't depend on the colours, but its key and cells do (through the tokens).
    });
    display.onChange(show);
    show();
    const fetchNightFonts = () => {
      if (!document.fonts?.load || document.documentElement.dataset.fonts === 'device') return;
      const sample = { he: 'א', ar: 'ا' }[W.lang] ?? '';
      for (const face of [
        '400 1em "IM Fell English"',
        'italic 400 1em "IM Fell English"',
        '400 1em "Frank Ruhl Libre"',
        ...(W.lang === 'ar' ? ['400 1em "Amiri"'] : []),
      ])
        document.fonts.load(face, `Aa${sample}`).catch(() => {});
    };
    const later = () =>
      window.requestIdleCallback ? requestIdleCallback(fetchNightFonts) : setTimeout(fetchNightFonts, 1500);
    if (document.readyState === 'complete') later();
    else window.addEventListener('load', later, { once: true });
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
    bindTheme();
    stage.init();
    buildWhatsNew();
    buildHome();
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
    // A message says where it was written: the room's explanation, or About (and the room it was opened in).
    W.feedback.init((box) => ({ place: box === 'about' ? 'about' : 'explanation', room: current?.id ?? null }));
    registerAgentTools();
  }

  W.app = { open, goHome };
  start();
})();
