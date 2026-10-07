import { test, expect, setRange } from './helpers.js';

const settings = (page) => page.evaluate(() => ({ ...globalThis.Wonderlattice.stage.settingsFor('dragon') }));

/** How many of the picture's pixels are not the dark background. */
const drawn = (page) =>
  page.locator('#scene-canvas').evaluate((canvas) => {
    const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    let count = 0;
    for (let i = 0; i < data.length; i += 4) if (data[i] + data[i + 1] + data[i + 2] > 120) count++;
    return count / (data.length / 4);
  });

// The show (ten folds, then opening) is 7.6 seconds of the room's own time. A frame counts for at most 35 ms of it, so
// on a busy machine drawing few frames a second it takes longer: the waits below allow for that.
const SHOW = { timeout: 60000 };

test('without a click, the strip folds and then opens into a dragon that never crosses itself', async ({ page }) => {
  test.slow();
  await page.goto('/#room=dragon');
  await expect(page.locator('body')).toHaveAttribute('data-room', 'dragon');
  await expect(page.locator('#scene-name')).toHaveText('Folding');
  await expect(page.locator('#scene-status')).toContainText('layers');
  await expect(page.locator('#scene-name')).toHaveText('The dragon', SHOW);
  await expect(page.locator('#scene-status')).toHaveText(/^10 folds · 1,024 pieces · never crosses itself$/);
  expect(await drawn(page)).toBeGreaterThan(0.04);
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the dragon is there at once, and each fold doubles it, up to fourteen and back to one', async ({ page }) => {
    await page.goto('/#room=dragon');
    await expect(page.locator('#scene-name')).toHaveText('The dragon');
    expect(await drawn(page)).toBeGreaterThan(0.04);
    await page.locator('#scene-action').click();
    await expect(page.locator('#scene-status')).toHaveText('11 folds · 2,048 pieces · never crosses itself');
    expect((await settings(page)).folds).toBe(11);
    await expect(page.locator('#v-folds')).toHaveText('11');
    for (let i = 0; i < 3; i++) await page.locator('#scene-action').click();
    await expect(page.locator('#scene-status')).toHaveText('14 folds · 16,384 pieces · never crosses itself');
    await page.locator('#scene-action').click();
    await expect(page.locator('#scene-status')).toHaveText('1 fold · 2 pieces · never crosses itself');
  });

  test('four dragons turned about one point fill the middle; other crease angles make no promise', async ({ page }) => {
    await page.goto('/#room=dragon');
    const one = await drawn(page);
    await page.locator('[data-check="four"]').check();
    await expect(page.locator('#scene-name')).toHaveText('Four dragons');
    await expect(page.locator('#scene-status')).toHaveText('10 folds each · no overlaps, no gaps in the middle');
    expect(await drawn(page)).not.toBeCloseTo(one, 3);
    await setRange(page, '#c-angle', 120);
    await expect(page.locator('#scene-status')).toHaveText('Creases at 120° · at 90° it never crosses');
    await expect(page.locator('#v-angle')).toHaveText('120°');
  });

  test('the presets, and a shared link that brings back the same strip', async ({ page }) => {
    await page.goto('/#room=dragon');
    await page.locator('.scene-preset').nth(2).click();
    await expect(page.locator('#scene-status')).toHaveText('4 folds · 16 pieces · never crosses itself');
    await page.locator('.scene-preset').nth(1).click();
    await expect(page.locator('#scene-status')).toHaveText('9 folds each · no overlaps, no gaps in the middle');
    await setRange(page, '#c-folds', 6);
    await setRange(page, '#c-angle', 100);
    const before = await settings(page);
    const link = await page.evaluate(
      (s) => globalThis.Wonderlattice.shareLink(new URLSearchParams({ room: 'dragon', ...s })),
      before,
    );
    await page.goto('about:blank');
    await page.goto(link);
    await expect(page.locator('body')).toHaveAttribute('data-room', 'dragon');
    expect(await settings(page)).toEqual({ folds: 6, angle: 100, four: true });
    await expect(page.locator('#scene-status')).toHaveText('Creases at 100° · at 90° it never crosses');
  });
});

test('Pause stops the folding where it is, and Play carries on', async ({ page }) => {
  test.slow();
  await page.goto('/#room=dragon');
  await expect(page.locator('#scene-name')).toHaveText('Folding');
  await page.locator('#scene-play').click();
  const status = await page.locator('#scene-status').textContent();
  await page.waitForTimeout(1200);
  await expect(page.locator('#scene-status')).toHaveText(status);
  await page.locator('#scene-play').click();
  await expect(page.locator('#scene-name')).toHaveText('The dragon', SHOW);
});
