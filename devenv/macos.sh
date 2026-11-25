#!/usr/bin/env bash
set -euo pipefail
if [[ "$(uname -s)" != Darwin ]]; then
  echo 'Run this script in Terminal on macOS.' >&2
  exit 1
fi
platform=darwin
source "$(dirname "${BASH_SOURCE[0]}")/bootstrap.bash"
