import Fuse from "fuse.js";
import { Product, SearchResult } from "@/types";
import { SEARCH_KEYS, SEARCH_THRESHOLD, MAX_SEARCH_RESULTS } from "./constants";
import {
  getMainCategoryByProductCategory,
  getSubcategoriesByMainId,
  MAIN_CATEGORIES,
} from "./categories";
import { getCategoryMapping } from "./categoryMapping";

/**
 * 初始化 Fuse.js 搜尋引擎
 */
export function createSearchIndex(products: Product[]): Fuse<Product> {
  return new Fuse(products, {
    keys: SEARCH_KEYS,
    threshold: SEARCH_THRESHOLD,
    includeScore: true,
  });
}

/**
 * 檢測輸入是否為頁碼（純數字）
 */
function isPageNumberQuery(query: string): boolean {
  return /^\d+$/.test(query.trim());
}

/**
 * 按頁碼搜尋
 */
export function searchByPageNumber(
  pageNumber: number,
  products: Product[]
): SearchResult {
  const results = products.filter((p) => p.pageNumber === pageNumber);

  return {
    products: results.slice(0, MAX_SEARCH_RESULTS),
    total: results.length,
    query: pageNumber.toString(),
  };
}

/**
 * 執行搜尋
 */
export function searchProducts(
  query: string,
  products: Product[]
): SearchResult {
  if (!query.trim()) {
    return {
      products: products.slice(0, MAX_SEARCH_RESULTS),
      total: products.length,
      query: "",
    };
  }

  const trimmedQuery = query.trim();

  // 檢測是否為頁碼搜尋
  if (isPageNumberQuery(trimmedQuery)) {
    const pageNum = parseInt(trimmedQuery, 10);
    return searchByPageNumber(pageNum, products);
  }

  // 首先嘗試精確匹配型號 (完全相符或前置匹配)
  const exactMatches = products.filter((p) =>
    p.modelNumber.startsWith(trimmedQuery) ||
    p.modelNumber === trimmedQuery
  );

  if (exactMatches.length > 0) {
    return {
      products: exactMatches.slice(0, MAX_SEARCH_RESULTS),
      total: exactMatches.length,
      query,
    };
  }

  // 如果沒有精確匹配，使用 Fuse.js 進行模糊搜尋
  const searchIndex = createSearchIndex(products);
  const fuzzyResults = searchIndex.search(trimmedQuery).slice(0, MAX_SEARCH_RESULTS);

  return {
    products: fuzzyResults.map((result) => result.item),
    total: fuzzyResults.length,
    query,
  };
}

/**
 * 按分類篩選
 */
export function filterByCategory(
  products: Product[],
  category: string
): Product[] {
  if (!category) return products;
  return products.filter((p) =>
    p.category.toLowerCase().includes(category.toLowerCase())
  );
}

/**
 * 獲取所有分類
 */
export function getCategories(products: Product[]): Map<string, number> {
  const categories = new Map<string, number>();

  products.forEach((product) => {
    const count = categories.get(product.category) || 0;
    categories.set(product.category, count + 1);
  });

  return categories;
}

/**
 * 按主分類篩選（根據新的分類系統）
 */
export function filterByMainCategory(
  products: Product[],
  mainCategorySlug: string
): Product[] {
  if (!mainCategorySlug) return products;

  const mainCategory = MAIN_CATEGORIES.find((cat) => cat.slug === mainCategorySlug);
  if (!mainCategory) return products;

  return products.filter((product) => {
    const mapping = getCategoryMapping(product.category);
    return mapping?.mainId === mainCategory.id;
  });
}

/**
 * 按子分類篩選（根據新的分類系統）
 */
export function filterBySubCategory(
  products: Product[],
  subCategoryId: string
): Product[] {
  if (!subCategoryId) return products;

  return products.filter((product) => {
    const mapping = getCategoryMapping(product.category);
    return mapping?.subId === subCategoryId;
  });
}
