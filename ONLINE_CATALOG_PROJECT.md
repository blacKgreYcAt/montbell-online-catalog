# 線上商品目錄網站開發指南

## 📋 專案概述

- **專案名稱**：Online Product Catalog
- **技術棧**：Next.js 14 + TypeScript + Tailwind CSS
- **部署**：Vercel (自動 CI/CD)
- **版本管理**：GitHub
- **圖片來源**：Google Drive (自動同步)
- **資料來源**：Excel (手動轉換 JSON)
- **搜尋功能**：全域型號搜尋（客戶端）
- **UI 設計參考**：Mont-Bell 台灣官網風格

---

## 🎯 功能清單

### 核心功能
- [x] 品牌標誌上傳與自訂
- [x] 商品目錄展示（1000+ 商品）
- [x] 全域搜尋（型號、名稱、規格）
- [x] 商品詳情頁面
- [x] 商品分類篩選
- [x] 響應式設計（行動端 / 平板 / 桌面）

### 自動化功能
- [x] Google Drive 圖片自動同步
- [x] Vercel Cron Job 定期掃描
- [x] GitHub 自動部署
- [x] 構建時自動生成映射

---

## 🏗️ 專案架構

```
online-catalog/
├── public/
│   ├── logo.png                 # 品牌標誌（可自訂）
│   ├── hero-banner.jpg          # 首頁橫幅（可自訂）
│   ├── imageMapping.json        # 圖片 ID 映射（自動生成）
│   ├── products.json            # 商品資料（手動維護）
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── layout.tsx           # 根佈局 + 導航欄
│   │   ├── page.tsx             # 首頁
│   │   ├── products/
│   │   │   ├── page.tsx         # 商品目錄頁
│   │   │   └── [id]/
│   │   │       └── page.tsx     # 商品詳情頁
│   │   ├── search/
│   │   │   └── page.tsx         # 搜尋結果頁
│   │   ├── api/
│   │   │   ├── search/
│   │   │   │   └── route.ts     # 搜尋 API
│   │   │   └── sync-images/
│   │   │       └── route.ts     # Cron Job API
│   │   └── favicon.ico
│   │
│   ├── components/
│   │   ├── Header.tsx           # 頂部導航 + Logo
│   │   ├── Footer.tsx           # 頁腳
│   │   ├── ProductCard.tsx      # 商品卡片
│   │   ├── ProductGrid.tsx      # 商品網格
│   │   ├── SearchBar.tsx        # 搜尋欄
│   │   ├── FilterPanel.tsx      # 篩選面板
│   │   ├── BrandHero.tsx        # 品牌焦點區
│   │   └── CategoryNav.tsx      # 分類導航
│   │
│   ├── lib/
│   │   ├── imageUtils.ts        # 圖片 URL 工具
│   │   ├── searchUtils.ts       # 搜尋邏輯
│   │   ├── products.ts          # 商品資料工具
│   │   └── constants.ts         # 常數設定
│   │
│   ├── styles/
│   │   ├── globals.css          # 全域樣式
│   │   └── variables.css        # CSS 變數（品牌色）
│   │
│   └── types/
│       └── index.ts             # TypeScript 類型定義
│
├── scripts/
│   ├── sync-images.js           # 圖片同步腳本
│   └── excel-to-json.js         # Excel 轉 JSON（可選）
│
├── .env.local                   # 本地環境變數
├── .env.production              # 生產環境變數（Vercel）
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── vercel.json                  # Vercel 配置 + Cron Job
```

---

## 📦 環境設置

### 第 1 步：準備 Google Cloud 專案

#### 1.1 建立 Google Cloud 專案

```bash
# 瀏覽器打開
https://console.cloud.google.com

# 步驟：
1. 建立新專案 → 專案名稱：Online-Catalog-2024
2. 等待專案建立完成（約 30 秒）
```

#### 1.2 啟用 Google Drive API

```bash
1. 在 Google Cloud Console 搜尋「Google Drive API」
2. 點擊「啟用」
3. 等待啟用完成
```

#### 1.3 建立服務帳戶

```bash
1. 左側菜單 → API 和服務 → 服務帳戶
2. 建立服務帳戶
   - 帳戶名稱：online-catalog-sync
   - 帳戶 ID：online-catalog-sync
   - 描述：Image sync automation
   - 點擊「建立並繼續」

3. 授予角色：
   - 選擇角色 → 基本 → 檢視者
   - 點擊「繼續」

4. 建立金鑰
   - 點擊「建立金鑰」
   - 金鑰類型：JSON
   - 自動下載 JSON 檔案

5. 保存 JSON 檔案內容
   複製所有內容（包括 { 和 }）
```

#### 1.4 授權 Google Drive 資料夾

```bash
1. 打開你的 Google Drive
   https://drive.google.com

2. 建立資料夾
   - 名稱：product-images-catalog
   - 記下資料夾 ID（URL 中 /folders/ 後面的部分）
   
   URL 範例：
   https://drive.google.com/drive/folders/1abc2Def3gHi4Jkl5Mno6pQr7sTu8vwx
                                            ↑
                                      這是 FOLDER_ID

3. 上傳範例圖片
   - 檔名格式：k_型號_顏色.jpg
   - 範例：
     * k_1234567_bk.jpg
     * k_1234567_wh.jpg
     * k_2345678_rd.jpg

4. 分享給服務帳戶
   - 右鍵資料夾 → 共用
   - 貼上服務帳戶信箱：
     online-catalog-sync@YOUR_PROJECT_ID.iam.gserviceaccount.com
   - 權限：編輯（或檢視者即可）
```

---

### 第 2 步：初始化 Next.js 專案

#### 2.1 建立項目

```bash
# 建立 Next.js 專案
npx create-next-app@latest online-catalog \
  --typescript \
  --tailwind \
  --app \
  --eslint

cd online-catalog
```

#### 2.2 安裝依賴

```bash
npm install \
  googleapis \
  dotenv \
  fuse.js \
  axios

# 開發依賴
npm install --save-dev \
  @types/node \
  @types/react
```

#### 2.3 建立環境檔案：`.env.local`

```env
# Google Cloud 設置
GOOGLE_DRIVE_FOLDER_ID=你的資料夾ID_替換此項

# Cron Job 認證（自訂密鑰）
CRON_SECRET=your-super-secret-cron-key-change-this

# Google Cloud 認證（複製 JSON 檔案內容）
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"YOUR_PROJECT_ID","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"online-catalog-sync@YOUR_PROJECT_ID.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
```

> ⚠️ **重要**：`.env.local` 只在本地使用，不會上傳到 GitHub

---

## 🔧 核心代碼實作

### 第 1 部分：Google Drive 同步腳本

#### 文件：`scripts/sync-images.js`

```javascript
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// 從環境變數讀取 Google Cloud 認證
const credentials = JSON.parse(
  process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '{}'
);

const drive = google.drive({
  version: 'v3',
  auth: new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
  })
});

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

async function syncImages() {
  try {
    console.log('🔄 開始同步 Google Drive 圖片...');
    console.log(`📁 資料夾 ID: ${FOLDER_ID}`);

    // 查詢資料夾內所有圖片
    const response = await drive.files.list({
      q: `'${FOLDER_ID}' in parents and trashed=false`,
      spaces: 'drive',
      fields: 'files(id, name, mimeType)',
      pageSize: 1000,
      supportsAllDrives: true
    });

    const imageMapping = {};
    const images = response.data.files || [];

    // 篩選圖片檔案
    const imageFiles = images.filter(file => {
      const isImage = file.mimeType.startsWith('image/');
      const isValidFormat = /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name);
      return isImage && isValidFormat;
    });

    console.log(`✅ 找到 ${imageFiles.length} 張圖片`);

    // 建立映射：檔名（不含副檔名）→ FILE_ID
    imageFiles.forEach(file => {
      // 移除副檔名
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      imageMapping[nameWithoutExt] = file.id;
      console.log(`  ✓ ${file.name} → ${file.id}`);
    });

    // 保存到 public/imageMapping.json
    const outputPath = path.join(__dirname, '../public/imageMapping.json');
    
    // 確保 public 目錄存在
    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }

    fs.writeFileSync(
      outputPath,
      JSON.stringify(imageMapping, null, 2),
      'utf-8'
    );

    console.log(`\n✨ 同步完成！`);
    console.log(`📊 映射項目數: ${Object.keys(imageMapping).length}`);
    console.log(`💾 已保存至: ${outputPath}`);

  } catch (error) {
    console.error('❌ 同步失敗:', error.message);
    if (error.message.includes('404')) {
      console.error('   → 資料夾 ID 不正確或無權限');
    }
    if (error.message.includes('401')) {
      console.error('   → Google 認證失敗，檢查環境變數');
    }
    process.exit(1);
  }
}

// 執行同步
syncImages();
```

#### 更新 `package.json`

```json
{
  "scripts": {
    "dev": "npm run sync:images && next dev",
    "build": "npm run sync:images && next build",
    "start": "next start",
    "sync:images": "node scripts/sync-images.js",
    "lint": "next lint"
  }
}
```

---

### 第 2 部分：資料類型定義

#### 文件：`src/types/index.ts`

```typescript
// 商品類型
export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  color: string;
  colorName: string;
  specs: {
    [key: string]: string;
  };
  description: string;
  images: {
    filename: string;
    alt: string;
  }[];
  price?: number;
  inStock?: boolean;
  tags?: string[];
}

// 搜尋結果類型
export interface SearchResult {
  products: Product[];
  totalCount: number;
  query: string;
}

// 品牌設置類型
export interface BrandConfig {
  name: string;
  logo: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  primaryColor: string;
  secondaryColor: string;
  description?: string;
}

// 圖片映射類型
export interface ImageMapping {
  [filename: string]: string; // filename → FILE_ID
}
```

---

### 第 3 部分：圖片工具函數

#### 文件：`src/lib/imageUtils.ts`

```typescript
import { ImageMapping } from '@/types';

// 在構建時靜態導入，運行時使用快取
let cachedMapping: ImageMapping | null = null;

export async function getImageMapping(): Promise<ImageMapping> {
  if (cachedMapping) {
    return cachedMapping;
  }

  try {
    const mapping = await import('@/public/imageMapping.json');
    cachedMapping = mapping.default || mapping;
    return cachedMapping;
  } catch {
    console.warn('⚠️ imageMapping.json not found, returning empty mapping');
    return {};
  }
}

/**
 * 取得 Google Drive 圖片直連 URL
 * @param filename - 圖片檔名（不含副檔名）
 * @returns Google Drive 直連 URL 或 null
 */
export async function getImageUrl(filename: string): Promise<string | null> {
  const mapping = await getImageMapping();
  const fileId = mapping[filename];

  if (!fileId) {
    console.warn(`❌ 找不到圖片: ${filename}`);
    return null;
  }

  // Google Drive 直連格式
  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

/**
 * 批量取得圖片 URL
 */
export async function getImageUrls(filenames: string[]): Promise<(string | null)[]> {
  return Promise.all(filenames.map(f => getImageUrl(f)));
}

/**
 * 產生圖片 srcset（響應式）
 */
export async function getImageSrcSet(filename: string): Promise<string> {
  const url = await getImageUrl(filename);
  if (!url) return '';

  // Google Drive 支持尺寸參數
  return `
    ${url}=w300 300w,
    ${url}=w600 600w,
    ${url}=w900 900w,
    ${url}=w1200 1200w
  `.trim();
}
```

---

### 第 4 部分：搜尋工具

#### 文件：`src/lib/searchUtils.ts`

```typescript
import Fuse from 'fuse.js';
import { Product, SearchResult } from '@/types';

/**
 * 初始化 Fuse.js 搜尋引擎
 */
export function initializeSearch(products: Product[]): Fuse<Product> {
  return new Fuse(products, {
    keys: [
      { name: 'sku', weight: 0.9 },          // SKU 最重要
      { name: 'name', weight: 0.7 },         // 產品名稱
      { name: 'category', weight: 0.5 },     // 分類
      { name: 'colorName', weight: 0.4 },    // 顏色名稱
      { name: 'description', weight: 0.3 }   // 描述
    ],
    threshold: 0.3,  // 模糊比對寬鬆度
    minMatchCharLength: 2
  });
}

/**
 * 執行搜尋
 */
export function search(
  query: string,
  products: Product[]
): SearchResult {
  if (!query.trim()) {
    return {
      products: [],
      totalCount: 0,
      query: ''
    };
  }

  const fuse = initializeSearch(products);
  const results = fuse.search(query);

  return {
    products: results.map(result => result.item),
    totalCount: results.length,
    query
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
  return products.filter(p => p.category === category);
}

/**
 * 按顏色篩選
 */
export function filterByColor(
  products: Product[],
  color: string
): Product[] {
  if (!color) return products;
  return products.filter(p => p.color === color);
}

/**
 * 取得所有分類
 */
export function getCategories(products: Product[]): string[] {
  return Array.from(new Set(products.map(p => p.category))).sort();
}

/**
 * 取得所有顏色
 */
export function getColors(products: Product[]): string[] {
  return Array.from(new Set(products.map(p => p.color))).sort();
}
```

---

### 第 5 部分：商品資料工具

#### 文件：`src/lib/products.ts`

```typescript
import { Product } from '@/types';

let cachedProducts: Product[] | null = null;

/**
 * 載入所有商品資料
 */
export async function getAllProducts(): Promise<Product[]> {
  // 開發時，每次都重新載入以支持熱重載
  if (process.env.NODE_ENV === 'development') {
    return loadProductsFromFile();
  }

  // 生產時，使用快取
  if (cachedProducts) {
    return cachedProducts;
  }

  cachedProducts = await loadProductsFromFile();
  return cachedProducts;
}

/**
 * 從 JSON 檔案載入產品
 */
async function loadProductsFromFile(): Promise<Product[]> {
  try {
    const products = await import('@/public/products.json');
    return products.default || products;
  } catch (error) {
    console.error('❌ 載入 products.json 失敗:', error);
    return [];
  }
}

/**
 * 按 ID 取得單個商品
 */
export async function getProductById(id: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find(p => p.id === id || p.sku === id) || null;
}

/**
 * 按 SKU 取得商品
 */
export async function getProductBySku(sku: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find(p => p.sku === sku) || null;
}

/**
 * 分頁取得商品
 */
export async function getPaginatedProducts(
  page: number = 1,
  pageSize: number = 12
): Promise<{
  products: Product[];
  total: number;
  pages: number;
  currentPage: number;
}> {
  const allProducts = await getAllProducts();
  const total = allProducts.length;
  const pages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    products: allProducts.slice(start, end),
    total,
    pages,
    currentPage: page
  };
}

/**
 * 取得推薦商品
 */
export async function getFeaturedProducts(limit: number = 6): Promise<Product[]> {
  const products = await getAllProducts();
  // 返回前 N 個產品作為推薦
  return products.slice(0, limit);
}
```

---

### 第 6 部分：API Routes

#### 文件：`src/app/api/search/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { search } from '@/lib/searchUtils';
import { getAllProducts } from '@/lib/products';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json({
        products: [],
        totalCount: 0,
        query: ''
      });
    }

    const products = await getAllProducts();
    const results = search(query, products);

    return NextResponse.json(results);
  } catch (error) {
    console.error('搜尋錯誤:', error);
    return NextResponse.json(
      { error: '搜尋失敗' },
      { status: 500 }
    );
  }
}
```

#### 文件：`src/app/api/sync-images/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  try {
    // 驗證 Cron 密鑰
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

    if (authHeader !== expectedAuth) {
      return NextResponse.json(
        { error: '未授權' },
        { status: 401 }
      );
    }

    console.log('🔄 Cron Job 觸發：開始同步圖片...');

    // 執行圖片同步腳本
    await execAsync('npm run sync:images');

    console.log('✅ 圖片同步完成');

    // 提交到 GitHub（自動部署）
    try {
      await execAsync(`
        git config --global user.email "sync@bot.local"
        git config --global user.name "Image Sync Bot"
        git add public/imageMapping.json
        git commit -m "🤖 Auto: Sync images from Google Drive" || true
        git push origin main
      `);
      console.log('✅ GitHub 已推送');
    } catch (gitError) {
      console.warn('⚠️ Git 推送失敗（可能沒有變更）:', gitError);
    }

    return NextResponse.json({
      success: true,
      message: '圖片同步完成',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 同步失敗:', error);
    return NextResponse.json(
      { error: '同步失敗', details: String(error) },
      { status: 500 }
    );
  }
}
```

---

### 第 7 部分：核心頁面元件

#### 文件：`src/components/Header.tsx`

```typescript
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">📦</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline">
              Catalog
            </span>
          </Link>

          {/* 導航菜單 - 桌面版 */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="/products" className="text-gray-700 hover:text-blue-600">
              商品目錄
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600">
              關於
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600">
              聯絡
            </Link>
          </nav>

          {/* 搜尋欄 */}
          <div className="hidden sm:block flex-1 max-w-xs mx-4">
            <input
              type="text"
              placeholder="搜尋型號..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 行動選單按鈕 */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* 行動選單 */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/products" className="block px-4 py-2 hover:bg-gray-50">
              商品目錄
            </Link>
            <Link href="/about" className="block px-4 py-2 hover:bg-gray-50">
              關於
            </Link>
            <Link href="/contact" className="block px-4 py-2 hover:bg-gray-50">
              聯絡
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
```

#### 文件：`src/components/ProductCard.tsx`

```typescript
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { getImageUrl } from '@/lib/imageUtils';

interface ProductCardProps {
  product: Product;
}

export default async function ProductCard({ product }: ProductCardProps) {
  // 取得第一張圖片
  const imageUrl = product.images.length > 0 
    ? await getImageUrl(product.images[0].filename)
    : null;

  return (
    <Link href={`/products/${product.sku}`}>
      <div className="group bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden cursor-pointer">
        
        {/* 圖片容器 */}
        <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.images[0]?.alt || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">無圖片</span>
            </div>
          )}
        </div>

        {/* 資訊 */}
        <div className="p-4">
          <div className="text-xs text-gray-500 mb-1">
            {product.category}
          </div>
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {product.color} / {product.colorName}
            </span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {product.sku}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

#### 文件：`src/app/page.tsx`（首頁）

```typescript
import Link from 'next/link';
import { getAllProducts, getFeaturedProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export default async function Home() {
  const featuredProducts = await getFeaturedProducts(6);

  return (
    <div>
      {/* 英雄區 */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            線上商品目錄
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            探索 1000+ 優質商品 • 全球運送
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50"
          >
            瀏覽全部商品
          </Link>
        </div>
      </section>

      {/* 推薦商品 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">推薦商品</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA 區 */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">準備好探索了嗎？</h2>
          <p className="text-gray-600 mb-8 text-lg">
            瀏覽完整的商品目錄，使用全域搜尋找到你想要的型號。
          </p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            開始探索 →
          </Link>
        </div>
      </section>
    </div>
  );
}
```

---

### 第 8 部分：商品頁面

#### 文件：`src/app/products/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { getCategories, filterByCategory } from '@/lib/searchUtils';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 載入商品資料
    import('@/public/products.json').then(data => {
      const prods = data.default || data;
      setProducts(prods);
      setFilteredProducts(prods);
      setCategories(getCategories(prods));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let filtered = products;

    // 按分類篩選
    if (selectedCategory) {
      filtered = filterByCategory(filtered, selectedCategory);
    }

    // 按搜尋查詢篩選
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.sku.includes(searchQuery) ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, products]);

  if (loading) {
    return <div className="p-8 text-center">載入中...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">商品目錄</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 篩選側邊欄 */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-4">篩選</h3>

            {/* 搜尋 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                搜尋
              </label>
              <input
                type="text"
                placeholder="型號或名稱..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 分類 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分類
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                    selectedCategory === ''
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  全部
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                      selectedCategory === cat
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 商品網格 */}
        <div className="lg:col-span-3">
          <div className="mb-4 text-gray-600">
            找到 {filteredProducts.length} 個商品
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>找不到符合條件的商品</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

#### 文件：`src/app/products/[id]/page.tsx`

```typescript
import { notFound } from 'next/navigation';
import { Product } from '@/types';
import { getImageUrl } from '@/lib/imageUtils';
import Image from 'next/image';

export default async function ProductDetail({
  params
}: {
  params: { id: string }
}) {
  // 載入商品資料
  const productsModule = await import('@/public/products.json');
  const products: Product[] = productsModule.default || productsModule;

  // 按 SKU 查找商品
  const product = products.find(p => p.sku === params.id);

  if (!product) {
    notFound();
  }

  // 取得圖片 URL
  const imageUrls = await Promise.all(
    product.images.map(img => getImageUrl(img.filename))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 圖片 */}
        <div className="space-y-4">
          {imageUrls[0] && (
            <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={imageUrls[0]}
                alt={product.images[0]?.alt || product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
          
          {/* 縮圖 */}
          <div className="grid grid-cols-4 gap-2">
            {imageUrls.map((url, idx) => 
              url ? (
                <div key={idx} className="relative aspect-square bg-gray-100 rounded cursor-pointer overflow-hidden">
                  <Image
                    src={url}
                    alt={product.images[idx]?.alt || `${product.name} ${idx + 1}`}
                    fill
                    className="object-cover hover:opacity-75"
                  />
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* 資訊 */}
        <div>
          <div className="text-sm text-gray-500 mb-2">
            {product.category}
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            {product.name}
          </h1>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">型號</p>
            <p className="text-2xl font-bold text-blue-600">
              {product.sku}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">顏色</h3>
            <p className="text-gray-700">
              {product.color} - {product.colorName}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">規格</h3>
            <div className="space-y-2">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 text-sm">
                  <span className="text-gray-500">{key}</span>
                  <span className="col-span-2 font-medium text-gray-900">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">描述</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* CTA 按鈕 */}
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
              詢問購買
            </button>
            <button className="w-full bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-300">
              加入願望清單
            </button>
          </div>
        </div>
      </div>

      {/* 相關商品 */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">相關商品</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {products
            .filter(p => 
              p.category === product.category && 
              p.sku !== product.sku
            )
            .slice(0, 4)
            .map(p => (
              <div key={p.sku} className="text-center">
                <p className="font-medium text-sm">{p.name}</p>
                <p className="text-gray-500 text-xs">{p.sku}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
```

---

### 第 9 部分：Vercel 配置

#### 文件：`vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/sync-images",
      "schedule": "0 21 * * 1"
    }
  ]
}
```

---

### 第 10 部分：Next.js 配置

#### 文件：`next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/d/**'
      }
    ],
    unoptimized: false,
    formats: ['image/avif', 'image/webp']
  },
  
  // 確保 public 文件夾被包含
  publicRuntimeConfig: {
    // 此選項在運行時無法訪問，但是構建時會包含
  }
};

module.exports = nextConfig;
```

---

## 📊 商品資料格式

### `public/products.json` 結構

```json
[
  {
    "id": "prod_001",
    "sku": "1234567",
    "name": "登山背包 50L",
    "category": "背包",
    "color": "BK",
    "colorName": "黑色",
    "specs": {
      "容量": "50 升",
      "材質": "高密度尼龍",
      "重量": "1.2 公斤",
      "防水": "是",
      "保修": "2 年"
    },
    "description": "專業級登山背包，採用耐用的高密度尼龍材料製造。提供多個儲存口袋和人體工學設計。適合多日登山和露營。",
    "images": [
      {
        "filename": "k_1234567_bk",
        "alt": "登山背包黑色 - 前視圖"
      },
      {
        "filename": "k_1234567_bk_side",
        "alt": "登山背包黑色 - 側視圖"
      }
    ],
    "tags": ["登山", "戶外", "背包"],
    "inStock": true,
    "price": 2499
  },
  {
    "id": "prod_002",
    "sku": "2345678",
    "name": "登山背包 50L",
    "category": "背包",
    "color": "RD",
    "colorName": "紅色",
    "specs": {
      "容量": "50 升",
      "材質": "高密度尼龍",
      "重量": "1.2 公斤",
      "防水": "是",
      "保修": "2 年"
    },
    "description": "專業級登山背包，採用耐用的高密度尼龍材料製造。提供多個儲存口袋和人體工學設計。適合多日登山和露營。",
    "images": [
      {
        "filename": "k_2345678_rd",
        "alt": "登山背包紅色 - 前視圖"
      }
    ],
    "tags": ["登山", "戶外", "背包"],
    "inStock": true,
    "price": 2499
  }
]
```

---

## 🚀 部署步驟

### 第 1 步：建立 GitHub 倉庫

```bash
# 初始化 Git
git init
git add .
git commit -m "Initial commit: Online Catalog Project"

# 建立遠程倉庫
# 在 GitHub.com 建立新倉庫 → online-catalog

# 推送到 GitHub
git remote add origin https://github.com/你的帳號/online-catalog.git
git branch -M main
git push -u origin main
```

### 第 2 步：連結 Vercel

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署到 Vercel
vercel

# 根據提示操作：
# 1. 連結 GitHub 帳號
# 2. 選擇專案
# 3. 確認設定
```

### 第 3 步：配置 Vercel 環境變數

登入 Vercel 儀表板 → 你的專案 → Settings → Environment Variables

新增以下變數：

```
GOOGLE_DRIVE_FOLDER_ID = 你的資料夾ID
CRON_SECRET = 你的密鑰
GOOGLE_APPLICATION_CREDENTIALS_JSON = 完整JSON內容
```

### 第 4 步：測試自動部署

```bash
# 本地測試
npm run dev

# 推送到 GitHub 觸發自動部署
git push origin main
```

---

## 🎨 品牌自訂指南

### 1. Logo 上傳

```bash
# 將你的 logo 檔案放到：
public/logo.png    # 推薦 512x512px PNG，透明背景

# 在 Header.tsx 中更新
<Image
  src="/logo.png"
  alt="Brand Logo"
  width={40}
  height={40}
/>
```

### 2. 品牌色自訂

#### `src/styles/variables.css`

```css
:root {
  --color-primary: #1e40af;      /* 主要色 */
  --color-secondary: #1e3a8a;    /* 次要色 */
  --color-accent: #dc2626;       /* 強調色 */
  --color-background: #f9fafb;   /* 背景色 */
  --color-text: #1f2937;         /* 文字色 */
}
```

#### 在 Tailwind 中使用

編輯 `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
      },
    },
  },
  plugins: [],
}
export default config
```

### 3. 首頁橫幅

```bash
# 上傳橫幅圖片
public/hero-banner.jpg

# 在 src/app/page.tsx 中更新
<div 
  className="relative h-96 bg-cover bg-center"
  style={{backgroundImage: 'url(/hero-banner.jpg)'}}
>
  {/* 內容 */}
</div>
```

---

## 🔍 Excel → JSON 轉換指南

### 方法 A：手動使用 Claude Code

1. 在 Claude Code 中建立 `scripts/excel-to-json.js`
2. 上傳 Excel 檔案
3. 執行轉換
4. 複製結果到 `public/products.json`

### 方法 B：自動化腳本

#### `scripts/excel-to-json.js`

```javascript
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 讀取 Excel 檔案
const excelPath = process.argv[2] || './products.xlsx';

if (!fs.existsSync(excelPath)) {
  console.error(`❌ 檔案不存在: ${excelPath}`);
  process.exit(1);
}

const workbook = XLSX.readFile(excelPath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

// 轉換為產品格式
const products = data.map((row, index) => ({
  id: `prod_${String(index + 1).padStart(6, '0')}`,
  sku: row.SKU,
  name: row['名稱'],
  category: row['分類'] || '未分類',
  color: row['顏色代碼'],
  colorName: row['顏色名稱'],
  specs: {
    '材質': row['材質'] || 'N/A',
    '重量': row['重量'] || 'N/A',
    '尺寸': row['尺寸'] || 'N/A',
    '保修': row['保修'] || '1年'
  },
  description: row['描述'] || '',
  images: [
    { filename: `k_${row.SKU}_${row['顏色代碼'].toLowerCase()}`, alt: `${row['名稱']} - 正面` }
  ],
  tags: (row['標籤'] || '').split(',').map(t => t.trim()),
  inStock: row['庫存'] ? true : false,
  price: parseInt(row['價格']) || 0
}));

// 保存為 JSON
const outputPath = path.join(__dirname, '../public/products.json');
fs.writeFileSync(outputPath, JSON.stringify(products, null, 2), 'utf-8');

console.log(`✅ 轉換完成！`);
console.log(`📊 產品數: ${products.length}`);
console.log(`💾 已保存至: ${outputPath}`);
```

使用方式：
```bash
npm install xlsx
node scripts/excel-to-json.js /path/to/your/products.xlsx
```

---

## 🐛 故障排查

### 問題 1：圖片無法載入

**症狀**：顯示「無圖片」

**解決方案**：
```bash
# 1. 檢查 Google Drive 資料夾是否公開
# 2. 驗證檔名規則：k_型號_顏色.jpg
# 3. 執行手動同步
npm run sync:images

# 4. 檢查 imageMapping.json 是否存在
cat public/imageMapping.json
```

### 問題 2：Cron Job 未觸發

**症狀**：Vercel 日誌中沒有 sync-images 記錄

**解決方案**：
```bash
# 1. 檢查 Vercel 環境變數
vercel env ls

# 2. 檢查 vercel.json Cron 設定
cat vercel.json

# 3. 測試 API 端點
curl https://your-domain.com/api/sync-images \
  -H "Authorization: Bearer your-cron-secret"
```

### 問題 3：Git 推送失敗

**症狀**：Vercel 日誌顯示「git push 失敗」

**解決方案**：
```bash
# 1. 在 Vercel 建立 GitHub 部署金鑰
# 專案設定 → Git Configuration

# 2. 或改用 GitHub Actions 替代 Cron Job
# 建立 .github/workflows/sync-images.yml
```

### 問題 4：Google Drive 認證失敗

**症狀**：錯誤 401 或 403

**解決方案**：
```bash
# 1. 驗證 credentials.json 格式
cat $GOOGLE_APPLICATION_CREDENTIALS_JSON | jq .

# 2. 確認服務帳戶有資料夾共用權限
# Google Drive → 分享設定 → 確認服務帳戶信箱

# 3. 檢查 Google Drive API 是否已啟用
# Google Cloud Console → API 和服務 → 已啟用的 API
```

---

## 📅 更新流程檢查表

### 每半年更新

- [ ] 1. 編輯 Excel 商品資訊
- [ ] 2. 用 Claude Code 轉換為 `products.json`
- [ ] 3. 上傳新圖片到 Google Drive
- [ ] 4. 執行 `npm run sync:images`
- [ ] 5. `git push` 到 GitHub
- [ ] 6. Vercel 自動部署
- [ ] 7. 驗證網站是否正常顯示新商品

### 定期維護（每月）

- [ ] 檢查 Vercel 日誌中的錯誤
- [ ] 驗證圖片載入是否正常
- [ ] 檢查搜尋功能
- [ ] 測試商品詳情頁面

---

## 📚 有用的資源

- **Next.js 文件**：https://nextjs.org/docs
- **Tailwind CSS**：https://tailwindcss.com/docs
- **Google Drive API**：https://developers.google.com/drive/api
- **Vercel 部署**：https://vercel.com/docs
- **TypeScript**：https://www.typescriptlang.org/docs/

---

## ✅ 完成檢查清單

### 開發前準備
- [ ] 建立 Google Cloud 專案
- [ ] 啟用 Google Drive API
- [ ] 建立服務帳戶與 JSON 金鑰
- [ ] 建立 Google Drive 資料夾
- [ ] 準備商品 Excel 檔案
- [ ] 上傳 1-2 張示例圖片到 Drive

### 本地開發
- [ ] 初始化 Next.js 專案
- [ ] 複製本指南中的代碼
- [ ] 設置 `.env.local`
- [ ] 執行 `npm run dev` 測試
- [ ] 驗證圖片同步功能
- [ ] 測試搜尋功能

### 部署前
- [ ] 建立 GitHub 倉庫
- [ ] 推送代碼到 GitHub
- [ ] 在 Vercel 連結倉庫
- [ ] 設置 Vercel 環境變數
- [ ] 配置 Cron Job

### 部署後
- [ ] 測試生產環境
- [ ] 驗證 Cron Job（等待下次執行時間）
- [ ] 測試首次完整更新流程
- [ ] 分享網址給測試用戶
- [ ] 收集反饋並改進

---

## 🎉 恭喜！

你的線上商品目錄已準備完成！

**下一步**：
1. 用 Claude Code 打開此檔案
2. 按照步驟建立專案
3. 上傳你的品牌資訊
4. 享受自動化的便利！

有任何問題？隨時詢問 Claude！
