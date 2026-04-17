/**
 * 产品分类配置
 * 包含主分类、子分类和分类映射
 */

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface MainCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  subcategories: CategoryItem[];
}

// 主分类配置
export const MAIN_CATEGORIES: MainCategory[] = [
  {
    id: 'clothing',
    name: '上衣',
    slug: 'clothing',
    icon: '👕',
    description: '各類衣服、外套和內衣',
    subcategories: [
      { id: 'base-layer', name: 'Base Layer', slug: 'base-layer' },
      { id: 'knit-shirts', name: 'Knit Shirts', slug: 'knit-shirts' },
      { id: 'shirts', name: 'Shirts', slug: 'shirts' },
      { id: 'vest', name: 'Vest', slug: 'vest' },
      { id: 'wind-shell', name: 'Wind Shell', slug: 'wind-shell' },
      { id: 'soft-shell', name: 'Soft Shell', slug: 'soft-shell' },
      { id: 'field-wear', name: 'Field Wear', slug: 'field-wear' },
      { id: 'all-weather', name: 'All Weather', slug: 'all-weather' },
    ],
  },
  {
    id: 'bottoms',
    name: '褲子',
    slug: 'bottoms',
    icon: '👖',
    description: '褲子和相關下裝',
    subcategories: [
      { id: 'pants', name: 'Pants', slug: 'pants' },
    ],
  },
  {
    id: 'accessories',
    name: '配件',
    slug: 'accessories',
    icon: '🧣',
    description: '帽子、手套、圍巾等配件',
    subcategories: [
      { id: 'cap-hat', name: 'Cap & Hat', slug: 'cap-hat' },
      { id: 'scarf', name: 'Scarf & Neck Gaiter', slug: 'scarf' },
      { id: 'gloves', name: 'Gloves', slug: 'gloves' },
      { id: 'socks', name: 'Socks', slug: 'socks' },
      { id: 'gaiter', name: 'Gaiter', slug: 'gaiter' },
      { id: 'supporter', name: 'Supporter & Warmer', slug: 'supporter' },
      { id: 'accessories', name: 'Accessories', slug: 'accessories' },
    ],
  },
  {
    id: 'footwear',
    name: '鞋類',
    slug: 'footwear',
    icon: '👟',
    description: '登山鞋、戶外鞋等',
    subcategories: [
      { id: 'footwear', name: 'Footwear', slug: 'footwear' },
    ],
  },
  {
    id: 'bags',
    name: '包袋',
    slug: 'bags',
    icon: '🎒',
    description: '背包、行李包等',
    subcategories: [
      { id: 'backpack', name: 'Backpack', slug: 'backpack' },
      { id: 'bag', name: 'Bag', slug: 'bag' },
    ],
  },
  {
    id: 'camping',
    name: '露營裝備',
    slug: 'camping',
    icon: '⛺',
    description: '睡袋、帳篷和露營用品',
    subcategories: [
      { id: 'sleeping-bag', name: 'Sleeping Bag', slug: 'sleeping-bag' },
      { id: 'camping', name: 'Camping', slug: 'camping' },
    ],
  },
  {
    id: 'sports',
    name: '運動專項',
    slug: 'sports',
    icon: '⛹️',
    description: '水上運動、釣魚等專項',
    subcategories: [
      { id: 'aqua-sports', name: 'Aqua Sports', slug: 'aqua-sports' },
      { id: 'fishing', name: 'Fishing', slug: 'fishing' },
    ],
  },
  {
    id: 'gear',
    name: '裝備',
    slug: 'gear',
    icon: '🔧',
    description: '登山杖、爐具、照明等裝備',
    subcategories: [
      { id: 'bottles', name: 'Bottles', slug: 'bottles' },
      { id: 'cookware', name: 'Cookware', slug: 'cookware' },
      { id: 'poles', name: 'Poles', slug: 'poles' },
      { id: 'lighting', name: 'Lighting', slug: 'lighting' },
      { id: 'umbrella', name: 'Umbrella', slug: 'umbrella' },
    ],
  },
  {
    id: 'kids',
    name: '兒童',
    slug: 'kids',
    icon: '👶',
    description: '兒童和嬰幼兒用品',
    subcategories: [
      { id: 'kids-baby', name: 'Kids & Baby', slug: 'kids-baby' },
    ],
  },
];

/**
 * 创建分类到主分类的映射
 * 用于快速查询某个分类属于哪个主分类
 */
export function getCategoryToMainCategoryMap(): Record<string, string> {
  const map: Record<string, string> = {};

  MAIN_CATEGORIES.forEach((main) => {
    main.subcategories.forEach((sub) => {
      // 映射子分类 ID
      map[sub.id] = main.id;
      // 映射原始分类名（大写）
      const originalName = sub.id
        .split('-')
        .map((word) => word.toUpperCase())
        .join(' ');
      map[originalName] = main.id;
    });
  });

  return map;
}

/**
 * 根据原始分类名获取主分类信息
 */
export function getMainCategoryByProductCategory(
  productCategory: string
): MainCategory | undefined {
  const categoryMap = getCategoryToMainCategoryMap();
  const mainCategoryId = categoryMap[productCategory] || categoryMap[productCategory.toUpperCase()];
  return MAIN_CATEGORIES.find((cat) => cat.id === mainCategoryId);
}

/**
 * 获取所有主分类列表
 */
export function getAllMainCategories(): MainCategory[] {
  return MAIN_CATEGORIES;
}

/**
 * 根据主分类 ID 获取子分类列表
 */
export function getSubcategoriesByMainId(mainCategoryId: string): CategoryItem[] {
  const main = MAIN_CATEGORIES.find((cat) => cat.id === mainCategoryId);
  return main?.subcategories || [];
}
