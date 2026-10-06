import { test, expect, LANGUAGES } from './helpers.js';

// Words drawn in a picture are given a width they may not pass (fillText's maxWidth), and a longer label is squeezed
// to fit, letters and all. On a 320 px phone three labels in the rollers and voltage rooms were squeezed to half or
// two thirds of their width, even in English; now they wrap, take the room they really have, or shrink a little.
test('on a 320 px phone, the rollers and voltage rooms draw their words unsqueezed, in every language', async ({
  page,
}) => {
  test.slow(); // three pictures in every language
  await page.setViewportSize({ width: 320, height: 740 });
  await page.addInitScript(() => {
    window.__squeezed = new Map();
    const fill = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (text, x, y, maxWidth) {
      if (maxWidth > 0) {
        const squeeze = this.measureText(text).width / maxWidth;
        if (squeeze > (window.__squeezed.get(text) ?? 0)) window.__squeezed.set(String(text), squeeze);
      }
      return fill.call(this, text, x, y, maxWidth);
    };
  });
  // Labels squeezed by more than a fifth, from the moment the picture has its size.
  const squeezed = async () => {
    await page.waitForTimeout(300);
    await page.evaluate(() => window.__squeezed.clear());
    await page.waitForTimeout(600);
    return page.evaluate(() =>
      [...window.__squeezed].filter(([, s]) => s > 1.2).map(([text, s]) => `${text} (${s.toFixed(2)}×)`),
    );
  };
  for (const lang of ['en', ...LANGUAGES]) {
    // The rollers and the cart, then the race of four shapes.
    await page.goto(`/?lang=${lang}#room=rollers`);
    await expect(page.locator('body')).toHaveAttribute('data-room', 'rollers');
    expect(await squeezed(), `${lang} rollers`).toEqual([]);
    await page.locator('.scene-preset').nth(2).click();
    expect(await squeezed(), `${lang} race`).toEqual([]);
    // Direct current of the 1880s, which the transformers stop.
    await page.goto('about:blank');
    await page.goto(`/?lang=${lang}#room=voltage&kv=100&current=1`);
    await expect(page.locator('body')).toHaveAttribute('data-room', 'voltage');
    expect(await squeezed(), `${lang} voltage`).toEqual([]);
  }
});
