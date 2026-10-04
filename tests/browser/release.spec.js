// Pre-release checks: layout at phone and tablet widths, page titles, the skip link, the footer credit.
import { test, expect, ROOMS } from './helpers.js';

for (const width of [320, 390, 768, 1024]) {
  test(`every room fits a ${width}px window without overlaps`, async ({ page }) => {
    test.slow(); // walks through every room, so it grows with each new one
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    const problems = [];
    for (const id of Object.keys(ROOMS)) {
      await page.goto(`/#room=${id}`);
      await expect(page.locator('h1:visible')).toHaveText(ROOMS[id]);
      problems.push(
        ...(await page.evaluate((room) => {
          const out = [];
          if (document.documentElement.scrollWidth > innerWidth + 1) out.push(`${room}: page scrolls sideways`);
          const panel = [...document.querySelectorAll('.drawing')].find((d) => d.offsetParent);
          const workspace = panel.closest('.workspace').getBoundingClientRect();
          if (workspace.right > innerWidth + 1) out.push(`${room}: the workspace is wider than the window`);
          const parts = ['.stage-head', '.canvas-wrap', '.scene-tip', '.transport']
            .map((s) => panel.querySelector(s))
            .filter((e) => e && e.offsetParent);
          const box = (e) => e.getBoundingClientRect();
          for (let i = 0; i < parts.length; i++)
            for (let j = i + 1; j < parts.length; j++)
              if (box(parts[i]).bottom > box(parts[j]).top + 1)
                out.push(`${room}: ${parts[i].className} overlaps ${parts[j].className}`);
          const edge = box(panel);
          for (const b of panel.querySelectorAll('.transport .button:not([hidden])'))
            if (box(b).bottom > edge.bottom + 1 || box(b).right > edge.right + 1)
              out.push(`${room}: ${b.id} is outside the stage`);
          return out;
        }, id)),
      );
    }
    expect(problems).toEqual([]);
  });
}

test('each room names the page, and home restores the title', async ({ page }) => {
  await page.goto('/');
  const home = await page.title();
  await page.goto('/#room=dice');
  await expect(page).toHaveTitle('The dice that beat each other · Wonderlattice');
  await page.locator('#room-home').click();
  await expect(page).toHaveTitle(home);
});

test('the skip link jumps to the first experiment, or into the room', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('#skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('.room-card').first()).toBeFocused();
  await page.goto('/#room=loom');
  await page.locator('#skip-link').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#room-title')).toBeFocused();
});

test('the footer credits the author and opens About', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('footer')).toContainText('Made by Eyal Weiss');
  await page.locator('#footer-about').click();
  await expect(page.locator('#about-dialog')).toBeVisible();
  await expect(page.locator('#about-dialog a[href^="mailto:"]')).toHaveCount(1);
});

test('an imported trail keeps only known fields', async ({ page }) => {
  await page.goto('/');
  const entry = {
    id: 'a',
    room: 'dice',
    title: 'Dice',
    settings: { die: 1 },
    image: '',
    note: '',
    returnNote: '',
    created: 1767225600000,
    extra: '<img src=x onerror=alert(1)>',
  };
  const { extra, ...kept } = entry;
  expect(extra).toBeTruthy();
  const file = { format: 'wonderlattice-trail', version: 1, entries: [entry] };
  await page.locator('#trail-import').setInputFiles({
    name: 'trail.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(file)),
  });
  await expect
    .poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('wonderlattice.trail.v1') || '[]')))
    .toEqual([kept]);
  // A date far in the future is not a real save.
  file.entries = [{ ...entry, id: 'b', created: Date.now() + 1e12 }];
  await page.locator('#trail-import').setInputFiles({
    name: 'trail.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(file)),
  });
  await expect(page.locator('#trail-status')).toContainText('not a valid');
});

test('trails saved or exported under the old name, Wonderloom, still open', async ({ page }) => {
  const entry = {
    id: 'old',
    room: 'dice',
    title: 'Dice',
    settings: {},
    image: '',
    note: 'from before the rename',
    returnNote: '',
    created: 1767225600000,
  };
  await page.addInitScript((e) => {
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem('wonderloom.trail.v1', JSON.stringify([e]));
      localStorage.setItem('wonderloom.lang', 'en');
      sessionStorage.setItem('seeded', '1');
    }
  }, entry);
  await page.goto('/');
  await page.locator('#trail-open').click();
  await expect(page.locator('#trail-dialog')).toContainText('from before the rename');
  await page.keyboard.press('Escape');
  // An export file from before the rename imports too.
  const file = { format: 'wonderloom-trail', version: 1, entries: [{ ...entry, id: 'old2', note: 'old export' }] };
  await page.locator('#trail-import').setInputFiles({
    name: 'wonderloom-my-trail.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(file)),
  });
  await expect(page.locator('#trail-status')).toContainText('imported');
  const stored = await page.evaluate(() => [
    JSON.parse(localStorage.getItem('wonderlattice.trail.v1'))[0].note,
    localStorage.getItem('wonderloom.trail.v1'),
  ]);
  expect(stored).toEqual(['old export', null]);
});

// The build names each file with a fingerprint of its contents, so a deploy never pairs a new page with
// scripts a browser cached hours ago. Only the built site (SERVE_DIR=dist, as in CI) has them.
test('the published page fingerprints every script and stylesheet with its contents', async ({ page }) => {
  test.skip(process.env.SERVE_DIR !== 'dist', 'fingerprints are added by the build');
  await page.goto('/');
  const files = await page.evaluate(async () => {
    const urls = [
      ...[...document.querySelectorAll('script[src]')].map((s) => s.getAttribute('src')),
      ...[...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.getAttribute('href')),
    ];
    // Every room's files too, from the list of rooms that load on demand, not only the rooms already here.
    const cards = await (await fetch(document.querySelector('script[src*="src/rooms/cards.js"]').src)).text();
    urls.push(...[...cards.matchAll(/"(\.\/src\/rooms\/[^"]+)"/g)].map((m) => m[1]));
    // …and the scripts loaded when first needed, such as the QR encoder.
    const versions = globalThis.Wonderlattice.fileVersions ?? {};
    urls.push(...Object.entries(versions).map(([path, v]) => `./${path}?v=${v}`));
    const hex = (buffer) => [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
    return Promise.all(
      urls.map(async (url) => {
        const response = await fetch(url);
        const digest = hex(await crypto.subtle.digest('SHA-256', await response.arrayBuffer()));
        return { url, ok: response.ok, version: new URL(url, location.href).searchParams.get('v'), digest };
      }),
    );
  });
  expect(files.length).toBeGreaterThan(90);
  for (const f of files) {
    expect(f.ok, f.url).toBe(true);
    expect(f.digest.startsWith(f.version ?? 'missing'), f.url).toBe(true);
  }
});

test('home cards draw their pictures as they come into view', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 700 });
  await page.goto('/');
  const lastCard = page.locator('.room-card canvas').last();
  // An undrawn canvas is fully transparent; a drawn card is painted edge to edge.
  const painted = () =>
    lastCard.evaluate((c) => {
      const { data } = c.getContext('2d').getImageData(0, 0, c.width, c.height);
      let n = 0;
      for (let i = 3; i < data.length; i += 64) if (data[i] > 0) n++;
      return n;
    });
  expect(await painted()).toBe(0);
  await lastCard.scrollIntoViewIfNeeded();
  await expect.poll(painted).toBeGreaterThan(0);
});
