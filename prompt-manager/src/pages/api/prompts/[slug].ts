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

// 根据slug获取提示
function getPromptBySlug(slug: string): Prompt | null {
  try {
    // 检查.md文件是否存在
    const mdPath = path.join(promptsDirectory, `${slug}.md`);
    if (!fs.existsSync(mdPath)) {
      return null;
    }
    
    // 读取.md文件
    const fileContent = fs.readFileSync(mdPath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // 读取元数据文件
    const metadataPath = path.join(promptsDirectory, `${slug}.json`);
    let metadata: Record<string, any> = {};
    
    if (fs.existsSync(metadataPath)) {
      const metadataContent = fs.readFileSync(metadataPath, 'utf8');
      metadata = JSON.parse(metadataContent);
      console.log(`Metadata for ${slug}: isNew=${metadata.isNew}, featured=${metadata.featured}`);
    }

    // 检查是否是新提示（7天内创建）
    const createdAt = data.createdAt || metadata.createdAt || new Date().toISOString();
    const createdDate = new Date(createdAt);
    const now = new Date();
    const isWithinSevenDays = now.getTime() - createdDate.getTime() < 7 * 24 * 60 * 60 * 1000; // 7天内
    
    // 优先使用元数据中的isNew，如果不存在，则根据创建日期判断
    const isNew = metadata.isNew !== undefined ? metadata.isNew : isWithinSevenDays;
    
    // 合并数据
    return {
      slug,
      title: data.title || '',
      description: data.description || '',
      category: data.category || '',
      author: data.author || '',
      tags: data.tags || [],
      content,
      createdAt,
      updatedAt: data.updatedAt || metadata.updatedAt || new Date().toISOString(),
      views: metadata.views || 0,
      likes: metadata.likes || 0,
      usageCount: metadata.usageCount || 0,
      favoriteCount: metadata.favoriteCount || 0,
      featured: metadata.featured || false,
      isNew
    };
  } catch (error) {
    console.error(`获取提示 ${slug} 出错:`, error);
    return null;
  }
}

// 更新提示
function updatePrompt(slug: string, promptData: Prompt): boolean {
  try {
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
    const metadata = {
      views: promptData.views || 0,
      likes: promptData.likes || 0,
      usageCount: promptData.usageCount || 0,
      favoriteCount: promptData.favoriteCount || 0,
      featured: promptData.featured || false,
      isNew: promptData.isNew || false,
      ...frontmatter,
    };
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    
    return true;
  } catch (error) {
    console.error(`更新提示 ${slug} 出错:`, error);
    return false;
  }
}

// 删除提示
function deletePromptFiles(slug: string): boolean {
  try {
    // 删除.md文件
    const mdPath = path.join(promptsDirectory, `${slug}.md`);
    if (fs.existsSync(mdPath)) {
      fs.unlinkSync(mdPath);
    }
    
    // 删除.json文件
    const jsonPath = path.join(promptsDirectory, `${slug}.json`);
    if (fs.existsSync(jsonPath)) {
      fs.unlinkSync(jsonPath);
    }
    
    return true;
  } catch (error) {
    console.error(`删除提示 ${slug} 出错:`, error);
    return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  
  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: '无效的提示标识' });
  }
  
  // 获取提示
  if (req.method === 'GET') {
    try {
      const prompt = getPromptBySlug(slug);
      
      if (!prompt) {
        return res.status(404).json({ error: `找不到slug为${slug}的提示` });
      }
      
      return res.status(200).json(prompt);
    } catch (error) {
      console.error(`API获取提示 ${slug} 出错:`, error);
      return res.status(500).json({ error: '获取提示失败' });
    }
  }
  
  // 更新提示
  else if (req.method === 'PUT') {
    try {
      const promptData = req.body;
      
      if (!promptData) {
        return res.status(400).json({ error: '缺少更新数据' });
      }
      
      // 检查提示是否存在
      const existingPrompt = getPromptBySlug(slug);
      if (!existingPrompt) {
        return res.status(404).json({ error: `找不到slug为${slug}的提示` });
      }
      
      // 更新提示
      const success = updatePrompt(slug, {
        ...existingPrompt,
        ...promptData,
        slug, // 确保slug不被修改
      });
      
      if (success) {
        const updatedPrompt = getPromptBySlug(slug);
        return res.status(200).json({ 
          message: '提示更新成功',
          prompt: updatedPrompt
        });
      } else {
        return res.status(500).json({ error: '保存提示失败' });
      }
    } catch (error) {
      console.error(`API更新提示 ${slug} 出错:`, error);
      return res.status(500).json({ error: '更新提示失败' });
    }
  }
  
  // 删除提示
  else if (req.method === 'DELETE') {
    try {
      // 检查提示是否存在
      const existingPrompt = getPromptBySlug(slug);
      if (!existingPrompt) {
        return res.status(404).json({ error: `找不到slug为${slug}的提示` });
      }
      
      // 删除提示文件
      const success = deletePromptFiles(slug);
      
      if (success) {
        return res.status(200).json({ message: '提示删除成功' });
      } else {
        return res.status(500).json({ error: '删除提示失败' });
      }
    } catch (error) {
      console.error(`API删除提示 ${slug} 出错:`, error);
      return res.status(500).json({ error: '删除提示失败' });
    }
  }
  
  // 方法不允许
  else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 