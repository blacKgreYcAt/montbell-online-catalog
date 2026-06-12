'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setInternalAuth } from '@/lib/internalAuth';
import Link from 'next/link';

export default function InternalAuthPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (setInternalAuth(password)) {
        // 密碼正確
        router.push('/internal/products');
      } else {
        setError('密碼錯誤，請重試');
        setPassword('');
      }
    } catch (err) {
      setError('發生錯誤，請稍後重試');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#004c6f] to-[#003a52] px-4">
      <div className="w-full max-w-md">
        {/* 返回首頁鏈接 */}
        <div className="mb-6 text-center">
          <Link href="/" className="text-white text-sm hover:underline">
            ← 返回首頁
          </Link>
        </div>

        {/* 主容器 */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔒</div>
            <h1 className="text-3xl font-bold text-[#004c6f] mb-2">
              FW27 內部版
            </h1>
            <p className="text-gray-600">
              僅限內部同事使用
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 密碼輸入框 */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                訪問密碼
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="請輸入密碼"
                className="w-full px-4 py-3 border-2 border-[#004c6f] rounded-lg focus:outline-none focus:border-[#003a52] focus:ring-2 focus:ring-[#004c6f] focus:ring-opacity-30"
                disabled={isLoading}
                autoFocus
              />
            </div>

            {/* 錯誤訊息 */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700 font-semibold text-sm">{error}</p>
              </div>
            )}

            {/* 提交按鈕 */}
            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full bg-[#004c6f] text-white py-3 rounded-lg font-bold hover:bg-[#003a52] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '驗證中...' : '進入內部版'}
            </button>
          </form>

          {/* 提示信息 */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 提示：內部同事應已獲得訪問密碼。如無密碼，請聯繫管理員。
            </p>
          </div>
        </div>

        {/* 回首頁按鈕 */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-white text-[#004c6f] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            返回首頁
          </Link>
        </div>
      </div>
    </div>
  );
}
