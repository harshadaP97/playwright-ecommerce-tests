import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HomePage } from './HomePage';

export class LoginPage extends BasePage {
  readonly usernameInput = this.page.locator('#user-name');
  readonly passwordInput = this.page.locator('#password');
  readonly submitButton = this.page.locator('#login-button');
  readonly errorMessage = this.page.locator('[data-test="error"]');

  // Logs in with given credentials and returns the HomePage
  async login(username: string, password: string): Promise<HomePage> {
    await this.usernameInput.type(username);
    await this.passwordInput.type(password);
    await this.submitButton.click();
    return new HomePage(this.page);
  }

  // Returns the login error message text (if login fails)
  async getErrorMessageText(): Promise<string> {
    const text = await this.errorMessage.textContent();
    return text?.trim() || '';
  }

  // Verifies login page by checking the submit button label
  async validateLoginPage(): Promise<string> {
    const text = await this.submitButton.getAttribute('value');
    return text?.trim() || '';
  }
}
