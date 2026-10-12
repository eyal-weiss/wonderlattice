import { test, expect, openRoom, setRange, tool } from './helpers.js';

const scene = (page) => page.locator('#scene-name');
const status = (page) => page.locator('#scene-status');

test('rhythm room: opens on the tresillo, moving, with the sound off', async ({ page }) => {
  await page.goto('/#room=rhythm');
  await expect(scene(page)).toHaveText('Tresillo · Cuba');
  await expect(status(page)).toHaveText('3 beats in 8 steps');
  await expect(page.locator('#scene-action')).toHaveText('Turn sound on');
  expect((await tool(page, 'read_exploration')).soundOn).toBe(false);
  // The hand goes round by itself, without a click.
  const canvas = page.locator('#scene-canvas');
  const first = await canvas.screenshot();
  await page.waitForTimeout(400);
  expect(first.equals(await canvas.screenshot())).toBe(false);
});

test('rhythm room: more beats, more steps, and the beats never outnumber the steps', async ({ page }) => {
  await page.goto('/#room=rhythm');
  await setRange(page, '#c-beats', 5);
  await expect(scene(page)).toHaveText('Cinquillo · Cuba');
  await expect(status(page)).toHaveText('5 beats in 8 steps');
  await setRange(page, '#c-steps', 13);
  await expect(scene(page)).toHaveText('An even spread');
  await expect(status(page)).toHaveText('5 beats in 13 steps');
  await setRange(page, '#c-steps', 4);
  await expect(status(page)).toHaveText('4 beats in 4 steps');
  await expect(page.locator('#c-beats')).toHaveAttribute('max', '4');
  await expect(page.locator('#v-beats')).toHaveText('4');
  await expect(page.locator('#c-start')).toHaveAttribute('max', '3');
  await setRange(page, '#c-beats', 1);
  await expect(status(page)).toHaveText('1 beat in 4 steps');
});

test('rhythm room: a link asking for more beats than steps gets as many as there are steps', async ({ page }) => {
  await page.goto('/#room=rhythm&steps=8&beats=12&start=3');
  await expect(status(page)).toHaveText('8 beats in 8 steps');
  await expect(page.locator('#v-beats')).toHaveText('8');
  await expect(page.locator('#v-start')).toHaveText('3');
});

test('rhythm room: sound is opt-in, and stops on pausing and on leaving', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'rhythm');
  await page.locator('#scene-action').click();
  await expect(page.locator('#scene-action')).toHaveText('Sound on · mute');
  expect((await tool(page, 'read_exploration')).soundOn).toBe(true);
  // Changes while it plays: another preset, another speed.
  await page.getByRole('button', { name: /Bossa nova/ }).click();
  await setRange(page, '#c-speed', 3);
  expect((await tool(page, 'read_exploration')).soundOn).toBe(true);
  await page.locator('#scene-play').click();
  expect((await tool(page, 'read_exploration')).soundOn).toBe(false);
  await expect(page.locator('#scene-action')).toHaveText('Turn sound on');
  await page.locator('#scene-play').click();
  await page.locator('#scene-action').click();
  expect((await tool(page, 'read_exploration')).soundOn).toBe(true);
  await openRoom(page, 'flock');
  expect((await tool(page, 'read_exploration')).soundOn).toBe(false);
  await openRoom(page, 'rhythm');
  await expect(page.locator('#scene-action')).toHaveText('Turn sound on');
});

test('rhythm room: three rings, each changed on its own', async ({ page }) => {
  await page.goto('/#room=rhythm');
  await page.getByRole('button', { name: /West African bell/ }).click();
  await expect(scene(page)).toHaveText('Bell pattern · West Africa');
  await expect(status(page)).toHaveText('7 beats in 12 steps');
  const change = page.getByRole('group', { name: 'Change' });
  await expect(change.getByRole('button')).toHaveCount(3);
  await change.getByRole('button', { name: 'Inner' }).click();
  await expect(change.getByRole('button', { name: 'Inner' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#v-beatsc')).toHaveText('3');
  await setRange(page, '#c-beatsc', 5);
  expect((await tool(page, 'read_exploration')).settings.beatsc).toBe(5);
  // The outer ring, and so the name, stay as they were.
  await expect(scene(page)).toHaveText('Bell pattern · West Africa');
  await page.getByRole('group', { name: 'Rings' }).getByRole('button', { name: 'One' }).click();
  await expect(page.getByRole('group', { name: 'Change' })).toHaveCount(0);
  await expect(page.locator('#c-steps')).toBeVisible();
});

test('rhythm room: arrow keys on the picture play the named rhythms in turn', async ({ page }) => {
  await page.goto('/#room=rhythm');
  await expect(page.locator('#scene-canvas')).toHaveAttribute('role', 'application');
  await page.locator('#scene-canvas').focus();
  await page.keyboard.press('ArrowRight');
  await expect(scene(page)).toHaveText('Cinquillo · Cuba');
  await page.keyboard.press('ArrowRight');
  await expect(scene(page)).toHaveText('Bossa nova · Brazil');
  // Bossa nova starts its 5 in 16 on the third beat (Toussaint).
  await expect(page.locator('#v-start')).toHaveText('6');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await expect(scene(page)).toHaveText('Tresillo · Cuba');
});

test('rhythm room: the explanation works through the outer ring’s own numbers', async ({ page }) => {
  await page.goto('/#room=rhythm');
  await page.locator('#scene-why').click();
  const rounds = page.locator('#rhythm-rounds');
  await expect(rounds).toContainText('Spreading 3 beats over 8 steps, round by round:');
  await expect(rounds).toContainText('[x··] [x··] [x·]');
  await expect(rounds).toContainText('8 = 2 × 3 + 2');
  await expect(rounds).toContainText('2 = 2 × 1 + 0');
  // One beat is a beat, not “1 beats”.
  await page.keyboard.press('Escape');
  await page.goto('/#room=rhythm&steps=5&beats=1');
  await expect(status(page)).toHaveText('1 beat in 5 steps');
  await page.locator('#scene-why').click();
  await expect(rounds).toContainText('Spreading 1 beat over 5 steps, round by round:');
});

test('rhythm room: with reduced motion the picture holds still, the beats already spread', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=rhythm');
  await expect(scene(page)).toHaveText('Tresillo · Cuba');
  const canvas = page.locator('#scene-canvas');
  const first = await canvas.screenshot();
  await page.waitForTimeout(400);
  expect(first.equals(await canvas.screenshot())).toBe(true);
});

// Where the picture is about as tall as it is wide, the circle sits above the rows; with three rings the last row
// of boxes once ran past the bottom edge (#165). The lowest box drawn must end inside the canvas.
test('rhythm room: with three rings, the last row of boxes stays inside a squarish picture', async ({ page }) => {
  await page.addInitScript(() => {
    window.__lowest = 0;
    for (const name of ['fillRect', 'strokeRect']) {
      const original = CanvasRenderingContext2D.prototype[name];
      CanvasRenderingContext2D.prototype[name] = function (x, y, w, h) {
        if (this.canvas.id === 'scene-canvas') {
          const m = this.getTransform();
          window.__lowest = Math.max(window.__lowest, (m.b * x + m.d * (y + h) + m.f) / this.canvas.height);
        }
        return original.apply(this, arguments);
      };
    }
  });
  for (const [width, height] of [
    [1100, 1000],
    [1200, 1000],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto('about:blank');
    await page.goto('/#room=rhythm');
    await page.locator('.scene-preset').nth(2).click(); // the West African bell: three rings
    await page.evaluate(() => (window.__lowest = 0));
    await page.waitForTimeout(400);
    expect(await page.evaluate(() => window.__lowest), `${width} × ${height}`).toBeLessThanOrEqual(1.0001);
  }
});
