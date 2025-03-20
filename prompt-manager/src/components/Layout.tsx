import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
    HomeIcon,
    FolderIcon,
    PlusIcon,
    AdjustmentsVerticalIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const router = useRouter();

    const isActive = (path: string) => {
        return router.pathname === path ?
            'bg-apple-blue bg-opacity-10 text-apple-blue' :
            'hover:bg-apple-gray text-apple-darkGray';
    };

    return (
        <div className="min-h-screen bg-apple-white">
            {/* 顶部标题栏 */}
            <header className="sticky top-0 z-10 bg-apple-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-apple-black">Prompt Manager</h1>
                    <Link href="/new" className="flex items-center gap-1 px-4 py-2 rounded-full bg-apple-blue text-white font-medium transition-all hover:bg-opacity-90">
                        <PlusIcon className="w-5 h-5" />
                        <span>新建提示</span>
                    </Link>
                </div>
            </header>

            {/* 侧边栏和主要内容区域 */}
            <div className="flex flex-1 min-h-[calc(100vh-65px)]">
                {/* 侧边栏导航 */}
                <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                    <nav className="flex-1 px-3 py-4 space-y-1">
                        <Link href="/" className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/')}`}>
                            <HomeIcon className="w-5 h-5 mr-3" />
                            概览
                        </Link>
                        <Link href="/prompts" className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/prompts')}`}>
                            <FolderIcon className="w-5 h-5 mr-3" />
                            所有提示
                        </Link>
                        <Link href="/categories" className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/categories')}`}>
                            <AdjustmentsVerticalIcon className="w-5 h-5 mr-3" />
                            分类管理
                        </Link>
                        <Link href="/stats" className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/stats')}`}>
                            <ChartBarIcon className="w-5 h-5 mr-3" />
                            数据统计
                        </Link>
                    </nav>
                </aside>

                {/* 主要内容区域 */}
                <main className="flex-1 py-6 px-8 bg-apple-gray bg-opacity-50">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout; 