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