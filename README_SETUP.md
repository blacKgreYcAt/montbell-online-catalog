# 蒙貝爾線上商品目錄 - 設置和部署指南

## 📋 快速開始

### 1️⃣ 本地開發設置

#### 環境要求
- Node.js 18+ 和 npm
- Git
- Google Cloud 專案（用於 Google Drive 整合）

#### 安裝步驟

```bash
# 克隆倉庫
git clone https://github.com/blacKgreYcAt/montbell-online-catalog.git
cd montbell-online-catalog

# 安裝依賴
npm install

# 設置環境變數
cp .env.local.example .env.local
# 編輯 .env.local 並填入你的配置
```

#### 環境變數配置

編輯 `.env.local` 檔案：

```env
# Google Drive 配置
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here

# Cron Job 認證密鑰（更改為安全的密鑰）
CRON_SECRET=your-secret-key-here

# 網站 URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### 運行開發服務器

```bash
npm run dev
```

然後打開 [http://localhost:3000](http://localhost:3000)

---

## 🔧 Google Drive 設置

### 步驟 1：建立 Google Cloud 專案

1. 訪問 [Google Cloud Console](https://console.cloud.google.com)
2. 建立新專案 → 輸入名稱 → 點擊「建立」
3. 等待專案建立完成（約 30 秒）

### 步驟 2：啟用 Google Drive API

1. 在搜尋欄搜尋「Google Drive API」
2. 點擊「啟用」按鈕
3. 等待啟用完成

### 步驟 3：建立服務帳戶

1. 左側菜單 → **API 和服務** → **服務帳戶**
2. 點擊「建立服務帳戶」
   - 帳戶名稱：`online-catalog-sync`
   - 帳戶 ID：`online-catalog-sync`
   - 描述：`Image sync automation`
3. 點擊「建立並繼續」

### 步驟 4：授予角色

1. 選擇角色 → **基本** → **檢視者**
2. 點擊「繼續」
3. 點擊「完成」

### 步驟 5：建立 JSON 金鑰

1. 在服務帳戶列表中找到剛建立的帳戶，點擊它
2. 轉到「金鑰」標籤
3. 點擊「建立金鑰」
4. 選擇「JSON」
5. 金鑰會自動下載 → 保存在安全位置

### 步驟 6：配置環境變數

1. 打開下載的 JSON 檔案
2. 複製整個 JSON 內容
3. 在 `.env.local` 中，將其貼到 `GOOGLE_APPLICATION_CREDENTIALS_JSON`

### 步驟 7：建立 Google Drive 資料夾

1. 打開 [Google Drive](https://drive.google.com)
2. 建立新資料夾 → 名稱：`product-images-catalog`
3. 右鍵點擊資料夾 → **共用**
4. 貼上服務帳戶的電子郵件：
   ```
   online-catalog-sync@YOUR_PROJECT_ID.iam.gserviceaccount.com
   ```
5. 權限設為「編輯」或「檢視者」
6. 複製資料夾 URL 中的資料夾 ID
7. 在 `.env.local` 中設置 `GOOGLE_DRIVE_FOLDER_ID`

### 步驟 8：上傳測試圖片

在 Google Drive 資料夾中上傳圖片，檔名格式：
```
k_<型號>_<顏色代碼>.jpg
```

例子：
- `k_1234567_bk.jpg` (黑色)
- `k_1234567_wh.jpg` (白色)
- `k_2345678_rd.jpg` (紅色)

---

## 🚀 運行圖片同步

### 本地手動同步

```bash
# 同步 Google Drive 圖片
npm run sync-images
```

### 驗證同步成功

檢查 `public/imageMapping.json` 是否已建立且包含映射數據。

---

## 📦 部署到 Vercel

### 步驟 1：推送到 GitHub

```bash
git push origin main
```

### 步驟 2：連接 Vercel

1. 訪問 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點擊「Import Project」
3. 選擇 GitHub 倉庫
4. 點擊「Import」

### 步驟 3：設置環境變數

在 Vercel 中設置以下環境變數：

- `GOOGLE_DRIVE_FOLDER_ID`
- `CRON_SECRET`
- `GOOGLE_APPLICATION_CREDENTIALS_JSON`
- `NEXT_PUBLIC_SITE_URL` (設為你的 Vercel URL)

### 步驟 4：部署

點擊「Deploy」按鈕。部署完成後，你的應用會在：
```
https://your-project.vercel.app
```

### 步驟 5：配置 Cron Job

Vercel 會根據 `vercel.json` 中的配置自動設置 Cron Job：

```json
{
  "crons": [
    {
      "path": "/api/sync-images",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

這表示每 6 小時自動同步一次圖片。

---

## 🧪 測試

### 檢查 API

```bash
# 檢查搜尋 API
curl "http://localhost:3000/api/search?q=背包"

# 手動觸發圖片同步（本地）
curl -X POST "http://localhost:3000/api/sync-images?secret=your-secret-key"
```

### 功能測試

1. **商品目錄** - 訪問 `/products`
2. **搜尋** - 訪問 `/search?q=搜尋詞`
3. **商品詳情** - 訪問 `/products/prod-001`
4. **分類篩選** - 在商品目錄頁面點擊分類

---

## 📊 可用的路由

| 路由 | 方法 | 功能 |
|------|------|------|
| `/` | GET | 首頁 |
| `/products` | GET | 商品目錄 |
| `/products/[id]` | GET | 商品詳情 |
| `/search` | GET | 搜尋結果 |
| `/api/search` | GET | 搜尋 API |
| `/api/sync-images` | POST | 圖片同步 API |

---

## 🔐 安全提示

⚠️ **重要**：

1. **不要**在 GitHub 中提交 `.env.local`
2. **保護** `CRON_SECRET` 和 Google Cloud 認證信息
3. 定期**更換** `CRON_SECRET`
4. 在生產環境中使用 **HTTPS**

---

## 🐛 故障排除

### 問題：找不到商品圖片

**解決方案**：
1. 檢查圖片檔名格式是否正確：`k_型號_顏色代碼.jpg`
2. 運行 `npm run sync-images` 重新同步
3. 檢查 `public/imageMapping.json` 是否已更新

### 問題：Google Drive API 錯誤

**解決方案**：
1. 驗證 `GOOGLE_APPLICATION_CREDENTIALS_JSON` 是否正確設置
2. 確認服務帳戶有訪問資料夾的權限
3. 檢查 `GOOGLE_DRIVE_FOLDER_ID` 是否正確

### 問題：搜尋不工作

**解決方案**：
1. 檢查 `public/products.json` 是否存在
2. 確認商品數據格式正確
3. 檢查瀏覽器控制台是否有錯誤信息

---

## 📚 文檔

- [專案指南](./ONLINE_CATALOG_PROJECT.md)
- [開發日誌](./DEVELOPMENT_LOG.md)
- [版本控制指南](./VERSION_CONTROL.md)

---

## 🤝 貢獻

歡迎提交問題和拉取請求！

---

## 📄 許可證

MIT License

---

**最後更新**: 2026-04-14  
**當前版本**: v0.5.0
