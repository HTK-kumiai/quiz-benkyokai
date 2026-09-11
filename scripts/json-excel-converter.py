#!/usr/bin/env python3
"""json-excel-converter.py

A simple command‑line utility to convert between JSON and Excel (XLSX).

Usage:
  python json-excel-converter.py json2excel <input.json> <output.xlsx>
  python json-excel-converter.py excel2json <input.xlsx> <output.json>

The script relies on `pandas` and `openpyxl` (for Excel I/O).
"""

import argparse
import json
import sys
from pathlib import Path

import pandas as pd


def json_to_excel(input_path: Path, output_path: Path) -> None:
    """Read a JSON file and write it to an Excel file.

    The JSON is expected to be either a list of objects or a single object.
    For a single object we wrap it in a list so that the resulting Excel
    sheet always has a tabular representation.
    """
    with input_path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    if isinstance(data, list):
        df = pd.json_normalize(data)
    else:
        df = pd.json_normalize([data])
    df.to_excel(output_path, index=False)


def excel_to_json(input_path: Path, output_path: Path) -> None:
    """Read an Excel file and write it to a JSON file.

    The Excel sheet is read into a DataFrame and then exported as a list of
    dictionaries (one per row). This matches the structure produced by
    ``json_to_excel``.
    """
    df = pd.read_excel(input_path)
    df = df.fillna("").astype(str)
    data = df.to_dict(orient="records")
    df = df.fillna("")
    data = df.to_dict(orient="records")
    with output_path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def main() -> int:
    parser = argparse.ArgumentParser(description="Convert between JSON and Excel (XLSX).")
    subparsers = parser.add_subparsers(dest="command", required=True)

    p_json2excel = subparsers.add_parser("json2excel", help="Convert JSON → Excel")
    p_json2excel.add_argument("input", type=Path, help="Path to the input JSON file")
    p_json2excel.add_argument("output", type=Path, help="Path to the output XLSX file")

    p_excel2json = subparsers.add_parser("excel2json", help="Convert Excel → JSON")
    p_excel2json.add_argument("input", type=Path, help="Path to the input XLSX file")
    p_excel2json.add_argument("output", type=Path, help="Path to the output JSON file")

    args = parser.parse_args()
    try:
        if args.command == "json2excel":
            json_to_excel(args.input, args.output)
        elif args.command == "excel2json":
            excel_to_json(args.input, args.output)
        else:
            parser.error("Unknown command")
    except Exception as e:
        sys.stderr.write(f"Error: {e}\n")
        return 1
    return 0

if __name__ == "__main__":
    sys.exit(main())
