// 导出所有通用类型
export * from './common';

// 为了保持兼容性的旧类型定义，可以在后续版本中移除
export interface PromptData {
    slug: string;
    title: string;
    description: string;
    category: string;
    content?: string;
    rating?: number;
    createdAt?: string;
    featured?: boolean;
    isNew?: boolean;
  }
  
  export interface CategoryData {
    slug: string;
    name: string;
    nameKey?: string;
    icon: string;
    count?: number;
  }