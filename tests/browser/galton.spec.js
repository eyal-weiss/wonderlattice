import { test, expect } from './helpers.js';

const status = (page) => page.locator('#scene-status');
const landed = async (page) => Number((await status(page).textContent()).match(/^([\d,]+)/)[1].replace(/,/g, ''));

test('galton room: balls start pouring at once, a few at first, then hundreds', async ({ page }) => {
  await page.goto('/#room=galton');
  await expect(page.locator('#scene-name')).toHaveText('Balls on pegs');
  await expect(status(page)).toContainText('left or right at random at every peg');
  // Within about ten seconds, without a click, hundreds of balls have landed under the bell.
  await expect.poll(() => landed(page), { timeout: 20000 }).toBeGreaterThan(150);
  expect(await landed(page)).toBeLessThan(2000);
});

test('galton room: every pour of 2,000 balls ends in the same bell, and each is new', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // the pour lands at once
  await page.goto('/#room=galton');
  await expect(status(page)).toHaveText('2,000 balls · the same bell every time');
  const picture = () => page.locator('#scene-canvas').evaluate((canvas) => canvas.toDataURL());
  const first = await picture();
  await page.locator('#scene-action').click(); // Pour again: new balls
  await expect(status(page)).toHaveText('2,000 balls · the same bell every time');
  expect(await picture()).not.toEqual(first);
  // Tilted pegs: the slider says so, and the pour still finishes.
  await page.getByRole('button', { name: /Tilt the pegs/ }).click();
  await expect(page.locator('#v-tilt')).toHaveText('75%');
  await expect(status(page)).toHaveText('2,000 balls · the same bell every time');
});

test('galton room: a lopsided die, reshaped by dragging its bars', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=galton');
  await page
    .getByRole('button', { name: /A lopsided die/ })
    .first()
    .click();
  await expect(page.locator('#scene-name')).toHaveText('A lopsided die');
  await expect(status(page)).toHaveText('4,000 in each heap');
  await expect(page.locator('#scene-controls [data-shape="0"]')).toHaveAttribute('aria-pressed', 'true');
  // Drag face 1's bar down to about a third: the die changes, and so does the link to it.
  const canvas = page.locator('#scene-canvas');
  await canvas.evaluate((el) => el.scrollIntoView({ block: 'start' }));
  const box = await canvas.boundingBox();
  const pad = Math.max(10, Math.min(box.width, box.height) * 0.04);
  const small = Math.round(Math.min(13, Math.max(10, Math.min(box.width, box.height) / 30)));
  const cellW = (box.width - 3 * pad) / 2,
    cellH = (box.height - 3 * pad) / 2;
  const plotTop = pad + small * 1.9,
    plotH = pad + cellH - plotTop - small * 1.5;
  const x = box.x + pad + 2 + (cellW - 4) / 12; // the middle of face 1's slot
  await page.mouse.move(x, box.y + plotTop + plotH * 0.2);
  await page.mouse.down();
  await page.mouse.move(x, box.y + plotTop + plotH * 0.7, { steps: 5 });
  await page.mouse.up();
  await expect(page.locator('#scene-controls [data-shape="0"]')).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Copy this exploration' }).click();
  const link = await page.evaluate(() => window.__clipboard.at(-1));
  expect(link).toMatch(/[&#]one=3(&|$)/);
  expect(link).toMatch(/[&#]view=1(&|$)/);
});

test('galton room: the keyboard reshapes the die and tilts the pegs', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=galton');
  const canvas = page.locator('#scene-canvas');
  await canvas.focus();
  await page.keyboard.press('ArrowRight'); // tilt the pegs to the right
  await expect(page.locator('#v-tilt')).toHaveText('55%');
  await page.locator('#scene-controls [data-view="1"]').click();
  await canvas.focus();
  await page.keyboard.press('ArrowRight'); // picks face 1 first
  await page.keyboard.press('ArrowRight'); // then face 2
  await page.keyboard.press('ArrowUp');
  await expect(page.locator('#announcer')).toHaveText('Face 2: 2 of 10');
});

test('galton room: the stubborn spinner’s averages are as wild as one spin', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=galton');
  await page.locator('#scene-controls [data-view="2"]').click();
  await expect(page.locator('#scene-name')).toHaveText('A stubborn spinner');
  await expect(page.locator('#scene-action')).toHaveText('Spin again');
  await expect(status(page)).toHaveText('4,000 in each heap');
  await expect(page.locator('#c-n')).toHaveValue('10');
});

test('galton room: a shared link restores the die and its averages', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=galton&view=1&n=20&one=1&two=1&three=1&four=1&five=1&six=10');
  await expect(page.locator('#scene-name')).toHaveText('A lopsided die');
  await expect(page.locator('#v-n')).toHaveText('20');
  await expect(page.locator('#scene-controls [data-shape="2"]')).toHaveAttribute('aria-pressed', 'true');
});
