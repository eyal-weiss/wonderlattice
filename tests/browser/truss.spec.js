import { test, expect, openRoom, setRange } from './helpers.js';

const status = (page) => page.locator('#scene-status');
const readout = (page) => page.locator('#truss-readout');
// Frames as their links write them (one bit per place a bar can go; see places() in the model).
const PRATT = 499711,
  PRATT_6 = 264765439,
  COUNTED = 245759;

/**
 * Where a point of an n-square bridge is drawn, in canvas pixels, from the room's layout (measure in room.js): the
 * bridge centred, with the bottom-left joint at (0, 0) and the top joints at y = 1, in squares.
 */
const spot = (page, n, x, y) =>
  page.locator('#scene-canvas').evaluate(
    (canvas, [n, x, y]) => {
      const r = canvas.getBoundingClientRect();
      const narrow = r.width < 600,
        band = narrow ? 42 : 68;
      let P = Math.max(24, Math.min(140, r.width / (n + 2.3), (r.height - band - 8) / 2.6));
      const own = (P) => band + 0.5 * P + 7 + 2.04 * P;
      // Wide pictures keep the square and the triangle below, the bridge a little smaller if it must.
      let roomy = false;
      if (!narrow && r.height - own(P) - 36 >= 174) roomy = true;
      else if (!narrow && (r.height - band - 7 - 36 - 184) / 2.54 >= 0.85 * P) {
        P = (r.height - band - 7 - 36 - 184) / 2.54;
        roomy = true;
      }
      const end = roomy ? r.height - 36 - Math.min(230, r.height - own(P) - 36) : r.height;
      const road = band + 0.5 * P + Math.max(0, (end - own(P)) * 0.3);
      const bottom = road + 7 + P;
      return { x: (r.width - n * P) / 2 + x * P, y: bottom - y * P, P };
    },
    [n, x, y],
  );

/** Tap the canvas at a point of the bridge. */
async function tap(page, n, x, y) {
  await page.locator('#scene-canvas').evaluate((el) => el.scrollIntoView({ block: 'start' }));
  const { x: px, y: py } = await spot(page, n, x, y);
  await page.locator('#scene-canvas').click({ position: { x: px, y: py } });
}

test('truss room: the bridge of squares folds under the truck, then braces itself and locks', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const W = globalThis.Wonderlattice;
    const say = W.announce;
    window.__said = [];
    W.announce = (words) => (window.__said.push(words), say(words));
  });
  await openRoom(page, 'truss');
  await expect(page.locator('#room-title')).toHaveText('The stubborn triangle.');
  await expect(page.locator('#scene-name')).toHaveText('Squares only');
  await expect(status(page)).toHaveText('Floppy · 4 bars short');
  await expect(readout(page)).toContainText('10 joints can each move two ways: 20 ways in all.');
  await expect(readout(page)).toContainText('it needs 17 bars. It has 13.');
  // By itself, within seconds: the truck drives on and the bridge folds; then the diagonals go in one by one.
  await expect.poll(() => page.evaluate(() => window.__said), { timeout: 10000 }).toContain('The bridge folds.');
  await expect(page.locator('#scene-name')).toHaveText('Bracing the squares', { timeout: 10000 });
  await expect(status(page)).toHaveText('Rigid · no spare bars', { timeout: 10000 });
  await expect(page.locator('#scene-name')).toHaveText('A Pratt truss');
  expect(await page.evaluate(() => window.__said)).toContain('The bridge is rigid.');
  // Then the truck drives across, and the readout says what the busiest bar carries.
  await expect(readout(page)).toContainText('The busiest bar carries', { timeout: 10000 });
  await expect(page.locator('#scene-action')).toHaveText('Take the diagonals out');
});

test('truss room: with reduced motion the truck stands in the middle, and every bar’s load is read out', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=truss');
  await expect(status(page)).toHaveText('Floppy · 4 bars short');
  await page.getByRole('button', { name: /A Pratt truss/ }).click();
  await expect(status(page)).toHaveText('Rigid · no spare bars');
  // Checked against an independent program: the top's middle and one upright carry the truck's weight, and the two
  // ends of the bottom carry nothing.
  await expect(readout(page)).toContainText(
    'The busiest bar carries as much as the truck weighs. 2 bars carry nothing.',
  );
  // Six squares: the middle of the top carries one and a half times the truck.
  await setRange(page, '#c-panels', 6);
  await expect(page.locator('#scene-name')).toHaveText('A Pratt truss');
  await expect(readout(page)).toContainText('14 joints can each move two ways: 28 ways in all.');
  await expect(readout(page)).toContainText('it needs 25 bars. It has 25.');
  await expect(readout(page)).toContainText(
    'The busiest bar carries 1.5 times the truck’s weight. 2 bars carry nothing.',
  );
  // Without the forces, the readout keeps to the count.
  await page.getByLabel('Show what each bar carries').uncheck();
  await expect(readout(page)).not.toContainText('busiest');
});

test('truss room: tap a bar out and the bridge is floppy; tap it back; a second diagonal is spare', async ({
  page,
}) => {
  await page.goto(`/#room=truss&bars=${PRATT}`);
  await page.locator('#scene-play').click();
  await expect(page.locator('#scene-play')).toHaveText('Play');
  await expect(status(page)).toHaveText('Rigid · no spare bars');
  // The first square's diagonal runs from its top left to its bottom right: tap a quarter of the way along.
  await tap(page, 4, 0.25, 0.75);
  await expect(status(page)).toHaveText('Floppy · one bar short');
  await expect(page.locator('#scene-name')).toHaveText('Your own bridge');
  await expect(readout(page)).toContainText('One bar is missing, so the bridge can still fold one way.');
  await tap(page, 4, 0.25, 0.75);
  await expect(status(page)).toHaveText('Rigid · no spare bars');
  await expect(page.locator('#scene-name')).toHaveText('A Pratt truss');
  // The other diagonal in the same square adds nothing: rigid, with one spare bar.
  await tap(page, 4, 0.75, 0.75);
  await expect(status(page)).toHaveText('Rigid · one spare bar');
  await expect(readout(page)).toContainText('One bar is spare (dashed): take it out and the bridge still stands.');
  await expect(readout(page)).toContainText('18 bars, 17 needed');
  // Start again goes back to the bridge the link opened.
  await page.locator('#scene-reset').click();
  await expect(status(page)).toHaveText('Rigid · no spare bars');
  await expect(page.locator('#scene-name')).toHaveText('A Pratt truss');
});

test('truss room: arrow keys aim at a place and Enter switches it', async ({ page }) => {
  await page.goto(`/#room=truss&bars=${PRATT}`);
  await page.locator('#scene-play').click();
  await page.locator('#scene-canvas').focus();
  // The first press shows the aim on a diagonal in the middle: here the empty one, which Enter puts in.
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect(status(page)).toHaveText('Rigid · one spare bar');
  await page.keyboard.press('Enter');
  await expect(status(page)).toHaveText('Rigid · no spare bars');
  // One step left is the upright beside it, which Enter takes out.
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Enter');
  await expect(status(page)).toHaveText('Floppy · one bar short');
});

test('truss room: enough bars in the wrong places stay floppy; the button braces every square', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=truss');
  await page.getByRole('button', { name: /Counted, but floppy/ }).click();
  await expect(page.locator('#scene-name')).toHaveText('Counted, but floppy');
  await expect(status(page)).toHaveText('Floppy · bars badly spread');
  await expect(readout(page)).toContainText('17 bars, 17 needed');
  await expect(readout(page)).toContainText('the dashed one is spare');
  await expect(page.locator('#scene-action')).toHaveText('Brace every square');
  await page.locator('#scene-action').click();
  await expect(status(page)).toHaveText('Rigid · one spare bar');
  await expect(page.locator('#scene-action')).toHaveText('Take the diagonals out');
  await page.locator('#scene-action').click();
  await expect(page.locator('#scene-name')).toHaveText('Squares only');
  await expect(status(page)).toHaveText('Floppy · 4 bars short');
});

test('truss room: a shared link keeps its bridge, and values out of range are ignored', async ({ page }) => {
  await page.goto(`/#room=truss&panels=6&bars=${PRATT_6}&forces=false`);
  await expect(page.locator('#scene-name')).toHaveText('A Pratt truss');
  await expect(status(page)).toHaveText('Rigid · no spare bars');
  await expect(page.locator('#c-panels')).toHaveValue('6');
  await expect(page.getByLabel('Show what each bar carries')).not.toBeChecked();
  await page.locator('#scene-share').click();
  const copied = await page.evaluate(() => window.__clipboard.at(-1));
  expect(copied).toContain(`bars=${PRATT_6}`);
  expect(copied).toContain('panels=6');
  await page.goto('/');
  await page.goto(`/#room=truss&panels=9&bars=-4`);
  await expect(page.locator('#c-panels')).toHaveValue('4');
  await expect(status(page)).toHaveText('Floppy · 4 bars short');
  await page.goto('/');
  await page.goto(`/#room=truss&bars=${COUNTED}`);
  await expect(status(page)).toHaveText('Floppy · bars badly spread');
});

test('truss room: drag the truck along the road, and the loads move with it', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`/#room=truss&bars=${PRATT}`);
  await expect(readout(page)).toContainText(
    'The busiest bar carries as much as the truck weighs. 2 bars carry nothing.',
  );
  await page.locator('#scene-canvas').evaluate((el) => el.scrollIntoView({ block: 'start' }));
  const box = await page.locator('#scene-canvas').boundingBox();
  // The truck stands on the road over the middle top joint; its body sits just above the road.
  const from = await spot(page, 4, 2, 1);
  const to = await spot(page, 4, 1, 1);
  const lift = Math.min(0.62 * from.P, 66) * 0.25 + 7;
  await page.mouse.move(box.x + from.x, box.y + from.y - lift);
  await page.mouse.down();
  await page.mouse.move(box.x + (from.x + to.x) / 2, box.y + from.y - lift, { steps: 4 });
  await page.mouse.move(box.x + to.x, box.y + to.y - lift, { steps: 4 });
  await page.mouse.up();
  // Over the first top joint along: more than the truck's weight in the busiest bar, and three bars carry nothing.
  await expect(readout(page)).toContainText(
    'The busiest bar carries 1.06 times the truck’s weight. 3 bars carry nothing.',
  );
});
