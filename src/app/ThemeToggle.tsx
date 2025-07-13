'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (saved === 'dark' || (!saved && systemPrefersDark)) {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    const body = document.body;
    if (newTheme === 'dark') {
      body.classList.add('bg-gray-900', 'text-white');
      body.classList.remove('bg-white', 'text-black');
    } else {
      body.classList.add('bg-white', 'text-black');
      body.classList.remove('bg-gray-900', 'text-white');
    }
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="ml-4 p-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      aria-label="تغییر تم"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
