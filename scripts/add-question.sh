#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
QUESTION_BANK_DIR="$PROJECT_ROOT/public/data/question-bank"

usage() {
  cat <<'EOF'
Usage:
  ./scripts/add-question.sh <category-id> "<question>" "<reading>" <answer> <year> [level] [explanation] [image]

Contoh:
  ./scripts/add-question.sh nougyou "のうぎょう では あんぜん かくにん が たいせつ です。" "Nougyou dewa anzen kakunin ga taisetsu desu." "○" 2026 shokyu "Benar. Keselamatan kerja penting." ""

Catatan:
  - <answer> harus "○" atau "×"
  - [level] default: shokyu
  - [explanation] default: string kosong
  - [image] default: string kosong
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

if [[ $# -lt 5 ]]; then
  usage
  exit 1
fi

CATEGORY_ID="$1"
QUESTION_TEXT="$2"
READING_TEXT="$3"
ANSWER_VALUE="$4"
YEAR_VALUE="$5"
LEVEL_VALUE="${6:-shokyu}"
EXPLANATION_VALUE="${7:-}"
IMAGE_VALUE="${8:-}"

QUESTION_FILE="$QUESTION_BANK_DIR/questions-$CATEGORY_ID.json"

if [[ ! -f "$QUESTION_FILE" ]]; then
  echo "File soal tidak ditemukan: $QUESTION_FILE" >&2
  exit 1
fi

if [[ "$ANSWER_VALUE" != "○" && "$ANSWER_VALUE" != "×" ]]; then
  echo 'Nilai answer harus "○" atau "×".' >&2
  exit 1
fi

if [[ "$LEVEL_VALUE" != "shokyu" && "$LEVEL_VALUE" != "senmonkyu" ]]; then
  echo 'Level harus "shokyu" atau "senmonkyu".' >&2
  exit 1
fi

if [[ ! "$YEAR_VALUE" =~ ^[0-9]{4}$ ]]; then
  echo "Year harus 4 digit, misalnya 2026." >&2
  exit 1
fi

node - "$QUESTION_FILE" "$QUESTION_TEXT" "$READING_TEXT" "$ANSWER_VALUE" "$YEAR_VALUE" "$LEVEL_VALUE" "$EXPLANATION_VALUE" "$IMAGE_VALUE" <<'NODE'
const fs = require("fs");

const [filePath, question, reading, answer, yearRaw, level, explanation, image] = process.argv.slice(2);
const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

if (!Array.isArray(data)) {
  throw new Error("File soal harus berupa array JSON.");
}

const nextId = data.reduce((maxId, item) => {
  const value = Number(item?.id || 0);
  return Number.isFinite(value) && value > maxId ? value : maxId;
}, 0) + 1;

data.push({
  id: nextId,
  level,
  year: Number(yearRaw),
  question,
  reading,
  image,
  answer,
  explanation,
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
console.log(`Soal baru ditambahkan dengan id ${nextId} ke ${filePath}`);
NODE

