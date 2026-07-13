'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  getShoppingList,
  getCompanyInfo,
  clearShoppingList,
  clearCompanyInfo,
} from '@/lib/shoppingList';
import { loadInternalImageMapping } from '@/lib/imageUtils';
import { ShoppingListItem, CompanyInfo } from '@/lib/shoppingList';

export default function PDFPreviewPage() {
  const router = useRouter();
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageMapping, setImageMapping] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      const list = getShoppingList();
      const info = getCompanyInfo();

      if (list.length === 0 || !info) {
        router.push('/internal/shopping-list');
        return;
      }

      setItems(list);
      setCompanyInfo(info);

      // 加載圖片映射
      const images = await loadInternalImageMapping();
      setImageMapping(images);

      setLoading(false);
    };

    loadData();
  }, [router]);

  const handleDownloadPDF = async () => {
    const element = document.getElementById('pdf-content');
    if (!element) return;

    try {
      const { default: html2pdfLib } = await import('html2pdf.js');

      const opt = {
        margin: 10,
        filename: `Montbell_${companyInfo?.name || 'ShoppingList'}_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.95 },
        html2canvas: {
          scale: 1.2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          removeContainer: true,
          onclone: (clonedDocument: Document) => {
            // 保留所有 CSS，但修復 style 標籤中的問題顏色函數
            const styles = clonedDocument.querySelectorAll('style');
            styles.forEach(style => {
              if (style.textContent) {
                // 保留 CSS，只替換不支持的顏色函數
                let content = style.textContent;
                // 替換 lab() 為 rgb(0, 0, 0)
                content = content.replace(/lab\([^)]*\)/g, 'rgb(0, 0, 0)');
                // 替換 oklch() 為 rgb(0, 0, 0)
                content = content.replace(/oklch\([^)]*\)/g, 'rgb(0, 0, 0)');
                // 替換 oklab() 為 rgb(0, 0, 0)
                content = content.replace(/oklab\([^)]*\)/g, 'rgb(0, 0, 0)');
                // 替換 color-mix() 為 rgb(0, 0, 0)
                content = content.replace(/color-mix\([^)]*?\)[^;]*/g, 'rgb(0, 0, 0)');
                style.textContent = content;
              }
            });

            // 強制設置所有元素的可見顏色，確保文本可見
            const allElements = clonedDocument.querySelectorAll('*');
            allElements.forEach((el) => {
              const element = el as HTMLElement;
              const computed = clonedDocument.defaultView?.getComputedStyle(element);
              if (computed) {
                const bgColor = computed.backgroundColor;
                const textColor = computed.color;

                // 如果背景色是白色或透明，保持不變
                // 如果文本顏色是透明或白色，強制改為黑色
                if (textColor === 'rgba(0, 0, 0, 0)' || textColor === 'transparent' || !textColor) {
                  element.style.color = '#000000';
                }
                // 確保文本顏色不是白色
                if (textColor === 'rgb(255, 255, 255)' || textColor === 'white') {
                  element.style.color = '#000000';
                }
              }
            });
          }
        },
        jsPDF: { orientation: 'landscape' as const, unit: 'mm' as const, format: 'a4' }
      };

      // html2pdf 返回一個 promise chain
      html2pdfLib()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          console.log('PDF 下載成功');
          alert('PDF 已下載完成！');
        })
        .catch((error: Error) => {
          console.error('PDF 生成錯誤，但仍嘗試下載:', error);
          // 即使出錯也嘗試保存
          html2pdfLib()
            .set(opt)
            .from(element)
            .save()
            .catch(() => {
              alert('PDF 生成失敗，請稍後重試');
            });
        });
    } catch (error) {
      console.error('PDF 導入錯誤:', error);
      alert('PDF 下載失敗，請重試');
    }
  };

  const handleSendEmail = () => {
    // 使用設備原生郵件應用發送
    const itemList = items.map(item =>
      `${item.modelNumber} - ${item.name}`
    ).join('\n');

    const body = `親愛的客戶，

以下是 Montbell 選擇清單的商品清單：

${itemList}

--
公司名稱: ${companyInfo?.name}
聯絡人: ${companyInfo?.contactPerson || '(未提供)'}
電話: ${companyInfo?.phone || '(未提供)'}
製表日期: ${new Date().toLocaleDateString('zh-TW')}

提示: 請先點擊「下載 PDF」按鈕以獲得完整的 PDF 檔案，然後手動附加到此郵件。`;

    const subject = `Montbell 選擇清單 - ${companyInfo?.name}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
      <div className="space-y-8" id="pdf-content">
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
              {pageItems.map(item => {
                // 獲取商品的第一張圖片
                const firstColor = item.colors?.[0] || 'BK';
                const imageKey = `${item.modelNumber}_${firstColor}`;
                const imageUrl = imageMapping[imageKey];

                return (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-3 text-xs"
                >
                  {/* 圖片 */}
                  <div className="bg-gray-100 rounded h-20 mb-2 flex items-center justify-center text-gray-400 relative overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    ) : (
                      <span>無圖</span>
                    )}
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
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 操作按鈕 */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => handleDownloadPDF()}
          className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
        >
          📥 下載 PDF
        </button>
        <button
          type="button"
          onClick={handleSendEmail}
          className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          📧 用郵件發送
        </button>
        <button
          type="button"
          onClick={handleClearAndReturn}
          className="flex-1 px-6 py-3 bg-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          清空並返回
        </button>
      </div>
    </div>
  );
}
