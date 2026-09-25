import { test, expect, openRoom } from './helpers.js';

// A stand-in speech engine: records each utterance and "speaks" it instantly.
async function fakeSpeech(page) {
  await page.addInitScript(() => {
    window.__spoken = [];
    const synth = window.speechSynthesis;
    synth.getVoices = () => [
      { name: 'Remote Hebrew', lang: 'he-IL', localService: false, default: true },
      { name: 'Local English', lang: 'en-US', localService: true, default: false },
    ];
    synth.cancel = () => {};
    synth.speak = (u) => {
      window.__spoken.push({ text: u.text, lang: u.lang, voice: u.voice?.name ?? null });
      setTimeout(() => u.onend?.(), 5);
    };
  });
}

test('narration reads the prose sentence by sentence, in a matching voice, and resets when done', async ({ page }) => {
  await fakeSpeech(page);
  await page.goto('/#room=motion');
  await page.locator('#why-button').click();
  await page.locator('#narrate-why').click();
  await expect(page.locator('#narrate-why')).toHaveText('Listen to this idea', { timeout: 5000 });
  const spoken = await page.evaluate(() => window.__spoken);
  const text = spoken.map((s) => s.text).join(' ');
  expect(spoken.length).toBeGreaterThan(5);
  expect(spoken.every((s) => s.text.length <= 230)).toBe(true);
  expect(spoken.every((s) => s.lang === 'en-US')).toBe(true);
  // The voice is chosen for the page language, preferring one on the device, not the system default.
  expect(await page.evaluate(() => globalThis.Wonderloom.narration.voice()?.name)).toBe('Local English');
  // Only the content: no button labels or close marks.
  for (const noise of ['✕', 'Listen to this idea', 'Show me the arms', 'Stop narration'])
    expect(text).not.toContain(noise);
  expect(text).toContain('Imagine a pen on the end of an arm.');
  // Symbols become words.
  expect(text).toContain('minus 5 times');
  expect(text).not.toMatch(/[−×→]/);
});

test('narration can be stopped part-way, and a traffic explanation reads its arrows as words', async ({ page }) => {
  await page.addInitScript(() => {
    window.__spoken = [];
    window.speechSynthesis.cancel = () => {};
    window.speechSynthesis.speak = (u) => window.__spoken.push(u.text); // never ends by itself
  });
  await page.goto('/');
  await openRoom(page, 'traffic');
  await page.locator('#scene-why').click();
  await page.locator('#narrate').click();
  await expect(page.locator('#narrate')).toHaveText('Stop narration');
  // Every sentence goes into the browser's own queue at once.
  await expect.poll(() => page.evaluate(() => window.__spoken.length)).toBeGreaterThan(5);
  expect((await page.evaluate(() => window.__spoken)).join(' ')).not.toContain('→');
  await page.locator('#narrate').click();
  await expect(page.locator('#narrate')).toHaveText('Listen to this idea');
  await page.evaluate(() => (window.__spoken = []));
  await page.locator('#narrate').click();
  await expect.poll(() => page.evaluate(() => window.__spoken[0] ?? '')).toContain('With 4,000 drivers');
});

test('picks an English voice from a Firefox-on-Linux style list (no default, Catalan first, languages as "en")', async ({
  page,
}) => {
  await page.goto('/');
  const pick = (voices) => page.evaluate((list) => globalThis.Wonderloom.narration.voice(list)?.name ?? null, voices);
  const firefoxLinux = [
    { name: 'Catalan', lang: 'ca', localService: true, default: false },
    { name: 'Bishnupriya Manipuri', lang: 'bpy', localService: true, default: false },
    { name: 'English (Great Britain)', lang: 'en', localService: true, default: false },
    { name: 'English (America)', lang: 'en', localService: true, default: false },
    { name: 'Hebrew', lang: 'he', localService: true, default: false },
  ];
  expect(await pick(firefoxLinux)).toBe('English (America)');
  // A voice on the device beats an online one (privacy), even with a less exact locale.
  expect(
    await pick([
      { name: 'Network en-US', lang: 'en-US', localService: false, default: false },
      { name: 'Local en-GB', lang: 'en-GB', localService: true, default: true },
    ]),
  ).toBe('Local en-GB');
  // Among voices on the device, the exact locale wins.
  expect(
    await pick([
      { name: 'Local en-GB', lang: 'en-GB', localService: true, default: false },
      { name: 'Local en-US', lang: 'en-US', localService: true, default: false },
    ]),
  ).toBe('Local en-US');
  // No voice for the language: choose none rather than a wrong one.
  expect(await pick([{ name: 'Catalan', lang: 'ca', localService: true, default: true }])).toBe(null);
});
