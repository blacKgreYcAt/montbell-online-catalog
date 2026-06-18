'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAfterDeadline } from '@/lib/deadlineCheck';

export default function DeadlineWarning() {
  const router = useRouter();
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const expired = isAfterDeadline();
    setIsExpired(expired);

    if (expired) {
      // 延遲 1 秒後重定向到關閉頁面
      const timer = setTimeout(() => {
        router.replace('/closed');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [router]);

  // 如果未過期，不顯示任何內容
  if (!isExpired) {
    return null;
  }

  // 顯示臨時提示
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 text-center max-w-md mx-4">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          展示會已結束
        </h2>
        <p className="text-gray-600">
          正在重定向到關閉頁面...
        </p>
      </div>
    </div>
  );
}
