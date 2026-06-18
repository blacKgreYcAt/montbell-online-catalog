export default function ClosedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
      <div className="max-w-md text-center space-y-6">
        {/* 關閉圖標 */}
        <div className="text-6xl">🔒</div>

        {/* 標題 */}
        <h1 className="text-3xl font-bold text-gray-900">
          現在非 FW27 展示會線上目錄公開期間
        </h1>

        {/* 說明文字 */}
        <p className="text-lg text-gray-600">
          感謝您對蒙貝爾展示會線上目錄的關注。本次展示會已結束，網站已關閉。
        </p>

        {/* 結單日期提示 */}
        <div className="bg-red-100 border border-red-300 rounded-lg p-4">
          <p className="text-sm text-red-700">
            <span className="font-semibold">結單日期：</span>2026 年 6 月 29 日
          </p>
          <p className="text-xs text-red-600 mt-2">
            展示會已於此日期結束，所有商品信息已被封存。
          </p>
        </div>

        {/* 聯繫方式 */}
        <div className="text-sm text-gray-500">
          <p>如有任何疑問，請聯繫蒙貝爾經銷商部門。</p>
        </div>

        {/* 品牌標誌 */}
        <div className="pt-4 text-2xl text-gray-400">
          Montbell
        </div>
      </div>
    </div>
  );
}
