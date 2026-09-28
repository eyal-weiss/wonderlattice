import { test, expect, openRoom } from './helpers.js';

test('secret room: three steps of paint leave both friends with the same colour, and Eve without it', async ({
  page,
}) => {
  await page.goto('/');
  await openRoom(page, 'secret');
  await expect(page.locator('#scene-status')).toContainText('keep a secret colour');
  for (let i = 0; i < 3; i++) await page.locator('#scene-action').click();
  await expect(page.locator('#scene-status')).toContainText('The same colour on both sides');
  await expect(page.locator('#secret-readout')).toContainText('too much yellow');
  // A fourth step starts the exchange again.
  await page.locator('#scene-action').click();
  await expect(page.locator('#scene-status')).toContainText('keep a secret colour');
});

test('secret room: on a clock of 23 both keys come out 18, the classic example', async ({ page }) => {
  await page.goto('/#room=secret');
  await page.getByRole('button', { name: /A clock of 23/ }).click();
  await expect(page.locator('#secret-clock')).toHaveValue('1');
  for (let i = 0; i < 3; i++) await page.locator('#scene-action').click();
  await expect(page.locator('#scene-status')).toContainText('The same number on both sides');
  await expect(page.locator('#secret-readout')).toContainText('Both keys are 18');
  await expect(page.locator('#secret-readout')).toContainText('the two shouts: 4 and 10');
});

test('secret room: a shared link reopens a big clock mid-exchange, and secrets stay on the clock', async ({ page }) => {
  await page.goto('/#room=secret&mode=1&clock=5&a=2718&b=1414&step=3');
  await expect(page.locator('#secret-readout')).toContainText('Both keys are 5,650');
  // Moving to a small clock keeps the secrets inside it (at most 11 − 2).
  await page.locator('#secret-clock').selectOption('0');
  await expect(page.locator('#v-a')).toHaveText('9');
  await expect(page.locator('#v-b')).toHaveText('9');
});
