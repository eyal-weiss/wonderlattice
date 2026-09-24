import { test as base, expect } from '@playwright/test';

export const ROOMS = {
  motion: 'Paint with motion.',
  waves: 'Hear the shape.',
  flock: 'A mind of many.',
  ribbon: 'Where is the other side?',
  traffic: 'The tempting shortcut.',
};

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

export async function openRoom(page, room) {
  await page.locator(`#tab-${room}`).click();
  await expect(page.locator(`#tab-${room}`)).toHaveAttribute('aria-selected', 'true');
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
  return page.locator(selector).evaluate((canvas) => {
    const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    let count = 0;
    for (let i = 0; i < data.length; i += 16) {
      if (data[i + 3] > 0 && data[i] + data[i + 1] + data[i + 2] > 90) count++;
    }
    return count;
  });
}
