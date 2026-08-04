#!/bin/bash
# Double-click this file in Finder to preview the Algorims website locally.
# It starts a local static file server in this folder and opens the CCA-F page.

cd "$(dirname "$0")"

PORT=8000

# If something is already listening on the port, just reuse it.
if ! lsof -i tcp:$PORT >/dev/null 2>&1; then
  echo "Starting local server on http://localhost:$PORT ..."
  python3 -m http.server "$PORT" >/tmp/algorims-preview.log 2>&1 &
  sleep 1
fi

open "http://localhost:$PORT/cca-f/"

echo ""
echo "Preview running at http://localhost:$PORT/cca-f/"
echo "Close this Terminal window (or run 'killall python3') to stop the server."
