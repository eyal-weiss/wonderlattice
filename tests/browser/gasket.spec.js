import { test, expect, ROOMS, openRoom, setRange, tool } from './helpers.js';

// Circles all the way down: every circle of the −1, 2, 2, 3 gasket has a whole-number bend, a tap shows the rule that
// made it, nudged starting circles give decimals, and zooming finds bigger and bigger whole numbers.

const settings = async (page) => (await tool(page, 'read_exploration')).settings;

/** Where a point of the gasket (the big circle has radius 1 and centre 0) is on the page, at magnification 1. */
async function at(page, x, y) {
  const canvas = page.locator('#scene-canvas');
  await canvas.evaluate((c) => c.scrollIntoView({ block: 'start' }));
  const box = await canvas.boundingBox();
  const side = Math.min(box.width, box.height);
  const unit = (side - 2 * Math.min(16, Math.max(6, side * 0.03))) / 2;
  return [box.x + box.width / 2 + x * unit, box.y + box.height / 2 - y * unit];
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // the whole gasket at once, no dive by itself
});

test('gasket room: every bend is a whole number, and a tap shows the rule behind one', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'gasket');
  await expect(page.locator('#room-title')).toHaveText(ROOMS.gasket);
  await expect(page.locator('#scene-status')).toHaveText('Every bend a whole number');
  await expect(page.locator('#gasket-readout')).toContainText(/Whole numbers, from −1 to \d{3}/);
  await expect(page.locator('#gasket-readout')).toContainText('Tap any circle');
  // The circle of bend 6 at the top right touches the big circle, a 3 and a 2; the other 2 is across from them.
  await page.mouse.click(...(await at(page, 0.5, 0.667)));
  await expect(page.locator('#gasket-readout')).toContainText('Bend 6');
  await expect(page.locator('#gasket-readout')).toContainText('6 = 2 × (−1 + 2 + 3) − 2');
  // The circle of bend 15 in the middle: the one across from it is the big circle, bracketed.
  await page.mouse.click(...(await at(page, 0, 0.267)));
  await expect(page.locator('#gasket-readout')).toContainText('15 = 2 × (2 + 2 + 3) − (−1)');
  // Outside every circle: the big circle itself.
  await page.mouse.click(...(await at(page, 0.98, 0.98)));
  await expect(page.locator('#gasket-readout')).toContainText('Bend −1: the big circle curves the other way');
  await expect(page.locator('#gasket-readout')).toContainText('−1 = 2 × (2 + 2 + 3) − 15');
});

test('gasket room: nudged starting circles give decimals; Halves brings the whole numbers back', async ({ page }) => {
  await page.goto('/#room=gasket');
  await page.getByRole('button', { name: /Nudged/ }).click();
  await expect(page.locator('#scene-status')).toHaveText('Bends with decimals');
  await expect(page.locator('#gasket-readout')).toContainText('Not whole numbers');
  await page.getByRole('button', { name: /Thirds/ }).click();
  await expect(page.locator('#scene-status')).toHaveText('Every bend a whole number');
  await expect(page.locator('#gasket-readout')).toContainText(/Whole numbers, from −2 to/);
  // A slider nudges one circle; the right one gives way when the left grows too wide for both.
  await setRange(page, '#c-a', 2.6);
  await expect(page.locator('#scene-status')).toHaveText('Bends with decimals');
  await expect(page.locator('#scene-name')).toHaveText('Your own circles');
  expect((await settings(page)).b).toBeCloseTo(8.67, 2); // the big circle's bend is −2 here: 2 + 2²/0.6, rounded up
  await page.getByRole('button', { name: /Halves/ }).click();
  await expect(page.locator('#scene-status')).toHaveText('Every bend a whole number');
  await expect(page.locator('#scene-name')).toHaveText('Halves');
});

test('gasket room: dragging a starting circle resizes it, and the circles stay touching', async ({ page }) => {
  await page.goto('/#room=gasket');
  await expect(page.locator('#scene-status')).toHaveText('Every bend a whole number');
  const [x, y] = await at(page, -0.5, 0);
  await page.mouse.move(x, y);
  await page.mouse.down();
  for (let i = 1; i <= 8; i++) await page.mouse.move(x + i * 8, y);
  await page.mouse.up();
  const s = await settings(page);
  expect(s.a).toBeLessThan(2); // the left circle grew
  expect(1 / s.a + 1 / s.b).toBeLessThanOrEqual(1.0001); // and the two still fit side by side
  await expect(page.locator('#scene-status')).toHaveText('Bends with decimals');
  await expect(page.locator('#c-a')).toHaveValue(String(s.a));
});

test('gasket room: the keyboard picks circles and zooms; Dive in finds bends in the thousands', async ({ page }) => {
  await page.goto('/#room=gasket');
  const canvas = page.locator('#scene-canvas');
  await canvas.focus();
  await page.keyboard.press('Enter'); // the biggest circle first: a 2
  await expect(page.locator('#gasket-readout')).toContainText('Bend 2');
  await page.keyboard.press('+');
  expect((await settings(page)).zoom).toBeCloseTo(1.6, 5);
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('-');
  await page.keyboard.press('-');
  expect(await settings(page)).toMatchObject({ zoom: 1, vx: 0, vy: 0 });
  await page.getByRole('button', { name: 'Dive in' }).click();
  expect((await settings(page)).zoom).toBe(2500);
  await expect(page.locator('#scene-status')).toHaveText('Every bend a whole number');
  await expect(page.locator('#gasket-readout')).toContainText(/to \d{1,3},\d{3}/); // a bend of a thousand or more
  await page.getByRole('button', { name: 'Start again' }).click();
  expect((await settings(page)).zoom).toBe(1);
});

test('gasket room: scrolling on the tapped picture zooms, and a shared link keeps the view', async ({ page }) => {
  await page.goto('/#room=gasket');
  const [x, y] = await at(page, 0.5, 0.667);
  await page.mouse.click(x, y); // taps the 6, and gives the picture the keyboard
  await page.mouse.wheel(0, -400);
  await expect.poll(async () => (await settings(page)).zoom).toBeGreaterThan(1.5);
  const { zoom, vx, vy } = await settings(page);
  await page.goto(`/#room=gasket&k=2&a=3&b=6&zoom=${zoom}&vx=${vx}&vy=${vy}`);
  await expect(page.locator('#scene-name')).toHaveText('Thirds');
  expect(await settings(page)).toMatchObject({ k: 2, a: 3, b: 6, zoom });
});

test('gasket room: two fingers pinch to zoom', async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/#room=gasket');
  await expect(page.locator('body')).toHaveAttribute('data-room', 'gasket');
  await page.waitForTimeout(300); // a frame, so the room knows where the gasket is
  const zoomed = await page.locator('#scene-canvas').evaluate((canvas) => {
    const r = canvas.getBoundingClientRect();
    const touches = (spread) =>
      [-1, 1].map(
        (side, i) =>
          new Touch({
            identifier: i + 1,
            target: canvas,
            clientX: r.left + r.width / 2 + side * spread,
            clientY: r.top + r.height / 2,
          }),
      );
    const send = (type, spread) => {
      const list = type === 'touchend' ? [] : touches(spread);
      const event = new TouchEvent(type, {
        touches: list,
        changedTouches: touches(spread),
        cancelable: true,
        bubbles: true,
      });
      canvas.dispatchEvent(event);
      return event.defaultPrevented;
    };
    const kept = send('touchstart', 20);
    send('touchmove', 40);
    send('touchmove', 80);
    send('touchend', 80);
    return { kept, zoom: globalThis.Wonderlattice.stage.settingsFor('gasket').zoom };
  });
  expect(zoomed.kept).toBe(true); // the page itself doesn't zoom
  expect(zoomed.zoom).toBeCloseTo(4, 1);
  await context.close();
});
