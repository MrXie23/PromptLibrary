import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import PromptCard from '@/components/PromptCard';
import { Prompt, CategoryData } from '@/types';

export default function PromptList() {
    const router = useRouter();
    const { category, featured, sort } = router.query;

    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterCategory, setFilterCategory] = useState<string | null>(
        category ? String(category) : null
    );
    const [filterFeatured, setFilterFeatured] = useState<boolean>(
        featured === 'true'
    );
    const [sortBy, setSortBy] = useState<string>(
        sort ? String(sort) : 'newest'
    );

    // 加载数据
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 改用API获取提示词数据
                const promptsResponse = await fetch('/api/prompts');
                if (promptsResponse.ok) {
                    const allPrompts = await promptsResponse.json();
                    setPrompts(allPrompts);
                } else {
                    console.error('获取提示词API响应错误:', promptsResponse.status);
                    setPrompts([]);
                }

                // 改用API获取分类数据
                const categoriesResponse = await fetch('/api/categories');
                if (categoriesResponse.ok) {
                    const allCategories = await categoriesResponse.json();
                    setCategories(allCategories);
                } else {
                    console.error('获取分类API响应错误:', categoriesResponse.status);
                    setCategories([]);
                }
            } catch (error) {
                console.error('获取数据时出错:', error);
                setPrompts([]);
                setCategories([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // 更新URL查询参数
    useEffect(() => {
        const query: Record<string, string> = {};

        if (filterCategory) {
            query.category = filterCategory;
        }

        if (filterFeatured) {
            query.featured = 'true';
        }

        if (sortBy !== 'newest') {
            query.sort = sortBy;
        }

        router.push({
            pathname: '/prompts',
            query
        }, undefined, { shallow: true });
    }, [filterCategory, filterFeatured, sortBy]);

    // 处理删除提示
    const handleDeletePrompt = async (slug: string) => {
        if (confirm(`确定要删除这个提示吗？此操作无法撤销。`)) {
            try {
                // 改用API删除提示词
                const response = await fetch(`/api/prompts/${slug}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    // 从列表中移除已删除的提示
                    setPrompts(prompts.filter(p => p.slug !== slug));
                } else {
                    console.error('删除提示API响应错误:', response.status);
                }
            } catch (error) {
                console.error('删除提示时出错:', error);
            }
        }
    };

    // 过滤和排序提示
    let filteredPrompts = [...prompts];

    // 应用搜索过滤
    if (searchTerm) {
        filteredPrompts = filteredPrompts.filter(prompt =>
            prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prompt.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // 应用分类过滤
    if (filterCategory) {
        filteredPrompts = filteredPrompts.filter(prompt =>
            prompt.category.toLowerCase() === categories.find(c => c.slug === filterCategory)?.name.toLowerCase()
        );
    }

    // 应用精选过滤
    if (filterFeatured) {
        filteredPrompts = filteredPrompts.filter(prompt => prompt.featured);
    }

    // 应用排序
    switch (sortBy) {
        case 'highest-rated':
            filteredPrompts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        case 'a-z':
            filteredPrompts.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'z-a':
            filteredPrompts.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'newest':
        default:
            filteredPrompts.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            break;
        case 'rating':
            filteredPrompts.sort((a, b) =>
                (b.rating || 0) - (a.rating || 0)
            );
            break;
    }

    // 加载状态
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-pulse flex space-x-4">
                    <div className="h-12 w-12 bg-apple-blue/20 rounded-full"></div>
                    <div className="space-y-4">
                        <div className="h-4 w-36 bg-apple-blue/20 rounded"></div>
                        <div className="h-4 w-24 bg-apple-blue/20 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h1 className="title-apple">提示列表</h1>

                <Link href="/new" className="btn-apple-primary flex items-center">
                    <PlusIcon className="w-5 h-5 mr-1" />
                    <span>新建提示</span>
                </Link>
            </div>

            {/* 搜索和过滤 */}
            <div className="bg-white rounded-xl shadow-apple-sm p-4 mb-6">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="搜索提示..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-apple pl-10"
                            />
                            <MagnifyingGlassIcon className="w-5 h-5 text-apple-darkGray absolute left-3 top-1/2 transform -translate-y-1/2" />
                        </div>
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center px-4 py-2 rounded-lg bg-apple-gray hover:bg-gray-200 transition-colors"
                    >
                        <AdjustmentsHorizontalIcon className="w-5 h-5 mr-1" />
                        <span>筛选</span>
                    </button>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                    >
                        <option value="newest">最新添加</option>
                        <option value="highest-rated">最高评分</option>
                        <option value="a-z">名称 A-Z</option>
                        <option value="z-a">名称 Z-A</option>
                    </select>
                </div>

                {/* 过滤选项 */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <h3 className="font-medium mb-3">筛选条件</h3>

                        <div className="flex flex-wrap gap-6">
                            <div>
                                <h4 className="text-sm text-apple-darkGray mb-2">分类</h4>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setFilterCategory(null)}
                                        className={`px-3 py-1 rounded-full text-sm ${filterCategory === null
                                            ? 'bg-apple-blue text-white'
                                            : 'bg-apple-gray text-apple-darkGray hover:bg-gray-200'
                                            }`}
                                    >
                                        全部
                                    </button>

                                    {categories.map(cat => (
                                        <button
                                            key={cat.slug}
                                            onClick={() => setFilterCategory(cat.slug)}
                                            className={`px-3 py-1 rounded-full text-sm ${filterCategory === cat.slug
                                                ? 'bg-apple-blue text-white'
                                                : 'bg-apple-gray text-apple-darkGray hover:bg-gray-200'
                                                }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm text-apple-darkGray mb-2">其他</h4>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        checked={filterFeatured}
                                        onChange={(e) => setFilterFeatured(e.target.checked)}
                                        className="w-4 h-4 text-apple-blue focus:ring-apple-blue border-gray-300 rounded"
                                    />
                                    <label htmlFor="featured" className="ml-2 text-sm">仅显示精选提示</label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 提示列表 */}
            {filteredPrompts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredPrompts.map(prompt => (
                        <PromptCard
                            key={prompt.slug}
                            prompt={prompt}
                            onDelete={handleDeletePrompt}
                        />
                    ))}
                </div>
            ) : (
                <div className="card-apple text-center py-10">
                    <h2 className="text-xl font-medium text-apple-black mb-2">未找到提示</h2>
                    <p className="text-apple-darkGray mb-6">
                        {searchTerm || filterCategory || filterFeatured
                            ? '没有匹配您筛选条件的提示。'
                            : '您的提示库为空，开始创建吧。'}
                    </p>
                    <Link href="/new" className="btn-apple-primary inline-flex items-center">
                        <PlusIcon className="w-5 h-5 mr-1" />
                        <span>创建新提示</span>
                    </Link>
                </div>
            )}
        </div>
    );
} 