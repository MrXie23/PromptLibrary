import React, { useState, useEffect } from 'react';
import {
    PencilIcon,
    TrashIcon,
    PlusIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { CategoryData } from '@/types';
import {
    getAllCategories,
    addCategory,
    updateCategory,
    deleteCategory
} from '@/lib/categoryUtils';
import { getAllPrompts } from '@/lib/promptUtils';

export default function Categories() {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategorySlug, setNewCategorySlug] = useState('');
    const [newCategoryIcon, setNewCategoryIcon] = useState('fa-tag');
    const [promptsCount, setPromptsCount] = useState<Record<string, number>>({});
    const [error, setError] = useState<string | null>(null);

    // 加载数据
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 获取所有分类
                const allCategories = await getAllCategories();
                setCategories(allCategories);

                // 获取所有提示以计算每个分类的提示数量
                const allPrompts = await getAllPrompts();

                // 统计每个分类的提示数量
                const counts: Record<string, number> = {};

                allPrompts.forEach(prompt => {
                    const category = prompt.category;
                    counts[category] = (counts[category] || 0) + 1;
                });

                setPromptsCount(counts);
            } catch (error) {
                console.error('获取数据时出错:', error);
                setError('加载分类数据失败');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // 处理添加分类
    const handleAddCategory = async () => {
        if (!newCategoryName.trim() || !newCategorySlug.trim()) {
            setError('分类名称和标识不能为空');
            return;
        }

        try {
            // 检查slug是否已存在
            if (categories.some(c => c.slug === newCategorySlug)) {
                setError('分类标识已存在');
                return;
            }

            const success = await addCategory({
                name: newCategoryName,
                slug: newCategorySlug,
                icon: newCategoryIcon
            });

            if (success) {
                // 重新加载分类
                const updatedCategories = await getAllCategories();
                setCategories(updatedCategories);

                // 重置表单
                setNewCategoryName('');
                setNewCategorySlug('');
                setNewCategoryIcon('fa-tag');
                setIsAdding(false);
                setError(null);
            } else {
                setError('添加分类失败');
            }
        } catch (error) {
            console.error('添加分类时出错:', error);
            setError('添加分类时出错');
        }
    };

    // 处理更新分类
    const handleUpdateCategory = async (slug: string) => {
        if (!newCategoryName.trim()) {
            setError('分类名称不能为空');
            return;
        }

        try {
            const success = await updateCategory(slug, {
                name: newCategoryName,
                icon: newCategoryIcon
            });

            if (success) {
                // 重新加载分类
                const updatedCategories = await getAllCategories();
                setCategories(updatedCategories);

                // 重置表单
                setEditingId(null);
                setNewCategoryName('');
                setNewCategoryIcon('');
                setError(null);
            } else {
                setError('更新分类失败');
            }
        } catch (error) {
            console.error('更新分类时出错:', error);
            setError('更新分类时出错');
        }
    };

    // 处理删除分类
    const handleDeleteCategory = async (slug: string, name: string) => {
        const categoryName = categories.find(c => c.slug === slug)?.name;
        const promptCount = promptsCount[categoryName || ''] || 0;

        if (promptCount > 0) {
            if (!confirm(`该分类下有 ${promptCount} 个提示，删除分类会导致这些提示缺少分类信息。确定要删除吗？`)) {
                return;
            }
        } else {
            if (!confirm(`确定要删除分类 "${name}" 吗？`)) {
                return;
            }
        }

        try {
            const success = await deleteCategory(slug);

            if (success) {
                // 从列表中移除已删除的分类
                setCategories(categories.filter(c => c.slug !== slug));
            } else {
                setError('删除分类失败');
            }
        } catch (error) {
            console.error('删除分类时出错:', error);
            setError('删除分类时出错');
        }
    };

    // 开始编辑分类
    const startEditing = (category: CategoryData) => {
        setEditingId(category.slug);
        setNewCategoryName(category.name);
        setNewCategoryIcon(category.icon);
    };

    // 取消编辑或添加
    const cancelAction = () => {
        setEditingId(null);
        setIsAdding(false);
        setNewCategoryName('');
        setNewCategorySlug('');
        setNewCategoryIcon('fa-tag');
        setError(null);
    };

    // 生成slug
    const handleNameChange = (name: string) => {
        setNewCategoryName(name);
        if (isAdding) {
            // 自动生成slug
            setNewCategorySlug(
                name.toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-')
            );
        }
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

    return (
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <h1 className="title-apple">分类管理</h1>

                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="btn-apple-primary flex items-center"
                    >
                        <PlusIcon className="w-5 h-5 mr-1" />
                        <span>新建分类</span>
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
                    <p>{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="text-red-700 hover:text-red-900"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* 添加分类表单 */}
            {isAdding && (
                <div className="card-apple mb-6">
                    <h2 className="text-lg font-semibold mb-4">新建分类</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-apple-darkGray mb-1">
                                分类名称
                            </label>
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="input-apple"
                                placeholder="输入分类名称"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-apple-darkGray mb-1">
                                分类标识
                            </label>
                            <input
                                type="text"
                                value={newCategorySlug}
                                onChange={(e) => setNewCategorySlug(e.target.value)}
                                className="input-apple"
                                placeholder="英文标识，例如: programming"
                            />
                            <p className="text-xs text-apple-darkGray mt-1">
                                用于URL和内部引用的唯一标识符，只能包含小写字母、数字和连字符
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-apple-darkGray mb-1">
                                图标
                            </label>
                            <input
                                type="text"
                                value={newCategoryIcon}
                                onChange={(e) => setNewCategoryIcon(e.target.value)}
                                className="input-apple"
                                placeholder="Font Awesome图标类名，例如: fa-code"
                            />
                            <p className="text-xs text-apple-darkGray mt-1">
                                使用Font Awesome图标类名，格式如"fa-code"
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3 pt-2">
                            <button
                                onClick={cancelAction}
                                className="btn-apple-secondary"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleAddCategory}
                                className="btn-apple-primary"
                            >
                                保存
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 分类列表 */}
            <div className="bg-white rounded-xl shadow-apple-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-apple-darkGray uppercase tracking-wider">
                                    分类名称
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-apple-darkGray uppercase tracking-wider">
                                    标识
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-apple-darkGray uppercase tracking-wider">
                                    图标
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-apple-darkGray uppercase tracking-wider">
                                    提示数量
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-apple-darkGray uppercase tracking-wider">
                                    操作
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map(category => (
                                <tr key={category.slug}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {editingId === category.slug ? (
                                            <input
                                                type="text"
                                                value={newCategoryName}
                                                onChange={(e) => setNewCategoryName(e.target.value)}
                                                className="input-apple py-1"
                                            />
                                        ) : (
                                            <div className="text-sm font-medium text-apple-black">
                                                {category.name}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-apple-darkGray">
                                            {category.slug}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {editingId === category.slug ? (
                                            <input
                                                type="text"
                                                value={newCategoryIcon}
                                                onChange={(e) => setNewCategoryIcon(e.target.value)}
                                                className="input-apple py-1"
                                            />
                                        ) : (
                                            <div className="text-sm text-apple-darkGray">
                                                {category.icon}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-apple-darkGray">
                                            {promptsCount[category.name] || 0}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {editingId === category.slug ? (
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleUpdateCategory(category.slug)}
                                                    className="text-apple-green hover:text-green-700"
                                                    title="保存"
                                                >
                                                    <CheckIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={cancelAction}
                                                    className="text-apple-red hover:text-red-700"
                                                    title="取消"
                                                >
                                                    <XMarkIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    onClick={() => startEditing(category)}
                                                    className="text-apple-blue hover:text-blue-700"
                                                    title="编辑"
                                                >
                                                    <PencilIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(category.slug, category.name)}
                                                    className="text-apple-red hover:text-red-700"
                                                    title="删除"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-apple-darkGray">
                                        暂无分类，点击"新建分类"按钮创建
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 