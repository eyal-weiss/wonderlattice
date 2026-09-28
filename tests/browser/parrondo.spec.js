import { test, expect, openRoom } from './helpers.js';

const expected = (page) => page.locator('.parrondo-big strong');

const numbers = (text) => [...text.matchAll(/[−+]?\d+(?:\.\d+)?/g)].map((m) => Number(m[0].replace('−', '-')));

test('parrondo room: opens on a race where A and B sink and the mix climbs', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // each run is played to the end at once
  await page.goto('/');
  await openRoom(page, 'parrondo');
  await expect(page.locator('#scene-name')).toHaveText('A, B and the mix, side by side');
  await expect(page.locator('#scene-status')).toHaveText('1,000 rounds played');
  await expect(page.locator('.parrondo-race-row strong')).toHaveText(['−10.0', '−9.2', '+15.4']);
  // Each crowd's simulated average lands near its exact value: A and B below zero, the mix well above.
  const [a, b, mix] = numbers((await page.locator('#parrondo-average').textContent()).split('so far:')[1]);
  expect(a).toBeLessThan(-5);
  expect(b).toBeLessThan(-4);
  expect(mix).toBeGreaterThan(11);
  await page.getByLabel('Why? Show the three buckets').check();
  await expect(page.locator('#parrondo-bad')).toContainText('38.4% when B plays alone, 34.5% in the mix');
});

test('parrondo room: A loses, B loses, and mixing them at random wins', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await openRoom(page, 'parrondo');
  await page.getByRole('button', { name: 'Only A', exact: true }).click();
  await expect(page.locator('#scene-name')).toHaveText('Only A');
  await expect(page.locator('#scene-status')).toHaveText('1,000 rounds played');
  await expect(expected(page)).toHaveText('−10.0');
  await page.getByRole('button', { name: 'Only B', exact: true }).click();
  await expect(expected(page)).toHaveText('−9.2');
  await page.getByRole('button', { name: 'Mix at random' }).click();
  await expect(expected(page)).toHaveText('+15.4');
  await expect(page.locator('#scene-name')).toHaveText('A or B at random');
  // The simulated crowd lands near the exact value: 1,000 players' average is good to about a coin.
  const average = await page.locator('#parrondo-average').textContent();
  const value = Number(average.split(': ')[1].replace('−', '-').replace('+', ''));
  expect(value).toBeGreaterThan(11);
  expect(value).toBeLessThan(20);
});

test('parrondo room: a pattern of your own, where A B loses and A B B wins', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=parrondo');
  await page.getByRole('button', { name: 'Add A' }).click(); // the first tap starts a fresh pattern
  await page.getByRole('button', { name: 'Add B' }).click();
  await expect(page.locator('#parrondo-letters .parrondo-letter')).toHaveCount(2);
  await expect(page.locator('#scene-name')).toHaveText('The pattern A B');
  await expect(expected(page)).toHaveText('−5.9');
  await page.getByRole('button', { name: 'Add B' }).click();
  await expect(expected(page)).toHaveText('+57.5');
  await expect(page.getByRole('button', { name: 'My pattern' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Remove the last letter' }).click();
  await expect(page.locator('#scene-name')).toHaveText('The pattern A B');
});

test('parrondo room: a shared link restores the pattern and the buckets', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=parrondo&mode=3&pattern=19&buckets=true');
  await expect(page.locator('#scene-name')).toHaveText('The pattern A A B B');
  await expect(expected(page)).toHaveText('+14.6');
  await expect(page.locator('#parrondo-bad')).toBeVisible();
  await expect(page.locator('#parrondo-bad')).toContainText('B pays only below 37.7%');
  // A pattern number out of range is ignored, not trusted.
  await page.goto('/#room=parrondo&mode=3&pattern=99999');
  await expect(page.locator('#scene-name')).toHaveText('The pattern A A B B');
});

test('parrondo room: the rounds tick by, pause, and the keyboard picks a game', async ({ page }) => {
  await page.goto('/#room=parrondo');
  const round = async () =>
    Number((await page.locator('#scene-status').textContent()).match(/Round ([\d,]+)/)[1].replace(',', ''));
  await expect(page.locator('#scene-status')).toContainText('Round');
  await expect.poll(round).toBeGreaterThan(10);
  await page.locator('#scene-play').click(); // pause
  const paused = await round();
  await page.waitForTimeout(300);
  expect(await round()).toBe(paused);
  await page.locator('[data-mode="1"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#scene-name')).toHaveText('Only B');
  await expect(page.locator('#scene-status')).toHaveText('Round 0 of 1,000');
});
