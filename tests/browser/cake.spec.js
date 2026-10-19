import { test, expect, openRoom, setRange } from './helpers.js';

/** Where the knives and the cake are drawn: the room's own layout, rebuilt here (canvas pixels and page offsets). */
async function geometry(page) {
  await page.locator('#scene-canvas').evaluate((c) => c.scrollIntoView({ block: 'start' }));
  return page.evaluate(() => {
    const c = document.getElementById('scene-canvas');
    const r = c.getBoundingClientRect();
    const w = r.width,
      h = r.height;
    const t = window.Wonderlattice.text('cake');
    const small = Math.round(Math.min(13, Math.max(9, Math.min(w, h) / 30)));
    const pad = Math.max(6, Math.min(16, Math.min(w, h) * 0.025));
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `600 ${small}px system-ui`;
    const words = [...t.people, t.labels.length, t.labels.trimming, t.labels.tastes];
    const label = Math.min(w * 0.2, Math.max(...words.map((x) => ctx.measureText(x).width)) + small * 0.9);
    const inner = h - 2 * pad;
    const cakeY = pad + inner * 0.36 + Math.max(small * (w < 500 ? 3.8 : 3), inner * 0.08);
    const handle = Math.max(10, small * 1.3);
    const bodyY = cakeY + handle + 2;
    const bodyH = cakeY + inner * 0.2 - bodyY - small * 0.3;
    const x0 = pad + label,
      x1 = w - pad;
    return { left: r.left, top: r.top, x0, x1, body: bodyY + bodyH / 2, handle: cakeY + handle / 2 + 1 };
  });
}
const at = (g, x) => g.left + g.x0 + x * (g.x1 - g.x0);

/** What the model says for knives at left and right (thousandths), handed out by `who`: the panel's words. */
async function expected(page, left, right, who, taste = 100) {
  return page.evaluate(
    ([left, right, who, taste]) => {
      const M = window.Wonderlattice.models.cake;
      const t = window.Wonderlattice.text('cake');
      const D = M.tastes(taste / 100);
      const s = M.shares(left / 1000, right / 1000, who);
      const envy = M.envy(D, s);
      return {
        shares: [0, 1, 2].map((p) => `${t.people[p]} ${Math.round(100 * M.worth(D[p], s[p]))}%`),
        envy: [0, 1, 2]
          .filter((p) => envy[p] >= 0)
          .map((p) => t.readout.envies(t.people[p], t.people[envy[p]]))
          .join(' '),
      };
    },
    [left, right, who, taste],
  );
}

async function expectShares(page, e) {
  const box = page.locator('#cake-readout');
  for (const line of e.shares) await expect(box).toContainText(line);
  await expect(box).toContainText(e.envy || 'Nobody envies anybody.');
}

test('cake room: equal pieces leave two people envious, then a fair cut gives everyone more than half', async ({
  page,
}) => {
  await page.goto('/');
  await openRoom(page, 'cake');
  // The opening: three equal lengths, handed out in a row. Cleo, who likes strawberry, gets vanilla: 9%.
  await expect(page.locator('#scene-status')).toHaveText('Smallest share 9%');
  await expect(page.locator('#cake-readout')).toContainText('Ben envies Cleo. Cleo envies Ben.');
  // Without a click, the knives move: everyone gets 56% by their own taste.
  await expect(page.locator('#scene-status')).toHaveText('Smallest share 56%', { timeout: 10000 });
  await expect(page.locator('#announcer')).toHaveText(
    'Ada 56%, Ben 56%, Cleo 56%. Everyone thinks they got more than half!',
  );
  await expect(page.locator('#cake-readout')).toContainText('Nobody envies anybody.');
});

test('cake room: dragging a knife and handing a piece on change the shares', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=cake');
  await expect(page.locator('#scene-status')).toHaveText('Smallest share 56%');
  const fair = await page.evaluate(() => {
    const f = window.Wonderlattice.models.cake.fairCut(window.Wonderlattice.models.cake.tastes(1));
    return { left: Math.round(f.left * 1000), right: Math.round(f.right * 1000), who: f.perm };
  });
  expect(fair).toEqual({ left: 359, right: 566, who: 1 });
  await expectShares(page, await expected(page, 359, 566, 1));

  // Drag the left knife off the left end: Ada is left with nothing, and envies Cleo.
  let g = await geometry(page);
  await page.mouse.move(at(g, 0.359), g.top + g.handle);
  await page.mouse.down();
  await page.mouse.move(at(g, 0.2), g.top + g.handle, { steps: 4 });
  await page.mouse.move(g.left + g.x0 - 30, g.top + g.handle, { steps: 4 });
  await page.mouse.up();
  await expectShares(page, await expected(page, 0, 566, 1));
  await expect(page.locator('#cake-readout')).toContainText('Ada 0%');
  await expect(page.locator('#announcer')).toContainText('Ada 0%');

  // Tap the middle piece, Cleo's: it goes to the next person, Ada, and Ada's (empty) piece goes to Cleo.
  g = await geometry(page);
  await page.mouse.click(at(g, 0.3), g.top + g.body);
  await expectShares(page, await expected(page, 0, 566, 4)); // left Cleo, middle Ada, right Ben
});

test('cake room: the keys move a knife and swap the pieces beside it', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=cake');
  await page.locator('#scene-canvas').focus();
  // → moves the left knife half a percent; ↓ chooses the right knife; ← moves it back.
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expectShares(page, await expected(page, 369, 566, 1));
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowLeft');
  await expectShares(page, await expected(page, 369, 561, 1));
  // Enter: Ben and Cleo swap the pieces either side of the right knife.
  await page.keyboard.press('Enter');
  const e = await expected(page, 369, 561, 0);
  await expectShares(page, e);
  await expect(page.locator('#announcer')).toContainText(e.envy);
});

test('cake room: the method, step by step, ends with nobody envious', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=cake');
  const action = page.locator('#scene-action');
  const status = page.locator('#scene-status');
  const announcer = page.locator('#announcer');
  await expect(action).toHaveText('Show me a method');
  await action.click();
  await expect(status).toHaveText('Step 1 of 9');
  await expect(announcer).toHaveText(/^Two people first\./);
  await expect(action).toHaveText('Next step');
  // Cut-and-choose: Ada exactly half, Ben 86%.
  await action.click();
  await expect(page.locator('#cake-readout')).toContainText('Ada 50%');
  await expect(page.locator('#cake-readout')).toContainText('Ben 86%');
  // A tap on the picture goes on too; ← goes back.
  const g = await geometry(page);
  await page.mouse.click(at(g, 0.5), g.top + g.body);
  await expect(status).toHaveText('Step 3 of 9');
  await page.locator('#scene-canvas').focus();
  await page.keyboard.press('ArrowLeft');
  await expect(status).toHaveText('Step 2 of 9');
  await page.keyboard.press('ArrowRight');
  await action.click();
  // The naive way for three: Cleo envies Ben.
  await expect(status).toHaveText('Step 4 of 9');
  await expect(page.locator('#cake-readout')).toContainText('Cleo 8%');
  await expect(page.locator('#cake-readout')).toContainText('Cleo envies Ben.');
  for (let k = 5; k <= 9; k++) {
    await action.click();
    await expect(status).toHaveText(`Step ${k} of 9`);
  }
  await expect(announcer).toHaveText(/Five cuts in all, and nobody envies anybody\.$/);
  for (const line of ['Ada 37%', 'Ben 43%', 'Cleo 80%', 'Nobody envies anybody.'])
    await expect(page.locator('#cake-readout')).toContainText(line);
  await expect(action).toHaveText('Back to my cake');
  await action.click();
  await expect(action).toHaveText('Show me a method');
  await expect(status).toHaveText('Smallest share 56%');
});

test('cake room: presets, the taste slider and the fair cut', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#room=cake');
  await page.getByRole('button', { name: /Equal pieces/ }).click();
  await expect(page.locator('#cake-readout')).toContainText('Ben envies Cleo. Cleo envies Ben.');
  await expect(page.locator('#scene-status')).toHaveText('Smallest share 9%');
  await page.locator('#cake-fair').click();
  await expect(page.locator('#scene-status')).toHaveText('Smallest share 56%');
  await page.getByRole('button', { name: /Same tastes/ }).click();
  await expect(page.locator('#v-taste')).toHaveText('0%');
  await expectShares(page, await expected(page, 333, 667, 0, 0));
  await expect(page.locator('#scene-status')).toHaveText('Smallest share 33%');
  // Halfway between: a fair cut still gives everyone more than a third (46%).
  await setRange(page, '#c-taste', 50);
  await expect(page.locator('#scene-status')).toHaveText('Smallest share 46%');
  await expect(page.locator('#cake-readout')).toContainText('Nobody envies anybody.');
});

test('cake room: a shared link restores the knives, the tastes and who gets what', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  // Knives given in the wrong order are put right.
  await page.goto('/#room=cake&taste=80&left=700&right=250&who=4');
  await expect(page.locator('#v-taste')).toHaveText('80%');
  await expectShares(page, await expected(page, 250, 700, 4, 80));
});
