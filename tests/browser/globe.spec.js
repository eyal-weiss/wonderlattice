import { test, expect, openRoom, tool, setRange } from './helpers.js';

const readout = (page) => page.locator('#globe-readout');
const status = (page) => page.locator('#scene-status');

test('globe room: three right angles make 270°, and the carried arrow comes home turned by 90°', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'globe');
  await expect(status(page)).toHaveText('Angles add up to 270°');
  await expect(readout(page)).toContainText('90° + 90° + 90° = 270°');
  await expect(readout(page)).toContainText(/More than 180° by\s*90°/);
  await expect(readout(page)).toContainText(/Share of the ball\s*12\.5%/);
  // The walk sets off by itself; once it is home, the turn shows.
  await expect(readout(page)).toContainText(/turned by\s*on its way/);
  await expect(readout(page)).toContainText(/turned by\s*90°/, { timeout: 15000 });
  await expect(page.locator('#globe-size-value')).toHaveText('12.5% of the ball');
});

test('globe room: the presets, and shrinking the triangle until its extra all but vanishes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=globe');
  await page.locator('.scene-preset').nth(1).click();
  await expect(status(page)).toHaveText('Angles add up to 360°');
  await expect(readout(page)).toContainText(/Share of the ball\s*25%/);
  // With reduced motion the walk is shown already finished.
  await expect(readout(page)).toContainText(/turned by\s*180°/);

  await page.locator('.scene-preset').nth(2).click();
  await expect(status(page)).toHaveText('Angles add up to 180.09°');
  await expect(readout(page)).toContainText('60.03° + 60.03° + 60.03° = 180.09°');

  await page.locator('.scene-preset').nth(0).click();
  await setRange(page, '#globe-size', 8);
  await expect(page.locator('#scene-name')).toHaveText('Your own triangle');
  await expect(status(page)).toHaveText(/^Angles add up to 180\.\d\d°$/);
  await setRange(page, '#globe-size', 100);
  const { settings } = await tool(page, 'read_exploration');
  expect(settings.aLat).toBeLessThan(90); // resized about its middle, so no corner stays at the pole
  await expect(status(page)).toHaveText(/^Angles add up to (4\d\d|5[0-3]\d)°$/);
});

test('globe room: a shared link keeps the triangle, and a broken one falls back', async ({ page }) => {
  await page.goto('/#room=globe&aLat=10&aLon=20&bLat=50&bLon=-30&cLat=-20&cLon=-60');
  await expect(page.locator('#scene-name')).toHaveText('Your own triangle');
  // Checked independently: 75.73° + 92.80° + 57.68° = 226.21°.
  await expect(status(page)).toHaveText('Angles add up to 226°');
  await expect(readout(page)).toContainText('76° + 93° + 57° = 226°');
  await page.goto('/#room=globe&aLat=0&aLon=0&bLat=0&bLon=0&cLat=0&cLon=90');
  await page.reload();
  await expect(status(page)).toHaveText('Angles add up to 270°');
});

test('globe room: keys pick a corner and move it; a drag moves a corner too', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // no rocking, so the corners stay put for the mouse
  await page.goto('/#room=globe');
  const canvas = page.locator('#scene-canvas');
  await canvas.focus();
  await page.keyboard.press('2');
  for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#scene-name')).toHaveText('Your own triangle');
  await expect(status(page)).not.toHaveText('Angles add up to 270°');
  await page.keyboard.press('Escape');
  const before = (await tool(page, 'read_exploration')).settings;
  await page.keyboard.press('ArrowRight'); // with no corner picked, the arrows turn the ball instead
  expect((await tool(page, 'read_exploration')).settings).toEqual(before);

  // Back to three right angles, then drag the corner at the pole downwards: the triangle shrinks.
  await page.locator('.scene-preset').nth(0).click();
  await canvas.evaluate((c) => c.scrollIntoView({ block: 'start' })); // the picture is taller than the window
  const box = await canvas.boundingBox();
  // Where the room puts the pole on a wide picture: the layout's centre and radius, seen from 30° north.
  const seen = Math.min(box.height, Math.max(0.58 * box.width, 300));
  const base = Math.min(box.width / 2 - 12, (seen - 96) / 1.45);
  const pole = { x: box.x + box.width / 2, y: box.y + 66 + 0.88 * base + 6 - base * Math.cos(Math.PI / 6) };
  await page.mouse.move(pole.x, pole.y);
  await page.mouse.down();
  await page.mouse.move(pole.x, pole.y + 40, { steps: 4 });
  await page.mouse.move(pole.x, pole.y + 80, { steps: 4 });
  await page.mouse.up();
  await expect(page.locator('#scene-name')).toHaveText('Your own triangle');
  const after = (await tool(page, 'read_exploration')).settings;
  expect(after.aLat).toBeLessThan(80);
  await expect(status(page)).toHaveText(/^Angles add up to 2[0-6]\d°$/);
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

  test('globe room: a finger on the ball turns it, and around it or on the chart the page scrolls', async ({
    page,
  }) => {
    await page.goto('/#room=globe');
    await expect(page.locator('body')).toHaveAttribute('data-room', 'globe');
    expect(await touchKeeps(page, 0.5, 0.3)).toBe(true); // on the ball
    expect(await touchKeeps(page, 0.02, 0.3)).toBe(false); // beside it
    expect(await touchKeeps(page, 0.5, 0.9)).toBe(false); // on the chart below
  });
});
