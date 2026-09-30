import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import jsQR from 'jsqr';
import { test, expect, openRoom, expectRoom } from './helpers.js';

// The classroom kit (#115): a big-screen view for a projector, and a QR code that sends a room to students' phones.

test('the big screen fills a projector with the picture, magnified, and Escape leaves it', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/#room=dice');
  await expectRoom(page, 'dice');
  await page.locator('#scene-focus').click();
  await expect(page.locator('body')).toHaveClass(/focus-mode/);
  await expect(page.locator('header')).toBeHidden();
  await expect(page.locator('#scene-controls')).toBeHidden();
  await expect(page.locator('#scene-focus')).toHaveAttribute('aria-label', 'Leave the big screen');
  // The room lays out as on a laptop, about 1,200 pixels wide, and everything is drawn larger.
  const size = await page.evaluate(() => ({
    shown: document.getElementById('scene-canvas').getBoundingClientRect().width,
    laidOut: globalThis.Wonderlattice.stage.width,
  }));
  expect(size.shown).toBeGreaterThan(1700);
  expect(size.shown / size.laidOut).toBeCloseTo(size.shown / 1200, 1);
  await page.keyboard.press('Escape');
  await expect(page.locator('body')).not.toHaveClass(/focus-mode/);
  await expect(page.locator('#scene-controls')).toBeVisible();
  await expect(page.locator('#scene-focus')).toHaveAttribute('aria-label', 'Show on a big screen');
  expect(await page.evaluate(() => globalThis.Wonderlattice.stage.width)).toBeGreaterThan(size.laidOut * 0.5);
});

test('leaving a room leaves the big screen too, and the drawing room has it as its focus view', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'waves');
  await page.locator('#scene-focus').click();
  await expect(page.locator('body')).toHaveClass(/focus-mode/);
  await page.goBack();
  await expectRoom(page, 'home');
  await expect(page.locator('body')).not.toHaveClass(/focus-mode/);
  await openRoom(page, 'motion');
  await page.locator('#focus').click();
  await expect(page.locator('body')).toHaveClass(/focus-mode/);
  await expect(page.locator('header')).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(page.locator('body')).not.toHaveClass(/focus-mode/);
});

test('"Send to phones" shows a QR code that opens this room with its settings', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/#room=shower&mode=1&pipe=4');
  await page.locator('#scene-send').click();
  await expect(page.locator('#send-dialog')).toBeVisible();
  await expect(page.locator('#send-code svg')).toBeVisible();
  const link = await page.locator('#send-link').textContent();
  expect(link).toContain('room=shower');
  expect(link).toContain('pipe=4');
  // Read the code back the way a phone would: from the picture the page drew.
  const pixels = await page.evaluate(async () => {
    const svg = new XMLSerializer().serializeToString(document.querySelector('#send-code svg'));
    const image = new Image();
    image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    await image.decode();
    const canvas = Object.assign(document.createElement('canvas'), { width: 400, height: 400 });
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, 400, 400);
    return Array.from(ctx.getImageData(0, 0, 400, 400).data);
  });
  expect(jsQR(Uint8ClampedArray.from(pixels), 400, 400)?.data).toBe(link);
  await page.locator('#send-dialog .close').click();
  await expect(page.locator('#send-dialog')).toBeHidden();
  // The drawing room sends its pattern the same way.
  await openRoom(page, 'motion');
  await page.locator('#send').click();
  await expect(page.locator('#send-link')).toContainText('room=motion');
});

test('"Send to phones" is only on the web, and not on a phone', async ({ page }) => {
  await page.goto(pathToFileURL(resolve(process.env.SERVE_DIR || '.', 'index.html')).href + '#room=dice');
  await expectRoom(page, 'dice');
  await expect(page.locator('#scene-send')).toBeHidden();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#room=dice');
  await expect(page.locator('#scene-send')).toBeHidden();
  await expect(page.locator('#scene-focus')).toBeVisible();
});
