import { test, expect, openRoom, tool } from './helpers.js';

const readout = (page) => page.locator('#maps-readout');
const status = (page) => page.locator('#scene-status');

/** The shortest route between two places, as the room writes it, from the model itself. */
const shortest = (page, a, b) =>
  page.evaluate(
    ([a, b]) => {
      const M = window.Wonderlattice.models.maps;
      return `${(Math.round((M.greatCircle(a, b) * M.RADIUS) / 10) * 10).toLocaleString('en')} km`;
    },
    [a, b],
  );

/**
 * Where a place sits on Mercator's map, by the room's own layout: under a strip of words (one line of them on a
 * wide picture), 82°S to 82°N, the middle of the route in the middle.
 */
async function onMercator(page, s, place) {
  const box = await page.locator('#scene-canvas').boundingBox();
  const { x, y } = await page.evaluate(
    ([s, place, w, h]) => {
      const M = window.Wonderlattice.models.maps;
      const ctx = document.createElement('canvas').getContext('2d');
      ctx.font = '700 16px system-ui, sans-serif';
      const words = window.Wonderlattice.text('maps').truths[0];
      const top = 18 + (ctx.measureText(words).width > w - 28 ? 2 : 1) * 21;
      const k = (h - top) / 2 / M.mercatorY(82);
      const middle = M.greatCircleAt([s.aLat, s.aLon], [s.bLat, s.bLon], 0.5)[1];
      return {
        x: w / 2 + M.wrap(place[1] - middle) * M.DEG * k,
        y: top + (h - top) / 2 - k * M.mercatorY(place[0]),
      };
    },
    [s, place, box.width, box.height],
  );
  return { x: box.x + x, y: box.y + y };
}

test('maps room: from New York to Tokyo, the curve is 1,940 km shorter and reaches 70°N', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'maps');
  await expect(page.locator('#scene-name')).toHaveText('New York to Tokyo');
  await expect(status(page)).toHaveText('10,850 km by the shortest route');
  await expect(readout(page)).toContainText(/Shortest route \(great circle\)\s*10,850 km/);
  await expect(readout(page)).toContainText(/One compass heading \(rhumb line\)\s*12,790 km/);
  await expect(readout(page)).toContainText('The shortest route is 15% shorter. On the way it reaches 70°N.');
  // The two planes set off by themselves, and the one on the curve lands first.
  await expect(page.locator('#announcer')).toHaveText('The curve lands first, with 1,940 km less to fly', {
    timeout: 15000,
  });
});

test('maps room: the four maps, chosen in the panel or by a link', async ({ page }) => {
  await page.goto('/#room=maps');
  const button = (name) => page.locator('#scene-controls').getByRole('button', { name, exact: true });
  await expect(button('Mercator')).toHaveAttribute('aria-pressed', 'true');
  for (const [name, hint] of [
    ['Globe', 'The Earth as a ball'],
    ['Gnomonic', 'Every shortest route is a straight line'],
    ['Equal area', 'The Gall–Peters map'],
    ['Mercator', 'Mercator’s map of 1569'],
  ]) {
    await button(name).click();
    await expect(button(name)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#maps-view-hint')).toContainText(hint);
    await expect(status(page)).toHaveText('10,850 km by the shortest route');
  }
  await page.goto('/#room=maps&aLat=51.51&aLon=-0.13&bLat=40.71&bLon=-74.01&view=2');
  await page.reload();
  await expect(button('Gnomonic')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#scene-name')).toHaveText('Your own route');
  await expect(status(page)).toHaveText(
    `${await shortest(page, [51.51, -0.13], [40.71, -74.01])} by the shortest route`,
  );
  // Two pins on the same place make no route: the room starts from New York and Tokyo instead.
  await page.goto('/#room=maps&aLat=10&aLon=20&bLat=10&bLon=20');
  await page.reload();
  await expect(page.locator('#scene-name')).toHaveText('New York to Tokyo');
});

test('maps room: Madrid to Beijing, and Greenland goes on a diet', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=maps');
  await page.locator('.scene-preset').nth(1).click();
  await expect(status(page)).toHaveText('9,220 km by the shortest route');
  await expect(readout(page)).toContainText(/One compass heading \(rhumb line\)\s*10,210 km/);
  await expect(readout(page)).toContainText('The shortest route is 10% shorter. On the way it reaches 59°N.');

  const stickers = page.locator('[data-check="stickers"]');
  await expect(stickers).not.toBeChecked();
  await page.locator('.scene-preset').nth(2).click();
  await expect(stickers).toBeChecked();
  // On the equator, Greenland's copy is drawn at its true size; at home in the far north, about 17 times too big.
  await expect(readout(page)).toContainText(/Greenland’s copy is drawn\s*×1 its true size/);
  await page.goto('/#room=maps&stickers=true'); // the copy starts on top of Greenland itself
  await page.reload();
  await expect(readout(page)).toContainText(/Greenland’s copy is drawn\s*×17 its true size/);
  await page.locator('[data-view="3"]').click();
  await expect(readout(page)).toContainText(/Greenland’s copy is drawn\s*×1 its true size/);
  await page.locator('[data-view="1"]').click();
  await expect(readout(page)).toContainText(/Greenland’s copy is drawn\s*at its true size/);
});

test('maps room: keys move a pin, a drag moves a pin, and a tap drops a sticker', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // the map stays put for the mouse
  await page.goto('/#room=maps');
  const canvas = page.locator('#scene-canvas');
  await canvas.focus();
  await page.keyboard.press('2');
  await expect(page.locator('#announcer')).toHaveText('Pin 2: the arrow keys move it. Esc lets go.');
  for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowLeft');
  let { settings } = await tool(page, 'read_exploration');
  expect(settings.bLon).toBeCloseTo(134.69, 6);
  await expect(page.locator('#scene-name')).toHaveText('Your own route');
  await expect(status(page)).toHaveText(
    `${await shortest(page, [40.71, -74.01], [35.68, 134.69])} by the shortest route`,
  );
  await page.keyboard.press('Escape');
  await page.keyboard.press('ArrowRight'); // with no pin picked, the arrows turn the world, not the route
  expect((await tool(page, 'read_exploration')).settings).toEqual(settings);

  // Back to New York and Tokyo, then drag New York south to the Caribbean.
  await page.locator('.scene-preset').nth(0).click();
  await canvas.evaluate((c) => c.scrollIntoView({ block: 'start' }));
  ({ settings } = await tool(page, 'read_exploration'));
  const from = await onMercator(page, settings, [40.71, -74.01]);
  const to = await onMercator(page, settings, [18, -70]);
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move((from.x + to.x) / 2, (from.y + to.y) / 2, { steps: 4 });
  await page.mouse.move(to.x, to.y, { steps: 4 });
  await page.mouse.up();
  ({ settings } = await tool(page, 'read_exploration'));
  expect(settings.aLat).toBeCloseTo(18, 0);
  expect(settings.aLon).toBeCloseTo(-70, 0);
  await expect(page.locator('#scene-name')).toHaveText('Your own route');

  // A tap on the sea far south drops a sticker, drawn there four times its true size (1 ÷ cos² 60°).
  const sea = await onMercator(page, settings, [-60, -120]);
  await page.mouse.click(sea.x, sea.y);
  await expect(page.locator('#announcer')).toHaveText(/^A sticker at 60°S, drawn ×(3\.9|4|4\.1) its true size\.$/);
});

test.describe('on a touch screen', () => {
  test.use({ hasTouch: true });

  /** Starts a touch at (fx, fy) of the canvas and reports whether the page was kept from scrolling. */
  const touchKeeps = (page, fx, fy) =>
    page.locator('#scene-canvas').evaluate(
      (canvas, [fx, fy]) => {
        const r = canvas.getBoundingClientRect();
        const point = { identifier: 1, target: canvas, clientX: r.left + fx * r.width, clientY: r.top + fy * r.height };
        const event = new TouchEvent('touchstart', {
          touches: [new Touch(point)],
          changedTouches: [new Touch(point)],
          cancelable: true,
          bubbles: true,
        });
        canvas.dispatchEvent(event);
        return event.defaultPrevented;
      },
      [fx, fy],
    );

  test('maps room: a finger on a flat map scrolls the page, and on the globe it turns the world', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#room=maps');
    await expect(page.locator('body')).toHaveAttribute('data-room', 'maps');
    expect(await touchKeeps(page, 0.5, 0.75)).toBe(false); // the South Pacific, on Mercator's map
    await page.locator('[data-view="1"]').click();
    expect(await touchKeeps(page, 0.5, 0.5)).toBe(true); // the middle of the globe
    expect(await touchKeeps(page, 0.01, 0.5)).toBe(false); // beside it
  });
});
