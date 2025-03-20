"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PromptCard from '@/components/PromptCard';
import CategoryItem from '@/components/CategoryItem';
import Hero from '@/components/Hero';
import { PromptData, CategoryData } from '@/types';
import { useTranslation } from '../lib/i18n';
import { useLanguage } from '../context/LanguageContext';

interface HomeContentProps {
    featuredPrompts: PromptData[];
    recentPrompts: PromptData[];
    categories: CategoryData[];
}

export default function HomeContent({ featuredPrompts, recentPrompts, categories }: HomeContentProps) {
    const { locale } = useLanguage();
    const { t, isLoaded } = useTranslation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded) {
            setLoading(false);
        }
    }, [isLoaded]);

    if (loading) {
        return (
            <main>
                <Hero />

                {/* 特色提示词 */}
                <section className="featured">
                    <div className="section-header">
                        <h2>...</h2>
                        <div className="view-all skeleton"></div>
                    </div>
                    <div className="prompt-grid skeleton-loading">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="prompt-card skeleton"></div>
                        ))}
                    </div>
                </section>

                {/* 分类浏览 */}
                <section className="categories">
                    <div className="section-header">
                        <h2>...</h2>
                    </div>
                    <div className="category-container skeleton-loading">
                        {[...Array(categories.length)].map((_, index) => (
                            <div key={index} className="category-item skeleton"></div>
                        ))}
                    </div>
                </section>

                {/* 最近添加 */}
                <section className="recent">
                    <div className="section-header">
                        <h2>...</h2>
                        <div className="view-all skeleton"></div>
                    </div>
                    <div className="prompt-grid skeleton-loading">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="prompt-card skeleton"></div>
                        ))}
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main>
            <Hero />

            {/* 特色提示词 */}
            <section className="featured">
                <div className="section-header">
                    <h2>{t('homepage.featured_prompts')}</h2>
                    <Link href="/prompts/popular" className="view-all" prefetch={true}>
                        {t('popular.view_all')} <i className="fa-solid fa-chevron-right"></i>
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
                    <h2>{t('categories.title')}</h2>
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
                    <h2>{t('homepage.recently_added')}</h2>
                    <Link href="/prompts" className="view-all" prefetch={true}>
                        {t('categories.view_all')} <i className="fa-solid fa-chevron-right"></i>
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
        </main>
    );
} 