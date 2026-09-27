import { test, expect } from './helpers.js';

// Phones pin the picture while the controls scroll under it; nothing from below may paint over it.
test.use({ viewport: { width: 393, height: 740 }, hasTouch: true, isMobile: true });

test('nothing scrolling under the pinned picture paints over it', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // the visitor stays still, as it does once its bobbing ends
  for (const room of ['dice', 'waves', 'motion']) {
    await page.goto(`/#room=${room}`);
    const sel = room === 'motion' ? '#motion-room' : '#new-room';
    // Scroll until the visitor card sits under the pinned picture.
    await page.evaluate((sel) => {
      const guest = document.querySelector(`${sel} .math-guest`);
      window.scrollBy(0, guest.getBoundingClientRect().top - 120);
    }, sel);
    await page.waitForTimeout(200);
    const covered = await page.evaluate((sel) => {
      const drawing = document.querySelector(`${sel} .workspace > .drawing`);
      const r = drawing.getBoundingClientRect();
      const bad = [];
      for (let x = r.left + 10; x < r.right - 10; x += 24)
        for (let y = Math.max(r.top, 0) + 10; y < r.bottom - 10; y += 24) {
          const hit = document.elementFromPoint(x, y);
          if (hit && !drawing.contains(hit)) bad.push(hit.className || hit.tagName);
        }
      return [...new Set(bad)];
    }, sel);
    expect(covered, room).toEqual([]);
  }
});
