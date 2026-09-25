import { test, expect, ROOMS, openRoom, tool, setRange, inkedPixels, expectRoom } from './helpers.js';

const settings = async (page) => (await tool(page, 'read_exploration')).settings;

test('storm room: codes repair the picture, and the readouts follow', async ({ page }) => {
  await page.goto('/');
  await expect.poll(() => inkedPixels(page, '#card-storm canvas')).toBeGreaterThan(20);
  await openRoom(page, 'storm');
  await expect(page.locator('#room-title')).toHaveText(ROOMS.storm);
  await expect.poll(() => inkedPixels(page, '#scene-canvas')).toBeGreaterThan(50);

  // The first storm, with no protection: every flip is a wrong pixel.
  await expect(page.locator('#scene-name')).toHaveText('No protection');
  await expect(page.locator('#scene-status')).toHaveText('3 pixels wrong');
  const result = page.locator('#storm-result');
  await expect(result).toContainText('Bits sent64 (+0% extra)');
  await expect(result).toContainText('Flipped by the storm3');
  await expect(result).toContainText('Pixels still wrong3');
  // The figures change with every setting, so they are not a live region: the arrival is announced once instead.
  await expect(page.locator('#storm-result')).not.toHaveAttribute('role', 'status');
  await expect(page.locator('#announcer')).toHaveText('3 pixels wrong');
  // Each preset's badge says what its percentage counts.
  await expect(page.locator('.scene-preset').nth(2).locator('.number')).toHaveText('+75%extra bits');

  // Hamming's trick in the same storm repairs everything, for 75% extra.
  await page.locator('#storm-code').selectOption('3');
  await expect(page.locator('#scene-name')).toHaveText('Hamming’s trick');
  await expect(page.locator('#scene-status')).toHaveText('Every pixel arrived');
  await expect(page.locator('#announcer')).toHaveText('Every pixel arrived');
  await expect(result).toContainText('Bits sent112 (+75% extra)');
  await expect(result).toContainText('Repaired on arrival4');
  await expect(result).toContainText('Pixels still wrong0');
  await expect(page.locator('.scene-preset').nth(2)).toHaveAttribute('aria-pressed', 'true');

  // A parity bit only knows which blocks are damaged.
  await page.locator('#storm-code').selectOption('2');
  await expect(result).toContainText('Bits sent80 (+25% extra)');
  await expect(result).toContainText('Blocks known bad');
  await expect(page.locator('#scene-tip')).toContainText('known bad');
  await expect(page.locator('.scene-preset[aria-pressed="true"]')).toHaveCount(0);

  // A preset, a stronger storm, and a new storm.
  await page.getByRole('button', { name: /Say it three times/ }).click();
  await expect(page.locator('#storm-code')).toHaveValue('1');
  await expect(result).toContainText('Bits sent192 (+200% extra)');
  await setRange(page, '#c-storm', 20);
  await expect(page.locator('#v-storm')).toHaveText('20%');
  expect((await settings(page)).storm).toBe(20);
  const seed = (await settings(page)).seed;
  await expect(page.locator('#scene-action')).toHaveText('Send again');
  await page.locator('#scene-action').click();
  expect((await settings(page)).seed).not.toBe(seed);
  await expect(result).toContainText(/Flipped by the storm\d+/);

  await page.locator('#scene-why').click();
  await expect(page.locator('#insight-dialog')).toContainText('the checks that fail add up to its position');
  await page.locator('#insight-close').click();
});

test('storm room: draw with presets, the keyboard, and the pointer', async ({ page }) => {
  await page.goto('/#room=storm');
  const heart = page.getByRole('button', { name: 'Heart', exact: true });
  await expect(heart).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Clear', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Clear', exact: true })).toHaveAttribute('aria-pressed', 'true');
  expect(await settings(page)).toMatchObject({ top: 0, bottom: 0 });
  await heart.click();

  // Keyboard: the first arrow shows a cursor, Enter paints under it.
  await page.locator('#scene-canvas').focus();
  const before = await settings(page);
  await page.keyboard.press('ArrowRight');
  expect(await settings(page)).toEqual(before);
  await page.keyboard.press('Enter');
  expect((await settings(page)).top).not.toBe(before.top);
  await expect(heart).toHaveAttribute('aria-pressed', 'false');
  await page.keyboard.press('Enter');
  expect((await settings(page)).top).toBe(before.top);

  // Pointer: click an inked pixel of your picture to erase it.
  const spot = await page.locator('#scene-canvas').evaluate((canvas) => {
    const ctx = canvas.getContext('2d');
    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < height; y += 2)
      for (let x = 0; x < width / 3; x += 2) {
        const i = 4 * (y * width + x);
        if (data[i] === 0xf3 && data[i + 1] === 0xe6 && data[i + 2] === 0xc4)
          return { x: (x + 4) / (width / canvas.clientWidth), y: (y + 4) / (height / canvas.clientHeight) };
      }
    return null;
  });
  expect(spot).not.toBeNull();
  await page.locator('#scene-canvas').click({ position: spot });
  expect((await settings(page)).top + (await settings(page)).bottom).not.toBe(before.top + before.bottom);
  await expect(heart).toHaveAttribute('aria-pressed', 'false');
});

test('storm room: a shared link restores the code, storm, and picture', async ({ page }) => {
  await page.goto('/#room=storm&code=3&storm=12.5&seed=77&top=0&bottom=255&unknown=1');
  await expectRoom(page, 'storm');
  await expect(page.locator('#storm-code')).toHaveValue('3');
  await expect(page.locator('#v-storm')).toHaveText('12.5%');
  expect(await settings(page)).toMatchObject({ code: 3, storm: 12.5, seed: 77, top: 0, bottom: 255 });
  // Out-of-range values are ignored.
  await page.evaluate(() => (location.hash = 'room=storm&code=9&storm=80&top=-1'));
  await expect.poll(async () => (await settings(page)).code).toBe(3);
  expect(await settings(page)).toMatchObject({ storm: 12.5, top: 0 });
  await page.locator('#scene-share').click();
  const link = await page.evaluate(() => window.__clipboard.at(-1));
  expect(link).toBe(new URL('/#room=storm&storm=12.5&code=3&seed=77&top=0&bottom=255', page.url()).href);
});

test('storm room: reduced motion shows the result at once', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=storm');
  await expect(page.locator('#scene-play')).toHaveText('Play');
  // The received picture is drawn straight away: its wrong-pixel crosses are on the canvas.
  const crosses = await page.locator('#scene-canvas').evaluate((canvas) => {
    const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    let n = 0;
    for (let i = 0; i < data.length; i += 4) if (data[i] === 0xff && data[i + 1] === 0x5d && data[i + 2] === 0x73) n++;
    return n;
  });
  expect(crosses).toBeGreaterThan(10);
});
