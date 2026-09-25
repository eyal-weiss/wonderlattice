import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { test, expect, ROOMS, openRoom } from './helpers.js';

const standalone = resolve('dist/wonderlattice-standalone.html');

test('the single-file export works from disk with portraits embedded', async ({ page }) => {
  test.skip(!existsSync(standalone), 'Run npm run build first');
  await page.goto(pathToFileURL(standalone).href);
  await expect(page.locator('.room-card')).toHaveCount(Object.keys(ROOMS).length);
  await openRoom(page, 'motion');
  await expect(page.locator('#math-guest-motion img')).toHaveAttribute('src', /^data:image\//);
  await expect
    .poll(() => page.locator('#math-guest-motion img').evaluate((img) => img.complete && img.naturalWidth))
    .toBeGreaterThan(0);
  await openRoom(page, 'traffic');
  await page.locator('#scene-action').click();
  await expect(page.locator('#traffic-result')).toContainText('15 minutes slower');
});
