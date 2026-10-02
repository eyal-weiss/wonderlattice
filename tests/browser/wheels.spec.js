import { test, expect } from './helpers.js';

const status = (page) => page.locator('#scene-status');
const scene = (page) => page.locator('#scene-name');
const readout = (page) => page.locator('#wheels-readout');

/**
 * Where the room puts things on a wide picture (its layout): the lanes fit in the part of the picture likely on
 * screen, the first lane's axle is `axle` from the top, and its cart is centred at 42% of the width.
 */
function lanes(box, own) {
  const seen = Math.min(box.height, Math.max(0.58 * box.width, 300));
  const room = seen - 24 - (2 * 22 + 14);
  const R = own ? Math.min((room * 0.58) / 3.3, 96, (box.width * 0.4) / 2.4) : Math.min((room * 0.5) / 3.3, 64);
  return { R, axle: 12 + 22 + 2 * R, cx: 0.42 * box.width };
}

test('wheels room: opens on square wheels riding level, beside the same cart bobbing on a flat road', async ({
  page,
}) => {
  await page.goto('/#room=wheels');
  await expect(scene(page)).toHaveText('Square wheels');
  await expect(status(page)).toHaveText('Level ride');
  await expect(readout(page)).toContainText('On its own road, the axle stays perfectly level.');
  await expect(readout(page)).toContainText('29% of the radius high');
  await expect(readout(page)).toContainText('On a flat road, the axle bobs by29% of the radius');
  await expect(readout(page)).toContainText('nowhere');
  // It rolls by itself, without a click.
  const canvas = page.locator('#scene-canvas');
  const first = await canvas.screenshot();
  await page.waitForTimeout(400);
  expect(first.equals(await canvas.screenshot())).toBe(false);
});

test('wheels room: the triangle cuts into its road, and more sides ride on shallower bumps', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=wheels');
  await page.locator('.scene-preset', { hasText: 'A triangle crashes' }).click();
  await expect(status(page)).toHaveText('It would crash');
  await expect(readout(page)).toContainText('On its own road, it would crash.');
  await expect(readout(page)).toContainText('It cuts into its road by3.2% of the radius');
  await expect(readout(page)).toContainText('It is crashing for67% of the way');
  await page.locator('#c-sides').fill('6');
  await expect(scene(page)).toHaveText('Hexagon wheels');
  await expect(status(page)).toHaveText('Level ride');
  await expect(readout(page)).toContainText('13% of the radius high');
  await page.locator('#c-sides').fill('12');
  await expect(readout(page)).toContainText('3.4% of the radius high');
  await expect(scene(page)).toHaveText('Wheels with 12 sides');
});

test('wheels room: the arrow keys change the sides, Enter brings another wheel', async ({ page }) => {
  await page.goto('/#room=wheels');
  const canvas = page.locator('#scene-canvas');
  await canvas.focus();
  await page.keyboard.press('ArrowRight');
  await expect(scene(page)).toHaveText('Pentagon wheels');
  await expect(page.locator('#c-sides')).toHaveValue('5');
  await page.keyboard.press('Enter');
  await expect(scene(page)).toHaveText('Hexagon wheels');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowLeft');
  await expect(scene(page)).toHaveText('A triangle crashes');
  await page.keyboard.press('ArrowLeft'); // no fewer than three sides
  await expect(page.locator('#c-sides')).toHaveValue('3');
});

test('wheels room: a drawn heart rides its road, until its dent is pulled in too far', async ({ page }) => {
  await page.goto('/#room=wheels');
  await page.getByRole('button', { name: 'Your own wheel' }).click();
  await expect(scene(page)).toHaveText('A heart-shaped wheel');
  await expect(status(page)).toHaveText('Level ride');
  await expect(readout(page)).toContainText('nowhere');
  // The keys pick the dot on the fourth spoke, straight up from the axle (the heart's dent), and pull it in.
  const canvas = page.locator('#scene-canvas');
  await canvas.focus();
  for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowDown');
  await expect(scene(page)).toHaveText('Your own wheel');
  await expect(status(page)).toHaveText('It would crash');
  await expect(readout(page)).toContainText('It cuts into its road by5.5% of the longest radius');
  await expect(readout(page)).toContainText('It is crashing for13% of the way');
  await page.keyboard.press('ArrowUp');
  await expect(status(page)).toHaveText('Level ride');
  // Shapes to start from.
  await page.getByRole('button', { name: 'Circle', exact: true }).click();
  await expect(scene(page)).toHaveText('Circle');
  await expect(readout(page)).toContainText('On a flat road, the axle bobs by0% of the longest radius');
  await page.getByRole('button', { name: 'Star', exact: true }).click();
  await expect(status(page)).toHaveText('It would crash');
  await page.getByRole('button', { name: 'Another wheel' }).click();
  await expect(scene(page)).not.toHaveText('Star');
  // Back to regular wheels: the number of sides is kept.
  await page.getByRole('button', { name: 'Regular wheels' }).click();
  await expect(scene(page)).toHaveText('Square wheels');
});

test('wheels room: dragging a dot reshapes the wheel and its road', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // the wheel stands still, upright
  await page.goto('/#room=wheels&own=true');
  await expect(scene(page)).toHaveText('A heart-shaped wheel');
  const canvas = page.locator('#scene-canvas');
  await canvas.evaluate((c) => c.scrollIntoView({ block: 'start' }));
  const box = await canvas.boundingBox();
  const { R, axle, cx } = lanes(box, true);
  // The heart's dent: the dot straight above the axle, 0.35 of the longest radius out.
  const dent = { x: box.x + cx, y: box.y + axle - 0.35 * R };
  await page.mouse.move(dent.x, dent.y);
  await expect(canvas).toHaveClass(/wheels-dot/);
  await page.mouse.down();
  await page.mouse.move(dent.x, dent.y + 0.1 * R, { steps: 4 });
  await page.mouse.move(dent.x, dent.y + 0.2 * R, { steps: 4 });
  await page.mouse.up();
  await expect(scene(page)).toHaveText('Your own wheel');
  await expect(status(page)).toHaveText('It would crash');
  // The link keeps the new shape.
  await page.getByRole('button', { name: 'Copy this exploration' }).click();
  expect(await page.evaluate(() => window.__clipboard.at(-1))).toContain('rd=30');
});

test('wheels room: a tap in the row of wheels rides that wheel', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=wheels');
  const canvas = page.locator('#scene-canvas');
  await canvas.evaluate((c) => c.scrollIntoView({ block: 'start' }));
  const box = await canvas.boundingBox();
  test.skip(box.height < 700, 'the row of wheels needs a tall picture');
  // Under the two lanes (each 22 + 3.3 R tall, 14 apart), the row's title, then six wheels across.
  const { R } = lanes(box, false);
  const top = 12 + 2 * (22 + 3.3 * R) + 14 + 40 + 22;
  await page.mouse.click(box.x + 12 + (box.width - 24) / 12, box.y + top + 40);
  await expect(scene(page)).toHaveText('A triangle crashes');
  await page.mouse.click(box.x + 12 + (7 * (box.width - 24)) / 12, box.y + top + 40); // the fourth: six sides
  await expect(scene(page)).toHaveText('Hexagon wheels');
});

test('wheels room: shared links keep the wheel, and ignore values out of range', async ({ page }) => {
  await page.goto('/#room=wheels&sides=99&rd=5');
  await expect(page.locator('#c-sides')).toHaveValue('4');
  await page.goto('/#room=wheels&sides=7');
  await expect(scene(page)).toHaveText('Wheels with 7 sides');
  await page.goto('/#room=wheels&own=true&ra=30&rb=30&rc=30&rd=100&re=30&rf=30&rg=30&rh=100&ri=30&rj=30&rk=30&rl=100');
  await expect(scene(page)).toHaveText('Star');
  await expect(status(page)).toHaveText('It would crash');
});

test.describe('on a touch screen', () => {
  test.use({ hasTouch: true });

  /** Starts a touch at a canvas position and reports whether the page was kept from scrolling. */
  const touchKeeps = (page, x, y) =>
    page.locator('#scene-canvas').evaluate(
      (canvas, [x, y]) => {
        const r = canvas.getBoundingClientRect();
        const point = { identifier: 1, target: canvas, clientX: r.left + x, clientY: r.top + y };
        const event = new TouchEvent('touchstart', {
          touches: [new Touch(point)],
          changedTouches: [new Touch(point)],
          cancelable: true,
          bubbles: true,
        });
        canvas.dispatchEvent(event);
        return event.defaultPrevented;
      },
      [x, y],
    );

  test('wheels room: a finger on a dot drags it, and anywhere else the page scrolls', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#room=wheels&own=true');
    await expect(scene(page)).toHaveText('A heart-shaped wheel');
    const box = await page.locator('#scene-canvas').boundingBox();
    const { R, axle, cx } = lanes(box, true);
    expect(await touchKeeps(page, cx, axle - 0.35 * R)).toBe(true); // the dent's dot
    expect(await touchKeeps(page, cx, axle)).toBe(false); // the axle
    expect(await touchKeeps(page, 0.05 * box.width, axle)).toBe(false); // the road beside it
  });
});
