'use client';

import Link from 'next/link';
import { useState } from 'react';
import SearchBar from './SearchBar';

interface HeaderProps {
  logoUrl?: string;
  siteName?: string;
  showSearchBar?: boolean;
}

export default function Header({
  logoUrl = '/next.svg',
  siteName = 'Mont-Bell Online',
  showSearchBar = false,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-white border-b-4 border-[#004c6f] z-40 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 主導航欄 */}
        <div className="flex justify-between items-center py-3">
          {/* Logo 和站名 */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img
              src={logoUrl}
              alt="Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-lg font-bold text-[#004c6f] hidden sm:inline">
              {siteName}
            </span>
          </Link>

          {/* 桌面導航 */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/products"
              className="text-[#004c6f] hover:text-[#7697B8] font-semibold transition-colors border-b-2 border-transparent hover:border-[#004c6f]"
            >
              商品目錄
            </Link>
            <Link
              href="/search"
              className="text-[#004c6f] hover:text-[#7697B8] font-semibold transition-colors border-b-2 border-transparent hover:border-[#004c6f]"
            >
              搜尋
            </Link>
            <Link
              href="/"
              className="text-[#004c6f] hover:text-[#7697B8] font-semibold transition-colors border-b-2 border-transparent hover:border-[#004c6f]"
            >
              關於
            </Link>
          </div>

          {/* 手機菜單按鈕 */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-3 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="切換菜單"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* 搜尋欄（如果啟用） */}
        {showSearchBar && (
          <div className="pb-4 hidden md:block">
            <SearchBar />
          </div>
        )}

        {/* 手機菜單 */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-2 border-[#004c6f] py-4 space-y-1 bg-gray-50">
            <Link
              href="/products"
              className="block text-[#004c6f] hover:text-[#7697B8] font-semibold py-3 px-4 border-l-4 border-transparent hover:border-[#004c6f] active:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              商品目錄
            </Link>
            <Link
              href="/search"
              className="block text-[#004c6f] hover:text-[#7697B8] font-semibold py-3 px-4 border-l-4 border-transparent hover:border-[#004c6f] active:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              搜尋
            </Link>
            <Link
              href="/"
              className="block text-[#004c6f] hover:text-[#7697B8] font-semibold py-3 px-4 border-l-4 border-transparent hover:border-[#004c6f] active:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              關於
            </Link>
            {showSearchBar && (
              <div className="pt-2 border-t border-gray-200">
                <SearchBar />
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
