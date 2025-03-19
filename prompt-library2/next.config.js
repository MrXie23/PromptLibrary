/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/PromptLibrary', // 按照你的GitHub仓库名调整
  
  // 确保提示词文件被复制到输出目录
  webpack: (config) => {
    const CopyPlugin = require('copy-webpack-plugin');
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          { 
            from: 'prompts',
            to: 'prompts' 
          },
        ],
      }),
    );
    return config;
  },
};

module.exports = nextConfig;