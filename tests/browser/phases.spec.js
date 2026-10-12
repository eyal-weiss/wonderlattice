import { test, expect, openRoom, setRange, tool, inkedPixels } from './helpers.js';

const status = (page) => page.locator('#scene-status');
const readout = (page) => page.locator('#phases-readout');

test('phases room: it opens balanced, the return wire carries nothing, and the kettles wake it', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'phases');
  await expect(page.locator('#scene-name')).toHaveText('Three currents');
  await expect.poll(() => inkedPixels(page, '#scene-canvas')).toBeGreaterThan(500);
  await expect(status(page)).toHaveText('Return wire: 0 A');
  await expect(readout(page)).toHaveText(
    'In the return wire0 AThe three currents cancel at every instant, so three wires do the work of six.',
  );
  // Twice the current in one wire: the extra 100 A comes back.
  await expect(page.locator('#scene-action')).toHaveText('Switch the kettles on');
  await page.locator('#scene-action').click();
  await expect(status(page)).toHaveText('Return wire: 100 A');
  await expect(page.locator('#v-one')).toHaveText('200 A');
  await expect(readout(page)).toContainText('The currents differ, so they no longer cancel');
  await expect(page.locator('#scene-action')).toHaveText('Switch the kettles off');
  await page.locator('#scene-action').click();
  await expect(status(page)).toHaveText('Return wire: 0 A');
});

test('phases room: the return current is the three arrows added head to tail', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=phases');
  await setRange(page, '#c-three', 0); // one street switched off
  await expect(status(page)).toHaveText('Return wire: 100 A');
  await setRange(page, '#c-two', 50);
  await expect(status(page)).toHaveText('Return wire: 87 A'); // 86.6 A
  await setRange(page, '#c-one', 0);
  await expect(status(page)).toHaveText('Return wire: 50 A'); // a single wire: all of it comes back
  // Any equal currents cancel.
  for (const key of ['one', 'two', 'three']) await setRange(page, `#c-${key}`, 40);
  await expect(status(page)).toHaveText('Return wire: 0 A');
});

test('phases room: the total power is steady when the loads are equal, and swings when they are not', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=phases');
  await page.getByRole('button', { name: 'Power', exact: true }).click();
  await expect(page.locator('#scene-name')).toHaveText('Flickering lamps');
  await expect(page.getByRole('button', { name: 'Power', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(readout(page)).toHaveText(
    'Total powerSteadyEach street’s lamps flicker twice a cycle, but the three together never do.',
  );
  await page.locator('#scene-action').click(); // kettles on: 200, 100, 100
  await expect(page.locator('.phases-big strong')).toHaveText('± 25%');
  await setRange(page, '#c-one', 100);
  await setRange(page, '#c-three', 0);
  await expect(page.locator('.phases-big strong')).toHaveText('± 50%');
});

test('phases room: three coils turn a field of steady strength, and swapping two wires reverses it', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=phases');
  await expect(page.locator('#c-swap, [data-check="swap"]')).toHaveCount(0); // only with the field
  await page.getByRole('button', { name: /A field that turns/ }).click();
  await expect(page.locator('#scene-name')).toHaveText('A field that turns');
  await expect(page.locator('.phases-big strong')).toHaveText('Steady');
  const swap = page.locator('[data-check="swap"]');
  await swap.check();
  await expect(page.locator('.phases-big strong')).toHaveText('Steady');
  expect((await tool(page, 'read_exploration')).settings.swap).toBe(true);
  // Unequal currents: the field still turns, but its strength wobbles.
  await setRange(page, '#c-one', 200);
  await expect(page.locator('.phases-big strong')).toHaveText('Wobbles');
  await expect(status(page)).toHaveText('Return wire: 100 A');
});

test('phases room: the keys and a drag change a wire’s current, and links open on their settings', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/#room=phases');
  await page.locator('#scene-canvas').focus();
  await page.keyboard.press('ArrowUp'); // wire 1: 110 A
  await expect(page.locator('#v-one')).toHaveText('110 A');
  await expect(status(page)).toHaveText('Return wire: 10 A');
  await page.keyboard.press('ArrowRight'); // wire 2
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#v-two')).toHaveText('80 A');
  // A drag pulls wire 1's arrow out to one and a half times its length. With reduced motion the picture is still,
  // at its opening angle (60°), laid out as the room lays out a laptop's canvas.
  await page.goto('about:blank');
  await page.goto('/#room=phases');
  const canvas = page.locator('#scene-canvas');
  await canvas.evaluate((el) => el.scrollIntoView({ block: 'start' }));
  const box = await canvas.boundingBox();
  const stripBottom = 16 + Math.min(250, Math.max(150, box.height * 0.36)),
    bandTop = stripBottom + 14,
    bandBottom = box.height - 16,
    U = Math.max(14, Math.min(((bandBottom - bandTop) / 2 - 12 - 8) / 2, box.width * 0.105)),
    cx = box.x + 16 + 2 * U + 10,
    cy = box.y + (bandTop + bandBottom) / 2 - 8,
    at = (r) => [cx + r * U * Math.cos(Math.PI / 3), cy - r * U * Math.sin(Math.PI / 3)];
  await page.mouse.move(...at(1));
  await page.mouse.down();
  await page.mouse.move(...at(1.5), { steps: 5 });
  await page.mouse.up();
  await expect(page.locator('#v-one')).toHaveText('150 A');
  await expect(status(page)).toHaveText('Return wire: 50 A');
  // A shared link opens on its view and currents; values out of range are ignored.
  await page.goto('about:blank');
  await page.goto('/#room=phases&view=1&one=200&two=100&three=100');
  await expect(page.locator('#scene-name')).toHaveText('Flickering lamps');
  await expect(page.locator('.phases-big strong')).toHaveText('± 25%');
  await page.goto('about:blank');
  await page.goto('/#room=phases&view=7&one=900');
  await expect(page.locator('#scene-name')).toHaveText('Three currents');
  await expect(status(page)).toHaveText('Return wire: 0 A');
});
