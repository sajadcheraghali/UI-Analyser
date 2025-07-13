'use client';

import { useState } from 'react';
import UrlInput from '../components/UrlInput';
import AnalysisResult from '../components/AnalysisResult';
import Head from 'next/head';

export default function AnalysePage() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (url: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('تحلیل سایت با مشکل مواجه شد');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      setError(err.message || 'خطای ناشناخته');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>تحلیلگر UI سایت</title>
        <meta name="description" content="ابزار تحلیل رابط کاربری وبسایت‌ها" />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50 text-center">
        <div className="w-full max-w-2xl bg-white shadow-md rounded-xl p-6 md:p-10">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4">تحلیلگر UI سایت</h1>
          <p className="text-gray-700 mb-6">آدرس سایت را وارد کنید تا معیارهای UI آن را بررسی کنیم</p>

          <UrlInput onAnalyze={handleAnalyze} loading={loading} />

          {error && (
            <div className="mt-4 text-red-600 bg-red-100 border border-red-300 p-3 rounded-md">
              {error}
            </div>
          )}

          {analysis && (
            <div className="mt-6">
              <AnalysisResult data={analysis} />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
