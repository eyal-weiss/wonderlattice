import { test, expect, openRoom, tool, inkedPixels } from './helpers.js';

test('the loom weaves twill, houndstooth, and stripes from its draft', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'loom');
  await expect(page.locator('#scene-status')).toHaveText('Repeats every 4 × 4 threads');
  await expect(page.locator('#loom-float')).toContainText('up to 2');
  await expect.poll(() => inkedPixels(page, '#scene-canvas')).toBeGreaterThan(200);
  await page.getByRole('button', { name: /Houndstooth/ }).click();
  await expect(page.locator('#scene-status')).toHaveText('Repeats every 8 × 8 threads');
  await page.getByRole('button', { name: /Stripes, not checks/ }).click();
  await expect(page.locator('#scene-status')).toHaveText('Repeats every 1 × 2 threads');
  await expect(page.locator('#loom-float')).toContainText('over one, under one');
});

test('changing one tie-up square changes the cloth, and a thread that never interlaces is flagged', async ({
  page,
}) => {
  await page.goto('/#room=loom');
  const cell = page.getByRole('button', { name: 'Pedal 1 lifts shaft 1' });
  await expect(cell).toHaveAttribute('aria-pressed', 'true');
  const before = (await tool(page, 'read_exploration')).settings.tieup;
  await cell.click();
  await expect(page.getByRole('button', { name: 'Pedal 1 lifts shaft 1' })).toHaveAttribute('aria-pressed', 'false');
  expect((await tool(page, 'read_exploration')).settings.tieup).toBe(before ^ 1);
  await expect(page.locator('.scene-preset[aria-pressed="true"]')).toHaveCount(0);
  // Treadle 1 now lifts only shaft 2; clear that too and its passes never interlace.
  await page.getByRole('button', { name: 'Pedal 1 lifts shaft 2' }).click();
  await expect(page.locator('#loom-float')).toContainText('fall apart');
  await page.locator('#scene-action').click();
  await expect(page.locator('#loom-float')).not.toContainText('fall apart');
});

test('a shared loom link restores the draft and colours', async ({ page }) => {
  await page.goto('/#room=loom&tieup=42405&threading=1&treadling=1&warpColours=1&weftColours=1&palette=2');
  await expect(page.locator('#loom-threading')).toHaveValue('1');
  await expect(page.locator('#loom-palette')).toHaveValue('2');
  expect((await tool(page, 'read_exploration')).settings).toMatchObject({ tieup: 42405, warpColours: 1 });
  // Out-of-range values are ignored; the current settings stay.
  await page.evaluate(() => (location.hash = 'room=loom&tieup=99999&palette=9&threading=0'));
  await expect(page.locator('#loom-threading')).toHaveValue('0');
  expect((await tool(page, 'read_exploration')).settings).toMatchObject({ tieup: 42405, palette: 2 });
});

/** Cream weft pixels (the default palette's light yarn) in the top fifth of a canvas: only woven cloth has them. */
const creamAtTop = (canvas) => {
  const height = Math.round(canvas.height / 5);
  const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, height);
  let n = 0;
  for (let i = 0; i < data.length; i += 4) if (data[i] === 0xef && data[i + 1] === 0xe6 && data[i + 2] === 0xcf) n++;
  return n;
};

test('the loom opens with cloth already woven, and the trail keeps the finished cloth', async ({ page }) => {
  await page.goto('/#room=loom');
  await expect(page.locator('#loom-float')).toContainText('up to 2');
  // Most of the cloth is already there when the room opens.
  await expect(page.locator('#scene-canvas')).toBeVisible();
  expect(await inkedPixels(page, '#scene-canvas')).toBeGreaterThan(3000);
  // The trail's picture is the whole cloth, finished: woven right up to its top edge.
  const trail = await page.evaluate((count) => {
    const room = globalThis.Wonderlattice.rooms.find((r) => r.id === 'loom');
    const canvas = room.trailCanvas(globalThis.Wonderlattice.stage.settingsFor('loom'), globalThis.Wonderlattice.stage);
    return { width: canvas.width, cream: new Function(`return (${count})`)()(canvas) };
  }, creamAtTop.toString());
  expect(trail.width).toBeGreaterThan(100);
  expect(trail.cream).toBeGreaterThan(500);
});

test('the loom speaks a settled change once, and its panel is not a live region', async ({ page }) => {
  await page.goto('/#room=loom');
  await expect(page.locator('#loom-float')).not.toHaveAttribute('role', 'status');
  await page.getByRole('button', { name: /Stripes, not checks/ }).click();
  await expect(page.locator('#announcer')).toContainText('Repeats every 1 × 2 threads');
  await page.getByRole('button', { name: 'Pedal 1 lifts shaft 1' }).click();
  await expect(page.locator('#announcer')).toContainText('float over up to 3');
  // The tip names the keyboard route: the tie-up's squares in the panel.
  await expect(page.locator('#scene-tip')).toContainText('squares in the panel');
});
