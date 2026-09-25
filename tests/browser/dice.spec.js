import { test, expect, ROOMS, openRoom, expectRoom, setRange, inkedPixels, tool } from './helpers.js';

const pressed = (page, selector) => expect(page.locator(selector)).toHaveAttribute('aria-pressed', 'true');

test('dice room: I choose after you, roll, and the readouts follow', async ({ page }) => {
  await page.goto('/');
  await expect.poll(() => inkedPixels(page, '#card-dice canvas')).toBeGreaterThan(20);
  await openRoom(page, 'dice');
  await expect(page.locator('#room-title')).toHaveText(ROOMS.dice);
  await expect(page.locator('#scene-name')).toHaveText('Pick first');
  await expect(page.locator('#scene-status')).toHaveText('Ready to roll');
  await expect.poll(() => inkedPixels(page, '#scene-canvas')).toBeGreaterThan(50);
  // You hold A; the room takes C, which beats A.
  await pressed(page, '[data-you="0"]');
  await pressed(page, '[data-rival="-1"]');
  await expect(page.locator('#dice-you-faces')).toHaveText('2 2 4 4 9 9');
  await expect(page.locator('#dice-rival-faces')).toHaveText('3 3 5 5 7 7');
  // Pick B instead: now the room takes A.
  await page.locator('[data-you="1"]').click();
  await pressed(page, '[data-you="1"]');
  await expect(page.locator('[data-you="1"]')).toBeFocused();
  await expect(page.locator('#dice-rival-faces')).toHaveText('2 2 4 4 9 9');
  await expect(page.locator('#dice-seen')).toContainText('A wins: – so far · exactly 5/9 ≈ 56%');
  await expect(page.locator('#dice-verdict')).toHaveText('Exactly, A wins 5/9 of the time. Roll to see it happen.');

  await setRange(page, '#c-speed', 100);
  await expect(page.locator('#v-speed')).toHaveText('100');
  await page.locator('#scene-action').click();
  await expect(page.locator('#dice-rolls')).toHaveText('100', { timeout: 8000 });
  await expect(page.locator('#scene-status')).toHaveText('100 rolls');
  const [you, me] = (await page.locator('#dice-wins').textContent()).match(/\d+/g).map(Number);
  expect(you + me).toBe(100); // no ties between different dice in this set
  await expect(page.locator('#dice-wins')).toHaveText(`You (B) ${you} · Me (A) ${me}`);
  await expect(page.locator('#dice-seen')).toContainText(`A wins: ${me}% so far · exactly 5/9 ≈ 56%`);
  await expect(page.locator('#dice-verdict')).toHaveText(
    `After 100 rolls, A has won ${me}% of the time. The exact chance is 5/9.`,
  );
  expect((await tool(page, 'read_exploration')).settings).toMatchObject({ set: 0, you: 1, rival: -1, speed: 100 });

  await page.locator('#scene-reset').click();
  await expect(page.locator('#dice-rolls')).toHaveText('0');
  await expect(page.locator('#scene-status')).toHaveText('Ready to roll');
});

test('dice room: presets, both dice by hand, and the two-dice twist', async ({ page }) => {
  await page.goto('/#room=dice');
  await expectRoom(page, 'dice');
  await page.getByRole('button', { name: /Efron’s four/ }).click();
  await expect(page.locator('#dice-set')).toHaveValue('1');
  await expect(page.locator('[data-you]')).toHaveCount(4);
  await expect(page.locator('#dice-seen')).toContainText('exactly 2/3');
  // Efron's C has the highest average, yet B, all threes, beats it.
  await page.locator('[data-you="2"]').click();
  await expect(page.locator('#dice-rival-faces')).toHaveText('3 3 3 3 3 3');
  // Choose both dice: B against D is an even match.
  await page.locator('[data-you="1"]').click();
  await page.locator('[data-rival="3"]').click();
  await pressed(page, '[data-rival="3"]');
  await expect(page.locator('#dice-verdict')).toHaveText('These two are evenly matched.');
  await expect(page.locator('#scene-presets [aria-pressed="true"]')).toHaveCount(0);

  await page.getByRole('button', { name: /Two of each/ }).click();
  await expect(page.locator('#scene-name')).toHaveText('Grime’s dice · two each');
  await expect(page.locator('[data-check="pairs"]')).toBeChecked();
  // Two of each: Blue beats Red. One of each: Olive beats Red.
  await expect(page.locator('#dice-rival-faces')).toHaveText('2 2 2 7 7 7');
  await expect(page.locator('#dice-seen')).toContainText('Blue wins');
  await expect(page.locator('#dice-seen')).toContainText('exactly 85/144');
  await page.locator('[data-check="pairs"]').uncheck();
  await expect(page.locator('#scene-name')).toHaveText('Grime’s dice');
  await expect(page.locator('#dice-rival-faces')).toHaveText('0 5 5 5 5 5');
  await expect(page.locator('#dice-seen')).toContainText('exactly 25/36');

  // The dice set select swaps the whole set and keeps focus.
  await page.locator('#dice-set').selectOption('0');
  await expect(page.locator('#dice-set')).toBeFocused();
  await expect(page.locator('[data-you]')).toHaveCount(3);
  await expect(page.locator('[data-check="pairs"]')).toHaveCount(0);

  // Arrow keys on the canvas step through your die.
  await page.locator('#scene-canvas').focus();
  await page.keyboard.press('ArrowRight');
  await pressed(page, '[data-you="1"]');

  // The explanation counts the pairings for the current dice.
  await page.locator('#scene-why').click();
  await expect(page.locator('#dice-grid-note')).toContainText('A wins 20 of the 36 equally likely pairings, B wins 16');
  await page.locator('#insight-close').click();
});

test('dice room: with reduced motion a batch appears at once', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=dice');
  await expect(page.locator('#scene-play')).toHaveText('Play');
  await page.locator('#scene-action').click();
  await expect(page.locator('#dice-rolls')).toHaveText('100');
  await page.locator('#scene-action').click();
  await expect(page.locator('#dice-rolls')).toHaveText('200');
  await expect(page.locator('#dice-verdict')).toContainText('After 200 rolls, C has won');
});

test('dice room: a shared link restores the dice, and odd values fall back safely', async ({ page }) => {
  await page.goto('/#room=dice&set=1&you=2&rival=-1&speed=50&pairs=false');
  await expectRoom(page, 'dice');
  await expect(page.locator('#dice-set')).toHaveValue('1');
  await pressed(page, '[data-you="2"]');
  await expect(page.locator('#dice-rival-faces')).toHaveText('3 3 3 3 3 3');
  await expect(page.locator('#v-speed')).toHaveText('50');
  await page.locator('#scene-share').click();
  const link = await page.evaluate(() => window.__clipboard.at(-1));
  expect(link).toMatch(/#room=dice&set=1&you=2&rival=-1&speed=50&pairs=false$/);

  await page.evaluate(() => (location.hash = 'room=dice&set=2&you=0&pairs=true'));
  await expect(page.locator('#scene-name')).toHaveText('Grime’s dice · two each');
  // Die D doesn't exist in the three-dice set, so the room starts again from A.
  await page.evaluate(() => (location.hash = 'room=dice&set=0&you=3&rival=3'));
  await expect(page.locator('#dice-set')).toHaveValue('0');
  await pressed(page, '[data-you="0"]');
  await pressed(page, '[data-rival="-1"]');
});

/**
 * Seizure safety (WCAG 2.3.1), measured: watch the stage canvas for `seconds` and return the largest share of a
 * 341×256 px window (a 10° field of view at 1024×768) whose pixels change by 10% or more of relative luminance
 * three or more times within one second. That counts every change, not pairs of changes, so it is stricter than
 * the WCAG general-flash threshold.
 */
async function flashingShare(page, seconds = 3) {
  return page.locator('#scene-canvas').evaluate(async (canvas, seconds) => {
    const scale = 0.5; // sample every other pixel; the window scales with it
    const w = Math.max(1, Math.round(canvas.clientWidth * scale)),
      h = Math.max(1, Math.round(canvas.clientHeight * scale));
    const probe = document.createElement('canvas');
    probe.width = w;
    probe.height = h;
    const pctx = probe.getContext('2d', { willReadFrequently: true });
    const linear = new Float32Array(256).map((_, i) => {
      const c = i / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    const n = w * h;
    const ref = new Float32Array(n).fill(-1), // luminance at the last counted change (or extreme since)
      dir = new Int8Array(n), // direction of the last counted change
      last = new Float32Array(n * 2).fill(-9), // times of the two changes before
      count = new Uint32Array(n),
      flashing = new Uint8Array(n);
    const start = performance.now();
    await new Promise((done) => {
      const tick = (now) => {
        const time = (now - start) / 1000;
        pctx.clearRect(0, 0, w, h);
        pctx.drawImage(canvas, 0, 0, w, h);
        const d = pctx.getImageData(0, 0, w, h).data;
        for (let i = 0; i < n; i++) {
          const L = 0.2126 * linear[d[4 * i]] + 0.7152 * linear[d[4 * i + 1]] + 0.0722 * linear[d[4 * i + 2]];
          if (ref[i] < 0) {
            ref[i] = L;
            continue;
          }
          const delta = L - ref[i];
          if (Math.abs(delta) >= 0.1 && Math.min(L, ref[i]) < 0.8 && Math.sign(delta) !== dir[i]) {
            dir[i] = Math.sign(delta);
            ref[i] = L;
            const k = count[i]++;
            if (k >= 2 && time - last[i * 2 + (k % 2)] <= 1) flashing[i] = 1; // three changes within a second
            last[i * 2 + (k % 2)] = time;
          } else if (dir[i] * delta > 0) ref[i] = L; // still moving the same way: follow it
        }
        if (time < seconds) requestAnimationFrame(tick);
        else done();
      };
      requestAnimationFrame(tick);
    });
    // The worst window, from a summed-area table of flashing pixels.
    const fw = Math.round(341 * scale),
      fh = Math.round(256 * scale),
      ww = Math.min(w, fw),
      wh = Math.min(h, fh),
      row = w + 1;
    const sum = new Uint32Array(row * (h + 1));
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++)
        sum[(y + 1) * row + x + 1] =
          flashing[y * w + x] + sum[y * row + x + 1] + sum[(y + 1) * row + x] - sum[y * row + x];
    let worst = 0;
    for (let y = 0; y + wh <= h; y += 2)
      for (let x = 0; x + ww <= w; x += 2) {
        const inside =
          sum[(y + wh) * row + x + ww] - sum[y * row + x + ww] - sum[(y + wh) * row + x] + sum[y * row + x];
        worst = Math.max(worst, inside / (fw * fh));
      }
    return worst;
  }, seconds);
}

test('dice room: a fast batch never flashes, and its verdict is announced once', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('/#room=dice');
  await expect(page.locator('#scene-play')).toBeHidden(); // turn-based: nothing to pause
  await expect(page.locator('#dice-verdict')).not.toHaveAttribute('role', 'status');
  await setRange(page, '#c-speed', 100);
  await page.waitForTimeout(300);
  await page.locator('#scene-action').click();
  expect(await flashingShare(page)).toBeLessThanOrEqual(0.25);
  await expect(page.locator('#dice-rolls')).toHaveText('100');
  await expect(page.locator('#announcer')).toHaveText(/^After 100 rolls, C has won \d+% of the time\./);
  // The slow speed too, with two dice each.
  await page.getByRole('button', { name: /Two of each/ }).click();
  await setRange(page, '#c-speed', 20);
  await page.locator('#scene-action').click();
  expect(await flashingShare(page)).toBeLessThanOrEqual(0.25);
});
