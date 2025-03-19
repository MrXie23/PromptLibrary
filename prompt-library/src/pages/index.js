import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout/Layout";
import SEO from "../components/seo";
import PromptCard from "../components/PromptCard";
import CategoryItem from "../components/CategoryItem";
import "../styles/pages/index.module.css";

const IndexPage = ({ data }) => {
  const featuredPrompts = data.featured.edges;
  const recentPrompts = data.recent.edges;
  const categories = data.categories.edges;
  
  // Category metadata
  const categoryIcons = {
    "content-creation": "fa-pen-fancy",
    "programming": "fa-code",
    "creative-writing": "fa-palette",
    "data-analysis": "fa-chart-line",
    "marketing": "fa-bullhorn",
    "education": "fa-graduation-cap",
  };
  
  const categoryNames = {
    "content-creation": "内容创作",
    "programming": "编程开发",
    "creative-writing": "创意写作",
    "data-analysis": "数据分析",
    "marketing": "营销推广",
    "education": "教育学习",
  };

  // Count prompts by category
  const categoryCounts = {};
  data.counts.group.forEach(group => {
    categoryCounts[group.fieldValue] = group.totalCount;
  });

  return (
    <Layout>
      <SEO title="探索AI提示的艺术" />
      
      {/* 英雄区域 */}
      <section className="hero">
        <div className="hero-content">
          <h1>发现最佳AI提示词</h1>
          <p>探索、使用并分享经过精心策划的提示词库，释放AI的全部潜力</p>
          <div className="search-container">
            <input type="text" placeholder="搜索提示词..." id="search-input" />
            <button className="search-button">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>
      </section>

      {/* 特色提示词 */}
      <section className="featured">
        <div className="section-header">
          <h2>精选提示词</h2>
          <Link to="/popular" className="view-all">
            查看全部 <i className="fa-solid fa-chevron-right"></i>
          </Link>
        </div>
        <div className="prompt-grid">
          {featuredPrompts.map(({ node }, index) => {
            const promptData = node.frontmatter;
            const category = categoryNames[node.fields.category] || node.fields.category;
            
            return (
              <PromptCard
                key={node.fields.slug}
                title={promptData.title}
                description={node.excerpt}
                category={category}
                popularity={promptData.popularity}
                slug={node.fields.slug}
                isFeatured={index === 0}
              />
            );
          })}
        </div>
      </section>

      {/* 分类浏览 */}
      <section className="categories">
        <div className="section-header">
          <h2>按分类浏览</h2>
        </div>
        <div className="category-container">
          {categories.map(({ node }) => {
            if (!node.relativePath) return null;
            
            const categoryName = categoryNames[node.relativePath] || node.relativePath;
            const count = categoryCounts[node.relativePath] || 0;
            const icon = categoryIcons[node.relativePath] || "fa-folder";
            
            return (
              <CategoryItem 
                key={node.relativePath}
                name={node.relativePath}
                count={count}
                icon={icon}
                displayName={categoryName}
              />
            );
          })}
        </div>
      </section>

      {/* 最近添加 */}
      <section className="recent">
        <div className="section-header">
          <h2>最近添加</h2>
          <Link to="/latest" className="view-all">
            查看全部 <i className="fa-solid fa-chevron-right"></i>
          </Link>
        </div>
        <div className="prompt-grid">
          {recentPrompts.map(({ node }) => {
            const promptData = node.frontmatter;
            const category = categoryNames[node.fields.category] || node.fields.category;
            // Calculate days since creation for "X days ago" display
            const daysSince = Math.floor(
              (new Date() - new Date(promptData.dateCreated)) / (1000 * 60 * 60 * 24)
            );
            const dateDisplay = daysSince === 0 ? "今天" : `${daysSince}天前`;
            
            return (
              <PromptCard
                key={node.fields.slug}
                title={promptData.title}
                description={node.excerpt}
                category={category}
                slug={node.fields.slug}
                date={dateDisplay}
                isNew={daysSince < 7} // Show "new" label if less than 7 days old
              />
            );
          })}
        </div>
      </section>

      {/* 订阅区域 */}
      <section className="subscribe">
        <div className="subscribe-content">
          <h2>获取最新提示词更新</h2>
          <p>订阅我们的通讯，第一时间获取新增提示词和使用技巧</p>
          <div className="subscribe-form">
            <input type="email" placeholder="您的邮箱地址" />
            <button>订阅</button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export const query = graphql`
  query {
    featured: allMarkdownRemark(
      sort: { fields: [frontmatter___popularity], order: DESC }
      limit: 3
    ) {
      edges {
        node {
          excerpt(pruneLength: 120)
          fields {
            slug
            category
          }
          frontmatter {
            title
            popularity
          }
        }
      }
    }
    recent: allMarkdownRemark(
      sort: { fields: [frontmatter___dateCreated], order: DESC }
      limit: 3
    ) {
      edges {
        node {
          excerpt(pruneLength: 120)
          fields {
            slug
            category
          }
          frontmatter {
            title
            dateCreated
          }
        }
      }
    }
    categories: allDirectory(
      filter: { relativePath: { regex: "/^[^/]+$/" } }
      limit: 6
    ) {
      edges {
        node {
          relativePath
          name
        }
      }
    }
    counts: allMarkdownRemark {
      group(field: { fields: { category: SELECT } }) {
        fieldValue
        totalCount
      }
    }
  }
`;

export default IndexPage;