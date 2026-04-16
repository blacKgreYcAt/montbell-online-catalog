/**
 * 應用配置常數
 */

// 網站信息
export const SITE_NAME = "Montbell Online Catalog";
export const SITE_DESCRIPTION = "線上商品目錄 - 探索蒙貝爾的完整產品系列";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Google Drive API 配置
export const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || "";
export const GOOGLE_DRIVE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY || "";

// Cron Job 配置
export const CRON_SECRET = process.env.CRON_SECRET || "";

// 圖片配置
export const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
export const VALID_COLOR_CODES = ["bk", "wh", "rd", "bl", "gr", "ye", "pk", "br", "gy", "be"];

// 搜尋配置
export const SEARCH_KEYS = ["modelNumber", "name", "category"];
export const SEARCH_THRESHOLD = 0.1; // Fuse.js 相似度閾值 (更嚴格的匹配)

// 分頁配置
export const ITEMS_PER_PAGE = 12;
export const MAX_SEARCH_RESULTS = 2000; // 支援大型目錄 (1,152 商品)

// 導出路由
export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  SEARCH: "/search",
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
};
