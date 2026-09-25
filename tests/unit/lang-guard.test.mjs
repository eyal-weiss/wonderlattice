// The language-file allowlist: dictionaries pass, anything that could run code does not.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkLanguageSource } from '../../scripts/lang-guard.mjs';

const ok = `
Wonderlattice.defineLanguage('he', { name: 'עברית', dir: 'rtl', speech: 'he-IL' });
Wonderlattice.defineText('dice', 'he', {
  name: 'קוביות',
  list: ['a', 'b'],
  rolls: (n) => (n === 1 ? 'הטלה אחת' : \`\${n.toLocaleString(Wonderlattice.lang)} הטלות\`),
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
  'redefining English': `Wonderlattice.defineText('dice', 'en', { name: 'x' });`,
  'another language': `Wonderlattice.defineText('dice', 'fr', { name: 'x' });`,
  'another statement': `fetch('https://example.com');`,
  'a variable': `const x = 1; Wonderlattice.defineText('a', 'he', {});`,
  'another global': `Wonderlattice.defineText('a', 'he', { x: () => fetch('//e') });`,
  'another Wonderlattice property': `Wonderlattice.defineText('a', 'he', { x: () => Wonderlattice.room });`,
  'a global name': `Wonderlattice.defineText('a', 'he', { x: document.cookie });`,
  'reading a property': `Wonderlattice.defineText('a', 'he', { x: (n) => n.constructor });`,
  'indexing by name': `Wonderlattice.defineText('a', 'he', { x: (n) => n['constructor'] });`,
  'indexing by a variable': `Wonderlattice.defineText('a', 'he', { x: (n) => { const k = 'constructor'; return n[k][k]; } });`,
  'indexing by a parameter': `Wonderlattice.defineText('a', 'he', { x: (n, i) => n[i] });`,
  'an object inside a function': `Wonderlattice.defineText('a', 'he', { x: (f) => ({ join: f }).join('x') });`,
  'a computed call': `Wonderlattice.defineText('a', 'he', { x: (n) => n['constructor']('x') });`,
  'an unknown method': `Wonderlattice.defineText('a', 'he', { x: (n) => n.call(1) });`,
  assignment: `Wonderlattice.defineText('a', 'he', { x: (n) => (n = 1) });`,
  'a tagged template': `Wonderlattice.defineText('a', 'he', { x: (n) => n.join\`x\` });`,
  new: `Wonderlattice.defineText('a', 'he', { x: () => new Image() });`,
  'a getter': `Wonderlattice.defineText('a', 'he', { get x() { return 1; } });`,
  'a __proto__ key': `Wonderlattice.defineText('a', 'he', { __proto__: {} });`,
  'a spread': `Wonderlattice.defineText('a', 'he', { ...{} });`,
  'a computed scope': `Wonderlattice.defineText(location.hash, 'he', {});`,
  'another Wonderlattice call': `Wonderlattice.toast('hi');`,
  'a function expression': `Wonderlattice.defineText('a', 'he', { x: function () { return 1; } });`,
  'a loop in a block': `Wonderlattice.defineText('a', 'he', { x: () => { while (true) {} } });`,
  this: `Wonderlattice.defineText('a', 'he', { x: () => this });`,
};
for (const [what, source] of Object.entries(bad)) {
  test(`rejects ${what}`, () => {
    assert.throws(() => checkLanguageSource(source, 'he.js'), /not allowed in a language file|Unexpected/);
  });
}
