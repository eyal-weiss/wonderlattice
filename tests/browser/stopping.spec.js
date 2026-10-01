import { test, expect } from './helpers.js';

const status = (page) => page.locator('#scene-status');
const result = (page) => page.locator('#stopping-result');
const chance = (page) => page.locator('.stopping-big strong');

// The first deal (seed 1) has its biggest card at position 43, its fifth card is the 93rd biggest and its last the
// 11th; the rule that looks at 37 cards takes card 43. Deal 3 hides its biggest card at 35, inside the rule's look.

test('stopping room: opens on card 1, beside a curve that peaks at 37 cards and 37%', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // the 10,000 deals are played at once
  await page.goto('/#room=stopping');
  await expect(status(page)).toHaveText('Card 1 of 100');
  await expect(result(page)).toHaveText('Card 1 of 100 is up. Nothing before it yet.');
  await expect(chance(page)).toHaveText('37.1%');
  await expect(page.locator('#stopping-readout')).toContainText('The best number to look at: 37, for 37.1%.');
  await expect(page.locator('.stopping-more')).toContainText('1,000,000 cards: look at 367,879, 36.8%');
  // The simulated deals land near the exact chance.
  await expect(page.locator('#stopping-sim')).toContainText('In 10,000 simulated deals');
  const simulated = Number((await page.locator('#stopping-sim').textContent()).match(/([\d.]+)%/)[1]);
  expect(simulated).toBeGreaterThan(35);
  expect(simulated).toBeLessThan(39.5);
});

test('stopping room: the curve fills in by itself, without a click', async ({ page }) => {
  await page.goto('/#room=stopping');
  await expect(page.locator('#stopping-sim')).toContainText('In 10,000 simulated deals', { timeout: 20000 });
});

test('stopping room: turn cards, take one, and see what the rule did with the same cards', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=stopping');
  for (let i = 0; i < 4; i++) await page.locator('#stopping-next').click();
  await expect(status(page)).toHaveText('Card 5 of 100');
  await expect(result(page)).toHaveText('Card 5 of 100 is up. The best before it: 365,472.');
  const takeButton = page.getByRole('button', { name: 'Take this card' });
  await takeButton.focus();
  await takeButton.press('Enter');
  await expect(status(page)).toHaveText('You took the 93rd biggest');
  await expect(result(page)).toHaveText(
    'You took card 5: the 93rd biggest. The biggest was card 43. Looking at the first 37, the rule would have taken card 43: the biggest.',
  );
  // The button stays where the keyboard is, but does nothing more.
  await expect(takeButton).toHaveAttribute('aria-disabled', 'true');
  await expect(takeButton).toBeFocused();
  await takeButton.press('Enter');
  await expect(status(page)).toHaveText('You took the 93rd biggest');
  // The same cards, judged with another look: the result follows the slider.
  await page.locator('#c-look').fill('0');
  await expect(result(page)).toContainText(
    'Looking at none first, the rule would have taken card 1: the 72nd biggest.',
  );
  await page.waitForTimeout(900); // a second press straight after a game ends doesn't deal again at once
  await page.locator('#stopping-next').click(); // now "Deal again"
  await expect(status(page)).toHaveText('Card 1 of 100');
  await expect(result(page)).toHaveText('Card 1 of 100 is up. Nothing before it yet.');
});

test('stopping room: the last card is yours, and the rule can wait in vain', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=stopping');
  for (let i = 0; i < 99; i++) await page.locator('#stopping-next').click();
  await expect(result(page)).toContainText('You reached the last card, so it was yours: the 11th biggest.');
  await page.locator('#stopping-next').click(); // a double press at the end doesn't deal again at once
  await expect(result(page)).toContainText('You reached the last card');
  await page.goto('/#room=stopping&seed=3');
  await page.getByRole('button', { name: 'Take this card' }).click();
  await expect(result(page)).toContainText(
    'Looking at the first 37, the rule would have waited in vain, and ended on the last card: the 65th biggest.',
  );
});

test('stopping room: happy with the top 10, the best look slides from 37 to 14', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=stopping');
  await page.getByLabel('Happy with any of the top 10').check();
  await expect(chance(page)).toHaveText('66.3%');
  await expect(page.locator('#stopping-readout')).toContainText('The best number to look at: 14, for 81.7%.');
  await expect(page.locator('#stopping-readout')).toContainText('Taking a card at random: 10%.');
  await page.locator('.scene-preset', { hasText: 'The top 10 will do' }).click();
  await expect(page.locator('#c-look')).toHaveValue('14');
  await expect(chance(page)).toHaveText('81.7%');
  await page.getByLabel('Happy with any of the top 10').uncheck();
  await expect(chance(page)).toHaveText('28.0%'); // 14 is too short a look for the very best
});

test('stopping room: a shared link deals the same cards, and out-of-range values are ignored', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=stopping&look=14&top=true&seed=5');
  await expect(page.locator('#c-look')).toHaveValue('14');
  await expect(page.getByLabel('Happy with any of the top 10')).toBeChecked();
  await expect(chance(page)).toHaveText('81.7%');
  await page.getByRole('button', { name: 'Take this card' }).click();
  await expect(result(page)).toContainText('That’s not in the top 10.');
  await expect(result(page)).toContainText(
    'Looking at the first 14, the rule would have taken card 19: the 2nd biggest.',
  );
  await page.goto('about:blank'); // a fresh visit, not a change of address within the page
  await page.goto('/#room=stopping&look=500&seed=0');
  await expect(chance(page)).toHaveText('37.1%');
  await expect(result(page)).toHaveText('Card 1 of 100 is up. Nothing before it yet.');
});

test('stopping room: the keyboard turns and takes cards, and never goes back', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=stopping');
  await page.locator('#scene-canvas').focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(status(page)).toHaveText('Card 3 of 100');
  await page.keyboard.press('ArrowLeft');
  await expect(status(page)).toHaveText('Card 3 of 100');
  await page.keyboard.press('Enter');
  await expect(status(page)).toContainText('You took the');
  // Holding → never runs on into a new deal: after a game, it only says so.
  await page.keyboard.press('ArrowRight');
  await expect(status(page)).toContainText('You took the');
  await page.getByRole('button', { name: 'New cards' }).click();
  await expect(status(page)).toHaveText('Card 1 of 100');
});

test('stopping room: a tap on the deck turns a card, a tap on the card takes it, and a swipe takes nothing', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=stopping');
  const canvas = page.locator('#scene-canvas');
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  // The card that is up sits in the middle third at the top of the picture, the deck in the right third.
  const card = { x: box.x + box.width / 2, y: box.y + 90 },
    deck = { x: box.x + (box.width * 5) / 6, y: box.y + 90 };
  await page.mouse.click(deck.x, deck.y);
  await page.mouse.click(deck.x, deck.y);
  await expect(status(page)).toHaveText('Card 3 of 100');
  await page.mouse.move(card.x, card.y);
  await page.mouse.down();
  await page.mouse.move(card.x + 40, card.y + 30, { steps: 4 });
  await page.mouse.up();
  await expect(status(page)).toHaveText('Card 3 of 100');
  await page.mouse.click(card.x, card.y, { button: 'right' }); // a right-click isn't a tap
  await expect(status(page)).toHaveText('Card 3 of 100');
  await page.mouse.click(card.x, card.y);
  await expect(status(page)).toContainText('You took the');
});

test.describe('on a touch screen', () => {
  test.use({ hasTouch: true });

  test('stopping room: touches on the card and the deck are taps; on the chart the page scrolls', async ({ page }) => {
    await page.goto('/#room=stopping');
    await expect(page.locator('body')).toHaveAttribute('data-room', 'stopping');
    await page.waitForTimeout(300); // one frame, so the room knows where its cards are
    const keeps = (fx, y) =>
      page.locator('#scene-canvas').evaluate(
        (canvas, [fx, y]) => {
          const r = canvas.getBoundingClientRect();
          const point = { identifier: 1, target: canvas, clientX: r.left + fx * r.width, clientY: r.top + y };
          const event = new TouchEvent('touchstart', {
            touches: [new Touch(point)],
            changedTouches: [new Touch(point)],
            cancelable: true,
            bubbles: true,
          });
          canvas.dispatchEvent(event);
          return event.defaultPrevented;
        },
        [fx, y],
      );
    expect(await keeps(0.5, 90)).toBe(true); // the card that is up
    expect(await keeps(5 / 6, 90)).toBe(true); // the deck
    expect(await keeps(0.5, 400)).toBe(false); // the chart
  });
});
