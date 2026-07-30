set dotenv-load := true

# Default: start the dev playground
run port="5173":
  just stop {{port}}
  pnpm exec vite dev --port {{port}} --host

# Build all packages
build:
  pnpm build

# Typecheck all packages
typecheck:
  pnpm -r typecheck

# Lint all packages
lint:
  pnpm -r lint

# Run e2e tests
test:
  pnpm test:e2e

# Run e2e tests in watch mode
test-watch:
  pnpm exec vitest watch

# Kill any dev server on the port (SIGTERM first, SIGKILL as fallback)
stop port="5173":
  #!/usr/bin/env bash
  set -euo pipefail
  pids=""
  if command -v ss >/dev/null 2>&1; then
    pids=$(ss -tlnp "sport = :{{port}}" 2>/dev/null | grep -oP 'pid=\K[0-9]+' || true)
  fi
  if [ -z "${pids}" ] && command -v lsof >/dev/null 2>&1; then
    pids=$(lsof -nP -iTCP:{{port}} -sTCP:LISTEN -t 2>/dev/null || true)
  fi
  if [ -n "${pids}" ]; then
    echo "Killing dev server on port {{port}}:"
    echo "${pids}" | while read -r pid; do
      name=$(ps -p "${pid}" -o comm= 2>/dev/null || echo "unknown")
      echo "  → SIGTERM ${name} (${pid})"
      kill "${pid}" 2>/dev/null || true
    done
    sleep 0.5
    if command -v ss >/dev/null 2>&1; then
      pids2=$(ss -tlnp "sport = :{{port}}" 2>/dev/null | grep -oP 'pid=\K[0-9]+' || true)
    else
      pids2=""
    fi
    if [ -n "${pids2}" ]; then
      echo "${pids2}" | while read -r pid; do
        echo "  → SIGKILL pid ${pid}"
        kill -9 "${pid}" 2>/dev/null || true
      done
    fi
    echo "Port {{port}} is free."
  else
    echo "Port {{port}} is already free."
  fi

# Full dev cycle: stop, build, then run
dev: stop build run

# Show what's available
recipes:
  @echo "trellis-ui recipes:"
  @echo ""
  @echo "  just run              start dev playground on :5173"
  @echo "  just run --port 3000  start dev playground on a custom port"
  @echo "  just build            build all packages"
  @echo "  just typecheck        typecheck all packages"
  @echo "  just lint             lint all packages"
  @echo "  just test             run e2e tests"
  @echo "  just test-watch       run e2e tests in watch mode"
  @echo "  just stop             kill dev server on default port"
  @echo "  just dev              clean build + run"

# Open the playground in the browser (macOS)
open:
  open "http://localhost:5173/"

# Open the playground in the browser (Cross-platform wrapper)
browse:
  #!/usr/bin/env bash
  set -euo pipefail
  url="http://localhost:5173/"
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "${url}"
  elif command -v open >/dev/null 2>&1; then
    open "${url}"
  elif command -v start >/dev/null 2>&1; then
    start "${url}"
  else
    echo "Open ${url} in your browser"
  fi