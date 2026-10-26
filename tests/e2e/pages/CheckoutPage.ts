import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly error: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly completeHeader: Locator;

  constructor(private readonly page: Page) {
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.error = page.getByTestId('error');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.completeHeader = page.getByTestId('complete-header');
  }

  async fillInfo(first: string, last: string, zip: string) {
    if (first) await this.firstName.fill(first);
    if (last) await this.lastName.fill(last);
    if (zip) await this.postalCode.fill(zip);
    await this.continueButton.click();
  }

  async expectOverview() {
    await expect(this.page).toHaveURL(/checkout-step-two\.html/);
  }

  async amount(locator: Locator): Promise<number> {
    const text = (await locator.textContent()) ?? '';
    return parseFloat(text.match(/\$([\d.]+)/)![1]);
  }

  async finish() {
    await this.finishButton.click();
  }
}
