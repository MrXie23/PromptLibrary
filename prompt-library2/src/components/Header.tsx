"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // 检查用户系统偏好
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          Prompt<span>Library</span>
        </Link>
        <div className="nav-links">
          <Link href="/" className={pathname === '/' ? 'active' : ''}>
            首页
          </Link>
          <Link href="/categories" className={pathname === '/categories' ? 'active' : ''}>
            分类
          </Link>
          <Link href="/popular" className={pathname === '/popular' ? 'active' : ''}>
            热门
          </Link>
          <Link href="/about" className={pathname === '/about' ? 'active' : ''}>
            关于
          </Link>
        </div>
        <div className="nav-actions">
          <button className="search-btn">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          <button className="theme-toggle" onClick={toggleTheme}>
            <i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
        </div>
      </nav>
    </header>
  );
}