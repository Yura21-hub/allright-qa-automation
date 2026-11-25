# All Right QA Automation Take-Home

Playwright coverage for [SauceDemo](https://www.saucedemo.com/) and [Restful Booker](https://restful-booker.herokuapp.com/apidoc/). The default config uses public demo credentials. A normal run needs internet access and should report **14 passed**.

## Automated setup

Clone the repository or download and extract its ZIP from GitHub. On Windows, install [Git for Windows](https://gitforwindows.org/) to get Git Bash.

```bash
git clone https://github.com/Yura21-hub/allright-qa-automation.git
cd allright-qa-automation
```

Run the command for your OS from the project root.

| OS | Run | Prerequisites |
| --- | --- | --- |
| Windows | `bash devenv/windows.sh` | Windows 11 and Git Bash from Git for Windows, including its standard command-line tools. |
| Linux | `bash devenv/linux.sh` | Ubuntu 22.04 or 24.04, or Debian 12 or 13, with Bash, curl, and tar with xz support. Playwright may request sudo for system packages. |
| macOS | `bash devenv/macos.sh` | Terminal on a [Playwright-supported macOS version](https://playwright.dev/docs/intro#system-requirements). Run from the cloned or extracted directory. |

The scripts provision the pinned Node.js and its bundled npm when needed, install the locked npm packages, install Chromium and run both test projects. The Linux script also installs Chromium's OS packages. Downloaded runtimes are kept under `.devenv/` in the checkout. The browser is kept in the Playwright cache. A successful run exits with code 0. The HTML report is at `playwright-report/index.html`.

The automated setup passed on macOS Apple Silicon from a fresh checkout and an empty Playwright browser cache, on Ubuntu 24.04 ARM64 in a fresh container, and on Windows Git Bash in GitHub Actions. Each run passed all 14 tests. See the [green setup matrix and its three reports](https://github.com/Yura21-hub/allright-qa-automation/actions/runs/45611164242). CI pins Ubuntu 24.04 because Playwright 1.59.1 cannot install Chromium on Ubuntu 26.04.

## Manual setup

npm is bundled with Node.js. Use the exact release recorded in [`.nvmrc`](.nvmrc) to match CI.

### macOS

1. Install [Homebrew](https://brew.sh/) using the Terminal command on its official site. Run the `brew shellenv` commands that the installer prints under **Next steps**.
2. Install Git and the Node.js 24 formula. Add the formula's bin directory to your zsh startup file so the shell can find Node.js and npm.

   ```bash
   brew install git node@24
   printf '\nexport PATH="$(brew --prefix node@24)/bin:$PATH"\n' >> ~/.zshrc
   source ~/.zshrc
   ```

3. Check `git --version`, `node --version`, and `npm --version`. Homebrew tracks the current release in the 24 series. For the exact project release, use the [official macOS installer](https://nodejs.org/dist/v24.14.0/node-v24.14.0.pkg) and ensure its `node` is first on your PATH. If Homebrew is unavailable on your macOS version, use that installer and the [official Git installation instructions](https://git-scm.com/install/mac).

### Windows

1. Install [Git for Windows](https://gitforwindows.org/).
2. Open the [pinned Node.js release directory](https://nodejs.org/dist/v24.14.0/) and choose the Windows `.msi` for your architecture. Keep the npm and PATH options enabled.
3. Open a new PowerShell window and run `git --version`, `node --version`, and `npm --version`. If PowerShell blocks `npm.ps1`, use `npm.cmd` in place of `npm` in the commands below.

### Linux

1. On supported Ubuntu or Debian releases, install the tools needed to clone and fetch Node.js.

   ```bash
   sudo apt-get update
   sudo apt-get install -y git curl ca-certificates xz-utils
   ```

2. Follow the [official nvm installation instructions](https://github.com/nvm-sh/nvm#installing-and-updating), then reopen your shell.
3. Clone the repository and enter the project directory. Run `nvm install` followed by `nvm use`. nvm reads the version from `.nvmrc`. Check `git --version`, `node --version`, and `npm --version`.
4. Use `npm run setup:linux` in place of `npm run setup` below if Chromium's system packages need to be installed.

### Install project dependencies and run

Clone the repository as shown above, if you have not already, and run the following from the root.

```bash
npm ci
npm run setup
npm test
```

| Component | Version | Purpose |
| --- | --- | --- |
| Node.js | 24.14.0 | Runtime pinned in `.nvmrc`. |
| npm | 11.9.0 | Package manager bundled with the pinned Node.js release. |
| `@playwright/test` | 1.59.1 | Browser automation, HTTP requests, assertions, and reporting. |
| `typescript` | 5.9.3 | Static type checking. |
| `@types/node` | 24.10.1 | Types for the Node.js APIs used by the project. |

Run `npm run test:ui` or `npm run test:api` for an individual project, `npm run typecheck` for static checking, and `npm run report` to open the latest HTML report. The API-only project can run after `npm ci` without installing Chromium.

On GitHub, open **Actions → Playwright tests → a run → Artifacts**, download `playwright-report`, and extract it. From the project, run `npm run report -- /path/to/extracted/report` using the directory containing `index.html`. Failed UI tests include a screenshot and trace when available. Every push runs the suite on Ubuntu. Use **Run workflow** to start the same job manually. Enable **Also verify the Windows, Linux, and macOS setup scripts** to run the first-install check and generate an additional report for each OS.

To override a demo value, create an optional ignored `config/local.json`. The file can contain a partial `ui` or `api` object with `baseURL`, `username`, or `password`. The repository only contains the published credentials for the two demo services.

## Repository map

| Path | Purpose |
| --- | --- |
| `tests/ui/login.spec.ts`, `tests/ui/shopping.spec.ts` | Ten login and shopping scenarios. |
| `tests/ui/pages/`, `tests/ui/fixtures.ts` | Page Objects and the isolated signed-in fixture. |
| `tests/api/booking.spec.ts` | Four Restful Booker scenarios. |
| `tests/api/booker-client.ts`, `booking-data.ts`, `fixtures.ts` in `tests/api/` | HTTP requests, unique booking data, and cleanup. |
| `tests/support/` | Shared UI and API assertions and config loading. |
| `config/`, `playwright.config.ts` | Demo targets, optional overrides, and Playwright projects. |
| `devenv/` | Automated setup launchers and common bootstrap logic. |
| `.github/workflows/playwright.yml` | Push-triggered tests, type checking, and report upload. |
| `docs/ui-coverage.md`, `docs/api-coverage.md` | Coverage matrices, gaps, and follow-up scenarios. |
| `AGENTS.md`, `AI_WORKLOG.md` | Agent instructions, prompts, and review findings. |

## Coverage and limits

The UI suite covers login, catalog, product details, ascending price sorting, cart changes, checkout, and three access or validation cases in Chromium with `standard_user`. Alternate users, browser parity, accessibility, and visual regression are outside this suite. See [UI coverage](docs/ui-coverage.md).

The API suite covers the authenticated booking lifecycle and three credential or authorization failures. The service is shared and may change or reset state during a run. Tests isolate their records and only clean up bookings they own. Contract coverage for all operations, malformed input, and alternative formats is tracked in [API coverage](docs/api-coverage.md).

## Bug reports

### RB-1 Missing first name returns HTTP 500

| Field | Details |
| --- | --- |
| Environment | Public Restful Booker demo, JSON API. |
| Expected | A client error (HTTP `4xx`) with a validation message that identifies the missing required `firstname`. The API docs do not define a specific missing-field status. |
| Actual | HTTP `500` with the plain-text body `Internal Server Error`. Reproduced twice. |

1. Send `POST /booking` with `Content-Type: application/json` and `Accept: application/json`.
2. Use the following payload. It includes the other booking fields and omits `firstname`.
3. Inspect the response status and body.

```json
{
  "lastname": "QA-missing-firstname",
  "totalprice": 125,
  "depositpaid": true,
  "bookingdates": { "checkin": "2030-06-10", "checkout": "2030-06-13" },
  "additionalneeds": "Breakfast"
}
```

The [API reference](https://restful-booker.herokuapp.com/apidoc/) lists `firstname` for create requests. The [create route](https://github.com/mwinteringham/restful-booker/blob/main/routes/index.js#L290-L311) sends HTTP `500` when validation fails.

### SD-1 Checkout confirms an empty order

| Field | Details |
| --- | --- |
| Environment | Public SauceDemo, Chromium, `standard_user`, fresh browser context. |
| Expected | Checkout is blocked because the cart is empty, with a message that asks the user to add an item. |
| Actual | Checkout accepts the empty cart and displays **Thank you for your order!** after Finish. |

1. Sign in as `standard_user` in a fresh browser context.
2. Open the cart without adding a product, then select **Checkout**.
3. Fill in the required customer fields and select **Continue**.
4. Select **Finish** on the overview and observe the confirmation.
