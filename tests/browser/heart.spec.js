import { test, expect, openRoom, inkedPixels } from './helpers.js';

/** A cheap fingerprint of the canvas, to tell whether the picture changed. */
const snapshot = (page) =>
  page.locator('#scene-canvas').evaluate((canvas) => {
    const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    let sum = 0;
    for (let i = 0; i < data.length; i += 28) sum = (sum * 31 + data[i]) % 1000000007;
    return sum;
  });

/** The canvas colour a little off its centre (dx, dy in CSS pixels), clear of the aiming crosshair. */
const colourNearCentre = (page, dx, dy) =>
  page.locator('#scene-canvas').evaluate(
    (canvas, [dx, dy]) => {
      const scale = canvas.width / canvas.getBoundingClientRect().width;
      const x = Math.round(canvas.width / 2 + dx * scale),
        y = Math.round(canvas.height / 2 + dy * scale);
      return [...canvas.getContext('2d').getImageData(x, y, 1, 1).data];
    },
    [dx, dy],
  );

test('a steady heartbeat reaches the far corner once a second', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'heart');
  await expect(page.locator('#room-title')).toHaveText('A heartbeat travels.');
  await expect.poll(() => inkedPixels(page, '#scene-canvas'), { timeout: 5000 }).toBeGreaterThan(500);
  await expect(page.locator('#heart-rate')).toHaveText(/^(5[5-9]|6[0-5]) a minute$/, { timeout: 15000 });
  await expect(page.locator('#scene-status')).toHaveText('Every beat reaches the far corner');
});

test('breaking a wave makes spirals that take over the rhythm', async ({ page }) => {
  await page.goto('/#room=heart');
  await page.locator('#scene-action').click();
  await expect(page.locator('#scene-status')).toContainText('spiral', { timeout: 10000 });
  // The spirals turn faster than the pacemaker, so more beats reach the far corner than it sends.
  await expect
    .poll(async () => Number((await page.locator('#heart-rate').textContent()).match(/\d+/)?.[0] ?? 0), {
      timeout: 15000,
    })
    .toBeGreaterThan(66);
  await page.locator('#scene-why').click();
  await expect(page.locator('#insight-dialog')).toContainText('It is not a simulation of a heart');
  await page.locator('#insight-close').click();
});

test('with slow recovery, some beats never arrive', async ({ page }) => {
  await page.goto('/#room=heart');
  await page.getByRole('button', { name: /Slow recovery/ }).click();
  await expect(page.locator('#scene-status')).toHaveText('Some beats never reach the far corner', { timeout: 15000 });
  await expect(page.locator('#heart-rate')).toHaveText(/^(2\d|3\d|4[0-5]) a minute$/);
});

test('keyboard: arrows aim, Enter starts a wave, Delete wipes', async ({ page }) => {
  await page.goto('/#room=heart');
  await page.locator('#scene-play').click(); // pause, so the picture only changes by the keys
  await expect(page.locator('#scene-play')).toHaveText('Play');
  await page.locator('#scene-canvas').focus();
  await page.keyboard.press('ArrowRight'); // shows the aim at the middle
  await page.keyboard.press('ArrowLeft');
  const before = await colourNearCentre(page, 12, 18);
  await page.keyboard.press('Enter');
  const fired = await colourNearCentre(page, 12, 18);
  expect(fired[0]).toBeGreaterThan(before[0] + 100); // the middle now glows warm
  await page.keyboard.press('Delete');
  const wiped = await colourNearCentre(page, 12, 18);
  expect(wiped[0]).toBeLessThan(80);
});

test('with reduced motion it opens on a still picture of spirals', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=heart');
  await expect(page.locator('#scene-play')).toHaveText('Play');
  await expect(page.locator('#scene-status')).toContainText('spiral');
  const still = await snapshot(page);
  await page.waitForTimeout(600);
  expect(await snapshot(page)).toBe(still);
});
