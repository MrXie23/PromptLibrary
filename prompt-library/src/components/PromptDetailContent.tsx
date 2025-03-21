"use client";

import { useState, useEffect, useRef } from 'react';
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
    const [isExpanded, setIsExpanded] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [needsToggle, setNeedsToggle] = useState(false);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

    useEffect(() => {
        if (isLoaded) {
            setLoading(false);
        }
    }, [isLoaded]);

    // 检测内容是否需要展开/收起按钮
    useEffect(() => {
        if (contentRef.current) {
            // 如果内容高度超过容器，显示展开/收起按钮
            const checkOverflow = () => {
                if (contentRef.current) {
                    const isOverflowing = contentRef.current.scrollHeight > contentRef.current.clientHeight;
                    setNeedsToggle(isOverflowing);
                }
            };

            // 初始检查
            checkOverflow();

            // 当窗口大小改变时重新检查
            window.addEventListener('resize', checkOverflow);

            return () => {
                window.removeEventListener('resize', checkOverflow);
            };
        }
    }, [loading, prompt.content]);

    // 监听滚动事件，检测是否滚动到底部
    useEffect(() => {
        const contentElement = contentRef.current;
        if (!contentElement) return;

        const handleScroll = () => {
            if (contentElement) {
                // 判断是否滚动到底部 (容差为2像素)
                const scrollPosition = contentElement.scrollHeight - contentElement.scrollTop - contentElement.clientHeight;
                const isAtBottom = scrollPosition < 2;

                // 如果状态变化了，才更新状态，避免不必要的重新渲染
                if (isAtBottom !== isScrolledToBottom) {
                    setIsScrolledToBottom(isAtBottom);
                }
            }
        };

        contentElement.addEventListener('scroll', handleScroll);

        // 初始检查
        handleScroll();

        return () => {
            contentElement.removeEventListener('scroll', handleScroll);
        };
    }, [isScrolledToBottom]);

    // 切换展开/收起状态
    const toggleContent = () => {
        console.log('当前状态:', isExpanded, '切换到:', !isExpanded);
        setIsExpanded(!isExpanded);
        // 重置滚动状态
        setIsScrolledToBottom(false);
    };

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
                    <div className="content-container">
                        <div
                            ref={contentRef}
                            className={`markdown-content ${isExpanded ? 'expanded' : ''} ${isScrolledToBottom && !isExpanded ? 'scrolled-bottom' : ''}`}
                            dangerouslySetInnerHTML={{ __html: prompt.content || '' }}
                        />
                        {!isExpanded && <div className={`content-mask ${isScrolledToBottom ? 'hidden' : ''}`}></div>}
                    </div>
                    {needsToggle && (
                        <div className="content-toggle">
                            <button
                                onClick={toggleContent}
                                className={isExpanded ? 'expanded' : ''}
                                data-expanded={isExpanded}
                            >
                                <span>{isExpanded ? t('ui.collapse') : t('ui.expand')}</span>
                                {isExpanded ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="18 15 12 9 6 15"></polyline>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                )}
                            </button>
                        </div>
                    )}
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