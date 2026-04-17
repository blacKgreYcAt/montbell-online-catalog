'use client';

import { useState, useEffect } from 'react';
import { ORDER_DEADLINE } from '@/lib/constants';

export default function OrderDeadlineModal() {
  const [daysLeft, setDaysLeft] = useState(0);
  const [hoursLeft, setHoursLeft] = useState(0);
  const [minutesLeft, setMinutesLeft] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = ORDER_DEADLINE.getTime() - now.getTime();

      if (diff <= 0) {
        setDaysLeft(0);
        setHoursLeft(0);
        setMinutesLeft(0);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setDaysLeft(days);
      setHoursLeft(hours);
      setMinutesLeft(minutes);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-gradient-to-br from-white via-blue-50 to-white rounded-2xl shadow-2xl overflow-hidden border-2 border-[#004c6f]/10">
          <div className="h-1 bg-gradient-to-r from-[#004c6f] via-[#7697B8] to-[#004c6f]" />

          <div className="p-8 md:p-12">
            {/* 品牌標題 */}
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <span className="text-5xl">📍</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#004c6f] mb-2">
                SS27 展示會
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-[#004c6f] to-[#7697B8] mx-auto rounded-full" />
            </div>

            {/* 倒數計時器 */}
            <div className="mb-12">
              <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
                {/* 天數 */}
                <div className="flex flex-col items-center">
                  <div className="relative w-full aspect-square max-w-[120px] mx-auto mb-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#004c6f] to-[#003052] rounded-lg shadow-lg flex items-center justify-center overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                      <div className="absolute inset-0 bg-gradient-to-b from-[#7697B8] to-[#004c6f] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <span className="text-5xl md:text-6xl font-bold text-white relative z-10 font-mono tabular-nums">
                        {String(daysLeft).padStart(2, '0')}
                      </span>

                      <div className="absolute inset-0 bg-white/5 mix-blend-overlay rounded-lg" />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#004c6f] uppercase tracking-widest">
                    天
                  </span>
                </div>

                {/* 小時 */}
                <div className="flex flex-col items-center">
                  <div className="relative w-full aspect-square max-w-[120px] mx-auto mb-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#7697B8] to-[#004c6f] rounded-lg shadow-lg flex items-center justify-center overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                      <div className="absolute inset-0 bg-gradient-to-b from-[#004c6f] to-[#003052] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <span className="text-5xl md:text-6xl font-bold text-white relative z-10 font-mono tabular-nums">
                        {String(hoursLeft).padStart(2, '0')}
                      </span>

                      <div className="absolute inset-0 bg-white/5 mix-blend-overlay rounded-lg" />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#004c6f] uppercase tracking-widest">
                    時
                  </span>
                </div>

                {/* 分鐘 */}
                <div className="flex flex-col items-center">
                  <div className="relative w-full aspect-square max-w-[120px] mx-auto mb-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#004c6f] to-[#003052] rounded-lg shadow-lg flex items-center justify-center overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                      <div className="absolute inset-0 bg-gradient-to-b from-[#7697B8] to-[#004c6f] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <span className="text-5xl md:text-6xl font-bold text-white relative z-10 font-mono tabular-nums">
                        {String(minutesLeft).padStart(2, '0')}
                      </span>

                      <div className="absolute inset-0 bg-white/5 mix-blend-overlay rounded-lg" />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#004c6f] uppercase tracking-widest">
                    分
                  </span>
                </div>
              </div>

              {/* 結單日期 */}
              <div className="text-center">
                <p className="text-lg font-semibold text-[#004c6f]">
                  結單日期：2026 年 5 月 1 日
                </p>
              </div>
            </div>

            {/* 提醒文案 */}
            <div className="bg-gradient-to-r from-[#f0f5ff] to-blue-50 border-l-4 border-[#004c6f] p-6 rounded-lg mb-8">
              <div className="flex gap-4">
                <span className="text-3xl flex-shrink-0">⏰</span>
                <div>
                  <p className="text-[#004c6f] font-bold text-lg mb-2">
                    本次 SS27 展示會
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    結單日為 <span className="font-bold text-[#004c6f]">2026 年 5 月 1 日</span>。
                    網站將在結單日後自動關閉，請準時提交訂單。
                  </p>
                </div>
              </div>
            </div>

            {/* 操作按鈕 */}
            <div className="flex gap-4">
              <button
                onClick={() => setIsVisible(false)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#004c6f] to-[#003052] text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
              >
                進入網站
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="px-6 py-3 border-2 border-[#004c6f] text-[#004c6f] font-bold rounded-lg hover:bg-[#f0f5ff] transition-all duration-300"
              >
                稍後提醒
              </button>
            </div>
          </div>

          <div className="h-1 bg-gradient-to-r from-[#004c6f] via-[#7697B8] to-[#004c6f]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        div:has(> div:first-child) {
          animation: slideInDown 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
