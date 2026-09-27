import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { test as base, expect } from '@playwright/test';

// Every room linked from index.html, in page order, with its English title (read from its text.en.js),
// so a new room needs no edit here. npm run rooms checks every room folder is linked.
const root = fileURLToPath(new URL('../../', import.meta.url));
await import(pathToFileURL(`${root}src/core/wonderlattice.js`).href);
const roomIds = [
  ...readFileSync(`${root}index.html`, 'utf8').matchAll(/src="\.\/src\/rooms\/([a-z]+)\/room\.js"/g),
].map((m) => m[1]);
for (const id of roomIds) await import(pathToFileURL(`${root}src/rooms/${id}/text.en.js`).href);
// The drawing room's title is fixed page text (data-t="motion.title"), not in its room text.
const page = readFileSync(`${root}index.html`, 'utf8');
const titleOf = (id) =>
  globalThis.Wonderlattice.text(id).title ?? page.match(new RegExp(`data-t="${id}\\.title">([^<]+)<`))?.[1];
export const ROOMS = Object.fromEntries(roomIds.map((id) => [id, titleOf(id)]));

// Records page errors, captures clipboard writes, and exposes the optional
// browser-agent tools so tests can read app state the way an agent would.
export const test = base.extend({
  page: async ({ page }, use) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.addInitScript(() => {
      window.__clipboard = [];
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText: async (text) => void window.__clipboard.push(text) },
      });
      window.__tools = {};
      document.modelContext = {
        registerTool(tool) {
          window.__tools[tool.name] = tool;
        },
      };
    });
    await use(page);
    expect(errors, 'page errors').toEqual([]);
  },
});

export { expect };

/** Open a room the way a visitor does: back to the map if needed, then its card. */
export async function openRoom(page, room) {
  if (await page.locator('#room-home').isVisible()) await page.locator('#room-home').click();
  await page.locator(`#card-${room}`).click();
  await expectRoom(page, room);
}

export async function expectRoom(page, room) {
  await expect(page.locator('body')).toHaveAttribute('data-room', room);
}

export async function tool(page, name, input = {}) {
  return page.evaluate(([n, i]) => window.__tools[n].execute(i), [name, input]);
}

export async function setRange(page, selector, value) {
  await page.locator(selector).evaluate((input, v) => {
    input.value = String(v);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, value);
}

// Counts pixels that differ from the dark stage background.
export async function inkedPixels(page, selector) {
  // Home cards draw their pictures only once they come near the screen.
  await page.locator(selector).scrollIntoViewIfNeeded();
  return page.locator(selector).evaluate((canvas) => {
    const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    let count = 0;
    for (let i = 0; i < data.length; i += 16) {
      if (data[i + 3] > 0 && data[i] + data[i + 1] + data[i + 2] > 90) count++;
    }
    return count;
  });
}

/** The link to expect: the room's share page on the built site (it has /room/<id>/ pages), the page itself elsewhere. */
export async function expectedLink(page, room, settings) {
  const pages = await page.locator('meta[name="wonderlattice-room-pages"]').count();
  return new URL(pages ? `/room/${room}/#${settings}` : `/#${settings}`, page.url()).href;
}
