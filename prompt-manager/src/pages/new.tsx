import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import { CategoryData, Prompt } from '@/types';
import { format } from 'date-fns';

export default function NewPrompt() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [rating, setRating] = useState<number>(8.0);
    const [featured, setFeatured] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const [fileName, setFileName] = useState('');
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [previewMode, setPreviewMode] = useState(false);

    // 加载分类数据
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // 使用API获取分类数据
                const response = await fetch('/api/categories');
                if (!response.ok) {
                    throw new Error('获取分类API响应错误:' + response.status);
                }
                const allCategories = await response.json();
                setCategories(allCategories);

                // 设置默认分类
                if (allCategories.length > 0) {
                    setCategory(allCategories[0].name);
                }
            } catch (error) {
                console.error('获取分类时出错:', error);
                setError('无法加载分类数据');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // 处理创建提示
    const handleCreatePrompt = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim() || !content.trim() || !category) {
            setError('请填写所有必填字段');
            return;
        }

        // 准备创建的提示数据
        const newPrompt: Omit<Prompt, 'slug'> & { customFileName?: string } = {
            title,
            description,
            category,
            content,
            createdAt: format(new Date(), 'yyyy-MM-dd'),
            updatedAt: format(new Date(), 'yyyy-MM-dd'),
            featured,
            isNew,
            views: 0,
            likes: 0,
            usageCount: 0,
            favoriteCount: 0,
            tags: [],
            author: ''
        };

        // 如果用户提供了自定义文件名，则添加到数据中
        if (fileName.trim()) {
            newPrompt.customFileName = fileName.trim();
        }

        try {
            // 使用API创建提示
            const response = await fetch('/api/prompts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPrompt),
            });

            if (response.ok) {
                const createdPrompt = await response.json();
                // 成功创建，跳转到提示详情页
                router.push(`/prompts/${createdPrompt.slug}`);
            } else {
                const errorData = await response.json();
                setError(`创建提示失败: ${errorData.error || '未知错误'}`);
            }
        } catch (error) {
            console.error('创建提示时出错:', error);
            setError('创建提示时出错');
        }
    };

    // 生成默认模板
    const generateTemplate = (templateType: string) => {
        if (templateType === 'simple') {
            setContent(`# 提示标题

## 使用场景

在这里描述这个提示的使用场景。

## 提示内容

在这里编写您的主要提示内容。请详细说明任务、要求和期望的输出。

## 示例输入

提供一个示例输入，展示如何使用这个提示。

## 示例输出

提供一个示例输出，展示这个提示预期的结果。`);
        } else if (templateType === 'detailed') {
            setContent(`# 提示标题

## 角色设定

您是一位专业的[角色描述]，具有[相关专业知识/技能]。

## 任务背景

[提供任务背景和上下文]

## 详细指令

1. 首先，您需要[第一步指令]
2. 然后，[第二步指令]
3. 接着，[第三步指令]
4. 最后，[最后步骤]

## 输出格式

请按照以下格式提供您的回复：

- 部分一：[描述]
- 部分二：[描述]
- 部分三：[描述]

## 约束条件

- 限制一：[描述限制]
- 限制二：[描述限制]

## 示例

示例输入：
\`\`\`
[示例输入内容]
\`\`\`

示例输出：
\`\`\`
[示例输出内容]
\`\`\`

## 附加信息

[任何其他相关信息或资源]`);
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

    return (
        <div className="animate-fadeIn">
            {/* 返回按钮和标题 */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <Link
                        href="/prompts"
                        className="inline-flex items-center text-apple-darkGray hover:text-apple-blue transition-colors mr-4"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-1" />
                        <span>返回</span>
                    </Link>
                    <h1 className="title-apple">创建新提示</h1>
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
                <form onSubmit={handleCreatePrompt} className="space-y-6">
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
                                            自定义文件名
                                        </label>
                                        <input
                                            type="text"
                                            value={fileName}
                                            onChange={(e) => setFileName(e.target.value)}
                                            className="input-apple"
                                            placeholder="可选，如不填写将自动生成"
                                        />
                                        <p className="text-xs text-apple-darkGray mt-1">
                                            仅使用字母、数字、连字符和下划线，不需要包含扩展名
                                        </p>
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
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold">提示内容 <span className="text-apple-red">*</span></h2>
                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => generateTemplate('simple')}
                                            className="text-sm text-apple-blue hover:underline"
                                        >
                                            使用简单模板
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => generateTemplate('detailed')}
                                            className="text-sm text-apple-blue hover:underline"
                                        >
                                            使用详细模板
                                        </button>
                                    </div>
                                </div>

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
                                            {rating.toFixed(1)}
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
                                        创建提示
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
                            onClick={handleCreatePrompt}
                            className="btn-apple-primary"
                        >
                            创建提示
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 