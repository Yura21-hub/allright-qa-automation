# Generate a Playwright test from a Markdown case

Set up the project's Node.js dependencies and Chromium first. This pipeline also needs an authenticated [Codex CLI](https://developers.openai.com/codex/cli/) executable on PATH. Set `CODEX_BIN` to its full path if your installation uses a different executable location.

```bash
npm run generate:test -- bonus/examples/login.md
```

The script passes the Markdown steps, expected result, and `AGENTS.md` to a headless Codex call. Codex reads the existing Page Objects with a read-only sandbox. The script saves the returned TypeScript under `bonus/generated/` and runs that file using the separate Chromium project. The exit code is nonzero if generation or execution fails. The file remains available for review on a test failure. Move or remove a previously generated file before regenerating the same input.

Use trusted test cases and review the resulting source before sharing it. Generated tests run locally with the normal Playwright runner. The push workflow continues to run the 14 main tests.

## Recorded examples

The linked specs are the original agent outputs moved into the examples directory for review. All three passed on their first execution against the public SauceDemo. The content of the generated specs was preserved.

| Case | Input | Initial output | First run | Manual edits | Final result |
| --- | --- | --- | --- | --- | --- |
| Login | [Markdown](examples/login.md) | [Playwright spec](examples/login.spec.ts) | 1 passed | None | Passed |
| Sort by price | [Markdown](examples/sorting.md) | [Playwright spec](examples/sorting.spec.ts) | 1 passed | None | Passed |
| Required postal code | [Markdown](examples/checkout-validation.md) | [Playwright spec](examples/checkout-validation.spec.ts) | 1 passed | None | Passed |

Run the recorded outputs without asking the agent to regenerate them.

```bash
npm run test:generated
```
