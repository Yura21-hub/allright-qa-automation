import type { Locator, Page } from '@playwright/test';

export class ProductDetailsPage {
  readonly backToProducts: Locator;
  readonly name: Locator;
  readonly price: Locator;

  constructor(page: Page) {
    this.backToProducts = page.getByTestId('back-to-products');
    this.name = page.getByTestId('inventory-item-name');
    this.price = page.getByTestId('inventory-item-price');
  }
}
