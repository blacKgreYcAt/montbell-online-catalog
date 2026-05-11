'use client';

import React, { ReactNode, ReactElement } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * 錯誤邊界組件
 * 捕捉子組件中的 JavaScript 錯誤，防止整個應用崩潰
 * 顯示友善的錯誤訊息而不是白屏
 */
export default class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): State {
    // 更新狀態使下次渲染會顯示後備 UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 記錄錯誤信息到控制台
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render(): ReactElement {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <h1 className="text-6xl mb-4">⚠️</h1>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                出現問題
              </h2>
              <p className="text-gray-600 mb-4">
                抱歉，頁面載入時發生了錯誤
              </p>
            </div>

            {this.state.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                <p className="text-sm font-mono text-red-700 break-words">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-[#004c6f] text-white font-semibold rounded-lg hover:bg-[#003d56] transition-colors"
              >
                重新載入頁面
              </button>
              <a
                href="/"
                className="block px-6 py-3 bg-white border-2 border-[#004c6f] text-[#004c6f] font-semibold rounded-lg hover:bg-[#f0f5ff] transition-colors"
              >
                返回首頁
              </a>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              如果問題持續，請聯繫我們的技術支援
            </p>
          </div>
        </div>
      );
    }

    return this.props.children as ReactElement;
  }
}
