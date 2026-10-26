import { defineConfig, devices } from '@playwright/test';

const API_URL = process.env.API_URL ?? 'https://jsonplaceholder.typicode.com';
const WEB_URL = process.env.WEB_URL ?? 'https://www.saucedemo.com';
const CI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  workers: CI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'results/results.json' }],
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],
  projects: [
    {
      name: 'api',
      testMatch: /tests\/api\/.*\.spec\.ts/,
      use: {
        baseURL: API_URL,
        extraHTTPHeaders: { Accept: 'application/json', 'User-Agent': 'qa-suite/1.0' },
      },
    },
    {
      name: 'e2e-chromium',
      testMatch: /tests\/e2e\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: WEB_URL,
        testIdAttribute: 'data-test',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
  ],
});
