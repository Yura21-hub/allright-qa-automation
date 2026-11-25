import { expect, test } from '../../tests/ui/fixtures';
import { CartPage } from '../../tests/ui/pages/cart-page';
import { CheckoutPage } from '../../tests/ui/pages/checkout-page';

test('Checkout requires a postal code', async ({ inventory, page }) => {
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await inventory.addItem('Sauce Labs Backpack');
  await inventory.openCart();
  await cart.startCheckout();
  await checkout.fillInformation('Jane', 'Tester', '');
  await checkout.continue();

  await expect(checkout.error).toBeVisible();
  await expect(checkout.error).toHaveText('Error: Postal Code is required');
  await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
});
