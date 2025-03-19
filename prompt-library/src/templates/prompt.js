import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout/Layout";
import SEO from "../components/SEO";
import "../styles/templates/prompt.module.css";

const PromptTemplate = ({ data }) => {
  const prompt = data.markdownRemark;
  const promptData = data.promptJson;
  
  // Combine markdown content with JSON metadata
  const {
    title,
    category,
    popularity,
    dateCreated,
    author,
    tags,
  } = promptData || prompt.frontmatter;

  return (
    <Layout>
      <SEO title={title} description={prompt.excerpt} />
      <article className="prompt-detail">
        <header>
          <div className="prompt-meta">
            <Link to={`/categories/${category}`} className="category">
              {category}
            </Link>
            {popularity && (
              <span className="popularity">
                <i className="fa-solid fa-star"></i> {popularity}
              </span>
            )}
          </div>
          <h1>{title}</h1>
          <div className="prompt-info">
            {dateCreated && (
              <span className="date">
                <i className="fa-regular fa-calendar"></i> {dateCreated}
              </span>
            )}
            {author && (
              <span className="author">
                <i className="fa-regular fa-user"></i> {author}
              </span>
            )}
          </div>
        </header>

        <div
          className="prompt-content"
          dangerouslySetInnerHTML={{ __html: prompt.html }}
        />

        {tags && tags.length > 0 && (
          <div className="prompt-tags">
            <h3>标签:</h3>
            <div className="tags-list">
              {tags.map((tag, index) => (
                <Link key={index} to={`/tags/${tag}`} className="tag">
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="prompt-actions">
          <a
            href={`https://github.com/yourusername/prompt-library/edit/main/content/prompts/${category}/${prompt.fields.slug.replace(/\//g, "")}.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="edit-button"
          >
            <i className="fa-solid fa-pencil"></i> 编辑此提示词
          </a>
          <button className="copy-button" onClick={() => navigator.clipboard.writeText(prompt.rawMarkdownBody)}>
            <i className="fa-regular fa-copy"></i> 复制提示词
          </button>
        </div>
      </article>
    </Layout>
  );
};

export const query = graphql`
  query($slug: String!, $category: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt(pruneLength: 160)
      rawMarkdownBody
      frontmatter {
        title
        category
        popularity
        dateCreated(formatString: "YYYY年MM月DD日")
        author
        tags
      }
      fields {
        slug
      }
    }
    promptJson(fields: { slug: { eq: $slug } }) {
      title
      category
      popularity
      dateCreated(formatString: "YYYY年MM月DD日")
      author
      tags
    }
  }
`;

export default PromptTemplate;