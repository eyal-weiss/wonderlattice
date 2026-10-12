// Counts that can be one: the needles and punishment rooms' words say "1 needle", not "1 needles", in every language.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const root = new URL('../../', import.meta.url);
const load = (path, lang) => {
  let text;
  const Wonderlattice = { defineText: (id, code, words) => (text = words), lang };
  vm.runInNewContext(readFileSync(new URL(path, root), 'utf8'), { Wonderlattice });
  return text;
};
const words = (room, lang) =>
  load(lang === 'en' ? `src/rooms/${room}/text.en.js` : `src/lang/${lang}/${room}.js`, lang);

test('one needle and one rerun are singular (the counts arrive formatted)', () => {
  const one = {
    en: ['1 needle so far', '1 rerun · 1 gave 355/113'],
    he: ['מחט אחת עד כה', '\u2067חזרה אחת · אחת נתנה 355/113\u2069'],
    es: ['1 aguja hasta ahora', '1 tanda · 1 dio 355/113'],
    fr: ['1 aiguille jusqu’ici', '1 essai · 1 a donné 355/113'],
    pt: ['1 agulha até agora', '1 rodada · 1 deu 355/113'],
  };
  for (const [lang, [raining, hits]] of Object.entries(one)) {
    const t = words('needles', lang);
    assert.equal(t.status.raining('1'), raining, lang);
    assert.equal(t.labels.hits('1', '1'), hits, lang);
  }
  assert.equal(words('needles', 'en').status.raining('3,408'), '3,408 needles so far');
});

test('one throw and one point are singular', () => {
  const t = words('regress', 'en');
  assert.equal(t.status.count(1), '1 throw');
  assert.equal(t.status.count(7), '7 throws');
  assert.equal(t.labels.points(1), '1 point');
  assert.equal(t.labels.points(96), '96 points');
});
