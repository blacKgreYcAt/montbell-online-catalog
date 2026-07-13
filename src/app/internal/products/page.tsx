'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isInternalAuthValid } from '@/lib/internalAuth';
import { loadInternalProducts } from '@/lib/products';
import { loadInternalImageMapping } from '@/lib/imageUtils';
import { ProductGrid, CategoryNav, SearchBar, ErrorBoundary } from '@/components';
import { getMainCategoryByProductCategory } from '@/lib/categories';
import { getCategoryLabel } from '@/lib/categoryTranslations';
import { useSearchParams } from 'next/navigation';
import type { Product, ImageMapping } from '@/types';
import { filterByCategory, filterByMainCategory, filterBySubCategory } from '@/lib/searchUtils';

function InternalProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get('category') || '';
  const mainCategory = searchParams.get('main') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [imageMapping, setImageMapping] = useState<ImageMapping>({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedMainCategory, setSelectedMainCategory] = useState(mainCategory);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // 驗證認證
  useEffect(() => {
    if (!isInternalAuthValid()) {
      router.push('/internal/auth');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

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
          loadInternalProducts(),
          loadInternalImageMapping(),
        ]);
        setProducts(productsData);
        setImageMapping(imageData);
      } catch (error) {
        console.error('載入數據失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized) {
      loadData();
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004c6f] mx-auto mb-4" />
          <p className="text-gray-600">驗證中...</p>
        </div>
      </div>
    );
  }

  // 篩選商品
  const filteredProducts = (() => {
    let results = products;

    // FW27新品：顯示所有商品（不篩選）
    if (selectedMainCategory === 'fw27-new') {
      return products;
    }

    if (selectedMainCategory) {
      results = filterByMainCategory(results, selectedMainCategory);
    } else if (selectedCategory) {
      results = filterBySubCategory(results, selectedCategory);
    }

    return results;
  })();

  // 處理分類變更
  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
  };

  return (
    <div className="space-y-8">
      {/* 內部版標示 */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
        <p className="text-amber-800 font-semibold flex items-center gap-2">
          🔒 內部版 - FW27 新品展示
        </p>
      </div>

      {/* 頁面標題 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">FW27 內部版商品</h1>
          <p className="text-lg text-gray-600">
            {selectedCategory
              ? `${getCategoryLabel(selectedCategory)} - ${filteredProducts.length} 件商品`
              : `全部商品 - ${products.length} 件`}
          </p>
        </div>
        <Link
          href="/internal/shopping-list"
          className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors whitespace-nowrap"
        >
          📋 查看清單
        </Link>
      </div>

      {/* 搜尋欄 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <SearchBar
          placeholder="搜尋商品型號或名稱..."
          basePath="/internal/search"
          onSearch={(newQuery) => {
            const params = new URLSearchParams({ q: newQuery });
            router.push(`/internal/search?${params.toString()}`);
          }}
        />
      </div>

      {/* 分類導航 */}
      {products.length > 0 && (
        <CategoryNav variant="horizontal" selectedCategory={selectedMainCategory || selectedCategory} basePath="/internal/products" isInternal={true} />
      )}

      {/* 主內容區 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 分類側欄 */}
        <div className="lg:col-span-1">
          <CategoryNav variant="sidebar" selectedCategory={selectedMainCategory || selectedCategory} basePath="/internal/products" isInternal={true} />
        </div>

        {/* 商品網格 */}
        <div className="lg:col-span-3">
          <ProductGrid
            products={filteredProducts}
            imageMapping={imageMapping}
            loading={loading}
            hidePrice={false}
            basePath="/internal/products"
            useGoogleDrive={true}
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

export default function InternalProductsPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="text-center py-12">正在載入商品...</div>}>
        <InternalProductsContent />
      </Suspense>
    </ErrorBoundary>
  );
}
