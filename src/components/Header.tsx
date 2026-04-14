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
    <header className="sticky top-0 bg-white border-b border-gray-200 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 主導航欄 */}
        <div className="flex justify-between items-center py-4">
          {/* Logo 和站名 */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img
              src={logoUrl}
              alt="Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-gray-900 hidden sm:inline">
              {siteName}
            </span>
          </Link>

          {/* 桌面導航 */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/products"
              className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
            >
              商品目錄
            </Link>
            <Link
              href="/search"
              className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
            >
              搜尋
            </Link>
            <Link
              href="/"
              className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
            >
              關於
            </Link>
          </div>

          {/* 手機菜單按鈕 */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
          <div className="md:hidden border-t border-gray-200 py-4 space-y-3">
            <Link
              href="/products"
              className="block text-gray-700 hover:text-indigo-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              商品目錄
            </Link>
            <Link
              href="/search"
              className="block text-gray-700 hover:text-indigo-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              搜尋
            </Link>
            <Link
              href="/"
              className="block text-gray-700 hover:text-indigo-600 transition-colors py-2"
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
