# Montbell 商品圖片自動抓取方案

**日期：** 2026-04-16  
**版本：** v1.0  
**狀態：** 設計階段

---

## 📋 目錄

1. [方案概述](#方案概述)
2. [技術方案](#技術方案)
3. [圖片 URL 模式](#圖片-url-模式)
4. [自動抓取腳本](#自動抓取腳本)
5. [網站配置](#網站配置)
6. [常見問題](#常見問題)

---

## 方案概述

### 目標
- ✅ 自動從日本 Montbell 官網抓取商品圖片 URL
- ✅ 支援多種 URL 格式和模式
- ✅ 自動生成型號-顏色的圖片對應關係
- ✅ 減少手動工作，提高效率
- ❌ 無需上傳圖片到 Google Drive

### 核心想法
```
產品資料 (型號 + 顏色代碼)
     ↓
圖片 URL 生成規則
     ↓
自動生成圖片 URL
     ↓
網站直接外連顯示
```

### 優點
```
✓ 省略 Google Drive 同步步驟
✓ 圖片始終保持最新（官網更新時自動更新）
✓ 不占用本地存儲空間
✓ 自動化程度高，無需手動處理
✓ 減少重複的圖片副本
```

### 缺點
```
✗ 需要穩定的網絡連接
✗ 官網圖片 URL 如果變動會造成失效
✗ 依賴官網的可用性
✗ 可能面臨 CORS 跨域限制
```

---

## 技術方案

### 方案 A：直接外連 (推薦)

**優點：** 簡單快速，無需維護  
**缺點：** 依賴官網 URL 穩定性

```
步驟：
1. 分析官網 URL 規律
2. 根據型號+顏色生成 URL
3. 在網站中直接使用 <img src="官網URL">
```

### 方案 B：代理服務器

**優點：** 解決 CORS 問題，可快取  
**缺點：** 需要額外服務器成本

```
步驟：
1. 建立代理伺服器
2. 攔截並快取官網圖片
3. 通過代理 URL 返回
```

### 方案 C：定期爬蟲同步

**優點：** 備份圖片，穩定可靠  
**缺點：** 需要存儲空間，維護成本高

```
步驟：
1. 定期爬蟲抓取圖片 URL
2. 下載到本地 / Google Drive
3. 更新圖片映射表
```

---

## 圖片 URL 模式

### 日本官網常見模式

#### 模式 1：基於型號和顏色的 CDN URL
```
https://image.montbell.com/product/{modelNumber}_{colorCode}.jpg
https://image.montbell.com/product/{modelNumber}_{colorCode}_small.jpg
https://image.montbell.com/product/{modelNumber}_{colorCode}_thumb.jpg
```

**範例：**
```
型號：1128573, 顏色：RBL
URL: https://image.montbell.com/product/1128573_RBL.jpg
```

#### 模式 2：品項 ID 方式
```
https://image.montbell.com/item/{itemId}/{colorCode}.jpg
```

#### 模式 3：檔案系統路徑方式
```
https://www.montbell.com/modules/gcart/image/item/{itemId}/{fileName}.jpg
```

### 需要確認的資訊

為了準確設計自動化腳本，需要：

```
[ ] 一個真實的商品圖片 URL 範例
[ ] 官網上是否有 API 提供圖片 URL
[ ] 型號在 URL 中的格式 (7 位？縮寫？)
[ ] 顏色代碼是否直接使用 (BK, RD, NV)?
[ ] 是否需要 URL 編碼或轉換
[ ] 單色/多色商品的圖片 URL 差異
```

---

## 自動抓取腳本

### 腳本 1：Python 爬蟲 (數據收集)

```python
# scrape_montbell_images.py
import requests
from openpyxl import load_workbook
import json
import time

class MonbellImageScraper:
    def __init__(self):
        self.session = requests.Session()
        self.base_url = "https://image.montbell.com"
        self.image_mapping = {}
    
    def generate_image_url(self, model_number, color_code):
        """根據型號和顏色生成圖片 URL"""
        # 這個方法需要根據實際官網規律調整
        return f"{self.base_url}/product/{model_number}_{color_code}.jpg"
    
    def verify_url(self, url):
        """驗證 URL 是否有效 (檢查 HTTP 頭)"""
        try:
            response = self.session.head(url, timeout=5)
            return response.status_code == 200
        except:
            return False
    
    def scrape_from_excel(self, excel_path):
        """從 Excel 讀取商品資料並抓取圖片 URL"""
        wb = load_workbook(excel_path)
        ws = wb['公司選品連結用資料']
        
        success_count = 0
        fail_count = 0
        
        for row_idx, row in enumerate(ws.iter_rows(min_row=2, values_only=True), start=2):
            try:
                model_number = str(int(row[2])).zfill(7)
                colors_raw = row[4]
                
                if not colors_raw:
                    continue
                
                colors = str(colors_raw).split()
                
                for color in colors:
                    color = color.strip()
                    if not color:
                        continue
                    
                    # 生成 URL
                    url = self.generate_image_url(model_number, color)
                    
                    # 驗證 URL
                    if self.verify_url(url):
                        key = f"{model_number}_{color}"
                        self.image_mapping[key] = url
                        success_count += 1
                        print(f"✓ {key}: {url}")
                    else:
                        fail_count += 1
                        print(f"✗ {key}: URL 不存在")
                    
                    # 禮貌延遲，避免被封 IP
                    time.sleep(0.5)
            
            except Exception as e:
                print(f"行 {row_idx} 錯誤: {e}")
        
        print(f"\n成功: {success_count}, 失敗: {fail_count}")
        return self.image_mapping
    
    def save_mapping(self, output_file):
        """保存圖片映射表為 JSON"""
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.image_mapping, f, ensure_ascii=False, indent=2)
        print(f"已保存至: {output_file}")

# 使用方式
if __name__ == "__main__":
    scraper = MonbellImageScraper()
    mapping = scraper.scrape_from_excel("products_data.xlsx")
    scraper.save_mapping("image_mapping.json")
```

### 腳本 2：Node.js 圖片 URL 生成

```javascript
// image-url-generator.js
class MonbellImageGenerator {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || 'https://image.montbell.com';
    this.pattern = options.pattern || 'product/{model}_{color}.jpg';
  }

  /**
   * 根據型號和顏色生成圖片 URL
   * @param {string} modelNumber - 7 位型號
   * @param {string} colorCode - 顏色代碼
   * @returns {string} 圖片 URL
   */
  generateUrl(modelNumber, colorCode) {
    let url = this.pattern
      .replace('{model}', modelNumber)
      .replace('{color}', colorCode.toUpperCase());
    
    return `${this.baseUrl}/${url}`;
  }

  /**
   * 批量生成 URL
   * @param {Array} products - 商品陣列
   * @returns {Object} URL 映射表
   */
  generateBatch(products) {
    const mapping = {};
    
    products.forEach(product => {
      if (!product.colors || product.colors.length === 0) return;
      
      product.colors.forEach(color => {
        const key = `${product.modelNumber}_${color}`;
        mapping[key] = this.generateUrl(product.modelNumber, color);
      });
    });
    
    return mapping;
  }
}

// 使用方式
const generator = new MonbellImageGenerator({
  baseUrl: 'https://image.montbell.com',
  pattern: 'product/{model}_{color}.jpg'
});

const products = [
  { modelNumber: '1128573', colors: ['RBL', 'BK'] },
  { modelNumber: '1128842', colors: ['BK', 'NV'] }
];

const urlMapping = generator.generateBatch(products);
console.log(urlMapping);
```

---

## 網站配置

### 更新步驟

#### 1. 修改 ImageUtils

```typescript
// src/lib/imageUtils.ts

interface ImageUrlConfig {
  baseUrl: string;
  pattern: string; // '{model}_{color}.jpg'
  sizes?: {
    small: string;
    medium: string;
    large: string;
  };
}

export function getMonbellImageUrl(
  modelNumber: string,
  colorCode: string,
  config: ImageUrlConfig = {
    baseUrl: 'https://image.montbell.com/product',
    pattern: '{model}_{color}.jpg'
  }
): string {
  const url = config.pattern
    .replace('{model}', modelNumber)
    .replace('{color}', colorCode.toUpperCase());
  
  return `${config.baseUrl}/${url}`;
}
```

#### 2. 修改 ProductCard 組件

```typescript
// src/components/ProductCard.tsx

const imageUrl = getMonbellImageUrl(
  product.modelNumber,
  product.colors?.[0] || 'BK'
);

// 添加備用圖片
<img
  src={imageUrl}
  alt={product.name}
  onError={(e) => {
    (e.target as HTMLImageElement).src = '/placeholder.jpg';
  }}
  className="w-full h-full object-cover"
/>
```

#### 3. 創建圖片 URL 映射表

```json
// public/image-urls.json
{
  "1128573_RBL": "https://image.montbell.com/product/1128573_RBL.jpg",
  "1128573_BK": "https://image.montbell.com/product/1128573_BK.jpg",
  "1128842_BK": "https://image.montbell.com/product/1128842_BK.jpg",
  ...
}
```

#### 4. 添加 CORS 代理配置 (如需要)

```typescript
// next.config.ts

export default {
  async headers() {
    return [
      {
        source: '/api/proxy-image',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};
```

---

## 常見問題

### Q1: 官網圖片 URL 會不會經常變動？

**A:** 
- Montbell 官網 URL 相對穩定
- 但無法保證永久不變
- 建議：定期檢查圖片是否有效 (404)
- 解決方案：建立監控告警系統

### Q2: 如果官網禁止外連怎麼辦？

**A:**
- 檢查官網的 robots.txt 和使用條款
- 如果禁止外連，改用方案 C（爬蟲同步）
- 添加正確的 User-Agent 和 Referrer 頭

### Q3: CORS 跨域問題怎麼解決？

**A:**
方案 1 - 添加代理層
```
網站 → 代理服務器 → Montbell 官網
```

方案 2 - 伺服器端獲取
```
Next.js API Route → 官網 → 返回圖片
```

### Q4: 如何驗證圖片 URL 是否有效？

**A:**
```typescript
export async function verifyImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.status === 200;
  } catch {
    return false;
  }
}
```

### Q5: 可以同時支援官網外連和本地備份嗎？

**A:** 當然可以！
```typescript
// 優先使用官網圖片，官網不可用時使用本地備份
const imageUrl = isUrlAccessible(officialUrl) 
  ? officialUrl 
  : `/images/products/${modelNumber}_${color}.jpg`;
```

---

## 實施時程

### 第 1 步：確認圖片 URL 模式
```
需要您提供一個真實商品的圖片 URL 範例
```

### 第 2 步：開發 URL 生成邏輯
```
預計時間：2-4 小時
```

### 第 3 步：創建圖片映射表
```
預計時間：1-2 小時
```

### 第 4 步：集成到網站
```
預計時間：1-2 小時
```

### 第 5 步：測試和驗證
```
預計時間：1-2 小時
```

**總預計時間：1 天**

---

## 下一步

請提供以下信息以便我們繼續：

```
1. 日本 Montbell 官網商品圖片的完整 URL 範例
   
   範例格式：
   - 官網地址：https://www.montbell.com/...
   - 型號 1128573, 顏色 RBL 的圖片 URL：??
   - 型號 1128842, 顏色 BK 的圖片 URL：??

2. 型號在 URL 中是否需要轉換
   - 是否需要添加前導零？
   - 是否有縮寫規則？

3. 顏色代碼是否直接使用
   - BK → BK 或 bk 或其他格式？
   - 是否有別名對應？

4. 官網是否有 API 或資源清單
   - 是否有 sitemap 或 API 文檔？
```

準備好這些信息後，我可以立即開始實施！

---

**文檔版本：** v1.0  
**最後更新：** 2026-04-16
