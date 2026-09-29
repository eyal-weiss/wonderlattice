import { test, expect } from './helpers.js';

// On a phone, a room shows its title, one plain line and the picture first, and the panel puts the room's own
// controls before the extras (keeping a moment, the visitor).
test('on a phone the picture comes early and the controls come before the extras', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#room=treasure');
  const top = (selector) =>
    page
      .locator(selector)
      .first()
      .evaluate((e) => e.getBoundingClientRect().top + scrollY);
  // The picture starts in the top half of the first screen.
  expect(await top('#scene-canvas')).toBeLessThan(844 / 2);
  // The small caps label above the picture is still there for screen readers, but takes no room.
  await expect(page.locator('#scene-label')).not.toBeEmpty();
  expect(await page.locator('#scene-label').evaluate((e) => e.getBoundingClientRect().height)).toBeLessThanOrEqual(1);
  // The room's first control comes before "Keep this moment", which comes before the visitor card.
  const control = await top('#scene-controls .control');
  const keep = await top('#scene-controls .trail-keep');
  const guest = await top('#scene-controls .math-guest');
  expect(control).toBeLessThan(keep);
  expect(keep).toBeLessThan(guest);
});

test('on a wide screen the panel keeps its order and the label is shown', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/#room=treasure');
  await expect(page.locator('#scene-label')).toBeVisible();
  const top = (selector) =>
    page
      .locator(selector)
      .first()
      .evaluate((e) => e.getBoundingClientRect().top);
  expect(await top('#scene-controls .math-guest')).toBeLessThan(await top('#scene-controls .control'));
});
