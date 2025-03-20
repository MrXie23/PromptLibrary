# Prompt Library 性能优化指南

本文档提供了关于如何优化 Prompt Library 在 GitHub Pages 上的性能的详细说明。

## 已实施的优化

我们已经实施了以下优化措施以提高页面加载速度和性能：

### 1. Next.js 配置优化

- 启用 SWC minify 进行代码压缩
- 在生产环境中移除 console 语句
- 优化 webpack 配置，实现代码拆分和更好的缓存
- 将依赖项打包成单独的 chunks

### 2. 预加载和数据缓存

- 对关键页面使用 `prefetch` 预加载
- 设置 `revalidate` 重新验证时间为 3600 秒（1 小时）
- 使用静态生成提高首次加载速度

### 3. 外部资源优化

- 对外部字体和图标使用 `preload`
- 将非关键 JS 设置为延迟加载 (`lazyOnload`)

### 4. 构建后优化

- 创建了专用的构建优化脚本 `optimize-build.js`
- 对 HTML、CSS 和 JS 文件进行进一步压缩
- 生成 Gzip 版本文件，利用 GitHub Pages 的自动压缩特性

## 如何使用优化版构建

要使用优化的构建流程，请运行以下命令：

```bash
npm run build:optimized
```

或者，如果您想构建并准备 GitHub Pages 部署：

```bash
npm run deploy
```

## 进一步优化建议

1. **图片优化**

   - 考虑使用 WebP 或 AVIF 格式
   - 实施懒加载图片策略
   - 使用适当尺寸的图片响应式布局

2. **代码分割**

   - 对大型组件使用动态导入
   - 将路由分割成更小的组件

3. **服务端缓存**

   - 添加适当的缓存控制头
   - 利用 CDN 进行内容分发

4. **监控与分析**
   - 使用 Lighthouse 或类似工具定期检查性能
   - 监控核心 Web 指标 (Core Web Vitals)

## 性能排查

如果仍然遇到性能问题，请检查：

1. 大型 JS 包 - 使用 `next bundle-analyzer` 检查
2. 渲染阻塞资源 - 检查 `<head>` 中的资源加载顺序
3. 外部 API 调用延迟 - 考虑在构建时预取数据
4. 导航体验 - 确保页面切换时尽可能平滑
