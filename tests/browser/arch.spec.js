import { test, expect } from './helpers.js';

const status = (page) => page.locator('#scene-status');
const scene = (page) => page.locator('#scene-name');
const readout = (page) => page.locator('#arch-readout');

/**
 * Where the room puts things on a wide picture (its layout): two pictures side by side on one scale (pixels per
 * metre), their ground line at `ground`, centred at `left` and `right`; below them, the first plan that leaves the
 * pictures big enough: the row of four shapes and the chart under it, the chart beside the shapes two by two, or the
 * row alone. `cell(i)` is a point in a shape's cell, or null when there is no row.
 */
function places(box) {
  const pad = 14,
    gap = 18;
  const w = (box.width - 2 * pad - gap) / 2;
  const most = Math.min(w / 1.28, (box.height / 8 + 28) / 0.44);
  const plans = [
    { kind: 'stacked', rows: 1, least: 130, below: 24 + 26 + 130 + 202 + pad, keep: 0.84 },
    { kind: 'side', rows: 2, least: 118, below: 24 + 26 + 236 + 8 + pad, keep: 0.8, fits: w >= 360 },
    { kind: 'row', rows: 1, least: 120, below: 24 + 26 + 120 + pad, keep: 0.75 },
  ];
  const sized = (room) => Math.max(40, Math.min(most, (room - pad) / 1.18));
  const plan = plans.find((p) => p.fits !== false && sized(box.height - p.below) >= p.keep * most);
  const scale = sized(plan ? box.height - plan.below : box.height - pad);
  const ground = pad + 0.98 * scale;
  let cell = null;
  if (plan) {
    const spare = Math.max(0, box.height - (ground + 0.2 * scale) - plan.below);
    const cellH = plan.least + Math.min(spare / plan.rows, (plan.rows > 1 ? 150 : 170) - plan.least);
    const share = (spare - plan.rows * (cellH - plan.least)) / (plan.kind === 'stacked' ? 3 : 2);
    const top = ground + 0.2 * scale + 24 + share + 26;
    cell =
      plan.kind === 'side'
        ? (i) => ({ x: pad + w + gap + ((i % 2) + 0.5) * (w / 2), y: top + Math.floor(i / 2) * (cellH + 8) + 50 })
        : (i) => ({ x: pad + (i + 0.5) * ((box.width - 2 * pad) / 4), y: top + 50 });
  }
  return { scale, ground, left: pad + w / 2, right: pad + w + gap + w / 2, cell };
}

async function canvasBox(page) {
  const canvas = page.locator('#scene-canvas');
  await canvas.evaluate((c) => c.scrollIntoView({ block: 'start' }));
  return canvas.boundingBox();
}

async function link(page) {
  await page.getByRole('button', { name: 'Copy this exploration' }).click();
  return page.evaluate(() => window.__clipboard.at(-1));
}

test('arch room: the chain swings, turns over by itself and stands, and the semicircle beside it falls', async ({
  page,
}) => {
  await page.goto('/#room=arch');
  await expect(scene(page)).toHaveText('Hang it, flip it');
  await expect(status(page)).toHaveText('The chain hangs');
  await expect(readout(page)).toContainText('Hanging, the chain is pulled tight all along: pure tension.');
  // It moves without a click.
  const canvas = page.locator('#scene-canvas');
  const first = await canvas.screenshot();
  await page.waitForTimeout(300);
  expect(first.equals(await canvas.screenshot())).toBe(false);
  await expect(status(page)).toHaveText('Turned over, it stands · A semicircle: falls', { timeout: 10_000 });
  await expect(readout(page)).toContainText('Turned over, the same shape stands: pure push.');
  await expect(readout(page)).toContainText('Its line of force stays 50% of the stones’ thickness inside.');
  await expect(readout(page)).toContainText('A semicircle of the same stones falls.');
  await expect(readout(page)).toContainText('It would stand with stones at least 5.3 cm thick.');
});

test('arch room: with reduced motion, the end of the story shows at once', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=arch');
  await expect(status(page)).toHaveText('Turned over, it stands · A semicircle: falls');
  await expect(readout(page)).toContainText('It would stand with stones at least 5.3 cm thick.');
});

test('arch room: thick enough stones hold the semicircle up too', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=arch');
  await page.locator('#c-thick').fill('6');
  await expect(status(page)).toHaveText('Turned over, it stands · A semicircle: stands');
  await expect(readout(page)).toContainText('It stands with stones down to 5.3 cm thick.');
  await expect(scene(page)).toHaveText('Your own experiment');
  await page.locator('#c-thick').fill('5');
  await expect(status(page)).toHaveText('Turned over, it stands · A semicircle: falls');
});

test('arch room: a tall tower on one side brings the arch down; hung on the chain first, it is carried', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=arch');
  const canvas = page.locator('#scene-canvas');
  await canvas.focus();
  // The keys start at the crown, stone 11: five to the left is stone 6, low on the left side.
  for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await expect(status(page)).toHaveText('Turned over, it stands · A semicircle: falls');
  await page.keyboard.press('ArrowUp');
  await expect(status(page)).toHaveText('Turned over, it falls · A semicircle: falls');
  await expect(readout(page)).toContainText('Turned over, with these loads, it falls.');
  await expect(readout(page)).toContainText(
    'No line of force fits: the best one leaves the stones by 13% of their thickness.',
  );
  await page.keyboard.press('f');
  await expect(status(page)).toHaveText('The chain hangs · A semicircle: falls');
  await page.keyboard.press('f');
  await expect(status(page)).toHaveText('Turned over, it stands · A semicircle: falls');
  expect(await link(page)).toContain('towers=3072'); // three storeys on stone 6: 3 × 4⁵
  // The same arch, from a link.
  await page.goto('/#room=arch&towers=3072');
  await expect(status(page)).toHaveText('Turned over, it stands · A semicircle: falls');
});

test('arch room: the arch beside it can be pointed, flat, or your own', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=arch');
  await page.getByRole('button', { name: 'Pointed', exact: true }).click();
  await expect(status(page)).toHaveText('Turned over, it stands · A pointed arch: stands');
  await expect(readout(page)).toContainText('It stands with stones down to 3.5 cm thick.');
  await page.getByRole('button', { name: 'Flat', exact: true }).click();
  await expect(status(page)).toHaveText('Turned over, it stands · A flat arch: stands');
  await page.getByRole('button', { name: 'Your own', exact: true }).click();
  await expect(status(page)).toHaveText('Turned over, it stands · Your own arch: falls');
  await expect(page.locator('#scene-controls')).toContainText('Drag its dots in or out');
  // The keys reach your own arch's dots after the stones and the right peg: move the crown's dot out.
  const canvas = page.locator('#scene-canvas');
  await canvas.focus();
  for (let i = 0; i < 16; i++) await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowUp');
  expect(await link(page)).toContain('de=53');
});

test('arch room: an arch drawn from foot to foot becomes your own', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=arch&shape=3');
  const box = await canvasBox(page);
  const { scale, ground, right } = places(box);
  const at = (phi, r) => [box.x + right + r * Math.cos(phi) * scale, box.y + ground - r * Math.sin(phi) * scale];
  // A tall arch: 0.3 m out at the feet, 0.65 m up at the crown.
  const points = Array.from({ length: 31 }, (_, k) => {
    const phi = Math.PI - (k / 30) * Math.PI;
    return at(phi, 0.3 + 0.35 * Math.sin(phi) ** 2);
  });
  await page.mouse.move(...points[0]);
  await page.mouse.down();
  for (const p of points.slice(1)) await page.mouse.move(...p, { steps: 2 });
  await page.mouse.up();
  await expect(status(page)).toHaveText('Turned over, it stands · Your own arch: falls');
  const url = await link(page);
  expect(url).toContain('da=30');
  expect(url).toContain('de=65');
  expect(url).toContain('di=30');
});

test('arch room: a dragged peg hangs the chain again, higher on one side', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=arch&flip=false');
  await expect(status(page)).toHaveText('The chain hangs · A semicircle: falls');
  const box = await canvasBox(page);
  const { scale, ground, left } = places(box);
  // The pegs are level, 1 m apart, 0.503 m above the chain's lowest point, which is on the ground line.
  const peg = [box.x + left + 0.5 * scale, box.y + ground - 0.5028 * scale];
  await page.mouse.move(...peg);
  await expect(page.locator('#scene-canvas')).toHaveClass(/arch-grab/);
  await page.mouse.down();
  await page.mouse.move(peg[0], peg[1] - 0.1 * scale, { steps: 4 });
  await page.mouse.move(peg[0], peg[1] - 0.2 * scale, { steps: 4 });
  await page.mouse.up();
  await expect(scene(page)).toHaveText('Your own experiment');
  expect(await link(page)).toContain('by=20');
  await page.getByRole('button', { name: 'Flip', exact: true }).click();
  await expect(status(page)).toHaveText('Turned over, it stands · A semicircle: falls');
});

test('arch room: a tap in the row of shapes tests that shape', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=arch');
  const box = await canvasBox(page);
  const { cell } = places(box);
  test.skip(!cell, 'the row of shapes needs a taller picture');
  await page.mouse.click(box.x + cell(1).x, box.y + cell(1).y);
  await expect(status(page)).toHaveText('Turned over, it stands · A pointed arch: stands');
  await page.mouse.click(box.x + cell(0).x, box.y + cell(0).y);
  await expect(status(page)).toHaveText('Turned over, it stands · A semicircle: falls');
});

test('arch room: a heavy road turns the chain into a parabola, and its arch carries the road', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=arch');
  await page.locator('.scene-preset', { hasText: 'A road to carry' }).click();
  await expect(scene(page)).toHaveText('A road to carry');
  await expect(status(page)).toHaveText('Turned over, it stands · A semicircle: falls');
  await expect(page.locator('#scene-controls input[data-check="road"]')).toBeChecked();
});

test('arch room: shared links keep the experiment, and ignore values out of range', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=arch&thick=99&shape=7');
  await expect(page.locator('#c-thick')).toHaveValue('4');
  await expect(status(page)).toHaveText('Turned over, it stands · A semicircle: falls');
  await page.goto('/#room=arch&thick=3&shape=1');
  await expect(status(page)).toHaveText('Turned over, it stands · A pointed arch: falls');
});

test.describe('on a touch screen', () => {
  test.use({ hasTouch: true });

  /** Starts a touch at a canvas position and reports whether the page was kept from scrolling. */
  const touchKeeps = (page, x, y) =>
    page.locator('#scene-canvas').evaluate(
      (canvas, [x, y]) => {
        const r = canvas.getBoundingClientRect();
        const point = { identifier: 1, target: canvas, clientX: r.left + x, clientY: r.top + y };
        const event = new TouchEvent('touchstart', {
          touches: [new Touch(point)],
          changedTouches: [new Touch(point)],
          cancelable: true,
          bubbles: true,
        });
        canvas.dispatchEvent(event);
        return event.defaultPrevented;
      },
      [x, y],
    );

  test('arch room: a finger on a peg drags it, drawing your own arch draws, and elsewhere the page scrolls', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#room=arch&flip=false');
    await expect(status(page)).toHaveText('The chain hangs · A semicircle: falls');
    const box = await page.locator('#scene-canvas').boundingBox();
    const { scale, ground, left, right } = places(box);
    expect(await touchKeeps(page, left + 0.5 * scale, ground - 0.5028 * scale)).toBe(true); // the right peg
    expect(await touchKeeps(page, left, ground - 0.25 * scale)).toBe(false); // under the chain
    expect(await touchKeeps(page, right, ground - 0.25 * scale)).toBe(false); // under the semicircle
    await page.getByRole('button', { name: 'Your own', exact: true }).click();
    expect(await touchKeeps(page, right, ground - 0.25 * scale)).toBe(true);
  });
});
