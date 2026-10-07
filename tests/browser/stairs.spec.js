import { test, expect, openRoom, tool, setRange, inkedPixels } from './helpers.js';

const status = (page) => page.locator('#scene-status');

test('stairs room: the scale climbs by itself, and after twelve steps it is the same sound again', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'stairs');
  await expect(page.locator('#scene-name')).toHaveText('A scale that climbs forever');
  await expect.poll(() => inkedPixels(page, '#scene-canvas')).toBeGreaterThan(500);
  // No click needed: it climbs, and once past twelve steps the status names the step it sounds the same as.
  await expect(status(page)).toHaveText(/^\d+ steps? up/);
  await expect(status(page)).toHaveText(/^(1[2-9]|[2-9]\d) steps up · the same sound as (the start|step \d+)$/, {
    timeout: 12000,
  });
  const [, n, same] = (await status(page).textContent()).match(
    /^(\d+) steps up · the same sound as (?:the start|step (\d+))/,
  );
  expect(Number(same ?? 0)).toBe(Number(n) % 12);
});

test('stairs room: sound is opt-in, and stops when leaving', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'stairs');
  await expect(page.locator('#scene-action')).toHaveText('Turn sound on');
  expect((await tool(page, 'read_exploration')).soundOn).toBe(false);
  await page.locator('#scene-action').click();
  await expect(page.locator('#scene-action')).toHaveText('Sound on · mute');
  expect((await tool(page, 'read_exploration')).soundOn).toBe(true);
  await openRoom(page, 'waves');
  expect((await tool(page, 'read_exploration')).soundOn).toBe(false);
  await openRoom(page, 'stairs');
  await expect(page.locator('#scene-action')).toHaveText('Turn sound on');
  expect((await tool(page, 'read_exploration')).soundOn).toBe(false);
});

test('stairs room: the presets, gliding, and the trick taken away', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=stairs');
  await expect(status(page)).toHaveText('0 steps up');
  await page.getByRole('button', { name: /The endless slide/ }).click();
  await expect(page.locator('#stairs-mode-1')).toHaveAttribute('aria-pressed', 'true');
  await expect(status(page)).toHaveText('Rising smoothly');
  await expect(page.locator('#scene-name')).toHaveText('A slide that rises forever');
  await page.getByRole('button', { name: /Take the trick away/ }).click();
  await expect(page.locator('#scene-name')).toHaveText('The trick, taken away');
  await expect(page.locator('#v-bell')).toHaveText('1');
  await expect(page.locator('#stairs-mode-0')).toHaveAttribute('aria-pressed', 'true');
  // Widening the curve again brings the trick back.
  await setRange(page, '#c-bell', 6);
  await expect(page.locator('#scene-name')).toHaveText('A scale that climbs forever');
  await page.locator('#stairs-mode-1').click();
  await expect(page.locator('#scene-name')).toHaveText('A slide that rises forever');
});

test('stairs room: two notes half an octave apart, up or down, with no right answer', async ({ page }) => {
  await page.goto('/#room=stairs');
  await expect(page.locator('#stairs-up')).toBeDisabled();
  await page.locator('#stairs-play').click();
  await expect(status(page)).toHaveText('C, then F♯: up or down?');
  await expect(page.locator('#stairs-up')).toBeEnabled();
  await page.locator('#stairs-down').click();
  const words =
    'You heard C to F♯ go down. Other listeners hear the very same pair go up: on the circle the two notes are opposite, so up and down are equally far.';
  await expect(page.locator('#stairs-answer')).toHaveText(words);
  await expect(page.locator('#announcer')).toHaveText(words);
  await expect(page.locator('#stairs-down')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#stairs-up')).toBeDisabled();
  // Another pair starts somewhere else on the circle.
  await expect(page.locator('#stairs-play')).toHaveText('Play another pair');
  await page.locator('#stairs-play').click();
  await expect(status(page)).toHaveText('F, then B: up or down?');
  await expect(page.locator('#stairs-up')).toBeEnabled();
  // Start again puts the scale back at the bottom step.
  await page.locator('#scene-reset').click();
  await expect(status(page)).toHaveText(/^\d steps? up$/);
});

test('stairs room: with reduced motion the picture stays still, and sound on still climbs', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=stairs');
  await page.waitForTimeout(800);
  await expect(status(page)).toHaveText('0 steps up');
  expect((await tool(page, 'read_exploration')).playing).toBe(false);
  await page.locator('#scene-action').click();
  await expect(page.locator('#scene-action')).toHaveText('Sound on · mute');
  await expect(status(page)).not.toHaveText('0 steps up', { timeout: 5000 });
  expect((await tool(page, 'read_exploration')).playing).toBe(false);
  await page.locator('#scene-action').click();
  await expect(page.locator('#scene-action')).toHaveText('Turn sound on');
});

test('stairs room: a shared link keeps its settings, and ignores values out of range', async ({ page }) => {
  await page.goto('/#room=stairs&mode=1&bell=3&speed=2&volume=10');
  await expect(page.locator('#stairs-mode-1')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#v-bell')).toHaveText('3');
  await expect(page.locator('#v-speed')).toHaveText('2');
  await expect(page.locator('#v-volume')).toHaveText('10%');
  await page.goto('/#room=stairs&bell=20&mode=7');
  await page.reload();
  await expect(page.locator('#v-bell')).toHaveText('8');
  await expect(page.locator('#stairs-mode-0')).toHaveAttribute('aria-pressed', 'true');
});
