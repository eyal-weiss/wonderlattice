import { test, expect } from './helpers.js';

// Day and night (docs/ARCHITECTURE.md, "Day and night"): day for everyone at first, a remembered switch, and the
// typefaces served with the site, the night ones fetched only once the page has loaded.

test('every visitor starts by day; the sun and moon button switches to night, and the choice is remembered', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' }); // the device's own dark mode doesn't decide it
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', /./);
  const button = page.locator('#theme-toggle');
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  await expect(button).toHaveAccessibleName('Night colours');
  await button.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'night');
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'night');
  await page.locator('#theme-toggle').click();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', /./);
});

test('the day typeface comes with the page; the night ones follow quietly once it has loaded', async ({ page }) => {
  const fonts = [];
  page.on('request', (r) => r.resourceType() === 'font' && fonts.push(r.url().split('/').pop().split('?')[0]));
  await page.goto('/');
  await expect.poll(() => fonts).toContain('rubik-latin.woff2');
  await expect.poll(() => fonts, { timeout: 10000 }).toContain('im-fell-english-latin.woff2');
  const { fell, loaded } = await page.evaluate(() => ({
    fell: performance.getEntriesByType('resource').find((e) => e.name.includes('im-fell-english-latin')).startTime,
    loaded: performance.getEntriesByType('navigation')[0].loadEventEnd,
  }));
  expect(fell).toBeGreaterThanOrEqual(loaded);
  // An English page doesn't download the letters of other scripts (the language menu shows them in the device's font).
  expect(fonts.filter((f) => /hebrew|arabic/.test(f))).toEqual([]);
  // At night, headings are in the engraved typeface.
  await page.locator('#theme-toggle').click();
  expect(await page.evaluate(() => getComputedStyle(document.querySelector('#home-title')).fontFamily)).toMatch(
    /IM Fell English/,
  );
});
