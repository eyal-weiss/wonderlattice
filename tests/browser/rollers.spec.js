import { test, expect } from './helpers.js';

const status = (page) => page.locator('#scene-status');
const scene = (page) => page.locator('#scene-name');
const readout = (page) => page.locator('#rollers-readout');

/**
 * Where the pens' lines are drawn, column by column across the left part of the picture: the plank's pen draws in
 * green, the cart's in red. Returns, for each colour, how far its line strays up or down, in canvas pixels.
 */
const penLines = (page) =>
  page.locator('#scene-canvas').evaluate((canvas) => {
    const { data, width, height } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    const colours = { level: [127, 224, 192], wave: [255, 143, 122] };
    const spread = {};
    for (const [name, c] of Object.entries(colours)) {
      let lo = Infinity,
        hi = -Infinity,
        columns = 0;
      for (let x = Math.round(width * 0.03); x < width * 0.35; x += 3) {
        for (let y = 0; y < height; y++) {
          const o = (y * width + x) * 4;
          if (Math.hypot(data[o] - c[0], data[o + 1] - c[1], data[o + 2] - c[2]) < 30) {
            lo = Math.min(lo, y);
            hi = Math.max(hi, y);
            columns++;
            break;
          }
        }
      }
      spread[name] = columns > 20 ? hi - lo : null;
    }
    return spread;
  });

test('rollers room: opens on a plank riding level on Reuleaux triangles, above a cart that bobs', async ({ page }) => {
  await page.goto('/#room=rollers');
  await expect(scene(page)).toHaveText('Reuleaux triangles');
  await expect(status(page)).toHaveText('Level on rollers');
  await expect(readout(page)).toContainText('The plank stays perfectly level.');
  await expect(readout(page)).toContainText('never rises or falls');
  await expect(readout(page)).toContainText('15.5% of the width');
  await expect(readout(page)).toContainText('3.14 × its width');
  await expect(readout(page)).toContainText('89.7% of a circle’s');
  // It rolls by itself, without a click.
  const canvas = page.locator('#scene-canvas');
  const first = await canvas.screenshot();
  await page.waitForTimeout(400);
  expect(first.equals(await canvas.screenshot())).toBe(false);
});

test('rollers room: the plank’s pen draws a straight line, the cart’s a wave', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=rollers');
  await expect(scene(page)).toHaveText('Reuleaux triangles');
  const lines = await penLines(page);
  expect(lines.level).not.toBeNull();
  expect(lines.level).toBeLessThanOrEqual(2);
  expect(lines.wave).toBeGreaterThan(8);
  // A circle doesn't bob on its axle either: both lines are straight, and both green.
  await page.getByRole('button', { name: 'Circle', exact: true }).click();
  await expect(scene(page)).toHaveText('Round logs');
  await expect(readout(page)).toContainText('bobs by0% of the width');
  const round = await penLines(page);
  expect(round.wave).toBeNull();
  expect(round.level).toBeLessThanOrEqual(2);
});

test('rollers room: the arrow keys change the shape, Enter draws a new lopsided one', async ({ page }) => {
  await page.goto('/#room=rollers');
  const canvas = page.locator('#scene-canvas');
  await canvas.focus();
  await page.keyboard.press('ArrowDown');
  await expect(scene(page)).toHaveText('Reuleaux pentagons');
  await expect(readout(page)).toContainText('5.1% of the width');
  await expect(page.locator('[data-shape="2"]')).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('ArrowDown');
  await expect(scene(page)).toHaveText('A lopsided shape');
  await expect(page.locator('#c-lines')).toBeVisible();
  await page.keyboard.press('ArrowDown'); // there is no fifth shape
  await expect(scene(page)).toHaveText('A lopsided shape');
  for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowUp');
  await expect(scene(page)).toHaveText('Round logs');
  await expect(page.locator('#c-round')).toHaveCount(0); // a circle has no corners to round
  // Enter: a new lopsided shape, and the link keeps it.
  await page.keyboard.press('Enter');
  await expect(scene(page)).toHaveText('A lopsided shape');
  await expect(readout(page)).toContainText('3.14 × its width');
  await page.getByRole('button', { name: 'Copy this exploration' }).click();
  const link = await page.evaluate(() => window.__clipboard.at(-1));
  expect(link).toContain('shape=3');
  expect(link).not.toContain('seed=7&');
});

test('rollers room: rounding the corners keeps the width, and the cart bobs less', async ({ page }) => {
  await page.goto('/#room=rollers');
  await page.locator('#c-round').fill('20');
  await expect(scene(page)).toHaveText('Rounded triangles');
  await expect(readout(page)).toContainText('3.14 × its width');
  const bob = Number((await readout(page).textContent()).match(/([\d.]+)% of the width/)[1]);
  expect(bob).toBeGreaterThan(0);
  expect(bob).toBeLessThan(15.5);
  await expect(page.locator('.scene-preset').first()).toHaveAttribute('aria-pressed', 'false');
});

test('rollers room: a Reuleaux triangle drills 98.8% of the square, a circle a round hole', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // the whole turn's hole shows at once
  await page.goto('/#room=rollers');
  await page.locator('.scene-preset', { hasText: 'Drill a square hole' }).click();
  await expect(scene(page)).toHaveText('Drilling with a Reuleaux triangle');
  await expect(status(page)).toHaveText('98.8% drilled');
  await expect(readout(page)).toContainText('Almost a square hole.');
  await expect(readout(page)).toContainText('98.8% of the square');
  await page.getByRole('button', { name: 'Pentagon', exact: true }).click();
  await expect(scene(page)).toHaveText('Drilling with a Reuleaux pentagon');
  await expect(readout(page)).toContainText('87.9% of the square');
  await page.getByRole('button', { name: 'Circle', exact: true }).click();
  await expect(readout(page)).toContainText('A round hole.');
  await expect(readout(page)).toContainText('78.5% of the square');
});

test('rollers room: the drill fills the square as it turns', async ({ page }) => {
  await page.goto('/#room=rollers&view=1');
  await expect(scene(page)).toHaveText('Drilling with a Reuleaux triangle');
  const share = async () => Number((await status(page).textContent()).match(/([\d.]+)% drilled/)[1]);
  const early = await share();
  expect(early).toBeLessThan(98.8);
  await expect.poll(share, { timeout: 15000 }).toBe(98.8);
});

test('rollers room: four shapes of one width each roll one turn, and finish together', async ({ page }) => {
  await page.goto('/#room=rollers');
  await page.getByRole('button', { name: 'One turn', exact: true }).click();
  await expect(scene(page)).toHaveText('Four shapes, one width');
  await expect(status(page)).toHaveText('Same width, same rim');
  await expect(readout(page)).toContainText('They all finish together.');
  await expect(readout(page)).toContainText('π × the width');
  await expect(readout(page)).toContainText('the triangle: 89.7% of a circle’s');
  await expect(page.locator('.scene-preset').nth(2)).toHaveAttribute('aria-pressed', 'true');
});

test('rollers room: dragging sideways rolls the plank', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // nothing moves unless dragged
  await page.goto('/#room=rollers');
  const canvas = page.locator('#scene-canvas');
  await canvas.evaluate((c) => c.scrollIntoView({ block: 'start' }));
  const before = await canvas.screenshot();
  const box = await canvas.boundingBox();
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.3);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.3, { steps: 6 });
  await page.mouse.up();
  expect(before.equals(await canvas.screenshot())).toBe(false);
  await expect(scene(page)).toHaveText('Reuleaux triangles');
});

test('rollers room: a shared link brings back a lopsided shape and its corners', async ({ page }) => {
  await page.goto('/#room=rollers&shape=3&seed=42&lines=5&round=10&view=0');
  await expect(scene(page)).toHaveText('A lopsided shape');
  await expect(page.locator('#c-lines')).toHaveValue('5');
  await expect(page.locator('#c-round')).toHaveValue('10');
  await expect(page.locator('[data-shape="3"]')).toHaveAttribute('aria-pressed', 'true');
  // Values out of range are ignored.
  await page.goto('/#room=rollers&shape=9&lines=40');
  await page.reload();
  await expect(scene(page)).toHaveText('Reuleaux triangles');
});

test.describe('on a touch screen', () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });

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

  test('rollers room: a finger on the rollers or the drill drags it, and anywhere else the page scrolls', async ({
    page,
  }) => {
    await page.goto('/#room=rollers');
    await expect(scene(page)).toHaveText('Reuleaux triangles');
    await page.waitForTimeout(300); // one frame, so the room knows where its pictures are
    expect(await touchKeeps(page, 0.5, 0.3)).toBe(true); // the plank on its rollers
    expect(await touchKeeps(page, 0.5, 0.8)).toBe(false); // the cart on its axles
    await page.getByRole('button', { name: 'Drill', exact: true }).click();
    await page.waitForTimeout(300);
    expect(await touchKeeps(page, 0.3, 0.5)).toBe(true); // the square
    expect(await touchKeeps(page, 0.95, 0.5)).toBe(false); // beside it
  });
});
