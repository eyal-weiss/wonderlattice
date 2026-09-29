/*
 * العربية (ar). Translated from English; each string stays in its original place, one file per room.
 * - Keep every key; delete any you don't translate, and English will show there instead.
 * - Strings written as functions, like (n) => `${n} rolls`, receive numbers or names: keep the
 *   ${…} parts, and move them wherever your language needs them.
 * - Keys ending in Html may contain markup such as <strong> or <em>; keep the tags balanced.
 * - Check your work with: npm run i18n:check
 *
 * Conventions: Modern Standard Arabic, plain and warm, as a friendly guide would say it, not the
 * register of a textbook. The visitor is addressed in the plural (جرّبوا، اسحبوا), as the Hebrew
 * does, so no gender is assumed; buttons are verbal nouns or nouns (حفظ، إعادة البدء). Digits are
 * Western 0–9 everywhere, with the English decimal point and thousands comma (0.5, 1,000), never
 * ٠–٩: format numbers with toLocaleString('en'). Formulas, Latin letters, units and signed numbers
 * read left to right inside bidi isolates (U+2066 … U+2069). Punctuation is Arabic (، ؛ ؟) and
 * quotation marks are « ». A counted noun agrees with its number: رمية واحدة، رميتان، 3 رميات،
 * 11 رمية، 100 رمية.
 * Terms and patterns shared by every room: docs/lang/ar-glossary.md.
 */
Wonderlattice.defineLanguage('ar', { name: 'العربية', dir: 'rtl', speech: 'ar' });
