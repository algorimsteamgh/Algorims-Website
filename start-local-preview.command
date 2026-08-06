#!/bin/bash
cd "$(dirname "$0")"
echo "Starting local preview server..."
echo "Open http://localhost:4173 in your browser."
echo "Press Ctrl+C in this window to stop the server."
python3 -m http.server 4173
