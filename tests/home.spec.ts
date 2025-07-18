import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { appConfig } from '../utils/config';

let loginPage: LoginPage;
let homePage: HomePage;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  loginPage = new LoginPage(page);
  homePage = await loginPage.login(appConfig.username, appConfig.password); // login before each test
});

test('LogoutUser', async ({ page }) => {
  // triggers logout and verifies user lands back on login screen
  loginPage = await homePage.logoutUser();
  const actualMessage = await loginPage.validateLoginPage();
  expect(actualMessage).toBe('Login');
});

test('Sort Low to High and High to Low', async ({ page }) => {
  // sort by price: low to high and check if values are sorted correctly
  await homePage.sortItems('lohi');
  const lowToHighPrices = await homePage.getItemPrices();
  expect(lowToHighPrices).toEqual([...lowToHighPrices].sort((a, b) => a - b));

  // sort by price: high to low and check if values are sorted correctly
  await homePage.sortItems('hilo');
  const highToLowPrices = await homePage.getItemPrices();
  expect(highToLowPrices).toEqual([...highToLowPrices].sort((a, b) => b - a));
});
