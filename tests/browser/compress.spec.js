import { test, expect, openRoom } from './helpers.js';

const readout = (page, row) => page.locator('#compress-readout div').nth(row).locator('strong');
const percent = async (locator) => Number((await locator.textContent()).replace(/[^\d.]/g, ''));

test('compress room: the strongest 10% look almost the same, the weakest 90% are ruined', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'compress');
  await expect(page.locator('#scene-status')).toHaveText('Hard to tell apart · 10% of the numbers');
  expect(await percent(readout(page, 2))).toBeLessThan(3);

  await page.getByRole('button', { name: /Throw away the strongest 10%/ }).click();
  await expect(page.locator('#scene-status')).toHaveText('Ruined · 90% of the numbers');
  expect(await percent(readout(page, 2))).toBeGreaterThan(30);
  await expect(page.locator('#compress-mode')).toHaveValue('1');

  // The action button swaps back to the strongest numbers: 90% of them is practically perfect.
  await page.locator('#scene-action').click();
  await expect(page.locator('#scene-status')).toContainText('Hard to tell apart');
});

test('compress room: drawing on the picture makes it your own, by pointer and by keyboard', async ({ page }) => {
  await page.goto('/#room=compress&picture=1');
  await expect(page.locator('#scene-name')).toHaveText('Face');
  await page.locator('#scene-canvas').scrollIntoViewIfNeeded();
  const box = await page.locator('#scene-canvas').boundingBox();
  // The picture is the first of three squares: the left of a row, or the top left with the building blocks below.
  // Drag from a point inside it in both arrangements (a quarter across, a third down).
  const y = box.y + box.height * 0.3;
  await page.mouse.move(box.x + box.width * 0.26, y);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.4, y, { steps: 6 });
  await page.mouse.up();
  await expect(page.locator('#scene-name')).toHaveText('Your own picture');

  // A new picture clears the drawing; the keyboard can paint too.
  await page.getByRole('button', { name: 'Checks' }).click();
  await expect(page.locator('#scene-name')).toHaveText('Checks');
  await page.locator('#scene-canvas').focus();
  await page.keyboard.press('Enter'); // shows the cursor
  await page.keyboard.press('Enter'); // paints
  await expect(page.locator('#scene-name')).toHaveText('Your own picture');
});
