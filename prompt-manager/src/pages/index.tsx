import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import PromptCard from '@/components/PromptCard';
import { Prompt, CategoryData } from '@/types';

export default function Home() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [featuredPrompts, setFeaturedPrompts] = useState<Prompt[]>([]);
    const [newPrompts, setNewPrompts] = useState<Prompt[]>([]);
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 通过API路由获取数据
                const promptsResponse = await fetch('/api/prompts');
                const allPrompts = await promptsResponse.json() as Prompt[];
                setPrompts(allPrompts);

                // 过滤精选提示
                setFeaturedPrompts(allPrompts.filter((prompt: Prompt) => prompt.featured).slice(0, 4));

                // 获取最新提示（按创建时间排序）
                const sortedByDate = [...allPrompts].sort((a: Prompt, b: Prompt) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setNewPrompts(sortedByDate.slice(0, 4));

                // 获取分类
                const categoriesResponse = await fetch('/api/categories');
                const allCategories = await categoriesResponse.json();
                setCategories(allCategories);
            } catch (error) {
                console.error('获取数据时出错:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

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
            {/* 头部统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card-apple flex items-center">
                    <div className="bg-apple-blue/10 p-3 rounded-full mr-4">
                        <StarIcon className="h-8 w-8 text-apple-blue" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-apple-black">提示总数</h3>
                        <p className="text-2xl font-semibold mt-1">{prompts.length}</p>
                    </div>
                </div>

                <div className="card-apple flex items-center">
                    <div className="bg-apple-purple/10 p-3 rounded-full mr-4">
                        <StarIcon className="h-8 w-8 text-apple-purple" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-apple-black">分类总数</h3>
                        <p className="text-2xl font-semibold mt-1">{categories.length}</p>
                    </div>
                </div>

                <div className="card-apple flex items-center">
                    <div className="bg-apple-green/10 p-3 rounded-full mr-4">
                        <StarIcon className="h-8 w-8 text-apple-green" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-apple-black">精选提示</h3>
                        <p className="text-2xl font-semibold mt-1">{featuredPrompts.length}</p>
                    </div>
                </div>
            </div>

            {/* 精选提示 */}
            <section className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="title-apple">精选提示</h2>
                    <Link
                        href="/prompts?featured=true"
                        className="flex items-center text-apple-blue hover:underline"
                    >
                        <span className="mr-1">查看全部</span>
                        <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredPrompts.length > 0 ? (
                        featuredPrompts.map(prompt => (
                            <PromptCard
                                key={prompt.slug}
                                prompt={prompt}
                            />
                        ))
                    ) : (
                        <p className="text-apple-darkGray col-span-2">暂无精选提示</p>
                    )}
                </div>
            </section>

            {/* 最新提示 */}
            <section className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="title-apple">最新提示</h2>
                    <Link
                        href="/prompts?sort=newest"
                        className="flex items-center text-apple-blue hover:underline"
                    >
                        <span className="mr-1">查看全部</span>
                        <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {newPrompts.length > 0 ? (
                        newPrompts.map(prompt => (
                            <PromptCard
                                key={prompt.slug}
                                prompt={prompt}
                                isNew={true}
                            />
                        ))
                    ) : (
                        <div className="col-span-2 card-apple flex flex-col items-center justify-center py-10">
                            <p className="text-apple-darkGray mb-4">暂无提示，开始创建吧！</p>
                            <Link
                                href="/new"
                                className="btn-apple-primary flex items-center"
                            >
                                <PlusIcon className="h-5 w-5 mr-1" />
                                <span>创建提示</span>
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* 分类浏览 */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="title-apple">按分类浏览</h2>
                    <Link
                        href="/categories"
                        className="flex items-center text-apple-blue hover:underline"
                    >
                        <span className="mr-1">管理分类</span>
                        <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map(category => (
                        <Link
                            key={category.slug}
                            href={`/prompts?category=${category.slug}`}
                            className="card-apple flex items-center justify-between hover:border-apple-blue hover:border transition-all"
                        >
                            <div>
                                <h3 className="font-medium">{category.name}</h3>
                                <p className="text-sm text-apple-darkGray">{category.count} 个提示</p>
                            </div>
                            <ArrowRightIcon className="h-5 w-5 text-apple-darkGray" />
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
} 