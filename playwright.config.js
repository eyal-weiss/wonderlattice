import { defineConfig, devices } from '@playwright/test';

// Browser behavior checks. Locally you can reuse an installed Chrome with
// PW_CHANNEL=chrome npm run test:browser
export default defineConfig({
  testDir: 'tests/browser',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 6,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    channel: process.env.PW_CHANNEL || undefined,
  },
  projects: [{ name: 'desktop', use: { ...devices['Desktop Chrome'], channel: process.env.PW_CHANNEL || undefined } }],
  webServer: {
    command: `node scripts/serve.mjs ${process.env.SERVE_DIR || '.'} 4173`,
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
});
