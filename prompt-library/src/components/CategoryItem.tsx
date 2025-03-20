"use client";

import Link from 'next/link';
import { CategoryData } from '@/types';
import { useTranslation } from '../lib/i18n';
import { useLanguage } from '../context/LanguageContext';

interface CategoryItemProps {
  category: CategoryData;
}

export default function CategoryItem({ category }: CategoryItemProps) {
  const { locale } = useLanguage();
  const { t } = useTranslation();

  // 确保count有值
  const promptCount = category.count?.toString() || '0';
  // 使用翻译键或直接使用名称
  const categoryName = category.nameKey ? t(category.nameKey) : category.name;

  return (
    <Link href={`/categories/${category.slug}`} className="category-item">
      <div className="category-icon">
        <i className={`fa-solid ${category.icon}`}></i>
      </div>
      <div className="category-info">
        <h3>{categoryName}</h3>
        <p>{t('categories.prompts_count', { count: promptCount })}</p>
      </div>
    </Link>
  );
}