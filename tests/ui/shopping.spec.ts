import { UiAssertions as ui } from '../support/ui-assertions';
import { expect, test } from './fixtures';
import { CartPage } from './pages/cart-page';
import { CheckoutPage } from './pages/checkout-page';
import { ProductDetailsPage } from './pages/product-details-page';

const backpack = 'Sauce Labs Backpack';
const bikeLight = 'Sauce Labs Bike Light';
const money = /^\$\d+\.\d{2}$/;

test('catalog cards show product names, prices, and add buttons', async ({ inventory }) => {
  await ui.expectVisible(inventory.items.first());
  for (const item of await inventory.items.all()) {
    await ui.expectText(item.getByTestId('inventory-item-name'), /\S/);
    await ui.expectText(item.getByTestId('inventory-item-price'), money);
    await ui.expectVisible(item.getByRole('button', { name: 'Add to cart' }));
  }
});

test('product details preserve the catalog name and price', async ({ inventory, page }) => {
  const item = inventory.item(backpack);
  const price = item.getByTestId('inventory-item-price');
  await ui.expectText(price, money);
  const displayedPrice = await price.innerText();
  const details = new ProductDetailsPage(page);

  await inventory.viewItem(backpack);

  await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+$/);
  await ui.expectText(details.name, backpack);
  await ui.expectText(details.price, displayedPrice);
});

test('price sorting rearranges every catalog price from low to high', async ({ inventory }) => {
  await ui.expectVisible(inventory.prices.first());
  const before = await inventory.prices.allTextContents();
  const sorted = [...before].sort((left, right) => Number(left.slice(1)) - Number(right.slice(1)));
  expect(before.length).toBeGreaterThan(1);

  await inventory.sortByLowestPrice();

  await ui.expectValue(inventory.sorting, 'lohi');
  await expect(inventory.prices).toHaveText(sorted);
});

test('adding two products updates the cart count and contents', async ({ inventory, page }) => {
  const cart = new CartPage(page);
  await inventory.addItem(backpack);
  await inventory.addItem(bikeLight);

  await ui.expectText(inventory.cartBadge, '2');
  await inventory.openCart();
  await ui.expectCount(cart.names, 2);
  await expect(cart.names).toHaveText([backpack, bikeLight]);
});

test('removing a product updates the cart count and contents', async ({ inventory, page }) => {
  const cart = new CartPage(page);
  await inventory.addItem(backpack);
  await inventory.addItem(bikeLight);
  await inventory.openCart();

  await cart.removeItem(backpack);

  await ui.expectText(cart.badge, '1');
  await expect(cart.names).toHaveText([bikeLight]);
});

test('checkout shows the expected totals and confirms the order', async ({ inventory, page }) => {
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);
  const productPrice = inventory.item(backpack).getByTestId('inventory-item-price');
  await ui.expectText(productPrice, money);
  const expectedSubtotal = Math.round(Number((await productPrice.innerText()).slice(1)) * 100);

  await inventory.addItem(backpack);
  await inventory.openCart();
  await cart.startCheckout();
  await checkout.fillInformation('Jane', 'Tester', '90210');
  await checkout.continue();

  await ui.expectText(checkout.title, 'Checkout: Overview');
  await expect(checkout.names).toHaveText([backpack]);
  await ui.expectText(checkout.subtotal, /^Item total: \$\d+\.\d{2}$/);
  await ui.expectText(checkout.tax, /^Tax: \$\d+\.\d{2}$/);
  await ui.expectText(checkout.total, /^Total: \$\d+\.\d{2}$/);
  const cents = (text: string) => Number(text.split('$')[1].replace('.', ''));
  expect(cents(await checkout.subtotal.innerText())).toBe(expectedSubtotal);
  expect(cents(await checkout.total.innerText())).toBe(expectedSubtotal + cents(await checkout.tax.innerText()));

  await checkout.finish();

  await expect(page).toHaveURL(/\/checkout-complete\.html$/);
  await ui.expectText(checkout.confirmation, 'Thank you for your order!');
});

test('checkout requires a postal code before showing the overview', async ({ inventory, page }) => {
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);
  await inventory.addItem(backpack);
  await inventory.openCart();
  await cart.startCheckout();
  await checkout.fillInformation('Jane', 'Tester', '');
  await ui.expectValue(checkout.postalCode, '');

  await checkout.continue();

  await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  await ui.expectText(checkout.error, 'Error: Postal Code is required');
  await ui.expectVisible(checkout.postalCode);
});
