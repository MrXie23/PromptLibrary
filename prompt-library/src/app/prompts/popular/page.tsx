import Link from 'next/link';
import PromptCard from '@/components/PromptCard';
import { getAllPrompts } from '@/lib/prompts';
import { PromptData } from '@/types';
import styles from './page.module.css';
import { Metadata } from 'next';
import SortSelector from './SortSelector';

export const metadata: Metadata = {
    title: '热门提示词 - Prompt Library',
    description: '发现社区最受欢迎的AI提示词，按热度排序的精选集合'
};

// 排序函数
function sortPrompts(promptList: PromptData[], sortMethod: 'rating' | 'date'): PromptData[] {
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
}

export default function PopularPromptsPage({
    searchParams,
}: {
    searchParams?: { sort?: string };
}) {
    // 从查询参数获取排序方式，默认为rating
    // 只接受有效的排序值
    const validSortValues = ['rating', 'date'];
    const sortBy = validSortValues.includes(searchParams?.sort || '')
        ? searchParams?.sort as 'rating' | 'date'
        : 'rating';

    // 获取所有提示词（带错误处理）
    let allPrompts: PromptData[] = [];
    try {
        allPrompts = getAllPrompts();
    } catch (error) {
        console.error('获取提示词数据时出错:', error);
        // 错误处理 - 继续使用空数组
    }

    // 排序提示词
    const prompts = sortPrompts(allPrompts, sortBy);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className={styles['page-header']}>
                <h1 className={styles['page-title']}>热门提示词</h1>
                <p className={styles['page-description']}>
                    发现用户最喜爱的提示词，这些提示词经过社区验证，效果出众且实用性强
                </p>
            </div>

            {/* 筛选/排序菜单 */}
            <div className={styles['filter-bar']}>
                <div className={styles['filter-menu']}>
                    <span className={styles['filter-label']}>排序方式：</span>
                    <SortSelector currentSort={sortBy} />
                </div>
                <div className={styles['results-count']}>{prompts.length} 个提示词</div>
            </div>

            {/* 提示词列表 */}
            {prompts.length > 0 ? (
                <div className={styles['prompt-grid']}>
                    {prompts.map((prompt, index) => (
                        <PromptCard
                            key={prompt.slug}
                            prompt={prompt}
                            featured={index < 3} // 前三个标记为热门
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

            {/* 底部导航 */}
            <div className={styles.pagination}>
                <Link href="/prompts" className={styles['pagination-link']}>
                    <i className="fa-solid fa-arrow-left"></i> 所有提示词
                </Link>
                <Link href="/categories" className={styles['pagination-link']}>
                    按分类浏览 <i className="fa-solid fa-arrow-right"></i>
                </Link>
            </div>
        </div>
    );
} 