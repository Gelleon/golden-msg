import { defineConfig, devices } from '@playwright/test';
import path from 'path'

const e2eDbFile = path.join(process.cwd(), 'prisma', 'e2e.sqlite')
const e2eDatabaseUrl = `file:${e2eDbFile.replace(/\\/g, '/')}`
const useSystemChrome = process.env.PLAYWRIGHT_USE_SYSTEM_CHROME === '1'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'line',
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        ...(useSystemChrome ? { channel: 'chrome' as const } : {}),
      },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['Galaxy S5'] },
    },
    {
      name: 'Mobile Safari - iPhone 12',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'Mobile Safari - iPhone SE',
      use: { ...devices['iPhone SE'] },
    },
    {
      name: 'Mobile Safari - iPhone 14 Pro Max',
      use: { ...devices['iPhone 14 Pro Max'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: `node -e "require('fs').rmSync(process.env.E2E_DB_FILE,{force:true});" && node ./node_modules/prisma/build/index.js db push --force-reset --skip-generate && node ./node_modules/next/dist/bin/next build && node ./node_modules/next/dist/bin/next start -p 3100`,
    url: 'http://localhost:3100',
    reuseExistingServer: false,
    env: {
      DATABASE_URL: e2eDatabaseUrl,
      E2E_DB_FILE: e2eDbFile,
    },
  },
});
