'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { loadProductsBySeason } from '@/lib/products';
import { loadImageMapping } from '@/lib/imageUtils';
import { filterByCategory } from '@/lib/searchUtils';
import { ProductGrid, FilterPanel, CategoryNav, SearchBar, SeasonIndicator } from '@/components';
import type { Product, ImageMapping } from '@/types';

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [imageMapping, setImageMapping] = useState<ImageMapping>({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(category);

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

  // 篩選商品
  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;
    return filterByCategory(products, selectedCategory);
  }, [products, selectedCategory]);

  // 處理分類變更
  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
  };

  return (
    <div className="space-y-8">
      {/* 季節指示器 */}
      <SeasonIndicator />

      {/* 頁面標題 */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">商品目錄</h1>
        <p className="text-lg text-gray-600">
          {selectedCategory
            ? `${selectedCategory} - ${filteredProducts.length} 件商品`
            : `全部商品 - ${products.length} 件`}
        </p>
      </div>

      {/* 搜尋欄 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <SearchBar placeholder="搜尋商品型號或名稱..." />
      </div>

      {/* 分類導航 */}
      {products.length > 0 && (
        <CategoryNav products={products} currentCategory={selectedCategory} />
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
                / <span className="font-bold text-[#7697B8]">{selectedCategory}</span>
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
    <Suspense fallback={<div className="text-center py-12">正在載入商品...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
