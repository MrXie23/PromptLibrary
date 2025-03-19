import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout/Layout";
import SEO from "../components/SEO";
import CategoryItem from "../components/CategoryItem";
import "../styles/templates/categories-index.module.css";

const CategoriesIndex = ({ data }) => {
  const categories = data.allDirectory.edges;
  
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
  data.allMarkdownRemark.group.forEach(group => {
    categoryCounts[group.fieldValue] = group.totalCount;
  });

  return (
    <Layout>
      <SEO title="提示词分类" />
      <section className="categories-header">
        <h1>按分类浏览</h1>
        <p>探索不同领域的AI提示词</p>
      </section>

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
    </Layout>
  );
};

export const query = graphql`
  query {
    allDirectory(filter: { relativePath: { regex: "/^[^/]+$/" } }) {
      edges {
        node {
          relativePath
          name
        }
      }
    }
    allMarkdownRemark {
      group(field: { fields: { category: SELECT } }) {
        fieldValue
        totalCount
      }
    }
  }
`;

export default CategoriesIndex;