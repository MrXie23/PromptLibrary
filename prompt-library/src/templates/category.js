import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout/Layout";
import SEO from "../components/SEO";
import PromptCard from "../components/PromptCard";
import "../styles/templates/category.module.css";

const CategoryTemplate = ({ data, pageContext }) => {
  const { category } = pageContext;
  const prompts = data.allMarkdownRemark.edges;

  // Get category metadata (you could store this in a separate JSON file)
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

  const displayName = categoryNames[category] || category;
  const icon = categoryIcons[category] || "fa-folder";

  return (
    <Layout>
      <SEO title={`${displayName}分类提示词`} />
      <section className="category-header">
        <div className="category-icon">
          <i className={`fa-solid ${icon}`}></i>
        </div>
        <h1>{displayName}</h1>
        <p>{prompts.length}个提示词</p>
      </section>

      <div className="prompt-grid">
        {prompts.map(({ node }) => {
          const promptData = node.frontmatter;
          return (
            <PromptCard
              key={node.fields.slug}
              title={promptData.title}
              description={node.excerpt}
              category={displayName}
              popularity={promptData.popularity}
              slug={node.fields.slug}
              date={promptData.dateCreated}
            />
          );
        })}
      </div>

      <div className="category-nav">
        <Link to="/categories" className="back-button">
          <i className="fa-solid fa-arrow-left"></i> 所有分类
        </Link>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query($category: String!) {
    allMarkdownRemark(
      filter: { fields: { category: { eq: $category } } }
      sort: { fields: [frontmatter___popularity, frontmatter___dateCreated], order: [DESC, DESC] }
    ) {
      edges {
        node {
          excerpt(pruneLength: 120)
          fields {
            slug
          }
          frontmatter {
            title
            popularity
            dateCreated(formatString: "YYYY年MM月DD日")
          }
        }
      }
    }
  }
`;

export default CategoryTemplate;