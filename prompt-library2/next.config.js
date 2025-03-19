/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/PromptLibrary", // 确保与GitHub仓库名一致

  // 确保提示词文件被复制到输出目录
  webpack: (config) => {
    const CopyPlugin = require("copy-webpack-plugin");
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: "prompts",
            to: "PromptLibrary/prompts",
          },
          {
            from: "public/data",
            to: "PromptLibrary/data",
          },
        ],
      })
    );
    return config;
  },
};

module.exports = nextConfig;
