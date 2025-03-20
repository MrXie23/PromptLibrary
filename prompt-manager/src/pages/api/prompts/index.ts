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
    console.log(`创建提示目录：${promptsDirectory}`);
  }
} catch (error) {
  console.error('创建提示目录失败:', error);
}

// 生成唯一的slug
function generateUniqueSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
    
  const timestamp = Date.now();
  return `${base}-${timestamp}`;
}

// 获取所有提示文件名（不含扩展名）
function getPromptFiles(): string[] {
  try {
    // 检查目录是否存在，不存在则创建
    if (!fs.existsSync(promptsDirectory)) {
      fs.mkdirSync(promptsDirectory, { recursive: true });
      return [];
    }
    
    // 读取目录下的所有文件
    const files = fs.readdirSync(promptsDirectory);
    
    // 过滤出.md文件并去掉扩展名
    const promptSlugs = files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace(/\.md$/, ''));
      
    return promptSlugs;
  } catch (error) {
    console.error('获取提示文件列表出错:', error);
    return [];
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 获取所有提示的slug
  if (req.method === 'GET') {
    try {
      const promptSlugs = getPromptFiles();
      return res.status(200).json(promptSlugs);
    } catch (error) {
      console.error('API获取提示列表出错:', error);
      return res.status(500).json({ error: '获取提示列表失败' });
    }
  }
  
  // 创建新提示
  else if (req.method === 'POST') {
    try {
      const promptData = req.body;
      
      if (!promptData || !promptData.title || !promptData.content) {
        return res.status(400).json({ error: '缺少必要的提示信息' });
      }
      
      // 检查是否提供了自定义文件名
      let slug = '';
      if (promptData.customFileName) {
        // 清理自定义文件名
        slug = promptData.customFileName
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
          
        // 如果清理后文件名为空，使用默认生成的slug
        if (!slug) {
          slug = generateUniqueSlug(promptData.title);
        }
      } else {
        // 使用默认方法生成slug
        slug = generateUniqueSlug(promptData.title);
      }
      
      // 创建front matter
      const frontmatter = {
        title: promptData.title,
        description: promptData.description || '',
        category: promptData.category || '',
        author: promptData.author || '',
        tags: promptData.tags || [],
        createdAt: promptData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // 使用gray-matter生成markdown文件内容
      const markdownContent = matter.stringify(promptData.content, frontmatter);
      
      // 保存.md文件
      const filePath = path.join(promptsDirectory, `${slug}.md`);
      fs.writeFileSync(filePath, markdownContent);
      
      // 保存元数据到.json文件
      const metadataPath = path.join(promptsDirectory, `${slug}.json`);
      const createdAt = promptData.createdAt || new Date().toISOString();
      const metadata = {
        views: 0,
        likes: 0,
        usageCount: 0,
        favoriteCount: 0,
        featured: promptData.featured || false,
        isNew: true,
        ...frontmatter,
        createdAt,
      };
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
      
      // 返回创建的提示
      const newPrompt: Prompt = {
        slug,
        title: frontmatter.title,
        description: frontmatter.description,
        category: frontmatter.category,
        author: frontmatter.author,
        tags: frontmatter.tags,
        content: promptData.content,
        createdAt: frontmatter.createdAt,
        updatedAt: frontmatter.updatedAt,
        views: 0,
        likes: 0,
        usageCount: 0,
        favoriteCount: 0,
        featured: promptData.featured || false,
        isNew: true,
      };
      
      return res.status(201).json(newPrompt);
    } catch (error) {
      console.error('API创建提示出错:', error);
      return res.status(500).json({ error: '创建提示失败' });
    }
  }
  
  // 方法不允许
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 