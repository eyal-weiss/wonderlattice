import { test, expect, tool } from './helpers.js';

const settings = async (page) => (await tool(page, 'read_exploration')).settings;
const status = (page) => page.locator('#scene-status');

/**
 * The middle of the first table in one column of the picture (a fraction of its width), in page coordinates: halfway
 * between its rail at the top and its rail at the bottom. (The felt itself is crossed by the long exposure's lines.)
 */
async function feltCentre(page, across) {
  const box = await page.locator('#scene-canvas').boundingBox();
  const rails = await page.locator('#scene-canvas').evaluate((canvas, f) => {
    const x = Math.round(canvas.width * f);
    const { data } = canvas.getContext('2d').getImageData(x, 0, 1, canvas.height);
    const rail = [0x6b, 0x4a, 0x2e];
    const runs = [];
    for (let y = 0; y < canvas.height; y++) {
      const pixel = data.slice(4 * y, 4 * y + 3);
      if (!pixel.every((c, i) => Math.abs(c - rail[i]) < 16)) continue;
      const last = runs[runs.length - 1];
      if (last && y - last.end <= 2) last.end = y;
      else runs.push({ start: y, end: y });
    }
    return runs.map(({ start, end }) => ({ start: start / canvas.height, end: end / canvas.height }));
  }, across);
  // The first two runs of rail from the top are the first table's top and bottom.
  return { x: box.x + box.width * across, y: box.y + box.height * ((rails[0].start + rails[1].end) / 2) };
}

test('billiards room: within seconds, without a click, the stadium forgets and the ellipse remembers', async ({
  page,
}) => {
  await page.goto('/#room=billiards');
  await expect(status(page)).toContainText('both pairs together');
  await expect(status(page)).toHaveText(/The stadium’s twins parted at bounce \d+/, { timeout: 15000 });
  await expect(page.locator('#billiards-gap-ellipse')).toHaveText(/ mm$/);
  // Pause holds the picture still.
  await page.locator('#scene-play').click();
  const held = await page.locator('#billiards-gap-stadium').textContent();
  await page.waitForTimeout(700);
  await expect(page.locator('#billiards-gap-stadium')).toHaveText(held);
});

test.describe('with reduced motion', () => {
  // The room then opens on a shot already run for 300 table units, so the result is there at once.
  test.use({ reducedMotion: 'reduce' });

  test('billiards room: the opening shot, already played out', async ({ page }) => {
    await page.goto('/#room=billiards');
    await expect(status(page)).toHaveText('The stadium’s twins parted at bounce 10');
    await expect(page.locator('#billiards-gap-ellipse')).toHaveText(/ mm$/);
    await expect(page.locator('#billiards-gap-stadium')).toHaveText(/ (cm|m)$/);
    await expect(page.locator('#billiards-curve')).toHaveText('a smaller ellipse');
  });

  test('billiards room: every shot from one focus drops into a pocket at the other', async ({ page }) => {
    await page.goto('/#room=billiards');
    await page.locator('.scene-preset').nth(1).click();
    await expect(status(page)).toHaveText(/^Shots in: ellipse \d+, stadium \d+$/);
    await expect(page.locator('#billiards-pockets')).toBeVisible();
    await expect(page.locator('#billiards-apart')).toBeHidden();
    // The last eight ellipse shots each went in after exactly one bounce.
    await expect(page.locator('#billiards-in-ellipse')).toHaveText('1, 1, 1, 1, 1, 1, 1, 1');
    await expect(page.locator('#billiards-curve')).toHaveText('no curve: it runs through the foci');
    // Turning the pocket off and on again moves the start back to the focus.
    await page.goto('about:blank');
    await page.goto('/#room=billiards&sx=0.2&sy=0.3&pocket=false');
    await page.getByLabel('A pocket at one focus').check();
    expect(await settings(page)).toMatchObject({ pocket: true, sx: -Math.sqrt(3) / 2, sy: 0 });
  });

  test('billiards room: a circle is as orderly as the ellipse; a sliver of straight side is not', async ({ page }) => {
    await page.goto('/#room=billiards&flat=0');
    await expect(status(page)).toContainText('both pairs together');
    await page.goto('about:blank');
    await page.goto('/#room=billiards&flat=5');
    // The narrower stadium puts this start at (−0.525, −0.75); an independent calculation parts the twins at bounce 19.
    await expect(status(page)).toHaveText('The stadium’s twins parted at bounce 19');
  });

  test('billiards room: shared links keep the shot, and ignore values out of range', async ({ page }) => {
    await page.goto('/#room=billiards&sx=0.3&sy=-0.2&aim=120&flat=150&speed=2&caustic=true');
    expect(await settings(page)).toMatchObject({ sx: 0.3, sy: -0.2, aim: 120, flat: 150, speed: 2, caustic: true });
    await page.goto('about:blank');
    await page.goto('/#room=billiards&sx=5&flat=900&speed=0&aim=1e9');
    expect(await settings(page)).toMatchObject({ sx: -0.5, flat: 100, speed: 1, aim: 9 });
  });

  test('billiards room: a drag aims a new shot, and the keys turn it, move it, and take another', async ({ page }) => {
    await page.goto('/#room=billiards');
    await expect(status(page)).toContainText('parted');
    const centre = await feltCentre(page, 0.25);
    await page.mouse.move(centre.x, centre.y);
    await page.mouse.down();
    await page.mouse.move(centre.x + 120, centre.y - 120, { steps: 6 });
    await page.mouse.up();
    const shot = await settings(page);
    expect(shot.aim).toBeCloseTo(45, 0);
    expect(Math.abs(shot.sx)).toBeLessThan(0.1);
    expect(Math.abs(shot.sy)).toBeLessThan(0.1);
    await expect(page.locator('.scene-preset[aria-pressed="true"]')).toHaveCount(0);

    await expect(page.locator('#scene-canvas')).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    expect((await settings(page)).aim).toBeCloseTo(shot.aim + 5, 5);
    await page.keyboard.press('ArrowUp');
    expect((await settings(page)).sy).toBeCloseTo(shot.sy + 0.1, 5);
    const before = await settings(page);
    await page.keyboard.press('Enter');
    const after = await settings(page);
    expect([after.sx, after.sy, after.aim]).not.toEqual([before.sx, before.sy, before.aim]);
    await expect(status(page)).toContainText('bounce');
  });
});
