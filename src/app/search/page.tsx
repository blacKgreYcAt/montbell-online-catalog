'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { loadImageMapping } from '@/lib/imageUtils';
import { ProductGrid, SearchBar } from '@/components';
import type { Product, ImageMapping, SearchResult } from '@/types';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<SearchResult | null>(null);
  const [imageMapping, setImageMapping] = useState<ImageMapping>({});
  const [loading, setLoading] = useState(!!query);
  const [error, setError] = useState<string | null>(null);

  // 執行搜尋
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setLoading(false);
      return;
    }

    const performSearch = async () => {
      try {
        setLoading(true);
        setError(null);

        // 調用搜尋 API
        const response = await fetch(
          `/api/search?${new URLSearchParams({ q: query })}`
        );

        if (!response.ok) {
          throw new Error('搜尋失敗');
        }

        const data = await response.json();
        if (data.success) {
          setResults(data.data);
        } else {
          setError(data.error || '搜尋失敗');
        }
      } catch (err) {
        console.error('搜尋錯誤:', err);
        setError('搜尋時發生錯誤，請稍後重試');
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  // 載入圖片映射
  useEffect(() => {
    const loadData = async () => {
      try {
        const imageData = await loadImageMapping();
        setImageMapping(imageData);
      } catch (error) {
        console.error('載入圖片映射失敗:', error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* 頁面標題 */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">搜尋結果</h1>
        {query && (
          <p className="text-lg text-gray-600">
            關鍵字：<span className="font-semibold text-[#004c6f]">"{query}"</span>
          </p>
        )}
      </div>

      {/* 搜尋欄 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <SearchBar
          initialValue={query}
          placeholder="搜尋商品型號或名稱..."
        />
      </div>

      {/* 搜尋結果 */}
      {!query ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            👆 請在上方搜尋欄輸入關鍵字開始搜尋
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 font-semibold">❌ {error}</p>
        </div>
      ) : loading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004c6f]" />
          </div>
          <p className="text-gray-600 mt-4">正在搜尋...</p>
        </div>
      ) : results ? (
        <>
          {/* 搜尋統計 */}
          <div className="bg-[#f0f5ff] rounded-lg p-6 border-2 border-[#7697B8]">
            <p className="text-center text-gray-700">
              找到 <span className="font-bold text-[#004c6f]">{results.total}</span> 件相符的商品
            </p>
          </div>

          {/* 搜尋結果 */}
          {results.products.length > 0 ? (
            <ProductGrid
              products={results.products}
              imageMapping={imageMapping}
              emptyMessage="找不到相符的商品"
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                😔 找不到符合「{query}」的商品
              </p>
              <p className="text-gray-500 mt-2">
                試試其他搜尋關鍵字
              </p>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">正在載入搜尋頁面...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
