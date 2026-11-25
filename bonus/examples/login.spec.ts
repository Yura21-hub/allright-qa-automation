import { expect, test } from '@playwright/test';
import { config } from '../../tests/support/config';
import { InventoryPage } from '../../tests/ui/pages/inventory-page';
import { LoginPage } from '../../tests/ui/pages/login-page';

test('Standard user opens the catalog', async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);

  await login.open();
  await login.signIn(config.ui.username, config.ui.password);

  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(inventory.title).toBeVisible();
  await expect(inventory.title).toHaveText('Products');
});
