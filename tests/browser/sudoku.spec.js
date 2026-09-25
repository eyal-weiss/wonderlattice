import { test, expect, ROOMS, openRoom, tool, expectRoom } from './helpers.js';

// The centre of a square on the board, in page coordinates, following layout() in room.js.
async function squareCentre(page, row, col) {
  const box = await page.locator('#scene-canvas').boundingBox();
  const room = box.height - (box.width < 480 ? 62 : 52) - 10;
  const size = Math.min(box.width * 0.92, room, 440);
  const x0 = (box.width - size) / 2,
    y0 = Math.max(4, Math.min((room - size) / 2, 16));
  return { x: box.x + x0 + (col + 0.5) * (size / 4), y: box.y + y0 + (row + 0.5) * (size / 4) };
}

// What a screen reader hears for the chosen square on the accessible board.
const canvasLabel = (page) => page.locator('.sudoku-cell[aria-selected="true"]').getAttribute('aria-label');

test('sudoku room: place by click and keyboard, undo, and take logical steps', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'sudoku');
  await expect(page.locator('#room-title')).toHaveText(ROOMS.sudoku);
  await expect(page.locator('#scene-name')).toHaveText('A gentle start');
  await expect(page.locator('#scene-status')).toHaveText('8 of 16 filled');
  await expect(page.locator('#sudoku-solutions')).toHaveText('1');
  await expect(page.locator('#sudoku-undo')).toBeDisabled();
  // The first empty square is chosen already, so one tap on a color places it.
  expect(await canvasLabel(page)).toContain('Row 1, column 2, empty, could be orange');
  await page.getByRole('button', { name: 'Place orange' }).click();
  await expect(page.locator('#sudoku-filled')).toHaveText('9/16');
  await expect(page.locator('#sudoku-readout')).toContainText('Orange placed.');
  await expect(page.locator('#sudoku-undo')).toBeEnabled();

  // Tap a square on the canvas to choose it, then use the keyboard.
  const target = await squareCentre(page, 3, 0);
  await page.mouse.click(target.x, target.y);
  expect(await canvasLabel(page)).toContain('Row 4, column 1, empty');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  expect(await canvasLabel(page)).toContain('Row 3, column 3, blue, a clue');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowRight');
  expect(await canvasLabel(page)).toContain('Row 1, column 4, empty');
  await page.keyboard.press('4');
  await expect(page.locator('#sudoku-filled')).toHaveText('10/16');
  expect(await canvasLabel(page)).toContain('Row 1, column 4, green');
  await page.keyboard.press('Backspace');
  await expect(page.locator('#sudoku-filled')).toHaveText('9/16');
  await expect(page.locator('#sudoku-readout')).toContainText('Its possibilities come back');
  await page.keyboard.press('Control+z');
  await expect(page.locator('#sudoku-filled')).toHaveText('10/16');

  // A clash glows gently and can be undone; nothing is lost.
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('1');
  await expect(page.locator('#sudoku-readout')).toContainText('Two neighbours now both hold blue');
  await expect(page.locator('#sudoku-solutions')).toHaveText('none');
  await page.locator('#scene-action').click();
  await expect(page.locator('#sudoku-readout')).toContainText('Undo or clear one of the glowing squares');
  await page.locator('#sudoku-undo').click();
  await expect(page.locator('#sudoku-solutions')).toHaveText('1');
  await expect(page.locator('#sudoku-filled')).toHaveText('10/16');

  // Logical steps explain themselves and finish the puzzle.
  await page.locator('#scene-action').click();
  await expect(page.locator('#sudoku-filled')).toHaveText('11/16');
  await expect(page.locator('#sudoku-readout')).toContainText('fits here');
  for (let i = 0; i < 5; i++) await page.locator('#scene-action').click();
  await expect(page.locator('#scene-status')).toHaveText('16 of 16 filled');
  await expect(page.locator('#sudoku-readout')).toContainText('Complete.');
  await expect(page.locator('#sudoku-candidates')).toHaveText('0');

  // Digits instead of colours: the same board, new labels.
  await page.locator('[data-style="2"]').click();
  await expect(page.locator('[data-style="2"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: /^Place 3/ })).toBeVisible();
  await expect(page.locator('#scene-status')).toHaveText('16 of 16 filled');

  // Start again restores the clues only.
  await page.locator('#scene-reset').click();
  await expect(page.locator('#scene-status')).toHaveText('8 of 16 filled');
});

test('sudoku room: the network view and a puzzle with two answers', async ({ page }) => {
  await page.goto('/#room=sudoku');
  const before = await page.locator('#scene-canvas').evaluate((c) => c.toDataURL());
  await page.locator('[data-check="network"]').check();
  expect((await tool(page, 'read_exploration')).settings.network).toBe(true);
  await expect.poll(() => page.locator('#scene-canvas').evaluate((c) => c.toDataURL())).not.toBe(before);
  // Choosing a node in the network works like choosing a square.
  await page.locator('.sudoku-cell[tabindex="0"]').focus();
  await page.keyboard.press('ArrowDown');
  expect(await canvasLabel(page)).toContain('Row 2, column 2');

  await page.getByRole('button', { name: /Two answers/ }).click();
  await expect(page.locator('#scene-name')).toHaveText('Two answers');
  await expect(page.locator('#sudoku-solutions')).toHaveText('2');
  for (let i = 0; i < 7; i++) await page.locator('#scene-action').click();
  await expect(page.locator('#sudoku-readout')).toContainText('Nothing is forced now');
  await expect(page.locator('#scene-status')).toHaveText('12 of 16 filled');
  await expect(page.locator('#sudoku-solutions')).toHaveText('2');
  // Choosing one of the two ways leaves exactly one answer.
  await page.locator('.sudoku-cell[tabindex="0"]').focus();
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  expect(await canvasLabel(page)).toContain('Row 1, column 1, empty, could be orange or green');
  await page.keyboard.press('2');
  await expect(page.locator('#sudoku-solutions')).toHaveText('1');
});

test('sudoku room: the two finishes appear in the panel on a narrow screen', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/#room=sudoku&puzzle=2');
  await expect(page.locator('#sudoku-solutions')).toHaveText('2');
  await expect(page.locator('.sudoku-answers svg')).toHaveCount(2);
  const tap = await page.locator('.sudoku-symbol').first().boundingBox();
  expect(tap.height).toBeGreaterThanOrEqual(44);
  expect(tap.width).toBeGreaterThanOrEqual(44);
});

test('sudoku room: a shared link restores the puzzle and the symbols', async ({ page }) => {
  await page.goto('/#room=sudoku');
  await page.getByRole('button', { name: /Two answers/ }).click();
  await page.locator('[data-style="1"]').click();
  await page.locator('#scene-share').click();
  const link = await page.evaluate(() => window.__clipboard.at(-1));
  expect(link).toBe(new URL('/#room=sudoku&puzzle=2&style=1&network=false', page.url()).href);

  await page.goto('/');
  await page.goto('/#room=sudoku&puzzle=1&style=2');
  await expectRoom(page, 'sudoku');
  await expect(page.locator('#scene-name')).toHaveText('Only one way');
  await expect(page.locator('#scene-status')).toHaveText('4 of 16 filled');
  await expect(page.locator('[data-style="2"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.scene-preset').nth(1)).toHaveAttribute('aria-pressed', 'true');
  // Out-of-range values are ignored.
  await page.evaluate(() => (location.hash = 'room=sudoku&puzzle=7&style=1.5'));
  await expect(page.locator('#scene-name')).toHaveText('Only one way');
  await expect(page.locator('[data-style="2"]')).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate(() => (location.hash = 'room=sudoku&puzzle=2&style=0'));
  await expect(page.locator('#scene-name')).toHaveText('Two answers');
  await expect(page.locator('[data-style="0"]')).toHaveAttribute('aria-pressed', 'true');
});

test('sudoku room: a saved moment keeps the board', async ({ page }) => {
  await page.goto('/#room=sudoku');
  await page.getByRole('button', { name: 'Place orange' }).click();
  await page.locator('#trail-keep-scene').click();
  await expect(page.locator('#trail-capture-name')).toHaveText('A gentle start');
  await page.locator('#trail-save').click();
  await page.locator('#trail-dialog .trail-close').click();
  await page.locator('#scene-reset').click();
  await expect(page.locator('#scene-status')).toHaveText('8 of 16 filled');
  await page.locator('#trail-open').click();
  await page.locator('.trail-card').getByRole('button', { name: 'Revisit' }).click();
  await expect(page.locator('#scene-status')).toHaveText('9 of 16 filled');
});

test('sudoku room: reduced motion still shows what a placement ruled out', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=sudoku');
  await expect(page.locator('#scene-play')).toHaveText('Play');
  const before = await page.locator('#scene-canvas').evaluate((c) => c.toDataURL());
  await page.getByRole('button', { name: 'Place orange' }).click();
  const after = await page.locator('#scene-canvas').evaluate((c) => c.toDataURL());
  expect(after).not.toBe(before);
  await page.waitForTimeout(300);
  // Nothing animates: the picture stays exactly as drawn.
  expect(await page.locator('#scene-canvas').evaluate((c) => c.toDataURL())).toBe(after);
});

test('sudoku room: the board is a real grid, playable with the keyboard alone', async ({ page }) => {
  await page.goto('/#room=sudoku');
  await expect(page.locator('#scene-play')).toBeHidden(); // turn-based: nothing to pause
  const grid = page.getByRole('grid', { name: 'Sudoku board, four by four' });
  await expect(grid.getByRole('row')).toHaveCount(4);
  await expect(grid.getByRole('gridcell')).toHaveCount(16);
  // The canvas is only the picture now; the readout is no live region, and one tab stop leads into the board.
  await expect(page.locator('#scene-canvas')).toHaveAttribute('role', 'img');
  await expect(page.locator('#sudoku-readout')).not.toHaveAttribute('role', 'status');
  await expect(page.locator('.sudoku-cell[tabindex="0"]')).toHaveCount(1);

  // Tab from the page into the board, the way a keyboard user arrives.
  await page.locator('#room-next').focus();
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab');
    if (await page.evaluate(() => document.activeElement?.getAttribute('role') === 'gridcell')) break;
  }
  const focused = page.locator('.sudoku-cell:focus');
  await expect(focused).toHaveAttribute('aria-label', 'Row 1, column 2, empty, could be orange');
  await expect(focused).toHaveAttribute('aria-selected', 'true');

  // Move, place, and hear the result once.
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(focused).toHaveAttribute('aria-label', /^Row 1, column 4, empty, could be/);
  await expect(page.locator('.sudoku-cell[tabindex="0"]')).toHaveCount(1);
  await page.keyboard.press('4');
  await expect(page.locator('#sudoku-filled')).toHaveText('9/16');
  await expect(focused).toHaveAttribute('aria-label', 'Row 1, column 4, green');
  await expect(page.locator('#announcer')).toHaveText(/^Green placed\./);
  // A clash is announced too.
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('1');
  await expect(page.locator('#announcer')).toHaveText('Two neighbours now both hold blue. Undo, or try another.');
  // Undo after moving away: focus goes back to the restored square, so typing lands where the label says.
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Control+z');
  await expect(page.locator('#announcer')).toHaveText('Stepped back.');
  await expect(page.locator('#sudoku-solutions')).toHaveText('1');
  await expect(focused).toHaveAttribute('aria-label', /^Row 1, column 3, empty/);
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Backspace');
  await expect(page.locator('#sudoku-filled')).toHaveText('8/16');
  await expect(focused).toHaveAttribute('aria-label', /^Row 1, column 4, empty/);
  // Home jumps to the start of the row; a clue can't be changed.
  await page.keyboard.press('Home');
  await expect(focused).toHaveAttribute('aria-label', 'Row 1, column 1, blue, a clue');
  await page.keyboard.press('2');
  await expect(page.locator('#announcer')).toHaveText('This one came with the puzzle. Try an empty square.');
  await expect(page.locator('#sudoku-filled')).toHaveText('8/16');
});

test('sudoku room: colours carry their shapes, faded choices are explained, and the tip stays on phones', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#room=sudoku');
  // Each colour tile in the picker holds its shape, so colour is never the only cue.
  await expect(page.locator('.sudoku-symbol svg rect')).toHaveCount(5); // four tiles and the square's shape
  await expect(page.locator('.sudoku-symbol svg circle')).toHaveCount(1);
  await expect(page.locator('.sudoku-symbol svg polygon')).toHaveCount(2);
  await expect(page.locator('.sudoku-faded')).toHaveText('Faded colours can’t go here.');
  await expect(page.locator('#scene-tip')).toBeVisible();
  await expect(page.locator('#scene-tip')).toContainText('arrows move');
  // A tap on a square still chooses it.
  const target = await squareCentre(page, 3, 0);
  await page.mouse.click(target.x, target.y);
  expect(await canvasLabel(page)).toContain('Row 4, column 1, empty');
});
