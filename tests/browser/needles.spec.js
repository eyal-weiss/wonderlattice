import { test, expect } from './helpers.js';

const status = (page) => page.locator('#scene-status');
const readout = (page) => page.locator('#needles-readout');
/** The number after "π ≈" in the readout. */
const guess = async (page) => Number((await readout(page).locator('.needles-big').textContent()).match(/[\d.]+/)[0]);
/** The readout's rows, as numbers by name. */
const rows = async (page) => {
  const cells = await readout(page).locator('.needles-rows > *').allTextContents();
  const out = {};
  for (let i = 0; i < cells.length; i += 2) out[cells[i]] = Number(cells[i + 1].replace(/,/g, ''));
  return out;
};

test('needles room: opens with needles already raining, and the count climbs by itself', async ({ page }) => {
  await page.goto('/#room=needles');
  await expect(page.locator('#scene-name')).toHaveText('Straight needles');
  await expect(status(page)).toContainText('needles so far');
  const canvas = page.locator('#scene-canvas');
  const first = await canvas.screenshot();
  await page.waitForTimeout(1200);
  expect(first.equals(await canvas.screenshot())).toBe(false);
  // Within ten seconds the rain has sped up to thousands, and the guess is near π.
  await expect
    .poll(async () => (await rows(page))['Needles thrown'], { timeout: 15000, intervals: [500] })
    .toBeGreaterThan(1000);
  await expect(readout(page)).toContainText('π ≈');
});

test('needles room: a million needles give π to about two decimals', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // the whole run lands at once
  await page.goto('/#room=needles');
  await expect(status(page)).toContainText('1,000,000 needles: π ≈');
  const r = await rows(page);
  expect(r['Needles thrown']).toBe(1000000);
  // About 2/π of them cross a line: within six standard deviations (6 × 481).
  expect(Math.abs(r['Landed across a line'] - 636620)).toBeLessThan(2900);
  expect(Math.abs((await guess(page)) - Math.PI)).toBeLessThan(0.015);
  await expect(readout(page)).toContainText('π ≈ 2 × length × needles ÷ crossings');
});

test('needles room: bent needles of the same length cross as often, and a ring crosses exactly twice', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=needles');
  await page.getByRole('button', { name: /Bend them/ }).click();
  await expect(page.locator('#scene-name')).toHaveText('Noodles');
  await expect(page.locator('[data-shape="2"]')).toHaveAttribute('aria-pressed', 'true');
  expect(Math.abs((await guess(page)) - Math.PI)).toBeLessThan(0.02);
  await expect(readout(page)).toContainText('Bent or straight');

  await page.locator('[data-shape="1"]').click();
  await expect(page.locator('#scene-name')).toHaveText('Zigzags');
  expect(Math.abs((await guess(page)) - Math.PI)).toBeLessThan(0.02);

  await page.locator('[data-shape="3"]').click();
  await expect(page.locator('#scene-name')).toHaveText('Rings one plank wide');
  await expect(readout(page)).toContainText('Every ring crosses exactly 2 lines');
  const r = await rows(page);
  expect(r['Landed across a line']).toBe(2 * r['Rings thrown']);
  await expect(page.locator('#c-length')).toHaveCount(0); // a ring is always one plank wide
  await expect(page.locator('#announcer')).toHaveText('Every ring crosses exactly two lines.');
});

test('needles room: Lazzarini’s 3,408 needles, rerun, usually miss π by a few hundredths', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=needles');
  await page.getByRole('button', { name: /A lucky scientist/ }).click();
  await expect(page.locator('#scene-name')).toHaveText('Lazzarini’s needles');
  await expect(page.locator('[data-check="lucky"]')).toBeChecked();
  await expect(page.locator('[data-shape]')).toHaveCount(0);
  const miss = Number((await readout(page).locator('.needles-big').textContent()).match(/[\d.]+/)[0]);
  expect(miss).toBeGreaterThan(0.02);
  expect(miss).toBeLessThan(0.05);
  const r = await rows(page);
  expect(r.Reruns).toBe(400);
  // 355/113 exactly comes up about once in 70 reruns: here, from 400, far fewer than a tenth.
  expect(r['Exactly 355/113, like Lazzarini']).toBeLessThan(25);
  await expect(readout(page)).toContainText('0.0000003');
  await expect(status(page)).toHaveText('400 reruns of 3,408 needles');
  // Unticked, the needles are the visitor's own again.
  await page.locator('[data-check="lucky"]').uncheck();
  await expect(page.locator('[data-shape="0"]')).toHaveAttribute('aria-pressed', 'true');
});

test('needles room: a shared link restores the shape and length, and Throw again starts afresh', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=needles&shape=1&length=50');
  await expect(page.locator('[data-shape="1"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#v-length')).toHaveText('50%');
  // Half-length needles cross half as often: still about 1/π of them.
  const r = await rows(page);
  expect(Math.abs(r['Landed across a line'] / r['Needles thrown'] - 1 / Math.PI)).toBeLessThan(0.003);
  const before = r['Landed across a line'];
  await page.locator('#scene-action').click();
  const after = (await rows(page))['Landed across a line'];
  expect(after).not.toBe(before);
});

test('needles room: the picture and the status line above it show the same count', async ({ page }) => {
  await page.addInitScript(() => {
    const fill = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (text, ...rest) {
      if (/ needles · /.test(text)) window.__tally = String(text);
      return fill.call(this, text, ...rest);
    };
  });
  await page.goto('/#room=needles');
  for (const wait of [4500, 2500, 1500]) {
    await page.waitForTimeout(wait); // the rain speeds up: thousands of needles a second by now
    const [tally, words] = await page.evaluate(() => [
      window.__tally,
      document.getElementById('scene-status').textContent,
    ]);
    expect(tally.match(/^[\d,]+/)[0]).toBe(words.match(/^[\d,]+/)[0]);
  }
});
