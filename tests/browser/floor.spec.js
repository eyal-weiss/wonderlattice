import { test, expect, openRoom, tool } from './helpers.js';

const verdict = (page) => page.locator('#floor-readout .floor-verdict');
const preset = (page, i) => page.locator('.scene-preset').nth(i).click();

test('floor room: two missing corners can’t be tiled, and the colours say why', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'floor');
  await expect(page.locator('#scene-status')).toHaveText('0 laid · 62 squares left');
  await page.locator('#scene-action').click(); // look at the colours
  await expect(page.locator('#floor-readout')).toContainText('30 light · 32 dark');
  await page.locator('#floor-solve').click();
  await expect(verdict(page)).toHaveText(/Impossible: 30 light squares and 32 dark ones/);
});

test('floor room: one square of each colour gone always tiles; balanced can still be stuck', async ({ page }) => {
  await page.goto('/#room=floor');
  await preset(page, 1);
  await page.locator('#floor-solve').click();
  await expect(page.locator('#scene-status')).toHaveText('Covered with 31 dominoes', { timeout: 5000 });
  await expect(verdict(page)).toHaveText(/31 dominoes cover the whole floor/);
  await preset(page, 2);
  await page.locator('#floor-solve').click();
  await expect(verdict(page)).toHaveText(/though the colours balance: one square has no free neighbour/);
});

test('floor room: keys lay and lift a domino, and remove a square; a shared link keeps the floor', async ({ page }) => {
  await page.goto('/#room=floor');
  const canvas = page.locator('#scene-canvas');
  await canvas.focus();
  await page.keyboard.press('ArrowRight'); // the cursor appears on the board
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.locator('#scene-status')).toHaveText('1 laid · 60 squares left');
  await page.keyboard.press('Enter'); // on a domino: lift it
  await expect(page.locator('#scene-status')).toHaveText('0 laid · 62 squares left');

  await page.getByRole('button', { name: 'Remove squares' }).click();
  await canvas.focus();
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Enter');
  await expect(page.locator('#scene-status')).toHaveText('0 laid · 61 squares left');
  await expect(page.locator('#scene-name')).toHaveText('Your own floor');

  const { settings } = await tool(page, 'read_exploration');
  await page.goto(`/#room=floor&holesA=${settings.holesA}&holesB=${settings.holesB}`);
  await expect(page.locator('#scene-status')).toHaveText('0 laid · 61 squares left');
});
