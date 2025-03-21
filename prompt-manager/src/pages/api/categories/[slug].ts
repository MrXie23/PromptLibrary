import { NextApiRequest, NextApiResponse } from 'next';
import { CategoryData } from '@/types';
import { getAllCategories, updateCategory, deleteCategory } from '@/lib/categoryUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  
  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: '无效的分类标识' });
  }
  
  // 获取分类
  if (req.method === 'GET') {
    try {
      // 获取所有分类
      const categories = getAllCategories();
      
      // 查找指定的分类
      const category = categories.find(cat => cat.slug === slug);
      
      if (!category) {
        return res.status(404).json({ error: `找不到slug为${slug}的分类` });
      }
      
      return res.status(200).json(category);
    } catch (error) {
      console.error(`API获取分类 ${slug} 出错:`, error);
      return res.status(500).json({ error: '获取分类失败' });
    }
  }
  
  // 更新分类
  else if (req.method === 'PATCH') {
    try {
      const categoryData = req.body;
      
      if (!categoryData) {
        return res.status(400).json({ error: '缺少更新数据' });
      }
      
      // 更新分类
      const success = updateCategory(slug, categoryData);
      
      if (success) {
        // 获取更新后的分类
        const categories = getAllCategories();
        const updatedCategory = categories.find(cat => cat.slug === slug);
        
        return res.status(200).json({ 
          message: '分类更新成功',
          category: updatedCategory
        });
      } else {
        return res.status(500).json({ error: '更新分类失败' });
      }
    } catch (error) {
      console.error(`API更新分类 ${slug} 出错:`, error);
      return res.status(500).json({ error: '更新分类失败' });
    }
  }
  
  // 删除分类
  else if (req.method === 'DELETE') {
    try {
      // 删除分类
      const success = deleteCategory(slug);
      
      if (success) {
        return res.status(200).json({ message: '分类删除成功' });
      } else {
        return res.status(404).json({ error: `找不到slug为${slug}的分类` });
      }
    } catch (error) {
      console.error(`API删除分类 ${slug} 出错:`, error);
      return res.status(500).json({ error: '删除分类失败' });
    }
  }
  
  // 方法不允许
  else {
    res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 