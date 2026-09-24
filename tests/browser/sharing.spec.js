import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { test, expect, ROOMS, openRoom, expectRoom } from './helpers.js';

test('copying a pattern produces a link that reopens it', async ({ page }) => {
  await page.goto('/#room=motion');
  await page.locator('#share').click();
  const link = await page.evaluate(() => window.__clipboard.at(-1));
  expect(link).toBe('http://localhost:4173/#room=motion&k=-5&r=42&p=0&ink=0');
  await openRoom(page, 'traffic');
  await page.locator('#scene-action').click();
  await page.locator('#scene-share').click();
  const trafficLink = await page.evaluate(() => window.__clipboard.at(-1));
  expect(trafficLink).toBe('http://localhost:4173/#room=traffic&demand=4000&shortcut=true');
});

test('shared links restore settings on load and on hash change', async ({ page }) => {
  await page.goto('/#room=traffic&demand=1000&shortcut=true');
  await expectRoom(page, 'traffic');
  await expect(page.locator('#traffic-result')).toContainText('20 min');
  await page.goto('/#room=motion&k=2.5&r=36&p=0&ink=1');
  await expect(page.locator('#pattern-name')).toHaveText('A shared orbit');
  await expect(page.locator('#ratio')).toHaveValue('2.5');
  await page.evaluate(() => (location.hash = 'room=ribbon&twists=0&zoom=1.2'));
  await expect(page.locator('#scene-status')).toHaveText('Two sides · two edges');
  await expect(page.locator('#v-zoom')).toHaveText('1.2×');
  await page.evaluate(() => (location.hash = 'room=waves&ratio=9&phase=90'));
  await expect(page.locator('#v-phase')).toHaveText('90°');
  await expect(page.locator('#v-ratio')).toHaveText('1.5×');
  await page.evaluate(() => (location.hash = 'room=motion&k=-3&r=25&p=45&ink=2'));
  await expectRoom(page, 'motion');
  await expect(page.locator('#pattern-name')).toHaveText('A shared orbit');
  await expect(page.locator('#phase-value')).toHaveText('45°');
});

test('images can be saved as PNG files', async ({ page }) => {
  await page.goto('/#room=motion');
  const [motion] = await Promise.all([page.waitForEvent('download'), page.locator('#save').click()]);
  expect(motion.suggestedFilename()).toBe('wonderloom--5-42.png');
  await openRoom(page, 'waves');
  const [scene] = await Promise.all([page.waitForEvent('download'), page.locator('#scene-save').click()]);
  expect(scene.suggestedFilename()).toBe('wonderloom-waves.png');
});

test('the app runs from a file:// URL without a server', async ({ page }) => {
  await page.goto(pathToFileURL(resolve(process.env.SERVE_DIR || '.', 'index.html')).href);
  await expect(page.locator('.room-card')).toHaveCount(5);
  for (const room of ['waves', 'flock', 'ribbon', 'traffic', 'motion']) {
    await openRoom(page, room);
    await expect(page.locator(room === 'motion' ? '#motion-room h1' : '#room-title')).toHaveText(ROOMS[room]);
  }
  // Back steps through the map and the previous room, even from disk.
  await page.goBack();
  await expectRoom(page, 'home');
  await page.goBack();
  await expectRoom(page, 'traffic');
  await page.goForward();
  await page.goForward();
  await expectRoom(page, 'motion');
  await page.locator('#share').click();
  expect(await page.evaluate(() => window.__clipboard.at(-1))).toContain('Inner rotation: -5×');
  await expect(page.locator('#math-guest-motion img')).toHaveJSProperty('complete', true);
});

test('a shared drawing link shows the same first visitor as a plain visit', async ({ page }) => {
  await page.addInitScript(() => (Math.random = () => 0));
  await page.goto('/');
  await page.locator('#card-motion').click();
  const plain = await page.locator('#math-guest-motion strong').textContent();
  await page.goto('/#room=motion&k=2.5&r=36&p=0&ink=1');
  await page.reload();
  await expect(page.locator('#math-guest-motion strong')).toHaveText(plain);
});
