import { Metadata } from 'next';
import { getAllCategories, getAllPrompts } from '@/lib/prompts';
import PromptCard from '@/components/PromptCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SLUG_TO_CATEGORY } from '@/config/categories';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categories = getAllCategories();
  const category = categories.find(cat => cat.slug === params.slug);

  if (!category) {
    return {
      title: '分类未找到 - Prompt Library',
    };
  }

  return {
    title: `${category.name} - Prompt Library`,
    description: `浏览${category.name}分类下的AI提示词集合，帮助您提升${category.name}相关任务的效率`,
  };
}

export async function generateStaticParams() {
  const categories = getAllCategories();

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categories = getAllCategories();
  const category = categories.find(cat => cat.slug === params.slug);

  if (!category) {
    notFound();
  }

  const allPrompts = getAllPrompts();
  const categoryPrompts = allPrompts.filter(prompt =>
    prompt.category === SLUG_TO_CATEGORY[category.slug] ||
    prompt.category === category.name
  );

  return (
    <main>
      <section className="page-header">
        <Link href="/categories" className="back-link">
          <i className="fa-solid fa-arrow-left"></i> 返回所有分类
        </Link>
        <h1>{category.name}</h1>
        <p>共有 {categoryPrompts.length} 个提示词</p>
      </section>

      <section className="prompts-list">
        {categoryPrompts.length > 0 ? (
          <div className="prompt-grid">
            {categoryPrompts.map(prompt => (
              <PromptCard
                key={prompt.slug}
                prompt={prompt}
                featured={prompt.featured}
                isNew={prompt.isNew}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>该分类下暂无提示词</p>
            <Link href="/prompts" className="view-button">
              浏览所有提示词
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}