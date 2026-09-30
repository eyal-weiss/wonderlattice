import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { test, expect, openRoom } from './helpers.js';

// The feedback box (src/features/feedback.js). The site's inbox, /api/feedback, runs on Cloudflare
// (functions/api/feedback.js, unit-tested on its own); here it is stood in for, and every message it gets is kept.
async function inbox(page, answer = { status: 200, body: '{"ok":true}' }) {
  const messages = [];
  await page.route('**/api/feedback', async (route) => {
    messages.push({ ...route.request().postDataJSON(), type: route.request().headers()['content-type'] });
    if (answer === 'offline') return route.abort();
    await route.fulfill({ contentType: 'application/json', ...answer });
  });
  return messages;
}

const box = (page, dialog) => page.locator(`#${dialog} .feedback-box`);

test('a message from About is sent with the page language, and only when the visitor presses Send', async ({
  page,
}) => {
  const messages = await inbox(page);
  await page.goto('/');
  await page.locator('#about-button').click();
  const about = box(page, 'about-dialog');
  await expect(about.locator('textarea')).toBeHidden(); // a closed line until opened
  await about.locator('summary').click();
  const send = about.getByRole('button', { name: 'Send' });
  await expect(send).toBeDisabled();
  await about.getByLabel('What did you notice').fill('   ');
  await expect(send).toBeDisabled();
  await about.getByLabel('What did you notice').fill('The loom is lovely.');
  expect(messages).toEqual([]);
  await send.click();
  await expect(about.getByRole('status')).toHaveText('Thank you! Your message is on its way.');
  expect(messages).toEqual([
    { message: 'The loom is lovely.', trap: '', lang: 'en', place: 'about', room: null, type: 'application/json' },
  ]);
  await expect(about.locator('textarea')).toHaveValue('');
  await expect(send).toBeDisabled();
  // Closing the dialog forgets the thank-you.
  await page.keyboard.press('Escape');
  await page.locator('#about-button').click();
  await expect(about.getByRole('status')).toHaveText('');
});

test('a message from a room’s explanation says which room, and About remembers the room it was opened in', async ({
  page,
}) => {
  const messages = await inbox(page);
  await page.goto('/');
  await openRoom(page, 'dice');
  await page.locator('#scene-why').click();
  const explanation = box(page, 'insight-dialog');
  await explanation.locator('summary').click();
  await explanation.locator('textarea').fill('C beats A!');
  await explanation.getByRole('button', { name: 'Send' }).click();
  await expect(explanation.getByRole('status')).toContainText('Thank you');
  await page.locator('#insight-close').click();
  await page.locator('#about-button').click();
  await box(page, 'about-dialog').locator('summary').click();
  await box(page, 'about-dialog').locator('textarea').fill('Hello');
  await box(page, 'about-dialog').getByRole('button', { name: 'Send' }).click();
  await expect(box(page, 'about-dialog').getByRole('status')).toContainText('Thank you');
  expect(messages.map(({ place, room }) => ({ place, room }))).toEqual([
    { place: 'explanation', room: 'dice' },
    { place: 'about', room: 'dice' },
  ]);
});

test('the drawing room’s explanation has a box too, and narration doesn’t read it out', async ({ page }) => {
  const messages = await inbox(page);
  await page.goto('/#room=motion');
  await page.locator('#motion-room .why').click();
  const why = box(page, 'why-dialog');
  await expect(why.locator('summary')).toBeVisible();
  const script = await page.evaluate(() =>
    window.Wonderlattice.narration.script(document.getElementById('why-dialog')).join(' '),
  );
  expect(script).not.toContain('Send a message');
  await why.locator('summary').click();
  await why.locator('textarea').fill('Spirals!');
  await why.getByRole('button', { name: 'Send' }).click();
  await expect(why.getByRole('status')).toContainText('Thank you');
  expect(messages[0]).toMatchObject({ place: 'explanation', room: 'motion' });
});

test('when sending fails, the visitor is told, and keeps their words', async ({ page }) => {
  page.expectErrors(/Failed to load resource/); // the browser reports each failed send in the console
  let answer = { status: 503, body: '{"error":"unavailable"}' };
  await page.route('**/api/feedback', (route) =>
    answer === 'offline' ? route.abort() : route.fulfill({ contentType: 'application/json', ...answer }),
  );
  await page.goto('/');
  await page.locator('#about-button').click();
  const about = box(page, 'about-dialog');
  await about.locator('summary').click();
  await about.locator('textarea').fill('Keep these words');
  const send = about.getByRole('button', { name: 'Send' });
  await send.click();
  await expect(about.getByRole('status')).toHaveText('Your message couldn’t be sent just now. Please try again later.');
  await expect(about.locator('textarea')).toHaveValue('Keep these words');
  await expect(send).toBeEnabled();
  answer = { status: 429, body: '{"error":"too-many"}' };
  await send.click();
  await expect(about.getByRole('status')).toHaveText(
    'That’s several messages at once. Please try again in a few minutes.',
  );
  answer = 'offline';
  await send.click();
  await expect(about.getByRole('status')).toHaveText('Your message couldn’t be sent just now. Please try again later.');
});

test('the trap field is out of sight and out of the keyboard’s reach', async ({ page }) => {
  await page.goto('/');
  await page.locator('#about-button').click();
  const about = box(page, 'about-dialog');
  await about.locator('summary').click();
  const trap = about.locator('.feedback-trap');
  await expect(trap).toHaveAttribute('tabindex', '-1');
  await expect(trap).toHaveAttribute('aria-hidden', 'true');
  expect(await trap.evaluate((e) => e.getBoundingClientRect().width * e.getBoundingClientRect().height)).toBeLessThan(
    2,
  );
  // Tab goes from the words straight to Send.
  await about.locator('textarea').fill('x');
  await about.locator('textarea').focus();
  await page.keyboard.press('Tab');
  await expect(about.getByRole('button', { name: 'Send' })).toBeFocused();
});

test('the box speaks the page language', async ({ page }) => {
  const messages = await inbox(page);
  await page.goto('/?lang=he');
  await page.locator('#about-button').click();
  const about = box(page, 'about-dialog');
  await expect(about.locator('summary')).toHaveText('שליחת הודעה ל־Wonderlattice');
  await about.locator('summary').click();
  await about.locator('textarea').fill('שלום');
  await about.getByRole('button', { name: 'שליחה' }).click();
  await expect(about.getByRole('status')).toHaveText('תודה! ההודעה שלכם בדרך.');
  expect(messages[0]).toMatchObject({ message: 'שלום', lang: 'he' });
});

test('opened from a file, the box points to GitHub instead of sending', async ({ page }) => {
  await page.goto(pathToFileURL(resolve(process.env.SERVE_DIR || '.', 'index.html')).href);
  await page.locator('#about-button').click();
  const about = box(page, 'about-dialog');
  await about.locator('summary').click();
  await expect(about.locator('textarea')).toHaveCount(0);
  await expect(about.getByRole('link', { name: 'Wonderlattice’s issues' })).toHaveAttribute(
    'href',
    'https://github.com/eyal-weiss/wonderlattice/issues',
  );
});
