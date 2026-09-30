/*
 * Display settings: larger text and high contrast, for people who need them. This script runs in the page's head,
 * before anything is drawn, so a visitor who chose larger text never sees the page jump. It marks the page
 * (<html data-text-size="large" data-contrast="more">) and the stylesheets do the rest: every text size is in rem,
 * and base.css scales the root. The choices are kept in this browser only. High contrast follows the device's
 * "more contrast" setting until the visitor chooses for themselves. The menu is built by src/core/app.js.
 */
(() => {
  'use strict';

  const SIZES = ['normal', 'large', 'larger'];
  const SIZE_KEY = 'wonderlattice.textSize';
  const CONTRAST_KEY = 'wonderlattice.contrast';
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

  const highContrast = () => (chosenContrast ? chosenContrast === 'more' : device.matches);

  function apply() {
    if (textSize === 'normal') delete root.dataset.textSize;
    else root.dataset.textSize = textSize;
    if (highContrast()) root.dataset.contrast = 'more';
    else delete root.dataset.contrast;
    for (const listener of listeners) listener();
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
