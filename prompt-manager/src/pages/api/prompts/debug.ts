import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// 提示库路径
const promptsDirectory = path.join(process.cwd(), '..', 'prompt-library', 'prompts');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // 确保目录存在
      if (!fs.existsSync(promptsDirectory)) {
        return res.status(200).json({ 
          message: '提示目录不存在',
          directory: promptsDirectory,
          exists: false
        });
      }
      
      // 读取目录下的所有文件
      const files = fs.readdirSync(promptsDirectory);
      
      // 获取所有JSON文件
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      // 读取每个JSON文件的内容
      const metadataList = jsonFiles.map(file => {
        const filePath = path.join(promptsDirectory, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const metadata = JSON.parse(content);
        return {
          file,
          slug: file.replace('.json', ''),
          metadata
        };
      });
      
      // 检查对应的MD文件是否存在
      const mdFileStatus = jsonFiles.map(file => {
        const slug = file.replace('.json', '');
        const mdPath = path.join(promptsDirectory, `${slug}.md`);
        return {
          slug,
          mdExists: fs.existsSync(mdPath)
        };
      });
      
      return res.status(200).json({
        message: '成功获取提示元数据',
        directory: promptsDirectory,
        exists: true,
        fileCount: files.length,
        jsonCount: jsonFiles.length,
        metadataList,
        mdFileStatus
      });
    } catch (error: any) {
      console.error('API调试元数据出错:', error);
      return res.status(500).json({ error: '获取元数据失败', errorMessage: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 