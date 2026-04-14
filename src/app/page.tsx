import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { BrandHero } from "@/components";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* 品牌焦點區 */}
      <BrandHero
        title={SITE_NAME}
        subtitle="探索戶外的世界"
        description="超過 1000 件高品質戶外裝備與服裝，一站式購物體驗"
        ctaText="瀏覽商品目錄"
        ctaHref="/products"
      />

      {/* 功能介紹 */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">全球搜尋</h2>
          <p className="text-gray-600">
            快速搜尋型號、產品名稱和規格。實時搜尋結果。
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            分類篩選
          </h2>
          <p className="text-gray-600">
            按產品分類瀏覽，輕鬆找到您需要的商品。
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            完整詳情
          </h2>
          <p className="text-gray-600">
            查看詳細的商品規格、顏色選項和圖片。
          </p>
        </div>
      </section>

      {/* 快速導航 */}
      <section className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">快速導航</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/products"
            className="p-4 border rounded-lg hover:bg-white transition-colors text-gray-900 font-semibold"
          >
            → 查看所有商品
          </Link>
          <Link
            href="/search"
            className="p-4 border rounded-lg hover:bg-white transition-colors text-gray-900 font-semibold"
          >
            → 搜尋商品
          </Link>
        </div>
      </section>
    </div>
  );
}
