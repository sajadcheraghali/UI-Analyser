// // اگر TypeScript استفاده می‌کنی: route.ts
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
//   try {
//     const { url } = await req.json();

//     if (!url) {
//       return NextResponse.json({ message: 'URL is required' }, { status: 400 });
//     }

//     const analysisResult = simulateSiteAnalysis(url);

//     return NextResponse.json(analysisResult);
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       return NextResponse.json({ message: error.message }, { status: 500 });
//     } else {
//       return NextResponse.json({ message: 'Unknown error occurred' }, { status: 500 });
//     }
//   }
// }

// // تابع شبیه‌سازی تحلیل سایت
// function simulateSiteAnalysis(url: string) {
//   const loadTime = Math.floor(Math.random() * 4900) + 100;
//   const requestCount = Math.floor(Math.random() * 145) + 5;
//   const pageSize = Math.floor(Math.random() * 4950) + 50;
//   const domSize = Math.floor(Math.random() * 4900) + 100;
//   const accessibilityScore = Math.floor(Math.random() * 100);
//   const responsiveScore = Math.floor(Math.random() * 100);

//   const getRating = (value: number, goodThreshold: number, averageThreshold: number) => {
//     if (value <= goodThreshold) return 'good';
//     if (value <= averageThreshold) return 'average';
//     return 'poor';
//   };

//   return {
//     url,
//     loadTime,
//     loadTimeRating: getRating(loadTime, 1000, 3000),
//     requestCount,
//     requestCountRating: getRating(requestCount, 30, 80),
//     pageSize,
//     pageSizeRating: getRating(pageSize, 500, 2000),
//     domSize,
//     domSizeRating: getRating(domSize, 1000, 3000),
//     accessibilityScore,
//     accessibilityRating: getRating(100 - accessibilityScore, 20, 50),
//     responsiveScore,
//     responsiveRating: getRating(100 - responsiveScore, 20, 50),
//     analyzedAt: new Date().toISOString(),
//   };
// }

import puppeteer from 'puppeteer';

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return Response.json({ message: 'URL is required' }, { status: 400 });
    }

    const analysisResult = await analyzeSite(url);
    return Response.json(analysisResult);
  } catch (error) {
    console.error('Error analyzing site:', error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}

async function analyzeSite(url) {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // مسیر کروم در ویندوز
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  );

  const startTime = Date.now();
  try {
    await page.goto(url.startsWith('http') ? url : `https://${url}`, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });
  } catch (err) {
    console.warn('Navigation timeout:', err);
  }
  const loadTime = Date.now() - startTime;

  const metrics = await page.metrics();
  const requestCount =
    (await page.evaluate(
      () => window.performance.getEntriesByType('resource').length
    )) || 0;

  const pageSize = await page.evaluate(() => {
    let total = 0;
    document.querySelectorAll('*').forEach((el) => {
      const html = el.outerHTML;
      total += new Blob([html]).size;
    });
    return total / 1024;
  });

  const domSize = await page.evaluate(
    () => document.getElementsByTagName('*').length
  );

  const accessibilityScore = await analyzeAccessibility(page);
  const responsiveScore = await analyzeResponsiveness(page);

  await browser.close();

  const getRating = (value, goodThreshold, averageThreshold) => {
    if (value <= goodThreshold) return 'good';
    if (value <= averageThreshold) return 'average';
    return 'poor';
  };

  return {
    url,
    loadTime,
    loadTimeRating: getRating(loadTime, 1000, 3000),
    requestCount,
    requestCountRating: getRating(requestCount, 30, 80),
    pageSize: Math.round(pageSize),
    pageSizeRating: getRating(pageSize, 500, 2000),
    domSize,
    domSizeRating: getRating(domSize, 1000, 3000),
    accessibilityScore,
    accessibilityRating: getRating(100 - accessibilityScore, 20, 50),
    responsiveScore,
    responsiveRating: getRating(100 - responsiveScore, 20, 50),
    analyzedAt: new Date().toISOString(),
    metrics: {
      jsHeapUsedSize: metrics.JSHeapUsedSize,
      scriptDuration: metrics.ScriptDuration,
      layoutDuration: metrics.LayoutDuration,
    },
  };
}

async function analyzeAccessibility(page) {
  let score = 100;

  const imagesWithoutAlt = await page.$$eval(
    'img',
    (imgs) => imgs.filter((img) => !img.alt).length
  );
  score -= imagesWithoutAlt * 2;

  const hasTitle = await page.$eval(
    'title',
    (el) => !!el.textContent.trim()
  ).catch(() => false);
  if (!hasTitle) score -= 10;

  const headings = await page.$$eval(
    'h1, h2, h3, h4, h5, h6',
    (hs) => hs.length
  );
  if (headings < 3) score -= 5;

  const lowContrastElements = await page.$$eval('*', (elements) => {
    return elements.filter((el) => {
      const style = window.getComputedStyle(el);
      const color = style.color;
      const bgColor = style.backgroundColor;
      return color && bgColor && color === bgColor;
    }).length;
  });
  score -= Math.min(30, lowContrastElements * 0.5);

  return Math.max(0, Math.round(score));
}

async function analyzeResponsiveness(page) {
  let score = 80;

  const hasViewport = await page.$('meta[name="viewport"]');
  if (!hasViewport) score -= 15;

  const fixedWidthElements = await page.$$eval('*', (elements) => {
    return elements.filter((el) => {
      const style = window.getComputedStyle(el);
      return (
        style.width &&
        !style.width.endsWith('%') &&
        !style.width.endsWith('vw')
      );
    }).length;
  });
  score -= Math.min(20, fixedWidthElements / 50);

  const mediaQueries = await page.evaluate(() => {
    return Array.from(document.styleSheets).reduce((count, sheet) => {
      try {
        return count +
          (sheet.cssRules
            ? Array.from(sheet.cssRules).filter((r) => r.media).length
            : 0);
      } catch (e) {
        console.log(e)
        return count;
      }
    }, 0);
  });
  score += Math.min(10, mediaQueries);

  return Math.max(0, Math.min(100, Math.round(score)));
}
