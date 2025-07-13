'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import { useSession, signOut } from "next-auth/react";


const navItems = [
  { href: '/', label: 'خانه' },
  { href: '/analyse', label: 'ارزیابی UI' },
  { href: '/guide', label: 'راهنما' },
  { href: '/about', label: 'درباره‌ی ما' },
  { href: '/comments', label: 'نظر کاربران' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const userNavItem = session?.user ? (
    <>
      <li>
        <Link
          href="/profile"
          className={`transition duration-300 ease-in-out px-3 py-1 rounded-md ${
            pathname === '/profile'
              ? 'bg-white text-blue-600 font-semibold shadow-md'
              : 'text-white/80 hover:text-white'
          }`}
        >
          پروفایل
        </Link>
      </li>
      {session?.user?.role === "admin" && (
  <li>
    <Link
      href="/admin/users"
      className={`transition duration-300 ease-in-out px-3 py-1 rounded-md ${
        pathname === '/admin/users'
          ? 'bg-white text-blue-600 font-semibold shadow-md'
          : 'text-white/80 hover:text-white'
      }`}
    >
      مدیریت کاربران
    </Link>
  </li>
)}

      {session.user.name && (
        <li className="text-white/90 font-semibold flex items-center">
          <span className="ml-2">{session.user.name}</span>
        </li>
      )}
      <li>
        <button
          onClick={() => signOut()}
          className="px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white transition"
        >
          خروج
        </button>
      </li>
    </>
  ) : (
    <li>
      <Link
        href="/auth/login"
        className={`transition duration-300 ease-in-out px-3 py-1 rounded-md ${
          pathname === '/auth/login'
            ? 'bg-white text-blue-600 font-semibold shadow-md'
            : 'text-white/80 hover:text-white'
        }`}
      >
        ورود / ثبت نام
      </Link>
    </li>
  );

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-bold">UI Analyser</div>

        {/* Desktop nav */}
        <ul className="hidden md:flex space-x-6 items-center">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`transition duration-300 ease-in-out px-3 py-1 rounded-md ${
                    isActive
                      ? 'bg-white text-blue-600 font-semibold shadow-md'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
          {userNavItem}
        </ul>

        {/* <ThemeToggle /> */}

        {/* Hamburger menu button */}
        <button className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <ul className="md:hidden flex flex-col items-center bg-blue-700 py-4 space-y-3 animate-fadeIn">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={closeMenu}
                  className={`block text-lg px-4 py-2 rounded-md transition duration-200 ${
                    isActive
                      ? 'bg-white text-blue-600 font-semibold'
                      : 'text-white hover:underline'
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
          {session?.user && (
            <>
              <li>
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className={`block text-lg px-4 py-2 rounded-md transition duration-200 ${
                    pathname === '/profile'
                      ? 'bg-white text-blue-600 font-semibold'
                      : 'text-white hover:underline'
                  }`}
                >
                  پروفایل
                </Link>
              </li>
              {session.user.name && (
                <li className="text-white/90 font-semibold">
                  {session.user.name}
                </li>
              )}
            </>
          )}
          {session?.user?.role === "admin" && (
  <li>
    <Link
      href="/admin/users"
      onClick={closeMenu}
      className={`block text-lg px-4 py-2 rounded-md transition duration-200 ${
        pathname === '/admin/users'
          ? 'bg-white text-blue-600 font-semibold'
          : 'text-white hover:underline'
      }`}
    >
      مدیریت کاربران
    </Link>
  </li>
)}


          <li>
            {session?.user ? (
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-lg rounded-md bg-red-500 hover:bg-red-600 text-white transition"
              >
                خروج
              </button>
            ) : (
              <Link
                href="/auth/login"
                onClick={closeMenu}
                className={`block text-lg px-4 py-2 rounded-md transition duration-200 ${
                  pathname === '/auth/login'
                    ? 'bg-white text-blue-600 font-semibold'
                    : 'text-white hover:underline'
                }`}
              >
                ورود / ثبت نام
              </Link>
            )}
          </li>
        </ul>
      )}
    </nav>
  );
}