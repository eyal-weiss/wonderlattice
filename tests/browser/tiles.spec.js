import { test, expect, tool } from './helpers.js';

// A still picture (no ripple as tiles appear), so every frame shows the whole pattern.
test.use({ reducedMotion: 'reduce' });

/**
 * Share of the pattern (without the dots) that shows the dark background. Real gaps would be large; the few
 * pixels allowed are corners where several outline strokes overlap and darken.
 */
function gaps(page) {
  return page.evaluate(() => {
    const W = globalThis.Wonderlattice;
    const room = W.rooms.find((r) => r.id === 'tiles');
    const canvas = room.trailCanvas(W.stage.settingsFor('tiles'), W.stage);
    const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    let dark = 0;
    for (let i = 0; i < data.length; i += 4)
      if (Math.abs(data[i] - 10) < 6 && Math.abs(data[i + 1] - 14) < 6 && Math.abs(data[i + 2] - 21) < 6) dark++;
    return dark / (data.length / 4);
  });
}

test('however the tile is bent, its copies cover the plane with no gaps', async ({ page }) => {
  await page.goto('/#room=tiles');
  await expect(page.locator('body')).toHaveAttribute('data-room', 'tiles');
  for (let i = 0; i < 3; i++) {
    await page.locator('.scene-preset').nth(i).click();
    expect(await gaps(page), `preset ${i}`).toBeLessThan(0.0005);
  }
  for (let r = 0; r < 4; r++) {
    await page.selectOption('#tiles-rule', String(r));
    await expect(page.locator('#scene-name')).not.toHaveText('');
    expect(await gaps(page), `rule ${r}`).toBeLessThan(0.0005);
  }
  for (let i = 0; i < 3; i++) {
    await page.locator('#scene-action').click();
    expect(await gaps(page), `invented creature ${i}`).toBeLessThan(0.0005);
  }
});

test('the arrow keys move a dot, Enter picks the next, and the paired edge follows', async ({ page }) => {
  await page.goto('/#room=tiles');
  // The first edge's three dots, unpacked from its setting.
  const dots = () =>
    page.evaluate(() =>
      globalThis.Wonderlattice.models.tiles.offsets(globalThis.Wonderlattice.stage.settingsFor('tiles'), 0),
    );
  const before = await dots();
  await page.locator('#scene-canvas').focus();
  for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowUp');
  let after = await dots();
  expect(after[0]).not.toEqual(before[0]);
  expect(after[1]).toEqual(before[1]);
  await page.keyboard.press('Enter');
  for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowRight');
  after = await dots();
  expect(after[1]).not.toEqual(before[1]);
  // The change is in the shareable settings too.
  expect((await tool(page, 'read_exploration')).settings.edgeA).toBe(
    await page.evaluate(() => globalThis.Wonderlattice.stage.settingsFor('tiles').edgeA),
  );
  // The twin of every moved dot sits on its paired edge: the model puts it exactly where the rule sends it.
  const twinsMatch = await page.evaluate(() => {
    const W = globalThis.Wonderlattice,
      M = W.models.tiles,
      s = W.stage.settingsFor('tiles'),
      rule = M.RULES[s.rule];
    return M.handles(rule, s)
      .filter((h) => h.copy)
      .every((h) => {
        const own = M.handles(rule, s).find((g) => !g.copy && g.free === h.free && g.spot === h.spot);
        const [x, y] = M.apply(h.map, own.point);
        return Math.abs(x - h.point[0]) < 1e-9 && Math.abs(y - h.point[1]) < 1e-9;
      });
  });
  expect(twinsMatch).toBe(true);
  expect(await gaps(page)).toBeLessThan(0.0005);
});

test('a shared link brings back the same bent tile', async ({ page }) => {
  await page.goto('/#room=tiles');
  await page.locator('#scene-action').click(); // a random creature
  await page.selectOption('#tiles-rule', '3');
  const settings = await page.evaluate(() => ({ ...globalThis.Wonderlattice.stage.settingsFor('tiles') }));
  const link = await page.evaluate(
    (s) => globalThis.Wonderlattice.shareLink(new URLSearchParams({ room: 'tiles', ...s })),
    settings,
  );
  await page.goto('about:blank');
  await page.goto(link);
  await expect(page.locator('body')).toHaveAttribute('data-room', 'tiles');
  const back = await page.evaluate(() => ({ ...globalThis.Wonderlattice.stage.settingsFor('tiles') }));
  expect(back).toEqual(settings);
});

test.describe('on a touch screen', () => {
  test.use({ hasTouch: true });

  /** Starts a touch at (fx, fy) of the canvas and reports whether the room kept it (instead of scrolling). */
  const touchKeeps = (page, fx, fy) =>
    page.locator('#scene-canvas').evaluate(
      (canvas, [fx, fy]) => {
        const r = canvas.getBoundingClientRect();
        const point = { identifier: 1, target: canvas, clientX: r.left + fx * r.width, clientY: r.top + fy * r.height };
        const event = new TouchEvent('touchstart', {
          touches: [new Touch(point)],
          changedTouches: [new Touch(point)],
          cancelable: true,
          bubbles: true,
        });
        canvas.dispatchEvent(event);
        return event.defaultPrevented;
      },
      [fx, fy],
    );

  test('a finger on a dot drags it; anywhere else it scrolls the page', async ({ page }) => {
    await page.goto('/#room=tiles');
    await expect(page.locator('body')).toHaveAttribute('data-room', 'tiles');
    // The eye's dot sits at the tile's centre plus (ex, ey), and the tile's centre is the canvas centre.
    const eye = await page.evaluate(() => {
      const W = globalThis.Wonderlattice,
        s = W.stage.settingsFor('tiles'),
        scale = (Math.min(W.stage.width, W.stage.height) / (W.stage.width < 520 ? 2.5 : 3.1)) * s.size;
      return [0.5 + (s.ex * scale) / W.stage.width, 0.5 + (s.ey * scale) / W.stage.height];
    });
    expect(await touchKeeps(page, eye[0], eye[1])).toBe(true);
    expect(await touchKeeps(page, 0.02, 0.97)).toBe(false);
  });
});
