/**
 * 圖片 URL 快取管理
 * 在記憶體中快取已驗證的圖片 URLs，避免重複驗證
 */

type ImageCache = Record<string, Record<string, string>>;

let cache: ImageCache = {};

/**
 * 從快取取得圖片 URL
 */
export function getCachedImageUrl(
  modelNumber: string,
  color: string
): string | null {
  return cache[modelNumber]?.[color] || null;
}

/**
 * 存儲圖片 URL 到快取
 */
export function setCachedImageUrl(
  modelNumber: string,
  color: string,
  url: string
): void {
  if (!cache[modelNumber]) {
    cache[modelNumber] = {};
  }
  cache[modelNumber][color] = url;
}

/**
 * 取得商品的所有快取圖片
 */
export function getProductImages(
  modelNumber: string
): Record<string, string> {
  return cache[modelNumber] || {};
}

/**
 * 檢查商品是否已快取
 */
export function isProductCached(modelNumber: string): boolean {
  return !!cache[modelNumber];
}

/**
 * 清除快取（如需要）
 */
export function clearCache(): void {
  cache = {};
}
