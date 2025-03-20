import { CategoryData } from '@/types';

// API URL的基础路径
const API_BASE_URL = '/api';

export async function getAllCategories(): Promise<CategoryData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error(`获取分类列表失败: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('获取分类列表出错:', error);
    return [];
  }
}

export async function saveCategories(categories: CategoryData[]): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categories),
    });
    
    if (!response.ok) {
      throw new Error(`保存分类列表失败: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('保存分类列表出错:', error);
    return false;
  }
}

export async function addCategory(category: Omit<CategoryData, 'count'>): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });
    
    if (!response.ok) {
      throw new Error(`添加分类失败: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('添加分类出错:', error);
    return false;
  }
}

export async function updateCategory(slug: string, category: Partial<Omit<CategoryData, 'count'>>): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${slug}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });
    
    if (!response.ok) {
      throw new Error(`更新分类失败: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('更新分类出错:', error);
    return false;
  }
}

export async function deleteCategory(slug: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${slug}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`删除分类失败: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('删除分类出错:', error);
    return false;
  }
} 