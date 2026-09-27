// Link-preview images for each room's share page (assets/rooms/<id>.jpg, 1200×630).
//   npm run previews            every room
//   npm run previews -- dice    only some
// Draws each room's own home-card picture at a larger size, beside its name and tagline, in a browser.
// Needs the Playwright browser (or PW_CHANNEL=chrome). Run it after adding a room; commit the images.
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = fileURLToPath(new URL('..', import.meta.url));
const port = Number(process.env.PREVIEW_PORT || 4799);
const out = join(root, 'assets/rooms');
mkdirSync(out, { recursive: true });

const server = spawn(process.execPath, [join(root, 'scripts/serve.mjs'), root, String(port)], { stdio: 'ignore' });
await new Promise((resolve) => setTimeout(resolve, 600));

const logo =
  '<svg width="46" height="46" viewBox="0 0 32 32" fill="none" stroke="#ddf6a3" stroke-width="1.4">' +
  '<ellipse cx="16" cy="16" rx="6" ry="14"/><ellipse cx="16" cy="16" rx="6" ry="14" transform="rotate(60 16 16)"/>' +
  '<ellipse cx="16" cy="16" rx="6" ry="14" transform="rotate(120 16 16)"/></svg>';
const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto(`http://localhost:${port}/`);
  const rooms = await page.evaluate(() => globalThis.Wonderlattice.rooms.map((r) => r.id));
  const wanted = process.argv.slice(2);
  for (const id of rooms.filter((r) => !wanted.length || wanted.includes(r))) {
    await page.goto(`http://localhost:${port}/`);
    // The room's own card picture, drawn at 560×470 instead of 320×180.
    const card = await page.evaluate((id) => {
      const W = globalThis.Wonderlattice;
      const room = W.room(id);
      const canvas = document.createElement('canvas');
      const width = 560,
        height = 470;
      canvas.width = width * 2;
      canvas.height = height * 2;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(2, 0, 0, 2, 0, 0);
      ctx.fillStyle = '#0a0e15';
      ctx.fillRect(0, 0, width, height);
      if (room.preview) room.preview(ctx, width, height);
      else room.draw(ctx, { ...room.defaults, ...room.previewSettings }, { width, height, clock: 0, playing: false });
      return { art: canvas.toDataURL('image/png'), name: room.name, tagline: room.tagline };
    }, id);
    await page.setContent(`<!doctype html><meta charset="utf-8"><style>
      html,body{margin:0;width:1200px;height:630px;background:#101217;color:#f1f2ed;font-family:system-ui,sans-serif}
      body{display:grid;grid-template-columns:600px 1fr;align-items:center;overflow:hidden}
      .art{width:560px;height:470px;margin-left:40px;border-radius:22px;border:1px solid #30343c;display:block}
      .text{padding:0 46px 0 40px;display:flex;flex-direction:column;gap:22px}
      .brand{display:flex;align-items:center;gap:12px;font-weight:700;font-size:30px}
      h1{font-family:'Liberation Serif',Tinos,Georgia,serif;font-weight:400;font-size:56px;line-height:1.04;margin:0;letter-spacing:-1px}
      p{margin:0;color:#a6abb5;font-size:26px;line-height:1.35}
      .url{color:#ddf6a3;font-size:22px}
    </style><body><img class="art" src="${card.art}"><div class="text">
      <div class="brand">${logo}wonderlattice</div><h1>${escape(card.name)}</h1><p>${escape(card.tagline)}</p>
      <div class="url">wonderlattice.com</div></div></body>`);
    await page.screenshot({ path: join(out, `${id}.jpg`), type: 'jpeg', quality: 86 });
    console.log(`assets/rooms/${id}.jpg`);
  }
} finally {
  await browser.close();
  server.kill();
}
