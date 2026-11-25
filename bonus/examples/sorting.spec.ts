import { expect, test } from '../../tests/ui/fixtures';

test('sorts all inventory products from lowest to highest price', async ({ inventory }) => {
  const names = inventory.items.getByTestId('inventory-item-name');

  await expect(inventory.prices.first()).toBeVisible();
  const originalNames = await names.allTextContents();
  const originalPrices = await inventory.prices.allTextContents();

  expect(originalPrices.length).toBeGreaterThan(1);
  expect(originalPrices).toHaveLength(originalNames.length);

  const sortedPrices = [...originalPrices].sort(
    (left, right) => Number(left.slice(1)) - Number(right.slice(1)),
  );

  await inventory.sortByLowestPrice();

  await expect(inventory.sorting).toHaveValue('lohi');
  await expect(inventory.prices).toHaveText(sortedPrices);
  await expect.poll(async () => (await names.allTextContents()).sort()).toEqual(originalNames.sort());
});
