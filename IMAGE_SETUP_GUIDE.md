# Montbell 商品圖片設定指南

**日期：** 2026-04-16  
**版本：** v1.0  
**狀態：** 實裝完成（待 URL 確認）

---

## 📋 目錄

1. [概述](#概述)
2. [系統架構](#系統架構)
3. [環境設定](#環境設定)
4. [實現詳情](#實現詳情)
5. [測試方法](#測試方法)
6. [故障排除](#故障排除)

---

## 概述

系統已實裝 **自動圖片 URL 生成機制**，支援：

✅ **Montbell 官網 CDN 優先級**  
✅ **Google Drive 自動備份** (fallback)  
✅ **本地佔位圖** (最後備份)  
✅ **顏色選擇動態更新**  
✅ **無需手動上傳** (只需 URL 配置)  

---

## 系統架構

```
商品資料 (model + color)
    ↓
圖片 URL 生成引擎
    ├─ 優先：Montbell CDN URL
    ├─ 次選：Google Drive URL
    └─ 備用：本地佔位圖
    ↓
前端元件自動渲染
```

### 信號流圖

```
ProductCard
├─ product.colors[0] (第一個顏色)
├─ generateMonbellImageUrl()
├─ → "https://image.montbell.com/product/1128573_RBL.jpg"
└─ <img src={imageUrl} />

Product Detail Page
├─ selectedColor (使用者選擇)
├─ generateMonbellImageUrl()
├─ → 動態更新圖片 URL
└─ <img src={imageUrl} onError={fallback} />
```

---

## 環境設定

### 必填環境變數

```bash
# .env.local (本地開發)
# 或
# Vercel Dashboard → Settings → Environment Variables (生產)

# Montbell CDN 配置
NEXT_PUBLIC_MONTBELL_CDN_URL=https://image.montbell.com/product
NEXT_PUBLIC_MONTBELL_URL_PATTERN={model}_{color}.jpg
NEXT_PUBLIC_MONTBELL_CDN_ENABLED=true
```

### 環境變數說明

| 變數名 | 說明 | 範例 | 必填 |
|--------|------|------|------|
| `NEXT_PUBLIC_MONTBELL_CDN_URL` | CDN 基礎 URL | `https://image.montbell.com/product` | ✓ |
| `NEXT_PUBLIC_MONTBELL_URL_PATTERN` | URL 模式 | `{model}_{color}.jpg` | ✓ |
| `NEXT_PUBLIC_MONTBELL_CDN_ENABLED` | 啟用/禁用 | `true` / `false` | ○ |

### URL 模式語法

```
{model}   → 自動轉換為 7 位數型號 (e.g., 1128573)
{color}   → 轉換為大寫顏色代碼 (e.g., RBL → RBL)
```

### 設定範例

#### 範例 1：Montbell 日本官網
```
NEXT_PUBLIC_MONTBELL_CDN_URL=https://image.montbell.com/product
NEXT_PUBLIC_MONTBELL_URL_PATTERN={model}_{color}.jpg
```

#### 範例 2：Montbell 台灣官網 (如有)
```
NEXT_PUBLIC_MONTBELL_CDN_URL=https://tw.montbell.com/images/product
NEXT_PUBLIC_MONTBELL_URL_PATTERN={model}-{color}.jpg
```

#### 範例 3：自訂 CDN (如 Cloudinary)
```
NEXT_PUBLIC_MONTBELL_CDN_URL=https://res.cloudinary.com/montbell/image/upload
NEXT_PUBLIC_MONTBELL_URL_PATTERN=montbell/{model}_{color}.jpg
```

---

## 實現詳情

### 1. 核心函數

#### `generateMonbellImageUrl(modelNumber, colorCode)`

**位置：** `src/lib/imageUtils.ts`

```typescript
/**
 * 根據型號和顏色代碼生成 Montbell CDN 圖片 URL
 */
export function generateMonbellImageUrl(
  modelNumber: string,
  colorCode: string
): string {
  const { baseUrl, pattern } = MONTBELL_CDN_CONFIG;
  const url = pattern
    .replace("{model}", modelNumber.toString().padStart(7, "0"))
    .replace("{color}", colorCode.toUpperCase());
  return `${baseUrl}/${url}`;
}
```

**使用範例：**

```typescript
const imageUrl = generateMonbellImageUrl("1128573", "RBL");
// 結果: "https://image.montbell.com/product/1128573_RBL.jpg"
```

#### `verifyImageUrl(url)`

**位置：** `src/lib/imageUtils.ts`

```typescript
/**
 * 驗證 URL 是否有效 (檢查 HTTP 頭)
 */
export async function verifyImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.status === 200;
  } catch {
    return false;
  }
}
```

#### `getProductImage(modelNumber, color)`

**位置：** `src/lib/imageUtils.ts`

- **智能優先級：** Montbell CDN → Google Drive → null
- **自動驗證：** 檢查 URL 有效性
- **自動備份：** 若 CDN 不可用自動轉換為 Google Drive

### 2. 前端元件整合

#### ProductCard

**位置：** `src/components/ProductCard.tsx`

```typescript
// 優先使用 Montbell CDN (第一個顏色)
let imageUrl = '/next.svg';

if (product.colors && product.colors.length > 0) {
  imageUrl = generateMonbellImageUrl(product.modelNumber, product.colors[0]);
}

// 圖片錯誤時自動備份
<img
  src={imageUrl}
  onError={(e) => {
    (e.target as HTMLImageElement).src = '/placeholder.svg';
  }}
/>
```

#### Product Detail Page

**位置：** `src/app/products/[id]/page.tsx`

```typescript
// 支援顏色選擇時動態更新圖片
if (selectedColor) {
  imageUrl = generateMonbellImageUrl(product.modelNumber, selectedColor);
}

// 用戶選擇顏色時自動更新
<button
  onClick={() => setSelectedColor(color)}
  className={...}
>
  {color}
</button>
```

### 3. 配置常數

**位置：** `src/lib/constants.ts`

```typescript
export const MONTBELL_CDN_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_MONTBELL_CDN_URL || "https://image.montbell.com/product",
  pattern: process.env.NEXT_PUBLIC_MONTBELL_URL_PATTERN || "{model}_{color}.jpg",
  enabled: process.env.NEXT_PUBLIC_MONTBELL_CDN_ENABLED !== "false",
};
```

---

## 測試方法

### 1. 本地測試

#### 步驟 1：設定環境變數

編輯 `.env.local`：

```bash
NEXT_PUBLIC_MONTBELL_CDN_URL=https://image.montbell.com/product
NEXT_PUBLIC_MONTBELL_URL_PATTERN={model}_{color}.jpg
NEXT_PUBLIC_MONTBELL_CDN_ENABLED=true
```

#### 步驟 2：啟動開發伺服器

```bash
npm run dev
```

#### 步驟 3：測試 URL 生成

打開瀏覽器開發工具的 Console：

```javascript
// 導入工具 (需要在 React 組件內)
import { generateMonbellImageUrl } from '@/lib/imageUtils';

// 測試生成
const url = generateMonbellImageUrl('1128573', 'RBL');
console.log(url);
// 輸出: "https://image.montbell.com/product/1128573_RBL.jpg"
```

#### 步驟 4：視覺測試

1. 訪問 `http://localhost:3000/products`
2. 檢查商品卡片是否載入圖片
3. 點擊商品進入詳情頁
4. 選擇不同顏色，確認圖片更新
5. 檢查網路開發工具 (F12 → Network)

### 2. 驗證 URL 有效性

#### 使用 curl

```bash
# 測試是否返回 200 OK
curl -I "https://image.montbell.com/product/1128573_RBL.jpg"

# 預期輸出
HTTP/1.1 200 OK
Content-Type: image/jpeg
Content-Length: 12345
```

#### 使用瀏覽器

直接訪問生成的 URL：

```
https://image.montbell.com/product/1128573_RBL.jpg
```

### 3. Montbell 官網驗證

找到一個商品並檢查圖片 URL：

1. 訪問 https://www.montbell.com/jp/en/products
2. 選擇一個商品（例：型號 1128573）
3. 按 F12 開啟開發工具
4. 檢查 Network 標籤中的圖片請求
5. 記錄實際的 URL 模式

---

## 故障排除

### 問題 1：圖片無法載入

**症狀：** 顯示佔位圖而非實際圖片

**原因分析：**

1. URL 模式不正確
2. CDN 不可用
3. 型號/顏色格式錯誤

**解決方案：**

```typescript
// 1. 檢查環境變數
console.log('CDN URL:', process.env.NEXT_PUBLIC_MONTBELL_CDN_URL);
console.log('Pattern:', process.env.NEXT_PUBLIC_MONTBELL_URL_PATTERN);

// 2. 驗證生成的 URL
const testUrl = generateMonbellImageUrl('1128573', 'RBL');
console.log('Generated URL:', testUrl);

// 3. 檢查 URL 有效性
const isValid = await verifyImageUrl(testUrl);
console.log('URL Valid:', isValid);

// 4. 直接訪問 URL 測試
window.open(testUrl);
```

### 問題 2：顏色選擇時圖片不更新

**症狀：** 切換顏色時圖片保持不變

**原因分析：**

1. `selectedColor` 狀態未更新
2. `useEffect` 依賴缺失

**解決方案：**

檢查 `src/app/products/[id]/page.tsx` 中的顏色按鈕：

```typescript
<button
  onClick={() => setSelectedColor(color)}  // 確保有這行
  className={...}
>
  {color}
</button>
```

### 問題 3：CORS 跨域錯誤

**症狀：** Console 顯示 CORS 錯誤，圖片無法載入

**原因分析：**

Montbell CDN 不允許跨域請求

**解決方案：**

#### 方案 A：使用代理

在 Next.js 中建立 API 代理：

```typescript
// src/app/api/image/[...path]/route.ts
export async function GET(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  const imagePath = params.path.join('/');
  const response = await fetch(
    `https://image.montbell.com/product/${imagePath}`,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MontbellCatalog/1.0)',
      },
    }
  );
  return response;
}
```

然後更新 URL 生成：

```typescript
export function generateMonbellImageUrl(modelNumber: string, colorCode: string): string {
  // 使用本地 API 代理
  const imagePath = `${modelNumber.padStart(7, '0')}_${colorCode.toUpperCase()}.jpg`;
  return `/api/image/${imagePath}`;
}
```

#### 方案 B：禁用 CDN（暫時）

```bash
NEXT_PUBLIC_MONTBELL_CDN_ENABLED=false
```

此時會自動回退到 Google Drive

### 問題 4：型號或顏色格式錯誤

**症狀：** URL 包含錯誤的型號或顏色代碼

**原因分析：**

1. 產品資料格式不一致
2. 顏色代碼大小寫問題

**解決方案：**

```typescript
// 驗證產品資料格式
const product = {
  modelNumber: "1128573",  // 必須是字符串，7 位數字
  colors: ["RBL", "BK"],   // 大寫英文代碼
};

// 自動格式化
const formattedModel = product.modelNumber.toString().padStart(7, '0');
const formattedColor = product.colors[0].toUpperCase();
```

---

## 部署到 Vercel

### 1. 設定環境變數

前往 Vercel Dashboard：

1. 選擇 Project: `montbell-online-catalog`
2. 進入 **Settings** → **Environment Variables**
3. 新增變數：

```
NEXT_PUBLIC_MONTBELL_CDN_URL = https://image.montbell.com/product
NEXT_PUBLIC_MONTBELL_URL_PATTERN = {model}_{color}.jpg
NEXT_PUBLIC_MONTBELL_CDN_ENABLED = true
```

### 2. 部署

```bash
git add .
git commit -m "feat: Implement automatic Montbell CDN image fetching"
git push origin main
```

Vercel 會自動部署並使用環境變數。

---

## 下一步

### 確認 URL 模式

請提供一個真實的 Montbell 日本官網商品圖片 URL：

**所需信息：**

```
1. 型號: 1128573, 顏色: RBL 的圖片 URL
   例：https://...

2. 型號: 1128842, 顏色: BK 的圖片 URL
   例：https://...

3. 其他型號/顏色組合的 URL (選擇性)
```

**如何找到：**

1. 訪問 https://www.montbell.com/jp/en/products
2. 搜尋商品型號（例：1128573）
3. 按 F12 開啟開發工具
4. 切換顏色選項
5. 查看 Network → Img 標籤中的圖片 URL
6. 複製完整 URL

收到確認後，將立即實施完整的自動圖片抓取系統。

---

## 修訂歷史

| 日期 | 版本 | 變更 |
|------|------|------|
| 2026-04-16 | v1.0 | 初始實裝指南 |

---

**最後更新：** 2026-04-16  
**狀態：** 待 URL 確認後完成
