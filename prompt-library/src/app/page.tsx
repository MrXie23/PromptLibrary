import { Metadata } from 'next';
import {
  getFeaturedPrompts,
  getRecentPrompts,
  getAllCategories
} from '@/lib/prompts';
import { PromptData } from '@/types';
import dynamic from 'next/dynamic';

// 动态导入客户端组件
const HomeContent = dynamic(() => import('@/components/HomeContent'), {
  ssr: false,
  loading: () => (
    <main>
      <section className="hero">
        <div className="hero-content">
          <h1 className="skeleton"></h1>
          <p className="skeleton"></p>
          <div className="search-container skeleton"></div>
        </div>
      </section>

      <section className="featured">
        <div className="section-header">
          <h2 className="skeleton"></h2>
          <div className="view-all skeleton"></div>
        </div>
        <div className="prompt-grid skeleton-loading">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="prompt-card skeleton"></div>
          ))}
        </div>
      </section>

      <section className="categories">
        <div className="section-header">
          <h2 className="skeleton"></h2>
        </div>
        <div className="category-container skeleton-loading">
          {[...Array(7)].map((_, index) => (
            <div key={index} className="category-item skeleton"></div>
          ))}
        </div>
      </section>
    </main>
  )
});

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

  return <HomeContent
    featuredPrompts={featuredPrompts}
    recentPrompts={recentPrompts}
    categories={categories}
  />;
}