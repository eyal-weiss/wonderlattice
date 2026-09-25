// Markup in translated strings keeps only harmless tags and attributes.
import { test, expect } from '@playwright/test';

test('translated markup is reduced to allowed tags, attributes, and links', async ({ page }) => {
  await page.goto('/');
  const clean = (html) => page.evaluate((h) => globalThis.Wonderloom.safeMarkup(h), html);
  expect(await clean('Plain words, 2 < 3')).toBe('Plain words, 2 < 3');
  expect(await clean('<p>A <strong>bold</strong> <em>idea</em><br></p>')).toBe(
    '<p>A <strong>bold</strong> <em>idea</em><br></p>',
  );
  expect(await clean('<img src=x onerror="alert(1)">hi')).toBe('hi');
  expect(await clean('<p onclick="alert(1)" class="x">a</p>')).toBe('<p class="x">a</p>');
  expect(await clean('<a href="javascript:alert(1)">a</a>')).toBe('<a>a</a>');
  expect(await clean('<a href="https://example.org" target="_blank">a</a>')).toBe(
    '<a href="https://example.org" target="_blank" rel="noopener">a</a>',
  );
  expect(await clean('<script>alert(1)</script><style>*{}</style>ok')).toBe('ok');
  expect(await clean('<marquee>moving</marquee>')).toBe('moving');
  expect(await clean('a<!-- note -->b')).toBe('ab');
});

test('markup from translated strings and functions is cleaned', async ({ page }) => {
  await page.goto('/');
  const out = await page.evaluate(() => {
    const W = globalThis.Wonderloom;
    W.defineText('probe', 'en', {
      line: (n) => `<strong>${n}</strong>`,
      note: 'plain',
      label: (n) => `Label ${n}`,
      other: (n) => `fallback ${n}`,
    });
    W.defineText('probe', 'xx', {
      line: (n) => `<img src=x onerror=alert(1)><strong>${n}</strong>`,
      note: '<b onclick=x>b</b>',
      label: () => 'Say "hi" onclick="x',
      other: () => ['<img src=x onerror=alert(1)>'],
    });
    W.lang = 'xx';
    const t = W.text('probe');
    return [t.line(3), t.note, t.label(1), t.other(3)];
  });
  // Where English is plain text, a translation stays plain: no tags, and no quote that could end an attribute.
  expect(out).toEqual(['<strong>3</strong>', '‹b onclick=x>b‹/b>', 'Say ”hi” onclick=”x', 'fallback 3']);
});
