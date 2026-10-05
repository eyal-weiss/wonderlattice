import { test, expect, openRoom, setRange, tool, inkedPixels } from './helpers.js';

const status = (page) => page.locator('#scene-status');
const readout = (page) => page.locator('#voltage-readout');
/** The voltage the status line names, in kV. */
const kv = async (page) => Number((await status(page).textContent()).match(/^([\d.,]+)/)[1].replace(/,/g, ''));

test('voltage room: the dial turns itself, and the heat falls as the voltage climbs', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'voltage');
  await expect(page.locator('#scene-name')).toHaveText('Alternating current, through transformers');
  await expect.poll(() => inkedPixels(page, '#scene-canvas')).toBeGreaterThan(500);
  // It opens low, where the wire would waste everything, and climbs by itself.
  await expect(status(page)).toHaveText(/ · 100% lost$/);
  await expect.poll(() => kv(page), { timeout: 10000 }).toBeGreaterThan(40);
  await expect(status(page)).not.toHaveText(/100% lost/);
  // Taking the slider stops the turn.
  await setRange(page, '#voltage-kv', 2);
  await expect(status(page)).toHaveText('100 kV · 0.5% lost');
  await page.waitForTimeout(600);
  await expect(status(page)).toHaveText('100 kV · 0.5% lost');
});

test('voltage room: with reduced motion it stays at 10 kV, where half is lost, a hundred times what 100 kV loses', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=voltage');
  await expect(status(page)).toHaveText('10 kV · 50% lost');
  await expect(page.locator('#voltage-kv-out')).toHaveText('10 kV');
  await expect(page.locator('#voltage-kv')).toHaveAttribute('aria-valuetext', /^10\skV, 50% lost as heat$/);
  await expect(page.locator('.voltage-big strong')).toHaveText('50%');
  await expect(readout(page)).toContainText('5 MW of the 10 MW sent.');
  await expect(readout(page)).toContainText('The wire carries 1,000 A');
  await expect(readout(page)).toContainText(
    'At 100 kV, ten times the voltage, it would waste 50 kW: a hundred times less.',
  );
  await expect(readout(page)).toContainText('The wire is 2.7 cm thick: 150 tonnes of aluminium.');
  // Ten times the voltage: a hundredth of the heat.
  await setRange(page, '#voltage-kv', 2);
  await expect(page.locator('.voltage-big strong')).toHaveText('0.5%');
  await expect(readout(page)).toContainText('50 kW of the 10 MW sent.');
  // Below about 7 kV the sums would waste more than is sent: the town gets nothing.
  await setRange(page, '#voltage-kv', Math.log10(5));
  await expect(page.locator('.voltage-big strong')).toHaveText('100%');
  await expect(readout(page)).toContainText('The sums ask the wire to waste 20 MW, more than the 10 MW sent');
});

test('voltage room: beside the long panel the picture fills its frame, with the dial just above the buttons', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=voltage');
  await expect(status(page)).toHaveText('10 kV · 50% lost');
  // The panel makes the canvas taller than its width calls for; the chart takes the extra height, so no empty band
  // is left between the picture and the buttons.
  const { height, emptyBelow } = await page.locator('#scene-canvas').evaluate((canvas) => {
    const { width, height } = canvas;
    const data = canvas.getContext('2d').getImageData(0, 0, width, height).data;
    const differs = (o, base) =>
      Math.abs(data[o] - data[base]) + Math.abs(data[o + 1] - data[base + 1]) + Math.abs(data[o + 2] - data[base + 2]) >
      24;
    let last = 0;
    for (let y = height - 1; y >= 0 && !last; y--)
      for (let x = 0; x < width; x += 2)
        if (differs((y * width + x) * 4, y * width * 4)) {
          last = y;
          break;
        }
    const scale = canvas.getBoundingClientRect().height / height;
    return { height: canvas.getBoundingClientRect().height, emptyBelow: (height - 1 - last) * scale };
  });
  expect(height).toBeGreaterThan(800);
  expect(emptyBelow).toBeLessThan(40);
});

test('voltage room: the presets, a main grid line and a hundred times the metal', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=voltage');
  await page.getByRole('button', { name: /Like a main grid line/ }).click();
  await expect(status(page)).toHaveText('400 kV · 0.031% lost');
  await expect(readout(page)).toContainText('3.1 kW of the 10 MW sent.');
  await expect(readout(page)).toContainText('At 40 kV, a tenth of the voltage, it would waste 310 kW');
  await page.getByRole('button', { name: /Just add metal/ }).click();
  await expect(status(page)).toHaveText('10 kV · 0.5% lost');
  await expect(page.locator('#voltage-metal-out')).toHaveText('×100');
  await expect(readout(page)).toContainText('The wire is 27 cm thick: 15,000 tonnes of aluminium.');
  await setRange(page, '#voltage-metal', Math.log10(2));
  await expect(page.locator('.voltage-big strong')).toHaveText('25%');
});

test('voltage room: direct current stops the transformers, and converters start them again', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=voltage');
  await page.getByRole('button', { name: 'DC, 1880s', exact: true }).click();
  await expect(page.locator('#scene-name')).toHaveText('Direct current, as in the 1880s');
  await expect(status(page)).toHaveText('No current gets through');
  await expect(readout(page)).toContainText('A transformer only works while the current keeps changing');
  await expect(readout(page)).toContainText('less than a mile away');
  await expect(page.locator('.voltage-big')).toHaveCount(0);
  await page.getByRole('button', { name: 'DC, today', exact: true }).click();
  await expect(page.locator('#scene-name')).toHaveText('Direct current today, through converters');
  await expect(status(page)).toHaveText('10 kV · 50% lost');
  await expect(readout(page)).toContainText('Electronics now turn alternating current into direct current');
  await expect(page.getByRole('button', { name: 'DC, today', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('voltage room: the keyboard, a drag along the dial, and shared links', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=voltage&kv=100&current=2&metal=4');
  await expect(status(page)).toHaveText('100 kV · 0.13% lost');
  await expect(page.locator('#voltage-metal-out')).toHaveText('×4');
  await expect(page.locator('#scene-name')).toHaveText('Direct current today, through converters');
  // Values outside the ranges are ignored, not trusted (a fresh page, so nothing is left from the last link).
  await page.goto('about:blank');
  await page.goto('/#room=voltage&kv=5000&current=7&metal=0');
  await expect(status(page)).toHaveText('10 kV · 50% lost');
  await page.locator('#scene-canvas').focus();
  await page.keyboard.press('ArrowRight');
  await expect(status(page)).toHaveText('11 kV · 41% lost');
  await page.keyboard.press('ArrowLeft');
  await expect(status(page)).toHaveText('9.8 kV · 52% lost');
  // A drag along the chart turns the dial: the middle is about 30 kV, the right end 1,000 kV.
  const canvas = page.locator('#scene-canvas');
  await canvas.evaluate((el) => el.scrollIntoView({ block: 'start' }));
  const box = await canvas.boundingBox();
  const y = box.y + Math.min(box.height, box.width * 0.58) * 0.85;
  await page.mouse.move(box.x + box.width / 2, y);
  await page.mouse.down();
  const middle = await kv(page);
  expect(middle).toBeGreaterThan(20);
  expect(middle).toBeLessThan(40);
  await page.mouse.move(box.x + box.width - 2, y, { steps: 6 });
  await page.mouse.up();
  await expect(status(page)).toHaveText('1,000 kV · 0.005% lost');
});

test('voltage room: a linked voltage stays put, and Start again turns the dial once more', async ({ page }) => {
  await page.goto('/#room=voltage&kv=100');
  await page.waitForTimeout(800);
  await expect(status(page)).toHaveText('100 kV · 0.5% lost');
  await page.locator('#scene-reset').click();
  await expect.poll(() => kv(page)).not.toBe(100);
  await expect.poll(() => kv(page), { timeout: 10000 }).toBeGreaterThan(20);
});

test('voltage room: time pauses, and the sound is opt-in', async ({ page }) => {
  await page.goto('/#room=voltage');
  await expect.poll(() => kv(page), { timeout: 10000 }).toBeGreaterThan(5);
  await page.locator('#scene-play').click(); // pause
  const paused = await kv(page);
  await page.waitForTimeout(1000);
  expect(await kv(page)).toBe(paused);
  await expect(page.locator('#scene-action')).toHaveText('Turn sound on');
  expect((await tool(page, 'read_exploration')).soundOn).toBe(false);
  await page.locator('#scene-action').click();
  await expect(page.locator('#scene-action')).toHaveText('Sound on · mute');
  expect((await tool(page, 'read_exploration')).soundOn).toBe(true);
  await expect(page.locator('#scene-play')).toHaveText('Pause'); // sound starts the picture again
  await page.locator('#scene-play').click();
  await expect(page.locator('#scene-action')).toHaveText('Turn sound on'); // pausing silences it
  await page.locator('#scene-action').click();
  await openRoom(page, 'blocks');
  expect((await tool(page, 'read_exploration')).soundOn).toBe(false);
});

test('voltage room: in Hebrew the voltage slider still runs low to high, left to right, like the drawn dial', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?lang=he#room=voltage');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  const slider = page.locator('#voltage-kv');
  expect(await slider.evaluate((el) => getComputedStyle(el).direction)).toBe('ltr');
  await slider.scrollIntoViewIfNeeded();
  const box = await slider.boundingBox();
  await page.mouse.click(box.x + box.width * 0.95, box.y + box.height / 2);
  expect(Number(await slider.inputValue())).toBeGreaterThan(2.5);
});
