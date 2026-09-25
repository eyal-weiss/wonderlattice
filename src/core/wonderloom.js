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
  let narrationRun = 0; // increases on every start and stop, so stale sentence callbacks do nothing

  const $ = (id) => document.getElementById(id);

  /**
   * Deep merge for dictionaries: a translation may leave out any key, at any depth. A
   * translated value is used only where it has the same shape as the English one, and
   * translated text is made safe for wherever the English text goes (see safeText).
   */
  function merge(base, over) {
    if (over === undefined || over === null) return base;
    if (Array.isArray(base)) return Array.isArray(over) ? base.map((b, i) => merge(b, over[i])) : base;
    if (typeof base === 'function') {
      if (typeof over !== 'function') return base;
      return (...values) => {
        const english = base(...values);
        let out;
        try {
          out = over(...values);
        } catch {
          return english;
        }
        if (typeof out !== typeof english) return english;
        return typeof out === 'string' ? safeText(english, out) : out;
      };
    }
    if (base && typeof base === 'object') {
      if (typeof over !== 'object' || Array.isArray(over)) return base;
      const out = { ...base };
      for (const key of Object.keys(base)) out[key] = merge(base[key], over[key]);
      return out;
    }
    if (typeof over !== typeof base) return base;
    return typeof over === 'string' ? safeText(base, over) : over;
  }

  /**
   * Rooms put words both into elements and into attributes (aria-label="…"). Where the
   * English has markup, a translation may have markup too, cleaned by safeMarkup. Anywhere
   * else it is plain text: no tag can open (“<b” becomes “‹b”) and no straight double quote
   * can close an attribute (" becomes ”).
   */
  function safeText(english, text) {
    if (/<[a-z]/i.test(english)) return safeMarkup(text);
    return text.replace(/<(?=[a-z!/?])/gi, '‹').replace(/"/g, '”');
  }

  /*
   * Translations come from contributors, and some strings are shown as HTML. Markup in a
   * translated string keeps only the tags and attributes the English text uses (links only
   * to web or mail addresses); anything else becomes plain text or is dropped.
   */
  const TAGS = new Set(
    'p h3 h4 div span a em strong b i br sup sub small code ul ol li details summary canvas'.split(' '),
  );
  const DROP = new Set('script style template iframe object embed link meta svg math form input button'.split(' '));
  const ATTRIBUTES = new Set('class id href target rel title lang dir aria-hidden'.split(' '));
  function safeMarkup(text) {
    if (typeof document === 'undefined' || !/<[a-z!/]/i.test(text)) return text;
    const holder = document.createElement('template');
    holder.innerHTML = text;
    const clean = (node) => {
      for (const el of [...node.children]) {
        const tag = el.localName;
        if (DROP.has(tag)) {
          el.remove();
          continue;
        }
        if (!TAGS.has(tag)) {
          el.replaceWith(document.createTextNode(el.textContent));
          continue;
        }
        for (const { name, value } of [...el.attributes]) {
          const unsafeLink = name === 'href' && !/^(https?:|mailto:|#)/i.test(value.trim());
          if (!ATTRIBUTES.has(name) || unsafeLink) el.removeAttribute(name);
        }
        if (tag === 'a' && el.getAttribute('target')) el.setAttribute('rel', 'noopener');
        clean(el);
      }
    };
    clean(holder.content);
    const comments = document.createTreeWalker(holder.content, NodeFilter.SHOW_COMMENT);
    const drop = [];
    while (comments.nextNode()) drop.push(comments.currentNode);
    drop.forEach((c) => c.remove());
    return holder.innerHTML;
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
      if (languages[code]) throw new Error(`Language ${code} is already defined`);
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
      // English is the trusted source; a language file can't replace it (or another language).
      if (texts[scope]?.[lang]) throw new Error(`Text for ${scope} in ${lang} is already defined`);
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

    /** Markup from a translation, reduced to the allowed tags and attributes (see safeMarkup). */
    safeMarkup,

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
        if (el.dataset.t.endsWith('Html')) el.innerHTML = safeMarkup(value);
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

    /**
     * Tell screen-reader users about a result, politely and once: one shared live
     * region, so rooms don't have to make their panels chatty. Call it when a
     * result settles (a batch finishes, a pattern is found), not on every frame.
     */
    announce(message) {
      const region = $('announcer');
      if (!region || !message) return;
      region.textContent = '';
      setTimeout(() => (region.textContent = message), 60); // a change, even for a repeated message
    },

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
        $('copy-text').focus();
        $('copy-text').select();
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

    /**
     * Optional spoken narration through the browser's speech synthesis. It reads
     * only the prose of a dialog (headings, paragraphs, highlighted ideas; not
     * buttons, links, or formulas), says symbols as words, and speaks one short
     * sentence at a time: browsers cut off long utterances, some after ~15 seconds.
     */
    narration: {
      stop() {
        narrationRun++; // any queued sentences from the last run are dropped
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        narrating = false;
        const t = Wonderloom.text('app').narration;
        document.querySelectorAll('.narrate').forEach((b) => (b.textContent = t.listen));
      },

      /** The sentences to say for an element, in order. */
      script(element) {
        const words = Wonderloom.text('app').narration.symbols;
        const blocks = [
          ...element.querySelectorAll('h2, h3, p, li, summary, .insight-visual, .idea-card:not(.formula)'),
        ]
          .filter((el) => !el.closest('button, a, .formula, .sources, [aria-hidden="true"]'))
          .filter((el) => !el.querySelector('p, li, h2, h3')) // take the innermost block only
          .filter((el) => el.getClientRects().length); // what the reader can see (closed details stay closed)
        const say = (text) => {
          let out = ` ${text} `;
          for (const [symbol, word] of Object.entries(words)) out = out.split(symbol).join(word);
          return out
            .replace(/\s+/g, ' ')
            .replace(/\s+([,.;:!?])/g, '$1')
            .trim();
        };
        const sentences = [];
        for (const block of blocks) {
          const text = say(block.innerText);
          if (!text) continue;
          // Split into sentences, then keep each piece comfortably short.
          for (const sentence of text.match(/[^.!?…]+[.!?…]*[”"’)]*\s*/g) ?? [text]) {
            let rest = sentence.trim();
            while (rest.length > 220) {
              const cut = Math.max(
                rest.lastIndexOf(', ', 220),
                rest.lastIndexOf('; ', 220),
                rest.lastIndexOf(' ', 220),
              );
              sentences.push(rest.slice(0, cut + 1).trim());
              rest = rest.slice(cut + 1).trim();
            }
            if (rest) sentences.push(rest);
          }
        }
        return sentences;
      },

      /**
       * A voice for the page language. The browser's own default isn't enough:
       * Firefox on Linux, for one, lists ~100 speech-dispatcher voices with none
       * marked default and would otherwise read English in, say, a Catalan voice.
       * Prefers voices on this device (online voices send the text to a speech
       * service), then the exact locale, the language (Linux voices are often just
       * "en"), and a name that mentions the region.
       */
      voice(voices = window.speechSynthesis.getVoices()) {
        const wanted = Wonderloom.language().speech.toLowerCase();
        const [base, region] = wanted.split('-');
        const regionNames = { us: /america|united states|\bus\b/i, gb: /great britain|united kingdom|\buk\b/i };
        const score = (v) => {
          const lang = (v.lang || '').toLowerCase().replace('_', '-');
          const language = lang === wanted ? 8 : lang.split('-')[0] === base ? 4 : 0;
          if (!language) return 0;
          return (
            language +
            (region && regionNames[region]?.test(v.name) ? 2 : 0) +
            (v.localService ? 7 : 0) +
            (v.default ? 0.5 : 0)
          );
        };
        let best = null;
        for (const v of voices) if (score(v) > (best ? score(best) : 0)) best = v;
        return best;
      },

      /** Voices, waiting briefly for them: some browsers load them only after the first request. */
      voices() {
        const synth = window.speechSynthesis;
        const now = synth.getVoices();
        if (now.length) return Promise.resolve(now);
        return new Promise((resolve) => {
          const done = () => resolve(synth.getVoices());
          synth.addEventListener('voiceschanged', done, { once: true });
          setTimeout(done, 1500);
        });
      },

      async speak(element, button) {
        const synth = window.speechSynthesis;
        const t = Wonderloom.text('app').narration;
        if (!synth || !window.SpeechSynthesisUtterance) return Wonderloom.toast(t.unavailable);
        if (narrating) return Wonderloom.narration.stop();
        Wonderloom.silence();
        const sentences = Wonderloom.narration.script(element);
        if (!sentences.length) return;
        const run = ++narrationRun;
        narrating = true;
        button.textContent = t.stop;
        // Only clear the queue when something is in it, then give the engine a
        // moment: some engines drop an utterance spoken right after cancel().
        if (synth.speaking || synth.pending) {
          synth.cancel();
          await new Promise((r) => setTimeout(r, 80));
        }
        const voice = Wonderloom.narration.voice(await Wonderloom.narration.voices());
        if (run !== narrationRun) return; // stopped while we waited
        const lang = voice?.lang || Wonderloom.language().speech;
        let spoken = 0,
          failed = false;
        const finish = () => run === narrationRun && Wonderloom.narration.stop();
        // Hand every sentence to the browser's own queue. Short utterances avoid
        // engines that cut long ones off; keeping them referenced (in `queue`)
        // stops some browsers from dropping them before their end event.
        const queue = sentences.map((text, i) => {
          const u = new SpeechSynthesisUtterance(text);
          u.lang = lang;
          try {
            if (voice) u.voice = voice;
          } catch {
            /* not a usable voice here; the language tag still guides the browser */
          }
          u.rate = 0.95;
          u.onstart = () => (spoken = Math.max(spoken, 1));
          u.onend = () => i === sentences.length - 1 && finish();
          u.onerror = (e) => {
            if (e.error === 'interrupted' || e.error === 'canceled' || failed || run !== narrationRun) return;
            failed = true;
            Wonderloom.narration.stop();
            Wonderloom.toast(t.unavailable);
          };
          return u;
        });
        queue.forEach((u) => synth.speak(u));
        // A safety net for engines that skip end events: once speech has started
        // and the queue is empty, the narration is over.
        const watch = setInterval(() => {
          if (run !== narrationRun) return clearInterval(watch);
          if (spoken && !synth.speaking && !synth.pending) {
            clearInterval(watch);
            finish();
          }
        }, 700);
      },
    },
  };

  globalThis.Wonderloom = Wonderloom;

  // Ask for the voices early: Firefox, for one, starts loading them only when first asked.
  try {
    globalThis.speechSynthesis?.getVoices();
  } catch {
    /* no speech synthesis */
  }
})();
