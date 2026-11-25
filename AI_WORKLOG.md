# AI worklog

## Agent and key prompts

Codex implemented the assignment using the project instructions in [AGENTS.md](AGENTS.md). The prompts below summarize the implementation brief.

- Use Page Objects for login, catalog, product details, cart, and checkout, with an isolated browser context and shared sign-in fixture.
- Add general-purpose UI and API assertions, keeping scenario-specific checks in the specs.
- Verify the authenticated booking lifecycle and three rejection cases, using only records created by the current test.
- Add three OS-specific Bash entry points that install dependencies and run the full suite, and document a separate manual path.

## Review findings and corrections

| Agent mistake | How it was caught | Correction |
| --- | --- | --- |
| Page Objects initialized locators from a constructor parameter property in class field initializers. | TypeScript emitted TS2729 under the ES2022 target for all five Page Objects. | Declare the locator types and initialize them inside the constructors. |
| Cart removal matched the text of the entire card by substring. | Reviewing the selector showed that two product names with a shared substring could match the same action. | Match the product-name locator exactly before resolving its Remove button. |
| The field-count helper relied on a broad object matcher before calling `Object.keys`. | Reviewing malformed JSON types showed that the helper could produce a generic runtime error for a null response. | Reject null, arrays, and non-objects explicitly before counting keys. |
| Product details relied on the URL change to indicate that the new view was rendered. | The live UI run failed with a strict-mode violation matching six catalog labels. The trace later showed the single details label and its Back to products button. | Wait for the detail-only Back to products control before asserting the reused name and price locators. |
| The workflow ran on `ubuntu-latest` without checking that the image matched the pinned Playwright release. | The hosted Linux setup job selected Ubuntu 26.04, and Playwright 1.59.1 explicitly refused to install Chromium on it. | Pin the Ubuntu runner to 24.04 in both the push job and automated setup matrix. |
