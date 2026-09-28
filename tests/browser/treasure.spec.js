import { test, expect, openRoom } from './helpers.js';

test('treasure room: with rare treasure, most beeps are false alarms', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // the sweep lands at once
  await page.goto('/');
  await openRoom(page, 'treasure');
  await expect(page.locator('#treasure-readout strong')).toHaveText('28%');
  await expect(page.locator('#scene-status')).toHaveText('Sweep the island to start');
  await page.locator('#scene-action').click(); // sweep
  await expect(page.locator('#scene-status')).toContainText('tap one to dig');
  await page.locator('#scene-action').click(); // dig every beep
  const status = await page.locator('#scene-status').textContent();
  const [, beeps, found, alarms] = status.match(/(\d+) beeps? dug: (\d+) treasures?, (\d+) false alarms?/).map(Number);
  expect(found + alarms).toBe(beeps);
  expect(alarms).toBeGreaterThan(found); // the surprise: a 95% detector, yet most beeps are wrong
  await expect(page.locator('#scene-action')).toHaveText('A new island');
});

test('treasure room: a second detector makes a beep mean much more', async ({ page }) => {
  await page.goto('/#room=treasure');
  await page.getByRole('button', { name: /Ask a second detector/ }).click();
  const percent = Number((await page.locator('#treasure-readout strong').textContent()).replace('%', ''));
  expect(percent).toBeGreaterThan(80);
  await expect(page.locator('#treasure-readout p')).toContainText('Both detectors beep');
});

test('treasure room: the keyboard sweeps and digs', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=treasure');
  await page.locator('#scene-canvas').focus();
  await page.keyboard.press('Enter'); // the first dig sweeps the island
  await expect(page.locator('#scene-status')).toContainText('tap one to dig');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect(page.locator('#announcer')).toHaveText(/Treasure!|Nothing here\.|stayed quiet/);
});

test('treasure room: a shared link restores the odds', async ({ page }) => {
  await page.goto('/#room=treasure&treasure=30&accuracy=90');
  await expect(page.locator('#v-treasure')).toHaveText('30% · 1 in 3');
  const percent = Number((await page.locator('#treasure-readout strong').textContent()).replace('%', ''));
  expect(percent).toBeGreaterThan(70);
});
