"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>发现最佳AI提示词</h1>
        <p>探索、使用并分享经过精心策划的提示词库，释放AI的全部潜力</p>
        <form className="search-container" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="搜索提示词..." 
            id="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </form>
      </div>
    </section>
  );
}