#!/usr/bin/env bash
set -euo pipefail
case "$(uname -s)" in
  MINGW*|MSYS*) ;;
  *) echo 'Run this script in Git Bash on Windows.' >&2; exit 1 ;;
esac
platform=win
source "$(dirname "${BASH_SOURCE[0]}")/bootstrap.bash"
