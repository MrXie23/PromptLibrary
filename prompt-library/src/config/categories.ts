import { CategoryData } from '@/types';

// 类别配置
export const CATEGORIES: CategoryData[] = [
  { 
    slug: 'content-creation', 
    name: '内容创作', 
    nameKey: 'categories.content_creation',
    icon: 'fa-pen-fancy', 
    count: 0 
  },
  { 
    slug: 'programming', 
    name: '编程开发', 
    nameKey: 'categories.programming',
    icon: 'fa-code', 
    count: 0 
  },
  { 
    slug: 'creative-design', 
    name: '创意设计', 
    nameKey: 'categories.creative_design',
    icon: 'fa-palette', 
    count: 0 
  },
  { 
    slug: 'data-analysis', 
    name: '数据分析', 
    nameKey: 'categories.data_analysis',
    icon: 'fa-chart-line', 
    count: 0 
  },
  { 
    slug: 'marketing', 
    name: '营销推广', 
    nameKey: 'categories.marketing',
    icon: 'fa-bullhorn', 
    count: 0 
  },
  { 
    slug: 'education', 
    name: '教育学习', 
    nameKey: 'categories.education',
    icon: 'fa-graduation-cap', 
    count: 0 
  },
  { 
    slug: 'other', 
    name: '其他', 
    nameKey: 'categories.other',
    icon: 'fa-ellipsis', 
    count: 0 
  }
];

// 中文名称到英文slug的映射
export const CATEGORY_TO_SLUG: Record<string, string> = {
  '内容创作': 'content-creation',
  '编程开发': 'programming',
  '创意设计': 'creative-design',
  '数据分析': 'data-analysis',
  '营销推广': 'marketing',
  '教育学习': 'education',
  '其他': 'other'
};

// 英文slug到中文名称的映射
export const SLUG_TO_CATEGORY: Record<string, string> = {
  'content-creation': '内容创作',
  'programming': '编程开发',
  'creative-design': '创意设计',
  'data-analysis': '数据分析',
  'marketing': '营销推广',
  'education': '教育学习',
  'other': '其他'
}; 