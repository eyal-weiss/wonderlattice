import { test, expect, expectRoom } from './helpers.js';

// The home map names the newest rooms (their `added` dates), up to three from the last 30 days.
test('the home map names the newest rooms, newest first, and each opens its room', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-09-30T12:00:00Z'));
  await page.goto('/');
  const line = page.locator('#whats-new');
  await expect(line).toBeVisible();
  await expect(line.locator('button')).toHaveText([
    'Hang it, flip it, build it',
    'Square wheels, smooth ride',
    'Stop at 37%',
  ]);
  await line.getByRole('button', { name: 'Stop at 37%' }).click();
  await expectRoom(page, 'stopping');
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
  // Each room is named as its card on the map names it: in Hebrew once the room is translated, in English until then.
  const buttons = page.locator('#whats-new button');
  await expect(buttons).toHaveCount(3);
  for (const button of await buttons.all()) {
    const card = page.locator(`#card-${await button.getAttribute('data-go')} strong`);
    await expect(button).toHaveText((await card.textContent()) ?? '');
  }
});
