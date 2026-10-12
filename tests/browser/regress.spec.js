import { test, expect, openRoom, setRange } from './helpers.js';

/** The tally the room should announce for a session made by the model itself, from a seed. */
async function expectedAnnouncement(page, seed, share, helps = false) {
  return page.evaluate(
    ([seed, share, helps]) => {
      const M = window.Wonderlattice.models.regress;
      const k = M.tally(M.session(seed, 120, share, helps));
      return window.Wonderlattice.text('regress').announce(
        k.praise.worse,
        k.praise.worse + k.praise.better,
        k.scold.better,
        k.scold.better + k.scold.worse,
      );
    },
    [seed, share, helps],
  );
}

test('regress room: after praise the next throw is usually worse, after scolding usually better', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // the whole session lands at once
  await page.goto('/');
  await openRoom(page, 'regress');
  await expect(page.locator('#scene-status')).toHaveText('120 throws, all done');
  // The opening thrower (seed 128): worse 20 times in 23 after praise, better 26 times in 29 after scolding.
  await expect(page.locator('#announcer')).toHaveText(
    'After praise the next throw was worse 20 times in 23; after scolding it was better 26 times in 29.',
  );
  await expect(page.locator('#announcer')).toHaveText(await expectedAnnouncement(page, 128, 0.2));
});

test('regress room: the throws start by themselves, without a click', async ({ page }) => {
  await page.goto('/#room=regress');
  const count = async () => Number((await page.locator('#scene-status').textContent()).match(/\d+/)?.[0] ?? 0);
  await expect.poll(count, { timeout: 15000 }).toBeGreaterThan(6);
});

test('regress room: showing the wiring reveals that the words reach nothing, unless praise really helps', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=regress');
  const action = page.locator('#scene-action');
  await expect(action).toHaveText('Show the wiring');
  await action.click();
  await expect(action).toHaveText('Hide the wiring');
  await expect(page.locator('#announcer')).toHaveText('Words wired to the next throw: nothing');
  await page.getByRole('button', { name: /Praise really helps/ }).click();
  // The tally still says praise backfires, though now it really lifts the next throw.
  await expect(page.locator('#announcer')).toHaveText(await expectedAnnouncement(page, 128, 0.2, true));
  await expect(action).toHaveText('Show the wiring'); // a preset starts with the wiring hidden
  await action.click();
  await expect(page.locator('#announcer')).toHaveText('Words wired to the next throw: praise: a small lift');
});

test('regress room: coaching by hand, with the buttons and the keyboard', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=regress');
  await page.getByRole('button', { name: /You coach/ }).click();
  await expect(page.locator('#scene-status')).toHaveText('Throw 1: your word?');
  await expect(page.locator('[data-check="auto"]')).not.toBeChecked();
  await page.locator('[data-word="praise"]').click();
  await expect(page.locator('#scene-status')).toHaveText('Throw 2: your word?');
  await page.locator('#scene-canvas').focus();
  await page.keyboard.press('ArrowDown'); // scold
  await page.keyboard.press('ArrowRight'); // say nothing
  await expect(page.locator('#scene-status')).toHaveText('Throw 4: your word?');
  // Switching the automatic coach back on finishes the session.
  await page.locator('[data-check="auto"]').check();
  await expect(page.locator('#scene-status')).toHaveText('120 throws, all done');
});

test('regress room: a shared link restores the thrower and how picky the coach is', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=regress&seed=5&share=50');
  await expect(page.locator('#v-share')).toHaveText('50%');
  await expect(page.locator('#announcer')).toHaveText(await expectedAnnouncement(page, 5, 0.5));
  // A pickier coach (the most extreme tenth) sees the illusion more strongly.
  await setRange(page, '#c-share', 10);
  await expect(page.locator('#announcer')).toHaveText(await expectedAnnouncement(page, 5, 0.1));
});
