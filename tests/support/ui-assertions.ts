import { expect, type Locator } from '@playwright/test';

export class UiAssertions {
  static expectVisible(locator: Locator) {
    return expect(locator).toBeVisible();
  }

  static expectHidden(locator: Locator) {
    return expect(locator).toBeHidden();
  }

  static expectText(locator: Locator, expected: string | RegExp) {
    return expect(locator).toHaveText(expected);
  }

  static expectValue(locator: Locator, expected: string | RegExp) {
    return expect(locator).toHaveValue(expected);
  }

  static expectCount(locator: Locator, expected: number) {
    return expect(locator).toHaveCount(expected);
  }
}
