import type { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly names: Locator;
  readonly items: Locator;
  readonly badge: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.names = page.getByTestId('inventory-item-name');
    this.items = page.getByTestId('inventory-item');
    this.badge = page.getByTestId('shopping-cart-badge');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async removeItem(name: string) {
    const productName = this.page.getByTestId('inventory-item-name').getByText(name, { exact: true });
    const item = this.items.filter({ has: productName });
    await item.getByRole('button', { name: 'Remove' }).click();
  }

  async startCheckout() {
    await this.checkoutButton.click();
  }
}
