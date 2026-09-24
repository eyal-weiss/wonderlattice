import { test, expect, ROOMS, openRoom, expectRoom, setRange, inkedPixels, tool } from './helpers.js';

/** The average estimate and the true share, in percent, as the readout records them. */
async function meanAndTruth(page) {
  const data = await page.locator('#sample-readout').evaluate((el) => ({ ...el.dataset }));
  return { mean: Number(data.mean), truth: Number(data.truth) };
}

const cityShare = (page, seed) => page.evaluate((s) => globalThis.Wonderloom.models.sample.city(s).share * 100, seed);

test('sample room: open from the map, ask, repeat, and reveal the truth', async ({ page }) => {
  await page.goto('/');
  await expect.poll(() => inkedPixels(page, '#card-sample canvas')).toBeGreaterThan(20);
  await openRoom(page, 'sample');
  await expect(page.locator('#room-title')).toHaveText(ROOMS.sample);
  await expect(page.locator('#scene-name')).toHaveText('Ask at random');
  await expect(page.locator('#scene-status')).toHaveText('Ready to ask');
  await expect(page.locator('#sample-count')).toHaveText('No surveys yet.');
  await expect.poll(() => inkedPixels(page, '#scene-canvas')).toBeGreaterThan(50);

  // One survey lights up 50 residents and adds one dot.
  const before = await inkedPixels(page, '#scene-canvas');
  await page.locator('#sample-once').click();
  await expect(page.locator('#scene-status')).toHaveText('1 survey');
  await expect(page.locator('#sample-count')).toHaveText('1 survey of 50 people');
  await expect(page.locator('#sample-estimate')).toContainText('This one says');
  expect(await inkedPixels(page, '#scene-canvas')).toBeGreaterThan(before);

  // Fifty more, animated.
  await page.locator('#scene-action').click();
  await expect(page.locator('#sample-count')).toHaveText('51 surveys of 50 people', { timeout: 10000 });
  await expect(page.locator('#sample-estimate')).toContainText('give or take');
  await expect(page.locator('#sample-theory')).toHaveText('A random sample of 50 wobbles by about ±7.0 points.');

  // The whole city's answer is hidden until asked for.
  await expect(page.locator('#sample-truth')).toHaveText('The whole city’s answer is hidden.');
  await page.locator('[data-check="reveal"]').check();
  const truth = await cityShare(page, 44);
  await expect(page.locator('#sample-truth')).toContainText(`The whole city: ${Math.round(truth)}% orange.`);
  await expect(page.locator('#sample-truth')).toContainText('Typical miss');
  // Random samples centre on the truth: 51 surveys of 50 average within a few points of it.
  const { mean, truth: recorded } = await meanAndTruth(page);
  expect(recorded).toBeCloseTo(truth, 1);
  expect(Math.abs(mean - truth)).toBeLessThan(4);
  expect((await tool(page, 'read_exploration')).settings).toMatchObject({
    method: 0,
    size: 50,
    hood: 10,
    seed: 44,
    reveal: true,
  });

  await page.locator('#scene-reset').click();
  await expect(page.locator('#scene-status')).toHaveText('Ready to ask');
  await expect(page.locator('#sample-count')).toHaveText('No surveys yet.');
});

test('sample room: biased presets are tight around the wrong answer, and batches land at once with reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=sample');
  await expectRoom(page, 'sample');
  await expect(page.locator('#scene-play')).toHaveText('Play');

  await page.getByRole('button', { name: /A huge biased poll/ }).click();
  await expect(page.locator('#sample-method')).toHaveValue('2');
  await expect(page.locator('#sample-size-value')).toHaveText('1,000');
  await expect(page.locator('#scene-name')).toHaveText('Whoever answers');
  await page.locator('#scene-action').click();
  await expect(page.locator('#sample-count')).toHaveText('50 surveys of 1,000 people');
  await page.locator('#scene-action').click();
  await expect(page.locator('#sample-count')).toHaveText('100 surveys of 1,000 people');
  let { mean, truth } = await meanAndTruth(page);
  expect(mean - truth).toBeGreaterThan(10); // orange fans reply more, so the poll leans orange
  const spread = Number((await page.locator('#sample-estimate').textContent()).match(/give or take ([\d.]+)/)[1]);
  expect(spread).toBeLessThan(2); // and it is sure of itself
  await expect(page.locator('#sample-note')).toContainText('Orange fans are keener to reply');

  await page.getByRole('button', { name: /Ask the neighbours/ }).click();
  await expect(page.locator('#sample-method')).toHaveValue('1');
  const oddest = await page.evaluate(() => {
    const m = globalThis.Wonderloom.models.sample;
    return m.oddestHood(m.city(44));
  });
  await expect(page.locator('#sample-hood')).toHaveValue(String(oddest));
  await expect(page.locator('#scene-name')).toHaveText('In Lantern Hill');
  await page.locator('#scene-action').click();
  await expect(page.locator('#sample-count')).toHaveText('50 surveys of 50 people');
  ({ mean, truth } = await meanAndTruth(page));
  expect(Math.abs(mean - truth)).toBeGreaterThan(20);

  // Asking more people than live there asks all of them.
  await setRange(page, '#sample-size', 14);
  await expect(page.locator('#sample-size-value')).toHaveText('1,000');
  await expect(page.locator('#sample-note')).toContainText('so each survey asks everyone there');
  await expect(page.locator('#scene-presets [aria-pressed="true"]')).toHaveCount(0);
});

test('sample room: the map, the keyboard, and a new city', async ({ page }) => {
  await page.goto('/#room=sample');
  await expectRoom(page, 'sample');
  // Arrow keys on the canvas step through neighbourhoods and survey sizes.
  await page.locator('#scene-canvas').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#sample-method')).toHaveValue('1');
  await expect(page.locator('#sample-hood')).toHaveValue('11');
  await expect(page.locator('#scene-name')).toHaveText('In Ropewalk');
  await page.keyboard.press('ArrowUp');
  await expect(page.locator('#sample-size-value')).toHaveText('75');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#sample-size-value')).toHaveText('40');

  // Back to random. A tap below the map changes nothing; a tap on the map asks that neighbourhood.
  await page.locator('#sample-method').selectOption('0');
  await expect(page.locator('#scene-name')).toHaveText('Ask at random');
  const box = await page.locator('#scene-canvas').boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.9);
  await expect(page.locator('#sample-method')).toHaveValue('0');
  await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.25);
  await expect(page.locator('#sample-method')).toHaveValue('1');
  const tapped = Number(await page.locator('#sample-hood').inputValue());
  const names = await page.locator('#sample-hood option').allTextContents();
  await expect(page.locator('#scene-name')).toHaveText(`In ${names[tapped]}`);

  // Picking a neighbourhood from the list also means asking there.
  await page.locator('#sample-method').selectOption('2');
  await page.locator('#sample-hood').selectOption('4');
  await expect(page.locator('#sample-method')).toHaveValue('1');
  await expect(page.locator('#scene-name')).toHaveText('In Riverside');

  // A new city has a new seed, and the neighbourhood asked is its most unusual one.
  await page.locator('#sample-city').click();
  const { settings } = await tool(page, 'read_exploration');
  expect(settings.seed).not.toBe(44);
  const oddest = await page.evaluate((seed) => {
    const m = globalThis.Wonderloom.models.sample;
    return m.oddestHood(m.city(seed));
  }, settings.seed);
  expect(settings.hood).toBe(oddest);
  await expect(page.locator('#sample-readout')).toHaveAttribute(
    'data-truth',
    (await cityShare(page, settings.seed)).toFixed(2),
  );

  // The explanation gives this city's own numbers.
  await page.locator('#scene-why').click();
  await expect(page.locator('#sample-live')).toContainText('In your city, a random sample of 40 wobbles by about');
  await page.locator('#insight-close').click();
});

test('sample room: a shared link restores the survey, and odd values are ignored', async ({ page }) => {
  await page.goto('/#room=sample&method=1&size=200&hood=3&seed=42&reveal=true');
  await expectRoom(page, 'sample');
  await expect(page.locator('#sample-method')).toHaveValue('1');
  await expect(page.locator('#sample-hood')).toHaveValue('3');
  await expect(page.locator('#sample-size-value')).toHaveText('200');
  await expect(page.locator('[data-check="reveal"]')).toBeChecked();
  await expect(page.locator('#scene-name')).toHaveText('In Mill Row');
  await expect(page.locator('#sample-readout')).toHaveAttribute('data-truth', (await cityShare(page, 42)).toFixed(2));
  await page.locator('#scene-share').click();
  const link = await page.evaluate(() => window.__clipboard.at(-1));
  expect(link).toMatch(/#room=sample&method=1&size=200&hood=3&seed=42&reveal=true$/);

  // Out-of-range values are ignored; the rest of the link still applies.
  await page.evaluate(() => (location.hash = 'room=sample&method=7&size=5000&hood=2&seed=0'));
  await expect(page.locator('#sample-hood')).toHaveValue('2');
  await expect(page.locator('#sample-method')).toHaveValue('1');
  await expect(page.locator('#sample-size-value')).toHaveText('200');
  expect((await tool(page, 'read_exploration')).settings.seed).toBe(42);
});

test('old survey dots stay put after leaving the room and coming back', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/#room=sample');
  await page.locator('#scene-action').click(); // Ask 50 times
  // Wait for the whole batch to land (switching rooms mid-batch would rightly resume it on return).
  await expect(page.locator('#sample-count')).toHaveText('50 surveys of 50 people', { timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.locator('#room-next').click();
  await page.locator('#room-prev').click();
  const picture = () => page.locator('#scene-canvas').evaluate((c) => c.toDataURL());
  // A re-run of the drop animation would change the plot over the next few seconds.
  await page.waitForTimeout(500);
  const settled = await picture();
  await page.waitForTimeout(4500);
  expect(await picture()).toBe(settled);
});
