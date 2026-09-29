import { test, expect, openRoom, setRange } from './helpers.js';

const readout = (page) => page.locator('#pools-readout');

test('pools room: ten tests at once spell the glowing tube’s number', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // each run is shown at its end at once
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  await openRoom(page, 'pools');
  await expect(page.locator('#scene-name')).toHaveText('The lights say tube 673');
  await expect(page.locator('#scene-status')).toHaveText('10 tests · done');
  await expect(page.locator('#scene-label')).toHaveText('1,000 tubes · 10 tests');
  await expect(readout(page)).toContainText('10 tests, run at the same time. One by one would take 1,000.');
  await expect(readout(page)).toContainText('Tube 673 in binary: 1010100001');
  await expect(readout(page)).toContainText('The lights: 1010100001 = 673');
});

test('pools room: two glowing tubes make the lights point at a third', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/#room=pools');
  await page.getByRole('button', { name: 'Two glowing tubes' }).click();
  await expect(page.locator('#scene-name')).toHaveText('The lights say tube 743');
  await expect(readout(page)).toContainText('Tube 673 in binary: 1010100001');
  await expect(readout(page)).toContainText('Tube 71 in binary: 0001000111');
  await expect(readout(page)).toContainText('The lights: 1011100111 = 743');
  await expect(page.getByRole('button', { name: 'Two', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('pools room: a tap hides the glow in another tube, and the tests find it again', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/#room=pools');
  const canvas = page.locator('#scene-canvas');
  const box = await canvas.boundingBox();
  await canvas.click({ position: { x: box.width * 0.2, y: 60 } });
  const name = await page.locator('#scene-name').textContent();
  const tube = Number(name.match(/tube ([\d,]+)/)[1].replace(',', ''));
  expect(tube).not.toBe(673);
  await expect(readout(page)).toContainText(`= ${tube.toLocaleString('en')}`);
  // Keyboard: the arrows pick a well and say which tubes feed it.
  await canvas.focus();
  await page.keyboard.press('ArrowRight');
  await expect(readout(page)).toContainText('uses 512: 489 tubes');
  await page.keyboard.press('ArrowRight');
  await expect(readout(page)).toContainText('uses 256: 489 tubes');
  await page.keyboard.press('Escape');
  await expect(readout(page)).not.toContainText('This well');
});

test('pools room: a shared link restores the tube; a phone rack has 63 tubes and 6 tests', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/#room=pools&tube=5');
  await expect(page.locator('#scene-name')).toHaveText('The lights say tube 5');
  await page.goto('/#room=pools&tube=99999');
  await expect(page.locator('#scene-name')).toHaveText('The lights say tube 5'); // out of range: ignored, not trusted
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#room=pools&tube=673');
  await expect(page.locator('#scene-name')).toHaveText('The lights say tube 43'); // 673 wraps onto 63 tubes
  await expect(readout(page)).toContainText('6 tests, run at the same time. One by one would take 63.');
});

test('pools room: pools of ten for 100 people, and the cliff where pooling stops helping', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=pools');
  await page.getByRole('button', { name: '1 in 100 infected' }).click();
  await expect(page.locator('#scene-name')).toHaveText('100 people, 1% infected');
  await expect(readout(page)).toContainText('Expected, on average: 19.6. One by one: 100.');
  await expect(readout(page)).toContainText('Best pool size here: 10, about 19.6 tests.');
  await expect(page.locator('#scene-status')).toHaveText(/^\d+ tests used$/);
  // The arrow keys change the pool size: 11 leaves one person over, tested alone.
  await page.locator('#scene-canvas').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#v-pool')).toHaveText('11');
  await expect(readout(page)).toContainText('Expected, on average: 20.4.');
  await setRange(page, '#c-prev', 5);
  await expect(readout(page)).toContainText('Best pool size here: 5, about 42.6 tests.');
  await setRange(page, '#c-prev', 35);
  await expect(readout(page)).toContainText('At this prevalence no pool size beats testing everyone separately.');
  await page.getByRole('button', { name: 'Ten tests at once' }).click();
  await expect(page.locator('#scene-name')).toHaveText('The lights say tube 673');
});

test('pools room: the wells fill one by one, then all the tests run at once', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/#room=pools');
  await expect(page.locator('#scene-status')).toContainText('Mixing drops');
  await expect(page.locator('#scene-name')).toHaveText('One tube is glowing. Which?');
  await expect(page.locator('#scene-status')).toHaveText('10 tests · done', { timeout: 10000 });
  await expect(page.locator('#scene-name')).toHaveText('The lights say tube 673');
});
