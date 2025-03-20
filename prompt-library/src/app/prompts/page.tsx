import { Metadata } from 'next';
import { getAllPrompts } from '@/lib/prompts';
import PromptCard from '@/components/PromptCard';
import Link from 'next/link';
import { PromptData } from '@/types';

export const metadata: Metadata = {
  title: '所有提示词 - Prompt Library',
  description: '浏览我们完整的AI提示词集合，找到适合您需求的完美提示词',
};

// 备用示例数据，在构建时无法读取文件系统时使用
const fallbackPrompts: PromptData[] = [
  {
    slug: 'professional-article-generator',
    title: '专业文章生成器',
    description: '创建结构化、专业的文章，包含引人入胜的标题、精确的小标题和丰富的内容。',
    category: '内容创作',
    rating: 9.8,
    createdAt: '2023-01-15',
    featured: true
  },
  {
    slug: 'code-optimization-assistant',
    title: '代码优化助手',
    description: '分析并优化您的代码，提供性能改进建议和最佳实践指导。',
    category: '编程开发',
    rating: 9.5,
    createdAt: '2023-01-20',
    featured: true
  }
];

export default function PromptsPage() {
  // 获取所有提示词（带错误处理）
  let allPrompts: PromptData[] = [];
  try {
    allPrompts = getAllPrompts();
    // 如果没有获取到任何提示词，使用备用数据
    if (allPrompts.length === 0) {
      allPrompts = fallbackPrompts;
    }
  } catch (error) {
    console.error('获取提示词数据时出错:', error);
    // 错误处理 - 使用备用数据
    allPrompts = fallbackPrompts;
  }

  return (
    <main>
      <section className="page-header">
        <h1>所有提示词</h1>
        <p>浏览我们完整的AI提示词集合，找到适合您需求的完美提示词</p>
      </section>

      <section className="prompts-list">
        <div className="prompt-grid">
          {allPrompts.map(prompt => (
            <PromptCard
              key={prompt.slug}
              prompt={prompt}
              featured={prompt.featured}
              isNew={prompt.isNew}
            />
          ))}
        </div>
      </section>
    </main>
  );
}