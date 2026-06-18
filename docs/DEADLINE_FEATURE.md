# 結單日期自動關閉功能

## 功能說明

當 FW27 展示會結單日期（**2026 年 6 月 29 日 23:59:59**）到達時，網站自動關閉，用戶將無法查看任何商品內容。

## 實現方式

### 1. **日期檢查工具** (`src/lib/deadlineCheck.ts`)

```typescript
isAfterDeadline(): boolean   // 檢查是否超過結單日期
getDaysUntilDeadline(): number // 獲取距離結單的天數
```

**結單日期設置**：
- 年份: 2026
- 月份: 6 (June)
- 日期: 29
- 時間: 23:59:59 (當日結束時刻)

### 2. **關閉頁面** (`src/app/closed/page.tsx`)

展示如下內容：
- 🔒 大型鎖定圖標
- 標題：「現在非 FW27 展示會線上目錄公開期間」
- 結單日期說明
- 聯繫方式提示

```
現在非 FW27 展示會線上目錄公開期間
感謝您對蒙貝爾展示會線上目錄的關注。本次展示會已結束，網站已關閉。
結單日期：2026 年 6 月 29 日
```

### 3. **受保護的路由**

以下路由在超過結單日期後會自動重定向至 `/closed`：
- `/products` - 公開商品列表
- `/products/[id]` - 商品詳情頁面

### 4. **重定向邏輯**

#### 首頁 (`/`)
- 顯示 `DeadlineWarning` 組件
- 1 秒後自動重定向至 `/closed`

#### 商品頁面
- 使用 `useEffect` 檢查日期
- 若超過結單日期，立即使用 `router.replace('/closed')` 重定向

### 5. **防止繞過**

- ✅ 直接訪問 `/products` 被攔截
- ✅ 直接訪問商品詳情頁 `/products/[id]` 被攔截
- ✅ 首頁進入後立即重定向
- ✅ 無法通過任何路由查看商品

## 相關檔案

| 檔案 | 用途 |
|------|------|
| `src/lib/deadlineCheck.ts` | 日期檢查工具函數 |
| `src/app/closed/page.tsx` | 關閉頁面 |
| `src/components/DeadlineGuard.tsx` | 路由守衛組件 |
| `src/components/DeadlineWarning.tsx` | 首頁警告組件 |
| `src/app/page.tsx` | 首頁（添加警告組件） |
| `src/app/products/page.tsx` | 商品列表頁（添加日期檢查） |
| `src/app/products/[id]/page.tsx` | 商品詳情頁（添加日期檢查） |

## 測試方法

### 測試日期檢查邏輯

編輯 `src/lib/deadlineCheck.ts` 的截止日期：

```typescript
// 測試時：改為今天的前一天
const deadline = new Date(2026, 5, 17, 23, 59, 59); // 改為任意過去日期
```

然後訪問：
1. `http://localhost:3000/` → 應 1 秒後重定向至 `/closed`
2. `http://localhost:3000/products` → 應立即重定向至 `/closed`
3. `http://localhost:3000/products/p-1121826` → 應立即重定向至 `/closed`
4. `http://localhost:3000/closed` → 應顯示關閉頁面

### 恢復正常測試

改回實際結單日期：

```typescript
const deadline = new Date(2026, 5, 29, 23, 59, 59); // 2026-06-29
```

## 部署提醒

- ✅ 已部署至 Vercel
- ✅ GitHub 提交: `7162605`
- ✅ 所有保護路由已啟用

## 未來增強建議

1. **內部版保護** - 也在內部版路由添加日期檢查
2. **API 保護** - 保護任何 API 端點
3. **通知機制** - 在結單日期前發送通知
4. **存檔頁面** - 提供歷史展示會的存檔查看
