const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// 配置 Cloudinary
cloudinary.config({
  cloud_name: 'dyc0mcbkp',
  api_key: '712869652458293',
  api_secret: '7ZsvMcXDgYxzNV5DDpSuluJANXE',
});

const mapping = JSON.parse(fs.readFileSync('public/imageMapping-internal.json', 'utf-8'));
const newMapping = {};
let success = 0;
let failed = 0;

console.log(`📦 開始上傳 ${Object.keys(mapping).length} 張圖片...`);

(async () => {
  for (const [key, fileId] of Object.entries(mapping)) {
    try {
      const gdURL = `https://drive.google.com/uc?export=view&id=${fileId}`;

      const result = await cloudinary.uploader.upload(gdURL, {
        resource_type: 'auto',
        folder: 'montbell_fw27',
        public_id: key,
        overwrite: true,
      });

      newMapping[key] = result.secure_url;
      success++;
      console.log(`✅ ${success + failed}/${Object.keys(mapping).length} ${key}`);
    } catch (error) {
      failed++;
      console.log(`❌ ${success + failed}/${Object.keys(mapping).length} ${key} - ${error.message}`);
    }
  }

  // 保存新映射
  fs.writeFileSync(
    'public/imageMapping-cloudinary.json',
    JSON.stringify(newMapping, null, 2),
    'utf-8'
  );

  console.log(`\n✅ 完成：成功 ${success}，失敗 ${failed}`);
})();
