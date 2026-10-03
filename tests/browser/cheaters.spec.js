import { test, expect, openRoom } from './helpers.js';

const status = (page) => page.locator('#scene-status');
const generation = async (page) => Number((await status(page).textContent()).match(/^Generation (\d+)/)?.[1] ?? -1);
const percent = async (page) => Number((await status(page).textContent()).match(/([\d.]+)% cooperate/)?.[1] ?? -1);

/**
 * What the canvas shows in each grid cell [x, y]: 'cooperator', 'cheater', 'newCooperator', 'newCheater', or
 * 'other'. The grid's place follows the room's layout: 12 px from the top left on wide canvases (at most 57% of
 * the width), and on phones as tall as the canvas allows, beside a slim meter.
 */
const cellColours = (page, list) =>
  page.locator('#scene-canvas').evaluate((canvas, list) => {
    const r = canvas.getBoundingClientRect(),
      W = r.width,
      H = r.height;
    let size, x;
    if (W >= 600) {
      size = Math.max(160, Math.min(H - 24, W * 0.57, 600));
      x = 12;
    } else {
      size = Math.max(100, Math.min(H - 24, W - 74));
      x = W - size - 36 < 34 ? (W - size) / 2 : 12;
    }
    const scale = canvas.width / W;
    const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    const names = {
      cooperator: [61, 116, 201],
      cheater: [209, 69, 59],
      newCooperator: [240, 196, 60],
      newCheater: [79, 179, 106],
    };
    return list.map(([gx, gy]) => {
      const px = Math.round((x + ((gx + 0.5) * size) / 99) * scale),
        py = Math.round((12 + ((gy + 0.5) * size) / 99) * scale);
      const o = (py * canvas.width + px) * 4;
      let best = 'other',
        distance = 40;
      for (const [name, c] of Object.entries(names)) {
        const d = Math.hypot(data[o] - c[0], data[o + 1] - c[1], data[o + 2] - c[2]);
        if (d < distance) [best, distance] = [name, d];
      }
      return best;
    });
  }, list);

/** Every cell in the top-left quarter, against its images in the square's mirrors: how many differ, and cheaters. */
async function symmetry(page) {
  const cells = [];
  for (let y = 0; y < 50; y++) for (let x = 0; x <= y; x++) cells.push([x, y]);
  const images = (x, y) => [
    [98 - x, y],
    [x, 98 - y],
    [y, x],
    [98 - y, 98 - x],
  ];
  const all = cells.flatMap(([x, y]) => [[x, y], ...images(x, y)]);
  const colours = await cellColours(page, all);
  let differ = 0,
    cheaters = 0;
  for (let k = 0; k < colours.length; k += 5) {
    if (colours.slice(k + 1, k + 5).some((c) => c !== colours[k])) differ++;
    if (colours[k] === 'cheater') cheaters++;
  }
  return { differ, cheaters, other: colours.filter((c) => c === 'other').length };
}

test('one cheater blooms into a kaleidoscope with the square’s full symmetry, by itself', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'cheaters');
  await expect(page.locator('#room-title')).toHaveText('Kaleidoscope of cheaters.');
  await expect(page.locator('#scene-name')).toHaveText('One cheater');
  await expect.poll(() => generation(page), { timeout: 20000 }).toBeGreaterThan(25);
  await page.locator('#scene-play').click();
  await expect(page.locator('#scene-play')).toHaveText('Play');
  await page.locator('#scene-canvas').evaluate((el) => el.scrollIntoView({ block: 'start' }));
  const { differ, cheaters, other } = await symmetry(page);
  expect(other).toBe(0);
  expect(differ).toBe(0);
  expect(cheaters).toBeGreaterThan(100);
  expect(await percent(page)).toBeLessThan(90);
});

test('a tap, the keyboard and “Next generation” switch players by hand', async ({ page }) => {
  await page.goto('/#room=cheaters');
  await page.locator('#scene-play').click();
  await page.locator('#scene-reset').click();
  await expect(status(page)).toHaveText('Generation 0 · 99.9% cooperate');
  await page.locator('#scene-canvas').evaluate((el) => el.scrollIntoView({ block: 'start' }));
  expect(
    await cellColours(page, [
      [49, 49],
      [60, 49],
    ]),
  ).toEqual(['cheater', 'cooperator']);

  // Arrows aim (the first press shows the aim in the middle), Enter switches.
  await page.locator('#scene-canvas').focus();
  await page.keyboard.press('ArrowRight');
  for (let k = 0; k < 11; k++) await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Escape'); // hides the aim, which would cover the cells beside it
  expect(await cellColours(page, [[60, 49]])).toEqual(['cheater']);
  await expect(page.locator('#scene-name')).toHaveText('Your own grid');

  // A tap on a cell switches it; a second tap switches it back.
  const box = await page.locator('#scene-canvas').boundingBox();
  const size = Math.min(box.height - 24, box.width * 0.57, 600);
  const at = { x: 12 + (30.5 * size) / 99, y: 12 + (70.5 * size) / 99 };
  await page.locator('#scene-canvas').click({ position: at });
  expect(await cellColours(page, [[30, 70]])).toEqual(['cheater']);
  await page.locator('#scene-canvas').click({ position: at });
  expect(await cellColours(page, [[30, 70]])).toEqual(['cooperator']);

  await page.locator('#cheaters-next').click();
  await expect(status(page)).toHaveText(/^Generation 1 · /);
  // The two cheaters' neighbours have just started cheating.
  expect(
    await cellColours(page, [
      [50, 49],
      [61, 49],
    ]),
  ).toEqual(['newCheater', 'newCheater']);
});

test('with little temptation the cheater stays a small block; just above 2 its blob stops growing', async ({
  page,
}) => {
  await page.goto('/#room=cheaters&b=1.7');
  await expect(status(page)).toHaveText('Settled for good at generation 2 · 99.9% cooperate');
  await expect(page.locator('#c-b')).toHaveValue('1.7');
  await page.goto('/#room=cheaters&b=1.3');
  await page.reload();
  await expect(status(page)).toHaveText(/^Repeating every 2 generations · /);
  await page.goto('/#room=cheaters&b=2.1&speed=5');
  await page.reload();
  await expect(status(page)).toHaveText(/^Settled for good at generation \d+ · 91% cooperate$/, { timeout: 30000 });
});

test('a mixed crowd settles around a third cooperating', async ({ page }) => {
  await page.goto('/#room=cheaters&start=1&speed=5');
  await expect(page.locator('#scene-name')).toHaveText('A mixed crowd');
  await expect.poll(() => generation(page), { timeout: 40000 }).toBeGreaterThan(120);
  const share = await percent(page);
  expect(share).toBeGreaterThan(20);
  expect(share).toBeLessThan(45);
});

test('switching one at a time, the cheaters take over', async ({ page }) => {
  await page.goto('/#room=cheaters&speed=5');
  await page.getByRole('button', { name: /One at a time/ }).click();
  await expect(page.locator('#scene-name')).toHaveText('Switching one at a time');
  await expect(page.locator('[data-check="together"]')).not.toBeChecked();
  await expect(status(page)).toHaveText(/every player cheats$/, { timeout: 60000 });
  // Ticking it again with cheaters everywhere changes nothing: there is no one left to copy.
  await page.locator('[data-check="together"]').check();
  await expect(page.locator('#scene-name')).toHaveText('One cheater');
});

test('a stray cheater breaks the symmetry', async ({ page }) => {
  await page.goto('/#room=cheaters');
  await page.locator('#scene-play').click();
  await page.locator('#scene-reset').click();
  await page.locator('#scene-action').click();
  await expect(page.locator('#scene-name')).toHaveText('Your own grid');
  for (let k = 0; k < 4; k++) await page.locator('#cheaters-next').click();
  await expect(status(page)).toHaveText(/^Generation 4 · /);
  await page.locator('#scene-canvas').evaluate((el) => el.scrollIntoView({ block: 'start' }));
  expect((await symmetry(page)).differ).toBeGreaterThan(0);
});

test('with reduced motion it opens on a still kaleidoscope, and steps on request', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=cheaters');
  await expect(page.locator('#scene-play')).toHaveText('Play');
  await expect(status(page)).toHaveText(/^Generation 60 · /);
  await page.waitForTimeout(600);
  await expect(status(page)).toHaveText(/^Generation 60 · /);
  await page.locator('#cheaters-next').click();
  await expect(status(page)).toHaveText(/^Generation 61 · /);
});

test('the colour key sits in the panel on phones, and the explanation is honest about forever', async ({ page }) => {
  await page.goto('/#room=cheaters');
  await expect(page.locator('#cheaters-key')).toBeHidden(); // on a wide screen the key is drawn beside the grid
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('#cheaters-key')).toBeVisible();
  await expect(page.locator('#cheaters-key li:visible')).toHaveCount(4);
  await page.locator('[data-check="fresh"]').uncheck();
  await expect(page.locator('#cheaters-key li:visible')).toHaveCount(2);
  await page.locator('#scene-why').click();
  await expect(page.locator('#insight-dialog')).toContainText('after about a billion generations');
  await expect(page.locator('#insight-dialog')).toContainText('Huberman and Glance');
  await page.locator('#insight-close').click();
});
