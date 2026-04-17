/**
 * 應用配置常數
 */

// 網站信息
export const SITE_NAME = "Montbell Online Catalog";
export const SITE_DESCRIPTION = "線上商品目錄 - 經銷商限定";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Google Drive API 配置
export const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || "";
export const GOOGLE_DRIVE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY || "";

// Cron Job 配置
export const CRON_SECRET = process.env.CRON_SECRET || "";

// 圖片配置
export const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
export const VALID_COLOR_CODES = ["bk", "wh", "rd", "bl", "gr", "ye", "pk", "br", "gy", "be"];

// Montbell CDN 配置
// ✅ 已確認：日本官網實際 URL 模式
// 基礎 URL: https://www.montbell.com/storage/products/images/origin
// 模式: {model}_{color}.webp (小寫色碼)
export const MONTBELL_CDN_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_MONTBELL_CDN_URL || "https://www.montbell.com/storage/products/images/origin",
  pattern: process.env.NEXT_PUBLIC_MONTBELL_URL_PATTERN || "{model}_{color}.webp",
  enabled: process.env.NEXT_PUBLIC_MONTBELL_CDN_ENABLED !== "false",
};

// 圖片來源優先順序: Montbell → Google Drive → 本地備份
export const IMAGE_SOURCE_PRIORITY = ["montbell", "google_drive", "local"] as const;

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

// SS27 展示會結單截止日期
export const ORDER_DEADLINE = new Date('2026-05-01T23:59:59Z');
