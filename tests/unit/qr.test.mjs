// The vendored QR encoder (src/vendor/qrcodegen.js) makes codes that a decoder reads back exactly.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { URL } from 'node:url';
import vm from 'node:vm';
import jsQR from 'jsqr';

const context = vm.createContext({});
vm.runInContext(readFileSync(new URL('../../src/vendor/qrcodegen.js', import.meta.url), 'utf8'), context);
const { QrCode } = context.qrcodegen;

/** The code as a picture: black modules on white, with the four-module quiet zone the page draws too. */
function picture(qr, scale = 4, quiet = 4) {
  const side = (qr.size + 2 * quiet) * scale;
  const data = new Uint8ClampedArray(side * side * 4).fill(255);
  for (let y = 0; y < qr.size; y++)
    for (let x = 0; x < qr.size; x++) {
      if (!qr.getModule(x, y)) continue;
      for (let dy = 0; dy < scale; dy++)
        for (let dx = 0; dx < scale; dx++) {
          const i = (((y + quiet) * scale + dy) * side + (x + quiet) * scale + dx) * 4;
          data[i] = data[i + 1] = data[i + 2] = 0;
        }
    }
  return { data, side };
}

test('share links round-trip through a QR code', () => {
  for (const link of [
    'https://wonderlattice.com/room/shower/#room=shower&mode=1&pipe=4',
    'https://wonderlattice.com/room/motion/#room=motion&k=-5&r=42&p=0&ink=0',
    'https://wonderlattice.com/room/pools/#room=pools&floor=1&prev=2.5&pool=10&tube=673&two=false&seed=12345&hideWell=-1',
    'https://wonderlattice.com/?lang=he#room=dice',
  ]) {
    const qr = QrCode.encodeText(link, QrCode.Ecc.MEDIUM);
    const { data, side } = picture(qr);
    assert.equal(jsQR(data, side, side)?.data, link);
  }
});

test('a long link still fits a code a phone can read', () => {
  const link = 'https://wonderlattice.com/room/tiles/#' + 'room=tiles&' + 'a=0.123456&'.repeat(30);
  const qr = QrCode.encodeText(link, QrCode.Ecc.MEDIUM);
  assert.ok(qr.size <= 97, `version too large: ${qr.size} modules`); // version 20 or below
  const { data, side } = picture(qr, 3);
  assert.equal(jsQR(data, side, side)?.data, link);
});
