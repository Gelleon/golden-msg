import { defineConfig, devices } from '@playwright/test';
import path from 'path'

const e2eDbFile = path.join(process.cwd(), 'prisma', 'e2e.sqlite')
const e2eDatabaseUrl = `file:${e2eDbFile.replace(/\\/g, '/')}`

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
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['Galaxy S5'] },
    },
    {
      name: 'Mobile Safari - iPhone 12',
      use: { ...devices['iPhone 12'] },
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
