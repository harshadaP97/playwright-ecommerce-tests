import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { appConfig } from '../utils/config';
import users from '../test-data/users.json';

let loginPage: LoginPage;
let homePage: HomePage;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  loginPage = new LoginPage(page); // initialize login page before each test
});

// Data-driven login tests using external users.json
// Covers both valid and invalid user flows in a scalable way
test.describe('Login Tests - Data Driven', () => {
  users.forEach((user, index) => {
    const label = user.shouldPass
      ? `should login successfully as ${user.username}`
      : `should fail to login as ${user.username}`;

    test(label, async ({ page }) => {
      if (user.shouldPass) {
        homePage = await loginPage.login(user.username, user.password);
        const title = await homePage.getPageTitleText();
        expect(title?.trim()).toBe('Products'); // successful login lands on Products page
      } else {
        await loginPage.login(user.username, user.password);
        const errorMsg = await loginPage.getErrorMessageText();
        expect(errorMsg).toBe(user.expectedError); // assert specific login error
      }
    });
  });
});

//  Basic login test using static config values
// Kept here to show a simple non-DDT version
test.describe('Login Tests - saucedemo.com', () => {
  test('Successful login with valid credentials', async ({ page }) => {
    homePage = await loginPage.login(appConfig.username, appConfig.password);
    const actualTitle = await homePage.getPageTitleText();
    expect(actualTitle?.trim()).toBe('Products');
  });
});

// Negative login test for a locked-out user
// Validates error handling using static test data
test.describe('Invalid Login Tests - saucedemo.com', () => {
  test('Invalid Login invalid credentials', async ({ page }) => {
    await loginPage.login(appConfig.invalidusername, appConfig.password);
    const actualMessage = await loginPage.getErrorMessageText();
    expect(actualMessage).toBe('Epic sadface: Sorry, this user has been locked out.');
  });
});
