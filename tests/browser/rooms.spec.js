import { test, expect, ROOMS, openRoom, tool, setRange, inkedPixels } from './helpers.js';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('offers five rooms and opens each one with a live picture', async ({ page }) => {
  await expect(page).toHaveTitle(/Wonderloom/);
  await expect(page.getByRole('tab')).toHaveCount(5);
  await expect(page.locator('#motion-room h1')).toHaveText(ROOMS.motion);
  await expect.poll(() => inkedPixels(page, '#art')).toBeGreaterThan(50);
  for (const room of ['waves', 'flock', 'ribbon', 'traffic']) {
    await openRoom(page, room);
    await expect(page.locator('#room-title')).toHaveText(ROOMS[room]);
    await expect(page.locator('#motion-room')).toBeHidden();
    await expect.poll(() => inkedPixels(page, '#scene-canvas')).toBeGreaterThan(50);
    await expect(page.locator('#scene-presets .scene-preset')).toHaveCount(3);
    await page.locator('#scene-why').click();
    await expect(page.locator('#insight-dialog')).toBeVisible();
    await page.locator('#insight-close').click();
  }
  await openRoom(page, 'motion');
  await expect(page.locator('#motion-room')).toBeVisible();
  await expect(page.locator('#new-room')).toBeHidden();
});

test('room tabs follow the arrow, Home and End keys', async ({ page }) => {
  await page.locator('#tab-motion').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#tab-waves')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#tab-waves')).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.locator('#tab-traffic')).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#tab-motion')).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#tab-traffic')).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Home');
  await expect(page.locator('#tab-motion')).toHaveAttribute('aria-selected', 'true');
});

test('motion room: presets, tracing, play state and surprise', async ({ page }) => {
  await expect(page.locator('#presets .preset')).toHaveCount(6);
  await expect(page.locator('#pattern-name')).toHaveText('Wildflower');
  await page.getByRole('button', { name: /Almost a circle/ }).click();
  await expect(page.locator('#pattern-name')).toHaveText('Almost a circle');
  await expect(page.locator('#cycle-status')).toHaveText('100 outer turns to reunite');
  await page.locator('#finish').click();
  await expect(page.locator('#cycle-status')).toHaveText('The loop is complete');
  await expect(page.locator('#finish')).toBeDisabled();
  await expect(page.locator('#play')).toHaveText('Replay');
  await page.locator('#play').click();
  await expect(page.locator('#play')).toHaveText('Pause');
  await page.locator('#play').click();
  await expect(page.locator('#play')).toHaveText('Play');
  await setRange(page, '#reach', 60);
  await expect(page.locator('#pattern-name')).toHaveText('Your own orbit');
  await expect(page.locator('#reach-value')).toHaveText('60%');
  await page.locator('#rotation-number').fill('2');
  await page.locator('#rotation-number').dispatchEvent('change');
  await expect(page.locator('#ratio')).toHaveValue('2');
  await expect(page.locator('#nudge')).toContainText('whole number');
  await page.locator('#surprise').click();
  await expect(page.locator('#pattern-name')).toHaveText('A happy accident');
  await page.locator('#why-button').click();
  await expect(page.locator('#why-dialog')).toBeVisible();
  await page.locator('#reveal-arms').click();
  await expect(page.locator('#mechanism')).toBeChecked();
  await page.locator('#focus').click();
  await expect(page.locator('body')).toHaveClass(/focus-mode/);
  await page.keyboard.press('Escape');
  await expect(page.locator('body')).not.toHaveClass(/focus-mode/);
});

test('traffic room shows the paradox only over part of the range', async ({ page }) => {
  await openRoom(page, 'traffic');
  await expect(page.locator('#scene-status')).toHaveText('Shortcut closed · 65 min now');
  await page.locator('#scene-action').click();
  await expect(page.locator('#scene-action')).toHaveText('Close the shortcut');
  await expect(page.locator('#traffic-result')).toContainText('65 min');
  await expect(page.locator('#traffic-result')).toContainText('80 min');
  await expect(page.locator('#traffic-result')).toContainText('15 minutes slower for everyone');
  await setRange(page, '#c-demand', 1000);
  await expect(page.locator('#traffic-result')).toContainText('30 minutes faster for everyone');
  await expect(page.locator('#v-demand')).toHaveText('1000');
  await page.getByRole('button', { name: /Rush hour/ }).click();
  await expect(page.locator('#scene-action')).toHaveText('Open the shortcut');
  await expect(page.locator('#traffic-result')).toContainText('95 min');
  await page.locator('#scene-action').click();
  await expect(page.locator('#traffic-result')).toContainText('leaves the trip time unchanged');
});

test('waves room: sound is opt-in and stops when leaving', async ({ page }) => {
  await openRoom(page, 'waves');
  await expect(page.locator('#scene-status')).toHaveText('220 Hz + 330.0 Hz');
  await expect(page.locator('#scene-action')).toHaveText('Turn sound on');
  expect((await tool(page, 'read_exploration')).soundOn).toBe(false);
  await page.locator('#scene-action').click();
  await expect(page.locator('#scene-action')).toHaveText('Sound on · mute');
  expect((await tool(page, 'read_exploration')).soundOn).toBe(true);
  await setRange(page, '#c-ratio', 1.02);
  await expect(page.locator('#scene-status')).toHaveText('220 Hz + 224.4 Hz');
  await openRoom(page, 'flock');
  expect((await tool(page, 'read_exploration')).soundOn).toBe(false);
  await openRoom(page, 'waves');
  await expect(page.locator('#scene-action')).toHaveText('Turn sound on');
  await page.locator('#view-portrait').click();
  await expect(page.locator('#view-portrait')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#view-waves')).toHaveAttribute('aria-pressed', 'false');
});

test('flock and ribbon controls update their readouts', async ({ page }) => {
  await openRoom(page, 'flock');
  await expect(page.locator('#scene-status')).toHaveText('130 individual decisions');
  await expect(page.locator('#flock-order')).toHaveText(/\d+%/);
  await page.locator('#flock-influence').selectOption('repel');
  expect((await tool(page, 'read_exploration')).settings.attract).toBe(false);
  await openRoom(page, 'ribbon');
  await expect(page.locator('#scene-status')).toHaveText('One side · one edge');
  await page.locator('#twists').selectOption('0');
  await expect(page.locator('#scene-status')).toHaveText('Two sides · two edges');
  await expect(page.locator('#scene-name')).toHaveText('The twisted band');
  await page.locator('#scene-action').click();
  await expect(page.locator('#scene-action')).toHaveText('Hide the edges');
  await page.locator('#scene-canvas').focus();
  await page.keyboard.press('Space');
  await expect(page.locator('#scene-play')).toHaveText('Play');
});

test('mathematician visitors appear in every room and can be swapped', async ({ page }) => {
  const pairs = {
    motion: ['Emmy Noether', 'Leonhard Euler'],
    waves: ['Jules Lissajous', 'Joseph Fourier'],
    flock: ['John Conway', 'Alan Turing'],
    ribbon: ['August Möbius', 'Johann Listing'],
    traffic: ['John von Neumann', 'John Nash'],
  };
  for (const [room, names] of Object.entries(pairs)) {
    await openRoom(page, room);
    const card = page.locator(room === 'motion' ? '#math-guest-motion' : '#math-guest-scene');
    const first = await card.locator('strong').textContent();
    expect(names).toContain(first);
    await expect.poll(() => card.locator('img').evaluate((img) => img.complete && img.naturalWidth)).toBeGreaterThan(0);
    await card.getByRole('button', { name: 'Meet another mathematician' }).click();
    const second = await card.locator('strong').textContent();
    expect(names.filter((n) => n !== first)).toContain(second);
  }
});

test('optional browser-agent tools are registered and work', async ({ page }) => {
  const names = await page.evaluate(() => Object.keys(window.__tools).sort());
  expect(names).toEqual(['configure_drawing', 'get_drawing_settings', 'open_exploration', 'read_exploration']);
  await tool(page, 'open_exploration', { room: 'ribbon' });
  await expect(page.locator('#tab-ribbon')).toHaveAttribute('aria-selected', 'true');
  expect(await tool(page, 'configure_drawing', { rotation: 3, reach: 30, angle: 10, palette: 2 })).toEqual({
    rotation: 3,
    reach: 30,
    angle: 10,
    palette: 2,
  });
  await expect(page.locator('#tab-motion')).toHaveAttribute('aria-selected', 'true');
  const drawing = await tool(page, 'get_drawing_settings');
  expect(drawing).toMatchObject({ k: 3, r: 30, p: 10, palette: 2, name: 'Your own orbit' });
});
