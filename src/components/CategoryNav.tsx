'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MAIN_CATEGORIES } from '@/lib/categories';

interface CategoryNavProps {
  selectedCategory?: string;
  variant?: 'horizontal' | 'sidebar';
}

/**
 * 分类导航组件
 * 支持两种显示模式：
 * - horizontal: 横向导航栏（用于顶部）
 * - sidebar: 侧边栏分类树（用于产品页面）
 */
export default function CategoryNav({
  selectedCategory,
  variant = 'horizontal',
}: CategoryNavProps) {
  const [expandedMain, setExpandedMain] = useState<string | null>(null);

  if (variant === 'horizontal') {
    return (
      <nav className="bg-white border-b-2 border-[#004c6f] overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-2 whitespace-nowrap">
            {/* 全部 */}
            <Link
              href="/products"
              className={`px-4 py-2 rounded-lg font-medium transition-colors min-h-[44px] flex items-center active:opacity-75 ${
                !selectedCategory
                  ? 'bg-[#7697B8] text-white'
                  : 'text-[#004c6f] hover:bg-gray-100'
              }`}
            >
              全部
            </Link>

            {/* 主分类 */}
            {MAIN_CATEGORIES.map((main) => (
              <Link
                key={main.id}
                href={`/products?main=${main.slug}`}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap min-h-[44px] flex items-center active:opacity-75 ${
                  selectedCategory === main.slug
                    ? 'bg-[#7697B8] text-white'
                    : 'text-[#004c6f] hover:bg-gray-50'
                }`}
              >
                <span className="text-sm">{main.icon} {main.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    );
  }

  // 側邊欄模式
  return (
    <div className="space-y-4">
      {/* 標題 */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">瀏覽分類</h2>
        <p className="text-sm text-gray-600 mt-1">
          按分類瀏覽所有商品
        </p>
      </div>

      {/* 分類樹 */}
      <div className="space-y-2">
        {/* 全部商品 */}
        <Link
          href="/products"
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
            !selectedCategory
              ? 'bg-[#004c6f] text-white'
              : 'text-gray-900 hover:bg-gray-100'
          }`}
        >
          <span className="text-lg mr-3">📦</span>
          <span className="font-semibold">全部商品</span>
        </Link>

        {/* 主分類 */}
        {MAIN_CATEGORIES.map((mainCategory) => (
          <div key={mainCategory.id}>
            {/* 主分類按鈕 */}
            <button
              onClick={() =>
                setExpandedMain(
                  expandedMain === mainCategory.id ? null : mainCategory.id
                )
              }
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                expandedMain === mainCategory.id
                  ? 'bg-[#004c6f] text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{mainCategory.icon}</span>
                <span className="font-semibold">{mainCategory.name}</span>
              </div>
              <span className="text-sm">
                {expandedMain === mainCategory.id ? '−' : '+'}
              </span>
            </button>

            {/* 子分類 */}
            {expandedMain === mainCategory.id && (
              <div className="ml-4 mt-2 space-y-1 border-l-2 border-[#004c6f] pl-4">
                {mainCategory.subcategories.map((subCategory) => (
                  <Link
                    key={subCategory.id}
                    href={`/products?category=${subCategory.id}`}
                    className={`block px-3 py-2 rounded transition-colors ${
                      selectedCategory === subCategory.id
                        ? 'bg-[#004c6f] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {subCategory.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 查看全部 */}
      <div className="pt-4 border-t border-gray-200">
        <Link
          href="/products"
          className="w-full block text-center px-4 py-3 bg-white border-2 border-[#004c6f] text-[#004c6f] font-semibold rounded-lg hover:bg-[#f0f5ff] transition-colors"
        >
          查看全部商品
        </Link>
      </div>
    </div>
  );
}
