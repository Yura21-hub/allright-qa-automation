cd "$(dirname "${BASH_SOURCE[0]}")/.."
version="$(tr -d '[:space:]' < .nvmrc)"
if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo '.nvmrc must specify an exact Node.js version.' >&2
  exit 1
fi

case "$(uname -m)" in
  x86_64|amd64) arch=x64 ;;
  arm64|aarch64) arch=arm64 ;;
  *) echo "Unsupported CPU architecture: $(uname -m)" >&2; exit 1 ;;
esac

distribution="node-v$version-$platform-$arch"
runtime="$PWD/.devenv/$distribution"
case "$platform" in
  win) extension=zip; bin="$runtime"; node_executable=node.exe ;;
  darwin) extension=tar.gz; bin="$runtime/bin"; node_executable=node ;;
  linux) extension=tar.xz; bin="$runtime/bin"; node_executable=node ;;
esac

if ! command -v node >/dev/null || ! command -v npm >/dev/null || [[ "$(node -v)" != "v$version" ]]; then
  if [[ ! -x "$bin/$node_executable" ]]; then
    mkdir -p "$PWD/.devenv"
    temp="$(mktemp -d "$PWD/.devenv/download.XXXXXXXX")"
    trap 'rm -rf "$temp"' EXIT
    archive="$distribution.$extension"
    release="https://nodejs.org/dist/v$version"
    echo "Downloading Node.js v$version for $platform-$arch"
    curl --fail --silent --show-error --location "$release/$archive" -o "$temp/$archive"
    curl --fail --silent --show-error --location "$release/SHASUMS256.txt" -o "$temp/SHASUMS256.txt"
    (
      cd "$temp"
      awk -v file="$archive" '$2 == file { print; found = 1 } END { if (!found) exit 1 }' SHASUMS256.txt > release.sha256
      if [[ "$platform" == darwin ]]; then
        shasum -a 256 -c release.sha256
      else
        sha256sum -c release.sha256
      fi
      if [[ "$platform" == win ]]; then
        unzip -q "$archive"
      else
        tar -xf "$archive"
      fi
    )
    mv "$temp/$distribution" "$runtime"
  fi
  export PATH="$bin:$PATH"
fi

printf 'Node.js %s, npm %s\n' "$(node -v)" "$(npm -v)"
npm ci
if [[ "$platform" == linux ]]; then
  npm run setup:linux
else
  npm run setup
fi
npm test
