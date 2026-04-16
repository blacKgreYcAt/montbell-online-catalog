import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { BrandHero } from "@/components";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* 品牌焦點區 */}
      <BrandHero
        title="Montbell Online Catalog"
        subtitle="經銷商限定展示會商品線上目錄"
        description=""
        ctaText="瀏覽商品目錄"
        ctaHref="/products"
      />


      {/* 快速導航 */}
      <section className="bg-[#f0f5ff] rounded-lg p-8 border-2 border-[#7697B8]">
        <h2 className="text-2xl font-bold text-[#004c6f] mb-6">快速導航</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/products"
            className="p-4 border-2 border-[#004c6f] rounded-lg hover:bg-[#004c6f] hover:text-white transition-colors text-[#004c6f] font-semibold"
          >
            → 查看所有商品
          </Link>
          <Link
            href="/search"
            className="p-4 border-2 border-[#004c6f] rounded-lg hover:bg-[#004c6f] hover:text-white transition-colors text-[#004c6f] font-semibold"
          >
            → 搜尋商品
          </Link>
        </div>
      </section>
    </div>
  );
}
