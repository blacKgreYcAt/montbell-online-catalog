'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { getGoogleDriveImageUrl } from '@/lib/imageUtils';

interface ProductCardProps {
  product: Product;
  imageId?: string;
}

export default function ProductCard({ product, imageId }: ProductCardProps) {
  const imageUrl = imageId
    ? getGoogleDriveImageUrl(imageId)
    : '/next.svg'; // 預設佔位圖

  return (
    <Link href={`/products/${product.id}`}>
      <div className="card cursor-pointer overflow-hidden">
        {/* 圖片區域 */}
        <div className="relative w-full bg-gray-100 overflow-hidden rounded-lg mb-4" style={{ aspectRatio: '1' }}>
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
          {product.discontinued && (
            <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
              已停產
            </div>
          )}
        </div>

        {/* 商品信息 */}
        <div className="space-y-2">
          {/* 型號 */}
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            型號: {product.modelNumber}
          </p>

          {/* 名稱 */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>

          {/* 分類 */}
          <p className="text-sm text-gray-600">
            <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs">
              {product.category}
            </span>
          </p>

          {/* 顏色選項 */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-2 pt-2">
              {product.colors.slice(0, 4).map((color) => (
                <div
                  key={color}
                  className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-indigo-600 transition-colors"
                  title={color}
                  style={{
                    backgroundColor: getColorCode(color),
                  }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-500 flex items-center">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}

          {/* 價格 */}
          {product.price && (
            <p className="text-lg font-bold text-gray-900 pt-2">
              NT${product.price.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

/**
 * 根據顏色名稱返回 CSS 顏色代碼
 */
function getColorCode(color: string): string {
  const colorMap: Record<string, string> = {
    '黑色': '#000000',
    '白色': '#ffffff',
    '紅色': '#ef4444',
    '藍色': '#3b82f6',
    '綠色': '#10b981',
    '黃色': '#fbbf24',
    '粉紅': '#ec4899',
    '棕色': '#92400e',
    '灰色': '#6b7280',
    '米色': '#d2b48c',
  };
  return colorMap[color] || '#e5e7eb';
}
