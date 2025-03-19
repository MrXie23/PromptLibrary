module.exports = {
  siteMetadata: {
    title: `Prompt Library`,
    description: `探索AI提示的艺术`,
    author: `@yourhandle`,
    siteUrl: `https://yourusername.github.io/prompt-library`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `prompts`,
        path: `${__dirname}/content/prompts`,
      },
    },
    `gatsby-transformer-remark`,
    `gatsby-transformer-json`,
  ],
};