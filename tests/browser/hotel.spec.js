import { test, expect } from './helpers.js';

const status = (page) => page.locator('#scene-status');
const name = (page) => page.locator('#scene-name');
const card = (page, which) => page.locator(`#scene-controls [data-card="${which}"]`);

/**
 * The coin-flip coach as the canvas shows it: 'H' or 'T' for each flip of the new passenger (row 'passenger') or of
 * room r's guest. The layout follows the room's: the passenger's row on top, then the 8 × 8 list.
 */
const flipsShown = (page, which) =>
  page.locator('#scene-canvas').evaluate((canvas, which) => {
    const b = canvas.getBoundingClientRect(),
      W = b.width,
      H = b.height;
    const wide = W >= 600;
    const label = Math.max(50, Math.min(110, W * 0.14));
    const head = wide ? 24 : 16,
      gap = wide ? 22 : 10;
    const cell = Math.min((W - label - 48) / 8, (H - 24 - 2 * head - gap) / 9.05);
    const x = Math.max(12 + label, Math.min((W - 8 * cell) / 2, W * 0.3));
    const top = 12 + head;
    const y = which === 'passenger' ? top + cell / 2 : top + cell + gap + head + (which + 0.5) * cell;
    const scale = canvas.width / W;
    const ctx = canvas.getContext('2d');
    const out = [];
    for (let f = 0; f < 8; f++) {
      // Left of the coin's centre, clear of its letter.
      const px = Math.round((x + (f + 0.5) * cell - cell * 0.27) * scale),
        py = Math.round(y * scale);
      const [r, g, bl] = ctx.getImageData(px, py, 1, 1).data;
      out.push(
        Math.hypot(r - 240, g - 196, bl - 60) < 60 ? 'H' : Math.hypot(r - 79, g - 111, bl - 153) < 60 ? 'T' : '?',
      );
    }
    return out.join('');
  }, which);

test('the full hotel fits one more guest, then an endless coach, by itself', async ({ page }) => {
  await page.goto('/#room=hotel');
  await expect(page.locator('#room-title')).toHaveText('The hotel that is always full.');
  await expect(name(page)).toHaveText('One more guest');
  await expect(status(page)).toHaveText('A new guest knocks. Every room is taken.');
  await expect(status(page)).toHaveText('Room 1 came free. Still no vacancies.', { timeout: 15000 });
  await expect(name(page)).toHaveText('An endless coach', { timeout: 15000 });
  await expect(status(page)).toHaveText('Passenger n has room 2n − 1. Still no vacancies.', { timeout: 15000 });
  await expect(card(page, 'double')).toHaveAttribute('aria-pressed', 'true');
});

test('the cards: +5 leaves the coach waiting, and the zigzag seats endless coaches where ×2 cannot', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=hotel&level=1');
  await expect(name(page)).toHaveText('An endless coach');
  await expect(status(page)).toHaveText('An endless coach arrives.');
  await card(page, 'one').click();
  await expect(status(page)).toHaveText('Passenger 1 is in. Passengers 2, 3, 4, … wait.');
  await card(page, 'five').click();
  await expect(status(page)).toHaveText('Passengers 1 to 5 are in. 6, 7, 8, … wait.');
  await card(page, 'double').click();
  await expect(status(page)).toHaveText('Passenger n has room 2n − 1. Still no vacancies.');

  await page.locator('#scene-action').click();
  await expect(name(page)).toHaveText('Endless coaches');
  await expect(page.locator('.scene-preset').nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(card(page, 'one')).toHaveCount(0);
  await card(page, 'double').click();
  await expect(status(page)).toHaveText('Coach 1 is in. Coaches 2, 3, 4, … wait.');
  await card(page, 'zigzag').click();
  await expect(status(page)).toHaveText('Every seat of every coach has a room.');

  await page.locator('#scene-action').click();
  await expect(name(page)).toHaveText('The coin-flip coach');
  await expect(status(page)).toHaveText('No room has them: they differ from room k at flip k.');
});

test('the zigzag traces itself out, room by room', async ({ page }) => {
  await page.goto('/#room=hotel&level=2');
  await card(page, 'zigzag').click();
  await expect(status(page)).toHaveText(/^Room \d+: (coach \d+, seat \d+|the guest from room \d+)$/);
  await expect(status(page)).toHaveText('Every seat of every coach has a room.', { timeout: 30000 });
});

test('the coin-flip coach: the diagonal, flipped, is a passenger no room holds, whatever the list', async ({
  page,
}) => {
  // A list of nothing but tails: the passenger the diagonal builds is all heads.
  await page.goto('/#room=hotel&level=3&lista=0&listb=0');
  await expect(name(page)).toHaveText('The coin-flip coach');
  await expect(status(page)).toHaveText(/^Flip \d: the opposite of room \d’s flip \d$/);
  await expect(status(page)).toHaveText('No room has them: they differ from room k at flip k.', { timeout: 15000 });
  await page.locator('#scene-play').click(); // paused, so the picture holds still to be read
  await page.locator('#scene-canvas').evaluate((el) => el.scrollIntoView({ block: 'start' }));
  expect(await flipsShown(page, 'passenger')).toBe('HHHHHHHH');
  expect(await flipsShown(page, 0)).toBe('TTTTTTTT');

  // Arrows aim (the first press shows the aim on room 1's first flip), Enter flips it: so does the passenger's.
  await page.locator('#scene-canvas').focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Escape');
  await expect(status(page)).toHaveText('A new diagonal, and still someone left out.');
  expect(await flipsShown(page, 0)).toBe('HTTTTTTT');
  expect(await flipsShown(page, 'passenger')).toBe('THHHHHHH');

  // A tap on room 2's second flip.
  const box = await page.locator('#scene-canvas').boundingBox();
  const at = await page.locator('#scene-canvas').evaluate((canvas) => {
    const W = canvas.getBoundingClientRect().width,
      H = canvas.getBoundingClientRect().height;
    const wide = W >= 600;
    const label = Math.max(50, Math.min(110, W * 0.14));
    const head = wide ? 24 : 16,
      gap = wide ? 22 : 10;
    const cell = Math.min((W - label - 48) / 8, (H - 24 - 2 * head - gap) / 9.05);
    const x = Math.max(12 + label, Math.min((W - 8 * cell) / 2, W * 0.3));
    return { x: x + 1.5 * cell, y: 12 + head + cell + gap + head + 1.5 * cell };
  });
  expect(at.y).toBeLessThan(box.height);
  await page.locator('#scene-canvas').click({ position: at });
  expect(await flipsShown(page, 1)).toBe('THTTTTTT');
  expect(await flipsShown(page, 'passenger')).toBe('TTHHHHHH');

  // "+1" seats the passenger in room 1, and the new diagonal leaves someone else out.
  await card(page, 'admit').click();
  await expect(status(page)).toHaveText('Seated in room 1, yet the new diagonal leaves someone out.');
  expect(await flipsShown(page, 0)).toBe('TTHHHHHH');
  expect(await flipsShown(page, 1)).toBe('HTTTTTTT');
  expect(await flipsShown(page, 'passenger')).toBe('HHHHHHHH');
});

test('with reduced motion the hotel opens with the guest already in, and a shared list comes back', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=hotel');
  await expect(status(page)).toHaveText('Room 1 came free. Still no vacancies.');
  await page.waitForTimeout(5000);
  await expect(name(page)).toHaveText('One more guest');

  await page.goto('/#room=hotel&level=3&lista=4294967295&listb=0');
  await page.reload();
  await expect(status(page)).toHaveText('No room has them: they differ from room k at flip k.');
  await page.locator('#scene-canvas').evaluate((el) => el.scrollIntoView({ block: 'start' }));
  expect(await flipsShown(page, 0)).toBe('HHHHHHHH');
  expect(await flipsShown(page, 4)).toBe('TTTTTTTT');
  expect(await flipsShown(page, 'passenger')).toBe('TTTTHHHH');
});
