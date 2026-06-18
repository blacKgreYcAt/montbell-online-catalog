'use client';

import { Product, ImageMapping } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  imageMapping?: ImageMapping;
  loading?: boolean;
  emptyMessage?: string;
  hidePrice?: boolean;
  basePath?: string;
  useGoogleDrive?: boolean;
}

export default function ProductGrid({
  products,
  imageMapping = {},
  loading = false,
  emptyMessage = '找不到相符的商品',
  hidePrice = false,
  basePath = '/products',
  useGoogleDrive = false,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg mb-4" style={{ aspectRatio: '1' }} />
            <div className="h-4 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        // 獲取第一個顏色的圖片 URL
        const firstColor = product.colors?.[0] || 'BK';
        const colorLower = firstColor.toLowerCase();

        // 優先嘗試公開版格式（Cloudinary），次選內部版格式
        const imageKey1 = `k_${product.modelNumber}_${colorLower}`; // 公開版格式
        const imageKey2 = `${product.modelNumber}_${firstColor.toUpperCase()}`; // 內部版格式
        const imageId = imageMapping[imageKey1] || imageMapping[imageKey2];

        return (
          <ProductCard
            key={product.id}
            product={product}
            imageId={imageId}
            hidePrice={hidePrice}
            basePath={basePath}
            useGoogleDrive={useGoogleDrive}
          />
        );
      })}
    </div>
  );
}
