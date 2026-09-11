#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

show_usage() {
  cat <<'EOF'
Usage:
  ./question-builder.sh [file.json]

Contoh:
  ./question-builder.sh ../public/data/question-bank/questions-sozai-kako.json

Fitur:
  1. Tambah soal baru
  2. Lengkapi romaji/terjemahan soal yang belum lengkap

Catatan:
  - Terjemahan disimpan di field `translation`
  - Alasan tetap bisa ditambahkan nanti di field `explanation`
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  show_usage
  exit 0
fi

TARGET_FILE="${1:-$SCRIPT_DIR/../public/data/question-bank/questions-sozai-kako.json}"

if [[ "$TARGET_FILE" != /* ]]; then
  TARGET_FILE="$SCRIPT_DIR/$TARGET_FILE"
fi

if [[ ! -f "$TARGET_FILE" ]]; then
  echo "File JSON tidak ditemukan: $TARGET_FILE" >&2
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 tidak tersedia di sistem." >&2
  exit 1
fi

prompt_required() {
  local label="$1"
  local value=""

  while true; do
    read -r -p "$label: " value
    if [[ -n "$value" ]]; then
      printf '%s\n' "$value"
      return 0
    fi
    echo "Input tidak boleh kosong."
  done
}

prompt_optional() {
  local label="$1"
  local value=""
  read -r -p "$label: " value
  printf '%s\n' "$value"
}

show_menu() {
  echo
  echo "Pilih aksi:"
  echo "1) Tambah soal baru"
  echo "2) Lengkapi romaji dan terjemahan"
  echo "3) Keluar"
}

run_add_question() {
  echo
  echo "Tambah soal baru"

  local question
  local reading
  local translation
  local level
  local year
  local answer
  local image

  question="$(prompt_required "Soal bahasa Jepang")"
  reading="$(prompt_required "Romaji")"
  translation="$(prompt_required "Terjemahan Indonesia")"
  level="$(prompt_optional "Level [default: shokyu]")"
  year="$(prompt_optional "Tahun [default: $(date +%Y)]")"
  answer="$(prompt_optional "Jawaban [opsional, mis. ○ / ×]")"
  image="$(prompt_optional "Path gambar [opsional]")"

  if [[ -z "$level" ]]; then
    level="shokyu"
  fi

  if [[ -z "$year" ]]; then
    year="$(date +%Y)"
  fi

  python3 - "$TARGET_FILE" "$question" "$reading" "$translation" "$level" "$year" "$answer" "$image" <<'PY'
import json
import sys
from pathlib import Path

path = Path(sys.argv[1])
question = sys.argv[2]
reading = sys.argv[3]
translation = sys.argv[4]
level = sys.argv[5] or "shokyu"
year_raw = sys.argv[6]
answer = sys.argv[7]
image = sys.argv[8]

with path.open("r", encoding="utf-8") as f:
    data = json.load(f)

if not isinstance(data, list):
    raise SystemExit("Format JSON harus berupa array/list.")

existing_ids = [item.get("id", 0) for item in data if isinstance(item, dict)]
next_id = max(existing_ids, default=0) + 1

try:
    year = int(year_raw)
except ValueError:
    raise SystemExit("Tahun harus berupa angka.")

record = {
    "id": next_id,
    "level": level,
    "year": year,
    "question": question,
    "reading": reading,
    "translation": translation,
    "image": image,
    "answer": answer,
    "explanation": "",
}

data.append(record)

with path.open("w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write("\n")

print(f"Soal baru ditambahkan dengan id {next_id}.")
PY
}

run_fill_missing() {
  echo
  echo "Lengkapi romaji dan terjemahan"

  python3 - "$TARGET_FILE" <<'PY'
import json
import sys
from pathlib import Path

path = Path(sys.argv[1])

with path.open("r", encoding="utf-8") as f:
    data = json.load(f)

if not isinstance(data, list):
    raise SystemExit("Format JSON harus berupa array/list.")

changed = 0

def prompt_required(label: str) -> str:
    while True:
        try:
            value = input(label).strip()
        except EOFError:
            return "__QUIT__"
        if value:
            return value
        print("Input tidak boleh kosong.")

def prompt_translation(current: str, fallback: str) -> str:
    while True:
        try:
            value = input(
                "Terjemahan Indonesia [Enter=pakai lama, s=lewati, q=simpan lalu keluar]: "
            ).strip()
        except EOFError:
            return "__QUIT__"

        lowered = value.lower()
        if lowered == "q":
            return "__QUIT__"
        if lowered == "s":
            return current
        if value:
            return value
        if fallback:
            return fallback
        print("Input tidak boleh kosong.")

for item in data:
    if not isinstance(item, dict):
        continue

    question = (item.get("question") or "").strip()
    reading = (item.get("reading") or "").strip()
    translation = (item.get("translation") or "").strip()
    explanation = (item.get("explanation") or "").strip()

    if not question:
        continue

    if reading and translation:
        continue

    print()
    print(f"ID {item.get('id', '-')}")
    print(f"Soal: {question}")

    if not reading:
        new_reading = prompt_required("Romaji: ")
        if new_reading == "__QUIT__":
            break
        item["reading"] = new_reading
    else:
        print(f"Romaji: {reading}")

    if not translation:
        if explanation:
            print(f"Terjemahan lama di explanation: {explanation}")
            new_translation = prompt_translation(translation, explanation)
        else:
            new_translation = prompt_translation(translation, "")

        if new_translation == "__QUIT__":
            break

        if new_translation:
            item["translation"] = new_translation
        else:
            continue
    else:
        print(f"Terjemahan Indonesia: {translation}")

    changed += 1

if changed == 0:
    print("Tidak ada soal yang perlu dilengkapi.")
    raise SystemExit(0)

with path.open("w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write("\n")

print()
print(f"Selesai. {changed} soal diperbarui.")
PY
}

while true; do
  echo
  echo "File aktif: $TARGET_FILE"
  show_menu
  read -r -p "Masukkan pilihan [1-3]: " choice

  case "$choice" in
    1)
      run_add_question
      ;;
    2)
      run_fill_missing
      ;;
    3)
      echo "Keluar."
      exit 0
      ;;
    *)
      echo "Pilihan tidak valid."
      ;;
  esac
done
