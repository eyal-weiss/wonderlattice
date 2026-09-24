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
  const texts = Object.create(null); // scope → language → strings
  const languages = Object.create(null); // code → { name, dir, speech }
  let chosenLang = null; // set once, on first use, from the address or a saved choice
  let toastTimer;
  let narrating = false;

  const $ = (id) => document.getElementById(id);

  /** Deep merge for dictionaries: a translation may leave out any key, at any depth. */
  function merge(base, over) {
    if (Array.isArray(base)) return base.map((b, i) => (over?.[i] === undefined ? b : merge(b, over[i])));
    if (base && typeof base === 'object' && typeof over === 'object' && over) {
      const out = { ...base };
      for (const key of Object.keys(over)) out[key] = key in base ? merge(base[key], over[key]) : over[key];
      return out;
    }
    return over === undefined ? base : over;
  }

  const Wonderloom = {
    TAU: Math.PI * 2,
    $,
    clamp: (x, a, b) => Math.max(a, Math.min(b, x)),
    prefersReducedMotion: () => matchMedia('(prefers-reduced-motion: reduce)').matches,

    /** Pure mathematical models, one per room (src/rooms/<id>/model.js). No DOM access. */
    models: {},

    /** Registered rooms, in navigation order. */
    rooms,

    /** Groups on the home map, in display order. A room names one in its `theme` field. Names come from the text. */
    themes: ['shape', 'chance', 'games', 'making', 'life', 'signals'].map((id) => ({
      id,
      get name() {
        return Wonderloom.text('app').themes[id].name;
      },
      get blurb() {
        return Wonderloom.text('app').themes[id].blurb;
      },
    })),

    /**
     * Register a room. Rooms appear in the navigation in the order their scripts
     * load. See docs/ARCHITECTURE.md for the fields a room provides.
     */
    defineRoom(room) {
      if (!room || !/^[a-z]+$/.test(room.id)) throw new Error(`Room ids must be lowercase letters: ${room?.id}`);
      if (byId[room.id]) throw new Error(`Room "${room.id}" is defined twice`);
      if (!Wonderloom.themes.some((t) => t.id === room.theme)) throw new Error(`Room "${room.id}" needs a known theme`);
      rooms.push(room);
      byId[room.id] = room;
      return room;
    },

    room: (id) => byId[id],

    /**
     * Declare a language: its name in that language, text direction, and a
     * speech-synthesis locale. Language files (src/lang/<code>.js) start with this.
     */
    defineLanguage(code, info) {
      if (!/^[a-z]{2,3}(-[A-Z]{2})?$/.test(code)) throw new Error(`Bad language code: ${code}`);
      languages[code] = { dir: 'ltr', speech: code, ...info };
    },
    languages: () => ({ ...languages }),

    /**
     * The page language, fixed for the whole visit: ?lang=he, then a saved
     * choice, then English; only languages that are defined count. Changing
     * language reloads the page, so rooms can read their words once.
     */
    get lang() {
      if (chosenLang) return chosenLang;
      let asked = null;
      try {
        asked = new URLSearchParams(location.search).get('lang') || localStorage.getItem('wonderloom.lang');
      } catch {
        /* no address or storage (e.g. Node tests) */
      }
      chosenLang = asked && languages[asked] ? asked : 'en';
      return chosenLang;
    },
    set lang(code) {
      chosenLang = code;
    },
    language: () => languages[Wonderloom.lang] ?? languages.en ?? { dir: 'ltr', speech: 'en-US' },

    /** Register visitor-facing words for a scope (usually a room id) in one language. */
    defineText(scope, lang, strings) {
      (texts[scope] ??= Object.create(null))[lang] = strings;
    },

    /** Words for a scope in the page language, falling back to English key by key (nested objects too). */
    text(scope) {
      const t = texts[scope];
      if (!t?.en) throw new Error(`No English text defined for "${scope}"`);
      const lang = Wonderloom.lang;
      return lang === 'en' || !t[lang] ? t.en : merge(t.en, t[lang]);
    },

    /** Every registered dictionary, for the translation tools: scope → language → strings. */
    dictionaries: () => texts,

    /**
     * Translate the fixed text in index.html. Elements carry data-t="key" (keys
     * ending in Html may contain markup) and data-t-attr="attribute:key; …".
     * English stays as written in the page; other languages come from the
     * 'page' scope of their language file.
     */
    applyPageText(root = document) {
      const language = Wonderloom.language();
      document.documentElement.lang = Wonderloom.lang;
      document.documentElement.dir = language.dir;
      const page = texts.page?.[Wonderloom.lang];
      if (!page || Wonderloom.lang === 'en') return;
      const find = (key) => key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), page);
      root.querySelectorAll('[data-t]').forEach((el) => {
        const value = find(el.dataset.t);
        if (typeof value !== 'string') return;
        if (el.dataset.t.endsWith('Html')) el.innerHTML = value;
        else el.textContent = value;
      });
      root.querySelectorAll('[data-t-attr]').forEach((el) => {
        for (const pair of el.dataset.tAttr.split(';')) {
          const [attribute, key] = pair.split(':').map((x) => x.trim());
          const value = find(key);
          if (attribute && typeof value === 'string') el.setAttribute(attribute, value);
        }
      });
    },

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
        const t = Wonderloom.text('app').narration;
        document.querySelectorAll('.narrate').forEach((b) => (b.textContent = t.listen));
      },
      speak(element, button) {
        if (!('speechSynthesis' in window)) {
          Wonderloom.toast(Wonderloom.text('app').narration.unavailable);
          return;
        }
        if (narrating) return Wonderloom.narration.stop();
        Wonderloom.silence();
        const utterance = new SpeechSynthesisUtterance(element.innerText);
        utterance.lang = Wonderloom.language().speech;
        utterance.rate = 0.96;
        utterance.volume = 0.65;
        utterance.onend = Wonderloom.narration.stop;
        utterance.onerror = Wonderloom.narration.stop;
        window.speechSynthesis.speak(utterance);
        narrating = true;
        button.textContent = Wonderloom.text('app').narration.stop;
      },
    },
  };

  globalThis.Wonderloom = Wonderloom;
})();
