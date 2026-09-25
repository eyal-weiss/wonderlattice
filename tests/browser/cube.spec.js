import { test, expect, openRoom, tool } from './helpers.js';

const settings = async (page) => (await tool(page, 'read_exploration')).settings;

test('the cube builds a sequence, counts repeats, and undoes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await openRoom(page, 'cube');
  await expect(page.locator('#cube-readout')).toContainText('R U');
  await expect(page.locator('#cube-readout')).toContainText('Comes home after 105 repeats');
  await page.locator('#cube-clear').click();
  await expect(page.locator('#scene-status')).toHaveText('Solved');
  await page.getByRole('button', { name: 'R: turn the right face clockwise', exact: true }).click();
  await page.getByRole('button', { name: 'U: turn the top face clockwise', exact: true }).click();
  await page.getByRole('button', { name: 'R′: turn the right face anticlockwise', exact: true }).click();
  await page.getByRole('button', { name: 'U′: turn the top face anticlockwise', exact: true }).click();
  await expect(page.locator('#cube-readout')).toContainText('R U R′ U′');
  await expect(page.locator('#cube-readout')).toContainText('Comes home after 6 repeats');
  await expect(page.locator('#scene-status')).toHaveText('7 pieces moved');
  await page.locator('#scene-action').click();
  await expect(page.locator('#cube-readout')).toContainText('done 2 times');
  await page.locator('#cube-home').click();
  await expect(page.locator('#scene-status')).toHaveText('Solved');
  await expect(page.locator('#cube-readout')).toContainText('done 6 times');
  await page.locator('#cube-undo').click();
  await expect(page.locator('#cube-readout')).toContainText('done 5 times');
  expect(await settings(page)).toMatchObject({ repeats: 5 });
});

test('R U really needs 105 repeats to come home, and the counter doesn’t give it away', async ({ page }) => {
  await page.goto('/#room=cube');
  await page.getByRole('button', { name: /Back where it started/ }).click();
  await page.locator('#cube-home').click();
  // While the repeats play, the status reflects the cube as it is, not the ending.
  await expect(page.locator('#scene-status')).not.toHaveText('Solved');
  await expect(page.locator('#scene-status')).toHaveText('Solved', { timeout: 30000 });
  await expect(page.locator('#cube-readout')).toContainText('done 105 times');
});

test('comparing two orders shows when moves commute', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=cube');
  await page.getByRole('button', { name: /Order matters/ }).click();
  await expect(page.locator('#cube-readout')).toContainText('different order');
  await page.locator('#cube-b').selectOption('4'); // L commutes with R
  await page.locator('#scene-action').click();
  await expect(page.locator('#cube-readout')).toContainText('commute');
});

test('a shared cube link restores the sequence; a broken code falls back safely', async ({ page }) => {
  await page.goto('/#room=cube&seq=2&repeats=3&mode=0');
  await expect(page.locator('#cube-readout')).toContainText('R');
  expect(await settings(page)).toMatchObject({ seq: 2, repeats: 3 });
  await page.evaluate(() => (location.hash = 'room=cube&seq=13&mode=0'));
  await expect(page.locator('#cube-readout')).toContainText('No moves yet');
});

test('actions redraw the cube even when nothing is animating (reduced motion)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=cube');
  const picture = () => page.locator('#scene-canvas').evaluate((c) => c.toDataURL());
  const before = await picture();
  await page.locator('#scene-action').click(); // Repeat it
  await expect.poll(picture).not.toBe(before);
  const once = await picture();
  await page.locator('#cube-home').click();
  await expect.poll(picture).not.toBe(once);
  await expect(page.locator('#scene-status')).toHaveText('Solved');
});

test('leaving mid-repeat and coming back shows a consistent status', async ({ page }) => {
  await page.goto('/#room=cube');
  await page.locator('#cube-home').click();
  await page.waitForTimeout(600);
  await page.locator('#room-next').click();
  await page.locator('#room-prev').click();
  await expect(page.locator('body')).toHaveAttribute('data-room', 'cube');
  await expect(page.locator('#scene-status')).toHaveText('Solved');
  await expect(page.locator('#cube-readout')).toContainText('done 105 times');
});

test('compare mode waits for a turn before claiming a difference', async ({ page }) => {
  await page.goto('/#room=cube');
  await page.locator('[data-mode="1"]').click();
  await expect(page.locator('#cube-readout')).toContainText('Press “Turn them”');
  await page.locator('#scene-action').click();
  await expect(page.locator('#cube-readout')).toContainText('different order');
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

test('repeating never flashes: at most a quarter of a 10° field changes three times a second', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('/#room=cube');
  await expect(page.locator('#scene-play')).toBeHidden(); // turn-based: nothing to pause
  await page.waitForTimeout(400);
  await page.locator('#cube-home').click();
  expect(await flashingShare(page)).toBeLessThanOrEqual(0.25);
  // The counter still ticks while it runs.
  await expect(page.locator('#cube-readout')).not.toContainText('done 105 times');
  await page.getByRole('button', { name: /Only a few pieces move/ }).click();
  await page.locator('#scene-action').click();
  await page.locator('#scene-action').click();
  expect(await flashingShare(page)).toBeLessThanOrEqual(0.25);
  await expect(page.locator('#cube-readout')).toContainText('done 3 times');
});

test('move buttons are named by what they show, with the notation explained', async ({ page }) => {
  await page.goto('/#room=cube');
  const buttons = page.locator('.cube-move');
  await expect(buttons).toHaveCount(12);
  for (const button of await buttons.all()) {
    const shown = (await button.textContent()).trim();
    expect(await button.getAttribute('aria-label')).toMatch(new RegExp(`^${shown}: turn the \\w+ face`));
  }
  await expect(page.getByRole('button', { name: 'F′: turn the front face anticlockwise', exact: true })).toBeVisible();
  await expect(page.locator('.cube-key')).toContainText('U = up, R = right');
});

test('the readout says when a new sequence starts, and a finished run is announced once', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=cube');
  await expect(page.locator('#cube-readout')).not.toHaveAttribute('role', 'status');
  await page.locator('#scene-action').click(); // R U, done twice
  await expect(page.locator('#announcer')).toHaveText('Done 2 times. 13 pieces moved. Comes home after 105 repeats.');
  await page.locator('#cube-home').click();
  await expect(page.locator('#announcer')).toHaveText('Solved. Comes home after 105 repeats.');
  await page.getByRole('button', { name: 'F: turn the front face clockwise', exact: true }).click();
  await expect(page.locator('#cube-readout')).toContainText('A new sequence starts from here.');
});
