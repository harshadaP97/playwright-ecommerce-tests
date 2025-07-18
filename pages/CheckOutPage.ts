import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginPage } from './LoginPage';
import { CartPage } from './CartPage';
import { HomePage } from './HomePage';

export class CheckOutPage extends BasePage {
  readonly fName = this.page.locator('#first-name');
  readonly LName = this.page.locator('#last-name');
  readonly zipcode = this.page.locator('#postal-code');
  readonly continueButton = this.page.locator('#continue');
  readonly itemCheck = this.page.locator('.inventory_item_name');
  readonly cancleButton = this.page.locator('#cancel');
  readonly finishButton = this.page.locator('#finish');
  readonly successMessage = this.page.locator('.complete-header');

  // Fills out checkout info form and returns item name on summary page
  async fillInfo(f: string, l: string, z: string): Promise<string> {
    await this.fName.fill(f);
    await this.LName.fill(l);
    await this.zipcode.fill(z);
    await this.continueButton.click();
    const text = await this.itemCheck.textContent();
    return text?.trim() || '';
  }

  // Completes the order and returns the confirmation message
  async finishOrder(): Promise<string> {
    await this.finishButton.click();
    const text = await this.successMessage.textContent();
    return text?.trim() || '';
  }

  // Cancels checkout and returns to the Home page
  async cancleOrder(): Promise<HomePage> {
    await this.cancleButton.click();
    return new HomePage(this.page);
  }
}
