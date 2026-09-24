/*
 * Wonderloom core: one shared namespace, small helpers, and the room registry.
 *
 * Every file in src/ is a classic script rather than an ES module, so that
 * index.html keeps working when it is opened straight from disk (browsers
 * block module imports from file:// pages). Scripts load in the order listed
 * in index.html and talk to each other only through `Wonderloom`.
 */
(() => {
  'use strict';

  const rooms = [];
  const byId = Object.create(null);
  let toastTimer;
  let narrating = false;

  const $ = (id) => document.getElementById(id);

  const Wonderloom = {
    TAU: Math.PI * 2,
    $,
    clamp: (x, a, b) => Math.max(a, Math.min(b, x)),
    prefersReducedMotion: () => matchMedia('(prefers-reduced-motion: reduce)').matches,

    /** Pure mathematical models, one per room (src/rooms/<id>/model.js). No DOM access. */
    models: {},

    /** Registered rooms, in navigation order. */
    rooms,

    /**
     * Register a room. Rooms appear in the navigation in the order their scripts
     * load. See docs/ARCHITECTURE.md for the fields a room provides.
     */
    defineRoom(room) {
      if (!room || !/^[a-z]+$/.test(room.id)) throw new Error(`Room ids must be lowercase letters: ${room?.id}`);
      if (byId[room.id]) throw new Error(`Room "${room.id}" is defined twice`);
      rooms.push(room);
      byId[room.id] = room;
      return room;
    },

    room: (id) => byId[id],

    /** Stop every room's audio (rooms opt in with a `silence` hook). */
    silence() {
      for (const room of rooms) room.silence?.();
    },

    soundOn: () => rooms.some((room) => room.soundOn?.()),

    toast(message) {
      $('toast').textContent = message;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => ($('toast').textContent = ''), 3400);
    },

    /** True when served over http(s), so a link can be shared instead of plain settings. */
    isWeb: () => /^https?:$/.test(location.protocol),

    shareLink: (params) => location.origin + location.pathname + '#' + params.toString(),

    /** Copy text, falling back to a dialog with the text selected for manual copying. */
    async copyText(text, { copied, description }) {
      try {
        await navigator.clipboard.writeText(text);
        Wonderloom.toast(copied);
      } catch {
        $('copy-description').textContent = description;
        $('copy-text').value = text;
        $('copy-dialog').showModal();
      }
    },

    download(blob, filename) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    },

    /** Save a canvas as a PNG download. */
    savePNG(canvas, filename, { saved, failed }) {
      canvas.toBlob((blob) => {
        if (!blob) return Wonderloom.toast(failed);
        Wonderloom.download(blob, filename);
        Wonderloom.toast(saved);
      }, 'image/png');
    },

    /** Optional spoken narration through the browser's speech synthesis. */
    narration: {
      stop() {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        narrating = false;
        document.querySelectorAll('.narrate').forEach((b) => (b.textContent = 'Listen to this idea'));
      },
      speak(element, button) {
        if (!('speechSynthesis' in window)) {
          Wonderloom.toast('Narration is unavailable in this browser. The full text is here to read.');
          return;
        }
        if (narrating) return Wonderloom.narration.stop();
        Wonderloom.silence();
        const utterance = new SpeechSynthesisUtterance(element.innerText);
        utterance.lang = 'en-US';
        utterance.rate = 0.96;
        utterance.volume = 0.65;
        utterance.onend = Wonderloom.narration.stop;
        utterance.onerror = Wonderloom.narration.stop;
        window.speechSynthesis.speak(utterance);
        narrating = true;
        button.textContent = 'Stop narration';
      },
    },
  };

  globalThis.Wonderloom = Wonderloom;
})();
