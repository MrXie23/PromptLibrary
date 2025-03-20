"use client";

import { useState, useEffect } from 'react';
import { CategoryData } from '@/types';
import CategoryItem from '@/components/CategoryItem';
import { useTranslation } from '../lib/i18n';
import { useLanguage } from '../context/LanguageContext';

interface CategoriesContentProps {
    categories: CategoryData[];
}

export default function CategoriesContent({ categories }: CategoriesContentProps) {
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
                <section className="page-header">
                    <h1>...</h1>
                    <p>...</p>
                </section>

                <section className="categories-list">
                    <div className="category-container">
                        {categories.map(category => (
                            <div key={category.slug} className="category-item skeleton"></div>
                        ))}
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main>
            <section className="page-header">
                <h1>{t('categories.title')}</h1>
                <p>{t('categories.subtitle')}</p>
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