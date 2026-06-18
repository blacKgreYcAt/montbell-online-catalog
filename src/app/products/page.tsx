'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { loadProductsBySeason } from '@/lib/products';
import { loadImageMapping } from '@/lib/imageUtils';
import { filterByCategory, filterByMainCategory, filterBySubCategory } from '@/lib/searchUtils';
import { ProductGrid, FilterPanel, CategoryNav, SearchBar, ErrorBoundary } from '@/components';
import { getMainCategoryByProductCategory } from '@/lib/categories';
import { getCategoryLabel } from '@/lib/categoryTranslations';
import type { Product, ImageMapping } from '@/types';

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || '';
  const mainCategory = searchParams.get('main') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [imageMapping, setImageMapping] = useState<ImageMapping>({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedMainCategory, setSelectedMainCategory] = useState(mainCategory);

  // 同步搜尋參數到狀態
  useEffect(() => {
    setSelectedCategory(category);
    setSelectedMainCategory(mainCategory);
  }, [category, mainCategory]);

  // 載入數據
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, imageData] = await Promise.all([
          loadProductsBySeason(),
          loadImageMapping(),
        ]);
        setProducts(productsData);
        setImageMapping(imageData);
      } catch (error) {
        console.error('載入數據失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 篩選商品 - 使用簡單的分類匹配
  const filteredProducts = useMemo(() => {
    let results = products;

    if (selectedCategory) {
      results = results.filter((p) =>
        p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    return results;
  }, [products, selectedCategory]);

  // 處理分類變更
  const handleCategoryChange = (newCategory: string) => {
    const params = new URLSearchParams(searchParams);
    if (newCategory) {
      params.set('category', newCategory);
    } else {
      params.delete('category');
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      {/* 頁面標題 */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">商品目錄</h1>
        <p className="text-lg text-gray-600">
          {selectedCategory
            ? `${getCategoryLabel(selectedCategory)} - ${filteredProducts.length} 件商品`
            : `全部商品 - ${products.length} 件`}
        </p>
      </div>

      {/* 搜尋欄 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <SearchBar placeholder="搜尋商品型號或名稱..." />
      </div>

      {/* 分類導航 */}
      {products.length > 0 && (
        <CategoryNav variant="horizontal" selectedCategory={selectedCategory} />
      )}

      {/* 主內容區 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 篩選面板 */}
        <div className="lg:col-span-1">
          <FilterPanel
            products={products}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* 商品網格 */}
        <div className="lg:col-span-3">
          <ProductGrid
            products={filteredProducts}
            imageMapping={imageMapping}
            loading={loading}
            emptyMessage={
              selectedCategory
                ? `在 ${selectedCategory} 中找不到商品`
                : '找不到任何商品'
            }
          />
        </div>
      </div>

      {/* 統計信息 */}
      {!loading && filteredProducts.length > 0 && (
        <div className="bg-[#f0f5ff] rounded-lg p-6 text-center border-2 border-[#7697B8]">
          <p className="text-gray-700">
            顯示 <span className="font-bold text-[#004c6f]">{filteredProducts.length}</span> 件商品
            {selectedCategory && (
              <>
                {' '}
                / <span className="font-bold text-[#7697B8]">{getCategoryLabel(selectedCategory)}</span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="text-center py-12">正在載入商品...</div>}>
        <ProductsPageContent />
      </Suspense>
    </ErrorBoundary>
  );
}
