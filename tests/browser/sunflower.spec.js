import { test, expect } from './helpers.js';

const status = (page) => page.locator('#scene-status');
const turn = (page) => page.locator('#v-angle');
const arms = (page) => page.locator('[data-check="arms"]');

test('sunflower: a head grows at the golden angle, falls apart a tenth of a degree away, then counts its arms', async ({
  page,
}) => {
  test.slow(); // the opening takes about twenty seconds on a busy machine
  await page.goto('/#room=sunflower');
  await expect(page.locator('#scene-name')).toHaveText('The flower head');
  await expect(status(page)).toHaveText(/^Growing: \d+ seeds$/);
  await expect(turn(page)).toHaveText('137.508°');
  // Without a click, the dial turns by itself: gaps open at 137.6°, eight spokes at three eighths of a turn…
  await expect(status(page)).toHaveText('Gaps open between 34 curved arms', { timeout: 20000 });
  await expect(turn(page)).toHaveText('137.6°');
  await expect(status(page)).toHaveText('8 straight spokes', { timeout: 20000 });
  await expect(turn(page)).toHaveText('135°');
  // …and back to the sunflower, whose arms are counted: two neighbouring Fibonacci numbers.
  await expect(status(page)).toHaveText('Packed tight: 55 arms one way, 89 the other', { timeout: 20000 });
  await expect(turn(page)).toHaveText('137.508°');
  await expect(arms(page)).toBeChecked();
  await expect(page.locator('#announcer')).toHaveText('Packed tight: 55 arms one way, 89 the other');
});

test('sunflower: nudging the turn by a hundredth of a degree bends straight spokes into arms', async ({ page }) => {
  await page.goto('/#room=sunflower&angle=135');
  await expect(status(page)).toHaveText('8 straight spokes');
  await page.getByRole('button', { name: '0.01° more' }).click();
  await expect(turn(page)).toHaveText('135.01°');
  await expect(status(page)).toHaveText('Gaps open between 8 curved arms');
  await expect(page.locator('#announcer')).toHaveText('Gaps open between 8 curved arms');
  await page.getByRole('button', { name: '0.01° less' }).click();
  await page.getByRole('button', { name: '0.1° less' }).click();
  await expect(turn(page)).toHaveText('134.9°');
  // A link opens on its own turn: the opening doesn't play over it.
  await page.waitForTimeout(2500);
  await expect(turn(page)).toHaveText('134.9°');
});

test('sunflower: tapping the flower counts its arms there, fewer near the middle', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=sunflower');
  await expect(status(page)).toHaveText('Packed tight: 55 arms one way, 89 the other');
  await expect(arms(page)).not.toBeChecked();
  const canvas = page.locator('#scene-canvas');
  await canvas.evaluate((el) => el.scrollIntoView({ block: 'start' }));
  // The flower's centre, from the room's own layout: a column of words on the left, the head beside it.
  const box = await canvas.boundingBox();
  const column = Math.min(box.width * 0.3, Math.max(72, box.width - box.height * 1.02));
  const pad = Math.max(8, Math.min(box.width, box.height) * 0.025);
  const outer = Math.min(box.height * 0.47 - pad / 2, (box.width - column) / 2 - pad);
  const cx = column + (box.width - column) / 2,
    cy = box.height * 0.485;
  await canvas.click({ position: { x: cx + (outer / 1.17) * 0.3, y: cy } });
  await expect(arms(page)).toBeChecked();
  await expect(status(page)).toHaveText('Packed tight: 21 arms one way, 34 the other');
  await expect(page.locator('#announcer')).toHaveText('Packed tight: 21 arms one way, 34 the other');
  // A tap outside the flower does nothing.
  await canvas.click({ position: { x: 4, y: box.height - 4 } });
  await expect(status(page)).toHaveText('Packed tight: 21 arms one way, 34 the other');
});

test('sunflower: the arrow keys turn the dial, and Start again goes back to the golden angle', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=sunflower&angle=90');
  await expect(status(page)).toHaveText('4 straight spokes');
  await page.locator('#scene-canvas').focus();
  await page.keyboard.press('ArrowRight');
  await expect(turn(page)).toHaveText('90.01°');
  await page.keyboard.press('ArrowUp');
  await expect(turn(page)).toHaveText('90.11°');
  await expect(page.locator('#c-angle')).toHaveValue('90.11');
  await page.locator('#scene-reset').click();
  await expect(turn(page)).toHaveText('137.508°');
  await expect(status(page)).toHaveText('Packed tight: 55 arms one way, 89 the other');
  await expect(page.locator('#scene-presets .scene-preset').first()).toHaveAttribute('aria-pressed', 'true');
});
