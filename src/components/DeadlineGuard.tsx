'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAfterDeadline } from '@/lib/deadlineCheck';

export default function DeadlineGuard() {
  const router = useRouter();

  useEffect(() => {
    // 檢查是否超過結單日期
    if (isAfterDeadline()) {
      // 重定向到關閉頁面
      router.replace('/closed');
    }
  }, [router]);

  return null;
}
