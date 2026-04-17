/**
 * 圖片預加載器
 * 在背景預加載商品的所有顏色圖片，提升點擊切換顏色時的響應速度
 */

import { generateMonbellImageUrl } from './imageUtils';
import {
  getCachedImageUrl,
  setCachedImageUrl,
  isProductCached,
} from './imageCache';

/**
 * 預加載單張圖片到記憶體
 */
function preloadSingleImage(imageUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      resolve(true);
    };

    img.onerror = () => {
      resolve(false);
    };

    // 設置超時：3秒後仍未載入則失敗
    setTimeout(() => {
      resolve(false);
    }, 3000);

    img.src = imageUrl;
  });
}

/**
 * 預加載商品的所有顏色圖片
 * 在背景加載，不影響頁面顯示
 */
export async function preloadProductImages(
  modelNumber: string,
  colors: string[]
): Promise<void> {
  // 如果已快取，跳過預加載
  if (isProductCached(modelNumber)) {
    return;
  }

  // 並行預加載所有顏色的圖片
  const preloadPromises = colors.map(async (color) => {
    // 檢查快取
    const cached = getCachedImageUrl(modelNumber, color);
    if (cached) {
      return; // 已快取，跳過
    }

    try {
      const imageUrl = generateMonbellImageUrl(modelNumber, color);

      // 預加載圖片
      const success = await preloadSingleImage(imageUrl);

      // 如果成功，存入快取
      if (success) {
        setCachedImageUrl(modelNumber, color, imageUrl);
      }
    } catch (error) {
      console.warn(`預加載失敗 - 型號: ${modelNumber}, 顏色: ${color}`, error);
    }
  });

  // 等待所有預加載完成（在背景執行）
  await Promise.all(preloadPromises);
}

/**
 * 獲取已快取的圖片 URL，如果沒有則返回原始 URL
 */
export function getImageUrlWithCache(
  modelNumber: string,
  color: string
): string {
  const cached = getCachedImageUrl(modelNumber, color);
  if (cached) {
    return cached;
  }
  // 返回原始 URL 作為備用
  return generateMonbellImageUrl(modelNumber, color);
}
