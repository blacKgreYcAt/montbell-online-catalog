#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Montbell CDN 圖片 URL 測試工具

此腳本用於：
1. 測試 Montbell CDN 圖片是否可用
2. 驗證 URL 模式是否正確
3. 從 products.json 批量測試所有商品圖片
4. 生成有效 URL 的測試報告

使用方式：
    python test_montbell_cdn.py [model_number] [color_code]

範例：
    python test_montbell_cdn.py 1128573 RBL
    python test_montbell_cdn.py --test-all
    python test_montbell_cdn.py --config
"""

import os
import sys
import json
import requests
import argparse
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from collections import defaultdict

# 配置常數
DEFAULT_BASE_URL = "https://image.montbell.com/product"
DEFAULT_PATTERN = "{model}_{color}.jpg"


@dataclass
class ImageUrlConfig:
    """圖片 URL 配置"""
    base_url: str
    pattern: str
    enabled: bool = True

    def generate_url(self, model_number: str, color_code: str) -> str:
        """生成圖片 URL"""
        model = str(model_number).zfill(7)
        color = color_code.upper()

        url_path = self.pattern.replace("{model}", model).replace("{color}", color)
        return f"{self.base_url}/{url_path}"


class MonbellCDNTester:
    """Montbell CDN 測試工具"""

    def __init__(self, config: Optional[ImageUrlConfig] = None):
        self.config = config or ImageUrlConfig(DEFAULT_BASE_URL, DEFAULT_PATTERN)
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        self.results = {
            'success': [],
            'failed': [],
            'errors': []
        }

    def verify_url(self, url: str) -> Tuple[bool, Optional[str]]:
        """驗證 URL 是否有效

        Returns:
            (is_valid, error_message)
        """
        try:
            response = self.session.head(url, timeout=5, allow_redirects=True)
            if response.status_code == 200:
                return True, None
            else:
                return False, f"HTTP {response.status_code}"
        except requests.Timeout:
            return False, "Timeout"
        except requests.ConnectionError as e:
            return False, f"Connection Error: {str(e)}"
        except Exception as e:
            return False, f"Error: {str(e)}"

    def test_single(self, model_number: str, color_code: str) -> Dict:
        """測試單個商品的圖片 URL"""
        url = self.config.generate_url(model_number, color_code)
        is_valid, error = self.verify_url(url)

        result = {
            'model_number': model_number,
            'color_code': color_code,
            'url': url,
            'valid': is_valid,
            'error': error
        }

        if is_valid:
            self.results['success'].append(result)
        else:
            self.results['failed'].append(result)

        return result

    def test_batch_from_products(self, products_file: str, limit: Optional[int] = None) -> Dict:
        """從 products.json 批量測試

        Args:
            products_file: products.json 檔案路徑
            limit: 測試數量限制 (None = 全部)
        """
        if not os.path.exists(products_file):
            self.results['errors'].append(f"File not found: {products_file}")
            return self.results

        try:
            with open(products_file, 'r', encoding='utf-8') as f:
                products = json.load(f)
        except Exception as e:
            self.results['errors'].append(f"Failed to load products: {str(e)}")
            return self.results

        total = len(products)
        tested = 0

        print(f"\n開始批量測試 {total} 個商品...")
        print(f"{'進度':<6} | {'型號':<10} | {'顏色':<6} | {'狀態':<8} | {'詳情'}")
        print("-" * 70)

        for idx, product in enumerate(products, 1):
            if limit and idx > limit:
                break

            model = product.get('modelNumber', '')
            colors = product.get('colors', [])

            for color in colors[:1]:  # 只測試第一個顏色
                result = self.test_single(model, color)
                status = "✓ OK" if result['valid'] else "✗ FAIL"
                detail = result['error'] or ""

                progress = f"{idx}/{total}"
                print(f"{progress:<6} | {model:<10} | {color:<6} | {status:<8} | {detail}")
                tested += 1

        return self.results

    def generate_report(self, output_file: Optional[str] = None) -> str:
        """生成測試報告"""
        success_count = len(self.results['success'])
        failed_count = len(self.results['failed'])
        total = success_count + failed_count

        report = f"""
╔════════════════════════════════════════════════════════════════╗
║         Montbell CDN 圖片 URL 測試報告                         ║
╚════════════════════════════════════════════════════════════════╝

【配置信息】
基礎 URL：{self.config.base_url}
URL 模式：{self.config.pattern}

【測試結果統計】
總測試數：{total}
✓ 成功：{success_count} ({success_count/total*100:.1f}% if total > 0 else 0%)
✗ 失敗：{failed_count} ({failed_count/total*100:.1f}% if total > 0 else 0%)
⚠ 錯誤：{len(self.results['errors'])}

"""

        if self.results['success']:
            report += "【成功的 URL 範例】\n"
            for item in self.results['success'][:5]:
                report += f"  {item['model_number']} ({item['color_code']})\n"
                report += f"  → {item['url']}\n\n"

        if self.results['failed']:
            report += "【失敗的 URL 範例】\n"
            for item in self.results['failed'][:5]:
                report += f"  {item['model_number']} ({item['color_code']})\n"
                report += f"  → {item['url']}\n"
                report += f"  ✗ {item['error']}\n\n"

        if self.results['errors']:
            report += "【錯誤信息】\n"
            for error in self.results['errors']:
                report += f"  ⚠ {error}\n"

        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(report)
            print(f"\n報告已保存至：{output_file}")

        return report


def load_env_config() -> ImageUrlConfig:
    """從環境變數載入配置"""
    base_url = os.getenv('MONTBELL_CDN_URL', DEFAULT_BASE_URL)
    pattern = os.getenv('MONTBELL_URL_PATTERN', DEFAULT_PATTERN)
    enabled = os.getenv('MONTBELL_CDN_ENABLED', 'true').lower() == 'true'

    return ImageUrlConfig(base_url, pattern, enabled)


def main():
    """主程式"""
    parser = argparse.ArgumentParser(
        description='Montbell CDN 圖片 URL 測試工具',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
範例用法：
  # 測試單個商品
  python test_montbell_cdn.py 1128573 RBL

  # 批量測試所有商品 (前 100 個)
  python test_montbell_cdn.py --test-all --limit 100

  # 測試自訂配置
  python test_montbell_cdn.py \\
    --base-url "https://example.com/images" \\
    --pattern "{model}-{color}.jpg" \\
    1128573 RBL

  # 顯示目前配置
  python test_montbell_cdn.py --config
        """
    )

    parser.add_argument('model', nargs='?', help='商品型號')
    parser.add_argument('color', nargs='?', help='顏色代碼')
    parser.add_argument('--test-all', action='store_true', help='批量測試所有商品')
    parser.add_argument('--limit', type=int, help='測試數量限制')
    parser.add_argument('--products', default='public/products.json', help='products.json 路徑')
    parser.add_argument('--output', help='報告輸出檔案')
    parser.add_argument('--config', action='store_true', help='顯示目前配置')
    parser.add_argument('--base-url', help='自訂基礎 URL')
    parser.add_argument('--pattern', help='自訂 URL 模式')

    args = parser.parse_args()

    # 載入配置
    config = load_env_config()

    # 覆蓋自訂配置
    if args.base_url:
        config.base_url = args.base_url
    if args.pattern:
        config.pattern = args.pattern

    # 顯示配置
    if args.config:
        print(f"\n【目前配置】")
        print(f"基礎 URL：{config.base_url}")
        print(f"URL 模式：{config.pattern}")
        print(f"已啟用：{config.enabled}\n")
        return

    # 初始化測試工具
    tester = MonbellCDNTester(config)

    # 執行測試
    if args.test_all:
        tester.test_batch_from_products(args.products, args.limit)
    elif args.model and args.color:
        result = tester.test_single(args.model, args.color)
        print(f"\n測試結果：")
        print(f"型號：{result['model_number']}")
        print(f"顏色：{result['color_code']}")
        print(f"URL：{result['url']}")
        print(f"狀態：{'✓ 有效' if result['valid'] else '✗ 無效'}")
        if result['error']:
            print(f"錯誤：{result['error']}")
    else:
        parser.print_help()
        return

    # 輸出報告
    report = tester.generate_report(args.output)
    print(report)


if __name__ == '__main__':
    main()
