import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { StarIcon, TagIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';
import {
    PencilIcon,
    TrashIcon,
    ArrowLeftIcon,
    ClipboardDocumentIcon,
    ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Prompt } from '@/types';

export default function PromptDetail() {
    const router = useRouter();
    const { slug } = router.query;

    const [prompt, setPrompt] = useState<Prompt | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCopied, setIsCopied] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    useEffect(() => {
        if (!slug) return;

        const fetchPrompt = async () => {
            try {
                const response = await fetch(`/api/prompts/${slug}`);
                if (response.ok) {
                    const promptData = await response.json();
                    setPrompt(promptData);
                } else {
                    console.error('获取提示API响应错误:', response.status);
                    setPrompt(null);
                }
            } catch (error) {
                console.error('获取提示时出错:', error);
                setPrompt(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrompt();
    }, [slug]);

    const handleCopyContent = () => {
        if (!prompt) return;

        navigator.clipboard.writeText(prompt.content);
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    const handleDelete = async () => {
        if (!prompt || !prompt.slug) return;

        try {
            const response = await fetch(`/api/prompts/${prompt.slug}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.push('/prompts');
            } else {
                console.error('删除提示API响应错误:', response.status);
            }
        } catch (error) {
            console.error('删除提示时出错:', error);
        }
    };

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

    if (!prompt) {
        return (
            <div className="card-apple text-center">
                <h2 className="title-apple mb-4">未找到提示</h2>
                <p className="text-apple-darkGray mb-6">无法找到指定的提示内容</p>
                <Link href="/prompts" className="btn-apple-primary">
                    返回提示列表
                </Link>
            </div>
        );
    }

    const {
        title,
        description,
        category,
        content,
        rating,
        createdAt,
        featured,
        isNew
    } = prompt;

    // 格式化日期
    const formattedDate = format(new Date(createdAt), 'yyyy年MM月dd日', { locale: zhCN });

    return (
        <div className="animate-fadeIn">
            {/* 返回按钮 */}
            <div className="mb-6">
                <Link
                    href="/prompts"
                    className="inline-flex items-center text-apple-darkGray hover:text-apple-blue transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                    <span>返回提示列表</span>
                </Link>
            </div>

            {/* 顶部信息 */}
            <div className="card-apple mb-6">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-semibold text-apple-black mb-2">{title}</h1>
                        <p className="text-lg text-apple-darkGray">{description}</p>
                    </div>

                    <div className="flex space-x-2">
                        <Link
                            href={`/prompts/${slug}/edit`}
                            className="btn-apple-secondary flex items-center"
                            title="编辑"
                        >
                            <PencilIcon className="w-5 h-5 mr-1" />
                            <span>编辑</span>
                        </Link>

                        <button
                            onClick={() => setDeleteConfirm(true)}
                            className="flex items-center px-5 py-2 rounded-full bg-white text-apple-red border border-apple-red hover:bg-apple-red hover:bg-opacity-5 transition-all"
                            title="删除"
                        >
                            <TrashIcon className="w-5 h-5 mr-1" />
                            <span>删除</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-gray-200 mb-4">
                    <div className="flex items-center text-apple-darkGray">
                        <TagIcon className="w-5 h-5 mr-1 text-apple-blue" />
                        <span>{category}</span>
                    </div>

                    <div className="flex items-center text-apple-darkGray">
                        <StarIcon className="w-5 h-5 mr-1 text-amber-500" />
                        <span>{rating}</span>
                    </div>

                    <div className="flex items-center text-apple-darkGray">
                        <CalendarDaysIcon className="w-5 h-5 mr-1 text-apple-green" />
                        <span>{formattedDate}</span>
                    </div>

                    {featured && (
                        <span className="px-3 py-1 text-sm font-medium text-white bg-apple-purple rounded-full">
                            精选
                        </span>
                    )}

                    {isNew && (
                        <span className="px-3 py-1 text-sm font-medium text-white bg-apple-green rounded-full">
                            新增
                        </span>
                    )}
                </div>

                <div className="relative">
                    <button
                        onClick={handleCopyContent}
                        className="absolute top-0 right-0 p-2 text-apple-darkGray hover:text-apple-blue transition-colors"
                        title={isCopied ? '已复制' : '复制内容'}
                    >
                        {isCopied ? (
                            <ClipboardDocumentCheckIcon className="w-6 h-6" />
                        ) : (
                            <ClipboardDocumentIcon className="w-6 h-6" />
                        )}
                    </button>

                    <div className="prose max-w-none mt-4 pb-2">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>

            {/* 删除确认对话框 */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h2 className="text-xl font-semibold text-apple-black mb-4">确认删除</h2>
                        <p className="text-apple-darkGray mb-6">
                            您确定要删除提示 "{title}" 吗？此操作无法撤销。
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setDeleteConfirm(false)}
                                className="btn-apple-secondary"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-5 py-2 rounded-full bg-apple-red text-white font-medium hover:bg-opacity-90 transition-all"
                            >
                                确认删除
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 