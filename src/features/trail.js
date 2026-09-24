/*
 * My trail: an optional, private collection of saved moments. Everything stays
 * in this browser's localStorage; export/import moves it as JSON. No network.
 * The app supplies an adapter: { capture(), restore(item), open(roomId) }.
 */
(() => {
  'use strict';

  const W = Wonderloom;
  const { $ } = W;
  const KEY = 'wonderloom.trail.v1',
    MAX = 24;
  // Threads between rooms, offered once a visitor has saved something from one side.
  const bridges = [
    ['motion', 'waves', 'A turning circle can leave a wave in its wake.'],
    ['flock', 'traffic', 'A crowd can surprise itself, one local choice at a time.'],
    ['ribbon', 'motion', 'Follow a point and a shape can reveal another side.'],
  ];
  const name = (id) => W.room(id)?.name ?? id;
  let entries = [],
    adapter,
    current = null;

  /** Validate a stored or imported entry; anything unexpected is rejected. */
  function valid(item) {
    if (
      !item ||
      typeof item !== 'object' ||
      !W.room(item.room) ||
      typeof item.id !== 'string' ||
      item.id.length > 90 ||
      typeof item.created !== 'number' ||
      !Number.isFinite(item.created) ||
      !item.settings ||
      typeof item.settings !== 'object' ||
      Array.isArray(item.settings)
    )
      return false;
    if (
      typeof item.title !== 'string' ||
      item.title.length > 90 ||
      typeof item.note !== 'string' ||
      item.note.length > 400 ||
      typeof item.returnNote !== 'string' ||
      item.returnNote.length > 400
    )
      return false;
    if (
      typeof item.image !== 'string' ||
      item.image.length > 90000 ||
      (item.image && !/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(item.image))
    )
      return false;
    const settings = Object.entries(item.settings);
    return (
      settings.length <= 20 &&
      settings.every(
        ([k, v]) =>
          /^[a-z]+$/.test(k) &&
          ['number', 'boolean'].includes(typeof v) &&
          (typeof v !== 'number' || Number.isFinite(v)),
      )
    );
  }

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || '[]');
      if (Array.isArray(data) && data.length <= MAX && data.every(valid)) entries = data;
      else throw Error('Invalid trail');
    } catch {
      entries = [];
      status('Saved trail could not be read in this browser. You can import a previous export.');
    }
  }

  function status(message) {
    const el = $('trail-status');
    if (el) el.textContent = message;
  }

  function persist(next) {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      entries = next;
      return true;
    } catch {
      status('Could not save here. Check available browser storage, or export your existing trail.');
      return false;
    }
  }

  function thumbnail(canvas) {
    try {
      const c = document.createElement('canvas');
      c.width = 280;
      c.height = 158;
      const x = c.getContext('2d');
      x.fillStyle = '#0a0e15';
      x.fillRect(0, 0, c.width, c.height);
      const scale = Math.min(c.width / canvas.width, c.height / canvas.height);
      x.drawImage(
        canvas,
        (c.width - canvas.width * scale) / 2,
        (c.height - canvas.height * scale) / 2,
        canvas.width * scale,
        canvas.height * scale,
      );
      return c.toDataURL('image/jpeg', 0.64);
    } catch {
      return '';
    }
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function capture() {
    const scene = adapter.capture();
    current = {
      id: globalThis.crypto?.randomUUID?.() || Date.now() + '-' + Math.random(),
      room: scene.room,
      title: String(scene.title || name(scene.room)).slice(0, 90),
      settings: scene.settings,
      image: thumbnail(scene.canvas),
      note: '',
      returnNote: '',
      created: Date.now(),
    };
    $('trail-preview').replaceChildren();
    if (current.image) {
      const image = el('img');
      image.src = current.image;
      image.alt = 'Still from this exploration';
      $('trail-preview').append(image);
    }
    $('trail-capture-name').textContent = current.title;
    $('trail-note').value = '';
    status('');
    $('trail-capture-dialog').showModal();
  }

  function save() {
    if (entries.length >= MAX)
      return status(`Your trail has ${MAX} moments. Export it or remove one before saving another.`);
    if (!current || !valid({ ...current, note: $('trail-note').value.slice(0, 400) }))
      return status('This scene could not be saved.');
    current.note = $('trail-note').value.trim().slice(0, 400);
    if (persist([current, ...entries])) {
      $('trail-capture-dialog').close();
      current = null;
      render();
      $('trail-dialog').showModal();
    }
  }

  function card(item) {
    const card = el('article', 'trail-card');
    if (item.image) {
      const image = el('img', 'trail-thumb');
      image.src = item.image;
      image.alt = 'Saved view of ' + name(item.room);
      card.append(image);
    }
    const body = el('div', 'trail-card-copy');
    body.append(
      el('span', 'eyebrow', name(item.room) + ' · ' + new Date(item.created).toLocaleDateString()),
      el('h3', '', item.title),
    );
    if (item.note) body.append(el('p', '', item.note));
    if (item.returnNote) {
      body.append(el('span', 'trail-reflection-label', 'On returning'));
      body.append(el('p', '', item.returnNote));
    }
    const actions = el('div', 'trail-card-actions'),
      go = el('button', 'button', 'Revisit'),
      remove = el('button', 'quiet', 'Remove');
    go.type = 'button';
    remove.type = 'button';
    go.addEventListener('click', () => {
      adapter.restore(item);
      $('trail-dialog').close();
      showReturn(item);
    });
    remove.addEventListener('click', () => {
      if (persist(entries.filter((e) => e.id !== item.id))) {
        if ($('trail-return').dataset.id === item.id) $('trail-return').hidden = true;
        render();
      }
    });
    actions.append(go, remove);
    body.append(actions);
    card.append(body);
    return card;
  }

  function render() {
    const list = $('trail-list');
    list.replaceChildren();
    if (!entries.length)
      list.append(
        el(
          'p',
          'trail-empty',
          'Your trail is empty. Save something that catches your eye, then return to it whenever you like.',
        ),
      );
    entries.forEach((item) => list.append(card(item)));

    const connections = $('trail-connections');
    connections.replaceChildren();
    const visited = new Set(entries.map((e) => e.room));
    bridges
      .filter(([a, b]) => W.room(a) && W.room(b) && (visited.has(a) || visited.has(b)))
      .forEach(([a, b, thought]) => {
        const bridge = el('div', 'trail-bridge');
        bridge.append(el('span', 'eyebrow', name(a) + ' ↔ ' + name(b)), el('p', '', thought));
        // Suggest the side not yet visited; if both are, the second.
        const target = visited.has(a) && !visited.has(b) ? b : visited.has(b) && !visited.has(a) ? a : b;
        const go = el('button', 'button', 'Explore ' + name(target));
        go.addEventListener('click', () => {
          $('trail-dialog').close();
          $('trail-return').hidden = true;
          adapter.open(target);
        });
        bridge.append(go);
        connections.append(bridge);
      });
    $('trail-connections-heading').hidden = !connections.childElementCount;
    $('trail-export').disabled = !entries.length;
  }

  function showReturn(item) {
    const banner = $('trail-return');
    banner.hidden = false;
    banner.dataset.id = item.id;
    $('trail-return-title').textContent = 'A moment you kept · ' + name(item.room);
    $('trail-return-thought').textContent = item.note
      ? 'Then you noticed: “' + item.note + '”'
      : 'What do you notice now?';
    $('trail-return-note').value = item.returnNote || '';
    banner.scrollIntoView({ block: 'nearest', behavior: W.prefersReducedMotion() ? 'instant' : 'smooth' });
  }

  function download() {
    const blob = new Blob([JSON.stringify({ format: 'wonderloom-trail', version: 1, entries }, null, 2)], {
      type: 'application/json',
    });
    W.download(blob, 'wonderloom-my-trail.json');
  }

  async function importFile(file) {
    if (!file || file.size > 2400000) return status('Choose a Wonderloom trail export smaller than 2 MB.');
    try {
      const data = JSON.parse(await file.text());
      if (
        data.format !== 'wonderloom-trail' ||
        data.version !== 1 ||
        !Array.isArray(data.entries) ||
        data.entries.length > MAX ||
        !data.entries.every(valid)
      )
        throw Error('format');
      if (new Set(data.entries.map((e) => e.id)).size !== data.entries.length) throw Error('duplicate');
      if (persist(data.entries)) {
        status('Trail imported. Your previous trail was replaced.');
        render();
      }
    } catch {
      status('That file is not a valid Wonderloom trail export. Your trail was not changed.');
    } finally {
      $('trail-import').value = '';
    }
  }

  function saveReturnNote() {
    const id = $('trail-return').dataset.id;
    if (!entries.some((e) => e.id === id)) return;
    const next = entries.map((e) =>
      e.id === id ? { ...e, returnNote: $('trail-return-note').value.trim().slice(0, 400) } : e,
    );
    if (persist(next))
      $('trail-return-thought').textContent = 'Your new thought is saved. Come back to it whenever you like.';
  }

  function init(bridge) {
    adapter = bridge;
    load();
    $('trail-open').addEventListener('click', () => {
      render();
      $('trail-dialog').showModal();
    });
    // "Keep this moment" buttons live in each room's panel, some re-rendered.
    document.addEventListener('click', (event) => {
      if (event.target.closest('.trail-keep')) capture();
    });
    $('trail-save').addEventListener('click', save);
    $('trail-export').addEventListener('click', download);
    $('trail-import').addEventListener('change', (event) => importFile(event.target.files[0]));
    $('trail-return-save').addEventListener('click', saveReturnNote);
    $('trail-return-close').addEventListener('click', () => ($('trail-return').hidden = true));
    document
      .querySelectorAll('.trail-close')
      .forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));
    render();
  }

  window.WonderloomTrail = { init, valid };
})();
