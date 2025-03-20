"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // 检查用户系统偏好
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);

    // 检测是否为移动设备
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // 初始检查
    checkIfMobile();

    // 添加窗口大小变化监听
    window.addEventListener('resize', checkIfMobile);

    // 清除监听器
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // 禁止/允许背景滚动
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const handleSearchClick = () => {
    router.push('/search');
    if (mobileMenuOpen) {
      toggleMobileMenu();
    }
  };

  const handleNavLinkClick = () => {
    if (mobileMenuOpen) {
      toggleMobileMenu();
    }
  };

  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          Prompt<span>Library</span>
        </Link>
        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link
            href="/"
            className={pathname === '/' || pathname === '/PromptLibrary/' ? 'active' : ''}
            onClick={handleNavLinkClick}
          >
            首页
          </Link>
          <Link
            href="/categories"
            className={pathname === '/categories' || pathname === '/PromptLibrary/categories' ? 'active' : ''}
            onClick={handleNavLinkClick}
          >
            分类
          </Link>
          <Link
            href="/prompts/popular"
            className={pathname === '/prompts/popular' || pathname === '/PromptLibrary/prompts/popular' ? 'active' : ''}
            onClick={handleNavLinkClick}
          >
            热门
          </Link>
          <Link
            href="/about"
            className={pathname === '/about' || pathname === '/PromptLibrary/about' ? 'active' : ''}
            onClick={handleNavLinkClick}
          >
            关于
          </Link>
        </div>
        <div className="nav-actions">
          <button onClick={handleSearchClick} className="search-btn">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          <button className="theme-toggle" onClick={toggleTheme}>
            <i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
          {isMobile && (
            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}