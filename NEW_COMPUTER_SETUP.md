# 🖥️ 新電腦快速開始指南

**在新電腦上恢復 Montbell Online Catalog 開發環境**

---

## 📋 快速清單

在新電腦上繼續開發需要的 7 個步驟：

```
□ Step 1: 安裝 Node.js 和 npm
□ Step 2: 安裝並配置 Git
□ Step 3: 安裝 Claude Code
□ Step 4: 配置 Claude Code 設置
□ Step 5: 克隆項目倉庫
□ Step 6: 安裝依賴和環境變數
□ Step 7: 啟動開發環境
```

---

## Step 1: 安裝基礎工具

### Node.js 和 npm（必需）

#### Windows
```bash
# 方法 1: 下載官方安裝器（推薦）
# 訪問: https://nodejs.org/
# 選擇 LTS 版本 (18.x 或更新)
# 運行安裝器，選擇默認選項

# 方法 2: 使用 Chocolatey（已有 Choco）
choco install nodejs -y

# 驗證安裝
node --version   # 應顯示 v18.x 或更新
npm --version    # 應顯示 9.x 或更新
```

#### macOS
```bash
# 使用 Homebrew（推薦）
brew install node

# 或訪問 https://nodejs.org/ 下載安裝器
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install nodejs npm

# 或使用 nvm (Node Version Manager)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install nodejs
```

### Git（必需）

#### Windows
```bash
# 方法 1: 下載官方安裝器
# 訪問: https://git-scm.com/download/win
# 運行安裝器，選擇默認選項

# 方法 2: 使用 Chocolatey
choco install git -y

# 驗證
git --version
```

#### macOS
```bash
# 使用 Homebrew
brew install git

# 或使用 Xcode Command Line Tools
xcode-select --install
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get install git

# 或使用 dnf (Fedora)
sudo dnf install git
```

---

## Step 2: 配置 Git

### 全局配置

```bash
# 設置用戶名和郵箱（必需）
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 示例:
git config --global user.name "Claude Developer"
git config --global user.email "claude@anthropic.com"

# 配置默認編輯器（可選）
# Windows
git config --global core.editor "code"

# macOS/Linux
git config --global core.editor "nano"

# 驗證配置
git config --list
```

### SSH 密鑰設置（推薦用於 GitHub）

```bash
# 1. 生成 SSH 密鑰
ssh-keygen -t ed25519 -C "your.email@example.com"

# 按 Enter 接受默認位置
# 為密鑰設置密碼（可選）

# 2. 啟動 SSH Agent（Windows Git Bash 或 macOS/Linux）
eval "$(ssh-agent -s)"

# 3. 添加私鑰
ssh-add ~/.ssh/id_ed25519

# 4. 複製公鑰
cat ~/.ssh/id_ed25519.pub
# 複製輸出內容

# 5. 在 GitHub 添加公鑰
# 訪問: https://github.com/settings/keys
# 點擊 "New SSH key"
# 粘貼公鑰內容並保存

# 6. 驗證連接
ssh -T git@github.com
# 應顯示: "Hi blacKgreYcAt! You've successfully authenticated..."
```

### HTTPS 推薦配置

如果使用 HTTPS（更簡單）：

```bash
# 緩存 GitHub 認證 15 分鐘
git config --global credential.helper cache

# Windows (永久緩存)
git config --global credential.helper wincred

# macOS (使用鑰匙鏈)
git config --global credential.helper osxkeychain
```

---

## Step 3: 安裝 Claude Code

### Windows

```bash
# 方法 1: 使用 Chocolatey
choco install claude-code -y

# 方法 2: 下載官方安裝器
# 訪問: https://code.anthropic.com/
# 下載 Windows 版本
# 運行安裝器

# 驗證安裝
claude --version
```

### macOS

```bash
# 使用 Homebrew
brew install anthropic/claude/claude-code

# 或訪問 https://code.anthropic.com/ 下載 DMG 文件

# 驗證安裝
claude --version
```

### Linux

```bash
# 使用包管理器（如果支持）
# 或訪問 https://code.anthropic.com/ 下載 AppImage

# 驗證安裝
claude --version
```

---

## Step 4: 配置 Claude Code

### 初始化設置

```bash
# 首次啟動會提示登錄
claude

# 按照提示：
# 1. 訪問 https://claude.ai/code 登錄
# 2. 複製提供的認證 code
# 3. 粘貼到 Claude Code 終端
# 4. 完成認證

# 驗證登錄
claude auth status
```

### 項目設置（可選但推薦）

在項目根目錄創建 `.claude` 文件夾配置：

```bash
# 進入項目目錄
cd montbell-online-catalog

# 創建配置目錄
mkdir -p .claude

# 創建 launch.json (dev server 配置)
cat > .claude/launch.json << 'EOF'
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "Montbell Dev Server",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 3000
    }
  ]
}
EOF
```

---

## Step 5: 克隆項目倉庫

### 使用 SSH（推薦）

```bash
# 克隆倉庫
git clone git@github.com:blacKgreYcAt/montbell-online-catalog.git

# 進入項目目錄
cd montbell-online-catalog

# 驗證克隆成功
git status
# 應顯示: "On branch main, Your branch is up to date..."
```

### 使用 HTTPS（如果 SSH 未配置）

```bash
# 克隆倉庫
git clone https://github.com/blacKgreYcAt/montbell-online-catalog.git

# 進入項目目錄
cd montbell-online-catalog

# 首次推送時會提示輸入 GitHub 用戶名和 Personal Access Token
```

### 驗證倉庫

```bash
# 檢查遠程倉庫
git remote -v
# 應顯示:
# origin  git@github.com:blacKgreYcAt/montbell-online-catalog.git (fetch)
# origin  git@github.com:blacKgreYcAt/montbell-online-catalog.git (push)

# 查看提交歷史
git log --oneline -5
# 應顯示最近 5 個提交

# 查看當前分支
git branch
# 應顯示 "* main"
```

---

## Step 6: 安裝依賴和環境變數

### 安裝 npm 依賴

```bash
# 安裝所有依賴（必需）
npm install

# 驗證安裝
npm list --depth=0
# 應顯示:
# montbell-online-catalog@0.5.0
# ├── axios@1.7.0
# ├── cloudinary@2.10.0
# ├── dotenv@16.4.5
# ├── fuse.js@7.0.0
# ├── googleapis@140.0.0
# ├── next@16.2.3
# ├── react@19.2.4
# └── react-dom@19.2.4
```

### 配置環境變數

#### 創建 .env.local 文件

```bash
# 複製示例文件
cp .env.example .env.local

# 編輯 .env.local
# 使用您喜歡的編輯器
code .env.local  # VSCode
nano .env.local  # nano
```

#### .env.local 必需變數

```env
# ⚠️ 這些變數不要提交到 Git！

# Google Drive API (圖片存儲)
# 從之前的配置中複製
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here
NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY=your_api_key_here

# Montbell CDN (可選)
NEXT_PUBLIC_MONTBELL_CDN_URL=https://www.montbell.com/storage/products/images/origin
NEXT_PUBLIC_MONTBELL_URL_PATTERN={model}_{color}.webp
NEXT_PUBLIC_MONTBELL_CDN_ENABLED=true

# Cron Job 驗證 (可選)
CRON_SECRET=your_secret_here
```

#### 獲取 Google Drive API 密鑰

如果需要重新配置 Google Drive:

```bash
# 1. 訪問 Google Cloud Console
# https://console.cloud.google.com/

# 2. 創建新項目或選擇現有項目
# 3. 啟用 Google Drive API
# 4. 創建 OAuth 2.0 認證
# 5. 複製 API Key 和 Folder ID

# 6. 粘貼到 .env.local
GOOGLE_DRIVE_FOLDER_ID=your_folder_id
NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY=your_api_key
```

### 驗證環境配置

```bash
# 檢查 .env.local 是否被忽略
cat .gitignore | grep env.local
# 應顯示: ".env.local"

# 驗證環境變數已加載
npm run dev
# 如果沒有錯誤信息，說明配置正確
```

---

## Step 7: 啟動開發環境

### 啟動開發服務器

```bash
# 啟動開發服務器
npm run dev

# 應顯示:
# ▲ Next.js 16.2.3
# - Local:        http://localhost:3000
# - Environments: .env.local
# 
# ✓ Ready in 2.5s
```

### 訪問應用

打開瀏覽器訪問：
- **首頁**: http://localhost:3000
- **公開版商品**: http://localhost:3000/products
- **內部版認證**: http://localhost:3000/internal/auth

### 常用開發命令

```bash
# 開發服務器 (HMR - 熱重載)
npm run dev

# 構建生產版本
npm run build

# 運行生產版本
npm start

# 代碼檢查
npm run lint

# 圖片同步 (如需要)
npm run sync-images
```

---

## 額外配置（推薦）

### IDE 配置（VSCode）

#### 安裝推薦的擴展

```json
// .vscode/extensions.json (項目根目錄)
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "firsttimersonly.first-timers-only"
  ]
}
```

#### 創建 VSCode 工作區設置

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

### Git 工作流配置

#### 創建 Git 別名（可選但有用）

```bash
# 設置常用命令的別名
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual 'log --oneline --graph --all'
```

使用別名：
```bash
git st        # 代替 git status
git co main   # 代替 git checkout main
git ci -m "message"  # 代替 git commit -m
```

---

## 常見問題排查

### 問題 1: npm 安裝失敗

```bash
# 清除 npm 緩存
npm cache clean --force

# 重新安裝
npm install

# 如果仍然失敗，使用 npm ci
npm ci
```

### 問題 2: 開發服務器無法啟動

```bash
# 檢查 3000 端口是否被佔用
# Windows
netstat -ano | findstr :3000

# macOS/Linux
lsof -i :3000

# 如果被佔用，終止進程或使用不同端口
npm run dev -- -p 3001
```

### 問題 3: Git 克隆失敗

```bash
# 檢查 SSH 連接
ssh -T git@github.com

# 如果失敗，使用 HTTPS 代替
git clone https://github.com/blacKgreYcAt/montbell-online-catalog.git

# 或檢查網絡連接
ping github.com
```

### 問題 4: 環境變數未加載

```bash
# 確保 .env.local 在項目根目錄
ls -la | grep env.local

# 重啟開發服務器
# Ctrl+C 停止
# npm run dev 重啟
```

### 問題 5: TypeScript 錯誤

```bash
# 重新生成 TypeScript 類型
npx tsc --noEmit

# 或重啟 IDE
```

---

## 重要文件位置

### 需要從舊電腦複製的文件

如果舊電腦還有：

```
□ .env.local                 # 環境變數（最重要！）
□ .claude/settings.local.json # Claude Code 設置
□ public/products-internal.json # 內部商品列表（如有更新）
□ 其他自定義配置文件
```

### 通過 Git 管理的文件（無需複製）

這些文件已在 GitHub 上：

```
✓ src/                       # 所有源代碼
✓ public/products.json       # 公開商品列表
✓ package.json               # 依賴配置
✓ next.config.ts             # Next.js 配置
✓ PROJECT_DOCUMENTATION.md   # 項目文檔
✓ 所有提交的文件
```

---

## 完整步驟檢查清單

### 新電腦設置完成後驗證

```bash
# 1. 驗證 Node.js 和 npm
node --version      # 應 >= 18.0.0
npm --version       # 應 >= 9.0.0

# 2. 驗證 Git
git --version       # 應 >= 2.0.0
git config user.name  # 應顯示已配置的用戶名

# 3. 驗證 Claude Code
claude --version    # 應顯示版本號

# 4. 驗證項目克隆
cd montbell-online-catalog
git status          # 應 on branch main

# 5. 驗證依賴安裝
npm list --depth=0  # 應列出所有依賴

# 6. 驗證環境變數
cat .env.local      # 應顯示配置值（不是空的）

# 7. 驗證開發服務器
npm run dev         # 應在 http://localhost:3000 啟動
# 按 Ctrl+C 停止

# 8. 驗證 Git SSH（可選）
ssh -T git@github.com  # 應顯示認證成功信息
```

---

## 快速恢復指令集

在新電腦上快速復原整個環境（假設已安裝 Node.js 和 Git）：

```bash
# 1. 配置 Git（如果是新電腦）
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# 2. 克隆項目
git clone git@github.com:blacKgreYcAt/montbell-online-catalog.git
cd montbell-online-catalog

# 3. 安裝依賴
npm install

# 4. 配置環境變數
cp .env.example .env.local
# 編輯 .env.local，添加 API keys

# 5. 啟動開發
npm run dev

# 完成！應在 http://localhost:3000 看到應用
```

---

## 保持同步

### 定期更新項目

```bash
# 拉取最新改動
git pull origin main

# 安裝新的依賴（如有）
npm install

# 重啟開發服務器
npm run dev
```

### 提交更改

```bash
# 查看變更
git status

# 添加文件
git add .

# 提交更改
git commit -m "描述你的改動"

# 推送到 GitHub
git push origin main
```

---

## 需要額外幫助？

### 快速查詢

```bash
# 查看項目文檔
cat PROJECT_DOCUMENTATION.md

# 查看開發歷程
ls -la WORK_SESSION_*.md

# 查看最近提交
git log --oneline -10

# 查看所有分支
git branch -a

# 查看遠程信息
git remote -v
```

### 常用 GitHub 操作

```bash
# 拉取最新代碼
git fetch origin
git pull origin main

# 創建新分支（可選）
git checkout -b feature/your-feature

# 查看分支差異
git diff main..your-branch

# 合併分支
git checkout main
git merge your-branch

# 刪除分支
git branch -d your-branch
```

---

## 最後提醒

✅ **務必保存 .env.local**  
- 包含 Google Drive API keys
- 不要提交到 Git
- 在新電腦上需要重新配置

✅ **定期備份**  
- GitHub 是主要備份
- 重要的 .env.local 可以存儲在安全位置

✅ **保持依賴更新**  
```bash
npm update      # 更新依賴
npm audit fix   # 修復安全問題
```

✅ **遵循 Git 工作流**  
```bash
git pull        # 開始開發前
git add .       # 準備提交
git commit      # 提交更改
git push        # 推送到 GitHub
```

---

**文檔版本**: 1.0  
**最後更新**: 2026-07-09  
**適用環境**: Windows / macOS / Linux

