/**
 * 商品分類英文到繁體中文翻譯對照表
 * 用於在 UI 中顯示分類名稱（英文 中文）
 */

export const categoryTranslations: Record<string, string> = {
  // 衣著類別
  'ALLWEATHER': '全天候雨衣褲',
  'BASE LAYER': '基礎層',
  'KNIT SHIRT': '針織衫',
  'KNIT SHIRTS': '針織衫',
  'SHIRTS': '襯衫',
  'PANTS': '褲子',
  'SHORTS': '短褲',
  'SOCKS': '襪子',
  'WIND SHELL': '防風層',
  'SOFT SHELL': '軟殼',
  'VEST': '背心',
  'GLOVES': '手套',
  'SUPPORTER & WARMER': '護套與保暖用品',
  'SCARF AND NECK GAITER': '圍巾與圍脖',
  'GAITER': '綁腿',

  // 鞋類
  'FOOTWEAR': '鞋類',

  // 包包與背包
  'BACKPACK': '登山背包',
  'BAG': '各式背包與袋子',
  'ACCESSORIES': '配件',

  // 帽子
  'CAP & HAT': '帽類',

  // 戶外裝備
  'SLEEPING BAG': '睡袋',
  'POLES': '登山杖',
  'UMBRELLA': '雨傘',
  'LIGHTING': '照明用品',
  'CAMPING': '露營用品',
  'FIELD WEAR': '野外穿著',

  // 戶外用品
  'BOTTLES': '水瓶',
  'COOKWARE': '炊具',
  'FISHING': '釣魚用品',
  'AQUA SPORTS': '水上運動',

  // 特殊分類
  'KIDS & BABY': '兒童與嬰幼兒',
};

/**
 * 取得分類的中文翻譯
 * @param category 英文分類名稱
 * @returns 格式為 "英文 中文" 的翻譯字符串
 */
export function getCategoryLabel(category: string): string {
  const translation = categoryTranslations[category];
  if (translation) {
    return `${category} ${translation}`;
  }
  // 如果沒有翻譯，則只返回原始分類名稱
  return category;
}

/**
 * 只取得分類的中文翻譯
 * @param category 英文分類名稱
 * @returns 純中文翻譯
 */
export function getCategoryChineseOnly(category: string): string {
  return categoryTranslations[category] || category;
}
