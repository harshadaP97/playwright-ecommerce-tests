import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginPage } from './LoginPage';
import { CheckOutPage } from './CheckOutPage';

export class CartPage extends BasePage {
  readonly itemName = this.page.locator('.inventory_item_name');
  readonly checkoutButton = this.page.locator('#checkout');

  // Verifies that the expected item is present in the cart
  async assertItemInCart(): Promise<string> {
    const text = await this.itemName.textContent();
    return text?.trim() || '';
  }

  // Proceeds to the checkout page
  async clickCheckout(): Promise<CheckOutPage> {
    await this.checkoutButton.click();
    return new CheckOutPage(this.page);
  }
}
