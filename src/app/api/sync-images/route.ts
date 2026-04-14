import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import type { ApiResponse, ImageMapping } from '@/types';

/**
 * Google Drive 圖片同步 API
 * 定時同步 Google Drive 上的圖片並生成映射文件
 *
 * 觸發方式：
 * 1. 手動調用：POST /api/sync-images?secret=CRON_SECRET
 * 2. Vercel Cron Job：根據配置自動調用
 */

// 驗證 Cron Secret
function verifyCronSecret(request: NextRequest): boolean {
  const secret = request.nextUrl.searchParams.get('secret');
  const expectedSecret = process.env.CRON_SECRET;

  if (!secret || !expectedSecret) {
    return false;
  }

  return secret === expectedSecret;
}

/**
 * 初始化 Google Drive 認證
 */
function getGoogleDriveClient() {
  try {
    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (!credentialsJson) {
      throw new Error('缺少 Google Cloud 認證信息');
    }

    const credentials = JSON.parse(credentialsJson);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    return google.drive({ version: 'v3', auth });
  } catch (error) {
    console.error('Google Drive 認證失敗:', error);
    throw error;
  }
}

/**
 * 從 Google Drive 同步圖片
 */
async function syncImagesFromGoogleDrive(): Promise<ImageMapping> {
  const drive = getGoogleDriveClient();
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!folderId) {
    throw new Error('缺少 Google Drive 資料夾 ID');
  }

  try {
    console.log('🔄 開始同步 Google Drive 圖片...');
    console.log(`📁 資料夾 ID: ${folderId}`);

    // 查詢資料夾內所有圖片
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      spaces: 'drive',
      fields: 'files(id, name, mimeType)',
      pageSize: 1000,
      supportsAllDrives: true,
    });

    const imageMapping: ImageMapping = {};
    const files = response.data.files || [];

    // 篩選圖片檔案
    const imageFiles = files.filter((file) => {
      const isImage = file.mimeType?.startsWith('image/');
      const isValidFormat = /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name || '');
      return isImage && isValidFormat;
    });

    console.log(`✅ 找到 ${imageFiles.length} 張圖片`);

    // 建立映射：檔名（不含副檔名）→ FILE_ID
    imageFiles.forEach((file) => {
      if (file.name && file.id) {
        // 移除副檔名
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        imageMapping[nameWithoutExt] = file.id;
        console.log(`  ✓ ${file.name} → ${file.id}`);
      }
    });

    console.log(`\n✨ 同步完成！找到 ${Object.keys(imageMapping).length} 個映射`);
    return imageMapping;
  } catch (error) {
    console.error('Google Drive 同步失敗:', error);
    throw error;
  }
}

/**
 * 保存圖片映射到文件
 */
function saveImageMapping(imageMapping: ImageMapping): void {
  try {
    const publicDir = path.join(process.cwd(), 'public');
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

    console.log(`💾 圖片映射已保存到: ${outputPath}`);
  } catch (error) {
    console.error('保存圖片映射失敗:', error);
    throw error;
  }
}

/**
 * POST 處理器（Cron Job 調用）
 */
export async function POST(request: NextRequest) {
  try {
    // 驗證 Cron Secret
    if (!verifyCronSecret(request)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: '未授權的請求',
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    // 同步圖片
    const imageMapping = await syncImagesFromGoogleDrive();

    // 保存映射文件
    saveImageMapping(imageMapping);

    return NextResponse.json<ApiResponse<ImageMapping>>(
      {
        success: true,
        data: imageMapping,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('圖片同步 API 錯誤:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : '圖片同步失敗',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * GET 處理器（健康檢查）
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      status: 'ok',
      message: '圖片同步 API 就緒',
      note: '使用 POST 方法並提供正確的 secret 參數來同步圖片',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
