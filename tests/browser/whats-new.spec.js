import { test, expect, expectRoom } from './helpers.js';

// The home map names the newest rooms (their `added` dates), up to three from the last 30 days.
test('the home map names the newest rooms, newest first, and each opens its room', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-09-30T12:00:00Z'));
  await page.goto('/');
  const line = page.locator('#whats-new');
  await expect(line).toBeVisible();
  await expect(line.locator('button')).toHaveText([
    'The table that forgets',
    'A thousand samples, ten tests',
    'The shower that never settles',
  ]);
  await line.getByRole('button', { name: 'The shower that never settles' }).click();
  await expectRoom(page, 'shower');
});

test('with nothing new for 30 days, there is no line', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-15T12:00:00Z'));
  await page.goto('/');
  await expect(page.locator('#whats-new')).toBeHidden();
  await expect(page.locator('.room-card').first()).toBeVisible();
});

test('the line speaks the page language', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-09-30T12:00:00Z'));
  await page.goto('/?lang=he');
  await expect(page.locator('#whats-new .eyebrow')).toHaveText('חדש');
  // A room that is newer than its translations is still named in English, so look for one that has them.
  await expect(page.locator('#whats-new button', { hasText: 'אלף דגימות, עשר בדיקות' })).toHaveCount(1);
});
