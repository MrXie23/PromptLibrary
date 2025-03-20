import { CategoryData } from '@/types';

// 类别配置
export const CATEGORIES: CategoryData[] = [
  { slug: 'content-creation', name: '内容创作', icon: 'fa-pen-fancy' },
  { slug: 'programming', name: '编程开发', icon: 'fa-code' },
  { slug: 'creative-design', name: '创意设计', icon: 'fa-palette' },
  { slug: 'data-analysis', name: '数据分析', icon: 'fa-chart-line' },
  { slug: 'marketing', name: '营销推广', icon: 'fa-bullhorn' },
  { slug: 'education', name: '教育学习', icon: 'fa-graduation-cap' },
  { slug: 'other', name: '其他', icon: 'fa-ellipsis' }
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