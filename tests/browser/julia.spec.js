import { test, expect, ROOMS, openRoom, setRange } from './helpers.js';

/** How many pixels of the big picture are brighter than the dark background: the landscape is drawn. */
function litPixels(page) {
  return page.locator('#scene-canvas').evaluate((canvas) => {
    const ctx = canvas.getContext('2d');
    const w = Math.floor(canvas.width * 0.4),
      h = Math.floor(canvas.height * 0.6);
    const data = ctx.getImageData(Math.floor(canvas.width * 0.05), Math.floor(canvas.height * 0.2), w, h).data;
    let lit = 0;
    for (let i = 0; i < data.length; i += 4) if (data[i] + data[i + 1] + data[i + 2] > 150) lit++;
    return lit;
  });
}

test('julia room: seeds inside the map give one piece, seeds outside give dust', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'julia');
  await expect(page.locator('#room-title')).toHaveText(ROOMS.julia);
  await expect.poll(() => litPixels(page)).toBeGreaterThan(200);
  await page.getByRole('button', { name: /Dust/ }).click();
  await expect(page.locator('#scene-status')).toHaveText('Seed outside the map: dust');
  await expect(page.locator('#julia-readout')).toContainText('falls apart into specks');
  await page.getByRole('button', { name: /Rabbit/ }).click();
  await expect(page.locator('#scene-status')).toHaveText('Seed inside the map: one piece');
  await expect(page.locator('#scene-name')).toHaveText('Rabbit');
  // The seed can be moved from the panel too: far to the right is outside the map.
  await setRange(page, '#c-cx', 0.6);
  await expect(page.locator('#scene-status')).toHaveText('Seed outside the map: dust');
  await expect(page.locator('#scene-name')).toHaveText('Your own landscape');
});

test('julia room: arrow keys move the seed, and a tap follows one point’s journey', async ({ page }) => {
  await page.goto('/#room=julia&cx=0&cy=0');
  await expect(page.locator('#scene-status')).toHaveText('Seed inside the map: one piece');
  const canvas = page.locator('#scene-canvas');
  await canvas.focus();
  for (let i = 0; i < 40; i++) await page.keyboard.press('ArrowRight'); // 0 → 0.4: out past the cusp at 0.25
  await expect(page.locator('#scene-status')).toHaveText('Seed outside the map: dust');
  await expect(page.locator('#c-cx')).toHaveValue('0.4');
  // Tap well outside the landscape: that point flies away.
  await page.getByRole('button', { name: /Rabbit/ }).click();
  await canvas.scrollIntoViewIfNeeded(); // the presets sit below the picture, so clicking one can scroll the page
  const box = await canvas.boundingBox();
  await page.mouse.click(box.x + box.width * 0.06, box.y + box.height * 0.5);
  await expect(page.locator('#julia-readout')).toContainText('flies away after');
  await expect(page.locator('[data-check="journey"]')).toBeChecked();
});

test('julia room: with reduced motion the seed stays put and the picture is still drawn', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=julia');
  await expect.poll(() => litPixels(page)).toBeGreaterThan(200);
  await expect(page.locator('#c-cx')).toHaveValue('-0.123');
  await page.waitForTimeout(600);
  await expect(page.locator('#c-cx')).toHaveValue('-0.123');
});

test('the map’s pictures stay sharp on a sharp (2×) screen', async ({ browser }) => {
  const context = await browser.newContext({ deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.goto('/');
  // Each picture holds at least two pixels for every point it is shown at, and the julia room's is drawn.
  const img = page.locator('#card-julia img');
  await img.scrollIntoViewIfNeeded();
  await expect.poll(() => img.evaluate((i) => i.complete && i.naturalWidth)).toBeGreaterThan(0);
  const { natural, shown } = await img.evaluate((i) => ({
    natural: i.naturalWidth,
    shown: i.getBoundingClientRect().width,
  }));
  expect(natural).toBeGreaterThanOrEqual(shown * 2);
  await context.close();
});
