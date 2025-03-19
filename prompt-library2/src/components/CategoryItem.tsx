import Link from 'next/link';
import { CategoryData } from '@/types';

interface CategoryItemProps {
  category: CategoryData;
}

export default function CategoryItem({ category }: CategoryItemProps) {
  return (
    <Link href={`/categories/${category.slug}`} className="category-item">
      <div className="category-icon">
        <i className={`fa-solid ${category.icon}`}></i>
      </div>
      <div className="category-info">
        <h3>{category.name}</h3>
        <p>{category.count}个提示词</p>
      </div>
    </Link>
  );
}