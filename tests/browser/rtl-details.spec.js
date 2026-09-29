import { test, expect } from './helpers.js';

// Details that right-to-left pages (Hebrew, Arabic) and non-Latin keyboards need, found translating into Arabic.
const style = (page, selector, property) =>
  page
    .locator(selector)
    .first()
    .evaluate((el, p) => getComputedStyle(el)[p], property);

test('letter shortcuts work on keyboards that type another alphabet', async ({ page }) => {
  await page.goto('/');
  const results = await page.evaluate(() => {
    const is = (key, code, letter) => Wonderlattice.isLetter({ key, code }, letter);
    return [
      is('b', 'KeyB', 'b'), // English
      is('B', 'KeyB', 'b'), // with Shift
      is('נ', 'KeyB', 'b'), // Hebrew, same key
      is('لا', 'KeyB', 'b'), // Arabic, same key
      is('z', 'KeyW', 'z'), // French AZERTY: the letter wins over the position
      is('w', 'KeyZ', 'z'), // …so AZERTY's W key is not Z
    ];
  });
  expect(results).toEqual([true, true, true, true, true, false]);
  // In the blocks room, B on a Hebrew keyboard makes the best stack.
  await page.goto('/?lang=he#room=blocks');
  await page.locator('#scene-canvas').focus();
  await page.locator('#scene-canvas').dispatchEvent('keydown', { key: 'נ', code: 'KeyB', bubbles: true });
  await expect(page.locator('#announcer')).not.toBeEmpty();
});

test('on right-to-left pages, notation and diagrams keep their left-to-right order', async ({ page }) => {
  await page.goto('/?lang=he#room=cube&mode=1');
  const option = await page.locator('#cube-a option').first().textContent();
  expect(option.startsWith('⁦')).toBe(true); // the move's notation is isolated: U′, never ′U
  await page.goto('/?lang=he#room=loom');
  expect(await style(page, '.loom-tieup', 'direction')).toBe('ltr'); // pedal 1 on the left, as in the picture
  await page.goto('/?lang=he#room=shower&mode=2');
  expect(await style(page, '.shower-scale', 'direction')).toBe('ltr'); // cold on the left, like the slider
  await page.goto('/?lang=he#room=parrondo');
  expect(await style(page, '.parrondo-race-row strong', 'direction')).toBe('ltr'); // −10.0, never 10.0−
});

test('a source that is not a link stays in one piece', async ({ page }) => {
  await page.goto('/?lang=he#room=fireflies');
  await page.locator('#scene-why').click();
  expect(await style(page, '#insight-body .sources', 'display')).toBe('block');
});

test('the Julia room’s label keeps its formula’s letters as they are', async ({ page }) => {
  await page.goto('/#room=julia');
  expect(await style(page, '#scene-label', 'textTransform')).toBe('none');
  await expect(page.locator('#scene-label')).toHaveText('One rule · z → z² + c');
});
