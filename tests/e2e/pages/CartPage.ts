import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly items: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.items = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/cart\.html/);
  }

  async remove(slug: string) {
    await this.page.getByTestId(`remove-${slug}`).click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
