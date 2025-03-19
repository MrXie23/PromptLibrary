const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  // Process markdown files
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `content/prompts` });
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });

    // Get the parent directory name (category)
    const fileNode = getNode(node.parent);
    const parsedFilePath = path.parse(fileNode.relativePath);
    const category = parsedFilePath.dir.split('/')[0];
    
    createNodeField({
      node,
      name: `category`,
      value: category || 'uncategorized',
    });
  }
  
  // Process JSON files
  if (node.internal.type === `PromptJson`) {
    const fileNode = getNode(node.parent);
    const parsedFilePath = path.parse(fileNode.relativePath);
    const slug = `/${parsedFilePath.dir}/${parsedFilePath.name}/`;
    
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });
    
    const category = parsedFilePath.dir.split('/')[0];
    createNodeField({
      node,
      name: `category`,
      value: category || 'uncategorized',
    });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // Query for markdown nodes to use in creating pages
  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
              category
            }
            frontmatter {
              title
            }
          }
        }
      }
      allPromptJson {
        edges {
          node {
            fields {
              slug
              category
            }
          }
        }
      }
      allDirectory(filter: { relativePath: { regex: "/^[^/]+$/" } }) {
        edges {
          node {
            relativePath
            name
          }
        }
      }
    }
  `);

  // Create prompt pages
  result.data.data.allMarkdownRemark.edges.forEach(({ node }) => {
    // For each markdown file, create a page
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/prompt.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.fields.slug,
        category: node.fields.category,
      },
    });
  });

  // Create category pages
  const categories = result.data.allDirectory.edges;
  categories.forEach(({ node }) => {
    if (node.relativePath) {
      createPage({
        path: `/categories/${node.relativePath}`,
        component: path.resolve(`./src/templates/category.js`),
        context: {
          category: node.relativePath,
        },
      });
    }
  });

  // Create a categories index page
  createPage({
    path: '/categories',
    component: path.resolve(`./src/templates/categories-index.js`),
  });
};