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

export const metadata: Metadata = {
  title: 'Prompt Library - 探索AI提示的艺术',
  description: '探索、使用并分享经过精心策划的提示词库，释放AI的全部潜力',
};

export default function Home() {
  const featuredPrompts = getFeaturedPrompts();
  const recentPrompts = getRecentPrompts();
  const categories = getAllCategories();
  
  return (
    <main>
      <Hero />
      
      {/* 特色提示词 */}
      <section className="featured">
        <div className="section-header">
          <h2>精选提示词</h2>
          <Link href="/prompts" className="view-all">
            查看全部 <i className="fa-solid fa-chevron-right"></i>
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
          <Link href="/prompts" className="view-all">
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
      
      {/* 订阅区域 */}
      <Subscribe />
    </main>
  );
}