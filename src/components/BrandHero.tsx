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
  title = 'Montbell Online Catalog',
  subtitle = '經銷商限定展示會商品線上目錄',
  description = '',
  backgroundImage,
  ctaText = '瀏覽商品目錄',
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
        </div>

      </div>
    </section>
  );
}
