export interface PromptMetadata {
  views: number;
  likes: number;
  usageCount: number;
  favoriteCount: number;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  isNew: boolean;
}

export interface PromptFrontmatter {
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
}

export interface Prompt extends PromptMetadata, PromptFrontmatter {
  slug: string;
  content: string;
}

export interface CategoryData {
  slug: string;
  name: string;
  icon: string;
  count?: number;
} 