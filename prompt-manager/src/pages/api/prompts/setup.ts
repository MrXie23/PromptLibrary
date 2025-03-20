import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Prompt } from '@/types';

// 提示库路径
const promptsDirectory = path.join(process.cwd(), '..', 'prompt-library', 'prompts');

// 确保目录存在
try {
  if (!fs.existsSync(promptsDirectory)) {
    fs.mkdirSync(promptsDirectory, { recursive: true });
  }
} catch (error) {
  console.error('创建提示目录失败:', error);
}

// 示例提示数据
const samplePrompts = [
  {
    title: '高效工作流程提示',
    description: '帮助用户规划高效的工作流程，提高生产力的提示',
    category: 'productivity',
    author: '系统',
    tags: ['productivity', 'workflow', 'efficiency'],
    content: `# 高效工作流程提示

想要提高工作效率，你可以按照以下步骤：

1. 每天早上列出3-5个最重要的任务
2. 使用番茄工作法（25分钟专注工作，5分钟休息）
3. 将大任务分解为小步骤
4. 减少干扰，设置特定的时间检查邮件和消息
5. 使用适合你的工具和应用来跟踪进度

记得定期回顾和调整你的工作流程，找出最适合你的方式。`,
    featured: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5天前
  },
  {
    title: '创意写作提示',
    description: '激发创意写作灵感的提示模板',
    category: 'writing',
    author: '系统',
    tags: ['writing', 'creativity', 'story'],
    content: `# 创意写作提示

使用以下框架来构建你的故事：

1. **主角**: 描述你的主角的特点、动机和愿望
2. **设定**: 建立故事发生的世界和背景
3. **冲突**: 主角面临什么挑战或障碍
4. **旅程**: 主角如何应对这些挑战
5. **转折**: 故事中的意外转折是什么
6. **解决**: 冲突如何解决
7. **变化**: 主角如何变化或成长

尝试从不同的角度或时间线开始你的故事，这可以让故事更加引人入胜。`,
    featured: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15天前
  },
  {
    title: 'AI对话优化提示',
    description: '如何更好地与AI助手交流的提示和技巧',
    category: 'AI',
    author: '系统',
    tags: ['AI', 'prompt', 'communication'],
    content: `# AI对话优化提示

与AI助手有效沟通的技巧：

1. **明确具体**: 提供具体的指示和要求
2. **上下文**: 提供足够的背景信息
3. **分步骤**: 对于复杂任务，将请求分解为多个步骤
4. **示例**: 提供示例说明你期望的输出格式
5. **反馈**: 告诉AI什么有用，什么需要改进
6. **限制**: 设定明确的限制和约束
7. **迭代**: 基于AI的回答进行迭代和精炼

这些技巧将帮助你获得更有用、更相关的AI响应。`,
    featured: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2天前
  },
  {
    title: '数据分析框架',
    description: '系统性数据分析的步骤和方法',
    category: 'data',
    author: '系统',
    tags: ['data', 'analysis', 'framework'],
    content: `# 数据分析框架

遵循这个框架进行系统性数据分析：

1. **定义问题**: 明确你想解答的问题或验证的假设
2. **收集数据**: 确定所需数据及其来源
3. **清洗数据**: 处理缺失值、异常值和重复项
4. **探索性分析**: 
   - 描述性统计
   - 数据可视化
   - 相关性分析
5. **深入分析**:
   - 应用适当的统计方法
   - 建立预测模型
   - 验证假设
6. **解释结果**: 将分析结果转化为可操作的见解
7. **沟通发现**: 创建清晰的报告或可视化表示

记住，好的数据分析总是从清晰的问题开始，以可操作的见解结束。`,
    featured: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1天前
  },
  {
    title: '有效学习技巧',
    description: '提高学习效率和知识保留的方法',
    category: 'education',
    author: '系统',
    tags: ['learning', 'education', 'study'],
    content: `# 有效学习技巧

使用这些技巧来提高学习效率：

1. **分散练习**: 将学习分散在多个短时段内，而不是一次长时间学习
2. **检索练习**: 不断测试自己对所学内容的记忆
3. **交错学习**: 混合不同主题而不是专注于单一主题
4. **费曼技巧**: 尝试用简单的语言解释概念，就像教给别人一样
5. **主动学习**: 积极参与学习过程，提问并寻找答案
6. **可视化**: 创建思维导图或其他视觉工具来连接概念
7. **反思**: 定期反思所学内容和学习过程

找到适合你的学习方式，并根据自己的进展调整策略。`,
    featured: true,
    createdAt: new Date().toISOString() // 今天
  }
];

// 创建示例提示
function createSamplePrompt(promptData: any): boolean {
  try {
    // 生成slug
    const base = promptData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
      
    const slug = `${base}-sample`;
    
    // 创建front matter
    const frontmatter = {
      title: promptData.title,
      description: promptData.description,
      category: promptData.category,
      author: promptData.author,
      tags: promptData.tags,
      createdAt: promptData.createdAt,
      updatedAt: new Date().toISOString(),
    };
    
    // 使用gray-matter生成markdown文件内容
    const markdownContent = matter.stringify(promptData.content, frontmatter);
    
    // 保存.md文件
    const filePath = path.join(promptsDirectory, `${slug}.md`);
    fs.writeFileSync(filePath, markdownContent);
    
    // 保存元数据到.json文件
    const metadataPath = path.join(promptsDirectory, `${slug}.json`);
    
    // 检查是否是新提示（7天内创建）
    const createdDate = new Date(promptData.createdAt);
    const now = new Date();
    const isNew = now.getTime() - createdDate.getTime() < 7 * 24 * 60 * 60 * 1000; // 7天内
    
    const metadata = {
      views: Math.floor(Math.random() * 100),
      likes: Math.floor(Math.random() * 20),
      usageCount: Math.floor(Math.random() * 30),
      favoriteCount: Math.floor(Math.random() * 10),
      featured: promptData.featured || false,
      isNew: isNew,
      ...frontmatter,
    };
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    
    return true;
  } catch (error) {
    console.error('创建示例提示出错:', error);
    return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      let successCount = 0;
      
      // 创建所有示例提示
      for (const promptData of samplePrompts) {
        const success = createSamplePrompt(promptData);
        if (success) {
          successCount++;
        }
      }
      
      return res.status(200).json({ 
        message: `成功创建了 ${successCount}/${samplePrompts.length} 个示例提示`,
        created: successCount
      });
    } catch (error) {
      console.error('API创建示例提示出错:', error);
      return res.status(500).json({ error: '创建示例提示失败' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 