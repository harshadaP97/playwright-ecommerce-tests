import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { appConfig } from '../utils/config';
import { CartPage } from '../pages/CartPage';
import { CheckOutPage } from '../pages/CheckOutPage';
import orderData from '../test-data/orders.json';

let loginPage: LoginPage;
let homePage: HomePage;
let cartPage: CartPage;
let checkOutPage: CheckOutPage;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  loginPage = new LoginPage(page);
  homePage = await loginPage.login(appConfig.username, appConfig.password); // login before each test
});

// Basic successful order test using static values from config file
test('Successful Order from config file data', async ({ page }) => {
  cartPage = await homePage.addToCartItem(appConfig.item);
  const product = await cartPage.assertItemInCart();
  expect(product?.trim()).toBe(appConfig.item);

  checkOutPage = await cartPage.clickCheckout();
  const summary = await checkOutPage.fillInfo(appConfig.fname, appConfig.lname, appConfig.zipcode);
  expect(summary?.trim()).toBe(appConfig.item);

  const success = await checkOutPage.finishOrder();
  expect(success?.trim()).toBe('Thank you for your order!');
});

// Data-driven order test using multiple sets of test data from JSON
orderData.forEach((data, index) => {
  test(`Successful Order [DDT #${index + 1}] - ${data.item}`, async ({ page }) => {
    cartPage = await homePage.addToCartItem(data.item);
    const product = await cartPage.assertItemInCart();
    expect(product?.trim()).toBe(data.item);

    checkOutPage = await cartPage.clickCheckout();
    const summary = await checkOutPage.fillInfo(data.fname, data.lname, data.zipcode);
    expect(summary?.trim()).toBe(data.item);

    const success = await checkOutPage.finishOrder();
    expect(success?.trim()).toBe('Thank you for your order!');
  });
});

// Cancel order flow test to verify user returns to Products page
test('Cancle Order and Return to Home Page', async ({ page }) => {
  cartPage = await homePage.addToCartItem(appConfig.item);
  const product = await cartPage.assertItemInCart();
  expect(product?.trim()).toBe(appConfig.item);

  checkOutPage = await cartPage.clickCheckout();
  const summary = await checkOutPage.fillInfo(appConfig.fname, appConfig.lname, appConfig.zipcode);
  expect(summary?.trim()).toBe(appConfig.item);

  homePage = await checkOutPage.cancleOrder();
  const title = await homePage.getPageTitleText();
  expect(title?.trim()).toBe('Products');
});
