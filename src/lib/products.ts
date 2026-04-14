import { Product } from "@/types";

/**
 * 載入商品數據
 */
export async function loadProducts(): Promise<Product[]> {
  try {
    // 支持服务器端和客户端请求
    let url = '/products.json';

    if (typeof window === 'undefined') {
      // 服务器端: 使用完整 URL
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
                      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
                      'http://localhost:3000';
      url = `${baseUrl}/products.json`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      console.error("無法載入商品數據", response.status);
      return [];
    }
    const data = await response.json();
    return Array.isArray(data) ? data : data.products || [];
  } catch (error) {
    console.error("載入商品數據失敗:", error);
    return [];
  }
}

/**
 * 根據 ID 獲取商品
 */
export async function getProductById(id: string): Promise<Product | null> {
  const products = await loadProducts();
  return products.find((p) => p.id === id) || null;
}

/**
 * 獲取推薦商品
 */
export async function getRelatedProducts(
  productId: string,
  limit: number = 4
): Promise<Product[]> {
  const products = await loadProducts();
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
    typeof p.category === "string"
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
