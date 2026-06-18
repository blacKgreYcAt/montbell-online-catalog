export default function ClosedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
      <div className="max-w-md text-center space-y-8">
        {/* 關閉圖標 */}
        <div className="text-6xl">🔒</div>

        {/* 標題 */}
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
          現在非 FW27 展示會線上目錄公開期間
        </h1>

        {/* 說明文字 */}
        <div className="space-y-4 text-gray-700">
          <p>
            感謝您參與本次 Montbell 展示會。
          </p>
          <p>
            本次展示會已結束，線上商品工作本網站已關閉。
          </p>
        </div>

        {/* 結單日期提示 */}
        <div className="bg-red-100 border border-red-300 rounded-lg p-6 space-y-2">
          <p className="text-sm font-semibold text-red-800">
            結單日期：2026 年 6 月 29 日
          </p>
          <p className="text-xs text-red-700">
            展示會已於此日期結束，如有任何疑問，請聯繫所屬業務窗口。
          </p>
        </div>

        {/* 品牌標誌 */}
        <div className="pt-4 text-2xl text-gray-400">
          Montbell
        </div>
      </div>
    </div>
  );
}
