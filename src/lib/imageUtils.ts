import { ImageMapping } from "@/types";
import { MONTBELL_CDN_CONFIG } from "./constants";

/**
 * 根據型號和顏色代碼生成 Montbell CDN 圖片 URL
 */
export function generateMonbellImageUrl(
  modelNumber: string,
  colorCode: string
): string {
  const { baseUrl, pattern } = MONTBELL_CDN_CONFIG;
  const url = pattern
    .replace("{model}", modelNumber.toString().padStart(7, "0"))
    .replace("{color}", colorCode.toUpperCase());
  return `${baseUrl}/${url}`;
}

/**
 * 根據圖片映射生成 Google Drive 圖片 URL
 */
export function getGoogleDriveImageUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

/**
 * 載入圖片映射文件
 */
export async function loadImageMapping(): Promise<ImageMapping> {
  try {
    const response = await fetch("/imageMapping.json");
    if (!response.ok) {
      console.warn("無法載入圖片映射文件");
      return {};
    }
    return await response.json();
  } catch (error) {
    console.error("載入圖片映射失敗:", error);
    return {};
  }
}

/**
 * 驗證 URL 是否有效 (檢查 HTTP 頭)
 */
export async function verifyImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.status === 200;
  } catch {
    return false;
  }
}

/**
 * 獲取商品圖片 URL (優先順序：Montbell CDN → Google Drive → null)
 */
export async function getProductImage(
  modelNumber: string,
  color: string
): Promise<string | null> {
  // 1. 優先嘗試 Montbell CDN
  if (MONTBELL_CDN_CONFIG.enabled) {
    const monbellUrl = generateMonbellImageUrl(modelNumber, color);
    const isValid = await verifyImageUrl(monbellUrl);
    if (isValid) {
      return monbellUrl;
    }
  }

  // 2. 次選：Google Drive 備份
  const imageMapping = await loadImageMapping();
  const key = `k_${modelNumber}_${color.toLowerCase()}`;
  const fileId = imageMapping[key];

  if (!fileId) {
    return null;
  }

  return getGoogleDriveImageUrl(fileId);
}

/**
 * 驗證檔案是否為圖片
 */
export function isImageFile(filename: string): boolean {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  const ext = filename.substring(filename.lastIndexOf(".")).toLowerCase();
  return imageExtensions.includes(ext);
}

/**
 * 從檔名提取模型號和顏色
 */
export function parseImageFilename(filename: string): {
  modelNumber: string;
  color: string;
} | null {
  // 格式: k_型號_顏色
  const match = filename.match(/^k_(.+)_([a-z]{2})$/i);
  if (!match) return null;

  return {
    modelNumber: match[1],
    color: match[2].toLowerCase(),
  };
}
