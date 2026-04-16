'use client';

import { useCallback, useMemo } from 'react';
import { Product } from '@/types';
import { getCategories } from '@/lib/searchUtils';
import { getCategoryLabel } from '@/lib/categoryTranslations';

interface FilterPanelProps {
  products: Product[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export default function FilterPanel({
  products,
  selectedCategory = '',
  onCategoryChange,
}: FilterPanelProps) {
  const categories = useMemo(() => {
    const categoryMap = getCategories(products);
    return Array.from(categoryMap.entries()).sort((a, b) =>
      b[1] - a[1] // 按數量降序排列
    );
  }, [products]);

  const handleCategoryClick = useCallback(
    (category: string) => {
      const newCategory = selectedCategory === category ? '' : category;
      onCategoryChange?.(newCategory);
    },
    [selectedCategory, onCategoryChange]
  );

  const totalProducts = products.length;

  return (
    <div className="bg-white rounded-2xl border-2 border-[#004c6f] p-6 shadow-md">
      <h2 className="text-lg font-bold text-[#004c6f] mb-4">分類篩選</h2>

      {/* 全部分類 */}
      <button
        onClick={() => handleCategoryClick('')}
        className={`w-full text-left px-4 py-3 rounded-lg mb-2 font-semibold transition-colors active:opacity-75 min-h-[44px] flex items-center ${
          selectedCategory === ''
            ? 'bg-[#004c6f] text-white'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        <div className="flex justify-between items-center">
          <span>全部分類</span>
          <span className="text-sm opacity-75">({totalProducts})</span>
        </div>
      </button>

      {/* 分類列表 */}
      <div className="space-y-1">
        {categories.map(([category, count]) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors active:opacity-75 min-h-[44px] flex items-center ${
              selectedCategory === category
                ? 'bg-[#7697B8] text-white'
                : 'bg-gray-50 text-gray-900 hover:bg-[#f0f5ff] border border-[#e0e8f0]'
            }`}
          >
            <div className="flex justify-between items-center w-full">
              <span className="font-medium text-sm">{getCategoryLabel(category)}</span>
              <span className={`text-sm ${
                selectedCategory === category
                  ? 'opacity-75'
                  : 'text-gray-500'
              }`}>
                ({count})
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* 沒有分類提示 */}
      {categories.length === 0 && (
        <p className="text-center text-gray-500 py-4">無可用分類</p>
      )}

      {/* 重置按鈕 */}
      {selectedCategory && (
        <button
          onClick={() => handleCategoryClick('')}
          className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
        >
          重置篩選
        </button>
      )}
    </div>
  );
}
