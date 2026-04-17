'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { loadProductsBySeason } from '@/lib/products';
import { loadImageMapping } from '@/lib/imageUtils';
import { filterByCategory, filterByMainCategory, filterBySubCategory } from '@/lib/searchUtils';
import { ProductGrid, FilterPanel, CategoryNav, SearchBar, SeasonIndicator } from '@/components';
import { getMainCategoryByProductCategory } from '@/lib/categories';
import type { Product, ImageMapping } from '@/types';

function ProductsPageContent() {
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

  // 篩選商品
  const filteredProducts = useMemo(() => {
    let results = products;

    // 按主分類篩選
    if (selectedMainCategory) {
      results = filterByMainCategory(results, selectedMainCategory);
    }
    // 按子分類篩選
    else if (selectedCategory) {
      results = filterBySubCategory(results, selectedCategory);
    }

    return results;
  }, [products, selectedCategory, selectedMainCategory]);

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
