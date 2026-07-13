import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { htmlContent, filename } = await request.json();

    if (!htmlContent) {
      return NextResponse.json(
        { error: 'HTML content required' },
        { status: 400 }
      );
    }

    let browser;

    try {
      if (process.env.VERCEL) {
        // Vercel 環境：使用輕量級 Chromium
        browser = await puppeteer.launch({
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
        });
      } else {
        // 本地開發環境
        browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
      }

      const page = await browser.newPage();

      // 設定視口大小（橫向 A4）
      await page.setViewport({ width: 1200, height: 800 });

      // 設定 HTML 內容
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle2',
        timeout: 10000,
      });

      // 等待圖片載入
      try {
        await page.waitForFunction(
          () => {
            const images = Array.from(document.querySelectorAll('img'));
            return images.every(img => (img as HTMLImageElement).complete);
          },
          { timeout: 5000 }
        );
      } catch (e) {
        console.warn('Image loading timeout, continuing anyway');
      }

      // 生成 PDF
      const pdf = await page.pdf({
        format: 'A4',
        landscape: true,
        margin: {
          top: '10mm',
          right: '10mm',
          bottom: '10mm',
          left: '10mm',
        },
        printBackground: true,
      });

      await browser.close();

      // 返回 PDF 檔案
      return new NextResponse(pdf, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}.pdf"`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    } catch (error) {
      if (browser) {
        try {
          await browser.close();
        } catch (e) {
          console.error('Error closing browser:', e);
        }
      }
      throw error;
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      {
        error: 'PDF 生成失敗',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
