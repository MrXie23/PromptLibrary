import { Prompt, PromptMetadata, PromptFrontmatter } from '@/types';

// API URL的基础路径
const API_BASE_URL = '/api';

export async function getPromptSlugs(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/prompts`);
    if (!response.ok) {
      throw new Error(`获取提示列表失败: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('获取提示列表出错:', error);
    return [];
  }
}

export async function getPromptBySlug(slug: string): Promise<Prompt | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/prompts/${slug}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`获取提示失败: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`获取提示 ${slug} 出错:`, error);
    return null;
  }
}

export async function getAllPrompts(): Promise<Prompt[]> {
  try {
    const slugs = await getPromptSlugs();
    const promisedPrompts = slugs.map(slug => getPromptBySlug(slug));
    const prompts = await Promise.all(promisedPrompts);
    
    // 过滤掉null值并排序
    return prompts
      .filter((prompt): prompt is Prompt => prompt !== null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('获取所有提示出错:', error);
    return [];
  }
}

export async function savePrompt(prompt: Prompt): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/prompts/${prompt.slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prompt),
    });
    
    if (!response.ok) {
      throw new Error(`保存提示失败: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('保存提示出错:', error);
    return false;
  }
}

export async function deletePrompt(slug: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/prompts/${slug}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`删除提示失败: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error(`删除提示 ${slug} 出错:`, error);
    return false;
  }
}

export async function createNewPrompt(promptData: Omit<Prompt, 'slug'>): Promise<Prompt | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/prompts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(promptData),
    });
    
    if (!response.ok) {
      throw new Error(`创建提示失败: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('创建提示出错:', error);
    return null;
  }
}

export async function getFeaturedPrompts(limit: number = 5): Promise<Prompt[]> {
  try {
    const allPrompts = await getAllPrompts();
    
    // 过滤出精选提示并限制数量
    return allPrompts
      .filter(prompt => prompt.featured)
      .slice(0, limit);
  } catch (error) {
    console.error('获取精选提示出错:', error);
    return [];
  }
}

export async function getNewPrompts(limit: number = 5): Promise<Prompt[]> {
  try {
    const allPrompts = await getAllPrompts();
    console.log(`获取到 ${allPrompts.length} 个提示`);
    
    // 记录每个提示的isNew状态
    allPrompts.forEach(prompt => {
      console.log(`提示 ${prompt.slug}: isNew=${prompt.isNew}, createdAt=${prompt.createdAt}`);
    });
    
    // 仅过滤出标记为isNew的提示，并按创建时间降序排列
    const newPrompts = allPrompts
      .filter(prompt => prompt.isNew)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
    
    console.log(`过滤后得到 ${newPrompts.length} 个新提示`);
    return newPrompts;
  } catch (error) {
    console.error('获取最新提示出错:', error);
    return [];
  }
} 