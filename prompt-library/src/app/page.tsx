import { Metadata } from 'next';
import Hero from '@/components/Hero';
import PromptCard from '@/components/PromptCard';
import CategoryItem from '@/components/CategoryItem';
import Subscribe from '@/components/Subscribe';
import Link from 'next/link';
import {
  getFeaturedPrompts,
  getRecentPrompts,
  getAllCategories
} from '@/lib/prompts';
import { PromptData } from '@/types';

export const metadata: Metadata = {
  title: 'Prompt Library - AI提示词库',
  description: '发现和使用高质量的AI提示词集合，提升您与人工智能的交互效率',
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

// 添加静态生成标志
export const revalidate = 3600; // 每小时重新生成一次页面

export default function Home() {
  // 获取数据（带错误处理）
  let featuredPrompts: PromptData[] = [];
  let recentPrompts: PromptData[] = [];

  try {
    featuredPrompts = getFeaturedPrompts();
    if (featuredPrompts.length === 0) {
      featuredPrompts = fallbackPrompts;
    }
  } catch (error) {
    console.error('获取热门提示词时出错:', error);
    featuredPrompts = fallbackPrompts;
  }

  try {
    recentPrompts = getRecentPrompts();
    if (recentPrompts.length === 0) {
      recentPrompts = fallbackPrompts;
    }
  } catch (error) {
    console.error('获取最新提示词时出错:', error);
    recentPrompts = fallbackPrompts;
  }

  const categories = getAllCategories();

  return (
    <main>
      <Hero />

      {/* 特色提示词 */}
      <section className="featured">
        <div className="section-header">
          <h2>精选提示词</h2>
          <Link href="/prompts/popular" className="view-all" prefetch={true}>
            查看热门 <i className="fa-solid fa-chevron-right"></i>
          </Link>
        </div>
        <div className="prompt-grid">
          {featuredPrompts.map((prompt, index) => (
            <PromptCard
              key={prompt.slug}
              prompt={prompt}
              featured={index === 0}
            />
          ))}
        </div>
      </section>

      {/* 分类浏览 */}
      <section className="categories">
        <div className="section-header">
          <h2>按分类浏览</h2>
        </div>
        <div className="category-container">
          {categories.map(category => (
            <CategoryItem key={category.slug} category={category} />
          ))}
        </div>
      </section>

      {/* 最近添加 */}
      <section className="recent">
        <div className="section-header">
          <h2>最近添加</h2>
          <Link href="/prompts" className="view-all" prefetch={true}>
            查看全部 <i className="fa-solid fa-chevron-right"></i>
          </Link>
        </div>
        <div className="prompt-grid">
          {recentPrompts.map(prompt => (
            <PromptCard
              key={prompt.slug}
              prompt={prompt}
              isNew={true}
            />
          ))}
        </div>
      </section>

      {/* 订阅区域
      <Subscribe /> */}
    </main>
  );
}