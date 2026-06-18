/**
 * 取得分類標籤 - 直接返回英文分類名稱
 * @param category 英文分類名稱
 * @returns 英文分類名稱（保持與 Excel 和資料庫一致）
 */
export function getCategoryLabel(category: string): string {
  return category;
}

/**
 * 只取得分類名稱 - 直接返回英文
 * @param category 英文分類名稱
 * @returns 英文分類名稱
 */
export function getCategoryChineseOnly(category: string): string {
  return category;
}
