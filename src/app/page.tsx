import Link from "next/link";
import { BrandHero } from "@/components";
import OrderDeadlineModal from "@/components/OrderDeadlineModal";

export default function Home() {
  return (
    <>
      {/* 結單倒數提醒 */}
      <OrderDeadlineModal />

      <div className="space-y-12">
        {/* 展示會提示 */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-amber-900 mb-2">
            FW27 展示會
          </h2>
          <p className="text-lg text-amber-800 font-semibold mb-2">
            結單日期：2026 年 6 月 29 日
          </p>
          <p className="text-amber-700">
            本次 FW27 展示會結單日為 2026 年 6 月 29 日。網站將在結單日後自動關閉，請準時提交訂單。
          </p>
        </div>

        {/* 品牌焦點區 */}
        <BrandHero
          title="Montbell Online Catalog"
          subtitle="經銷商限定展示會商品線上目錄"
          description=""
          ctaText="瀏覽商品目錄"
          ctaHref="/public/products"
        />

        {/* 版本選擇 */}
        <section className="bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-[#004c6f] mb-8 text-center">選擇瀏覽方式</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* 公開版 */}
            <Link
              href="/public/products"
              className="group relative p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-[#7697B8] hover:border-[#004c6f] hover:shadow-xl transition-all"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">📂</div>
                <h3 className="font-bold text-xl text-[#004c6f] mb-2">查看公開商品</h3>
                <p className="text-sm text-gray-600 mb-4">
                  適合經銷商查看可對外銷售的商品
                </p>
                <div className="text-xs text-gray-500 font-semibold">
                  點擊進入 →
                </div>
              </div>
            </Link>

            {/* 內部版 */}
            <Link
              href="/internal/auth"
              className="group relative p-8 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border-2 border-[#c39d6f] hover:border-[#004c6f] hover:shadow-xl transition-all"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="font-bold text-xl text-[#004c6f] mb-2">進入內部版</h3>
                <p className="text-sm text-gray-600 mb-4">
                  內部同事查看 FW27 新品（需要密碼）
                </p>
                <div className="text-xs text-gray-500 font-semibold">
                  需要密碼 →
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* 快速導航 */}
        <section className="bg-[#f0f5ff] rounded-lg p-8 border-2 border-[#7697B8]">
          <h2 className="text-2xl font-bold text-[#004c6f] mb-6">快速導航</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/public/products"
              className="p-4 border-2 border-[#004c6f] rounded-lg hover:bg-[#004c6f] hover:text-white transition-colors text-[#004c6f] font-semibold"
            >
              → 查看所有商品
            </Link>
            <Link
              href="/public/search"
              className="p-4 border-2 border-[#004c6f] rounded-lg hover:bg-[#004c6f] hover:text-white transition-colors text-[#004c6f] font-semibold"
            >
              → 搜尋商品
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
