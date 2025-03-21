import React, { useState, useEffect } from 'react';
import {
    ChartBarIcon,
    StarIcon,
    CalendarDaysIcon,
    TagIcon
} from '@heroicons/react/24/solid';
import { Prompt, CategoryData } from '@/types';

export default function Stats() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 获取所有提示 - 使用API
                const promptsResponse = await fetch('/api/prompts');
                if (promptsResponse.ok) {
                    const allPrompts = await promptsResponse.json();
                    setPrompts(allPrompts);
                    console.log(`成功获取${allPrompts.length}个提示词`);
                } else {
                    console.error('获取提示API响应错误:', promptsResponse.status);
                    setError('加载提示数据失败');
                }

                // 获取所有分类 - 使用API
                const categoriesResponse = await fetch('/api/categories');
                if (categoriesResponse.ok) {
                    const allCategories = await categoriesResponse.json();
                    setCategories(allCategories);
                    console.log(`成功获取${allCategories.length}个分类`);
                } else {
                    console.error('获取分类API响应错误:', categoriesResponse.status);
                    setError('加载分类数据失败');
                }
            } catch (error) {
                console.error('获取数据时出错:', error);
                setError('加载数据失败');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // 计算统计数据
    const statsData = React.useMemo(() => {
        if (prompts.length === 0) return null;

        // 按分类统计
        const promptsByCategory: Record<string, number> = {};

        // 按评分统计
        const promptsByRating: Record<string, number> = {
            '1-2分': 0,
            '3-4分': 0,
            '5-6分': 0,
            '7-8分': 0,
            '9-10分': 0
        };

        // 按月份统计创建数量
        const monthlyCreation: Record<string, number> = {};

        // 精选和新提示数量
        let featuredCount = 0;
        let newCount = 0;

        // 评分总和和数量，用于计算平均评分
        let ratingSum = 0;
        let ratingCount = 0;

        // 最高评分和最低评分的提示
        let highestRatedPrompt = prompts[0];
        let highestRating = prompts[0].rating || 0;
        let lowestRatedPrompt = prompts[0];
        let lowestRating = prompts[0].rating || 10;

        prompts.forEach(prompt => {
            // 按分类统计
            const category = prompt.category;
            promptsByCategory[category] = (promptsByCategory[category] || 0) + 1;

            // 按评分统计
            const rating = prompt.rating || 0;
            if (rating > 0) {
                if (rating <= 2) promptsByRating['1-2分']++;
                else if (rating <= 4) promptsByRating['3-4分']++;
                else if (rating <= 6) promptsByRating['5-6分']++;
                else if (rating <= 8) promptsByRating['7-8分']++;
                else promptsByRating['9-10分']++;

                // 累加评分
                ratingSum += rating;
                ratingCount++;

                // 更新最高和最低评分
                if (rating > highestRating) {
                    highestRating = rating;
                    highestRatedPrompt = prompt;
                }
                if (rating < lowestRating) {
                    lowestRating = rating;
                    lowestRatedPrompt = prompt;
                }
            } else {
                // 如果没有评分，默认归类到7-8分
                promptsByRating['7-8分']++;
            }

            // 按月份统计
            const date = new Date(prompt.createdAt);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyCreation[monthYear] = (monthlyCreation[monthYear] || 0) + 1;

            // 精选和新提示计数
            if (prompt.featured) featuredCount++;
            if (prompt.isNew) newCount++;
        });

        // 计算平均评分
        const averageRating = ratingCount > 0 ? ratingSum / ratingCount : 8.0;

        return {
            totalPrompts: prompts.length,
            promptsByCategory,
            promptsByRating,
            monthlyCreation,
            featuredCount,
            newCount,
            averageRating,
            highestRatedPrompt,
            lowestRatedPrompt,
            highestRating,
            lowestRating
        };
    }, [prompts]);

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

    // 错误状态
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
            </div>
        );
    }

    // 没有数据
    if (!statsData || prompts.length === 0) {
        return (
            <div className="card-apple text-center py-10">
                <h2 className="text-xl font-medium text-apple-black mb-2">暂无统计数据</h2>
                <p className="text-apple-darkGray">请先添加一些提示以查看统计信息</p>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <h1 className="title-apple mb-6">提示统计信息</h1>

            {/* 概览统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="card-apple flex items-center">
                    <div className="bg-apple-blue/10 p-3 rounded-full mr-4">
                        <ChartBarIcon className="h-8 w-8 text-apple-blue" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-apple-darkGray">提示总数</h3>
                        <p className="text-2xl font-semibold">{statsData.totalPrompts}</p>
                    </div>
                </div>

                <div className="card-apple flex items-center">
                    <div className="bg-amber-100 p-3 rounded-full mr-4">
                        <StarIcon className="h-8 w-8 text-amber-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-apple-darkGray">平均评分</h3>
                        <p className="text-2xl font-semibold">{statsData.averageRating.toFixed(1)}</p>
                    </div>
                </div>

                <div className="card-apple flex items-center">
                    <div className="bg-purple-100 p-3 rounded-full mr-4">
                        <StarIcon className="h-8 w-8 text-apple-purple" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-apple-darkGray">精选提示</h3>
                        <p className="text-2xl font-semibold">{statsData.featuredCount}</p>
                    </div>
                </div>

                <div className="card-apple flex items-center">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                        <CalendarDaysIcon className="h-8 w-8 text-apple-green" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-apple-darkGray">新提示</h3>
                        <p className="text-2xl font-semibold">{statsData.newCount}</p>
                    </div>
                </div>
            </div>

            {/* 按分类统计 */}
            <div className="card-apple mb-8">
                <h2 className="text-lg font-semibold mb-4">按分类统计</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="space-y-4">
                            {Object.entries(statsData.promptsByCategory).map(([category, count]) => (
                                <div key={category} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <TagIcon className="w-5 h-5 text-apple-blue mr-2" />
                                        <span>{category}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-medium">{count}</span>
                                        <span className="text-apple-darkGray ml-1">个提示</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-apple-darkGray mb-2">分类比例</h3>

                            {Object.entries(statsData.promptsByCategory).map(([category, count]) => {
                                const percentage = Math.round((count / statsData.totalPrompts) * 100);
                                return (
                                    <div key={category} className="mb-3">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{category}</span>
                                            <span>{percentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-apple-blue rounded-full h-2"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* 按评分统计 */}
            <div className="card-apple mb-8">
                <h2 className="text-lg font-semibold mb-4">按评分统计</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="space-y-4">
                            {Object.entries(statsData.promptsByRating).map(([ratingRange, count]) => (
                                <div key={ratingRange} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <StarIcon className="w-5 h-5 text-amber-500 mr-2" />
                                        <span>{ratingRange}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-medium">{count}</span>
                                        <span className="text-apple-darkGray ml-1">个提示</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-apple-darkGray mb-2">最高评分的提示</h3>
                                <div className="bg-white border border-gray-200 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium">{statsData.highestRatedPrompt.title}</h4>
                                        <div className="flex items-center text-amber-500">
                                            <StarIcon className="w-4 h-4 mr-1" />
                                            <span>{statsData.highestRating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-apple-darkGray line-clamp-2">
                                        {statsData.highestRatedPrompt.description}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-apple-darkGray mb-2">最低评分的提示</h3>
                                <div className="bg-white border border-gray-200 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium">{statsData.lowestRatedPrompt.title}</h4>
                                        <div className="flex items-center text-amber-500">
                                            <StarIcon className="w-4 h-4 mr-1" />
                                            <span>{statsData.lowestRating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-apple-darkGray line-clamp-2">
                                        {statsData.lowestRatedPrompt.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 按月份统计 */}
            <div className="card-apple">
                <h2 className="text-lg font-semibold mb-4">创建时间统计</h2>

                <div className="grid grid-cols-1 gap-6">
                    <div className="overflow-x-auto">
                        <div className="min-w-full">
                            <div className="flex items-end h-60">
                                {Object.entries(statsData.monthlyCreation)
                                    .sort(([a], [b]) => a.localeCompare(b))
                                    .map(([month, count]) => {
                                        const maxCount = Math.max(...Object.values(statsData.monthlyCreation));
                                        const height = Math.max(20, (count / maxCount) * 100);

                                        return (
                                            <div key={month} className="flex flex-col items-center mx-2">
                                                <div
                                                    className="w-14 bg-apple-blue rounded-t-lg flex items-end justify-center"
                                                    style={{ height: `${height}%` }}
                                                >
                                                    <span className="text-xs text-white font-medium pb-1">{count}</span>
                                                </div>
                                                <div className="w-14 text-xs text-apple-darkGray mt-2 text-center">
                                                    {month}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 