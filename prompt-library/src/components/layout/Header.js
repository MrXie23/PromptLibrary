import React, { useState } from "react";
import { Link } from "gatsby";
import "../../styles/components/header.module.css";

const Header = ({ isDarkMode, toggleTheme }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header>
      <nav>
        <div className="logo">
          <Link to="/">
            Prompt<span>Library</span>
          </Link>
        </div>
        <div className={`nav-links ${showMobileMenu ? "active" : ""}`}>
          <Link to="/" activeClassName="active">
            首页
          </Link>
          <Link to="/categories" activeClassName="active">
            分类
          </Link>
          <Link to="/popular" activeClassName="active">
            热门
          </Link>
          <Link to="/about" activeClassName="active">
            关于
          </Link>
        </div>
        <div className="nav-actions">
          <button className="search-btn" aria-label="搜索">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="切换主题"
          >
            <i className={`fa-solid ${isDarkMode ? "fa-sun" : "fa-moon"}`}></i>
          </button>
          <button
            className="mobile-menu-toggle"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="菜单"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;