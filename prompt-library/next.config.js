/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/PromptLibrary", // 确保与GitHub仓库名一致

  // 提高性能的设置
  swcMinify: true, // 使用SWC进行代码压缩
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // 生产环境移除console语句
  },

  // 确保提示词文件被复制到输出目录
  webpack: (config) => {
    const CopyPlugin = require("copy-webpack-plugin");

    // 优化webpack配置
    config.optimization = {
      ...config.optimization,
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // 获取npm包名称
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `npm.${packageName.replace("@", "")}`;
            },
          },
        },
      },
    };

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
