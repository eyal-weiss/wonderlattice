import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['dist/', 'node_modules/', 'test-results/', 'playwright-report/', '.claude/'] },
  js.configs.recommended,
  {
    // App code: classic browser scripts sharing the Wonderlattice namespace.
    files: ['src/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        ...globals.browser,
        Wonderlattice: 'readonly',
        WonderlatticeGuests: 'readonly',
        WonderlatticeTrail: 'readonly',
      },
    },
    rules: { 'no-unused-vars': ['error', { args: 'none' }] },
  },
  {
    // Translations may use non-breaking spaces in their text (French puts one before ? ! : ; and %).
    files: ['src/lang/*.js'],
    rules: { 'no-irregular-whitespace': ['error', { skipStrings: true, skipTemplates: true }] },
  },
  {
    files: ['tests/**/*.js', 'scripts/**/*.mjs', '*.config.js'],
    languageOptions: { sourceType: 'module', globals: { ...globals.node, ...globals.browser } },
  },
];
