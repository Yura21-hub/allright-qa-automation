# UI coverage

## Current coverage

| Area | Automated cases | Spec |
| --- | --- | --- |
| Login and access | Standard-user login, bad password, direct access without a session. | [login.spec.ts](../tests/ui/login.spec.ts) |
| Catalog | Product cards, matching name and price on details, ascending price sort of every item. | [shopping.spec.ts](../tests/ui/shopping.spec.ts) |
| Cart | Add two products and remove one, with exact contents and badge updates. | [shopping.spec.ts](../tests/ui/shopping.spec.ts) |
| Checkout | Order totals and confirmation, required postal code. | [shopping.spec.ts](../tests/ui/shopping.spec.ts) |

## Gaps and open requirements

The suite uses Chromium and the standard-user account. Add coverage for other sort options, removal of the last item, state after logout or refresh, remaining form fields and input boundaries once expected behavior is specified. Cross-browser, mobile, accessibility, and visual checks need separate acceptance criteria.

## Observed behavior and discrepancies

The direct inventory route redirects a signed-out visitor to login. The suite expects a required-field error for an empty postal code. The demo also confirms an order from an empty cart. See the [checkout bug report](../README.md#sd-1-checkout-confirms-an-empty-order).

## Expansion criteria

When screen behavior and validation rules are documented, organize tests by feature in login, inventory, cart, and checkout specs. Cover all documented positive, negative, and boundary scenarios, and keep the complete checkout as a separate end-to-end scenario.
