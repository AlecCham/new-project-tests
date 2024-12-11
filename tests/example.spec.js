const { test, expect } = require('@playwright/test');

// Configuration for environment and credentials
const config = {
  baseUrl: 'https://animated-gingersnap-8cf7f2.netlify.app/',
  credentials: {
    username: 'admin',
    password: 'password123',
  },
};

// Test cases data
const testCases = [
  {
    id: 1,
    name: 'Test Case 1',
    navigation: 'Web Application',
    column: 'To Do',
    card_title: 'Implement user authentication',
    tags: ['Feature', 'High Priority'],
    page_title: 'Vite + React + TS',
  },
  {
    id: 2,
    name: 'Test Case 2',
    navigation: 'Web Application',
    column: 'To Do',
    card_title: 'Fix navigation bug',
    tags: ['Bug'],
    page_title: 'Vite + React + TS',
  },
  {
    id: 3,
    name: 'Test Case 3',
    navigation: 'Web Application',
    column: 'In Progress',
    card_title: 'Design system updates',
    tags: ['Design'],
    page_title: 'Vite + React + TS',
  },
  {
    id: 4,
    name: 'Test Case 4',
    navigation: 'Mobile Application',
    column: 'To Do',
    card_title: 'Push notification system',
    tags: ['Feature'],
    page_title: 'Vite + React + TS',
  },
  {
    id: 5,
    name: 'Test Case 5',
    navigation: 'Mobile Application',
    column: 'In Progress',
    card_title: 'Offline mode',
    tags: ['Feature', 'High Priority'],
    page_title: 'Vite + React + TS',
  },
  {
    id: 6,
    name: 'Test Case 6',
    navigation: 'Mobile Application',
    column: 'Done',
    card_title: 'App icon design',
    tags: ['Design'],
    page_title: 'Vite + React + TS',
  },
];

// Test suite
test.describe('Demo App Data-Driven Tests', () => {
  // Loop through each test case
  testCases.forEach((testCase) => {
    test(testCase.name, async ({ page }) => {
      // Login Step
      await test.step('Login to Demo App', async () => {
        console.log('Starting login process...');
        await page.goto(config.baseUrl);
        console.log(`Navigated to login page at ${config.baseUrl}`);

        await page.locator('#username').fill(config.credentials.username);
        console.log('Entered username.');

        await page.locator('#password').fill(config.credentials.password);
        console.log('Entered password.');

        await page.locator('[type="submit"]').click();
        console.log('Clicked login button.');

        await page.waitForLoadState('networkidle');
        const currentPageTitle = await page.title();
        console.log(`Page title after login: ${currentPageTitle}`);
        expect(currentPageTitle).toBe(testCase.page_title);
      });

      // Navigation Step
      await test.step(`Navigate to "${testCase.navigation}"`, async () => {
        console.log(`Attempting to navigate to "${testCase.navigation}"...`);
        const navLocator = page.locator(`.font-medium:has-text("${testCase.navigation}")`);
        const navCount = await navLocator.count();
        console.log(`Found ${navCount} navigation items matching "${testCase.navigation}".`);

        if (navCount === 0) {
          throw new Error(`Navigation item "${testCase.navigation}" not found.`);
        }

        await navLocator.first().click();
        console.log(`Clicked on navigation item "${testCase.navigation}".`);

        await page.waitForTimeout(1000); // Ensure navigation is complete
        console.log(`Completed navigation to "${testCase.navigation}".`);
      });

      // Validation Step
      await test.step(`Validate Task and Tags in "${testCase.column}" Column`, async () => {
        console.log(`Validating task "${testCase.card_title}" in column "${testCase.column}"...`);

        // Locate the table containing the columns
        const tableLocator = page.locator('.flex-1');
        expect(await tableLocator.count()).toBeGreaterThan(0);
        console.log('Found table with class="flex-1".');

        // Locate the target column
        const columnLocator = tableLocator.locator(`.inline-flex.gap-6.p-6.h-full:has-text("${testCase.column}")`);
        expect(await columnLocator.count()).toBeGreaterThan(0);
        console.log(`Found "${testCase.column}" column.`);

        // Validate the task title within the column
        const taskLocator = columnLocator.locator(`.font-medium.text-gray-900.mb-2:has-text("${testCase.card_title}")`);
        const taskVisible = await taskLocator.isVisible();
        console.log(`Task "${testCase.card_title}" visibility: ${taskVisible}`);

        if (!taskVisible) {
          console.log(`Task "${testCase.card_title}" not found in "${testCase.column}" column. Capturing screenshot.`);
          await page.screenshot({ path: `test-results/${testCase.name}-task-not-found.png` });
          throw new Error(`Task "${testCase.card_title}" not found in "${testCase.column}" column.`);
        }
        console.log(`Task "${testCase.card_title}" successfully validated in "${testCase.column}" column.`);

        // Validate tags
        console.log(`Validating tags for task "${testCase.card_title}"...`);
        const tagContainerLocator = taskLocator.locator('xpath=ancestor::*[@class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"]').locator('.flex.flex-wrap.gap-2.mb-3');
        const tagLocators = tagContainerLocator.locator('span');
        const actualTags = await tagLocators.allTextContents();
        console.log(`Tags found: ${actualTags.join(', ')}`);

        testCase.tags.forEach((tag) => {
          if (!actualTags.includes(tag)) {
            throw new Error(`Tag "${tag}" not found for task "${testCase.card_title}".`);
          }
        });
        console.log(`Tags for task "${testCase.card_title}" successfully validated.`);
      });
    });
  });
});
