"use client";
import { useState } from 'react';
import Link from 'next/link';
import { PromptData } from '@/types';
import PromptCard from '@/components/PromptCard';
import styles from './page.module.css';

interface ClientSideSortProps {
    prompts: PromptData[];
}

export default function ClientSideSort({ prompts }: ClientSideSortProps) {
    // 设置排序方式的状态
    const [sortMethod, setSortMethod] = useState<'rating' | 'date'>('rating');

    // 排序函数
    const sortPrompts = (promptList: PromptData[], sortMethod: 'rating' | 'date'): PromptData[] => {
        try {
            if (sortMethod === 'rating') {
                return [...promptList].sort((a, b) => {
                    if (a.rating !== undefined && b.rating !== undefined) {
                        return b.rating - a.rating; // 降序排列，最高评分排在前面
                    }
                    // 如果没有评分，则将有评分的排在前面
                    if (a.rating !== undefined) return -1;
                    if (b.rating !== undefined) return 1;
                    return 0;
                });
            } else {
                // 按日期排序
                return [...promptList].sort((a, b) => {
                    if (a.createdAt && b.createdAt) {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    }
                    // 如果没有日期，则将有日期的排在前面
                    if (a.createdAt) return -1;
                    if (b.createdAt) return 1;
                    return 0;
                });
            }
        } catch (error) {
            console.error('排序过程中出错:', error);
            return promptList; // 发生错误时返回原始列表
        }
    };

    // 处理排序方式变更
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortMethod(e.target.value as 'rating' | 'date');
    };

    // 排序提示词
    const sortedPrompts = sortPrompts(prompts, sortMethod);

    return (
        <>
            {/* 筛选/排序菜单 */}
            <div className={styles['filter-bar']}>
                <div className={styles['filter-menu']}>
                    <span className={styles['filter-label']}>排序方式：</span>
                    <select
                        className={styles['filter-select']}
                        value={sortMethod}
                        onChange={handleSortChange}
                    >
                        <option value="rating">按热度（默认）</option>
                        <option value="date">按日期</option>
                    </select>
                </div>
                <div className={styles['results-count']}>{sortedPrompts.length} 个提示词</div>
            </div>

            {/* 提示词列表 */}
            {sortedPrompts.length > 0 ? (
                <div className={styles['prompt-grid']}>
                    {sortedPrompts.slice(0, 9).map((prompt, index) => (
                        <PromptCard
                            key={prompt.slug}
                            prompt={prompt}
                            featured={index < 3} // 前三个标记为热门
                            isNew={prompt.isNew}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles['empty-state']}>
                    <div className={styles['empty-icon']}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8 15C8 15 9.5 17 12 17C14.5 17 16 15 16 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9 10H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15 10H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <p className={styles['empty-title']}>暂无热门提示词</p>
                    <p className={styles['empty-description']}>
                        我们正在收集用户反馈，很快将添加热门提示词
                    </p>
                    <Link href="/prompts" className={styles['view-button']}>
                        浏览所有提示词
                    </Link>
                </div>
            )}
        </>
    );
} 