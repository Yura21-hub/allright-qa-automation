import type { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly title: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly error: Locator;
  readonly names: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly confirmation: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.error = page.getByTestId('error');
    this.names = page.getByTestId('inventory-item-name');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.confirmation = page.getByTestId('complete-header');
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.postalCode.fill(postalCode);
  }

  async continue() {
    await this.page.getByTestId('continue').click();
  }

  async finish() {
    await this.page.getByTestId('finish').click();
  }
}
