import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginPage } from './LoginPage';
import { CartPage } from './CartPage';

export class HomePage extends BasePage {
  readonly pageTitle = this.page.locator('text=Products');
  readonly menuButton = this.page.locator('text=Open Menu');
  readonly logoutButton = this.page.locator('text=Logout');
  readonly sortDropdown = this.page.locator('.product_sort_container');
  readonly itemPrice = this.page.locator('.inventory_item_price');
  readonly goToCart = this.page.locator('.shopping_cart_link');

  // Adds a specific item to the cart by name and navigates to the cart
  async addToCartItem(name: String): Promise<CartPage> {
    await this.page.locator(`.inventory_item:has-text("${name}") >> text=Add to cart`).click();
    await this.goToCart.click();
    return new CartPage(this.page);
  }

  // Sorts the product list using the given dropdown option
  async sortItems(order: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(order);
  }

  // Returns all product prices as numbers
  async getItemPrices(): Promise<number[]> {
    const prices = await this.itemPrice.allTextContents();
    return prices.map(p => parseFloat(p.replace('$', '')));
  }

  // Gets the visible title of the page (used to confirm successful login)
  async getPageTitleText(): Promise<string> {
    const text = await this.pageTitle.textContent();
    return text?.trim() || '';
  }

  // Logs out the current user and returns to the login page
  async logoutUser(): Promise<LoginPage> {
    await this.menuButton.click();
    await this.logoutButton.click();
    return new LoginPage(this.page);
  }
}
