import { test, expect, openRoom, setRange } from './helpers.js';

/** What the model itself says for a table: the share of blanks guessed right, and a newcomer's suggestions. */
async function expected(page, seed, blanks, likes = 0) {
  return page.evaluate(
    ([seed, blanks, likes]) => {
      const M = window.Wonderlattice.models.flavours;
      const t = window.Wonderlattice.text('flavours');
      const data = M.table(seed, blanks);
      const fit = M.solve(data);
      const ratings = M.decode(likes);
      const picks = M.suggest(M.place(fit.foods, ratings), fit.foods, ratings);
      return {
        rounds: fit.round,
        right: data.hidden ? Math.round(100 * M.blanksRight(data, fit)) : null,
        picks: picks.map((j) => t.foods[j]),
      };
    },
    [seed, blanks, likes],
  );
}

/** The middle of food j's row in the table, where a tap rates it (the room's own layout, for a wide canvas). */
async function rowPoint(page, j) {
  const box = await page.locator('#scene-canvas').boundingBox();
  const side = Math.min(box.width, box.height);
  const small = Math.round(Math.min(13, Math.max(9, side / 30)));
  const pad = Math.max(6, Math.min(16, side * 0.025));
  const h = box.height - 2 * pad;
  const head = small * 1.8,
    foot = h > 260 ? small * 2 : 0;
  const rh = (h - head - foot) / 16;
  return { x: pad + 8, y: pad + head + rh * (j + 0.5) };
}

test('flavours room: the method sorts the foods by itself and guesses most of the blanks', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // the run finishes at once
  await page.goto('/');
  await openRoom(page, 'flavours');
  // The opening table (seed 1, 60% blank): 192 rounds, 83% of the blanks right.
  await expect(page.locator('#scene-status')).toHaveText('83% of blanks right');
  await expect(page.locator('#announcer')).toHaveText(
    'The map is found after 192 rounds. It guessed 83% of the blanks right.',
  );
  const e = await expected(page, 1, 60);
  expect(e).toMatchObject({ rounds: 192, right: 83 });
  await expect(page.locator('#flavours-readout')).toContainText('Tap a few foods');
  await expect(page.locator('#flavours-clear')).toBeHidden();
});

test('flavours room: the map moves without a click, round after round', async ({ page }) => {
  await page.goto('/#room=flavours');
  const status = page.locator('#scene-status');
  await expect(status).toHaveText(/^Round \d+$/, { timeout: 15000 });
  await expect(status).toHaveText('83% of blanks right', { timeout: 30000 });
});

test('flavours room: rating foods puts a star on the map and suggests foods', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=flavours');
  await expect(page.locator('#scene-status')).toHaveText('83% of blanks right');
  // Keyboard: ↓ chooses chocolate, → likes it.
  await page.locator('#scene-canvas').focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowRight');
  const like = await expected(page, 1, 60, 1);
  await expect(page.locator('#announcer')).toContainText('Chocolate: like. Suggested for you:');
  for (const name of like.picks) {
    await expect(page.locator('#announcer')).toContainText(name);
    await expect(page.locator('#flavours-readout')).toContainText(name);
  }
  await expect(page.locator('#flavours-clear')).toBeVisible();
  // → again takes the like back.
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#announcer')).toHaveText('Chocolate: not rated.');
  await expect(page.locator('#flavours-readout')).toContainText('Tap a few foods');
  // A tap on a food's row in the table rates it too: once like, twice not for me.
  const box = await page.locator('#scene-canvas').boundingBox();
  const p = await rowPoint(page, 10); // chips
  await page.mouse.click(box.x + p.x, box.y + p.y);
  await expect(page.locator('#announcer')).toContainText('Chips: like.');
  await page.mouse.click(box.x + p.x, box.y + p.y);
  await expect(page.locator('#announcer')).toContainText('Chips: not for me.');
  await page.locator('#flavours-clear').click();
  await expect(page.locator('#flavours-readout')).toContainText('Tap a few foods');
});

test('flavours room: a sweet tooth, and only puddings', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=flavours');
  await page.getByRole('button', { name: /A sweet tooth/ }).click();
  // Likes chocolate and strawberries, not chips or broccoli: mango, ice cream, pancakes.
  await expect(page.locator('.flavours-picks span')).toHaveText(['1. 🥭 Mango', '2. 🍦 Ice cream', '3. 🥞 Pancakes']);
  await page.getByRole('button', { name: /Only puddings/ }).click();
  // Rate only puddings and more puddings come first.
  await expect(page.locator('.flavours-picks span').nth(0)).toHaveText('1. 🍦 Ice cream');
  await expect(page.locator('.flavours-picks span').nth(1)).toHaveText('2. 🥞 Pancakes');
  await page.getByRole('button', { name: /Find the hidden map/ }).click();
  await expect(page.locator('#flavours-readout')).toContainText('Tap a few foods');
});

test('flavours room: showing the planted traits says how the map is turned', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=flavours');
  const action = page.locator('#scene-action');
  await expect(action).toHaveText('Show the planted traits');
  await action.click();
  await expect(action).toHaveText('Hide the planted traits');
  await expect(page.locator('#announcer')).toHaveText(
    'The planted traits match the map turned by 99 degrees and mirrored.',
  );
  await action.click();
  await expect(action).toHaveText('Show the planted traits');
});

test('flavours room: a shared link restores the table, the blanks and the ratings', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const likes = await page.evaluate(() => 1 + 2 * 3 ** 10); // likes chocolate, not chips
  await page.goto(`/#room=flavours&seed=2&blanks=30&likes=${likes}`);
  await expect(page.locator('#v-blanks')).toHaveText('30%');
  const e = await expected(page, 2, 30, likes);
  await expect(page.locator('#scene-status')).toHaveText(`${e.right}% of blanks right`);
  for (const name of e.picks) await expect(page.locator('#flavours-readout')).toContainText(name);
  // More blanks, worse guesses.
  await setRange(page, '#c-blanks', 90);
  const worse = await expected(page, 2, 90, likes);
  await expect(page.locator('#scene-status')).toHaveText(`${worse.right}% of blanks right`);
  expect(worse.right).toBeLessThan(e.right);
  // No blanks: nothing to guess.
  await setRange(page, '#c-blanks', 0);
  await expect(page.locator('#scene-status')).toHaveText('No blanks');
});
