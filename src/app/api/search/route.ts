import { NextRequest, NextResponse } from 'next/server';
import { searchProducts, filterByCategory } from '@/lib/searchUtils';
import { ApiResponse } from '@/types';
import { Product } from '@/types';
import { validateProduct, formatProduct } from '@/lib/products';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * 搜尋 API 路由
 * GET /api/search?q=query&category=category
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';

    // 直接讀取 public/products.json 文件
    let products: Product[] = [];
    try {
      const filePath = join(process.cwd(), 'public', 'products.json');
      const fileContent = readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileContent);
      let rawProducts = Array.isArray(data) ? data : data.products || [];

      // 驗證和過濾無效的商品數據
      products = rawProducts
        .filter((product: unknown) => {
          const valid = validateProduct(product);
          if (!valid) {
            console.warn('搜尋 API：無效的商品數據，跳過:', product);
          }
          return valid;
        })
        .map(formatProduct);

      console.log(`搜尋 API：成功載入 ${products.length} 件有效商品`);
    } catch (error) {
      console.error('讀取商品數據失敗:', error);
    }

    if (!products || products.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: '無法載入商品數據',
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    // 執行搜尋
    let results = searchProducts(query, products);

    // 按分類篩選
    if (category) {
      results.products = filterByCategory(results.products, category);
      results.total = results.products.length;
    }

    return NextResponse.json<ApiResponse<typeof results>>(
      {
        success: true,
        data: results,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('搜尋 API 錯誤:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: '搜尋失敗，請稍後重試',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
