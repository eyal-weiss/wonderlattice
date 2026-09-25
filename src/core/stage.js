/*
 * The shared stage for canvas rooms (#new-room in index.html): title, canvas,
 * transport buttons, control panel, presets, pointer/keyboard input, sharing,
 * and the animation loop. A room supplies its words, settings, controls, and
 * drawing code; this file does the rest. See docs/ARCHITECTURE.md.
 */
(() => {
  'use strict';

  const W = Wonderlattice;
  const { $, clamp } = W;
  const reduced = W.prefersReducedMotion();
  const words = () => W.text('app').stage;

  const settings = Object.create(null); // room id → live settings object
  const chosen = Object.create(null); // room id → highlighted preset index, or -1
  let room = null; // the stage room being shown, or null
  let playing = !reduced,
    clock = 0,
    last = 0,
    width = 800,
    height = 450,
    drag = null,
    canvas,
    ctx;

  /** The interface rooms use. Hooks receive (settings, stage). */
  const stage = {
    get width() {
      return width;
    },
    get height() {
      return height;
    },
    get clock() {
      return clock;
    },
    get playing() {
      return playing;
    },
    get dragging() {
      return !!drag;
    },
    get ctx() {
      return ctx;
    },
    setPlaying(value) {
      playing = value;
    },
    isShowing: (r) => room === r,
    settingsFor: (id) => settings[id],
    setChosen(index) {
      chosen[room.id] = index;
    },
    setChosenFor(id, index) {
      chosen[id] = index;
    },
    draw,
    refresh: renderControls,
    sync,
    clear: () => ctx.clearRect(0, 0, width, height),

    /** Markup for a range slider bound to settings[key]. */
    slider(key, label, min, max, step, value, unit = '', hint = '') {
      return (
        `<div class="control"><label for="c-${key}">${label}<output id="v-${key}" aria-live="off">${value}${unit}</output></label>` +
        `<input id="c-${key}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" data-key="${key}" data-unit="${unit}">` +
        `${hint ? `<p>${hint}</p>` : ''}</div>`
      );
    },
    /** Markup for a checkbox bound to boolean settings[key]. */
    check(key, label, value) {
      return `<label class="toggle-row"><input type="checkbox" data-check="${key}" ${value ? 'checked' : ''}>${label}</label>`;
    },

    init,
    enter,
    leave: () => (room = null),
    openInsight,
    get current() {
      return room;
    },
  };
  W.stage = stage;

  const isStageRoom = (r) => r && r.layout !== 'custom';

  function init() {
    canvas = $('scene-canvas');
    ctx = canvas.getContext('2d');
    for (const r of W.rooms) {
      if (!isStageRoom(r)) continue;
      settings[r.id] = { ...r.defaults };
      chosen[r.id] = r.defaultPreset ?? 0;
    }
    bindTransport();
    bindInput();
    new ResizeObserver(size).observe(canvas.parentElement);
    document.addEventListener('visibilitychange', () => (last = 0));
    requestAnimationFrame(frame);
  }

  function draw() {
    if (room) room.draw(ctx, settings[room.id], stage);
  }

  function renderControls() {
    const s = settings[room.id];
    const t = words();
    let h = `<div class="panel-head"><h2>${t.makeItYours}</h2><span class="eyebrow">${room.panelEyebrow}</span></div>`;
    h +=
      `<div class="math-guest" id="math-guest-scene" role="group" aria-label="${t.guestLabel}"></div>` +
      `<button class="button trail-keep wide" id="trail-keep-scene">${t.keep}</button>`;
    h += room.controls(s, stage);
    // The explanation opens a dialog, so it gets the same chevron as the drawing room, not an external-link arrow.
    h += `<div class="hint"><strong>${t.nudge}</strong>${room.nudge}</div><button class="button why" id="scene-why"><span>${room.whyLabel}</span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 6 6-6 6" /></svg></button>`;
    const panel = $('scene-controls');
    panel.innerHTML = h;
    panel.querySelectorAll('[data-key]').forEach((input) =>
      input.addEventListener('input', () => {
        settings[room.id][input.dataset.key] = Number(input.value);
        chosen[room.id] = -1;
        room.onInput?.(settings[room.id], stage);
        sync();
        draw();
      }),
    );
    panel.querySelectorAll('[data-check]').forEach((input) =>
      input.addEventListener('change', () => {
        settings[room.id][input.dataset.check] = input.checked;
        draw();
      }),
    );
    room.bindControls?.(panel, s, stage);
    $('scene-why').addEventListener('click', openInsight);
    WonderlatticeGuests.render(room.id, $('math-guest-scene'));
    sync();
  }

  /** Refresh slider readouts, play button, preset highlight, and room readouts. */
  function sync() {
    if (!room) return;
    const s = settings[room.id];
    document.querySelectorAll('#scene-controls [data-key]').forEach((input) => {
      const text = Number(s[input.dataset.key].toFixed(3)) + input.dataset.unit;
      $('v-' + input.dataset.key).textContent = text;
      input.setAttribute('aria-valuetext', text); // the slider says its own value; the <output> stays quiet
    });
    $('scene-play').textContent = playing ? words().pause : words().play;
    document.querySelectorAll('.scene-preset').forEach((b, i) => b.setAttribute('aria-pressed', i === chosen[room.id]));
    room.readouts?.(settings[room.id], stage);
  }

  function size() {
    if (!room) return;
    const r = canvas.getBoundingClientRect();
    width = Math.max(1, r.width);
    height = Math.max(1, r.height);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  /** Show a stage room. Called by the app after navigation bookkeeping. */
  function enter(next) {
    room = next;
    clock = 0;
    last = 0;
    playing = !reduced; // every room starts moving; a pause in one room doesn't follow you to the next
    // Turn-based rooms ("still: true") have nothing continuous to pause.
    $('scene-play').hidden = !!room.still;
    for (const [id, value] of [
      ['room-title', room.title],
      ['room-subtitle', room.subtitle],
      ['room-field', room.field],
      ['scene-label', room.sceneLabel],
      ['scene-name', room.sceneName],
      ['scene-tip', room.tip],
      ['scene-action', room.actionLabel],
    ])
      $(id).textContent = value;
    canvas.setAttribute('aria-label', room.canvasLabel);
    // A canvas that takes keys is an interactive widget, not a picture: screen readers then pass keys
    // through to it. The visible tip describes how to use it.
    const interactive = !!(room.pointer && (room.pointer.arrow || room.pointer.key || room.pointer.down));
    canvas.setAttribute('role', interactive ? 'application' : 'img');
    canvas.tabIndex = interactive ? 0 : -1;
    if (interactive) {
      canvas.setAttribute('aria-roledescription', words().canvasRole);
      canvas.setAttribute('aria-describedby', 'scene-tip');
    } else {
      canvas.removeAttribute('aria-roledescription');
      canvas.removeAttribute('aria-describedby');
    }
    const presets = $('scene-presets');
    presets.innerHTML = '';
    room.presets.forEach((p, index) => {
      const b = document.createElement('button');
      b.className = 'scene-preset';
      b.innerHTML = `<span class="number" aria-hidden="true">${p.badge}</span><strong>${p.name}</strong><span>${p.note}</span>`;
      b.addEventListener('click', () => {
        Object.assign(settings[room.id], p.settings);
        chosen[room.id] = index;
        clock = 0;
        room.onPreset?.(settings[room.id], stage);
        renderControls();
        draw();
      });
      presets.appendChild(b);
    });
    $('connection').innerHTML =
      `<p>${room.connection.html}</p><button class="button" data-go="${room.connection.go}">${room.connection.label}</button>`;
    renderControls();
    room.enter?.(settings[room.id], stage);
    size();
  }

  function openInsight() {
    W.silence();
    W.narration.stop();
    $('insight-title').textContent = room.insight.title;
    $('insight-body').innerHTML = room.insight.html;
    room.insight.onOpen?.(settings[room.id]);
    $('insight-dialog').showModal();
  }

  function bindTransport() {
    $('scene-play').addEventListener('click', () => {
      playing = !playing;
      if (!playing) W.silence();
      last = 0;
      sync();
      draw();
    });
    $('scene-reset').addEventListener('click', () => {
      clock = 0;
      room.reset?.(settings[room.id], stage);
      draw();
    });
    $('scene-action').addEventListener('click', () => room.action?.(settings[room.id], stage));
    $('scene-save').addEventListener('click', () => {
      const out = document.createElement('canvas');
      out.width = canvas.width;
      out.height = canvas.height;
      const c = out.getContext('2d');
      c.fillStyle = '#0a0e15';
      c.fillRect(0, 0, out.width, out.height);
      c.drawImage(canvas, 0, 0);
      W.savePNG(out, `wonderlattice-${room.id}.png`, {
        saved: words().saved,
        failed: words().saveFailed,
      });
    });
    $('scene-share').addEventListener('click', () => {
      const web = W.isWeb();
      const s = settings[room.id];
      const text = web
        ? W.shareLink(new URLSearchParams({ room: room.id, ...s }))
        : words().shareText(room.title) + '\n' + JSON.stringify(s, null, 2);
      W.copyText(text, {
        copied: web ? words().linkCopied : words().settingsCopied,
        description: web ? words().linkDescription : words().settingsDescription,
      });
    });
  }

  function pointer(e) {
    const r = canvas.getBoundingClientRect();
    return { x: clamp((e.clientX - r.left) / r.width, 0, 1), y: clamp((e.clientY - r.top) / r.height, 0, 1) };
  }

  function bindInput() {
    canvas.addEventListener('pointerdown', (e) => {
      // preventScroll: a scroll here would shift the canvas under the pointer mid-click.
      canvas.focus({ preventScroll: true });
      canvas.setPointerCapture(e.pointerId);
      drag = { x: e.clientX, y: e.clientY };
      room?.pointer?.down?.(pointer(e), settings[room.id], stage);
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!room?.pointer?.move) return;
      const moved = drag ? { dx: e.clientX - drag.x, dy: e.clientY - drag.y } : { dx: 0, dy: 0 };
      const dragging = !!drag;
      if (drag) drag = { x: e.clientX, y: e.clientY };
      room.pointer.move(pointer(e), { ...moved, dragging, mouse: e.pointerType === 'mouse' }, settings[room.id], stage);
    });
    const release = () => {
      drag = null;
      room?.pointer?.up?.();
    };
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    canvas.addEventListener('pointerleave', () => {
      if (!drag) room?.pointer?.leave?.();
    });
    canvas.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') return void room?.pointer?.escape?.();
      if (e.code === 'Space') {
        // Space plays and pauses, except in still rooms, which have no Pause.
        e.preventDefault();
        if (!room?.still) $('scene-play').click();
        return;
      }
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        // Any other key goes to the room's optional `key` hook, which returns true if it used it.
        if (room?.pointer?.key?.(e, settings[room.id], stage)) {
          e.preventDefault();
          draw();
        }
        return;
      }
      e.preventDefault();
      const dx = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0,
        dy = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
      room?.pointer?.arrow?.(dx, dy, settings[room.id], stage);
      draw();
    });
  }

  function frame(ms) {
    const dt = last ? Math.min(0.035, (ms - last) / 1000) : 0;
    last = ms;
    if (room && !document.hidden && !document.querySelector('dialog[open]') && playing) {
      clock += dt;
      room.step?.(dt, settings[room.id], stage);
      draw();
    }
    requestAnimationFrame(frame);
  }
})();
