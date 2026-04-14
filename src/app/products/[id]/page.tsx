'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProductById, getRelatedProducts } from '@/lib/products';
import { loadImageMapping, getGoogleDriveImageUrl } from '@/lib/imageUtils';
import { ProductGrid } from '@/components';
import type { Product, ImageMapping } from '@/types';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [imageMapping, setImageMapping] = useState<ImageMapping>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');

  // 載入商品詳情和相關商品
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productData, relatedData, imageData] = await Promise.all([
          getProductById(params.id),
          getRelatedProducts(params.id, 4),
          loadImageMapping(),
        ]);

        if (!productData) {
          setError('找不到該商品');
          setProduct(null);
        } else {
          setProduct(productData);
          setSelectedColor(productData.colors?.[0] || '');
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
  }, [params.id]);

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

  // 獲取選中顏色的圖片
  const imageKey = `k_${product.modelNumber}_${selectedColor.toLowerCase().substring(0, 2)}`;
  const imageId = imageMapping[imageKey];
  const imageUrl = imageId
    ? getGoogleDriveImageUrl(imageId)
    : '/next.svg';

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
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
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
          {/* 型號 */}
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-widest">型號</p>
            <p className="text-2xl font-bold text-gray-900">{product.modelNumber}</p>
          </div>

          {/* 名稱 */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
          </div>

          {/* 分類 */}
          <div>
            <span className="inline-block px-3 py-1 bg-[#7697B8] text-white rounded-full text-sm font-semibold">
              {product.category}
            </span>
          </div>

          {/* 描述 */}
          {product.description && (
            <div>
              <p className="text-gray-700 text-lg leading-relaxed">
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

          {/* 購買按鈕 */}
          <button className="w-full px-6 py-3 bg-[#004c6f] text-white font-bold rounded-lg hover:bg-[#003d56] transition-colors text-lg">
            🛒 加入購物車
          </button>

          {/* 已停產標籤 */}
          {product.discontinued && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 font-semibold">⚠️ 此商品已停產</p>
            </div>
          )}
        </div>
      </div>

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
