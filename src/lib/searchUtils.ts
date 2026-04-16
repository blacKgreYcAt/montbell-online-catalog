import Fuse from "fuse.js";
import { Product, SearchResult } from "@/types";
import { SEARCH_KEYS, SEARCH_THRESHOLD, MAX_SEARCH_RESULTS } from "./constants";

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
