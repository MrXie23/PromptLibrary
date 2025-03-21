import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Prompt, PromptFrontmatter, PromptMetadata } from '@/types';
import { 
  PROMPTS_DIRECTORY, 
  ensureDirectoryExists,
  safeReadFile,
  safeWriteFile,
  safeDeleteFile,
  safeParseJson,
  generateUniqueSlug
} from './utils';

// 确保提示词目录存在
ensureDirectoryExists(PROMPTS_DIRECTORY);

/**
 * 获取所有提示词的slug列表
 * @returns 所有提示词的slug列表
 */
export function getPromptSlugs(): string[] {
  try {
    // 读取目录下的所有文件
    const files = fs.readdirSync(PROMPTS_DIRECTORY);
    
    // 过滤出.md文件并去掉扩展名
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace(/\.md$/, ''));
  } catch (error) {
    console.error('获取提示文件列表出错:', error);
    return [];
  }
}

/**
 * 获取所有提示词数据
 * @returns 所有提示词数据
 */
export function getAllPrompts(): Prompt[] {
  const slugs = getPromptSlugs();
  const prompts = slugs.map(slug => getPromptBySlug(slug))
    .filter((prompt): prompt is Prompt => prompt !== null);
  
  // 按创建日期排序，最新的排在前面
  return prompts.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });
}

/**
 * 根据slug获取提示词数据
 * @param slug 提示词slug
 * @returns 提示词数据或null
 */
export function getPromptBySlug(slug: string): Prompt | null {
  try {
    // 清理slug，移除可能的扩展名
    const cleanSlug = slug.replace(/\.md$/, '');
    
    // 检查.md文件是否存在
    const mdPath = path.join(PROMPTS_DIRECTORY, `${cleanSlug}.md`);
    if (!fs.existsSync(mdPath)) {
      return null;
    }
    
    // 读取.md文件
    const fileContent = safeReadFile(mdPath);
    const { data, content } = matter(fileContent);
    
    // 读取元数据文件
    const metadataPath = path.join(PROMPTS_DIRECTORY, `${cleanSlug}.json`);
    const metadataContent = safeReadFile(metadataPath);
    const metadata = safeParseJson<Partial<PromptMetadata>>(metadataContent, {});
    
    // 构建完整的提示词对象
    return {
      slug: cleanSlug,
      title: data.title || '',
      description: data.description || '',
      category: data.category || '',
      author: data.author || '',
      tags: data.tags || [],
      content,
      createdAt: data.createdAt || metadata.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || metadata.updatedAt || data.createdAt || metadata.createdAt || new Date().toISOString(),
      views: metadata.views || 0,
      likes: metadata.likes || 0,
      usageCount: metadata.usageCount || 0,
      favoriteCount: metadata.favoriteCount || 0,
      featured: metadata.featured || false,
      rating: metadata.rating || 0
    };
  } catch (error) {
    console.error(`获取提示 ${slug} 出错:`, error);
    return null;
  }
}

/**
 * 获取提示词内容（处理为HTML）
 * @param slug 提示词slug
 * @returns 提示词HTML内容
 */
export async function getPromptContentHtml(slug: string): Promise<string> {
  const prompt = getPromptBySlug(slug);
  if (!prompt) return '';
  
  // 处理Markdown内容为HTML
  const processedContent = await remark()
    .use(html)
    .process(prompt.content);
    
  return processedContent.toString();
}

/**
 * 创建新的提示词
 * @param promptData 提示词数据（不含slug）
 * @param customSlug 自定义slug（可选）
 * @returns 创建的提示词数据或null
 */
export function createPrompt(
  promptData: Omit<Prompt, 'slug'>, 
  customSlug?: string
): Prompt | null {
  try {
    // 生成或使用自定义slug
    const slug = customSlug || generateUniqueSlug(promptData.title);
    
    // 创建front matter数据
    const frontmatter: PromptFrontmatter = {
      title: promptData.title,
      description: promptData.description,
      category: promptData.category,
      author: promptData.author,
      tags: promptData.tags,
    };
    
    // 使用字符串格式生成markdown文件内容
    const content = promptData.content || '';
    const yamlFrontmatter = Object.entries(frontmatter)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: [${value.map(v => `"${v}"`).join(', ')}]`;
        }
        return `${key}: "${value}"`;
      })
      .join('\n');

    const markdownContent = `---\n${yamlFrontmatter}\n---\n\n${content}`;
    
    // 保存.md文件
    const mdPath = path.join(PROMPTS_DIRECTORY, `${slug}.md`);
    if (!safeWriteFile(mdPath, markdownContent)) {
      return null;
    }
    
    // 准备元数据
    const metadata: PromptMetadata = {
      featured: promptData.featured,
      createdAt: promptData.createdAt,
      updatedAt: promptData.updatedAt,
      rating: promptData.rating,
    };
    
    // 保存元数据文件
    const metadataPath = path.join(PROMPTS_DIRECTORY, `${slug}.json`);
    if (!safeWriteFile(metadataPath, JSON.stringify(metadata, null, 2))) {
      // 如果元数据保存失败，删除已创建的md文件
      safeDeleteFile(mdPath);
      return null;
    }
    
    // 返回完整的提示词数据
    return {
      ...promptData,
      slug,
    };
  } catch (error) {
    console.error('创建提示词出错:', error);
    return null;
  }
}

/**
 * 更新提示词
 * @param slug 提示词slug
 * @param promptData 更新的数据
 * @returns 是否更新成功
 */
export function updatePrompt(slug: string, promptData: Partial<Prompt>): boolean {
  try {
    // 获取现有提示词
    const existingPrompt = getPromptBySlug(slug);
    if (!existingPrompt) {
      return false;
    }
    
    // 合并数据
    const updatedPrompt = {
      ...existingPrompt,
      ...promptData,
      slug, // 确保slug不变
      updatedAt: new Date().toISOString(), // 更新修改时间
    };
    
    // 创建front matter
    const frontmatter: PromptFrontmatter = {
      title: updatedPrompt.title,
      description: updatedPrompt.description,
      category: updatedPrompt.category,
      author: updatedPrompt.author,
      tags: updatedPrompt.tags,
    };
    
    // 生成markdown内容
    const content = updatedPrompt.content || '';
    const yamlFrontmatter = Object.entries(frontmatter)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: [${value.map(v => `"${v}"`).join(', ')}]`;
        }
        return `${key}: "${value}"`;
      })
      .join('\n');

    const markdownContent = `---\n${yamlFrontmatter}\n---\n\n${content}`;
    
    // 更新.md文件
    const mdPath = path.join(PROMPTS_DIRECTORY, `${slug}.md`);
    if (!safeWriteFile(mdPath, markdownContent)) {
      return false;
    }
    
    // 更新元数据
    const metadata: PromptMetadata = {
      featured: updatedPrompt.featured,
      createdAt: updatedPrompt.createdAt,
      updatedAt: updatedPrompt.updatedAt,
      rating: updatedPrompt.rating,
    };
    
    // 保存元数据文件
    const metadataPath = path.join(PROMPTS_DIRECTORY, `${slug}.json`);
    return safeWriteFile(metadataPath, JSON.stringify(metadata, null, 2));
  } catch (error) {
    console.error(`更新提示词 ${slug} 出错:`, error);
    return false;
  }
}

/**
 * 删除提示词
 * @param slug 提示词slug
 * @returns 是否删除成功
 */
export function deletePrompt(slug: string): boolean {
  try {
    const mdPath = path.join(PROMPTS_DIRECTORY, `${slug}.md`);
    const jsonPath = path.join(PROMPTS_DIRECTORY, `${slug}.json`);
    
    // 删除两个文件
    const mdDeleted = safeDeleteFile(mdPath);
    const jsonDeleted = safeDeleteFile(jsonPath);
    
    // 只要有一个文件删除成功，就认为删除操作成功
    return mdDeleted || jsonDeleted;
  } catch (error) {
    console.error(`删除提示词 ${slug} 出错:`, error);
    return false;
  }
}

/**
 * 获取精选提示词
 * @param limit 限制数量
 * @returns 精选提示词列表
 */
export function getFeaturedPrompts(limit: number = 3): Prompt[] {
  const allPrompts = getAllPrompts();
  // 只返回featured=true的提示，并按评分降序排序
  return allPrompts
    .filter(prompt => prompt.featured)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit);
}

/**
 * 获取最新提示词
 * @param limit 限制数量
 * @returns 最新提示词列表
 */
export function getRecentPrompts(limit: number = 9): Prompt[] {
  const allPrompts = getAllPrompts();
  // 确保按创建日期降序排序（最新的排在前面）
  return allPrompts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

/**
 * 按分类获取提示词
 * @param category 分类名称
 * @returns 该分类下的提示词列表
 */
export function getPromptsByCategory(category: string): Prompt[] {
  const allPrompts = getAllPrompts();
  return allPrompts.filter(prompt => prompt.category === category);
} 