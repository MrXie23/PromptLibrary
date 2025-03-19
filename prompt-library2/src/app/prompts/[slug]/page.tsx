import { Metadata } from 'next';
import { getPromptData, getAllPrompts } from '@/lib/prompts';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';


interface PromptPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PromptPageProps): Promise<Metadata> {
  const prompt = await getPromptData(params.slug);
  
  if (!prompt) {
    return {
      title: '提示词未找到 - Prompt Library',
    };
  }
  
  return {
    title: `${prompt.title} - Prompt Library`,
    description: prompt.description,
  };
}

export async function generateStaticParams() {
    const promptsDirectory = path.join(process.cwd(), 'prompts');
    const files = fs.readdirSync(promptsDirectory);
    
    const params = [];
    
    files.forEach((file) => {
        if (file.endsWith('.md')) {
            // 添加不带扩展名的路径
            params.push({
                slug: file.replace(/\.md$/, ''),
            });
            
            // 也添加带扩展名的路径
            params.push({
                slug: file,
            });
        }
    });
    
    return params;
}

export default async function PromptPage({ params }: PromptPageProps) {
  const prompt = await getPromptData(params.slug);
  
  if (!prompt) {
    notFound();
  }
  
  return (
    <main className="prompt-detail">
      <section className="prompt-header">
        <Link href="/prompts" className="back-link">
          <i className="fa-solid fa-arrow-left"></i> 返回所有提示词
        </Link>
        <h1>{prompt.title}</h1>
        <div className="prompt-meta">
          <span className="category">{prompt.category}</span>
          {prompt.rating && (
            <span className="popularity">
              <i className="fa-solid fa-star"></i> {prompt.rating}
            </span>
          )}
          {prompt.createdAt && (
            <span className="date">
              发布于: {new Date(prompt.createdAt).toLocaleDateString('zh-CN')}
            </span>
          )}
        </div>
      </section>
      
      <section className="prompt-content">
        <div className="description">
          <h2>描述</h2>
          <p>{prompt.description}</p>
        </div>
        
        <div className="content">
          <h2>提示词内容</h2>
          <div className="markdown-content" dangerouslySetInnerHTML={{ __html: prompt.content || '' }} />
        </div>
        
        <div className="usage">
          <h2>使用方法</h2>
          <p>将上述提示词复制到您喜欢的AI工具中，根据需要调整具体内容，然后开始创作！</p>
        </div>
      </section>
      
      <section className="prompt-actions">
        <button className="copy-button">
          <i className="fa-solid fa-copy"></i> 复制提示词
        </button>
        <button className="share-button">
          <i className="fa-solid fa-share-nodes"></i> 分享
        </button>
      </section>
    </main>
  );
}