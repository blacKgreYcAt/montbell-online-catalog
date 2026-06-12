#!/usr/bin/env python3
"""
使用 Cloudinary Fetch API 上傳 Google Drive 圖片
"""

import json
import requests
import hashlib
import time

CLOUD_NAME = "dyc0mcbkp"
API_KEY = "712869652458293"
API_SECRET = "7ZsvMcXDgYxzNV5DDpSuluJANXE"

with open('public/imageMapping-internal.json', 'r', encoding='utf-8') as f:
    mapping = json.load(f)

print(f"📦 開始上傳 {len(mapping)} 張圖片到 Cloudinary...")

cloudinary_mapping = {}
failed = []

for idx, (key, file_id) in enumerate(mapping.items(), 1):
    try:
        # Google Drive 公開下載 URL
        url = f"https://drive.google.com/uc?export=view&id={file_id}"

        # Cloudinary Fetch API - 讓 Cloudinary 直接從 URL 抓取
        upload_endpoint = f"https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/fetch"

        params = {
            'file_name': key,
            'folder': 'montbell_fw27',
            'api_key': API_KEY,
        }

        # 計算簽名
        timestamp = str(int(time.time()))
        sig_str = f"api_key={API_KEY}&folder=montbell_fw27&timestamp={timestamp}{API_SECRET}"
        signature = hashlib.sha1(sig_str.encode()).hexdigest()

        data = {
            'url': url,
            'file_name': key,
            'folder': 'montbell_fw27',
            'api_key': API_KEY,
            'timestamp': timestamp,
            'signature': signature,
            'overwrite': True,
        }

        response = requests.post(upload_endpoint, data=data, timeout=30)

        if response.status_code in [200, 201]:
            result = response.json()
            cloudinary_mapping[key] = result['secure_url']
            print(f"✅ {idx:3d}/362 {key}")
        else:
            print(f"❌ {idx:3d}/362 {key} | 狀態: {response.status_code}")
            failed.append((key, response.text[:100]))

    except Exception as e:
        print(f"❌ {idx:3d}/362 {key} | {str(e)[:50]}")
        failed.append((key, str(e)[:100]))

    if idx % 10 == 0:
        time.sleep(2)  # 避免限流

# 保存
with open('public/imageMapping-internal-cloudinary.json', 'w', encoding='utf-8') as f:
    json.dump(cloudinary_mapping, f, ensure_ascii=False, indent=2)

print(f"\n✅ 成功: {len(cloudinary_mapping)}")
print(f"❌ 失敗: {len(failed)}")
print(f"📁 新映射: public/imageMapping-internal-cloudinary.json")
