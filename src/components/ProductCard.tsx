'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { getGoogleDriveImageUrl, generateMonbellImageUrl } from '@/lib/imageUtils';

interface ProductCardProps {
  product: Product;
  imageId?: string;
  hidePrice?: boolean;
  basePath?: string;
  useGoogleDrive?: boolean;
}

export default function ProductCard({ product, imageId, hidePrice = false, basePath = '/products', useGoogleDrive = false }: ProductCardProps) {
  let imageUrl = '/no-image.svg';

  // 內部版優先使用 Cloudinary/Google Drive，公開版優先使用 Montbell CDN
  if (useGoogleDrive && imageId) {
    // 如果是 URL（Cloudinary 或 Google Drive），直接使用；否則轉換為 Google Drive URL
    imageUrl = imageId.startsWith('http') ? imageId : getGoogleDriveImageUrl(imageId);
  } else if (product.colors && product.colors.length > 0) {
    imageUrl = generateMonbellImageUrl(product.modelNumber, product.colors[0]);
  } else if (imageId) {
    imageUrl = imageId.startsWith('http') ? imageId : getGoogleDriveImageUrl(imageId);
  }

  return (
    <Link href={`${basePath}/${product.id}`}>
      <div className="cursor-pointer overflow-hidden border border-gray-200 rounded-[15px] hover:shadow-lg transition-shadow duration-300 bg-white">
        {/* 圖片區域 */}
        <div className="relative w-full bg-gray-100 overflow-hidden" style={{ aspectRatio: '1', borderRadius: '15px 15px 0 0' }}>
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              // 圖片加載失敗時顯示「暫無商品圖」
              if (!img.src.includes('no-image.svg')) {
                img.src = '/no-image.svg';
              }
            }}
          />
          {/* Badge 標記 */}
          {product.badge && (
            <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white ${
              product.badge === '26FW'
                ? 'bg-[#1a6fa0]'  // 26FW 新品用深藍
                : product.badge === '27SS'
                ? 'bg-[#1a6fa0]'  // 27SS 新品用深藍
                : 'bg-[#d4644f]'  // 活動款用紅色
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
          {/* 型號 + 頁碼 */}
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
              {product.modelNumber}
            </p>
            {product.pageNumber && (
              <span className="inline-flex items-center gap-1 bg-[#c39d6f] text-white px-2 py-0.5 rounded text-xs font-bold shadow-sm">
                📖 P.{product.pageNumber}
              </span>
            )}
          </div>

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
            <div className="space-y-2 pt-1">
              <div className="flex gap-2">
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

              {/* 樣品顏色 */}
              {product.sampleColor && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-600 font-semibold">樣品顏色:</span>
                  <div
                    className="w-5 h-5 rounded-full border-2 border-[#004c6f]"
                    title={`樣品: ${product.sampleColor}`}
                    style={{
                      backgroundColor: getColorCode(product.sampleColor),
                    }}
                  />
                  <span className="text-gray-700 font-semibold">{product.sampleColor}</span>
                </div>
              )}
            </div>
          )}

          {/* 價格 */}
          {product.price && !hidePrice && (
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
 * 根據顏色代碼返回 CSS 顏色代碼
 * 支援英文代碼（BK, NV, RBL 等）和全名
 */
function getColorCode(color: string): string {
  const colorMap: Record<string, string> = {
    // 英文代碼對應
    'BK': '#000000',      // 黑
    'WH': '#f5f5f5',      // 白
    'RD': '#ef4444',      // 紅
    'BL': '#3b82f6',      // 藍
    'GR': '#10b981',      // 綠
    'YE': '#fbbf24',      // 黃
    'PK': '#ec4899',      // 粉紅
    'BR': '#92400e',      // 棕
    'GY': '#6b7280',      // 灰
    'BE': '#d2b48c',      // 米色/杏色
    'NV': '#001f3f',      // 海軍藍
    'DGY': '#4b5563',     // 深灰
    'RBL': '#1e40af',     // 皇家藍
    'GN': '#059669',      // 深綠
    'OR': '#ea580c',      // 橙色
    'TN': '#b45309',      // 棕褐
    'KH': '#c2b280',      // 卡其色

    // 中文名稱對應（備用）
    '黑色': '#000000',
    '白色': '#f5f5f5',
    '紅色': '#ef4444',
    '藍色': '#3b82f6',
    '綠色': '#10b981',
    '黃色': '#fbbf24',
    '粉紅': '#ec4899',
    '棕色': '#92400e',
    '灰色': '#6b7280',
    '米色': '#d2b48c',
  };

  const upperColor = color.toUpperCase();
  return colorMap[upperColor] || colorMap[color] || '#e5e7eb';
}
