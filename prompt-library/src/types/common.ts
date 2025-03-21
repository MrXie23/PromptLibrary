/**
 * 提示词元数据
 */
export interface PromptMetadata {
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
  /** 是否精选 */
  featured: boolean;
  /** 是否新提示(已废弃，由getRecentPrompts基于创建时间动态判断) */
  isNew?: boolean;
  /** 评分 (1-10) */
  rating?: number;
}

/**
 * 提示词前置信息
 */
export interface PromptFrontmatter {
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 分类 */
  category: string;
  /** 标签 */
  tags: string[];
  /** 作者 */
  author: string;
}

/**
 * 完整提示词信息
 */
export interface Prompt extends PromptMetadata, PromptFrontmatter {
  /** 唯一标识 */
  slug: string;
  /** 内容 */
  content: string;
}

/**
 * 分类信息
 */
export interface CategoryData {
  /** 唯一标识 */
  slug: string;
  /** 名称 */
  name: string;
  /** 名称国际化键名 */
  nameKey?: string;
  /** 图标 */
  icon: string;
  /** 数量 */
  count?: number;
} 