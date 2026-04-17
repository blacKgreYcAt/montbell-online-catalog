/**
 * 商品分類對應表
 * 將原始分類（Excel 中的分類）對應到新的分類系統
 */

export const CATEGORY_MAPPING: Record<string, { mainId: string; subId: string }> = {
  // 上衣 (CLOTHING)
  'KNIT SHIRTS': { mainId: 'clothing', subId: 'knit-shirts' },
  'KNIT SHIRT': { mainId: 'clothing', subId: 'knit-shirts' },
  'SHIRTS': { mainId: 'clothing', subId: 'shirts' },
  'BASE LAYER': { mainId: 'clothing', subId: 'base-layer' },
  'VEST': { mainId: 'clothing', subId: 'vest' },
  'WIND SHELL': { mainId: 'clothing', subId: 'wind-shell' },
  'SOFT SHELL': { mainId: 'clothing', subId: 'soft-shell' },
  'FIELD WEAR': { mainId: 'clothing', subId: 'field-wear' },
  'ALLWEATHER': { mainId: 'clothing', subId: 'all-weather' },

  // 褲子 (BOTTOMS)
  'PANTS': { mainId: 'bottoms', subId: 'pants' },

  // 配件 (ACCESSORIES)
  'CAP & HAT': { mainId: 'accessories', subId: 'cap-hat' },
  'SCARF AND NECK GAITER': { mainId: 'accessories', subId: 'scarf' },
  'GLOVES': { mainId: 'accessories', subId: 'gloves' },
  'SOCKS': { mainId: 'accessories', subId: 'socks' },
  'GAITER': { mainId: 'accessories', subId: 'gaiter' },
  'SUPPORTER & WARMER': { mainId: 'accessories', subId: 'supporter' },
  'ACCESSORIES': { mainId: 'accessories', subId: 'accessories' },

  // 鞋類 (FOOTWEAR)
  'FOOTWEAR': { mainId: 'footwear', subId: 'footwear' },

  // 包袋 (BAGS)
  'BACKPACK': { mainId: 'bags', subId: 'backpack' },
  'BAG': { mainId: 'bags', subId: 'bag' },

  // 露營裝備 (CAMPING)
  'SLEEPING BAG': { mainId: 'camping', subId: 'sleeping-bag' },
  'CAMPING': { mainId: 'camping', subId: 'camping' },

  // 運動專項 (SPORTS)
  'AQUA SPORTS': { mainId: 'sports', subId: 'aqua-sports' },
  'FISHING': { mainId: 'sports', subId: 'fishing' },

  // 裝備 (GEAR)
  'BOTTLES': { mainId: 'gear', subId: 'bottles' },
  'COOKWARE': { mainId: 'gear', subId: 'cookware' },
  'POLES': { mainId: 'gear', subId: 'poles' },
  'LIGHTING': { mainId: 'gear', subId: 'lighting' },
  'UMBRELLA': { mainId: 'gear', subId: 'umbrella' },

  // 兒童 (KIDS)
  'KIDS & BABY': { mainId: 'kids', subId: 'kids-baby' },
};

/**
 * 根據原始分類取得映射資訊
 */
export function getCategoryMapping(
  originalCategory: string
): { mainId: string; subId: string } | null {
  const normalized = originalCategory.toUpperCase().trim();
  return CATEGORY_MAPPING[normalized] || null;
}

/**
 * 驗證所有分類是否都被正確映射
 */
export function validateCategoryMappings(
  categories: string[]
): { valid: string[]; missing: string[] } {
  const valid: string[] = [];
  const missing: string[] = [];

  categories.forEach((cat) => {
    if (getCategoryMapping(cat)) {
      valid.push(cat);
    } else {
      missing.push(cat);
    }
  });

  return { valid, missing };
}

/**
 * 取得所有已映射的分類
 */
export function getAllMappedCategories(): string[] {
  return Object.keys(CATEGORY_MAPPING);
}
