import Link from 'next/link';
import PromptCard from '@/components/PromptCard';
import { getAllPrompts } from '@/lib/prompts';
import { PromptData } from '@/types';
import styles from './page.module.css';
import { Metadata } from 'next';
import ClientSideSort from './ClientSideSort';

export const metadata: Metadata = {
    title: '热门提示词 - Prompt Library',
    description: '发现社区最受欢迎的AI提示词，按热度排序的精选集合'
};

// 备用示例数据，在构建时无法读取文件系统时使用
const fallbackPrompts: PromptData[] = [
    {
        slug: 'professional-article-generator',
        title: '专业文章生成器',
        description: '创建结构化、专业的文章，包含引人入胜的标题、精确的小标题和丰富的内容。',
        category: '内容创作',
        rating: 9.8,
        createdAt: '2023-01-15',
        featured: true
    },
    {
        slug: 'code-optimization-assistant',
        title: '代码优化助手',
        description: '分析并优化您的代码，提供性能改进建议和最佳实践指导。',
        category: '编程开发',
        rating: 9.5,
        createdAt: '2023-01-20',
        featured: true
    }
];

export default function PopularPromptsPage() {
    // 获取所有提示词（带错误处理）
    let allPrompts: PromptData[] = [];
    try {
        allPrompts = getAllPrompts();
        // 如果没有获取到任何提示词，使用备用数据
        if (allPrompts.length === 0) {
            allPrompts = fallbackPrompts;
        }
    } catch (error) {
        console.error('获取提示词数据时出错:', error);
        // 错误处理 - 使用备用数据
        allPrompts = fallbackPrompts;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className={styles['page-header']}>
                <h1 className={styles['page-title']}>热门提示词</h1>
                <p className={styles['page-description']}>
                    发现用户最喜爱的提示词，这些提示词经过社区验证，效果出众且实用性强
                </p>
            </div>

            {/* 客户端排序组件 */}
            <ClientSideSort prompts={allPrompts} />

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