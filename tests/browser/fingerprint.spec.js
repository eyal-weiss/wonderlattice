import { test, expect, openRoom, tool, inkedPixels } from './helpers.js';

/** A cheap fingerprint of the canvas, to tell whether the picture changed. */
const snapshot = (page) =>
  page.locator('#scene-canvas').evaluate((canvas) => {
    const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    let sum = 0;
    for (let i = 0; i < data.length; i += 28) sum = (sum * 31 + data[i]) % 1000000007;
    return sum;
  });

const settings = async (page) => (await tool(page, 'read_exploration')).settings;

test('opens from its card and starts growing ridges right away', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'fingerprint');
  await expect(page.locator('#room-title')).toHaveText('Grow a fingerprint.');
  await expect(page.locator('#scene-name')).toHaveText('A whorl');
  await expect(page.locator('#scene-play')).toHaveText('Pause');
  await expect(page.locator('#scene-status')).toContainText('Growing');
  await expect.poll(() => inkedPixels(page, '#scene-canvas')).toBeGreaterThan(500);
  const before = await snapshot(page);
  await expect.poll(() => snapshot(page), { timeout: 10000 }).not.toBe(before);
  // The ridges keep spreading: the covered share of the fingertip goes up.
  const share = async () => Number((await page.locator('#scene-status').textContent()).match(/(\d+)%/)?.[1] ?? 100);
  const first = await share();
  await expect.poll(share, { timeout: 20000 }).toBeGreaterThan(first);
  await page.locator('#scene-why').click();
  await expect(page.locator('#insight-dialog')).toContainText('Turing');
  await expect(page.locator('#insight-dialog')).toContainText('not a simulation of real embryonic skin');
  await page.locator('#insight-close').click();
});

test('presets switch the pattern, and "Grow again" grows a twin', async ({ page }) => {
  await page.goto('/#room=fingerprint');
  await expect(page.locator('#scene-presets .scene-preset')).toHaveCount(4);
  await page.getByRole('button', { name: /Loop/ }).click();
  await expect(page.locator('#scene-name')).toHaveText('A loop');
  expect(await settings(page)).toMatchObject({ pattern: 1, lead: 3 });
  await page.getByRole('button', { name: /Arch/ }).click();
  await expect(page.locator('#scene-name')).toHaveText('An arch');
  expect(await settings(page)).toMatchObject({ pattern: 2, lead: 13 });
  await expect(page.locator('#v-lead')).toHaveText('13 ridges');
  await page.locator('#scene-action').click();
  expect((await settings(page)).twin).toBe(1);
  await expect(page.locator('.scene-preset[aria-pressed="true"]')).toHaveText(/Arch/);
  // Wider ridge spacing means fewer ridges across.
  const across = await page.locator('#v-spacing').textContent();
  await page.locator('#c-spacing').evaluate((input) => {
    input.value = '1';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(page.locator('#v-spacing')).not.toHaveText(across);
  await page.locator('#fingerprint-look').selectOption('1');
  expect((await settings(page)).look).toBe(1);
});

test('a click or Enter starts ridges at a point of your own', async ({ page }) => {
  await page.goto('/#room=fingerprint');
  await page.getByRole('button', { name: /Your own/ }).click();
  await expect(page.locator('#scene-status')).toHaveText('Tap the fingertip to start ridges');
  const canvas = page.locator('#scene-canvas');
  const blank = await snapshot(page);
  const box = await canvas.boundingBox();
  await canvas.click({ position: { x: box.width * 0.3, y: box.height * 0.5 } });
  await expect(page.locator('#scene-status')).toContainText('Growing');
  const s = await settings(page);
  expect(s.ax).toBeGreaterThan(0);
  expect(s.ay).toBeGreaterThan(0);
  expect(s.at).toBe(0);
  await expect.poll(() => snapshot(page)).not.toBe(blank);
  // The keyboard can plant too: arrows aim, Enter plants.
  await canvas.focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect.poll(async () => (await settings(page)).bx).toBeGreaterThan(0.5);
  // A click during a preset adds to it.
  await page.getByRole('button', { name: /Whorl/ }).click();
  expect((await settings(page)).ax).toBe(-1);
  await canvas.click({ position: { x: box.width * 0.3, y: box.height * 0.35 } });
  await expect(page.locator('#scene-name')).toHaveText('Your own mix');
  await expect(page.locator('.scene-preset[aria-pressed="true"]')).toHaveCount(0);
});

test('with reduced motion, a finished fingerprint appears without animating', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=fingerprint');
  await expect(page.locator('#scene-play')).toHaveText('Play');
  await expect(page.locator('#scene-status')).toHaveText('A whorl · 2 triradii', { timeout: 60000 });
  await expect.poll(() => inkedPixels(page, '#scene-canvas')).toBeGreaterThan(2000);
  const still = await snapshot(page);
  await page.waitForTimeout(500);
  expect(await snapshot(page)).toBe(still);
  await page.getByRole('button', { name: /Loop/ }).click();
  await expect(page.locator('#scene-status')).toHaveText('A loop · 1 triradius', { timeout: 60000 });
});

test('a shared link restores the pattern, the look, and your own points', async ({ page }) => {
  await page.goto('/#room=fingerprint&pattern=1&lead=5&spacing=0.7&look=1&marks=false&twin=3&ax=0.5&ay=0.4&at=120');
  await expect(page.locator('#scene-name')).toHaveText('Your own mix');
  await expect(page.locator('#v-lead')).toHaveText('5 ridges');
  await expect(page.locator('#fingerprint-look')).toHaveValue('1');
  await expect(page.locator('[data-check="marks"]')).not.toBeChecked();
  expect(await settings(page)).toMatchObject({ pattern: 1, lead: 5, spacing: 0.7, twin: 3, ax: 0.5, ay: 0.4, at: 120 });
  // Out-of-range values are ignored.
  await page.evaluate(() => (location.hash = 'room=fingerprint&pattern=9&lead=40&look=2'));
  await expect(page.locator('#fingerprint-look')).toHaveValue('2');
  expect(await settings(page)).toMatchObject({ pattern: 1, lead: 5, look: 2 });
  // Sharing writes a link that includes the points.
  await page.locator('#scene-share').click();
  const link = await page.evaluate(() => window.__clipboard.at(-1));
  expect(link).toContain('room=fingerprint');
  expect(link).toContain('ax=0.5');
  expect(link).toContain('twin=3');
});
