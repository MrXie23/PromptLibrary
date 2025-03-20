# Prompt Manager

这是一个用于管理提示（Prompts）的本地网页应用程序，采用 Apple 设计风格。该应用允许您浏览、编辑、创建和管理提示库中的内容。

## 功能特点

- 🎨 Apple 设计风格的优雅用户界面
- 📝 创建、编辑和删除提示
- 🔍 浏览和搜索现有提示
- 🏷️ 管理提示分类
- 📊 查看提示统计信息
- 💾 自动保存到本地文件系统

## 安装

1. 确保您已安装 Node.js（14.x 或更高版本）

2. 克隆仓库并安装依赖：

```bash
cd prompt-manager
npm install
```

## 使用方法

### 开发模式

启动开发服务器：

```bash
npm run dev
```

在浏览器中访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
npm run start
```

## 文件结构

- `/prompts` - 存储所有提示文件（.md 和.json）
- `/src` - 应用程序源代码
  - `/components` - React 组件
  - `/pages` - Next.js 页面
  - `/styles` - CSS 样式
  - `/lib` - 工具函数
  - `/types` - TypeScript 类型定义

## 提示文件格式

每个提示包含两个文件：

1. `[slug].md` - 包含提示的正文内容和前置元数据
2. `[slug].json` - 包含提示的元数据（评分、创建日期等）

## 贡献

欢迎提交问题和拉取请求！

## 许可证

[MIT](LICENSE)
