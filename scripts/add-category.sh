#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MANIFEST_PATH="$PROJECT_ROOT/public/data/question-bank/categories.json"
QUESTION_BANK_DIR="$PROJECT_ROOT/public/data/question-bank"

usage() {
  cat <<'EOF'
Usage:
  ./scripts/add-category.sh <category-id> "<judul-jepang>" "<subtitle>" "<deskripsi>" "<icon>"

Contoh:
  ./scripts/add-category.sh nougyou "農業" "Nougyou (Pertanian)" "Latihan dasar bidang pertanian." "🚜"

Hasil:
  - Menambah kategori ke public/data/question-bank/categories.json
  - Membuat file soal baru public/data/question-bank/questions-<category-id>.json
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
TITLE="$2"
SUBTITLE="$3"
DESCRIPTION="$4"
ICON="$5"
FILENAME="questions-$CATEGORY_ID.json"
QUESTION_FILE="$QUESTION_BANK_DIR/$FILENAME"

if [[ ! "$CATEGORY_ID" =~ ^[a-z0-9-]+$ ]]; then
  echo "category-id hanya boleh huruf kecil, angka, dan tanda hubung." >&2
  exit 1
fi

if [[ ! -f "$MANIFEST_PATH" ]]; then
  echo "Manifest kategori tidak ditemukan: $MANIFEST_PATH" >&2
  exit 1
fi

if [[ -e "$QUESTION_FILE" ]]; then
  echo "File soal sudah ada: $QUESTION_FILE" >&2
  exit 1
fi

node - "$MANIFEST_PATH" "$CATEGORY_ID" "$TITLE" "$SUBTITLE" "$DESCRIPTION" "$ICON" "$FILENAME" <<'NODE'
const fs = require("fs");

const [manifestPath, id, title, subtitle, description, icon, filename] = process.argv.slice(2);
const data = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

if (!Array.isArray(data)) {
  throw new Error("Manifest kategori harus berupa array.");
}

if (data.some((item) => item.id === id)) {
  throw new Error(`Kategori dengan id "${id}" sudah ada.`);
}

data.push({
  id,
  title,
  name: `${icon} ${title} (${subtitle.split(" ")[0] || id})`,
  shortName: `${icon} ${title}`,
  subtitle,
  description,
  icon,
  filename,
});

fs.writeFileSync(manifestPath, JSON.stringify(data, null, 2) + "\n");
NODE

printf '[]\n' > "$QUESTION_FILE"

cat <<EOF
Kategori baru berhasil dibuat.

Manifest:
  $MANIFEST_PATH

File soal:
  $QUESTION_FILE

Langkah berikutnya:
1. Isi file soal JSON dengan daftar soal.
2. Jika ingin nilai awal muncul, tambahkan soal minimal 1 item.
3. Deploy ulang ke GitHub Pages atau server.
EOF
