import { expect, test as base } from '@playwright/test';
import { config } from '../support/config';
import { InventoryPage } from './pages/inventory-page';
import { LoginPage } from './pages/login-page';

export const test = base.extend<{ inventory: InventoryPage }>({
  inventory: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.open();
    await login.signIn(config.ui.username, config.ui.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await use(new InventoryPage(page));
  },
});

export { expect };
