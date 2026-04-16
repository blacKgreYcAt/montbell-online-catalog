#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import warnings
import sys
warnings.filterwarnings('ignore')

# Set stdout encoding to UTF-8
if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from openpyxl import load_workbook

file_path = '27SS 正式_ 工作本連結資料27SS 資料檔.xlsx'

try:
    wb = load_workbook(file_path, data_only=False)
    sheets = wb.sheetnames
    print("Sheets found:", sheets)

    for sheet_name in sheets:
        ws = wb[sheet_name]
        print(f"\n{'='*100}")
        print(f"Sheet: {sheet_name}")
        print(f"Max Row: {ws.max_row}, Max Column: {ws.max_column}")

        # Get headers
        headers = []
        for col_idx, cell in enumerate(ws[1], 1):
            val = cell.value
            headers.append(val)

        print(f"Headers ({len(headers)}):")
        for i, h in enumerate(headers):
            print(f"  {i+1}. {h}")

        # Show first 5 rows with data
        print(f"\nFirst 5 data rows:")
        row_count = 0
        for row_idx, row in enumerate(ws.iter_rows(min_row=2, values_only=True), start=2):
            if row_count < 5:
                print(f"Row {row_idx}: {row}")
                row_count += 1
            else:
                break

        print(f"\nTotal rows in sheet: {ws.max_row}")

except Exception as e:
    import traceback
    print(f"Error: {e}")
    traceback.print_exc()
