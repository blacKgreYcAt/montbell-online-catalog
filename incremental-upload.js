const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { execSync } = require('child_process');

cloudinary.config({
  cloud_name: 'dyc0mcbkp',
  api_key: '712869652458293',
  api_secret: '7ZsvMcXDgYxzNV5DDpSuluJANXE',
});

const SOURCE_DIR = 'D:\\MB 官網\\FW27原廠資料\\FW27 Workbook PDF 擷取圖';
const MAPPING_FILE = 'public/imageMapping-internal.json';

// 讀取現有映射
const existingMapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
const newMapping = { ...existingMapping };

console.log(`📦 檢查新增/更新的圖片...`);
console.log(`📁 來源目錄: ${SOURCE_DIR}`);

let uploadCount = 0;
let skipCount = 0;

// 遍歷所有商品目錄
const productDirs = fs.readdirSync(SOURCE_DIR).filter(d => {
  return fs.statSync(path.join(SOURCE_DIR, d)).isDirectory();
});

console.log(`📊 找到 ${productDirs.length} 個商品目錄\n`);

(async () => {
  for (const productId of productDirs) {
    const productDir = path.join(SOURCE_DIR, productId);
    const files = fs.readdirSync(productDir).filter(f =>
      f.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    );

    for (const file of files) {
      const filePath = path.join(productDir, file);
      const fileName = file.replace(/\.[^.]+$/, ''); // 移除副檔名
      const key = fileName; // 如: 1101770_BK

      // 檢查是否已存在
      if (existingMapping[key]) {
        skipCount++;
        console.log(`⏭️  ${key} - 已存在，跳過`);
        continue;
      }

      // 新圖片，上傳到 Cloudinary
      try {
        console.log(`⬆️  上傳 ${key}...`);
        const result = await cloudinary.uploader.upload(filePath, {
          resource_type: 'auto',
          folder: 'montbell_fw27',
          public_id: key,
          overwrite: true,
        });

        newMapping[key] = result.secure_url;
        uploadCount++;
        console.log(`✅ ${key} → Cloudinary`);
      } catch (error) {
        console.log(`❌ ${key} 上傳失敗: ${error.message}`);
      }
    }
  }

  // 保存更新的映射
  fs.writeFileSync(
    MAPPING_FILE,
    JSON.stringify(newMapping, null, 2),
    'utf-8'
  );

  console.log(`\n📊 結果：`);
  console.log(`  ✅ 新增上傳: ${uploadCount}`);
  console.log(`  ⏭️  既有跳過: ${skipCount}`);
  console.log(`  📁 映射文件已更新: ${MAPPING_FILE}`);
})();
