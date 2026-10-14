import { test, expect, openRoom, inkedPixels, setRange } from './helpers.js';

test('blocks room: the surprise — 4 blocks reach 1 block-length, 31 reach 2', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'blocks');
  // A first visit starts with 4 blocks stacked straight at the edge: the question is still open.
  await expect(page.locator('#scene-status')).toHaveText('4 blocks · 0.00 block-lengths out');
  // The 4-block preset shows the answer: the top block clears the table edge.
  await page.getByRole('button', { name: /4 blocks/ }).click();
  const status4 = await page.locator('#scene-status').textContent();
  const oh4 = parseFloat(status4.match(/([\d.]+) block-lengths/)[1]);
  expect(oh4).toBeGreaterThan(1.0);

  // Switch to 31-block preset
  await page.getByRole('button', { name: /31 blocks/ }).click();
  await expect(page.locator('#scene-status')).toContainText('31 blocks');
  const status31 = await page.locator('#scene-status').textContent();
  const oh31 = parseFloat(status31.match(/([\d.]+) block-lengths/)[1]);
  expect(oh31).toBeGreaterThanOrEqual(2.0); // 31 blocks reach 2 block-lengths
});

test('blocks room: the best stack button snaps the straight opening stack to its best', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'blocks');
  await page.locator('#scene-action').click(); // Best stack
  await expect(page.locator('#announcer')).toHaveText('Best stack');
  const status = await page.locator('#scene-status').textContent();
  const oh = parseFloat(status.match(/([\d.]+) block-lengths/)[1]);
  expect(oh).toBeGreaterThan(1.0);
});

test('blocks room: the canvas has a live picture', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'blocks');
  await expect.poll(() => inkedPixels(page, '#scene-canvas')).toBeGreaterThan(50);
});

test('blocks room: keyboard adds and removes blocks', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'blocks');
  // Start with empty stack via reset
  await page.locator('#scene-reset').click();
  const canvas = page.locator('#scene-canvas');
  await canvas.focus();
  // Up arrow adds a block
  await page.keyboard.press('ArrowUp');
  await expect(page.locator('#scene-status')).toContainText('1 block');
  await page.keyboard.press('ArrowUp');
  await expect(page.locator('#scene-status')).toContainText('2 blocks');
  // Down arrow removes a block
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#scene-status')).toContainText('1 block');
});

test('blocks room: the explanation dialog opens', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'blocks');
  await page.locator('#scene-why').click();
  await expect(page.locator('#insight-dialog')).toBeVisible();
  await expect(page.locator('#insight-dialog')).toContainText('harmonic series');
  await page.locator('#insight-close').click();
  await expect(page.locator('#insight-dialog')).not.toBeVisible();
});

test('blocks room: reduced motion — still renders a picture', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await openRoom(page, 'blocks');
  await expect.poll(() => inkedPixels(page, '#scene-canvas')).toBeGreaterThan(50);
});

// Every block (and the table) is a rounded rectangle on the stage canvas. Records how far they reach, as fractions of
// the canvas, from the next frame on.
async function recordBlocks(page) {
  await page.addInitScript(() => {
    const original = CanvasRenderingContext2D.prototype.roundRect;
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w) {
      if (this.canvas.id === 'scene-canvas' && window.__drawn) {
        const m = this.getTransform(); // the stage scales by the device's pixel ratio
        const d = window.__drawn;
        d.top = Math.min(d.top, (m.d * y + m.f) / this.canvas.height);
        d.left = Math.min(d.left, (m.a * x + m.e) / this.canvas.width);
        d.right = Math.max(d.right, (m.a * (x + w) + m.e) / this.canvas.width);
      }
      return original.apply(this, arguments);
    };
  });
}
async function drawn(page) {
  await page.evaluate(() => (window.__drawn = { top: Infinity, left: Infinity, right: -Infinity }));
  await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));
  return page.evaluate(() => window.__drawn);
}

// The Blocks slider once did nothing: the status stayed at 4 blocks and the slider snapped back (#173).
test('blocks room: the Blocks slider rebuilds the stack, by keyboard and by pointer', async ({ page }) => {
  await recordBlocks(page);
  await page.goto('/');
  await openRoom(page, 'blocks');
  const status = page.locator('#scene-status');
  const slider = page.locator('#c-blocks');
  const opening = await drawn(page);

  await slider.focus();
  for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowRight');
  await expect(status).toHaveText('7 blocks · 1.30 block-lengths out'); // the best stack of 7: ½(1 + ½ + … + 1/7)
  await expect(slider).toHaveValue('7');
  await expect(page.locator('#v-blocks')).toHaveText('7');
  expect((await drawn(page)).top, 'a taller stack is drawn').toBeLessThan(opening.top);
  await page.keyboard.press('End');
  await expect(status).toHaveText('50 blocks · 2.25 block-lengths out');
  await page.keyboard.press('Home');
  await expect(status).toHaveText('0 blocks · 0.00 block-lengths out');

  // A click along the track, then a drag back down it.
  const box = await slider.boundingBox();
  const y = box.y + box.height / 2;
  await page.mouse.click(box.x + box.width * 0.6, y);
  const clicked = Number(await slider.inputValue());
  expect(clicked).toBeGreaterThan(20);
  await expect(status).toContainText(`${clicked} blocks ·`);
  await page.mouse.move(box.x + box.width * 0.6, y);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.2, y, { steps: 6 });
  await page.mouse.up();
  const dragged = Number(await slider.inputValue());
  expect(dragged).toBeLessThan(clicked);
  await expect(status).toContainText(`${dragged} blocks ·`);
});

// The tallest stacks once ran off the top of the picture: blocks never got thinner than 16 px (#173).
test('blocks room: the whole stack stays in the picture, up to 50 blocks, on a laptop and a phone', async ({
  page,
}) => {
  await recordBlocks(page);
  for (const [width, height] of [
    [1280, 900],
    [1024, 768],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto('about:blank');
    await page.goto('/#room=blocks');
    const where = `${width} × ${height}`;
    for (const [name, show] of [
      ['opening stack', async () => {}],
      ['31-block preset', () => page.getByRole('button', { name: /31 blocks/ }).click()],
      ['50 blocks', () => setRange(page, '#c-blocks', 50)],
    ]) {
      await show();
      const d = await drawn(page);
      expect(d.top, `${where}, ${name}: top block`).toBeGreaterThanOrEqual(0);
      expect(d.left, `${where}, ${name}: left`).toBeGreaterThanOrEqual(0);
      expect(d.right, `${where}, ${name}: right`).toBeLessThanOrEqual(1.0001);
    }
    await expect(page.locator('#scene-status')).toHaveText('50 blocks · 2.25 block-lengths out');
  }
});

test('blocks room: a shared link opens the best stack of its number of blocks', async ({ page }) => {
  await page.goto('/#room=blocks&blocks=31');
  await expect(page.locator('#scene-status')).toHaveText('31 blocks · 2.01 block-lengths out');
  await expect(page.locator('#c-blocks')).toHaveValue('31');
});

test('blocks room: nudging blocks leaves the presets as they were', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'blocks');
  const status = page.locator('#scene-status');
  await page.getByRole('button', { name: /31 blocks/ }).click();
  await page.locator('#scene-canvas').focus();
  for (let i = 0; i < 10; i++) await page.keyboard.press('ArrowLeft'); // the top block, 0.02 lengths at a time
  await expect(status).toHaveText('31 blocks · 1.81 block-lengths out');
  await page.getByRole('button', { name: /4 blocks/ }).click();
  await page.getByRole('button', { name: /31 blocks/ }).click();
  await expect(status).toHaveText('31 blocks · 2.01 block-lengths out');
});
