import { PlaywrightTestConfig } from '@playwright/test';
import configData from './config/app-config.json'; // ✅ import JSON

const config: PlaywrightTestConfig = {
  timeout: 60000,
  retries: 0,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    baseURL: configData.baseURL // pulled from your JSON file
  },
  reporter: [['html', { open: 'never' }]],
  projects: [
    { name: 'Chromium', use: { browserName: 'chromium' } },
    { name: 'Firefox', use: { browserName: 'firefox' } },
    { name: 'Webkit', use: { browserName: 'webkit' } }
  ]
};

export default config;
