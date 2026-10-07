import { test, expect, openRoom } from './helpers.js';

const status = (page) => page.locator('#scene-status');

/**
 * The middle of student i's row (i 0–5) or club i's row (6–11), in canvas pixels from its top left. Students take
 * taps anywhere left of their lines, clubs anywhere right of them, so a point near either edge is enough; the rows
 * follow the room's layout (wide canvases only).
 */
async function personPoint(page, i) {
  const box = await page.locator('#scene-canvas').boundingBox();
  const height = box.height;
  const pad = 14,
    band = 34,
    slotH = Math.min(34, Math.max(22, height * 0.045));
  const top = pad + band + 3 * slotH + 6;
  const R = Math.min(24, Math.max(8, ((height - top - pad) / 6) * 0.3));
  const step = (height - top - pad - 2 * (R + 4)) / 5;
  return { x: i < 6 ? 24 : box.width - 24, y: top + R + 4 + step * (i % 6) };
}

test('students ask and get their favourites; then, by itself, the clubs ask and the happiness flips', async ({
  page,
}) => {
  await page.goto('/');
  await openRoom(page, 'matching');
  await expect(page.locator('#room-title')).toHaveText('Who asks wins.');
  await expect(page.locator('#scene-name')).toHaveText('Tangled wishes');
  await expect(status(page)).toHaveText(/^Round \d · \d students? appl/);
  await expect(status(page)).toHaveText('Students asked: 5 of 6 students got their first choice', { timeout: 10000 });
  await expect(status(page)).toHaveText(/^Round 1 · 6 clubs ask/, { timeout: 10000 });
  await expect(status(page)).toHaveText('Clubs asked: 5 of 6 clubs got their first choice', { timeout: 10000 });
  await expect(page.locator('#matching-count')).toHaveText('These wishes allow 5 stable pairings.');
});

test('“Swap who asks” and the presets: one shared ranking makes no difference, opposite wishes the most', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=matching');
  await expect(status(page)).toHaveText('Students asked: 5 of 6 students got their first choice');
  await page.locator('#scene-action').click();
  await expect(status(page)).toHaveText('Clubs asked: 5 of 6 clubs got their first choice');

  await page.getByRole('button', { name: /One shared ranking/ }).click();
  await expect(page.locator('#scene-name')).toHaveText('One shared ranking');
  await expect(page.locator('#matching-count')).toHaveText(
    'These wishes allow only 1 stable pairing, so it makes no difference who asks.',
  );
  await expect(status(page)).toHaveText('Students asked: 4 of 6 students got their first choice');

  await page.getByRole('button', { name: /Opposite wishes/ }).click();
  await expect(page.locator('#matching-count')).toHaveText('These wishes allow 6 stable pairings.');
  await expect(status(page)).toHaveText('Students asked: 6 of 6 students got their first choice');
  await page.locator('#scene-action').click();
  await expect(status(page)).toHaveText('Clubs asked: 6 of 6 clubs got their first choice');
});

test('pairing by hand: the keyboard and taps make pairs, red lines count who would rather swap', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=matching');
  await expect(status(page)).toHaveText(/^Students asked/);
  const canvas = page.locator('#scene-canvas');
  await canvas.focus();
  // Student 1 (aim starts there), then the second club: the square. Student 3, who had it, gets the ring, their last
  // choice, and five clubs would rather have them; student 1 and the diamond would too (the independent program
  // found the same six pairs).
  for (const key of ['ArrowDown', 'Enter', 'ArrowRight', 'ArrowDown', 'Enter']) await page.keyboard.press(key);
  await expect(status(page)).toHaveText('Your pairing: 6 pairs would rather swap');
  await expect(page.locator('[data-check="swap"]')).not.toBeChecked();
  // Pairing them back with a tap on student 1 and a tap on the circle club gives the students' result again.
  await canvas.scrollIntoViewIfNeeded();
  await canvas.click({ position: await personPoint(page, 0) });
  await canvas.click({ position: await personPoint(page, 11) });
  await expect(status(page)).toHaveText('Your pairing is stable: no pair would rather swap');
  await page.locator('#scene-reset').click();
  await expect(status(page)).toHaveText('Students asked: 5 of 6 students got their first choice');
});

test('a stable pairing that neither way of asking gives can be found by hand', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=matching');
  await expect(status(page)).toHaveText(/^Students asked/);
  const canvas = page.locator('#scene-canvas');
  await canvas.scrollIntoViewIfNeeded();
  // From the students' result [5, 4, 1, 3, 2, 0], student 1 takes the diamond club (2), then student 4 the ring (5):
  // [2, 4, 1, 5, 3, 0], one of the three stable pairings between the two extremes (checked by the model tests'
  // independent program).
  for (const [s, c] of [
    [0, 2],
    [3, 5],
  ]) {
    await canvas.click({ position: await personPoint(page, s) });
    await canvas.click({ position: await personPoint(page, 6 + c) });
  }
  await expect(status(page)).toHaveText('Stable, and neither asking gives this one');
});

test('a shared link opens shuffled wishes with the clubs asking, and new wishes shuffle again', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=matching&wishes=1234&clubs=true&marks=true');
  await expect(page.locator('#scene-name')).toHaveText('Shuffled wishes');
  await expect(status(page)).toHaveText(/^Clubs asked: \d of 6 clubs got their first choice$/);
  await expect(page.locator('[data-check="marks"]')).toBeChecked();
  await page.getByRole('button', { name: 'New wishes' }).click();
  await expect(page.locator('#scene-name')).toHaveText('Shuffled wishes');
  await expect(page.locator('#matching-count')).toHaveText(/^These wishes allow /);
  // Out-of-range wishes are ignored: the room opens on its own.
  await page.goto('/#room=matching&wishes=99999');
  await page.reload();
  await expect(page.locator('#scene-name')).toHaveText('Tangled wishes');
});

test('the explanation is honest about where it is used and what it leaves out', async ({ page }) => {
  await page.goto('/#room=matching');
  await page.locator('#scene-why').click();
  const body = page.locator('#insight-body');
  await expect(body).toContainText('at most n² − 2n + 2 rounds');
  await expect(body).toContainText('With couples a stable pairing may not exist at all');
  await expect(body).toContainText('changed the result for very few people');
});
