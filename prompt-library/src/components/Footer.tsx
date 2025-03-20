"use client";

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          Prompt<span>Library</span>
        </div>

        <div className="footer-links">
          <div className="footer-links-section">
            <h4>导航</h4>
            <div className="footer-links-items">
              <Link href="/">首页</Link>
              <Link href="/categories">分类</Link>
              <Link href="/popular">热门</Link>
              <Link href="/about">关于</Link>
            </div>
          </div>

          <div className="footer-links-section">
            <h4>资源</h4>
            <div className="footer-links-items">
              <a href="https://github.com/MrXie23/PromptLibrary" target="_blank" rel="noopener noreferrer">GitHub 仓库</a>
              <a href="https://github.com/MrXie23/PromptLibrary/issues" target="_blank" rel="noopener noreferrer">问题反馈</a>
              <a href="https://github.com/MrXie23/PromptLibrary/blob/main/README.md" target="_blank" rel="noopener noreferrer">文档</a>
            </div>
          </div>

          <div className="footer-links-section">
            <h4>法律</h4>
            <div className="footer-links-items">
              <Link href="/terms">使用条款</Link>
              <Link href="/privacy">隐私政策</Link>
              <Link href="/cookies">Cookie 政策</Link>
            </div>
          </div>
        </div>

        <div className="footer-social">
          <a href="https://twitter.com/promptlibrary" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fa-brands fa-twitter"></i>
          </a>
          <a href="https://github.com/MrXie23/PromptLibrary" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <i className="fa-brands fa-github"></i>
          </a>
          <a href="https://discord.gg/promptlibrary" target="_blank" rel="noopener noreferrer" aria-label="Discord">
            <i className="fa-brands fa-discord"></i>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {currentYear} PromptLibrary. 保留所有权利。</p>
      </div>
    </footer>
  );
}