"use client";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import styles from './page.module.css';

interface SortSelectorProps {
    currentSort: 'rating' | 'date';
}

export default function SortSelector({ currentSort }: SortSelectorProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // 获取选择的排序方式
        const newSortValue = e.target.value;

        // 创建一个新的URLSearchParams实例
        const params = new URLSearchParams(searchParams.toString());

        // 更新或删除sort参数
        if (newSortValue === 'rating') {
            params.delete('sort');
        } else {
            params.set('sort', newSortValue);
        }

        // 构建新的URL（使用相对路径，由Next.js自动处理basePath）
        const queryString = params.toString();
        const newPathWithQuery = queryString
            ? `${pathname}?${queryString}`
            : pathname;

        // 使用Next.js路由导航
        router.push(newPathWithQuery);
    };

    return (
        <select
            className={styles['filter-select']}
            value={currentSort}
            onChange={handleSortChange}
        >
            <option value="rating">按热度（默认）</option>
            <option value="date">按日期</option>
        </select>
    );
} 