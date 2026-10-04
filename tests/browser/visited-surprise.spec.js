import { test, expect, openRoom, expectRoom } from './helpers.js';

const visited = (page) =>
  page.evaluate(() => [...document.querySelectorAll('.map-room.visited')].map((card) => card.dataset.room).sort());

test('rooms already opened carry a quiet mark on the map, kept across a reload', async ({ page }) => {
  await page.goto('/');
  expect(await visited(page)).toEqual([]);
  await openRoom(page, 'dice');
  await openRoom(page, 'waves');
  await page.locator('#room-home').click();
  expect(await visited(page)).toEqual(['dice', 'waves']);
  // Screen readers hear it after the room's name; the others say nothing extra.
  await expect(page.locator('#card-dice')).toContainText('(opened before)');
  await expect(page.locator('#card-ribbon .room-card-visited')).toBeHidden();
  await page.reload();
  expect(await visited(page)).toEqual(['dice', 'waves']);
  // No counts or scores anywhere.
  await expect(page.locator('#home')).not.toContainText(/\b\d+ (of|out of) \d+\b/);
});

test('forgetting clears the marks', async ({ page }) => {
  await page.goto('/#room=dice');
  await page.locator('#room-home').click();
  expect(await visited(page)).toEqual(['dice']);
  await page.locator('#about-button').click();
  await page.locator('#forget-visited').click();
  await expect(page.locator('#toast')).toContainText('no experiment is marked');
  await page.locator('#about-dialog .close').first().click();
  expect(await visited(page)).toEqual([]);
});

test('with storage blocked, nothing breaks and nothing is marked', async ({ page }) => {
  await page.addInitScript(() => {
    const blocked = () => {
      throw new DOMException('blocked', 'SecurityError');
    };
    Object.defineProperty(window, 'localStorage', { get: blocked });
  });
  await page.goto('/');
  await openRoom(page, 'dice');
  await page.locator('#room-home').click();
  expect(await visited(page)).toEqual([]);
  await page.locator('#home-surprise').click();
  await expect(page.locator('body')).not.toHaveAttribute('data-room', 'home');
});

test('"Surprise me" opens a room not yet opened, and never the room you are in', async ({ page }) => {
  await page.addInitScript(() => (Math.random = () => 0)); // always the first candidate
  await page.goto('/');
  const order = await page.evaluate(() => [...document.querySelectorAll('.map-room')].map((c) => c.dataset.room));
  await page.locator('#home-surprise').click();
  await expectRoom(page, order[0]);
  // From inside that room, the room bar's surprise skips it and every room already opened.
  await page.locator('#room-surprise').click();
  await expectRoom(page, order[1]);
  await page.goBack();
  await expectRoom(page, order[0]);
});

test('once every room has been opened, a surprise is still another room', async ({ page }) => {
  await page.addInitScript(() => (Math.random = () => 0.999));
  await page.goto('/');
  const order = await page.evaluate(() => [...document.querySelectorAll('.map-room')].map((c) => c.dataset.room));
  await page.evaluate((ids) => localStorage.setItem('wonderlattice.visited.v1', JSON.stringify(ids)), order);
  await page.goto('/#room=' + order.at(-1));
  await expectRoom(page, order.at(-1));
  await page.locator('#room-surprise').click();
  await expectRoom(page, order.at(-2)); // the last of the others, and not the room we were in
});

test('the surprise button speaks the page language', async ({ page }) => {
  await page.goto('/?lang=he');
  await expect(page.locator('#home-surprise')).toHaveText(/הפתיעו אותי/);
  await page.goto('/?lang=he#room=dice');
  await expect(page.locator('#room-surprise')).toHaveAttribute('aria-label', 'הפתעה: ניסוי אחר');
});
