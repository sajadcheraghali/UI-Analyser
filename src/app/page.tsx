'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">خوش آمدید 👋</h1>

      <Link
        href="/analyse"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition duration-300"
      >
        برای ارزیابی کلیک کنید
      </Link>
    </main>
  );
}

