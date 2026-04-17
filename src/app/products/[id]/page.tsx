'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getProductById, getRelatedProducts } from '@/lib/products';
import { loadImageMapping, getGoogleDriveImageUrl, generateMonbellImageUrl } from '@/lib/imageUtils';
import { ProductGrid } from '@/components';
import type { Product, ImageMapping } from '@/types';

interface EnrichedProduct {
  modelNumber: string;
  description_zh_tw?: string;
  features_zh_tw?: string[];
  specifications_zh_tw?: Record<string, string>;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [imageMapping, setImageMapping] = useState<ImageMapping>({});
  const [enrichedData, setEnrichedData] = useState<EnrichedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');

  // 載入商品詳情和相關商品
  useEffect(() => {
    if (!productId) {
      setError('商品 ID 無效');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        console.log('正在載入商品詳情，ID:', productId);

        const [productData, relatedData, imageData] = await Promise.all([
          getProductById(productId),
          getRelatedProducts(productId, 4),
          loadImageMapping(),
        ]);

        console.log('載入結果 - 商品:', productData ? '找到' : '未找到', '相關商品:', relatedData.length);

        if (!productData) {
          setError(`找不到商品: ${productId}`);
          setProduct(null);
        } else {
          setProduct(productData);
          setSelectedColor(productData.colors?.[0] || '');

          // 載入對應的官網資訊
          try {
            const enrichedRes = await fetch('/enrichedData.json', { cache: 'no-store' });
            const enrichedList: EnrichedProduct[] = await enrichedRes.json();
            const enrichedProduct = enrichedList.find(
              (p) => p.modelNumber === productData.modelNumber
            );
            if (enrichedProduct) {
              console.log('找到官網資訊:', productData.modelNumber);
              setEnrichedData(enrichedProduct);
            }
          } catch (enrichErr) {
            console.log('載入官網資訊失敗，但不影響商品顯示:', enrichErr);
          }
        }

        setRelatedProducts(relatedData);
        setImageMapping(imageData);
      } catch (err) {
        console.error('載入商品詳情失敗:', err);
        setError('載入商品詳情時發生錯誤');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [productId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004c6f]" />
        </div>
        <p className="text-gray-600 mt-4">載入商品詳情中...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg font-semibold">❌ {error || '找不到該商品'}</p>
        <Link
          href="/products"
          className="inline-block mt-4 px-6 py-2 bg-[#004c6f] text-white rounded-lg hover:bg-[#003d56] transition-colors"
        >
          返回商品目錄
        </Link>
      </div>
    );
  }

  // 獲取選中顏色的圖片 (優先 Montbell CDN，次選 Google Drive，最後用替代圖)
  const currentColor = selectedColor || product?.colors?.[0] || '';
  let imageUrl = '/no-image.svg';

  if (currentColor) {
    // 優先使用 Montbell CDN
    imageUrl = generateMonbellImageUrl(product.modelNumber, currentColor);
  } else if (product?.colors?.[0]) {
    // 次選：Google Drive 備份
    const imageKey = `k_${product.modelNumber}_${product.colors[0].toLowerCase().substring(0, 2)}`;
    const imageId = imageMapping[imageKey];
    if (imageId) {
      imageUrl = getGoogleDriveImageUrl(imageId);
    }
  }
  // 如果沒有顏色，直接使用 no-image.svg

  return (
    <div className="space-y-12">
      {/* 返回鏈接 */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-[#004c6f] hover:text-[#003d56] font-semibold"
      >
        ← 返回商品目錄
      </Link>

      {/* 商品詳情 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 圖片部分 */}
        <div className="space-y-4">
          {/* 主圖片 */}
          <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '1' }}>
            <img
              key={selectedColor}
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                // 圖片加載失敗時，顯示替代圖「暫無商品圖」
                if (!img.src.includes('no-image.svg')) {
                  img.src = '/no-image.svg';
                }
              }}
            />
          </div>

          {/* 如果有多個顏色，顯示顏色選擇 */}
          {product.colors && product.colors.length > 1 && (
            <div className="space-y-2">
              <p className="font-semibold text-gray-900">選擇顏色:</p>
              <div className="flex gap-3 flex-wrap">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                      selectedColor === color
                        ? 'border-[#004c6f] bg-[#f0f5ff] text-[#004c6f]'
                        : 'border-gray-300 bg-white text-gray-900 hover:border-[#7697B8]'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 信息部分 */}
        <div className="space-y-6">
          {/* 紙本目錄頁碼 - 顯眼標示 */}
          {product.pageNumber && (
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#c39d6f] to-[#b8905e] text-white px-5 py-3 rounded-lg shadow-md">
              <span className="text-2xl">📖</span>
              <div>
                <p className="text-xs uppercase tracking-widest opacity-90">紙本目錄</p>
                <p className="text-xl font-bold leading-tight">第 {product.pageNumber} 頁</p>
              </div>
            </div>
          )}

          {/* 型號 */}
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-widest">型號</p>
            <p className="text-2xl font-bold text-gray-900">{product.modelNumber}</p>
          </div>

          {/* 名稱 */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
          </div>

          {/* 分類和標記 */}
          <div className="flex gap-2 flex-wrap">
            <span className="inline-block px-3 py-1 bg-[#7697B8] text-white rounded-full text-sm font-semibold">
              {product.category}
            </span>
            {product.badge && (
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white ${
                product.badge.includes('27SS')
                  ? 'bg-[#1a6fa0]'
                  : 'bg-[#c39d6f]'
              }`}>
                {product.badge}
              </span>
            )}
          </div>

          {/* 描述 */}
          {product.description && (
            <div>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          )}

          {/* 價格 */}
          {product.price && (
            <div className="border-t border-b border-gray-200 py-4">
              <p className="text-sm text-gray-500 mb-2">價格</p>
              <p className="text-4xl font-bold text-[#C00]">
                NT${product.price.toLocaleString()}
              </p>
            </div>
          )}

          {/* 尺寸 */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">尺寸</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className="px-4 py-2 border-2 border-[#004c6f] text-[#004c6f] rounded-lg hover:bg-[#004c6f] hover:text-white transition-colors font-medium"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 規格 */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">規格</h3>
              <div className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-gray-600">{key}</span>
                    <span className="font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 已停產標籤 */}
          {product.discontinued && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 font-semibold">⚠️ 此商品已停產</p>
            </div>
          )}
        </div>
      </div>

      {/* 官網資訊區段 */}
      {enrichedData && (
        <div className="space-y-8 border-t border-gray-200 pt-8">
          <div className="bg-gradient-to-r from-[#f0f5ff] to-[#e8f0ff] border-l-4 border-[#004c6f] p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-[#004c6f] mb-2">官網商品詳情</h2>
            <p className="text-sm text-gray-600">來自 Montbell 官方網站的完整商品資訊</p>
          </div>

          {/* 官網描述 */}
          {enrichedData.description_zh_tw && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">商品介紹</h3>
              <p className="text-gray-700 leading-relaxed">
                {enrichedData.description_zh_tw}
              </p>
            </div>
          )}

          {/* 官網特色/功能 */}
          {enrichedData.features_zh_tw && enrichedData.features_zh_tw.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">主要特色</h3>
              <ul className="space-y-3">
                {enrichedData.features_zh_tw.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-[#004c6f] font-bold mt-1 min-w-6">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 官網規格 */}
          {enrichedData.specifications_zh_tw && Object.keys(enrichedData.specifications_zh_tw).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">詳細規格</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {Object.entries(enrichedData.specifications_zh_tw).map(([key, value], index) => (
                      <tr
                        key={key}
                        className={`border-b last:border-b-0 ${
                          index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        }`}
                      >
                        <td className="px-6 py-4 font-semibold text-gray-900 w-1/3">{key}</td>
                        <td className="px-6 py-4 text-gray-700">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 相關商品 */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">相關商品</h2>
            <p className="text-gray-600 mt-2">您可能也對這些商品感興趣</p>
          </div>
          <ProductGrid
            products={relatedProducts}
            imageMapping={imageMapping}
          />
        </div>
      )}
    </div>
  );
}
