import { test, expect, expectRoom } from './helpers.js';

// The home map names the newest rooms (their `added` dates), up to three from the last 30 days. Rooms still waiting
// for their translations aren't on the map, so they aren't named either; a room's date is the day its translations
// put it on the map (flavours on 17 October, the gasket on 13 October; thirteen rooms on 12 October, and with the
// same date, the line takes them in reverse order of id).
test('the home map names the newest rooms, newest first, and each opens its room', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-17T12:00:00Z'));
  await page.goto('/');
  const line = page.locator('#whats-new');
  await expect(line).toBeVisible();
  await expect(line.locator('button')).toHaveText([
    'The machine that found flavours',
    'Circles all the way down',
    'The sunflower’s secret angle',
  ]);
  await line.getByRole('button', { name: 'The machine that found flavours' }).click();
  await expectRoom(page, 'flavours');
});

test('with nothing new for 30 days, there is no line', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-15T12:00:00Z'));
  await page.goto('/');
  await expect(page.locator('#whats-new')).toBeHidden();
  await expect(page.locator('.map-room').first()).toBeVisible();
});

test('the line speaks the page language', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-17T12:00:00Z'));
  await page.goto('/?lang=he');
  await expect(page.locator('#whats-new .eyebrow')).toHaveText('חדש');
  // Each room is named as the map's list names it: in Hebrew once the room is translated, in English until then.
  const buttons = page.locator('#whats-new button');
  await expect(buttons).toHaveCount(3);
  for (const button of await buttons.all()) {
    const card = page.locator(`.room-list-room[data-go="${await button.getAttribute('data-go')}"] span`);
    await expect(button).toHaveText((await card.textContent()) ?? '');
  }
});
