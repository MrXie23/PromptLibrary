import { NextApiRequest, NextApiResponse } from 'next';
import { CategoryData } from '@/types';
import { getAllCategories, saveCategories, addCategory } from '@/lib/categoryUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 获取所有分类
  if (req.method === 'GET') {
    try {
      // 获取分类列表
      const categories = getAllCategories();
      return res.status(200).json(categories);
    } catch (error) {
      console.error('API获取分类列表出错:', error);
      return res.status(500).json({ error: '获取分类列表失败' });
    }
  }
  
  // 更新分类列表
  else if (req.method === 'PUT') {
    try {
      const categories = req.body;
      
      if (!Array.isArray(categories)) {
        return res.status(400).json({ error: '无效的分类数据' });
      }
      
      // 保存分类
      const success = saveCategories(categories);
      
      if (success) {
        return res.status(200).json({ message: '分类列表更新成功' });
      } else {
        return res.status(500).json({ error: '保存分类列表失败' });
      }
    } catch (error) {
      console.error('API更新分类列表出错:', error);
      return res.status(500).json({ error: '更新分类列表失败' });
    }
  }
  
  // 添加新分类
  else if (req.method === 'POST') {
    try {
      const categoryData = req.body;
      
      if (!categoryData || !categoryData.slug || !categoryData.name || !categoryData.icon) {
        return res.status(400).json({ error: '缺少必要的分类信息' });
      }
      
      // 添加新分类
      const success = addCategory(categoryData);
      
      if (success) {
        return res.status(201).json({ message: '分类添加成功' });
      } else {
        return res.status(500).json({ error: '添加分类失败' });
      }
    } catch (error) {
      console.error('API添加分类出错:', error);
      return res.status(500).json({ error: '添加分类失败' });
    }
  }
  
  // 方法不允许
  else {
    res.setHeader('Allow', ['GET', 'PUT', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 