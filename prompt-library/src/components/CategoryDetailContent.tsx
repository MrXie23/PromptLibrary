"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '../lib/i18n';
import { useLanguage } from '../context/LanguageContext';
import { CategoryData, PromptData } from '@/types';
import dynamic from 'next/dynamic';

// 动态导入客户端组件，避免服务器端渲染错误
const PaginatedPrompts = dynamic(() => import('@/components/PaginatedPrompts'), { ssr: false });

interface CategoryDetailContentProps {
    category: CategoryData;
    categoryPrompts: PromptData[];
}

export default function CategoryDetailContent({ category, categoryPrompts }: CategoryDetailContentProps) {
    const { locale } = useLanguage();
    const { t, isLoaded } = useTranslation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded) {
            setLoading(false);
        }
    }, [isLoaded]);

    // 使用翻译键或直接使用名称
    const categoryName = category.nameKey ? t(category.nameKey) : category.name;

    // 只传递第一页数据作为初始数据
    const initialPageData = categoryPrompts.slice(0, 9);
    const totalPages = Math.ceil(categoryPrompts.length / 9);

    if (loading) {
        return (
            <main>
                <section className="page-header">
                    <Link href="/categories" className="back-link">
                        <i className="fa-solid fa-arrow-left"></i> ...
                    </Link>
                    <h1>...</h1>
                    <p>...</p>
                </section>
                <section className="prompts-list skeleton-loading">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="prompt-card skeleton"></div>
                    ))}
                </section>
            </main>
        );
    }

    return (
        <main>
            <section className="page-header">
                <Link href="/categories" className="back-link">
                    <i className="fa-solid fa-arrow-left"></i> {t('ui.back_to_categories')}
                </Link>
                <h1>{categoryName}</h1>
                <p>{t('categories.prompt_count_total', { count: categoryPrompts.length.toString() })}</p>
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
                        <p>{t('ui.no_prompts_in_category')}</p>
                        <Link href="/prompts" className="view-button">
                            {t('ui.browse_all_prompts')}
                        </Link>
                    </div>
                )}
            </section>
        </main>
    );
} 