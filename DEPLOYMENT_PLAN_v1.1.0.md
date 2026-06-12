# 部署計劃 v1.1.0 - FW27 內部版

## 📋 部署概況

| 項目 | 詳情 |
|------|------|
| **版本號** | v1.1.0-internal |
| **部署日期** | 2026-06-12 |
| **備份版本** | v1.0.0-backup-before-internal-launch |
| **備份 Commit** | f121884 |
| **回滾時間** | < 5 分鐘 |

---

## 🎯 部署目標

### 新功能
1. ✅ FW27 內部版網站（獨立 Vercel 項目）
2. ✅ 181 個商品展示
3. ✅ 362 個 Google Drive 圖片集成
4. ✅ 密碼認證保護（FUTAI12012403）
5. ✅ FW27新品快速入口分類

### 保留功能
- ✅ 公開版網站維持不變
- ✅ 公開版 products.json 保持原樣
- ✅ 公開版所有功能正常運作

---

## 🔧 部署前準備

### 已完成 ✅
- [x] 備份現有版本（v1.0.0）
- [x] Git 標籤創建：v1.0.0-backup-before-internal-launch
- [x] 備份清單編寫
- [x] 362 個 Google Drive 圖片映射完成
- [x] FW27 商品數據提取（181 個）
- [x] 密碼確認：FTAI12012403

### 待完成 ⏳
- [ ] 用戶確認分類方案（FW27新品快速入口）
- [ ] 用戶確認現在開始部署

---

## 📊 新版本數據

### products-internal.json
```json
{
  "version": "1.1.0-internal",
  "season": "FW",
  "products": [
    {
      "id": "prod-1101770",
      "modelNumber": "1101770",
      "name": "PERMAFROST DOWN PARKA MEN'S",
      "category": "INSULATION",
      "season": "FW",
      "isPublic": false,
      "colors": ["BK", "DTL", "MST"],
      "images": {
        "BK": "1h0-dtSA74B1R5U16ywSs83GRelwF2xdO",
        "DTL": "1hCv0ykJ3GktuODyTvEXKv_lNfnMj3imV",
        "MST": "1L2ImU0wHONigSFVEP73rYtPbyKreMYId"
      }
    },
    ... (總共 181 個商品)
  ]
}
```

**統計：**
- 商品數：181 個
- 圖片映射：362 個
- 平均每個商品：2.7 張圖片

---

## 🚀 部署步驟

### 階段 1：代碼準備（完成時間：30 分鐘）

#### Step 1: 生成 products-internal.json
```
輸入：FW27 內部版 Excel + 362 個圖片映射
輸出：完整的 products-internal.json
```

#### Step 2: 更新分類系統
```
在 categories.ts 中添加：
{
  id: 'fw27-new',
  name: 'FW27新品',
  slug: 'fw27-new',
  description: '最新的FW27季新商品'
}
```

#### Step 3: 創建認證頁面
```
新建：src/components/AuthGate.tsx
功能：密碼驗證（FUTAI12012403）
```

#### Step 4: 修改環境變數邏輯
```
更新 src/app/layout.tsx
如果 NEXT_PUBLIC_MODE=internal，啟用 AuthGate
```

#### Step 5: 本地構建測試
```bash
npm run build
# 驗證 0 個錯誤
```

### 階段 2：Vercel 部署（完成時間：20 分鐘）

#### Step 6: 創建新 Vercel 項目
```
項目名稱：montbell-online-catalog-internal
Git 源：同一個 GitHub 庫
分支：main
```

#### Step 7: 配置環境變數
```
NEXT_PUBLIC_MODE=internal
INTERNAL_PASSWORD=FUTAI12012403
GOOGLE_DRIVE_FOLDER_ID=1Exk2m_sRClfmx0fIk6_I57TMDsxbOj5D
NEXT_PUBLIC_CURRENT_SEASON=FW
```

#### Step 8: 部署並驗證
```
Vercel 自動部署
預期部署時間：3-5 分鐘
URL：https://montbell-internal-catalog.vercel.app
```

### 階段 3：測試驗證（完成時間：20 分鐘）

#### Step 9: 驗證清單
- [ ] 訪問內部版 URL
- [ ] 驗證密碼頁面顯示
- [ ] 輸入正確密碼登入
- [ ] 驗證 FW27新品分類顯示
- [ ] 點擊 FW27新品，看到 181 個商品
- [ ] 驗證圖片正確加載（Google Drive）
- [ ] 驗證搜尋功能
- [ ] 驗證顏色選擇
- [ ] 在平板上測試響應式設計
- [ ] 驗證公開版網站仍正常運作

---

## 🔄 回滾計劃

### 如果部署出現問題

#### 快速回滾（< 5 分鐘）
```bash
# 方式 1：使用 Git 標籤
git checkout v1.0.0-backup-before-internal-launch
git push origin main --force

# 方式 2：在 Vercel Dashboard
- 進入 Deployments
- 選擇 f121884 版本
- 點擊 Redeploy
```

#### 驗證回滾
```
1. 訪問公開版網站
2. 確認所有功能正常
3. 檢查 products.json 是否正確
4. 驗證圖片加載
```

---

## 📋 版本命名規則

```
v1.0.0                              - 公開版（當前穩定）
v1.0.0-backup-before-internal-launch - 備份標籤
v1.1.0-internal                     - 內部版（新部署）
```

---

## 📞 部署確認清單

在開始部署前，請確認：

- [x] 備份已完成
- [x] Git 標籤已創建
- [x] 備份清單已編寫
- [ ] 分類方案已確認（FW27新品快速入口）
- [ ] 密碼已確認（FUTAI12012403）
- [ ] 確認現在開始部署

---

## 🎯 下一步

**您需要確認：**

1. **分類方案** - 同意添加「FW27新品」快速入口嗎？
2. **開始部署** - 現在可以開始部署 v1.1.0-internal 嗎？

**確認後，我立即開始：**
- 生成 products-internal.json
- 更新分類系統
- 創建認證頁面
- 在 Vercel 部署新項目
- 完整測試驗證

---

**部署準備狀態：✅ 完全就緒**  
**回滾可行性：✅ 完全可行（< 5 分鐘）**  
**預計總時間：70 分鐘**
