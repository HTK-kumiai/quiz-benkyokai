#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
QUESTION_BANK_DIR="$PROJECT_ROOT/public/data/question-bank"

TARGET="${1:-$QUESTION_BANK_DIR}"

node - "$TARGET" <<'NODE'
const fs = require("fs");
const path = require("path");

const target = process.argv[2];
const requiredFields = ["id", "level", "year", "question", "reading", "translation", "image", "answer", "explanation"];
const allowedLevels = new Set(["shokyu", "senmonkyu"]);
const allowedAnswers = new Set(["○", "×"]);

function collectJsonFiles(inputPath) {
  const stat = fs.statSync(inputPath);
  if (stat.isFile()) return [inputPath];
  const manifestPath = path.join(inputPath, "categories.json");
  if (fs.existsSync(manifestPath)) {
    const categories = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    if (!Array.isArray(categories) || !categories.length) throw new Error("Manifest kategori kosong");
    return categories.map((category) => path.join(inputPath, category.filename));
  }
  return fs.readdirSync(inputPath)
    .filter((name) => !name.startsWith(".") && name.endsWith(".json") && name !== "categories.json")
    .map((name) => path.join(inputPath, name));
}

function validateQuestionFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);
  const errors = [];

  if (!Array.isArray(data)) {
    errors.push("root JSON harus array");
    return errors;
  }

  const seenIds = new Set();
  data.forEach((item, index) => {
    const label = `item #${index + 1}`;
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
      errors.push(`${label}: harus object`);
      return;
    }

    for (const field of requiredFields) {
      if (!(field in item)) {
        errors.push(`${label}: field "${field}" tidak ada`);
      }
    }

    if (!Number.isInteger(item.id) || item.id <= 0) {
      errors.push(`${label}: id harus integer > 0`);
    } else if (seenIds.has(item.id)) {
      errors.push(`${label}: id duplikat ${item.id}`);
    } else {
      seenIds.add(item.id);
    }

    if (!allowedLevels.has(item.level)) {
      errors.push(`${label}: level harus shokyu atau senmonkyu`);
    }

    if (!Number.isInteger(item.year) || item.year < 2000 || item.year > 2100) {
      errors.push(`${label}: year harus integer 2000-2100`);
    }

    if (typeof item.question !== "string" || item.question.trim() === "") {
      errors.push(`${label}: question wajib string non-kosong`);
    }

    if (typeof item.reading !== "string") {
      errors.push(`${label}: reading harus string`);
    }

    if (typeof item.translation !== "string") {
      errors.push(`${label}: translation harus string`);
    }

    if (typeof item.image !== "string") {
      errors.push(`${label}: image harus string`);
    }

    if (!allowedAnswers.has(item.answer)) {
      errors.push(`${label}: answer harus ○ atau ×`);
    }

    if (typeof item.explanation !== "string") {
      errors.push(`${label}: explanation harus string`);
    }
  });

  return errors;
}

const files = collectJsonFiles(target);
let totalErrors = 0;

for (const file of files) {
  const errors = validateQuestionFile(file);
  if (errors.length === 0) {
    console.log(`OK  ${file}`);
    continue;
  }
  totalErrors += errors.length;
  console.log(`ERR ${file}`);
  for (const error of errors) {
    console.log(`  - ${error}`);
  }
}

if (totalErrors > 0) {
  process.exitCode = 1;
}
NODE
