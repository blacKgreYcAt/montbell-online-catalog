# 備份清單 - Montbell Online Catalog

## 備份信息

**備份時間**: 2026-06-12  
**備份版本**: v1.0.0 (Stable Public Version)  
**備份標籤**: `v1.0.0-backup-before-internal-launch`  
**Git Commit**: f121884 (fix: Remove emoji icons from homepage category browsing section)

---

## 📦 備份內容

### 代碼庫
- **GitHub Repository**: https://github.com/blacKgreYcAt/montbell-online-catalog
- **分支**: main
- **標籤**: v1.0.0-backup-before-internal-launch
- **Commit Hash**: f121884

### 重要數據文件

#### 公開版
```
public/products.json              - 公開版商品數據（前一季）
public/imageMapping.json          - 公開版圖片映射
lib/constants.ts                  - 配置常數
```

#### 配置文件
```
.env.local                        - 本地環境變數
.env.production                   - 生產環境配置
vercel.json                       - Vercel 部署配置
next.config.js                    - Next.js 配置
tsconfig.json                     - TypeScript 配置
```

#### 核心組件
```
src/components/                   - 所有 React 組件
src/app/                          - 應用路由
src/lib/                          - 工具函數和邏輯
src/types/                        - TypeScript 類型定義
```

---

## 🔄 回滾說明

### 如果需要回到穩定版本：

**步驟 1：檢出備份版本**
```bash
git checkout v1.0.0-backup-before-internal-launch
```

**步驟 2：重新部署到 Vercel**
```bash
git push origin main --force
# 或在 Vercel Dashboard 中手動重新部署
```

**步驟 3：驗證**
- 訪問公開版網站
- 確認所有功能正常

---

## 📋 當前系統狀態

### 已部署版本
- **公開版**: https://montbell-online-catalog.vercel.app
- **狀態**: ✅ 正常運作
- **特性**:
  - 公開商品展示
  - 搜尋功能
  - 分類導航
  - 顏色選擇
  - Google Drive 圖片集成

### 新增功能（計劃部署）
- **內部版**: 將部署到新的 Vercel 項目
- **版本**: v1.1.0-internal
- **特性**:
  - FW27 新品（181 個商品）
  - Google Drive 圖片（362 個映射）
  - 密碼認證（FUTAI12012403）
  - FW27新品快速入口

---

## 📊 備份完整性檢查

### 代碼庫
- [x] 所有源代碼已上傳 GitHub
- [x] Git 標籤已創建
- [x] 提交歷史完整（32 個提交）

### 數據文件
- [x] products.json（公開版）
- [x] imageMapping.json（公開版）
- [x] 環境配置文件
- [x] 所有配置文件

### 依賴和配置
- [x] package.json
- [x] package-lock.json
- [x] TypeScript 配置
- [x] Vercel 配置

---

## 🆕 新版本部署信息

### 新版本號：v1.1.0-internal

**計劃部署組件：**
1. products-internal.json（181 個 FW27 商品）
2. imageMapping-internal.json（362 個圖片映射）
3. 認證頁面（密碼保護）
4. FW27新品分類（快速入口）
5. 內部版 Vercel 項目配置

**新 Vercel 項目：**
- 項目名稱：montbell-online-catalog-internal
- 環境變數：
  - NEXT_PUBLIC_MODE=internal
  - INTERNAL_PASSWORD=FUTAI12012403
  - GOOGLE_DRIVE_FOLDER_ID=1Exk2m_sRClfmx0fIk6_I57TMDsxbOj5D

---

## ✅ 備份確認

```
備份日期：2026-06-12
備份人員：Claude Code
驗證狀態：✅ 完整
回滾可行性：✅ 可行
```

---

## 📞 聯繫方式

如果需要恢復此備份：
1. 提供版本號或日期
2. 提供要恢復的具體內容
3. 確認恢復後的測試計劃

---

**備份完成日期**: 2026-06-12  
**下一步**: 部署 v1.1.0-internal（FW27 內部版）
