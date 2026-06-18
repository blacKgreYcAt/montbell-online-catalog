const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dyc0mcbkp',
  api_key: '712869652458293',
  api_secret: '7ZsvMcXDgYxzNV5DDpSuluJANXE',
});

const SOURCE_DIR = require('path').join(process.env.USERPROFILE, 'Desktop', '20260602 MB 展示會素材', '線上目錄用', '線上目錄用');
const MAPPING_FILE = 'public/imageMapping.json';

// 讀取現有映射
let existingMapping = {};
if (fs.existsSync(MAPPING_FILE)) {
  try {
    existingMapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
  } catch (e) {
    console.log('⚠️  無法讀取現有映射，將創建新的');
  }
}

const newMapping = { ...existingMapping };

console.log('========================================');
console.log('批量上傳電繪圖到 Cloudinary');
console.log('========================================\n');

let uploadCount = 0;
let skipCount = 0;
let errorCount = 0;
let processedFolders = 0;

(async () => {
  try {
    // 掃描所有商品文件夾
    const folders = fs.readdirSync(SOURCE_DIR).filter(f => /^\d+$/.test(f)); // 上傳全部
    
    console.log(`開始掃描... 共 ${folders.length} 個商品\n`);

    for (const productId of folders) {
      const productDir = path.join(SOURCE_DIR, productId);
      
      if (!fs.existsSync(productDir)) {
        continue;
      }

      const files = fs.readdirSync(productDir).filter(f =>
        f.match(/\.(jpg|jpeg|png|gif|webp)$/i)
      );

      if (files.length === 0) {
        continue;
      }

      processedFolders++;
      console.log(`📁 [${productId}] 發現 ${files.length} 個圖片文件`);

      for (const file of files) {
        const filePath = path.join(productDir, file);
        const fileName = file.replace(/\.[^.]+$/, ''); // 移除副檔名
        const key = `k_${fileName.toLowerCase()}`;

        // 檢查是否已存在
        if (newMapping[key]) {
          skipCount++;
          console.log(`  ⏭️  ${key} - 已存在，跳過`);
          continue;
        }

        // 上傳到 Cloudinary
        try {
          console.log(`  ⬆️  上傳 ${key}...`);
          const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto',
            folder: 'montbell',
            public_id: key,
            overwrite: true,
          });

          newMapping[key] = result.secure_url;
          uploadCount++;
          console.log(`  ✅ 完成`);
        } catch (error) {
          errorCount++;
          console.log(`  ❌ 失敗: ${error.message}`);
        }
      }
    }

    // 保存更新的映射
    fs.writeFileSync(
      MAPPING_FILE,
      JSON.stringify(newMapping, null, 2),
      'utf-8'
    );

    console.log('\n========================================');
    console.log('測試上傳結果');
    console.log('========================================');
    console.log(`✅ 新增上傳: ${uploadCount} 個`);
    console.log(`⏭️  既有跳過: ${skipCount} 個`);
    console.log(`❌ 上傳失敗: ${errorCount} 個`);
    console.log(`📁 掃描文件夾: ${processedFolders} 個`);
    console.log(`\n📁 映射文件已更新: ${MAPPING_FILE}`);
    console.log(`📊 映射總數: ${Object.keys(newMapping).length} 個`);

  } catch (err) {
    console.error('❌ 錯誤:', err.message);
  }
})();
