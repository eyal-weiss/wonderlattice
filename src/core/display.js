/*
 * Display settings: larger text and high contrast, for people who need them, and day or night colours. This script
 * runs in the page's head, before anything is drawn, so a visitor who chose larger text or night colours never sees
 * the page jump. It marks the page (<html data-text-size="large" data-contrast="more" data-theme="night">) and the
 * stylesheets do the rest: every text size is in rem, base.css scales the root and holds both palettes. The choices
 * are kept in this browser only. High contrast follows the device's "more contrast" setting until the visitor
 * chooses for themselves; colours are always day until the visitor picks night. The menu and the sun and moon button
 * are built by src/core/app.js.
 */
(() => {
  'use strict';

  const SIZES = ['normal', 'large', 'larger'];
  const SIZE_KEY = 'wonderlattice.textSize';
  const CONTRAST_KEY = 'wonderlattice.contrast';
  const THEME_KEY = 'wonderlattice.theme';
  const THEME_COLOUR = { day: '#f4f5f0', night: '#0c1230' }; // the browser's bar on phones
  const root = document.documentElement;
  const device = matchMedia('(prefers-contrast: more)');
  const listeners = [];

  const read = (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null; // storage is blocked: the settings last for this visit
    }
  };
  const keep = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* storage is blocked: the settings last for this visit */
    }
  };

  const savedSize = read(SIZE_KEY);
  const savedContrast = read(CONTRAST_KEY);
  let textSize = SIZES.includes(savedSize) ? savedSize : 'normal';
  let chosenContrast = ['more', 'normal'].includes(savedContrast) ? savedContrast : null; // null: follow the device
  let theme = read(THEME_KEY) === 'night' ? 'night' : 'day';

  const highContrast = () => (chosenContrast ? chosenContrast === 'more' : device.matches);

  function apply() {
    if (textSize === 'normal') delete root.dataset.textSize;
    else root.dataset.textSize = textSize;
    if (highContrast()) root.dataset.contrast = 'more';
    else delete root.dataset.contrast;
    if (theme === 'night') root.dataset.theme = 'night';
    else delete root.dataset.theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOUR[theme]);
    for (const listener of listeners) listener();
  }

  // The site's typefaces (styles/fonts.css). Browsers won't load a font file into a page opened from disk, so there
  // the page uses the device's own fonts; the standalone file carries its fonts inside it and says so. Served from
  // a web address, the day typeface is asked for at once, before the stylesheet finds it needs it.
  if (location.protocol === 'file:' && !window.wonderlatticeFontsInside) root.dataset.fonts = 'device';
  else if (location.protocol !== 'file:') {
    const preload = document.createElement('link');
    Object.assign(preload, { rel: 'preload', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });
    preload.href = './fonts/rubik-latin.woff2';
    document.head.append(preload);
  }

  device.addEventListener('change', apply);
  apply();

  window.WonderlatticeDisplay = {
    sizes: SIZES,
    get textSize() {
      return textSize;
    },
    get highContrast() {
      return highContrast();
    },
    /** 'day' or 'night'. */
    get theme() {
      return theme;
    },
    setTheme(next) {
      if (next !== 'day' && next !== 'night') return;
      theme = next;
      keep(THEME_KEY, next);
      apply();
    },
    setTextSize(size) {
      if (!SIZES.includes(size)) return;
      textSize = size;
      keep(SIZE_KEY, size);
      apply();
    },
    /** The visitor's own choice, which wins over the device's setting from now on. */
    setHighContrast(on) {
      chosenContrast = on ? 'more' : 'normal';
      keep(CONTRAST_KEY, chosenContrast);
      apply();
    },
    onChange(listener) {
      listeners.push(listener);
    },
  };
})();
