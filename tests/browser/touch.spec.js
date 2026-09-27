import { test, expect, ROOMS, openRoom, tool } from './helpers.js';

// On a phone the canvas fills much of the screen, so a finger on it must scroll the page
// unless the room really drags there.
const DRAGS_EVERYWHERE = ['flock', 'ribbon', 'cube'];

test.use({ hasTouch: true });

test('a finger on the canvas scrolls the page, except in rooms that drag', async ({ page }) => {
  await page.goto('/');
  for (const room of Object.keys(ROOMS).filter((r) => r !== 'motion')) {
    await openRoom(page, room);
    const touch = await page.locator('#scene-canvas').evaluate((c) => getComputedStyle(c).touchAction);
    expect(touch, room).toBe(DRAGS_EVERYWHERE.includes(room) ? 'none' : 'manipulation');
  }
});

/** Starts a touch at (fx, fy) of the canvas and reports whether the page was kept from scrolling. */
function touchKeeps(page, fx, fy) {
  return page.locator('#scene-canvas').evaluate(
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
}

test('the plane keeps touches in its left picture, where the compass is, and lets others scroll', async ({ page }) => {
  await page.goto('/#room=plane');
  await expect(page.locator('body')).toHaveAttribute('data-room', 'plane');
  await page.waitForTimeout(300); // one frame, so the room knows where its pictures are
  expect(await touchKeeps(page, 0.25, 0.5)).toBe(true);
  expect(await touchKeeps(page, 0.75, 0.5)).toBe(false);
});

test('a tap in the plane’s left picture still brings the compass there', async ({ page }) => {
  await page.goto('/#room=plane');
  await expect(page.locator('body')).toHaveAttribute('data-room', 'plane');
  await page.waitForTimeout(300);
  const before = (await tool(page, 'read_exploration')).settings;
  const box = await page.locator('#scene-canvas').boundingBox();
  await page.touchscreen.tap(box.x + box.width * 0.3, box.y + box.height * 0.3);
  const after = (await tool(page, 'read_exploration')).settings;
  expect([after.probeX, after.probeY]).not.toEqual([before.probeX, before.probeY]);
});

test('the storm keeps touches on the picture it paints, and lets others scroll', async ({ page }) => {
  await page.goto('/#room=storm');
  await expect(page.locator('body')).toHaveAttribute('data-room', 'storm');
  const kept = [];
  for (let fx = 0.05; fx < 1; fx += 0.1)
    for (let fy = 0.05; fy < 1; fy += 0.1) kept.push(await touchKeeps(page, fx, fy));
  expect(kept.some(Boolean)).toBe(true); // on the picture
  expect(kept.some((k) => !k)).toBe(true); // around it
});
