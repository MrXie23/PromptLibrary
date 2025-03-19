import { Metadata } from 'next';
import { getAllCategories } from '@/lib/prompts';
import CategoryItem from '@/components/CategoryItem';

export const metadata: Metadata = {
  title: '提示词分类 - Prompt Library',
  description: '按分类浏览我们的AI提示词集合，找到适合您特定需求的提示词',
};

export default function CategoriesPage() {
  const categories = getAllCategories();
  
  return (
    <main>
      <section className="page-header">
        <h1>提示词分类</h1>
        <p>按分类浏览我们的AI提示词集合，找到适合您特定需求的提示词</p>
      </section>
      
      <section className="categories-list">
        <div className="category-container">
          {categories.map(category => (
            <CategoryItem key={category.slug} category={category} />
          ))}
        </div>
      </section>
    </main>
  );
}