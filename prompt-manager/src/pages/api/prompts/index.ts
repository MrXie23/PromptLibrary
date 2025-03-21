import { NextApiRequest, NextApiResponse } from 'next';
import { Prompt } from '@/types';
import { getPromptSlugs, createPrompt, getAllPrompts } from '@/lib/promptUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('API请求prompts - 方法:', req.method, '- 时间:', new Date().toISOString());
  
  // 获取所有提示的完整数据
  if (req.method === 'GET') {
    try {
      console.log('开始获取所有提示词...');
      const prompts = getAllPrompts();
      console.log(`API成功获取了${prompts.length}个提示词`);
      
      // 添加详细日志
      prompts.forEach((prompt, index) => {
        console.log(`提示词 ${index+1}: ${prompt.title} (${prompt.slug})`);
      });
      
      return res.status(200).json(prompts);
    } catch (error) {
      console.error('API获取提示列表出错:', error);
      return res.status(500).json({ error: '获取提示列表失败' });
    }
  }
  
  // 创建新提示
  else if (req.method === 'POST') {
    try {
      const promptData = req.body;
      
      if (!promptData || !promptData.title || !promptData.content) {
        return res.status(400).json({ error: '缺少必要的提示信息' });
      }
      
      // 检查是否提供了自定义文件名
      const customSlug = promptData.customFileName || undefined;
      
      // 创建新提示
      const newPrompt = createPrompt(promptData, customSlug);
      
      if (!newPrompt) {
        return res.status(500).json({ error: '创建提示失败' });
      }
      
      return res.status(201).json(newPrompt);
    } catch (error) {
      console.error('API创建提示出错:', error);
      return res.status(500).json({ error: '创建提示失败' });
    }
  }
  
  // 方法不允许
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 