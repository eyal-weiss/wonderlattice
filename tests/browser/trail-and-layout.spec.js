import { readFile } from 'node:fs/promises';
import { test, expect, ROOMS, openRoom, expectRoom } from './helpers.js';

test('a saved moment survives reload and can be revisited', async ({ page }) => {
  await page.goto('/#room=motion');
  await page.getByRole('button', { name: /Almost a circle/ }).click();
  await page.locator('#trail-keep-motion').click();
  await expect(page.locator('#trail-capture-dialog')).toBeVisible();
  await expect(page.locator('#trail-preview img')).toHaveCount(1);
  await page.locator('#trail-note').fill('The drift is slow');
  await page.locator('#trail-save').click();
  await expect(page.locator('#trail-dialog')).toBeVisible();
  await expect(page.locator('.trail-card')).toHaveCount(1);
  await expect(page.locator('.trail-card h3')).toHaveText('Almost a circle');

  await openRoomFromDialog(page, 'traffic');
  await page.locator('#scene-action').click();
  await page.locator('#trail-keep-scene').click();
  await expect(page.locator('#trail-capture-name')).toHaveText('The city crossing');
  await page.locator('#trail-save').click();
  await expect(page.locator('.trail-card')).toHaveCount(2);
  await expect(page.locator('#trail-connections .trail-bridge')).toHaveCount(3);
  await page.locator('#trail-dialog .trail-close').click();

  await page.reload();
  await page.locator('#trail-open').click();
  await expect(page.locator('.trail-card')).toHaveCount(2);
  await page.locator('.trail-card', { hasText: 'Almost a circle' }).getByRole('button', { name: 'Revisit' }).click();
  await expectRoom(page, 'motion');
  await expect(page.locator('#pattern-name')).toHaveText('Almost a circle');
  await expect(page.locator('#ratio')).toHaveValue('1.03');
  await expect(page.locator('#trail-return')).toBeVisible();
  await expect(page.locator('#trail-return-thought')).toContainText('The drift is slow');
  await page.locator('#trail-return-note').fill('Now it looks like a spiral');
  await page.locator('#trail-return-save').click();
  await expect(page.locator('#trail-return-thought')).toContainText('Your new thought is saved');

  await page.locator('#trail-open').click();
  await expect(page.locator('.trail-card', { hasText: 'Almost a circle' })).toContainText('Now it looks like a spiral');
  await page.locator('.trail-card', { hasText: 'The city crossing' }).getByRole('button', { name: 'Revisit' }).click();
  await expectRoom(page, 'traffic');
  await expect(page.locator('#scene-action')).toHaveText('Close the shortcut');
});

test('a trail can be exported and imported', async ({ page }, testInfo) => {
  await page.goto('/#room=motion');
  await page.locator('#trail-keep-motion').click();
  await page.locator('#trail-save').click();
  const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#trail-export').click()]);
  expect(download.suggestedFilename()).toBe('wonderlattice-my-trail.json');
  const file = testInfo.outputPath('trail.json');
  await download.saveAs(file);
  const data = JSON.parse(await readFile(file, 'utf8'));
  expect(data).toMatchObject({ format: 'wonderlattice-trail', version: 1 });
  expect(data.entries).toHaveLength(1);

  await page.locator('.trail-card').getByRole('button', { name: 'Remove' }).click();
  await expect(page.locator('.trail-empty')).toBeVisible();
  await expect(page.locator('#trail-export')).toBeDisabled();
  await page.locator('#trail-import').setInputFiles(file);
  await expect(page.locator('#trail-status')).toHaveText('Trail imported. Your previous trail was replaced.');
  await expect(page.locator('.trail-card')).toHaveCount(1);
  await page
    .locator('#trail-import')
    .setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"format":"nope"}') });
  await expect(page.locator('#trail-status')).toContainText('not a valid Wonderlattice trail');
  await expect(page.locator('.trail-card')).toHaveCount(1);
});

test('reduced motion shows finished drawings and still guests', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=motion');
  await expect(page.locator('#cycle-status')).toHaveText('The loop is complete');
  await expect(page.locator('#play')).toHaveText('Replay');
  const animation = await page
    .locator('#math-guest-motion .math-guest-figure')
    .evaluate((el) => getComputedStyle(el).animationName);
  expect(animation).toBe('none');
  await openRoom(page, 'flock');
  await expect(page.locator('#scene-play')).toHaveText('Play');
});

for (const width of [375, 320]) {
  test(`every room fits a ${width}px phone screen`, async ({ page }) => {
    await page.setViewportSize({ width, height: 740 });
    await page.goto('/');
    for (const room of Object.keys(ROOMS)) {
      await openRoom(page, room);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${room} horizontal overflow`).toBeLessThanOrEqual(0);
    }
  });
}

async function openRoomFromDialog(page, room) {
  await page.locator('#trail-dialog .trail-close').click();
  await openRoom(page, room);
}

test('every room can keep a moment in the trail and reopen it', async ({ page }) => {
  test.setTimeout(10000 * Object.keys(ROOMS).length); // visits every room twice
  await page.goto('/');
  for (const room of Object.keys(ROOMS)) {
    await openRoom(page, room);
    await page.locator(room === 'motion' ? '#trail-keep-motion' : '#trail-keep-scene').click();
    await page.locator('#trail-save').click();
    await expect(page.locator('#trail-status'), `${room} saves`).toHaveText('');
    await expect(page.locator('#trail-dialog')).toBeVisible();
    await page.locator('#trail-dialog .trail-close').click();
  }
  await page.reload();
  await page.locator('#trail-open').click();
  await expect(page.locator('.trail-card')).toHaveCount(Object.keys(ROOMS).length);
  const names = Object.keys(ROOMS);
  for (let i = 0; i < names.length; i++) {
    // Newest first, so the last room saved is the first card.
    await page.locator('.trail-card').nth(i).getByRole('button', { name: 'Revisit' }).click();
    await expectRoom(page, names[names.length - 1 - i]);
    await page.locator('#trail-open').click();
  }
});
