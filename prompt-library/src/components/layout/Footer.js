import React from "react";
import { Link } from "gatsby";
import "../../styles/components/footer.module.css";

const Footer = () => {
  return (
    <footer>
      <div className="footer-top">
        <div className="logo-section">
          <div className="logo">
            Prompt<span>Library</span>
          </div>
          <p>探索AI提示的艺术</p>
        </div>

        <div className="footer-nav">
          <div className="footer-section">
            <h4>导航</h4>
            <Link to="/">首页</Link>
            <Link to="/categories">分类</Link>
            <Link to="/popular">热门</Link>
            <Link to="/latest">最新</Link>
          </div>

          <div className="footer-section">
            <h4>资源</h4>
            <Link to="/guide">使用指南</Link>
            <Link to="/tips">提示词技巧</Link>
            <Link to="/faq">常见问题</Link>
            <Link to="/contribute">贡献指南</Link>
          </div>

          <div className="footer-section">
            <h4>关于我们</h4>
            <Link to="/about">项目介绍</Link>
            <Link to="/contact">联系我们</Link>
            <a
              href="https://github.com/yourusername/prompt-library"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PromptLibrary. 保留所有权利。</p>
        <div className="social-links">
          <a
            href="https://github.com/yourusername/prompt-library"
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-github"></i>
          </a>
          <a
            href="https://twitter.com/yourusername"
            aria-label="Twitter"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-twitter"></i>
          </a>
          <a
            href="https://discord.gg/yourinvite"
            aria-label="Discord"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-discord"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;