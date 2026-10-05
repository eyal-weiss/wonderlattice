import { test, expect, ROOMS, PUBLISHED, expectRoom } from './helpers.js';

// A new room arrives in English, and its translations follow. Until every language has its words it stays off the
// map, the route, the "New" line and Surprise, so visitors reading another language don't meet it untranslated; a
// direct link still opens it (Wonderlattice.published, docs/ARCHITECTURE.md "The route").

/** Serve languages.js as if Hebrew had no file for `room` yet, so that room counts as waiting for its translations. */
async function withoutHebrew(page, room) {
  await page.route(/\/src\/lang\/languages\.js/, async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace(/he: \[[^\]]*\]/, (list) => list.replace(`'${room}',`, ''));
    await route.fulfill({ response, body });
  });
}

test('a room waiting for its translations is not on the map, the route, the "New" line or Surprise', async ({
  page,
}) => {
  await withoutHebrew(page, 'cheaters');
  await page.goto('/');
  expect(await page.evaluate(() => globalThis.Wonderlattice.published('cheaters'))).toBe(false);
  await expect(page.locator('.map-room')).toHaveCount(PUBLISHED.length - 1);
  await expect(page.locator('#card-cheaters')).toHaveCount(0);
  await expect(page.locator('.room-list-room', { hasText: ROOMS.cheaters.replace(/\.$/, '') })).toHaveCount(0);
  await expect(page.locator('#whats-new')).not.toContainText('Kaleidoscope of cheaters');
  // Its neighbours on the route now lead to each other.
  const route = PUBLISHED.filter((id) => id !== 'cheaters');
  const before = route[PUBLISHED.indexOf('cheaters') - 1];
  await page.goto(`/#room=${before}`);
  await expect(page.locator('#room-next')).toHaveAttribute('data-room', route[route.indexOf(before) + 1]);
  // Surprise never lands there.
  for (let i = 0; i < 12; i++) {
    await page.locator('#room-surprise').click();
    await expect(page.locator('body')).not.toHaveAttribute('data-room', 'cheaters');
  }
});

test('a direct link still opens a room waiting for its translations', async ({ page }) => {
  await withoutHebrew(page, 'cheaters');
  await page.goto('/#room=cheaters');
  await expectRoom(page, 'cheaters');
  await expect(page.locator('#room-title')).toHaveText(ROOMS.cheaters);
});

test('a room never offers a room waiting for its translations as the next stop', async ({ page }) => {
  // The cheaters room's "Visit…" button leads to another room; once that room waits for its translations, it goes.
  await page.goto('/#room=cheaters');
  await expect(page.locator('#connection')).toBeVisible();
  const target = await page.locator('#connection button').getAttribute('data-go');
  await withoutHebrew(page, target);
  await page.reload();
  await expectRoom(page, 'cheaters');
  expect(await page.evaluate((id) => globalThis.Wonderlattice.published(id), target)).toBe(false);
  await expect(page.locator('#connection')).toBeHidden();
});

test('today, the rooms on the map are those every language has words for', async ({ page }) => {
  await page.goto('/');
  expect(await page.locator('.map-room').evaluateAll((rooms) => rooms.map((r) => r.dataset.room))).toEqual(PUBLISHED);
  for (const room of Object.keys(ROOMS).filter((id) => !PUBLISHED.includes(id))) {
    await page.goto(`/#room=${room}`);
    await expectRoom(page, room);
  }
});
