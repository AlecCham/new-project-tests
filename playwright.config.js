const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests', // Directory containing the test files
  timeout: 30000, // Timeout for each test in milliseconds
  retries: 1, // Retry failed tests once
  use: {
    headless: true, // Run tests in headless mode
    screenshot: 'only-on-failure', // Capture screenshots on test failure
    video: 'retain-on-failure', // Record video on test failure
  },
});
