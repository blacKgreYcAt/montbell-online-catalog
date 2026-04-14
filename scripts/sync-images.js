#!/usr/bin/env node

/**
 * 本地圖片同步腳本
 * 用於在開發環境中手動同步 Google Drive 圖片
 *
 * 使用方法：
 * npm run sync-images
 *
 * 環境變數：
 * GOOGLE_DRIVE_FOLDER_ID - Google Drive 資料夾 ID
 * GOOGLE_APPLICATION_CREDENTIALS_JSON - Google Cloud 服務帳戶 JSON
 */

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
require('dotenv').config();

// 顏色輸出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * 初始化 Google Drive 認證
 */
function getGoogleDriveClient() {
  try {
    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (!credentialsJson) {
      log('❌ 錯誤: 缺少 GOOGLE_APPLICATION_CREDENTIALS_JSON 環境變數', 'red');
      process.exit(1);
    }

    const credentials = JSON.parse(credentialsJson);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    return google.drive({ version: 'v3', auth });
  } catch (error) {
    log(`❌ Google Drive 認證失敗: ${error.message}`, 'red');
    process.exit(1);
  }
}

/**
 * 從 Google Drive 同步圖片
 */
async function syncImagesFromGoogleDrive() {
  const drive = getGoogleDriveClient();
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!folderId) {
    log('❌ 錯誤: 缺少 GOOGLE_DRIVE_FOLDER_ID 環境變數', 'red');
    process.exit(1);
  }

  try {
    log('🔄 開始同步 Google Drive 圖片...', 'blue');
    log(`📁 資料夾 ID: ${folderId}`, 'blue');

    // 查詢資料夾內所有圖片
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      spaces: 'drive',
      fields: 'files(id, name, mimeType)',
      pageSize: 1000,
      supportsAllDrives: true,
    });

    const imageMapping = {};
    const files = response.data.files || [];

    // 篩選圖片檔案
    const imageFiles = files.filter((file) => {
      const isImage = file.mimeType?.startsWith('image/');
      const isValidFormat = /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name || '');
      return isImage && isValidFormat;
    });

    log(`✅ 找到 ${imageFiles.length} 張圖片`, 'green');

    // 建立映射
    imageFiles.forEach((file) => {
      if (file.name && file.id) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        imageMapping[nameWithoutExt] = file.id;
        log(`  ✓ ${file.name}`, 'green');
      }
    });

    return imageMapping;
  } catch (error) {
    log(`❌ Google Drive 同步失敗: ${error.message}`, 'red');
    process.exit(1);
  }
}

/**
 * 保存圖片映射到文件
 */
function saveImageMapping(imageMapping) {
  try {
    const publicDir = path.join(__dirname, '../public');
    const outputPath = path.join(publicDir, 'imageMapping.json');

    // 確保 public 目錄存在
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(
      outputPath,
      JSON.stringify(imageMapping, null, 2),
      'utf-8'
    );

    log(`💾 圖片映射已保存到: ${outputPath}`, 'green');
    log(`📊 共 ${Object.keys(imageMapping).length} 個映射`, 'green');
  } catch (error) {
    log(`❌ 保存圖片映射失敗: ${error.message}`, 'red');
    process.exit(1);
  }
}

/**
 * 主函數
 */
async function main() {
  log('\n=== Google Drive 圖片同步工具 ===\n', 'blue');

  try {
    const imageMapping = await syncImagesFromGoogleDrive();
    saveImageMapping(imageMapping);
    log('\n✨ 同步完成！\n', 'green');
  } catch (error) {
    log(`\n❌ 同步失敗: ${error.message}\n`, 'red');
    process.exit(1);
  }
}

// 執行
main();
