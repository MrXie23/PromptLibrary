[English](../../README.md) | **中文**

# Prompt Library (提示词库)

> 探索、使用并分享经过精心策划的 AI 提示词，释放人工智能的全部潜力。

## 📖 项目简介

Prompt Library 是一个专注于收集、分类和分享高质量 AI 提示词的开源平台。我们的目标是创建一个全面的提示词集合，按用途分类，帮助从初学者到专家的各类用户充分利用 AI 模型的能力。

## 🚀 在线示例

访问网站: [Prompt Library](https://mrxie23.github.io/PromptLibrary/)

## ✨ 主要功能

- 📋 按类别浏览提示词，涵盖内容创作、编程、设计等多个领域
- 🔍 强大的搜索功能，快速找到相关提示词
- ⭐ 评分系统，突出显示最有效的提示词
- 📱 响应式设计，完美支持各种设备
- 🌐 支持中文界面，优化本地化体验
- 🔧 集成 Prompt Manager，轻松管理提示词内容

## 🛠️ 技术栈

- **Next.js** - React 框架，提供服务端渲染和静态网站生成
- **React** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript 超集
- **MDX** - 用于内容管理的 Markdown 扩展
- **CSS Modules** - 组件级样式管理
- **Tailwind CSS** - 用于 Prompt Manager 的实用优先 CSS 框架

## 📁 项目结构

```
prompt-library/
├── src/                  # 源代码
│   ├── app/              # Next.js应用页面
│   ├── components/       # React组件
│   ├── lib/              # 工具函数和辅助库
│   └── types/            # TypeScript类型定义
├── prompts/              # 提示词内容 (Markdown + JSON)
├── public/               # 静态资源
├── scripts/              # 构建脚本
└── next.config.js        # Next.js配置

prompt-manager/           # 提示词内容管理工具
├── src/                  # 源代码
│   ├── components/       # UI组件
│   ├── lib/              # 工具函数
│   ├── pages/            # 应用页面和API路由
│   ├── styles/           # CSS样式
│   └── types/            # TypeScript类型定义
└── public/               # 静态资源
```

## 🔧 本地开发

### 前置条件

- Node.js 16.0.0 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. 克隆仓库

   ```bash
   git clone https://github.com/mrxie23/PromptLibrary.git
   cd prompt-library
   ```

2. 安装依赖

   ```bash
   npm install
   # 或
   yarn install
   ```

3. 启动开发服务器

   ```bash
   npm run dev
   # 或
   yarn dev
   ```

4. 打开浏览器访问 `http://localhost:3000`

## 🏗️ 构建部署

```bash
# 生成生产环境构建
npm run build

# 本地预览生产构建
npm run start
```

## 📝 添加新提示词

### 方法一：手动添加文件

1. 在 `prompts/` 目录中创建新的 Markdown 文件
2. 添加前置元数据 (frontmatter)：
   ```md
   ---
   title: 提示词标题
   description: 简短描述
   category: 分类名称
   ---
   ```
3. 编写提示词内容
4. 创建同名的 JSON 文件，包含额外信息：
   ```json
   {
     "slug": "prompt-slug",
     "rating": 9.5,
     "createdAt": "YYYY-MM-DD",
     "featured": false,
     "isNew": true
   }
   ```

### 方法二：使用 Prompt Manager

Prompt Manager 是一个基于网页的工具，旨在通过直观的界面帮助您管理提示词库。它提供了一种用户友好的方式来创建、编辑和组织您的提示词。

#### 启动 Prompt Manager

1. 进入 prompt-manager 目录：

   ```bash
   cd prompt-manager
   ```

2. 安装依赖（仅首次使用）：

   ```bash
   npm install
   ```

3. 启动 Prompt Manager：

   ```bash
   npm run dev
   # 或在Windows上使用 start.bat 文件
   ```

4. 打开浏览器访问 `http://localhost:3000`

#### Prompt Manager 主要功能

- **仪表盘**：查看提示词库的统计信息和关键数据
- **浏览**：列出所有提示词，支持搜索、筛选和排序
- **创建**：使用可视化编辑器和模板选项添加新提示词
- **编辑**：修改现有提示词的内容和属性
- **分类管理**：管理提示词分类
- **预览**：在保存前查看提示词的显示效果

#### 创建新提示词

1. 点击仪表盘或导航菜单中的"创建新提示"按钮
2. 填写必填字段：
   - 标题
   - 描述
   - 分类
   - 内容（支持 Markdown 格式）
3. 可选自定义：
   - 文件名（或让系统自动生成）
   - 评分（1-10）
   - 精选状态
   - 新提示标记
4. 点击"创建提示"保存

#### 编辑现有提示词

1. 导航到提示词列表页面
2. 找到要编辑的提示词并点击
3. 点击"编辑"按钮
4. 对内容或属性进行修改
5. 点击"保存更改"更新提示词

## 🤝 贡献指南

我们欢迎各种形式的贡献！

1. Fork 并克隆项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m '添加了一个很棒的功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

## 📜 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 🙏 感谢

感谢所有对本项目做出贡献的开发者和社区成员！
