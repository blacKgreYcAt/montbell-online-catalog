'use client';

import { useState } from 'react';
import { CompanyInfo } from '@/lib/shoppingList';

interface CompanyInfoModalProps {
  onConfirm: (info: CompanyInfo) => void;
  onCancel: () => void;
}

export default function CompanyInfoModal({
  onConfirm,
  onCancel,
}: CompanyInfoModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!companyName.trim()) {
      setError('請輸入公司名稱');
      return;
    }

    onConfirm({
      name: companyName.trim(),
      contactPerson: contactPerson.trim() || undefined,
      phone: phone.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">公司資訊</h2>

        {/* 公司名稱 */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            公司名稱 *
          </label>
          <input
            type="text"
            value={companyName}
            onChange={e => {
              setCompanyName(e.target.value);
              setError('');
            }}
            placeholder="請輸入公司名稱"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004c6f]"
          />
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>

        {/* 聯絡人 */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            聯絡人 (選填)
          </label>
          <input
            type="text"
            value={contactPerson}
            onChange={e => setContactPerson(e.target.value)}
            placeholder="例：王經理"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004c6f]"
          />
        </div>

        {/* 電話 */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            電話 (選填)
          </label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="例：0912-345-678"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004c6f]"
          />
        </div>

        {/* 按鈕 */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  );
}
