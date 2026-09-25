import { test, expect, openRoom } from './helpers.js';

test('pausing one room does not leave the next one frozen', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'waves');
  await page.locator('#scene-play').click();
  await expect(page.locator('#scene-play')).toHaveText('Play');
  await page.locator('#room-next').click();
  await expect(page.locator('#scene-play')).toHaveText('Pause');
});

test('keyboard canvases are interactive widgets described by the tip; still pictures are images', async ({ page }) => {
  await page.goto('/#room=ribbon');
  const canvas = page.locator('#scene-canvas');
  await expect(canvas).toHaveAttribute('role', 'application');
  await expect(canvas).toHaveAttribute('aria-describedby', 'scene-tip');
  await expect(canvas).toHaveAttribute('tabindex', '0');
  await page.goto('/#room=waves');
  await expect(canvas).toHaveAttribute('role', 'img');
  await expect(canvas).toHaveAttribute('tabindex', '-1');
});

test('slider readouts stay quiet; the slider carries its own spoken value', async ({ page }) => {
  await page.goto('/#room=traffic');
  await expect(page.locator('#v-demand')).toHaveAttribute('aria-live', 'off');
  await expect(page.locator('#c-demand')).toHaveAttribute('aria-valuetext', '4000');
});

test('the explanation button uses a chevron, not an external-link arrow', async ({ page }) => {
  await page.goto('/#room=loom');
  await expect(page.locator('#scene-why')).not.toContainText('↗');
  await expect(page.locator('#scene-why svg')).toHaveCount(1);
});
