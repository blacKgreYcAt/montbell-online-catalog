/**
 * 商品數據結構
 */
export interface Product {
  id: string;
  modelNumber: string;
  name: string;
  category: string;
  description?: string;
  price?: number;
  specifications?: Record<string, string>;
  colors?: string[];
  sizes?: string[];
  images?: {
    [color: string]: string;
  };
  releaseDate?: string;
  discontinued?: boolean;
  isNew?: boolean;
  badge?: string;
  pageNumber?: number;
}

/**
 * 搜尋結果
 */
export interface SearchResult {
  products: Product[];
  total: number;
  query: string;
}

/**
 * 圖片映射
 */
export interface ImageMapping {
  [key: string]: string; // filename -> Google Drive file ID
}

/**
 * 分類選項
 */
export interface Category {
  id: string;
  name: string;
  count: number;
}

/**
 * API 響應格式
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
