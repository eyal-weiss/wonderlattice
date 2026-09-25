import { readFileSync } from 'node:fs';
import { test, expect, ROOMS, openRoom } from './helpers.js';

const pseudoLocale = readFileSync(new URL('./pseudo-locale.js', import.meta.url), 'utf8');

// Serve index.html with the pseudo-language added, then open the page in it.
async function openPseudo(page, hash = '') {
  await page.route(/\/(index\.html)?(\?[^#]*)?$/, async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace(
      '<!-- /languages -->',
      () => `<script>${pseudoLocale}</script>\n    <!-- /languages -->`,
    );
    await route.fulfill({ response, body });
  });
  await page.goto('/?lang=xx' + hash);
}

/** Visible text (and aria-labels) with letters outside ⟦…⟧: words that never went through a dictionary. */
function untranslated(page) {
  return page.evaluate(() => {
    const bad = new Set();
    // Words that stay as they are in every language: the name, a license, and formula notation.
    const keep = new Set(['wonderlattice', 'CC BY 2.0']);
    const strip = (s) => {
      let out = s;
      while (/⟦[^⟦⟧]*⟧/.test(out)) out = out.replace(/⟦[^⟦⟧]*⟧/g, '');
      return out;
    };
    const loose = (s) => /[A-Za-z]{2,}/.test(strip(s)) && !keep.has(s.trim());
    const visible = (el) => el && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden';
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const el = node.parentElement;
      if (!el || ['SCRIPT', 'STYLE', 'TEXTAREA', 'CANVAS'].includes(el.tagName) || !visible(el)) continue;
      if (el.closest('.formula')) continue;
      if (loose(node.textContent)) bad.add(`${el.tagName.toLowerCase()}#${el.id}: ${node.textContent.trim()}`);
    }
    for (const el of document.querySelectorAll('[aria-label], [title], [placeholder]')) {
      if (!visible(el)) continue;
      for (const a of ['aria-label', 'title', 'placeholder']) {
        const v = el.getAttribute(a);
        if (v && loose(v)) bad.add(`${el.tagName.toLowerCase()}#${el.id} [${a}]: ${v}`);
      }
    }
    return [...bad];
  });
}

test('every visible word goes through a dictionary, in every room and dialog', async ({ page }) => {
  test.setTimeout(15000 * Object.keys(ROOMS).length);
  await openPseudo(page);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('html')).toHaveAttribute('lang', 'xx');
  await expect(page.locator('#language')).toBeVisible();
  const found = new Set(await untranslated(page));
  for (const room of Object.keys(ROOMS)) {
    await openRoom(page, room);
    (await untranslated(page)).forEach((s) => found.add(`${room} · ${s}`));
    await page.locator(room === 'motion' ? '#why-button' : '#scene-why').click();
    (await untranslated(page)).forEach((s) => found.add(`${room} (explanation) · ${s}`));
    await page.keyboard.press('Escape');
    await page.locator(room === 'motion' ? '#trail-keep-motion' : '#trail-keep-scene').click();
    await page.locator('#trail-save').click();
    (await untranslated(page)).forEach((s) => found.add(`${room} (trail) · ${s}`));
    await page.keyboard.press('Escape');
  }
  await page.locator('#room-home').click();
  await page.locator('#about-button').click();
  (await untranslated(page)).forEach((s) => found.add(`about · ${s}`));
  expect([...found]).toEqual([]);
});
