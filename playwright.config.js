import { defineConfig, devices } from '@playwright/test';

// Browser behavior checks. Locally you can reuse an installed Chrome with
// PW_CHANNEL=chrome npm run test:browser
// PW_PORT picks the test server's port (default 4173), so parallel checkouts don't collide.
// A server already on that port is reused only with PW_REUSE=1, so a clash fails loudly
// instead of silently testing another checkout's code.
const port = Number(process.env.PW_PORT || 4173);

export default defineConfig({
  testDir: 'tests/browser',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 6,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    channel: process.env.PW_CHANNEL || undefined,
  },
  projects: [{ name: 'desktop', use: { ...devices['Desktop Chrome'], channel: process.env.PW_CHANNEL || undefined } }],
  webServer: {
    command: `node scripts/serve.mjs ${process.env.SERVE_DIR || '.'} ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: process.env.PW_REUSE === '1',
  },
});
