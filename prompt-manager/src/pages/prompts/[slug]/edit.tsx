import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import { CategoryData, Prompt } from '@/types';
import { getPromptBySlug, savePrompt } from '@/lib/promptUtils';
import { getAllCategories } from '@/lib/categoryUtils';

export default function EditPrompt() {
    const router = useRouter();
    const { slug } = router.query;

    const [prompt, setPrompt] = useState<Prompt | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [rating, setRating] = useState<number>(8.0);
    const [featured, setFeatured] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const [createdAt, setCreatedAt] = useState('');
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [previewMode, setPreviewMode] = useState(false);

    // 加载提示和分类数据
    useEffect(() => {
        if (!slug) return;

        const fetchData = async () => {
            try {
                // 获取提示数据
                const promptData = await getPromptBySlug(slug as string);

                if (!promptData) {
                    setError('未找到提示');
                    setIsLoading(false);
                    return;
                }

                setPrompt(promptData);
                setTitle(promptData.title);
                setDescription(promptData.description);
                setContent(promptData.content);
                setCategory(promptData.category);
                setFeatured(promptData.featured);
                setIsNew(promptData.isNew);
                setCreatedAt(promptData.createdAt);

                // 获取分类数据
                const allCategories = await getAllCategories();
                setCategories(allCategories);
            } catch (error) {
                console.error('获取数据时出错:', error);
                setError('加载数据失败');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    // 处理保存提示
    const handleSavePrompt = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim() || !content.trim() || !category) {
            setError('请填写所有必填字段');
            return;
        }

        if (!prompt) {
            setError('找不到要更新的提示');
            return;
        }

        // 准备更新的提示数据
        const updatedPrompt: Prompt = {
            ...prompt,
            title,
            description,
            category,
            content,
            featured,
            isNew
        };

        try {
            const success = await savePrompt(updatedPrompt);

            if (success) {
                // 成功保存，跳转到提示详情页
                router.push(`/prompts/${prompt.slug}`);
            } else {
                setError('保存提示失败');
            }
        } catch (error) {
            console.error('保存提示时出错:', error);
            setError('保存提示时出错');
        }
    };

    // 预览模式的内容
    const previewContent = () => {
        return (
            <div className="prose max-w-none bg-white rounded-xl p-6 shadow-apple-sm">
                <h1>{title || '提示标题'}</h1>
                <p className="text-apple-darkGray">{description || '提示描述'}</p>
                <hr className="my-4" />
                {content ? (
                    <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }} />
                ) : (
                    <p className="text-apple-darkGray">未填写提示内容</p>
                )}
            </div>
        );
    };

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

    // 提示不存在
    if (!prompt && !isLoading) {
        return (
            <div className="card-apple text-center py-10">
                <h2 className="text-xl font-medium text-apple-black mb-2">未找到提示</h2>
                <p className="text-apple-darkGray mb-6">无法找到要编辑的提示</p>
                <Link href="/prompts" className="btn-apple-primary">
                    返回提示列表
                </Link>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            {/* 返回按钮和标题 */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <Link
                        href={`/prompts/${slug}`}
                        className="inline-flex items-center text-apple-darkGray hover:text-apple-blue transition-colors mr-4"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-1" />
                        <span>返回</span>
                    </Link>
                    <h1 className="title-apple">编辑提示</h1>
                </div>

                <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="flex items-center btn-apple-secondary"
                >
                    <PencilIcon className="w-5 h-5 mr-1" />
                    <span>{previewMode ? '编辑模式' : '预览模式'}</span>
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {!previewMode ? (
                <form onSubmit={handleSavePrompt} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-2 space-y-6">
                            {/* 基本信息 */}
                            <div className="card-apple">
                                <h2 className="text-lg font-semibold mb-4">基本信息</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-apple-darkGray mb-1">
                                            标题 <span className="text-apple-red">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="input-apple"
                                            placeholder="提示的标题"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-apple-darkGray mb-1">
                                            描述 <span className="text-apple-red">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="input-apple"
                                            placeholder="简短描述提示的用途和功能"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-apple-darkGray mb-1">
                                            分类 <span className="text-apple-red">*</span>
                                        </label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="input-apple"
                                            required
                                        >
                                            {categories.length > 0 ? (
                                                categories.map(cat => (
                                                    <option key={cat.slug} value={cat.name}>
                                                        {cat.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">暂无分类</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* 提示内容 */}
                            <div className="card-apple">
                                <h2 className="text-lg font-semibold mb-4">提示内容 <span className="text-apple-red">*</span></h2>

                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="input-apple min-h-[400px] font-mono"
                                    placeholder="在此处编写提示内容（支持Markdown格式）"
                                    required
                                />
                            </div>
                        </div>

                        {/* 设置 */}
                        <div className="card-apple">
                            <h2 className="text-lg font-semibold mb-4">提示设置</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-apple-darkGray mb-1">
                                        创建日期
                                    </label>
                                    <input
                                        type="text"
                                        value={createdAt}
                                        className="input-apple"
                                        disabled
                                    />
                                    <p className="text-xs text-apple-darkGray mt-1">
                                        创建日期不可更改
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-apple-darkGray mb-1">
                                        评分（1-10）
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            step="0.1"
                                            value={rating}
                                            onChange={(e) => setRating(parseFloat(e.target.value))}
                                            className="w-full"
                                        />
                                        <span className="text-sm font-medium bg-apple-blue text-white rounded-md px-2 py-1">
                                            {rating ? rating.toFixed(1) : "8.0"}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="featured"
                                            checked={featured}
                                            onChange={(e) => setFeatured(e.target.checked)}
                                            className="w-4 h-4 text-apple-blue focus:ring-apple-blue border-gray-300 rounded"
                                        />
                                        <label htmlFor="featured" className="ml-2 text-sm font-medium text-apple-black">
                                            设为精选提示
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="isNew"
                                            checked={isNew}
                                            onChange={(e) => setIsNew(e.target.checked)}
                                            className="w-4 h-4 text-apple-blue focus:ring-apple-blue border-gray-300 rounded"
                                        />
                                        <label htmlFor="isNew" className="ml-2 text-sm font-medium text-apple-black">
                                            标记为新提示
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        className="w-full btn-apple-primary"
                                    >
                                        保存更改
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-apple-sm p-4 mb-6">
                        <div className="flex space-x-4">
                            <div className="px-3 py-1 rounded-full bg-gray-100 text-apple-darkGray text-sm">
                                {category || '未选择分类'}
                            </div>

                            <div className="px-3 py-1 rounded-full bg-gray-100 text-apple-darkGray text-sm">
                                评分：{rating.toFixed(1)}
                            </div>

                            {featured && (
                                <div className="px-3 py-1 rounded-full bg-apple-purple text-white text-sm">
                                    精选
                                </div>
                            )}

                            {isNew && (
                                <div className="px-3 py-1 rounded-full bg-apple-green text-white text-sm">
                                    新增
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 预览内容 */}
                    {previewContent()}

                    <div className="flex justify-end">
                        <button
                            onClick={handleSavePrompt}
                            className="btn-apple-primary"
                        >
                            保存更改
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 