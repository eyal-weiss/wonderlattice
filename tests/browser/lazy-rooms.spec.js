import { test, expect, openRoom, expectRoom, inkedPixels } from './helpers.js';

// The published site loads each room only when it's needed: when it opens, or when its card comes into view.
// Only the built site (SERVE_DIR=dist, as in CI) does this; opened from disk, every room loads with the page.
test.beforeEach(() => test.skip(process.env.SERVE_DIR !== 'dist', 'rooms load on demand only on the built site'));

/** Records the rooms whose code the page fetches (src/rooms/<id>/…). */
function watchRooms(page) {
  const rooms = new Set();
  page.on('request', (r) => {
    const m = r.url().match(/\/src\/rooms\/([a-z]+)\//);
    if (m) rooms.add(m[1]);
  });
  return rooms;
}

test('a shared link to a room loads that room alone, and opens it with its settings', async ({ page }) => {
  const rooms = watchRooms(page);
  await page.goto('/#room=shower&mode=1&pipe=4');
  await expectRoom(page, 'shower');
  await expect(page.locator('#v-pipe')).toHaveText('4 s');
  // The drawing room is always in the page; no other room came, and the map's cards drew nothing.
  expect([...rooms].sort()).toEqual(['motion', 'shower']);
  await expect(page.locator('#home')).toBeHidden();
});

test('the home map loads only the rooms whose cards come into view', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const rooms = watchRooms(page);
  await page.goto('/');
  await expect.poll(() => inkedPixels(page, '#card-ribbon canvas')).toBeGreaterThan(100);
  const first = rooms.size;
  const all = await page.locator('.room-card').count();
  expect(first).toBeLessThan(all / 2);
  // Scrolling down brings the rest, and their cards are drawn.
  const last = await page.locator('.room-card').last().getAttribute('data-room');
  await page.locator(`#card-${last}`).scrollIntoViewIfNeeded();
  await expect.poll(() => inkedPixels(page, `#card-${last} canvas`)).toBeGreaterThan(100);
  expect(rooms.size).toBeGreaterThan(first);
});

test('the cards speak the page language before their rooms load', async ({ page }) => {
  const rooms = watchRooms(page);
  await page.goto('/?lang=he');
  await expect(page.locator('#card-pools strong')).toHaveText('אלף דגימות, עשר בדיקות');
  await expect(page.locator('#card-pools .eyebrow')).not.toHaveText('GROUP TESTING');
  expect(rooms.has('pools')).toBe(false); // its card is far down the map
  await openRoom(page, 'pools');
  await expect(page.locator('#room-title')).toHaveText('אלף דגימות, עשר בדיקות.');
});

test('a room that can’t load says so, keeps the map, and opens on the next try', async ({ page }) => {
  let blocked = true;
  page.expectErrors(/^Failed to load resource/);
  await page.route(/\/src\/rooms\/treasure\/room\.js/, (route) => (blocked ? route.abort() : route.continue()));
  await page.goto('/');
  await page.locator('#card-treasure').click();
  await expect(page.locator('#toast')).toHaveText(/couldn’t load/);
  await expectRoom(page, 'home');
  blocked = false;
  await page.locator('#card-treasure').click();
  await expectRoom(page, 'treasure');
  await expect(page.locator('#room-title')).toHaveText('The imperfect treasure detector.');
});

test('a room still loading doesn’t open once the visitor has gone elsewhere', async ({ page }) => {
  let release;
  const held = new Promise((resolve) => (release = resolve));
  await page.route(/\/src\/rooms\/cube\/room\.js/, async (route) => {
    await held;
    await route.continue();
  });
  await page.goto('/');
  await page.locator('#card-cube').click();
  await page.locator('#card-dice').click();
  await expectRoom(page, 'dice');
  release();
  await page.waitForTimeout(500);
  await expectRoom(page, 'dice');
});

test('a saved moment in a room that hasn’t loaded yet reopens it, with the way back', async ({ page }) => {
  await page.goto('/#room=treasure');
  await page.locator('#trail-keep-scene').click();
  await page.locator('#trail-save').click();
  await expect(page.locator('.trail-card')).toHaveCount(1);
  // A fresh visit that starts in the drawing room: the treasure room isn't here until the moment is revisited.
  const rooms = watchRooms(page);
  await page.goto('about:blank');
  await page.goto('/#room=motion');
  await expectRoom(page, 'motion');
  await page.locator('#trail-open').click();
  await page.locator('.trail-card').getByRole('button', { name: 'Revisit' }).click();
  await expectRoom(page, 'treasure');
  expect(rooms.has('treasure')).toBe(true);
  await expect(page.locator('#trail-return')).toBeVisible();
});
