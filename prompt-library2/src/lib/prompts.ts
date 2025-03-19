import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { PromptData, CategoryData } from '@/types';

const promptsDirectory = path.join(process.cwd(), 'prompts');

// 获取所有提示词数据
export function getAllPrompts(): PromptData[] {
  // 确保目录存在
  if (!fs.existsSync(promptsDirectory)) {
    return [];
  }

  // 获取所有markdown文件
  const filenames = fs.readdirSync(promptsDirectory);
  const mdFiles = filenames.filter(filename => filename.endsWith('.md'));
  
  const allPromptsData = mdFiles.map(filename => {
    // 移除 ".md" 获取 slug
    const slug = filename.replace(/\.md$/, '');
    
    // 读取markdown文件
    const fullPath = path.join(promptsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    // 使用gray-matter解析frontmatter
    const matterResult = matter(fileContents);
    
    // 尝试读取对应的JSON文件以获取更多元数据
    const jsonFilePath = path.join(promptsDirectory, `${slug}.json`);
    let jsonData = {};
    
    if (fs.existsSync(jsonFilePath)) {
      try {
        const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
        jsonData = JSON.parse(jsonContent);
      } catch (error) {
        console.error(`Error parsing JSON for ${slug}:`, error);
      }
    }
    
    // 合并frontmatter和JSON数据
    return {
      slug,
      ...matterResult.data,
      ...jsonData,
    } as PromptData;
  });
  
  // 按创建日期排序，最新的排在前面
  return allPromptsData.sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });
}

// 获取所有分类
export function getAllCategories(): CategoryData[] {
  const prompts = getAllPrompts();
  
  // 计算每个分类的提示词数量
  const categoryCounts = prompts.reduce((acc, prompt) => {
    const category = prompt.category;
    if (category) {
      acc[category] = (acc[category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  // 分类数据（这里可以从配置文件或数据库加载）
  const categories: CategoryData[] = [
    { slug: 'content-creation', name: '内容创作', icon: 'fa-pen-fancy', count: 0 },
    { slug: 'programming', name: '编程开发', icon: 'fa-code', count: 0 },
    { slug: 'creative-design', name: '创意设计', icon: 'fa-palette', count: 0 },
    { slug: 'data-analysis', name: '数据分析', icon: 'fa-chart-line', count: 0 },
    { slug: 'marketing', name: '营销推广', icon: 'fa-bullhorn', count: 0 },
    { slug: 'education', name: '教育学习', icon: 'fa-graduation-cap', count: 0 },
  ];
  
  // 更新分类计数
  return categories.map(category => {
    // 中文分类名与英文slug的映射
    const categoryMap: Record<string, string> = {
      '内容创作': 'content-creation',
      '编程开发': 'programming',
      '创意设计': 'creative-design',
      '数据分析': 'data-analysis',
      '营销推广': 'marketing',
      '教育学习': 'education',
    };
    
    // 查找对应的分类计数
    const count = Object.entries(categoryCounts).reduce((acc, [catName, count]) => {
      if (categoryMap[catName] === category.slug) {
        return acc + count;
      }
      return acc;
    }, 0);
    
    return {
      ...category,
      count,
    };
  });
}

export async function getPromptData(slug: string): Promise<PromptData | null> {
    // 移除 slug 中可能已经存在的 .md 扩展名
    const cleanSlug = slug.replace(/\.md$/, '');
    
    const fullPath = path.join(promptsDirectory, `${cleanSlug}.md`);
    
    // 检查文件是否存在
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    
    // 读取对应的JSON文件
    const jsonFilePath = path.join(promptsDirectory, `${cleanSlug}.json`);
    let jsonData = {};
    
    if (fs.existsSync(jsonFilePath)) {
      try {
        const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
        jsonData = JSON.parse(jsonContent);
      } catch (error) {
        console.error(`Error parsing JSON for ${cleanSlug}:`, error);
      }
    }
    
    // 处理Markdown内容
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    const contentHtml = processedContent.toString();
    
    // 合并所有数据
    return {
      slug: cleanSlug, // 使用清理过的 slug
      content: contentHtml,
      ...matterResult.data,
      ...jsonData,
    } as PromptData;
  }

// 获取热门提示词
export function getFeaturedPrompts(): PromptData[] {
  const allPrompts = getAllPrompts();
  return allPrompts
    .filter(prompt => prompt.featured)
    .sort((a, b) => {
      if (a.rating && b.rating) {
        return b.rating - a.rating;
      }
      return 0;
    })
    .slice(0, 3); // 取前3个
}

// 获取最新提示词
export function getRecentPrompts(): PromptData[] {
  const allPrompts = getAllPrompts();
  return allPrompts.slice(0, 3); // 取前3个，因为已经按日期排序过
}