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
    const is = (key, code, letter) => globalThis.Wonderlattice.isLetter({ key, code }, letter);
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

// The globe and stopping rooms draw their pictures left to right on every page, so a Hebrew or Arabic label there
// needs marks to keep its punctuation and numbers in place. Each label drawn must look as it would in the page.
test('on left-to-right pictures, Hebrew and Arabic labels read as they do in the page', async ({ page }) => {
  await page.addInitScript(() => {
    window.__drawn = new Set();
    const fill = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (text, ...rest) {
      if (this.direction === 'ltr' && /[\u0590-\u06ff]/.test(text)) window.__drawn.add(String(text));
      return fill.call(this, text, ...rest);
    };
  });
  // The labels drawn so far whose characters, laid out left to right, sit in another order than right to left.
  const misordered = () =>
    page.evaluate(() => {
      const order = (text, dir) => {
        const div = document.createElement('div');
        div.dir = dir;
        div.style.cssText = 'position:absolute;white-space:pre';
        div.textContent = text;
        document.body.append(div);
        const range = document.createRange();
        const chars = [];
        for (let i = 0; i < text.length; i++) {
          range.setStart(div.firstChild, i);
          range.setEnd(div.firstChild, i + 1);
          const box = range.getBoundingClientRect();
          if (box.width) chars.push([box.left, text[i]]);
        }
        div.remove();
        return chars
          .sort((a, b) => a[0] - b[0])
          .map((c) => c[1])
          .join('');
      };
      return [...window.__drawn].filter((text) => order(text, 'ltr') !== order(text, 'rtl'));
    });
  const drawn = () => page.evaluate(() => window.__drawn.size);
  for (const lang of ['he', 'ar']) {
    // The walk under way, then (with reduced motion) home again, and the ant's triangle seen up close.
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(`/?lang=${lang}#room=globe`);
    await expect.poll(drawn).toBeGreaterThan(1);
    expect(await misordered(), `${lang} globe, walking`).toEqual([]);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('about:blank');
    await page.goto(`/?lang=${lang}#room=globe`);
    await page.locator('.scene-preset').nth(2).click();
    await page.locator('.scene-preset').nth(0).click();
    await expect.poll(drawn).toBeGreaterThan(1);
    expect(await misordered(), `${lang} globe, home`).toEqual([]);
    // A few cards turned, one taken, and the game's end marked on the strip.
    await page.goto(`/?lang=${lang}#room=stopping`);
    await page.locator('#scene-canvas').focus();
    for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await expect.poll(drawn).toBeGreaterThan(10);
    expect(await misordered(), `${lang} stopping`).toEqual([]);
  }
});
