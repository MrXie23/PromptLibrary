import { getAllPrompts } from '@/lib/prompts';
import { PromptData } from '@/types';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// 动态导入客户端组件
const PopularPromptsContent = dynamic(() => import('@/components/PopularPromptsContent'), {
    ssr: false,
    loading: () => (
        <div className="container mx-auto px-4 py-8">
            <div className="page-header">
                <h1 className="page-title">热门提示词</h1>
                <p className="page-description">
                    发现用户最喜爱的提示词，这些提示词经过社区验证，效果出众且实用性强
                </p>
            </div>

            <div className="filter-bar skeleton-loading">
                <div className="skeleton"></div>
            </div>

            <div className="prompt-grid skeleton-loading">
                {[...Array(9)].map((_, index) => (
                    <div key={index} className="prompt-card skeleton"></div>
                ))}
            </div>
        </div>
    )
});

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

    return <PopularPromptsContent prompts={allPrompts} />;
} 