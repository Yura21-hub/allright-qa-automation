# Agent instructions

Keep changes scoped. State assumptions and raise material ambiguities. Use stable roles or `data-test` locators, Playwright web-first assertions, and independent test data. Verify the live API contract before asserting status codes. Only mutate bookings created by the current test and clean them up in the fixture. Keep actual credentials in ignored local configuration and record verified AI corrections as they occur.

## Repository map

| Path | Where to work |
| --- | --- |
| `tests/ui/*.spec.ts` | Add UI scenarios and scenario-specific checks. |
| `tests/ui/pages/` | Add selectors or UI actions to the relevant Page Object. |
| `tests/ui/fixtures.ts` | Maintain the shared signed-in browser fixture. |
| `tests/api/booking.spec.ts` | Add booking scenarios and scenario-specific API checks. |
| `tests/api/booker-client.ts`, `tests/api/fixtures.ts` | Change API requests, booking data, and ownership-aware cleanup. |
| `tests/support/` | Add reusable assertions or config loading. |
| `config/` | Maintain public demo defaults and optional ignored local overrides. |
| `devenv/` | Maintain automated first-run scripts and shared bootstrap logic. |
| `bonus/` | Maintain the test generator and examples. Run `npm run test:generated` to replay the recorded specs. |
| `.github/workflows/` | Maintain push-triggered tests and report artifacts. |
| `docs/ui-coverage.md`, `docs/api-coverage.md` | Record coverage, open questions, and follow-up cases. |
| `README.md`, `AI_WORKLOG.md` | Maintain reviewer setup instructions and the factual AI review log. |

Run `npm run typecheck` and the relevant `npm run test:ui` or `npm run test:api` after changes. Use `npm test` for the full suite.
