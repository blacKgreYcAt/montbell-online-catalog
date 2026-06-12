# 登入權限控制 & 協作後台 實現路線圖

## 📋 項目概述
增加使用者認證、權限控制及後台管理系統，讓多位同事可以協作編輯商品資料。

---

## 🏗️ 架構設計

### 1️⃣ 認證系統 (Authentication)

#### 選項比較：

| 方案 | 優點 | 缺點 | 適用場景 |
|-----|------|------|---------|
| **NextAuth.js** | 官方推薦、易整合、支援多種登入 | 需要資料庫 | ✅ **推薦** |
| **Auth0** | 完全託管、高安全性 | 月費用、外部依賴 | 大型團隊 |
| **Clerk** | 現代化UI、開發友善 | 月費用 | 新創公司 |
| **自建** | 完全控制 | 複雜、易有安全漏洞 | ❌ 不建議 |

**建議：NextAuth.js + PostgreSQL**

#### 需要實現：
```
✓ 使用者註冊 / 登入頁面
✓ JWT Token 管理
✓ Session 儲存
✓ 密碼加密 (bcrypt)
✓ 記住我 (Remember Me) 功能
✓ 忘記密碼 / 重設密碼
✓ 帳戶鎖定機制 (防暴力破解)
```

---

### 2️⃣ 授權系統 (Authorization)

#### 角色權限設計：

```
┌─────────────────────────────────────────┐
│           使用者角色系統                  │
├─────────────────────────────────────────┤
│                                          │
│  👤 訪客 (Guest)                        │
│   └─ 只能瀏覽商品目錄                   │
│                                          │
│  👨 編輯者 (Editor)                     │
│   ├─ 新增/編輯/刪除商品                │
│   ├─ 上傳商品圖片                      │
│   ├─ 管理分類                          │
│   └─ 瀏覽銷售統計                      │
│                                          │
│  👨‍💼 管理員 (Admin)                    │
│   ├─ 所有編輯者權限                    │
│   ├─ 管理使用者帳戶                    │
│   ├─ 設定系統參數                      │
│   ├─ 檢視審計日誌                      │
│   └─ 備份/匯出資料                     │
│                                          │
└─────────────────────────────────────────┘
```

#### 需要實現：
```
✓ 角色定義 (roles: guest, editor, admin)
✓ 權限檢查 Middleware
✓ API 路由保護
✓ UI 元件條件渲染 (根據權限顯示)
✓ 權限驗證攔截器
```

---

### 3️⃣ 資料庫設計

#### 需要的新表：

```sql
-- 使用者表
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  role ENUM('guest', 'editor', 'admin'),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 會話表
CREATE TABLE sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id UUID FOREIGN KEY,
  token VARCHAR(500),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 審計日誌表
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID,
  action VARCHAR(50), -- 'CREATE', 'UPDATE', 'DELETE'
  entity_type VARCHAR(50), -- 'product', 'category', 'user'
  entity_id VARCHAR(255),
  changes JSONB, -- 存放變更前後的資料
  timestamp TIMESTAMP DEFAULT NOW()
);

-- 商品版本歷史 (可選)
CREATE TABLE product_versions (
  id UUID PRIMARY KEY,
  product_id VARCHAR(255),
  data JSONB, -- 完整的商品資料快照
  changed_by UUID,
  change_description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 選擇資料庫：

| 選項 | 優點 | 缺點 | 成本 |
|-----|------|------|------|
| **PostgreSQL** | 功能完整、可靠 | 需自己管理 | 自建：低 |
| **Supabase** | PostgreSQL + 即時更新 | 有月費 | 低-中 |
| **Firebase** | 無伺服器、自動擴展 | 供應商鎖定 | 中 |
| **PlanetScale** | MySQL、快速 | 較新 | 低-中 |

**建議：Supabase (PostgreSQL + 免費層足夠)**

---

### 4️⃣ 後台管理系統

#### 後台頁面結構：

```
/admin
├── /dashboard           # 儀表板 (統計、最近活動)
├── /products           # 商品管理
│   ├── /list           # 商品列表
│   ├── /[id]/edit      # 編輯商品
│   └── /create         # 新增商品
├── /categories         # 分類管理
├── /users              # 使用者管理 (Admin only)
├── /audit-logs         # 審計日誌 (Admin only)
├── /settings           # 系統設定 (Admin only)
└── /profile            # 個人資料

/api/admin
├── /products           # 商品 CRUD API
├── /categories         # 分類 API
├── /users              # 使用者管理 API
├── /audit-logs         # 日誌 API
└── /settings           # 設定 API
```

#### 需要實現的元件：
```
✓ 後台導航菜單
✓ 商品編輯表單 (Rich text editor, 圖片上傳)
✓ 使用者管理表格 (新增/編輯/刪除使用者)
✓ 統計儀表板 (圖表、KPI)
✓ 審計日誌查看器
✓ 批量操作功能 (批量上傳、編輯)
✓ 搜尋和過濾
```

---

## 🛠️ 技術棧選擇

### 推薦方案：

```
前端：
  ✓ Next.js 13+ (現有)
  ✓ React Hook Form (表單管理)
  ✓ TanStack Query (資料同步)
  ✓ Tailwind CSS (現有)
  ✓ Recharts / Chart.js (圖表)
  ✓ React Toastify (通知)

後端：
  ✓ Next.js API Routes (現有)
  ✓ NextAuth.js (認證)
  ✓ Prisma ORM (資料庫操作)
  ✓ Zod (資料驗證)

資料庫：
  ✓ Supabase (PostgreSQL + 即時)
  或
  ✓ 本地 PostgreSQL + Docker

儲存：
  ✓ AWS S3 / Cloudinary (圖片儲存)
  或
  ✓ Vercel Blob (更便宜)
```

---

## 📊 實現步驟

### 第一階段：認證系統 (1-2 週)
```
Week 1:
  Day 1-2: 設置 Supabase 和 Prisma
  Day 3-4: 實現 NextAuth.js
  Day 5:   登入/登出頁面

Week 2:
  Day 1-2: 密碼重設流程
  Day 3:   帳戶安全機制
  Day 4-5: 測試和調試
```

### 第二階段：授權系統 (1 週)
```
  Day 1:   角色定義和權限模型
  Day 2-3: 實現 middleware 和 API 保護
  Day 4:   UI 條件渲染
  Day 5:   測試
```

### 第三階段：後台管理系統 (2-3 週)
```
Week 1:
  Day 1-2: 後台框架和導航
  Day 3-4: 商品管理功能
  Day 5:   分類管理

Week 2:
  Day 1-2: 使用者管理
  Day 3:   審計日誌
  Day 4-5: 儀表板和統計

Week 3:
  Day 1-3: 高級功能 (批量操作、匯出)
  Day 4-5: 測試和優化
```

### 第四階段：部署和安全 (1 週)
```
  Day 1-2: 環境配置 (Dev, Staging, Prod)
  Day 3:   HTTPS 和 CORS 設置
  Day 4:   速率限制和防暴力破解
  Day 5:   安全審計和文檔
```

---

## 🔒 安全考慮

```
✅ 必須實現：
  • HTTPS/TLS 加密傳輸
  • 密碼加密存儲 (bcrypt + salt)
  • CSRF 防護
  • SQL 注入防護 (使用 ORM)
  • XSS 防護 (React 自動處理)
  • 速率限制 (防暴力破解)
  • CORS 設置
  • API 金鑰管理
  • 敏感資料不存 cookies

✅ 建議實現：
  • 兩因素認證 (2FA)
  • 審計日誌 (記錄所有操作)
  • 會話超時
  • IP 白名單 (可選)
  • 定期安全更新
```

---

## 💾 資料備份和還原

```
自動備份：
  ✓ 每日自動備份到 S3
  ✓ 保留 30 天快照
  ✓ 點對點恢復功能

手動匯出：
  ✓ 導出為 Excel/CSV
  ✓ 導出為 JSON
  ✓ 導出完整資料庫 SQL
```

---

## 📈 成本估計

### 月度費用（中小型團隊）：

| 服務 | 數量 | 月費 | 備註 |
|-----|------|------|------|
| Supabase | 基礎方案 | $25 | 含資料庫、儲存、API |
| Vercel | Pro 方案 | $20 | 更好的部署和效能 |
| 圖片儲存 | Vercel Blob | $5 | 或用 Cloudinary |
| **總計** | - | **$50** | 可容納 50+ 使用者 |

---

## 📚 推薦資源

```
認證：
  • NextAuth.js 文檔: https://next-auth.js.org
  • Passport.js: https://www.passportjs.org

授權：
  • CASL.js: https://casl.js.org (權限庫)
  • Zod: https://zod.dev (驗證)

資料庫：
  • Prisma ORM: https://www.prisma.io
  • Supabase: https://supabase.com

UI 元件：
  • shadcn/ui: https://ui.shadcn.com
  • Mantine: https://mantine.dev
```

---

## ⚠️ 常見陷阱（要避免）

```
❌ 在 client 端存儲敏感資料
❌ 信任客戶端傳來的角色信息
❌ 沒有驗證上傳的文件
❌ 密碼以明文存儲
❌ 沒有實現速率限制
❌ 沒有日誌審計功能
❌ 共用 API Key
❌ 沒有環境變數隔離
```

---

## 🎯 預計時程表

```
總開發時間：4-6 週
  + 第 1-2 週：認證系統
  + 第 3 週：授權系統
  + 第 4-6 週：後台管理系統
  + 第 7 週：部署和安全

測試時間：1-2 週（並行）
上線準備：1 週

**預計上線時間：7-9 週**
```

---

## ✨ 額外增值功能（可後期加入）

```
短期 (2-4 週)：
  ✓ 批量商品導入 (Excel, CSV)
  ✓ 商品版本控制和回滾
  ✓ 生成 QR Code
  ✓ 定時發佈商品

中期 (1-2 月)：
  ✓ 多語言支持 (繁體、簡體、英文)
  ✓ 價格管理和分級
  ✓ 庫存管理
  ✓ 出貨單生成

長期 (3-6 月)：
  ✓ 移動 App (React Native)
  ✓ 訂單管理系統
  ✓ 客戶管理系統 (CRM)
  ✓ 分析和報表系統
```

---

## 🤝 協作工具建議

```
團隊溝通：
  • Slack / Discord (實時通知)
  • 變更警報通知

版本控制：
  • Git (已使用)
  • 分支策略 (feature, staging, main)

文檔：
  • Notion / Wiki (API 文檔、使用指南)

監控：
  • Sentry (錯誤追蹤)
  • LogRocket (會話回放)
```

---

## 📞 需要幫助？

如果決定實裝，可以逐步實現：
1. **先實現認證** (最重要)
2. **再實現授權** (確保安全)
3. **最後實現後台** (提升效率)

每個階段都可以獨立測試和部署！
