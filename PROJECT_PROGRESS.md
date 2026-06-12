# Montbell Online Catalog - 專案進度記錄

**最後更新：2026-06-12**  
**專案狀態：開發中 🚀**

---

## 📋 專案概述

建構 Montbell 官方線上商品目錄平台，包含：
- **公開版**：完整產品展示（1273 產品）
- **內部版**：FW27 展示會專用版（181 產品）
- 雙版本架構，共用單一域名
- 密碼保護的內部版存取（localStorage 認證）

---

## ✅ 已完成工作

### Phase 1: 內部版建構（FW27 展示會）
- ✅ 181 個 FW27 產品資料整理
- ✅ 362+ 商品圖片 Google Drive → Cloudinary CDN 遷移
- ✅ 圖片映射系統建立
- ✅ 特殊色號處理（# 符號色碼）
- ✅ 密碼認證系統（FUTAI12012403）
- ✅ 內部版首頁、商品列表、搜尋功能
- ✅ 展示會公告模態窗（截止日：2026-06-29）

**提交記錄：**
- `264bc5c` - Add 9 special color images with # symbol in name
- `d19625f` - Correct image mapping key for 1106842_IV
- `a8571e7` - Add 17 new product images
- `1fd1210` - Add 9 special color images with # symbol in name

### Phase 2: 圖片與資料修復
- ✅ 修復 5 個 # 符號顏色產品缺少顏色數據
  - fw27-92 (1119296): #2, #3, #5
  - fw27-93 (1119297): #2, #3, #5
  - fw27-175 (1119298): #7, #8, #9
  - fw27-162 (1144142): #7, #8, #9
  - fw27-163 (1144143): #7, #8, #9

- ✅ 修復 1106847 顏色數據（100, #10, #14, #15）
- ✅ 修復 1134498 無色產品圖片顯示（用 dash 佔位符）
- ✅ 103 個新商品圖片上傳和映射

**提交記錄：**
- `b20511e` - Add color placeholder for no-color product 1134498
- `bbd0203` - Use dash placeholder for 1134498
- `46e1343` - Add 103 new product images

### Phase 3: 搜尋功能修復
- ✅ 內部版搜尋 API 修復（使用 products-internal.json）
- ✅ 搜尋導向路徑修正（/internal/search）
- ✅ SearchBar 組件基路徑配置
- ✅ 內部版產品列表搜尋欄配置
- ✅ 內部版搜尋頁面 onSearch 回調實現

**提交記錄：**
- `a1686e8` - Enable internal version search functionality
- `a3cf91c` - Correct search navigation for internal version
- `a1a2340` - Add onSearch callback to SearchBar
- `cd1cd8f` - Add basePath and onSearch to SearchBar in products page

### Phase 4: 公開版資料重建
- ✅ 備份舊 products.json
- ✅ 從 Excel 讀取 1273 個公開版產品
- ✅ 產品資料結構化（型號、品名、系列、特色描述）
- ✅ 公開版搜尋功能驗證

**提交記錄：**
- `002031e` - Rebuild public products.json from Excel

---

## 🐛 已修復問題

| 問題 | 根本原因 | 解決方案 | 提交 |
|------|--------|--------|------|
| # 符號顏色圖片不顯示 | products-internal.json 缺少顏色陣列 | 添加顏色數據 | 19f61b3 |
| 1106847 沒有顏色 | 空顏色陣列 | 添加 4 種顏色 | 1abb3c8 |
| 1134498 無色圖片不顯示 | 空字符串無法通過 if 檢查 | 用 dash 佔位符 | bbd0203 |
| 搜尋 API 用公開版數據 | API 硬編碼 products.json | 添加 internal 參數 | a1686e8 |
| 搜尋導向公開版 | SearchBar basePath 預設 /search | 添加 basePath 參數 | a3cf91c |
| 商品列表搜尋不工作 | SearchBar 缺少配置 | 添加 onSearch 回調 | cd1cd8f |

---

## 📊 版本對比

| 項目 | 公開版 | 內部版 |
|------|--------|--------|
| 產品數 | 1273 | 181 |
| 圖片映射 | imageMapping.json | imageMapping-internal.json |
| 認證 | 無 | localStorage (FUTAI12012403) |
| 搜尋 | /api/search | /api/search?internal=true |
| 顏色顯示 | 隱藏 | 完整色碼選擇 |
| 定價 | 顯示 | 隱藏（MSRP） |
| 展示會公告 | 無 | 有（截止 2026-06-29） |

---

## 🚀 當前狀態

### 功能檢查清單
- ✅ 公開版首頁
- ✅ 公開版商品列表（1273 產品）
- ✅ 公開版搜尋（URL、API、結果顯示）
- ✅ 內部版首頁
- ✅ 內部版認證（密碼登入）
- ✅ 內部版商品列表（181 FW27 產品）
- ✅ 內部版商品詳情頁
- ✅ 內部版搜尋（URL、API、結果顯示）
- ✅ 所有商品圖片顯示（Cloudinary CDN）
- ✅ 特殊色碼（#1, #2 等）顯示

### 已驗證搜尋結果
- ✅ 公開版：型號 1128850 ✓
- ✅ 內部版：型號 1101770 ✓
- ✅ 內部版：型號 1101773 ✓
- ✅ 內部版：型號 1106843 ✓

---

## ⏳ 待完成事項

### 高優先級
1. **PM 補充公開版資料**
   - 色號代碼和名稱
   - 尺寸規格
   - 定價（TWD）
   - 中文產品名稱（目前只有英文）
   
2. **資料更新流程**
   - 接收完整 Excel
   - 驗證資料完整性
   - 更新 products.json
   - 重新部署和測試

### 中優先級
1. 添加英文翻譯（descriptionEn, featuresEn 等）
2. 添加分類翻譯
3. 頁碼編號（pageNumber）補齊
4. 商品 ID 標準化

### 低優先級
1. SEO 優化
2. 性能優化
3. 無障礙改進
4. 多語言完整支持

---

## 📁 主要檔案清單

### 產品資料
- `public/products.json` - 公開版 1273 產品
- `public/products-internal.json` - 內部版 181 FW27 產品
- `public/imageMapping.json` - 公開版圖片映射
- `public/imageMapping-internal.json` - 內部版圖片映射
- `public/products.backup.20260612_164409.json` - 舊版備份

### 認證系統
- `src/lib/internalAuth.ts` - localStorage 認證邏輯
- `src/app/internal/auth/page.tsx` - 密碼驗證表單

### 頁面
- `src/app/products/page.tsx` - 公開版商品列表
- `src/app/search/page.tsx` - 公開版搜尋
- `src/app/internal/products/page.tsx` - 內部版商品列表
- `src/app/internal/search/page.tsx` - 內部版搜尋
- `src/app/internal/products/[id]/page.tsx` - 內部版商品詳情

### 元件
- `src/components/SearchBar.tsx` - 搜尋欄（basePath 支持）
- `src/components/ProductCard.tsx` - 商品卡片（useGoogleDrive 參數）
- `src/components/ProductGrid.tsx` - 商品網格
- `src/components/OrderDeadlineModal.tsx` - 展示會公告

---

## 🔧 技術堆棧

- **框架**：Next.js 16.2.3 (App Router)
- **語言**：TypeScript
- **圖片存儲**：Cloudinary CDN
- **認證**：localStorage + 客戶端驗證
- **部署**：Vercel
- **Git 管理**：GitHub

---

## 📝 重要筆記

### 特殊色號處理
- Excel 中色號使用 # 符號（#1, #2, #3 等）
- 本地檔名保留 # 符號：`1144124_#1.jpg`
- Cloudinary public_id 使用數字：`1144124_1`
- JSON 映射 key 保留 # 符號：`"1144124_#1": "https://..."`
- UI 顯示 # 符號

### 無色產品處理
- 佔位符：`colors: ["-"]`
- 映射 key：`"1134498_-"`
- 適用於配件類產品（濾芯等）

### 圖片加載優先級
- 內部版：Cloudinary URL → Google Drive ID → 預設圖片
- 公開版：Montbell CDN → 預設圖片

---

## 👤 團隊角色分工

- **PM**：資料蒐集、驗證、補充（色號、定價等）
- **開發**：Claude - 架構、功能開發、修復、部署
- **產品所有者**：Benjamin - 需求定義、驗收

---

## 📞 聯絡方式

- **PM Email**：benjaminchu0508@gmail.com
- **部署平台**：Vercel
- **代碼倉庫**：GitHub

---

**最後部署**：2026-06-12 08:58:45 UTC  
**最後更新**：2026-06-12
