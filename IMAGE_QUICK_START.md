# 圖片自動抓取 - 快速開始指南

**最後更新：** 2026-04-16  
**狀態：** 已實裝，待配置

---

## 🚀 30 秒快速開始

### 步驟 1：複製環境變數範本

```bash
cp .env.example .env.local
```

### 步驟 2：編輯 `.env.local`

填入以下兩個變數（從日本 Montbell 官網確認）：

```bash
NEXT_PUBLIC_MONTBELL_CDN_URL=https://image.montbell.com/product
NEXT_PUBLIC_MONTBELL_URL_PATTERN={model}_{color}.jpg
```

### 步驟 3：測試配置

```bash
# 測試單個商品圖片
python test_montbell_cdn.py 1128573 RBL

# 批量測試前 50 個商品
python test_montbell_cdn.py --test-all --limit 50
```

### 步驟 4：啟動應用

```bash
npm run dev
```

訪問 http://localhost:3000/products，應該能看到商品圖片了！

---

## 📋 完整流程

### 發生了什麼？

```
用戶訪問商品頁面
    ↓
系統自動生成圖片 URL
    ↓
嘗試從 Montbell CDN 載入
    ├─ ✓ 成功 → 顯示圖片
    └─ ✗ 失敗 → 回退到 Google Drive / 佔位圖
```

### URL 生成規則

根據配置的模式自動生成 URL：

```
型號：1128573
顏色：RBL

配置示例 1：
  模式：{model}_{color}.jpg
  結果：1128573_RBL.jpg
  完整：https://image.montbell.com/product/1128573_RBL.jpg

配置示例 2：
  模式：{model}-{color}.jpg
  結果：1128573-RBL.jpg
  完整：https://image.montbell.com/product/1128573-RBL.jpg
```

---

## ⚙️ 配置選項

### 選項 A：日本官網 (推薦)

```bash
NEXT_PUBLIC_MONTBELL_CDN_URL=https://image.montbell.com/product
NEXT_PUBLIC_MONTBELL_URL_PATTERN={model}_{color}.jpg
```

**優點：** 簡單，官方資源  
**需要：** 確認 URL 模式

### 選項 B：自訂 CDN (如 Cloudinary)

```bash
NEXT_PUBLIC_MONTBELL_CDN_URL=https://res.cloudinary.com/montbell/image/upload
NEXT_PUBLIC_MONTBELL_URL_PATTERN=montbell/{model}_{color}.jpg
```

**優點：** 加速、CORS 支援、備份  
**需要：** Cloudinary 帳號、圖片同步

### 選項 C：禁用 CDN (暫時使用)

```bash
NEXT_PUBLIC_MONTBELL_CDN_ENABLED=false
```

此時會自動使用 Google Drive 備份，無需 CDN 配置。

---

## 🔍 如何找到正確的 URL 模式

### 方法 1：手動檢查官網

1. 訪問 https://www.montbell.com/jp/en/products
2. 搜尋商品（例：輸入 1128573）
3. 按 F12 開啟開發工具 → Network 標籤
4. 選擇不同顏色
5. 查看圖片請求，複製完整 URL
6. 分析 URL 的模式

**預期 URL 範例：**
```
https://image.montbell.com/product/1128573_RBL.jpg
https://image.montbell.com/product/1128573_BK.jpg
```

### 方法 2：使用測試工具

```bash
# 先試試預設配置是否可用
python test_montbell_cdn.py 1128573 RBL

# 如果失敗，試試其他模式
python test_montbell_cdn.py --pattern "{model}-{color}.jpg" 1128573 RBL
python test_montbell_cdn.py --pattern "product_{model}_{color}" 1128573 RBL
```

### 方法 3：自訂測試

```bash
# 編輯 test_montbell_cdn.py 或使用命令列選項
python test_montbell_cdn.py \
  --base-url "https://image.montbell.com" \
  --pattern "product/{model}_{color}.jpg" \
  1128573 RBL
```

---

## ✅ 驗證安裝

### 本地驗證清單

- [ ] 複製了 `.env.example` 為 `.env.local`
- [ ] 填入了 `NEXT_PUBLIC_MONTBELL_CDN_URL`
- [ ] 填入了 `NEXT_PUBLIC_MONTBELL_URL_PATTERN`
- [ ] 執行了 `python test_montbell_cdn.py` 測試
- [ ] `npm run dev` 啟動應用無錯誤
- [ ] 訪問 `/products` 頁面能看到商品圖片
- [ ] 商品詳情頁切換顏色時圖片會更新

### Vercel 驗證清單

- [ ] 登入 Vercel Dashboard
- [ ] 進入 Project Settings → Environment Variables
- [ ] 新增 `NEXT_PUBLIC_MONTBELL_CDN_URL`
- [ ] 新增 `NEXT_PUBLIC_MONTBELL_URL_PATTERN`
- [ ] 觸發新的部署
- [ ] 訪問生產環境 URL，驗證圖片顯示

---

## 🆘 常見問題

### Q1：為什麼圖片還是顯示不出來？

**檢查清單：**

1. 確認 `.env.local` 已建立且有正確的值
2. 重啟開發伺服器（`npm run dev`）
3. 清除瀏覽器快取（Ctrl+Shift+Delete）
4. 在開發工具中檢查網路請求 (F12 → Network)
5. 在 Console 查看是否有錯誤訊息

**測試 URL 有效性：**

```bash
# 直接訪問生成的 URL
python test_montbell_cdn.py 1128573 RBL

# 或在瀏覽器中訪問
https://image.montbell.com/product/1128573_RBL.jpg
```

### Q2：圖片 URL 格式不對？

可能的原因和解決方案：

```bash
# 原始模式
{model}_{color}.jpg
→ 1128573_RBL.jpg

# 如果官網使用小寫顏色代碼
# 系統會自動轉換，無需修改

# 如果官網需要前導零
{model}_{color}.jpg
→ 系統自動填充至 7 位數，無需修改

# 如果官網使用不同分隔符
{model}-{color}.jpg
→ 1128573-RBL.jpg

{model}_{color}.png
→ 1128573_RBL.png
```

### Q3：部分圖片無法載入？

可能是顏色代碼不完全匹配，系統會自動回退到 Google Drive 備份。

檢查 `public/products.json`，確保色碼格式一致：

```json
{
  "modelNumber": "1128573",
  "colors": ["RBL", "BK", "NV"],  // ✓ 英文大寫代碼
  ...
}
```

### Q4：怎樣在 Vercel 上配置？

1. 訪問 Vercel Dashboard
2. 選擇 `montbell-online-catalog` project
3. Settings → Environment Variables
4. 新增變數和值
5. 重新部署（或等待自動部署）

```
NEXT_PUBLIC_MONTBELL_CDN_URL = https://image.montbell.com/product
NEXT_PUBLIC_MONTBELL_URL_PATTERN = {model}_{color}.jpg
```

### Q5：能否同時支援多個 CDN？

目前系統支援單一主要 CDN + Google Drive 備份。

如需多個 CDN，可以修改 `src/lib/imageUtils.ts` 的 `getProductImage()` 函數，添加更多優先級。

---

## 📚 詳細文檔

- **完整設定指南：** [IMAGE_SETUP_GUIDE.md](IMAGE_SETUP_GUIDE.md)
- **技術實現方案：** [IMAGE_FETCHING_GUIDE.md](IMAGE_FETCHING_GUIDE.md)
- **產品資料說明：** [PRODUCT_DATA_PROCESSING_GUIDE.md](PRODUCT_DATA_PROCESSING_GUIDE.md)

---

## 🎯 下一步

### 立即執行

1. 檢查日本 Montbell 官網的圖片 URL
2. 更新 `.env.local` 的配置
3. 執行測試工具驗證
4. 啟動應用查看效果

### 確認 URL 模式

請提供一個範例 URL（從 www.montbell.com 複製）：

```
型號 1128573，顏色 RBL 的圖片 URL：
https://image.montbell.com/product/1128573_RBL.jpg
```

收到確認後，系統將完全自動運行，無需任何手動圖片上傳！

---

**準備好了嗎？** 🚀

開始配置您的環境變數，讓圖片自動抓取工作吧！

