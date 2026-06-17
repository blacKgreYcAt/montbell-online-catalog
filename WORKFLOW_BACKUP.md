# Montbell Online Catalog - 完整工作流程備份

**備份日期：2026-06-17**  
**備份版本：v1.0**

---

## 📋 工作流程總覽

### 系統架構
```
Montbell Online Catalog
├── 公開版 (Public)
│   ├── 1273 個產品
│   ├── /search?q=... 搜尋
│   └── 公開展示
│
└── 內部版 (Internal)
    ├── 181 個 FW27 產品
    ├── /internal/search?q=... 搜尋
    ├── localStorage 認證 (FUTAI12012403)
    └── 展示會專用 (截止 2026-06-29)
```

---

## 🔄 圖片上傳與更新流程

### Phase 1: 圖片資料掃描
**路徑：** `D:\MB 官網\FW27原廠資料\ISM 拍攝資料`

**文件規範：**
- ✅ 符合規範：`{型號}_{顏色}.jpg` 或 `{型號}_sample.jpg`
- ❌ 不符合規範：其他命名方式（忽略不使用）

**色碼對應：**
- 標準色碼：BK, NV, RD, IV, DGY 等
- 特殊色碼：#1, #2, #3 等
- 樣品：sample → 添加 "樣品" 色碼選項

### Phase 2: 數據整合
1. **掃描文件夾結構**
   ```
   ISM 拍攝資料/
   ├── 1101770/
   │   ├── 1101770_BK.jpg ✅
   │   ├── 1101770_sample.jpg → 添加 "樣品" 色碼
   │   └── 1101770_DTL.jpg ✅
   └── 1119296/
       ├── 1119296_#1.jpg ✅
       └── 1119296_sample.jpg → 添加 "樣品" 色碼
   ```

2. **更新產品色碼**
   - 在 `products-internal.json` 中添加 "樣品" 到對應商品的 `colors` 陣列
   - 格式：`"colors": ["BK", "DTL", "MST", "樣品"]`

3. **更新映射檔**
   - 在 `imageMapping-internal.json` 中添加 sample 映射
   - 鍵：`{型號}_樣品` 
   - 值：Cloudinary URL

### Phase 3: 圖片上傳
**目標：** Cloudinary CDN (`montbell_fw27` 資料夾)

**上傳規則：**
- public_id：`{型號}_{顏色代碼}`
  - 例：`1101770_BK`, `1119296_1`, `1101770_sample`
- 保留本地文件名：保留原始 `_sample.jpg`
- 映射保存：在 `imageMapping-internal.json` 中記錄

**特殊處理：**
- # 符號色碼：上傳時用數字 (1,2,3)，映射中保留 # (#1, #2, #3)
- sample 圖片：直接上傳，映射 key 使用 `_樣品`

### Phase 4: 部署與驗證
1. 更新 `products-internal.json`
2. 更新 `imageMapping-internal.json`
3. Git 提交
4. Vercel 部署
5. 測試驗證

---

## 📊 數據結構

### products-internal.json 結構
```json
{
  "id": "fw27-1",
  "modelNumber": "1101770",
  "name": "PERMAFROST 羽絨派克外套 男款",
  "category": "INSULATION",
  "description": "...",
  "features": "...",
  "sizes": ["S", "M", "L", "XL"],
  "weight": "550 g",
  "price": "￥34,000",
  "colors": ["BK", "DTL", "MST", "樣品"],  // ← 新增 "樣品"
  "season": "FW"
}
```

### imageMapping-internal.json 結構
```json
{
  "1101770_BK": "https://res.cloudinary.com/.../1101770_BK.jpg",
  "1101770_DTL": "https://res.cloudinary.com/.../1101770_DTL.jpg",
  "1101770_MST": "https://res.cloudinary.com/.../1101770_MST.jpg",
  "1101770_樣品": "https://res.cloudinary.com/.../1101770_sample.jpg"  // ← 新增
}
```

---

## 🔧 技術實現細節

### 1. 文件掃描邏輯
```javascript
// 偽代碼
const allowedExtensions = ['.jpg', '.jpeg', '.png'];
const filePattern = /^(\d+)_(.+)\.\w+$/; // 型號_顏色.jpg

for each file in ISM拍攝資料:
  if file matches pattern:
    modelNumber = match[1]
    colorCode = match[2]
    
    if colorCode === 'sample':
      addToSampleList(modelNumber)
    else:
      addToNormalList(modelNumber, colorCode)
```

### 2. 色碼對應映射
```javascript
// 顏色規範化
const colorMap = {
  'BK': 'BK',
  'NV': 'NV',
  'sample': '樣品',
  '#1': '#1',
  '#2': '#2'
  // ...
}
```

### 3. Cloudinary 上傳參數
```javascript
cloudinary.uploader.upload(filePath, {
  resource_type: 'auto',
  folder: 'montbell_fw27',
  public_id: `${modelNumber}_${colorCode}`,  // 1101770_BK 或 1101770_sample
  overwrite: true
})
```

---

## 📁 備份文件位置

**備份時間：2026-06-17 18:40:33**

```
backups/
├── products-internal.backup.20260617_184033.json    (247 KB)
└── imageMapping-internal.backup.20260617_184033.json  (53 KB)
```

**恢復命令：**
```bash
cp backups/products-internal.backup.20260617_184033.json public/products-internal.json
cp backups/imageMapping-internal.backup.20260617_184033.json public/imageMapping-internal.json
```

---

## 🎯 執行檢查清單

- [ ] 掃描 `ISM 拍攝資料` 文件夾
- [ ] 驗證文件名規範
- [ ] 提取所有 sample 圖片清單
- [ ] 上傳所有圖片到 Cloudinary
- [ ] 更新 `products-internal.json` (添加 "樣品" 色碼)
- [ ] 更新 `imageMapping-internal.json` (添加 sample 映射)
- [ ] Git 提交
- [ ] Vercel 部署
- [ ] 測試驗證：
  - [ ] 樣品色碼顯示正確
  - [ ] 樣品圖片正確加載
  - [ ] 搜尋功能正常
  - [ ] 不符合規範的圖片未被使用

---

## 📝 注意事項

### 重要：
1. **只使用符合規範的文件** - 其他命名方式的圖片不導入
2. **樣品色碼統一為 "樣品"** - 避免因大小寫或格式差異造成混亂
3. **保留原始文件名** - 本地 `_sample.jpg` 在映射中保持原樣
4. **備份優先** - 所有更新前確保備份已完成

### 特殊色碼處理：
- **# 符號色碼**：上傳時用數字，映射中保留 #
  - 本地：`1119296_#1.jpg`
  - 上傳：`public_id: "1119296_1"`
  - 映射：`"1119296_#1": "https://..."`
  - 顯示：UI 顯示 #1

- **Sample 圖片**：保持一致性
  - 本地：`1101770_sample.jpg`
  - 上傳：`public_id: "1101770_sample"`
  - 映射：`"1101770_樣品": "https://..."`
  - 顯示：UI 顯示 樣品

---

## 🔗 相關文件

**主要文件：**
- `src/app/internal/products/[id]/page.tsx` - 產品詳情頁面
- `src/components/ProductCard.tsx` - 商品卡片
- `public/products-internal.json` - 內部版產品數據
- `public/imageMapping-internal.json` - 圖片映射

**上傳腳本：**
- `incremental-upload.js` - 增量上傳
- `upload-special-images.js` - 特殊色碼上傳

---

## 📞 執行狀態

**目前狀態：** 準備掃描 ISM 拍攝資料  
**下一步：** 確認理解後開始執行

**聯絡方式：**
- Email: benjaminchu0508@gmail.com
- 部署平台：Vercel
- 圖床：Cloudinary (`montbell_fw27`)

---

**備份完整性檢查：** ✅
- ✅ 產品數據備份
- ✅ 圖片映射備份
- ✅ 工作流程文檔
- ✅ Git 版本控制

**準備狀態：** ✅ 就緒
