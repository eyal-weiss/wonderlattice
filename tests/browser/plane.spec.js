import { test, expect, ROOMS, openRoom, tool, setRange, inkedPixels } from './helpers.js';

const settings = async (page) => (await tool(page, 'read_exploration')).settings;

/**
 * Where a point z of the left-hand plane is on the screen, following the
 * room's layout: two panels 30 px apart inside a 4 px margin, side by side or
 * stacked (whichever makes them bigger), each showing the map's frame with 8%
 * to spare and x and y at the same scale.
 */
async function leftPanel(page) {
  const box = await page.locator('#scene-canvas').boundingBox();
  const { fn } = await settings(page);
  const frame = await page.evaluate((i) => globalThis.Wonderloom.models.plane.FUNCTIONS[i].frame, fn);
  const side = { w: (box.width - 38) / 2, h: box.height - 8 },
    stack = { w: box.width - 8, h: (box.height - 38) / 2 };
  const size = Math.min(side.w, side.h) >= Math.min(stack.w, stack.h) ? side : stack;
  const scale = Math.min(size.w / (2 * frame.rx), size.h / (2 * frame.ry)) / 1.08;
  return { x: box.x + 4, y: box.y + 4, w: size.w, h: size.h, frame, scale };
}

async function onScreen(page, z) {
  const P = await leftPanel(page);
  return {
    x: P.x + P.w / 2 + (z[0] - P.frame.cx) * P.scale,
    y: P.y + P.h / 2 - (z[1] - P.frame.cy) * P.scale,
  };
}

/** The compass and its arrows (36 px at most) are inside the left panel. */
async function expectCompassInside(page) {
  const s = await settings(page),
    P = await leftPanel(page),
    at = await onScreen(page, [s.probeX, s.probeY]);
  for (const [value, low, high] of [
    [at.x, P.x, P.x + P.w],
    [at.y, P.y, P.y + P.h],
  ]) {
    expect(value - 36).toBeGreaterThanOrEqual(low);
    expect(value + 36).toBeLessThanOrEqual(high);
  }
}

async function pause(page) {
  if ((await page.locator('#scene-play').textContent()) === 'Pause') await page.locator('#scene-play').click();
  await expect(page.locator('#scene-play')).toHaveText('Play');
}

test('plane room: opens from its card, bends the plane, and switches functions', async ({ page }) => {
  await page.goto('/');
  await expect.poll(() => inkedPixels(page, '#card-plane canvas')).toBeGreaterThan(20);
  await openRoom(page, 'plane');
  await expect(page.locator('#room-title')).toHaveText(ROOMS.plane);
  await expect.poll(() => inkedPixels(page, '#scene-canvas')).toBeGreaterThan(200);
  // The first visit opens with the plane bending, and settles fully bent.
  await expect(page.locator('#v-bend')).toHaveText('100%', { timeout: 15000 });
  await expect(page.locator('#scene-name')).toHaveText('w = z²');
  await expect(page.locator('.scene-preset')).toHaveCount(5);

  await page.locator('#plane-fn').selectOption('1');
  await expect(page.locator('#scene-name')).toHaveText('w = 1/z');
  await expect(page.locator('#plane-fn')).toBeFocused();
  await expect(page.locator('.scene-preset[aria-pressed="true"]')).toHaveCount(0);
  expect((await settings(page)).fn).toBe(1);
  await page.locator('#plane-fn').selectOption('2');
  await expect(page.locator('#scene-name')).toHaveText('w = eᶻ');

  // A picture other than the grid offers the faint grid behind; the wing's circle offers its sliders.
  await page.locator('#plane-picture').selectOption('1');
  await expect(page.getByLabel('Show a faint grid behind')).toBeChecked();
  await expect(page.locator('#c-thick')).toHaveCount(0);
  await page.getByRole('button', { name: /Make a wing/ }).click();
  await expect(page.locator('#plane-fn')).toHaveValue('4');
  await expect(page.locator('#plane-picture')).toHaveValue('4');
  await expect(page.locator('#c-thick')).toBeVisible();
  await expect(page.getByLabel('Show the air flowing past')).toBeChecked();
  await setRange(page, '#c-camber', 0.2);
  await expect(page.locator('#v-camber')).toHaveText('0.2');
  expect((await settings(page)).camber).toBe(0.2);

  await page.locator('#scene-why').click();
  await expect(page.locator('#insight-dialog')).toContainText('conformal');
  await expect(page.locator('#insight-dialog')).toContainText('not a path the plane really travels');
  await page.locator('#insight-close').click();
});

test('plane room: drag the compass with the mouse, and angles break only where f′ = 0', async ({ page }) => {
  // Tall enough that the whole stage is on screen, so the mouse can reach every point of it.
  await page.setViewportSize({ width: 1280, height: 1200 });
  await page.goto('/#room=plane');
  await pause(page);
  await setRange(page, '#c-bend', 100); // finish the opening bend at once
  const start = await settings(page);
  // Pick the compass up where it is and carry it to z = 1 + 0.5i.
  const from = await onScreen(page, [start.probeX, start.probeY]);
  const to = await onScreen(page, [1, 0.5]);
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move((from.x + to.x) / 2, (from.y + to.y) / 2, { steps: 4 });
  await page.mouse.move(to.x, to.y, { steps: 4 });
  await page.mouse.up();
  let s = await settings(page);
  expect(Math.abs(s.probeX - 1)).toBeLessThan(0.02);
  expect(Math.abs(s.probeY - 0.5)).toBeLessThan(0.02);
  // For z², f′(z) = 2z: a stretch of about 2.24 and a turn of about 27°.
  await expect(page.locator('#plane-readout')).toContainText(/2\.2\d×/);
  await expect(page.locator('#plane-readout')).toContainText(/2[67]°/);
  await expect(page.locator('#plane-readout')).toContainText('still meet at a right angle');

  // Carry it to the centre, where z² has f′ = 0.
  const centre = await onScreen(page, [0, 0]);
  await page.mouse.move(to.x, to.y);
  await page.mouse.down();
  await page.mouse.move(centre.x, centre.y, { steps: 6 });
  await page.mouse.up();
  await expect(page.locator('#scene-status')).toHaveText('Here f′ = 0');
  await expect(page.locator('#plane-readout')).toContainText('angles double');

  // A tap elsewhere on the left brings the compass there.
  const tap = await onScreen(page, [-0.8, -0.6]);
  await page.mouse.click(tap.x, tap.y);
  s = await settings(page);
  expect(Math.abs(s.probeX + 0.8)).toBeLessThan(0.02);
  expect(Math.abs(s.probeY + 0.6)).toBeLessThan(0.02);

  // The arrow keys walk it too.
  await page.locator('#scene-canvas').focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowUp');
  const moved = await settings(page);
  expect(moved.probeX).toBeGreaterThan(s.probeX);
  expect(moved.probeY).toBeGreaterThan(s.probeY);

  // At the pole of 1/z the twin flies off the map.
  await page.evaluate(() => (location.hash = 'room=plane&fn=1&probeX=0&probeY=0'));
  await expect(page.locator('#scene-status')).toHaveText('A pole: f = ∞');
  await expect(page.locator('#plane-readout')).toContainText('a pole');
});

test('plane room: "Bend it" plays the morph from the identity to f, and a pause stays a pause', async ({ page }) => {
  await page.goto('/#room=plane&fn=2&bend=100');
  await expect(page.locator('#scene-name')).toHaveText('w = eᶻ');
  await expect(page.locator('#scene-action')).toHaveText('Bend it');
  await page.locator('#scene-action').click();
  // It starts from the unbent plane and plays to the end.
  await expect(page.locator('#scene-name')).toContainText('% bent');
  await expect.poll(async () => (await settings(page)).bend, { timeout: 2000 }).toBeGreaterThan(0);
  await expect(page.locator('#v-bend')).toHaveText('100%', { timeout: 15000 });
  await expect(page.locator('#c-bend')).toHaveValue('100');
  await expect(page.locator('#scene-name')).toHaveText('w = eᶻ');
  // Paused, "Bend it" shows the bent plane at once and leaves the stage paused.
  await pause(page);
  await setRange(page, '#c-bend', 30);
  await page.locator('#scene-action').click();
  await expect(page.locator('#v-bend')).toHaveText('100%');
  await page.waitForTimeout(300);
  await expect(page.locator('#scene-play')).toHaveText('Play');
  // The slider sets any blend by hand.
  await setRange(page, '#c-bend', 40);
  await expect(page.locator('#scene-name')).toHaveText('w = eᶻ · 40% bent');
  await expect(page.locator('#plane-readout')).toContainText('blend');
});

test('plane room: with reduced motion nothing plays by itself and the bend jumps to its end', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await openRoom(page, 'plane');
  await expect(page.locator('#scene-play')).toHaveText('Play');
  await expect(page.locator('#v-bend')).toHaveText('100%');
  const before = await settings(page);
  await page.waitForTimeout(400);
  expect(await settings(page)).toEqual(before); // the compass stays put
  await setRange(page, '#c-bend', 20);
  await page.locator('#scene-action').click();
  await expect(page.locator('#v-bend')).toHaveText('100%');
  expect((await settings(page)).bend).toBe(100);
});

test('a shared plane link restores the function, picture, wing, and compass', async ({ page }) => {
  await page.goto('/#room=plane&fn=4&picture=4&thick=0.2&camber=-0.1&probeX=1.2&probeY=-0.5&bend=40&flow=false');
  await expect(page.locator('#plane-fn')).toHaveValue('4');
  await expect(page.locator('#plane-picture')).toHaveValue('4');
  await expect(page.locator('#c-thick')).toHaveValue('0.2');
  await expect(page.locator('#v-bend')).toHaveText('40%');
  await expect(page.getByLabel('Show the air flowing past')).not.toBeChecked();
  expect(await settings(page)).toMatchObject({
    fn: 4,
    picture: 4,
    camber: -0.1,
    probeX: 1.2,
    probeY: -0.5,
    flow: false,
  });
  await expect(page.locator('#plane-readout')).toContainText('1.2 − 0.5i');
  // Out-of-range values are ignored; the current settings stay.
  await page.evaluate(() => (location.hash = 'room=plane&fn=9&thick=2&picture=1.5&bend=100'));
  await expect(page.locator('#v-bend')).toHaveText('100%');
  expect(await settings(page)).toMatchObject({ fn: 4, picture: 4, thick: 0.2, bend: 100 });
});

test('plane room: the compass always stays inside its panel', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  // A shared link may place it anywhere in [−5, 5]: it is brought back inside.
  await page.goto('/#room=plane&probeX=5&probeY=-5');
  await expect.poll(async () => (await settings(page)).probeX).toBeLessThan(5);
  await expectCompassInside(page);
  await page.goto('/#room=plane&fn=1&probeX=2.5&probeY=0');
  await expect.poll(async () => (await settings(page)).probeX).toBeLessThan(2.5);
  await expectCompassInside(page);
  // A preset that changes the map keeps it inside the new map's panel: from the top of e^z's tall strip to z².
  await page.goto('/#room=plane&fn=2&probeX=-0.3&probeY=3.1');
  await pause(page);
  await expectCompassInside(page);
  await page.getByRole('button', { name: /Square the plane/ }).click();
  await expect(page.locator('#plane-fn')).toHaveValue('0');
  await expectCompassInside(page);
});

test('plane room: angles break only at critical points, not wherever the stretch is small', async ({ page }) => {
  // e^z far to the left shrinks everything a lot, but it has no critical points: angles are kept.
  await page.goto('/#room=plane&fn=2&probeX=-5&probeY=-0.2');
  await expect(page.locator('#plane-readout')).toContainText('still meet at a right angle');
  await expect(page.locator('#scene-status')).not.toHaveText('Here f′ = 0');
  await expect(page.locator('#scene-status')).toContainText('×0.');
  // Joukowski at z = 1, the wing's trailing edge, is critical.
  await page.evaluate(() => (location.hash = 'room=plane&fn=4&picture=0&probeX=1&probeY=0'));
  await expect(page.locator('#scene-status')).toHaveText('Here f′ = 0');
  // Part-way bent, the blend's own critical points count: for z² at 50%, w′ = 0.5 + z vanishes at −0.5.
  await page.evaluate(() => (location.hash = 'room=plane&fn=0&picture=0&bend=50&probeX=-0.5&probeY=0'));
  await expect(page.locator('#scene-status')).toHaveText('Here f′ = 0');
  await page.evaluate(() => (location.hash = 'room=plane&fn=0&picture=0&bend=50&probeX=0&probeY=0'));
  await expect(page.locator('#plane-readout')).toContainText('blend');
});

test('plane room: "Start again" while paused stays paused; Play sends the compass walking', async ({ page }) => {
  await page.goto('/#room=plane&probeX=-1&probeY=-1');
  await pause(page);
  await setRange(page, '#c-bend', 20);
  const before = await settings(page);
  await page.locator('#scene-reset').click();
  await expect(page.locator('#v-bend')).toHaveText('100%');
  await page.waitForTimeout(400);
  await expect(page.locator('#scene-play')).toHaveText('Play');
  expect((await settings(page)).probeX).toBe(before.probeX);
  await page.locator('#scene-play').click();
  await expect(page.locator('#scene-play')).toHaveText('Pause');
  await expect.poll(async () => (await settings(page)).probeX, { timeout: 5000 }).not.toBe(before.probeX);
});

test('plane room: resting the compass on f′ = 0 is announced once', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1200 }); // the whole stage on screen, for the mouse
  await page.goto('/#room=plane&fn=0&picture=0&probeX=1.2&probeY=0.8');
  await expect(page.locator('#plane-readout')).toBeVisible();
  // Tap the centre, where z² has f′ = 0: the compass jumps there and rests.
  const zero = await onScreen(page, [0, 0]);
  await page.mouse.click(zero.x, zero.y);
  await expect(page.locator('#scene-status')).toHaveText('Here f′ = 0');
  await expect(page.locator('#announcer')).toHaveText('f′ = 0 here: angles double');
  // The readout panel itself is not a live region: it changes every frame.
  await expect(page.locator('#plane-readout [role="status"], #plane-readout[role="status"]')).toHaveCount(0);
});

test('plane room: the axis labels are drawn in the lighter tick colour', async ({ page }) => {
  await page.goto('/#room=plane&fn=0&picture=0');
  await expect(page.locator('#plane-readout')).toBeVisible();
  const found = await page.locator('#scene-canvas').evaluate((canvas) => {
    const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < data.length; i += 4)
      if (data[i] === 0x85 && data[i + 1] === 0x95 && data[i + 2] === 0xaa) return true;
    return false;
  });
  expect(found).toBe(true);
});
