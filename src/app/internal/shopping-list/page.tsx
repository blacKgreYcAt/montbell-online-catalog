'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  getShoppingList,
  clearShoppingList,
  removeFromShoppingList,
  CompanyInfo,
  saveCompanyInfo,
} from '@/lib/shoppingList';
import { ShoppingListItem } from '@/lib/shoppingList';
import { loadInternalImageMapping, getGoogleDriveImageUrl } from '@/lib/imageUtils';
import AddToShoppingListButton from '@/components/AddToShoppingListButton';
import CompanyInfoModal from '@/components/CompanyInfoModal';

export default function ShoppingListPage() {
  const router = useRouter();
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [imageMapping, setImageMapping] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      const list = getShoppingList();
      setItems(list);

      // 加載圖片映射
      const images = await loadInternalImageMapping();
      setImageMapping(images);

      setLoading(false);
    };

    loadData();
  }, []);

  const handleRemoveItem = (productId: string) => {
    removeFromShoppingList(productId);
    setItems(items.filter(item => item.id !== productId));
  };

  const handleClearList = () => {
    if (confirm('確定要清空購物清單嗎？')) {
      clearShoppingList();
      setItems([]);
    }
  };

  const handleGeneratePDF = (companyInfo: CompanyInfo) => {
    saveCompanyInfo(companyInfo);
    // 這裡之後會調用 PDF 生成函數
    router.push('/internal/shopping-list/pdf-preview');
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004c6f]" />
        </div>
        <p className="text-gray-600 mt-4">載入中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">選擇清單</h1>
          <p className="text-lg text-gray-600">
            共 <span className="font-bold text-[#004c6f]">{items.length}</span> 件商品
          </p>
        </div>
        <Link
          href="/internal/products"
          className="px-6 py-2 bg-[#004c6f] text-white rounded-lg hover:bg-[#003d56] transition-colors"
        >
          返回商品
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">購物清單是空的</p>
          <Link
            href="/internal/products"
            className="inline-block px-6 py-2 bg-[#004c6f] text-white rounded-lg hover:bg-[#003d56] transition-colors"
          >
            前往選擇商品
          </Link>
        </div>
      ) : (
        <>
          {/* 商品列表 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {items.map(item => {
                // 獲取商品的第一張圖片
                const firstColor = item.colors?.[0] || 'BK';
                const imageKey = `${item.modelNumber}_${firstColor}`;
                const imageUrl = imageMapping[imageKey];

                return (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    {/* 商品圖片 */}
                    <div className="bg-gray-100 rounded-lg h-40 mb-3 flex items-center justify-center relative overflow-hidden">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <span className="text-gray-400">無圖片</span>
                      )}
                    </div>

                  {/* 商品信息 */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-semibold">
                      {item.modelNumber}
                    </p>
                    <h3 className="font-bold text-[#004c6f] line-clamp-2">
                      {item.name}
                    </h3>

                    {/* 顏色 */}
                    {item.colors && item.colors.length > 0 && (
                      <p className="text-sm text-gray-600">
                        顏色: {item.colors.join(', ')}
                      </p>
                    )}

                    {/* 價格 */}
                    {item.price && (
                      <p className="text-lg font-bold text-[#C00]">
                        {item.price}
                      </p>
                    )}

                    {/* 移除按鈕 */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="w-full mt-3 px-3 py-2 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                    >
                      移除
                    </button>
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          {/* 操作按鈕 */}
          <div className="flex gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              📊 生成 PDF
            </button>
            <button
              onClick={handleClearList}
              className="flex-1 px-6 py-3 bg-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              清空清單
            </button>
          </div>
        </>
      )}

      {/* 公司資訊彈窗 */}
      {showModal && (
        <CompanyInfoModal
          onConfirm={handleGeneratePDF}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
