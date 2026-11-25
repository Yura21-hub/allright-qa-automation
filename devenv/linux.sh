#!/usr/bin/env bash
set -euo pipefail
if [[ "$(uname -s)" != Linux ]]; then
  echo 'Run this script on a Playwright-supported Ubuntu or Debian installation.' >&2
  exit 1
fi
platform=linux
source "$(dirname "${BASH_SOURCE[0]}")/bootstrap.bash"
