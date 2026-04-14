import { NextRequest, NextResponse } from 'next/server';
import { loadProducts } from '@/lib/products';
import { searchProducts, filterByCategory } from '@/lib/searchUtils';
import { ApiResponse } from '@/types';

/**
 * 搜尋 API 路由
 * GET /api/search?q=query&category=category
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';

    // 載入商品數據
    const products = await loadProducts();

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
