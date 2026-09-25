// The language-file allowlist: dictionaries pass, anything that could run code does not.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkLanguageSource } from '../../scripts/lang-guard.mjs';

const ok = `
Wonderloom.defineLanguage('he', { name: 'עברית', dir: 'rtl', speech: 'he-IL' });
Wonderloom.defineText('dice', 'he', {
  name: 'קוביות',
  list: ['a', 'b'],
  rolls: (n) => (n === 1 ? 'הטלה אחת' : \`\${n.toLocaleString(Wonderloom.lang)} הטלות\`),
  pair: (a, b) => \`\${a[0].toUpperCase() + a.slice(1)} · \${b}\`,
  float: (n) => (n === Infinity ? '∞' : \`\${Math.round(n)}\`),
  block: (name) => {
    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    return cap(name);
  },
  symbols: { '−': ' מינוס ' },
});`;

test('accepts a dictionary with strings, lists, and small functions', () => {
  checkLanguageSource(ok, 'he.js');
});

const bad = {
  'redefining English': `Wonderloom.defineText('dice', 'en', { name: 'x' });`,
  'another language': `Wonderloom.defineText('dice', 'fr', { name: 'x' });`,
  'another statement': `fetch('https://example.com');`,
  'a variable': `const x = 1; Wonderloom.defineText('a', 'he', {});`,
  'another global': `Wonderloom.defineText('a', 'he', { x: () => fetch('//e') });`,
  'another Wonderloom property': `Wonderloom.defineText('a', 'he', { x: () => Wonderloom.room });`,
  'a global name': `Wonderloom.defineText('a', 'he', { x: document.cookie });`,
  'reading a property': `Wonderloom.defineText('a', 'he', { x: (n) => n.constructor });`,
  'indexing by name': `Wonderloom.defineText('a', 'he', { x: (n) => n['constructor'] });`,
  'indexing by a variable': `Wonderloom.defineText('a', 'he', { x: (n) => { const k = 'constructor'; return n[k][k]; } });`,
  'indexing by a parameter': `Wonderloom.defineText('a', 'he', { x: (n, i) => n[i] });`,
  'an object inside a function': `Wonderloom.defineText('a', 'he', { x: (f) => ({ join: f }).join('x') });`,
  'a computed call': `Wonderloom.defineText('a', 'he', { x: (n) => n['constructor']('x') });`,
  'an unknown method': `Wonderloom.defineText('a', 'he', { x: (n) => n.call(1) });`,
  assignment: `Wonderloom.defineText('a', 'he', { x: (n) => (n = 1) });`,
  'a tagged template': `Wonderloom.defineText('a', 'he', { x: (n) => n.join\`x\` });`,
  new: `Wonderloom.defineText('a', 'he', { x: () => new Image() });`,
  'a getter': `Wonderloom.defineText('a', 'he', { get x() { return 1; } });`,
  'a __proto__ key': `Wonderloom.defineText('a', 'he', { __proto__: {} });`,
  'a spread': `Wonderloom.defineText('a', 'he', { ...{} });`,
  'a computed scope': `Wonderloom.defineText(location.hash, 'he', {});`,
  'another Wonderloom call': `Wonderloom.toast('hi');`,
  'a function expression': `Wonderloom.defineText('a', 'he', { x: function () { return 1; } });`,
  'a loop in a block': `Wonderloom.defineText('a', 'he', { x: () => { while (true) {} } });`,
  this: `Wonderloom.defineText('a', 'he', { x: () => this });`,
};
for (const [what, source] of Object.entries(bad)) {
  test(`rejects ${what}`, () => {
    assert.throws(() => checkLanguageSource(source, 'he.js'), /not allowed in a language file|Unexpected/);
  });
}
