import { test, expect, tool } from './helpers.js';

test('a first tap on a die in the circle picks it, without the page jumping', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  // Record where the circle's dice are drawn (their arcs are the large circles on the canvas).
  await page.addInitScript(() => {
    const arc = CanvasRenderingContext2D.prototype.arc;
    window.__arcs = [];
    CanvasRenderingContext2D.prototype.arc = function (x, y, r, ...rest) {
      if (this.canvas.id === 'scene-canvas') window.__arcs.push([x, y, r]);
      return arc.call(this, x, y, r, ...rest);
    };
  });
  await page.goto('/#room=dice&set=0&you=0');
  await expect(page.locator('#scene-status')).not.toBeEmpty();
  for (const die of [1, 2]) {
    const target = await page.evaluate(() => {
      document.activeElement?.blur();
      scrollTo(0, 0);
      window.__arcs = [];
      globalThis.Wonderlattice.stage.draw();
      const nodes = window.__arcs.filter((a) => a[2] >= 11.9);
      const box = document.getElementById('scene-canvas').getBoundingClientRect();
      return nodes.map(([x, y]) => [box.left + x, box.top + y]);
    });
    await page.mouse.click(...target[die]);
    expect((await tool(page, 'read_exploration')).settings.you, `tap picks die ${die}`).toBe(die);
    expect(await page.evaluate(() => scrollY)).toBe(0);
  }
});

test('the same die on both sides shows an even match, not a bogus exact chance', async ({ page }) => {
  await page.goto('/#room=dice&set=1&you=1&rival=1');
  await expect(page.locator('#dice-seen')).toContainText('same die');
  await expect(page.locator('#dice-seen')).not.toContainText('0/1');
});
