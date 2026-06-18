const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dyc0mcbkp',
  api_key: '712869652458293',
  api_secret: '7ZsvMcXDgYxzNV5DDpSuluJANXE',
});

// 只上传这 12 个睡袋商品
const PRODUCTS_TO_UPLOAD = [
  '1121826', '1121827', '1121828', '1121829',
  '1121839', '1121840', '1121841', '1121842',
  '1121843', '1121845', '1121846', '1121847'
];

const SOURCE_DIR = 'C:\\Users\\imaus\\Desktop\\20260602 MB 展示會素材\\27FW線上目錄用電繪圖\\線上目錄用';
const MAPPING_FILE = 'public/imageMapping.json';

// 读取现有映射
let existingMapping = {};
if (fs.existsSync(MAPPING_FILE)) {
  try {
    existingMapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
  } catch (e) {
    console.log('⚠️  无法读取现有映射文件，将创建新映射');
  }
}

const newMapping = { ...existingMapping };

console.log('========================================');
console.log('12 个睡袋商品电绘图上传 (Cloudinary)');
console.log('========================================\n');

let uploadCount = 0;
let skipCount = 0;
let errorCount = 0;

(async () => {
  for (const productId of PRODUCTS_TO_UPLOAD) {
    const productDir = path.join(SOURCE_DIR, productId);

    if (!fs.existsSync(productDir)) {
      console.log(`❌ [${productId}] 找不到文件夹`);
      errorCount++;
      continue;
    }

    const files = fs.readdirSync(productDir).filter(f =>
      f.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    );

    console.log(`📁 [${productId}] 发现 ${files.length} 个图片文件`);

    for (const file of files) {
      const filePath = path.join(productDir, file);
      const fileName = file.replace(/\.[^.]+$/, '');
      const key = `k_${fileName.toLowerCase()}`;

      // 检查是否已存在
      if (newMapping[key]) {
        skipCount++;
        console.log(`  ⏭️  ${key} - 已存在，跳过`);
        continue;
      }

      // 上传到 Cloudinary
      try {
        console.log(`  ⬆️  上传 ${key}...`);
        const result = await cloudinary.uploader.upload(filePath, {
          resource_type: 'auto',
          folder: 'montbell',
          public_id: key,
          overwrite: true,
        });

        newMapping[key] = result.secure_url;
        uploadCount++;
        console.log(`  ✅ ${key} → Cloudinary`);
      } catch (error) {
        errorCount++;
        console.log(`  ❌ ${key} 上传失败: ${error.message}`);
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
  console.log('上传结果统计');
  console.log('========================================');
  console.log(`✅ 新增上传: ${uploadCount} 个`);
  console.log(`⏭️  既有跳过: ${skipCount} 个`);
  console.log(`❌ 上传失败: ${errorCount} 个`);
  console.log(`\n📁 映射文件已更新: ${MAPPING_FILE}`);
  console.log('📊 映射总数:', Object.keys(newMapping).length, '个');

  if (uploadCount > 0) {
    console.log('\n✨ 成功！请执行以下命令部署到 Vercel:');
    console.log('  git add public/imageMapping.json');
    console.log('  git commit -m "feat: Add vector images for 12 sleeping bag products"');
    console.log('  git push origin main');
  }
})();
