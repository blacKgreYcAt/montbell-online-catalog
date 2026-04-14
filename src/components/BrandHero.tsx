'use client';

import Link from 'next/link';

interface BrandHeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function BrandHero({
  title = '蒙貝爾線上商品目錄',
  subtitle = '探索戶外的世界',
  description = '超過 1000 件高品質戶外裝備與服裝',
  backgroundImage,
  ctaText = '開始瀏覽',
  ctaHref = '/products',
}: BrandHeroProps) {
  return (
    <section
      className="relative py-16 md:py-24 overflow-hidden rounded-2xl"
      style={{
        backgroundImage: backgroundImage
          ? `url('${backgroundImage}')`
          : 'linear-gradient(135deg, #004c6f 0%, #1a6fa0 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* 深色遮罩 */}
      <div className="absolute inset-0 bg-black/30" />

      {/* 內容 */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        {/* 小標題 */}
        {subtitle && (
          <div className="mb-4 flex items-center gap-2">
            <div className="h-1 w-8 bg-[#c39d6f]" />
            <p className="text-sm md:text-base font-bold uppercase tracking-widest opacity-95">
              {subtitle}
            </p>
          </div>
        )}

        {/* 主標題 */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
          {title}
        </h1>

        {/* 描述 */}
        {description && (
          <p className="text-lg md:text-xl opacity-95 mb-8 max-w-2xl">
            {description}
          </p>
        )}

        {/* CTA 按鈕 */}
        <div className="flex flex-wrap gap-4">
          <Link
            href={ctaHref}
            className="inline-flex px-8 py-3 bg-[#c39d6f] text-[#004c6f] font-bold rounded-lg hover:bg-white transition-colors shadow-lg"
          >
            {ctaText}
          </Link>
          <Link
            href="/"
            className="inline-flex px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/20 transition-colors"
          >
            了解更多
          </Link>
        </div>

        {/* 統計信息 */}
        <div className="mt-12 pt-8 border-t border-white/20 grid grid-cols-3 gap-8">
          <div>
            <p className="text-3xl font-bold">1000+</p>
            <p className="text-sm opacity-75">商品款式</p>
          </div>
          <div>
            <p className="text-3xl font-bold">100%</p>
            <p className="text-sm opacity-75">品質保證</p>
          </div>
          <div>
            <p className="text-3xl font-bold">24h</p>
            <p className="text-sm opacity-75">快速查詢</p>
          </div>
        </div>
      </div>
    </section>
  );
}
