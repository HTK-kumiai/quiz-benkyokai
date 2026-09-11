#!/usr/bin/env bash
# Wrapper script for json-excel-converter.py
# Usage:
#   json-excel.sh json2excel <input.json> <output.xlsx>
#   json-excel.sh excel2json <input.xlsx> <output.json>

# Resolve the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_SCRIPT="$SCRIPT_DIR/json-excel-converter.py"

if [[ $# -lt 3 ]]; then
  echo "Usage: $0 {json2excel|excel2json} <input> <output>"
  exit 1
fi

CMD="$1"
INPUT="$2"
OUTPUT="$3"

python3 "$PYTHON_SCRIPT" "$CMD" "$INPUT" "$OUTPUT"
