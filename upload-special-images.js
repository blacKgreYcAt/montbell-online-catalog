const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dyc0mcbkp',
  api_key: '712869652458293',
  api_secret: '7ZsvMcXDgYxzNV5DDpSuluJANXE',
});

const SOURCE_DIR = 'D:\\MB 官網\\FW27原廠資料\\FW27 Workbook PDF 擷取圖';
const MAPPING_FILE = 'public/imageMapping-internal.json';

// 讀取現有映射
const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));

// 需要特殊處理的商品（包含 # 的顏色）
const specialProducts = {
  '1144124': ['#1', '#2', '#3'],
  '1144125': ['#4', '#5', '#6'],
  '1106847': ['#10', '#14', '#15'],
  '1119296': ['#2', '#3', '#5'],
  '1119297': ['#2', '#3', '#5'],
  '1144142': ['#7', '#8', '#9'],
  '1144143': ['#7', '#8', '#9'],
  '1119298': ['#7', '#8', '#9'],
};

console.log(`📦 上傳包含 # 符號的 9 個圖片...`);

(async () => {
  let success = 0;
  let failed = 0;

  for (const [productId, colors] of Object.entries(specialProducts)) {
    const productDir = path.join(SOURCE_DIR, productId);

    for (const color of colors) {
      const filePath = path.join(productDir, `${productId}_${color}.jpg`);

      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  ${productId}_${color} - 檔案不存在`);
        continue;
      }

      try {
        // 上傳時用替換的 public_id（01, 02, 03 等）
        const publicId = color.replace('#', '');
        const cloudinaryKey = `${productId}_${publicId}`;

        console.log(`⬆️  上傳 ${productId}_${color}...`);
        const result = await cloudinary.uploader.upload(filePath, {
          resource_type: 'auto',
          folder: 'montbell_fw27',
          public_id: cloudinaryKey,
          overwrite: true,
        });

        // 但在映射中保持原始的 # 名稱
        const mappingKey = `${productId}_${color}`;
        mapping[mappingKey] = result.secure_url;
        success++;
        console.log(`✅ ${mappingKey} → Cloudinary (as ${cloudinaryKey})`);
      } catch (error) {
        failed++;
        console.log(`❌ ${productId}_${color} 失敗: ${error.message}`);
      }
    }
  }

  // 保存更新的映射
  fs.writeFileSync(
    MAPPING_FILE,
    JSON.stringify(mapping, null, 2),
    'utf-8'
  );

  console.log(`\n📊 完成：成功 ${success}，失敗 ${failed}`);
  console.log(`📁 映射已更新`);
})();
