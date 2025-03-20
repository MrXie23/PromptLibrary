"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '../lib/i18n';
import { loadTranslation } from '../lib/i18n';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const { locale } = useLanguage();
  const { t, isLoaded: translationsLoaded } = useTranslation();

  useEffect(() => {
    if (translationsLoaded) {
      setIsLoaded(true);
    }
  }, [translationsLoaded]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // 在翻译加载完成前显示基础版本
  if (!isLoaded) {
    return (
      <section className="hero">
        <div className="hero-content">
          <h1>...</h1>
          <p>...</p>
          <div className="search-container">
            <input type="text" disabled />
            <button className="search-button" disabled>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>{t('hero.title')}</h1>
        <p>{t('hero.subtitle')}</p>
        <form className="search-container" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder={t('hero.search_placeholder')}
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