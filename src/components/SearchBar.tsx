'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  initialValue?: string;
}

export default function SearchBar({
  placeholder = '搜尋型號、名稱、規格或頁碼...',
  onSearch,
  initialValue = '',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const router = useRouter();

  // 檢測是否為純數字（頁碼）
  const isPageNumberQuery = /^\d+$/.test(query.trim());

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (onSearch) {
        onSearch(query);
      } else {
        // 導向搜尋頁面
        const searchParams = new URLSearchParams({ q: query });
        router.push(`/search?${searchParams.toString()}`);
      }
    },
    [query, onSearch, router]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="input pl-4 pr-24 py-3 text-base h-12"
          aria-label="搜尋商品"
        />

        {/* 清除按鈕 */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded hover:bg-gray-100"
            aria-label="清除搜尋"
          >
            ✕
          </button>
        )}

        {/* 提交按鈕 */}
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#004c6f] text-white px-4 py-2 rounded hover:bg-[#003d56] transition-colors font-semibold h-10 w-10 flex items-center justify-center"
          aria-label="搜尋"
        >
          🔍
        </button>
      </div>

      {/* 快速提示 */}
      <div className="mt-2 text-xs text-gray-500">
        💡 提示：可搜尋型號、商品名稱、分類或頁碼
        {isPageNumberQuery && query.trim() && (
          <span className="ml-2 text-blue-600 font-semibold">
            📄 將搜尋頁碼 {query}
          </span>
        )}
      </div>
    </form>
  );
}
