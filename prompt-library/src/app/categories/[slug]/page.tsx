import { Metadata } from 'next';
import { getAllCategories, getAllPrompts } from '@/lib/prompts';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SLUG_TO_CATEGORY } from '@/config/categories';
import dynamic from 'next/dynamic';

// 动态导入客户端组件，避免服务器端渲染错误
const PaginatedPrompts = dynamic(() => import('@/components/PaginatedPrompts'), { ssr: false });

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

  // 只传递第一页数据作为初始数据
  const initialPageData = categoryPrompts.slice(0, 9);
  const totalPages = Math.ceil(categoryPrompts.length / 9);

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
          <PaginatedPrompts
            type="category"
            category={category.name}
            initialData={initialPageData}
            initialMeta={{
              total: categoryPrompts.length,
              perPage: 9,
              totalPages: totalPages,
              category: category.name
            }}
          />
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