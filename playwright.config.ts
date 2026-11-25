import { defineConfig, devices } from '@playwright/test';
import { config } from './tests/support/config';

export default defineConfig({
  testDir: './tests',
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  projects: [
    {
      name: 'ui',
      testMatch: 'ui/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: config.ui.baseURL,
        testIdAttribute: 'data-test',
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
      },
    },
    {
      name: 'api',
      testMatch: 'api/**/*.spec.ts',
      use: { baseURL: config.api.baseURL },
    },
  ],
});
