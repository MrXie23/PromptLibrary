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

// 定义索引项类型
interface IndexItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
}

// 清理HTML标签的函数
function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '');
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const router = useRouter();

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState<IndexItem[]>([]);

  // 加载索引文件
  useEffect(() => {
    async function loadIndex() {
      console.log('尝试加载索引文件...');
      try {
        // 使用绝对路径加载索引文件
        const baseUrl = window.location.origin;
        const indexUrl = `${baseUrl}/PromptLibrary/data/prompts-index.json`;
        console.log('加载URL:', indexUrl);

        const response = await fetch(indexUrl);
        if (!response.ok) {
          console.error('索引文件加载失败:', response.status, response.statusText);
          throw new Error(`Failed to load index: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('索引数据加载成功:', data);
        setIndex(data);
      } catch (error) {
        console.error('加载索引时出错:', error);
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
        const possibleMatches = index.filter(item => {
          // 确保 item.slug 是一个有效的字符串，并且不包含 HTML
          if (!item.slug || typeof item.slug !== 'string' || item.slug.includes('<')) {
            console.log('Invalid slug:', item);
            return false;
          }
          return item.title?.toLowerCase().includes(query.toLowerCase()) ||
            item.tags?.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()));
        });

        console.log('匹配的项目:', possibleMatches);

        // 直接使用索引中的数据
        const searchResults = possibleMatches.map(item => {
          console.log('处理搜索结果项目:', item);
          console.log('该项目的description:', item.description);

          const result = {
            id: item.slug,
            title: item.title,
            excerpt: item.description || '暂无描述',
            path: `/prompts/${item.slug}`
          };

          console.log('生成的搜索结果项:', result);
          return result;
        });

        console.log('最终搜索结果:', searchResults);
        setResults(searchResults);
      } catch (error) {
        console.error('搜索过程中出错:', error);
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
    <div className="container mx-auto px-4 py-6">
      <div className="search-page-header">
        <h1 className="search-title">搜索结果</h1>
        {query && <p className="search-query">搜索："{query}"</p>}
      </div>

      {/* 搜索表单 */}
      <form className="mb-6" onSubmit={handleSubmit}>
        <div className="search-container">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="搜索提示词..."
            className="flex-grow p-3 rounded-l-full"
          />
          <button
            type="submit"
            className="search-button"
            aria-label="搜索"
          >
            搜索
          </button>
        </div>
      </form>

      {/* 搜索结果 */}
      {loading ? (
        <div className="loading-container">
          <div className="loading">
            <div className="spinner"></div>
            <p>正在搜索...</p>
          </div>
        </div>
      ) : (
        <div>
          {results.length > 0 ? (
            <>
              <p className="search-results-count">找到 {results.length} 个结果</p>
              <div className="search-results">
                {results.map(result => (
                  <div key={result.id} className="prompt-card">
                    <h2 className="prompt-card-title">
                      <Link href={result.path} className="prompt-title-link">
                        {result.title}
                      </Link>
                    </h2>
                    <p className="prompt-card-excerpt">{result.excerpt}</p>
                    <Link href={result.path} className="view-button">
                      查看完整提示词
                    </Link>
                  </div>
                ))}
              </div>
            </>
          ) : query ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 21L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="empty-title">未找到匹配的提示词</p>
              <p className="empty-description">尝试使用其他关键词或浏览<Link href="/categories" className="text-link">分类</Link>查找</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}