import { test, expect, openRoom, inkedPixels } from './helpers.js';

test('blocks room: the surprise — 4 blocks reach 1 block-length, 31 reach 2', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'blocks');
  // Default: 4 blocks in best position — status shows overhang > 1
  await expect(page.locator('#scene-status')).toContainText('4 blocks');
  const status4 = await page.locator('#scene-status').textContent();
  const oh4 = parseFloat(status4.match(/([\d.]+) block-lengths/)[1]);
  expect(oh4).toBeGreaterThan(1.0); // 4 blocks clear the table edge

  // Switch to 31-block preset
  await page.getByRole('button', { name: /31 blocks/ }).click();
  await expect(page.locator('#scene-status')).toContainText('31 blocks');
  const status31 = await page.locator('#scene-status').textContent();
  const oh31 = parseFloat(status31.match(/([\d.]+) block-lengths/)[1]);
  expect(oh31).toBeGreaterThanOrEqual(2.0); // 31 blocks reach 2 block-lengths
});

test('blocks room: Best Stack button snaps blocks to optimal positions', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'blocks');
  // Use 4-block preset, then click Best Stack
  await page.getByRole('button', { name: /4 blocks/ }).click();
  await page.locator('#scene-action').click(); // Best Stack
  await expect(page.locator('#announcer')).toHaveText('Best Stack');
  const status = await page.locator('#scene-status').textContent();
  const oh = parseFloat(status.match(/([\d.]+) block-lengths/)[1]);
  expect(oh).toBeGreaterThan(1.0);
});

test('blocks room: the canvas has a live picture', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'blocks');
  await expect.poll(() => inkedPixels(page, '#scene-canvas')).toBeGreaterThan(50);
});

test('blocks room: keyboard adds and removes blocks', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'blocks');
  // Start with empty stack via reset
  await page.locator('#scene-reset').click();
  const canvas = page.locator('#scene-canvas');
  await canvas.focus();
  // Up arrow adds a block
  await page.keyboard.press('ArrowUp');
  await expect(page.locator('#scene-status')).toContainText('1 block');
  await page.keyboard.press('ArrowUp');
  await expect(page.locator('#scene-status')).toContainText('2 blocks');
  // Down arrow removes a block
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#scene-status')).toContainText('1 block');
});

test('blocks room: the explanation dialog opens', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'blocks');
  await page.locator('#scene-why').click();
  await expect(page.locator('#insight-dialog')).toBeVisible();
  await expect(page.locator('#insight-dialog')).toContainText('harmonic series');
  await page.locator('#insight-close').click();
  await expect(page.locator('#insight-dialog')).not.toBeVisible();
});

test('blocks room: reduced motion — still renders a picture', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await openRoom(page, 'blocks');
  await expect.poll(() => inkedPixels(page, '#scene-canvas')).toBeGreaterThan(50);
});
