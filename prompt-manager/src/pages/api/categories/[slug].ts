import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { CategoryData } from '@/types';

const categoriesFilePath = path.join(process.cwd(), '..', 'prompt-library', 'src', 'CONFIG', 'CATEGORIES.TS');

// 辅助函数：从文件读取分类列表
function readCategoriesFromFile(): CategoryData[] {
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
    
    const categories: CategoryData[] = categoryItems
      .filter(item => item.trim().length > 0)
      .map(item => {
        // 提取每个字段
        const slugMatch = item.match(/slug: ['"]([^'"]*)['"]/);
        const nameMatch = item.match(/name: ['"]([^'"]*)['"]/);
        const iconMatch = item.match(/icon: ['"]([^'"]*)['"]/);
        const nameKeyMatch = item.match(/nameKey: ['"]([^'"]*)['"]/);
        const countMatch = item.match(/count: (\d+)/);
        
        if (!slugMatch || !nameMatch || !iconMatch) {
          throw new Error(`解析分类项时出错: ${item}`);
        }
        
        return {
          slug: slugMatch[1],
          name: nameMatch[1],
          icon: iconMatch[1],
          nameKey: nameKeyMatch ? nameKeyMatch[1] : undefined,
          count: countMatch ? parseInt(countMatch[1], 10) : 0,
        };
      });
    
    return categories;
  } catch (error) {
    console.error('读取分类时出错:', error);
    return [];
  }
}

// 辅助函数：将分类列表写入文件
function writeCategoriesFile(categories: CategoryData[]): boolean {
  try {
    // 读取原始文件以保留格式
    let fileContent = fs.readFileSync(categoriesFilePath, 'utf8');
    
    // 生成新的分类数组字符串
    const categoriesString = categories
      .map(cat => {
        let str = `  { slug: '${cat.slug}', name: '${cat.name}'`;
        
        if (cat.nameKey) {
          str += `, nameKey: '${cat.nameKey}'`;
        }
        
        str += `, icon: '${cat.icon}'`;
        
        if (cat.count !== undefined) {
          str += `, count: ${cat.count}`;
        }
        
        str += ` }`;
        return str;
      })
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
    
    // 保存SLUG_TO_CATEGORY映射，如果存在的话
    const slugToCategoryRegex = /export const SLUG_TO_CATEGORY: Record<string, string> = {([\s\S]*?)};/;
    const slugToCategoryMatch = fileContent.match(slugToCategoryRegex);
    
    if (slugToCategoryMatch) {
      // 生成SLUG_TO_CATEGORY映射
      const slugToCategoryEntries = categories
        .map(cat => `  '${cat.slug}': '${cat.name}'`)
        .join(',\n');
      
      // 替换SLUG_TO_CATEGORY映射
      fileContent = fileContent.replace(
        slugToCategoryRegex,
        `export const SLUG_TO_CATEGORY: Record<string, string> = {\n${slugToCategoryEntries}\n};`
      );
    }
    
    // 写入文件
    fs.writeFileSync(categoriesFilePath, fileContent);
    
    return true;
  } catch (error) {
    console.error('保存分类时出错:', error);
    return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  
  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: '无效的分类标识' });
  }
  
  // 更新分类
  if (req.method === 'PATCH') {
    try {
      const updateData = req.body;
      
      if (!updateData) {
        return res.status(400).json({ error: '缺少更新数据' });
      }
      
      const categories = readCategoriesFromFile();
      
      // 查找要更新的分类
      const index = categories.findIndex(cat => cat.slug === slug);
      
      if (index === -1) {
        return res.status(404).json({ error: `找不到slug为${slug}的分类` });
      }
      
      // 更新分类
      categories[index] = {
        ...categories[index],
        ...updateData,
      };
      
      // 保存分类
      const success = writeCategoriesFile(categories);
      
      if (success) {
        return res.status(200).json({ 
          message: '分类更新成功',
          category: categories[index]
        });
      } else {
        return res.status(500).json({ error: '保存分类失败' });
      }
    } catch (error) {
      console.error('API更新分类出错:', error);
      return res.status(500).json({ error: '更新分类失败' });
    }
  }
  
  // 删除分类
  else if (req.method === 'DELETE') {
    try {
      let categories = readCategoriesFromFile();
      
      // 检查分类是否存在
      if (!categories.some(cat => cat.slug === slug)) {
        return res.status(404).json({ error: `找不到slug为${slug}的分类` });
      }
      
      // 过滤掉要删除的分类
      categories = categories.filter(cat => cat.slug !== slug);
      
      // 保存分类
      const success = writeCategoriesFile(categories);
      
      if (success) {
        return res.status(200).json({ message: '分类删除成功' });
      } else {
        return res.status(500).json({ error: '保存分类失败' });
      }
    } catch (error) {
      console.error('API删除分类出错:', error);
      return res.status(500).json({ error: '删除分类失败' });
    }
  }
  
  // 方法不允许
  else {
    res.setHeader('Allow', ['PATCH', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 