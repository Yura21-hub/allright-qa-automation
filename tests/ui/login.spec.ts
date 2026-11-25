import { expect, test } from '@playwright/test';
import { config } from '../support/config';
import { UiAssertions as ui } from '../support/ui-assertions';
import { InventoryPage } from './pages/inventory-page';
import { LoginPage } from './pages/login-page';

test('standard user reaches the product catalog', async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);

  await login.open();
  await login.signIn(config.ui.username, config.ui.password);

  await expect(page).toHaveURL(/\/inventory\.html$/);
  await ui.expectText(inventory.title, 'Products');
  await ui.expectHidden(login.error);
});

test('a wrong password leaves the user on the login screen', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.signIn(config.ui.username, `${config.ui.password}-incorrect`);

  await expect(page).toHaveURL(/\/$/);
  await ui.expectText(login.error, /Username and password do not match/);
  await ui.expectVisible(login.submit);
});

test('opening the inventory without a session redirects to login', async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  await inventory.open();

  await expect(page).toHaveURL(/\/$/);
  await ui.expectText(login.error, /You can only access '\/inventory\.html' when you are logged in/);
  await ui.expectHidden(inventory.title);
});
