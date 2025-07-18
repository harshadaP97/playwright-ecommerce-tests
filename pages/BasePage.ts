import { Page } from '@playwright/test'

// Base class for all page objects to share common functionality
export abstract class BasePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  // Simple wrapper for an explicit wait (use sparingly)
  async wait(time: number) {
    await this.page.waitForTimeout(time)
  }
}
