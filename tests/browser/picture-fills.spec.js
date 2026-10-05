import { test, expect, ROOMS } from './helpers.js';

// Every room's picture fills its frame. On wide screens the frame is as tall as the window (and stays in view while a
// longer panel scrolls past); on phones it's pinned above the controls. Either way a room draws for the canvas it is
// given: no empty strip across the picture taller than about a sixth of it, at laptop, desktop and phone sizes
// (docs/ARCHITECTURE.md, "The picture's frame"), in its opening view and in each preset. Gaps between the parts of a
// picture are fine; an empty band is not.

const SIZES = [
  [1280, 900],
  [1440, 900],
  [1920, 1080],
  [1024, 768],
  [390, 844],
];
const allowed = (height) => Math.max(64, height * 0.16);
// Pictures whose emptiness is the point, by room and preset number, with the reason.
const DELIBERATE = {
  'waves 3': 'the two tones cancel: their sum is a flat line across an empty row, and that silence is the surprise',
};

/** The tallest strip of rows with nothing drawn across them (each row a single colour), in CSS pixels. */
function tallestEmptyStrip(canvas) {
  const { width, height } = canvas;
  const data = canvas.getContext('2d').getImageData(0, 0, width, height).data;
  let run = 0,
    tallest = 0;
  for (let y = 0; y < height; y++) {
    const first = y * width * 4;
    let empty = true;
    for (let x = 1; x < width && empty; x += 2) {
      const o = first + x * 4;
      let difference = 0;
      for (let c = 0; c < 4; c++) difference += Math.abs(data[o + c] - data[first + c]);
      empty = difference <= 24;
    }
    run = empty ? run + 1 : 0;
    tallest = Math.max(tallest, run);
  }
  const scale = canvas.getBoundingClientRect().height / height;
  return { strip: Math.round(tallest * scale), height: Math.round(height * scale) };
}

for (const room of Object.keys(ROOMS).filter((id) => id !== 'motion')) {
  test(`${room}: the picture fills its frame at laptop, desktop and phone sizes`, async ({ page }) => {
    test.skip(process.env.SERVE_DIR === 'dist', 'a layout check: the source run covers it');
    await page.emulateMedia({ reducedMotion: 'reduce' }); // a still picture, the same every time
    const problems = [];
    for (const [width, height] of SIZES) {
      await page.setViewportSize({ width, height });
      await page.goto(`/#room=${room}`);
      await page.reload(); // each size from a fresh start, as a visitor would open it
      await expect(page.locator('body')).toHaveAttribute('data-room', room);
      await page.waitForTimeout(500);
      const { strip, height: canvas } = await page.locator('#scene-canvas').evaluate(tallestEmptyStrip);
      if (strip > allowed(canvas)) problems.push(`${width}×${height}: ${strip} px empty in a ${canvas} px picture`);
    }
    // Each preset too (they can change what the picture shows), on a laptop and a large screen.
    for (const [width, height] of [SIZES[0], SIZES[2]]) {
      await page.setViewportSize({ width, height });
      await page.reload();
      await expect(page.locator('body')).toHaveAttribute('data-room', room);
      const presets = page.locator('#scene-presets .scene-preset');
      for (let i = 0; i < (await presets.count()); i++) {
        await presets.nth(i).click();
        await page.waitForTimeout(500);
        const { strip, height: canvas } = await page.locator('#scene-canvas').evaluate(tallestEmptyStrip);
        if (strip > allowed(canvas) && !DELIBERATE[`${room} ${i + 1}`])
          problems.push(`${width}×${height}, preset ${i + 1}: ${strip} px empty in a ${canvas} px picture`);
      }
    }
    expect(problems, `${room} leaves an empty band`).toEqual([]);
  });
}
