import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { test, expect } from './helpers.js';

/** Opens a page and lists the language files it fetched (src/lang/<code>/<scope>.js). */
async function languageFiles(page, url) {
  const fetched = [];
  page.on('request', (r) => {
    const m = r.url().match(/src\/lang\/([a-z-]+)\/([\w-]+)\.js/);
    if (m) fetched.push(`${m[1]}/${m[2]}`);
  });
  await page.goto(url);
  await page.waitForLoadState('load');
  await expect(page.locator('body')).toHaveAttribute('data-room', /.+/);
  return fetched;
}

test('an English visit downloads no language files', async ({ page }) => {
  expect(await languageFiles(page, '/')).toEqual([]);
});

test('a Hebrew visit downloads only Hebrew, and shows it', async ({ page }) => {
  const files = await languageFiles(page, '/?lang=he#room=dice');
  expect(files.every((f) => f.startsWith('he/'))).toBe(true);
  // Opened from disk, every room's words come with the page. The published site brings only the words it needs:
  // the shared ones, the cards, and the rooms that are open (the drawing room is always in the page).
  const rooms = files.filter((f) => !/^he\/(app|page|language|cards)$/.test(f)).map((f) => f.slice(3));
  if (process.env.SERVE_DIR === 'dist') expect(rooms.sort()).toEqual(['dice', 'motion']);
  else expect(rooms.length).toBeGreaterThan(10);
  await expect(page.locator('html')).toHaveAttribute('lang', 'he');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('#room-title')).toHaveText('הקוביות שמנצחות זו את זו.');
  // Every language is still offered in the menu, though only one was loaded.
  await expect(page.locator('#language option')).toHaveCount(5);
});

test('a language works when the page is opened from disk', async ({ page }) => {
  const file = pathToFileURL(resolve(process.env.SERVE_DIR || '.', 'index.html')).href;
  await page.goto(file + '?lang=fr#room=dice');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.locator('#room-title')).not.toHaveText('The dice that beat each other.');
});

test('the standalone file carries every language', async ({ page }) => {
  const standalone = resolve('dist/wonderlattice-standalone.html');
  test.skip(!existsSync(standalone), 'Run npm run build first');
  for (const lang of ['es', 'he']) {
    await page.goto(pathToFileURL(standalone).href + `?lang=${lang}#room=dice`);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('#room-title')).not.toHaveText('The dice that beat each other.');
  }
});

test('sliders write numbers the way the page language does', async ({ page }) => {
  await page.goto('/?lang=fr#room=shower&mode=1&impatience=0.9');
  await expect(page.locator('#v-impatience')).toHaveText('0,9');
  await expect(page.locator('#c-impatience')).toHaveAttribute('aria-valuetext', '0,9');
  await page.goto('/?lang=fr#room=pools&floor=1&prev=2.5');
  await expect(page.locator('#v-prev')).toHaveText('2,5 %');
  await page.goto('/?lang=es#room=pools&floor=1&prev=2.5');
  await expect(page.locator('#v-prev')).toHaveText('2,5%');
  await page.goto('/#room=pools&floor=1&prev=2.5');
  await expect(page.locator('#v-prev')).toHaveText('2.5%');
});
