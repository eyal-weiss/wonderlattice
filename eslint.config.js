import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['dist/', 'node_modules/', 'test-results/', 'playwright-report/'] },
  js.configs.recommended,
  {
    // App code: classic browser scripts sharing the Wonderloom namespace.
    files: ['src/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        ...globals.browser,
        Wonderloom: 'readonly',
        WonderloomGuests: 'readonly',
        WonderloomTrail: 'readonly',
      },
    },
    rules: { 'no-unused-vars': ['error', { args: 'none' }] },
  },
  {
    files: ['tests/**/*.js', 'scripts/**/*.mjs', '*.config.js'],
    languageOptions: { sourceType: 'module', globals: { ...globals.node, ...globals.browser } },
  },
];
