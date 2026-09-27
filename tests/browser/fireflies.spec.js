import { test, expect, setRange } from './helpers.js';

test('fireflies: past the edge they fall into step, and it is announced once', async ({ page }) => {
  await page.goto('/#room=fireflies');
  await expect(page.locator('body')).toHaveAttribute('data-room', 'fireflies');
  await expect(page.locator('#scene-status')).toHaveText('Each to its own rhythm');
  await setRange(page, '#c-coupling', 2.5);
  await expect(page.locator('#scene-status')).toHaveText('Flashing together', { timeout: 20000 });
  await expect(page.locator('#announcer')).toHaveText('Most of the fireflies now flash together.');
  expect(Number((await page.locator('#fireflies-together').textContent()).replace('%', ''))).toBeGreaterThan(80);
});

test('fireflies: after a flight they catch up with the new day over a few days, not at once', async ({ page }) => {
  await page.goto('/#room=fireflies&coupling=1.5&sun=true');
  await expect(page.locator('#fireflies-fly')).toBeEnabled();
  await expect(page.locator('#scene-status')).toHaveText('Flashing together', { timeout: 20000 });
  await page.waitForTimeout(1500); // settle onto the day
  await page.locator('#fireflies-fly').click();
  await expect(page.locator('#scene-status')).toHaveText(/^After the flight · day \d+$/);
  await expect(page.locator('#scene-status')).toHaveText(/^Caught up with the new day after [2-9] days\.$/, {
    timeout: 20000,
  });
  // Without a day–night cycle there is nothing to fly away from.
  await page.locator('[data-check="sun"]').click();
  await expect(page.locator('#fireflies-fly')).toBeDisabled();
});

/**
 * Seizure safety (WCAG 2.3.1), measured as in the dice and cube rooms: watch the stage canvas and return the largest
 * share of a 341×256 px window (a 10° field of view at 1024×768) whose pixels change by 10% or more of relative
 * luminance three or more times within one second.
 */
async function flashingShare(page, seconds = 4) {
  return page.locator('#scene-canvas').evaluate(async (canvas, seconds) => {
    const scale = 0.5;
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
    const ref = new Float32Array(n).fill(-1),
      dir = new Int8Array(n),
      last = new Float32Array(n * 2).fill(-9),
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
            if (k >= 2 && time - last[i * 2 + (k % 2)] <= 1) flashing[i] = 1;
            last[i * 2 + (k % 2)] = time;
          } else if (dir[i] * delta > 0) ref[i] = L;
        }
        if (time < seconds) requestAnimationFrame(tick);
        else done();
      };
      requestAnimationFrame(tick);
    });
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

test('fireflies: even flashing all together, nothing flashes three times a second', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('/#room=fireflies&coupling=3&sun=true');
  await expect(page.locator('#scene-status')).toHaveText('Flashing together', { timeout: 20000 });
  // Measured about 0.02: soft glows drifting past a pixel. The dice and cube rooms allow 0.25; this is far stricter.
  expect(await flashingShare(page)).toBeLessThanOrEqual(0.08);
});
