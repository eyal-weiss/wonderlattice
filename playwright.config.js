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
  // PW_WORKERS lets a background run use fewer cores (the build loop sets 2; see docs/agents/BUILD_LOOP.md).
  // GitHub's runners for public repositories have 4 cores, so CI uses all of them.
  workers: Number(process.env.PW_WORKERS) || (process.env.CI ? 4 : 6),
  // On CI a failed test runs once more. One that passes on its second try is reported as flaky (in the summary and
  // the run's annotations) rather than failing the build: a busy machine shouldn't block a pull request, and a
  // flaky test still shows, to be made steady. Locally every failure counts.
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
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
