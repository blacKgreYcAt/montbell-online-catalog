# Montbell Product Data Processor Agent

**技能描述：** 自動處理商品資料並部署到生產環境  
**觸發方式：** 用戶提供 Excel 文件路徑  
**功能範圍：** Excel 轉換 → JSON 生成 → Git 提交 → Vercel 部署

---

## 📋 自動化工作流程

### 步驟 1：數據驗證
```
1. 檢查 Excel 文件是否存在
2. 驗證季節自動檢測（SS 或 FW）
3. 讀取 Excel 欄位結構
4. 確認必要欄位（型號、名稱、分類等）
```

### 步驟 2：數據轉換
```
1. 執行 read_excel.py 腳本
2. 自動解析 Excel 數據
3. 添加季節字段
4. 格式化顏色和尺寸
5. 驗證所有商品資料
```

### 步驟 3：生成 products.json
```
1. 確認 public/products.json 生成成功
2. 驗證 JSON 結構完整性
3. 檢查商品總數和分類數
4. 驗證所有商品包含 season 字段
```

### 步驟 4：版本控制
```
1. 執行 git add public/products.json
2. 創建自動提交信息（包含商品統計）
3. 推送到 GitHub 主分支
```

### 步驟 5：部署到 Vercel
```
1. 執行 vercel deploy --prod
2. 等待構建完成
3. 驗證部署成功
4. 測試 API 端點
```

### 步驟 6：驗證與報告
```
1. 驗證 /api/search 返回正確數據
2. 檢查商品總數匹配
3. 驗證 season 字段
4. 生成完整的部署報告
```

---

## 🎯 使用方式

### 基本用法
```
用戶：請處理商品資料，Excel 文件在 path/to/file.xlsx
Agent：
  1. 驗證文件
  2. 自動檢測季節（SS 或 FW）
  3. 轉換數據
  4. 部署到 Vercel
  5. 返回完整報告
```

### 參數範例
```
Excel 文件名：27SS 正式_ 工作本連結資料27SS 資料檔.xlsx
季節自動檢測：SS（從文件名 "SS" 提取）
輸出：
  - 商品總數：1,153 件
  - 分類數：30 個
  - 顏色數：246 種
  - 部署 URL：https://montbell-online-catalog.vercel.app
```

---

## 🔄 自動化流程詳情

### read_excel.py 處理流程
```python
1. detect_season(filename)
   - 檢查文件名中的 "SS" 或 "FW"
   - 預設值：SS

2. 列欄位映射：
   Col 1: 改款/推薦 (Badge)
   Col 2: 系列 (Category)
   Col 3: 型號 (Model Number)
   Col 4: 品名 (Product Name)
   Col 5: 色號名稱 (Colors)
   Col 6: 尺寸 (Sizes)
   Col 7: 訂價 (Price)
   Col 8: 特色 (Description)
   Col 9: 頁碼 (Page Number)

3. 為每個商品添加：
   - season 字段（自動檢測）
   - id 字段（prod-{modelNumber}）
   - 格式化的顏色/尺寸陣列
```

### Git 提交信息範本
```
feat: Update products for [SEASON] season

Processed [X] products from [FILENAME]:
- Season: [SS/FW]
- Total products: [COUNT]
- Categories: [COUNT]
- Colors: [COUNT]
- File: [FILENAME]
- Date: [DATE]

Deployment: https://montbell-online-catalog.vercel.app

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

---

## ✅ 驗證清單

Agent 完成後應驗證：

- [ ] read_excel.py 執行成功
- [ ] products.json 生成完整
- [ ] 所有商品包含 season 字段
- [ ] 商品總數符合預期
- [ ] Git 提交成功
- [ ] Vercel 部署完成
- [ ] API 返回正確數據
- [ ] 季節過濾正常運作
- [ ] 生產網站正常訪問
- [ ] 部署報告準確完整

---

## 📊 報告輸出範例

```
✅ 商品資料處理完成

== 數據統計 ==
季節：SS (春夏)
總商品數：1,153 件
商品分類：30 個
色號數：246 種

== 文件信息 ==
源文件：27SS 正式_ 工作本連結資料27SS 資料檔.xlsx
輸出文件：public/products.json
文件大小：[SIZE]

== Git 信息 ==
提交 ID：[COMMIT_ID]
分支：main
狀態：✅ 推送成功

== 部署信息 ==
平台：Vercel
URL：https://montbell-online-catalog.vercel.app
狀態：✅ 部署成功
構建時間：[TIME]s

== API 驗證 ==
✅ /api/search 正常運作
✅ 返回商品數：1,153 件
✅ 所有商品包含 season 字段
✅ 季節過濾正常

== 完成時間 ==
開始：[TIME]
結束：[TIME]
總耗時：[DURATION]

🎉 所有驗證通過！生產環境已更新。
```

---

## 🚀 觸發方式

### 方法 1：直接提供文件路徑
```
用戶：自動處理商品資料，文件在 C:\path\to\27SS.xlsx
```

### 方法 2：詢問後自動處理
```
用戶：我有新的商品資料需要上傳
Agent：請提供 Excel 文件路徑
用戶：C:\path\to\27FW.xlsx
Agent：[自動開始處理]
```

### 方法 3：排程自動運行（未來功能）
```
每周二下午 2:00 UTC+8 自動檢查是否有新的商品資料
如果找到，自動執行完整流程
```

---

**最後更新：** 2026-04-16  
**版本：** v1.0  
**狀態：** 準備就緒 ✅
