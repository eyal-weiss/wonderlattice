import { test, expect, ROOMS, openRoom, expectRoom, setRange, inkedPixels, tool } from './helpers.js';

const pressed = (page, selector) => expect(page.locator(selector)).toHaveAttribute('aria-pressed', 'true');

test('dice room: I choose after you, roll, and the readouts follow', async ({ page }) => {
  await page.goto('/');
  await expect.poll(() => inkedPixels(page, '#card-dice canvas')).toBeGreaterThan(20);
  await openRoom(page, 'dice');
  await expect(page.locator('#room-title')).toHaveText(ROOMS.dice);
  await expect(page.locator('#scene-name')).toHaveText('Pick first');
  await expect(page.locator('#scene-status')).toHaveText('Ready to roll');
  await expect.poll(() => inkedPixels(page, '#scene-canvas')).toBeGreaterThan(50);
  // You hold A; the room takes C, which beats A.
  await pressed(page, '[data-you="0"]');
  await pressed(page, '[data-rival="-1"]');
  await expect(page.locator('#dice-you-faces')).toHaveText('2 2 4 4 9 9');
  await expect(page.locator('#dice-rival-faces')).toHaveText('3 3 5 5 7 7');
  // Pick B instead: now the room takes A.
  await page.locator('[data-you="1"]').click();
  await pressed(page, '[data-you="1"]');
  await expect(page.locator('[data-you="1"]')).toBeFocused();
  await expect(page.locator('#dice-rival-faces')).toHaveText('2 2 4 4 9 9');
  await expect(page.locator('#dice-seen')).toContainText('A wins: – so far · exactly 5/9 ≈ 56%');
  await expect(page.locator('#dice-verdict')).toHaveText('Exactly, A wins 5/9 of the time. Roll to see it happen.');

  await setRange(page, '#c-speed', 100);
  await expect(page.locator('#v-speed')).toHaveText('100');
  await page.locator('#scene-action').click();
  await expect(page.locator('#dice-rolls')).toHaveText('100', { timeout: 8000 });
  await expect(page.locator('#scene-status')).toHaveText('100 rolls');
  const [you, me] = (await page.locator('#dice-wins').textContent()).match(/\d+/g).map(Number);
  expect(you + me).toBe(100); // no ties between different dice in this set
  await expect(page.locator('#dice-wins')).toHaveText(`You (B) ${you} · Me (A) ${me}`);
  await expect(page.locator('#dice-seen')).toContainText(`A wins: ${me}% so far · exactly 5/9 ≈ 56%`);
  await expect(page.locator('#dice-verdict')).toHaveText(
    `After 100 rolls, A has won ${me}% of the time. The exact chance is 5/9.`,
  );
  expect((await tool(page, 'read_exploration')).settings).toMatchObject({ set: 0, you: 1, rival: -1, speed: 100 });

  await page.locator('#scene-reset').click();
  await expect(page.locator('#dice-rolls')).toHaveText('0');
  await expect(page.locator('#scene-status')).toHaveText('Ready to roll');
});

test('dice room: presets, both dice by hand, and the two-dice twist', async ({ page }) => {
  await page.goto('/#room=dice');
  await expectRoom(page, 'dice');
  await page.getByRole('button', { name: /Efron’s four/ }).click();
  await expect(page.locator('#dice-set')).toHaveValue('1');
  await expect(page.locator('[data-you]')).toHaveCount(4);
  await expect(page.locator('#dice-seen')).toContainText('exactly 2/3');
  // Efron's C has the highest average, yet B, all threes, beats it.
  await page.locator('[data-you="2"]').click();
  await expect(page.locator('#dice-rival-faces')).toHaveText('3 3 3 3 3 3');
  // Choose both dice: B against D is an even match.
  await page.locator('[data-you="1"]').click();
  await page.locator('[data-rival="3"]').click();
  await pressed(page, '[data-rival="3"]');
  await expect(page.locator('#dice-verdict')).toHaveText('These two are evenly matched.');
  await expect(page.locator('#scene-presets [aria-pressed="true"]')).toHaveCount(0);

  await page.getByRole('button', { name: /Two of each/ }).click();
  await expect(page.locator('#scene-name')).toHaveText('Grime’s dice · two each');
  await expect(page.locator('[data-check="pairs"]')).toBeChecked();
  // Two of each: Blue beats Red. One of each: Olive beats Red.
  await expect(page.locator('#dice-rival-faces')).toHaveText('2 2 2 7 7 7');
  await expect(page.locator('#dice-seen')).toContainText('Blue wins');
  await expect(page.locator('#dice-seen')).toContainText('exactly 85/144');
  await page.locator('[data-check="pairs"]').uncheck();
  await expect(page.locator('#scene-name')).toHaveText('Grime’s dice');
  await expect(page.locator('#dice-rival-faces')).toHaveText('0 5 5 5 5 5');
  await expect(page.locator('#dice-seen')).toContainText('exactly 25/36');

  // The dice set select swaps the whole set and keeps focus.
  await page.locator('#dice-set').selectOption('0');
  await expect(page.locator('#dice-set')).toBeFocused();
  await expect(page.locator('[data-you]')).toHaveCount(3);
  await expect(page.locator('[data-check="pairs"]')).toHaveCount(0);

  // Arrow keys on the canvas step through your die.
  await page.locator('#scene-canvas').focus();
  await page.keyboard.press('ArrowRight');
  await pressed(page, '[data-you="1"]');

  // The explanation counts the pairings for the current dice.
  await page.locator('#scene-why').click();
  await expect(page.locator('#dice-grid-note')).toContainText('A wins 20 of the 36 equally likely pairings, B wins 16');
  await page.locator('#insight-close').click();
});

test('dice room: with reduced motion a batch appears at once', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=dice');
  await expect(page.locator('#scene-play')).toHaveText('Play');
  await page.locator('#scene-action').click();
  await expect(page.locator('#dice-rolls')).toHaveText('100');
  await page.locator('#scene-action').click();
  await expect(page.locator('#dice-rolls')).toHaveText('200');
  await expect(page.locator('#dice-verdict')).toContainText('After 200 rolls, C has won');
});

test('dice room: a shared link restores the dice, and odd values fall back safely', async ({ page }) => {
  await page.goto('/#room=dice&set=1&you=2&rival=-1&speed=50&pairs=false');
  await expectRoom(page, 'dice');
  await expect(page.locator('#dice-set')).toHaveValue('1');
  await pressed(page, '[data-you="2"]');
  await expect(page.locator('#dice-rival-faces')).toHaveText('3 3 3 3 3 3');
  await expect(page.locator('#v-speed')).toHaveText('50');
  await page.locator('#scene-share').click();
  const link = await page.evaluate(() => window.__clipboard.at(-1));
  expect(link).toMatch(/#room=dice&set=1&you=2&rival=-1&speed=50&pairs=false$/);

  await page.evaluate(() => (location.hash = 'room=dice&set=2&you=0&pairs=true'));
  await expect(page.locator('#scene-name')).toHaveText('Grime’s dice · two each');
  // Die D doesn't exist in the three-dice set, so the room starts again from A.
  await page.evaluate(() => (location.hash = 'room=dice&set=0&you=3&rival=3'));
  await expect(page.locator('#dice-set')).toHaveValue('0');
  await pressed(page, '[data-you="0"]');
  await pressed(page, '[data-rival="-1"]');
});
