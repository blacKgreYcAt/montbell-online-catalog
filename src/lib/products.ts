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
      cache: 'no-store', // 禁用緩存，確保總是獲取最新數據
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      console.error(`無法載入商品數據: ${response.status} from ${url}`);
      return [];
    }

    const data = await response.json();
    let products = Array.isArray(data) ? data : data.products || [];

    // 驗證和過濾無效的商品數據
    products = products.filter((product: unknown) => {
      const valid = validateProduct(product);
      if (!valid) {
        console.warn('無效的商品數據，跳過:', product);
      }
      return valid;
    });

    // 格式化商品數據
    products = products.map(formatProduct);

    console.log(`成功載入 ${products.length} 件有效商品`);
    return products;
  } catch (error) {
    console.error("載入商品數據失敗:", error);
    return [];
  }
}

/**
 * 載入商品（不按季節過濾）
 * 每次展示會只有一個季節，所以直接返回所有商品
 */
export async function loadProductsBySeason(): Promise<Product[]> {
  const products = await loadProducts();
  return products;
}

/**
 * 加載內部版商品（FW27 - 181 個商品）
 */
export async function loadInternalProducts(): Promise<Product[]> {
  try {
    const url = '/products-internal.json';

    const response = await fetch(url, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      console.error(`無法載入內部商品數據: ${response.status} from ${url}`);
      return [];
    }

    const data = await response.json();
    let products = Array.isArray(data) ? data : data.products || [];

    // 驗證和過濾無效的商品數據
    products = products.filter((product: unknown) => {
      const valid = validateProduct(product);
      if (!valid) {
        console.warn('無效的商品數據，跳過:', product);
      }
      return valid;
    });

    // 格式化商品數據
    products = products.map(formatProduct);

    console.log(`成功載入 ${products.length} 件內部版商品 (FW27)`);
    return products;
  } catch (error) {
    console.error("載入內部商品數據失敗:", error);
    return [];
  }
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
