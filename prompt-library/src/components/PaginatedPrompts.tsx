"use client";
import { useState, useEffect } from 'react';
import { PromptData } from '@/types';
import PromptCard from './PromptCard';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationMeta {
    total: number;
    perPage: number;
    totalPages: number;
    category?: string;
}

interface PaginatedPromptsProps {
    type: 'all' | 'category';
    category?: string;
    initialPage?: number;
    initialData?: PromptData[];
    initialMeta?: PaginationMeta;
}

export default function PaginatedPrompts({
    type,
    category,
    initialPage = 1,
    initialData,
    initialMeta
}: PaginatedPromptsProps) {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [loading, setLoading] = useState(false);
    const [prompts, setPrompts] = useState<PromptData[]>(initialData || []);
    const [meta, setMeta] = useState<PaginationMeta | null>(initialMeta || null);
    const [error, setError] = useState<string | null>(null);

    const pathname = usePathname();
    const searchParams = useSearchParams();

    // 当URL参数中的页码变化时更新当前页码
    useEffect(() => {
        const pageParam = searchParams.get('page');
        if (pageParam) {
            const pageNumber = parseInt(pageParam, 10);
            if (!isNaN(pageNumber) && pageNumber > 0) {
                setCurrentPage(pageNumber);
            }
        } else {
            setCurrentPage(1);
        }
    }, [searchParams]);

    // 当类型、分类或页码变化时加载数据
    useEffect(() => {
        // 如果已经有初始数据且是第一页，就不需要重新加载
        if (initialData && initialMeta && currentPage === initialPage) {
            return;
        }

        async function fetchPageData() {
            setLoading(true);
            setError(null);

            try {
                // 构建基本路径
                let basePath = '/data/paginated';
                // 检测当前运行环境，确定正确的数据路径
                if (window.location.pathname.includes('/PromptLibrary/')) {
                    basePath = '/PromptLibrary/data/paginated';
                }

                // 根据类型构建具体路径
                let dataPath;
                if (type === 'category' && category) {
                    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
                    dataPath = `${basePath}/categories/${categorySlug}/page-${currentPage}.json`;

                    // 如果没有元数据，先获取元数据
                    if (!meta) {
                        const metaResponse = await fetch(`${basePath}/categories/${categorySlug}/meta.json`, { cache: 'no-store' });
                        if (!metaResponse.ok) {
                            throw new Error(`无法获取分类元数据: ${metaResponse.status}`);
                        }
                        const metaData = await metaResponse.json();
                        setMeta(metaData);
                    }
                } else {
                    dataPath = `${basePath}/all-prompts-page-${currentPage}.json`;

                    // 如果没有元数据，先获取元数据
                    if (!meta) {
                        const metaResponse = await fetch(`${basePath}/all-prompts-meta.json`, { cache: 'no-store' });
                        if (!metaResponse.ok) {
                            throw new Error(`无法获取提示词元数据: ${metaResponse.status}`);
                        }
                        const metaData = await metaResponse.json();
                        setMeta(metaData);
                    }
                }

                // 获取当前页数据
                const response = await fetch(dataPath, { cache: 'no-store' });
                if (!response.ok) {
                    throw new Error(`无法获取第 ${currentPage} 页数据: ${response.status}`);
                }

                const pageData = await response.json();
                setPrompts(pageData);
            } catch (err) {
                console.error('加载分页数据出错:', err);
                setError('无法加载数据，请稍后再试');
            } finally {
                setLoading(false);
            }
        }

        fetchPageData();
    }, [type, category, currentPage, initialData, initialMeta, initialPage, meta]);

    // 构建分页URL
    const buildPageUrl = (page: number) => {
        // 创建一个新的URLSearchParams对象
        const params = new URLSearchParams();

        // 从当前searchParams复制所有参数
        searchParams.forEach((value, key) => {
            params.set(key, value);
        });

        // 设置新的页码
        params.set('page', page.toString());

        return `${pathname}?${params.toString()}`;
    };

    // 生成页码数组，用于显示页码导航
    const generatePageNumbers = () => {
        if (!meta) return [];

        const totalPages = meta.totalPages;
        const currentPageNum = currentPage;

        // 如果总页数少于等于5，显示所有页码
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // 否则显示当前页附近的页码
        let startPage = Math.max(currentPageNum - 1, 1);
        let endPage = Math.min(startPage + 2, totalPages);

        if (endPage - startPage < 2) {
            startPage = Math.max(endPage - 2, 1);
        }

        const pages = [];

        // 始终显示第一页
        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) {
                pages.push('ellipsis');
            }
        }

        // 显示中间页码
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // 始终显示最后一页
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push('ellipsis');
            }
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="paginated-prompts">
            {loading ? (
                <div className="loading-container">
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>正在加载提示词...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="retry-button">
                        重试
                    </button>
                </div>
            ) : (
                <>
                    {/* 提示词列表 */}
                    {prompts.length > 0 ? (
                        <div className="prompt-grid">
                            {prompts.map(prompt => (
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
                            <p>暂无提示词</p>
                        </div>
                    )}

                    {/* 移动端显示页码指示器在上方 */}
                    {meta && meta.totalPages > 1 && (
                        <div className="mobile-page-indicator">
                            <span className="current-page">{currentPage}</span>
                            <span className="page-separator">/</span>
                            <span className="total-pages">{meta.totalPages}</span>
                        </div>
                    )}

                    {/* 分页控件 */}
                    {meta && meta.totalPages > 1 && (
                        <div className="pagination-controls">
                            {/* 上一页 */}
                            {currentPage > 1 ? (
                                <Link
                                    href={buildPageUrl(currentPage - 1)}
                                    className="pagination-button"
                                >
                                    <i className="fa-solid fa-chevron-left"></i> 上一页
                                </Link>
                            ) : (
                                <span className="pagination-button disabled">
                                    <i className="fa-solid fa-chevron-left"></i> 上一页
                                </span>
                            )}

                            {/* 桌面端页码导航 */}
                            <div className="desktop-page-numbers">
                                {generatePageNumbers().map((pageNum, index) =>
                                    pageNum === 'ellipsis' ? (
                                        <span key={`ellipsis-${index}`} className="page-ellipsis">...</span>
                                    ) : (
                                        <Link
                                            key={pageNum}
                                            href={buildPageUrl(pageNum as number)}
                                            className={`page-number ${pageNum === currentPage ? 'active' : ''}`}
                                        >
                                            {pageNum}
                                        </Link>
                                    )
                                )}
                            </div>

                            {/* 移动端页码指示器 - 放在下方显示的版本，PC端显示 */}
                            <div className="page-indicators desktop-only">
                                <span className="current-page">{currentPage}</span>
                                <span className="page-separator">/</span>
                                <span className="total-pages">{meta.totalPages}</span>
                            </div>

                            {/* 下一页 */}
                            {currentPage < meta.totalPages ? (
                                <Link
                                    href={buildPageUrl(currentPage + 1)}
                                    className="pagination-button"
                                >
                                    下一页 <i className="fa-solid fa-chevron-right"></i>
                                </Link>
                            ) : (
                                <span className="pagination-button disabled">
                                    下一页 <i className="fa-solid fa-chevron-right"></i>
                                </span>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
} 