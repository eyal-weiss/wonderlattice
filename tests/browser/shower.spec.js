import { test, expect, openRoom, setRange, tool, inkedPixels } from './helpers.js';

const verdicts = (page) => page.locator('#shower-readout .shower-verdict');
const now = (page) => page.locator('#shower-now');
/** The temperatures in the "right now" line, as numbers. */
const temps = async (page) => [...(await now(page).textContent()).matchAll(/(\d+)\s°C/g)].map((m) => Number(m[1]));

test('shower room: opens on two bathers, the eager one swinging and the patient one settled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // the first half-minute is shown at once
  await page.goto('/');
  await openRoom(page, 'shower');
  await expect(page.locator('#scene-name')).toHaveText('Two bathers, one pipe');
  await expect(page.locator('#scene-status')).toHaveText('30 seconds in');
  await expect(verdicts(page)).toHaveText(['Never settles', 'Wobbles, then settles']);
  await expect(page.locator('#shower-readout')).toContainText('0.9 × 2 s = 1.8');
  await expect(page.locator('#shower-readout')).toContainText('any impatience below 0.79 settles');
  // Thirty seconds in, the patient bather is at just right and the eager one is far from it.
  const [eager, patient] = await temps(page);
  expect(patient).toBe(38);
  expect(Math.abs(eager - 38)).toBeGreaterThan(10);
  await expect.poll(() => inkedPixels(page, '#scene-canvas')).toBeGreaterThan(500);
  // Only the pipe slider belongs to this view.
  await expect(page.locator('#c-pipe')).toBeVisible();
  await expect(page.locator('#c-impatience')).toBeHidden();
  await expect(page.locator('#shower-hand')).toBeHidden();
});

test('shower room: a short pipe lets the eager bather settle', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=shower');
  await page.getByRole('button', { name: /A short pipe/ }).click();
  await expect(page.locator('#v-pipe')).toHaveText('0.5 s');
  await expect(verdicts(page)).toHaveText(['Wobbles, then settles', 'Settles without overshooting']);
  await expect(page.locator('#shower-readout')).toContainText('below 3.14 settles');
  expect(await temps(page)).toEqual([38, 38]);
  // A long pipe: now even the patient bather is near the edge, and the eager one is far past it.
  await setRange(page, '#c-pipe', 5);
  await expect(page.locator('#shower-readout')).toContainText('0.3 × 5 s = 1.5');
  await expect(verdicts(page)).toHaveText(['Never settles', 'Wobbles, then settles']);
});

test('shower room: one bather, and the sharp line at π/2', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=shower');
  await page.getByRole('button', { name: 'One bather', exact: true }).click();
  await expect(page.locator('#scene-name')).toHaveText('One bather');
  await expect(page.locator('#c-impatience')).toBeVisible();
  await expect(page.locator('.shower-big strong')).toHaveText('1.8');
  await expect(page.locator('#shower-readout')).toContainText('Each swing is 1.45 times the last, one every 7.7 s');
  await setRange(page, '#c-impatience', 0.3);
  await expect(page.locator('.shower-big strong')).toHaveText('0.6');
  await expect(verdicts(page)).toHaveText('Wobbles, then settles');
  await page.getByRole('button', { name: /On the knife-edge/ }).click();
  await expect(page.locator('.shower-big strong')).toHaveText('1.57');
  await expect(page.locator('#shower-readout')).toContainText('the swing keeps its size, one every 8 s');
  await page.getByRole('button', { name: /No wobble at all/ }).click();
  await expect(verdicts(page)).toHaveText('Settles without overshooting');
  expect(await temps(page)).toEqual([38]);
});

test('shower room: your hand on the tap, which the water answers a pipe-length later', async ({ page }) => {
  await page.goto('/#room=shower&mode=2&pipe=1');
  await expect(page.locator('#scene-name')).toHaveText('Your hand on the tap');
  await expect(page.locator('#shower-hand')).toBeVisible();
  await expect(page.locator('#c-impatience')).toBeHidden();
  await expect(now(page)).toHaveText('Right now you feel 10 °C.');
  // Just right is 62% of the way to hot: (38 − 10) / (55 − 10).
  await setRange(page, '#shower-hand', 62);
  await expect(page.locator('#shower-hand')).toHaveAttribute('aria-valuetext', '62% of the way to hot');
  await expect(now(page)).toHaveText('Right now you feel 10 °C.');
  await expect(now(page)).toHaveText('Right now you feel 38 °C.', { timeout: 5000 });
  // The keyboard turns the tap too, and a drag across the picture.
  await page.locator('#scene-canvas').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#shower-hand')).toHaveValue('66');
  const box = await page.locator('#scene-canvas').boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 3);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 4, box.y + box.height / 3, { steps: 5 });
  await page.mouse.up();
  expect(Number(await page.locator('#shower-hand').inputValue())).toBeLessThan(40);
});

test('shower room: shared links, the keyboard and the pipe', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=shower&mode=1&pipe=4&impatience=0.5');
  await expect(page.locator('.shower-big strong')).toHaveText('2');
  await expect(verdicts(page)).toHaveText('Never settles');
  // Values outside the ranges are ignored, not trusted (a fresh page, so nothing is left from the last link).
  await page.goto('about:blank');
  await page.goto('/#room=shower&mode=7&pipe=99&impatience=-1');
  await expect(page.locator('#scene-name')).toHaveText('Two bathers, one pipe');
  await expect(page.locator('#v-pipe')).toHaveText('2 s');
  await page.locator('#scene-canvas').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#v-pipe')).toHaveText('2.1 s');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#v-pipe')).toHaveText('1.9 s');
});

test('shower room: time runs, pauses, and the sound is opt-in', async ({ page }) => {
  await page.goto('/#room=shower');
  const seconds = async () => Number((await page.locator('#scene-status').textContent()).match(/\d+/)[0]);
  await expect.poll(seconds).toBeGreaterThan(1);
  await page.locator('#scene-play').click(); // pause
  const paused = await seconds();
  await page.waitForTimeout(1200);
  expect(await seconds()).toBe(paused);
  await expect(page.locator('#scene-action')).toHaveText('Turn sound on');
  expect((await tool(page, 'read_exploration')).soundOn).toBe(false);
  await page.locator('#scene-action').click();
  await expect(page.locator('#scene-action')).toHaveText('Sound on · mute');
  expect((await tool(page, 'read_exploration')).soundOn).toBe(true);
  await expect(page.locator('#scene-play')).toHaveText('Pause'); // sound starts the water again
  await page.locator('#scene-play').click();
  await expect(page.locator('#scene-action')).toHaveText('Turn sound on'); // pausing silences it
  await page.locator('#scene-action').click();
  await openRoom(page, 'blocks');
  expect((await tool(page, 'read_exploration')).soundOn).toBe(false);
});

test('shower room: in Hebrew the tap slider still runs cold to hot, left to right, like the drawn tap', async ({
  page,
}) => {
  await page.goto('/?lang=he#room=shower&mode=2');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  const hand = page.locator('#shower-hand');
  await expect(hand).toBeVisible();
  expect(await hand.evaluate((el) => getComputedStyle(el).direction)).toBe('ltr');
  // Clicking near the right end turns the tap hot.
  await hand.scrollIntoViewIfNeeded();
  const box = await hand.boundingBox();
  await page.mouse.click(box.x + box.width * 0.95, box.y + box.height / 2);
  expect(Number(await hand.inputValue())).toBeGreaterThan(80);
});
