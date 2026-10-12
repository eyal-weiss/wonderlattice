import { test, expect, openRoom, setRange } from './helpers.js';

// The chaos game: a dot jumping halfway to random corners draws the Sierpiński triangle, never landing in a hole;
// four corners give fog, and a rule ("never the same corner twice") brings holes back.

/** The canvas pixels lit by dots, by colour family (yellow, pink, green, blue, violet, orange), and in total. */
function litPixels(page) {
  return page.locator('#scene-canvas').evaluate((canvas) => {
    const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    let lit = 0;
    for (let i = 0; i < data.length; i += 4) if (data[i] + data[i + 1] + data[i + 2] > 150) lit++;
    return lit;
  });
}

/**
 * Lit pixels in boxes given as fractions of the shape's box ([x0, x1, y0, y1], y down). The shape's box is found
 * from the lit pixels themselves, leaving out the two lines of words under the picture.
 */
function litIn(page, boxes) {
  return page.locator('#scene-canvas').evaluate((canvas, boxes) => {
    const { width, height } = canvas;
    const { data } = canvas.getContext('2d').getImageData(0, 0, width, height);
    const lit = (x, y) => {
      const o = (y * width + x) * 4;
      return data[o] + data[o + 1] + data[o + 2] > 120;
    };
    const words = Math.round((70 * height) / canvas.getBoundingClientRect().height);
    const rows = new Array(height).fill(0),
      cols = new Array(width).fill(0);
    for (let y = 0; y < height - words; y++)
      for (let x = 0; x < width; x++)
        if (lit(x, y)) {
          rows[y]++;
          cols[x]++;
        }
    const ys = rows.flatMap((n, y) => (n > width * 0.005 ? [y] : []));
    const xs = cols.flatMap((n, x) => (n > height * 0.005 ? [x] : []));
    const [x0, x1, y0, y1] = [xs[0], xs.at(-1), ys[0], ys.at(-1)];
    return boxes.map(([a, b, c, d]) => {
      let n = 0;
      for (let y = Math.round(y0 + c * (y1 - y0)); y < y0 + d * (y1 - y0); y++)
        for (let x = Math.round(x0 + a * (x1 - x0)); x < x0 + b * (x1 - x0); x++) if (lit(x, y)) n++;
      return n;
    });
  }, boxes);
}

/** The top corner's handle (the yellow dot at the apex): the topmost yellow pixel, a few pixels down. */
function topCorner(page) {
  return page.locator('#scene-canvas').evaluate((canvas) => {
    const { width, height } = canvas;
    const { data } = canvas.getContext('2d').getImageData(0, 0, width, height);
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const o = (y * width + x) * 4;
        if (data[o] > 230 && data[o + 1] > 190 && data[o + 1] < 225 && data[o + 2] < 130) {
          const r = canvas.getBoundingClientRect();
          return { x: r.left + ((x + 0.5) / width) * r.width, y: r.top + ((y + 5) / height) * r.height };
        }
      }
    return null;
  });
}

test('chaos room: it opens jumping, and the dots draw the Sierpiński triangle without ever landing in its hole', async ({
  page,
}) => {
  test.slow(); // it waits for the slow opening jumps
  await page.goto('/');
  await openRoom(page, 'chaos');
  await expect(page.locator('#scene-name')).toHaveText('Three corners');
  // The first jumps are slow, and kept out of the picture.
  await expect(page.locator('#scene-status')).toHaveText(/Jumps so far: [1-6]$/);
  await expect(page.locator('#scene-status')).toHaveText('Dots in the middle hole: not one', { timeout: 15000 });
  await expect.poll(() => litPixels(page), { timeout: 15000 }).toBeGreaterThan(5000);
  // Well inside the big middle hole: dark. Inside the copy at the bottom left: dots.
  const HOLE = [0.42, 0.58, 0.56, 0.7],
    COPY = [0.12, 0.24, 0.82, 0.94];
  await expect.poll(async () => (await litIn(page, [HOLE]))[0], { timeout: 6000 }).toBe(0);
  expect((await litIn(page, [COPY]))[0]).toBeGreaterThan(20);
});

test('chaos room: four corners make fog, and “never the same corner twice” brings holes back', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // each game is played to the end at once
  await page.goto('/#room=chaos');
  await page.locator('#scene-presets .scene-preset', { hasText: 'Four corners' }).click();
  await expect(page.locator('#scene-name')).toHaveText('Four corners');
  const quarters = [
    [0, 0.5, 0, 0.5],
    [0.5, 1, 0, 0.5],
    [0, 0.5, 0.5, 1],
    [0.5, 1, 0.5, 1],
  ];
  const fog = await litIn(page, quarters);
  for (const n of fog) expect(n).toBeGreaterThan(Math.max(...fog) * 0.8);
  await page.locator('[data-check="rule"]').check();
  await expect(page.locator('#scene-name')).toHaveText('Four, and a rule');
  // The quarter-size square at each corner can't be reached: the last two jumps would both go to that corner.
  const corners = await litIn(page, [
    [0.03, 0.22, 0.03, 0.22],
    [0.78, 0.97, 0.03, 0.22],
    [0.03, 0.22, 0.78, 0.97],
    [0.78, 0.97, 0.78, 0.97],
    [0.3, 0.7, 0.3, 0.7],
  ]);
  expect(corners.slice(0, 4)).toEqual([0, 0, 0, 0]);
  expect(corners[4]).toBeGreaterThan(1000);
});

test('chaos room: with reduced motion the finished picture shows at once and holds still', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=chaos');
  await expect(page.locator('#scene-play')).toHaveText('Play');
  await expect.poll(() => litPixels(page)).toBeGreaterThan(20000);
  await expect(page.locator('#scene-status')).toHaveText('Dots in the middle hole: not one');
  const before = await litPixels(page);
  await page.waitForTimeout(600);
  expect(await litPixels(page)).toBe(before);
  // “One jump” makes exactly one more jump.
  await page.locator('#scene-presets .scene-preset', { hasText: 'Four corners' }).click();
  const jumps = Number((await page.locator('#scene-status').textContent()).replace(/\D/g, ''));
  await page.getByRole('button', { name: 'One jump' }).click();
  await expect(page.locator('#scene-status')).toHaveText(`Jumps so far: ${(jumps + 1).toLocaleString('en')}`);
});

test('chaos room: a tap starts the dot again from there; Enter makes one jump and pauses', async ({ page }) => {
  await page.goto('/#room=chaos');
  const canvas = page.locator('#scene-canvas');
  await canvas.scrollIntoViewIfNeeded();
  await expect(page.locator('#scene-status')).toHaveText('Dots in the middle hole: not one', { timeout: 15000 });
  const box = await canvas.boundingBox();
  await page.mouse.click(box.x + box.width * 0.2, box.y + box.height * 0.3);
  await expect(page.locator('#scene-status')).toHaveText(/Jumps so far: [0-6]$/);
  await canvas.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#scene-play')).toHaveText('Play');
  const status = await page.locator('#scene-status').textContent();
  await page.waitForTimeout(500);
  await expect(page.locator('#scene-status')).toHaveText(status);
});

test('chaos room: drag a corner and the fractal follows; the link keeps the new shape', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=chaos');
  const canvas = page.locator('#scene-canvas');
  await canvas.evaluate((el) => el.scrollIntoView({ block: 'start' }));
  await expect.poll(() => litPixels(page)).toBeGreaterThan(20000);
  const top = await topCorner(page);
  expect(top).not.toBeNull();
  await page.mouse.move(top.x, top.y);
  await page.mouse.down();
  await page.mouse.move(top.x - 60, top.y + 40, { steps: 5 });
  await page.mouse.up();
  await expect(page.locator('#scene-name')).toHaveText('Your own game');
  // Still the Sierpiński triangle of the new triangle: no dot in its middle hole.
  await expect(page.locator('#scene-status')).toHaveText('Dots in the middle hole: not one');
  await page.locator('#scene-share').click();
  const link = await page.evaluate(() => window.__clipboard.at(-1));
  const ax = Number(new URL(link).hash.match(/ax=(-?[\d.]+)/)[1]);
  expect(ax).toBeLessThan(0);
  // Opening the link draws the same shape.
  await page.goto(link.replace(/^.*#/, '/#'));
  await page.reload();
  await expect(page.locator('#scene-name')).toHaveText('Your own game');
});

test('chaos room: shared settings open as they were, and the fern grows green', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=chaos&corners=5&jump=61.8');
  await expect(page.locator('#scene-name')).toHaveText('Five corners');
  await expect(page.locator('#v-jump')).toHaveText('61.8%');
  await setRange(page, '#c-corners', 6);
  await expect(page.locator('#scene-name')).toHaveText('Your own game');
  await page.locator('#scene-presets .scene-preset', { hasText: 'Barnsley’s fern' }).click();
  await expect(page.locator('[data-check="fern"]')).toBeChecked();
  const green = await page.locator('#scene-canvas').evaluate((canvas) => {
    const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    let n = 0;
    for (let i = 0; i < data.length; i += 4) if (data[i + 1] > 120 && data[i + 1] > data[i] + 20) n++;
    return n;
  });
  expect(green).toBeGreaterThan(5000);
  // Moving a slider leaves the fern for the corners again.
  await setRange(page, '#c-jump', 50);
  await expect(page.locator('[data-check="fern"]')).not.toBeChecked();
});
