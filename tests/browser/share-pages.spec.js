import { test, expect, ROOMS, expectRoom } from './helpers.js';

// Each room has a share page (/room/<id>/) with its own link preview, made by the build. Only the built
// site (SERVE_DIR=dist, as in CI) has them.
test.beforeEach(() => test.skip(process.env.SERVE_DIR !== 'dist', 'share pages are made by the build'));

test('every room has a share page with its own title, description and picture', async ({ request }) => {
  for (const room of Object.keys(ROOMS)) {
    const html = await (await request.get(`/room/${room}/`)).text();
    expect(html, room).toContain(`data-room="${room}"`);
    expect(html, room).toMatch(/<meta property="og:title" content="[^"]+"/);
    expect(html, room).toMatch(/<meta property="og:description" content="[^"]+"/);
    const image = html.match(/<meta property="og:image" content="https:\/\/wonderlattice\.com(\/[^"]+)"/)?.[1];
    expect(image, room).toBeTruthy();
    expect((await request.get(image)).status(), `${room} ${image}`).toBe(200);
  }
});

test('a share page forwards to its room, keeping shared settings and the language', async ({ page }) => {
  await page.goto('/room/dice/#room=dice&set=1');
  await expectRoom(page, 'dice');
  await expect(page).toHaveURL(/\/#room=dice&set=1$/);
  await expect(page.locator('#dice-set')).toHaveValue('1');

  await page.goto('/room/plane/');
  await expectRoom(page, 'plane');
  await expect(page).toHaveURL(/\/#room=plane$/);

  await page.goto('/room/fingerprint/?lang=he');
  await expectRoom(page, 'fingerprint');
  await expect(page).toHaveURL(/\/\?lang=he#room=fingerprint$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'he');
});
