'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getShoppingList,
  getCompanyInfo,
  clearShoppingList,
  clearCompanyInfo,
} from '@/lib/shoppingList';
import { ShoppingListItem, CompanyInfo } from '@/lib/shoppingList';

export default function PDFPreviewPage() {
  const router = useRouter();
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const list = getShoppingList();
    const info = getCompanyInfo();

    if (list.length === 0 || !info) {
      router.push('/internal/shopping-list');
      return;
    }

    setItems(list);
    setCompanyInfo(info);
    setLoading(false);
  }, [router]);

  const handleDownloadPDF = () => {
    // 這裡之後會實現 PDF 下載邏輯
    alert('PDF 下載功能將於下一步實現');
  };

  const handleSendEmail = () => {
    // 這裡之後會實現郵件發送邏輯
    const subject = encodeURIComponent('Montbell 選擇清單');
    const body = encodeURIComponent(
      `親愛的客戶，\n\n請見附件 Montbell 選擇清單。\n\n公司名稱: ${companyInfo?.name}\n聯絡人: ${companyInfo?.contactPerson || '(未提供)'}\n電話: ${companyInfo?.phone || '(未提供)'}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleClearAndReturn = () => {
    if (confirm('確定要清空清單並返回嗎？')) {
      clearShoppingList();
      clearCompanyInfo();
      router.push('/internal/products');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004c6f]" />
        </div>
        <p className="text-gray-600 mt-4">生成 PDF 中...</p>
      </div>
    );
  }

  // 計算每頁的商品數（最多 6 個，根據顏色數量智能調整）
  const getItemsPerPage = (item: ShoppingListItem) => {
    const colorCount = item.colors?.length || 1;
    if (colorCount <= 3) return 6;
    if (colorCount <= 6) return 4;
    return 2;
  };

  // 簡化：暫時按最多 6 個分頁
  const itemsPerPage = 6;
  const pages = [];
  for (let i = 0; i < items.length; i += itemsPerPage) {
    pages.push(items.slice(i, i + itemsPerPage));
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">PDF 預覽</h1>
        <Link
          href="/internal/shopping-list"
          className="px-4 py-2 text-gray-600 hover:text-gray-900 underline"
        >
          返回清單
        </Link>
      </div>

      {/* 公司資訊 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="font-bold text-[#004c6f] mb-2">公司資訊</h2>
        <p>
          <span className="font-semibold">公司名稱:</span> {companyInfo?.name}
        </p>
        {companyInfo?.contactPerson && (
          <p>
            <span className="font-semibold">聯絡人:</span>{' '}
            {companyInfo.contactPerson}
          </p>
        )}
        {companyInfo?.phone && (
          <p>
            <span className="font-semibold">電話:</span> {companyInfo.phone}
          </p>
        )}
        <p className="text-sm text-gray-600 mt-2">
          製表日期: {new Date().toLocaleDateString('zh-TW')}
        </p>
      </div>

      {/* PDF 預覽 - 模擬版面 */}
      <div className="space-y-8">
        {pages.map((pageItems, pageIndex) => (
          <div
            key={pageIndex}
            className="bg-white border-2 border-gray-300 rounded-lg p-8 shadow-lg"
            style={{ aspectRatio: '16/9' }}
          >
            {/* 頁首 */}
            <div className="border-b-2 border-gray-300 pb-4 mb-4">
              <h3 className="font-bold text-[#004c6f] text-sm">
                {companyInfo?.name}
              </h3>
              <p className="text-xs text-gray-600">
                {new Date().toLocaleDateString('zh-TW')} | 第 {pageIndex + 1}{' '}
                頁
              </p>
            </div>

            {/* 商品網格 - 最多 6 個 */}
            <div className="grid grid-cols-3 gap-4 h-full">
              {pageItems.map(item => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-3 text-xs"
                >
                  {/* 圖片佔位符 */}
                  <div className="bg-gray-100 rounded h-20 mb-2 flex items-center justify-center text-gray-400">
                    圖
                  </div>

                  {/* 信息 */}
                  <p className="font-bold text-[#004c6f] line-clamp-2 mb-1">
                    {item.modelNumber}
                  </p>
                  <p className="text-gray-700 line-clamp-2 mb-1">
                    {item.name}
                  </p>
                  {item.colors && item.colors.length > 0 && (
                    <p className="text-gray-600">
                      顏色: {item.colors.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 操作按鈕 */}
      <div className="flex gap-4">
        <button
          onClick={handleDownloadPDF}
          className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
        >
          📥 下載 PDF
        </button>
        <button
          onClick={handleSendEmail}
          className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          📧 用郵件發送
        </button>
        <button
          onClick={handleClearAndReturn}
          className="flex-1 px-6 py-3 bg-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          清空並返回
        </button>
      </div>
    </div>
  );
}
