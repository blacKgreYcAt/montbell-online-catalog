'use client';

import Link from 'next/link';
import { Product } from '@/types';
import { getCategories } from '@/lib/searchUtils';
import { useMemo } from 'react';

interface CategoryNavProps {
  products: Product[];
  currentCategory?: string;
}

export default function CategoryNav({
  products,
  currentCategory,
}: CategoryNavProps) {
  const categories = useMemo(() => {
    const categoryMap = getCategories(products);
    return Array.from(categoryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6); // 只顯示前 6 個分類
  }, [products]);

  return (
    <nav className="bg-white border-b-2 border-[#004c6f] overflow-x-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 py-3 whitespace-nowrap">
          {/* 全部 */}
          <Link
            href="/products"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !currentCategory
                ? 'bg-[#7697B8] text-white'
                : 'text-[#004c6f] hover:bg-gray-100'
            }`}
          >
            全部
          </Link>

          {/* 分類鏈接 */}
          {categories.map(([category, count]) => (
            <Link
              key={category}
              href={`/products?category=${encodeURIComponent(category)}`}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                currentCategory === category
                  ? 'bg-[#7697B8] text-white'
                  : 'text-[#004c6f] hover:bg-gray-50'
              }`}
            >
              {category} <span className="text-xs opacity-75">({count})</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
