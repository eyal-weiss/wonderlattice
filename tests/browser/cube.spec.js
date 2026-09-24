import { test, expect, openRoom, tool } from './helpers.js';

const settings = async (page) => (await tool(page, 'read_exploration')).settings;

test('the cube builds a sequence, counts repeats, and undoes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await openRoom(page, 'cube');
  await expect(page.locator('#cube-readout')).toContainText('R U');
  await expect(page.locator('#cube-readout')).toContainText('Comes home after 105 repeats');
  await page.locator('#cube-clear').click();
  await expect(page.locator('#scene-status')).toHaveText('Solved');
  await page.getByRole('button', { name: 'Turn the right face clockwise' }).click();
  await page.getByRole('button', { name: 'Turn the top face clockwise' }).click();
  await page.getByRole('button', { name: 'Turn the right face anticlockwise' }).click();
  await page.getByRole('button', { name: 'Turn the top face anticlockwise' }).click();
  await expect(page.locator('#cube-readout')).toContainText('R U R′ U′');
  await expect(page.locator('#cube-readout')).toContainText('Comes home after 6 repeats');
  await expect(page.locator('#scene-status')).toHaveText('7 pieces moved');
  await page.locator('#scene-action').click();
  await expect(page.locator('#cube-readout')).toContainText('done 2 times');
  await page.locator('#cube-home').click();
  await expect(page.locator('#scene-status')).toHaveText('Solved');
  await expect(page.locator('#cube-readout')).toContainText('done 6 times');
  await page.locator('#cube-undo').click();
  await expect(page.locator('#cube-readout')).toContainText('done 5 times');
  expect(await settings(page)).toMatchObject({ repeats: 5 });
});

test('R U really needs 105 repeats to come home, and the counter doesn’t give it away', async ({ page }) => {
  await page.goto('/#room=cube');
  await page.getByRole('button', { name: /Back where it started/ }).click();
  await page.locator('#cube-home').click();
  // While the repeats play, the status reflects the cube as it is, not the ending.
  await expect(page.locator('#scene-status')).not.toHaveText('Solved');
  await expect(page.locator('#scene-status')).toHaveText('Solved', { timeout: 30000 });
  await expect(page.locator('#cube-readout')).toContainText('done 105 times');
});

test('comparing two orders shows when moves commute', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=cube');
  await page.getByRole('button', { name: /Order matters/ }).click();
  await expect(page.locator('#cube-readout')).toContainText('different order');
  await page.locator('#cube-b').selectOption('4'); // L commutes with R
  await page.locator('#scene-action').click();
  await expect(page.locator('#cube-readout')).toContainText('commute');
});

test('a shared cube link restores the sequence; a broken code falls back safely', async ({ page }) => {
  await page.goto('/#room=cube&seq=2&repeats=3&mode=0');
  await expect(page.locator('#cube-readout')).toContainText('R');
  expect(await settings(page)).toMatchObject({ seq: 2, repeats: 3 });
  await page.evaluate(() => (location.hash = 'room=cube&seq=13&mode=0'));
  await expect(page.locator('#cube-readout')).toContainText('No moves yet');
});

test('actions redraw the cube even when nothing is animating (reduced motion)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=cube');
  const picture = () => page.locator('#scene-canvas').evaluate((c) => c.toDataURL());
  const before = await picture();
  await page.locator('#scene-action').click(); // Repeat it
  await expect.poll(picture).not.toBe(before);
  const once = await picture();
  await page.locator('#cube-home').click();
  await expect.poll(picture).not.toBe(once);
  await expect(page.locator('#scene-status')).toHaveText('Solved');
});

test('leaving mid-repeat and coming back shows a consistent status', async ({ page }) => {
  await page.goto('/#room=cube');
  await page.locator('#cube-home').click();
  await page.waitForTimeout(600);
  await page.locator('#room-next').click();
  await page.locator('#room-prev').click();
  await expect(page.locator('body')).toHaveAttribute('data-room', 'cube');
  await expect(page.locator('#scene-status')).toHaveText('Solved');
  await expect(page.locator('#cube-readout')).toContainText('done 105 times');
});

test('compare mode waits for a turn before claiming a difference', async ({ page }) => {
  await page.goto('/#room=cube');
  await page.locator('[data-mode="1"]').click();
  await expect(page.locator('#cube-readout')).toContainText('Press “Turn them”');
  await page.locator('#scene-action').click();
  await expect(page.locator('#cube-readout')).toContainText('different order');
});
