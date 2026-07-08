# 🏔️ Montbell Online Catalog 項目文檔

**完整項目記錄 - 用於持續開發和維護**

---

## 📋 目錄

1. [項目概述](#項目概述)
2. [技術棧](#技術棧)
3. [項目結構](#項目結構)
4. [功能說明](#功能說明)
5. [安裝和開發](#安裝和開發)
6. [部署指南](#部署指南)
7. [環境變數](#環境變數)
8. [關鍵文件說明](#關鍵文件說明)
9. [數據結構](#數據結構)
10. [API 路由](#api-路由)
11. [已完成的功能](#已完成的功能)
12. [已知問題和改進計畫](#已知問題和改進計畫)
13. [開發歷程](#開發歷程)

---

## 項目概述

### 項目名稱
**Montbell Online Catalog** (蒙貝爾線上商品目錄)

### 版本
v0.5.0

### 項目描述
為日本戶外品牌 Montbell 的台灣經銷商設計的 **FW27 展示會線上商品目錄系統**。
支持公開版（經銷商版）和內部版（內部作業版）兩個界面。

### 主要特色
- ✅ 1,261 件公開商品展示（含詳細規格和圖片）
- ✅ 181 件內部作業商品（含價格）
- ✅ 高性能搜索和分類過濾
- ✅ 響應式設計（移動/平板/桌面）
- ✅ 時間限制的自動開放/關閉機制
- ✅ 內部版認證保護
- ✅ Google Drive 和 Cloudinary CDN 圖片集成

### 使用者
- **經銷商版**: 公開可訪問（展示會期間）
- **內部版**: 需認證 (密碼: FUTAI12012403)

### 上線時間
- **首次部署**: 2026-06-18
- **公開版本**: https://montbell-online-catalog.vercel.app
- **當前狀態**: ✅ 正在運營

---

## 技術棧

### 核心框架
- **Next.js**: 16.2.3 (App Router)
- **React**: 19.2.4
- **TypeScript**: 5.x
- **Tailwind CSS**: 4.x

### 工具庫
| 庫 | 版本 | 用途 |
|---|------|------|
| **fuse.js** | 7.0.0 | 高性能模糊搜索 |
| **axios** | 1.7.0 | HTTP 客户端 |
| **googleapis** | 140.0.0 | Google Drive API |
| **cloudinary** | 2.10.0 | CDN 圖片優化 |
| **dotenv** | 16.4.5 | 環境變數管理 |

### 部署平台
- **Vercel**: 自動部署 (main 分支)
- **GitHub**: 版本控制
- **Google Drive**: 圖片存儲
- **Cloudinary**: CDN 和圖片優化

### 開發工具
- **ESLint**: 代碼檢查
- **Node.js**: 運行環境

---

## 項目結構

```
montbell-online-catalog/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx               # 全局布局
│   │   ├── page.tsx                 # 首頁 (品牌介紹)
│   │   ├── closed/
│   │   │   └── page.tsx             # 截止日期後的關閉頁面
│   │   ├── products/
│   │   │   ├── page.tsx             # 公開版商品列表
│   │   │   └── [id]/page.tsx        # 公開版商品詳情
│   │   ├── search/
│   │   │   └── page.tsx             # 公開版搜索頁面
│   │   ├── internal/
│   │   │   ├── auth/
│   │   │   │   └── page.tsx         # 內部版認證頁面
│   │   │   ├── products/
│   │   │   │   ├── page.tsx         # 內部版商品列表
│   │   │   │   └── [id]/page.tsx    # 內部版商品詳情 (含價格)
│   │   │   └── search/
│   │   │       └── page.tsx         # 內部版搜索
│   │   └── api/
│   │       ├── search/
│   │       │   └── route.ts         # 搜索 API
│   │       └── sync-images/
│   │           └── route.ts         # 圖片同步 API (Cron Job)
│   │
│   ├── components/                   # React 組件
│   │   ├── ProductCard.tsx          # 商品卡片 (帶價格)
│   │   ├── ProductGrid.tsx          # 商品網格
│   │   ├── FilterPanel.tsx          # 分類過濾面板
│   │   ├── SearchBar.tsx            # 搜索欄
│   │   ├── Header.tsx               # 頁面頭部
│   │   ├── Footer.tsx               # 頁面底部
│   │   ├── CategoryNav.tsx          # 分類導航 (水平和側欄)
│   │   ├── AuthGuard.tsx            # 認證檢查組件
│   │   ├── DeadlineGuard.tsx        # 截止日期檢查組件
│   │   ├── DeadlineWarning.tsx      # 截止日期警告彈窗
│   │   ├── OrderDeadlineModal.tsx   # 結單倒計時模態框
│   │   ├── ErrorBoundary.tsx        # 錯誤邊界
│   │   ├── BrandHero.tsx            # 品牌宣傳區
│   │   ├── SeasonIndicator.tsx      # 季節指示器
│   │   └── index.ts                 # 組件導出
│   │
│   ├── lib/                         # 工具函數和邏輯
│   │   ├── products.ts              # 商品加載邏輯
│   │   ├── imageUtils.ts            # 圖片 URL 生成
│   │   ├── imageMapping.ts          # 圖片映射表
│   │   ├── searchUtils.ts           # 搜索和過濾邏輯
│   │   ├── categories.ts            # 分類映射
│   │   ├── categoryTranslations.ts  # 分類標籤翻譯
│   │   ├── deadlineCheck.ts         # 截止日期檢查 ⭐
│   │   ├── internalAuth.ts          # 認證邏輯
│   │   ├── constants.ts             # 全局常數
│   │   └── mockData.ts              # 測試數據
│   │
│   └── types/
│       └── index.ts                 # TypeScript 類型定義
│
├── public/                          # 靜態資產
│   ├── products.json               # 1,261 件公開商品
│   ├── products-internal.json      # 181 件內部商品 (含價格)
│   ├── no-image.svg                # 缺失圖片占位符
│   └── montbell-logo.svg           # 品牌 Logo
│
├── scripts/
│   ├── sync-images.js              # 圖片同步腳本
│   └── fix-duplicates.js           # 移除重複商品腳本
│
├── .claude/
│   └── settings.local.json         # Claude Code 設置
│
├── next.config.ts                  # Next.js 配置
├── tsconfig.json                   # TypeScript 配置
├── tailwind.config.ts              # Tailwind CSS 配置
├── postcss.config.js               # PostCSS 配置
├── eslintrc.json                   # ESLint 配置
├── .env.local                      # 環境變數 (本地)
├── .env.example                    # 環境變數模板
├── .gitignore                      # Git 忽略規則
├── package.json                    # 項目依賴
├── package-lock.json               # 依賴鎖定文件
│
└── WORK_SESSION_*.md               # 工作歷程記錄 (多個文件)
```

---

## 功能說明

### 公開版功能 (經銷商版)

#### 1. 商品列表展示
- **位置**: `/products`
- **功能**:
  - 顯示 1,261 件商品
  - 按分類過濾 (37 個分類)
  - 支持側欄分類選擇
  - 顯示商品卡片 (圖片、型號、名稱、分類、顏色、價格)
  - 響應式網格布局

#### 2. 商品搜索
- **位置**: `/search` 或 `/products` 搜索欄
- **功能**:
  - Fuse.js 模糊搜索
  - 支持按型號、名稱、分類、描述搜索
  - 中文模糊匹配支持
  - 搜索閾值: 0.3 (靈敏搜索)

#### 3. 商品詳情
- **位置**: `/products/[id]`
- **功能**:
  - 商品圖片 (多色彩選擇)
  - 完整規格和特性
  - 描述和用途
  - 相關商品推薦
  - 頁碼標記

#### 4. 價格顯示
- **新增功能**: 公開版現已顯示 NT$ 價格
- **格式**: NT$4,040 (帶千位符)
- **位置**: 商品卡片和詳情頁

---

### 內部版功能 (內部作業版)

#### 1. 認證系統
- **位置**: `/internal/auth`
- **認證方式**: 密碼 (localStorage 存儲)
- **密碼**: FUTAI12012403
- **功能**: 保護內部版本訪問

⚠️ **注意**: 當前認證是純客户端實現，安全性較低。6月29日後計畫改進為服務器端驗證。

#### 2. 內部商品列表
- **位置**: `/internal/products`
- **功能**:
  - 顯示 181 件內部作業商品
  - 包含價格 (NT$ 格式)
  - 相同的分類和搜索功能
  - 標識為 "內部版 - FW27 新品展示"

#### 3. 內部商品詳情
- **位置**: `/internal/products/[id]`
- **功能**:
  - 商品價格顯示 (NT$11,630 等)
  - 完整規格信息
  - 相關商品推薦
  - Google Drive 圖片加載

#### 4. 內部搜索
- **位置**: `/internal/search`
- **功能**: 與公開版相同，但僅限內部商品

---

### 共同功能

#### 1. 截止日期機制 ⭐
- **當前截止日期**: 2026-07-09 17:00
- **功能**:
  - 自動檢查當前時間
  - 超過截止日期自動重定向到 `/closed` 頁面
  - 顯示倒計時警告
  - 防止用戶訪問商品

**修改方法**: 編輯 `src/lib/deadlineCheck.ts`

#### 2. 響應式設計
- **支持設備**: 移動 (375px)、平板 (768px)、桌面 (1280px)
- **框架**: Tailwind CSS
- **特色**: 流暢布局、觸摸友好、適應暗黑模式

#### 3. 錯誤邊界
- **實現**: ErrorBoundary 組件
- **功能**: 捕捉組件錯誤，防止白屏

#### 4. 圖片加載
- **優先順序**: Cloudinary → Google Drive → Montbell CDN → 本地占位符
- **支持格式**: JPG, PNG, WebP, GIF
- **錯誤處理**: 自動降級到占位符

---

## 安裝和開發

### 前置要求
- Node.js 18+
- npm 或 yarn
- Git

### 本地安裝

```bash
# 1. 克隆項目
git clone https://github.com/blacKgreYcAt/montbell-online-catalog.git
cd montbell-online-catalog

# 2. 安裝依賴
npm install

# 3. 配置環境變數
cp .env.example .env.local
# 編輯 .env.local 添加必要的 API key

# 4. 啟動開發服務器
npm run dev

# 5. 訪問應用
# 打開 http://localhost:3000
```

### 開發服務器
```bash
npm run dev
# 運行在 http://localhost:3000
# 支持熱重載 (HMR)
```

### 構建
```bash
npm run build
# 生成優化的生產版本
```

### 生產運行
```bash
npm start
# 運行生產版本
```

### 代碼檢查
```bash
npm run lint
# 運行 ESLint 檢查代碼質量
```

### 圖片同步
```bash
npm run sync-images
# 同步 Google Drive 圖片
# 注意: 需要配置 Google Drive API
```

---

## 部署指南

### Vercel 自動部署

#### 設置步驟
1. **連接 GitHub**
   - Vercel 自動監視 GitHub 倉庫
   - 每次推送到 `main` 分支時自動部署

2. **環境變數配置**
   - 在 Vercel 項目設置中添加 `.env.local` 的變數
   - 不包括敏感信息在代碼中

3. **自動部署**
   ```bash
   git push origin main
   # Vercel 自動開始構建和部署
   # 大約 2-3 分鐘完成
   ```

#### 部署檢查清單
- [ ] 代碼通過 ESLint 檢查
- [ ] 本地測試通過
- [ ] 環境變數已配置
- [ ] Git commit 信息清晰
- [ ] 推送到 main 分支

#### 部署後檢查
1. 訪問 https://montbell-online-catalog.vercel.app
2. 測試公開版本 (商品列表、搜索、詳情)
3. 測試內部版本 (認證、價格顯示)
4. 檢查圖片是否加載
5. 驗證截止日期機制

---

## 環境變數

### 必需變數

```env
# Google Drive API (圖片存儲)
GOOGLE_DRIVE_FOLDER_ID=你的_FOLDER_ID
NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY=你的_API_KEY

# Montbell CDN (可選)
NEXT_PUBLIC_MONTBELL_CDN_URL=https://www.montbell.com/storage/products/images/origin
NEXT_PUBLIC_MONTBELL_URL_PATTERN={model}_{color}.webp
NEXT_PUBLIC_MONTBELL_CDN_ENABLED=true

# Vercel (自動設置)
NEXT_PUBLIC_SITE_URL=https://montbell-online-catalog.vercel.app
```

### 可選變數

```env
# Cron Job 驗證
CRON_SECRET=你的_SECRET

# Cloudinary (可選，用於圖片優化)
CLOUDINARY_CLOUD_NAME=你的_CLOUD_NAME
CLOUDINARY_API_KEY=你的_API_KEY
```

### 本地開發 (.env.local)

```env
# 本地只需配置 Google Drive
GOOGLE_DRIVE_FOLDER_ID=your_folder_id
NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY=your_api_key

# 其他使用默認值
```

---

## 關鍵文件說明

### 截止日期檢查 (⭐ 重要)

**文件**: `src/lib/deadlineCheck.ts`

```typescript
// 當前設置: 2026-07-09 17:00
// 修改此文件更改截止日期

export function isAfterDeadline(): boolean {
  const deadline = new Date(2026, 6, 9, 17, 0, 0);
  return new Date() > deadline;
}

// 月份是 0-indexed: 6 = July (七月)
// 時間格式: (年, 月, 日, 時, 分, 秒)
```

**如何修改截止日期**:
```typescript
// 改為 2026-07-15 17:00:00
const deadline = new Date(2026, 6, 15, 17, 0, 0);
```

然後提交並推送:
```bash
git add src/lib/deadlineCheck.ts
git commit -m "fix: Extend deadline to 2026-07-15 17:00"
git push origin main
# Vercel 會自動部署
```

### 認證系統

**文件**: `src/lib/internalAuth.ts`

```typescript
const CORRECT_PASSWORD = 'FUTAI12012403';

export function validatePassword(input: string): boolean {
  return input === CORRECT_PASSWORD;
}

export function setAuthToken(password: string): boolean {
  if (validatePassword(password)) {
    localStorage.setItem('montbell_internal_auth_token', password);
    return true;
  }
  return false;
}

export function isInternalAuthValid(): boolean {
  return localStorage.getItem('montbell_internal_auth_token') === CORRECT_PASSWORD;
}
```

⚠️ **安全性注意**: 當前密碼硬編碼在源代碼中。6月29日後應移到環境變數。

### 商品數據

**公開版**: `public/products.json`
- 1,261 件商品
- 結構:
  ```typescript
  {
    id: string;           // 唯一標識符
    modelNumber: string;  // 型號
    name: string;         // 商品名稱
    nameEn?: string;      // 英文名稱
    category: string;     // 分類
    colors: string[];     // 顏色代碼
    sampleColor?: string; // 樣品顏色
    description?: string; // 詳細描述
    features?: string;    // 主要特色
    specifications?: string | Record<string, string>; // 規格
    sizes?: string[];     // 可用尺寸
    weight?: string;      // 重量
    badge?: string;       // 標籤 (如 "活動款")
    pageNumber?: string;  // 頁碼
    discontinued?: boolean; // 是否停產
    price?: number | string; // 價格 (公開版無)
  }
  ```

**內部版**: `public/products-internal.json`
- 181 件商品
- 包含 `price` 字段 (NT$ 格式，如 "NT$11,630")
- 其他字段與公開版相同

### 圖片映射

**文件**: `src/lib/imageMapping.ts`

維護 Google Drive 中上傳的圖片的映射表:
```typescript
const imageMapping: Record<string, string> = {
  "1101770_BK": "google_drive_file_id_1",
  "1101770_WH": "google_drive_file_id_2",
  // ...
};

export function getImageMapping(): Record<string, string> {
  return imageMapping;
}
```

---

## 數據結構

### Product 類型

```typescript
interface Product {
  id: string;                           // 唯一標識符 (p-{modelNumber})
  modelNumber: string;                  // 型號 (如 "1101770")
  name: string;                         // 商品名稱 (如 "PERMAFROST 羽絨派克外套 男款")
  nameEn?: string;                      // 英文名稱
  category: string;                     // 分類 (如 "INSULATION")
  colors: string[];                     // 顏色代碼 (如 ["BK", "WH", "RD"])
  sampleColor?: string;                 // 樣品顏色
  description?: string;                 // 詳細描述
  features?: string;                    // 主要特色
  specifications?: string | Record<string, string>; // 規格
  sizes?: string[];                     // 尺寸 (如 ["M", "L", "XL"])
  weight?: string;                      // 重量
  badge?: string;                       // 標籤 (活動款、26FW、27SS等)
  pageNumber?: string;                  // 目錄頁碼
  discontinued?: boolean;               // 是否停產
  price?: number | string;              // 價格 (僅內部版)
}
```

### 顏色代碼映射

標準顏色代碼和 CSS 顏色值:

```typescript
const colorMap = {
  'BK': '#000000',  // 黑
  'WH': '#f5f5f5',  // 白
  'RD': '#ef4444',  // 紅
  'BL': '#3b82f6',  // 藍
  'GR': '#10b981',  // 綠
  'YE': '#fbbf24',  // 黃
  'PK': '#ec4899',  // 粉紅
  'BR': '#92400e',  // 棕
  'GY': '#6b7280',  // 灰
  'BE': '#d2b48c',  // 米色
  'NV': '#001f3f',  // 海軍藍
  'DGY': '#4b5563', // 深灰
  'RBL': '#1e40af', // 皇家藍
  'GN': '#059669',  // 深綠
  'OR': '#ea580c',  // 橙色
  'TN': '#b45309', // 棕褐
  'KH': '#c2b280', // 卡其色
};
```

---

## API 路由

### GET /api/search

**用途**: 搜索商品

**參數**:
```
GET /api/search?q=搜索詞&scope=public&limit=20
```

| 參數 | 類型 | 說明 |
|------|------|------|
| `q` | string | 搜索關鍵字 (必需) |
| `scope` | string | 搜索範圍: "public" 或 "internal" (默認: "public") |
| `limit` | number | 結果數量限制 (默認: 20) |

**响應**:
```json
{
  "results": [
    {
      "item": { /* Product 對象 */ },
      "score": 0.85,
      "refIndex": 0
    }
  ],
  "total": 5
}
```

### POST /api/sync-images

**用途**: 同步 Google Drive 圖片 (Cron Job)

**參數**:
```
POST /api/sync-images
Headers: { Authorization: "Bearer {CRON_SECRET}" }
```

**响應**:
```json
{
  "status": "success",
  "synced": 150,
  "errors": 0
}
```

---

## 已完成的功能

### Phase 1: 基礎設置 (2026-06-18)
- [x] Next.js 14 + TypeScript + Tailwind CSS 項目初始化
- [x] 公開版商品列表展示 (1,261 件)
- [x] 分類過濾功能
- [x] 模糊搜索功能 (Fuse.js)
- [x] 商品詳情頁面
- [x] 響應式設計

### Phase 2: 內部版本 (2026-06-18 ~ 2026-06-24)
- [x] 內部版認證系統 (密碼保護)
- [x] 內部版商品列表 (181 件)
- [x] 內部版商品詳情
- [x] 內部版搜索功能

### Phase 3: 功能完善 (2026-06-24 ~ 2026-06-29)
- [x] 截止日期自動關閉機制
- [x] 倒計時警告組件
- [x] 活動款和頁碼標記顯示
- [x] 樣品顏色顯示
- [x] 移除重複商品 (12 件)
- [x] 分類篩選修復
- [x] 橫式分類菜單移除
- [x] 簡化瀏覽方式說明

### Phase 4: 價格功能 (2026-06-29 ~ 2026-07-08)
- [x] 從 Excel 提取 181 件內部商品的價格
- [x] 內部版商品詳情頁面顯示價格 (NT$ 格式)
- [x] 內部版商品列表卡片顯示價格
- [x] 公開版商品卡片添加 NT$ 貨幣符號
- [x] 價格格式統一 (NT$4,040 千位符格式)

### Phase 5: 延期運營 (2026-07-08 ~ 2026-07-09)
- [x] 首次延期到 2026-06-30 17:00
- [x] 再次延期到 2026-07-09 17:00
- [x] 自動截止日期系統驗證成功

---

## 已知問題和改進計畫

### 🔴 立即修復 (6月29日後)

#### 1. 密碼安全隱患
- **問題**: 密碼硬編碼在 `src/lib/internalAuth.ts`
- **風險**: 源代碼暴露時密碼泄露
- **修復方案**: 移到環境變數
  ```bash
  # .env.local
  INTERNAL_AUTH_PASSWORD=FUTAI12012403
  ```

#### 2. 純客户端認證
- **問題**: 任何人可通過瀏覽器控制台繞過認證
- **修復方案**: 實現服務器端認證 API
  ```typescript
  // /api/internal/auth (POST)
  // 驗證密碼並返回安全 token
  ```

#### 3. 截止日期被繞過
- **問題**: 客户端時間可被篡改
- **修復方案**: 服務器端驗證

---

### 🟡 近期改進 (一個月內)

- [ ] 修復 useEffect 依賴項
- [ ] 改進錯誤處理和用戶反饋
- [ ] 移除調試日誌
- [ ] 添加基礎單元測試
- [ ] 優化圖片加載（實施重試機制）

---

### 🟢 性能優化 (下個季度)

- [ ] 實施 ISR (Incremental Static Regeneration)
- [ ] 使用 Next.js Image 組件優化圖片
- [ ] 緩存搜索索引
- [ ] 添加 Web Vitals 監控

---

### 💡 未來增強 (可選)

- [ ] 國際化支持 (i18n) - 英文、日文
- [ ] 黑暗模式
- [ ] 高級搜索過濾 (價格、尺寸範圍)
- [ ] 產品對比功能
- [ ] 收藏/購物清單
- [ ] SEO 優化
- [ ] API 文檔 (OpenAPI/Swagger)

---

## 開發歷程

### 2026-06-18: 項目初始化和基礎功能
**提交**: ba68b7e ~ 793e4b0

- 初始化 Next.js 14 項目
- 實現公開版商品列表和搜索
- 移除重複商品 (SLEEPING BAG 系列)

**關鍵修復**:
- 分類過濾功能修復
- 英文分類名標準化
- 移除 React duplicate key 錯誤

---

### 2026-06-24 ~ 2026-06-28: 內部版本和截止日期
**提交**: 08c1e58 ~ 5f0b67c

- 實現內部版認證系統
- 添加截止日期自動關閉機制
- 移除橫式分類菜單
- 簡化瀏覽方式說明

---

### 2026-06-29: 價格顯示功能開發
**提交**: e760fd2

- 從 Excel 提取 181 件商品價格
- 實現內部版詳情頁面價格顯示
- 實現商品列表卡片價格顯示
- 添加 NT$ 貨幣符號

**技術細節**:
- Python 腳本從 Excel column F 提取價格
- 價格格式轉換 (￥ CNY → NT$ Taiwan Dollar)
- 完全匹配率 100% (181/181 商品)

---

### 2026-07-08: 公開版價格顯示優化
**提交**: b0a1709

- 添加 NT$ 貨幣符號到公開版
- 實現千位分隔符格式化
- 修復價格類型不一致問題

---

### 2026-07-08 ~ 2026-07-09: 截止日期延期
**提交**: 6528325 ~ 7dc1850

- **2026-06-30 17:00**: 首次延期
- **2026-07-09 17:00**: 再次延期

修改方法:
1. 編輯 `src/lib/deadlineCheck.ts` 的日期
2. 提交: `git commit -m "fix: Extend deadline to [new_date]"`
3. 推送: `git push origin main`
4. Vercel 自動部署 (2-3 分鐘)

---

## 常見操作指南

### 修改截止日期

```bash
# 1. 編輯文件
# src/lib/deadlineCheck.ts 第 10 和 21 行
# new Date(2026, 6, 9, 17, 0, 0) 
# 改為: new Date(2026, 6, 15, 17, 0, 0)

# 2. 提交更改
git add src/lib/deadlineCheck.ts
git commit -m "fix: Extend deadline to 2026-07-15 17:00"

# 3. 推送
git push origin main

# 4. 等待 Vercel 部署 (2-3 分鐘)
```

### 更新商品價格

如果需要更新內部版商品價格:

1. **準備 Excel 文件**
   - Column A: 型號 (modelNumber)
   - Column F: 價格 (NT$ 格式)

2. **運行提取腳本**
   ```bash
   # 使用 Python 腳本提取價格
   python extract_prices_f_column.py your_file.xlsx
   ```

3. **更新 JSON**
   ```bash
   # 手動更新 public/products-internal.json
   # 或使用自動化腳本
   ```

4. **提交和部署**
   ```bash
   git add public/products-internal.json
   git commit -m "feat: Update internal product prices"
   git push origin main
   ```

### 添加新商品

1. **編輯 `public/products.json` 或 `public/products-internal.json`**
   ```json
   {
     "id": "p-1234567",
     "modelNumber": "1234567",
     "name": "新商品名稱",
     "category": "INSULATION",
     "colors": ["BK", "WH"],
     "price": "NT$5,000"
   }
   ```

2. **提交更改**
   ```bash
   git add public/products-internal.json
   git commit -m "feat: Add new product 1234567"
   git push origin main
   ```

### 調試常見問題

#### 問題: 商品圖片未加載
- 檢查圖片映射表 (`src/lib/imageMapping.ts`)
- 驗證 Google Drive API 配置
- 檢查瀏覽器控制台的網絡請求

#### 問題: 搜索無結果
- 確認搜索詞是否正確拼寫
- 檢查搜索閾值 (SEARCH_THRESHOLD: 0.3)
- 驗證商品數據格式

#### 問題: 內部版認證失敗
- 確認密碼正確 (FUTAI12012403)
- 清除瀏覽器 localStorage 重新嘗試
- 檢查瀏覽器控制台的錯誤信息

---

## 部署清單

每次部署前檢查:

```
□ 本地 npm run dev 測試正常
□ npm run lint 無錯誤
□ 所有更改已 git add
□ Commit message 清晰明確
□ git push origin main 成功
□ Vercel 部署完成 (檢查部署狀態)
□ 訪問 https://montbell-online-catalog.vercel.app 測試
□ 功能測試無誤
```

---

## 聯繫和支持

### 項目信息
- **倉庫**: https://github.com/blacKgreYcAt/montbell-online-catalog
- **部署**: https://montbell-online-catalog.vercel.app
- **版本**: 0.5.0

### 技術支持
- 查看本文檔的常見操作指南
- 檢查 Git 提交歷史了解過去的修改
- 查看 WORK_SESSION_*.md 文件了解詳細工作記錄

---

## 版本歷史

| 版本 | 日期 | 主要更新 |
|------|------|---------|
| 0.5.0 | 2026-07-09 | 價格顯示、截止日期延期、優化完成 |
| 0.4.0 | 2026-06-29 | 添加內部版價格功能 |
| 0.3.0 | 2026-06-28 | 截止日期機制完成 |
| 0.2.0 | 2026-06-24 | 內部版本上線 |
| 0.1.0 | 2026-06-18 | 公開版本上線 |

---

**最後更新**: 2026-07-09  
**文檔版本**: 1.0  
**維護者**: Claude Developer

