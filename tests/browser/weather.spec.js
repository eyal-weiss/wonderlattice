import { test, expect } from './helpers.js';

// With reduced motion the room opens on a forecast already run for 24 days, so the result is there at once.
test.use({ reducedMotion: 'reduce' });

test('weather room: a start measured to 3 places is lost within days; 12 places still holds', async ({ page }) => {
  await page.goto('/#room=weather&digits=3');
  await expect(page.locator('#scene-status')).toHaveText(/The forecast held for (\d) days/);
  const three = Number((await page.locator('#weather-held').textContent()).match(/\d+/)[0]);
  expect(three).toBeLessThan(12);

  await page.goto('/#room=weather&digits=12');
  await expect(page.locator('#scene-status')).toContainText('still together');
  await expect(page.locator('#weather-held')).toHaveText('still holding');
  // The rule of thumb the room states: each extra place buys about two and a half days.
  await expect(page.locator('#weather-readout')).toContainText('2.5 days');
});

test('weather room: releasing again gives new twins, from the keyboard too', async ({ page }) => {
  await page.goto('/#room=weather&digits=3');
  await expect(page.locator('#scene-status')).toContainText('held for');
  await page.locator('#scene-action').click();
  await expect(page.locator('#scene-status')).toContainText('held for');
  await page.locator('#scene-canvas').focus();
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Enter');
  await expect(page.locator('#scene-canvas')).toBeFocused();
});
