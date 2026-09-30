import { test, expect, ROOMS } from './helpers.js';

// Display settings (src/core/display.js): larger text and high contrast, kept in this browser.

const html = (page) => page.locator('html');
const rootSize = (page) => page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));
const sizeOption = (page, name) => page.locator('#display-dialog').getByLabel(name, { exact: true });

/** Chooses settings before the page loads, as a returning visitor would have them. */
const chosen = (page, settings) =>
  page.addInitScript((s) => {
    for (const [key, value] of Object.entries(s)) localStorage.setItem(`wonderlattice.${key}`, value);
  }, settings);

/**
 * Every piece of visible page text (not the pictures) whose contrast with what is behind it is below `min`, as
 * "ratio text". Backgrounds are found by walking up to the first solid one; translucent layers are blended.
 */
const lowContrast = (page, min) =>
  page.evaluate((min) => {
    const parse = (c) => {
      const srgb = c.match(/color\(srgb ([^)]+)\)/);
      if (srgb) {
        const [r, g, b, a = 1] = srgb[1].split(/[ /]+/).filter(Boolean).map(Number);
        return { r: r * 255, g: g * 255, b: b * 255, a };
      }
      const m = c.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const [r, g, b, a = 1] = m[1]
        .split(/[ ,/]+/)
        .filter(Boolean)
        .map(Number);
      return { r, g, b, a };
    };
    const over = (top, under) => ({
      r: top.r * top.a + under.r * (1 - top.a),
      g: top.g * top.a + under.g * (1 - top.a),
      b: top.b * top.a + under.b * (1 - top.a),
      a: 1,
    });
    const luminance = ({ r, g, b }) => {
      const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const behind = (el) => {
      const layers = [];
      for (let e = el; e; e = e.parentElement) {
        const c = parse(getComputedStyle(e).backgroundColor);
        if (c && c.a > 0) layers.push(c);
        if (c && c.a >= 1) break;
      }
      return layers.reverse().reduce((bg, c) => over(c, bg), parse(getComputedStyle(document.body).backgroundColor));
    };
    const found = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    for (let node; (node = walker.nextNode());) {
      const el = node.parentElement;
      if (!node.textContent.trim() || seen.has(el)) continue;
      seen.add(el);
      const style = getComputedStyle(el);
      if (!el.getClientRects().length || style.visibility !== 'visible') continue;
      // Decoration hidden from screen readers (a puppet's glyphs, a sparkle) is part of a picture, not words.
      if (el.closest('[hidden], .visually-hidden, dialog:not([open]), button:disabled, [aria-hidden="true"]')) continue;
      let opacity = 1;
      for (let e = el; e; e = e.parentElement) opacity *= Number(getComputedStyle(e).opacity);
      const bg = behind(el);
      const ink = parse(style.color);
      const fg = over({ ...ink, a: ink.a * opacity }, bg);
      const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
      const ratio = (hi + 0.05) / (lo + 0.05);
      if (ratio < min) found.push(`${ratio.toFixed(2)} ${node.textContent.trim().slice(0, 40)}`);
    }
    return found;
  }, min);

test('the Display dialog makes text larger and turns on high contrast, and both last across a reload', async ({
  page,
}) => {
  await page.goto('/');
  const normal = await rootSize(page);
  const tagline = page.locator('.room-card-tagline').first();
  const taglineSize = async () => parseFloat(await tagline.evaluate((e) => getComputedStyle(e).fontSize));
  const before = await taglineSize();
  await page.locator('#display-open').click();
  await expect(page.locator('#display-dialog')).toBeVisible();
  await expect(sizeOption(page, 'Normal')).toBeChecked();
  await expect(page.locator('#high-contrast')).not.toBeChecked();

  await sizeOption(page, 'Larger').check();
  await expect(html(page)).toHaveAttribute('data-text-size', 'larger');
  expect(await rootSize(page)).toBeCloseTo(normal * 1.5, 1);
  expect(await taglineSize()).toBeCloseTo(before * 1.5, 1);
  await sizeOption(page, 'Large').check();
  expect(await taglineSize()).toBeCloseTo(before * 1.25, 1);
  await page.locator('#high-contrast').check();
  await expect(html(page)).toHaveAttribute('data-contrast', 'more');

  await page.reload();
  await expect(html(page)).toHaveAttribute('data-text-size', 'large');
  await expect(html(page)).toHaveAttribute('data-contrast', 'more');
  await page.locator('#display-open').click();
  await expect(sizeOption(page, 'Large')).toBeChecked();
  await expect(page.locator('#high-contrast')).toBeChecked();

  // Back to how it was.
  await sizeOption(page, 'Normal').check();
  await page.locator('#high-contrast').uncheck();
  await page.locator('#display-dialog .close').click();
  await expect(page.locator('#display-dialog')).toBeHidden();
  expect(await html(page).getAttribute('data-text-size')).toBeNull();
  expect(await html(page).getAttribute('data-contrast')).toBeNull();
  expect(await taglineSize()).toBeCloseTo(before, 1);
});

test('every text size scales with the setting, except the wordmark and the drawn puppets', async ({ page }) => {
  for (const path of ['/', '/#room=treasure', '/#room=motion']) {
    await page.goto(path);
    const unscaled = await page.evaluate(async () => {
      const texts = [...document.querySelectorAll('body *')].filter(
        (e) => e.getClientRects().length && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()),
      );
      const size = (e) => parseFloat(getComputedStyle(e).fontSize);
      const before = new Map(texts.map((e) => [e, size(e)]));
      window.WonderlatticeDisplay.setTextSize('larger');
      return (
        texts
          // The wordmark and the visitors' drawn puppets keep their size.
          .filter((e) => e.isConnected && !e.closest('.brand, .math-guest-puppet'))
          .filter((e) => Math.abs(size(e) / before.get(e) - 1.5) > 0.02)
          .map((e) => `${e.tagName} ${e.className} ${e.textContent.trim().slice(0, 30)}`)
      );
    });
    expect(unscaled, path).toEqual([]);
    await page.evaluate(() => window.WonderlatticeDisplay.setTextSize('normal'));
  }
});

test('a device that asks for more contrast turns high contrast on, and the visitor’s own choice wins', async ({
  page,
}) => {
  await page.emulateMedia({ contrast: 'more' });
  await page.goto('/');
  await expect(html(page)).toHaveAttribute('data-contrast', 'more');
  await page.locator('#display-open').click();
  await expect(page.locator('#high-contrast')).toBeChecked();
  await page.locator('#high-contrast').uncheck();
  expect(await html(page).getAttribute('data-contrast')).toBeNull();
  await page.reload();
  expect(await html(page).getAttribute('data-contrast')).toBeNull();

  // With no choice made, it follows the device while the page is open.
  await page.evaluate(() => localStorage.removeItem('wonderlattice.contrast'));
  await page.emulateMedia({ contrast: 'no-preference' });
  await page.reload();
  expect(await html(page).getAttribute('data-contrast')).toBeNull();
  await page.emulateMedia({ contrast: 'more' });
  await expect(html(page)).toHaveAttribute('data-contrast', 'more');
});

test('with storage blocked, the settings still work for the visit', async ({ page }) => {
  await page.addInitScript(() => {
    const blocked = () => {
      throw new DOMException('blocked', 'SecurityError');
    };
    Object.defineProperty(window, 'localStorage', { get: blocked });
  });
  await page.goto('/#room=treasure');
  await page.locator('#display-open').click();
  await sizeOption(page, 'Larger').check();
  await page.locator('#high-contrast').check();
  await expect(html(page)).toHaveAttribute('data-text-size', 'larger');
  await expect(html(page)).toHaveAttribute('data-contrast', 'more');
});

test('in high contrast, body and secondary text reach 7:1, brighter than before', async ({ page }) => {
  const ratios = () =>
    page.evaluate(() => {
      const rgb = (c) =>
        c
          .match(/\d+(\.\d+)?/g)
          .slice(0, 3)
          .map(Number);
      const luminance = (c) =>
        rgb(c)
          .map((v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
          .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
      const ratio = (selector, under) => {
        const [a, b] = [luminance(getComputedStyle(document.querySelector(selector)).color), luminance(under)];
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      };
      const card = getComputedStyle(document.querySelector('.room-card')).backgroundColor;
      const page = getComputedStyle(document.body).backgroundColor;
      return { body: ratio('.intro p', page), muted: ratio('.room-card-tagline', card) };
    });
  await page.goto('/');
  const normal = await ratios();
  await page.evaluate(() => window.WonderlatticeDisplay.setHighContrast(true));
  const high = await ratios();
  expect(high.body).toBeGreaterThanOrEqual(7);
  expect(high.muted).toBeGreaterThanOrEqual(7);
  expect(high.body).toBeGreaterThan(normal.body);
  expect(high.muted).toBeGreaterThan(normal.muted);
});

// The largest text on a phone, in high contrast, in every room: nothing sticks out sideways, every control can be
// reached and pressed, and all the page's words (not the pictures) reach 7:1.
for (const room of ['home', ...Object.keys(ROOMS)]) {
  test(`${room}: largest text and high contrast on a phone`, async ({ page }) => {
    await chosen(page, { textSize: 'larger', contrast: 'more' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(room === 'home' ? '/' : `/#room=${room}`);
    await expect(page.locator('body')).toHaveAttribute('data-room', room);
    const { problems, checked } = await page.evaluate(() => {
      const found = [];
      let checked = 0;
      const name = (e) => `${e.tagName.toLowerCase()}#${e.id}.${e.className} "${e.textContent.trim().slice(0, 25)}"`;
      if (document.documentElement.scrollWidth > innerWidth)
        found.push(`page ${document.documentElement.scrollWidth}px wide`);
      for (const e of document.querySelectorAll('body *')) {
        if (!e.getClientRects().length || e.closest('[hidden], .visually-hidden, dialog:not([open])')) continue;
        const style = getComputedStyle(e);
        const words = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (words && style.display !== 'inline' && style.overflowX === 'visible' && e.scrollWidth > e.clientWidth + 2)
          found.push(`words stick out of ${name(e)}`);
      }
      const controls = document.querySelectorAll(
        ":is(.room-bar, main:not([hidden])) :is(button, input, select, textarea, a[href]):not(:disabled):not([type='file'])",
      );
      for (const control of controls) {
        if (!control.getClientRects().length || control.closest('[hidden], .visually-hidden')) continue;
        if (getComputedStyle(control).visibility !== 'visible') continue;
        checked++;
        control.scrollIntoView({ block: 'end', inline: 'nearest' });
        const r = control.getBoundingClientRect();
        if (r.left < -1 || r.right > innerWidth + 1) found.push(`off the screen: ${name(control)}`);
        const hit = document.elementFromPoint(r.left + r.width / 2, Math.min(r.top + r.height / 2, innerHeight - 2));
        const label = hit?.closest('label');
        if (!hit || !(control.contains(hit) || hit.contains(control) || label?.contains(control)))
          found.push(`covered: ${name(control)} by ${hit ? name(hit) : 'nothing'}`);
      }
      return { problems: found, checked };
    });
    expect(problems).toEqual([]);
    expect(checked, 'controls checked').toBeGreaterThan(5);
    expect(await lowContrast(page, 7)).toEqual([]);
  });
}
