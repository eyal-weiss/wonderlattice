import { test, expect, setRange } from './helpers.js';

const status = (page) => page.locator('#scene-status');
const announced = (page) => page.locator('#announcer');
const canvas = (page) => page.locator('#scene-canvas');

/** Where person `i` sits on the ring, in page pixels (the room's layout, as in room.js). */
async function personAt(page, i) {
  await canvas(page).evaluate((c) => c.scrollIntoView({ block: 'start' }));
  const box = await canvas(page).boundingBox();
  const w = box.width,
    h = box.height;
  const m = Math.max(12, Math.min(w, h) * 0.03);
  let D, cx, cy;
  if (w - 3 * m - 200 >= 0.7 * (h - 2 * m)) {
    D = Math.min(h - 2 * m, (w - 3 * m) * 0.64);
    [cx, cy] = [m + D / 2, h / 2];
  } else if (h - 3 * m - 170 >= 0.7 * (w - 2 * m)) {
    D = Math.min(w - 2 * m, (h - 3 * m) * 0.64);
    [cx, cy] = [w / 2, m + D / 2];
  } else {
    D = Math.min(w, h) - 2 * m;
    [cx, cy] = [w / 2, h / 2];
  }
  const R = (D / 2) * 0.9,
    a = -Math.PI / 2 + (2 * Math.PI * i) / 200;
  return { x: box.x + cx + Math.cos(a) * R, y: box.y + cy + Math.sin(a) * R };
}

test('handshakes: opens on the plain ring, then five random friendships nearly halve the distance', async ({
  page,
}) => {
  await page.goto('/#room=handshakes');
  await expect(page.locator('body')).toHaveAttribute('data-room', 'handshakes');
  // The far side of the ring is 50 handshakes away, until the shortcuts arrive by themselves.
  await expect(status(page)).toHaveText('You to them: 50 handshakes');
  await expect(status(page)).toHaveText('You to them: 16 handshakes', { timeout: 15000 });
  await expect(announced(page)).toHaveText('With 5 shortcuts, two people are 13.7 handshakes apart on average.', {
    timeout: 10000,
  });
  await expect(page.locator('#c-shortcuts')).toHaveValue('5');
});

test('handshakes: start again for a plain ring, then each shortcut shortens the world', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=handshakes');
  await expect(status(page)).toHaveText('You to them: 16 handshakes');
  await page.locator('#scene-reset').click();
  await expect(page.locator('#c-shortcuts')).toHaveValue('0');
  await expect(status(page)).toHaveText('You to them: 50 handshakes');
  // New strangers each time: Start again draws other shortcuts, and the link remembers which.
  await page.locator('#scene-action').click();
  await expect(page.locator('#c-shortcuts')).toHaveValue('1');
  await canvas(page).focus();
  await page.keyboard.press('+');
  await expect(page.locator('#c-shortcuts')).toHaveValue('2');
  await setRange(page, '#c-shortcuts', 60);
  await expect(status(page)).not.toHaveText('You to them: 50 handshakes');
  const steps = Number((await status(page).textContent()).match(/\d+/)[0]);
  expect(steps).toBeLessThanOrEqual(12);
});

test('handshakes: tap anyone, or walk round the ring with the keys, to count the handshakes to them', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=handshakes&shortcuts=0');
  await expect(status(page)).toHaveText('You to them: 50 handshakes');
  // On the plain ring someone 50 places round is 25 handshakes away (two places per handshake).
  const right = await personAt(page, 50);
  await page.mouse.click(right.x, right.y);
  await expect(status(page)).toHaveText('You to them: 25 handshakes');
  const next = await personAt(page, 2);
  await page.mouse.click(next.x, next.y);
  await expect(status(page)).toHaveText('You to them: 1 handshake');
  // Tapping yourself changes nothing, and nor does the middle of the ring, where nobody sits.
  const you = await personAt(page, 0);
  await page.mouse.click(you.x, you.y);
  const opposite = await personAt(page, 100);
  await page.mouse.click((you.x + opposite.x) / 2, (you.y + opposite.y) / 2);
  await expect(status(page)).toHaveText('You to them: 1 handshake');
  await canvas(page).focus();
  await page.keyboard.press('ArrowDown');
  await expect(status(page)).toHaveText('You to them: 6 handshakes');
  await page.keyboard.press('ArrowRight');
  await expect(status(page)).toHaveText('You to them: 7 handshakes');
});

test('handshakes: a rumour reaches everyone in 50 rounds on the ring, far fewer with shortcuts', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=handshakes&shortcuts=0&rumour=true');
  await expect(status(page)).toHaveText('Everyone has heard after 50 rounds');
  await setRange(page, '#c-shortcuts', 20);
  const rounds = Number((await status(page).textContent()).match(/\d+/)[0]);
  expect(rounds).toBeLessThan(25);
  // The rumour preset spreads it, live, round by round.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#room=handshakes');
  await page.reload();
  await page.locator('#scene-presets .scene-preset').nth(2).click();
  await expect(page.locator('[data-check="rumour"]')).toBeChecked();
  await expect(status(page)).toHaveText(/^Round \d+: \d+ of 200 (has|have) heard$/);
  await expect(status(page)).toHaveText(/^Everyone has heard after \d+ rounds?$/, { timeout: 15000 });
});

test('handshakes: a shared link keeps its shortcuts and strangers, and ignores numbers out of range', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=handshakes&shortcuts=12&seed=7');
  await expect(page.locator('#c-shortcuts')).toHaveValue('12');
  const twelve = await status(page).textContent();
  await page.goto('/#room=handshakes&shortcuts=12&seed=8');
  await page.reload();
  await expect(page.locator('#c-shortcuts')).toHaveValue('12');
  await page.goto('/#room=handshakes&shortcuts=12&seed=7');
  await page.reload();
  await expect(status(page)).toHaveText(twelve);
  await page.goto('/#room=handshakes&shortcuts=999');
  await page.reload();
  await expect(page.locator('#c-shortcuts')).toHaveValue('5');
});
