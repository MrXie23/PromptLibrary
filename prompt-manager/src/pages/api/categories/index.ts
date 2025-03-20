import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { CategoryData } from '@/types';
import matter from 'gray-matter';

const categoriesFilePath = path.join(process.cwd(), '..', 'prompt-library', 'src', 'CONFIG', 'CATEGORIES.TS');

// 辅助函数：从文件读取分类列表
function readCategoriesFromFile(): Omit<CategoryData, 'count'>[] {
  try {
    // 读取分类文件
    const fileContent = fs.readFileSync(categoriesFilePath, 'utf8');
    
    // 使用正则表达式提取CATEGORIES数组
    const categoriesMatch = fileContent.match(/export const CATEGORIES: CategoryData\[\] = \[([\s\S]*?)\];/);
    
    if (!categoriesMatch || !categoriesMatch[1]) {
      throw new Error('无法解析CATEGORIES数组');
    }
    
    // 解析每个分类项
    const categoryItems = categoriesMatch[1].split('},');
    
    const categories = categoryItems
      .filter(item => item.trim().length > 0)
      .map(item => {
        // 提取每个字段
        const slugMatch = item.match(/slug: ['"]([^'"]*)['"]/);
        const nameMatch = item.match(/name: ['"]([^'"]*)['"]/);
        const iconMatch = item.match(/icon: ['"]([^'"]*)['"]/);
        
        if (!slugMatch || !nameMatch || !iconMatch) {
          throw new Error(`解析分类项时出错: ${item}`);
        }
        
        return {
          slug: slugMatch[1],
          name: nameMatch[1],
          icon: iconMatch[1],
        };
      });
    
    return categories;
  } catch (error) {
    console.error('读取分类时出错:', error);
    return [];
  }
}

// 辅助函数：将分类列表写入文件
function writeCategoriesFile(categories: Omit<CategoryData, 'count'>[]): boolean {
  try {
    // 读取原始文件以保留格式
    let fileContent = fs.readFileSync(categoriesFilePath, 'utf8');
    
    // 生成新的分类数组字符串
    const categoriesString = categories
      .map(cat => `  { slug: '${cat.slug}', name: '${cat.name}', icon: '${cat.icon}' }`)
      .join(',\n');
    
    // 替换CATEGORIES数组
    fileContent = fileContent.replace(
      /export const CATEGORIES: CategoryData\[\] = \[([\s\S]*?)\];/,
      `export const CATEGORIES: CategoryData[] = [\n${categoriesString}\n];`
    );
    
    // 生成CATEGORY_TO_SLUG映射
    const categoryToSlugEntries = categories
      .map(cat => `  '${cat.name}': '${cat.slug}'`)
      .join(',\n');
    
    // 替换CATEGORY_TO_SLUG映射
    fileContent = fileContent.replace(
      /export const CATEGORY_TO_SLUG: Record<string, string> = {([\s\S]*?)};/,
      `export const CATEGORY_TO_SLUG: Record<string, string> = {\n${categoryToSlugEntries}\n};`
    );
    
    // 生成SLUG_TO_CATEGORY映射
    const slugToCategoryEntries = categories
      .map(cat => `  '${cat.slug}': '${cat.name}'`)
      .join(',\n');
    
    // 替换SLUG_TO_CATEGORY映射
    fileContent = fileContent.replace(
      /export const SLUG_TO_CATEGORY: Record<string, string> = {([\s\S]*?)};/,
      `export const SLUG_TO_CATEGORY: Record<string, string> = {\n${slugToCategoryEntries}\n};`
    );
    
    // 写入文件
    fs.writeFileSync(categoriesFilePath, fileContent);
    
    return true;
  } catch (error) {
    console.error('保存分类时出错:', error);
    return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 获取所有分类
  if (req.method === 'GET') {
    try {
      // 获取分类列表
      const categoriesWithoutCount = readCategoriesFromFile();
      
      // 统计每个分类下的提示数量
      try {
        // 读取提示目录
        const promptsDirectory = path.join(process.cwd(), '..', 'prompt-library', 'prompts');
        const categoryCounts: Record<string, number> = {};
        
        // 初始化所有分类的计数为0
        categoriesWithoutCount.forEach(cat => {
          categoryCounts[cat.slug] = 0;
        });
        
        if (fs.existsSync(promptsDirectory)) {
          // 获取所有.md文件
          const files = fs.readdirSync(promptsDirectory);
          const mdFiles = files.filter(file => file.endsWith('.md'));
          
          // 统计每个分类的提示数量
          for (const file of mdFiles) {
            try {
              const filePath = path.join(promptsDirectory, file);
              const fileContent = fs.readFileSync(filePath, 'utf8');
              const { data } = matter(fileContent);
              
              if (data.category) {
                // 查找对应的分类
                const category = categoriesWithoutCount.find(cat => 
                  cat.slug === data.category || cat.name.toLowerCase() === data.category.toLowerCase()
                );
                
                if (category) {
                  categoryCounts[category.slug]++;
                }
              }
            } catch (err) {
              console.error(`读取提示文件 ${file} 出错:`, err);
              // 继续处理下一个文件
            }
          }
        }
        
        // 将计数添加到分类数据中
        const categories: CategoryData[] = categoriesWithoutCount.map(cat => ({
          ...cat,
          count: categoryCounts[cat.slug] || 0
        }));
        
        return res.status(200).json(categories);
      } catch (countError) {
        console.error('统计分类计数出错:', countError);
        // 出错时返回没有计数的分类列表
        const categories: CategoryData[] = categoriesWithoutCount.map(cat => ({
          ...cat,
          count: 0
        }));
        return res.status(200).json(categories);
      }
    } catch (error) {
      console.error('API获取分类出错:', error);
      return res.status(500).json({ error: '获取分类列表失败' });
    }
  }
  
  // 创建新分类
  else if (req.method === 'POST') {
    try {
      const newCategory = req.body;
      
      if (!newCategory || !newCategory.slug || !newCategory.name || !newCategory.icon) {
        return res.status(400).json({ error: '缺少必要的分类信息' });
      }
      
      const categories = readCategoriesFromFile();
      
      // 检查是否已存在相同slug的分类
      if (categories.some(cat => cat.slug === newCategory.slug)) {
        return res.status(409).json({ error: `已存在slug为${newCategory.slug}的分类` });
      }
      
      // 添加新分类 (不包含 count)
      const categoryWithoutCount = {
        slug: newCategory.slug,
        name: newCategory.name,
        icon: newCategory.icon
      };
      categories.push(categoryWithoutCount);
      
      // 保存分类
      const success = writeCategoriesFile(categories);
      
      if (success) {
        return res.status(201).json({ 
          message: '分类创建成功', 
          category: { ...categoryWithoutCount, count: 0 } 
        });
      } else {
        return res.status(500).json({ error: '保存分类失败' });
      }
    } catch (error) {
      console.error('API创建分类出错:', error);
      return res.status(500).json({ error: '创建分类失败' });
    }
  }
  
  // 更新分类列表
  else if (req.method === 'PUT') {
    try {
      const categoriesWithCount = req.body as CategoryData[];
      
      if (!Array.isArray(categoriesWithCount)) {
        return res.status(400).json({ error: '无效的分类列表数据' });
      }
      
      // 移除所有分类中的 count 属性
      const categories = categoriesWithCount.map(cat => ({
        slug: cat.slug,
        name: cat.name,
        icon: cat.icon
      }));
      
      // 验证每个分类的结构
      for (const category of categories) {
        if (!category.slug || !category.name || !category.icon) {
          return res.status(400).json({ error: '分类数据格式不正确' });
        }
      }
      
      // 保存分类
      const success = writeCategoriesFile(categories);
      
      if (success) {
        return res.status(200).json({ message: '分类列表更新成功' });
      } else {
        return res.status(500).json({ error: '保存分类列表失败' });
      }
    } catch (error) {
      console.error('API更新分类列表出错:', error);
      return res.status(500).json({ error: '更新分类列表失败' });
    }
  }
  
  // 方法不允许
  else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 