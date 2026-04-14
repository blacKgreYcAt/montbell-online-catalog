'use client';

import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

interface FooterProps {
  companyName?: string;
  links?: Array<{
    label: string;
    href: string;
  }>;
}

export default function Footer({
  companyName = 'Montbell',
  links = [
    { label: '商品目錄', href: '/products' },
    { label: '搜尋', href: '/search' },
    { label: '首頁', href: '/' },
  ],
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#004c6f] text-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* 品牌信息 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">{companyName}</h3>
            <p className="text-sm text-gray-300">
              線上商品目錄提供完整的產品信息與搜尋功能，探索蒙貝爾的優質戶外產品。
            </p>
          </div>

          {/* 快速連結 */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">快速連結</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-[#c39d6f] transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 聯繫方式 */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">聯繫我們</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📧 contact@montbell.com</li>
              <li>📞 +886-2-xxxx-xxxx</li>
              <li>📍 台灣台北市</li>
            </ul>
          </div>

          {/* 社群媒體 */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">追蹤我們</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors text-lg"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors text-lg"
                aria-label="Instagram"
              >
                📷
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors text-lg"
                aria-label="Twitter"
              >
                𝕏
              </a>
            </div>
          </div>
        </div>

        {/* 分割線 */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* 版權信息 */}
            <p className="text-sm text-gray-400">
              &copy; {currentYear} {companyName}. All rights reserved.
            </p>

            {/* 法律連結 */}
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="#" className="hover:text-white transition-colors">
                隱私政策
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                服務條款
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Cookie 設定
              </Link>
            </div>
          </div>
        </div>

        {/* 開發者信息 */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>
            Built with ❤️ using Next.js • Powered by{' '}
            <span className="text-gray-400">Vercel</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
