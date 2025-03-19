"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


// 定义搜索结果类型
interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  path: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const router = useRouter();
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState<any[]>([]);

  // 加载索引文件
  useEffect(() => {
    async function loadIndex() {
      try {
        // 加载静态生成的提示词索引
        const response = await fetch('/prompt-library2/data/prompts-index.json');
        if (!response.ok) throw new Error('Failed to load index');
        const data = await response.json();
        setIndex(data);
      } catch (error) {
        console.error('Error loading index:', error);
      }
    }
    
    loadIndex();
  }, []);

  // 执行搜索
  useEffect(() => {
    if (!query || index.length === 0) return;
    
    async function performSearch() {
      setLoading(true);
      
      try {
        // 首先从索引中筛选可能的匹配项
        const possibleMatches = index.filter(item => 
          item.title?.toLowerCase().includes(query.toLowerCase()) ||
          item.tags?.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
        );
        
        // 加载匹配项的完整内容并进行更详细的搜索
        const searchResults = await Promise.all(
          possibleMatches.map(async (item) => {
            try {
              // 加载提示词文件内容
              const response = await fetch(`/prompt-library2/prompts/${item.slug}.md`);
              if (!response.ok) return null;
              
              const content = await response.text();
              
              // 检查内容是否包含搜索词
              if (content.toLowerCase().includes(query.toLowerCase())) {
                // 创建摘要 - 找到匹配位置周围的文本
                const lowerContent = content.toLowerCase();
                const matchIndex = lowerContent.indexOf(query.toLowerCase());
                const start = Math.max(0, matchIndex - 75);
                const end = Math.min(content.length, matchIndex + query.length + 75);
                const excerpt = (start > 0 ? '...' : '') + 
                                content.substring(start, end) + 
                                (end < content.length ? '...' : '');
                
                return {
                  id: item.slug,
                  title: item.title || item.slug,
                  excerpt,
                  path: `/prompts/${item.slug}`
                };
              }
              return null;
            } catch (error) {
              console.error(`Error processing ${item.slug}:`, error);
              return null;
            }
          })
        );
        
        setResults(searchResults.filter(Boolean) as SearchResult[]);
      } catch (error) {
        console.error('Error during search:', error);
      } finally {
        setLoading(false);
      }
    }
    
    performSearch();
  }, [query, index]);

  // 处理搜索表单提交
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('q')?.toString() || '';
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">搜索结果</h1>
      
      {/* 搜索表单 */}
      <form className="mb-8" onSubmit={handleSubmit}>
        <div className="flex">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="搜索提示词..."
            className="flex-grow p-2 border rounded-l"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition-colors"
          >
            搜索
          </button>
        </div>
      </form>
      
      {/* 搜索结果 */}
      {loading ? (
        <div className="text-center py-8">
          <p>正在搜索...</p>
        </div>
      ) : (
        <div>
          {results.length > 0 ? (
            <>
              <p className="mb-4">找到 {results.length} 个结果：</p>
              <div className="space-y-6">
                {results.map(result => (
                  <div key={result.id} className="border p-4 rounded shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-semibold mb-2">
                      <Link href={result.path} className="text-blue-600 hover:underline">
                        {result.title}
                      </Link>
                    </h2>
                    <p className="text-gray-700">{result.excerpt}</p>
                    <Link href={result.path} className="mt-2 inline-block text-blue-500 hover:underline">
                      查看完整提示词 →
                    </Link>
                  </div>
                ))}
              </div>
            </>
          ) : query ? (
            <p className="text-center py-8 text-gray-600">未找到匹配的提示词</p>
          ) : null}
        </div>
      )}
    </div>
  );
}