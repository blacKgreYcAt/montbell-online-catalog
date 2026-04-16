'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { getGoogleDriveImageUrl, generateMonbellImageUrl } from '@/lib/imageUtils';

interface ProductCardProps {
  product: Product;
  imageId?: string;
}

export default function ProductCard({ product, imageId }: ProductCardProps) {
  // 優先使用 Montbell CDN (第一個顏色)，次選 Google Drive，最後用佔位圖
  let imageUrl = '/next.svg';

  if (product.colors && product.colors.length > 0) {
    imageUrl = generateMonbellImageUrl(product.modelNumber, product.colors[0]);
  } else if (imageId) {
    imageUrl = getGoogleDriveImageUrl(imageId);
  }

  return (
    <Link href={`/products/${product.id}`}>
      <div className="cursor-pointer overflow-hidden border border-gray-200 rounded-[15px] hover:shadow-lg transition-shadow duration-300 bg-white">
        {/* 圖片區域 */}
        <div className="relative w-full bg-gray-100 overflow-hidden" style={{ aspectRatio: '1', borderRadius: '15px 15px 0 0' }}>
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              // 圖片加載失敗時顯示「暫無商品圖」
              if (img.src.includes('montbell.com') || img.src.includes('drive.google.com')) {
                img.src = '/no-image.svg';
              }
            }}
          />
          {/* Badge 標記 */}
          {product.badge && (
            <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white ${
              product.badge.includes('27SS')
                ? 'bg-[#1a6fa0]'  // 27SS 新品用深藍
                : 'bg-[#c39d6f]'  // 推薦用金色
            }`}>
              {product.badge}
            </div>
          )}
          {product.discontinued && (
            <div className="absolute bottom-3 right-3 bg-[#C00] text-white px-3 py-1 rounded-full text-xs font-bold">
              已停產
            </div>
          )}
        </div>

        {/* 商品信息 */}
        <div className="space-y-2 p-4">
          {/* 型號 */}
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
            {product.modelNumber}
          </p>

          {/* 名稱 */}
          <h3 className="font-bold text-[#004c6f] line-clamp-2 hover:text-[#7697B8] transition-colors text-sm">
            {product.name}
          </h3>

          {/* 分類 */}
          <p className="text-xs">
            <span className="inline-block bg-[#7697B8] text-white px-3 py-1 rounded-full text-xs font-semibold">
              {product.category}
            </span>
          </p>

          {/* 顏色選項 */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-2 pt-1">
              {product.colors.slice(0, 4).map((color) => (
                <div
                  key={color}
                  className="w-6 h-6 rounded-full border-2 border-[#004c6f] hover:border-[#c39d6f] transition-colors cursor-pointer"
                  title={color}
                  role="button"
                  tabIndex={0}
                  style={{
                    backgroundColor: getColorCode(color),
                  }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-600 flex items-center font-semibold">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}

          {/* 價格 */}
          {product.price && (
            <div className="pt-3 border-t border-gray-200">
              <p className="text-lg font-bold text-[#C00]">
                NT${product.price.toLocaleString()}
              </p>
            </div>
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
