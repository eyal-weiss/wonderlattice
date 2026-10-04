// The pictures the site shows before any room's code runs, drawn in a browser from the rooms' own previews:
//   assets/rooms/thumbs/<id>.webp        the room's picture on the home map: the middle of its preview, 176×176
//   assets/rooms/thumbs/<id>-wide.webp   the whole preview (400×225), shown when pointing at the room
//   assets/rooms/<id>.jpg           the link preview of the room's share page (1200×630)
//   assets/social.jpg               the site's own link preview (1200×630): the start of the route
//   assets/apple-touch-icon.png     the home-screen icon (180×180)
//
//   npm run previews              every room, the site's picture and the icon
//   npm run previews -- dice      only some rooms
//   npm run previews -- --site    only the site's picture and the icon
// Needs the Playwright browser (or PW_CHANNEL=chrome). Run it after adding a room, or changing a room's preview;
// commit the pictures.
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = fileURLToPath(new URL('..', import.meta.url));
const port = Number(process.env.PREVIEW_PORT || 4799);
const out = join(root, 'assets/rooms');
mkdirSync(join(out, 'thumbs'), { recursive: true });

const server = spawn(process.execPath, [join(root, 'scripts/serve.mjs'), root, String(port)], { stdio: 'ignore' });
await new Promise((resolve) => setTimeout(resolve, 600));

// The day look (styles/base.css): paper, ink, a yellow accent, and each theme's colour.
const DAY = {
  bg: '#f4f5f0',
  panel: '#ffffff',
  ink: '#16172b',
  muted: '#4f5367',
  accent: '#ffc629',
  themes: {
    shape: '#2453d6',
    chance: '#f2b300',
    games: '#ea3a2a',
    making: '#8a4fd6',
    engineering: '#ff7a1a',
    life: '#1ea35a',
    signals: '#df4699',
  },
};
const fontFace = `@font-face{font-family:Rubik;font-weight:400 800;src:url(http://localhost:${port}/fonts/rubik-latin.woff2) format('woff2')}`;
const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** The site's mark: seven lattice points, one per theme. */
function mark(size) {
  const points = [[16, 16]];
  for (let k = 0; k < 6; k++)
    points.push([
      16 + 10.5 * Math.cos((Math.PI / 3) * k - Math.PI / 2),
      16 + 10.5 * Math.sin((Math.PI / 3) * k - Math.PI / 2),
    ]);
  const colours = Object.values(DAY.themes);
  return (
    `<svg width="${size}" height="${size}" viewBox="0 0 32 32">` +
    points
      .map(([x, y], i) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.4" fill="${colours[i]}"/>`)
      .join('') +
    '</svg>'
  );
}

/**
 * A room's own preview, drawn on the dark stage at width × height, as a data URL. With `crop`, only the middle
 * square, scaled to crop × crop.
 */
function drawRoom(page, id, width, height, type = 'image/png', quality, crop = 0) {
  return page.evaluate(
    ({ id, width, height, type, quality, crop }) => {
      const W = globalThis.Wonderlattice;
      const room = W.room(id);
      const canvas = document.createElement('canvas');
      canvas.width = width * 2;
      canvas.height = height * 2;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(2, 0, 0, 2, 0, 0);
      ctx.fillStyle = '#0a0e15';
      ctx.fillRect(0, 0, width, height);
      if (room.preview) room.preview(ctx, width, height);
      else room.draw(ctx, { ...room.defaults, ...room.previewSettings }, { width, height, clock: 0, playing: false });
      // The map's pictures are stored at their own size (not doubled): already twice their largest use.
      if (type === 'image/webp') {
        const small = document.createElement('canvas');
        const side = height * 2; // the middle square of the doubled drawing
        small.width = crop || width;
        small.height = crop || height;
        if (crop) small.getContext('2d').drawImage(canvas, (width * 2 - side) / 2, 0, side, side, 0, 0, crop, crop);
        else small.getContext('2d').drawImage(canvas, 0, 0, width, height);
        return small.toDataURL(type, quality);
      }
      return canvas.toDataURL(type, quality);
    },
    { id, width, height, type, quality, crop },
  );
}

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto(`http://localhost:${port}/`);
  const rooms = await page.evaluate(() =>
    globalThis.Wonderlattice.rooms.map((r) => ({ id: r.id, name: r.name, tagline: r.tagline, theme: r.theme })),
  );
  const args = process.argv.slice(2);
  const siteOnly = args.includes('--site');
  const wanted = args.filter((a) => !a.startsWith('--'));
  const site = siteOnly || !wanted.length;

  for (const room of siteOnly ? [] : rooms.filter((r) => !wanted.length || wanted.includes(r.id))) {
    await page.goto(`http://localhost:${port}/`);
    const write = (name, url) => writeFileSync(join(out, 'thumbs', name), Buffer.from(url.split(',')[1], 'base64'));
    write(`${room.id}.webp`, await drawRoom(page, room.id, 320, 180, 'image/webp', 0.72, 176));
    write(`${room.id}-wide.webp`, await drawRoom(page, room.id, 400, 225, 'image/webp', 0.8));
    const art = await drawRoom(page, room.id, 560, 470);
    const colour = DAY.themes[room.theme];
    const theme = await page.evaluate(
      (id) => globalThis.Wonderlattice.themes.find((t) => t.id === id).name,
      room.theme,
    );
    await page.setContent(`<!doctype html><meta charset="utf-8"><style>${fontFace}
      html,body{margin:0;width:1200px;height:630px;background:${DAY.bg};color:${DAY.ink};font-family:Rubik,sans-serif}
      body{display:grid;grid-template-columns:620px 1fr;align-items:center;overflow:hidden}
      .art{width:560px;height:470px;margin-left:40px;border-radius:26px;border:6px solid ${colour};box-shadow:0 0 0 4px ${DAY.ink},8px 8px 0 4px ${DAY.ink};display:block}
      .text{padding:0 50px 0 30px;display:flex;flex-direction:column;gap:20px}
      .brand{display:flex;align-items:center;gap:12px;font-weight:800;font-size:30px;letter-spacing:-1px}
      .theme{display:inline-flex;align-items:center;gap:10px;font-size:22px;font-weight:600;color:${DAY.muted}}
      .theme i{width:20px;height:20px;border-radius:5px;background:color-mix(in srgb,${colour} 30%,#fff);box-shadow:inset 0 0 0 3px ${colour}}
      h1{font-weight:800;font-size:58px;line-height:1.02;margin:0;letter-spacing:-2px}
      p{margin:0;color:${DAY.muted};font-size:26px;line-height:1.35}
    </style><body><img class="art" src="${art}"><div class="text">
      <div class="brand">${mark(46)}wonderlattice</div><span class="theme"><i></i>${escape(theme)}</span>
      <h1>${escape(room.name)}</h1><p>${escape(room.tagline)}</p></div></body>`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: join(out, `${room.id}.jpg`), type: 'jpeg', quality: 86 });
    console.log(`assets/rooms/${room.id}.jpg, assets/rooms/thumbs/${room.id}.webp`);
  }

  if (site) {
    // The site's picture: its words beside the start of the route, as on the home map.
    const first = rooms.slice(0, 8);
    const places = [
      [0, 0],
      [1, 0],
      [2, 0],
      [1.5, 1],
      [0.5, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    const dx = 168,
      dy = 160,
      x0 = 692,
      y0 = 155,
      disc = 104;
    const xy = ([x, y]) => [x0 + x * dx, y0 + y * dy];
    const a = (dx * dx) / 8 / dy + dy / 2,
      b = dy / 2 - (dx * dx) / 8 / dy;
    let svg = '';
    first.forEach((room, i) => {
      const [cx, cy] = xy(places[i]);
      const hex = [
        [cx, cy - a],
        [cx + dx / 2, cy - b],
        [cx + dx / 2, cy + b],
        [cx, cy + a],
        [cx - dx / 2, cy + b],
        [cx - dx / 2, cy - b],
      ];
      svg += `<polygon points="${hex.map((p) => p.join(',')).join(' ')}" fill="color-mix(in srgb, ${DAY.themes[room.theme]} 30%, ${DAY.bg})" stroke="${DAY.bg}" stroke-width="6" stroke-linejoin="round"/>`;
    });
    const line = first.map((_, i) => xy(places[i]).join(',')).join(' ');
    svg += `<polyline points="${line}" fill="none" stroke="${DAY.bg}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>`;
    svg += `<polyline points="${line}" fill="none" stroke="${DAY.ink}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
    const discs = first
      .map((room, i) => {
        const [cx, cy] = xy(places[i]);
        const thumb = readFileSync(join(out, 'thumbs', `${room.id}.webp`)).toString('base64');
        const size = i ? disc : disc * 1.15;
        const ring = i ? `6px solid ${DAY.themes[room.theme]}` : `8px solid ${DAY.accent}`;
        return (
          `<div class="disc" style="left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;border:${ring}">` +
          `<img src="data:image/webp;base64,${thumb}"><b>${i + 1}</b></div>`
        );
      })
      .join('');
    await page.setContent(`<!doctype html><meta charset="utf-8"><style>${fontFace}
      html,body{margin:0;width:1200px;height:630px;background:${DAY.bg};color:${DAY.ink};font-family:Rubik,sans-serif;overflow:hidden}
      svg{position:absolute;inset:0}
      .disc{position:absolute;transform:translate(-50%,-50%);border-radius:50%;box-shadow:0 0 0 4px ${DAY.bg};background:#0a0e15}
      .disc img{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block}
      .disc b{position:absolute;top:-8px;left:-10px;min-width:30px;height:30px;border-radius:15px;background:${DAY.ink};color:#fff;display:grid;place-items:center;font-size:16px}
      .words{position:absolute;left:64px;top:0;bottom:0;width:520px;display:flex;flex-direction:column;justify-content:center;gap:20px}
      .brand{display:flex;align-items:center;gap:14px;font-weight:800;font-size:38px;letter-spacing:-1.2px}
      h1{margin:0;font-size:86px;line-height:0.98;font-weight:800;letter-spacing:-3.4px}
      p{margin:0;font-size:27px;line-height:1.35;color:${DAY.muted}}
    </style><body><svg width="1200" height="630">${svg}</svg>${discs}
      <div class="words"><div class="brand">${mark(54)}wonderlattice</div><h1>Follow your curiosity.</h1>
      <p>Small, hands-on experiments with big mathematical ideas. Pick one and play.</p></div></body>`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: join(root, 'assets/social.jpg'), type: 'jpeg', quality: 86 });
    console.log('assets/social.jpg');

    // The home-screen icon: the mark on paper.
    await page.setViewportSize({ width: 180, height: 180 });
    await page.setContent(
      `<!doctype html><style>html,body{margin:0;width:180px;height:180px;background:${DAY.bg};display:grid;place-items:center}</style>${mark(150)}`,
    );
    await page.screenshot({ path: join(root, 'assets/apple-touch-icon.png') });
    console.log('assets/apple-touch-icon.png');
  }
} finally {
  await browser.close();
  server.kill();
}
