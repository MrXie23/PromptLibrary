import { Metadata } from 'next';
import { getAllCategories } from '@/lib/prompts';
import dynamic from 'next/dynamic';

// 动态导入客户端组件
const CategoriesContent = dynamic(() => import('@/components/CategoriesContent'), {
  ssr: false,
  loading: () => (
    <main>
      <section className="page-header">
        <h1>提示词分类</h1>
        <p>按分类浏览我们的AI提示词集合，找到适合您特定需求的提示词</p>
      </section>

      <section className="categories-list skeleton-loading">
        <div className="category-container">
          {[...Array(9)].map((_, index) => (
            <div key={index} className="category-item skeleton"></div>
          ))}
        </div>
      </section>
    </main>
  )
});

export const metadata: Metadata = {
  title: '提示词分类 - Prompt Library',
  description: '按分类浏览我们的AI提示词集合，找到适合您特定需求的提示词',
};

export default function CategoriesPage() {
  const categories = getAllCategories();

  return <CategoriesContent categories={categories} />;
}