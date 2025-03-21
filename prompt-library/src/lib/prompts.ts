import { Prompt, PromptData, CategoryData } from '@/types';
import { 
  getAllPrompts as getPrompts, 
  getPromptBySlug,
  getPromptContentHtml,
  getFeaturedPrompts as getFeatured,
  getRecentPrompts as getRecent
} from './promptUtils';

// 转换 Prompt 类型到 PromptData 类型（向下兼容）
function convertToPromptData(prompt: Prompt): PromptData {
  return {
    slug: prompt.slug,
    title: prompt.title,
    description: prompt.description,
    category: prompt.category,
    content: prompt.content,
    rating: prompt.rating,
    createdAt: prompt.createdAt,
    featured: prompt.featured,
    isNew: prompt.isNew
  };
}

/**
 * 获取所有提示词
 * @returns 所有提示词数据
 */
export function getAllPrompts(): PromptData[] {
  return getPrompts().map(convertToPromptData);
}

/**
 * 获取提示词详情
 * @param slug 提示词slug
 * @returns 提示词详情
 */
export async function getPromptData(slug: string): Promise<PromptData | null> {
  const prompt = getPromptBySlug(slug);
  if (!prompt) return null;
  
  // 获取HTML内容
  const contentHtml = await getPromptContentHtml(slug);
  
  return {
    ...convertToPromptData(prompt),
    content: contentHtml
  };
}

/**
 * 获取精选提示词
 * @returns 精选提示词列表
 */
export function getFeaturedPrompts(): PromptData[] {
  return getFeatured().map(convertToPromptData);
}

/**
 * 获取最新提示词
 * @returns 最新提示词列表
 */
export function getRecentPrompts(): PromptData[] {
  return getRecent().map(convertToPromptData);
}

// 导出所有分类相关函数
export { getAllCategories } from './categoryUtils';