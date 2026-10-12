import { test, expect, openRoom } from './helpers.js';

const status = (page) => page.locator('#scene-status');
const readout = (page) => page.locator('#beam-readout');
// The I-beam as a link writes it: one setting per row of the cross-section, bit c for column c (see the model).
const FLANGE = 1016, // columns 3 to 9
  WEB = 64; // column 6
const IBEAM = ['ra', 'rb', 'rc', 'rd', 're', 'rf', 'rg', 'rh', 'ri', 'rj', 'rk', 'rl']
  .map((k, r) => `${k}=${r === 0 || r === 11 ? FLANGE : WEB}`)
  .join('&');

/** Where the middle of a square of the cross-section is drawn on a wide picture (measure in room.js). */
const cell = (page, r, c) =>
  page.locator('#scene-canvas').evaluate(
    (canvas, [r, c]) => {
      const { width, height } = canvas.getBoundingClientRect();
      const cs = Math.max(12, Math.floor(Math.min(width * 0.42, height * 0.58, 432, height - 150) / 12));
      return { x: 20 + (c + 0.5) * cs, y: 46 + (r + 0.5) * cs };
    },
    [r, c],
  );

async function tap(page, r, c) {
  await page.locator('#scene-canvas').evaluate((el) => el.scrollIntoView({ block: 'start' }));
  await page.locator('#scene-canvas').click({ position: await cell(page, r, c) });
}

test('beam room: by itself, the flat plank stands on its edge, then becomes an I-beam', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'beam');
  await expect(page.locator('#room-title')).toHaveText('The ruler on its edge.');
  await expect(page.locator('#scene-name')).toHaveText('A flat plank');
  await expect(status(page)).toHaveText('Sag 34 mm');
  await expect(readout(page)).toContainText('The flat plank');
  // Within seconds, with no click: a quarter turn, 36 times stiffer.
  await expect(page.locator('#scene-name')).toHaveText('On its edge', { timeout: 10000 });
  await expect(status(page)).toHaveText('Sag 0.96 mm');
  await expect(readout(page)).toContainText('36× the flat plank');
  // Then the steel slides to the top and the bottom.
  await expect(page.locator('#scene-name')).toHaveText('An I-beam', { timeout: 10000 });
  await expect(status(page)).toHaveText('Sag 0.54 mm');
  await expect(readout(page)).toContainText('63.5× the flat plank');
  await expect(readout(page)).toContainText('As stiff as 24 squares can be in this grid.');
  await expect(page.getByRole('button', { name: /An I-beam/ })).toHaveAttribute('aria-pressed', 'true');
});

test('beam room: with reduced motion, Turn it 90° stands the plank on its edge at once, and warns of a wobble', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=beam');
  await expect(page.locator('#scene-name')).toHaveText('A flat plank');
  await page.waitForTimeout(3500); // nothing plays by itself
  await expect(page.locator('#scene-name')).toHaveText('A flat plank');
  await page.getByRole('button', { name: 'Turn it 90°' }).click();
  await expect(page.locator('#scene-name')).toHaveText('On its edge');
  await expect(status(page)).toHaveText('Sag 0.96 mm');
  await expect(readout(page)).toContainText('36× the flat plank');
  await expect(readout(page)).toContainText('it could tip over, or twist sideways');
  await page.getByRole('button', { name: /An I-beam/ }).click();
  await expect(status(page)).toHaveText('Sag 0.54 mm');
  await expect(readout(page)).not.toContainText('tip over');
  // On its side, the I is no better than its own flanges' width allows.
  await page.getByRole('button', { name: 'Turn it 90°' }).click();
  await expect(page.locator('#scene-name')).toHaveText('Your own beam');
  await expect(status(page)).toHaveText('Sag 4.8 mm');
  await expect(readout(page)).toContainText('7.3× the flat plank');
  // Undo turns it back.
  await page.locator('#beam-undo').click();
  await expect(page.locator('#scene-name')).toHaveText('An I-beam');
});

test('beam room: cut the web and the flanges bend on their own; Undo, the keys and a full budget', async ({ page }) => {
  await page.goto(`/#room=beam&${IBEAM}`);
  await page.locator('#scene-play').click();
  await expect(page.locator('#scene-play')).toHaveText('Play');
  await expect(page.locator('#scene-name')).toHaveText('An I-beam');
  await expect(readout(page)).toContainText('All 24 squares of steel used.');
  // Tap one square of the web out: two loose pieces, nearly nine times the sag.
  await tap(page, 6, 6);
  await expect(readout(page)).toContainText('2 loose pieces');
  await expect(readout(page)).toContainText('23 of 24 squares of steel used.');
  await expect(status(page)).toHaveText('Sag 4.7 mm');
  await expect(readout(page)).toContainText('7.4× the flat plank');
  await expect(page.locator('#scene-name')).toHaveText('Your own beam');
  await page.locator('#beam-undo').click();
  await expect(readout(page)).toContainText('As stiff as 24 squares can be in this grid.');
  // A link keeps the shape.
  await page.locator('#scene-share').click();
  const link = await page.evaluate(() => window.__clipboard.at(-1));
  expect(link).toContain(`ra=${FLANGE}`);
  expect(link).toContain(`rf=${WEB}`);
  // With every square used, tapping an empty one adds nothing.
  await tap(page, 5, 0);
  await expect(readout(page)).toContainText('All 24 squares of steel used.');
  await expect(readout(page)).toContainText('As stiff as 24 squares can be in this grid.');
  // The keyboard: the arrows move to a square, Enter paints or erases it, Backspace undoes.
  await page.locator('#scene-canvas').focus();
  await page.keyboard.press('ArrowDown'); // the first press lands near the middle: row 5, column 5, from 0
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect(readout(page)).toContainText('2 loose pieces');
  await page.keyboard.press('Backspace');
  await expect(readout(page)).toContainText('As stiff as 24 squares can be in this grid.');
  // Clear takes all the steel away; one square alone sags far past what the simple theory can say.
  await page.locator('#beam-clear').click();
  await expect(status(page)).toHaveText('No steel');
  await expect(readout(page)).toContainText('Paint some squares of steel in the grid.');
  await tap(page, 0, 0);
  await expect(status(page)).toHaveText('Sag over 10 cm');
  await expect(readout(page)).toContainText('1 of 24 squares of steel used.');
  // Start again goes back to the I-beam the link opened.
  await page.locator('#scene-reset').click();
  await expect(page.locator('#scene-name')).toHaveText('An I-beam');
});
