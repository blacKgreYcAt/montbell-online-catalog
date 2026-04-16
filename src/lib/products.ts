import { Product } from "@/types";
import { CURRENT_SEASON } from "@/lib/seasonConfig";

/**
 * 載入商品數據
 */
export async function loadProducts(): Promise<Product[]> {
  try {
    // 使用相對路徑載入 public/products.json
    const url = '/products.json';

    const response = await fetch(url, {
      cache: 'force-cache',
      next: { revalidate: 3600 } // 1 小時快取
    });

    if (!response.ok) {
      console.error(`無法載入商品數據: ${response.status} from ${url}`);
      return [];
    }

    const data = await response.json();
    const products = Array.isArray(data) ? data : data.products || [];

    return products;
  } catch (error) {
    console.error("載入商品數據失敗:", error);
    return [];
  }
}

/**
 * 根據季節過濾商品
 */
export function filterBySeason(
  products: Product[],
  season: "SS" | "FW"
): Product[] {
  return products.filter((p) => p.season === season);
}

/**
 * 載入商品並根據當前季節過濾
 */
export async function loadProductsBySeason(): Promise<Product[]> {
  const products = await loadProducts();
  return filterBySeason(products, CURRENT_SEASON);
}

/**
 * 根據 ID 獲取商品
 */
export async function getProductById(id: string): Promise<Product | null> {
  const products = await loadProductsBySeason();
  return products.find((p) => p.id === id) || null;
}

/**
 * 獲取推薦商品（同季節）
 */
export async function getRelatedProducts(
  productId: string,
  limit: number = 4
): Promise<Product[]> {
  const products = await loadProductsBySeason();
  const currentProduct = products.find((p) => p.id === productId);

  if (!currentProduct) return [];

  return products
    .filter((p) => p.category === currentProduct.category && p.id !== productId)
    .slice(0, limit);
}

/**
 * 驗證商品數據結構
 */
export function validateProduct(product: unknown): product is Product {
  const p = product as Record<string, unknown>;
  return (
    typeof p.id === "string" &&
    typeof p.modelNumber === "string" &&
    typeof p.name === "string" &&
    typeof p.category === "string" &&
    (p.season === "SS" || p.season === "FW")
  );
}

/**
 * 格式化商品數據
 */
export function formatProduct(product: Product): Product {
  return {
    ...product,
    modelNumber: product.modelNumber.toUpperCase(),
    name: product.name.trim(),
    category: product.category.trim(),
  };
}
