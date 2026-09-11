#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "Memvalidasi bank soal sebelum deployment Cloudflare Pages..."
bash "$PROJECT_ROOT/scripts/validate-question-bank.sh"
echo "Validasi deployment selesai. Folder public/ siap dipublikasikan."
