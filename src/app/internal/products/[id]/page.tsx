'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getInternalProductById, getInternalRelatedProducts } from '@/lib/products';
import { loadInternalImageMapping, getGoogleDriveImageUrl } from '@/lib/imageUtils';
import { isInternalAuthValid } from '@/lib/internalAuth';
import { ProductGrid } from '@/components';
import type { Product, ImageMapping } from '@/types';

export default function InternalProductDetailPage() {
  console.log('📍 InternalProductDetailPage rendered');
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  console.log('📍 productId:', productId);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [imageMapping, setImageMapping] = useState<ImageMapping>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  // 驗證認證
  useEffect(() => {
    if (!isInternalAuthValid()) {
      router.push('/internal/auth');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // 載入商品詳情和相關商品
  useEffect(() => {
    if (!isAuthorized || !productId) return;

    const loadData = async () => {
      try {
        setLoading(true);

        const [productData, relatedData, imageData] = await Promise.all([
          getInternalProductById(productId),
          getInternalRelatedProducts(productId, 4),
          loadInternalImageMapping(),
        ]);

        if (!productData) {
          setError(`找不到商品: ${productId}`);
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
  }, [productId, isAuthorized]);

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
          href="/internal/products"
          className="inline-block mt-4 px-6 py-2 bg-[#004c6f] text-white rounded-lg hover:bg-[#003d56] transition-colors"
        >
          返回商品目錄
        </Link>
      </div>
    );
  }

  // 獲取選中顏色的圖片
  const currentColor = selectedColor || product?.colors?.[0] || '';
  let imageUrl = '/no-image.svg';

  console.log('=== 圖片載入診斷 ===');
  console.log('Product:', { modelNumber: product.modelNumber, colors: product.colors, selectedColor });
  console.log('Current color:', currentColor);
  console.log('Image mapping keys count:', Object.keys(imageMapping).length);
  console.log('Image mapping sample keys:', Object.keys(imageMapping).slice(0, 5));

  if (currentColor && Object.keys(imageMapping).length > 0) {
    const imageKey1 = `${product.modelNumber}_${currentColor.toUpperCase()}`;
    const imageKey2 = `${product.modelNumber}_${currentColor}`;
    const imageKey3 = `k_${product.modelNumber}_${currentColor.toLowerCase()}`;

    console.log('Trying keys:', [imageKey1, imageKey2, imageKey3]);

    const imageId = imageMapping[imageKey1] || imageMapping[imageKey2] || imageMapping[imageKey3];

    console.log('Found ID:', imageId);

    if (imageId) {
      // 支援 Cloudinary URL 和 Google Drive ID
      imageUrl = imageId.startsWith('http') ? imageId : getGoogleDriveImageUrl(imageId);
      console.log(`SUCCESS: 找到圖片: ${imageKey1} → ${imageId}`);
      console.log('Image URL:', imageUrl);
    } else {
      console.log(`FAILED: 未找到圖片`);
      console.log('Check imageMapping:', {
        key1_exists: imageKey1 in imageMapping,
        key2_exists: imageKey2 in imageMapping,
        key3_exists: imageKey3 in imageMapping,
      });
    }
  } else {
    console.log('SKIPPED: Missing color or empty mapping', { currentColor, mappingLength: Object.keys(imageMapping).length });
  }

  return (
    <div className="space-y-12">
      <Link
        href="/internal/products"
        className="inline-flex items-center gap-2 text-[#004c6f] hover:text-[#003d56] font-semibold"
      >
        ← 返回商品目錄
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 圖片部分 */}
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '1' }}>
            <img
              key={selectedColor}
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                if (!img.src.includes('no-image.svg')) {
                  img.src = '/no-image.svg';
                }
              }}
            />
          </div>

          {/* 顏色選擇 */}
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

        {/* 資訊部分 */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-widest">型號</p>
            <p className="text-2xl font-bold text-gray-900">{product.modelNumber}</p>
          </div>

          <div>
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
          </div>

          <div className="flex gap-2 flex-wrap">
            <span className="inline-block px-3 py-1 bg-[#7697B8] text-white rounded-full text-sm font-semibold">
              {product.category}
            </span>
          </div>

          {/* 商品敘述 */}
          {product.description && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">商品介紹</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 特性 */}
      {product.features && (
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">主要特色</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {product.features}
          </p>
        </div>
      )}

      {/* 規格 */}
      {product.specifications && (
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">詳細規格</h2>
          {typeof product.specifications === 'string' ? (
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {product.specifications}
            </p>
          ) : (
            <div className="space-y-3">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-gray-600">{key}</span>
                  <span className="font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 尺寸 */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">可用尺寸</h2>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <span key={size} className="px-4 py-2 bg-[#f0f5ff] border border-[#7697B8] rounded-lg text-gray-900 font-medium">
                {size}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 重量 */}
      {product.weight && (
        <div className="border-t border-gray-200 pt-4">
          <p className="text-gray-700"><span className="font-semibold">重量：</span> {product.weight}</p>
        </div>
      )}

      {/* 相關商品 */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-200 pt-8 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">相關商品</h2>
          </div>
          <ProductGrid
            products={relatedProducts}
            imageMapping={imageMapping}
            hidePrice={true}
            basePath="/internal/products"
            useGoogleDrive={true}
          />
        </div>
      )}
    </div>
  );
}
