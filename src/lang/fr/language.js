/*
 * Français (fr). Traduit de l’anglais ; les chaînes sont à leur place d’origine.
 * - Keep every key; delete any you don't translate, and English will show there instead.
 * - Strings written as functions, like (n) => `${n} rolls`, receive numbers or names: keep the
 *   ${…} parts, and move them wherever your language needs them.
 * - Keys ending in Html may contain markup such as <strong> or <em>; keep the tags balanced.
 * - Check your work with: npm run i18n:check
 * Typographie : espace fine insécable (U+202F) avant ; ! ? % et à l’intérieur des « guillemets »,
 * espace insécable (U+00A0) avant les deux-points, et espace fine dans les grands nombres (4 000).
 */
Wonderlattice.defineLanguage('fr', { name: 'Français', dir: 'ltr', speech: 'fr-FR' });
