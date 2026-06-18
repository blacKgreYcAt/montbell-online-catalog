const fs = require('fs');
const path = require('path');
const { searchProducts } = require('./src/lib/searchUtils');
const { validateProduct, formatProduct } = require('./src/lib/products');

// 讀取內部版產品數據
const filePath = path.join(process.cwd(), 'public', 'products-internal.json');
const fileContent = fs.readFileSync(filePath, 'utf-8');
const data = JSON.parse(fileContent);

let products = Array.isArray(data) ? data : data.products || [];

// 驗證產品
products = products
  .filter((product) => {
    const p = product;
    return (
      typeof p.id === "string" &&
      typeof p.modelNumber === "string" &&
      typeof p.name === "string" &&
      typeof p.category === "string" &&
      (p.season === "SS" || p.season === "FW")
    );
  })
  .map(p => p);

console.log('✅ 載入產品數量:', products.length);

// 測試搜尋
const testQueries = ['1101770', 'PERMAFROST', '派克'];
testQueries.forEach(query => {
  const results = searchProducts(query, products);
  console.log(`\n🔍 搜尋 "${query}"`);
  console.log('  找到:', results.total, '件');
  if (results.products.length > 0) {
    console.log('  第一件:', results.products[0].modelNumber, '-', results.products[0].name);
  }
});
