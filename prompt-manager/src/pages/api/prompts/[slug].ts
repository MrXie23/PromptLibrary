import { NextApiRequest, NextApiResponse } from 'next';
import { Prompt } from '@/types';
import { getPromptBySlug, updatePrompt, deletePrompt } from '@/lib/promptUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  
  console.log(`API请求单个提示 - slug: ${slug}, 方法: ${req.method}, 时间: ${new Date().toISOString()}`);
  
  if (!slug || typeof slug !== 'string') {
    console.error('无效的slug参数:', slug);
    return res.status(400).json({ error: '无效的提示标识' });
  }
  
  // 获取提示
  if (req.method === 'GET') {
    try {
      console.log(`尝试获取提示: ${slug}`);
      const prompt = getPromptBySlug(slug);
      
      if (!prompt) {
        console.error(`找不到slug为${slug}的提示`);
        return res.status(404).json({ error: `找不到slug为${slug}的提示` });
      }
      
      console.log(`成功获取提示: ${prompt.title}`);
      return res.status(200).json(prompt);
    } catch (error) {
      console.error(`API获取提示 ${slug} 出错:`, error);
      return res.status(500).json({ error: '获取提示失败' });
    }
  }
  
  // 更新提示
  else if (req.method === 'PUT') {
    try {
      const promptData = req.body;
      
      if (!promptData) {
        return res.status(400).json({ error: '缺少更新数据' });
      }
      
      // 检查提示是否存在
      const existingPrompt = getPromptBySlug(slug);
      if (!existingPrompt) {
        return res.status(404).json({ error: `找不到slug为${slug}的提示` });
      }
      
      // 更新提示
      const success = updatePrompt(slug, promptData);
      
      if (success) {
        const updatedPrompt = getPromptBySlug(slug);
        return res.status(200).json({ 
          message: '提示更新成功',
          prompt: updatedPrompt
        });
      } else {
        return res.status(500).json({ error: '保存提示失败' });
      }
    } catch (error) {
      console.error(`API更新提示 ${slug} 出错:`, error);
      return res.status(500).json({ error: '更新提示失败' });
    }
  }
  
  // 删除提示
  else if (req.method === 'DELETE') {
    try {
      // 检查提示是否存在
      const existingPrompt = getPromptBySlug(slug);
      if (!existingPrompt) {
        return res.status(404).json({ error: `找不到slug为${slug}的提示` });
      }
      
      // 删除提示文件
      const success = deletePrompt(slug);
      
      if (success) {
        return res.status(200).json({ message: '提示删除成功' });
      } else {
        return res.status(500).json({ error: '删除提示失败' });
      }
    } catch (error) {
      console.error(`API删除提示 ${slug} 出错:`, error);
      return res.status(500).json({ error: '删除提示失败' });
    }
  }
  
  // 方法不允许
  else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 