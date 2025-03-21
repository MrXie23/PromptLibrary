import fs from 'fs';
import path from 'path';
import { CategoryData } from '@/types';
import { safeReadFile, safeWriteFile, safeParseJson } from './utils';
import { getAllPrompts } from './promptUtils';
import { CATEGORIES } from '@/config/categories';

// 分类配置文件路径
const CATEGORIES_FILE_PATH = path.join(process.cwd(), 'src', 'config', 'categories.json');

/**
 * 获取所有分类数据
 * @returns 所有分类数据
 */
export function getAllCategories(): CategoryData[] {
  // 首先尝试从配置文件读取
  try {
    if (fs.existsSync(CATEGORIES_FILE_PATH)) {
      const fileContent = safeReadFile(CATEGORIES_FILE_PATH);
      const categories = safeParseJson<CategoryData[]>(fileContent, []);
      if (categories.length > 0) {
        return updateCategoryCounts(categories);
      }
    }
  } catch (error) {
    console.error('读取分类配置文件失败:', error);
  }
  
  // 如果配置文件不存在或读取失败，使用默认分类
  return updateCategoryCounts([...CATEGORIES]);
}

/**
 * 更新分类计数
 * @param categories 分类数据
 * @returns 更新后的分类数据
 */
function updateCategoryCounts(categories: CategoryData[]): CategoryData[] {
  const prompts = getAllPrompts();
  
  // 统计每个分类的提示词数量
  const categoryCounts: Record<string, number> = {};
  
  // 按分类名称统计
  prompts.forEach(prompt => {
    if (prompt.category) {
      categoryCounts[prompt.category] = (categoryCounts[prompt.category] || 0) + 1;
    }
  });
  
  // 按slug统计
  const slugCounts: Record<string, number> = {};
  prompts.forEach(prompt => {
    if (prompt.category) {
      // 查找对应分类的slug
      const category = categories.find(cat => cat.name === prompt.category);
      if (category) {
        slugCounts[category.slug] = (slugCounts[category.slug] || 0) + 1;
      }
    }
  });
  
  // 更新分类计数
  return categories.map(category => {
    const count = slugCounts[category.slug] || categoryCounts[category.name] || 0;
    return { ...category, count };
  });
}

/**
 * 保存分类配置
 * @param categories 分类数据
 * @returns 是否保存成功
 */
export function saveCategories(categories: CategoryData[]): boolean {
  try {
    // 确保目录存在
    const dir = path.dirname(CATEGORIES_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // 保存分类数据
    return safeWriteFile(CATEGORIES_FILE_PATH, JSON.stringify(categories, null, 2));
  } catch (error) {
    console.error('保存分类配置失败:', error);
    return false;
  }
}

/**
 * 添加新分类
 * @param category 分类数据
 * @returns 是否添加成功
 */
export function addCategory(category: Omit<CategoryData, 'count'>): boolean {
  try {
    const categories = getAllCategories();
    
    // 检查是否已存在同名分类
    if (categories.some(c => c.slug === category.slug)) {
      console.error(`分类 ${category.slug} 已存在`);
      return false;
    }
    
    // 添加新分类
    categories.push({ ...category, count: 0 });
    
    // 保存更新后的分类
    return saveCategories(categories);
  } catch (error) {
    console.error('添加分类失败:', error);
    return false;
  }
}

/**
 * 更新分类
 * @param slug 分类slug
 * @param categoryData 更新的分类数据
 * @returns 是否更新成功
 */
export function updateCategory(
  slug: string, 
  categoryData: Partial<Omit<CategoryData, 'count'>>
): boolean {
  try {
    const categories = getAllCategories();
    
    // 查找分类索引
    const index = categories.findIndex(c => c.slug === slug);
    if (index === -1) {
      console.error(`找不到分类 ${slug}`);
      return false;
    }
    
    // 更新分类
    categories[index] = { 
      ...categories[index], 
      ...categoryData 
    };
    
    // 保存更新后的分类
    return saveCategories(categories);
  } catch (error) {
    console.error(`更新分类 ${slug} 失败:`, error);
    return false;
  }
}

/**
 * 删除分类
 * @param slug 分类slug
 * @returns 是否删除成功
 */
export function deleteCategory(slug: string): boolean {
  try {
    const categories = getAllCategories();
    
    // 过滤掉要删除的分类
    const updatedCategories = categories.filter(c => c.slug !== slug);
    
    // 检查是否有变化
    if (updatedCategories.length === categories.length) {
      console.error(`找不到分类 ${slug}`);
      return false;
    }
    
    // 保存更新后的分类
    return saveCategories(updatedCategories);
  } catch (error) {
    console.error(`删除分类 ${slug} 失败:`, error);
    return false;
  }
} 