"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PromptData } from '@/types';
import { useTranslation } from '../lib/i18n';
import { useLanguage } from '../context/LanguageContext';
import PromptActions from '@/components/PromptActions';

interface PromptDetailContentProps {
    prompt: PromptData;
}

export default function PromptDetailContent({ prompt }: PromptDetailContentProps) {
    const { locale } = useLanguage();
    const { t, isLoaded } = useTranslation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded) {
            setLoading(false);
        }
    }, [isLoaded]);

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

    // 格式化日期
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return locale === 'zh'
                ? date.toLocaleDateString('zh-CN')
                : date.toLocaleDateString('en-US');
        } catch (e) {
            return dateString;
        }
    };

    if (loading) {
        return (
            <main className="prompt-detail">
                <section className="prompt-header">
                    <Link href="/prompts" className="back-link skeleton" prefetch={true}>
                        <i className="fa-solid fa-arrow-left"></i> ...
                    </Link>
                    <h1 className="skeleton">...</h1>
                    <div className="prompt-meta">
                        <span className="category skeleton">...</span>
                        <span className="popularity skeleton">...</span>
                        <span className="date skeleton">...</span>
                    </div>
                </section>

                <section className="prompt-content">
                    <div className="description">
                        <h2 className="skeleton">...</h2>
                        <p className="skeleton">...</p>
                    </div>

                    <div className="content">
                        <h2 className="skeleton">...</h2>
                        <div className="markdown-content skeleton">...</div>
                    </div>

                    <div className="usage">
                        <h2 className="skeleton">...</h2>
                        <p className="skeleton">...</p>
                    </div>
                </section>

                <section className="prompt-actions">
                    <button className="copy-button skeleton" disabled>
                        <i className="fa-solid fa-copy"></i> ...
                    </button>
                    <button className="share-button skeleton" disabled>
                        <i className="fa-solid fa-share-nodes"></i> ...
                    </button>
                </section>
            </main>
        );
    }

    return (
        <main className="prompt-detail">
            <section className="prompt-header">
                <Link href="/prompts" className="back-link" prefetch={true}>
                    <i className="fa-solid fa-arrow-left"></i> {t('ui.back_to_all_prompts')}
                </Link>
                <h1>{prompt.title}</h1>
                <div className="prompt-meta">
                    <span className="category">{categoryName}</span>
                    {prompt.rating && (
                        <span className="popularity">
                            <i className="fa-solid fa-star"></i> {prompt.rating}
                        </span>
                    )}
                    {prompt.createdAt && (
                        <span className="date">
                            {t('prompt_card.created')}: {formatDate(prompt.createdAt)}
                        </span>
                    )}
                </div>
            </section>

            <section className="prompt-content">
                <div className="description">
                    <h2>{t('prompt_detail.description')}</h2>
                    <p>{prompt.description}</p>
                </div>

                <div className="content">
                    <h2>{t('prompt_detail.content')}</h2>
                    <div className="markdown-content" dangerouslySetInnerHTML={{ __html: prompt.content || '' }} />
                </div>

                <div className="usage">
                    <h2>{t('prompt_detail.usage')}</h2>
                    <p>{t('prompt_detail.usage_text')}</p>
                </div>
            </section>

            <PromptActions prompt={prompt} />
        </main>
    );
} 