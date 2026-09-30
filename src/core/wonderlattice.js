/*
 * Wonderlattice core: one shared namespace, small helpers, and the room registry.
 *
 * Every file in src/ is a classic script rather than an ES module, so that
 * index.html keeps working when it is opened straight from disk (browsers
 * block module imports from file:// pages). Scripts load in the order listed
 * in index.html and talk to each other only through `Wonderlattice`.
 */
(() => {
  'use strict';

  const rooms = [];
  const byId = Object.create(null);
  const waiting = new Set(); // rooms known so far only by their card (the published site loads each when needed)
  const loading = Object.create(null); // room id → the promise of that room, loaded
  const arrived = new Set(); // files already loaded, so a retry after a failure fetches only the rest
  const extras = Object.create(null); // path → the promise of a script loaded when first needed (loadScript)
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

  const Wonderlattice = {
    TAU: Math.PI * 2,
    $,
    clamp: (x, a, b) => Math.max(a, Math.min(b, x)),
    prefersReducedMotion: () => matchMedia('(prefers-reduced-motion: reduce)').matches,

    /** Pure mathematical models, one per room (src/rooms/<id>/model.js). No DOM access. */
    models: {},

    /** Registered rooms, in navigation order. */
    rooms,

    /** Groups on the home map, in display order. A room names one in its `theme` field. Names come from the text. */
    themes: ['shape', 'chance', 'games', 'making', 'engineering', 'life', 'signals'].map((id) => ({
      id,
      get name() {
        return Wonderlattice.text('app').themes[id].name;
      },
      get blurb() {
        return Wonderlattice.text('app').themes[id].blurb;
      },
    })),

    /**
     * Register a room. Rooms appear in the navigation in the order their scripts
     * load. See docs/ARCHITECTURE.md for the fields a room provides.
     */
    defineRoom(room) {
      if (!room || !/^[a-z]+$/.test(room.id)) throw new Error(`Room ids must be lowercase letters: ${room?.id}`);
      const card = byId[room.id];
      if (card && !waiting.has(card)) throw new Error(`Room "${room.id}" is defined twice`);
      if (!Wonderlattice.themes.some((t) => t.id === room.theme))
        throw new Error(`Room "${room.id}" needs a known theme`);
      // A room that arrives after its card takes the card's place, so the order stays the same.
      if (card) {
        rooms[rooms.indexOf(card)] = room;
        waiting.delete(card);
      } else rooms.push(room);
      byId[room.id] = room;
      return room;
    },

    room: (id) => byId[id],

    /**
     * The published site's list of rooms, in order, written by the build (scripts/build.mjs): each room's card for
     * the home map and the files that make the room. A room's code and words load only when it's first needed
     * (loadRoom), so the page stays small however many rooms there are. A card without files keeps the place of a
     * room whose scripts follow in the page. Opened from disk, every room loads with the page.
     */
    defineCards(cards) {
      for (const card of cards) {
        const words = () => Wonderlattice.text('cards')[card.id] ?? {};
        const room = {
          ...card,
          get eyebrow() {
            return words().eyebrow;
          },
          get name() {
            return words().name;
          },
          get tagline() {
            return words().tagline;
          },
        };
        rooms.push(room);
        byId[room.id] = room;
        waiting.add(room);
      }
    },

    /** False only for a room the published site hasn't loaded yet. */
    isLoaded: (id) => !!byId[id] && !waiting.has(byId[id]),

    /** True for a room the published site loads when it's needed, words and all. */
    loadsLater: (id) => !!byId[id]?.scripts && waiting.has(byId[id]),

    /**
     * A room, with its code and words: at once if it's here, otherwise loaded once. Its words in the page language
     * arrive before its code, which reads them as it starts; its stylesheet arrives before it's shown.
     */
    loadRoom(id) {
      const card = byId[id];
      if (!card) return Promise.reject(new Error(`No room "${id}"`));
      if (!waiting.has(card)) return Promise.resolve(card);
      if (!card.scripts) return Promise.reject(new Error(`The ${id} room hasn't loaded`));
      return (loading[id] ??= new Promise((resolve, reject) => {
        const lang = Wonderlattice.lang;
        const version = Wonderlattice.languageVersions?.[lang]?.[id];
        const words = Wonderlattice.languageFiles?.[lang]?.includes(id)
          ? [`./src/lang/${lang}/${id}.js${version ? `?v=${version}` : ''}`]
          : [];
        const scripts = [...card.scripts.slice(0, -1), ...words, card.scripts.at(-1)];
        const elements = [
          ...card.styles
            .filter((href) => !arrived.has(href))
            .map((href) => Object.assign(document.createElement('link'), { rel: 'stylesheet', href })),
          ...scripts
            .filter((src) => !arrived.has(src))
            .map((src) => Object.assign(document.createElement('script'), { src, async: false })),
        ];
        let left = elements.length;
        // A file that didn't arrive, or a room whose code arrived but didn't define it: a later try starts again.
        const fail = () => {
          delete loading[id];
          left = -1; // report once
          reject(new Error(`Could not load the ${id} room`));
        };
        if (!left) return fail();
        for (const element of elements) {
          const address = element.getAttribute(element.localName === 'link' ? 'href' : 'src');
          element.onerror = () => left >= 0 && fail();
          element.onload = () => {
            arrived.add(address);
            if (--left !== 0) return;
            if (waiting.has(byId[id])) fail();
            else resolve(byId[id]);
          };
          document.head.append(element);
        }
      }));
    },

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
        asked =
          new URLSearchParams(location.search).get('lang') ||
          localStorage.getItem('wonderlattice.lang') ||
          localStorage.getItem('wonderloom.lang'); // the site's earlier name
      } catch {
        /* no address or storage (e.g. Node tests) */
      }
      chosenLang = asked && languages[asked] ? asked : 'en';
      return chosenLang;
    },
    set lang(code) {
      chosenLang = code;
    },
    language: () => languages[Wonderlattice.lang] ?? languages.en ?? { dir: 'ltr', speech: 'en-US' },

    /**
     * Whether a key press is the letter shortcut `letter` on any keyboard: the letter typed, or, on a keyboard that
     * types another alphabet there (Hebrew, Arabic), the key where that letter sits on an English keyboard.
     */
    isLetter: (e, letter) =>
      e.key.toLowerCase() === letter || (!/^[a-z]$/i.test(e.key) && e.code === `Key${letter.toUpperCase()}`),

    /** Spaced-out capitals suit scripts that have capitals; Hebrew and Arabic have none (as in styles/base.css). */
    get spacedCapitals() {
      return !['he', 'ar'].includes(Wonderlattice.lang);
    },

    /** Italic for canvas text, except in scripts without italic letters, which a slant only distorts (Arabic). */
    get slant() {
      return Wonderlattice.lang === 'ar' ? 'normal' : 'italic';
    },

    /** The page language for writing numbers, always with the digits 0–9 (some browsers write Arabic with ٠–٩). */
    get numberLocale() {
      return `${Wonderlattice.lang}-u-nu-latn`;
    },

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
      const lang = Wonderlattice.lang;
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
      const language = Wonderlattice.language();
      document.documentElement.lang = Wonderlattice.lang;
      document.documentElement.dir = language.dir;
      const page = texts.page?.[Wonderlattice.lang];
      if (!page || Wonderlattice.lang === 'en') return;
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

    /**
     * A script the page loads only when it's first needed, such as the QR encoder. On the published site the build
     * gives it a fingerprint (Wonderlattice.fileVersions), so a browser never keeps an old copy.
     */
    loadScript(path) {
      return (extras[path] ??= new Promise((resolve, reject) => {
        const version = Wonderlattice.fileVersions?.[path];
        const script = Object.assign(document.createElement('script'), {
          src: `./${path}${version ? `?v=${version}` : ''}`,
        });
        script.onload = resolve;
        script.onerror = () => {
          delete extras[path];
          script.remove();
          reject(new Error(`Could not load ${path}`));
        };
        document.head.append(script);
      }));
    },

    /**
     * The big screen, for showing a room to a class: the picture fills the screen (full screen where the browser
     * allows it) and everything else steps aside (the class `focus-mode`, which the drawing room calls its focus
     * view). The stage and the rooms hear of every change through the `wonderlattice:bigscreen` event.
     */
    bigScreen: {
      get on() {
        return document.body.classList.contains('focus-mode');
      },
      set(on) {
        if (on === Wonderlattice.bigScreen.on) return;
        document.body.classList.toggle('focus-mode', on);
        try {
          if (on) document.documentElement.requestFullscreen?.()?.catch(() => {});
          else if (document.fullscreenElement) document.exitFullscreen?.()?.catch(() => {});
        } catch {
          /* no full screen here: the layout still fills the window */
        }
        document.dispatchEvent(new CustomEvent('wonderlattice:bigscreen', { detail: on }));
      },
    },

    /**
     * "Send to phones": a dialog with a QR code for `link`, written out underneath too, so a class can scan a room
     * with its settings. The code is made in the page (src/vendor/qrcodegen.js, MIT); nothing leaves the browser.
     */
    async showQR(link) {
      $('send-link').textContent = link;
      $('send-code').replaceChildren();
      $('send-dialog').showModal();
      try {
        await Wonderlattice.loadScript('src/vendor/qrcodegen.js');
      } catch {
        return Wonderlattice.toast(Wonderlattice.text('app').stage.loadFailed);
      }
      const { QrCode } = globalThis.qrcodegen;
      const qr = QrCode.encodeText(link, QrCode.Ecc.MEDIUM);
      const quiet = 4; // the blank margin a camera needs around the code, in modules
      const n = qr.size + 2 * quiet;
      let dark = '';
      for (let y = 0; y < qr.size; y++)
        for (let x = 0; x < qr.size; x++) if (qr.getModule(x, y)) dark += `M${x + quiet},${y + quiet}h1v1h-1z`;
      // Only numbers and the site's own words go into this markup.
      $('send-code').innerHTML =
        `<svg viewBox="0 0 ${n} ${n}" role="img" aria-label="${Wonderlattice.text('app').stage.sendCode}" ` +
        `shape-rendering="crispEdges"><rect width="${n}" height="${n}" fill="#fff"/><path d="${dark}" fill="#000"/></svg>`;
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

    /** A link to these settings. On the published site each room has a share page with its own link preview. */
    shareLink: (params) =>
      params.get('room') && document.querySelector('meta[name="wonderlattice-room-pages"]')
        ? `${location.origin}/room/${params.get('room')}/#${params}`
        : location.origin + location.pathname + '#' + params.toString(),

    /** Copy text, falling back to a dialog with the text selected for manual copying. */
    async copyText(text, { copied, description }) {
      try {
        await navigator.clipboard.writeText(text);
        Wonderlattice.toast(copied);
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
        if (!blob) return Wonderlattice.toast(failed);
        Wonderlattice.download(blob, filename);
        Wonderlattice.toast(saved);
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
        const t = Wonderlattice.text('app').narration;
        document.querySelectorAll('.narrate').forEach((b) => (b.textContent = t.listen));
      },

      /** The sentences to say for an element, in order. */
      script(element) {
        const words = Wonderlattice.text('app').narration.symbols;
        const blocks = [
          ...element.querySelectorAll('h2, h3, p, li, summary, .insight-visual, .idea-card:not(.formula)'),
        ]
          .filter((el) => !el.closest('button, a, .formula, .sources, .feedback, [aria-hidden="true"]'))
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
        const wanted = Wonderlattice.language().speech.toLowerCase();
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
        const t = Wonderlattice.text('app').narration;
        if (!synth || !window.SpeechSynthesisUtterance) return Wonderlattice.toast(t.unavailable);
        if (narrating) return Wonderlattice.narration.stop();
        Wonderlattice.silence();
        const sentences = Wonderlattice.narration.script(element);
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
        const voices = await Wonderlattice.narration.voices();
        const voice = Wonderlattice.narration.voice(voices);
        if (run !== narrationRun) return; // stopped while we waited
        // The device lists voices but none for this language: reading anyway would be
        // silent, or another language's voice mangling the text. Say so instead. (With no
        // list at all, some browsers still speak, so they get their chance.)
        if (!voice && voices.length) {
          Wonderlattice.narration.stop();
          return Wonderlattice.toast(t.noVoice);
        }
        const lang = voice?.lang || Wonderlattice.language().speech;
        let spoken = 0,
          failed = false;
        const finish = () => run === narrationRun && Wonderlattice.narration.stop();
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
            Wonderlattice.narration.stop();
            Wonderlattice.toast(t.unavailable);
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

  globalThis.Wonderlattice = Wonderlattice;

  // Ask for the voices early: Firefox, for one, starts loading them only when first asked.
  try {
    globalThis.speechSynthesis?.getVoices();
  } catch {
    /* no speech synthesis */
  }
})();
