import type { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly prices: Locator;
  readonly sorting: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.prices = page.getByTestId('inventory-item-price');
    this.sorting = page.getByTestId('product-sort-container');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  async open() {
    await this.page.goto('/inventory.html');
  }

  item(name: string) {
    return this.items.filter({ has: this.page.getByTestId('inventory-item-name').getByText(name, { exact: true }) });
  }

  itemName(item: Locator) {
    return item.getByTestId('inventory-item-name');
  }

  itemPrice(item: Locator) {
    return item.getByTestId('inventory-item-price');
  }

  addButton(item: Locator) {
    return item.getByRole('button', { name: 'Add to cart' });
  }

  async viewItem(name: string) {
    await this.itemName(this.item(name)).click();
  }

  async addItem(name: string) {
    await this.addButton(this.item(name)).click();
  }

  async sortByLowestPrice() {
    await this.sorting.selectOption('lohi');
  }

  async openCart() {
    await this.cartLink.click();
  }
}
