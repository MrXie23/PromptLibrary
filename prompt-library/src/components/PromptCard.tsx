"use client";

import Link from 'next/link';
import { PromptData } from '@/types';
import { useTranslation } from '../lib/i18n';
import { useLanguage } from '../context/LanguageContext';

interface PromptCardProps {
  prompt: PromptData;
  featured?: boolean;
  isNew?: boolean;
}

export default function PromptCard({ prompt, featured = false, isNew = false }: PromptCardProps) {
  const { locale } = useLanguage();
  const { t } = useTranslation();

  // 为分类名称映射到翻译键
  const getCategoryTranslationKey = (category: string) => {
    switch (category) {
      case '内容创作': return 'categories.content_creation';
      case '编程开发': return 'categories.programming';
      case '创意设计': return 'categories.creative_design';
      case '数据分析': return 'categories.data_analysis';
      case '营销推广': return 'categories.marketing';
      case '教育学习': return 'categories.education';
      case '其他': return 'categories.other';
      default: return '';
    }
  };

  // 确定分类名称显示方式
  const categoryKey = getCategoryTranslationKey(prompt.category);
  const categoryName = categoryKey ? t(categoryKey) : prompt.category;

  return (
    <div className={`prompt-card ${featured ? 'featured' : ''}`}>
      {featured && <div className="prompt-label">{t('prompt_card.featured')}</div>}
      {isNew && <div className="prompt-label new">{t('prompt_card.new')}</div>}
      <h3>{prompt.title}</h3>
      <p>{prompt.description}</p>
      <div className="prompt-meta">
        <span className="category">{categoryName}</span>
        {prompt.rating && (
          <span className="popularity">
            <i className="fa-solid fa-star"></i> {prompt.rating}
          </span>
        )}
        {prompt.createdAt && (
          <span className="date">{prompt.createdAt}</span>
        )}
      </div>
      <Link href={`/prompts/${prompt.slug}`} className="view-button" prefetch={true}>
        {t('prompt_card.view_button')}
      </Link>
    </div>
  );
}